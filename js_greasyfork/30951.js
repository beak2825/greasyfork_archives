// ==UserScript==
// @name        OWOP Plot Bot
// @namespace   lol
// @description hax
// @version     1
// @author      Bela, modified by ucrain3
// @include     http://www.ourworldofpixels.com/*
// @run-at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/30951/OWOP%20Plot%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/30951/OWOP%20Plot%20Bot.meta.js
// ==/UserScript==
var lastcursorx = 0;
var lastcursory = 0;
var undefPut = true;
var canNext = true;
var offX = 0;
var offY = 0;
var tSkip = 30;
var lastMap = -1;
var randShuf = 1;
var randShufA = [1,3,17,15,33,63,31];
var randOffset = 0;
var randRev = 1;
var preRender = null;

var rArray = [
    0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,
    0xff,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
	0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
	0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
	0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,
    0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff
];
var gArray = [
    0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,
    0xff,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
	0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
	0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
	0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,
    0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff
];
var bArray = [
    0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,
    0xff,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
	0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
	0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
	0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x00,0xff,
    0xff,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,
    0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff
];

window.addEventListener('keyup', function(e)
{
    var key = e.keyCode || e.which;
    if(key == 90)
    {
        canNext = true;
    }
    else if(key == 87)
    {
        offY -= 1;
    }
    else if(key == 83)
    {
        offY += 1;
    }
    else if(key == 68)
    {
        offX += 1;
    }
    else if(key == 65)
    {
        offX -= 1;
    }
});

function loop()
{
    tSkip -= 1;
    if(tSkip < 0)
    {
        tSkip = 0;
    }
    if(!canNext || typeof socket == "undefined" || tSkip > 0)
    {
        return;
    }
    canNext = false;
    if(!undefPut || typeof put != "undefined")
    {
        if(preRender === null)
        {
            preRender = render;
            /**render = function()
            {
                if(document.hasFocus())
                {
                    render2();
                }
            };**/
            render = render2;
            for(var rgbFlip = 0; rgbFlip < 192; rgbFlip++)
            {
                rArray[192] = rArray[191];
                gArray[192] = gArray[191];
                bArray[192] = bArray[191];
            }
        }
        if(document.hasFocus())
        {
            GM_setValue("camx", camx);
            GM_setValue("camy", camy);
            GM_setValue("cursorx", cursorx);
            GM_setValue("cursory", cursory);
            GM_setValue("chnkx", chnkx);
            GM_setValue("chnky", chnky);
            GM_setValue("pixlx", pixlx);
            GM_setValue("pixly", pixly);
            GM_setValue("r", rgb[rgbn][0]);
            GM_setValue("g", rgb[rgbn][1]);
            GM_setValue("b", rgb[rgbn][2]);
        }
        if(true)
        {
            var maincamx = GM_getValue("camx");
            var maincamy = GM_getValue("camy");
            var maincursorx = GM_getValue("cursorx");
            var maincursory = GM_getValue("cursory");
            var mainchnkx = GM_getValue("chnkx");
            var mainchnky = GM_getValue("chnky");
            var mainpixlx = GM_getValue("pixlx");
            var mainpixly = GM_getValue("pixly");
            var randIndex = Math.ceil(visible.length * Math.random()) - 1;
            var theP = visible[randIndex];
            if(lastMap == -1)
            {
                lastMap = theP;
                randOffset = Math.ceil(Math.random() * 256) - 1;
                randRev = Math.ceil(Math.random() * 2) * 2 - 3;
                randShuf = randShufA[Math.ceil(randShufA.length * Math.random()) - 1];
            }
            theP = lastMap;
            if(theP === null || visible.indexOf(lastMap) == -1){lastMap = visible[randIndex];randOffset = Math.ceil(Math.random() * 256) - 1;randRev = Math.ceil(Math.random() * 2) * 2 - 3;randShuf = randShufA[Math.ceil(randShufA.length * Math.random()) - 1];canNext = true;return;}
            var poinP = map[theP];
            if(poinP === null || poinP === undefined){lastMap = visible[randIndex];randOffset = Math.ceil(Math.random() * 256) - 1;randRev = Math.ceil(Math.random() * 2) * 2 - 3;randShuf = randShufA[Math.ceil(randShufA.length * Math.random()) - 1];canNext = true;return;}
            if(camx != maincamx || camy != maincamy)
            {
                camx = maincamx;
                camy = maincamy;
                updatevisible();
            }
            cursorx = maincursorx + offX * 16;
            cursory = maincursory + offY * 16;
            chnkx = mainchnkx;
            chnky = mainchnky;
            pixlx = mainpixlx;
            pixly = mainpixly;
            var found = false;
            for(var inci = 0; inci < 256 && !found; inci++)
            {
                var inciP = inci;
                if(randRev == -1)
                {
                    inciP = 255-inciP;
                }
                var inc = (((inciP) + randOffset) * randShuf) % 256;
                if(poinP[0][inc * 3] !== rArray[inc] || poinP[0][inc * 3 + 1] !== gArray[inc] || poinP[0][inc * 3 + 2] !== bArray[inc])
                {
                    var b = theP.split(',').map(function(item) {
                        return parseInt(item, 10);
                    });
                    //console.log(b);
                    rgb[rgbn][0] = rArray[inc];
                    rgb[rgbn][1] = gArray[inc];
                    rgb[rgbn][2] = bArray[inc];
                    mainchnkx = chnkx = b[0];
                    mainchnky = chnky = b[1];
                    mainpixlx = pixlx = inc % 16;
                    mainpixly = pixly = Math.floor(inc / 16);
                    cursorx = mainchnkx * 256 + mainpixlx * 16;
                    cursory = mainchnky * 256 + mainpixly * 16;
                    found = true;
                }
            }
            if(!found)
            {
                lastMap = visible[randIndex];
                randOffset = Math.ceil(Math.random() * 256) - 1;
                randRev = Math.ceil(Math.random() * 2) * 2 - 3;
                randShuf = randShufA[Math.ceil(randShufA.length * Math.random()) - 1];
            }
            var xOffset = offX;
            var yOffset = offY;
            pixlx += xOffset;
            pixly += yOffset;
            if(pixlx > 15)
            {
                chnkx += Math.floor(pixlx / 16);
                pixlx = pixlx % 16;
            }
            if(pixly > 16)
            {
                chnky += Math.floor(pixly / 16);
                pixly = pixly % 16;
            }
            if(pixlx < 0)
            {
                chnkx -= Math.ceil(-pixlx / 16);
                pixlx = -(-pixlx % 16);
            }
            if(pixly < 0)
            {
                chnky -= Math.ceil(-pixly / 16);
                pixly = -(-pixly % 16);
            }
        }
        put2(0);
        undefPut = false;
        //clicking = true;
        //dragnpaint = true;
    }
    simulateKeyPress(90, true);
    simulateKeyPress(90, false);
}
setInterval(loop, 80);

function put2(btn){
	var ref = map[[chnkx, chnky]];
	if(socket.readyState != socket.OPEN || !ref) {return;};
	switch(tool){
		case 0:
			var paint = true;
			var sel = rgb[rgbn];
			switch(btn){
				case 1:
					var nrgb = new Uint8Array(
						[ref[0][(pixly * 16 + pixlx) * 3],
						ref[0][(pixly * 16 + pixlx) * 3 + 1],
						ref[0][(pixly * 16 + pixlx) * 3 + 2]]);
					var i = findrgb(nrgb);
					if(i == -1){
						rgbn = 0;
						rgb.unshift(nrgb);
					} else {
						rgbn = i;
					}
					paint = false;
					break;
				case 2:
					sel = [255, 255, 255];
					break;
			}
			if(paint && !(ref[0][(pixly * 16 + pixlx) * 3] == sel[0] &&
				ref[0][(pixly * 16 + pixlx) * 3 + 1] == sel[1] &&
				ref[0][(pixly * 16 + pixlx) * 3 + 2] == sel[2]) && pbuckt.canspend(1)){
				undos.push([cursorx >> 4, cursory >> 4, pixlx << 4 | pixly,
					ref[0][(pixly * 16 + pixlx) * 3],
					ref[0][(pixly * 16 + pixlx) * 3 + 1],
					ref[0][(pixly * 16 + pixlx) * 3 + 2]]);
				updatechunk(ref, pixlx, pixly, sel);
				var arr = new ArrayBuffer(11);
				var dv = new DataView(arr);
				dv.setInt32(0, cursorx >> 4, true);
				dv.setInt32(4, cursory >> 4, true);
				dv.setUint8(8, sel[0]);
				dv.setUint8(9, sel[1]);
				dv.setUint8(10, sel[2]);
				socket.send(arr);
			}
			break;
		case 2:
			var nrgb = new Uint8Array(
				[ref[0][(pixly * 16 + pixlx) * 3],
				ref[0][(pixly * 16 + pixlx) * 3 + 1],
				ref[0][(pixly * 16 + pixlx) * 3 + 2]]);
			var i = findrgb(nrgb);
			if(i == -1){
				rgbn = 0;
				rgb.unshift(nrgb);
			} else {
				rgbn = i;
			}
			break;

		case 3:
			var cl = false;
			for(var i = ref[0].length; i--;){
				if(ref[0][i] != 255){
					cl = true;
					break;
				}
			}
			if(cl){
				var arr = new ArrayBuffer(9);
				var dv = new DataView(arr);
				dv.setInt32(0, chnkx, true);
				dv.setInt32(4, chnky, true);
				dv.setUint8(8, 0);
				socket.send(arr);
			}
			break;
	}
}

function render2(){
    nt = Date.now();
    if(!document.hasFocus())
    {
        window.requestAnimationFrame(render);
        return;
    }
	ctx.save();
	ctx.transform(zoom, 0, 0, zoom, camx, camy);
	for(var i = visible.length; i--;){
		var pos = visible[i].split(',');
		if(pos in map){
			if(!map[pos][1]){
				map[pos][1] = renderchunk(map[pos][0]);
			}
			ctx.drawImage(map[pos][1], pos[0] << 8, pos[1] << 8);
		} else {
			ctx.beginPath();
			ctx.fillStyle = unloadedpat;
			ctx.rect(pos[0] << 8, pos[1] << 8, 256, 256);
			ctx.fill();
		}
	}
	ctx.lineWidth = 2.5;
	ctx.globalAlpha = .8;
	if([chnkx, chnky] in map){
		ctx.globalAlpha = .8;
		if(tool == 0){
			ctx.strokeStyle = "rgb(" + rgb[rgbn].join(',') + ")";
			ctx.strokeRect(~(~cursorx | 0xF), ~(~cursory | 0xF), 16, 16);
		} else if(tool == 3){
			ctx.strokeStyle = "#FFFFFF";
			ctx.strokeRect(~(~cursorx | 0xFF) + 1, ~(~cursory | 0xFF), 254, 255);
		}
	}
	for(var c in ppl){
		if(c != id){
			var pplx = ppl[c].getX();
			var pply = ppl[c].getY();
			if(!isvisible(pplx - 32, pply - 32, 64, 64))
				continue;
			var chxy = [pplx >> 8, pply >> 8];
			if(chxy in map){
				if(ppl[c].tool == 0){
					ctx.strokeStyle = "rgb(" + ppl[c].r + "," + ppl[c].g + "," + ppl[c].b + ")";
					ctx.strokeRect(~(~pplx | 0xF), ~(~pply | 0xF), 16, 16);
				} else if(ppl[c].tool == 2){
					ctx.globalAlpha = 1;
					var pxy = [pplx - (chxy[0] << 8) >> 4, pply - (chxy[1] << 8) >> 4];
					var m = map[chxy];
					var nrgb = [m[0][(pxy[1] * 16 + pxy[0]) * 3],
						m[0][(pxy[1] * 16 + pxy[0]) * 3 + 1],
						m[0][(pxy[1] * 16 + pxy[0]) * 3 + 2]];
					ctx.fillStyle = "rgb(" + nrgb.join(',') + ")";
					ctx.fillRect(pplx + .5, pply - 30.5, 8, 8);
					ctx.strokeStyle = "#4d313b";
					ctx.strokeRect(pplx - .5, pply - 31.5, 10, 10);
					ctx.strokeStyle = "#FFFFFF";
					ctx.lineWidth = 1;
					ctx.strokeRect(pplx - .5, pply - 31.5, 10, 10);
					ctx.lineWidth = 3.5;
				} else if(ppl[c].tool == 3){
					ctx.strokeStyle = "#FFFFFF";
					ctx.strokeRect(~(~pplx | 0xFF) + 1, ~(~pply | 0xFF), 254, 255);
				}
			}
		}
	}
	ctx.lineWidth = 1.75;
	for(var i = fx.length; i--;){
		if((ctx.globalAlpha = 1 + (fx[i][2] - nt) / 1000) <= 0){
			fx.splice(i, 1);
			continue;
		}
		if(fx[i].length == 4){
			ctx.strokeStyle = "rgb(" + ((fx[i][3] >> 16) & 0xFF) + "," + ((fx[i][3] >> 8) & 0xFF) + "," + (fx[i][3] & 0xFF) + ")";
			ctx.strokeRect(.5+(fx[i][0] << 4), .5+(fx[i][1] << 4), 15, 15);
		} else {
			ctx.strokeStyle = "#000000";
			ctx.strokeRect(.5+(fx[i][0] << 8), .5+(fx[i][1] << 8), 256, 256);
		}
	}
	ctx.globalAlpha = 1;
	ctx.strokeStyle = "#000000";
	for(var c in ppl){
		if(c != id){
			var pplx = ppl[c].getX();
			var pply = ppl[c].getY();
			if(!isvisible(pplx - 32, pply - 32, 64, 64))
				continue;
			ctx.drawImage(cur[ppl[c].tool][0], pplx + cur[ppl[c].tool][1], pply + cur[ppl[c].tool][2]);
			ctx.font = "10px sans-serif";
			var w = ctx.measureText(c.toString()).width + 8;
			var h = 10;
			var ofs = cur[ppl[c].tool][0].height + cur[ppl[c].tool][2];
			ctx.fillStyle = "#" + ppl[c].clr;
			ctx.fillRect(pplx, pply + ofs, w, h + 6);
			ctx.globalAlpha = 0.2;
			ctx.lineWidth = 3;
			ctx.strokeRect(pplx, pply + ofs, w, h + 6);
			ctx.globalAlpha = 1;
			drawtext(c.toString(), pplx + 4, pply + h + ofs + 2);
			ctx.font = "14px sans-serif";
		}
	}
	if([[chnkx, chnky]] in map && tool == 2){
		var ref = map[[chnkx, chnky]];
		var nrgb = new Uint8Array(
			[ref[0][(pixly * 16 + pixlx) * 3],
			ref[0][(pixly * 16 + pixlx) * 3 + 1],
			ref[0][(pixly * 16 + pixlx) * 3 + 2]]);
		ctx.fillStyle = "rgb(" + nrgb.join(',') + ")";
		ctx.fillRect(cursorx + .5, cursory - 30.5, 8, 8);
		ctx.strokeStyle = "#4d313b";
		ctx.lineWidth = 3.5;
		ctx.strokeRect(cursorx - .5, cursory - 31.5, 10, 10);
		ctx.strokeStyle = "#FFFFFF";
		ctx.lineWidth = 1;
		ctx.strokeRect(cursorx - .5, cursory - 31.5, 10, 10);
	}
	ctx.restore();
	ctx.strokeStyle = "#000000";
	/* Render windows */
	ctx.globalAlpha = 0.9;
	ctx.save();
	for(var x = 0; x < windows.length; x++){
		if(x == windows.length - 1)
			ctx.globalAlpha = 1;
		windows[x].render(ctx);
	}
	ctx.restore();
	var hudx = canvas.width - 40;
	var hudy = (canvas.height >> 1) - 16;
	ctx.fillStyle = "#DDDDDD";
	ctx.fillRect(hudx - 4, hudy - 4, 44, 40);
	ctx.fillStyle = "#888888";
	ctx.fillRect(hudx - 32, hudy + 4, 24, 24);
	ctx.globalAlpha = 0.2;
	ctx.strokeRect(hudx - 4, hudy - 4, 44, 40);
	ctx.strokeRect(hudx - 32, hudy + 4, 24, 24);
	ctx.globalAlpha = 1;
	ctx.strokeStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.moveTo(hudx - 20, hudy + 8);
	ctx.lineTo(hudx - 20, hudy + 24);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(hudx - 28, hudy + 16);
	ctx.lineTo(hudx - 12, hudy + 16);
	ctx.stroke();
	ctx.strokeStyle = "#000000";
	for(var j = rgbn + 1, i = 0; --j >= 0; --i){
		ctx.fillStyle = "rgb(" + rgb[j].join(',') + ")";
		ctx.fillRect(hudx, hudy - 40 * i, 32, 32);
		ctx.globalAlpha = 0.2;
		ctx.strokeRect(hudx, hudy - 40 * i, 32, 32);
		ctx.globalAlpha = 1;
	}
	for(var j = rgbn, i = 1; ++j < rgb.length; ++i){
		ctx.fillStyle = "rgb(" + rgb[j].join(',') + ")";
		ctx.fillRect(hudx, hudy - 40 * i, 32, 32);
		ctx.globalAlpha = 0.2;
		ctx.strokeRect(hudx, hudy - 40 * i, 32, 32);
		ctx.globalAlpha = 1;
	}
	ctx.fillStyle = "#444444";
	if(chatting){
		ctx.globalAlpha = .7;
		var maxw = 300;
		for(var i = chatlog.length, j = 0; i-- && j < 12; j++){
			maxw = Math.max(ctx.measureText(chatlog[i]).width, maxw);
		}
		maxw = Math.max(ctx.measureText("> " + chatstr).width, maxw);
		var h = chatlog.length;
		h = (h >= 12 ? 12 : h) + 1;
		ctx.fillRect(0, canvas.height - h * 16 - 8, maxw + 10, h * 16 + 16);
		ctx.globalAlpha = .2;
		ctx.lineWidth = 3;
		ctx.strokeRect(-1, canvas.height - h * 16 - 8, maxw + 10.5, h * 16 + 16);
		ctx.globalAlpha = .4;
		ctx.strokeRect(-1, canvas.height - 18, maxw + 10.5, 19);
		ctx.fillStyle = "#DDDDDD";
		ctx.fillRect(-1, canvas.height - 18, maxw + 10.5, 19);
		drawtext("> " + chatstr + (((nt >> 8) & 1) ? '_' : ''), 5, canvas.height - 5);
	}
	ctx.globalAlpha = 1;
	for(var i = chatlog.length, j = +chatting; i-- && j <= (chatting ? 12 : 6); j++){
		drawtext(chatlog[i], 5, canvas.height - j * 16 - 8);
	}
	var j = (nt - dt[0]) / 500;
	j = j >= 1 ? 1 : j <= 0 ? 0 : j;
	ctx.drawImage(drop, (canvas.width >> 1) - (drop.width >> 1), -drop.height + 14 + (drop.height - 14) * (dt[1] ? j : 1 - j));
	ctx.drawImage(cur[tool][0], mousex + cur[tool][1], mousey + cur[tool][2]);
	var xystr = "X: " + ((chnkx << 4) + pixlx) + ", Y: " + ((chnky << 4) + pixly);
	if(con){
		var pplstr = count + " cursor" + (count != 1 ? "s" : "") + " online";
		drawtext(pplstr, canvas.width - ctx.measureText(pplstr).width - 5, 14);
	}
	var xyw = ctx.measureText(xystr).width;
	ctx.fillStyle = "#888888";
	ctx.globalAlpha = .7;
	ctx.fillRect(0, 0, xyw + 8, 19);
	ctx.globalAlpha = .2;
	ctx.strokeRect(-1, -1, xyw + 8, 19);
	drawtext(xystr, 4, 14);
	if(nt - t < 2500 || true){
		window.requestAnimationFrame(render);
	}
}

function simulateKeyPress(key, hold)
{
    var eventObj;
    if(hold)
    {
        eventObj = document.createEvent("Events"); eventObj.initEvent("keydown", true, true); eventObj.keyCode = key; window.dispatchEvent(eventObj);
    }
    else
    {
        eventObj = document.createEvent("Events"); eventObj.initEvent("keyup", true, true); eventObj.keyCode = key; window.dispatchEvent(eventObj);
    }
}
function simulateMousePress(button, clientX, clientY, press)
{
    if(press)
    {
        canvas.dispatchEvent(new MouseEvent('mousedown', { 'clientX': clientX, 'clientY': clientY, 'button': button, 'mozPressure' : 1.0 }));
    }
    else{
        canvas.dispatchEvent(new MouseEvent('mouseup', { 'clientX': clientX, 'clientY': clientY, 'button': button, 'mozPressure' : 1.0 }));
    }
}
function simulateMouseMove(clientX, clientY)
{
    canvas.dispatchEvent(new MouseEvent('mousemove', { 'clientX': clientX, 'clientY': clientY }));
}