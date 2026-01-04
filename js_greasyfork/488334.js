// ==UserScript==
// @name     全彩模式
// @description 闪眼睛专用，正常人别安装
// @license SATA
// @version  3.-98
// @match    *://*/*
// @namespace https://greasyfork.org/users/1265383
// @downloadURL https://update.greasyfork.org/scripts/488334/%E5%85%A8%E5%BD%A9%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/488334/%E5%85%A8%E5%BD%A9%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
let c=Math.round(Math.random()*360);
function hsvToRgb(x) {
    var h = x, s = 100, v =100;
    s = s / 100;
    v = v / 100;
    var r = 0, g = 0, b = 0;
    var i = parseInt((h / 60) % 6);
    var f = h / 60 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i) {
        case 0:
            r = v; g = t; b = p;
            break;
        case 1:
            r = q; g = v; b = p;
            break;
        case 2:
            r = p; g = v; b = t;
            break;
        case 3:
            r = p; g = q; b = v;
            break;
        case 4:
            r = t; g = p; b = v;
            break;
        case 5:
            r = v; g = p; b = q;
            break;
        default:
            break;
    }
    r = parseInt(r * 255.0)
    g = parseInt(g * 255.0)
    b = parseInt(b * 255.0)
    return [r, g, b];
}
function rep(now){
    let xxx=hsvToRgb(c);
    let xxxx=hsvToRgb((180+c)%360);
    now.style ='background:rgb('+xxx[0]+','+xxx[1]+','+xxx[2]+');color:rgb('+xxxx[0]+','+xxxx[1]+','+xxxx[2]+')';
    var x=now.children;
    for(var i=0;i<now.children.length;i++){
        rep(x[i]);
    }
}
(() => {
let a = setInterval(() =>{
    c++;
    if(c==360){
        c=0;
    }
    rep(document);
},5)
})();