// ==UserScript==
// @name HuntFaloop nepnep fix
// @namespace https://github.com/suzuryu-nep/lanaklein14.github.io
// @description Script for ffxiv-the-hunt.net -> faloop integration (fix version)
// @include https://ffxiv-the-hunt.net/*
// @include https://faloop.app/*
// @author suzuryu_nep
// @version 1.1.2
// @downloadURL https://update.greasyfork.org/scripts/425241/HuntFaloop%20nepnep%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/425241/HuntFaloop%20nepnep%20fix.meta.js
// ==/UserScript==
const mobs = [{
    id: 2962,
    name_ja: "クロック・ミテーヌ",
    name_en: "Croque-mitaine",
    name_fr: "Croque-mitaine",
    name_de: "Croque Mitaine"
}, {
    id: 2963,
    name_ja: "ケロゲロス",
    name_en: "Croakadile",
    name_fr: "Croabéros",
    name_de: "Quakquak"
}, {
    id: 2964,
    name_ja: "ガーロック",
    name_en: "the Garlok",
    name_fr: "Garlok",
    name_de: "Garlok"
}, {
    id: 2965,
    name_ja: "ボナコン",
    name_en: "Bonnacon",
    name_fr: "Bonnacon",
    name_de: "Bonnacon"
}, {
    id: 2966,
    name_ja: "ナンディ",
    name_en: "Nandi",
    name_fr: "Nandi",
    name_de: "Nandi"
}, {
    id: 2967,
    name_ja: "チェルノボーグ",
    name_en: "Chernobog",
    name_fr: "Czernobog",
    name_de: "Czernobog"
}, {
    id: 2953,
    name_ja: "レドロネット",
    name_en: "Laideronnette",
    name_fr: "Laideronnette",
    name_de: "Laideronette"
}, {
    id: 2954,
    name_ja: "ウルガル",
    name_en: "Wulgaru",
    name_fr: "Wulgaru",
    name_de: "Wulgaru"
}, {
    id: 2955,
    name_ja: "マインドフレア",
    name_en: "mindflayer",
    name_fr: "flagelleur mental",
    name_de: "Seelenbrenner"
}, {
    id: 2956,
    name_ja: "サウザンドキャスト・セダ",
    name_en: "Thousand-cast Theda",
    name_fr: "Theda la tripoteuse",
    name_de: "Tausendzahn Theda"
}, {
    id: 2957,
    name_ja: "ゾーナ・シーカー",
    name_en: "Zona Seeker",
    name_fr: "Zona Seeker",
    name_de: "Zona Sucher"
}, {
    id: 2958,
    name_ja: "ブロンテス",
    name_en: "Brontes",
    name_fr: "Brontes",
    name_de: "Brontes"
}, {
    id: 2959,
    name_ja: "バルウール",
    name_en: "Lampalagua",
    name_fr: "Balaur",
    name_de: "Balaur"
}, {
    id: 2960,
    name_ja: "ヌニュヌウィ",
    name_en: "Nunyunuwi",
    name_fr: "Nunyunuwi",
    name_de: "Nunyunuwi"
}, {
    id: 2961,
    name_ja: "ミニョーカオン",
    name_en: "Minhocao",
    name_fr: "Minhocao",
    name_de: "Minhocao"
}, {
    id: 2968,
    name_ja: "サファト",
    name_en: "Safat",
    name_fr: "Safat",
    name_de: "Safat"
}, {
    id: 2969,
    name_ja: "アグリッパ",
    name_en: "Agrippa the Mighty",
    name_fr: "Agrippa",
    name_de: "Agrippa"
}, {
    id: 4374,
    name_ja: "カイザーベヒーモス",
    name_en: "kaiser behemoth",
    name_fr: "béhémoth empereur",
    name_de: "Kaiser-Behemoth"
}, {
    id: 4378,
    name_ja: "極楽鳥",
    name_en: "Bird of Paradise",
    name_fr: "oiseau de Paradis",
    name_de: "Paradiesvogel"
}, {
    id: 4377,
    name_ja: "ガンダルヴァ",
    name_en: "Gandarewa",
    name_fr: "Gandharva",
    name_de: "Gandalva"
}, {
    id: 4375,
    name_ja: "セーンムルウ",
    name_en: "Senmurv",
    name_fr: "Sênmurw",
    name_de: "Simurgh"
}, {
    id: 4376,
    name_ja: "ペイルライダー",
    name_en: "the Pale Rider",
    name_fr: "Cavalier pale",
    name_de: "Bleich[a] Reiter"
}, {
    id: 4380,
    name_ja: "レウクロッタ",
    name_en: "Leucrotta",
    name_fr: "leucrotta",
    name_de: "Leucrotta"
}, {
    id: 5987,
    name_ja: "ウドンゲ",
    name_en: "Udumbara",
    name_fr: "Udumbara",
    name_de: "Udumbara"
}, {
    id: 5988,
    name_ja: "ボーンクローラー",
    name_en: "Bone Crawler",
    name_fr: "Mangeur d'os",
    name_de: "Knochenkriecher"
}, {
    id: 5989,
    name_ja: "ソルト・アンド・ライト",
    name_en: "Salt and Light",
    name_fr: "Salaclux",
    name_de: "Salzlicht"
}, {
    id: 5984,
    name_ja: "オキナ",
    name_en: "Okina",
    name_fr: "Okina",
    name_de: "Okina"
}, {
    id: 5985,
    name_ja: "ガンマ",
    name_en: "Gamma",
    name_fr: "Gamma",
    name_de: "Gamma"
}, {
    id: 5986,
    name_ja: "オルガナ",
    name_en: "Orghana",
    name_fr: "Orghana",
    name_de: "Orghana"
}, {
    id: 8905,
    name_fr: "Tygre",
    name_en: "Tyger",
    name_ja: "ティガー",
    name_de: "Tyger"
}, {
    id: 8910,
    name_fr: "pédanterie pardonnée",
    name_en: "forgiven pedantry",
    name_ja: "フォーギヴン・ペダントリー",
    name_de: "geläutert[a] Pedanterie"
}, {
    id: 8900,
    name_fr: "Tarchia",
    name_en: "Tarchia",
    name_ja: "タルキア",
    name_de: "Tarchia"
}, {
    id: 8653,
    name_fr: "Aglaope",
    name_en: "Aglaope",
    name_ja: "アグラオペ",
    name_de: "Aglaope"
}, {
    id: 8890,
    name_fr: "Ixtab",
    name_en: "Ixtab",
    name_ja: "イシュタム",
    name_de: "Ixtab"
}, {
    id: 8895,
    name_fr: "Gunitt",
    name_en: "Gunitt",
    name_ja: "グニット",
    name_de: "Gunitt"
}];
const tourMobs = [{
    id: 8906,
    name_ja: 'ナックラヴィー',
    name_en: 'Nuckelavee',
    name_de: 'Nuckelavee',
    name_fr: 'Nuckelavee',
    zoneId: 813,
    rank: 'A'
}, {
    id: 8907,
    name_ja: 'ナリーポン',
    name_en: 'Nariphon',
    name_de: 'Nariphon',
    name_fr: 'Nariphon',
    zoneId: 813,
    rank: 'A'
}, {
    id: 8911,
    name_ja: 'リルマーダー',
    name_en: "Li'l Murderer",
    name_de: 'Klein[a] Mörder',
    name_fr: 'Traître',
    zoneId: 814,
    rank: 'A'
}, {
    id: 8912,
    name_ja: 'フラカン',
    name_en: 'Huracan',
    name_de: 'Huracan',
    name_fr: 'Huracan',
    zoneId: 814,
    rank: 'A'
}, {
    id: 8901,
    name_ja: 'マリクテンダー',
    name_en: 'Maliktender',
    name_de: 'Malikkaktor',
    name_fr: 'Malikpampa',
    zoneId: 815,
    rank: 'A'
}, {
    id: 8902,
    name_ja: 'シュガール',
    name_en: 'Sugaar',
    name_de: 'Sugaar',
    name_fr: 'Sugaar',
    zoneId: 815,
    rank: 'A'
}, {
    id: 8654,
    name_ja: '泥人',
    name_en: 'the mudman',
    name_de: 'Matschklops',
    name_fr: 'tas de boue',
    zoneId: 816,
    rank: 'A'
}, {
    id: 8655,
    name_ja: 'ポールディア',
    name_en: 'O Poorest Pauldia',
    name_de: 'gepeinigt[a] Pauldia',
    name_fr: 'Pauldia',
    zoneId: 816,
    rank: 'A'
}, {
    id: 8891,
    name_ja: 'スペイ',
    name_en: 'Supay',
    name_de: 'Supay',
    name_fr: 'Supay',
    zoneId: 817,
    rank: 'A'
}, {
    id: 8892,
    name_ja: 'グラスマン',
    name_en: 'Grassman',
    name_de: 'Grasmann',
    name_fr: 'Sasquatch arboricole',
    zoneId: 817,
    rank: 'A'
}, {
    id: 8896,
    name_ja: 'ルサルカ',
    name_en: 'Rusalka',
    name_de: 'Rusalka',
    name_fr: 'Roussalka',
    zoneId: 818,
    rank: 'A'
}, {
    id: 8897,
    name_ja: 'バール',
    name_en: 'Baal',
    name_de: 'Baal',
    name_fr: 'Baal',
    zoneId: 818,
    rank: 'A'
}];
const worldmap = {
  aegis: { id: 90, dc: 'elemental', sn: 'aegi' },
  atomos: { id: 68, dc: 'elemental', sn: 'atom' },
  carbuncle: { id: 45, dc: 'elemental', sn: 'carb' },
  garuda: { id: 58, dc: 'elemental', sn: 'garu' },
  gungnir: { id: 94, dc: 'elemental', sn: 'gung' },
  kujata: { id: 49, dc: 'elemental', sn: 'kuja' },
  ramuh: { id: 60, dc: 'elemental', sn: 'ramu' },
  tonberry: { id: 72, dc: 'elemental', sn: 'tonb' },
  typhon: { id: 50, dc: 'elemental', sn: 'typh' },
  unicorn: { id: 30, dc: 'elemental', sn: 'unic' },
  alexander: { id: 43, dc: 'gaia', sn: 'alex' },
  bahamut: { id: 69, dc: 'gaia', sn: 'baha' },
  durandal: { id: 92, dc: 'gaia', sn: 'dura' },
  fenrir: { id: 46, dc: 'gaia', sn: 'fenr' },
  ifrit: { id: 59, dc: 'gaia', sn: 'ifri' },
  ridill: { id: 98, dc: 'gaia', sn: 'ridi' },
  tiamat: { id: 76, dc: 'gaia', sn: 'tiam' },
  ultima: { id: 51, dc: 'gaia', sn: 'ulti' },
  valefor: { id: 52, dc: 'gaia', sn: 'vale' },
  yojimbo: { id: 31, dc: 'gaia', sn: 'yoji' },
  zeromus: { id: 32, dc: 'gaia', sn: 'zero' },
  anima: { id: 44, dc: 'mana', sn: 'anim' },
  asura: { id: 23, dc: 'mana', sn: 'asur' },
  belias: { id: 24, dc: 'mana', sn: 'beli' },
  chocobo: { id: 70, dc: 'mana', sn: 'choc' },
  hades: { id: 47, dc: 'mana', sn: 'hade' },
  ixion: { id: 48, dc: 'mana', sn: 'ixio' },
  mandragora: { id: 82, dc: 'mana', sn: 'mand' },
  masamune: { id: 96, dc: 'mana', sn: 'masa' },
  pandaemonium: { id: 28, dc: 'mana', sn: 'pand' },
  shinryu: { id: 29, dc: 'mana', sn: 'shin' },
  titan: { id: 61, dc: 'mana', sn: 'tita' },
  adamantoise: { id: 73, dc: 'aether', sn: 'adam' },
  balmung: { id: 91, dc: 'crystal', sn: 'balm' },
  cactuar: { id: 79, dc: 'aether', sn: 'cact' },
  coeurl: { id: 74, dc: 'crystal', sn: 'coeu' },
  faerie: { id: 54, dc: 'aether', sn: 'faer' },
  gilgamesh: { id: 63, dc: 'aether', sn: 'gilg' },
  goblin: { id: 81, dc: 'crystal', sn: 'gobl' },
  jenova: { id: 40, dc: 'aether', sn: 'jeno' },
  mateus: { id: 37, dc: 'crystal', sn: 'mate' },
  midgardsormr: { id: 65, dc: 'aether', sn: 'midg' },
  sargatanas: { id: 99, dc: 'aether', sn: 'sarg' },
  siren: { id: 57, dc: 'aether', sn: 'sire' },
  zalera: { id: 41, dc: 'crystal', sn: 'zale' },
  behemoth: { id: 78, dc: 'primal', sn: 'behe' },
  brynhildr: { id: 34, dc: 'crystal', sn: 'bryn' },
  diabolos: { id: 62, dc: 'crystal', sn: 'diab' },
  excalibur: { id: 93, dc: 'primal', sn: 'exca' },
  exodus: { id: 53, dc: 'primal', sn: 'exod' },
  famfrit: { id: 35, dc: 'primal', sn: 'famf' },
  hyperion: { id: 95, dc: 'primal', sn: 'hype' },
  lamia: { id: 55, dc: 'primal', sn: 'lami' },
  leviathan: { id: 64, dc: 'primal', sn: 'levi' },
  malboro: { id: 75, dc: 'crystal', sn: 'malb' },
  ultros: { id: 77, dc: 'primal', sn: 'ultr' },
  cerberus: { id: 80, dc: 'chaos', sn: 'cerb' },
  lich: { id: 36, dc: 'light', sn: 'lich' },
  moogle: { id: 71, dc: 'chaos', sn: 'moog' },
  odin: { id: 66, dc: 'light', sn: 'odin' },
  phoenix: { id: 56, dc: 'light', sn: 'phoe' },
  ragnarok: { id: 97, dc: 'chaos', sn: 'ragn' },
  shiva: { id: 67, dc: 'light', sn: 'shiv' },
  zodiark: { id: 42, dc: 'light', sn: 'zodi' },
  omega: { id: 39, dc: 'chaos', sn: 'omeg' },
  louisoix: { id: 83, dc: 'chaos', sn: 'loui' },
  twintania: { id: 33, dc: 'light', sn: 'twin' },
  spriggan: { id: 85, dc: 'chaos', sn: 'spri' }
};

const b2h = ((i, n, a) => {
    while (i < n) {
        a[i] = (i++ + 0x100).toString(16).substr(1);
    }
    return a;
})(0, 256, []);

const h2b = ((b2h, h2b) => {
    b2h.forEach(function (h, i) {
        h2b[h] = i;
    });
    return h2b;
})(b2h, {});

const regexp = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})-([a-f0-9]{2})([a-f0-9]{2})-([a-f0-9]{2})([a-f0-9]{2})-([a-f0-9]{2})([a-f0-9]{2})-([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/;

class UUID {
    constructor(bytes) {
        this.bytes = bytes;
    }

    get string() {
        return this.toString();
    }

    get ellipsis() {
        return this.string.split(/-/).slice(0, 2).join("-") + "-...";
    }

    toJSON() {
        return this.toString();
    }

    toString() {
        if (this._string) {
            return this._string;
        }
        const ba = new Uint8Array(this.bytes);
        let i = 0;
        const s = b2h[ba[i++]] + b2h[ba[i++]] +
                  b2h[ba[i++]] + b2h[ba[i++]] + "-" +
                  b2h[ba[i++]] + b2h[ba[i++]] + "-" +
                  b2h[ba[i++]] + b2h[ba[i++]] + "-" +
                  b2h[ba[i++]] + b2h[ba[i++]] + "-" +
                  b2h[ba[i++]] + b2h[ba[i++]] +
                  b2h[ba[i++]] + b2h[ba[i++]] +
                  b2h[ba[i++]] + b2h[ba[i++]]
        this._string = s;
        return s;
    }

    equals(target) {
        const a = new Uint8Array(this.bytes);
        const b = new Uint8Array(target.bytes);
        for (let i = 0; i < 16; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

    writeToBuffer(buf, offset) {
        const from = new Uint8Array(this.bytes);
        const to = new Uint8Array(buf, offset);
        const len = from.length;
        for (let i = 0; i < len; i++) {
            to[i] = from[i];
        }
    }

    static parse(str) {
        let ba = new Uint8Array(16);
        const md = str.toLowerCase().match(regexp);
        if (md === null) {
            throw Error("invalid uuid string");
        }
        for (let i = 0; i < 16; i++) {
            ba[i] = h2b[md[i + 1]];
        }
        return new UUID(ba.buffer);
    }
}

let currentmobid = 0;
let instanceid = 0;

/**
 * Generate date object with the year nearest to current date.
 * @param {string} text - date in format 'M/d H:mm'
 * @return date object
 */
function textToDate(text) {
    const now = new Date();
    const year = now.getFullYear();
    const date0 = new Date((year - 1) + '/' + text);
    const date1 = new Date(year + '/' + text);
    const date2 = new Date((year + 1) + '/' + text);
    let value = date0;
    let diff = Math.abs(date0.getTime() - now.getTime());
    if (Math.abs(date1.getTime() - now.getTime()) < diff) {
        diff = Math.abs(date1.getTime() - now.getTime());
        value = date1;
    }
    if (Math.abs(date2.getTime() - now.getTime()) < diff) {
        diff = Math.abs(date2.getTime() - now.getTime());
        value = date2;
    }
    return value;
}

/**
 * Main function
 */
function main_huntnet() {

    // Set style
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(`
    .uid-c4a17639-159f-4403-9bac-b4c2ddc278fd > rect,
    circle.uid-c4a17639-159f-4403-9bac-b4c2ddc278fd {
        fill: #5580C8 !important;
    }`
    ));
    document.querySelector('head').appendChild(style);

    document.addEventListener("mozule:touchstart", function (event) {
        var timelineElement = event.target.closest('div.timeline');
        if (timelineElement) {
            const title = timelineElement.querySelector('h3.mob-name').getAttribute('title');
            const area = timelineElement.querySelector('div.area').innerText;
            let mob = mobs.find(m => {
                return (m.name_ja == title ||
                    m.name_en == title ||
                    m.name_fr == title ||
                    m.name_de == title);
            });
            if (mob) {
                currentmobid = mob.id;
                console.log(mob.id, mob.name_en);
                if (area.endsWith('1')) {
                    instanceid = 1;
                }
                else if (area.endsWith('2')) {
                    instanceid = 2;
                }
                else if (area.endsWith('3')) {
                    instanceid = 3;
                }
                else {
                    instanceid = 0;
                }
            }
            else {
                currentmobid = 0;
                console.log("not found");
            }
        }
    }, false);

    const body = document.querySelector('body');
    const observer = new MutationObserver(records => {
        const popup = document.querySelector('SECTION.clump-content:not(.hidden)');
        if (popup) {
            let hasFaloopReport = false;
            popup.querySelectorAll('.left').forEach(textNode => {
                if (textNode.textContent == 'id: c4a17639-159f-...') {
                    hasFaloopReport = true;
                    textNode.textContent = 'Faloop!';
                }
            });

            const timeTexts = Array.from(popup.querySelectorAll('.right')).map(text => {
                return textToDate(text.textContent);
            })
            const length = timeTexts.length;
            if (length > 0) {
                const index = Math.floor((length + 1) / 2) - 1;
                let mean = timeTexts[index].getTime();
                if (timeTexts.length % 2 === 0) {
                    mean = Math.floor((mean + timeTexts[index + 1].getTime()) / 2);
                }
                console.log(mean);
                console.log(new Date(mean));
                console.log("hasFaloopReport", hasFaloopReport);
                if (!hasFaloopReport && currentmobid !== 0 && !popup.querySelector('div.faloop')) {
                    const world = document.querySelector('#selected-world').textContent;
                    let div = document.createElement('div');
                    div.classList.add('score');
                    div.classList.add('faloop');
                    let link = document.createElement('a');
                    link.innerText = `Mark & Open Faloop!`;
                    popup.appendChild(div);
                    div.appendChild(link);
                    link.onclick = function() {
                        try {
                            const data = new ArrayBuffer(40);
                            const dv = new DataView(data);
                            console.log('userid', localStorage.getItem("userid"));
                            const uuid = UUID.parse(localStorage.getItem("userid"));
                            uuid.writeToBuffer(data, 0);
                            dv.setUint32(16, parseInt(localStorage.getItem("secret")));
                            dv.setUint32(20, worldmap[world.toLowerCase()].id);
                            dv.setUint32(24, currentmobid);
                            dv.setUint8(28, instanceid==0 ? 1 : instanceid);
                            dv.setUint8(29, 10);
                            dv.setInt32(30, Math.floor(mean / 1000));
                            dv.setInt32(34, Math.floor(Date.now() / 1000));
                            dv.setUint8(38, 0);
                            dv.setUint8(39, 0);
                            fetch("/api/hunt/2/new", {
                                method: "POST",
                                body: data
                            });
                        } catch (e) {
                            console.error('failed to self report with local user cache', e);
                            console.log('continue to open faloop');
                        }
                        window.open(
                            instanceid==0 ?
                            `https://faloop.app/?worldid=${worldmap[world.toLowerCase()].id}&mobid=${currentmobid}&time=${mean}` :
                            `https://faloop.app/?worldid=${worldmap[world.toLowerCase()].id}&mobid=${currentmobid}&instanceid=${instanceid}&time=${mean}`, "_blank");
                    }
                }
            }
        }
    });
    observer.observe(body, {
        childList: true
    });
}

/**
 * Find the subtract TOD button in DOM and click it based on the given time.
 * @param {int} timeOfDeath - timeOfDeath in unixtime millisec
 */
function setDefaultTOD(timeOfDeath) {
    const detailPane = document.querySelector('div.MobReport_sections__3MDui');
    if (!detailPane) {
        console.log('Could not find the details pane. skipping.');
        return;
    }
    const button = detailPane.querySelectorAll('div.ActionBox_up-down-btns__3b1sX button.btn-danger')[1];
    if (!button) {
        console.log('Could not find subtract TOD button. skipping.');
        return;
    }
    let minutes = Math.floor((Date.now() - timeOfDeath) / 1000 / 60);
    console.log('Total minutes', minutes);

    const countCtrlShiftKey = Math.floor(minutes / 720);
    console.log('Number of clicks with Ctrl+Shift Key(720 min each):', countCtrlShiftKey);
    minutes = minutes % 720;
    console.log('Remaining minutes', minutes);
    const countCtrlKey = Math.floor(minutes / 60);
    console.log('Number of clicks with Ctrl Key(60 min each):', countCtrlKey);
    minutes = minutes % 60;
    console.log('Remaining minutes', minutes);
    const countShiftKey = Math.floor(minutes / 10);
    console.log('Number of clicks with Shift Key(10 min each):', countShiftKey);
    minutes = minutes % 10;
    console.log('Number of clicks(=Remaining minutes):', minutes);

    for (let i = 0; i < countCtrlShiftKey; i++) {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true, shiftKey: true }));
    }
    for (let i = 0; i < countCtrlKey; i++) {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }));
    }
    for (let i = 0; i < countShiftKey; i++) {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));
    }
    for (let i = 0; i < minutes; i++) {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
    const submit = detailPane.querySelector('div.ActionBox_container__3TQri button.btn-danger');
	if (submit) {
        submit.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
}

/**
 * Find the mob row (may retry in case of loading).
 * Open the details pane and call setDefaultTOD function.
 * @param {string} worldsn - target world in short name
 * @param {object} mob - target mob object
 * @param {int} timeOfDeath - time of death in unixtime millisec
 * @param {int} retryCount - retry count
 */
function selectMob(worldsn, mob, retryCount, timeOfDeath=null, instanceid='') {
    let sn_temp2 = document.querySelector('span.w-100.text-truncate') != null ? document.querySelector('span.w-100.text-truncate').textContent.toLowerCase() : '';
    let nameTags = Array.from(document.querySelectorAll('div.SMobsPageRow_row__AyBDV'));
    let nameTag = nameTags.find(t => {
        const name = t.querySelector('span.h5').textContent.toLowerCase();
        const instance = t.querySelector('span.h4') != null ? t.querySelector('span.h4').textContent.toLowerCase() : '';
        let sn_temp = t.querySelector('span.badge.mr-2') != null ? t.querySelector('span.badge.mr-2').textContent.toLowerCase() : sn_temp2;
        const sn = sn_temp.slice(0, 4);
        console.log(`world: ${worldsn}=${sn}`, `instance: ${instanceid}=${instance}`, `mob: ${name}=${mob.name_ja.toLowerCase()}|${mob.name_en.toLowerCase()}|${mob.name_fr.toLowerCase()}|${mob.name_de.toLowerCase()}`);
        return (worldsn == sn && instanceid == instance &&
            (name == mob.name_ja.toLowerCase() ||
            name == mob.name_en.toLowerCase() ||
            name == mob.name_fr.toLowerCase() ||
            name == mob.name_de.toLowerCase()));
    });

    if (nameTag) {
        console.log(`Mob row for ${nameTag.textContent} found.`);
        nameTag.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        if (timeOfDeath) {
            setTimeout(function () { setDefaultTOD(timeOfDeath); }, 500);
        }
    }
    else {
        if (retryCount > 0) {
            console.log(`Mob row not found. Retry(${retryCount - 1})`);
            setTimeout(function () { selectMob(worldsn, mob, retryCount - 1, timeOfDeath, instanceid) }, 1000);
        }
        else {
            console.log(`Mob row not found. Skipping.`)
        }
    }
}

async function refreshToken() {
    const sessionId = localStorage.getItem("sessionId");
    const url = "https://api.faloop.app/api/auth/user/refresh";
    const token = localStorage.getItem("token");
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
    };
    const res = await fetch(url, {
        method: "Post",
        headers,
        body: JSON.stringify({sessionId: sessionId})
    });
    const data = await res.json();
    if (data.success) {
        console.log("token refreshed", data.token);
        localStorage.setItem("token", data.token);
    }
}

async function fetch_retry(url, body, n) {
    try {
        const token = localStorage.getItem("token");
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        };
        const res = await fetch(url, {
            method: "POST",
            headers,
            body,
        });

        const data = await res.json();
        if (data.success) {
            return;
        }
        else if (data.code === 401 && data.msg === "Unauthorized" && !data.success) {
            // refresh token and retry
            await refreshToken();
            return await fetch_retry(url, body, n - 1);
        }
        else {
            console.error(`token: ${token}`);
            throw data;
        }
    } catch (err) {
        console.error(`fetch failed with ${err}. retry count ${n}`);
        await new Promise(r => setTimeout(r, 1000));
        if (n === 1) throw err;
        return await fetch_retry(url, body, n - 1);
    }
};

function processAMobRow(el) {
    const name = el.querySelector("span[class*='MobName_name']").textContent.toLowerCase();
    const mob = tourMobs.find(mob=>(name == mob.name_ja.toLowerCase() || name == mob.name_en.toLowerCase() || name == mob.name_fr.toLowerCase() || name == mob.name_de.toLowerCase()));
    const isActive = el.querySelector('div.bg-gradient.bg-info') != null || el.querySelector('div.bg-gradient.bg-success') != null; // TBD better verification
    if (mob && isActive) {
        const launchButton = document.createElement("button");
        launchButton.classList.add("dropbtn");
        launchButton.innerText = "report";
        const submitButton = document.createElement("button");
        submitButton.classList.add("dropdown-content");
        submitButton.setAttribute("data-mobid", mob.id);
        submitButton.setAttribute("data-zoneid", mob.zoneId);
        // parse target worldId
        let world = '';
        const divWithWorld = el.querySelector("div[class*='AMobsPageRow_with-world']");
        if (divWithWorld) {
            world = divWithWorld.firstChild.textContent.toLowerCase();
        }
        else {
            let worldNode = document.querySelector("div[class*='WorldSelector'] > span")
            if (worldNode == null) {
                const select = document.querySelector("select.custom-select");
                worldNode = select.options[select.selectedIndex];
            }
            world = worldNode.textContent.toLowerCase();
        }
        const entry = Object.entries(worldmap).find(([key, value]) => key == world || value.sn == world);
        submitButton.setAttribute("data-worldid", worldmap[entry[0]].id);
        // parse target instance
        // TBD
        const instance = el.querySelector('span.h4') != null ? el.querySelector('span.h4').textContent.toLowerCase() : '';
        submitButton.setAttribute("data-instance", instance);

        submitButton.innerText = "Killed Now!";
        submitButton.addEventListener('click', async (event) => {
            event.stopPropagation();
            const mobId = parseInt(submitButton.getAttribute("data-mobid"), 10);
            const worldId = parseInt(submitButton.getAttribute("data-worldid"), 10);
            const zoneId = parseInt(submitButton.getAttribute("data-zoneid"), 10);
            const zoneInstance = submitButton.getAttribute("data-instance") == '' ? null : parseInt(submitButton.getAttribute("data-instance"), 10);
            const url = `https://api.faloop.app/api/mobs/${mobId}/report`
            const body = JSON.stringify({
                action: "death",
                data: {killedMinsAgo: 0},
                stage: null,
                window: 1,
                worldId,
                zoneId,
                zoneInstance
            });
            console.log("quick report", url, body);
            try {
                await fetch_retry(url, body, 5);
                el.removeChild(parentDiv)
            } catch (e) {
                console.error('failed to post report', e);
            }
        }, false);

        const parentDiv = document.createElement("div");
        parentDiv.classList.add("dropdown");
        parentDiv.appendChild(launchButton);
        parentDiv.appendChild(submitButton);

        if (!el.querySelector("div.dropdown")) {
            const nextEl = el.querySelector("div[class*='AMobsPageRow_name']");
            el.insertBefore(parentDiv, nextEl.nextSibling);
        }
    }
}

/**
 * Main function. Validate the url parameters and execute selectMob.
 */
function main_faloop() {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(`
    .dropbtn {
      background: #f1e767;
      background: -webkit-gradient(linear, left top, left bottom, from(#f1e767), to(#feb645));
      background: -webkit-linear-gradient(top, #f1e767 0%, #feb645 100%);
      background: linear-gradient(to bottom, #f1e767 0%, #feb645 100%);
      border-radius: 10px;
    }
    .dropdown:hover .dropbtn {
      background: -webkit-gradient(linear, left bottom, left top, from(#f1e767), to(#feb645));
      background: -webkit-linear-gradient(bottom, #f1e767 0%, #feb645 100%);
      background: linear-gradient(to top, #f1e767 0%, #feb645 100%);
      border-radius: 10px;
    }
    .dropdown {
      width: auto;
      position: relative;
      display: inline-block;
    }
    .dropdown-content {
      display: none;
      position: absolute;
      left: 100%;
      top: 0;
      z-index: 1;
      border-radius: 3px;
      color: #fff;
      background-color: #e85b58;
      border-bottom: 3px solid #b84c00;
      -webkit-box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
      box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
    }
    .dropdown-content:hover {
      margin-top: 1px;
      color: #fff;
      background: #e87358;
      border-bottom: 2px solid #b84c00;
    }
    .dropdown:hover .dropdown-content {display: block;}
    `
    ));
    document.querySelector('head').appendChild(style);

    const urlParams = new URLSearchParams(window.location.search);
    const worldid = urlParams.get('worldid');
    const mobid = urlParams.get('mobid');
    const time = urlParams.get('time');
    const instanceid = urlParams.get('instanceid');
    const mob = mobs.find(m => { return m.id == mobid });
    if (worldid && mob) {
        console.log('Valid parameters detected. Processing.', worldid, mobid);
        const worldsn = Object.values(worldmap).find(item => item.id == worldid).sn;
        console.log('world short name', worldsn);
        console.log('time', time);
        console.log('instanceid', instanceid);
        selectMob(worldsn, mob, 10, time, instanceid ? instanceid : '');
    }
    else {
        console.log('Valid parameters NOT detected. Skipping.');
    }
    const observer = new MutationObserver(records => {
        records.forEach((record) => {
            if ( record.type != "childList" || record.addedNodes.length === 0) {
                return;
            }
            record.addedNodes.forEach((node) => {
                if (node.tagName != 'DIV') {
                    return;
                }
                if (Array.from(node.classList).some(cls=>cls.startsWith('AMobsPageRow_row'))) {
                    processAMobRow(node);
                }
                const elements = node.querySelectorAll("div[class*='AMobsPageRow_row']");
                if (elements.length > 0) {
                    elements.forEach((el) => processAMobRow(el));
                    //console.log(elements.length);
                }
            });
        });
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });
}

if (location.hostname === "ffxiv-the-hunt.net") {
    main_huntnet();
}
else if (location.hostname === "faloop.app") {
    main_faloop();
}
