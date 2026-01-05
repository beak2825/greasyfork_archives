// ==UserScript==
// @name        WaniKani Super Burn Happy Script
// @namespace   mempo
// @description Every burn is a reason to celebrate! Congratulate yourself with confetti!
// @include     https://www.wanikani.com/review/session
// @include        http://www.wanikani.com/review/session
// @author      Toemat
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15703/WaniKani%20Super%20Burn%20Happy%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/15703/WaniKani%20Super%20Burn%20Happy%20Script.meta.js
// ==/UserScript==

$(document).ready(function () {
    //
    // CONFIG OPTIONS
    //
    var VOLUME = 1.0;     //Edit this to change sound volume - 0.5 is half, 1.0 is full
    //
    // END CONFIG DONT EDIT BELOW
    //
   
    /**
     * Confetti business (modified from 'Confetti' by Patrik Svensson (http://metervara.net))
     */
    var frameRate = 30;
    var dt = 1.0 / frameRate;
    var DEG_TO_RAD = Math.PI / 180;
    var RAD_TO_DEG = 180 / Math.PI;
    var colors = [
        ["#df0049", "#660671"],
        ["#00e857", "#005291"],
        ["#2bebbc", "#05798a"],
        ["#ffd200", "#b06c00"]
    ];

    function Vector2(_x, _y) {
        this.x = _x, this.y = _y;
        this.Length = function () {
            return Math.sqrt(this.SqrLength());
        }
        this.SqrLength = function () {
            return this.x * this.x + this.y * this.y;
        }
        this.Equals = function (_vec0, _vec1) {
            return _vec0.x == _vec1.x && _vec0.y == _vec1.y;
        }
        this.Add = function (_vec) {
            this.x += _vec.x;
            this.y += _vec.y;
        }
        this.Sub = function (_vec) {
            this.x -= _vec.x;
            this.y -= _vec.y;
        }
        this.Div = function (_f) {
            this.x /= _f;
            this.y /= _f;
        }
        this.Mul = function (_f) {
            this.x *= _f;
            this.y *= _f;
        }
        this.Normalize = function () {
            var sqrLen = this.SqrLength();
            if (sqrLen != 0) {
                var factor = 1.0 / Math.sqrt(sqrLen);
                this.x *= factor;
                this.y *= factor;
            }
        }
        this.Normalized = function () {
            var sqrLen = this.SqrLength();
            if (sqrLen != 0) {
                var factor = 1.0 / Math.sqrt(sqrLen);
                return new Vector2(this.x * factor, this.y * factor);
            }
            return new Vector2(0, 0);
        }
    }
    Vector2.Sub = function (_vec0, _vec1) {
        return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
    }

    function ConfettiPaper(_x, _y) {
        this.dead = false;
        this.pos = new Vector2(_x, _y);
        this.rotationSpeed = Math.random() * 600 + 800;
        this.angle = DEG_TO_RAD * Math.random() * 360;
        this.rotation = DEG_TO_RAD * Math.random() * 360;
        this.cosA = 1.0;
        this.size = 5.0;
        this.oscillationSpeed = Math.random() * 1.5 + 0.5;
        this.xSpeed = 40.0;
        this.ySpeed = Math.random() * 60 + 50.0;
        this.corners = new Array();
        this.time = Math.random();
        var ci = Math.round(Math.random() * (colors.length - 1));
        this.frontColor = colors[ci][0];
        this.backColor = colors[ci][1];
        for (var i = 0; i < 4; i++) {
            var dx = Math.cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
            var dy = Math.sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
            this.corners[i] = new Vector2(dx, dy);
        }
        this.Update = function (_dt) {
            this.time += _dt;
            this.rotation += this.rotationSpeed * _dt;
            this.cosA = Math.cos(DEG_TO_RAD * this.rotation);
            this.pos.x += Math.cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt
            this.pos.y += this.ySpeed * _dt;
            if (this.pos.y > ConfettiPaper.bounds.y) {
                this.dead = true;
            }
        }
        this.Draw = function (_g) {
            if (this.cosA > 0) {
                _g.fillStyle = this.frontColor;
            } else {
                _g.fillStyle = this.backColor;
            }
            _g.beginPath();
            _g.moveTo(this.pos.x + this.corners[0].x * this.size, this.pos.y + this.corners[0].y * this.size * this.cosA);
            for (var i = 1; i < 4; i++) {
                _g.lineTo(this.pos.x + this.corners[i].x * this.size, this.pos.y + this.corners[i].y * this.size * this.cosA);
            }
            _g.closePath();
            _g.fill();
        }
    }
    ConfettiPaper.bounds = new Vector2(0, 0);

    ConfettiMachine = function(parent) {
        var i = 0;
        var canvasParent = document.querySelector(parent);
        var canvas = document.createElement('canvas');
        canvas.width = canvasParent.offsetWidth;
        canvas.height = canvasParent.offsetHeight;
        canvas.style.pointerEvents = 'none';
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.zIndex = 9999;
        canvasParent.appendChild(canvas);
        var context = canvas.getContext('2d');
        var interval = null;   

        var confettiPaperCount = 100;
        var confettiPapers = new Array();

        this.pop = function() {
            ConfettiPaper.bounds = new Vector2(canvas.width, canvas.height);
            for (i = 0; i < confettiPaperCount; i++) {
                confettiPapers.push(new ConfettiPaper(Math.random() * canvas.width, Math.random() * (-50)));
            }
            this.start();
        }
        this.resize = function() {
            canvas.width = canvasParent.offsetWidth;
            canvas.height = canvasParent.offsetHeight;
            ConfettiPaper.bounds = new Vector2(canvas.width, canvas.height);
            ConfettiRibbon.bounds = new Vector2(canvas.width, canvas.height);
        }
        this.start = function() {
            this.stop()
            var context = this
            this.interval = setInterval(function () {
                confetti.update();
            }, 1000.0 / frameRate)
        }
        this.stop = function() {
            clearInterval(this.interval);
        }
        this.update = function() {
            var i = 0;
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (i = 0; i < confettiPapers.length; i++) {
                confettiPapers[i].Update(dt);
                confettiPapers[i].Draw(context);
                if(confettiPapers[i].dead == true){
                    confettiPapers.splice(i, 1);
                }
            }
            if(confettiPapers.length == 0){
                this.stop();
            }
        }
    }

    confetti = new ConfettiMachine('body');
    $(window).resize(function () {
        confetti.resize();
    });

    /**
     * Sound effect
     */
    theSound = new Audio("//toemat.com/wanikani/burnit.ogg");
    theSound.volume = VOLUME;

    /**
     * Listen for the burn SRS indicator
     */
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation.addedNodes.length == 1){
                var newNode = mutation.addedNodes[0];
                if($(newNode).children().hasClass('srs-burn')){
                    theSound.play();
                    setTimeout(function(){
                        confetti.pop();
                    }, 1675);
                }
            }
        });   
    });

    //Bind the observer, if it doensn't work keep trying until it does.
    if(!bindObserver()){
        var clock = setInterval(function(){
            if(bindObserver()){
                clearInterval(clock);
            }
        }, 1000);
    }
   
    function bindObserver(){
        if($('#question-type').length != 0){
            observer.observe($('#question-type')[0], {
                childList: true
            });
            return true;
        } else {
            return false;
        }
    }
});

// Hook into App Store
try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}