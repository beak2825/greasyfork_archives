// ==UserScript==
// @name         AgarCancer
// @namespace    AgarCancer Modded
// @version      1.5
// @description  Kill your ears, eyes, and everything else....
// @author       Turtle ? Clan (Modded by Mr.Sonic xd)
// @license      PSL
// @match        http://agar.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/21945/AgarCancer.user.js
// @updateURL https://update.greasyfork.org/scripts/21945/AgarCancer.meta.js
// ==/UserScript==
if (!localStorage.AgarCancerLoad) {
    var runExt = window.confirm("Warning: This extension contains flashing lights and loud sounds. If you do not wish to use this extension, please click cancel NOW then exit the page. By clicking OK you agree that we (the creator) can NOT be blamed by any harm that hay come to you or anyone around you.");
    localStorage.AgarCancerLoad = runExt;
}
if (JSON.parse(localStorage.AgarCancerLoad)) {
    var tcm_cancer = {
        l: {
            fill: (CanvasRenderingContext2D.prototype.fill),
            fillRect: (CanvasRenderingContext2D.prototype.fillRect),
            fillText: (CanvasRenderingContext2D.prototype.fillText),
            stroke: (CanvasRenderingContext2D.prototype.stroke),
            strokeRect: (CanvasRenderingContext2D.prototype.strokeRect),
            strokeText: (CanvasRenderingContext2D.prototype.strokeText),
            arc: (CanvasRenderingContext2D.prototype.arc)
        },
        o: function(n, r, c) {
            CanvasRenderingContext2D.prototype[n] = function() {
                c(this, arguments);
                tcm_cancer.l[n].apply(this, arguments);
                c(this, arguments);
            };
        },
        g: function(a) {
            var c = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
            var g = a.createLinearGradient(0, 0, a.canvas.width, 0);
            g.addColorStop(0, c[Math.floor(Math.random() * c.length)]);
            g.addColorStop(1, c[Math.floor(Math.random() * c.length)]);
            return g;
        },
        init: function() {
            window.onload = function() {window.core.setAcid(true);};
            if (!window.jQuery) return setTimeout(tcm_cancer.init, 100);
            $("div").css("-ms-transform", "rotate(" +Math.random()*20 +"deg)");
            $("div").css("-webkit-transform", "rotate(" +Math.random()*20 +"deg)");
            $("div").css("transform", "rotate(" +Math.random()*20 +"deg)");
            if (!document.getElementById('adbg')) window.setTimeout(tcm_cancer.init, 100);
            document.getElementById('adbg').style.backgroundImage = 'url(\'http://i.imgur.com/l6k9kWD.png\')';
            for (var i1 = 0, s = []; i1 < 3; i1++ ) {
                s[i1] = new Audio('https://archive.org/download/cancerstorm_20160728/cancer.ogg');
                s[i1].volume = 1;
                s[i1].currentTime = 0;
                s[i1].loop = true;
                s[i1].play();
            }
            tcm_cancer.o('fillText', 'b', function(c, a) {
                c.fillStyle = tcm_cancer.g(c);
                if (a[0].toLowerCase() == 'leaderboard') a[0] = 'AgarCancer';
                c.rotate(Math.random());
            });
            tcm_cancer.o('fill', 'b', function(c, a) {
                c.fillStyle = tcm_cancer.g(c);
                //c.rotate(Math.random());
            });
            tcm_cancer.o('fillRect', 'b', function(c, a) {
                c.fillStyle = tcm_cancer.g(c);
            });
            tcm_cancer.o('stroke', 'b', function(c, a) {
                c.strokeStyle = tcm_cancer.g(c);
                //c.rotate(Math.random());
            });
            tcm_cancer.o('strokeText', 'b', function(c, a) {
                c.strokeStyle = tcm_cancer.g(c);
                c.rotate(Math.random() * 5000);
            });
            tcm_cancer.o('strokeRect', 'b', function(c, a) {
                c.strokeStyle = tcm_cancer.g(c);
            });
            tcm_cancer.o('arc', 'b', function(c, a) {
                c.strokeStyle = tcm_cancer.g(c);
                a[2] *= Math.random() / 4 + 0.75;
                c.rotate(Math.random() * 5000);
            });
        }
    };
    tcm_cancer.init();
}

(function addButton() {
    if (!window.jQuery) return setTimeout(addButton, 100);
    setTimeout(function() {
        $("#mainPanel").append('<center><button class="btn btn-success" onclick="localStorage.AgarCancerLoad = undefined;delete localStorage.AgarCancerLoad;location.reload()">Reset AgarCancer Settings</button></center>');
    }, 1000);
})();