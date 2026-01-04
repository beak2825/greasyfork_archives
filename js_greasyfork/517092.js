// ==UserScript==
// @name         Free Slither.io Cosmetics
// @version      1.0
// @namespace    Flushy's Userscripts
// @description  This script gives you Slither.io cosmetics without having to enter codes or use mods like NTL.
// @author       Flushy
// @match        http://slither.io/*
// @match        http://slither.com/io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slither.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517092/Free%20Slitherio%20Cosmetics.user.js
// @updateURL https://update.greasyfork.org/scripts/517092/Free%20Slitherio%20Cosmetics.meta.js
// ==/UserScript==

csk.onclick = function() {
    if (!playing)
        if (dead_mtm == -1) {
            resetGame();
            cst = 0;
            recalcSepMults();
            choosing_skin = true;
            pskh.style.opacity = 0;
            nskh.style.opacity = 0;
            bskh.style.opacity = 0;
            scosh.style.opacity = 0;
            skodiv.style.opacity = 0;
            revdiv.style.opacity = 0;
            pskh.style.display = "inline";
            nskh.style.display = "inline";
            bskh.style.display = "inline";
            scosh.style.display = "inline";
            skodiv.style.display = "inline";
            revdiv.style.display = "none";
            reposSkinStuff();
            nick.disabled = true;
            if (mscps == 0)
                setMscps(300);
            var pts = [];
            for (var i = 27; i >= 1; i--) {
                var xx = grd / 2 - i * 10;
                var yy = grd / 2;
                var po = {
                    xx: xx,
                    yy: yy,
                    fx: 0,
                    fy: 0,
                    fltn: 0,
                    da: 0,
                    ltn: 1
                };
                po.fxs = new Float32Array(hfc);
                po.fys = new Float32Array(hfc);
                po.fltns = new Float32Array(hfc);
                po.fsmus = new Float32Array(hfc);
                po.fpos = 0;
                po.ftg = 0;
                po.smu = 1;
                po.fsmu = 0;
                po.da = 0;
                po.ebx = 10;
                po.eby = 0;
                pts.push(po)
            }
            var cv = 0;
            try {
                var mcv = localStorage.snakercv;
                if (mcv == "" + Number(mcv))
                    cv = Number(mcv)
            } catch (e) {}
            var aa = null;
            var wca = false;
            var taa = "";
            try {
                wca = localStorage.want_custom_skin == "1";
                taa = localStorage.custom_skin
            } catch (e) {}
            if (wca)
                if (taa)
                    if (taa.length > 0) {
                        taa = ("" + taa).split(",");
                        aa = new Uint8Array(taa.length);
                        for (var i = 0; i < taa.length; i++)
                            aa[i] = Number(taa[i])
                    }
            var o = newSlither(1, grd / 2, grd / 2, cv, 0, pts, default_msl, aa);
            view_xx = grd / 2 - (22 / 2 - .5) * 10;
            view_yy = grd / 2;
            slither = o;
            try {
                var v = localStorage.cosmetic;
                if (v == "" + Number(v))
                    slither.accessory = Number(v)
            } catch (e) {}
            o.nk = "";
            o.ip = "";
            o.onk = "";
            o.eang = o.wang = o.ang;
            o.sp = 4.8;
            o.spang = o.sp / spangdv;
            if (o.spang > 1)
                o.spang = 1;
            o.sc = 1;
            o.scang = 1;
            o.ssp = nsp1 + nsp2 * o.sc;
            o.fsp = o.ssp + .1;
            o.wsep = 6 * o.sc;
            var mwsep = nsep / gsc;
            if (o.wsep < mwsep)
                o.wsep = mwsep;
            o.sep = o.wsep;
            o.sep = o.wsep = 18.25;
            snl(o);
            o.alive_amt = 1;
            o.rex = 1.66;
            ws = {};
            ws.send = function(a) {}
            ;
            ws.close = function() {}
            ;
            connected = true;
            playing = true;
            high_quality = true;
            gla = 1;
            wdfg = 0;
            qsm = 1;
            startShowGame();
            lbh.style.display = "none";
            lbs.style.display = "none";
            lbn.style.display = "none";
            lbp.style.display = "none";
            lbf.style.display = "none";
            vcm.style.display = "none";
            loch.style.display = "none"
        }
    return false
}

scos.onclick = function() {
    if (playing)
        if (choosing_skin)
            if (!building_skin && !selecting_cosmetic) {
                selecting_cosmetic = true;
                ending_select_cosmetic = false;
                var o;
                var k = 0;
                var tw = 1;
                for (var i = 0; i < 32; i++)
                    if (actco.length > i)
                        tw++;
                if (tw > 8)
                    tw = 8;
                for (var i = 0; i <= 32; i++)
                    if (i == 32 || actco.length > i) {
                        o = {};
                        if (i == 32)
                            o.v = -1;
                        else
                            o.v = i;
                        var ii = document.createElement("img");
                        ii.onload = function() {
                            var o;
                            for (var i = cosbtns.length - 1; i >= 0; i--) {
                                o = cosbtns[i];
                                if (o.ii == this) {
                                    if (o.v == -1) {
                                        o.ww = this.width * .5;
                                        o.hh = this.height * .5;
                                        this.width = o.ww;
                                        this.height = o.hh;
                                        o.xx -= o.ww / 2;
                                        o.yy -= o.hh / 2;
                                        reposCosbtns()
                                    } else {
                                        o.ww = this.width * .35;
                                        o.hh = this.height * .35;
                                        this.width = o.ww;
                                        this.height = o.hh;
                                        o.xx -= o.ww / 2;
                                        o.yy -= o.hh / 2;
                                        reposCosbtns()
                                    }
                                    break
                                }
                            }
                        }
                        ;
                        if (i == 32)
                            ii.src = "http://slither.io/s/a_none.png";
                        else
                            ii.src = a_imgs[i].u;
                        ii.style.opacity = 0;
                        ii.style.position = "absolute";
                        ii.style.left = "0px";
                        ii.style.top = "0px";
                        ii.draggable = false;
                        o.ii = ii;
                        trf(ii, "rotate(90deg)");
                        o.xx = 102 * (k % 8 - (tw / 2 - .5));
                        o.yy = -22 - 80 * Math.floor(k / 8);
                        k++;
                        var a = document.createElement("a");
                        a.draggable = false;
                        a.href = "#";
                        a.className = "btn btnt";
                        a.style.zIndex = 53;
                        a.style.position = "fixed";
                        a.appendChild(ii);
                        o.a = a;
                        document.body.appendChild(a);
                        a.onclick = function() {
                            if (!choosing_skin)
                                return false;
                            if (!selecting_cosmetic)
                                return false;
                            for (var i = cosbtns.length - 1; i >= 0; i--)
                                if (cosbtns[i].a == this) {
                                    slither.accessory = cosbtns[i].v;
                                    break
                                }
                            return false
                        }
                        ;
                        cosbtns.push(o)
                    }
                reposCosbtns()
            }
    return false
}
window.connect = function() {
    if (waiting_for_sos)
        if (sos_ready_after_mtm >= 0 && timeObj.now() > sos_ready_after_mtm) waiting_for_sos = false;
        else if (sos_loaded_at_mtm >= 0 && timeObj.now() - sos_loaded_at_mtm > 7E3) waiting_for_sos = false;
    else return;
    resetGame();
    want_play = false;
    connecting = true;
    start_connect_mtm = timeObj.now();
    fbso = null;
    if (!forcing) {
        recalcPtms();
        if (fbso != null) {
            bso = fbso;
            if (testing) {
                console.log("bso is fbso:");
                console.log(bso)
            }
        } else {
            sos.sort(function (a, b) {
                return parseFloat(a.po) - parseFloat(b.po)
            });
            bso = sos[Math.floor(Math.random() *
                sos.length)];
            for (var i = sos.length - 1; i >= 0; i--)
                if (!sos[i].tainted)
                    if (sos[i].ptm <= bso.ptm)
                        if (sos[i].ac > 20) bso = sos[i];
            if (testing) {
                console.log("bso is selected the old way:");
                console.log(bso)
            }
        }
    }
    if (forcing)
        if (fobso != null) bso = fobso;
    if (testing) {
        var es = "";
        if (fbso != null) es = "(fbso!)";
        console.log("connecting to " + bso.ip + ":" + bso.po + "... " + es)
    }
    ws = new WebSocket("ws://" + bso.ip + ":" + bso.po + "/slither");
    ws.binaryType = "arraybuffer";
    window.ws = ws;
    ws.onmessage = function (e) {
        if (ws != this) return;
        var a = new Uint8Array(e.data);
        rdps += a.length;
        apkps++;
        if (want_seq) {
            var seq = a[0] << 8 | a[1];
            if (seq - 1 != lseq)
                if (seq != 0)
                    if (testing) console.log("sequence error! " + seq + " != " + lseq);
            lseq = seq
        } else if (want_etm_s) {
            lptm = cptm;
            cptm = timeObj.now();
            var etm_s = a[0] << 8 | a[1]
        }
        var m;
        var len;
        if (want_etm_s) m = 2;
        else m = 0;
        if (a[m] < 32) {
            var l = a.length;
            while (m < l) {
                if (a[m] < 32) {
                    len = a[m] << 8 | a[m + 1];
                    m += 2
                } else {
                    len = a[m] - 32;
                    m++
                }
                var a2 = a.subarray(m, m + len);
                m += len;
                gotPacket(a2)
            }
        } else {
            var a2 = a.subarray(m, a.length);
            gotPacket(a2)
        }
    };
    window.gotPacket = function (a) {
        pkps++;
        if (testing) {
            pkpspc[a[0]]++;
            rdpspc[a[0]] += a.length
        }
        var cmd;
        var cmd_v;
        var m;
        var alen, plen, dlen;
        cmd_v = a[0];
        cmd = String.fromCharCode(cmd_v);
        alen = a.length;
        plen = a.length;
        dlen = a.length - 1;
        m = 1;
        if (cmd == "a") {
            connecting = false;
            connected = true;
            playing = true;
            if (fobso != null) {
                fobso = null;
                forcing = false
            }
            play_btn_click_mtm = -1;
            grd = a[m] << 16 | a[m + 1] << 8 | a[m + 2];
            m += 3;
            var nmscps = a[m] << 8 | a[m + 1];
            m += 2;
            sector_size = a[m] << 8 | a[m + 1];
            ssd256 = sector_size / 256;
            m += 2;
            sector_count_along_edge = a[m] << 8 | a[m + 1];
            m += 2;
            spangdv = a[m] / 10;
            m++;
            nsp1 = (a[m] << 8 | a[m + 1]) / 100;
            m += 2;
            nsp2 = (a[m] <<
                8 | a[m + 1]) / 100;
            m += 2;
            nsp3 = (a[m] << 8 | a[m + 1]) / 100;
            m += 2;
            mamu = (a[m] << 8 | a[m + 1]) / 1E3;
            m += 2;
            mamu2 = (a[m] << 8 | a[m + 1]) / 1E3;
            m += 2;
            cst = (a[m] << 8 | a[m + 1]) / 1E3;
            m += 2;
            if (m < alen) {
                protocol_version = a[m];
                m++
            }
            if (m < alen) {
                default_msl = a[m];
                m++
            }
            if (m < alen) {
                real_sid = a[m] << 8 | a[m + 1];
                m += 2
            } else real_sid = 0;
            if (m < alen) {
                flux_grd = a[m] << 16 | a[m + 1] << 8 | a[m + 2];
                m += 3
            } else flux_grd = grd * .98;
            real_flux_grd = flux_grd;
            for (var i = 0; i < flxc; i++) flux_grds[i] = flux_grd;
            team_mode = false;
            if (m < alen) {
                var game_mode = a[m];
                m++;
                team_mode = game_mode == 2
            }
            if (m < alen) {
                var extra_b =
                    a[m];
                m++;
                if (team_mode) team_val = extra_b
            }
            if (team_mode) {
                if (!trump_ii) {
                    trump_ii = document.createElement("img");
                    trump_ii.style.opacity = 0;
                    trump_ii.style.position = "absolute";
                    trf(trump_ii, "scale(.5, .5)");
                    trfo(trump_ii, "0% 100%");
                    trump_ii.style.left = tsbofx + 82 + "px";
                    trump_ii.style.bottom = tsbofy + "px";
                    trump_ii.onload = function () {
                        trump_loaded = true;
                        trump_h = this.height
                    };
                    trump_ii.src = "http://slither.io/s/trump4.png";
                    sbmc.appendChild(trump_ii);
                    kamala_ii = document.createElement("img");
                    kamala_ii.style.opacity = 0;
                    kamala_ii.style.position =
                        "absolute";
                    trf(kamala_ii, "scale(.5, .5)");
                    trfo(kamala_ii, "0% 100%");
                    kamala_ii.style.left = tsbofx + 10 + "px";
                    kamala_ii.style.bottom = tsbofy + "px";
                    kamala_ii.onload = function () {
                        kamala_loaded = true
                    };
                    kamala_ii.src = "http://slither.io/s/kamala4.png";
                    sbmc.appendChild(kamala_ii)
                }
                lbf.style.left = "210px";
                mmsta = .7
            } else {
                lbf.style.left = "8px";
                mmsta = .475
            }
            reposLbf();
            recalcSepMults();
            setMscps(nmscps);
            setMinimapSize(24, true);
            lbh.style.display = "inline";
            lbs.style.display = "inline";
            lbn.style.display = "inline";
            lbp.style.display = "inline";
            lbf.style.display = "inline";
            vcm.style.display = "inline";
            loch.style.display = "inline";
            startShowGame()
        } else if (cmd == "e" || cmd == "E" || cmd == "3" || cmd == "4" || cmd == "5" || cmd == "d" || cmd == "7") {
            var o;
            var id = a[m] << 8 | a[m + 1];
            if (protocol_version >= 14 && (cmd == "d" || cmd == "7" || dlen <= 2 && (cmd == "e" || cmd == "E" || cmd == "3" || cmd == "4" || cmd == "5"))) o = slither;
            else {
                var id = a[m] << 8 | a[m + 1];
                m += 2;
                o = os["s" + id]
            }
            var dir = -1;
            var ang = -1;
            var wang = -1;
            var speed = -1;
            if (protocol_version >= 14)
                if (plen == 6) {
                    if (cmd == "e") dir = 1;
                    else dir = 2;
                    ang = a[m] * 2 * Math.PI / 256;
                    m++;
                    wang = a[m] * 2 * Math.PI / 256;
                    m++;
                    speed = a[m] / 18;
                    m++
                } else if (plen == 5 || plen == 3)
                if (cmd == "e") {
                    ang = a[m] * 2 * Math.PI / 256;
                    m++;
                    speed = a[m] / 18;
                    m++
                } else if (cmd == "E") {
                dir = 1;
                wang = a[m] * 2 * Math.PI / 256;
                m++;
                speed = a[m] / 18;
                m++
            } else if (cmd == "4") {
                dir = 2;
                wang = a[m] * 2 * Math.PI / 256;
                m++;
                speed = a[m] / 18;
                m++
            } else if (cmd == "3") {
                dir = 1;
                ang = a[m] * 2 * Math.PI / 256;
                m++;
                wang = a[m] * 2 * Math.PI / 256;
                m++
            } else {
                if (cmd == "5") {
                    dir = 2;
                    ang = a[m] * 2 * Math.PI / 256;
                    m++;
                    wang = a[m] * 2 * Math.PI / 256;
                    m++
                }
            } else {
                if (plen == 4 || plen == 2)
                    if (cmd == "e") {
                        ang = a[m] * 2 * Math.PI / 256;
                        m++
                    } else if (cmd ==
                    "E") {
                    dir = 1;
                    wang = a[m] * 2 * Math.PI / 256;
                    m++
                } else if (cmd == "4") {
                    dir = 2;
                    wang = a[m] * 2 * Math.PI / 256;
                    m++
                } else if (cmd == "3") {
                    speed = a[m] / 18;
                    m++
                } else if (cmd == "d") {
                    dir = 1;
                    ang = a[m] * 2 * Math.PI / 256;
                    m++;
                    wang = a[m] * 2 * Math.PI / 256;
                    m++;
                    speed = a[m] / 18;
                    m++
                } else if (cmd == "7") {
                    dir = 2;
                    ang = a[m] * 2 * Math.PI / 256;
                    m++;
                    wang = a[m] * 2 * Math.PI / 256;
                    m++;
                    speed = a[m] / 18;
                    m++
                }
            } else if (protocol_version >= 6)
                if (plen == 6) {
                    if (cmd == "e") dir = 1;
                    else dir = 2;
                    ang = a[m] * 2 * Math.PI / 256;
                    m++;
                    wang = a[m] * 2 * Math.PI / 256;
                    m++;
                    speed = a[m] / 18;
                    m++
                } else if (plen == 5)
                if (cmd == "e") {
                    ang = a[m] *
                        2 * Math.PI / 256;
                    m++;
                    speed = a[m] / 18;
                    m++
                } else if (cmd == "E") {
                dir = 1;
                wang = a[m] * 2 * Math.PI / 256;
                m++;
                speed = a[m] / 18;
                m++
            } else if (cmd == "4") {
                dir = 2;
                wang = a[m] * 2 * Math.PI / 256;
                m++;
                speed = a[m] / 18;
                m++
            } else if (cmd == "3") {
                dir = 1;
                ang = a[m] * 2 * Math.PI / 256;
                m++;
                wang = a[m] * 2 * Math.PI / 256;
                m++
            } else {
                if (cmd == "5") {
                    dir = 2;
                    ang = a[m] * 2 * Math.PI / 256;
                    m++;
                    wang = a[m] * 2 * Math.PI / 256;
                    m++
                }
            } else {
                if (plen == 4)
                    if (cmd == "e") {
                        ang = a[m] * 2 * Math.PI / 256;
                        m++
                    } else if (cmd == "E") {
                    dir = 1;
                    wang = a[m] * 2 * Math.PI / 256;
                    m++
                } else if (cmd == "4") {
                    dir = 2;
                    wang = a[m] * 2 * Math.PI / 256;
                    m++
                } else if (cmd ==
                    "3") {
                    speed = a[m] / 18;
                    m++
                }
            } else if (protocol_version >= 3) {
                if (cmd != "3")
                    if (plen == 8 || plen == 7 || plen == 6 && cmd != "3" || plen == 5 && cmd != "3")
                        if (cmd == "e") dir = 1;
                        else dir = 2;
                if (plen == 8 || plen == 7 || plen == 5 && cmd == "3" || plen == 6 && cmd == "3") {
                    ang = (a[m] << 8 | a[m + 1]) * 2 * Math.PI / 65535;
                    m += 2
                }
                if (plen == 8 || plen == 7 || plen == 5 && cmd != "3" || plen == 6 && cmd != "3") {
                    wang = (a[m] << 8 | a[m + 1]) * 2 * Math.PI / 65535;
                    m += 2
                }
                if (plen == 8 || plen == 6 || plen == 4) {
                    speed = a[m] / 18;
                    m++
                }
            } else {
                if (dlen == 11 || dlen == 8 || dlen == 9 || dlen == 6) {
                    dir = a[m] - 48;
                    m++
                }
                if (dlen == 11 || dlen == 7 || dlen == 9 || dlen ==
                    5) {
                    ang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                    m += 3
                }
                if (dlen == 11 || dlen == 8 || dlen == 9 || dlen == 6) {
                    wang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                    m += 3
                }
                if (dlen == 11 || dlen == 7 || dlen == 8 || dlen == 4) {
                    speed = (a[m] << 8 | a[m + 1]) / 1E3;
                    m += 2
                }
            }
            if (o) {
                if (dir != -1) o.dir = dir;
                if (ang != -1) {
                    var da = (ang - o.ang) % pi2;
                    if (da < 0) da += pi2;
                    if (da > Math.PI) da -= pi2;
                    var k = o.fapos;
                    for (var j = 0; j < afc; j++) {
                        o.fas[k] -= da * afas[j];
                        k++;
                        if (k >= afc) k = 0
                    }
                    o.fatg = afc;
                    o.ang = ang
                }
                if (wang != -1) {
                    o.wang = wang;
                    if (o != slither) o.eang = wang
                }
                if (speed != -1) {
                    o.sp = speed;
                    o.spang = o.sp / spangdv;
                    if (o.spang > 1) o.spang = 1
                }
            }
        } else if (cmd == "6") {
            var s = "";
            while (m < alen) {
                s += String.fromCharCode(a[m]);
                m++
            }
            gotServerVersion(s)
        } else if (cmd == "h") {
            var id = a[m] << 8 | a[m + 1];
            m += 2;
            var fam = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 16777215;
            m += 3;
            var o = os["s" + id];
            if (o) {
                o.fam = fam;
                snl(o)
            }
        } else if (cmd == "r") {
            var id = a[m] << 8 | a[m + 1];
            m += 2;
            var o = os["s" + id];
            if (o) {
                if (dlen >= 4) {
                    o.fam = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 16777215;
                    m += 3
                }
                for (var j = 0; j < o.pts.length; j++)
                    if (!o.pts[j].dying) {
                        o.pts[j].dying = true;
                        o.sct--;
                        o.sc = Math.min(6, 1 +
                            (o.sct - 2) / 106);
                        o.scang = .13 + .87 * Math.pow((7 - o.sc) / 6, 2);
                        o.ssp = nsp1 + nsp2 * o.sc;
                        o.fsp = o.ssp + .1;
                        o.wsep = 6 * o.sc;
                        var mwsep = nsep / gsc;
                        if (o.wsep < mwsep) o.wsep = mwsep;
                        break
                    } snl(o)
            }
        } else if (cmd == "R") {
            slither.rsc = a[m];
            m++
        } else if (cmd == "B") {
            if (testing) {
                var id = a[m] << 8 | a[m + 1];
                m += 2;
                o = os["s" + id];
                xx = a[m] << 8 | a[m + 1];
                m += 2;
                yy = a[m] << 8 | a[m + 1];
                m += 2;
                var sct_c = a[m];
                m++;
                if (xx != o.lpo_xx || yy != o.lpo_yy) {
                    var dx = xx - o.lpo_xx;
                    var dy = yy - o.lpo_yy;
                    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                        dx = Math.round(dx * 100) / 100;
                        dy = Math.round(dy * 100) / 100;
                        if (o ==
                            slither) console.log("invalid new point delta for self: " + dx + " " + dy + " (" + o.lpo_cmd + ", prev " + o.lpo_prev_cmd + ") (sct " + o.sct + " " + sct_c + ") " + o.lpo_dd);
                        else console.log("invalid new point delta for " + o.nk + ": " + dx + " " + dy + " (" + o.lpo_cmd + ", prev " + o.lpo_prev_cmd + ") (sct " + o.sct + " " + sct_c + ") " + o.lpo_dd)
                    }
                }
            }
        } else if (cmd == "g" || cmd == "n" || cmd == "G" || cmd == "N" || cmd == "+" || cmd == "=") {
            if (!playing) return;
            var adding_only = cmd == "n" || cmd == "N" || cmd == "+";
            var o;
            if (protocol_version >= 15)
                if (cmd == "G" || cmd == "N" || cmd == "=" && dlen ==
                    6 || cmd == "+" && dlen == 9) o = slither;
                else {
                    var id = a[m] << 8 | a[m + 1];
                    m += 2;
                    o = os["s" + id]
                }
            else if (cmd == "g" && dlen == 4 || cmd == "G" && dlen == 2 || cmd == "n" && dlen == 7 || cmd == "N" && dlen == 5) o = slither;
            else {
                var id = a[m] << 8 | a[m + 1];
                m += 2;
                o = os["s" + id]
            }
            if (o) {
                if (adding_only) o.sct++;
                else
                    for (var j = 0; j < o.pts.length; j++)
                        if (!o.pts[j].dying) {
                            o.pts[j].dying = true;
                            break
                        } var lpo = o.pts[o.pts.length - 1];
                var mpo;
                var mv;
                var lmpo;
                var dx, dy, ox, oy;
                var dltn;
                var dsmu;
                var osmu;
                var d;
                var po = points_dp.get();
                if (!po) {
                    po = {};
                    po.fxs = new Float32Array(hfc);
                    po.fys =
                        new Float32Array(hfc);
                    po.fltns = new Float32Array(hfc);
                    po.fsmus = new Float32Array(hfc)
                } else
                    for (var i = hfc - 1; i >= 0; i--) {
                        po.fxs[i] = 0;
                        po.fys[i] = 0;
                        po.fltns[i] = 0;
                        po.fsmus[i] = 0
                    }
                var msl = o.msl;
                if (protocol_version >= 15)
                    if (cmd == "+" || cmd == "=") {
                        var iang = a[m] << 8 | a[m + 1];
                        po.iang = iang;
                        m += 2;
                        xx = a[m] << 8 | a[m + 1];
                        m += 2;
                        yy = a[m] << 8 | a[m + 1];
                        m += 2
                    } else {
                        var iang;
                        if (cmd == "G" && dlen == 2 || cmd == "N" && dlen == 5 || cmd == "g" && dlen == 4 || cmd == "n" && dlen == 7) {
                            iang = a[m] << 8 | a[m + 1];
                            m += 2
                        } else iang = lpo.iang;
                        po.iang = iang;
                        var ang = iang * k64a;
                        xx = lpo.xx + Math.cos(ang) *
                            msl;
                        yy = lpo.yy + Math.sin(ang) * msl
                    }
                else if (protocol_version >= 3)
                    if (cmd == "g" || cmd == "n") {
                        xx = a[m] << 8 | a[m + 1];
                        m += 2;
                        yy = a[m] << 8 | a[m + 1];
                        m += 2
                    } else {
                        xx = lpo.xx + a[m] - 128;
                        m++;
                        yy = lpo.yy + a[m] - 128;
                        m++
                    }
                else {
                    xx = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                    m += 3;
                    yy = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                    m += 3
                }
                if (adding_only) {
                    o.fam = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 16777215;
                    m += 3
                }
                po.fpos = 0;
                po.ftg = 0;
                po.smu = 1;
                po.fsmu = 0;
                po.xx = xx;
                po.yy = yy;
                po.fx = 0;
                po.fy = 0;
                po.fltn = 0;
                po.da = 0;
                po.ltn = Math.sqrt(Math.pow(po.xx - lpo.xx, 2) + Math.pow(po.yy - lpo.yy, 2)) / msl;
                po.ebx = po.xx - lpo.xx;
                po.eby = po.yy - lpo.yy;
                o.pts.push(po);
                if (o.iiv) {
                    var hx = o.xx + o.fx;
                    var hy = o.yy + o.fy;
                    dx = hx - (lpo.xx + lpo.fx);
                    dy = hy - (lpo.yy + lpo.fy);
                    d = Math.sqrt(dx * dx + dy * dy);
                    if (d > 1) {
                        dx /= d;
                        dy /= d
                    }
                    d2 = po.ltn * msl;
                    if (d < msl) d3 = d;
                    else d3 = d2;
                    ox = lpo.xx + lpo.fx + dx * d3;
                    oy = lpo.yy + lpo.fy + dy * d3;
                    dltn = 1 - d3 / d2;
                    dx = po.xx - ox;
                    dy = po.yy - oy;
                    var k = po.fpos;
                    for (var j = 0; j < hfc; j++) {
                        po.fxs[k] -= dx * hfas[j];
                        po.fys[k] -= dy * hfas[j];
                        po.fltns[k] -= dltn * hfas[j];
                        k++;
                        if (k >= hfc) k = 0
                    }
                    po.fx = po.fxs[po.fpos];
                    po.fy = po.fys[po.fpos];
                    po.fltn = po.fltns[po.fpos];
                    po.fsmu = po.fsmus[po.fpos];
                    po.ftg = hfc
                }
                lpo = po;
                var n2 = 3;
                var k = o.pts.length - 3;
                if (k >= 1) {
                    lmpo = o.pts[k];
                    n = 0;
                    mv = 0;
                    dsmu = 0;
                    for (var m = k - 1; m >= 0; m--) {
                        mpo = o.pts[m];
                        n++;
                        ox = mpo.xx;
                        oy = mpo.yy;
                        osmu = mpo.smu;
                        if (n <= 4) mv = cst * n / 4;
                        mpo.xx += (lmpo.xx - mpo.xx) * mv;
                        mpo.yy += (lmpo.yy - mpo.yy) * mv;
                        if (mpo.smu != smus[n2]) {
                            osmu = mpo.smu;
                            mpo.smu = smus[n2];
                            dsmu = mpo.smu - osmu
                        } else dsmu = 0;
                        if (n2 < smuc_m3) n2++;
                        if (o.iiv) {
                            dx = mpo.xx - ox;
                            dy = mpo.yy - oy;
                            var k = mpo.fpos;
                            for (var j = 0; j < hfc; j++) {
                                mpo.fxs[k] -= dx * hfas[j];
                                mpo.fys[k] -= dy * hfas[j];
                                mpo.fsmus[k] -= dsmu * hfas[j];
                                k++;
                                if (k >= hfc) k = 0
                            }
                            mpo.fx =
                                mpo.fxs[mpo.fpos];
                            mpo.fy = mpo.fys[mpo.fpos];
                            mpo.fsmu = mpo.fsmus[mpo.fpos];
                            mpo.ftg = hfc
                        }
                        lmpo = mpo
                    }
                }
                o.sc = Math.min(6, 1 + (o.sct - 2) / 106);
                o.scang = .13 + .87 * Math.pow((7 - o.sc) / 6, 2);
                o.ssp = nsp1 + nsp2 * o.sc;
                o.fsp = o.ssp + .1;
                o.wsep = 6 * o.sc;
                var mwsep = nsep / gsc;
                if (o.wsep < mwsep) o.wsep = mwsep;
                if (adding_only) snl(o);
                if (o == slither) {
                    ovxx = slither.xx + slither.fx;
                    ovyy = slither.yy + slither.fy
                }
                var csp = o.sp * (etm / 8) / 4;
                csp *= lag_mult;
                var ochl = o.chl - 1;
                o.chl = csp / o.msl;
                var dx = xx - o.xx;
                var dy = yy - o.yy;
                var dchl = o.chl - ochl;
                o.xx = xx;
                o.yy = yy;
                var k = o.fpos;
                for (var j = 0; j < rfc; j++) {
                    o.fxs[k] -= dx * rfas[j];
                    o.fys[k] -= dy * rfas[j];
                    o.fchls[k] -= dchl * rfas[j];
                    k++;
                    if (k >= rfc) k = 0
                }
                o.fx = o.fxs[o.fpos];
                o.fy = o.fys[o.fpos];
                o.fchl = o.fchls[o.fpos];
                o.ftg = rfc;
                o.ehl = 0;
                if (o == slither) {
                    var lvx = view_xx;
                    var lvy = view_yy;
                    if (follow_view) {
                        view_xx = slither.xx + slither.fx;
                        view_yy = slither.yy + slither.fy
                    }
                    bgx2 -= (view_xx - lvx) * 1 / bgw2;
                    bgy2 -= (view_yy - lvy) * 1 / bgh2;
                    bgx2 %= 1;
                    if (bgx2 < 0) bgx2 += 1;
                    bgy2 %= 1;
                    if (bgy2 < 0) bgy2 += 1;
                    var dx = view_xx - ovxx;
                    var dy = view_yy - ovyy;
                    var k = fvpos;
                    for (var j = 0; j < vfc; j++) {
                        fvxs[k] -= dx *
                            vfas[j];
                        fvys[k] -= dy * vfas[j];
                        k++;
                        if (k >= vfc) k = 0
                    }
                    fvtg = vfc
                }
            }
        } else if (cmd == "l") {
            if (!playing) return;
            wumsts = true;
            var s_htm = "";
            var n_htm = "";
            var p_htm = "";
            var nc = 0;
            var pos = 0;
            if (lb_fr == -1)
                if (dead_mtm == -1) lb_fr = 0;
            var k, v;
            var score;
            var my_pos = a[m];
            m++;
            rank = a[m] << 8 | a[m + 1];
            if (rank < best_rank) best_rank = rank;
            m += 2;
            slither_count = a[m] << 8 | a[m + 1];
            if (slither_count > biggest_slither_count) biggest_slither_count = slither_count;
            m += 2;
            while (m < alen) {
                var sct;
                var fam;
                sct = a[m] << 8 | a[m + 1];
                m += 2;
                fam = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 16777215;
                m += 3;
                score = Math.floor((fpsls[sct] + fam / fmlts[sct] - 1) * 15 - 5) / 1;
                var cv = a[m] % 9;
                m++;
                var nl = a[m];
                m++;
                pos++;
                var nk = "";
                for (var j = 0; j < nl; j++) {
                    v = a[m];
                    nk += String.fromCharCode(v);
                    m++
                }
                if (pos == my_pos) {
                    nk = my_nick;
                    nl = nk.length
                } else if (!gdnm(nk)) nk = "";
                var nk2 = "";
                for (var j = 0; j < nl; j++) {
                    v = nk.charCodeAt(j);
                    if (v == 38) nk2 += "&amp;";
                    else if (v == 60) nk2 += "&lt;";
                    else if (v == 62) nk2 += "&gt;";
                    else if (v == 32) nk2 += "&nbsp;";
                    else nk2 += String.fromCharCode(v)
                }
                nk = nk2;
                nc++;
                if (pos == my_pos) k = 1;
                else k = .7 * (.3 + .7 * (1 - nc / 10));
                s_htm += '<span style="opacity:' +
                    k + "; color:" + per_color_imgs[cv].cs + ';">' + score + "</span><BR>";
                n_htm += '<span style="opacity:' + k + "; color:" + per_color_imgs[cv].cs + ";" + (pos == my_pos ? "font-weight:bold;" : "") + '">' + nk + "</span><BR>";
                p_htm += '<span style="opacity:' + k + "; color:" + per_color_imgs[cv].cs + ';">#' + nc + "</span><BR>"
            }
            lbs.innerHTML = s_htm;
            lbn.innerHTML = n_htm;
            lbp.innerHTML = p_htm
        } else if (cmd == "v")
            if (a[m] == 2) {
                want_close_socket = true;
                want_victory_message = false;
                want_hide_victory = 1;
                hvfr = 0
            } else {
                dead_mtm = timeObj.now();
                play_btn.setEnabled(true);
                var sct =
                    slither.sct + slither.rsc;
                var final_score = Math.floor((fpsls[sct] + slither.fam / fmlts[sct] - 1) * 15 - 5) / 1;
                var fstr = "Your final length was";
                if (lang == "de") fstr = "Deine endgültige Länge war";
                else if (lang == "fr") fstr = "Votre longueur finale était de";
                else if (lang == "pt") fstr = "Seu comprimento final foi de";
                var exc = "";
                if (final_score > 1E3) exc = "!";
                var s = '<span style="opacity: .45;">' + fstr + " </span><b>" + final_score + "</b>" + exc;
                lastscore.innerHTML = s;
                var pstr = "Play Again";
                if (lang == "fr") pstr = "Jouer";
                else if (lang ==
                    "pt") pstr = "Joga";
                play_btn.setText(String.fromCharCode(160) + pstr + String.fromCharCode(160));
                if (a[m] == 1) {
                    nick_holder.style.display = "none";
                    playh.style.display = "none";
                    smh.style.display = "none";
                    victory_holder.style.display = "inline";
                    saveh.style.display = "block";
                    want_victory_message = true;
                    want_victory_focus = true;
                    victory.disabled = false;
                    save_btn.setEnabled(true)
                } else want_close_socket = true
            }
        else if (cmd == "W") {
            xx = a[m];
            m++;
            yy = a[m];
            m++;
            var o = {};
            o.xx = xx;
            o.yy = yy;
            sectors.push(o)
        } else if (cmd == "w") {
            var mode;
            if (protocol_version >=
                8) {
                mode = 2;
                xx = a[m];
                m++;
                yy = a[m];
                m++
            } else {
                mode = a[m];
                m++;
                xx = a[m] << 8 | a[m + 1];
                m += 2;
                yy = a[m] << 8 | a[m + 1];
                m += 2
            }
            if (mode == 1) {
                var o = {};
                o.xx = xx;
                o.yy = yy;
                sectors.push(o)
            } else {
                cm1 = foods_c - 1;
                for (var i = cm1; i >= 0; i--) {
                    var fo = foods[i];
                    if (fo.sx == xx)
                        if (fo.sy == yy) {
                            if (ggl) destroyFood(fo);
                            if (i == cm1) {
                                foods[i] = null;
                                foods_c--;
                                cm1--
                            } else {
                                foods[i] = foods[cm1];
                                foods[cm1] = null;
                                foods_c--;
                                cm1--
                            }
                        }
                }
                for (var i = sectors.length - 1; i >= 0; i--) {
                    var o = sectors[i];
                    if (o.xx == xx)
                        if (o.yy == yy) sectors.splice(i, 1)
                }
            }
        } else if (cmd == "m") {
            var sct = a[m] << 16 | a[m + 1] <<
                8 | a[m + 2];
            m += 3;
            var fam = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 16777215;
            m += 3;
            var victory_score = Math.floor((fpsls[sct] + fam / fmlts[sct] - 1) * 15 - 5) / 1;
            var nl = a[m];
            m++;
            var victory_nick = "";
            for (var i = 0; i < nl; i++) {
                victory_nick += String.fromCharCode(a[m]);
                m++
            }
            if (!gdnm(victory_nick)) victory_nick = "";
            var victory_message = "";
            while (m < alen) {
                victory_message += String.fromCharCode(a[m]);
                m++
            }
            if (!gdnm(victory_message)) victory_message = "";
            victory_nick = victory_nick.split("&")
                .join("&amp;")
                .split("<")
                .join("&lt;")
                .split(">")
                .join("&gt;");
            victory_message =
                victory_message.split("&")
                .join("&amp;")
                .split("<")
                .join("&lt;")
                .split(">")
                .join("&gt;");
            if (victory_score > 0) {
                var h = "";
                if (victory_message.length > 0) h += "<span style='font-size:17px;'><b><i><span style='opacity: .5;'>&quot;</span>" + victory_message + "<span style='opacity: .5;'>&quot;</span></i></b></span><BR><div style='height: 5px;'></div>";
                if (victory_nick.length > 0) {
                    if (victory_message.length > 0) h += "<i><span style='opacity: .5;'>- </span><span style='opacity: .75;'><b>" + victory_nick + "</b></span><span style='opacity: .5;'>, today's longest</span></i>";
                    else h = "<i><span style='opacity: .5;'>Today's longest was </span><span style='opacity: .75;'><b>" + victory_nick + "</b></span></i>";
                    h += "<br><i><span style='opacity: .5;'>with a length of </span><span style='opacity: .65;'><b>" + victory_score + "</b></span></i>"
                } else if (victory_message.length > 0) {
                    h += "<i><span style='opacity: .5;'>- </span><span style='opacity: .5;'>today's longest</span></i>";
                    h += "<br><i><span style='opacity: .5;'>with a length of </span><span style='opacity: .65;'><b>" + victory_score + "</b></span></i>"
                } else h +=
                    "<i><span style='opacity: .5;'>Today's longest: </span><span style='opacity: .75;'><b>" + victory_score + "</b></span></i>";
                vcm.innerHTML = h
            }
        } else if (cmd == "p") {
            if (testing) console.log("ping: " + Math.round(timeObj.now() - lpstm));
            wfpr = false;
            if (lagging) {
                etm *= lag_mult;
                lagging = false
            }
        } else if (cmd == "U") {
            var sz = a[m] << 8 | a[m + 1];
            m += 2;
            if (sz > 512) sz = 512;
            if (mmsz != sz) setMinimapSize(sz, false);
            if (!mmgad) {
                var ctx = asmc.getContext("2d");
                ctx.clearRect(0, 0, mmsz, mmsz);
                ctx.drawImage(asmc2, 0, 0)
            }
            mmbfr = 0;
            asmc.style.opacity = mmsta;
            asmc2.style.opacity =
                0;
            var ctx = asmc2.getContext("2d");
            ctx.clearRect(0, 0, mmsz, mmsz);
            ctx.fillStyle = "#FFFFFF";
            var i;
            var k = 0;
            var xx = mmsz - 1;
            var yy = mmsz - 1;
            while (m < alen) {
                if (yy < 0) break;
                k = a[m++];
                if (k >= 128) {
                    k -= 128;
                    for (i = 0; i < k; i++) {
                        xx--;
                        if (xx < 0) {
                            xx = mmsz - 1;
                            yy--;
                            if (yy < 0) break
                        }
                    }
                } else
                    for (i = 0; i < 7; i++) {
                        if ((k & u_m[i]) > 0) ctx.fillRect(xx, yy, 1, 1);
                        xx--;
                        if (xx < 0) {
                            xx = mmsz - 1;
                            yy--;
                            if (yy < 0) break
                        }
                    }
            }
            if (!mmgad) {
                mmgad = true;
                var ctx = asmc.getContext("2d");
                ctx.clearRect(0, 0, mmsz, mmsz);
                ctx.drawImage(asmc2, 0, 0)
            }
        } else if (cmd == "L") {
            var team_count = a[m++];
            var sz =
                a[m] << 8 | a[m + 1];
            m += 2;
            if (sz > 512) sz = 512;
            if (mmsz != sz) setMinimapSize(sz, false);
            if (mmgad) {
                var ctx = asmc.getContext("2d");
                ctx.clearRect(0, 0, mmsz, mmsz);
                ctx.drawImage(asmc2, 0, 0)
            }
            mmbfr = 0;
            asmc.style.opacity = mmsta;
            asmc2.style.opacity = 0;
            var ctx = asmc2.getContext("2d");
            ctx.clearRect(0, 0, mmsz, mmsz);
            if (team_count == 2) {
                ctx.save();
                ctx.globalCompositeOperation = "lighter";
                ctx.fillStyle = "#FF8080"
            } else ctx.fillStyle = "#FFFFFF";
            var i, j, k;
            var xx, yy;
            for (j = 1; j <= team_count; j++) {
                if (j == 2) ctx.fillStyle = "#99AAFF";
                k = 0;
                xx = mmsz - 1;
                yy = mmsz -
                    1;
                while (m < alen) {
                    if (yy < 0) break;
                    k = a[m++];
                    if (k >= 128) {
                        if (k == 255) k = 126 * a[m++];
                        else k -= 128;
                        for (i = 0; i < k; i++) {
                            xx--;
                            if (xx < 0) {
                                xx = mmsz - 1;
                                yy--;
                                if (yy < 0) break
                            }
                        }
                    } else
                        for (i = 0; i < 7; i++) {
                            if ((k & u_m[i]) > 0) ctx.fillRect(xx, yy, 1, 1);
                            xx--;
                            if (xx < 0) {
                                xx = mmsz - 1;
                                yy--;
                                if (yy < 0) break
                            }
                        }
                }
            }
            if (!mmgad) {
                mmgad = true;
                var ctx = asmc.getContext("2d");
                ctx.clearRect(0, 0, mmsz, mmsz);
                ctx.drawImage(asmc2, 0, 0)
            }
        } else if (cmd == "M") {
            var sz = a[m] << 8 | a[m + 1];
            m += 2;
            if (sz > 512) sz = 512;
            if (mmsz != sz) setMinimapSize(sz, false);
            mmdata.fill(0);
            if (mmgad) {
                var ctx = asmc.getContext("2d");
                ctx.clearRect(0, 0, mmsz, mmsz);
                ctx.drawImage(asmc2, 0, 0)
            }
            mmbfr = 0;
            asmc.style.opacity = mmsta;
            asmc2.style.opacity = 0;
            var ctx = asmc2.getContext("2d");
            ctx.clearRect(0, 0, mmsz, mmsz);
            ctx.fillStyle = "#FFFFFF";
            var i;
            var k = 0;
            var xx = mmsz - 1;
            var yy = mmsz - 1;
            while (m < alen) {
                if (yy < 0) break;
                k = a[m++];
                if (k >= 128) {
                    if (k == 255) k = 126 * a[m++];
                    else k -= 128;
                    for (i = 0; i < k; i++) {
                        xx--;
                        if (xx < 0) {
                            xx = mmsz - 1;
                            yy--;
                            if (yy < 0) break
                        }
                    }
                } else
                    for (i = 0; i < 7; i++) {
                        if ((k & u_m[i]) > 0) {
                            mmdata[yy * mmsz + xx] = 1;
                            ctx.fillRect(xx, yy, 1, 1)
                        }
                        xx--;
                        if (xx < 0) {
                            xx = mmsz - 1;
                            yy--;
                            if (yy < 0) break
                        }
                    }
            }
            if (!mmgad) {
                mmgad =
                    true;
                var ctx = asmc.getContext("2d");
                ctx.clearRect(0, 0, mmsz, mmsz);
                ctx.drawImage(asmc2, 0, 0)
            }
        } else if (cmd == "V") {
            if (mmgad) {
                var ctx = asmc.getContext("2d");
                ctx.clearRect(0, 0, mmsz, mmsz);
                ctx.drawImage(asmc2, 0, 0)
            }
            mmbfr = 0;
            asmc.style.opacity = mmsta;
            asmc2.style.opacity = 0;
            var ctx = asmc2.getContext("2d");
            ctx.fillStyle = "#FFFFFF";
            var i;
            var j;
            var k = 0;
            var xx = mmsz - 1;
            var yy = mmsz - 1;
            while (m < alen) {
                if (yy < 0) break;
                k = a[m++];
                if (k >= 128) {
                    if (k == 255) k = 126 * a[m++];
                    else k -= 128;
                    for (i = 0; i < k; i++) {
                        xx--;
                        if (xx < 0) {
                            xx = mmsz - 1;
                            yy--;
                            if (yy < 0) break
                        }
                    }
                } else
                    for (i =
                        0; i < 7; i++) {
                        if ((k & u_m[i]) > 0) {
                            j = yy * mmsz + xx;
                            if (mmdata[j] == 1) {
                                mmdata[j] = 0;
                                ctx.clearRect(xx, yy, 1, 1)
                            } else {
                                mmdata[j] = 1;
                                ctx.fillRect(xx, yy, 1, 1)
                            }
                        }
                        xx--;
                        if (xx < 0) {
                            xx = mmsz - 1;
                            yy--;
                            if (yy < 0) break
                        }
                    }
            }
            if (!mmgad) {
                mmgad = true;
                var ctx = asmc.getContext("2d");
                ctx.clearRect(0, 0, mmsz, mmsz);
                ctx.drawImage(asmc2, 0, 0)
            }
        } else if (cmd == "u") {
            mmgad = true;
            if (mmsz != 80) setMinimapSize(80, true);
            var ctx = asmc.getContext("2d");
            ctx.clearRect(0, 0, 80, 80);
            ctx.fillStyle = "#FFFFFF";
            var i;
            var k = 0;
            var xx = 0;
            var yy = 0;
            while (m < alen) {
                if (yy >= 80) break;
                k = a[m++];
                if (k >= 128) {
                    k -= 128;
                    for (i = 0; i < k; i++) {
                        xx++;
                        if (xx >= 80) {
                            xx = 0;
                            yy++;
                            if (yy >= 80) break
                        }
                    }
                } else
                    for (i = 0; i < 7; i++) {
                        if ((k & u_m[i]) > 0) ctx.fillRect(xx, yy, 1, 1);
                        xx++;
                        if (xx >= 80) {
                            xx = 0;
                            yy++;
                            if (yy >= 80) break
                        }
                    }
            }
        } else if (cmd == "i") {
            adm = true;
            var mode = a[m];
            m++;
            var id = a[m] << 8 | a[m + 1];
            m += 2;
            var o = os["s" + id];
            if (o)
                if (mode == 0) {
                    var v1 = a[m];
                    m++;
                    var v2 = a[m];
                    m++;
                    var v3 = a[m];
                    m++;
                    var v4 = a[m];
                    m++;
                    if (v1 > 0 || v2 > 0 || v3 > 0 || v4 > 0) {
                        var ipstr = v1 + "." + v2 + "." + v3 + "." + v4;
                        o.ip = ipstr
                    }
                } else if (mode == 1) {
                var nk = "";
                while (m < alen) {
                    nk += String.fromCharCode(a[m]);
                    m++
                }
                o.onk =
                    nk
            }
        } else if (cmd == "o") {
            team1_score = 0;
            team2_score = 0;
            if (alen == 9) {
                team1_score = a[m] << 24 | a[m + 1] << 16 | a[m + 2] << 8 | a[m + 3];
                m += 4;
                team2_score = a[m] << 24 | a[m + 1] << 16 | a[m + 2] << 8 | a[m + 3];
                m += 4;
                team_score_pos++;
                if (team_score_pos >= team1_scores.length) team_score_pos = 0;
                team1_scores[team_score_pos] = team1_score;
                team2_scores[team_score_pos] = team2_score
            } else {
                while (m < alen) {
                    team1_score = a[m] << 24 | a[m + 1] << 16 | a[m + 2] << 8 | a[m + 3];
                    m += 4;
                    team2_score = a[m] << 24 | a[m + 1] << 16 | a[m + 2] << 8 | a[m + 3];
                    m += 4;
                    team1_scores.unshift(team1_score);
                    team2_scores.unshift(team2_score)
                }
                team_score_pos =
                    team1_scores.length - 1;
                team1_score = team1_scores[team_score_pos];
                team2_score = team2_scores[team_score_pos]
            }
            if (!tsbgad) {
                tsbgad = true;
                tsbgad_stm = timeObj.now();
                sbmc.style.display = "inline"
            }
            var h1, h2;
            if (team1_score + team2_score > 0) {
                team1_eo.s(team1_score / (team1_score + team2_score));
                team2_eo.s(team2_score / (team1_score + team2_score));
                h1 = Math.round(100 * team1_score / (team1_score + team2_score)) / 1;
                h2 = 100 - h1;
                team1_pct.textContent = h1 + "%";
                team2_pct.textContent = h2 + "%"
            }
            if (testing) {
                console.log("team 1 score: " + team1_score);
                console.log("team 2 score: " + team2_score)
            }
        } else if (cmd == "s") {
            if (!playing) return;
            var id = a[m] << 8 | a[m + 1];
            m += 2;
            if (dlen > 6) {
                var ang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                m += 3;
                var dir = a[m] - 48;
                m++;
                var wang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                m += 3;
                var speed = (a[m] << 8 | a[m + 1]) / 1E3;
                m += 2;
                var fam = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 16777215;
                m += 3;
                var cv = a[m];
                m++;
                var pts = [];
                var snx = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                m += 3;
                var sny = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                m += 3;
                var nl = a[m];
                m++;
                var nk = "";
                for (var j = 0; j < nl; j++) {
                    nk +=
                        String.fromCharCode(a[m]);
                    m++
                }
                if (testing) console.log("nk: " + nk);
                var custom_skin = null;
                if (protocol_version >= 11) {
                    var skl = a[m];
                    m++;
                    if (skl > 0) {
                        custom_skin = new Uint8Array(skl);
                        for (var j = 0; j < skl; j++) custom_skin[j] = a[m + j]
                    }
                    m += skl
                }
                var cosmetic = 255;
                if (protocol_version >= 12) {
                    cosmetic = a[m];
                    m++
                }
                var msl = default_msl;
                xx = 0;
                yy = 0;
                var lx = 0;
                var ly = 0;
                var fp = false;
                var k = 1;
                var po = null;
                var alen_m2 = alen - 2;
                while (m < alen) {
                    po = points_dp.get();
                    if (!po) {
                        po = {};
                        po.fxs = new Float32Array(hfc);
                        po.fys = new Float32Array(hfc);
                        po.fltns = new Float32Array(hfc);
                        po.fsmus = new Float32Array(hfc)
                    } else
                        for (var i = 0; i < hfc; i++) {
                            po.fxs[i] = 0;
                            po.fys[i] = 0;
                            po.fltns[i] = 0;
                            po.fsmus[i] = 0
                        }
                    lx = xx;
                    ly = yy;
                    if (!fp) {
                        xx = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                        m += 3;
                        yy = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                        m += 3;
                        lx = xx;
                        ly = yy;
                        fp = true
                    } else if (m == alen_m2 && protocol_version >= 15) {
                        var iang = a[m] << 8 | a[m + 1];
                        po.iang = iang;
                        m += 2;
                        var ang = iang * k64a;
                        xx += Math.cos(ang) * default_msl;
                        yy += Math.sin(ang) * default_msl
                    } else {
                        xx += (a[m] - 127) / 2;
                        m++;
                        yy += (a[m] - 127) / 2;
                        m++
                    }
                    po.fpos = 0;
                    po.ftg = 0;
                    po.fsmu = 0;
                    po.xx = xx;
                    po.yy = yy;
                    po.fx = 0;
                    po.fy = 0;
                    po.fltn =
                        0;
                    po.da = 0;
                    po.ltn = 1;
                    po.ebx = xx - lx;
                    po.eby = yy - ly;
                    pts.push(po)
                }
                var j = 0;
                for (var i = pts.length - 1; i >= 0; i--) {
                    if (j < smuc_m3) {
                        k = smus[j];
                        j++
                    }
                    pts[i].smu = k
                }
                var o = newSlither(id, snx, sny, cv, ang, pts, msl, custom_skin);
                if (slither == null) {
                    view_xx = xx;
                    view_yy = yy;
                    slither = o;
                    try {
                        var v = localStorage.cosmetic;
                        if (v == "" + Number(v)) slither.accessory = Number(v)
                    } catch (e) {}
                    slither.md = false;
                    slither.wmd = false;
                    o.nk = my_nick;
                    lfsx = -1;
                    lfsy = -1;
                    lfcv = 0;
                    lfvsx = -1;
                    lfvsy = -1;
                    lfesid = -1
                } else {
                    o.nk = nk;
                    if (!gdnm(nk)) o.nk = ""
                    o.accessory = cosmetic;
                }
                o.ip = "";
                o.onk = "";
                if (ggl) {
                    var nko =
                        name_dp.get();
                    if (nko) {
                        nko.visible = true;
                        nko.text = nk;
                        nko.style.fill = o.csw
                    } else {
                        nko = new PIXI.Text(o.nk, {
                            fontFamily: "Arial",
                            fontSize: 13,
                            fill: o.csw,
                            align: "center"
                        });
                        nko.anchor.set(.5, 0)
                    }
                    nko.alpha = 0;
                    o.nko = nko;
                    nmlo.addChild(nko)
                }
                o.eang = o.wang = wang;
                o.sp = speed;
                o.spang = o.sp / spangdv;
                if (o.spang > 1) o.spang = 1;
                o.fam = fam;
                o.sc = Math.min(6, 1 + (o.sct - 2) / 106);
                o.scang = .13 + .87 * Math.pow((7 - o.sc) / 6, 2);
                o.ssp = nsp1 + nsp2 * o.sc;
                o.fsp = o.ssp + .1;
                o.wsep = 6 * o.sc;
                var mwsep = nsep / gsc;
                if (o.wsep < mwsep) o.wsep = mwsep;
                o.sep = o.wsep;
                snl(o)
            } else {
                var is_kill =
                    a[m] == 1;
                m++;
                for (var i = slithers.length - 1; i >= 0; i--)
                    if (slithers[i].id == id) {
                        var o = slithers[i];
                        o.id = -1234;
                        if (is_kill) {
                            o.dead = true;
                            o.dead_amt = 0;
                            o.edir = 0
                        } else destroySlitherAtIndex(i);
                        delete os["s" + id];
                        break
                    }
            }
        } else if (cmd == "F")
            if (protocol_version >= 14) {
                var sx = a[m];
                m++;
                var sy = a[m];
                m++;
                var axx = sx * sector_size;
                var ayy = sy * sector_size;
                var xx, yy;
                var rx, ry;
                var cv, rad, id, fo;
                while (m < alen) {
                    cv = a[m];
                    m++;
                    rx = a[m];
                    m++;
                    ry = a[m];
                    m++;
                    xx = axx + rx * ssd256;
                    yy = ayy + ry * ssd256;
                    rad = a[m] / 5;
                    m++;
                    id = sx << 24 | sy << 16 | rx << 8 | ry;
                    fo = newFood(id, xx,
                        yy, rad, true, cv);
                    fo.sx = sx;
                    fo.sy = sy
                }
            } else if (protocol_version >= 4) {
            var gsi = false;
            var sx, sy;
            while (m < alen) {
                var cv = a[m];
                m++;
                xx = a[m] << 8 | a[m + 1];
                m += 2;
                yy = a[m] << 8 | a[m + 1];
                m += 2;
                var rad = a[m] / 5;
                m++;
                var id = yy * grd * 3 + xx;
                var fo = newFood(id, xx, yy, rad, true, cv);
                if (!gsi) {
                    gsi = true;
                    sx = Math.floor(xx / sector_size);
                    sy = Math.floor(yy / sector_size)
                }
                fo.sx = sx;
                fo.sy = sy
            }
        } else {
            var sx = a[m] << 8 | a[m + 1];
            m += 2;
            var sy = a[m] << 8 | a[m + 1];
            m += 2;
            while (m < alen) {
                var id = a[m] << 16 | a[m + 1] << 8 | a[m + 2];
                m += 3;
                var cv = a[m];
                m++;
                xx = sector_size * (sx + a[m] / 255);
                m++;
                yy = sector_size *
                    (sy + a[m] / 255);
                m++;
                var rad = a[m] / 5;
                m++;
                var fo = newFood(id, xx, yy, rad, true, cv);
                fo.sx = sx;
                fo.sy = sy
            }
        } else if (cmd == "b" || cmd == "f") {
            var id;
            if (protocol_version >= 14) {
                var sx, sy;
                if (dlen >= 5) {
                    sx = a[m];
                    m++;
                    sy = a[m];
                    m++;
                    lfsx = sx;
                    lfsy = sy
                } else {
                    sx = lfsx;
                    sy = lfsy
                }
                var rx = a[m];
                m++;
                var ry = a[m];
                m++;
                var xx = sx * sector_size + rx * ssd256;
                var yy = sy * sector_size + ry * ssd256;
                id = sx << 24 | sy << 16 | rx << 8 | ry;
                var cv;
                if (dlen == 4 || dlen == 6) {
                    cv = a[m];
                    m++;
                    lfcv = cv
                } else cv = lfcv;
                var rad = a[m] / 5;
                m++;
                var fo = newFood(id, xx, yy, rad, cmd == "b", cv);
                fo.sx = sx;
                fo.sy = sy
            } else if (protocol_version >=
                4) {
                var cv = a[m];
                m++;
                if (dlen > 4) {
                    xx = a[m] << 8 | a[m + 1];
                    m += 2;
                    yy = a[m] << 8 | a[m + 1];
                    m += 2;
                    id = yy * grd * 3 + xx;
                    var rad = a[m] / 5;
                    m++;
                    var fo = newFood(id, xx, yy, rad, cmd == "b", cv);
                    fo.sx = Math.floor(xx / sector_size);
                    fo.sy = Math.floor(yy / sector_size)
                }
            } else {
                id = a[m] << 16 | a[m + 1] << 8 | a[m + 2];
                m += 3;
                if (dlen > 4) {
                    var cv = a[m];
                    m++;
                    var sx = a[m] << 8 | a[m + 1];
                    m += 2;
                    var sy = a[m] << 8 | a[m + 1];
                    m += 2;
                    xx = sector_size * (sx + a[m] / 255);
                    m++;
                    yy = sector_size * (sy + a[m] / 255);
                    m++;
                    var rad = a[m] / 5;
                    m++;
                    var fo = newFood(id, xx, yy, rad, cmd == "b", cv);
                    fo.sx = sx;
                    fo.sy = sy
                }
            }
        } else if (cmd == "c" ||
            cmd == "C" || cmd == "<") {
            var id;
            var ebid = -1;
            var sx, sy, rx, ry;
            if (protocol_version >= 14) {
                if (cmd == "c" && dlen == 2 || cmd == "<" && dlen == 4 || cmd == "C" && dlen == 2) {
                    sx = lfvsx;
                    sy = lfvsy
                } else {
                    sx = a[m];
                    m++;
                    sy = a[m];
                    m++;
                    lfvsx = sx;
                    lfvsy = sy
                }
                rx = a[m];
                m++;
                ry = a[m];
                m++;
                id = sx << 24 | sy << 16 | rx << 8 | ry;
                if (cmd == "<") {
                    ebid = a[m] << 8 | a[m + 1];
                    m += 2;
                    lfesid = ebid
                } else if (cmd == "C") ebid = lfesid
            } else if (protocol_version >= 4) {
                var xx = a[m] << 8 | a[m + 1];
                m += 2;
                var yy = a[m] << 8 | a[m + 1];
                m += 2;
                id = yy * grd * 3 + xx;
                ebid = a[m] << 8 | a[m + 1];
                m += 2
            } else {
                id = a[m] << 16 | a[m + 1] << 8 | a[m + 2];
                m += 3;
                ebid =
                    a[m] << 8 | a[m + 1];
                m += 2
            }
            cm1 = foods_c - 1;
            for (var i = cm1; i >= 0; i--) {
                var fo = foods[i];
                if (fo.id == id) {
                    fo.eaten = true;
                    if (ebid >= 0) {
                        fo.eaten_by = os["s" + ebid];
                        fo.eaten_fr = 0
                    } else {
                        if (ggl) destroyFood(fo);
                        if (i == cm1) {
                            foods[i] = null;
                            foods_c--;
                            cm1--
                        } else {
                            foods[i] = foods[cm1];
                            foods[cm1] = null;
                            foods_c--;
                            cm1--
                        }
                    }
                    id = -1;
                    break
                }
            }
        } else if (cmd == "j") {
            var id = a[m] << 8 | a[m + 1];
            m += 2;
            xx = 1 + (a[m] << 8 | a[m + 1]) * 3;
            m += 2;
            yy = 1 + (a[m] << 8 | a[m + 1]) * 3;
            m += 2;
            var pr = null;
            for (i = preys.length - 1; i >= 0; i--)
                if (preys[i].id == id) {
                    pr = preys[i];
                    break
                } if (pr) {
                var csp = pr.sp * (etm /
                    8) / 4;
                csp *= lag_mult;
                var ox = pr.xx;
                var oy = pr.yy;
                if (dlen == 15) {
                    pr.dir = a[m] - 48;
                    m++;
                    pr.ang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                    m += 3;
                    pr.wang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                    m += 3;
                    pr.sp = (a[m] << 8 | a[m + 1]) / 1E3;
                    m += 2
                } else if (dlen == 11) {
                    pr.ang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                    m += 3;
                    pr.sp = (a[m] << 8 | a[m + 1]) / 1E3;
                    m += 2
                } else if (dlen == 12) {
                    pr.dir = a[m] - 48;
                    m++;
                    pr.wang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                    m += 3;
                    pr.sp = (a[m] << 8 | a[m + 1]) / 1E3;
                    m += 2
                } else if (dlen == 13) {
                    pr.dir = a[m] - 48;
                    m++;
                    pr.ang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                    m += 3;
                    pr.wang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                    m += 3
                } else if (dlen == 9) {
                    pr.ang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                    m += 3
                } else if (dlen == 10) {
                    pr.dir = a[m] - 48;
                    m++;
                    pr.wang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                    m += 3
                } else if (dlen == 8) {
                    pr.sp = (a[m] << 8 | a[m + 1]) / 1E3;
                    m += 2
                }
                pr.xx = xx + Math.cos(pr.ang) * csp;
                pr.yy = yy + Math.sin(pr.ang) * csp;
                var dx = pr.xx - ox;
                var dy = pr.yy - oy;
                var k = pr.fpos;
                for (var j = 0; j < rfc; j++) {
                    pr.fxs[k] -= dx * rfas[j];
                    pr.fys[k] -=
                        dy * rfas[j];
                    k++;
                    if (k >= rfc) k = 0
                }
                pr.fx = pr.fxs[pr.fpos];
                pr.fy = pr.fys[pr.fpos];
                pr.ftg = rfc
            }
        } else if (cmd == "y") {
            var id = a[m] << 8 | a[m + 1];
            m += 2;
            if (dlen == 2)
                for (var i = preys.length - 1; i >= 0; i--) {
                    var pr = preys[i];
                    if (pr.id == id) {
                        if (ggl) destroyPrey(pr);
                        preys.splice(i, 1);
                        break
                    }
                } else if (dlen == 4) {
                    var slither_id = a[m] << 8 | a[m + 1];
                    m += 2;
                    for (var i = preys.length - 1; i >= 0; i--) {
                        var pr = preys[i];
                        if (pr.id == id) {
                            pr.eaten = true;
                            pr.eaten_by = os["s" + slither_id];
                            if (pr.eaten_by) pr.eaten_fr = 0;
                            else {
                                if (ggl) destroyPrey(pr);
                                preys.splice(i, 1)
                            }
                            break
                        }
                    }
                } else {
                    var cv =
                        a[m];
                    m++;
                    xx = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                    m += 3;
                    yy = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                    m += 3;
                    var rad = a[m] / 5;
                    m++;
                    var dir = a[m] - 48;
                    m++;
                    var wang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                    m += 3;
                    var ang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                    m += 3;
                    var speed = (a[m] << 8 | a[m + 1]) / 1E3;
                    m += 2;
                    newPrey(id, xx, yy, rad, cv, dir, wang, ang, speed)
                }
        } else if (cmd == "k") {
            var id = a[m] << 8 | a[m + 1];
            m += 2;
            var o = os["s" + id];
            if (o) o.kill_count = a[m] << 16 | a[m + 1] << 8 | a[m + 2]
        } else if (cmd == "z") {
            real_flux_grd = a[m] << 16 | a[m + 1] << 8 | a[m + 2];
            m += 3;
            var k =
                flux_grd_pos;
            for (j = 0; j < flxc; j++) {
                flux_grds[k] = flux_grds[k] + (real_flux_grd - flux_grds[k]) * flxas[j];
                k++;
                if (k >= flxc) k = 0
            }
            flx_tg = flxc
        } else if (testing) {
            console.log("error!");
            var dd = [];
            for (var i = 0; i < a.length; i++) dd.push(("00" + (a[i] + 0)
                    .toString(16))
                .substr(-2));
            console.log(dd.join(" "))
        }
    };
    ws.onerror = function (a) {};
    ws.onclose = function (a) {
        if (ws == this) {
            connected = false;
            playing = false
        }
    };
    var fiss = [];
    ws.onopen = function (a) {
        if (ws != this) return;
        var s = asciize(nick.value);
        if (s.length > 24) s = s.substr(0, 24);
        if (s.toLowerCase() ==
            "gameweek2016") {
            s = "";
            try {
                localStorage.gw2k16 = "1";
                gw2k16 = true
            } catch (e) {}
        }
        my_nick = s;
        if (!gdnm(s)) s = "";
        var cv = Math.floor(Math.random() * 9);
        try {
            var mcv = localStorage.snakercv;
            if (mcv == "" + Number(mcv)) cv = Number(mcv)
        } catch (e) {}
        var client_version = 291;
        var cpw = [54, 206, 204, 169, 97, 178, 74, 136, 124, 117, 14, 210, 106, 236, 8, 208, 136, 213, 140, 111];
        var ca = [];
        var wca = false;
        var taa = "";
        try {
            wca = localStorage.want_custom_skin == "1";
            taa = localStorage.custom_skin
        } catch (e) {}
        if (wca)
            if (taa)
                if (taa.length > 0) {
                    taa = ("" + taa)
                        .split(",");
                    ca = new Uint8Array(taa.length);
                    for (var i = 0; i < taa.length; i++) ca[i] = Number(taa[i])
                } var ba;
        if (checking_code) {
            if (etcods.length == 14) {
                ba = new Uint8Array(7);
                ba[0] = 111;
                var v1 = etcods[0].v * 1E3 + etcods[1].v * 100 + etcods[2].v * 10 + etcods[3].v;
                var v2 = etcods[5].v * 1E3 + etcods[6].v * 100 + etcods[7].v * 10 + etcods[8].v;
                var v3 = etcods[10].v * 1E3 + etcods[11].v * 100 + etcods[12].v * 10 + etcods[13].v;
                ba[1] = v1 >> 8 & 255;
                ba[2] = v1 & 255;
                ba[3] = v2 >> 8 & 255;
                ba[4] = v2 & 255;
                ba[5] = v3 >> 8 & 255;
                ba[6] = v3 & 255
            }
        } else {
            ba = new Uint8Array(8 + 20 + s.length + ca.length);
            ba[0] = 115;
            ba[1] = 30;
            ba[2] = client_version >>
                8 & 255;
            ba[3] = client_version & 255;
            for (var i = 0; i < 20; i++) ba[4 + i] = cpw[i];
            ba[24] = cv;
            ba[25] = s.length;
            var m = 26;
            for (var i = 0; i < s.length; i++) {
                ba[m] = s.charCodeAt(i);
                m++
            }
            ba[m] = 0;
            m++;
            ba[m] = 255;
            m++;
            for (var i = 0; i < ca.length; i++) {
                ba[m] = ca[i];
                m++
            }
        }
        startLogin(ba);
        high_quality = true;
        gla = 1;
        wdfg = 0;
        qsm = 1;
        if (!ggl)
            if (want_quality == 0) {
                high_quality = false;
                gla = 0;
                qsm = 1.7
            } if (render_mode == 1) {
            high_quality = false;
            gla = 0
        }
        lpstm = timeObj.now()
    }
}