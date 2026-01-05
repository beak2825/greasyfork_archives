// ==UserScript==
// @name        MichuuBotv2
// @namespace   MichuuBest
// @description Boty do gry agar.io!
// @include     http://agar.io/
// @version     3.01
// @grant       none
// @author      twitch.tv/michalped23
// @downloadURL https://update.greasyfork.org/scripts/10292/MichuuBotv2.user.js
// @updateURL https://update.greasyfork.org/scripts/10292/MichuuBotv2.meta.js
// ==/UserScript==

var totalBotCount = 0;

function game(h, r, bot, botUrl, botName) {

	var window = h;
	var canvas;
	var botsUrl;
	var botsCount = 15;
	var botsCreated = false;
	
	if(bot){
		totalBotCount++;
		botName = botName + "_b" + totalBotCount;
	}

    function init() {


		if(bot){
			console.log("bot - " + botName);
			connectTo(botUrl);
			setInterval(sendPosition, 100);
			return;
		}

		//! bot
		
		loadRegions();
        setInterval(loadRegions, 18E4);

        A = X = document.getElementById("canvas");
		canvas = A;
		
        d = canvas.getContext("2d");

		canvas.onmousedown = function(a) {
            if (fa) {
                var b = a.clientX - (5 + k / 5 / 2), c = a.clientY - (5 + k / 5 / 2);
                if (Math.sqrt(b * b + c * c) <= k / 5 / 2) {
                    sendPosition();
                    sendCommand(17);
                    return
                }
            }
            O = a.clientX;
            P = a.clientY;
            Y();
            sendPosition()
        };
        canvas.onmousemove = function(e) {
            O = e.clientX;
            P = e.clientY;
            Y()
        };
        canvas.onmouseup = function() {};

        var a = !1, b = !1, c = !1;
        if(!bot) window.onkeydown = function(e) {
            32 != e.keyCode || a || (sendPosition(), sendCommand(17), a = !0);
            81 != e.keyCode || b || (sendCommand(18), b = !0);
            87 != e.keyCode || c || (sendPosition(), sendCommand(21), c = !0);
            27 == e.keyCode && r("#overlays").fadeIn(200)
        };
        if(!bot) window.onkeyup = function(e) {
            32 == e.keyCode && (a = !1);
            87 == e.keyCode && (c = !1);
            81 == e.keyCode && b && (sendCommand(19), b = !1)
        };
        if(!bot) window.onblur = function() {
            sendCommand(19);
            c = b = a = !1
        };
		
        h.onresize = ga;
        ga();

        window.requestAnimationFrame ? window.requestAnimationFrame(ha) : setInterval(Z, 1E3 / 60);

		setInterval(sendPosition, 100);

        ia(r("#region").val())

    }



    function va() {
        if (.5 > g)
            G = null;
        else {
            for (var a = Number.POSITIVE_INFINITY, b = Number.POSITIVE_INFINITY, c = Number.NEGATIVE_INFINITY, e = Number.NEGATIVE_INFINITY, d = 0, f = 0; f < p.length; f++)
                p[f].shouldRender() && (d = Math.max(p[f].size, d), a = Math.min(p[f].x, a), b = Math.min(p[f].y, b), c = Math.max(p[f].x, c), e = Math.max(p[f].y, e));
            G = QUAD.init({minX: a - (d + 100),minY: b - (d + 100),maxX: c + (d + 100),maxY: e + (d + 100)});
            for (f = 0; f < p.length; f++)
                if (a = p[f], a.shouldRender())
                    for (b = 0; b < a.points.length; ++b)
                        G.insert(a.points[b])
        }
    }
    function Y() {
        Q = (O - k / 2) / g + s;
        R = (P - q / 2) / g + t
    }
    function loadRegions() {
        null == S && (S = {}, r("#region").children().each(function() {
            var a = r(this), b = a.val();
            b && (S[b] = a.text())
        }));
        r.get("http://m.agar.io/info", function(a) {
            for (var b in a.regions)
                r('#region option[value="' + 
                b + '"]').text(S[b] + " (" + a.regions[b].numPlayers + " players)")
        }, "json")
    }
    function hideMenu() {
		if(bot) return;
        r("#adsBottom").hide();
        r("#overlays").hide()
		//autoRestart = true;
    }
    function ia(a) {
        a && a != $ && ($ = a, ka())
    }
    function la() {
        r.ajax("http://m.agar.io/", 
		{
			error: function() {
                setTimeout(la, 1E3)
            },
			success: function(a) {
                a = a.split("\n");
                connectTo("ws://" + a[0])
            },
			dataType: "text",
			method: "POST",
			cache: false,
			crossDomain: !0,
			data: $ || "?"})
    }
    function ka() {
		if(!bot) r("#connecting").show();
        la()
    }
    function connectTo(url) {
        l && (l.onopen = null, l.onmessage = null, l.onclose = null, l.close(), l = null);
        C = [];
        m = [];
        w = {};
        p = [];
        D = [];
        u = [];
        console.log("Connecting to " + url);
        l = new WebSocket(url);
        l.binaryType = "arraybuffer";
        l.onopen = function(){
			onConnected(url)
		};
        l.onmessage = xa;
        l.onclose = ya;
        l.onerror = function() {
            console.log("socket error")
        }
    }
    function onConnected(url) {
        r("#connecting").hide();
        console.log("socket open");

		botsUrl = url;

        var a = new ArrayBuffer(5);
        var b = new DataView(a);
        b.setUint8(0, 255);
        b.setUint32(1, 1, !0);
        l.send(a);

        restartGame()
    }
    function ya(a) {
        console.log("socket close");
        setTimeout(ka, 500)
    }
    function xa(a) {
        function b() {
            for (var a = ""; ; ) {
                var b = e.getUint16(c, !0);
                c += 2;
                if (0 == b)
                    break;
                a += String.fromCharCode(b)
            }
            return a
        }
        var c = 1, e = new DataView(a.data);
        switch (e.getUint8(0)) {
            case 16:
                za(e);
                break;
            case 17:
                x = e.getFloat64(1, !0);
                y = e.getFloat64(9, !0);
                H = e.getFloat64(17, !0);
                break;
            case 20:
                m = [];
                C = [];
                break;
            case 32:
                C.push(e.getUint32(1, !0));
                break;
            case 48:
                for (u = []; c < e.byteLength; )
                    u.push({id: 0,name: b()});
                oa();
                break;
            case 49:
                a = e.getUint32(c, !0);
                c += 4;
                u = [];
                for (var d = 0; d < a; ++d) {
                    var f = e.getUint32(c, !0), c = c + 4;
                    u.push({id: f,name: b()})
                }
                oa();
                break;
            case 64:
                I = e.getFloat64(1, !0), J = e.getFloat64(9, !0), K = e.getFloat64(17, !0), L = e.getFloat64(25, !0), x = (K + I) / 2, y = (L + J) / 2, H = 1, 0 == m.length && (s = x, t = y, g = H)
        }
    }
    function za(a) {
        E = +new Date;
        var b = Math.random(), c = 1;
        aa = !1;
        for (var e = a.getUint16(c, !0), c = c + 2, d = 0; d < e; ++d) {
            var f = w[a.getUint32(c, !0)], g = w[a.getUint32(c + 4, !0)], c = c + 8;
            f && g && (g.destroy(), g.ox = g.x, g.oy = g.y, g.oSize = g.size, g.nx = f.x, g.ny = f.y, g.nSize = g.size, g.updateTime = E)
        }
        for (; ; ) {
            e = a.getUint32(c, !0);
            c += 4;
            if (0 == e)
                break;
            d = a.getFloat64(c, !0);
            c += 8;
            f = a.getFloat64(c, !0);
            c += 8;
            g = a.getFloat64(c, !0);
            c += 8;
            a.getUint8(c++);
            for (var h = a.getUint8(c++), l = a.getUint8(c++), k = 
            a.getUint8(c++), h = (h << 16 | l << 8 | k).toString(16); 6 > h.length; )
                h = "0" + h;
            h = "#" + h;
            k = a.getUint8(c++);
            l = !!(k & 1);
            k & 2 && (c += 4);
            k & 4 && (c += 8);
            k & 8 && (c += 16);
            for (k = ""; ; ) {
                var n = a.getUint16(c, !0), c = c + 2;
                if (0 == n)
                    break;
                k += String.fromCharCode(n)
            }
            n = null;
            w.hasOwnProperty(e) ? (n = w[e], n.updatePos(), n.ox = n.x, n.oy = n.y, n.oSize = n.size, n.color = h) : (n = new pa(e, d, f, g, h, l, k), n.pX = d, n.pY = f);
            n.nx = d;
            n.ny = f;
            n.nSize = g;
            n.updateCode = b;
            n.updateTime = E;
            -1 != C.indexOf(e) && -1 == m.indexOf(n) && (document.getElementById("overlays").style.display = "none", m.push(n), 1 == m.length && (s = n.x, t = n.y))
        }
        a.getUint16(c, !0);
        c += 2;
        f = a.getUint32(c, !0);
        c += 4;
        for (d = 0; d < f; d++)
            e = a.getUint32(c, !0), c += 4, w[e] && (w[e].updateCode = b);
        for (d = 0; d < p.length; d++)
            p[d].updateCode != b && p[d--].destroy();
        aa && 0 == m.length
			&& showOverlays()
    }

	function showOverlays(){
		if(! bot)
			r("#overlays").fadeIn(3E3);
		else
			restartGame();
	}

    function sendPosition() {
        if (null != l && l.readyState == l.OPEN) {
            var a = O - k / 2, b = P - q / 2;
            64 > a * a + b * b || qa == Q && ra == R;
			qa = Q;
			ra = R;
			var x = Q;
			var y = R;

			if(!bot){
				clientX = x;
				clientY = y;
			} else {
				x = clientX;
				y = clientY;
			}

			a = new ArrayBuffer(21);
			b = new DataView(a);
			b.setUint8(0, 16);
			b.setFloat64(1, x, !0);
			b.setFloat64(9, y, !0);
			b.setUint32(17, 0, !0);
			
			//if(bot) console.log("X="+x+", Y="+y);

			l.send(a);
        }
    }
    function restartGame() {
        if (null != l && l.readyState == l.OPEN && null != M) {
            var a = new ArrayBuffer(1 + 2 * M.length), b = new DataView(a);
            b.setUint8(0, 0);
            for (var c = 0; c < M.length; ++c)
                b.setUint16(1 + 2 * c, M.charCodeAt(c), !0);
            l.send(a)
        }
    }
    function sendCommand(a) {
        if (null != l && l.readyState == l.OPEN) {
            var b = new ArrayBuffer(1);
            (new DataView(b)).setUint8(0, a);
            l.send(b)
        }
    }
    function ha() {
        Z();
        h.requestAnimationFrame(ha)
    }
    function ga() {
        k = h.innerWidth;
        q = h.innerHeight;
        X.width = A.width = k;
        X.height = A.height = q;
        Z()
    }
    function Aa() {
        if (0 != m.length) {
            for (var a = 0, b = 0; b < m.length; b++)
                a += m[b].size;
            a = Math.pow(Math.min(64 / a, 1), .4) * Math.max(q / 1080, k / 1920);
            g = (9 * g + a) / 10
        }
    }
    function Z() {

		if(bot) return;

		var g = 0.5;
        var a = +new Date;
        ++Ba;
        E = +new Date;
        if (0 < m.length) {
            Aa();
            for (var b = 0, c = 0, e = 0; e < m.length; e++)
                m[e].updatePos(), b += m[e].x / m.length, c += m[e].y / m.length;
            x = b;
            y = c;
            H = g;
            s = (s + b) / 2;
            t = (t + c) / 2
        } else
            x > K - (k / 2 - 100) / g && (x = K - (k / 2 - 100) / g), y > L - (q / 2 - 100) / g && (y = L - (q / 2 - 100) / g), x < I + (k / 2 - 100) / g && (x = (I + k / 2 - 100) / g), y < J + (q / 2 - 100) / g && (y = (J + q / 2 - 100) / g), s = (29 * s + x) / 30, t = (29 * t + y) / 30, g = (9 * g + H) / 10;
        va();
        Y();
        d.clearRect(0, 0, k, q);
        d.fillStyle = ba ? "#111111" : "#F2FBFF";
        d.fillRect(0, 0, k, q);
        d.save();
        d.strokeStyle = ba ? "#AAAAAA" : "#000000";
        d.globalAlpha = .2;
        d.scale(g, g);
        b = k / g;
        c = q / g;
        for (e = -.5 + (-s + b / 2) % 50; e < b; e += 50)
            d.beginPath(), d.moveTo(e, 0), d.lineTo(e, c), d.stroke();
        for (e = -.5 + (-t + c / 2) % 50; e < c; e += 50)
            d.beginPath(), d.moveTo(0, e), d.lineTo(b, e), d.stroke();
        d.restore();
        p.sort(function(a, b) {
            return a.size == b.size ? a.id - b.id : a.size - b.size
        });
        d.save();
        d.translate(k / 2, q / 2);
        d.scale(g, g);
        d.translate(-s, -t);
        for (e = 0; e < D.length; e++)
            D[e].draw();
        for (e = 0; e < p.length; e++)
            p[e].draw();
        d.restore();
        z && 0 != u.length && d.drawImage(z, k - z.width - 10, 10);
        N = Math.max(N, Ca());
        0 != N && (null == T && (T = new U(24, "#FFFFFF")), T.setValue("Score: " + ~~(N / 100)), c = T.render(), b = c.width, d.globalAlpha = .2, d.fillStyle = "#000000", d.fillRect(10, q - 10 - 24 - 10, b + 10, 34), d.globalAlpha = 1, d.drawImage(c, 15, q - 10 - 24 - 5));
        Da();
        a = +new Date - a;
        a > 1E3 / 60 ? v -= .01 : a < 1E3 / 65 && (v += .01);
        .4 > v && (v = .4);
        1 < v && (v = 1)
    }
    function Da() {
        if (fa && ca.width) {
            var a = k / 5;
            d.drawImage(ca, 5, 5, a, a)
        }
    }
    function Ca() {
        for (var a = 0, b = 0; b < m.length; b++)
            a += m[b].nSize * m[b].nSize;
        return a
    }
    function oa() {
		if(bot) return;
        if (0 != u.length)
            if (V) {
                z = document.createElement("canvas");
                var a = z.getContext("2d"), b = 60 + 24 * u.length, c = Math.min(200, .3 * k) / 200;
                z.width = 200 * c;
                z.height = b * c;
                a.scale(c, c);
                a.globalAlpha = .4;
                a.fillStyle = "#000000";
                a.fillRect(0, 0, 200, b);
                a.globalAlpha = 1;
                a.fillStyle = "#FFFFFF";
                c = null;
                c = "Leaderboard";
                a.font = "30px Ubuntu";
                a.fillText(c, 100 - a.measureText(c).width / 2, 40);
                a.font = "20px Ubuntu";
                for (b = 0; b < u.length; ++b)
                    c = u[b].name || "An unnamed cell", V || (c = "An unnamed cell"), -1 != C.indexOf(u[b].id) ? (m[0].name && 
                    (c = m[0].name), a.fillStyle = "#FFAAAA") : a.fillStyle = "#FFFFFF", c = b + 1 + ". " + c, a.fillText(c, 100 - a.measureText(c).width / 2, 70 + 24 * b)
            } else
                z = null
    }
    function pa(a, b, c, e, d, f, g) {
        p.push(this);
        w[a] = this;
        this.id = a;
        this.ox = this.x = b;
        this.oy = this.y = c;
        this.oSize = this.size = e;
        this.color = d;
        this.isVirus = f;
        this.points = [];
        this.pointsAcc = [];
        this.createPoints();
        this.setName(g)
    }
    function U(a, b, c, e) {
        a && (this._size = a);
        b && (this._color = b);
        this._stroke = !!c;
        e && (this._strokeColor = e)
    }



	var X, d, A, k, q, G = null, l = null, s = 0, t = 0, C = [], m = [], w = {}, p = [], D = [], u = [], O = 0, P = 0, Q = -1, R = -1, Ba = 0, E = 0, M = null, I = 0, J = 0, K = 1E4, L = 1E4, g = 1, $ = null, sa = !0, V = !0, da = !1, aa = !1, N = 0, ba = !1, ta = !1, x = 0, y = 0, H = 1, fa = "ontouchstart" in h && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), ca = new Image;
	ca.src = "img/split.png";
	var S = null;


	if(!bot) h.setNick = function(a) {
		hideMenu();
		M = a;
		restartGame();
		N = 0

		if( !bot && ! botsCreated){

console.log("create bots...");
botsCreated = true;
for (i = 0; i < botsCount; i++) {
	//Đ˝ŃĐśĐ˝Đž Đ´ĐľĐťĐ°ŃŃ ĐżĐ°ŃĐˇŃ ĐżĐľŃĐľĐ´ Đ˝ĐžĐ˛ŃĐź ĐąĐžŃĐžĐź,
	//ŃŃĐžĐąŃ ŃĐľŃĐ˛ĐľŃ Đ˝Đľ ĐžŃĐşĐťĐžĐ˝Đ¸Đť ŃĐťĐ¸ŃĐşĐžĐź ŃĐ°ŃŃŃĐľ ŃĐžĐľĐ´Đ¸Đ˝ĐľĐ˝Đ¸Ń
	setTimeout(function(){
		game(window, r, true, botsUrl, M);
	}, 500);
}

		}

	};
	else {
		M = botName;
	}



	if(!bot) h.setRegion = ia;
	if(!bot) h.setSkins = function(a) {
		sa = a
	};
	if(!bot) h.setNames = function(a) {
		V = a
	};
	if(!bot) h.setDarkTheme = function(a) {
		ba = a
	};
	if(!bot) h.setColors = function(a) {
		da = a
	};
	if(!bot) h.setShowMass = function(a) {
		ta = a
	};
	if(!bot) h.spectate = function() {
		sendCommand(1);
		hideMenu()
	};
	if(!bot) h.connect = loadRegions;
	
	var qa = -1, ra = -1, z = null, v = 1, T = null, W = {}, Ea = "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;hitler;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;ussr;pewdiepie;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;nazi;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;isis;doge".split(";"), Fa = ["m'blob"];
	pa.prototype = {id: 0,points: null,pointsAcc: null,name: null,nameCache: null,sizeCache: null,x: 0,y: 0,size: 0,ox: 0,oy: 0,oSize: 0,nx: 0,ny: 0,nSize: 0,updateTime: 0,updateCode: 0,drawTime: 0,destroyed: !1,isVirus: !1,destroy: function() {
			var a;
			for (a = 0; a < p.length; a++)
				if (p[a] == this) {
					p.splice(a, 1);
					break
				}
			delete w[this.id];
			a = m.indexOf(this);
			-1 != a && (aa = !0, m.splice(a, 1));
			a = C.indexOf(this.id);
			-1 != a && C.splice(a, 1);
			this.destroyed = !0;
			D.push(this)
		},getNameSize: function() {
			return Math.max(~~(.3 * this.size), 24)
		},setName: function(a) {
			if (this.name = a)
				null == this.nameCache ? this.nameCache = new U(this.getNameSize(), "#FFFFFF", !0, "#000000") : this.nameCache.setSize(this.getNameSize()), this.nameCache.setValue(this.name)
		},createPoints: function() {
			for (var a = this.getNumPoints(); this.points.length > a; ) {
				var b = ~~(Math.random() * this.points.length);
				this.points.splice(b, 1);
				this.pointsAcc.splice(b, 1)
			}
			0 == this.points.length && 0 < a && (this.points.push({c: this,v: this.size,x: this.x,y: this.y}), this.pointsAcc.push(Math.random() - .5));
			for (; this.points.length < a; ) {
				var b = ~~(Math.random() * this.points.length), c = this.points[b];
				this.points.splice(b, 0, {c: this,v: c.v,x: c.x,y: c.y});
				this.pointsAcc.splice(b, 0, this.pointsAcc[b])
			}
		},getNumPoints: function() {
			var a = 10;
			20 > this.size && (a = 5);
			this.isVirus && (a = 30);
			return ~~Math.max(this.size * g * (this.isVirus ? Math.min(2 * v, 1) : v), a)
		},movePoints: function() {
			this.createPoints();
			for (var a = this.points, b = this.pointsAcc, c = b.concat(), e = a.concat(), d = e.length, f = 0; f < d; ++f) {
				var g = c[(f - 1 + d) % d], h = c[(f + 1) % d];
				b[f] += Math.random() - .5;
				b[f] *= .7;
				10 < b[f] && (b[f] = 10);
				-10 > b[f] && (b[f] = -10);
				b[f] = (g + h + 8 * b[f]) / 10
			}
			for (var k = this, f = 0; f < d; ++f) {
				c = e[f].v;
				g = e[(f - 1 + d) % d].v;
				h = e[(f + 1) % d].v;
				if (15 < this.size && null != G) {
					var l = !1, n = a[f].x, m = a[f].y;
					G.retrieve2(n - 5, m - 5, 10, 10, function(a) {
						a.c != k && 25 > (n - a.x) * (n - a.x) + (m - a.y) * (m - a.y) && (l = !0)
					});
					!l && (a[f].x < I || a[f].y < J || a[f].x > K || a[f].y > L) && (l = !0);
					l && (0 < b[f] && (b[f] = 0), b[f] -= 1)
				}
				c += b[f];
				0 > c && (c = 0);
				c = (12 * c + this.size) / 13;
				a[f].v = (g + h + 8 * c) / 10;
				g = 2 * Math.PI / d;
				h = this.points[f].v;
				this.isVirus && 0 == f % 2 && (h += 5);
				a[f].x = this.x + Math.cos(g * f) * h;
				a[f].y = this.y + Math.sin(g * f) *
				h
			}
		},updatePos: function() {
			var a;
			a = (E - this.updateTime) / 120;
			a = 0 > a ? 0 : 1 < a ? 1 : a;
			a = a * a * (3 - 2 * a);
			this.getNameSize();
			if (this.destroyed && 1 <= a) {
				var b = D.indexOf(this);
				-1 != b && D.splice(b, 1)
			}
			this.x = a * (this.nx - this.ox) + this.ox;
			this.y = a * (this.ny - this.oy) + this.oy;
			this.size = a * (this.nSize - this.oSize) + this.oSize;
			return a
		},shouldRender: function() {
			return this.x + this.size + 40 < s - k / 2 / g || this.y + this.size + 40 < t - q / 2 / g || this.x - this.size - 40 > s + k / 2 / g || this.y - this.size - 40 > t + q / 2 / g ? !1 : !0
		},draw: function() {
			if (this.shouldRender()) {
				var a = !this.isVirus &&
				.5 > g;
				d.save();
				this.drawTime = E;
				var b = this.updatePos();
				this.destroyed && (d.globalAlpha *= 1 - b);
				d.lineWidth = 10;
				d.lineCap = "round";
				d.lineJoin = this.isVirus ? "mitter" : "round";
				da ? (d.fillStyle = "#FFFFFF", d.strokeStyle = "#AAAAAA") : (d.fillStyle = this.color, d.strokeStyle = this.color);
				if (a)
					d.beginPath(), d.arc(this.x, this.y, this.size, 0, 2 * Math.PI, !1);
				else
					for (this.movePoints(), d.beginPath(), a = this.getNumPoints(), d.moveTo(this.points[0].x, this.points[0].y), b = 1; b <= a; ++b) {
						var c = b % a;
						d.lineTo(this.points[c].x, this.points[c].y)
					}
				d.closePath();
				a = this.name.toLowerCase();
				sa ? -1 != Ea.indexOf(a) ? (W.hasOwnProperty(a) || (W[a] = new Image, W[a].src = "skins/" + a + ".png"), b = W[a]) : b = null : b = null;
				a = b ? -1 != Fa.indexOf(a) : !1;
				d.stroke();
				d.fill();
				null != b && 0 < b.width && !a && (d.save(), d.clip(), d.drawImage(b, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size), d.restore());
				if (da || 15 < this.size)
					d.strokeStyle = "#000000", d.globalAlpha *= .1, d.stroke();
				d.globalAlpha = 1;
				null != b && 0 < b.width && a && d.drawImage(b, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
				b = -1 != m.indexOf(this);
				a = ~~this.y;
				if ((V || b) && this.name && this.nameCache) {
					var e = this.nameCache;
					e.setValue(this.name);
					e.setSize(this.getNameSize());
					c = Math.ceil(10 * g) / 10;
					e.setScale(c);
					var e = e.render(), h = ~~(e.width / c), c = ~~(e.height / c);
					d.drawImage(e, ~~this.x - ~~(h / 2), a - ~~(c / 2), h, c);
					a += e.height / 2 + 4
				}
				ta && b && (null == this.sizeCache && (this.sizeCache = new U(this.getNameSize() / 2, "#FFFFFF", !0, "#000000")), b = this.sizeCache, b.setSize(this.getNameSize() / 2), b.setValue(~~(this.size * this.size / 100)), c = Math.ceil(10 * g) / 10, b.setScale(c),
				e = b.render(), h = ~~(e.width / c), c = ~~(e.height / c), d.drawImage(e, ~~this.x - ~~(h / 2), a - ~~(c / 2), h, c));
				d.restore()
			}
		}};
	U.prototype = {_value: "",_color: "#000000",_stroke: !1,_strokeColor: "#000000",_size: 16,_canvas: null,_ctx: null,_dirty: !1,_scale: 1,setSize: function(a) {
			this._size != a && (this._size = a, this._dirty = !0)
		},setScale: function(a) {
			this._scale != a && (this._scale = a, this._dirty = !0)
		},setColor: function(a) {
			this._color != a && (this._color = a, this._dirty = !0)
		},setStroke: function(a) {
			this._stroke != a && (this._stroke = a, this._dirty = !0)
		},setStrokeColor: function(a) {
			this._strokeColor != a && (this._strokeColor = a, this._dirty = !0)
		},setValue: function(a) {
			a != this._value && (this._value = a, this._dirty = !0)
		},render: function() {
			null == this._canvas && (this._canvas = document.createElement("canvas"), this._ctx = this._canvas.getContext("2d"));
			if (this._dirty) {
				this._dirty = !1;
				var a = this._canvas, b = this._ctx, c = this._value, d = this._scale, g = this._size, f = g + "px Ubuntu";
				b.font = f;
				var h = b.measureText(c).width, k = ~~(.2 * g);
				a.width = (h + 6) * d;
				a.height = (g + k) * d;
				b.font = f;
				b.scale(d, d);
				b.globalAlpha = 1;
				b.lineWidth = 3;
				b.strokeStyle = this._strokeColor;
				b.fillStyle = this._color;
				this._stroke && b.strokeText(c, 3, g - k / 2);
				b.fillText(c, 3, g - k / 2)
			}
			return this._canvas
		}};



	if(!bot) h.onload = init;
	else init();
	

}

var playerX = 0;
var playerY = 0;

game(window, jQuery);
