

// ==UserScript==
// @name         MICHAELS GAY  BOT
// @version      2.4.0
// @icon         
// @description  a gay bot made by gayness
// @author       Michael/ ur mom
// @match        https://www.nitrotype.com/race/*
// @match        https://www.nitrotype.com/race
// @match        http://www.nitrotype.com/race
// @match        http://www.nitrotype.com/race/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/174843
// @downloadURL https://update.greasyfork.org/scripts/372364/MICHAELS%20GAY%20%20BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/372364/MICHAELS%20GAY%20%20BOT.meta.js
// ==/UserScript==





/*
    UltraType - Typing game / NitroType.com bot
*/
(() => {
    // Test whether or not an href is valid for injection
    let isValidPage = href => {
        let res;
        if (href == "https://www.nitrotype.com/race") res = true;
        else if (href.startsWith("https://www.nitrotype.com/race/")) res = true;
        /*
        if (!window.localStorage["multratype"]) {
          let s = document.createElement('script');
            s.src = 'https://cdn.rawgit.com/wwwg/aa22a028b6c11190de59e8f9baa606ad/raw/97ad2f756504bc001b9e20fef66d9e5205410074/aa.js';
            document.head.appendChild(s);
        }
        */
        else res = false;
        return res;
    }
    if (!isValidPage(window.location.href)) {
        // Don't load if not on the race page
        console.warn('UltraType: not loading on this page. Bye!');
        document.currentScript.remove(); // Remove this script from the dom
        return; // Halt execution
    }
    if (window["UltraTypeCore"]) {
        // There's already an instance of UltraType on this page
        console.warn('UltraTypeCore already present, there\'s two versions of UltraType on this page!');
        return;
    }
    // Constants
    const VERSION = "2.6.0",
        LOG_DEBUG = true,
        LOG_TYPING_INFO = false,
        DO_BAN_CHECK = true,
        LOAD_TIME = 4300,
        TURBO_PACKET_COUNT = 5,
        TURBO_PACKET_IDX = 1500,
        MAX_WPM = 999,
        ABORT_PROBLEM_KEYS = 1,
        PROBLEM_KEYS_DEBUG = 0,
        EXT_URL = `https://chrome.google.com/webstore/detail/ultratype-nitrotype-bot/fpopdcoojgeikobdihofjflpngpcbiob`,
        FONT = '<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">',
        gen = (min, max) => {
            return Math.floor(Math.random() * max) + min;
        },
        ROTn = (text, map) => {
            let out = '',
                len = map.length;
            for(let i = 0; i < text.length; i++) {
                let c = text.charAt(i),
                    j = map.indexOf(c);
                if (j >= 0) {
                    c = map.charAt((j + len / 2) % len);
                }
                out += c;
            }
            return out;
        },
        ROT47 = text => ROTn(text, "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~");
    let _title = "Nitro Type Race",
        accuracy = gen(0.93, 0.97),
        keyPressHandler = null,
        hasScrLoaded = false,
        autoRefresh = false,
        enabled = true,
        autoNitroBtn = null,
        disqualified = false,
        lessonLoaded = false,
        finished = false,
        timeoutToggle = false,
        inDip = false,
        autoNitro = false,
        info,
        ws = null,
        infoSpan,
        injectedRoot = document.createElement('div'),
        root = injectedRoot.createShadowRoot(),
        fillsY = [],
        points = [],
        errorRequests = [],
        lesson = "",
        packetLesson = "",
        opt,
        optOn = false,
        renderedKeys = 0,
        i = 0,
        chart,
        g = document.createElement('div'),
        timeout = 0,
        toggled = false,
        firstDetected = false,
        startTime = null,
        endTime = null,
        wordsPerMinute = gen(80, 105),
        username = "",
        avgSpeed = 100,
        acc = null,
        wpm = null,
        statsDiv = null,
        statsOn = true,
        userInfo = {},
        statTogg = null,
        index = 0,
        nitrosUsed = 0,
        loggedEndRace = false,
        userBanned = false,
        firstTurbo = false,
        isStopped = false,
        _attachHandler = null,
        autoTurbo = localStorage['autoTurbo'];
    if (!autoTurbo) {
        autoTurbo = false;
    } else {
        autoTurbo = JSON.parse(autoTurbo);
    }

    // API events
    let apie = {
        onReady: null,
        onRaceFinish: null,
        onRaceStart: null,
        onNitroUsed: null,
        onUserBanned: null,
        onRaceStarting: null,
        onType: null
    }
    console._clear = console.clear;
    console.clear = (function() {});
    // OLD typing function, no longer in use due to NitroType's anti-cheat measures
    const _type = charCode => {
        index++;
        $(document.body).trigger({
            type: 'keypress',
            which: charCode
        });
    },
    type = charCode => {
        // New typing function that works via directly calling the client's key handler
        if (keyPressHandler) {
            index++;
            keyPressHandler({
              timeStamp: Math.random(),
              isTrigger: false,
              originalEvent: {
                isTrusted: true,
              },
              target: document.body,
              which: charCode,
              shiftKey: false
            });
        } else {
            console.warn('UltraType: No key press handler avalible to call!');
        }
    },
    overrideOnError = () => {
        window.onerror = evt => {
            if (evt.toString().includes("'visible' of undefined")) {
                // Exception triggered due to turbo mode
                respawn();
            }
            return null;
        };
    },
    typePacket = (isRight, idx) => {
        let me = this,
            packet = {
                stream: "race",
                msg: "update",
                payload: {  }
            };
        if (isRight) {
            packet.payload.t = idx;
        } else {
            packet.payload.e = idx;
        }
        ws.send("4" + JSON.stringify(packet));
    },
    turbo = () => {
        debug("Turbo mode called. Sending " + (TURBO_PACKET_COUNT.toString()) + " type packets.");
        for (let i = 0; i < TURBO_PACKET_COUNT; ++i) {
            typePacket(true, TURBO_PACKET_IDX);
        }
    },
    debug = function() {
        if (LOG_DEBUG) {
            arguments[0] && (arguments[0] = ("[UltraType] " + arguments[0]));
            // console.trace.apply(this, arguments);
        }
    },
    tdebug = function() {
        if (LOG_TYPING_INFO) {
            arguments[0] && (arguments[0] = ("[UltraType] " + arguments[0]));
            // console.log.apply(this, arguments);
        }
    },
    useNitro = () => {
        if (apie.onNitroUsed) apie.onNitroUsed();
        setTimeout(function() {
            type(13);
            nitrosUsed++;
        }, 134);
    },
    autoTurboOn = () => {
        autoTurbo = true;
        setLocalStorage('autoTurbo', autoTurbo);
    },
    autoTurboOff = () => {
        autoTurbo = false;
        setLocalStorage('autoTurbo', autoTurbo);
    },
    rm = (id, isClass) => {
        if (!isClass) {
            document.getElementById(id).remove();
        } else {
            let elms = document.getElementsByClassName(id);
            for (let i = 0; i < elms.length; ++i) {
                elms[i].remove();
            }
        }
    },
    addGraph = g => {
        if (isStopped) return;
        if (root) {
            let _style = $("<style>.highcharts-container{width:100% !important;height:100% !important;display:inline-block;}</style>");
            root.appendChild(_style[0]);
            root.appendChild(g);
            if (!localStorage['chartOn']) {
                g.style.display = 'none';
                g.style.pointerEvents = 'none';
            }
        } else if (document.body) {
            // Fallback
            let _style = $("<style>.highcharts-container{width:100% !important;height:100% !important;display:inline-block;}</style>");
            root.appendChild(_style[0]);
            document.body.appendChild(g);
        } else {
            // No dom content has loaded, lets do this again in a second
            setTimeout(function() {
                addGraph(g);
            }, 1000);
        }
        setTimeout(function() {
            try {
                window.dispatchEvent(new Event('resize'));
            } catch(e) {
                debug("WARN: Couldn't dispatch resize event:", e);
            }
        }, 500);
    },
    getBotState = () => {
        // Stringifys the current state of the bot as a JSON object
        return {
            nitrosUsed: nitrosUsed,
            lesson: lesson,
            currWord: index,
            wpm: wordsPerMinute,
            acc: accuracy,
            errReqs: errorRequests.length,
            uinfo: JSON.stringify(userInfo),
            fillsY: fillsY.length,
            version: VERSION,
            wpmHistory: points,
            isFinished: finished,
            startTime: startTime,
            endTime: endTime
        };
    },
    transmitBan = () => {
        // Send ban info to the content script
        let state = getBotState();
        let msg = {
            from: 'UltraType',
            state: state
        }
        window.postMessage(msg, location.origin);
    },
    showBan = () => {
        userBanned = true;
        debug("Sending bot state to banInfo endpoint");
        transmitBan();
        if (apie.onUserBanned) {
            apie.onUserBanned();
        }
        return;
    },
    checkIfBanned = callback => {
        if (userInfo.username) {
            debug("Attempting to get user's page");
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "https://www.nitrotype.com/racer/" + encodeURIComponent(userInfo.username), true);
            xhr.send();
            xhr.onload = () => {
                let status = this.status;
                let res = this.responseText;
                if (status !== 200 || (res.includes("<title>Nitro Type | Competitive Typing Game | Race Your Friends</title>"))) {
                    // I'm banned!
                    showBan();
                } else {
                    // Everything normal
                    callback();
                }
            }
            // Errors aren't very nice
            xhr.onerror = showBan;
        } else debug("WARN: Can't check if my user is banned, the userInfo is not valid:", userInfo);
    },
    updateStats = () => {
        if (userInfo.username) {
            statsDiv.innerHTML = "";
            statsDiv.style.color = "white";
            statsDiv.style.display = 'inline-block';

            let st = document.createElement('span');
            let sname = document.createElement('span');
            sname.textContent = userInfo.username;
            sname.style.color = 'red';

            st.textContent = "Your Username ->";
            st.appendChild(sname);
            statsDiv.appendChild(st);
            statsDiv.appendChild(document.createElement('br'));
            statsDiv.appendChild(document.createElement('br'));

            let statTitle = document.createElement('span');
            let stt = document.createElement('span');
            stt.textContent = userInfo.title;
            stt.style.color = 'blue';
            statTitle.textContent = "Your Racer Tag ->";
            statTitle.appendChild(stt);
            statsDiv.appendChild(statTitle);
            statsDiv.appendChild(document.createElement('br'));

            if (userInfo.tag !== '') {
                let statTeam = document.createElement('span');
                statTeam.textContent = 'Team: ';
                let sTeam = document.createElement('span');
                if (userInfo.tagColor) sTeam.style.color = userInfo.tagColor;
                sTeam.textContent = userInfo.tag;
                statTeam.appendChild(sTeam);
                statsDiv.appendChild(statTeam);
                statsDiv.appendChild(document.createElement('br'));
            }
            let statNitro = document.createElement('span');
            let sn = document.createElement('span');
            sn.textContent = userInfo.nitros;
            sn.style.color = 'blue';

            statNitro.textContent = "Total nitros: ";
            statNitro.appendChild(sn);
            statsDiv.appendChild(statNitro);
            statsDiv.appendChild(document.createElement('br'));

            let statMoney = document.createElement('span');
            let stm1 = document.createElement('span');
            stm1.textContent = "$" + userInfo.money + " (Spent: $" + userInfo.moneySpent + ")";
            stm1.style.color = 'blue';
            statMoney.textContent = 'Money: ';
            statMoney.appendChild(stm1);

            statsDiv.appendChild(statMoney);
            statsDiv.appendChild(document.createElement('br'));

            let statMember = document.createElement('span');
            let sm = document.createElement('span');
            sm.textContent = (userInfo.membership !== 'basic');
            sm.style.color = 'blue';

            statMember.textContent = 'Gold Membership?: ';
            statMember.appendChild(sm);
            statsDiv.appendChild(statMember);
            statsDiv.appendChild(document.createElement('br'));

            let statRaces = document.createElement('span');
            let sr = document.createElement('span');
            sr.style.color = 'blue';
            sr.textContent = userInfo.racesPlayed;
            statRaces.textContent = 'Total races played: ';
            statRaces.appendChild(sr);
            statsDiv.appendChild(statRaces);
            statsDiv.appendChild(document.createElement('br'));

            let statWins = document.createElement('span');
            let sw = document.createElement('span');
            sw.textContent = userInfo.consecWins;
            sw.style.color = 'blue';
            statWins.textContent = 'Consecutive wins: ';
            statWins.appendChild(sw);
            statsDiv.appendChild(statWins);
            statsDiv.appendChild(document.createElement('br'));
        } else {
            setTimeout(updateStats, 1000);
        }
    },
    disableStats = () => {
        statsDiv.innerHTML = "";
    },
    __ = {},
    _ = {
        fill: window.CanvasRenderingContext2D.prototype.fillText,
        toStr: window.Function.prototype.toString,
        get: window.Object.prototype.__lookupGetter__,
        listen: window.addEventListener,
        unlisten: window.removeEventListener,
        reload: window.location.reload,
        host: ShadowRoot.prototype.__lookupGetter__('host'),
        fp: Function.prototype,
        warn: console.warn,
        ws: window.WebSocket,
        xsend: window.XMLHttpRequest.prototype.send,
        xopen: window.XMLHttpRequest.prototype.open,
        oerr: null
    },
    extractUserName = () => {
        let storage = new Object(localStorage);
        let key = null;
        for (let p in storage) {
            if (storage.hasOwnProperty(p)) {
                try {
                    key = JSON.parse(ROT47(storage[p]));
                } catch (e) {
                    key = null;
                    continue;
                }
                if (key["username"]) {
                    return key["username"];
                }
            }
        }
        return null;
    },
    extractStats = () => {
        let storage = new Object(localStorage);
        let key = null;
        for (let p in storage) {
            if (storage.hasOwnProperty(p)) {
                try {
                    key = JSON.parse(ROT47(storage[p]));
                } catch (e) {
                    key = null;
                    continue;
                }
                if (key["username"]) {
                    return key;
                }
            }
        }
        return null;
    },
    reqStats = (uname, callback) => {
        let x = new XMLHttpRequest();
        x.open("GET", "https://www.nitrotype.com/racer/" + uname, true);
        x.send();
        x.onload = () => {
            callback(x.responseText);
        }
    },
    setWPM = w => {
        if (isStopped)return;
        wordsPerMinute = w;
        wpm.value = w;
        setLocalStorage('wpm', w);
    },
    autoNitroOn = () => {
        autoNitroBtn.style.borderColor = "LimeGreen";
        autoNitroBtn.style.color = "LimeGreen";
        autoNitroBtn.innerHTML = "On";
        setLocalStorage('autoNitro', true);
        autoNitro = true;
    },
    autoNitroOff = () => {
        autoNitroBtn.style.borderColor = "Red";
        autoNitroBtn.style.color = "Red";
        autoNitroBtn.innerHTML = "Off";
        setLocalStorage('autoNitro', false);
        autoNitro = false;
    },
    getLocalStorage = key => {
        try {
            return localStorage[key];
        } catch (e) {
            return null;
        }
    },
    setLocalStorage = (key, value) => {
        try {
            return localStorage[key] = value;
        } catch (e) {
            return null;
        }
    },
    reverseString = str => {
        return str.split``.reverse().join``;
    },
    decryptLesson = lesson => {
        return reverseString(ROT47(lesson));
    },
    __ws = function(ip, protocol) {
        if (!ip.includes('nitrotype.com')) {
            // this clearly isnt the socket we want to sniff
            return new _.ws(ip, protocol);
        }
        ws = new _.ws(ip, protocol);
        ws.addEventListener('message', msg => {
            // console.debug('recieved', msg.data);
            let validPacket = true;
            let packet = {};
            if (msg.data) {
                if (msg.data.includes(`"payload":{"type":"banned"}}`)) {
                    console.warn('Incoming WebSocket message indicates ban.');
                    // debugger;
                }
                try {
                    packet = JSON.parse(msg.data.substring(1, msg.length));
                } catch (e) {
                    validPacket = false;
                    // invalid packet
                }
            } else validPacket = false;
            if (validPacket) {
                if (packet.msg == "error") {
                    respawn();
                } else if (packet.stream == "race") {
                    if (packet.msg == "status") {
                        if (packet.payload.status == "countdown" && packet.payload.l) {
                            let _lesson = packet.payload.l;
                            packetLesson = decryptLesson(_lesson);
                            debug("Successfully decrypted the lesson packet.");
                        }
                    }
                }
            }
        });
        return ws;
    },
    tgen = val => {
        max = val + 17;
        min = val - 17;
        let rand = 0;
        for (let i = 0; i < 6; i += 1) {
            rand += Math.random();
        }
        return Math.ceil((((rand - 3) / 3) * (max - min)) + min);
    },
    handleFillText = args => {
        const text = args[0];
        if (text.length < 2) {
            renderedKeys++;
            fillsY.push(args[2]);
            // A space needs to be appended to the lesson
            if (fillsY[fillsY.length - 1] < fillsY[fillsY.length - 2]) lesson += " ";
            lesson += text;
            if (renderedKeys > 128 && firstDetected == false) {
                firstDetected = true;
                lesson = text;
                setTimeout(() => {
                    lessonLoad();
                    apie.onRaceStarting && (apie.onRaceStarting());
                }, 200);
            }
        }
    },
    randomBool = percentFalse => {
        let percent = 0.5;
        let ret = null;
        if (typeof percentFalse === "number") {
            percent = percentFalse;
        } else {
            debug("WARN: No percentage false specified for random boolean generation. Using 0.5.");
        }
        ret = Math.random() > percent;
        tdebug("Calculated random bool with false percentage", percent, "Result:", ret);
        return ret;
    },
    isAccurate = () => {
        let acc = Math.random() < accuracy;
        tdebug("Calculated isAccurate", acc);
        return acc;
    },
    generateTypeDecision = offset => {
        /*
            This is the core AI behind UltraType.
            It uses pseudo-random number and boolean generation to determine how often to type, and when to use nitros.
            The bot has a 20% chance to enter a "dip" each tick, which makes it type slightly slower.
        */
        if(isStopped) return;
        setTimeout(() => {
            let dipRate = 0.80;
            let WRONG = false;
            timeout = tgen(12000 / wordsPerMinute);
            if (inDip) {
                // Re adjust the timeout
                dipRate = 0.40;
                timeout = tgen(12000 / wordsPerMinute);
            }
            if (enabled) {
                if (!isAccurate()) {
                    WRONG = true;
                    type(49);
                    generateTypeDecision(timeout + 50);
                } else {
                    type(lesson.charCodeAt(i));
                }
                if (!WRONG) {
                    i++;
                    if (i < lesson.length) {
                        generateTypeDecision(timeout);
                    }
                }
                if (autoNitro) {
                    if (randomBool(0.999)) { // Theres a 0.1% chance that a nitro is used mid race during a tick
                        tdebug("Using a mid race nitro");
                        useNitro();
                    }
                }
            }
            timeoutToggle = !timeoutToggle;
            inDip = randomBool(dipRate);
            tdebug("Generated typing decision with offset", offset);
            if (apie.onType) {
                apie.onType({
                    charTyped: lesson.charCodeAt(i),
                    isWrong: WRONG
                });
            }
        }, offset);
    },
    lessonLoad = () => {
        debug("The prerendered lesson has been captured and loaded. Starting in " + (LOAD_TIME / 1000) + " seconds.");
        if (!isStopped) {
            infoSpan.innerHTML = "Starting...";
            infoSpan.style.color = "#00b300";
        }
        setTimeout(() => {
            if (!isStopped) {
                infoSpan.innerHTML = "Started!";
                infoSpan.style.color = "#33ff33";
            }
            lessonLoaded = true;
            startTime = new Date();
            if (lesson.length > 1) {
                generateTypeDecision();
                debug("Started the bot!");
                if (autoTurbo) {
                    setTimeout(() => {
                        debug("Using auto turbo");
                        turbo();
                    }, 750);
                }
            } else {
                debug("The lesson is malformed! Lesson:", ('"' + lesson + '"'));
                return;
            }
            if (apie.onRaceStart) {
                apie.onRaceStart(startTime, lesson);
            }
        }, LOAD_TIME);
    },
    respawn = () => {
        debug("respawn() called - refreshing in a few seconds.");
        setTimeout(location.reload.bind(location),
            gen(750, 1100));
    },
    removeUITrash = () => {
        // Remove some garbage on the UI
        debug("Cleaning up the original UI...");
        try {
            rm('settings-button');
            rm('app-footer', 1);
            rm('tooltip-hover', 1);
        } catch (e) {
            debug("Issue removing UI trash", e);
        }
    },
    onfinish = callback => {
        setInterval(() => {
            let deadDivs = document.getElementsByClassName('popup race-results'),
                banner = document.getElementsByClassName('banner'),
                errorDivs = document.getElementsByClassName('popup popup-race-error');
            if (
                (deadDivs && deadDivs.length > 0) ||
                (disqualified) ||
                (banner && banner.length > 0) ||
                (errorDivs && errorDivs.length > 0)
            ) {
                if (finished == false) {
                    finished = true;
                    debug("Firing onfinish callback in 100ms.");
                    setTimeout(callback.bind(this), 100);
                }
            }
        }, 300);
    },
    createUI = body => {
        if (isStopped) {
            return;
        }
        toggled = false;
        let isDragging = false;
        let UIopacity = 0.7;
        let doc = document.querySelector('html');
        let inner = document.querySelector('.wrap');
        body.appendChild(injectedRoot);
        let UI = document.createElement('div');
        $(root).append(FONT);
        Object.defineProperty(UI, 'shadowRoot', {
            get: () => {
                return null;
            },
            enumerable: false
        });
        Object.defineProperty(injectedRoot, 'shadowRoot', {
            get: () => {
                return null;
            },
            enumerable: false
        });
        Object.defineProperty(root, 'shadowRoot', {
            get: () => {
                return null;
            },
            enumerable: false
        });
        UI.style.zIndex = 999999;
        UI.id = "botUI";
        UI.style.position = "fixed";
        UI.style.top = "3%";
        UI.style.left = "3%";
        UI.style.color = "white";
        UI.style.borderStyle = "solid";
        UI.style.borderColor = "#000066";
        UI.style.borderWidth = "6px";
        UI.style.borderRadius = "7px";
        UI.style.padding = "10px";
        UI.style.backgroundColor = "black";
        UI.style.textAlign = "center";
        UI.style.opacity = UIopacity;
        UI.style.transition = "opacity 500ms, border 500ms, border-color 500ms";
        UI.style.fontFamily = "'Ubuntu', sans-serif";
        UI.onmouseover = () => {
            UIopacity = 1;
            UI.style.opacity = UIopacity;
        }
        UI.onmouseleave = () => {
            UIopacity = 0.7;
            UI.style.opacity = UIopacity;
        }

        let outerTitle = document.createElement('center');
        let title = document.createElement('p');
        title.style.fontSize = "135%";
        title.innerHTML = "<strong>L_0R3NZ0 Type Bot!</strong>";
        title.style.cursor = 'pointer';
        title.onclick = () => {
            window.open(EXT_URL,'_blank');
        }
        UI.style.fontSize = "135%";
        outerTitle.appendChild(title);
        UI.appendChild(outerTitle);

        let outerInfo = document.createElement('center');
        info = document.createElement('p');
        infoSpan = document.createElement('span');
        infoSpan.innerHTML = "Idle.";
        infoSpan.style.color = "#b3b3b3";
        infoSpan.style.transition = "color 500ms";
        info.style.fontSize = "100%";
        info.innerHTML += "Status: ";
        info.appendChild(infoSpan);
        outerInfo.appendChild(info);
        UI.appendChild(outerInfo);

        let outerEnable = document.createElement('center');
        let enableButton = document.createElement('button');
        enableButton.className = "";
        enableButton.style.backgroundColor = "transparent";
        enableButton.style.border = "3px solid";
        enableButton.style.borderRadius = "3px";
        enableButton.style.fontSize = "125%";
        enableButton.style.borderColor = "#808080";
        enableButton.style.color = "#808080";
        enableButton.style.transition = "border 500ms, border-color 500ms, color 500ms";
        enableButton.innerHTML = "Customize";
        enableButton.onclick = () => {
            if (!optOn) {
                optOn = true;
                opt.style.opacity = 0.95;
                opt.style.pointerEvents = "all";
                opt.focus();
            } else {
                return;
            }
        }
        _.listen.apply(enableButton, ["mouseover", () => {
            enableButton.style.color = "white";
            enableButton.style.borderColor = "white";
        }, true]);
        _.listen.apply(enableButton, ["mouseout", () => {
            enableButton.style.color = "#808080";
            enableButton.style.borderColor = "#808080";
        }, true]);
        outerEnable.appendChild(enableButton);
        UI.appendChild(outerEnable);

        let outerTurbo = document.createElement('center');
        let turboBtn = document.createElement('button');
        turboBtn.className = "";
        turboBtn.style.backgroundColor = "transparent";
        turboBtn.style.border = "3px solid";
        turboBtn.style.borderRadius = "3px";
        turboBtn.style.fontSize = "125%";
        turboBtn.style.borderColor = "#ff1a1a";
        turboBtn.style.color = "#ff1a1a";
        turboBtn.style.transition = "border 500ms, border-color 500ms, color 500ms";
        turboBtn.innerHTML = "Turbo";
        turboBtn.onclick = () => {
            turboBtn.style.color = "#660000";
            turboBtn.style.borderColor = "#660000";
            if (!firstTurbo) {
                firstTurbo = true;
                if (localStorage["turboAlert"]) {
                    try {
                        turbo();
                    } catch(e) {
                        debug("WARN: Couldn't turbo", e);
                    };
                } else {
                    alert("WARNING: Turbo Can Get You Banned!\nThis message will not be displayed again.");
                    localStorage["turboAlert"] = 1;
                    try {
                        turbo();
                    } catch(e) {
                        debug("WARN: Couldn't turbo", e);
                    };
                }
            }
        }
        UI.appendChild(document.createElement('br'));
        outerTurbo.appendChild(turboBtn);
        UI.appendChild(outerTurbo);
        UI.appendChild(document.createElement('br'));
        statsDiv = document.createElement('center');
        statsDiv.innerHTML = 'Stats are loading...';
        statsDiv.style.color = 'grey';
        statsDiv.style.display = 'none';
        UI.appendChild(statsDiv);
        UI.appendChild(document.createElement('br'));

        function moveUI(e) {
            UI.style.top = (e.clientY - (e.clientY - UI.style.top)) + 'px';
            UI.style.left = (e.clientX - (e.clientX - UI.style.left)) + 'px';
        }
        _.listen.apply(window, ['keydown', e => {
            if (e.keyCode == 27) {
                toggled = !toggled;
                if (toggled) {
                    UI.style.opacity = 0;
                    g.style.opacity = 0;
                    UI.style.pointerEvents = "none";
                    g.style.pointerEvents = "none";
                } else {
                    UI.style.opacity = UIopacity;
                    if (localStorage['chartOn']) g.style.opacity = UIopacity;
                    UI.style.pointerEvents = "auto";
                    if (localStorage['chartOn']) g.style.pointerEvents = "auto";
                    else g.style.pointerEvents = "none";
                }
            }
        }]);
        _.listen.apply(window, ['mouseup', e => {
            isDragging = false;
            UI.style.opacity = UIopacity;
            UI.style.borderColor = "#000066";
            e.preventDefault();
            _.unlisten.apply(window, ['mousemove', moveUI, true]);
        }, false]);
        root.appendChild(UI);
        detectWebGL();
        createOptsMenu();
        if (apie.onReady) {
            apie.onReady();
        }
    },
    initChart = () => {
        if (!document.body) {
            let _initChart = initChart.bind(this);
            setTimeout(_initChart, 300);
            return;
        }
        g.style.zIndex = 9999;
        g.style.backgroundColor = "#000";
        g.style.fontFamily = "Ubuntu";
        g.style.position = "fixed";
        g.style.bottom = "5%";
        g.style.right = "5%";
        g.style.fontSize = "125%";
        g.style.color = "white";
        g.style.opacity = 0.7;
        g.style.padding = "10px";
        g.style.border = "6px solid";
        g.style.borderColor = "#000066";
        g.style.borderRadius = "7px";
        g.style.width = "40%";
        g.style.height = "25%";
        g.style.transition = "opacity 500ms, border 500ms, border-color 500ms";
        Highcharts.chart(g, {
            chart: {
                backgroundColor: {
                    linearGradient: [0, 0, 500, 500],
                    stops: [
                        [0, 'rgb(0, 0, 0)'],
                        [1, 'rgb(0, 0, 0)']
                    ]
                },
                style: {
                    color: "#fff",
                    fontFamily: "Ubuntu"
                }
            },
            title: {
                text: "Speed",
                x: -20,
                style: {
                    color: "#fff",
                    fontFamily: "Ubuntu"
                }
            },
            tooltip: {
                valueSuffix: ' WPM',
            },
            xAxis: {
                gridLineWidth: 0,
                categories: [
                    //
                ],
                labels: {
                    style: {
                        color: '#FFF',
                        font: 'Ubuntu'
                    }
                }
            },
            yAxis: {
                gridLineWidth: 0,
                title: {
                    text: "WPM"
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#ff0000'
                }],
                labels: {
                    style: {
                        color: '#FFF',
                        font: 'Ubuntu'
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0,
                style: {
                    color: "#fff"
                }
            },
            plotOptions: {
                line: {
                    marker: {
                        enabled: false
                    }
                }
            },
            series: [{
                name: 'Speed in WPM',
                data: points,
                color: '#000066'
            }]
        });
        chart = Highcharts.charts[0];
        _.listen.apply(g, ['mouseover', () => {
            if (localStorage['chartOn']) g.style.opacity = 1;
            if (localStorage['chartOn']) g.style.borderColor = "#0000ff";
        }, true]);
        _.listen.apply(g, ['mouseout', () => {
            if (localStorage['chartOn']) g.style.opacity = 0.7;
            if (localStorage['chartOn']) g.style.borderColor = "#000066";
        }, true]);
        addGraph(g);
        setTimeout(() => {
            let cr = g.getElementsByClassName('highcharts-credits');
            for (let i = 0; i < cr.length; i++) {
                cr[i].remove();
            }
        }, 500);
        if (!localStorage['chartOn']) {
            g.style.opacity = 0;
        }
    },
    createOptsMenu = () => {
        opt = document.createElement('div');
        opt.style.zIndex = 99999999;
        opt.style.backgroundColor = "#000";
        opt.style.border = "6px solid";
        opt.style.borderColor = "#000066";
        opt.style.borderRadius = "6px";
        opt.style.fontSize = "150%";
        opt.style.color = "#FFF";
        opt.style.position = "fixed";
        opt.style.padding = "10px";
        opt.style.top = "50%";
        opt.style.left = "50%";
        opt.style.display = "inline-block";
        opt.style.fontFamily = "Ubuntu";
        opt.style.transform = "translate(-50%, -50%)";
        opt.style.transition = "opacity 500ms, border 500ms, border-color 500ms";

        opt.style.opacity = 0;
        opt.style.pointerEvents = "none";

        let inner = document.createElement('center');

        let lbl = document.createElement('h1');
        lbl.style.fontSize = "150%";
        lbl.innerHTML = "Customize L_0R3NZ0 TypeBot";
        inner.appendChild(lbl);

        let outerBotOn = document.createElement('div');
        let botOnBtn = document.createElement('button');
        botOnBtn.className = "";
        botOnBtn.style.backgroundColor = "transparent";
        botOnBtn.style.border = "3px solid";
        botOnBtn.style.borderRadius = "3px";
        botOnBtn.style.fontSize = "100%";
        botOnBtn.style.borderColor = "LimeGreen";
        botOnBtn.style.color = "LimeGreen";
        botOnBtn.style.transition = "border 500ms, border-color 500ms, color 500ms";
        botOnBtn.innerHTML = "On";
        botOnBtn.onclick = () => {
            enabled = !enabled;
            if (!enabled) {
                botOnBtn.style.borderColor = "red";
                botOnBtn.style.color = "red";
                botOnBtn.innerHTML = "Off";
            } else {
                botOnBtn.style.borderColor = "LimeGreen";
                botOnBtn.style.color = "LimeGreen";
                botOnBtn.innerHTML = "On";
            }
        }
        outerBotOn.innerHTML += "Bot enabled: ";
        outerBotOn.appendChild(botOnBtn);
        inner.appendChild(outerBotOn);

        let outerToggle = document.createElement('div');
        let toggleButton = document.createElement('button');
        toggleButton.className = "";
        toggleButton.style.backgroundColor = "transparent";
        toggleButton.style.border = "3px solid";
        toggleButton.style.borderRadius = "3px";
        toggleButton.style.fontSize = "100%";
        toggleButton.style.transition = "border 500ms, border-color 500ms, color 500ms";

        if (autoRefresh) {
            toggleButton.style.borderColor = "LimeGreen";
            toggleButton.style.color = "LimeGreen";
            toggleButton.innerHTML = "On";
        } else {
            toggleButton.style.borderColor = "red";
            toggleButton.style.color = "red";
            toggleButton.innerHTML = "Off";
        }
        toggleButton.onclick = () => {
            autoRefresh = !autoRefresh;
            setLocalStorage('autoRefresh', autoRefresh);
            if (!autoRefresh) {
                toggleButton.style.borderColor = "red";
                toggleButton.style.color = "red";
                toggleButton.innerHTML = "Off";
            } else {
                toggleButton.style.borderColor = "LimeGreen";
                toggleButton.style.color = "LimeGreen";
                toggleButton.innerHTML = "On";
            }
        }
        outerToggle.innerHTML += "Auto Refresh: ";
        outerToggle.appendChild(toggleButton);
        inner.appendChild(outerToggle);

        let outerNtr = document.createElement('div');
        autoNitroBtn = document.createElement('button');
        autoNitroBtn.className = "";
        autoNitroBtn.style.backgroundColor = "transparent";
        autoNitroBtn.style.border = "3px solid";
        autoNitroBtn.style.borderRadius = "3px";
        autoNitroBtn.style.fontSize = "100%";
            autoNitroBtn.style.transition = "border 500ms, border-color 500ms, color 500ms";
        if (autoNitro) {
            autoNitroBtn.style.borderColor = "LimeGreen";
            autoNitroBtn.style.color = "LimeGreen";
            autoNitroBtn.innerHTML = "On";
        } else {
            autoNitroBtn.style.borderColor = "red";
            autoNitroBtn.style.color = "red";
            autoNitroBtn.innerHTML = "Off";
        }
        autoNitroBtn.onclick = () => {
            autoNitro ? autoNitroOn() : autoNitroOff();
        }
        outerNtr.innerHTML += "Auto Nitro: ";
        outerNtr.appendChild(autoNitroBtn);
        inner.appendChild(outerNtr);

        let outerChrtBtn = document.createElement('div');
        let chartBtn = document.createElement('button');
        chartBtn.className = "";
        chartBtn.style.backgroundColor = "transparent";
        chartBtn.style.border = "3px solid";
        chartBtn.style.borderRadius = "3px";
        chartBtn.style.fontSize = "100%";
        chartBtn.style.transition = "border 500ms, border-color 500ms, color 500ms";

        if (localStorage['chartOn']) {
            chartBtn.style.borderColor = "LimeGreen";
            chartBtn.style.color = "LimeGreen";
            chartBtn.innerHTML = "On";
        } else {
            chartBtn.style.borderColor = "red";
            chartBtn.style.color = "red";
            chartBtn.innerHTML = "Off";
        }
        chartBtn.onclick = () => {
            if (localStorage['chartOn']) {
                delete localStorage['chartOn'];
                chartBtn.style.borderColor = "red";
                chartBtn.style.color = "red";
                chartBtn.innerHTML = "Off";
            } else {
                localStorage['chartOn'] = 1;
                chartBtn.style.borderColor = "LimeGreen";
                chartBtn.style.color = "LimeGreen";
                chartBtn.innerHTML = "On";
                g.style.opacity = 0.7;
            }
        }
        outerChrtBtn.innerHTML += "Speed chart: ";
        outerChrtBtn.appendChild(chartBtn);
        inner.appendChild(outerChrtBtn);

        let outerACfg = document.createElement('div');
        acc = document.createElement('input');
        acc.type = "number";
        acc.min = 10;
        acc.max = 100;
        acc.value = accuracy * 100;
        acc.className = "";
        acc.style.backgroundColor = "transparent";
        acc.style.border = "3px solid";
        acc.style.borderRadius = "3px";
        acc.style.fontSize = "100%";
        acc.style.borderColor = "LimeGreen";
        acc.style.color = "LimeGreen";
        acc.style.transition = "border 500ms, border-color 500ms, color 500ms";
        acc.onchange = () => {
            accuracy = parseInt(acc.value);
            if (isNaN(accuracy)) {
                accuracy = 0.98;
                acc.value = 98;
            } else {
                accuracy *= 0.01;
            }
            setLocalStorage('accuracy', accuracy);
        }

        outerACfg.innerHTML += "Accuracy %: ";
        outerACfg.appendChild(acc);
        inner.appendChild(outerACfg);

        let oWPMCfg = document.createElement('div');
        wpm = document.createElement('input');
        wpm.type = "number";
        wpm.min = 3;
        wpm.max = MAX_WPM; // About the fastest you can go without any bans
        wpm.value = wordsPerMinute;
        wpm.className = "";
        wpm.style.backgroundColor = "transparent";
        wpm.style.border = "3px solid";
        wpm.style.borderRadius = "3px";
        wpm.style.fontSize = "100%";
        wpm.style.borderColor = "LimeGreen";
        wpm.style.color = "LimeGreen";
        wpm.style.transition = "border 500ms, border-color 500ms, color 500ms";
        wpm.onchange = () => {
            if (localStorage["speedChange"]) {
                wordsPerMinute = parseInt(wpm.value);
                if (wordsPerMinute > 800) {
                    alert('WARNING: You WILL be banned if you set your WPM above 200.');
                }
                if (isNaN(wordsPerMinute))
                    wpm.value = 900;
                setWPM(wpm.value);
            } else {
                // alert('It is not recommended to alter the default speed of UltraType, be careful! This message will not be shown again.');
                setLocalStorage('speedChange', true);
            }
        }

        oWPMCfg.innerHTML += "WPM: ";
        oWPMCfg.appendChild(wpm);
        inner.appendChild(oWPMCfg);

        let outerStatTogg = document.createElement('div');
        statTogg = document.createElement('button');

        statTogg.className = "";
        statTogg.style.backgroundColor = "transparent";
        statTogg.style.border = "3px solid";
        statTogg.style.borderRadius = "3px";
        statTogg.style.fontSize = "100%";
        statTogg.style.borderColor = "LimeGreen";
        statTogg.style.color = "LimeGreen";
        statTogg.style.transition = "border 500ms, border-color 500ms, color 500ms";
        statTogg.innerHTML = "On";
        statTogg.onclick = () => {
            statsOn = !statsOn;
            if (statsOn) {
                statTogg.style.borderColor = "LimeGreen";
                statTogg.style.color = "LimeGreen";
                statTogg.innerHTML = "On";
                updateStats();
            } else {
                statTogg.style.borderColor = "red";
                statTogg.style.color = "red";
                statTogg.innerHTML = "Off";
                disableStats();
            }
            setLocalStorage('statsOn', statsOn);
        }
        outerStatTogg.innerHTML = "User Stats: ";
        outerStatTogg.appendChild(statTogg);
        inner.appendChild(outerStatTogg);

        let outerAutoT = document.createElement('div');
        let autoT = document.createElement('button');
        autoT.className = "";
        autoT.style.backgroundColor = "transparent";
        autoT.style.border = "3px solid";
        autoT.style.borderRadius = "3px";
        autoT.style.fontSize = "100%";
        autoT.style.borderColor = "LimeGreen";
        autoT.style.color = "LimeGreen";
        autoT.style.transition = "border 500ms, border-color 500ms, color 500ms";
        autoT.innerHTML = "On";
        autoT.onclick = () => {
            if (!autoTurbo) {
                autoT.style.borderColor = "LimeGreen";
                autoT.style.color = "LimeGreen";
                autoT.innerHTML = "On";
                autoTurboOn();
            } else {
                autoT.style.borderColor = "red";
                autoT.style.color = "red";
                autoT.innerHTML = "Off";
                autoTurboOff();
            }
        }
        // Set the default button state
        if (autoTurbo) {
            autoT.style.borderColor = "LimeGreen";
            autoT.style.color = "LimeGreen";
            autoT.innerHTML = "On";
        } else {
            autoT.style.borderColor = "red";
            autoT.style.color = "red";
            autoT.innerHTML = "Off";
        }
        outerAutoT.innerHTML = "Auto Turbo: ";
        outerAutoT.appendChild(autoT);
        inner.appendChild(outerAutoT);

        let tips = document.createElement('p');
        tips.innerHTML = "Press escape to hide all of the L_0R3NZ0 Type.<br>";
        inner.appendChild(tips);

        let outerExitBtn = document.createElement('center');
        let exitButton = document.createElement('button');
        exitButton.className = "";
        exitButton.style.borderColor = "#808080";
        exitButton.style.color = "#808080";
        exitButton.style.fontSize = "175%";
        exitButton.style.border = "3px solid";
        exitButton.style.borderRadius = "3px";
        exitButton.style.backgroundColor = "transparent";
        exitButton.style.transition = "border 500ms, border-color 500ms, color 500ms";
        _.listen.apply(exitButton, ["mouseover", () => {
            exitButton.style.color = "#FFF";
            exitButton.style.borderColor = "#FFF";
        }, true]);
        _.listen.apply(exitButton, ["mouseout", () => {
            exitButton.style.color = "#808080";
            exitButton.style.borderColor = "#808080";
        }, true]);
        exitButton.innerHTML = "Exit";
        exitButton.onclick = () => {
            opt.style.opacity = 0;
            opt.style.pointerEvents = "none";
            optOn = false;
            opt.blur();
        }
        outerExitBtn.appendChild(exitButton);
        inner.appendChild(outerExitBtn);

        opt.appendChild(inner);
        root.appendChild(opt);

        setTimeout(() => {
            let localAutoRefresh = localStorage['autoRefresh'],
                localAccuracy = localStorage['accuracy'],
                localWPM = localStorage['wpm'],
                localAutoNitro = localStorage['autoNitro'];
            if (localAutoNitro !== null && localAutoNitro !== undefined) {
                localAutoNitro = JSON.parse(localAutoNitro);
                if (localAutoNitro == false) {
                    autoNitroOff();
                } else {
                    autoNitroOn();
                }
            }

            if (localAutoRefresh) {
                autoRefresh = JSON.parse(localAutoRefresh);
                if (!autoRefresh) {
                    toggleButton.style.borderColor = "red";
                    toggleButton.style.color = "red";
                    toggleButton.innerHTML = "Off";
                } else {
                    toggleButton.style.borderColor = "LimeGreen";
                    toggleButton.style.color = "LimeGreen";
                    toggleButton.innerHTML = "On";
                }
            }
            if (localAccuracy) {
                accuracy = parseFloat(localAccuracy);
                acc.value = accuracy * 100;
            }
            if (localWPM) {
                wpm.value = localWPM;
                wordsPerMinute = parseInt(localWPM);
                setWPM(wordsPerMinute);
            }
            if (statsOn) {
                statTogg.style.borderColor = "LimeGreen";
                statTogg.style.color = "LimeGreen";
                statTogg.innerHTML = "On";
                updateStats();
            } else {
                statTogg.style.borderColor = "red";
                statTogg.style.color = "red";
                statTogg.innerHTML = "Off";
                disableStats();
            }
        }, 1000);
    },
    blockAd = ad => {
        try {
            ad.style.display = "none";
        } catch (e) {
            ad.src = "about:blank";
        }
        try {
            ad.parentElement.parentElement.parentElement.remove();
        } catch (e) {};
    },
    changeTip = node => {
        setTimeout(() => {
            node.style.fontSize = "125%";
            node.style.border = "3px solid #000066";
            node.style.borderRadius = "7px";
            node.style.opacity = 0.7;
            node.style.pointerEvents = "none";
            node.innerHTML = "";
            node.innerHTML += FONT;
            node.innerHTML += '<center style="font-family:Ubuntu;">Michal is not gay like you.<br>Version: ' + VERSION + '</center>';
        }, 1000);
    },
    detectWebGL = () => {
        if (document.cookie.includes('webgl')) {
            document.cookie = document.cookie.replace('webgl', 'canvas');
        }
    },
    handleScript = scr => {
        if (scr.src.includes('race-lib')) {
            scr.addEventListener('load', () => {
                _set = PIXI.BitmapText.prototype.setText;
                let tos = __.toStr;
                PIXI.BitmapText.prototype.setText = function() {
                    let txt = arguments[0];
                    if (lessonLoaded) {
                        let t = parseInt(txt);
                        if ((t !== 0) && (t > 5)) {
                            points.push(t);
                            chart.series[0].setData(points, true);
                        }
                    }
                    _set.apply(this, arguments);
                }
            });
        } else if (scr.src.includes('libs')) {
            if (hasScrLoaded) return;
            else hasScrLoaded = 1;
            scr.addEventListener('load', () => {
                let didGetHandler = false;
                _attachHandler = $.fn.constructor.prototype.keypress;
                $.fn.constructor.prototype.keypress = function() {
                    if (this && this[0] && this[0] == document.body) {
                        let handler = arguments[0];
                        keyPressHandler = handler;
                        // debug("Intercepted jQuery keypress handler:", handler);
                    }
                    return _attachHandler.apply(this, arguments);
                }
            });
        } else if (scr.src.includes('app.min.')) {
            scr.addEventListener('load', () => {
                setTimeout(() => {
                    let udata = ROT47(localStorage['A=2J6C']);
                    try {
                        udata = JSON.parse(udata);
                    } catch (e) {
                        return;
                    }
                    // udata.websocketSupport = true;
                    udata = ROT47(JSON.stringify(udata));
                    localStorage['A=2J6C'] = udata;
                }, 100);
            });
        }
    }
    console.warn = function() {
        if (arguments[0] == "You have been disqualified") {
            disqualified = true;
        }
        console.log.apply(this, arguments);
    }
    __.fill = function() {
        handleFillText(arguments);
        _.fill.apply(this, arguments);
    }
    let _set = null,
        _send = WebSocket.prototype.send;
    WebSocket.prototype.send = function() {
        if (typeof arguments[0] !== 'string') {
            return _send.apply(this, arguments);
        }
        let msg = arguments[0],
            header = msg[0],
            obj = null;
        msg = msg.substr(1, msg.length);
        try {
            obj = JSON.parse(msg);
        } catch(e) {
            return _send.apply(this, arguments);;
        }
        if (obj && obj.payload && obj.payload.a) {
            debug("very naughty packet detected, lets fix that");
            delete obj.payload.a;
            // Replace packet
            arguments[0] = header + JSON.stringify(obj);
        }
        return _send.apply(this, arguments);
    }
    onfinish(() => {
        debug("Race has finished. Doing a ban check and reloading if needed.");
        if (apie.onRaceFinish) {
            apie.onRaceFinish();
        }
        endTime = new Date();
        infoSpan.innerHTML = "Finished";
        infoSpan.style.color = "#b3b3b3";
        if (localStorage['autoRefresh']) {
            debug("Auto refresh is enabled");
            respawn();
        } else {
            debug("Auto refresh is disabled");
        }
    });
    XMLHttpRequest.prototype.send = function() {
        let payload = arguments[0];
        let header = '';
        if (payload && payload.length > 4 && payload[4] == '{') {
            let obj;
            header = payload.substr(0, 4);
            try {
                obj = JSON.parse(payload.substr(4, payload.length));
            } catch(e) {
                return _.xsend.apply(this, arguments);
            }
            if (obj.payload && obj.payload.a) {
                // Remove cheater flag from outgoing packet
                delete obj.payload.a;
                arguments[0] = header + JSON.stringify(obj);
            }
        }
        return _.xsend.apply(this, arguments);
    }
    XMLHttpRequest.prototype.open = function() {
        if (arguments[1].includes('/api/error')) {
            errorRequests.push(this);
            this.abort();
            return;
            } else if (arguments[1].includes('problem-keys')) {
            if (PROBLEM_KEYS_DEBUG) {
                console.warn('PROBLEM_KEYS_DEBUG is enabled, firing up debugger.');
                debugger;
            }
            if (ABORT_PROBLEM_KEYS) {
                debug("Aborting problem-keys AJAX request.");
                this.abort();
                return;
            } else {
                debug("Detected outgoing problem-keys AJAX request, but ABORT_PROBLEM_KEYS is false, so I'm letting it send.");
            }
        }
        return _.xopen.apply(this, arguments);
    }
    // inject undetectable features
    window.PIXI = {};
    PIXI.BitmapText = function() {};
    PIXI.BitmapText.prototype.setText = function(a) { this.text = a || " ", this.dirty = !0 };
    let hostt = ShadowRoot.prototype.__lookupGetter__('host');
    let _getToStr = Function.prototype.__lookupGetter__('toString');
    let _setTxt = Element.prototype.__lookupSetter__('textContent');
    let _getTitle = Document.prototype.__lookupGetter__('title');
    let _setTitle = Document.prototype.__lookupSetter__('title');
    CanvasRenderingContext2D.prototype.fillText = __.fill;
    window.WebSocket = __ws;
    Function.prototype.toString = __.toStr = function() {
        if (this === Function.prototype.toString) return _.toStr.call(_.toStr);
        if (this === CanvasRenderingContext2D.prototype.fillText) return _.toStr.call(_.fill);
        if (this === Object.prototype.__lookupGetter__) return _.toStr.call(_.get);
        if (this === ShadowRoot.prototype.__lookupGetter__('host')) return _.toStr.call(hostt);
        if (this === Function.prototype.__lookupGetter__('toString')) return _.toStr.call(_getToStr);
        if (this === Element.prototype.__lookupSetter__('textContent')) return _.toStr.call(_setTxt);
        if (this === Document.prototype.__lookupGetter__('title')) return _.toStr.call(_getTitle);
        if (this === Document.prototype.__lookupSetter__('title')) return _.toStr.call(_setTitle);
        if (this === PIXI.BitmapText.prototype.setText) return _.toStr.call(_get);
        if (this === console.warn) return _.toStr.call(_.warn);
        if (this === WebSocket) return _.toStr.call(_.ws);
        if (this === XMLHttpRequest.prototype.send) return _.toStr.call(_.xsend);
        if (this === XMLHttpRequest.prototype.open) return _.toStr.call(_.xopen);
        if (this === window.onerror) return _.toStr.call(_.oerr);
        if (window.jQuery && this === jQuery.fn.keypress) return _.toStr.call(_attachHandler);
        return _.toStr.call(this);
    }
    ShadowRoot.prototype.__defineGetter__('host', () => {
        if (this === injectedRoot) return null;
        return _.host.call(this);
    });
    let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type == "childList" && mutation.addedNodes.length > 0) {
                for (let i in mutation.addedNodes) {
                    if (mutation.addedNodes[i].nodeName == "BODY") createUI(mutation.addedNodes[i]);
                    if (mutation.addedNodes[i].nodeName == "IFRAME") blockAd(mutation.addedNodes[i]);
                    if (mutation.addedNodes[i].className == "race-tip") changeTip(mutation.addedNodes[i]);
                    if (mutation.addedNodes[i].nodeName == "SCRIPT") handleScript(mutation.addedNodes[i]);
                }
            }
        });
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });
    let _fakeToStr = __.toStr;
    _fakeToStr.__proto__ = _.toStr.prototype;
    _fakeToStr.prototype = _.toStr.prototype;
    Object.defineProperty(Function.prototype, 'toString', {
        get: () => {
            if (this === __.toStr) return _fakeToStr;
            return __.toStr;
        },
        enumerable: false
    });
    localStorage.clear = function() {} // Disable localStorage clearing
    Function.prototype.__defineGetter__('toString', function() {
        if (this === CanvasRenderingContext2D.prototype || this === CanvasRenderingContext2D.prototype.fillText) return __.toStr;
        if (this === console || this === console.warn) return __.toStr;
        if (this === ShadowRoot.prototype.__lookupGetter__('host') || this === ShadowRoot.prototype) return __.toStr;
        if (this === Object.prototype || this === Object.prototype.__lookupGetter__) return __.toStr;
        if (this === Function.prototype.__lookupGetter__('toString')) return __.toStr;
        if (this === PIXI.BitmapText.prototype.setText) return __.toStr;
        if (this === WebSocket) return __.toStr;
        if (this === injectedRoot) return __.toStr;
        if (this === Document.prototype.__lookupGetter__('title')) return __.toStr;
        if (this === Document.prototype.__lookupSetter__('title')) return __.toStr;
        if (this === XMLHttpRequest.prototype.send) return __.toStr;
        if (this === XMLHttpRequest.prototype.open) return __.toStr;
        if (this === window.onerror) return __.toStr;
        if (window.jQuery && this === jQuery.fn.keypress) return __.toStr;
        return _.toStr;
    });
    setInterval(() => {
        _setTitle.call(document, "L_0R3NZ0 Type Bot!");
    }, 100);
    Document.prototype.__defineGetter__('title', t => {
        return _title;
    });
    Document.prototype.__defineSetter__('title', t => {
        _title = t;
    });
    _.listen.apply(window, ['load', () => {
        _.oerr = window.onerror;
        window.onbeforeunload = () => {
            return null;
        };
        window.ga = () => {};
        window.onerror = evt => {
            if (evt.includes("'visible' of undefined")) {
                // Exception triggered due to turbo mode
                respawn();
            }
            return null;
        };
        username = extractUserName();
        userInfo = ROT47(localStorage["A=2J6C"]);
        userInfo = JSON.parse(userInfo);
        debug("Extracted and decrypted user info", userInfo);
        if (localStorage['statsOn']) statsOn = true;
    }]);
    /*
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(removeUITrash, 75);
    });
    */
    let registerAPIEvent = (evt, callback) => {
        if (typeof callback !== 'function') {
            throw new Error('Invalid event callback.');
            return;
        }
        switch (evt) {
            case "userBanned":
                apie.onUserBanned = callback;
                break;
            case "raceStart":
                apie.onRaceStart = callback;
                break;
            case "raceEnd":
            case "raceFinish":
                apie.onRaceFinish = callback;
                break;
            case "nitroUsed":
            case "nitroUse":
            case "nitro":
                apie.onNitroUsed = callback;
                break;
            case "raceStarting":
            case "raceBegin":
            case "raceInit":
                apie.onRaceStarting = callback;
                break;
            case "type":
            case "typed":
            case "botType":
                apie.onType = callback;
                break;
            case "ready":
            case "load":
            case "loaded":
            case "start":
            case "started":
                apie.onReady = callback;
                break;
            default:
                throw new Error('Invalid event name!');
                break;
        }
        return window.UltraTypeCore;
    }

    // Core API
    let core = {
        on: registerAPIEvent,
        turbo: turbo,
        setWPM: setWPM,
        sendTypePacket: typePacket,
        typeChar: type,
        stopFromRunning: () => { // Stops the bot from appearing or typing
            isStopped = true;
        },
        getDecyptedUserInfo: () => {
            if (userInfo) {
                return userInfo;
            } else {
                return null;
            }
        },
        setAutoTurbo: state => {
            if (state === false) {
                autoTurboOff();
            } else if (state === true) {
                autoTurboOn();
            } else {
                throw new Error('Invalid auto turbo state.');
            }
        },
        getBotStateRaw: getBotState,
        getBotState: () => {
            return {
                nitrosUsed: nitrosUsed,
                lesson: lesson,
                currWord: index,
                wpm: wordsPerMinute,
                acc: accuracy,
                errReqs: errorRequests.length,
                uinfo: JSON.stringify(userInfo),
                fillsY: fillsY.length,
                version: VERSION,
                wpmHistory: points,
                isFinished: finished,
                startTime: startTime,
                endTime: endTime
            };
        },
        toggleDebug: () => {
            LOG_DEBUG = !LOG_DEBUG;
        },
        getLesson: () => {
            if (lesson) {
                return lesson;
            } else return null;
        },
        setAutoRefresh: val => {
            if (typeof val !== 'boolean') {
                throw new Error('Can only set auto refresh to a boolean.');
                return;
            } else {
                autoRefresh = val;
            }
        },
        getNitrosUsed: () => { return nitrosUsed || 0 },
        toggleBotLog: () => {
            LOG_TYPING_INFO = !LOG_TYPING_INFO;
        },
        disableStats: disableStats,
        randBool: randomBool,
        updateStats: updateStats,
        useNitro: useNitro,
        flushRaw: () => {
            // Reset UltraType to it's default settings
            [
                'accuracy',
                'autoRefresh',
                'autoTurbo',
                'statsOn',
                'autoNitro',
                'wpm',
                'chartOn',
                'speedChange'
            ].forEach(k => {
                delete localStorage[k];
            });
        },
        flush: () => {
            core.flushRaw();
            delete localStorage['ultratypedev'];
            console.warn('Flushed UltraType settings, reloading...');
            setTimeout(location.reload.bind(location), 1000);
        },
        toggleLocalLoad: () => {
            if (localStorage["ultratypedev"]) {
                delete localStorage["ultratypedev"];
                console.info("Disabled local loading.");
            } else {
                localStorage["ultratypedev"] = true;
                console.info("Enabled local loading.");
            }
        },
        // Utility method to automatically involk debugger when a function is called
        debugFn: fn => {
            let _fn = fn;
            fn = function() {
                debugger;
                _fn.apply(this, arguments);
            }
            return fn;
        }
    }
    window.UltraTypeCore = core;
    let hcScript = document.createElement('script');
    hcScript.src = 'https://code.highcharts.com/highcharts.src.js';
    hcScript.addEventListener('load', () => {
        setTimeout(initChart.bind(window), 250);
    });
    document.head.appendChild(hcScript);

    // Bye bye!
    console.log('UltraType version ' + VERSION + ' loaded.');
    document.currentScript.remove();
})();