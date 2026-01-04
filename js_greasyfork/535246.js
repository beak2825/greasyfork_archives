// ==UserScript==
// @name           Msd
// @name:tr        SDk
// @description    Gartic.io için Bot Paneli
// @description:tr Gartic.io için Bot Paneli (WS ile)
// @version        1.3
// @author         Msd
// @license        MIT
// @match          https://gartic.io/*
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_addStyle
// @grant          window.focus
// @grant          window.close
// @namespace      https://greasyfork.org/users/1220697
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/535246/Msd.user.js
// @updateURL https://update.greasyfork.org/scripts/535246/Msd.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // SweetAlert2 CSS'yi ekle
    GM_addStyle(`
        @import url('https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css');
    `);

    // Global Değişkenler
    let botc = 0, readyc = 0, otoeven = 0;
    let cmd = "", wss = [], tojoin = 0, usersinroom = [], customkickitems = [], messagejoinitems = [],
        tfr, tg, intervalbroadcast, intervalmsg, intervalanswer, intervalantiafk, rainbowdraw,
        rainbowdrawmode = false, botsidvalue = [], wordsInterval, botID, botlongID, theme, am,
        avatar = localStorage.getItem("avatar") || 1,
        botnick = localStorage.getItem("botnick") || "1",
        nick = localStorage.getItem("nick") || "Msd";

    // ICEbot V5 HTML arayüzü
    const html = `
        <div class="userlist">
            <div class="userkickmenu"></div>
            <input type="submit" style="width:90px; background:red" onclick="window.postMessage('kickall','*')" value="KICK ALL">
            <input type="checkbox" class="kickonjoin"> Kick on join<br>
            <input type="checkbox" class="kickallwhenjoin"> Kick when join<hr>
        </div>
        <div class="option">
            <button class="hidemenu" onclick="window.postMessage('hidemenu','*')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            </button>
            <button class="menu1" onclick="window.postMessage('menu1','*')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
            </button>
            <button class="menu2" onclick="window.postMessage('menu2','*')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </button>
            <button class="menu3" onclick="window.postMessage('menu3','*')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
            </button>
            <button class="menu4" onclick="window.postMessage('menu4','*')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            </button>
            <button class="menu5" onclick="window.postMessage('menu5','*')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
            <button class="menu6" onclick="window.postMessage('menu6','*')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2z"></path>
                </svg>
            </button>
        </div>
        <div id="avatarlist" class="icebot">
            <div class="avatarlist"></div>
        </div>
        <div id="icebotlog" style="display:block; top:0px; max-height:3000px !important; height:300px !important;">
            <div class="icebotlog"></div>
        </div>
        <div id="icebot1" class="icebot">
            <center>
                <input type="text" id="roomlink" placeholder="Room Link"><br>
                <input type="text" id="botnick" placeholder="Bot Nick"><br>
                <input type="text" id="avatar" placeholder="Avatar"><br>
                <input type="submit" onclick="window.postMessage('join','*')" value="Join">
            </center>
        </div>
        <div id="icebot2" class="icebot">
            <center>
                <input type="text" id="broadcast" placeholder="Broadcast"><br>
                <input type="submit" onclick="window.postMessage('broadcast','*')" value="Send"><br>
                <input type="text" id="message" placeholder="Message"><br>
                <input type="submit" onclick="window.postMessage('chat','*')" value="Send"><br>
                <input type="text" id="answer" placeholder="Answer"><br>
                <input type="submit" onclick="window.postMessage('answer','*')" value="Send"><br>
                <input type="submit" onclick="window.postMessage('report','*')" value="Report"><br>
                <input type="submit" onclick="window.postMessage('jump','*')" value="Jump"><br>
                <input type="submit" onclick="window.postMessage('reconnect','*')" value="Reconnect"><br>
                <input type="submit" onclick="window.postMessage('acceptdraw1','*')" value="Accept Draw 1"><br>
                <input type="submit" onclick="window.postMessage('acceptdraw2','*')" value="Accept Draw 2"><br>
                <input type="submit" onclick="window.postMessage('tips','*')" value="Tips"><br>
                <input type="submit" onclick="window.postMessage('exit','*')" value="Exit"><br>
                <input type="submit" onclick="window.postMessage('draw','*')" value="Draw">
            </center>
        </div>
        <div id="icebot3" class="icebot">
            <center>
                <input type="text" id="broadcastspam" placeholder="Broadcast Spam"><br>
                <input type="submit" id="broadcaststart" onclick="window.postMessage('broadcastspamtoggle','*')" value="Start"><br>
                <input type="submit" id="broadcaststop" style="display:none" onclick="window.postMessage('stopbroadcast','*')" value="Stop"><br>
                <input type="text" id="messagespam" placeholder="Message Spam"><br>
                <input type="submit" id="msgstart" onclick="window.postMessage('chatspamtoggle','*')" value="Start"><br>
                <input type="submit" id="msgstop" style="display:none" onclick="window.postMessage('stopmsg','*')" value="Stop"><br>
                <input type="text" id="answerspam" placeholder="Answer Spam"><br>
                <input type="submit" id="answerstart" onclick="window.postMessage('answerspamtoggle','*')" value="Start"><br>
                <input type="submit" id="answerstop" style="display:none" onclick="window.postMessage('stopanswer','*')" value="Stop">
            </center>
        </div>
        <div id="icebot4" class="icebot">
            <center>
                <input type="text" id="customkick" placeholder="Custom Kick"><br>
                <input type="submit" onclick="addCustomKick()" value="Add"><br>
                <div id="kicklist-items"></div>
            </center>
        </div>
        <div id="icebot5" class="icebot">
            <center>
                <input type="text" id="messagejoin" placeholder="Join Message"><br>
                <input type="submit" onclick="addMessageJoin()" value="Add"><br>
                <div id="joinmessage-items"></div>
            </center>
        </div>
        <div id="icebot6" class="icebot">
            <center>
                <input type="checkbox" id="autoreport"> Auto Report<br>
                <input type="checkbox" id="autoskip"> Auto Skip<br>
                <input type="checkbox" id="antikick"> Anti Kick<br>
                <input type="checkbox" id="autokick"> Auto Kick<br>
                <input type="checkbox" id="antiafk"> Anti AFK<br>
                <input type="checkbox" id="autofarm"> Auto Farm<br>
                <input type="checkbox" id="autoguess"> Auto Guess<br>
                <input type="color" id="color1" value="#ffffff"><br>
                <input type="color" id="color2" value="#ffffff"><br>
                <input type="color" id="color3" value="#ffffff"><br>
                <input type="color" id="color4" value="#ffffff"><br>
                <input type="submit" onclick="window.postMessage('theme','*')" value="Change Theme"><br>
                <input type="submit" id="autoguessenable" onclick="window.postMessage('autoguessenable','*')" value="Enable Auto Guess"><br>
                <input type="submit" id="autoguessdisable" style="display:none" onclick="window.postMessage('autoguessdisable','*')" value="Disable Auto Guess">
            </center>
        </div>
    `;

    function setCSS() {
        GM_addStyle(`
            body {
                margin: 0;
                background: #1a1a1a;
                color: #fff;
                font-family: 'Arial', sans-serif;
                min-height: 100vh;
                overflow: auto;
            }
            .userlist {
                position: fixed;
                top: 10px;
                left: 10px;
                width: 200px;
                background: #2a2a2a;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                z-index: 9999;
            }
            .userkickmenu {
                max-height: 300px;
                overflow-y: auto;
            }
            .option {
                position: fixed;
                top: 10px;
                right: 10px;
                display: flex;
                flex-direction: column;
                gap: 5px;
                z-index: 9999;
            }
            .option button {
                background: #f5a623;
                border: none;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s;
            }
            .option button:hover {
                background: #e69520;
            }
            .icebot {
                position: fixed;
                background: #2a2a2a;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                z-index: 9999;
                display: none;
            }
            #avatarlist { top: 100px; left: 230px; }
            #icebotlog { top: 100px; right: 10px; }
            #icebot1 { top: 420px; left: 230px; }
            #icebot2 { top: 420px; right: 10px; }
            #icebot3 { top: 720px; left: 230px; }
            #icebot4 { top: 720px; right: 10px; }
            #icebot5 { top: 1020px; left: 230px; }
            #icebot6 { top: 1020px; right: 10px; }
            .icebot input[type="text"], .icebot input[type="color"] {
                width: 100%;
                padding: 8px;
                margin: 5px 0;
                border: 1px solid #f5a623;
                border-radius: 5px;
                background: #3a3a3a;
                color: #fff;
            }
            .icebot input[type="submit"] {
                width: 100%;
                padding: 8px;
                margin: 5px 0;
                background: #f5a623;
                border: none;
                border-radius: 5px;
                color: #fff;
                cursor: pointer;
                transition: background 0.3s;
            }
            .icebot input[type="submit"]:hover {
                background: #e69520;
            }
            .icebot input[type="checkbox"] {
                margin: 5px;
            }
            .icebotlog {
                max-height: 280px;
                overflow-y: auto;
                color: #fff;
            }
            .avatarlist {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            .player-item {
                display: flex;
                align-items: center;
                padding: 8px 12px;
                margin-bottom: 8px;
                background: #3a3a3a;
                border-radius: 10px;
                border: 1px solid #f5a623;
                color: #fff;
            }
            .player-item:hover {
                background: #4a4a4a;
            }
            .kick-btn {
                background: #ff4444;
                border: none;
                padding: 5px 10px;
                border-radius: 5px;
                color: #fff;
                cursor: pointer;
            }
            .kick-btn:hover {
                background: #cc3333;
            }
            @media (max-width: 768px) {
                .userlist, .option, .icebot {
                    width: 90%;
                    left: 5%;
                    right: 5%;
                    top: auto;
                    position: relative;
                    margin: 10px auto;
                }
            }
        `);
    }

    function createHearts() {
        console.log('Creating hearts...');
        const heartsContainer = document.getElementById('hearts');
        if (!heartsContainer) {
            console.error('Hearts container not found!');
            return;
        }
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = Math.random() * 100 + 'vh';
            heart.style.animationDelay = Math.random() * 15 + 's';
            heartsContainer.appendChild(heart);
        }
    }

    function setmenu(menu) {
        console.log('Switching to menu:', menu);
        const elements = ['icebot1', 'icebot2', 'icebot3', 'icebot4', 'icebot5', 'icebot6', 'avatarlist'];
        elements.forEach(element => {
            const el = document.getElementById(element);
            if (el) {
                el.style.display = element === menu ? 'block' : 'none';
            } else {
                console.warn(`Element #${element} not found!`);
            }
        });
    }

    function handleJoin() {
        console.log("handleJoin function triggered!");
        try {
            const roomLinkInput = document.getElementById('roomlink');
            if (!roomLinkInput) {
                throw new Error('Room link input not found!');
            }
            let roomLink = roomLinkInput.value.trim();
            if (!roomLink) {
                roomLink = window.location.href;
                roomLinkInput.value = roomLink;
            }
            const roomCode = roomLink.split("/")[3] || '';
            if (!roomCode) {
                throw new Error('Invalid room link!');
            }
            botc = 0;
            GM_setValue("resetcount", rand());
            readyc = 0;
            let msgstorage = localStorage.getItem("messagejoin");
            if (msgstorage) {
                try {
                    let vm = JSON.parse(msgstorage);
                    setTimeout(() => {
                        vm.forEach(item => {
                            GM_setValue("msg", item.msg + "►" + num(5000));
                        });
                    }, 4000);
                } catch (e) {
                    console.error('Error parsing messagejoin:', e);
                }
            }
            const botNickInput = document.getElementById('botnick');
            const kickOnJoin = document.querySelector('.kickonjoin');
            GM_sendMessage("join", roomCode, botNickInput?.value || nick, avatar, localStorage.getItem("botnick") || "0", kickOnJoin?.checked || false, rand());
            const statusLog = document.getElementById('icebotlog');
            if (statusLog) {
                statusLog.innerText = `Durum: ${roomCode} odasına katılınıyor...`;
            }
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'info',
                title: 'Odaya katılınıyor...',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            console.error('handleJoin error:', error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: error.message || 'Katılma işlemi başarısız!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    }

    let rand = () => Math.floor(Math.random() * 1000000),
        GM_onMessage = (label, cb) => GM_addValueChangeListener(label, (_, __, data) => cb(...data)),
        GM_sendMessage = (label, ...data) => GM_setValue(label, data);

    function f(ICE) {
        const element = document.querySelector(ICE);
        if (!element) {
            console.warn(`Element ${ICE} not found!`);
        }
        return element;
    }
    function fa(ICE) { return document.querySelectorAll(ICE); }
    function num(ICE) { return Math.ceil(Math.random() * ICE + 1); }

    function rc(ICE) {
        let e = f('input[name="chat"]');
        let lv = e.value;
        e.value = "";
        let ev = new Event('input', { bubbles: true });
        ev.simulated = true;
        let t = e._valueTracker;
        if (t) { t.setValue(lv); }
        e.dispatchEvent(ev);
    }

    function rs(ICE) {
        let e = f(".search input");
        let lv = e.value;
        e.value = "";
        let ev = new Event('input', { bubbles: true });
        ev.simulated = true;
        let t = e._valueTracker;
        if (t) { t.setValue(lv); }
        e.dispatchEvent(ev);
    }

    function rnext(kelime) {
        const hd = kelime.split('');
        const hu = hd.length;
        const yh = [];
        const invisibleChars = ['\u200B', '\u200C', '\u200D', '\u2061', '\u2062', '\u2063', '\u2064', '\u2066', '\u17b4', '\u17b5', '\u2068', '\u2069'];
        let charCount = 0;
        for (let i = 0; i < hu; i++) {
            yh.push(hd[i]);
            charCount++;
            if (charCount < 18 && i < hu - 1) {
                const invisibleChar = invisibleChars[Math.floor(Math.random() * invisibleChars.length)];
                yh.push(invisibleChar);
                charCount++;
            }
            if (charCount >= 18) { break; }
        }
        return yh.join('');
    }

    function addCustomKick() {
        console.log('addCustomKick called');
        const input = f('#customkick');
        if (!input) {
            console.error('Custom kick input not found!');
            return;
        }
        const user = input.value.trim();

        if (!user) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: 'Lütfen bir oyuncu adı girin.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        let list = [];
        try {
            const storedList = localStorage.getItem('customkick');
            if (storedList) {
                list = JSON.parse(storedList);
            }
        } catch (e) {
            console.error('localStorage parse hatası:', e);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Veri okuma hatası!',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        list.push({ user });
        localStorage.setItem('customkick', JSON.stringify(list));

        const container = f('#kicklist-items');
        if (!container) {
            console.error('Kick list items container not found!');
            return;
        }
        const item = document.createElement('div');
        item.className = 'player-item';
        item.innerHTML = `
            <span class="player-name">${user}</span>
            <button class="kick-btn" id="customkickuser.${user}">Kaldır</button>
        `;
        container.appendChild(item);

        item.querySelector(`#customkickuser\\.${user}`).addEventListener('click', () => {
            window.postMessage(`customkickremove.${user}`, '*');
        });

        input.value = '';
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `${user} eklendi!`,
            showConfirmButton: false,
            timer: 2000
        });

        addItem(customkickitems, user);
    }

    function addMessageJoin() {
        console.log('addMessageJoin called');
        const input = f('#messagejoin');
        if (!input) {
            console.error('Message join input not found!');
            return;
        }
        const msg = input.value.trim();

        if (!msg) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: 'Lütfen bir mesaj girin.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        let list = [];
        try {
            const storedList = localStorage.getItem('messagejoin');
            if (storedList) {
                list = JSON.parse(storedList);
            }
        } catch (e) {
            console.error('localStorage parse hatası:', e);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Veri okuma hatası!',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        list.push({ msg });
        localStorage.setItem('messagejoin', JSON.stringify(list));

        const container = f('#joinmessage-items');
        if (!container) {
            console.error('Join message items container not found!');
            return;
        }
        const item = document.createElement('div');
        item.className = 'player-item';
        item.innerHTML = `
            <span class="player-name">${msg}</span>
            <button class="kick-btn" id="msgjoin.${msg}">Kaldır</button>
        `;
        container.appendChild(item);

        item.querySelector(`#msgjoin\\.${msg}`).addEventListener('click', () => {
            window.postMessage(`messagejoinremove.${msg}`, '*');
        });

        input.value = '';
        addItem(messagejoinitems, msg);

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Mesaj eklendi!',
            showConfirmButton: false,
            timer: 2000
        });
    }

    const addItem = (arr, ...args) => { for (let i = 0; i < args.length; i++) { arr[arr.length] = args[i]; } return arr; };
    function arrayFilter(array) { return array.filter((value, index, arr) => arr.indexOf(value) === index); }
    function fnFILTER(arr) {
        let r = [], n = [];
        arr.forEach(obj => {
            const nick = obj.nick;
            if (!n.includes(nick)) {
                n.push(nick);
                r.push(obj);
            }
        });
        return r;
    }

    document.addEventListener("click", function(event) {
        let target = event.target;
        if (target.classList.contains("avatar")) {
            let computedStyle = window.getComputedStyle(target);
            let backgroundImage = computedStyle.backgroundImage;
            if (backgroundImage.includes("url")) {
                let avatarUrl = backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                window.open(avatarUrl, "_blank");
            }
        }
    });

    if (window.location.href.indexOf("gartic.io") != -1) {
        let room, kicknewstat = false, kickjoinstat = false, autoreport = false, autoskip = false,
            antiafk = false, antikick = false, antikickDelay = 1, autokick = false, autoguess = 0,
            autofarm = false, waitforkick = 0;

        GM_setValue("botekle", rand());
        GM_addValueChangeListener("resetcount", function(I, C, E, b) {
            GM_setValue("botekle", rand());
        });
        setTimeout(() => { waitforkick = 0; }, 1000);

        GM_onMessage("reconnect", (_, __) => {
            const storedArray = JSON.parse(localStorage.getItem('ws-reconnect-data')) || [];
            storedArray.forEach(obj => {
                let rws = new WebSocket("wss://" + obj.server + ".gartic.io/socket.io/?c=" + obj.code + "&EIO=3&transport=websocket");
                rws.onopen = () => {
                    rws.send('42[7,"' + obj.room + '",' + obj.timestamp + ']');
                    GM_onMessage("cmd", (cmd, x) => {
                        switch (cmd) {
                            case "broadcast":
                                rws.send('42[11,' + obj.timestamp + ',"' + x + '"]');
                                rws.send('42[13,' + obj.timestamp + ',"' + x + '"]');
                                break;
                            case "msg":
                                rws.send('42[11,' + obj.timestamp + ',"' + x + '"]');
                                break;
                            case "answer":
                                rws.send('42[13,' + obj.timestamp + ',"' + x + '"]');
                                break;
                            case "report":
                                rws.send('42[35,' + obj.timestamp + ']');
                                break;
                            case "jump":
                                rws.send('42[25,' + obj.timestamp + ']');
                                break;
                            case "accept1":
                                rws.send('42[34,' + obj.timestamp + ']');
                                break;
                            case "accept2":
                                rws.send('42[34,' + obj.timestamp + ',1]');
                                break;
                            case "tips":
                                rws.send('42[30,' + obj.timestamp + ',1]');
                                break;
                            case "exit":
                                rws.send('42[24,' + obj.timestamp + ']');
                                break;
                            case "kick":
                                if (!botsidvalue.includes(x.split("..")[0])) {
                                    rws.send('42[45,' + obj.timestamp + ',["' + x.split("..")[0] + '",true]]');
                                }
                                break;
                        }
                    });
                };
            });
        });

        GM_onMessage("join", (room, nick, avatar, botnick, kickonjoin, _) => {
            fetch("/logout").then(response => {
                console.log('Logout response:', response);
                return fetch("https://" + window.location.href.split("/")[2] + "/server?check=1&v3=1&room=" + room + "&__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8#");
            }).then(response => response.text()).then(x => {
                console.log('Server response:', x);
                let ws = new WebSocket("wss://" + window.location.href.split("/")[2] + "/__cpw.php?u=" + btoa("wss://" + x.split("https://")[1].split(".")[0] + ".gartic.io/socket.io/?c=" + x.split("?c=")[1] + "&EIO=3&transport=websocket") + "&o=aHR0cHM6Ly9nYXJ0aWMuaW8=");
                ws.onopen = () => {
                    let inter = setInterval(() => {
                        GM_setValue("ready", rand());
                        if (tojoin == 1) {
                            tojoin = 0;
                            if (botnick === '0') {
                                ws.send('42[3,{"v":20000,"nick":"' + rnext(nick) + '","avatar":' + avatar + ',"platform":0,"sala":"' + room.substring(2) + '"}]');
                            } else if (botnick === '1') {
                                ws.send('42[3,{"v":20000,"nick":"' + nick + Math.ceil(Math.random() * 10000 + 1) + '","avatar":' + avatar + ',"platform":0,"sala":"' + room.substring(2) + '"}]');
                            }
                            clearInterval(inter);
                        }
                    }, 50);
                };
                ws.onclose = () => {
                    wss = wss.filter(w => w.ws !== ws);
                };
                ws.onmessage = (msg) => {
                    if (msg.data.indexOf('42["23"') != -1) {
                        let user = JSON.parse("{" + msg.data.split("{")[1].split("}")[0] + "}");
                        usersinroom.push(user);
                        if (kicknewstat) {
                            typeof(user.id) == "string" ? ws.send('42[45,' + ws.id + ',["' + user.id + '",true]]') : ws.send('42[45,' + ws.id + ',[' + user.id + ',true]]');
                        }
                    }
                    if (msg.data.indexOf('42["5"') != -1) {
                        let objlist = JSON.parse('["5"' + msg.data.split('42["5"')[1]);
                        ws.theme = objlist[4].tema;
                        ws.room = objlist[4].codigo;
                        ws.id = objlist[2];
                        objlist[5].forEach(item => { usersinroom.push(item); });
                        let targetid = objlist[5][0].id;
                        botID = objlist[2];
                        const storedArray = JSON.parse(localStorage.getItem('ws-reconnect-data')) || [];
                        const newData = { code: x.split("?c=")[1], room: objlist[3], server: x.split("https://")[1].split(".")[0], timestamp: objlist[2] };
                        storedArray.push(newData);
                        localStorage.setItem('ws-reconnect-data', JSON.stringify(storedArray));
                        botlongID = objlist[1];
                        theme = objlist[4].tema;
                        setTimeout(() => { f(".roomtheme").innerHTML = theme; }, 10);
                        setTimeout(() => { GM_sendMessage("botsidvalue", botlongID, rand()); }, 777);
                        setTimeout(() => { GM_sendMessage("updatelist", botID, rand()); }, 777);
                        setTimeout(() => { antikickDelay = 0; }, 2000);
                        kickjoinstat ? typeof(targetid) == "string" ? ws.send('42[45,' + ws.id + ',["' + targetid + '",true]]') : ws.send('42[45,' + ws.id + ',[' + targetid + ',true]]') : 0;
                        ws.send('42[46,' + objlist[2] + ']');
                        GM_onMessage('answerinput', (atılacak, _) => { f('#answer').value = atılacak; });
                        GM_onMessage("botsidvalue", (datachangex, _) => { botsidvalue.push(datachangex); });
                        GM_onMessage("updatelist", (datachangex, _) => { GM_sendMessage("updatebotidlist", botsidvalue, rand()); });
                        GM_onMessage("updatebotidlist", (datachangex, _) => {
                            if (!botsidvalue.includes(datachangex)) {
                                addItem(botsidvalue, ...datachangex);
                            }
                            botsidvalue = arrayFilter(botsidvalue);
                        });
                        GM_addValueChangeListener("broadcast", function(I, C, E, b) {
                            ws.send('42[11,' + objlist[2] + ',"' + E.split("►")[0] + '"]');
                            ws.send('42[13,' + objlist[2] + ',"' + E.split("►")[0] + '"]');
                        });
                        GM_addValueChangeListener("msg", function(I, C, E, b) {
                            ws.send('42[11,' + objlist[2] + ',"' + E.split("►")[0] + '"]');
                        });
                        GM_addValueChangeListener("answer", function(I, C, E, b) {
                            ws.send('42[13,' + objlist[2] + ',"' + E.split("►")[0] + '"]');
                        });
                        GM_addValueChangeListener("report", function(I, C, E, b) {
                            ws.send('42[35,' + objlist[2] + ']');
                        });
                        GM_addValueChangeListener("jump", function(I, C, E, b) {
                            ws.send('42[25,' + objlist[2] + ']');
                        });
                        GM_onMessage("draw", (_, __) => {
                            function calcPixel(x, y, larguraImagem, alturaImagem) {
                                const re = (y * larguraImagem + x) * 4;
                                return { re: re, x: x, y: y };
                            }
                            function pixelsend(inicioX, inicioY, larguraG, alturaG) {
                                const larguraImagem = 767;
                                const alturaImagem = 448;
                                let re = 0;
                                function enviarProximoPixel() {
                                    const x = inicioX + re % larguraG;
                                    const y = inicioY + Math.floor(re / larguraG);
                                    if (y < inicioY + alturaG) {
                                        const pixel = calcPixel(x, y, larguraImagem, alturaImagem);
                                        ws.send('42[10,' + ws.id + ',[2,' + pixel.x + ',' + pixel.y + ']]');
                                        re++;
                                        setTimeout(enviarProximoPixel, 250);
                                    }
                                }
                                enviarProximoPixel();
                            }
                            function pixels() {
                                const larguraImagem = 767;
                                const alturaImagem = 448;
                                const larguraG = 10;
                                const alturaG = 10;
                                const intervaloEnvio = 50;
                                let y = 0;
                                let gVAL = setInterval(function() {
                                    pixelsend(0, y, larguraG, alturaG);
                                    y += alturaG;
                                    if (y >= alturaImagem) {
                                        clearInterval(gVAL);
                                    }
                                }, intervaloEnvio);
                            }
                            async function pixelEx() {
                                try {
                                    const items = await navigator.clipboard.read();
                                    const item = items[items.length - 1];
                                    if (item.types.includes("image/png") || item.types.includes("image/jpeg")) {
                                        const blob = await item.getType("image/png" || "image/jpeg");
                                        await createImageBitmap(blob);
                                    }
                                } catch (e) {
                                    console.log("Pano okuma hatası:", e);
                                }
                            }
                            pixelEx();
                        });
                        GM_addValueChangeListener("acceptdraw1", function(I, C, E, b) {
                            ws.send('42[34,' + objlist[2] + ']');
                        });
                        GM_addValueChangeListener("acceptdraw2", function(I, C, E, b) {
                            ws.send('42[34,' + objlist[2] + ',1]');
                        });
                        GM_addValueChangeListener("tips", function(I, C, E, b) {
                            ws.send('42[30,' + objlist[2] + ',1]');
                        });
                        GM_addValueChangeListener("exit", function(I, C, E, b) {
                            ws.send('42[24,' + objlist[2] + ']');
                            wss.length = 0;
                            usersinroom.length = 0;
                        });
                        GM_addValueChangeListener("kick", function(I, C, E, b) {
                            if (!botsidvalue.includes(E.split("..")[0])) {
                                ws.send('42[45,' + objlist[2] + ',["' + E.split("..")[0] + '",true]]');
                            }
                        });
                        JSON.stringify(wss).indexOf(objlist[2]) == -1 ? wss.push({ "ws": ws, "id": objlist[2], "lengthID": objlist[1] }) : 0;
                        let interval = setInterval(() => {
                            ws.readyState == 1 ? ws.send('2') : clearInterval(interval);
                        }, 20000);
                    }
                    if (antiafk === true) {
                        intervalantiafk = setInterval(() => {
                            ws.send('42[42,' + ws.id + ']');
                        }, 20000);
                    } else if (antiafk === false) {
                        clearInterval(intervalantiafk);
                        intervalantiafk = null;
                    }
                    if (msg.data.indexOf('42["47"]') != -1 && autoguess == 1) {
                        let inter = parseInt(localStorage.getItem("autoguess")) || 1000;
                        function wordsArray(arr) {
                            let index = 0;
                            if (wordsInterval) {
                                clearInterval(wordsInterval);
                            }
                            wordsInterval = setInterval(() => {
                                if (index < arr.length) {
                                    ws.send('42[13,' + ws.id + ',"' + arr[index] + '"]');
                                    index++;
                                } else {
                                    clearInterval(wordsInterval);
                                }
                            }, inter);
                        }
                        // Kelime listesi gerekirse buraya eklenebilir
                    }
                    if (msg.data.indexOf('42["16"') != -1 && autoskip === true) {
                        setTimeout(() => {
                            ws.send('42[25,' + ws.id + ']');
                        }, 1000);
                    }
                    if (msg.data.indexOf('42["47"]') != -1 && autoreport === true) {
                        ws.send('42[35,' + ws.id + ']');
                    }
                    if (msg.data.indexOf('42["34"') != -1) {
                        let objlist = JSON.parse('["34"' + msg.data.split('42["34"')[1]);
                        var cdd = objlist[1];
                        GM_sendMessage('answerinput', cdd, rand());
                        if (autofarm === true) {
                            setTimeout(() => {
                                GM_setValue("answer", cdd + "►" + num(5000));
                            }, 200);
                        }
                    }
                    if (msg.data.indexOf('42["26"') != -1 && autoguess == 1) {
                        let objlist = JSON.parse('["26"' + msg.data.split('42["26"')[1]);
                        let correct = objlist[1];
                        GM_setValue("answer", correct + "►" + num(5000));
                    }
                    if (msg.data.indexOf('42["16"') != -1 && autofarm === true) {
                        ws.send('42[34,' + ws.id + ']');
                    }
                    if (msg.data.indexOf('42["45"') != -1 && (msg.data.indexOf('"' + botlongID + '",1') != -1 || msg.data.indexOf('' + botlongID + ',1') != -1) && antikickDelay === 0 && antikick === true) {
                        ws.send('42[24,' + ws.id + ']');
                        antikickDelay = 1;
                        window.postMessage('rejoin', '*');
                    }
                    if (msg.data.indexOf('42["45"') != -1 && (msg.data.indexOf('"' + botlongID + '",1') != -1 || msg.data.indexOf('' + botlongID + ',1') != -1) && autokick === true) {
                        let msgautokick = msg.data.split(',');
                        let autokickid = msgautokick[1].replace(/"/g, '');
                        GM_setValue("kick", autokickid + ".." + num(10000));
                    }
                };
            }).catch(error => {
                console.error('Fetch error:', error);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'Sunucu bağlantı hatası!',
                    showConfirmButton: false,
                    timer: 3000
                });
            });
            GM_addValueChangeListener("join", function(I, C, E, b) { tojoin = 1; });
            GM_addValueChangeListener("kicknewset", function(I, C, E, b) { kicknewstat = E; });
            GM_addValueChangeListener("kickjoinset", function(I, C, E, b) { kickjoinstat = E; });
            GM_addValueChangeListener("autoreport", function(I, C, E, b) { autoreport = E; });
            GM_addValueChangeListener("autoskip", function(I, C, E, b) { autoskip = E; });
            GM_addValueChangeListener("antikick", function(I, C, E, b) { antikick = E; });
            GM_addValueChangeListener("autokick", function(I, C, E, b) { autokick = E; });
            GM_addValueChangeListener("antiafk", function(I, C, E, b) { antiafk = E; });
            GM_addValueChangeListener("autoguess", function(I, C, E, b) { autoguess = E; });
            GM_addValueChangeListener("autofarm", function(I, C, E, b) { autofarm = E; });
            window.addEventListener("beforeunload", () => {
                GM_setValue("botçıkar", window.location.href.split("/")[2] + "--" + rand());
            });
        });

        GM_onMessage("rejoin", (_, __) => {
            handleJoin();
        });

        function initializePanel() {
            if (!f(".userlist")) {
                console.log('Injecting panel HTML...');
                document.body.insertAdjacentHTML('beforeend', html);
                setCSS();

                // Menü butonları için olay dinleyicileri
                const menus = {
                    'menu1': 'icebot1',
                    'menu2': 'icebot2',
                    'menu3': 'icebot3',
                    'menu4': 'icebot4',
                    'menu5': 'icebot5',
                    'menu6': 'icebot6'
                };
                Object.keys(menus).forEach(menu => {
                    const btn = f(`.menu${menu.slice(-1)}`);
                    if (btn) {
                        btn.addEventListener('click', () => setmenu(menus[menu]));
                    }
                });

                // Katıl butonuna olay dinleyicisi
                const joinButton = f('#icebot1 input[type="submit"]');
                if (joinButton) {
                    joinButton.addEventListener('click', () => {
                        console.log('Join button clicked!');
                        handleJoin();
                    });
                }
            }
        }

        setInterval(() => {
            if (f("#users")) {
                fa(".kickmenubtn").forEach(ele => {
                    f(".scrollElements").innerText.indexOf(ele.value) == -1 ? ele.remove() : 0;
                });
                f("g") ? f("g").remove() : 0;
            }
            if (f("input[name=chat]")) {
                f(".contentPopup") && f(".btYellowBig.ic-yes") ? f(".btYellowBig.ic-yes").click() : 0;
                if (f(".contentPopup .nick") && f(".ic-votekick") && otoeven == 0) {
                    otoeven = 1;
                    f(".close").addEventListener("click", () => { otoeven = 0; });
                    f(".ic-ignore").addEventListener("click", () => { otoeven = 0; });
                    f(".ic-votekick").addEventListener("click", () => {
                        otoeven = 0;
                        GM_setValue("kick", f(".contentPopup .nick").innerText + ".." + num(10000));
                    });
                }
            }
            f("input[name=chat]") ? f("input[name=chat]").setAttribute("placeholder", +botc + " bot aktif") : 0;
            f(".taktifbot") ? f(".taktifbot").innerText = botc : 0;
            initializePanel();
            ['autoreport', 'autoskip', 'antikick', 'autokick', 'antiafk', 'autofarm', 'autoguess'].forEach(id => {
                const el = f(`#${id}`);
                if (el && !el.hasListener) {
                    el.addEventListener('click', () => {
                        GM_setValue(id, el.checked);
                    });
                    el.hasListener = true;
                }
            });
        }, 100);

        GM_addValueChangeListener("botekle", function(I, C, E, b) {
            botc++;
            f(".taktifbot") ? f(".taktifbot").innerText = botc : 0;
            f("#icebotlog").innerText = `Durum: ${botc} bot aktif`;
        });

        GM_addValueChangeListener("ready", function(I, C, E, b) {
            readyc++;
            readyc >= botc && botc != 0 ? GM_setValue("join", rand()) : 0;
        });

        GM_addValueChangeListener("botexit", function(I, C, E, b) {
            botc--;
            f(".taktifbot") ? f(".taktifbot").innerText = botc : 0;
            f("#icebotlog").innerText = `Durum: ${botc} bot aktif`;
        });

        let customkick = localStorage.getItem("customkick");
        if (!customkick) {
            localStorage.setItem("customkick", "[]");
        }
        if (customkick) {
            let list = [];
            try {
                list = JSON.parse(customkick);
            } catch (e) {
                console.error('customkick parse hatası:', e);
            }
            list.forEach(user => {
                setTimeout(() => {
                    const container = f("#kicklist-items");
                    if (!container) return;
                    const item = document.createElement('div');
                    item.className = 'player-item';
                    item.innerHTML = `
                        <span class="player-name">${user.user}</span>
                        <button class="kick-btn" id="customkickuser.${user.user}">Kaldır</button>
                    `;
                    container.appendChild(item);
                    item.querySelector(`#customkickuser\\.${user.user}`).addEventListener('click', () => {
                        window.postMessage(`customkickremove.${user.user}`, '*');
                    });
                    addItem(customkickitems, user.user);
                }, 3000);
            });
        }

        let msgjoin = localStorage.getItem("messagejoin");
        if (!msgjoin) {
            localStorage.setItem("messagejoin", "[]");
        }
        if (msgjoin) {
            let list = [];
            try {
                list = JSON.parse(msgjoin);
            } catch (e) {
                console.error('messagejoin parse hatası:', e);
            }
            list.forEach(item => {
                setTimeout(() => {
                    const container = f("#joinmessage-items");
                    if (!container) return;
                    const item = document.createElement('div');
                    item.className = 'player-item';
                    item.innerHTML = `
                        <span class="player-name">${item.msg}</span>
                        <button class="kick-btn" id="msgjoin.${item.msg}">Kaldır</button>
                    `;
                    container.appendChild(item);
                    item.querySelector(`#msgjoin\\.${item.msg}`).addEventListener('click', () => {
                        window.postMessage(`messagejoinremove.${item.msg}`, '*');
                    });
                    addItem(messagejoinitems, item.msg);
                }, 3000);
            });
        }

        let avataritem = localStorage.getItem("avatar");
        if (!avataritem) {
            localStorage.setItem("avatar", 1);
            avatar = 1;
        }
        if (avataritem == 'null') {
            setTimeout(() => {
                f("#avatar").src = "https://garticphone.com/images/avatar/31.svg";
            }, 1000);
        }

        let botnickitem = localStorage.getItem("botnick");
        if (!botnickitem) {
            localStorage.setItem("botnick", "0");
        }

        let nickitem = localStorage.getItem("nick");
        if (!nickitem) {
            localStorage.setItem("nick", "ICEbot");
        }
    }

    if (window.location.href.indexOf("onrender") != -1) {
        let originalSend = WebSocket.prototype.send, setTrue = false;
        window.wsObj = {};
        WebSocket.prototype.send = function(data) {
            originalSend.apply(this, arguments);
            if (Object.keys(window.wsObj).length == 0) {
                window.wsObj = this;
                window.eventAdd();
            }
        };
        window.eventAdd = () => {
            if (!setTrue) {
                setTrue = 1;
                setTimeout(() => {
                    window.wsObj.send('42["joinRoom",{"username":"User' + Math.ceil(Math.random() * 100000 + 1) + '","room":"ICEv0009"}]');
                }, 3000);
                window.wsObj.addEventListener("message", (msg) => {
                    let vx = JSON.parse('[' + msg.data.split('42[')[1]);
                    if (msg.data.indexOf('42["chatMessage"') !== -1 && vx[1].type !== 'bot') {
                        GM_sendMessage("msge", vx[1].user, vx[1].chatMessage, num(5000));
                    }
                });
            }
        };
        GM_onMessage("msgf", (n, m, _) => {
            let a = new Date();
            let d = a.toISOString();
            window.wsObj.send('42["chatMessage",{"user":"' + n + '","time":"' + d + '","type":"text","chatMessage":"' + m + '"}]');
        });
    }

    window.addEventListener("message", function(event) {
        if (typeof(event.data) === "string") {
            if (event.data == "chat") {
                GM_setValue("msg", f("#message").value + "►" + num(5000));
                GM_sendMessage('cmd', 'msg', f("#message").value, num(5000));
            }
            if (event.data.indexOf("kickuser.") != -1) {
                let userid = event.data.split("kickuser.")[1];
                GM_setValue("kick", userid + ".." + num(10000));
                GM_sendMessage("cmd", 'kick', userid + ".." + num(10000));
            }
            if (event.data.indexOf("kickusernick.") != -1) {
                let usernick = event.data.split("kickusernick.")[1];
                console.log('Kicking user by nick:', usernick);
                let c = fnFILTER(usersinroom);
                console.log('Filtered usersinroom:', c);
                c.forEach(x => {
                    if (x.nick && x.nick === usernick && x.nick !== localStorage.getItem("nick")) {
                        let userid = x.id;
                        console.log(`Found matching user: ${x.nick}, ID: ${userid}`);
                        if (!botsidvalue.includes(userid)) {
                            GM_setValue("kick", userid + ".." + num(5000));
                            GM_sendMessage("cmd", 'kick', userid + ".." + num(10000));
                            Swal.fire({
                                toast: true,
                                position: 'top-end',
                                icon: 'success',
                                title: `${usernick} için kick komutu gönderildi!`,
                                showConfirmButton: false,
                                timer: 2000
                            });
                        } else {
                            console.log(`User ${x.nick} is a bot, skipping kick.`);
                        }
                    } else if (!x.nick) {
                        console.warn(`User object missing nick property:`, x);
                    }
                });
            }
            if (event.data == "broadcast") {
                GM_setValue("broadcast", f("#broadcast").value + "►" + num(5000));
                GM_sendMessage('cmd', 'broadcast', f("#broadcast").value, num(5000));
            }
            if (event.data == "answer") {
                GM_setValue("answer", f("#answer").value + "►" + num(5000));
                GM_sendMessage('cmd', 'answer', f("#answer").value, num(5000));
            }
            if (event.data == "report") {
                GM_setValue('report', num(5000));
                GM_sendMessage('cmd', 'report', 'x', num(5000));
            }
            if (event.data == "jump") {
                GM_setValue('jump', num(5000));
            }
            if (event.data == "reconnect") {
                GM_sendMessage('reconnect', rand(), rand());
            }
            if (event.data == "acceptdraw1") {
                GM_setValue('acceptdraw1', num(5000));
                GM_sendMessage('cmd', 'accept1', 'x', num(5000));
            }
            if (event.data == "acceptdraw2") {
                GM_setValue('acceptdraw2', num(5000));
                GM_sendMessage('cmd', 'accept2', 'x', num(5000));
            }
            if (event.data == "tips") {
                GM_setValue('tips', num(5000));
                GM_sendMessage('cmd', 'tips', 'x', num(5000));
            }
            if (event.data == "exit") {
                GM_setValue('exit', num(5000));
                GM_sendMessage('cmd', 'exit', 'x', num(5000));
            }
            if (event.data == "rejoin") {
                GM_setValue('exit', num(5000));
                let msgstorage = localStorage.getItem("messagejoin");
                if (msgstorage) {
                    let vm = JSON.parse(msgstorage);
                    setTimeout(() => {
                        vm.forEach(item => {
                            GM_setValue("msg", item.msg + "►" + num(5000));
                        });
                    }, 4000);
                }
                GM_sendMessage("join", f("#roomlink").value.split("/")[3], f("#botnick")?.value || nick, avatar, localStorage.getItem("botnick"), f(".kickonjoin")?.checked || false, JSON.parse(localStorage.getItem("messagejoin") || "[]"), rand());
            }
            if (event.data == "kickall") {
                var elements = document.getElementsByClassName("kickmenubtn");
                var elementsvalue = [];
                for (var i = 0; i < elements.length; i++) {
                    elementsvalue.push(elements[i].getAttribute("onclick"));
                }
                elementsvalue.forEach(function(value, index) {
                    setTimeout(function() {
                        let userid = value.split("kickuser.")[1].split("','*")[0];
                        GM_setValue("kick", userid + ".." + num(10000));
                        GM_sendMessage("cmd", 'kick', userid + ".." + num(10000));
                    }, 550 * index);
                });
            }
            if (event.data == "broadcastspamtoggle") {
                let broadcastspamMS = parseInt(localStorage.getItem("broadcastspam")) || 1000;
                var broadcastspam = f("#broadcastspam").value;
                intervalbroadcast = setInterval(() => {
                    GM_setValue("broadcast", broadcastspam + "►" + num(5000));
                }, broadcastspamMS);
                f("#broadcaststart").style.display = "none";
                f("#broadcaststop").style.display = "block";
            }
            if (event.data == "chatspamtoggle") {
                let messagespamMS = parseInt(localStorage.getItem("messagespam")) || 1000;
                var messagespam = f("#messagespam").value;
                intervalmsg = setInterval(() => {
                    var chatspam = f("#messagespam").value;
                    GM_setValue("msg", chatspam + "►" + num(5000));
                }, messagespamMS);
                f("#msgstart").style.display = "none";
                f("#msgstop").style.display = "block";
            }
            if (event.data == "answerspamtoggle") {
                let answerspamMS = parseInt(localStorage.getItem("answerspam")) || 1000;
                var answerspam = f("#answerspam").value;
                intervalanswer = setInterval(() => {
                    var answerspam = f("#answerspam").value;
                    GM_setValue("answer", answerspam + "►" + num(5000));
                }, answerspamMS);
                f("#answerstart").style.display = "none";
                f("#answerstop").style.display = "block";
            }
            if (event.data == "stopbroadcast") {
                clearInterval(intervalbroadcast);
                f("#broadcaststart").style.display = "block";
                f("#broadcaststop").style.display = "none";
            }
            if (event.data == "stopmsg") {
                clearInterval(intervalmsg);
                f("#msgstart").style.display = "block";
                f("#msgstop").style.display = "none";
            }
            if (event.data == "stopanswer") {
                clearInterval(intervalanswer);
                f("#answerstart").style.display = "block";
                f("#answerstop").style.display = "none";
            }
            if (event.data == "autoguess") {
                if (f("#autoguess").checked) {
                    GM_setValue("autoguess", 1);
                } else {
                    GM_setValue("autoguess", 0);
                    clearInterval(wordsInterval);
                }
            }
            if (event.data == "autoguessenable") {
                f("#autoguessenable").style.display = "none";
                f("#autoguessdisable").style.display = "block";
                GM_setValue("autoguess", 1);
            }
            if (event.data == "autoguessdisable") {
                f("#autoguessenable").style.display = "block";
                f("#autoguessdisable").style.display = "none";
                GM_setValue("autoguess", 0);
                clearInterval(wordsInterval);
            }
            if (event.data.indexOf("customkickremove.") != -1) {
                let user = event.data.split("customkickremove.")[1];
                let list = JSON.parse(localStorage.getItem('customkick') || "[]");
                list = list.filter(item => item.user !== user);
                localStorage.setItem('customkick', JSON.stringify(list));
                const item = f(`#customkickuser\\.${user}`)?.parentElement;
                if (item) item.remove();
                customkickitems = customkickitems.filter(item => item !== user);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: `${user} kaldırıldı!`,
                    showConfirmButton: false,
                    timer: 2000
                });
            }
            if (event.data.indexOf("messagejoinremove.") != -1) {
                let msg = event.data.split("messagejoinremove.")[1];
                let list = JSON.parse(localStorage.getItem('messagejoin') || "[]");
                list = list.filter(item => item.msg !== msg);
                localStorage.setItem('messagejoin', JSON.stringify(list));
                const item = f(`#msgjoin\\.${msg}`)?.parentElement;
                if (item) item.remove();
                messagejoinitems = messagejoinitems.filter(item => item !== msg);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Mesaj kaldırıldı!',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
            if (event.data == "hidemenu") {
                const elements = ['icebot1', 'icebot2', 'icebot3', 'icebot4', 'icebot5', 'icebot6', 'avatarlist'];
                elements.forEach(element => {
                    const el = document.getElementById(element);
                    if (el) el.style.display = 'none';
                });
            }
            if (event.data == "theme") {
                const colors = [
                    f("#color1").value,
                    f("#color2").value,
                    f("#color3").value,
                    f("#color4").value
                ];
                GM_addStyle(`
                    .icebot { background: ${colors[0]}; }
                    .icebot input[type="text"], .icebot input[type="color"] { border-color: ${colors[1]}; }
                    .icebot input[type="submit"] { background: ${colors[2]}; }
                    .player-item { background: ${colors[3]}; }
                `);
            }
        }
    });

    function xmv() {
        const userAgent = navigator.userAgent.toLowerCase();
        const dM = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
        for (let d of dM) {
            if (userAgent.includes(d)) {
                let ice = fa(".icebot, .userlist, .option");
                ice.forEach(panel => {
                    panel.style.width = "90%";
                    panel.style.left = "5%";
                    panel.style.right = "5%";
                    panel.style.top = "auto";
                    panel.style.position = "relative";
                    panel.style.margin = "10px auto";
                });
            }
        }
    }
    setTimeout(() => { xmv(); }, 200);

    localStorage.getItem("botc") ? 0 : localStorage.setItem("botc", 0);
    GM_setValue("resetcount", rand());

    setTimeout(() => {
        var iframe = document.createElement("iframe");
        iframe.src = "https://anomly.onrender.com/home";
        iframe.width = "30";
        iframe.height = "30";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
    }, 2000);

    setTimeout(() => {
        localStorage.setItem('TOKEN', btoa(Date.now()));
    }, 500);

    GM_onMessage("msge", (u, m, _) => {
        const log = f("#icebotlog .icebotlog");
        if (log) log.innerHTML += `<div class="player-item"><span class="player-name">${u}: ${m}</span></div>`;
    });
})();