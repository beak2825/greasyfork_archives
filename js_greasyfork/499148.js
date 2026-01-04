// ==UserScript==
// @name         WHOWHERE V2 GM
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  WhoWhere V2 GM_xmlhttpRequest for Gartic.io
// @author       ᴊᴜsᴛ ᴀʟɪᴋᴏᴏ
// @match        *://gartic.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/499148/WHOWHERE%20V2%20GM.user.js
// @updateURL https://update.greasyfork.org/scripts/499148/WHOWHERE%20V2%20GM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Gartic.io WhoWhere GM hazirdir!');

    // --- UI ELEMENTLERI ---
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const header = document.createElement('header');
    header.innerHTML = '<h2>WhoWhere V2 by ᴊᴜsᴛ ᴀʟɪᴋᴏᴏ</h2>';
    overlay.append(header);

    const p = document.createElement('p');
    p.textContent = 'Hazırki Otağlar';
    overlay.append(p);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Bağla';
    closeButton.style.cssText = 'position: fixed; top: 10px; right: 10px; padding: 5px 10px; background-color: darkred; color: white; border: none; border-radius: 5px; cursor: pointer;';
    overlay.append(closeButton);

    const openButton = document.createElement('button');
    openButton.textContent = 'Aç';
    openButton.style.cssText = 'position: fixed; bottom: 10px; right: 10px; padding: 5px 10px; background-color: darkgreen; color: white; border: none; border-radius: 5px; cursor: pointer; display: none; z-index: 9999;';
    document.body.append(openButton);

    closeButton.onclick = () => {
        overlay.style.display = 'none';
        openButton.style.display = 'block';
    };
    openButton.onclick = () => {
        overlay.style.display = 'block';
        openButton.style.display = 'none';
    };

    const select = document.createElement('select');
    select.id = 'lg';
    select.innerHTML = `
        <option value="23" selected>Azərbaycanca</option>
        <option value="2">English</option>
        <option value="8">Türkçe</option>
        <option value="7">Русский</option>
    `;
    overlay.append(select);

    const flexDiv = document.createElement('div');
    flexDiv.className = 'flex';
    overlay.append(flexDiv);

    const totalCountDisplay = document.createElement('div');
    totalCountDisplay.style.cssText = 'position: fixed; top: 50px; left: 10px; background-color: darkslateblue; color: white; padding: 5px 10px; border-radius: 5px; z-index: 9999;';
    document.body.append(totalCountDisplay);

    document.body.prepend(overlay);

    // --- STIL ---
    const style = document.createElement('style');
    style.textContent = `
        .overlay { position: fixed; top:0; left:0; width:100%; height:100%; background-color:gray; color:#f0f0f0; z-index:9999; overflow-y:auto; text-align:center; padding:20px; }
        .flex { display:flex; justify-content:center; flex-wrap:wrap; gap:8px; margin-top:1rem; }
        .flex-child { background-color:darkgray; padding:8px 12px; min-width:150px; border-radius:30px; }
        .flex-child img { width:25px; height:25px; border-radius:50%; border:1px solid #666; }
        .users .user-info { display:flex; align-items:center; margin-bottom:4px; }
        .users .user-info p { margin-left:4px; font-size:12px; overflow-wrap:anywhere; }
        select { font-size:16px; padding:5px; border-radius:30px; background-color:darkslateblue; color:white; }
    `;
    document.head.append(style);

    // --- FUNKSIYA ---
    let roomIds = [];

    function f(lang) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://gartic.io/req/list?search=&language[]=${lang}`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                const active = data.filter(room => room.quant > 0);
                if (active.length === 0) {
                    flexDiv.innerHTML = '<h2>Seçilən dildə otağ yoxdur.</h2>';
                    totalCountDisplay.textContent = '';
                    return;
                }

                flexDiv.innerHTML = '';
                roomIds = [];

                active.forEach((room, k) => {
                    roomIds.push(room.id);

                    const flc = document.createElement('div');
                    flc.classList.add('flex-child');
                    flexDiv.appendChild(flc);

                    const roomTag = document.createElement('h3');
                    roomTag.innerText = room.id.slice(1);

                    const roomSubjIcon = document.createElement('img');
                    roomSubjIcon.src = `https://gartic.io/static/images/subjects/${room.subject}.svg`;

                    const inRoomPlayers = document.createElement('p');
                    inRoomPlayers.innerText = `${room.quant} / ${room.max} ・ ${room.points} / ${room.goal}`;

                    const users = document.createElement('div');
                    users.classList.add('users');

                    const viewBtn = document.createElement('a');
                    viewBtn.href = `https://gartic.io/${room.code}/viewer`;
                    viewBtn.target = '_blank';
                    viewBtn.innerText = 'Otağı izlə';

                    const joinBtn = document.createElement('a');
                    joinBtn.href = `https://gartic.io/${room.code}`;
                    joinBtn.target = '_blank';
                    joinBtn.innerText = 'Otağa daxil ol';

                    flc.append(roomTag, roomSubjIcon, inRoomPlayers, users, viewBtn, joinBtn);

                    // WebSocket ilə istifadəçi məlumatı
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://gartic.io/serverViewer?room=${room.code}`,
                        onload: function(rs) {
                            const dt = rs.responseText;
                            const s = dt.slice(15,16);
                            const ws = new WebSocket(`wss://server0${s}.gartic.io/socket.io/?EIO=3&transport=websocket`);

                            ws.onopen = () => {
                                ws.send(`42["12",{"v":20000,"sala":"${room.id}"}]`);
                            };
                            ws.onmessage = (m) => {
                                try {
                                    const d = JSON.parse(m.data.slice(2));
                                    if(d[0] == 5) {
                                        for(let i=0;i<d[5].length;i++){
                                            const userB = document.createElement('div');
                                            userB.classList.add('user-info');

                                            const userPp = document.createElement('img');
                                            userPp.src = d[5][i].foto || 'https://gartic.io/static/images/avatar/svg/0.svg';

                                            const userName = document.createElement('p');
                                            userName.innerText = d[5][i].nick;

                                            userB.append(userPp, userName);
                                            users.append(userB);
                                        }
                                    }
                                } catch(e){ console.error(e); }
                            };
                        }
                    });

                });

                totalCountDisplay.innerText = `Total Otağ: ${active.length}, Total User: ${active.reduce((acc,curr)=>acc+curr.quant,0)}`;
            }
        });
    }

    select.onchange = function(){ f(this.value); }
    f('23'); // default Azərbaycan dili

})();
