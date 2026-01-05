// ==UserScript==
// @name             Käsekästchen
// @namespace     http://kk.towodo.de/
// @version           0.0.2.1321
// @description     try to take over the world!
// @author            Dummbroesel
// @match             *
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/23231/K%C3%A4sek%C3%A4stchen.user.js
// @updateURL https://update.greasyfork.org/scripts/23231/K%C3%A4sek%C3%A4stchen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Array.prototype.clean = function(deleteValue) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == deleteValue) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };

    function Debug (debug = null, console = null) {
        this.debug = debug || false;
        this.console = console || window.console;
        this.start();
    }
    Debug.prototype.debug = false;
    Debug.prototype.console = window.console;
    Debug.prototype.start = function () {
        if(this.debug) this.console.info('Debug start!');
    };
    Debug.prototype.info = function (str_val, obj = null) {
        if(this.debug && obj) this.console.info(str_val, obj);
        else this.console.info(str_val);
    };
    Debug.prototype.log = function (str_val, obj = null) {
        if(this.debug && obj) this.console.log(str_val, obj);
        else this.console.log(str_val);
    };
    Debug.prototype.group = function (str_val, obj = null) {
        if(this.debug && obj) this.console.group(str_val, obj);
        else this.console.group(str_val);
    };
    Debug.prototype.groupCollapsed = function (str_val, obj = null) {
        if(this.debug && obj) this.console.groupCollapsed(str_val, obj);
        else this.console.groupCollapsed(str_val);
    };
    Debug.prototype.groupEnd = function () {
        if(this.debug) this.console.groupEnd();
    };
    Debug.prototype.dir = function(obj) {
        if(this.debug) this.console.dir(obj);
    };
    Debug.prototype.warn = function (str_val, obj = null) {
        if(this.debug && obj) this.console.warn(str_val, obj);
        else this.console.warn(str_val);
    };
    Debug.prototype.end = function () {
        if(this.debug) this.console.info('Debug end!');
        this.debug = false;
    };
    Debug.prototype.destroy = function () {
        this.end();
        //w00p w00p ALLAHU AKBAR!!!
    };

    function KKS() {

    }

    KKS.prototype.player = {
        minCount: 2,
        maxCount: 8,
        minAICount: 1,
        maxAICount: 7
    };

    

    function KK(me, playerCount = 2, size = {width:60, height:60}, aiCount = 0, aiDifficulty = 'easy', gameSpeed = 'normal', debug = true) {
        this.me = me;
        this.playerCount = playerCount;
        this.Dimensions.current = size;
        this.aiCount = aiCount;
        this.aiDifficulty = aiDifficulty;

        this.debug = new Debug(debug);

        this.init();
    }

    KK.prototype.Devs = {
        'Name': 'Käsekästchen',
        'Version': '0.0.1.1321',
        'Author': 'Dummbroesel',
        'Description': 'Käsekästchen',
        'Website': 'http://kk.towodo.de/',
        'Copyright': '© 2016 Dummbroesel'
    };

    KK.prototype.settings = '';
    KK.ptototype.turnCounter = 0;
    
    //KK.prototype.maxPlayerCount = 8;
    //KK.prototype.minPlayerCount = 2;
    //KK.prototype.Dimensions = {
    //    min: { width: 10, height: 10 },
    //    max: { width: Number.MAX_SAFE_INTEGER, height: Number.MAX_SAFE_INTEGER },
    //    current: { width: -1, height: -1 }
    //};

    //Initialize Käsekästchen
    KK.prototype.init = function () {
        this.debug.info('Initialize Käsekästchen!');
        this.debug.dir(this.Devs);
        this.debug.dir(this);
    };

    //KK.prototype.speedTypes = { 'slow': 0.5, 'normal': 1, 'fast': 2};
    
    KK.prototype.saveGame = function () {this.debug.info('Save Game logic goes here!');};
    KK.prototype.loadGame = function () {this.debug.info('Load Savegame logic goes here!');};

    window.__kk = new KK('__kk');
})();