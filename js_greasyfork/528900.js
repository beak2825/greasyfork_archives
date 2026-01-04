// ==UserScript==
// @name         RED HEAD MOD
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Gartic.io için mod menü
// @author       Ryzex
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528900/RED%20HEAD%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/528900/RED%20HEAD%20MOD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
        @keyframes glow {
            0% { box-shadow: 0 0 50px purple; }
            50% { box-shadow: 0 0 80px violet; }
            100% { box-shadow: 0 0 50px purple; }
        }

        @keyframes glowEffect {
            0% { box-shadow: 0 0 5px red; }
            100% { box-shadow: 0 0 15px red; }
        }

        button:hover {
            background-color: gold !important;
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(styleTag);
    var style = document.createElement('style');
    style.innerHTML = `
        /* Sohbette kendi kullanıcı adını kırmızı ve küçük yap */
        .msg.you strong {
            color: red !important;
            font-size: 12px !important; /* Yazı boyutunu küçült */
        }

        /* Kullanıcı listesindeki kendi adını kırmızı yap */
        .player.you .name {
            color: red !important;
        }
    `;
    document.head.appendChild(style);

    
    const menuStyle = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: black;
        padding: 15px;
        border-radius: 10px;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 16px;
        z-index: 9999;
        display: none; /* Başlangıçta menü gizli */
        width: 320px;
        height: auto;
        transition: all 0.5s ease;
        box-shadow: 0 0 10px purple;
        animation: glow 1.5s infinite alternate;
    `;
         
    const discordIconStyle = `
        position: absolute;
        top: 10px;
        left: 10px;
        width: 40px;
        height: 40px;
        cursor: pointer;
        transition: 0.3s;
    `;
    
    
    const buttonStyle = `
        background-color: yellow;
        border: none;
        color: black;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 14px;
        margin: 5px;
        cursor: pointer;
        border-radius: 5px;
        font-weight: bold;
        transition: 0.3s;
    `;

    // Açma/kapama butonu
    const toggleMenuButtonStyle = `
        position: fixed;
        top: 20px;
        left: 20px;
        background-image:url('https://hizliresim.com/b2hls04');
        color: white;
        padding: 10px;
        cursor: pointer;
        font-size: 16px;
        border-radius: 5px;
        z-index: 9999;
        font-family: monospace;
        border: 2px solid black;
        transition: 0.3s;
    `;

    // Menü HTML yapısı
    const menuHTML = `
        <div id="modMenu" style="${menuStyle}">
            <!-- Discord Simgesi -->
            <img id="discordIcon" src="https://upload.wikimedia.org/wikipedia/en/9/98/Discord_logo.svg" style="${discordIconStyle}" alt="Discord">
            
            <div style="text-align: center; color: blue; font-size: 20px; margin-bottom: 10px;">RED HEAD</div>
            <div>
                <label>OTO HG AÇ / KAPA:</label>
                <button id="otoHG" style="${buttonStyle}">AÇ</button>
            </div>
            <div>
                <label>GÜLE GÜLE AÇ / KAPA:</label>
                <button id="guleGule" style="${buttonStyle}">AÇ</button>
            </div>
            <div>
                <label>OTO KİCK AÇ / KAPA:</label>
                <button id="otoKick" style="${buttonStyle}">AÇ</button>
            </div>
            <div>
                <label>CEVAP CHAT AÇ / KAPA:</label>
                <button id="cevapChat" style="${buttonStyle}">AÇ</button>
            </div>
            <div>
                <label>PAPAĞAN AÇ / KAPA:</label>
                <button id="papagan" style="${buttonStyle}">AÇ</button>
            </div>
        </div>
        <button id="toggleMenuButton" style="${toggleMenuButtonStyle}">/&#62;&#47;</button>
        <div id="statusMessage" style="position: fixed; top: 50px; left: 50%; transform: translateX(-50%); background-color: black; color: white; padding: 10px 20px; border-radius: 5px; display: none; font-size: 16px; z-index: 9999;"></div>
    `;

   
    document.body.insertAdjacentHTML('beforeend', menuHTML);

   
    let menuVisible = false;
    document.getElementById('toggleMenuButton').addEventListener('click', function() {
        const modMenu = document.getElementById('modMenu');
        menuVisible = !menuVisible;

        if (menuVisible) {
            modMenu.style.display = 'block'; 
            showMessage("Menü Açıldı");
        } else {
            modMenu.style.display = 'none'; 
            showMessage("Menü Kapandı");
        }
    });
        
    document.getElementById('discordIcon').addEventListener('click', function() {
        window.open("https://discord.gg/rp2vRwWTmJ", "_blank");
    });
       
    function addGlowingBorder() {
        let myAvatar = document.querySelector('.you .avatar');
        if (myAvatar) {
            myAvatar.style.border = "2px solid red";
            myAvatar.style.animation = "glowEffect 1.5s infinite alternate";

            let style = document.createElement('style');
            style.innerHTML = `
                @keyframes glowEffect {
                    0% { box-shadow: 0 0 5px red; }
                    100% { box-shadow: 0 0 15px red; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setInterval(addGlowingBorder, 1000);
    function otomatikCizimButonu() {
        let cizimButon = document.querySelector(".btYellowBig.ic-drawG");
        if (cizimButon) {
            cizimButon.click();
            console.log("Çizim butonuna tıklandı!");
        }
    }

    
    function otomatikSkipButonu() {
        let skipButon = document.querySelector(".skip"); 
        if (skipButon) {
            skipButon.click();
            console.log("Skip butonuna tıklandı!");
        }
    }

    
    setInterval(() => {
        otomatikCizimButonu();
        otomatikSkipButonu();  
    }, 1000); 


    
    let otoHGActive = false;
    document.getElementById('otoHG').addEventListener('click', function() {
        if (otoHGActive) {
            otoHGActive = false;
            showMessage("OTO HG Özelliği KAPANDI.");
        } else {
            otoHGActive = true;
            showMessage("OTO HG Özelliği AÇILDI.");
            startAutoWelcome();
        }
    });

 
    function startAutoWelcome() {
        let interval = setInterval(function() {
            if (!otoHGActive) {
                clearInterval(interval); 
                return;
            }

            let nickin = document.getElementsByClassName("user you")[0].querySelectorAll(".nick")[0].innerText;
            let msgSystem = document.querySelectorAll(".msg.system");
            let msg = document.querySelectorAll(".msg");
            if (msgSystem.length === 0 || msg.length === 0) return;
            let lastMsgSystem = msgSystem[msgSystem.length - 1].innerText;
            let lastMsg = msg[msg.length - 1].innerText;
            if (lastMsgSystem.includes("katıldı")) {
                if (lastMsg == lastMsgSystem) {
                    if (!lastMsgSystem.includes(nickin)) {
                        lastMsgSystem = lastMsgSystem.replace("katıldı", "hg");
                        let words = lastMsgSystem.split(" ");
                        let hgWord = words.pop();
                        words.unshift(hgWord);
                        let welcomeMessage = words.join(" ");
                        chatsend(welcomeMessage);
                    }
                }
            }
        }, 1000); 
    }

    let guleGuleActive = false;
    document.getElementById('guleGule').addEventListener('click', function() {
        if (guleGuleActive) {
            guleGuleActive = false;
            showMessage("GÜLE GÜLE Özelliği KAPANDI.");
        } else {
            guleGuleActive = true;
            showMessage("GÜLE GÜLE Özelliği AÇILDI.");
            startGoodbyeMessage();
        }
    });

    function startGoodbyeMessage() {
        setInterval(function() {
            let nickin = document.getElementsByClassName("user you")[0].querySelectorAll(".nick")[0].innerText;
            let msgSystem = document.querySelectorAll(".msg.system");
            let msg = document.querySelectorAll(".msg");
            if (msgSystem.length === 0 || msg.length === 0) return;
            let lastMsgSystem = msgSystem[msgSystem.length - 1].innerText;
            let lastMsg = msg[msg.length - 1].innerText;
            if (lastMsgSystem.includes("ayrıldı")) {
                if (lastMsg == lastMsgSystem) {
                    if (!lastMsgSystem.includes(nickin)) {
                        lastMsgSystem = lastMsgSystem.replace("ayrıldı", "Güle-Güle");
                        let words = lastMsgSystem.split(" ");
                        let hgWord = words.pop();
                        words.unshift(hgWord);
                        let goodbyeMessage = words.join(" ");
                        chatsend(goodbyeMessage);
                    }
                }
            }
        }, 1000); 
    }

    let papaganActive = false;
    document.getElementById('papagan').addEventListener('click', function() {
        if (papaganActive) {
            papaganActive = false;
            showMessage("PAPAĞAN Özelliği KAPANDI.");
            chatsend("PAPAĞAN Özelliği KAPANDI."); // Chat'e yazdır
        } else {
            papaganActive = true;
            showMessage("PAPAĞAN Özelliği AÇILDI.");
            startPapagan();
        }
    });

    function startPapagan() {
        setInterval(function() {
            let userMessages = document.querySelectorAll(".msg.you span");
            let allMessages = document.querySelectorAll(".msg span");

            if (allMessages.length > 0) {
                let lastMessage = allMessages[allMessages.length - 1].innerText;
                let lastUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1].innerText : "";

                if (lastMessage !== lastUserMessage) {
                    chatsend(lastMessage);
                }
            }
        }, 150); 
    }

    let otoKickActive = false;
    document.getElementById('otoKick').addEventListener('click', function () {
        if (otoKickActive) {
            otoKickActive = false;
            showMessage("Oto Kick Özelliği KAPANDI.");
        } else {
            otoKickActive = true;
            showMessage("Oto Kick Özelliği AÇILDI.");
            startOtoKick();
        }
    });

    function startOtoKick() {
        setInterval(function() {
            let nickin = document.querySelector(".user.you").querySelector(".nick").innerText;
            let kickMsg = document.querySelectorAll(".msg.alert");
            if (kickMsg.length === 0) return;
            let lastKickMsg = kickMsg[kickMsg.length - 1].innerText;
            if (lastKickMsg.includes(", " + nickin)) {
                let kicker = lastKickMsg.split(",")[0];
                let nicks = document.querySelectorAll(".nick");
                for (let i = 0; i < nicks.length; i++) {
                    if (nicks[i].innerText == kicker) {
                        nicks[i].click();
                        document.querySelector(".ic-votekick").click();
                    }
                }
            }
        }, 1000); 
    }

    let cevapChatActive = false;
    document.getElementById('cevapChat').addEventListener('click', function () {
        if (cevapChatActive) {
            cevapChatActive = false;
            showMessage("CEVAP CHAT Özelliği KAPANDI.");
        } else {
            cevapChatActive = true;
            showMessage("CEVAP CHAT Özelliği AÇILDI.");
            startCevapChat();
        }
    });

    function startCevapChat() {
        let processedWord = "";
        let answer = "";

        let interval = setInterval(() => {
            if (!cevapChatActive) {
                clearInterval(interval);
                return;
            }

            let msgHit = document.querySelectorAll(".msg.hit");
            if (msgHit.length < 1) return;
            let lastMsgHit = msgHit[msgHit.length - 1].innerText;
            if (lastMsgHit.includes("buldun:")) {
                let newWord = lastMsgHit.replace("Cevabı buldun:", "").trim();
                if (newWord !== processedWord) {
                    processedWord = newWord;
                    answer = newWord.split("").join("\u200C");
                    chatsend("cevap " + answer);
                }
            }
        }, 500);
    }
    
// AFK SC
    setInterval(() => document.querySelector(".ic-yes")?.click(), 500);

    function chatsend(m_q) {
        let a_i = document.querySelector('input[name=chat]');
        let m_a = a_i.value;
        a_i.value = m_q;
        let m_z = new Event("input", { bubbles: true });
        m_z.simulated = true;
        let m_b = new Event("submit", { bubbles: true });
        m_b.simulated = true;
        let m_s = a_i._valueTracker;
        m_s && m_s.setValue(m_a);
        a_i.dispatchEvent(m_z);
        a_i.form.dispatchEvent(m_b);
    }


    function showMessage(message) {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.innerText = message;
        statusMessage.style.backgroundColor = 'black'; ç
        statusMessage.style.color = 'yellow';
        statusMessage.style.display = 'block';

        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 2000);
    }

})();