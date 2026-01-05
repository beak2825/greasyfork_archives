// ==UserScript==
// @name         Overpowered Petridish.pw Macros!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       xNova
// @match        http://petridish.pw
// @match        http://petridish.pw/en/
// @match        http://agar.io/
// @grant        none
// @description OP Petri/Agar Macros
// @downloadURL https://update.greasyfork.org/scripts/16958/Overpowered%20Petridishpw%20Macros%21.user.js
// @updateURL https://update.greasyfork.org/scripts/16958/Overpowered%20Petridishpw%20Macros%21.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var intr,intr1,intr2,intr3,intr4,ovrClk;
var bool = [false,false,false,false,false,false,false,false,false,false,false,false,false];
var carr = false;
var off = false;
var disable_S = false;
var clk = [1,50];
var step = 1;
$(document).on('keydown',function(key) {
    this.key = key.keyCode;
    if(key.keyCode == 49) {
        bool[0] = true;
        if(bool[1]) {
            return;
        }
        bool[1] = true;
        if(bool[0]) {
            ovrClk = setInterval(function() {
                off = true;
                bool[4] = true;
                bool[5] = false;
                bool[6] = false;
                bool[7] = false;
                bool[8] = false;
                bool[9] = false;
                clk[0] = 10000;
                clearInterval(intr);
                clearInterval(intr1);
                return;
            }, 0.05);
        }
    }else if(key.keyCode == 51) {
        bool[2] = true;
        if(bool[3]) {
            return;
        }
        bool[3] = true;
        if(bool[2]) {
            ovrclk1 = setInterval(function() {
                disable_S = true;
                clk[1] = 1000000;
            }, 0.05);
        }
    }else if(key.keyCode == 48) {
        if(step == 1) {
            off = false;
            bool[0] = false;
            bool[1] = false;
            clearInterval(ovrClk);
            clk[0] = 1;
            return;
            step = 2;
        }else if(step == 2) {
            disable_S = false;
            bool[2] = false;
            bool[3] = false;
            clearInterval(ovrClk1);
            clk[1] = 50;
            return;
            step = 1;
        }
    }
})
if(carr == true) {
    off = true;
}else{
    off = false;
}
function Split() {
    if(!bool[2]) {
        $(document).on('keydown',function(key) {
            if(key.keyCode == 77) {
                bool[4] = true;
                if(bool[5]) {
                    return;
                }
                bool[5] = true;
                if(bool[4]) {
                    intr = setInterval(function() {
                        $("body").trigger($.Event("keydown", {keyCode: 32}));
                        $("body").trigger($.Event("keyup", {keyCode: 32}));
                    }, clk[0]);
                }
            }
        })
        $(document).on('keyup',function(key) {
            if(key.keyCode == 77) {
                bool[4] = false;
                bool[5] = false;
                clearInterval(intr);
            }
        })
        return;
    }
}
if(!off) {
    $(document).on('keydown',function(key) {
        this.key = key.keyCode;
        switch(this.key) {
            case 83:
                bool[6] = true;
                if(bool[7]) {
                    return;
                }
                bool[7] = true;
                if(bool[6] && !disable_S) {
                    intr1 = setInterval(function() {
                        $("body").trigger($.Event("keydown", {keyCode: 32}));
                        $("body").trigger($.Event("keyup", {keyCode: 32}));
                    }, clk[1]);
                }
            break
            case 88:
                bool[6] = false;
                bool[7] = false;
                clearInterval(intr1);
                return;
            break
            case 77:
                Split();
            break
        }
    })
}
$(document).on('keydown',function(key) {
    this.key = key.keyCode;
    switch(this.key) {
        case 90:
            bool[8] = true;
            if(bool[9]) {
                return;
            }
            bool[9] = true;
            if(bool[8]) {
                intr2 = setInterval(function() {
                    $("body").trigger($.Event('keydown', {keyCode: 87}));
                    $("body").trigger($.Event('keyup', {keyCode: 87}));
                }, 1.5);
            }
        break
        case 81:
            bool[10] = true;
            if(bool[11]) {
                return;
            }
            bool[11] = true;
            if(bool[10]) {
                intr3 = setInterval(function() {
                    $("body").trigger($.Event('keydown', {keyCode: 87}));
                    $("body").trigger($.Event('keyup', {keyCode: 87}));
                }, 0.5);
            }
        break
        case 65:
            bool[12] = true;
            if(bool[13]) {
                return;
            }
            bool[13] = true;
            if(bool[12]) {
                intr4 = setInterval(function() {
                    $("body").trigger($.Event('keydown', {keyCode: 87}));
                    $("body").trigger($.Event('keyup', {keyCode: 87}));
                }, 1.5);
            }
        break
    }
})
$(document).on('keyup',function(key) {
    this.key = key.keyCode;
    switch(this.key) {
        case 90:
            bool[8] = false;
            bool[9] = false;
            clearInterval(intr2);
            return;
        break
        case 81:
            bool[10] = false;
            bool[11] = false;
            clearInterval(intr3);
            return;
        break
        case 65:
            bool[12] = false;
            bool[13] = false;
            clearInterval(intr4);
            return;
        break
    }
})