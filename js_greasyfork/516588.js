// ==UserScript==
// @name         A L Z E~WHOWHERE 2.0
// @description  Odalardaki kullanıcıları gösterir (AZE)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @author       A L Z E
// @match        *://gartic.io/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516588/A%20L%20Z%20E~WHOWHERE%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/516588/A%20L%20Z%20E~WHOWHERE%2020.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.addEventListener('load', function() {
        const panel = document.createElement('div');
        panel.classList.add('responsive-panel');
        const toggleButton = document.createElement('button');
        toggleButton.innerText = '☰';
        toggleButton.classList.add('toggle-btn');
        toggleButton.onclick = () => {
            panel.classList.toggle('open');
            localStorage.setItem('panelOpen', panel.classList.contains('open'));
        };
        document.body.appendChild(toggleButton);
        document.body.appendChild(panel);
        if(localStorage.getItem('panelOpen') === 'false') {
            panel.classList.remove('open');
        } else {
            panel.classList.add('open');
        }
        const style = document.createElement('style');
        style.textContent = `
.responsive-panel {
    position: fixed;
    top: 5px;
    right: 10px;
    width: 320px;
    max-height: 30vh;
    overflow-y: auto;
    background: #000;
    color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.6);
    padding: 10px;
    display: none;
    flex-direction: column;
    gap: 10px;
    z-index: 9999;
    font-family: Arial, sans-serif;
}
.responsive-panel.open { display: flex; }

.responsive-panel::-webkit-scrollbar {
    width: 8px;
}
.responsive-panel::-webkit-scrollbar-track {
    background: #000;
    border-radius: 10px;
}
.responsive-panel::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 10px;
}
.responsive-panel::-webkit-scrollbar-thumb:hover {
    background: #666;
}

.toggle-btn {
    position: fixed;
    top: 15px;
    right: 15px;
    background: #111;
    color: #fff;
    border: none;
    font-size: 18px;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
    z-index: 10000;
}
.toggle-btn:hover {
    background: #222;
}

.responsive-title {
    font-size: 16px;
    text-align: center;
    margin-bottom: 6px;
}

.room-card {
    background: #111;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #333;
}
.room-card img.room-icon {
    width: 40px;
    height: 40px;
}

.users {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
    justify-content: flex-start;
}
.user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #222;
    padding: 6px;
    border-radius: 6px;
    font-size: 11px;
    width: 60px;
    text-align: center;
    overflow: hidden;
}
.user-info img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-bottom: 4px;
}

.room-card button {
    margin-top: 6px;
    margin-right: 6px;
    padding: 6px 10px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 12px;
}
.room-card button.view { background: #0066ff; color: white; }
.room-card button.join { background: #ff3333; color: white; }
@media (max-width: 768px) {
    .responsive-panel {
        width: 90%;
        right: 5%;
        top: 60px;
        max-height: 50vh;
        font-size: 14px;
    }
    .toggle-btn {
        top: 15px;
        right: 15px;
        font-size: 16px;
        padding: 6px 10px;
    }
}
       `;
        document.head.appendChild(style);
        const alzeTitle = document.createElement('h2');
        alzeTitle.innerText = 'ALZE';
        alzeTitle.classList.add('responsive-title');
        panel.appendChild(alzeTitle);
        const title = document.createElement('div');
        title.innerText = 'Çevrimiçi Kullanıcılar';
        title.style.textAlign = 'center';
        title.style.color = 'white';
        panel.appendChild(title);
        const totalCountDisplay = document.createElement('div');
        totalCountDisplay.style.textAlign = 'center';
        totalCountDisplay.style.marginBottom = '10px';
        panel.appendChild(totalCountDisplay);

        const fl = document.createElement('div');
        fl.style.display = 'flex';
        fl.style.flexDirection = 'column';
        fl.style.gap = '10px';
        panel.appendChild(fl);

        let roomIds = [];

        function f(lang) {
            fetch('https://gartic.io/req/list?search=&language[]=' + lang)
                .then(res => res.json())
                .then(data => {
                    const active = data.filter(room => room.quant > 0);
                    if (active.length !== 0) {
                        fl.innerHTML = '';
                        roomIds = [];

                        active.forEach((room) => {
                            roomIds.push(room.id);

                            const flc = document.createElement('div');
                            flc.classList.add('room-card');

                            const roomTag = document.createElement('div');
                            roomTag.textContent = room.id.slice(1);

                            const roomSubjIcon = document.createElement('img');
                            roomSubjIcon.src = `https://gartic.io/static/images/subjects/${room.subject}.svg`;
                            roomSubjIcon.classList.add("room-icon");

                            const inRoomPlayers = document.createElement('div');
                            inRoomPlayers.textContent = `${room.quant} / ${room.max} ・ ${room.points} / ${room.goal}`;

                            const users = document.createElement('div');
                            users.classList.add('users');

                            const viewBtn = document.createElement('button');
                            viewBtn.textContent = 'İzlə';
                            viewBtn.classList.add('view');
                            viewBtn.onclick = () => window.open(`https://gartic.io/${room.code}/viewer`, '_blank');

                            const joinBtn = document.createElement('button');
                            joinBtn.textContent = 'Daxil ol';
                            joinBtn.classList.add('join');
                            joinBtn.onclick = () => window.open(`https://gartic.io/${room.code}`, '_blank');
                            fetch(`https://gartic.io/serverViewer?room=${room.code}`).then(rs => rs.text()).then(dt => {
                                const s = dt.slice(15, 16);
                                const ws = new WebSocket(`wss://server0${s}.gartic.io/socket.io/?EIO=3&transport=websocket`);

                                ws.onopen = () => {
                                    ws.send(`42["12",{"v":20000,"sala":"${room.id}"}]`);
                                };

                                ws.onmessage = (m) => {
                                    try {
                                        const d = JSON.parse(m.data.slice(2));
                                        if (d[0] == 5) {
                                            users.innerHTML = '';
                                            d[5].forEach(u => {
                                                const userB = document.createElement('div');
                                                userB.classList.add('user-info');

                                                const userPp = document.createElement('img');
                                                userPp.src = u.foto ? u.foto : 'https://gartic.io/static/images/avatar/svg/0.svg';

                                                const userName = document.createElement('span');
                                                userName.textContent = u.nick;

                                                userB.append(userPp, userName);
                                                users.appendChild(userB);
                                            });
                                        }
                                    } catch (err) {
                                        console.error("Kullanıcılar alınırken hata oluştu: ", err);
                                    }
                                };
                            });

                            flc.append(roomTag, roomSubjIcon, inRoomPlayers, users, viewBtn, joinBtn);
                            fl.appendChild(flc);
                        });

                        totalCountDisplay.textContent = `Toplam Oda: ${active.length}, Toplam Kullanıcı: ${active.reduce((acc, curr) => acc + curr.quant, 0)}`;
                    } else {
                        fl.innerHTML = '<h4>Seçilən dildə oda yok.</h4>';
                        totalCountDisplay.textContent = '';
                    }
                });
        }

        f('23');
    });
})();
