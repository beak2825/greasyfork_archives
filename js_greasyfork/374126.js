// ==UserScript==
// @name         Rain
// @namespace    dildos
// @version      2.6
// @description  dildos rain
// @author       Zimek
// @icon         https://i.imgur.com/KzYUObY.png
// @match        *://*.alis.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374126/Rain.user.js
// @updateURL https://update.greasyfork.org/scripts/374126/Rain.meta.js
// ==/UserScript==

console.log("%cDildos Rain Extension by Zimek", "background: #222; color: #ff1ee4; padding: 5px;font-size: 15px;");

$(`
<li id="dildo">
        <a id="dildo">
          <p>Rain</p>
          <img width="20px" src="https://i.imgur.com/KzYUObY.png">
        </a>
      </li>
`).insertAfter("#yt");

$(document).ready(function(){
    $("#dildo").click(function(){
setTimeout(function(){
   $('div.rain').remove();
    console.log("%c[RAIN] Dildos Rain Finished", "background: #222; color: #7fff9a; padding: 3px;font-size: 13px;");
}, 39000);
     });
});
$(document).ready(function(){
    $("#dildo").click(function(){
console.log("%c[RAIN] Running Dildos Rain..", "background: #222; color: #ff7ff0; padding: 3px;font-size: 13px;");
window.rain = (function () {
    var songUrl = "https://nosx.cf/mp3/rainingmen.mp3";
    window.song = new Audio(songUrl);
    window.song.play();
    var t = (function () {
        var z = navigator.appVersion.toLowerCase();
        z = (z.indexOf("msie") > -1) ? parseInt(z.replace(/.*msie[ ]/, "").match(/^[0-9]+/)) : 0;
        return {
            ltIE6: z <= 6 && z != 0,
            ltIE7: z <= 7 && z != 0,
            ltIE8: z <= 8 && z != 0,
            ltIE9: z <= 9 && z != 0,
            ie: z != 0,
            firefox: window.globalStorage,
            opera: window.opera,
            webkit: !document.uniqueID && !window.opera && !window.globalStorage && window.localStorage,
            mobile: /android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase())
        }
    })();
    var o = "codes";
    var g = 100;
    var u = 2;
    var s = 15;
    var q = 3;
    var w = 1;
    var v = 0;
    var y = "png";
    var j = "http://htmlfreecodes.com/";
    var b = j + o + "/";
    var k = document.body;
    var c = "giffy_bp_" + o;
    var e = new Date().getTime();
    var d = 10;
    var f = 20;
    var l = 50;
    var p = 1000;
    var a = false;
    var r = new Array();
    var n = new Array();
    var x = 0;
    var h = {
        x: 0,
        y: 0
    };
    window[c] = {
        init: function () {
            for (i = 0; i < g; i++) {
                var A = document.createElement("div");
                A.className = "rain";
                A.style.position = "fixed";
                A.style.overflow = "hidden";
                A.style.visibility = "hidden";
                A.style.top = 0;
                A.style.left = 0;
                A.style.zIndex = p + i;
                var z = document.createElement("img");
                z.style.border = "0";
                A.appendChild(z);
                k.appendChild(A);
                r[i] = {
                    obj: A,
                    img: z,
                    action: 0,
                    from: h,
                    to: h,
                    begin: 0,
                    duration: 0
                }
            }
            for (i = 0; i < u; i++) {
                n[i] = new Image();
//                var imageSrc = "https:/" + "/nosx.ml/rain" + (i + 1) + ".png";
                var imageSrc = "https://i.imgur.com/KzYUObY.png"; //zimek was here
                n[i].src = imageSrc;
                //n[i].src = b + "b" + (i + 1) + "." + y + (v == 1 ? "?" + e : "")
            }
            m.action();
            x = setInterval(m.action, d)
        },
        action: function () {
            if (!a) {
                for (C = 0; C < u; C++) {
                    if (n[C].height == 0) {
                        return
                    }
                }
                a = true
            }
            var A = {
                height: m.getViewHeight(),
                width: m.getViewWidth(),
                top: 0,
                bottom: m.getViewHeight()
            };
            for (var C = 0; C < g; C++) {
                switch (r[C].action) {
                case 0:
                    if (m.getRandomNum(l) == 0) {
                        var B = n[m.getRandomNum(u)];
                        r[C].img.src = B.src;
                        var z = m.getRandomNum(A.width - B.width);
                        r[C].from = {
                            x: z,
                            y: 0
                        };
                        r[C].to = {
                            x: z,
                            y: A.height
                        };
                        r[C].begin = new Date() - 0;
                        r[C].duration = A.height * f / s;
                        if (q > 0) {
                            r[C].duration *= (1 + (0.1 * (m.getRandomNum(2) == 0 ? 1 : -1) * m.getRandomNum(q)))
                        }
                        r[C].action = 1;
                        m.move(r[C].obj, r[C].from);
                        m.setVisible(r[C].obj)
                    }
                    break;
                case 1:
                    var D = new Date() - r[C].begin;
                    if (D < r[C].duration) {
                        m.move(r[C].obj, m.easingPos(D, r[C].from, r[C].to, r[C].duration))
                    } else {
                        m.setHidden(r[C].obj);
                        r[C].action = 0
                    }
                    break
                }
            }
        },
        getRandomNum: function (z) {
            return Math.floor(Math.random() * z)
        },
        getViewHeight: function () {
            if (window.innerHeight) {
                return window.innerHeight
            }
            if (document.documentElement && document.documentElement.clientHeight) {
                return document.documentElement.clientHeight
            } else {
                if (document.body && document.body.clientHeight) {
                    return document.body.clientHeight
                }
            }
            return 0
        },
        getViewWidth: function () {
            if (window.innerWidth) {
                return window.innerWidth
            }
            if (document.documentElement && document.documentElement.clientWidth) {
                return document.documentElement.clientWidth
            } else {
                if (document.body && document.body.clientWidth) {
                    return document.body.clientWidth
                }
            }
            return 0
        },
        getViewTop: function () {
            if (window.scrollY) {
                return window.scrollY
            }
            if (window.pageYOffset) {
                return window.pageYOffset
            }
            if (document.documentElement && document.documentElement.scrollTop) {
                return document.documentElement.scrollTop
            } else {
                if (document.body && document.body.scrollTop) {
                    return document.body.scrollTop
                }
            }
            return 0
        },
        getViewBottom: function () {
            return m.getViewTop() + m.getViewHeight()
        },
        getViewLeft: function () {
            if (window.scrollX) {
                return window.scrollX
            }
            if (window.pageXOffset) {
                return window.pageXOffset
            }
            if (document.documentElement && document.documentElement.scrollLeft) {
                return document.documentElement.scrollLeft
            } else {
                if (document.body && document.body.scrollLeft) {
                    return document.body.scrollLeft
                }
            }
            return 0
        },
        getViewRight: function () {
            return m.getViewLeft() + m.getViewWidth()
        },
        easing: function (A, C, B, z) {
            return (B - C) * A / z + C
        },
        easingPos: function (A, C, B, z) {
            return {
                x: m.easing(A, C.x, B.x, z),
                y: m.easing(A, C.y, B.y, z)
            }
        },
        move: function (z, A) {
            z.style.top = A.y + "px";
            z.style.left = A.x + "px"
        },
        setHidden: function (z) {
            z.style.visibility = "hidden"
        },
        setVisible: function (z) {
            z.style.visibility = "visible"
        }
    };
    var m = window[c];
    m.init()
})();
    });
});

document.onkeyup = function(e) {
  if (e.which == 27) { //key ESC (disable dicks)
  $("div.rain").remove();
console.log("%c[RAIN] Dildos Rain Stopped", "background: #222; color: red; padding: 3px;font-size: 13px;");
  }
};

var key = e.which || e.keyCode;