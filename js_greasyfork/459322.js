// ==UserScript==
// @name         Gpop note counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  h
// @author       osugamer983
// @match        https://gpop.io/play/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459322/Gpop%20note%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/459322/Gpop%20note%20counter.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window._$3q.prototype._$77 = function(a) {
        var b = a.key.toLowerCase();
        if (a.keyCode == 32) {
            if (this._$85 == true) {
                this._$bc();
            }
            a.preventDefault();
        } else if (b == "u") {
            if (this._$85 == true) {
                this._$4S();
            }
            a.preventDefault();
        } else if (b == "r") {
            if (this._$85 == true) {
                this._$39u();
                this._$40u()
                this._$7L();
            }
            a.preventDefault();
        }
    };
    window._$3q.prototype._$40u = function() {
        document.querySelector(".perfs").textContent = this.noteshitPerf;
        document.querySelector(".greats").textContent = this.noteshitGreat;
        document.querySelector(".goods").textContent = this.noteshitGood;
        document.querySelector(".oks").textContent = this.noteshitOk;
        document.querySelector(".totalhits").textContent = this.noteshitPerf+this.noteshitOk+this.noteshitGreat+this.noteshitGood
        document.querySelector(".misses").textContent = this.noteshitMiss;
    }
    window._$3q.prototype._$39u = function() {
        this.noteshitMiss = 0;
        this.noteshitOk = 0;
        this.noteshitGood = 0;
        this.noteshitGreat = 0;
        this.noteshitPerf = 0;
    };
    window._$3q.prototype._$bj = function(a) {
        this._$39u()
        this._$8V(a);
        this._$8E();
        this._$aj();
        this._$5g();
        this._$aB();
        this.mode = -1;
        this._$8C = 0.3;
        this._$6D = 15;
        this._$86 = 100 / this._$6D;
        this._$7n = 4;
        this._$z(false);
        this._$9z = false;
        this._$3E("load");
        this.gamespeed = 5;
        this._$5V = 50;
        this._$3Y = 10;
        this._$8i = false;
        this._$7t = 2;
        this._$8f = this._$7t / this._$6D;
        this._$V = 1.25;
        this._$5w = this._$V / this._$6D;
        this._$b7 = -1;
        this._$b8 = 500;
        this._$68 = 0;
        this._$bq = 0;
        this.lesslag = false;
        this._$8c();
        this.gm = "o";
        window.addEventListener("resize", this._$1y.bind(this));
        this._$1y();
    };
    window._$3q.prototype._$4k = function(a) {
        this._$5k(a);
        this._$3y[a] = _$7B.epoch() + 0.6 * 1000;
        this._$6N[a] = _$7B.epoch() + 0.08 * 1000;
        this.noteshitMiss += 1;
        this._$40u()
        this._$3o[a]["0"].style.opacity = 1;
        this._$3o[a]["0"].style.top = _$7B._$4K(-15, 15) + "px";
        this._$3o[a]["0"].style.left = _$7B._$4K(-5, 5) + "px";
        this._$3o[a]["0"].style.transform = "translateX(-50%) scale(1.2)";
    };
    window._$3q.prototype._$5n = function(a, c) {
        this._$5k(a);
        this._$3y[a] = _$7B.epoch() + 0.6 * 1000;
        this._$6N[a] = _$7B.epoch() + 0.08 * 1000;
        var b = "1";
        if (c < 0.5) {
            this.noteshitOk += 1;
        }
        else if (c < 0.75) {
            this.noteshitGood += 1;
            b = "2";
        } else if (c < 0.9) {
            this.noteshitGreat += 1;
            b = "3";
        } else {
            this.noteshitPerf += 1;
            b = "4";
        }
        this._$40u()
        this._$3o[a][b].style.opacity = 1;
        this._$3o[a][b].style.top = _$7B._$4K(-15, 15) + "px";
        this._$3o[a][b].style.left = _$7B._$4K(-5, 5) + "px";
        this._$3o[a][b].style.transform = "translateX(-50%) scale(1.2)";
    };
})();