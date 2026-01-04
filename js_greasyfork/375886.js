// ==UserScript==
// @name         CLAN HARD (PROZIN)
// @namespace    CLAN HARD (PROZIN)
// @version      0.2.0
// @description  Versão de teste - google chrome e Todos maxthom!
// @author       Prozin[SS]
// @match        http://slither.io/*
// @supportURL   https://github.com/j-c-m/Slither.io-bot/issues
// @icon         https://scontent.fgru7-1.fna.fbcdn.net/v/t1.0-9/25994583_620714624947103_8320149006107929096_n.jpg?_nc_cat=101&_nc_ht=scontent.fgru7-1.fna&oh=512a9e8bcd983fd74bdf2bbb06f49ce9&oe=5CD94843
// @grant        none
// TODOS OS DIREITOS AUTORAIS DOS VERDADEIROS DESENVOLVEDORES...
// MONTEI QUATRO SCRIPTS EM UM, USEI OS SCRIPTS DELES:

// @author         SLITio by szymy
// @author         slitio.szymy

// @author         Slither.io Bot Championship Edition
// @author         Jesse Miller

// @author         Slither-io.com
// @author         nome desconhecido

// @author         mod que conta quantos voce matou
// @author         https://github.com/clentner
// @downloadURL https://update.greasyfork.org/scripts/375886/CLAN%20HARD%20%28PROZIN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/375886/CLAN%20HARD%20%28PROZIN%29.meta.js
// ==/UserScript==

// Custom logging function - disabled by default
window.log = function () {
    if (window.logDebugging) {
        console.log.apply(console, arguments);
    }
};
window.ownskins = {};
setInterval(function() {
    if (Object.keys(window.ownskins).length > 0) {
        for (var key in window.ownskins) {
            eval("snake." + key + " = " + eval("window.ownskins." + key));
        }
    }
}, 100);
(function() {
    slitherioenabled = true;
    if (!+localStorage.getItem('edttsg')) {
        localStorage.setItem('edttsg', 1);
        cskh.style.display = "inline";
        cstx.style.display = "none";
    }
    if (isNaN(+localStorage['snakercv'])) localStorage.setItem('snakercv', 0);
    if (!localStorage.getItem('slitherioskin-skins')) localStorage.setItem('slitherioskin-skins', '[]');
    var body = document.body,
        switches = {};

    function createWindow() {
        var blackout = document.createElement('div');
        blackout.className = 'slitherioskin-blackout';
        body.appendChild(blackout);
        var wind = document.createElement('div');
        wind.className = 'slitherioskin-window';
        wind.onmousedown = function(e) {
            e.stopPropagation();
        };
        blackout.appendChild(wind);
        return blackout;
    }

    function createSwitch(parent, opt, text, func, initial = false) {
        var id = 'slitherioskin-' + opt;
        if (!localStorage.getItem(id)) localStorage.setItem(id, initial);
        switches[opt] = localStorage.getItem(id) == 'true';
        var div = document.createElement('div');
        div.className = 'slitherioskin-checkbox-div';
        parent.appendChild(div);
        var checkbox = document.createElement('div');
        checkbox.className = 'slitherioskin-checkbox';
        div.appendChild(checkbox);
        var input = document.createElement('input'),
            o = {
                div: div,
                input: input
            };
        input.type = 'checkbox';
        input.id = id;
        if (switches[opt]) input.checked = true, func && func(o);
        input.onchange = function() {
            switches[opt] = this.checked;
            localStorage.setItem(id, switches[opt]);
            func && func(o);
        };
        checkbox.appendChild(input);
        var label = document.createElement('label');
        label.htmlFor = id;
        checkbox.appendChild(label);
        var textLabel = document.createElement('label');
        textLabel.htmlFor = id;
        textLabel.textContent = text;
        div.appendChild(textLabel);
        return input;
    }
    var styles = {
        '.slitherioskin-checkbox': {
            display: 'inline-block',
            width: '22px',
            height: '22px',
            position: 'relative',
            'margin-right': '8px',
            'background-color': '#fcfff4',
            background: 'linear-gradient(to bottom, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%)',
            'border-radius': '50px',
            'box-shadow': 'inset 0px 1px 1px white, 0px 1px 3px rgba(0, 0, 0, 0.5)'
        },
        '.slitherioskin-checkbox>input': {
            visibility: 'hidden'
        },
        '.slitherioskin-checkbox>label': {
            width: '14px',
            height: '14px',
            position: 'absolute',
            top: '4px',
            left: '4px',
            cursor: 'pointer',
            background: 'linear-gradient(to bottom, #222222 0%, #45484d 100%)',
            'border-radius': '50px',
            'box-shadow': 'inset 0px 1px 1px rgba(0, 0, 0, 0.5), 0px 1px 0px white'
        },
        '.slitherioskin-checkbox>label::after': {
            content: '""',
            width: '8px',
            height: '5px',
            position: 'absolute',
            top: '2px',
            left: '2px',
            border: '2px solid #fcfff4',
            'border-top': 'none',
            'border-right': 'none',
            background: 'transparent',
            opacity: 0,
            '-webkit-transform': 'rotate(-45deg)',
            transform: 'rotate(-45deg)'
        },
        '.slitherioskin-checkbox-div:hover>.slitherioskin-checkbox>label::after': {
            opacity: 0.3
        },
        '.slitherioskin-checkbox>input:checked + label::after': {
            opacity: '1 !important'
        },
        '#slitcheck': {
            transition: '1s'
        },
        '#slitcheck>div': {
            display: 'inline-block',
            margin: '0 15px'
        },
        '.slitherioskin-link': {
            color: 'white',
            cursor: 'pointer'
        },
        '.slitherioskin-link:hover': {
            'text-shadow': '1px 1px 4px rgba(0,0,0,1)'
        },
        '.slitherioskin-blue': {
            color: '#3366FF',
            'text-decoration': 'none',
            cursor: 'pointer'
        },
        '.slitherioskin-red': {
            color: '#ff0000',
            'text-decoration': 'none',
            cursor: 'pointer'
        },
        '.slitherioskin-blackout': {
            display: 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            visibility: 'hidden',
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'rgba(0,0,0,.5)',
            opacity: 0,
            'z-index': 100000002,
            transition: 'opacity 0.5s'
        },
        '.slitherioskin-window>h2': {
            margin: 0,
            'text-align': 'center'
        }
    };
    var style = document.createElement('style');
    document.head.appendChild(style);
    stylesheet = style.sheet;
    for (var selector in styles)
        for (var property in styles[selector])
            stylesheet.insertRule(selector + '{' + property + ':' + styles[selector][property] + ';' + '}', stylesheet.cssRules.length);
    var div = document.createElement('div');
    div.id = 'slitcheck';
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
    if (!localStorage.getItem('slitherioskin-cstime')) localStorage.setItem('slitherioskin-cstime', 1000);
    var nextSkin = +localStorage.getItem('snakercv'),
        cstime = +localStorage.getItem('slitherioskin-cstime');

    function changeSkins() {
        if (switches.changeskins && snake && !sc) {
            nextSkin++;
            var Skins = skins,
                maxSkin = max_skin_cv;
            if (switches.csd) Skins = [];
            if (nextSkin > maxSkin + Skins.length) nextSkin = 0;
            if (switches.csc && Skins.length && nextSkin <= maxSkin) nextSkin = maxSkin + 1;
            setSkin(snake, nextSkin);
            localStorage.setItem('snakercv', nextSkin);
        }
        if (switches.changeskins) setTimeout(changeSkins, cstime);
    }
    var setblackout = createWindow();
    var setdiv = setblackout.firstChild;
    var setcs1 = document.createElement('div'),
        setcs2 = document.createElement('div');;
    setcs1.style.display = setcs2.style.display = 'inline-block';
    setcs1.style.width = setcs2.style.width = '50%';
    setdiv.appendChild(setcs1);
    setdiv.appendChild(setcs2);
    var setcstime = document.createElement('label');
    setcstime.innerHTML = '<span title="' + "Excellent for Slither.io YouTubers.\nIncrease the value so that skins don't cnage too fast in your video.\nThe unit is milliseconds." + '" style="cursor:help;">Interval:</span>&nbsp;<input type="number" value="' + cstime + '" style="width:60px;">';
    setcstime.lastChild.onchange = function() {
        cstime = +this.value;
        localStorage.setItem('slitherioskin-cstime', cstime);
    };
    setcs1.appendChild(setcstime);

    function csonly(o) {
        if (o.input.checked) {
            var sib = o.div.previousSibling || o.div.nextSibling;
            if (sib) {
                var input = sib.firstChild.firstChild;
                if (input && input.checked) input.checked = false, input.onchange();
            }
        }
    }
    var setcsd = createSwitch(setcs2, 'csd', 'Only default', csonly);
    var setcsc = createSwitch(setcs2, 'csc', 'Only custom', csonly);
    setcsc.parentNode.parentNode.style.marginTop = '2px';
    var setok = makeTextBtn('OK', 36, 16, 18, 1).elem;
    setok.style.position = 'relative';
    setok.style.margin = '10px auto 0px auto';
    setok.style.removeProperty('box-shadow');
    setok.onclick = function() {
        setblackout.style.opacity = 0;
        setTimeout(function() {
            setblackout.style.visibility = 'hidden';
        }, 500);
    };
    setdiv.appendChild(setok);

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
        for (p = yy = xx = 0; p < l; p += 4) v = Math.abs(Math.sqrt(Math.pow(sz / 2 - xx, 2) + Math.pow(sz / 2 - yy, 2)) - 16), v = 15 >= v ? 1 - v / 15 : 0, imgd[p] = rrs[i], imgd[p + 1] = ggs[i], imgd[p + 2] = bbs[i], imgd[p + 3] = Math.floor(255 * v), xx++, xx >= sz && (xx = 0, yy++);
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
        for (j = 0; 7 > j; j++) {
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
        o.ic = o.imgs.length;
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
                    rrs.splice(ncolors + i, 1);
                    ggs.splice(ncolors + i, 1);
                    bbs.splice(ncolors + i, 1);
                    cccs.removeChild(cccs.childNodes[i]);
                    for (var j = i + 1; j < cccs.childNodes.length; j++)
                        cccs.childNodes[j].dataset.n = cccs.childNodes[j].dataset.n - 1;
                    for (var j = 0; j < skins.length; j++)
                        for (var k = 0; k < skins[j].skin.rbcs.length; k++)
                            if (skins[j].skin.rbcs[k] >= ncolors + i) skins[j].skin.rbcs[k] --;
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
        localStorage.setItem('slitherioskin-colors', JSON.stringify(ccolors));
    }
    var currentColor = null,
        ccrestore = document.createElement('div');
    ccrestore.innerHTML = 'You just deleted this color. <span class="slitherioskin-blue">Restore</span>';
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
        ccdelete.innerHTML = '<span class="slitherioskin-blue">Delete</span>';
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
        if (m) {
            return [+m[1], +m[2], +m[3]];
        }
    }

    function setColor(rgb, el) {
        var n = el.dataset.n;
        rrs[n] = rgb[0];
        ggs[n] = rgb[1];
        bbs[n] = rgb[2];
        for (var i = 0; i < 3; i++) {
            el.firstChild.style.backgroundColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
            var rgb0 = rgb.slice(),
                rgb1 = rgb.slice();
            rgb0[i] = 0, rgb1[i] = 255;
            var ctx = el.childNodes[2].children[i].getContext('2d');
            var grad = ctx.createLinearGradient(0, 0, 256, 0);
            grad.addColorStop(0, 'rgb(' + rgb0[0] + ',' + rgb0[1] + ',' + rgb0[2] + ')');
            grad.addColorStop(1, 'rgb(' + rgb1[0] + ',' + rgb1[1] + ',' + rgb1[2] + ')');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 256, 10);
            ctx.beginPath();
            ctx.arc(rgb[i], 5, 3, 0, 2 * Math.PI);
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
    var ccolors = JSON.parse(localStorage.getItem('slitherioskin-colors')) || [],
        ncolors = rrs.length,
        ccblackout = createWindow(),
        ccdiv = ccblackout.firstChild;
    var ccheader = document.createElement('h2');
    ccheader.textContent = 'Custom colors';
    ccdiv.appendChild(ccheader);
    var cccs = document.createElement('div');
    ccdiv.appendChild(cccs);
    var ccnew = document.createElement('div');
    ccnew.innerHTML = '<span class="slitherioskin-blue">Crie uma cor</span>';
    ccnew.style.textAlign = 'center';
    ccnew.style.fontSize = '20px';
    ccnew.firstChild.onclick = function() {
        newColor([255, 255, 255]);
    };
    ccdiv.appendChild(ccnew);
    var ccbtns = document.createElement('div');
    ccbtns.style.margin = '10px 0 6px 0';
    ccbtns.style.textAlign = 'center';
    ccdiv.appendChild(ccbtns);
    var ccsave = makeTextBtn('Salve a cor', 0, 0, 0).elem;
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
    var cccancel = makeTextBtn('Cancele a cor', 0, 0, 0).elem;
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
    var pixel = document.createElement('canvas');
    pixel.width = pixel.height = 1;
    var xvarmi = false,
        yvarmi = false,
        hvarmi = false,
        wvarmi = false,
        avarmi = false,
        svarmi = false,
        dvarmi = false,
        r1varmi = false,
        r2varmi = false,
        r3varmi = false,
        r4varmi = false;
    var ss = setSkin;
    setSkin = function(b, h) {
        if (!snake) h = localStorage.getItem('snakercv');
        ss(b, h);
        if (h > max_skin_cv) {
            setTimeout(function() {
                var s = skins[h - max_skin_cv - 1],
                    skin = s.skin;
                snake.antenna = window.ownskins["antenna"];
                snake.eca = 1;
                var c = window.ownskins["valuem"];
                snake.atx = new Float32Array(c);
                snake.aty = new Float32Array(c);
                snake.atvx = new Float32Array(c);
                snake.atvy = new Float32Array(c);
                snake.atax = new Float32Array(c);
                snake.atay = new Float32Array(c);
                for (--c; 0 <= c; c--) snake.atx[c] = snake.xx, snake.aty[c] = snake.yy;
                snake.bulb = window.anten_canvas;
                if (xvarmi == false) {
                    snake.blbx = 0;
                } else {
                    snake.blbx = window.ownskins["blbx"];
                }
                if (yvarmi == false) {
                    snake.blby = -25;
                } else {
                    snake.blby = window.ownskins["blby"];
                }
                if (hvarmi == false) {
                    snake.blbh = 50;
                } else {
                    snake.blbh = window.ownskins["blbh"];
                }
                if (wvarmi == false) {
                    snake.blbw = 50;
                } else {
                    snake.blbw = window.ownskins["blbw"];
                }
                if (avarmi == false && !snake.slg) {
                    snake.er = 6;
                } else {
                    snake.er = window.ownskins["er"];
                }
                if (svarmi == false && !snake.slg) {
                    snake.pr = 3;
                } else {
                    snake.pr = window.ownskins["pr"];
                }
                if (dvarmi == false) {
                    snake.swell = 0;
                } else {
                    snake.swell = window.ownskins["swell"];
                }
                if (r1varmi == false) {
                    snake.ppc = '#000';
                } else {
                    snake.ppc = window.ownskins["ppc"];
                }
                if (r2varmi == false) {
                    snake.ec = '#fff';
                } else {
                    snake.ec = window.ownskins["ec"];
                }
                if (r3varmi == false) {
                    snake.atc1 = '#000';
                } else {
                    snake.atc1 = window.ownskins["atc1"];
                }
                if (r4varmi == false) {
                    snake.atc2 = '#fff';
                } else {
                    snake.atc2 = window.ownskins["atc2"];
                }
                snake.bsc = 1;
                snake.blba = 1;
                snake.atba = 0;
                snake.atwg = !0;
                snake.atia = .5;
                snake.abrot = !0;
                if (skin.one_eye) b.ebi = jsebi, b.ebiw = 64, b.ebih = 64, b.ebisz = 29, b.epi = jsepi, b.epiw = 48, b.epih = 48, b.episz = 14, b.pma = 4, b.swell = .06;
                else if (skin.slg) b.ed = 34, b.esp = 14, b.eca = 1, b.eo = 3, b.er = 8, b.easp = .038, b.pr = 4.5, b.pma = 3;
                else if (skin.jyt) b.eac = true;
                for (prop in skin) b[prop] = skin[prop];
                if (skin.one_eye) b.slg = false, b.jyt = false;
            }, 0);
        }
        if (sc) setTimeout(workspace, 0);
    };

    function newSkin() {
        skins.push({
            skin: {
                rbcs: [9]
            }
        });
        var storageSkins = JSON.parse(localStorage.getItem('slitherioskin-skins'));
        storageSkins.push({
            skin: {
                rbcs: [9]
            }
        });
        localStorage.setItem('slitherioskin-skins', JSON.stringify(storageSkins));
        setSkin(snake, max_skin_cv + skins.length);
    }

    function updateSkin() {
        var toSave = JSON.parse(localStorage.getItem('slitherioskin-skins')),
            singleColor = true;
        toSave[snake.rcv - max_skin_cv - 1].skin.rbcs = JSON.parse(JSON.stringify(snake.rbcs));
        for (var i = 0; i < snake.rbcs.length; i++) {
            if (snake.rbcs[i] >= ncolors) toSave[snake.rcv - max_skin_cv - 1].skin.rbcs[i] = ~snake.rbcs[i] + ncolors;
            if (singleColor && i > 0 && snake.rbcs[i] != snake.rbcs[i - 1]) singleColor = false;
        }
        if (singleColor) snake.rbcs = [snake.rbcs[0]], toSave[snake.rcv - max_skin_cv - 1].skin.rbcs = [toSave[snake.rcv - max_skin_cv - 1].skin.rbcs[0]];
        skins[snake.rcv - max_skin_cv - 1].skin.rbcs = snake.rbcs;
        localStorage.setItem('slitherioskin-skins', JSON.stringify(toSave));
    }

    function saveSkins() {
        var toSave = JSON.parse(JSON.stringify(skins));
        for (var i = 0; i < toSave.length; i++)
            for (var j = 0; j < toSave[i].length; j++)
                if (toSave[i].skin.rbcs[j] >= ncolors) toSave[i].skin.rbcs[j] = ~toSave[i].skin.rbcs[j] + ncolors;
        localStorage.setItem('slitherioskin-skins', JSON.stringify(toSave));
    }
    var sc = false;

    function sfc(el, bottom = false) {
        var prop = bottom ? 'bottom' : 'top';
        el.style.transition = '0.5s';
        el.style[prop] = parseInt(el.style[prop]) + (sc != bottom ? 270 : -270) + 'px';
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
            scadd.style.display = scskin.style.display = scprops.style.display = 'block';
            var colorStops = [0];
            for (var i = 1; i < snake.rbcs.length; i++) {
                if (snake.rbcs[i - 1] != snake.rbcs[i]) break;
                if (i == snake.rbcs.length - 1) snake.rbcs = [snake.rbcs[0]];
            }
            for (var i = 1; i < snake.rbcs.length; i++)
                if (snake.rbcs[i] != snake.rbcs[i - 1]) colorStops.push(i);
            for (var i = 0; i < colorStops.length; i++) {
                var sccs = document.createElement('div');
                sccs.dataset.position = colorStops[i];
                sccs.style.marginBottom = '1px';
                sccss.appendChild(sccs);
                var sccolor = document.createElement('div');
                sccolor.textContent = 'Cor aplicada:';
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
                sccells.textContent = 'Número de cores:';
                sccells.style.display = 'inline-block';
                sccells.style.marginRight = '13px';
                sccs.appendChild(sccells);
                var sccn = document.createElement('input');
                sccn.type = 'number';
                sccn.min = 1;
                sccn.value = (colorStops.length - 1 == i ? snake.rbcs.length : colorStops[i + 1]) - colorStops[i];
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
                        this.value = prevValue;
                        return;
                    }
                    var args = [+sccs.dataset.position, 0];
                    if (this.value > prevValue)
                        for (var i = 0; i < this.value - prevValue; i++)
                            args.push(snake.rbcs[args[0]]);
                    else args[1] = prevValue - this.value;
                    Array.prototype.splice.apply(snake.rbcs, args);
                    updateSkin();
                    if (this.value == 0) workspace();
                    else
                        while (sccs = sccs.nextSibling)
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
            for (var i = 0; i < scprops.childNodes.length; i++)
                scprops.childNodes[i].firstChild.checked = snake[scprops.childNodes[i].dataset.prop] || skins[snake.rcv - max_skin_cv - 1][scprops.childNodes[i].dataset.prop];
        } else {
            scdef.style.display = 'block';
            scadd.style.display = scskin.style.display = scprops.style.display = 'none';
        }
    };
    var sclink = document.createElement('div');
    sclink.className = 'btn btn-primary';
    sclink.style.marginTop = 'aqua';
    sclink.style.color = "#ffcf87";
    sclink.style.boxShadow = 'rgb(0, 0, 0) 0px 1px 20px';
    sclink.style.fontSize = '16px';
    sclink.innerHTML = '⚡️Crie Sua Skin Clicando Aqui!⚡️';
    sclink.onclick = function() {
        Constructor();
        if (sc) snake.rcv <= max_skin_cv ? skins.length ? setSkin(snake, max_skin_cv + 1) : newSkin() : workspace();
    };
    div.appendChild(sclink);
    var scdiv = document.createElement('div');
    scdiv.style.width = '100%';
    scdiv.style.height = '270px';
    scdiv.style.padding = '10px 0px 0px 15px';
    scdiv.style.boxSizing = 'border-box';
    scdiv.style.position = 'fixed';
    scdiv.style.bottom = '-270px';
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
    var schelp = document.createElement('div');
    schelp.style.display = 'inline-block';
    schelp.style.width = '30%';
    schelp.style.float = 'left';
    scdiv.appendChild(schelp);
    var scheader = document.createElement('h2');
    scheader.innerHTML = '<span style="color:black"> Y O U T U B E S :</span><br/><span style="color:red"><a href="https://www.youtube.com/channel/UCwYZWDd2ys2hutgOzaUpXhA?view_as=subscriber" target="_blank"><font color="green">👊(1°|Canal) Clã Hard Oficial👊';
    scheader.style.margin = 0;
    schelp.appendChild(scheader);
    var scheader = document.createElement('h2');
    scheader.innerHTML = '<a href="https://www.youtube.com/channel/UC1anSjtWRhlf8V-XBXSGXzQ?view_as=subscriber" target="_blank"><font color="blue">👊(2°|Canal) Clã Hard Oficial👊';
    scheader.style.margin = 0;
    schelp.appendChild(scheader);
    scp3 = document.createElement('h4');
    scp3.innerHTML = '<span style="color:black"> M O D S :</span><br/><span style="color:red"><a href="https://greasyfork.org/pt-BR/scripts/39873-clan-hard" target="_blank"><font color="orange">👊(1°|Mod) Clã Hard👊</font></a>';
    scp3.style.marginBottom = 0;
    schelp.appendChild(scp3);
    scp3 = document.createElement('h4');
    scp3.innerHTML = '<a href="https://greasyfork.org/pt-BR/scripts/40664-clan-hard" target="_blank"><font color="rose">👊(2°|Mod) Clã Hard👊</font></a>';
    scp3.style.marginBottom = 0;
    schelp.appendChild(scp3);
    var scws = document.createElement('div');
    scws.style.display = 'inline-block';
    scws.style.width = '27%';
    scws.style.height = '100%';
    scws.style.position = 'relative';
    scws.style.float = 'left';
    scdiv.appendChild(scws);
    var _scws = document.createElement('div');
    _scws.style.display = 'inline-block';
    _scws.style.width = '43%';
    _scws.style.height = '100%';
    _scws.style.position = 'relative';
    _scws.style.float = 'left';
    scdiv.appendChild(_scws);
    var _sccss = document.createElement('div');
    _scws.appendChild(_sccss);
    var _sccs = document.createElement('div');
    _sccs.style.marginBottom = '1px';
    _sccss.appendChild(_sccs);
    var sclink = document.createElement('div');
    sclink.innerHTML = "<center><b style='color:#ff0000'>X</b></center>";
    sclink.style.width = '20px';
    sclink.style.height = '20px';
    sclink.style.border = '1px solid #ff0000';
    sclink.style.position = 'absolute';
    sclink.style.right = '5px';
    sclink.style.top = '0';
    sclink.style.cursor = 'pointer';
    sclink.onclick = function() {
        Constructor();
    };
    _sccs.appendChild(sclink);
    var _sccimage = document.createElement('div');
    _sccimage.innerHTML = '<span title="' + "You can only use 1 image for all created skins and if you refresh your browser image will go.\nBecause our mod get images from your computer and we can't controll your computer. Thanks for your understanding." + '" style="cursor:help;">Image <font color="red">(?)</font>:</span>';
    _sccimage.style.position = 'relative';
    _sccimage.style.display = 'inline-block';
    _sccs.appendChild(_sccimage);
    var _sccn = document.createElement('input');
    _sccn.type = 'file';
    _sccn.accept = '.jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|images/*';
    _sccn.style.marginLeft = '10px';
    _sccn.style.height = '20px';
    _sccn.style.border = '1px solid #A9A9A9';
    _sccn.style.fontSize = '9px';
    _sccn.style.verticalAlign = 'middle';
    _sccn.style.display = 'inline-block';
    var angleInDegrees = 0;
    var anten_resim = document.createElement("img");
    window.anten_canvas = document.createElement("canvas");
    _sccn.onchange = function() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                anten_resim.onload = function() {
                    var cw = anten_resim.width,
                        ch = anten_resim.height;
                    window.anten_canvas.setAttribute('width', cw);
                    window.anten_canvas.setAttribute('height', ch);
                    ctx = window.anten_canvas.getContext("2d");
                    ctx.rotate(0 * Math.PI / 180);
                    ctx.drawImage(anten_resim, 0, 0);
                    ctx.restore();
                    window.ownskins["bulb"] = window.anten_canvas;
                };
                anten_resim.src = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);
            if (document.getElementById('mycheckbox').checked == false) {
                document.getElementById('mycheckbox').click();
            }
            if (document.getElementById('antennawidth').value == false) {
                document.getElementById('antennawidth').value = 15;
            }
            if (document.getElementById('imageheight').value == false) {
                document.getElementById('imageheight').value = 50;
            }
            if (document.getElementById('imagewidth').value == false) {
                document.getElementById('imagewidth').value = 50;
            }
            if (document.getElementById('xcoor').value == false) {
                document.getElementById('xcoor').value = 0;
            }
            if (document.getElementById('ycoor').value == false) {
                document.getElementById('ycoor').value = -25;
            }
        }
    };
    _sccimage.appendChild(_sccn);
    var skMain = document.createElement('div');
    _scws.appendChild(skMain);
    var skMainDiv = document.createElement('div');
    skMainDiv.style.marginBottom = '2px';
    skMain.appendChild(skMainDiv);
    var skMainWidth = document.createElement('div');
    skMainWidth.innerHTML = '<span title="' + "When you select your image,\nYou can rotate with buttons." + '" style="cursor:help;">Rotate <font color="red">(?)</font>:</span>';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginRight = '13px';
    skMainDiv.appendChild(skMainWidth);
    var sccn = document.createElement('input');
    sccn.type = 'button';
    sccn.value = "Right";
    sccn.min = 1;
    sccn.style.marginLeft = '10px';
    sccn.style.width = '50px';
    sccn.style.height = '20px';
    sccn.style.border = '1px solid #A9A9A9';
    sccn.style.fontSize = '12px';
    sccn.style.verticalAlign = 'middle';
    var rightBtnClick = function() {
        if (anten_resim.src) {
            angleInDegrees += 90;
            var cw = anten_resim.width,
                ch = anten_resim.height,
                cx = 0,
                cy = 0;
            degree = angleInDegrees;
            degree = parseInt(degree.toString().replace("-", ""));
            switch (degree) {
                case 90:
                    cw = anten_resim.height;
                    ch = anten_resim.width;
                    cy = anten_resim.height * (-1);
                    break;
                case 180:
                    cx = anten_resim.width * (-1);
                    cy = anten_resim.height * (-1);
                    break;
                case 270:
                    cw = anten_resim.height;
                    ch = anten_resim.width;
                    cx = anten_resim.width * (-1);
                    angleInDegrees = 0;
                    break;
            }
            window.anten_canvas.setAttribute('width', cw);
            window.anten_canvas.setAttribute('height', ch);
            ctx = window.anten_canvas.getContext("2d");
            ctx.rotate(degree * Math.PI / 180);
            ctx.drawImage(anten_resim, cx, cy);
            window.ownskins["bulb"] = window.anten_canvas;
        }
    };
    sccn.onclick = rightBtnClick;
    skMainWidth.appendChild(sccn);
    var skMainWidth = document.createElement('div');
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainDiv.appendChild(skMainWidth);
    var sccn = document.createElement('input');
    sccn.type = 'button';
    sccn.value = "Left";
    sccn.min = 1;
    sccn.style.marginLeft = '10px';
    sccn.style.width = '50px';
    sccn.style.height = '20px';
    sccn.style.border = '1px solid #A9A9A9';
    sccn.style.fontSize = '12px';
    sccn.style.verticalAlign = 'middle';
    var LeftBtnClick = function() {
        if (anten_resim.src) {
            angleInDegrees -= 90;
            var cw = anten_resim.width,
                ch = anten_resim.height,
                cx = 0,
                cy = 0;
            degree = angleInDegrees;
            degree = parseInt(degree.toString().replace("-", ""));
            switch (degree) {
                case 90:
                    cw = anten_resim.height;
                    ch = anten_resim.width;
                    cy = anten_resim.height * (-1);
                    break;
                case 180:
                    cx = anten_resim.width * (-1);
                    cy = anten_resim.height * (-1);
                    break;
                case 270:
                    cw = anten_resim.height;
                    ch = anten_resim.width;
                    cx = anten_resim.width * (-1);
                    angleInDegrees = 0;
                    break;
            }
            window.anten_canvas.setAttribute('width', cw);
            window.anten_canvas.setAttribute('height', ch);
            ctx = window.anten_canvas.getContext("2d");
            ctx.rotate(degree * Math.PI / 180);
            ctx.drawImage(anten_resim, cx, cy);
            window.ownskins["bulb"] = window.anten_canvas;
        }
    };
    sccn.onclick = LeftBtnClick;
    skMainWidth.appendChild(sccn);
    var skMain = document.createElement('div');
    _scws.appendChild(skMain);
    var skMainDiv = document.createElement('div');
    skMainDiv.style.marginBottom = '2px';
    skMain.appendChild(skMainDiv);
    var skMainWidth = document.createElement('div');
    skMainWidth.innerHTML = '<span title="' + "Your image width. Please do not leave empty." + '" style="cursor:help;">Width <font color="red">(?)</font>:</span>';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginRight = '13px';
    skMainDiv.appendChild(skMainWidth);
    var sccn = document.createElement('input');
    sccn.type = 'number';
    sccn.min = 1;
    sccn.style.marginLeft = '10px';
    sccn.id = "imagewidth";
    sccn.style.width = '50px';
    sccn.style.height = '20px';
    sccn.style.border = '1px solid #A9A9A9';
    sccn.style.fontSize = '12px';
    sccn.style.verticalAlign = 'middle';
    var widthFunct = function() {
        if (parseInt(this.value) > 0)
            wvarmi = true;
        snake.blbw = parseInt(this.value);
        window.ownskins["blbw"] = snake.blbw;
    };
    sccn.onchange = widthFunct;
    sccn.onkeyup = widthFunct;
    sccn.onclick = widthFunct;
    skMainWidth.appendChild(sccn);
    var skMainHeight = document.createElement('div');
    skMainHeight.innerHTML = '<span title="' + "Your image height. Please do not leave empty." + '" style="cursor:help;">Height <font color="red">(?)</font>:</span>';
    skMainHeight.style.position = 'relative';
    skMainHeight.style.display = 'inline-block';
    skMainDiv.appendChild(skMainHeight);
    var __sccn = document.createElement('input');
    __sccn.type = 'number';
    __sccn.min = 1;
    __sccn.id = "imageheight";
    __sccn.style.marginLeft = '10px';
    __sccn.style.width = '50px';
    __sccn.style.height = '20px';
    __sccn.style.border = '1px solid #A9A9A9';
    __sccn.style.fontSize = '12px';
    __sccn.style.verticalAlign = 'middle';
    var heightFunct = function() {
        if (parseInt(this.value) > 0) {
            hvarmi = true;
            snake.blbh = parseInt(this.value);
            window.ownskins["blbh"] = snake.blbh;
        }
    };
    __sccn.onchange = heightFunct;
    __sccn.onkeyup = heightFunct;
    __sccn.onclick = heightFunct;
    skMainHeight.appendChild(__sccn);
    var skMain = document.createElement('div');
    _scws.appendChild(skMain);
    var skMainDiv = document.createElement('div');
    skMainDiv.style.marginBottom = '1px';
    skMain.appendChild(skMainDiv);
    var skMainWidth = document.createElement('div');
    skMainWidth.innerHTML = '<span title="' + "Your image X Coordinate. Please do not leave empty" + '" style="cursor:help;">X <font color="red">(?)</font>:</span>';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginRight = '13px';
    skMainDiv.appendChild(skMainWidth);
    var __sccn = document.createElement('input');
    __sccn.type = 'number';
    __sccn.style.marginLeft = '10px';
    __sccn.style.width = '50px';
    __sccn.style.height = '20px';
    __sccn.style.border = '1px solid #A9A9A9';
    __sccn.style.fontSize = '12px';
    __sccn.id = "xcoor";
    __sccn.style.verticalAlign = 'middle';
    var XFunct = function() {
        xvarmi = true;
        snake.blbx = parseInt(this.value);
        window.ownskins["blbx"] = snake.blbx;
    };
    __sccn.onchange = XFunct;
    __sccn.onkeyup = XFunct;
    __sccn.onclick = XFunct;
    skMainWidth.appendChild(__sccn);
    var skMainHeight = document.createElement('div');
    skMainHeight.innerHTML = '<span title="' + "Your image Y Coordinate. Please do not leave empty" + '" style="cursor:help;">Y <font color="red">(?)</font>:</span>';
    skMainHeight.style.position = 'relative';
    skMainHeight.style.display = 'inline-block';
    skMainDiv.appendChild(skMainHeight);
    var __sccn = document.createElement('input');
    __sccn.type = 'number';
    __sccn.style.marginLeft = '10px';
    __sccn.style.width = '50px';
    __sccn.style.height = '20px';
    __sccn.style.border = '1px solid #A9A9A9';
    __sccn.style.fontSize = '12px';
    __sccn.style.verticalAlign = 'middle';
    __sccn.id = "ycoor";
    var YFunct = function() {
        yvarmi = true;
        snake.blby = parseInt(this.value);
        window.ownskins["blby"] = snake.blby;
    };
    __sccn.onchange = YFunct;
    __sccn.onkeyup = YFunct;
    __sccn.onclick = YFunct;
    skMainHeight.appendChild(__sccn);
    var skMainDiv = document.createElement('div');
    skMainDiv.style.marginBottom = '2px';
    skMain.appendChild(skMainDiv);
    var skMainWidth = document.createElement('div');
    skMainWidth.innerHTML = '<span title="' + "Your Antenna Width.\nIt is limited to between 2 and 500\nBecause 500 up is lag, 2 down is not work." + '" style="cursor:help;">Antenna Width <font color="red">(?)</font>:</span>';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginRight = '13px';
    skMainDiv.appendChild(skMainWidth);
    var sccn = document.createElement('input');
    sccn.type = 'number';
    sccn.min = 2;
    sccn.max = 500;
    sccn.id = "antennawidth";
    sccn.style.marginLeft = '10px';
    sccn.style.width = '50px';
    sccn.style.height = '20px';
    sccn.style.border = '1px solid #A9A9A9';
    sccn.style.fontSize = '12px';
    sccn.style.verticalAlign = 'middle';
    var awidthFunct = function() {
        if (parseInt(this.value) >= 2 && parseInt(this.value) <= 500) {
            c = parseInt(this.value);
            snake.atx = new Float32Array(c);
            snake.aty = new Float32Array(c);
            snake.atvx = new Float32Array(c);
            snake.atvy = new Float32Array(c);
            snake.atax = new Float32Array(c);
            snake.atay = new Float32Array(c);
            for (--c; 0 <= c; c--) snake.atx[c] = snake.xx, snake.aty[c] = snake.yy;
            window.ownskins["valuem"] = parseInt(this.value);
        }
        if (document.getElementById('mycheckbox').checked == false) {
            document.getElementById('mycheckbox').click();
        }
    };
    sccn.onchange = awidthFunct;
    sccn.onkeyup = awidthFunct;
    sccn.onclick = awidthFunct;
    skMainWidth.appendChild(sccn);
    var skMainWidth = document.createElement('div');
    skMainWidth.innerHTML = '<span title="' + "Antenna is your head image carrier." + '" style="cursor:help;">A <font color="red">(?)</font>:</span>';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginLeft = '8px';
    skMainDiv.appendChild(skMainWidth);
    var ____sccn3 = document.createElement('input');
    ____sccn3.type = 'checkbox';
    ____sccn3.id = 'mycheckbox';
    ____sccn3.style.marginRight = '30px';
    ____sccn3.style.width = '50px';
    ____sccn3.style.height = '20px';
    ____sccn3.style.border = '1px solid #A9A9A9';
    ____sccn3.style.fontSize = '12px';
    ____sccn3.style.verticalAlign = 'middle';
    var antennaaktif = function() {
        if (this.checked) {
            if (document.getElementById('antennawidth').value == false) {
                document.getElementById('antennawidth').value = 15;
            }
            snake.antenna = true;
            var c = 15;
            snake.atx = new Float32Array(c);
            snake.aty = new Float32Array(c);
            snake.atvx = new Float32Array(c);
            snake.atvy = new Float32Array(c);
            snake.atax = new Float32Array(c);
            snake.atay = new Float32Array(c);
        } else {
            snake.antenna = false;
        }
        window.ownskins["antenna"] = snake.antenna;
        window.ownskins["valuem"] = c;
    };
    ____sccn3.onclick = antennaaktif;
    skMainDiv.appendChild(____sccn3);
    var skMainDiv = document.createElement('div');
    skMainDiv.style.marginBottom = '2px';
    skMain.appendChild(skMainDiv);
    var skMainWidth = document.createElement('div');
    skMainWidth.innerHTML = '<span title="' + "Your Eye Size.\nIt is limited to between 1 and 15\nBecause 15 up is too big, 1 down is not work.\nAlso you can't use on Slogoman Eyes" + '" style="cursor:help;">Eye Size <font color="red">(?)</font>:</span>';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginRight = '13px';
    skMainDiv.appendChild(skMainWidth);
    var sccn__ = document.createElement('input');
    sccn__.type = 'number';
    sccn__.min = 1;
    sccn__.max = 15;
    sccn__.value = 3;
    sccn__.style.marginLeft = '10px';
    sccn__.style.width = '50px';
    sccn__.style.height = '20px';
    sccn__.style.border = '1px solid #A9A9A9';
    sccn__.style.fontSize = '12px';
    sccn__.style.verticalAlign = 'middle';
    var prdeisitir = function() {
        if (parseInt(this.value) >= 1 && parseInt(this.value) <= 15 && !snake.slg) {
            snake.pr = parseInt(this.value);
            svarmi = true;
            window.ownskins["pr"] = parseInt(this.value);
        }
    };
    sccn__.onchange = prdeisitir;
    sccn__.onkeyup = prdeisitir;
    sccn__.onclick = prdeisitir;
    skMainWidth.appendChild(sccn__);
    var skMainWidth = document.createElement('div');
    skMainWidth.innerHTML = '<span title="' + "Your Eye Lens Size.\nIt is limited to between 1 and 15\nBecause 15 up is too big, 1 down is not work.\nAlso you can't use on Slogoman Eyes" + '" style="cursor:help;">Eye Lens Size <font color="red">(?)</font>:</span>';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginRight = '13px';
    skMainDiv.appendChild(skMainWidth);
    var sccn = document.createElement('input');
    sccn.type = 'number';
    sccn.min = 1;
    sccn.max = 15;
    sccn.value = 6;
    sccn.style.marginLeft = '10px';
    sccn.style.width = '50px';
    sccn.style.height = '20px';
    sccn.style.border = '1px solid #A9A9A9';
    sccn.style.fontSize = '12px';
    sccn.style.verticalAlign = 'middle';
    var erdeistirir = function() {
        if (parseInt(this.value) >= 1 && parseInt(this.value) <= 15 && !snake.slg) {
            snake.er = parseInt(this.value);
            avarmi = true;
            window.ownskins["er"] = parseInt(this.value);
        }
    };
    sccn.onchange = erdeistirir;
    sccn.onkeyup = erdeistirir;
    sccn.onclick = erdeistirir;
    skMainWidth.appendChild(sccn);
    var skMainWidth = document.createElement('div');
    skMainWidth.innerHTML = '<span title="' + "Your Head Size.\nIt is limited to between 0 and 50\nBecause 50 up is too big, 0 down is not work." + '" style="cursor:help;">Head Size <font color="red">(?)</font>:</span>';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginRight = '13px';
    skMainDiv.appendChild(skMainWidth);
    var sccn = document.createElement('input');
    sccn.type = 'number';
    sccn.value = 0;
    sccn.style.marginLeft = '10px';
    sccn.style.width = '50px';
    sccn.style.height = '20px';
    sccn.style.border = '1px solid #A9A9A9';
    sccn.style.fontSize = '12px';
    sccn.style.verticalAlign = 'middle';
    var smelldeistir = function() {
        if (parseInt(this.value) >= 0 && parseInt(this.value) <= 50) {
            snake.swell = parseInt(this.value) / 200;
            dvarmi = true;
            window.ownskins["swell"] = parseInt(this.value) / 200;
        }
    };
    sccn.onchange = smelldeistir;
    sccn.onkeyup = smelldeistir;
    sccn.onclick = smelldeistir;
    skMainWidth.appendChild(sccn);
    var skMain = document.createElement('div');
    _scws.appendChild(skMain);
    var skMainDiv = document.createElement('div');
    skMainDiv.style.marginBottom = '2px';
    skMain.appendChild(skMainDiv);
    var skMainWidth = document.createElement('div');
    skMainWidth.textContent = 'Antenna Color:';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginRight = '13px';
    skMainDiv.appendChild(skMainWidth);
    var sccn = document.createElement('input');
    sccn.type = 'color';
    sccn.min = 1;
    sccn.style.marginLeft = '10px';
    sccn.style.width = '50px';
    sccn.style.height = '20px';
    sccn.style.border = '1px solid #A9A9A9';
    sccn.style.fontSize = '12px';
    sccn.style.verticalAlign = 'middle';
    sccn.value = "#FFFFFF";
    sccn.id = "antenna_color";
    var antennaColorFunct = function() {
        r4varmi = true;
        if (document.getElementById('mycheckbox').checked == false) {
            document.getElementById('mycheckbox').click();
        }
        if (document.getElementById('transparen1').checked == true) {
            document.getElementById('transparen1').checked = false;
        }
        snake.atc2 = this.value;
        window.ownskins["atc2"] = snake.atc2;
    };
    sccn.onchange = antennaColorFunct;
    sccn.onkeyup = antennaColorFunct;
    sccn.onclick = antennaColorFunct;
    skMainWidth.appendChild(sccn);
    var skMainWidth = document.createElement('div');
    skMainWidth.textContent = 'Transparent:';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginRight = '13px';
    skMainDiv.appendChild(skMainWidth);
    var __sccn = document.createElement('input');
    __sccn.type = 'checkbox';
    __sccn.id = 'transparen1';
    __sccn.style.marginLeft = '10px';
    __sccn.style.width = '50px';
    __sccn.style.height = '20px';
    __sccn.style.border = '1px solid #A9A9A9';
    __sccn.style.fontSize = '12px';
    __sccn.style.verticalAlign = 'middle';
    var AntennaTransparentFunct = function() {
        if (this.checked) {
            r4varmi = true;
            snake.atc2 = "transparent";
            if (document.getElementById('mycheckbox').checked == false) {
                document.getElementById('mycheckbox').click();
            }
        } else {
            snake.atc2 = document.getElementById("antenna_color").value;
        }
        window.ownskins["atc2"] = snake.atc2;
    };
    __sccn.onclick = AntennaTransparentFunct;
    skMainWidth.appendChild(__sccn);
    var skMain = document.createElement('div');
    _scws.appendChild(skMain);
    var skMainDiv = document.createElement('div');
    skMainDiv.style.marginBottom = '1px';
    skMain.appendChild(skMainDiv);
    var skMainHeight = document.createElement('div');
    skMainHeight.textContent = 'Antenna Border Color:';
    skMainHeight.style.position = 'relative';
    skMainHeight.style.display = 'inline-block';
    skMainDiv.appendChild(skMainHeight);
    var __sccn = document.createElement('input');
    __sccn.type = 'color';
    __sccn.min = 1;
    __sccn.id = "antenna_border_color";
    __sccn.style.marginLeft = '10px';
    __sccn.style.width = '50px';
    __sccn.style.height = '20px';
    __sccn.style.border = '1px solid #A9A9A9';
    __sccn.style.fontSize = '12px';
    __sccn.style.verticalAlign = 'middle';
    __sccn.value = "#000000";
    var antennaBorderColorFunct = function() {
        r3varmi = true;
        if (document.getElementById('mycheckbox').checked == false) {
            document.getElementById('mycheckbox').click();
        }
        if (document.getElementById('transparen2').checked == true) {
            document.getElementById('transparen2').checked = false;
        }
        snake.atc1 = this.value;
        window.ownskins["atc1"] = snake.atc1;
    };
    __sccn.onchange = antennaBorderColorFunct;
    __sccn.onkeyup = antennaBorderColorFunct;
    __sccn.onclick = antennaBorderColorFunct;
    skMainHeight.appendChild(__sccn);
    var skMainWidth = document.createElement('div');
    skMainWidth.textContent = 'Transparent:';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginLeft = '8px';
    skMainDiv.appendChild(skMainWidth);
    var __sccn = document.createElement('input');
    __sccn.type = 'checkbox';
    __sccn.id = 'transparen2';
    __sccn.style.marginLeft = '10px';
    __sccn.style.width = '50px';
    __sccn.style.height = '20px';
    __sccn.style.border = '1px solid #A9A9A9';
    __sccn.style.fontSize = '12px';
    __sccn.style.verticalAlign = 'middle';
    var AntennaBorderTransparentFunct = function() {
        if (this.checked) {
            r3varmi = true;
            snake.atc1 = "transparent";
            if (document.getElementById('mycheckbox').checked == false) {
                document.getElementById('mycheckbox').click();
            }
        } else {
            snake.atc1 = document.getElementById("antenna_border_color").value;
        }
        window.ownskins["atc1"] = snake.atc1;
    };
    __sccn.onclick = AntennaBorderTransparentFunct;
    skMainWidth.appendChild(__sccn);
    var skMain = document.createElement('div');
    _scws.appendChild(skMain);
    var skMainDiv = document.createElement('div');
    skMainDiv.style.marginBottom = '2px';
    skMain.appendChild(skMainDiv);
    var skMainWidth = document.createElement('div');
    skMainWidth.textContent = 'Eye Color:';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginRight = '13px';
    skMainDiv.appendChild(skMainWidth);
    var sccn = document.createElement('input');
    sccn.type = 'color';
    sccn.min = 1;
    sccn.id = "eye_color";
    sccn.style.marginLeft = '10px';
    sccn.style.width = '50px';
    sccn.style.height = '20px';
    sccn.style.border = '1px solid #A9A9A9';
    sccn.style.fontSize = '12px';
    sccn.style.verticalAlign = 'middle';
    sccn.value = "#000000";
    var eyeColorFunct = function() {
        r1varmi = true;
        snake.ppc = this.value;
        window.ownskins["ppc"] = snake.ppc;
        if (document.getElementById('transparen3').checked == true) {
            document.getElementById('transparen3').checked = false;
        }
    };
    sccn.onchange = eyeColorFunct;
    sccn.onkeyup = eyeColorFunct;
    sccn.onclick = eyeColorFunct;
    skMainWidth.appendChild(sccn);
    var skMainWidth = document.createElement('div');
    skMainWidth.textContent = 'Transparent:';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginRight = '13px';
    skMainDiv.appendChild(skMainWidth);
    var __sccn = document.createElement('input');
    __sccn.type = 'checkbox';
    __sccn.style.marginLeft = '10px';
    __sccn.style.width = '50px';
    __sccn.id = 'transparen3';
    __sccn.style.height = '20px';
    __sccn.style.border = '1px solid #A9A9A9';
    __sccn.style.fontSize = '12px';
    __sccn.style.verticalAlign = 'middle';
    var EyeTransparentFunct = function() {
        if (this.checked) {
            snake.ppc = "transparent";
            r1varmi = true;
        } else {
            snake.ppc = document.getElementById("eye_color").value;
        }
        window.ownskins["ppc"] = snake.ppc;
    };
    __sccn.onclick = EyeTransparentFunct;
    skMainWidth.appendChild(__sccn);
    var skMain = document.createElement('div');
    _scws.appendChild(skMain);
    var skMainDiv = document.createElement('div');
    skMainDiv.style.marginBottom = '2px';
    skMain.appendChild(skMainDiv);
    var skMainHeight = document.createElement('div');
    skMainHeight.textContent = 'Eye Lens Color:';
    skMainHeight.style.position = 'relative';
    skMainHeight.style.display = 'inline-block';
    skMainDiv.appendChild(skMainHeight);
    var __sccn = document.createElement('input');
    __sccn.type = 'color';
    __sccn.min = 1;
    __sccn.id = "eye_lens_color";
    __sccn.style.marginLeft = '10px';
    __sccn.style.width = '50px';
    __sccn.style.height = '20px';
    __sccn.style.border = '1px solid #A9A9A9';
    __sccn.style.fontSize = '12px';
    __sccn.style.verticalAlign = 'middle';
    __sccn.value = "#FFFFFF";
    var EyeLensColorFunct = function() {
        r2varmi = true;
        snake.ec = this.value;
        window.ownskins["ec"] = snake.ec;
        if (document.getElementById('transparen4').checked == true) {
            document.getElementById('transparen4').checked = false;
        }
    };
    __sccn.onchange = EyeLensColorFunct;
    __sccn.onkeyup = EyeLensColorFunct;
    __sccn.onclick = EyeLensColorFunct;
    skMainHeight.appendChild(__sccn);
    var skMainWidth = document.createElement('div');
    skMainWidth.textContent = 'Transparent:';
    skMainWidth.style.position = 'relative';
    skMainWidth.style.display = 'inline-block';
    skMainWidth.style.marginLeft = '8px';
    skMainDiv.appendChild(skMainWidth);
    var __sccn = document.createElement('input');
    __sccn.type = 'checkbox';
    __sccn.id = 'transparen4';
    __sccn.style.marginLeft = '10px';
    __sccn.style.width = '50px';
    __sccn.style.height = '20px';
    __sccn.style.border = '1px solid #A9A9A9';
    __sccn.style.fontSize = '12px';
    __sccn.style.verticalAlign = 'middle';
    var EyeLensTransparentFunct = function() {
        if (this.checked) {
            snake.ec = "transparent";
            r2varmi = true;
        } else {
            snake.ec = document.getElementById("eye_lens_color").value;
        }
        window.ownskins["ec"] = snake.ec;
    };
    __sccn.onclick = EyeLensTransparentFunct;
    skMainWidth.appendChild(__sccn);
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
    scnew.className = 'slitherioskin-blue';
    scnew.style.fontWeight = 'bold';
    scnew.onclick = newSkin;
    scdef.appendChild(scnew);
    var sccss = document.createElement('div');
    scws.appendChild(sccss);
    var scadd = document.createElement('div');
    scadd.innerHTML = '<span class="slitherioskin-blue">Add color stop</span>';
    scadd.style.display = 'none';
    scadd.firstChild.onclick = function() {
        var prevColor = +sccss.lastChild.firstChild.childNodes[1].dataset.color,
            push;
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
    var scprops = document.createElement('div');
    scprops.style.display = 'none';
    scws.appendChild(scprops);

    function onChange(prop, value, up = false) {
        var value = this[value];
        up ? (skins[snake.rcv - max_skin_cv - 1][prop] = value) : (skins[snake.rcv - max_skin_cv - 1].skin[prop] = value);
        var storageSkins = JSON.parse(localStorage.getItem('slitherioskin-skins'));
        up ? (storageSkins[snake.rcv - max_skin_cv - 1][prop] = value) : (storageSkins[snake.rcv - max_skin_cv - 1].skin[prop] = value);
        localStorage.setItem('slitherioskin-skins', JSON.stringify(storageSkins));
        setSkin(snake, snake.rcv);
    }

    function snakeSwitch(prop, name, up = false) {
        var scprop = document.createElement('div');
        scprop.innerHTML = '<input type="checkbox" id="slitherioskin-' + prop + '"> <label for="slitherioskin-' + prop + '">' + name + '</label>';
        scprop.dataset.prop = prop;
        scprop.firstChild.style.margin = scprop.lastChild.style.margin = 0;
        scprop.firstChild.onchange = function() {
            onChange.apply(this, [prop, 'checked', up]);
        };
        scprops.appendChild(scprop);
        return scprop;
    }
    snakeSwitch('slg', 'Slogoman eyes');
    snakeSwitch('jyt', 'Jelly face');
    snakeSwitch('one_eye', 'Jacksepticeye');
    var scskin = document.createElement('div');
    scskin.style.display = 'none';
    scskin.style.marginTop = '7px';
    scws.appendChild(scskin);
    var sccreate = document.createElement('span');
    sccreate.textContent = 'Create new &';
    sccreate.className = 'slitherioskin-blue';
    sccreate.onclick = newSkin;
    scskin.appendChild(sccreate);
    var scdelete = document.createElement('span');
    scdelete.textContent = 'Delete this skin';
    scdelete.className = 'slitherioskin-blue';
    scdelete.onclick = function() {
        skins.splice(snake.rcv - max_skin_cv - 1, 1);
        var storageSkins = JSON.parse(localStorage.getItem('slitherioskin-skins'));
        storageSkins.splice(snake.rcv - max_skin_cv - 1, 1);
        localStorage.setItem('slitherioskin-skins', JSON.stringify(storageSkins));
        setSkin(snake, snake.rcv - 1);
    };
    scskin.appendChild(scdelete);
    var sccm = document.createElement('div'),
        colors;
    sccm.style.position = 'absolute';
    sccm.style.top = '0px';
    sccm.style.left = '-310px';
    sccm.style.padding = '3px 7px';
    sccm.style.width = '350px';
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
    sccset.innerHTML = '<span class="slitherioskin-blue">Color settings</span>';
    sccset.firstChild.className = 'slitherioskin-blue';
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
            scc.style.backgroundColor = 'rgb(' + rrs[i] + ',' + ggs[i] + ',' + bbs[i] + ')';
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
    var ssblackout = createWindow(),
        ssdiv = ssblackout.firstChild;
    var ssheader = document.createElement('h2');
    ssheader.textContent = 'Special skins';
    ssdiv.appendChild(ssheader);
    var ssp = document.createElement('div');
    ssp.textContent = 'Check the skins you want to use:';
    ssp.style.textAlign = 'center';
    ssdiv.appendChild(ssp);

    var scolors = [
            [179, 74, 0],
            [153, 255, 0],
            [255, 25, 0],
            [0, 213, 255],
            [132, 184, 25],
            [0, 0, 0],
            [129, 94, 57],
            [162, 118, 93],
            [215, 165, 135],
            [58, 88, 151],
            [100, 174, 226],
            [100, 65, 165],
            [50, 92, 17],
            [242, 240, 0],
            [170, 53, 20],
            [194, 129, 46],
            [39, 76, 160],
            [227, 199, 17],
            [160, 178, 136],
            [10, 159, 138],
            [140, 199, 49]
        ];
    for (var i = 0; i < scolors.length; i++) {
        rrs.push(scolors[i][0]);
        ggs.push(scolors[i][1]);
        bbs.push(scolors[i][2]);
        applyColor(ncolors++);
    }

    setColors();
    colorMenu();
    var skins = JSON.parse(localStorage.getItem('slitherioskin-skins')) || [];
    if (!(skins instanceof Array)) skins = [];
    if (skins.length > 0 && skins[0] instanceof Array) {
        for (var i = 0; i < skins.length; i++)
            skins[i] = {
                skin: {
                    rbcs: skins[i]
                }
            };
        localStorage.setItem('slitherioskin-skins', JSON.stringify(skins));
    }
    var storageSkins = JSON.parse(JSON.stringify(skins));
    for (var i = 0; i < skins.length; i++)
        for (var j = 0; j < skins[i].skin.rbcs.length; j++) {
            if (skins[i].skin.rbcs[j] >= ncolors) storageSkins[i].skin.rbcs[j] = skins[i].skin.rbcs[j] = ((skins[i].skin.rbcs[j] - ncolors + 1) > ccolors.length ? ncolors - 1 : ~skins[i].skin.rbcs[j] + ncolors), localStorage.setItem('slitherioskin-skins', JSON.stringify(storageSkins));
            if (-skins[i].skin.rbcs[j] > ccolors.length) storageSkins[i].skin.rbcs[j] = skins[i].skin.rbcs[j] = -ccolors.length, localStorage.setItem('slitherioskin-skins', JSON.stringify(storageSkins));
            if (skins[i].skin.rbcs[j] < 0) skins[i].skin.rbcs[j] = ~skins[i].skin.rbcs[j] + ncolors;
        }
    if (localStorage.getItem('slitherioskin-nameid')) nick.value = localStorage.getItem('slitherioskin-nameid');
    nick.onchange = function() {
        localStorage.setItem('slitherioskin-nameid', this.value);
    };
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
        return false;
    };
    nsk.onclick = function() {
        if (playing && snake) {
            var c = snake.rcv;
            c++;
            c > max_skin_cv + skins.length && (c = 0);
            setSkin(snake, c);
        }
        return false;
    };
    var onkeyup = document.onkeyup;

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
        stylesheet.insertRule('.slitherioskin-window{max-height:' + (hh - 50) + 'px;' + '}', stylesheet.cssRules.length);
    };
})();

var canvas = window.canvas = (function (window) {
    return {
        // Spoofs moving the mouse to the provided coordinates.
        setMouseCoordinates: function (point) {
            window.xm = point.x;
            window.ym = point.y;
        },

        // Convert map coordinates to mouse coordinates.
        mapToMouse: function (point) {
            var mouseX = (point.x - window.snake.xx) * window.gsc;
            var mouseY = (point.y - window.snake.yy) * window.gsc;
            return { x: mouseX, y: mouseY };
        },

        // Map cordinates to Canvas cordinate shortcut
        mapToCanvas: function (point) {
            var c = {
                x: window.mww2 + (point.x - window.view_xx) * window.gsc,
                y: window.mhh2 + (point.y - window.view_yy) * window.gsc
            };
            return c;
        },

        // Map to Canvas coordinate conversion for drawing circles.
        // Radius also needs to scale by .gsc
        circleMapToCanvas: function (circle) {
            var newCircle = canvas.mapToCanvas({
                x: circle.x,
                y: circle.y
            });
            return canvas.circle(
                newCircle.x,
                newCircle.y,
                circle.radius * window.gsc
            );
        },

        // Constructor for point type
        point: function (x, y) {
            var p = {
                x: Math.round(x),
                y: Math.round(y)
            };

            return p;
        },

        // Constructor for rect type
        rect: function (x, y, w, h) {
            var r = {
                x: Math.round(x),
                y: Math.round(y),
                width: Math.round(w),
                height: Math.round(h)
            };

            return r;
        },

        // Constructor for circle type
        circle: function (x, y, r) {
            var c = {
                x: Math.round(x),
                y: Math.round(y),
                radius: Math.round(r)
            };

            return c;
        },

        // Fast atan2
        fastAtan2: function (y, x) {
            const QPI = Math.PI / 4;
            const TQPI = 3 * Math.PI / 4;
            var r = 0.0;
            var angle = 0.0;
            var abs_y = Math.abs(y) + 1e-10;
            if (x < 0) {
                r = (x + abs_y) / (abs_y - x);
                angle = TQPI;
            } else {
                r = (x - abs_y) / (x + abs_y);
                angle = QPI;
            }
            angle += (0.1963 * r * r - 0.9817) * r;
            if (y < 0) {
                return -angle;
            }

            return angle;
        },

        // Adjusts zoom in response to the mouse wheel.
        setZoom: function (e) {
            // Scaling ratio
            if (window.gsc) {
                window.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
                window.desired_gsc = window.gsc;
            }
        },

        // Restores zoom to the default value.
        resetZoom: function () {
            window.gsc = 0.9;
            window.desired_gsc = 0.9;
        },

        // Maintains Zoom
        maintainZoom: function () {
            if (window.desired_gsc !== undefined) {
                window.gsc = window.desired_gsc;
            }
        },

        // Sets background to the given image URL.
        // Defaults to slither.io's own background.
        setBackground: function (url) {
            url = typeof url !== 'undefined' ? url : '/s/bg45.jpg';
            window.ii.src = url;
        },

        // Draw a rectangle on the canvas.
        drawRect: function (rect, color, fill, alpha) {
            if (alpha === undefined) alpha = 1;

            var context = window.mc.getContext('2d');
            var lc = canvas.mapToCanvas({ x: rect.x, y: rect.y });

            context.save();
            context.globalAlpha = alpha;
            context.strokeStyle = color;
            context.rect(lc.x, lc.y, rect.width * window.gsc, rect.height * window.gsc);
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw a circle on the canvas.
        drawCircle: function (circle, color, fill, alpha) {
            if (alpha === undefined) alpha = 1;
            if (circle.radius === undefined) circle.radius = 5;

            var context = window.mc.getContext('2d');
            var drawCircle = canvas.circleMapToCanvas(circle);

            context.save();
            context.globalAlpha = alpha;
            context.beginPath();
            context.strokeStyle = color;
            context.arc(drawCircle.x, drawCircle.y, drawCircle.radius, 0, Math.PI * 2);
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw an angle.
        // @param {number} start -- where to start the angle
        // @param {number} angle -- width of the angle
        // @param {bool} danger -- green if false, red if true
        drawAngle: function (start, angle, color, fill, alpha) {
            if (alpha === undefined) alpha = 0.6;

            var context = window.mc.getContext('2d');

            context.save();
            context.globalAlpha = alpha;
            context.beginPath();
            context.moveTo(window.mc.width / 2, window.mc.height / 2);
            context.arc(window.mc.width / 2, window.mc.height / 2, window.gsc * 100, start, angle);
            context.lineTo(window.mc.width / 2, window.mc.height / 2);
            context.closePath();
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw a line on the canvas.
        drawLine: function (p1, p2, color, width) {
            if (width === undefined) width = 5;

            var context = window.mc.getContext('2d');
            var dp1 = canvas.mapToCanvas(p1);
            var dp2 = canvas.mapToCanvas(p2);

            context.save();
            context.beginPath();
            context.lineWidth = width * window.gsc;
            context.strokeStyle = color;
            context.moveTo(dp1.x, dp1.y);
            context.lineTo(dp2.x, dp2.y);
            context.stroke();
            context.restore();
        },

        // Given the start and end of a line, is point left.
        isLeft: function (start, end, point) {
            return ((end.x - start.x) * (point.y - start.y) -
                (end.y - start.y) * (point.x - start.x)) > 0;

        },

        // Get distance squared
        getDistance2: function (x1, y1, x2, y2) {
            var distance2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
            return distance2;
        },

        getDistance2FromSnake: function (point) {
            point.distance = canvas.getDistance2(window.snake.xx, window.snake.yy,
                point.xx, point.yy);
            return point;
        },

        // return unit vector in the direction of the argument
        unitVector: function (v) {
            var l = Math.sqrt(v.x * v.x + v.y * v.y);
            if (l > 0) {
                return {
                    x: v.x / l,
                    y: v.y / l
                };
            } else {
                return {
                    x: 0,
                    y: 0
                };
            }
        },

        // Check if point in Rect
        pointInRect: function (point, rect) {
            if (rect.x <= point.x && rect.y <= point.y &&
                rect.x + rect.width >= point.x && rect.y + rect.height >= point.y) {
                return true;
            }
            return false;
        },

        // check if point is in polygon
        pointInPoly: function (point, poly) {
            if (point.x < poly.minx || point.x > poly.maxx ||
                point.y < poly.miny || point.y > poly.maxy) {
                return false;
            }
            let c = false;
            const l = poly.pts.length;
            for (let i = 0, j = l - 1; i < l; j = i++) {
                if ( ((poly.pts[i].y > point.y) != (poly.pts[j].y > point.y)) &&
                    (point.x < (poly.pts[j].x - poly.pts[i].x) * (point.y - poly.pts[i].y) /
                        (poly.pts[j].y - poly.pts[i].y) + poly.pts[i].x) ) {
                    c = !c;
                }
            }
            return c;
        },

        addPolyBox: function (poly) {
            var minx = poly.pts[0].x;
            var maxx = poly.pts[0].x;
            var miny = poly.pts[0].y;
            var maxy = poly.pts[0].y;
            for (let p = 1, l = poly.pts.length; p < l; p++) {
                if (poly.pts[p].x < minx) {
                    minx = poly.pts[p].x;
                }
                if (poly.pts[p].x > maxx) {
                    maxx = poly.pts[p].x;
                }
                if (poly.pts[p].y < miny) {
                    miny = poly.pts[p].y;
                }
                if (poly.pts[p].y > maxy) {
                    maxy = poly.pts[p].y;
                }
            }
            return {
                pts: poly.pts,
                minx: minx,
                maxx: maxx,
                miny: miny,
                maxy: maxy
            };
        },

        cross: function (o, a, b) {
            return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
        },

        convexHullSort: function (a, b) {
            return a.x == b.x ? a.y - b.y : a.x - b.x;
        },

        convexHull: function (points) {
            points.sort(canvas.convexHullSort);

            var lower = [];
            for (let i = 0, l = points.length; i < l; i++) {
                while (lower.length >= 2 && canvas.cross(
                    lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
                    lower.pop();
                }
                lower.push(points[i]);
            }

            var upper = [];
            for (let i = points.length - 1; i >= 0; i--) {
                while (upper.length >= 2 && canvas.cross(
                    upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
                    upper.pop();
                }
                upper.push(points[i]);
            }

            upper.pop();
            lower.pop();
            return lower.concat(upper);
        },

        // Check if circles intersect
        circleIntersect: function (circle1, circle2) {
            var bothRadii = circle1.radius + circle2.radius;
            var point = {};

            // Pretends the circles are squares for a quick collision check.
            // If it collides, do the more expensive circle check.
            if (circle1.x + bothRadii > circle2.x &&
                circle1.y + bothRadii > circle2.y &&
                circle1.x < circle2.x + bothRadii &&
                circle1.y < circle2.y + bothRadii) {

                var distance2 = canvas.getDistance2(circle1.x, circle1.y, circle2.x, circle2.y);

                if (distance2 < bothRadii * bothRadii) {
                    point = {
                        x: ((circle1.x * circle2.radius) + (circle2.x * circle1.radius)) /
                        bothRadii,
                        y: ((circle1.y * circle2.radius) + (circle2.y * circle1.radius)) /
                        bothRadii,
                        ang: 0.0
                    };

                    point.ang = canvas.fastAtan2(
                        point.y - window.snake.yy, point.x - window.snake.xx);

                    if (window.visualDebugging) {
                        var collisionPointCircle = canvas.circle(
                            point.x,
                            point.y,
                            5
                        );
                        canvas.drawCircle(circle2, '#ff9900', false);
                        canvas.drawCircle(collisionPointCircle, '#66ff66', true);
                    }
                    return point;
                }
            }
            return false;
        }
    };
})(window);

var bot = window.bot = (function (window) {
    return {
        isBotRunning: false,
        isBotEnabled: true,
        stage: 'grow',
        collisionPoints: [],
        collisionAngles: [],
        foodAngles: [],
        scores: [],
        foodTimeout: undefined,
        sectorBoxSide: 0,
        defaultAccel: 0,
        sectorBox: {},
        currentFood: {},
        opt: {
            // target fps
            targetFps: 60,
            // size of arc for collisionAngles
            arcSize: Math.PI / 8,
            // radius multiple for circle intersects
            radiusMult: 10,
            // food cluster size to trigger acceleration
            foodAccelSz: 200,
            // maximum angle of food to trigger acceleration
            foodAccelDa: Math.PI / 2,
            // how many frames per action
            actionFrames: 2,
            // how many frames to delay action after collision
            collisionDelay: 10,
            // base speed
            speedBase: 5.78,
            // front angle size
            frontAngle: Math.PI / 2,
            // percent of angles covered by same snake to be considered an encircle attempt
            enCircleThreshold: 0.5625,
            // percent of angles covered by all snakes to move to safety
            enCircleAllThreshold: 0.5625,
            // distance multiplier for enCircleAllThreshold
            enCircleDistanceMult: 20,
            // snake score to start circling on self
            followCircleLength: 5000,
            // direction for followCircle: +1 for counter clockwise and -1 for clockwise
            followCircleDirection: +1
        },
        MID_X: 0,
        MID_Y: 0,
        MAP_R: 0,
        MAXARC: 0,

        getSnakeWidth: function (sc) {
            if (sc === undefined) sc = window.snake.sc;
            return Math.round(sc * 29.0);
        },

        quickRespawn: function () {
            window.dead_mtm = 0;
            window.login_fr = 0;

            bot.isBotRunning = false;
            window.forcing = true;
            bot.connect();
            window.forcing = false;
        },

        connect: function () {
            if (window.force_ip && window.force_port) {
                window.forceServer(window.force_ip, window.force_port);
            }

            window.connect();
        },

        // angleBetween - get the smallest angle between two angles (0-pi)
        angleBetween: function (a1, a2) {
            var r1 = 0.0;
            var r2 = 0.0;

            r1 = (a1 - a2) % Math.PI;
            r2 = (a2 - a1) % Math.PI;

            return r1 < r2 ? -r1 : r2;
        },

        // Change heading to ang
        changeHeadingAbs: function (angle) {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);

            window.goalCoordinates = {
                x: Math.round(
                    window.snake.xx + (bot.headCircle.radius) * cos),
                y: Math.round(
                    window.snake.yy + (bot.headCircle.radius) * sin)
            };

            /*if (window.visualDebugging) {
                canvas.drawLine({
                    x: window.snake.xx,
                    y: window.snake.yy},
                    window.goalCoordinates, 'yellow', '8');
            }*/

            canvas.setMouseCoordinates(canvas.mapToMouse(window.goalCoordinates));
        },

        // Change heading by ang
        // +0-pi turn left
        // -0-pi turn right

        changeHeadingRel: function (angle) {
            var heading = {
                x: window.snake.xx + 500 * bot.cos,
                y: window.snake.yy + 500 * bot.sin
            };

            var cos = Math.cos(-angle);
            var sin = Math.sin(-angle);

            window.goalCoordinates = {
                x: Math.round(
                    cos * (heading.x - window.snake.xx) -
                    sin * (heading.y - window.snake.yy) + window.snake.xx),
                y: Math.round(
                    sin * (heading.x - window.snake.xx) +
                    cos * (heading.y - window.snake.yy) + window.snake.yy)
            };

            canvas.setMouseCoordinates(canvas.mapToMouse(window.goalCoordinates));
        },

        // Change heading to the best angle for avoidance.
        headingBestAngle: function () {
            var best;
            var distance;
            var openAngles = [];
            var openStart;

            var sIndex = bot.getAngleIndex(window.snake.ehang) + bot.MAXARC / 2;
            if (sIndex > bot.MAXARC) sIndex -= bot.MAXARC;

            for (var i = 0; i < bot.MAXARC; i++) {
                if (bot.collisionAngles[i] === undefined) {
                    distance = 0;
                    if (openStart === undefined) openStart = i;
                } else {
                    distance = bot.collisionAngles[i].distance;
                    if (openStart) {
                        openAngles.push({
                            openStart: openStart,
                            openEnd: i - 1,
                            sz: (i - 1) - openStart
                        });
                        openStart = undefined;
                    }
                }

                if (best === undefined ||
                    (best.distance < distance && best.distance !== 0)) {
                    best = {
                        distance: distance,
                        aIndex: i
                    };
                }
            }

            if (openStart && openAngles[0]) {
                openAngles[0].openStart = openStart;
                openAngles[0].sz = openAngles[0].openEnd - openStart;
                if (openAngles[0].sz < 0) openAngles[0].sz += bot.MAXARC;

            } else if (openStart) {
                openAngles.push({openStart: openStart, openEnd: openStart, sz: 0});
            }

            if (openAngles.length > 0) {
                openAngles.sort(bot.sortSz);
                bot.changeHeadingAbs(
                    (openAngles[0].openEnd - openAngles[0].sz / 2) * bot.opt.arcSize);
            } else {
                bot.changeHeadingAbs(best.aIndex * bot.opt.arcSize);
            }
        },

        // Avoid collision point by ang
        // ang radians <= Math.PI (180deg)
        avoidCollisionPoint: function (point, ang) {
            if (ang === undefined || ang > Math.PI) {
                ang = Math.PI;
            }

            var end = {
                x: window.snake.xx + 2000 * bot.cos,
                y: window.snake.yy + 2000 * bot.sin
            };

            if (window.visualDebugging) {
                canvas.drawLine(
                    { x: window.snake.xx, y: window.snake.yy },
                    end,
                    'orange', 5);
                canvas.drawLine(
                    { x: window.snake.xx, y: window.snake.yy },
                    { x: point.x, y: point.y },
                    'red', 5);
            }

            if (canvas.isLeft(
                { x: window.snake.xx, y: window.snake.yy }, end,
                { x: point.x, y: point.y })) {
                bot.changeHeadingAbs(point.ang - ang);
            } else {
                bot.changeHeadingAbs(point.ang + ang);
            }
        },

        // get collision angle index, expects angle +/i 0 to Math.PI
        getAngleIndex: function (angle) {
            var index;

            if (angle < 0) {
                angle += 2 * Math.PI;
            }

            index = Math.round(angle * (1 / bot.opt.arcSize));

            if (index === bot.MAXARC) {
                return 0;
            }
            return index;
        },

        // Add to collisionAngles if distance is closer
        addCollisionAngle: function (sp) {
            var ang = canvas.fastAtan2(
                Math.round(sp.yy - window.snake.yy),
                Math.round(sp.xx - window.snake.xx));
            var aIndex = bot.getAngleIndex(ang);

            var actualDistance = Math.round(Math.pow(
                Math.sqrt(sp.distance) - sp.radius, 2));

            if (bot.collisionAngles[aIndex] === undefined ||
                 bot.collisionAngles[aIndex].distance > sp.distance) {
                bot.collisionAngles[aIndex] = {
                    x: Math.round(sp.xx),
                    y: Math.round(sp.yy),
                    ang: ang,
                    snake: sp.snake,
                    distance: actualDistance,
                    radius: sp.radius,
                    aIndex: aIndex
                };
            }
        },

        // Add and score foodAngles
        addFoodAngle: function (f) {
            var ang = canvas.fastAtan2(
                Math.round(f.yy - window.snake.yy),
                Math.round(f.xx - window.snake.xx));

            var aIndex = bot.getAngleIndex(ang);

            canvas.getDistance2FromSnake(f);

            if (bot.collisionAngles[aIndex] === undefined ||
                Math.sqrt(bot.collisionAngles[aIndex].distance) >
                Math.sqrt(f.distance) + bot.snakeRadius * bot.opt.radiusMult * bot.speedMult / 2) {
                if (bot.foodAngles[aIndex] === undefined) {
                    bot.foodAngles[aIndex] = {
                        x: Math.round(f.xx),
                        y: Math.round(f.yy),
                        ang: ang,
                        da: Math.abs(bot.angleBetween(ang, window.snake.ehang)),
                        distance: f.distance,
                        sz: f.sz,
                        score: Math.pow(f.sz, 2) / f.distance
                    };
                } else {
                    bot.foodAngles[aIndex].sz += Math.round(f.sz);
                    bot.foodAngles[aIndex].score += Math.pow(f.sz, 2) / f.distance;
                    if (bot.foodAngles[aIndex].distance > f.distance) {
                        bot.foodAngles[aIndex].x = Math.round(f.xx);
                        bot.foodAngles[aIndex].y = Math.round(f.yy);
                        bot.foodAngles[aIndex].distance = f.distance;
                    }
                }
            }
        },

        // Get closest collision point per snake.
        getCollisionPoints: function () {
            var scPoint;

            bot.collisionPoints = [];
            bot.collisionAngles = [];


            for (var snake = 0, ls = window.snakes.length; snake < ls; snake++) {
                scPoint = undefined;

                if (window.snakes[snake].id !== window.snake.id &&
                    window.snakes[snake].alive_amt === 1) {

                    var s = window.snakes[snake];
                    var sRadius = bot.getSnakeWidth(s.sc) / 2;
                    var sSpMult = Math.min(1, s.sp / 5.78 - 1 );

                    scPoint = {
                        xx: s.xx + Math.cos(s.ehang) * sRadius * sSpMult * bot.opt.radiusMult / 2,
                        yy: s.yy + Math.sin(s.ehang) * sRadius * sSpMult * bot.opt.radiusMult / 2,
                        snake: snake,
                        radius: bot.headCircle.radius,
                        head: true
                    };

                    canvas.getDistance2FromSnake(scPoint);
                    bot.addCollisionAngle(scPoint);
                    bot.collisionPoints.push(scPoint);

                    if (window.visualDebugging) {
                        canvas.drawCircle(canvas.circle(
                            scPoint.xx,
                            scPoint.yy,
                            scPoint.radius),
                            'red', false);
                    }

                    scPoint = undefined;

                    for (var pts = 0, lp = s.pts.length; pts < lp; pts++) {
                        if (!s.pts[pts].dying &&
                            canvas.pointInRect(
                                {
                                    x: s.pts[pts].xx,
                                    y: s.pts[pts].yy
                                }, bot.sectorBox)
                        ) {
                            var collisionPoint = {
                                xx: s.pts[pts].xx,
                                yy: s.pts[pts].yy,
                                snake: snake,
                                radius: sRadius
                            };

                            if (window.visualDebugging && true === false) {
                                canvas.drawCircle(canvas.circle(
                                    collisionPoint.xx,
                                    collisionPoint.yy,
                                    collisionPoint.radius),
                                    '#00FF00', false);
                            }

                            canvas.getDistance2FromSnake(collisionPoint);
                            bot.addCollisionAngle(collisionPoint);

                            if (collisionPoint.distance <= Math.pow(
                                (bot.headCircle.radius)
                                + collisionPoint.radius, 2)) {
                                bot.collisionPoints.push(collisionPoint);
                                if (window.visualDebugging) {
                                    canvas.drawCircle(canvas.circle(
                                        collisionPoint.xx,
                                        collisionPoint.yy,
                                        collisionPoint.radius
                                    ), 'red', false);
                                }
                            }
                        }
                    }
                }
            }

            // WALL
            if (canvas.getDistance2(bot.MID_X, bot.MID_Y, window.snake.xx, window.snake.yy) >
                Math.pow(bot.MAP_R - 1000, 2)) {
                var midAng = canvas.fastAtan2(
                    window.snake.yy - bot.MID_X, window.snake.xx - bot.MID_Y);
                scPoint = {
                    xx: bot.MID_X + bot.MAP_R * Math.cos(midAng),
                    yy: bot.MID_Y + bot.MAP_R * Math.sin(midAng),
                    snake: -1,
                    radius: bot.snakeWidth
                };
                canvas.getDistance2FromSnake(scPoint);
                bot.collisionPoints.push(scPoint);
                bot.addCollisionAngle(scPoint);
                if (window.visualDebugging) {
                    canvas.drawCircle(canvas.circle(
                        scPoint.xx,
                        scPoint.yy,
                        scPoint.radius
                    ), 'yellow', false);
                }
            }


            bot.collisionPoints.sort(bot.sortDistance);
            if (window.visualDebugging) {
                for (var i = 0; i < bot.collisionAngles.length; i++) {
                    if (bot.collisionAngles[i] !== undefined) {
                        canvas.drawLine(
                            { x: window.snake.xx, y: window.snake.yy },
                            { x: bot.collisionAngles[i].x, y: bot.collisionAngles[i].y },
                            'red', 2);
                    }
                }
            }
        },

        // Is collisionPoint (xx) in frontAngle
        inFrontAngle: function (point) {
            var ang = canvas.fastAtan2(
                Math.round(point.y - window.snake.yy),
                Math.round(point.x - window.snake.xx));

            if (Math.abs(bot.angleBetween(ang, window.snake.ehang)) < bot.opt.frontAngle) {
                return true;
            } else {
                return false;
            }

        },

        // Checks to see if you are going to collide with anything in the collision detection radius
        checkCollision: function () {
            var point;

            bot.getCollisionPoints();
            if (bot.collisionPoints.length === 0) return false;

            for (var i = 0; i < bot.collisionPoints.length; i++) {
                var collisionCircle = canvas.circle(
                    bot.collisionPoints[i].xx,
                    bot.collisionPoints[i].yy,
                    bot.collisionPoints[i].radius
                );

                // -1 snake is special case for non snake object.
                if ((point = canvas.circleIntersect(bot.headCircle, collisionCircle)) &&
                    bot.inFrontAngle(point)) {
                    if (bot.collisionPoints[i].snake !== -1 &&
                        bot.collisionPoints[i].head &&
                        window.snakes[bot.collisionPoints[i].snake].sp > 10) {
                        window.setAcceleration(1);
                    } else {
                        window.setAcceleration(bot.defaultAccel);
                    }
                    bot.avoidCollisionPoint(point);
                    return true;
                }
            }

            window.setAcceleration(bot.defaultAccel);
            return false;
        },

        checkEncircle: function () {
            var enSnake = [];
            var high = 0;
            var highSnake;
            var enAll = 0;

            for (var i = 0; i < bot.collisionAngles.length; i++) {
                if (bot.collisionAngles[i] !== undefined) {
                    var s = bot.collisionAngles[i].snake;
                    if (enSnake[s]) {
                        enSnake[s]++;
                    } else {
                        enSnake[s] = 1;
                    }
                    if (enSnake[s] > high) {
                        high = enSnake[s];
                        highSnake = s;
                    }

                    if (bot.collisionAngles[i].distance <
                        Math.pow(bot.snakeRadius * bot.opt.enCircleDistanceMult, 2)) {
                        enAll++;
                    }
                }
            }

            if (high > bot.MAXARC * bot.opt.enCircleThreshold) {
                bot.headingBestAngle();

                if (high !== bot.MAXARC && window.snakes[highSnake].sp > 10) {
                    window.setAcceleration(1);
                } else {
                    window.setAcceleration(bot.defaultAccel);
                }

                if (window.visualDebugging) {
                    canvas.drawCircle(canvas.circle(
                        window.snake.xx,
                        window.snake.yy,
                        bot.opt.radiusMult * bot.snakeRadius),
                        'red', true, 0.2);
                }
                return true;
            }

            if (enAll > bot.MAXARC * bot.opt.enCircleAllThreshold) {
                bot.headingBestAngle();
                window.setAcceleration(bot.defaultAccel);

                if (window.visualDebugging) {
                    canvas.drawCircle(canvas.circle(
                        window.snake.xx,
                        window.snake.yy,
                        bot.snakeRadius * bot.opt.enCircleDistanceMult),
                        'yellow', true, 0.2);
                }
                return true;
            } else {
                if (window.visualDebugging) {
                    canvas.drawCircle(canvas.circle(
                        window.snake.xx,
                        window.snake.yy,
                        bot.snakeRadius * bot.opt.enCircleDistanceMult),
                        'yellow');
                }
            }

            window.setAcceleration(bot.defaultAccel);
            return false;
        },

        populatePts: function () {
            let x = window.snake.xx + window.snake.fx;
            let y = window.snake.yy + window.snake.fy;
            let l = 0.0;
            bot.pts = [{
                x: x,
                y: y,
                len: l
            }];
            for (let p = window.snake.pts.length - 1; p >= 0; p--) {
                if (window.snake.pts[p].dying) {
                    continue;
                } else {
                    let xx = window.snake.pts[p].xx + window.snake.pts[p].fx;
                    let yy = window.snake.pts[p].yy + window.snake.pts[p].fy;
                    let ll = l + Math.sqrt(canvas.getDistance2(x, y, xx, yy));
                    bot.pts.push({
                        x: xx,
                        y: yy,
                        len: ll
                    });
                    x = xx;
                    y = yy;
                    l = ll;
                }
            }
            bot.len = l;
        },

        // set the direction of rotation based on the velocity of
        // the head with respect to the center of mass
        determineCircleDirection: function () {
            // find center mass (cx, cy)
            let cx = 0.0;
            let cy = 0.0;
            let pn = bot.pts.length;
            for (let p = 0; p < pn; p++) {
                cx += bot.pts[p].x;
                cy += bot.pts[p].y;
            }
            cx /= pn;
            cy /= pn;

            // vector from (cx, cy) to the head
            let head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };
            let dx = head.x - cx;
            let dy = head.y - cy;

            // check the sign of dot product of (bot.cos, bot.sin) and (-dy, dx)
            if (- dy * bot.cos + dx * bot.sin > 0) {
                // clockwise
                bot.opt.followCircleDirection = -1;
            } else {
                // couter clockwise
                bot.opt.followCircleDirection = +1;
            }
        },

        // returns a point on snake's body on given length from the head
        // assumes that bot.pts is populated
        smoothPoint: function (t) {
            // range check
            if (t >= bot.len) {
                let tail = bot.pts[bot.pts.length - 1];
                return {
                    x: tail.x,
                    y: tail.y
                };
            } else if (t <= 0 ) {
                return {
                    x: bot.pts[0].x,
                    y: bot.pts[0].y
                };
            }
            // binary search
            let p = 0;
            let q = bot.pts.length - 1;
            while (q - p > 1) {
                let m = Math.round((p + q) / 2);
                if (t > bot.pts[m].len) {
                    p = m;
                } else {
                    q = m;
                }
            }
            // now q = p + 1, and the point is in between;
            // compute approximation
            let wp = bot.pts[q].len - t;
            let wq = t - bot.pts[p].len;
            let w = wp + wq;
            return {
                x: (wp * bot.pts[p].x + wq * bot.pts[q].x) / w,
                y: (wp * bot.pts[p].y + wq * bot.pts[q].y) / w
            };
        },

        // finds a point on snake's body closest to the head;
        // returns length from the head
        // excludes points close to the head
        closestBodyPoint: function () {
            let head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };

            let ptsLength = bot.pts.length;

            // skip head area
            let start_n = 0;
            let start_d2 = 0.0;
            for ( ;; ) {
                let prev_d2 = start_d2;
                start_n ++;
                start_d2 = canvas.getDistance2(head.x, head.y,
                    bot.pts[start_n].x, bot.pts[start_n].y);
                if (start_d2 < prev_d2 || start_n == ptsLength - 1) {
                    break;
                }
            }

            if (start_n >= ptsLength || start_n <= 1) {
                return bot.len;
            }

            // find closets point in bot.pts
            let min_n = start_n;
            let min_d2 = start_d2;
            for (let n = min_n + 1; n < ptsLength; n++) {
                let d2 = canvas.getDistance2(head.x, head.y, bot.pts[n].x, bot.pts[n].y);
                if (d2 < min_d2) {
                    min_n = n;
                    min_d2 = d2;
                }
            }

            // find second closest point
            let next_n = min_n;
            let next_d2 = min_d2;
            if (min_n == ptsLength - 1) {
                next_n = min_n - 1;
                next_d2 = canvas.getDistance2(head.x, head.y,
                    bot.pts[next_n].x, bot.pts[next_n].y);
            } else {
                let d2m = canvas.getDistance2(head.x, head.y,
                    bot.pts[min_n - 1].x, bot.pts[min_n - 1].y);
                let d2p = canvas.getDistance2(head.x, head.y,
                    bot.pts[min_n + 1].x, bot.pts[min_n + 1].y);
                if (d2m < d2p) {
                    next_n = min_n - 1;
                    next_d2 = d2m;
                } else {
                    next_n = min_n + 1;
                    next_d2 = d2p;
                }
            }

            // compute approximation
            let t2 = bot.pts[min_n].len - bot.pts[next_n].len;
            t2 *= t2;

            if (t2 == 0) {
                return bot.pts[min_n].len;
            } else {
                let min_w = t2 - (min_d2 - next_d2);
                let next_w = t2 + (min_d2 - next_d2);
                return (bot.pts[min_n].len * min_w + bot.pts[next_n].len * next_w) / (2 * t2);
            }
        },

        bodyDangerZone: function (
            offset, targetPoint, targetPointNormal, closePointDist, pastTargetPoint, closePoint) {
            var head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };
            const o = bot.opt.followCircleDirection;
            var pts = [
                {
                    x: head.x - o * offset * bot.sin,
                    y: head.y + o * offset * bot.cos
                },
                {
                    x: head.x + bot.snakeWidth * bot.cos +
                        offset * (bot.cos - o * bot.sin),
                    y: head.y + bot.snakeWidth * bot.sin +
                        offset * (bot.sin + o * bot.cos)
                },
                {
                    x: head.x + 1.75 * bot.snakeWidth * bot.cos +
                        o * 0.3 * bot.snakeWidth * bot.sin +
                        offset * (bot.cos - o * bot.sin),
                    y: head.y + 1.75 * bot.snakeWidth * bot.sin -
                        o * 0.3 * bot.snakeWidth * bot.cos +
                        offset * (bot.sin + o * bot.cos)
                },
                {
                    x: head.x + 2.5 * bot.snakeWidth * bot.cos +
                        o * 0.7 * bot.snakeWidth * bot.sin +
                        offset * (bot.cos - o * bot.sin),
                    y: head.y + 2.5 * bot.snakeWidth * bot.sin -
                        o * 0.7 * bot.snakeWidth * bot.cos +
                        offset * (bot.sin + o * bot.cos)
                },
                {
                    x: head.x + 3 * bot.snakeWidth * bot.cos +
                        o * 1.2 * bot.snakeWidth * bot.sin +
                        offset * bot.cos,
                    y: head.y + 3 * bot.snakeWidth * bot.sin -
                        o * 1.2 * bot.snakeWidth * bot.cos +
                        offset * bot.sin
                },
                {
                    x: targetPoint.x +
                        targetPointNormal.x * (offset + 0.5 * Math.max(closePointDist, 0)),
                    y: targetPoint.y +
                        targetPointNormal.y * (offset + 0.5 * Math.max(closePointDist, 0))
                },
                {
                    x: pastTargetPoint.x + targetPointNormal.x * offset,
                    y: pastTargetPoint.y + targetPointNormal.y * offset
                },
                pastTargetPoint,
                targetPoint,
                closePoint
            ];
            pts = canvas.convexHull(pts);
            var poly = {
                pts: pts
            };
            poly = canvas.addPolyBox(poly);
            return (poly);
        },

        followCircleSelf: function () {

            bot.populatePts();
            bot.determineCircleDirection();
            const o = bot.opt.followCircleDirection;


            // exit if too short
            if (bot.len < 9 * bot.snakeWidth) {
                return;
            }

            var head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };

            let closePointT = bot.closestBodyPoint();
            let closePoint = bot.smoothPoint(closePointT);

            // approx tangent and normal vectors and closePoint
            var closePointNext = bot.smoothPoint(closePointT - bot.snakeWidth);
            var closePointTangent = canvas.unitVector({
                x: closePointNext.x - closePoint.x,
                y: closePointNext.y - closePoint.y});
            var closePointNormal = {
                x: - o * closePointTangent.y,
                y:   o * closePointTangent.x
            };

            // angle wrt closePointTangent
            var currentCourse = Math.asin(Math.max(
                -1, Math.min(1, bot.cos * closePointNormal.x + bot.sin * closePointNormal.y)));

            // compute (oriented) distance from the body at closePointDist
            var closePointDist = (head.x - closePoint.x) * closePointNormal.x +
                (head.y - closePoint.y) * closePointNormal.y;

            // construct polygon for snake inside
            var insidePolygonStartT = 5 * bot.snakeWidth;
            var insidePolygonEndT = closePointT + 5 * bot.snakeWidth;
            var insidePolygonPts = [
                bot.smoothPoint(insidePolygonEndT),
                bot.smoothPoint(insidePolygonStartT)
            ];
            for (let t = insidePolygonStartT; t < insidePolygonEndT; t += bot.snakeWidth) {
                insidePolygonPts.push(bot.smoothPoint(t));
            }

            var insidePolygon = canvas.addPolyBox({
                pts: insidePolygonPts
            });

            // get target point; this is an estimate where we land if we hurry
            var targetPointT = closePointT;
            var targetPointFar = 0.0;
            let targetPointStep = bot.snakeWidth / 64;
            for (let h = closePointDist, a = currentCourse; h >= 0.125 * bot.snakeWidth; ) {
                targetPointT -= targetPointStep;
                targetPointFar += targetPointStep * Math.cos(a);
                h += targetPointStep * Math.sin(a);
                a = Math.max(-Math.PI / 4, a - targetPointStep / bot.snakeWidth);
            }

            var targetPoint = bot.smoothPoint(targetPointT);

            var pastTargetPointT = targetPointT - 3 * bot.snakeWidth;
            var pastTargetPoint = bot.smoothPoint(pastTargetPointT);

            // look for danger from enemies
            var enemyBodyOffsetDelta = 0.25 * bot.snakeWidth;
            var enemyHeadDist2 = 64 * 64 * bot.snakeWidth * bot.snakeWidth;
            for (let snake = 0, snakesNum = window.snakes.length; snake < snakesNum; snake++) {
                if (window.snakes[snake].id !== window.snake.id
                    && window.snakes[snake].alive_amt === 1) {
                    let enemyHead = {
                        x: window.snakes[snake].xx + window.snakes[snake].fx,
                        y: window.snakes[snake].yy + window.snakes[snake].fy
                    };
                    let enemyAhead = {
                        x: enemyHead.x +
                            Math.cos(window.snakes[snake].ang) * bot.snakeWidth,
                        y: enemyHead.y +
                            Math.sin(window.snakes[snake].ang) * bot.snakeWidth
                    };
                    // heads
                    if (!canvas.pointInPoly(enemyHead, insidePolygon)) {
                        enemyHeadDist2 = Math.min(
                            enemyHeadDist2,
                            canvas.getDistance2(enemyHead.x,  enemyHead.y,
                                targetPoint.x, targetPoint.y),
                            canvas.getDistance2(enemyAhead.x, enemyAhead.y,
                                targetPoint.x, targetPoint.y)
                            );
                    }
                    // bodies
                    let offsetSet = false;
                    let offset = 0.0;
                    let cpolbody = {};
                    for (let pts = 0, ptsNum = window.snakes[snake].pts.length;
                        pts < ptsNum; pts++) {
                        if (!window.snakes[snake].pts[pts].dying) {
                            let point = {
                                x: window.snakes[snake].pts[pts].xx +
                                   window.snakes[snake].pts[pts].fx,
                                y: window.snakes[snake].pts[pts].yy +
                                   window.snakes[snake].pts[pts].fy
                            };
                            while (!offsetSet || (enemyBodyOffsetDelta >= -bot.snakeWidth
                                && canvas.pointInPoly(point, cpolbody))) {
                                if (!offsetSet) {
                                    offsetSet = true;
                                } else {
                                    enemyBodyOffsetDelta -= 0.0625 * bot.snakeWidth;
                                }
                                offset = 0.5 * (bot.snakeWidth +
                                    bot.getSnakeWidth(window.snakes[snake].sc)) +
                                    enemyBodyOffsetDelta;
                                cpolbody = bot.bodyDangerZone(
                                    offset, targetPoint, closePointNormal, closePointDist,
                                    pastTargetPoint, closePoint);

                            }
                        }
                    }
                }
            }
            var enemyHeadDist = Math.sqrt(enemyHeadDist2);

            // plot inside polygon
            if (window.visualDebugging) {
                for (let p = 0, l = insidePolygon.pts.length; p < l; p++) {
                    let q = p + 1;
                    if (q == l) {
                        q = 0;
                    }
                    canvas.drawLine(
                        {x: insidePolygon.pts[p].x, y: insidePolygon.pts[p].y},
                        {x: insidePolygon.pts[q].x, y: insidePolygon.pts[q].y},
                        'orange');
                }
            }

            // mark closePoint
            if (window.visualDebugging) {
                canvas.drawCircle(canvas.circle(
                    closePoint.x,
                    closePoint.y,
                    bot.snakeWidth * 0.25
                ), 'white', false);
            }

            // mark safeZone
            if (window.visualDebugging) {
                canvas.drawCircle(canvas.circle(
                    targetPoint.x,
                    targetPoint.y,
                    bot.snakeWidth + 2 * targetPointFar
                ), 'white', false);
                canvas.drawCircle(canvas.circle(
                    targetPoint.x,
                    targetPoint.y,
                    0.2 * bot.snakeWidth
                ), 'white', false);
            }

            // draw sample cpolbody
            if (window.visualDebugging) {
                let soffset = 0.5 * bot.snakeWidth;
                let scpolbody = bot.bodyDangerZone(
                    soffset, targetPoint, closePointNormal,
                    closePointDist, pastTargetPoint, closePoint);
                for (let p = 0, l = scpolbody.pts.length; p < l; p++) {
                    let q = p + 1;
                    if (q == l) {
                        q = 0;
                    }
                    canvas.drawLine(
                        {x: scpolbody.pts[p].x, y: scpolbody.pts[p].y},
                        {x: scpolbody.pts[q].x, y: scpolbody.pts[q].y},
                        'white');
                }
            }

            // TAKE ACTION

            // expand?
            let targetCourse = currentCourse + 0.25;
            // enemy head nearby?
            let headProx = -1.0 - (2 * targetPointFar - enemyHeadDist) / bot.snakeWidth;
            if (headProx > 0) {
                headProx = 0.125 * headProx * headProx;
            } else {
                headProx = - 0.5 * headProx * headProx;
            }
            targetCourse = Math.min(targetCourse, headProx);
            // enemy body nearby?
            targetCourse = Math.min(
                targetCourse, targetCourse + (enemyBodyOffsetDelta - 0.0625 * bot.snakeWidth) /
                bot.snakeWidth);
            // small tail?
            var tailBehind = bot.len - closePointT;
            var targetDir = canvas.unitVector({
                x: bot.opt.followCircleTarget.x - head.x,
                y: bot.opt.followCircleTarget.y - head.y
            });
            var driftQ = targetDir.x * closePointNormal.x + targetDir.y * closePointNormal.y;
            var allowTail = bot.snakeWidth * (2 - 0.5 * driftQ);
            // a line in the direction of the target point
            if (window.visualDebugging) {
                canvas.drawLine(
                    { x: head.x, y: head.y },
                    { x: head.x + allowTail * targetDir.x, y: head.y + allowTail * targetDir.y },
                    'red');
            }
            targetCourse = Math.min(
                targetCourse,
                (tailBehind - allowTail + (bot.snakeWidth - closePointDist)) /
                bot.snakeWidth);
            // far away?
            targetCourse = Math.min(
                targetCourse, - 0.5 * (closePointDist - 4 * bot.snakeWidth) / bot.snakeWidth);
            // final corrections
            // too fast in?
            targetCourse = Math.max(targetCourse, -0.75 * closePointDist / bot.snakeWidth);
            // too fast out?
            targetCourse = Math.min(targetCourse, 1.0);

            var goalDir = {
                x: closePointTangent.x * Math.cos(targetCourse) -
                    o * closePointTangent.y * Math.sin(targetCourse),
                y: closePointTangent.y * Math.cos(targetCourse) +
                    o * closePointTangent.x * Math.sin(targetCourse)
            };
            var goal = {
                x: head.x + goalDir.x * 4 * bot.snakeWidth,
                y: head.y + goalDir.y * 4 * bot.snakeWidth
            };


            if (window.goalCoordinates
                && Math.abs(goal.x - window.goalCoordinates.x) < 1000
                && Math.abs(goal.y - window.goalCoordinates.y) < 1000) {
                window.goalCoordinates = {
                    x: Math.round(goal.x * 0.25 + window.goalCoordinates.x * 0.75),
                    y: Math.round(goal.y * 0.25 + window.goalCoordinates.y * 0.75)
                };
            } else {
                window.goalCoordinates = {
                    x: Math.round(goal.x),
                    y: Math.round(goal.y)
                };
            }

            canvas.setMouseCoordinates(canvas.mapToMouse(window.goalCoordinates));
        },

        // Sorting by property 'score' descending
        sortScore: function (a, b) {
            return b.score - a.score;
        },

        // Sorting by property 'sz' descending
        sortSz: function (a, b) {
            return b.sz - a.sz;
        },

        // Sorting by property 'distance' ascending
        sortDistance: function (a, b) {
            return a.distance - b.distance;
        },

        computeFoodGoal: function () {
            bot.foodAngles = [];

            for (var i = 0; i < window.foods.length && window.foods[i] !== null; i++) {
                var f = window.foods[i];

                if (!f.eaten &&
                    !(
                        canvas.circleIntersect(
                            canvas.circle(f.xx, f.yy, 2),
                            bot.sidecircle_l) ||
                        canvas.circleIntersect(
                            canvas.circle(f.xx, f.yy, 2),
                            bot.sidecircle_r))) {
                    bot.addFoodAngle(f);
                }
            }

            bot.foodAngles.sort(bot.sortScore);

            if (bot.foodAngles[0] !== undefined && bot.foodAngles[0].sz > 0) {
                bot.currentFood = { x: bot.foodAngles[0].x,
                                    y: bot.foodAngles[0].y,
                                    sz: bot.foodAngles[0].sz,
                                    da: bot.foodAngles[0].da };
            } else {
                bot.currentFood = { x: bot.MID_X, y: bot.MID_Y, sz: 0 };
            }
        },

        foodAccel: function () {
            var aIndex = 0;

            if (bot.currentFood && bot.currentFood.sz > bot.opt.foodAccelSz) {
                aIndex = bot.getAngleIndex(bot.currentFood.ang);

                if (
                    bot.collisionAngles[aIndex] && bot.collisionAngles[aIndex].distance >
                    bot.currentFood.distance + bot.snakeRadius * bot.opt.radiusMult
                    && bot.currentFood.da < bot.opt.foodAccelDa) {
                    return 1;
                }

                if (bot.collisionAngles[aIndex] === undefined
                    && bot.currentFood.da < bot.opt.foodAccelDa) {
                    return 1;
                }
            }

            return bot.defaultAccel;
        },

        toCircle: function () {
            for (var i = 0; i < window.snake.pts.length && window.snake.pts[i].dying; i++);
            const o = bot.opt.followCircleDirection;
            var tailCircle = canvas.circle(
                window.snake.pts[i].xx,
                window.snake.pts[i].yy,
                bot.headCircle.radius
            );

            if (window.visualDebugging) {
                canvas.drawCircle(tailCircle, 'blue', false);
            }

            window.setAcceleration(bot.defaultAccel);
            bot.changeHeadingRel(o * Math.PI / 32);

            if (canvas.circleIntersect(bot.headCircle, tailCircle)) {
                bot.stage = 'circle';
            }
        },

        every: function () {
            bot.MID_X = window.grd;
            bot.MID_Y = window.grd;
            bot.MAP_R = window.grd * 0.98;
            bot.MAXARC = (2 * Math.PI) / bot.opt.arcSize;

            if (bot.opt.followCircleTarget === undefined) {
                bot.opt.followCircleTarget = {
                    x: bot.MID_X,
                    y: bot.MID_Y
                };
            }

            bot.sectorBoxSide = Math.floor(Math.sqrt(window.sectors.length)) * window.sector_size;
            bot.sectorBox = canvas.rect(
                window.snake.xx - (bot.sectorBoxSide / 2),
                window.snake.yy - (bot.sectorBoxSide / 2),
                bot.sectorBoxSide, bot.sectorBoxSide);
            // if (window.visualDebugging) canvas.drawRect(bot.sectorBox, '#c0c0c0', true, 0.1);

            bot.cos = Math.cos(window.snake.ang);
            bot.sin = Math.sin(window.snake.ang);

            bot.speedMult = window.snake.sp / bot.opt.speedBase;
            bot.snakeRadius = bot.getSnakeWidth() / 2;
            bot.snakeWidth = bot.getSnakeWidth();
            bot.snakeLength = Math.floor(15 * (window.fpsls[window.snake.sct] + window.snake.fam /
                window.fmlts[window.snake.sct] - 1) - 5);

            bot.headCircle = canvas.circle(
                window.snake.xx + bot.cos * Math.min(1, bot.speedMult - 1) *
                bot.opt.radiusMult / 2 * bot.snakeRadius,
                window.snake.yy + bot.sin * Math.min(1, bot.speedMult - 1) *
                bot.opt.radiusMult / 2 * bot.snakeRadius,
                bot.opt.radiusMult / 2 * bot.snakeRadius
            );


            if (window.visualDebugging) {
                canvas.drawCircle(bot.headCircle, 'blue', false);
            }

            bot.sidecircle_r = canvas.circle(
                window.snake.lnp.xx -
                ((window.snake.lnp.yy + bot.sin * bot.snakeWidth) -
                    window.snake.lnp.yy),
                window.snake.lnp.yy +
                ((window.snake.lnp.xx + bot.cos * bot.snakeWidth) -
                    window.snake.lnp.xx),
                bot.snakeWidth * bot.speedMult
            );

            bot.sidecircle_l = canvas.circle(
                window.snake.lnp.xx +
                ((window.snake.lnp.yy + bot.sin * bot.snakeWidth) -
                    window.snake.lnp.yy),
                window.snake.lnp.yy -
                ((window.snake.lnp.xx + bot.cos * bot.snakeWidth) -
                    window.snake.lnp.xx),
                bot.snakeWidth * bot.speedMult
            );
        },

        // Main bot
        go: function () {
            bot.every();

            if (bot.snakeLength < bot.opt.followCircleLength) {
                bot.stage = 'grow';
            }

            if (bot.currentFood && bot.stage !== 'grow') {
                bot.currentFood = undefined;
            }

            if (bot.stage === 'circle') {
                window.setAcceleration(bot.defaultAccel);
                bot.followCircleSelf();
            } else if (bot.checkCollision() || bot.checkEncircle()) {
                if (bot.actionTimeout) {
                    window.clearTimeout(bot.actionTimeout);
                    bot.actionTimeout = window.setTimeout(
                        bot.actionTimer, 1000 / bot.opt.targetFps * bot.opt.collisionDelay);
                }
            } else {
                if (bot.snakeLength > bot.opt.followCircleLength) {
                    bot.stage = 'tocircle';
                }
                if (bot.actionTimeout === undefined) {
                    bot.actionTimeout = window.setTimeout(
                        bot.actionTimer, 1000 / bot.opt.targetFps * bot.opt.actionFrames);
                }
                window.setAcceleration(bot.foodAccel());
            }
        },

        // Timer version of food check
        actionTimer: function () {
            if (window.playing && window.snake !== null && window.snake.alive_amt === 1) {
                if (bot.stage === 'grow') {
                    bot.computeFoodGoal();
                    window.goalCoordinates = bot.currentFood;
                    canvas.setMouseCoordinates(canvas.mapToMouse(window.goalCoordinates));
                } else if (bot.stage === 'tocircle') {
                    bot.toCircle();
                }
            }
            bot.actionTimeout = undefined;
        }
    };
})(window);

var userInterface = window.userInterface = (function (window, document) {
    // Save the original slither.io functions so we can modify them, or reenable them later.
    var original_keydown = document.onkeydown;
    var original_onmouseDown = window.onmousedown;
    var original_oef = window.oef;
    var original_redraw = window.redraw;
    var original_onmousemove = window.onmousemove;

    window.oef = function () { };
    window.redraw = function () { };

    return {
        overlays: {},
        gfxEnabled: true,

        initServerIp: function () {
            var parent = document.getElementById('playh');
            var serverDiv = document.createElement('div');
            var serverIn = document.createElement('input');

            serverDiv.style.width = '244px';
            serverDiv.style.margin = '-0px auto';
            serverDiv.style.boxShadow = 'rgb(255, 207, 135) 0px 5px 50px';
            serverDiv.style.opacity = 1;
            serverDiv.style.background = 'rgb(0, 0, 0)';
            serverDiv.className = 'taho';
            serverDiv.style.display = 'block';

            serverIn.className = 'sumsginp';
            serverIn.placeholder = '⚡️Digite manualmente o ip⚡️';
            serverIn.maxLength = 21;
            serverIn.style.width = '220px';
            serverIn.style.height = '24px';

            serverDiv.appendChild(serverIn);
            parent.appendChild(serverDiv);

            userInterface.server = serverIn;
        },

        initOverlays: function () {
            var botOverlay = document.createElement('div');
            botOverlay.style.position = 'fixed';
            botOverlay.style.right = '5px';
            botOverlay.style.bottom = '215px';
            botOverlay.style.width = '150px';
            botOverlay.style.height = '85px';
            // botOverlay.style.background = 'rgba(7, 249, 229)';
            botOverlay.style.color = '#ffffff';
            botOverlay.style.fontFamily = 'Consolas, Verdana';
            botOverlay.style.zIndex = 999;
            botOverlay.style.fontSize = '12px';
            botOverlay.style.padding = '5px';
            botOverlay.style.borderRadius = '5px';
            botOverlay.className = 'nsi';
            document.body.appendChild(botOverlay);

            var serverOverlay = document.createElement('div');
            serverOverlay.style.position = 'fixed';
            serverOverlay.style.right = '5px';
            serverOverlay.style.bottom = '5px';
            serverOverlay.style.width = '160px';
            serverOverlay.style.height = '14px';
            serverOverlay.style.color = '#00FFFF';
            serverOverlay.style.fontFamily = 'Consolas, Verdana';
            serverOverlay.style.zIndex = 999;
            serverOverlay.style.fontSize = '14px';
            serverOverlay.className = 'nsi';
            document.body.appendChild(serverOverlay);

            var prefOverlay = document.createElement('div');
            prefOverlay.style.position = 'fixed';
            prefOverlay.style.left = '10px';
            prefOverlay.style.top = '25px';
            prefOverlay.style.width = '360px';
            prefOverlay.style.height = '400px';
            // prefOverlay.style.background = 'rgba(7, 249, 229)';
            prefOverlay.style.color = '#C0C0C0';
            prefOverlay.style.fontFamily = 'Consolas, Verdana';
            prefOverlay.style.zIndex = 999;
            prefOverlay.style.fontSize = '12px';
            prefOverlay.style.padding = '5px';
            prefOverlay.style.borderRadius = '5px';
            prefOverlay.className = 'nsi';
            document.body.appendChild(prefOverlay);

            var statsOverlay = document.createElement('div');
            statsOverlay.style.position = 'fixed';
            statsOverlay.style.left = '10px';
            statsOverlay.style.top = '295px';
            statsOverlay.style.width = '140px';
            statsOverlay.style.height = '210px';
            // statsOverlay.style.background = 'rgba(7, 249, 229)';
            statsOverlay.style.color = '#00fce7';
            statsOverlay.style.fontFamily = 'Consolas, Verdana';
            statsOverlay.style.zIndex = 998;
            statsOverlay.style.fontSize = '14px';
            statsOverlay.style.padding = '5px';
            statsOverlay.style.borderRadius = '5px';
            statsOverlay.className = 'nsi';
            document.body.appendChild(statsOverlay);

            userInterface.overlays.botOverlay = botOverlay;
            userInterface.overlays.serverOverlay = serverOverlay;
            userInterface.overlays.prefOverlay = prefOverlay;
            userInterface.overlays.statsOverlay = statsOverlay;
        },

        toggleOverlays: function () {
            Object.keys(userInterface.overlays).forEach(function (okey) {
                var oVis = userInterface.overlays[okey].style.visibility !== 'hidden' ?
                    'hidden' : 'visible';
                userInterface.overlays[okey].style.visibility = oVis;
                window.visualDebugging = oVis === 'visible';
            });
        },


        toggleGfx: function () {
            if (userInterface.gfxEnabled) {
                var c = window.mc.getContext('2d');
                c.save();
                c.fillStyle = "#000000",
                c.fillRect(0, 0, window.mww, window.mhh),
                c.restore();

                var d = document.createElement('div');
                d.style.position = 'fixed';
                d.style.top = '50%';
                d.style.left = '50%';
                d.style.width = '200px';
                d.style.height = '60px';
                d.style.color = '#00fce7';
                d.style.fontFamily = 'Tahoma , Verdana';
                d.style.zIndex = 999;
                d.style.margin = '-30px 0 0 -100px';
                d.style.fontSize = '20px';
                d.style.textAlign = 'center';
                d.className = 'nsi';
                document.body.appendChild(d);
                userInterface.gfxOverlay = d;

                window.lbf.innerHTML = '';
            } else {
                document.body.removeChild(userInterface.gfxOverlay);
                userInterface.gfxOverlay = undefined;
            }

            userInterface.gfxEnabled = !userInterface.gfxEnabled;
        },

        // Save variable to local storage
        savePreference: function (item, value) {
            window.localStorage.setItem(item, value);
            userInterface.onPrefChange();
        },

        // Load a variable from local storage
        loadPreference: function (preference, defaultVar) {
            var savedItem = window.localStorage.getItem(preference);
            if (savedItem !== null) {
                if (savedItem === 'true') {
                    window[preference] = true;
                } else if (savedItem === 'false') {
                    window[preference] = false;
                } else {
                    window[preference] = savedItem;
                }
                window.log('Setting found for ' + preference + ': ' + window[preference]);
            } else {
                window[preference] = defaultVar;
                window.log('No setting found for ' + preference +
                    '. Used default: ' + window[preference]);
            }
            userInterface.onPrefChange();
            return window[preference];
        },

        // Saves username when you click on "Play" button
        playButtonClickListener: function () {
            userInterface.saveNick();
            userInterface.loadPreference('autoRespawn', false);
            userInterface.onPrefChange();

            if (userInterface.server.value) {
                let s = userInterface.server.value.split(':');
                if (s.length === 2) {
                    window.force_ip = s[0];
                    window.force_port = s[1];
                    bot.connect();
                }
            } else {
                window.force_ip = undefined;
                window.force_port = undefined;
            }
        },

        // Preserve nickname
        saveNick: function () {
            var nick = document.getElementById('nick').value;
            userInterface.savePreference('savedNick', nick);
        },

        // Hide top score
        hideTop: function () {
            var nsidivs = document.querySelectorAll('div.nsi');
            for (var i = 0; i < nsidivs.length; i++) {
                if (nsidivs[i].style.top === '4px' && nsidivs[i].style.width === '300px') {
                    nsidivs[i].style.visibility = 'hidden';
                    bot.isTopHidden = true;
                    window.topscore = nsidivs[i];
                }
            }
        },

        // Store FPS data
        framesPerSecond: {
            fps: 0,
            fpsTimer: function () {
                if (window.playing && window.fps && window.lrd_mtm) {
                    if (Date.now() - window.lrd_mtm > 970) {
                        userInterface.framesPerSecond.fps = window.fps;
                    }
                }
            }
        },


        onkeydown: function (e) {
            // Original slither.io onkeydown function + whatever is under it
            original_keydown(e);
            if (window.playing) {
                // Letter `T` to toggle bot
                if (e.keyCode === 84) {
                    bot.isBotEnabled = !bot.isBotEnabled;
                }
                // Letter 'U' to toggle debugging (console)
                if (e.keyCode === 85) {
                    window.logDebugging = !window.logDebugging;
                    console.log('Log debugging set to: ' + window.logDebugging);
                    userInterface.savePreference('logDebugging', window.logDebugging);
                }
                // Letter 'Y' to toggle debugging (visual)
                if (e.keyCode === 89) {
                    window.visualDebugging = !window.visualDebugging;
                    console.log('Visual debugging set to: ' + window.visualDebugging);
                    userInterface.savePreference('visualDebugging', window.visualDebugging);
                }
                // Letter 'I' to toggle autorespawn
                if (e.keyCode === 73) {
                    window.autoRespawn = !window.autoRespawn;
                    console.log('Automatic Respawning set to: ' + window.autoRespawn);
                    userInterface.savePreference('autoRespawn', window.autoRespawn);
                }
                // Letter 'H' to toggle hidden mode
                if (e.keyCode === 72) {
                    userInterface.toggleOverlays();
                }
                // Letter 'G' to toggle graphics
                if (e.keyCode === 71) {
                    userInterface.toggleGfx();
                }
                // Letter 'O' to change rendermode (visual)
                if (e.keyCode === 79) {
                    userInterface.toggleMobileRendering(!window.mobileRender);
                }
                // Letter 'A' to increase collision detection radius
                if (e.keyCode === 65) {
                    bot.opt.radiusMult++;
                    console.log(
                        'radiusMult set to: ' + bot.opt.radiusMult);
                }
                // Letter 'S' to decrease collision detection radius
                if (e.keyCode === 83) {
                    if (bot.opt.radiusMult > 1) {
                        bot.opt.radiusMult--;
                        console.log(
                            'radiusMult set to: ' +
                            bot.opt.radiusMult);
                    }
                }
                // Letter 'Z' to reset zoom
                if (e.keyCode === 90) {
                    canvas.resetZoom();
                }
                // Letter 'Q' to quit to main menu
                if (e.keyCode === 81) {
                    window.autoRespawn = false;
                    userInterface.quit();
                }
                // 'ESC' to quickly respawn
                if (e.keyCode === 27) {
                    bot.quickRespawn();
                }
                userInterface.onPrefChange();
            }
        },

        onmousedown: function (e) {
            if (window.playing) {
                switch (e.which) {
                    // "Left click" to manually speed up the slither
                    case 1:
                        bot.defaultAccel = 1;
                        if (!bot.isBotEnabled) {
                            original_onmouseDown(e);
                        }
                        break;
                    // "Right click" to toggle bot in addition to the letter "T"
                    case 3:
                        bot.isBotEnabled = !bot.isBotEnabled;
                        break;
                }
            } else {
                original_onmouseDown(e);
            }
            userInterface.onPrefChange();
        },

        onmouseup: function () {
            bot.defaultAccel = 0;
        },

        // Manual mobile rendering
        toggleMobileRendering: function (mobileRendering) {
            window.mobileRender = mobileRendering;
            window.log('Mobile rendering set to: ' + window.mobileRender);
            userInterface.savePreference('mobileRender', window.mobileRender);
            // Set render mode
            if (window.mobileRender) {
                window.render_mode = 1;
                window.want_quality = 0;
                window.high_quality = false;
            } else {
                window.render_mode = 2;
                window.want_quality = 1;
                window.high_quality = true;
            }
        },

        // Update stats overlay.
        updateStats: function () {
            var oContent = [];
            var median;

            if (bot.scores.length === 0) return;

            median = Math.round((bot.scores[Math.floor((bot.scores.length - 1) / 2)] +
                bot.scores[Math.ceil((bot.scores.length - 1) / 2)]) / 2);

            oContent.push('🎮suas jogadas: ' + bot.scores.length);
            oContent.push('a: ' + Math.round(
                bot.scores.reduce(function (a, b) { return a + b; }) / (bot.scores.length)) +
                ' m: ' + median);

            for (var i = 0; i < bot.scores.length && i < 10; i++) {
                oContent.push(i + 1 + '. ' + bot.scores[i]);
            }

            userInterface.overlays.statsOverlay.innerHTML = oContent.join('<br/>');
        },

        onPrefChange: function () {
            // Set static display options here.
            var oContent = [];
            var ht = userInterface.handleTextColor;

            oContent.push('version: ' + GM_info.script.version);
            oContent.push('🚨[T] Modo automático: ' + ht(bot.isBotEnabled));
            oContent.push('🚨[O] Modo simples skins: ' + ht(window.mobileRender));
            oContent.push('🚨[A/S] Raio de proteção: ' + bot.opt.radiusMult);
            oContent.push('🚨[I] Retorno automático: ' + ht(window.autoRespawn));
            oContent.push('🚨[Y] Mostar linhas inteligentes: ' + ht(window.visualDebugging));
            oContent.push('🚨[U] Ativa modo depurador: ' + ht(window.logDebugging));
            oContent.push('🚨[SCROLL] zoom');
            oContent.push('🚨[Z] reseta zoom');
            oContent.push('🚨[ESC] Morre e volta rapidamente');
            oContent.push('🚨[Q] Morre e volta ao menu');
            oContent.push('🚨[H] Oculta toda informação do mod');
            oContent.push('🚨[G] Mostra e oculta pontuação meio da tela');
            oContent.push('🚨 OBRIGADO POR USAR ESTE MOD');
            oContent.push('✌ PARA VER OS EMOJI INSTALE O - ( EMOJI KEYBOARD )');

            userInterface.overlays.prefOverlay.innerHTML = oContent.join('<br/>');
        },

        onFrameUpdate: function () {
            // Botstatus overlay
            if (window.playing && window.snake !== null) {
                let oContent = [];

                oContent.push('fps: ' + userInterface.framesPerSecond.fps);

                // Display the X and Y of the snake
                oContent.push('x: ' +
                    (Math.round(window.snake.xx) || 0) + ' y: ' +
                    (Math.round(window.snake.yy) || 0));

                if (window.goalCoordinates) {
                    oContent.push('target');
                    oContent.push('x: ' + window.goalCoordinates.x + ' y: ' +
                        window.goalCoordinates.y);
                    if (window.goalCoordinates.sz) {
                        oContent.push('sz: ' + window.goalCoordinates.sz);
                    }
                }

                userInterface.overlays.botOverlay.innerHTML = oContent.join('<br/>');

                if (userInterface.gfxOverlay) {
                    let gContent = [];

                    gContent.push('<b>' + window.snake.nk + '</b>');
                    gContent.push(bot.snakeLength);
                    gContent.push('[' + window.rank + '/' + window.snake_count + ']');

                    userInterface.gfxOverlay.innerHTML = gContent.join('<br/>');
                }

                if (window.bso !== undefined && userInterface.overlays.serverOverlay.innerHTML !==
                    window.bso.ip + ':' + window.bso.po) {
                    userInterface.overlays.serverOverlay.innerHTML =
                        window.bso.ip + ':' + window.bso.po;
                }
            }

            if (window.playing && window.visualDebugging) {
                // Only draw the goal when a bot has a goal.
                if (window.goalCoordinates && bot.isBotEnabled) {
                    var headCoord = { x: window.snake.xx, y: window.snake.yy };
                    canvas.drawLine(
                        headCoord,
                        window.goalCoordinates,
                        'green');
                    canvas.drawCircle(window.goalCoordinates, 'red', true);
                }
            }
        },

        oefTimer: function () {
            var start = Date.now();
            canvas.maintainZoom();
            original_oef();
            if (userInterface.gfxEnabled) {
                original_redraw();
            } else {
                window.visualDebugging = false;
            }

            if (window.playing && bot.isBotEnabled && window.snake !== null) {
                window.onmousemove = function () { };
                bot.isBotRunning = true;
                bot.go();
            } else if (bot.isBotEnabled && bot.isBotRunning) {
                bot.isBotRunning = false;

                if (window.lastscore && window.lastscore.childNodes[1]) {
                    bot.scores.push(parseInt(window.lastscore.childNodes[1].innerHTML));
                    bot.scores.sort(function (a, b) { return b - a; });
                    userInterface.updateStats();
                }

                if (window.autoRespawn) {
                    bot.connect();
                }
            }

            if (!bot.isBotEnabled || !bot.isBotRunning) {
                window.onmousemove = original_onmousemove;
            }

            userInterface.onFrameUpdate();

            if (!bot.isBotEnabled && !window.no_raf) {
                window.raf(userInterface.oefTimer);
            } else {
                setTimeout(
                    userInterface.oefTimer, (1000 / bot.opt.targetFps) - (Date.now() - start));
            }
        },

        // Quit to menu
        quit: function () {
            if (window.playing && window.resetGame) {
                window.want_close_socket = true;
                window.dead_mtm = 0;
                if (window.play_btn) {
                    window.play_btn.setEnabled(true);
                }
                window.resetGame();
            }
        },

        handleTextColor: function (enabled) {
            return '<span style=\"color:' +
                (enabled ? 'lime;\">Ativado✔️' : 'red;\">Desativado❌') + '</span>';
        }
    };
})(window, document);

// Main
(function (window, document) {
    window.play_btn.btnf.addEventListener('click', userInterface.playButtonClickListener);
    document.onkeydown = userInterface.onkeydown;
    window.onmousedown = userInterface.onmousedown;
    window.addEventListener('mouseup', userInterface.onmouseup);

    // Hide top score
    userInterface.hideTop();

    // force server
    userInterface.initServerIp();
    userInterface.server.addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            window.play_btn.btnf.click();
        }
    });

    // Overlays
    userInterface.initOverlays();

    // Load preferences
    userInterface.loadPreference('logDebugging', false);
    userInterface.loadPreference('visualDebugging', false);
    userInterface.loadPreference('autoRespawn', false);
    userInterface.loadPreference('mobileRender', false);
    window.nick.value = userInterface.loadPreference('savedNick', '😍 Ei: coloque seu NICK 😍');

    // Listener for mouse wheel scroll - used for setZoom function
    document.body.addEventListener('mousewheel', canvas.setZoom);
    document.body.addEventListener('DOMMouseScroll', canvas.setZoom);

    // Set render mode
    if (window.mobileRender) {
        userInterface.toggleMobileRendering(true);
    } else {
        userInterface.toggleMobileRendering(false);
    }

    // Unblocks all skins without the need for FB sharing.
    window.localStorage.setItem('edttsg', '1');

    // Remove social
    window.social.remove();

    // Maintain fps
    setInterval(userInterface.framesPerSecond.fpsTimer, 80);

    // Start!
    userInterface.oefTimer();
})(window, document);

// A partir daqui nova versão

(function(w) {
    var modVersion = "v0.0.4.7",
        renderMode = 2, // 3 - normal, 2 - optimized, 1 - simple (mobile)
        normalMode = false,
        gameFPS = null,
        positionHUD = null,
        ipHUD = null,
		scoreHUD = null,
        fpsHUD = null,
        styleHUD= boxShadow = 'rgb(0, 255, 255) 0px 1px 20px',
        styleHUD = "color: #00FFFF; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 14px; position: fixed; opacity: 1.00; z-index: 7;",
        inpNick = null,
        currentIP = null,
        retry = 0,
        bgImage = null,
		rotate = false,
		highScore = 0;
    function init() {
        // Append DIVs
        appendDiv("position-hud", "nsi", styleHUD + "right: 30; bottom: 120px;");
        appendDiv("ip-hud", "nsi", styleHUD + "right: 30; bottom: 150px;");
		appendDiv("score-hud", "nsi", styleHUD + "right: 30; bottom: 170px;");
        appendDiv("fps-hud", "nsi", styleHUD + "right: 30; bottom: 190px;");
        positionHUD = document.getElementById("position-hud");
        ipHUD = document.getElementById("ip-hud");
		scoreHUD = document.getElementById("score-hud");
        fpsHUD = document.getElementById("fps-hud");
         // Add zoom
        if (/firefox/i.test(navigator.userAgent)) {
            document.addEventListener("DOMMouseScroll", zoom, false);
        } else {
            document.body.onmousewheel = zoom;
        }
        // Keys
        w.addEventListener("keydown", function(e) {
			switch(e.keyCode) {
				// ESC - quick resp
				case 27: quickResp();
					break;
				// A - Auto skin rotator
				case 35:
					rotate = !rotate;
					rotateSkin();
					break;
				// Q - Quit to menu
				case 81: quit();
					break;
				// S - Change skin
				case 33: changeSkin();
					break;
				// Z - Reset zoom
				case 90: resetZoom();
					break;
			}
        }, false);
        // Hijack console log
        /*
        if (w.console) {
            w.console.logOld = console.log;
            w.console.log = getConsoleLog;
        }
        */
        // Set menu
        setMenu();
        // Set leaderboard
        setLeaderboard();
        // Set graphics
        setGraphics();
        // Update loop
        updateLoop();
        // Show FPS
        showFPS();
    }
    // Append DIV
    function appendDiv(id, className, style) {
        var div = document.createElement("div");
        if (id) {
            div.id = id;
        }
        if (className) {
            div.className = className;
        }
        if (style) {
            div.style = style;
        }
        document.body.appendChild(div);
    }
    // Zoom
    function zoom(e) {
        if (!w.gsc || !w.playing) {
            return;
        }
        w.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
    }
	// Reset zoom
	function resetZoom() {
		w.gsc = 0.9;
	}
    // Get console log
    function getConsoleLog(log) {
        //w.console.logOld(log);
        if (log.indexOf("FPS") != -1) {
            gameFPS = log;
        }
    }
    // Set menu
    function setMenu() {
        var login = document.getElementById("login");
        if (login) {
			// Unblock skins
			w.localStorage.setItem("edttsg", "1");
            // Load settings
            loadSettings();
            // Keys info
            var div = document.createElement("div");
            div.style.width = "300px";
            div.style.color = "#ff05f6";
            div.style.fontFamily = "'Lucida Sans Unicode', 'Lucida Grande', sans-serif";
            div.style.fontSize = "12px";
            div.style.textAlign = "center";
            div.style.opacity = "0.5";
            div.style.margin = "0 auto";
            div.style.padding = "20px 0";
            login.appendChild(div);
            // Menu container
            var sltMenu = document.createElement("div");
            sltMenu.style.width = "260px";
            sltMenu.style.color = "#ffcf87";
            sltMenu.style.borderRadius = "15px";
            sltMenu.style.fontFamily = "'Andallan Regular', 'Lucida Grande', sans-serif";
            sltMenu.style.fontSize = "24px";
            sltMenu.style.textAlign = "center";
            sltMenu.style.margin = "0 auto 10px auto";
            sltMenu.style.padding = "10px 14px";
            sltMenu.innerHTML = "⚡️CLA HARD⚡️</strong>";
            login.appendChild(sltMenu);
           // IP input container
            var div = document.createElement("div");
            div.style.color = "#000000";
            div.style.backgroundColor = "#000000";
            div.style.boxShadow = 'rgb(255, 207, 135) 0px 1px 20px';
            div.style.borderRadius = "29px";
            div.style.margin = "10 auto";
            div.style.padding = "8px";
            sltMenu.appendChild(div);
            // IP input
            var input = document.createElement("input");
            input.id = "server-ip";
            input.type = "text";
            input.placeholder = "O Servidor Aparece Aqui";
            input.style.height = "24px";
            input.style.display = "inline-block";
            input.style.background = "none";
            input.style.color = "#ffcf87";
            input.style.border = "none";
            input.style.outline = "none";
            div.appendChild(input);
            // Connect (Play) button
            var button = document.createElement("input");
            button.id = "connect-btn";
            button.type = "button";
            button.value = "IP OK";
            button.style.height = "24px";
            button.style.display = "inline-block";
            button.style.borderRadius = "12px";
            button.style.color = "#ffcf87";
            button.style.backgroundColor = "#000000";
            button.style.boxShadow = 'rgb(255, 207, 135) 0px 1px 10px';
            button.style.border = "none";
            button.style.outline = "none";
            button.style.cursor = "pointer";
            button.style.padding = "0 20px";
            div.appendChild(button);
            // Select server container
            var div = document.createElement("div");
            div.style.backgroundColor = "#000000";
            div.style.boxShadow = 'rgb(255, 207, 135) 0px 1px 20px';
            div.style.borderRadius = "29px";
            div.style.margin = "10 auto";
            div.style.padding = "8px";
            sltMenu.appendChild(div);
            // Select server
            var select = document.createElement("select");
            select.id = "select-srv";
            select.style.background = "#000000";
            select.style.border = "none";
            select.style.color = "#ffcf87";
            select.style.outline = "none";
            var option = document.createElement("option");
            option.value = "";
            option.text = "-- Selecione o servidor --";
            select.appendChild(option);
            div.appendChild(select);
            // Select graph container
            var div = document.createElement("div");
            div.style.backgroundColor = "#000000";
            div.style.boxShadow = 'rgb(255, 207, 135) 0px 1px 20px';
            div.style.borderRadius = "29px";
            div.style.margin = "10 auto";
            div.style.padding = "8px";
            sltMenu.appendChild(div);
            // Select graph
            var select = document.createElement("select");
            select.id = "select-graph";
            select.style.background = "#000000";
            select.style.border = "none";
            select.style.color = "#ffcf87";
            select.style.outline = "none";
            div.appendChild(select);
            var option = document.createElement("option");
            option.value = "3";
            option.text = "Grafico: alto";
            select.appendChild(option);
            var option = document.createElement("option");
            option.value = "2";
            option.text = "Grafico: médio";
            select.appendChild(option);
            var option = document.createElement("option");
            option.value = "1";
            option.text = "Grafico: baixo";
            select.appendChild(option);
            // Menu footer
            sltMenu.innerHTML += '<a href="https://discord.gg/MVENsZa" target="_blank" style="color: #ffcf87;">Discord</a> | ';
			sltMenu.innerHTML += '<a href="https://www.youtube.com/channel/UCu8cJvQ9ugAawGRycaXY4mA?view_as=subscriber" target="_blank" style="color: #ffcf87;">youtube</a>';
            // Get IP input
            inpIP = document.getElementById("server-ip");
            // Get nick
            var nick = document.getElementById("nick");
            nick.addEventListener("input", getNick, false);
            // Force connect
            var connectBtn = document.getElementById("connect-btn");
            connectBtn.onclick = forceConnect;
            // Get servers list
            getServersList();
            // Set graphic mode
            var selectGraph = document.getElementById("select-graph");
            if (renderMode == 1) {
                selectGraph.selectedIndex = 2;
            } else if (renderMode == 2) {
                selectGraph.selectedIndex = 1;
            } else {
                selectGraph.selectedIndex = 0;
                normalMode = true;
            }
            selectGraph.onchange = function() {
                var mode = selectGraph.value;
                if (mode) {
                    renderMode = mode;
                    w.localStorage.setItem("rendermode", renderMode);
                }
            };
            resizeView();
        } else {
            setTimeout(setMenu, 100);
        }
    }
    // Load settings
    function loadSettings() {
        if (w.localStorage.getItem("nick") != null) {
            var nick = w.localStorage.getItem("nick");
            document.getElementById("nick").value = nick;
        }
        if (w.localStorage.getItem("rendermode") != null) {
            var mode = parseInt(w.localStorage.getItem("rendermode"));
            if (mode >= 1 && mode <= 3) {
                renderMode = mode;
            }
        }
		if (w.localStorage.getItem("alta score") != null) {
            var score = parseFloat(w.localStorage.getItem("alta score"));
            if (score > 0) {
                highScore = score;
            }
        }
    }
    // Get nick
    function getNick() {
        var nick = document.getElementById("nick").value;
        w.localStorage.setItem("nick", nick);
    }
    // Connection status
    function connectionStatus() {
        if (!w.connecting || retry == 10) {
            w.forcing = false;
            retry = 0;
            return;
        }
        retry++;
        setTimeout(connectionStatus, 1000);
    }
    // Force connect
    function forceConnect() {
        if (inpIP.value.length == 0 || !w.connect) {
            return;
        }
        w.forcing = true;
        if (!w.bso) {
            w.bso = {};
        }
        var srv = inpIP.value.trim().split(":");
        w.bso.ip = srv[0];
        w.bso.po = srv[1];
        w.connect();
        setTimeout(connectionStatus, 1000);
    }
    // Get servers list
    function getServersList() {
        if (w.sos && w.sos.length > 0) {
            var selectSrv = document.getElementById("select-srv");
            for (var i = 0; i < sos.length; i++) {
                var srv = sos[i];
                var option = document.createElement("option");
                option.value = srv.ip + ":" + srv.po;
                option.text = (i + 1) + ". " + option.value;
                selectSrv.appendChild(option);
            }
            selectSrv.onchange = function() {
                var srv = selectSrv.value;
                inpIP.value = srv;
            };
        } else {
            setTimeout(getServersList, 100);
        }
    }
    // Resize view
    function resizeView() {
        if (w.resize) {
            w.lww = 0; // Reset width (force resize)
            w.wsu = 0; // Clear ad space
            w.resize();
            var wh = Math.ceil(w.innerHeight);
            if (wh < 800) {
                var login = document.getElementById("login");
                w.lgbsc = wh / 800;
                login.style.top = - (Math.round(wh * (1 - w.lgbsc) * 1E5) / 1E5) + "px";
                if (w.trf) {
                    w.trf(login, "scale(" + w.lgbsc + "," + w.lgbsc + ")");
                }
            }
        } else {
            setTimeout(resizeView, 100);
        }
    }
    // Set leaderboard
    function setLeaderboard() {
        if (w.lbh) {
            w.lbh.textContent = "[:::LISTA DOS TOPS 10:::]";
            w.lbh.style.fontSize = "15px";
        } else {
            setTimeout(setLeaderboard, 100);
        }
    }
    // Set normal mode
    function setNormalMode() {
        normalMode = true;
        w.ggbg = true;
        if (!w.bgp2 && bgImage) {
            w.bgp2 = bgImage;h
        }
        w.render_mode = 2;
    }
    // Set graphics
    function setGraphics() {
        if (renderMode == 3) {
            if (!normalMode) {
                setNormalMode();
            }
            return;
        }
        if (normalMode) {
            normalMode = false;
        }
        if (w.want_quality && w.want_quality != 0) {
            w.want_quality = 0;
            w.localStorage.setItem("qual", "0");
            w.grqi.src = "/s/lowquality.png";
        }
        if (w.ggbg && w.gbgmc) {
            w.ggbg = false;
        }
        if (w.bgp2) {
            bgImage = w.bgp2;
            w.bgp2 = null;
        }
        if (w.high_quality) {
            w.high_quality = false;
        }
        if (w.gla && w.gla != 0) {
            w.gla = 0;
        }
        if (w.render_mode && w.render_mode != renderMode) {
            w.render_mode = renderMode;
        }
    }
	// Quick resp
	function quickResp() {
        w.dead_mtm = 0;
        w.login_fr = 0;
		forceConnect();
	}
	// Quit to menu
	function quit() {
        if (w.playing && w.resetGame) {
            w.want_close_socket = true;
            w.dead_mtm = 0;
			if (w.play_btn) {
				w.play_btn.setEnabled(true);
			}
			w.resetGame();
        }
    }
	// Change skin
	function changeSkin() {
		if (w.playing && w.snake != null) {
			var skin = w.snake.rcv,
				max = w.max_skin_cv || 25;
			skin++;
			if (skin > max) {
				skin = 0;
			}
			w.setSkin(w.snake, skin);
		}
	}
	// Rotate skin
	function rotateSkin() {
		if (!rotate) {
			return;
		}
		changeSkin();
		setTimeout(rotateSkin, 500);
	}
	// Set high score
	function setHighScore() {
		if (!w.snake || !w.fpsls || !w.fmlts) {
			return;
		}
		var currentScore = Math.floor(150 * (w.fpsls[w.snake.sct] + w.snake.fam / w.fmlts[w.snake.sct] - 1) - 50) / 10;
		if (currentScore > highScore) {
			highScore = currentScore;
			w.localStorage.setItem("highscore", highScore);
		}
		if (scoreHUD && highScore > 0) {
			scoreHUD.textContent = "Sua pontuação: " + highScore;
		}
	}
    // Show FPS
    function showFPS() {
        if (w.playing && fpsHUD && w.fps && w.lrd_mtm) {
            if (Date.now() - w.lrd_mtm > 970) {
                fpsHUD.textContent = "FPS: " + w.fps;
            }
        }
        setTimeout(showFPS, 80);
    }
    // Update loop
    function updateLoop() {
        setGraphics();
		setHighScore();
        if (w.playing) {
            if (positionHUD) {
                positionHUD.textContent = "X: " + (~~w.view_xx || 0) + " Y: " + (~~w.view_yy || 0);
            }
            if (inpIP && w.bso && currentIP != w.bso.ip + ":" + w.bso.po) {
                currentIP = w.bso.ip + ":" + w.bso.po;
                inpIP.value = currentIP;
                if (ipHUD) {
                    ipHUD.textContent = "Servidor: " + currentIP;
                }
            }
        } else {
			positionHUD.textContent = "";
			fpsHUD.textContent = "";
		}
        setTimeout(updateLoop, 1000);
    }
    // Init
    init();
  // http://stackoverflow.com/a/9517879/3707721
// Inject a script into the current window context so it has access to the same variables
function injectScript(f) {
    var actualCode = '(' + f + ')();';
    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.body||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
}

/*
Wrap the global connect() function with our own logic.
Add a new event listener to count the number of "k" type messages over the socket
Conditionals are taken from de-minified game source.
*/
function addKills(){
    var oldconnect = window.connect;
    window.connect = function(){
        var res = oldconnect();
        try {
            // We have a server to connect to
            if (0 != sos.length){
                window.kills = 0;

                window.ws.addEventListener("message", function(b){
                    if (ws == this) {
                        var c = new Uint8Array(b.data);
                        // Logic from game.js. Pretty sure this is off-by-one.
                        if (2 <= c.length) {
                            var f = String.fromCharCode(c[2]);
                            if ("k" == f) {
                                window.kills ++;
                            }
                        }
                    }
                }, false)
            }
        } catch (e) {
            console.error("While adding killcount event listener, caught ", e);
        }
        return res;
    }

    // Wrap redraw so we can display the count
    var oldredraw = window.redraw;
    window.redraw = function(){
        oldredraw();
        // Conditional copied from game.js. Only periodically is the lbf display redrawn.
        if (window.animating) {
            window.lbf.innerHTML += '<br><span>Meu Deus você matou: ' + window.kills + '</span>';
        }
    }
    // Make space for it
    window.lbf.style.height = "50px";
}

injectScript(addKills);
})(window);