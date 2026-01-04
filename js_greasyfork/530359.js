// ==UserScript==
// @name         Precise slither
// @namespace    precise_slither
// @version      0.6
// @description  Simplified client for slither.io
// @author       Sr_2_0
// @match        *://slither.com/io
// @match        *://slither.io/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530359/Precise%20slither.user.js
// @updateURL https://update.greasyfork.org/scripts/530359/Precise%20slither.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // you can change these values
    const myNick_29 = 'tt';         //  allowed characters:  !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~  (maximum lenght 24)
    const mySkin_29 = 1;            //  0 - 65
    const useCustomSkin_29 = false; //  true   false
    const myCustomSkin_29 = [39, 28, 28, 29, 17, 0, 19, 30, 30, 30, 30, 7, 7, 13]; //  use these numbers when building: 28 - 35, 37, 39, 41,   17 - 27,   8 - 16,   0 - 7  (maximum array lenght 227)
    const myCosmetic_29 = 255;      //  255,   24 - 31,   16 - 23,   8 - 15,   0 - 7  (255 - without cosmetic)
    const serverIpAndPortForInputField_29 = '57.129.37.42:444';
    const maxFps_29 = 40;

    // rewrite original slither client
    document.getElementsByTagName('html')[0].innerHTML = `
        <head>
            <title>precise slither</title>
        </head>
        <body>
        </body>
    `;

    let ws_29;

    let myId_29 = -1;
    let myIdWas_29 = false;

    let snakes_29 = [];
    let preys_29 = [];
    let sectors_29 = [];
    let foods_29 = [];
    let foods_c_29 = 0;

    let grd_29 = 16384;
    let mscps_29 = 0;
    let fmlts_29 = [];
    let fpsls_29 = [];
    let sector_size_29 = 480;
    let spangdv_29 = 4.8;
    let nsp1_29 = 4.25;
    let nsp2_29 = .5;
    let nsp3_29 = 12;
    let mamu_29 = .033;
    let mamu2_29 = .028;
    let cst_29 = .43;
    let protocol_version_29 = 2;

    let real_flux_grd_29 = grd_29;
    let rfgrdForMinimap_29 = real_flux_grd_29;

    let playersInfo_29 = "";

    let minimapObjs_29 = [];

    let myValidNick_29;
    let myValidSkin_29;
    let myCustomSkinData_29 = [];
    let myValidCosmetic_29;

    let vfr_29 = 0;
    let vfrb_29 = 0;
    let fr_29 = 0;
    let lfr_29 = 0;

    let ltm_29 = Date.now();

    let last_ping_mtm_29 = 0;
    let wfpr_29 = false;
    let lastPings_29 = [];
    let lastPingsIndex_29 = 0;
    let avgPing_29 = 70;

    let last_accel_mtm_29 = 0;
    let lstSnddAclState_29 = false;
    let acceleration_29 = false;

    let last_e_mtm_29 = 0;
    let prevComndForEang_29 = -1;
    let whereMouseX_29 = -1;
    let whereMouseY_29 = -1;

    let oefTimerId_29;
    let oefTimerStarted_29 = false;

    let lastStartOtrisTime_29;

    let currentFps_29 = 0;
    let currentFpsLastShowTime_29 = 0;

    let gameExists_29 = false;
    let wantCloseCurrentGame_29 = false;
    let wantNewGame_29 = false;
    let buttonFunctionality_29 = true;

    let xx_29 = 0;
    let yy_29 = 0;
    let cm1_29;

    const pi2_29 = 2 * Math.PI;

    function prepareNewGame_29() {
        gameExists_29 = true;
        myIdWas_29 = false;
        snakes_29 = [];
        preys_29 = [];
        sectors_29 = [];
        foods_29 = [];
        foods_c_29 = 0;
        xx_29 = 0;
        yy_29 = 0;
        playersInfo_29 = "";
        minimapObjs_29 = [];
        last_ping_mtm_29 = 0;
        wfpr_29 = false;
        lastPings_29 = [];
        lastPingsIndex_29 = 0;
        avgPing_29 = 70;
        last_accel_mtm_29 = 0;
        lstSnddAclState_29 = false;
        acceleration_29 = false;
        last_e_mtm_29 = 0;
        prevComndForEang_29 = -1;
        whereMouseX_29 = -1;
        whereMouseY_29 = -1;
        connect_29();
    }

    function decodeSecret_29(sv, idba) {
        function qff9x_29(b) {
            eval(b);
            if (0 < idba.length) {
                b = 0;
                for (let d, a, e, c = 0; c < idba.length; c++) {
                    d = 65,
                    a = idba[c],
                    97 <= a && (d += 32, a -= 32),
                    a -= 65,
                    0 == c && (b = 2 + a),
                    e = a + b,
                    e %= 26,
                    b += 3 + a,
                    idba[c] = e + d;
                }
            }
        };
        let a = "", b;
        for (let d = 0, e = 23, f = 0, g = 0; g < sv.length; ) {
            b = sv[g],
            g++,
            96 >= b && (b += 32),
            b = (b - 97 - e) % 26,
            0 > b && (b += 26),
            d *= 16,
            d += b,
            e += 17,
            1 == f ? (a += String.fromCharCode(d), f = d = 0) : f++;
        }
        qff9x_29(a);
        for (a = 0; a < sv.length; a++)
            if (b = sv[a], 65 > b || 122 < b)
                return !1;
        return !0;
    };

    // needed to calculate a score
    function setMscps_29(nmscps) {
        if (nmscps != mscps_29) {
            mscps_29 = nmscps;
            fmlts_29 = [];
            fpsls_29 = [];
            for (let i = 0; i <= mscps_29; i++) {
                if (i >= mscps_29)
                    fmlts_29.push(fmlts_29[i - 1]);
                else
                    fmlts_29.push(Math.pow(1 - i / mscps_29, 2.25));
                if (i == 0)
                    fpsls_29.push(0);
                else
                    fpsls_29.push(fpsls_29[i - 1] + 1 / fmlts_29[i - 1])
            }
            let t_fmlt = fmlts_29[fmlts_29.length - 1];
            let t_fpsl = fpsls_29[fpsls_29.length - 1];
            for (let i = 0; i < 2048; i++) {
                fmlts_29.push(t_fmlt);
                fpsls_29.push(t_fpsl)
            }
        }
    }

    function newSnake_29(id, xx, yy, cv, ang, pts) {
        let o = {};
        o.id = id;
        o.xx = xx;
        o.yy = yy;
        o.chl = 0;
        o.tsp = 0;
        o.sc = 1;
        o.ssp = nsp1_29 + nsp2_29 * o.sc;
        o.fsp = o.ssp + .1;
        o.msp = nsp3_29;
        o.msl = 42;
        o.fam = 0;
        o.rsc = 0;
        o.ang = ang;
        o.eang = ang;
        o.wang = ang;
        o.sp = 2;
        if (pts) {
            o.pts = pts;
            o.sct = pts.length;
        } else {
            o.pts = [];
            o.sct = 0
        }
        o.tl = o.sct + o.fam;
        o.cfl = o.tl;
        o.scang = 1;
        snakes_29.push(o);
        return o;
    }

    function newPrey_29(id, xx, yy, rad, dir, wang, ang, speed) {
        let pr = {};
        pr.id = id;
        pr.xx = xx;
        pr.yy = yy;
        pr.sz = rad;
        pr.dir = dir;
        pr.wang = wang;
        pr.ang = ang;
        pr.sp = speed;
        preys_29.push(pr);
        return pr;
    }

    function newFood_29(id, xx, yy, rad) {
        let fo = {};
        fo.id = id;
        fo.xx = xx;
        fo.yy = yy;
        fo.sz = rad;
        foods_29[foods_c_29++] = fo;
        return fo;
    }

    // function is executed before each frame is drawn
    function oef_29() {
        let ctm = Date.now();
        vfr_29 = (ctm - ltm_29) / 8;
        if (vfr_29 > 5)
            vfr_29 = 5;
        if (vfr_29 < 1.56)
            vfr_29 = 1.56;
        ltm_29 = ctm;
        lfr_29 = fr_29;
        fr_29 += vfr_29;
        vfrb_29 = Math.floor(fr_29) - Math.floor(lfr_29);

        let mang, vang;
        for (let i = snakes_29.length - 1; i >= 0; i--) {
            let o = snakes_29[i];
            mang = mamu_29 * vfr_29 * o.scang * o.spang;
            let csp = o.sp * vfr_29 / 4;
            if (csp > o.msl)
                csp = o.msl;
            if (o.tsp != o.sp)
                if (o.tsp < o.sp) {
                    o.tsp += .3 * vfr_29;
                    if (o.tsp > o.sp)
                        o.tsp = o.sp;
                } else {
                    o.tsp -= .3 * vfr_29;
                    if (o.tsp < o.sp)
                        o.tsp = o.sp;
                }
            o.cfl = o.tl;
            if (o.dir == 1) {
                o.ang -= mang;
                if (o.ang < 0 || o.ang >= pi2_29)
                    o.ang %= pi2_29;
                if (o.ang < 0)
                    o.ang += pi2_29;
                vang = (o.wang - o.ang) % pi2_29;
                if (vang < 0)
                    vang += pi2_29;
                if (vang > Math.PI)
                    vang -= pi2_29;
                if (vang > 0) {
                    o.ang = o.wang;
                    o.dir = 0
                }
            } else if (o.dir == 2) {
                o.ang += mang;
                if (o.ang < 0 || o.ang >= pi2_29)
                    o.ang %= pi2_29;
                if (o.ang < 0)
                    o.ang += pi2_29;
                vang = (o.wang - o.ang) % pi2_29;
                if (vang < 0)
                    vang += pi2_29;
                if (vang > Math.PI)
                    vang -= pi2_29;
                if (vang < 0) {
                    o.ang = o.wang;
                    o.dir = 0
                }
            } else
                o.ang = o.wang;
            let po = o.pts[o.pts.length - 1];
            o.xx += Math.cos(o.ang) * csp;
            o.yy += Math.sin(o.ang) * csp;
            o.chl += csp / o.msl
            if (vfrb_29 > 0) {
                for (let j = o.pts.length - 1; j >= 0; j--) {
                    let po = o.pts[j];
                    if (po.dying) {
                        po.da += .0015 * vfrb_29;
                        if (po.da > 1) {
                            o.pts.splice(j, 1);
                        }
                    }
                }
            }
        }
        for (let i = preys_29.length - 1; i >= 0; i--) {
            let pr = preys_29[i];
            mang = mamu2_29 * vfr_29;
            let csp = pr.sp * vfr_29 / 4;
            if (pr.dir == 1) {
                pr.ang -= mang;
                if (pr.ang < 0 || pr.ang >= pi2_29)
                    pr.ang %= pi2_29;
                if (pr.ang < 0)
                    pr.ang += pi2_29;
                vang = (pr.wang - pr.ang) % pi2_29;
                if (vang < 0)
                    vang += pi2_29;
                if (vang > Math.PI)
                    vang -= pi2_29;
                if (vang > 0) {
                    pr.ang = pr.wang;
                    pr.dir = 0
                }
            } else if (pr.dir == 2) {
                pr.ang += mang;
                if (pr.ang < 0 || pr.ang >= pi2_29)
                    pr.ang %= pi2_29;
                if (pr.ang < 0)
                    pr.ang += pi2_29;
                vang = (pr.wang - pr.ang) % pi2_29;
                if (vang < 0)
                    vang += pi2_29;
                if (vang > Math.PI)
                    vang -= pi2_29;
                if (vang < 0) {
                    pr.ang = pr.wang;
                    pr.dir = 0
                }
            } else
                pr.ang = pr.wang;
            pr.xx += Math.cos(pr.ang) * csp;
            pr.yy += Math.sin(pr.ang) * csp;
        }
        vfr_29 = 0;
        vfrb_29 = 0;

        if (!wantCloseCurrentGame_29 && !wfpr_29) {
            if (ctm - last_ping_mtm_29 > 250) {
                last_ping_mtm_29 = ctm;
                wfpr_29 = true;
                const ba = new Uint8Array([251]);
                ws_29.send(ba);
            }
        }
        if (!wantCloseCurrentGame_29 && acceleration_29 != lstSnddAclState_29 && ctm - last_accel_mtm_29 > 150) {
            lstSnddAclState_29 = acceleration_29;
            last_accel_mtm_29 = ctm;
            let ba = new Uint8Array(1);
            if (acceleration_29)
                ba[0] = 253;
            else
                ba[0] = 254;
            ws_29.send(ba);
        }
        if (!wantCloseCurrentGame_29 && ctm - last_e_mtm_29 > 100 && whereMouseX_29 != -1 && whereMouseY_29 != -1) {
            let centerX = playingArenaWidth / 2;
            let centerY = playingArenaHeight / 2;
            let differeX = whereMouseX_29 - centerX;
            let differeY = whereMouseY_29 - centerY;
            let mouAng = Math.atan2(differeY, differeX);
            if (mouAng < 0)
                mouAng += Math.PI * 2;
            const angleToSend = createAngleToSend(mouAng);
            if (angleToSend != prevComndForEang_29) {
                prevComndForEang_29 = angleToSend;
                last_e_mtm_29 = ctm;
                let ba = new Uint8Array([angleToSend]);
                ws_29.send(ba);
            }

            function createAngleToSend(angle) {
                let angleToSend = Math.round(angle / pi2_29 * 256);
                if (angleToSend <= 50)
                    return angleToSend;
                for (let tmp = 51, ofs = 0; tmp <= 255; tmp += 51, ofs++) {
                    if (angleToSend >= tmp - 50 && angleToSend <= tmp - 1)
                        angleToSend -= ofs;
                    else if (angleToSend == tmp) {
                        if (angle < Math.PI * 2 / 256 * tmp)
                            angleToSend = tmp - ofs - 1;
                        else
                            angleToSend = tmp - ofs;
                    }
                }
                if (angleToSend == 251 || angleToSend == 256)
                    angleToSend = 0;
                return angleToSend;
            }
        }

        drawFrame();
        oefTimerId_29 = setTimeout(oef_29, Math.max(lastStartOtrisTime_29 + (1000 / maxFps_29) - Date.now(), 0));
        if (wantCloseCurrentGame_29 && ws_29.readyState === WebSocket.OPEN)
            ws_29.close();
    }

    function connect_29() {
        ws_29 = new WebSocket("ws://" + serverIpAndPortField.value + "/slither");
        ws_29.binaryType = "arraybuffer";
        ws_29.onopen = function() {
            const ba = new Uint8Array([99, 4]);
            ws_29.send(ba);
        };
        ws_29.onmessage = function(e) {
            let a = new Uint8Array(e.data);
            if (a.length >= 2) {
                let cmd = String.fromCharCode(a[2]);
                let m = 3;
                let alen = a.length;
                let plen = a.length - 2;
                let dlen = a.length - 3;

                // initial setup
                if (cmd == "a") {
                    grd_29 = a[m] << 16 | a[m + 1] << 8 | a[m + 2];
                    m += 3;
                    real_flux_grd_29 = grd_29;
                    rfgrdForMinimap_29 = real_flux_grd_29;
                    let nmscps = a[m] << 8 | a[m + 1];
                    m += 2;
                    sector_size_29 = a[m] << 8 | a[m + 1];
                    m += 2;
                    m += 2;
                    spangdv_29 = a[m] / 10;
                    m++;
                    nsp1_29 = (a[m] << 8 | a[m + 1]) / 100;
                    m += 2;
                    nsp2_29 = (a[m] << 8 | a[m + 1]) / 100;
                    m += 2;
                    nsp3_29 = (a[m] << 8 | a[m + 1]) / 100;
                    m += 2;
                    mamu_29 = (a[m] << 8 | a[m + 1]) / 1E3;
                    m += 2;
                    mamu2_29 = (a[m] << 8 | a[m + 1]) / 1E3;
                    m += 2;
                    cst_29 = (a[m] << 8 | a[m + 1]) / 1E3;
                    m += 2;
                    if (m < alen) {
                        protocol_version_29 = a[m];
                        m++;
                        if (protocol_version_29 != 13) {
                            ws_29.close();
                        }
                    }
                    setMscps_29(nmscps);
                }
                // snake rotation
                else if (cmd == "e" || cmd == "E" || cmd == "3" || cmd == "4" || cmd == "5") {
                    let id = a[m] << 8 | a[m + 1];
                    m += 2;
                    let dir = -1;
                    let ang = -1;
                    let wang = -1;
                    let speed = -1;
                    if (plen == 6) {
                        if (cmd == "e")
                            dir = 1;
                        else
                            dir = 2;
                        ang = a[m] * 2 * Math.PI / 256;
                        m++;
                        wang = a[m] * 2 * Math.PI / 256;
                        m++;
                        speed = a[m] / 18;
                        m++
                    } else if (plen == 5)
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
                        }
                    else {
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
                            } else if (cmd == "3") {
                                speed = a[m] / 18;
                                m++
                            }
                    }
                    let o;
                    for (let i = snakes_29.length - 1; i >= 0; i--) {
                        if (snakes_29[i].id == id) {
                            o = snakes_29[i];
                            break;
                        }
                    }
                    if (o) {
                        if (dir != -1)
                           o.dir = dir;
                        if (ang != -1) {
                            o.ang = ang;
                        }
                        if (wang != -1) {
                            o.wang = wang;
                            o.eang = wang;
                        }
                        if (speed != -1) {
                            o.sp = speed;
                            o.spang = o.sp / spangdv_29;
                            if (o.spang > 1)
                                o.spang = 1;
                        }
                    }
                }
                // pre-init response
                else if (cmd == "6") {
                    let server_version = new Uint8Array(alen - m);
                    for (let i = 0; m < alen; i++) {
                        server_version[i] = a[m];
                        m++;
                    }
                    let idba = new Uint8Array(24);
                    decodeSecret_29(server_version, idba);
                    ws_29.send(idba);

                    let ca = [];
                    if (useCustomSkin_29 && myCustomSkinData_29.length > 8)
                        ca = myCustomSkinData_29;
                    let lgba = new Uint8Array(6 + myValidNick_29.length + ca.length);
                    lgba[0] = 115;
                    lgba[1] = 12;
                    lgba[2] = myValidSkin_29;
                    lgba[3] = myValidNick_29.length;
                    let m2 = 4;
                    for (let i = 0; i < myValidNick_29.length; i++) {
                        lgba[m2] = myValidNick_29.charCodeAt(i);
                        m2++;
                    }
                    lgba[m2] = 0;
                    m2++;
                    lgba[m2] = myValidCosmetic_29;
                    m2++;
                    for (let i = 0; i < ca.length; i++) {
                        lgba[m2] = ca[i];
                        m2++
                    }
                    ws_29.send(lgba);

                    // send first ping
                    last_ping_mtm_29 = Date.now();
                    wfpr_29 = true;
                    const ba = new Uint8Array([251]);
                    ws_29.send(ba);
                }
                // update snake last body part fullness (fam)
                else if (cmd == "h") {
                    let id = a[m] << 8 | a[m + 1];
                    m += 2;
                    let fam = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 16777215;
                    m += 3;
                    let o;
                    for (let i = snakes_29.length - 1; i >= 0; i--) {
                        if (snakes_29[i].id == id) {
                            o = snakes_29[i];
                            break;
                        }
                    }
                    if (o) {
                        o.fam = fam;
                        o.tl = o.sct + o.fam;
                    }
                }
                // remove snake part
                else if (cmd == "r") {
                    let id = a[m] << 8 | a[m + 1];
                    m += 2;
                    let o;
                    for (let i = snakes_29.length - 1; i >= 0; i--) {
                        if (snakes_29[i].id == id) {
                            o = snakes_29[i];
                            break;
                        }
                    }
                    if (o) {
                        if (dlen >= 4) {
                            o.fam = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 16777215;
                            m += 3
                        }
                        for (let j = 0; j < o.pts.length; j++)
                            if (!o.pts[j].dying) {
                                o.pts[j].dying = true;
                                o.sct--;
                                o.sc = Math.min(6, 1 + (o.sct - 2) / 106);
                                o.scang = .13 + .87 * Math.pow((7 - o.sc) / 6, 2);
                                o.ssp = nsp1_29 + nsp2_29 * o.sc;
                                o.fsp = o.ssp + .1;
                                break;
                            }
                        o.tl = o.sct + o.fam;
                    }
                }
                // update number of snake parts that you lost while spinning in a closed circle (rsc)
                else if (cmd == "R") {
                    for (let i = snakes_29.length - 1; i >= 0; i--) {
                        if (snakes_29[i].id == myId_29) {
                            snakes_29[i].rsc = a[m];
                            break;
                        }
                    }
                    m++;
                }
                // move or increase snake
                else if (cmd == "g" || cmd == "n" || cmd == "G" || cmd == "N") {
                    let adding_only = cmd == "n" || cmd == "N";
                    let id = a[m] << 8 | a[m + 1];
                    m += 2;
                    let o;
                    for (let i = snakes_29.length - 1; i >= 0; i--) {
                        if (snakes_29[i].id == id) {
                            o = snakes_29[i];
                            break;
                        }
                    }
                    if (o) {
                        if (adding_only)
                            o.sct++;
                        else
                            for (let j = 0; j < o.pts.length; j++)
                                if (!o.pts[j].dying) {
                                    o.pts[j].dying = true;
                                    break
                                }
                        let po = o.pts[o.pts.length - 1];
                        let lpo = po;
                        let mpo;
                        let mv;
                        let lmpo;
                        if (cmd == "g" || cmd == "n") {
                            xx_29 = a[m] << 8 | a[m + 1];
                            m += 2;
                            yy_29 = a[m] << 8 | a[m + 1];
                            m += 2
                        } else {
                            xx_29 = lpo.xx + a[m] - 128;
                            m++;
                            yy_29 = lpo.yy + a[m] - 128;
                            m++;
                        }
                        if (adding_only) {
                            o.fam = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 16777215;
                            m += 3
                        }
                        po = {};
                        po.xx = xx_29;
                        po.yy = yy_29;
                        po.da = 0;
                        o.pts.push(po);
                        let k = o.pts.length - 3;
                        let n;
                        if (k >= 1) {
                            lmpo = o.pts[k];
                            n = 0;
                            mv = 0;
                            for (let j = k - 1; j >= 0; j--) {
                                mpo = o.pts[j];
                                n++;
                                if (n <= 4)
                                    mv = cst_29 * n / 4;
                                mpo.xx += (lmpo.xx - mpo.xx) * mv;
                                mpo.yy += (lmpo.yy - mpo.yy) * mv;
                                lmpo = mpo;
                            }
                        }
                        o.sc = Math.min(6, 1 + (o.sct - 2) / 106);
                        o.scang = .13 + .87 * Math.pow((7 - o.sc) / 6, 2);
                        o.ssp = nsp1_29 + nsp2_29 * o.sc;
                        o.fsp = o.ssp + .1;
                        if (adding_only)
                            o.tl = o.sct + o.fam;
                        o.chl = 0;
                        o.xx = xx_29;
                        o.yy = yy_29;
                    }
                }
                // leaderboard
                else if (cmd == "l") {
                    playersInfo_29 = "";
                    let nc = 0;
                    let pos = 0;
                    let v;
                    let score;
                    let my_pos = a[m];
                    m++;
                    let rank = a[m] << 8 | a[m + 1];
                    m += 2;
                    let snake_count = a[m] << 8 | a[m + 1];
                    m += 2;
                    while (m < alen) {
                        let sct = a[m] << 8 | a[m + 1];
                        m += 2;
                        let fam = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 16777215;
                        m += 3;
                        m++;
                        let nl = a[m];
                        m++;
                        pos++;
                        let nk = "";
                        for (let j = 0; j < nl; j++) {
                            v = a[m];
                            nk += String.fromCharCode(v);
                            m++;
                        }
                        if (pos == my_pos) {
                            nk = myValidNick_29;
                        }
                        nc++;
                        score = Math.floor((fpsls_29[sct] + fam / fmlts_29[sct] - 1) * 15 - 5) / 1;
                        playersInfo_29 += nc + "    " + score + "          " + nk + "\n";
                    }
                    playersInfo_29 += "\n " + rank + " / " + snake_count;
                }
                // add sector (for foods)
                else if (cmd == "W") {
                    xx_29 = a[m];
                    m++;
                    yy_29 = a[m];
                    m++;
                    let o = {};
                    o.xx = xx_29;
                    o.yy = yy_29;
                    sectors_29.push(o)
                }
                // remove sector (for foods)
                else if (cmd == "w") {
                    xx_29 = a[m];
                    m++;
                    yy_29 = a[m];
                    m++;
                    cm1_29 = foods_c_29 - 1;
                    for (let i = cm1_29; i >= 0; i--) {
                        let fo = foods_29[i];
                        if (fo.sx == xx_29)
                            if (fo.sy == yy_29)
                                if (i == cm1_29) {
                                    foods_29[i] = null;
                                    foods_c_29--;
                                    cm1_29--;
                                } else {
                                    foods_29[i] = foods_29[cm1_29];
                                    foods_29[cm1_29] = null;
                                    foods_c_29--;
                                    cm1_29--;
                                }
                    }
                    for (let i = sectors_29.length - 1; i >= 0; i--) {
                        let o = sectors_29[i];
                        if (o.xx == xx_29)
                            if (o.yy == yy_29)
                                sectors_29.splice(i, 1);
                    }
                }
                // pong
                else if (cmd == "p") {
                    wfpr_29 = false;
                    lastPings_29[lastPingsIndex_29] = Date.now() - last_ping_mtm_29;
                    lastPingsIndex_29++;
                    if (lastPingsIndex_29 == 60)
                        lastPingsIndex_29 = 0;
                    avgPing_29 = 0;
                    for (let i = 0; i < lastPings_29.length; i++)
                        avgPing_29 += lastPings_29[i];
                    avgPing_29 /= lastPings_29.length;
                }
                // update minimap
                else if (cmd == "M") {
                    rfgrdForMinimap_29 = real_flux_grd_29;
                    minimapObjs_29 = [];
                    let moInd = 0;
                    const u_m = [64, 32, 16, 8, 4, 2, 1];
                    let sz = a[m] << 8 | a[m + 1];
                    m += 2;
                    if (sz > 512)
                        sz = 512;
                    minimapObjs_29[moInd] = {};
                    minimapObjs_29[moInd].sz = sz;
                    moInd++;
                    let i;
                    let k = 0;
                    let xx = sz - 1;
                    let yy = sz - 1;
                    while (m < alen) {
                        if (yy < 0)
                            break;
                        k = a[m++];
                        if (k >= 128) {
                            if (k == 255)
                                k = 126 * a[m++];
                            else
                                k -= 128;
                            for (i = 0; i < k; i++) {
                                xx--;
                                if (xx < 0) {
                                    xx = sz - 1;
                                    yy--;
                                    if (yy < 0)
                                        break;
                                }
                            }
                        } else
                            for (i = 0; i < 7; i++) {
                                if ((k & u_m[i]) > 0) {
                                    minimapObjs_29[moInd] = {};
                                    minimapObjs_29[moInd].xx = xx;
                                    minimapObjs_29[moInd].yy = yy;
                                    moInd++;
                                }
                                xx--;
                                if (xx < 0) {
                                    xx = sz - 1;
                                    yy--;
                                    if (yy < 0)
                                        break;
                                }
                            }
                    }
                }
                // add/remove snake
                else if (cmd == "s") {
                    let id = a[m] << 8 | a[m + 1];
                    m += 2;
                    if (dlen > 6) {
                        let ang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                        m += 3;
                        let dir = a[m] - 48;
                        m++;
                        let wang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                        m += 3;
                        let speed = (a[m] << 8 | a[m + 1]) / 1E3;
                        m += 2;
                        let fam = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 16777215;
                        m += 3;
                        let cv = a[m];
                        m++;
                        let pts = [];
                        let snx = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                        m += 3;
                        let sny = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                        m += 3;
                        let nl = a[m];
                        m++;
                        let nk = "";
                        for (let j = 0; j < nl; j++) {
                            nk += String.fromCharCode(a[m]);
                            m++
                        }
                        let skl = a[m];
                        m++;
                        m += skl;
                        m++;
                        xx_29 = 0;
                        yy_29 = 0;
                        let fp = false;
                        while (m < alen) {
                            if (!fp) {
                                xx_29 = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                                m += 3;
                                yy_29 = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                                m += 3;
                                fp = true
                            } else {
                                xx_29 += (a[m] - 127) / 2;
                                m++;
                                yy_29 += (a[m] - 127) / 2;
                                m++
                            }
                            let po = {};
                            po.dying = false;
                            po.xx = xx_29;
                            po.yy = yy_29;
                            po.da = 0;
                            pts.push(po)
                        }
                        let o = newSnake_29(id, snx, sny, cv, ang, pts);
                        o.nk = nk;
                        o.eang = o.wang = wang;
                        o.sp = speed;
                        o.spang = o.sp / spangdv_29;
                        if (o.spang > 1)
                            o.spang = 1;
                        o.fam = fam;
                        o.sc = Math.min(6, 1 + (o.sct - 2) / 106);
                        o.scang = .13 + .87 * Math.pow((7 - o.sc) / 6, 2);
                        o.ssp = nsp1_29 + nsp2_29 * o.sc;
                        o.fsp = o.ssp + .1;
                        o.tl = o.sct + o.fam;
                        if (myIdWas_29 == false) {
                            myId_29 = id;
                            myIdWas_29 = true;
                        }
                    } else {
                        m++;
                        for (let i = snakes_29.length - 1; i >= 0; i--) {
                            if (snakes_29[i].id == id) {
                                snakes_29.splice(i, 1);
                                break;
                            }
                        }
                    }
                    if (!oefTimerStarted_29) {
                        oefTimerStarted_29 = true;
                        oef_29();
                    }
                    buttonFunctionality_29 = true;
                }
                // add food
                else if (cmd == "F") {
                    let gsi = false;
                    let sx, sy;
                    while (m < alen) {
                        m++;
                        xx_29 = a[m] << 8 | a[m + 1];
                        m += 2;
                        yy_29 = a[m] << 8 | a[m + 1];
                        m += 2;
                        let rad = a[m] / 5;
                        m++;
                        let id = yy_29 * grd_29 * 3 + xx_29;
                        if (rad > 0) {
                            let fo = newFood_29(id, xx_29, yy_29, rad);
                            if (!gsi) {
                                gsi = true;
                                sx = Math.floor(xx_29 / sector_size_29);
                                sy = Math.floor(yy_29 / sector_size_29);
                            }
                            fo.sx = sx;
                            fo.sy = sy;
                        }
                        else {
                            if (!gsi) {
                                gsi = true;
                                sx = Math.floor(xx_29 / sector_size_29);
                                sy = Math.floor(yy_29 / sector_size_29);
                            }
                        }
                    }
                }
                // add food
                else if (cmd == "b" || cmd == "f") {
                    m++;
                    if (dlen > 4) {
                        xx_29 = a[m] << 8 | a[m + 1];
                        m += 2;
                        yy_29 = a[m] << 8 | a[m + 1];
                        m += 2;
                        let id = yy_29 * grd_29 * 3 + xx_29;
                        let rad = a[m] / 5;
                        m++;
                        if (rad > 0) {
                            let fo = newFood_29(id, xx_29, yy_29, rad);
                            fo.sx = Math.floor(xx_29 / sector_size_29);
                            fo.sy = Math.floor(yy_29 / sector_size_29);
                        }
                    }
                }
                // food eaten
                else if (cmd == "c") {
                    let xx = a[m] << 8 | a[m + 1];
                    m += 2;
                    let yy = a[m] << 8 | a[m + 1];
                    m += 2;
                    let id = yy * grd_29 * 3 + xx
                    cm1_29 = foods_c_29 - 1;
                    for (let i = cm1_29; i >= 0; i--) {
                        let fo = foods_29[i];
                        if (fo.id == id) {
                            if (m + 2 <= alen) {
                                m += 2;
                            }
                            if (i == cm1_29) {
                                foods_29[i] = null;
                                foods_c_29--;
                                cm1_29--;
                            } else {
                                foods_29[i] = foods_29[cm1_29];
                                foods_29[cm1_29] = null;
                                foods_c_29--;
                                cm1_29--;
                            }
                            break;
                        }
                    }
                }
                // update prey
                else if (cmd == "j") {
                    let id = a[m] << 8 | a[m + 1];
                    m += 2;
                    xx_29 = 1 + (a[m] << 8 | a[m + 1]) * 3;
                    m += 2;
                    yy_29 = 1 + (a[m] << 8 | a[m + 1]) * 3;
                    m += 2;
                    let pr = null;
                    for (let i = preys_29.length - 1; i >= 0; i--)
                        if (preys_29[i].id == id) {
                            pr = preys_29[i];
                            break;
                        }
                    if (pr) {
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
                        pr.xx = xx_29;
                        pr.yy = yy_29;
                    }
                }
                // add/remove prey
                else if (cmd == "y") {
                    let id = a[m] << 8 | a[m + 1];
                    m += 2;
                    if (dlen == 2)
                        for (let i = preys_29.length - 1; i >= 0; i--) {
                            let pr = preys_29[i];
                            if (pr.id == id) {
                                preys_29.splice(i, 1);
                                break;
                            }
                        }
                    else if (dlen == 4) {
                        m += 2;
                        for (let i = preys_29.length - 1; i >= 0; i--) {
                            let pr = preys_29[i];
                            if (pr.id == id) {
                                preys_29.splice(i, 1);
                                break;
                            }
                        }
                    } else {
                        m++;
                        xx_29 = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                        m += 3;
                        yy_29 = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) / 5;
                        m += 3;
                        let rad = a[m] / 5;
                        m++;
                        let dir = a[m] - 48;
                        m++;
                        let wang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                        m += 3;
                        let ang = (a[m] << 16 | a[m + 1] << 8 | a[m + 2]) * 2 * Math.PI / 16777215;
                        m += 3;
                        let speed = (a[m] << 8 | a[m + 1]) / 1E3;
                        m += 2;
                        newPrey_29(id, xx_29, yy_29, rad, dir, wang, ang, speed)
                    }
                }
                // update map border
                else if (cmd == "z") {
                    real_flux_grd_29 = a[m] << 16 | a[m + 1] << 8 | a[m + 2];
                }
            }
        };
        ws_29.onerror = function(error) {
            console.error('WebSocket error: ', error);
        };
        ws_29.onclose = function() {
            if (oefTimerStarted_29) {
                clearTimeout(oefTimerId_29);
            }
            oefTimerStarted_29 = false;
            wantCloseCurrentGame_29 = false;
            gameExists_29 = false;
            buttonFunctionality_29 = true;
            if (wantNewGame_29) {
                buttonFunctionality_29 = false;
                wantNewGame_29 = false;
                prepareNewGame_29();
            }
        };
    };


    let playingArenaWidth = Math.ceil(window.innerWidth);
    let playingArenaHeight = Math.ceil(window.innerHeight);
    let plArCanv = document.createElement('canvas');
    plArCanv.style.position = 'fixed';
    plArCanv.style.left = '0px';
    plArCanv.style.top = '0px';
    plArCanv.width = playingArenaWidth;
    plArCanv.height = playingArenaHeight;
    plArCanv.style.zIndex = 1;
    document.body.appendChild(plArCanv);
    let ctx = plArCanv.getContext('2d');
    let zoom = 0.3;
    let centerSiX = 20000;
    let centerSiY = 20000;
    let strokeMoveWas;

    function drawFrame() {
        if (playingArenaWidth !== Math.ceil(window.innerWidth)) {
            playingArenaWidth = Math.ceil(window.innerWidth);
            plArCanv.width = playingArenaWidth;
        }
        if (playingArenaHeight !== Math.ceil(window.innerHeight)) {
            playingArenaHeight = Math.ceil(window.innerHeight);
            plArCanv.height = playingArenaHeight;
        }
        let mySnake;
        let finded = false;
        for (let i = 0; i < snakes_29.length; i++) {
            if (snakes_29[i].id == myId_29 && snakes_29[i].pts.length >= 1) {
                mySnake = snakes_29[i];
                finded = true;
                break;
            }
        }
        if (!finded && gameExists_29) {
            wantCloseCurrentGame_29 = true;
            return;
        }
        if (mySnake) {
            centerSiX = mySnake.xx;
            centerSiY = mySnake.yy;
        }
        const leftSiX = centerSiX - ((playingArenaWidth / 2) / zoom);
        const topSiY = centerSiY - ((playingArenaHeight / 2) / zoom);
        const rightSiX = centerSiX + ((playingArenaWidth / 2) / zoom);
        const bottomSiY = centerSiY + ((playingArenaHeight / 2) / zoom);

        const currentTime = Date.now();
        if (currentTime - currentFpsLastShowTime_29 > 200) {
            currentFps_29 = Math.round(1000 / (currentTime - lastStartOtrisTime_29));
            currentFpsLastShowTime_29 = currentTime;
        }
        lastStartOtrisTime_29 = currentTime;
        
        // drawing background
        if (zoom >= 0.03) {
            const darkerSquareColor = 'rgb(0,0,0)';
            let lighterSquareColor;
            if (wfpr_29 && Date.now() - last_ping_mtm_29 > 500)
                lighterSquareColor = 'rgb(30,14,14)';
            else
                lighterSquareColor = 'rgb(14,14,14)';
            const smallSquareSizeSi = 220;
            const smallSquareSizePi = smallSquareSizeSi * zoom;
            const startCoordSiX = smallSquareSizeSi * Math.floor(leftSiX / smallSquareSizeSi);
            const startCoordSiY = smallSquareSizeSi * Math.floor(topSiY / smallSquareSizeSi);
            ctx.fillStyle = darkerSquareColor;
            ctx.fillRect(0, 0, playingArenaWidth, playingArenaHeight);
            ctx.fillStyle = lighterSquareColor;
            for (let i = startCoordSiX; i < rightSiX; i += smallSquareSizeSi) {
                for (let j = startCoordSiY; j < bottomSiY; j += smallSquareSizeSi) {
                    if ((i % (smallSquareSizeSi * 2) !== 0 && j % (smallSquareSizeSi * 2) === 0) || (i % (smallSquareSizeSi * 2) === 0 && j % (smallSquareSizeSi * 2) !== 0)) {
                        ctx.fillRect(playingArenaWidth / 2 - ((centerSiX - i) * zoom), playingArenaHeight / 2 - ((centerSiY - j) * zoom), smallSquareSizePi, smallSquareSizePi);
                    }
                }
            }
        }
        else {
            ctx.fillStyle = 'rgb(7,7,7)';
            ctx.fillRect(0, 0, playingArenaWidth, playingArenaHeight);
        }

        // drawing snakes
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 0; i < snakes_29.length; i++) {
            if (snakes_29[i].pts.length >= 2) {
                const lineNearHeadLen = distBetwCoords(snakes_29[i].xx, snakes_29[i].yy, snakes_29[i].pts[snakes_29[i].pts.length-1].xx, snakes_29[i].pts[snakes_29[i].pts.length-1].yy);
                let oneFreshPartLen;
                if (snakes_29[i].sct <= 1) oneFreshPartLen = 42.000;
                if (snakes_29[i].sct == 2) oneFreshPartLen = 37.485;
                if (snakes_29[i].sct == 3) oneFreshPartLen = 32.970;
                if (snakes_29[i].sct == 4) oneFreshPartLen = 28.455;
                if (snakes_29[i].sct >= 5) oneFreshPartLen = 23.940;
                const lineNearHeadInFam = lineNearHeadLen / oneFreshPartLen;
                const snakeLenghtInParts = Math.max(snakes_29[i].sct + snakes_29[i].fam - Math.max(lineNearHeadInFam, 0), 1);
                let predSnakeLen = distBetwCoords(snakes_29[i].xx, snakes_29[i].yy, snakes_29[i].pts[snakes_29[i].pts.length - 1].xx, snakes_29[i].pts[snakes_29[i].pts.length - 1].yy);
                let j;
                for (j = snakes_29[i].pts.length - 2; j >= Math.max(snakes_29[i].pts.length - Math.floor(snakeLenghtInParts) - 2, 0); j--) {
                    predSnakeLen += distBetwCoords(snakes_29[i].pts[j].xx, snakes_29[i].pts[j].yy, snakes_29[i].pts[j+1].xx, snakes_29[i].pts[j+1].yy);
                }
                if (snakeLenghtInParts % 1 > 0 && j >= 0) {
                    let intermedX = snakes_29[i].pts[j+1].xx + (snakes_29[i].pts[j].xx - snakes_29[i].pts[j+1].xx) * (snakeLenghtInParts % 1) / 1;
                    let intermedY = snakes_29[i].pts[j+1].yy + (snakes_29[i].pts[j].yy - snakes_29[i].pts[j+1].yy) * (snakeLenghtInParts % 1) / 1;
                    predSnakeLen += distBetwCoords(intermedX, intermedY, snakes_29[i].pts[j+1].xx, snakes_29[i].pts[j+1].yy);
                }
                let newSnakeLen;
                if (predSnakeLen <= 240) {
                    let bottomEdge = 80;
                    let topEdge = 240;
                    let newBottomEdge = predSnakeLen * 0.50;
                    let newTopEdge = predSnakeLen;
                    newSnakeLen = newBottomEdge + ((newTopEdge - newBottomEdge) * (predSnakeLen - bottomEdge) / (topEdge - bottomEdge));
                }
                else {
                    newSnakeLen = predSnakeLen;
                }

                if (snakes_29[i].id === myId_29)
                    ctx.strokeStyle = createRgbaStr(50, 150, 50, 0.8,  35, 180, 35, 0.8,  snakes_29[i].sp);
                else
                    ctx.strokeStyle = createRgbaStr(223, 111.7, 0, 0.8,  223, 67.3, 44.4, 0.8,  snakes_29[i].sp);
                ctx.lineWidth = snakes_29[i].sc * 29 * zoom;
                strokeMoveWas = false;
                ctx.beginPath();
                addPointToPolyline(snakes_29[i].xx, snakes_29[i].yy);
                if (newSnakeLen < lineNearHeadLen) {
                    const distKf = newSnakeLen / distBetwCoords(snakes_29[i].xx, snakes_29[i].yy, snakes_29[i].pts[snakes_29[i].pts.length - 1].xx, snakes_29[i].pts[snakes_29[i].pts.length - 1].yy);
                    addPointToPolyline(getIntermed(snakes_29[i].xx, snakes_29[i].pts[snakes_29[i].pts.length - 1].xx, distKf), getIntermed(snakes_29[i].yy, snakes_29[i].pts[snakes_29[i].pts.length - 1].yy, distKf));
                }
                else {
                    newSnakeLen -= lineNearHeadLen;
                    addPointToPolyline(snakes_29[i].pts[snakes_29[i].pts.length - 1].xx, snakes_29[i].pts[snakes_29[i].pts.length - 1].yy);
                }
                for (let j = snakes_29[i].pts.length - 2; j >= 0; j--) {
                    const temp = distBetwCoords(snakes_29[i].pts[j].xx, snakes_29[i].pts[j].yy, snakes_29[i].pts[j+1].xx, snakes_29[i].pts[j+1].yy);
                    if (newSnakeLen < temp) {
                        const distKf = newSnakeLen / distBetwCoords(snakes_29[i].pts[j+1].xx, snakes_29[i].pts[j+1].yy, snakes_29[i].pts[j].xx, snakes_29[i].pts[j].yy);
                        addPointToPolyline(getIntermed(snakes_29[i].pts[j+1].xx, snakes_29[i].pts[j].xx, distKf), getIntermed(snakes_29[i].pts[j+1].yy, snakes_29[i].pts[j].yy, distKf));
                        break;
                    }
                    addPointToPolyline(snakes_29[i].pts[j].xx, snakes_29[i].pts[j].yy);
                    newSnakeLen -= temp;
                }
                function getIntermed (X1orY1, X2orY2, distKoef) {
                    return X1orY1 + (X2orY2 - X1orY1) * distKoef;
                }
                ctx.stroke();
            }
        }
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';

        // drawing map border
        if ((real_flux_grd_29 - distBetwCoords(0, 0, centerSiX - grd_29, centerSiY - grd_29)) * zoom < distBetwCoords(playingArenaWidth / 2, playingArenaHeight / 2, 0, 0)) {
            ctx.strokeStyle = 'rgb(128,83,0)';
            const edgeLineWidth = 30 * zoom;
            ctx.lineWidth = edgeLineWidth;
            ctx.beginPath();
            ctx.arc(siToPiX(grd_29), siToPiY(grd_29), real_flux_grd_29 * zoom + edgeLineWidth / 2, 0, 2*Math.PI);
            ctx.stroke();
        }

        // drawing foods
        ctx.fillStyle = 'rgb(255,255,255)';
        let scoreForFood;
        let foodSide;
        for (let i = 0; i < foods_c_29; i++) {
            scoreForFood = (Math.PI * Math.pow(foods_29[i].sz, 2)) * 0.015183;
            foodSide = Math.sqrt(scoreForFood) * 2.4 * zoom;
            ctx.fillRect(siToPiX(foods_29[i].xx) - foodSide / 2, siToPiY(foods_29[i].yy) - foodSide / 2, foodSide, foodSide);
        }

        // drawing preys
        ctx.fillStyle = 'rgba(165,42,42,0.8)';
        let preyRad;
        for (let i = 0; i < preys_29.length; i++) {
            preyRad = preys_29[i].sz * 2;
            ctx.beginPath();
            ctx.arc(siToPiX(preys_29[i].xx), siToPiY(preys_29[i].yy), preyRad * zoom, 0, 2*Math.PI);
            ctx.fill();
        }
        ctx.strokeStyle = 'rgb(36,255,255)';
        ctx.lineWidth = 1;
        let preyAngLineLen;
        for (let i = 0; i < preys_29.length; i++) {
            preyAngLineLen = preys_29[i].sp * 9.2;
            strokeMoveWas = false;
            ctx.beginPath();
            addPointToPolyline(preys_29[i].xx + preyAngLineLen * Math.cos(preys_29[i].ang), preys_29[i].yy + preyAngLineLen * Math.sin(preys_29[i].ang));
            addPointToPolyline(preys_29[i].xx, preys_29[i].yy);
            ctx.stroke();
        }
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        const preyWangLineLen = 25;
        for (let i = 0; i < preys_29.length; i++) {
            strokeMoveWas = false;
            ctx.beginPath();
            addPointToPolyline(preys_29[i].xx + preyWangLineLen * Math.cos(preys_29[i].wang), preys_29[i].yy + preyWangLineLen * Math.sin(preys_29[i].wang));
            addPointToPolyline(preys_29[i].xx, preys_29[i].yy);
            ctx.stroke();
        }

        // drawing snake beams, nicks
        ctx.strokeStyle = 'rgb(36,255,255)';
        ctx.lineWidth = 1;
        const snakeAngLineLen = 100;
        for (let i = 0; i < snakes_29.length; i++) {
            if (snakes_29[i].pts.length >= 2) {
                strokeMoveWas = false;
                ctx.beginPath();
                addPointToPolyline(snakes_29[i].xx + snakeAngLineLen * Math.cos(snakes_29[i].ang), snakes_29[i].yy + snakeAngLineLen * Math.sin(snakes_29[i].ang));
                addPointToPolyline(snakes_29[i].xx, snakes_29[i].yy);
                ctx.stroke();
            }
        }
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        const snakeWangLineLen = 50;
        for (let i = 0; i < snakes_29.length; i++) {
            if (snakes_29[i].pts.length >= 2) {
                if (snakes_29[i].id === myId_29)
                    ctx.strokeStyle = 'rgb(36,255,255)';
                strokeMoveWas = false;
                ctx.beginPath();
                addPointToPolyline(snakes_29[i].xx + snakeWangLineLen * Math.cos(snakes_29[i].eang), snakes_29[i].yy + snakeWangLineLen * Math.sin(snakes_29[i].eang));
                addPointToPolyline(snakes_29[i].xx, snakes_29[i].yy);
                ctx.stroke();
                if (snakes_29[i].id === myId_29)
                    ctx.strokeStyle = 'red';
            }
        }
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.textAlign = "center";
        ctx.font = Math.min(80 * zoom, 14) + "px sans-serif";
        for (let i = 0; i < snakes_29.length; i++) {
            if (snakes_29[i].pts.length >= 2) {
                if (snakes_29[i].id === myId_29)
                    continue;
                ctx.fillText(snakes_29[i].nk, siToPiX(snakes_29[i].xx), siToPiY(snakes_29[i].yy) + 67 * zoom);
            }
        }

        // drawing minimap
        if (minimapObjs_29.length >= 1) {
            const mmapScale = 2;
            const mmapEdgeLineWidth = 1.25 * mmapScale;
            const myMarkRadius = 1.5 * mmapScale;
            let mmapBeginX = playingArenaWidth - minimapObjs_29[0].sz * mmapScale + 0;
            let mmapBeginY = playingArenaHeight - minimapObjs_29[0].sz * mmapScale + 0;

            ctx.lineWidth = mmapEdgeLineWidth;
            ctx.beginPath();
            ctx.arc(mmapBeginX + ((minimapObjs_29[0].sz - 0.5) * mmapScale) / 2, mmapBeginY + ((minimapObjs_29[0].sz - 0.5) * mmapScale) / 2, ((minimapObjs_29[0].sz - 1) / 2 * mmapScale) * real_flux_grd_29 / rfgrdForMinimap_29 + mmapEdgeLineWidth / 2, 0, 2*Math.PI);
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fill();
            ctx.strokeStyle = 'rgb(128,83,0)';
            ctx.stroke();

            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            for (let i = 1; i < minimapObjs_29.length; i++) {
                ctx.fillRect(mmapBeginX + minimapObjs_29[i].xx * mmapScale, mmapBeginY + minimapObjs_29[i].yy * mmapScale, mmapScale, mmapScale);
            }

            if (mySnake) {
                ctx.fillStyle = 'rgba(255,0,70,0.8)';
                ctx.beginPath();
                ctx.arc(mmapBeginX + ((minimapObjs_29[0].sz - 0.5) * mmapScale) / 2 + (mySnake.xx - grd_29) * ((minimapObjs_29[0].sz - 1) * mmapScale) / (rfgrdForMinimap_29 * 2), mmapBeginY + ((minimapObjs_29[0].sz - 0.5) * mmapScale) / 2 + (mySnake.yy - grd_29) * ((minimapObjs_29[0].sz - 1) * mmapScale) / (rfgrdForMinimap_29 * 2), myMarkRadius, 0, 2*Math.PI);
                ctx.fill();
            }
        }

        // drawing fps and zoom info
        ctx.fillStyle = 'rgb(220,220,220)';
        ctx.textAlign = "left";
        ctx.font = "11px sans-serif";
        ctx.fillText("fps:  " + currentFps_29 + "      zoom:  " + zoom.toFixed(2) + "      ping:  " + avgPing_29.toFixed(2), 280, 15);

        // drawing leaderboard, rank, score
        let myLenghtInfo = "";
        if (mySnake) {
            const sct = mySnake.sct + mySnake.rsc;
            const score = Math.floor((fpsls_29[sct] + mySnake.fam / fmlts_29[sct] - 1) * 15 - 5) / 1;
            myLenghtInfo = " " + score + "        " + mySnake.rsc;
        }
        const infoText = playersInfo_29 == "" ? myLenghtInfo : playersInfo_29 + "\n" + myLenghtInfo;
        ctx.fillStyle = 'rgb(220,220,220)';
        ctx.textAlign = "left";
        infoText.split('\n').forEach((line, index) => ctx.fillText(line, 10, 15 + index * 14));

        function addPointToPolyline(slx, sly) {
            const piX = (slx - leftSiX) * zoom;
            const piY = (sly - topSiY) * zoom;
            if (strokeMoveWas) {
                ctx.lineTo(piX, piY);
            }
            else {
                ctx.moveTo(piX, piY);
                strokeMoveWas = true;
            }
        }
        function siToPiX(siX) {
            return (siX - leftSiX) * zoom;
        }
        function siToPiY(siY) {
            return (siY - topSiY) * zoom;
        }
        function distBetwCoords(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(Math.abs(x1-x2), 2) + Math.pow(Math.abs(y2-y1), 2));
        }
        function createRgbaStr(r1, g1, b1, a1,  r2, g2, b2, a2,  speed) {
            function clcParam(paramDownPoint, paramUpPoint) {
                const speedDownPoint = 5.5;
                const speedUpPoint = 14;
                const speDif = speedUpPoint - speedDownPoint;
                const prmDif = paramUpPoint - paramDownPoint;
                return paramDownPoint + (prmDif * (speed - speedDownPoint) / speDif);
            }
            return 'rgba(' + clcParam(r1, r2) + ',' + clcParam(g1, g2) + ',' + clcParam(b1, b2) + ',' + clcParam(a1, a2) + ')';
        }
    }

    {
        myValidNick_29 = "";
        let v;
        for (let i = 0; i < myNick_29.length; i++) {
            v = myNick_29.charCodeAt(i);
            if (v < 32 || v > 127)
                myValidNick_29 += " ";
            else
                myValidNick_29 += String.fromCharCode(v)
        }
        if (myValidNick_29.length > 24)
            myValidNick_29 = myValidNick_29.substr(0, 24);

        myValidSkin_29 = Math.min(Math.max(mySkin_29, 0), 65);

        myCustomSkinData_29 = [255, 255, 255, 0, 0, 0];
        myCustomSkinData_29.push(Math.floor(Math.random() * 256));
        myCustomSkinData_29.push(Math.floor(Math.random() * 256));
        let myValidCustomSkin_29 = [];
        for (let i = 0; i < myCustomSkin_29.length; i++) {
            if ((myCustomSkin_29[i] < 0 || myCustomSkin_29[i] > 35) && myCustomSkin_29[i] != 37 && myCustomSkin_29[i] != 39 && myCustomSkin_29[i] != 41)
                continue;
            myValidCustomSkin_29.push(myCustomSkin_29[i]);
        }
        let mvcsLen = Math.min(myValidCustomSkin_29.length, 227);
        let currentNumber;
        let repeNumbCounter;
        for (let i = 0; i < mvcsLen; i++) {
            currentNumber = myValidCustomSkin_29[i];
            repeNumbCounter = 1;
            while (currentNumber == myValidCustomSkin_29[i + 1] && i < mvcsLen - 1) {
                repeNumbCounter++;
                i++;
            }
            myCustomSkinData_29.push(repeNumbCounter);
            myCustomSkinData_29.push(currentNumber);
        }

        myValidCosmetic_29 = myCosmetic_29;
        if (myValidCosmetic_29 != 255 && (myValidCosmetic_29 < 0 || myValidCosmetic_29 > 31))
            myValidCosmetic_29 = 255;
    }

    document.body.style.backgroundColor = 'rgb(7,7,7)';

    const serverIpAndPortField = document.createElement('input');
    serverIpAndPortField.type = 'text';
    serverIpAndPortField.placeholder = '57.129.37.42:444';
    serverIpAndPortField.value = serverIpAndPortForInputField_29;
    serverIpAndPortField.style.position = 'fixed';
    serverIpAndPortField.style.right = '10px';
    serverIpAndPortField.style.top = '7px';
    serverIpAndPortField.style.width = '130px';
    serverIpAndPortField.style.height = '20px';
    serverIpAndPortField.style.background = 'rgba(200,200,200,0.2)';
    serverIpAndPortField.style.border = '2px solid rgb(150,150,150)';
    serverIpAndPortField.style.borderRadius = '5px';
    serverIpAndPortField.style.color = 'rgb(200,200,200)';
    serverIpAndPortField.style.zIndex = 2;
    document.body.appendChild(serverIpAndPortField);

    const stopGameBtn = document.createElement('button');
    stopGameBtn.textContent = 'Stop the game';
    stopGameBtn.style.position = 'fixed';
    stopGameBtn.style.right = '10px';
    stopGameBtn.style.top = '35px';
    stopGameBtn.style.width = '130px';
    stopGameBtn.style.height = '20px';
    stopGameBtn.style.background = 'rgba(200,200,200,0.2)';
    stopGameBtn.style.border = '2px solid rgb(150,150,150)';
    stopGameBtn.style.borderRadius = '10px';
    stopGameBtn.style.color = 'rgb(200,200,200)';
    stopGameBtn.style.zIndex = 2;
    document.body.appendChild(stopGameBtn);

    const newGameBtn = document.createElement('button');
    newGameBtn.textContent = 'New game';
    newGameBtn.style.position = 'fixed';
    newGameBtn.style.right = '10px';
    newGameBtn.style.top = '63px';
    newGameBtn.style.width = '130px';
    newGameBtn.style.height = '20px';
    newGameBtn.style.background = 'rgba(200,200,200,0.2)';
    newGameBtn.style.border = '2px solid rgb(150,150,150)';
    newGameBtn.style.borderRadius = '10px';
    newGameBtn.style.color = 'rgb(200,200,200)';
    newGameBtn.style.zIndex = 2;
    document.body.appendChild(newGameBtn);

    window.onwheel = function(e) {
        const minZoom = 0.01;
        const maxZoom = 5.0;
        let consideredZoom;
        if (e.deltaY > 0) {
            consideredZoom = zoom - (zoom / 10.0);
            if (consideredZoom >= minZoom)
                zoom = consideredZoom;
        }
        else {
            consideredZoom = zoom + (zoom / 9.0);
            if (consideredZoom <= maxZoom)
                zoom = consideredZoom;
        }
    };

    window.onmousedown = function(e) {
        acceleration_29 = true;
    };

    window.onmouseup = function(e) {
        acceleration_29 = false;
    };

    window.onmousemove = function(e) {
        whereMouseX_29 = e.clientX;
        whereMouseY_29 = e.clientY;
    };

    stopGameBtn.onclick = function() {
        if (buttonFunctionality_29) {
            if (gameExists_29) {
                wantCloseCurrentGame_29 = true;
            }
        }
    };

    newGameBtn.onclick = function() {
        if (buttonFunctionality_29) {
            buttonFunctionality_29 = false;
            if (gameExists_29) {
                wantCloseCurrentGame_29 = true;
                wantNewGame_29 = true;
            }
            else {
                prepareNewGame_29();
            }
        }
    };

})();