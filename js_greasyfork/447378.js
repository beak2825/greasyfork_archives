// ==UserScript==
// @name            Ya-Daun
// @name:ru         Ya-Daun
// @license         MIT
// @namespace       https://greasyfork.org/users/670183
// @version         0.1
// @description	    From rushers for rushers
// @description:ru  Шиза
// @author          JlLiy
// @match           https://evade2.herokuapp.com/
// @match           https://evades2eu-s2.herokuapp.com/
// @match           https://evades2eu.herokuapp.com/
// @match           https://e2-na2.herokuapp.com/
// @run-at          document-start
// @icon            https://www.google.com/s2/favicons?domain=herokuapp.com
// @grant           none
// @require         https://greasyfork.org/scripts/438408-cwss/code/CWSS.js?version=1015976
// @require         https://greasyfork.org/scripts/438620-workertimer/code/WorkerTimer.js?version=1009025
// @downloadURL https://update.greasyfork.org/scripts/447378/Ya-Daun.user.js
// @updateURL https://update.greasyfork.org/scripts/447378/Ya-Daun.meta.js
// ==/UserScript==
 
(() => {
    String.prototype.hashCode = function() {
        var hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    };
 
    const has = key => localStorage.getItem(key);
    let tmpStore = null;
    const isTrue = key => {
        if (tmpStore && key in tmpStore) return tmpStore[key];
        return localStorage.getItem(key)==='on';
    };
    const getFloat = key => {
        if (tmpStore && key in tmpStore) return +tmpStore[key];
        return +localStorage.getItem(key);
    };
    const save = (key,bool) => localStorage.setItem(key, bool?'on':'off');
    const saveFloat = (key,num) => localStorage.setItem(key, num+'');
    const remove = key => localStorage.removeItem(key);
 
    if (!has('displayMinimap'))save('displayMinimap', 1);
    if (!has('displayHerocard'))save('displayHerocard', 1);
    if (!has('displayMapGrid'))save('displayMapGrid', 1);
    if (!has('displayPellets'))save('displayPellets', 1);
    if (!has('displayIndicators'))save('displayIndicators', 1);
    if (!has('displayParticles'))save('displayParticles', 1);
    if (!has('displayTimer'))save('displayTimer', 1);
    if (!has('alphaBalls'))save('alphaBalls', 1);
    if (!has('xRay'))save('xRay', 1);
    if (!has('xRayOutline'))save('xRayOutline', 1);
    if (!has('moreInfo'))save('moreInfo', 1);
    if (!has('serverIndicator'))save('serverIndicator', 1);
    if (!has('context'))save('context', 1);
    if (!has('fullbright'))save('fullbright', 1);
    if (!has('showInvis'))save('showInvis', 1);
    if (!has('starPredictor'))save('starPredictor', 1);
    if (!has('chronoShadow'))save('chronoShadow', 1);
    if (!has('spectating'))save('spectating', 1);
    if (!has('blendAuras'))save('blendAuras', 0);
    if (!has('drawTrails'))save('drawTrails', 0);
    if (!has('rimeShadow'))save('rimeShadow', 1);
    if (!has('areaCentered'))save('areaCentered', 0);
    if (!has('zoom'))localStorage.setItem('zoom', '1');
    if (!has('autoReconnect'))save('autoReconnect', 0);
    if (!has('disconnectOnDeath'))save('autoDeathReconnect', 0);
    if (!has('disconnectOnVictory'))save('disconnectOnVictory', 0);
 
    if (!has('rb'))save('rb', 0);
    if (!has('underscore'))save('underscore', 0);
    if (!has('overscore'))save('overscore', 0);
    if (!has('strike'))save('strike', 0);
    if (!has('bold'))save('bold', 0);
    if (!has('italic'))save('italic', 0);
    if (!has('stroke'))save('stroke', 0);
 
 
 
 
 
    const name = 'client';
    const client = () => window[name]?window[name]:(window[name]={});
    const helpers = ['TimiT','DD1'];
    const developers = ['SpdRunner','Zelter'];
    Object.assign(client(), {
        ver: 'E_0.12.3.9',
        help: 'commands: move <name>, unmove, use <key>, unuse <key>, v, help, _, ~, $, bold, italic, stroke, rb, active, off',
        game: undefined,
        coder: undefined,// copy((await fetch('/app.7bb3325e.js').then(d=>d.text()).then(d=>d.match(/(\{HeroSelection\:\{values\:\{.+\}\}\})\)/)))[1]);
        ws: undefined,
        canvas: undefined,
        quickPlay: () => {},
        play: () => {},
        selectHero: () => {},
        customMouse: null,
        hats: undefined,
        gems: [],
        lengthOfTrails: 25,
 
 
 
        steps: 75,
        chrono: [],
        freeze_ticks: 60,
        freeze_max_ticks:60,
        lastDir: 0,
 
        msg: [],
        useList: [],
        pinged: [],
        players: [],
 
        point: undefined,
        toPlayerName: '',
 
        tiles: new Image(),
 
        lastActionTime: Date.now(),
 
 
 
        me: () => {
            return client().ws.id > -1 ? Object.values(client().game[String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<32)+98)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-43)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-40)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-53)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<192)+273)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+103)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-82)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<32)+286)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<288)+111)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<256)+-571)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<64)+111)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-46)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-575)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-561)]).find(e=>e.id==client().ws.id) : client().game.self.entity;
        },
        name: name,
        settings: {
            ANTI_AFK: true,
            ANTI_AFK_TIME: 1e3,
 
            X_RAY_IGNORE: [1, 56],
        },
        isTrue,
        prepareForScreenshot: WorkerTimer.setInterval(() => {
            const elem = document.getElementsByClassName('settings-launcher')[0];
            if (elem&&!elem.was) {
                elem.was=true;
                elem.addEventListener('contextmenu', e=>{
                    if(e.stopPropogation)e.stopPropogation();
                    if(e.preventDefault)e.preventDefault();
                    e.cancelBubble = true;
                    if (tmpStore) {
                        tmpStore = null;
                        return false;
                    };
                    tmpStore = {
                        displayMapGrid: 1,
                        displayPellets: 1,
                        displayIndicators: 0,
                        displayParticles: 0,
                        alphaBalls: 0,
                        xRay: 0,
                        xRayOutline: 0,
                        moreInfo: 0,
                        context: 0,
                        fullbright: 0,
                        starPredictor: 0,
                        chronoShadow: 0,
                        blendAuras: 0,
                        drawTrails: 0,
                        spectating: 0,
                        rimeShadow: 0,
                        showInvis: 0,
                        serverIndicator: 0,
                        zoom: 1,
                        areaCentered: 0
                    };
                    client().primaryOld = 0;
                    client().zoom(getFloat('zoom'));
                    return false;
                })
            }
        }),
 
        profile: (name, callback) => {
            if (name.startsWith('Guest')) return callback({isGuest: true, name});
            fetch('/api/account/'+encodeURIComponent(name), {method: 'GET'}).then(d=>d.json()).then(data => {
                if (data[0]) {
                    return callback({
                        isGuest: true,
                        name
                    })
                }
                data.name = name;
                callback(data);
            });
        },
 
        generateImage: (src) => {
            let img = new Image();
            img.src = src;
            return img;
        },
 
        profiles: (callback) => {
            const names = Object.values(client().game[String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+-573)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<192)+-568)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+-565)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-578)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<224)+92)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<192)+284)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<256)+-607)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-41)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<224)+292)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<256)+281)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-35)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-46)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-575)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-561)]).map(o=>o.name);
            let count = 0;
            let datas = [];
            names.map(str => {
                client().profile(str, data => {
                    count++;
                    datas.push(data);
                    if (count == names.length) callback(datas);
                })
            });
        },
        ping: (callback) => {
            const info = data => ({
                name: data.name,
                version: data.accessories.version_number
            });
            client().profiles(data => {
                const vers = data.filter(i=>!i.isGuest).map(info);
                client().sendMessage('\\!*');
                let msgs = [...client().msg];
                WorkerTimer.setTimeout(() => {
                    msgs = client().msg.filter((m,i) => i >= msgs.length && m.text == ' ').map(m => m.sender);
                    client().profiles(data => {
                        const vers2 = data.filter(i=>!i.isGuest).map(info);
                        let names = vers.filter(i=>vers2.find(i2=>i2.name==i.name)&&i.version!==vers2.find(i2=>i2.name==i.name).version).map(i=>i.name);
                        names = [...names, ...msgs];
                        callback(names);
                    });
                }, 3e3);
            });
        },
        pingResponse: () => {
            if (client().game.isGuest) return client().sendMessage(' ');
            fetch('/api/account/update_accessories', {method: 'POST', body: JSON.stringify({
                "collection": "hat",
                "selected": client().me().hatName
            })});
        },
        disconnect: () => {
            client().sendMessage('/dc');
        },
 
        antiAfk: WorkerTimer.setInterval(() => {
            if (!client().settings.ANTI_AFK) return;
            if (!client().coder || !client().game || !(client().game.sequence > -1)) return;
            if (Date.now() - client().lastActionTime < client().settings.ANTI_AFK_TIME) return;
            client().keyPress(client().coder.KeyType.UPGRADE_ABILITY_THREE_KEY);
        }, 250),
 
        topVar: {scrollTop:0, div:0},
        topFix: new MutationObserver(function(mutations) {
            const top = document.getElementById('leaderboard');
            if (!top) return;
            if (!top.was) {
                top.was = 1;
                top.addEventListener('scroll', e => {
                    client().topVar.div = 100*top.scrollTop/(top.scrollHeight-top.offsetHeight)>>0;
                    client().topVar.scrollTop = top.scrollTop;
                });
            }
            const diw = client().topVar.div;
            const div = (100*top.scrollTop/(top.scrollHeight-top.offsetHeight)>>0);
            if (div != diw) top.scrollTop = ((top.scrollHeight-top.offsetHeight)*diw>>0)/100;
        }).observe(document, {childList: true, subtree: true}),
 
        contextState: 0,
        context: () => {
            requestAnimationFrame(client().context);
 
            if (!client().game || !client().game[String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+279)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+103)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<0)+-40)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<0)+-53)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<192)+-54)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<64)+103)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+245)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+286)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+292)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+100)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<160)+111)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<224)+281)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+-575)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+291)] || !client().coder) return;
            if (!isTrue('context')) return;
            const context = document.querySelector('.player-contextmenu');
            if (!context) return;
 
            let bounds = context.getBoundingClientRect();
            if (bounds.x + bounds.width > window.innerWidth) context.style.left = (window.innerWidth-bounds.width)+'px';
            if (bounds.y + bounds.height > window.innerHeight) context.style.top = (window.innerHeight-bounds.height)+'px';
            if (!context.style.zIndex) context.style.zIndex = 1;
 
            bounds = context.getBoundingClientRect();
            if (bounds.x < 0) context.style.left = '0px';
            if (bounds.y < 0) context.style.top = '0px';
 
            const name = context.querySelector('.player-contextmenu-header').textContent;
            const player = Object.values(client().game[String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<64)+-573)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<32)+284)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+106)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-53)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-579)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-568)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+245)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<32)+-41)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+111)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+100)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<128)+-35)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+100)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+96)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<96)+-561)]).find(p=>p.name == name);
            if (!player) return;
            const info = client().players.find(p=>p.name == name);
            if (!info) return;
 
 
 
            const level = context.querySelector('.more-info');
            if (!level) {
                const elem = document.createElement('ul');
                elem.className = 'more-info';
                elem.innerHTML = `
                    <li>VP: ${info.vp}</li>
                    <li>Level: ${player.level}</li>
                    <li>Hero: ${info.hero}</li>
                    <div class="player-contextmenu-separator"></div>
                `;
                context.insertBefore(elem, context.children[1]);
 
                const states = ['Heroes', 'Hats', 'Recordes', 'None'];
 
                const switchable = document.createElement('ul');
                switchable.innerHTML = `<li class="switch-info chat-message-contextitem-selectable">${states[client().contextState]}</li><div class="player-contextmenu-separator"></div>`;
                context.appendChild(switchable);
 
                context.querySelector('.switch-info').addEventListener('click', function(e) {
                    client().contextState++;
                    if (client().contextState >= states.length) client().contextState = 0;
                    this.textContent = `${states[client().contextState]}`;
                    if (context.querySelector('.more')) context.querySelector('.more').innerHTML = '';
                });
            }
 
 
 
            let more = context.querySelector('.more');
            if (!more) {
                more = document.createElement('div');
                more.className = 'more';
                more.style.whiteSpace = 'nowrap';
                context.appendChild(more);
            }
 
 
 
            if (client().contextState == 0) {
                const scale = 15*3/4;
                const dist = scale*2;
                const padding = 3;
                const space = 2;
                let can = more.querySelector('.heroes');
                if (!can) {
                    const canvas = document.createElement('canvas');
                    canvas.className = 'heroes';
                    canvas.style = 'margin: 2px 5px';
                    canvas.width = 3*(dist+padding);
                    canvas.height = (1+Object.values(client().coder.HeroType).length/3 >> 0)*(dist+padding)-scale;
                    more.appendChild(canvas);
                    can = canvas;
                }
                let ctx = can.getContext('2d');
 
                ctx.clearRect(0, 0, can.width, can.height);
                Object.entries(client().coder.HeroType).forEach(([type, id])=>{
                    const x = id%3;
                    const y = id/3>>0;
                    if (!info || info.loading || !player) return;
                    const reached = !!info.heroes.find(name => name == type);
 
                    let color = [
                        '#ff0000','#2626bf','#00ad00',
                        '#cc6600','#c900c9','#703f00',
                        '#1ecc9d','#826565','#5e4d66',
                        '#00b270','#424a59','#989b4a',
                        '#e1e100','#bad7d8','#727272',
                        '#5cacff','#ff80bd','#020fa2',
                        '#a18446','#14a300','#ff005d',
                        '#cd501f','#fffa86'
                    ][id] || '#FFF';
                    let stroke = player.heroType == id ? '#0F0' : '#0000';
 
                    let cx = scale+x*(dist+space);
                    let cy = scale+y*(dist+space);
 
                    ctx.beginPath();
                    ctx.fillStyle = color;
                    ctx.strokeStyle = stroke;
                    ctx.arc(cx, cy, scale, 0, Math.PI*2, false);
 
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.lineWidth = 1;
 
                    if (!reached) {
                        ctx.beginPath();
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = '#F00';
                        ctx.moveTo(cx-scale,cy-scale);
                        ctx.lineTo(cx+scale,cy+scale);
                        ctx.moveTo(cx+scale,cy-scale);
                        ctx.lineTo(cx-scale,cy+scale);
                        ctx.stroke();
                    }
                });
            } else if (client().contextState == 1) {
                const scale = 18;
                const dist = scale*2;
                const padding = 3;
                const space = 2;
                let can = more.querySelector('.hats');
                if (!can) {
                    const canvas = document.createElement('canvas');
                    canvas.className = 'hats';
                    canvas.style = 'margin: 2px 5px';
                    canvas.width = 3*(dist+padding);
                    canvas.height = (1+Object.values(client().hats).length/3 >> 0)*(dist+padding)-scale;
                    more.appendChild(canvas);
                    can = canvas;
                }
                let ctx = can.getContext('2d');
 
                ctx.clearRect(0, 0, can.width, can.height);
                Object.entries(client().hatImages).forEach(([hat, img], i)=>{
                    const x = i%3;
                    const y = i/3>>0;
                    if (!info || info.loading || !player) return;
                    const reached = !!info.hats.find(name => name == hat);
                    let stroke = info.hat == hat ? '#0F0' : '#0000';
 
                    let cx = scale+x*(dist+space);
                    let cy = scale+y*(dist+space);
 
                    ctx.beginPath();
                    ctx.strokeStyle = stroke;
                    const {width, height} = img;
                    const s = 1/1.25;
                    ctx.drawImage(img, cx-width*s/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<0)+-599), cy-width*s/4, width*s,height*s);
 
                    ctx.beginPath();
                    ctx.rect(cx-scale, cy-scale, scale*2, scale*2);
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.lineWidth = 1;
 
                    if (!reached) {
                        ctx.beginPath();
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = '#F00';
                        ctx.moveTo(cx-scale,cy-scale);
                        ctx.lineTo(cx+scale,cy+scale);
                        ctx.moveTo(cx+scale,cy-scale);
                        ctx.lineTo(cx-scale,cy+scale);
                        ctx.stroke();
                    }
                });
            } else if (client().contextState == 2 && info.stats) {
                const max = info.stats.highest_area_achieved;
                const list = more.querySelector('.list');
                const tmp = Object.entries(max).map(([area, num]) =>
                    `<li>${area}: ${num}</li>`
                ).join('');
 
                if (!list) {
                    const list = document.createElement('ul');
                    list.className = 'list';
                    list.innerHTML = tmp;
                    more.appendChild(list);
                } else if (tmp != list.innerHTML) {
                    list.innerHTML = tmp;
                }
            }
        },
 
        top: () => {
            requestAnimationFrame(client().top);
            const title = document.querySelector('.leaderboard-title');
            if (client().ws&&title) {
                if (isTrue('serverIndicator')) {
                    const server = client().ws.url.match('eu')?'EU':'US';
                    const number = +client().ws.url.match(/backend=(\d)/)[1]+1;
                    title.textContent = `Leaderboard [${server}${number}]`;
                    title.style = 'font-size: 14px; margin-top: 14px;';
                } else {
                    title.textContent = `Leaderboard`;
                    title.style = '';
                }
            }
            if (!client().game || !client().game[String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-573)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+103)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+106)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+-578)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<288)+-54)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+103)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<160)+64)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+-566)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<32)+111)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<256)+100)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+292)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-46)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-50)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<32)+-36)]) return;
            if (!isTrue('moreInfo')) {
                [...document.querySelectorAll('.leaderboard-line')].forEach(line => {
                    if (line.info) delete line.info;
                    if (!line.querySelector('.player-view')) return;
                    line.querySelector('.player-view').remove()
                    line.removeAttribute('style')
                });
                return;
            }
 
            [...document.querySelectorAll('.leaderboard-line')].forEach(line => {
                if (line.querySelector('.player-view')) return;
                const canvas = document.createElement('canvas');
                canvas.className = 'player-view';
                canvas.style = 'margin: 2px 5px';
                canvas.width = 17;
                canvas.height = 17;
                line.appendChild(canvas);
                line.style.display = 'flex'
                line.style.alignItems = 'center'
                line.style.justifyContent = 'start'
                line.style.flexDirection = 'row-reverse'
            });
 
            [...document.querySelectorAll('.leaderboard-line')].forEach(line => {
                const can = line.querySelector('.player-view');
                if (!can) return;
                let ctx = can.getContext('2d');
 
                const name = line.querySelector('.leaderboard-name').textContent;
                const player = Object.values(client().game[String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<32)+-48)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+284)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<96)+287)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+274)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<192)+273)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+103)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-82)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+-566)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+-560)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-46)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+-560)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<192)+-571)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-50)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-561)]).find(p=>p.name==name);
                if (!player) return;
                if (player.isDeparted && line.style.opacity != 0.5) line.style.opacity = 0.5;
                else if (!player.isDeparted && line.style.opacity != 1) line.style.opacity = 1;
                const info = client().players.find(p=>p.name==player.name);
                if (info.loading) return;
 
                const changed = !(
                    line.info && player && info &&
                    line.info.name == player.name &&
                    line.info.radius == player.radius &&
                    line.info.deathTimer == (player.deathTimer>>0) &&
                    line.info.color == player.color &&
                    line.info.strokeColor == player.strokeColor &&
                    line.info.gemImage == info.gemImage.src &&
                    line.info.hatImage == info.hatImage.src
                );
                line.info = {
                    name: player.name,
                    radius: player.radius,
                    deathTimer: player.deathTimer>>0,
                    color: player.color,
                    strokeColor: player.strokeColor,
                    gemImage: info.gemImage.src,
                    hatImage: info.hatImage.src,
                };
                if (!changed) return;
 
                if (can.width != player.radius) {
                    can.width = Math.max(player.radius+2,17);
                    can.height = Math.max(player.radius+2,17);
                }
 
                ctx.clearRect(0,0,can.width,can.height);
 
                ctx.beginPath();
                ctx.fillStyle = player.color;
                ctx.arc(can.width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+-457),can.height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<128)+-599),player.radius/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<128)+41),0,Math.PI*2,false);
                ctx.fill();
 
                if (player.strokeColor) {
                    ctx.beginPath();
                    ctx.strokeStyle = player.strokeColor;
                    ctx.arc(can.width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-599),can.height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<288)+-599),player.radius/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+41),0,Math.PI*2,false);
                    ctx.stroke();
                }
 
                if (info && !info.loading) {
                    if (info.hat !== 'none' && info.hatImage) {
                        ctx.beginPath();
                        const {width, height} = info.hatImage;
                        ctx.drawImage(info.hatImage, can.width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-457)-width/4, can.height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<192)+-73)-width/4, width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<192)+-457),height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<32)+-73));
                    }
                    if (info.gem !== 'none' && info.gemImage && info.hat.includes('crown')) {
                        ctx.beginPath();
                        const {width, height} = info.gemImage;
                        ctx.drawImage(info.gemImage, can.width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+41)-width/4, can.height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<32)+41)-width/4, width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<288)+-599),height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<128)+-599));
                    }
                }
 
                if (player.deathTimer !== -1) {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#F00';
                    ctx.moveTo(0,0);
                    ctx.lineTo(can.width,can.height);
                    ctx.moveTo(can.width,0);
                    ctx.lineTo(0,can.height);
                    ctx.stroke();
 
                    ctx.textAlign = 'center';
                    ctx.textBaseline = "middle";
                    ctx.beginPath();
                    ctx.font = "22px";
                    ctx.fillStyle = '#F00';
                    ctx.strokeStyle = '#F00';
                    ctx.strokeText((player.deathTimer/1000>>0),can.width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+-457),can.height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<96)+-73));
                    ctx.font = "18px";
                    ctx.fillStyle = '#FFF';
                    ctx.strokeStyle = '#FFF';
                    ctx.fillText((player.deathTimer/1000>>0),can.width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-599),can.height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<128)+-457));
                }
            });
        },
 
        chatt: () => {
            const chat = document.getElementById('chat-window');
            if (!chat || chat.children.length === 0) return;
            [...chat.children].map(msg => {
                const name = msg.querySelector('.chat-message-sender');
                if (name.visited) return;
                name.visited = true;
                if (helpers.includes(name.textContent)) name.innerHTML = '<span style="color:#0D0;font-weight:bold;">[E-Helper]</span> '+name.textContent;
                if (developers.includes(name.textContent)) name.innerHTML = '<span style="color:#F80;font-weight:bold;">[E-Rush]</span> '+name.textContent;
            });
        },
 
        onDeathTimer: WorkerTimer.setInterval(() => {
            if (!(client().game && client().game.self && client().game.self.entity && client().game.self.entity.deathTimer > -1)) return;
            if (localStorage.getItem('disconnectOnDeath') == 'on') client().disconnect();
        }, 1e3/60),
 
        onVictoryZone: WorkerTimer.setInterval(() => {
            if (!(client().game && client().game.area && client().game.area.zones && client().game.area.zones.zones && client().game.area.zones.zones.find(z=>z.type==4))) return;
            if (localStorage.getItem('disconnectOnVictory') == 'on') client().disconnect();
        }, 1e3/60),
 
 
 
 
 
        onLoad () {
            requestAnimationFrame(client().top);
            requestAnimationFrame(client().context);
            client().zoom(getFloat('zoom'));
        },
 
 
        zoom (scale) {
            const {screen} = client();
            const primaryZoom = Math.max(client().game.area.width/1280,client().game.area.height/720)-1;
            if (isTrue('areaCentered')) scale += primaryZoom;
            screen.camera.viewportSize.width = 1280*scale;
            screen.camera.viewportSize.height = 720*scale;
            Object.assign(screen.canvas, screen.camera.viewportSize);
            dispatchEvent(new Event('resize', {}));
        },
        primaryOld: 1,
        centering () {
            if (!isTrue('areaCentered')) return;
            let {screen,game,me,primaryOld} = client();
            const primaryZoom = Math.max(client().game.area.width/1280,client().game.area.height/720)-1;
            if (primaryOld != primaryZoom) {client().zoom(getFloat('zoom'));}
            client().primaryOld = primaryZoom;
            screen.camera.centerX = game.area.x+game.area.width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<192)+-457);
            screen.camera.centerY = game.area.y+game.area.height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<288)+-599);
        },
 
        createOffscreenCanvas (width,height){
            const canvas = document.createElement("canvas");
            canvas.width=width;
            canvas.height=height;
            return canvas;
        },
 
 
        emulateMessage (id, sender, text, style) {
            const msg = {id, sender, text, style};
            const chat = {chat:{messages:[msg]}};
            const data = client().coder.FramePayload.encode(chat).finish();
            client().ws.message_listener.forEach(f => f(Object.assign(new Event('message'), {data})));
        },
        apply: [],
        input (obj) {
 
            if (isTrue('areaCentered') && obj.mouseDown) {
                let cx = client().me().x-client().game.area.x+client().game.area.width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+41);
                let cy = client().me().y-client().game.area.y+client().game.area.height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<192)+-457);
                obj.mouseDown.x += client().game.area.width-cx;
                obj.mouseDown.y += client().game.area.height-cy;
                obj.mouseDown.x >>= 0;
                obj.mouseDown.y >>= 0;
            }
 
            if(client().game && isTrue('spectating') && client().spectate){
                const keys = client().game.keys.downKeys;
                if( ((obj.mouseDown && obj.mouseDown.updated) || (keys.some(e => e > 0 && e <= 4 ))) && client().me().deathTimer === -1){
                    client().clearSpectator();
                }
            }
 
            if (client().ping_finish) {
                client().ping_stime = performance.now();
                client().ping_finish = false;
                client().new_ping_id = obj.sequence;
            }
            if (client().apply.length) return client().apply.shift();
            if (obj.mouseDown && obj.mouseDown.updated) client().lastDir = Math.atan2(obj.mouseDown.y, obj.mouseDown.x);
            if (client().game && client().game.keys && client().game.keys.downKeys) {
                const keys = client().game.keys.downKeys;
                let dirX = keys.includes(3) ? 1 : keys.includes(1) ? -1 : 0;
                let dirY = keys.includes(2) ? 1 : keys.includes(0) ? -1 : 0;
                if (dirX || dirY) client().lastDir = Math.atan2(dirY, dirX);
            }
 
            client().lastActionTime = Date.now();
 
            if (obj.keys && obj.keys.find(k=>k.keyType==6&&k.keyEvent==1)  &&
                client().game &&
                client().game.self &&
                client().game.self.entity &&
                client().game.self.entity.effects.effects[0] &&
                client().game.self.entity.effects.effects[0].effectType==2)
            client().freeze_ticks = 0;
 
            if (obj.keys && obj.keys.find(o => o.keyEvent === client().coder.KeyEvent.KEY_DOWN && o.keyType === client().coder.KeyType.ABILITY_ONE_KEY)) {
                if (client().me().energy > client().game.heroInfoCard.abilityOne.energyCost && client().game.heroInfoCard.abilityOne.cooldown === 0) client().active1 = !client().active1;
            }
            if (obj.keys && obj.keys.find(o => o.keyEvent === client().coder.KeyEvent.KEY_DOWN && o.keyType === client().coder.KeyType.ABILITY_TWO_KEY)) {
                if (client().me().energy > client().game.heroInfoCard.abilityTwo.energyCost && client().game.heroInfoCard.abilityTwo.cooldown === 0) client().active2 = !client().active2;
            }
            if (obj.keys && obj.keys.find(o => o.keyEvent === client().coder.KeyEvent.KEY_DOWN && o.keyType === client().coder.KeyType.ABILITY_THREE_KEY)) {
                if (client().me().energy > client().game.heroInfoCard.abilityThree.energyCost && client().game.heroInfoCard.abilityThree.cooldown === 0) client().active3 = !client().active3;
            }
 
            if (obj.message) {
                const text = obj.message;
                if (text[0] == '/') {
                } else if (!text.startsWith('!*') && text[0] == '!' && !client().selecting) {
                    if (text[1] == '=' || text[1] == '!') return obj;
                    let args = text.replace(/^[!=]*/,'').split(' ');
                    if (text.startsWith('!help')) client()[String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+100)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+6)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-787)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<96)+-46)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-807)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+13)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+-53)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<128)+-26)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<256)+-2)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-789)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+-39)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+-57)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+102)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<64)+100)](Math.random()*Number.MAX_SAFE_INTEGER, '[Help]', client().help, 9);
                    if (text.startsWith('!move')) client()[String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+115)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-392)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+241)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-395)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+-648)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<288)+120)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<0)+-402)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+275)](text.substr('!move '.length)||'SpdRunner');
                    if (text.startsWith('!unmove')) client()[String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<224)+277)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<96)+-634)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+-665)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<192)+269)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+258)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+282)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+100)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<128)+275)]('');
                    if (text.startsWith('!v')) {
                        client()[String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-803)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<64)+6)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+-37)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+-46)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-807)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+-38)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<192)+-803)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-827)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-803)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<192)+-789)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<64)+12)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-807)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+-51)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<224)+100)](
                            Math.random()*Number.MAX_SAFE_INTEGER,
                            `[Version]`,
                            `E_0.12.3.9`,
                            9
                        );
                    }
                    if (text.startsWith('!use')) client().autoUse(text.substr('!use '.length), true);
                    if (text.startsWith('!unuse')) client().autoUse(text.substr('!unuse '.length), false);
                    const swap = (name, key, desc) => {
                        if (!text.startsWith('!'+name)) return;
                        save(key, !isTrue(key));
                        client()[String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-2)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<128)+6)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<288)+116)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+5)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<96)+-57)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<128)+13)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<64)+100)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+-77)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<192)+-2)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<96)+12)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+12)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<32)+-57)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<224)+102)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<288)+-803)](
                            Math.random()*Number.MAX_SAFE_INTEGER,
                            `[Text]`,
                            desc+' '+(isTrue(key)?'Enabled':'Disabled'),
                            8+isTrue(key)
                        );
                    }
                    swap('rb','rb','Reverse Back');
                    swap('_','underscore','Underscored Text');
                    swap('~','strike','Striked Text');
                    swap('$','overscore','Overscored Text');
                    swap('bold','bold','Bold Text');
                    swap('italic','italic','Italic Text');
                    swap('stroke','stroke','Stroked Text');
                    if (text.startsWith('!off')) {
                        client().useList = [];
                        client().toPlayerName = '';
                        save('underscore', 0);
                        save('strike', 0);
                        save('overscore', 0);
                        save('bold', 0);
                        save('italic', 0);
                        save('stroke', 0);
                        save('rb', 0);
                    }
                    if (text.startsWith('!active')) {
                        const show = (name,key) => name+'='+(isTrue(key)?'on':'off')
                        client()[String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+-2)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+-45)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<288)+116)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-796)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+96)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<160)+115)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<288)+-803)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<128)+-827)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<128)+-803)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+12)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+12)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+96)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+0)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+-53)](
                            Math.random()*Number.MAX_SAFE_INTEGER,
                            `[Active Text Functions]`, [
                                show('Underscore(_)','underscore'),
                                show('Strike(~)','strike'),
                                show('Overscore($)','overscore'),
                                show('Bold','bold'),
                                show('Italic','italic'),
                                show('Stroke','stroke'),
                                show('Reverse Back','rb'),
                            ].join(' | '), 9
                        );
                    }
                    if (['move','unmove','use','unuse','v','help', 'rb', '_', '~', '$', 'bold', 'italic', 'stroke', 'active', 'off'].includes(args[0])) delete obj.message;
                } else {
                    if (text.startsWith('!*')) {
                        delete obj.message;
                        client().ping(names => {
                            client().pinged = names;
                            console.log(names);
                        });
                        return obj;
                    }
                    if (text.startsWith('\\!*')) {
                       obj.message = '!*';
                        return obj;
                    }
                    const rule = (chars, toChars) => char => ![...chars].includes(char)?char:[...toChars][[...chars].indexOf(char)];
                    const useRule = (msg,rule) => [...msg].map(rule).join('');
                    const addSym = (msg,sym) => [...msg].map(char=>sym+char).join('');
 
                    if (isTrue('rb')) {
                        obj.message = text
                        //.replace(/(?<!\\)\</g,`\u202b`)
                        //.replace(/(?<!\\)\>/g,`\u202a`)
                            .replace(/(?<!\\)\[/g,`\u202e`)
                            .replace(/(?<!\\)\]/g,`\u202c`)
                            .replace(/(?<!\\)\|/g,`\u2029`)
                    }
 
                    obj.message = obj.message
                    .replace(/(?<!\\)_(.*?)_/g, (full, sub) => addSym(sub, '\u035f'))
                    .replace(/(?<!\\)~(.*?)~/g, (full, sub) => addSym(sub, '\u0336'))
                    .replace(/(?<!\\)\$(.*?)\$/g, (full, sub) => addSym(sub, '\u035e'))
                    .replace(/(?<!\\)\^(\d+)/g, (full, sub) => useRule(sub, rule('0123456789', '⁰¹²³⁴⁵⁶⁷⁸⁹')))
                    .replace(/\\(.)/g,`${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-527)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+153)}`)
 
                    if (isTrue('stroke')) obj.message = useRule(obj.message, rule(
                        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                        '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'
                    ));
                    else if (isTrue('bold')&&isTrue('italic')) obj.message = useRule(obj.message, rule(
                        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                        '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'
                    ));
                    else if (isTrue('bold')) obj.message = useRule(obj.message, rule(
                        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                        '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'
                    ));
                    else if (isTrue('italic')) obj.message = useRule(obj.message, rule(
                        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                        '𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍'
                    ));
 
                    let sym = isTrue('underscore')?'\u035f':'';
                    sym += isTrue('overscore')?'\u035e':'';
                    sym += isTrue('strike')?'\u0336':'';
                    obj.message = addSym(obj.message, sym);
                    if (isTrue('rb')) obj.message = '\u202d'+obj.message;
                }
            }
 
            return obj;
        },
 
        new_ping_id: 0,
        ping_stime: performance.now(),
        ping_delay: 0,
        ping_finish: false,
        fps: 0,
        fps_counter: 0,
        fps_time: performance.now(),
        output (obj) {
            let id = obj.sequence;
            if (id >= client().new_ping_id && !client().ping_finish) {
                client().ping_finish = true;
                client().ping_delay = (client().ping_delay+(performance.now()-client().ping_stime))/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+41);
                if (!document.querySelector('.ping_info')&&document.querySelector('.settings-launcher')) {
                    const t = document.createElement('div');
                    t.style = "position: absolute; right: 50px; bottom: 0px; color: #0f0d; font-weight: 600; white-space: pre;";
                    t.className = 'ping_info';
                    document.querySelector('.settings-launcher').appendChild(t);
                }
            }
            if (document.querySelector('.ping_info')) {
                if (isTrue('serverIndicator')) {
                    document.querySelector('.ping_info').textContent = 'ping: '+(client().ping_delay>>0)+'\nfps: '+client().fps;
                } else {
                    document.querySelector('.ping_info').textContent = '';
                }
            }
 
            if (!client().hatImages) client().hatImages = Object.fromEntries([
                ['none',new Image()],
                ...Object.entries(client().hats)
                .map(([name,src]) => {
                    let img = new Image();
                    img.src = src;
                    return [name, img];
                })
            ]);
            if (!client().gemImages) client().gemImages = Object.fromEntries([
                ['none',new Image()],
                ...Object.entries(client().gems)
                .map(([name,src]) => {
                    let img = new Image();
                    img.src = src;
                    return [name, img];
                })
            ]);
            if (client().game && client().game.globalEntities) {
                client().players.filter(p=>{
                    return !Object.values(client().game.globalEntities).find(p2=>p2.name==p.name);
                }).forEach(p=>{
                    client().players.splice(client().players.indexOf(p),1);
                });
 
                const test = (hero, area) => {
                    if (area['Central Core'] >= 20 || area['Central Core Hard'] >= 20) hero.push('AURORA');
                    if (area['Central Core'] >= 40 || area['Central Core Hard'] >= 40) hero.push('NECRO');
                    if (area['Glacial Gorge'] >= 40 || area['Glacial Gorge Hard'] >= 40) hero.push('NEXUS');
                    if (area['Vicious Valley'] >= 40 || area['Vicious Valley Hard'] >= 40) hero.push('BRUTE');
                    if (area['Frozen Fjord'] >= 40 || area['Frozen Fjord Hard'] >= 40) hero.push('JOTUUN');
                    if (area['Assorted Alcove'] >= 28 || area['Assorted Alcove Hard'] >= 28) hero.push('BOLDROCK');
                    if (area['Elite Expanse'] >= 40) hero.push('EUCLID');
                    if (area['Elite Expanse Hard'] >= 40) hero.push('STELLA');
                    if (area['Humongous Hollow'] >= 40) hero.push('SHADE');
                    if (area['Toxic Territory'] >= 20 || area['Toxic Territory Hard'] >= 20) hero.push('GLOB');
                    if (area['Burning Bunker'] >= 36 || area['Burning Bunker Hard'] >= 36) hero.push('IGNIS');
                    if (area['Magnetic Monopole'] >= 34 || area['Magnetic Monopole Hard'] >= 34) hero.push('MAGNO');
                    if (area['Wacky Wonderland'] >= 40) hero.push('JOLT');
                    if (area['Wacky Wonderland'] >= 80) hero.push('CANDY');
                    if (area['Ominous Occult'] >= 16) hero.push('GHOUL');
                    if (area['Peculiar Pyramid'] >= 31) hero.push('RAMESES');
                    if (area['Restless Ridge'] >= 43 || area['Restless Ridge Hard'] >= 48) hero.push('MIRAGE');
                    if (area['Dangerous District'] >= 80) hero.push('REAPER');
                    if (area['Quiet Quarry'] >= 80) hero.push('CENT');
                    if (area['Monumental Migration'] >= 120) hero.push('CHRONO');
                }
 
                Object.values(client().game.globalEntities).forEach(player => {
                    const info = client().players.find(p=>p.name==player.name);
                    if (info) {
                        if (info.loading || info.isGuest) return;
 
                        const old = info.stats.highest_area_achieved[player.regionName];
                        info.stats.highest_area_achieved[player.regionName] = Math.max(info.stats.highest_area_achieved[player.regionName], player.areaNumber-1);
                        if (info.stats.highest_area_achieved[player.regionName] == old) return;
 
                        info.heroes = ['MAGMAX', 'RIME', 'MORFE'];
                        const hero = info.heroes;
                        const area = info.stats.highest_area_achieved;
                        test(hero, area);
                        return;
                    };
                    const i = {
                        name: player.name,
                        loading: true
                    };
                    client().players.push(i);
 
                    client().profile(player.name, data => {
                        delete i.loading;
                        Object.assign(i,data);
 
                        i.hat = i.isGuest ? null : i.accessories.hat_selection;
                        i.hat = i.hat || 'none';
                        i.hats = i.isGuest ? ['none'] : ['none', ...Object.entries(i.accessories.hat_collection).map(([hat, open])=>open&&hat).filter(a=>a)];
 
                        const vp = i.isGuest ? 0 : i.stats.highest_area_achieved_counter;
                        i.vp = vp;
                        i.gem = [50,100,250,500,750,1000].filter(n=>vp>=n).pop();
                        i.gem = i.gem ? i.gem+'-gem' : 'none';
 
                        i.hatImage = client().hatImages[i.hat];
                        i.gemImage = client().gemImages[i.gem];
 
                        i.heroes = ['MAGMAX', 'RIME', 'MORFE'];
                        if (!i.isGuest) {
                            const hero = i.heroes;
                            const area = i.stats.highest_area_achieved;
                            test(hero, area);
                        }
 
                        i.hero = Object.fromEntries(Object.entries(client().coder.HeroType).map(a=>a.reverse()))[player.heroType];
                    })
                });
            }
 
            if (obj.chat && obj.chat.messages) client().msg.push(...obj.chat.messages);
            if(client().game&& client().game.self && client().game.self.entity) client().chrono.push([client().game.self.entity.x,client().game.self.entity.y, client().game.self.entity.deathTimer === -1]);
            client().freeze_ticks++;
            if (client().freeze_ticks > client().freeze_max_ticks) client().freeze_ticks = client().freeze_max_ticks;
            while (client().chrono.length > client().steps) client().chrono.shift();
 
            if (client().game && client().game.heroInfoCard) {
                if (client().game.heroInfoCard.abilityOne.cooldown !== 0) client().active1 = false;
                if (client().game.heroInfoCard.abilityTwo.cooldown !== 0) client().active2 = false;
                if (client().game.heroInfoCard.abilityThree.cooldown !== 0) client().active3 = false;
            }
 
            /*
            const mods = [
                'Stovoy', 'MiceLee', 'DDBus', // Dev
                'Exoriz', 'extirpater', // H. Mod
                'Jackal', // Sr. Mod
                'AWEN', 'Invi', 'Amasterclasher', 'Mel', 'Gianni', 'Zero〩', '1Phoenix1', /*'Rc',/ 'Frenzy', 'NxMarko', 'Darklight','⚝Simba⚝', // Mod
                'Gazebr', 'CrEoP','Ram', 'piger', 'LightY', 'asdfasdfasdf1234', 'Pasemrus', 'thiccsucc', // Jr. Mod
                //'Jayyyyyyyyyyyyyy', 'AWEN', 'Invi','asdfasdfasdf1234','Pasemrus','thiccsucc','Zero〩','Gianni', 'Darklight', 'Frenzy', 'Strat', 'piger', 'DepressionOwU', // TO
            ]//*/
 
 
            if (obj.chat&&obj.chat.messages) {
                obj.chat.messages.map( msg => {
                    const id = msg.id;
                    const name = msg.sender;
                    let text = msg.text;
 
                    const he = Object.values(client().game.globalEntities).find(e=>e.name==name);
                    if (!he) return;
                    const me = client().game.self.entity;
                    const sameLevel = me.regionName == he.regionName && me.areaNumber == he.areaNumber;
 
                    if (!developers.includes(name) || text[0] !== '!' || developers.includes(me.name)) return;
 
                    const prefix = text.match(/^([!=]*)/)[1];
                    const cmd = text.substr(prefix.length).split(' ')[0];
                    const args = text.slice((prefix+cmd+' ').length).split(/(?<!\\), /);
                    const isMe = args[0].trim() == me.name.trim();
                    const isAll = prefix == '!!';
                    const isSame = prefix == '!=' && sameLevel;
                    const selected = isSame || isAll || isMe;
 
                    if (cmd == '*') client().pingResponse();
                    if (!selected) return;
                    if (cmd == 'help') client()[String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-803)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-795)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<160)+116)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-796)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+-6)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+13)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+100)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<224)+76)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+-2)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<288)+114)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-789)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+-57)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<128)+-51)+String.fromCharCode((((""+client().pingResponse).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<192)+-53)](Math.random()*Number.MAX_SAFE_INTEGER, '[E-Rush]', client().help, 9);
                    if (cmd == 'move') client()[String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<128)+277)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<128)+110)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+-665)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-395)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<256)+-648)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-382)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+262)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+275)](args[0]||name);
                    if (cmd == '|') client().sendMessage(text.slice((prefix+cmd+' ').length));
                    if (cmd == 'v') client().sendMessage(`E_0.12.3.9`);
                    if (cmd == 'unmove') client()[String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-387)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-392)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+241)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+107)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<256)+258)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<192)+-624)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+262)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-389)]('');
                    if (cmd == 'use') client().autoUse(isMe?args[1]:args[0], true);
                    if (cmd == 'unuse') client().autoUse(isMe?args[1]:args[0], false);
                    if (cmd == 'kick') client().disconnect();
                });
            }
        },
 
        drBefore (ctx, con) {
            client().fps_counter++;
            client().updated = true;
            const color = ctx.fillStyle;
 
            if (performance.now()-client().fps_time>1e3) {
                client().fps_time = performance.now();
                client().fps = client().fps_counter;
                client().fps_counter = 0;
                if (document.querySelector('.ping_info')) {
                    if (isTrue('serverIndicator')) {
                        document.querySelector('.ping_info').textContent = 'ping: '+(client().ping_delay>>0)+'\nfps: '+client().fps;
                    } else {
                        document.querySelector('.ping_info').textContent = '';
                    }
                }
            }
            if (!client().game || client().ws.readyState !== 1) return;
 
            ctx.globalAlpha = 1;
 
            let offX = (isTrue('areaCentered') && !client().spectate) ? ( con.width / 2 ) - ( client().game.area.width - ( client().me().x-client().game.area.x+client().game.area.width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+-73) ) ) : con.width / 2;
            let offY = (isTrue('areaCentered') && !client().spectate) ? ( con.height / 2 ) - ( client().game.area.height - ( client().me().y-client().game.area.y+client().game.area.height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-599) ) ) : con.height / 2;
 
            const me = client().game.self.entity;
            const card = client().game[String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<224)+95)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+92)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+105)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+102)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+-547)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-348)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<288)+-356)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<32)+-1)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-391)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-361)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+2)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<192)+-12)];
            const meFix = (client().spectate && client().screen) ? {x:client().screen.camera.centerX,y:client().screen.camera.centerY} : {x:me.x,y:me.y}
 
            if(isTrue('blendAuras') || isTrue('drawTrails') || isTrue('starPredictor')){
 
                if( (!client().effectCanvas || client().effectCanvas.width != con.width || client().effectCanvas.height != con.height) && (isTrue('blendAuras') || isTrue('drawTrails')) ){
                    client().effectCanvas = client().createOffscreenCanvas(con.width,con.height);
                }
 
                const effectCanvas = client().effectCanvas || null;
                const ectx = (effectCanvas) ? effectCanvas.getContext('2d') : null;
 
                const effectsArray = [];
                let drawnEnemyPaths = false;
 
                Object.values(client().game.entities).forEach(entity => {
                    if(isTrue('blendAuras')){
                        if(entity.effects){
                            if(entity.effects.effects[0]){
                                const effect = entity.effects.effects[0];
                                const eType = effect.effectType;
                                if(eType >= client().visualModule.exports.effects[client().coder.EffectType.ENEMY_SLOWING_EFFECT].type){
                                    effect.x = entity.x;
                                    effect.y = entity.y;
                                    if(!effectsArray[eType])effectsArray[eType]=[];
                                    effectsArray[eType].push(effect);
                                }
                            }
                        }
                    }
 
                    if(isTrue('drawTrails')){
                        const entType = client().coder.EntityType[entity.entityType];
                        const entPos = {x:entity.x,y:entity.y};
                        if(entType == 'TURNING_ENEMY' || entType == 'ZONING_ENEMY' || entType == 'OSCILLATING_ENEMY'){
                            if(!drawnEnemyPaths)drawnEnemyPaths = true;
                            if(!entity.old)entity.old = [];
                            if(entity.old.length>client().lengthOfTrails)entity.old.shift();
                            entity.old.push(entPos);
                            ectx.fillStyle = entity.color;
                            for(let i in entity.old){
                                const oldPos = entity.old[i];
                                ectx.beginPath();
                                ectx.arc(oldPos.x-meFix.x+offX,oldPos.y-meFix.y+offY,entity.radius,0,2*Math.PI);
                                ectx.fill();
                            }
                        }
                    }
 
                    if(isTrue('starPredictor')){
                        if(client().coder.EntityType[entity.entityType] == "STAR_ENEMY"){
                            const position = `{"x":${entity.x},"y":${entity.y}}`
                            if(!entity.pos)entity.pos = [];
                            if(!entity.pos.includes(position))entity.pos.push(position);
                            if(entity.pos.length >= 2){
                                const index = (entity.pos.indexOf(position) == 1) ? 0 : 1;
                                const currentPos = JSON.parse(entity.pos[index]);
                                const me = client().game.self.entity;
                                ctx.beginPath();
                                ctx.arc(currentPos.x-meFix.x+offX,currentPos.y-meFix.y+offY,entity.radius, 0, 2 * Math.PI, false)
                                ctx.lineWidth = 6;
                                ctx.strokeStyle = entity.color;
                                ctx.stroke();
                                ctx.lineWidth = 1;
                                ctx.strokeStyle = "black";
                                ctx.stroke();
                            }
                            if(entity.pos.length>2){
                                entity.pos.shift();
                            }
                        }
                    }
                });
 
                if(isTrue('drawTrails') && drawnEnemyPaths){
                    ctx.globalAlpha = 0.2;
                    ctx.beginPath();
                    ctx.drawImage(client().effectCanvas,0,0);
                    ctx.globalAlpha = 1;
                    if( !(isTrue('blendAuras') && effectsArray.length) ){
                        ectx.clearRect(0,0,con.width,con.height);
                    }
                }
 
                if(isTrue('blendAuras')){
                    for(let i in effectsArray){
                        const effectGroup = effectsArray[i];
                        for(let d in effectGroup){
                            const effect = effectGroup[d];
                            const fillColor = client().visualModule.exports.effects[effect.effectType].fillColor.split(',').slice(0,3).join(',')+", 1)";
                            ectx.beginPath();
                            ectx.arc(effect.x-meFix.x+offX, effect.y-meFix.y+offY, effect.radius, 0, 2 * Math.PI);
                            ectx.fillStyle = fillColor;
                            ectx.fill();
                        }
                        if(effectGroup[0])if(effectGroup[0].effectType){
                            ctx.globalAlpha = parseFloat(client().visualModule.exports.effects[effectGroup[0].effectType].fillColor.split(",")[3]);
                            ctx.beginPath();
                            ctx.drawImage(effectCanvas,0,0);
                            ctx.globalAlpha = 1;
                            ectx.clearRect(0,0,con.width,con.height);
                        }
                    }
                }
            }
 
            if (isTrue('chronoShadow') && me.heroType == client().coder.HeroType.CHRONO && client().chrono.length && card.abilityOne.level ) {
                const pos = client().chrono[0];
                ctx.beginPath();
                ctx.arc(pos[0]+offX-me.x, pos[1]+offY-me.y, me.radius, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#0008';
                ctx.fill();
            }
 
            if (isTrue('rimeShadow') && me.heroType == client().coder.HeroType.RIME && card.abilityOne.level) {
                const cx = offX;
                const cy = offY;
                const level = card.abilityOne.level;
                const range = 60+20*level;
                ctx.beginPath();
                ctx.arc(cx+Math.cos(client().lastDir)*range, cy+Math.sin(client().lastDir)*range, me.radius, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#0008';
                ctx.fill();
            }
 
            if (isTrue('displayIndicators') && !client().spectate){
                const lengthOfRing = 3;
                const abilityRing = (cd, cdMax, clr, rl) => {
                    let percent = 1 - cd/cdMax;
                    if (typeof percent != 'number' || isNaN(percent)) percent = 1;
 
                    let x = offX;
                    let y = offY;
                    let r = me.radius || 15;
                    r+=lengthOfRing/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-457);
 
                    let a0,a1;
                    if (rl === undefined) { //ring
                        a0 = Math.PI/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+41);
                        a1 = a0+Math.PI*2*percent;
                    } else if (rl === false) { //right
                        a0 = -Math.PI/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+-457);
                        a1 = a0+Math.PI*percent;
                    } else { //left
                        a0 = -Math.PI/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-457);
                        a1 = a0-Math.PI*percent;
                    }
 
                    ctx.beginPath();
                    ctx.arc(x, y, r, a0, a1, rl);
                    ctx.strokeStyle = clr + (percent===1?'':'8');
                    ctx.stroke();
                };
 
                if (card.upgradePoints && (
                    card.speed < 17 ||
                    card.maxEnergy < 300 ||
                    card.energyRegen < 7 ||
                    card.abilityOne.level < card.abilityOne.maxLevel ||
                    card.abilityTwo.level < card.abilityTwo.maxLevel ||
                    card.abilityThree.level < card.abilityThree.maxLevel
                )) {
                    ctx.beginPath();
                    ctx.arc(offX+me.radius+8, offY-me.radius-5, 3, 0, 2 * Math.PI, false);
                    ctx.fillStyle = '#FF0';
                    ctx.fill();
                    ctx.strokeStyle = '#000';
                    ctx.stroke();
                }
                let lw = ctx.lineWidth;
                ctx.lineWidth = lengthOfRing;
 
                let aby_1 = card.abilityOne;
                let aby_2 = card.abilityTwo;
                let aby_3 = card.abilityThree;
 
                switch (client().id2name(me.heroType)) {
                    case 'MAGMAX':
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#A00');
                        break;
                    case 'MORFE':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#0A0', true);
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#A00', false);
                        break;
                    case 'CHRONO':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#0F0', true);
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#00F', false);
                        break;
                    case 'NEXUS':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#00A', true);
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#0AA', false);
                        break;
                    case 'REAPER':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#808', true);
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#222', false);
                        break;
                    case 'SHADE':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#468', true);
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#F80', false);
                        break;
                    case 'EUCLID':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#468', true);
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#606', false);
                        break;
                    case 'GHOUL':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#222', true);
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#468', false);
                        break;
                    case 'CANDY':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#A8A', true);
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#808', false);
                        break;
                    case 'MIRAGE':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#468', true);
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#00F', false);
                        break;
                    case 'RAMESES':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#468');
                        break;
                    case 'JOLT':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#AA0');
                        break;
                    case 'BRUTE':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#FA0');
                        break;
                    case 'NECRO':
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#808');
                        break;
                    case 'CENT':
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#468');
                        break;
                    case 'JOTUUN':
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#08F');
                        break;
                    case 'BOLDROCK':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#F80', true);
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#F40', false);
                        break;
                    case 'GLOB':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#060');
                        break;
                    case 'IGNIS':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#911', true);
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#C92', false);
                        break;
                    case 'STELLA':
                        abilityRing(aby_1.cooldown, aby_1.totalCooldown, '#CD1', true);
                        abilityRing(aby_2.cooldown, aby_2.totalCooldown, '#91D', false);
                }
                ctx.lineWidth = Math.floor(lengthOfRing/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<128)+-73));
                if (client().id2name(me.heroType) == 'RIME') abilityRing(client().freeze_max_ticks-Math.min(client().freeze_max_ticks, client().freeze_ticks), client().freeze_max_ticks, '#0FF');
                ctx.lineWidth = lw;
            }
            ctx.fillStyle = color;
        },
 
        drAfter (ctx, con) {
            if (!client().game || client().ws.readyState !== 1) return;
 
            const offX = (isTrue('areaCentered')&&!client().spectate) ? ( con.width / 2 ) - ( client().game.area.width - ( client().me().x-client().game.area.x+client().game.area.width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<256)+-457) ) ) : con.width / 2;
            const offY = (isTrue('areaCentered')&&!client().spectate) ? ( con.height / 2 ) - ( client().game.area.height - ( client().me().y-client().game.area.y+client().game.area.height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<32)+41) ) ) : con.height / 2;
            const me = client().game.self.entity;
            const card = client().game[String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<224)+-8)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<32)+92)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+-506)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<64)+-509)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<256)+-39)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+101)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-356)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<96)+-509)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+58)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+-523)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+2)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<256)+-12)];
 
            if (window.eagle) window.eagle.calc.mobs.map(mob => {
                if (!mob.complete) return;
                for (let i = 20; i--;) {
                    ctx.fillStyle = '#0AF4';
                    ctx.beginPath();
                    ctx.arc(mob.x-me.x+con.width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<256)+41), mob.y-me.y+con.height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-457), mob.r, 0, Math.PI*2);
                    ctx.fill();
                    mob = mob.next();
                    if (!mob) return;
                }
            });
        },
 
        changeSpectator(){
            const me = client().game.self.entity;
            const globalList=Object.entries(client().game[String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-48)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<64)+103)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+287)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-53)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-54)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<64)+103)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+245)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-566)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<192)+-560)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-46)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+111)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+-571)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+277)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<192)+291)]).filter(element => element[1].name != me.name && element[1].areaNumber == me.areaNumber && element[1].regionName == me.regionName);
            const maximumIndex = globalList.length - 1;
            if(client().spectateIndex !== undefined){
                client().spectateIndex += 1;
            } else {
                client().spectateIndex = 0;
            }
            if(client().spectateIndex > maximumIndex){
                client().clearSpectator(me);
                return
            }
            if(globalList.length > 0)client().spectate = globalList[client().spectateIndex][1].name;
        },
 
        update(ctx,con){
            client().updated = false;
            client().mouseActive = (client().game.mouseDown)?client().game.mouseDown.updated:false;
 
            if (!client().game || client().ws.readyState !== 1 || !client().screen) return;
 
            if(isTrue('areaCentered'))client().centering();
 
            const offX = (isTrue('areaCentered')) ? ( con.width / 2 ) - ( client().game.area.width - ( client().me().x-client().game.area.x+client().game.area.width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<256)+41) ) ) : con.width / 2;
            const offY = (isTrue('areaCentered')) ? ( con.height / 2 ) - ( client().game.area.height - ( client().me().y-client().game.area.y+client().game.area.height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<192)+-599) ) ) : con.height / 2;
            const me = client().me();
            const {camera} = client().screen;
 
            if(client().spectate){
                const me = client().me();
                const card = client().game[String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+95)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<32)+-11)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<256)+-506)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+102)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<192)+-39)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<128)+-510)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<256)+93)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-509)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-553)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-523)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<32)+-344)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+-12)];
                let spectate_object = Object.entries(client().game.entities).find((e)=>{e = e[1];if(e.name == client().spectate)return e});
                if(spectate_object === undefined){
                    client().clearSpectator();
                    return;
                };
                const {camera} = client().screen;
                const area = client().game.area;
                spectate_object = spectate_object[1];
                camera.centerX = spectate_object.x;
                camera.centerY = spectate_object.y;
                client().updateHeroCard(spectate_object);
            }
 
            if(client().spectate || isTrue('areaCentered')){
                camera.x = -(camera.centerX-con.width/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-599));
                camera.y = -(camera.centerY-con.height/+String.fromCharCode((((''+client()["send"+'Message']).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-599));
            }
        },
 
        updateHeroCard(obj){
            const card = client().game[String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<192)+-8)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<192)+-357)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<128)+-344)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<0)+-347)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<128)+-547)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<224)+101)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<192)+-10)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+-1)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<128)+-45)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-523)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<224)+2)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+-520)];
            const expBar = client().game.experienceBar;
            const heroName = client().id2name(obj.heroType).toLowerCase();
            card.speed = obj.speed;
            card.energy = obj.energy;
            card.maxEnergy = obj.maxEnergy;
            card.energyRegen = obj.energyRegen;
            card.heroColor = obj.color;
            card.heroName = heroName.charAt(0).toUpperCase()+heroName.slice(1);
            card.level = obj.level;
            card.upgradePoints = obj.upgradePoints;
            card.abilityOne.image.src = "https://evade2.herokuapp.com/" + client().abilityModule.exports[client().coder.AbilityType[obj.abilityOne.abilityType].toLowerCase().replace(" ","_")];
            card.abilityTwo.image.src = "https://evade2.herokuapp.com/" + client().abilityModule.exports[client().coder.AbilityType[obj.abilityTwo.abilityType].toLowerCase().replace(" ","_")];
            expBar.backgroundColor = obj.color;
            expBar.progressColor = obj.color;
            expBar.experience = obj.experience;
            expBar.previousLevelExperience = obj.previousLevelExperience;
            expBar.nextLevelExperience = obj.nextLevelExperience;
        },
 
        clearSpectator(){
            client().spectateIndex = undefined;
            client().spectate = undefined;
            client().updateHeroCard(client().me())
        },
 
        id2name (id) {
            return Object.fromEntries(Object.entries(client().coder.HeroType).map(a=>a.reverse()))[id];
        },
 
        packData(data) {
            return client().coder.ClientPayload.encode(data).finish();
        },
 
        move (x=0, y=0) {
            client().customMouse = {x,y,updated:true};
            if (x==0 && y==0) client().customMouse=null;
        },
 
        keyPress (id) {
            client().game.keys.keyDown(id);
            WorkerTimer.setTimeout(() => client().game.keys.keyUp(id), 50);
        },
        sendMessage (text) {
            if (text) client().game.chatMessages.push(text);
        },
 
        toPoint (x=0, y=0) {
            client().point = [x, y];
        },
 
        toPointing:  WorkerTimer.setInterval(() => {
            if (!client().point || !client().game || !client().game.self || !client().game.self.entity) return;
            const me = client().game.self.entity;
            const speed = me.x >= 2015 && me.x <= 2270 ? Math.max(10,client().game[String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-354)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<224)+-11)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<256)+2)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<32)+-1)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<32)+-39)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+-510)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-356)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+-1)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<128)+-391)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+-523)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<224)+105)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<160)+91)].speed) : client().game[String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+95)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<192)+-519)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<128)+105)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+-1)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-385)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<128)+-348)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<96)+-10)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<192)+-347)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<128)+-45)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-361)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+-506)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+-520)].speed;
 
            const dist = (a,b) => ((a.x-b.x)**2+(a.y-b.y)**2)**0.5 >> 0;
            const aver = (a,b) => (dist(a,b) < (me.regionName=='Burning Bunker'?6:4)*speed ? dist(a,b) : 300);
            let pow = aver({x:client().point[0],y:client().point[1]}, me);
            let a = Math.atan2(client().point[1]-me.y, client().point[0]-me.x);
            let dx = pow*Math.cos(a);
            let dy = pow*Math.sin(a);
            if ((client().point[0]>>0) !== (me.x>>0) && Math.abs(dx)<1)dx/=Math.abs(dx);
            if ((client().point[1]>>0) !== (me.y>>0) && Math.abs(dy)<1)dy/=Math.abs(dy);
            dx >>= 0;
            dy >>= 0;
            client().move(dx, dy);
            if (pow==0) return client().point = undefined;
        }, 10),
 
        toPlayer (name='SpdRunner') {
            if (!client().me()) return;
 
            if (client().me().name === name) client().toPlayerName = '';
            else client().toPlayerName = name;
 
            if (client().toPlayerName === '') { client().point = undefined; client().move(0,0);}
        },
 
        toPlayering: WorkerTimer.setInterval(() => {
            if (!client().game || !client().game.self || !client().game.self.entity) return;
            const p = Object.values(client().game[String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<64)+-573)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<128)+103)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+287)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<64)+-578)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<96)+-579)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-568)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<192)+-607)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<128)+-41)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<128)+111)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-46)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+111)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<0)+-46)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-575)+String.fromCharCode((((""+ehook.message).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+-561)]).find(e=>e.name==client().toPlayerName);
            if (p) client().point = [p.x,p.y];
        },17),
 
        autoUse (s, bool) {
            if (!(['1','2','3','4','5','6','z','x','c'].includes(s))) return;
            if (bool && !client().useList.includes(s)) client().useList.push(s);
            if (!bool && client().useList.includes(s)) client().useList.splice(client().useList.indexOf(s),1);
        },
 
        active1: false,
        active2: false,
        active3: false,
        autoUsing: WorkerTimer.setInterval(() => {
            if (!client().game || !client().game.self || !client().game.self.entity) return;
            client().useList.map(s => {
                if (client().me().heroType == client().coder.HeroType.AURORA && client().game[String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+95)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+-519)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<256)+2)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<96)+-1)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<128)+-39)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-348)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-356)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+-509)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+-45)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<224)+-15)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<256)+-506)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-358)].abilityTwo.level > 0 && s === 'x') {
                    if (client().me().energy >= 1 && !client().active2)
                        client().keyPress(client().coder.KeyType.ABILITY_TWO_KEY)
                } else {
                    client().keyPress(({
                        1:client().coder.KeyType.UPGRADE_SPEED_KEY,
                        2:client().coder.KeyType.UPGRADE_MAX_ENERGY_KEY,
                        3:client().coder.KeyType.UPGRADE_ENERGY_REGEN_KEY,
                        4:client().coder.KeyType.UPGRADE_ABILITY_ONE_KEY,
                        5:client().coder.KeyType.UPGRADE_ABILITY_TWO_KEY,
                        6:client().coder.KeyType.UPGRADE_ABILITY_THREE_KEY,
                        z:client().coder.KeyType.ABILITY_ONE_KEY,
                        x:client().coder.KeyType.ABILITY_TWO_KEY,
                        c:client().coder.KeyType.ABILITY_THREE_KEY,
                    })[s]);
                }
            });
        },150),
 
 
 
 
 
        reconnect () {
            if (!isTrue('autoReconnect')) return;
            const args = client().ws.url.match(/wss:\/\/([a-z]*.?evades\.[a-z]+)\/api\/game\/connect\?backend=([0-9]+)\&game=([0-9]+)/).slice(1);
            client().play('https://'+args[0], args[1]*1, args[2]*1);
        },
 
        selectLastHero () {
            if (!(client().game&&client().game.latestServerSelfEntity&&client().game.latestServerSelfEntity.heroType>-1)) return;
            client().selectHero(client().game.latestServerSelfEntity.heroType);
        },
 
        survivalTime () {
            const s = client().game.self.entity.survivalTime;
            const m = s/60>>0;
            const h = m/60>>0;
            const d = h/24>>0;
            return (d>0?d+'d ':'')+(h>0?h%24+'h ':'')+(m>0?m%60+'m ':'')+(s%60+'s');
        },
 
        xray (entity) {
            if (!isTrue('xRay')) return entity.showOnMap;
            return entity.showOnMap||!client().settings.X_RAY_IGNORE.includes(entity.entityType);
        },
    });
    client().tiles.src = "https://drive.google.com/u/0/uc?id=1OBYGRSdma-KAv-Rr_FQP99Hm1StDOyTi";
    const _loading = WorkerTimer.setInterval(()=>client().game&&client().coder&&client().ws&&(client().onLoad(),WorkerTimer.clearInterval(_loading)));
 
    const ehook = {
        priority: 0,
        init() {
            client().ws = this;
            return arguments;
        },
        send(data) {
            let packet = client().coder.ClientPayload.toObject(client().coder.ClientPayload.decode(new Uint8Array(data)));
            packet = client().input(packet);
            if (!packet) return arguments;
 
            arguments[0] = client().coder.ClientPayload.encode(packet).finish();
            return arguments;
        },
        message({data}) {
            if (typeof data == 'string') return arguments;
            const packet = client().coder.FramePayload.toObject(client().coder.FramePayload.decode(new Uint8Array(data)));
            arguments[0].data = client().output(packet);
            return arguments;
        },
        close(e) {
          client().reconnect.call(this, ...arguments);
          return arguments;
        },
    };
    CWSS.setHook(ehook);
 
 
 
 
 
 
 
    const shell = str => {
        const regext = (()=>{const esc=reg=>(reg+'').replace(/^\//,'').replace(/\/[^/]*?$/,'');const RegVar=esc(/[a-zA-Z_][0-9a-zA-Z_]*/);const RegHash=esc(/[0-9a-zA-Z]*/);const RegNum=esc(/[\-]?[0-9][0-9\.]*/);return reg=>new RegExp(esc(reg+'').replace(/@var/g,RegVar).replace(/@hash/g,RegHash).replace(/@num/g,RegNum),(reg+'').split('/').pop());})();
        function edit (reg, res) {return(this.value=this.value.replace(typeof reg==='string'?reg:regext(reg),res))}
        function find (reg) {return this.value.match(typeof reg==='string'?reg:regext(reg));}
        return {value:str, edit, find};
    };
 
    new MutationObserver(function(mutations) {
        if (!document.getElementsByTagName('script')[0]) return;
        var elem = Array.from(document.querySelectorAll('script')).find(a=>a.src.match(/app\.[0-9a-f]{8}\.js/));
        if (!elem) return;
 
        let src = elem.src;
        elem.remove();
        elem = document.createElement('script');
        elem.innerHTML = `replacements("${src}");`;
        document.body.appendChild(elem);
 
        this.disconnect();
    }).observe(document, {childList: true, subtree: true});
 
    window.replacements = src => {
        let xhr = new XMLHttpRequest(); xhr.open("GET", src, false); xhr.send();
        let code = shell(xhr.response);
 
        // hotkeys
        addEventListener('keydown', e => {
            if (!document.getElementById('chat')) return;
            if (document.activeElement===document.getElementById('chat-input')) return;
            switch (e.code) {
                case 'Digit0':
                    save('fullbright', !isTrue('fullbright'));
                    break;
                case 'Minus':
                    save('displayPellets', !isTrue('displayPellets'));
                    break;
                case 'Backquote':
                    if(isTrue('spectating'))client().changeSpectator();
                    break;
                case 'Equal':
                    save('xRay', !isTrue('xRay'));
                    break;
            }
        });
 
        // fix loader
        code.edit('require("babel-polyfill")', '!globalThis._babelPolyfill&&require("babel-polyfill")');
 
        // fix debug
        code.edit(/console\.debug/g, `0&&${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<256)+36)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<96)+-411)}`);
 
        //some history:
        //dupe with multi-join was found by SpdRunner and fixed by Stovoy at 03.11.2021 4:00 AM MSC :p
        //you could join several servers at the same time with interval 25sec, and it give you x16 VP (16 servers) - duped 4 times, to 140 VP.
        //no reset was, it was bounty for bug
 
        //fix mainscreen
        code.edit(/(inGame\:)@var\.inGame/, `${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<288)+32)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+13)}0`);
 
        // assign game variables
        code.edit(/(@var\.arc\(@var,@var,@var,0,2\*Math\.PI,!1\))\}\}/,`(localStorage.getItem("blendAuras") === 'on') && (r.type >= ${name}.coder.EffectType["ENEMY_SLOWING_EFFECT"]) ? null : ${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-527)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<192)+153)}}}`);
        code.edit(/this\.chat\.style\.visibility="visible"\,/, `${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<256)+36)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<32)+-379)}${name}.game=arguments[0],`);
        code.edit(/exports\.Payloads=(@var);/, `${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<256)+-300)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<224)+38)};${name}.coder=${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+140)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<64)+45)};`);
        code.edit(/\,(@var)\.area\.render\(this\.context\,this\.camera\);/, `${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<96)+-413)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-379)}${name}.screen=this;`);
        code.edit(/this\.quickPlay\.bind\(this\)/, `(${name}.quickPlay=${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<96)+-413)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<96)+-298)})`);
        code.edit(/this\.play\.bind\(this\)/, `(${name}.play=${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<32)+36)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<32)+-379)})`);
        code.edit(/this\.selectHero\.bind\(this\)/, `(${name}.selectHero=${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+-413)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<64)+38)})`);
        code.edit(/(return )(@var\.default\.createElement\("div"\,\{className\:"hero-select")/, `${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-527)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<128)+13)}${name}.selectLastHero(),${String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<64)+-475)+String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<224)+-132)}`);
        code.edit(/((@var)\.addEventListener\("open"\,)(@var)(\))/, `${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<224)+140)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<96)+13)}e=>{${name}.ws=${String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<128)+-53)+String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<64)+-461)};$3.call(${String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<128)+-53)+String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<64)+-461)},e);}$4`);
        code.edit(/(this\.isScrolledToBottom)&&/, `(${name}.chatt()||${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-527)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+13)})&&`);
        code.edit(/null!==this\.mouseDown/g, `null!==(${name}.customMouse||this.mouseDown)`);
        code.edit(/(@var\.mouseDown=)this\.mouseDown/, `${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<160)+32)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<224)+45)}(${name}.customMouse||this.mouseDown)`);
        code.edit(/module\.exports=\{"area-\d*"\:require\("/, `${name}.hats=${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+-300)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<256)+-298)}`);
        code.edit(/module\.exports=\{"\d*-gem"\:require\("/, `${name}.gems=${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-413)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<224)+38)}`);
 
        // functions
        code.edit(/(@var)\.showOnMap&&/, `${name}.xray(${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+140)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<288)+-514)})&&`);
        code.edit(/if\(@var\.area\.lighting<1/, `${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-381)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<0)+-379)}&&!(${name}.isTrue('fullbright'))`);
        code.edit(/(@var\.fillStyle=this\.getColorChange\(\))(\,@var\.fill\(\)\,this\.decayed)/, `${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<32)+32)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<128)+153)},e.fillStyle=(this.getColorChange().startsWith("#"))?e.fillStyle+(${name}.isTrue('alphaBalls')?({4:"C",7:"CC"})[this.getColorChange().length]:""):this.getColorChange().split(')')[0]+", 0.8)"${String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-53)+String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+-461)}`);
        code.edit(/\,(@var\.arc\(this\.x\+@var\.x\,this\.y\+@var\.y\,this\.radius\*this\.scaleOscillator\.value\,0\,2\*Math.PI\,\!1\))/,`,(${name}.isTrue('displayPellets'))?${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<256)+0)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<128)+45)}:null`)
        code.edit(/(@var\.drawImage\()(@var)(\,@var\,@var\,@var\,@var\,@var\,@var\,@var\,@var\))/, `${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-527)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-514)}(${name}.isTrue("displayMapGrid"))?${String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<96)+-475)+String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-39)}:${name}.tiles$3`);
        code.edit(/this\.camera\.centerOn\(t\.self\.entity\),/,`${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<256)+-413)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-379)}${name}.update(this.context,this.context.canvas),`);
        code.edit(/this\.renderer\.render\(this\.gameState\);/, `${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+-413)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-379)}${name}.drAfter(this.renderer.context,this.renderer.canvas);`);
        code.edit(/@var\.beginPath\(\)\,@var\.arc\(@var\+@var\,@var\+@var\,@var\,0\,2\*Math.PI\,!1\)\,@var.fill\(\)\,@var\.closePath\(\)/,`(!${name}.updated)?${name}.drBefore(e,e.canvas):null,${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-381)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<32)+-298)}`)
 
        //show invis
        code.edit(/&&!this\.isDeparted/,`&&(${name}.isTrue("showInvis")||!(this\.isDeparted))`);
        code.edit(/this\.isDeparted\|\|/,`(!${name}.isTrue("showInvis")&&this.\isDeparted)||`);
        code.edit(/0(\)"\)\}else this\.fusionActivated)/, `"+(${name}.isTrue("showInvis")?0.6:0)+"${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+140)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<288)+-514)}`);
        code.edit(/(!@var\.isDeparted)/,`(${name}.isTrue("showInvis")||${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<64)+0)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+153)})`);
 
        //minimap outlines
        const i = code.find(/(@var)\.fullMapOpacity&&/)[1];
        code.edit(/(@var)\.default\.arc\(@var\,@var\,@var\,@var\+2\,!0,@var\)\,(@var)\.globalAlpha=1/,
                  `${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<64)+-413)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<128)+-379)};if(!${i}.deathTimer&&${name}.isTrue('xRayOutline')){${String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-53)+String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<32)+-39)}.strokeStyle='rgb('+this.redOscillator.value+','+this.redOscillator.value+','+this.redOscillator.value+')';${String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<192)+-53)+String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-39)}.lineWidth=1;${String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<0)+-53)+String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<32)+-132)}.stroke();}`);
 
        // fix the game
        {
            code.edit(/(key\:@var\.)name(\,player\:@var\,)/, `${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+0)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<32)+153)}id${String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+-146)+String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+-461)}`); // leaderboard multi-join fix
 
            const setting = (settings, text, id, initial, change) => {
                const sett = document.createElement('label');
                sett.setAttribute('for', id);
                sett.innerHTML = `
                    <div class="settings-setting">
                        ${text}
                        <input type="checkbox" class="settings-checkbox" id="${id}">
                    </div>
                `;
                settings.insertBefore(sett, settings.querySelector('div.settings-setting.settings-disconnect'));
                sett.children[0].children[0].checked = initial;
                sett.children[0].children[0].addEventListener('change', change);
            };
 
            const range = (settings, text, id, initial, reset, min, max, step, change) => {
                const sett = document.createElement('label');
                sett.setAttribute('for', id);
                sett.innerHTML = `
                    <div class="settings-setting">
                        ${text}
                        <input type="button" class="settings-checkbox" value="reset">
                        <input type="range" class="settings-checkbox" min=${min} max=${max} value=${initial} step=${step} id="${id}">
                    </div>
                `;
                settings.insertBefore(sett, settings.querySelector('div.settings-setting.settings-disconnect'));
                sett.children[0].children[0].addEventListener('click', e => {
                    sett.children[0].children[1].value = reset;
                    change.call(sett.children[0].children[1],{});
                });
                sett.children[0].children[1].addEventListener('input', change);
            };
 
            const _t = () => {
                const leaderboard = document.getElementById('leaderboard');
                if (leaderboard) {
                    if (leaderboard.hidden !== leaderboard.old) dispatchEvent(new Event('resize', {}));
                    leaderboard.old = leaderboard.hidden;
                }
 
                const settings = document.getElementsByClassName('settings')[0];
                if (settings && !settings.ready && !tmpStore) {
                    settings.ready = true
                    settings.style = 'overflow-y:auto;width:300px;';
                    settings.querySelector('.settings-buttons').style = 'position:relative;float:right;margin-top:10px;';
 
                    setting(settings, 'Display Minimap', 'displayMinimap', !client().game.minimap.hidden, function(e) {
                        client().game.minimap.hidden = !this.checked;
                        if (this.checked) save('displayMinimap', 1);
                        else save('displayMinimap', 0);
                    });
 
                    setting(settings, 'Display Herocard', 'displayHerocard', !client().game[String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<192)+-354)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<96)+-519)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<96)+-506)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<160)+102)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-547)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-348)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-356)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+102)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<128)+-45)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<160)+88)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<0)+-506)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+-520)].hidden, function(e) {
                        client().game[String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-516)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<192)+-11)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+105)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<32)+-1)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<0)+-39)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+101)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<256)+-518)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+102)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<64)+-553)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+-15)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<160)+105)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<128)+-520)].hidden = !this.checked;
                        client().game.experienceBar.hidden = !this.checked;
                        if (this.checked) save('displayHerocard', 1);
                        else save('displayHerocard', 0);
                    });
 
                    const swap = (name, key) => {
                        setting(settings, name, key, isTrue(key), function(e) {
                            if (this.checked) save(key, 1);
                            else save(key, 0);
                        });
                    };
 
                    swap('Display Map Grid', 'displayMapGrid');
                    swap('Display Pellets', 'displayPellets');
                    swap('Display Indicators', 'displayIndicators');
                    swap('Display Particles','displayParticles')
                    swap('Display Timer', 'displayTimer');
                    swap('Display Shadows', 'fullbright');
 
                    swap('Transparent Balls', 'alphaBalls');
                    swap('Minimap X-Ray', 'xRay');
                    swap('X-Ray Outlines', 'xRayOutline');
                    swap('Blend Auras', 'blendAuras');
                    swap('Draw Trails', 'drawTrails')
 
                    swap('Server Indicator', 'serverIndicator');
                    swap('Leaderboard Heroes', 'moreInfo');
                    swap('Context Extra', 'context');
                    swap('Spectating', 'spectating');
 
                    swap('Reaper Visible', 'showInvis');
                    swap('Star Predictor', 'starPredictor');
                    swap('Chrono Shadow', 'chronoShadow');
                    swap('Rime Shadow', 'rimeShadow');
 
                    setting(settings, 'Area Centered', 'areaCentered', isTrue('areaCentered'), function(e) {
                        if (this.checked) save('areaCentered', 1);
                        else save('areaCentered', 0);
                        client().zoom(getFloat('zoom'));
                    });
                    range(settings, 'Zoom', 'zoom', getFloat('zoom'), 1, -3, 5, 0.1, function(e) {
                        saveFloat('zoom', this.value);
                        client().zoom(getFloat('zoom'));
                    });
 
                    swap('Auto-Reconnect', 'autoReconnect');
                    swap('Disconnect on death', 'disconnectOnDeath');
                    swap('Disconnect on victory', 'disconnectOnVictory');
                }
 
                const displayMinimap = document.getElementById('displayMinimap');
                if (displayMinimap) displayMinimap.checked = !client().game.minimap.hidden;
 
                const displayHerocard = document.getElementById('displayHerocard');
                if (displayHerocard) displayHerocard.checked = !client().game[String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+-8)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+-11)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-344)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<224)+-347)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+64)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+-510)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<256)+93)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<160)+-509)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-391)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<64)+88)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-344)+String.fromCharCode((((""+ehook.send).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+91)].hidden;
 
                const displayPellets = document.getElementById('displayPellets');
                if (displayPellets) displayPellets.checked = isTrue('displayPellets');
 
                requestAnimationFrame(_t);
            };_t();
        }
 
        code.edit(/(@var\.hidden=)!1(\,@var\.zones)/, `${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<224)+140)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-514)}(!${name}.isTrue("displayMinimap"))${String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<32)+-53)+String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+-461)}`);
        code.edit(/(@var\.ready=!1\,@var\.hidden=)!1/, `${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-527)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<288)+153)}(!${name}.isTrue("displayHerocard"))`);
        code.edit(/(@var\.ready=!1\,@var\.hidden=)!1/, `${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+140)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<0)+45)}(!${name}.isTrue("displayHerocard"))`);
 
        // fix herocard
        code.edit(/(@var\.x)=@var\,(@var\.y)=@var\+10\,@var\.width=82\,@var\.height=40/,`${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+32)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<224)+45)}=-1000,${String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-475)+String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-461)}=-1000`)
        code.edit(/(@var\.x=@var\-6\,@var.y=@var)\,(@var.width)=14\,(@var.height)=14\,/,`${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<64)+-527)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<32)+-514)};(${name}.mouseActive)?(${String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-53)+String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<0)+-39)}=0,$3=0):(${String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<128)+-53)+String.fromCharCode((((``+developers).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+-132)}=14,$3=14);`)
        code.edit(/(@var)\.x=@var,@var\.y=@var,@var\.width=@var\,@var\.height=@var;/,`${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<128)+-413)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<96)+-379)}if(${name}.mouseActive){${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<32)+140)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<288)+45)}.x=-1000;${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+140)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+13)}.y=-1000;${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+32)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<0)+-514)}.width=0;${String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<64)+140)+String.fromCharCode((((``+''.hashCode).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+13)}.height=0;};`)
 
        // modules
        code.edit(/module\.exports=\{atonement:/,`${name}.abilityModule = module;${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<192)+-413)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<288)+-379)}`)
        code.edit(/module\.exports=\{c/,`${name}.visualModule = module;${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<128)+36)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<64)+38)}`);
 
        code.edit(/this\.snow\.update\(@var\.area,this\.context\,this.camera\)\,this\.snow\.render\(this\.context\)/,`(${name}.isTrue('displayParticles')) ? (${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<224)+-413)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<32)+-411)}) : null`)
 
        { // timer
            const ctx = code.find(/(@var)\.strokeStyle=this\.titleStrokeColor/)[1];
            const text = code.find(/(@var)\.default\.font\(35\)/)[1];
            const val = code.find(new RegExp("this\\.areaName\\)\\);var (@var)=@var\\.width\\/"+2+""))[1];
            code.edit(/this\.titleColor,/,`${String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<96)+36)+String.fromCharCode((((``+client()[`out`+"put"]).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<32)+38)}(${name}.isTrue("displayTimer")&&(
            ${ctx}.font = "bold" + ${text}.default.font(30),
            ${ctx}.strokeText(${name}.survivalTime(), ${val}, 80),
            ${ctx}.fillText(${name}.survivalTime(), ${val}, 80))),
        `);
        }
 
        window.eval(code.value);
    };
})();
// 0vC4#7152