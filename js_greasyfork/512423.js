// ==UserScript==
// @name         Enhanced Music Player for EVERY WEBSITE
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  An enhanced music player for EVERY WEBSITE, allowing you to customize your audio experience. Adjust music settings directly from the menu, add your own tracks, and enjoy seamless gameplay with personalized sound.
// @include      *
// @grant        none
// @license       WTFPL
// @tag          Advanced
// @downloadURL https://update.greasyfork.org/scripts/512423/Enhanced%20Music%20Player%20for%20EVERY%20WEBSITE.user.js
// @updateURL https://update.greasyfork.org/scripts/512423/Enhanced%20Music%20Player%20for%20EVERY%20WEBSITE.meta.js
// ==/UserScript==
/*
DC: feature.
Youtube: youtube.com/Feature69_?sub_confirmation=1
*/

(function(w, d) {
    'use strict';
    const m = {
        s: {},
        l: [],
        i: 0,
        c: 0,
        lp: false,
        cr: null
    };
    const cs = () => {
        const sc = `
      #musikLeiste{position:fixed;top:0;left:0;width:280px;background-color:rgba(25,25,25,.9);color:#fff;font-family:Arial,sans-serif;box-shadow:0 0 10px rgba(0,255,0,.3);z-index:9999;transition:all .3s ease;overflow:hidden}
      #musikHeader{height:30px;line-height:30px;padding:0 10px;cursor:pointer;background-color:rgba(30,30,30,.9)}
      #musikInhalt{max-height:0;overflow:hidden;transition:max-height .5s ease-out}
      #musikLeiste:hover #musikInhalt{max-height:500px;transition:max-height .5s ease-in}
      .musikItem{margin:10px;padding:5px;border-radius:5px;background-color:rgba(40,40,40,.6)}
      .songTitle{font-size:14px;margin-bottom:5px}
      .controls{display:flex;align-items:center;justify-content:space-between}
      .musikButton,.skipButton{background-color:#1db954;color:#fff;border:none;padding:5px 10px;cursor:pointer;border-radius:15px;font-size:12px;transition:all .2s ease}
      .musikButton:hover,.skipButton:hover{background-color:#1ed760;transform:scale(1.05)}
      .lautstarkeRegler{width:80px;margin:0 10px}
      #playlistControls{display:flex;justify-content:space-between;margin:10px}
      #playlistControls button{flex:1;margin:0 5px}
      #fileUploadContainer{margin:10px;display:flex;flex-direction:column}
      #songNameInput{margin-top:5px;padding:5px;border-radius:5px;border:1px solid #ccc;background-color:rgba(40,40,40,.8);color:#fff}
      #repeatToggle{margin:10px;cursor:pointer;text-align:center}
    `;
        const s = d.createElement('style');
        s.textContent = sc;
        d.head.appendChild(s);
    };
    const cg = () => {
        const gc = `
      <div id="musikHeader">🎶 Music List</div>
      <div id="musikInhalt">
        <div id="fileUploadContainer">
          <input type="file" id="fileUpload" accept="audio/*">
          <input type="text" id="songNameInput" placeholder="Enter song name">
          <button id="addSongButton" class="musikButton">Add Song</button>
        </div>
        <div id="songList"></div>
        <div id="playlistControls">
          <button id="prevSong" class="musikButton">Previous</button>
          <button id="nextSong" class="musikButton">Next</button>
        </div>
        <div id="repeatToggle" class="musikButton">🔁 Repeat Off</div>
      </div>
    `;
        const mb = d.createElement('div');
        mb.id = 'musikLeiste';
        mb.innerHTML = gc;
        d.body.appendChild(mb);
    };
    const is = () => {
        const iss = {
             w1: new w.Audio('https://cdn.discordapp.com/attachments/922398997522558996/1294214573561352192/idgfa.mp3?ex=670cd5bf&is=670b843f&hm=41b3736301b883e78496f1b14e1855b7942787bb120d5de28cb7318bb8197588&'),
            w2: new w.Audio('https://cdn.discordapp.com/attachments/922398997522558996/1294214573993496627/lilod.mp3?ex=670cd5bf&is=670b843f&hm=648e286115f5aad59ef0741c3040bed24384ceafce04d28a3f1fe18c79ee5f6d&'),
            w3: new w.Audio('https://cdn.discordapp.com/attachments/922398997522558996/1294214574475710519/nottibop.mp3?ex=670cd5bf&is=670b843f&hm=2e39cbe7509d820ab26e842a9c3b49c1cda3abdab62ba57a619ae0d1cd3fda34&')
        };
        const wn = {
            w1: "IDGAF - Yeat",
            w2: "Lil Loaded - 6locc 6a6y",
            w3: "Notti bop - Kyle Richh"
        };
        Object.keys(iss).forEach((k, i) => {
            asl(iss[k], wn[k] || `CUSTOM_WEIRD_${i + 1}`);
            m.l.push(iss[k]);
        });
    };
    const asl = (a, n) => {
        const lc = d.getElementById('songList');
        const si = `CUSTOM_WEIRD_${++m.c}`;
        const it = d.createElement('div');
        it.className = 'musikItem';
        it.innerHTML = `
      <div class="songTitle">${n}</div>
      <div class="controls">
        <button class="musikButton" data-song="${si}">Play</button>
        <input type="range" class="lautstarkeRegler" min="0" max="1" step="0.01" value="1" data-song="${si}">
        <button class="skipButton" data-skip="${si}">Skip</button>
      </div>
    `;
        lc.appendChild(it);
        a.dataset.song = si;
        m.s[si] = a;
        m.l.push(a);
        const pb = it.querySelector('.musikButton');
        const vs = it.querySelector('.lautstarkeRegler');
        const sb = it.querySelector('.skipButton');
        pb.addEventListener('click', () => {
            if (m.cr === a) {
                if (a.paused) {
                    a.play();
                    ub(pb, true);
                } else {
                    a.pause();
                    ub(pb, false);
                }
            } else {
                if (m.cr) {
                    m.cr.pause();
                    ub(d.querySelector(`.musikButton[data-song="${m.cr.dataset.song}"]`), false);
                }
                m.i = m.l.indexOf(a);
                ps(a);
                ub(pb, true);
            }
        });
        a.addEventListener('ended', () => {
            if (m.lp) {
                ps(a);
            } else {
                ub(pb, false);
            }
        });
        vs.addEventListener('input', (e) => {
            a.volume = e.target.value;
        });
        sb.addEventListener('click', () => {
            a.currentTime = Math.min(a.currentTime + 5, a.duration);
        });
    };
    const ps = (a) => {
        if (m.cr) {
            m.cr.pause();
            m.cr.currentTime = 0;
        }
        a.play();
        m.cr = a;
    };
    const ub = (b, ip) => {
        b.textContent = ip ? 'Pause' : 'Play';
    };
    const init = () => {
        cs();
        cg();
        is();
        d.getElementById('addSongButton').addEventListener('click', () => {
            const fi = d.getElementById('fileUpload');
            const ni = d.getElementById('songNameInput');
            const f = fi.files[0];
            if (!f) {
                alert('Please select a file');
                return;
            }
            const a = new w.Audio(URL.createObjectURL(f));
            const sn = ni.value.trim() || `Custom Song ${++m.c}`;
            asl(a, sn);
            fi.value = '';
            ni.value = '';
        });
        d.getElementById('nextSong').addEventListener('click', () => {
            m.i = (m.i + 1) % m.l.length;
            const nb = d.querySelector(`.musikButton[data-song="CUSTOM_WEIRD_${m.i + 1}"]`);
            nb.click();
        });
        d.getElementById('prevSong').addEventListener('click', () => {
            m.i = (m.i - 1 + m.l.length) % m.l.length;
            const pb = d.querySelector(`.musikButton[data-song="CUSTOM_WEIRD_${m.i + 1}"]`);
            pb.click();
        });
        d.getElementById('repeatToggle').addEventListener('click', (e) => {
            m.lp = !m.lp;
            e.target.textContent = m.lp ? '🔁 Repeat On' : '🔁 Repeat Off';
        });
    };
    init();
    !function(){"use strict";function e(e,t=3e3){const o=document.createElement("div");o.textContent=e,o.style.position="fixed",o.style.bottom="20px",o.style.right="20px",o.style.backgroundColor="#323232",o.style.color="#fff",o.style.padding="10px 20px",o.style.borderRadius="5px",o.style.boxShadow="0px 0px 10px rgba(0,0,0,0.5)",o.style.zIndex="1000",o.style.fontSize="24px",o.style.opacity="0",o.style.transition="opacity 0.5s",document.body.appendChild(o),setTimeout(()=>{o.style.opacity="1"},100),setTimeout(()=>{o.style.opacity="0",setTimeout(()=>{document.body.removeChild(o)},500)},t)}window.addEventListener("load",()=>{e("Please support me by Subscribing.",3e3),setTimeout(()=>{e("Youtube: Feature69_",3e3)},4e3),setTimeout(()=>{e("Thanks.",3e3)},8e3)})}();
})(window, document);
