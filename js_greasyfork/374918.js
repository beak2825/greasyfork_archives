// ==UserScript==
// @name         pixely.cf tools
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Allows you to draw images by uploading and then clicking. MAKE SURE YOUR IMAGES ARE LESS THAN 100x100px
// @author       theusaf
// @match        http://pixely.cf/
// @match        http://qwertyquerty.cf/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374918/pixelycf%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/374918/pixelycf%20tools.meta.js
// ==/UserScript==

var drawScale = 10;
window.finalInfo = [];
window.sketchint = 0;
window.isPlacingImage = false;
var di = document.createElement('div'); //div
di.style.background = 'white';
di.style.display = 'none';
di.style.top = "0px";
di.style.position = "fixed";
var im = new Image(); //image
im.crossOrigin = "Anonymous";
var ca = document.createElement('canvas'); //canvas
ca.style.display = 'none';
var fi = document.createElement('input'); //file input
fi.type = 'file';
di.style.float = 'left';
var ct = ca.getContext('2d'); //context

document.body.addEventListener('keydown',toggleFile);

function toggleFile(evt){
    if(evt.keyCode == 16){
        evt.preventDefault();
        di.style.display = di.style.display == "block" ? "none" : "block";
    }
}

fi.onchange = function(e){
    if(!e){
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e){
        im.src = e.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

const int = document.createElement("input");
int.type = "number";
int.placeholder = "Max size";
int.min = 1;
int.max = 100;
int.step = 1;
int.value = 100;

im.onload = function(){
    const max = Math.round(Number(int.value));
    if(!max){
      max = 100;
    }
    console.log('loaded');
    if(im.src.length > 0){
        //change canvas width and height.
        ca.width = im.width;
        ca.height = im.height;
        if(im.width <= max && im.height <= max){
          ct.drawImage(im,0,0);
        }else{
          if(im.width > im.height){
            const scalar = im.height / im.width;
            ca.width = max;
            ca.height = Math.round(max * scalar);
            ct.drawImage(im,0,0,max,Math.round(max*scalar));
          }else{
            const scalar = im.width / im.height;
            ca.width = Math.round(max * scalar);
            ca.height = max;
            ct.drawImage(im,0,0,Math.round(max*scalar),max);
          }
        }
        let data = ct.getImageData(0,0,ca.width,ca.height).data;
        let bestColor = 0;
        let bestPercent = 0;
        finalInfo = [];
        let x = 0;
        let y = 0;
        let maxX = ca.width;
        console.log(data.length);
        for(let i = 0; i < data.length; i+=4){
            //loop through colors
            /*global colors*/
            if(x >= maxX){
                console.log("x has hit max: " + maxX);
                y++;
                x = 0;
            }
            for(let j in colors){
                if(hslcd([data[i],data[Number(i)+1],data[Number(i)+2]],htr(colors[j])) > bestPercent){
                    bestPercent = hslcd([data[i],data[Number(i)+1],data[Number(i)+2]],htr(colors[j]));
                    bestColor = j;
                }
            }
            //if alpha is less than 40, dont push.
            if(data[Number(i)+3] <= 40){
                x++;
                bestPercent = 0;
                bestColor = 0;
                continue;
            }
            //now that best color has been set, add to a thingy.
            finalInfo.push({
                x: x,
                y: y,
                c: Number(bestColor)
            });
            x++;
            bestPercent = 0;
            bestColor = 0;
        }
        isPlacingImage = true;
        sketchint = 0;
        drawScale = SCALE;
        console.log(finalInfo);
    }
}

/*global canvas*/
/*global getMousePos*/
/*global isPlacingImage*/
/*global finalInfo*/
/*global si*/
canvas.addEventListener('click',function(e){
    console.log('click!')
    let x = Math.floor(getMousePos(canvas,e).x);
    let y = Math.floor(getMousePos(canvas,e).y);
    if(isPlacingImage){
        console.log('placing image');
        isPlacingImage = false;
        di.style.display = "none";
        //start interval
        /*global io*/
        /*global SCALE*/
        var sketch = setInterval(function(){
            if(finalInfo.length == 0){
                clearInterval(sketch);
                return;
            }
            if(sketchint >= finalInfo.length){
                clearInterval(sketch);
                console.log("done");
                return;
            }
            if(finalInfo[sketchint].x + (x/drawScale) >= 640 || finalInfo[sketchint].y + (y/drawScale) >= 640){
                sketchint++;
                console.log('hit canvas limit');
                return;
            }
            console.log('drawing');
            //adding listener to skip over useless stuff..
            /*global pixels*/
            let ok = false;
            while(!ok){
                if(pixels[finalInfo[sketchint].y + Math.floor(y/drawScale)][finalInfo[sketchint].x + Math.floor(x/drawScale)] == finalInfo[sketchint].c){
                   sketchint++;
                   continue;
                }
                ok = true;
            }
            io.emit('set',{x:finalInfo[sketchint].x + Math.floor(x/drawScale),y:finalInfo[sketchint].y + Math.floor(y/drawScale),c:finalInfo[sketchint].c});
            sketchint++;
        },300);
    }
});

// no longer using hcd to compare. (works like a computer, but not like a human)
function hcd(hex1, hex2) {
    hex1 = hex1.split("#").length == 1 ? hex1 : hex1.split("#")[1];
    hex2 = hex2.split("#").length == 1 ? hex2 : hex2.split("#")[1];
    // get red/green/blue int values of hex1
    var r1 = parseInt(hex1.substring(0, 2), 16);
    var g1 = parseInt(hex1.substring(2, 4), 16);
    var b1 = parseInt(hex1.substring(4, 6), 16);
    // get red/green/blue int values of hex2
    var r2 = parseInt(hex2.substring(0, 2), 16);
    var g2 = parseInt(hex2.substring(2, 4), 16);
    var b2 = parseInt(hex2.substring(4, 6), 16);
    // calculate differences between reds, greens and blues
    var r = 255 - Math.abs(r1 - r2);
    var g = 255 - Math.abs(g1 - g2);
    var b = 255 - Math.abs(b1 - b2);
    // limit differences between 0 and 1
    r /= 255;
    g /= 255;
    b /= 255;
    // 0 means opposit colors, 1 means same colors
    return (r + g + b) / 3;
} //compare hex values

function rth(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
} //rbg to hex

function htr(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
} // hex to rgb

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// from stackoverflow lol
// https://stackoverflow.com/questions/13586999/color-difference-similarity-between-two-values-with-js
function deltaE(rgbA, rgbB) {
  let labA = rgb2lab(rgbA);
  let labB = rgb2lab(rgbB);
  let deltaL = labA[0] - labB[0];
  let deltaA = labA[1] - labB[1];
  let deltaB = labA[2] - labB[2];
  let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  let deltaC = c1 - c2;
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  let sc = 1.0 + 0.045 * c1;
  let sh = 1.0 + 0.015 * c1;
  let deltaLKlsl = deltaL / (1.0);
  let deltaCkcsc = deltaC / (sc);
  let deltaHkhsh = deltaH / (sh);
  let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return 100 - (i < 0 ? 0 : Math.sqrt(i));
}

function rgb2lab(rgb){
  let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

// turns out the deltaE algorithm didn't help much. trying hsl.
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function hslcd(rgb1,rgb2){
  const hsl1 = rgbToHsl(...rgb1);
  const hsl2 = rgbToHsl(...rgb2);
  const hpa = Math.abs(hsl1[0] - hsl2[0]) * 3.0;
  const hpb = Math.abs(hsl1[1] - hsl2[1]) * 0.9;
  const hpc = Math.abs(hsl1[2] - hsl2[2]) * 1.1;
  return 1 - ((hpa + hpb + hpc)/3);
}

di.append(fi,int);
di.append(ca);
document.body.append(di);

//add slider for zoom
let sli = document.createElement('input'); //slider input. changes scale.
sli.type = 'range';
sli.min = 1;
sli.max = 20;
sli.value = 10;
sli.step = 1;
let fdiv = document.getElementById('colorpicker'); //a div that has the colors
fdiv.append(sli);
/*global draw*/
sli.oninput = function(){
    let DIMS = [pixels[0].length, pixels.length];
    SCALE = sli.value;
    canvas.width = SCALE * DIMS[0];
    canvas.height = SCALE * DIMS[1];
    draw(pixels);
    if(isPlacingImage){
        drawScale = SCALE;
    }
}

//hide color picker and slider
document.body.addEventListener('keydown',togglePicker);

function togglePicker(e){
    fdiv.style.display = e.keyCode == 16 ? fdiv.style.display == "none" ? "block" : "none" : fdiv.style.display;
}