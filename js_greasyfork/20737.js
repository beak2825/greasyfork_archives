// ==UserScript==
// @name         Slither.io Donuts Promo
// @namespace    http://bit.ly/26jB20O
// @version      1.0
// @description  Slither.io Donuts is a slither.io extension which allows you to create your own custom skins. Please, subscribe to the developer on YouTube: http://bit.ly/26jB20O. If you use the extension for your videos, please, credit my channel.
// @author       Donut (subscribe on YouTube: http://bit.ly/26jB20O)
// @include      http://slither.io/
// @include      http://slither.io/#*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20737/Slitherio%20Donuts%20Promo.user.js
// @updateURL https://update.greasyfork.org/scripts/20737/Slitherio%20Donuts%20Promo.meta.js
// ==/UserScript==

/* The code bellow is fully cpoyrighted. You have no right to copy, change and
   use whatever piece of the code below in any other script. BUT you can
   dynamically load this file in your script.
   You have no right to use the interfaces created with this script to promote
   yourself, your website, company, etc. Don't change any elements created with
   this script.
   WARNING: The software is provided "as is". It can be changed or deleted any
   time with no notification. Use it on your own risk. 
*/

/**
 * @file A script for slither.io online game
 * @author Max Tirdatov <maxdonutio@gmail.com>
 * @copyright (c) All rights reserved. Not to be reposted elsewhere. No to be used in other slither.io scripts.
 */

setTimeout(function(){if (!window.donutsEnabled) {
    console.log("The extension you're using includes features developed by Donut. Please, subscribe to him on YuoTube: https://goo.gl/7XnfAz.");
    console.log("Avoid deleting your browser's cookies and local storage if you don't want to lose your skin settings.");
    
    if (!+localStorage.getItem('edttsg')) {
        localStorage.setItem('edttsg', 1);
        cskh.style.display = "inline";
        cstx.style.display = "none";
    }
    if (isNaN(+localStorage['snakercv'])) localStorage.setItem('snakercv', 0);
    if (!localStorage.getItem('donuts-skins')) localStorage.setItem('donuts-skins', '[]');

    var body = document.body;
    
    function createWindow() {
        var blackout = document.createElement('div');
        blackout.className = 'donuts-blackout';
        body.appendChild(blackout);
        var wind = document.createElement('div');
        wind.className = 'donuts-window';
        wind.onmousedown = function(e) {
            e.stopPropagation();
        };
        blackout.appendChild(wind);
        return blackout;
    }

    // <Styles>

    var styles = {
        '.donuts-link': {
            color: 'white',
            'font-size': '16px',
            cursor: 'pointer'
        },
        '.donuts-link:hover': {
            'text-shadow': '1px 1px 4px rgba(0,0,0,1)'
        },
        '.donuts-blue': {
            color: '#3366FF',
            'text-decoration': 'none',
            cursor: 'pointer'
        },
        '.donuts-blackout': {
            display: 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            visibility: 'hidden',
            position: 'fixed',
            top: 0, right: 0, bottom: 0, left: 0,
            background: 'rgba(0,0,0,.5)',
            opacity: 0,
            'z-index': 100000002,
            transition: 'opacity 0.5s'
        },
        '.donuts-window': {
            'box-sizing': 'border-box',
            padding: '12px',
            'min-width': '300px',
            'max-height': hh - 50 + 'px',
            background: 'white',
            'border-radius': '10px',
            'box-shadow': '0 0 20px 7px rgba(0,0,0,.5)',
            'font-family': 'Calibri, Tahoma, Arial, sans-serif',
            overflow: 'auto'
        },
        '.donuts-window>h2': {
            margin: 0,
            'text-align': 'center'
        }
    };

    var style = document.createElement('style');
    document.head.appendChild(style);
    stylesheet = style.sheet;
    for (var selector in styles)
        for (var property in styles[selector])
            stylesheet.insertRule(selector + '{' +  property + ':' + styles[selector][property] + ';' + '}', stylesheet.cssRules.length);

    // </Styles>

    var div = document.createElement('div');
    div.className = 'nsi';
    div.style.display = 'none';
    div.style.opacity = 0;
    div.style.position = 'fixed';
    div.style.bottom = '35px';
    div.style.left = '20%';
    div.style.right = '20%';
    div.style.color = 'white';
    div.style.fontFamily = 'Arial, sans-serif';
    div.style.textAlign = 'center';
    div.style.zIndex = 100000000;
    body.appendChild(div);

    // <Custom Colors>

    function applyColor(i) {
        o = {
                imgs: [],
                fws: [],
                fhs: [],
                fw2s: [],
                fh2s: [],
                gimgs: [],
                gfws: [],
                gfhs: [],
                gfw2s: [],
                gfh2s: [],
                oimgs: [],
                ofws: [],
                ofhs: [],
                ofw2s: [],
                ofh2s: []
            };
            var rs = "00" + rrs[i].toString(16),
                gs = "00" + ggs[i].toString(16),
                bs = "00" + bbs[i].toString(16),
                rs = rs.substr(rs.length - 2),
                gs = gs.substr(gs.length - 2),
                bs = bs.substr(bs.length - 2);
            o.cs = "#" + rs + gs + bs;
            var sz = 62,
                kfmc = document.createElement("canvas");
            kfmc.width = kfmc.height = sz;
            ctx = kfmc.getContext("2d");
            map = ctx.getImageData(0, 0, sz, sz);
            imgd = map.data;
            l = imgd.length;
            for (p =
                 yy = xx = 0; p < l; p += 4) v = Math.abs(Math.sqrt(Math.pow(sz / 2 - xx, 2) + Math.pow(sz / 2 - yy, 2)) - 16), v = 15 >= v ? 1 - v / 15 : 0, imgd[p] = rrs[i], imgd[p + 1] = ggs[i], imgd[p + 2] = bbs[i], imgd[p + 3] = Math.floor(255 * v), xx++, xx >= sz && (xx = 0, yy++);
            ctx.putImageData(map, 0, 0);
            o.kfmc = kfmc;
            var ksz = 48,
                ksz2 = ksz / 2,
                kmc = document.createElement("canvas");
            kmc.width = kmc.height = ksz;
            ctx = kmc.getContext("2d");
            ctx.fillStyle = "#FFFFFF";
            ctx.arc(ksz2, ksz2, ksz2, 0, pi2);
            ctx.fill();
            map = ctx.getImageData(0, 0, ksz, ksz);
            imgd = map.data;
            l = imgd.length;
            yy = xx = 0;
            var kmcs = [];
            for (j =
                 0; 7 > j; j++) {
                for (p = xx = yy = 0; p < l; p += 4) {
                    var v = Math.pow(Math.max(0, Math.min(1, 1 - Math.abs(yy - ksz2) / ksz2)), .35),
                        v2 = Math.max(0, Math.min(1, 1 - Math.sqrt(Math.pow(xx - ksz2, 2) + Math.pow(yy - ksz2, 2)) / 34)),
                        v = v + .375 * (v2 - v),
                        v = v * (1.22 - .44 * j / 6);
                    rr = rrs[i];
                    gg = ggs[i];
                    bb = bbs[i];
                    imgd[p] = Math.max(0, Math.min(255, Math.floor(rr * v)));
                    imgd[p + 1] = Math.max(0, Math.min(255, Math.floor(gg * v)));
                    imgd[p + 2] = Math.max(0, Math.min(255, Math.floor(bb * v)));
                    xx++;
                    xx >= ksz && (xx = 0, yy++)
                }
                ctx.putImageData(map, 0, 0);
                var kmc2 = document.createElement("canvas");
                kmc2.width = kmc2.height = ksz;
                var ctx2 = kmc2.getContext("2d");
                ctx2.drawImage(kmc, 0, 0);
                /*if (10 == i)
                    for (k = -1; 1 >= k; k++) {
                        var tx = ksz2 + ksz2 / 16 * Math.cos(2 * Math.PI * k / 8) * 13,
                            ty = ksz2 + ksz2 / 16 * Math.sin(2 * Math.PI * k / 8) * 13;
                        ctx2.fillStyle = "#FFFFFF";
                        ctx2.beginPath();
                        for (m = 0; 5 >= m; m++) xx = tx + ksz / 32 * Math.cos(2 * Math.PI * m / 5) * .05 * 24, yy = ty + ksz / 32 * Math.sin(2 * Math.PI * m / 5) * .05 * 24, 0 == m ? ctx2.moveTo(xx, yy) : ctx2.lineTo(xx, yy), xx = tx + ksz / 32 * Math.cos(2 * Math.PI * (m + .5) / 5) * 3.1, yy = ty + ksz / 32 * Math.sin(2 * Math.PI * (m + .5) / 5) * 3.1, ctx2.lineTo(xx, yy);
                        ctx2.fill()
                    } else if (19 == i)
                        for (k = -2; 2 >= k; k++) {
                            tx = ksz2 + ksz2 / 16 * Math.cos(2 * Math.PI * k / 15) * 13;
                            ty = ksz2 + ksz2 / 16 * Math.sin(2 * Math.PI * k / 15) * 13;
                            ctx2.save();
                            ctx2.globalAlpha = .7;
                            ctx2.fillStyle = "#FFFFFF";
                            ctx2.beginPath();
                            for (m = 0; 5 >= m; m++) xx = tx + ksz / 32 * Math.cos(2 * Math.PI * m / 5) * .05 * 12, yy = ty + ksz / 32 * Math.sin(2 * Math.PI * m / 5) * .05 * 12, 0 == m ? ctx2.moveTo(xx, yy) : ctx2.lineTo(xx, yy), xx = tx + ksz / 32 * Math.cos(2 * Math.PI * (m + .5) / 5) * 1.55, yy = ty + ksz / 32 * Math.sin(2 * Math.PI * (m + .5) / 5) * 1.55, ctx2.lineTo(xx, yy);
                            ctx2.fill();
                            ctx2.restore()
                        } else if (20 == i)
                            for (k = -1.5; 1.5 >= k; k++) {
                                tx = ksz2 + ksz2 / 16 * Math.cos(2 * Math.PI * k / 15) * 13;
                                ty = ksz2 + ksz2 / 16 * Math.sin(2 * Math.PI * k / 15) * 13;
                                ctx2.save();
                                ctx2.globalAlpha = .7;
                                ctx2.fillStyle = "#FFFFFF";
                                ctx2.beginPath();
                                for (m = 0; 5 >= m; m++) xx = tx + ksz2 / 16 * Math.cos(2 * Math.PI * m / 5) * .05 * 14, yy = ty + ksz2 / 16 * Math.sin(2 * Math.PI * m / 5) * .05 * 14, 0 == m ? ctx2.moveTo(xx, yy) : ctx2.lineTo(xx, yy), xx = tx + ksz2 / 16 * Math.cos(2 * Math.PI * (m + .5) / 5) * 1.8, yy = ty + ksz2 / 16 * Math.sin(2 * Math.PI * (m + .5) / 5) * 1.8, ctx2.lineTo(xx, yy);
                                ctx2.fill();
                                ctx2.restore()
                            }*/
                kmcs.push(kmc2)
            }
            o.kmcs = kmcs;
            per_color_imgs.push(o);
            for (j = 2.8; 18.8 >= j; j += 1) {
                var cc = document.createElement("canvas"),
                    sz = Math.ceil(2.5 * j + 28);
                cc.width = cc.height = sz;
                ctx = cc.getContext("2d");
                ctx.fillStyle = o.cs;
                ctx.arc(sz / 2, sz / 2, .65 * j, 0, pi2);
                ctx.shadowBlur = 12;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = "#" + rs + gs + bs;
                ctx.globalAlpha = .8;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.fill();
                o.imgs.push(cc);
                o.fws.push(sz);
                o.fhs.push(sz);
                o.fw2s.push(sz / 2);
                o.fh2s.push(sz / 2);
                sz = Math.ceil(8 * j + 6);
                cc = document.createElement("canvas");
                cc.width = cc.height = sz;
                ctx = cc.getContext("2d");
                g = ctx.createRadialGradient(sz / 2, sz / 2, 1, sz / 2, sz / 2, 4 * j);
                g.addColorStop(0, "rgba(" + rrs[i] + ", " + ggs[i] + ", " + bbs[i] + ", 1)");
                g.addColorStop(1, "rgba(" + rrs[i] + ", " + ggs[i] + ", " + bbs[i] + ", 0)");
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, sz, sz);
                o.gimgs.push(cc);
                o.gfws.push(sz);
                o.gfhs.push(sz);
                o.gfw2s.push(sz / 2);
                o.gfh2s.push(sz / 2);
                cc = document.createElement("canvas");
                sz = Math.ceil(1.3 * j + 6);
                cc.width = cc.height = sz;
                ctx = cc.getContext("2d");
                var eam = .2,
                    g = ctx.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, j / 2);
                g.addColorStop(0, "rgba(" +
                               rrs[i] + ", " + ggs[i] + ", " + bbs[i] + ", 1)");
                g.addColorStop(.99, "rgba(" + Math.floor(rrs[i] * eam) + ", " + Math.floor(ggs[i] * eam) + ", " + Math.floor(bbs[i] * eam) + ", 1)");
                g.addColorStop(1, "rgba(" + Math.floor(rrs[i] * eam) + ", " + Math.floor(ggs[i] * eam) + ", " + Math.floor(bbs[i] * eam) + ", 0)");
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, sz, sz);
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 2;
                ctx.arc(sz / 2, sz / 2, .65 * j, 0, pi2);
                ctx.globalAlpha = 1;
                ctx.stroke();
                o.oimgs.push(cc);
                o.ofws.push(sz);
                o.ofhs.push(sz);
                o.ofw2s.push(sz / 2);
                o.ofh2s.push(sz / 2)
            }
            o.ic =
                o.imgs.length;
            o.pr_imgs = [];
            o.pr_fws = [];
            o.pr_fhs = [];
            o.pr_fw2s = [];
            o.pr_fh2s = [];
            for (j = 3; 24 >= j; j += 1) cc = document.createElement("canvas"), sz = Math.ceil(2 * j + 38), cc.width = cc.height = sz, ctx = cc.getContext("2d"), ctx.fillStyle = o.cs, ctx.arc(sz / 2, sz / 2, j / 2, 0, pi2), ctx.shadowBlur = 22, ctx.shadowOffsetY = 0, ctx.shadowColor = "#" + rs + gs + bs, ctx.fill(), ctx.fill(), o.pr_imgs.push(cc), o.pr_fws.push(sz), o.pr_fhs.push(sz), o.pr_fw2s.push(sz / 2), o.pr_fh2s.push(sz / 2)
    };

    function applyColors(update = true) {
        per_color_imgs.splice(ncolors, ccolors.length);
        ccolors = [];
        if (update) {
            for (var i = cccs.childNodes.length - 1; i >= 0; i--) {
                if (cccs.childNodes[i].childNodes.length == 5) {
                    rrs.splice(ncolors+i,1);
                    ggs.splice(ncolors+i,1);
                    bbs.splice(ncolors+i,1);
                    cccs.removeChild(cccs.childNodes[i]);
                    for (var j = i+1; j < cccs.childNodes.length; j++)
                        cccs.childNodes[j].dataset.n = cccs.childNodes[j].dataset.n - 1;
                    for (var j = 0; j < skins.length; j++)
                        for (var k = 0; k < skins[j].skin.rbcs.length; k++)
                            if (skins[j].skin.rbcs[k] >= ncolors + i) skins[j].skin.rbcs[k]--;
                }
            }
            saveSkins();
            colorMenu();
            workspace();
        }
        for (var i = ncolors; i < rrs.length; i++) {
            ccolors.push([rrs[i], ggs[i], bbs[i]]);
            applyColor(i);
        }
        localStorage.setItem('donuts-colors', JSON.stringify(ccolors));
    }

    var currentColor = null,
        ccrestore = document.createElement('div');
    ccrestore.innerHTML = 'You just deleted this color. <span class="donuts-blue">Restore</span>';
    ccrestore.style.position = 'absolute';
    ccrestore.style.top = ccrestore.style.left = 0;
    ccrestore.style.width = '100%';
    ccrestore.style.height = '46px';
    ccrestore.style.background = 'rgba(255,255,255,0.95)';
    ccrestore.style.lineHeight = '46px';
    ccrestore.style.textAlign = 'center';
    
    function newColor(rgb) {
        var ccc = document.createElement('div');
        ccc.dataset.n = rrs.length;
        ccc.style.position = 'relative';
        ccc.style.margin = '8px';
        cccs.appendChild(ccc);

        var ccself = document.createElement('div');
        ccself.style.display = 'inline-block';
        ccself.style.boxSizing = 'content-box';
        ccself.style.width = '40px';
        ccself.style.height = '40px';
        ccself.style.border = '3px solid rgba(0,0,0,0.5)';
        ccc.appendChild(ccself);

        var ccnames = document.createElement('div'),
            ccr = document.createElement('div'),
            ccg = document.createElement('div'),
            ccb = document.createElement('div');
        ccnames.style.display = 'inline-block';
        ccnames.style.boxSizing = 'content-box';
        ccnames.style.margin = '0 8px';
        ccnames.style.width = '45px';
        ccr.textContent = 'Red: ';
        ccg.textContent = 'Green: ';
        ccb.textContent = 'Blue: ';
        ccr.style.lineHeight = ccg.style.lineHeight = ccb.style.lineHeight = '10px';
        ccg.style.margin = '8px 0';
        ccc.appendChild(ccnames);
        ccnames.appendChild(ccr);
        ccnames.appendChild(ccg);
        ccnames.appendChild(ccb);

        var ccgrads = document.createElement('div');
        ccgrads.style.display = 'inline-block';
        ccgrads.style.width = '256px';
        ccc.appendChild(ccgrads);
        
        var ccred = document.createElement('canvas');
        var ccgreen = document.createElement('canvas');
        var ccblue = document.createElement('canvas');
        ccred.style.cursor = ccgreen.style.cursor = ccblue.style.cursor = 'pointer';
        ccgreen.style.margin = '8px 0';
        var ccrgb = [ccred, ccgreen, ccblue];
        ccred.onmousedown = ccgreen.onmousedown = ccblue.onmousedown = function(e) {
            currentColor = this;
            body.onmousemove(e);
        };
        ccred.width = ccgreen.width = ccblue.width = 256;
        ccred.height = ccgreen.height = ccblue.height = 10;
        ccgrads.appendChild(ccred);
        ccgrads.appendChild(ccgreen);
        ccgrads.appendChild(ccblue);
        
        var ccdelete = document.createElement('div');
        ccdelete.innerHTML = '<span class="donuts-blue">Delete</span>';
        ccdelete.style.display = 'inline-block';
        ccdelete.style.boxSizing = 'content-box';
        ccdelete.style.marginLeft = '8px';
        ccdelete.style.width = '50px';
        ccdelete.style.height = '46px';
        ccdelete.style.lineHeight = '46px';
        ccdelete.style.verticalAlign = 'top';
        ccdelete.firstChild.onclick = function() {
            var ccback = ccrestore.cloneNode(true);
            ccback.onclick = function() {
                this.parentNode.removeChild(this);
            };
            this.parentNode.parentNode.appendChild(ccback);
        };
        ccc.appendChild(ccdelete);
        
        setColor(rgb, ccc);
    }
    
    function parseColor(input) {
        var m = input.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if( m) {
            return [+m[1],+m[2],+m[3]];
        }
    }

    function setColor(rgb, el) {
        var n = el.dataset.n;
        rrs[n] = rgb[0];
        ggs[n] = rgb[1];
        bbs[n] = rgb[2];
        for (var i = 0; i < 3; i++) {
            el.firstChild.style.backgroundColor = 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
            var rgb0 = rgb.slice(), rgb1 = rgb.slice();
            rgb0[i] = 0, rgb1[i] = 255;
            var ctx = el.childNodes[2].children[i].getContext('2d');
            var grad = ctx.createLinearGradient(0,0,256,0);
            grad.addColorStop(0, 'rgb('+rgb0[0]+','+rgb0[1]+','+rgb0[2]+')');
            grad.addColorStop(1, 'rgb('+rgb1[0]+','+rgb1[1]+','+rgb1[2]+')');
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,256,10);
            ctx.beginPath();
            ctx.arc(rgb[i],5,3,0,2*Math.PI);
            ctx.strokeStyle = (rgb[0] + rgb[1] + rgb[2] < 350) ? '#fff' : '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    function setColors() {
        for (var i = 0; i < ccolors.length; i++)
            newColor([ccolors[i][0], ccolors[i][1], ccolors[i][2]]);
        applyColors(false);
    }
    
    var ccolors = JSON.parse(localStorage.getItem('donuts-colors')) || [],
        ncolors = rrs.length,
        ccblackout = createWindow(),
        ccdiv = ccblackout.firstChild;

    var ccheader = document.createElement('h2');
    ccheader.textContent = 'Custom colors';
    ccdiv.appendChild(ccheader);

    var cccs = document.createElement('div');
    ccdiv.appendChild(cccs);

    var ccnew = document.createElement('div');
    ccnew.innerHTML = '<span class="donuts-blue">New color</span>';
    ccnew.style.textAlign = 'center';
    ccnew.style.fontSize = '20px';
    ccnew.firstChild.onclick = function() {
        newColor([255,255,255]);
    };
    ccdiv.appendChild(ccnew);

    var ccbtns = document.createElement('div');
    ccbtns.style.margin = '10px 0 6px 0';
    ccbtns.style.textAlign = 'center';
    ccdiv.appendChild(ccbtns);
    
    var ccsave = makeTextBtn('Save', 36, 16, 18, 1).elem;
    ccsave.style.position = 'relative';
    ccsave.style.display = 'inline-block';
    ccsave.style.removeProperty('box-shadow');
    ccsave.onclick = function() {
        ccblackout.style.opacity = 0;
        setTimeout(function() {
            ccblackout.style.visibility = 'hidden';
        }, 500);
        applyColors();
    };
    ccbtns.appendChild(ccsave);
    
    var cccancel = makeTextBtn('Cancel', 36, 16, 18, 2).elem;
    cccancel.style.position = 'relative';
    cccancel.style.display = 'inline-block';
    cccancel.style.marginLeft = '6px';
    cccancel.style.removeProperty('box-shadow');
    cccancel.onclick = function() {
        ccblackout.style.opacity = 0;
        setTimeout(function() {
            ccblackout.style.visibility = 'hidden';
        }, 500);
        rrs.splice(ncolors, rrs.length - ncolors);
        ggs.splice(ncolors, ggs.length - ncolors);
        bbs.splice(ncolors, bbs.length - ncolors);
        while (cccs.firstChild)
            cccs.removeChild(cccs.firstChild);
        setColors();
    };
    ccbtns.appendChild(cccancel);
    
    // </Custom Colors>

    // <Skin Constructor>

    var ss = setSkin;
    setSkin = function(b, h) {
        if (!snake) h = localStorage.getItem('snakercv');
        ss(b, h);
        if (h > max_skin_cv) {
            setTimeout(function() {b.rbcs = skins[h - max_skin_cv - 1].skin.rbcs;}, 0);
        }
        if (sc) setTimeout(workspace, 0);
    };
    function newSkin() {
        skins.push({skin:{rbcs:[9]}});
        var storageSkins = JSON.parse(localStorage.getItem('donuts-skins'));
        storageSkins.push({skin:{rbcs:[9]}});
        localStorage.setItem('donuts-skins', JSON.stringify(storageSkins));
        setSkin(snake, max_skin_cv + skins.length);
    }
    function updateSkin() {
        var toSave = JSON.parse(localStorage.getItem('donuts-skins')), singleColor = true;
        toSave[snake.rcv - max_skin_cv - 1].skin.rbcs = JSON.parse(JSON.stringify(snake.rbcs));
        for (var i = 0; i < snake.rbcs.length; i++) {
            if (snake.rbcs[i] >= ncolors) toSave[snake.rcv - max_skin_cv - 1].skin.rbcs[i] = ~snake.rbcs[i] + ncolors;
            if (singleColor && i > 0 && snake.rbcs[i] != snake.rbcs[i-1]) singleColor = false;
        }
        if (singleColor) snake.rbcs = [snake.rbcs[0]], toSave[snake.rcv - max_skin_cv - 1].skin.rbcs = [toSave[snake.rcv - max_skin_cv - 1].skin.rbcs[0]];
        skins[snake.rcv - max_skin_cv - 1].skin.rbcs = snake.rbcs;
        localStorage.setItem('donuts-skins', JSON.stringify(toSave));
    }
    function saveSkins() {
        var toSave = JSON.parse(JSON.stringify(skins));
        for (var i = 0; i < toSave.length; i++)
            for (var j = 0; j < toSave[i].length; j++)
                if (toSave[i].skin.rbcs[j] >= ncolors) toSave[i].skin.rbcs[j] = ~toSave[i].skin.rbcs[j] + ncolors;
        localStorage.setItem('donuts-skins', JSON.stringify(toSave));
    }

    var sc = false;
    function sfc(el, bottom = false) {
        var prop = bottom ? 'bottom' : 'top';
        el.style.transition = '0.5s';
        el.style[prop] = parseInt(el.style[prop]) + (sc != bottom ? 250 : -250) + 'px';
        setTimeout(function() {
            el.style.removeProperty('transition');
        }, 500);
    }
    function Constructor(onlyReset = false) {
        if (!(onlyReset && !sc)) {
            sfc(mc);
            sfc(pskh);
            sfc(nskh);
            sfc(skodiv);
            sfc(div, true);
            sfc(scdiv, true);
            sc ? scdiv.style.removeProperty('box-shadow') : scdiv.style.boxShadow = '0px -3px 2px rgba(0,0,0,0.5)';
            sc = !sc;
        }
    }

    function workspace() {
        while (sccss.firstChild)
            sccss.removeChild(sccss.firstChild);
        if (snake.rcv > max_skin_cv && snake.rcv <= max_skin_cv + skins.length) {
            scdef.style.display = 'none';
            scadd.style.display = scskin.style.display = 'block';
            var colorStops = [0];
            for (var i = 1; i < snake.rbcs.length; i++) {
                if (snake.rbcs[i-1] != snake.rbcs[i]) break;
                if (i == snake.rbcs.length - 1) snake.rbcs = [snake.rbcs[0]];
            }
            for (var i = 1; i < snake.rbcs.length; i++)
                if (snake.rbcs[i] != snake.rbcs[i-1]) colorStops.push(i);
            for (var i = 0; i < colorStops.length; i++) {
                var sccs = document.createElement('div');
                sccs.dataset.position = colorStops[i];
                sccs.style.marginBottom = '1px';
                sccss.appendChild(sccs);

                var sccolor = document.createElement('div');
                sccolor.textContent = 'Color:';
                sccolor.style.position = 'relative';
                sccolor.style.display = 'inline-block';
                sccolor.style.width = '125px';
                sccs.appendChild(sccolor);

                var scc = colors[snake.rbcs[colorStops[i]]].cloneNode();
                scc.style.margin = '0 0 0 10px';
                scc.style.verticalAlign = 'middle';
                scc.onclick = function(e) {
                    e.stopPropagation();
                    var sccolor = this.parentNode;
                    sccm.parentNode == sccolor ? sccolor.removeChild(sccm) : sccolor.appendChild(sccm);
                };
                sccolor.appendChild(scc);

                var sccells = document.createElement('div');
                sccells.textContent = 'Cells number:';
                sccells.style.display = 'inline-block';
                sccells.style.marginRight = '13px';
                sccs.appendChild(sccells);

                var sccn = document.createElement('input');
                sccn.type = 'number';
                sccn.min = 1;
                sccn.value = (colorStops.length - 1 == i ? snake.rbcs.length : colorStops[i+1]) - colorStops[i];
                if (colorStops.length == 1) sccn.disabled = true;
                sccn.style.marginLeft = '10px';
                sccn.style.width = '50px';
                sccn.style.height = '20px';
                sccn.style.border = '1px solid #A9A9A9';
                sccn.style.fontSize = '12px';
                sccn.style.verticalAlign = 'middle';
                sccn.onchange = function() {
                    var sccs = this.parentNode.parentNode,
                        prevValue = (sccs.nextSibling ? +sccs.nextSibling.dataset.position : snake.rbcs.length) - +sccs.dataset.position;
                    if (isNaN(parseInt(this.value))) {
                        this.value = prevValue; return;
                    }
                    var args = [+sccs.dataset.position, 0];
                    if (this.value > prevValue)
                        for (var i = 0; i < this.value - prevValue; i++)
                            args.push(snake.rbcs[args[0]]);
                    else args[1] = prevValue - this.value;
                    Array.prototype.splice.apply(snake.rbcs, args);
                    updateSkin();
                    if (this.value == 0) workspace();
                    else while (sccs = sccs.nextSibling)
                        sccs.dataset.position = +sccs.dataset.position + +this.value - prevValue;
                };
                sccells.appendChild(sccn);

                if (!sccn.disabled) {
                    var sccsd = document.createElement('div');
                    sccsd.textContent = 'Delete';
                    sccsd.className = 'donuts-blue';
                    sccsd.style.display = 'inline-block';
                    sccsd.style.fontSize = '14px';
                    sccsd.onclick = function() {
                        this.previousSibling.lastChild.value = 0;
                        this.previousSibling.lastChild.onchange();
                    };
                    sccs.appendChild(sccsd);
                    if (colorStops.length == 2) {
                        sccss.firstChild.appendChild(sccsd.cloneNode());
                    }
                }
            }
        } else {
            scdef.style.display = 'block';
            scadd.style.display = scskin.style.display = 'none';
        }
    };

    var sclink = document.createElement('div');
    sclink.className = 'donuts-link';
    sclink.textContent = 'Create your skin';
    sclink.onclick = function() {
        Constructor();
        if (sc) snake.rcv <= max_skin_cv ? skins.length ? setSkin(snake, max_skin_cv + 1) : newSkin() : workspace();
    };
    div.appendChild(sclink);

    var scdiv = document.createElement('div');
    scdiv.style.width = '100%';
    scdiv.style.height = '250px';
    scdiv.style.padding = '20px 7% 15px 7%';
    scdiv.style.boxSizing = 'border-box';
    scdiv.style.position = 'fixed';
    scdiv.style.bottom = '-250px';
    scdiv.style.left = 0;
    scdiv.style.background = 'white';
    scdiv.style.fontFamily = 'Calibri, Tahoma, Arial, sans-serif';
    scdiv.style.overflow = 'auto';
    scdiv.style.zIndex = 100000000;
    scdiv.style.transition = '0.5s';
    scdiv.onmousedown = function(e) {
        e.stopPropagation();
    };
    body.appendChild(scdiv);

    var scpromo = document.createElement('div');
    scpromo.style.display = 'inline-block';
    scpromo.style.width = '40%';
    scdiv.appendChild(scpromo);
    
    scp = document.createElement('p');
    scp.innerHTML = '<strong style="color:#f44336;font-size:1.15em;">NEW UPDATE:</strong> create even <strong>more customized skins</strong>: now with different faces, antennas and bulbs! Install <a href="http://donut.host-ed.me/slitherio/" class="donuts-blue">Slither.io Donuts</a> extension to use all the features.';
    scp.style.marginTop = '0';
    scpromo.appendChild(scp);

    var scp = document.createElement('p');
    scp.innerHTML = 'This skin constructor feature was developed by Donut. Make sure to <a href="https://www.youtube.com/channel/UCIpCflcKEN9YgaO9qDahpRg?sub_confirmation=1" class="donuts-blue">subscribe</a> to his channel on YouTube. You can also install <a href="http://donut.host-ed.me/slitherio/" class="donuts-blue">Slither.io Donuts</a> extension with some extra features.';
    scp.style.marginTop = '0';
    scpromo.appendChild(scp);

    var subdiv = document.createElement('div'), br = document.createElement('br');
    subdiv.id = 'donuts-subdiv';
    scpromo.appendChild(subdiv);

    var script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.onload = function() {
        this.parentNode.removeChild(this);
        gapi.ytsubscribe.render('donuts-subdiv', {
            channelid: 'UCIpCflcKEN9YgaO9qDahpRg',
            layout: 'full'
        });
    };
    document.head.appendChild(script);

    var scws = document.createElement('div');
    scws.style.display = 'inline-block';
    scws.style.width = '55%';
    scws.style.height = '100%';
    scws.style.float = 'right';
    scws.style.position = 'relative';
    scdiv.appendChild(scws);

    var scdef = document.createElement('div');
    scdef.style.display = 'none';
    scdef.style.width = '100%';
    scdef.style.position = 'absolute';
    scdef.style.top = '50%';
    scdef.style.transform = 'translate(0, -50%)';
    scdef.style.textAlign = 'center';
    scdef.style.opacity = 0.75;
    scws.appendChild(scdef);

    var scsorry = document.createElement('div');
    scsorry.textContent = "Sorry, you can't change default skins.";
    scdef.appendChild(scsorry);

    var scnew = document.createElement('div');
    scnew.textContent = 'Create new';
    scnew.className = 'donuts-blue';
    scnew.style.fontWeight = 'bold';
    scnew.onclick = newSkin;
    scdef.appendChild(scnew);

    var sccss = document.createElement('div');
    scws.appendChild(sccss);

    var scadd = document.createElement('div');
    scadd.innerHTML = '<span class="donuts-blue">Add color stop</span>';
    scadd.style.display = 'none';
    scadd.firstChild.onclick = function() {
        var prevColor = +sccss.lastChild.firstChild.childNodes[1].dataset.color, push;
        if (sccss.firstChild.childNodes[1].lastChild.disabled) {
            snake.rbcs = [];
            for (var i = 0; i < 7; i++)
                snake.rbcs.push(prevColor);
        }
        do {
            push = Math.floor(Math.random() * rrs.length);
        } while (push == prevColor);
        for (var i = 0; i < 7; i++)
            snake.rbcs.push(push);
        updateSkin();
        workspace();
    };
    scws.appendChild(scadd);

    var scskin = document.createElement('div');
    scskin.style.display = 'none';
    scskin.style.marginTop = '7px';
    scws.appendChild(scskin);

    var sccreate = document.createElement('span');
    sccreate.textContent = 'Create new skin';
    sccreate.className = 'donuts-blue';
    sccreate.onclick = newSkin;
    scskin.appendChild(sccreate);

    bullet = document.createElement('span');
    bullet.textContent = '•';
    bullet.style.display = 'inline-block';
    bullet.style.margin = '0 5px';
    bullet.style.fontSize = '12px';
    scskin.appendChild(bullet);

    var scdelete = document.createElement('span');
    scdelete.textContent = 'Delete this skin';
    scdelete.className = 'donuts-blue';
    scdelete.onclick = function() {
        skins.splice(snake.rcv - max_skin_cv - 1, 1);
        var storageSkins = JSON.parse(localStorage.getItem('donuts-skins'));
        storageSkins.splice(snake.rcv - max_skin_cv - 1, 1);
        localStorage.setItem('donuts-skins', JSON.stringify(storageSkins));
        setSkin(snake, snake.rcv - 1);
    };
    scskin.appendChild(scdelete);

    var sccm = document.createElement('div'), colors;
    sccm.style.position = 'absolute';
    sccm.style.top = '25px';
    sccm.style.left = '43px';
    sccm.style.padding = '3px 7px';
    sccm.style.width = '192px';
    sccm.style.border = '1px solid #A9A9A9';
    sccm.style.background = 'white';
    sccm.style.zIndex = 100000001;
    sccm.onclick = function(e) {
        e.stopPropagation();
    };

    var scdefc = document.createElement('div');
    scdefc.textContent = 'Default colors:';
    var sccc = document.createElement('div');
    sccc.textContent = 'Custom colors:';

    var sccset = document.createElement('div');
    sccset.innerHTML = '<span class="donuts-blue">Color settings</span>';
    sccset.firstChild.className = 'donuts-blue';
    sccset.firstChild.onclick = function() {
        ccblackout.style.visibility = 'visible';
        ccblackout.style.opacity = 1;
        sccm.parentNode.removeChild(sccm);
    };

    function colorMenu() {
        colors = [], sccm.innerHTML = '';
        sccm.appendChild(scdefc);
        for (var i = 0; i < rrs.length; i++) {
            if (i == ncolors)
                sccm.appendChild(sccc);
            var scc = document.createElement('div');
            scc.dataset.color = i;
            scc.style.display = 'inline-block';
            scc.style.margin = '2px';
            scc.style.width = '18px';
            scc.style.height = '18px';
            scc.style.border = '1px solid rgba(0,0,0,0.75)';
            scc.style.backgroundColor = 'rgb('+rrs[i]+','+ggs[i]+','+bbs[i]+')';
            if (i == 10) scc.style.backgroundImage = ' url("http://i.imgur.com/kk1pXVE.png")';
            if (i == 19) scc.style.backgroundImage = ' url("http://i.imgur.com/DfUUkyT.png")';
            if (i == 20) scc.style.backgroundImage = ' url("http://i.imgur.com/i57h7xx.png")';
            if (i == 24) scc.style.boxShadow = 'inset 0 0 8px #CCCC00';
            if (i == 26) scc.style.boxShadow = 'inset 0 0 8px #FFFFE6';
            if (i == 27) scc.style.boxShadow = 'inset 0 0 8px #FFCCCC';
            scc.style.cursor = 'pointer';
            scc.onclick = function() {
                for (var j = 0; j < sccm.parentNode.nextSibling.lastChild.value; j++)
                    snake.rbcs[+sccm.parentNode.parentNode.dataset.position + j] = +this.dataset.color;
                updateSkin();
                workspace();
            };
            sccm.appendChild(scc);
            colors.push(scc);
        }
        sccm.appendChild(sccset);
    }

    // </Skin Constructor>

    var scolors = [[179,74,0],[153,255,0],[255,25,0],[0,213,255],[42,232,136]];

    for (var i = 0; i < scolors.length; i++) {
        rrs.push(scolors[i][0]);
        ggs.push(scolors[i][1]);
        bbs.push(scolors[i][2]);
        applyColor(ncolors++);
    }

    setColors();
    colorMenu();
    var skins = JSON.parse(localStorage.getItem('donuts-skins')) || [];
    if (!(skins instanceof Array)) skins = [];
    if (skins.length > 0 && skins[0] instanceof Array) {
        for (var i = 0; i < skins.length; i++)
            skins[i] = {skin:{rbcs:skins[i]}};
        localStorage.setItem('donuts-skins', JSON.stringify(skins));
    }
    var storageSkins = JSON.parse(JSON.stringify(skins));
    for (var i = 0; i < skins.length; i++)
        for (var j = 0; j < skins[i].skin.rbcs.length; j++) {
            if (skins[i].skin.rbcs[j] >= ncolors) storageSkins[i].skin.rbcs[j] = skins[i].skin.rbcs[j] = ((skins[i].skin.rbcs[j] - ncolors + 1) > ccolors.length ? ncolors - 1 : ~skins[i].skin.rbcs[j] + ncolors), localStorage.setItem('donuts-skins', JSON.stringify(storageSkins));
            if (-skins[i].skin.rbcs[j] > ccolors.length) storageSkins[i].skin.rbcs[j] = skins[i].skin.rbcs[j] = -ccolors.length, localStorage.setItem('donuts-skins', JSON.stringify(storageSkins));
            if (skins[i].skin.rbcs[j] < 0) skins[i].skin.rbcs[j] = ~skins[i].skin.rbcs[j] + ncolors;
        }


    cskh.onclick = function() {
        div.style.display = 'block';
        setTimeout(function() {
            div.style.opacity = 1;
        }, 0);
        if (localStorage.getItem('snakercv') > max_skin_cv + skins.length) setSkin(snake, max_skin_cv + skins.length), localStorage.setItem('snakercv', max_skin_cv + skins.length);
    };

    skodiv.lastChild.onclick = function() {
        div.style.opacity = 0;
        setTimeout(function() {
            div.style.display = 'none';
        }, 1000);
        Constructor(true);
    };
    
    psk.onclick = function() {
        if (playing && snake) {
            var c = snake.rcv;
            c--;
            0 > c && (c = max_skin_cv + skins.length);
            setSkin(snake, c);
        }
        return !1;
    };
    nsk.onclick = function() {
        if (playing && snake) {
            var c = snake.rcv;
            c++;
            c > max_skin_cv + skins.length && (c = 0);
            setSkin(snake, c);
        }
        return !1;
    };

    var onkeyup = document.onkeyup;
    document.onkeyup = function(e) {
        onkeyup();
        switch (e.which) {
            case 27: 
                Constructor(true);
                break;
        }
    };

    body.onclick = function() {
        if (sccm.parentNode) sccm.parentNode.removeChild(sccm);
    };
    body.onmousemove = function(e) {
        if (currentColor) {
            e.preventDefault();
            var x = Math.min(255, e.pageX - currentColor.parentNode.parentNode.offsetLeft - currentColor.offsetLeft);
            if (x < 0) x = 0;
            var rgb = parseColor(currentColor.parentNode.parentNode.firstChild.style.backgroundColor);
            for (var i = 0; i < currentColor.parentNode.childNodes.length; i++)
                if (currentColor.parentNode.childNodes[i] === currentColor) rgb[i] = x;
            setColor(rgb, currentColor.parentNode.parentNode);
        }
    };
    body.onmouseup = function() {
        currentColor = null;
    };

    var oldResize = resize;
    resize = function() {
        oldResize();
        skodiv.style.top = Math.round(hh / 2 + (sc ? -130 : 120)) + "px";
        pskh.style.top = Math.round(hh / 2 - (sc ? 294 : 44)) + "px";
        nskh.style.top = Math.round(hh / 2 - (sc ? 294 : 44)) + "px";
        mc.style.top = Math.floor(hh / 2 - mhh / 2) - (sc ? 250 : 0) + "px";
        stylesheet.insertRule('.donuts-window{max-height:' + (hh-50) + 'px;' + '}', stylesheet.cssRules.length);
    };

    var oldRedraw = redraw, crash = false;
    redraw = function() {
        if (!crash)
            try {
                oldRedraw();
            } catch(err) {
                crash = true;
                var crashblackout = createWindow();
                crashblackout.style.visibility = 'visible';
                crashblackout.style.opacity = 1;
                body.appendChild(crashblackout);

                var crashdiv = crashblackout.firstChild;
                crashdiv.id = 'donuts-crashdiv';
                crashdiv.innerHTML = '<div style="text-align: center;">' + "Something went wrong. Try to reload the page, and if it doesn't help, turn off the script. " + 'Please, <a href="https://www.youtube.com/channel/UCIpCflcKEN9YgaO9qDahpRg/discussion" class="donuts-blue" target="_blank">report the bug</a>, and it will be fixed as soon as possible. Sorry for this problem.</div><h2>How to report a bug</h2><ul style="margin: 0;"><li>Provide as much information about the bug as you can.</li><li>If you can, <a href="http://imgur.com/" class="donuts-blue">upload</a> a screenshot and link it from your bug report.</li><li style="font-weight: bold;">Copy and include this into your report:<input type="text" style="font-family: ' + "'Courier New', Courier, monospace" + '; font-size: 12px; margin-left: 5px; height: 19px;" readonly></li><li>Comments like "I have a bug, fix it!" are not gonna be replied.</li><li>You can also <span class="donuts-blue">delete</span>' + " all your skins and colors if reloading doesn't help but you want to use the extension.</li></ul>";
                crashdiv.style.maxWidth = '500px';

                document.querySelector('#donuts-crashdiv input').value = 'Skins: ' + localStorage['donuts-skins'] + ', colors: ' + localStorage['donuts-colors'] + ', rcv: ' + snake.rcv + ', donuts: ' + window.donutsEnabled;
                document.querySelector('#donuts-crashdiv input').onclick = function() {
                    setTimeout(function(){
                        document.querySelector('#donuts-crashdiv input').select();
                    },0);
                };
                crashdiv.lastChild.lastChild.lastElementChild.onclick = function() {
                    localStorage.removeItem('donuts-colors');
                    localStorage.removeItem('donuts-skins');
                    location.reload();
                };

                var crashbtn = makeTextBtn('Reload page', 36, 16, 18, 2).elem;
                crashbtn.style.position = 'relative';
                crashbtn.style.margin = '7px auto 0 auto';
                crashbtn.style.removeProperty('box-shadow');
                crashbtn.onclick = function() {
                    location.reload();
                };
                crashdiv.appendChild(crashbtn);
            }
    }
}},750);