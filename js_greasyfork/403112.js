// ==UserScript==
// @name       starve.io  X XRAY Map
// @description    C = xray 
// @author       keith i try
// @version      v0.1 
// @match        ://starve.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/559403
// @downloadURL https://update.greasyfork.org/scripts/403112/starveio%20%20X%20XRAY%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/403112/starveio%20%20X%20XRAY%20Map.meta.js
// ==/UserScript==


// Vinyl-Scratch

var interfazA = true;
var presionar_0A = [];
var change1A = false;
var change2A = false;
document.addEventListener('keydown', img0A);
var IToverlayA = document.createElement("div");
IToverlayA.style = " position: fixed; top:1px; left:1px; ";
document.body.appendChild(IToverlayA);

function img0A(e) {
   if (e.keyCode == 67) {
        change1A = change1A ^ true;
        GM_setValue("GM_change1A", change1A); }
 if (e.keyCode == 66) {
        interfazA = interfazA ^ true
    }
    press[e.keyCode] = 1;
    GM_setValue("GM_pressArray", press);
}

function ITA() {
  img0A = GM_getValue("GM_change1A");
var png0A = "";
 if ( img0A == true) {
        png0A = `<fondo><img  style="margin: -400px 5px " width="60" height= "60"  " src="https://i.ibb.co/QQd2Fqx/oon0.png" ></fondo> `;
    } else if (img0A == false) {
        png0A = `<fondo><img  style="margin: -400px 5px " width="60" height= "60"  " src="https://i.ibb.co/yNScgnt/oon1.png" ></fondo> `;
    }

   if ( interfazA == true) {
        IToverlayA.innerHTML = `<img> ${png0A}  </img>`;
    } else {
        IToverlayA.innerHTML = '<img> </img>'}
}
var fazA = setInterval(ITA, 10);

/// MAP

jQuery(document).ready(function(){
    document.title = ('' + " " + version);
    jQuery("a[href='https://iogames.space']").hide();

    jQuery('#nickname_input').css({"color": "","font-size":"25","background-color":""});
    jQuery('#chat_input').css({"color": "","font-size":"20","background-color":""});
    jQuery('#game_canvas').css("image-rendering","initial");
    jQuery('#trevda').css("visibility","hidden");
    jQuery("link[rel='shortcut icon']").attr("href", "");
    jQuery("#loading").css({"background-color": "","color":""});
    jQuery("body").on("contextmenu",function(e){
    return false;
});

    jQuery("body").append ('<img draggable="false" id="myNewImage" border="0" src="https://cdn.discordapp.com/attachments/691584212288929854/692082785493712926/mapv2.png">')
    jQuery("body").append ('<p id="hrs"></p>')
    jQuery('body').append('<p id="ratata"></p>');
    jQuery('body').append('<p id="author"><a target="_blank" href=""></a></p>');

    jQuery("#author").animate({right: '55px'}).css({
        cursor: "url(http://starve.io/img/cursor1.png), pointer",
        boxSizing: "border-box",
        borderRadius: "8px",
        backgroundColor: "#ad0c24",
        boxShadow: "0px 5px #ad0c24",
        paddingLeft: "10px",
        paddingRight: "10px",
        webkitTouchCallout: "none",
        webkitUserSelect: "none",
        khtmlUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
        position: "absolute",
        color:"#ad0c24",
        fontFamily:"Baloo Paaji",
        position: "absolute",
        right:"55px",
        bottom:"30px",

    });

    jQuery("#myNewImage").animate({right: '10px'}).css({
        cursor: "url(http://starve.io/img/cursor0.png), default",
        opacity: "90%",
        imageRendering: "initial",
        webkitTouchCallout: "none",
        webkitUserSelect: "none",
        khtmlUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
        position: "absolute",
        right:"10px",
        bottom:"130px",
        width: "180px",
        height: "180px",
    });

    jQuery("#ratata").animate({right: '43px'}).css({
        cursor: "url(http://starve.io/img/cursor0.png), default",
        boxSizing: "border-box",
        borderRadius: "8px",
        backgroundColor: "#ad0c24",
        boxShadow: "0px 5px #590814",
        paddingLeft: "10px",
        paddingRight: "10px",
        webkitTouchCallout: "none",
        webkitUserSelect: "none",
        khtmlUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
        position: "absolute",
        color:"#FFFFFF",
        fontFamily:"Baloo Paaji",
        position: "absolute",
        right:"45px",
        bottom:"80px",

    });
});


// XRAY
const cryoa = ["ZcOMwpMaWg==", "XSlqe8OA", "UsK6NMKDw4Q=", "w6LCrRE=", "wonChsOdw6wB"];
(function (a, b) {
    const e = function (f) {
        while (--f) {
            a["push"](a["shift"]());
        }
    };
    e(++b);
})(cryoa, 0x1b7);
const cryob = function (a, b) {
    a = a - 0x0;
    let c = cryoa[a];
    if (cryob["TCtgIz"] === undefined) {
        (function () {
            const f = function () {
                let i;
                try {
                    i = Function("return (function() " + '{}.constructor("return this")( )' + ");")();
                } catch (j) {
                    i = window;
                }
                return i;
            };
            const g = f();
            const h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=:;'?\|";
            g["atob"] ||
                (g["atob"] = function (i) {
                    const j = String(i)["replace"](/=+$/, "");
                    let k = "";
                    for (let l = 0x0, m, n, o = 0x0; (n = j["charAt"](o++)); ~n && ((m = l % 0x4 ? m * 0x40 + n : n), l++ % 0x4) ? (k += String["fromCharCode"](0xff & (m >> ((-0x2 * l) & 0x6)))) : 0x0) {
                        n = h["indexOf"](n);
                    }
                    return k;
                });
        })();
        const e = function (f, g) {
            let h = [],
                l = 0x0,
                m,
                n = "",
                o = "";
            f = atob(f);
            for (let q = 0x0, r = f["length"]; q < r; q++) {
                o += "%" + ("00" + f["charCodeAt"](q)["toString"](0x10))["slice"](-0x2);
            }
            f = decodeURIComponent(o);
            let p;
            for (p = 0x0; p < 0x100; p++) {
                h[p] = p;
            }
            for (p = 0x0; p < 0x100; p++) {
                l = (l + h[p] + g["charCodeAt"](p % g["length"])) % 0x100;
                m = h[p];
                h[p] = h[l];
                h[l] = m;
            }
            p = 0x0;
            l = 0x0;
            for (let t = 0x0; t < f["length"]; t++) {
                p = (p + 0x1) % 0x100;
                l = (l + h[p]) % 0x100;
                m = h[p];
                h[p] = h[l];
                h[l] = m;
                n += String["fromCharCode"](f["charCodeAt"](t) ^ h[(h[p] + h[l]) % 0x100]);
            }
            return n;
        };
        cryob["EPqaUM"] = e;
        cryob["KlIFPl"] = {};
        cryob["TCtgIz"] = !![];
    }
    const d = cryob["KlIFPl"][a];
    if (d === undefined) {
        if (cryob["rnHRnc"] === undefined) {
            cryob["rnHRnc"] = !![];
        }
        c = cryob["EPqaUM"](c, b);
        cryob["KlIFPl"][a] = c;
    } else {
        c = d;
    }
    return c;
};
(function () {
    const b = {};
    b[cryob("0x3", "AD!5")] = function (f, g) {
        return f == g;
    };
    b["Gzyaz"] = "HTMLImageElem" + cryob("0x4", "Rrf[");
    b["cjlVp"] = "KeyC";
    b[cryob("0x2", "#kZJ")] = function (f, g) {
        return f > g;
    };
    b["KQQjx"] = "keyup";
    const c = b;
    let d = {};
    document["addEventListe" + "ner"]("keydown", (f) => {
        d[f["code"]] = !![];
    });
    document["addEventListe" + "ner"](c["KQQjx"], (f) => {
        d[f["code"]] = ![];
    });
    let e = CanvasRenderingContext2D["prototype"]["drawImage"];
    CanvasRenderingContext2D["prototype"]["drawImage"] = function () {
        if (c["fBSnL"](arguments[0x0]["constructor"]["name"], c["Gzyaz"])) {
        } else {
            if (d[c[cryob("0x1", "!hU9")]]) {
                if (arguments[0x0]["width"] > 0x64 || c["wdNCR"](arguments[0x0]["height"], 0x64)) {
                    this["globalAlpha"] = 0.2;
                }
            }
        }
        return e[cryob("0x0", "kqoc")](this, arguments);
    };
})();

