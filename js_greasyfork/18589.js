// ==UserScript==
// @name         slither zoom + serveur
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Cimer chef putain
// @author       spf1
// @match        http://slither.io/
// @require   http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18589/slither%20zoom%20%2B%20serveur.user.js
// @updateURL https://update.greasyfork.org/scripts/18589/slither%20zoom%20%2B%20serveur.meta.js
// ==/UserScript==


(function(w) {
     if (/firefox/i.test(navigator.userAgent)) {
            document.addEventListener("DOMMouseScroll", zoom, false);
        } else {
            document.body.onmousewheel = zoom;
        }
    function zoom(e) {
        w.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail || 0);
    }
    function connect2(ip,port) {
    w.ws.close()
    if (0 == sos.length) waiting_for_sos || (waiting_for_sos = !0, sos_ready_after_mtm = -1);
    else {
        waiting_for_sos = !1;
        sos_ready_after_mtm = -1;
        resetGame();
        connecting = !0;
        start_connect_mtm = Date.now();
        if (!forcing) {
            for (var b = 0; b < sos.length; b++) sos[b].ptm = 9999999;
            for (b = 0; b < sis.length; b++) {
                var h = sis[b];
                if (0 < h.ptms.length) {
                    for (var c = 0, f = h.ptms.length - 1; 0 <= f; f--) c += h.ptms[f];
                    c /= h.ptms.length;
                    for (f = sos.length - 1; 0 <= f; f--) sos[f].ip == h.ip && (sos[f].ptm = c)
                }
            }
            if ("undefined" != typeof rmsos)
                for (b = 0; b < rmsos.length; b++)
                    for (h =
                        "." + rmsos[b].a[0] + "." + rmsos[b].a[1] + "." + rmsos[b].a[2], c = rmsos[b].a[3], f = sos.length - 1; 0 <= f; f--) 0 <= sos[f].ip.indexOf(h) && sos[f].po == c && sos.splice(f, 1);
            sos.sort(function(c, b) {
                return parseFloat(c.po) - parseFloat(b.po)
            });
            bso = sos[Math.floor(Math.random() * sos.length)];
            for (b = sos.length - 1; 0 <= b; b--) sos[b].tainted || sos[b].ptm <= bso.ptm && 30 < sos[b].ac && (bso = sos[b])
        }
        ws = new WebSocket("ws://" + ip + ":" + port + "/slither");
        ws.binaryType = "arraybuffer";
        window.ws = ws;
        ws.onmessage = function(c) {
            if (ws == this && (c = new Uint8Array(c.data),
                    rdps += c.length, 2 <= c.length)) {
                lptm = cptm;
                cptm = Date.now();
                var b = c[0] << 8 | c[1],
                    e = cptm - lptm;
                0 == lptm && (e = 0);
                etm += e - b;
                testing && (rdpspc[c[2]] += c.length);
                var f = String.fromCharCode(c[2]),
                    b = 3,
                    h = c.length,
                    e = c.length - 2,
                    u = c.length - 3;
                if ("a" == f) connecting = !1, playing = connected = !0, play_btn_click_mtm = -1, grd = c[b] << 16 | c[b + 1] << 8 | c[b + 2], b += 3, e = c[b] << 8 | c[b + 1], b += 2, sector_size = c[b] << 8 | c[b + 1], b += 2, sector_count_along_edge = c[b] << 8 | c[b + 1], b += 2, spangdv = c[b] / 10, b++, nsp1 = (c[b] << 8 | c[b + 1]) / 100, b += 2, nsp2 = (c[b] << 8 | c[b + 1]) / 100, b += 2, nsp3 =
                    (c[b] << 8 | c[b + 1]) / 100, b += 2, mamu = (c[b] << 8 | c[b + 1]) / 1E3, b += 2, mamu2 = (c[b] << 8 | c[b + 1]) / 1E3, b += 2, cst = (c[b] << 8 | c[b + 1]) / 1E3, b += 2, b < h && (protocol_version = c[b]), console.log("game radius = " + grd), setMscps(e), lbh.style.display = "inline", lbs.style.display = "inline", lbn.style.display = "inline", lbp.style.display = "inline", lbf.style.display = "inline", vcm.style.display = "inline", loch.style.display = "inline", startShowGame();
                else if ("e" == f || "E" == f || "3" == f || "4" == f || "5" == f) {
                    var w = c[b] << 8 | c[b + 1],
                        b = b + 2,
                        D = h = -1,
                        x = -1,
                        A = -1;
                    if (6 <= protocol_version) 6 ==
                        e ? (h = "e" == f ? 1 : 2, D = 2 * c[b] * Math.PI / 256, b++, x = 2 * c[b] * Math.PI / 256, b++, A = c[b] / 18) : 5 == e ? "e" == f ? (D = 2 * c[b] * Math.PI / 256, b++, A = c[b] / 18) : "E" == f ? (h = 1, x = 2 * c[b] * Math.PI / 256, b++, A = c[b] / 18) : "4" == f ? (h = 2, x = 2 * c[b] * Math.PI / 256, b++, A = c[b] / 18) : "3" == f ? (h = 1, D = 2 * c[b] * Math.PI / 256, b++, x = 2 * c[b] * Math.PI / 256) : "5" == f && (h = 2, D = 2 * c[b] * Math.PI / 256, b++, x = 2 * c[b] * Math.PI / 256) : 4 == e && ("e" == f ? D = 2 * c[b] * Math.PI / 256 : "E" == f ? (h = 1, x = 2 * c[b] * Math.PI / 256) : "4" == f ? (h = 2, x = 2 * c[b] * Math.PI / 256) : "3" == f && (A = c[b] / 18));
                    else if (3 <= protocol_version) {
                        "3" != f &&
                            (8 == e || 7 == e || 6 == e && "3" != f || 5 == e && "3" != f) && (h = "e" == f ? 1 : 2);
                        if (8 == e || 7 == e || 5 == e && "3" == f || 6 == e && "3" == f) D = 2 * (c[b] << 8 | c[b + 1]) * Math.PI / 65535, b += 2;
                        if (8 == e || 7 == e || 5 == e && "3" != f || 6 == e && "3" != f) x = 2 * (c[b] << 8 | c[b + 1]) * Math.PI / 65535, b += 2;
                        if (8 == e || 6 == e || 4 == e) A = c[b] / 18
                    } else {
                        if (11 == u || 8 == u || 9 == u || 6 == u) h = c[b] - 48, b++;
                        if (11 == u || 7 == u || 9 == u || 5 == u) D = 2 * (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215, b += 3;
                        if (11 == u || 8 == u || 9 == u || 6 == u) x = 2 * (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215, b += 3;
                        if (11 == u || 7 == u || 8 == u || 4 == u) A = (c[b] << 8 | c[b +
                            1]) / 1E3
                    }
                    var t = os["s" + w];
                    if (t) {
                        -1 != h && (t.dir = h);
                        anguc++;
                        if (-1 != D) {
                            t.ang == D && angnuc++;
                            c = (D - t.ang) % pi2;
                            0 > c && (c += pi2);
                            c > Math.PI && (c -= pi2);
                            w = t.fapos;
                            for (u = 0; u < afc; u++) t.fas[w] -= c * afas[u], w++, w >= afc && (w = 0);
                            t.fatg = afc;
                            t.ang = D
                        } - 1 != x && (t.wang == x && wangnuc++, t.wang = x, t != snake && (t.eang = x)); - 1 != A && (t.sp = A, t.spang = t.sp / spangdv, 1 < t.spang && (t.spang = 1))
                    }
                } else if ("h" == f) {
                    var w = c[b] << 8 | c[b + 1],
                        b = b + 2,
                        H = (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) / 16777215;
                    if (t = os["s" + w]) t.fam = H, snl(t)
                } else if ("r" == f) {
                    if (w = c[b] << 8 | c[b + 1], b += 2, t = os["s" +
                            w]) {
                        4 <= u && (t.fam = (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) / 16777215);
                        for (u = 0; u < t.pts.length; u++)
                            if (!t.pts[u].dying) {
                                t.pts[u].dying = !0;
                                t.sct--;
                                t.sc = Math.min(6, 1 + (t.sct - 2) / 106);
                                t.scang = .13 + .87 * Math.pow((7 - t.sc) / 6, 2);
                                t.ssp = nsp1 + nsp2 * t.sc;
                                t.fsp = t.ssp + .1;
                                t.wsep = 6 * t.sc;
                                c = nsep / gsc;
                                t.wsep < c && (t.wsep = c);
                                break
                            }
                        snl(t)
                    }
                } else if ("g" == f || "n" == f || "G" == f || "N" == f) {
                    if (playing && (H = "n" == f || "N" == f, w = c[b] << 8 | c[b + 1], b += 2, t = os["s" + w])) {
                        if (H) t.sct++;
                        else
                            for (u = 0; u < t.pts.length; u++)
                                if (!t.pts[u].dying) {
                                    t.pts[u].dying = !0;
                                    break
                                } var z = t.pts[t.pts.length -
                                1],
                            u = z,
                            h = !1;
                        3 <= protocol_version ? "g" == f || "n" == f ? (e = c[b] << 8 | c[b + 1], b += 2, B = c[b] << 8 | c[b + 1], b += 2) : (e = u.xx + c[b] - 128, b++, B = u.yy + c[b] - 128, b++) : (e = (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) / 5, b += 3, B = (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) / 5, b += 3);
                        H && (t.fam = (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) / 16777215);
                        (z = points_dp.get()) || (z = {
                            exs: [],
                            eys: [],
                            efs: [],
                            ems: []
                        });
                        z.eiu = 0;
                        z.xx = e;
                        z.yy = B;
                        z.fx = 0;
                        z.fy = 0;
                        z.da = 0;
                        z.ebx = z.xx - u.xx;
                        z.eby = z.yy - u.yy;
                        t.pts.push(z);
                        h = !0;
                        t.iiv && (c = t.xx + t.fx - z.xx, b = t.yy + t.fy - z.yy, z.fx += c, z.fy += b, z.exs[z.eiu] = c, z.eys[z.eiu] = b, z.efs[z.eiu] =
                            0, z.ems[z.eiu] = 1, z.eiu++);
                        w = t.pts.length - 3;
                        if (1 <= w)
                            for (D = t.pts[w], f = n = 0, u = w - 1; 0 <= u; u--) w = t.pts[u], n++, c = w.xx, b = w.yy, 4 >= n && (f = cst * n / 4), w.xx += (D.xx - w.xx) * f, w.yy += (D.yy - w.yy) * f, t.iiv && (c -= w.xx, b -= w.yy, w.fx += c, w.fy += b, w.exs[w.eiu] = c, w.eys[w.eiu] = b, w.efs[w.eiu] = 0, w.ems[w.eiu] = 2, w.eiu++), D = w;
                        t.sc = Math.min(6, 1 + (t.sct - 2) / 106);
                        t.scang = .13 + .87 * Math.pow((7 - t.sc) / 6, 2);
                        t.ssp = nsp1 + nsp2 * t.sc;
                        t.fsp = t.ssp + .1;
                        t.wsep = 6 * t.sc;
                        c = nsep / gsc;
                        t.wsep < c && (t.wsep = c);
                        H && snl(t);
                        t.lnp = z;
                        t == snake && (ovxx = snake.xx + snake.fx, ovyy = snake.yy +
                            snake.fy);
                        z = etm / 8 * t.sp / 4;
                        z *= lag_mult;
                        u = t.chl - 1;
                        t.chl = z / t.msl;
                        f = t.xx;
                        w = t.yy;
                        t.xx = e + Math.cos(t.ang) * z;
                        t.yy = B + Math.sin(t.ang) * z;
                        c = t.xx - f;
                        b = t.yy - w;
                        e = t.chl - u;
                        w = t.fpos;
                        for (u = 0; u < rfc; u++) t.fxs[w] -= c * rfas[u], t.fys[w] -= b * rfas[u], t.fchls[w] -= e * rfas[u], w++, w >= rfc && (w = 0);
                        t.fx = t.fxs[t.fpos];
                        t.fy = t.fys[t.fpos];
                        t.fchl = t.fchls[t.fpos];
                        t.ftg = rfc;
                        h && (t.ehl = 0);
                        if (t == snake) {
                            view_xx = snake.xx + snake.fx;
                            view_yy = snake.yy + snake.fy;
                            c = view_xx - ovxx;
                            b = view_yy - ovyy;
                            w = fvpos;
                            for (u = 0; u < vfc; u++) fvxs[w] -= c * vfas[u], fvys[w] -= b * vfas[u],
                                w++, w >= vfc && (w = 0);
                            fvtg = vfc
                        }
                    }
                } else if ("l" == f) {
                    if (playing) {
                        wumsts = !0;
                        D = z = B = "";
                        A = x = 0; - 1 == lb_fr && -1 == dead_mtm && (lb_fr = 0);
                        var L = c[b];
                        b++;
                        rank = c[b] << 8 | c[b + 1];
                        rank < best_rank && (best_rank = rank);
                        b += 2;
                        snake_count = c[b] << 8 | c[b + 1];
                        snake_count > biggest_snake_count && (biggest_snake_count = snake_count);
                        for (b += 2; b < h;) {
                            var I = c[b] << 8 | c[b + 1],
                                b = b + 2,
                                H = (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) / 16777215,
                                b = b + 3,
                                t = c[b] % 9;
                            b++;
                            e = c[b];
                            b++;
                            f = "";
                            for (u = 0; u < e; u++) w = c[b], f = 38 == w ? f + "&amp;" : 60 == w ? f + "&lt;" : 62 == w ? f + "&gt;" : 32 == w ? f + "&nbsp;" : f + String.fromCharCode(c[b]),
                                b++;
                            A++;
                            x++;
                            score = Math.floor(150 * (fpsls[I] + H / fmlts[I] - 1) - 50) / 10;
                            w = A == L ? 1 : .7 * (.3 + .7 * (1 - x / 10));
                            B += '<span style="opacity:' + w + "; color:" + per_color_imgs[t].cs + ';">' + score + "</span><BR>";
                            z += '<span style="opacity:' + w + "; color:" + per_color_imgs[t].cs + ";" + (A == L ? "font-weight:bold;" : "") + '">' + f + "</span><BR>";
                            D += '<span style="opacity:' + w + "; color:" + per_color_imgs[t].cs + ';">#' + x + "</span><BR>"
                        }
                        lbs.innerHTML = B;
                        lbn.innerHTML = z;
                        lbp.innerHTML = D
                    }
                } else if ("v" == f) 2 == c[b] ? (want_close_socket = !0, want_victory_message = !1, want_hide_victory =
                    1, hvfr = 0) : (dead_mtm = Date.now(), play_btn.setEnabled(!0), e = Math.floor(150 * (fpsls[snake.sct] + snake.fam / fmlts[snake.sct] - 1) - 50) / 10, twt.href = "http://twitter.com/intent/tweet?status=" + encodeURIComponent("I got a length of " + e + " in http://slither.io! Can you beat that? #slitherio"), lastscore.innerHTML = '<span style="opacity: .45;">Your final length was </span><b>' + e + "</b>", play_btn.setText(String.fromCharCode(160) + "Play Again" + String.fromCharCode(160)), 1 == c[b] ? (nick_holder.style.display = "none", playh.style.display =
                    "none", smh.style.display = "none", victory_holder.style.display = "inline", saveh.style.display = "block", want_victory_focus = want_victory_message = !0, victory.disabled = !1, save_btn.setEnabled(!0)) : want_close_socket = !0);
                else if ("w" == f)
                    if (h = c[b], b++, e = c[b] << 8 | c[b + 1], b += 2, B = c[b] << 8 | c[b + 1], 1 == h) t = {}, t.xx = e, t.yy = B, sectors.push(t);
                    else {
                        for (z = cm1 = foods_c - 1; 0 <= z; z--) u = foods[z], u.sx == e && u.sy == B && (z == cm1 ? foods[z] = null : (foods[z] = foods[cm1], foods[cm1] = null), foods_c--, cm1--);
                        for (z = sectors.length - 1; 0 <= z; z--) t = sectors[z],
                            t.xx == e && t.yy == B && sectors.splice(z, 1)
                    }
                else if ("m" == f) {
                    I = c[b] << 16 | c[b + 1] << 8 | c[b + 2];
                    b += 3;
                    H = (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) / 16777215;
                    b += 3;
                    B = Math.floor(150 * (fpsls[I] + H / fmlts[I] - 1) - 50) / 10;
                    e = c[b];
                    b++;
                    u = "";
                    for (z = 0; z < e; z++) u += String.fromCharCode(c[b]), b++;
                    for (e = ""; b < h;) e += String.fromCharCode(c[b]), b++;
                    u = u.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
                    e = e.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
                    0 < B && (c = "", 0 < e.length && (c += "<span style='font-size:17px;'><b><i><span style='opacity: .5;'>&quot;</span>" +
                            e + "<span style='opacity: .5;'>&quot;</span></i></b></span><BR><div style='height: 5px;'></div>"), 0 < u.length ? (c = 0 < e.length ? c + ("<i><span style='opacity: .5;'>- </span><span style='opacity: .75;'><b>" + u + "</b></span><span style='opacity: .5;'>, today's longest</span></i>") : "<i><span style='opacity: .5;'>Today's longest was </span><span style='opacity: .75;'><b>" + u + "</b></span></i>", c += "<br><i><span style='opacity: .5;'>with a length of </span><span style='opacity: .65;'><b>" + B + "</b></span></i>") : c = 0 <
                        e.length ? c + "<i><span style='opacity: .5;'>- </span><span style='opacity: .5;'>today's longest</span></i>" + ("<br><i><span style='opacity: .5;'>with a length of </span><span style='opacity: .65;'><b>" + B + "</b></span></i>") : c + ("<i><span style='opacity: .5;'>Today's longest: </span><span style='opacity: .75;'><b>" + B + "</b></span></i>"), vcm.innerHTML = c)
                } else if ("p" == f) wfpr = !1, lagging && (etm *= lag_mult, lagging = !1);
                else if ("u" == f) {
                    u = asmc.getContext("2d");
                    u.clearRect(0, 0, 80, 80);
                    u.fillStyle = "#FFFFFF";
                    for (var B =
                            e = 0; b < h && !(80 <= B);)
                        if (w = c[b++], 128 <= w)
                            for (w -= 128, z = 0; z < w && !(e++, 80 <= e && (e = 0, B++, 80 <= B)); z++);
                        else
                            for (z = 0; 7 > z && !(0 < (w & u_m[z]) && u.fillRect(e, B, 1, 1), e++, 80 <= e && (e = 0, B++, 80 <= B)); z++);
                } else if ("s" == f) {
                    if (playing)
                        if (w = c[b] << 8 | c[b + 1], b += 2, 6 < u) {
                            D = 2 * (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215;
                            b += 3;
                            b++;
                            x = 2 * (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215;
                            b += 3;
                            A = (c[b] << 8 | c[b + 1]) / 1E3;
                            b += 2;
                            H = (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) / 16777215;
                            b += 3;
                            t = c[b];
                            b++;
                            var L = [],
                                I = (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) / 5,
                                b = b + 3,
                                K = (c[b] << 16 | c[b + 1] << 8 |
                                    c[b + 2]) / 5,
                                b = b + 3,
                                e = c[b];
                            b++;
                            f = "";
                            for (u = 0; u < e; u++) f += String.fromCharCode(c[b]), b++;
                            for (var M = u = B = e = 0, O = !1; b < h;) u = e, M = B, O ? (e += (c[b] - 127) / 2, b++, B += (c[b] - 127) / 2, b++) : (e = (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) / 5, b += 3, B = (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) / 5, b += 3, u = e, M = B, O = !0), (z = points_dp.get()) || (z = {
                                exs: [],
                                eys: [],
                                efs: [],
                                ems: []
                            }), z.eiu = 0, z.xx = e, z.yy = B, z.fx = 0, z.fy = 0, z.da = 0, z.ebx = e - u, z.eby = B - M, L.push(z);
                            t = newSnake(w, I, K, t, D, L);
                            null == snake && (view_xx = e, view_yy = B, snake = t);
                            t.nk = f;
                            t.eang = t.wang = x;
                            t.sp = A;
                            t.spang = t.sp / spangdv;
                            1 < t.spang &&
                                (t.spang = 1);
                            t.fam = H;
                            t.sc = Math.min(6, 1 + (t.sct - 2) / 106);
                            t.scang = .13 + .87 * Math.pow((7 - t.sc) / 6, 2);
                            t.ssp = nsp1 + nsp2 * t.sc;
                            t.fsp = t.ssp + .1;
                            t.wsep = 6 * t.sc;
                            c = nsep / gsc;
                            t.wsep < c && (t.wsep = c);
                            t.sep = t.wsep;
                            snl(t)
                        } else
                            for (c = 1 == c[b], z = snakes.length - 1; 0 <= z; z--)
                                if (snakes[z].id == w) {
                                    snakes[z].id = -1234;
                                    c ? (snakes[z].dead = !0, snakes[z].dead_amt = 0, snakes[z].edir = 0) : snakes.splice(z, 1);
                                    delete os["s" + w];
                                    break
                                }
                } else if ("F" == f)
                    if (4 <= protocol_version) {
                        for (f = !1; b < h;) t = c[b], b++, e = c[b] << 8 | c[b + 1], b += 2, B = c[b] << 8 | c[b + 1], b += 2, u = c[b] / 5, b++,
                            w = B * grd * 3 + e, u = newFood(w, e, B, u, !0, t), f || (f = !0, z = Math.floor(e / sector_size), H = Math.floor(B / sector_size)), u.sx = z, u.sy = H;
                        t = {};
                        t.xx = z;
                        t.yy = H;
                        sectors.push(t)
                    } else
                        for (z = c[b] << 8 | c[b + 1], b += 2, H = c[b] << 8 | c[b + 1], b += 2, t = {}, t.xx = z, t.yy = H, sectors.push(t); b < h;) w = c[b] << 16 | c[b + 1] << 8 | c[b + 2], b += 3, t = c[b], b++, e = sector_size * (z + c[b] / 255), b++, B = sector_size * (H + c[b] / 255), b++, u = c[b] / 5, b++, u = newFood(w, e, B, u, !0, t), u.sx = z, u.sy = H;
                else if ("b" == f || "f" == f) 4 <= protocol_version ? (t = c[b], b++, 4 < u && (e = c[b] << 8 | c[b + 1], b += 2, B = c[b] << 8 | c[b + 1],
                    w = B * grd * 3 + e, u = c[b + 2] / 5, u = newFood(w, e, B, u, "b" == f, t), u.sx = Math.floor(e / sector_size), u.sy = Math.floor(B / sector_size))) : (w = c[b] << 16 | c[b + 1] << 8 | c[b + 2], b += 3, 4 < u && (t = c[b], b++, z = c[b] << 8 | c[b + 1], b += 2, H = c[b] << 8 | c[b + 1], b += 2, e = sector_size * (z + c[b] / 255), b++, B = sector_size * (H + c[b] / 255), b++, u = c[b] / 5, u = newFood(w, e, B, u, "b" == f, t), u.sx = z, u.sy = H));
                else if ("c" == f) {
                    4 <= protocol_version ? (e = c[b] << 8 | c[b + 1], b += 2, B = c[b] << 8 | c[b + 1], b += 2, w = B * grd * 3 + e) : (w = c[b] << 16 | c[b + 1] << 8 | c[b + 2], b += 3);
                    for (z = cm1 = foods_c - 1; 0 <= z; z--)
                        if (u = foods[z], u.id ==
                            w) {
                            u.eaten = !0;
                            b + 2 <= h ? (c = c[b] << 8 | c[b + 1], u.eaten_by = os["s" + c], u.eaten_fr = 0) : (z == cm1 ? foods[z] = null : (foods[z] = foods[cm1], foods[cm1] = null), foods_c--, cm1--);
                            w = -1;
                            break
                        } - 1 != w && console.log("wtf")
                } else if ("j" == f) {
                    w = c[b] << 8 | c[b + 1];
                    b += 2;
                    e = 1 + 3 * (c[b] << 8 | c[b + 1]);
                    b += 2;
                    B = 1 + 3 * (c[b] << 8 | c[b + 1]);
                    b += 2;
                    h = null;
                    for (z = preys.length - 1; 0 <= z; z--)
                        if (preys[z].id == w) {
                            h = preys[z];
                            break
                        }
                    if (h) {
                        z = etm / 8 * h.sp / 4;
                        z *= lag_mult;
                        f = h.xx;
                        w = h.yy;
                        15 == u ? (h.dir = c[b] - 48, b++, h.ang = 2 * (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215, b += 3, h.wang = 2 * (c[b] <<
                            16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215, b += 3, h.sp = (c[b] << 8 | c[b + 1]) / 1E3) : 11 == u ? (h.ang = 2 * (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215, b += 3, h.sp = (c[b] << 8 | c[b + 1]) / 1E3) : 12 == u ? (h.dir = c[b] - 48, b++, h.wang = 2 * (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215, b += 3, h.sp = (c[b] << 8 | c[b + 1]) / 1E3) : 13 == u ? (h.dir = c[b] - 48, b++, h.ang = 2 * (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215, b += 3, h.wang = 2 * (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215) : 9 == u ? h.ang = 2 * (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215 : 10 == u ? (h.dir = c[b] - 48, b++, h.wang =
                            2 * (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215) : 8 == u && (h.sp = (c[b] << 8 | c[b + 1]) / 1E3);
                        h.xx = e + Math.cos(h.ang) * z;
                        h.yy = B + Math.sin(h.ang) * z;
                        c = h.xx - f;
                        b = h.yy - w;
                        w = h.fpos;
                        for (u = 0; u < rfc; u++) h.fxs[w] -= c * rfas[u], h.fys[w] -= b * rfas[u], w++, w >= rfc && (w = 0);
                        h.fx = h.fxs[h.fpos];
                        h.fy = h.fys[h.fpos];
                        h.ftg = rfc
                    }
                } else if ("y" == f)
                    if (w = c[b] << 8 | c[b + 1], b += 2, 2 == u)
                        for (z = preys.length - 1; 0 <= z; z--) {
                            if (h = preys[z], h.id == w) {
                                preys.splice(z, 1);
                                break
                            }
                        } else if (4 == u)
                            for (c = c[b] << 8 | c[b + 1], z = preys.length - 1; 0 <= z; z--) {
                                if (h = preys[z], h.id == w) {
                                    h.eaten = !0;
                                    h.eaten_by = os["s" + c];
                                    h.eaten_by ? h.eaten_fr = 0 : preys.splice(z, 1);
                                    break
                                }
                            } else t = c[b], b++, e = (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) / 5, b += 3, B = (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) / 5, b += 3, u = c[b] / 5, b++, h = c[b] - 48, b++, x = 2 * (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215, b += 3, D = 2 * (c[b] << 16 | c[b + 1] << 8 | c[b + 2]) * Math.PI / 16777215, b += 3, A = (c[b] << 8 | c[b + 1]) / 1E3, newPrey(w, e, B, u, t, h, x, D, A)
            }
        };
        ws.onerror = function(b) {};
        ws.onclose = function(b) {
            ws == this && (playing = connected = !1)
        };
        ws.onopen = function(b) {
            if (ws == this) {
                b = asciize(nick.value);
                24 < b.length && (b =
                    b.substr(0, 24));
                var c = Math.floor(9 * Math.random());
                try {
                    var e = localStorage.snakercv;
                    e == "" + Number(e) && (c = Number(e))
                } catch (f) {}
                e = new Uint8Array(3 + b.length);
                e[0] = 115;
                e[1] = 5;
                e[2] = c;
                for (c = 0; c < b.length; c++) e[c + 3] = b.charCodeAt(c);
                ws.send(e);
                high_quality = !0;
                gla = 1;
                wdfg = 0;
                qsm = 1;
                1 == render_mode && (high_quality = !1, gla = 0);
                lpstm = Date.now()
            }
        }
    }
}
            window.mini_map_options = $('<div>').attr('id', 'mini-map-options').css({
                bottom: 315,
                right: 10,
                color: '#666',
                fontSize: 14,
                position: 'fixed',
                fontWeight: 400,
                zIndex: 1000
            }).appendTo(document.body);

            var container = $('<div>')
                .css({
                    background: 'rgba(200, 200, 200, 0.58)',
                    padding: 5,
                    borderRadius: 5
                })
                .hide();



            container.appendTo(window.mini_map_options);
            var form = $('<div>')
                .addClass('form-inline')
                .css({
                    opacity: 0.7,
                    marginTop: 2
                })
                .appendTo(window.mini_map_options);

            var form_group = $('<div>')
                .addClass('form-group')
                .appendTo(form);

            var addressInput = $('<input>')
                .css({
                    marginLeft: 2
                })
                .attr('placeholder', '127.0.0.1:34343')
                .attr('type', 'text')
                .addClass('form-control')
                .val("127.0.0.1:34343")
                .appendTo(form_group);
            var connection = function (evt) {
                var address = addressInput.val();

 

                connect2(address.split(":")[0],address.split(":")[1])

               
            };
    
            var connectBtn = $('<button>')
                .attr('id', 'mini-map-connect-btn')
                .css({
                     marginLeft: 2
                })
                .text('Rejoindre')
                .click(connection)
                .addClass('btn')
                .appendTo(form_group);
        
    
    
})(window);