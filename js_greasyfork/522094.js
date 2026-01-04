// ==UserScript==
// @name           SplooByJax
// @author         Her io (Fixed by ilyax)
// @version        2.5
// @description    The most advanced hack for sploop.io
// @match          *://sploop.io/*
// @grant          none
// @license        MIT
// @require        http://code.jquery.com/jquery-3.3.1.min.js
// @require        https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @run-at         document-start
// @icon           https://sploop.io/img/ui/favicon.png
// @namespace      -
// @downloadURL https://update.greasyfork.org/scripts/522094/SplooByJax.user.js
// @updateURL https://update.greasyfork.org/scripts/522094/SplooByJax.meta.js
// ==/UserScript==

// This is an password system you can remove if you want

let password = prompt("Enter asd")
if (password == "asd") alert("Your password is correct")
else {
    alert("please try again")
    while(1);
}

let aa = {
    "berserker gear": 2,
    "crystal gear": 4,
    "spike gear": 5,
    "boost hat": 7,
    demolist: 11,
    hood: 10
};
let c = {
    "berserker gear": "B",
    "crystal gear": "C",
    "spike gear": "H",
    "boost hat": "SHIFT",
    demolist: "Z",
    hood: "Y"
};
let d = {
    katanaHammer: [1, 12, 9, 19, 20, 15, 8, 17, 16],
    daggerHammer: [52, 12, 9, 19, 20, 15, 8, 16]
};
const b = a => {
    d[a].forEach(a => {
        window.ws.oldSend(new Uint8Array([14, a]));
    });
};
let e = {
    autoheal: true,
    autoresp: true,
    antitrap: true,
    autoscub: true,
    autochat: true,
    saveall: true,
    smarthats: true,
    autoplace: true,
    killchat: true
};
let ba = {
    jun: {
        ac: true,
        oldH: 0,
        int: null
    },
    inRiver: false,
    cpsMult: 1,
    cpsSpeed: 30,
    breaking: false
};
let f;
let g;
let h;
let i;
let j = [];
let k;
let globalEnemy;
let myPlaer = {};
let l = 0;
let m = false;
let ca = [];
let n;
let o;
let p;
let q;
let r;
let s = ["da-bottom", "google_play", "game-left-content-main", "game-right-content-main"];
let t = {
    rosalia: ["-", "Llegué tarde a la cita", "estaba con La ROSALÍA", "Las amigas que se besan", "son la mejor compañía", "hoy estoy a fuego, 'toy chucky", "Dulce, deliciosa como una cookie", "Tú ere' linda y yo estoy rulin", "Nos besamo', pero somo' homie'", "Llegué tarde", "salí pa' donde ti", "pero terminé en un teteo", "Después me fui para", "un punto a bregar con un capeo", "Siempre llego tarde", "me coge el tiempo singando", "Tengo una negra en casa", "que siempre tiene ganas", "Llegué tarde a la cita", "estaba con La ROSALÍA", "Las amigas que se besan", "son la mejor compañía", "Llegué tarde a la cita", "estaba con La ROSALÍA", "Las amigas que se besan", "son la mejor compañía", "(compañía)", "Muévetelo como es", "Tokischa y ROSALÍA", "Sabe mejor que los tres golpes", "yo me la como to' lo' día'", "Que yo le canto por bachata", "y ella me canta por bulería", "Tú ere' linda y yo estoy rulin", "Nos besamo', pero somo' homie'", "Le tiro un besito", "a la mami que me disfruta", "Le muerdo el cachete", "como si fuera una fruta", "Siempre llego tarde", "porque me invento la ruta", "Pa' quita'me la arrechura", "y desacato tengo tiempo", "Poniéndome la prenda", "pa' tirarme por el bloque", "Calentura vaginal", "de R.D. pa' Barcelona", "el rey de este server,", "tengo la corona", "Las dura' de las dura'", "de eso ya no e' un secreto", "Las uñas en punta", "las llevamos stiletto", "Uy, Toki'", "estoy enamorada", "Uy, Toki'", "tú eres de respeto", "Tú ere' linda y yo estoy rulin", "Nos besamo', pero somo' homie'", "Tú ere' linda y yo estoy rulin", "Nos besamo', pero somo' homie'"],
    trueno: ["-", "A ver, decile que me pare si puede", "Ya le puse mi flow pa' que pruebe", "2-0-1-9", "Somos pobre' con futuro, como Tévez", "Decile que me pare si puede", "Ya le puse mi flow pa' que pruebe", "2-0, mm, 0, mm, 0, mm, 0", "Eh yo, manín, ahora yo tengo", "un par de empresas que me llaman", "Un par de marca' que me avalan", "un par de guachas que me aman", "Un par de bobos que me tiran", "(prra, prra)", "Mi chula, los problemas", "se resuelven en la cara", "No te comas esa peli", "que son todo' una mentira", "Yo no gasto saliva", "Todo es una, todo es una shit", "desde arriba", "Si Trueno toca, La Boca activa", "¿De qué mierda me quejo?", "Si tengo weed y comida (ey)", "Los turrito' ya no meten mano", "Los guachines estaban haciendo rap", "(haciendo rap)", "Tus guachine' son un grupo de WhatsApp", "(de WhatsApp)", "Se hace el turro", "y es más gorra que la SWAT", "ey (SWAT, SWAT)", "Salto por la base y los esquivo", "Cuatro pájaros de un tiro", "me olvido", "Soy un guacho bueno", "hasta que jodes conmigo", "Pica la calle por donde vivo", "zona de atrevidos", "Woh, damn, yah", "entran los cobani'", "con papel de operativo", "Se le ve en la cara", "que es un gil arrepentido", "Caminan de la mano,", "porque hay partido", "(eh, eh, eh, eh)", "Wow, wow, damn (ey)", "Dice que se muere", "si me ve tocar en vivo", "(ey, ey)", "Problema' de negocio'", "de intereses lucrativos", "(ey, ey)", "Mi amor, no es culpa mía", "tengo rap en mi apellido", "(prra, prra)", "Decile que me pare si puede", "(prra, prra)", "Que le puse mi flow pa' que pruebe", "(prra-pa-pa)", "2-0-1-9 (1-9)", "Somos pobre' con futuro", "Tévez, ey (oh)", "Decile que me pare si puede", "(prra, prra, prra)", "Que le puse de mi flow", "y es para que pruebe", "(prra, prra, prra)", "2-0-1-9 (1-9)", "Ey, somos pobre' con futuro", "como Tévez (prra, prra, prra, prra)", "A ver, decile que me pare si puede", "Que le puse mi flow", "es para que pruebe", "(2-0-1-9)"],
    nicki: ["-", "Tú necesitas seguir vivo", "Pa' estar conmigo to'a la vida", "Siempre que está' borracho me escribe'", "Pero sigo desaparecida", "Y ya han pasa'o los mese'", "Y fueron mucha' veces que te prometía", "Te juraba que cambiaría", "Pero te fallaba al otro día", "Sí, yo necesito seguir vivo", "Pa' estar contigo to'a la vida", "Siempre que estoy borracho te escribo", "Pero sigues desaparecida", "Y ya han pasa'o los mese'", "Y fueron muchas vece' que me prometía'", "Me juraste que cambiaría'", "Pero me fallaste al otro día", "Tú me lo decía' y tú me insistía'", "Y tú me decía' que tú iba' a volver", "Lo peor e' que yo creía que me iba' a llamar", "Y que ahí iba' a estar para serme fiel", "Fueron más de mil noche', mato el reproche", "Los mensaje' 'e texto que me mandabas te boté", "Él viviendo 'e noche y yo llorando 'e día", "Yo perdiendo el mundo, él haciendo su vida", "Otra noche má' que te extraño, pá", "Mire donde mire, baby, ya tú no está'", "Me hubiera encanta'o-ta'o, que estuviera' aquí a mí la'o", "Pero malamente estás con otra", "Así que, baby, I'm sorry", "Por no ser lo que busca'", "Me hubiera encanta'o que", "Conmigo te luzca'", "Tú necesitas seguir vivo", "Pa' estar conmigo to'a la vida", "Siempre que está' borracho me escribe'", "Pero sigo desaparecida", "Y ya han pasa'o los mese'", "Y fueron mucha' veces que te prometía", "Te juraba que cambiaría", "Pero te fallaba al otro día"],
    gasgasgas: ["-", "Guess you're ready'", "Cause I'm waiting for you", "It's gonna be so exciting!", "Got this feeling", "Really deep in my soul", "Let's get out I wanna go come along, get it on!", "Gonna take my car gonna sit in", "Gonna drive alone till I get you", "'Cause I'm crazy, hot and ready but you'll like it!", "I wanna race for you shall I go now?", "Gas gas gas!", "I'm gonna step on the gas", "Tonight I'll fly and be your lover", "Yeah yeah yeah", "I'll be so quick as a flash", "And I'll be your hero", "Gas gas gas!", "I'm gonna run as a flash", "Tonight I'll fight to be the winner", "Yeah yeah yeah", "I'm gonna step on the gas", "And you'll see the big show!", "Don't be lazy", "'Cause I'm burning for you", "It's like a hot sensation!", "Got this power", "That is taking me out", "Yes I've got a crash on you ready now ready go!", "Gonna take my car gonna sit in", "Gonna drive alone till I get you", "'Cause I'm crazy", "Hot and ready but you'll like it!", "I wanna race for you shall I go now?", "Gas gas gas!", "I'm gonna step on the gas", "Tonight I'll fly and be your lover", "Yeah yeah yeah", "I'll be so quick as a flash", "And I'll be your hero"],
    sploobyjax: ["-", "SplooByJax", "Leader Mod 2023", "Try beat me", "You can't?", "Download on YouTube", "Subscribe to Her Io"]
};
function u(c) {
    let d = "";
    for (let a = 0; a < c.split(" ").length; a++) {
        d += "" + c.split(" ")[a].substr(0, 1).toUpperCase() + c.split(" ")[a].substr(1, c.split(" ")[a].length).toLowerCase() + (c.split(" ").length - 1 != a ? " " : "");
    }
    return d;
}
function v(a) {
    return a * 0.01745329251;
}
function w(b, c) {
    return Math.sqrt(Math.pow(c.y - b.y, 2) + Math.pow(c.x - b.x, 2));
}
function x() {
    let a = 0;
    setInterval(() => {
        if (document.getElementById("chat_autotype").value != "none") {
            if (a == t[document.getElementById("chat_autotype").value].length) {
                a = 0;
            } else if (myPlaer.alive && e.autochat) {
                a++;
                H(t[document.getElementById("chat_autotype").value][a]);
            }
        }
    }, 1000);
    n = document.getElementById("game-canvas").clientWidth;
    o = document.getElementById("game-canvas").clientHeight;
    $(window).resize(() => {
        n = document.getElementById("game-canvas").clientWidth;
        o = document.getElementById("game-canvas").clientHeight;
    });
    document.getElementById("game-canvas").addEventListener("mousemove", a => {
        p = a.clientX;
        q = a.clientY;
    });
}
function y(d, e, f) {
    let a = false;
    let g;
    return {
        start(b) {
            if (b == e) {
                a = true;
                if (g === undefined) {
                    g = setInterval(() => {
                        for (let a = 0; a < ba.cpsMult; a++) {
                            f();
                        }
                        if (!a) {
                            clearInterval(g);
                            g = undefined;
                        }
                    }, ba.cpsSpeed);
                }
            }
        },
        stop(b) {
            if (b == e) {
                a = false;
            }
        }
    };
}
function z() {
    if (myPlaer.alive) {
        if (document.getElementById("checkbox_autoheal").checked) {
            setTimeout(() => {
                E(1);
            }, 200 - h);
        }
        if (document.getElementById("checkbox_autoscuba").checked) {
            if (myPlaer.x >= 160 && myPlaer.y >= 8000 && myPlaer.x <= 9840 && myPlaer.y <= 9000) {
                if (!ba.inRiver) {
                    ba.inRiver = true;
                    H(document.getElementById("chat_autoscuba").value);
                    F(9);
                    F(9);
                }
            } else if (ba.inRiver) {
                F(7);
                ba.inRiver = false;
            }
        }
        if (document.getElementById("checkbox_autoplace").checked) {
            let a = f ? w(f, myPlaer) : 0;
            if (f && a < 100) {
                B(7, Math.atan2(f.y - myPlaer.y, f.x - myPlaer.x));
            }
        }
        if (document.getElementById("checkbox_antifire").checked) {
            let a = i ? w(i, myPlaer) : 0;
            if (i && a < 200) {
                if (!ca.find(a => a && w(a, myPlaer) <= 50 && a.type == 9)) {
                    B(8, -Math.atan2(i.y - myPlaer.y, i.x - myPlaer.x));
                    H(document.getElementById("chat_antifire").value);
                }
            }
        }
        if (document.getElementById("checkbox_antiwolf").checked) {
            let a = g ? w(g, myPlaer) : 0;
            if (g && g.type == 24 && a < 100) {
                if (!ca.find(a => a && w(a, g) <= 50 && a.type == 6)) {
                    B(7, Math.atan2(g.y - myPlaer.y, g.x - myPlaer.x));
                    H(document.getElementById("chat_antiwolf").value);
                }
            }
        }
        let c = ca.find(a => a && w(a, myPlaer) <= 50 && a.type == 6 && !K(a));
        let d = ba.breaking;
        ba.breaking = false;
        if (c && document.getElementById("checkbox_antitrap").checked) {
            let a = Math.atan2(c.y - myPlaer.y, c.x - myPlaer.x);
            ba.breaking = true;
            I(a);
            F(11);
            if (!d) {
                if (l == 15) {
                    k = 1;
                }
                H(document.getElementById("chat_antitrap").value);
                D(7, a);
            }
        } else if (d) {
            if (l == 15) {
                k = 0;
                window.ws.oldSend(new Uint8Array([0, ba.breaking && l == 15 ? 1 : 0]));
            }
            J();
        }
        if (document.getElementById("checkbox_smarthats").checked && !ba.breaking) {
            J();
        }
    }
}
setInterval(z, 100);
let A = {
    UI: true,
    autoBreak: true,
    autoPush: true,
    autoPlace: true,
    autoSync: true,
    autoRespawn: false,
    autoChat: false,
    tracers: true,
    autoHeal: true,
    optHeal: false
};
function B(b, c = undefined) {
    if (c === undefined) c = Math.atan2(q - o / 2, p - n / 2);
    window.ws.oldSend(new Uint8Array([0, b]));
    I(c);
    window.ws.oldSend(new Uint8Array([0, k]));
}
function C(b, c = undefined) {
    if (c === undefined) c = Math.atan2(q - o / 2, p - n / 2);
    B(b, c + 25, true);
    B(b, c + -25, true);
    window.ws.oldSend(new Uint8Array([0, b]));
}
function D(b, c = 0) {
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
        setTimeout(() => B(7, c + a), a / 0.39 * 27);
    }
}
function E(b) {
    for (let c = 0; c <= b; c++) {
        B(2);
    }
}
function F(a) {
    if (myPlaer.skin != a) {
        window.ws.oldSend(new Uint8Array([5, a]));
    }
}
function G(a = undefined) {
    if (a === undefined) a = ba.move;
    if (typeof a != "number") {
        return window.ws.oldSend(new Uint8Array([15, 0]));
    }
    a = (a + Math.PI) * 65535 / (Math.PI * 2);
    window.ws.oldSend(new Uint8Array([1, a & 255, a >> 8 & 255]));
}
function H(a) {
    window.ws.oldSend(new Uint8Array([7, ...new TextEncoder().encode(a)]));
}
function I(a) {
    a = (a + Math.PI) * 65535 / (Math.PI * 2);
    window.ws.oldSend(new Uint8Array([19, a & 255, a >> 8 & 255]));
    window.ws.oldSend(new Uint8Array([18]));
}
function J() {
    let a;
    let b;
    F((a = f ? w(f, myPlaer) : 0, b = g ? w(g, myPlaer) : 0, myPlaer.y <= 9000 && myPlaer.y >= 8000 ? 9 : f && a <= 300 ? a <= 180 && f.skin == 2 ? 5 : a <= 180 && f.skin == 5 ? 4 : myPlaer.weapon != 13 ? 2 : 7 : myPlaer.speed < 2 ? m && document.getElementById("checkbox_smarthats_at").checked ? b <= 180 ? 2 : 11 : myPlaer.skin != 11 ? myPlaer.health < 100 ? 6 : 10 : 11 : 7));
}
function K(b) {
    if (myPlaer.id2 == b.id2) {
        return true;
    }
    if (myPlaer.team) {
        let c = j.length;
        for (let d = 0; d < c; d++) {
            let c = j[d];
            if (b.id2 == c) {
                return true;
            }
        }
    }
    return false;
}
function L() {
    try {
        let a = Math.atan2(ba.nearestEnemy.y - myPlaer.y, ba.nearestEnemy.x - myPlaer.x);
        B(4, a + v(90));
        B(4, a - v(90));
        B(7, a);
        G(Math.atan2(O.y - myPlaer.y, O.x - myPlaer.x));
    } catch {}
}
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (a) {
    if (window.ws != this) {
        m = false;
        if (!ba.hackLoaded) {
            x();
        }
        window.ws = this;
        this.addEventListener("message", b => {
            let p = typeof b.data == "string" ? JSON.parse(b.data) : new Uint8Array(b.data);
            let c = parseInt(p[0]);
            if (c == 16) {
                j = [...p.slice(2, p.length)];
            }
            if (c == 24) {
                j = [...p.slice(3, p.length)];
            }
            if (c == 27) {
                j = [];
            }
            if (c == 28 && document.getElementById("checkbox_killchat").checked) {
                let c = "";
                for (let b = 0; b < p[1].split(" ").length; b++) {
                    c += "" + p[1].split(" ")[b] + (p[1].split(" ").length - 1 != b ? " " : "");
                }
                H(document.getElementById("chat_killchat").value.replaceAll(/{name}/ig, c.replace("Killed ", "")));
            }
            if (c == 29) {
                window.weaponSwing();
            }
            if (c == 20) {
                ba.enemiesNear = [];
                f = null;
                g = null;
                i = null;
                globalEnemy = null;
                for (let h = 1; h < p.length; h += 18) {
                    let b = p[h];
                    let j = p[h + 1];
                    let c = p[h + 2] | p[h + 3] << 8;
                    let d = p[h + 4] | p[h + 5] << 8;
                    let e = p[h + 6] | p[h + 7] << 8;
                    p[h + 8];
                    let k = p[h + 11];
                    let q = p[h + 12];
                    let l = p[h + 13] / 255 * 100;
                    let r = p[h + 8];
                    ca[c];
                    let m = p[h + 8];
                    p[h + 2] | p[h + 3] << 1;
                    let a = p[h + 10];
                    if (m & 2) {
                        ca[c] = null;
                    } else {
                        let h = ca[c] || {
                            fd: 2
                        };
                        if (h.fd & 2) {
                            h.type = b;
                            h.id = c;
                            h.health = l;
                            h.xVel = h.x - d;
                            h.yVel = h.y - e;
                            h.speed = Math.hypot(e - h.y, d - h.x);
                            h.move = Math.atan2(e - h.y, d - h.x);
                            h.x = d;
                            h.y = e;
                            h.weapon = a;
                            h.id2 = j;
                            h.skin = k;
                            h.team = q;
                            h.clown = Boolean(r);
                            ba.enemiesNear.push(h);
                        }
                        if (ba.enemiesNear) {
                            ba.nearestEnemy = ba.enemiesNear.sort((b, c) => w(b, myPlaer) - w(c, myPlaer))[0];
                        }
                        ca[c] = h;
                        window.drawEntityInfow(h);
                        if (h.type) {
                            let c = Math.hypot(myPlaer.y - h.y, myPlaer.x - h.x);
                            let a = g ? Math.hypot(myPlaer.y - g.y, myPlaer.x - g.x) : null;
                            if (g) {
                                if (c < a) {
                                    g = h;
                                }
                            } else {
                                g = h;
                            }
                        }
                        if (h.type == 29) {
                            i = h;
                        }
                        if (h.id === myPlaer.id) {
                            myPlaer.health = h.health;
                            Object.assign(myPlaer, h);
                        } else if (!h.type && (!myPlaer.team || h.team != myPlaer.team)) {
                            let c = Math.hypot(myPlaer.y - h.y, myPlaer.x - h.x);
                            let a = f ? Math.hypot(myPlaer.y - f.y, myPlaer.x - f.x) : null;
                            if (f) {
                                if (c < a) {
                                    globalEnemy = f = h;
                                }
                            } else {
                                globalEnemy = f = h;
                            }
                        }
                    }
                }
            }
            if (c == 35) {
                myPlaer.id = p[1];
                myPlaer.alive = true;
                myPlaer.health = 100;
                k = 0;
            }
            if (c == 19 && document.getElementById("checkbox_autorespawn").checked) {
                myPlaer.health = 0;
                myPlaer.alive = false;
                if (e.autoresp) {
                    setTimeout(() => {
                        document.getElementById("play").click();
                    }, 200);
                }
            }
            if (c == 15) {
                h = p[1] | p[2] << 8;
            }
        });
    }
    this.oldSend(a);
    if (a[0] == 14 && [15, 11, 26, 4, 27].includes(a[1])) {
        l = a[1];
    }
};
const M = y(false, 78, () => {
    setTimeout(() => {
        B(5);
    }, 14)
});
const N = y(false, 81, () => {
    setTimeout(() => {
        B(2);
    }, 14)
});
const O = y(false, 70, () => {
    setTimeout(() => {
        B(7);
    }, 14)
});
const P = y(false, 86, () => {
    setTimeout(() => {
        B(4);
    }, 14)
});
const Q = y(false, 72, () => {
    setTimeout(() => {
        B(8);
    }, 14)
});
const R = y(true, 71, () => {
    setTimeout(() => {
        L();
    }, 14)
});
let S = ["clan-menu-clan-name-input", "nickname", "chat"];
let T = (d, e) => {
    for (let a = 0; a < S.length; a++) {
        if (document.activeElement && document.activeElement.id.toLowerCase() === S[a]) {
            return;
        }
    }
    let a = e ? "start" : "stop";
    M[a](d.keyCode);
    Q[a](d.keyCode);
    N[a](d.keyCode);
    P[a](d.keyCode);
    O[a](d.keyCode);
    R[a](d.keyCode);
    if (e && ([49, 97].includes(d.keyCode) || [50, 98].includes(d.keyCode))) {
        k = Number([50, 98].includes(d.keyCode));
    }
    if (e) {
        if (d.keyCode == 69 && myPlaer.alive) {
            m = !m;
        }
        if (d.keyCode == 188) {
            b("daggerHammer");
        } else if (d.keyCode == 190) {
            b("katanaHammer");
        }
        for (let b in c) {
            if (d.key.toUpperCase() == document.getElementById("hat_keypress_" + aa[b]).value) {
                F(aa[b]);
            }
        }
    }
};
document.addEventListener("keydown", a => T(a, true));
document.addEventListener("keyup", a => T(a, false));
let U = false;
function W() {
    var b = document.createElement("style");
    b.id = "hellothere";
    b.innerHTML = " .middle-main {overflow: auto; display: flex; justify-content: space-between; align-items: center; align-content: space-between; flex-wrap: wrap; width: 410px; height: 255px; padding: 15px; box-shadow: none; background: rgba(0,0,0,0.6); border-radius: 10px; border: 10px solid rgba(0,0,0,0.9)} * {     transition-duration: 0.5s;     cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/c88b6290502f4eda94ff7c91e5268b37dzptOLuo72sAeluw-0.png?v=1675458433720) 2 0, default; } #allFeatures::-webkit-scrollbar {     width: 0px;     border-right: 0px solid black; } ::-webkit-scrollbar { \twidth: 10px;     border-right: 2px solid #FE0000; } ::-webkit-scrollbar-thumb { \tborder: 2px solid #FE0000; } ::-webkit-scrollbar-thumb:hover { \tbackground: #FE0000;  } ::-webkit-scrollbar-thumb:active { \tbackground: black;     border: 2px solid #FE0000; } #play-text {     position: unset !important; } #play {     width: 100%;     height: 70px;     font-size: 31px;     border-radius: 13px;     cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;     position: none !important;     color: #fff;     background-color: transparent;     border: 5px solid #FE0000;     display: flex;     padding: 3% 36% 0% 10%;     font-family: denk one;     transition: color .5s;     overflow: hidden;     justify-content: center;     box-shadow: none;     text-align: center;     margin: 2% 0px 2% 0%; } .background-moving {     animation: none;     width: none;     height: none;     margin-left: none;     margin-top: none; } .background-img-play {     background: none;     cursor: none;     transform: none; } #server-select:active {     height: 50px !important; } .dark-blue-button-3-active:hover {     height: 65px; } .game-mode:hover, #play:hover {     box-shadow: none;     color: #FFFFFF !important;     border: 5px solid #FE0000;     background-color: transparent; } .game-mode:active, #play:active {     background-color: transparent;     box-shadow: none;     padding-top: 3% !important;     height: 70px; } .game-mode:before, #play:before {     content: '';     position: absolute;     top: 0px;     left: -34px;     width: 150%;     height: 10000%;     background: #FE0000;     border-right: 20px solid #b6fe9c;     z-index: -1;     transform-origin: 0 0;     transform: translateX(-112%) skewX(45deg);     transition: transform .5s; } .game-mode:hover:before, #play:hover:before {     color: #FFFFFF !important;     transform: translateX(-20%) skewX(45deg); } #play-text {     position: none; } .game-mode {     position: inherit;     overflow: hidden;     width: 122px;     height: 80px;     text-align: center;     padding-bottom: 17px;     padding-top: 11px;     font-size: 16px;     border-radius: 13px;     cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;     color: #f0ece0;     border: 5px solid #141414;     display: flex;     justify-content: center;     align-items: center;     heloo: papa;     border: 5px solid #FE0000;     background-color: transparent;     box-shadow: none;     height: 65px;     padding-top: 20px; } .input {     box-shadow: none; } #nickname {     background: #fff;     border: 5px solid #FE0000;     transition: 0.5s; } #nickname:hover {     background: #FE0000;     color: #fff; } #server-select {     width: 155px;     height: 50px;     line-height: 40px;     border: 5px solid #141414;     border-radius: 10px;     font-size: 16px;     font-weight: 600;     padding-bottom: 0px;     text-indent: 5px;     background: transparent;     box-shadow: none;     color: #fff;     cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;     outline: none;     border: 5px solid #FE0000; }  #server-select:hover {     background: rgba(0,0,0,.5);     box-shadow: none; } .side-button {     background: rgba(0,0,0,0.6);     border-radius: 5px;     border: 3px solid rgba(0,0,0,0.9);     margin-bottom: 12%; } .side-button:hover {     background: #fe0000; } .side-button:active {     background: #FF0000; } .pop-box {     position: absolute;     background: rgba(0,0,0,0.6);     border-radius: 15px;     border: 10px solid rgba(0,0,0,0.9);     display: flex;     justify-content: space-between;     flex-direction: column;     align-items: center;     align-content: center;     margin-bottom: 10px;     padding: 25px;     box-shadow: none;     transition: opacity 300ms; } #main-content, #game-content {     width: max-content; } #main-content {     background: rgb(20 20 20 / 20%) !important; } #game-bottom-content {     background: rgb(20 20 20 / 0%);     height: 130px; } :root {   --inner-shadow:     inset 0 0 0.1vw 0.4vw #e0f7fa,     inset 0 0 0.4vw 0.6vw #00e5ff,     inset 0 0 1vw 0.4vw #26c6da; }  #game-canvas {     border-width: 4px;     border-style: solid;     transition-duration: 1s; } .rainbow {     position: absolute;     z-index: 0;     width: 460px;     height: 380px;     border-radius: 10px;     overflow: hidden;     padding: 1.2rem;     margin-left: 33%;     margin-top: 10%; } .rainbow, .rainbow::before, .rainbow::after {     box-sizing: border-box; } .rainbow::before {     content: '';     position: absolute;     z-index: -2;     left: -50%;     top: -50%;     width: 200%;     height: 200%;     background-color: #399953;     background-repeat: no-repeat;     background-size: 50% 50%, 50% 50%;     background-position: 0 0, 100% 0, 100% 100%, 0 100%;     background-image: linear-gradient(red, blue), linear-gradient(red, blue), linear-gradient(blue, red), linear-gradient(blue, red);     animation: rotate 4s linear infinite; } .rainbow::after {     content: '';     position: absolute;     z-index: -1;     left: 6px;     top: 6px;     width: calc(100% - 12px);     height: calc(100% - 12px);     background: rgb(0 0 0 / 0.9);     border-radius: 5px;     animation: opacityChange 3s infinite alternate; }     ";
    var d = document.createElement("div");
    d.style = "";
    d.classList.add("rainbow");
    d.id = "menu-gradiente";
    d.innerHTML = "         <div style=\"display: flex;justify-content: space-between;\">             <h1 style=\"color: #fff;float: left;\">SplooByJax</h1>             <span id=\"cerrarMenu\" style=\"color: #FFF;cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer;font-size: 26px\">✖</span>         </div>          <hr style=\"border: 2px solid white; margin-top: 2%;border-radius: 100px\">          <div style=\"display: block;margin-top: 6%;color: #FFF;overflow: scroll;max-height: 277px;overflow-x: hidden\" id=\"allFeatures\">              <!--Chat settings-->              <div class=\"settingsClickear\" style=\"display: flex;justify-content: space-between;cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer;\">                 <span class=\"settingsClickear\" style=\"cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer\">                     Chat settings                 </span>                 <span class=\"settingsClickear flecha\" style=\"margin-top: -.5%;cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer\">                     ►                 </span>             </div>             <div id=\"sector_0\" style=\"opacity: 0; overflow: hidden; margin-top: 0%; height: 0px; padding-left: 2%;padding-right: 2%;font-size: 0.9em;font-weight: lighter;\">                 <div style=\"display: flex;justify-content: space-between\">                     <span>Auto break</span>                     <input type=\"text\" maxlength=\"35\" placeholder=\"Auto break chat\" value=\"Why trap me noob?\" id=\"chat_antitrap\">                 </div>                 <div style=\"margin-top: 2%; display: flex;justify-content: space-between\">                     <span>Anti wolf</span>                     <input type=\"text\" maxlength=\"35\" placeholder=\"Anti wolf chat\" value=\"Take trap wolf\" id=\"chat_antiwolf\">                 </div>                 <div style=\"margin-top: 2%; display: flex;justify-content: space-between\">                     <span>Anti fireball</span>                     <input type=\"text\" maxlength=\"35\" placeholder=\"Anti wolf chat\" value=\"Bad dragon\" id=\"chat_antifire\">                 </div>                 <div style=\"margin-top: 2%; display: flex;justify-content: space-between\">                     <span>Kill chat</span>                     <input type=\"text\" maxlength=\"35\" placeholder=\"Kill chat\" value=\"{name} why so ez 😂?\" id=\"chat_killchat\">                 </div>                 <div style=\"margin-top: 2%; display: flex;justify-content: space-between\">                     <span>Auto scuba</span>                     <input type=\"text\" maxlength=\"35\" placeholder=\"Auto scuba chat\" value=\"Automatizated Scuba\" id=\"chat_autoscuba\">                 </div>                 <div style=\"margin-top: 2%; display: flex;justify-content: space-between\">                     <span>Auto chat type</span>                     <select id=\"chat_autotype\">                         <option value=\"none\" selected>                             --Diasabled--                         </option>                         <option value=\"rosalia\">                             Linda                         </value>                         <option value=\"trueno\">                             Trueno - 2.0.1.9                         </option>                         <option value=\"nicki\">                             Nicki - Toa la vida                         </option>                         <option value=\"gasgasgas\">                             Manuel - Gas Gas Gas                         </option>                         <option value=\"sploobyjax\">                             SplooByJax                         </option>                     </select>                 </div>             </div>              <!--Keybind settings-->              <div class=\"settingsClickear\" style=\"margin-top: 4%; display: flex;justify-content: space-between;cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer;\">                 <span class=\"settingsClickear\" style=\"cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer\">                     Keybind settings                 </span>                 <span class=\"settingsClickear flecha\" style=\"margin-top: -.5%;cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer\">                     ►                 </span>             </div>             <div id=\"sector_3\" style=\"opacity: 0; overflow: hidden; margin-top: 0%; height: 0px; padding-left: 2%;padding-right: 2%;font-size: 0.9em;font-weight: lighter;\">             </div>             <div class=\"settingsClickear\" style=\"margin-top: 4%; display: flex;justify-content: space-between;cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer;\">                 <span class=\"settingsClickear\" style=\"cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer\">                     Combat                 </span>                 <span class=\"settingsClickear flecha\" style=\"margin-top: -.5%;cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer\">                     ►                 </span>             </div>             <div id=\"sector_6\" style=\"opacity: 0; overflow: hidden; margin-top: 0%; height: 0px; padding-left: 2%;padding-right: 2%;font-size: 0.9em;font-weight: lighter;\">                 <div style=\"display: flex;justify-content: space-between\">                     <span>Auto break</span>                     <input type=\"checkbox\" id=\"checkbox_antitrap\" checked>                 </div>                 <div style=\"margin-top: 2%;display: flex;justify-content: space-between\">                     <span>Auto place</span>                     <input type=\"checkbox\" id=\"checkbox_autoplace\" checked>                 </div>                 <div style=\"margin-top: 2%;display: flex;justify-content: space-between\">                     <span>Smart hats</span>                     <input type=\"checkbox\" id=\"checkbox_smarthats\" checked>                 </div>                 <div style=\"margin-top: 2%;display: flex;justify-content: space-between\">                     <span>Smart hats auto tank</span>                     <input type=\"checkbox\" id=\"checkbox_smarthats_at\">                 </div>                 <div style=\"margin-top: 2%;display: flex;justify-content: space-between\">                     <span>Automatic healing</span>                     <input type=\"checkbox\" id=\"checkbox_autoheal\" checked>                 </div>             </div>             <div class=\"settingsClickear\" style=\"margin-top: 4%; display: flex;justify-content: space-between;cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer;\">                 <span class=\"settingsClickear\" style=\"cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer\">                     Misc                 </span>                 <span class=\"settingsClickear flecha\" style=\"margin-top: -.5%;cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer\">                     ►                 </span>             </div>             <div id=\"sector_9\" style=\"opacity: 0; overflow: hidden; margin-top: 0%; height: 0px; padding-left: 2%;padding-right: 2%;font-size: 0.9em;font-weight: lighter;\">                 <div style=\"display: flex;justify-content: space-between\">                     <span>Anti wolf</span>                     <input type=\"checkbox\" id=\"checkbox_antiwolf\" checked>                 </div>                 <div style=\"margin-top: 2%; display: flex;justify-content: space-between\">                     <span>Anti fireball</span>                     <input type=\"checkbox\" id=\"checkbox_antifire\" checked>                 </div>                 <div style=\"margin-top: 2%; display: flex;justify-content: space-between\">                     <span>Auto Scuba</span>                     <input type=\"checkbox\" id=\"checkbox_autoscuba\" checked>                 </div>                 <div style=\"margin-top: 2%; display: flex;justify-content: space-between\">                     <span>Kill chat</span>                     <input type=\"checkbox\" id=\"checkbox_killchat\" checked>                 </div>                 <div style=\"margin-top: 2%; display: flex;justify-content: space-between\">                     <span>Auto respawn</span>                     <input type=\"checkbox\" id=\"checkbox_autorespawn\" checked>                 </div>             </div>             <div class=\"settingsClickear\" style=\"margin-top: 4%; display: flex;justify-content: space-between;cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer;\">                 <span class=\"settingsClickear\" style=\"cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer\">                     Visual                 </span>                 <span class=\"settingsClickear flecha\" style=\"margin-top: -.5%;cursor: url(https://cdn.glitch.global/21f29e72-85b9-42dc-8ff7-68683b5fac20/34f218af3fd546f790eb530e1b78a2f9P0jwDgAdhRrNoLGv-0.png) 2 0, pointer\">                     ►                 </span>             </div>             <div id=\"sector_12\" style=\"opacity: 0; overflow: hidden; margin-top: 0%; height: 0px; padding-left: 2%;padding-right: 2%;font-size: 0.9em;font-weight: lighter;\">                 <div style=\"display: flex;justify-content: space-between\">                     <span>Auto Zoom</span>                     <input type=\"checkbox\" id=\"checkbox_automaticzoom\" checked>                 </div>                 <div style=\"margin-top: 2%; display: flex;justify-content: space-between\">                     <span>Show hood names</span>                     <input type=\"checkbox\" id=\"checkbox_shoodnames\" checked>                 </div>             </div>         </div>         ";
    setInterval(() => {
        if (!document.getElementById("hellothere")) {
            document.body.appendChild(b);
        }
        if (!document.getElementById("menu-gradiente")) {
            document.body.appendChild(d);
            document.getElementById("cerrarMenu").onclick = () => {
                d.style.display = "none";
            };
            document.addEventListener("keydown", a => {
                if (a.keyCode == 27) {
                    d.style.display = d.style.display == "none" ? "block" : "none";
                }
            });
            for (let a in c) {
                document.getElementById("sector_3").innerHTML += "<div style=\"margin-top: " + (a != "berserker gear" ? "2" : "0") + "%;display: flex;justify-content: space-between\">                     <span>" + u(a) + "</span>                     <input type=\"text\" onfocus = \"this.value = '...'\" onkeydown=\"event.preventDefault(); return this.value=event.key.toUpperCase();\" style=\"width: 14%; text-align: center;\" placeholder=\"...\" value=\"" + c[a] + "\" id=\"hat_keypress_" + aa[a] + "\">                 </div>";
            }
            for (let b = 0; b < document.getElementsByClassName("settingsClickear").length; b += 3) {
                let c = document.getElementsByClassName("settingsClickear")[b];
                if (c && c.children && c.children[1] && c.children[0]) {
                    c.onclick = () => {
                        c.children[1].style.rotate = c.children[1].style.rotate == "90deg" ? "0deg" : "90deg";
                        document.getElementById("sector_" + b).style.height = c.children[1].style.rotate == "90deg" ? "100%" : "0px";
                        document.getElementById("sector_" + b).style.opacity = c.children[1].style.rotate == "90deg" ? "1" : "0";
                        document.getElementById("sector_" + b).style.marginTop = c.children[1].style.rotate == "90deg" ? "4%" : "0%";
                    };
                    c.children[1].onclick = () => {
                        c.children[1].style.rotate = c.children[1].style.rotate == "90deg" ? "0deg" : "90deg";
                        document.getElementById("sector_" + b).style.height = c.children[1].style.rotate == "90deg" ? "100%" : "0px";
                        document.getElementById("sector_" + b).style.opacity = c.children[1].style.rotate == "90deg" ? "1" : "0";
                        document.getElementById("sector_" + b).style.marginTop = c.children[1].style.rotate == "90deg" ? "4%" : "0%";
                    };
                }
            }
        }
        if (document.getElementById("new-changelog")) {
            document.getElementById("new-changelog").remove();
        }
    }, 500);
    setInterval(() => {
        document.getElementById("game-canvas").style.borderImage = "linear-gradient(to right, #fe0000, blue) 1";
        setTimeout(() => {
            document.getElementById("game-canvas").style.borderImage = "linear-gradient(to left, #fe0000, blue) 1";
        }, 1000);
    }, 4000);
    for (let a = 0; a < s.length; a++) {
        document.getElementById(s[a]).remove();
    }
    document.title = "SplooByJax";
}
document.addEventListener("DOMContentLoaded", () => {
    if (!U) {
        U = true;
        W();
    }
});
Function("(" + (c => {
    'use strict';

    var e = {
        147(a) {
            a.exports = {
                i8: "1.0.21"
            };
        }
    };
    var f = {};
    function g(b) {
        var c = f[b];
        if (c !== undefined) {
            return c.exports;
        }
        var a = f[b] = {
            exports: {}
        };
        e[b](a, a.exports, g);
        return a.exports;
    }
    g.d = (c, d) => {
        for (var a in d) {
            if (g.o(d, a) && !g.o(c, a)) {
                Object.defineProperty(c, a, {
                    enumerable: true,
                    get: d[a]
                });
            }
        }
    };
    g.o = (b, c) => Object.prototype.hasOwnProperty.call(b, c);
    var b = {};
    (() => {
        let m = [{
            radix: 2,
            prefix: "0b0*"
        }, {
            radix: 8,
            prefix: "0+"
        }, {
            radix: 10,
            prefix: ""
        }, {
            radix: 16,
            prefix: "0x0*"
        }];
        let n = a => Object.prototype.toString.call(a).slice(8, -1).toLowerCase();
        class H {
            constructor(b, c) {
                this.code = b;
                this.COPY_CODE = b;
                this.unicode = c || false;
                this.hooks = {};
            }
            static parseValue(a) {
                try {
                    return Function("return (" + a + ")")();
                } catch (a) {
                    return null;
                }
            }
            isRegexp(a) {
                return n(a) === "regexp";
            }
            generateNumberSystem(c) {
                let b = [...m].map(({
                    prefix: d,
                    radix: b
                }) => d + c.toString(b));
                return "(?:" + b.join("|") + ")";
            }
            parseVariables(a) {
                return a = (a = (a = (a = a.replace(/\{VAR\}/g, "(?:let|var|const)")).replace(/\{QUOTE\}/g, "['\"`]")).replace(/ARGS\{(\d+)\}/g, (...b) => {
                    let c = Number(b[1]);
                    let d = [];
                    while (c--) {
                        d.push("\\w+");
                    }
                    return d.join("\\s*,\\s*");
                })).replace(/NUMBER\{(\d+)\}/g, (...b) => {
                    let c = Number(b[1]);
                    return this.generateNumberSystem(c);
                });
            }
            format(d, f, a) {
                this.totalHooks += 1;
                let b = "";
                if (Array.isArray(f)) {
                    b = f.map(a => this.isRegexp(a) ? a.source : a).join("\\s*");
                } else if (this.isRegexp(f)) {
                    b = f.source;
                }
                b = this.parseVariables(b);
                if (this.unicode) {
                    b = b.replace(/\\w/g, "(?:[^\\x00-\\x7F-]|\\$|\\w)");
                }
                let g = RegExp(b.replace(/\{INSERT\}/, ""), a);
                let h = this.code.match(g);
                if (h === null) {
                    console.error("failed to find " + d);
                }
                if (b.includes("{INSERT}")) {
                    return RegExp(b, a);
                } else {
                    return g;
                }
            }
            template(f, g, a, b) {
                let c = RegExp("(" + this.format(g, a).source + ")");
                let d = this.code.match(c) || [];
                this.code = this.code.replace(c, f === 0 ? "$1" + b : b + "$1");
                return d;
            }
            match(f, g, a, b = false) {
                let c = this.format(f, g, a);
                let d = this.code.match(c) || [];
                this.hooks[f] = {
                    expression: c,
                    match: d
                };
                return d;
            }
            matchAll(e, f, a = false) {
                let b = this.format(e, f, "g");
                let c = [...this.code.matchAll(b)];
                this.hooks[e] = {
                    expression: b,
                    match: c
                };
                return c;
            }
            replace(e, f, a, b) {
                let c = this.format(e, f, b);
                this.code = this.code.replace(c, a);
                return this.code.match(c) || [];
            }
            append(c, d, a) {
                return this.template(0, c, d, a);
            }
            prepend(c, d, a) {
                return this.template(1, c, d, a);
            }
            insert(e, f, a) {
                let {
                    source: b
                } = this.format(e, f);
                if (!b.includes("{INSERT}")) {
                    throw Error("Your regexp must contain {INSERT} keyword");
                }
                let c = RegExp(b.replace(/^(.*)\{INSERT\}(.*)$/, "($1)($2)"));
                this.code = this.code.replace(c, "$1" + a + "$2");
                return this.code.match(c);
            }
        }
        let v = a => {
            let c = typeof a == "function" && (a + "").includes("native code");
            try {
                new new Proxy(a, {
                    construct: (b, c) => new b(...c)
                })();
                return c;
            } catch (a) {
                return !a.stack.includes("is not a constructor") && c;
            }
        };
        let w = () => {
            let c = [];
            for (let d of Object.getOwnPropertyNames(window)) {
                let a = window[d];
                if (v(a) && !c.includes(a)) {
                    a.canAssign = true;
                    if (a.canAssign) {
                        delete a.canAssign;
                        if (a.canAssign === undefined) {
                            c.push(a);
                        }
                    }
                }
                if (c.length > 100) {
                    break;
                }
            }
            let b = c[Math.floor(Math.random() * c.length)];
            return {
                name: b.name + ".SplooByJax.",
                method: b
            };
        };
        w();
        let a = {
            Default: {
                w: 1824,
                h: 1026
            },
            lerp: {
                w: 1824,
                h: 1026
            },
            current: {
                w: 1824,
                h: 1026
            }
        };
        let I = {
            props: {}
        };
        let x = a => ({
            id: a[I.props.id],
            type: a.type,
            x: a[I.props.x],
            y: a[I.props.y],
            x1: a[I.props.x1],
            y1: a[I.props.y1],
            x2: a[I.props.x2],
            y2: a[I.props.y2],
            angle: a[I.props.angle],
            angle1: a[I.props.angle1],
            angle2: a[I.props.angle2],
            ownerID: a[I.props.itemOwner],
            target: a
        });
        let y = c => {
            let d = x(c);
            let a = I.entityData[c.type];
            return {
                ...d,
                radius: a[I.props.radius]
            };
        };
        let b = e => {
            let f = y(e);
            let a = I.entityData[e.type];
            let b = e[I.props.health];
            let c = a[I.props.maxHealth];
            return {
                ...f,
                healthValue: b,
                health: Math.ceil(e[I.props.health] / 255 * c),
                maxHealth: c,
                playerValue: e[I.props.playerValue]
            };
        };
        let c = () => {
            setInterval(() => {
                if (document.getElementById("checkbox_automaticzoom") && !document.getElementById("checkbox_automaticzoom").checked) {
                    window.oldZoom = false;
                    a.lerp.w = 1824;
                    a.lerp.h = 1026;
                } else if (globalEnemy) {
                    if (globalEnemy && Math.sqrt(Math.pow(myPlaer.y - globalEnemy.y, 2) + Math.pow(myPlaer.x - globalEnemy.x, 2)) <= 300) {
                        window.oldZoom = false;
                        a.lerp.w = 1824;
                        a.lerp.h = 1026;
                    }
                } else {
                    window.oldZoom = true;
                    a.lerp.w = 2874;
                    a.lerp.h = 2076;
                }
                if (window.newZoom != window.oldZoom) {
                    window.newZoom = window.oldZoom;
                    window.dispatchEvent(new Event("resize"));
                }
            }, 112);
        };
        let d = c;
        let f;
        let g;
        let z = () => {
            delete f.clearRect;
            f.clearRect = new Proxy(g, {
                apply(c, d, a) {
                    c.apply(d, a);
                }
            });
        };
        HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
            apply(d, e, a) {
                let b = d.apply(e, a);
                if (e.id === "game-canvas") {
                    f = b;
                    g = b.clearRect;
                    z();
                    HTMLCanvasElement.prototype.getContext = d;
                }
                return b;
            }
        });
        window.Scaler = a;
        let e = a => {};
        window.weaponSwing = e;
        let j = b => {
            let c = new Image();
            c.src = b;
            c.loaded = false;
            c.onload = () => {
                c.loaded = true;
            };
            return c;
        };
        let k = {
            gaugeBackground: j("https://i.imgur.com/xincrX4.png"),
            gaugeFront: j("https://i.imgur.com/6AkHQM4.png")
        };
        let A = k;
        let p = (b, c) => {
            b.drawImage(c, c.width * -0.5 / 2, c.height * -0.5, c.width * 0.5, c.height * 0.5);
        };
        let l = (h, m, a, b, c) => {
            let {
                x: d,
                y: e,
                radius: f
            } = m;
            f = 10;
            let n = A.gaugeBackground;
            let o = A.gaugeFront;
            let i = o.width * 0.5;
            let j = a / b * (i - 10);
            let k = m.type === 18 ? 25 : 50;
            h.save();
            h.translate(d, e + f + k + o.height * 0.5);
            p(h, n);
            h.fillStyle = c;
            h.fillRect(-i / 2 + 5, o.height * -0.5 + 5, j, o.height * 0.5 - 10);
            p(h, o);
            h.restore();
        };
        let o = (d, e, a) => {
            let b = d;
            if (d.oldId && b.type === 0) {
                l(e, b, d.hatReload, 1300, "#000000");
            }
        };
        window.drawEntityInfow = o;
        let q = J => {
            let c = new H(J, true);
            window.COPY_CODE = (c.COPY_CODE.match(/^(\(function \w+\(\w+\)\{.+)\(.+?\);$/) || [])[1];
            c.append("EXTERNAL fix", /\(function (\w+)\(\w+\)\{/, "let $2 = eval(`(() => ${COPY_CODE})()`);delete window.COPY_CODE;");
            c.replace("zoom", /(\w+):NUMBER{1824},(\w+):NUMBER{1026}/, "get $1(){return Scaler.lerp.w},get $2(){return Scaler.lerp.h}");
            c.replace("strict", /{QUOTE}use strict{QUOTE};/, "");
            c.replace("renderHoods", /\w\.\w{2}&[a-z]\(\).\w{2}\)\)/, "false))");
            c.append("showHoods", /\w+\.\w+!==\w+\)/, "||document.getElementById(\"checkbox_shoodnames\") ?document.getElementById(\"checkbox_shoodnames\").checked : true");
            let [, a, b, d] = c.match("selectByID", [/(\w+)/, /\(/, /(\w+)\.(\w+)/, /\[/, /Number/]);
            let [, e, f, g] = c.match("positionX", [/\(\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /\+/, /\(\w+\.(\w+)/]);
            let [, h, i, j] = c.match("positionY", [/,\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /\+/, /\(\w+\.(\w+)/]);
            let [, k, l, m] = c.match("angle", [/\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+/, /,/, /\w+\.\w+/, /=/, /\w+/, /,/]);
            let n = c.match("id", [/-NUMBER{1}/, /!==/, /\w+\.(\w+)/, /&&/])[1];
            let o = c.match("health", [/(\w+)/, /\//, /NUMBER{255}/, /\*/])[1];
            let p = c.match("maxHealth", [/\w+/, /:/, /NUMBER{35}/, /,/, /(\w+)/, /:/, /NUMBER{100}/])[1];
            let q = c.match("playerValue", [/if/, /\(/, /!/, /\(/, /\w+/, /\./, /(\w+)/, /&/, /\w+/, /\(/, /\)/])[1];
            let [, r, s] = c.match("itemType", [/(\w+)/, /\(/, /\)/, /\[/, /\w+/, /\]/, /\./, /(\w+)/, /;/]);
            let [, t, u] = c.match("entityData", /(\w+)\(\)\[\w+\.\w+\]\.(\w+)/);
            let v = c.match("currentCount", [/(\w+)/, /:/, /\[/, /ARGS{11}/, /\]/, /,/])[1];
            let [, w, x] = c.match("upgradeList", [/&&/, /\(/, /(\w+)/, /\(/, /\w+/, /\./, /(\w+)/, /\[/, /\w+/, /\]/, /\),/]);
            c.match("byteLength", [/NUMBER{3}/, /;/, /\w+/, /</, /(\w+)/])[1];
            let [, y, z] = c.match("scythe", [/\w+/, /&&/, /(\w+)/, /\(/, /(\w+)/, /\)/, /,/]);
            let A = c.match("itemDamage", [/(\w+)/, /:/, /46\.5/, /,/])[1];
            let B = c.match("itemDataType", [/\w+/, /\./, /(\w+)/, /===/, /NUMBER{2}/])[1];
            let C = c.match("renderLayer", [/:/, /NUMBER{38}/, /,/, /(\w+)/, /:/, /\w+/, /\./, /\w+/, /,/])[1];
            let D = c.match("currentItem", [/,/, /\w+/, /\./, /(\w+)/, /===/])[1];
            let E = c.match("rotSpeed", [/\+=/, /\w+/, /\./, /(\w+)/, /\*/, /\w+/, /\)/])[1];
            let F = c.match("hat", [/\w+/, /\(/, /\)/, /\[/, /\w+/, /\./, /(\w+)/, /\]/, /;/, /if/])[1];
            I.props.itemBar = d;
            I.props.x = e;
            I.props.x1 = f;
            I.props.x2 = g;
            I.props.y = h;
            I.props.y1 = i;
            I.props.y2 = j;
            I.props.angle = k;
            I.props.angle1 = l;
            I.props.angle2 = m;
            I.props.id = n;
            I.props.health = o;
            I.props.maxHealth = p;
            I.props.hat = F;
            I.props.playerValue = q;
            I.props.itemType = s;
            I.props.radius = u;
            I.props.currentCount = v;
            I.props.upgradeBar = x;
            I.props.itemDamage = A;
            I.props.itemDataType = B;
            I.props.renderLayer = C;
            I.props.currentItem = D;
            I.props.rotSpeed = E;
            return c.code;
        };
        window.eval = new Proxy(window.eval, {
            apply(d, e, a) {
                let b = a[0];
                if (b.length > 100000) {
                    a[0] = q(b);
                    window.eval = d;
                    d.apply(e, a);
                    r();
                    return;
                }
                return d.apply(e, a);
            }
        });
        let r = () => {
            d();
        };
    })();
}).toString() + (")(" + JSON.stringify(GM_info) + ");"))();