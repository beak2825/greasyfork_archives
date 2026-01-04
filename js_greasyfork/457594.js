// ==UserScript==
// @name         [NEW UPDATE] ＴｕｓＤｉｎｏ || BEST CHROME DINO GAME T-REX MOD MENU HACK CHEAT - (0.17.4)
// @namespace    https://github.com/nonumbershere/TusDino
// @homepageURL  https://github.com/Fault-Utilities/TusDino-Chrome-Dino-Mod-Menu/
// @supportURL   https://github.com/Fault-Utilities/TusDino-Chrome-Dino-Mod-Menu/issues
// @homepage     https://discord.gg/6eaDrx5J9s
// @version      0.17.4
// @dark-mode    no        -  Enables or disables if you want to active the dark mode instantly when loading the page (on/off)
// @show-discord no        -  Shows or hides the discord alert message on the start (yes/no)
// @description  THE BEST CHROME DINO HACK: SET SPEED, KILL PLAYER, ESP EXPLOIT, NO-CLIP, TRACERS, TELEPORT, FLY +MORE EXPLOITS
// @author       Lapide (nonumbershere)
// @license      MIT
// @match        *://chromedino.com/*
// @match        *://dino-chrome.com/*
// @match        *://tuckercraig.com/dino/*
// @match        *://elgoog.im/t-rex/*
// @match        *://offline-dino-game.firebaseapp.com/
// @match        *://www.dinogame.net/*
// @match        *://elgoog.im/t-rex/v2/*
// @match        *://nointernetgame.com/*
// @match        *://chromedino.io/
// @match        *://trex-runner.com/*
// @match        *://fivesjs.skipser.com/trex-game/
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @icon         https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/assets/Logo.png?raw=true
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/457594/%5BNEW%20UPDATE%5D%20%EF%BC%B4%EF%BD%95%EF%BD%93%EF%BC%A4%EF%BD%89%EF%BD%8E%EF%BD%8F%20%7C%7C%20BEST%20CHROME%20DINO%20GAME%20T-REX%20MOD%20MENU%20HACK%20CHEAT%20-%20%280174%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457594/%5BNEW%20UPDATE%5D%20%EF%BC%B4%EF%BD%95%EF%BD%93%EF%BC%A4%EF%BD%89%EF%BD%8E%EF%BD%8F%20%7C%7C%20BEST%20CHROME%20DINO%20GAME%20T-REX%20MOD%20MENU%20HACK%20CHEAT%20-%20%280174%29.meta.js
// ==/UserScript==

// NOTE: THE MOST SUPPORTED SITE IS: chromedino.com
// THE SCRIPT MIGHT BE BUGGY ON OTHERS

/*
Slight UI Change: Make texts bolder & Changed the toggle boxs font color to be easier to read
Changed tab: Others to Miscs
Added What News alert
Added Set Double Dino Size
Added Continue Death
Added Auto Continue Death
Added Set Jump Height
Added Set Drop Velocity
Added Version Checker & Multiple Script Detection
Removed a few supported pages
*/

(function () {
    // Sorry if the code is a bit bad or unreadable, just trying to code as easy as possible
    var window = unsafeWindow;
    var isGithub = false;
    var isGreasyfork = true;
    // This code get custom variables from metablocks
     window.getMetablockData = function getMetablockData() {
        var jj = GM_info.scriptMetaStr;
        var m = jj.slice(18, jj.length - 19)
        m = m.split('\n');
        var f = '';
        for (var i1 = 0; i1 < m.length; ++i1) {
            f += m[i1].replace('// ', '') + '\n';
        }
        f = f.slice(0, f.length - 1).split('\n')
        var mm = [];
        for (var i = 0; i < f.length; ++i) {
            var unk = {};
            unk.data = (f[i].replace(f[i].split(' ')[0], '').replace(f[i].replace(f[i].split(' ')[0], '').slice(0, f[i].replace(f[i].split(' ')[0], '').indexOf(f[i].replace(f[i].split(' ')[0], '').replaceAll(' ', '')[0]), ''), ''));
            unk.block = (f[i].replace('@', '').split(' ')[0]);
            mm.push(unk)
        }
        return mm;
    }

    // Duplicate script detection
    function generateRandomNumber() {
        return Math.floor(Math.random() * 1000000000).toString() + Math.floor(Math.random() * 1000000000).toString() + Math.floor(Math.random() * 1000000000).toString() + Math.floor(Math.random() * 1000000000).toString() + Math.floor(Math.random() * 1000000000).toString();
    }
    if (!window.calledDetection) window.calledDetection = false;
    if (window.usingTusdino && window.usingTusdino.t && window.tusdinoType && !window.calledDetection) {
        if (!window.calledDetection) alert("We detected there "+(tusdinoType > 1 ? "are" : "is") + " "+ tusdinoType + " duplicate script"+(tusdinoType > 1 ? "s" : "")+" of Tusdino, please delete all of them and install the latest version to avoid confusion and bugs.");
        window.calledDetection = true;
    }
    var myId = btoa(generateRandomNumber());
    window.usingTusdino = {t: true, version: GM_info.script.version, id: myId};
    if (!window._tusdinos) window._tusdinos = [];
    window._tusdinos.push(usingTusdino);
    if (!window.tusdinoType) window.tusdinoType = 0;
    ++tusdinoType;
    if (!window.calledDetection || isLatestVersion) {

        // After script detection
        console.log("Running Tusdino...");
        var showDiscord = ((typeof getMetablockData().find((t) => t.block == 'show-discord') != typeof undefined) ? (getMetablockData().find((t) => t.block == 'show-discord').data.startsWith('y')) : (true));;
        var info_ = GM_info;

        // Loading
        var supported = ['chromedino.com', 'dino-chrome.com', 'tuckercraig.com/dino', 'elgoog.im/t-rex', 'www.dinogame.net', 'elgoog.im/t-rex/v2', 'nointernetgame.com', 'chromedino.io', 'trex-runner.com', 'fivesjs.skipser.com/trex-game'];
        function isSupported(gameUrl) {
            return supported[gameUrl]
        }
        var whatsnewpage = `/pointSlight UI Change: Make texts bolder & Changed the toggle boxs font color to be easier to read/point-end/pointChanged tab: Others to Miscs/point-end/pointAdded What News alert/point-end/pointAdded Set Double Dino Size/point-end/pointAdded Continue Death/point-end/point Added Auto Continue Death/point-end/pointAdded Set Jump Height/point-end/pointAdded Set Drop Velocity/point-end/point Added Version Checker & Multiple Script Detection/point-end/point Removed a few supported pages/point-end`;
        var imageContinue = new Image(60,45);
        imageContinue.src='https://cdn.discordapp.com/attachments/1091299425277714502/1093634225351168020/continue.png';

        // Cheat
        var docoldEv = document.addEventListener;
        var winoldEv = window.addEventListener;

        function cont() {
            if (typeof Runner != typeof undefined) {
                function applyScript(src) {
                    var b = document.createElement("script");
                    b.src = src;
                    document.body.append(b);
                    b.remove();
                }
                const HSLToRGB = (h, s, l) => {
                    s /= 100;
                    l /= 100;
                    const k = (n) => (n + h / 30) % 12;
                    const a = s * Math.min(l, 1 - l);
                    const f = (n) =>
                    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
                    return [255 * f(0), 255 * f(8), 255 * f(4)];
                };
                applyScript("https://cdn.jsdelivr.net/npm/toastify-js");
                applyScript(
                    "https://raw.githubusercontent.com/Fault-Utilities/TusDino-Chrome-Dino-Mod-Menu/main/assets/autorun.js"
                );
                var oldKeyDown = Runner.instance_.onKeyDown;
                var oldstartJump = Runner.instance_.tRex.startJump;
                // Addons
                var npso = 0;
                Runner.instance_.gameOver = function() {
                    this.playSound(this.soundFx.HIT);
                    vibrate(200);
                    this.stop();
                    this.crashed = true;
                    this.distanceMeter.acheivement = false;
                    var cscr = document.getElementById("currentScore");
                    cscr.innerText = currentScore;
                    var sb = document.getElementById("shareBlock");
                    sb.style.display = 'none'; // block
                    this.tRex.update(100, Trex.status.CRASHED);
                    if (!this.gameOverPanel) {
                        this.gameOverPanel = new GameOverPanel(this.canvas, this.spriteDef.TEXT_SPRITE, this.spriteDef.RESTART, this.dimensions)
                    } else {
                        this.gameOverPanel.draw()
                    }
                    if (this.distanceRan > this.highestScore) {
                        this.highestScore = Math.ceil(this.distanceRan);
                        this.distanceMeter.setHighScore(this.highestScore);
                        currentScore = Math.round(this.highestScore * 0.025);
                        cscr.innerText = currentScore;
                        var score_d = 0;
                        if (document.getElementById("score-5") !== null) {
                            score_d = document.getElementById("score-5").innerHTML
                        }
                        if (currentScore > score_d) {
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', '/inc/check.php?score=' + currentScore, false);
                            xhr.send();
                            if (xhr.status != 200) {} else {
                                if (xhr.responseText != '') {
                                    if (user_name == '') {
                                        user_name = prompt(xhr.responseText, 'Anonym');
                                        if (user_name == 'null' || user_name == '') {
                                            user_name = 'Anonym'
                                        }
                                    } else {
                                        alert(xhr.responseText)
                                    }
                                    xhr.open('GET', '/inc/set.php?name=' + user_name + '&score=' + currentScore, false);
                                    xhr.send();
                                    //location.reload()
                                }
                            }
                        }
                    }
                    this.time = getTimeStamp()
                }
                unsafeWindow.tusdino = {
                    cheats: {
                        autoplayer: false
                        , autoContinueDeath: false
                        , fly: false
                        , walk: false
                        , size: 1
                        , allowFlyMode: false
                        , rainbowSquarePlayer: false
                        , esp: false
                        , objectEsp: false
                        , tracer: false
                        , notifier: false
                        , instantrespawn: false
                        , noobstacles: false
                        , arc: false
                        , autofocus: false
                        , glide: false
                        , invisibility: false
                        , noclip: false
                        , obstacleBypass: false
                        , obstacleFloat: false
                        , duckAndJump: false
                        , glow: false
                        , bhop: false
                        , rainbowglow: false
                        , obliterate: false
                        , mute: false
                        , forcepause: false
                        , stormcloud: false
                        , airjump: false
                        , duckjump: false
                        , watermark: true
                        , lazervisual: false
                        , lazer: false
                        , lazerv: false
                        , }
                    , whatsnew: function(isOld) {
                tusdino.alert(" /color^#CF9FFF^What's new/color-end in the /color^#855dff^ TusDino/color-end /color^lightblue^ Update /color-end /color^dodgerblue^ "+tusdino.info.version+" /color-end", whatsnewpage)
            },
                        alert: function alert_(
                    title = ""
                     , description = ""
                     , alertonclick = function () {}
                    ) {
                        tusdino.logs.success("Showing alert box (" + title + ")");
                        var styl = document.createElement("style");
                        styl.innerHTML =
                            "*:not(body,head,center,script,html,.alertbox,#pages,.standard-nav,#loading,#menu,.alertbox *) {filter:blur(1px);pointer-events:none}";
                        document.body.append(styl);
                        var i = document.createElement("div");
                        ++npso;
                        i.className = "alertbox";
                        // Replace every "\n" with "<br>" in the description and title
                        description = description.replace(/\n/g, "<br>");
                        title = title.replace(/\n/g, "<br>");

                        // Replace every "/color^" with "<label class='alertbox' style='color: *color*'>" and every "/color-end" with "</label>"
                        description = description.replace(
                            /\/color\^(.*?)\^/g
                            , "<label class='alertbox' style='color: $1'>"
                        );
                        description = description.replace(/\/color-end/g, "</label>");
                        title = title.replace(
                            /\/color\^(.*?)\^/g
                            , "<label class='alertbox' style='color: $1'>"
                        );
                        title = title.replace(/\/color-end/g, "</label>");

                        // Make * a bullington point
                        // description = description.replace(/(?<!\\)(?<!\/ignore)\/ignore\*($|[^/]|\/$)|(?<!\/ignore)(?<!\\)\*(?!\/ignore)/g, '<li>');
                        description = description.replace(
                            /\/point(.*?)\/point-end/g
                            , "<li>$1</li>"
                        );

                        // Replace every "/bgcolor^" with "<label class='alertbox' style='background-color: *color*'>" and every "/bgcolor-end" with "</label>"
                        description = description.replace(
                            /\/bgcolor\^(.*?)\^/g
                            , "<label class='alertbox' style='background-color: $1'>"
                        );
                        description = description.replace(/\/bgcolor-end/g, "</label>");
                        title = title.replace(
                            /\/bgcolor\^(.*?)\^/g
                            , "<label class='alertbox' style='background-color: $1'>"
                        );
                        title = title.replace(/\/bgcolor-end/g, "</label>");

                        // Replace every "italic>" with "<i class='alertbox'>" and every "<italic" with "</i>"
                        description = description.replace(/italic>/g, "<i class = 'alertbox'>");
                        description = description.replace(/<italic/g, "</i>");
                        title = title.replace(/italic>/g, "<i class = 'alertbox'>");
                        title = title.replace(/<italic/g, "</i>");

                        // Replace every "url-" with "<a target="blank" class='alertbox' href='https://" and every ">" after that with "'>"
                        description = description.replace(/url-(.*?)>/g, "<a target='blank' class='alertbox aalertbox' href='https://$1'>");
                        title = title.replace(/url-(.*?)>/g, "<a target='blank' class='alertbox aalertbox' href='https://$1'>");

                        // Replace every "<url" with "</a>"
                        description = description.replace(/<url/g, "</a>");
                        title = title.replace(/<url/g, "</a>");
                        description = "<div>" + description + "</div>";
                        i.innerHTML = `<div class="alertbox" style="

    border-radius: 16px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    position: fixed;
    font-weight: bolder;
    z-index: 10000000;
    transform-origin: center center;
    width: 782px;
    color: white;
    background: #2c4470;
    border: solid 0.1px blue;
"><br><center><h3 class="alertbox" style="
    font-size: 33px;
    margin:0;
">${title}</h3></center><center><hr class="alertbox" style="
    width: 180px;
    border-color: #ffffff;
"></center><br>    <center><div class="alertbox alertboxbox" style="
    font-size: 20px;
"><p class = "alertbox" style = "width: 509px;font-size: 19px">${description}</p><button class="alertbox" style="
    background: #3737a9;
    border: none;
    margin-top: 20px;
    padding: 13px;
    color: white;
    font-size: 18px;
    border-radius: 11px;
    padding-right: 36px;
    padding-left: 36px;
    font-weight:bolder;
    cursor: pointer;
" id="remover${npso}">OK</button></div><br></center></div>`;
                        document.body.append(i);
                        i.style.left = innerWidth - (250 * 6 - 50) + "px";
                        document
                            .getElementById("remover" + npso)
                            .addEventListener("click", function () {
                            styl.remove();
                            i.remove();
                            alertonclick();
                        });
                    }
                    , hacked: {
                        saveGameOver: function() {
                            this.playSound(this.soundFx.HIT);
                            vibrate(200);
                            this.stop();
                            this.crashed = true;
                            tusdino.modules.isDead = true;
                            this.distanceMeter.acheivement = false;
                            var cscr = document.getElementById("currentScore");
                            cscr.innerText = currentScore;
                            var sb = document.getElementById("shareBlock");
                            sb.style.display = "none"; // block
                            this.tRex.update(100, Trex.status.CRASHED);
                            if (!this.gameOverPanel) {
                                this.gameOverPanel = new GameOverPanel(
                                    this.canvas
                                    , this.spriteDef.TEXT_SPRITE
                                    , this.spriteDef.RESTART
                                    , this.dimensions
                                );
                            } else {
                                this.gameOverPanel.draw();
                            }
                            if (this.distanceRan > this.highestScore) {
                                this.highestScore = Math.ceil(this.distanceRan);
                                this.distanceMeter.setHighScore(this.highestScore);
                                currentScore = Math.round(this.highestScore * 0.025);
                                try {
                                    cscr.innerText = currentScore;
                                } catch (e) {}
                                var score_d = 0;
                                if (document.getElementById("score-5") !== null) {
                                    score_d = document.getElementById("score-5").innerHTML;
                                }
                                try {
                                    if (currentScore > score_d) {
                                        var xhr = new XMLHttpRequest();
                                        xhr.open(
                                            "GET"
                                            , "/inc/check.php?score=" + currentScore
                                            , false
                                        );
                                        xhr.send();
                                        if (xhr.status != 200) {} else {
                                            if (xhr.responseText != "") {
                                                if (user_name == "") {
                                                    user_name = prompt(xhr.responseText, "Anonym");
                                                    if (user_name == "null" || user_name == "") {
                                                        user_name = "Anonym";
                                                    }
                                                } else {
                                                    alert(xhr.responseText);
                                                }
                                                xhr.open(
                                                    "GET"
                                                    , "/inc/set.php?name=" +
                                                    user_name +
                                                    "&score=" +
                                                    currentScore
                                                    , false
                                                );
                                                xhr.send();
                                                //location.reload()
                                            }
                                        }
                                    }
                                } catch (e) {}
                            }
                            this.time = getTimeStamp();
                        },
                        Trex: function (canvas, spritePos) {
                            this.canvas = canvas;
                            this.canvasCtx = canvas.getContext("2d");
                            this.spritePos = this.spritePos || spritePos;
                            this.xPos = this.xPos || 0;
                            this.yPos = this.yPos || 0;
                            this.groundYPos = this.groundYPos || 0;
                            this.currentFrame = this.currentFrame || 0;
                            this.currentAnimFrames = this.currentAnimFrames || [];
                            this.blinkDelay = this.blinkDelay || 0;
                            this.animStartTime = this.animStartTime || 0;
                            this.timer = 0;
                            this.msPerFrame = 1000 / FPS;
                            this.config = tusdino.hacked.Trex.config;
                            this.status = tusdino.hacked.Trex.status.WAITING;
                            this.jumping = false;
                            this.ducking = false;
                            this.jumpVelocity = 0;
                            this.reachedMinHeight = false;
                            this.speedDrop = false;
                            this.jumpCount = 0;
                            this.jumpspotX = 0;
                            this.init();
                        }
                        , gameOver: function () {
                            if (!tusdino.cheats.noclip) {
                                tusdino.modules.isDead = true;
                                if (tusdino.cheats.instantContinue && tusdino.modules.isDead) {
                                    Runner.instance_.horizon.obstacles=[];
                                    Runner.instance_.setSpeed(Runner.instance_.config.SPEED);
                                    Runner.instance_.activated = true;
                                    Runner.instance_.crashed = false;
                                    Runner.instance_.tRex.reset();
                                    Ruuner.instance_.tRex.startJump(0.5);
                                    tusdino.modules.isDead = false;
                                }
                                this.playSound(this.soundFx.HIT);
                                vibrate(200);
                                this.stop();
                                this.crashed = true;
                                this.distanceMeter.acheivement = false;
                                var cscr = document.getElementById("currentScore");
                                cscr.innerText = currentScore;
                                var sb = document.getElementById("shareBlock");
                                sb.style.display = "none"; // block
                                this.tRex.update(100, Trex.status.CRASHED);
                                if (!this.gameOverPanel) {
                                    this.gameOverPanel = new GameOverPanel(
                                        this.canvas
                                        , this.spriteDef.TEXT_SPRITE
                                        , this.spriteDef.RESTART
                                        , this.dimensions
                                    );
                                } else {
                                    this.gameOverPanel.draw();
                                }
                                if (this.distanceRan > this.highestScore) {
                                    this.highestScore = Math.ceil(this.distanceRan);
                                    this.distanceMeter.setHighScore(this.highestScore);
                                    currentScore = Math.round(this.highestScore * 0.025);
                                    try {
                                        cscr.innerText = currentScore;
                                    } catch (e) {}
                                    var score_d = 0;
                                    if (document.getElementById("score-5") !== null) {
                                        score_d = document.getElementById("score-5").innerHTML;
                                    }
                                    try {
                                        if (currentScore > score_d) {
                                            var xhr = new XMLHttpRequest();
                                            xhr.open(
                                                "GET"
                                                , "/inc/check.php?score=" + currentScore
                                                , false
                                            );
                                            xhr.send();
                                            if (xhr.status != 200) {} else {
                                                if (xhr.responseText != "") {
                                                    if (user_name == "") {
                                                        user_name = prompt(xhr.responseText, "Anonym");
                                                        if (user_name == "null" || user_name == "") {
                                                            user_name = "Anonym";
                                                        }
                                                    } else {
                                                        alert(xhr.responseText);
                                                    }
                                                    xhr.open(
                                                        "GET"
                                                        , "/inc/set.php?name=" +
                                                        user_name +
                                                        "&score=" +
                                                        currentScore
                                                        , false
                                                    );
                                                    xhr.send();
                                                    //location.reload()
                                                }
                                            }
                                        }
                                    } catch (e) {}
                                }
                                this.time = getTimeStamp();
                                if (tusdino.cheats.instantrespawn) {
                                    this.restart();
                                }
                            }
                        },

                        Obstacle: function (
                        canvasCtx
                            , type
                            , spriteImgPos
                            , dimensions
                            , gapCoefficient
                            , speed
                        ) {
                            this.canvasCtx = canvasCtx;
                            this.spritePos = spriteImgPos;
                            this.typeConfig = type;
                            this.gapCoefficient = gapCoefficient;
                            this.size = getRandomNum(1, Obstacle.MAX_OBSTACLE_LENGTH);
                            this.dimensions = dimensions;
                            this.remove = false;
                            this.xPos = 0;
                            this.yPos = 0;
                            this.width = 0;
                            this.collisionBoxes = [];
                            this.gap = 0;
                            this.speedOffset = 0;
                            this.currentFrame = 0;
                            this.timer = 0;
                            this.init(speed);
                        }
                        , DistanceMeter: function DistanceMeter(
                        canvas
                            , spritePos
                            , canvasWidth
                        ) {
                            this.canvas = canvas;
                            this.canvasCtx = canvas.getContext("2d");
                            this.image = Runner.imageSprite;
                            this.spritePos = spritePos;
                            this.x = 0;
                            this.y = 5;
                            this.currentDistance = 0;
                            this.maxScore = 0;
                            this.highScore = 0;
                            this.container = null;
                            this.digits = [];
                            this.acheivement = false;
                            this.defaultString = "";
                            this.flashTimer = 0;
                            this.flashIterations = 0;
                            this.config = DistanceMeter.config;
                            this.maxScoreUnits = this.config.MAX_DISTANCE_UNITS;
                            this.init(canvasWidth);
                        }
                        , Horizon: function Horizon(
                        canvas
                            , spritePos
                            , dimensions
                            , gapCoefficient
                        ) {
                            this.canvas = canvas;
                            this.canvasCtx = this.canvas.getContext("2d");
                            this.config = Horizon.config;
                            this.dimensions = dimensions;
                            this.gapCoefficient = gapCoefficient;
                            this.obstacles = [];
                            this.obstacleHistory = [];
                            this.horizonOffsets = [0, 0];
                            this.cloudFrequency = this.config.CLOUD_FREQUENCY;
                            this.spritePos = spritePos;
                            this.clouds = [];
                            this.cloudSpeed = this.config.BG_CLOUD_SPEED;
                            this.horizonLine = null;
                            this.init();
                        }
                        , }
                    , onclick: function (id, func) {
                        console.log("Applying click to: " + id);
                        document.getElementById(id).addEventListener("click", function (e) {
                            func(e);
                        });
                        document.getElementById(id).addEventListener("focus", function () {
                            this.blur();
                        });
                    }
                    , saved: {
                        clearCanvas: Runner.instance_.clearCanvas
                        , gameOver: Runner.instance_.gameOver
                        , update: Runner.instance_.update
                        , startGame: Runner.instance_.startGame
                        , trexDraw: Runner.instance_.tRex.draw
                        , playSound: Runner.instance_.playSound
                        , addNewObstacle: Runner.instance_.horizon.addNewObstacle
                        , CACTUS_LARGE: (Runner.instance_.horizon.spritePos && Runner.instance_.horizon.spritePos.CACTUS_LARGE || null)
                        , CACTUS_SMALL: (Runner.instance_.horizon.spritePos && Runner.instance_.horizon.spritePos.CACTUS_SMALL || null)
                        , PTERODACTYL: (Runner.instance_.horizon.spritePos && Runner.instance_.horizon.spritePos.PTERODACTYL || null)
                        , TREX: (Runner.instance_.horizon.spritePos && Runner.instance_.horizon.spritePos.TREX || null)
                        , }
                    , modules: {
                        onGround: false
                        , isPlaying: false
                        , isDead: false
                        , }
                    , msg: function (text) {
                        Toastify({
                            text: text
                            , duration: 2000
                            , close: true
                            , gravity: "bottom", // `top` or `bottom`
                            position: "left", // `left`, `center` or `right`
                            stopOnFocus: true, // Prevents dismissing of toast on hover
                            style: {
                                background: "#343434"
                                , }
                            , onClick: function () {}, // Callback after click
                        }).showToast();
                    }
                    , setclick: function (id, func) {
                        document.getElementById(id, function (e) {
                            func(e);
                        });
                    }
                    , config: {
                        hotkeys: {
                            togglemenu: "j"
                            , }
                        , }
                    , logs: {
                        sent: []
                        , default: function (text) {
                            console.log(
                                "%c[" + "%cTusDino" + "%c] " + "%c" + text
                                , "color: #2b6eba"
                                , "color: #2ba5ba"
                                , "color: #2b6eba"
                                , "color: white"
                            );
                            this.sent.push({
                                type: "default"
                                , text: text
                                , });
                        }
                        , success: function (text) {
                            console.log(
                                "%c[" + "%cTusDinoSuccess" + "%c] " + "%c" + text
                                , "color: #58ba2b"
                                , "color: #2bba62"
                                , "color: #58ba2b"
                                , "color: white"
                            );
                            this.sent.push({
                                type: "success"
                                , text: text
                                , });
                        }
                        , error: function (text) {
                            console.log(
                                "%c[" + "%cTusDinoError" + "%c] " + "%c" + text
                                , "color: #ba2b2b"
                                , "color: #ba402b"
                                , "color: #ba2b2b"
                                , "color: white"
                            );
                            this.sent.push({
                                type: "error"
                                , text: text
                                , });
                        }
                        , }
                    , info: {
                        getItem: GM_getValue,
                        setItem: GM_setValue,
                        version: info_.script.version
                        , description: info_.script.description
                        , }
                    , };

                fetch('https://raw.githubusercontent.com/Fault-Utilities/TusDino-Chrome-Dino-Mod-Menu/main/version').then((text)=>{return text.text()}).then((txt)=>{
                    if (txt.replaceAll('\n','') != tusdino.info.version) {
                        var i = confirm("[NEW UPDATE] There's a new TusDino version ("+txt.replaceAll('\n', '')+"), would you like to update now?\n\nYou can check what's new here: https://github.com/Fault-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/whatsnew.md");
                        if (i) {
                            alert("Please delete your current script");
                            if (isGreasyfork) open("https://greasyfork.org/en/scripts/457594-%EF%BD%94%EF%BD%95%EF%BD%93%EF%BD%84%EF%BD%89%EF%BD%8E%EF%BD%8F-best-chrome-dino-game-t-rex-mod-menu-cheat-0-17-0");
                            if (isGithub) open("https://github.com/Fault-Utilities/TusDino-Chrome-Dino-Mod-Menu/raw/main/tusdino.user.js");
                        } else {
                            alert("Okay, we'll ask you next time you!");
                        }
                        tusdino.logs.error("Mismatched versions, need to update");
                    } else {
                        tusdino.logs.success("Matched version");
                    }
                });
                var d = document.createElement("link");
                d.href = "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css";

                function getRandomNum(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }

                const ver = tusdino.info.version;
                const splitString = ver.split(".");

                // got from https://github.com/omichelsen/compare-versions/blob/main/src/index.ts
                const compareVersions = (v1, v2) => {
                    const n1 = validateAndParse(v1)
                    const n2 = validateAndParse(v2)

                    const p1 = n1.pop()
                    const p2 = n2.pop()

                    const r = compareSegments(n1, n2)
                    if (r !== 0) return r

                    if (p1 && p2) {
                        return compareSegments(p1.split("."), p2.split("."))
                    } else if (p1 || p2) {
                        return p1 ? -1 : 1
                    }

                    return 0
                }

                const validate = version =>
                typeof version === "string" && /^[v\d]/.test(version) && semver.test(version)

                const compare = (v1, v2, operator) => {
                    assertValidOperator(operator)
                    const res = compareVersions(v1, v2)

                    return operatorResMap[operator].includes(res)
                }

                const satisfies = (version, range) => {
                    if (range.includes("||")) {
                        return range.split("||").some(r => satisfies(version, r))
                    } else if (range.includes(" ")) {
                        return range
                            .trim()
                            .replace(/\s{2,}/g, " ")
                            .split(" ")
                            .every(r => satisfies(version, r))
                    }

                    const m = range.match(/^([<>=~^]+)/)
                    const op = m ? m[1] : "="

                    if (op !== "^" && op !== "~") return compare(version, range, op)

                    const [v1, v2, v3, , vp] = validateAndParse(version)
                    const [r1, r2, r3, , rp] = validateAndParse(range)
                    const v = [v1, v2, v3]
                    const r = [r1, r2 ?? "x", r3 ?? "x"]

                    if (rp) {
                        if (!vp) return false
                        if (compareSegments(v, r) !== 0) return false
                        if (compareSegments(vp.split("."), rp.split(".")) === -1) return false
                    }

                    const nonZero = r.findIndex(v => v !== "0") + 1

                    const i = op === "~" ? 2 : nonZero > 1 ? nonZero : 1

                    if (compareSegments(v.slice(0, i), r.slice(0, i)) !== 0) return false

                    if (compareSegments(v.slice(i), r.slice(i)) === -1) return false

                    return true
                }

                const semver = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i

                const validateAndParse = version => {
                    if (typeof version !== "string") {
                        throw new TypeError("Invalid argument expected string")
                    }
                    const match = version.match(semver)
                    if (!match) {
                        throw new Error(`Invalid argument not valid semver ('${version}' received)`)
                    }
                    match.shift()
                    return match
                }

                const isWildcard = s => s === "*" || s === "x" || s === "X"

                const tryParse = v => {
                    const n = parseInt(v, 10)
                    return isNaN(n) ? v : n
                }

                const forceType = (a, b) =>
                typeof a !== typeof b ? [String(a), String(b)] : [a, b]

                const compareStrings = (a, b) => {
                    if (isWildcard(a) || isWildcard(b)) return 0
                    const [ap, bp] = forceType(tryParse(a), tryParse(b))
                    if (ap > bp) return 1
                    if (ap < bp) return -1
                    return 0
                }

                const compareSegments = (a, b) => {
                    for (let i = 0; i < Math.max(a.length, b.length); i++) {
                        const r = compareStrings(a[i] || "0", b[i] || "0")
                        if (r !== 0) return r
                    }
                    return 0
                }

                const operatorResMap = {
                    ">": [1],
                    ">=": [0, 1],
                    "=": [0],
                    "<=": [-1, 0],
                    "<": [-1],
                    "!=": [-1, 1]
                }

                const allowedOperators = Object.keys(operatorResMap)

                const assertValidOperator = op => {
                    if (typeof op !== "string") {
                        throw new TypeError(
                            `Invalid operator type, expected string but got ${typeof op}`
                        )
                    }
                    if (allowedOperators.indexOf(op) === -1) {
                        throw new Error(
                            `Invalid operator, expected one of ${allowedOperators.join("|")}`
                        )
                    }
                }

                window.compareVersions = compareVersions;

                tusdino.info.setItem("newversion",splitString.join('.'))
                if (!tusdino.info.getItem("oldversion")) tusdino.info.setItem("oldversion", '0.00.0')

                if (compareVersions(tusdino.info.getItem("newversion"), tusdino.info.getItem("oldversion")) > 0) {
                    tusdino.whatsnew();
                    var newver = tusdino.info.getItem("newversion");
                    tusdino.info.setItem("oldversion", newver)
                } else if (compareVersions(tusdino.info.getItem("newversion"), tusdino.info.getItem("oldversion")) < 0) {
                    tusdino.whatsnew(true);
                    var newver = tusdino.info.getItem("newversion");
                    tusdino.info.setItem("oldversion", newver)
                }

                function vibrate(duration) {
                    if (IS_MOBILE && window.navigator.vibrate) {
                        window.navigator.vibrate(duration);
                    }
                }

                function createCanvas(container, width, height, opt_classname) {
                    var canvas = document.createElement("canvas");
                    canvas.className = opt_classname ?
                        Runner.classes.CANVAS + " " + opt_classname :
                    Runner.classes.CANVAS;
                    canvas.width = width;
                    canvas.height = height;
                    container.appendChild(canvas);
                    return canvas;
                }

                function decodeBase64ToArrayBuffer(base64String) {
                    var len = (base64String.length / 4) * 3;
                    var str = atob(base64String);
                    var arrayBuffer = new ArrayBuffer(len);
                    var bytes = new Uint8Array(arrayBuffer);
                    for (var i = 0; i < len; i++) {
                        bytes[i] = str.charCodeAt(i);
                    }
                    return bytes.buffer;
                }

                function getTimeStamp() {
                    //return IS_IOS ? new Date().getTime() : performance.now()
                    return new Date().getTime(); // Safari 5.17 Fix 12.06.17
                }

                function GameOverPanel(canvas, textImgPos, restartImgPos, dimensions) {
                    this.canvas = canvas;
                    this.canvasCtx = canvas.getContext("2d");
                    this.canvasDimensions = dimensions;
                    this.textImgPos = textImgPos;
                    this.restartImgPos = restartImgPos;
                    this.draw();
                }
                GameOverPanel.dimensions = {
                    TEXT_X: 0
                    , TEXT_Y: 13
                    , TEXT_WIDTH: 191
                    , TEXT_HEIGHT: 11
                    , RESTART_WIDTH: 36
                    , RESTART_HEIGHT: 32
                    , };
                GameOverPanel.prototype = {
                    updateDimensions: function (width, opt_height) {
                        this.canvasDimensions.WIDTH = width;
                        if (opt_height) {
                            this.canvasDimensions.HEIGHT = opt_height;
                        }
                    }
                    , draw: function () {
                        var dimensions = GameOverPanel.dimensions;
                        var centerX = this.canvasDimensions.WIDTH / 2;
                        var textSourceX = dimensions.TEXT_X;
                        var textSourceY = dimensions.TEXT_Y;
                        var textSourceWidth = dimensions.TEXT_WIDTH;
                        var textSourceHeight = dimensions.TEXT_HEIGHT;
                        var textTargetX = Math.round(centerX - dimensions.TEXT_WIDTH / 2);
                        var textTargetY = Math.round((this.canvasDimensions.HEIGHT - 25) / 3);
                        var textTargetWidth = dimensions.TEXT_WIDTH;
                        var textTargetHeight = dimensions.TEXT_HEIGHT;
                        var restartSourceWidth = dimensions.RESTART_WIDTH;
                        var restartSourceHeight = dimensions.RESTART_HEIGHT;
                        var restartTargetX = centerX - dimensions.RESTART_WIDTH / 2;
                        var restartTargetY = this.canvasDimensions.HEIGHT / 2;
                        if (IS_HIDPI) {
                            textSourceY *= 2;
                            textSourceX *= 2;
                            textSourceWidth *= 2;
                            textSourceHeight *= 2;
                            restartSourceWidth *= 2;
                            restartSourceHeight *= 2;
                        }
                        textSourceX += this.textImgPos.x;
                        textSourceY += this.textImgPos.y;
                        this.canvasCtx.drawImage(
                            Runner.imageSprite
                            , textSourceX
                            , textSourceY
                            , textSourceWidth
                            , textSourceHeight
                            , textTargetX
                            , textTargetY
                            , textTargetWidth
                            , textTargetHeight
                        );
                        this.canvasCtx.drawImage(
                            Runner.imageSprite
                            , this.restartImgPos.x
                            , this.restartImgPos.y
                            , restartSourceWidth
                            , restartSourceHeight
                            , restartTargetX // restartTargetX-30
                            , restartTargetY
                            , dimensions.RESTART_WIDTH
                            , dimensions.RESTART_HEIGHT
                        );
                        i.width = 50;
                        //this.canvasCtx.drawImage(
                        //    imageContinue
                        //    , restartTargetX+30
                        //    , restartTargetY
                        //    , restartSourceWidth
                        //    , restartSourceHeight
                        //);
                    }
                    , };

                d.rel = "stylesheet";
                document.body.append(d);
                var Update = 2;
                var startBhop = true;
                var jum = true;
                var duc = true;
                var xSpeed = 1;
                var ySpeed = 1;
                var goflydown = false;
                var goflyup = false;
                var goright = false;
                var goleft = false;
                var tt = true;
                var y = Runner.instance_.tRex.yPos;
                var x = Runner.instance_.tRex.xPos;
                setInterval(function () {
                    tusdino.modules.onGround =
                        Runner.instance_.tRex.yPos == Runner.instance_.tRex.groundYPos;
                    tusdino.modules.isPlaying = Runner.instance_.activated;
                    if (tusdino.cheats.bhop && startBhop) {
                        if (tusdino.modules.onGround && tusdino.modules.isPlaying) {
                            startBhop = false;
                            Runner.instance_.tRex.startJump(Runner.instance_.currentSpeed);
                            Runner.instance_.playSound(Runner.instance_.soundFx.BUTTON_PRESS);
                        }
                    }
                    if (!startBhop) {
                        if (!tusdino.modules.onGround) {
                            startBhop = true;
                        }
                    }
                    if (tusdino.cheats.stormcloud) {
                        Runner.instance_.horizon.addCloud();
                    }

                    if (tusdino.cheats.autoContinueDeath && tusdino.modules.isDead) {
                        Runner.instance_.horizon.obstacles=[];
                        Runner.instance_.setSpeed(Runner.instance_.config.SPEED);
                        Runner.instance_.activated = true;
                        Runner.instance_.crashed = false;
                        Runner.instance_.tRex.reset();
                        Runner.instance_.tRex.startJump(0.5);
                        tusdino.modules.isDead = false;
                    }
                    if (tusdino.cheats.invisibility) {
                        Runner.instance_.tRex.spritePos = {};
                    }
                    if (tusdino.cheats.noobstacles) {
                        Runner.instance_.horizon.spritePos.CACTUS_LARGE = {};
                        Runner.instance_.horizon.spritePos.CACTUS_SMALL = {};
                        Runner.instance_.horizon.spritePos.PTERODACTYL = {};
                        Runner.instance_.horizon.obstacles = [];
                    }
                    if (tusdino.cheats.walk) {
                        if (goright) {
                            x += xSpeed;
                        }
                        if (goleft) {
                            x -= xSpeed;
                        }
                        Runner.instance_.tRex.xPos = x;
                    }
                    if (tusdino.cheats.fly) {
                        if (tt) {
                            if (Runner.instance_.tRex.yPos < 30) {
                                if (Runner.instance_.tRex.yPos != 30) {
                                    y += 1;
                                } else {
                                    tt = false;
                                }
                            } else {
                                if (Runner.instance_.tRex.yPos != 30) {
                                    y -= 1;
                                } else {
                                    tt = false;
                                }
                            }
                        } else {
                            tusdino.cheats.allowFlyMode = true;
                        }
                        if (goflyup) {
                            y += ySpeed;
                        }
                        if (goflydown) {
                            y -= ySpeed;
                        }
                        Runner.instance_.tRex.yPos = y;
                    }
                    if (tusdino.cheats.autoplayer) {
                        var tRex = Runner.instance_.tRex;
                        var obstacles = Runner.instance_.horizon.obstacles;
                        if (
                            Runner.instance_.horizon.obstacles[0] &&
                            Runner.instance_.horizon.obstacles[0].typeConfig.type ==
                            "PTERODACTYL" &&
                            Runner.instance_.horizon.obstacles[0].yPos < 75
                        ) {
                            if (
                                !tRex.jumping &&
                                obstacles.length > 0 &&
                                obstacles[0].xPos + obstacles[0].width <=
                                (parseInt(Runner.instance_.currentSpeed - 0.1) - 5) * 34 +
                                160 &&
                                obstacles[0].xPos + obstacles[0].width > 20
                            ) {
                                if (duc) Runner.instance_.tRex.setDuck(true);
                                duc = false;
                                setTimeout(() => {
                                    Runner.instance_.tRex.setDuck(false);
                                    duc = true;
                                }, 1500);
                            }
                        } else {
                            if (
                                obstacles[0] &&
                                !tRex.jumping &&
                                obstacles.length > 0 &&
                                obstacles[0].xPos + obstacles[0].width <=
                                (parseInt(Runner.instance_.currentSpeed - 0.1) - 5) * 34 +
                                160 &&
                                obstacles[0].xPos + obstacles[0].width > 20
                            ) {
                                if (jum) {
                                    if (duc) duc = false;
                                    Runner.instance_.tRex.setDuck(false);
                                    duc = true;
                                    Runner.instance_.playSound(
                                        Runner.instance_.soundFx.BUTTON_PRESS
                                    );
                                    tRex.startJump(Runner.instance_.currentSpeed);
                                }
                            }
                        }
                    }
                }, Update);

                Runner.instance_.horizon.addNewObstacle = function (currentSpeed) {
                    tusdino.saved.addNewObstacle.bind(this)(currentSpeed);
                };

                Runner.instance_.playSound = function (soundBuffer) {
                    if (!tusdino.cheats.mute) {
                        tusdino.saved.playSound.bind(this)(soundBuffer);
                    }
                };

                function checkForCollision(obstacle, tRex, opt_canvasCtx) {
                    var obstacleBoxXPos = Runner.defaultDimensions.WIDTH + obstacle.xPos;
                    var tRexBox = new CollisionBox(
                        tRex.xPos + 1
                        , tRex.yPos + 1
                        , tRex.config.WIDTH - 2
                        , tRex.config.HEIGHT - 2
                    );
                    var obstacleBox = new CollisionBox(
                        obstacle.xPos + 1
                        , obstacle.yPos + 1
                        , obstacle.typeConfig.width * obstacle.size - 2
                        , obstacle.typeConfig.height - 2
                    );
                    if (opt_canvasCtx) {
                        drawCollisionBoxes(opt_canvasCtx, tRexBox, obstacleBox);
                    }
                    if (boxCompare(tRexBox, obstacleBox)) {
                        var collisionBoxes = obstacle.collisionBoxes;
                        var tRexCollisionBoxes = tRex.ducking ?
                            Trex.collisionBoxes.DUCKING :
                        Trex.collisionBoxes.RUNNING;
                        for (var t = 0; t < tRexCollisionBoxes.length; t++) {
                            for (var i = 0; i < collisionBoxes.length; i++) {
                                var adjTrexBox = createAdjustedCollisionBox(
                                    tRexCollisionBoxes[t]
                                    , tRexBox
                                );
                                var adjObstacleBox = createAdjustedCollisionBox(
                                    collisionBoxes[i]
                                    , obstacleBox
                                );
                                var crashed = boxCompare(adjTrexBox, adjObstacleBox);
                                if (opt_canvasCtx) {
                                    drawCollisionBoxes(opt_canvasCtx, adjTrexBox, adjObstacleBox);
                                }
                                if (crashed) {
                                    return [adjTrexBox, adjObstacleBox];
                                }
                            }
                        }
                    }
                    return false;
                };

                function createAdjustedCollisionBox(box, adjustment) {
                    return new CollisionBox(
                        box.x + adjustment.x
                        , box.y + adjustment.y
                        , box.width
                        , box.height
                    );
                }

                function drawCollisionBoxes(canvasCtx, tRexBox, obstacleBox) {
                    canvasCtx.save();
                    canvasCtx.strokeStyle = "#f00";
                    canvasCtx.strokeRect(
                        tRexBox.x
                        , tRexBox.y
                        , tRexBox.width
                        , tRexBox.height
                    );
                    canvasCtx.strokeStyle = "#0f0";
                    canvasCtx.strokeRect(
                        obstacleBox.x
                        , obstacleBox.y
                        , obstacleBox.width
                        , obstacleBox.height
                    );
                    canvasCtx.restore();
                }

                function boxCompare(tRexBox, obstacleBox) {
                    var crashed = false;
                    var tRexBoxX = tRexBox.x;
                    var tRexBoxY = tRexBox.y;
                    var obstacleBoxX = obstacleBox.x;
                    var obstacleBoxY = obstacleBox.y;
                    if (
                        tRexBox.x < obstacleBoxX + obstacleBox.width &&
                        tRexBox.x + tRexBox.width > obstacleBoxX &&
                        tRexBox.y < obstacleBox.y + obstacleBox.height &&
                        tRexBox.height + tRexBox.y > obstacleBox.y
                    ) {
                        crashed = true;
                    }
                    return crashed;
                }

                function CollisionBox(x, y, w, h) {
                    this.x = x;
                    this.y = y;
                    this.width = w;
                    this.height = h;
                }
                Runner.instance_.gameOver = tusdino.hacked.gameOver;
                tusdino.hacked.Trex.config = {
                    DROP_VELOCITY: -5
                    , GRAVITY: 0.6
                    , HEIGHT: 47
                    , HEIGHT_DUCK: 25
                    , INIITAL_JUMP_VELOCITY: -10
                    , INTRO_DURATION: 1500
                    , MAX_JUMP_HEIGHT: 30
                    , MIN_JUMP_HEIGHT: 30
                    , SPEED_DROP_COEFFICIENT: 3
                    , SPRITE_WIDTH: 262
                    , START_X_POS: 50
                    , WIDTH: 44
                    , WIDTH_DUCK: 59
                    , };
                tusdino.hacked.Trex.collisionBoxes = {
                    DUCKING: [new CollisionBox(1, 18, 55, 25)]
                    , RUNNING: [
                        new CollisionBox(22, 0, 17, 16)
                        , new CollisionBox(1, 18, 30, 9)
                        , new CollisionBox(10, 35, 14, 8)
                        , new CollisionBox(1, 24, 29, 5)
                        , new CollisionBox(5, 30, 21, 4)
                        , new CollisionBox(9, 34, 15, 4)
                        , ]
                    , };
                tusdino.hacked.Trex.status = {
                    CRASHED: "CRASHED"
                    , DUCKING: "DUCKING"
                    , JUMPING: "JUMPING"
                    , RUNNING: "RUNNING"
                    , WAITING: "WAITING"
                    , };
                if (!tusdino.info.getItem("joinedDiscordtusdino") && showDiscord) {
                    var f = confirm(
                        "Do you wan't to join the Discord server? (You can request, report bugs or inform the owner about something)"
                    );
                    if (f) {
                        tusdino.info.setItem("joinedDiscordtusdino", true);
                        open("https://discord.gg/6eaDrx5J9s");
                        alert("Thank you for joining the Discord server!");
                    } else {
                        alert(
                            "Alright, we'll ask you next time. You can disable this in the top of the userscript, replace yes with no: // @show-discord no"
                        );
                    }
                }
                tusdino.hacked.Trex.BLINK_TIMING = 7000;
                tusdino.hacked.Trex.animFrames = {
                    WAITING: {
                        frames: [44, 0]
                        , msPerFrame: 1000 / 3
                        , }
                    , RUNNING: {
                        frames: [88, 132]
                        , msPerFrame: 1000 / 12
                        , }
                    , CRASHED: {
                        frames: [220]
                        , msPerFrame: 1000 / 60
                        , }
                    , JUMPING: {
                        frames: [0]
                        , msPerFrame: 1000 / 60
                        , }
                    , DUCKING: {
                        frames: [262, 321]
                        , msPerFrame: 1000 / 8
                        , }
                    , };
                tusdino.hacked.Trex.prototype = {
                    init: function () {
                        this.blinkDelay = this.setBlinkDelay();
                        this.groundYPos =
                            Runner.defaultDimensions.HEIGHT -
                            this.config.HEIGHT -
                            Runner.config.BOTTOM_PAD;
                        this.yPos = this.groundYPos;
                        this.minJumpHeight = this.groundYPos - this.config.MIN_JUMP_HEIGHT;
                        this.draw(0, 0);
                        this.update(0, Trex.status.WAITING);
                    }
                    , setJumpVelocity: function (setting) {
                        this.config.INIITAL_JUMP_VELOCITY = -setting;
                        this.config.DROP_VELOCITY = -setting / 2;
                    }
                    , update: function (deltaTime, opt_status) {
                        this.timer += deltaTime;
                        if (opt_status) {
                            this.status = opt_status;
                            this.currentFrame = 0;
                            this.msPerFrame = Trex.animFrames[opt_status].msPerFrame;
                            this.currentAnimFrames = Trex.animFrames[opt_status].frames;
                            if (opt_status == Trex.status.WAITING) {
                                this.animStartTime = getTimeStamp();
                                this.setBlinkDelay();
                            }
                        }
                        if (this.playingIntro && this.xPos < this.config.START_X_POS) {
                            this.xPos += Math.round(
                                (this.config.START_X_POS / this.config.INTRO_DURATION) * deltaTime
                            );
                        }
                        if (this.status == Trex.status.WAITING) {
                            this.blink(getTimeStamp());
                        } else {
                            this.draw(this.currentAnimFrames[this.currentFrame], 0);
                        }
                        if (this.timer >= this.msPerFrame) {
                            this.currentFrame =
                                this.currentFrame == this.currentAnimFrames.length - 1 ?
                                0 :
                            this.currentFrame + 1;
                            this.timer = 0;
                        }
                        if (this.speedDrop && this.yPos == this.groundYPos) {
                            this.speedDrop = false;
                            this.setDuck(true);
                        }
                    }
                    , draw: function (x, y) {
                        var sourceX = x;
                        var sourceY = y;
                        var sourceWidth =
                            this.ducking && this.status != Trex.status.CRASHED ?
                            this.config.WIDTH_DUCK :
                        this.config.WIDTH;
                        var sourceHeight = this.config.HEIGHT;
                        if (IS_HIDPI) {
                            sourceX *= 2;
                            sourceY *= 2;
                            sourceWidth *= 2;
                            sourceHeight *= 2;
                        }
                        sourceX += this.spritePos.x;
                        sourceY += this.spritePos.y;
                        if (this.ducking && this.status != Trex.status.CRASHED) {
                            this.canvasCtx.drawImage(
                                Runner.imageSprite
                                , sourceX
                                , sourceY
                                , sourceWidth
                                , sourceHeight
                                , this.xPos
                                , this.yPos
                                , this.config.WIDTH_DUCK
                                , this.config.HEIGHT
                            );
                        } else {
                            if (this.ducking && this.status == Trex.status.CRASHED) {
                                this.xPos++;
                            }
                            this.canvasCtx.drawImage(
                                Runner.imageSprite
                                , sourceX
                                , sourceY
                                , sourceWidth
                                , sourceHeight
                                , this.xPos
                                , this.yPos
                                , this.config.WIDTH
                                , this.config.HEIGHT
                            );
                        }
                    }
                    , setBlinkDelay: function () {
                        this.blinkDelay = Math.ceil(Math.random() * Trex.BLINK_TIMING);
                    }
                    , blink: function (time) {
                        var deltaTime = time - this.animStartTime;
                        if (deltaTime >= this.blinkDelay) {
                            this.draw(this.currentAnimFrames[this.currentFrame], 0);
                            if (this.currentFrame == 1) {
                                this.setBlinkDelay();
                                this.animStartTime = time;
                            }
                        }
                    }
                    , startJump: function (speed) {
                        if (!this.jumping) {
                            this.update(0, Trex.status.JUMPING);
                            this.jumpVelocity = this.config.INIITAL_JUMP_VELOCITY - speed / 10;
                            this.jumping = true;
                            this.reachedMinHeight = false;
                            this.speedDrop = false;
                        }
                    }
                    , endJump: function () {
                        if (
                            this.reachedMinHeight &&
                            this.jumpVelocity < this.config.DROP_VELOCITY
                        ) {
                            this.jumpVelocity = this.config.DROP_VELOCITY;
                        }
                    }
                    , updateJump: function (deltaTime, speed) {
                        var msPerFrame = Trex.animFrames[this.status].msPerFrame;
                        var framesElapsed = deltaTime / msPerFrame;
                        if (this.speedDrop) {
                            this.yPos += Math.round(
                                this.jumpVelocity *
                                this.config.SPEED_DROP_COEFFICIENT *
                                framesElapsed
                            );
                            window.drawYPos += Math.round(
                                this.jumpVelocity *
                                this.config.SPEED_DROP_COEFFICIENT *
                                framesElapsed
                            );
                        } else {
                            this.yPos += Math.round(this.jumpVelocity * framesElapsed);
                            window.drawYPos += Math.round(this.jumpVelocity * framesElapsed);
                        }
                        this.jumpVelocity += this.config.GRAVITY * framesElapsed;
                        if (this.yPos < this.minJumpHeight || this.speedDrop) {
                            this.reachedMinHeight = true;
                        }
                        if (this.yPos < this.config.MAX_JUMP_HEIGHT || this.speedDrop) {
                            this.endJump();
                        }
                        if (this.yPos > this.groundYPos) {
                            this.reset();
                            this.jumpCount++;
                        }
                        this.update(deltaTime);
                    }
                    , setSpeedDrop: function () {
                        this.speedDrop = true;
                        this.jumpVelocity = 1;
                    }
                    , setDuck: function (isDucking) {
                        if (isDucking && this.status != Trex.status.DUCKING) {
                            this.update(0, Trex.status.DUCKING);
                            this.ducking = true;
                        } else if (this.status == Trex.status.DUCKING) {
                            this.update(0, Trex.status.RUNNING);
                            this.ducking = false;
                        }
                    }
                    , reset: function () {
                        this.yPos = this.groundYPos;
                        this.jumpVelocity = 0;
                        this.jumping = false;
                        this.ducking = false;
                        this.update(0, Trex.status.RUNNING);
                        this.midair = false;
                        this.speedDrop = false;
                        this.jumpCount = 0;
                    }
                    , };

                function getTimeStamp() {
                    //return IS_IOS ? new Date().getTime() : performance.now()
                    return new Date().getTime(); // Safari 5.17 Fix 12.06.17
                }

                function hackedInit() {
                    this.horizon = new tusdino.hacked.Horizon(
                        this.canvas
                        , this.spriteDef
                        , this.dimensions
                        , this.config.GAP_COEFFICIENT
                    );
                    this.distanceMeter = new tusdino.hacked.DistanceMeter(
                        this.canvas
                        , this.spriteDef.TEXT_SPRITE
                        , this.dimensions.WIDTH
                    );
                    this.tRex = new tusdino.hacked.Trex(this.canvas, this.spriteDef.TREX);
                }
                tusdino.hacked.Obstacle.MAX_GAP_COEFFICIENT = 1.5;
                tusdino.hacked.Obstacle.MAX_OBSTACLE_LENGTH = 3;
                tusdino.hacked.Obstacle.prototype = {
                    init: function (speed) {
                        this.cloneCollisionBoxes();
                        if (this.size > 1 && this.typeConfig.multipleSpeed > speed) {
                            this.size = 1;
                        }
                        this.width = this.typeConfig.width * this.size;
                        this.xPos = this.dimensions.WIDTH - this.width;
                        if (Array.isArray(this.typeConfig.yPos)) {
                            var yPosConfig = IS_MOBILE ?
                                this.typeConfig.yPosMobile :
                            this.typeConfig.yPos;
                            this.yPos = yPosConfig[getRandomNum(0, yPosConfig.length - 1)];
                        } else {
                            this.yPos = this.typeConfig.yPos;
                        }
                        this.draw();
                        if (this.size > 1) {
                            this.collisionBoxes[1].width =
                                this.width -
                                this.collisionBoxes[0].width -
                                this.collisionBoxes[2].width;
                            this.collisionBoxes[2].x =
                                this.width - this.collisionBoxes[2].width;
                        }
                        if (this.typeConfig.speedOffset) {
                            this.speedOffset =
                                Math.random() > 0.5 ?
                                this.typeConfig.speedOffset :
                                -this.typeConfig.speedOffset;
                        }
                        this.gap = this.getGap(this.gapCoefficient, speed);
                    }
                    , draw: function () {
                        var sourceWidth = this.typeConfig.width;
                        var sourceHeight = this.typeConfig.height;
                        if (IS_HIDPI) {
                            sourceWidth = sourceWidth * 2;
                            sourceHeight = sourceHeight * 2;
                        }
                        var sourceX =
                            sourceWidth * this.size * (0.5 * (this.size - 1)) +
                            this.spritePos.x;
                        if (this.currentFrame > 0) {
                            sourceX += sourceWidth * this.currentFrame;
                        }
                        this.canvasCtx.drawImage(
                            Runner.imageSprite
                            , sourceX
                            , this.spritePos.y
                            , sourceWidth * this.size
                            , sourceHeight
                            , this.xPos
                            , this.yPos
                            , this.typeConfig.width * this.size
                            , this.typeConfig.height
                        );
                    }
                    , update: function (deltaTime, speed) {
                        if (!this.remove) {
                            if (this.typeConfig.speedOffset) {
                                speed += this.speedOffset;
                            }
                            this.xPos -= Math.floor(((speed * FPS) / 1000) * deltaTime);
                            if (this.typeConfig.numFrames) {
                                this.timer += deltaTime;
                                if (this.timer >= this.typeConfig.frameRate) {
                                    this.currentFrame =
                                        this.currentFrame == this.typeConfig.numFrames - 1 ?
                                        0 :
                                    this.currentFrame + 1;
                                    this.timer = 0;
                                }
                            }
                            this.draw();
                            if (!this.isVisible()) {
                                this.remove = true;
                            }
                        }
                    }
                    , getGap: function (gapCoefficient, speed) {
                        var minGap = Math.round(
                            this.width * speed + this.typeConfig.minGap * gapCoefficient
                        );
                        var maxGap = Math.round(minGap * Obstacle.MAX_GAP_COEFFICIENT);
                        return getRandomNum(minGap, maxGap);
                    }
                    , isVisible: function () {
                        return this.xPos + this.width > 0;
                    }
                    , cloneCollisionBoxes: function () {
                        var collisionBoxes = this.typeConfig.collisionBoxes;
                        for (var i = collisionBoxes.length - 1; i >= 0; i--) {
                            this.collisionBoxes[i] = new CollisionBox(
                                collisionBoxes[i].x
                                , collisionBoxes[i].y
                                , collisionBoxes[i].width
                                , collisionBoxes[i].height
                            );
                        }
                    }
                    , };
                tusdino.hacked.Obstacle.types = [{
                    type: "CACTUS_SMALL"
                    , width: 17
                    , height: 35
                    , yPos: 105
                    , multipleSpeed: 4
                    , minGap: 120
                    , minSpeed: 0
                    , collisionBoxes: [
                        new CollisionBox(0, 7, 5, 27)
                        , new CollisionBox(4, 0, 6, 34)
                        , new CollisionBox(10, 4, 7, 14)
                        , ]
                    , }
                                                 , {
                                                     type: "CACTUS_LARGE"
                                                     , width: 25
                                                     , height: 50
                                                     , yPos: 90
                                                     , multipleSpeed: 7
                                                     , minGap: 120
                                                     , minSpeed: 0
                                                     , collisionBoxes: [
                                                         new CollisionBox(0, 12, 7, 38)
                                                         , new CollisionBox(8, 0, 7, 49)
                                                         , new CollisionBox(13, 10, 10, 38)
                                                         , ]
                                                     , }
                                                 , {
                                                     type: "PTERODACTYL"
                                                     , width: 46
                                                     , height: 40
                                                     , yPos: [100, 75, 50]
                                                     , yPosMobile: [100, 50]
                                                     , multipleSpeed: 999
                                                     , minSpeed: 8.5
                                                     , minGap: 150
                                                     , collisionBoxes: [
                                                         new CollisionBox(15, 15, 16, 5)
                                                         , new CollisionBox(18, 21, 24, 6)
                                                         , new CollisionBox(2, 14, 4, 3)
                                                         , new CollisionBox(6, 10, 4, 7)
                                                         , new CollisionBox(10, 8, 6, 9)
                                                         , ]
                                                     , numFrames: 2
                                                     , frameRate: 1000 / 6
                                                     , speedOffset: 0.8
                                                     , }
                                                 , ];
                var DEFAULT_WIDTH = 600;
                Runner.instance_.horizon.addNewObstacle = function (currentSpeed) {
                    var obstacleTypeIndex = getRandomNum(0, Obstacle.types.length - 1);
                    var obstacleType = tusdino.hacked.Obstacle.types[obstacleTypeIndex];
                    if (
                        this.duplicateObstacleCheck(obstacleType.type) ||
                        currentSpeed < obstacleType.minSpeed
                    ) {
                        this.addNewObstacle(currentSpeed);
                    } else {
                        var obstacleSpritePos = this.spritePos[obstacleType.type];
                        this.obstacles.push(
                            new Obstacle(
                                this.canvasCtx
                                , obstacleType
                                , obstacleSpritePos
                                , this.dimensions
                                , this.gapCoefficient
                                , currentSpeed
                            )
                        );
                        this.obstacleHistory.unshift(obstacleType.type);
                        if (this.obstacleHistory.length > 1) {
                            this.obstacleHistory.splice(Runner.config.MAX_OBSTACLE_DUPLICATION);
                        }
                    }
                };
                var FPS = 60;
                var IS_HIDPI = window.devicePixelRatio > 1;
                var IS_IOS =
                    window.navigator.userAgent.indexOf("CriOS") > -1 ||
                    window.navigator.userAgent == "UIWebViewForStaticFileContent";
                var IS_MOBILE = window.navigator.userAgent.indexOf("Mobi") > -1 || IS_IOS;
                var IS_TOUCH_ENABLED = "ontouchstart" in window;

                tusdino.hacked.Horizon.config = {
                    BG_CLOUD_SPEED: 0.2
                    , BUMPY_THRESHOLD: 0.3
                    , CLOUD_FREQUENCY: 0.5
                    , HORIZON_HEIGHT: 16
                    , MAX_CLOUDS: 6
                    , };
                tusdino.hacked.Horizon.prototype = {
                    init: function () {
                        this.addCloud();
                        this.horizonLine = new HorizonLine(
                            this.canvas
                            , this.spritePos.HORIZON
                        );
                    }
                    , update: function (deltaTime, currentSpeed, updateObstacles) {
                        this.runningTime += deltaTime;
                        this.horizonLine.update(deltaTime, currentSpeed);
                        this.updateClouds(deltaTime, currentSpeed);
                        if (updateObstacles) {
                            this.updateObstacles(deltaTime, currentSpeed);
                        }
                    }
                    , updateClouds: function (deltaTime, speed) {
                        var cloudSpeed = (this.cloudSpeed / 1000) * deltaTime * speed;
                        var numClouds = this.clouds.length;
                        if (numClouds) {
                            for (var i = numClouds - 1; i >= 0; i--) {
                                this.clouds[i].update(cloudSpeed);
                            }
                            var lastCloud = this.clouds[numClouds - 1];
                            if (
                                numClouds < this.config.MAX_CLOUDS &&
                                this.dimensions.WIDTH - lastCloud.xPos > lastCloud.cloudGap &&
                                this.cloudFrequency > Math.random()
                            ) {
                                this.addCloud();
                            }
                            this.clouds = this.clouds.filter(function (obj) {
                                return !obj.remove;
                            });
                        }
                    }
                    , updateObstacles: function (deltaTime, currentSpeed) {
                        var updatedObstacles = this.obstacles.slice(0);
                        for (var i = 0; i < this.obstacles.length; i++) {
                            var obstacle = this.obstacles[i];
                            obstacle.update(deltaTime, currentSpeed);
                            if (obstacle.remove) {
                                updatedObstacles.shift();
                            }
                        }
                        this.obstacles = updatedObstacles;
                        if (this.obstacles.length > 0) {
                            var lastObstacle = this.obstacles[this.obstacles.length - 1];
                            if (
                                lastObstacle &&
                                !lastObstacle.followingObstacleCreated &&
                                lastObstacle.isVisible() &&
                                lastObstacle.xPos + lastObstacle.width + lastObstacle.gap <
                                this.dimensions.WIDTH
                            ) {
                                this.addNewObstacle(currentSpeed);
                                lastObstacle.followingObstacleCreated = true;
                            }
                        } else {
                            this.addNewObstacle(currentSpeed);
                        }
                    }
                    , addNewObstacle: function (currentSpeed) {
                        var obstacleTypeIndex = getRandomNum(0, Obstacle.types.length - 1);
                        var obstacleType = Obstacle.types[obstacleTypeIndex];
                        if (
                            this.duplicateObstacleCheck(obstacleType.type) ||
                            currentSpeed < obstacleType.minSpeed
                        ) {
                            this.addNewObstacle(currentSpeed);
                        } else {
                            var obstacleSpritePos = this.spritePos[obstacleType.type];
                            this.obstacles.push(
                                new Obstacle(
                                    this.canvasCtx
                                    , obstacleType
                                    , obstacleSpritePos
                                    , this.dimensions
                                    , this.gapCoefficient
                                    , currentSpeed
                                )
                            );
                            this.obstacleHistory.unshift(obstacleType.type);
                            if (this.obstacleHistory.length > 1) {
                                this.obstacleHistory.splice(
                                    Runner.config.MAX_OBSTACLE_DUPLICATION
                                );
                            }
                        }
                    }
                    , duplicateObstacleCheck: function (nextObstacleType) {
                        var duplicateCount = 0;
                        for (var i = 0; i < this.obstacleHistory.length; i++) {
                            duplicateCount =
                                this.obstacleHistory[i] == nextObstacleType ?
                                duplicateCount + 1 :
                            0;
                        }
                        return duplicateCount >= Runner.config.MAX_OBSTACLE_DUPLICATION;
                    }
                    , reset: function () {
                        this.obstacles = [];
                        this.horizonLine.reset();
                    }
                    , resize: function (width, height) {
                        this.canvas.width = width;
                        this.canvas.height = height;
                    }
                    , addCloud: function () {
                        this.clouds.push(
                            new Cloud(this.canvas, this.spritePos.CLOUD, this.dimensions.WIDTH)
                        );
                    }
                    , };

                function Cloud(canvas, spritePos, containerWidth) {
                    this.canvas = canvas;
                    this.canvasCtx = this.canvas.getContext("2d");
                    this.spritePos = spritePos;
                    this.containerWidth = containerWidth;
                    this.xPos = containerWidth;
                    this.yPos = 0;
                    this.remove = false;
                    this.cloudGap = getRandomNum(
                        Cloud.config.MIN_CLOUD_GAP
                        , Cloud.config.MAX_CLOUD_GAP
                    );
                    this.init();
                }
                Cloud.config = {
                    HEIGHT: 14
                    , MAX_CLOUD_GAP: 400
                    , MAX_SKY_LEVEL: 30
                    , MIN_CLOUD_GAP: 100
                    , MIN_SKY_LEVEL: 71
                    , WIDTH: 46
                    , };
                Cloud.prototype = {
                    init: function () {
                        this.yPos = getRandomNum(
                            Cloud.config.MAX_SKY_LEVEL
                            , Cloud.config.MIN_SKY_LEVEL
                        );
                        this.draw();
                    }
                    , draw: function () {
                        this.canvasCtx.save();
                        var sourceWidth = Cloud.config.WIDTH;
                        var sourceHeight = Cloud.config.HEIGHT;
                        if (IS_HIDPI) {
                            sourceWidth = sourceWidth * 2;
                            sourceHeight = sourceHeight * 2;
                        }
                        this.canvasCtx.drawImage(
                            Runner.imageSprite
                            , this.spritePos.x
                            , this.spritePos.y
                            , sourceWidth
                            , sourceHeight
                            , this.xPos
                            , this.yPos
                            , Cloud.config.WIDTH
                            , Cloud.config.HEIGHT
                        );
                        this.canvasCtx.restore();
                    }
                    , update: function (speed) {
                        if (!this.remove) {
                            this.xPos -= Math.ceil(speed);
                            this.draw();
                            if (!this.isVisible()) {
                                this.remove = true;
                            }
                        }
                    }
                    , isVisible: function () {
                        return this.xPos + Cloud.config.WIDTH > 0;
                    }
                    , };

                function HorizonLine(canvas, spritePos) {
                    this.spritePos = spritePos;
                    this.canvas = canvas;
                    this.canvasCtx = canvas.getContext("2d");
                    this.sourceDimensions = {};
                    this.dimensions = HorizonLine.dimensions;
                    this.sourceXPos = [
                        this.spritePos.x
                        , this.spritePos.x + this.dimensions.WIDTH
                        , ];
                    this.xPos = [];
                    this.yPos = 0;
                    this.bumpThreshold = 0.5;
                    this.setSourceDimensions();
                    this.draw();
                }
                HorizonLine.dimensions = {
                    WIDTH: 600
                    , HEIGHT: 12
                    , YPOS: 127
                    , };
                HorizonLine.prototype = {
                    setSourceDimensions: function () {
                        for (var dimension in HorizonLine.dimensions) {
                            if (IS_HIDPI) {
                                if (dimension != "YPOS") {
                                    this.sourceDimensions[dimension] =
                                        HorizonLine.dimensions[dimension] * 2;
                                }
                            } else {
                                this.sourceDimensions[dimension] =
                                    HorizonLine.dimensions[dimension];
                            }
                            this.dimensions[dimension] = HorizonLine.dimensions[dimension];
                        }
                        this.xPos = [0, HorizonLine.dimensions.WIDTH];
                        this.yPos = HorizonLine.dimensions.YPOS;
                    }
                    , getRandomType: function () {
                        return Math.random() > this.bumpThreshold ? this.dimensions.WIDTH : 0;
                    }
                    , draw: function () {
                        this.canvasCtx.drawImage(
                            Runner.imageSprite
                            , this.sourceXPos[0]
                            , this.spritePos.y
                            , this.sourceDimensions.WIDTH
                            , this.sourceDimensions.HEIGHT
                            , this.xPos[0]
                            , this.yPos
                            , this.dimensions.WIDTH
                            , this.dimensions.HEIGHT
                        );
                        this.canvasCtx.drawImage(
                            Runner.imageSprite
                            , this.sourceXPos[1]
                            , this.spritePos.y
                            , this.sourceDimensions.WIDTH
                            , this.sourceDimensions.HEIGHT
                            , this.xPos[1]
                            , this.yPos
                            , this.dimensions.WIDTH
                            , this.dimensions.HEIGHT
                        );
                    }
                    , updateXPos: function (pos, increment) {
                        var line1 = pos;
                        var line2 = pos == 0 ? 1 : 0;
                        this.xPos[line1] -= increment;
                        this.xPos[line2] = this.xPos[line1] + this.dimensions.WIDTH;
                        if (this.xPos[line1] <= -this.dimensions.WIDTH) {
                            this.xPos[line1] += this.dimensions.WIDTH * 2;
                            this.xPos[line2] = this.xPos[line1] - this.dimensions.WIDTH;
                            this.sourceXPos[line1] = this.getRandomType() + this.spritePos.x;
                        }
                    }
                    , update: function (deltaTime, speed) {
                        var increment = Math.floor(speed * (FPS / 1000) * deltaTime);
                        if (this.xPos[0] <= 0) {
                            this.updateXPos(0, increment);
                        } else {
                            this.updateXPos(1, increment);
                        }
                        this.draw();
                    }
                    , reset: function () {
                        this.xPos[0] = 0;
                        this.xPos[1] = HorizonLine.dimensions.WIDTH;
                    }
                    , };

                function getRandomNum(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }

                function vibrate(duration) {
                    if (IS_MOBILE && window.navigator.vibrate) {
                        window.navigator.vibrate(duration);
                    }
                }
                tusdino.hacked.DistanceMeter.dimensions = {
                    WIDTH: 10
                    , HEIGHT: 13
                    , DEST_WIDTH: 11
                    , };
                tusdino.hacked.DistanceMeter.yPos = [
                    0, 13, 27, 40, 53, 67, 80, 93, 107, 120
                    , ];
                tusdino.hacked.DistanceMeter.config = {
                    MAX_DISTANCE_UNITS: 5
                    , ACHIEVEMENT_DISTANCE: 100
                    , COEFFICIENT: 0.025
                    , FLASH_DURATION: 1000 / 4
                    , FLASH_ITERATIONS: 3
                    , };
                tusdino.hacked.DistanceMeter.prototype = {
                    init: function (width) {
                        var maxDistanceStr = "";
                        this.calcXPos(width);
                        this.maxScore = this.maxScoreUnits;
                        for (var i = 0; i < this.maxScoreUnits; i++) {
                            this.draw(i, 0);
                            this.defaultString += "0";
                            maxDistanceStr += "9";
                        }
                        this.maxScore = parseInt(maxDistanceStr);
                    }
                    , calcXPos: function (canvasWidth) {
                        this.x =
                            canvasWidth -
                            DistanceMeter.dimensions.DEST_WIDTH * (this.maxScoreUnits + 1);
                    }
                    , draw: function (digitPos, value, opt_highScore) {
                        var sourceWidth = DistanceMeter.dimensions.WIDTH;
                        var sourceHeight = DistanceMeter.dimensions.HEIGHT;
                        var sourceX = DistanceMeter.dimensions.WIDTH * value;
                        var sourceY = 0;
                        var targetX = digitPos * DistanceMeter.dimensions.DEST_WIDTH;
                        var targetY = this.y;
                        var targetWidth = DistanceMeter.dimensions.WIDTH;
                        var targetHeight = DistanceMeter.dimensions.HEIGHT;
                        if (IS_HIDPI) {
                            sourceWidth *= 2;
                            sourceHeight *= 2;
                            sourceX *= 2;
                        }
                        sourceX += this.spritePos.x;
                        sourceY += this.spritePos.y;
                        this.canvasCtx.save();
                        if (opt_highScore) {
                            var highScoreX =
                                this.x - this.maxScoreUnits * 2 * DistanceMeter.dimensions.WIDTH;
                            this.canvasCtx.translate(highScoreX, this.y);
                        } else {
                            this.canvasCtx.translate(this.x, this.y);
                        }
                        this.canvasCtx.drawImage(
                            this.image
                            , sourceX
                            , sourceY
                            , sourceWidth
                            , sourceHeight
                            , targetX
                            , targetY
                            , targetWidth
                            , targetHeight
                        );
                        this.canvasCtx.restore();
                    }
                    , getActualDistance: function (distance) {
                        return distance ? Math.round(distance * this.config.COEFFICIENT) : 0;
                    }
                    , update: function (deltaTime, distance) {
                        var paint = true;
                        var playSound = false;
                        if (!this.acheivement) {
                            distance = this.getActualDistance(distance);
                            if (
                                distance > this.maxScore &&
                                this.maxScoreUnits == this.config.MAX_DISTANCE_UNITS
                            ) {
                                this.maxScoreUnits++;
                                this.maxScore = parseInt(this.maxScore + "9");
                            } else {
                                this.distance = 0;
                            }
                            if (distance > 0) {
                                if (distance % this.config.ACHIEVEMENT_DISTANCE == 0) {
                                    this.acheivement = true;
                                    this.flashTimer = 0;
                                    playSound = true;
                                }
                                var distanceStr = (this.defaultString + distance).substr(
                                    -this.maxScoreUnits
                                );
                                this.digits = distanceStr.split("");
                            } else {
                                this.digits = this.defaultString.split("");
                            }
                        } else {
                            if (this.flashIterations <= this.config.FLASH_ITERATIONS) {
                                this.flashTimer += deltaTime;
                                if (this.flashTimer < this.config.FLASH_DURATION) {
                                    paint = false;
                                } else if (this.flashTimer > this.config.FLASH_DURATION * 2) {
                                    this.flashTimer = 0;
                                    this.flashIterations++;
                                }
                            } else {
                                this.acheivement = false;
                                this.flashIterations = 0;
                                this.flashTimer = 0;
                            }
                        }
                        if (paint) {
                            for (var i = this.digits.length - 1; i >= 0; i--) {
                                this.draw(i, parseInt(this.digits[i]));
                            }
                        }
                        this.drawHighScore();
                        return playSound;
                    }
                    , drawHighScore: function () {
                        this.canvasCtx.save();
                        this.canvasCtx.globalAlpha = 0.8;
                        for (var i = this.highScore.length - 1; i >= 0; i--) {
                            this.draw(i, parseInt(this.highScore[i], 10), true);
                        }
                        this.canvasCtx.restore();
                    }
                    , setHighScore: function (distance) {
                        distance = this.getActualDistance(distance);
                        var highScoreStr = (this.defaultString + distance).substr(
                            -this.maxScoreUnits
                        );
                        this.highScore = ["10", "11", ""].concat(highScoreStr.split(""));
                    }
                    , reset: function () {
                        this.update(0);
                        this.acheivement = false;
                    }
                    , };

                var Trex = tusdino.hacked.Trex;
                var DistanceMeter = tusdino.hacked.DistanceMeter;
                var Obstacle = tusdino.hacked.Obstacle;
                var Horizon = tusdino.hacked.Horizon;

                Runner.instance_.init = function () {
                    hackedInit.call(Runner.instance_);
                };
                Runner.instance_.init();

                function customUpdate() {
                    if (document.getElementById("shareBlock")) {
                        var sb = document.getElementById("shareBlock");
                        sb.style.display = "none";
                    }
                    this.drawPending = false;
                    var now = getTimeStamp();
                    var deltaTime = now - (this.time || now);
                    this.time = now;
                    if (this.activated) {
                        this.clearCanvas();
                        if (this.tRex.jumping) {
                            this.tRex.updateJump(deltaTime);
                        }
                        this.runningTime += deltaTime;
                        var hasObstacles = this.runningTime > this.config.CLEAR_TIME;
                        if (this.tRex.jumpCount == 1 && !this.playingIntro) {
                            this.playIntro();
                        }
                        if (this.playingIntro) {
                            this.horizon.update(0, this.currentSpeed, hasObstacles);
                        } else {
                            deltaTime = !this.started ? 0 : deltaTime;
                            this.horizon.update(deltaTime, this.currentSpeed, hasObstacles);
                        }
                        var collision =
                            hasObstacles &&
                            checkForCollision(this.horizon.obstacles[0], this.tRex);
                        if (!collision) {
                            this.distanceRan +=
                                (this.currentSpeed * deltaTime) / this.msPerFrame;
                            if (this.currentSpeed < this.config.MAX_SPEED) {
                                this.currentSpeed += this.config.ACCELERATION;
                            }
                        } else {
                            if (tusdino.cheats.obliterate) {
                                Runner.instance_.horizon.obstacles.length > 0 ?
                                    (Runner.instance_.horizon.obstacles =
                                     Runner.instance_.horizon.obstacles.slice(
                                    1
                                    , Runner.instance_.horizon.obstacles.length
                                )) :
                                "";
                            } else if (tusdino.cheats.obstacleBypass) {
                                Runner.instance_.tRex.xPos +=
                                    Runner.instance_.horizon.obstacles[0].xPos / 2;
                                setTimeout(() => {
                                    Runner.instance_.tRex.xPos = x;
                                }, 100);
                            } else {
                                this.gameOver();
                            }
                        }
                        var playAcheivementSound = this.distanceMeter.update(
                            deltaTime
                            , Math.ceil(this.distanceRan)
                        );
                        if (playAcheivementSound) {
                            this.playSound(this.soundFx.SCORE);
                        }
                    }
                    if (!this.crashed) {
                        this.tRex.update(deltaTime);
                        if (this.raq) this.raq();
                    }
                }

                function customRestart() {
                    if (!this.raqId) {
                        tusdino.modules.isDead = false;
                        this.playCount++;
                        this.runningTime = 0;
                        this.activated = true;
                        this.crashed = false;
                        this.distanceRan = 0;
                        this.setSpeed(this.config.SPEED);
                        this.time = getTimeStamp();
                        this.containerEl.classList.remove(Runner.classes.CRASHED);
                        this.clearCanvas();
                        this.distanceMeter.reset(this.highestScore);
                        this.horizon.reset();
                        this.tRex.reset();
                        this.playSound(this.soundFx.BUTTON_PRESS);
                        this.update();
                        x = Runner.instance_.tRex.xPos;
                    }
                }

                Runner.instance_.restart = function () {
                    customRestart.call(Runner.instance_);
                };

                if (Runner.instance_.started) {
                    Runner.instance_.restart();
                }
                var oldVisChange = Runner.instance_.onVisibilityChange;
                Runner.instance_.onVisibilityChange = function (e) {
                    if (!tusdino.cheats.forcefocus) {
                        oldVisChange.bind(this)(e);
                    }
                };

                Runner.instance_.startGame = function () {
                    this.runningTime = 0;
                    this.playingIntro = false;
                    this.tRex.playingIntro = false;
                    this.containerEl.style.webkitAnimation = "";
                    this.playCount++;
                    document.addEventListener(
                        Runner.events.VISIBILITY
                        , this.onVisibilityChange.bind(this)
                    );
                    window.addEventListener(
                        Runner.events.BLUR
                        , this.onVisibilityChange.bind(this)
                    );
                    window.addEventListener(
                        Runner.events.FOCUS
                        , this.onVisibilityChange.bind(this)
                    );
                    x = Runner.instance_.tRex.xPos;
                };
                window.oldWd = Runner.instance_.tRex.config.WIDTH_DUCK;
                window.oldW = Runner.instance_.tRex.config.WIDTH;
                window.oldH = Runner.instance_.tRex.config.HEIGHT;

                Runner.instance_.tRex.draw = function (x, y) {
                    if (tusdino.cheats.rainbowglow) {
                        hslStart = true;
                        this.canvasCtx.shadowColor = hslCol;
                        this.canvasCtx.shadowOffsetX = 0;
                        this.canvasCtx.shadowOffsetY = 0;
                        this.canvasCtx.shadowBlur = 15;
                    }
                    if (tusdino.cheats.glow) {
                        this.canvasCtx.shadowColor = "yellow";
                        this.canvasCtx.shadowOffsetX = 0;
                        this.canvasCtx.shadowOffsetY = 0;
                        this.canvasCtx.shadowBlur = 15;
                    }
                    var sourceX = x;
                    var sourceY = y;
                    var sourceWidth =
                        this.ducking && this.status != Trex.status.CRASHED ?
                        this.config.WIDTH_DUCK :
                    this.config.WIDTH;
                    var sourceHeight = this.config.HEIGHT;
                    if (IS_HIDPI) {
                        sourceX *= 2;
                        sourceY *= 2;
                        sourceWidth *= 2;
                        sourceHeight *= 2;
                    }
                    sourceX += this.spritePos.x;
                    sourceY += this.spritePos.y;
                    if (this.ducking && this.status != Trex.status.CRASHED) {
                        this.canvasCtx.drawImage(
                            Runner.imageSprite
                            , sourceX
                            , sourceY
                            , sourceWidth
                            , sourceHeight
                            , this.xPos
                            , (Runner.instance_.tRex.yPos+Runner.instance_.tRex.config.HEIGHT)-(Runner.instance_.tRex.config.HEIGHT*((tusdino.cheats.size)))
                            , Runner.instance_.tRex.config.WIDTH_DUCK*(tusdino.cheats.size)
                            , Runner.instance_.tRex.config.HEIGHT*(tusdino.cheats.size)
                        );
                    } else {
                        if (this.ducking && this.status == Trex.status.CRASHED) {
                            this.xPos++;
                        }
                        this.canvasCtx.drawImage(
                            Runner.imageSprite
                            , sourceX
                            , sourceY
                            , sourceWidth
                            , sourceHeight
                            , this.xPos
                            , (Runner.instance_.tRex.yPos+Runner.instance_.tRex.config.HEIGHT)-(Runner.instance_.tRex.config.HEIGHT*((tusdino.cheats.size)))
                            , Runner.instance_.tRex.config.WIDTH*(tusdino.cheats.size)
                            , Runner.instance_.tRex.config.HEIGHT*(tusdino.cheats.size)
                        );
                    }
                    if (tusdino.cheats.rainbowglow) {
                        this.canvasCtx.shadowColor = "";
                        this.canvasCtx.shadowOffsetX = 0;
                        this.canvasCtx.shadowOffsetY = 0;
                        this.canvasCtx.shadowBlur = 0;
                    }
                    if (tusdino.cheats.glow) {
                        this.canvasCtx.shadowColor = "";
                        this.canvasCtx.shadowOffsetX = 0;
                        this.canvasCtx.shadowOffsetY = 0;
                        this.canvasCtx.shadowBlur = 0;
                    }
                };

                Runner.instance_.update = function () {
                    customUpdate.call(Runner.instance_);
                    if (!tusdino.cheats.forcepause) {
                        if (tusdino.cheats.obstacleFloat) {
                            if (Runner.instance_.horizon.obstacles[0]) {
                                for (var i in Runner.instance_.horizon.obstacles) {
                                    Runner.instance_.horizon.obstacles[i].yPos = 25;
                                }
                            }
                        }

                        if (tusdino.cheats.objectEsp) {
                            var ctx = Runner.instance_.canvasCtx;
                            if (Runner.instance_.horizon.obstacles[0]) {
                                for (var i in Runner.instance_.horizon.obstacles) {
                                    ctx.beginPath();
                                    ctx.strokeStyle = "#EB5834";
                                    ctx.strokeRect(
                                        Runner.instance_.horizon.obstacles[i].xPos - 1
                                        , Runner.instance_.horizon.obstacles[i].yPos - 0.5
                                        , Runner.instance_.horizon.obstacles[i].width + 3
                                        , Runner.instance_.horizon.obstacles[i].typeConfig.height + 2
                                    );
                                    ctx.stroke();
                                }
                            }
                        }

                        if (tusdino.cheats.rainbowSquarePlayer) {
                            Runner.instance_.canvasCtx.beginPath();
                            hslStart = true;
                            Runner.instance_.canvasCtx.fillStyle = hslCol;
                            Runner.instance_.canvasCtx.fillRect(
                                Runner.instance_.tRex.xPos
                                , Runner.instance_.tRex.ducking ?
                                Runner.instance_.tRex.yPos + 15 :
                                Runner.instance_.tRex.yPos
                                , Runner.instance_.tRex.ducking ?
                                Runner.instance_.tRex.config.WIDTH_DUCK + 2 :
                                Runner.instance_.tRex.config.WIDTH + 2
                                , Runner.instance_.tRex.ducking ?
                                Runner.instance_.tRex.config.HEIGHT_DUCK + 2 :
                                Runner.instance_.tRex.config.HEIGHT + 2
                            );
                            Runner.instance_.canvasCtx.closePath();
                        }
                        if (tusdino.cheats.arc) {
                            Runner.instance_.canvasCtx.beginPath();
                            Runner.instance_.canvasCtx.strokeStyle = "#FF0000";
                            Runner.instance_.canvasCtx.arc(
                                Runner.instance_.tRex.xPos + 23
                                , Runner.instance_.tRex.yPos + 20
                                , 30
                                , 0
                                , 2 * Math.PI
                            );
                            Runner.instance_.canvasCtx.stroke();
                        }

                        if (tusdino.cheats.watermark) {
                            var ctx = Runner.instance_.canvasCtx;

                            function ff() {
                                ctx.beginPath();
                                ctx.globalAlpha = 0.6;
                                ctx.fillStyle = "#212121";
                                ctx.fillRect(4, 4, 70, 30);
                                ctx.globalAlpha = 1;
                                ctx.closePath();
                            }

                            function dd() {
                                ctx.beginPath();
                                ctx.globalAlpha = 0.6;
                                ctx.strokeStyle = "#425AF5";
                                ctx.strokeRect(3, 3, 72, 32);
                                ctx.globalAlpha = 1;
                                ctx.closePath();
                            }

                            function hh() {
                                ctx.beginPath();
                                ctx.globalAlpha = 1;
                                ctx.fillStyle = "#FFFFFF";
                                ctx.font = "bolder 15px sans-serif";
                                ctx.fillText(atob("VHVzRGlubw=="), 10, 24, 25252);
                                ctx.globalAlpha = 1;
                                ctx.closePath();
                            }
                            dd();
                            ff();
                            hh();
                        }
                        if (Runner.instance_.horizon.obstacles[0] && tusdino.cheats.tracer) {
                            for (var i in Runner.instance_.horizon.obstacles) {
                                Runner.instance_.canvasCtx.beginPath();
                                hslStart = true;
                                Runner.instance_.canvasCtx.moveTo(
                                    Runner.instance_.tRex.xPos + 23
                                    , Runner.instance_.tRex.yPos + 10
                                );
                                Runner.instance_.canvasCtx.lineTo(
                                    Runner.instance_.horizon.obstacles[i].xPos + 10
                                    , Runner.instance_.horizon.obstacles[i].yPos + 10
                                );
                                Runner.instance_.canvasCtx.strokeStyle = hslCol;
                                Runner.instance_.canvasCtx.stroke();
                            }
                        }
                        if (
                            Runner.instance_.horizon.obstacles[0] &&
                            tusdino.cheats.lazervisual
                        ) {
                            if (!laz) laz = Runner.instance_.horizon.obstacles[0];
                            Runner.instance_.canvasCtx.beginPath();
                            Runner.instance_.canvasCtx.moveTo(
                                Runner.instance_.tRex.xPos + 23
                                , Runner.instance_.tRex.yPos + 10
                            );
                            Runner.instance_.canvasCtx.lineTo(laz.xPos + 10, laz.yPos + 10);
                            Runner.instance_.canvasCtx.strokeStyle = "Red";
                            Runner.instance_.canvasCtx.stroke();
                            if (tusdino.cheats.lazer)
                                Runner.instance_.horizon.obstacles.length > 0 ?
                                    (Runner.instance_.horizon.obstacles =
                                     Runner.instance_.horizon.obstacles.slice(
                                    1
                                    , Runner.instance_.horizon.obstacles.length
                                )) :
                                "";
                            tusdino.cheats.lazer = false;
                        }
                        if (
                            Runner.instance_.horizon.obstacles[0] &&
                            tusdino.cheats.notifier
                        ) {
                            for (var i in Runner.instance_.horizon.obstacles) {
                                Runner.instance_.canvasCtx.beginPath();
                                Runner.instance_.canvasCtx.moveTo(
                                    Runner.instance_.horizon.obstacles[i].xPos - 70
                                    , 130
                                );
                                Runner.instance_.canvasCtx.lineTo(
                                    Runner.instance_.horizon.obstacles[i].xPos - 40
                                    , 130
                                );
                                Runner.instance_.canvasCtx.strokeStyle = "Blue";
                                Runner.instance_.canvasCtx.stroke();
                            }
                        }
                        if (tusdino.cheats.esp) {
                            Runner.instance_.canvasCtx.beginPath();
                            Runner.instance_.canvasCtx.strokeStyle = "Red";
                            Runner.instance_.canvasCtx.rect(
                                Runner.instance_.tRex.xPos
                                , Runner.instance_.tRex.ducking ?
                                Runner.instance_.tRex.yPos + 15 :
                                Runner.instance_.tRex.yPos
                                , Runner.instance_.tRex.ducking ?
                                Runner.instance_.tRex.config.WIDTH_DUCK + 2 :
                                Runner.instance_.tRex.config.WIDTH + 2
                                , Runner.instance_.tRex.ducking ?
                                Runner.instance_.tRex.config.HEIGHT_DUCK + 2 :
                                Runner.instance_.tRex.config.HEIGHT + 2
                            );
                            Runner.instance_.canvasCtx.stroke();
                        }
                    }
                };
                var darkMode = ((typeof getMetablockData().find((a) => a.block == 'dark-mode') != typeof undefined) ? (getMetablockData().find((a) => a.block == 'dark-mode').data.startsWith('on')) : (true));;
                // Style and UI
                var StylePanel = document.createElement("style");
                StylePanel.innerHTML = `
        #tradingmenu hr {
    border: solid 0.1px white;
    border-radius: 66px;
}
#tradingtabs::-webkit-scrollbar {
  display: none;
}

#tradingtabs::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  background-color: #aaa; /* or add it to the track */
}

#tradingtabs::-webkit-scrollbar-thumb {
  background: #000;
}
#tradingpagesettings button {
    border-radius: 0;
    color: #adadad;
    border: solid 2px #adadad;
}
        .tradingshow button {
    background: none;
    border: solid 1px #a7a7ff;
    color: #a7a7ff;
    padding: 7px;
    transition: 0.5s;
    cursor: pointer;
    height: 30px;
    float: initial;
    border-radius: 20px;
    font-weight: bolder;
    padding-left: 18px;
    padding-right: 18px;
        }
#tradingmenuheader {
    line-height: 1.13;
}
        .tradingshow .tradingcheckbox {
            background: none;
    border: solid 1px #1212a5;
    color: #4d4df5;
    margin-bottom:5px;
    padding: 7px;
    transition: 0.5s;
    cursor: pointer;
    border-radius: 90px;
    padding-left: 18px;
    padding-right: 18px;
        }
        .tradingshow .tradingcheckbox:hover {
    background: none;
    border: solid 1px #1313b9;
    color: #0404cb;
    padding: 7px;
    transition: 0.5s;
    cursor: pointer;
    border-radius: 90px;
    padding-left: 18px;
    padding-right: 18px;
        }
        .swal2-container {
        z-index: 100000000000000000000;
        }
        .tradingshow button:hover {
    border: solid 1px #7d7dff;
    transition: 0.5s;
    color: #8080ff;
        }
        .tradingshow input::placeholder {
           color: #8272bf;
           opacity:0.8;
           transition:1s;
        }
        .tradingshow input:focus::placeholder {
    color: #86c7ff;
           transition:1s;
        }
        .tradingshow input:focus {
    border-color: #86c7ff;
    transition: 1s;
}
        .tradingshow input {
          padding: 7px;
    transition: 1s;
    outline: none;
    margin-bottom:5px;
          border-radius: 20px;
       border: solid 1px #a7a7ff;
       color: #a7a7ff;
    background: transparent;
    }
        .tradingtab {
    font-weight: 700;
    padding: 0px;
    border-radius: 0px;
    height: -webkit-fill-available;
    width: 100px;
    line-height: 2;
    font-family: system-ui;
                margin:0;
    background: transparent;
    font-size: 15px;
    cursor: pointer;
    border: none;
    ${
                // Gone for now
                /*
        `border-left: solid 1px #9191ff;
    border-right: solid 1px #9191ff;
    `
    */
                ``
            }
    color: #855dff;
}
.tradingpage {
text-align: left;
    z-index: -1;
    display: none;
}
.tradingshow {
    z-index: 1;
    padding: 10px;
    font-weight: 400;
    display: block;
}
.tradinginputset {
    display: inline-flex;
}
.tradinginputset button {
    margin-bottom:5px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
}
.tradinginputset select {
    background: none;
    border: solid 1px #a7a7ff;
    color: #a7a7ff;
    padding: 7px;
    transition: 0.5s;
    cursor: pointer;
    width: 120px;
    outline: none;
    height: 30px;
    float: initial;
    text-align: center;
    border-radius: 20px;
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0px;
    padding-left: 18px;
    padding-right: 18px;
}
#tradingborder {
    background: linear-gradient(45deg, #a9b8ff, #4b10ff);
    height: 2px;
   animation: an 30s ease infinite;
   background-size: 1000% 1000%;
}


.tradingactive {
 filter: brightness(1.2);
 font-weight: 400;
}
            #tradingmenu {
            color: white;
            font-weight: 400;
            font-size: initial;
            font-family: sans-serif;
            }
            #tradingmenu *:not(button, input, .tradingtab) {
                cursor:default;
                margin:0;
    box-sizing: revert;
            }
            #tradingmenu a {
                color: white;
    text-decoration: underline;
    cursor: pointer;
            }
.tradingshow input {
        margin:0;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    font-size: 13px;
    box-sizing: revert;
    line-height: 14px;
    cursor: text;
    margin-bottom:5px;
}
        .tradingshow button {
        margin:0;
    font-size: 13px;
    line-height: 14px;
    box-sizing: revert;
        cursor: pointer;
           margin-bottom:5px;
        }`;
                var Panel = document.createElement("div");
                Panel.innerHTML = `<div style="transform: scale(0.8); top: 98px; position: fixed; left: 309px; z-index: 2147483647;" id="tradingmenu">
  <div style="
    height: 353px;
    font-weight: bolder;
    width: 599px;
    background: #1a1a1a;
">
    <div style="">
      <div style="
    font-size: 20px;
    font-family: revert;
    padding-top: 6px;
    padding-left: 6px;
    padding-bottom: 4px;
" id="tradingmenuheader">${atob("VHVzRGlubw==")} - <i style="
    font-size: 16px;
">${tusdino.info.version} [By ${atob(
                    "TGFwaWRl"
                )}]</i><img src="https://github.com/Fault-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/assets/Logo.png?raw=true" style="height: 24px;position: fixed;display: inline;margin-top: -2px;margin-left: 2px;right: 274px;margin-right: 3px;"><a target="blank" href="https://discord.gg/6eaDrx5J9s" style="
    font-size: 17px;
    color: lightblue;
    float: right;
    margin-right: 11px;
    cursor: pointer;
">Discord</a><a target="blank" href="https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu" style="
    font-size: 17px;
    color: lightblue;
    float: right;
    margin-right: 10px;
    cursor: pointer;
">Github</a><a target="blank" href="https://www.youtube.com/channel/UCRA3KXViuDmsmfuP0RF45_w?sub_confirmation=1" style="
    font-size: 17px;
    color: lightblue;
    float: right;
    margin-right: 10px;
    cursor: pointer;
">YouTube</a>
      </div>
      <div id="tradingborder" style="
"></div>
      <div id="trading_contents" style="">
        <div style="
    height: 44px;
    outline: none;
    display: flex;
    overflow-x: auto;
    background: #16161a;
    border-bottom: solid 2px #6e6dc7;
">
          <button tab="main" title="Cheats that effect the player" class="tradingtab tradingactive">Player</button>
          <button tab="game" title="Cheats that effect the whole game" class="tradingtab">Game</button>
          <button tab="movement" title="Cheats that effect the movement" class="tradingtab">Movement</button>
          <button tab="visual" title="Cheats that effect the visuals of the game" class="tradingtab">Visuals</button>
          <button tab="dev" title="Developer tools to help better modify the game" class="tradingtab">Developer</button>
          <button tab="other" title="Cheats and utilities to better edit the game, or just random unkwon cheats to bug the game (Random cheats I created)" class="tradingtab">Miscs</button>
          <button tab="settings" title="Change the settings of cheats or the UI. Or TusDino in general [COMING SOON]" class="tradingtab">Settings</button>
        </div>
        <div>
        <div style="
    background: #161616;
    height: 223px;
    overflow-y: auto;
" id="tradingtabs">

          <div class="tradingshow" id="tradingpagemain" style="">
<div class="tradinginputset"><button id="setsize" title="Doubles the Dinos Size by a number">Set Double Dino Size</button><input id="setsizecheatinput" style="
    width: 78px;" value = "1" placeholder="1"></div>
 <button id="noclip" class="tradingcheckbox" title="You can phase thru any object and enemy">No Clip - OFF</button>
 <button id="instantrespawn" class="tradingcheckbox" title="Instantly respawns when you die">Instant Respawn - OFF</button>
     <button id="invisibilitycheat" class="tradingcheckbox" title="Makes the player invisible">Invisibility - OFF</button>
     <button id="bhop" class="tradingcheckbox" title="Makes the player jump automatically">Bhop - OFF</button>
     <button id="restartgame" title="Need a restart? Try this, it will force your player to respawn">Restart</button>
 <button id="killplayer" title="Instantly kills your T-Rex player">Kill Player</button>
 <button id="autoplayer" class="tradingcheckbox" title="Make a bot play for you (Note: This isn't the best autoplayer, it will still lose sometimes, we might change this to a better autoplayer)">Autoplayer - OFF</button>
  <div class="tradinginputset"><button id="setgravity" title="Change the gravity of the tRex to whatever you want">Set Gravity</button><input id="setgravitycheatinput" style="
    width: 78px;" value = "0.6" placeholder="0.6"></div>
      <div class="tradinginputset"><button id="setskin" title="Changes the dino skin to a list of skins, this will soon be customizable">Set Skin (Buggy)</button><select id="setskincheatselect">
      <option value="default">Default</option>
      <option value="batman">Batman Colored</option>
      <option value="sonic">Sonic</option>
      <option value="soniccol">Sonic Colored</option>
      <option value="soniccol2">Sonic Colored (2)</option>
      <option value="dinocol">Dino Colored</option>
      <option value="dinocol2">Dino Colored (2)</option>
      <option value="godzilla">Godzilla Colored</option>
      <option value="joker">Joker Colored</option>
      <option value="mario">Mario</option>
      <option value="mariocol">Mario Colored</option>
      <option value="mario2">Mario (2)</option>
      <option value="mariocol2">Mario Colored (2)</option>
      <option value="minecraft">Minecraft</option>
      <option value="naruto">Naruto Colored</option>
      <option value="noface">Noface Halloween</option>
      <option value="nyancat">Nyan Cat</option>
      <option value="pikachu">Pikachu</option>
      <option value="santa">Santa Colored</option>
      <option value="pikachucol">Pikachu Colored</option>
      </select>
      </div>
          </div>

          <div class="tradingpage" id="tradingpageother" style="">
 <button id="rainbowbackground" class="tradingcheckbox" title="Make the background become rainbow">Rainbow Background - OFF</button>
 <button id="rainbowsquareplayer" class="tradingcheckbox" title="Make the player become rainbow square">Rainbow Square Player - OFF</button>
 <button id="stormcloud" class="tradingcheckbox" title="Continuously spam clouds in the sky">Storm Cloud - OFF</button>
 <button id="obstacleFloat" class="tradingcheckbox" title="Makes all near-by obstacles go up in the air">Obstacle Float - OFF</button>
 <button id="arc" class="tradingcheckbox" title="Puts a red circle ring around the player">Arc - OFF</button>
          <button id="toggledarkmode" title="Enable or disable in-game dark mode">Dark Game Mode - ${darkMode ? "ON" : "OFF"}</button>
 <button id="noobstacle" class="tradingcheckbox" title="Removes all nearby obstacles">No Obstacle - OFF</button>
     <button id="lazervison" title="It remove the nearest obstacle, with a lazer">Lazer Vision</button>
     <button id="lazervisonkey" class="tradingcheckbox" title="If you press L, it will active lazer vison">Lazer Vision Key (L) - OFF</button>
 <button id="obliterate" class="tradingcheckbox" title="When the player collides with the obstacle, the obstacle gets destroyed instead of the player">Obliterate Obstacles - OFF</button>
               <button id="addcloud" title="Forces a cloud into the game">Add Cloud</button>
               <button id="removecloud" title="Removes the newest cloud">Remove Cloud</button>
               <button id="removeallcloud" title="Removes all clouds">Remove All Clouds</button>
               <button id="removeallobstacle" title="Removes all near-by obstacles">Remove Near Obstacles</button>
               <button id="removeobstacle" title="Removes the nearest obstacle">Remove Obstacle</button>
               <button id="addobstacle" title="Creates a new obstacle">Add Obstacle</button>
          <p>
          </div>
          <div class="tradingpage" id="tradingpagesettings" style="">
          <div style="margin-bottom: 19px;">
    <h2><img src="https://cdn.glitch.global/4aba5d04-d76d-4769-bec8-f2da58f4b0ac/SettingsIcon.png?v=1680464901415" height="30" style="
    position: relative;
    top: 7px;
">Settings</h2>
</div>

<div><button title="Credits for TusDino" id="tradingcredits">Credits</button> <button title="What's new in your TusDino version" id="tradingwhatsnew">Whats New</button>
<br>
<div class="tradinginputset"><button id="setmenuscale" title="Changes the mod menu's scale">Set Menu Scale</button><input id="setmenuscaleinput" style="
    width: 78px;" min="0.7" max="1.2" value="0.9" placeholder="0.9" type = "number" step="0.1"></div>
    <br>
    <div class="tradinginputset"><button id="setmenuopacity" title="Changes the mod menu's opacity">Set Menu Opacity</button><input id="menuopacityinput" style="
    width: 78px;" min="0.2" max="1" value="1" placeholder="1" type = "number" step="0.1"></div>
</div>
<br>
<hr>
          </div>
          <div class="tradingpage" id="tradingpagedev" style="">
    <div class="tradinginputset"><button id="setxaxis" title="Changes the players X axis">Teleport X axis</button><input id="setxaxischeatinput" style="
    width: 78px;" value = "0" placeholder="0"></div>
    <div class="tradinginputset"><button id="setyaxis" title="Changes the players Y axis">Teleport Y axis</button><input id="setyaxischeatinput" style="
    width: 78px;" value = "93" placeholder="93"></div>
          </div>
          <div class="tradingpage" id="tradingpagemovement" style="">
<div class="tradinginputset"><button id="setspeed" title="Sets your players speed, if you put too much it can bug out">Set Speed</button><input id="setspeedcheatinput" style="
    width: 78px;" value = "6.5" placeholder="6.5"></div>
<div class="tradinginputset"><button id="setjumpheight" title="Changes how high the Trex can jump">Set Jump Height</button><input id="setjumpheightcheatinput" style="
    width: 78px;" value = "10" placeholder="10"></div>
<div class="tradinginputset"><button id="setdropvelocity" title="Changes how high the Trex can jump">Set Drop Velocity</button><input id="setdropvelocitycheatinput" style="
    width: 78px;" value = "-10" placeholder="-10"></div>
 <button id="glide" class="tradingcheckbox" title="Make's your player glide into the air and fly until ducking">Glide - OFF</button>
 <button id="fly" class="tradingcheckbox" title="You now have the ability to fly! You can use 'W' to go higher and 'S' to go lower">Fly - OFF</button>
 <button id="highjump" class="tradingcheckbox" title="Makes you jump higher">High Jump - OFF</button>
 <button id="fastfall" class="tradingcheckbox" title="You can fall more faster">Fast Fall - OFF</button>
 <button id="walk" class="tradingcheckbox" title="You now have the ability to get out of the window and walk use 'A' to go left and 'D' to go right">Walk - OFF</button>
 <button id="obstacleBypass" class="tradingcheckbox" title="This cheat makes you zoom thru the obstacles">Obstacle Bypass - OFF</button>
<div class="tradinginputset"><button id="setwalkspeed" title="Set the walk cheats speed">Set Walk Speed (Walk Cheat)</button><input id="setwalkspeedcheatinput" style="
    width: 78px;" value = "1" placeholder="1"></div>

<div class="tradinginputset"><button id="setflyspeed" title="Set the fly cheats speed">Set Fly Speed (Fly Cheat)</button><input id="setflyspeedcheatinput" style="
    width: 78px;" value = "1" placeholder="1"></div>
 <button id="blockyjump" class="tradingcheckbox" title="You can have a robotic jump">Blocky Jump - OFF</button>
 <button id="airjump" class="tradingcheckbox" title="You can jump forever non-stop">Airjump - OFF</button>
          </div>
          <div class="tradingpage" id="tradingpagevisual" style="">
 <button id="esp" class="tradingcheckbox" title="This cheat shows a box around you">ESP - OFF</button>
 <button id="tracers" class="tradingcheckbox" title="Lines go from you to all the obstacles">Tracers - OFF</button>
     <button id="glow" class="tradingcheckbox" title="Makes the player have a yellow glow around them">Glow - OFF</button>
     <button id="rainbowglow" class="tradingcheckbox" title="Makes the player have a rainbow glow around them">Rainbow Glow - OFF</button>
 <button id="jumpnotifier" class="tradingcheckbox" title="Small lines on the screen tell you where to jump">Jump Notifier - OFF</button>
 <button id="watermark" class="tradingcheckbox" title="A watermark to show you're using TusDino">Watermark - ON </button>
 <button id="obstacleesp" class="tradingcheckbox" title="ESP for obstacles">Obstacle ESP - OFF</button>
          </div>
          <div class="tradingpage" id="tradingpagegame" style="">
<div class="tradinginputset"><button id="setfps" title="Sets your games FPS, which will make it faster">Set FPS</button><input id="setfpscheatinput" style="
    width: 78px;" value = "60" placeholder="60"></div>
 <button id="autofocus" class="tradingcheckbox" title="Automatically focuses on the game whenever you switch out from the tab, it will still play and not pause">Auto Focus - OFF</button>
 <button id="forcefocus" class="tradingcheckbox" title="Just like auto focus, but this time ignores if you ever switched tabs">Force Focus - OFF</button>
 <button id="autocontinuedeath" class="tradingcheckbox" title="Automatically continues the game when you die">Auto Continue Death - OFF</button>
 <button id="continuedeath" class="tradingcheckbox" title="Continues the game when you die">Continue Death</button>
          <div class="tradinginputset"><button id="setgamespeed" title="Sets your games speed, if you put too much it can bug out">Set Game Speed</button><input id="setgamespeedcheatinput" style="
    width: 78px;" value = "0.001" placeholder="0.001"></div>
 <button id="duckAndJump" class="tradingcheckbox" title="You can still jump when ducking">Duck and Jump - OFF</button>
 <button id="playingIntro" class="tradingcheckbox" title="Still get scored while your player is inactive">Playing Intro - OFF</button>
                <div style=""class="tradinginputset"><button id="setscore" title="Sets your players score" style="">Set Score</button><input id="setscorecheatinput" style="
    width: 78px;" value = "999999" placeholder="999999"></div><div style=""class="tradinginputset"><button id="sethighscore" title="Sets your players highest score" style="">Set Highest Score</button><input id="sethighscorecheatinput" style="
    width: 78px;" value = "999999" placeholder="999999"></div>
 <button id="mutegame" class="tradingcheckbox" title="Use this if you're tired of hearing the sound">Mute Game - OFF</button>
 <button id="forcepausegame" class="tradingcheckbox" title="Need to pause the game and everything in the game? Use this">Force Pause Game - OFF</button>
 <button id="pausegame" class="tradingcheckbox" title="Need to pause the game and everything in the game? Use this">Pause - OFF</button>
 <div class="tradinginputset"><button id="setscorespeed" title="This will change how fast your score adds up">Set Score Speed</button><input id="setscorespeedcheatinput" style="
    width: 78px;" value = "30" placeholder="30"></div>
<div class="tradinginputset"><button id="setgroundy" title="Change the Y position of the ground">Set Ground Y</button><input id="setgroundycheatinput" style="
    width: 78px;" value = "93" placeholder="93"></div>
          </div>

        </div>
        <div style="
    border-top: solid 1px #4f4fe9;
    font-weight: 100;
    display: flex;
    color: #6b6bff;
    justify-content: space-between;
"><div style="
    color: white;
    text-align: left;

    line-height: 3.4;
    font-size: 14px;
    margin-left: 6px;
"><a href="https://github.com/Fault-Utilities/TusDino-Chrome-Dino-Mod-Menu/issues/new">Report an issue</a> • <a href="https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/discussions/new?category=suggestions">Suggest option</a> • <a href="https://github.com/Fault-Utilities/TusDino-Chrome-Dino-Mod-Menu/fork">Fork the Github</a>
          </div><div style="
    align-self: center;
    font-size: 14px;
    margin-right: 7px;
    background: transparent;
    line-height: 109%;
    " title="Info">*${tusdino.config.hotkeys.togglemenu.toUpperCase()} to hide/show the menu*<br>Version: ${
                tusdino.info.version
            }<br>Game URL: ${location.hostname}</div></div>
        </div>
      </div>
    </div>
  </div>
  <div style="
    height: 359px;
    width: 603px;
    top: -3px;
    left: -2px;
    z-index: -1;
    position: inherit;
    background: linear-gradient(45deg, #a9b8ff, #4b10ff);
"></div>
</div>`;
                document.body.prepend(Panel);
                document.body.prepend(StylePanel);

                function dragElement(elmnt) {
                    var pos1 = 0
                    , pos2 = 0
                    , pos3 = 0
                    , pos4 = 0;
                    if (document.getElementById(elmnt.id + "header")) {
                        document.getElementById(elmnt.id + "header").onmousedown =
                            dragMouseDown;
                    } else {
                        elmnt.onmousedown = dragMouseDown;
                    }

                    function dragMouseDown(e) {
                        e = e || window.event;
                        e.preventDefault();
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        document.onmouseup = closeDragElement;
                        document.onmousemove = elementDrag;
                    }

                    function elementDrag(e) {
                        e = e || window.event;
                        e.preventDefault();
                        pos1 = pos3 - e.clientX;
                        pos2 = pos4 - e.clientY;
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
                        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
                    }

                    function closeDragElement() {
                        document.onmouseup = null;
                        document.onmousemove = null;
                    }
                }
                var hslI = 0;
                var hslCol = "rgb(0, 74 55)";
                var hslUp = false;
                var hslUp2 = false;
                var laz = false;
                var hslStart = false;

                setInterval(() => {
                    if (hslStart) {
                        hslUp = hslUp ? hslI > -1 : hslI < 361;
                        hslCol = "rgb(" + HSLToRGB(hslI, 74, 55).join(", ") + ")";
                        if (hslUp) {
                            ++hslI;
                        } else {
                            --hslI;
                        }
                    }
                });

                Runner.instance_.clearCanvas = function () {
                    tusdino.saved.clearCanvas.call(this);
                };
                for (
                    var i = 0; i < document.getElementsByClassName("tradingtab").length;
                    ++i
                ) {
                    document
                        .getElementsByClassName("tradingtab")[i].addEventListener("click", function () {
                        for (
                            var gg = 0; gg < document.getElementsByClassName("tradingshow").length;
                            ++gg
                        ) {
                            document.getElementsByClassName("tradingshow")[gg].className =
                                "tradingpage";
                        }
                        for (
                            var bb = 0; bb < document.getElementsByClassName("tradingactive").length;
                            ++bb
                        ) {
                            document.getElementsByClassName("tradingactive")[bb].className =
                                "tradingtab";
                        }
                        // console.log(this);
                        this.classList.add("tradingactive");
                        document.getElementById(
                            "tradingpage" + this.getAttribute("tab")
                        ).className = "tradingshow";
                    });
                }
                dragElement(Panel.children[0]);
                var show = false;
                document.addEventListener("keydown", function (e) {
                    //console.log(e);
                    if (
                        e.key.toLowerCase() == tusdino.config.hotkeys.togglemenu &&
                        (e.path ? e.path[0].tagName != "INPUT" : e)
                    ) {
                        show = !show;
                        Panel.style.display = show ? "block" : "none";
                    }
                    if (tusdino.cheats.lazerv) {
                        if (e.key.toLowerCase() == "l") {
                            tusdino.cheats.lazervisual = true;
                            tusdino.cheats.lazer = true;
                            setTimeout(() => {
                                tusdino.cheats.lazervisual = false;
                                laz = false;
                            }, 50);
                        }
                    }
                    if (tusdino.cheats.allowFlyMode) {
                        if (
                            e.key.toLowerCase() == "w" &&
                            (e.path ? e.path[0].tagName != "INPUT" : e)
                        ) {
                            goflydown = true;
                        }
                        if (
                            e.key.toLowerCase() == "s" &&
                            (e.path ? e.path[0].tagName != "INPUT" : e)
                        ) {
                            goflyup = true;
                        }
                    }
                    if (tusdino.cheats.walk) {
                        if (
                            e.key.toLowerCase() == "d" &&
                            (e.path ? e.path[0].tagName != "INPUT" : e)
                        ) {
                            goright = true;
                        }
                        if (
                            e.key.toLowerCase() == "a" &&
                            (e.path ? e.path[0].tagName != "INPUT" : e)
                        ) {
                            goleft = true;
                        }
                    }
                });
                document.addEventListener("keyup", function (e) {
                    if (tusdino.cheats.allowFlyMode) {
                        if (
                            e.key.toLowerCase() == "w" &&
                            (e.path ? e.path[0].tagName != "INPUT" : e)
                        ) {
                            goflydown = false;
                        }
                        if (
                            e.key.toLowerCase() == "s" &&
                            (e.path ? e.path[0].tagName != "INPUT" : e)
                        ) {
                            goflyup = false;
                        }
                    }
                    if (tusdino.cheats.walk) {
                        if (
                            e.key.toLowerCase() == "d" &&
                            (e.path ? e.path[0].tagName != "INPUT" : e)
                        ) {
                            goright = false;
                        }
                        if (
                            e.key.toLowerCase() == "a" &&
                            (e.path ? e.path[0].tagName != "INPUT" : e)
                        ) {
                            goleft = false;
                        }
                    }
                });

                // Listeners / Clicks
                tusdino.onclick("killplayer", function () {
                    var n = Runner.instance_.gameOver;
                    Runner.instance_.gameOver = tusdino.saved.gameOver;
                    if (Runner.instance_.gameOver.toString() !== "function() {}") {
                        if (tusdino.cheats.instantrespawn) {
                            Runner.instance_.gameOver();
                            Runner.instance_.restart();
                        } else {
                            Runner.instance_.gameOver();
                        }
                        tusdino.msg("Killed player");
                    } else {
                        swal.fire({
                            icon: "error"
                            , title: "Can't kill player"
                            , text: "Unable to kill player, can be due to a cheat preventing this being enabled."
                            , });
                        tusdino.logs.error("Unable to kill dino (killplayer)");
                    }
                    Runner.instance_.gameOver = n;
                });
                tusdino.onclick("setspeed", function () {
                    var inp = parseFloat(
                        document.getElementById("setspeedcheatinput").value
                    );
                    if (!isNaN(inp)) {
                        Runner.instance_.setSpeed(inp);
                        tusdino.msg("Set Speed to " + inp);
                    }
                });
                tusdino.onclick("setsize", function () {
                    var inp = parseFloat(
                        document.getElementById("setsizecheatinput").value
                    );
                    if (!isNaN(inp)) {
                        tusdino.cheats.size = inp;
                        Runner.instance_.tRex.yPos = Runner.instance_.tRex.groundYPos;
                        tusdino.msg("Set Size to " + inp);
                    }
                });
                tusdino.onclick("setjumpheight", function () {
                    var inp = parseFloat(
                        document.getElementById("setjumpheightcheatinput").value
                    );
                    if (!isNaN(inp)) {
                        Runner.instance_.tRex.setJumpVelocity(inp);
                        tusdino.msg("Set Jump Heigh to " + inp);
                    }
                });
                tusdino.onclick("setdropvelocity", function () {
                    var inp = parseFloat(
                        document.getElementById("setdropvelocitycheatinput").value
                    );
                    if (!isNaN(inp)) {
                        Runner.instance_.tRex.config.DROP_VELOCITY = (inp);
                        tusdino.msg("Set Drop Velocity to " + inp);
                    }
                });
                tusdino.onclick("setfps", function () {
                    var inp = parseFloat(
                        document.getElementById("setfpscheatinput").value
                    );
                    if (!isNaN(inp)) {
                        FPS = (inp);
                        tusdino.msg("Set FPS to " + inp);
                    }
                });
                tusdino.onclick("setgamespeed", function () {
                    var inp = parseFloat(
                        document.getElementById("setgamespeedcheatinput").value
                    );
                    if (!isNaN(inp)) {
                        Runner.instance_.config.ACCELERATION = inp;
                        tusdino.msg("Set game speed to " + inp);
                    }
                });
                tusdino.onclick("setscore", function () {
                    var inp = parseFloat(
                        document.getElementById("setscorecheatinput").value
                    );
                    if (!isNaN(inp)) {
                        Runner.instance_.distanceRan =
                            inp / Runner.instance_.distanceMeter.config.COEFFICIENT;
                        tusdino.msg("Set score to " + inp);
                    }
                });
                tusdino.onclick("sethighscore", function () {
                    var inp = parseFloat(
                        document.getElementById("sethighscorecheatinput").value
                    );
                    if (!isNaN(inp)) {
                        Runner.instance_.highestScore =
                            inp / Runner.instance_.distanceMeter.config.COEFFICIENT;
                        Runner.instance_.distanceMeter.setHighScore(
                            inp / Runner.instance_.distanceMeter.config.COEFFICIENT
                        );
                        tusdino.msg("Set highest score to " + inp);
                    }
                });
                tusdino.onclick("setgroundy", function () {
                    var inp = parseFloat(
                        document.getElementById("setgroundycheatinput").value
                    );
                    if (!isNaN(inp)) {
                        Runner.instance_.tRex.groundYPos = inp;
                        Runner.instance_.tRex.startJump(0.5);
                        tusdino.msg("Set ground Y to " + inp);
                    }
                });
                tusdino.onclick("setscorespeed", function () {
                    var inp = parseFloat(
                        document.getElementById("setscorespeedcheatinput").value
                    );
                    if (!isNaN(inp)) {
                        Runner.instance_.msPerFrame = inp / 2;
                        tusdino.msg("Set score speed to " + inp);
                    }
                });
                tusdino.onclick("setxaxis", function () {
                    var inp = parseFloat(
                        document.getElementById("setxaxischeatinput").value
                    );
                    if (!isNaN(inp)) {
                        Runner.instance_.tRex.xPos = inp;
                        tusdino.msg("Set X axis to " + inp);
                    }
                });
                tusdino.onclick("setyaxis", function () {
                    var inp = parseFloat(
                        document.getElementById("setyaxischeatinput").value
                    );
                    if (!isNaN(inp)) {
                        Runner.instance_.tRex.yPos = inp;
                        tusdino.msg("Set Y axis to " + inp);
                    }
                });
                tusdino.onclick("setgravity", function () {
                    var inp = parseFloat(
                        document.getElementById("setgravitycheatinput").value
                    );
                    if (!isNaN(inp)) {
                        Runner.instance_.tRex.config.GRAVITY = inp;
                        tusdino.msg("Set gravity to " + inp);
                    }
                });
                tusdino.onclick("setwalkspeed", function () {
                    var inp = parseFloat(
                        document.getElementById("setwalkspeedcheatinput").value
                    );
                    if (!isNaN(inp)) {
                        xSpeed = inp;
                        tusdino.msg("Set walk speed to " + inp);
                    }
                });
                tusdino.onclick("setflyspeed", function () {
                    var inp = parseFloat(
                        document.getElementById("setflyspeedcheatinput").value
                    );
                    if (!isNaN(inp)) {
                        ySpeed = inp;
                        tusdino.msg("Set fly speed to " + inp);
                    }
                });

                let setSkin = function (x1, x2) {
                    let x_1 = document.getElementById("offline-resources-1x");
                    let x_2 = document.getElementById("offline-resources-2x");
                    if (x1) x_1.src = x1;
                    if (x2) x_2.src = x2;
                };

                var skins = {
                    default: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/default.png?raw=true"
                    , batman: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/batman%20colored.png?raw=true"
                    , dinocol2: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/dino%20colored%202.png?raw=true"
                    , dinocol: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/dino%20colored.png?raw=true"
                    , godzilla: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/godzilla.png?raw=true"
                    , joker: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/joker.png?raw=true"
                    , mario2: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/mario%202.png?raw=true"
                    , mariocol2: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/mario%20colored%202.png?raw=true"
                    , mariocol: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/mario%20colored.png?raw=true"
                    , mario: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/mario.png?raw=true"
                    , minecraft: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/minecraft.png?raw=true"
                    , naruto: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/naruto%20colored.png?raw=true"
                    , noface: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/noface%20halloween.png?raw=true"
                    , nyancat: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/nyan%20cat.png?raw=true"
                    , pikachu: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/pikachu.png?raw=true"
                    , santa: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/santa%20colored.png?raw=true"
                    , soniccol2: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/sonic%20colored%202.png?raw=true"
                    , soniccol: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/sonic%20colored.png?raw=true"
                    , sonic: "https://github.com/Case-Clicker-2-Utilities/TusDino-Chrome-Dino-Mod-Menu/blob/main/skins/sonic.png?raw=true"
                    , };

                function setSki(i) {
                    setSkin(skins[i]);
                }
                tusdino.onclick("setskin", function () {
                    var inp = document.getElementById("setskincheatselect").value;
                    setSki(inp);
                    var jsf = false;
                    for (var i in document.querySelector("#setskincheatselect").children) {
                        if (
                            document.querySelector("#setskincheatselect").children[i].value ==
                            document.querySelector("#setskincheatselect").value
                        ) {
                            jsf = document.querySelector("#setskincheatselect").children[i]
                                .innerText;
                        }
                    }
                    if (jsf) {
                        tusdino.msg("Set skin to " + jsf + " [NOTE: SKINS MIGHT BE BUGGY]");
                    }
                });
                tusdino.onclick("noclip", function () {
                    tusdino.cheats.noclip = !tusdino.cheats.noclip;
                    if (tusdino.cheats.noclip) {
                        document.getElementById("noclip").innerText = "No Clip - ON ";
                        tusdino.msg("Enabled No-Clip");
                    } else {
                        document.getElementById("noclip").innerText = "No Clip - OFF";
                        tusdino.msg("Disabled No-Clip");
                    }
                });
                tusdino.onclick("autocontinuedeath", function () {
                    tusdino.cheats.autoContinueDeath = !tusdino.cheats.autoContinueDeath;
                    if (tusdino.cheats.autoContinueDeath) {
                        document.getElementById("autocontinuedeath").innerText = "Auto Continue Death - ON ";
                        tusdino.msg("Enabled Auto Continue Death");
                    } else {
                        document.getElementById("autocontinuedeath").innerText = "Auto Continue Death - OFF";
                        tusdino.msg("Disabled Auto Continue Death");
                    }
                });
                tusdino.onclick("continuedeath", function () {
                    if (tusdino.modules.isDead) {
                        Runner.instance_.horizon.obstacles=[];
                        Runner.instance_.setSpeed(Runner.instance_.config.SPEED);
                        Runner.instance_.activated = true;
                        Runner.instance_.crashed = false;
                        Runner.instance_.tRex.reset();
                        Runner.instance_.tRex.startJump(0.5);
                        tusdino.modules.isDead = false;
                        tusdino.msg("Continued Death and cleared nearby obstacles");
                    } else {
                        tusdino.msg("Unable to continue death, the Trex has to be dead");
                    }
                });
                var blockyjump = false;
                tusdino.onclick("blockyjump", function () {
                    blockyjump = !blockyjump;
                    if (blockyjump) {
                        Runner.instance_.tRex.config.DROP_VELOCITY = 2;
                        document.getElementById("blockyjump").innerText = "Blocky Jump - ON ";
                        tusdino.msg("Enabled Blocky Jump");
                    } else {
                        Runner.instance_.tRex.config.DROP_VELOCITY = -5;
                        document.getElementById("blockyjump").innerText = "Blocky Jump - OFF";
                        tusdino.msg("Disabled Blocky Jump");
                    }
                });
                var highjump = false;
                tusdino.onclick("highjump", function () {
                    highjump = !highjump;
                    if (highjump) {
                        Runner.instance_.tRex.setJumpVelocity(14);
                        document.getElementById("highjump").innerText = "High Jump - ON ";
                        tusdino.msg("Enabled High Jump");
                    } else {
                        Runner.instance_.tRex.setJumpVelocity(10);
                        document.getElementById("highjump").innerText = "High Jump - OFF";
                        tusdino.msg("Disabled High Jump");
                    }
                });
                var pausegame = false;
                tusdino.onclick("pausegame", function () {
                    pausegame = !pausegame;
                    if (pausegame) {
                        Runner.instance_.stop();
                        document.getElementById("pausegame").innerText = "Pause - ON ";
                        tusdino.msg("Enabled Pause");
                    } else {
                        Runner.instance_.play();
                        document.getElementById("pausegame").innerText = "Pause - OFF";
                        tusdino.msg("Disabled Pause");
                    }
                });
                tusdino.onclick("forcepausegame", function () {
                    tusdino.cheats.forcepause = !tusdino.cheats.forcepause;
                    if (tusdino.cheats.forcepause) {
                        document.getElementById("forcepausegame").innerText =
                            "Force Pause - ON ";
                        tusdino.msg("Enabled Force Pause");
                    } else {
                        Runner.instance_.play();
                        document.getElementById("forcepausegame").innerText =
                            "Force Pause - OFF";
                        tusdino.msg("Disabled Force Pause");
                    }
                });
                tusdino.onclick("restartgame", function () {
                    var n = Runner.instance_.gameOver;
                    Runner.instance_.gameOver = tusdino.hacked.saveGameOver;
                    Runner.instance_.gameOver();
                    Runner.instance_.restart();
                    Runner.instance_.gameOver = n;
                    tusdino.msg("Restarted the game");
                });
                tusdino.onclick("mutegame", function () {
                    tusdino.cheats.mute = !tusdino.cheats.mute;
                    if (tusdino.cheats.mute) {
                        document.getElementById("mutegame").innerText = "Mute Game - ON ";
                        tusdino.msg("Enabled Mute");
                    } else {
                        document.getElementById("mutegame").innerText = "Mute Game - OFF";
                        tusdino.msg("Disabled Mute");
                    }
                });
                tusdino.onclick("rainbowsquareplayer", function () {
                    tusdino.cheats.rainbowSquarePlayer = !tusdino.cheats.rainbowSquarePlayer;
                    if (tusdino.cheats.rainbowSquarePlayer) {
                        document.getElementById("rainbowsquareplayer").innerText =
                            "Rainbow Square Player - ON ";
                        tusdino.msg("Enabled Rainbow Square Player");
                    } else {
                        hslStart = false;
                        document.getElementById("rainbowsquareplayer").innerText =
                            "Rainbow Square Player - OFF";
                        tusdino.msg("Disabled Rainbow Square Player");
                    }
                });
                var rainbowbackground = false;

                var oldtrans = document.body.transition;
                var oldbg = document.body.background;

                function flash() {
                    if (rainbowbackground) {
                        document.body.style.transition = "2s ease 0s";
                        document.body.style.background = "red";
                        setTimeout(function () {
                            if (rainbowbackground) {
                                document.body.style.background = "red";
                            }
                        }, 1000);
                        setTimeout(function () {
                            if (rainbowbackground) {
                                document.body.style.background = "orange";
                            }
                        }, 2000);
                        setTimeout(function () {
                            if (rainbowbackground) {
                                document.body.style.background = "yellow";
                            }
                        }, 3000);
                        setTimeout(function () {
                            if (rainbowbackground) {
                                document.body.style.background = "white";
                            }
                        }, 4000);
                        setTimeout(function () {
                            if (rainbowbackground) {
                                document.body.style.background = "green";
                            }
                        }, 5000);
                        setTimeout(function () {
                            if (rainbowbackground) {
                                document.body.style.background = "blue";
                            }
                        }, 6000);
                        setTimeout(function () {
                            if (rainbowbackground) {
                                document.body.style.background = "darkblue";
                            }
                        }, 7000);
                        setTimeout(function () {
                            if (rainbowbackground) {
                                document.body.style.background = "black";
                            }
                        }, 8000);
                        setTimeout(function () {
                            if (rainbowbackground) {
                                document.body.style.background = "red";
                            }
                        }, 9000);
                        setTimeout(function () {
                            if (rainbowbackground) {
                                flash();
                            }
                        }, 9000);
                    }
                }
                tusdino.onclick("rainbowbackground", function () {
                    rainbowbackground = !rainbowbackground;
                    if (rainbowbackground) {
                        flash();
                        document.getElementById("rainbowbackground").innerText =
                            "Rainbow Background - ON ";
                        tusdino.msg("Enabled Rainbow Background");
                    } else {
                        window.oldbg = oldbg;
                        document.body.style.background = oldbg;
                        document.body.style.transition = oldtrans;
                        document.getElementById("rainbowbackground").innerText =
                            "Rainbow Background - OFF";
                        tusdino.msg("Disabled Rainbow Background");
                    }
                });
                var fastfall = false;
                Runner.instance_.tRex.startJump = function (speed) {
                    if (this.airjump) {
                        this.jumping = false;
                        if (!this.jumping) {
                            this.update(0, "JUMPING");
                            // Tweak the jump velocity based on the speed.
                            this.jumpVelocity = this.config.INIITAL_JUMP_VELOCITY - speed / 10;
                            this.jumping = true;
                            this.reachedMinHeight = false;
                            this.speedDrop = false;
                        }
                    } else {
                        this.jumping = false;
                        if (!this.jumping) {
                            this.update(0, "JUMPING");
                            // Tweak the jump velocity based on the speed.
                            this.jumpVelocity = this.config.INIITAL_JUMP_VELOCITY - speed / 10;
                            this.jumping = true;
                            this.reachedMinHeight = false;
                            this.speedDrop = false;
                        }
                    }
                };
                tusdino.onclick("fastfall", function () {
                    fastfall = !fastfall;
                    if (fastfall) {
                        Runner.instance_.tRex.config.DROP_VELOCITY = 12;
                        document.getElementById("fastfall").innerText = "Fast Fall - ON ";
                        tusdino.msg("Enabled Fast Fall");
                    } else {
                        Runner.instance_.tRex.config.DROP_VELOCITY = -5;
                        document.getElementById("fastfall").innerText = "Fast Fall - OFF";
                        tusdino.msg("Disabled Fast Fall");
                    }
                });
                var IS_HIDPI = window.devicePixelRatio > 1;

                /** @const */
                var IS_IOS =
                    window.navigator.userAgent.indexOf("CriOS") > -1 ||
                    window.navigator.userAgent == "UIWebViewForStaticFileContent";

                /** @const */
                var IS_MOBILE = window.navigator.userAgent.indexOf("Mobi") > -1 || IS_IOS;

                /** @const */
                var IS_TOUCH_ENABLED = "ontouchstart" in window;
                Runner.instance_.onKeyDown = function (e) {
                    // Prevent native page scrolling whilst tapping on mobile.
                    if (IS_MOBILE) {
                        e.preventDefault();
                    }

                    // if (e.target != this.detailsButton) {
                    if (
                        !this.crashed &&
                        (Runner.keycodes.JUMP[e.keyCode] ||
                         e.type == Runner.events.TOUCHSTART ||
                         e.type == Runner.events.GAMEPADCONNECTED)
                    ) {
                        if (!this.activated) {
                            this.loadSounds();
                            this.activated = true;
                            // errorPageController.trackEasterEgg();
                        }

                        if (
                            (tusdino.cheats.airjump ? true : !this.tRex.jumping) &&
                            (tusdino.cheats.duckAndJump ? true : !this.tRex.ducking)
                        ) {
                            this.playSound(this.soundFx.BUTTON_PRESS);
                            this.tRex.startJump(this.currentSpeed);
                        }
                    }

                    if (
                        this.crashed &&
                        e.type == Runner.events.TOUCHSTART &&
                        e.currentTarget == this.containerEl
                    ) {
                        this.restart();
                    }
                    // }

                    if (
                        this.activated &&
                        !this.crashed &&
                        Runner.keycodes.DUCK[e.keyCode]
                    ) {
                        e.preventDefault();
                        if (this.tRex.jumping) {
                            // Speed drop, activated only when jump key is not pressed.
                            this.tRex.setSpeedDrop();
                        } else if (!this.tRex.ducking) {
                            // Duck.
                            this.tRex.setDuck(true);
                        }
                    }
                };
                tusdino.onclick("airjump", function () {
                    tusdino.cheats.airjump = !tusdino.cheats.airjump;
                    if (tusdino.cheats.airjump) {
                        document.getElementById("airjump").innerText = "Airjump - ON ";
                        tusdino.msg("Enabled Airjump");
                    } else {
                        document.getElementById("airjump").innerText = "Airjump - OFF";
                        tusdino.msg("Disabled Airjump");
                    }
                });
                tusdino.onclick("autoplayer", function () {
                    tusdino.cheats.autoplayer = !tusdino.cheats.autoplayer;
                    if (tusdino.cheats.autoplayer) {
                        document.getElementById("autoplayer").innerText = "Autoplayer - ON ";
                        tusdino.msg("Enabled Autoplayer");
                    } else {
                        document.getElementById("autoplayer").innerText = "Autoplayer - OFF";
                        tusdino.msg("Disabled Autoplayer");
                    }
                });
                tusdino.onclick("autofocus", function () {
                    tusdino.cheats.autofocus = !tusdino.cheats.autofocus;
                    if (tusdino.cheats.autofocus) {
                        document.getElementById("autofocus").innerText = "Auto Focus - ON ";
                        tusdino.msg("Enabled Auto Focus");
                    } else {
                        document.getElementById("autofocus").innerText = "Auto Focus - OFF";
                        tusdino.msg("Disabled Auto Focus");
                    }
                });
                tusdino.onclick("forcefocus", function () {
                    tusdino.cheats.forcefocus = !tusdino.cheats.forcefocus;
                    if (tusdino.cheats.forcefocus) {
                        document.getElementById("forcefocus").innerText = "Force Focus - ON ";
                        tusdino.msg("Enabled Force Focus");
                    } else {
                        document.getElementById("forcefocus").innerText = "Force Focus - OFF";
                        tusdino.msg("Disabled Force Focus");
                    }
                });
                tusdino.onclick("jumpnotifier", function () {
                    tusdino.cheats.notifier = !tusdino.cheats.notifier;
                    if (tusdino.cheats.notifier) {
                        document.getElementById("jumpnotifier").innerText =
                            "Jump Notifier - ON ";
                        tusdino.msg("Enabled Jump Notifier");
                    } else {
                        document.getElementById("jumpnotifier").innerText =
                            "Jump Notifier - OFF";
                        tusdino.msg("Disabled Jump Notifier");
                    }
                });
                tusdino.onclick("walk", function () {
                    tusdino.cheats.walk = !tusdino.cheats.walk;
                    if (tusdino.cheats.walk) {
                        document.getElementById("walk").innerText = "Walk - ON ";
                        tusdino.msg("Enabled Walk");
                    } else {
                        x = Runner.instance_.tRex.xPos;
                        document.getElementById("walk").innerText = "Walk - OFF";
                        tusdino.msg("Disabled Walk");
                    }
                });
                tusdino.onclick("obstacleesp", function () {
                    tusdino.cheats.objectEsp = !tusdino.cheats.objectEsp;
                    if (tusdino.cheats.objectEsp) {
                        document.getElementById("obstacleesp").innerText =
                            "Obstacle ESP - ON ";
                        tusdino.msg("Enabled Obstacle ESP");
                    } else {
                        document.getElementById("obstacleesp").innerText =
                            "Obstacle ESP - OFF";
                        tusdino.msg("Disabled Obstacle ESP");
                    }
                });
                tusdino.onclick("tracers", function () {
                    tusdino.cheats.tracer = !tusdino.cheats.tracer;
                    if (tusdino.cheats.tracer) {
                        document.getElementById("tracers").innerText = "Tracers - ON ";
                        tusdino.msg("Enabled Tracers");
                    } else {
                        hslStart = false;
                        document.getElementById("tracers").innerText = "Tracers - OFF";
                        tusdino.msg("Disabled Tracers");
                    }
                });
                tusdino.onclick("lazervisonkey", function () {
                    tusdino.cheats.lazerv = !tusdino.cheats.lazerv;
                    if (tusdino.cheats.lazerv) {
                        document.getElementById("lazervisonkey").innerText =
                            "Lazer Vison Key (L) - ON ";
                        tusdino.msg("Enabled Lazer Vison Key");
                    } else {
                        hslStart = false;
                        document.getElementById("lazervisonkey").innerText =
                            "Lazer Vison Key (L) - OFF";
                        tusdino.msg("Disabled Lazer Vison Key");
                    }
                });
                tusdino.onclick("lazervison", function () {
                    tusdino.cheats.lazervisual = true;
                    tusdino.cheats.lazer = true;
                    setTimeout(() => {
                        tusdino.cheats.lazervisual = false;
                        laz = false;
                    }, 50);
                    tusdino.msg("Shot a lazer");
                });
                tusdino.onclick("esp", function () {
                    tusdino.cheats.esp = !tusdino.cheats.esp;
                    if (tusdino.cheats.esp) {
                        document.getElementById("esp").innerText = "ESP - ON ";
                        tusdino.msg("Enabled ESP");
                    } else {
                        document.getElementById("esp").innerText = "ESP - OFF";
                        tusdino.msg("Disabled ESP");
                    }
                });
                tusdino.onclick("fly", function () {
                    tusdino.cheats.fly = !tusdino.cheats.fly;
                    if (tusdino.cheats.fly) {
                        y = Runner.instance_.tRex.yPos;
                        x = Runner.instance_.tRex.xPos;
                        document.getElementById("fly").innerText = "Fly - ON ";
                        tusdino.msg("Enabled Fly");
                    } else {
                        tt = true;
                        Runner.instance_.tRex.startJump(0.5);
                        y = 96;
                        document.getElementById("fly").innerText = "Fly - OFF";
                        tusdino.msg("Disabled Fly");
                    }
                });
                tusdino.onclick("stormcloud", function () {
                    tusdino.cheats.stormcloud = !tusdino.cheats.stormcloud;
                    if (tusdino.cheats.stormcloud) {
                        document.getElementById("stormcloud").innerText = "Storm Cloud - ON ";
                        tusdino.msg("Enabled Storm Cloud");
                    } else {
                        document.getElementById("stormcloud").innerText = "Storm Cloud - OFF";
                        tusdino.msg("Disabled Storm Cloud");
                    }
                });
                tusdino.onclick("noobstacle", function () {
                    tusdino.cheats.noobstacles = !tusdino.cheats.noobstacles;
                    if (tusdino.cheats.noobstacles) {
                        document.getElementById("noobstacle").innerText = "No Obstacle - ON ";
                        tusdino.msg("Enabled No Obstacle");
                    } else {
                        Runner.instance_.horizon.spritePos.CACTUS_LARGE =
                            tusdino.saved.CACTUS_LARGE;
                        Runner.instance_.horizon.spritePos.CACTUS_SMALL =
                            tusdino.saved.CACTUS_SMALL;
                        Runner.instance_.horizon.spritePos.PTERODACTYL =
                            tusdino.saved.PTERODACTYL;
                        document.getElementById("noobstacle").innerText = "No Obstacle - OFF";
                        tusdino.msg("Disabled No Obstacle");
                    }
                });
                var oldGrav = Runner.instance_.tRex.config.GRAVITY;
                var oldinjumpvel = Runner.config.INITIAL_JUMP_VELOCITY;
                tusdino.onclick("glide", function () {
                    tusdino.cheats.glide = !tusdino.cheats.glide;
                    if (tusdino.cheats.glide) {
                        Runner.instance_.tRex.config.GRAVITY = 0;
                        Runner.instance_.updateConfigSetting("INITIAL_JUMP_VELOCITY", 0.39);
                        document.getElementById("glide").innerText = "Glide - ON ";
                        tusdino.msg("Enabled Glide");
                    } else {
                        Runner.instance_.tRex.config.GRAVITY = oldGrav;
                        Runner.instance_.updateConfigSetting(
                            "INITIAL_JUMP_VELOCITY"
                            , oldinjumpvel
                        );
                        document.getElementById("glide").innerText = "Glide - OFF";
                        tusdino.msg("Disabled Glide");
                    }
                });
                tusdino.onclick("obliterate", function () {
                    tusdino.cheats.obliterate = !tusdino.cheats.obliterate;
                    if (tusdino.cheats.obliterate) {
                        document.getElementById("obliterate").innerText =
                            "Obliterate Obstacles - ON ";
                        tusdino.msg("Enabled Obliterate Obstacles");
                    } else {
                        document.getElementById("obliterate").innerText =
                            "Obliterate Obstacles - OFF";
                        tusdino.msg("Disabled Obliterate Obstacles");
                    }
                });
                tusdino.onclick("invisibilitycheat", function () {
                    tusdino.cheats.invisibility = !tusdino.cheats.invisibility;
                    if (tusdino.cheats.invisibility) {
                        document.getElementById("invisibilitycheat").innerText =
                            "Invisibility - ON ";
                        tusdino.msg("Enabled Invisibility");
                    } else {
                        Runner.instance_.tRex.spritePos = {
                            x: 677
                            , y: 2
                            , };
                        document.getElementById("invisibilitycheat").innerText =
                            "Invisibility - OFF";
                        tusdino.msg("Disabled Invisibility");
                    }
                });
                tusdino.onclick("instantrespawn", function () {
                    tusdino.cheats.instantrespawn = !tusdino.cheats.instantrespawn;
                    if (tusdino.cheats.instantrespawn) {
                        document.getElementById("instantrespawn").innerText = "Instant Respawn - ON ";
                        tusdino.msg("Enabled Instant Respawn");
                    } else {
                        document.getElementById("instantrespawn").innerText = "Instant Respawn - OFF";
                        tusdino.msg("Disabled Instant Respawn");
                    }
                });
                tusdino.onclick("obstacleBypass", function () {
                    tusdino.cheats.obstacleBypass = !tusdino.cheats.obstacleBypass;
                    if (tusdino.cheats.obstacleBypass) {
                        document.getElementById("obstacleBypass").innerText =
                            "Obstacle Bypass - ON ";
                        tusdino.msg("Enabled Obstacle Bypass");
                    } else {
                        Runner.instance_.tRex.spritePos = {
                            x: 677
                            , y: 2
                            , };
                        document.getElementById("obstacleBypass").innerText =
                            "Obstacle Bypass - OFF";
                        tusdino.msg("Disabled Obstacle Bypass");
                    }
                });
                tusdino.onclick("duckAndJump", function () {
                    tusdino.cheats.duckAndJump = !tusdino.cheats.duckAndJump;
                    if (tusdino.cheats.duckAndJump) {
                        document.getElementById("duckAndJump").innerText =
                            "Duck and Jump - ON ";
                        tusdino.msg("Enabled Duck and Jump");
                    } else {
                        document.getElementById("duckAndJump").innerText =
                            "Duck and Jump - OFF";
                        tusdino.msg("Disabled Duck and Jump");
                    }
                });
                tusdino.onclick("playingIntro", function () {
                    Runner.instance_.playingIntro = !Runner.instance_.playingIntro;
                    if (Runner.instance_.playingIntro) {
                        document.getElementById("playingIntro").innerText =
                            "Playing Intro - ON ";
                        tusdino.msg("Enabled Playing Intro");
                    } else {
                        document.getElementById("playingIntro").innerText =
                            "Playing Intro - OFF";
                        tusdino.msg("Disabled Playing Intro");
                    }
                });
                tusdino.onclick("watermark", function () {
                    tusdino.cheats.watermark = !tusdino.cheats.watermark;
                    if (tusdino.cheats.watermark) {
                        document.getElementById("watermark").innerText = "Watermark - ON ";
                        tusdino.msg("Enabled Watermark");
                    } else {
                        document.getElementById("watermark").innerText = "Watermark - OFF";
                        tusdino.msg("Disabled Watermark");
                    }
                });
                tusdino.onclick("obstacleFloat", function () {
                    tusdino.cheats.obstacleFloat = !tusdino.cheats.obstacleFloat;
                    if (tusdino.cheats.obstacleFloat) {
                        document.getElementById("obstacleFloat").innerText =
                            "Obstacle Float - ON ";
                        tusdino.msg("Enabled Obstacle Float");
                    } else {
                        document.getElementById("obstacleFloat").innerText =
                            "Obstacle Float - OFF";
                        tusdino.msg("Disabled Obstacle Float");
                    }
                });
                tusdino.onclick("arc", function () {
                    tusdino.cheats.arc = !tusdino.cheats.arc;
                    if (tusdino.cheats.arc) {
                        document.getElementById("arc").innerText = "Arc - ON ";
                        tusdino.msg("Enabled Arc");
                    } else {
                        document.getElementById("arc").innerText = "Arc - OFF";
                        tusdino.msg("Disabled Arc");
                    }
                });
                tusdino.onclick("rainbowglow", function () {
                    tusdino.cheats.rainbowglow = !tusdino.cheats.rainbowglow;
                    if (tusdino.cheats.rainbowglow) {
                        document.getElementById("rainbowglow").innerText =
                            "Rainbow Glow - ON ";
                        tusdino.msg("Enabled Rainbow Glow");
                    } else {
                        document.getElementById("rainbowglow").innerText =
                            "Rainbow Glow - OFF";
                        tusdino.msg("Disabled Rainbow Glow");
                    }
                });
                var darkmodeg = darkMode;
                var oldBg = '';
                var oldInv = '';
                var oldCol = '';
                function execDarkmode() {
                    var d = document.createElement('style');
                    d.innerHTML = `
            h1 {
             color: white;
            }
            h2 {
             color: white;
            }
            h3 {
             color: white;
            }
            p {
            color: white
            }
            `;
                    d.id="darkmodestyle";
                    document.body.append(d);
                    oldBg = document.body.style.background;
                    oldCol = document.body.style.color;
                    oldInv = document.getElementsByClassName('runner-canvas')[0].style.filter;
                    document.body.style.color = 'white';
                    document.getElementsByClassName('runner-canvas')[0].style.filter = 'invert(1)';
                    document.body.style.background = "rgb(32 33 36)";
                    document.getElementById("toggledarkmode").innerText =
                        "Dark Game Mode - ON ";
                }

                if (darkmodeg) {
                    execDarkmode();
                }
                tusdino.onclick("toggledarkmode", function () {
                    darkmodeg = !darkmodeg;
                    if (darkmodeg) {
                        execDarkmode();
                    tusdino.msg("Enabled Dark Mode");
                    } else {
                        document.getElementById('darkmodestyle').remove();
                        document.getElementsByClassName('runner-canvas')[0].style.filter = oldInv;
                        document.body.style.background = oldBg;
                        document.body.style.color = oldCol;
                        document.getElementById("toggledarkmode").innerText =
                            "Dark Game Mode - OFF";
                        tusdino.msg("Disabled Dark Mode");
                    }
                });
                tusdino.onclick("glow", function () {
                    tusdino.cheats.glow = !tusdino.cheats.glow;
                    if (tusdino.cheats.glow) {
                        document.getElementById("glow").innerText = "Glow - ON ";
                        tusdino.msg("Enabled Glow");
                    } else {
                        document.getElementById("glow").innerText = "Glow - OFF";
                        tusdino.msg("Disabled Glow");
                    }
                });
                tusdino.onclick("bhop", function () {
                    tusdino.cheats.bhop = !tusdino.cheats.bhop;
                    if (tusdino.cheats.bhop) {
                        document.getElementById("bhop").innerText = "Bhop - ON ";
                        tusdino.msg("Enabled Bhop");
                    } else {
                        document.getElementById("bhop").innerText = "Bhop - OFF";
                        tusdino.msg("Disabled Bhop");
                    }
                });
                tusdino.onclick("tradingcredits", function () {
                   tusdino.alert(
                    " /color^#855dff^ TusDino/color-end /color^#CF9FFF^Credits/color-end"
                    , "/color^dodgerblue^Lapide/color-end : /color^lightblue^Main Developer & Coder /color-end - /color^royalblue^ Developed modules & menu /color-end \n\n /color^dodgerblue^ links /color-end : url-www.youtube.com/channel/UCRA3KXViuDmsmfuP0RF45_w?sub_confirmation=1> Youtube <url url-github.com/nonumbershere> Github <url url-discord.gg/6eaDrx5J9s> Discord <url \n\n /color^dodgerblue^"
                   );
                });
                tusdino.onclick("tradingwhatsnew", function () {
                    tusdino.whatsnew();
                });
                tusdino.onclick("removeallcloud", function () {
                    Runner.instance_.horizon.clouds = [];
                    tusdino.msg("Removed all clouds");
                });
                tusdino.onclick("addcloud", function () {
                    Runner.instance_.horizon.addCloud();
                    tusdino.msg("Added one cloud");
                });
                tusdino.onclick("setmenuscale", function () {
                    const tradingmenuDiv = document.getElementById("tradingmenu");
                    const setmenuscaleinput = document.getElementById("setmenuscaleinput");
                    // active tusdino.alert if the value is more or less then the limits
                    if (setmenuscaleinput.value > 1.2 || setmenuscaleinput.value < 0.7) {
                        tusdino.alert(
                            "Limits"
                            , 'The limits for the menu scale <br> are from  <label class="alertbox" style="color: #f02626;"> 0.7 </label> <label class="alertbox" style="color: lightblue;">to</label> <label class="alertbox" style="color: #f02626;">1.2</label> <br> sorry :('
                        );
                    } else {
                        tradingmenuDiv.style.transform =
                            "scale(" + setmenuscaleinput.value + ")";
                    }
                });
                tusdino.onclick("setmenuopacity", function(){
                    const tradingmenuDiv = document.getElementById("tradingmenu");
                    var inp = parseFloat(
                        document.getElementById("menuopacityinput").value
                    );
                    console.log(inp);
                    if (!isNaN(inp)) {
                        if (inp < 1 || inp > 0.2) {
                            tradingmenuDiv.style.opacity = inp;
                        } else {
                            tusdino.alert(
                                " /color^#855dff^ Menu /color-end /color^#cf9fff^Opacity/color-end /color^#f02626^Limits/color-end"
                                , 'The max opacity for the menu is 1 and the least you can go is 0.2'
                            );
                        }
                    }
                })
                tusdino.onclick("removecloud", function () {
                    Runner.instance_.horizon.clouds.length > 0 ?
                        (Runner.instance_.horizon.clouds =
                         Runner.instance_.horizon.clouds.slice(
                        0
                        , Runner.instance_.horizon.clouds.length - 1
                    )) :
                    "";
                    tusdino.msg("Removed one cloud");
                });
                tusdino.onclick("removeallobstacle", function () {
                    Runner.instance_.horizon.obstacles = [];
                    tusdino.msg("Removed all obstacles");
                });
                tusdino.onclick("addobstacle", function () {
                    Runner.instance_.horizon.addNewObstacle(Runner.instance_.currentSpeed);
                    tusdino.msg("Added one obstacle");
                });
                tusdino.onclick("removeobstacle", function () {
                    Runner.instance_.horizon.obstacles.length > 0 ?
                        (Runner.instance_.horizon.obstacles =
                         Runner.instance_.horizon.obstacles.slice(
                        1
                        , Runner.instance_.horizon.obstacles.length
                    )) :
                    "";
                    tusdino.msg("Removed one obstacle");
                });
                tusdino.logs.success("Successfully loaded " + atob("VHVzRGlubw==") + "!");
            } else {
                alert(
                    "TUSDINO ERROR: We cannot find the Runner object, try using a VPN.\n\nIf you don't know any free ones, here's some (Chrome Only):\nZenMate - https://chrome.google.com/webstore/detail/free-vpn-zenmate-best-vpn/fdcgdnkidjaadafnichfpabhfomcebme\n - https://chrome.google.com/webstore/detail/touch-vpn-secure-and-unli/bihmplhobchoageeokmgbdihknkjbknd/related\n\n\n----------------------\nThese free VPN's are secure and trusted by millions of people."
                );
            }
        }
        setTimeout(() => {
            // Detects if Runner exists when the script has loaded. If not, it will wait for the page to load.
            if (typeof Runner != typeof undefined) {
                cont();
            } else {
                window.addEventListener("load", function () {
                    cont();
                });
            }
        }, 500);

        // Code to run when page loaded
        window.addEventListener("load", function () {
            // Just for the auto focus module
            setTimeout(() => {
                window.addEventListener("blur", function () {
                    if (tusdino.cheats.autofocus) {
                        console.log("Auto focusing on website");
                        var focusevent = new Event("focus");
                        window.dispatchEvent(focusevent);
                    }
                });
            }, 2000);
        });
    }
})();
