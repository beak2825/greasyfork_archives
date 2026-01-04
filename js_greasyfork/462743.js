// ==UserScript==
// @name         DM colorization
// @namespace    https://dreamychat.com/*
// @version      0.2.1
// @description  Each user DMing will be a different color.
// @author       You
// @match        https://dreamychat.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://code.jquery.com/jquery-latest.js
// @run-at   document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462743/DM%20colorization.user.js
// @updateURL https://update.greasyfork.org/scripts/462743/DM%20colorization.meta.js
// ==/UserScript==

var seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function isCssLoaded(url) {
  for (let i = 0; i < document.styleSheets.length; i++) {
    const styleSheet = document.styleSheets[i];
    if (styleSheet.href === url) {
      return true;
    }
  }
  return false;
}

function HSVtoRGB(h, s, v) {
    var r1, g1, b1, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s; v = h.v; h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r1 = v; g1 = t; b1 = p; break;
        case 1: r1 = q; g1 = v; b1 = p; break;
        case 2: r1 = p; g1 = v; b1 = t; break;
        case 3: r1 = p; g1 = q; b1 = v; break;
        case 4: r1 = t; g1 = p; b1 = v; break;
        case 5: r1 = v; g1 = p; b1 = q; break;
    }
    return [
        Math.round(r1 * 255),
        Math.round(g1 * 255),
        Math.round(b1 * 255)
    ];
}

function getName(t,dark) {
    seed = t.charCodeAt(0)*t.charCodeAt(1);
    var h = random();
    var s = random();//random()*255;
    var v = 0.6;//random()*255;
    if (dark) {
        v=1;
    }
    var ar = HSVtoRGB(h,s,v);
    var r = ar[0];
    var g = ar[1];
    var b = ar[2];
    if (t == "RaeRae") {
        r = 189;
        g = 102;
        b = 231;
    }
    if (t == "cold_c4ssidy") {
        r = 255; g = 130; b = 201;
    }
    return [r,g,b];
}

let zzz = true;

function ChangeClr() {
    var dark = isCssLoaded("https://dreamychat.com/css/chat-dark.css?1651288155");
    var rules = new Array();
    if (zzz) {
        zzz=false;
        for (let i = 0; i < document.styleSheets.length; i++) {

        //console.log("Here babe");
        if (document.styleSheets[i].cssRules) {
            rules = document.styleSheets[i].cssRules;
        }
        else if (document.styleSheets[i].rules) {
            rules = document.styleSheets[i].rules;
        }

        for(let j = 0; j < rules.length; j++) {
            if (String(rules[j].selectorText) == ".chat-invite.chat-self::after, .chat-invite.chat-to::after, .chat-whisper::after") {
                //document.styleSheets[0].deleteRule(rules[j]);
                rules[j].style = ".chat-invite.chat-self::after, .chat-invite.chat-to::after, .chat-whisper::after {border-width: 0 .25rem;}";
                document.styleSheets[i].cssRules[j] = rules[j];
            }
        }
    }
}
    var stuff = document.getElementsByClassName("chat-whisper");
    var bad = document.getElementsByClassName("chat-self");
    for (let i = 0; i < stuff.length; i++) {

        if (!Array.prototype.includes.call(bad, stuff[i])) {
            try {
                stuff[i].classList.remove("chat-mention");
            } catch {

            }

            var s = stuff[i].getElementsByClassName("name")[0];
            var aTags = s.getElementsByTagName("span");
            var t = aTags[0].textContent;

            //console.log(t);
            var cls = getName(t,dark);
            var r = cls[0];
            var g = cls[1];
            var b = cls[2];
            var color = "rgba("+r+","+g+","+b+",.35)";
            //console.log(color);
            stuff[i].style = "background: "+color+";border: solid "+color+";border-width: 0 0.25rem;";
            //stuff[i].style.display='none';
            //stuff[i].offsetHeight; // no need to store this anywhere, the reference is enough
            //stuff[i].style.display='';
        }
    }

    var stuff2 = document.getElementsByClassName("chat-message chat-whisper chat-self");
    for (let i = 0; i < stuff2.length; i++) {
        try {
            stuff2[i].classList.remove("chat-mention");
        } catch {

        }

        var s2 = stuff2[i].getElementsByClassName("name")[0];
        var aTags2 = s2.getElementsByTagName("span");
        var t2 = aTags2[0].textContent;
        var cls2 = getName(t2,dark);
        var r2 = cls2[0];
        var g2 = cls2[1];
        var b2 = cls2[2];
        var color2 = "rgba("+r2+","+g2+","+b2+",1)";
        aTags2[0].style = "color: "+color2+";";
        stuff2[i].style = "border: solid "+color2+";border-width: 0 0.25rem;";
    }
};

var i = setInterval(ChangeClr,1000);

console.log("Dreamychat colored DMs loaded!");