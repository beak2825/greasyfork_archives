// ==UserScript==
// @name         Puzz.link Assistance
// @version      25.12.28.1
// @description  Do trivial deduction.
// @author       Leaving Leaves
// @match        https://puzz.link/p*/*
// @match        https://pzplus.tck.mn/p*/*
// @match        https://pzprxs.vercel.app/p*/*
// @match        http://pzv.jp/p*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=puzz.link
// @grant        none
// @namespace    https://greasyfork.org/users/1192854
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/477117/Puzzlink%20Assistance.user.js
// @updateURL https://update.greasyfork.org/scripts/477117/Puzzlink%20Assistance.meta.js
// ==/UserScript==

'use strict';

const MAXLOOP = 50, TIMEOUTLIMIT = 30 * 1000;
let stpcnt = 0, stp2cnt = 0, starttime, step = false, hasInvCrQsub = false;
let loopDir = -1; // 0:CCW CRQSUB.inout:CW
let board;
let GENRENAME;
// used for showing pattern
// ×·█━┃┓┛┗┏╺╹╸╻●○

// const list
const CQNUM = {
    quesmark: -2,
    circle: -2, // no number
    black: -2,
    none: -1,
    wcir: 1,
    bcir: 2,
    // Moon or Sun
    sun: 1,
    moon: 2,
};
const CANUM = {
    none: -1,
    // Yinyang
    wcir: 1,
    bcir: 2,
};
const CQANS = {
    none: 0,
    black: 1,
    // Light and Shadow
    white: 2,
    // Starbattle
    star: 1,
    // Akari
    light: 1,
    // Shakashaka triangle
    triBL: 2,
    triBR: 3,
    triTR: 4,
    triTL: 5,
    // Slant
    rslash: 31,
    lslash: 32,
};
const CQUES = {
    none: 0,
    // Castle Wall
    gray: 0,
    white: 1,
    black: 2,
    // Icebarn
    ice: 6,
    fire: 6,
    // Simpleloop
    wall: 7,
    // Slalom
    vgate: 21,
    hgate: 22,
    // Nurimaze
    cir: 41,
    tri: 42,
};
const CQSUB = {
    none: 0,
    dot: 1,
    green: 1,
    circle: 1,
    // Slitherlink
    yellow: 2,
    // All or Nothing
    gray: 1,
    // Moon or Sun
    cross: 2,
};
const QDIR = {
    none: 0,
    // arrow
    up: 1,
    dn: 2,
    lt: 3,
    rt: 4,
};
const BQSUB = {
    none: 0,
    link: 1,
    cross: 2,
    // Icebarn
    arrow_up: 11,
    arrow_dn: 12,
    arrow_lt: 13,
    arrow_rt: 14,
};
const BQNUM = {
    none: -1,
    wcir: 1,
    bcir: 2,
};
const CRQSUB = {
    none: 0,
    in: 1,
    out: 2,
    inout: 3,
}

const GENRELIST = [
    ["Aho-ni-Narikire", AhoniNarikireAssist, "aho"],
    ["Akari", AkariAssist, "akari"],
    ["Akichiwake", AkichiwakeAssist, "akichi"],
    ["All or Nothing", AllorNothingAssist, "nothing"],
    // ["Angle Loop", AngleLoopAssist,"angleloop"],
    ["Ant Mill", AntMillAssist, "antmill"],
    ["Aqre", AqreAssist, "aqre"],
    ["Aquapelago", AquapelagoAssist, "aquapelago"],
    ["Aquarium", AquariumAssist, "aquarium"],
    ["Araf", ArafAssist, "araf"],
    ["Archipelago", ArchipelagoAssist, undefined], // archipelago
    ["Arukone", ArukoneAssist, "arukone"],
    ["Ayeheya", AyeheyaAssist, "ayeheya"],
    ["Balance Loop", BalanceLoopAssist, "balance"],
    ["Balloon Box", BalloonBoxAssist, undefined], // balloon
    ["Barns", BarnsAssist, "barns"],
    ["Battleship", BattleshipAssist, "battleship"],
    ["Border Block", BorderBlockAssist, "bdblock"],
    ["Bosanowa", BosanowaAssist, "bosanowa"],
    ["Bosnian Road", BosnianRoadAssist, undefined], // bosnianroad
    ["Box", BoxAssist, "box"],
    ["Brownies", BrowniesAssist, "brownies"],
    ["Bunnyhop", BunnyhopAssist, "bunnyhop"],
    ["Canal View", CanalViewAssist, "canal"],
    ["Castle Wall", CastleWallAssist, "castle"],
    ["Cave", CaveAssist, "cave"],
    ["Chained Block", ChainedBlockAssist, "chainedb"],
    ["Choco Banana", ChocoBananaAssist, "cbanana"],
    ["Chocona", ChoconaAssist, "chocona"],
    ["Circles and Squares", CirclesAndSquaresAssist, "circlesquare"],
    ["Cocktail Lamp", CocktailLampAssist, "cocktail"],
    ["Coffee Milk", CoffeeMilkAssist, "coffeemilk"],
    ["Cojun", CojunAssist, "cojun"],
    ["Combi Block", CombiBlockAssist, "cbblock"],
    ["Compass", CompassAssist, "compass"],
    ["Context", ContextAssist, "context"],
    ["Country Road", CountryRoadAssist, "country"],
    ["Creek", CreekAssist, "creek"],
    ["Detour", DetourAssist, "detour"],
    ["Dominion", DominionAssist, "dominion"],
    ["Dosun-Fuwari", DosunFuwariAssist, "dosufuwa"],
    ["Dotchi-Loop", DotchiLoopAssist, "dotchi"],
    ["Double Back", DoubleBackAssist, "doubleback"],
    ["Double Choco", DoubleChocoAssist, "dbchoco"],
    ["Easy as ABC", EasyAsAbcAssist, "easyasabc"],
    ["Energy Walk", EnergyWalkAssist, "energywalk"],
    ["Family Photo", FamilyPhotoAssist, "familyphoto"],
    ["Fillomino", FillominoAssist, "fillomino"],
    ["Fire Walk", FireWalkAssist, "firewalk"],
    ["FiveCells", FiveCellsAssist, "fivecells"],
    ["Forest Walk", ForestWalkAssist, "forestwalk"],
    ["FourCells", FourCellsAssist, "fourcells"],
    ["Geradeweg", GeradewegAssist, "geradeweg"],
    ["Goats and Wolves", GoatsAndWolvesAssist, "shwolf"],
    ["Guide Arrow", GuideArrowAssist, "guidearrow"],
    ["Hashiwokakero", HashiwokakeroAssist, "hashi"],
    ["Hebi-Ichigo", HebiIchigoAssist, "hebi"],
    ["Herugolf", HerugolfAssist, "herugolf"],
    ["Heteromino", HeterominoAssist, "heteromino"],
    ["Heyablock", HeyablockAssist, "heyablock"],
    ["Heyawake", HeyawakeAssist, "heyawake"],
    ["Hitori", HitoriAssist, "hitori"],
    ["Hotaru Beam", HotaruBeamAssist, "firefly"],
    ["Icebarn", IcebarnAssist, "icebarn"],
    ["Icelom", IcelomAssist, "icelom"],
    ["Ice Walk", IceWalkAssist, "icewalk"],
    ["International Borders", InternationalBordersAssist, "interbd"],
    ["Inverse LITSO", InverseLitsoAssist, undefined], // invlitso
    ["Islands", IslandsAssist, "shimaguni"],
    ["Shimaguni", IslandsAssist, "shimaguni"],
    ["Isowatari", IsowatariAssist, "Isowatari"],
    ["Juosan", JuosanAssist, "juosan"],
    ["Kakuro", KakuroAssist, "kakuro"],
    ["Kazunori Room", KazunoriRoomAssist, "kazunori"],
    ["Koburin", KoburinAssist, "koburin"],
    ["Kropki", KropkiAssist, "kropki"],
    ["Kurarin", KurarinAssist, "kurarin"],
    ["Kurodoko", KurodokoAssist, "kurodoko"],
    ["La Paz", LaPazAssist, "lapaz"],
    ["Light and Shadow", LightandShadowAssist, "lightshadow"],
    ["Litherslink", LitherslinkAssist, "lither"],
    ["LITS", LitsAssist, "lits"],
    ["Lohkous", LohkousAssist, "lohkous"],
    ["Look-Air", LookAirAssist, "lookair"],
    ["Loop Special", LoopSpecialAssist, "loopsp"],
    ["Martini", MartiniAssist, "martini"],
    ["Masyu", MasyuAssist, "masyu"],
    ["Maxi Loop", MaxiLoopAssist, "maxi"],
    ["Mejilink", MejilinkAssist, "mejilink"],
    ["Mid-loop", MidloopAssist, "midloop"],
    ["Minarism", MinarismAssist, "minarism"],
    ["Minesweeper", MinesweeperAssist, "mines"],
    ["Mirroring Tile", MirroringTileAssist, undefined], // mrtile
    ["Mochikoro", MochikoroAssist, "mochikoro"],
    ["Moon or Sun", MoonOrSunAssist, "moonsun"],
    ["Myopia", MyopiaAssist, "myopia"],
    ["Nagareru-Loop", NagareruLoopAssist, "nagare"],
    ["Nanameguri", NanameguriAssist, "nanameguri"],
    ["Nawabari", NawabariAssist, "nawabari"],
    ["NIKOJI", NikojiAssist, "nikoji"],
    ["Nondango", NondangoAssist, "nondango"],
    ["Nonogram", NonogramAssist, "nonogram"],
    ["Norinori", NorinoriAssist, "norinori"],
    ["Norinuri", NorinuriAssist, "norinuri"],
    ["No Three", NothreeAssist, "nothree"],
    ["Numberlink", NumberlinkAssist, "numlin"],
    ["Nuribou", NuribouAssist, "nuribou"],
    ["Nurikabe", NurikabeAssist, "nurikabe"],
    ["Nuri-Maze", NuriMazeAssist, "nurimaze"],
    ["Nurimisaki", NurimisakiAssist, "nurimisaki"],
    ["One Room One Door", OneRoomOneDoorAssist, "oneroom"],
    ["Paintarea", PaintareaAssist, "paintarea"],
    ["Parquet", ParquetAssist, "parquet"],
    ["Pencils", PencilsAssist, "pencils"],
    ["Pentominous", PentominousAssist, "pentominous"],
    ["Persistence of Memory", PersistenceOfMemoryAssist, undefined], // pmemory
    ["Pipelink", PipelinkAssist, "pipelink"],
    ["Putteria", PutteriaAssist, "putteria"],
    ["Rail Pool", RailPoolAssist, "railpool"],
    ["Rassi Silai", RassiSilaiAssist, "rassi"],
    ["Rectangle-Slider", RectangleSliderAssist, "rectslider"],
    ["Reflect Link", ReflectLinkAssist, "reflect"],
    ["Regional Yajilin", RegionalYajilinAssist, "yajilin-regions"],
    ["Ring-ring", RingringAssist, "ringring"],
    ["Ripple Effect", RippleEffectAssist, "ripple"],
    ["Rooms of Factors", RoomsOfFactorsAssist, "factors"],
    ["Sansa Road", SansaRoadAssist, "sansaroad"],
    ["Sashigane", SashiganeAssist, "sashigane"],
    ["School Trip", SchoolTripAssist, "shugaku"],
    ["Scrin", ScrinAssist, "scrin"],
    ["Shakashaka", ShakashakaAssist, "shakashaka"],
    ["Shikaku", ShikakuAssist, "shikaku"],
    ["Simple Gako", SimpleGakoAssist, "simplegako"],
    ["Simple Loop", SimpleLoopAssist, "simpleloop"],
    ["Skyscrapers", SkyscrapersAssist, "skyscrapers"],
    ["Slalom", SlalomAssist, "slalom"],
    ["Slant", SlantAssist, "gokigen"],
    ["Slash Pack", SlashPackAssist, "slashpack"],
    ["Slitherlink", SlitherlinkAssist, "slitherlink"],
    ["Snake", SnakeAssist, "snake"],
    ["Square Jam", SquareJamAssist, "squarejam"],
    ["Star Battle", StarbattleAssist, "starbattle"],
    ["Statue Park", StatueParkAssist, "statuepark"],
    ["Stostone", StostoneAssist, "stostone"],
    ["Sudoku", SudokuAssist, "sudoku"],
    ["Sukoro", SukoroAssist, "sukoro"],
    ["Sumiwake", SumiwakeAssist, "sumiwake"],
    ["Sheep Wolf Slitherlink", SWSlitherlinkAssist, "swslither"],
    ["Symmetry Area", SymmetryAreaAssist, "symmarea"],
    ["Tapa", TapaAssist, "tapa"],
    ["Tapa-Like Loop", TapaLikeLoopAssist, "tapaloop"],
    ["Tasquare", TasquareAssist, "tasquare"],
    ["Tatamibari", TatamibariAssist, "tatamibari"],
    ["Tawamurenga", TawamurengaAssist, "tawa"],
    ["Tentaisho", TentaishoAssist, "tentaisho"],
    ["Tents", TentsAssist, "tents"],
    ["Tetrochain", TetrochainAssist, "tetrochain"],
    ["Tetrominous", TetrominousAssist, "tetrominous"],
    ["Tilepaint", TilepaintAssist, "tilepaint"],
    ["Toichika", ToichikaAssist, "toichika"],
    ["Tren", TrenAssist, "tren"],
    ["Uso-one", UsoOneAssist, "usoone"],
    ["Uso-tatami", UsoTatamiAssist, "usotatami"],
    ["Vertex Slitherlink", VertexSlitherlinkAssist, "vslither"],
    ["Voxas", VoxasAssist, "voxas"],
    ["Wagiri", WagiriAssist, "wagiri"],
    ["Wall Logic", WallLogicAssist, "walllogic"],
    ["Water Walk", WaterWalkAssist, "waterwalk"],
    ["Wittgenstein Briquet", WittgensteinBriquetAssist, "wittgen"],
    ["Yajilin", YajilinAssist, "yajilin"],
    ["Yajirushi 2", Yajirushi2Assist, undefined], // yajirushi2
    ["Yajisan-Kazusan", YajisanKazusanAssist, "yajikazu"],
    ["Yin-Yang", YinyangAssist, "yinyang"],
];
console.log("Puzz.link database link:");
console.log("https://puzz.link/db/?" + GENRELIST.map(e => "type=" + e[2]).join('&') + "&solved=no&generated=any&variant=no");
console.log("https://pzplus.tck.mn/db?" + GENRELIST.map(e => "type=" + e[2]).join('&') + "&solved=no&generated=any&variant=no");

// main entrance
let initDone = false;
const main = function () {
    GENRENAME = ui.puzzle.info.en;
    if (initDone || GENRENAME === undefined) { return; }
    initDone = true;
    if (document.querySelector("#assist") !== null) { return; }
    console.log(`Puzzle Genre Name: ${GENRENAME}`);
    console.log(`Puzzle Link: ${window.location.href}`);
    console.log("Assistance running...");
    let btnName = "Assist";
    let btn2Name = "Assist Step";
    if (!GENRELIST.some(g => g[0] === GENRENAME)) {
        console.log("Automatically generated assistant.");
        btnName += "(AG)";
        btn2Name += "(AG)";
    }
    let btn = `<button type="button" class="btn" id="assist" style="display: inline;">${btnName}</button>`;
    let btn2 = `<button type="button" class="btn" id="assiststep" style="display: inline;">${btn2Name}</button>`;
    document.querySelector('#btntrial').insertAdjacentHTML('afterend', btn);
    document.querySelector("#assist").insertAdjacentHTML('afterend', btn2);
    document.querySelector("#assist").addEventListener("click", assist, false);
    document.querySelector("#assiststep").addEventListener("click", assiststep, false);
    window.addEventListener("keypress", (event) => {
        if (event.key === 'q' || event.key === 'Q' || event.key === '`') { assist(); }
        if (event.key === 'w' || event.key === 'W') { assiststep(); }
    });
    window.parent.postMessage("Ready to Assist", "*");
    ui.timer.stop();
    ui.timer.start();
};
ui.puzzle.on('ready', main, false);
const initTimer = setInterval(() => {
    if (initDone) {
        clearInterval(initTimer);
        return;
    }
    console.log("Puzz.link Assistance didn't launch. Relaunching...");
    main();
}, 1000);
// for postMessage
window.addEventListener(
    "message",
    (event) => {
        if (event.data === "assist") {
            assist();
        }
        if (event.data === "assiststep") {
            assiststep();
        }
        if (event.data === "undo") {
            ui.puzzle.undo();
        }
        if (event.data === "redo") {
            ui.puzzle.redo();
        }
    },
    false,
);
function assiststep() {
    step = true;
    assist();
}
function assist() {
    stpcnt = 1;
    board = ui.puzzle.board;
    hasInvCrQsub = false;
    loopDir = -1;
    let stpt = -1;
    starttime = (new Date()).valueOf();
    let process_step = function (loop = 0) {
        try {
            if (!stpcnt && !stp2cnt || loop > MAXLOOP) { after_process(); return; }
            stpt += stpcnt;
            stpcnt = stp2cnt = 0;
            if (GENRELIST.some(g => g[0] === GENRENAME)) {
                GENRELIST.find(g => g[0] === GENRENAME)[1]();
            } else { GeneralAssist(); }
            if (step && stpcnt) { after_process(); return; }
            setTimeout(() => { process_step(loop + 1); }, 0);
        } catch (error) {
            if (error.message !== "Step finished." && error.message !== "Timeout.") { console.error(error); }
            else { console.log(error.message); }
            after_process();
        };
    }
    let after_process = function () {
        step = false;
        if (hasInvCrQsub) { forEachCross(cross => cross.setQsub(CRQSUB.none)); }
        ui.puzzle.redraw();
        console.log(`Total deduction: ${stpt + stpcnt}`);
        console.log(`Elapsed Time: ${(new Date()).valueOf() - starttime} ms`);
        let isVariant = ui.puzzle.config.list.variant.val;
        window.parent.postMessage(ui.puzzle.check().complete && !isVariant ? "Solved" : "Not Solved", "*");
        if (ui.puzzle.check().complete) { printBoard(); }
    }
    process_step();
}
function stepcheck(b = true) {
    if (b) { stpcnt++; }
    if (step && stpcnt) { throw new Error("Step finished."); }
    if ((new Date()).valueOf() - starttime > TIMEOUTLIMIT) { throw new Error("Timeout."); }
}
function printBoard() {
    // only some genres are able (i.e. looks good) to show in text.
    let res = "";
    let hasSide = false;
    forEachCell(cell => forEachSide(cell, (nb, nc) => hasSide ||= (!nb.isnull && nb.qans)));
    if (["Slitherlink", "Litherslink", "Myopia"].includes(GENRENAME)) {
        for (let i = 0; i < board.cross.length; i++) {
            let cross = board.cross[i];
            let t;
            t |= cross.adjborder.top.line << 0;
            t |= cross.adjborder.left.line << 1;
            t |= cross.adjborder.bottom.line << 2;
            t |= cross.adjborder.right.line << 3;
            res += "·╹╸┛╻┃┓┫╺┗━┻┏┣┳╋"[t];
            if (cross.bx === board.maxbx) { res += '\n'; }
        }
    } else if (GENRENAME === "Hashiwokakero") {
        forEachCell(cell => {
            res += (() => {
                if (cell.qnum === CQNUM.none && cell.lcnt > 0) {
                    if (cell.adjborder.top.line === 1) return "│";
                    if (cell.adjborder.top.line === 2) return "║";
                    if (cell.adjborder.left.line === 1) return "─";
                    if (cell.adjborder.left.line === 2) return "═";
                }
                if (cell.qnum !== CQNUM.none) {
                    let num = cell.qnum;
                    if (num === CQNUM.quesmark) return "？";
                    if (num >= 0 && num < 10) return "０１２３４５６７８９".split('')[num];
                    if (num >= 10 && num < 100) return num.toString();
                    return "＃";
                }
                return "·";
            })();
            if (cell.bx === board.cols * 2 - 1) { res += '\n'; }
        });
    } else if (hasSide) {
        for (let i = 0; i < board.cross.length; i++) {
            let cross = board.cross[i];
            let t = 0;
            let fn = (c => c.isnull || c.ques === CQUES.wall);
            t |= (fn(offset(cross, -.5, -.5)) ^ fn(offset(cross, +.5, -.5))) << 0;
            t |= (fn(offset(cross, -.5, -.5)) ^ fn(offset(cross, -.5, +.5))) << 1;
            t |= (fn(offset(cross, +.5, +.5)) ^ fn(offset(cross, -.5, +.5))) << 2;
            t |= (fn(offset(cross, +.5, +.5)) ^ fn(offset(cross, +.5, -.5))) << 3;
            t |= (cross.adjborder.top.qans) << 0;
            t |= (cross.adjborder.left.qans) << 1;
            t |= (cross.adjborder.bottom.qans) << 2;
            t |= (cross.adjborder.right.qans) << 3;
            res += "·╹╸┛╻┃┓┫╺┗━┻┏┣┳╋"[t];
            if (cross.bx === board.maxbx) { res += '\n'; }
        }
    } else {
        let color = undefined;
        if (board.roommgr.components !== undefined) { color = Array(board.roommgr.components.length).fill(undefined); }
        // const palette = ["\x1b[31m\x1b[101m", "\x1b[32m\x1b[102m", "\x1b[33m\x1b[103m", "\x1b[36m\x1b[106m"];
        const palette = ["\x1b[101m", "\x1b[102m", "\x1b[103m", "\x1b[106m"];
        if (board.roommgr.components !== undefined) {
            let temp = board.roommgr.getSideAreaInfo().map(([a, b]) => a.id > b.id ? [a.id, b.id] : [b.id, a.id]);
            let edge = Array.from(Array(board.roommgr.components.length), i => []);
            temp.forEach(([a, b]) => edge[a].push(b));
            for (let i = 0; i < color.length;) {
                if (color[i] === undefined) { color[i] = 0; } else { color[i]++; }
                while (edge[i].some(j => color[i] === color[j])) { color[i]++; }
                if (color[i] >= 4) {
                    color[i] = undefined;
                    i--;
                    continue;
                }
                i++;
            }
        }
        let hasNum = false;
        forEachCell(cell => hasNum ||= cell.qnum !== 0);
        forEachCell(cell => {
            if (color !== undefined && cell.room !== null && color[cell.room.id] !== undefined) {
                res += palette[color[cell.room.id]];
            }
            if (isIce(cell)) { res += "\x1b[106m"; }
            res += (() => {
                if (GENRENAME === "Akari") {
                    if (isBlack(cell)) { return "○"; }
                    if (cell.qnum !== CQNUM.none) { return "█"; }
                    return "·";
                }
                if (isBlack(cell) && GENRENAME === "Star Battle") { return "★" };
                if (isBlack(cell) || [CQUES.wall, CQUES.white, CQUES.black].includes(cell.ques)) { return "█"; }
                if (cell.lcnt > 0) {
                    let t;
                    t |= cell.adjborder.top.line << 0;
                    t |= cell.adjborder.left.line << 1;
                    t |= cell.adjborder.bottom.line << 2;
                    t |= cell.adjborder.right.line << 3;
                    return "·╹╸┛╻┃┓┫╺┗━┻┏┣┳╋"[t];
                }
                if (GENRENAME === "No Three") { return "·"; }
                if (GENRENAME === "Shakashaka" && cell.qnum !== CQNUM.none) { return "█"; }
                if (GENRENAME === "Shakashaka" && cell.qans !== CQANS.none) { return "··◣◢◥◤"[cell.qans]; }
                if (cell.anum !== -1) {
                    let num = cell.anum;
                    if (num === CQNUM.quesmark) return "？";
                    if (num >= 0 && num < 10) return "０１２３４５６７８９".split('')[num];
                    if (num >= 10 && num < 100) return num.toString();
                    return "＃";
                }
                if (cell.qnum !== CQNUM.none && cell.qdir !== 0) {
                    let num = cell.qnum;
                    let dir = ".^v<>"[cell.qdir];
                    if (num >= 0 && num < 10) return num.toString() + dir;
                    if (num >= 10 && num < 36) return String.fromCharCode(num - 10 + 65) + dir;
                    if (num >= 36) return "#" + dir;
                }
                if (hasNum && cell.qnum !== CQNUM.none && GENRENAME !== "Heyawake") {
                    let num = cell.qnum;
                    if (num === CQNUM.quesmark) return "？";
                    if (num >= 0 && num < 10) return "０１２３４５６７８９".split('')[num];
                    if (num >= 10 && num < 100) return num.toString();
                    return "＃";
                }
                if (GENRENAME === "Masyu" || GENRENAME === "Yinyang") {
                    if (cell.qnum === CQNUM.bcir || cell.anum === CANUM.bcir) { return "●"; }
                    if (cell.qnum === CQNUM.wcir || cell.anum === CANUM.wcir) { return "○"; }
                }
                return "·";
            })();
            if (isIce(cell)) { res += "\x1b[49m"; }
            if (cell.bx === board.cols * 2 - 1) { res += '\n'; }
        });
    }
    console.log("Solution:\n" + res);
}

const isBlack = c => !c.isnull && c.qans === CQANS.black;
const isntBlack = c => c.isnull || c.qsub === CQSUB.green || c.lcnt > 0;
const isGreen = c => !c.isnull && c.qsub === CQSUB.green;
const isntGreen = c => c.isnull || c.qans === CQANS.black;
const isYellow = c => !c.isnull && c.qsub === CQSUB.yellow;
const isDot = isGreen;
const isIce = c => !c.isnull && c.ques === CQUES.ice && (GENRENAME === "Barns" || GENRENAME.includes("Ice"));
const isFire = c => !c.isnull && c.ques === CQUES.fire && (GENRENAME.includes("Fire"));
const isNum = c => c.qnum !== CQNUM.none && c.qnum !== CQNUM.quesmark;
const isClue = c => c.qnum !== CQNUM.none;
const isSide = b => !b.isnull && (b.qans === 1 || !b.inside || b.ques === 1 || b.sidecell.some(c => c.ques === CQUES.wall));
const isLink = b => !b.isnull && b.qsub === BQSUB.link;
const isntLink = b => b.isnull || isSide(b);
const isLine = b => !b.isnull && b.line === 1;
const isLineAux = b => !b.isnull && b.line === -1;
const isntLine = b => b.isnull || b.qsub === BQSUB.cross;
const isCross = b => !b.isnull && b.qsub === BQSUB.cross;
const isBound = b => b.ques === 1;
const isInside = c => c.bx >= 0 && c.by >= 0 && c.bx <= board.cols * 2 && c.by <= board.rows * 2;
const isEdge = o => o.bx === 0 || o.bx === board.cols * 2 || o.by === 0 || o.by === board.rows * 2;
const isOcell = c => !c.isnull && c.qsub === CQSUB.circle;
const isXcell = c => !c.isnull && c.qsub === CQSUB.cross;

const unique = l => Array.from(new Set(l));
const offset = function (c, dx, dy, dir = 0) { // CCW as in coordinate
    dir = (dir % 4 + 4) % 4;
    if (dir === 0) { return board.getobj(c.bx + dx * 2, c.by + dy * 2); }
    if (dir === 1) { return board.getobj(c.bx + dy * 2, c.by - dx * 2); }
    if (dir === 2) { return board.getobj(c.bx - dx * 2, c.by - dy * 2); }
    if (dir === 3) { return board.getobj(c.bx - dy * 2, c.by + dx * 2); }
}
const adjlist = function (a, b = undefined) {
    if (b === undefined) { return [a.right, a.top, a.left, a.bottom]; }
    return [[a.right, b.right], [a.top, b.top], [a.left, b.left], [a.bottom, b.bottom]];
}
const adjdiaglist = function (c) {
    return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, y]) => offset(c, x, y));
}
const adj8list = function (c) {
    return [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]].map(([x, y]) => offset(c, x, y));
}
const qdirRemap = function (qdir) {
    return [null, 1, 3, 2, 0][qdir];
}
const getShape = function (clist, rot = true) {
    let minx = board.maxbx, miny = board.maxby, maxx = board.minbx, maxy = board.minby;
    for (let i = 0; i < clist.length; i++) {
        minx = Math.min(minx, clist[i].bx);
        miny = Math.min(miny, clist[i].by);
        maxx = Math.max(maxx, clist[i].bx);
        maxy = Math.max(maxy, clist[i].by);
    }
    let s = [[], [], [], [], [], [], [], []];
    for (let y = 0; y <= maxy - miny; y += 2) {
        for (let x = 0; x <= maxx - minx; x += 2) {
            s[0].push(clist.includes(board.getc(minx + x, miny + y)) ? 1 : 0);
            s[1].push(clist.includes(board.getc(minx + x, maxy - y)) ? 1 : 0);
        }
    }
    if (!rot) { return s[0]; }
    for (let x = 0; x <= maxx - minx; x += 2) {
        for (let y = 0; y <= maxy - miny; y += 2) {
            s[4].push(clist.includes(board.getc(minx + x, miny + y)) ? 1 : 0);
            s[5].push(clist.includes(board.getc(minx + x, maxy - y)) ? 1 : 0);
        }
    }
    s[2] = s[1].concat().reverse();
    s[3] = s[0].concat().reverse();
    s[6] = s[5].concat().reverse();
    s[7] = s[4].concat().reverse();
    for (var h = 0; h < 8; h++) {
        s[h] = (h < 4 ? (maxx - minx) / 2 + 1 : (maxy - miny) / 2 + 1) + ":" + s[h].join("");
    }
    s = s.sort();
    return s[0];
}
const cellTrail = function (c, sd, PassLine = false) {
    if (c.isnull) { return []; }
    let nc = offset(c, 1, 0, sd);
    if (nc.isnull) { return [c] };
    let clist = [nc], lstd = sd;
    while (isIce(nc)) { nc = offset(nc, 1, 0, sd); clist.push(nc); }
    while (!nc.isnull && isInside(nc) && nc !== c && (PassLine || nc.lcnt === 0)) {
        let nd;
        let nnc = [0, 1, 2, 3].flatMap(d => {
            if ((lstd + 2) % 4 === d) { return []; }
            let nnb = offset(nc, .5, 0, d);
            let nnc = offset(nc, 1, 0, d);
            let nl = [nnc];
            if (clist.length === 1 && nnc === c) { return []; }
            if (PassLine && nc.lcnt === 1 && !isLine(nnb)) { return []; }
            while (isIce(nnc)) { nnc = offset(nnc, 1, 0, d); nl.push(nnc); }
            if (nnc.isnull || isCross(nnb) || clist.includes(nnc)) { return []; }
            nd = d;
            return [nl];
        });
        if (nnc.length === 1) {
            nc = nnc[0][nnc[0].length - 1];
            lstd = nd;
            clist.push(...nnc[0]);
        }
        else { break; }
    }
    return [c, ...clist];
}
const getCellChunk = function (sc, f = (c, nb, nc) => isLink(nb)) {
    let cl = [];
    let dfs = function (c) {
        if (c.isnull || cl.includes(c)) { return; }
        cl.push(c);
        forEachSide(c, (nb, nc) => {
            if (nc.isnull || !f(c, nb, nc)) { return; }
            dfs(nc);
        });
    };
    dfs(sc);
    return cl;
}
const getBound = function (l) {
    let res = unique(l.flatMap(c => adjlist(c.adjacent)));
    res = res.filter(c => !c.isnull && !l.includes(c));
    return res;
}
let PolyominoBank = [[], [[[0, 0]]]];
const genPolyomino = function (n) {
    if (n < 0) { return null; }
    if (PolyominoBank.length > n) { return PolyominoBank[n]; }
    let p = genPolyomino(n - 1);
    let normalize = l => {
        let mx = Math.min(...l.map(c => c[0]));
        let my = Math.min(...l.map(c => c[1]));
        l = l.map(([x, y]) => [x - mx, y - my]);
        mx = Math.max(...l.map(c => c[0]));
        my = Math.max(...l.map(c => c[1]));
        let ll = [l, l.map(([x, y]) => [mx - x, y])];
        ll = [...ll, ...ll.map(l => l.map(([x, y]) => [x, my - y]))];
        ll = [...ll, ...ll.map(l => l.map(([x, y]) => [y, x]))];
        ll = ll.map(l => l.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));
        ll = ll.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
        return ll[0];
    };
    let s = new Set();
    let res = [];
    p.forEach(l => l.forEach(([x, y]) => [[1, 0], [0, -1], [-1, 0], [0, 1]].forEach(([dx, dy]) => {
        let nx = x + dx, ny = y + dy;
        if (l.some(p => p[0] === nx && p[1] === ny)) { return; }
        let nl = normalize([...l, [nx, ny]]);
        if (s.has(JSON.stringify(nl))) { return; }
        s.add(JSON.stringify(nl));
        res.push(nl);
    })))
    PolyominoBank.push(res);
    return res;
}
const getComb = l => l.reduce((a, b) => a.flatMap(i => b.flatMap(j => [[...i, j]])), [[]]);
const roomId = room => board.roommgr.components.indexOf(room);
const forEachSide = function (c, f = (nb, nc) => { }) {
    for (let d = 0; d < 4; d++) { f(offset(c, .5, 0, d), offset(c, 1, 0, d)); }
}
function forEachCell(f = cell => { }) { for (let i = 0; i < board.cell.length; i++) { f(board.cell[i]); } }
function forEachBorder(f = border => { }) { for (let i = 0; i < board.border.length; i++) { f(board.border[i]); } }
function forEachCross(f = cross => { }) { for (let i = 0; i < board.cross.length; i++) { f(board.cross[i]); } }
function forEachRoom(f = room => { }) {
    if (board.roommgr.components === undefined) { return; }
    for (let i = 0; i < board.roommgr.components.length; i++) { f(board.roommgr.components[i]); }
}
function patternDeduce({ pattern = ["*"], legend = {}, deduce = { "*": () => { } }, rot = true, flip = true } = {}) {
    rot ||= flip;
    let checklist = [], deducelist = [], mx = 0, my = 0;
    for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[i].length; j++) {
            if (legend[pattern[i][j]] !== undefined) {
                checklist.push([j, i, legend[pattern[i][j]]]);
                mx = Math.max(mx, j);
                my = Math.max(my, i);
            }
            if (deduce[pattern[i][j]] !== undefined) {
                deducelist.push([j, i, deduce[pattern[i][j]]]);
                mx = Math.max(mx, j);
                my = Math.max(my, i);
            }
        }
    }
    for (let sx = - mx; sx < board.cols; sx++) {
        for (let sy = - my; sy < board.rows; sy++) {
            let tc;
            tc = (x, y) => board.getc((sx + x) * 2 + 1, (sy + y) * 2 + 1);
            if (checklist.every(([x, y, f]) => f(tc(x, y)))) { deducelist.forEach(([x, y, f]) => f(tc(x, y))); }
            tc = (x, y) => board.getc((sx + mx - x) * 2 + 1, (sy + my - y) * 2 + 1);
            if (rot && checklist.every(([x, y, f]) => f(tc(x, y)))) { deducelist.forEach(([x, y, f]) => f(tc(x, y))); }
            tc = (x, y) => board.getc((sx + mx - x) * 2 + 1, (sy + y) * 2 + 1);
            if (flip && checklist.every(([x, y, f]) => f(tc(x, y)))) { deducelist.forEach(([x, y, f]) => f(tc(x, y))); }
            tc = (x, y) => board.getc((sx + x) * 2 + 1, (sy + my - y) * 2 + 1);
            if (flip && checklist.every(([x, y, f]) => f(tc(x, y)))) { deducelist.forEach(([x, y, f]) => f(tc(x, y))); }
        }
    }
    for (let sx = - my; sx < board.cols; sx++) {
        for (let sy = - mx; sy < board.rows; sy++) {
            let tc;
            tc = (x, y) => board.getc((sx + y) * 2 + 1, (sy + x) * 2 + 1);
            if (flip && checklist.every(([x, y, f]) => f(tc(x, y)))) { deducelist.forEach(([x, y, f]) => f(tc(x, y))); }
            tc = (x, y) => board.getc((sx + my - y) * 2 + 1, (sy + mx - x) * 2 + 1);
            if (flip && checklist.every(([x, y, f]) => f(tc(x, y)))) { deducelist.forEach(([x, y, f]) => f(tc(x, y))); }
            tc = (x, y) => board.getc((sx + y) * 2 + 1, (sy + mx - x) * 2 + 1);
            if (rot && checklist.every(([x, y, f]) => f(tc(x, y)))) { deducelist.forEach(([x, y, f]) => f(tc(x, y))); }
            tc = (x, y) => board.getc((sx + my - y) * 2 + 1, (sy + x) * 2 + 1);
            if (rot && checklist.every(([x, y, f]) => f(tc(x, y)))) { deducelist.forEach(([x, y, f]) => f(tc(x, y))); }
        }
    }
}

// set val
const add_link = function (b) {
    if (b === undefined || b.isnull || b.line || b.qans || b.qsub !== BQSUB.none) { return; }
    b.setQsub(BQSUB.link);
    b.draw();
    stepcheck(isLink(b));
};
const add_cross = function (b) {
    if (b === undefined || b.isnull || b.line && !isLineAux(b) || b.qsub !== BQSUB.none) { return; }
    if (isLineAux(b)) { b.setLineVal(0); }
    b.setQsub(BQSUB.cross);
    b.draw();
    stepcheck(isCross(b));
};
const add_line = function (b) {
    if (b === undefined || b.isnull || b.line && !isLineAux(b) || isCross(b)) { return; }
    b.setLine(1);
    b.draw();
    stepcheck(isLine(b));
};
const add_lineaux = function (b) {
    if (b === undefined || b.isnull || b.line || isCross(b)) { return; }
    b.setLineVal(-1);
    stp2cnt += b.line === -1;
};
const add_side = function (b) {
    if (b === undefined || b.isnull || b.qans || b.qsub === BQSUB.link) { return; }
    b.setQans(1);
    b.draw();
    stepcheck(b.qans);
};
const add_black = function (c, notOnNum = false) {
    if (c === undefined || c.isnull || c.lcnt !== 0 || c.qsub === CQSUB.dot || c.qans !== CQANS.none) { return; }
    if (notOnNum && (c.qnum !== CQNUM.none || c.qnums.length > 0)) { return; }
    c.setQans(CQANS.black);
    c.draw();
    stepcheck(isBlack(c));
};
const add_dot = function (c, notOnNum = true) {
    if (c === undefined || c.isnull || c.qans !== CQANS.none || c.qsub !== CQSUB.none || c.anum !== CANUM.none) { return; }
    if (notOnNum && (c.qnum !== CQNUM.none || c.qnums.length > 0)) { return; }
    c.setQsub(CQSUB.dot);
    c.draw();
    stepcheck(isDot(c) && c.lcnt === 0);
};
const add_green = function (c) {
    if (c === undefined || c.isnull || c.qans !== CQANS.none || c.qsub !== CQSUB.none) { return; }
    c.setQsub(CQSUB.green);
    c.draw();
    stepcheck(isGreen(c));
};
const add_yellow = function (c) {
    if (c === undefined || c.isnull || c.qans !== CQANS.none || c.qsub !== CQSUB.none) { return; }
    c.setQsub(CQSUB.yellow);
    c.draw();
    stepcheck(isYellow(c));
};
const add_inout = function (cr, qsub) {
    if (qsub === 3) { qsub = 1; }
    if (qsub === 0) { qsub = 2; }
    if (cr.isnull || cr.qsub !== CRQSUB.none || qsub === undefined) { return; }
    cr.setQsub(qsub);
    cr.draw();
    stp2cnt += cr.qsub === qsub;
};
const add_number = function (c, n) {
    if (c === undefined || c.isnull || c.anum !== CANUM.none) { return; }
    if (typeof (c.snum) === "object") { c.snum.forEach((_, i) => c.setSnum(i, -1)); }
    c.setAnum(n);
    c.draw();
    if (c.qnum !== CQNUM.none) { stp2cnt += c.anum === n; }
    else { stepcheck(c.anum === n);; }
};
const add_candidate = function (c, l) { // it discards when there are more than 4 cands.
    if (c === undefined || c === null || c.isnull || c.anum !== CANUM.none) { return; }
    l = unique(l.filter(n => n !== -1)).sort((a, b) => a - b);
    if (c.snum.some(n => n !== -1)) { l = l.filter(n => c.snum.includes(n)); }
    // i tried to add more number in snum but something weird keeps happening
    if (l.length === 0 || l.length > 4) { return; }
    if (l.length === 1) { add_number(c, l[0]); return; }
    while (l.length < 4) { l.push(-1); }
    if (c.snum.join(',') === l.join(',')) { return; }
    // if (l.length > 4) { l = [-1, -1, -1, -1, ...l]; }
    l.forEach((n, i) => c.setSnum(i, n));
    c.draw();
    stepcheck(true);
}
const add_candidate_L4 = function (c, l) { // it only records the lowest 4 cands.
    if (c === undefined || c === null || c.isnull || c.anum !== CANUM.none) { return; }
    l = unique(l.filter(n => n !== -1)).sort((a, b) => a - b);
    if (c.snum.some(n => n !== -1)) {
        let maxn = Math.max(...c.snum);
        if (l.length === 4) {
            l = l.concat(c.snum.filter(n => n > l[3]));
            l = l.concat([maxn + 1, maxn + 2, maxn + 3]);
            l = unique(l.filter(n => n !== -1)).sort((a, b) => a - b);
        }
        l = l.filter(n => c.snum.includes(n) || !c.snum.includes(-1) && n > maxn);
    }
    l = l.slice(0, 4);
    if (l.length === 0 || l.length > 4) { return; }
    if (l.length === 1) { add_number(c, l[0]); return; }
    while (l.length < 4) { l.push(-1); }
    if (c.snum.join(',') === l.join(',')) { return; }
    l.forEach((n, i) => c.setSnum(i, n));
    c.draw();
    stepcheck(true);
}
const add_Ocell = function (c, notOnNum = true) {
    if (c === undefined || c.isnull || c.anum !== CANUM.none || c.qsub !== CQSUB.none) { return; }
    if (notOnNum && (c.qnum !== CQNUM.none || c.qnums.length > 0)) { return; }
    c.setQsub(CQSUB.circle);
    c.draw();
    stepcheck(c.qsub === CQSUB.circle);
};
const add_Xcell = function (c, notOnNum = true) {
    if (c === undefined || c.isnull || c.anum !== CANUM.none || c.qsub !== CQSUB.none) { return; }
    if (notOnNum && (c.qnum !== CQNUM.none || c.qnums.length > 0)) { return; }
    c.setQsub(CQSUB.cross);
    c.draw();
    stepcheck(c.qsub === CQSUB.cross);
};
const gray_clue = function (c) {
    if (c === undefined || c.isnull || c.qnum === CQNUM.none && c.qnums.length === 0) { return; }
    c.setQcmp(1);
    c.draw();
}

// single rule deduction
function NShadeInClist({ isShaded = isBlack, isUnshaded = isGreen, add_shaded = add_black, add_unshaded = add_green,
    n, clist, AtLeastOne = false } = {}) {
    clist = clist.filter(c => c !== undefined && !c.isnull);
    if (AtLeastOne && clist.filter(c => !isUnshaded(c)).length === 1) {
        clist.filter(c => !isUnshaded(c)).forEach(c => add_shaded(c));
    }
    if (n < 0) { return; }
    if (clist.filter(c => isShaded(c)).length === n) {
        clist.filter(c => !isShaded(c)).forEach(c => add_unshaded(c));
    }
    if (clist.filter(c => !isUnshaded(c)).length === n) {
        clist.filter(c => !isUnshaded(c)).forEach(c => add_shaded(c));
    }
}
function NShadeConnectedInRoom({ isShaded = isBlack, isUnshaded = isGreen, add_shaded = add_black, add_unshaded = add_green, room, qnum } = {}) {
    if (qnum < 0) { return; }
    let clist = Array.from(room.clist);
    if (qnum === 0) {
        clist.forEach(c => add_unshaded(c));
        return;
    }
    if (clist.filter(c => !isUnshaded(c)).length === qnum) {
        clist.filter(c => !isUnshaded(c)).forEach(c => add_shaded(c));
    }
    // unshade blank parts smaller than clue
    let cset = new Set();
    let blkcnt = 0;
    clist.forEach(c => {
        if (isUnshaded(c) || cset.has(c)) { return; }
        let list = [];
        let dfs = function (c) {
            if (c.isnull || isUnshaded(c) || !clist.includes(c) || cset.has(c)) { return; }
            cset.add(c);
            list.push(c);
            forEachSide(c, (nb, nc) => {
                if (isBound(nb)) { return; }
                dfs(nc);
            })
        };
        dfs(c);
        if (list.length < qnum) {
            list.forEach(c => add_unshaded(c));
        } else { blkcnt++; }
    });
    // unshade cells out of reach
    if (clist.some(c => isShaded(c))) {
        let cset = new Set();
        let t = qnum - clist.filter(c => isShaded(c)).length;
        let queue = clist.flatMap(c => isShaded(c) ? [[c, t]] : []);
        while (queue.length > 0) {
            let [c, t] = queue.shift();
            if (c.room !== room || t < 0 || cset.has(c)) { continue; }
            cset.add(c);
            forEachSide(c, (nb, nc) => {
                if (isBound(nb)) { return; }
                queue.push([nc, t - 1]);
            });
        }
        clist.forEach(c => !cset.has(c) ? add_unshaded(c) : undefined);
    }
    // find shaded cell without given shaded cell
    if (blkcnt === 1) {
        clist.forEach(c => {
            if (isUnshaded(c) || isShaded(c)) { return; }
            let fn = c => c.isnull || c.room !== room || isUnshaded(c);
            if (!([0, 1, 2, 3].some(d => fn(offset(c, -1, 0, d)) && [-1, 0, 1].some(y => fn(offset(c, 1, y, d))) ||
                fn(offset(c, -1, -1, d)) && [[1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]].some(([x, y]) => fn(offset(c, x, y, d)))))) { return; }
            let cset;
            let dfs = function (cc) {
                if (fn(cc) || cset.has(cc) || cc === c) { return; }
                cset.add(cc);
                forEachSide(cc, (nb, nc) => dfs(nc));
            };
            if (adjlist(c.adjacent).every(nc => {
                cset = new Set();
                dfs(nc);
                return cset.size < qnum;
            })) {
                add_shaded(c);
            }
        });
    }
}
function NoDeadendBorder() {
    forEachCross(cross => {
        let list = adjlist(cross.adjborder);
        if (list.some(b => b.isnull)) { return; }
        if (list.filter(b => b.qans).length === 1 &&
            list.filter(b => b.qsub !== BQSUB.link).length === 2) {
            list.forEach(b => add_side(b));
        }
        if (list.filter(b => b.qsub !== BQSUB.link).length === 1) {
            list.forEach(b => add_link(b));
        }
    });
}
function NoCrossingBorder() {
    for (let i = 0; i < board.cross.length; i++) {
        let cross = board.cross[i];
        let list = adjlist(cross.adjborder);
        if (list.filter(b => !b.isnull && b.qans).length === 3) {
            list.forEach(b => add_link(b));
        }
    }
}
function RoomPassOnce({ LengthClue = false, MaybeNotPassed = false } = {}) {
    CellConnected_InRegion({
        isShaded: c => c.lcnt > 0,
        isUnshaded: c => adjlist(c.adjborder).every(b => isntLine(b)),
        add_shaded: () => { },
        add_unshaded: () => { },
        ByLine: true,
    });
    forEachRoom(room => {
        let clist = Array.from(room.clist);
        let qnum = (room.top === undefined ? -1 : room.top.qnum);
        // cross out parts that can't reach in room
        let sc = clist.find(c => c.lcnt > 0);
        if (sc === undefined && MaybeNotPassed) { return; }
        if (sc !== undefined) {
            let cset = new Set();
            let dfs = function (c) {
                if (c.isnull || c.room !== room || cset.has(c)) { return; }
                cset.add(c);
                forEachSide(c, (nb, nc) => {
                    if (nb.isnull || nb.ques || isCross(nb)) { return; }
                    dfs(nc);
                });
            };
            dfs(sc);
            clist.filter(c => !cset.has(c)).forEach(c => { forEachSide(c, (nb, nc) => add_cross(nb)) });
        }
        let oblist = [], iblist = [];
        clist.forEach(cell => {
            forEachSide(cell, (nb, nc) => {
                if (!nc.isnull && nc.room !== room && nb.ques) {
                    oblist.push(nb);
                }
                if (!nc.isnull && nc.room === room && !nb.ques && !iblist.includes(nb)) {
                    iblist.push(nb);
                }
                if (!nc.isnull && nc.room === room && nb.ques && board.roommgr.components.length > 1) {
                    add_cross(nb);
                }
            });
        });
        // 2 lines on whole boundry
        if (oblist.filter(b => isLine(b)).length === 2) {
            oblist.forEach(b => add_cross(b));
        }
        if (oblist.filter(b => !isCross(b)).length === 2) {
            oblist.forEach(b => add_line(b));
        }
        // 1 line between two rooms when there are over 2 rooms
        if (oblist.filter(b => isLine(b)).length === 1 && board.roommgr.components.length > 2) {
            let nroom = oblist.find(b => isLine(b)).sidecell.find(c => c.room !== room).room;
            oblist.forEach(b => b.sidecell.some(c => c.room === nroom) ? add_cross(b) : undefined);
        }
        let crlist = [];
        let e = new Map();
        let v = new Set();
        oblist.forEach(b => {
            let [s, t] = b.sidecross;
            e.set(s, [...(e.get(s) ?? []), t]);
            e.set(t, [...(e.get(t) ?? []), s]);
            v.add(s);
            v.add(t);
        });
        // cell connected
        let ringflg = true;
        for (let i = 0; i < board.cols; i++) {
            ringflg &&= (board.getc(i * 2 + 1, 1).room === room);
            ringflg &&= (board.getc(i * 2 + 1, board.rows * 2 - 1).room === room);
        }
        for (let j = 0; j < board.rows; j++) {
            ringflg &&= (board.getc(1, j * 2 + 1).room === room);
            ringflg &&= (board.getc(board.cols * 2 - 1, j * 2 + 1).room === room);
        }
        if (!ringflg) {
            iblist.forEach(b => {
                if (!b.sidecell.every(c => c.qsub === CQSUB.circle)) { return; }
                if (!b.sidecross.every(cr => v.has(cr) || cr.bx === 0 || cr.by === 0 || cr.bx === board.cols * 2 || cr.by === board.rows * 2)) { return; }
                add_line(b);
            });
        }
        // inside and outside are splited two parts on boundry
        // this part is like the outside in yinyang
        v = Array.from(v);
        let sv = (v.find(cr => e.get(cr).length === 1) ?? v[0]);
        while (sv !== undefined && crlist.length < v.length) {
            crlist.push(sv);
            sv = e.get(sv).find(cr => !crlist.includes(cr));
        }
        let len = crlist.length;
        if (crlist.some(cr => cr.qsub === CRQSUB.in) && crlist.some(cr => cr.qsub === CRQSUB.out)) {
            for (let i = 0; i < len; i++) {
                if (crlist[i].qsub === CRQSUB.none || crlist[(i + 1) % len].qsub !== CRQSUB.none) { continue; }
                for (let j = (i + 1) % len; j != i; j = (j + 1) % len) {
                    if (crlist[j].qsub === CRQSUB.in + CRQSUB.out - crlist[i].qsub) { break; }
                    if (crlist[j].qsub === CRQSUB.none) { continue; }
                    if (crlist[j].qsub === crlist[i].qsub) {
                        for (let k = i; k != j; k = (k + 1) % len) {
                            add_inout(crlist[k], crlist[i].qsub);
                        }
                    }
                }
            }
        }
        // cells that will cross the boundry
        let ocl = clist.filter(c => {
            if (adjlist(c.adjborder).some(b => isLine(b) && isBound(b))) { return true; }
            if (c.lcnt === 1 && adjlist(c.adjborder).every(b => isLine(b) || isntLine(b) || isBound(b))) { return true; }
            return false;
        });
        if (ocl.length === 2) {
            oblist.forEach(b => b.sidecell.every(c => !ocl.includes(c)) ? add_cross(b) : undefined);
        }
        // parity
        if (ocl.length === 1 && LengthClue && qnum > 0 && oblist.filter(b => isLine(b)).length < 2 && board.roommgr.components.length > 1) {
            let p = (ocl[0].bx + ocl[0].by + (qnum % 2 === 1 ? 0 : 2)) % 4;
            clist.forEach(c => {
                if (c === ocl[0]) { return; }
                if ((c.bx + c.by) % 4 === p) { return; }
                forEachSide(c, (nb, nc) => isBound(nb) ? add_cross(nb) : undefined);
            });
        }
        // no exiting without going through every circle
        if (ocl.length === 1 && (clist.some(c => c.qsub === CQSUB.circle && c.lcnt === 0) || qnum > clist.filter(c => c.lcnt > 0).length)) {
            let c = clist.find(c => c.lcnt === 1 && c !== ocl[0] && c.path === ocl[0].path);
            if (!c === undefined) {
                forEachSide(c, (nb, nc) => isBound(nb) ? add_cross(nb) : undefined);
            }
            c = ocl[0];
            if (adjlist(c.adjborder).some(b => isLine(b) && isBound(b))) {
                forEachSide(c, (nb, nc) => isBound(nb) ? add_cross(nb) : undefined);
            }
            if (adjlist(c.adjborder).filter(b => !isBound(b) && !isntLine(b)).length === 1) {
                add_line(adjlist(c.adjborder).find(b => !isBound(b) && !isntLine(b)))
            }
        }
    });
    // Hamiltonian cycle 
    if (board.roommgr.components.length > 2 && !MaybeNotPassed) {
        let g = new Map();
        let blist = [], lset = new Set();
        let DSU = new Map(); // Disjoint Set Union
        let DSUfind = function (n) {
            if (DSU.get(n) !== n) { DSU.set(n, DSUfind(DSU.get(n))); }
            return DSU.get(n);
        };
        forEachBorder(b => {
            if (!isBound(b) || isCross(b) || b.sidecell[0].room === b.sidecell[1].room) { return; }
            let [s, t] = b.sidecell.map(c => roomId(c.room));
            if (!g.has(s)) { g.set(s, new Set()); DSU.set(s, s); }
            if (!g.has(t)) { g.set(t, new Set()); DSU.set(t, t); }
            g.get(s).add(t);
            g.get(t).add(s);
            blist.push(b);
            if (isLine(b)) {
                lset.add(JSON.stringify([s, t]));
                lset.add(JSON.stringify([t, s]));
                DSU.set(DSUfind(s), DSUfind(t));
            }
        });
        let lflg = true;
        while (lflg) {
            lflg = false;
            g.forEach((tset, s) => {
                if (tset.size !== 2) { return; }
                Array.from(tset).forEach(t => {
                    if (!lset.has(JSON.stringify([s, t]))) {
                        lflg = true;
                        lset.add(JSON.stringify([s, t]));
                        lset.add(JSON.stringify([t, s]));
                        DSU.set(DSUfind(s), DSUfind(t));
                    }
                });
            });
            g.forEach((tset, s) => {
                let tl = Array.from(tset).filter(t => !lset.has(JSON.stringify([s, t])));
                tl.forEach(t => {
                    if (tl.length === tset.size - 2 || DSUfind(s) === DSUfind(t) && Array.from(DSU.values()).some(n => DSUfind(n) !== DSUfind(0))) {
                        lflg = true;
                        g.get(s).delete(t);
                        g.get(t).delete(s);
                    }
                });
            });
        }
        blist.forEach(b => {
            let [s, t] = b.sidecell.map(c => roomId(c.room));
            if (!g.get(s).has(t)) { add_cross(b); }
        });
        lset.forEach(e => {
            let l = blist.filter(b => JSON.stringify(b.sidecell.map(c => roomId(c.room)).sort()) === e);
            if (l.length === 1) { add_line(l[0]); }
        });
    }
    // TODO: double bridge / size-2 cut
}
function NoFacingDoor() {
    forEachCell(cell => {
        for (let d = 0; d < 4; d++) {
            if (!isGreen(cell)) { break; }
            let pcell = offset(cell, 1, 0, d);
            let bordercnt = 0;
            let emptyclist = [cell];
            while (!pcell.isnull && !isBlack(pcell) && bordercnt < 2) {
                if (offset(pcell, -.5, 0, d).ques) {
                    bordercnt++;
                }
                emptyclist.push(pcell);
                pcell = offset(pcell, 1, 0, d);
            }
            emptyclist = emptyclist.filter(c => !isGreen(c));
            if (bordercnt === 2 && emptyclist.length === 1) {
                add_black(emptyclist[0]);
            }
        }
    });
}
function No2x2Cell({ isShaded, add_unshaded } = {}) {
    forEachCell(cell => {
        if (!isInside(cell)) { return; }
        let templist = [cell, offset(cell, 1, 0), offset(cell, 0, 1), offset(cell, 1, 1)];
        if (templist.some(c => c.isnull || !isInside(cell))) { return; }
        templist = templist.filter(c => !isShaded(c));
        if (templist.length === 1) {
            add_unshaded(templist[0]);
        }
    });
}
function No2x2Black() {
    No2x2Cell({
        isShaded: isBlack,
        add_unshaded: add_green,
    });
}
function No2x2Green() {
    No2x2Cell({
        isShaded: isGreen,
        add_unshaded: add_black,
    });
}
function CellConnected({ isShaded, isUnshaded, add_shaded, add_unshaded,
    isLinked = (c, nb, nc) => isLine(nb) || isLink(nb),
    isNotPassable = (c, nb, nc) => false,
    cantDivideShade = (s, o) => s > 0,
    isOthers = () => false,
    OutsideAsShaded = false,
    OnlyOneConnected = true,
    ConnectedInRegion = false,
    SizeInRegion = false,
    ForceSearch = false,
    UnshadeEmpty = true,
    DiagDir = false,
    OnlyDiagDir = false,
    Obj = "cell",
    BridgeType = "none" } = {}) {
    let forEachObj = (Obj === "cell" ? forEachCell : forEachCross);
    DiagDir ||= OnlyDiagDir;
    // use Tarjan Algorithm to find cut vertex
    let n = 0;
    let ord = new Map();
    let low = new Map();
    let shdn = new Map();
    let otcn = new Map();
    let cnt = new Map();
    let fth = new Map();
    let vst = new Set();
    let shadelist = [];
    let bridgelist = [];
    // to avoid Maximum call stack size exceeded, manually use a stack to track the cells
    let dfs = function (sc) {
        let stack = [{ cell: sc, father: null, visited: false }];
        while (stack.length > 0) {
            let cur = stack[stack.length - 1];
            let c = cur.cell;
            let f = cur.father;
            let v = cur.visited;
            if (!v) {
                if (!c.isnull && isUnshaded(c) || ord.has(c)) { stack.pop(); continue; }
                if (c.isnull && !OutsideAsShaded) { stack.pop(); continue; }
                ord.set(c, n);
                low.set(n, n);
                shdn.set(n, 0);
                otcn.set(n, 0);
                cnt.set(n, 0);
                fth.set(c, f);
                n++;
                stack[stack.length - 1] = { cell: c, father: f, visited: true };
            } else {
                stack.pop();
            }
            if (!c.isnull) {
                const cellset = new Set();
                let linkdfs = function (c) {
                    if (c.isnull || !isInside(c) || cellset.has(c) || isUnshaded(c)) { return; }
                    cellset.add(c);
                    for (let d = 0; d < 4; d++) {
                        let nb = offset(c, .5, 0, d);
                        let nc = offset(c, 1, 0, d);
                        while (isIce(nc)) { nc = offset(nc, 1, 0, d); }
                        if (isNotPassable(c, nb, nc)) { continue; }
                        if (nb.isnull || nc.isnull) { continue; }
                        if (isLinked(c, nb, nc)) {
                            linkdfs(nc);
                        }
                    }
                }
                linkdfs(c);
                if (!v) {
                    cellset.forEach(cl => {
                        ord.set(cl, ord.get(c));
                        shdn.set(ord.get(c), shdn.get(ord.get(c)) + isShaded(cl));
                        otcn.set(ord.get(c), otcn.get(ord.get(c)) + isOthers(cl));
                        fth.set(cl, f);
                    });
                    cnt.set(ord.get(c), cellset.size);
                }
                let cn = cellset.size;
                let fn = function (c, nb, nc) {
                    if (isNotPassable(c, nb, nc)) { return; }
                    if (nc.isnull && !OutsideAsShaded) { return; }
                    if (nc === f || f !== null && ord.get(f) === ord.get(nc) || isUnshaded(nc)) { return; }
                    if (ord.get(c) === ord.get(nc)) { return; }
                    if (ord.has(nc) && ord.get(nc) < ord.get(c)) {
                        low.set(ord.get(c), Math.min(low.get(ord.get(c)), ord.get(nc)));
                        return;
                    }
                    if (!v) {
                        stack.push({ cell: nc, father: c, visited: false });
                    }
                    if (v && c === fth.get(nc)) {
                        let ordc = ord.get(c);
                        let ordnc = ord.get(nc);
                        low.set(ordc, Math.min(low.get(ordc), low.get(ordnc)));
                        if (!vst.has(ordnc)) {
                            shdn.set(ordc, shdn.get(ordc) + shdn.get(ordnc));
                            otcn.set(ordc, otcn.get(ordc) + otcn.get(ordnc));
                            cnt.set(ordc, cnt.get(ordc) + cnt.get(ordnc));
                            vst.add(ordnc);
                        }
                        if (!cellset.has(sc) && ordc <= low.get(ordnc)) {
                            cn += cnt.get(ordnc);
                            if (cantDivideShade(shdn.get(ordnc), otcn.get(ordnc))) {
                                cellset.forEach(c => shadelist.push(c));
                            }
                        }
                        if (cantDivideShade(shdn.get(ordnc), otcn.get(ordnc)) && ordc < low.get(ordnc)) {
                            bridgelist.push([ordc, ordnc]);
                        }
                    }
                };
                let tmp = new Set();
                for (let c of cellset) {
                    for (let d = 0; d < 4; d++) {
                        if (!OnlyDiagDir) {
                            let nb = offset(c, .5, 0, d);
                            let nc = offset(c, 1, 0, d);
                            while (isIce(nc)) { nc = offset(nc, 1, 0, d); }
                            if (fth.get(nc) === sc) { tmp.add(ord.get(nc)); }
                            fn(c, nb, nc);
                        }
                        if (DiagDir) {
                            let nc = offset(c, 1, 1, d);
                            if (fth.get(nc) === sc) { tmp.add(ord.get(nc)); }
                            fn(c, undefined, nc);
                        }
                    }
                }
                if (ConnectedInRegion && SizeInRegion && c.room.top.qnum >= 0 && Array.from(c.room.clist).filter(c => !isUnshaded(c)).length - cn < c.room.top.qnum) {
                    cellset.forEach(c => shadelist.push(c));
                }
                if (v && c === sc && tmp.size > 1) {
                    cellset.forEach(c => shadelist.push(c));
                }
            }
            if (!v && c.isnull) {
                if (Obj === "cell") {
                    for (let i = 0; i < board.cols; i++) {
                        stack.push({ cell: board.getobj(2 * i + 1, board.minby + 1), father: c, visited: false });
                        stack.push({ cell: board.getobj(2 * i + 1, board.maxby - 1), father: c, visited: false });
                    }
                    for (let i = 0; i < board.rows; i++) {
                        stack.push({ cell: board.getobj(board.minbx + 1, 2 * i + 1), father: c, visited: false });
                        stack.push({ cell: board.getobj(board.maxbx - 1, 2 * i + 1), father: c, visited: false });
                    }
                }
            }
        }
    }
    if (OutsideAsShaded) {
        dfs(board.emptycell);
    } else {
        forEachObj(cell => {
            if (!ForceSearch && (!isShaded(cell) || ord.has(cell))) { return; }
            if (n > 0 && OnlyOneConnected) { return; }
            dfs(cell);
        });
    }
    shadelist.forEach(c => add_shaded(c));
    if (ord.size > 0 && UnshadeEmpty) {
        forEachObj(cell => {
            if (ord.has(cell) || isShaded(cell) || isUnshaded(cell) || isIce(cell)) { return; }
            add_unshaded(cell);
        });
    }
    if (ConnectedInRegion) {
        forEachRoom(room => {
            let clist = Array.from(room.clist);
            if (clist.some(c => isShaded(c))) {
                clist.filter(c => !ord.has(c)).forEach(c => add_unshaded(c));
            }
        });
    }
    bridgelist.forEach(([s, t]) => { // bridge
        let l = Array.from(board.border).filter(b => !isNotPassable(b.sidecell[0], b, b.sidecell[1]) &&
            b.sidecell.map(c => ord.get(c)).sort().join(',') === [s, t].sort().join(','));
        if (l.length === 1 && BridgeType === "line") { l.forEach(b => add_line(b)); }
        if (BridgeType === "link") { l.forEach(b => add_link(b)); }
    });
}
function GreenConnected() {
    CellConnected({
        isShaded: isGreen,
        isUnshaded: isBlack,
        add_shaded: add_green,
        add_unshaded: add_black,
    });
}
function BlackConnected() {
    CellConnected({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
    });
}
function GreenConnectedDiagonally() {
    CellConnected({
        isShaded: isGreen,
        isUnshaded: isBlack,
        add_shaded: add_green,
        add_unshaded: add_black,
        DiagDir: true,
    });
}
function CellConnected_InRegion({ isShaded, isUnshaded, add_shaded, add_unshaded, SizeClue = false, ByLine = false } = {}) {
    CellConnected({
        isShaded: isShaded,
        isUnshaded: isUnshaded,
        add_shaded: add_shaded,
        add_unshaded: add_unshaded,
        isNotPassable: (c, nb, nc) => isBound(nb) || ByLine && isCross(nb),
        BridgeType: ByLine ? "line" : "none",
        OnlyOneConnected: false,
        UnshadeEmpty: false,
        ConnectedInRegion: true,
        SizeInRegion: SizeClue,
    });
    if (SizeClue) {
        forEachRoom(room => NShadeConnectedInRoom({
            isShaded: isShaded,
            isUnshaded: isUnshaded,
            add_shaded: add_shaded,
            add_unshaded: add_unshaded,
            room: room,
            qnum: room.top.qnum,
        }));
    }
}
function BlackConnected_InRegion(SizeClue = false) {
    CellConnected_InRegion({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        SizeClue: SizeClue,
    });
}
function CluePerRegion({ isShaded, isUnshaded, add_shaded = () => { }, add_unshaded = () => { },
    isNotPassable = (c, nb, nc) => false,
    isOthers = () => false,
    cantDivideShade = (s, o) => s === 0 && o > 0,
    BridgeType = "none",
    n = undefined, } = {}) {
    CellConnected({
        isShaded: isShaded,
        isUnshaded: isUnshaded,
        add_shaded: add_shaded,
        add_unshaded: add_unshaded,
        isNotPassable: isNotPassable,
        cantDivideShade: cantDivideShade,
        isOthers: isOthers,
        OnlyOneConnected: false,
        UnshadeEmpty: true,
        BridgeType: BridgeType,
    });
    if (BridgeType === "link" && n !== undefined) {
        let cset = new Set();
        forEachCell(cell => {
            if (isUnshaded(cell) || cset.has(cell)) { return; }
            let cl = getCellChunk(cell, (c, nb, nc) => !isNotPassable(c, nb, nc));
            cl.forEach(c => cset.add(c));
            if (cl.filter(c => isShaded(c)).length === n) {
                cl.forEach(c => forEachSide(c, (nb, nc) => cl.includes(nc) ? add_link(nb) : undefined));
            }
        });
        let ord = new Map();
        let ccn = new Map();
        let nn = 0;
        forEachCell(cell => {
            if (isUnshaded(cell) || ord.has(cell)) { return; }
            nn++;
            let cl = getCellChunk(cell, (c, nb, nc) => isLink(nb));
            cl.forEach(c => forEachSide(c, (nb, nc) => cl.includes(nc) ? add_link(nb) : undefined));
            cl.forEach(c => ord.set(c, nn));
            ccn.set(nn, cl.filter(c => isShaded(c)).length);
        });
        forEachBorder(border => {
            if (border.sidecell.some(c => c.isnull || isUnshaded(c) || !ord.has(c))) { return; }
            let [o1, o2] = border.sidecell.map(c => ord.get(c));
            if (o1 === o2) { return; }
            if (ccn.get(o1) + ccn.get(o2) > n) { add_side(border); }
        });
    }
};
function CellNoLoop({ isShaded, isUnshaded, add_unshaded } = {}) {
    let ord = new Map();
    let n = 0;
    forEachCell(cell => {
        if (!isShaded(cell) || ord.has(cell)) { return; }
        getCellChunk(cell, (c, nb, nc) => isShaded(nc)).forEach(c => ord.set(c, n));
        n++;
    });
    forEachCell(cell => {
        if (isShaded(cell) || isUnshaded(cell)) { return; }
        if (adjlist(cell.adjacent).some(c1 => ord.has(c1) && adjlist(cell.adjacent).some(c2 => c1 !== c2 && ord.get(c1) === ord.get(c2)))) {
            add_unshaded(cell);
        }
    });
}
function GreenNoLoopInCell() {
    CellNoLoop({
        isShaded: isGreen,
        isUnshaded: isBlack,
        add_unshaded: add_black,
    });
}
function BlackNotAdjacent() {
    forEachCell(cell => {
        if (!isBlack(cell)) { return; }
        forEachSide(cell, (nb, nc) => add_green(nc));
    });
}
function BlackNotAdjacent_OverBorder() {
    forEachCell(cell => {
        if (!isBlack(cell)) { return; }
        for (let d = 0; d < 4; d++) {
            let nb = offset(cell, 0.5, 0, d);
            let nc = offset(cell, 1, 0, d)
            if (!nb.isnull && nb.ques) {
                add_green(nc);
            }
        }
    });
}
function BlackDomino() {
    forEachCell(cell => {
        let list = adjlist(cell.adjacent);
        // surrounded by dot
        if (list.every(c => c.isnull || isGreen(c))) {
            add_green(cell);
        }
        // extend domino
        if (isBlack(cell) && list.filter(c => !isntBlack(c)).length === 1) {
            let ncell = list.find(c => !isntBlack(c));
            add_black(ncell);
        }
        // finished domino
        if (isBlack(cell) && list.some(c => isBlack(c))) {
            forEachSide(cell, (nb, nc) => add_dot(nc));
        }
        // not making triomino
        if (list.filter(c => isBlack(c)).length >= 2 || list.every(c => isntBlack(c) || adjlist(c.adjacent).some(cc => isBlack(cc)))) {
            add_green(cell);
        }
        for (let d = 0; d < 4; d++) {
            //  ·      · 
            // ·█  -> ·█ 
            //          ·
            if (isBlack(cell) &&
                (offset(cell, -1, 0, d).isnull || offset(cell, -1, 0, d).qsub === CQSUB.green) &&
                (offset(cell, 0, -1, d).isnull || offset(cell, 0, -1, d).qsub === CQSUB.green)) {
                add_dot(offset(cell, 1, 1, d));
            }
        }
    });
}
function SingleLoopInCell({ isPassable = c => true, isPathable = b => !isCross(b),
    isPass = isDot, isPath = isLine,
    add_notpass = c => { }, add_pass = c => { }, add_notpath = add_cross, add_path = add_line, Directed = false, hasCross = false } = {}) {
    let add_arrow = function (b, dir) {
        if (b === undefined || b.isnull || b.qsub !== BQSUB.none) { return; }
        b.setQsub(dir);
        b.draw();
        stepcheck(true);
    };
    let genlist = c => {
        if (c.adjborder === undefined) { return []; }
        return [[c.adjborder.top, BQSUB.arrow_up, BQSUB.arrow_dn], [c.adjborder.bottom, BQSUB.arrow_dn, BQSUB.arrow_up],
        [c.adjborder.left, BQSUB.arrow_lt, BQSUB.arrow_rt], [c.adjborder.right, BQSUB.arrow_rt, BQSUB.arrow_lt]];
    };
    let hasIn = c => genlist(c).some(([b, o_arr, i_arr]) => !b.isnull && isLine(b) && b.qsub === i_arr);
    let hasOut = c => genlist(c).some(([b, o_arr, i_arr]) => !b.isnull && isLine(b) && b.qsub === o_arr);
    let initied = false;
    forEachCross(cross => { initied ||= cross.qsub === CRQSUB.in || cross.qsub === CRQSUB.none; })
    if (!initied) {
        forEachCross(cross => cross.setQsub(CRQSUB.none));
    }
    let hasIce = false;
    forEachCell(cell => { hasIce ||= isIce(cell); });
    if (!hasIce && !hasCross) {
        CellConnected({
            isShaded: cr => cr.qsub === CRQSUB.in,
            isUnshaded: cr => cr.qsub === CRQSUB.out,
            add_shaded: cr => add_inout(cr, CRQSUB.in),
            add_unshaded: cr => add_inout(cr, CRQSUB.out),
            isLinked: (c, nb, nc) => isCross(nb) || c.qsub === CRQSUB.in && nc.qsub === CRQSUB.in,
            isNotPassable: (c, nb, nc) => isLine(nb),
            Obj: "cross",
        });
        CellConnected({
            isShaded: cr => cr.qsub === CRQSUB.out,
            isUnshaded: cr => cr.qsub === CRQSUB.in,
            add_shaded: cr => add_inout(cr, CRQSUB.out),
            add_unshaded: cr => add_inout(cr, CRQSUB.in),
            isLinked: (c, nb, nc) => isCross(nb) || c.qsub === CRQSUB.out && nc.qsub === CRQSUB.out,
            isNotPassable: (c, nb, nc) => isLine(nb),
            Obj: "cross",
        });
    }
    // don't form a loop of crossed borders when some cells inbetween should be passed
    if ((hasIce || hasCross) && isPass(board.emptycell)) {
        let ord = new Map();
        let n = 0;
        forEachCross(cross => {
            if (ord.has(cross)) { return; }
            n++;
            let DFS = function (cr) {
                if (cr.isnull || ord.has(cr)) { return; }
                ord.set(cr, n);
                for (let d = 0; d < 4; d++) {
                    let ncr = offset(cr, 1, 0, d);
                    if (!ncr.isnull && (isCross(offset(cr, .5, 0, d)) || cr.qsub !== CRQSUB.none && cr.qsub === ncr.qsub)) { DFS(ncr); }
                }
            }
            DFS(cross);
        });
        let m = new Map();
        forEachBorder(border => {
            let t = border.sidecross.map(cr => ord.get(cr)).sort();
            if (t[0] === t[1]) { return; }
            t = t.join(',');
            if (!m.has(t)) { m.set(t, []); }
            m.get(t).push(border);
        });
        Array.from(m).forEach(([_, l]) => {
            // TODO: find a better way to cover all cases
            if (l.length <= 1 || !l.some(c => c.sidecell.every(c => isInside(c) && !isIce(c)))) { return; }
            l.forEach(b => add_line(b));
        });
    }
    forEachCell(cell => {
        if (isIce(cell)) {
            let fn = (b1, b2) => {
                if (isLine(b1)) { add_line(b2); }
                if (b1.isnull || isCross(b1)) { add_cross(b2) };
            }
            for (let d = 0; d < 4; d++) {
                let ncell = cell;
                while (isIce(ncell)) {
                    fn(offset(ncell, .5, 0, d), offset(ncell, -.5, 0, d));
                    ncell = offset(ncell, 1, 0, d);
                }
            }
        }
    });
    let CellNotPassed = [];
    forEachCell(cell => { if (isPass(cell) && cell.lcnt === 0) { CellNotPassed.push(cell); } });
    forEachCell(cell => {
        // avoid forming multiple loop
        if (cell.path !== null && !isIce(cell) && !hasCross) {
            for (let d = 0; d < 4; d++) {
                let ctr = cellTrail(cell, d);
                let ncell = ctr[ctr.length - 1];
                if (cell.lcnt === 1 && ncell.lcnt === 1 && cell.path === ncell.path && (board.linegraph.components.length > 1 || CellNotPassed.some(c => !ctr.includes(c)))) {
                    add_notpath(offset(cell, .5, 0, d));
                }
                if (cell === ncell && board.linegraph.components.length > 1) {
                    add_notpath(offset(cell, .5, 0, d));
                }
            }
        }
    })
    forEachCell(cell => {
        if (!isPassable(cell)) {
            add_notpass(cell);
            forEachSide(cell, (nb, nc) => add_notpath(nb));
        }
        let emptycnt = 0;
        let linecnt = 0;
        forEachSide(cell, (nb, nc) => {
            if (!isPassable(nc) || !isPathable(nb)) { add_notpath(nb); }
            if (!nc.isnull && isPassable(nc) && isPathable(nb)) { emptycnt++; }
            linecnt += isPath(nb);
        });
        if (linecnt > 0) { add_pass(cell); }
        // no branch and no cross
        if (linecnt === 2 && !isIce(cell) && !hasCross) { forEachSide(cell, (nb, nc) => add_notpath(nb)); }
        // no deadend
        if (emptycnt <= 1) { forEachSide(cell, (nb, nc) => add_notpath(nb)); add_notpass(cell); }
        // cross
        if (linecnt === 3 && hasCross) { forEachSide(cell, (nb, nc) => add_path(nb)); }
        // cross between cells in the same group
        if (linecnt === 1 && !hasIce && !hasCross && board.linegraph.components.length > 1) {
            let clist = getCellChunk(cell, (c, nb, nc) => isPath(nb) || isLineAux(nb));
            if (clist.length < Array.from(board.cell).filter(c => c.lcnt > 0).length) {
                forEachSide(cell, (nb, nc) => {
                    if (nb.line === 0 && clist.includes(cell) && clist.includes(nc)) { add_notpath(nb); }
                });
            }
        }
        // 2 degree path
        if (emptycnt === 2 && (linecnt === 1 || isPass(cell))) { forEachSide(cell, (nb, nc) => add_path(nb)); }
        if (!isIce(cell) && !hasCross) {
            let list = adjlist(cell.adjborder, cell.adjacent).map(([nb, nc], d) => {
                while (isIce(nc)) { nc = offset(nc, 1, 0, d); }
                return [nb, nc];
            });
            list = list.filter(([nb, nc]) => !nb.isnull && !nc.isnull && isPathable(nb));
            // surrounded by 1 path
            if (linecnt === 0 && list.length > 0 && list[0][1].path !== null && list.every(([nb, nc]) => nc.path === list[0][1].path &&
                board.linegraph.components.length > 1)) {
                forEachSide(cell, (nb, nc) => add_notpath(nb));
            }
            // ┏╸     ┏╸ 
            // ┃·  -> ┃╺╸
            // ┗╸     ┗╸ 
            if (cell.lcnt === 0 && isPass(cell)) {
                list.forEach(([nb, nc]) => {
                    let t = list.filter(e => e[0] !== nb);
                    if (t[0][1].path !== null && t.every(([nb, nc]) => nc.path === t[0][1].path) &&
                        board.linegraph.components.length > 1) {
                        add_path(nb);
                    }
                });
            }
            // bouncing using lineaux
            // ┏╸     ┏╸  
            // ┃·  -> ┃╺╸ 
            // ┗╸·    ┗╸╺╸
            let glist = list.reduce((acc, [nb, nc]) => {
                if (acc.flat().includes(nc)) { return acc; }
                let clist = getCellChunk(nc, (c, nb, nc) => isPath(nb) || isLineAux(nb));
                clist = clist.filter(c => list.some(([nb, nc]) => nc === c));
                acc.push(clist);
                return acc;
            }, []);
            if (isPass(cell) && !hasIce && !hasCross && glist.length === 2 && adjlist(cell.adjborder).every(nb => nb.line !== -1)) {
                let pathlist = [];
                glist.forEach(clist => {
                    clist.forEach(nc => {
                        let d = [0, 1, 2, 3].find(dd => offset(cell, 1, 0, dd) === nc);
                        add_lineaux(offset(cell, .5, 0, d));
                        if (clist.length === 1 && isPass(nc)) { pathlist.push(offset(cell, .5, 0, d)); }
                    });
                });
                pathlist.forEach(b => add_path(b));
            }
        }
        // extend arrow
        if (Directed && cell.lcnt === 2 && !isIce(cell)) {
            let list = genlist(cell);
            list = list.filter(b => isLine(b[0]));
            if (list.filter(b => b[0].qsub === BQSUB.none).length === 1) {
                if (list[0][0].qsub !== BQSUB.none) {
                    list = [list[1], list[0]];
                }
                if (list[1][0].qsub === list[1][1]) {
                    add_arrow(list[0][0], list[0][2]);
                }
                if (list[1][0].qsub === list[1][2]) {
                    add_arrow(list[0][0], list[0][1]);
                }
            }
        }
        // choose path
        if (Directed && cell.lcnt === 1 && !isIce(cell)) {
            for (let d = 0; d < 4; d++) {
                let ncell = offset(cell, 1, 0, d);
                while (!ncell.isnull && isIce(ncell)) {
                    ncell = offset(ncell, 1, 0, d);
                }
                if (ncell.isnull || ncell.lcnt !== 1 || isLine(offset(ncell, -.5, 0, d))) { continue; }
                if (hasIn(cell) && hasIn(ncell) || hasOut(cell) && hasOut(ncell)) {
                    add_cross(offset(cell, .5, 0, d));
                }
            }
        }
    });
    // this is here because the following two CellConnected may have bug if line on ice isn't fully labeled with arrow
    forEachCell(cell => {
        if (!isIce(cell)) { return; }
        for (let d = 0; d < 4; d++) {
            let pcell = cell;
            while (isIce(pcell) && offset(pcell, .5, 0, d).qsub === BQSUB.cross && offset(pcell, -.5, 0, d).qsub === BQSUB.cross) {
                add_cross(offset(pcell, -.5, 0, d));
                pcell = offset(pcell, -1, 0, d);
            }
            pcell = cell;
            while (isIce(pcell) && isLine(offset(pcell, .5, 0, d)) && (!isLine(offset(pcell, -.5, 0, d)) ||
                offset(pcell, .5, 0, d).qsub !== BQSUB.none && offset(pcell, -.5, 0, d).qsub === BQSUB.none)) {
                add_line(offset(pcell, -.5, 0, d));
                if (offset(pcell, .5, 0, d).qsub !== BQSUB.none) {
                    add_arrow(offset(pcell, -.5, 0, d), offset(pcell, .5, 0, d).qsub);
                }
                pcell = offset(pcell, -1, 0, d);
            }
        }
    });
    if (Directed) {
        // used to avoid all in/out arrow region
        CellConnected({
            isShaded: c => !hasOut(c) && hasIn(c),
            isUnshaded: c => hasOut(c),
            add_shaded: () => { },
            add_unshaded: c => forEachSide(c, (nb, nc) => add_cross(nb)),
            isNotPassable: (c, nb, nc) => isCross(nb),
            OnlyOneConnected: false,
        });
        CellConnected({
            isShaded: c => !hasIn(c) && hasOut(c),
            isUnshaded: c => hasIn(c),
            add_shaded: () => { },
            add_unshaded: c => forEachSide(c, (nb, nc) => add_cross(nb)),
            isNotPassable: (c, nb, nc) => isCross(nb),
            OnlyOneConnected: false,
        });
    }
    add_inout(board.getobj(0, 0), Directed && (hasCross || hasIce) ? .5 : CRQSUB.out);
    const ARR_CRQ = [[BQSUB.arrow_up, CRQSUB.in, false], [BQSUB.arrow_dn, CRQSUB.out, false], [BQSUB.arrow_lt, CRQSUB.out, true], [BQSUB.arrow_rt, CRQSUB.in, true]];
    // add invisible qsub at cross
    if (!hasIce && !hasCross) {
        hasInvCrQsub = true;
        forEachCross(cross => {
            // no checker
            if (cross.qsub === CRQSUB.none) {
                let fn = function (cr, cr1, cr2, cr12) {
                    if (cr1.isnull || cr2.isnull || cr12.isnull) { return; }
                    if (cr1.qsub === CRQSUB.none || cr2.qsub === CRQSUB.none || cr12.qsub === CRQSUB.none) { return; }
                    if (cr1.qsub === cr2.qsub && cr1.qsub !== cr12.qsub) {
                        add_inout(cr, cr1.qsub);
                    }
                };
                for (let d = 0; d < 4; d++) {
                    if (!isIce(offset(cross, .5, .5, d)))
                        fn(cross, offset(cross, 1, 0, d), offset(cross, 0, 1, d), offset(cross, 1, 1, d));
                }
            }
        });
    }
    if (Directed && !hasIce && !hasCross) {
        // determine loop direction
        forEachBorder(border => {
            if (loopDir !== -1) { return; }
            if (![11, 12, 13, 14].includes(border.qsub)) { return; }
            if (border.sidecross[0].qsub !== CRQSUB.none) {
                loopDir = ((border.sidecross[0].qsub) ^ (ARR_CRQ.find(([bq, crq, vert]) => border.qsub === bq)[1]));
            }
            if (border.sidecross[1].qsub !== CRQSUB.none) {
                loopDir = ((border.sidecross[1].qsub) ^ (ARR_CRQ.find(([bq, crq, vert]) => border.qsub === bq)[1]) ^ CRQSUB.inout);
            }
        });
        if (loopDir !== -1) {
            forEachBorder(border => {
                if (![11, 12, 13, 14].includes(border.qsub)) { return; }
                add_inout(border.sidecross[0], ARR_CRQ.find(([bq, crq, vert]) => border.qsub === bq)[1] ^ loopDir);
                add_inout(border.sidecross[1], ARR_CRQ.find(([bq, crq, vert]) => border.qsub === bq)[1] ^ loopDir ^ CRQSUB.inout);
            });
        }
    }
    let crossSet = new Set();
    let dfs = function (cr) {
        if (cr.qsub === CRQSUB.none || crossSet.has(cr)) { return; }
        crossSet.add(cr);
        for (let d = 0; d < 4; d++) {
            let ncr = offset(cr, 1, 0, d);
            let b = offset(cr, .5, 0, d);
            if (ncr.isnull) { continue; }
            if (cr.qsub !== CRQSUB.none) {
                // add line between different i/o
                (() => {
                    if (cr.isnull || ncr.isnull) { return; }
                    if (cr.qsub === CRQSUB.none || ncr.qsub === CRQSUB.none) { return; }
                    if (cr.qsub === ncr.qsub) { add_cross(b); }
                    if (cr.qsub !== ncr.qsub) { add_line(b); }
                    if (cr.qsub !== ncr.qsub && !b.isnull && loopDir !== -1) {
                        add_arrow(b, ARR_CRQ.find(([bq, crq, vert]) => (crq ^ loopDir) === b.sidecross[0].qsub && vert === b.isvert)[0]);
                    }
                })();
                // extend i/o through cross/line
                (() => {
                    if (ncr.isnull) { return; }
                    if (isntLine(b)) { add_inout(ncr, cr.qsub); }
                    if (!b.isnull && isLine(b) && (!Directed || !hasIce && !hasCross)) { add_inout(ncr, cr.qsub ^ CRQSUB.inout); }
                    if (!b.isnull && isLine(b) && b.qsub !== BQSUB.none && Directed) {
                        add_inout(ncr, cr.qsub + ([BQSUB.arrow_up, BQSUB.arrow_lt, BQSUB.arrow_dn, BQSUB.arrow_rt][d] === b.qsub ? 1 : -1));
                    }
                    if ([11, 12, 13, 14].includes(b.qsub) && !b.isnull && loopDir !== -1 && !hasIce && !hasCross) {
                        add_inout(b.sidecross[0], ARR_CRQ.find(([bq, crq]) => bq === b.qsub)[1] ^ loopDir);
                        add_inout(b.sidecross[1], ARR_CRQ.find(([bq, crq]) => bq === b.qsub)[1] ^ loopDir ^ CRQSUB.inout);
                    }
                })();
                dfs(ncr);
            }
        }
    };
    forEachCross(cross => dfs(cross));
}
function SingleLoopInBorder({ useCrossQsub = true } = {}) {
    let add_bgcolor = function (c, color) {
        if (c === undefined || c.isnull || c.qsub !== CQSUB.none || c.qsub === color) { return; }
        c.setQsub(color);
        c.draw();
        stepcheck(true);
    }
    let add_green = function (c) { add_bgcolor(c, CQSUB.green); }
    let add_yellow = function (c) { add_bgcolor(c, CQSUB.yellow); }
    let isYellow = c => c.isnull || c.qsub === CQSUB.yellow;
    CellConnected({
        isShaded: isGreen,
        isUnshaded: isYellow,
        add_shaded: add_green,
        add_unshaded: add_yellow,
        isLinked: (c, nb, nc) => isCross(nb),
        isNotPassable: (c, nb, nc) => isLine(nb),
    });
    CellConnected({
        isShaded: isYellow,
        isUnshaded: isGreen,
        add_shaded: add_yellow,
        add_unshaded: add_green,
        isLinked: (c, nb, nc) => isCross(nb),
        isNotPassable: (c, nb, nc) => isLine(nb),
        OutsideAsShaded: true,
    });
    NoCheckerCell({
        isShaded: isGreen,
        isUnshaded: isYellow,
        add_shaded: add_green,
        add_unshaded: add_yellow,
    });
    // use qsub for each cross to track what it can be
    if (useCrossQsub) {
        hasInvCrQsub = true;
        forEachCross(cross => {
            let qsub;
            if (cross.qsub === 0 || JSON.parse(cross.qsub).length === 0) {
                qsub = [[]];
                let list = adjlist(cross.adjborder);
                for (let i = 0; i < 4; i++) {
                    for (let j = i + 1; j < 4; j++) {
                        if (list[i].isnull || list[j].isnull) { continue; }
                        qsub.push([list[i].id, list[j].id]);
                    }
                }
            } else { qsub = JSON.parse(cross.qsub); }
            qsub = qsub.filter(s => s.every(i => !isCross(board.border[i])));
            forEachSide(cross, (nb, nc) => {
                if (isLine(nb)) { qsub = qsub.filter(s => s.includes(nb.id)); }
                if (qsub.every(s => s.includes(nb.id))) { add_line(nb); }
                if (qsub.every(s => !s.includes(nb.id))) { add_cross(nb); }
            });
            cross.setQsub(JSON.stringify(qsub));
        });
    }
    // connectivity at cross
    forEachCross(cross => {
        let blist = adjlist(cross.adjborder);
        let linecnt = blist.filter(b => isLine(b)).length;
        let crosscnt = blist.filter(b => isCross(b)).length;
        if (linecnt === 2 || crosscnt === 3) {
            blist.forEach(b => add_cross(b));
        }
        if (linecnt === 1 && crosscnt === 2) {
            blist.forEach(b => add_line(b));
        }
    });
    // avoid forming multiple loop
    forEachBorder(border => {
        if (isCross(border) || isLine(border)) { return; }
        let cr1 = border.sidecross[0], cr2 = border.sidecross[1];
        if (cr1.path !== null && cr1.path === cr2.path && board.linegraph.components.length > 1) {
            add_cross(border);
        }
    });
    // deduce color
    forEachCell(cell => {
        // neighbor color
        forEachSide(cell, (nb, nc) => {
            if (isGreen(cell) && isYellow(nc) || isGreen(nc) && isYellow(cell)) { add_line(nb); }
            if (isGreen(cell) && isGreen(nc) || isYellow(cell) && isYellow(nc)) { add_cross(nb); }
        });
        // deduce neighbor color
        if (cell.qsub === CQSUB.none) {
            forEachSide(cell, (nb, nc) => {
                if (isLine(nb) && isYellow(nc) || isCross(nb) && isGreen(nc)) { add_green(cell); }
                if (isCross(nb) && isYellow(nc) || isLine(nb) && isGreen(nc)) { add_yellow(cell); }
            });
        }
        let innercnt = adjlist(cell.adjacent).filter(c => isGreen(c)).length;
        let outercnt = adjlist(cell.adjacent).filter(c => isYellow(c)).length;
        // surrounded by green
        if (innercnt === 4) {
            add_green(cell);
        }
    });
}
function SingleLoopInBlock({ isShaded, isUnshaded, add_shaded, add_unshaded } = {}) {
    // use line because it's not used for cell. 0: outside, 1: inside
    const isMarked = c => c.line !== 0;
    const setSide = (c, n) => c.setLineVal(n);
    const getSide = c => c.line;
    const INSIDE = 3;
    const OUTSIDE = 2;
    const isInside = c => getSide(c) === INSIDE;
    const isOutside = c => getSide(c) === OUTSIDE;
    forEachCell(cell => {
        if (!isUnshaded(cell) || isMarked(cell)) { return; }
        let dfs = function () {
            if (cell.isnull || !isUnshaded(cell) || isMarked(cell)) { return; }
            for (let d = 0; d < 4; d++) {
                let ncell = offset(cell, 1, 0, d);
                if (ncell.isnull) { setSide(cell, OUTSIDE); }
                if (isMarked(ncell)) { setSide(cell, getSide(ncell)); }
                if (isShaded(offset(cell, 1, 0, d)) && isShaded(offset(cell, 0, 1, d)) && isMarked(offset(cell, 1, 1, d))) {
                    setSide(cell, getSide(offset(cell, 1, 1, d)) === OUTSIDE ? INSIDE : OUTSIDE);
                }
                if (isMarked(cell) && [[1, -1], [2, 0], [1, 1]].map(([x, y]) => offset(cell, x, y, d)).some(c => isMarked(c) && getSide(cell) !== getSide(c))) { add_shaded(offset(cell, 1, 0, d)); }
            }
            if (isMarked(cell)) { forEachSide(cell, (nb, nc) => dfs(nc)); }
        };
        dfs(cell);
    });
    CellConnected({
        isShaded: c => isUnshaded(c) && isOutside(c),
        isUnshaded: c => isShaded(c) || isInside(c),
        add_shaded: add_unshaded,
        add_unshaded: () => { },
        OutsideAsShaded: true,
    });
    CellConnected({
        isShaded: c => isUnshaded(c) && isInside(c),
        isUnshaded: c => isShaded(c) || isOutside(c),
        add_shaded: add_unshaded,
        add_unshaded: () => { },
    });
}
function SingleSnakeInCell({ isShaded, isUnshaded, add_shaded, add_unshaded, isHead, isntHead } = {}) {
    CellConnected({
        isShaded: isShaded,
        isUnshaded: isUnshaded,
        add_shaded: add_shaded,
        add_unshaded: add_unshaded,
    });
    CellConnected({
        isShaded: isUnshaded,
        isUnshaded: isShaded,
        add_shaded: add_unshaded,
        add_unshaded: add_shaded,
        OutsideAsShaded: true,
    });
    NoCheckerCell({
        isShaded: isShaded,
        isUnshaded: isUnshaded,
        add_shaded: add_shaded,
        add_unshaded: add_unshaded,
    });
    let heads = [];
    forEachCell(cell => {
        if (isHead(cell) || isShaded(cell) && adjlist(cell.adjacent).filter(c => c.isnull || isUnshaded(c)).length === 3) {
            heads.push(cell);
            add_shaded(cell);
            NShadeInClist({
                isShaded: isShaded,
                isUnshaded: isUnshaded,
                add_shaded: add_shaded,
                add_unshaded: add_unshaded,
                n: 1,
                clist: adjlist(cell.adjacent),
            });
        }
    });
    forEachCell(cell => {
        if (isntHead(cell) || heads.length === 2 && !heads.includes(cell)) {
            if (isShaded(cell)) {
                NShadeInClist({
                    isShaded: isShaded,
                    isUnshaded: isUnshaded,
                    add_shaded: add_shaded,
                    add_unshaded: add_unshaded,
                    n: 2,
                    clist: adjlist(cell.adjacent),
                });
            }
            if (adjlist(cell.adjacent).filter(c => c.isnull || isUnshaded(c)).length === 3) { add_unshaded(cell); }
        }
    });
    const legend = {
        "█": isShaded,
        ".": isUnshaded,
    };
    const deduce = {
        "X": add_shaded,
        "*": add_unshaded,
    };
    const patterns = [
        [" * ", "███", " * "],
        ["*█ ", "██*", " **"],
        ["X█X", "█*█", " * "],
        ["X█ ", "█* ", "  █"],
        ["█ █", " * ", "█  "],
        ["█ █", " * ", " █ "],
    ];
    patterns.forEach(pattern => patternDeduce({ pattern: pattern, legend: legend, deduce: deduce, }));
}
function NoCheckerCell({ isShaded, isUnshaded, add_shaded, add_unshaded } = {}) {
    forEachCell(cell => {
        if (isShaded(cell) || isUnshaded(cell)) { return; }
        let fn = function (c, c1, c2, c12) {
            if (isShaded(c1) && isShaded(c2) && isUnshaded(c12)) {
                add_shaded(c);
            }
            if (isUnshaded(c1) && isUnshaded(c2) && isShaded(c12)) {
                add_unshaded(c);
            }
        };
        for (let d = 0; d < 4; d++) {
            fn(cell, offset(cell, 1, 0, d), offset(cell, 0, 1, d), offset(cell, 1, 1, d));
        }
    });
}
function SightNumber({ isShaded, isUnshaded, add_shaded, add_unshaded, CountItself = true } = {}) {
    forEachCell(cell => {
        let qnum = cell.qnum;
        if (qnum === CQNUM.none || qnum === CQNUM.quesmark) { return; }
        let addone = (CountItself ? 1 : 0);
        let cand = [[], [], [], []];
        // count seen shaded cells
        for (let d = 0; d < 4; d++) {
            if (!isShaded(offset(cell, 1, 0, d))) { cand[d].push(0); }
            let pcell = offset(cell, 1, 0, d), cnt = 1;
            while (!pcell.isnull && !isUnshaded(pcell) && cnt <= qnum) {
                pcell = offset(pcell, 1, 0, d);
                if (!isShaded(pcell)) { cand[d].push(cnt); }
                cnt++;
            }
        }
        if (cand.some(e => e.length === 0)) { return; }
        let comb = [];
        for (let l1 of cand[0]) {
            if (l1 + addone > qnum) { break; }
            for (let l2 of cand[1]) {
                if (l1 + l2 + addone > qnum) { break; }
                for (let l3 of cand[2]) {
                    if (l1 + l2 + l3 + addone > qnum) { break; }
                    let l4 = qnum - (l1 + l2 + l3 + addone);
                    if (!cand[3].includes(l4)) { continue; }
                    comb.push([l1, l2, l3, l4]);
                }
            }
        }
        for (let d = 0; d < 4; d++) {
            let shadedmax = Math.max(...comb.map(c => c[d]), 0);
            let shadedmin = Math.min(...comb.map(c => c[d]), board.rows, board.cols);
            for (let i = 1; i <= shadedmin; i++) {
                add_shaded(offset(cell, i, 0, d));
            }
            if (shadedmax === shadedmin) {
                add_unshaded(offset(cell, shadedmax + 1, 0, d));
            }
        }
    });
}
function SizeRegion_Cell({ isShaded, isUnshaded, add_shaded, add_unshaded, OneNumPerRegion = true, NoUnshadedNum = true } = {}) {
    // TODO: maybe rewrite this someday
    forEachCell(cell => {
        if (NoUnshadedNum && cell.qnum !== CQNUM.none) {
            add_shaded(cell);
        }
        if (OneNumPerRegion && cell.qnum === CQNUM.none && adjlist(cell.adjacent).every(c => c.isnull || isUnshaded(c))) {
            add_unshaded(cell);
        }
        const MAXDFSCELLNUM = 200;
        // don't block region exit
        if (!isShaded(cell) && !isUnshaded(cell) && adj8list(cell).filter(c => isUnshaded(c) || c.isnull).length >= 2) {
            for (let d = 0; d < 4; d++) {
                let ncell = offset(cell, 1, 0, d);
                if (isUnshaded(ncell)) { continue; }
                let clist = [];
                let dfs = function (c) {
                    if (clist.length > MAXDFSCELLNUM) { return; }
                    if (c.isnull || isUnshaded(c) || c === cell || clist.includes(c)) { return; }
                    clist.push(c);
                    forEachSide(c, (nb, nc) => dfs(nc));
                }
                dfs(ncell);
                if (clist.length > MAXDFSCELLNUM) { continue; }
                let templist = clist.filter(c => c.qnum !== CQNUM.none && (NoUnshadedNum || isShaded(c)));
                // extend region without num
                if (templist.length === 0 && clist.some(c => isShaded(c)) && OneNumPerRegion) {
                    add_shaded(cell);
                }
                // extend region with less cells
                if (templist.length >= 1 && templist[0].qnum !== CQNUM.quesmark && templist[0].qnum > clist.length) {
                    add_shaded(cell);
                }
            }
        }
        // finished region
        if (cell.qnum > 0 && isShaded(cell)) {
            let clist = [];
            let dfs = function (c) {
                if (clist.length > cell.qnum) { return; }
                if (c.isnull || !isShaded(c) || clist.includes(c)) { return; }
                clist.push(c);
                forEachSide(c, (nb, nc) => dfs(nc));
            }
            dfs(cell);
            if (clist.length === cell.qnum) {
                clist.forEach(c => forEachSide(c, (nb, nc) => add_unshaded(nc)));
            }
        }
        // finished surrounded region
        if (cell.qnum > 0 && (NoUnshadedNum || isShaded(cell))) {
            let clist = [];
            let dfs = function (c) {
                if (clist.length > cell.qnum) { return; }
                if (c.isnull || isUnshaded(c) || clist.includes(c)) { return; }
                clist.push(c);
                forEachSide(c, (nb, nc) => dfs(nc));
            }
            dfs(cell);
            if (cell.qnum !== CQNUM.quesmark && cell.qnum === clist.length) {
                clist.forEach(c => add_shaded(c));
            }
        }
        // not connect two region
        if (!isShaded(cell) && !isUnshaded(cell)) {
            let clist = [cell];
            let dfs = function (c) {
                if (c.isnull || !isShaded(c) || clist.includes(c)) { return; }
                clist.push(c);
                dfs(c.adjacent.top);
                dfs(c.adjacent.bottom);
                dfs(c.adjacent.left);
                dfs(c.adjacent.right);
            }
            forEachSide(cell, (nb, nc) => dfs(nc));
            let qnumlist = clist.filter(c => c.qnum !== CQNUM.none);
            if (qnumlist.length > 1 && OneNumPerRegion) {
                add_unshaded(cell);
            }
            qnumlist = qnumlist.filter(c => c.qnum !== CQNUM.quesmark);
            if (qnumlist.length > 0 && qnumlist.some(c => c.qnum !== qnumlist[0].qnum)) {
                add_unshaded(cell);
            }
            if (qnumlist.length > 0 && clist.length > qnumlist[0].qnum) {
                add_unshaded(cell);
            }
        }
        // cell and region
        for (let d = 0; d < 4; d++) {
            if (isShaded(cell) || isUnshaded(cell) || cell.qnum === CQNUM.none) { continue; }
            let ncell = offset(cell, 1, 0, d);
            if (ncell.isnull || !isShaded(ncell)) { continue; }
            let clist = [];
            let dfs = function (c) {
                if (c.isnull || !isShaded(c) || clist.includes(c)) { return; }
                clist.push(c);
                forEachSide(c, (nb, nc) => dfs(nc));
            }
            dfs(ncell, clist);
            let templist = clist.filter(c => c.qnum !== CQNUM.none);
            if (templist.length >= 1 && (templist[0].qnum !== CQNUM.quesmark && cell.qnum !== CQNUM.quesmark && templist[0].qnum !== cell.qnum || OneNumPerRegion)) {
                add_unshaded(cell);
            }
            if (cell.qnum !== CQNUM.quesmark && clist.length + 1 > cell.qnum) {
                add_unshaded(cell);
            }
        }
    });
    // unreachable cell
    if (OneNumPerRegion) {
        let cset = new Set();
        let cques = new Set();
        forEachCell(cell => {
            if (cell.qnum === CQNUM.none || cques.has(cell)) { return; }
            let cs = new Set();
            let queue = [[cell, cell.qnum]];
            while (queue.length > 0) {
                let [c, t] = queue.shift();
                if (c.isnull || isUnshaded(c) || t === 0 || cs.has(c)) { continue; }
                cs.add(c);
                cset.add(c);
                if (t < 0) { cques.add(c); }
                forEachSide(c, (nb, nc) => queue.push([nc, t - 1]));
            }
        });
        forEachCell(cell => !cset.has(cell) ? add_unshaded(cell) : undefined);
    }
}
function SizeRegion_Border({ isLinkable = (c, nb, nc) => !nb.isnull && !nc.isnull,
    isSideable = (c, nb, nc) => !nb.isnull && !nc.isnull,
    isGroupable = (sc, c) => true,
    isCon = isLink, isNCon = isSide, add_con = add_link, add_ncon = add_side,
    OneNumPerRegion = false,
    scell = null,
    allSize = null,
    byLine = false,
    hasAnum = false,
} = {}) {
    if (hasAnum && !byLine) {
        forEachCell(cell => {
            if (isNum(cell)) { add_number(cell, cell.qnum); }
            if (cell.anum === CANUM.none) { return; }
            forEachSide(cell, (nb, nc) => {
                if (nb.isnull || nc.isnull) { return; }
                if (nc.anum !== CANUM.none && nc.anum !== cell.anum && isSideable(cell, nb, nc)) { add_side(nb); }
                if (nb.qsub === BQSUB.link) { add_number(nc, cell.anum); }
            });
        });
    }
    let getqn = c => !hasAnum ? c.qnum : c.anum;
    NoDeadendBorder();
    if (scell === null && allSize === null) {
        forEachCell(cell => {
            if (getqn(cell) === CQNUM.none || getqn(cell) === CQNUM.quesmark) { return; }
            let arg = { ...arguments[0] };
            arg.scell = cell;
            SizeRegion_Border(arg);
        });
    }
    let isNear = c => !c.isnull && (scell === null || Math.abs(c.bx - scell.bx) + Math.abs(c.by - scell.by) <= 2 * (allSize ?? getqn(scell)) - 2);
    // use Tarjan Algorithm to find cut vertex
    let n = 0;
    let ord = new Map();
    let low = new Map();
    let cgn = new Map();
    let ctn = new Map();
    let csn = new Map();
    let clg = new Map();
    let clt = new Map();
    let fth = new Map();
    let vst = new Set();
    let linklist = [], sidelist = [];
    // to avoid Maximum call stack size exceeded, manually use a stack to track the cells
    let dfs = function (sc) {
        let stack = [{ cell: sc, father: null, visited: false }];
        while (stack.length > 0) {
            let cur = stack[stack.length - 1];
            let c = cur.cell;
            let f = cur.father;
            let v = cur.visited;
            if (!v) {
                if (ord.has(c)) { stack.pop(); continue; }
                ord.set(c, n);
                low.set(n, n);
                cgn.set(n, 1);
                ctn.set(n, 1);
                csn.set(n, 1);
                clg.set(n, []);
                clt.set(n, []);
                fth.set(c, f);
                n++;
                stack[stack.length - 1] = { cell: c, father: f, visited: true };
            } else {
                stack.pop();
            }
            const cellset = new Set();
            let linkdfs = function (c) {
                if (c.isnull || !isInside(c) || cellset.has(c)) { return; }
                cellset.add(c);
                for (let d = 0; d < 4; d++) {
                    let nb = offset(c, .5, 0, d);
                    let nc = offset(c, 1, 0, d);
                    if (nb.isnull || nc.isnull) { continue; }
                    if (isCon(nb) && isLinkable(c, nb, nc)) {
                        linkdfs(nc);
                    }
                }
            }
            if (byLine) { cellset.add(c); } else { linkdfs(c); }
            if (Array.from(cellset).some(c => {
                if (!isNear(c)) { return true; }
                if (scell !== null && getqn(c) !== CQNUM.none && getqn(c) !== CQNUM.quesmark && getqn(scell) !== getqn(c)) { return true; }
                if (scell !== null && getqn(c) !== CQNUM.none && getqn(c) !== CQNUM.quesmark && scell !== c && OneNumPerRegion) { return true; }
                if (scell !== null && !isGroupable(scell, c)) { return true; }
                return false;
            })) {
                Array.from(cellset).forEach(c => ord.set(c, -1));
                continue;
            }
            if (!v) {
                cellset.forEach(cc => {
                    ord.set(cc, ord.get(c));
                    if (allSize !== null) {
                        clg.set(ord.get(cc), [...clg.get(ord.get(cc)), allSize]);
                        clt.set(ord.get(cc), [...clt.get(ord.get(cc)), allSize]);
                    } else if (getqn(cc) !== CQNUM.none) {
                        clg.set(ord.get(cc), [...clg.get(ord.get(cc)), getqn(cc)]);
                        clt.set(ord.get(cc), [...clt.get(ord.get(cc)), getqn(cc)]);
                    }
                    fth.set(cc, f);
                });
                cgn.set(ord.get(c), cellset.size);
                ctn.set(ord.get(c), cellset.size);
                csn.set(ord.get(c), cellset.size);
            }
            let fn = function (c, nb, nc) {
                if (nc.isnull || isNCon(nb)) { return; }
                if (ord.has(nc) && ord.get(nc) === -1) { return; }
                if (!isCon(nb) && clg.get(ord.get(c)).includes(cellset.size) && isSideable(c, nb, nc)) {
                    sidelist.push(nb);
                    return;
                }
                if (nc === f || f !== null && ord.get(f) === ord.get(nc) || !isLinkable(c, nb, nc)) { return; }
                if (ord.get(c) === ord.get(nc)) { return; }
                if (!isCon(nb) && isSideable(c, nb, nc) && ord.has(nc)) {
                    let cl = clg.get(ord.get(c)), cln = clg.get(ord.get(nc));
                    if (OneNumPerRegion && cl.length > 0 && cln.length > 0) {
                        sidelist.push(nb);
                    }
                    cl = cl.filter(n => n !== CQNUM.quesmark);
                    cln = cln.filter(n => n !== CQNUM.quesmark);
                    if (cl.some(n1 => cln.some(n2 => n1 !== n2))) {
                        sidelist.push(nb);
                    }
                    if ([...cl, ...cln].some(n => n < cgn.get(ord.get(c)) + cgn.get(ord.get(nc)))) {
                        sidelist.push(nb);
                    }
                }
                if (!isLinkable(c, nb, nc)) { return; }
                if (ord.has(nc) && ord.get(nc) < ord.get(c)) {
                    low.set(ord.get(c), Math.min(low.get(ord.get(c)), ord.get(nc)));
                    return;
                }
                if (!v && nc.ques !== CQUES.wall) {
                    stack.push({ cell: nc, father: c, visited: false });
                }
                if (v && c === fth.get(nc)) {
                    let ordc = ord.get(c);
                    let ordnc = ord.get(nc);
                    low.set(ordc, Math.min(low.get(ordc), low.get(ordnc)));
                    if (!vst.has(ordnc)) {
                        ctn.set(ordc, ctn.get(ordc) + ctn.get(ordnc));
                        clt.set(ordc, [...clt.get(ordc), ...clt.get(ordnc)]);
                        if (ordc <= low.get(ordnc)) { csn.set(ordc, csn.get(ordc) + ctn.get(ordnc)); }
                        vst.add(ordnc);
                    }
                    if (ordc < low.get(ordnc)) {
                        linklist.push([c, nb, nc]);
                    }
                }
            };
            for (let c of cellset) {
                for (let d = 0; d < 4; d++) {
                    let nb = offset(c, .5, 0, d);
                    let nc = offset(c, 1, 0, d);
                    fn(c, nb, nc);
                }
            }
        }
    }
    forEachCell(cell => {
        if (ord.has(cell) || cell.ques === CQUES.wall) { return; }
        if (scell !== null && scell !== cell) { return; }
        sidelist = [];
        linklist = [];
        dfs(cell);
        Array.from(ord).forEach(([c, n]) => {
            if (n === -1) { return; }
            if (scell !== null && getqn(cell) > ctn.get(ord.get(cell)) - csn.get(n) && hasAnum) { add_number(c, getqn(cell)); }
        })
        sidelist.forEach(b => ord.get(b.sidecell[0]) !== ord.get(b.sidecell[1]) ? add_ncon(b) : undefined);
        linklist.forEach(([c, nb, nc]) => {
            const ordc = ord.get(c);
            const ordnc = ord.get(nc);
            let siz = function (cl) {
                if (OneNumPerRegion) {
                    cl = cl.map(n => n === CQNUM.quesmark ? 1 : n);
                }
                if (!OneNumPerRegion) {
                    cl = cl.filter(n => n !== CQNUM.quesmark);
                    cl = unique(cl);
                }
                return cl.reduce((a, b) => a + b, 0);
            }
            let cl = [...clt.get(ordnc)];
            if (scell === null && siz(cl) > ctn.get(ordnc)) { add_con(nb); }
            if (scell === null && !cl.includes(CQNUM.quesmark) && OneNumPerRegion) {
                if (siz(cl) === ctn.get(ordnc) && isSideable(c, nb, nc)) { add_ncon(nb); }
                if (siz(cl) !== ctn.get(ordnc) && isLinkable(c, nb, nc)) { add_con(nb); }
            }
            if (allSize !== null) {
                if (ctn.get(ordnc) % allSize === 0 && isSideable(c, nb, nc)) { add_ncon(nb); }
                if (ctn.get(ordnc) % allSize !== 0 && isLinkable(c, nb, nc)) { add_con(nb); }
            }
            const acl = clt.get(ord.get(cell));
            const an = ctn.get(ord.get(cell));
            let ocl = [];
            acl.forEach(n => {
                if (cl.includes(n)) { cl.splice(cl.indexOf(n), 1); }
                else { ocl.push(n); }
            });
            if (siz(ocl) > an - ctn.get(ordnc)) { add_con(nb); }
            if (scell === null && !ocl.includes(CQNUM.quesmark) && OneNumPerRegion) {
                if (siz(ocl) === an - ctn.get(ordnc) && isSideable(c, nb, nc)) { add_ncon(nb); }
                if (siz(ocl) !== an - ctn.get(ordnc) && isLinkable(c, nb, nc)) { add_con(nb); }
            }
        });
    });
    if (scell !== null && ord.size === getqn(scell) && !byLine) {
        let clist = Array.from(ord.keys());
        clist.forEach(c => {
            adjlist(c.adjborder, c.adjacent).filter(([nb, nc]) => ord.has(nc)).forEach(([nb, nc]) => add_con(nb));
        });
    }
}
function StripRegion_cell({ isShaded, add_unshaded } = {}) {
    forEachCell(cell => {
        let templist = [cell, offset(cell, 1, 0), offset(cell, 0, 1), offset(cell, 1, 1)];
        if (templist.some(c => c.isnull)) { return; }
        // can't be over 2 shades in each 2*2
        if (templist.filter(c => isShaded(c)).length === 2) {
            templist.forEach(c => add_unshaded(c));
        }
    });
}
function RectRegion_Cell({ isShaded, isUnshaded, add_shaded, add_unshaded, isSizeAble = (w, h, sc, c) => true } = {}) {
    forEachCell(cell => {
        if (isShaded(cell) || isUnshaded(cell)) { return; }
        // can't be exactly 3 shades in each 2*2
        let fn = function (list) {
            if (list.some(c => c.isnull)) { return; }
            if (list.filter(c => isShaded(c)).length === 2 && list.filter(c => isUnshaded(c)).length === 1) {
                add_unshaded(cell);
            }
            if (list.filter(c => isShaded(c)).length === 3 && list.filter(c => isUnshaded(c)).length === 0) {
                add_shaded(cell);
            }
        };
        for (let d = 0; d < 4; d++) {
            fn([offset(cell, 1, 0, d), offset(cell, 0, 1, d), offset(cell, 1, 1, d)]);
        }
    });
    // record the (un)shade count in (0,0) to (a,b)
    let scnt = Array.from(new Array(board.rows), () => new Array(board.cols).fill(0));
    let ucnt = Array.from(new Array(board.rows), () => new Array(board.cols).fill(0));
    for (let i = 0; i < board.rows; i++) {
        for (let j = 0; j < board.cols; j++) {
            scnt[i][j] = (b => isShaded(b) ? 1 : 0)(board.getc(2 * j + 1, 2 * i + 1));
            scnt[i][j] += (i > 0 ? scnt[i - 1][j] : 0) + (j > 0 ? scnt[i][j - 1] : 0) - (i > 0 && j > 0 ? scnt[i - 1][j - 1] : 0);
            ucnt[i][j] = (b => isUnshaded(b) ? 1 : 0)(board.getc(2 * j + 1, 2 * i + 1));
            ucnt[i][j] += (i > 0 ? ucnt[i - 1][j] : 0) + (j > 0 ? ucnt[i][j - 1] : 0) - (i > 0 && j > 0 ? ucnt[i - 1][j - 1] : 0);
        }
    }
    // check if there can be a rectangle exactly between c1 and c2
    let isRectAble = function (c1, c2) {
        if (c1.isnull || c2.isnull) { return 0; }
        let [x1, x2] = [(c1.bx - 1) / 2, (c2.bx - 1) / 2].sort((x, y) => x - y);
        let [y1, y2] = [(c1.by - 1) / 2, (c2.by - 1) / 2].sort((x, y) => x - y);
        let f = (a, b) => a < 0 || b < 0 ? 0 : ucnt[Math.min(a, board.rows - 1)][Math.min(b, board.cols - 1)];
        return f(y2, x2) - f(y1 - 1, x2) - f(y2, x1 - 1) + f(y1 - 1, x1 - 1) === 0;
    }
    let isRectAble2 = function (c1, c2, dir = ['L', 'U', 'R', 'D']) {
        if (c1.isnull || c2.isnull) { return 0; }
        let [x1, x2] = [(c1.bx - 1) / 2, (c2.bx - 1) / 2].sort((x, y) => x - y);
        let [y1, y2] = [(c1.by - 1) / 2, (c2.by - 1) / 2].sort((x, y) => x - y);
        let f = (a, b) => a < 0 || b < 0 ? 0 : scnt[Math.min(a, board.rows - 1)][Math.min(b, board.cols - 1)];
        if (dir.includes('L') && f(y2, x1 - 1) - f(y2, x1 - 2) - f(y1 - 1, x1 - 1) + f(y1 - 1, x1 - 2) !== 0) { return false; }
        if (dir.includes('U') && f(y1 - 1, x2) - f(y1 - 2, x2) - f(y1 - 1, x1 - 1) + f(y1 - 2, x1 - 1) !== 0) { return false; }
        if (dir.includes('R') && f(y2, x2 + 1) - f(y2, x2) - f(y1 - 1, x2 + 1) + f(y1 - 1, x2) !== 0) { return false; }
        if (dir.includes('D') && f(y2 + 1, x2) - f(y2, x2) - f(y2 + 1, x1 - 1) + f(y2, x1 - 1) !== 0) { return false; }
        return true;
    }
    forEachCell(cell => {
        if (!isShaded(cell) && cell.qnum <= 0) { return; }
        if (isShaded(cell.adjborder.top)) { return; }
        if (isShaded(cell.adjborder.left)) { return; }
        let wid = 1, hei = 1;
        while (isShaded(offset(cell, wid, 0))) { wid++; }
        while (isShaded(offset(cell, 0, hei))) { hei++; }
        let sc = null;
        for (let dx = 0; dx < wid; dx++) {
            for (let dy = 0; dy < hei; dy++) {
                if (offset(cell, dx, dy).qnum >= 0) {
                    sc = offset(cell, dx, dy);
                }
            }
        }
        let rectlist = [];
        for (let dl = 0; isRectAble(offset(cell, dl, 0), offset(cell, 0, 0)); dl--) {
            if (!isRectAble2(offset(cell, dl, 0), offset(cell, 0, 0), ['L'])) { continue; }
            for (let dr = wid - 1; isRectAble(offset(cell, dl, 0), offset(cell, dr, 0)); dr++) {
                if (!isRectAble2(offset(cell, dl, 0), offset(cell, dr, 0), ['L', 'R'])) { continue; }
                for (let du = 0; isRectAble(offset(cell, dl, du), offset(cell, dr, 0)); du--) {
                    if (!isRectAble2(offset(cell, dl, du), offset(cell, dr, 0), ['L', 'R', 'U'])) { continue; }
                    for (let dd = hei - 1; isRectAble(offset(cell, dl, du), offset(cell, dr, dd)); dd++) {
                        if (!isRectAble2(offset(cell, dl, du), offset(cell, dr, dd))) { continue; }
                        if (!isSizeAble(dr - dl + 1, dd - du + 1, sc, offset(cell, dl, du))) { continue; }
                        rectlist.push({ dl: dl, du: du, dr: dr, dd: dd });
                    }
                }
            }
        }
        if (!isShaded(cell) && rectlist.length === 0) {
            add_unshaded(cell);
        }
        if (!isShaded(cell) || rectlist.length === 0) { return; }
        let ml = Math.max(...rectlist.map(obj => obj.dl));
        let mu = Math.max(...rectlist.map(obj => obj.du));
        let mr = Math.min(...rectlist.map(obj => obj.dr));
        let md = Math.min(...rectlist.map(obj => obj.dd));
        for (let j = ml; j <= mr; j++) { add_shaded(offset(cell, j, 0)); }
        for (let j = mu; j <= md; j++) { add_shaded(offset(cell, 0, j)); }
        if (rectlist.every(obj => obj.dl === ml)) { add_unshaded(offset(cell, ml - 1, 0)); }
        if (rectlist.every(obj => obj.dr === mr)) { add_unshaded(offset(cell, mr + 1, 0)); }
        if (rectlist.every(obj => obj.du === mu)) { add_unshaded(offset(cell, 0, mu - 1)); }
        if (rectlist.every(obj => obj.dd === md)) { add_unshaded(offset(cell, 0, md + 1)); }
    });
}
function RectRegion_Border({ doTrial = true, isSizeAble = (w, h, sc, c) => true } = {}) {
    let isLink = b => !b.isnull && b.qsub === BQSUB.link;
    let isSide = b => b.isnull || b.qans;
    for (let i = 0; i < board.cross.length; i++) {
        let cross = board.cross[i];
        for (let d = 0; d < 4; d++) {
            //  ×      × 
            // ×·  -> ×·×
            //         × 
            let b1 = offset(cross, .5, 0, d);
            let b2 = offset(cross, 0, -.5, d);
            if (isLink(b1) && isLink(b2)) {
                add_link(offset(cross, -.5, 0, d));
                add_link(offset(cross, 0, +.5, d));
            }
            //  ┃      ┃ 
            // ×╹  -> ×┃ 
            //         ┃ 
            if (isSide(b1) && isLink(b2)) {
                add_side(offset(cross, -.5, 0, d));
            }
            //  ×      × 
            // ━╸  -> ━━━
            //           
            if (isLink(b1) && isSide(b2)) {
                add_side(offset(cross, 0, +.5, d));
            }
            //  ┃      ┃ 
            //  ╹  -> ━┻━
            //  ×      × 
            b2 = offset(cross, -.5, 0, d);
            if (isSide(b1) && isLink(b2)) {
                add_side(offset(cross, 0, -.5, d));
                add_side(offset(cross, 0, +.5, d));
            }
        }
    }
    if (!doTrial) { return; }
    // record the sides count in (0,0) to (a,b); s1 for horizontal side, s2 for vertical side
    const s1 = Array.from(new Array(board.rows), () => new Array(board.cols).fill(0));
    const s2 = Array.from(new Array(board.rows), () => new Array(board.cols).fill(0));
    // record the links count in a row; l1 for vertical link, l2 for horizontal link
    const l1 = Array.from(new Array(board.rows), () => new Array(board.cols).fill(0));
    const l2 = Array.from(new Array(board.rows), () => new Array(board.cols).fill(0));
    for (let i = 0; i < board.rows; i++) {
        for (let j = 0; j < board.cols; j++) {
            s1[i][j] = (b => !b.isnull && b.qans ? 1 : 0)(board.getb(2 * j + 1, 2 * i));
            s2[i][j] = (b => !b.isnull && b.qans ? 1 : 0)(board.getb(2 * j, 2 * i + 1));
            s1[i][j] += (i > 0 ? s1[i - 1][j] : 0) + (j > 0 ? s1[i][j - 1] : 0) - (i > 0 && j > 0 ? s1[i - 1][j - 1] : 0);
            s2[i][j] += (i > 0 ? s2[i - 1][j] : 0) + (j > 0 ? s2[i][j - 1] : 0) - (i > 0 && j > 0 ? s2[i - 1][j - 1] : 0);
            l1[i][j] = (b => !b.isnull && b.qsub === BQSUB.link ? 1 : 0)(board.getb(2 * j + 1, 2 * i));
            l2[i][j] = (b => !b.isnull && b.qsub === BQSUB.link ? 1 : 0)(board.getb(2 * j, 2 * i + 1));
            l1[i][j] += (j > 0 ? l1[i][j - 1] : 0);
            l2[i][j] += (i > 0 ? l2[i - 1][j] : 0);
        }
    }
    // check if there can be a rectangle exactly between c1 and c2
    let isRectAble = function (c1, c2) {
        if (c1.isnull || c2.isnull) { return 0; }
        let [x1, x2] = [(c1.bx - 1) / 2, (c2.bx - 1) / 2].sort((x, y) => x - y);
        let [y1, y2] = [(c1.by - 1) / 2, (c2.by - 1) / 2].sort((x, y) => x - y);
        let f1 = (a, b) => a < 0 || b < 0 ? 0 : s1[a][b];
        let f2 = (a, b) => a < 0 || b < 0 ? 0 : s2[a][b];
        return f1(y2, x2) - f1(y1, x2) - f1(y2, x1 - 1) + f1(y1, x1 - 1)
            + f2(y2, x2) - f2(y1 - 1, x2) - f2(y2, x1) + f2(y1 - 1, x1) === 0;
    }
    let isRectAble2 = function (c1, c2, dir = ['L', 'U', 'R', 'D']) {
        if (c1.isnull || c2.isnull) { return 0; }
        let [x1, x2] = [(c1.bx - 1) / 2, (c2.bx - 1) / 2].sort((x, y) => x - y);
        let [y1, y2] = [(c1.by - 1) / 2, (c2.by - 1) / 2].sort((x, y) => x - y);
        let g1 = (a, b) => a < 0 || b < 0 || a >= board.rows || b >= board.cols ? 0 : l1[a][b];
        let g2 = (a, b) => a < 0 || b < 0 || a >= board.rows || b >= board.cols ? 0 : l2[a][b];
        if (dir.includes('L') && g2(y2, x1) - g2(y1 - 1, x1) !== 0) { return false; }
        if (dir.includes('U') && g1(y1, x2) - g1(y1, x1 - 1) !== 0) { return false; }
        if (dir.includes('R') && g2(y2, x2 + 1) - g2(y1 - 1, x2 + 1) !== 0) { return false; }
        if (dir.includes('D') && g1(y2 + 1, x2) - g1(y2 + 1, x1 - 1) !== 0) { return false; }
        return true;
    }
    let emptycnt = 0;
    forEachCell(c => { if (adjlist(c.adjborder).every(b => b.isnull || b.qsub !== BQSUB.link)) emptycnt++; });
    forEachCell(cell => {
        if (isLink(cell.adjborder.top)) { return; }
        if (isLink(cell.adjborder.left)) { return; }
        let wid = 1, hei = 1;
        while (isLink(offset(cell, wid - .5, 0))) { wid++; }
        while (isLink(offset(cell, 0, hei - .5))) { hei++; }
        let sc = null;
        for (let dx = 0; dx < wid; dx++) {
            for (let dy = 0; dy < hei; dy++) {
                if (offset(cell, dx, dy).qnum >= 0) {
                    sc = offset(cell, dx, dy);
                }
            }
        }
        if ([offset(cell, -.5, 0), offset(cell, 0, -.5), offset(cell, wid - .5, 0), offset(cell, 0, hei - .5)]
            .every(b => b.isnull || b.qans)) { return; }
        // ignore empty cell when there are too many
        if (emptycnt > 500 && sc === null) { return; }
        let rectlist = [];
        for (let dl = 0; isRectAble(offset(cell, dl, 0), offset(cell, 0, 0)); dl--) {
            if (!isRectAble2(offset(cell, dl, 0), offset(cell, 0, 0), ['L'])) { continue; }
            for (let dr = wid - 1; isRectAble(offset(cell, dl, 0), offset(cell, dr, 0)); dr++) {
                if (!isRectAble2(offset(cell, dl, 0), offset(cell, dr, 0), ['L', 'R'])) { continue; }
                for (let du = 0; isRectAble(offset(cell, dl, du), offset(cell, dr, 0)); du--) {
                    if (!isRectAble2(offset(cell, dl, du), offset(cell, dr, 0), ['L', 'R', 'U'])) { continue; }
                    for (let dd = hei - 1; isRectAble(offset(cell, dl, du), offset(cell, dr, dd)); dd++) {
                        if (!isRectAble2(offset(cell, dl, du), offset(cell, dr, dd))) { continue; }
                        if (!isSizeAble(dr - dl + 1, dd - du + 1, sc, offset(cell, dl, du))) { continue; }
                        rectlist.push({ dl: dl, du: du, dr: dr, dd: dd });
                    }
                }
            }
        }
        if (rectlist.length === 0) { return; }
        let ml = Math.max(...rectlist.map(obj => obj.dl));
        let mu = Math.max(...rectlist.map(obj => obj.du));
        let mr = Math.min(...rectlist.map(obj => obj.dr));
        let md = Math.min(...rectlist.map(obj => obj.dd));
        for (let j = ml; j < mr; j++) { add_link(offset(cell, j + .5, 0)); }
        for (let j = mu; j < md; j++) { add_link(offset(cell, 0, j + .5)); }
        if (rectlist.every(obj => obj.dl === ml)) { add_side(offset(cell, ml - .5, 0)); }
        if (rectlist.every(obj => obj.dr === mr)) { add_side(offset(cell, mr + .5, 0)); }
        if (rectlist.every(obj => obj.du === mu)) { add_side(offset(cell, 0, mu - .5)); }
        if (rectlist.every(obj => obj.dd === md)) { add_side(offset(cell, 0, md + .5)); }
    });
}
function LatinSquare({ hasBox = false, ext = (c, cand) => cand } = {}) {
    let size = Math.max(board.rows, board.cols);
    forEachCell(cell => {
        if (cell.anum !== -1) { return; }
        let arr = () => Array(size).fill().map((_, i) => i + 1);
        let cand = arr(), row = [], col = [];
        if (cell.snum.some(n => n !== -1)) { cand = cell.snum.filter(n => n !== -1); }
        for (let i = 0; i < size; i++) {
            row.push(board.getc(i * 2 + 1, cell.by));
            col.push(board.getc(cell.bx, i * 2 + 1));
        }
        let fn = function (clist) {
            let a = arr();
            clist.forEach((c, i) => {
                if (cell === c || c.isnull) { return; }
                let b = c.anum === -1 && c.snum.every(n => n === -1);
                a = b ? [] : a.filter(n => n !== c.anum && !c.snum.includes(n));
                if (c.anum !== -1) { cand = cand.filter(n => n !== c.anum); }
                if (c.anum === -1 && c.snum.filter(n => n !== -1).length > 0) {
                    for (let j = i + 1; j < clist.length; j++) {
                        let c2 = clist[j];
                        if (cell === c2 || c2.isnull || c2.anum !== -1 || c2.snum.every(n => n === -1)) { continue; }
                        let l2 = new Set([...c.snum, ...c2.snum].filter(n => n !== -1));
                        if (l2.size === 2) {
                            cand = cand.filter(n => !l2.has(n));
                        }
                        for (let k = j + 1; k < clist.length; k++) {
                            let c3 = clist[k];
                            if (cell === c3 || c3.isnull || c3.anum !== -1 || c3.snum.every(n => n === -1)) { continue; }
                            let l3 = new Set([...c.snum, ...c2.snum, ...c3.snum].filter(n => n !== -1));
                            if (l3.size === 3) {
                                cand = cand.filter(n => !l3.has(n));
                            }
                            for (let l = k + 1; l < clist.length; l++) {
                                let c4 = clist[l];
                                if (cell === c4 || c4.isnull || c4.anum !== -1 || c4.snum.every(n => n === -1)) { continue; }
                                let l4 = new Set([...c.snum, ...c2.snum, ...c3.snum, ...c4.snum].filter(n => n !== -1));
                                if (l4.size === 4) {
                                    cand = cand.filter(n => !l4.has(n));
                                }
                            }
                        }
                    }
                }
            });
            if (clist.every(c => !c.isnull) && a.length === 1) { add_number(cell, a[0]); }
        }
        fn(row); fn(col);
        if (hasBox) { fn(Array.from(cell.room.clist)); }
        cand = ext(cell, cand);
        add_candidate(cell, cand);
    });
}

// see all checks from ui.puzzle.pzpr.common.AnsCheck.prototype
// see used checks from ui.puzzle.checker.checklist_normal
function GeneralAssist() {
    const checklist = ui.puzzle.checker.checklist_normal;
    const numberRemainsUnshaded = ui.puzzle.board.cell[0].numberRemainsUnshaded;
    let isGreen = c => !c.isnull && c.qsub === CQSUB.green;
    if (numberRemainsUnshaded) {
        isGreen = c => c.qsub === CQSUB.dot || c.qnum !== CQNUM.none;
        add_green = add_dot;
    }
    if (checklist.some(f => f.name === "checkCountinuousUnshadeCell")) {
        NoFacingDoor();
    }
    if (checklist.some(f => f.name === "checkConnectShade")) {
        CellConnected({
            isShaded: isBlack,
            isUnshaded: isGreen,
            add_shaded: add_black,
            add_unshaded: add_green,
        });
    }
    if (checklist.some(f => f.name === "checkConnectUnshadeRB" || f.name === "checkConnectUnshade")) {
        CellConnected({
            isShaded: isGreen,
            isUnshaded: isBlack,
            add_shaded: add_green,
            add_unshaded: add_black,
        });
    }
    if (checklist.some(f => f.name === "checkConnectShadeOutside")) {
        CellConnected({
            isShaded: isBlack,
            isUnshaded: isGreen,
            add_shaded: add_black,
            add_unshaded: add_green,
            OutsideAsShaded: true,
        });
    }
    if (checklist.some(f => f.name === "checkConnectUnshadeOutside")) {
        CellConnected({
            isShaded: isGreen,
            isUnshaded: isBlack,
            add_shaded: add_green,
            add_unshaded: add_black,
            OutsideAsShaded: true,
        });
    }
    if (checklist.some(f => f.name === "checkConnectShade") &&
        checklist.some(f => f.name === "checkConnectUnshadeRB" || f.name === "checkConnectUnshade" || f.name === "checkConnectUnshadeOutside")) {
        NoCheckerCell({
            isShaded: isBlack,
            isUnshaded: isGreen,
            add_shaded: add_black,
            add_unshaded: add_green,
        });
    }
    if (checklist.some(f => f.name === "checkAdjacentShadeCell")) {
        BlackNotAdjacent();
    }
    if (checklist.some(f => f.name === "check2x2ShadeCell")) {
        No2x2Cell({
            isShaded: isBlack,
            add_unshaded: add_green,
        })
    }
    if (checklist.some(f => f.name === "check2x2UnshadeCell")) {
        No2x2Cell({
            isShaded: isGreen,
            add_unshaded: add_black,
        })
    }
    if (checklist.some(f => f.name === "checkDeadendLine") &&
        checklist.some(f => f.name === "checkBranchLine") &&
        checklist.some(f => f.name === "checkCrossLine") &&
        checklist.some(f => f.name === "checkOneLoop")) {
        if (checklist.some(f => f.name === "checkNoLine")) {
            SingleLoopInCell({
                isPassable: c => c.ques !== CQUES.wall,
                isPass: c => c.ques !== CQUES.wall,
            });
        }
        else { SingleLoopInCell(); }
    }
    if (checklist.some(f => f.name === "checkRoomPassOnce")) {
        RoomPassOnce();
    }
    if (checklist.some(f => f.name === "checkUnshadeOnCircle")) {
        forEachCell(c => { if (c.qnum === CQNUM.wcir) add_green(c); })
    }
    if (checklist.some(f => f.name === "checkShadeOnCircle")) {
        forEachCell(c => { if (c.qnum === CQNUM.bcir) add_black(c); })
    }
    if (checklist.some(f => f.name === "checkUnshadeSquare")) {
        RectRegion_Cell({
            isShaded: isGreen,
            isUnshaded: isBlack,
            add_shaded: add_green,
            add_unshaded: add_black,
            isSizeAble: (w, h, sc, c) => w === h,
        })
    }
    if (checklist.some(f => f.name === "checkBorderCross")) {
        NoCrossingBorder();
    }
    if (checklist.some(f => f.name === "checkNumberAndUnshadeSize")) {
        forEachCell(c => { if (c.qnum !== CQNUM.none) add_green(c); })
        SizeRegion_Cell({
            isShaded: isGreen,
            isUnshaded: isBlack,
            add_shaded: add_green,
            add_unshaded: c => add_black(c, true),
            OneNumPerRegion: checklist.some(f => f.name === "checkNoNumberInUnshade") &&
                checklist.some(f => f.name === "checkDoubleNumberInUnshade"),
        });
    }
    if (checklist.some(f => f.name === "checkNumberSize")) {
        SizeRegion_Cell({
            isShaded: isBlack,
            isUnshaded: isGreen,
            add_shaded: add_black,
            add_unshaded: add_green,
            OneNumPerRegion: checklist.some(f => f.name === "checkNoNumberInUnshade") &&
                checklist.some(f => f.name === "checkDoubleNumberInUnshade"),
            NoUnshadedNum: false,
        });
        SizeRegion_Cell({
            isShaded: isGreen,
            isUnshaded: isBlack,
            add_shaded: add_green,
            add_unshaded: add_black,
            OneNumPerRegion: checklist.some(f => f.name === "checkNoNumberInUnshade") &&
                checklist.some(f => f.name === "checkDoubleNumberInUnshade"),
            NoUnshadedNum: false,
        });
    }
    if (checklist.some(f => f.name === "checkSideAreaShadeCell")) {
        forEachCell(c => {
            if (!isBlack(c)) { return; }
            for (let d = 0; d < 4; d++) {
                let nb = offset(c, 0.5, 0, d);
                let nc = offset(c, 1, 0, d)
                if (!nb.isnull && nb.ques) {
                    add_green(nc);
                }
            }
        });
    }
}

// assist for certain genre

function SansaRoadAssist() {
    const isTri = c => !c.isnull && c.qnum === 1;
    GreenConnected();
    No2x2Green();
    // Dot
    for (let i = board.minbx; i <= board.maxbx; i++) {
        for (let j = board.minby; j <= board.maxby; j++) {
            let obj = board.getobj(i, j);
            if (obj.qnum === 0) { continue; }  // 0:Empty 1:Black 2:Gray 3:White
            let clist;
            if (i % 2 === 0 && j % 2 === 0) { clist = [0, 1, 2, 3].map((d) => offset(obj, .5, .5, d)); }
            if (i % 2 === 0 && j % 2 === 1) { clist = [offset(obj, -.5, 0), offset(obj, .5, 0)]; }
            if (i % 2 === 1 && j % 2 === 0) { clist = [offset(obj, 0, -.5), offset(obj, 0, .5)]; }
            if (i % 2 === 1 && j % 2 === 1) { continue; }
            if (clist.length <= 2) {
                if (obj.qnum === 1) { clist.forEach(c => add_black(c)); }
                if (obj.qnum === 3) { clist.forEach(c => add_dot(c, 0)); }
            }
            if (obj.qnum === 2) {
                if (clist.length === 2) { add_cross(obj); }
                if (clist.filter(c => isBlack(c)).length * 2 === clist.length) { clist.forEach(c => add_dot(c, 0)); }
                if (clist.filter(c => isntBlack(c)).length * 2 === clist.length) { clist.forEach(c => add_black(c)); }
            }
            if (clist.length === 4) {
                if (obj.qnum === 1) { [0, 1, 2, 3].forEach(d => add_cross(offset(obj, 0, .5, d))); }
                if (obj.qnum === 1 && clist.filter(c => isntBlack(c)).length === 1) { clist.forEach(c => add_black(c)); }
                if (obj.qnum === 3 && clist.filter(c => isBlack(c)).length === 1) { clist.forEach(c => add_dot(c, 0)); }
            }
        }
    }
    // Triangle
    forEachCell(cell => {
        if (isTri(cell)) { add_green(cell); }
        let greencnt = adjlist(cell.adjacent).filter(c => isGreen(c)).length;
        let blackcnt = adjlist(cell.adjacent).filter(c => isntGreen(c)).length;
        if (blackcnt > (isTri(cell) ? 1 : 2)) { add_black(cell); }
        if (greencnt > (isTri(cell) ? 3 : 2)) { add_black(cell); }
        if (isGreen(cell) && greencnt === (isTri(cell) ? 3 : 2)) { forEachSide(cell, (nb, nc) => add_black(nc)); }
        if (isGreen(cell) && blackcnt === (isTri(cell) ? 1 : 2)) { forEachSide(cell, (nb, nc) => add_green(nc)); }
        for (let d = 0; d < 4; d++) {
            if (isTri(cell) && isntGreen(offset(cell, 2, 0, d))) { add_green(offset(cell, -1, 0, d)); }
            if (isTri(cell) && isGreen(offset(cell, -1, -1, d))) {
                add_green(offset(cell, 1, 0, d));
                add_green(offset(cell, 0, 1, d));
            }
            if (isTri(cell) && isntGreen(offset(cell, -1, 1, d)) && isntGreen(offset(cell, -2, 0, d))) {
                add_green(offset(cell, 1, 0, d));
                add_green(offset(cell, 0, 1, d));
            }
            if (isTri(cell) && isntGreen(offset(cell, 1, -1, d)) && isntGreen(offset(cell, 0, -2, d))) {
                add_green(offset(cell, 1, 0, d));
                add_green(offset(cell, 0, 1, d));
            }
        }
    });
}

function CojunAssist() {
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none) { add_number(cell, cell.qnum); }
        if (cell.anum !== CANUM.none) { return; }
        let cand = new Array(cell.room.clist.length).fill(0).map((_, i) => i + 1);
        let t = Array.from(cell.room.clist).map(c => c.anum);
        cand = cand.filter(n => !t.includes(n));
        if (!offset(cell, 0, 1).isnull && offset(cell, 0, .5).ques !== 1) {
            let nc = offset(cell, 0, 1);
            if (nc.anum !== CANUM.none) { cand = cand.filter(n => n > nc.anum); }
            if (nc.snum.some(n => n !== -1)) { cand = cand.filter(n => n > Math.min(...nc.snum.filter(n => n !== -1))); }
        }
        if (!offset(cell, 0, -1).isnull && offset(cell, 0, -.5).ques !== 1) {
            let nc = offset(cell, 0, -1);
            if (nc.anum !== CANUM.none) { cand = cand.filter(n => n < nc.anum); }
            if (nc.snum.some(n => n !== -1)) { cand = cand.filter(n => n < Math.max(...nc.snum.filter(n => n !== -1))); }
        }
        forEachSide(cell, (nb, nc) => {
            if (nc.isnull) { return; }
            cand = cand.filter(n => n !== nc.anum);
        });
        let fn = function (clist) {
            let a = new Array(cell.room.clist.length).fill(0).map((_, i) => i + 1);
            clist.forEach((c, i) => {
                if (cell === c || c.isnull) { return; }
                let b = c.anum === -1 && c.snum.every(n => n === -1);
                a = b ? [] : a.filter(n => n !== c.anum && !c.snum.includes(n));
                if (c.anum !== -1) { cand = cand.filter(n => n !== c.anum); }
                if (c.anum === -1 && c.snum.filter(n => n !== -1).length > 0) {
                    for (let j = i + 1; j < clist.length; j++) {
                        let c2 = clist[j];
                        if (cell === c2 || c2.isnull || c2.anum !== -1 || c2.snum.every(n => n === -1)) { continue; }
                        let l2 = new Set([...c.snum, ...c2.snum].filter(n => n !== -1));
                        if (l2.size === 2) {
                            cand = cand.filter(n => !l2.has(n));
                        }
                        for (let k = j + 1; k < clist.length; k++) {
                            let c3 = clist[k];
                            if (cell === c3 || c3.isnull || c3.anum !== -1 || c3.snum.every(n => n === -1)) { continue; }
                            let l3 = new Set([...c.snum, ...c2.snum, ...c3.snum].filter(n => n !== -1));
                            if (l3.size === 3) {
                                cand = cand.filter(n => !l3.has(n));
                            }
                            for (let l = k + 1; l < clist.length; l++) {
                                let c4 = clist[l];
                                if (cell === c4 || c4.isnull || c4.anum !== -1 || c4.snum.every(n => n === -1)) { continue; }
                                let l4 = new Set([...c.snum, ...c2.snum, ...c3.snum, ...c4.snum].filter(n => n !== -1));
                                if (l4.size === 4) {
                                    cand = cand.filter(n => !l4.has(n));
                                }
                            }
                        }
                    }
                }
            });
            if (a.length === 1) { add_number(cell, a[0]); }
        }
        fn(Array.from(cell.room.clist));
        add_candidate(cell, cand);
    });
}

function NagareruLoopAssist() {
    let add_arrow = function (b, dir) {
        if (b === undefined || b.isnull || b.qsub !== BQSUB.none) { return; }
        b.setQsub(dir);
        b.draw();
        stepcheck(true);
    };
    let genlist = c => {
        if (c.isnull || c.adjborder === undefined) { return []; }
        return [[c.adjborder.top, BQSUB.arrow_up, BQSUB.arrow_dn], [c.adjborder.bottom, BQSUB.arrow_dn, BQSUB.arrow_up],
        [c.adjborder.left, BQSUB.arrow_lt, BQSUB.arrow_rt], [c.adjborder.right, BQSUB.arrow_rt, BQSUB.arrow_lt]];
    };
    let hasIn = c => genlist(c).some(([b, o_arr, i_arr]) => !b.isnull && isLine(b) && b.qsub === i_arr);
    let hasOut = c => genlist(c).some(([b, o_arr, i_arr]) => !b.isnull && isLine(b) && b.qsub === o_arr);
    SingleLoopInCell({
        isPassable: c => c.ques !== 1,
        isPass: c => c.qdir !== 0 && c.ques === 0,
        Directed: true,
    });
    let flowMap = new Map();
    forEachCell(cell => {
        if (cell.ques === 0 && [1, 2].includes(cell.qdir)) {
            add_cross(cell.adjborder.left);
            add_cross(cell.adjborder.right);
        }
        if (cell.ques === 0 && [3, 4].includes(cell.qdir)) {
            add_cross(cell.adjborder.top);
            add_cross(cell.adjborder.bottom);
        }
        if (cell.ques !== 0) {
            forEachSide(cell, b => add_cross(b));
        }
        let lar = [BQSUB.arrow_rt, BQSUB.arrow_up, BQSUB.arrow_lt, BQSUB.arrow_dn];
        if (cell.ques === 0 && cell.qdir !== 0) {
            let d = qdirRemap(cell.qdir);
            add_arrow(offset(cell, 0.5, 0, d), lar[d]);
        }
        if (cell.ques !== 0 && cell.qdir !== 0) {
            let d = qdirRemap(cell.qdir);
            let pcell = offset(cell, 1, 0, d);
            while (!pcell.isnull && pcell.ques === 0) {
                if (!flowMap.has(pcell)) { flowMap.set(pcell, []); }
                flowMap.get(pcell).push(d);
                if (isLine(offset(pcell, 0, -.5, d))) { add_cross(offset(pcell, 0, +.5, d)); }
                if (isLine(offset(pcell, 0, +.5, d))) { add_cross(offset(pcell, 0, -.5, d)); }
                if (isLine(offset(pcell, +.5, 0, d))) { add_arrow(offset(pcell, +.5, 0, d), lar[d]); }
                if (isntLine(offset(pcell, -.5, 0, d)) && isntLine(offset(pcell, +.5, 0, d))) {
                    add_cross(offset(pcell, 0, -.5, d));
                    add_cross(offset(pcell, 0, +.5, d));
                }
                if (offset(pcell, 0, -.5, d).qsub === lar[(d + 1) % 4]) { add_line(offset(pcell, -.5, 0, d)); }
                if (offset(pcell, 0, +.5, d).qsub === lar[(d + 3) % 4]) { add_line(offset(pcell, -.5, 0, d)); }
                if (offset(pcell, 0, -.5, d).qsub === lar[(d + 3) % 4]) { add_line(offset(pcell, +.5, 0, d)); }
                if (offset(pcell, 0, +.5, d).qsub === lar[(d + 1) % 4]) { add_line(offset(pcell, +.5, 0, d)); }
                if (hasIn(offset(pcell, 0, -1, d)) && !isLine(offset(pcell, 0, -.5, d)) && isntLine(offset(pcell, +.5, 0, d))) { add_cross(offset(pcell, 0, -.5, d)); }
                if (hasIn(offset(pcell, 0, +1, d)) && !isLine(offset(pcell, 0, +.5, d)) && isntLine(offset(pcell, +.5, 0, d))) { add_cross(offset(pcell, 0, +.5, d)); }
                if (hasOut(offset(pcell, 0, -1, d)) && !isLine(offset(pcell, 0, -.5, d)) && isntLine(offset(pcell, -.5, 0, d))) { add_cross(offset(pcell, 0, -.5, d)); }
                if (hasOut(offset(pcell, 0, +1, d)) && !isLine(offset(pcell, 0, +.5, d)) && isntLine(offset(pcell, -.5, 0, d))) { add_cross(offset(pcell, 0, +.5, d)); }
                if ((offset(pcell, -.5, -.5, d).qsub === (CRQSUB.out ^ loopDir) || offset(pcell, +.5, -.5, d).qsub === (CRQSUB.in ^ loopDir)) && isntLine(offset(pcell, +.5, 0, d))) { add_cross(offset(pcell, 0, -.5, d)); }
                if ((offset(pcell, -.5, +.5, d).qsub === (CRQSUB.in ^ loopDir) || offset(pcell, +.5, +.5, d).qsub === (CRQSUB.out ^ loopDir)) && isntLine(offset(pcell, +.5, 0, d))) { add_cross(offset(pcell, 0, +.5, d)); }
                if ((offset(pcell, -.5, -.5, d).qsub === (CRQSUB.in ^ loopDir) || offset(pcell, +.5, -.5, d).qsub === (CRQSUB.out ^ loopDir)) && isntLine(offset(pcell, -.5, 0, d))) { add_cross(offset(pcell, 0, -.5, d)); }
                if ((offset(pcell, -.5, +.5, d).qsub === (CRQSUB.out ^ loopDir) || offset(pcell, +.5, +.5, d).qsub === (CRQSUB.in ^ loopDir)) && isntLine(offset(pcell, -.5, 0, d))) { add_cross(offset(pcell, 0, +.5, d)); }
                pcell = offset(pcell, 1, 0, d);
            }
        }
    });
    forEachCell(cell => {
        if (!flowMap.has(cell)) { return; }
        let dirs = flowMap.get(cell);
        if (dirs.includes(0) && dirs.includes(2) || dirs.includes(1) && dirs.includes(3)) {
            forEachSide(cell, b => add_cross(b));
        }
        for (let d = 0; d < 4; d++) {
            if (dirs.includes(d) && dirs.includes((d + 1) % 4)) {
                if (isntLine(offset(cell, +.5, 0, d))) { add_cross(offset(cell, 0, +.5, d)); }
                if (isntLine(offset(cell, 0, +.5, d))) { add_cross(offset(cell, +.5, 0, d)); }
                if (isntLine(offset(cell, -.5, 0, d))) { add_cross(offset(cell, 0, -.5, d)); }
                if (isntLine(offset(cell, 0, -.5, d))) { add_cross(offset(cell, -.5, 0, d)); }
            }
        }
    });
}

function BunnyhopAssist() {
    const isEmpty = c => !c.isnull && c.ques !== CQUES.wall;
    const isSide = function (c, d) {
        d = d % 4;
        const ln = [1, 2, 2, 1][d], b = offset(c, 0.5, 0, d);
        return b !== undefined && !b.isnull && b.line === ln;
    };
    const isCross = function (c, d) {
        if (c.isnull || c.ques === CQUES.wall) { return true; }
        d = d % 4;
        const nd = [8, 1, 4, 2][d];
        return (c.qsub & nd) > 0;
    };
    const isSideC = function (c, q) {
        if (c.isnull || c.ques === CQUES.wall) { return false; }
        q = q % 4;
        const nq = [32, 16, 48, 64][q];
        return (c.qsub & 0b1110000) === nq || isSide(c, q) || isSide(c, q + 1);
    };
    const isCrossC = (c, q) => isCross(c, q) && isCross(c, q + 1);
    const add_cross = function (c, d) { // 0~3: R U L D
        d = d % 4;
        if (c.isnull || c.ques === CQUES.wall || isCross(c, d) || isSide(c, d)) { return; }
        const nd = [8, 1, 4, 2][d];
        c.setQsub(c.qsub | nd);
        c.draw();
        stepcheck(true);
    };
    const add_sidec = function (c, q) { // 0~3: UR UL DL DR
        q = q % 4;
        if (c.isnull || c.ques === CQUES.wall || isSideC(c, q) || (isCross(c, q) && isCross(c, q + 1))) { return; }
        if ([0, 1, 2, 3].some(d => isSide(c, d))) { return; }
        const nq = [32, 16, 48, 64][q], oq = (c.qsub & 0b1110000);
        if (oq > 0) {
            const t = [nq, oq].sort().join(',');
            if (t === '16,32') { add_side(c, 1); }
            if (t === '16,48') { add_side(c, 2); }
            if (t === '32,64') { add_side(c, 0); }
            if (t === '48,64') { add_side(c, 3); }
            return;
        }
        c.setQsub(c.qsub | nq);
        c.draw();
        stepcheck(true);
    };
    const add_side = function (c, d) {
        d = d % 4;
        if (c.isnull || c.ques === CQUES.wall || isCross(c, d) || isSide(c, d)) { return; }
        const ln = [1, 2, 2, 1][d], b = offset(c, 0.5, 0, d);
        if (b === undefined || b.isnull || isLine(b)) { return; }
        b.setLineVal(ln);
        b.draw();
        c.setQsub(c.qsub & 0b1111);
        c.draw();
        stepcheck(true);
    };
    forEachCell(cell => {
        if (!isEmpty(cell)) { return; }
        for (let d = 0; d < 4; d++) {
            if (!isSide(cell, d) && ui.puzzle.board.linegraph.components.length > 1) {
                let [cr1, cr2] = offset(cell, 0.5, 0, d).sidecross;
                if (cr1.path !== null && cr1.path === cr2.path) { add_cross(cell, d); }
            }
            if (isCross(cell, d) && isCross(cell, d + 1) && isCross(cell, d + 2)) { add_side(cell, d + 3); }
            if (isSide(cell, d)) { [1, 2, 3].forEach(dd => add_cross(cell, d + dd)); }
            if (isCrossC(cell, d)) { add_sidec(cell, d + 2); }
            if (isSideC(cell, d)) { add_cross(cell, d + 2); add_cross(cell, d + 3); }
            let temp = [[0, 0, 0], [1, 0, 2], [1, 0, 3], [1, 1, 1], [1, 1, 2], [0, 1, 0], [0, 1, 1], [0, 0, 3]];
            if (temp.slice(1, 7).every(([dx, dy, dd]) => isCross(offset(cell, dx, dy, d), d + dd))) {
                add_cross(cell, d);
                add_cross(cell, d + 3);
            }
            if (temp.slice(2).every(([dx, dy, dd]) => isCross(offset(cell, dx, dy, d), d + dd))) {
                add_cross(cell, d);
                add_cross(offset(cell, 1, 0, d), d + 2);
            }
            if (temp.slice(0, 6).every(([dx, dy, dd]) => isCross(offset(cell, dx, dy, d), d + dd))) {
                add_cross(cell, d + 3);
                add_cross(offset(cell, 0, 1, d), d + 1);
            }
            temp = [[1, 0, 2], [1, 1, 1], [0, 1, 0]].filter(([dx, dy, q]) => !isCrossC(offset(cell, dx, dy, d), d + q));
            if (isSideC(cell, d + 3) && temp.length === 1) {
                let [dx, dy, q] = temp[0];
                add_sidec(offset(cell, dx, dy, d), d + q);
            }
            if (isSideC(cell, d + 3) && isSideC(offset(cell, 1, 0, d), d + 2)) {
                [[1, 1, 1], [1, 1, 2], [0, 1, 0], [0, 1, 1]].forEach(([dx, dy, dd]) => add_cross(offset(cell, dx, dy, d), d + dd));
            }
            if (isSideC(cell, d + 3) && isSideC(offset(cell, 1, 1, d), d + 1)) {
                [[1, 0, 2], [1, 0, 3], [0, 1, 0], [0, 1, 1]].forEach(([dx, dy, dd]) => add_cross(offset(cell, dx, dy, d), d + dd));
            }
        }
    });
}

function LaPazAssist() {
    forEachCell(cell => {
        if (isClue(cell)) { add_green(cell); }
        if (adjlist(cell.adjborder).every(b => isSide(b))) { add_black(cell); }
        if (isBlack(cell)) {
            forEachSide(cell, (nb, nc) => { add_side(nb); add_green(nc); });
        }
        if (isNum(cell)) {
            let f = function (l, ind, d, t = false) {
                if (t && l.filter(c => isBlack(c)).length === l[ind].qnum) {
                    l.forEach(c => add_green(c));
                    return;
                }
                if (t) {
                    l.forEach(c => {
                        if (isNum(c) && c.qnum !== cell.qnum) {
                            add_side(offset(c, -.5, 0, d));
                            add_side(offset(c, +.5, 0, d));
                        }
                    });
                }
                let g = [];
                for (let i = 0; i < l.length; i++) {
                    if (isGreen(l[i])) { continue; }
                    if (i + 1 === ind && isSide(offset(cell, +.5, 0, d))) { continue; }
                    if (ind + 1 === i && isSide(offset(cell, -.5, 0, d))) { continue; }
                    if (i + 1 < l.length && !isntBlack(l[i + 1])) {
                        g.push([l[i], l[i + 1]]);
                        i++;
                        continue;
                    }
                    if (i + 1 == ind && i + 2 < l.length && !isntBlack(l[i + 2])) {
                        g.push([l[i], l[i + 2]]);
                        i += 2;
                        continue;
                    }
                    g.push([l[i]]);
                }
                if (t && g.length === l[ind].qnum) {
                    g.forEach(e => {
                        if (e.length === 1) { add_black(e[0]); }
                        if (e.length === 2 && offset(e[0], 1, 0, d) === e[1]) { add_side(offset(e[0], .5, 0, d)); }
                    });
                }
                if (g.length < l[ind].qnum || l.filter(c => isBlack(c)).length > l[ind].qnum) {
                    add_side(offset(cell, -.5, 0, d));
                    add_side(offset(cell, +.5, 0, d));
                }
            };
            let row = [], col = [];
            for (let i = 0; i < board.cols; i++) { row.push(board.getc(i * 2 + 1, cell.by)); }
            for (let i = 0; i < board.rows; i++) { col.push(board.getc(cell.bx, i * 2 + 1)); }
            f(row, (cell.bx - 1) / 2, 0, isSide(offset(cell, 0, -.5)) && isSide(offset(cell, 0, +.5)));
            f(col, (cell.by - 1) / 2, -1, isSide(offset(cell, -.5, 0)) && isSide(offset(cell, +.5, 0)));
        }
        for (let d = 0; d < 4; d++) {
            if (isNum(cell) && isNum(offset(cell, 1, 0, d)) && cell.qnum !== offset(cell, 1, 0, d).qnum) {
                add_side(offset(cell, .5, 0, d));
            }
            if ([[0, -.5], [0, .5], [-.5, 0]].every(([dx, dy]) => isSide(offset(cell, dx, dy, d)))) {
                add_green(offset(cell, 1, 0, d));
            }
            if (isGreen(cell) && [[0, -.5], [0, .5], [-.5, 0]].every(([dx, dy]) => isSide(offset(cell, dx, dy, d)))) {
                add_side(offset(cell, 1.5, 0, d));
                add_side(offset(cell, 1, -.5, d));
                add_side(offset(cell, 1, +.5, d));
            }
        }
    });
}

function IsowatariAssist() {
    const size = ui.puzzle.board.clusterSize.count;
    GreenConnected();
    No2x2Cell({ isShaded: isGreen, add_unshaded: add_black, });
    forEachCell(cell => {
        if (!isInside(cell)) { return; }
        if (cell.qnum === CQNUM.wcir) add_green(cell);
        if (cell.qnum === CQNUM.bcir) add_black(cell);
        let clist = getCellChunk(cell, (c, nb, nc) => isBlack(nc));
        if (isBlack(cell)) {
            let oclist = getBound(clist);
            if (clist.length === size) { oclist.forEach(c => add_green(c)); }
            if (clist.length < size && oclist.filter(c => !isntBlack(c)).length === 1) {
                add_black(oclist.find(c => !isntBlack(c)));
            }
        }
        if (!isBlack(cell) && !isGreen(cell)) {
            if (clist.length > size) { add_green(cell); }
        }
        if (size > 1 && adjlist(cell.adjacent).every(c => isntBlack(c))) { add_green(cell); }
    });
}

function KurarinAssist() {
    SingleLoopInCell({
        isPassable: c => !isBlack(c),
        add_notpass: add_black,
    });
    for (let i = board.minbx; i <= board.maxbx; i++) {
        for (let j = board.minby; j <= board.maxby; j++) {
            let obj = board.getobj(i, j);
            if (obj.qnum === 0) { continue; }  // 0:Empty 1:Black 2:Gray 3:White
            let clist;
            if (i % 2 === 0 && j % 2 === 0) { clist = [0, 1, 2, 3].map((d) => offset(obj, .5, .5, d)); }
            if (i % 2 === 0 && j % 2 === 1) { clist = [offset(obj, -.5, 0), offset(obj, .5, 0)]; }
            if (i % 2 === 1 && j % 2 === 0) { clist = [offset(obj, 0, -.5), offset(obj, 0, .5)]; }
            if (i % 2 === 1 && j % 2 === 1) { clist = [obj]; }
            if (clist.length <= 2) {
                if (obj.qnum === 1) { clist.forEach(c => add_black(c)); }
                if (obj.qnum === 3) { clist.forEach(c => add_dot(c, 0)); }
            }
            if (obj.qnum === 2) {
                if (clist.length === 2) { add_cross(obj); }
                if (clist.filter(c => isBlack(c)).length * 2 === clist.length) { clist.forEach(c => add_dot(c, 0)); }
                if (clist.filter(c => isntBlack(c)).length * 2 === clist.length) { clist.forEach(c => add_black(c)); }
            }
            if (clist.length === 4) {
                if (obj.qnum === 1) { [0, 1, 2, 3].forEach(d => add_cross(offset(obj, 0, .5, d))); }
                if (obj.qnum === 1 && clist.filter(c => isntBlack(c)).length === 1) { clist.forEach(c => add_black(c)); }
                if (obj.qnum === 3 && clist.filter(c => isBlack(c)).length === 1) { clist.forEach(c => add_dot(c, 0)); }
            }
        }
    }
}

function SumiwakeAssist() {
    HeyawakeAssist();
    forEachCross(cross => {
        if (cross.qnum === CQNUM.none) { return; }
        let l = [[-.5, -.5], [-.5, .5], [.5, .5], [.5, -.5]].map(([x, y]) => offset(cross, x, y));
        l = l.filter(c => !c.isnull);
        NShadeInClist({ clist: l, n: cross.qnum, });
        if (cross.qnum === 2 && (isBlack(l[0]) || isGreen(l[1]) || isBlack(l[2]) || isGreen(l[3]))) {
            add_black(l[0]);
            add_green(l[1]);
            add_black(l[2]);
            add_green(l[3]);
        }
        if (cross.qnum === 2 && (isGreen(l[0]) || isBlack(l[1]) || isGreen(l[2]) || isBlack(l[3]))) {
            add_green(l[0]);
            add_black(l[1]);
            add_green(l[2]);
            add_black(l[3]);
        }
    });
}

function DetourAssist() {
    SingleLoopInCell({ isPass: () => true, });
    forEachCell(cell => {
        if (cell.lcnt === 2) {
            if (isLine(offset(cell, 0, -.5, 0)) && isLine(offset(cell, 0, .5, 0)) ||
                isLine(offset(cell, 0, -.5, 1)) && isLine(offset(cell, 0, .5, 1))) {
                add_Xcell(cell, false);
            } else { add_Ocell(cell, false); }
        }
        for (let d = 0; d < 4; d++) {
            if (isLine(offset(cell, 0, -.5, d)) && isOcell(cell)) { add_cross(offset(cell, 0, .5, d)); }
            if (isLine(offset(cell, 0, -.5, d)) && isXcell(cell)) { add_line(offset(cell, 0, .5, d)); }
            if (isntLine(offset(cell, 0, -.5, d)) && isOcell(cell)) { add_line(offset(cell, 0, .5, d)); }
            if (isntLine(offset(cell, 0, -.5, d)) && isXcell(cell)) { add_cross(offset(cell, 0, .5, d)); }
        }
    });
    forEachRoom(room => {
        if (!isNum(room.top)) { return; }
        NShadeInClist({
            isShaded: isOcell,
            isUnshaded: isXcell,
            add_shaded: c => add_Ocell(c, false),
            add_unshaded: c => add_Xcell(c, false),
            clist: Array.from(room.clist),
            n: room.top.qnum,
        });
    });
}

function WittgensteinBriquetAssist() {
    const isDot = c => !c.isnull && c.qsub === 2;
    const add_dot = function (c) {
        if (c === undefined || c.isnull || c.qsub !== CQSUB.none || isClue(c) || c.lcnt > 0) { return; }
        c.setQsub(2);
        c.draw();
        stepcheck(true);
    };
    CellConnected({
        isShaded: c => isDot(c) || isClue(c),
        isUnshaded: c => isOcell(c) || c.lcnt > 0,
        add_shaded: add_dot,
        add_unshaded: add_Ocell,
    });
    forEachCell(cell => {
        if (isNum(cell)) {
            NShadeInClist({
                isShaded: c => isOcell(c) || c.lcnt > 0,
                isUnshaded: c => c.isnull || isDot(c) || isClue(c),
                add_shaded: add_Ocell,
                add_unshaded: add_dot,
                clist: adjlist(cell.adjacent),
                n: cell.qnum,
            });
        }
        if (isClue(cell) || isDot(cell)) { forEachSide(cell, (nb, nc) => add_cross(nb)); }
        if (adjlist(cell.adjborder).every(b => isntLine(b))) { add_dot(cell); }
        if (isOcell(cell) && adjlist(cell.adjborder).filter(b => !isntLine(b)).length === 1) { forEachSide(cell, (nb, nc) => add_line(nb)); }
        for (let d = 0; d < 4; d++) {
            if (isntLine(offset(cell, -.5, 0, d)) && isntLine(offset(cell, 1.5, 0, d))) { add_cross(offset(cell, .5, 0, d)); }
            if (isLine(offset(cell, -.5, 0, d)) && isLine(offset(cell, 1.5, 0, d))) { add_cross(offset(cell, .5, 0, d)); }
            if (isntLine(offset(cell, -1.5, 0, d)) && isLine(offset(cell, -.5, 0, d))) { add_line(offset(cell, .5, 0, d)); }
            if (isLine(offset(cell, .5, 0, d))) {
                add_cross(offset(cell, 0, -.5, d));
                add_cross(offset(cell, 0, .5, d));
            }
            if (isLine(offset(cell, .5, 0, d)) && isLine(offset(cell, -.5, 0, d))) {
                add_cross(offset(cell, 1.5, 0, d));
                add_cross(offset(cell, -1.5, 0, d));
            }
            if (isOcell(cell) && isntLine(offset(cell, 0, -.5, d)) && isntLine(offset(cell, 0, .5, d)) && isntLine(offset(cell, -1.5, 0, d))) { add_line(offset(cell, .5, 0, d)); }
            if (isntLine(offset(cell, 0, -.5, d)) && isntLine(offset(cell, 0, .5, d)) &&
                isntLine(offset(cell, -.5, 0, d)) && isLine(offset(cell, 2.5, 0, d))) { add_dot(cell); }
        }
    });
}

function EasyAsAbcAssist() {
    const LN = board.indicator.count, LEN = board.cols;
    const add_Xcell = function (c) {
        if (c === undefined || c.isnull || c.anum !== CANUM.none || c.qsub !== CQSUB.none) { return; }
        c.snum.forEach((_, i) => c.setSnum(i, -1));
        c.setQsub(CQSUB.cross);
        c.draw();
        stepcheck(true);
    };
    const add_candidate = function (c, l) {
        if (c === undefined || c === null || c.isnull || c.anum !== CANUM.none) { return; }
        if (l.filter(n => n !== 0).length > 4) { return; }
        if (l.length === 1 && l[0] === 0) {
            add_Xcell(c);
            return;
        }
        if (l.length === 1) {
            add_number(c, l[0]);
            if (c.anum !== CANUM.none) {
                c.setQsub(CQSUB.none);
                c.draw();
            }
            return;
        }
        if (!l.includes(0)) { add_Ocell(c); }
        l = unique(l.filter(n => n !== 0)).sort((a, b) => a - b);
        if (c.snum.some(n => n !== -1)) { l = l.filter(n => c.snum.includes(n)); }
        while (l.length < 4) { l.push(-1); }
        if (c.snum.join(',') === l.join(',')) { return; }
        l.forEach((n, i) => c.setSnum(i, n));
        c.draw();
        stepcheck(true);
    }
    const deduceRow = function (clist, lclue, rclue) {
        let cand = [];
        let genCand = function (l) {
            if (l.length === LEN) {
                cand.push(l);
                return;
            }
            const i = l.length, zn = l.filter(n => n === 0).length, nn = l.filter(n => n !== 0).length;
            for (let k = 0; k <= LN; k++) {
                if (isXcell(clist[i]) && k !== 0) { continue; }
                if (isOcell(clist[i]) && k === 0) { continue; }
                if (clist[i].anum !== -1 && k !== clist[i].anum) { continue; }
                if (clist[i].snum.some(n => n !== -1) && k > 0 && !clist[i].snum.includes(k)) { continue; }
                if (l.includes(k) && k !== 0) { continue; }
                if (zn === LEN - LN && k === 0) { continue; }
                if (nn === 0 && lclue !== -1 && k !== 0 && k !== lclue) { continue; }
                if (nn < LN - 1 && rclue !== -1 && k === rclue) { continue; }
                genCand([...l, k]);
            }
        };
        genCand([]);
        clist.forEach((c, i) => add_candidate(c, unique(cand.map(c => c[i]))));
    };
    for (let j = 0; j < LEN; j++) {
        let clist = [];
        for (let i = 0; i < LEN; i++) { clist.push(board.getc(i * 2 + 1, j * 2 + 1)); }
        deduceRow(clist, board.getex(-1, j * 2 + 1).qnum, board.getex(LEN * 2 + 1, j * 2 + 1).qnum);
    }
    for (let i = 0; i < LEN; i++) {
        let clist = [];
        for (let j = 0; j < LEN; j++) { clist.push(board.getc(i * 2 + 1, j * 2 + 1)); }
        deduceRow(clist, board.getex(i * 2 + 1, -1).qnum, board.getex(i * 2 + 1, LEN * 2 + 1).qnum);
    }
    forEachCell(cell => {
        if (isXcell(cell)) { cell.snum.forEach((_, i) => cell.setSnum(i, -1)); }
        if (cell.qnum !== CQNUM.none) { add_number(cell, cell.qnum); }
    });
}

function PersistenceOfMemoryAssist() {
    const isGray = c => c.ques === 6;
    const add_Ocell = function (c) {
        if (c === undefined || c.isnull || c.qsub !== CQSUB.none) { return; }
        c.setQsub(CQSUB.circle);
        c.draw();
        stepcheck(true);
    };
    const add_Xcell = function (c) {
        if (c === undefined || c.isnull || c.qsub !== CQSUB.none) { return; }
        c.setQsub(CQSUB.cross);
        c.draw();
        stepcheck(true);
    };
    SingleSnakeInCell({
        isShaded: isOcell,
        isUnshaded: isXcell,
        add_shaded: add_Ocell,
        add_unshaded: add_Xcell,
        isHead: c => c.qnum === 1,
        isntHead: c => c.qnum !== 1,
    });
    forEachCell(cell => {
        forEachSide(cell, (nb, nc) => {
            if (isOcell(cell) && isCross(nb)) { add_Xcell(nc); }
            if (isOcell(cell) && isOcell(nc)) { add_line(nb); }
            if (isXcell(cell)) { add_cross(nb); }
        });
        if (cell.lcnt > 0) { add_Ocell(cell); }
    });
    let roomtype = new Map();
    forEachRoom(room => {
        if (!isGray(room.clist[0])) { return; }
        let clist = Array.from(room.clist);
        if (clist.filter(c => !isXcell(c)).length === 1) {
            add_Ocell(clist.find(c => !isXcell(c)));
        }
        let shape = room.clist.shape.id;
        if (!roomtype.has(shape)) { roomtype.set(shape, []); }
        roomtype.get(shape).push(clist.sort((c1, c2) => c1.id - c2.id));
    });
    for (let [shape, rlist] of roomtype) {
        if (rlist.length < 2) { continue; }
        rlist = rlist[0].map((_, i) => rlist.map(clist => clist[i]));
        rlist.forEach(clist => {
            if (clist.some(c => isOcell(c))) { clist.forEach(c => add_Ocell(c)); }
            if (clist.some(c => isXcell(c))) { clist.forEach(c => add_Xcell(c)); }
            for (let d = 0; d < 4; d++) {
                if (clist.some(c => isLine(offset(c, .5, 0, d)))) { clist.forEach(c => add_line(offset(c, .5, 0, d))); }
                if (clist.some(c => isntLine(offset(c, .5, 0, d)))) { clist.forEach(c => add_cross(offset(c, .5, 0, d))); }
            }
        });
    }
}

function ScrinAssist() {
    const isXcell = c => c.qsub === 1;
    const isGreen = c => c.qans === 1;
    const add_Xcell = function (c) {
        if (c === undefined || c.isnull || isGreen(c) || isXcell(c)) { return; }
        c.setQsub(1);
        c.draw();
        stepcheck(true);
    };
    const add_green = function (c) {
        if (c === undefined || c.isnull || isGreen(c) || isXcell(c)) { return; }
        c.setQans(1);
        c.draw();
        stepcheck(true);
    };
    RectRegion_Cell({
        isShaded: isGreen,
        isUnshaded: isXcell,
        add_shaded: add_green,
        add_unshaded: add_Xcell,
        isSizeAble: (w, h, sc, c) => {
            if (sc !== null && isNum(sc) && w * h !== sc.qnum) { return false; }
            let dclist = [[-1, -1], [-1, h], [w, -1], [w, h]].map(([x, y]) => offset(c, x, y));
            if (dclist.filter(dc => !dc.isnull && !isXcell(dc)).length < 2) { return false; }
            if (dclist.filter(dc => isGreen(dc)).length > 2) { return false; }
            sc = null;
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    let pc = offset(c, i, j);
                    if (isNum(pc) && w * h !== pc.qnum) { return false; }
                    if (sc !== null && isClue(pc) && sc !== pc) { return false; }
                    if (sc === null && isClue(pc)) { sc = pc; }
                }
            }
            return true;
        },
    });
    CellConnected({
        isShaded: isGreen,
        isUnshaded: isXcell,
        add_shaded: add_green,
        add_unshaded: add_Xcell,
        DiagDir: true,
    });
    SingleLoopInBlock({
        isShaded: isGreen,
        isUnshaded: isXcell,
        add_shaded: add_green,
        add_unshaded: add_Xcell,
    });
    add_Xcell(board.getc(board.minbx + 1, board.minby + 1));
    add_Xcell(board.getc(board.minbx + 1, board.maxby - 1));
    add_Xcell(board.getc(board.maxbx - 1, board.minby + 1));
    add_Xcell(board.getc(board.maxbx - 1, board.maxby - 1));
    forEachCell(cell => {
        if (isClue(cell)) { add_green(cell); }
        if (isGreen(cell)) {
            let clist = getCellChunk(cell, (c, nb, nc) => isGreen(nc));
            if (!getShape(clist).includes(0)) {
                let bclist = clist.flatMap(c => adjlist(c.adjacent)).filter(nc => !nc.isnull && !isXcell(nc) && !clist.includes(nc));
                let dclist = clist.flatMap(c => adjdiaglist(c)).filter(dc => !dc.isnull && !isXcell(dc) && !clist.includes(dc) && !bclist.includes(dc));
                if (bclist.length === 0 && dclist.length === 2) { dclist.forEach(dc => add_green(dc)); }
                if (dclist.filter(dc => isGreen(dc)).length === 2) { dclist.forEach(dc => add_Xcell(dc)); }
                if (dclist.length < 2 && bclist.length === 1) { bclist.forEach(bc => add_green(bc)); }
            }
        }
    });
}

function GeradewegAssist() {
    SingleLoopInCell({ isPass: isClue, });
    let isSegmentAble = function (c, l, d) {
        if (c.isnull || offset(c, l, 0, d).isnull) { return false; }
        if (isLine(offset(c, l + .5, 0, d))) { return false; }
        if (isntLine(offset(c, l, -.5, d)) && isntLine(offset(c, l, +.5, d))) { return false; }
        for (let i = 0; i < l; i++) {
            if (isNum(offset(c, i + 1, 0, d)) && l > offset(c, i + 1, 0, d).qnum) { return false; }
            if (isntLine(offset(c, i + .5, 0, d))) { return false; }
            if (i > 0 && (isLine(offset(c, i, -.5, d)) || isLine(offset(c, i, +.5, d)))) { return false; }
        }
        return true;
    }
    forEachCell(cell => {
        if (!isNum(cell)) { return false; }
        forEachSide(cell, (nb, nc) => isNum(nc) && cell.qnum !== nc.qnum ? add_cross(nb) : undefined);
        for (let d = 0; d < 2; d++) {
            let cand = Array(cell.qnum + 1).fill(0).map((_, i) => [i, cell.qnum - i]);
            cand.push([0, 0]);
            cand = cand.filter(([l1, l2]) => isSegmentAble(cell, l1, d) && isSegmentAble(cell, l2, d + 2));
            cand = cand.filter(([l1, l2]) => {
                for (let i = -l2; i <= l1; i++) {
                    let c = offset(cell, i, 0, d);
                    if (isNum(c) && c.qnum !== cell.qnum) { return false; }
                }
                return true;
            });
            if (cand.length === 0) { continue; }
            let l1m = Math.min(...cand.map(p => p[0]));
            let l2m = Math.min(...cand.map(p => p[1]));
            for (let i = 0; i < l1m; i++) { add_line(offset(cell, i + .5, 0, d)); }
            for (let i = 0; i < l2m; i++) { add_line(offset(cell, i + .5, 0, d + 2)); }
            if (cand.every(p => p[0] === l1m)) { add_cross(offset(cell, l1m + .5, 0, d)); }
            if (cand.every(p => p[1] === l2m)) { add_cross(offset(cell, l2m + .5, 0, d + 2)); }
        }
        for (let d = 0; d < 4; d++) {
            if (isntLine(offset(cell, -.5, 0, d)) && cell.qnum === 1) { add_line(offset(cell, .5, 0, d)); }
            if (isntLine(offset(cell, .5, 0, d)) && (!isSegmentAble(cell, cell.qnum, d + 1) || !isSegmentAble(cell, cell.qnum, d + 2))) { add_line(offset(cell, .5, 0, d + 3)); }
            if (isntLine(offset(cell, .5, 0, d + 3)) && (!isSegmentAble(cell, cell.qnum, d + 1) || !isSegmentAble(cell, cell.qnum, d + 2))) { add_line(offset(cell, .5, 0, d)); }
        }
    });
}

function DotchiLoopAssist() {
    const isWcir = c => c.qnum === 1;
    const isBcir = c => c.qnum === 2;
    SingleLoopInCell({ isPass: isWcir, });
    forEachCell(cell => {
        if (isBcir(cell)) { forEachSide(cell, (nb, nc) => add_cross(nb)); }
    });
    forEachRoom(room => {
        let clist = Array.from(room.clist).filter(c => isWcir(c));
        if (clist.length === 0) { return; }
        if (clist.some(c => [0, 1].some(d => isLine(offset(c, .5, 0, d)) && isLine(offset(c, -.5, 0, d))))) {   // straight
            clist.forEach(c => [0, 1, 2, 3].forEach(d => {
                if (isLine(offset(c, .5, 0, d))) { add_line(offset(c, -.5, 0, d)); }
                if (isntLine(offset(c, .5, 0, d))) { add_cross(offset(c, -.5, 0, d)); }
            }));
        }
        if (clist.some(c => [0, 1, 2, 3].some(d => isLine(offset(c, .5, 0, d)) && (isLine(offset(c, 0, .5, d)) || isntLine(offset(c, -.5, 0, d)))))) { // turn
            clist.forEach(c => [0, 1, 2, 3].forEach(d => {
                if (isLine(offset(c, .5, 0, d))) { add_cross(offset(c, -.5, 0, d)); }
                if (isntLine(offset(c, .5, 0, d))) { add_line(offset(c, -.5, 0, d)); }
            }));
        }
    });
}

function BalanceLoopAssist() {
    SingleLoopInCell({ isPass: isClue, });
    let isSegmentAble = function (c, l, d) {
        if (c.isnull || offset(c, l, 0, d).isnull) { return false; }
        if (isLine(offset(c, l + .5, 0, d))) { return false; }
        if (isntLine(offset(c, l, -.5, d)) && isntLine(offset(c, l, +.5, d))) { return false; }
        for (let i = 0; i < l; i++) {
            if (isntLine(offset(c, i + .5, 0, d))) { return false; }
            if (i > 0 && (isLine(offset(c, i, -.5, d)) || isLine(offset(c, i, +.5, d)))) { return false; }
        }
        return true;
    }
    forEachCell(cell => {
        if (!isClue(cell)) { return; }
        let dl = [0, 1, 2, 3].map(d => {
            let res = [];
            for (let l = 0; !offset(cell, l, 0, d).isnull; l++) {
                if (isSegmentAble(cell, l, d)) { res.push(l); }
            }
            return res;
        });
        let cand = [];
        const dp = [0, 1, 2, 3].filter(d => dl[d].length > 0 && !dl[d].includes(0));
        for (let d1 = 0; d1 < 4; d1++) {
            for (let d2 = d1 + 1; d2 < 4; d2++) {
                if (dp.some(d => ![d1, d2].includes(d))) { continue; }
                let l = getComb([dl[d1].filter(l1 => l1 !== 0), dl[d2].filter(l2 => l2 !== 0)]);
                l = l.filter(([l1, l2]) => (!isNum(cell) || l1 + l2 === cell.qnum) && (cell.ques === 0 ? l1 === l2 : l1 !== l2));
                l = l.map(([l1, l2]) => { let res = [0, 0, 0, 0]; res[d1] = l1; res[d2] = l2; return res; })
                cand = cand.concat(l);
            }
        }
        dl = [0, 1, 2, 3].map(d => unique(cand.map(e => e[d])));
        dl.forEach((e, d) => {
            if (e.length === 0) { return; }
            let minl = Math.min(...e);
            for (let l = 0; l < minl; l++) { add_line(offset(cell, l + .5, 0, d)); }
            if (e.length === 1) { add_cross(offset(cell, e[0] + .5, 0, d)); }
        });
    });
}

function TetrochainAssist() {
    CellConnected({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        DiagDir: true,
    });
    let cset = new Set();
    forEachCell(cell => {
        if (isGreen(cell) || cset.has(cell)) { return; }
        let clist = getCellChunk(cell, (c, nb, nc) => !nc.isnull && !isGreen(nc));
        clist.forEach(c => cset.add(c));
        if (clist.length < 4) { clist.forEach(c => add_green(c)); }
    });
    const TETRO = genPolyomino(4);
    forEachCell(cell => {
        if (isClue(cell)) { add_green(cell); }
        if (isNum(cell)) {
            let d = qdirRemap(cell.qdir), qnum = cell.qnum;
            let ncell = offset(cell, 1, 0, d), clist = [];
            while (!ncell.isnull && (!isNum(ncell) || ncell.qdir !== cell.qdir)) {
                clist.push(ncell);
                ncell = offset(ncell, 1, 0, d);
            }
            if (!ncell.isnull) { qnum -= ncell.qnum; }
            NShadeInClist({
                isShaded: isBlack,
                isUnshaded: isGreen,
                add_shaded: add_black,
                add_unshaded: add_green,
                n: qnum,
                clist: clist,
            });
        }
        if (isBlack(cell)) {
            let grnlist = [], blklist = [];
            TETRO.forEach((cl) => {
                getComb([[0, 1, 2, 3], [1, -1], [...Array(4).keys()]]).forEach(([d, f, o]) => {
                    let clist = cl.map(([x, y]) => offset(cell, x - cl[o][0], (y - cl[o][1]) * f, d));
                    if (clist.some(c => c.isnull || isGreen(c))) { return; }
                    if (clist.some(c => adjlist(c.adjacent).some(nc => !clist.includes(nc) && isBlack(nc)))) { return; }
                    if (clist.some(c => adj8list(c).some((nc) => {
                        if (nc.isnull || !isBlack(nc) || clist.includes(nc)) { return false; }
                        return getShape(clist) === getShape(getCellChunk(nc, (c, nb, nc) => isBlack(nc)));
                    }))) { return; }
                    blklist.push(clist);
                    grnlist.push(clist.flatMap(c => adjlist(c.adjacent).filter(c => !clist.includes(c))));
                });
            });
            if (grnlist.length > 0) { grnlist = grnlist.reduce((a, b) => a.filter(i => b.includes(i))); }
            if (blklist.length > 0) { blklist = blklist.reduce((a, b) => a.filter(i => b.includes(i))); }
            grnlist.forEach(b => add_green(b));
            blklist.forEach(b => add_black(b));
        }
    });
}

function BalloonBoxAssist() {
    // TODO: use clue to deduce the rectangle
    let isGray = c => !c.isnull && c.ques === 6;
    forEachCell(cell => {
        if (cell.ques === 0) {
            if (!isClue(cell) && adjlist(cell.adjborder, cell.adjacent).filter(([nb, nc]) => !nc.isnull && !isGray(nc) && !isCross(nb)).length === 1) {
                forEachSide(cell, (nb, nc) => !nc.isnull && !isGray(nc) && !isCross(nb) ? add_line(nb) : undefined);
            }
            if (adjlist(cell.adjborder).filter(b => !b.isnull && !isCross(b)).length === 2 - isClue(cell)) {
                adjlist(cell.adjborder).filter(b => !b.isnull && !isCross(b)).forEach(b => add_line(b));
            }
            if (cell.lcnt === 2 - isClue(cell)) {
                forEachSide(cell, (nb, nc) => add_cross(nb));
            }
        }
        if (isNum(cell) && cell.path !== null) {
            let clist = Array.from(cell.path.clist);
            clist.forEach(c => forEachSide(c, (nb, nc) => isClue(nc) || !nc.isnull && nc.path !== null && !isGray(c) && Array.from(nc.path.clist).some(cc => isClue(cc)) ? add_cross(nb) : undefined));
            if (clist.some(c => isGray(c))) {
                let gc = clist.find(c => isGray(c));
                let clist2 = getCellChunk(gc, (c, nb, nc) => !isSide(nb) && isGray(nc));
                if (clist2.length === cell.qnum) {
                    clist2.forEach(c => forEachSide(c, (nb, nc) => clist2.includes(nc) ? add_cross(nb) : undefined));
                }
                clist2 = getCellChunk(gc, (c, nb, nc) => isCross(nb) && isGray(nc));
                if (clist2.length === cell.qnum) {
                    clist2.forEach(c => forEachSide(c, (nb, nc) => !clist2.includes(nc) ? add_side(nb) : undefined));
                }
            }
        }
        for (let d = 0; d < 4; d++) {
            if (!isGray(cell) && isGray(offset(cell, 1, 0, d))) { add_side(offset(cell, .5, 0, d)); }
            if (isClue(cell) && isClue(offset(cell, 1, 0, d))) { add_cross(offset(cell, .5, 0, d)); }
            if ([[0, 0], [1, 0], [0, 1], [1, 1]].every(([x, y]) => isGray(offset(cell, x, y, d))) && isCross(offset(cell, .5, 0, d)) && isCross(offset(cell, 0, .5, d))) {
                add_cross(offset(cell, 1, .5, d));
                add_cross(offset(cell, .5, 1, d));
            }
            if (isGray(cell) && isGray(offset(cell, 1, 0, d)) && isCross(offset(cell, .5, 0, d)) && (isSide(offset(cell, 0, -.5, d)) || isSide(offset(cell, 1, -.5, d)))) {
                add_side(offset(cell, 0, -.5, d));
                add_side(offset(cell, 1, -.5, d));
            }
            if (isGray(cell) && isGray(offset(cell, 1, 0, d)) && isCross(offset(cell, .5, 0, d)) && (isSide(offset(cell, 0, .5, d)) || isSide(offset(cell, 1, .5, d)))) {
                add_side(offset(cell, 0, .5, d));
                add_side(offset(cell, 1, .5, d));
            }
            // this rule is removed
            // if ([[0, 0], [1, 0], [0, 1], [1, 1]].every(([x, y]) => !isGray(offset(cell, x, y, d))) && isLine(offset(cell, .5, 0, d)) && isLine(offset(cell, 0, .5, d))) {
            //     add_cross(offset(cell, 1, .5, d));
            //     add_cross(offset(cell, .5, 1, d));
            // }
            // if ([[0, 0], [1, 0], [0, 1], [1, 1]].every(([x, y]) => !isGray(offset(cell, x, y, d))) && isLine(offset(cell, .5, 0, d)) && isLine(offset(cell, .5, 1, d))) {
            //     add_cross(offset(cell, 0, .5, d));
            //     add_cross(offset(cell, 1, .5, d));
            // }
        }
    });
    let cset = new Set();
    forEachCell(cell => {
        if (!isGray(cell) || cset.has(cell)) { return; }
        let clist = getCellChunk(cell, (c, nb, nc) => isCross(nb) && isGray(nc));
        clist.forEach(c => cset.add(c));
        let blist = clist.flatMap(c => adjlist(c.adjborder)).filter(b => !b.isnull && !isCross(b));
        if (blist.every(b => isSide(b)) && blist.filter(b => b.sidecell.some(c => !isGray(c))).length === 1) {
            add_line(blist.find(b => b.sidecell.some(c => !isGray(c))));
        }
        blist = blist.filter(b => b.sidecell.some(c => !isGray(c)));
        if (blist.some(b => isLine(b))) { blist.forEach(b => add_cross(b)); }
        else blist.forEach(b => {
            let ocell = b.sidecell.find(c => !isGray(c));
            let oclist = ocell.path === null ? [ocell] : Array.from(ocell.path.clist);
            if (oclist.some(cc => isNum(cc) && cc.qnum < clist.length)) {
                add_cross(b);
            }
        });
    });
}

function InternationalBordersAssist() {
    let isntBlack = c => !c.isnull && (isDot(c) || c.ques !== CQUES.none || isClue(c));
    let cqn = new Map();
    let typ = new Set();
    forEachCell(cell => {
        if (cqn.has(cell) || isBlack(cell) || cell.ques === CQUES.none) { return; }
        let clist = getCellChunk(cell, (c, nb, nc) => !isBlack(nc));
        if (unique(clist.map(c => c.ques).filter(n => n !== CQUES.none)).length > 1) {
            clist = getCellChunk(cell, (c, nb, nc) => isClue(nc) || isDot(nc));
        }
        clist.forEach(c => add_dot(c));
        clist.forEach(c => cqn.set(c, cell.ques));
        typ.add(cell.ques);
    });
    for (let t of typ) {
        CellConnected({
            isShaded: c => cqn.get(c) === t,
            isUnshaded: c => isBlack(c) || adjlist(c.adjacent).some(nc => cqn.has(nc) && cqn.get(nc) !== t),
            add_shaded: c => { add_dot(c); cqn.set(c, t); },
            add_unshaded: () => { },
        });
    }
    CellConnected({
        isShaded: c => cqn.has(c),
        isUnshaded: isBlack,
        isOthers: c => isntBlack(c) && !cqn.has(c),
        cantDivideShade: (s, o) => s === 0 && o > 0,
        add_shaded: add_dot,
        add_unshaded: () => { },
        OnlyOneConnected: false,
    });
    forEachCell(cell => {
        if (isBlack(cell) && !adj8list(cell).some(c => c.isnull)) {
            let t = adj8list(cell).filter(c => !isntBlack(c));
            if (t.length === 2) {
                t.forEach(c => add_black(c));
            }
        }
        if (cell.qnum >= 0) {
            NShadeInClist({
                isShaded: isBlack,
                isUnshaded: c => isClue(c) || isDot(c),
                add_shaded: add_black,
                add_unshaded: add_dot,
                clist: adjlist(cell.adjacent),
                n: cell.qnum,
            });
        }
        {
            let l = adjlist(cell.adjacent).filter(c => !c.isnull && !isBlack(c));
            let t = unique(l.map(c => cqn.get(c)));
            if (t.filter(n => n !== undefined).length > 1) { add_black(cell); }
            if (!t.includes(undefined) && t.length === 1) { add_dot(cell); }
            if (l.length === 1) { add_dot(cell); }
            if (isBlack(cell) && l.length === 2) { forEachSide(cell, (nb, nc) => add_dot(nc)); }
            if (isBlack(cell) && t.includes(undefined) && t.length === 2 && l.filter(c => !cqn.has(c)).length === 1) { forEachSide(cell, (nb, nc) => add_dot(nc)); }
        }
    });
}

function RectangleSliderAssist() {
    let isYellow = c => c.isnull || c.qsub === CQSUB.yellow;
    let add_cross = function (b) {
        if (b === undefined || b.isnull || isLine(b) || b.qsub !== BQSUB.none) { return; }
        b.setQsub(BQSUB.cross);
        b.draw();
        stp2cnt += isCross(b);
    };
    CellConnected({
        isShaded: isClue,
        isUnshaded: () => { },
        add_shaded: () => { },
        add_unshaded: add_yellow,
        isNotPassable: (c, nb, nc) => isCross(nb),
        OnlyOneConnected: false,
    });
    forEachCell(cell => {
        for (let d = 0; d < 4; d++) {
            if (isLine(offset(cell, .5, 0, d))) {
                add_cross(offset(cell, 0, -.5, d));
                add_cross(offset(cell, 0, +.5, d));
            }
            let t = [[1, 0], [0, 1], [1, 1]].map(([x, y]) => offset(cell, x, y, d));
            if (t.every(c => isGreen(c))) { add_green(cell); }
            if (t.filter(c => isGreen(c)).length === 2 && t.filter(c => isYellow(c)).length === 1) { add_yellow(cell); }
        }
    });
    let isMovingAble = (c, d, l) => {
        if (c.isnull || !isClue(c) || (l > 0 && isGreen(c))) { return false; }
        if (c.qnum !== CQNUM.quesmark && c.qnum !== l) { return false; }
        if (isLine(offset(c, l + .5, 0, d)) || isYellow(offset(c, l, 0, d))) { return false; }
        if ([[0, -.5], [-.5, 0], [0, .5]].some(([x, y]) => isLine(offset(c, x, y, d)))) { return false; }
        if (l > 0 && [[0, -1], [1, 0], [0, 1]].every(([x, y]) => isYellow(offset(c, l + x, y, d)))) { return false; }
        for (let i = 1; i <= l; i++) {
            if (isCross(offset(c, i - .5, 0, d)) || isLine(offset(c, i, -.5, d)) || isLine(offset(c, i, +.5, d))) { return false; }
            if (isGreen(offset(c, i - 1, 0, d)) || isClue(offset(c, i, 0, d))) { return false; }
        }
        return true;
    };
    let add_moving = (c, d, l) => {
        if (!isMovingAble(c, d, l)) { return; }
        add_cross(offset(c, l + .5, 0, d));
        add_green(offset(c, l, 0, d));
        [[0, -.5], [-.5, 0], [0, .5]].forEach(([x, y]) => add_cross(offset(c, x, y, d)));
        for (let i = 1; i <= l; i++) {
            add_line(offset(c, i - .5, 0, d));
            add_cross(offset(c, i, -.5, d));
            add_cross(offset(c, i, +.5, d));
            add_yellow(offset(c, i - 1, 0, d));
        }
    };
    forEachCell(cell => {
        if (isGreen(cell) && adjlist(cell.adjacent).filter(nc => isYellow(nc)).length === 3) {
            forEachSide(cell, (nb, nc) => add_green(nc));
        }
        if (adjlist(cell.adjacent).every(nc => isYellow(nc))) {
            add_yellow(cell);
        }
        forEachSide(cell, (nb, nc) => isClue(cell) && isClue(nc) ? add_cross(nb) : undefined);
        [0, 1, 2, 3].forEach(d => !isClue(cell) && isYellow(cell) && isCross(offset(cell, -.5, 0, d)) ? add_cross(offset(cell, .5, 0, d)) : undefined);
        if (isYellow(cell) && (cell.lcnt > 0 || isClue(cell))) {
            NShadeInClist({
                isShaded: isLine,
                isUnshaded: b => b.isnull || isCross(b),
                add_shaded: add_line,
                add_unshaded: add_cross,
                clist: adjlist(cell.adjborder),
                n: isClue(cell) ? 1 : 2,
            });
        }
        if (isClue(cell) && cell.lcnt === 1 || cell.lcnt === 2) { add_yellow(cell); }
        if (cell.qnum === 0 || isClue(cell) && (isGreen(cell) || adjlist(cell.adjborder, cell.adjacent).every(([nb, nc]) => isCross(nb) || nc.isnull))) {
            add_green(cell);
            forEachSide(cell, (nb, nc) => add_cross(nb));
            return;
        }
        if (cell.qnum > 0) {
            add_yellow(cell);
            let cand = [0, 1, 2, 3].filter(d => isMovingAble(cell, d, cell.qnum));
            [0, 1, 2, 3].forEach(d => !cand.includes(d) ? add_cross(offset(cell, .5, 0, d)) : undefined);
            if (cand.length === 1) { add_moving(cell, cand[0], cell.qnum); }
        }
        if (!isYellow(cell) && !isClue(cell) && [0, 1, 2, 3].every(d => {
            let l = 0;
            while (!offset(cell, l, 0, d).isnull && !isClue(offset(cell, l, 0, d))) {
                l++;
                if (isLine(offset(cell, l, -.5, d)) || isLine(offset(cell, l, +.5, d))) { return true; }
                if (isCross(offset(cell, l - .5, 0, d))) { return true; }
                if (isGreen(offset(cell, l, 0, d))) { return true; }
            }
            let tc = offset(cell, l, 0, d);
            return tc.isnull || tc.qnum !== CQNUM.quesmark && tc.qnum < l;
        })) { add_yellow(cell); forEachSide(cell, (nb, nc) => add_cross(nb)); }
        if (isGreen(cell) && !isClue(cell)) {
            let cand = [0, 1, 2, 3].filter(d => {
                let l = 0;
                while (!offset(cell, l, 0, d).isnull && !isClue(offset(cell, l, 0, d))) { l++; }
                let tc = offset(cell, l, 0, d);
                return isMovingAble(tc, (d + 2) % 4, l);
            });
            [0, 1, 2, 3].forEach(d => !cand.includes(d) ? add_cross(offset(cell, .5, 0, d)) : undefined);
            if (cand.length === 1) {
                let d = cand[0], l = 0;
                while (!offset(cell, l, 0, d).isnull && !isClue(offset(cell, l, 0, d))) { l++; }
                let tc = offset(cell, l, 0, d);
                add_moving(tc, (d + 2) % 4, l);
            }
        }
        if (isClue(cell) && cell.lcnt === 1) {
            let d = [0, 1, 2, 3].find(dd => isLine(offset(cell, .5, 0, dd)));
            let l = 0;
            while (isLine(offset(cell, l + .5, 0, d))) { l++; }
            if (isGreen(offset(cell, l, 0, d)) || isCross(offset(cell, l + .5, 0, d)) || offset(cell, l + 1, 0, d).isnull || isClue(offset(cell, l + 1, 0, d))) {
                add_moving(cell, d, l);
            }
        }
    });
}

function HotaruBeamAssist() {
    CellConnected({
        isShaded: c => c.lcnt > 0,
        isUnshaded: () => false,
        add_shaded: () => { },
        add_unshaded: c => adjlist(c.adjborder).forEach(b => add_cross(b)),
        isNotPassable: (c, nb, nc) => isCross(nb),
        BridgeType: "line",
    });
    let tl = [];
    forEachCell(cell => cell.qnum !== CQNUM.none ? tl.push(...getCellChunk(offset(cell, 1, 0, qdirRemap(cell.qdir)), (c, nb, nc) => isLine(nb) && nc.qnum === CQNUM.none)) : undefined);
    tl = tl.filter(c => c.lcnt === 1);
    CellConnected({
        isShaded: c => c.qnum !== CQNUM.none,
        isUnshaded: c => tl.includes(c),
        add_shaded: () => { },
        add_unshaded: c => c.lcnt === 0 ? adjlist(c.adjborder).forEach(b => add_cross(b)) : undefined,
        isNotPassable: (c, nb, nc) => isCross(nb),
        OnlyOneConnected: false,
    });
    tl = [];
    forEachCell(cell => cell.qnum !== CQNUM.none ? tl.push(offset(cell, 1, 0, qdirRemap(cell.qdir))) : undefined);
    CellConnected({
        isShaded: c => c.qnum === CQNUM.none && tl.includes(c),
        isUnshaded: c => c.qnum !== CQNUM.none,
        isOthers: c => c.lcnt > 0,
        add_shaded: () => { },
        add_unshaded: c => adjlist(c.adjborder).forEach(b => add_cross(b)),
        cantDivideShade: (s, o) => s === 0 && o > 0,
        isNotPassable: (c, nb, nc) => isCross(nb),
        OnlyOneConnected: false,
        UnshadeEmpty: true,
        BridgeType: "line",
    });
    let nxt = c => offset(c, 1, 0, qdirRemap(c.qdir));
    let hasLoop = Array.from(board.cell).some(cell => {
        if (cell.qnum === CQNUM.none) { return false; }
        let l = getCellChunk(nxt(cell), (c, nb, nc) => (c.qnum === CQNUM.none ? isLine(nb) : nc === nxt(c)) && (c !== nxt(cell) || nc !== cell));
        return l[l.length - 1] === cell;
    })
    forEachCell(cell => {
        if (cell.qnum === CQNUM.none) {
            if (cell.lcnt > 0) {
                NShadeInClist({
                    isShaded: isLine,
                    isUnshaded: b => b.isnull || isCross(b),
                    add_shaded: add_line,
                    add_unshaded: add_cross,
                    clist: adjlist(cell.adjborder),
                    n: 2,
                });
            }
            if (cell.lcnt === 0 && adjlist(cell.adjborder).filter(b => !b.isnull && !isCross(b)).length < 2) {
                adjlist(cell.adjborder).forEach(b => add_cross(b));
            }
            return;
        }
        if (cell.qnum !== CQNUM.none) {
            let d = qdirRemap(cell.qdir);
            add_line(offset(cell, .5, 0, d));
            let clist = [cell, ...getCellChunk(nxt(cell), (c, nb, nc) => isLine(nb) && c.qnum === CQNUM.none && (c !== offset(cell, 1, 0, d) || nc !== cell))];
            let tn = clist.filter((c, i) => i > 0 && i < clist.length - 1 && !(isLine(c.adjborder.top) && isLine(c.adjborder.bottom) || isLine(c.adjborder.left) && isLine(c.adjborder.right))).length;
            d = [0, 1, 2, 3].find(dd => offset(clist[clist.length - 2], 1, 0, dd) === clist[clist.length - 1]);
            let cand = [];
            const MAXSIT = 1000;
            let sitcnt = 0, sitflg = false;
            let dfs = function (c, d, t, l) {
                if (sitcnt > MAXSIT) { sitflg = true; return true; }
                if (c.isnull || isCross(offset(c, -.5, 0, d)) || cell.qnum !== CQNUM.quesmark && t > cell.qnum) { return false; }
                if (c.qnum !== CQNUM.none) {
                    if (nxt(c) === l[l.length - 2]) { return false; }
                    if (hasLoop && l[l.length - 1].path === cell.path) { return false; }
                    if (cell.qnum !== CQNUM.quesmark && t !== cell.qnum) { return false; }
                    cand.push(l);
                    return true;
                }
                if (l.slice(0, -1).includes(c)) { return false; }
                let tmp = [d, d - 1, d + 1].map(dd => isLine(offset(c, .5, 0, dd)));
                let b = false;
                sitcnt++;
                [[!tmp[1] && !tmp[2], d, t,], [!tmp[0] && !tmp[2], d - 1, t + 1,], [!tmp[0] && !tmp[1], d + 1, t + 1,]].forEach(([cond, nd, nt]) => {
                    if (!cond) { return; }
                    if (l.length === clist.length) { sitcnt = 0; }
                    let nc = offset(c, 1, 0, nd);
                    let bb = dfs(nc, nd, nt, [...l, nc]);
                    b ||= bb;
                    if (l.length === clist.length && !bb) { add_cross(offset(c, .5, 0, nd)); }
                });
                return b;
            };
            dfs(clist[clist.length - 1], d, tn, clist);
            if (!sitflg && cand.length > 0) {
                for (let i = clist.length; i < cand[0].length; i++) {
                    if (!cand.every(l => l[i] === cand[0][i])) {
                        forEachSide(cand[0][i - 1], (nb, nc) => !cand.some(l => l[i] === nc) ? add_cross(nb) : undefined);
                        break;
                    }
                    forEachSide(cand[0][i - 1], (nb, nc) => nc === cand[0][i] ? add_line(nb) : undefined);
                }
            }
        }
    });
    forEachBorder(border => {
        if (isLine(border) || isCross(border)) { return; }
        let [c1, c2] = border.sidecell;
        let l1 = [c2, ...getCellChunk(c1, (c, nb, nc) => c.qnum === CQNUM.none && isLine(nb))];
        let l2 = [c1, ...getCellChunk(c2, (c, nb, nc) => c.qnum === CQNUM.none && isLine(nb))];
        if (l1[l1.length - 1].qnum !== CQNUM.none && l2[l2.length - 1].qnum !== CQNUM.none &&
            (nxt(l1[l1.length - 1]) !== l1[l1.length - 2]) === (nxt(l2[l2.length - 1]) !== l2[l2.length - 2])) { add_cross(border); }
        if (hasLoop && c1.path !== null && c1.path === c2.path) { add_cross(border); }
        if (!isClue(c1) && !isClue(c2) && c1.lcnt === 1 && c2.lcnt === 1) {
            let l = unique([...getCellChunk(c1, (c, nb, nc) => isLine(nb)), ...getCellChunk(c2, (c, nb, nc) => isLine(nb))]);
            if (l.every(c => [c1, c2].includes(c) || adjlist(c.adjborder, c.adjacent).every(([nb, nc]) => isCross(nb) || nc.isnull || [c1, c2].includes(nc) || l.includes(nc))) && board.linegraph.components.length > (unique([c1.path, c2.path]).length)) { add_cross(border); }
        }
    });
}

function KazunoriRoomAssist() {
    // use link and cross to record whether it's a domino aka nori
    let genlist = n => Array(n).fill(0).map((_, i) => i + 1);
    let getCand = cell => {
        if (cell.isnull) { return []; }
        if (cell.anum !== CANUM.none) { return [cell.anum]; }
        if (cell.snum.some(n => n !== -1)) { return cell.snum.filter(n => n !== -1); }
        return genlist(cell.room.clist.length / 2).filter(n => {
            let l = Array.from(cell.room.clist).filter(c => c !== cell && c.anum === n);
            if (l.length === 2 || l.length === 1 && !adjlist(cell.adjacent).includes(l[0])) { return false; }
            return true;
        });
    };
    forEachCell(cell => {
        NShadeInClist({
            isShaded: isLink,
            isUnshaded: isCross,
            add_shaded: add_link,
            add_unshaded: add_cross,
            clist: adjlist(cell.adjborder),
            n: 1,
        });
        if (cell.anum !== CANUM.none) {
            let l = adjlist(cell.adjacent).filter(c => c.room === cell.room && getCand(c).includes(cell.anum));
            if (l.length === 1) { add_number(l[0], cell.anum); }
            return;
        }
        let clist = Array.from(cell.room.clist);
        let cand = getCand(cell);
        let ncell = null;
        if (adjlist(cell.adjborder).some(b => isLink(b))) {
            let d = [0, 1, 2, 3].find(dd => isLink(offset(cell, .5, 0, dd)));
            ncell = offset(cell, 1, 0, d);
            let ncand = getCand(ncell);
            cand = cand.filter(n => ncand.includes(n));
        }
        cand = cand.filter(n => {
            let l = Array.from(cell.room.clist).filter(c => c !== cell && c.anum === n);
            if (l.length === 2 || l.length === 1 && !adjlist(cell.adjacent).includes(l[0])) { return false; }
            if (!adjlist(cell.adjacent).some(c => c.room === cell.room && getCand(c).includes(n))) { return false; }
            for (let d = 0; d < 4; d++) {
                if ([[1, 0], [1, 1], [0, 1]].every(([x, y]) => offset(cell, x, y, d) === ncell || offset(cell, x, y, d).anum === n)) { return false; }
            }
            return true;
        });
        add_candidate(cell, cand);
    });
    forEachRoom(room => {
        let clist = Array.from(room.clist);
        for (let i = 1; i <= clist.length / 2; i++) {
            let l = clist.filter(c => getCand(c).includes(i));
            if (l.length === 2) { l.forEach(c => add_number(c, i)); }
        }
    });
    forEachBorder(border => {
        if (border.ques === 1) { add_cross(border); }
        if (border.sidecell[0].room === border.sidecell[1].room) {
            let [c1, c2] = border.sidecell;
            if (c1.anum !== CANUM.none && c2.anum !== CANUM.none && c1.anum === c2.anum) { add_link(border); }
            if (c1.anum !== CANUM.none && c2.anum !== CANUM.none && c1.anum !== c2.anum) { add_cross(border); }
            let [l1, l2] = [c1, c2].map(c => getCand(c));
            if (l1.every(n => !l2.includes(n))) { add_cross(border); }
        }
        if (border.qnum === -1) { return; }
        let cand = getComb(border.sidecell.map(c => getCand(c))).filter(([a, b]) => a + b === border.qnum);
        if (isCross(border) && border.ques !== 1) { cand = cand.filter(([a, b]) => a !== b); }
        if (isLink(border) && border.ques !== 1) { cand = cand.filter(([a, b]) => a === b); }
        border.sidecell.forEach((c, i) => add_candidate(c, cand.map(e => e[i])));
        if (!getCand(border.sidecell[0]).includes(border.qnum / 2)) { add_cross(border); }
    });
}

function BattleshipAssist() {
    for (let i = 0; i < board.rows; i++) {
        let cl = [];
        for (let j = 0; j < board.cols; j++) { cl.push(board.getc(j * 2 + 1, i * 2 + 1)); }
        NShadeInClist({
            isShaded: isBlack,
            isUnshaded: isGreen,
            add_shaded: add_black,
            add_unshaded: add_green,
            clist: cl,
            n: board.getex(-1, i * 2 + 1).qnum,
        });
    }
    for (let i = 0; i < board.cols; i++) {
        let cl = [];
        for (let j = 0; j < board.rows; j++) { cl.push(board.getc(i * 2 + 1, j * 2 + 1)); }
        NShadeInClist({
            isShaded: isBlack,
            isUnshaded: isGreen,
            add_shaded: add_black,
            add_unshaded: add_green,
            clist: cl,
            n: board.getex(i * 2 + 1, -1).qnum,
        });
    }
    let pieces = ui.puzzle.board.bank.pieces;
    let minn = Math.min(...Array.from(pieces).map(p => p.str.replaceAll("0", "").length));
    for (let p of pieces) { p.setQcmp(0); }
    forEachCell(cell => cell.qnum === 0 ? add_green(cell) : undefined);
    forEachCell(cell => {
        if (cell.qnum === -2 || cell.qnum > 0) { add_black(cell); }
        if (cell.qnum === 0) { add_green(cell); }
        for (let d = 0; d < 4; d++) {
            if ([[1, 4, 6, 8], [1, 3, 6, 7], [2, 3, 6, 9], [2, 4, 6, 10]][d].includes(cell.qnum)) {
                [[1, 0], [0, -1]].forEach(([x, y]) => add_green(offset(cell, x, y, d)));
            }
            if ([[3, 7, 9], [2, 9, 10], [4, 8, 10], [1, 7, 8]][d].includes(cell.qnum)) {
                add_black(offset(cell, 1, 0, d));
            }
        }
    });
    let cset = new Set();
    forEachCell(cell => {
        if (cset.has(cell) || isGreen(cell)) { return; }
        if (!isBlack(cell)) {
            let clist = getCellChunk(cell, (c, nb, nc) => isInside(nc) && !isGreen(nc) && !isBlack(nc));
            if (!clist.every(c => adjlist(c.adjacent).every(nc => !isBlack(nc)))) { return; }
            clist.forEach(c => cset.add(c));
            if (clist.length < minn) { clist.forEach(c => add_green(c)); }
        }
        if (isBlack(cell)) {
            let clist = getCellChunk(cell, (c, nb, nc) => isBlack(nc));
            clist.forEach(c => cset.add(c));
            if (!clist.every(c => adjlist(c.adjacent).every(nc => nc.isnull || !isInside(nc) || isGreen(nc) || isBlack(nc)))) { return; }
            let p = pieces.find(p => p.qcmp === 0 && p.canon === getShape(clist));
            if (p === undefined) { return; }
            p.setQcmp(1);
        }
    });
    let cand = Array.from(pieces).flatMap(p => {
        if (p.qcmp === 1) { return []; }
        let l = [];
        for (let i = 0; i < p.h; i++) {
            for (let j = 0; j < p.w; j++) {
                if (p.str[i * p.w + j] === '1') { l.push([i, j]); }
            }
        }
        return [l];
    });
    if (cand.length === 0) {
        forEachCell(c => !isBlack(c) ? add_green(c) : undefined);
        return;
    }
    forEachCell(cell => {
        if (isGreen(cell)) { return; }
        let cblist = [], cwlist = [];
        cand.forEach((cl) => {
            getComb([[0, 1, 2, 3], [1, -1], [...Array(cl.length).keys()]]).forEach(([d, f, o]) => {
                let clist = cl.map(([x, y]) => offset(cell, x - cl[o][0], (y - cl[o][1]) * f, d));
                if (clist.some(c => c.isnull || isGreen(c) || !isInside(c))) { return; }
                let oclist = unique(clist.flatMap(c => adj8list(c)).filter(nc => !nc.isnull && isInside(nc) && !clist.includes(nc)));
                if (oclist.some(c => isBlack(c))) { return; }
                cblist.push(clist);
                cwlist.push(oclist);
            });
        });
        if (cblist.length === 0) { add_green(cell); }
        if (isBlack(cell)) {
            if (cblist.length > 0) { cblist = cblist.reduce((a, b) => a.filter(i => b.includes(i))); }
            if (cwlist.length > 0) { cwlist = cwlist.reduce((a, b) => a.filter(i => b.includes(i))); }
            cblist.forEach(b => add_black(b));
            cwlist.forEach(b => add_green(b));
        }
    });
}

function StatueParkAssist() {
    GreenConnected();
    let pieces = ui.puzzle.board.bank.pieces;
    let minn = Math.min(...Array.from(pieces).map(p => p.str.replaceAll("0", "").length));
    let totn = Array.from(pieces).reduce((m, p) => m + p.str.replaceAll("0", "").length, 0);
    if (Array.from(board.cell).filter(c => !isntBlack(c)).length === totn) {
        forEachCell(c => !isntBlack(c) ? add_black(c) : add_green(c));
    }
    for (let p of pieces) { p.setQcmp(0); }
    forEachCell(cell => {
        if (cell.qnum === CQNUM.bcir) { add_black(cell); }
        if (cell.qnum === CQNUM.wcir) { add_green(cell); }
    });
    let cset = new Set();
    forEachCell(cell => {
        if (cset.has(cell) || isGreen(cell)) { return; }
        if (!isBlack(cell)) {
            let clist = getCellChunk(cell, (c, nb, nc) => !isGreen(nc) && !isBlack(nc));
            if (!clist.every(c => adjlist(c.adjacent).every(nc => !isBlack(nc)))) { return; }
            clist.forEach(c => cset.add(c));
            if (clist.length < minn) { clist.forEach(c => add_green(c)); }
        }
        if (isBlack(cell)) {
            let clist = getCellChunk(cell, (c, nb, nc) => isBlack(nc));
            clist.forEach(c => cset.add(c));
            if (!clist.every(c => adjlist(c.adjacent).every(nc => nc.isnull || isGreen(nc) || isBlack(nc)))) { return; }
            let p = pieces.find(p => p.qcmp === 0 && p.canon === getShape(clist));
            if (p === undefined) { return; }
            p.setQcmp(1);
        }
    });
    let cand = Array.from(pieces).flatMap(p => {
        if (p.qcmp === 1) { return []; }
        let l = [];
        for (let i = 0; i < p.h; i++) {
            for (let j = 0; j < p.w; j++) {
                if (p.str[i * p.w + j] === '1') { l.push([i, j]); }
            }
        }
        return [l];
    });
    if (cand.length === 0) {
        forEachCell(c => !isBlack(c) ? add_green(c) : undefined);
        return;
    }
    forEachCell(cell => {
        if (isGreen(cell)) { return; }
        let cblist = [], cwlist = [];
        cand.forEach((cl) => {
            getComb([[0, 1, 2, 3], [1, -1], [...Array(cl.length).keys()]]).forEach(([d, f, o]) => {
                let clist = cl.map(([x, y]) => offset(cell, x - cl[o][0], (y - cl[o][1]) * f, d));
                if (clist.some(c => c.isnull || isGreen(c))) { return; }
                let oclist = unique(clist.flatMap(c => adjlist(c.adjacent)).filter(nc => !nc.isnull && !clist.includes(nc)));
                if (oclist.some(c => isBlack(c))) { return; }
                cblist.push(clist);
                cwlist.push(oclist);
            });
        });
        if (cblist.length === 0) { add_green(cell); }
        if (isBlack(cell)) {
            if (cblist.length > 0) { cblist = cblist.reduce((a, b) => a.filter(i => b.includes(i))); }
            if (cwlist.length > 0) { cwlist = cwlist.reduce((a, b) => a.filter(i => b.includes(i))); }
            cblist.forEach(b => add_black(b));
            cwlist.forEach(b => add_green(b));
        }
    });
}

function CompassAssist() {
    let isClue = c => !c.isnull && c.ques === 51;
    NoDeadendBorder();
    CluePerRegion({
        isShaded: isClue,
        isOthers: c => !isClue(c),
        isUnshaded: () => false,
        isNotPassable: (c, nb, nc) => isSide(nb),
        BridgeType: "link",
        n: 1,
    });
    forEachCell(cell => {
        if (!isClue(cell)) { return; }
        let qnums = [cell.qnum, cell.qnum4, cell.qnum3, cell.qnum2];
        let clist = getCellChunk(cell, (c, nb, nc) => isLink(nb));
        let qf = [c => c.bx > cell.bx, c => c.by < cell.by, c => c.bx < cell.bx, c => c.by > cell.by];
        let qcnt = qf.map(f => clist.filter(c => f(c)).length);
        if (qcnt.some((n, d) => n < qnums[d])) {
            let ocl = [];
            clist.forEach(c => forEachSide(c, (nb, nc) => {
                if (!isSide(nb) && !nc.isnull && !clist.includes(nc) && !ocl.includes(nc)) { ocl.push(nc); }
            }));
            if (ocl.length === 1) {
                forEachSide(ocl[0], (nb, nc) => clist.includes(nc) ? add_link(nb) : undefined);
            }
        }
        for (let d = 0; d < 4; d++) {
            if (qcnt[d] === qnums[d]) {
                clist.forEach(c => forEachSide(c, (nb, nc) => qf[d](nc) ? add_side(nb) : undefined));
            }
        }
    });
}

function LohkousAssist() {
    NoDeadendBorder();
    CluePerRegion({
        isShaded: c => c.qnums.length > 0,
        isOthers: c => c.qnums.length === 0,
        isUnshaded: () => false,
        isNotPassable: (c, nb, nc) => isSide(nb),
        BridgeType: "link",
        n: 1,
    });
    let reg = new Map();
    forEachCell(cell => {
        if (cell.qnums.length === 0) { return; }
        let clist = getCellChunk(cell, (c, nb, nc) => isLink(nb));
        clist.forEach(c => reg.set(c, cell));
    })
    forEachCell(cell => {
        if (cell.qnums.length === 0) { return; }
        let qnums = [...cell.qnums];
        let clist = getCellChunk(cell, (c, nb, nc) => isLink(nb));
        if (qnums.includes(-2)) {
            for (let d = 0; d < 2; d++) {
                clist.forEach(c => {
                    if ((b => !b.isnull && !isSide(b))(offset(c, -.5, 0, d))) { return; }
                    let l = 1;
                    while (isLink(offset(c, l - .5, 0, d))) { l++; }
                    if ((b => !b.isnull && !isSide(b))(offset(c, l - .5, 0, d))) { return; }
                    if (!qnums.includes(l) && qnums.includes(-2)) { qnums[qnums.indexOf(-2)] = l; }
                });
            }
        }
        if (qnums.length === 1) {
            let lx = Math.min(...clist.map(c => c.bx));
            let rx = Math.max(...clist.map(c => c.bx));
            let ly = Math.min(...clist.map(c => c.by));
            let ry = Math.max(...clist.map(c => c.by));
            for (let i = lx; i <= rx; i++) {
                for (let j = ly; j <= ry; j++) {
                    if (i < rx) { add_link(board.getb(i + 1, j)); }
                    if (j < ry) { add_link(board.getb(i, j + 1)); }
                }
            }
        }
        let ocl = [];
        clist.forEach(c => forEachSide(c, (nb, nc) => {
            if (!isSide(nb) && !nc.isnull && !clist.includes(nc) && !ocl.includes(nc)) { ocl.push(nc); }
        }));
        if (ocl.length === 1) {
            let l, t, ll;
            l = clist.sort((a, b) => a.by !== b.by ? a.by - b.by : a.bx - b.bx);
            t = l.map((c, i) => i !== 0 && offset(c, -1, 0) !== l[i - 1] ? "|#" : "#").join('');
            ll = t.split('|').map(s => s.length);
            l = clist.sort((a, b) => a.bx !== b.bx ? a.bx - b.bx : a.by - b.by);
            t = l.map((c, i) => i !== 0 && offset(c, 0, -1) !== l[i - 1] ? "|#" : "#").join('');
            ll = ll.concat(t.split('|').map(s => s.length));
            ll = unique(ll);
            if (qnums.length > ll.length) {
                forEachSide(ocl[0], (nb, nc) => clist.includes(nc) ? add_link(nb) : undefined);
            }
        }
        if (!qnums.includes(-2)) {
            for (let d = 0; d < 2; d++) {
                clist.forEach(c => {
                    if (clist.includes(offset(c, -1, 0, d))) { return; }
                    let ll = [], rr = [];
                    for (let l = 0; !offset(c, l, 0, d).isnull; l--) {
                        if ((reg.get(offset(c, l, 0, d)) ?? cell) !== cell) { break; }
                        if (!isLink(offset(c, l - .5, 0, d))) { ll.push(l); }
                        if (isSide(offset(c, l - .5, 0, d))) { break; }
                    }
                    for (let r = 0; !offset(c, r, 0, d).isnull; r++) {
                        if ((reg.get(offset(c, r, 0, d)) ?? cell) !== cell) { break; }
                        if (!isLink(offset(c, r + .5, 0, d))) { rr.push(r); }
                        if (isSide(offset(c, r + .5, 0, d))) { break; }
                    }
                    let cand = getComb([ll, rr]).filter(([l, r]) => qnums.includes(r - l + 1));
                    if (cand.length === 0) { return; }
                    ll = unique(cand.map(e => -e[0])).sort((a, b) => a - b);
                    rr = unique(cand.map(e => e[1])).sort((a, b) => a - b);
                    for (let i = 0; i < ll[0]; i++) { add_link(offset(c, -i - .5, 0, d)); }
                    for (let i = 0; i < rr[0]; i++) { add_link(offset(c, i + .5, 0, d)); }
                    if (ll.length === 1) { add_side(offset(c, -ll[0] - .5, 0, d)); }
                    if (rr.length === 1) { add_side(offset(c, rr[0] + .5, 0, d)); }
                });
            }
        }
    });
}

function ArchipelagoAssist() {
    SizeRegion_Cell({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        OneNumPerRegion: false,
        NoUnshadedNum: true,
    });
    forEachCell(cell => {
        if (!isBlack(cell)) { return; }
        let cl = [];
        let dfs = function (c) {
            if (c.isnull || cl.includes(c) || !isBlack(c)) { return; }
            cl.push(c);
            forEachSide(c, (nb, nc) => dfs(nc));
        };
        dfs(cell);
        let ol = unique(cl.flatMap(c => adj8list(c)).filter(c => !c.isnull && !isGreen(c) && !cl.includes(c)));
        if (ol.length === 1) { add_black(ol[0]); }
    });
    let ord = new Map();
    let nqnum = new Map();
    let n = 0;
    forEachCell(cell => {
        if (!isBlack(cell) || ord.has(cell)) { return; }
        n++;
        nqnum.set(n, []);
        let clist = [];
        let dfs2 = function (c) {
            if (c.isnull || ord.has(c) || !isBlack(c)) { return; }
            let cl = [], finished = true;
            let dfs = function (c) {
                if (!c.isnull && !isBlack(c) && !isGreen(c)) { finished = false; }
                if (c.isnull || cl.includes(c) || !isBlack(c)) { return; }
                cl.push(c);
                clist.push(c);
                ord.set(c, n);
                forEachSide(c, (nb, nc) => dfs(nc));
            };
            dfs(c);
            if (finished) { nqnum.get(n).push(cl.length); }
            let dc = cl.flatMap(c => adjdiaglist(c));
            dc = unique(dc);
            dc.forEach(nc => dfs2(nc));
        }
        dfs2(cell);
        let oclist = unique(clist.flatMap(c => adj8list(c)).filter(c => !c.isnull && !isGreen(c) && !clist.includes(c)));
        if (oclist.length === 1 && nqnum.get(n).some(m => m > 1 && !nqnum.get(n).includes(m - 1))) {
            add_black(oclist[0]);
            ord.set(oclist[0], n);
        }
    });
    forEachCell(cell => {
        if (!isBlack(cell) && !isGreen(cell)) {
            let t = unique(adj8list(cell).filter(c => isBlack(c)).map(c => ord.get(c)));
            let tt = t.flatMap(n => nqnum.get(n));
            if (unique(tt).length < tt.length) { add_green(cell); }
        }
        if (isBlack(cell)) {
            let cl = [];
            let dfs = function (c) {
                if (c.isnull || cl.includes(c) || !isBlack(c)) { return; }
                cl.push(c);
                forEachSide(c, (nb, nc) => dfs(nc));
            };
            dfs(cell);
            let ol = unique(cl.flatMap(c => adjlist(c.adjacent)).filter(c => !c.isnull && !isGreen(c) && !isBlack(c)));
            if (nqnum.get(ord.get(cell)).includes(cl.length) && ol.length === 1) {
                add_black(ol[0]);
                ord.set(ol[0], ord.get(cell));
            }
        }
    });
}

function SimpleGakoAssist() {
    forEachCell(cell => cell.qnum !== CQNUM.none ? add_number(cell, cell.qnum) : undefined);
    let genlist = () => Array(board.cols + board.rows - 1).fill(0).map((_, i) => i + 1);
    let isNAble = (c, n) => c.anum === n || c.anum === CANUM.none && (c.snum.every(m => m === -1) || c.snum.includes(n) || c.snum.every(m => m !== -1 && m < n));
    forEachCell(cell => {
        let clist = [cell];
        for (let x = 1; x < board.maxbx; x += 2) {
            let c = board.getc(x, cell.by);
            if (c !== cell) { clist.push(c); }
        }
        for (let y = 1; y < board.maxby; y += 2) {
            let c = board.getc(cell.bx, y);
            if (c !== cell) { clist.push(c); }
        }
        if (cell.anum !== CQNUM.none) {
            let t = clist.filter(c => isNAble(c, cell.anum));
            if (t.length === cell.anum) { t.forEach(c => add_number(c, cell.anum)); }
            t = clist.filter(c => c.anum === cell.anum);
            if (t.length === cell.anum) { clist.forEach(c => add_candidate_L4(c, genlist().filter(n => n !== cell.anum))); }
        }
        if (cell.anum === CQNUM.none) {
            let t = genlist();
            t = t.filter(n => clist.filter(c => isNAble(c, n)).length >= n);
            t = t.filter(n => clist.filter(c => c.anum === n).length < n);
            add_candidate_L4(cell, t);
        }
    });
}

function RoomsOfFactorsAssist() {
    let size = Math.max(board.rows, board.cols);
    LatinSquare({
        ext: (cell, cand) => {
            let product = cell.room.top.qnum;
            if (product < 0) { return cand; }
            Array.from(cell.room.clist).forEach(c => c.anum !== CANUM.none ? product /= c.anum : undefined);
            if (Array.from(cell.room.clist).filter(c => c.anum === CANUM.none).length === 1) { return [product]; }
            return cand.filter(n => product % n === 0);
        }
    });
    let getCand = cell => {
        if (cell.isnull) { return []; }
        if (cell.anum !== CANUM.none) { return [cell.anum]; }
        if (cell.snum.some(n => n !== -1)) { return cell.snum.filter(n => n !== -1); }
        let cand = Array(board.cols).fill(0).map((_, i) => i + 1);
        for (let i = 0; i < board.cols; i++) {
            cand = cand.filter(n => n !== board.getc(i * 2 + 1, cell.by).anum);
            cand = cand.filter(n => n !== board.getc(cell.bx, i * 2 + 1).anum);
        }
        return cand;
    };
    forEachRoom(room => {
        let product = room.top.qnum;
        if (product === -1) { return; }
        let clist = Array.from(room.clist);
        let cand = clist.map(c => getCand(c));
        if (cand.map(l => l.length).reduce((a, b) => a * b, 1) > 10 ** 6) { return; }
        let pairs = Array(clist.length).fill(0);
        for (let i = 0; i < clist.length; i++) {
            pairs[i] = [];
            for (let j = 0; j < i; j++) {
                if (clist[i].bx === clist[j].bx || clist[i].by === clist[j].by) { pairs[i].push(j); }
            }
        }
        cand = cand.reduce((a, b) => a.flatMap(i => b.flatMap(j => pairs[i.length].some(n => i[n] === j) ? [] : [[...i, j]])), [[]]);
        cand = cand.filter(l => l.reduce((a, b) => a * b, 1) === product);
        clist.forEach((c, i) => add_candidate(c, cand.map(l => l[i])));
    });
}

function MirroringTileAssist() {
    SizeRegion_Cell({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        OneNumPerRegion: false,
    });
    let cset = new Set();
    forEachCell(cell => {
        let clist = [];
        if (cset.has(cell) || isGreen(cell)) { return; }
        let dfs = function (c) {
            if (!isBlack(c) || clist.includes(c)) { return; }
            clist.push(c);
            cset.add(c);
            forEachSide(c, (nb, nc) => dfs(nc));
        };
        dfs(cell);
        if (!clist.every(c => adjlist(c.adjacent).every(nc => nc.isnull || isGreen(nc) || clist.includes(nc)))) { return; }
        let oclist = [];
        clist.forEach(c => adjdiaglist(c).forEach(nc => {
            if (!nc.isnull && !isGreen(nc) && !clist.includes(nc)) { oclist.push(nc); }
        }));
        let cand = clist.flatMap((cc) => {
            let r = [clist.map(c => [c.bx - cc.bx, c.by - cc.by])];
            r = [...r, ...r.map(l => l.map(([x, y]) => [-y, x]))];
            r = [...r, ...r.map(l => l.map(([x, y]) => [-x, y]))];
            r = [...r, ...r.map(l => l.map(([x, y]) => [x, -y]))];
            r = r.flatMap(l => oclist.map(oc => l.map(([x, y]) => board.getc(oc.bx + x, oc.by + y))));
            r = r.filter(l => l.every(c => !c.isnull && !isGreen(c) && (!isNum(c) || c.qnum === clist.length) && !adjlist(c.adjacent).some(nc => !l.includes(nc) && isBlack(nc))));
            return r;
        });
        if (cand.length > 0) {
            let ic = cand.reduce((a, b) => a.filter(c => b.includes(c)));
            ic.forEach(c => add_black(c));
            let uc = cand.map(l => unique(l.flatMap(c => adjlist(c.adjacent)).filter(c => !c.isnull && !l.includes(c))));
            uc = uc.reduce((a, b) => a.filter(c => b.includes(c)));
            uc.forEach(c => add_green(c));
        }
    });
}

function _WalkAssist(isOther) {
    SizeRegion_Border({
        isLinkable: (c, nb, nc) => !c.isnull && !nc.isnull && !isOther(c) && !isOther(nc),
        isCon: b => isLine(b) && !b.sidecell.some(c => isOther(c)),
        isNCon: b => isCross(b) || b.sidecell.some(c => isOther(c)),
        add_con: add_line,
        add_ncon: b => !b.sidecell.some(c => isOther(c)) ? add_cross(b) : undefined,
        byLine: true,
    });
    forEachCell(cell => {
        let t = adjlist(cell.adjborder, cell.adjacent).filter(([nb, nc]) => isOther(nc) && !isCross(nb));
        if (cell.qnum === 2 && t.length === 1) { t.forEach(([nb, nc]) => add_line(nb)); }
        if (cell.qnum === 1 && t.length === 2) { t.forEach(([nb, nc]) => add_line(nb)); }
    });
    let ccnt = new Map();
    let cqn = new Map();
    let cecnt = new Map();
    forEachCell(cell => {
        if (isOther(cell) || ccnt.has(cell)) { return; }
        let cl = [];
        let dfs = function (c) {
            if (c.isnull || isOther(c) || cl.includes(c)) { return; }
            cl.push(c);
            forEachSide(c, (nb, nc) => isLine(nb) ? dfs(nc) : undefined);
        };
        dfs(cell);
        let ecnt = cl.filter(c => adjlist(c.adjborder, c.adjacent).some(([nb, nc]) => !isLine(nb) && !isCross(nb) && !nc.isnull && !isOther(nc))).length;
        if (cl.length === 1 && cl[0].lcnt === 0 && adjlist(cl[0].adjborder, cl[0].adjacent).filter(([nb, nc]) => !isLine(nb) && !nc.isnull && !isOther(nc)).length >= 2) { ecnt = 2; }
        cl.forEach(c => { ccnt.set(c, cl.length); cecnt.set(c, ecnt); });
        if (cl.some(c => isNum(c))) {
            let qnum = cl.find(c => isNum(c)).qnum;
            cl.forEach(c => cqn.set(c, qnum));
            if (qnum === cl.length) {
                cl.forEach(c => forEachSide(c, (nb, nc) => !cl.includes(nc) && !isOther(nc) && !isLine(nb) ? add_cross(nb) : undefined));
            }
            if (qnum > cl.length && cl.flatMap(c => adjlist(c.adjborder)).filter(b => isLine(b) && b.sidecell.some(c => isOther(c))).length === 1) {
                cl.forEach(c => forEachSide(c, (nb, nc) => isOther(nc) ? add_cross(nb) : undefined));
            }
        }
    });
    forEachBorder(border => {
        if (isEdge(border)) { add_cross(border); }
        if (border.sidecell.some(c => c.isnull || isOther(c))) { return; }
        let [n1, n2] = border.sidecell.map(c => ccnt.get(c));
        let [qn1, qn2] = border.sidecell.map(c => cqn.get(c));
        let [cen1, cen2] = border.sidecell.map(c => cecnt.get(c));
        if (qn1 !== undefined && qn2 !== undefined && qn1 !== qn2) { add_cross(border); }
        if (qn1 === undefined && qn2 === undefined) { return; }
        if (getCellChunk(border.sidecell[0], (c, nb, nc) => isLine(nb) && !isOther(nc)).includes(border.sidecell[1])) { return; }
        if (n1 + n2 > (qn1 ?? qn2)) { add_cross(border); }
        if (n1 + n2 !== (qn1 ?? qn2) && cen1 === 1 && cen2 === 1) { add_cross(border); }
    });
}

function EnergyWalkAssist() {
    const isEnergy = c => !c.isnull && c.ques === 6;
    _WalkAssist(isEnergy);
    CellConnected({
        isShaded: c => c.lcnt > 0,
        isUnshaded: c => adjlist(c.adjborder).every(b => isntLine(b)),
        add_shaded: () => { },
        add_unshaded: c => forEachSide(c, (nb, nc) => add_cross(nb)),
        isNotPassable: (c, nb, nc) => isCross(nb),
        BridgeType: "line",
    });
    forEachCell(cell => {
        if (isEnergy(cell) && cell.lcnt > 0) {
            forEachSide(cell, (nb, nc) => add_line(nb));
        }
        if (isEnergy(cell) && adjlist(cell.adjborder).some(b => isCross(b) && b.sidecell.every(c => !c.isnull))) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        if (!isEnergy(cell) && adjlist(cell.adjborder).filter(b => isntLine(b)).length >= 3) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        if (!isEnergy(cell) && (cell.lcnt > 0 || isClue(cell))) {
            NShadeInClist({
                isShaded: isLine,
                isUnshaded: isntLine,
                add_shaded: add_line,
                add_unshaded: add_cross,
                clist: adjlist(cell.adjborder),
                n: 2,
            });
        }
    });
}

function ForestWalkAssist() {
    CellConnected({
        isShaded: c => c.lcnt > 0,
        isUnshaded: c => adjlist(c.adjborder).every(b => isntLine(b)),
        add_shaded: () => { },
        add_unshaded: c => forEachSide(c, (nb, nc) => add_cross(nb)),
        isNotPassable: (c, nb, nc) => isCross(nb),
        BridgeType: "line",
    });
    const isForest = c => !c.isnull && c.ques === 6;
    _WalkAssist(isForest);
    forEachCell(cell => {
        if (adjlist(cell.adjborder).filter(b => isntLine(b)).length >= (isForest(cell) ? 2 : 3)) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        if (cell.lcnt > 0 || isClue(cell)) {
            NShadeInClist({
                isShaded: isLine,
                isUnshaded: isntLine,
                add_shaded: add_line,
                add_unshaded: add_cross,
                clist: adjlist(cell.adjborder),
                n: isForest(cell) ? 3 : 2,
            });
        }
    });
}

function FireWalkAssist() {
    _WalkAssist(isFire);
    CellConnected({
        isShaded: cr => cr.qsub === CRQSUB.in,
        isUnshaded: cr => cr.qsub === CRQSUB.out,
        add_shaded: cr => add_inout(cr, CRQSUB.in),
        add_unshaded: cr => add_inout(cr, CRQSUB.out),
        isLinked: (c, nb, nc) => isCross(nb) || c.qsub === CRQSUB.in && nc.qsub === CRQSUB.in,
        isNotPassable: (c, nb, nc) => {
            if (nb !== undefined) return isLine(nb);
            let d = [0, 1, 2, 3].find(d => offset(c, 1, 1, d) === nc);
            return !isFire(offset(c, .5, .5, d));
        },
        DiagDir: true,
        Obj: "cross",
    });
    CellConnected({
        isShaded: cr => cr.qsub === CRQSUB.out,
        isUnshaded: cr => cr.qsub === CRQSUB.in,
        add_shaded: cr => add_inout(cr, CRQSUB.out),
        add_unshaded: cr => add_inout(cr, CRQSUB.in),
        isLinked: (c, nb, nc) => isCross(nb) || c.qsub === CRQSUB.out && nc.qsub === CRQSUB.out,
        isNotPassable: (c, nb, nc) => {
            if (nb !== undefined) return isLine(nb);
            let d = [0, 1, 2, 3].find(d => offset(c, 1, 1, d) === nc);
            return !isFire(offset(c, .5, .5, d));
        },
        DiagDir: true,
        Obj: "cross",
    });
    forEachCell(cell => {
        let emptycnt = adjlist(cell.adjborder).filter(b => !isEdge(b) && !isCross(b)).length;
        let linecnt = adjlist(cell.adjborder).filter(b => isLine(b)).length;
        // no branch and no cross
        if (linecnt === 2 && !isFire(cell)) { forEachSide(cell, (nb, nc) => add_cross(nb)); }
        // no deadend
        if (emptycnt <= 1) { forEachSide(cell, (nb, nc) => add_cross(nb)); }
        // cross
        if (linecnt === 3) { forEachSide(cell, (nb, nc) => add_line(nb)); }
        // 2 degree path
        if (emptycnt === 2 && (linecnt === 1 || isClue(cell))) { forEachSide(cell, (nb, nc) => add_line(nb)); }
        for (let d = 0; d < 4; d++) {
            if (isFire(cell) && isLine(offset(cell, -.5, 0, d)) && isCross(offset(cell, 0, -.5, d))) { add_line(offset(cell, 0, +.5, d)); }
            if (isFire(cell) && isLine(offset(cell, -.5, 0, d)) && isCross(offset(cell, 0, +.5, d))) { add_line(offset(cell, 0, -.5, d)); }
            if (isFire(cell) && isLine(offset(cell, .5, 0, d)) && isLine(offset(cell, -.5, 0, d))) {
                forEachSide(cell, (nb, nc) => add_line(nb));
            }
            if (isFire(cell) && isCross(offset(cell, .5, 0, d)) && isCross(offset(cell, -.5, 0, d))) {
                forEachSide(cell, (nb, nc) => add_cross(nb));
            }
        }
        if (offset(cell, +.5, +.5).qsub === CRQSUB.out && offset(cell, +.5, -.5).qsub === CRQSUB.in &&
            offset(cell, -.5, -.5).qsub === CRQSUB.out && offset(cell, -.5, +.5).qsub === CRQSUB.in) {
            cell.setQans(1);
            cell.draw();
        }
        if (offset(cell, +.5, +.5).qsub === CRQSUB.in && offset(cell, +.5, -.5).qsub === CRQSUB.out &&
            offset(cell, -.5, -.5).qsub === CRQSUB.in && offset(cell, -.5, +.5).qsub === CRQSUB.out) {
            cell.setQans(2);
            cell.draw();
        }
    });
    add_inout(board.getobj(0, 0), CRQSUB.out);
    let crossSet = new Set();
    let dfs = function (cr) {
        if (cr.qsub === CRQSUB.none || crossSet.has(cr)) { return; }
        crossSet.add(cr);
        for (let d = 0; d < 4; d++) {
            let ncr = offset(cr, 1, 0, d);
            let b = offset(cr, .5, 0, d);
            if (ncr.isnull) { continue; }
            if (cr.qsub !== CRQSUB.none) {
                // add line between different i/o
                (() => {
                    if (cr.isnull || ncr.isnull) { return; }
                    if (cr.qsub === CRQSUB.none || ncr.qsub === CRQSUB.none) { return; }
                    if (cr.qsub === ncr.qsub) { add_cross(b); }
                    if (cr.qsub !== ncr.qsub) { add_line(b); }
                })();
                // extend i/o through cross/line
                (() => {
                    if (ncr.isnull) { return; }
                    if (isntLine(b)) { add_inout(ncr, cr.qsub); }
                    if (!b.isnull && isLine(b)) { add_inout(ncr, cr.qsub ^ 1); }
                })();
                dfs(ncr);
            }
        }
    };
    forEachCross(cross => dfs(cross));
}

function WaterWalkAssist() {
    SingleLoopInCell({
        isPass: isClue,
    });
    const isWater = c => !c.isnull && c.ques === CQUES.ice;
    _WalkAssist(isWater);
    forEachCell(cell => {
        if (!isWater(cell)) { return; }
        if (adjlist(cell.adjborder, cell.adjacent).every(([nb, nc]) => isCross(nb) || nc.isnull || isWater(nc))) { forEachSide(cell, (nb, nc) => add_cross(nb)); }
        for (let d = 0; d < 4; d++) {
            if (isWater(offset(cell, 1, 0, d)) && isLine(offset(cell, .5, 0, d))) {
                let f = b => !b.sidecell.some(c => !c.isnull && !isWater(c)) ? add_cross(b) : undefined;
                [...adjlist(cell.adjborder), ...adjlist(offset(cell, 1, 0, d).adjborder)].forEach(b => f(b));
            }
        }
    });
}

function IceWalkAssist() {
    SingleLoopInCell({
        isPass: isClue,
    });
    _WalkAssist(isIce);
}

function HebiIchigoAssist() {
    let isEmpty = c => !c.isnull && !isClue(c) && c.anum === CANUM.none;
    let extendHebi = l => l.flatMap(h => {
        let [x, y] = h[h.length - 1];
        let nc = [[1, 0], [0, -1], [-1, 0], [0, 1]].map(([dx, dy]) => [x + dx, y + dy]);
        nc = nc.map(e => [...h, e]);
        nc = nc.filter(nh => new Set(nh.map(e => e.join(','))).size === nh.length);
        return nc;
    });
    let extendHebiN = (l, n) => n > 0 ? extendHebi(extendHebiN(l, n - 1)) : l;
    const HEBI = extendHebiN([[[0, 0], [-1, 0]]], 3);
    forEachCell(cell => {
        if (isNum(cell) && cell.qnum === 0) {
            let d = qdirRemap(cell.qdir);
            let pcell = offset(cell, 1, 0, d);
            while (!pcell.isnull && !isClue(pcell)) { add_dot(pcell); pcell = offset(pcell, 1, 0, d); }
        }
        if (isNum(cell) && cell.qnum !== 0) {
            let d = qdirRemap(cell.qdir);
            let pcell = offset(cell, 1, 0, d);
            while (isDot(pcell) || isEmpty(pcell) && adjlist(pcell.adjacent).some(nc => nc.anum !== CANUM.none && (nc.anum + cell.qnum) % 2 === 0)) { add_dot(pcell); pcell = offset(pcell, 1, 0, d); }
            if (!pcell.isnull && !isClue(pcell) && (pcell.anum === CANUM.none || pcell.anum === cell.qnum)) {
                let npcell = offset(pcell, 1, 0, d);
                while (isDot(npcell) || isEmpty(npcell) && adjlist(npcell.adjacent).some(nc => nc.anum !== CANUM.none && (nc.anum + cell.qnum) % 2 === 0)) { npcell = offset(npcell, 1, 0, d); }
                if (npcell.isnull || isClue(npcell) || npcell.anum !== CANUM.none && npcell.anum !== cell.qnum) {
                    add_number(pcell, cell.qnum);
                }
            }
        }
        if (cell.anum !== CANUM.none) {
            let cand = HEBI.flatMap(h => {
                let [sx, sy] = h[cell.anum - 1];
                let hl = [0, 1, 2, 3].flatMap(d => {
                    let nh = h.map(([x, y]) => offset(cell, x - sx, y - sy, d));
                    if (nh.some((c, i) => c.isnull || isDot(c) || isClue(c) || c.anum !== CANUM.none && c.anum !== i + 1)) { return []; }
                    let ncl = nh.flatMap(c => adjlist(c.adjacent));
                    if (ncl.some(c => !nh.includes(c) && c.anum !== CANUM.none)) { return []; }
                    let hc = nh[0], nc = offset(hc, 1, 0, d);
                    while (!nc.isnull && !isClue(nc) && nc.anum === CANUM.none) { nc = offset(nc, 1, 0, d); }
                    if (nc.anum !== CANUM.none) { return []; }
                    return [nh];
                });
                return hl;
            });
            if (cand.length > 0) {
                [0, 1, 2, 3, 4].forEach(i => {
                    if (cand.every(h => h[i] === cand[0][i])) { add_number(cand[0][i], i + 1); }
                });
                let ncl = cand.map(h => h.flatMap(c => adjlist(c.adjacent))
                    .filter(c => !c.isnull && !isClue(c) && !h.includes(c)));
                ncl = ncl.reduce((l1, l2) => l1.filter(c => l2.includes(c)));
                ncl.forEach(c => add_dot(c));
            }
        }
        if (cell.anum === CANUM.none && !isClue(cell)) {
            let cl = [];
            let dfs = function (c) {
                if (c.isnull || isDot(c) || isClue(c) || cl.includes(c) || cl.length >= 5) { return; }
                cl.push(c);
                forEachSide(c, (nb, nc) => dfs(nc));
            };
            dfs(cell);
            if (cl.length < 5) { cl.forEach(c => add_dot(c)); }
        }
        for (let d = 0; d < 4; d++) {
            if (cell.anum === 1 && offset(cell, -1, 0, d).anum === 2) {
                let pcell = offset(cell, 1, 0, d);
                while (!pcell.isnull && !isClue(pcell)) {
                    add_dot(pcell);
                    pcell = offset(pcell, 1, 0, d);
                }
            }
        }
    });
}

function NikojiAssist() {
    NoDeadendBorder();
    CluePerRegion({
        isShaded: isClue,
        isOthers: c => !isClue(c),
        isUnshaded: () => false,
        isNotPassable: (c, nb, nc) => isSide(nb),
        BridgeType: "link",
        n: 1,
    });
    let qcell = new Map();
    forEachCell(cell => {
        if (cell.qnum === CQNUM.none) { return; }
        if (!qcell.has(cell.qnum)) { qcell.set(cell.qnum, []); }
        qcell.get(cell.qnum).push(cell);
    });
    let qclist = new Map();
    let qshape = new Set();
    let cset = new Set();
    Array.from(qcell).forEach(([qnum, clist]) => {
        let s = new Set();
        let cl = [], cl2 = [];
        let dfs = function (x, y) {
            if (s.has([x, y].join(','))) { return; }
            s.add([x, y].join(','));
            cl = cl.concat(clist.map(c => offset(c, x, y)));
            cl2.push(offset(clist[0], x, y));
            [[0, 1], [1, 0], [0, -1], [-1, 0]].forEach(([dx, dy]) => {
                let nbl = clist.map(c => offset(c, x + dx / 2, y + dy / 2));
                let ncl = clist.map(c => offset(c, x + dx, y + dy));
                if (nbl.some(b => b.isnull || isSide(b)) || ncl.some(c => cset.has(c))) { nbl.forEach(b => add_side(b)); }
                if (nbl.some(b => isLink(b))) {
                    nbl.forEach(b => add_link(b));
                    dfs(x + dx, y + dy);
                }
            });
        };
        dfs(0, 0);
        cl.forEach(c => cset.add(c));
        qclist.set(qnum, cl2);
        if (cl2.every(c => adjlist(c.adjborder).every(b => isntLink(b) || isLink(b)))) {
            qshape.add(getShape(cl2));
        }
    });
    Array.from(qclist).forEach(([qnum, clist]) => {
        if (!qshape.has(getShape(clist))) { return; }
        let ocl = [];
        clist.forEach(c => forEachSide(c, (nb, nc) => {
            if (nc.isnull || clist.includes(nc) || isSide(nb)) { return; }
            ocl.push(nc);
        }));
        ocl = unique(ocl);
        if (ocl.length === 1) {
            forEachSide(ocl[0], (nb, nc) => clist.includes(nc) ? add_link(nb) : undefined);
        }
    });
}

function UsoTatamiAssist() {
    NoCrossingBorder();
    let s = Array.from(new Array(board.rows), () => new Array(board.cols).fill([]));
    forEachCell(c => {
        let x = (c.bx - 1) / 2, y = (c.by - 1) / 2;
        let s1 = x > 0 ? s[y][x - 1] : [];
        let s2 = y > 0 ? s[y - 1][x] : [];
        s[y][x] = [...s1, ...s2.filter(c => !s1.includes(c))];
        if (c.qnum !== CQNUM.none) { s[y][x].push(c); }
    });
    RectRegion_Border({
        isSizeAble: (w, h, sc, c) => {
            if (w !== 1 && h !== 1) { return false; }
            if (sc !== null && w * h === sc.qnum) { return false; }
            let x = (c.bx - 1) / 2 + w - 1, y = (c.by - 1) / 2 + h - 1;
            let f = (a, b) => a < 0 || b < 0 ? [] : s[a][b];
            if (f(y, x).length - f(y, x - w).length - f(y - h, x).length + f(y - h, x - w).length !== 1) { return false; }
            sc = f(y, x).find(c => !f(y, x - w).includes(c) && !f(y - h, x).includes(c));
            return sc.qnum === CQNUM.quesmark || w * h !== sc.qnum;
        }
    });
}

function SlashPackAssist() {
    let add_qsub = function (c, qsub) { // 0b001: O, 0b010: \, 0b100: /
        qsub = (qsub | c.qsub);
        if (qsub === 0b111) { return; }
        if (c === undefined || c.isnull || qsub === c.qsub) { return; }
        c.setQsub(qsub);
        c.draw();
        stepcheck(true);
    };
    let add_slash = function (c, qans) {    // 0:/, 1:\
        if (c === undefined || c.isnull || c.qans !== CQANS.none) { return; }
        c.setQans(qans % 2 === 0 ? CQANS.lslash : CQANS.rslash);
        c.draw();
        stepcheck(true);
    };
    forEachCell(cell => {
        if (isClue(cell)) { add_qsub(cell, 0b110); }
        if (cell.qans === CQANS.lslash) { add_qsub(cell, 0b011); }
        if (cell.qans === CQANS.rslash) { add_qsub(cell, 0b101); }
        if (cell.qsub === 0b011) { add_slash(cell, CQANS.lslash); }
        if (cell.qsub === 0b101) { add_slash(cell, CQANS.rslash); }
        if (!offset(cell, 1, 1).isnull) {
            let t = [[offset(cell, 0, 0), CQANS.rslash, 0b010], [offset(cell, 1, 0), CQANS.lslash, 0b100],
            [offset(cell, 1, 1), CQANS.rslash, 0b010], [offset(cell, 0, 1), CQANS.lslash, 0b100]];
            if (t.filter(([c, qans, qsub]) => (c.qsub & qsub) === qsub).length === 3) {
                t.forEach(([c, qans, qsub]) => add_qsub(c, qsub));
            }
            if (t.filter(([c, qans, qsub]) => (c.qsub & qsub) === qsub).length === 2 && t.filter(([c, qans, qsub]) => c.qans === qans).length === 1) {
                t.forEach(([c, qans, qsub]) => (c.qsub & qsub) !== qsub ? add_slash(c, qans) : undefined);
            }
        }
    });
}

function ContextAssist() {
    BlackNotAdjacent();
    GreenConnected();
    forEachCell(cell => {
        if (!isNum(cell)) { return; }
        let cand = [];
        let clist = [...adj8list(cell), cell];
        let gen = function (l) {
            if (l.length === 9) {
                if (l[7] === 1 && l[0] === 1) { return; }
                if (l[8] === 0 && [1, 3, 5, 7].filter(n => l[n] === 1).length !== cell.qnum) { return; }
                if (l[8] === 1 && [0, 2, 4, 6].filter(n => l[n] === 1).length !== cell.qnum) { return; }
                if (l[8] === 1 && [1, 3, 5, 7].some(n => l[n] === 1)) { return; }
                let bclist = clist.filter((c, i) => l[i] === 1);
                let tl = [];
                if (clist.some(c => {
                    if (c.isnull || bclist.includes(c) || tl.includes(c)) { return false; }
                    let n = 0;
                    let olist = [];
                    let dfs = function (c) {
                        if (c.isnull || tl.includes(c)) { return false; }
                        if (!clist.includes(c)) {
                            if (isBlack(c)) { return false; }
                            olist.push(c);
                            return true;
                        }
                        if (bclist.includes(c)) { return false; }
                        tl.push(c);
                        n++;
                        let res = 0;
                        res |= dfs(offset(c, -1, 0));
                        res |= dfs(offset(c, 0, -1));
                        res |= dfs(offset(c, 1, 0));
                        res |= dfs(offset(c, 0, 1));
                        return res;
                    };
                    let res = dfs(c);
                    if (!res && n + bclist.length < clist.length) { return true; }
                    return false;
                })) { return; };
                cand.push([...l]);
                return;
            }
            if (l.length > 1 && l[l.length - 1] === 1 && l[l.length - 2] === 1) { return; }
            let c = clist[l.length];
            if (!isBlack(c)) { gen([...l, 0]); }
            if (!isntBlack(c)) { gen([...l, 1]); }
        };
        gen([]);
        if (cand.length > 0) {
            adj8list(cell).forEach((c, i) => {
                if (cand.every(e => e[i] === cand[0][i])) { (cand[0][i] === 1 ? add_black : add_green)(c); }
            });
            if (cand.every(e => e[8] === cand[0][8])) { (cand[0][8] === 1 ? add_black : add_green)(cell); }
        }
    });
}

function CoffeeMilkAssist() {
    let isWhite = c => c.qnum === 1;
    let isBlack = c => c.qnum === 2;
    let isGray = c => c.qnum === -2;
    let add_path = c => {
        if (c.qnum !== CQNUM.none) { return; }
        if (isntLine(c.adjborder.top)) {
            add_line(c.adjborder.left);
            add_line(c.adjborder.right);
        }
        if (isntLine(c.adjborder.left)) {
            add_line(c.adjborder.top);
            add_line(c.adjborder.bottom);
        }
    };
    CellConnected({
        isShaded: isGray,
        isUnshaded: c => adjlist(c.adjborder).every(b => isntLine(b)),
        add_shaded: add_path,
        add_unshaded: c => forEachSide(c, (nb, nc) => add_cross(nb)),
        isNotPassable: (c, nb, nc) => isCross(nb),
        isOthers: c => isWhite(c) || isBlack(c),
        cantDivideShade: (s, o) => s === 0 && o > 0,
        OnlyOneConnected: false,
        BridgeType: "line",
    });
    CellConnected({
        isShaded: isWhite,
        isUnshaded: c => adjlist(c.adjborder).every(b => isntLine(b)),
        add_shaded: add_path,
        add_unshaded: c => forEachSide(c, (nb, nc) => add_cross(nb)),
        isNotPassable: (c, nb, nc) => isCross(nb),
        isOthers: c => isBlack(c),
        cantDivideShade: (s, o) => s !== o,
        OnlyOneConnected: false,
        BridgeType: "line",
    });
    let nxtc = function (c, d) {
        let nc = offset(c, 1, 0, d);
        if (isCross(offset(c, .5, 0, d))) { return board.emptycell; }
        while (!nc.isnull && nc.qnum === CQNUM.none) {
            if (isCross(offset(nc, .5, 0, d))) { return board.emptycell; }
            nc = offset(nc, 1, 0, d);
        }
        return nc;
    }
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none && !isGray(cell) && adjlist(cell.adjborder).filter(b => !isntLine(b)).length === 1) {
            forEachSide(cell, (nb, nc) => add_line(nb));
        }
        if (isGray(cell) && adjlist(cell.adjborder).filter(b => !isntLine(b)).length === 1) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        if (isGray(cell)) {
            let t = [0, 1, 2, 3].map(d => nxtc(cell, d).qnum);
            if (cell.lcnt > 0 && t.filter(n => n === 1).length === 1) { add_line(offset(cell, .5, 0, t.indexOf(1))); }
            if (cell.lcnt > 0 && t.filter(n => n === 2).length === 1) { add_line(offset(cell, .5, 0, t.indexOf(2))); }
            t = t.filter(n => n > 0);
            if (t.length === 0 || unique(t).length === 1) { forEachSide(cell, (nb, nc) => add_cross(nb)); }
        }
        for (let d = 0; d < 4; d++) {
            if (cell.qnum === CQNUM.none && isLine(offset(cell, .5, 0, d))) {
                add_line(offset(cell, -.5, 0, d));
                add_cross(offset(cell, 0, .5, d));
                add_cross(offset(cell, 0, -.5, d));
            }
            if (cell.qnum === CQNUM.none && isCross(offset(cell, .5, 0, d))) { add_cross(offset(cell, -.5, 0, d)); }
            if (cell.qnum !== CQNUM.none && !isntLine(offset(cell, .5, 0, d))) {
                let pcell = nxtc(cell, d);
                if (pcell.isnull || isWhite(cell) && isBlack(pcell) || isGray(cell) && isGray(pcell)) { add_cross(offset(cell, .5, 0, d)); }
                let f = c => isGray(c) || c.path !== null && Array.from(c.path.clist).some(c => isGray(c));
                if (!pcell.isnull && cell.path !== pcell.path && f(cell) && f(pcell)) { add_cross(offset(cell, .5, 0, d)); }
            }
        }
    });
}

function CombiBlockAssist() {
    for (let i = 0; i < board.tilegraph.components.length; i++) {
        let tile = board.tilegraph.components[i];
        let clist = Array.from(tile.clist);
        clist.forEach(c => forEachSide(c, (nb, nc) =>
            !nc.isnull && nc.tile === tile ? add_link(nb) : undefined));
        if (tile.clist[0].block.dotcnt === 2) {
            clist.forEach(c => forEachSide(c, (nb, nc) => add_link(nb)));
            continue;
        }
        clist.flatMap(c => adjlist(c.adjborder, c.adjacent).flatMap(([nb, nc]) => isSide(nb) ? nc.tile : [])).forEach(ntile =>
            clist.forEach(c => forEachSide(c, (nb, nc) => nc.tile === ntile ? add_side(nb) : undefined)));
        let tlist = clist.flatMap(c => adjlist(c.adjborder, c.adjacent).flatMap(([nb, nc]) => isLink(nb) && nc.tile !== tile ? nc.tile : []));
        if (tlist.length === 0) {
            tlist = clist.flatMap(c => adjlist(c.adjborder, c.adjacent).flatMap(([nb, nc]) => !isSide(nb) && !nc.isnull ? nc.tile : []));
        }
        tlist = unique(tlist).filter(t => t !== tile);
        if (tlist.length === 1) {
            let ntile = tlist[0];
            let cclist = [...clist, ...Array.from(ntile.clist)];
            cclist.forEach(c => forEachSide(c, (nb, nc) => cclist.includes(nc) ? add_link(nb) : add_side(nb)));
            continue;
        }
        let nshapeSet = new Set(clist
            .flatMap(c => adjlist(c.adjborder, c.adjacent).flatMap(([nb, nc]) => isSide(nb) ? nc.tile : []))
            .flatMap(t => t.clist[0].block.dotcnt === 2 ? getShape(Array.from(t.clist[0].block.clist)) : []));
        tlist.forEach(ntile => {
            let shape = getShape([...clist, ...Array.from(ntile.clist)]);
            if (!shape.includes('0') || nshapeSet.has(shape)) {
                clist.forEach(c => forEachSide(c, (nb, nc) => nc.tile === ntile ? add_side(nb) : undefined));
            }
        });
    }
}

function BrowniesAssist() {
    let isCircle = c => c.qnum === -2;
    forEachCell(cell => {
        if (cell.qnum2 >= 0) {
            NShadeInClist({
                isShaded: isGreen,
                isUnshaded: c => !c.isnull && c.qsub === CQSUB.yellow,
                add_shaded: add_green,
                add_unshaded: add_yellow,
                clist: adj8list(cell).filter(c => !c.isnull && c.qnum2 === -1),
                n: cell.qnum2,
            });
        }
        if (cell.qnum2 !== -1) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
            return;
        }
        if (isCircle(cell) && cell.lcnt === 1 || cell.lcnt === 2) {
            add_yellow(cell);
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        if (isCircle(cell) && adjlist(cell.adjborder).every(b => isntLine(b))) { add_green(cell); }
        if (!isCircle(cell) && adjlist(cell.adjborder).every(b => isntLine(b))) { add_yellow(cell); }
        if (isGreen(cell) && isCircle(cell)) { forEachSide(cell, (nb, nc) => add_cross(nb)); }
        for (let d = 0; d < 4; d++) {
            if (isLine(offset(cell, .5, 0, d))) {
                add_cross(offset(cell, 0, -.5, d));
                add_cross(offset(cell, 0, +.5, d));
            }
            if (isLine(offset(cell, .5, 0, d)) && isntLine(offset(cell, -.5, 0, d))) {
                add_green(cell);
                forEachSide(cell, (nb, nc) => add_cross(nb));
            }
            if (isGreen(cell) && isGreen(offset(cell, 1, 0, d))) {
                add_cross(offset(cell, .5, 0, d));
            }
            if (isCross(offset(cell, -.5, 0, d)) || isGreen(cell)) {
                let pcell = cell;
                while (!isCircle(pcell) && !isntLine(offset(pcell, .5, 0, d)) && (pcell === cell || !isGreen(pcell))) {
                    pcell = offset(pcell, 1, 0, d);
                }
                if (!isCircle(pcell)) { add_cross(offset(cell, .5, 0, d)); }
            }
            if (isGreen(cell) && adjlist(cell.adjborder).every(b => b === offset(cell, .5, 0, d) || isntLine(b))) {
                let pcell = cell;
                while (!isCircle(pcell)) {
                    add_line(offset(pcell, .5, 0, d));
                    pcell = offset(pcell, 1, 0, d);
                }
            }
            if (isCircle(cell)) {
                let pcell = cell;
                while (!isntLine(offset(pcell, .5, 0, d)) && (pcell === cell || !isCircle(pcell) && isYellow(pcell))) {
                    pcell = offset(pcell, 1, 0, d);
                }
                if (isYellow(pcell) || isCircle(pcell)) { add_cross(offset(cell, .5, 0, d)); }
            }
            if (isCircle(cell) && isYellow(cell) && adjlist(cell.adjborder).every(b => b === offset(cell, .5, 0, d) || isntLine(b))) {
                let pcell = cell;
                while (isYellow(pcell)) {
                    add_line(offset(pcell, .5, 0, d))
                    pcell = offset(pcell, 1, 0, d);
                }
                if (isCircle(offset(pcell, 1, 0, d))) {
                    add_cross(offset(pcell, .5, 0, d));
                }
            }
        }
    });
}

function ReflectLinkAssist() {
    forEachCell(cell => cell.ques === 11 ? forEachSide(cell, (nb, nc) => add_line(nb)) : undefined);
    SingleLoopInCell({ hasCross: true });
    forEachCell(cell => {
        if (cell.lcnt === 2 && cell.ques !== 11) { forEachSide(cell, (nb, nc) => add_cross(nb)); }
        for (let d = 0; d < 4; d++) {
            let ncell = offset(cell, 1, 0, d);
            if (cell.ques !== 11 && ncell.ques !== 11 &&
                cell.lcnt === 1 && ncell.lcnt === 1 &&
                cell.path === ncell.path && board.linegraph.components.length > 1) {
                add_cross(offset(cell, .5, 0, d));
            }
        }
        if (cell.ques === CQUES.none) { return; }
        let d = [-1, -1, 1, 2, 3, 0][cell.ques];
        add_line(offset(cell, 0, .5, d));
        add_line(offset(cell, .5, 0, d));
        add_cross(offset(cell, 0, -.5, d));
        add_cross(offset(cell, -.5, 0, d));
        if (cell.qnum < 3) { return; }
        let cand = Array(cell.qnum - 2).fill(0).map((_, i) => i + 1);
        cand = cand.filter(n => {
            for (let i = 0; i < n; i++) {
                if (isntLine(offset(cell, i + .5, 0, d))) { return false; }
                if (i > 0 && offset(cell, i, 0, d).ques === CQUES.none && (isLine(offset(cell, i, -.5, d)) || isLine(offset(cell, i, +.5, d)))) { return false; }
            }
            for (let i = 0; i < cell.qnum - 1 - n; i++) {
                if (isntLine(offset(cell, 0, i + .5, d))) { return false; }
                if (i > 0 && offset(cell, 0, i, d).ques === CQUES.none && (isLine(offset(cell, -.5, i, d)) || isLine(offset(cell, +.5, i, d)))) { return false; }
            }
            if (isLine(offset(cell, n + .5, 0, d)) || isLine(offset(cell, 0, cell.qnum - 1 - n + .5, d))) { return false; }
            if (isntLine(offset(cell, n, -.5, d)) && isntLine(offset(cell, n, +.5, d))) { return false; }
            if (isntLine(offset(cell, -.5, cell.qnum - 1 - n, d)) && isntLine(offset(cell, +.5, cell.qnum - 1 - n, d))) { return false; }
            return true;
        });
        if (cand.length > 0) {
            let mx = Math.min(...cand);
            let my = cell.qnum - 1 - Math.max(...cand);
            for (let i = 0; i < mx; i++) { add_line(offset(cell, i + .5, 0, d)); }
            for (let i = 0; i < my; i++) { add_line(offset(cell, 0, i + .5, d)); }
            if (mx + my + 1 === cell.qnum) {
                add_cross(offset(cell, mx + .5, 0, d));
                add_cross(offset(cell, 0, my + .5, d));
            }
        }
    });
}

function UsoOneAssist() {
    let add_Ocell = function (c) {
        if (c === undefined || c.isnull || c.qcmp !== 0) { return; }
        c.setQcmp(1);
        c.draw();
        stepcheck(true);
    };
    let add_Xcell = function (c) {
        if (c === undefined || c.isnull || c.qcmp !== 0) { return; }
        c.setQcmp(2);
        c.draw();
        stepcheck(true);
    };
    let isOcell = c => c.qcmp === 1;
    let isXcell = c => c.qcmp === 2;
    GreenConnected();
    BlackNotAdjacent();
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none) { add_green(cell); }
        if (cell.qnum >= 0 && isOcell(cell)) {
            NShadeInClist({
                isShaded: isBlack,
                isUnshaded: isGreen,
                add_shaded: add_black,
                add_unshaded: add_green,
                clist: adjlist(cell.adjacent),
                n: cell.qnum,
            });
        }
        if (cell.qnum >= 0 && cell.qnum === adjlist(cell.adjacent).filter(c => !c.isnull).length) {
            add_Xcell(cell);
        }
        if (cell.qnum >= 0 && isXcell(cell) && adjlist(cell.adjacent).filter(c => !c.isnull && !isGreen(c) && !isBlack(c)).length === 1) {
            let c = adjlist(cell.adjacent).find(c => !c.isnull && !isGreen(c) && !isBlack(c));
            if (adjlist(cell.adjacent).filter(c => isBlack(c)).length === cell.qnum) { add_black(c); }
            if (adjlist(cell.adjacent).filter(c => isBlack(c)).length === cell.qnum - 1) { add_green(c); }
        }
        if (cell.qnum >= 0 && (adjlist(cell.adjacent).filter(c => isBlack(c)).length > cell.qnum ||
            4 - adjlist(cell.adjacent).filter(c => isntBlack(c)).length < cell.qnum)) {
            add_Xcell(cell);
        }
        if (cell.qnum >= 0 && adjlist(cell.adjacent).every(c => c.isnull || isBlack(c) || isGreen(c)) &&
            adjlist(cell.adjacent).filter(c => isBlack(c)).length === cell.qnum) {
            add_Ocell(cell);
        }
    });
    forEachRoom(room => {
        let l = Array.from(room.clist).filter(c => c.qnum !== CQNUM.none);
        NShadeInClist({
            isShaded: isXcell,
            isUnshaded: isOcell,
            add_shaded: add_Xcell,
            add_unshaded: add_Ocell,
            clist: l,
            n: 1,
        });
    });
}

function Yajirushi2Assist() {
    let isDot = isYellow;
    let add_dot = add_yellow;
    let isntDot = c => c.isnull || isClue(c) || isOcell(c) || c.anum !== CANUM.none;
    let isArrowAble = function (c, d) {
        if (isDot(c) || isntDot(offset(c, 1, 0, d)) || c.anum !== CANUM.none && d !== qdirRemap(c.anum)) { return false; }
        let nc = offset(c, 2, 0, d);
        while (isDot(nc)) { nc = offset(nc, 1, 0, d); }
        if (nc.isnull || isClue(nc) || nc.anum !== CANUM.none && [-1, 3, 1, 0, 2][nc.anum] !== d) { return false; }
        return true;
    };
    let add_arrow = function (c, d) {
        if (c === undefined || c.isnull || c.anum !== CANUM.none) { return; }
        c.setAnum(d);
        c.setQsub(CQSUB.none);
        c.draw();
        stepcheck(true);
    }
    CellConnected({
        isShaded: isDot,
        isUnshaded: c => isOcell(c) || c.anum !== CANUM.none || isClue(c),
        add_shaded: add_dot,
        add_unshaded: add_Ocell,
    });
    let hasDot = false;
    forEachCell(cell => { hasDot = hasDot || isDot(cell); });
    forEachCell(cell => {
        if (isNum(cell)) {
            NShadeInClist({
                isShaded: c => isOcell(c) || c.anum !== CANUM.none,
                isUnshaded: c => isDot(c) || isClue(c),
                add_shaded: add_Ocell,
                add_unshaded: add_dot,
                clist: adjlist(cell.adjacent),
                n: cell.qnum
            })
        }
        if (cell.anum !== CANUM.none) {
            let d = [-1, 1, 3, 2, 0][cell.anum];
            add_dot(offset(cell, 1, 0, d));
            let ncell = offset(cell, 2, 0, d);
            while (isDot(ncell)) { ncell = offset(ncell, 1, 0, d); }
            if (isOcell(ncell)) {
                add_arrow(ncell, [3, 2, 4, 1][d]);
            } else if (!ncell.isnull && !isClue(ncell)) {
                let mcell = offset(ncell, 1, 0, d);
                while (isDot(mcell)) { mcell = offset(mcell, 1, 0, d); }
                if (mcell.isnull || isClue(mcell) || mcell.anum !== CANUM.none && [-1, 3, 1, 0, 2][mcell.anum] !== d) {
                    add_arrow(ncell, [3, 2, 4, 1][d]);
                }
            }
        }
        if (cell.anum === CANUM.none && hasDot && adjlist(cell.adjacent).filter(c => !isntDot(c)).length === 1) {
            add_dot(adjlist(cell.adjacent).find(c => !isntDot(c)));
        }
        if ([0, 1, 2, 3].every(d => !isArrowAble(cell, d))) { add_dot(cell); }
        if (isOcell(cell) && [0, 1, 2, 3].filter(d => isArrowAble(cell, d)).length === 1) {
            add_arrow(cell, [4, 1, 3, 2][[0, 1, 2, 3].find(d => isArrowAble(cell, d))]);
        }
    });
}

function ToichikaAssist() {
    let isArrowAble = function (c, d) {
        if (isDot(c) || c.anum !== CANUM.none && d !== qdirRemap(c.anum)) { return false; }
        let roomset = new Set(Array.from(c.room.clist).flatMap(c => adjlist(c.adjacent).flatMap(nc => nc.isnull ? [] : nc.room)));
        roomset.add(c.room);
        let nc = offset(c, 1, 0, d), cl = [];
        while (isDot(nc) || roomset.has(nc.room) && nc.anum == CANUM.none) {
            cl.push(nc);
            if (Array.from(nc.room.clist).every(c => isDot(c) || cl.includes(c))) { return false; }
            nc = offset(nc, 1, 0, d);
        }
        if (nc.isnull || roomset.has(nc.room) || nc.anum !== CANUM.none && [-1, 3, 1, 0, 2][nc.anum] !== d) { return false; }
        return true;
    };
    forEachCell(cell => {
        if (isNum(cell)) { add_number(cell, cell.qnum); }
        if (cell.anum !== CANUM.none) {
            let d = [-1, 1, 3, 2, 0][cell.anum];
            let roomset = new Set(Array.from(cell.room.clist).flatMap(c => adjlist(c.adjacent).flatMap(nc => nc.isnull ? [] : nc.room)));
            let ncell = offset(cell, 1, 0, d);
            while (isDot(ncell) || roomset.has(ncell.room)) {
                add_dot(ncell);
                ncell = offset(ncell, 1, 0, d);
            }
            if (Array.from(ncell.room.clist).filter(c => !isDot(c)).length === 1 && !isDot(ncell)) {
                add_number(ncell, [3, 2, 4, 1][d]);
            } else {
                let mcell = offset(ncell, 1, 0, d);
                while (isDot(mcell) || roomset.has(mcell.room)) { mcell = offset(mcell, 1, 0, d); }
                if (mcell.isnull || mcell.anum !== CANUM.none && [-1, 3, 1, 0, 2][mcell.anum] !== d) {
                    add_number(ncell, [3, 2, 4, 1][d]);
                }
            }
        }
        if (!isDot(cell) && cell.qnum === CANUM.none && [0, 1, 2, 3].every(d => !isArrowAble(cell, d))) { add_dot(cell); }
        if (!isDot(cell) && cell.qnum === CANUM.none && [0, 1, 2, 3].filter(d => {
            let nc = offset(cell, 1, 0, d);
            while (isDot(nc)) { nc = offset(nc, 1, 0, d); }
            return nc.anum === [3, 2, 4, 1][d];
        }).length > 1) { add_dot(cell); }
        if (!isDot(cell) && Array.from(cell.room.clist).filter(c => !isDot(c)).length === 1 &&
            [0, 1, 2, 3].filter(d => isArrowAble(cell, d)).length === 1) {
            add_number(cell, [4, 1, 3, 2][[0, 1, 2, 3].find(d => isArrowAble(cell, d))]);
        }
    });
    forEachRoom(room => {
        if (Array.from(room.clist).some(c => c.anum !== CANUM.none)) {
            Array.from(room.clist).forEach(c => c.anum === CANUM.none ? add_dot(c) : undefined);
        }
    });
}

function ArukoneAssist() {
    forEachCell(cell => {
        if (cell.qnum === CQNUM.none) {
            NShadeInClist({
                isShaded: isLine,
                isUnshaded: isntLine,
                add_shaded: add_line,
                add_unshaded: add_cross,
                n: 2,
                clist: adjlist(cell.adjborder),
            });
        }
        let num = undefined;
        if (cell.path !== null) { num = Array.from(cell.path.clist).find(c => c.qnum !== CQNUM.none); }
        if (num !== undefined) { num = num.qnum; }
        if (cell.qnum !== CQNUM.none) { num = cell.qnum; }
        if (cell.lcnt === 2 || cell.lcnt === 1 && cell.qnum !== CQNUM.none) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        if (cell.qnum === CQNUM.none && adjlist(cell.adjborder).filter(b => isntLine(b)).length >= 3) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }

        if (num !== undefined) {
            forEachSide(cell, (nb, nc) => {
                if (nc.isnull || isCross(nb)) { return; }
                if (nc.path === null && nc.qnum !== CQNUM.none && nc.qnum !== num || nc.path !== null && Array.from(nc.path.clist).some(c => c.qnum !== CQNUM.none && c.qnum !== num)) {
                    add_cross(nb);
                }
            });
        }
        let l = adjlist(cell.adjborder, cell.adjacent).filter(([nb, nc]) => isLine(nb) || !nc.isnull && !isCross(nb));
        if (cell.qnum === CQNUM.none && cell.lcnt === 1 && l.length === 2 || cell.qnum !== CQNUM.none && l.length === 1) {
            l.forEach(([nb, nc]) => add_line(nb));
        }
    });
}

function ArafAssist() {
    NoDeadendBorder();
    CluePerRegion({
        isShaded: c => c.qnum !== CQNUM.none,
        isOthers: c => c.qnum === CQNUM.none,
        isUnshaded: () => false,
        cantDivideShade: (s, o) => s % 2 === 1 || s === 0 && o > 0,
        isNotPassable: (c, nb, nc) => isSide(nb),
        BridgeType: "link",
        n: 2,
    });
    let m = new Map();
    forEachCell(cell => {
        if (m.has(cell)) { return; }
        let obj = { cnt: 0, qnum: [] };
        let dfs = function (c) {
            if (c.isnull || m.has(c)) { return; }
            m.set(c, obj);
            obj.cnt++;
            if (c.qnum !== CQNUM.none) { obj.qnum.push(c.qnum); }
            forEachSide(c, (nb, nc) => {
                if (!isLink(nb)) { return; }
                dfs(nc);
            });
        };
        dfs(cell);
    });
    forEachBorder(border => {
        let [o1, o2] = border.sidecell;
        o1 = m.get(o1);
        o2 = m.get(o2);
        if (o1 === o2) { return; }
        if (o1.qnum.length + o2.qnum.length > 2 ||
            o1.qnum.some(n1 => n1 !== CQNUM.quesmark && o2.qnum.some(n2 => n2 !== CQNUM.quesmark && Math.abs(n1 - n2) <= 1))) {
            add_side(border);
        }
        if (o1.qnum.length + o2.qnum.length === 2) {
            let [l, r] = [...o1.qnum, ...o2.qnum].sort((a, b) => a - b);
            if (o1.cnt + o2.cnt >= r) { add_side(border); }
        }
    });
}

function AngleLoopAssist() {
    let add_segment = function (cr1, cr2) {
        let [x1, y1, x2, y2] = [cr1.bx, cr1.by, cr2.bx, cr2.by];
        if (x1 > x2 || x1 === x2 && y1 > y2) { [x1, y1, x2, y2] = [x2, y2, x1, y1]; }
        if (x1 === x2 && y1 === y2) { return; }
        ui.puzzle.board.segment.addSegmentByAddr(x1, y1, x2, y2); // BUG: no "path" for some segment
        ui.puzzle.painter.drawSegments();
        stepcheck(true);
    };
    let getSegment = function (cr1, cr2) {
        let [x1, y1, x2, y2] = [cr1.bx, cr1.by, cr2.bx, cr2.by];
        if (x1 > x2 || x1 === x2 && y1 > y2) { [x1, y1, x2, y2] = [x2, y2, x1, y1]; }
        return ui.puzzle.board.getSegment(x1, y1, x2, y2);
    };
    let getLatticePoint = function (cr1, cr2) {
        return ui.puzzle.board.getLatticePoint(cr1.bx, cr1.by, cr2.bx, cr2.by);
    };
    let getAngleType = function (cr, cr1, cr2) {
        let [dx1, dy1] = [cr1.bx - cr.bx, cr1.by - cr.by];
        let [dx2, dy2] = [cr2.bx - cr.bx, cr2.by - cr.by];
        if (dx1 * dy2 - dx2 - dy1 === 0) { return 0; }
        let p = dx1 * dx2 + dy1 * dy2;
        if (p > 0) { return 1; }
        if (p === 0) { return 2; }
        if (p < 0) { return 3; }
    }
    let crlist = Array.from(board.cross).filter(cr => cr.qnum !== -1);
    crlist.forEach(cr => {
        if (cr.seglist.length === 2) { return; }
        let cand = [];
        for (let i = 0; i < crlist.length; i++) {
            let cr1 = crlist[i];
            if (cr1 === cr || getLatticePoint(cr, cr1).length > 0) { continue; }
            for (let j = i + 1; j < crlist.length; j++) {
                let cr2 = crlist[j];
                if (cr2 === cr || getLatticePoint(cr, cr2).length > 0) { continue; }
                if (cr.seglist.length === 1 && getSegment(cr, cr1) === null && getSegment(cr, cr2) === null) { continue; }
                if (getAngleType(cr, cr1, cr2) !== cr.qnum) { continue; }
                cand.push([cr1, cr2]);
            }
        }
        if (cand.length > 0) {
            cand.reduce((a, b) => a.filter(ncr => b.includes(ncr))).forEach(ncr => add_segment(cr, ncr));
        }
    });
}

function VoxasAssist() {
    let isSide = b => b.isnull || b.qans === 1 || b.ques > 0;
    forEachBorder(b => { if (b.ques > 0) { add_side(b); } });
    const PIECE = [
        [[[0, 0], [1, 0]], 0b100],
        [[[0, 0], [1, 0], [2, 0]], 0b101],
        [[[0, 0], [0, 1]], 0b110],
        [[[0, 0], [0, 1], [0, 2]], 0b111],
    ];
    forEachCell(cell => {
        let ncand = [4, 5, 6, 7];
        for (let d = 0; d < 4; d++) {
            let ques = offset(cell, .5, 0, d).ques;
            let nca = offset(cell, 1, 0, d).anum;
            if (ques === 2 && isSide(offset(cell, 1.5, 0, d))) { add_link(offset(cell, -.5, 0, d)); }
            if (ques === 2 && isLink(offset(cell, 1.5, 0, d))) { add_side(offset(cell, -.5, 0, d)); }
            if (ques === 4 && isSide(offset(cell, 1.5, 0, d))) { add_side(offset(cell, -.5, 0, d)); }
            if (ques === 4 && isLink(offset(cell, 1.5, 0, d))) { add_link(offset(cell, -.5, 0, d)); }
            if (ques === CQUES.none || nca === CANUM.none) { continue; }
            if (ques === 2) { ncand = ncand.filter(n => ((n ^ nca) & 0b11) === 0b11); }// black
            if (ques === 4) { ncand = ncand.filter(n => ((n ^ nca) & 0b11) === 0b00); }// white
            if (ques === 3) { ncand = ncand.filter(n => ((n ^ nca) & 0b11) === 0b01 || ((n ^ nca) & 0b11) === 0b10); }// gray
        }
        if (cell.ques === CQUES.wall) { return; }
        let linklist = [], sidelist = [], namelist = [];
        PIECE.forEach(([cl, t]) => {
            if (cell.anum >= 0 && cell.anum !== t || !ncand.includes(t)) { return; }
            [0, 1, 2].forEach(o => {
                if (o >= cl.length) { return; }
                let clist = cl.map(([x, y]) => offset(cell, x - cl[o][0], y - cl[o][1]));
                if (clist.some(c => c.isnull || c.ques === CQUES.wall)) { return; }
                if (clist.some(c => c.anum >= 0 && c.anum !== t)) { return; }
                if (clist.some(c => adjlist(c.adjborder, c.adjacent).some(
                    ([nb, nc]) => {
                        if (nc.isnull || nc.ques === CQUES.wall) { return false; }
                        if (isLink(nb) && !clist.includes(nc) || isSide(nb) && clist.includes(nc)) { return true; }
                        return false;
                    }))) { return; }
                let linkl = [], sidel = [];
                clist.forEach(c => forEachSide(c, (nb, nc) => {
                    if (clist.includes(nc) && !linkl.includes(nb)) { linkl.push(nb); }
                    if (!clist.includes(nc) && !sidel.includes(nb)) { sidel.push(nb); }
                }));
                linklist.push(linkl);
                sidelist.push(sidel);
                namelist.push(t);
            });
        });
        if (linklist.length > 0) { linklist = linklist.reduce((a, b) => a.filter(i => b.includes(i))); }
        if (sidelist.length > 0) { sidelist = sidelist.reduce((a, b) => a.filter(i => b.includes(i))); }
        linklist.forEach(b => add_link(b));
        sidelist.forEach(b => add_side(b));
        namelist = unique(namelist);
        if (namelist.length === 1) { add_number(cell, namelist[0]); }
    });
}

function AquariumAssist() {
    for (let i = 0; i < board.rows; i++) {
        let cl = [], qnum = board.getex(-1, i * 2 + 1).qnum;
        if (qnum === -1) { continue; }
        for (let j = 0; j < board.cols; j++) { cl.push(board.getc(j * 2 + 1, i * 2 + 1)); }
        NShadeInClist({
            isShaded: isBlack,
            isUnshaded: isDot,
            add_shaded: add_black,
            add_unshaded: add_dot,
            clist: cl,
            n: qnum,
        });
        qnum -= cl.filter(c => isBlack(c)).length;
        cl = cl.filter(c => !isBlack(c) && !isDot(c));
        cl = cl.reduce((l, c) => l.length > 0 && !isSide(offset(c, -.5, 0)) && offset(c, -1, 0) === l[0][0] ? [[c, ...l[0]], ...l.slice(1)] : [[c], ...l], []);
        let cnt = cl.map(l => l.length);
        let cand = Array(1 << cl.length).fill(0).map((_, i) => i);
        cand = cand.filter(cnd => cnt.filter((_, i) => (cnd & (1 << i))).reduce((a, b) => a + b, 0) === qnum);
        let t = cand.reduce((a, b) => (a & b), ~0);
        cl.forEach((l, i) => (t & (1 << i)) ? l.forEach(c => add_black(c)) : undefined);
        t = cand.reduce((a, b) => (a & ~b), ~0);
        cl.forEach((l, i) => (t & (1 << i)) ? l.forEach(c => add_dot(c)) : undefined);
    }
    for (let i = 0; i < board.cols; i++) {
        let cl = [], qnum = board.getex(i * 2 + 1, -1).qnum;
        if (qnum === -1) { continue; }
        for (let j = 0; j < board.rows; j++) { cl.push(board.getc(i * 2 + 1, j * 2 + 1)); }
        NShadeInClist({
            isShaded: isBlack,
            isUnshaded: isDot,
            add_shaded: add_black,
            add_unshaded: add_dot,
            clist: cl,
            n: qnum,
        });
        qnum -= cl.filter(c => isBlack(c)).length;
        cl = cl.filter(c => !isBlack(c) && !isDot(c));
        let cnt = cl.length;
        cl = cl.reduce((l, c) => l.length > 0 && !isSide(offset(c, 0, -.5)) && offset(c, 0, -1) === l[0][0] ? [[c, ...l[0]], ...l.slice(1)] : [[c], ...l], []);
        cl.forEach(l => l.slice(0, Math.max(0, qnum - (cnt - l.length))).forEach(c => add_black(c)));
        cl.forEach(l => l.length > qnum ? l.slice(qnum - l.length).forEach(c => add_dot(c)) : undefined);
    }
    if (ui.puzzle.config.list.aquarium_regions.val) { // Water in one region must have the same surface level
        forEachRoom(room => {
            let cl = Array.from(room.clist);
            let ub = Math.max(...cl.map(c => isDot(c) ? c.by : -1));
            let lb = Math.min(...cl.map(c => isBlack(c) ? c.by : Infinity));
            cl.forEach(c => {
                if (c.by <= ub) { add_dot(c); }
                if (c.by >= lb) { add_black(c); }
            });
        });
    }
    if (!ui.puzzle.config.list.aquarium_regions.val) {
        forEachCell(cell => {
            if (isBlack(cell)) {
                let s = new Set();
                let dfs = function (c) {
                    if (c.isnull || !isInside(c) || c.by < cell.by || s.has(c)) { return; }
                    s.add(c);
                    add_black(c);
                    forEachSide(c, (nb, nc) => {
                        if (!isBound(nb)) { dfs(nc); }
                    });
                };
                dfs(cell);
            }
            if (!isBlack(cell) && !isDot(cell)) {
                let s = new Set();
                let dfs = function (c) {
                    if (c.isnull || !isInside(c) || c.by < cell.by || s.has(c) || isDot(cell)) { return; }
                    s.add(c);
                    if (isDot(c)) { add_dot(cell); return; }
                    forEachSide(c, (nb, nc) => {
                        if (!isBound(nb)) { dfs(nc); }
                    });
                };
                dfs(cell);
            }
        });
    }
}

function BorderBlockAssist() {
    // TODO: bug when there's a side between the same region
    let isDot = cr => cr.qnum === 1;
    forEachCross(cross => {
        if (!isDot(cross) && cross.lcnt > 0) {
            NShadeInClist({
                isShaded: isSide,
                isUnshaded: isLink,
                add_shaded: add_side,
                add_unshaded: add_link,
                clist: adjlist(cross.adjborder).filter(b => !b.isnull),
                n: isEdge(cross) ? 0 : 2,
            });
        }
        if (!isDot(cross) && adjlist(cross.adjborder).filter(b => isLink(b)).length === 3) {
            forEachSide(cross, (nb, nc) => add_link(nb));
        }
        if (isDot(cross)) {
            if (isEdge(cross)) { forEachSide(cross, (nb, nc) => add_side(nb)); }
            if (adjlist(cross.adjborder).some(b => isLink(b))) { forEachSide(cross, (nb, nc) => add_side(nb)); }
        }
    });
    let DSU = new Map(); // Disjoint Set Union
    let DSUfind = function (n) {
        if (DSU.get(n) !== n) { DSU.set(n, DSUfind(DSU.get(n))); }
        return DSU.get(n);
    };
    forEachCell(cell => {
        DSU.set(cell, cell);
        let cc = cell;
        if (isLink(offset(cell, -.5, 0))) {
            let nc = DSUfind(offset(cell, -1, 0));
            if (cc.qnum !== CQNUM.none) { DSU.set(nc, cc); }
            else { DSU.set(cc, nc); }
        }
        cc = DSUfind(cell);
        if (isLink(offset(cell, 0, -.5))) {
            let nc = DSUfind(offset(cell, 0, -1));
            if (cc.qnum !== CQNUM.none) { DSU.set(nc, cc); }
            else { DSU.set(cc, nc); }
        }
    });
    forEachBorder(border => {
        let [c1, c2] = border.sidecell;
        if (c1.isnull || c2.isnull) { return; }
        c1 = DSUfind(c1);
        c2 = DSUfind(c2);
        if (isNum(c1) && isNum(c2) && c1.qnum !== c2.qnum) { add_side(border); }
    });
    forEachCell(cell => {
        for (let d = 0; d < 4; d++) {
            if (!offset(cell, 1, -1, d).isnull && !offset(cell, 1, +1, d).isnull &&
                [[.5, 0], [0, -.5], [0, .5]].every(([x, y]) => (b => !b.isnull && !isSide(b))(offset(cell, x, y, d))) &&
                [[.5, -.5], [.5, +.5]].every(([x, y]) => (cr => !isDot(cr) && cr.lcnt === 1)(offset(cell, x, y, d)))) {
                let f = (c1, c2) => (new Set([DSUfind(c1).qnum, DSUfind(c2).qnum, CQNUM.none]).size) === 3;
                if (f(offset(cell, 0, -1, d), offset(cell, 0, +1, d)) ||
                    isSide(offset(cell, 1, -.5, d)) && f(offset(cell, 1, -1, d), offset(cell, 0, +1, d)) ||
                    isSide(offset(cell, 1, +.5, d)) && f(offset(cell, 0, -1, d), offset(cell, 1, +1, d)) ||
                    isSide(offset(cell, 1, -.5, d)) && isSide(offset(cell, 1, +.5, d)) && f(offset(cell, 1, -1, d), offset(cell, 1, +1, d))
                ) {
                    add_link(offset(cell, .5, 0, d));
                }
            }
            if (!offset(cell, 1, -1, d).isnull && !offset(cell, 1, +1, d).isnull &&
                [[.5, -.5], [.5, +.5]].every(([x, y]) => !isDot(offset(cell, x, y, d))) &&
                new Set([DSUfind(offset(cell, 1, -1, d)).qnum, DSUfind(offset(cell, 1, +1, d)).qnum, DSUfind(cell).qnum, CQNUM.none]).size === 4) {
                add_link(offset(cell, .5, 0, d));
            }
        }
    });
    CellConnected({
        isShaded: c => isNum(c),
        isOthers: c => !isNum(c),
        isUnshaded: c => false,
        add_shaded: () => { },
        add_unshaded: () => { },
        cantDivideShade: (s, o) => s === 0 && o > 0,
        isNotPassable: (c, nb, nc) => isSide(nb),
        OnlyOneConnected: false,
        BridgeType: "link",
    });
    let maxQnum = Math.max(...Array.from(board.cell).map(c => c.qnum));
    for (let i = 1; i <= maxQnum; i++) {
        CellConnected({
            isShaded: c => c.qnum === i,
            isUnshaded: c => isNum(DSUfind(c)) && DSUfind(c).qnum !== i,
            add_shaded: () => { },
            add_unshaded: () => { },
            isNotPassable: (c, nb, nc) => isSide(nb),
            BridgeType: "link",
        });
    }
}

function ChainedBlockAssist() {
    SizeRegion_Cell({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        OneNumPerRegion: true,
        NoUnshadedNum: true,
    });
    CluePerRegion({
        isShaded: c => c.qnum !== CQNUM.none,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        isOthers: isBlack,
        n: 1,
    });
    forEachCell(cell => {
        if (!isBlack(cell)) { return; }
        let cl = [];
        let dfs = function (c) {
            if (c.isnull || cl.includes(c) || !isBlack(c)) { return; }
            cl.push(c);
            forEachSide(c, (nb, nc) => dfs(nc));
        };
        dfs(cell);
        let ol = unique(cl.flatMap(c => adj8list(c)).filter(c => !c.isnull && !isGreen(c) && !cl.includes(c)));
        if (ol.length === 1) { add_black(ol[0]); }
    });
    let ord = new Map();
    let nshp = new Map();
    let nqnum = new Map();
    let n = 0;
    forEachCell(cell => {
        if (!isBlack(cell) || ord.has(cell)) { return; }
        n++;
        nshp.set(n, []);
        nqnum.set(n, []);
        let dfs2 = function (c) {
            if (c.isnull || ord.has(c) || !isBlack(c)) { return; }
            let cl = [], finished = true;
            let dfs = function (c) {
                if (!c.isnull && !isBlack(c) && !isGreen(c)) { finished = false; }
                if (c.isnull || cl.includes(c) || !isBlack(c)) { return; }
                cl.push(c);
                ord.set(c, n);
                forEachSide(c, (nb, nc) => dfs(nc));
            };
            dfs(c);
            if (finished) {
                nshp.get(n).push(getShape(cl));
                nqnum.get(n).push(cl.length);
            } else {
                cl.forEach(c => isNum(c) ? nqnum.get(n).push(c.qnum) : undefined);
            }
            let dc = cl.flatMap(c => adjdiaglist(c));
            dc = unique(dc);
            dc.forEach(nc => dfs2(nc));
        }
        dfs2(cell);
    });
    forEachCell(cell => {
        if (!isBlack(cell) && !isGreen(cell)) {
            let t = unique(adj8list(cell).filter(c => isBlack(c)).map(c => ord.get(c)));
            let tt = t.flatMap(n => nshp.get(n));
            if (unique(tt).length < tt.length) { add_green(cell); }
            let A000105 = [1, 1, 1, 2, 5, 12, 35, 108,]; // https://oeis.org/A000105
            tt = t.flatMap(n => nqnum.get(n));
            if (A000105.some((maxn, i) => tt.filter(n => n === i).length > maxn)) { add_green(cell); }
        }
        if (isBlack(cell)) {
            let cl = [];
            let dfs = function (c) {
                if (c.isnull || cl.includes(c) || !isBlack(c)) { return; }
                cl.push(c);
                forEachSide(c, (nb, nc) => dfs(nc));
            };
            dfs(cell);
            let ol = unique(cl.flatMap(c => adjlist(c.adjacent)).filter(c => !c.isnull && !isGreen(c) && !isBlack(c)));
            if (cl.some(c => c.qnum === cl.length + 1)) {
                let t = ol.filter(c => nshp.get(ord.get(cell)).includes(getShape([...cl, c])));
                t.forEach(c => add_green(c));
            }
            if (nshp.get(ord.get(cell)).includes(getShape(cl)) && ol.length === 1) {
                add_black(ol[0]);
                ord.set(ol[0], ord.get(cell));
            }
        }
    });
}

function AhoniNarikireAssist() {
    SizeRegion_Border({
        OneNumPerRegion: true,
    });
    forEachCell(cell => {
        if (cell.qnum > 0 && cell.qnum % 3 !== 0) {
            let l = [];
            let dfs = function (c) {
                if (l.includes(c)) { return; }
                l.push(c);
                forEachSide(c, (nb, nc) => {
                    if (isLink(nb)) { dfs(nc); }
                });
            }
            dfs(cell);
            let lbx = Math.min(...l.map(c => c.bx));
            let rbx = Math.max(...l.map(c => c.bx));
            let lby = Math.min(...l.map(c => c.by));
            let rby = Math.max(...l.map(c => c.by));
            for (let i = lbx; i <= rbx; i += 2) {
                for (let j = lby; j <= lby; j += 2) {
                    if (i < rbx) { add_link(board.getb(i + 1, j)); }
                    if (j < rby) { add_link(board.getb(i, j + 1)); }
                }
            }
            let f = (l => { if (l.some(b => isSide(b))) { l.forEach(b => add_side(b)); } });
            f(Array((rbx - lbx) / 2 + 1).fill(0).map((_, i) => board.getb(lbx + i * 2, lby - 1)));
            f(Array((rbx - lbx) / 2 + 1).fill(0).map((_, i) => board.getb(lbx + i * 2, rby + 1)));
            f(Array((rby - lby) / 2 + 1).fill(0).map((_, i) => board.getb(lbx - 1, lby + i * 2)));
            f(Array((rby - lby) / 2 + 1).fill(0).map((_, i) => board.getb(rbx + 1, lby + i * 2)));
        }
    });
}

function MaxiLoopAssist() {
    SingleLoopInCell({
        isPass: () => true,
    });
    let ln = new Map(); // line segment length
    let sc = new Map();
    forEachCell(cell => {
        if (ln.has(cell) || cell.room.top.qnum < 1) { return; }
        let l = [];
        let dfs = function (c) {
            if (l.includes(c)) { return; }
            l.push(c);
            forEachSide(c, (nb, nc) => {
                if (nb.isnull || isBound(nb) || !isLine(nb)) { return; }
                dfs(nc);
            });
        };
        dfs(cell);
        l.forEach(c => {
            ln.set(c, l.length);
            sc.set(c, cell);
        });
    });
    forEachBorder(border => {
        if (isBound(border) || isCross(border) || isLine(border)) { return; }
        let [c1, c2] = border.sidecell;
        if (!ln.has(c1) || !ln.has(c2) || c1.room.top.qnum < 1) { return; }
        if (!sc.has(c1) || !sc.has(c2) || sc.get(c1) === sc.get(c2)) { return; }
        if (ln.get(c1) + ln.get(c2) > c1.room.top.qnum) { add_cross(border); }
    });
}

function ChoconaAssist() {
    RectRegion_Cell({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        isSizeAble: (w, h, sc, c) => {
            let s = new Set();
            for (let i = -1; i <= w + 1; i++) {
                for (let j = -1; j <= h + 1; j++) {
                    let cc = offset(c, i, j);
                    if (cc.isnull || s.has(cc.room)) { continue; }
                    s.add(cc.room);
                    let l = Array.from(cc.room.clist);
                    let qnum = cc.room.top.qnum;
                    if (qnum >= 0 && l.filter(lc => isBlack(lc) ||
                        lc.bx >= c.bx && lc.bx <= c.bx + (w - 1) * 2 &&
                        lc.by >= c.by && lc.by <= c.by + (h - 1) * 2
                    ).length > qnum) { return false; }
                    if (qnum >= 0 && l.filter(lc => isGreen(lc) ||
                        (lc.bx === c.bx - 2 || lc.bx === c.bx + w * 2) && (lc.by >= c.by && lc.by <= c.by + (h - 1) * 2) ||
                        (lc.by === c.by - 2 || lc.by === c.by + h * 2) && (lc.bx >= c.bx && lc.bx <= c.bx + (w - 1) * 2)
                    ).length > l.length - qnum) { return false; }
                }
            }
            return true;
        }
    });
    forEachRoom(room => {
        if (room.top.qnum === CQNUM.none || room.top.qnum === CQNUM.quesmark) { return; }
        NShadeInClist({
            n: room.top.qnum,
            clist: Array.from(room.clist),
        });
    });
}

function MejilinkAssist() {
    forEachBorder(b => b.ques === 1 ? add_cross(b) : undefined);
    SingleLoopInBorder();
    for (let i = 0; i < board.tilegraph.components.length; i++) {
        let tile = board.tilegraph.components[i];
        if (tile.count < 0) { continue; }
        let clist = Array.from(tile.clist);
        let blist = [];
        clist.forEach(c => blist.push(...adjlist(c.adjborder).filter(b => b.ques === 0)));
        NShadeInClist({
            isShaded: isCross,
            isUnshaded: isLine,
            add_shaded: add_cross,
            add_unshaded: add_line,
            n: clist.length,
            clist: blist,
        });
    }
}

function JuosanAssist() {
    let add_bar = function (c, n) { // 12:| 13:-
        if (c === undefined || c.isnull || c.qans !== CQANS.none || ![12, 13].includes(n)) { return; }
        c.setQans(n);
        c.draw();
        stepcheck(true);
    };
    forEachCell(cell => {
        if ([[-2, -1], [-1, 1], [1, 2]].some(l => l.every(x => (c => !c.isnull && c.qans === 12)(offset(cell, x, 0))))) {
            add_bar(cell, 13);
        }
        if ([[-2, -1], [-1, 1], [1, 2]].some(l => l.every(y => (c => !c.isnull && c.qans === 13)(offset(cell, 0, y))))) {
            add_bar(cell, 12);
        }
    });
    forEachRoom(room => {
        let qnum = room.top.qnum;
        let clist = Array.from(room.clist);
        if (qnum === CQNUM.none || qnum === CQNUM.quesmark) { return; }
        if (qnum > clist.filter(c => c.qans !== 12).length || qnum * 2 === clist.length) {
            NShadeInClist({
                isShaded: c => c.qans === 12,
                isUnshaded: c => c.qans === 13,
                add_shaded: c => add_bar(c, 12),
                add_unshaded: c => add_bar(c, 13),
                n: qnum,
                clist: clist,
            });
        }
        if (qnum > clist.filter(c => c.qans !== 13).length) {
            NShadeInClist({
                isShaded: c => c.qans === 13,
                isUnshaded: c => c.qans === 12,
                add_shaded: c => add_bar(c, 13),
                add_unshaded: c => add_bar(c, 12),
                n: qnum,
                clist: clist,
            });
        }
    });
}

function IslandsAssist() {
    CellConnected_InRegion({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        SizeClue: true,
    });
    BlackNotAdjacent_OverBorder();
    forEachRoom(room => {
        if (room.top.qnum !== CQNUM.none) { return; }
        let clist = Array.from(room.clist);
        let s = new Set(), t, maxn = 0, minn = Math.max(1, clist.filter(c => isBlack(c)).length);
        let dfs = function (c) {
            if (c.isnull || c.room !== room || isGreen(c) || s.has(c)) { return; }
            s.add(c);
            t++;
            forEachSide(c, (nb, nc) => !isBound(nb) ? dfs(nc) : undefined);
        };
        clist.forEach(c => {
            t = 0;
            dfs(c);
            maxn = Math.max(maxn, t);
        });
        let cand = Array(maxn - minn + 1).fill(0).map((_, i) => minn + i);
        clist.forEach(c => forEachSide(c, (nb, nc) => {
            if (nc.isnull || nc.room === room) { return; }
            let t = nc.room.top.qnum;
            let nclist = Array.from(nc.room.clist);
            if (nclist.every(c => isBlack(c) || isGreen(c))) {
                t = nclist.filter(c => isBlack(c)).length;
            }
            cand = cand.filter(n => n !== t);
        }));
        if (cand.length === 1) {
            NShadeConnectedInRoom({ room: room, qnum: cand[0] });
        }
    });
}

function BoxAssist() {
    let f = function (l, qnum) {
        let cand = Array(1 << (l.length)).fill(0).map((_, i) => i);
        let t = parseInt(l.map(c => isBlack(c) || isDot(c) ? '1' : '0').join(''), 2);
        cand = cand.filter(n => (n & t) === 0);
        t = parseInt(l.map(c => isBlack(c) ? '1' : '0').join(''), 2);
        cand = cand.map(n => (n | t));
        cand = cand.filter(n => n.toString(2).padStart(l.length, '0').split('').map((c, i) => c === '1' ? i + 1 : 0).reduce((a, b) => a + b) === qnum);
        let b = cand.reduce((a, b) => (a & b), (1 << l.length) - 1);
        let d = cand.reduce((a, b) => (a & ~b), (1 << l.length) - 1);
        b.toString(2).padStart(l.length, '0').split('').forEach((c, i) => c === '1' ? add_black(l[i]) : undefined);
        d.toString(2).padStart(l.length, '0').split('').forEach((c, i) => c === '1' ? add_dot(l[i]) : undefined);
    };
    for (let i = 0; i < board.cols; i++) {
        let l = [];
        for (let j = 0; j < board.rows; j++) {
            l.push(board.getc(i * 2 + 1, j * 2 + 1));
        }
        f(l, board.getobj(i * 2 + 1, -1).qnum);
    }
    for (let j = 0; j < board.rows; j++) {
        let l = [];
        for (let i = 0; i < board.cols; i++) {
            l.push(board.getc(i * 2 + 1, j * 2 + 1));
        }
        f(l, board.getobj(-1, j * 2 + 1).qnum);
    }
}

function RassiSilaiAssist() {
    CellConnected_InRegion({
        isShaded: () => true,
        isUnshaded: () => false,
        add_shaded: () => { },
        add_unshaded: () => { },
        ByLine: true,
    });
    let add_Ocell = function (c) {
        if (c === undefined || c.isnull || c.qsub !== CQSUB.none) { return; }
        c.setQsub(CQSUB.circle);
        c.draw();
        stepcheck(true);
    };
    let add_Xcell = function (c) {
        if (c === undefined || c.isnull || c.qsub !== CQSUB.none) { return; }
        c.setQsub(CQSUB.cross);
        c.draw();
        stepcheck(true);
    };
    forEachBorder(border => {
        if (isBound(border)) { add_cross(border); }
        if ((border.sidecell[0].path ?? -1) === border.sidecell[1].path) { add_cross(border); }
        if (!isCross(border) && !isBound(border) && border.sidecell.every(c => adjlist(c.adjborder).filter(b => isntLine(b)).length >= 2)) { add_line(border); }
    });
    forEachCell(cell => {
        if (cell.ques === 7) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
            return;
        }
        if (adjlist(cell.adjborder).filter(b => isntLine(b)).length === 3) {
            add_Ocell(cell);
        }
        if (cell.lcnt === 2) {
            add_Xcell(cell);
        }
        if (adjlist(cell.adjborder, cell.adjacent).filter(([nb, nc]) => !isBound(nb) && !isntLine(nb) && nc.room === cell.room && adjlist(nc.adjborder).filter(b => isBound(b) || isntLine(b)).length >= 2).length >= 2) {
            add_Xcell(cell);
        }
        if (isOcell(cell)) {
            adj8list(cell).forEach(c => add_Xcell(c));
            NShadeInClist({
                isShaded: isLine,
                isUnshaded: isntLine,
                add_shaded: add_line,
                add_unshaded: add_cross,
                n: 1,
                clist: adjlist(cell.adjborder),
            });
        }
        if (isXcell(cell)) {
            NShadeInClist({
                isShaded: isLine,
                isUnshaded: isntLine,
                add_shaded: add_line,
                add_unshaded: add_cross,
                n: 2,
                clist: adjlist(cell.adjborder),
            });
        }
    });
    forEachRoom(room => {
        NShadeInClist({
            isShaded: isOcell,
            isUnshaded: isXcell,
            add_shaded: add_Ocell,
            add_unshaded: add_Xcell,
            n: 2,
            clist: Array.from(room.clist),
        });
    });
}

function BosanowaAssist() {
    let add_bn = function (b, n) {
        if (b === undefined || b.isnull || b.qsub !== -1) { return; }
        b.setQsub(n);
        b.draw();
        stepcheck(true);
    };
    forEachCell(cell => {
        if (cell.ques !== 0) { return; }
        if (cell.qnum !== CQNUM.none) { add_number(cell, cell.qnum); }
        forEachSide(cell, (nb, nc) => {
            if (!nc.isnull && cell.anum !== CANUM.none && nc.anum !== CANUM.none) {
                add_bn(nb, Math.abs(cell.anum - nc.anum));
            }
        });
        let n = 0;
        forEachSide(cell, (nb, nc) => {
            if (!nc.isnull && nc.ques === 0 && nb.qsub !== -1) {
                n += nb.qsub;
            }
        });
        if (adjlist(cell.adjborder, cell.adjacent).every(([nb, nc]) => nc.isnull || nc.ques !== 0 || nb.qsub !== -1)) {
            add_number(cell, n);
        }
        if (n === cell.anum) { forEachSide(cell, (nb, nc) => nc.ques === 0 ? add_bn(nb, 0) : undefined); }
        if (cell.anum !== CANUM.none && adjlist(cell.adjborder, cell.adjacent).filter(([nb, nc]) => !nc.isnull && nc.ques === 0 && nb.qsub === -1).length === 1) {
            let [nb, nc] = adjlist(cell.adjborder, cell.adjacent).find(([nb, nc]) => !nc.isnull && nc.ques === 0 && nb.qsub === -1);
            add_bn(nb, cell.anum - n);
        }
        for (let d = 0; d < 4; d++) {
            let nb = offset(cell, .5, 0, d);
            let nc = offset(cell, 1, 0, d);
            if (cell.anum !== CANUM.none && nb.qsub !== -1 && cell.anum < nb.qsub * 2) {
                add_number(nc, cell.anum + nb.qsub);
            }
            if (cell.anum !== CANUM.none && nb.qsub === 0) {
                add_number(nc, cell.anum);
            }
        }
    });
}

function RippleEffectAssist() {
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none) { add_number(cell, cell.qnum); }
        if (cell.anum !== CANUM.none) { return; }
        let cand = new Array(cell.room.clist.length).fill(0).map((_, i) => i + 1);
        let t = Array.from(cell.room.clist).map(c => c.anum);
        cand = cand.filter(n => !t.includes(n));
        for (let d = 0; d < 4; d++) {
            for (let i = 1; !offset(cell, i, 0, d).isnull; i++) {
                if (offset(cell, i, 0, d).anum < i) { continue; }
                cand = cand.filter(n => n !== offset(cell, i, 0, d).anum);
            }
        }
        let fn = function (clist) {
            let a = new Array(cell.room.clist.length).fill(0).map((_, i) => i + 1);
            clist.forEach((c, i) => {
                if (cell === c || c.isnull) { return; }
                let b = c.anum === -1 && c.snum.every(n => n === -1);
                a = b ? [] : a.filter(n => n !== c.anum && !c.snum.includes(n));
                if (c.anum !== -1) { cand = cand.filter(n => n !== c.anum); }
                if (c.anum === -1 && c.snum.filter(n => n !== -1).length > 0) {
                    for (let j = i + 1; j < clist.length; j++) {
                        let c2 = clist[j];
                        if (cell === c2 || c2.isnull || c2.anum !== -1 || c2.snum.every(n => n === -1)) { continue; }
                        let l2 = new Set([...c.snum, ...c2.snum].filter(n => n !== -1));
                        if (l2.size === 2) {
                            cand = cand.filter(n => !l2.has(n));
                        }
                        for (let k = j + 1; k < clist.length; k++) {
                            let c3 = clist[k];
                            if (cell === c3 || c3.isnull || c3.anum !== -1 || c3.snum.every(n => n === -1)) { continue; }
                            let l3 = new Set([...c.snum, ...c2.snum, ...c3.snum].filter(n => n !== -1));
                            if (l3.size === 3) {
                                cand = cand.filter(n => !l3.has(n));
                            }
                            for (let l = k + 1; l < clist.length; l++) {
                                let c4 = clist[l];
                                if (cell === c4 || c4.isnull || c4.anum !== -1 || c4.snum.every(n => n === -1)) { continue; }
                                let l4 = new Set([...c.snum, ...c2.snum, ...c3.snum, ...c4.snum].filter(n => n !== -1));
                                if (l4.size === 4) {
                                    cand = cand.filter(n => !l4.has(n));
                                }
                            }
                        }
                    }
                }
            });
            if (a.length === 1) { add_number(cell, a[0]); }
        }
        fn(Array.from(cell.room.clist));
        add_candidate(cell, cand);
    });
}

function HerugolfAssist() {
    forEachCell(cell => {
        if (cell.qnum === CQNUM.none) { return; }
        let fn = function (c, d, x) {
            if (c.qnum !== CQNUM.none && c.lcnt === 1 && !isLine(offset(c, .5, 0, d))) { return false; }
            if (c.qnum === CQNUM.none && c.lcnt === 2 && !isLine(offset(c, .5, 0, d))) { return false; }
            for (let i = 1; i <= x; i++) {
                let nc = offset(c, i, 0, d);
                if (nc.qnum !== CQNUM.none) { return false; }
                if (i < x && nc.ques === 31) { return false; }
                if (i < x && (isLine(offset(nc, 0, -.5, d)) || isLine(offset(nc, 0, +.5, d)))) { return false; }
                if (i === x) {
                    if (nc.ques === 6) { return false; }
                    if (x === 1 && nc.ques !== 31) { return false; }
                    if (nc.lcnt === 2 && !isLine(offset(c, i - .5, 0, d))) { return false; }
                    if (nc.ques === 31 && nc.lcnt === 1 && !isLine(offset(c, i - .5, 0, d))) { return false; }
                }
            }
            return true;
        }
        let cand = [];
        let dfs = function (c, n, p, clist) {
            if (c.ques === 31) {
                cand.push(p);
                return;
            }
            if (n === 0) { return; }
            for (let d = 0; d < 4; d++) {
                if (p.length !== 0 && (d + 2) % 4 === p[p.length - 1]) { continue; }
                let l = Array(n).fill(0).map((_, i) => offset(c, i + 1, 0, d));
                if (l.some(c => clist.includes(c))) { continue; }
                if (fn(c, d, n)) {
                    dfs(offset(c, n, 0, d), n - 1, [...p, d], [...clist, ...l]);
                }
            }
        }
        dfs(cell, cell.qnum, [], [cell]);
        let c = cell, n = cell.qnum;
        for (let i = 0; cand.length > 0 && cand.every(s => s.length > i && s[i] === cand[0][i]); i++) {
            for (let k = 0; k < n; k++) {
                add_line(offset(c, .5 + k, 0, cand[0][i]));
            }
            c = offset(c, n, 0, cand[0][i]);
            n--;
        }
    });
}

function MartiniAssist() {
    BlackNotAdjacent_OverBorder();
    BlackConnected_InRegion();
    CellConnected({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        DiagDir: true,
    });
    forEachCell(cell => {
        if (cell.qnum === 0) {
            add_black(cell);
            return;
        }
        if (cell.qnum > 0 || cell.qnum === -2) {
            add_green(cell);
        }
        if (!isBlack(cell) && !isGreen(cell)) {
            let cset = new Set();
            let dfs = function (c) {
                if (!isGreen(c) || cset.has(c)) { return; }
                cset.add(c);
                forEachSide(c, (nb, nc) => dfs(nc));
            };
            forEachSide(cell, (nb, nc) => dfs(nc));
            let l = Array.from(cset).flatMap(c => c.qnum > 0 ? c.qnum : []);
            if (l.length > 0 && l.some(n => n !== l[[0]])) {
                add_black(cell);
            }
            if (l.length > 0 && Array.from(cset).filter(c => c.qnum !== CQNUM.none && c.qnum !== 0).length > l[0]) {
                add_black(cell);
            }
        }
    });
}

function WallLogicAssist() {
    let emptycnt = board.cols * board.rows;
    forEachCell(cell => {
        if (cell.ques === 1) { emptycnt--; }
        if (cell.qnum !== CQNUM.none) { emptycnt -= (cell.qnum + 1); }
    });
    forEachCell(cell => {
        if (cell.qnum > 0) {
            let ol = [0, 1, 2, 3].map(d => {
                let n = 0, anum = [4, 1, 3, 2][d];
                while ((c => !c.isnull && c.ques !== 1 && !isNum(c) && (c.anum === CANUM.none || c.anum === anum))(offset(cell, n + 1, 0, d))) { n++; }
                return n;
            });
            for (let d = 0; d < 4; d++) {
                for (let i = 1; i <= cell.qnum - ol.reduce((a, b) => a + b) + ol[d]; i++) {
                    add_number(offset(cell, i, 0, d), [4, 1, 3, 2][d]);
                }
            }
        }
        if (emptycnt === 0 && cell.qnum === CQNUM.none && cell.ques !== 1 && cell.anum === CANUM.none) {
            let cl = [0, 1, 2, 3].map(d => {
                let n = 1;
                while ((c => !c.isnull && c.ques !== 1 && c.qnum === CQNUM.none && (c.anum === CANUM.none || c.anum === [3, 2, 4, 1][d]))(offset(cell, n, 0, d))) {
                    n++;
                }
                let nc = offset(cell, n, 0, d);
                if (nc.qnum <= 0) { return -1; }
                let ol = [0, 1, 2, 3].map(d => {
                    let n = 0, anum = [4, 1, 3, 2][d];
                    while ((c => !c.isnull && c.anum === anum)(offset(nc, n + 1, 0, d))) { n++; }
                    return n;
                });
                if (nc.qnum - ol.reduce((a, b) => a + b) + ol[(d + 2) % 4] < n) { return -1; }
                return n;
            });
            if (cl.filter(n => n !== -1).length === 1) {
                cl.forEach((n, d) => {
                    for (let i = 0; i < n; i++) {
                        add_number(offset(cell, i, 0, d), [3, 2, 4, 1][d]);
                    }
                });
            }
        }
        if (cell.anum !== CANUM.none) {
            let d = [-1, 3, 1, 0, 2][cell.anum];
            let nc = offset(cell, 1, 0, d);
            if (!nc.isnull && !isNum(nc)) {
                add_number(nc, cell.anum);
            }
        }
    });
}

function BosnianRoadAssist() {
    let isntBlack = c => c.isnull || isDot(c) || c.qnum !== CQNUM.none;
    forEachCell(cell => {
        let clist = adj8list(cell);
        if (cell.qnum >= 0) {
            NShadeInClist({
                isUnshaded: isntBlack,
                add_unshaded: add_dot,
                n: cell.qnum,
                clist: clist,
            });
        }
        if (isBlack(cell)) {
            NShadeInClist({
                isUnshaded: isntBlack,
                add_unshaded: add_dot,
                n: 2,
                clist: adjlist(cell.adjacent),
            });
        }
        if (adjlist(cell.adjacent).filter(c => isntBlack(c)).length >= 3) {
            add_dot(cell);
        }
        if (adjlist(cell.adjacent).filter(c => isBlack(c)).length >= 3) {
            add_dot(cell);
        }
        if (board.sblkmgr.components.length > 1 && clist.some((c1, i) => !c1.isnull && c1.sblk !== null && clist.some((c2, j) => Math.abs(i - j) > 1 && Math.abs(i - j) < 7 && c1.sblk === c2.sblk))) {
            add_dot(cell);
        }
        for (let d = 0; d < 4; d++) {
            if (isBlack(offset(cell, 1, 0, d)) && isBlack(offset(cell, 0, 1, d)) && isntBlack(offset(cell, 1, 1, d))) {
                add_black(cell);
            }
            if (isBlack(offset(cell, 1, 0, d)) && isBlack(offset(cell, 0, 1, d)) && isBlack(offset(cell, -1, -1, d))) {
                add_dot(cell);
            }
            if (isBlack(offset(cell, 1, 1, d)) && isBlack(offset(cell, 1, -1, d)) && isBlack(offset(cell, -1, 0, d))) {
                add_dot(cell);
            }
            if (isBlack(offset(cell, 1, 1, d)) && isBlack(offset(cell, 1, -1, d)) && isBlack(offset(cell, -1, 1, d))) {
                add_dot(cell);
            }
            if (isBlack(offset(cell, 1, 1, d)) && (isntBlack(offset(cell, 1, 0, d)) && isntBlack(offset(cell, 0, 1, d)) ||
                isBlack(offset(cell, 1, 0, d)) && isBlack(offset(cell, 0, 1, d)))) {
                add_dot(cell);
            }
            if ([[-1, 0], [0, -1], [1, -1], [2, 0]].every(([x, y]) => isntBlack(offset(cell, x, y, d)))) {
                add_dot(cell);
            }
        }
    });
}

function SnakeAssist() {
    let isntBlack = c => c.isnull || isDot(c) || c.bx < 0 || c.by < 0;
    SingleSnakeInCell({
        isShaded: isBlack,
        isUnshaded: isntBlack,
        add_shaded: add_black,
        add_unshaded: add_dot,
        isHead: c => c.qnum === 2,
        isntHead: c => c.qnum === 1,
    });
    for (let i = 1; i < board.cols * 2; i += 2) {
        let l = [];
        for (let j = 1; j < board.rows * 2; j += 2) {
            l.push(board.getc(i, j));
        }
        NShadeInClist({
            isUnshaded: isDot,
            add_unshaded: add_dot,
            n: board.getex(i, -1).qnum,
            clist: l,
        });
    }
    for (let j = 1; j < board.rows * 2; j += 2) {
        let l = [];
        for (let i = 1; i < board.cols * 2; i += 2) {
            l.push(board.getc(i, j));
        }
        NShadeInClist({
            isUnshaded: isDot,
            add_unshaded: add_dot,
            n: board.getex(-1, j).qnum,
            clist: l,
        });
    }
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none) { add_black(cell); }
    });
}

function LookAirAssist() {
    let SquSize = new Map();
    let cset = new Set();
    forEachCell(cell => {
        if (cset.has(cell) || !isBlack(cell)) { return; }
        let clist = getCellChunk(cell, (c, nb, nc) => isBlack(nc));
        clist.forEach(c => cset.add(c));
        if (clist.every(c => adjlist(c.adjacent).every(nc => nc.isnull || isGreen(nc) || isBlack(nc)))) { clist.forEach(c => SquSize.set(c, Math.sqrt(clist.length))); }
    });
    RectRegion_Cell({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        isSizeAble: (w, h, sc, c) => {
            if (w !== h) { return false; }
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    for (let d = 0; d < 4; d++) {
                        let cc = offset(offset(c, i, j), 1, 0, d);
                        while (isGreen(cc)) { cc = offset(cc, 1, 0, d); }
                        if (SquSize.get(cc) === w) { return false; }
                    }
                }
            }
            return true;
        }
    });
    forEachCell(cell => {
        NShadeInClist({
            clist: [...adjlist(cell.adjacent), cell],
            n: cell.qnum,
        });
        if (cell.qnum === 4) { add_black(cell); }
        if (cell.qnum === 2) { add_green(cell); }
        for (let d = 0; d < 4; d++) {
            if (cell.qnum === 3 && isntBlack(offset(cell, -1, 0, d))) { add_black(offset(cell, 1, 0, d)); }
            if (cell.qnum === 4 && isntBlack(offset(cell, 2, 0, d))) { add_black(offset(cell, -1, 0, d)); }
            if (isGreen(offset(cell, 1, 0, d)) && (isntBlack(offset(cell, -1, 0, d)) ||
                (isntBlack(offset(cell, -1, -1, d)) || isntBlack(offset(cell, 0, -1, d))) &&
                (isntBlack(offset(cell, -1, +1, d)) || isntBlack(offset(cell, 0, +1, d))))) {
                let cc = offset(cell, 1, 0, d);
                while (isGreen(cc)) { cc = offset(cc, 1, 0, d); }
                if (SquSize.get(cc) === 1) { add_green(cell); }
            }
            if (SquSize.has(cell) && isGreen(offset(cell, 1, 0, d))) {
                let cc = offset(cell, 2, 0, d), cl = [];
                while (!cc.isnull && !isBlack(cc)) {
                    if (!isGreen(cc)) { cl.push(cc); }
                    cc = offset(cc, 1, 0, d);
                }
                if (SquSize.get(cell) === SquSize.get(cc) && cl.length === (SquSize.get(cell) === 1 ? 2 : 1)) {
                    cl.forEach(c => add_black(c));
                }
            }
        }
    });
}

function TrenAssist() {
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none) { add_green(cell); }
        let l = [0, 1, 2, 3].map(d => ![1, 2].every(dd =>
            ((nb, nc) => nc.isnull || nc.qnum === CQNUM.none || isSide(nb))(offset(cell, dd - .5, 0, d), offset(cell, dd, 0, d))));
        if (cell.qnum === CQNUM.none && l.every(e => e === false)) { add_yellow(cell); }
        if (cell.qsub === CQNUM.green && cell.qnum === CQNUM.none && l.filter(e => e === true).length === 1) {
            l.forEach((e, d) => {
                if (e === false) { return; }
                add_green(offset(cell, 1, 0, d));
                add_side(offset(cell, 1, -.5, d));
                add_side(offset(cell, 1, +.5, d));
            });
        }
        for (let d = 0; d < 4; d++) {
            let ncell = offset(cell, 1, 0, d);
            if (cell.qnum !== CQNUM.none && ncell.qnum !== CQNUM.none) {
                add_side(offset(cell, .5, 0, d));
            }
            if (isGreen(cell) && isYellow(ncell)) {
                add_side(offset(cell, .5, 0, d));
            }
            if (isGreen(cell) && adjlist(cell.adjborder).every(b => b.isnull || isSide(b) || b === offset(cell, .5, 0, d))) {
                add_green(offset(cell, 1, 0, d));
                add_side(offset(cell, 1, -.5, d));
                add_side(offset(cell, 1, +.5, d));
            }
        }
        // TODO: test all possible placement for one clue
    });
}

function CocktailLampAssist() {
    BlackConnected_InRegion(true);
    BlackNotAdjacent_OverBorder();
    No2x2Black();
    CellConnected({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        DiagDir: true,
    });
}

function MinesweeperAssist() {
    forEachCell(cell => {
        if (cell.qnum < 0) { return; }
        NShadeInClist({
            isShaded: isBlack,
            isUnshaded: c => isDot(c) || c.qnum !== CQNUM.none,
            add_shaded: add_black,
            add_unshaded: add_dot,
            clist: adj8list(cell),
            n: cell.qnum,
        });
        let ncl = [];
        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                if (dx === 0 && dy === 0) { continue; }
                let ncell = offset(cell, dx, dy);
                if (ncell.isnull || ncell.qnum < 0) { continue; }
                ncl.push(ncell);
            }
        }
        for (let i = 0; i < ncl.length; i++) {
            let ncell = ncl[i];
            let l1 = adj8list(cell), l2 = adj8list(ncell);
            l1 = l1.filter(c => !c.isnull && c.qnum === CQNUM.none && !isDot(c) && !adj8list(ncell).includes(c));
            l2 = l2.filter(c => !c.isnull && c.qnum === CQNUM.none && !isDot(c) && !adj8list(cell).includes(c));
            if (l2.length - ncell.qnum === l1.filter(c => isBlack(c)).length - cell.qnum) {
                l2.forEach(c => add_black(c));
                l1.forEach(c => add_dot(c));
            }
            if (l1.length - cell.qnum === l2.filter(c => isBlack(c)).length - ncell.qnum) {
                l1.forEach(c => add_black(c));
                l2.forEach(c => add_dot(c));
            }
            for (let j = i + 1; j < ncl.length; j++) {
                let mcell = ncl[j];
                let cl = [cell, ncell, mcell];
                let g = cl.map(c => adj8list(c).filter(cc => !cc.isnull && cc.qnum === CQNUM.none && !isDot(cc)));
                let a = unique(g.flat());
                let r = Array(8).fill(0).map((_, i) =>
                    a.filter(c => ((i & (1 << 0)) === 0) ^ (g[0].includes(c)))
                        .filter(c => ((i & (1 << 1)) === 0) ^ (g[1].includes(c)))
                        .filter(c => ((i & (1 << 2)) === 0) ^ (g[2].includes(c)))
                );
                let n = r.map(l => Array(l.filter(c => !isBlack(c)).length + 1).fill(0)
                    .map((_, i) => i + l.filter(c => isBlack(c)).length));
                let cand = getComb([n[3], n[5], n[6], n[7]]);
                cand = cand.map(([n3, n5, n6, n7]) =>
                    [0, cl[0].qnum - n3 - n5 - n7, cl[1].qnum - n3 - n6 - n7, n3, cl[2].qnum - n5 - n6 - n7, n5, n6, n7]);
                cand = cand.filter(l => l.every((m, i) => m >= n[i][0] && m <= n[i][n[i].length - 1]));
                r.forEach((l, i) => {
                    if (cand.length > 0 && cand.every(l => l[i] === cand[0][i])) {
                        NShadeInClist({
                            isShaded: isBlack,
                            isUnshaded: c => isDot(c) || c.qnum !== CQNUM.none,
                            add_shaded: add_black,
                            add_unshaded: add_dot,
                            clist: l,
                            n: cand[0][i],
                        });
                    }
                });
            }
        }
    });
}

function TilepaintAssist() {
    forEachRoom(room => {
        let clist = Array.from(room.clist);
        if (clist.some(c => isBlack(c))) { clist.forEach(c => add_black(c)); }
        if (clist.some(c => isGreen(c))) { clist.forEach(c => add_green(c)); }
    });
    let list = [...Array.from(board.cell), ...Array.from(board.excell)];
    list = [...list.filter(c => c.qnum > 0).map(c => {
        let pc = offset(c, 1, 0), clist = [];
        while (!pc.isnull && pc.ques === CQUES.none) {
            clist.push(pc);
            pc = offset(pc, 1, 0);
        }
        return [c.qnum, clist];
    }),
    ...list.filter(c => c.qnum2 > 0).map(c => {
        let pc = offset(c, 0, 1), clist = [];
        while (!pc.isnull && pc.ques === CQUES.none) {
            clist.push(pc);
            pc = offset(pc, 0, 1);
        }
        return [c.qnum2, clist];
    })];
    list = list.filter(([n, l]) => n !== CQNUM.none && l.length > 0);
    list.forEach(([n, clist]) => {
        n -= clist.filter(c => isBlack(c)).length;
        clist = clist.filter(c => !isBlack(c) && !isDot(c));
        let rlist = new Set();
        clist.forEach(c => rlist.add(c.room));
        rlist = Array.from(rlist).map(room => [room, clist.filter(c => c.room === room).length]);
        rlist.forEach(([room, cnt]) => {
            if (cnt > n) {
                Array.from(room.clist).forEach(c => add_green(c));
            }
            if (clist.length - cnt < n) {
                Array.from(room.clist).forEach(c => add_black(c));
            }
        });
    });
}

function GoatsAndWolvesAssist() {
    CluePerRegion({
        isShaded: c => c.qnum !== CQNUM.none,
        isOthers: c => c.qnum === CQNUM.none,
        isUnshaded: () => false,
        isNotPassable: (c, nb, nc) => isSide(nb),
        BridgeType: "link",
    });
    forEachCross(cross => {
        if (cross.qnum === -1) {
            for (let d = 0; d < 4; d++) {
                if (isLink(offset(cross, -.5, 0, d))) { add_link(offset(cross, .5, 0, d)); }
                if (isSide(offset(cross, -.5, 0, d))) { add_side(offset(cross, .5, 0, d)); }
            }
        }
        if (cross.qnum === 1 && adjlist(cross.adjborder).every(b => !b.isnull)) {
            let blist = adjlist(cross.adjborder);
            if (blist.filter(b => isLink(b)).length >= 3) { blist.forEach(b => add_link(b)); }
            if (blist.filter(b => isSide(b)).length === 2) { blist.forEach(b => add_link(b)); }
            if (blist.filter(b => isSide(b)).length === 1 && blist.filter(b => isLink(b)).length === 2) {
                blist.forEach(b => add_side(b));
            }
        }
    });
    let DSU = new Map(); // Disjoint Set Union
    let DSUfind = function (n) {
        if (DSU.get(n) !== n) { DSU.set(n, DSUfind(DSU.get(n))); }
        return DSU.get(n);
    };
    forEachCell(cell => {
        DSU.set(cell, cell);
        let cc = cell;
        if (isLink(offset(cell, -.5, 0))) {
            let nc = DSUfind(offset(cell, -1, 0));
            if (cc.qnum !== CQNUM.none) { DSU.set(nc, cc); }
            else { DSU.set(cc, nc); }
        }
        cc = DSUfind(cell);
        if (isLink(offset(cell, 0, -.5))) {
            let nc = DSUfind(offset(cell, 0, -1));
            if (cc.qnum !== CQNUM.none) { DSU.set(nc, cc); }
            else { DSU.set(cc, nc); }
        }
    });
    forEachCell(cell => {
        for (let d = 0; d < 4; d++) {
            if (offset(cell, 0, 1, d).isnull) { continue; }
            let cc = DSUfind(cell);
            let nc = DSUfind(offset(cell, 0, 1, d));
            if ((new Set([CQNUM.none, cc.qnum, nc.qnum])).size === 3) {
                add_side(offset(cell, 0, .5, d));
            }
        }
    });
}

function TawamurengaAssist() {
    let isntBlack = c => c.isnull || c.qsub === CQSUB.dot || c.qnum !== CQNUM.none;
    forEachCell(cell => {
        if (cell.by < board.rows * 2 - 1) {
            if (isBlack(cell) && isntBlack(offset(cell, -.5, 1))) { add_black(offset(cell, +.5, 1)); }
            if (isBlack(cell) && isntBlack(offset(cell, +.5, 1))) { add_black(offset(cell, -.5, 1)); }
            if (isntBlack(offset(cell, -.5, 1)) && isntBlack(offset(cell, +.5, 1))) { add_dot(cell); }
        }
        if (!isBlack(cell) && !isDot(cell) && !isNum(cell)) {
            if ([offset(cell, -2, 0), offset(cell, -1, 0)].every(c => isBlack(c))) { add_dot(cell); }
            if ([offset(cell, +1, 0), offset(cell, -1, 0)].every(c => isBlack(c))) { add_dot(cell); }
            if ([offset(cell, +1, 0), offset(cell, +2, 0)].every(c => isBlack(c))) { add_dot(cell); }
        }
        if (isNum(cell)) {
            let clist = [[-.5, -1], [.5, -1], [-1, 0], [1, 0], [-.5, 1], [.5, 1]].map(([x, y]) => offset(cell, x, y));
            let setb = 0b111111, setd = 0b000000, n = 0;
            for (let j = 0; j <= 0b111111; j++) {
                let t = j.toString(2).padStart(6, '0').split('');
                if (t.filter(n => n === '1').length !== cell.qnum) { continue; }
                if (t.some((n, i) => n === '0' && isBlack(clist[i]) || n === '1' && isntBlack(clist[i]))) { continue; }
                if (t[0] === '1' && t[2] === '0') { continue; }
                if (t[1] === '1' && t[3] === '0') { continue; }
                if (t[2] === '1' && t[4] === '0' && cell.by < board.rows * 2 - 1 && isntBlack(offset(cell, -1.5, 1))) { continue; }
                if (t[3] === '1' && t[5] === '0' && cell.by < board.rows * 2 - 1 && isntBlack(offset(cell, +1.5, 1))) { continue; }
                if (t[0] === '1' && t[1] === '1' && (isBlack(offset(cell, -1.5, -1)) || isBlack(offset(cell, +1.5, -1)))) { continue; }
                if (t[4] === '1' && t[5] === '1' && (isBlack(offset(cell, -1.5, +1)) || isBlack(offset(cell, +1.5, +1)))) { continue; }
                setb &= j;
                setd |= j;
                n++;
            }
            setb = setb.toString(2).padStart(6, '0');
            setd = setd.toString(2).padStart(6, '0');
            for (let j = 0; j < 6; j++) {
                if (setb[j] === '1') { add_black(clist[j]); }
                if (setd[j] === '0') { add_dot(clist[j]); }
            }
        }
    });
}

function NondangoAssist() {
    forEachRoom(room => {
        NShadeInClist({
            clist: Array.from(room.clist).filter(c => c.ques !== 8),
            n: 1,
            isShaded: isBlack,
            isUnshaded: isGreen,
            add_shaded: add_black,
            add_unshaded: add_green,
        });
    });
    forEachCell(cell => {
        if (cell.ques === 8) { return; }
        for (let d = 0; d < 4; d++) {
            let fn = function (c1, c2) {
                if (c1.isnull || c2.isnull) { return; }
                if (c1.ques === 8 || c2.ques === 8) { return; }
                if (isBlack(c1) && isBlack(c2)) { add_green(cell); }
                if (isGreen(c1) && isGreen(c2)) { add_black(cell); }
                if ([c1, c2].every(c => isGreen(c) || c.room === cell.room)) {
                    Array.from(cell.room.clist).filter(c => c.ques !== 8 && ![cell, c1, c2].includes(c)).forEach(c => add_green(c));
                }
            };
            fn(offset(cell, 0, 1, d), offset(cell, 0, 2, d));
            fn(offset(cell, 1, 1, d), offset(cell, 2, 2, d));
            fn(offset(cell, 0, -1, d), offset(cell, 0, 1, d));
            fn(offset(cell, -1, -1, d), offset(cell, 1, 1, d));
        }
    });
}

function RailPoolAssist() {
    SingleLoopInCell({
        isPassable: c => c.ques !== CQUES.wall,
        isPass: c => c.ques !== CQUES.wall,
    });
    forEachCell(cell => {
        if (cell.ques === CQUES.wall) { return; }
        let qnums = Array.from(cell.room.clist).flatMap(c => c.qnums);
        if (qnums.length !== 0 && !qnums.includes(CQNUM.quesmark)) {
            let maxd = Math.max(...qnums);
            for (let d = 0; d < 2; d++) {
                let cand = [];
                if (!isntLine(offset(cell, -.5, 0, d)) && !isntLine(offset(cell, +.5, 0, d)) && !isLine(offset(cell, 0, -.5, d)) && !isLine(offset(cell, 0, +.5, d))) {
                    cand.push([0, 0]);
                }
                let ll = 0, rr = 0;
                while (-ll < maxd && !isntLine(offset(cell, 0, ll - .5, d)) && (ll === 0 || !isLine(offset(cell, -.5, ll, d)) && !isLine(offset(cell, +.5, ll, d)))) { ll--; }
                while (+rr < maxd && !isntLine(offset(cell, 0, rr + .5, d)) && (rr === 0 || !isLine(offset(cell, -.5, rr, d)) && !isLine(offset(cell, +.5, rr, d)))) { rr++; }
                for (let l = ll; l <= 0; l++) {
                    for (let r = 0; r <= rr; r++) {
                        if (!qnums.includes(r - l)) { continue; }
                        if (l !== 0 && r !== 0 && (isLine(offset(cell, -.5, 0, d)) || isLine(offset(cell, +.5, 0, d)))) { continue; }
                        if (isLine(offset(cell, 0, l - .5, d)) || isLine(offset(cell, 0, r + .5, d))) { continue; }
                        cand.push([l, r]);
                    }
                }
                if (cand.length > 0) {
                    let lm = Math.max(...cand.map(e => e[0]));
                    let rm = Math.min(...cand.map(e => e[1]));
                    for (let dd = lm; dd < rm; dd++) {
                        add_line(offset(cell, 0, dd + .5, d));
                    }
                    if (cand.every(([l, r]) => l === lm)) {
                        add_cross(offset(cell, 0, lm - .5, d));
                    }
                    if (cand.every(([l, r]) => r === rm)) {
                        add_cross(offset(cell, 0, rm + .5, d));
                    }
                }
            }
        }
        for (let d = 0; d < 4; d++) {
            if (qnums.length === 1 && qnums[0] === 1 && isntLine(offset(cell, 0, -.5, d))) {
                add_line(offset(cell, 0, .5, d));
            }
            if (qnums.length === 1 && offset(cell, 0, -.5, d).isnull && !isBound(offset(cell, 0, .5, d))) {
                add_line(offset(cell, 0, .5, d));
            }
        }
    });
}

function DoubleBackAssist() {
    SingleLoopInCell({
        isPassable: c => c.ques !== CQUES.wall,
        isPass: c => c.ques !== CQUES.wall,
    });
    forEachRoom(room => {
        let oblist = [];
        Array.from(room.clist).forEach(cell => {
            forEachSide(cell, (nb, nc) => {
                if (!nc.isnull && nc.room !== room && nb.ques) {
                    oblist.push(nb);
                }
            });
        });
        if (oblist.filter(b => isLine(b)).length === 4) {
            oblist.forEach(b => add_cross(b));
        }
        if (oblist.filter(b => !isCross(b)).length === 4) {
            oblist.forEach(b => add_line(b));
        }
    });
}

function HashiwokakeroAssist() {
    let add_line = function (b, n = 1) {
        if (b === undefined || b.isnull || n <= b.line || isCross(b)) { return; }
        if (![1, 2].includes(n)) { return; }
        b.setLineVal(n);
        b.draw();
        stepcheck(b.line);
    };
    CellConnected({
        isShaded: c => c.lcnt > 0 || c.qnum !== CQNUM.none,
        isUnshaded: c => adjlist(c.adjborder).every(b => isntLine(b)),
        add_shaded: c => {
            if (c.qnum !== CQNUM.none) { return; }
            if (isntLine(c.adjborder.top)) {
                add_line(c.adjborder.left);
                add_line(c.adjborder.right);
            }
            if (isntLine(c.adjborder.left)) {
                add_line(c.adjborder.top);
                add_line(c.adjborder.bottom);
            }
        },
        add_unshaded: c => forEachSide(c, (nb, nc) => add_cross(nb)),
        isNotPassable: (c, nb, nc) => isCross(nb),
        BridgeType: "line",
    });
    forEachCell(cell => {
        for (let d = 0; d < 4; d++) {
            if (cell.qnum === CQNUM.none && isntLine(offset(cell, .5, 0, d))) {
                add_cross(offset(cell, -.5, 0, d));
            }
            if (cell.qnum === CQNUM.none && offset(cell, .5, 0, d).line) {
                add_line(offset(cell, -.5, 0, d), offset(cell, .5, 0, d).line);
            }
        }
        if (cell.qnum === CQNUM.none && cell.lcnt === 2) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        if (cell.qnum === adjlist(cell.adjborder).reduce((a, b) => a + b.line, 0)) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        if (adjlist(cell.adjborder).filter(b => !b.isnull && !isCross(b)).length === 1) {
            forEachSide(cell, (nb, nc) => add_line(nb, 1));
        }
        if (cell.qnum !== CQNUM.none) {
            let l = [0, 1, 2, 3].map(d => {
                let nc = offset(cell, 1, 0, d);
                if (isCross(offset(cell, .5, 0, d))) { return 0; }
                while (!nc.isnull && nc.qnum === CQNUM.none) {
                    if (isCross(offset(nc, .5, 0, d))) { return 0; }
                    nc = offset(nc, 1, 0, d);
                }
                if (nc.isnull) { return 0; }
                if (nc.qnum === CQNUM.quesmark) { return 2; }
                if (board.linegraph.components.length > 0 && cell.qnum === 1 && nc.qnum === 1) { return 0; }
                let ln = adjlist(nc.adjborder);
                ln.splice((d + 2) % 4, 1);
                ln = nc.qnum - ln.reduce((a, b) => a + b.line, 0);
                if (board.linegraph.components.length > 0 && cell.qnum === 2 && nc.qnum === 2) { return Math.min(ln, 1); }
                return Math.min(ln, 2);
            });
            for (let d = 0; d < 4; d++) {
                if (l[d] === 0) {
                    add_cross(offset(cell, .5, 0, d));
                }
                let n = Math.min(cell.qnum - l.reduce((a, b) => a + b) + l[d], 2);
                if (cell.qnum >= 0 && n >= 1) {
                    add_line(offset(cell, .5, 0, d), n);
                }
            }
        }
    });
}

function CountryRoadAssist() {
    let add_Ocell = function (c) {
        if (c === undefined || c.isnull || c.qsub !== CQSUB.none) { return; }
        c.setQsub(CQSUB.circle);
        c.draw();
        stepcheck(true);
    };
    let add_Xcell = function (c) {
        if (c === undefined || c.isnull || c.qsub !== CQSUB.none) { return; }
        c.setQsub(CQSUB.cross);
        c.draw();
        stepcheck(true);
    };
    CellConnected_InRegion({
        isShaded: c => c.qsub === CQSUB.circle,
        isUnshaded: c => c.qsub === CQSUB.cross,
        add_shaded: add_Ocell,
        add_unshaded: add_Xcell,
        SizeClue: true,
        ByLine: true,
    });
    RoomPassOnce({
        LengthClue: true,
    });
    SingleLoopInCell({
        isPass: c => c.qsub === CQSUB.circle,
        isNotPassable: c => c.qsub === CQSUB.cross,
    });
    forEachRoom(room => {
        NShadeInClist({
            isShaded: c => c.qsub === CQSUB.circle,
            isUnshaded: c => c.qsub === CQSUB.cross,
            add_shaded: add_Ocell,
            add_unshaded: add_Xcell,
            n: room.top.qnum,
            clist: Array.from(room.clist),
        });
        if (Array.from(room.clist).length === 1) {
            add_Ocell(room.clist[0]);
        }
    });
    forEachCell(cell => {
        if (adjlist(cell.adjborder).every(b => isntLine(b))) {
            add_Xcell(cell);
        }
        if (cell.qsub === CQSUB.cross) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
            for (let d = 0; d < 4; d++) {
                let nb = offset(cell, 0.5, 0, d);
                let nc = offset(cell, 1, 0, d)
                if (!nb.isnull && nb.ques) {
                    add_Ocell(nc);
                }
            }
        }
        if (cell.lcnt > 0) {
            add_Ocell(cell);
        }
        if (adjlist(cell.adjborder).filter(b => isntLine(b)).length === 2) {
            adjlist(cell.adjborder, cell.adjacent).filter(([nb, nc]) => !nc.isnull && !isntLine(nb) && isBound(nb)).forEach(([nb, nc]) => add_Ocell(nc));
        }
        if (cell.room.top.qnum === 1 && adjlist(cell.adjborder).filter(b => isBound(b) && !isntLine(b)).length < 2) {
            add_Xcell(cell);
        }
    });
}

function MochikoroAssist() {
    let cluecnt = 0;
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none) {
            add_green(cell);
            cluecnt++;
        }
        for (let d = 0; d < 4; d++) {
            if (isGreen(cell) && isGreen(offset(cell, 0, 1, d)) && isBlack(offset(cell, 2, 0, d)) && isBlack(offset(cell, 2, 1, d))) {
                add_green(offset(cell, 1, 0, d));
                add_green(offset(cell, 1, 1, d));
            }
        }
    });
    No2x2Black();
    RectRegion_Cell({
        isShaded: isGreen,
        isUnshaded: isBlack,
        add_shaded: add_green,
        add_unshaded: add_black,
        isSizeAble: (w, h, sc, c) => {
            if (sc !== null && sc.qnum !== w * h) { return false; }
            if (cluecnt > 1 && [offset(c, -1, -1), offset(c, -1, h), offset(c, w, -1), offset(c, w, h)].every(c => c.isnull || isBlack(c))) { return false; }
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    if (offset(c, i, j).qnum > 0 && (offset(c, i, j) !== sc && sc !== null || offset(c, i, j).qnum !== w * h)) { return false; }
                }
            }
            return true;
        },
    });
    GreenConnectedDiagonally();
}

function NumberlinkAssist() {
    forEachCell(cell => {
        let num = undefined;
        if (cell.path !== null) { num = Array.from(cell.path.clist).find(c => c.qnum !== CQNUM.none); }
        if (num !== undefined) { num = num.qnum; }
        if (cell.qnum !== CQNUM.none) { num = cell.qnum; }
        if (cell.lcnt === 2 || cell.lcnt === 1 && cell.qnum !== CQNUM.none) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        if (cell.qnum === CQNUM.none && adjlist(cell.adjborder).filter(b => isntLine(b)).length >= 3) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }

        if (num !== undefined) {
            forEachSide(cell, (nb, nc) => {
                if (nc.isnull || isCross(nb)) { return; }
                if (nc.path === null && nc.qnum !== CQNUM.none && nc.qnum !== num || nc.path !== null && Array.from(nc.path.clist).some(c => c.qnum !== CQNUM.none && c.qnum !== num)) {
                    add_cross(nb);
                }
                // using uniquity
                if (nc.path === null && nc.qnum === num || nc.path !== null && nc.path !== cell.path && Array.from(nc.path.clist).some(c => c.qnum === num)) {
                    add_line(nb);
                }
            });
        }
        let l = adjlist(cell.adjborder, cell.adjacent).filter(([nb, nc]) => isLine(nb) || !nc.isnull && !isCross(nb));
        if (cell.qnum === CQNUM.none && cell.lcnt === 1 && l.length === 2 || cell.qnum !== CQNUM.none && l.length === 1) {
            l.forEach(([nb, nc]) => add_line(nb));
        }
        // using uniquity
        for (let d = 0; d < 4; d++) {
            // + : No clue here
            // ·━· ·    ·━· ·
            // ┃        ┃ ×  
            // · + · -> ·×+━·
            //            ┃  
            // · · ·    · · ·
            if (isLine(offset(cell, .5, 0, d)) && isLine(offset(cell, 0, .5, d)) && !isClue(offset(cell, 1, 1, d))) {
                add_line(offset(cell, 1.5, 1, d));
                add_line(offset(cell, 1, 1.5, d));
            }
            //   × ×      × ×
            // ·×+ + -> ·×+━+
            // ┃        ┃ ┃
            // · + ·    · + ·
            if ((isLine(offset(cell, -1, .5, d)) && isntLine(offset(cell, 1, -.5, d)) ||
                isLine(offset(cell, .5, -1, d)) && isntLine(offset(cell, -.5, 1, d))) &&
                isntLine(offset(cell, -.5, 0, d)) && isntLine(offset(cell, 0, -.5, d)) &&
                [cell, offset(cell, 1, 0, d), offset(cell, 0, 1, d)].every(c => !c.isnull && !isClue(c))) {
                add_line(offset(cell, .5, 0, d));
                add_line(offset(cell, 0, .5, d));
            }
        }
    });
    // using uniquity
    forEachCross(cross => {
        if (adjlist(cross.adjborder).filter(b => isLine(b)).length === 2) {
            forEachSide(cross, (nb, nc) => add_cross(nb));
        }
    });

}

function SukoroAssist() {
    let add_Ocell = function (c) {
        if (c === undefined || c.isnull || c.anum !== CANUM.none || c.qsub !== CQSUB.none || c.qnum !== CQNUM.none) { return; }
        c.setQsub(CQSUB.circle);
        c.draw();
        stepcheck(true);
    };
    let add_number = function (c, n) {
        if (c === undefined || c.isnull || c.anum !== CANUM.none) { return; }
        c.setAnum(n);
        c.setQsub(CQSUB.none);
        c.draw();
        stepcheck(true);
    };
    CellConnected({
        isShaded: c => c.anum !== CANUM.none || c.qsub === CQSUB.circle,
        isUnshaded: c => c.qsub === CQSUB.cross,
        add_shaded: add_Ocell,
        add_unshaded: add_Xcell,
    });
    let not1c = new Set();
    CellConnected({
        isShaded: c => c.anum !== CANUM.none && c.anum !== 1,
        isUnshaded: c => c.qsub === CQSUB.cross || c.anum === 1,
        add_shaded: c => {
            not1c.add(c);
            add_Ocell(c);
        },
        add_unshaded: add_Xcell,
    });
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none) {
            add_number(cell, cell.qnum);
        }
        if (cell.anum !== CANUM.none) {
            if (adjlist(cell.adjacent).filter(c => c.anum !== CANUM.none || c.qsub === CQSUB.circle).length === cell.anum) {
                forEachSide(cell, (nb, nc) => add_Xcell(nc));
            }
            if (adjlist(cell.adjacent).filter(c => !c.isnull && c.qsub !== CQSUB.cross).length === cell.anum) {
                forEachSide(cell, (nb, nc) => add_Ocell(nc));
            }
        }
        let l = [2, 3, 4];
        if (!not1c.has(cell)) { l.push(1); }
        l = l.filter(n => n >= adjlist(cell.adjacent).filter(c => c.anum !== CANUM.none || c.qsub === CQSUB.circle).length);
        l = l.filter(n => n <= adjlist(cell.adjacent).filter(c => !c.isnull && c.qsub !== CQSUB.cross).length);
        l = l.filter(n => adjlist(cell.adjacent).every(c => c.anum !== n));
        if (cell.qsub === CQSUB.circle && l.length === 1) {
            add_number(cell, l[0]);
        }
        if (l.length === 0) {
            add_Xcell(cell);
        }
        for (let d = 0; d < 4; d++) {
            if (cell.anum === 3 && offset(cell, 1, 1, d).anum === 1) {
                add_Ocell(offset(cell, 0, -1, d));
                add_Ocell(offset(cell, -1, 0, d));
                add_Xcell(offset(cell, 1, 2, d));
                add_Xcell(offset(cell, 2, 1, d));
            }
            let l = [offset(cell, 1, -1, d), offset(cell, 1, 1, d), offset(cell, 2, 0, d)];
            if (cell.qsub === CQSUB.none && offset(cell, 1, 0, d).qsub === CQSUB.circle &&
                l.every(c => c.isnull || c.qsub !== CQSUB.none || c.anum !== CANUM.none || c === cell) &&
                l.filter(c => c.isnull || c.qsub === CQSUB.cross).length === 2 &&
                adjlist(cell.adjacent).every(c => c.isnull || c.qsub !== CQSUB.none || c.anum !== CANUM.none) &&
                adjlist(cell.adjacent).filter(c => c.isnull || c.qsub === CQSUB.cross).length === 2
            ) {
                add_Xcell(cell);
            }
        }
    });
}

function SashiganeAssist() {
    NoDeadendBorder();
    let isArrow = c => !c.isnull && c.qdir !== 0 && c.qdir !== 5;
    let isCircle = c => !c.isnull && (c.qnum !== CQNUM.none || c.qdir === 5);
    let isLAble = (c, d, l1, l2) => {
        if (c.isnull || isArrow(c) || l1 <= 0 || l2 <= 0) { return false; }
        if (offset(c, l1, 0, d).isnull || offset(c, l2, 0, d + 1).isnull) { return false; }
        if (isntLink(offset(c, 1.5, -1, d)) && isntLink(offset(c, 1, -1.5, d))) { return false; }
        if (isArrow(offset(c, l1, 0, d)) && qdirRemap(offset(c, l1, 0, d).qdir) !== (d + 2) % 4) { return false; }
        if (isArrow(offset(c, l2, 0, d + 1)) && qdirRemap(offset(c, l2, 0, d + 1).qdir) !== (d + 3) % 4) { return false; }
        if (c.qnum > 0 && l1 + l2 + 1 !== c.qnum) { return false; }
        if (isntLink(offset(c, .5, 0, d)) || isntLink(offset(c, .5, 0, d + 1))) { return false; }
        if (isLink(offset(c, .5, 0, d + 2)) || isLink(offset(c, .5, 0, d + 3))) { return false; }
        if (isLink(offset(c, l1 + .5, 0, d)) || isLink(offset(c, l2 + .5, 0, d + 1))) { return false; }
        for (let i = 1; i <= l1; i++) {
            if (i < l1 && isArrow(offset(c, i, 0, d)) || isCircle(offset(c, i, 0, d))) { return false; }
            if (isLink(offset(c, i, -.5, d)) || isLink(offset(c, i, +.5, d))) { return false; }
            if (isntLink(offset(c, i - .5, 0, d))) { return false; }
        }
        for (let i = 1; i <= l2; i++) {
            if (i < l2 && isArrow(offset(c, i, 0, d + 1)) || isCircle(offset(c, i, 0, d + 1))) { return false; }
            if (isLink(offset(c, i, -.5, d + 1)) || isLink(offset(c, i, +.5, d + 1))) { return false; }
            if (isntLink(offset(c, i - .5, 0, d + 1))) { return false; }
        }
        return true;
    };
    let cand = new Map();
    forEachCell(cell => {
        if (isArrow(cell)) { return; }
        for (let d = 0; d < 4; d++) {
            for (let l1 = 1; !isntLink(offset(cell, l1 - .5, 0, d)); l1++) {
                if (isLink(offset(cell, l1 + .5, 0, d))) { continue; }
                for (let l2 = 1; !isntLink(offset(cell, l2 - .5, 0, d + 1)); l2++) {
                    if (isLink(offset(cell, l2 + .5, 0, d + 1))) { continue; }
                    if (!isLAble(cell, d, l1, l2)) { continue; }
                    let clist = [cell];
                    for (let i = 1; i <= l1; i++) { clist.push(offset(cell, i, 0, d)); }
                    for (let i = 1; i <= l2; i++) { clist.push(offset(cell, i, 0, d + 1)); }
                    clist.forEach(c => {
                        let t = [];
                        forEachSide(c, (nb, nc) => clist.includes(nc) ? t.push(nb) : undefined);
                        if (!cand.has(c)) { cand.set(c, []); }
                        cand.get(c).push(t);
                    });
                }
            }
        }
    });
    forEachCell(cell => {
        let t = cand.get(cell);
        if (t === undefined) { return; }
        forEachSide(cell, (nb, nc) => t.every(l => l.includes(nb)) ? add_link(nb) : undefined);
        forEachSide(cell, (nb, nc) => t.every(l => !l.includes(nb)) ? add_side(nb) : undefined);
        for (let d = 0; d < 4; d++) {
            //         ╻
            // ╻ ╻ -> ╻╹╻
            // ┗━┛    ┗━┛
            if ([[-.5, 0], [-.5, 1], [0, -.5], [0, 1.5]].every(([x, y]) => isntLink(offset(cell, x, y, d))) && !offset(cell, 1, 1, d).isnull) {
                add_side(offset(cell, 1, .5, d));
            }
        }
    });
}

function TentsAssist() {
    let add_tent = function (c) {
        if (c === undefined || c.isnull || isDot(c) || c.qnum !== CQNUM.none || c.anum !== CANUM.none) { return; }
        c.setAnum(2);
        c.draw();
        stepcheck(true);
    };
    let isTentAble = (nb, nc) => !nc.isnull && nc.bx > 0 && nc.by > 0 && !isDot(nc) && nc.qnum === CQNUM.none && !isCross(nb);
    forEachCell(cell => {
        if (cell.qnum === 1) { // tree
            forEachSide(cell, (nb, nc) => {
                if (isDot(nc) || nc.qnum === 1) {
                    add_cross(nb);
                }
            });
            let l = adjlist(cell.adjborder, cell.adjacent).filter(([nb, nc]) => isTentAble(nb, nc));
            if (l.length === 1) {
                add_link(l[0][0]);
                add_tent(l[0][1]);
            }
            if (adjlist(cell.adjborder).some(b => isLink(b))) {
                forEachSide(cell, (nb, nc) => add_cross(nb));
            }
            for (let d = 0; d < 4; d++) {
                if (l.length === 2 && isTentAble(offset(cell, .5, 0, d), offset(cell, 1, 0, d)) && isTentAble(offset(cell, 0, .5, d), offset(cell, 0, 1, d))) {
                    add_dot(offset(cell, 1, 1, d));
                }
                if (l.length === 2 && isTentAble(offset(cell, .5, 0, d), offset(cell, 1, 0, d)) && isTentAble(offset(cell, -.5, 0, d), offset(cell, -1, 0, d))) {
                    add_dot(offset(cell, 0, 1, d));
                }
                if (!isTentAble(offset(cell, -.5, 0, d), offset(cell, -1, 0, d)) && offset(cell, 1, 0, d).qnum !== 1) {
                    [[1, -.5], [1.5, 0], [1, .5],].forEach(([x, y]) => {
                        add_cross(offset(cell, x, y, d));
                    });
                }
            }
        }
        if (cell.anum === 2) { // tent
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    add_dot(offset(cell, i, j));
                }
            }
            let l = adjlist(cell.adjborder, cell.adjacent).filter(([nb, nc]) => nc.qnum === 1 && !isCross(nb));
            if (l.length === 1) {
                add_link(l[0][0]);
            }
            if (adjlist(cell.adjborder).some(b => isLink(b))) {
                forEachSide(cell, (nb, nc) => add_cross(nb));
            }
        }
        if (cell.qnum === CQNUM.none && adjlist(cell.adjborder, cell.adjacent).every(([nb, nc]) => nc.isnull || nc.bx < 0 || nc.by < 0 || nc.qnum === CQNUM.none || isCross(nb))) {
            add_dot(cell);
        }
    });
    let fn = function (clist, qnum) {
        if (qnum === CQNUM.none) { return; }
        clist = clist.filter(c => !c.isnull && !isDot(c) && c.qnum === CQNUM.none);
        if (clist.filter(c => c.anum === 2).length === qnum) {
            clist.forEach(c => add_dot(c));
        }
        for (let i = 0; i < clist.length; i++) {
            if (offset(clist[i], 1, 0) === clist[i + 1] || offset(clist[i], 0, 1) === clist[i + 1]) {
                clist[i] = [clist[i], clist[i + 1]];
                clist.splice(i + 1, 1);
            } else {
                clist[i] = [clist[i]];
            }
        }
        if (clist.length === qnum) {
            clist.forEach(l => {
                if (l.length === 1) {
                    add_tent(l[0]);
                }
                if (l.length === 2) {
                    if (offset(l[0], 1, 0) === l[1]) {
                        [[0, -1], [0, 1], [1, -1], [1, 1]].forEach(([x, y]) => add_dot(offset(l[0], x, y)));
                    }
                    if (offset(l[0], 0, 1) === l[1]) {
                        [[-1, 0], [1, 0], [-1, 1], [1, 1]].forEach(([x, y]) => add_dot(offset(l[0], x, y)));
                    }
                }
            });
        }
    }
    for (let i = 0; i < board.cols; i++) {
        let qnum = board.getobj(i * 2 + 1, -1).qnum;
        let clist = [];
        for (let j = 0; j < board.rows; j++) {
            clist.push(board.getc(i * 2 + 1, j * 2 + 1));
        }
        fn(clist, qnum);
    }
    for (let j = 0; j < board.rows; j++) {
        let qnum = board.getobj(-1, j * 2 + 1).qnum;
        let clist = [];
        for (let i = 0; i < board.cols; i++) {
            clist.push(board.getc(i * 2 + 1, j * 2 + 1));
        }
        fn(clist, qnum);
    }
}

function DominionAssist() {
    BlackDomino();
    let m = new Map();
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none) {
            add_green(cell);
        }
        if (isNum(cell)) {
            if (!m.has(cell.qnum)) { m.set(cell.qnum, 0); }
            m.set(cell.qnum, m.get(cell.qnum) + 1);
        }
    });
    Array.from(m).forEach(([qnum, n]) => {
        if (n === 1) { return; }
        CellConnected({
            isShaded: c => c.qnum === qnum,
            isUnshaded: c => isBlack(c) || [...adjlist(c.adjacent), c].some(c => isNum(c) && c.qnum !== qnum),
            add_shaded: add_green,
            add_unshaded: () => { },
        });
    });
    forEachCell(cell => {
        if (isBlack(cell) || isGreen(cell)) { return; }
        let clist = [];
        let flg = false;
        let dfs = function (c) {
            if (flg || clist.includes(c) || !isGreen(c)) { return; }
            if (isNum(c) && clist.some(cc => isNum(cc) && cc.qnum !== c.qnum)) {
                flg = true;
                return;
            }
            clist.push(c);
            forEachSide(c, (nb, nc) => dfs(nc));
        }
        forEachSide(cell, (nb, nc) => dfs(nc));
        if (flg) { add_black(cell); }
    });
}

function StostoneAssist() {
    BlackConnected_InRegion(true);
    BlackNotAdjacent_OverBorder();
    forEachRoom(room => NShadeInClist({ n: room.top.qnum, clist: Array.from(room.clist), AtLeastOne: true }));
    for (let i = 0; i < board.cols; i++) {
        let clist = [];
        for (let j = 0; j < board.rows; j++) {
            clist.push(board.getc(i * 2 + 1, j * 2 + 1));
        }
        NShadeInClist({ n: board.rows / 2, clist: clist });
        let l = [];
        for (let k = 0; k < clist.length; k++) {
            if (isGreen(clist[k])) { continue; }
            if (isBlack(clist[k])) { l.push([clist[k]]); continue; }
            let nc = offset(clist[k], 0, 1);
            if (isBound(offset(clist[k], 0, .5)) && !nc.isnull && !isGreen(nc)) {
                l.push([clist[k], nc]);
                k++;
                continue;
            }
            l.push([clist[k]]);
        }
        if (l.length === board.rows / 2) { l.forEach(e => e.length === 1 ? add_black(e[0]) : undefined); }
    }
}

function KakuroAssist() {
    let list = [...Array.from(board.cell), ...Array.from(board.excell)];
    list = [...list.filter(c => c.qnum > 0).map(c => {
        let pc = offset(c, 1, 0), clist = [];
        while (!pc.isnull && pc.ques === CQUES.none) {
            clist.push(pc);
            pc = offset(pc, 1, 0);
        }
        return [c.qnum, clist];
    }),
    ...list.filter(c => c.qnum2 > 0).map(c => {
        let pc = offset(c, 0, 1), clist = [];
        while (!pc.isnull && pc.ques === CQUES.none) {
            clist.push(pc);
            pc = offset(pc, 0, 1);
        }
        return [c.qnum2, clist];
    })];
    list = list.filter(([n, l]) => l.length > 0);
    list.forEach(([n, clist]) => {
        let cand = clist.map(c => {
            if (c.anum !== CANUM.none) { return [c.anum]; }
            if (c.snum.some(n => n !== -1)) { return c.snum.filter(n => n !== -1); }
            return [1, 2, 3, 4, 5, 6, 7, 8, 9];
        });
        let r = [];
        let DFS = function (i, sum, l) {
            if (i === clist.length) { r.push(l); return; }
            cand[i].forEach(m => {
                if (l.includes(m)) { return; }
                if (sum + m + [0, 1, 3, 6, 10, 15, 21, 28, 36, 45][clist.length - i - 1] > n) { return; }
                if (sum + m + [0, 9, 17, 24, 30, 35, 39, 42, 44, 45][clist.length - i - 1] < n) { return; }
                DFS(i + 1, sum + m, [...l, m]);
            });
        };
        DFS(0, 0, []);
        r = cand.map((_, i) => unique(r.map(l => l[i])));
        r.forEach((a, i) => {
            let c = clist[i];
            if (a.length === 1) { add_number(c, a[0]); }
            if (a.length <= 4) { add_candidate(c, a); }
        });
    });
    forEachCell(cell => {
        if (cell.ques !== CQUES.none) { return; }
        let cand = [...Array(9).keys()].map(n => n + 1);
        for (let d = 0; d < 4; d++) {
            let nc = offset(cell, 1, 0, d);
            while (!nc.isnull && nc.ques === CQUES.none) {
                cand = cand.filter(n => n !== nc.anum);
                nc = offset(nc, 1, 0, d);
            }
        }
        add_candidate(cell, cand);
    });
}

function NanameguriAssist() {
    SingleLoopInCell();
    // 31 = \ , 32 = /
    // form1~5 : █ ◣ ◢ ◥ ◤
    let roomdata = board.getDiagonalRegions();
    roomdata.forEach(room => {
        let edges = Array.from(room.edges ?? []);
        let inner = Array.from(room.inner ?? []);
        if (edges.filter(b => isLine(b)).length === 2) {
            edges.filter(b => !isLine(b)).forEach(b => add_cross(b));
        }
        if (edges.filter(b => !isCross(b) && b.inside).length === 2) {
            edges.filter(b => !isCross(b) && b.inside).forEach(b => add_line(b));
        }
        if (edges.some(c => c.lcnt === 2) && edges.every(c => c.lcnt === 2)) {
            Array.from(room.inner).forEach(b => add_cross(b));
        }
        let forms = [room.form1, room.form2, room.form3, room.form4, room.form5].map(o => Array.from(o ?? []));
        edges.forEach(b => {
            let [c1, c2] = b.sidecell;
            if (!b.isvert && [0, 1, 2].some(n => forms[n].includes(c1)) && [0, 3, 4].some(n => forms[n].includes(c2))) {
                add_cross(b);
            }
            if (b.isvert && [0, 2, 3].some(n => forms[n].includes(c1)) && [0, 1, 4].some(n => forms[n].includes(c2))) {
                add_cross(b);
            }
        });
        if ([...edges, ...inner].some(b => isLine(b))) {
            let sb = [...edges, ...inner].find(b => isLine(b));
            let sc = sb.sidecell.find(c => forms.flat().includes(c));
            let abset = new Set([...edges, ...inner]);
            let bset = new Set();
            let dfs = function (c) {
                if (!forms.flat().includes(c)) { return; }
                forEachSide(c, (nb, nc) => {
                    if (!abset.has(nb) || bset.has(nb) || isCross(nb)) { return; }
                    bset.add(nb);
                    dfs(nc);
                });
            };
            dfs(sc);
            [...edges, ...inner].forEach(b => {
                if (!bset.has(b)) {
                    add_cross(b);
                }
            });
        }
    });
    forEachCell(cell => {
        if (cell.ques === 31 || cell.ques === 32) {
            let fn = (b1, b2, b3, b4) => {
                if ([b1, b2].some(b => !b.inside || isCross(b)) || [b3, b4].some(b => isLine(b))) {
                    add_cross(b1);
                    add_cross(b2);
                    add_line(b3);
                    add_line(b4);
                }
            };
            let fn2 = (c1, c2) => {
                if (c1.isnull || c2.isnull) { return false; }
                if (c1.lcnt !== 1 || c2.lcnt !== 1) { return false; }
                return c1.path === c2.path && board.linegraph.components.length > 1;
            };
            if (cell.ques === 31) {
                fn(offset(cell, 0, -.5), offset(cell, .5, 0), offset(cell, 0, .5), offset(cell, -.5, 0));
                fn(offset(cell, 0, .5), offset(cell, -.5, 0), offset(cell, 0, -.5), offset(cell, .5, 0));
            }
            if (cell.ques === 32) {
                fn(offset(cell, .5, 0), offset(cell, 0, .5), offset(cell, -.5, 0), offset(cell, 0, -.5));
                fn(offset(cell, -.5, 0), offset(cell, 0, -.5), offset(cell, .5, 0), offset(cell, 0, .5));
            }
            for (let d = 0; d < 4; d++) {
                if (offset(cell, -.5, -.5, d).qsub !== CRQSUB.none) {
                    add_inout(offset(cell, .5, .5, d), offset(cell, -.5, -.5, d).qsub ^ (d % 2 !== 0) ^ (cell.ques !== 31));
                }
                if (fn2(offset(cell, 0, -1, d), offset(cell, 1, 0, d)) && [31, 32, 31, 32][d] === cell.ques) {
                    add_cross(offset(cell, 0, -.5, d));
                    add_cross(offset(cell, .5, 0, d));
                }
            }
        }
    });
}

function OneRoomOneDoorAssist() {
    BlackNotAdjacent();
    GreenConnected();
    CellConnected({
        isShaded: isGreen,
        isUnshaded: isBlack,
        add_shaded: add_green,
        add_unshaded: add_black,
        isNotPassable: (c, nb, nc) => nb.ques === 1,
        cantDivideShade: () => true,
        OnlyOneConnected: false,
        UnshadeEmpty: false,
        ForceSearch: true,
    });
    let bset = new Set();
    forEachBorder(border => {
        if (border.ques && border.sidecell.every(c => isGreen(c))) {
            bset.add(JSON.stringify(border.sidecell.map(c => roomId(c.room)).sort()));
        }
    });
    forEachBorder(border => {
        if (border.ques && border.sidecell.some(c => isGreen(c)) &&
            bset.has(JSON.stringify(border.sidecell.map(c => roomId(c.room)).sort()))) {
            border.sidecell.forEach(c => add_black(c));
        }
    });
    forEachCell(cell => {
        if (!isBlack(cell) && !isGreen(cell)) {
            for (let d1 = 0; d1 < 4; d1++) {
                if (!isGreen(offset(cell, 1, 0, d1)) || !offset(cell, .5, 0, d1).ques) { continue; }
                for (let d2 = d1 + 1; d2 < 4; d2++) {
                    if (!isGreen(offset(cell, 1, 0, d2)) || !offset(cell, .5, 0, d2).ques) { continue; }
                    if (offset(cell, 1, 0, d1).room === offset(cell, 1, 0, d2).room) {
                        add_black(cell);
                    }
                }
            }
            let list = adjlist(cell.adjacent).flatMap(c => adjlist(c.adjborder, c.adjacent).map(([nb, nc]) => [c, nb, nc]));
            list = list.filter(([c, nb, nc]) => !c.isnull && !nb.isnull && !nc.isnull && nc !== cell && nb.ques && !isBlack(c) && !isGreen(c) && isGreen(nc));
            list.forEach(([c, nb, nc]) => {
                if (list.some(([oc, onb, onc]) => c.room === oc.room && onb !== nb && nc.room === onc.room)) {
                    add_green(cell);
                    return;
                }
            });
        }
    });
    forEachRoom(room => NShadeInClist({ n: room.top.qnum, clist: Array.from(room.clist) }));
}

function DosunFuwariAssist() {
    let add_ball = function (c, t) {// 1 for balloon, 2 for iron ball
        if (c === undefined || c.isnull || c.qsub === CQSUB.dot || c.qans !== CQANS.none) { return; }
        c.setQans(t);
        c.draw();
        stepcheck(true);
    };
    let nb = new Set(), ni = new Set();
    for (let x = 0; x < board.cols; x++) {
        let list = [];
        for (let y = 0; y < board.rows; y++) {
            let cell = board.cell[y * board.cols + x];
            if (cell.ques === 1) { list = []; continue; }
            if (isDot(cell) || cell.qans === 2) { list = null; }
            if (list !== null && list.some(c => c.room === cell.room)) { list = null; }
            if (Array.from(cell.room.clist).some(c => c !== cell && c.qans === 1)) { list = null; }
            if (list === null) { nb.add(cell); }
            else { list.push(cell); }
            if ((c => !c.isnull && c.qans === 2)(offset(cell, 0, -1))) { add_ball(cell, 2); }
        }
        list = [];
        for (let y = board.rows - 1; y >= 0; y--) {
            let cell = board.cell[y * board.cols + x];
            if (cell.ques === 1) { list = []; continue; }
            if (isDot(cell) || cell.qans === 1) { list = null; }
            if (list !== null && list.some(c => c.room === cell.room)) { list = null; }
            if (Array.from(cell.room.clist).some(c => c !== cell && c.qans === 2)) { list = null; }
            if (list === null) { ni.add(cell); }
            else { list.push(cell); }
            if ((c => !c.isnull && c.qans === 1)(offset(cell, 0, +1))) { add_ball(cell, 1); }
            if (nb.has(cell) && ni.has(cell)) { add_dot(cell); }
        }
    }
    forEachRoom(room => {
        let clist = Array.from(room.clist);
        if (clist.filter(c => !nb.has(c)).length === 1) {
            add_ball(clist.filter(c => !nb.has(c))[0], 1);
        }
        if (clist.filter(c => !ni.has(c)).length === 1) {
            add_ball(clist.filter(c => !ni.has(c))[0], 2);
        }
    });
}

function HeterominoAssist() {
    const N = 3;
    SizeRegion_Border({
        isLinkable: (c, nb, nc) => !nb.isnull && !isSide(nb) && c.ques !== CQUES.wall && nc.ques !== CQUES.wall,
        isSideable: (c, nb, nc) => !nb.isnull && !isLink(nb),
        allSize: N,
    });
    const HETERO = [
        [[[0, 0], [1, 0], [2, 0]], "━"],
        [[[0, 0], [0, 1], [0, 2]], "┃"],
        [[[0, 0], [1, 0], [1, 1]], "┓"],
        [[[0, 0], [-1, 1], [0, 1]], "┛"],
        [[[0, 0], [0, 1], [1, 1]], "┗"],
        [[[0, 0], [1, 0], [0, 1]], "┏"],
    ];
    forEachCell(cell => {
        if (cell.ques === CQUES.wall) { return; }
        let linklist = [], sidelist = [], namelist = [];
        HETERO.forEach(([cl, t]) => {
            [...Array(N).keys()].forEach(o => {
                let clist = cl.map(([x, y]) => offset(cell, x - cl[o][0], y - cl[o][1]));
                if (clist.some(c => c.isnull || c.ques === CQUES.wall)) { return; }
                if (clist.some(c => c.anum !== CANUM.none && c.anum !== t)) { return; }
                if (clist.some(c => adjlist(c.adjborder, c.adjacent).some(
                    ([nb, nc]) => {
                        if (nc.isnull || nc.ques === CQUES.wall) { return false; }
                        if (isLink(nb) && !clist.includes(nc) || isSide(nb) && clist.includes(nc)) { return true; }
                        if (clist.includes(nc)) { return false; }
                        if (nc.anum !== CANUM.none && nc.anum === t) { return true; }
                        let nclist = [];
                        let dfs = function (c) {
                            if (nclist.includes(c)) { return; }
                            nclist.push(c);
                            forEachSide(c, (nb, nc) => {
                                if (isLink(nb)) { dfs(nc); }
                            });
                        };
                        dfs(nc);
                        return getShape(clist, false) === getShape(nclist, false);
                    }))) { return; }
                let linkl = [], sidel = [];
                clist.forEach(c => forEachSide(c, (nb, nc) => {
                    if (clist.includes(nc) && !linkl.includes(nb)) { linkl.push(nb); }
                    if (!clist.includes(nc) && !sidel.includes(nb)) { sidel.push(nb); }
                }));
                linklist.push(linkl);
                sidelist.push(sidel);
                namelist.push(t);
            });
        });
        if (linklist.length > 0) { linklist = linklist.reduce((a, b) => a.filter(i => b.includes(i))); }
        if (sidelist.length > 0) { sidelist = sidelist.reduce((a, b) => a.filter(i => b.includes(i))); }
        linklist.forEach(b => add_link(b));
        sidelist.forEach(b => add_side(b));
        namelist = unique(namelist);
        if (namelist.length === 1) { add_number(cell, namelist[0]); }
    });
}

function TetrominousAssist() {
    const N = 4;
    SizeRegion_Border({
        isLinkable: (c, nb, nc) => !nb.isnull && !isSide(nb),
        isSideable: (c, nb, nc) => !nb.isnull && !isLink(nb),
        allSize: N,
    });
    forEachBorder(b => { if (b.ques === 1) { add_side(b); } });
    const TETRO = [// 0~4 : ILOST
        [[[0, 0], [1, 0], [2, 0], [3, 0]], 0],
        [[[0, 0], [1, 0], [2, 0], [2, 1]], 1],
        [[[0, 0], [0, 1], [1, 0], [1, 1]], 2],
        [[[0, 0], [1, 0], [1, 1], [2, 1]], 3],
        [[[0, 0], [1, 0], [1, 1], [2, 0]], 4],
    ];
    forEachCell(cell => {
        if (cell.qnum >= 0) { add_number(cell, cell.qnum); }
        for (let d = 0; d < 4; d++) {
            if (cell.anum >= 0 && offset(cell, 1, 0, d).anum >= 0 && cell.anum === offset(cell, 1, 0, d).anum) {
                add_link(offset(cell, .5, 0, d));
            }
            if (cell.anum >= 0 && offset(cell, 1, 0, d).anum >= 0 && cell.anum !== offset(cell, 1, 0, d).anum) {
                add_side(offset(cell, .5, 0, d));
            }
            if (isLink(offset(cell, .5, 0, d)) && cell.anum !== CANUM.none) {
                add_number(offset(cell, 1, 0, d), cell.anum);
            }
        }
        if (cell.ques === CQUES.wall) { return; }
        if (cell.anum >= 0 || adjlist(cell.adjborder).filter(b => b.isnull || isSide(b)).length === 3) {
            let linklist = [], sidelist = [], namelist = [];
            TETRO.forEach(([cl, t]) => {
                if (cell.anum >= 0 && cell.anum !== t) { return; }
                getComb([[0, 1, 2, 3], [1, -1], [...Array(N).keys()]]).forEach(([d, f, o]) => {
                    let clist = cl.map(([x, y]) => offset(cell, x - cl[o][0], (y - cl[o][1]) * f, d));
                    if (clist.some(c => c.isnull || c.ques === CQUES.wall)) { return; }
                    if (clist.some(c => c.anum >= 0 && c.anum !== t)) { return; }
                    if (clist.some(c => adjlist(c.adjborder, c.adjacent).some(
                        ([nb, nc]) => {
                            if (nc.isnull || nc.ques === CQUES.wall) { return false; }
                            if (isLink(nb) && !clist.includes(nc) || isSide(nb) && clist.includes(nc)) { return true; }
                            if (clist.includes(nc)) { return false; }
                            if (nc.anum >= 0 && nc.anum === t) { return true; }
                            let nclist = [];
                            let dfs = function (c) {
                                if (nclist.includes(c)) { return; }
                                nclist.push(c);
                                forEachSide(c, (nb, nc) => {
                                    if (isLink(nb)) { dfs(nc); }
                                });
                            };
                            dfs(nc);
                            return getShape(clist) === getShape(nclist);
                        }))) { return; }
                    let linkl = [], sidel = [];
                    clist.forEach(c => forEachSide(c, (nb, nc) => {
                        if (clist.includes(nc) && !linkl.includes(nb)) { linkl.push(nb); }
                        if (!clist.includes(nc) && !sidel.includes(nb)) { sidel.push(nb); }
                    }));
                    linklist.push(linkl);
                    sidelist.push(sidel);
                    namelist.push(t);
                });
            });
            if (linklist.length > 0) { linklist = linklist.reduce((a, b) => a.filter(i => b.includes(i))); }
            if (sidelist.length > 0) { sidelist = sidelist.reduce((a, b) => a.filter(i => b.includes(i))); }
            linklist.forEach(b => add_link(b));
            sidelist.forEach(b => add_side(b));
            namelist = unique(namelist);
            if (namelist.length === 1) { add_number(cell, namelist[0]); }
        }
    });
}

function PentominousAssist() {
    const N = 5;
    SizeRegion_Border({
        isLinkable: (c, nb, nc) => !nb.isnull && !isSide(nb),
        isSideable: (c, nb, nc) => !nb.isnull && !isLink(nb),
        allSize: N,
    });
    forEachBorder(b => { if (b.ques === 1) { add_side(b); } });
    const PENTO = [// 0~11 : FILNPTUVWXYZ
        [[[0, 0], [1, 0], [1, 1], [1, 2], [2, 1]], 0],
        [[[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], 1],
        [[[0, 0], [1, 0], [2, 0], [3, 0], [3, 1]], 2],
        [[[0, 0], [1, 0], [2, 0], [2, 1], [3, 1]], 3],
        [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1]], 4],
        [[[0, 0], [1, 0], [1, 1], [1, 2], [2, 0]], 5],
        [[[0, 0], [0, 1], [1, 0], [2, 0], [2, 1]], 6],
        [[[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]], 7],
        [[[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]], 8],
        [[[0, 0], [0, 1], [0, 2], [-1, 1], [1, 1]], 9],
        [[[0, 0], [1, 0], [1, 1], [2, 0], [3, 0]], 10],
        [[[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]], 11],
    ];
    forEachCell(cell => {
        if (cell.qnum >= 0) { add_number(cell, cell.qnum); }
        for (let d = 0; d < 4; d++) {
            if (cell.anum >= 0 && offset(cell, 1, 0, d).anum >= 0 && cell.anum === offset(cell, 1, 0, d).anum) {
                add_link(offset(cell, .5, 0, d));
            }
            if (cell.anum >= 0 && offset(cell, 1, 0, d).anum >= 0 && cell.anum !== offset(cell, 1, 0, d).anum) {
                add_side(offset(cell, .5, 0, d));
            }
            if (isLink(offset(cell, .5, 0, d)) && cell.anum !== CANUM.none) {
                add_number(offset(cell, 1, 0, d), cell.anum);
            }
        }
        if (cell.ques === CQUES.wall) { return; }
        if (cell.anum >= 0 || adjlist(cell.adjborder).filter(b => b.isnull || isSide(b)).length === 3) {
            let linklist = [], sidelist = [], namelist = [];
            PENTO.forEach(([cl, t]) => {
                if (cell.anum >= 0 && cell.anum !== t) { return; }
                getComb([[0, 1, 2, 3], [1, -1], [...Array(N).keys()]]).forEach(([d, f, o]) => {
                    let clist = cl.map(([x, y]) => offset(cell, x - cl[o][0], (y - cl[o][1]) * f, d));
                    if (clist.some(c => c.isnull || c.ques === CQUES.wall)) { return; }
                    if (clist.some(c => c.anum >= 0 && c.anum !== t)) { return; }
                    if (clist.some(c => adjlist(c.adjborder, c.adjacent).some(([nb, nc]) => {
                        if (nc.isnull || nc.ques === CQUES.wall) { return false; }
                        if (isLink(nb) && !clist.includes(nc) || isSide(nb) && clist.includes(nc)) { return true; }
                        if (clist.includes(nc)) { return false; }
                        if (nc.anum >= 0 && nc.anum === t) { return true; }
                        let nclist = [];
                        let dfs = function (c) {
                            if (nclist.includes(c)) { return; }
                            nclist.push(c);
                            forEachSide(c, (nb, nc) => {
                                if (isLink(nb)) { dfs(nc); }
                            });
                        };
                        dfs(nc);
                        return getShape(clist) === getShape(nclist);
                    }))) { return; }
                    let linkl = [], sidel = [];
                    clist.forEach(c => forEachSide(c, (nb, nc) => {
                        if (clist.includes(nc) && !linkl.includes(nb)) { linkl.push(nb); }
                        if (!clist.includes(nc) && !sidel.includes(nb)) { sidel.push(nb); }
                    }));
                    linklist.push(linkl);
                    sidelist.push(sidel);
                    namelist.push(t);
                });
            });
            if (linklist.length > 0) { linklist = linklist.reduce((a, b) => a.filter(i => b.includes(i))); }
            if (sidelist.length > 0) { sidelist = sidelist.reduce((a, b) => a.filter(i => b.includes(i))); }
            linklist.forEach(b => add_link(b));
            sidelist.forEach(b => add_side(b));
            namelist = unique(namelist);
            if (namelist.length === 1) { add_number(cell, namelist[0]); }
        }
    });
}

function FourCellsAssist() {
    SizeRegion_Border({
        isLinkable: (c, nb, nc) => !nb.isnull && !isSide(nb),
        isSideable: (c, nb, nc) => !nb.isnull && !isLink(nb),
        allSize: 4,
    });
    const TETRO = [// 0~4 : ILOST
        [[[0, 0], [1, 0], [2, 0], [3, 0]], 0],
        [[[0, 0], [1, 0], [2, 0], [2, 1]], 1],
        [[[0, 0], [0, 1], [1, 0], [1, 1]], 2],
        [[[0, 0], [1, 0], [1, 1], [2, 1]], 3],
        [[[0, 0], [1, 0], [1, 1], [2, 0]], 4],
    ];
    let cset = new Set();
    forEachCell(cell => {
        if (cell.ques === CQUES.wall) { return; }
        if (cset.has(cell)) { return; }
        else {
            let clist = [];
            let dfs = function (c) {
                if (clist.includes(c)) { return; }
                clist.push(c);
                forEachSide(c, (nb, nc) => {
                    if (isLink(nb)) { dfs(nc); }
                });
            };
            dfs(cell);
            if (clist.length === 4) {
                clist.forEach(c => cset.add(c));
                return;
            }
        }
        if (cell.qnum >= 0) {
            let list = adjlist(cell.adjborder, cell.adjacent);
            if (list.filter(([nb, nc]) => isSide(nb) || nc.isnull || nc.ques === CQUES.wall).length === cell.qnum) {
                list.filter(([nb, nc]) => !isSide(nb)).forEach(([nb, nc]) => add_link(nb));
            }
            if (list.filter(([nb, nc]) => !isLink(nb)).length === cell.qnum) {
                list.filter(([nb, nc]) => !isLink(nb)).forEach(([nb, nc]) => add_side(nb));
            }
        }
        let linklist = [], sidelist = [];
        TETRO.forEach(([cl, t]) => {
            getComb([[0, 1, 2, 3], [1, -1], [...Array(4).keys()]]).forEach(([d, f, o]) => {
                let clist = cl.map(([x, y]) => offset(cell, x - cl[o][0], (y - cl[o][1]) * f, d));
                if (clist.some(c => c.isnull || c.ques === CQUES.wall)) { return; }
                if (clist.some(c => c.qnum >= 0 && adjlist(c.adjacent).filter(nc => !clist.includes(nc)).length !== c.qnum)) { return; }
                if (clist.some(c => adjlist(c.adjborder, c.adjacent).some(
                    ([nb, nc]) => {
                        if (nc.isnull || nc.ques === CQUES.wall) { return false; }
                        if (isLink(nb) && !clist.includes(nc) || isSide(nb) && clist.includes(nc)) { return true; }
                        return false;
                    }))) { return; }
                let linkl = [], sidel = [];
                clist.forEach(c => forEachSide(c, (nb, nc) => {
                    if (clist.includes(nc) && !linkl.includes(nb)) { linkl.push(nb); }
                    if (!clist.includes(nc) && !sidel.includes(nb)) { sidel.push(nb); }
                }));
                if (clist.flatMap(c => adjlist(c.adjacent).filter(nc => !nc.isnull && nc.ques !== CQUES.wall && nc.qnum >= 0))
                    .some(c => adjlist(c.adjborder, c.adjacent).filter(([nb, nc]) =>
                        isSide(nb) || sidel.includes(nb) || nc.isnull || nc.ques === CQUES.wall).length > c.qnum)) { return; }
                linklist.push(linkl);
                sidelist.push(sidel);
            });
        });
        if (linklist.length > 0) { linklist = linklist.reduce((a, b) => a.filter(i => b.includes(i))); }
        if (sidelist.length > 0) { sidelist = sidelist.reduce((a, b) => a.filter(i => b.includes(i))); }
        linklist.forEach(b => add_link(b));
        sidelist.forEach(b => add_side(b));
    });
}

function FiveCellsAssist() {
    SizeRegion_Border({
        isLinkable: (c, nb, nc) => !nb.isnull && !isSide(nb),
        isSideable: (c, nb, nc) => !nb.isnull && !isLink(nb),
        allSize: 5,
    });
    const PENTO = [// 0~11 : FILNPTUVWXYZ
        [[[0, 0], [1, 0], [1, 1], [1, 2], [2, 1]], 0],
        [[[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], 1],
        [[[0, 0], [1, 0], [2, 0], [3, 0], [3, 1]], 2],
        [[[0, 0], [1, 0], [2, 0], [2, 1], [3, 1]], 3],
        [[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1]], 4],
        [[[0, 0], [1, 0], [1, 1], [1, 2], [2, 0]], 5],
        [[[0, 0], [0, 1], [1, 0], [2, 0], [2, 1]], 6],
        [[[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]], 7],
        [[[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]], 8],
        [[[0, 0], [0, 1], [0, 2], [-1, 1], [1, 1]], 9],
        [[[0, 0], [1, 0], [1, 1], [2, 0], [3, 0]], 10],
        [[[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]], 11],
    ];
    let cset = new Set();
    forEachCell(cell => {
        if (cell.ques === CQUES.wall) { return; }
        if (cset.has(cell)) { return; }
        else {
            let clist = [];
            let dfs = function (c) {
                if (clist.includes(c)) { return; }
                clist.push(c);
                forEachSide(c, (nb, nc) => {
                    if (isLink(nb)) { dfs(nc); }
                });
            };
            dfs(cell);
            if (clist.length === 5) {
                clist.forEach(c => cset.add(c));
                return;
            }
        }
        if (cell.qnum >= 0) {
            let list = adjlist(cell.adjborder, cell.adjacent);
            if (list.filter(([nb, nc]) => isSide(nb) || nc.isnull || nc.ques === CQUES.wall).length === cell.qnum) {
                list.filter(([nb, nc]) => !isSide(nb)).forEach(([nb, nc]) => add_link(nb));
            }
            if (list.filter(([nb, nc]) => !isLink(nb)).length === cell.qnum) {
                list.filter(([nb, nc]) => !isLink(nb)).forEach(([nb, nc]) => add_side(nb));
            }
        }
        let linklist = [], sidelist = [];
        PENTO.forEach(([cl, t]) => {
            getComb([[0, 1, 2, 3], [1, -1], [...Array(5).keys()]]).forEach(([d, f, o]) => {
                let clist = cl.map(([x, y]) => offset(cell, x - cl[o][0], (y - cl[o][1]) * f, d));
                if (clist.some(c => c.isnull || c.ques === CQUES.wall)) { return; }
                if (clist.some(c => c.qnum >= 0 && adjlist(c.adjacent).filter(nc => !clist.includes(nc)).length !== c.qnum)) { return; }
                if (clist.some(c => adjlist(c.adjborder, c.adjacent).some(
                    ([nb, nc]) => {
                        if (nc.isnull || nc.ques === CQUES.wall) { return false; }
                        if (isLink(nb) && !clist.includes(nc) || isSide(nb) && clist.includes(nc)) { return true; }
                        return false;
                    }))) { return; }
                let linkl = [], sidel = [];
                clist.forEach(c => forEachSide(c, (nb, nc) => {
                    if (clist.includes(nc) && !linkl.includes(nb)) { linkl.push(nb); }
                    if (!clist.includes(nc) && !sidel.includes(nb)) { sidel.push(nb); }
                }));
                if (clist.flatMap(c => adjlist(c.adjacent).filter(nc => !nc.isnull && nc.ques !== CQUES.wall && nc.qnum >= 0))
                    .some(c => adjlist(c.adjborder, c.adjacent).filter(([nb, nc]) =>
                        isSide(nb) || sidel.includes(nb) || nc.isnull || nc.ques === CQUES.wall).length > c.qnum)) { return; }
                linklist.push(linkl);
                sidelist.push(sidel);
            });
        });
        if (linklist.length > 0) { linklist = linklist.reduce((a, b) => a.filter(i => b.includes(i))); }
        if (sidelist.length > 0) { sidelist = sidelist.reduce((a, b) => a.filter(i => b.includes(i))); }
        linklist.forEach(b => add_link(b));
        sidelist.forEach(b => add_side(b));
    });
}

function SchoolTripAssist() {
    let add_bed = function (c, d) { // NUDLR = 01234
        if (c === undefined || c.isnull || c.qnum !== CQNUM.none || ![CQANS.none, 41, 46].includes(c.qans) || 41 + d === c.qans) { return; }
        if (d === 5 && c.qans === 41) { return; }
        c.setQans(41 + d);
        if (d > 0 && d <= 4) {
            let nc = [null, offset(c, 0, -1), offset(c, 0, 1), offset(c, -1, 0), offset(c, 1, 0)][d];
            let nd = [null, 2, 1, 4, 3][d];
            nc.setQans(46 + nd);
        }
        c.draw();
        stepcheck(true);
    };
    let add_black = function (c) {
        if (c.qnum !== CQNUM.none || c.qnums.length > 0) { return; }
        if (c === undefined || c.isnull || c.lcnt !== 0 || c.qans !== CQANS.none) { return; }
        c.setQans(CQANS.black);
        if (c.qsub === CQSUB.dot) {
            c.setQsub(CQSUB.none);
        }
        c.draw();
        stepcheck(true);
    };
    let add_dot = function (c) {
        if (c === undefined || c.isnull || c.qnum !== CQNUM.none || [CQANS.black, 41, 42, 43, 44, 45].includes(c.qans) || c.qsub !== CQSUB.none) { return; }
        c.setQsub(CQSUB.dot);
        c.draw();
        stepcheck(c.lcnt === 0);
    };
    let isEmpty = c => !c.isnull && c.qans === CQANS.none && c.qnum === CQNUM.none;
    CellConnected({
        isShaded: isBlack,
        isUnshaded: c => c.isnull || c.qans > 1 || c.qnum !== CQNUM.none,
        add_shaded: add_black,
        add_unshaded: c => add_bed(c, 5),
    });
    No2x2Cell({
        isShaded: isBlack,
        add_unshaded: c => add_bed(c, 5),
    });
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none && cell.qnum !== CQNUM.quesmark) {
            let fn = c => [41, 42, 43, 44, 45].includes(c.qans) || (isEmpty(c) || c.qans === 46) && !isDot(c) &&
                [offset(c, 1, 0), offset(c, 0, -1), offset(c, -1, 0)].some(c => isEmpty(c) || c.qans === 46);
            if (adjlist(cell.adjacent).filter(c => fn(c)).length === cell.qnum) {
                adjlist(cell.adjacent).filter(c => fn(c)).forEach(c => add_bed(c, 0));
            }
            if (adjlist(cell.adjacent).filter(c => [41, 42, 43, 44, 45].includes(c.qans)).length === cell.qnum) {
                forEachSide(cell, (nb, nc) => add_dot(nc));
            }
        }
        if (isEmpty(cell) || cell.qans === 41 || cell.qans === 46) {
            let tmp = [
                [cell, offset(cell, 1, 0), 4],
                [cell, offset(cell, 0, -1), 1],
                [cell, offset(cell, -1, 0), 3],
                [offset(cell, -1, 0), cell, 4],
                [offset(cell, 0, 1), cell, 1],
                [offset(cell, 1, 0), cell, 3],
            ].filter(([hc, bc, d]) => {
                if (hc.isnull || bc.isnull) { return false; }
                if (!isEmpty(hc) && hc.qans !== 41 && hc.qans !== 46) { return false; }
                if (!isEmpty(bc) && bc.qans !== 46) { return false; }
                if (isDot(hc)) { return false; }
                return true;
            });
            if (cell.qans === 46 && tmp.length === 2 && tmp[0][0] === tmp[1][1] && tmp[0][1] === tmp[1][0]) {
                add_bed(tmp[0][0], 5);
                add_bed(tmp[0][1], 5);
            }
            if (tmp.every(([hc, bc, d]) => hc !== cell)) {
                add_dot(cell);
            }
            if (tmp.length === 0) {
                add_black(cell);
            }
            if ((cell.qans === 41 || cell.qans === 46) && tmp.length === 1) {
                add_bed(tmp[0][0], tmp[0][2]);
            }
        }
        for (let d = 0; d < 4; d++) {
            if ([45, 42, 44, 43][d] !== cell.qans) { continue; }
            let tmp = [[-1, 0], [2, 0], [0, 1], [0, -1], [1, 1], [1, -1],].map(([x, y]) => offset(cell, x, y, d));
            if (tmp.filter(c => isBlack(c) || isEmpty(c)).length === 1) {
                tmp.forEach(c => add_black(c));
            }
        }
    });
}

function AntMillAssist() {
    BlackDomino();
    SingleLoopInBlock({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
    });
    const squ = 1, crs = 2;
    let isDominoAble = function (border) {
        if (border.isnull) { return false; }
        if (isGreen(border.sidecell[0]) || isGreen(border.sidecell[1])) { return false; }
        if (border.ques === crs) { return false; }
        let clist = [[+1.5, +1], [+1.5, -1], [-1.5, +1], [-1.5, -1]].map(([x, y]) => offset(border, x, y, border.isvert ? 0 : 1));
        let nclist = [[+1.5, 0], [-1.5, 0], [+.5, +1], [+.5, -1], [-.5, +1], [-.5, -1]].map(([x, y]) => offset(border, x, y, border.isvert ? 0 : 1));
        clist = clist.filter(c => !c.isnull && !isGreen(c));
        return clist.length >= 2 && nclist.every(c => !isBlack(c));
    }
    forEachBorder(border => {
        if (border.ques === squ) {
            if (isBlack(border.sidecell[0])) { add_black(border.sidecell[1]); }
            if (isBlack(border.sidecell[1])) { add_black(border.sidecell[0]); }
            if (isGreen(border.sidecell[0])) { add_green(border.sidecell[1]); }
            if (isGreen(border.sidecell[1])) { add_green(border.sidecell[0]); }
            if (!isDominoAble(border)) {
                add_green(border.sidecell[0]);
                add_green(border.sidecell[1]);
            }
        }
        if (border.ques === crs) {
            if (isBlack(border.sidecell[0])) { add_green(border.sidecell[1]); }
            if (isBlack(border.sidecell[1])) { add_green(border.sidecell[0]); }
            if (isGreen(border.sidecell[0])) { add_black(border.sidecell[1]); }
            if (isGreen(border.sidecell[1])) { add_black(border.sidecell[0]); }
        }
        if (isBlack(border.sidecell[0]) && isBlack(border.sidecell[1])) {
            let clist = [[+1.5, +1], [+1.5, -1], [-1.5, +1], [-1.5, -1]].map(([x, y]) => offset(border, x, y, border.isvert ? 0 : 1));
            clist = clist.filter(c => !c.isnull && !isGreen(c));
            if (clist.length === 2) {
                clist.forEach(c => add_black(c));
            }
            if (clist.filter(c => isBlack(c)).length === 2) {
                clist.forEach(c => add_green(c));
            }
        }
    });
    forEachCell(cell => {
        for (let d = 0; d < 4; d++) {
            if (isBlack(cell) && !isDominoAble(offset(cell, .5, 0, d))) {
                add_green(offset(cell, 1, 0, d));
            }
        }
        if (adjlist(cell.adjborder).filter(b => b.ques === squ).length > 1) {
            add_green(cell);
        }
        if (adjlist(cell.adjborder).every(b => !isDominoAble(b))) {
            add_green(cell);
        }
    });
}

function DoubleChocoAssist() {
    CluePerRegion({
        isShaded: c => c.ques === 0,
        isOthers: c => c.ques === 6,
        isUnshaded: () => false,
        isNotPassable: (c, nb, nc) => isSide(nb),
        cantDivideShade: (s, o) => s !== o,
        BridgeType: "link",
    });
    SizeRegion_Border({
        isLinkable: (c, nb, nc) => c.ques === nc.ques,
        isSideable: (c, nb, nc) => c.ques === nc.ques,
        hasAnum: true,
    });
    let cset = new Set();
    forEachCell(cell => {
        let clist = [];
        if (cset.has(cell)) { return; }
        let dfs = function (c) {
            if (clist.includes(c)) { return; }
            clist.push(c);
            cset.add(c);
            forEachSide(c, (nb, nc) => {
                if (!isSide(nb) && !nc.isnull && c.ques === nc.ques) {
                    dfs(nc);
                }
            });
        };
        dfs(cell);
        let ncset = new Set();
        clist.forEach(c => forEachSide(c, (nb, nc) => {
            if (!isSide(nb) && !nc.isnull && c.ques !== nc.ques) {
                ncset.add(nc);
            }
        }));
        if (ncset.size === 1) {
            clist.forEach(c => forEachSide(c, (nb, nc) => {
                if (!isSide(nb) && clist.includes(nc)) {
                    add_link(nb);
                }
            }));
        }
    });
    cset = new Set();
    forEachCell(cell => {
        let clist = [];
        if (cset.has(cell)) { return; }
        let dfs = function (c) {
            if (clist.includes(c)) { return; }
            clist.push(c);
            cset.add(c);
            forEachSide(c, (nb, nc) => {
                if (isLink(nb) && c.ques === nc.ques) {
                    dfs(nc);
                }
            });
        };
        dfs(cell);
        if (clist.every(c => adjlist(c.adjborder, c.adjacent).every(([nb, nc]) => isLink(nb) || isSide(nb) || nc.isnull || c.ques !== nc.ques))) {
            let oclist = [], olclist = [];
            clist.forEach(c => forEachSide(c, (nb, nc) => {
                if (!isSide(nb) && !nc.isnull && c.ques !== nc.ques) {
                    oclist.push(nc);
                    if (isLink(nb)) {
                        olclist.push(nc);
                    }
                }
            }));
            if (olclist.length !== 0) {
                oclist = [olclist[0]];
            }
            let cand = clist.flatMap((cc) => {
                let r = [clist.map(c => [c.bx - cc.bx, c.by - cc.by])];
                r = [...r, ...r.map(l => l.map(([x, y]) => [-y, x]))];
                r = [...r, ...r.map(l => l.map(([x, y]) => [-x, y]))];
                r = [...r, ...r.map(l => l.map(([x, y]) => [x, -y]))];
                r = r.flatMap(l => oclist.map(oc => l.map(([x, y]) => board.getc(oc.bx + x, oc.by + y))));
                r = r.filter(l => l.every(c => !c.isnull && c.ques !== cell.ques && (c.qnum === CQNUM.none || c.qnum === clist.length) && !adjlist(c.adjborder, c.adjacent).some(([nb, nc]) => isLink(nb) && !l.includes(nc) && !clist.includes(nc) || isSide(nb) && l.includes(nc))));
                if (olclist.length !== 0) {
                    r = r.filter(l => olclist.every(c => l.includes(c)));
                }
                return r;
            });
            if (cand.length > 0) {
                let icset = new Set([...cand.reduce((a, b) => a.filter(c => b.includes(c))), ...clist]);
                let ucset = new Set(cand.flat());
                Array.from(icset).forEach(c => forEachSide(c, (nb, nc) => {
                    if (icset.has(nc)) { add_link(nb); }
                    if (!icset.has(nc) && !ucset.has(nc)) { add_side(nb); }
                }));
            }
        }
    });
}

function MyopiaAssist() {
    SingleLoopInBorder();
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none) {
            if (cell.qnum === 15 && board.linegraph.components.length > 0 && adjlist(cell.adjborder).every(b => !isLine(b))) {
                forEachSide(cell, (nb, nc) => add_cross(nb));
            }
            let arr = [0b0001, 0b0100, 0b0010, 0b1000].map(n => (cell.qnum & n) !== 0);
            let dist = [];
            for (let di = 0.5; di < Math.min(board.rows, board.cols); di++) {
                let temp = [0, 1, 2, 3].map(n => offset(cell, 0, -di, n));
                if (temp.some((b, i) => b.isnull && arr[i])) { break; }
                if (temp.some((b, i) => isLine(b) && !arr[i])) { break; }
                if (temp.every((b, i) => !arr[i] || !b.isnull && !isCross(b))) {
                    dist.push(di);
                }
                if (temp.some((b, i) => isLine(b) && arr[i])) { break; }
            }
            let l = Math.min(...dist, board.rows, board.cols);
            for (let di = 0.5; di <= l; di++) {
                let temp = [0, 1, 2, 3].map(n => offset(cell, 0, -di, n));
                temp.forEach((b, i) => {
                    if (di < l || !arr[i]) {
                        add_cross(b);
                    }
                    if (dist.length === 1 && di === l && arr[i]) {
                        add_line(b);
                    }
                });
            }
        }
    });
}

function PutteriaAssist() {
    forEachCell(cell => {
        if (cell.qnum === CQNUM.quesmark) { add_dot(cell); }
        if (cell.qnum !== CQNUM.quesmark && cell.qnum !== CQNUM.none) { add_number(cell, cell.qnum); }
        if (cell.anum !== CANUM.none) { forEachSide(cell, (nb, nc) => { add_dot(nc); }); }
        // 2 2    2·2
        // 2 2 -> 2·2
        for (let d = 0; d < 4; d++) {
            let list = [cell, offset(cell, 0, 1, d), offset(cell, 2, 0, d), offset(cell, 2, 1, d)];
            if (list.every(c => !c.isnull && c.room.clist.length === 2)) {
                add_dot(offset(cell, 1, 0, d));
                add_dot(offset(cell, 1, 1, d));
            }
        }
    });
    forEachRoom(room => {
        let clist = Array.from(room.clist).filter(c => c.qsub !== CQSUB.dot && c.qnum !== CQNUM.quesmark);
        if (clist.some(c => c.anum !== CANUM.none)) {
            clist.forEach(c => add_dot(c));
        }
        if (clist.length === 1) {
            add_number(clist[0], room.clist.length);
            return;
        }
        if (clist.length === 2) {
            for (let d = 0; d < 4; d++) {
                if (offset(clist[0], 1, 1, d) === clist[1]) {
                    add_dot(offset(clist[0], 0, 1, d));
                    add_dot(offset(clist[0], 1, 0, d));
                }
                if (offset(clist[0], 2, 0, d) === clist[1]) {
                    add_dot(offset(clist[0], 1, 0, d));
                }
            }
        }
        if (clist.length > 0 && clist.every(c => c.bx === clist[0].bx)) {
            for (let j = 0; j < board.rows; j++) {
                let ac = board.getc(clist[0].bx, j * 2 + 1);
                if (ac.room !== room && ac.room.clist.length === room.clist.length) {
                    add_dot(ac);
                }
            }
        }
        if (clist.length > 0 && clist.every(c => c.by === clist[0].by)) {
            for (let i = 0; i < board.cols; i++) {
                let ac = board.getc(i * 2 + 1, clist[0].by);
                if (ac.room !== room && ac.room.clist.length === room.clist.length) {
                    add_dot(ac);
                }
            }
        }
    });
    let fn = function (clist) {
        let set = new Set();
        clist.forEach(cell => {
            if (cell.anum !== CANUM.none) {
                set.add(cell.anum);
            }
        });
        clist.forEach(cell => {
            if (set.has(cell.room.clist.length)) {
                add_dot(cell);
            }
        });
    }
    for (let i = 0; i < board.cols; i++) {
        let clist = [];
        for (let j = 0; j < board.rows; j++) {
            clist.push(board.getc(i * 2 + 1, j * 2 + 1));
        }
        fn(clist);
    }
    for (let j = 0; j < board.rows; j++) {
        let clist = [];
        for (let i = 0; i < board.cols; i++) {
            clist.push(board.getc(i * 2 + 1, j * 2 + 1));
        }
        fn(clist);
    }
}

function SymmetryAreaAssist() {
    FillominoAssist();
    let isSymmetric = l => {
        if (l.length < 3) { return true; }
        let mx = 0, my = 0;
        l.forEach(c => { mx += c.bx; my += c.by; });
        mx /= l.length; my /= l.length;
        if (mx % 1 !== 0 || my % 1 !== 0) { return false; }
        return l.every(c => l.includes(board.getc(mx * 2 - c.bx, my * 2 - c.by)));
    };
    forEachCell(cell => {
        let clist = getCellChunk(cell, (c, nb, nc) => isLink(nb));
        clist.forEach(c => add_candidate_L4(c, [0, 1, 2, 3].map(n => n + clist.length)));
        let oclist = [];
        clist.forEach(c => forEachSide(c, (nb, nc) => !nc.isnull && !isSide(nb) && !isLink(nb) && !clist.includes(nc) ? oclist.push(nc) : undefined));
        oclist = unique(oclist);
        if (oclist.length === 1 && !isSymmetric(clist)) {
            forEachSide(oclist[0], (nb, nc) => clist.includes(nc) ? add_link(nb) : undefined);
        }
        if (cell.anum === clist.length + 1) {
            oclist.forEach(c => {
                if (isSymmetric([c, ...clist])) { return; }
                forEachSide(c, (nb, nc) => clist.includes(nc) ? add_side(nb) : undefined);
            });
        }
        for (let d = 0; d < 4; d++) {
            if ([[0, -.5], [1, -.5], [1.5, 0], [1.5, 1], [1, 1.5], [0, 1.5], [-.5, 1], [-.5, 0]].every(([x, y]) => isntLink(offset(cell, x, y, d))) && !offset(cell, 1, 1, d).isnull) {
                add_number(cell, 4);
            }
        }
    });
    // https://oeis.org/A144554
    let getPolyomino = n => genPolyomino(n).filter(l => {
        if (l.length < 3) { return true; }
        l = l.map(p => [p[0] * 2, p[1] * 2]);
        let mx = 0, my = 0;
        l.forEach(p => { mx += p[0]; my += p[1]; });
        mx /= l.length; my /= l.length;
        if (mx % 1 !== 0 || my % 1 !== 0) { return false; }
        return l.every(p => l.some(p2 => p[0] + p2[0] === mx * 2 && p[1] + p2[1] === my * 2));
    });
    forEachCell(cell => {
        if (cell.anum === CANUM.none || cell.anum >= 10) { return; } // 10 is too large to run
        let n = cell.anum;
        let linklist = [], sidelist = [], namelist = [];
        getPolyomino(n).forEach(cl => {
            getComb([[0, 1, 2, 3], [1, -1], [...Array(n).keys()]]).forEach(([d, f, o]) => {
                let clist = cl.map(([x, y]) => offset(cell, x - cl[o][0], (y - cl[o][1]) * f, d));
                if (clist.some(c => c.isnull || (c.anum !== CANUM.none && c.anum !== n))) { return; }
                if (clist.some(c => adjlist(c.adjborder, c.adjacent).some(([nb, nc]) => {
                    if (nc.isnull) { return false; }
                    if (isLink(nb) && !clist.includes(nc) || isSide(nb) && clist.includes(nc)) { return true; }
                    if (!clist.includes(nc) && nc.anum === n) { return true; }
                    return false;
                }))) { return; }
                let linkl = [], sidel = [];
                clist.forEach(c => forEachSide(c, (nb, nc) => {
                    if (clist.includes(nc) && !linkl.includes(nb)) { linkl.push(nb); }
                    if (!clist.includes(nc) && !sidel.includes(nb)) { sidel.push(nb); }
                }));
                linklist.push(linkl);
                sidelist.push(sidel);
            });
        });
        if (linklist.length > 0) { linklist = linklist.reduce((a, b) => a.filter(i => b.includes(i))); }
        if (sidelist.length > 0) { sidelist = sidelist.reduce((a, b) => a.filter(i => b.includes(i))); }
        linklist.forEach(b => add_link(b));
        sidelist.forEach(b => add_side(b));
    });
}

function FillominoAssist() {
    let isNable = (c, n) => {
        if (c.isnull) { return false; }
        if (c.anum !== CANUM.none) { return c.anum === n; }
        if (c.snum.every(n => n === -1)) { return true; }
        if (c.snum.includes(-1)) { return c.snum.includes(n); }
        if (!c.snum.includes(n) && c.snum.some(nn => nn > n)) { return false; }
        if (adjlist(c.adjborder, c.adjacent).some(([nb, nc]) => isSide(nb) && nc.anum === n)) { return false; }
        return true;
    };
    SizeRegion_Border({
        isGroupable: (sc, c) => isNable(c, sc.anum),
        hasAnum: true,
    });
    let remove_cand = (c, m) => {
        let l = c.snum.filter(n => n !== m);
        if (!c.snum.includes(-1)) { l.push(Math.max(...c.snum) + 1); }
        add_candidate_L4(c, l);
    }
    let cset = new Set();
    forEachCell(cell => {
        if (isNum(cell)) { add_number(cell, cell.qnum); }
        if (cset.has(cell) || cell.anum !== CANUM.none) { return; }
        let clist = getCellChunk(cell, (c, nb, nc) => !isSide(nb) && nc.anum === CANUM.none);
        let cand = new Set(Array(clist.length).fill(0).map((_, i) => i + 1));
        clist.forEach(c => forEachSide(c, (nb, nc) => {
            if (!isSide(nb) && nc.anum !== CANUM.none) { cand.add(nc.anum); }
        }));
        cand = Array.from(cand);
        clist.forEach(c => {
            cset.add(c);
            let l = cand.filter(n => isNable(c, n));
            add_candidate_L4(c, l);
        });
    });
    forEachCell(cell => {
        if (cell.snum.every(n => n === -1) && cell.anum === CANUM.none) { add_candidate_L4(cell, [1, 2, 3, 4]); }
        forEachSide(cell, (nb, nc) => {
            if (isLink(nb)) { add_candidate_L4(cell, nc.snum); }
            if (isSide(nb) && nc.anum !== CANUM.none && cell.snum.includes(nc.anum)) {
                remove_cand(cell, nc.anum);
            }
            if (cell.anum !== CANUM.none && !isNable(nc, cell.anum)) { add_side(nb); }
            if (cell.snum.includes(-1) && !cell.snum.every(n => n === -1) && cell.snum.every(n => n === -1 || !isNable(nc, n))) { add_side(nb); }
        });
        if (cell.anum !== CANUM.none) {
            forEachSide(cell, (nb, nc) => {
                if (nb.isnull || nc.isnull) { return; }
                if (nc.anum === cell.anum) { add_link(nb); }
                if (nc.anum !== CANUM.none && nc.anum !== cell.anum) { add_side(nb); }
                if (nb.qsub === BQSUB.link) { add_number(nc, cell.anum); }
            });
            let clist = getCellChunk(cell, (c, nb, nc) => !isSide(nb) && !nc.isnull && (nc.anum === cell.anum || nc.anum === CANUM.none));
            if (clist.length === cell.anum) {
                clist.forEach(c => add_number(c, cell.anum));
            }
        }
        // finished region or only one place to extend
        {
            let clist = getCellChunk(cell, (c, nb, nc) => isLink(nb));
            clist.forEach(c => add_candidate_L4(c, [0, 1, 2, 3].map(n => n + clist.length)));
            let oclist = [];
            clist.forEach(c => forEachSide(c, (nb, nc) => !nc.isnull && !isSide(nb) && !isLink(nb) && !clist.includes(nc) ? oclist.push(nc) : undefined));
            oclist = unique(oclist);
            if (oclist.length === 0) {
                clist.forEach(c => add_number(c, clist.length));
            }
            if (oclist.length === 1 && !isNable(cell, clist.length)) {
                forEachSide(oclist[0], (nb, nc) => clist.includes(nc) ? add_link(nb) : undefined);
            }
            if (oclist.length === 2 && cell.anum === clist.length + 1) {
                let c = adjlist(oclist[0].adjacent).find(c => !clist.includes(c) && adjlist(oclist[1].adjacent).includes(c));
                if (c !== undefined) { remove_cand(c, cell.anum); }
            }
        }
        // connecting two regions overflow the clues
        if (cell.anum === CANUM.none) {
            let temp = adjlist(cell.adjborder, cell.adjacent);
            temp = temp.filter(([nb, nc]) => !nb.isnull && !isSide(nb) && !nc.isnull && nc.anum !== CANUM.none);
            temp = temp.map(([nb, nc]) => nc.anum);
            temp.forEach(n => {
                if (temp.filter(nn => nn === n).length <= 1) { return; }
                let clist = getCellChunk(cell, (c, nb, nc) => nc.anum === n);
                if (clist.length > n) {
                    forEachSide(cell, (nb, nc) => {
                        if (!nc.isnull && nc.anum === n) { add_side(nb); }
                    });
                }
            })
        }
        if (cell.anum === CANUM.none) {
            let l = [...cell.snum];
            l.forEach(n => {
                if (n < 2) { return; }
                if (adjlist(cell.adjacent).every(c => !isNable(c, n))) { remove_cand(cell, n); }
            });
        }
        for (let d = 0; d < 4; d++) {
            // Link in the middle of a size 2 region
            if ([[-.5, 0], [0, -.5], [0, .5]].every(([x, y]) => isntLink(offset(cell, x, y, d)))) {
                remove_cand(offset(cell, 1, 0, d), 1);
            }
            // Link in the middle of a size 4 region
            if (!isSide(offset(cell, .5, 0, d)) && !offset(cell, 1, 0, d).isnull) {
                let f = (c, d) => {
                    if (!offset(c, 0, -1, d).isnull && [[.5, -1], [0, -1.5], [-.5, -1], [-.5, 0], [0, .5]].every(([x, y]) => isntLink(offset(c, x, y, d)))) { return true; }
                    if (!offset(c, -1, 0, d).isnull && [[0, -.5], [-1, -.5], [-1.5, 0], [-1, .5], [0, .5]].every(([x, y]) => isntLink(offset(c, x, y, d)))) { return true; }
                    if (!offset(c, 0, 1, d).isnull && [[0, -.5], [-.5, 0], [-.5, 1], [0, 1.5], [.5, 1]].every(([x, y]) => isntLink(offset(c, x, y, d)))) { return true; }
                };
                if (f(cell, d) && f(offset(cell, 1, 0, d), (d + 2) % 4)) { add_link(offset(cell, .5, 0, d)); }
            }
            if ([[0, -.5], [-.5, 0], [1.5, 1], [1, 1.5]].every(([x, y]) => isntLink(offset(cell, x, y, d))) && cell.anum > 1 && offset(cell, 1, 1, d).anum > 1 && cell.anum !== offset(cell, 1, 1, d).anum) {
                add_candidate_L4(offset(cell, 1, 0, d), [cell.anum, offset(cell, 1, 1, d).anum]);
                add_candidate_L4(offset(cell, 0, 1, d), [cell.anum, offset(cell, 1, 1, d).anum]);
            }
        }
    });
}

function NawabariAssist() {
    RectRegion_Border({
        isSizeAble: (w, h, sc, c) => {
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    if (offset(c, i, j).qnum === CQNUM.none) { continue; }
                    if (sc !== null && sc !== offset(c, i, j)) { return false; }
                    sc = offset(c, i, j);
                }
            }
            if (sc === null) { return false; }
            let sn = 0;
            sn += (c.bx === sc.bx ? 1 : 0);
            sn += (c.by === sc.by ? 1 : 0);
            sn += (c.bx + (w - 1) * 2 === sc.bx ? 1 : 0);
            sn += (c.by + (h - 1) * 2 === sc.by ? 1 : 0);
            return sc.qnum === CQNUM.quesmark || sc.qnum === sn;
        }
    });
}

function BarnsAssist() {
    SingleLoopInCell({
        isPass: c => true,
        isPathable: b => !b.isnull && !b.ques && !isCross(b),
    });
}

function SkyscrapersAssist() {
    forEachCell(cell => cell.qnum !== CQNUM.none ? add_number(cell, cell.qnum) : undefined);
    let size = Math.max(board.rows, board.cols);
    LatinSquare();
    let arr = () => Array(size).fill().map((_, i) => i + 1);
    let fn = function (clist, n1, n2) {
        let cands = clist.map(c => c.anum !== -1 ? [c.anum] : c.snum.some(n => n !== -1) ? c.snum.filter(n => n !== -1) : arr());
        if (n1 > 1) {
            for (let i = 1; i < n1; i++) {
                cands[i - 1] = cands[i - 1].filter(n => n <= size - n1 + i);
            }
        }
        if (n1 === 1) { cands[0] = [size]; }
        if (n2 > 1) {
            for (let i = 1; i < n2; i++) {
                cands[size - i] = cands[size - i].filter(n => n <= size - n2 + i);
            }
        }
        if (n2 === 1) { cands[size - 1] = [size]; }
        if (size <= 9) {
            let cc = Array(size).fill().map((_, i) => new Set());
            let dfs = function (i, a) {
                if (i === size) {
                    if (n1 !== -1 && n1 !== a.reduce(([h, c], n) => h < n ? [n, c + 1] : [h, c], [0, 0])[1]) { return; }
                    if (n2 !== -1 && n2 !== [...a].reverse().reduce(([h, c], n) => h < n ? [n, c + 1] : [h, c], [0, 0])[1]) { return; }
                    a.forEach((n, i) => cc[i].add(n));
                    return;
                }
                cands[i].forEach(n => {
                    if (a.includes(n)) { return; }
                    dfs(i + 1, [...a, n]);
                });
            }
            dfs(0, []);
            cands = cc.map(set => Array.from(set));
        }
        clist.forEach((c, i) => add_candidate(c, cands[i]));
    }
    for (let i = 1; i < size * 2; i += 2) {
        let row = [], col = [];
        for (let j = 1; j < size * 2; j += 2) {
            row.push(board.getc(j, i));
            col.push(board.getc(i, j));
        }
        fn(row, board.getex(-1, i).qnum, board.getex(size * 2 + 1, i).qnum);
        fn(col, board.getex(i, -1).qnum, board.getex(i, size * 2 + 1).qnum);
    }
}

function MinarismAssist() {
    forEachCell(cell => cell.qnum !== CQNUM.none ? add_number(cell, cell.qnum) : undefined);
    let size = Math.max(board.rows, board.cols);
    LatinSquare({
        ext: (cell, cand) => {
            let arr = () => Array(size).fill().map((_, i) => i + 1);
            for (let d = 0; d < 4; d++) {
                if (offset(cell, .5, 0, d).isnull) { continue; }
                let ncell = offset(cell, 1, 0, d);
                let nlist = ncell.snum.filter(n => n !== -1);
                if (nlist.length === 0) { nlist = arr(); }
                if (ncell.anum !== -1) { nlist = [ncell.anum]; }
                if (offset(cell, .5, 0, d).qnum !== BQNUM.none) {
                    let dt = offset(cell, .5, 0, d).qnum;
                    cand = cand.filter(n => nlist.includes(n - dt) || nlist.includes(n + dt));
                }
                if ([4, 1, 3, 2][d] === offset(cell, .5, 0, d).qdir) {
                    cand = cand.filter(n => nlist.some(m => n > m));
                }
                if ([3, 2, 4, 1][d] === offset(cell, .5, 0, d).qdir) {
                    cand = cand.filter(n => nlist.some(m => n < m));
                }
            }
            return cand;
        }
    });
}

function KropkiAssist() {
    let size = Math.max(board.rows, board.cols);
    LatinSquare({
        ext: (cell, cand) => {
            let arr = () => Array(size).fill().map((_, i) => i + 1);
            for (let d = 0; d < 4; d++) {
                if (offset(cell, .5, 0, d).isnull) { continue; }
                let ncell = offset(cell, 1, 0, d);
                let nlist = ncell.snum.filter(n => n !== -1);
                if (nlist.length === 0) { nlist = arr(); }
                if (ncell.anum !== -1) { nlist = [ncell.anum]; }
                if (offset(cell, .5, 0, d).qnum === BQNUM.wcir) {
                    cand = cand.filter(n => nlist.includes(n - 1) || nlist.includes(n + 1));
                }
                if (offset(cell, .5, 0, d).qnum === BQNUM.bcir) {
                    cand = cand.filter(n => nlist.includes(n / 2) || nlist.includes(n * 2));
                }
                if (offset(cell, .5, 0, d).qnum === BQNUM.none) {
                    cand = cand.filter(n => nlist.some(m => ![n, n - 1, n + 1, n / 2, n * 2].includes(m)));
                }
            }
            return cand;
        }
    });
}

function MidloopAssist() {
    SingleLoopInCell({
        isPass: c => c.qnum === CQNUM.bcir,
    });
    let isDot = c => !c.isnull && c.qnum === CQNUM.bcir;
    forEachCell(cell => {
        for (let d = 0; d < 4; d++) {
            if (isDot(cell) && offset(cell, .5, .5, d).qsub !== CRQSUB.none) {
                add_inout(offset(cell, -.5, -.5, d), offset(cell, .5, .5, d).qsub ^ 1);
            }
        }
    });
    let isSegmentAble = function (c, l, d) {
        if (c.isnull || offset(c, l, 0, d).isnull) { return false; }
        if (isLine(offset(c, -.5, 0, d)) || isLine(offset(c, l + .5, 0, d))) { return false; }
        if (isntLine(offset(c, 0, -.5, d)) && isntLine(offset(c, 0, +.5, d))) { return false; }
        if (isntLine(offset(c, l, -.5, d)) && isntLine(offset(c, l, +.5, d))) { return false; }
        for (let i = 0; i < l; i++) {
            if (isntLine(offset(c, i + .5, 0, d))) { return false; }
            if (i > 0 && (isLine(offset(c, i, -.5, d)) || isLine(offset(c, i, +.5, d)))) { return false; }
        }
        for (let i = 0; i <= l; i += .5) {
            if (i * 2 !== l && isDot(offset(c, i, 0, d))) { return false; }
        }
        return true;
    }
    for (let j = board.minby + 1; j <= board.maxby - 1; j++) {
        for (let i = board.minbx + 1; i <= board.maxbx - 1; i++) {
            let obj = board.getobj(i, j);
            if (!isDot(obj)) { continue; }
            if (i % 2 === 0 && j % 2 === 0) { continue; }
            if (i % 2 === 0 || j % 2 === 0) {
                add_line(obj);
                let d = (i % 2 === 0 ? 0 : 1);
                let cand = Array(Math.max(board.rows, board.cols)).fill(0).map((_, i) => i);
                cand = cand.filter(i => isSegmentAble(offset(obj, -i - .5, 0, d), i * 2 + 1, d));
                if (cand.length === 0) { continue; }
                let t = Math.min(...cand);
                for (let i = 1; i <= t; i++) {
                    add_line(offset(obj, -i, 0, d));
                    add_line(offset(obj, +i, 0, d));
                }
                if (cand.length === 1) {
                    add_cross(offset(obj, -t - 1, 0, d));
                    add_cross(offset(obj, +t + 1, 0, d));
                }
            }
            if (i % 2 === 1 && j % 2 === 1) {
                let candh = Array(board.cols).fill(0).map((_, i) => i + 1);
                let candv = Array(board.rows).fill(0).map((_, i) => i + 1);
                candh = candh.filter(i => isSegmentAble(offset(obj, -i, 0, 0), i * 2, 0));
                candv = candv.filter(i => isSegmentAble(offset(obj, -i, 0, 1), i * 2, 1));
                let d = -1, cand = [];
                if (candh.length === 0) {
                    add_line(offset(obj, 0, -.5));
                    add_line(offset(obj, 0, +.5));
                    d = 1;
                    cand = candv;
                }
                if (candv.length === 0) {
                    add_line(offset(obj, -.5, 0));
                    add_line(offset(obj, +.5, 0));
                    d = 0;
                    cand = candh;
                }
                if (d !== -1) {
                    if (cand.length === 0) { continue; }
                    let t = Math.min(...cand);
                    for (let i = 0; i < t; i++) {
                        add_line(offset(obj, -i - .5, 0, d));
                        add_line(offset(obj, +i + .5, 0, d));
                    }
                    if (cand.length === 1) {
                        add_cross(offset(obj, -t - .5, 0, d));
                        add_cross(offset(obj, +t + .5, 0, d));
                    }
                }
            }
        }
    }
}

function LoopSpecialAssist() {
    forEachCell(cell => {
        // 11:╋; 12:┃; 13:━; 14:┗; 15:┛; 16:┓; 17:┏
        const tmp = [   // ques, r, u, l, d, r
            [11, 1, 1, 1, 1],
            [12, 0, 1, 0, 1],
            [13, 1, 0, 1, 0],
            [14, 1, 1, 0, 0],
            [15, 0, 1, 1, 0],
            [16, 0, 0, 1, 1],
            [17, 1, 0, 0, 1],
        ];
        if (cell.ques === CQUES.none) { return; }
        adjlist(cell.adjborder).forEach((b, i) => tmp[cell.ques - 11][i + 1] === 1 ? add_line(b) : add_cross(b));
    });
    forEachCell(cell => {
        let lcnt = cell.lcnt;
        let ccnt = adjlist(cell.adjborder).filter(b => b.isnull || isCross(b)).length;
        if (lcnt === 3 || ccnt === 2) {
            forEachSide(cell, (nb, nc) => add_line(nb));
        }
        if (lcnt === 2 && (ccnt === 1 || isClue(cell))) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }

    });
}

function PipelinkAssist() {
    SingleLoopInCell({ isPass: c => true, hasCross: true });
    forEachCell(cell => {
        // 11:╋; 12:┃; 13:━; 14:┗; 15:┛; 16:┓; 17:┏
        const tmp = [   // ques, r, u, l, d, r
            [11, 1, 1, 1, 1],
            [12, 0, 1, 0, 1],
            [13, 1, 0, 1, 0],
            [14, 1, 1, 0, 0],
            [15, 0, 1, 1, 0],
            [16, 0, 0, 1, 1],
            [17, 1, 0, 0, 1],
        ];
        if (cell.ques === CQUES.none) { return; }
        adjlist(cell.adjborder).forEach((b, i) => tmp[cell.ques - 11][i + 1] === 1 ? add_line(b) : add_cross(b));
    });
    forEachCell(cell => {
        let list = adjlist(cell.adjborder);
        let linecnt = list.filter(b => !b.isnull && isLine(b)).length;
        let crosscnt = list.filter(b => b.isnull || isCross(b)).length;
        if (linecnt === 3 || crosscnt === 2) {
            forEachSide(cell, (nb, nc) => add_line(nb));
        }
        if (linecnt === 2 && crosscnt === 1) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        for (let d = 0; d < 4; d++) {
            if (!isLine(offset(cell, .5, 0, d)) || isLine(offset(cell, -.5, 0, d))) { continue; }
            let dd = d;
            let pcell = offset(cell, 1, 0, dd);
            while (pcell !== cell) {
                if (!isLine(offset(pcell, 0.5, 0, dd))) {
                    if ((b => !b.isnull && !isCross(b))(offset(pcell, .5, 0, dd))) { break; }
                    if (isLine(offset(pcell, .5, 0, dd - 1)) === isLine(offset(pcell, .5, 0, dd + 1))) { break; }
                    dd = (isLine(offset(pcell, .5, 0, dd - 1)) ? dd + 3 : dd + 1) % 4;
                }
                pcell = offset(pcell, 1, 0, dd);
            }
            if (pcell === cell && board.linegraph.components.length > 1) {
                forEachSide(cell, (nb, nc) => add_line(nb));
            }
            if ((adjlist(cell.adjborder).some(b => isntLine(b)) || dd === d) && board.linegraph.components.length > 1
                && (b => !b.isnull && !isCross(b))(offset(pcell, .5, 0, dd))) {
                pcell = offset(pcell, 1, 0, dd);
                while (pcell !== cell && isLine(offset(pcell, .5, 0, dd))) { pcell = offset(pcell, 1, 0, dd); }
                if (pcell === cell) { add_cross(offset(pcell, -.5, 0, dd)); }
            }
        }
    });
}

function RingringAssist() {
    let isWall = c => c.ques === 1;
    forEachCell(cell => {
        if (isWall(cell)) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        if (cell.lcnt === 3) {
            forEachSide(cell, (nb, nc) => add_line(nb));
        }
        if (cell.lcnt === 2 && adjlist(cell.adjborder).some(b => isntLine(b))) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        let templist = adjlist(cell.adjborder, cell.adjacent);
        templist = templist.filter(([nb, nc]) => !(nc.isnull || isWall(nc) || isCross(nb)));
        if (templist.length === 2) {
            templist.forEach(([nb, nc]) => add_line(nb));
        }
    });
    // make the right turning
    forEachCell(cell => {
        for (let d = 0; d < 4; d++) {
            if (!isLine(offset(cell, 0, -.5, d)) || !isLine(offset(cell, -.5, 0, d))) { continue; }
            if (!isntLine(offset(cell, 0, .5, d))) { continue; }
            let pcell = cell;
            while (isLine(offset(pcell, 0, -.5, d))) {
                pcell = offset(pcell, 0, -1, d);
                if (isntLine(offset(pcell, 0, -.5, d))) {
                    add_line(offset(pcell, -.5, 0, d));
                    add_cross(offset(pcell, .5, 0, d));
                    break;
                }
                if (isLine(offset(pcell, .5, 0, d))) {
                    forEachSide(pcell, (nb, nc) => add_line(nb));
                }
            }
        }
        for (let d = 0; d < 4; d++) {
            if (!isLine(offset(cell, 0, -.5, d)) || !isLine(offset(cell, .5, 0, d))) { continue; }
            if (!isntLine(offset(cell, 0, .5, d))) { continue; }
            let pcell = cell;
            while (isLine(offset(pcell, 0, -.5, d))) {
                pcell = offset(pcell, 0, -1, d);
                if (isntLine(offset(pcell, 0, -.5, d))) {
                    add_line(offset(pcell, .5, 0, d));
                    add_cross(offset(pcell, -.5, 0, d));
                    break;
                }
                if (isLine(offset(pcell, -.5, 0, d))) {
                    forEachSide(pcell, (nb, nc) => add_line(nb));
                }
            }
        }
    });
    forEachCell(cell => {
        for (let d = 0; d < 4; d++) {
            if (!isLine(offset(cell, 0, .5, d)) || !isLine(offset(cell, .5, 0, d))) { continue; }
            if (!isntLine(offset(cell, 0, -.5, d)) && !isntLine(offset(cell, -.5, 0, d))) { continue; }
            let h = 1, w = 1;
            while (isLine(offset(cell, 0, h + .5, d))) { h++; }
            while (isLine(offset(cell, w + .5, 0, d))) { w++; }
            let fg = false;
            do {
                fg = false;
                for (let i = 1; i <= h; i++) {
                    while (isWall(offset(cell, w, i, d)) || offset(cell, w, i - .5, d).qsub === BQSUB.cross) {
                        add_line(offset(cell, w + .5, 0, d));
                        w++;
                        fg = true;
                    }
                }
                for (let i = 1; i <= w; i++) {
                    while (isWall(offset(cell, i, h, d)) || offset(cell, i - .5, h, d).qsub === BQSUB.cross) {
                        add_line(offset(cell, 0, h + .5, d));
                        h++;
                        fg = true;
                    }
                }
            } while (fg);
            if (isntLine(offset(cell, w + .5, 0, d))) {
                for (let i = 1; i <= h; i++) {
                    add_line(offset(cell, w, i - .5, d));
                }
                if (isntLine(offset(cell, 0, h + .5, d)) || isntLine(offset(cell, w, h + .5, d))) {
                    add_cross(offset(cell, 0, h + .5, d));
                    add_cross(offset(cell, w, h + .5, d));
                }
            }
            if (isntLine(offset(cell, 0, h + .5, d))) {
                for (let i = 1; i <= w; i++) {
                    add_line(offset(cell, i - .5, h, d));
                }
                if (isntLine(offset(cell, w + .5, 0, d)) || isntLine(offset(cell, w + .5, h, d))) {
                    add_cross(offset(cell, w + .5, 0, d));
                    add_cross(offset(cell, w + .5, h, d));
                }
            }
        }
    });
}

function NonogramAssist() {
    // deduce each clue
    let f = function (ncl, cl) {
        let nl = ncl.map(c => c.qnum);
        while (cl[0] && isDot(cl[0])) { cl.shift(); }
        while (cl[cl.length - 1] && isDot(cl[cl.length - 1])) { cl.pop(); }
        let len = cl.length;
        let ll = new Array(nl.length);  // the farthest startpoint of each clue
        ll[ll.length - 1] = len - nl[ll.length - 1];
        for (let i = ll.length - 2; i >= 0; i--) {
            ll[i] = ll[i + 1] - nl[i] - 1;
        }
        let dcnt = new Array(len);
        let bcnt = new Array(len);
        for (let i = 0; i < len; i++) {
            dcnt[i] = (dcnt[i - 1] ?? 0) + (isDot(cl[i]) ? 1 : 0);
            bcnt[i] = (bcnt[i - 1] ?? 0) + (isBlack(cl[i]) ? 1 : 0);
        }
        {   // deduce the first clue
            let l1 = [];    // possible startpoints of the first clue
            for (let i = 0; i <= ll[0]; i++) {
                if (i + nl[0] < len && isBlack(cl[i + nl[0]])) { continue; }
                if ((bcnt[i - 1] ?? 0) !== 0) { break; }
                if (dcnt[i + nl[0] - 1] !== (dcnt[i - 1] ?? 0)) { continue; }
                l1.push(i);
            }
            for (let i = 0; i < l1[0]; i++) { add_dot(cl[i]); }
            for (let i = l1[l1.length - 1]; i < l1[0] + nl[0]; i++) { add_black(cl[i]); }
            if (l1.length === 1) { ncl[0].setQcmp(1); }
            if (l1.length === 1 && l1[0] + nl[0] < cl.length) {
                add_dot(cl[l1[0] + nl[0]]);
                f(ncl.slice(1), cl.slice(l1[0] + nl[0] + 1));
                return;
            }
        }
        let res = [];
        const MAXSIT = 1000;
        let gen = function (n = 0, l = []) {
            if (res.length > MAXSIT) { return; }
            if (n === nl.length) {
                if (l.length > len) { l = l.slice(0, len); }
                if (l.length > 0 && bcnt[len - 1] > bcnt[l.length - 1]) { return; }
                if (l.length < len) { l = [...l, ...Array(len - l.length).fill(0)]; }
                res.push(l);
                return;
            }
            for (let i = l.length; i <= ll[n]; i++) {
                if (i + nl[n] < len && cl[i + nl[n]].qans) { continue; }
                if ((bcnt[i - 1] ?? 0) !== (bcnt[l.length - 1] ?? 0)) { break; }
                if (dcnt[i + nl[n] - 1] !== (dcnt[i - 1] ?? 0)) { continue; }
                gen(n + 1, [...l, ...Array(i - l.length).fill(0), ...Array(nl[n]).fill(1), 0]);
                if (res.length > MAXSIT) { return; }
            }
        };
        gen();
        if (res.length === 0 || res.length > MAXSIT) { return; }
        for (let i = 0; i < len; i++) {
            if (res.every(l => l[i] === res[0][i])) {
                if (res[0][i] === 0) { add_dot(cl[i]); }
                if (res[0][i] === 1) { add_black(cl[i]); }
            }
        }
    };
    for (let i = 0; i < board.rows; i++) {
        let ncl = [], cl = [];
        for (let j = board.minbx + 1; j <= -1; j += 2) { ncl.push(board.getex(j, i * 2 + 1)); }
        for (let j = 0; j < board.cols; j++) { cl.push(board.getc(j * 2 + 1, i * 2 + 1)); }
        ncl = ncl.filter(c => c.qnum >= 0);
        f(ncl, cl);
        ncl.reverse();
        cl.reverse();
        f(ncl, cl);
    }
    for (let i = 0; i < board.cols; i++) {
        let ncl = [], cl = [];
        for (let j = board.minby + 1; j <= -1; j += 2) { ncl.push(board.getex(i * 2 + 1, j)); }
        for (let j = 0; j < board.rows; j++) { cl.push(board.getc(i * 2 + 1, j * 2 + 1)); }
        ncl = ncl.filter(c => c.qnum >= 0);
        f(ncl, cl);
        ncl.reverse();
        cl.reverse();
        f(ncl, cl);
    }
}

function SudokuAssist() {
    forEachCell(cell => cell.qnum !== CQNUM.none ? add_number(cell, cell.qnum) : undefined);
    LatinSquare({ hasBox: true });
}

function CirclesAndSquaresAssist() {
    forEachCell(c => { if (c.qnum === CQNUM.wcir) add_green(c); });
    forEachCell(c => { if (c.qnum === CQNUM.bcir) add_black(c); });
    No2x2Black();
    BlackConnected();
    RectRegion_Cell({
        isShaded: isGreen,
        isUnshaded: isBlack,
        add_shaded: add_green,
        add_unshaded: add_black,
        isSizeAble: (w, h, sc, c) => w === h,
    })
}

function TatamibariAssist() {
    RectRegion_Border({
        isSizeAble: (w, h, sc, c) => {
            if (sc !== null && !(sc.qnum === 1 && w === h || sc.qnum === 2 && w < h || sc.qnum === 3 && w > h)) { return false; }
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    if (sc !== null && offset(c, i, j) !== sc && offset(c, i, j).qnum !== CQNUM.none) { return false; }
                    if (sc === null && offset(c, i, j).qnum !== CQNUM.none) { sc = offset(c, i, j); }
                }
            }
            if (sc === null) { return false; }
            return sc.qnum === CQNUM.quesmark || sc.qnum === 1 && w === h || sc.qnum === 2 && w < h || sc.qnum === 3 && w > h;
        }
    });
    NoCrossingBorder();
}

function PencilsAssist() {
    let add_tip = function (c, dir) {  // 0=→, 1=↑, 2=←, 3=↓
        if (c === undefined || c.isnull || isGreen(c) || c.anum !== CANUM.none) { return; }
        c.setQsub(CQSUB.yellow);
        c.setAnum([4, 1, 3, 2][dir]);
        c.setQans([4, 1, 3, 2][dir]);
        c.draw();
        stepcheck(true);
    }
    let add_cross = function (b) {
        if (b === undefined || b.isnull || isLine(b) || b.qsub !== BQSUB.none || b.qans || b.ques) { return; }
        b.setQsub(BQSUB.cross);
        b.draw();
        stepcheck(isCross(b));
    };
    forEachBorder(border => { if (isSide(border) && isCross(border)) { border.setQsub(BQSUB.none); } });
    // record cells with line that belongs to a tip
    let cllist = [];
    forEachCell(cell => {
        if (cell.anum === CANUM.none) { return; }
        cllist.push(...getCellChunk(cell, (c, nb, nc) => isLine(nb)));
    });
    let isTipAble = (c, d) => !c.isnull && !isGreen(c) && (!cllist.includes(c) || qdirRemap(c.anum) === d);
    let isTip = (c, d) => !c.isnull && c.anum !== CANUM.none && qdirRemap(c.anum) === d;
    let isPencilAble = (c, l, d) => {
        if (c.isnull || offset(c, l, 0, d).isnull) { return false; }
        if (!isTipAble(offset(c, l, 0, d), d)) { return false; }
        if (isTip(offset(c, -1, 0, d), d ^ 2)) { return false; }
        if (isCross(offset(c, -.5, 0, d)) && isGreen(offset(c, -1, 0, d)) || isCross(offset(c, l - .5, 0, d)) && isGreen(offset(c, l, 0, d))) { return false; }
        for (let i = 0; i < l; i++) {
            if (isCross(offset(c, i, -.5, d)) && isGreen(offset(c, i, -1, d)) || isCross(offset(c, i, +.5, d)) && isGreen(offset(c, i, +1, d)) || isYellow(offset(c, i, 0, d))) { return false; }
            if (offset(c, i, 0, d).qnum > 0 && offset(c, i, 0, d).qnum !== l) { return false; }
            if (i > 0 && isSide(offset(c, i - .5, 0, d))) { return false; }
        }
        return true;
    };
    forEachCell(cell => {
        if (cell.qdir !== 0) { add_tip(cell, qdirRemap(cell.qdir)); }
        if (cell.qnum !== CQNUM.none) { add_green(cell); }
        let qnum = cell.qnum;
        if (isGreen(cell) && qnum === CQNUM.none) {
            let clist = getCellChunk(cell, (c, nb, nc) => isCross(nb) && !isYellow(nc));
            if (clist.every(c => adjlist(c.adjborder, c.adjacent).every(([nb, nc]) => nc.isnull || isSide(nb) || clist.includes(nc)))) { qnum = clist.length; }
        }
        if (qnum > 0) {
            let cand = [];
            for (let d = 0; d < 4; d++) {
                for (let i = 1; i <= qnum; i++) {
                    if (isPencilAble(offset(cell, i - qnum, 0, d), qnum, d)) {
                        let l = [0, 0, 0, 0, d];
                        l[d] = i - 1;
                        l[d ^ 2] = qnum - i;
                        cand.push(l);
                    }
                }
            }
            if (cand.length === 0) { return; }
            for (let d = 0; d < 4; d++) {
                let minl = Math.min(...cand.map(l => l[d]));
                let maxl = Math.max(...cand.map(l => l[d]));
                for (let i = 0; i < minl; i++) {
                    add_green(offset(cell, i + 1, 0, d));
                    add_cross(offset(cell, i + .5, 0, d));
                    add_side(offset(cell, i + 1, -.5, d));
                    add_side(offset(cell, i + 1, +.5, d));
                }
                if (minl === maxl) {
                    add_side(offset(cell, maxl + .5, 0, d));
                }
            }
            if (cand.length === 1) {
                let d = cand[0][4], tc = offset(cell, cand[0][d] + 1, 0, d);
                add_tip(tc, d);
                if (qnum <= 10) {
                    let path = [];
                    let DFS = function (c, cl, bl) {
                        if (bl.length === qnum) { path.push(bl); return; }
                        forEachSide(c, (nb, nc) => {
                            if (isSide(nb) || isCross(nb)) { return; }
                            if (nc.isnull || isGreen(nc) || cl.includes(nc)) { return; }
                            if (cllist.includes(nc) && !isLine(nb)) { return; }
                            DFS(nc, [...cl, nc], [...bl, nb]);
                        });
                    };
                    DFS(tc, [tc], []);
                    if (path.length > 0) {
                        path[0].forEach(b => path.every(p => p.includes(b)) ? add_line(b) : null);
                    }
                }
            }
        }
        // extend to match line and pencil
        if (cell.anum !== CANUM.none) {
            add_yellow(cell);
            let d = qdirRemap(cell.anum);
            add_green(offset(cell, -1, 0, d));
            add_side(offset(cell, -.5, 0, d));
            add_side(offset(cell, -1, -.5, d));
            add_side(offset(cell, -1, +.5, d));
            let pc = cell, lc = cell, llc = cell;
            while (isCross(offset(pc, -.5, 0, d)) && !isYellow(offset(pc, -1, 0, d)) || pc === cell || lc.lcnt === 2) {
                let list = adjlist(lc.adjborder, lc.adjacent).filter(([nb, nc]) => {
                    if (nc === llc) { return false; }
                    if (nc.isnull || isGreen(nc) || nc.anum !== CANUM.none) { return false; }
                    if (cllist.includes(nc) && !isLine(nb)) { return false; }
                    if (nb.isnull || isCross(nb) || isSide(nb)) { return false; }
                    return true;
                });
                if (list.some(p => isLine(p[0]))) { list = list.filter(p => isLine(p[0])); }
                if (list.length !== 1) { break; }
                add_line(list[0][0]);
                forEachSide(lc, (nb, nc) => add_cross(nb));
                llc = lc;
                lc = list[0][1];
                add_yellow(lc);
                add_cross(offset(pc, -.5, 0, d));
                pc = offset(pc, -1, 0, d);
                add_green(pc);
                add_side(offset(pc, 0, -.5, d));
                add_side(offset(pc, 0, +.5, d));
            }
            if (adjlist(lc.adjborder, lc.adjacent).every(([nb, nc]) =>
                nc === llc || nb.isnull || isCross(nb) || isSide(nb))) {
                add_side(offset(pc, -.5, 0, d));
            }
            if (pc !== cell && (b => b.isnull || isSide(b))(offset(pc, -.5, 0, d))) {
                forEachSide(lc, (nb, nc) => add_cross(nb));
            }
        }
        if (cell.lcnt === 0 && adjlist(cell.adjborder, cell.adjacent).every(([nb, nc]) => nb.isnull || isSide(nb) || isCross(nb) || isGreen(nc) || nc.lcnt === 2 || nc.lcnt === 1 && nc.anum !== CANUM.none)) {
            add_green(cell);
        }
        if (adjlist(cell.adjborder, cell.adjacent).every(([nb, nc], d) => nc.isnull || (isSide(nb) || isYellow(nc)) && !isTipAble(nc, d))) {
            add_yellow(cell);
        }
        if (cell.lcnt > 0) { add_yellow(cell); }
        if (cell.lcnt === 2 || cell.lcnt === 1 && cell.anum !== CANUM.none) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        if (isYellow(cell) && adjlist(cell.adjborder).filter(b => !b.isnull && !isSide(b) && !isCross(b)).length === 1) {
            add_line(adjlist(cell.adjborder).find(b => !b.isnull && !isSide(b) && !isCross(b)));
        }
        if (isGreen(cell) && [0, 1, 2, 3].every(d => !isTipAble(offset(cell, 1, 0, d), d)) &&
            adjlist(cell.adjborder).filter(b => !b.isnull && !isSide(b)).length === 1) {
            add_cross(adjlist(cell.adjborder).find(b => !b.isnull && !isSide(b)));
        }
        for (let d = 0; d < 4; d++) {
            let nc = offset(cell, 1, 0, d);
            if (nc.isnull) { continue; }
            // cross between cells in cllist
            if (cllist.includes(cell) && cllist.includes(nc)) { add_cross(offset(cell, .5, 0, d)); }
            // add side between inner and outer
            if (cell.qsub !== CQSUB.none && nc.qsub !== CQSUB.none && cell.qsub !== nc.qsub) { add_side(offset(cell, .5, 0, d)); }
            // extend pencil by cross mark
            if (isGreen(cell) && !isYellow(nc) && (b => isCross(b) && !isSide(b))(offset(cell, .5, 0, d))) {
                add_side(offset(cell, 0, -.5, d));
                add_side(offset(cell, 0, +.5, d));
                add_side(offset(cell, 1, -.5, d));
                add_side(offset(cell, 1, +.5, d));
                add_green(nc);
            }
            // different clue
            if (cell.qnum > 0 && nc.qnum > 0 && cell.qnum !== nc.qnum) { add_side(offset(cell, .5, 0, d)); }
            if (isTip(cell, d ^ 2) && isTip(offset(cell, 3, 0, d), d)) { add_side(offset(cell, 1.5, 0, d)); }
            // area of 5
            [[[2, 1], [1, 1]], [[2, 1], [3, 1]], [[3, 0], [3, 1]]].flatMap(l => [l, l.map(e => [e[0], -e[1]])]).forEach(l => {
                let cl = [cell, offset(cell, 1, 0, d), offset(cell, 2, 0, d), ...l.map(([dx, dy]) => offset(cell, dx, dy, d))];
                if (cl.some(c => c.isnull || isGreen(c) || isYellow(c) || !adjlist(c.adjborder, c.adjacent).every(([nb, nc]) => nc.isnull || isSide(nb) || isCross(nb) && !isGreen(nc) || cl.includes(nc)))) { return; }
                [[-.5, 0], [0, -.5], [0, .5], [1, -.5], [1, .5], [1.5, 0]].forEach(([dx, dy]) => add_side(offset(cell, dx, dy, d)));
                add_cross(offset(cell, .5, 0, d));
                add_green(cell);
                add_green(offset(cell, 1, 0, d));
            });
            // area of 7
            [[[3, 1], [2, 1], [1, 1]], [[3, 1], [2, 1], [2, 2]], [[3, 1], [3, 2], [2, 2]], [[3, 1], [3, 2], [4, 2]], [[3, 1], [4, 1], [4, 2]], [[3, 1], [4, 1], [5, 1]], [[4, 0], [4, 1], [4, 2]], [[4, 0], [4, 1], [5, 1]], [[4, 0], [5, 0], [5, 1]],].flatMap(l => [l, l.map(e => [e[0], -e[1]])]).forEach(l => {
                let cl = [cell, offset(cell, 1, 0, d), offset(cell, 2, 0, d), offset(cell, 3, 0, d), ...l.map(([dx, dy]) => offset(cell, dx, dy, d))];
                if (cl.some(c => c.isnull || isGreen(c) || isYellow(c) || !adjlist(c.adjborder, c.adjacent).every(([nb, nc]) => nc.isnull || isSide(nb) || isCross(nb) && !isGreen(nc) || cl.includes(nc)))) { return; }
                [[-.5, 0], [0, -.5], [0, .5], [1, -.5], [1, .5], [2, -.5], [2, .5], [2.5, 0]].forEach(([dx, dy]) => add_side(offset(cell, dx, dy, d)));
                add_cross(offset(cell, .5, 0, d));
                add_cross(offset(cell, 1.5, 0, d));
                add_green(cell);
                add_green(offset(cell, 1, 0, d));
                add_green(offset(cell, 2, 0, d));
            });
        }
    });
}

function MoonOrSunAssist() {
    let add_Xcell = function (c) {
        if (c === undefined || c.isnull || c.qnum === CQNUM.none || c.lcnt > 0) { return; }
        c.setQsub(CQSUB.cross);
        c.draw();
        stepcheck(true);
    };
    let roomType = c => {
        if (c.anum !== CANUM.none) return c.anum;
        if (c.room.count.moon.exists === 0) return 1;
        if (c.room.count.sun.exists === 0) return 2;
        if (c.room.count.sun.passed > 0) return 1;
        if (c.room.count.moon.passed > 0) return 2;
        if (c.room.count.sun.exists === c.room.clist.length) return 1;
        if (c.room.count.moon.exists === c.room.clist.length) return 2;
        for (let i = 0; i < c.room.clist.length; i++) {
            let c2 = c.room.clist[i];
            if (c2.anum !== CANUM.none) return c2.anum;
            if (c2.qnum === CQNUM.moon && c2.qsub === CQSUB.cross) { return 1; }
            if (c2.qnum === CQNUM.sun && c2.qsub === CQSUB.cross) { return 2; }
            if (c2.qnum === CQNUM.moon && c2.lcnt > 0) { return 2; }
            if (c2.qnum === CQNUM.sun && c2.lcnt > 0) { return 1; }
        }
        return 0;
    }
    RoomPassOnce();
    CellConnected_InRegion({
        isShaded: c => c.lcnt > 0 || c.qnum !== CQNUM.none && c.qnum === roomType(c),
        isUnshaded: c => adjlist(c.adjborder).every(b => isntLine(b)),
        add_shaded: () => { },
        add_unshaded: () => { },
        ByLine: true,
    });
    SingleLoopInCell({ isPass: c => c.qnum !== CQNUM.none && roomType(c) === c.qnum });
    CellConnected_InRegion({
        isShaded: c => isNum(c) && roomType(c) === c.qnum,
        isUnshaded: c => isNum(c) && roomType(c) !== 0 && roomType(c) !== c.qnum,
        add_shaded: () => { },
        add_unshaded: () => { },
        ByLine: true,
    });
    forEachCell(cell => {
        if (cell.anum === CANUM.none && roomType(cell) !== 0) {
            let t = roomType(cell);
            Array.from(cell.room.clist).forEach(c => add_number(c, t));
        }
        forEachSide(cell, (nb, nc) => {
            if (nc.isnull || cell.room === nc.room) { return; }
            if (isLine(nb) && roomType(nc) !== 0) {
                add_number(cell, 3 - roomType(nc));
            }
            if (roomType(nc) !== 0 && cell.qnum === roomType(nc)) {
                add_cross(nb);
            }
            if (roomType(cell) !== 0 && roomType(nc) !== 0 && roomType(cell) === roomType(nc)) {
                add_cross(nb);
            }
        });
        if (cell.qnum === CQNUM.none) { return; }
        forEachSide(cell, (nb, nc) => {
            if (nc.isnull || nc.qnum === CQNUM.none) { return; }
            if ((cell.qnum === nc.qnum) ^ (cell.room === nc.room)) {
                add_cross(nb);
            }
        });
        if (adjlist(cell.adjborder).every(b => b.isnull || isCross(b))) {
            add_Xcell(cell);
        }
        if (roomType(cell) !== 0 && cell.qnum !== roomType(cell)) {
            add_Xcell(cell);
        }
        if (cell.qsub === CQSUB.cross) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
    });
    forEachRoom(room => {
        let t = roomType(room.clist[0]);
        if (t === 0) { return; }
        let nrl = new Set();
        Array.from(room.clist).forEach(c => forEachSide(c, (nb, nc) => {
            if (!nc.isnull && nc.room !== room && !isCross(nb)) {
                nrl.add(nc.room);
            }
        }));
        if (nrl.size <= 2) {
            Array.from(nrl).forEach(nroom => add_number(nroom.clist[0], 3 - t));
        }
    });
}

function FamilyPhotoAssist() {
    let s = Array.from(new Array(board.rows), () => new Array(board.cols).fill([]));
    let t = Array.from(new Array(board.rows), () => new Array(board.cols).fill([]));
    forEachCell(c => {
        let x = (c.bx - 1) / 2, y = (c.by - 1) / 2;
        let s1 = x > 0 ? s[y][x - 1] : [];
        let s2 = y > 0 ? s[y - 1][x] : [];
        s[y][x] = [...s1, ...s2.filter(c => !s1.includes(c))];
        if (c.qnum !== CQNUM.none) { s[y][x].push(c); }
        let t1 = x > 0 ? t[y][x - 1] : 0;
        let t2 = y > 0 ? t[y - 1][x] : 0;
        let t12 = x > 0 && y > 0 ? t[y - 1][x - 1] : 0;
        t[y][x] = t1 + t2 - t12;
        if (c.ques === 6) { t[y][x]++; }
    });
    RectRegion_Border({
        isSizeAble: (w, h, sc, c) => {
            let x = (c.bx - 1) / 2 + w - 1, y = (c.by - 1) / 2 + h - 1;
            let f = (a, b) => a < 0 || b < 0 ? [] : s[a][b];
            if (f(y, x).length - f(y, x - w).length - f(y - h, x).length + f(y - h, x - w).length !== 1) { return false; }
            sc = f(y, x).find(c => !f(y, x - w).includes(c) && !f(y - h, x).includes(c));
            let g = (a, b) => a < 0 || b < 0 ? 0 : t[a][b];
            return sc.qnum === CQNUM.quesmark || g(y, x) - g(y, x - w) - g(y - h, x) + g(y - h, x - w) === sc.qnum;
        }
    });
    forEachBorder(border => border.sidecell.every(c => c.ques === 6) ? add_link(border) : undefined);
}

function ShikakuAssist() {
    let s = Array.from(new Array(board.rows), () => new Array(board.cols).fill([]));
    forEachCell(c => {
        let x = (c.bx - 1) / 2, y = (c.by - 1) / 2;
        let s1 = x > 0 ? s[y][x - 1] : [];
        let s2 = y > 0 ? s[y - 1][x] : [];
        s[y][x] = [...s1, ...s2.filter(c => !s1.includes(c))];
        if (c.qnum !== CQNUM.none) { s[y][x].push(c); }
    });
    RectRegion_Border({
        isSizeAble: (w, h, sc, c) => {
            if (sc !== null && w * h !== sc.qnum) { return false; }
            let x = (c.bx - 1) / 2 + w - 1, y = (c.by - 1) / 2 + h - 1;
            let f = (a, b) => a < 0 || b < 0 ? [] : s[a][b];
            if (f(y, x).length - f(y, x - w).length - f(y - h, x).length + f(y - h, x - w).length !== 1) { return false; }
            sc = f(y, x).find(c => !f(y, x - w).includes(c) && !f(y - h, x).includes(c));
            return sc.qnum === CQNUM.quesmark || w * h === sc.qnum;
        }
    });
}

function SquareJamAssist() {
    NoCrossingBorder();
    forEachBorder(border => {
        if (border.sidecross.every(cr => cr.lcnt > 0 || isEdge(cr))) { add_side(border); }
    });
    forEachCell(cell => {
        for (let d = 0; d < 4; d++) {
            if (isntLink(offset(cell, -.5, 0, d)) && (isLink(offset(cell, 0, -.5, d)) || isLink(offset(cell, 0, .5, d)))) {
                add_link(offset(cell, .5, 0, d));
            }
        }
        // 2*2
        if ([0, 1].every(i => [[i, -.5], [i, 1.5], [-.5, i], [1.5, i]].every(([dx, dy]) => isntLink(offset(cell, dx, dy))))) {
            for (let i = 0; i < 2; i++) {
                add_link(offset(cell, 0, i + .5));
                add_link(offset(cell, i + .5, 0));
            }
        }
        // 3*3
        if ([0, 1, 2].every(i => [[i, -.5], [i, 2.5], [-.5, i], [2.5, i]].every(([dx, dy]) => isntLink(offset(cell, dx, dy))))) {
            for (let i = 0; i < 3; i++) {
                add_link(offset(cell, 0, i + .5));
                add_link(offset(cell, i + .5, 0));
            }
        }
    });
    RectRegion_Border({
        isSizeAble: (w, h, sc, c) => {
            if (w !== h) { return false; }
            if (sc !== null && w !== sc.qnum) { return false; }
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    if (offset(c, i, j).qnum > 0 && sc === null) { sc = offset(c, i, j); }
                    if (offset(c, i, j).qnum > 0 && offset(c, i, j).qnum !== sc.qnum) { return false; }
                }
            }
            return sc === null || w === sc.qnum;
        }
    });
}

function TasquareAssist() {
    RectRegion_Cell({
        isShaded: isBlack,
        isUnshaded: c => isGreen(c) || c.qnum !== CQNUM.none,
        add_shaded: add_black,
        add_unshaded: add_dot,
        isSizeAble: (w, h, sc, c) => w === h,
    });
    CellConnected({
        isShaded: c => c.qsub === CQSUB.dot || c.qnum !== CQNUM.none,
        isUnshaded: isBlack,
        add_shaded: add_dot,
        add_unshaded: add_black,
    });
    let is2x2able = function (c) {
        for (let d = 0; d < 4; d++) {
            let list = [c, offset(c, 0, 1, d), offset(c, 1, 0, d), offset(c, 1, 1, d)];
            if (list.every(c => !c.isnull && c.qsub !== CQSUB.dot && c.qnum === CQNUM.none)) {
                return true;
            }
        }
        return false;
    }
    let isSquareAble = function (c1, c2) {
        if (c1.isnull || c2.isnull) { return false; }
        let [x1, x2] = [c1.bx, c2.bx].sort((x, y) => x - y);
        let [y1, y2] = [c1.by, c2.by].sort((x, y) => x - y);
        for (let i = x1; i <= x2; i += 2) {
            for (let j = y1; j <= y2; j += 2) {
                if (isntBlack(board.getc(i, j))) { return false; }
            }
        }
        for (let i = x1; i <= x2; i += 2) {
            if (isBlack(board.getc(i, y1 - 2))) { return false; }
            if (isBlack(board.getc(i, y2 + 2))) { return false; }
        }
        for (let j = y1; j <= y2; j += 2) {
            if (isBlack(board.getc(x1 - 2, j))) { return false; }
            if (isBlack(board.getc(x2 + 2, j))) { return false; }
        }
        return true;
    }
    let isntBlack = c => c.isnull || c.qsub === CQSUB.dot || c.qnum !== CQNUM.none;
    forEachCell(cell => {
        if (cell.qnum === CQNUM.none) { return; }
        add_dot(cell);
        if (adjlist(cell.adjacent).filter(c => !isntBlack(c)).length === 1) {
            adjlist(cell.adjacent).forEach(c => add_black(c, true));
        }
        if (cell.qnum === CQNUM.quesmark) { return; }
        let bclist = Array.from(board.cell), dclist = Array.from(board.cell);
        let getRectCell = (c1, c2) => {
            if (c1.isnull || c2.isnull) { return []; }
            let list = [];
            let [x1, x2] = [c1.bx, c2.bx].sort((x, y) => x - y);
            let [y1, y2] = [c1.by, c2.by].sort((x, y) => x - y);
            for (let i = x1; i <= x2; i += 2) {
                for (let j = y1; j <= y2; j += 2) {
                    list.push(board.getc(i, j));
                }
            }
            return list;
        };
        // bruteforce for each clue
        for (let n1 = 0; n1 <= Math.sqrt(cell.qnum); n1++) {
            if (isBlack(offset(cell, n1 + 1, 0, 0))) { continue; }
            if (n1 > 0 && isntBlack(offset(cell, n1, 0, 0))) { break; }
            for (let s1 = 0; s1 <= Math.max(0, n1 - 1); s1++) {
                if (n1 > 0 && !isSquareAble(offset(cell, 1, s1 - n1 + 1, 0), offset(cell, n1, s1, 0))) { continue; }
                for (let n2 = 0; n2 <= Math.sqrt(cell.qnum - n1 ** 2); n2++) {
                    if (isBlack(offset(cell, n2 + 1, 0, 1))) { continue; }
                    if (n2 > 0 && isntBlack(offset(cell, n2, 0, 1))) { break; }
                    if (n2 > 0 && s1 - n1 + 1 < 0) { break; }
                    for (let s2 = 0; s2 <= Math.max(0, n2 - 1); s2++) {
                        if (n2 > 0 && !isSquareAble(offset(cell, 1, s2 - n2 + 1, 1), offset(cell, n2, s2, 1))) { continue; }
                        if (s2 > 0 && n1 > 0) { break; }
                        for (let n3 = 0; n3 <= Math.sqrt(cell.qnum - n1 ** 2 - n2 ** 2); n3++) {
                            if (isBlack(offset(cell, n3 + 1, 0, 2))) { continue; }
                            if (n3 > 0 && isntBlack(offset(cell, n3, 0, 2))) { break; }
                            if (n3 > 0 && s2 - n2 + 1 < 0) { break; }
                            for (let s3 = 0; s3 <= Math.max(0, n3 - 1); s3++) {
                                if (n3 > 0 && !isSquareAble(offset(cell, 1, s3 - n3 + 1, 2), offset(cell, n3, s3, 2))) { continue; }
                                if (s3 > 0 && n2 > 0) { break; }
                                let n4 = Math.sqrt(cell.qnum - n1 ** 2 - n2 ** 2 - n3 ** 2);
                                if (n4 % 1 !== 0) { continue; }
                                if (isBlack(offset(cell, n4 + 1, 0, 3))) { continue; }
                                if (n4 > 0 && isntBlack(offset(cell, n4, 0, 3))) { continue; }
                                if (s1 > 0 && n4 > 0) { continue; }
                                if (n4 > 0 && s3 - n3 + 1 < 0) { continue; }
                                for (let s4 = 0; s4 <= Math.max(0, n4 - 1); s4++) {
                                    if (s4 > 0 && n3 > 0) { break; }
                                    if (n4 > 0 && !isSquareAble(offset(cell, 1, s4 - n4 + 1, 3), offset(cell, n4, s4, 3))) { continue; }
                                    if (n1 > 0 && s4 - n4 + 1 < 0) { continue; }
                                    let cset = new Set([...(n1 > 0 ? getRectCell(offset(cell, 1, s1 - n1 + 1, 0), offset(cell, n1, s1, 0)) : []),
                                    ...(n2 > 0 ? getRectCell(offset(cell, 1, s2 - n2 + 1, 1), offset(cell, n2, s2, 1)) : []),
                                    ...(n3 > 0 ? getRectCell(offset(cell, 1, s3 - n3 + 1, 2), offset(cell, n3, s3, 2)) : []),
                                    ...(n4 > 0 ? getRectCell(offset(cell, 1, s4 - n4 + 1, 3), offset(cell, n4, s4, 3)) : [])]);
                                    bclist = bclist.filter(c => cset.has(c));
                                    dclist = dclist.filter(c => !cset.has(c) && adjlist(c.adjacent).some(cc => cset.has(cc) || cc === cell));
                                }
                            }
                        }
                    }
                }
            }
        }
        bclist.forEach(c => add_black(c));
        dclist.forEach(c => add_dot(c));
        let blist = [];
        let dfs = function (c) {
            if (blist.includes(c) || c.isnull || !isBlack(c)) { return; }
            blist.push(c);
            forEachSide(c, (nb, nc) => dfs(nc));
        }
        forEachSide(cell, (nb, nc) => dfs(nc));
        if (blist.length === cell.qnum) {
            forEachSide(cell, (nb, nc) => add_dot(nc));
            blist.forEach(c => forEachSide(c, (nb, nc) => add_dot(nc)));
        }
    });
}

function TentaishoAssist() {
    let isDot = obj => obj.qnum > 0;
    let isEmpty = c => !c.isnull && c.ques !== CQUES.wall;
    CluePerRegion({
        isShaded: c => [[0, 0], [0, .5], [.5, 0], [.5, .5]].some(([x, y]) => isDot(offset(c, x, y))),
        isOthers: isEmpty,
        isUnshaded: c => !isEmpty(c),
        isNotPassable: (c, nb, nc) => !isEmpty(c) || isSide(nb) || !isEmpty(nc),
        BridgeType: "link",
        n: 1,
    });
    for (let i = 0; i < board.cross.length; i++) {
        let cross = board.cross[i];
        let list = adjlist(cross.adjborder);
        if (list.filter(b => !b.isnull && b.qsub === BQSUB.link).length === 2 && cross.lcnt === 1) {
            list.forEach(b => add_side(b));
        }
        if (list.filter(b => !b.isnull && b.qsub === BQSUB.link).length === 3) {
            list.forEach(b => add_link(b));
        }
    }
    let n = 0;
    let id = new Map(); // map every cell to unique dot id
    let dotmap = new Map(); // get dot obj
    let bfs_id = function (clist, n) {
        while (clist.length > 0) {
            let c = clist.pop();
            let x = dotmap.get(n).bx;
            let y = dotmap.get(n).by;
            if (!isEmpty(c) || id.has(c)) { continue; }
            id.set(c, n);
            let fn = function (bbx, bby, cbx, cby) {
                let nb = board.getb(bbx, bby);
                let nc = board.getc(cbx, cby);
                if (!isEmpty(nc) || nb.qans || id.has(nc) && id.get(nc) !== id.get(c)) {
                    add_side(nb);
                    add_side(board.getb(2 * x - bbx, 2 * y - bby));
                }
                if (id.has(nc) && id.get(nc) === id.get(c)) {
                    add_link(nb);
                }
                if (isEmpty(nc) && nb.qsub === BQSUB.link) {
                    add_link(board.getb(2 * x - bbx, 2 * y - bby));
                    clist.push(nc);
                    clist.push(board.getc(2 * x - cbx, 2 * y - cby));
                }
            };
            fn(c.bx - 1, c.by, c.bx - 2, c.by);
            fn(c.bx + 1, c.by, c.bx + 2, c.by);
            fn(c.bx, c.by - 1, c.bx, c.by - 2);
            fn(c.bx, c.by + 1, c.bx, c.by + 2);
        }
    };
    let id_choice = new Map();
    let dfs_idc = function (c, n) {
        let x = dotmap.get(n).bx;
        let y = dotmap.get(n).by;
        let oc = board.getc(2 * x - c.bx, 2 * y - c.by);
        if (!isEmpty(c) || id.has(c) && id.get(c) !== n) { return; }
        if (!isEmpty(oc) || id.has(oc) && id.get(oc) !== n) { return; }
        if (id_choice.has(c) && id_choice.get(c).includes(n)) { return; }
        if (id_choice.has(oc) && id_choice.get(oc).includes(n)) { return; }
        if (!id_choice.has(c)) { id_choice.set(c, []); }
        if (!id_choice.has(oc)) { id_choice.set(oc, []); }
        id_choice.set(c, id_choice.get(c).concat([n]));
        id_choice.set(oc, id_choice.get(oc).concat([n]));
        forEachSide(c, (nb, nc) => {
            if (nb.qans) { return; }
            dfs_idc(nc, n);
        });
    };
    // assign cells to dots and deduce
    for (let x = board.minbx + 1; x <= board.maxbx - 1; x++) {
        for (let y = board.minby + 1; y <= board.maxby - 1; y++) {
            if (isDot(board.getobj(x, y))) {
                n++;
                dotmap.set(n, board.getobj(x, y));
                let clist = [];
                if (x % 2 === 1 && y % 2 === 1) {
                    clist.push(board.getc(x, y));
                }
                if (x % 2 === 1 && y % 2 === 0) {
                    clist.push(board.getc(x, y - 1));
                    clist.push(board.getc(x, y + 1));
                }
                if (x % 2 === 0 && y % 2 === 1) {
                    clist.push(board.getc(x - 1, y));
                    clist.push(board.getc(x + 1, y));
                }
                if (x % 2 === 0 && y % 2 === 0) {
                    clist.push(board.getc(x - 1, y - 1));
                    clist.push(board.getc(x - 1, y + 1));
                    clist.push(board.getc(x + 1, y - 1));
                    clist.push(board.getc(x + 1, y + 1));
                }
                bfs_id(clist, n);
            }
        }
    }
    // assign cells to possible dots
    n = 0;
    for (let x = board.minbx + 1; x <= board.maxbx - 1; x++) {
        for (let y = board.minby + 1; y <= board.maxby - 1; y++) {
            if (isDot(board.getobj(x, y))) {
                n++;
                let clist = [];
                if (x % 2 === 1 && y % 2 === 1) {
                    clist.push(board.getc(x, y));
                }
                if (x % 2 === 1 && y % 2 === 0) {
                    clist.push(board.getc(x, y - 1));
                    clist.push(board.getc(x, y + 1));
                }
                if (x % 2 === 0 && y % 2 === 1) {
                    clist.push(board.getc(x - 1, y));
                    clist.push(board.getc(x + 1, y));
                }
                if (x % 2 === 0 && y % 2 === 0) {
                    clist.push(board.getc(x - 1, y - 1));
                    clist.push(board.getc(x - 1, y + 1));
                    clist.push(board.getc(x + 1, y - 1));
                    clist.push(board.getc(x + 1, y + 1));
                }
                dfs_idc(clist[0], n);
            }
        }
    }
    // check not assigned cells
    forEachCell(cell => {
        if (!isDot(cell) && adjlist(cell.adjborder).filter(b => !b.isnull && !b.qans).length === 1) {
            add_link(adjlist(cell.adjborder).filter(b => !b.isnull && !b.qans)[0]);
        }
        if (!isEmpty(cell) || id.has(cell)) { return; }
        if (id_choice.has(cell) && id_choice.get(cell).length === 1) {
            bfs_id([cell], id_choice.get(cell)[0]);
        }
    });
    document.querySelector('#btncolor').click();
}

function NorinuriAssist() {
    forEachCell(c => { if (c.qnum !== CQNUM.none) add_green(c); })
    BlackDomino();
    SizeRegion_Cell({
        isShaded: isGreen,
        isUnshaded: isBlack,
        add_shaded: add_green,
        add_unshaded: c => add_black(c, true),
    });
}

function NorinoriAssist() {
    BlackDomino();
    forEachRoom(room => {
        let list = Array.from(room.clist).filter(c => !isDot(c));
        // finish region
        if (list.filter(c => isBlack(c)).length === 2) {
            list.forEach(c => add_dot(c));
        }
        if (list.length === 2) {
            list.forEach(c => add_black(c));
        }
        if (list.filter(c => isBlack(c)).length === 1) {
            list.forEach(c => {
                if (isBlack(c) || c.qsub === CQSUB.dot) { return; }
                if (!adjlist(c.adjacent).some(nc => !nc.isnull &&
                    (c.room !== nc.room && !isDot(nc) || c.room === nc.room && isBlack(nc)))) {
                    add_dot(c);
                }
            });
        }
        if (list.filter(c => !isDot(c)).length === 3) {
            list = list.filter(c => !isDot(c));
            let fn = function (c1, c2, c3) {
                if (!adjlist(c1.adjacent).includes(c2)) { return; }
                if (adjlist(c1.adjacent).some(c => isBlack(c) && c !== c2) || adjlist(c2.adjacent).some(c => isBlack(c) && c !== c1)) {
                    add_black(c3);
                }
                if (adjlist(c1.adjacent).includes(c3)) {
                    for (let d = 0; d < 4; d++) {
                        let l = [offset(c1, 0, 1, d), offset(c1, 1, 0, d)];
                        if (l.includes(c2) && l.includes(c3)) {
                            add_dot(offset(c1, 1, 1, d));
                        }
                    }
                }
            }
            fn(list[0], list[1], list[2]);
            fn(list[1], list[2], list[0]);
            fn(list[2], list[0], list[1]);
        }
    });
    forEachCell(cell => {
        let c2x2 = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([x, y]) => offset(cell, x, y));
        if (c2x2.some(c => c.isnull)) { return; }
        let clist = Array.from(new Set(c2x2.flatMap(c => Array.from(c.room.clist)))).filter(c => !isDot(c) || c2x2.includes(c));
        if (clist.length === 6 && clist.some(c => c.room !== clist[0].room)) {
            clist.forEach(c => c2x2.includes(c) ? null : add_black(c));
        }
    });
}

function AllorNothingAssist() {
    let add_color = function (c, color) {
        if (c.isnull || c.qsub !== CQSUB.none) { return; }
        c.setQsub(color);
        c.draw();
        stepcheck(true);
    };
    let add_gray = function (c) { add_color(c, CQSUB.gray); };
    let add_yellow = function (c) { add_color(c, CQSUB.yellow); };
    let add_border_cross = function (b) { if (b.ques) { add_cross(b); } };
    SingleLoopInCell({
        isPassable: c => c.qsub !== CQSUB.gray,
        isPass: c => c.qsub === CQSUB.yellow,
        add_notpass: add_gray,
        add_pass: add_yellow,
    });
    CellConnected_InRegion({
        isShaded: c => c.qsub === CQSUB.yellow,
        isUnshaded: c => c.qsub === CQSUB.gray,
        add_shaded: add_yellow,
        add_unshaded: add_gray,
        ByLine: true,
    });
    RoomPassOnce({ MaybeNotPassed: true });
    forEachRoom(room => {
        let list = Array.from(room.clist);
        let nbcnt = c => adjlist(c.adjacent).filter(nc => !nc.isnull && c.room === nc.room).length;
        let list2 = list.filter(c => nbcnt(c) !== 1);
        let listodd = list.filter(c => (c.bx + c.by) % 4 === 2);
        let listeven = list.filter(c => (c.bx + c.by) % 4 === 0);
        if (list.length - list2.length === 2) {
            list2.forEach(c => forEachSide(c, (nb, nc) => add_border_cross(nb)));
        }
        if (listeven.length === listodd.length + 1) {
            listodd.forEach(c => forEachSide(c, (nb, nc) => add_border_cross(nb)));
        }
        if (listodd.length === listeven.length + 1) {
            listeven.forEach(c => forEachSide(c, (nb, nc) => add_border_cross(nb)));
        }
        if (list.some(c => c.lcnt > 0 || c.qsub === CQSUB.yellow)) {
            list.forEach(c => add_yellow(c));
            list.filter(c => nbcnt(c) === 1).forEach(c => forEachSide(c, (nb, nc) => {
                if (!nc.isnull && room === nc.room) {
                    add_line(nb);
                }
            }));
        }
        if (list.some(c => c.qsub === CQSUB.gray) || list.length - list2.length > 2 ||
            Math.abs(listodd.length - listeven.length) > 1) {
            list.forEach(c => add_gray(c));
            list.forEach(c => forEachSide(c, (nb, nc) => add_cross(nb)));
            list.forEach(c => forEachSide(c, (nb, nc) => add_yellow(nc)));
        }
    });
}

function AqreAssist() {
    CellConnected({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        isNotPassable: (c, nb, nc) => {
            let d = [0, 1, 2, 3].find(d => offset(c, 0.5, 0, d) === nb);
            if (isBlack(offset(c, 2, 0, d)) && isBlack(offset(c, 3, 0, d)) || isBlack(offset(c, -1, 0, d)) && isBlack(offset(c, -2, 0, d))) { return true; }
            let clist = Array.from(c.room.clist), clue = c.room.top.qnum;
            if (c.room === nc.room && clue > 0 && clist.filter(c => isBlack(c)).length + 1 === clue && isntBlack(c) && isntBlack(nc)) { return true; }
            return false;
        },
    });
    forEachCell(cell => {
        let fn = function (c1, c2, c3) {
            if (c1.isnull || c2.isnull || c3.isnull) { return; }
            if (isBlack(c1) && isBlack(c2) && isBlack(c3)) {
                add_green(cell);
            }
            if (isGreen(c1) && isGreen(c2) && isGreen(c3)) {
                add_black(cell);
            }
        };
        if (cell.qsub === CQSUB.none && cell.qans === CQANS.none) {
            fn(offset(cell, -3, 0), offset(cell, -2, 0), offset(cell, -1, 0),);
            fn(offset(cell, -2, 0), offset(cell, -1, 0), offset(cell, 1, 0),);
            fn(offset(cell, -1, 0), offset(cell, 1, 0), offset(cell, 2, 0),);
            fn(offset(cell, 1, 0), offset(cell, 2, 0), offset(cell, 3, 0),);
            fn(offset(cell, 0, -3), offset(cell, 0, -2), offset(cell, 0, -1),);
            fn(offset(cell, 0, -2), offset(cell, 0, -1), offset(cell, 0, 1),);
            fn(offset(cell, 0, -1), offset(cell, 0, 1), offset(cell, 0, 2),);
            fn(offset(cell, 0, 1), offset(cell, 0, 2), offset(cell, 0, 3),);
        }
    });
    forEachRoom(room => {
        let qnum = room.top.qnum;
        if (qnum === CQNUM.none || qnum === CQNUM.quesmark) { return; }
        let list = Array.from(room.clist);
        if (list.filter(c => isBlack(c)).length === qnum) {
            list.forEach(c => add_green(c));
        }
        if (qnum - list.filter(c => isBlack(c)).length ===
            list.filter(c => !isBlack(c) && !isGreen(c)).length) {
            list.forEach(c => add_black(c));
        }
    });
}

function KurodokoAssist() {
    GreenConnected();
    BlackNotAdjacent();
    SightNumber({
        isShaded: c => isGreen(c) || isClue(c),
        isUnshaded: isBlack,
        add_shaded: add_green,
        add_unshaded: add_black,
        CountItself: true,
    });
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none) { add_green(cell); }
        if (cell.qnum === 2) { adjdiaglist(cell).forEach(c => add_green(c)); }
    });
}

function HitoriAssist() {
    GreenConnected();
    BlackNotAdjacent();
    let uniq = new Map();
    forEachCell(cell => uniq.set(cell, true));
    let fn = function (a) {
        let vis = new Map();
        for (let cell of a) {
            if (cell.qnum === CQNUM.none) continue;
            if (isGreen(cell)) vis.set(cell.qnum, cell);
        }
        for (let cell of a) {
            if (cell.qnum === CQNUM.none) continue;
            if (vis.has(cell.qnum)) add_black(cell);
        }

        let cnt = new Map();
        for (let cell of a) {
            if (cell.qnum === CQNUM.none || isBlack(cell)) continue;
            let c = cnt.has(cell.qnum) ? cnt.get(cell.qnum) : 0;
            c++;
            cnt.set(cell.qnum, c);
        }
        for (let cell of a) {
            if (cell.qnum === CQNUM.none || isBlack(cell)) continue;
            if (cnt.get(cell.qnum) >= 2) uniq.set(cell, false);
        }

        // aba
        for (let i = 0; i < a.length - 2; i++) {
            if (a[i].qnum === CQNUM.none || a[i].qnum !== a[i + 2].qnum) continue;
            add_green(a[i + 1]);
        }

        // a..aa
        for (let i = 0; i < a.length - 1; i++) {
            if (a[i].qnum === CQNUM.none || a[i].qnum !== a[i + 1].qnum) continue;
            for (let j = 0; j < a.length; j++) {
                if (j !== i && j !== i + 1 && a[j].qnum === a[i].qnum) add_black(a[j]);
            }
        }
    };
    for (let i = 0; i < board.rows; i++) {
        let a = [];
        for (let j = 0; j < board.cols; j++) {
            a.push(board.getc(2 * j + 1, 2 * i + 1));
        }
        fn(a);
    }
    for (let j = 0; j < board.cols; j++) {
        let a = [];
        for (let i = 0; i < board.rows; i++) {
            a.push(board.getc(2 * j + 1, 2 * i + 1));
        }
        fn(a);
    }
    forEachCell(cell => {
        if (uniq.get(cell)) add_green(cell);
    });
}

function CanalViewAssist() {
    CellConnected({
        isShaded: isBlack,
        isUnshaded: c => c.qsub === CQSUB.dot || c.qnum !== CQNUM.none,
        add_shaded: add_black,
        add_unshaded: add_dot,
    });
    SightNumber({
        isShaded: isBlack,
        isUnshaded: c => c.qsub === CQSUB.dot || c.qnum !== CQNUM.none,
        add_shaded: add_black,
        add_unshaded: add_dot,
        CountItself: false,
    });
    No2x2Cell({
        isShaded: isBlack,
        add_unshaded: add_dot,
    });
}

function CaveAssist() {
    GreenConnected();
    CellConnected({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        OutsideAsShaded: true,
    });
    SightNumber({
        isShaded: isGreen,
        isUnshaded: isBlack,
        add_shaded: add_green,
        add_unshaded: add_black,
        CountItself: true,
    });
    NoCheckerCell({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
    });
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none) {
            add_green(cell);
        }
    });
}

function TapaLikeLoopAssist() {
    SingleLoopInCell();
    let check = function (c, s) {
        let qnums = c.qnums;
        if (s === "111111110000") { return qnums.length === 1 && (qnums[0] === 8 || qnums[0] === CQNUM.quesmark); }
        if (s === "000000000000") { return qnums.length === 1 && qnums[0] === 0; }
        for (let i = 0; i < 4; i++) {
            if (s[i + 8] === '1' && (s[(i * 2 + 1) % 8] === '1' || s[(i * 2 + 2) % 8] === '1')) { return false; }
        }
        let l = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]].map(([x, y]) => offset(c, x, y));
        if ([[[0, -1.5]], [[1, -1.5], [1.5, -1]], [[1.5, 0]], [[1.5, 1], [1, 1.5]], [[0, 1.5]], [[-1, 1.5], [-1.5, 1]], [[-1.5, 0]], [[-1.5, -1], [-1, -1.5]]].some((e, i) => {
            if (l[i].qsub !== CQSUB.circle) { return false; }
            if (i % 2 === 1 && [s[i], s[(i + 1) % 8], s[(i + 1) / 2 + 7]].every(n => n === '0')) { return true; }
            e = e.map(([x, y]) => isntLine(offset(c, x, y)) ? '0' : '1');
            return [...e, s[i], s[(i + 1) % 8]].filter(n => n === '1').length < 2;
        })) { return false; }
        l = [[[0, -1.5]], [[1, -1.5], [1.5, -1]], [[1.5, 0]], [[1.5, 1], [1, 1.5]], [[0, 1.5]], [[-1, 1.5], [-1.5, 1]], [[-1.5, 0]], [[-1.5, -1], [-1, -1.5]]].map(e => {
            e = e.map(([x, y]) => offset(c, x, y));
            e = e.map(b => isLine(b) ? 1 : isntLine(b) ? 0 : -1);
            if (e.includes(-1)) return -1;
            if (e.length === 1) return e[0];
            return e[0] ^ e[1];
        });
        if (l.some((t, i) => {
            if (t === 0 && s[i] !== s[(i + 1) % 8]) { return true; }
            if (t === 1 && s[i] === s[(i + 1) % 8]) { return true; }
            return false;
        })) { return false; }
        while (s[0] !== '0') {
            s = s.slice(1, 8) + s[0] + s.slice(8);
        }
        s = s.slice(0, 8).split('0').filter(s => s.length > 0).map(s => s.length + 1).concat(
            s.slice(8).split('').flatMap(c => c === '1' ? 1 : []));
        if (s.length !== qnums.length) { return false; }
        for (let i = 0; i < qnums.length; i++) {
            if (qnums[i] === CQNUM.quesmark) { continue; }
            if (!s.includes(qnums[i])) { return false; }
            s.splice(s.indexOf(qnums[i]), 1);
        }
        return s.length === qnums.filter(n => n === CQNUM.quesmark).length;
    };
    forEachCell(cell => {
        if (cell.lcnt > 0) { add_Ocell(cell); }
        if (adjlist(cell.adjborder).every(b => isntLine(b))) { add_Xcell(cell); }
        if (cell.qsub === CQSUB.cross) { forEachSide(cell, (nb, nc) => add_cross(nb)); }
        if (cell.qnums.length === 0) { return; }
        forEachSide(cell, (nb, nc) => add_cross(nb));
        let list = [[-.5, -1], [.5, -1], [1, -.5], [1, .5], [.5, 1], [-.5, 1], [-1, .5], [-1, -.5]].map(([x, y]) => offset(cell, x, y));
        let dlist = [0, 3, 2, 1].map(d => [[1, -.5], [.5, -1], [1, -1.5], [1.5, - 1]].map(([x, y]) => offset(cell, x, y, d)));
        if (cell.qnums[0] === 0) {
            list.forEach(b => add_cross(b));
        }
        let mask = parseInt([...list.map(b => !b.isnull && !isCross(b) && !isLine(b) ? "1" : "0"),
        ...dlist.map(([b1, b2, b3, b4]) => !isLine(b1) && !isLine(b2) && !isntLine(b3) && !isntLine(b4) ? "1" : "0")
        ].join(""), 2);
        let blk = parseInt(([...list.map(b => isLine(b) ? "1" : "0"),
        ...dlist.map(([b1, b2, b3, b4]) => isLine(b3) && isLine(b4) ? "1" : "0")]).join(""), 2);
        let setb = 0b111111111111, setd = 0b000000000000, n = 0;
        let setp = 0b11111111, setq = 0b11111111, seto = 0b11111111;
        for (let j = mask; j >= 0; j--) {
            j &= mask;
            if (check(cell, (j | blk).toString(2).padStart(12, '0'))) {
                n++;
                setb &= (j | blk);
                setd |= (j | blk);
                let t = (j | blk) >> 4;
                t = t ^ (t << 1 | t >> 7);
                setp &= t;
                t = ~t;
                if ((j | blk) & 0b000000001000) { t &= 0b10111111; }
                if ((j | blk) & 0b000000000100) { t &= 0b11101111; }
                if ((j | blk) & 0b000000000010) { t &= 0b11111011; }
                if ((j | blk) & 0b000000000001) { t &= 0b11111110; }
                setq &= t;
                t = (j | blk) >> 4;
                t = t | (t << 1 | t >> 7);
                if ((j | blk) & 0b000000001000) { t |= 0b01000000; }
                if ((j | blk) & 0b000000000100) { t |= 0b00010000; }
                if ((j | blk) & 0b000000000010) { t |= 0b00000100; }
                if ((j | blk) & 0b000000000001) { t |= 0b00000001; }
                seto &= t;
            }
        }
        if (n === 0) {
            add_black(cell);
            return;
        }
        setb = setb.toString(2).padStart(12, '0');
        setd = setd.toString(2).padStart(12, '0');
        setp = setp.toString(2).padStart(8, '0');
        setq = setq.toString(2).padStart(8, '0');
        seto = seto.toString(2).padStart(8, '0');
        for (let j = 0; j < 8; j++) {
            if (setb[j] === '1') { add_line(list[j]); }
            if (setd[j] === '0') { add_cross(list[j]); }
        }
        for (let j = 8; j < 12; j++) {
            if (setb[j] === '1') {
                let [b1, b2, b3, b4] = dlist[j - 8];
                add_cross(b1);
                add_cross(b2);
                add_line(b3);
                add_line(b4);
            }
            if (setd[j] === '0') {
                let [b1, b2, b3, b4] = dlist[j - 8];
                if (isLine(b3)) { add_cross(b4); }
                if (isLine(b4)) { add_cross(b3); }
                if (isntLine(b1) && isntLine(b2)) {
                    add_cross(b3);
                    add_cross(b4);
                }
            }
        }
        [[[0, -1.5]], [[1, -1.5], [1.5, -1]], [[1.5, 0]], [[1.5, 1], [1, 1.5]], [[0, 1.5]], [[-1, 1.5], [-1.5, 1]], [[-1.5, 0]], [[-1.5, -1], [-1, -1.5]]].map((e, i) => {
            e = e.map(([x, y]) => offset(cell, x, y));
            if (setp[i] === '1' && e.filter(b => !isntLine(b)).length === 1) {
                e.forEach(b => add_line(b));
            }
            if (setq[i] === '1') {
                e.forEach(b => add_cross(b));
            }
        });
        [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]].forEach(([x, y], i) => {
            let c = offset(cell, x, y);
            if (seto[i] === '1') { add_Ocell(c); }
        })
    });
}

function TapaAssist() {
    No2x2Cell({
        isShaded: isBlack,
        add_unshaded: add_dot,
    });
    CellConnected({
        isShaded: isBlack,
        isUnshaded: c => c.qsub === CQSUB.dot || c.qnums.length > 0,
        add_shaded: add_black,
        add_unshaded: add_dot,
        isNotPassable: (c, nb, nc) => {
            let d = [0, 1, 2, 3].find(d => offset(c, 1, 0, d) === nc);
            if (d === undefined) { return true; }
            if ([[0, -1], [0, 1], [1, -1], [1, 1]].some(([x, y]) => {
                let cc = offset(c, x, y, d);
                if (cc.qnums.length === 4) { return true; }
                if (cc.qnums.length > 0 && cc.qnums.every(n => n === 1)) { return true; }
                return false;
            })) { return true; }
            return false;
        }
    });
    let check = function (qnums, s) {
        if (s === "11111111") { return qnums.length === 1 && (qnums[0] === 8 || qnums[0] === CQNUM.quesmark); }
        if (s === "00000000") { return qnums.length === 1 && (qnums[0] === 0 || qnums[0] === CQNUM.quesmark); }
        while (s[0] !== '0') {
            s = s.slice(1) + s[0];
        }
        s = s.split('0').filter(s => s.length > 0).map(s => s.length);
        if (s.length !== qnums.length) { return false; }
        for (let i = 0; i < qnums.length; i++) {
            if (qnums[i] === CQNUM.quesmark) { continue; }
            if (!s.includes(qnums[i])) { return false; }
            s.splice(s.indexOf(qnums[i]), 1);
        }
        return s.length === qnums.filter(n => n === CQNUM.quesmark).length;
    };
    let isEmpty = c => !c.isnull && !isBlack(c) && !isDot(c) && c.qnums.length === 0;
    forEachCell(cell => {
        if (cell.qnums.length === 0) { return; }
        let list = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]].map(([x, y]) => offset(cell, x, y));
        let mask = parseInt(list.map(c => isEmpty(c) ? "1" : "0").join(""), 2);
        let blk = parseInt(list.map(c => isBlack(c) ? "1" : "0").join(""), 2);
        let setb = 0b11111111, setd = 0b00000000, n = 0;
        for (let j = mask; j >= 0; j--) {
            j &= mask;
            if (check(cell.qnums, (j | blk).toString(2).padStart(8, '0'))) {
                setb &= (j | blk);
                setd |= (j | blk);
                n++;
            }
        }
        if (n === 0) {
            add_black(cell);
            return;
        }
        setb = setb.toString(2).padStart(8, '0');
        setd = setd.toString(2).padStart(8, '0');
        for (let j = 0; j < 8; j++) {
            if (setb[j] === '1') {
                add_black(list[j], true);
            }
            if (setd[j] === '0') {
                add_dot(list[j]);
            }
        }
    });
}

function LightandShadowAssist() {
    let add_black = function (c) {
        if (c.isnull || c.qans !== CQANS.none) { return; }
        c.setQans(CQANS.black);
        c.draw();
        stepcheck(true);
    };
    let add_white = function (c) {
        if (c.isnull || c.qans !== CQANS.none) { return; }
        c.setQans(CQANS.white);
        c.draw();
        stepcheck(true);
    };
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none && cell.ques === 1) {
            add_black(cell);
        }
        if (cell.qnum !== CQNUM.none && cell.ques === 0) {
            add_white(cell);
        }
    });
    SizeRegion_Cell({
        isShaded: isBlack,
        isUnshaded: c => c.qans === CQANS.white,
        add_shaded: add_black,
        add_unshaded: add_white,
        NoUnshadedNum: false,
    });
    SizeRegion_Cell({
        isShaded: c => c.qans === CQANS.white,
        isUnshaded: isBlack,
        add_shaded: add_white,
        add_unshaded: add_black,
        NoUnshadedNum: false,
    });
}

function SlalomAssist() {
    const stc = board.getc(board.startpos.bx, board.startpos.by);
    const gatecnt = board.gatemgr.components.length;
    let add_order = function (c, n) {
        if (c === undefined || c.isnull || c.ques === 1 || c.anum !== CANUM.none || n === CANUM.none) { return; }
        stp2cnt++;
        c.setAnum(n);
    };
    let add_arrow = function (b, dir) {
        if (b === undefined || b.isnull || b.qsub !== BQSUB.none) { return; }
        b.setQsub(dir);
        b.draw();
        stepcheck(true);
    };
    stc.anum = 0;
    SingleLoopInCell({
        isPassable: c => c.ques !== 1,
        isPass: c => c === stc,
        Directed: true,
    });
    let gaten = new Set(Array.from(board.cell).map(c => c.anum).filter(n => n !== CANUM.none));
    let getTrailDir = function (t) { // get direction of a trail. 0: forward, 1: backward, 2: unknown, -1: broken
        if (t.length % 2 === 0 && t.every((c, i) => c === t[i % (t.length / 2)])) { t = t.slice(t.length / 2); }
        let qn = t.flatMap(c => c === stc || c.gate !== null ? c.anum : []);
        let qn2 = [...qn].reverse();
        let f = function (l) {
            let t = unique(l.flatMap((n, i) => n === CANUM.none ? [] : (n - i + gatecnt + 1) % (gatecnt + 1)));
            if (t.length === 0) { return true; }
            if (t.length > 1) { return false; }
            t = t[0];
            if (l.some((n, i) => n === CANUM.none && gaten.has((i + t) % (gatecnt + 1)))) { return false; }
            return true;
        };
        if (f(qn) && f(qn2)) { return 2; }
        if (f(qn)) { return 0; }
        if (f(qn2)) { return 1; }
        return -1;
    };
    for (let gate of board.gatemgr.components) {
        let clist = Array.from(gate.clist), d = (gate.vert ? 0 : 1);
        clist = clist.sort((c1, c2) => c1.id - c2.id);
        clist.forEach(c => {
            add_cross(offset(c, 0, -.5, d));
            add_cross(offset(c, 0, +.5, d));
            add_order(c, gate.number);
        });
        NShadeInClist({
            isShaded: c => c.lcnt > 0,
            isUnshaded: c => adjlist(c.adjborder).filter(b => isntLine(b)).length > 2,
            add_shaded: c => (add_line(offset(c, .5, 0, d)), add_line(offset(c, -.5, 0, d))),
            add_unshaded: c => forEachSide(c, (nb, nc) => add_cross(nb)),
            clist: clist,
            n: 1,
        });
        let c1 = clist[0], c2 = clist[clist.length - 1];
        if ([CRQSUB.in, CRQSUB.out].includes(offset(c2, .5, .5).qsub)) {
            add_inout(offset(c1, -.5, -.5), offset(c2, .5, .5).qsub ^ 1);
        }
        if ([CRQSUB.in, CRQSUB.out].includes(offset(c1, -.5, -.5).qsub)) {
            add_inout(offset(c2, .5, .5), offset(c1, -.5, -.5).qsub ^ 1);
        }
    }
    forEachBorder(border => {
        if (!isLine(border) && !isCross(border)) {
            let t = border.sidecell.map(c => {
                let d = [0, 1, 2, 3].find(d => offset(c, .5, 0, d) === border);
                let tr = cellTrail(c, d, true);
                tr.shift();
                return tr;
            });
            t = [...t[0].reverse(), ...t[1]];
            if (getTrailDir(t) === -1) { add_cross(border); }
        }
    });
    forEachCell(cell => {
        if (cell.ques === 1) { forEachSide(cell, (nb, nc) => add_cross(nb)); }
        for (let d = 0; d < 4; d++) {
            if (cell.lcnt === 1 && isLine(offset(cell, .5, 0, d)) && offset(cell, .5, 0, d).qsub === BQSUB.none) {
                let dl = [[cell.adjborder.right, BQSUB.arrow_rt, BQSUB.arrow_lt], [cell.adjborder.top, BQSUB.arrow_up, BQSUB.arrow_dn], [cell.adjborder.left, BQSUB.arrow_lt, BQSUB.arrow_rt], [cell.adjborder.bottom, BQSUB.arrow_dn, BQSUB.arrow_up],];
                let dir = getTrailDir(cellTrail(cell, d, true));
                if (dir === -1 || dir === 2) { continue; }
                add_arrow(offset(cell, .5, 0, d), dl[d][dir + 1]);
            }
            if (cell.lcnt === 1 && isLine(offset(cell, .5, 0, d)) && offset(cell, .5, 0, d).qsub !== BQSUB.none) {
                let clist = cellTrail(cell, d, true).filter(c => c === stc || c.gate !== null);
                if ([BQSUB.arrow_rt, BQSUB.arrow_up, BQSUB.arrow_lt, BQSUB.arrow_dn,][d] !== offset(cell, .5, 0, d).qsub) {
                    clist.reverse();
                }
                let t = clist.flatMap((c, i) => c.anum !== CANUM.none ? (c.anum - i + gatecnt + 1) % (gatecnt + 1) : []);
                if (t.length > 0) {
                    t = t[0];
                    clist.forEach((c, i) => add_order(c, (i + t) % (gatecnt + 1)));
                }
            }
        }
    });
}

function StarbattleAssist() {
    // TODO: check if there are exactly n dot/star in region/row/column
    let isCircle = b => !b.isnull && b.qsub === 1;
    let isStar = isBlack;
    let starcount = board.starCount.count;
    let add_star = add_black;
    let add_cir = function (b) {
        if (b === undefined || b.isnull || isLine(b) || b.qsub !== BQSUB.none) { return; }
        if (b.bx % 2 === 0 && b.by % 2 === 0) {
            if (adjlist(b.adjborder).some(b => isCircle(b))) { return; }
        }
        if (b.bx === board.minbx) { b = offset(b, +.5, 0); }
        if (b.bx === board.maxbx) { b = offset(b, -.5, 0); }
        if (b.by === board.minby) { b = offset(b, 0, +.5); }
        if (b.by === board.maxby) { b = offset(b, 0, -.5); }
        if (b.bx % 2 === 1 && b.by % 2 === 1) {
            add_star(b);
            return;
        }
        b.setQsub(1);
        b.draw();
        stepcheck(b.qsub === 1);
    };
    if (board.rows === starcount * 4) {
        let ct = board.getobj(board.cols, board.rows);
        for (let i = 0; i < starcount; i++) {
            for (let j = 0; j < starcount; j++) {
                for (let d = 0; d < 4; d++) {
                    add_cir(offset(ct, 2 * i + 1, 2 * j + 1, d));
                    add_dot(offset(ct, 2 * i + 0.5, 2 * j + 0.5, d));
                    add_dot(offset(ct, 2 * i + 1.5, 2 * j + 1.5, d));
                }
            }
        }
    }
    // try covering area with 2*2
    let tryCovering = function (clist, n = starcount) {
        clist = clist.filter(c => !isDot(c));
        if (clist.filter(c => c.qsub !== CQSUB.dot).length <= n * 4) {
            let fg = false;
            let dfs = function (list = [], dlist = []) {
                if (list.filter(c => clist.includes(c)).length + (n - dlist.length) * 4 < clist.length) { return; }
                if (dlist.length === n) {
                    dlist.forEach(b => add_cir(b));
                    list.forEach(c => {
                        if (!clist.includes(c)) {
                            add_dot(c);
                        }
                    });
                    fg = true;
                }
                if (fg) { return; }
                let c = clist.find(cc => !list.includes(cc));
                if (c === undefined) { return; }
                for (let d = 0; d < 4; d++) {
                    let l = [c, offset(c, 1, 0, d), offset(c, 0, 1, d), offset(c, 1, 1, d)].filter(cc => !c.isnull);
                    if (l.some(cc => list.includes(cc))) { continue; }
                    dfs([...list, ...l], [...dlist, offset(c, .5, .5, d)]);
                    if (fg) { return; }
                }
            };
            dfs();
        }
    };
    for (let i = 0; i < board.rows - 1; i++) {
        let hclist = [], vclist = [];
        for (let j = 0; j < board.cols; j++) {
            hclist.push(board.getc(j * 2 + 1, i * 2 + 1));
            hclist.push(board.getc(j * 2 + 1, i * 2 + 3));
            vclist.push(board.getc(i * 2 + 1, j * 2 + 1));
            vclist.push(board.getc(i * 2 + 3, j * 2 + 1));
        }
        tryCovering(hclist, starcount * 2);
        tryCovering(vclist, starcount * 2);
    }
    forEachRoom(room => {
        let clist = Array.from(room.clist).filter(c => !isDot(c));
        // finish room
        if (clist.filter(c => c.qans === CQANS.star).length === starcount) {
            clist.forEach(c => add_dot(c));
        }
        if (clist.filter(c => c.qsub !== CQSUB.dot).length === starcount) {
            clist.forEach(c => add_star(c));
        }
        tryCovering(clist);
    });
    for (let i = 0; i < board.rows; i++) {
        let hclist = [];
        let vclist = [];
        for (let j = 0; j < board.cols; j++) {
            hclist.push(board.getc(2 * j + 1, 2 * i + 1));
            vclist.push(board.getc(2 * i + 1, 2 * j + 1));
        }
        hclist = hclist.filter(c => !isDot(c));
        vclist = vclist.filter(c => !isDot(c));
        // finish row/col
        if (hclist.filter(c => isStar(c) || !isStar(c) && !isStar(c.adjacent.right) &&
            isCircle(c.adjborder.right) && !isCircle(c.adjborder.left)).length === starcount) {
            hclist.forEach(c => !isCircle(c.adjborder.left) && !isCircle(c.adjborder.right) && add_dot(c));
        }
        if (vclist.filter(c => isStar(c) || !isStar(c) && !isStar(c.adjacent.bottom) &&
            isCircle(c.adjborder.bottom) && !isCircle(c.adjborder.top)).length === starcount) {
            vclist.forEach(c => !isCircle(c.adjborder.top) && !isCircle(c.adjborder.bottom) && add_dot(c));
        }
        for (let j = 0; j < hclist.length; j++) {
            if (hclist[j].adjacent.right === hclist[j + 1]) {
                hclist[j] = [hclist[j], hclist[j + 1]];
                hclist.splice(j + 1, 1);
            } else {
                hclist[j] = [hclist[j]];
            }
        }
        if (hclist.length === starcount) {
            hclist.forEach(l => {
                if (l.length === 1) {
                    add_star(l[0]);
                }
                if (l.length === 2) {
                    add_cir(l[0].adjborder.right);
                }
            });
        }
        for (let j = 0; j < vclist.length; j++) {
            if (vclist[j].adjacent.bottom === vclist[j + 1]) {
                vclist[j] = [vclist[j], vclist[j + 1]];
                vclist.splice(j + 1, 1);
            } else {
                vclist[j] = [vclist[j]];
            }
        }
        if (vclist.length === starcount) {
            vclist.forEach(l => {
                if (l.length === 1) {
                    add_star(l[0]);
                }
                if (l.length === 2) {
                    add_cir(l[0].adjborder.bottom);
                }
            });
        }
    }
    forEachCell(cell => {
        if (cell.qans === CQANS.star) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    add_dot(offset(cell, dx, dy));
                }
            }
        }
    });
    // adjust circle
    for (let i = 0; i < board.cross.length; i++) {
        let cross = board.cross[i];
        if (cross.qsub !== 1) { continue; }
        for (let d = 0; d < 4; d++) {
            if (offset(cross, .5, .5, d).qsub === CQSUB.dot && offset(cross, -.5, .5, d).qsub === CQSUB.dot) {
                add_cir(offset(cross, 0, -.5, d));
                if (offset(cross, 0, -.5, d).qsub === 1) {
                    cross.setQsub(0);
                    cross.draw();
                }
            }
        }
    }
    for (let i = 0; i < board.border.length; i++) {
        let border = board.border[i];
        if (border.qsub !== 1) { continue; }
        if (border.isvert) {
            add_dot(offset(border, -.5, -1));
            add_dot(offset(border, +.5, -1));
            add_dot(offset(border, -.5, +1));
            add_dot(offset(border, +.5, +1));
        } else {
            add_dot(offset(border, -1, -.5));
            add_dot(offset(border, -1, +.5));
            add_dot(offset(border, +1, -.5));
            add_dot(offset(border, +1, +.5));
        }
        for (let j = 0; j < 2; j++) {
            if (border.sidecell[j].qsub === CQSUB.dot) {
                add_star(border.sidecell[1 - j]);
            }
        }
    }
}

function CastleWallAssist() {
    SingleLoopInCell({
        isPassable: c => c.qnum === CQNUM.none,
    });
    // add invisible qsub at cross
    forEachBorder(border => {
        if (border.sidecell.some(c => c.qnum !== CQNUM.none)) {
            if (border.sidecross[1].qsub !== CRQSUB.none) { add_inout(border.sidecross[0], border.sidecross[1].qsub); }
            if (border.sidecross[0].qsub !== CRQSUB.none) { add_inout(border.sidecross[1], border.sidecross[0].qsub); }
        }
    });
    forEachCell(cell => {
        if (isClue(cell)) {
            // add qsub around b/w clue
            if (cell.ques === CQUES.black || cell.ques === CQUES.white) {
                for (let d = 0; d < 4; d++) {
                    add_inout(offset(cell, .5, .5, d), (cell.ques === CQUES.black ? CRQSUB.out : CRQSUB.in));
                }
            }
            // finish clue
            if (isNum(cell)) {
                let d = qdirRemap(cell.qdir);
                let borderlist = [];
                let pcell = offset(cell, 1, 0, d);
                let qnum = cell.qnum;
                while (!pcell.isnull && (pcell.qnum < 0 || pcell.qdir !== cell.qdir)) {
                    let b = offset(pcell, .5, 0, d);
                    if (!b.isnull && b.sidecell[0].qnum === CQNUM.none && b.sidecell[1].qnum === CQNUM.none) {
                        borderlist.push(b);
                    }
                    pcell = offset(pcell, 1, 0, d);
                }
                if (!pcell.isnull) {
                    qnum -= pcell.qnum;
                }
                if (borderlist.filter(b => isLine(b)).length === qnum) {
                    borderlist.forEach(b => add_cross(b));
                }
                if (borderlist.filter(b => b.qsub === BQSUB.none).length === qnum) {
                    borderlist.forEach(b => add_line(b));
                }
            }
        }
    });
}

function NurimisakiAssist() {
    const isCircle = c => !c.isnull && isClue(c);
    const isDot = c => !c.isnull && c.qsub === CQSUB.dot && !isCircle(c);
    const isEmpty = c => !c.isnull && !isCircle(c) && !isDot(c) && !isBlack(c);
    const isntBlack = c => isCircle(c) || isDot(c);
    CellConnected({
        isShaded: isntBlack,
        isUnshaded: isBlack,
        add_shaded: add_dot,
        add_unshaded: add_black,
    });
    CellConnected({
        isShaded: isDot,
        isUnshaded: c => isBlack(c) || isCircle(c),
        add_shaded: add_dot,
        add_unshaded: add_black,
    });
    const legend = {
        "#": c => c.isnull || isBlack(c),
        "█": isBlack,
        "O": isCircle,
        ".": isDot,
        "~": isntBlack,
        "-": c => !c.isnull,
        "_": c => !c.isnull && !isClue(c) && !isBlack(c),
        "*": c => !c.isnull && !isCircle(c),
        "X": c => c.isnull || !isClue(c) && !isDot(c),
        "2": c => c.qnum === 2,
        "3": c => c.qnum === 3,
        "+": c => c.qnum > 3,
    };
    const deduce = {
        "*": add_dot,
        "X": add_black,
    };
    const patterns = [
        [" X ", "XOX", " ~ "],
        [" # ", "#O#", " * "],
        [" # ", "#X#"],
        [" # ", "*.*", " # "],
        [" # ", "#.*", " * "],
        ["██", "█*"],
        ["~~", "~X"],
        ["#_█", " *█"],
        ["#_*", " ██"],
        ["#__*", " ██ "],
        ["#_.*", " ## "],
        ["#XX#", " ## "],
        ["#__#", " █* "],
        ["#_█ ", " *_#"],
        ["#_█", " *_", "  #"],
        ["#_*", " █_", "  #"],
        [" ##", "#__", " *█"],
        ["█* ", "█_ ", "  ~"],
        [" * ", "#. ", "  ~"],
        [" # ", "#X ", "  ~"],
        ["#__#", "#_* ", " #  "],
        ["#__* ", "#___#", " ### "],
        ["█_  ", "█ OX", "  X "],
        [" █_  ", "#_ OX", "   X "],
        ["█_  ", "_ OX", "# X "],
        ["#__  ", " █ OX", "   X "],
        ["#__  ", "#_ OX", " # X "],
        ["#__#", "#_  ", "# OX", "  X "],
        [" ##  ", "#__  ", "#_ OX", "   X "],
        [" ###  ", "#___  ", "#__ OX", "    X "],
        ["#.  ", "  OX", "  X "],
        ["#__ ", "#*█O", "#__ "],
        [" #  ", "#~  ", "  OX", "  X "],
        ["#-  ", "#X_2", " ## "],
        ["#-   ", "#XX_2", " ##  "],
        ["#_*", "# _", " 3 "],
        ["█_ ", "* 3", "*  "],
        [" █_ ", "** +"],
        ["#X3", "#X ", "#_*"],
        ["#X+", "#X ", "#_*"],
        ["#__ ", "#* 3", "#__ "],
        ["3 ", "#X", " #"],
        ["+ ", "#X", " #"],
    ];
    patterns.forEach(pattern => patternDeduce({ pattern: pattern, legend: legend, deduce: deduce, }));

    forEachCell(cell => {
        if (isNum(cell)) {
            for (let d = 0; d < 4; d++) {
                if (!(() => {
                    let c = offset(cell, cell.qnum - 1, 0, d);
                    if (c.isnull || isNum(c) && c.qnum !== cell.qnum) { return false; }
                    if (isntBlack(offset(cell, cell.qnum, 0, d))) { return false; }
                    for (let i = 1; i < cell.qnum; i++) {
                        let pc = offset(cell, i, 0, d);
                        if (pc.isnull || isBlack(pc)) { return false; }
                        if (i !== cell.qnum - 1 && isCircle(pc)) { return false; }
                        if (isntBlack(offset(pc, -1, -1, d)) && isntBlack(offset(pc, 0, -1, d))) { return false; }
                        if (isntBlack(offset(pc, -1, 1, d)) && isntBlack(offset(pc, 0, 1, d))) { return false; }
                    }
                    return true;
                })()) { add_black(offset(cell, 1, 0, d)); }
                if (isDot(offset(cell, 1, 0, d))) {
                    add_black(offset(cell, cell.qnum, 0, d));
                    for (let i = 1; i < cell.qnum; i++) {
                        add_dot(offset(cell, i, 0, d));
                    }
                }
            }
        }
    });
}

function ChocoBananaAssist() {
    SizeRegion_Cell({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        OneNumPerRegion: false,
        NoUnshadedNum: false,
    });
    SizeRegion_Cell({
        isShaded: isGreen,
        isUnshaded: isBlack,
        add_shaded: add_green,
        add_unshaded: add_black,
        OneNumPerRegion: false,
        NoUnshadedNum: false,
    });
    RectRegion_Cell({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        isSizeAble: (w, h, sc, c) => {
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    if (offset(c, i, j).qnum > 0 && offset(c, i, j).qnum !== w * h) { return false; }
                }
            }
            return true;
        },
    });
    forEachCell(cell => {
        if (cell.qnum === 1 || cell.qnum === 2) { add_black(cell); }
        // non-rect
        if (isGreen(cell)) {
            let clist = getCellChunk(cell, (c, nb, nc) => isGreen(nc));
            let oclist = unique(clist.flatMap(c => adjlist(c.adjacent)).filter(nc => !nc.isnull && !isBlack(nc) && !clist.includes(nc)));
            if (!getShape(clist).includes('0') && oclist.length === 1) {
                add_green(oclist[0]);
            }
        }
    });
}

function CreekAssist() {
    CellConnected({
        isShaded: isGreen,
        isUnshaded: isBlack,
        add_shaded: add_green,
        add_unshaded: add_black,
        isNotPassable: (c, nb, nc) => {// there isn't board.border so here is a workaround
            for (let d = 0; d < 4; d++) {
                if (offset(c, 1, 0, d) === nc) {
                    if (offset(c, .5, -.5, d).qnum + [offset(c, 0, -1, d), offset(c, 1, -1, d)].filter(c => isntBlack(c)).length >= 3) { return true; }
                    if (offset(c, .5, +.5, d).qnum + [offset(c, 0, +1, d), offset(c, 1, +1, d)].filter(c => isntBlack(c)).length >= 3) { return true; }
                }
            }
        },
    });
    let dotcnt = 0;
    forEachCell(cell => {
        dotcnt += cell.qsub === CQSUB.dot;
    });
    for (let i = 0; i < board.cross.length; i++) {
        let cross = board.cross[i];
        let list = [board.getc(cross.bx - 1, cross.by - 1), board.getc(cross.bx - 1, cross.by + 1),
        board.getc(cross.bx + 1, cross.by - 1), board.getc(cross.bx + 1, cross.by + 1)];
        list = list.filter(c => !c.isnull);
        if (cross.qnum >= 0) {
            if (list.filter(c => isBlack(c)).length === cross.qnum) {
                list.forEach(c => add_dot(c));
            }
            if (list.filter(c => c.qsub !== CQSUB.dot).length === cross.qnum) {
                list.forEach(c => add_black(c));
            }
        }
        for (let d = 0; d < 4; d++) {
            let ncross = offset(cross, 1, 0, d);
            // ++++
            // +AB+
            // ++++
            if (cross.qnum >= 0 && ncross.qnum >= 0) {
                let n1 = cross.qnum, n2 = ncross.qnum;
                let r = [[offset(cross, -.5, -.5, d), offset(cross, -.5, +.5, d)],
                [offset(cross, +.5, -.5, d), offset(cross, +.5, +.5, d)],
                [offset(cross, 1.5, -.5, d), offset(cross, 1.5, +.5, d)]];
                let fn = l => [0, 1, 2].filter(n => n >= l.filter(c => isBlack(c)).length && n <= l.filter(c => !isntBlack(c)).length)
                let cand = getComb(r.map(l => fn(l)));
                cand = cand.filter(([a1, a2, a3]) => a1 + a2 === n1 && a2 + a3 === n2);
                for (let i = 0; i <= 2; i++) {
                    if (cand.length > 0 && cand.every(l => l[i] === cand[0][i])) {
                        NShadeInClist({ clist: r[i], n: cand[0][i] });
                    }
                }
            }
            // // + + + +    + + + +
            // //             ·   █ 
            // // + 1 3 + -> + 1 3 +
            // //             ·   █ 
            // // + + + +    + + + +
            // if (cross.qnum === 1 && offset(cross, 1, 0, d).qnum === 3) {
            //     add_dot(offset(cross, -.5, -.5, d));
            //     add_dot(offset(cross, -.5, +.5, d));
            //     add_black(offset(cross, 1.5, -.5, d));
            //     add_black(offset(cross, 1.5, +.5, d));
            // }
            // // + + + +    + + + +
            // //      ·      ·   ·
            // // + 1 2 + -> + 1 2 +
            // //             ·   █ 
            // // + + + +    + + + +
            // if (cross.qnum === 1 && offset(cross, 1, 0, d).qnum === 2 &&
            //     (isDot(offset(cross, 1.5, -.5, d)) || isDot(offset(cross, 1.5, +.5, d)))) {
            //     add_dot(offset(cross, -.5, -.5, d));
            //     add_dot(offset(cross, -.5, +.5, d));
            //     add_black(offset(cross, 1.5, -.5, d));
            //     add_black(offset(cross, 1.5, +.5, d));
            // }
            // // + + + +    + + + +
            // //      ·      ·   ·
            // // + 1 1 + -> + 1 1 +
            // //      ·      ·   ·
            // // + + + +    + + + +
            // if (cross.qnum === 1 && offset(cross, 1, 0, d).qnum === 1 &&
            //     (isDot(offset(cross, 1.5, -.5, d)) && isDot(offset(cross, 1.5, +.5, d)))) {
            //     add_dot(offset(cross, -.5, -.5, d));
            //     add_dot(offset(cross, -.5, +.5, d));
            // }
            // + + + + +    + + + + +
            //               █     █
            // + 3 2 3 + -> + 3 2 3 +
            //               █     █
            // + + + + +    + + + + +
            if (cross.qnum === 3 && offset(cross, 1, 0, d).qnum === 2 && offset(cross, 2, 0, d).qnum === 3) {
                add_black(offset(cross, -.5, -.5, d));
                add_black(offset(cross, -.5, +.5, d));
                add_black(offset(cross, 2.5, -.5, d));
                add_black(offset(cross, 2.5, +.5, d));
            }
            // + + + + +    + + + + +
            //               ·     ·
            // + 1 2 1 + -> + 1 2 1 +
            //               ·     ·
            // + + + + +    + + + + +
            if (cross.qnum === 1 && offset(cross, 1, 0, d).qnum === 2 && offset(cross, 2, 0, d).qnum === 1) {
                add_dot(offset(cross, -.5, -.5, d));
                add_dot(offset(cross, -.5, +.5, d));
                add_dot(offset(cross, 2.5, -.5, d));
                add_dot(offset(cross, 2.5, +.5, d));
            }
            // + + + +    + + + +
            //                   
            // + 3 + +    + 3 + +
            //         ->    █   
            // + + 3 +    + + 3 +
            //                   
            // + + + +    + + + +
            if (cross.qnum === 3 && offset(cross, 1, 1, d).qnum === 3 && dotcnt > 0) {
                add_black(offset(cross, .5, .5, d));
            }
        }
    }
}

function WagiriAssist() {
    let add_slash = function (c, qans) {
        if (c === undefined || c.isnull || c.qans !== CQANS.none) { return; }
        c.setQans(qans % 2 === 0 ? CQANS.lslash : CQANS.rslash);
        c.draw();
        stepcheck(true);
    };
    let isWa_輪 = c => !c.isnull && c.qnum === 1;
    let isKiri_切 = c => !c.isnull && c.qnum === 2;
    // record the qnum count/sum in (0,0) to (a,b)
    let scnt = Array.from(new Array(board.rows + 1), () => new Array(board.cols + 1).fill(0));
    let ncnt = Array.from(new Array(board.rows + 1), () => new Array(board.cols + 1).fill(0));
    for (let i = 0; i <= board.rows; i++) {
        for (let j = 0; j <= board.cols; j++) {
            let f = (arr, a, b) => a < 0 || b < 0 ? 0 : arr[a][b];
            scnt[i][j] = Math.max(0, board.getobj(2 * j, 2 * i).qnum);
            scnt[i][j] += f(scnt, i - 1, j) + f(scnt, i, j - 1) - f(scnt, i - 1, j - 1);
            ncnt[i][j] = board.getobj(2 * j, 2 * i).qnum >= 0 ? 1 : 0;
            ncnt[i][j] += f(ncnt, i - 1, j) + f(ncnt, i, j - 1) - f(ncnt, i - 1, j - 1);
        }
    }
    // check the clue for the four corners of the corresponding rectangle
    let getClue = function (cr1, cr2) {
        if (cr1.isnull || cr2.isnull) { return 0; }
        let [x1, x2] = [cr1.bx / 2, cr2.bx / 2].sort((x, y) => x - y);
        let [y1, y2] = [cr1.by / 2, cr2.by / 2].sort((x, y) => x - y);
        let f = (arr, a, b) => a < 0 || b < 0 ? 0 : arr[a][b];
        let res = f(scnt, y2, x2) - f(scnt, y1 - 1, x2) - f(scnt, y2, x1 - 1) + f(scnt, y1 - 1, x1 - 1);
        res -= (Math.min(x2 + 1, board.cols) - Math.max(x1 - 1, 0)) * (y2 - y1);
        res -= (Math.min(y2 + 1, board.rows) - Math.max(y1 - 1, 0)) * (x2 - x1);
        return [res, (x2 - x1 + 1) * (y2 - y1 + 1) - (f(ncnt, y2, x2) - f(ncnt, y1 - 1, x2) - f(ncnt, y2, x1 - 1) + f(ncnt, y1 - 1, x1 - 1))];
    }
    forEachCross(cross => {
        // finish clue
        // clue can be grouped in a rectangle and look at only four corners
        for (let dx = 0; getClue(cross, offset(cross, dx, 0))[1] <= 1; dx++) {
            for (let dy = 0; getClue(cross, offset(cross, dx, dy))[1] <= 1; dy++) {
                let [qnum, lckn] = getClue(cross, offset(cross, dx, dy));
                // extreme value for one missing clue
                if (lckn > 0 && qnum !== -4 * lckn && qnum !== 4) { continue; }
                if (qnum < 0) { qnum = 0; }
                let adjclist = [[offset(cross, -.5, -.5), CQANS.rslash, CQANS.lslash],
                [offset(cross, -.5, dy + .5), CQANS.lslash, CQANS.rslash],
                [offset(cross, dx + .5, -.5), CQANS.lslash, CQANS.rslash],
                [offset(cross, dx + .5, dy + .5), CQANS.rslash, CQANS.lslash]];
                adjclist = adjclist.filter(c => !c[0].isnull);
                if (adjclist.filter(c => c[0].qans === c[1]).length === qnum) {
                    adjclist.forEach(c => add_slash(c[0], c[2]));
                }
                if (adjclist.filter(c => c[0].qans !== c[2]).length === qnum) {
                    adjclist.forEach(c => add_slash(c[0], c[1]));
                }
            }
        }
    });
    forEachCell(cell => {
        // 輪
        if (cell.qans === CQANS.none && isWa_輪(cell)) {
            let cr1, cr2;
            let crlist = [];
            let DFS = function (cr) {
                if (crlist.includes(cr) || cr.qnum === 1) { return false; }
                if (cr === cr2) { return true; }
                crlist.push(cr);
                return [[-1, -1, CQANS.rslash], [+1, -1, CQANS.lslash], [-1, +1, CQANS.lslash], [+1, +1, CQANS.rslash]].some(([dx, dy, cq]) => {
                    let nc = offset(cr, dx / 2, dy / 2);
                    if (nc.isnull || isKiri_切(nc) || nc === cell || nc.qans !== CQANS.none && nc.qans !== cq) { return false; }
                    return DFS(offset(cr, dx, dy));
                });
            };
            [cr1, cr2] = [offset(cell, +.5, -.5), offset(cell, -.5, +.5)];
            if (!DFS(cr1)) { add_slash(cell, CQANS.rslash); }
            [cr1, cr2] = [offset(cell, -.5, -.5), offset(cell, +.5, +.5)];
            if (!DFS(cr1)) { add_slash(cell, CQANS.lslash); }
        }
        if (cell.qans !== CQANS.none && isWa_輪(cell)) {
            let cr1, cr2;
            if (cell.qans === CQANS.lslash) { [cr1, cr2] = [offset(cell, +.5, -.5), offset(cell, -.5, +.5)]; }
            if (cell.qans === CQANS.rslash) { [cr1, cr2] = [offset(cell, -.5, -.5), offset(cell, +.5, +.5)]; }
            // use Tarjan Algorithm to find bridge
            let low = new Map(), dfn = new Map(), idx = 0;
            let tarjan = function (cr, fcr) {
                let has_cr2 = (cr === cr2);
                idx++;
                low.set(cr, idx);
                dfn.set(cr, idx);
                [[-1, -1, CQANS.rslash], [+1, -1, CQANS.lslash], [-1, +1, CQANS.lslash], [+1, +1, CQANS.rslash]].forEach(([dx, dy, cq]) => {
                    let nc = offset(cr, dx / 2, dy / 2), ncr = offset(cr, dx, dy);
                    if (nc.isnull || isKiri_切(nc) || nc === cell || ncr.qnum === 1 || nc.qans !== CQANS.none && nc.qans !== cq) { return; }
                    if (!dfn.has(ncr)) {
                        let t = tarjan(ncr, cr);
                        has_cr2 ||= t;
                        low.set(cr, Math.min(low.get(cr), low.get(ncr)));
                        if (low.get(ncr) > dfn.get(cr) && t) { add_slash(nc, cq); }
                    } else if (ncr !== fcr) {
                        low.set(cr, Math.min(low.get(cr), dfn.get(ncr)));
                    }
                });
                return has_cr2;
            }
            tarjan(cr1, cr1);
        }
        // 切
        for (let d = 0; d < 2; d++) {
            let [cr1, cr2] = [offset(cell, -.5, -.5, d), offset(cell, +.5, +.5, d)];
            if (cell.qans === CQANS.none && cr1.path !== null && cr1.path === cr2.path) {
                let crlist = [], r = isKiri_切(cell);
                let DFS = function (cr, t = false) {
                    if (cr === cr2) { r ||= t; return; }
                    if (crlist.includes(cr)) { return; }
                    crlist.push(cr);
                    [[-1, -1, CQANS.rslash], [+1, -1, CQANS.lslash], [-1, +1, CQANS.lslash], [+1, +1, CQANS.rslash]].forEach(([dx, dy, cq]) => {
                        let nc = offset(cr, dx / 2, dy / 2)
                        if (nc.qans === cq) { DFS(offset(cr, dx, dy), t || isKiri_切(nc)); }
                    });
                };
                DFS(cr1);
                if (r) { add_slash(cell, d); }
            }
        }
    });
}

function SlantAssist() {
    let add_slash = function (c, qans) {
        if (c === undefined || c.isnull || c.qans !== CQANS.none) { return; }
        c.setQans(qans % 2 === 0 ? CQANS.lslash : CQANS.rslash);
        c.draw();
        stepcheck(true);
    };
    let isNotSide = function (c) {
        return c.bx > board.minbx && c.bx < board.maxbx && c.by > board.minby && c.by < board.maxby;
    }
    // record the qnum count/sum in (0,0) to (a,b)
    let scnt = Array.from(new Array(board.rows + 1), () => new Array(board.cols + 1).fill(0));
    let ncnt = Array.from(new Array(board.rows + 1), () => new Array(board.cols + 1).fill(0));
    for (let i = 0; i <= board.rows; i++) {
        for (let j = 0; j <= board.cols; j++) {
            let f = (arr, a, b) => a < 0 || b < 0 ? 0 : arr[a][b];
            scnt[i][j] = Math.max(0, board.getobj(2 * j, 2 * i).qnum);
            scnt[i][j] += f(scnt, i - 1, j) + f(scnt, i, j - 1) - f(scnt, i - 1, j - 1);
            ncnt[i][j] = board.getobj(2 * j, 2 * i).qnum >= 0 ? 1 : 0;
            ncnt[i][j] += f(ncnt, i - 1, j) + f(ncnt, i, j - 1) - f(ncnt, i - 1, j - 1);
        }
    }
    // check the clue for the four corners of the corresponding rectangle
    let getClue = function (cr1, cr2) {
        if (cr1.isnull || cr2.isnull) { return 0; }
        let [x1, x2] = [cr1.bx / 2, cr2.bx / 2].sort((x, y) => x - y);
        let [y1, y2] = [cr1.by / 2, cr2.by / 2].sort((x, y) => x - y);
        let f = (arr, a, b) => a < 0 || b < 0 ? 0 : arr[a][b];
        let res = f(scnt, y2, x2) - f(scnt, y1 - 1, x2) - f(scnt, y2, x1 - 1) + f(scnt, y1 - 1, x1 - 1);
        res -= (Math.min(x2 + 1, board.cols) - Math.max(x1 - 1, 0)) * (y2 - y1);
        res -= (Math.min(y2 + 1, board.rows) - Math.max(y1 - 1, 0)) * (x2 - x1);
        return [res, (x2 - x1 + 1) * (y2 - y1 + 1) - (f(ncnt, y2, x2) - f(ncnt, y1 - 1, x2) - f(ncnt, y2, x1 - 1) + f(ncnt, y1 - 1, x1 - 1))];
    }
    forEachCross(cross => {
        // finish clue
        // clue can be grouped in a rectangle and look at only four corners
        for (let dx = 0; getClue(cross, offset(cross, dx, 0))[1] <= 1; dx++) {
            for (let dy = 0; getClue(cross, offset(cross, dx, dy))[1] <= 1; dy++) {
                let [qnum, lckn] = getClue(cross, offset(cross, dx, dy));
                // extreme value for one missing clue
                if (lckn > 0 && qnum !== -4 * lckn && qnum !== 4) { continue; }
                if (qnum < 0) { qnum = 0; }
                let adjclist = [[offset(cross, -.5, -.5), CQANS.rslash, CQANS.lslash],
                [offset(cross, -.5, dy + .5), CQANS.lslash, CQANS.rslash],
                [offset(cross, dx + .5, -.5), CQANS.lslash, CQANS.rslash],
                [offset(cross, dx + .5, dy + .5), CQANS.rslash, CQANS.lslash]];
                adjclist = adjclist.filter(c => !c[0].isnull);
                if (adjclist.filter(c => c[0].qans === c[1]).length === qnum) {
                    adjclist.forEach(c => add_slash(c[0], c[2]));
                }
                if (adjclist.filter(c => c[0].qans !== c[2]).length === qnum) {
                    adjclist.forEach(c => add_slash(c[0], c[1]));
                }
            }
        }
        for (let d = 0; d < 4; d++) {
            // + + + +    + + + +
            //                   
            // + 1 + +    + 1 + +
            //         ->    ╱   
            // + + 1 +    + + 1 +
            //                   
            // + + + +    + + + +
            if (cross.qnum === 1 && isNotSide(cross)) {
                let cross2 = offset(cross, 1, 1, d);
                if (cross2.qnum === 1 && isNotSide(cross2)) {
                    add_slash(offset(cross, .5, .5, d), CQANS.lslash + d);
                }
            }
            // no loop for 2 or 3
            if (offset(cross, .5, .5, d).qans === CQANS.none && offset(cross, 1, -1, d).path !== null && offset(cross, 1, -1, d).path === offset(cross, 1, 1, d).path) {
                if (cross.qnum === 3 || cross.qnum === 2 &&
                    (offset(cross, -.5, -.5, d).qans === (d % 2 === 0 ? CQANS.lslash : CQANS.rslash) ||
                        offset(cross, -.5, +.5, d).qans === (d % 2 === 1 ? CQANS.lslash : CQANS.rslash))) {
                    add_slash(offset(cross, -.5, -.5, d), CQANS.rslash + d);
                    add_slash(offset(cross, -.5, +.5, d), CQANS.lslash + d);
                }
            }
            if (offset(cross, -.5, .5, d).qans === CQANS.none && offset(cross, 1, -1, d).path !== null && offset(cross, 1, -1, d).path === offset(cross, -1, 1, d).path) {
                if (cross.qnum === 3 || cross.qnum === 2 &&
                    (offset(cross, -.5, -.5, d).qans === (d % 2 === 0 ? CQANS.lslash : CQANS.rslash) ||
                        offset(cross, +.5, +.5, d).qans === (d % 2 === 0 ? CQANS.lslash : CQANS.rslash))) {
                    add_slash(offset(cross, -.5, -.5, d), CQANS.rslash + d);
                    add_slash(offset(cross, +.5, +.5, d), CQANS.rslash + d);
                }
            }
        }
    });
    // no loop
    // + + +    + + +
    //  / \      / \ 
    // + + + -> + + +
    //    /      / / 
    // + + +    + + +
    forEachCell(cell => {
        if (cell.qans !== CQANS.none) { return; }
        for (let d = 0; d < 2; d++) {
            let cross1 = offset(cell, -.5, -.5, d), cross2 = offset(cell, .5, .5, d);
            if (cross1.path !== null && cross1.path === cross2.path) {
                add_slash(cell, CQANS.lslash + d);
            }
        }
    });
}

function NuribouAssist() {
    StripRegion_cell({
        isShaded: isBlack,
        add_unshaded: add_green,
    });
    SizeRegion_Cell({
        isShaded: isGreen,
        isUnshaded: isBlack,
        add_shaded: add_green,
        add_unshaded: c => add_black(c, true),
    });
    let clen = new Map();
    forEachCell(cell => {
        if (!isBlack(cell) || adjlist(cell.adjacent).filter(c => isBlack(c)).length > 1) { return; }
        let clist = [cell];
        let d = [0, 1, 2, 3].find(d => isBlack(offset(cell, 1, 0, d)));
        if (d === undefined) {
            if (adjlist(cell.adjacent).every(nc => isntBlack(nc))) { clen.set(cell, 1); }
            return;
        }
        let pcell = offset(cell, 1, 0, d);
        while (isBlack(pcell)) {
            clist.push(pcell);
            pcell = offset(pcell, 1, 0, d);
        }
        if (isntBlack(pcell) && isntBlack(offset(cell, -1, 0, d))) {
            clist.forEach(c => clen.set(c, clist.length));
        }
    });
    forEachCell(cell => {
        if (!isBlack(cell) || adjlist(cell.adjacent).filter(c => isBlack(c)).length > 1) { return; }
        if (adjdiaglist(cell).some(c => clen.get(c) === 1) && adjlist(cell.adjacent).filter(c => !isntBlack(c)).length === 1) {
            add_black(adjlist(cell.adjacent).find(c => !isntBlack(c)));
        }
        if (adjdiaglist(cell).some(c => clen.get(c) === 2) && [0, 1, 2, 3].every(d => isntBlack(offset(cell, 1, 0, d)) || isntBlack(offset(cell, 2, 0, d)))) {
            forEachSide(cell, (nb, nc) => add_green(nc));
        }
        let d = [0, 1, 2, 3].find(d => isBlack(offset(cell, 1, 0, d)));
        if (d === undefined) { return; }
        let l = 1;
        while (isBlack(offset(cell, l, 0, d))) { l++; }
        if (adjdiaglist(cell).some(c => clen.get(c) === l)) { add_black(offset(cell, l, 0, d)); }
        if (adjdiaglist(cell).some(c => clen.get(c) === l + 1) && isntBlack(offset(cell, l + 1, 0, d))) { add_green(offset(cell, l, 0, d)); }
    });
}

function NurikabeAssist() {
    CellConnected({
        isShaded: isBlack,
        isUnshaded: c => c.qsub === CQSUB.dot || c.qnum !== CQNUM.none,
        add_shaded: c => add_black(c, true),
        add_unshaded: add_dot,
    });
    No2x2Cell({
        isShaded: isBlack,
        add_unshaded: add_dot,
    });
    SizeRegion_Cell({
        isShaded: c => c.qsub === CQSUB.dot || c.qnum !== CQNUM.none,
        isUnshaded: isBlack,
        add_shaded: add_dot,
        add_unshaded: c => add_black(c, true),
    });
    const isntDot = c => c.isnull || isBlack(c);
    forEachCell(cell => {
        if (cell.qnum !== 2) { return; }
        for (let d = 0; d < 4; d++) {
            //  █      █ 
            // █2  -> █2 
            //          █
            if (isntDot(offset(cell, -1, 0, d)) && isntDot(offset(cell, 0, -1, d))) {
                add_black(offset(cell, 1, 1, d));
            }
        }
    });
}

function GuideArrowAssist() {
    const goalcell = board.getc(board.goalpos.bx, board.goalpos.by);
    let add_arrow = function (c, n) {
        if (c === undefined || c.isnull || c.anum !== CANUM.none || c === goalcell) { return; }
        c.setAnum(n);
        c.draw();
        if (c.qnum !== CQNUM.none) { stp2cnt++; }
        else { stepcheck(true); }
    };
    BlackNotAdjacent();
    GreenConnected();
    GreenNoLoopInCell();
    CellConnected({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        OnlyDiagDir: true,
        OutsideAsShaded: true,
    });
    // use anum to save the direction
    forEachCell(cell => {
        if (cell === goalcell || cell.qnum !== CQNUM.none) { add_green(cell); }
        if (cell === goalcell) { return; }
        if (cell.qnum !== CQNUM.none && cell.qnum !== CQNUM.quesmark) {
            let d = qdirRemap(cell.qnum);
            add_green(offset(cell, 1, 0, d));
            add_arrow(cell, [4, 1, 3, 2][d]);
        }
        if (!isGreen(cell) && adjlist(cell.adjacent).filter(c => c === goalcell || c.anum !== CANUM.none).length > 1) { add_black(cell); }
        // single out
        if (isGreen(cell)) {
            let l = adjlist(cell.adjacent).filter(c => !c.isnull && !isBlack(c) && (c === goalcell || c.anum === CANUM.none || offset(c, 1, 0, qdirRemap(c.anum)) !== cell));
            if (l.length === 1) {
                let d = [0, 1, 2, 3].find(dd => offset(cell, 1, 0, dd) === l[0]);
                add_arrow(cell, [4, 1, 3, 2][d]);
                add_green(l[0]);
            }
        }
    });
    forEachCell(cell => {
        // direction consistency
        let f = function (c, d) {
            if (c.isnull || !isGreen(c)) { return; }
            adjlist(c.adjacent).forEach((nc, dd) => {
                if (nc.isnull || !isGreen(nc) || nc === goalcell || nc.anum !== CANUM.none || d === dd) { return; }
                add_arrow(nc, [4, 1, 3, 2][(dd + 2) % 4]);
                f(nc, (dd + 2) % 4);
            });
        };
        if (cell === goalcell) { f(cell, -1); return; }
        if (cell.anum !== CANUM.none) { f(cell, qdirRemap(cell.anum)); }
    })
    let cset = new Set();
    forEachCell(cell => {
        if (cell.anum === CANUM.none || cset.has(cell) || offset(cell, 1, 0, qdirRemap(cell.anum)).anum !== CANUM.none) { return; }
        let ncell = offset(cell, 1, 0, qdirRemap(cell.anum));
        let clist = [];
        let dfs = function (c) {
            if (cset.has(c)) { return; }
            clist.push(c);
            cset.add(c);
            forEachSide(c, (nb, nc) => {
                if (isGreen(c) && isGreen(nc)) { dfs(nc); }
                if (nc.anum !== CANUM.none && offset(nc, 1, 0, qdirRemap(nc.anum)) === c) { dfs(nc); }
            });
        };
        dfs(ncell);
        CellConnected({
            isShaded: c => [ncell, goalcell].includes(c),
            isUnshaded: c => isBlack(c) || c.anum !== CANUM.none && clist.includes(c) || (!clist.includes(c) && adjlist(c.adjacent).some(cc => cc.anum !== CANUM.none && clist.includes(cc))),
            add_shaded: c => {
                add_green(c);
                for (let d = 0; d < 4; d++) {
                    let nc = offset(c, 1, 0, d);
                    if (nc.isnull || isBlack(nc) || isGreen(nc)) { continue; }
                    if (adjlist(nc.adjacent).some(cc => cc.anum !== CANUM.none && clist.includes(cc))) { add_black(nc); }
                }
            },
            add_unshaded: add_black,
            UnshadeEmpty: false,
            OnlyOneConnected: false,
        });
    });
}

function YinyangAssist() {
    let add_color = function (c, color) {
        if (c === undefined || c.isnull || c.anum !== CANUM.none || color !== CANUM.wcir && color !== CANUM.bcir) { return; }
        c.setAnum(color);
        c.draw();
        stepcheck(true);
    };
    let add_black = function (c) {
        add_color(c, CANUM.bcir);
    };
    let add_white = function (c) {
        add_color(c, CANUM.wcir);
    };
    CellConnected({
        isShaded: c => c.anum === CANUM.wcir,
        isUnshaded: c => c.anum === CANUM.bcir,
        add_shaded: add_white,
        add_unshaded: add_black,
    });
    CellConnected({
        isShaded: c => c.anum === CANUM.bcir,
        isUnshaded: c => c.anum === CANUM.wcir,
        add_shaded: add_black,
        add_unshaded: add_white,
    });
    No2x2Cell({
        isShaded: c => c.anum === CANUM.wcir,
        add_unshaded: add_black,
    });
    No2x2Cell({
        isShaded: c => c.anum === CANUM.bcir,
        add_unshaded: add_white,
    });
    NoCheckerCell({
        isShaded: c => c.anum === CANUM.wcir,
        isUnshaded: c => c.anum === CANUM.bcir,
        add_shaded: add_white,
        add_unshaded: add_black,
    });
    // cell at side is grouped when both sides are even
    if (board.rows % 2 === 0 && board.cols % 2 === 0) {
        for (let i = 1; i + 1 < board.rows; i += 2) {
            add_link(board.getb(board.minbx + 1, 2 * i + 2));
            add_link(board.getb(board.maxbx - 1, 2 * i + 2));
        }
        for (let i = 1; i + 1 < board.cols; i += 2) {
            add_link(board.getb(2 * i + 2, board.minby + 1));
            add_link(board.getb(2 * i + 2, board.maxby - 1));
        }
    }
    if (board.rows % 2 === 1 || board.cols % 2 === 1) {
        let blist0 = [], blist1 = [];
        forEachBorder(border => {
            let cr = border.sidecross.find(cr => isEdge(cr));
            if (cr === undefined) { return; }
            if ((cr.bx + cr.by) % 4 === 0) { blist0.push(border); }
            if ((cr.bx + cr.by) % 4 === 2) { blist1.push(border); }
        });
        if (blist0.some(b => isSide(b))) { blist0.forEach(b => add_link(b)); }
        if (blist1.some(b => isSide(b))) { blist1.forEach(b => add_link(b)); }
    }
    forEachCell(cell => {
        if (cell.qnum !== CQNUM.none) { add_color(cell, cell.qnum); }
        forEachSide(cell, (nb, nc) => {
            if (isLink(nb) && nc.anum !== CANUM.none) { add_color(cell, nc.anum); }
            if (isSide(nb) && nc.anum !== CANUM.none) { add_color(cell, nc.anum ^ CANUM.wcir ^ CANUM.bcir); }
            if (cell.anum !== CANUM.none && cell.anum === nc.anum) { add_link(nb); }
            if (cell.anum !== CANUM.none && cell.anum === (nc.anum ^ CANUM.wcir ^ CANUM.bcir)) { add_side(nb); }
        });
        // ○ ●    ○●●
        // ○ ○ -> ○ ○
        if (cell.anum === CANUM.none) {
            for (let d = 0; d < 4; d++) {
                let templist = [offset(cell, 1, -1, d), offset(cell, 1, 1, d), offset(cell, 0, -1, d), offset(cell, 0, 1, d)];
                if (!templist.some(c => c.isnull || c.anum === CANUM.none) &&
                    templist[0].anum === templist[1].anum && templist[2].anum !== templist[3].anum) {
                    add_color(cell, CANUM.bcir + CANUM.wcir - templist[0].anum);
                }
            }
        }
    });
    // outside
    {
        let firstcell = board.cell[0];
        let clist = [];
        for (let j = 0; j < board.rows; j++) { clist.push(offset(firstcell, 0, j)); }
        for (let i = 1; i < board.cols - 1; i++) { clist.push(offset(firstcell, i, board.rows - 1)); }
        for (let j = board.rows - 1; j >= 0; j--) { clist.push(offset(firstcell, board.cols - 1, j)); }
        for (let i = board.cols - 2; i > 0; i--) { clist.push(offset(firstcell, i, 0)); }
        let len = clist.length;
        if (clist.some(c => c.anum === CANUM.bcir) && clist.some(c => c.anum === CANUM.wcir)) {
            for (let i = 0; i < len; i++) {
                if (clist[i].anum === CANUM.none || clist[(i + 1) % len].anum !== CANUM.none) { continue; }
                for (let j = (i + 1) % len; j != i; j = (j + 1) % len) {
                    if (clist[j].anum === CANUM.bcir + CANUM.wcir - clist[i].anum) { break; }
                    if (clist[j].anum === CANUM.none) { continue; }
                    if (clist[j].anum === clist[i].anum) {
                        for (let k = i; k != j; k = (k + 1) % len) {
                            add_color(clist[k], clist[i].anum);
                        }
                    }
                }
            }
        }
    }
}

function PaintareaAssist() {
    No2x2Black();
    No2x2Green();
    CellConnected({
        isShaded: isBlack,
        isUnshaded: isGreen,
        add_shaded: add_black,
        add_unshaded: add_green,
        isLinked: (c, nb, nc) => c.room === nc.room,
    });
    forEachCell(cell => {
        if (cell.qnum >= 0 && adjlist(cell.adjacent).filter(c => isBlack(c)).length === cell.qnum) {
            forEachSide(cell, (nb, nc) => add_green(nc));
        }
        if (cell.qnum >= 0 && adjlist(cell.adjacent).filter(c => !c.isnull && !isGreen(c)).length === cell.qnum) {
            forEachSide(cell, (nb, nc) => add_black(nc));
        }
        // no 2*2
        let list = [cell, offset(cell, 1, 0), offset(cell, 0, 1), offset(cell, 1, 1)];
        if (!list.some(c => c.isnull) && !list.some(c => isGreen(c))) {
            let templist2 = list.filter(c => !c.qans);
            if (templist2.length > 0 && !templist2.some(c => c.room !== templist2[0].room)) {
                add_green(templist2[0]);
            }
        }
        if (!list.some(c => c.qans)) {
            let templist2 = list.filter(c => !isGreen(c));
            if (templist2.length > 0 && !templist2.some(c => c.room !== templist2[0].room)) {
                add_black(templist2[0]);
            }
        }
    });
    forEachRoom(room => {
        let clist = Array.from(room.clist);
        if (clist.some(c => isGreen(c))) {
            clist.forEach(c => add_green(c));
            return;
        }
        if (clist.some(c => isBlack(c))) {
            clist.forEach(c => add_black(c));
            return;
        }
    });
}

function ParquetAssist() {
    CellNoLoop({
        isShaded: isBlack,
        isUnshaded: isDot,
        add_shaded: add_black,
        add_unshaded: add_dot,
    });
    CellConnected({
        isShaded: isBlack,
        isUnshaded: isDot,
        add_shaded: add_black,
        add_unshaded: add_dot,
        isLinked: (c, nb, nc) => c.room === nc.room,
    });
    forEachRoom(room => {
        let clist = Array.from(room.clist);
        if (clist.some(c => isBlack(c))) { clist.forEach(c => add_black(c)); }
        if (clist.some(c => isDot(c))) { clist.forEach(c => add_dot(c)); }
    });
    for (let i = 0; i < board.spblockgraph.components.length; i++) {
        let spblock = board.spblockgraph.components[i];
        let rlist = spblock.tiles;
        let fn = room => Array.from(room.clist).some(c => isBlack(c)) ? "Black" : Array.from(room.clist).some(c => isGreen(c)) ? "Green" : "Empty";
        if (rlist.some(r => fn(r) === "Black")) {
            rlist.filter(r => fn(r) === "Empty").forEach(r => Array.from(r.clist).forEach(c => add_dot(c)));
        }
        if (rlist.filter(r => fn(r) !== "Green").length === 1) {
            rlist.filter(r => fn(r) !== "Green").forEach(r => Array.from(r.clist).forEach(c => add_black(c)));
        }
    }
    forEachCell(cell => {
        let clist = [cell, offset(cell, 1, 0), offset(cell, 0, 1), offset(cell, 1, 1)];
        if (clist.some(c => c.isnull || isGreen(c))) { return; }
        clist = clist.filter(c => !isBlack(c));
        if (clist.length > 0 && clist.every(c => c.room === clist[0].room)) {
            add_green(clist[0]);
        }
    });
}

function NuriMazeAssist() {
    const startcell = board.getc(board.startpos.bx, board.startpos.by);
    const goalcell = board.getc(board.goalpos.bx, board.goalpos.by);
    const isCir = c => !c.isnull && c.ques == CQUES.cir;
    const isTri = c => !c.isnull && c.ques == CQUES.tri;
    No2x2Black();
    No2x2Green();
    CellConnected({
        isShaded: isGreen,
        isUnshaded: isBlack,
        add_shaded: add_green,
        add_unshaded: add_black,
        isLinked: (c, nb, nc) => c.room === nc.room,
    });
    CellConnected({
        isShaded: c => {
            return c === startcell || c === goalcell || isCir(c);
        },
        isUnshaded: c => isBlack(c) || isTri(c),
        add_shaded: add_green,
        add_unshaded: () => { },
        isLinked: (c, nb, nc) => c.room === nc.room,
    });
    CellConnected({
        isShaded: c => {
            if (c === startcell || c === goalcell) { return c.lcnt === 0; }
            return c.lcnt == 1;
        },
        isUnshaded: c => {
            if (c === startcell || c === goalcell) { return c.lcnt === 1; }
            return c.lcnt === 2 || isBlack(c) || isTri(c);
        },
        add_shaded: add_green,
        add_unshaded: () => { },
        isLinked: (c, nb, nc) => c.room === nc.room,
        cantDivideShade: (s, o) => s % 2 === 1,
        OnlyOneConnected: false,
        UnshadeEmpty: false,
    });
    const circnt = Array.from(board.cell).filter(c => isCir(c)).length;
    forEachRoom(room => {
        const clist = Array.from(room.clist);
        if (clist.some(c => isGreen(c) || isCir(c) || isTri(c) || c.lcnt > 0) ||
            room === startcell.room || room === goalcell.room) {
            clist.forEach(c => add_green(c));
            return;
        }
        if (clist.some(c => isBlack(c))) {
            clist.forEach(c => add_black(c));
            return;
        }
        let circnt1 = circnt, circnt2 = circnt;
        let oclist = unique(clist.flatMap(c => adjlist(c.adjacent)).filter(nc => isGreen(nc)));
        if (oclist.length < 2) { return; }
        // no loop
        let templist = oclist.map(c => {
            let dfslist = getCellChunk(c, (c, nb, nc) => isGreen(nc));
            if (dfslist.some(c => c === startcell)) { circnt1 = dfslist.filter(c => isCir(c)).length; }
            if (dfslist.some(c => c === goalcell)) { circnt2 = dfslist.filter(c => isCir(c)).length; }
            return dfslist.filter(c => oclist.includes(c)).length;
        });
        if (templist.some(n => n > 1)) {
            clist.forEach(c => add_black(c));
            return;
        }
        // not enough cir
        if (circnt1 + circnt2 < circnt) {
            clist.forEach(c => add_black(c));
            return;
        }
        // no branch for line
        templist = oclist.map(c => {
            if (!isGreen(c)) { return 0; }
            let res = 0;
            let dfsclist = [];
            let dfs = function (c) {
                if (c.isnull || !isGreen(c) || dfsclist.includes(c)) { return; }
                if (c === startcell || c === goalcell || isCir(c) || c.lcnt > 0) {
                    res += c === startcell;
                    res += c === goalcell;
                    res += (isCir(c) && c.lcnt === 0);
                    res += c.lcnt;
                    res += (dfsclist.some(c => isTri(c)) ? 2 : 0);
                    return;
                }
                dfsclist.push(c);
                forEachSide(c, (nb, nc) => dfs(nc));
                dfsclist.pop();
            }
            dfs(c);
            return Math.min(res, 2);
        });
        if (templist.reduce((a, b) => a + b) > 2) {
            clist.forEach(c => add_black(c));
            return;
        }
    });
    forEachCell(cell => {
        if (isCir(cell)) {
            let templist = adjlist(cell.adjacent).filter(c => !c.isnull && !isBlack(c));
            if (templist.length === 2) {
                templist.forEach(c => add_green(c));
            }
        }
        // surrounded by black
        if (adjlist(cell.adjacent).filter(c => isBlack(c)).length === 4) {
            add_black(cell);
        }
        // no 2*2
        {
            let templist = [cell, offset(cell, 1, 0), offset(cell, 0, 1), offset(cell, 1, 1)];
            if (templist.every(c => !c.isnull && !isGreen(c))) {
                let templist2 = templist.filter(c => !isBlack(c));
                if (templist2.length > 0 && !templist2.some(c => c.room !== templist2[0].room)) {
                    add_green(templist2[0]);
                }
            }
            if (templist.every(c => !c.isnull && !isBlack(c))) {
                let templist2 = templist.filter(c => !isGreen(c));
                if (templist2.length > 0 && !templist2.some(c => c.room !== templist2[0].room)) {
                    add_black(templist2[0]);
                }
            }
        }
    });
    // line
    forEachCell(cell => {
        if (isBlack(cell) || isTri(cell)) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
            return;
        }
        let ecnt = adjlist(cell.adjborder).filter(b => !b.isnull && !isCross(b)).length;
        let lcnt = cell.lcnt;
        if (lcnt > 0) { add_green(cell); }
        // no branch
        if (lcnt === 2 || lcnt === 1 && (cell === startcell || cell === goalcell)) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        // no deadend
        if (ecnt === 1) {
            forEachSide(cell, (nb, nc) => cell !== startcell && cell !== goalcell ? add_cross(nb) : add_line(nb));
        }
        // 2 degree path
        if (ecnt === 2 && cell !== startcell && cell !== goalcell && (lcnt === 1 || isCir(cell))) {
            forEachSide(cell, (nb, nc) => add_line(nb));
        }
        // extend line
        if (lcnt === 1 && cell !== startcell && cell !== goalcell ||
            lcnt === 0 && (cell === startcell || cell === goalcell || isCir(cell))) {
            let fn = function (c, b, list) {
                if (c.isnull || !isGreen(c) || list.includes(c)) { return; }
                if (b !== null && isLine(b)) { return; }
                list.push(c);
                if (c.lcnt === 1 || isCir(c) || c === startcell || c === goalcell) {
                    for (let j = 1; j < list.length; j++) {
                        let cell1 = list[j - 1];
                        let cell2 = list[j];
                        let border = board.getb((cell1.bx + cell2.bx) / 2, (cell1.by + cell2.by) / 2);
                        add_line(border);
                        add_green(cell1);
                        add_green(cell2);
                    }
                }
                forEachSide(c, (nb, nc) => fn(nc, nb, list));
                list.pop();
            }
            fn(cell, null, []);
        }
    });
}

function AquapelagoAssist() {
    No2x2Green();
    BlackNotAdjacent();
    GreenConnected();
    let n = 0;
    let ord = new Map();
    let siz = new Map();
    let qn = new Map();
    forEachCell(cell => (cell.qnum !== CQNUM.none ? add_black(cell) : undefined));
    forEachCell(cell => {
        if (isBlack(cell) && !ord.has(cell)) {
            n++;
            siz.set(n, 0);
            qn.set(n, -1);
            let cl = [];
            let dfs = function (c) {
                if (!isBlack(c) || ord.has(c)) { return; }
                ord.set(c, n);
                cl.push(c);
                siz.set(n, siz.get(n) + 1);
                if (isNum(c)) { qn.set(n, c.qnum); }
                dfs(offset(c, -1, -1));
                dfs(offset(c, -1, +1));
                dfs(offset(c, +1, -1));
                dfs(offset(c, +1, +1));
            };
            dfs(cell);
            let ol = cl.flatMap(c => adjdiaglist(c));
            ol = ol.filter(c => !c.isnull && !isBlack(c) && !isGreen(c));
            if (cl.length < qn.get(n) && ol.length === 1) {
                add_black(ol[0]);
                ord.set(ol[0], n);
            }
        }
    });
    forEachCell(cell => {
        if (!isBlack(cell) && !isGreen(cell)) {
            let l = adjdiaglist(cell);
            l = l.filter(c => isBlack(c));
            l = Array.from(new Set(l.map(c => ord.get(c))));
            if (l.length > 0 && l.some(i => qn.get(i) !== -1)) {
                if (new Set(l.map(i => qn.get(i)).filter(i => i !== -1)).size > 1) {
                    add_green(cell);
                }
                if (l.map(i => qn.get(i)).find(i => i !== -1) < l.map(i => siz.get(i)).reduce((a, b) => a + b) + 1) {
                    add_green(cell);
                }
            }
        }
    });
}

function IcelomAssist() {
    let add_arrow = function (b, dir) {
        if (b === undefined || b.isnull || b.qsub !== BQSUB.none) { return; }
        b.setQsub(dir);
        b.draw();
        stepcheck(true);
    };
    let ncnt = 0;
    forEachCell(cell => isClue(cell) ? ncnt++ : undefined);
    let getTrailDir = function (t) { // get direction of a trail. 0: forward, 1: backward, 2: unknown, -1: broken
        let qn = t.flatMap(c => isClue(c) ? c.qnum : []);
        if (inb.sidecell.includes(t[0])) { qn = [0].concat(qn); }
        if (outb.sidecell.includes(t[0])) { qn = [ncnt + 1].concat(qn); }
        if (inb.sidecell.includes(t[t.length - 1])) { qn.push(0); }
        if (outb.sidecell.includes(t[t.length - 1])) { qn.push(ncnt + 1); }
        let f = function (l) {
            l = l.flatMap((n, i) => n === CQNUM.quesmark ? [] : n - i);
            if (l.length === 0) { return true; }
            return unique(l).length === 1;
        };
        if (f(qn) && f([...qn].reverse())) { return 2; }
        if (f(qn)) { return 0; }
        if (f([...qn].reverse())) { return 1; }
        return -1;
    };
    let inb = board.getb(board.arrowin.bx, board.arrowin.by);
    let outb = board.getb(board.arrowout.bx, board.arrowout.by);
    add_line(inb);
    add_line(outb);
    SingleLoopInCell({ isPass: c => !isIce(c), Directed: true });
    forEachBorder(border => {
        // add cross outside except IN and OUT
        if (!border.inside && border !== inb && border !== outb) {
            add_cross(border);
        }
        if (border.qdir !== QDIR.none) {
            add_arrow(border, border.qdir + 10);   // from qdir to bqsub
            add_line(border);
        }
        if (!isLine(border) && !isCross(border)) {
            let t = border.sidecell.map(c => {
                let d = [0, 1, 2, 3].find(d => offset(c, .5, 0, d) === border);
                let tr = cellTrail(c, d, true);
                tr.shift();
                return tr;
            });
            t = [...t[0].reverse(), ...t[1]];
            if (getTrailDir(t) === -1) { add_cross(border); }
        }
    });
    forEachCell(cell => {
        if (isClue(cell) && cell.lcnt === 2) { forEachSide(cell, (nb, nc) => add_cross(nb)); }
        if (isClue(cell) && adjlist(cell.adjborder).filter(b => !isntLine(b)).length === 2) { forEachSide(cell, (nb, nc) => add_line(nb)); }
        if (cell.lcnt !== 1 || isIce(cell)) { return; }
        for (let d = 0; d < 4; d++) {
            if (!isLine(offset(cell, .5, 0, d))) {
                let ncell = offset(cell, 1, 0, d);
                while (!ncell.isnull && isIce(ncell)) {
                    ncell = offset(ncell, 1, 0, d);
                }
                if (ncell.isnull || ncell.lcnt !== 1) { continue; }
                if (board.linegraph.components.length > 2 &&
                    (cell.path === inb.path && ncell.path === outb.path || cell.path === outb.path && ncell.path === inb.path)) {
                    add_cross(offset(cell, .5, 0, d));
                }
            } else if (offset(cell, .5, 0, d).qsub === BQSUB.none) {
                let dl = [[cell.adjborder.right, BQSUB.arrow_rt, BQSUB.arrow_lt], [cell.adjborder.top, BQSUB.arrow_up, BQSUB.arrow_dn], [cell.adjborder.left, BQSUB.arrow_lt, BQSUB.arrow_rt], [cell.adjborder.bottom, BQSUB.arrow_dn, BQSUB.arrow_up],];
                let dir = getTrailDir(cellTrail(cell, d, true));
                if (dir === -1 || dir === 2) { continue; }
                add_arrow(offset(cell, .5, 0, d), dl[d][dir + 1]);
            }
        }
    });
}

function IcebarnAssist() {
    let add_arrow = function (b, dir) {
        if (b === undefined || b.isnull || b.qsub !== BQSUB.none) { return; }
        b.setQsub(dir);
        b.draw();
        stepcheck(true);
    };
    let inb = board.getb(board.arrowin.bx, board.arrowin.by);
    let outb = board.getb(board.arrowout.bx, board.arrowout.by);
    add_line(inb);
    add_line(outb);
    SingleLoopInCell({ Directed: true });
    // add cross outside except IN and OUT
    forEachBorder(border => {
        if (!border.inside && border !== inb && border !== outb) {
            add_cross(border);
        }
        if (border.qdir != QDIR.none) {
            add_arrow(border, border.qdir + 10);   // from qdir to bqsub
            add_line(border);
        }
    });
    let iceSet = new Set();
    forEachCell(cell => {
        // pass all ice
        if (isIce(cell) && !iceSet.has(cell)) {
            let list = [], blist = [];
            let dfs = function (c) {
                if (c.isnull || !isIce(c) || iceSet.has(c)) { return; }
                iceSet.add(c);
                list.push(c);
                forEachSide(c, (nb, nc) => { blist.push(nb); dfs(nc); });
            }
            dfs(cell);
            blist = blist.filter(b => b.sidecell.some(c => isIce(c)) && b.sidecell.some(c => !c.isnull && !isIce(c)));
            blist = blist.filter(b => !isCross(b));
            if (blist.length === 2) {
                blist.forEach(b => add_line(b));
            }
        }
        if (cell.lcnt === 1 && !isIce(cell)) {
            for (let d = 0; d < 4; d++) {
                let ncell = offset(cell, 1, 0, d);
                while (!ncell.isnull && isIce(ncell)) {
                    ncell = offset(ncell, 1, 0, d);
                }
                if (ncell.isnull || ncell.lcnt !== 1 || isLine(offset(ncell, -.5, 0, d))) { continue; }
                if (board.linegraph.components.length > 2 &&
                    (cell.path === inb.path && ncell.path === outb.path || cell.path === outb.path && ncell.path === inb.path)) {
                    add_cross(offset(cell, .5, 0, d));
                }
            }
        }
    });
}

function InverseLitsoAssist() {
    BlackConnected();
    CellConnected({
        isShaded: isGreen,
        isUnshaded: isBlack,
        add_shaded: add_green,
        add_unshaded: add_black,
        isNotPassable: (c, nb, nc) => nb.ques,
        OnlyOneConnected: false,
        UnshadeEmpty: false,
    });
    No2x2Black();
    const LITSO = [
        [[0, 0], [1, 0], [2, 0], [0, 1]],// L
        [[0, 0], [1, 0], [2, 0], [2, 1]],
        [[0, 0], [0, 1], [1, 1], [2, 1]],
        [[0, 0], [0, 1], [-1, 1], [-2, 1]],
        [[0, 0], [1, 0], [0, 1], [0, 2]],
        [[0, 0], [1, 0], [1, 1], [1, 2]],
        [[0, 0], [0, 1], [0, 2], [1, 2]],
        [[0, 0], [0, 1], [0, 2], [-1, 2]],
        [[0, 0], [1, 0], [2, 0], [3, 0]],// I
        [[0, 0], [0, 1], [0, 2], [0, 3]],
        [[0, 0], [1, 0], [2, 0], [1, 1]],// T
        [[0, 0], [1, 0], [2, 0], [1, -1]],
        [[0, 0], [0, 1], [0, 2], [1, 1]],
        [[0, 0], [0, 1], [0, 2], [-1, 1]],
        [[0, 0], [1, 0], [1, 1], [2, 1]],// S
        [[0, 0], [1, 0], [1, -1], [2, -1]],
        [[0, 0], [0, 1], [1, 1], [1, 2]],
        [[0, 0], [0, 1], [-1, 1], [-1, 2]],
        [[0, 0], [1, 0], [0, 1], [1, 1]],// O
    ];
    const CANDMAX = 50;
    forEachRoom(room => {
        let clist = Array.from(room.clist).filter(c => !isBlack(c));
        let bclist = Array.from(room.clist).filter(c => !isBlack(c) && isGreen(c));
        let clistSet = new Set(clist);
        let cand = [];
        for (let j = 0; j < clist.length; j++) {
            let list = LITSO;
            list = list.map(l => l.map(([dx, dy]) => offset(clist[j], dx, dy)));
            list = list.filter(l => !l.some(c => !clistSet.has(c)));
            if (bclist.length > 0) {
                list = list.filter(l => bclist.every(c => l.includes(c)));
            }
            list = list.filter(l => {
                let nlist = [];
                l.forEach(c => {
                    forEachSide(c, (nb, nc) => {
                        if (isGreen(nc) && nc.room !== room) {
                            nlist.push(nc);
                        }
                    });
                });
                // no 2*2
                let no2x2 = true;
                clist.forEach(c => {
                    if (no2x2 === false) { return; }
                    for (let d = 0; d < 4; d++) {
                        if ([c, offset(c, 1, 0, d), offset(c, 0, 1, d), offset(c, 1, 1, d)].every(cc => isBlack(cc) || cc.room === room && !l.includes(cc))) {
                            no2x2 = false;
                            return;
                        }
                    }
                });
                if (no2x2 === false) { return false; }
                // no same shape
                let cshape = getShape(l);
                nlist = nlist.map(c => {
                    let clist = Array.from(c.room.clist).filter(c => isGreen(c));
                    if (clist.length > 4) return null;
                    return getShape(clist);
                });
                return !nlist.includes(cshape);
            });
            cand.push(...list);
            if (cand.length > CANDMAX) { break; }
        }
        if (cand.length > CANDMAX) { return; }
        for (let j = 0; j < clist.length; j++) {
            if (cand.every(l => l.includes(clist[j]))) {
                add_dot(clist[j]);
            }
            if (cand.every(l => !l.includes(clist[j]))) {
                add_black(clist[j]);
            }
        }
    });
}

function LitsAssist() {
    BlackConnected();
    BlackConnected_InRegion();
    No2x2Black();
    let cset = new Set();
    forEachCell(cell => {
        if (cset.has(cell) || isDot(cell)) { return; }
        let l = [];
        let dfs = function (c) {
            if (c.isnull || cset.has(c) || isDot(c) || c.room !== cell.room) { return; }
            cset.add(c);
            l.push(c);
            forEachSide(c, (nb, nc) => dfs(nc));
        };
        dfs(cell);
        if (l.length < 4) {
            l.forEach(c => add_dot(c));
        }
    });
    const LITS = [
        [[0, 0], [1, 0], [2, 0], [0, 1]],// L
        [[0, 0], [1, 0], [2, 0], [2, 1]],
        [[0, 0], [0, 1], [1, 1], [2, 1]],
        [[0, 0], [0, 1], [-1, 1], [-2, 1]],
        [[0, 0], [1, 0], [0, 1], [0, 2]],
        [[0, 0], [1, 0], [1, 1], [1, 2]],
        [[0, 0], [0, 1], [0, 2], [1, 2]],
        [[0, 0], [0, 1], [0, 2], [-1, 2]],
        [[0, 0], [1, 0], [2, 0], [3, 0]],// I
        [[0, 0], [0, 1], [0, 2], [0, 3]],
        [[0, 0], [1, 0], [2, 0], [1, 1]],// T
        [[0, 0], [1, 0], [2, 0], [1, -1]],
        [[0, 0], [0, 1], [0, 2], [1, 1]],
        [[0, 0], [0, 1], [0, 2], [-1, 1]],
        [[0, 0], [1, 0], [1, 1], [2, 1]],// S
        [[0, 0], [1, 0], [1, -1], [2, -1]],
        [[0, 0], [0, 1], [1, 1], [1, 2]],
        [[0, 0], [0, 1], [-1, 1], [-1, 2]],
    ];
    const CANDMAX = 50;
    forEachRoom(room => {
        let clist = Array.from(room.clist).filter(c => !isGreen(c));
        let bclist = Array.from(room.clist).filter(c => !isGreen(c) && isBlack(c));
        let clistSet = new Set(clist);
        let cand = [];
        for (let j = 0; j < clist.length; j++) {
            let list = LITS;
            list = list.map(l => l.map(([dx, dy]) => offset(clist[j], dx, dy)));
            list = list.filter(l => !l.some(c => !clistSet.has(c)));
            if (bclist.length > 0) {
                list = list.filter(l => bclist.every(c => l.includes(c)));
            }
            list = list.filter(l => l.every(c => !adjlist(c.adjborder, c.adjacent).some(([nb, nc]) => nb.ques === 1 && l.includes(nc))));
            list = list.filter(l => {
                let nlist = [], con = false;
                l.forEach(c => {
                    forEachSide(c, (nb, nc) => {
                        if (isBlack(nc) && nc.room !== room) {
                            nlist.push(nc);
                        }
                        if (!nc.isnull && !isGreen(nc) && nc.room !== room) {
                            con = true;
                        }
                    });
                });
                // connectivity
                if (!con && board.roommgr.components.length > 1) { return false; }
                // no 2*2
                let no2x2 = true;
                l.forEach(c => {
                    if (no2x2 === false) { return; }
                    for (let d = 0; d < 4; d++) {
                        if ([c, offset(c, 1, 0, d), offset(c, 0, 1, d), offset(c, 1, 1, d)].every(cc => nlist.includes(cc) || l.includes(cc))) {
                            no2x2 = false;
                            return;
                        }
                    }
                });
                if (no2x2 === false) { return false; }
                // no same shape
                let cshape = getShape(l);
                nlist = nlist.map(c => {
                    let clist = Array.from(c.room.clist).filter(c => isBlack(c));
                    return getShape(clist);
                });
                return !nlist.includes(cshape);
            });
            cand.push(...list);
            if (cand.length > CANDMAX) { break; }
        }
        if (cand.length > CANDMAX) { return; }
        for (let j = 0; j < clist.length; j++) {
            if (cand.every(l => l.includes(clist[j]))) {
                add_black(clist[j]);
            }
            if (cand.every(l => !l.includes(clist[j]))) {
                add_dot(clist[j]);
            }
        }
    });
}

function NothreeAssist() {
    BlackNotAdjacent();
    GreenConnected();
    for (let i = 0; i < board.dots.length; i++) {
        let dot = board.dots[i].piece;
        if (dot.qnum !== 1) { continue; }
        let clist = [];
        if (dot.bx % 2 === 1 && dot.by % 2 === 1) {
            clist.push(board.getc(dot.bx, dot.by));
        }
        if (dot.bx % 2 === 0 && dot.by % 2 === 1) {
            clist.push(board.getc(dot.bx - 1, dot.by));
            clist.push(board.getc(dot.bx + 1, dot.by));
        }
        if (dot.bx % 2 === 1 && dot.by % 2 === 0) {
            clist.push(board.getc(dot.bx, dot.by - 1));
            clist.push(board.getc(dot.bx, dot.by + 1));
        }
        if (dot.bx % 2 === 0 && dot.by % 2 === 0) {
            clist.push(board.getc(dot.bx - 1, dot.by - 1));
            clist.push(board.getc(dot.bx + 1, dot.by - 1));
            clist.push(board.getc(dot.bx - 1, dot.by + 1));
            clist.push(board.getc(dot.bx + 1, dot.by + 1));
        }
        let blackcnt = clist.filter(c => isBlack(c)).length;
        let emptycnt = clist.filter(c => !isBlack(c) && c.qsub !== CQSUB.dot).length;
        if (blackcnt === 0 && emptycnt === 1) {
            clist.forEach(c => add_black(c));
        }
        if (blackcnt === 1) {
            clist.forEach(c => add_green(c));
        }
    }
    forEachCross(cross => {
        if (cross.qnum !== 1) { return; }
        for (let d = 0; d < 4; d++) {
            if (offset(cross, .5, 0, d).qnum === 1) {
                add_green(offset(cross, -.5, -.5, d));
                add_green(offset(cross, -.5, +.5, d));
            }
            if (offset(cross, 1, 0, d).qnum === 1 && isGreen(offset(cross, -.5, -.5, d)) && isGreen(offset(cross, -.5, +.5, d))) {
                add_green(offset(cross, 1.5, -.5, d));
                add_green(offset(cross, 1.5, +.5, d));
            }
        }
    });
    forEachCell(cell => {
        for (let d = 0; d < 4; d++) {
            let fn = function (list) {
                if (!list.some(c => c.isnull) && list.filter(c => isBlack(c)).length === 2) {
                    list.forEach(c => add_green(c));
                }
            }
            // O.O.O
            fn([cell, offset(cell, 2, 0, d), offset(cell, 4, 0, d)]);
            // O..O..O
            fn([cell, offset(cell, 3, 0, d), offset(cell, 6, 0, d)]);
            // O...O...O
            fn([cell, offset(cell, 4, 0, d), offset(cell, 8, 0, d)]);
            // OXXXXOX?XXO
            for (let l = 5; l * 2 < Math.max(board.cols, board.rows); l++) {
                let templist1 = [cell, offset(cell, l, 0, d), offset(cell, 2 * l, 0, d)];
                if (templist1.some(c => c.isnull)) { continue; }
                templist1 = templist1.filter(c => !isBlack(c));
                let templist2 = [];
                for (let j = 1; j < 2 * l; j++) {
                    if (j === l) { continue; }
                    templist2.push(offset(cell, j, 0, d));
                }
                if (templist2.some(c => isBlack(c))) { continue; }
                templist2 = templist2.filter(c => c.qsub !== CQSUB.dot);
                if (templist1.length === 0 && templist2.length === 1) {
                    add_black(templist2[0]);
                }
                if (templist1.length === 1 && templist2.length === 0) {
                    add_green(templist1[0]);
                }
            }
            if (offset(cell, 1.5, 0, d).qnum === 1 && offset(cell, 3.5, 0, d).qnum === 1) {
                add_green(cell);
            }
            if (offset(cell, 1.5, 0, d).qnum === 1 && offset(cell, -1.5, 0, d).qnum === 1) {
                add_green(cell);
            }
        }
    });
}

function ShakashakaAssist() {
    let isEmpty = c => !c.isnull && !isClue(c);
    let add_tri = function (c, ndir) { // 0 = ◣, 1 = ◢, 2 = ◥, 3 = ◤
        if (c === undefined || c.isnull || isClue(c) || isDot(c) || c.qans !== CQANS.none) { return; }
        ndir = (ndir % 4 + 4) % 4;
        c.setQans(ndir + 2);
        c.draw();
        stepcheck(true);
    };
    // see https://scrapbox.io/wandsbox/%E3%82%B7%E3%83%A3%E3%82%AB%E3%82%B7%E3%83%A3%E3%82%AB%E3%81%AE%E6%A0%BC%E5%AD%90%E7%82%B9%E3%81%AB%E7%9D%80%E7%9B%AE%E3%81%99%E3%82%8B
    // in this link the cross is just black in the upper link https://scrapbox.io/wandsbox/%E3%82%B7%E3%83%A3%E3%82%AB%E3%82%B7%E3%83%A3%E3%82%AB%E8%A3%9C%E5%8A%A9%E8%A8%98%E5%8F%B7%C3%97%E3%81%AE%E6%8F%90%E6%A1%88
    let isCrEmpty = cr => !cr.isnull && cr.qsub === 0;
    let isCrBlack = cr => !cr.isnull && cr.qsub === 2;
    let isCrWhite = cr => !cr.isnull && cr.qsub === 1;
    let isDiffCr = (cr1, cr2) => isCrBlack(cr1) && isCrWhite(cr2) || isCrWhite(cr1) && isCrBlack(cr2);
    let add_crblack = function (cr) {
        if (cr === undefined || cr === null || cr.isnull || !isCrEmpty(cr)) { return; }
        cr.setQsub(2);
        cr.draw();
        stp2cnt++;
    }
    let add_crwhite = function (cr) {
        if (cr === undefined || cr === null || cr.isnull || !isCrEmpty(cr)) { return; }
        cr.setQsub(1);
        cr.draw();
        stp2cnt++;
    }
    if (board.border.length === 0) { // re-add border
        board.hasborder = 1;
        board.initGroup("border", board.rows, board.cols);
        board.setposAll();
        board.rebuildInfo();
    }
    forEachCell(cell => {
        let adjcross = [[+.5, -.5], [-.5, -.5], [-.5, +.5], [+.5, +.5]].map(([x, y]) => offset(cell, x, y));
        // cell to cross
        if (cell.qnum !== CQNUM.none) { adjcross.forEach(cr => add_crblack(cr)); }
        if (cell.qans !== CQANS.none) { // 2 = ◣, 3 = ◢, 4 = ◥, 5 = ◤
            add_crwhite(adjcross[cell.qans - 2]);
            adjcross.forEach(cr => add_crblack(cr));
        }
        if (isDot(cell)) {
            for (let d = 0; d < 4; d++) {
                if (isCrBlack(offset(cell, -.5, -.5, d))) { add_crblack(offset(cell, .5, .5, d)); }
                if (isCrWhite(offset(cell, -.5, -.5, d))) { add_crwhite(offset(cell, .5, .5, d)); }
            }
        }
        // number clue
        if (isNum(cell)) {
            NShadeInClist({
                isShaded: c => {
                    if (c.qans !== CQANS.none) { return true; }
                    if (c.isnull || isClue(c)) { return false; }
                    let d = [0, 1, 2, 3].find(d => offset(c, 1, 0, d) === cell);
                    if (isCrWhite(offset(c, -.5, -.5, d)) || isCrWhite(offset(c, -.5, +.5, d)) || isLink(offset(c, -.5, 0, d))) { return true; }
                    if ([[0, 0], [0, 1], [1, 1]].every(([x, y]) => !isClue(offset(c, x, y, d))) && [-.5, +.5, 1.5].every(x => isCrBlack(offset(c, x, 1.5, d)))) { return true; }
                    if ([[0, 0], [0, 1], [1, 1]].every(([x, y]) => !isClue(offset(c, x, -y, d))) && [-.5, +.5, 1.5].every(x => isCrBlack(offset(c, x, -1.5, d)))) { return true; }
                    return false;
                },
                isUnshaded: c => isDot(c) || isClue(c),
                add_shaded: c => {
                    let d = [0, 1, 2, 3].find(d => offset(c, -1, 0, d) === cell);
                    if (isCrBlack(offset(c, .5, -.5, d))) { add_crwhite(offset(c, .5, +.5, d)); }
                    if (isCrBlack(offset(c, .5, +.5, d))) { add_crwhite(offset(c, .5, -.5, d)); }
                    add_link(offset(c, .5, 0, d));
                },
                add_unshaded: add_dot,
                clist: adjlist(cell.adjacent),
                n: cell.qnum,
            });
        }
        // cross to cell
        if (adjcross.every(cr => isCrBlack(cr))) { add_dot(cell); }
        if (adjcross.filter(cr => isCrWhite(cr)).length === 2) { add_dot(cell); }
        if (adjcross.filter(cr => isCrWhite(cr)).length === 1 && adjcross.filter(cr => isCrBlack(cr)).length === 3) {
            add_tri(cell, [0, 1, 2, 3].find(n => isCrWhite(adjcross[n])));
        }
        // pattern
        for (let d = 0; d < 4; d++) {
            // 1 1
            if (cell.qnum === 1 && offset(cell, 2, 0, d).qnum === 1 && isEmpty(offset(cell, 1, 0, d)) &&
                isEmpty(offset(cell, 1, -1, d)) && isEmpty(offset(cell, 1, +1, d)) &&
                isEmpty(offset(cell, 0, -1, d)) && isEmpty(offset(cell, 0, +1, d)) &&
                isEmpty(offset(cell, 2, -1, d)) && isEmpty(offset(cell, 2, +1, d))) {
                add_dot(offset(cell, -1, 0, d));
                add_dot(offset(cell, 1, 0, d));
                add_dot(offset(cell, 3, 0, d));
                add_crblack(offset(cell, -.5, -2, d));
                add_crblack(offset(cell, -.5, +2, d));
                add_crblack(offset(cell, 2.5, -2, d));
                add_crblack(offset(cell, 2.5, +2, d));
            }
            // black cross & 1
            if (cell.qnum === 1 && isCrBlack(offset(cell, -1.5, -1.5, d)) && !isClue(offset(cell, -1, -1, d)) && !isClue(offset(cell, -1, 0, d)) && !isClue(offset(cell, 0, -1, d))) {
                add_dot(offset(cell, 1, 0, d));
                add_dot(offset(cell, 0, 1, d));
            }
            if (cell.qnum === 2 && isCrBlack(offset(cell, -1.5, -1.5, d)) && !isClue(offset(cell, -1, -1, d)) && !isClue(offset(cell, -1, 0, d)) && !isClue(offset(cell, 0, -1, d)) && ([[1.5, -.5], [1.5, .5], [.5, 1.5], [-.5, 1.5]].some(([x, y]) => isCrWhite(offset(cell, x, y, d))))) {
                [[1.5, -.5], [1.5, .5], [.5, 1.5], [-.5, 1.5]].forEach(([x, y]) => add_crblack(offset(cell, x, y, d)))
            }
            // ××○     ××○
            // × ×○ -> ×○×○
            // ××      ××  
            if ([[0, 0], [1, 0], [0, 1], [1, 1]].every(([x, y]) => !isClue(offset(cell, x, y, d))) &&
                [[0, 0], [1, 0], [0, 1], [2, 1], [0, 2], [1, 2]].every(([x, y]) => isCrBlack(offset(cell, x - .5, y - .5, d))) &&
                isCrWhite(offset(cell, 2.5, .5, d)) && (isCrWhite(offset(cell, 1.5, -.5, d)) || isCrWhite(offset(cell, 1.5, 1.5, d)))) {
                add_crwhite(offset(cell, .5, .5, d));
            }
            // ××      ×××
            // ×× ○ -> ×××○
            // ××      ×××
            if ([[0, 0], [1, 0], [0, 1], [1, 1]].every(([x, y]) => !isClue(offset(cell, x, y, d))) &&
                [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]].every(([x, y]) => isCrBlack(offset(cell, x - .5, y - .5, d))) &&
                isCrWhite(offset(cell, 2.5, .5, d))) {
                add_crblack(offset(cell, 1.5, -.5, d));
                add_crblack(offset(cell, 1.5, 1.5, d));
            }
            //  ×××     ×××
            // ××   -> ××  
            // ××      ×× ×
            // ××      ××  
            if ([...adj8list(cell), cell].every(c => !isClue(c)) && [[1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [0, 2], [1, 2], [0, 3], [1, 3]].every(([x, y]) => isCrBlack(offset(cell, x - 1.5, y - 1.5, d)))) {
                add_crblack(offset(cell, 1.5, .5, d));
            }
            if ([...adj8list(cell), cell].every(c => !isClue(c)) && [[1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [0, 2], [1, 2], [0, 3], [1, 3]].every(([x, y]) => isCrBlack(offset(cell, y - 1.5, x - 1.5, d)))) {
                add_crblack(offset(cell, .5, 1.5, d));
            }
        }
    });
    forEachCross(cross => {
        let adjcross = [[-1, 0], [0, -1], [1, 0], [0, 1]].map(([x, y]) => offset(cross, x, y));
        // white is not adjacent
        if (isCrWhite(cross)) { adjcross.forEach(cr => add_crblack(cr)); }
        if (isEdge(cross)) { add_crblack(cross); return; }
        // 3 white & 1 black is forbidden
        if (adjcross.filter(cr => isCrWhite(cr)).length === 3) { adjcross.forEach(cr => add_crwhite(cr)); }
        if (adjcross.filter(cr => isCrWhite(cr)).length === 2 && adjcross.filter(cr => isCrBlack(cr)).length === 1) { adjcross.forEach(cr => add_crblack(cr)); }
        for (let d = 0; d < 4; d++) {
            let cl = [[+.5, -.5], [-.5, -.5], [-.5, +.5], [+.5, +.5]].map(([x, y]) => offset(cross, x, y));
            let clqn = cl.filter(c => c.qnum !== CQNUM.none).length;
            // 3*3 black but 1 white at corner is forbidden
            let crl = [[-1, -1], [-1, 0], [0, -1]].map(([x, y]) => offset(cross, x, y, d));
            if (clqn === 0 && crl.every(cr => isCrBlack(cr)) &&
                (isCrBlack(cross) || isDiffCr(offset(cross, -1, 1, d), offset(cross, 0, 2, d)) || isDiffCr(offset(cross, 1, -1, d), offset(cross, 2, 0, d)) ||
                    isCrBlack(offset(cross, -1, 1, d)) && isCrWhite(offset(cross, 2, 2, d)) && isCrWhite(offset(cross, 1, 3, d)) ||
                    isCrBlack(offset(cross, 1, -1, d)) && isCrWhite(offset(cross, 2, 2, d)) && isCrWhite(offset(cross, 3, 1, d))) &&
                (isCrBlack(offset(cross, -1, 1, d)) || isCrBlack(cross) && isCrWhite(offset(cross, 2, 2, d)) && isCrWhite(offset(cross, 1, 3, d))) &&
                (isCrBlack(offset(cross, 1, -1, d)) || isCrBlack(cross) && isCrWhite(offset(cross, 2, 2, d)) && isCrWhite(offset(cross, 3, 1, d)))) {
                add_crblack(offset(cross, 1, 1, d));
            }
            crl = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [1, -1]].map(([x, y]) => offset(cross, x, y, d));
            if (clqn === 0 && crl.every(cr => isCrBlack(cr)) &&
                (isCrWhite(offset(cross, 0, 2, d)) || isCrWhite(offset(cross, 2, 0, d)))) {
                add_crblack(offset(cross, 1, 1, d));
            }
            crl = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1]].map(([x, y]) => offset(cross, x, y, d));
            if (clqn === 0 && crl.filter(cr => isCrWhite(cr)).length === 1 && crl.filter(cr => isCrBlack(cr)).length === 7 &&
                [0, 2, 6, 8].some(n => isCrWhite(crl[n]))) {
                crl.forEach(cr => add_crwhite(cr));
            }
            crl = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1]].map(([x, y]) => offset(cross, x, y, d));
            if (clqn === 0 && crl.filter(cr => isCrWhite(cr)).length === 1 && crl.filter(cr => isCrBlack(cr)).length === 6 &&
                [0, 2, 6].some(n => isCrWhite(crl[n]))) {
                add_link(offset(cross, 1, .5, d));
            }
            crl = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [1, -1], [1, 0]].map(([x, y]) => offset(cross, x, y, d));
            if (clqn === 0 && crl.filter(cr => isCrWhite(cr)).length === 1 && crl.filter(cr => isCrBlack(cr)).length === 6 &&
                [0, 2, 5].some(n => isCrWhite(crl[n]))) {
                add_link(offset(cross, .5, 1, d));
            }
            // 3*3 black but there is one black cell
            crl = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1]].map(([x, y]) => offset(cross, x, y, d));
            if (clqn === 1 && crl.filter(cr => isCrBlack(cr)).length === 8) {
                crl.forEach(cr => add_crwhite(cr));
            }
            if (isCrWhite(offset(cross, 1, -1, d)) && isCrWhite(offset(cross, 2, 0, d)) &&
                isDiffCr((offset(cross, -1, 1, d)), offset(cross, 0, 2, d))) {
                add_crblack(cross);
                add_crblack(offset(cross, 1, 1, d));
            }
            crl = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1]].map(([x, y]) => offset(cross, x, y, d));
            if (clqn === 1 && crl.every(cr => isCrBlack(cr))) {
                add_link(offset(cross, 1, .5, d));
            }
            crl = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [1, -1], [1, 0]].map(([x, y]) => offset(cross, x, y, d));
            if (clqn === 1 && crl.every(cr => isCrBlack(cr))) {
                add_link(offset(cross, .5, 1, d));
            }
            if (isCrBlack(cross) && isLink(offset(cross, .5, 0, d))) { add_crwhite(offset(cross, 1, 0, d)); }
            if (isLink(offset(cross, .5, 0, d)) && isLink(offset(cross, .5, 1, d))) {
                add_link(offset(cross, 0, .5, d));
                add_link(offset(cross, 1, .5, d));
            }
            if (isLink(offset(cross, 1.5, 0, d)) && isLink(offset(cross, 1.5, 1, d)) && isCrBlack(offset(cross, 1, -1, d))) {
                add_crblack(cross);
            }
            if (isLink(offset(cross, 1.5, 0, d)) && isLink(offset(cross, 1.5, -1, d)) && isCrBlack(offset(cross, 1, 1, d))) {
                add_crblack(cross);
            }
            if (isNum(offset(cross, 1.5, 1.5, d)) && isCrBlack(offset(cross, 2, 0, d)) && isCrBlack(offset(cross, 0, 2, d)) &&
                [[offset(cross, 3, 1, d), offset(cross, 3, 2, d)], [offset(cross, 1, 3, d), offset(cross, 2, 3, d)]].filter(l => l.some(cr => !cr.isnull && !isCrBlack(cr))).length < offset(cross, 1.5, 1.5, d).qnum) {
                add_crblack(cross);
            }
            if ((isLink(offset(cross, .5, -1, d)) || isLink(offset(cross, 1, -.5, d))) && (isLink(offset(cross, .5, +1, d)) || isLink(offset(cross, 1, +.5, d))) && isCrBlack(offset(cross, 2, 0, d))) {
                add_crblack(cross);
            }
            if ((isLink(offset(cross, .5, -1, d)) || isLink(offset(cross, 1, -.5, d))) && (isLink(offset(cross, 2, -.5, d)) || isLink(offset(cross, 1.5, 0, d))) && isCrBlack(offset(cross, 1, 1, d))) {
                add_crblack(cross);
            }
            if ((isLink(offset(cross, .5, +1, d)) || isLink(offset(cross, 1, +.5, d))) && (isLink(offset(cross, 2, +.5, d)) || isLink(offset(cross, 1.5, 0, d))) && isCrBlack(offset(cross, 1, -1, d))) {
                add_crblack(cross);
            }
        }
    });
}

function AkichiwakeAssist() {
    GreenConnected();
    BlackNotAdjacent();
    NoFacingDoor();
    forEachRoom(room => {
        let qnum = room.top.qnum;
        let clist = Array.from(room.clist);
        if (qnum !== CQNUM.none && qnum !== CQNUM.quesmark) {
            clist.forEach(sc => {
                if (isBlack(sc)) { return; }
                let l = [];
                let dfs = function (c) {
                    if (l.includes(c) || c.room !== room || c !== sc && !isGreen(c)) { return; }
                    l.push(c);
                    forEachSide(c, (nb, nc) => !isBound(nb) ? dfs(nc) : undefined);
                };
                dfs(sc);
                if (l.length === qnum && isGreen(sc)) {
                    l.forEach(c => forEachSide(c, (nb, nc) => {
                        if (!nc.isnull && !isBound(nb) && nc.room === room) { add_black(nc); }
                    }));
                }
                if (l.length > qnum && !isGreen(sc)) {
                    add_black(sc);
                }
                if (l.length === qnum && !isGreen(sc)) {
                    let nl = [];
                    l.forEach(c => forEachSide(c, (nb, nc) => {
                        if (!nc.isnull && !isBound(nb) && nc.room === room && !l.includes(nc) && !nl.includes(nc)) {
                            nl.push(nc);
                        }
                    }));
                    if (nl.some(c => adjlist(c.adjacent).some(nc => nl.includes(nc)))) {
                        add_black(sc);
                    }
                }
            });
            if (qnum === 0) {
                add_black(clist[0]);
            }
            if (qnum === clist.filter(c => !isBlack(c)).length) {
                clist.forEach(c => add_green(c));
            }
        }
    });
}

function AyeheyaAssist() {
    forEachRoom(room => {
        let qnum = room.top.qnum;
        let rows = room.clist.getRectSize().rows;
        let cols = room.clist.getRectSize().cols;
        let tx = room.clist.getRectSize().x1 + room.clist.getRectSize().x2;
        let ty = room.clist.getRectSize().y1 + room.clist.getRectSize().y2;
        if (rows % 2 === 1 && cols % 2 === 0) {
            let c1 = board.getc(tx / 2 - 1, ty / 2);
            let c2 = board.getc(tx / 2 + 1, ty / 2);
            if (c1.room === room) { add_green(c1); }
            if (c2.room === room) { add_green(c2); }
        }
        if (rows % 2 === 0 && cols % 2 === 1) {
            let c1 = board.getc(tx / 2, ty / 2 - 1);
            let c2 = board.getc(tx / 2, ty / 2 + 1);
            if (c1.room === room) { add_green(c1); }
            if (c2.room === room) { add_green(c2); }
        }
        if (rows % 2 === 1 && cols % 2 === 1) {
            let c = board.getc(tx / 2, ty / 2);
            if (qnum >= 0 && qnum % 2 === 0 && c.room === room) {
                add_green(c);
            }
            if (qnum >= 0 && qnum % 2 === 1 && c.room === room) {
                add_black(c);
            }
            for (let d = 0; d < 2; d++) {
                if ([offset(c, 0, 1, d), offset(c, 0, -1, d)].every(c => c.isnull || isBlack(c)) &&
                    [offset(c, 1, 0, d), offset(c, -1, 0, d)].every(c => c.room === room)) {
                    add_green(offset(c, 1, 0, d));
                    add_green(offset(c, -1, 0, d));
                }
            }
        }
        if (rows % 2 === 0 && cols % 2 === 0) {
            for (let d = 0; d < 4; d++) {
                let c = offset(board.getobj(tx / 2, ty / 2), .5, .5, d);
                if ([offset(c, 1, 0, d), offset(c, 0, 1, d)].every(c => c.isnull || isBlack(c)) &&
                    [offset(c, -1, 0, d), offset(c, 0, -1, d)].every(c => c.room === room)) {
                    add_green(offset(c, -1, 0, d));
                    add_green(offset(c, 0, -1, d));
                }
            }
        }
        Array.from(room.clist).forEach(cell => {
            if (isGreen(cell)) {
                add_green(board.getc(tx - cell.bx, ty - cell.by));
            }
            if (isBlack(cell)) {
                add_black(board.getc(tx - cell.bx, ty - cell.by));
            }
        });
    });
    HeyawakeAssist(true);
}

function HeyablockAssist() {
    GreenConnected();
    BlackNotAdjacent_OverBorder();
    NoFacingDoor();
    BlackConnected_InRegion(true);
    forEachRoom(room => NShadeInClist({ n: room.top.qnum, clist: Array.from(room.clist), AtLeastOne: room.top.qnum === CQNUM.none }));
}

function HeyawakeAssist(isSym = false) {
    if (document.querySelector('#penaltyText') === null) { // penalty information
        let penaltyText = [];
        if (board.roommgr.components[0].top !== undefined) {
            let penalty = board.cols * board.rows + 1 + board.cols % 2 + board.rows % 2;
            let shadecnt = Array.from(board.roommgr.components).reduce((tot, room) => room.top.qnum >= 0 ? tot + room.top.qnum : tot, 0);
            if ((penalty - shadecnt * 3) <= 5) {
                penaltyText.push(
                    "Whole Board: " +
                    "Penalty: " + penalty + "; " +
                    "Max Shade: " + (Math.floor(penalty / 3)) + "; " +
                    "Min Shade: " + shadecnt + "; " +
                    "Spare Penalty: " + (penalty - shadecnt * 3));
            }
        }
        forEachRoom(room => {
            if (room.top === undefined) { return; }
            if (room.top.qnum < 8) { return; }
            let clist = Array.from(room.clist);
            let penalty = new Set(clist.flatMap(c => [0, 1, 2, 3].map(d => offset(c, .5, .5, d)).filter(cr => !isEdge(cr)))).size;
            let fn = f => Array.from(board.cell).filter(c => f(c)).map(c => c.room === room ? '#' : '_').join('').replaceAll('##', '$').replaceAll('_', '').length;
            penalty += fn(c => c.bx === board.minbx + 1);
            penalty += fn(c => c.by === board.minby + 1);
            penalty += fn(c => c.bx === board.maxbx - 1);
            penalty += fn(c => c.by === board.maxby - 1);
            let shadecnt = room.top.qnum;
            if ((penalty - shadecnt * 3) <= 5) {
                penaltyText.push(
                    "No." + board.roommgr.components.indexOf(room) + " Room: " +
                    "Penalty: " + penalty + "; " +
                    "Shade: " + shadecnt + "; " +
                    "Spare Penalty: " + (penalty - shadecnt * 3));
            }
        });
        document.querySelector('#quesboard').insertAdjacentHTML('beforebegin',
            '<div id="penaltyText">' + penaltyText.join('<br>') + '</div>');
    }
    GreenConnected();
    BlackNotAdjacent();
    NoFacingDoor();
    const MAXSIT = 200000;
    const MAXAREA = 50;
    forEachCell(cell => {
        for (let d = 0; d < 4; d++) {
            if (isBound(offset(cell, 1.5, 0, d)) && isBound(offset(cell, 2.5, 0, d)) &&
                (offset(cell, 1, +1, d).isnull || isBound(offset(cell, .5, +1, d)) && isBound(offset(cell, 1.5, +1, d))) &&
                (offset(cell, 1, -1, d).isnull || isBound(offset(cell, .5, -1, d)) && isBound(offset(cell, 1.5, -1, d)))) {
                if (isBlack(cell)) { add_black(offset(cell, 3, 0, d)); }
                if (isGreen(offset(cell, 3, 0, d))) { add_green(cell); }
            }
            if (isBlack(offset(cell, 2, 0, d)) &&
                (offset(cell, 1, -1, d).isnull || isBlack(offset(cell, 1, -1, d)) || isBound(offset(cell, .5, -1, d)) && isBound(offset(cell, 1.5, -1, d))) &&
                (offset(cell, 1, +1, d).isnull || isBlack(offset(cell, 1, +1, d)) || isBound(offset(cell, .5, +1, d)) && isBound(offset(cell, 1.5, +1, d)))) {
                add_green(cell);
            }
        }
    });
    forEachRoom(room => {
        if (room.top === undefined) { return; }
        let qnum = room.top.qnum;
        if (qnum === CQNUM.none || qnum === CQNUM.quesmark) { return; }
        let clist = Array.from(room.clist).sort((a, b) => a.id - b.id);
        // (4^n-1)/3 black cells in (2^n-1)^2 square
        if (Math.sqrt(clist.length) % 1 === 0) {
            let n = Math.sqrt(clist.length);
            let tc = room.top;
            if ((n & (n + 1)) === 0 && qnum * 3 === (n + 1) ** 2 - 1 && clist.every(c => c.bx >= tc.bx && c.bx < tc.bx + n * 2 && c.by >= tc.by && c.by < tc.by + n * 2)) {
                clist.forEach(c => {
                    let i = (c.bx - tc.bx) / 2 + 1, j = (c.by - tc.by) / 2 + 1;
                    if ((~i & (i - 1)) === (~j & (j - 1))) { add_black(c); }
                    else { add_green(c); }
                });
            }
        }
        let surlist = [];
        let sitcnt = 0;
        let cst = new Map();
        let apl = new Map();
        clist.forEach(cell => {
            cst.set(cell, (isBlack(cell) ? "BLK" : (isGreen(cell) ? "GRN" : "UNK")));
            apl.set(cell, (isBlack(cell) ? "BLK" : (isGreen(cell) ? "GRN" : "UNK")));
        });
        if (qnum === clist.filter(c => isBlack(c)).length) {
            clist.forEach(c => add_green(c));
            return;
        }
        // randomly chosen approximate formula
        if (clist.filter(c => !isBlack(c) && !isGreen(c)).length > MAXAREA &&
            qnum + 1 < clist.filter(c => isBlack(c) || !isGreen(c)).length) { return; }
        if ((qnum - clist.filter(c => isBlack(c)).length) * 2 + 5 <
            clist.filter(c => !isBlack(c) && !isGreen(c)).length) { return; }
        clist.forEach(c => {
            forEachSide(c, (nb, nc) => {
                if (nc.isnull || nc.room === room || surlist.includes(nc)) { return; }
                if (isGreen(nc) || isBlack(nc)) { return; }
                surlist.push(nc);
                apl.set(nc, "GRN");
            });
        });
        let dfs = function (i, blkcnt) {
            if (sitcnt > MAXSIT) { return; }
            if (i === clist.length) {
                if (blkcnt !== qnum) { return; }
                let cset = new Set();
                let exclist = [];
                if (clist.some(c => {
                    if (cst.get(c) === "BLK") { return false; }
                    if (cset.has(c)) { return false; }
                    let n = 0;
                    let olist = [];
                    let dfs = function (c) {
                        if (c.isnull || cset.has(c)) { return false; }
                        if (c.room !== room) {
                            if (isBlack(c)) { return false; }
                            olist.push(c);
                            return true;
                        }
                        if (cst.get(c) === "BLK") { return false; }
                        cset.add(c);
                        n++;
                        let res = 0;
                        res |= dfs(offset(c, -1, 0));
                        res |= dfs(offset(c, 0, -1));
                        res |= dfs(offset(c, 1, 0));
                        res |= dfs(offset(c, 0, 1));
                        return res;
                    };
                    let res = dfs(c);
                    if (olist.length === 1) { exclist.push(olist[0]); }
                    if (!res && n + qnum < clist.length) { return true; }
                    return false;
                })) { return; };
                clist.forEach(c => {
                    if (apl.get(c) !== "UNK" && apl.get(c) !== cst.get(c)) { apl.set(c, "AMB"); }
                    if (apl.get(c) === "UNK") { apl.set(c, cst.get(c)); }
                });
                surlist.forEach(c => {
                    if (exclist.includes(c)) { return; }
                    if (adjlist(c.adjacent).some(c => !c.isnull && c.room === room && cst.get(c) === "BLK")) { return; }
                    apl.set(c, "AMB");
                });
                return;
            }
            if (cst.get(clist[i]) !== "UNK") { dfs(i + 1, blkcnt); return; }
            sitcnt++;
            if (blkcnt < qnum && !adjlist(clist[i].adjacent).some(c => isBlack(c) || cst.has(c) && cst.get(c) === "BLK") &&
                (!isSym || cst.get(clist[clist.length - 1 - i]) !== "GRN")) {
                cst.set(clist[i], "BLK");
                dfs(i + 1, blkcnt + 1);
                cst.set(clist[i], "UNK");
            }
            if (!isSym || cst.get(clist[clist.length - 1 - i]) !== "BLK") {
                cst.set(clist[i], "GRN");
                dfs(i + 1, blkcnt);
            }
            cst.set(clist[i], "UNK");
        };
        dfs(0, clist.filter(c => isBlack(c)).length);
        if (sitcnt > MAXSIT) { return; }
        clist.forEach(c => {
            if (apl.get(c) === "BLK") { add_black(c); }
            if (apl.get(c) === "GRN") { add_green(c); }
        });
        surlist.forEach(c => {
            if (apl.get(c) === "GRN") { add_green(c); }
        });
    });
}

function AkariAssist() {
    let isEmpty = c => !c.isnull && c.qnum === CQNUM.none && c.qans !== CQANS.light && c.qsub !== CQSUB.dot;
    let isNotLight = c => c.isnull || c.qnum !== CQNUM.none || c.qsub === CQSUB.dot
    let add_light = function (c) { add_black(c, true); };
    forEachCell(cell => {
        let emptycnt = 0;
        let lightcnt = 0;
        // add dot where lighted
        if (cell.qlight && cell.qans !== CQANS.light) {
            add_dot(cell);
        }
        // only one place can light
        let emptyclist = [];
        if (cell.qnum === CQNUM.none && !cell.qlight) {
            if (cell.qsub !== CQSUB.dot) {
                emptyclist.push(cell);
            }
            for (let d = 0; d < 4; d++) {
                let pcell = offset(cell, 1, 0, d);
                while (!pcell.isnull && pcell.qnum === CQNUM.none) {
                    emptyclist.push(pcell);
                    pcell = offset(pcell, 1, 0, d);
                }
            }
            emptyclist = emptyclist.filter(c => c.qsub !== CQSUB.dot);
            if (emptyclist.length === 1) {
                add_light(emptyclist[0]);
            }
        }
        // only two cells can lit up this cell
        if (cell.qsub === CQSUB.dot && !cell.qlight && emptyclist.length === 2) {
            let [ec1, ec2] = emptyclist;
            if (ec1.bx !== ec2.bx && ec1.by !== ec2.by) {
                if (ec1.bx === cell.bx) { [ec1, ec2] = [ec2, ec1]; }
                let oc = board.getc(ec1.bx, ec2.by);
                let f = true;
                for (let i = cell.bx; i !== ec1.bx; i += (ec1.bx > cell.bx ? 1 : -1)) {
                    f &= board.getc(i, ec2.by).qnum === CQNUM.none;
                }
                for (let i = cell.by; i !== ec2.by; i += (ec2.by > cell.by ? 1 : -1)) {
                    f &= board.getc(ec1.bx, i).qnum === CQNUM.none;
                }
                if (f && oc.qnum === CQNUM.none) {
                    add_dot(oc);
                }
            }
        }
        forEachSide(cell, (nb, nc) => {
            if (!nc.isnull && nc.qnum === CQNUM.none && nc.qsub !== CQSUB.dot && nc.qans !== CQANS.light) { emptycnt++; }
            lightcnt += (nc.qans === CQANS.light);
        });
        if (cell.qnum >= 0) {
            // finished clue
            if (cell.qnum === lightcnt) {
                forEachSide(cell, (nb, nc) => add_dot(nc));
                gray_clue(cell);
            }
            // finish clue
            if (cell.qnum === emptycnt + lightcnt) {
                forEachSide(cell, (nb, nc) => add_light(nc));
                gray_clue(cell);
            }
            // dot at corner
            if (cell.qnum - lightcnt + 1 === emptycnt) {
                for (let d = 0; d < 4; d++) {
                    if (isEmpty(offset(cell, 0, 1, d)) && isEmpty(offset(cell, 1, 0, d)) && isEmpty(offset(cell, 1, 1, d))) {
                        add_dot(offset(cell, 1, 1, d));
                    }
                }
            }
        }
        for (let d = 0; d < 4; d++) {
            //             
            //  22  => ●22●
            //             
            if (cell.qnum === 2 && offset(cell, 1, 0, d).qnum === 2) {
                add_light(offset(cell, -1, 0, d));
                add_light(offset(cell, 2, 0, d));
            }
            //
            //  21· => ●21·
            //             
            if (cell.qnum === 2 && offset(cell, 1, 0, d).qnum === 1 && isNotLight(offset(cell, 2, 0, d))) {
                add_light(offset(cell, -1, 0, d));
            }
            //          ●  
            //  3   => ●3  
            //   1       1·
            //           · 
            if (cell.qnum === 3 && offset(cell, 1, 1, d).qnum === 1) {
                add_light(offset(cell, -1, 0, d));
                add_light(offset(cell, 0, -1, d));
                add_dot(offset(cell, 1, 2, d));
                add_dot(offset(cell, 2, 1, d));
            }
            //         ·   
            //  2   =>  2  
            //   1       1 
            //             
            if (cell.qnum === 2 && offset(cell, 1, 1, d).qnum === 1) {
                add_dot(offset(cell, -1, -1, d));
            }
            //          ●
            // ·2   => ·2
            //   1       1·
            //           · 
            if (cell.qnum === 2 && offset(cell, 1, 1, d).qnum === 1 &&
                (isNotLight(offset(cell, -1, 0, d)) || isNotLight(offset(cell, 0, -1, d)))) {
                add_light(offset(cell, -1, 0, d));
                add_light(offset(cell, 0, -1, d));
                add_dot(offset(cell, 1, 2, d));
                add_dot(offset(cell, 2, 1, d));
            }
            //          ·
            //  1   => ·1
            //   1·      1·
            //   ·       · 
            if (cell.qnum === 1 && offset(cell, 1, 1, d).qnum === 1 &&
                isNotLight(offset(cell, 1, 2, d)) && isNotLight(offset(cell, 2, 1, d))) {
                add_dot(offset(cell, -1, 0, d));
                add_dot(offset(cell, 0, -1, d));
            }
        }
    });
}

function MasyuAssist() {
    SingleLoopInCell({
        isPass: c => c.qnum !== CQNUM.none,
    });
    let isBlack = c => !c.isnull && c.qnum === CQNUM.bcir;
    let isWhite = c => !c.isnull && c.qnum === CQNUM.wcir;
    let isPathable = b => !b.isnull && !isCross(b);
    forEachCell(cell => {
        for (let d = 0; d < 4; d++) {
            if (isWhite(cell) && offset(cell, .5, .5, d).qsub !== CRQSUB.none) {
                add_inout(offset(cell, -.5, -.5, d), offset(cell, .5, .5, d).qsub ^ 1);
            }
            if (isBlack(cell) && isWhite(offset(cell, -1, -1, d)) && isWhite(offset(cell, 1, 1, d)) &&
                offset(cell, .5, .5, d).qsub !== CRQSUB.none) {
                add_inout(offset(cell, -.5, -.5, d), offset(cell, .5, .5, d).qsub);
            }
            if (isBlack(cell) && isWhite(offset(cell, -1, -1, d)) && isWhite(offset(cell, 1, 1, d)) &&
                offset(cell, -.5, .5, d).qsub !== CRQSUB.none) {
                add_inout(offset(cell, .5, -.5, d), offset(cell, -.5, .5, d).qsub ^ 1);
            }
            //  +×+      +×+
            // ●   ● -> ●   ●
            //  + +      +×+
            if (isBlack(offset(cell, -1, 0, d)) && isBlack(offset(cell, 1, 0, d)) && !isPathable(offset(cell, 0, -.5, d))) {
                add_cross(offset(cell, 0, .5, d));
            }
            // + +    +×+
            // ━○  -> ━○━
            // + +    +×+
            if (isWhite(cell) && (isLine(offset(cell, -.5, 0, d)) || !isPathable(offset(cell, 0, -.5, d)))) {
                add_line(offset(cell, -.5, 0, d));
                add_line(offset(cell, +.5, 0, d));
                add_cross(offset(cell, 0, -.5, d));
                add_cross(offset(cell, 0, +.5, d));
            }
            // + + + +    + + + +
            // ━━━○━╸  -> ━━━○━╸×
            // + + + +    + + + +
            if (isWhite(cell) && isLine(offset(cell, -.5, 0, d)) && isLine(offset(cell, -1.5, 0, d))) {
                add_cross(offset(cell, 1.5, 0, d));
            }
            // + + + +    + +┃+ +
            // ━╸ ○ ○  -> ━╸×○×○ 
            // + + + +    + +┃+ +
            if (isWhite(cell) &&
                (isLine(offset(cell, -1.5, 0, d)) || isWhite(offset(cell, -1, 0, d)) ||
                    ((isntLine(offset(cell, -1, -.5, d)) || isBlack(offset(cell, -1, -1, d))) &&
                        (isntLine(offset(cell, -1, +.5, d)) || isBlack(offset(cell, -1, +1, d))))) &&
                (isLine(offset(cell, +1.5, 0, d)) || isWhite(offset(cell, +1, 0, d)) ||
                    ((isntLine(offset(cell, +1, -.5, d)) || isBlack(offset(cell, +1, -1, d))) &&
                        (isntLine(offset(cell, +1, +.5, d)) || isBlack(offset(cell, +1, +1, d)))))) {
                add_cross(offset(cell, -.5, 0, d));
                add_cross(offset(cell, +.5, 0, d));
                add_line(offset(cell, 0, -.5, d));
                add_line(offset(cell, 0, +.5, d));
            }
            // + + + : + + + : + +┃+ : + + + : + + +    + + +
            // ━●    :  ●×   :  ● ╹  :  ● ●  :  ●  × -> ━●×   
            // + + + ; + + + ; + + + ; + + + ; + + +    + + +
            if (isBlack(cell) && (isLine(offset(cell, -.5, 0, d)) || !isPathable(offset(cell, .5, 0, d)) ||
                isLine(offset(cell, 1, -.5, d)) || isLine(offset(cell, 1, .5, d)) ||
                isBlack(offset(cell, 1, 0, d)) || !isPathable(offset(cell, 1.5, 0, d)))) {
                add_cross(offset(cell, .5, 0, d));
                add_line(offset(cell, -.5, 0, d));
            }
            // + + +    + + +
            //  ●━╸  ->  ●━━━ 
            // + + +    + + +
            if (isBlack(cell) && isLine(offset(cell, .5, 0, d))) {
                add_line(offset(cell, 1.5, 0, d));
            }
            // + + + + +    + + + + +
            //  ●   ○ ○  -> ━●   ○ ○ 
            // + + + + +    + + + + +
            if (isBlack(cell) && isWhite(offset(cell, 2, 0, d)) && isWhite(offset(cell, 3, 0, d))) {
                add_line(offset(cell, -.5, 0, d));
            }
            // + + + +    + + + +
            //  ○   ○      ○   ○ 
            // + + + + -> + + + +
            //    ●          ●   
            // + + + +    + +┃+ +
            if (isBlack(cell) && isWhite(offset(cell, -1, -1, d)) && isWhite(offset(cell, 1, -1, d))) {
                add_line(offset(cell, 0, .5, d));
            }
            // connectivity and black
            if (isBlack(cell) && cell.path !== null && cell.path === offset(cell, 2, 0, d).path &&
                offset(cell, 1, 0, d).path === null && board.linegraph.components.length > 1) {
                add_line(offset(cell, -.5, 0, d));
            }
            // connectivity and white
            if (isWhite(cell) && offset(cell, -1, 0, d).path !== null && offset(cell, -1, 0, d).path === offset(cell, +1, 0, d).path &&
                board.linegraph.components.length > 1) {
                add_line(offset(cell, 0, +.5, d));
                add_line(offset(cell, 0, -.5, d));
            }
        }
    });
}

function SimpleLoopAssist() {
    SingleLoopInCell({
        isPassable: c => c.ques !== CQUES.wall,
        isPass: c => c.ques !== CQUES.wall,
    });
}

function KoburinAssist() {
    SingleLoopInCell({
        isPassable: c => c.qnum === CQNUM.none,
        isPass: c => c.qsub === CQSUB.dot,
        add_notpass: c => add_black(c, true),
        add_pass: add_dot,
    });
    let isPathable = c => !c.isnull && c.qnum === CQNUM.none && !isBlack(c);
    let isEmpty = c => !c.isnull && c.qnum === CQNUM.none && !isBlack(c) && c.qsub !== CQSUB.dot && c.lcnt === 0;
    const koburin_minesweeper = ui.puzzle.config.list.koburin_minesweeper.val;
    forEachCell(cell => {
        // check clue
        if (cell.qnum >= 0) {
            let list = adjlist(cell.adjacent);
            if (koburin_minesweeper) { list = adj8list(cell); }
            if (list.filter(c => isBlack(c)).length === cell.qnum) {
                list.forEach(c => add_dot(c));
            }
            if (list.filter(c => !c.isnull && c.qnum === CQNUM.none && c.qsub !== CQSUB.dot).length === cell.qnum) {
                list.forEach(c => add_black(c, true));
            }
        }
        // add cross
        if (cell.qnum !== CQNUM.none && !koburin_minesweeper) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
            for (let d = 0; d < 4; d++) {
                //        · ·
                //  3  ->  3 
                //        · ·
                if (cell.qnum === 3) {
                    add_dot(offset(cell, -1, -1));
                    add_dot(offset(cell, -1, +1));
                    add_dot(offset(cell, +1, -1));
                    add_dot(offset(cell, +1, +1));
                }
                //          █  
                //  3   -> █3  
                //    █       █
                if (cell.qnum === 3 && offset(cell, 1, 1, d).qnum === CQNUM.none && (isntLine(offset(cell, 1.5, 1, d)) ||
                    (c => c.isnull || isBlack(c) || c.qnum !== CQNUM.none)(offset(cell, 2, 1, d)))) {
                    add_black(offset(cell, -1, 0, d), true);
                    add_black(offset(cell, 0, -1, d), true);
                }
                if (cell.qnum === 3 && offset(cell, 1, -1, d).qnum === CQNUM.none && (isntLine(offset(cell, 1.5, -1, d)) ||
                    (c => c.isnull || isBlack(c) || c.qnum !== CQNUM.none)(offset(cell, 2, -1, d)))) {
                    add_black(offset(cell, -1, 0, d), true);
                    add_black(offset(cell, 0, 1, d), true);
                }
                //         ·   
                //  2   ->  2  
                //    █       █
                if (cell.qnum === 2 && offset(cell, 1, 1, d).qnum === CQNUM.none && (isntLine(offset(cell, 1.5, 1, d)) ||
                    (c => c.isnull || isBlack(c) || c.qnum !== CQNUM.none)(offset(cell, 2, 1, d)))) {
                    add_dot(offset(cell, -1, -1, d));
                }
                if (cell.qnum === 2 && offset(cell, 1, -1, d).qnum === CQNUM.none && (isntLine(offset(cell, 1.5, -1, d)) ||
                    (c => c.isnull || isBlack(c) || c.qnum !== CQNUM.none)(offset(cell, 2, -1, d)))) {
                    add_dot(offset(cell, -1, 1, d));
                }
            }
            return;
        }
        if (isClue(cell)) { return; }
        // add dot around black
        if (isBlack(cell)) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
            forEachSide(cell, (nb, nc) => add_dot(nc));
            return;
        }
        let emptycnt = 0;
        let linecnt = 0;
        forEachSide(cell, (nb, nc) => {
            if (isPathable(nc) && !isCross(nb)) { emptycnt++; }
            linecnt += isLine(nb);
        });
        // no branch
        if (linecnt === 2) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        // no deadend
        if (emptycnt <= 1) {
            add_black(cell, true);
            forEachSide(cell, (nb, nc) => add_cross(nb));
            forEachSide(cell, (nb, nc) => add_dot(nc));
        }
        // 2 degree cell no deadend
        if (emptycnt === 2) {
            forEachSide(cell, (nb, nc) => {
                if (!isPathable(nc) || isCross(nb)) { return; }
                add_dot(nc);
            });
        }
    });
}

function YajisanKazusanAssist() {
    BlackNotAdjacent();
    GreenConnected();
    forEachCell(cell => {
        // check clue
        if (!isBlack(cell) && cell.qnum >= 0 && cell.qdir !== QDIR.none) {
            let d = qdirRemap(cell.qdir);
            let qnum = cell.qnum;
            let list = [];
            let dn = 0, lc = null;
            while (!offset(cell, dn + 1, 0, d).isnull) {
                dn++;
                let c = offset(cell, dn, 0, d);
                if (isBlack(c)) { qnum--; }
                if (isBlack(c) || isGreen(c)) { continue; }
                if (lc === null) {
                    lc = c;
                    continue;
                }
                if (lc === offset(c, -1, 0, d)) {
                    list.push([lc, c]);
                    lc = null;
                } else {
                    list.push([lc]);
                    lc = c;
                }
            }
            if (lc !== null) { list.push([lc]); }
            if (list.length < qnum || qnum < 0) {
                add_black(cell);
            }
            if (qnum === 0) {
                add_green(offset(cell, 1, 0, d));
            }
            if (list.length === qnum && isGreen(cell)) {
                list.forEach(p => {
                    if (p.length === 1) {
                        add_black(p[0]);
                    }
                });
            }
            if (qnum === 0 && isGreen(cell)) {
                list.forEach(p => p.forEach(c => add_green(c)));
            }
        }
    });
}

function RegionalYajilinAssist() {
    SingleLoopInCell({
        isPassable: c => !c.isnull && !isBlack(c),
        isPass: c => c.qsub === CQSUB.dot,
        add_notpass: c => add_black(c, true),
        add_pass: c => add_dot(c, false),
    });
    let isPassable = c => !c.isnull && !isBlack(c);
    let isEmpty = c => !c.isnull && !isBlack(c) && c.qsub !== CQSUB.dot && c.lcnt === 0;
    forEachRoom(room => {
        let n = room.top.qnum;
        if (n < 0) { return; }
        let clist = Array.from(room.clist);
        if (clist.filter(c => !isDot(c) && c.lcnt === 0).length === n) {
            clist.filter(c => !isDot(c) && c.lcnt === 0).forEach(c => add_black(c));
        }
        if (clist.filter(c => isBlack(c)).length === n) {
            clist.filter(c => !isBlack(c)).forEach(c => add_dot(c, false));
        }
    });
    forEachCell(cell => {
        // add dot around black
        if (isBlack(cell)) {
            forEachSide(cell, (nb, nc) => { add_cross(nb); add_dot(nc, false) });
            return;
        }
        let emptycnt = 0;
        let linecnt = 0;
        forEachSide(cell, (nb, nc) => {
            if (isPassable(nc) && !isCross(nb)) { emptycnt++; }
            linecnt += isLine(nb);
        });
        // no branch
        if (linecnt === 2) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        // no deadend
        if (emptycnt <= 1) {
            add_black(cell);
            forEachSide(cell, (nb, nc) => { add_cross(nb); add_dot(nc, false); });
        }
        // 2 degree cell no deadend
        if (emptycnt === 2) {
            forEachSide(cell, (nb, nc) => {
                if (!isPassable(nc) || isCross(nb)) { return; }
                add_dot(nc, false);
            });
        }
        // prevent multiple loops
        let list = adjlist(cell.adjborder, cell.adjacent);
        list = list.filter(([b, c]) => isPassable(c) && !isCross(b));
        if (list.length === 0 || list[0][1].path !== undefined && list[0][1].path !== null && list.every(([b, c]) => c.path === list[0][1].path) && board.linegraph.components.length > 1) {
            add_black(cell);
        }
        for (let d = 0; d < 4; d++) {
            if (!isPassable(offset(cell, -1, 0, d))) { continue; }
            if (!isPassable(offset(cell, 0, -1, d))) { continue; }
            if (isPassable(offset(cell, -2, 0, d)) && offset(cell, -1.5, 0, d).qsub !== BQSUB.cross) { continue; }
            if (isPassable(offset(cell, 0, -2, d)) && offset(cell, 0, -1.5, d).qsub !== BQSUB.cross) { continue; }
            if (!isLine(offset(cell, -1, -1.5, d)) && !isLine(offset(cell, -1.5, -1, d))) { continue; }
            add_dot(cell, false);
        }
    });
    // copied from heyawake
    const MAXSIT = 200000;
    const MAXAREA = 50;
    forEachRoom(room => {
        let qnum = room.top.qnum;
        if (qnum === CQNUM.none || qnum === CQNUM.quesmark) { return; }
        let clist = Array.from(room.clist).sort((a, b) => a.id - b.id);
        let oclist = [];
        let blist = [];
        let sitcnt = 0;
        let cst = new Map();
        let apl = new Map();
        clist.forEach(cell => {
            cst.set(cell, (isBlack(cell) ? "BLK" : (isGreen(cell) ? "GRN" : "UNK")));
            apl.set(cell, (isBlack(cell) ? "BLK" : (isGreen(cell) ? "GRN" : "UNK")));
        });
        if (qnum === clist.filter(c => isBlack(c)).length) {
            clist.forEach(c => add_green(c));
            return;
        }
        // randomly chosen approximate formula
        if (clist.filter(c => !isBlack(c) && !isDot(c)).length > MAXAREA &&
            qnum + 1 < clist.filter(c => isBlack(c) || !isDot(c)).length) { return; }
        if ((qnum - clist.filter(c => isBlack(c)).length) * 3 + 5 <
            clist.filter(c => !isBlack(c) && !isDot(c)).length) { return; }
        oclist = unique(clist.flatMap(c => adjlist(c.adjacent)).filter(nc => !nc.isnull && nc.room !== room && !isDot(nc) && !isBlack(nc)));
        oclist.forEach(nc => apl.set(nc, "GRN"));
        let dfs = function (i, blkcnt) {
            if (sitcnt > MAXSIT) { return; }
            if (i === clist.length) {
                if (blkcnt !== qnum) { return; }
                let cset = new Set();
                let exclist = [];
                if (unique(clist.flatMap(c => adjlist(c.adjacent))).some(c =>
                    !c.isnull && adjlist(c.adjacent).filter(nc => nc.isnull || isBlack(nc) || cst.get(nc) === "BLK").length >= 3
                )) { return; }
                if (clist.some(c => {
                    if (cst.get(c) === "BLK") { return false; }
                    if (cset.has(c)) { return false; }
                    let n = 0;
                    let olist = [];
                    let dfs = function (c) {
                        if (c.isnull || cset.has(c)) { return false; }
                        if (c.room !== room) {
                            if (isBlack(c)) { return false; }
                            olist.push(c);
                            return true;
                        }
                        if (cst.get(c) === "BLK") { return false; }
                        cset.add(c);
                        n++;
                        return adjlist(c.adjacent).map(c => dfs(c)).reduce((a, b) => (a || b), false);
                    };
                    let res = dfs(c);   // whether c can connect to other room
                    if (olist.length === 1) { exclist.push(olist[0]); }
                    if (!res && n + qnum < clist.length) { return true; }
                    return false;
                })) { return; };
                let t = [];
                clist.forEach(c => {
                    if (apl.get(c) !== "UNK" && apl.get(c) !== cst.get(c)) { apl.set(c, "AMB"); }
                    if (apl.get(c) === "UNK") { apl.set(c, cst.get(c)); }
                    if (cst.get(c) === "BLK" || isBlack(c)) { t.push(...adjlist(c.adjborder)); }
                });
                blist.push(t);
                oclist.forEach(c => {
                    if (exclist.includes(c)) { return; }
                    if (adjlist(c.adjacent).some(c => !c.isnull && c.room === room && cst.get(c) === "BLK")) { return; }
                    apl.set(c, "AMB");
                });
                return;
            }
            if (cst.get(clist[i]) !== "UNK") { dfs(i + 1, blkcnt); return; }
            sitcnt++;
            if (blkcnt < qnum && !adjlist(clist[i].adjacent).some(c => isBlack(c) || cst.has(c) && cst.get(c) === "BLK")) {
                cst.set(clist[i], "BLK");
                dfs(i + 1, blkcnt + 1);
                cst.set(clist[i], "UNK");
            }
            cst.set(clist[i], "GRN");
            dfs(i + 1, blkcnt);
            cst.set(clist[i], "UNK");
        };
        dfs(0, clist.filter(c => isBlack(c)).length);
        if (sitcnt > MAXSIT) { return; }
        clist.forEach(c => {
            if (apl.get(c) === "BLK") { add_black(c); }
            if (apl.get(c) === "GRN") { add_green(c); }
        });
        oclist.forEach(c => {
            if (apl.get(c) === "GRN") { add_green(c); }
        });
        if (blist.length > 0) {
            blist.reduce((l1, l2) => l1.filter(b => l2.includes(b))).forEach(b => add_cross(b));
        }
    });
}

function YajilinAssist() {
    SingleLoopInCell({
        isPassable: c => !c.isnull && c.qnum === CQNUM.none && !isBlack(c),
        isPass: c => c.qsub === CQSUB.dot,
        add_notpass: c => add_black(c, true),
        add_pass: add_dot,
    });
    let isPassable = c => !c.isnull && c.qnum === CQNUM.none && !isBlack(c);
    let isEmpty = c => !c.isnull && c.qnum === CQNUM.none && !isBlack(c) && c.qsub !== CQSUB.dot && c.lcnt === 0;
    forEachCell(cell => {
        // check clue
        if (cell.qnum >= 0 && cell.qdir !== QDIR.none) {
            let d = qdirRemap(cell.qdir);
            let qnum = cell.qnum;
            let list = [];
            let dn = 0, lc = [];
            while ((c => !c.isnull && (c.qnum < 0 || c.qdir !== cell.qdir))(offset(cell, dn + 1, 0, d))) {
                dn++;
                let c = offset(cell, dn, 0, d);
                if (isBlack(c)) { qnum--; }
                if (!isEmpty(c)) { continue; }
                if (lc.length === 0) {
                    lc = [c];
                    continue;
                }
                if (lc.length === 1 && lc[0] === offset(c, -1, 0, d)) {
                    lc.push(c);
                } else if ((lc.length === 2 && lc[1] === offset(c, -1, 0, d) && lc[0] === offset(c, -2, 0, d) ||
                    lc.length === 1 && lc[0] === offset(c, -2, 0, d) && offset(c, -1, 0, d).qnum === CQNUM.none) &&
                    ([[-1, +.5], [-1, -.5]].some(([x, y]) => isntLine(offset(c, x, y, d))) ||
                        [[0, -1.5], [+.5, -1]].some(([x, y]) => isntLine(offset(c, x, y, d))) &&
                        [[-2, -1.5], [-2.5, -1]].some(([x, y]) => isntLine(offset(c, x, y, d))) &&
                        offset(c, 0, -1, d).qnum === CQNUM.none && offset(c, -2, -1, d).qnum === CQNUM.none ||
                        [[0, +1.5], [+.5, +1]].some(([x, y]) => isntLine(offset(c, x, y, d))) &&
                        [[-2, +1.5], [-2.5, +1]].some(([x, y]) => isntLine(offset(c, x, y, d))) &&
                        offset(c, 0, +1, d).qnum === CQNUM.none && offset(c, -2, +1, d).qnum === CQNUM.none)) {
                    lc.push(c);
                } else {
                    list.push(lc);
                    lc = [c];
                }
            }
            if (lc.length !== 0) { list.push(lc); }
            if ((c => c.qnum >= 0 && c.qdir === cell.qdir)(offset(cell, dn + 1, 0, d))) {
                qnum -= offset(cell, dn + 1, 0, d).qnum;
            }
            if (list.length === qnum) {
                list.forEach(p => {
                    if (p.length === 1) {
                        add_black(p[0]);
                    }
                    if (p.length === 2 && offset(p[0], 1, 0, d) === p[1]) {
                        add_cross(offset(p[0], .5, 0, d));
                        if (!isClue(offset(p[0], 0, -1, d)) && [[-.5, -1], [0, -1.5]].some(([x, y]) => isntLine(offset(p[0], x, y, d)))) {
                            add_dot(offset(p[0], 1, -1, d));
                        }
                        if (!isClue(offset(p[0], 0, +1, d)) && [[-.5, +1], [0, +1.5]].some(([x, y]) => isntLine(offset(p[0], x, y, d)))) {
                            add_dot(offset(p[0], 1, +1, d));
                        }
                        if (!isClue(offset(p[0], 1, -1, d)) && [[1.5, -1], [1, -1.5]].some(([x, y]) => isntLine(offset(p[0], x, y, d)))) {
                            add_dot(offset(p[0], 0, -1, d));
                        }
                        if (!isClue(offset(p[0], 1, +1, d)) && [[1.5, +1], [1, +1.5]].some(([x, y]) => isntLine(offset(p[0], x, y, d)))) {
                            add_dot(offset(p[0], 0, +1, d));
                        }
                    }
                    if (p.length === 2 && offset(p[0], 2, 0, d) === p[1]) {
                        if (isntLine(offset(p[0], 1, -.5, d))) { add_line(offset(p[0], 1, +.5, d)); }
                        if (isntLine(offset(p[0], 1, +.5, d))) { add_line(offset(p[0], 1, -.5, d)); }
                    }
                    if (p.length === 3) {
                        if (isntLine(offset(p[0], 1, -.5, d))) { add_dot(offset(p[0], 1, +1, d)); }
                        if (isntLine(offset(p[0], 1, +.5, d))) { add_dot(offset(p[0], 1, -1, d)); }
                    }
                });
            }
            if (qnum === 0) {
                list.forEach(p => p.forEach(c => add_dot(c)));
            }
        }
        // add cross
        if (cell.qnum !== CQNUM.none) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
            return;
        }
        // add dot around black
        if (isBlack(cell)) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
            forEachSide(cell, (nb, nc) => add_dot(nc));
            return;
        }
        let emptycnt = 0;
        let linecnt = 0;
        forEachSide(cell, (nb, nc) => {
            if (isPassable(nc) && !isCross(nb)) { emptycnt++; }
            linecnt += isLine(nb);
        });
        // no branch
        if (linecnt === 2) {
            forEachSide(cell, (nb, nc) => add_cross(nb));
        }
        // no deadend
        if (emptycnt <= 1) {
            add_black(cell);
            forEachSide(cell, (nb, nc) => add_cross(nb));
            forEachSide(cell, (nb, nc) => add_dot(nc));
        }
        // 2 degree cell no deadend
        if (emptycnt === 2) {
            forEachSide(cell, (nb, nc) => {
                if (!isPassable(nc) || isCross(nb)) { return; }
                add_dot(nc);
            });
        }
        // prevent multiple loops
        let list = adjlist(cell.adjborder, cell.adjacent);
        list = list.filter(([b, c]) => isPassable(c) && !isCross(b));
        if (list.length === 0 || list[0][1].path !== undefined && list[0][1].path !== null && list.every(([b, c]) => c.path === list[0][1].path) && board.linegraph.components.length > 1) {
            add_black(cell);
        }
        for (let d = 0; d < 4; d++) {
            if (isPassable(offset(cell, -1, 0, d)) && isPassable(offset(cell, 0, -1, d)) &&
                (isntLine(offset(cell, -1.5, 0, d)) || isntLine(offset(cell, -1, .5, d))) &&
                (isntLine(offset(cell, 0, -1.5, d)) || isntLine(offset(cell, .5, -1, d))) &&
                (isLine(offset(cell, -1, -1.5, d)) || isLine(offset(cell, -1.5, -1, d)))) {
                add_dot(cell);
            }
        }
    });
}

function VertexSlitherlinkAssist() {
    SingleLoopInBorder({ useCrossQsub: false });
    let isCrEmpty = cr => !cr.isnull && cr.qsub === 0;
    let isCrCrs = cr => !cr.isnull && cr.qsub === 2;
    let isCrDot = cr => !cr.isnull && cr.qsub === 1;
    let add_crcrs = function (cr) {
        if (cr === undefined || cr === null || cr.isnull || !isCrEmpty(cr)) { return; }
        stpcnt = true;
        cr.setQsub(2);
        cr.draw();
    }
    let add_crdot = function (cr) {
        if (cr === undefined || cr === null || cr.isnull || !isCrEmpty(cr)) { return; }
        stpcnt = true;
        cr.setQsub(1);
        cr.draw();
    }
    forEachCell(cell => {
        NShadeInClist({
            isShaded: isCrDot,
            isUnshaded: isCrCrs,
            add_shaded: add_crdot,
            add_unshaded: add_crcrs,
            n: cell.qnum,
            clist: [0, 1, 2, 3].map(d => offset(cell, .5, .5, d)),
        });
        for (let d = 0; d < 4; d++) {
            if (cell.qnum === 1 && (isntLine(offset(cell, 1, .5, d)) || isntLine(offset(cell, .5, 1, d)))) {
                add_crcrs(offset(cell, .5, .5, d));
            }
            if (cell.qnum === 2 && (isntLine(offset(cell, 1, .5, d)) && isntLine(offset(cell, .5, 1, d)))) {
                add_crcrs(offset(cell, .5, .5, d));
            }
        }
    });
    forEachCross(cross => {
        let lcnt = cross.lcnt;
        if (lcnt > 0) { add_crdot(cross); }
        if (isCrCrs(cross)) { forEachSide(cross, (nb, nc) => add_crcrs(nb)); }
        if (adjlist(cross.adjborder).every(b => isntLine(b))) { add_crcrs(cross); }
        if (isCrDot(cross)) {
            NShadeInClist({
                isShaded: isLine,
                isUnshaded: isCross,
                add_shaded: add_line,
                add_unshaded: add_cross,
                n: 2,
                clist: adjlist(cross.adjborder),
            });
        }
    });
}

function LitherslinkAssist() {
    hasInvCrQsub = true;
    forEachCross(cross => {
        let qsub;
        if (cross.qsub === 0 || JSON.parse(cross.qsub).length === 0) {
            qsub = [];
            let list = adjlist(cross.adjborder);
            for (let i = 1; i < 16; i++) {
                if ([0b0011, 0b0101, 0b1001, 0b0110, 0b1010, 0b1100].includes(i)) { continue; }
                let t = [];
                for (let j = 0; j < 4; j++) { if (i & (1 << j)) { t.push(list[j].id); } }
                if (!t.some(n => n === null)) { qsub.push(t); }
            }
        } else { qsub = JSON.parse(cross.qsub); }
        qsub = qsub.filter(s => s.every(i => !isCross(board.border[i])));
        forEachSide(cross, (nb, nc) => {
            if (isLine(nb)) { qsub = qsub.filter(s => s.includes(nb.id)); }
            if (qsub.every(s => s.includes(nb.id))) { add_line(nb); }
            if (qsub.every(s => !s.includes(nb.id))) { add_cross(nb); }
        });
        cross.setQsub(JSON.stringify(qsub));
    });
    forEachCell(cell => {
        NShadeInClist({
            isShaded: isLine,
            isUnshaded: isCross,
            add_shaded: add_line,
            add_unshaded: add_cross,
            n: cell.qnum,
            clist: adjlist(cell.adjborder),
        });
        // deduce single clue with invisible cross qsub. it's disabled here because it's overpowered.
        if (cell.qnum >= 0 && false) {
            let list = [offset(cell, -.5, -.5), offset(cell, .5, -.5), offset(cell, -.5, .5), offset(cell, .5, .5)];
            let sum = list.map(cr => JSON.parse(cr.qsub).length).reduce((a, b) => a + b, 0);
            let comblist = [];
            JSON.parse(list[0].qsub).forEach(q0 => {
                if (adjlist(cell.adjborder).filter(b => [].concat(q0).includes(b.id)).length > cell.qnum) { return; }
                if (2 - adjlist(cell.adjborder).filter(b => [].concat(q0).includes(b.id)).length > 4 - cell.qnum) { return; }
                JSON.parse(list[1].qsub).forEach(q1 => {
                    if (adjlist(cell.adjborder).filter(b => [].concat(q0, q1).includes(b.id)).length > cell.qnum) { return; }
                    if (3 - adjlist(cell.adjborder).filter(b => [].concat(q0, q1).includes(b.id)).length > 4 - cell.qnum) { return; }
                    if (q0.includes(offset(cell, 0, -.5).id) ^ q1.includes(offset(cell, 0, -.5).id)) { return; }
                    JSON.parse(list[2].qsub).forEach(q2 => {
                        if (q0.includes(offset(cell, -.5, 0).id) ^ q2.includes(offset(cell, -.5, 0).id)) { return; }
                        JSON.parse(list[3].qsub).forEach(q3 => {
                            if (q2.includes(offset(cell, 0, .5).id) ^ q3.includes(offset(cell, 0, .5).id)) { return; }
                            if (q1.includes(offset(cell, .5, 0).id) ^ q3.includes(offset(cell, .5, 0).id)) { return; }
                            if (adjlist(cell.adjborder).filter(b => [].concat(q0, q1, q2, q3).includes(b.id)).length !== cell.qnum) { return; }
                            comblist.push([q0, q1, q2, q3]);
                        });
                    });
                });
            });
            list.forEach((cr, i) => { cr.setQsub(JSON.stringify(JSON.parse(cr.qsub).filter(s => comblist.some(comb => JSON.stringify(comb[i]) === JSON.stringify(s))))); });
            if (list.map(cr => JSON.parse(cr.qsub).length).reduce((a, b) => a + b, 0) < sum) { stp2cnt++; }
        }
        for (let d = 0; d < 4; d++) {
            let b1 = offset(cell, 1, .5, d);
            let b2 = offset(cell, .5, 1, d);
            if (cell.qnum === 1 && ([b1, b2].every(b => isLine(b)) || [b1, b2].every(b => isntLine(b)))) {
                add_cross(offset(cell, -.5, 0, d));
                add_cross(offset(cell, 0, -.5, d));
            }
            if (cell.qnum === 1 && (isLine(b1) && isntLine(b2) || isLine(b2) && isntLine(b1))) {
                add_cross(offset(cell, .5, 0, d));
                add_cross(offset(cell, 0, .5, d));
            }
            if (cell.qnum === 3 && [b1, b2].every(b => isntLine(b))) {
                add_line(offset(cell, -.5, 0, d));
                add_line(offset(cell, 0, -.5, d));
            }
            if (cell.qnum === 3 && (isLine(b1) && isntLine(b2) || isLine(b2) && isntLine(b1))) {
                add_line(offset(cell, .5, 0, d));
                add_line(offset(cell, 0, .5, d));
            }
            if (cell.qnum === 3 && isLine(offset(cell, -.5, 0, d)) && isLine(offset(cell, 0, -.5, d)) && offset(cell, 1, 1, d).qnum === 3) {
                add_line(b1);
                add_line(b2);
            }
            if (cell.qnum === 3 && offset(cell, 1, 0, d).qnum === 3) {
                add_line(offset(cell, .5, 0, d));
            }
        }
    });
    forEachCross(cross => {
        let lcnt = cross.lcnt;
        let ccnt = adjlist(cross.adjborder).filter(b => isntLine(b)).length;
        if (lcnt + ccnt === 3 && [0, 2].includes(lcnt)) {
            forEachSide(cross, (nb, nc) => add_line(nb));
        }
        if (lcnt + ccnt === 3 && [0, 2].includes(lcnt + 1)) {
            forEachSide(cross, (nb, nc) => add_cross(nb));
        }
    });
    let DSU = new Map(); // Disjoint Set Union
    let DSUfind = function (n) {
        if (DSU.get(n) !== n) { DSU.set(n, DSUfind(DSU.get(n))); }
        return DSU.get(n);
    };
    forEachCross(cross => {
        DSU.set(cross, cross);
        for (let d = 0; d < 4; d++) {
            let ncross = offset(cross, 1, 0, d);
            if (ncross.isnull || !DSU.has(ncross)) { continue; }
            if (isLine(offset(cross, .5, 0, d)) || [offset(cross, .5, -.5, d), offset(cross, .5, .5, d)].some(c => c.qnum === 3)) {
                DSU.set(DSUfind(cross), DSUfind(ncross));
            }
        }
    });
    forEachBorder(border => {
        let [cr1, cr2] = border.sidecross;
        if (!isLine(border) && cr1.path !== null && cr1.path === cr2.path) { add_cross(border); }
        if (!isLine(border) && DSUfind(cr1) === DSUfind(cr2) && !border.sidecell.some(c => c.qnum === 3)) { add_cross(border); }
    });
}

function SWSlitherlinkAssist() {
    let add_bg_color = function (c, color) {
        if (c === undefined || c.isnull || c.qsub !== CQSUB.none || c.qsub === color) { return; }
        c.setQsub(color);
        c.draw();
        stepcheck(true);
    }
    let add_green = function (c) { add_bg_color(c, CQSUB.green); }
    let add_yellow = function (c) { add_bg_color(c, CQSUB.yellow); }
    forEachCell(cell => {
        if (cell.qnum === 5) { add_green(cell); }
        if (cell.qnum === 6) { add_yellow(cell); }
    });
    SlitherlinkAssist();
}

function SlitherlinkAssist() {
    SingleLoopInBorder();
    let add_bg_color = function (c, color) {
        if (c === undefined || c.isnull || c.qsub !== CQSUB.none || c.qsub === color) { return; }
        c.setQsub(color);
        c.draw();
        stepcheck(true);
    }
    let add_green = function (c) { add_bg_color(c, CQSUB.green); }
    let add_yellow = function (c) { add_bg_color(c, CQSUB.yellow); }
    let isYellow = c => c.isnull || c.qsub === CQSUB.yellow;
    CellConnected({
        isShaded: c => isGreen(c) && c.qnum !== 3,
        isUnshaded: c => isYellow(c) || c.qsub === CQSUB.none && c.qnum === 3,
        add_shaded: add_green,
        add_unshaded: add_yellow,
        isLinked: (c, nb, nc) => isCross(nb),
        isNotPassable: (c, nb, nc) => isLine(nb),
    });
    CellConnected({
        isShaded: c => isYellow(c) && c.qnum !== 3,
        isUnshaded: c => isGreen(c) || c.qsub === CQSUB.none && c.qnum === 3,
        add_shaded: add_yellow,
        add_unshaded: add_green,
        isLinked: (c, nb, nc) => isCross(nb),
        isNotPassable: (c, nb, nc) => isLine(nb),
        OutsideAsShaded: true,
    });
    // counting this due to some small loop jokes
    let twocnt = 0;
    let threecnt = 0;
    forEachCell(cell => {
        twocnt += cell.qnum === 2;
        threecnt += cell.qnum === 3;
    });
    forEachCell(cell => {
        let blist = adjlist(cell.adjborder);
        if (blist.filter(b => isLine(b)).length === cell.qnum) {
            blist.forEach(b => add_cross(b));
        }
        if (blist.filter(b => !isCross(b)).length === cell.qnum) {
            blist.forEach(b => add_line(b));
        }
        // deduce single clue with invisible cross qsub
        if (cell.qnum >= 0) {
            let list = [offset(cell, -.5, -.5), offset(cell, .5, -.5), offset(cell, -.5, .5), offset(cell, .5, .5)];
            let sum = list.map(cr => JSON.parse(cr.qsub).length).reduce((a, b) => a + b, 0);
            let comblist = [];
            JSON.parse(list[0].qsub).forEach(q0 => {
                if (adjlist(cell.adjborder).filter(b => [].concat(q0).includes(b.id)).length > cell.qnum) { return; }
                if (2 - adjlist(cell.adjborder).filter(b => [].concat(q0).includes(b.id)).length > 4 - cell.qnum) { return; }
                JSON.parse(list[1].qsub).forEach(q1 => {
                    if (adjlist(cell.adjborder).filter(b => [].concat(q0, q1).includes(b.id)).length > cell.qnum) { return; }
                    if (3 - adjlist(cell.adjborder).filter(b => [].concat(q0, q1).includes(b.id)).length > 4 - cell.qnum) { return; }
                    if (q0.includes(offset(cell, 0, -.5).id) ^ q1.includes(offset(cell, 0, -.5).id)) { return; }
                    JSON.parse(list[2].qsub).forEach(q2 => {
                        if (q0.includes(offset(cell, -.5, 0).id) ^ q2.includes(offset(cell, -.5, 0).id)) { return; }
                        JSON.parse(list[3].qsub).forEach(q3 => {
                            if (q2.includes(offset(cell, 0, .5).id) ^ q3.includes(offset(cell, 0, .5).id)) { return; }
                            if (q1.includes(offset(cell, .5, 0).id) ^ q3.includes(offset(cell, .5, 0).id)) { return; }
                            if (adjlist(cell.adjborder).filter(b => [].concat(q0, q1, q2, q3).includes(b.id)).length !== cell.qnum) { return; }
                            comblist.push([q0, q1, q2, q3]);
                        });
                    });
                });
            });
            list.forEach((cr, i) => { cr.setQsub(JSON.stringify(JSON.parse(cr.qsub).filter(s => comblist.some(comb => JSON.stringify(comb[i]) === JSON.stringify(s))))); });
            if (list.map(cr => JSON.parse(cr.qsub).length).reduce((a, b) => a + b, 0) < sum) { stp2cnt++; }
        }
        for (let d = 0; d < 4; d++) {
            //            ×  
            // · · ·    ╻ ╻ ╻
            //  3 3  -> ┃3┃3┃
            // · · ·    ╹ ╹ ╹
            //            ×  
            if (cell.qnum === 3 && (threecnt > 2 || twocnt > 0) &&
                offset(cell, 1, 0, d).qnum === 3) {
                add_line(offset(cell, -.5, 0, d));
                add_line(offset(cell, .5, 0, d));
                add_line(offset(cell, 1.5, 0, d));
                add_cross(offset(cell, .5, -1, d));
                add_cross(offset(cell, .5, 1, d));
                let fn = function (c1, c2) {
                    if (isYellow(c1)) {
                        add_bg_color(c2, CQSUB.green);
                    }
                    if (isGreen(c1)) {
                        add_bg_color(c2, CQSUB.yellow);
                    }
                };
                fn(offset(cell, 0, 1, d), offset(cell, 0, -1, d));
                fn(offset(cell, 0, -1, d), offset(cell, 0, 1, d));
            }
            //            ×
            // · · ·    · · ╻
            // ×2 3  -> ×2 3┃
            // · · ·    · · ╹
            //            ×  
            if (cell.qnum === 2 && offset(cell, 1, 0, d).qnum === 3 && offset(cell, -.5, 0, d).qsub === BQSUB.cross) {
                add_line(offset(cell, 1.5, 0, d));
                add_cross(offset(cell, .5, -1, d));
                add_cross(offset(cell, .5, 1, d));
            }
        }
    });
    // deduce color
    forEachCell(cell => {
        let innercnt = adjlist(cell.adjacent).filter(c => isGreen(c)).length;
        let outercnt = adjlist(cell.adjacent).filter(c => isYellow(c)).length;
        // number and color deduce
        if (cell.qnum >= 0) {
            if (cell.qnum < innercnt || 4 - cell.qnum < outercnt) {
                add_green(cell);
            }
            if (cell.qnum < outercnt || 4 - cell.qnum < innercnt) {
                add_yellow(cell);
            }
            if (isGreen(cell) && cell.qnum === outercnt) {
                forEachSide(cell, (nb, nc) => add_green(nc));
            }
            if (isYellow(cell) && cell.qnum === innercnt) {
                forEachSide(cell, (nb, nc) => add_yellow(nc));
            }
            if (isYellow(cell) && cell.qnum === 4 - outercnt) {
                forEachSide(cell, (nb, nc) => add_green(nc));
            }
            if (isGreen(cell) && cell.qnum === 4 - innercnt) {
                forEachSide(cell, (nb, nc) => add_yellow(nc));
            }
            if (cell.qnum === 2 && outercnt === 2) {
                forEachSide(cell, (nb, nc) => add_green(nc));
            }
            if (cell.qnum === 2 && innercnt === 2) {
                forEachSide(cell, (nb, nc) => add_yellow(nc));
            }
            // 2 different color around 1 or 3
            if ((cell.qnum === 1 || cell.qnum === 3) && innercnt === 1 && outercnt === 1) {
                forEachSide(cell, (nb, nc) => {
                    if (!nc.isnull && nc.qsub === CQSUB.none) {
                        if (cell.qnum === 1) { add_cross(nb); }
                        if (cell.qnum === 3) { add_line(nb); }
                    }
                });
            }
            // same diagonal color as 3
            if (cell.qnum === 3 && cell.qsub !== CQSUB.none) {
                for (let d = 0; d < 4; d++) {
                    if (!offset(cell, 1, 0, d).isnull && !offset(cell, 0, 1, d).isnull && offset(cell, 1, 1, d).qsub === cell.qsub) {
                        add_line(offset(cell, -.5, 0, d));
                        add_line(offset(cell, 0, -.5, d));
                    }
                }
            }
            if (cell.qnum === 2) {
                //  ×   
                // ×· · 
                //   2 A
                //  · ·a
                //   Bb  
                for (let d = 0; d < 4; d++) {
                    let b1 = offset(cell, -.5, -1, d);
                    let b2 = offset(cell, -1, -.5, d);
                    if (!(b1.isnull || isCross(b1))) { continue; }
                    if (!(b2.isnull || isCross(b2))) { continue; }
                    let c1 = offset(cell, 1, 0, d);
                    let c2 = offset(cell, 0, 1, d);
                    // A=B
                    add_bg_color(c1, (c2.isnull ? CQSUB.yellow : c2.qsub));
                    add_bg_color(c2, (c1.isnull ? CQSUB.yellow : c1.qsub));
                }
            }
        }
    });
}
