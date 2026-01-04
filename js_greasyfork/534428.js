// ==UserScript==
// @name         Bonk Some Features
// @namespace    https://violentmonkey.github.io
// @version      2.6.99
// @description  Adds some features to bonk.io
// @author       Silly One
// @match        https://*.bonk.io/*
// @match        https://*.bonkisback.io/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534428/Bonk%20Some%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/534428/Bonk%20Some%20Features.meta.js
// ==/UserScript==

var injectorName = "Bonk Some Features";

// Elements
var d = document,
    lcw = 'leaveconfirmwindow',
    lch = 'hostleaveconfirmwindow',
    p_t = 'pretty_top',
    nbl = 'newbonklobby',
    lw = 'loginwindow',
    mlw = 'maploadwindow',
    igc = 'ingamechat',
    _vw = '_votewindow',
    _vb = '_votebutton_',
    _vc = '_votecount_',
    _mt = '_maptitle_',
    vwb = _vw+_vb,
    vwt = _vw+_mt,
    vwc = _vw+_vc;
Object.assign(window, {
    cwc: d.getElementById(lcw+'container'),
    hwc: d.getElementById('host'+lcw+'container'),
    t1c: d.getElementById(lcw+'_top'),
    t2c: d.getElementById(lcw+'_text1'),
    t3c: d.getElementById(lcw+'_text2'),
    okB: d.getElementById(lcw+'_okbutton'),
    noB: d.getElementById(lcw+'_cancelbutton'),
    okBh: d.getElementById(lch+'_okbutton'),
    noBh: d.getElementById(lch+'_cancelbutton'),
    erBh: d.getElementById(lch+'_endbutton'),
    t1h: d.getElementById(lch+'_top'),
    t2h: d.getElementById(lch+'_text1'),
    t3h: d.getElementById(lch+'_text2'),

    pt: d.getElementById(p_t),
    ptb: d.getElementById(p_t+'_bar'),
    pte: d.getElementById(p_t+'_exit'),
    ptn: d.getElementById(p_t+'_name'),
    ptl: d.getElementById(p_t+'_level'),

    nblE: d.getElementById(nbl),
    mPc: d.getElementById(nbl+'_mappreviewcontainer'),
    lcc: d.getElementById(nbl+'_chat_content'),
    lsB: d.getElementById(nbl+'_startbutton'),
    lrB: d.getElementById(nbl+'_readybutton'),
    vtf: d.getElementById(nbl+vwb+'favourite'),
    vtu: d.getElementById(nbl+vwb+'up'),
    vtd: d.getElementById(nbl+vwb+'down'),
    vmn: d.getElementById(nbl+vwt+'name'),
    vma: d.getElementById(nbl+vwt+'author'),
    vcu: d.getElementById(nbl+vwc+'up'),
    vcd: d.getElementById(nbl+vwc+'down'),
    mat: d.getElementById(nbl+'_mapauthortext'),
    nmB: d.getElementById(nbl+'_mapbutton'),

    sB: d.getElementById(lw+'_submitbutton'),

    tb: d.getElementById(mlw+'topbar'),
    mmp: d.getElementById(mlw+'mapscontainer'),
    msi: d.getElementById(mlw+'searchinput'),
    mso: d.getElementById(mlw+'searchoptions'),
    sni: d.getElementById(mlw+'searchoptions_nameindicator'),
    msB: d.getElementById(mlw+'searchbutton'),

    igw: d.getElementById('ingamewinner'),
    gcc: d.getElementById(igc+'content'),

    pC: d.getElementById('pagecontainer'),
    mme: d.getElementById('mainmenuelements'),
    sC: d.getElementById('settingsContainer'),
    scp: d.getElementById('settings_change_password_label'),
    nwb: d.getElementById('newswindow_back'),

    bBD: d.querySelector('.brownButtonDisabled')
});

Object.assign(window, {
    user: '',
    lvl: '',
    plrids: {},
    myid: -1,
    hostid: -1,
    guser: 0,
    endroom: 0,
    banorkick: -1,
    infoD: [[], []],
    mvh: []
});

// Button Sounds
class ButtonSounds {
    constructor(){
        d.querySelectorAll('.ButtonSounds').forEach(e => {
            e.onmouseover = () => nwb.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            e.onmousedown = () => nwb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        });
    }
};
// SVG Images
const Star = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" fill="none" stroke="white" stroke-width="2"/></svg>`;

// Map Search By
if (mat.style["text-decoration"] != "underline") {
    mat.style["text-decoration"] = "underline";
    mat.style["cursor"] = "pointer";
    mat.onclick = function() {
        msi.value = mat.textContent;
        sni.className = "";
        mso.style["visibility"] = "inherit";
        msB.click();
        nmB.click();
    };
};

// Toggle Ingamewinner
if (igw && ptb) {
    function cloneIGW() {
        let t = igw.cloneNode(true);
        for (let n of Object.keys(igw.style)) {
            if (igw.style[n]) {
                t.style[n] = igw.style[n];
            }
        }
        let n = window.getComputedStyle(igw);
        for (let o of n) {
            if (!igw.style[o]) {
                t.style[o] = n.getPropertyValue(o);
            }
        }
        t.id = "ingamewinner2";
        t.style.visibility = (ptb.style.top === "0px") ? "inherit" : "hidden";
        Array.from(t.children).forEach((e) => e.style.opacity = "1");
        igw.parentNode.appendChild(t);
    }
    function observeIGW() {
        new MutationObserver(() => {
            let e = document.getElementById("ingamewinner2");
            if (e) e.remove();
            cloneIGW();
        }).observe(igw, {
            attributes: true,
            childList: true,
            subtree: true
        });
    }
    function observePTB() {
        new MutationObserver(() => {
            let e = document.getElementById("ingamewinner2");
            if (e) {
                e.style.visibility = (ptb.style.top === "0px") ? "inherit" : "hidden";
            }
        }).observe(ptb, {
            attributes: true
        });
    }
    cloneIGW();
    observeIGW();
    observePTB();
}

// Map Vote
if (lrB) {
    window.mapvote = lrB.cloneNode(!0),
    mapvote.textContent = "Vote",
    mapvote.style.width = "calc(25% - 16px)",
    mapvote.style.right = "calc(20% - 16px)",
    mapvote.classList.add("ButtonSounds"),
    lrB.parentNode.appendChild(mapvote),
    lrB.style.left = "calc(50% + 7px)",
    lsB.style.right = "calc(50% + 7px)",
    lsB.style.width = "calc(25% - 16px)",
    new ButtonSounds, new MutationObserver((() => {
        if (mvh) {
            let t = vmn.textContent,
                e = vma.textContent,
                n = "+undefined" === vcu.textContent,
                o = mvh.some((n => n.name === t && n.author === e)) || n;
            vtu.classList.toggle("brownButtonDisabled", o), vtd.classList.toggle("brownButtonDisabled", o);
            let v = mvh.find((n => n.name === t && n.author === e));
            if (v) {
                let t = 2 === v.vote ? vcd : vcu;
                t.textContent.includes("+Vote") || (t.textContent += "+Vote")
            }
            n && (vcu.textContent = "+Infinity"), n && (vcd.textContent = "-0")
        }
    })).observe(d.body, {
        childList: !0,
        subtree: !0
    });
    let t = t => {
        let e = vmn.textContent,
            n = vma.textContent,
            o = mvh.find((t => t.name === e && t.author === n));
        o ? o.vote = "vtu" === t ? 1 : 2 : mvh.push({
            name: e,
            author: n,
            vote: "vtu" === t ? 1 : 2,
            fav: ""
        });
        let v = "vtu" === t ? vcu : vcd;
        v.textContent.includes("+Vote") || (v.textContent += "+Vote")
    };
    vtu.addEventListener("click", (() => t("vtu"))), vtd.addEventListener("click", (() => t("vtd")));
    let f = 0;
    vtf.addEventListener("click", () => {
        if (f) {
            vtf.style.backgroundImage = '';
            vtf.style.backgroundSize = '';
        } else {
            vtf.style.backgroundImage = `url('data:image/svg+xml;utf8,${Star}')`;
            vtf.style.backgroundSize = '65%';
        }
        f = !f;
    });
}

// Settings
if (sC){
    sC.style.height = '420px'
    if (scp){
        window.sfl = scp.cloneNode(true);
        let cs = window.getComputedStyle(scp);
        Object.assign(sfl.style, {
            position: 'absolute',
            top: '369px',
            left: '50px',
            fontSize: '16px',
            fontFamily: 'futurept_b1',
            textDecoration: 'underline',
            cursor: 'pointer'
        });
        sfl.id = 'settings_force_logout_label';
        sfl.style.top = '369px';
        sfl.textContent = "Force Log Out Me";
        scp.parentNode.appendChild(sfl);
    };
};

// Top Bar Change Username & Toggle Guest Mode
if (ptn) {
    function editUsername(){
        var input = d.createElement('input');
        input.type = 'text';
        input.maxLength = 15;
        var hiddenSpan = d.createElement('span');
        hiddenSpan.style.visibility = 'hidden';
        hiddenSpan.style.whiteSpace = 'pre';
        hiddenSpan.style.fontSize = getComputedStyle(ptn).fontSize;
        d.body.appendChild(hiddenSpan);

        if (!guser && ptn.textContent != ""){
            user = ptn.textContent;
            guser = 1;
        }
        input.value = ptn.textContent;

        var computedStyles = getComputedStyle(ptn);
        for (var i = 0; i < computedStyles.length; i++){
            var style = computedStyles[i];
            input.style[style] = computedStyles.getPropertyValue(style);
        }

        input.style.minWidth = '10px';

        hiddenSpan.textContent = input.value || ' ';
        input.style.width = hiddenSpan.offsetWidth + 'px';

        ptn.parentNode.replaceChild(input, ptn);
        input.focus();

        input.addEventListener('input', function(){
            let value = input.value;
            input.value = value;
            hiddenSpan.textContent = value || ' ';
            input.style.width = hiddenSpan.offsetWidth + 'px';
        });

        input.addEventListener('blur', function(){
            var inputValue = input.value.trim();
            if (inputValue === ""){
                ptn.textContent = user;
            } else {
                ptn.textContent = inputValue;
            }
            input.parentNode.replaceChild(ptn, input);
            ptn.addEventListener('click', editUsername);
            hiddenSpan.textContent = ptn.textContent;
            input.style.width = hiddenSpan.offsetWidth + 'px';
        });

        input.addEventListener('keypress', function(event){
            if (event.key === 'Enter'){
                input.blur();
            }
        });
    }
    ptn.addEventListener('click', editUsername);
};

// Map Counter
try {
    var oMC = new MutationObserver(() => {
        tb.innerText = `${d.querySelectorAll(`.${mlw}mapdiv`).length} Maps`;
    });
    oMC.observe(mmp, {
        subtree: true,
        childList: true
    });
} catch {}

// Map Preview Info
window.infoPanel = Object.assign(d.createElement('div'), {
    id: 'newbonklobby_mappreviewinfo',
    style: 'zIndex: 1; position: absolute; background: rgba(0,0,0,0.88); color: white; padding: 10px; font-family: futurept_b1; font-size: 15px; display: none; pointer-events: auto;'
});
d.body.appendChild(infoPanel);

mPc?.addEventListener('mousemove', (event) => {
    var { left, top, width } = mPc.getBoundingClientRect(),
    mouseX = event.clientX - left;

    infoPanel.textContent = '';
    if (mouseX < width / 2){
        infoD[0].forEach(line => {
            infoPanel.appendChild(d.createTextNode(line));
            infoPanel.appendChild(d.createElement('br'));
        });
    } else {
        infoD[1].forEach(line => {
            infoPanel.appendChild(d.createTextNode(line));
            infoPanel.appendChild(d.createElement('br'));
        });
    }

    infoPanel.style.display = 'block';
    infoPanel.style.left = `${left - infoPanel.offsetWidth - 12}px`;
    infoPanel.style.top = `${top - infoPanel.offsetHeight - 12}px`;
});

mPc?.addEventListener('mouseleave', () => infoPanel.style.display = 'none');

var prevInfo = { cr: [], date: "" };

window.updateInfoPanel = () => {
    infoPanel.textContent = '';

    if (window.mapData && Object.keys(window.mapData).length){
        var {
            physics: { bodies = [], bro = [], fixtures = [], joints = [], ppm = "", shapes = [] } = {},
            s = {},
            spawns = [],
            capZones = [],
            m: { a = "", cr = "", date = "", dbid = "", mo = "", n = "", rxa = "", rxn = "", vd = "", vu = "" } = {}
        } = window.mapData,
        Y8N = (v) => (v ? "Yes" : "No"),

        // Map Properties (S)
        PlayersCollide = Y8N(!s.nc),
        Respawn = Y8N(s.re),
        Fly = Y8N(s.fl),
        ComplexPhysics;
        if (s.pq === 2){
            ComplexPhysics = "Enabled";
        } else {
            ComplexPhysics = "Disabled";
        };

        // Map Properties (M)
        var LCMN = n.toLowerCase();

        if (date) prevInfo = { cr, date };
        var MapDate = prevInfo.cr[0] === cr[0] ? prevInfo.date : date,

        Mode = { "": "Any", "b": "Classic", "bs": "Simple", "sp": "Grapple", "ar": "Arrows", "ard": "Death Arrows", "v": "VTOL" }[mo] || "Unknown",

        MadeIn = (dbid === -1) ? "Made Now In Current Bonk" :
            `Made In ${MapDate === "" ? (dbid <= 696969 ? "Bonk 1 On 2016-2020" : "Bonk 2 On 2020+") :
            (new Date(MapDate) < new Date('2020-06-09T06:00:09') ? "Bonk 1" : "Bonk 2")}`,

        MapDate = MapDate ? 'On ' + MapDate : "",

        // Map Properties (P)
        dppm = [30, 25, 20, 17, 15, 13, 12, 10, 9, 8, 7, 6, 5],
        MapSize;
        if (ppm > 30){
            MapSize = "1-";
        } else if (ppm < 5){
            MapSize = "13+";
        } else {
            for (let i = 0; i < dppm.length; i++){
                if (ppm === dppm[i]){
                    MapSize = i + 1;
                    break;
                } else if (ppm < dppm[i] && ppm > dppm[i + 1]){
                    MapSize = `${i + 1}-${i + 2}`;
                    break;
                }
            }
            if (MapSize === undefined){
                MapSize = "Custom";
            }
        }

        // Basic Properties
        var Bodies = bodies.length,
        BodyTypes = ["s", "d", "k"],
        [Stationary, FreeMoving, Kinematic] = BodyTypes.map(type => bodies.filter(b => b.s.type === type).length),
        [StationaryFx, FreeMovingFx, KinematicFx] = BodyTypes.map(type => bodies.filter(b => b.s.type === type).reduce((c, b) => c + (b.fx?.length || 0), 0)),
        ForceZones = bodies.flatMap(b => b.fz.on ? b.fx || [] : []).length,
        OnlyForceZones = bodies.every(b => b.fz.on === !!(b.fx && b.fx.length)),

        GetBodyObjects = bro.reduce((ac, i) => {
            let c = bodies[i].fx.length;
            if (ac.length && ac[ac.length - 1].c === c){
                ac[ac.length - 1].r++;
            } else {
                ac.push({ c, r: 1 });
            }
            return ac;
        }, []).map(({ c, r }) => (r > 1 ? `${c}x${r}` : `${c}`)).join(' '),
        BodyObjects = GetBodyObjects.length > 40 ? "Reached Display Limit" : GetBodyObjects,

        // Shape Properties
        Physics = fixtures.filter(f => !f.np).length,
        NoPhysics = fixtures.filter(f => f.np).length,
        Grapple = fixtures.filter(f => !f.np && !f.ng).length,
        InnerGrapple = fixtures.filter(f => !f.np && f.ig).length,
        OnlyGrapple = fixtures.length === Grapple,
        Death = fixtures.filter(f => f.d).length,
        OnlyDeath = fixtures.length === Death,

        Objects = shapes.length,
        Rectangles = shapes.filter(s => s.type === "bx").length,
        Polygons = shapes.filter(s => s.type === "po").length,
        Circles = shapes.filter(s => s.type === "ci").length,
        Vectors = shapes.reduce((v, s) => v + (s.type === "bx" ? 4 : s.type === "po" ? s.v.length : 0), 0),
        CircleRadii = shapes.filter(s => s.type === "ci" && s.r).reduce((t, c) => t + c.r, 0),

        // Mass
        Masses = shapes.map((shape, i) => {
            if (!fixtures[i]) return null;
            let fixture = fixtures[i],
            body = bodies.find(body => body.fx.includes(i)),
            density = fixture.de ?? (body?.s.de ?? 0),
            mass = 0;

            switch (shape.type){
                case "bx": mass = shape.w * shape.h * density; break;
                case "ci": mass = Math.PI * Math.pow(shape.r, 2) * density; break;
                case "po":
                    var areaPolygon = shape.v.reduce((area, [x, y], i, vertices) => {
                        var j = (i + 1) % vertices.length;
                        return area + (x * vertices[j][1] - vertices[j][0] * y);
                    }, 0) / 2;
                    mass = Math.abs(areaPolygon) * density * Math.pow(shape.s, 2);
                    break;
                default: console.warn(`Unknown shape type: ${shape.type}`); return null;
            }
            return { sh: fixture.sh, mass, isPhysics: !fixture.np };
        }).filter(Boolean);

        // Object Types
        var Bouncy = 0, Sticky = 0, Slippery = 0, NegativeFriction = 0, Rigid = 0, Heavy = 0, Light = 0;

        bodies.forEach(body => {
            body.fx.forEach(i => {
                var fixture = fixtures[i];
                if (fixture && !fixture.np){
                    var re = fixture.re ?? body.s.re,
                    fric = fixture.fr ?? body.s.fric;
                    Bouncy += re > -0.95 ? 1 : 0;
                    Rigid += re <= -0.95 ? 1 : 0;
                    Sticky += fric > 0 ? 1 : 0;
                    NegativeFriction += fric < 0 ? 1 : 0;
                    Slippery += fric === 0 ? 1 : 0;
                }
            });
        });

        Masses.forEach(({ mass, isPhysics, sh }) => {
            if (isPhysics){
                var body = bodies.find(b => b.fx.includes(sh));
                if (body && body.s.type === "d"){
                    if (mass >= 2500) Heavy++; else Light++;
                }
            }
        });

        // Polygon Types
        var Convex = 0,
        Concave = 0,
        Complex = 0,
        isConvexPolygon = (v) => {
            let isConvex = true;
            let n = v.length;

            if (n < 3) return false;

            let pcp = 0;

            for (let i = 0; i < n; i++) {
                let p1 = v[i];
                let p2 = v[(i + 1) % n];
                let p3 = v[(i + 2) % n];
                let cp = (p2[0] - p1[0]) * (p3[1] - p2[1]) - (p2[1] - p1[1]) * (p3[0] - p2[0]);

                if (i === 0) {
                    pcp = cp;
                } else {
                    if (cp * pcp < 0) {
                        isConvex = false;
                        break;
                    }
                }
            }

            return isConvex;
        };
        var isComplexPolygon = (vertices) => {
            let n = vertices.length;
            for (let i = 0; i < n; i++) {
                for (let j = i + 2; j < n; j++) {
                    if (i === 0 && j === n - 1) continue;
                    if (doLinesIntersect(vertices[i], vertices[(i + 1) % n], vertices[j], vertices[(j + 1) % n])) {
                        return true;
                    }
                }
            }
            return false;
        };
        var doLinesIntersect = (p1, p2, p3, p4) => {
            let oreo = (p, q, r) => {
                let val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
                return val === 0 ? 0 : (val > 0 ? 1 : 2);
            };

            const o1 = oreo(p1, p2, p3);
            const o2 = oreo(p1, p2, p4);
            const o3 = oreo(p3, p4, p1);
            const o4 = oreo(p3, p4, p2);

            return (o1 !== o2 && o3 !== o4);
        };
        shapes.forEach(shape => {
            if (shape.type === "po" && shape.v) {
                if (isConvexPolygon(shape.v)) {
                    Convex++;
                } else {
                    Concave++;
                }
                if (isComplexPolygon(shape.v)) {
                    Complex++;
                }
            }
        });

        // Joint Properties
        var Joints = joints.length,
        Rotating = joints.filter(j => j.type === "rv").length,
        SoftRod = joints.filter(j => j.type === "d").length,
        FollowsPath = joints.filter(j => j.type === "lpj").length,
        Springy = joints.filter(j => j.type === "lsj").length,
        Gears = joints.filter(j => j.type === "g").length,

        // Other Elements
        Spawns = spawns.length,
        CapZones = capZones.length,

        // Map Teams
        Teams = new Set(spawns.filter(s => s.y <= 250)
            .flatMap(s => ["FFA", s.r && "Red", s.ye && "Yellow", s.gr && "Green", s.b && "Blue"].filter(Boolean))
        ),
        TeamsType = ['f', 'r', 'b', 'gr', 'ye'],
        TeamsIndex = [1, 2, 3, 4, 5],
        [sF, sR, sB, sG, sY] = TeamsType.map(p => spawns.some(s => s[p])),
        [cF, cR, cB, cG, cY] = TeamsIndex.map(type => capZones.some(c => c.ty === type));
        if (Teams.has("Red") && !sG) Teams.add("Green");
        if (Teams.has("Blue") && !sY) Teams.add("Yellow");

        capZones.forEach(({ ty, i }) => {
            if (i !== -1 && ty !== 1){
                var a = {
                    2: () => { Teams.add("Red"); if (!sG) Teams.delete("Green"); },
                    3: () => { Teams.add("Blue"); if (!sY) Teams.delete("Yellow"); },
                    4: () => sG && Teams.add("Green"),
                    5: () => sY && Teams.add("Yellow")
                };
                a[ty]?.();
            }
        });

        var ForTeams = Array.from(Teams).join(", ") || "Spectators",

        // Map Modes
        MM = ["Classic", "Simple", "Grapple", "Arrows", "Death Arrows", "VTOL"],
        FM = new Set(),
        MNM = MM.find(mode => LCMN.includes(mode.toLowerCase())) || null;

        if (spawns.length === 0){
            FM.add("Unknown");
        } else {
            if (Mode !== "Any") FM.add(Mode);
            FM.add(MM[5]);
            if (Physics){
                [MM[0], MM[3], MM[4]].forEach(FM.add, FM);
            }
            if (Grapple) FM.add(MM[2]);
            if (Mode === MM[4] || MNM === MM[4]){
                [MM[0], MM[2], MM[3], MM[5]].forEach(FM.delete, FM);
            }
            if (Mode === MM[5] || MNM === MM[5] || OnlyDeath){
                [MM[0], MM[3], MM[4]].forEach(FM.delete, FM);
            }
        }

        var ForModes = Array.from(FM).length > 0 ? Array.from(FM).join(", ") : "Unknown",

        // Map Types
        MapType = [];

        if (Physics){
            if (capZones.some(z => z.ty === 1 && z.l <= 0.3) ||
                ["parkour", "parkor", "pkr", "jump"].some(t => LCMN.includes(t))){
                MapType.push("Parkour");
            }

            var FreeMovingOrKinematic = bodies.some(b => b.s.type === 'd' || b.s.type === 'k');
            if (FreeMovingOrKinematic && LCMN.includes("dodge")){
                MapType.push("Dodge");
            }

            if (["sniper", "death arrow", "death arrows", "deatharrow", "deatharrows"].some(t => LCMN.includes(t))){
                MapType.push("Sniper");
            }

            var SpawnTypes = new Set(spawns.flatMap(s => {
                if (!s.f){
                    return [
                        s.r ? 1 : null,
                        s.ye ? 2 : null,
                        s.gr ? 3 : null,
                        s.b ? 4 : null
                    ].filter(Boolean);
                }
            })),

            CapZoneTypes = new Set(capZones.flatMap(z => {
                return [
                    z.ty === 2 ? 1 : null,
                    z.ty === 5 ? 2 : null,
                    z.ty === 4 ? 3 : null,
                    z.ty === 3 ? 4 : null
                ].filter(Boolean);
            }));

            if (SpawnTypes.size > 1 || CapZoneTypes.size > 1 || LCMN.includes("team")){
                MapType.push("Teamwork");
            }
        }

        if (MapType.length === 0){
            MapType.push("Bonking");
        }

        var MapTypes = MapType.join(", ");

        // Preview Map Info
        infoD[0] = [
            `${Mode} Mode, Map Type: ${MapTypes}`,
            `Playable Modes: ${ForModes}`,
            `Playable Teams: ${ForTeams}`,
            `Players Collide: ${PlayersCollide}, Respawn: ${Respawn}, Fly: ${Fly}`,
            `OG Author: "${rxa || a}", OG Map: "${rxn || n}"`,
            `${vu || '0'} Upvotes, ${vd || '0'} Downvotes`,
            `${MadeIn} ${MapDate}`
        ];

        infoD[1] = [
            `${Spawns} Spawns, Map Size: ${MapSize}, Spawn's Radius: ${ppm}`,
            `${Bodies} Bodies: ${Stationary} Stationary, ${FreeMoving} Free Moving, ${Kinematic} Kinematic`,
            `${Objects} Objects: ${StationaryFx} Stationary, ${FreeMovingFx} Free Moving, ${KinematicFx} Kinematic`,
            `${Polygons} Polygons, ${Convex} Convex, ${Concave} Concave, ${Complex} Complex`,
            `${Rectangles} Rectangles, ${Circles} Circles, ${Vectors} Vectors, ${CircleRadii} Radiuses`,
            `${Physics} Physics, ${NoPhysics} No Physics, ${ForceZones} Force Zones`,
            `${Rigid} Rigid, ${Bouncy} Bouncy, ${Death} Deadly, ${CapZones} Cap Zones`,
            `${Sticky} Sticky, ${Slippery} Slippery, ${NegativeFriction} Negative Friction`,
            `${Grapple} Grappleable, ${InnerGrapple} Inner Grapple, ${Heavy} Heavy, ${Light} Light`,
            `${Joints} Joints: ${Rotating} Rotating, ${FollowsPath} Follows Paths, ${Springy} Springy, ${SoftRod} Rods, ${Gears} Gears`,
            `Complex Physics is ${ComplexPhysics}!`
        ];
    }
};

// Safe Log Out
if (sB){
    window.restore = sB.cloneNode(true);
    restore.textContent = 'Restore';
    restore.style.width = '98px';
    restore.style.right = '108px';
    restore.classList.add('ButtonSounds');
    sB.parentNode.appendChild(restore);
    sB.style.width = '98px';
    sB.style.left = '108px';
    new ButtonSounds();
};

if (pte){
    cwc.style.zIndex = '1';
    var tE2 = d.createElement('div');
    tE2.id = 'pretty_top_logout';
    tE2.classList.add('pretty_top_button', 'ButtonSounds');
    Object.assign(tE2.style, {
        borderLeft: '1px solid var(--border-white)',
        boxShadow: '-1px 0 0 var(--border-black)',
        backgroundImage: 'url(../graphics/exit-run.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'absolute',
        opacity: '0',
        visibility: 'hidden',
        width: '58px',
        height: '34px',
        top: '0px',
        right: '0px'
    });
    tE2.addEventListener('click', () => {
        cwc.style.visibility = cwc.style.opacity != 1 ? 'inherit' : 'hidden';
        cwc.style.opacity = cwc.style.opacity != 1 ? '1' : '0';
        if (cwc.style.opacity == '1'){
            t1c.textContent = 'Log Out?';
            t2c.textContent = 'You are about to log out of this account.';
            t3c.textContent = 'Are you sure?';
            t1h.textContent = 'Log Out?';
            t2h.textContent = 'You are about to log out of this account.';
            t3h.textContent = 'Are you sure?';
        }
    });
    ptb?.appendChild(tE2);
    new ButtonSounds();
}

var iO = new IntersectionObserver((e) => {
    e.forEach(e => {
        if (e.isIntersecting){
            tE2.style.opacity = '1';
            tE2.style.visibility = 'inherit';
            pte.style.visibility = 'hidden';
        } else {
            tE2.style.opacity = '0';
            tE2.style.visibility = 'hidden';
            pte.style.visibility = 'inherit';
        }
    });
});
if(mme){
    iO.observe(mme);
};

pte?.addEventListener('click', () => {
    t1c.textContent = 'Leave Game?';
    t2c.textContent = 'You are about to leave this game.';
    t3c.textContent = 'Are you sure?';
    t1h.textContent = 'Leave Game?';
    t2h.textContent = 'You are about to leave this game.';
    t3h.textContent = 'Are you sure?';
});

okB?.addEventListener('click', () => {
    if (mme?.style.display === 'block' && cwc?.style.opacity === '1'){
        cwc.style.visibility = 'hidden';
        cwc.style.opacity = '0';
        pte?.click();
    };
    endroom = 1;
    setTimeout(() => {
      endroom = 0;
    }, 200);
});
noB?.addEventListener('click', () => {
    if (mme.style.display === 'block'){
        cwc.style.visibility = 'hidden';
        cwc.style.opacity = '0';
    };
    endroom = 0;
});
okBh?.addEventListener('click', () => {
    endroom = 1;
    setTimeout(() => {
      endroom = 0;
    }, 200);
});
noBh?.addEventListener('click', () => {
    endroom = 0;
});
erBh?.addEventListener('click', () => {
    endroom = 1;
    setTimeout(() => {
      endroom = 0;
    }, 200);
});

window.cwct = () => {
    setTimeout(() => {
    if (nblE?.style.display === 'none'){
        pte?.click();
    };
    if (mme.style.display === 'none'){
        pte?.click();
        t3c.textContent = 'Leave the room?';
        t3h.textContent = 'Leave the room?';
        if (banorkick === 1){
            t1c.textContent = 'Kicked!';
            t2c.textContent = 'You have been kicked from this game.';
            t1h.textContent = 'Kicked!';
            t2h.textContent = 'You have been kicked from this game.';
        } else if (banorkick === 2){
            t1c.textContent = 'Banned!';
            t2c.textContent = 'You have been banned from this game.';
            t1h.textContent = 'Banned!';
            t2h.textContent = 'You have been banned from this game.';
        } else {
            t1c.textContent = 'Wasted!';
            t2c.textContent = 'You have lost connection to this game.';
            t1h.textContent = 'Wasted!';
            t2h.textContent = 'You have lost connection to this game.';
        }
        endroom = 1;
    };
    }, 1000);
};

// Ping Display
if (pC){
    window.pingDisplay = d.createElement('div');
    Object.assign(pingDisplay.style, {
        position: 'absolute', width: 'auto',
        height: 'auto', color: 'rgb(187, 187, 187)',
        top: '56px', left: '5px', fontFamily: 'futurept_b1',
        display: 'block', zIndex: 1
    });
    pingDisplay.textContent = 'Join a room to display pings.';
    pC.appendChild(pingDisplay);
};
window.updatePingDisplay = (Y_W) => {
    if (pingDisplay){
        pingDisplay.innerHTML = Object.keys(plrids).map(id =>
            Y_W[id] !== undefined ? `${plrids[id].userName}: ${Y_W[id]}ms<br>` : ''
        ).join('');
    }
};

// Quick Start
window.updateQuickStart = () => {
    if (lrB && hostid === myid) {
        lrB.textContent = 'Quick Start';
    } else {
        lrB.textContent = 'Ready';
    }
};

function injector(src){
    let newSrc = src;
    function r (src, nsrc){
        newSrc = newSrc.replace(src, nsrc);
    };

    // Pings & Ping Display
    var pD = newSrc.match(/id:s*W_j}\);/);
    r(pD, `id:W_j}); updatePingDisplay(Y_W);`);
    // End Session / Left Room
    var pLR = newSrc.match(/var\s*o4i;/);
    r(pLR, `var o4i; console.log('wat hapened', endroom); if (!endroom){ cwct(); return; } else { noB.click() };
    myid = -1; plrids = {}; pingDisplay.textContent = 'Join a room to display pings.';`);
    // Created Room
    var pCR = newSrc.match(/i6Y\[9]\);/);
    r(pCR, `i6Y[9]); myid = 0; hostid = 0; updateQuickStart();
    plrids[myid] = { userName: ptn.textContent };`);
    // Joined Room
    var pJR = newSrc.match(/n7O\s*=s*\[arguments];/);
    r(pJR, `n7O = [arguments]; plrids = {}; hostid = n7O[0][1];
    for (var i = 0; i < n7O[0][2].length; i++) {
        if (n7O[0][2][i] != null) {
            plrids[i.toString()] = n7O[0][2][i];
        }
    }
    if (plrids[n7O[0][0]].userName.startsWith(ptn.textContent)) {
        myid = n7O[0][0];
    }
    updateQuickStart();`);
    // Host Left;
    var hL = newSrc.match(/I7U\[0]\[1];/);
    r(hL, `I7U[0][1]; hostid = I7U[0][1]; updateQuickStart();`);
    // Host Changed
    var hC = newSrc.match(/c3M\[0]\[0]\);/);
    r(hC, `c3M[0][0]); hostid = c3M[0][0][c3M[1][685]]; updateQuickStart();`);
    // Other Players
    var oP = newSrc.match(/j9r\[0]\[6]\);/);
    r(oP, `j9r[0][6]); if (j9r[0][2]) plrids[j9r[0][0]] = { userName: j9r[0][2] };`);
    // Banned Or Kicked
    var kob = newSrc.match(/p_1\[0]\[1]\);/);
    r(kob, `p_1[0][1]); if (p_1[0][0] === myid && !endroom){ if (p_1[0][1] === true){ banorkick = 1; } else if (p_1[0][1] === false){ banorkick = 2;}; };`);

    // Map Preview Info
    var mP = newSrc.match(/y_3\[4\]\[64\]];/);
    r(mP, `y_3[4][64]]; window.mapData = B9G[0][2][y_3[4][346]]; updateInfoPanel();`);

    // Safe Log Out
    var lg = newSrc.match(/function\s*j7l\(/);
    r(lg, `
    sfl.onclick = function(){ U70() };
    restore.onclick = function(){ k8J(); j0e[28] = true };
    function j7l(`);
    var slg = newSrc.match(/U70\(\);/);
    r(slg, `f6X("slow"); R2C(); m6t(); j0e[28] = false; j06();`);

    // Quick Start
    var QS = newSrc.match(/B9G\[6]\[F7f\[6]\[837]]\(!B9G\[0]\[1]\[B9G\[0]\[0]\[F7f\[6]\[635]]\(\)]\[F7f\[6]\[673]]\);/);
    r(QS, `if (hostid === myid) { o95(k7V.U3q(2139)); B9G[94] = -1 } else { B9G[6][F7f[6][837]](!B9G[0][1][B9G[0][0][F7f[6][635]]()][F7f[6][673]]) };`);

    // Map Vote
    var MV = newSrc.match(/this\[B9G\[1]\[725]]/);
    r(MV, `mapvote.onclick = function(){ this[B9G[1][1409]](); }.bind(this);
    this[B9G[1][725]]`);

    // Teams
    var TC = newSrc.match(/O_0\s*=\s*\[arguments];/);
    r(TC, `O_0 = [arguments];`);

    // Top Bar Change Username & Toggle Guest Mode
    var tGcN = newSrc.match(/e\[5]\[570]]\s*=\s*k7V\.w65\(797\);/);
    r(tGcN, `e[5][570]] = k7V.w65(797);
    let o = new MutationObserver(() => {
        t$e[61][t$e[5][570]] = ptn.textContent;
        if (!guser && t$e[61][t$e[5][570]] != ""){
            user = t$e[61][t$e[5][570]];
            lvl = ptl.textContent;
            guser = 1;
        }
    });
    ptl.addEventListener('click', function(){
        if (ptl.textContent === "Guest" && lvl !== "Guest"){
            ptl.textContent = lvl;
            t$e[61][t$e[5][640]] = false;
        } else if (lvl === "Guest" && ptl.textContent === "Guest"){
            ptl.textContent = "tseuG";
        } else if (ptl.textContent === "tseuG" && lvl !== "Guest"){
            ptl.textContent = "Guest";
        } else {
            ptl.textContent = "Guest";
            t$e[61][t$e[5][640]] = true;
        }
    });
    let c = { childList: true, subtree: true, characterData: true };
    o.observe(ptn, c);
    `);

    if (src === newSrc) throw "Injection failed!";
    console.log(injectorName + " injector run");
    return newSrc;
}

if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
    try {
        return injector(bonkCode);
    } catch (error){
        alert(`Whoops! ${injectorName} was unable to load.`);
        throw error;
    }
});

console.log(injectorName + " injector loaded");