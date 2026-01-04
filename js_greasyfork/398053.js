// ==UserScript==
// @name         HVCounter
// @namespace    indefined
// @version      0.3.2
// @icon         https://hentaiverse.org/y/favicon.png
// @description  try to take over the world!
// @author       indefined
// @match        *://*.hentaiverse.org/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398053/HVCounter.user.js
// @updateURL https://update.greasyfork.org/scripts/398053/HVCounter.meta.js
// ==/UserScript==
(function(){
if(!document.getElementById('csp')) return;

if(document.readyState=='loading'||window._hvcounter) return;
window._hvcounter = Date.now();

var $d = document, $w = window, $lc = localStorage, $l = $d.location.href, $url = document.location.protocol + "//" + document.location.host + document.location.pathname.replace(/\/$/,'');

const isekai = location.pathname.match(/\/isekai\//i) ? 'Isekai' : '';

const defaultData = {
    battle: { all: 0, turn: 0, enc:0, ar:0, tw:0, rob:0, gf:0, iw:0, res:0 },
    riddle: {fail:0, pass:0},
    monster: { all: 0, mon: 0, boss: 0, sg: 0, tat: 0, dwd: 0, god: 0 },
    tok: { blo:0, sol:0, cha:0 },
    con: { scr:0, dra:0, inf:0, spe:0, sha:0 },
    equ: {},
    met: {met:0,woo:0,clo:0,lea:0,sha:0,rep:0,def:0,cry:0},
    sal: {},
    cry: 0,
    cre: 0,
    equC: 0,
    equS: 0,
    foo: 0,
    tro: 0,
    art: 0,
    drop:0,
    dropC: 0,
    exp: 0,
};

const dataHelper = {
    getLocal(key, defaultData, sub=isekai) {
        try {
            let data = JSON.parse(localStorage.getItem(key+sub)||'{}');
            for (var i in defaultData) {
                if (!data[i]) data[i] = defaultData[i];
                for (var j in defaultData[i]) if (!data[i][j]) data[i][j] = defaultData[i][j];
            }
            return data;
        } catch(e) {
            return defaultData
        }
    },
    saveLocal(key, data, sub = isekai) {
        localStorage.setItem(key+sub, JSON.stringify(data))
    },
    download(data, name, type) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([typeof(data)=='string' ? data : JSON.stringify(data, undefined, 4)]), type);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },
    saveExit() {
        dataHelper.saveLocal('hvCounter', storage);
        if (handler.logs != '') dataHelper.download(handler.logs, 'battleLog.txt', 'txt');
    },
};

const historyDB = {
    openDB(dbName = 'battleHistory', version = 1, onupgrade = historyDB.initDB) {
        return new Promise((resolve, reject)=>{
            if (this.db) return resolve(this.db);
            let request = indexedDB.open(dbName, version);
            request.onsuccess = function(event) {
                resolve(event.target.result);
            };
            request.onerror = function() {
                reject(request.error);
            };
            request.onupgradeneeded = function(event) {
                onupgrade(event.target.result);
            }
        });
    },

    initDB(db = this.db) {
        ['Isekai','Persistent'].forEach(key=>{
            let store = db.createObjectStore(key, {keyPath: 'in'});
            store.createIndex("battleName",'battleName');
            store.createIndex("round",'round');
            store.createIndex("turn",'turn');
        });
    },

    exportDB(limit, start=0, download) {
        return historyDB.getStore().then(transaction=>new Promise(async (resolve, reject)=>{
            const req = transaction.getAll(IDBKeyRange.lowerBound(new Date(start).getTime()), limit);
            req.onsuccess = ev=>{
                if (download) dataHelper.download(ev.target.result, 'battle.' + Date.now() + '.json', 'application/json');
                resolve(ev.target);
            };
            req.onerror = reject;
        }));
    },

    importDB() {
    },

    getStore(name = !isekai? 'Persistent' : 'Isekai'){
        return new Promise((resolve, reject)=>{
            resolve(historyDB.openDB().then(db=>db.transaction(name, 'readwrite').objectStore(name)));
        });
    },
    writeData(object) {
        return historyDB.getStore().then(transaction=>new Promise(async (resolve, reject)=>{
            const req = transaction.put(object);
            req.onsuccess = ev=>resolve(ev.target);
            req.onerror = reject;
        }));
    },
    getData(key) {
        return historyDB.getStore().then(transaction=>new Promise(async (resolve, reject)=>{
            const req = transaction.get(key);
            req.onsuccess = ev=>resolve(ev.target.result);
            req.onerror = reject;
        }));
    },
    getLastData(key, num = 1, index = 'battleName') {
        return historyDB.getStore().then(transaction=>new Promise(async (resolve, reject)=>{
            const req = transaction.index(index).openCursor(IDBKeyRange.only(key), 'prev');
            var i = 1, values = [];
            req.onsuccess = ev=> {
                var result = ev.target.result
                if (result) values.push(result.value);
                if (result && i++ < num) result.continue();
                else resolve(values);
            }
            req.onerror = reject;
        }));
    },
    getAllData(key, index = 'battleName') {
        return historyDB.getStore().then(transaction=>new Promise(async (resolve, reject)=>{
            const req = transaction.index(index).getAll(IDBKeyRange.only(key));
            req.onsuccess = ev=> resolve(ev.target.result);
            req.onerror = reject;
        }));
    },

    test(){
        historyDB.writeData({in:112345, round:123, turn: 12345}).then(console.log).catch(console.error);
        historyDB.writeData({in:112346, round:123, turn: 12345}).then(console.log).catch(console.error);
        historyDB.writeData({in:1123412, round:123, turn: 12345}).then(console.log).catch(console.error);
        historyDB.writeData({in:11234123434, round:123, turn: 12345, abc:12345}).then(console.log).catch(console.error);
        historyDB.getData(112345).then(console.log).catch(console.error);
        historyDB.getLastData(123).then(console.log).catch(console.error);
    },
};

window.historyDB = historyDB;

//historyDB.test();

let storage = dataHelper.getLocal('hvCounter', defaultData);

let monster;

function $i(n,p) {return ((p||$d).getElementById(n));}
function $q(n,p) {return ((p||$d).querySelector(n));}
function $qa(n,p) {return ((p||$d).querySelectorAll(n));}
function $e(n,a,p) {
    var e = $d.createElement(n);
    if (p !== undefined) {
        if (p.id) {e.id = p.id;}
        if (p.type) {e.type = p.type;}
        if (p.html) {e.innerHTML = p.html;}
        if (p.style) {e.style.cssText = p.style;}
        if (p.class) {e.className = p.class;}
        if (p.value) {e.value = p.value;}
        if (p.name) {e.name = p.name;}
        if (p.place) {e.placeholder = p.place;}
        if (p.check) {e.checked = p.check;}
        if (p.func) {e.setAttribute("func", p.func);}
    }
    if (a) {a.appendChild(e);}
    return e;
}

const counter = {
    initPanel(){
        this.panel = $d.createElement('div');
        this.panel.style = 'position: absolute;color: black; font-weight: bolder;top:2px;right:2px;text-align: right;height: calc(100% - 75px);';
        this.panel.id = 'hv-counter-panel';
        /*
        this.panel.onclick = ()=> this.showExtend();
        this.extend = $d.createElement('div');
        this.extend.style = 'position: absolute;color: black; font-weight: bolder;top:36px;left:calc(100% + 2px);text-align: left;width: max-content;';
        this.dmgD = this.extend.appendChild($d.createElement("div"));
        this.drop = this.extend.appendChild($d.createElement("div"));
        this.drop.onclick = ()=> this.extend.remove();
        */

        this.round = this.panel.appendChild($d.createElement("div"));
        this.round.style = 'margin-top:2px 0;';
        this.round.onclick = ()=> storage.last!=this.data&&this.init(storage.last);
        this.dmg = this.panel.appendChild($d.createElement("div"));
        this.dmg.onclick = ()=> this.showAllDmg();
        this.dmgD = this.dmg;
        this.drop = this.panel.appendChild($d.createElement("div"));
        this.drop.style = 'display:none;'
        this.drop.onclick = ()=> this.showData();
        this.item = this.panel.appendChild($d.createElement("div"));
        this.item.onclick = ()=> this.showDrop();
        this.skill = this.panel.appendChild($d.createElement("div"));
        this.effect = this.panel.appendChild($d.createElement("div"));
        this.bottom = this.panel.appendChild($d.createElement("div"));
        this.bottom.id = 'hv-counter-selector';
        this.bottom.style = 'position: absolute;bottom: 0px;right: 0;';
        this.bottom.innerHTML = '<style>#hv-counter-selector:hover>button{display:unset!important}#arena_list>tbody>tr>td:last-child>div:last-child {position: absolute;top: 7px;}</style>'
        let position = 0;
        this.bottom.onkeydown = function(ev){
            if(ev.key=='ArrowDown') {
                position -= 2;
                this.style.bottom = position + 'px';
                this.style.position = 'absolute';
            }
            else if(ev.key=='ArrowUp') {
                position += 2;
                this.style.bottom = position + 'px';
                this.style.position = 'absolute';
            }
            else if(ev.key=='ArrowRight') {
                position = 0;
                this.style.bottom = position + 'px';
                this.style.position = 'absolute';
            }
            else if(ev.key=='ArrowLeft') {
                this.style.position = '';
            }
            return false;
        };
        /*
        this.butDrop = this.bottom.appendChild($d.createElement("button"));
        this.butDrop.style = 'display:none';
        this.butDrop.innerHTML = 'Show Drop';
        this.butDrop.onclick = ()=> this.showDrop();
        this.butEnc = this.bottom.appendChild($d.createElement("button"));
        this.butEnc.innerHTML = 'Show Enc';
        this.butEnc.onclick = ()=>{};
        this.butAll = this.bottom.appendChild($d.createElement("button"));
        this.butAll.style = 'display:none';
        this.butAll.innerHTML = 'Show Logs';
        this.butAll.onclick = ()=> this.showAll();
        */
        this.turns = this.bottom.appendChild($d.createElement("button"));
        this.turns.style = 'width:max-content;';
        this.turns.onclick = ()=> this.showAll();
        this.css = $e("style", $d.head, {
            html: `
            div.btqs:after {content: attr(data-cd); z-index: 10; color: white; font-size: 26px; top: 2px; text-shadow: 0px 0px 10px black; display: block; position: inherit;}
            .bti3[data-cd]:before {content: attr(data-cd);float: left;}
            `
        });
        window.addEventListener('battleEnd', ()=>this.css.remove());
    },
    newBattle() {
        if(!storage.last) storage.days = (storage.days||0) + 1;
        else if(storage.last&&storage.last.in){
            const date = new Date(storage.last.in),
                  now = new Date();
            if(date.toLocaleDateString(undefined,{timeZone:'UTC'})!=now.toLocaleDateString(undefined,{timeZone:'UTC'})) {
                storage.days++;
            }
        }
        storage.isIn = true;
        storage.last = {
            handleTime: 0,
            in:Date.now(),
            lastTime: Date.now(),
            turn: 0,
            round: 0,
            mons: 0,
            start:storage.battle&&storage.battle.all||0,
            cooldown:{},
            effect: {},
            item: {All:0},
            skill: {All:0},
            drop:{},
            damage: {
                dealt:{attack:{hit:0,crit:0,dmg:0,parries:0,evades:0},spells:{hit:0,resist:0,evaded:0},dep:{hit:0,resist:0}},
                dealtType: {},
                taken:{total:0,count:0,pcount:0,ptotal:0,mcount:0,mtotal:0,parry:0,block:0,evade:0,resist:0,mblock:0,pblock:0,mevade:0,pevade:0,mparry:0,pparry:0},
                takenType: {},
            },
        };
        this.checkCooldown();
    },
    checkCooldown(){
        const cooldown = storage.last.cooldown
        Array.from(document.querySelectorAll('.btqs')).forEach((item,i)=>{
            let attr = item.getAttribute('onmouseover'),
                reg = attr&&attr.match(/battle.set_infopane_spell\('(.+?)', '.+?', '.+?', \d+?, \d+?, (\d+?)\)|battle.set_infopane_item\((\d+)\)/);
            if (!reg) return;
            if (+reg[2]) {
                if (cooldown[reg[1]]) cooldown[reg[1]].quickIdx = i;
                else cooldown[reg[1]] = {cds:reg[2],quickIdx:i,type:'spell'};
            }
            else if (+reg[3]) {
                let it = window.dynjs_itemc[reg[3]];
                if (it) {
                    if (cooldown[it.n]) cooldown[it.n].quickIdx = i;
                    else cooldown[it.n]={cds:41,quickIdx:i,type:'item'};
                }
            }
        });
        Array.from(document.querySelectorAll('#pane_item .bti3')).forEach((item,i)=>{
            let name = item.textContent.trim();
            if (cooldown[name]) cooldown[name].itemIdx = i;
            else cooldown[name] = {cds:41,itemIdx:i,type:'item'};
        });
    },
    endBattle() {
        if(storage.isIn) {
            storage.last.time = ((storage.last.lastTime - storage.last.in) / 1000 / 60).toFixed(1) + 'm';
            storage.last.round = storage.battle.all - storage.last.start;
            var lv = $i('level_readout');
            if (lv) lv = lv.textContent.match(/Lv.(\d+)/);
            if (lv) storage.last.level = lv[1];
            console.log('battle end',storage.last);
            storage.isIn = false;
            dataHelper.saveExit();
            this.init(storage.last);
        }
    },
    newRound(){
        var pl = $i("textlog").textContent,result;
        if(!storage.isIn || !storage.last || !storage.last.damage) {
            let last = storage.last;
            this.newBattle();
            console.log('new battle;last battle:', last, storage.last);
        }

        if(storage.last && storage.last.battle == pl) {
            storage.battle.res = (storage.battle.res||0) + 1;
            storage.last.effect.reload = (storage.last.effect.reload||0)+1;
            console.log('maybe this is a resume battle...',storage.last);
            this.checkCooldown();
        }
        else if(result=pl.match(/Initializing (.+)\n/)) {
            storage.last.battle = pl;
            delete storage.last.result;
            storage.last.round += 1;
            storage.battle.all += 1;
            if(result[1]=='random encounter ...') storage.battle.enc += 1;
            else if(result[1].includes('Item World')) storage.battle.iw += 1;
            else if(result[1].includes('(Round 1 / 1)')) storage.battle.rob += 1;
            else if(result[1].includes('The Tower')) storage.battle.tw = (storage.battle.tw||0)+1;
            else if(result[1].includes('arena challenge')) storage.battle.ar += 1;
            else if(result[1].includes('Grindfest')) storage.battle.gf += 1;
            //console.log(result[0],storage);

            //riddle master result
            if(pl.includes('You gain the effect Blessing of the RiddleMaster')) {
                storage.riddle.pass += 1;
                storage.last.effect.Riddle = (storage.last.effect.Riddle||0)+1
            }
            else if(pl.includes('The Riddlemaster listens to your answer')) {
                storage.riddle.fail += 1;
                storage.last.effect['Riddle Timeout'] = (storage.last.effect['Riddle Timeout']||0)+1;
            }

            //monster counter
            if(result=pl.match(/Monster [A-j]:.+?MID=\d+/g)) {
                var mons = storage.monster;
                mons.all += result.length;
                storage.last.mons += result.length;
                result.forEach(item=>{
                    switch(+item.match(/MID=(\d+)/)[1]){
                        case 16:case 17:case 18:case 19 :mons.boss += 1; break;//boss
                        case 20:case 21:case 22:case 23: mons.sg += 1; break;//Schoolgirls
                        case 27:case 28:case 29:case 30: mons.tat += 1; break;//Trio and the Tree
                        case 8223:case 8224:case 8225: mons.dwd += 1; break;//A Dance With Dragons
                        case 24:case 31:case 32: mons.god += 1; break;//Gods
                        default: mons.mon += 1; break;
                    }
                });
            }
        }
        else {
            console.log('maybe this is a resume battle...' ,storage.last);
            this.checkCooldown();
            storage.last.effect.reload = (storage.last.effect.reload||0)+1;
            storage.battle.res++;
            //$i('csp').insertAdjacentHTML('beforeend','<div style="position: absolute;top: 2px;right: 2px;border: 2px solid black;font-size: 27px;">'+(result&&result[0])+'</div>');
        }
        counter.init(storage.last);
    },
    init(data) {
        this.data = data;
        if(!this.panel) this.initPanel();
        let round = data&&data.battle,
            match;
        if(round && (match = round.match(/\d+.\/.\d+/))) {
            round = match[0];
            const rds = round.split(' / ');
            if(rds[0]!=rds[1]) {
                window.battle && (window.battle.battle_continue = function() {
                    fetch(location.href,{credentials: 'include'})
                        .then(res=>res.text())
                        .then(html=>{
                        let timmers = setTimeout(()=>{});
                        while(timmers-->0) clearTimeout(timmers);
                        var doc = (new DOMParser()).parseFromString(html, 'text/html');
                        document.body.innerHTML = doc.body.innerHTML;
                        window.battle = new window.Battle();
                        document.dispatchEvent(new Event('HVReload'));
                    }).catch(()=>(location.href = location.href+''));
                });
                if (window.common) {
                    window.common.goto_arena = function (){location.search.includes('?s=Battle&ss=ar') && (location = location.search) || (location = '?s=Battle&ss=ar')}
                    window.common.goto_itemworld = function (){location.search.includes('ss=iw&filter') && (location = location.search) || (location = '?s=Battle&ss=iw')}
                }
            }
        }
        if(round&&round.includes('random encounter ...')) round = 'RE';
        if (round) this.round.innerHTML = `<b style="width:max-content;border: 2px solid black;font-size: 30px;font-weight:500;">${round}</b>`;
        $i('csp')&&($i('csp').appendChild(this.panel));

        if(data) {
            this.showData();
            this.showCD();
        }
    },
    skills: Array.from(document.querySelectorAll('#table_skills .btsd')).map(item=>item.textContent),
    spells: Array.from(document.querySelectorAll('#table_magic .btsd')).map(item=>item.textContent),
    depes: ['Slowed','Imperiled','Weakened','Asleep','Confused','Blinded','Silenced','Magically Snared','Vital Theft'],
    weps: ['Bleeding Wound','Penetrated Armor','Stunned'],
    actionName:{
        'Spirit Stance Engaged': 'Spirit',
        'Insufficient overcharge or spirit for Spirit Stance.': 'Spirit FAIL',
        'Spirit Stance Disabled': 'Spirit OFF',
        'You gain the effect Defending.': 'Defend',
        'You gain the effect Focusing.': 'Focus',
    },
    effectName: {
        //'Your Spark of Life restores you from the brink of defeat.': 'Cloak of the Fallen',
        'You gain the effect Cloak of the Fallen.': 'Cloak of the Fallen',
        'You gain the effect Channeling.':'Channeling',
    },
    count(text) {
        if (!this.data) return;
        var damage = this.data.damage,
            effect = this.data.effect,
            skill = this.data.skill,
            item = this.data.item,
            tag, hit;

        switch(text) {
            case '':
                storage.battle.turn++;
                this.data.turn++;
                this.updateCD();
                break;
            //case 'Your Spark of Life restores you from the brink of defeat.':
            case 'You gain the effect Cloak of the Fallen.':
            case 'You gain the effect Channeling.':
                hit = this.effectName[text];
                if(!effect[hit]) effect[hit] = 0;
                effect[hit] += 1;
                break;
            case 'Spirit Stance Engaged':
            case 'Insufficient overcharge or spirit for Spirit Stance.':
            case 'Spirit Stance Disabled':
            case 'You gain the effect Defending.':
            case 'You gain the effect Focusing.':
                tag = this.actionName[text];
                if (!skill[tag]) skill[tag] = 0;
                skill[tag]++;
                skill.All++;
                break;
            case 'You are Victorious!':
                storage.battle.vic = (storage.battle.vic||0) + 1;
                storage.last.result = $i("textlog").innerHTML.match(/(.+?)<td class="tls">/)[0];
                break;
            case 'You have escaped from the battle.':
                storage.battle.run = (storage.battle.run||0) + 1;
                storage.last.result = $i("textlog").innerHTML.match(/(.+?)<td class="tls">/)[0];
                counter.appendDrop();
                if (this.data.turn <= 10) window.removeEventListener('beforeunload', dataHelper.saveExit);
                break;
            case 'You have been defeated.':
                storage.battle.fail = (storage.battle.fail||0) + 1;
                storage.last.result = $i("textlog").innerHTML.match(/(.+?)<td class="tls">/)[0];
                counter.appendDrop();
                break;
                break;
            case '':
                break;
            case '':
                break;
            case 'Slot is currently not usable.':
                tag = 'Item fail';
                if (!item[tag]) item[tag] = 0;
                item[tag]++;
                item.All++;
                break;
            default:
                if (hit = text.match(/You (evade|parry|block) the attack/)) {
                    damage.taken[hit[1]]++;
                    if (text.includes('casts ')) damage.taken['m'+hit[1]]++;
                    else if (text.includes('uses ')) damage.taken['p'+hit[1]]++;
                }
                // damage taken
                else if (hit = text.match(/ (hits|crits) you for (\d+) (\w+) damage/)){
                    var dmg = hit[2] * 1;
                    tag = hit[3];

                    // Spirit Shield
                    var absorb = text.match(/absorbs (\d+)/);
                    if (absorb) dmg += absorb[1] * 1;

                    damage.takenType[tag] = (damage.takenType[tag]||0) + dmg;
                    damage.taken.count++;
                    damage.taken.total += dmg;

                    if (!text.includes(" casts ")){
                        damage.taken.pcount++;
                        damage.taken.ptotal += dmg;
                    } else {
                        damage.taken.mcount++;
                        damage.taken.mtotal += dmg;
                    }
                    if (text.endsWith('resisted)')) damage.taken.resist++;
                }
                // damage deal
                else if (hit = text.match(/(evades|parries) your attack./)) {
                    damage.dealt.attack[hit[1]]++;
                }
                else if (hit = text.match(/fail to connect|evades your spell./)){
                    damage.dealt.spells.evaded++;
                }
                else if (hit = text.match(/^You (hit|crit) .+for (\d+) (\w+) damage/)){
                    dmg = +hit[2];
                    damage.dealt.attack[hit[1]]++;
                    damage.dealt.attack.dmg += dmg;
                    damage.dealtType[hit[3]] = (damage.dealtType[hit[3]]||0) + dmg;
                }
                else if (hit = text.match(/^(?:Your )?(.+) (hits|crits|blasts|counter) .+?for (\d+) (?:points of )?(?:(\w+) )?damage( \(\d+% resisted)?/)){
                    dmg = +hit[3];
                    if (hit[2]=='counter') {
                        hit[1] = 'counter';
                        hit[2] = 'hits';
                    }
                    else if (hit[1]=='Arcane Blow') {
                        skill[hit[1]] = (skill[hit[1]]||0)+1;
                    }
                    if (!hit[4]) hit[4] = 'dots';
                    if (!damage.dealt[hit[1]]) damage.dealt[hit[1]] = {hits:0,crits:0,blasts:0,dmg:0};
                    damage.dealt[hit[1]][hit[2]]++;
                    damage.dealt[hit[1]].dmg += dmg;
                    damage.dealtType[hit[4]] = (damage.dealtType[hit[4]]||0) + dmg;
                    if (this.spells.includes(hit[1])) {
                        damage.dealt.spells.hit++;
                        if (hit[5]) damage.dealt.spells.resist++;
                    }
                }

                else if(tag = text.match(/gains the effect (.+)\./)) {
                    tag = tag[1];
                    if (this.depes.includes(tag)) damage.dealt.dep.hit++;
                    else if (this.weps.includes(tag)) effect[tag] = (effect[tag]||0)+1;
                }

                else if (text.includes('resists your spell.')) {
                    damage.dealt.dep.resist++;
                }

                // スキル・アイテム・スペル
                else if (hit = text.match(/^You (use|cast) (.+)\./)){
                    tag = hit[2];
                    if(this.data.cooldown[tag]) this.data.cooldown[tag].cd = this.data.cooldown[tag].cds;
                    if (this.skills.includes(tag)){
                        // スキル
                        if (!skill[tag]) skill[tag] = 0;
                        skill[tag]++;
                        skill.All++;
                    } else if (hit[1] === "use"){
                        // アイテム
                        if (!item[tag]) item[tag] = 0;
                        item[tag]++;
                        item.All++;
                        this.updateCD(tag);
                    } else if (hit[1] === "cast"){
                        // スペル
                        if (!skill[tag]) skill[tag] = 0;
                        skill[tag]++;
                        skill.All++;
                    }
                }

                else if(text.match(/^Insufficient overcharge to use /)) {
                    tag = 'Skill Fail';
                    if (!skill[tag]) skill[tag] = 0;
                    skill[tag]++;
                    skill.All++;
                }

                else if(text.match(/^Cooldown is still pending for /)) {
                    tag = 'Spell Fail';
                    if (!skill[tag]) skill[tag] = 0;
                    skill[tag]++;
                    skill.All++;
                }

                else if(/^You gain (\d+) EXP!/.test(text)) {
                    if(!effect.exp) effect.exp = 0;
                    effect.exp += +RegExp.$1;
                    storage.exp += +RegExp.$1;
                    counter.appendDrop();
                }

                else if(tag = text.match(/^You gain ([\d\.]+) points of (.+) proficiency/)) {
                    hit = tag[2];
                    if(!effect[hit]) effect[hit] = 0;
                    effect[hit] = +(+tag[1]+effect[hit]).toFixed(3);
                }
                break;
        }

        this.data.lastTime = Date.now();
    },

    analysisDrop(drop) {
        const indexs = ['A89000','BA05B4','FF0000','461B7E','254117','0000FF','00B000','489EFF'];
        let drops = new Map();
        Object.entries(drop).forEach(([k,v])=>{
            var type = k.match(/#(.{6})/);
            type = type && type[1];
            var index = type ? indexs.indexOf(type) : 0;
            var num = k.match(/(?<=\[)(\d+)/) || [1];
            v = v*num[0];
            switch (index) {
                case 1:
                    k = k.replace(/\[(.+)\]/, '[Crystals]');
                    break;
                case 2:
                    if (/Low-|Mid-|Scrap|Energy Cell/.test(k)) {
                        k = k.replace(/\[(.+)\]/, '[Salvages]');
                    }
                    else if (!/High-|Crystallized Phazon|Shade Fragment|Repurposed Actuator|Defense Matrix Modulator|Magnificent|Legendary|Peerless/.test(k)) {
                        k = k.replace(/\[(.+)\]/, '[Lesser Equips]');
                    }
                    break;
                case 6:
                    if (k.includes('Infusion of')) {
                        k = k.replace(/\[(.+)\]/, '[Infusions]');
                    }/* else if (k.includes('Scroll of ')) {
                        k = k.replace(/\[(.+)\]/, '[Scrolls]');
                    } else if (/draug|potion|Elixir/i.test(k)) {
                        k = k.replace(/\[(.+)\]/, '[Potions]');
                    } else if (k.includes('Shard')) {
                        k = k.replace(/\[(.+)\]/, '[Shards]');
                    }*/
                    break;
                case 7:
                    k = k.replace(/\[(.+)\]/, '[Monster Foods]');
                    break;
                default:
                    k = k.replace(/(?<=\[)\d+x?\s?/i,'');
                    break;
            }
            k = k.replace('style="','style="order:'+index+';');
            if (drops.has(k)) drops.get(k).v += v;
            else drops.set(k, {k,v,index});
        });
        return Array.from(drops).map(a=>a[1]).sort((a,b)=>a.index-b.index||b.v-a.v||(a.k>b.k?1:-1));
    },

    appendDrop() {
        let result;
        if(result = $i('btcp')) {
            result.style = 'max-height: calc(100vh - 80px);height:auto;overflow: auto;font-weight:bold;display:block;';
            var res = document.createElement("div");
            res.style = "height:auto;padding-bottom:20px;";
            res.innerHTML = this.analysisDrop(storage.last.drop).map(a=>'<div>'+a.k+' X '+a.v+'</div>').join('');
            result.appendChild(res);
        }
    },
    countDrop(item) {
        //console.log(item)
        var a = item.textContent;
        if(!/Credits/i.test(a)) storage.drop++;
        var drop = this.data.drop;
        drop[item.outerHTML] = (drop[item.outerHTML]||0) + 1;
        var num = 0;
        switch (item.style.color) {
            case 'rgb(255, 0, 0)':
                var grade;
                if (/Peer|Legen|Magn|Exqu|Supe|Aver|Crud|Fair/.test(a)) {
                    grade = a.slice(1,4).toLocaleLowerCase();
                    storage.equ[grade] = (storage.equ[grade]||0) + 1;
                }
                else if (item.previousSibling.data.endsWith('dropped ')) {
                    if (/High-Grade/.test(a)) {
                        grade = 'hig';
                    }
                    else {
                        grade = a.slice(1,4).toLocaleLowerCase();
                    }
                    storage.met[grade]++;
                }
                else {
                    storage.drop--;
                    grade = a.slice(7,10).toLocaleLowerCase();
                    storage.sal[grade] = (storage.sal[grade]||0)+1;
                }
                break;
            case 'rgb(0, 176, 0)':
                if(a.includes('Scroll')) storage.con.scr += 1;
                else if(/draug|potion|Elixir/i.test(a)) storage.con.dra += 1;
                else if(/Infusion/i.test(a)) storage.con.inf += 1;
                else if(/Bubble-Gum|Flower Vase/i.test(a)) storage.con.spe += 1;
                else if(a.includes('Shard')) storage.con.sha += 1;
                break;
            case 'rgb(37, 65, 23)':
                if(a.includes('Fragments')) storage.tok.sol += 1;
                else if(a.includes('Chaos')) storage.tok.cha += 1;
                else if(a.includes('Blood')) storage.tok.blo += 1;
                break;
            case 'rgb(0, 0, 255)':
                storage.art++;
                break;
            case 'rgb(70, 27, 126)':
                storage.tro++;
                break;
            case 'rgb(72, 158, 255)':
                storage.foo++;
                break;
            case 'rgb(168, 144, 0)':
                num = parseInt(item.textContent.match(/\d+/)) || 0;
                if (item.previousSibling.data == 'A traveling salesmoogle gives you ') {
                    storage.equC += num;
                    storage.equS ++;
                }
                else {
                    storage.cre += num;
                    storage.dropC ++;
                }
                break;
            case 'rgb(186, 5, 180)':
                storage.cry++;
                break;
            default:
                console.log(item.style.color, item.textContent, item.outerHTML)
                alert();
        }
    },
    updateCD(itemUse) {
        for(var i in this.data.cooldown) {
            let item = this.data.cooldown[i];
            if (itemUse) {
                if(item.type!='item'&&item.cd>=0) {
                    item.cd++;
                }
            }
            else if(item.cd>=0) {
                item.cd--;
            }
        }
    },
    showCD() {
        const bt = $i('quickbar'),
              its =document.querySelectorAll('#pane_item .bti3');
        if(!bt) return;
        for(var num in this.data.cooldown) {
            var d = this.data.cooldown[num];
            if(d.cd>0) {
                if (bt.children[d.quickIdx]) bt.children[d.quickIdx].dataset.cd = d.cd;
                if (d.itemIdx && its[d.itemIdx]) its[d.itemIdx].dataset.cd = d.cd;
            }
        }
    },
    showAll(){
        var main = $i('mainpane');
        if(!main) return;

        if(main.style.display=='none') {
            main.style.display = '';
            this.logPanel.style.display = 'none';
            return;
        }
        else if(this.logPanel) {
            main.style.display = 'none';
            this.logPanel.style.display = 'flex';
            return;
        }

        var logPanel = this.logPanel = $i('csp').appendChild($d.createElement("div"));
        logPanel.style = 'display: flex;text-align: left;flex-wrap: wrap;margin: 50px 100px;';
        var data = storage;
        var table;
        var p = function(x) {return (x * 100 / all).toFixed(2) + "%";};
        var t = function(x) {
            if (!x) return 0;
            else if (+x) return x;
            else if (x.all) return x.all;
            return Object.values(x).reduce((a,b)=>a+b,0);
        }

        var c = data.battle||{}, all = t(c);
        table = document.createElement("div");
        table.style = 'width: 30%; padding: 1em 0;';
        table.innerHTML = "<table><tbody>"+
            "<tr><th>Total Battles</th><th>"+all+"</th><td>"+Math.round(all/storage.days)+"r/d</td></tr>"+
            "<tr><td>The Arena</td><td>"+c.ar+"</td><td>"+p(c.ar)+"</td></tr>"+
            "<tr><td>Ring of Blood</td><td>"+c.rob+"</td><td>"+p(c.rob)+"</td></tr>"+
            "<tr><td>GrindFest</td><td>"+c.gf+"</td><td>"+p(c.gf)+"</td></tr>"+
            "<tr><td>Item World</td><td>"+c.iw+"</td><td>"+p(c.iw)+"</td></tr>"+
            (!!isekai?
             "<tr><td>The Tower</td><td>"+c.tw+"</td><td>"+p(c.tw)+"</td></tr>":
             "<tr><td>Encounter</td><td>"+c.enc+"</td><td>"+p(c.enc)+"</td></tr>"
            )+
            "<tr><td>Victorious</td><td>"+(c.vic||0)+"</td><td>"+p(c.vic||0)+"</td></tr>"+
            "<tr><td>Escaped</td><td>"+(c.run||0)+"</td><td>"+p(c.run||0)+"</td></tr>"+
            "<tr><td>Defeated</td><td>"+(c.fail||0)+"</td><td>"+p(c.fail||0)+"</td></tr>"+
            "<tr><td>Total Turns</td><td>"+(c.turn||0)+"</td><td>"+(c.turn/all).toFixed(1)+"t/r</td></tr>"+
            "<tr><td>Credits Drops</td><td>"+(data.cre||0)+"</td><td>"+Math.floor(data.cre/all)+"c/r</td></tr>"+
            "<tr><td>Equips Solds</td><td>"+(data.equC||0)+"</td><td>"+Math.floor(data.equC/data.equS)+"c/e</td></tr>"+
            "</tbody></table>";
        logPanel.appendChild(table);

        c = data.monster||{}; all = t(c);
        table = document.createElement("div");
        table.style = 'width: 30%; padding: 1em 0;';
        var html = "<table><tbody>"+
            "<tr><th>Monsters</th><th>"+all+"</th><td>"+(all/t(data.battle)).toFixed(2)+"/r</td></tr>"+
            "<tr><td>Common</td><td>"+c.mon+"</td><td>"+p(c.mon)+"</td></tr>"+
            "<tr><td>Boss</td><td>"+c.boss+"</td><td>"+p(c.boss)+"</td></tr>"+
            "<tr><td>Schoolgirls</td><td>"+c.sg+"</td><td>"+p(c.sg)+"</td></tr>"+
            "<tr><td>Goddess</td><td>"+c.tat+"</td><td>"+p(c.tat)+"</td></tr>"+
            "<tr><td>Dragons</td><td>"+c.dwd+"</td><td>"+p(c.dwd)+"</td></tr>"+
            "<tr><td>Gods</td><td>"+c.god+"</td><td>"+p(c.god)+"</td></tr>"+
            "<tr><td>Credits Drops</td><td>"+data.dropC+"</td><td>"+p(data.dropC)+"</td></tr>"+
            "<tr><td>Other Drops</td><td>"+data.drop+"</td><td>"+p(data.drop)+"</td></tr>"+
            "</tbody>";
        c = data.riddle||{}; all = t(c);
        html += "<tbody>"+
            "<tr><th>Total Riddle</th><th>"+all+"</th><td>"+(all * 100 / t(data.battle)).toFixed(2)+"%</td></tr>"+
            "<tr><td>Pass</td><td>"+c.pass+"</td><td>"+p(c.pass)+"</td></tr>"+
            "<tr><td>Timeout</td><td>"+c.fail+"</td><td>"+p(c.fail)+"</td></tr>"+
            "</tbody></table>";

        table.innerHTML = html;
        logPanel.appendChild(table);

        c = data||{}; all = c.drop;
        table = document.createElement("div");
        table.style = 'width: 30%; padding: 1em 0;';
        html = "<table><tbody>"+
            "<tr><th>Total Drops</th><th>"+t(c.drop)+"</th><td>"+(all/t(data.battle)).toFixed(2)+"/r</td></tr>"+
            "<tr><td>Crystals</td><td>"+t(c.cry)+"</td><td>"+p(t(c.cry))+"</td></tr>"+
            "<tr><td>Consumables</td><td>"+t(c.con)+"</td><td>"+p(t(c.con))+"</td></tr>"+
            "<tr><td>Monster Foods</td><td>"+t(c.foo)+"</td><td>"+p(t(c.foo))+"</td></tr>"+
            "<tr><td>Equipments</td><td>"+t(c.equ)+"</td><td>"+p(t(c.equ))+"</td></tr>"+
            "<tr><td>Trophies</td><td>"+t(c.tro)+"</td><td>"+p(t(c.tro))+"</td></tr>"+
            (!!isekai?
            "<tr><td>Materials</td><td>"+t(c.met)+"</td><td>"+p(t(c.met))+"</td></tr>":
            "<tr><td>Artifacts</td><td>"+t(c.art)+"</td><td>"+p(t(c.art))+"</td></tr>"
            )+
            "</tbody>";

        c = data.tok||{}; all = t(c) - (c.sol||0);
        html += "<tbody>"+
            "<tr><th>Tokens</th><th>"+(all+(c.sol||0))+"</th><td>"+(t(c) * 100 / data.drop).toFixed(2)+"%</td></tr>"+
            "<tr><td>Token of Blood</td><td>"+c.blo+"</td><td>"+p(c.blo)+"</td></tr>"+
            "<tr><td>Chaos Token</td><td>"+c.cha+"</td><td>"+p(c.cha)+"</td></tr>"+
            "<tr><td>Soul Fragments</td><td>"+(c.sol)+"</td><td>"+(c.sol * 100 / (data.battle&&data.battle.enc||c.sol)).toFixed(2)+"%</td></tr>"+
            "</tbody></table>";
        table.innerHTML = html;
        logPanel.appendChild(table);

        var cur = data.equ||{}; all = t(cur);
        table = document.createElement("div");
        table.style = 'width: 30%; padding: 1em 0;';
        table.innerHTML = "<table><tbody>"+
            "<tr><th>Equipments</th><th>"+all+"</th><td>"+(all * 100 / data.drop).toFixed(2)+"%</td></tr>"+
            "<tr><td>Average</td><td>"+cur.ave+"</td><td>"+p(cur.ave)+"</td></tr>"+
            "<tr><td>Superior</td><td>"+cur.sup+"</td><td>"+p(cur.sup)+"</td></tr>"+
            "<tr><td>Exquisite</td><td>"+cur.exq+"</td><td>"+p(cur.exq)+"</td></tr>"+
            "<tr><td>Magnificent</td><td>"+cur.mag+"</td><td>"+p(cur.mag)+"</td></tr>"+
            "<tr><td>Legendary</td><td>"+cur.leg+"</td><td>"+p(cur.leg)+"</td></tr>"+
            "<tr><td>Peerless</td><td>"+cur.pee+"</td><td>"+p(cur.pee)+"</td></tr>"+
            "</tbody></table>";
        logPanel.appendChild(table);

        c = data.con||{}; all = t(c);
        table = document.createElement("div");
        table.style = 'width: 30%; padding: 1em 0;';
        table.innerHTML = "<table><tbody>"+
            "<tr><th>Consumables</th><th>"+all+"</th><td>"+(all * 100 / data.drop).toFixed(2)+"%</td></tr>"+
            "<tr><td>Restoratives</td><td>"+c.dra+"</td><td>"+p(c.dra)+"</td></tr>"+
            "<tr><td>Scrolls</td><td>"+c.scr+"</td><td>"+p(c.scr)+"</td></tr>"+
            "<tr><td>Infusions</td><td>"+c.inf+"</td><td>"+p(c.inf)+"</td></tr>"+
            "<tr><td>Shards</td><td>"+c.sha+"</td><td>"+p(c.sha)+"</td></tr>"+
            "<tr><td>Specials</td><td>"+c.spe+"</td><td>"+p(c.spe)+"</td></tr>"+
            "</tbody></table>";
        logPanel.appendChild(table);

        c = data.met||{}; all = t(c);
        table = document.createElement("div");
        table.style = 'width: 30%; padding: 1em 0;';
        table.innerHTML = "<table><tbody>"+
            "<tr><th>Materials</th><th>"+all+"</th><td>"+(all * 100 / data.drop).toFixed(2)+"%</td></tr>"+
            (c.low? (
            "<tr><td>Low-Grade</td><td>"+c.low+"</td><td>"+p(c.low)+"</td></tr>"+
            "<tr><td>Mid-Grade</td><td>"+c.mid+"</td><td>"+p(c.mid)+"</td></tr>"
            ) : '') +
            "<tr><td>High-Grade Mats</td><td>"+c.hig+"</td><td>"+p(c.hig)+"</td></tr>"+
            "<tr><td>Crystallized Phazon</td><td>"+c.cry+"</td><td>"+p(c.cry)+"</td></tr>"+
            "<tr><td>Shade Fragment</td><td>"+c.sha+"</td><td>"+p(c.sha)+"</td></tr>"+
            "<tr><td>Repurposed Actuator</td><td>"+c.rep+"</td><td>"+p(c.rep)+"</td></tr>"+
            "<tr><td>Defense Matrix Modulator</td><td>"+c.def+"</td><td>"+p(c.def)+"</td></tr>"+
            "</tbody></table>";
        all && logPanel.appendChild(table);

        main.style.display = 'none';
    },
    getShowList(data,total) {
        if (!data) return '';
        let sorts = Object.entries(data).sort(([a1,b1],[a2,b2])=>(b2-b1)||a2.localeCompare(a1));
        if(total) sorts = sorts.map(([k,v])=>([k,Math.floor(v / total * 100)])).filter(([k,v])=>v>=5).map(([k,v])=>([k,v+'%']));
        return sorts.map(([k,v])=>`${k}: ${v}`).join('</br>');
    },
    showExtend(){
        $i('csp')&&($i('csp').appendChild(this.extend));
        this.showDrop();
        this.showAllDmg();
    },
    showDrop(){
        var last = this.data;
        if(!last||(!last.all&&!last.drop&&!last.damage)) return;
        this.drop.style.display = 'block';
        this.drop.innerHTML = "<b style=\"color:red\">[Drops]</b><br>" + this.analysisDrop(last.all||last.drop.all||last.drop).map((a)=>`${a.k}: ${a.v}`).join('</br>');
    },
    showAllDmg(){
        this.showData();
        let dealt = this.data&&this.data.damage&&this.data.damage.dealt,
            taken = this.data&&this.data.damage&&this.data.damage.taken;
        if(!dealt||!taken) return;
        let attack = dealt.attack,
            spells = dealt.spells,
            dep = dealt.dep || {hit:0,resist:0},
            attacks = attack.hit+attack.evades+attack.crit+attack.parries,
            dmgs = Object.values(dealt).reduce((a,b)=>a+(b.dmg||0),0),
            ptaken = taken.parry+taken.pcount,
            btaken = ptaken+taken.block+taken.mcount,
            mtaken = spells.evaded+spells.hit+dep.hit+dep.resist,
            ataken = btaken+taken.evade
        ;
        this.dmg.innerHTML += [' ',
            taken.evade&&`evade: ${(taken.evade/ataken*100).toFixed(1)}%`,
            taken.block&&`block: ${(taken.block/btaken*100).toFixed(1)}%`,
            taken.parry&&`parry: ${(taken.parry/ptaken*100).toFixed(1)}%`,
            taken.resist&&`resist: ${(taken.resist/taken.mcount*100).toFixed(1)}%`,
            "<b style=\"color:red\">[Damage Dealt]</b>",
            attack.parries&&attack.hit&&`parried: ${(attack.parries/attacks*100).toFixed(1)}%`,
            attack.evades&&attack.hit&&`pevaded: ${(attack.evades/attacks*100).toFixed(1)}%`,
            spells.evaded&&`mevaded: ${(spells.evaded/mtaken*100).toFixed(1)}%`,
            spells.resist&&`spell resisted: ${(spells.resist/spells.hit*100).toFixed(1)}%`,
            dep.resist&&`depr resisted: ${(dep.resist/(dep.hit+dep.resist)*100).toFixed(1)}%`,
            ...Object.entries(dealt).sort((a,b)=>{
                if (!isNaN(b[1])) return -1;
                return b[1].dmg - a[1].dmg;
            }).map(([k,v])=>{
                if (!isNaN(v)) {
                    return `${k}: ${v}`;
                }
                if (!v.dmg) return;
                var crit = v.crits|v.crit|v.blasts, total = (v.hits|v.hit)+crit;
                return `${k.replace(k[0],k[0].toUpperCase())}: ${(v.dmg/dmgs*100).toFixed(1)}%/${Math.floor(crit/total*100)}%`
            })
        ].filter(i=>i).join('</br>');
    },
    showData() {
        if (!this.data) return;
        var last = this.data,
            damage = last.damage||last.used,
            taken = damage&&damage.taken||damage||{},
            turn = last.turn,
            round = last.round;
        if(!damage) return;
        var avg = "0", pavg = "0", mavg = "0";
        if (taken.count) avg = Math.floor(taken.total / taken.count);
        if (taken.pcount) pavg = Math.floor(taken.ptotal / taken.pcount);
        if (taken.mcount) mavg = Math.floor(taken.mtotal / taken.mcount);

        this.dmg.innerHTML = "<b style=\"color:red\">[Damage]</b><br>Avg: " + avg + " (" + pavg + " / " + mavg + ") <br>" + this.getShowList(damage.takenType||damage.dmg, taken.total);

        this.item.innerHTML = "<b style=\"color:red\">[Used Item]</b><br>" + this.getShowList(last.item||damage.item);

        this.skill.innerHTML = "<b style=\"color:red\">[Skill & Spell]</b><br>" + this.getShowList(last.skill||damage.skill);

        this.effect.innerHTML = "<b style=\"color:red\">[Effect]</b><br>" + this.getShowList(last.effect||damage.skill);

        this.drop.style.display = 'none';

        var totalTime = ((last.lastTime||damage.lastTime) - last.in) / 1000;
        var hour = Math.floor(totalTime / 3600);
        var min = Math.floor((totalTime-(hour*3600)) / 60);
        var sec = Math.floor((totalTime-(hour*3600)-(min*60)));
        var timeValue = String(hour+100).slice(1) + ":" + String(min+100).slice(1) + ":" + String(sec+100).slice(1);
        this.turns.innerHTML = turn + " turns/" + round + " rounds<br>" + timeValue + " (" + (turn/totalTime).toFixed(2) + " t/s)";
    },
    handleHistoryResult(data) {
        let result;
        try {
            result = dataHelper.getLocal('hvHistory');
        }
        catch(e) {
            result = {};
        }
        if(data&&data.battle) {
            delete data.cooldown;
            let match = data.battle.match(/Initializing (.+)/);
            if(match) {
                if(match[1].match(/arena challenge (#\d+)/)) {
                    if(result[RegExp.$1]) data.lastTurns = result[RegExp.$1].turn;
                    data.battleName = RegExp.$1;
                    result[RegExp.$1] = data;
                }
                else if(match[1].includes('Grindfest')) {
                    data.battleName = 'gf';
                    result.gf = data;
                }
                else if(match[1].includes('Item World')) {
                    data.battleName = 'iw';
                    result.iw = data;
                }
                else if(match[1].includes('The Tower')) {
                    data.battleName = 'tw';
                    result.tw = data;
                }
                else {
                    //if(match[1]=='random encounter ...'){}
                    if(result[match[1]]) data.lastTurns = result[match[1]].turn;
                    data.battleName = match[1];
                    result[match[1]] = data;
                }
                dataHelper.saveLocal('hvHistory', result);
                historyDB.writeData(data).then(console.log).catch(console.error);
                if (data.effect?.exp) {
                    let exp = dataHelper.getLocal(isekai?'hvuti_exp':'hvut_exp', 0, '');
                    exp += data.effect.exp;
                    dataHelper.saveLocal(isekai?'hvuti_exp':'hvut_exp', exp, '');
                }
            }
        }
        return result;
    },
    hide() {
        document.head.insertAdjacentHTML('beforeend', '<style>#arena_pages,#networth,#equipworth,.hvut-bt-div,#hv-counter-panel,#battle_stats_ex,#change-translate,.hvut-top-message{display:none}</style>');
    },
    exportRiddle() {
        const data = dataHelper.getLocal('riddle', '');
        dataHelper.download(data, `riddle.${Date.now()}.json`, 'json');
    },
    handleExp(){
        const exp = {level:500, bottom: 10e12-1,now: 10e12-1+dataHelper.getLocal(isekai?'hvuti_exp':'hvut_exp')},
              level = +$i('level_readout').textContent.match(/\d+$/);
        if (!exp.now || level != 500) return;
        do {
            exp.up = Math.round(Math.pow(exp.level+3, Math.pow(2.850263212287058, (1+exp.level/1000))));
        } while(exp.now > exp.up && (exp.bottom = exp.up) && exp.level++);
        exp.level--;
        exp.level_up = exp.up - exp.bottom;
        exp.level_now = exp.now - exp.bottom;
        exp.next = exp.up - exp.now;
        exp.p = Math.round(exp.level_now/exp.level_up*1000)/10;
        $i('level_details').innerHTML = `<div style="width: max-content;height: auto;">
                <p>Total: ${exp.now.toLocaleString()} / ${exp.up.toLocaleString()}</p>
                <p>Next: ${exp.next.toLocaleString()}</p>
                <p>Lv.${exp.level}: ${exp.level_now.toLocaleString()} / ${exp.level_up.toLocaleString()} (${exp.p}%)</p>
                <style>div:hover>#level_details {visibility: visible;}</style></div>`;
        if ($i('hvut-top')) {
            const top = $q('#hvut-top>div:nth-child(4)');
            if (top && top.textContent == 'Lv.500') {
                top.firstChild.textContent = "Lv." + (exp.level);
                top.insertAdjacentHTML('beforeend', `<div class="hvut-top-sub">
                <div>Total: ${exp.now.toLocaleString()} / ${exp.up.toLocaleString()}</div>
                <div>Next: ${exp.next.toLocaleString()}</div>
                <div>Level: ${exp.level_now.toLocaleString()} / ${exp.level_up.toLocaleString()} (${exp.p}%)</div>
                <div style="width:299px;height: 8px; margin: 0px auto; border: 1px solid; background-color: rgb(255, 255, 204);
                background-image: linear-gradient(to right, rgb(153, 51, 0) 0px, transparent 1px), linear-gradient(to right, rgb(153, 204, 255), rgb(153, 204, 255));
                background-position: -1px 0px, 0px 0px; background-size: 30px, ${exp.p}%; background-repeat: repeat, no-repeat;"></div>
                </div>`);
            }
        }
    },
    async showHistory() {
        if(storage.isIn) {
            counter.endBattle();
            counter.handleHistoryResult(storage.last);
        }

        if($i('arena_list')) {
            counter.init(storage.last);
            const list = $i('arena_list'),
                  robKeys = [ '#104', '#105', '#106', '#107', '#108', '#109', '#110', '#111', '#112', ],
                  arKeys = {
                      "Lv. 1": "#1",
                      "Lv. 10": "#3",
                      "Lv. 20": "#5",
                      "Lv. 30": "#8",
                      "Lv. 40": "#9",
                      "Lv. 50": "#11",
                      "Lv. 60": "#12",
                      "Lv. 70": "#13",
                      "Lv. 80": "#15",
                      "Lv. 90": "#16",
                      "Lv. 100": "#17",
                      "Lv. 110": "#19",
                      "Lv. 120": "#20",
                      "Lv. 130": "#21",
                      "Lv. 140": "#23",
                      "Lv. 150": "#24",
                      "Lv. 165": "#26",
                      "Lv. 180": "#27",
                      "Lv. 200": "#28",
                      "Lv. 225": "#29",
                      "Lv. 250": "#32",
                      "Lv. 300": "#33",
                      "Lv. 400": "#34",
                      "Lv. 500": "#35"
                  },
                  arMons = {
                      "Lv. 1": "<div>2</div>",
                      "Lv. 10": "<div>6</div>",
                      "Lv. 20": "<div>14</div>",
                      "Lv. 30": "<div>30</div>",
                      "Lv. 40": "<div>42</div>",
                      "Lv. 50": "<div>68</div>",
                      "Lv. 60": "<div>82</div>",
                      "Lv. 70": "<div>109</div>",
                      "Lv. 80": "<div>136</div>",
                      "Lv. 90": "<div>162</div>",
                      "Lv. 100": "<div>172<span style=\"color:orange\">+1</span></div>",
                      "Lv. 110": "<div>216<span style=\"color:orange\">+1</span></div>",
                      "Lv. 120": "<div>281<span style=\"color:orange\">+1</span></div>",
                      "Lv. 130": "<div>311<span style=\"color:orange\">+1</span></div>",
                      "Lv. 140": "<div>295<span style=\"color:orange\">+2</span></div>",
                      "Lv. 150": "<div>293<span style=\"color:orange\">+3</span></div>",
                      "Lv. 165": "<div>404<span style=\"color:red\">+1</span></div>",
                      "Lv. 180": "<div>375<span style=\"color:orange\">+1</span><span style=\"color:red\">+1</span></div>",
                      "Lv. 200": "<div>394<span style=\"color:purple\">+4</span></div>",
                      "Lv. 225": "<div>323<span style=\"color:red\">+53</span><span style=\"color:orange\">+2</span></div>",
                      "Lv. 250": "<div>218<span style=\"color:red\">+125</span><span style=\"color:orange\">+3</span></div>",
                      "Lv. 300": "<div>357<span style=\"color:red\">+179</span><span style=\"color:purple\">+3</span></div>",
                      "Lv. 400": "<div>375<span style=\"color:red\">+188</span><span style=\"color:purple\">+6</span></div>",
                      "Lv. 500": "<div>480<span style=\"color:red\">+198</span><span style=\"color:purple\">+9</span></div>"
                  },
                  history = counter.handleHistoryResult();
            window.historyStorage = history;
            for (let i=1;i<list.rows.length;i++){
                const row = list.rows[i],
                      lv = row.cells[2].textContent,
                      round = row.cells[3].textContent,
                      mon = arMons[lv],
                      h = history[round=='1'?robKeys[i]:arKeys[lv]];
                if(round != 1 && mon) {
                    row.cells[3].children[0].insertAdjacentHTML('beforeend',mon);
                }
                if(h) {
                    let t = h.turn-h.lastTurns;
                    if(t>=0) t = '+'+t;
                    row.cells[0].children[0].insertAdjacentHTML(
                        'beforeend',
                        `<div>【${new Date(h.in).toLocaleDateString()}】${h.turn}t${t?`/${t}t`:''}${h.round!=row.cells[3].textContent?`/${h.round}r`:''}/${h.time}`
                    );
                    row.onclick = ()=>{
                        counter.init(h);
                        console.log(h, `\n${h.effect["cloth armor"]}\t${h.damage.dealt.spells.evaded}\t${h.damage.dealt.spells.hit}\t${h.damage.dealt.dep.hit}\t${h.damage.dealt.dep.resist}\n`);
                    };
                }
            }
        }
        else if($i('grindfest')) {
            counter.init(counter.handleHistoryResult().gf);
        }
        else if($i('towerstart')) {
            counter.init(counter.handleHistoryResult().tw);
        }
        else if($i('itemworld_outer')) {
            counter.init(counter.handleHistoryResult().iw);
        }
    }
};


const megaType = localStorage.megaType;
const handler = {
    newCss() {
        var css = (
            ''
            //display turn line; disable monster and finsh panel select to avoid unexpect drop
            +'td.tls {background: black;}#battle_right *,#battle_top * {user-select:none !important}div.btm6{width:unset!important; min-width: 198px; padding-bottom: 1px !important}'

            // gems in action bar
            +'#pane_vitals [onmouseover]{position: absolute;right: -7px;top: 30px;cursor:pointer}'
            +'#pane_vitals [onmouseover]:before{content:"";position:absolute;z-index:5;height:34px;width:34px;top:3px;left:3px;color:white;text-align:left}'
            +'#pane_vitals [onmouseover]:after{content:"";background:url("y/ab/b.png") no-repeat;position:absolute;z-index:6;height:46px;width:46px;top:-4px;left:-5px;color:white;text-align:left}'
            +'#pane_vitals [onmouseover*="(10005)"]:before{background:url("y/e/healthpot.png") no-repeat}'
            +'#pane_vitals [onmouseover*="(10006)"]:before{background:url("y/e/manapot.png") no-repeat}'
            +'#pane_vitals [onmouseover*="(10007)"]:before{background:url("y/e/spiritpot.png") no-repeat;background-color:green}'
            +'#pane_vitals [onmouseover*="(10008)"]:before{background:url("y/e/channeling.png") no-repeat}'

            //battle panel height adjacent, 657px vh onliy
            + '@media (max-height: 657px) {'
            +'#hv-counter-panel{height: calc(100% - 10px)!important;}div#csp{height: 100%;}'
            +'div#mainpane,div#battle_left{height: 635px}div.bttp {height: 330px;}div#expholder {top: 100%;}'
            +'div#battle_right {height: 609px;}div#cfgbutton{top: 633px}'
            + '}'

            //effect duration
            //+ '#pane_effects div, .btm6 div {display:none}'
            +'.btqs.b-yellow{background:yellow}'
            +'img[onmouseover]+span[data-cd]:before {content: attr(data-cd);position: absolute;margin-left: -29px;color: white;background: red;border-radius: 5px;padding: 0 3px;}'
            +'img[onmouseover]+span[data-x]:after {content: attr(data-x);position: absolute;margin-left: -29px;bottom: 1px;color: white;background: black;border-radius: 5px;padding: 0 3px;}'

            //monster number instead of letter
            +'div.btm2 img {display: none;}#pane_monster { counter-reset: monsters; } #mkey_0 .btm2 { counter-reset: monsters -1; }'
            +'div.btm2>div:first-child:after {counter-increment: monsters; content: counter(monsters);font-size: 28px;font-weight:bold;}'
        );
        //monster hp
        var result = $i("textlog").textContent.match(/Monster [A-j]:.+?HP=\d+/g)
        if(result) {
            var monMap = {A:'mkey_1',B:'mkey_2',C:'mkey_3',D:'mkey_4',E:'mkey_5',F:'mkey_6',G:'mkey_7',H:'mkey_8',I:'mkey_9',J:'mkey_0'};
            result.forEach((item,idx)=>{
                var mo = item.match(/Monster ([A-J]): MID=(\d+) \((.+)\) .+? HP=(\d+)/);
                if (!mo) return;
                var moN = mo[1],moH = mo[4];
                //console.log(moN,moH)
                css += '#'+monMap[moN]+' .btm5:first-child>.chbd:before {content: "'+moH+'"; position: absolute; z-index: 222; color: white; right: 6px;}';
                if (mo[3].match(/Nepnep|NepNep|Sony Ericsson|Sony Xperia|Nokia|Motorola|Samsung |Siemens /)) {
                    css += '#'+monMap[moN] + ' .btm3 {background: red}';
                    if (!monster) monster = dataHelper.getLocal('monster', [], '');
                    monster.push(item);
                }
            });
        }
        this.css = $e("style", $d.body, {html: css});
        window.addEventListener('battleEnd', ()=>this.css.remove());
    },
    handleGem() {
        //get the gem outsite
        var pv = $i('pane_vitals'),gemDiv=this.gemDiv;
        if(!pv) return;
        if (!gemDiv) {
            gemDiv = this.gemDiv = $d.createElement('div');
            gemDiv.onclick = ()=>{
                if(this.gemItem = $q('#pane_item #ikey_p')) {
                    this.gemItem.click();
                }
                else {
                    gemDiv.setAttribute('onmouseover','');
                }
            };
            gemDiv.addEventListener('mouseover',gemDiv.onclick);
        }
        pv.appendChild(gemDiv);
        if(this.gemItem = $q('#pane_item #ikey_p')) {
            gemDiv.setAttribute('onmouseover',this.gemItem.getAttribute('onmouseover'));
        }
        else {
            gemDiv.removeAttribute('onmouseover');
        }
    },
    //alert you are in sprit mode
    alertSprite() {
        var csp = $i('ckey_spirit'),dvbc=$i('dvbc')||$i('vbs');
        if(csp&&dvbc) {
            //console.log(csp,csp.src)
            if(csp.src.includes('/y/battle/spirit_s.png')) dvbc.style.background = 'blue';
            else if(csp.src.includes('/y/battle/spirit_a.png')) dvbc.style.background = 'red';
            else dvbc.style.background = 'rgb(255,200,175)';
        }
    },
    cirtBuff: (function(){
        const cirtBuff = {
            '/y/e/regen.png' : 'Regen',
            '/y/e/shadowveil.png' : 'Shadow Veil',
            '/y/e/haste.png' : 'Haste',
            '/y/e/protection.png' : 'Protection',
            '/y/e/sparklife.png' : 'Spark of Life',
            '/y/e/heartseeker.png' : 'Heartseeker',
            '/y/e/arcanemeditation.png' : 'Arcane Focus',
            '/y/e/spiritshield.png' : 'Spirit Shield',
        };
        return Array.from($qa('#quickbar .btqs')).map((item,i)=>{
            for (let buff in cirtBuff) if (item.onmouseover && item.onmouseover.toString().match(cirtBuff[buff])) return {[buff]: i};
        }).filter(item=>item).reduce((a,b)=>Object.assign(a,b),{});
    }()),
    //buff remain
    buffCD(){
        var be = $i('pane_effects'),unuse = 0, buff = 0, posion = 0, effect = 0, all = 0;
        var src;
        const cirtBuff = Object.assign({}, this.cirtBuff);
        Array.from(be.querySelectorAll('img')).forEach(img=>{
            if(!(img instanceof HTMLImageElement)) return;
            switch(src = img.src.replace($url,'')) {
                case '/y/e/overwhelming.png':
                    break;
                    unuse += 1;
                    return (img.style = 'display:none');
                    break;
                case '/y/e/regen.png':
                case '/y/e/shadowveil.png':
                case '/y/e/haste.png':
                case '/y/e/protection.png':
                case '/y/e/sparklife.png':
                case '/y/e/heartseeker.png':
                case '/y/e/arcanemeditation.png':
                case '/y/e/spiritshield.png':
                case '/y/e/absorb.png':
                    delete cirtBuff[src];
                    buff += 1;
                    break;
                case '/y/e/fallenshield.png':
                case '/y/e/channeling.png':
                case '/y/e/focus.png':
                case '/y/e/defend.png':
                case '/y/e/riddlemaster.png':
                case '/y/e/riddlemasterperk.png':
                case '/y/e/wpn_et.png':
                case '/y/e/flee.png':
                case '/y/e/ripesoul.png':
                case '/y/e/soulfire.png':
                    effect += 1;
                    break;
                case '/y/e/soulstone.png':
                case '/y/e/gum.png':
                case '/y/e/flowers.png':
                case '/y/e/healthpot.png':
                case '/y/e/manapot.png':
                case '/y/e/spiritpot.png':
                case '/y/e/sparklife_scroll.png':
                case '/y/e/protection_scroll.png':
                case '/y/e/haste_scroll.png':
                case '/y/e/shadowveil_scroll.png':
                case '/y/e/absorb_scroll.png':
                case '/y/e/holyinfusion.png':
                case '/y/e/darkinfusion.png':
                case '/y/e/windinfusion.png':
                case '/y/e/fireinfusion.png':
                case '/y/e/coldinfusion.png':
                case '/y/e/elecinfusion.png':
                    posion += 1;
                    break;
                default:
                    $q('#textlog tbody').insertAdjacentHTML('afterbegin','<tr><td class="tl" style="color:red">unknow effect: '+img.src+'</td></tr>');
                    console.log(img.src);
                    break;
            }
            all += 1;
            if(/'.+?(?:\(x(\d+)\))?'.+?(\d+)\)\n/.test(img.onmouseover)) {
                img.insertAdjacentHTML('afterend', `<span data-x="${RegExp.$1||''}" data-cd="${RegExp.$2}"></span>`);
                if(RegExp.$2==0&&img.src.includes('/y/e/channeling.png')) {
                    handler.handlerKey('channeling');
                }
            }
        });
        const bt = $i('quickbar');
        if(!bt) return;
        //return;
        Array.from($qa('.btm1[style] .btm6 img')).forEach(img=>{
            if(/'.+?(?:\(x(\d+)\))?'.+?(\d+)\)\n/.test(img.onmouseover)) {
                img.insertAdjacentHTML('afterend', `<span data-x="${RegExp.$1||''}" data-cd="${RegExp.$2}"></span>`);
            }
        });
        for (var i in cirtBuff) {
            if (bt.children[cirtBuff[i]]) bt.children[cirtBuff[i]].classList.add('b-yellow');
        }
    },
    handleRiddle() {
        console.log('riddlemaster');
        ///*
        const a = document.createElement('a');
        a.href = document.querySelector('#riddlemaster img').src;
        a.download = `riddlemaster_${new Date().toISOString().replace(/:/g,'')}_${a.href.slice(-10)}.jpg`;
        if (location.protocol != "file:") a.click();
        window.focus();
        $i('riddleform').onsubmit = function() {
            const riddle = dataHelper.getLocal('riddle', {}, '');
            const data = {
                time: Math.max(0, Math.ceil(window.end_time - Date.now() / 1000 - window.time_skew)),
                answer: Array.from(new FormData(this).getAll('riddleanswer[]'))
            }
            riddle[a.href.slice(-10)] = data;
            dataHelper.saveLocal('riddle', riddle, '');
            console.log(data);
            //return false
        }
        //*/
        return;
        const t = setTimeout(()=>{},0);
        for(var i=0;i<t;i++) clearTimeout(i);
        const script = $q('#riddlemaster+script');
        if (script) {
            const s = document.createElement('script');
            s.innerHTML = script.innerHTML.replace('e("riddleanswer").value = "?";','').replace('e("riddleform").submit();', 'e("riddlesubmit").click();');
            script.replaceWith(s);
        }
    },
    handleGF_IW() {
        if (window.init_battle&&location.search=='?s=Battle&ss=gr') {
            var battleBk = window.init_battle;
            window.init_battle = function () {
                confirm('Are you sure you wish to start Grindfest Challenge?')&&battleBk(...arguments)
            }
        }
        else if(window.start_itemworld) {
            var iwBk = window.start_itemworld;
            window.start_itemworld = function () {
                if (!window.select_equip) return alert('No item selected');
                if (confirm('Are you sure you wish to start Item World Challenge with "' + window.dynjs_equip[window.select_equip].t + '"?')) {
                    iwBk(...arguments);
                }
            }
        }
    },
    handlerKey: (function(){
        let dKeyDown = $d.onkeydown,
            battle = {},
            keystatus = true,
            hoverIndex = 10,
            flag = 161,
            isMega = $i('2501'),
        quickClick = function() {
            var hv = $i('qb'+hoverIndex);
            if(hv) {
                hv.onmouseover();
                hv.click();
            }
        },
        quickHover = function(index) {
            hoverIndex = index;
            var hv = $i('qb'+index);
            if(hv) {
                hv.onmouseover();
            }
        },
        keyHandler = function(e){
            //console.log(e)
            switch(e.key) {
                case 'F1':case 'F2':case 'F3':case 'F4':case 'F5':case 'F6':case 'F7':case 'F8':case 'F9':case 'F10':case 'F11':case'Alt':
                    e.preventDefault();
                    break;
                case '0':case '1':case '2':case '3':case '4':case '5':case '6':case '7':case '8':case '9':
                    if(!e.altKey) {
                        if(!$q('#mkey_'+e.key+'[onclick]')) return;
                        if(e.repeat) {
                            let hb = $i('dvbh'),
                                hbc = $q('#dvbh img',hb),
                                rate = hbc&&(hbc.clientWidth/hb.clientWidth);
                            //console.log(rate)
                            if(rate && rate<0.5) {
                                //console.log('low hp return',rate)
                                return;
                            }
                        }
                        if(isMega&&($q('.btii').textContent=='Battle Time')) {
                            ($q('[onclick*="'+megaType+'"]')||$q('[onclick*="'+(megaType-1)+'"]')||$q('[onclick*="'+(megaType-2)+'"]')).click();
                        }
                    }
                    else {
                        hoverIndex = e.key;
                        if(e.key=='0') hoverIndex = 10;
                        else if(e.key=='1') {
                            var gemItem = $q('#pane_item #ikey_p[onmouseover*="(10005)"]');
                            if (gemItem) {
                                console.log('use powerup item');
                                gemItem.onmouseover();
                                return gemItem.click();
                            }
                        }
                    }
                    break;
                case '`':
                    {
                        let sp = $i('dvrc'), ss = $i('ckey_spirit');
                        if(sp&&ss&& sp.textContent<85 && ss.src.includes('/y/battle/spirit_a.png')) {
                            ss.click();
                            break;
                        }
                        hoverIndex = 16;
                        var t3 = $q('#table_skills > tbody > tr:last-child > td:last-child > div[onclick]');
                        if(t3) {
                            t3.onmouseover();
                            t3.click();
                        }
                    }
                    break;
                    break;
                case 'Tab':
                    if (e.repeat) return;
                    hoverIndex = 9;
                    var t2 = $q('#table_skills > tbody > tr:last-child > td:nth-child(2) > div[onclick]')||$q('#table_skills > tbody > tr:last-child > td:nth-child(1) > div[onclick]');
                    if(t2) {
                        t2.onmouseover();
                        t2.click();
                    }
                    e.preventDefault();
                    break;
                case 'CapsLock':
                    break;
                    $i(flag).onmouseover();
                    $i(flag).click();
                    if($q('.btm1[onclick]')) $q('.btm1[onclick]').click();
                    if(flag==151) flag = 161;
                    else flag-=10;
                    return;
                    break;
                case 'ArrowRight':
                    if(hoverIndex<16) hoverIndex++;
                    else hoverIndex = 1;
                    quickHover(hoverIndex);
                    break;
                case 'ArrowLeft':
                    if(hoverIndex>1) hoverIndex--;
                    else hoverIndex = 16;
                    quickHover(hoverIndex);
                    break;
                case 'Enter':
                    quickClick();
                    break;
                    break;
                case 's':case'S':case 'f':case'F':
                    var sp = $i('dvrc'), ss = $i('ckey_spirit');
                    if(sp&&ss&& sp.textContent<85 && ss.src.includes('/y/battle/spirit_n.png')) {
                        return;
                    }
                    break;
                case 'g':case 'p':case 'G':case 'P':
                    if($q('[onmouseover*="10008"]')&&$q('#pane_effects [src*="channeling"]')) {
                        //console.log('already exist channeling')
                        return;
                    }
                    break;
                    break;
                default:
                    break;
            }
            dKeyDown.call(e.target,e);
        },
        init = function(status){
            if (status!==undefined) return (keystatus = status);
            $d.onkeydown = e=>keyHandler(e);
            [
                'touch_and_go',
                'commit_target',
                'lock_action',
                'set_friendly_skill',
                'set_hostile_skill',
                'set_infopane_spell',
                'set_infopane',
                'recast',
            ].forEach(fn=>{
                battle[fn] = $w.battle[fn].bind($w.battle);
                $w.battle[fn] = function(){
                    if (keystatus==false) {
                        switch(fn) {
                            case 'commit_target':
                            case 'touch_and_go':
                            case 'recase':
                            case 'set_hostile_skill':
                                return;
                                break;
                            case 'lock_action':
                                if (['spirit','defend','focus'].includes(arguments[2])) return;
                                else if (arguments[2]=='magic' && arguments[3]!=311 && arguments[3]!=313) return;
                                else keystatus = true;
                                break;
                            case 'set_friendly_skill':
                                if (arguments[0]!=311 && arguments[0]!=313) return;
                                break;
                            case 'set_infopane_spell':
                                if (arguments[2]!='0530' && event.type != 'mouseover') return;
                                break;
                            case 'set_infopane':
                                if (event.type != 'mouseover') return;
                                break;
                            default:
                                break;
                        }
                    }
                    else if (keystatus=='channeling') {
                        switch(fn) {
                            case 'commit_target': return;
                            case 'set_hostile_skill':
                                keystatus = true;
                                break;
                            default:
                                break;
                        }
                    }
                    battle[fn].apply(this, arguments);
                }
            });
            if ($d.isClickListened) return;
            $d.isClickListened = true;
            $d.addEventListener('click',(ev)=>{
                if (keystatus!=true) {
                    if (ev.x) keystatus = true;
                }
            });
        }
        ;
        return init;
    }()),
    handleLog(text) {
        switch(text) {
            case '':
                this.handlerKey(true);
                this.buffCD();
                this.handleGem();
                this.alertSprite();
                break;
            case 'You gain the effect Cloak of the Fallen.':
                this.handlerKey(false);
                break;
        }
        this.addLog(text);
    },
    logs: '',
    addLog(text){
        if (this.doLog) this.logs += '\r\n' + text;
    },
    init(){
        this.newCss();

        this.handleGem();

        this.alertSprite();

        this.handlerKey();

        this.buffCD();

        this.doLog = localStorage.logBattle;
        this.addLog('\r\n' + $i("textlog").innerText);
    }
};

window.counter = counter;
window.battleStorage = storage;

function HvCounter() {
    'use strict';
    if ($i("textlog")) {
        //in the battle
        counter.newRound();
        handler.init();
        new MutationObserver((mutations,observer) => {
            //console.log(mutations);
            //console.time('handle')
            storage.last.handleTime -= Date.now()
            mutations.forEach(mutation=>{
                mutation.addedNodes&&(mutation.addedNodes.forEach(node=>{
                    if(node instanceof HTMLSpanElement) counter.countDrop(node);
                    else if(node instanceof HTMLTableCellElement) {
                        let text = node.textContent;
                        handler.handleLog(text);
                        counter.count(text);
                    }
                }));
            });
            counter.showData();
            counter.showCD();
            storage.last.handleTime += Date.now()
            //console.timeEnd('handle')
        }).observe($i("textlog"),{
            childList: true,
            subtree: true
        });
    }
    else if($i('riddlemaster')) {
        //riddle master
        //handler.handleRiddle();
    }
    else if($i('csp')){
        //exit the battle
        counter.showHistory();
        counter.handleExp();
        handler.handleGF_IW();
    }
}

HvCounter();
if ($i('textlog')) {
    document.title = isekai + ' ' + document.title;
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    document.addEventListener('mousewheel', function(e) {
        for (const item of e.path) {
            if (item.id=='battle_right') {
                e.preventDefault();
                return;
            }
        }
    }, {passive:false});
    window.addEventListener('beforeunload', dataHelper.saveExit);
    document.addEventListener('HVReload', HvCounter);
    document.addEventListener('DOMContentLoaded', HvCounter);
}

})();
