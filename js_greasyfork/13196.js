// ==UserScript==
// @name         Client Bot
// @namespace    Client Bot
// @version      1.8
// @description  AgarHelper.com
// @author       Code Denis Kolsanov, Changes Kriss
// @include      http://agar.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13196/Client%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/13196/Client%20Bot.meta.js
// ==/UserScript==   

var el = document.getElementById( 'adbg' );
el.parentNode.removeChild( el );
var Version = GM_info.script.version;

if (window.localStorage["nick"])
{
    nick.value = window.localStorage["nick"];
}

var myLayer = document.createElement('div');
myLayer.id = 'statsbots';
myLayer.style.position = 'absolute';
myLayer.style.left = '10px';
myLayer.style.top = '10px';
myLayer.style.width = '300px';
myLayer.style.height = '300px';
myLayer.style.padding = '10px';
document.body.appendChild(myLayer);

var tracks = ['http://incompetech.com/music/royalty-free/mp3-preview2/Frost%20Waltz.mp3',
    'http://incompetech.com/music/royalty-free/mp3-preview2/Frozen%20Star.mp3',
    'http://incompetech.com/music/royalty-free/mp3-preview2/Groove%20Grove.mp3',
    'http://incompetech.com/music/royalty-free/mp3-preview2/Dreamy%20Flashback.mp3',
    'http://incompetech.com/music/royalty-free/mp3-preview2/Impact%20Lento.mp3',
    'http://incompetech.com/music/royalty-free/mp3-preview2/Wizardtorium.mp3'];

var nodeAudio = document.createElement("audio");
nodeAudio.id = 'audiotemplate';
nodeAudio.preload = "auto";
document.body.appendChild(nodeAudio);

var bgmusic = $('#audiotemplate').clone()[0];
bgmusic.src = tracks[Math.floor(Math.random() * tracks.length)];
bgmusic.load();
bgmusic.loop = false;
bgmusic.onended = function() {
    var track = tracks[Math.floor(Math.random() * tracks.length)];
    bgmusic.src = track;
    bgmusic.play();
};
bgmusic.volume = 0.1;
bgmusic.play();

$.getScript("https://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.4.1/canvas.min.js");
$.getScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js");


window.serverip = "51.254.143.115:8080";

function base64_encode( data ) {
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var o1, o2, o3, h1, h2, h3, h4, bits, i=0, enc='';
  do {
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1<<16 | o2<<8 | o3;

    h1 = bits>>18 & 0x3f;
    h2 = bits>>12 & 0x3f;
    h3 = bits>>6 & 0x3f;
    h4 = bits & 0x3f;

    enc += b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  switch( data.length % 3 ){
    case 1:
      enc = enc.slice(0, -2) + '==';
    break;
    case 2:
      enc = enc.slice(0, -1) + '=';
    break;
  }
  return enc;
}


function base64_decode( data ) {
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1, o2, o3, h1, h2, h3, h4, bits, i=0, enc='';
  do {
    h1 = b64.indexOf(data.charAt(i++));
    h2 = b64.indexOf(data.charAt(i++));
    h3 = b64.indexOf(data.charAt(i++));
    h4 = b64.indexOf(data.charAt(i++));

    bits = h1<<18 | h2<<12 | h3<<6 | h4;

    o1 = bits>>16 & 0xff;
    o2 = bits>>8 & 0xff;
    o3 = bits & 0xff;

    if (h3 == 64)   enc += String.fromCharCode(o1);
    else if (h4 == 64) enc += String.fromCharCode(o1, o2);
    else         enc += String.fromCharCode(o1, o2, o3);
  } while (i < data.length);
  return enc;
}

window.connected = false;
window.connectedBots = 0;
window.availableBots = 0;
window.time = 0;
window.followMouse = true;

var main = (function(d, e) {
    function Nb() {
        Ga = !0;
        eb();
        setInterval(eb, 18E4);
        K = Ha = document.getElementById("canvas");
        f = K.getContext("2d");
        K.onmousedown = function(a) {
            if (fb) {
                var b = a.clientX - (5 + h / 5 / 2),
                    c = a.clientY - (5 + h / 5 / 2);
                if (Math.sqrt(b * b + c * c) <= h / 5 / 2) {
                    ca();
                    L(17);
                    return
                }
            }
            na = 1 * a.clientX;
            oa = 1 * a.clientY;
            Ia();
            ca()
        };
        K.onmousemove = function(a) {
            na = 1 * a.clientX;
            oa = 1 * a.clientY;
            Ia()
        };
        K.onmouseup = function() {};
        /firefox/i.test(navigator.userAgent) ? document.addEventListener("DOMMouseScroll", gb, !1) : document.body.onmousewheel = gb;
        var a = !1,
            b = !1,
            c = !1;
        d.onkeydown = function(n) {
            32 != n.keyCode || a || (ca(), L(17), a = !0);
            81 != n.keyCode || (window.followMouse = !window.followMouse) || b || (K(18), b = !0);
            87 != n.keyCode || c || (ca(), L(21), c = !0);
            109 != n.keyCode || voldown();
            107 != n.keyCode || volup();
            221 != n.keyCode || nextmusic();
			69 != n.keyCode || split();
            27 == n.keyCode && pa(300)
        };
        d.onkeyup = function(n) {
            32 == n.keyCode && (a = !1);
            87 == n.keyCode && (c = !1);
            81 == n.keyCode && b && (L(19), b = !1)
        };
        d.onblur = function() {
            //L(19);
            //c = b = a = !1
        };
        d.onresize = hb;
        d.requestAnimationFrame(ib);
        setInterval(ca, 40);
        y && e("#region").val(y);
        jb();
        qa(e("#region").val());
        0 == Ja && y && M();
        pa(0);
        hb();
        d.location.hash && 6 <= d.location.hash.length && kb(d.location.hash)
    }
    function split()
	{
		if (window.connected)
			window.server.send( JSON.stringify({ type : "split", key : window.localStorage["login"]}) );
	}
    function voldown()
    {
       var now = bgmusic.volume;
       var ready = now - 0.1;
       
       bgmusic.volume =  Math.round(ready * 100) / 100;

    }
    function volup()
    {
       var now = bgmusic.volume;
       var ready = now + 0.1;
       bgmusic.volume = Math.round(ready * 100) / 100;

    }
    
    function nextmusic()
    {
         var track = tracks[Math.floor(Math.random() * tracks.length)];
        bgmusic.src = track;
        bgmusic.play();
    }

    function gb(a) {
        N *= Math.pow(.9, a.wheelDelta / -150 || a.detail || 0);
        0.4 > N && (N = 0.4);
        N > 4 / g && (N = 4 / g)
    }

    function Ob() {
        if (.4 > g) da = null;
        else {
            for (var a = Number.POSITIVE_INFINITY, b = Number.POSITIVE_INFINITY, c = Number.NEGATIVE_INFINITY, n = Number.NEGATIVE_INFINITY, d = 0; d < v.length; d++) {
                var e = v[d];
                !e.H() || e.L || 20 >= e.size * g || (a = Math.min(e.x - e.size, a), b = Math.min(e.y - e.size, b), c = Math.max(e.x + e.size, c), n = Math.max(e.y + e.size, n))
            }
            da = Pb.X({
                ba: a - 10,
                ca: b - 10,
                Z: c + 10,
                $: n + 10,
                fa: 2,
                ha: 4
            });
            for (d = 0; d < v.length; d++)
                if (e = v[d], e.H() && !(20 >= e.size * g))
                    for (a = 0; a < e.a.length; ++a) b = e.a[a].x, c = e.a[a].y, b < t - h / 2 / g || c < u - q / 2 / g || b > t + h / 2 / g || c > u + q / 2 / g || da.Y(e.a[a])
        }
    }

    function Ia() {
        ra = (na - h / 2) / g + t;
        sa = (oa - q / 2) / g + u
    }

    function eb() {
        null == ta && (ta = {}, e("#region").children().each(function() {
            var a = e(this),
                b = a.val();
            b && (ta[b] = a.text())
        }));
        e.get(ea + "info", function(a) {
            var b = {},
                c;
            for (c in a.regions) {
                var n = c.split(":")[0];
                b[n] = b[n] || 0;
                b[n] += a.regions[c].numPlayers
            }
            for (c in b) e('#region option[value="' + c + '"]').text(ta[c] + " (" + b[c] + " players)")
        }, "json")
    }

    function lb() {
        e("#adsBottom").hide();
        e("#overlays").hide();
        e("#stats").hide();
        e("#mainPanel").hide();
        V = fa = !1;
        jb();
        mb(d.aa.concat(d.ac))
    }

    function qa(a) {
        a && a != y && (e("#region").val() != a && e("#region").val(a), y = d.localStorage.location = a, e(".region-message").hide(), e(".region-message." + a).show(), e(".btn-needs-server").prop("disabled", !1), Ga && M())
    }

    function pa(a) {
        fa || V || (H = null, Ka || (e("#adsBottom").show(), e("#g300x250").hide(), e("#a300x250").show()), nb(Ka ? d.ac : d.aa), Ka = !1, 1E3 > a && (s = 1), fa = !0, e("#mainPanel").show(), 0 < a ? e("#overlays").fadeIn(a) : e("#overlays").show())
    }

    function ga(a) {
        e("#helloContainer").attr("data-gamemode", a);
        W = a;
        e("#gamemode").val(a)
    }

    function jb() {
        e("#region").val() ? d.localStorage.location = e("#region").val() : d.localStorage.location && e("#region").val(d.localStorage.location);
        e("#region").val() ? e("#locationKnown").append(e("#region")) : e("#locationUnknown").append(e("#region"))
    }

    function nb(a) {
        d.googletag && d.googletag.cmd.push(function() {
            La && (La = !1, setTimeout(function() {
                La = !0
            }, 6E4 * Qb), d.googletag && d.googletag.pubads && d.googletag.pubads().refresh && d.googletag.pubads().refresh(a))
        })
    }

    function mb(a) {
        d.googletag && d.googletag.pubads && d.googletag.pubads().clear && d.googletag.pubads().clear(a)
    }

    function ha(a) {
        return d.i18n[a] || d.i18n_dict.en[a] || a
    }

    function ob() {
        var a = ++Ja;
        console.log("Find " + y + W);
        e.ajax(ea + "findServer", {
            error: function() {
                setTimeout(ob, 1E3)
            },
            success: function(b) {
                a == Ja && (b.alert && alert(b.alert), Ma("ws://" + b.ip, b.token))
            },
            dataType: "json",
            method: "POST",
            cache: !1,
            crossDomain: !0,
            data: (y + W || "?") + "\n154669603"
        })
    }

    function M() {
        Ga && y && (e("#connecting").show(), ob())
    }

    function Ma(a, b) {
        if (r) {
            r.onopen = null;
            r.onmessage = null;
            r.onclose = null;
            try {
                r.close()
            } catch (c) {}
            r = null
        }
        Na.ip && (a = "ws://" + Na.ip);
        if (null != O) {
            var n = O;
            O = function() {
                n(b)
            }
        }
        if (pb) {
            var d = a.split(":");
            a = d[0] + "s://ip-" + d[1].replace(/\./g, "-").replace(/\//g, "") + ".tech.agar.io:" + (+d[2] + 2E3)
        }
        z = [];
        l = [];
        I = {};
        v = [];
        X = [];
        w = [];
        A = B = null;
        P = 0;
        ia = !1;
        if( !window.server ){
            if( !window.localStorage["login"] ){
                window.localStorage["login"] = base64_encode( ""+Math.random() );
            }
            window.server = new WebSocket("ws://"+window.serverip,'echo-protocol');
            window.server.onopen = function(event) {
                window.connected = true;
                window.server.send( JSON.stringify({ type : "type", value : 0, key : window.localStorage["login"], version: Version }) );
                e('<div class="input-group"><span class="input-group-addon" id="basic-addon1">KEY</span><input type="text" class="form-control" placeholder="Your Key" value="'+ window.localStorage["login"] +'" disabled aria-describedby="basic-addon1"></div>').appendTo("#instructions");
                //e('<input type="text" class="btn btn-danger" id="namebot" style="margin-top:5px;position:relative;width:100%;"></input>').appendTo("#instructions");

            };
            window.server.onmessage = function(event) {
                var data = JSON.parse(event.data);
                if(data.type === "version")
                {
                    var serverversion = data.version;
                    if (Version != serverversion)
                    {
                        document.getElementsByClassName("form-group")[0].style.visibility='hidden';
                        document.getElementsByClassName("form-group")[1].style.visibility='hidden';
                        document.getElementsByClassName("form-group")[2].style.visibility='hidden';
                        e('<br><span class="label label-danger" style="width:100%; font-size:15px;">Pls Update Client script in Tampermonkey!</span>').appendTo("#instructions");
                         return;

                    }
                }
                if(data.type === "returnmessage")
                {
                    var totalSec = data.botTime;
                    var days = parseInt(totalSec / 86400);
                    var hours = parseInt( totalSec / 3600 ) % 24;
                    var minutes = parseInt( totalSec / 60 ) % 60;
                    var seconds = totalSec % 60;
                    
                    var showdays = "";
                    
                    if(days > 0)
                    {
                        var showdays = (days < 10 ? "" + days : days) + " days , ";
                    }
                  
                    var result = 'Bots Expired: ' + showdays + (hours < 10 ? "0" + hours : hours) + "h : " + (minutes < 10 ? "0" + minutes : minutes) + "min : " + (seconds  < 10 ? "0" + seconds : seconds) + 'sec';
                    window.time = result;
                    window.connectedBots = data.botConnected;
                }
                if(data.type === "nouser")
                {
                    if (data.key === window.localStorage["login"])
                    {
                        window.server.onclose = function () {}; // disable onclose handler first
                        window.server.close();
                        e('<br><button class="btn btn-danger" style="width:100%;">User not found!</button>').appendTo("#instructions");
                    }
                }
                if(data.type === "timeleft")
                {
                    if (data.key === window.localStorage["login"])
                    {
                        window.server.onclose = function () {}; // disable onclose handler first
                        window.server.close();
                        e('<br><button class="btn btn-danger" style="width:100%;">Bots expired!</button>').appendTo("#instructions");
                    }
                }
                var temp = {};
                for( var key in w ) temp[w[key].id] = w[key].name;
                //window.server.send( JSON.stringify({ type : "info", value : 0, list : temp }) );
            };
            window.server.onclose = function(event) {
                window.connected = false;
                setTimeout( 'window.server = new WebSocket("ws://"+window.serverip)', 1000 );
            };
        }
        console.log("Connecting to " + a);
        r = new WebSocket(a);
        r.binaryType = "arraybuffer";
        r.onopen = function() {
            var a;
            console.log("socket open");
            a = Q(5);
            a.setUint8(0, 254);
            a.setUint32(1, 5, !0);
            R(a);
            a = Q(5);
            a.setUint8(0, 255);
            a.setUint32(1, 154669603, !0);
            R(a);
            a = Q(1 + b.length);
            a.setUint8(0, 80);
            for (var c = 0; c < b.length; ++c) a.setUint8(c + 1, b.charCodeAt(c));
            R(a);
            qb()
        };
        r.onmessage = Rb;
        r.onclose = Sb;
        r.onerror = function() {
            console.log("socket error")
        }
    }

    function Q(a) {
        return new DataView(new ArrayBuffer(a))
    }

    function R(a) {
        r.send(a.buffer)
    }

    function Sb() {
        ia && (ua = 500);
        console.log("socket close");
        setTimeout(M, ua);
        ua *= 2
    }

    function Rb(a) {
        Tb(new DataView(a.data))
    }

    function Tb(a) {
        function b() {
            for (var b = "";;) {
                var d = a.getUint16(c, !0);
                c += 2;
                if (0 == d) break;
                b += String.fromCharCode(d)
            }
            return b
        }
        var c = 0;
        240 == a.getUint8(c) && (c += 5);
        switch (a.getUint8(c++)) {
            case 16:
                Ub(a, c);
                break;
            case 17:
                ja = a.getFloat32(c, !0);
                c += 4;
                ka = a.getFloat32(c, !0);
                c += 4;
                la = a.getFloat32(c, !0);
                c += 4;
                break;
            case 20:
                l = [];
                z = [];
                break;
            case 21:
                Oa = a.getInt16(c, !0);
                c += 2;
                Pa = a.getInt16(c, !0);
                c += 2;
                Qa || (Qa = !0, va = Oa, wa = Pa);
                break;
            case 32:
                z.push(a.getUint32(c, !0));
                c += 4;
                break;
            case 49:
                if (null != B) break;
                var n = a.getUint32(c, !0),
                    c = c + 4;
                w = [];
                for (var d = 0; d < n; ++d) {
                    var e = a.getUint32(c, !0),
                        c = c + 4;
                    w.push({
                        id: e,
                        name: b()
                    })
                }
                rb();
                break;
            case 50:
                B = [];
                n = a.getUint32(c, !0);
                c += 4;
                for (d = 0; d < n; ++d) B.push(a.getFloat32(c, !0)), c += 4;
                rb();
                break;
            case 64:
                xa = a.getFloat64(c, !0);
                c += 8;
                ya = a.getFloat64(c, !0);
                c += 8;
                za = a.getFloat64(c, !0);
                c += 8;
                Aa = a.getFloat64(c, !0);
                c += 8;
                ja = (za + xa) / 2;
                ka = (Aa + ya) / 2;
                la = 1;
                0 == l.length && (t = ja, u = ka, g = la);
                break;
            case 81:
                var f = a.getUint32(c, !0),
                    c = c + 4,
                    k = a.getUint32(c, !0),
                    c = c + 4,
                    h = a.getUint32(c, !0),
                    c = c + 4;
                setTimeout(function() {
                    Y({
                        d: f,
                        e: k,
                        c: h
                    })
                }, 1200)
        }
    }

    function Ub(a, b) {
        function c() {
            for (var c =
                    "";;) {
                var d = a.getUint16(b, !0);
                b += 2;
                if (0 == d) break;
                c += String.fromCharCode(d)
            }
            return c
        }

        function n() {
            for (var c = "";;) {
                var d = a.getUint8(b++);
                if (0 == d) break;
                c += String.fromCharCode(d)
            }
            return c
        }
        sb = F = Date.now();
        ia || (ia = !0, Vb());
        Ra = !1;
        var p = a.getUint16(b, !0);
        b += 2;
        for (var f = 0; f < p; ++f) {
            var C = I[a.getUint32(b, !0)],
                k = I[a.getUint32(b + 4, !0)];
            b += 8;
            C && k && (k.R(), k.o = k.x, k.p = k.y, k.n = k.size, k.C = C.x, k.D = C.y, k.m = k.size, k.K = F, Wb(C, k))
        }
        for (f = 0;;) {
            p = a.getUint32(b, !0);
            b += 4;
            if (0 == p) break;
            ++f;
            var g, C = a.getInt32(b, !0);
            b += 4;
            k = a.getInt32(b, !0);
            b += 4;
            g = a.getInt16(b, !0);
            b += 2;
            var m = a.getUint8(b++),
                J = a.getUint8(b++),
                S = a.getUint8(b++),
                J = Xb(m << 16 | J << 8 | S),
                S = a.getUint8(b++),
                h = !!(S & 1),
                q = !!(S & 16),
                r = null;
            S & 2 && (b += 4 + a.getUint32(b, !0));
            S & 4 && (r = n());
            var s = c(),
                m = null;
            I.hasOwnProperty(p) ? (m = I[p], m.J(), m.o = m.x, m.p = m.y, m.n = m.size, m.color = J) : (m = new Z(p, C, k, g, J, s), v.push(m), I[p] = m, m.ia = C, m.ja = k);
            m.f = h;
            m.j = q;
            m.C = C;
            m.D = k;
            m.m = g;
            m.K = F;
            m.T = S;
            m.V = r;
            s && m.t(s); - 1 != z.indexOf(p) && -1 == l.indexOf(m) && (l.push(m), 1 == l.length && (t = m.x, u = m.y, tb(), document.getElementById("overlays").style.display = "none", x = [], Sa = 0, Ta = l[0].color, Ua = !0, ub = Date.now(), T = Va = Wa = 0))
        }
        C = a.getUint32(b, !0);
        b += 4;
        for (f = 0; f < C; f++) p = a.getUint32(b, !0), b += 4, m = I[p], null != m && m.R();
        Ra && 0 == l.length && (vb = Date.now(), Ua = !1, fa || V || (wb ? (nb(d.ab), Yb(), V = !0, e("#overlays").fadeIn(3E3), e("#stats").show()) : pa(3E3)))
    }

    function Vb() {
        e("#connecting").hide();
        xb();
        O && (O(), O = null);
        null != Xa && clearTimeout(Xa);
        Xa = setTimeout(function() {
            d.ga && (++yb, d.ga("set", "dimension2", yb))
        }, 1E4)
    }

    function ca() {
        if ($()) {
            var a = na - h / 2,
                b = oa - q / 2;
            64 > a * a + b * b || .01 > Math.abs(zb -
                ra) && .01 > Math.abs(Ab - sa) || (zb = ra, Ab = sa, a = Q(13), a.setUint8(0, 16), a.setInt32(1, ra, !0), a.setInt32(5, sa, !0), a.setUint32(9, 0, !0), R(a))
        }
    }

    function xb() {
        if ($() && ia && null != H) {
            var a = Q(1 + 2 * H.length);
            a.setUint8(0, 0);
            for (var b = 0; b < H.length; ++b) a.setUint16(1 + 2 * b, H.charCodeAt(b), !0);
            R(a);
            H = null
        }
    }

    function $() {
        return null != r && r.readyState == r.OPEN
    }

    function L(a) {
        if ($()) {
            var b = Q(1);
            b.setUint8(0, a);
            R(b)
        }
    }

    function qb() {
        if ($() && null != D) {
            var a = Q(1 + D.length);
            a.setUint8(0, 81);
            for (var b = 0; b < D.length; ++b) a.setUint8(b + 1, D.charCodeAt(b));
            R(a)
        }
    }

    function hb() {
        h = 1 * d.innerWidth;
        q = 1 * d.innerHeight;
        Ha.width = K.width = h;
        Ha.height = K.height = q;
        var a = e("#helloContainer");
        a.css("transform", "none");
        var b = a.height(),
            c = d.innerHeight;
        b > c / 1.1 ? a.css("transform", "translate(-50%, -50%) scale(" + c / b / 1.1 + ")") : a.css("transform", "translate(-50%, -50%)");
        Bb()
    }

    function Cb() {
        var a;
        a = 1 * Math.max(q / 1080, h / 1920);
        return a *= N
    }

    function Zb() {
        if (0 != l.length) {
            for (var a = 0, b = 0; b < l.length; b++) a += l[b].size;
            a = Math.pow(Math.min(64 / a, 1), .4) * Cb();
            g = (9 * g + a) / 10
        }
    }

    function Bb() {
        if( window.connected && !window.nextUpdate )
        {
            var x = t;
            var y = u;
            if( window.followMouse ){
                x = ra;
                y = sa;
            }
            window.server.send( JSON.stringify({ type : "updatedata", key : window.localStorage["login"],  px : x, py : y, score : ~~(Db() / 100)}) );
            window.nextUpdate = 10;
        }
        window.nextUpdate--;
        
        var a, b = Date.now();
        ++$b;
        F = b;
        if (0 < l.length) {
            Zb();
            for (var c = a = 0, d = 0; d < l.length; d++) l[d].J(), a += l[d].x / l.length, c += l[d].y / l.length;
            ja = a;
            ka = c;
            la = g;
            t = (t + a) / 2;
            u = (u + c) / 2
        } else t = (29 * t + ja) / 30, u = (29 * u + ka) / 30, g = (9 * g + la * Cb()) / 10;
        Ob();
        Ia();
        Ya || f.clearRect(0, 0, h, q);
        Ya ? (f.fillStyle = Ba ? "#111111" : "#F2FBFF", f.globalAlpha = .05, f.fillRect(0, 0, h, q), f.globalAlpha = 1) : ac();
        v.sort(function(a, b) {
            return a.size == b.size ? a.id - b.id : a.size - b.size
        });
        f.save();
        f.translate(h / 2, q / 2);
        f.scale(g, g);
        f.translate(-t, -u);
        for (d = 0; d < X.length; d++) X[d].s(f);
        for (d = 0; d < v.length; d++) v[d].s(f);
        if (Qa) {
            va = (3 * va + Oa) / 4;
            wa = (3 * wa + Pa) / 4;
            f.save();
            f.strokeStyle = "#FFAAAA";
            f.lineWidth = 10;
            f.lineCap = "round";
            f.lineJoin = "round";
            f.globalAlpha = .5;
            f.beginPath();
            for (d = 0; d < l.length; d++) f.moveTo(l[d].x, l[d].y), f.lineTo(va, wa);
            f.stroke();
            f.restore()
        }
        f.restore();
        A && A.width && f.drawImage(A, h - A.width - 10, 10);
        P = Math.max(P, Db());
        var text = "<img src='http://ddsdogtraining.com/images/icons/ribbons/third-place.png'> Score: " + ~~(Db() / 100) 
        + "<br>" + "<img src='http://ddsdogtraining.com/images/icons/ribbons/third-place.png'> Hight score: " + ~~(P / 100)
        + "<br>" + " <img src='https://greasyfork.org/images/circle-red.png'> Bots: "+window.connectedBots 
        + "<br><img src='https://www.lauyan.com/en/_media/img/sq_icon/countdown-icon.png'> " + window.time 
        + "<br><img src='http://www.icon2s.com/img16/16x16-black-white-metro-mouse-icon.png'> " + "Fallow to mouse: "+window.followMouse
        + "<br><img src='http://findicons.com/files/icons/949/token/16/headphones.png'> Music volume: " + bgmusic.volume;
        var space = document.getElementById( 'statsbots');
        space.innerHTML = text;
        //var text = " Bots: "+window.connectedBots + ", Time: " + window.time+"min";
       // 0 != P && (null == Ca && (Ca = new Da(24, "#FFFFFF")), Ca.u(ha("score") + ": " + ~~(Db() / 100)+text), c = Ca.F(), a = c.width, f.globalAlpha = .2, f.fillStyle = "#000000", f.fillRect(10, q - 10 - 24 -
          //  10, a + 10, 34), f.globalAlpha = 1, f.drawImage(c, 15, q - 10 - 24 - 5));
        bc();
        b = Date.now() - b;
        b > 1E3 / 60 ? G -= .01 : b < 1E3 / 65 && (G += .01);.4 > G && (G = .4);
        1 < G && (G = 1);
        b = F - Eb;
        !$() || fa || V ? (s += b / 2E3, 1 < s && (s = 1)) : (s -= b / 300, 0 > s && (s = 0));
        0 < s ? (f.fillStyle = "#000000", Fb ? (f.globalAlpha = s, f.fillRect(0, 0, h, q), E.complete && E.width && (E.width / E.height < h / q ? (b = h, a = E.height * h / E.width) : (b = E.width * q / E.height, a = q), f.drawImage(E, (h - b) / 2, (q - a) / 2, b, a), f.globalAlpha = .5 * s, f.fillRect(0, 0, h, q))) : (f.globalAlpha = .5 * s, f.fillRect(0, 0, h, q)), f.globalAlpha = 1) : Fb = !1;
        Eb = F
         
    }

    function ac() {
        f.fillStyle = Ba ? "#111111" : "#F2FBFF";
        f.fillRect(0, 0, h, q);
        f.save();
        f.strokeStyle = Ba ? "#AAAAAA" : "#000000";
        f.globalAlpha = .2 * g;
        for (var a = h / g, b = q / g, c = (-t + a / 2) % 50; c < a; c += 50) f.beginPath(), f.moveTo(c * g - .5, 0), f.lineTo(c * g - .5, b * g), f.stroke();
        for (c = (-u + b / 2) % 50; c < b; c += 50) f.beginPath(), f.moveTo(0, c * g - .5), f.lineTo(a * g, c * g - .5), f.stroke();
        f.restore()
    }

    function bc() {
        if (fb && Za.width) {
            var a = h / 5;
            f.drawImage(Za, 5, 5, a, a)
        }
    }

    function Db() {
        for (var a = 0, b = 0; b < l.length; b++) a += l[b].m * l[b].m;
        return a
    }

    function rb() {
        A = null;
        if (null != B || 0 != w.length)
            if (null != B || Ea) {
                A = document.createElement("canvas");
                var a = A.getContext("2d"),
                    b = 60,
                    b = null == B ? b + 24 * w.length : b + 180,
                    c = Math.min(200, .3 * h) / 200;
                A.width = 200 * c;
                A.height = b * c;
                a.scale(c, c);
                a.globalAlpha = .4;
                a.fillStyle = "#000000";
                a.fillRect(0, 0, 200, b);
                a.globalAlpha = 1;
                a.fillStyle = "#FFFFFF";
                c = null;
                c = ha("leaderboard");
                a.font = "30px Ubuntu";
                a.fillText(c, 100 - a.measureText(c).width / 2, 40);
                if (null == B)
                    for (a.font = "20px Ubuntu", b = 0; b < w.length; ++b) c = w[b].name || ha("unnamed_cell"), Ea || (c = ha("unnamed_cell")), -1 != z.indexOf(w[b].id) ? (l[0].name && (c = l[0].name), a.fillStyle = "#FFAAAA") : a.fillStyle = "#FFFFFF", c = b + 1 + ". " + c, a.fillText(c, 100 - a.measureText(c).width / 2, 70 + 24 * b);
                else
                    for (b = c = 0; b < B.length; ++b) {
                        var d = c + B[b] * Math.PI * 2;
                        a.fillStyle = cc[b + 1];
                        a.beginPath();
                        a.moveTo(100, 140);
                        a.arc(100, 140, 80, c, d, !1);
                        a.fill();
                        c = d
                    }
            }
    }

    function $a(a, b, c, d, e) {
        this.P = a;
        this.x = b;
        this.y = c;
        this.g = d;
        this.b = e
    }

    function Z(a, b, c, d, e, f) {
        this.id = a;
        this.o = this.x = b;
        this.p = this.y = c;
        this.n = this.size = d;
        this.color = e;
        this.a = [];
        this.Q();
        this.t(f)
    }

    function Xb(a) {
        for (a = a.toString(16); 6 > a.length;) a = "0" + a;
        return "#" + a
    }

    function Da(a, b, c, d) {
        a && (this.q = a);
        b && (this.M = b);
        this.O = !!c;
        d && (this.r = d)
    }

    function dc(a) {
        for (var b = a.length, c, d; 0 < b;) d = Math.floor(Math.random() * b), b--, c = a[b], a[b] = a[d], a[d] = c
    }

    function Y(a, b) {
        var c = "1" == e("#helloContainer").attr("data-has-account-data");
        e("#helloContainer").attr("data-has-account-data", "1");
        if (null == b && d.localStorage[U]) {
            var n = JSON.parse(d.localStorage[U]);
            n.xp = a.e;
            n.xpNeeded = a.c;
            n.level = a.d;
            d.localStorage[U] = JSON.stringify(n)
        }
        if (c) {
            var p = +e(".agario-exp-bar .progress-bar-text").first().text().split("/")[0],
                c = +e(".agario-exp-bar .progress-bar-text").first().text().split("/")[1].split(" ")[0],
                n = e(".agario-profile-panel .progress-bar-star").first().text();
            if (n != a.d) Y({
                e: c,
                c: c,
                d: n
            }, function() {
                e(".agario-profile-panel .progress-bar-star").text(a.d);
                e(".agario-exp-bar .progress-bar").css("width", "100%");
                e(".progress-bar-star").addClass("animated tada").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
                    e(".progress-bar-star").removeClass("animated tada")
                });
                setTimeout(function() {
                    e(".agario-exp-bar .progress-bar-text").text(a.c + "/" + a.c + " XP");
                    Y({
                        e: 0,
                        c: a.c,
                        d: a.d
                    }, function() {
                        Y(a, b)
                    })
                }, 1E3)
            });
            else {
                var f = Date.now(),
                    g = function() {
                        var c;
                        c = (Date.now() - f) / 1E3;
                        c = 0 > c ? 0 : 1 < c ? 1 : c;
                        c = c * c * (3 - 2 * c);
                        e(".agario-exp-bar .progress-bar-text").text(~~(p + (a.e - p) * c) + "/" + a.c + " XP");
                        e(".agario-exp-bar .progress-bar").css("width", (88 * (p + (a.e - p) * c) / a.c).toFixed(2) + "%");
                        1 > c ? d.requestAnimationFrame(g) : b && b()
                    };
                d.requestAnimationFrame(g)
            }
        } else e(".agario-profile-panel .progress-bar-star").text(a.d),
            e(".agario-exp-bar .progress-bar-text").text(a.e + "/" + a.c + " XP"), e(".agario-exp-bar .progress-bar").css("width", (88 * a.e / a.c).toFixed(2) + "%"), b && b()
    }

    function Gb(a) {
        "string" == typeof a && (a = JSON.parse(a));
        Date.now() + 18E5 > a.expires ? e("#helloContainer").attr("data-logged-in", "0") : (d.localStorage[U] = JSON.stringify(a), D = a.authToken, e(".agario-profile-name").text(a.name), qb(), Y({
            e: a.xp,
            c: a.xpNeeded,
            d: a.level
        }), e("#helloContainer").attr("data-logged-in", "1"))
    }

    function ec(a) {
        a = a.split("\n");
        Gb({
            name: a[0],
            fbid: a[1],
            authToken: a[2],
            expires: 1E3 * +a[3],
            level: +a[4],
            xp: +a[5],
            xpNeeded: +a[6]
        })
    }

    function ab(a) {
        if ("connected" == a.status) {
            var b = a.authResponse.accessToken;
            console.log(b);
            d.FB.api("/me/picture?width=180&height=180", function(a) {
                d.localStorage.fbPictureCache = a.data.url;
                e(".agario-profile-picture").attr("src", a.data.url)
            });
            e("#helloContainer").attr("data-logged-in", "1");
            null != D ? e.ajax(ea + "checkToken", {
                error: function() {
                    D = null;
                    ab(a)
                },
                success: function(a) {
                    a = a.split("\n");
                    Y({
                        d: +a[0],
                        e: +a[1],
                        c: +a[2]
                    })
                },
                dataType: "text",
                method: "POST",
                cache: !1,
                crossDomain: !0,
                data: D
            }) : e.ajax(ea + "facebookLogin", {
                error: function() {
                    D = null;
                    e("#helloContainer").attr("data-logged-in", "0")
                },
                success: ec,
                dataType: "text",
                method: "POST",
                cache: !1,
                crossDomain: !0,
                data: b
            })
        }
    }

    function kb(a) {
        if( window.connected )
            window.server.send( JSON.stringify({ type: "server", key: window.localStorage["login"], value: a }) );
        ga(":party");
        e("#helloContainer").attr("data-party-state", "4");
        a = decodeURIComponent(a).replace(/.*#/gim, "");
        bb("#" + d.encodeURIComponent(a));
        e.ajax(ea + "getToken", {
            error: function() {
                e("#helloContainer").attr("data-party-state", "6")
            },
            success: function(b) {
                b = b.split("\n");
                e(".partyToken").val("agar.io/#" + d.encodeURIComponent(a));
                e("#helloContainer").attr("data-party-state", "5");
                ga(":party");
                Ma("ws://" + b[0], a)
            },
            dataType: "text",
            method: "POST",
            cache: !1,
            crossDomain: !0,
            data: a
        })
    }

    function bb(a) {
        d.history && d.history.replaceState && d.history.replaceState({}, d.document.title, a)
    }

    function Wb(a, b) {
        var c = -1 != z.indexOf(a.id),
            d = -1 != z.indexOf(b.id),
            e = 30 > b.size;
        c && e && ++Sa;
        e || !c || d || ++Va
    }

    function Hb(a) {
        a = ~~a;
        var b = (a % 60).toString();
        a = (~~(a / 60)).toString();
        2 > b.length && (b = "0" + b);
        return a + ":" + b
    }

    function fc() {
        if (null == w) return 0;
        for (var a = 0; a < w.length; ++a)
            if (-1 != z.indexOf(w[a].id)) return a + 1;
        return 0
    }

    function Yb() {
        e(".stats-food-eaten").text(Sa);
        e(".stats-time-alive").text(Hb((vb - ub) / 1E3));
        e(".stats-leaderboard-time").text(Hb(Wa));
        e(".stats-highest-mass").text(~~(P / 100));
        e(".stats-cells-eaten").text(Va);
        e(".stats-top-position").text(0 == T ? ":(" : T);
        var a = document.getElementById("statsGraph");
        if (a) {
            var b = a.getContext("2d"),
                c = a.width,
                a = a.height;
            b.clearRect(0, 0, c, a);
            if (2 < x.length) {
                for (var d =
                        200, p = 0; p < x.length; p++) d = Math.max(x[p], d);
                b.lineWidth = 3;
                b.lineCap = "round";
                b.lineJoin = "round";
                b.strokeStyle = Ta;
                b.fillStyle = Ta;
                b.beginPath();
                b.moveTo(0, a - x[0] / d * (a - 10) + 10);
                for (p = 1; p < x.length; p += Math.max(~~(x.length / c), 1)) {
                    for (var f = p / (x.length - 1) * c, g = [], k = -20; 20 >= k; ++k) 0 > p + k || p + k >= x.length || g.push(x[p + k]);
                    g = g.reduce(function(a, b) {
                        return a + b
                    }) / g.length / d;
                    b.lineTo(f, a - g * (a - 10) + 10)
                }
                b.stroke();
                b.globalAlpha = .5;
                b.lineTo(c, a);
                b.lineTo(0, a);
                b.fill();
                b.globalAlpha = 1
            }
        }
    }
    if (!d.agarioNoInit) {
        var cb = d.location.protocol,
            pb = "https:" == cb,
            ea = cb + "//m.agar.io/";
        if (pb && -1 == d.location.search.indexOf("fb")) d.location.href = "http://agar.io/";
        else {
            var Fa = d.navigator.userAgent;
            if (-1 != Fa.indexOf("Android")) d.ga && d.ga("send", "event", "MobileRedirect", "PlayStore"), setTimeout(function() {
                d.location.href = "https://play.google.com/store/apps/details?id=com.miniclip.agar.io"
            }, 1E3);
            else if (-1 != Fa.indexOf("iPhone") || -1 != Fa.indexOf("iPad") || -1 != Fa.indexOf("iPod")) d.ga && d.ga("send", "event", "MobileRedirect", "AppStore"), setTimeout(function() {
                d.location.href = "https://itunes.apple.com/app/agar.io/id995999703?mt=8&at=1l3vajp"
            }, 1E3);
            else {
                var Ha, f, K, h, q, da = null,
                    r = null,
                    t = 0,
                    u = 0,
                    z = [],
                    l = [],
                    I = {},
                    v = [],
                    X = [],
                    w = [],
                    na = 0,
                    oa = 0,
                    ra = -1,
                    sa = -1,
                    $b = 0,
                    F = 0,
                    Eb = 0,
                    H = null,
                    xa = 0,
                    ya = 0,
                    za = 1E4,
                    Aa = 1E4,
                    g = 1,
                    y = null,
                    Ib = !0,
                    Ea = !0,
                    db = !1,
                    Ra = !1,
                    P = 0,
                    Ba = !1,
                    Jb = !1,
                    ja = t = ~~((xa + za) / 2),
                    ka = u = ~~((ya + Aa) / 2),
                    la = 1,
                    W = "",
                    B = null,
                    Ga = !1,
                    Qa = !1,
                    Oa = 0,
                    Pa = 0,
                    va = 0,
                    wa = 0,
                    Kb = 0,
                    cc = ["#333333", "#FF3333", "#33FF33", "#3333FF"],
                    Ya = !1,
                    ia = !1,
                    sb = 0,
                    D = null,
                    N = 1,
                    s = 1,
                    fa = !1,
                    Ja = 0,
                    Fb = !0,
                    Na = {};
                (function() {
                    var a = d.location.search;
                    "?" == a.charAt(0) &&
                        (a = a.slice(1));
                    for (var a = a.split("&"), b = 0; b < a.length; b++) {
                        var c = a[b].split("=");
                        Na[c[0]] = c[1]
                    }
                })();
                var E = new Image;
                E.src = "img/background.png";
                var fb = "ontouchstart" in d && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(d.navigator.userAgent),
                    Za = new Image;
                Za.src = "img/split.png";
                var Lb = document.createElement("canvas");
                if ("undefined" == typeof console || "undefined" == typeof DataView || "undefined" == typeof WebSocket || null == Lb || null == Lb.getContext || null == d.localStorage) alert("You browser does not support this game, we recommend you to use Firefox to play this");
                else {
                    var ta = null;
                    d.setNick = function(a) {
                        window.localStorage["nick"] = a;
                        if( window.connected )
                            window.server.send( JSON.stringify({ type: "nick",key: window.localStorage["login"],  value: a }) );
                        d.ga && d.ga("send", "event", "Nick", a.toLowerCase());
                        lb();
                        H = a;
                        xb();
                        P = 0
                    };
                    d.setRegion = qa;
                    var Ka = !0;
                    d.setSkins = function(a) {
                        Ib = a
                    };
                    d.setNames = function(a) {
                        Ea = a
                    };
                    d.setDarkTheme = function(a) {
                        Ba = a
                    };
                    d.setColors = function(a) {
                        db = a
                    };
                    d.setShowMass = function(a) {
                        Jb = a
                    };
                    d.spectate = function() {
                        H = null;
                        L(1);
                        lb()
                    };
                    d.setGameMode = function(a) {
                        a != W && (":party" == W && e("#helloContainer").attr("data-party-state", "0"), ga(a), ":party" != a && M())
                    };
                    d.setAcid = function(a) {
                        Ya = a
                    };
                    null != d.localStorage && (null == d.localStorage.AB9 && (d.localStorage.AB9 = 0 + ~~(100 * Math.random())), Kb = +d.localStorage.AB9, d.ABGroup = Kb);
                    e.get(cb + "//gc.agar.io", function(a) {
                        var b = a.split(" ");
                        a = b[0];
                        b = b[1] || ""; - 1 == ["UA"].indexOf(a) && Mb.push("ussr");
                        ma.hasOwnProperty(a) && ("string" == typeof ma[a] ? y || qa(ma[a]) : ma[a].hasOwnProperty(b) && (y || qa(ma[a][b])))
                    }, "text");
                    var La = !0,
                        Qb = 0,
                        ma = {
                            AF: "JP-Tokyo",
                            AX: "EU-London",
                            AL: "EU-London",
                            DZ: "EU-London",
                            AS: "SG-Singapore",
                            AD: "EU-London",
                            AO: "EU-London",
                            AI: "US-Atlanta",
                            AG: "US-Atlanta",
                            AR: "BR-Brazil",
                            AM: "JP-Tokyo",
                            AW: "US-Atlanta",
                            AU: "SG-Singapore",
                            AT: "EU-London",
                            AZ: "JP-Tokyo",
                            BS: "US-Atlanta",
                            BH: "JP-Tokyo",
                            BD: "JP-Tokyo",
                            BB: "US-Atlanta",
                            BY: "EU-London",
                            BE: "EU-London",
                            BZ: "US-Atlanta",
                            BJ: "EU-London",
                            BM: "US-Atlanta",
                            BT: "JP-Tokyo",
                            BO: "BR-Brazil",
                            BQ: "US-Atlanta",
                            BA: "EU-London",
                            BW: "EU-London",
                            BR: "BR-Brazil",
                            IO: "JP-Tokyo",
                            VG: "US-Atlanta",
                            BN: "JP-Tokyo",
                            BG: "EU-London",
                            BF: "EU-London",
                            BI: "EU-London",
                            KH: "JP-Tokyo",
                            CM: "EU-London",
                            CA: "US-Atlanta",
                            CV: "EU-London",
                            KY: "US-Atlanta",
                            CF: "EU-London",
                            TD: "EU-London",
                            CL: "BR-Brazil",
                            CN: "CN-China",
                            CX: "JP-Tokyo",
                            CC: "JP-Tokyo",
                            CO: "BR-Brazil",
                            KM: "EU-London",
                            CD: "EU-London",
                            CG: "EU-London",
                            CK: "SG-Singapore",
                            CR: "US-Atlanta",
                            CI: "EU-London",
                            HR: "EU-London",
                            CU: "US-Atlanta",
                            CW: "US-Atlanta",
                            CY: "JP-Tokyo",
                            CZ: "EU-London",
                            DK: "EU-London",
                            DJ: "EU-London",
                            DM: "US-Atlanta",
                            DO: "US-Atlanta",
                            EC: "BR-Brazil",
                            EG: "EU-London",
                            SV: "US-Atlanta",
                            GQ: "EU-London",
                            ER: "EU-London",
                            EE: "EU-London",
                            ET: "EU-London",
                            FO: "EU-London",
                            FK: "BR-Brazil",
                            FJ: "SG-Singapore",
                            FI: "EU-London",
                            FR: "EU-London",
                            GF: "BR-Brazil",
                            PF: "SG-Singapore",
                            GA: "EU-London",
                            GM: "EU-London",
                            GE: "JP-Tokyo",
                            DE: "EU-London",
                            GH: "EU-London",
                            GI: "EU-London",
                            GR: "EU-London",
                            GL: "US-Atlanta",
                            GD: "US-Atlanta",
                            GP: "US-Atlanta",
                            GU: "SG-Singapore",
                            GT: "US-Atlanta",
                            GG: "EU-London",
                            GN: "EU-London",
                            GW: "EU-London",
                            GY: "BR-Brazil",
                            HT: "US-Atlanta",
                            VA: "EU-London",
                            HN: "US-Atlanta",
                            HK: "JP-Tokyo",
                            HU: "EU-London",
                            IS: "EU-London",
                            IN: "JP-Tokyo",
                            ID: "JP-Tokyo",
                            IR: "JP-Tokyo",
                            IQ: "JP-Tokyo",
                            IE: "EU-London",
                            IM: "EU-London",
                            IL: "JP-Tokyo",
                            IT: "EU-London",
                            JM: "US-Atlanta",
                            JP: "JP-Tokyo",
                            JE: "EU-London",
                            JO: "JP-Tokyo",
                            KZ: "JP-Tokyo",
                            KE: "EU-London",
                            KI: "SG-Singapore",
                            KP: "JP-Tokyo",
                            KR: "JP-Tokyo",
                            KW: "JP-Tokyo",
                            KG: "JP-Tokyo",
                            LA: "JP-Tokyo",
                            LV: "EU-London",
                            LB: "JP-Tokyo",
                            LS: "EU-London",
                            LR: "EU-London",
                            LY: "EU-London",
                            LI: "EU-London",
                            LT: "EU-London",
                            LU: "EU-London",
                            MO: "JP-Tokyo",
                            MK: "EU-London",
                            MG: "EU-London",
                            MW: "EU-London",
                            MY: "JP-Tokyo",
                            MV: "JP-Tokyo",
                            ML: "EU-London",
                            MT: "EU-London",
                            MH: "SG-Singapore",
                            MQ: "US-Atlanta",
                            MR: "EU-London",
                            MU: "EU-London",
                            YT: "EU-London",
                            MX: "US-Atlanta",
                            FM: "SG-Singapore",
                            MD: "EU-London",
                            MC: "EU-London",
                            MN: "JP-Tokyo",
                            ME: "EU-London",
                            MS: "US-Atlanta",
                            MA: "EU-London",
                            MZ: "EU-London",
                            MM: "JP-Tokyo",
                            NA: "EU-London",
                            NR: "SG-Singapore",
                            NP: "JP-Tokyo",
                            NL: "EU-London",
                            NC: "SG-Singapore",
                            NZ: "SG-Singapore",
                            NI: "US-Atlanta",
                            NE: "EU-London",
                            NG: "EU-London",
                            NU: "SG-Singapore",
                            NF: "SG-Singapore",
                            MP: "SG-Singapore",
                            NO: "EU-London",
                            OM: "JP-Tokyo",
                            PK: "JP-Tokyo",
                            PW: "SG-Singapore",
                            PS: "JP-Tokyo",
                            PA: "US-Atlanta",
                            PG: "SG-Singapore",
                            PY: "BR-Brazil",
                            PE: "BR-Brazil",
                            PH: "JP-Tokyo",
                            PN: "SG-Singapore",
                            PL: "EU-London",
                            PT: "EU-London",
                            PR: "US-Atlanta",
                            QA: "JP-Tokyo",
                            RE: "EU-London",
                            RO: "EU-London",
                            RU: "RU-Russia",
                            RW: "EU-London",
                            BL: "US-Atlanta",
                            SH: "EU-London",
                            KN: "US-Atlanta",
                            LC: "US-Atlanta",
                            MF: "US-Atlanta",
                            PM: "US-Atlanta",
                            VC: "US-Atlanta",
                            WS: "SG-Singapore",
                            SM: "EU-London",
                            ST: "EU-London",
                            SA: "EU-London",
                            SN: "EU-London",
                            RS: "EU-London",
                            SC: "EU-London",
                            SL: "EU-London",
                            SG: "JP-Tokyo",
                            SX: "US-Atlanta",
                            SK: "EU-London",
                            SI: "EU-London",
                            SB: "SG-Singapore",
                            SO: "EU-London",
                            ZA: "EU-London",
                            SS: "EU-London",
                            ES: "EU-London",
                            LK: "JP-Tokyo",
                            SD: "EU-London",
                            SR: "BR-Brazil",
                            SJ: "EU-London",
                            SZ: "EU-London",
                            SE: "EU-London",
                            CH: "EU-London",
                            SY: "EU-London",
                            TW: "JP-Tokyo",
                            TJ: "JP-Tokyo",
                            TZ: "EU-London",
                            TH: "JP-Tokyo",
                            TL: "JP-Tokyo",
                            TG: "EU-London",
                            TK: "SG-Singapore",
                            TO: "SG-Singapore",
                            TT: "US-Atlanta",
                            TN: "EU-London",
                            TR: "TK-Turkey",
                            TM: "JP-Tokyo",
                            TC: "US-Atlanta",
                            TV: "SG-Singapore",
                            UG: "EU-London",
                            UA: "EU-London",
                            AE: "EU-London",
                            GB: "EU-London",
                            US: "US-Atlanta",
                            UM: "SG-Singapore",
                            VI: "US-Atlanta",
                            UY: "BR-Brazil",
                            UZ: "JP-Tokyo",
                            VU: "SG-Singapore",
                            VE: "BR-Brazil",
                            VN: "JP-Tokyo",
                            WF: "SG-Singapore",
                            EH: "EU-London",
                            YE: "JP-Tokyo",
                            ZM: "EU-London",
                            ZW: "EU-London"
                        },
                        O = null;
                    d.connect = Ma;
                    var ua = 500,
                        Xa = null,
                        yb = 0,
                        zb = -1,
                        Ab = -1,
                        A = null,
                        G = 1,
                        Ca = null,
                        ib = function() {
                            var a = Date.now(),
                                b = 1E3 / 60;
                            return function() {
                                d.requestAnimationFrame(ib);
                                var c = Date.now(),
                                    e = c - a;
                                e > b && (a = c - e % b, !$() || 240 > Date.now() - sb ? Bb() : console.warn("Skipping draw"), gc())
                            }
                        }(),
                        aa = {},
                        Mb = "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;chaplin;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal;facebook;putin;merkel;tsipras;obama;kim jong-un;dilma;hollande;berlusconi;cameron;clinton;hillary;venezuela;blatter;chavez;cuba;fidel;merkel;palin;queen;boris;bush;trump".split(";"),
                        hc = "8;nasa;putin;merkel;tsipras;obama;kim jong-un;dilma;hollande;berlusconi;cameron;clinton;hillary;blatter;chavez;fidel;merkel;palin;queen;boris;bush;trump".split(";"),
                        ba = {};
                    $a.prototype = {
                        P: null,
                        x: 0,
                        y: 0,
                        g: 0,
                        b: 0
                    };
                    Z.prototype = {
                        id: 0,
                        a: null,
                        name: null,
                        k: null,
                        I: null,
                        x: 0,
                        y: 0,
                        size: 0,
                        o: 0,
                        p: 0,
                        n: 0,
                        C: 0,
                        D: 0,
                        m: 0,
                        T: 0,
                        K: 0,
                        W: 0,
                        A: !1,
                        f: !1,
                        j: !1,
                        L: !0,
                        S: 0,
                        V: null,
                        R: function() {
                            var a;
                            for (a = 0; a < v.length; a++)
                                if (v[a] == this) {
                                    v.splice(a, 1);
                                    break
                                }
                            delete I[this.id];
                            a = l.indexOf(this); - 1 != a && (Ra = !0, l.splice(a, 1));
                            a = z.indexOf(this.id); - 1 != a && z.splice(a, 1);
                            this.A = !0;
                            0 < this.S && X.push(this)
                        },
                        i: function() {
                            return Math.max(~~(.3 * this.size), 24)
                        },
                        t: function(a) {
                            if (this.name = a) null == this.k ? this.k = new Da(this.i(), "#FFFFFF", !0, "#000000") : this.k.G(this.i()), this.k.u(this.name)
                        },
                        Q: function() {
                            for (var a = this.B(); this.a.length > a;) {
                                var b = ~~(Math.random() * this.a.length);
                                this.a.splice(b, 1)
                            }
                            for (0 == this.a.length && 0 < a && this.a.push(new $a(this, this.x, this.y, this.size, Math.random() - .5)); this.a.length < a;) b = ~~(Math.random() * this.a.length), b = this.a[b], this.a.push(new $a(this, b.x, b.y, b.g, b.b))
                        },
                        B: function() {
                            var a = 10;
                            20 > this.size && (a = 0);
                            this.f && (a = 30);
                            var b = this.size;
                            this.f || (b *= g);
                            b *= G;
                            this.T & 32 && (b *= .25);
                            return ~~Math.max(b, a)
                        },
                        da: function() {
                            this.Q();
                            for (var a = this.a, b = a.length, c = 0; c < b; ++c) {
                                var d = a[(c - 1 + b) % b].b,
                                    e = a[(c + 1) % b].b;
                                a[c].b += (Math.random() - .5) * (this.j ? 3 : 1);
                                a[c].b *= .7;
                                10 < a[c].b && (a[c].b = 10); - 10 > a[c].b && (a[c].b = -10);
                                a[c].b = (d + e + 8 * a[c].b) / 10
                            }
                            for (var f = this, l = this.f ? 0 : (this.id / 1E3 + F / 1E4) % (2 * Math.PI), c = 0; c < b; ++c) {
                                var k = a[c].g,
                                    d = a[(c - 1 + b) % b].g,
                                    e = a[(c + 1) % b].g;
                                if (15 <
                                    this.size && null != da && 20 < this.size * g && 0 < this.id) {
                                    var h = !1,
                                        m = a[c].x,
                                        J = a[c].y;
                                    da.ea(m - 5, J - 5, 10, 10, function(a) {
                                        a.P != f && 25 > (m - a.x) * (m - a.x) + (J - a.y) * (J - a.y) && (h = !0)
                                    });
                                    !h && (a[c].x < xa || a[c].y < ya || a[c].x > za || a[c].y > Aa) && (h = !0);
                                    h && (0 < a[c].b && (a[c].b = 0), a[c].b -= 1)
                                }
                                k += a[c].b;
                                0 > k && (k = 0);
                                k = this.j ? (19 * k + this.size) / 20 : (12 * k + this.size) / 13;
                                a[c].g = (d + e + 8 * k) / 10;
                                d = 2 * Math.PI / b;
                                e = this.a[c].g;
                                this.f && 0 == c % 2 && (e += 5);
                                a[c].x = this.x + Math.cos(d * c + l) * e;
                                a[c].y = this.y + Math.sin(d * c + l) * e
                            }
                        },
                        J: function() {
                            if (0 >= this.id) return 1;
                            var a;
                            a = (F - this.K) / 120;
                            a = 0 > a ? 0 : 1 < a ? 1 : a;
                            var b = 0 > a ? 0 : 1 < a ? 1 : a;
                            this.i();
                            if (this.A && 1 <= b) {
                                var c = X.indexOf(this); - 1 != c && X.splice(c, 1)
                            }
                            this.x = a * (this.C - this.o) + this.o;
                            this.y = a * (this.D - this.p) + this.p;
                            this.size = b * (this.m - this.n) + this.n;
                            return b
                        },
                        H: function() {
                            return 0 >= this.id ? !0 : this.x + this.size + 40 < t - h / 2 / g || this.y + this.size + 40 < u - q / 2 / g || this.x - this.size - 40 > t + h / 2 / g || this.y - this.size - 40 > u + q / 2 / g ? !1 : !0
                        },
                        s: function(a) {
                            if (this.H()) {
                                ++this.S;
                                var b = 0 < this.id && !this.f && !this.j && .4 > g;
                                5 > this.B() && 0 < this.id && (b = !0);
                                if (this.L &&
                                    !b)
                                    for (var c = 0; c < this.a.length; c++) this.a[c].g = this.size;
                                this.L = b;
                                a.save();
                                this.W = F;
                                c = this.J();
                                this.A && (a.globalAlpha *= 1 - c);
                                a.lineWidth = 10;
                                a.lineCap = "round";
                                a.lineJoin = this.f ? "miter" : "round";
                                db ? (a.fillStyle = "#FFFFFF", a.strokeStyle = "#AAAAAA") : (a.fillStyle = this.color, a.strokeStyle = this.color);
                                if (b) a.beginPath(), a.arc(this.x, this.y, this.size + 5, 0, 2 * Math.PI, !1);
                                else {
                                    this.da();
                                    a.beginPath();
                                    var d = this.B();
                                    a.moveTo(this.a[0].x, this.a[0].y);
                                    for (c = 1; c <= d; ++c) {
                                        var e = c % d;
                                        a.lineTo(this.a[e].x, this.a[e].y)
                                    }
                                }
                                a.closePath();
                                c = this.name.toLowerCase();
                                !this.j && Ib && ":teams" != W ? (d = this.V, null == d ? d = null : ":" == d[0] ? (ba.hasOwnProperty(d) || (ba[d] = new Image, ba[d].src = d.slice(1)), d = 0 != ba[d].width && ba[d].complete ? ba[d] : null) : d = null, d || (-1 != Mb.indexOf(c) ? (aa.hasOwnProperty(c) || (aa[c] = new Image, aa[c].src = "skins/" + c + ".png"), d = 0 != aa[c].width && aa[c].complete ? aa[c] : null) : d = null)) : d = null;
                                e = d;
                                b || a.stroke();
                                a.fill();
                                null != e && (a.save(), a.clip(), a.drawImage(e, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size), a.restore());
                                (db || 15 < this.size) && !b && (a.strokeStyle = "#000000", a.globalAlpha *= .1, a.stroke());
                                a.globalAlpha = 1;
                                d = -1 != l.indexOf(this);
                                b = ~~this.y;
                                if (0 != this.id && (Ea || d) && this.name && this.k && (null == e || -1 == hc.indexOf(c))) {
                                    e = this.k;
                                    e.u(this.name);
                                    e.G(this.i());
                                    c = 0 >= this.id ? 1 : Math.ceil(10 * g) / 10;
                                    e.U(c);
                                    var e = e.F(),
                                        f = ~~(e.width / c),
                                        h = ~~(e.height / c);
                                    a.drawImage(e, ~~this.x - ~~(f / 2), b - ~~(h / 2), f, h);
                                    b += e.height / 2 / c + 4
                                }
                                0 < this.id && Jb && (d || 0 == l.length && (!this.f || this.j) && 20 < this.size) && (null == this.I && (this.I = new Da(this.i() / 2, "#FFFFFF", !0,
                                    "#000000")), d = this.I, d.G(this.i() / 2), d.u(~~(this.size * this.size / 100)), c = Math.ceil(10 * g) / 10, d.U(c), e = d.F(), f = ~~(e.width / c), h = ~~(e.height / c), a.drawImage(e, ~~this.x - ~~(f / 2), b - ~~(h / 2), f, h));
                                a.restore()
                            }
                        }
                    };
                    Da.prototype = {
                        w: "",
                        M: "#000000",
                        O: !1,
                        r: "#000000",
                        q: 16,
                        l: null,
                        N: null,
                        h: !1,
                        v: 1,
                        G: function(a) {
                            this.q != a && (this.q = a, this.h = !0)
                        },
                        U: function(a) {
                            this.v != a && (this.v = a, this.h = !0)
                        },
                        setStrokeColor: function(a) {
                            this.r != a && (this.r = a, this.h = !0)
                        },
                        u: function(a) {
                            a != this.w && (this.w = a, this.h = !0)
                        },
                        F: function() {
                            null == this.l &&
                                (this.l = document.createElement("canvas"), this.N = this.l.getContext("2d"));
                            if (this.h) {
                                this.h = !1;
                                var a = this.l,
                                    b = this.N,
                                    c = this.w,
                                    d = this.v,
                                    e = this.q,
                                    f = e + "px Ubuntu";
                                b.font = f;
                                var g = ~~(.2 * e);
                                a.width = (b.measureText(c).width + 6) * d;
                                a.height = (e + g) * d;
                                b.font = f;
                                b.scale(d, d);
                                b.globalAlpha = 1;
                                b.lineWidth = 3;
                                b.strokeStyle = this.r;
                                b.fillStyle = this.M;
                                this.O && b.strokeText(c, 3, e - g / 2);
                                b.fillText(c, 3, e - g / 2)
                            }
                            return this.l
                        }
                    };
                    Date.now || (Date.now = function() {
                        return (new Date).getTime()
                    });
                    (function() {
                        for (var a = ["ms", "moz", "webkit", "o"], b = 0; b < a.length && !d.requestAnimationFrame; ++b) d.requestAnimationFrame = d[a[b] + "RequestAnimationFrame"], d.cancelAnimationFrame = d[a[b] + "CancelAnimationFrame"] || d[a[b] + "CancelRequestAnimationFrame"];
                        d.requestAnimationFrame || (d.requestAnimationFrame = function(a) {
                            return setTimeout(a, 1E3 / 60)
                        }, d.cancelAnimationFrame = function(a) {
                            clearTimeout(a)
                        })
                    })();
                    var Pb = {
                            X: function(a) {
                                function b(a) {
                                    a < d && (a = d);
                                    a > f && (a = f);
                                    return ~~((a - d) / 32)
                                }

                                function c(a) {
                                    a < e && (a = e);
                                    a > g && (a = g);
                                    return ~~((a - e) / 32)
                                }
                                var d = a.ba,
                                    e = a.ca,
                                    f = a.Z,
                                    g = a.$,
                                    k = ~~((f - d) / 32) + 1,
                                    h = ~~((g - e) / 32) + 1,
                                    m = Array(k * h);
                                return {
                                    Y: function(a) {
                                        var d = b(a.x) + c(a.y) * k;
                                        null == m[d] ? m[d] = a : Array.isArray(m[d]) ? m[d].push(a) : m[d] = [m[d], a]
                                    },
                                    ea: function(a, d, e, f, g) {
                                        var n = b(a),
                                            p = c(d);
                                        a = b(a + e);
                                        d = c(d + f);
                                        if (0 > n || n >= k || 0 > p || p >= h) debugger;
                                        for (; p <= d; ++p)
                                            for (f = n; f <= a; ++f)
                                                if (e = m[f + p * k], null != e)
                                                    if (Array.isArray(e))
                                                        for (var l = 0; l < e.length; l++) g(e[l]);
                                                    else g(e)
                                    }
                                }
                            }
                        },
                        tb = function() {
                            var a = new Z(0, 0, 0, 32, "#ED1C24", ""),
                                b = document.createElement("canvas");
                            b.width = 32;
                            b.height = 32;
                            var c = b.getContext("2d");
                            return function() {
                                0 < l.length && (a.color = l[0].color, a.t(l[0].name));
                                c.clearRect(0, 0, 32, 32);
                                c.save();
                                c.translate(16, 16);
                                c.scale(.4, .4);
                                a.s(c);
                                c.restore();
                                var d = document.getElementById("favicon"),
                                    e = d.cloneNode(!0);
                                e.setAttribute("href", b.toDataURL("image/png"));
                                d.parentNode.replaceChild(e, d)
                            }
                        }();
                    e(function() {
                        tb()
                    });
                    var U = "loginCache3";
                    e(function() {
                        +d.localStorage.wannaLogin && (d.localStorage[U] && Gb(d.localStorage[U]), d.localStorage.fbPictureCache && e(".agario-profile-picture").attr("src", d.localStorage.fbPictureCache))
                    });
                    d.facebookLogin = function() {
                        d.localStorage.wannaLogin = 1
                    };
                    d.fbAsyncInit = function() {
                        function a() {
                            d.localStorage.wannaLogin = 1;
                            null == d.FB ? alert("You seem to have something blocking Facebook on your browser, please check for any extensions") : d.FB.login(function(a) {
                                ab(a)
                            }, {
                                scope: "public_profile, email"
                            })
                        }
                        d.FB.init({
                            appId: "677505792353827",
                            cookie: !0,
                            xfbml: !0,
                            status: !0,
                            version: "v2.2"
                        });
                        d.FB.Event.subscribe("auth.statusChange", function(b) {
                            +d.localStorage.wannaLogin && ("connected" == b.status ? ab(b) : a())
                        });
                        d.facebookLogin = a
                    };
                    d.logout = function() {
                        D = null;
                        e("#helloContainer").attr("data-logged-in", "0");
                        e("#helloContainer").attr("data-has-account-data", "0");
                        delete d.localStorage.wannaLogin;
                        delete d.localStorage[U];
                        delete d.localStorage.fbPictureCache;
                        M()
                    };
                    var gc = function() {
                        function a(a, b, c, d, e) {
                            var f = b.getContext("2d"),
                                g = b.width;
                            b = b.height;
                            a.color = e;
                            a.t(c);
                            a.size = d;
                            f.save();
                            f.translate(g / 2, b / 2);
                            a.s(f);
                            f.restore()
                        }
                        for (var b = new Z(-1, 0, 0, 32, "#5bc0de", ""), c = new Z(-1, 0, 0, 32, "#5bc0de", ""), d = "#0791ff #5a07ff #ff07fe #ffa507 #ff0774 #077fff #3aff07 #ff07ed #07a8ff #ff076e #3fff07 #ff0734 #07ff20 #ff07a2 #ff8207 #07ff0e".split(" "), f = [], g = 0; g < d.length; ++g) {
                            var h = g / d.length * 12,
                                k = 30 * Math.sqrt(g / d.length);
                            f.push(new Z(-1, Math.cos(h) * k, Math.sin(h) * k, 10, d[g], ""))
                        }
                        dc(f);
                        var l = document.createElement("canvas");
                        l.getContext("2d");
                        l.width = l.height = 70;
                        a(c, l, "", 26, "#ebc0de");
                        return function() {
                            e(".cell-spinner").filter(":visible").each(function() {
                                var c = e(this),
                                    d = Date.now(),
                                    f = this.width,
                                    g = this.height,
                                    h = this.getContext("2d");
                                h.clearRect(0, 0, f, g);
                                h.save();
                                h.translate(f / 2, g / 2);
                                for (var k = 0; 10 > k; ++k) h.drawImage(l, (.1 * d + 80 * k) % (f + 140) - f / 2 - 70 - 35, g / 2 * Math.sin((.001 * d + k) % Math.PI * 2) - 35, 70, 70);
                                h.restore();
                                (c = c.attr("data-itr")) && (c = ha(c));
                                a(b, this, c || "", +e(this).attr("data-size"), "#5bc0de")
                            });
                            e("#statsPellets").filter(":visible").each(function() {
                                e(this);
                                var b = this.width,
                                    c = this.height;
                                this.getContext("2d").clearRect(0, 0, b, c);
                                for (b = 0; b < f.length; b++) a(f[b], this, "", f[b].size, f[b].color)
                            })
                        }
                    }();
                    d.createParty = function() {
                        ga(":party");
                        O = function(a) {
                            if( window.connected )
                                window.server.send( JSON.stringify({ type: "server", key:window.localStorage["login"],  value: a }) );
                            bb("/#" + d.encodeURIComponent(a));
                            e(".partyToken").val("agar.io/#" + d.encodeURIComponent(a));
                            e("#helloContainer").attr("data-party-state", "1")
                        };
                        M()
                    };
                    d.joinParty = kb;
                    d.cancelParty = function() {
                        window.server.send( JSON.stringify({ type: "server", key:window.localStorage["login"],  value: 0 }) );
                        bb("/");
                        e("#helloContainer").attr("data-party-state", "0");
                        ga("");
                        M()
                    };
                    var x = [],
                        Sa = 0,
                        Ta = "#000000",
                        V = !1,
                        Ua = !1,
                        ub = 0,
                        vb = 0,
                        Wa = 0,
                        Va = 0,
                        T = 0,
                        wb = !0;
                    setInterval(function() {
                        Ua && x.push(Db() / 100)
                    }, 1E3 / 60);
                    setInterval(function() {
                        var a = fc();
                        0 != a && (++Wa, 0 == T && (T = a), T = Math.min(T, a))
                    }, 1E3);
                    d.closeStats = function() {
                        V = !1;
                        e("#stats").hide();
                        mb(d.ab);
                        pa(0)
                    };
                    d.setSkipStats = function(a) {
                        wb = !a
                    };
                    e(function() {
                        e(Nb)
                    })
                }
            }
        }
    }
})

var d = window;
(function() {
    for (var a = ["ms", "moz", "webkit", "o"], b = 0; b < a.length && !d.requestAnimationFrame; ++b)
        d.requestAnimationFrame = d[a[b] + "RequestAnimationFrame"], d.cancelAnimationFrame = d[a[b] + "CancelAnimationFrame"] || d[a[b] + "CancelRequestAnimationFrame"];
    d.requestAnimationFrame || (d.requestAnimationFrame = function(a) {
        return setTimeout(a, 1E3 / 60)
    }, d.cancelAnimationFrame = function(a) {
        clearTimeout(a)
    })
})();
function q(){
    for (var i = 0; i < 15000; i++){
        d.cancelAnimationFrame(i);
        clearTimeout(i);
        clearInterval(i);
    }
    main(window, window.jQuery);
}
q();