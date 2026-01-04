// ==UserScript==
// @name         Cookie Clicker hack
// @namespace    https://greasyfork.org/ru/scripts/392425-cookie-clicker-hack
// @version      1.5
// @license      MIT
// @description  Just a cookie clicker hack.
// @author       hasha2982
// @match        *://orteil.dashnet.org/cookieclicker/*
// @match        *://orteil.dashnet.org/cookieclicker/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507005/Cookie%20Clicker%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/507005/Cookie%20Clicker%20hack.meta.js
// ==/UserScript==

// NOTE: Don't works in IE!

console.log('[== Starting hack... ==]');

var ans = '';
var confirmans = false;
var forCookies = {
    iter: 0,
    ctr: 0
};

const hinfo = {
    version: '1.5',
    changes: ''
};

var ac = {
    sure: false,
    click: function() {
        document.getElementById('bigCookie').click();
    },
    timer: null, // used for clearTimeout in ac.termtimer()
    termtimer: function() {
        if (ac.timer === null) {
            alert('false ac.termtimer() call');
            console.log(ac);
        } else {
            clearTimeout(ac.timer);
        }
    },
    warning: false
};

/*var spawnReindeer = function() {
    var newReindeer = new Game.shimmer('reindeer');
};*/

var mwheel = {
    active: false,
    active2: false
};

var getFree = {
    itemName: '',
    wrongItem: false
};

var buffs = {
    duration: 0,
    pow: 0
};

var CookiePatcher = {
    patchedGrimoireBackfire: function(spell) {var failChance=0;return failChance;},
    originalGrimoireBackfire: function(spell) {var failChance=0.15;if(Game.hasBuff('Magic adept'))failChance*=0.1;if(Game.hasBuff('Magic inept'))failChance*=5;if(spell.failFunc)failChance=spell.failFunc(failChance);return failChance;} // Taken from original Cookie Clicker v.2.022 code and minified.
};

document.onkeydown = function(e){
    e = e || window.event;
    var key = e.which || e.keyCode;
    if(key===72){
        hackMenu();
    } else if (key === 67) {
        ac.termtimer();
    }
}; // thx StackOverflow

var hmenuText = 'Welcome to hasha2982\'s Cookie Clicker hack v.' + hinfo.version + '!\nPlease enter a number of the function below:\n1) Earn free cookies\n2) Spawn golden cookies\n3) Autoclicker (tested on Cookie Clicker v.2.022)\n4) Mouse Wheel mode\n5) Buy for Free\n6) Earn Sugar lumps\n7) Gain buffs\n8) Grimoire hacks';

function hackMenu() {
    // if (event.code = 'KeyH') {
        ans = prompt(hmenuText);
        if (ans == '1') {
            ans = prompt('How many cookies do you want to earn?');
            if (ans === "" || ans === null) {
                alert('Cancelled.');
            } else {
                Game.cookies += Number(ans);
                Game.cookiesEarned += Number(ans);
            }
        ///////////////////////////////////////////////////
        } else if (ans == '2') {
            ans = prompt('How many cookies do you want to spawn?');
            if (!(ans === "" || ans === null) && Number(ans) > 0) {
                forCookies.iter = Number(ans);
                for (; forCookies.ctr < forCookies.iter; forCookies.ctr++) {
                    var newShimmer=new Game.shimmer("golden");
                    console.log(`Golden cookie spawned.\nIteration ${forCookies.ctr} is finished.\nIterations remaining: ${forCookies.iter - forCookies.ctr}`);
                }
                forCookies.iter = 0;
                forCookies.ctr = 0;
            } else {
                alert('Cancelled.');
            }
        }
        ////////////////////////////////////////////////////
        /*else if (ans === '3') {
            Game.Notify('Note from the hack', 'Reindeer will be spawned in 2 seconds.');
            setTimeout(spawnReindeer, 2000);
        }*/
        ////////////////////////////////////////////////////
        else if (ans == '3') {
            ans = prompt('Enter delay between clicks in ms. (1000 ms. = 1 s.)\n(press \'c\' to disable autoclicker)');
            if (ans === null || ans === "" || ans === '0' || Number(ans) < 1) {
                alert('Cancelled.');
            } else if (Number(ans) <= 100) {
                confirmans = confirm('Delay lower than 100ms. can cause lags.\nAre you sure?');
                if (confirmans === true) {
                    ac.sure = true;
                    console.log(`ac.sure is set to true\n`); console.log(ac);
                }
                // if (ac.sure === true) { // here it goes
                    ac.timer = setInterval(ac.click, Number(ans));
                // }
            } else {
                ac.timer = setInterval(ac.click, Number(ans));
            }
        }
        ////////////////////////////////////////////////////
        else if (ans === '4') {
            if (mwheel.active === false) {
                confirmans = confirm('Mouse wheel mode is disabled.\nIn mouse wheel mode every mouse wheel movement counts as a click on the cookie.\nYou can still use mouse buttons.\nPress \'OK\' to activate mouse wheel mode.\n(sorry for bad English.)');
                if (confirmans === true) {
                    mwheel.active2 = true;
                    console.log('Mouse wheel mode is activated.');
                } else {
                    alert('Cancelled.');
                }
            } else if (mwheel.active === true) {
                confirmans = confirm('Mouse wheel mode is enabled.\nIn mouse wheel mode every mouse wheel movement counts as a click on the cookie.\nYou can still use mouse buttons.\nPress \'OK\' to deactivate mouse wheel mode.\n(sorry for bad English.)');
                if (confirmans === true) {
                    mwheel.active2 = false;
                    console.log('Mouse wheel mode is deactivated.');
                } else {
                    alert('Cancelled.');
                }
            }
            if (mwheel.active2 === true) mwheel.active = true;
            else if (mwheel.active2 === false) mwheel.active = false;
            if (mwheel.active === true) document.onmousewheel = ac.click; // yoink
            else if (mwheel.active === false) document.onmousewheel = null; // null is default on orteil.dashnet.org/cookieclicker/
        }
        ////////////////////////////////////////////////////
        else if (ans === '5') {
            ans = prompt('Select what item you want to get for free:\n1) Сursor\n2) Alchemy lab\n3) Antimatter condenser\n4) Bank\n5) Chancemaker\n6) Factory\n7) Farm\n8) Fractal engine\n9) Grandma\n10) Javascript console\n11) Mine\n12) Portal\n13) Prism\n14) Shipment\n15) Temple\n16) Time machine\n17) Wizard tower'); // Cursor, Alchemy lab, Antimatter condenser, Bank, Chancemaker, Factory, Farm, Fractal engine, Grandma, Javascript console, Mine, Portal, Prism, Shipment, Temple, Time machine, Wizard tower
            getFree.wrongItem = false;
            if (ans === '1') getFree.itemName = 'Cursor';
            else if (ans === '2') getFree.itemName = 'Alchemy lab';
            else if (ans === '3') getFree.itemName = 'Antimatter condenser';
            else if (ans === '4') getFree.itemName = 'Bank';
            else if (ans === '5') getFree.itemName = 'Chancemaker';
            else if (ans === '6') getFree.itemName = 'Factory';
            else if (ans === '7') getFree.itemName = 'Farm';
            else if (ans === '8') getFree.itemName = 'Fractal engine';
            else if (ans === '9') getFree.itemName = 'Grandma';
            else if (ans === '10') getFree.itemName = 'Javascript console';
            else if (ans === '11') getFree.itemName = 'Mine';
            else if (ans === '12') getFree.itemName = 'Portal';
            else if (ans === '13') getFree.itemName = 'Prism';
            else if (ans === '14') getFree.itemName = 'Shipment';
            else if (ans === '15') getFree.itemName = 'Temple';
            else if (ans === '16') getFree.itemName = 'Time machine';
            else if (ans === '17') getFree.itemName = 'Wizard tower';
            else if (ans === null || ans === "" || ans === '') {
                alert('Cancelled.');
                getFree.wrongItem = true; // prevents you from buying nothing/error
            }
            else {
                alert('Wrong item.');
                getFree.wrongItem = true;
            }
            if (getFree.wrongItem === false) {
                ans = prompt(`How many \'${getFree.itemName}\' you want to get for free?`, '1');
                ans = Number(ans);
                if (isNaN(ans)) {
                    alert('Your answer is not a number.');
                } else if (ans === null || ans === "" || ans === '') {
                    alert('Cancelled.');
                } else {
                    Game.Objects[getFree.itemName].getFree(ans);
                }
            }
        }
        ////////////////////////////////////////////////////
        else if (ans === '6') {
            ans = prompt('How many sugar lumps do you want to gain?');
            if (ans === null || ans === "" || ans === '') {
                alert('Cancelled.');
            } else {
                ans = Number(ans);
                // checking for NaN
                if (isNaN(ans)) {
                    alert('Your answer is not a number');
                } else {
                    Game.gainLumps(ans);
                    Game.Notify('Note from the hack', `${ans} sugar lump(s) is gained.`);
                    // beautifying :D
                    /*
                    var ansLast = ans.slice(-1);
                    if (ansLast == '1') {
                        Game.Notify('Note from the hack', `${ans} sugar lump(s) is gained.`);
                    } else {
                        Game.Notify('Note from the hack', `${ans} sugar lumps is gained.`);
                    }
                    */
                }
            }
        }
        ////////////////////////////////////////////////////
        else if (ans === '7') {
            ans = prompt('Enter a number of a buff below:\n1) Frenzy\nNew buffs will be added soon.');
            if (ans === '1') {
                ans = prompt('Enter duration of the buff in seconds.');
                buffs.duration = Number(ans);
                if (isNaN(buffs.duration)) {
                    alert('Your answer is not a number.');
                } else {
                    ans = prompt('Enter the power of the buff.\nFor example: you have 100 cookies per second, power of the buff is 2, and now your cookies per second value is 200.');
                    buffs.pow = Number(ans);
                    if (isNaN(buffs.pow)) {
                        alert('Your answer is not a number.');
                    } else {
                        Game.gainBuff('frenzy', buffs.duration, buffs.pow);
                    }
                }
            } else if (ans === null || ans === "" || ans === '') {
                alert('Cancelled.');
            } else {
                alert('Wrong buff.');
            }
        }
        ////////////////////////////////////////////////////
        else if (ans === '8') {
            if (Game.Objects["Wizard tower"].amount <= 0 || Game.Objects["Wizard tower"].level < 2) {
                alert('Sorry, but you haven\'t unlocked it yet');
            } else {
                ans = prompt('Grimoire hacks:\n1) Set backfire chance to 0\n2) Set backfire chance to normal');
                if (ans == '1') {
                    Game.Notify('Cookie Patcher', 'Started to patch Grimoire backfire function...', null, true);
                    Game.Objects["Wizard tower"].minigame.getFailChance = CookiePatcher.patchedGrimoireBackfire;
                    Game.Notify('Cookie Patcher', 'Grimoire backfire function was patched!');
                } else if (ans == '2') {
                    Game.Notify('Cookie Patcher', 'Started to patch Grimoire backfire function...', null, true);
                    Game.Objects["Wizard tower"].minigame.getFailChance = CookiePatcher.originalGrimoireBackfire;
                    Game.Notify('Cookie Patcher', 'Grimoire backfire function was patched!');
                } else if ((ans != '1' || ans != '2') && !(ans === null || ans === "" || ans === ''))/*idk what i'm doing wrong in my life*/ {
                    alert('Wrong hack.');
                } else if (ans === null || ans === "" || ans === '') {
                    alert('Cancelled.');
                }
            }
        }
        ////////////////////////////////////////////////////
        else if (ans === null || ans === "") {
            console.log('Prevented \'Function not found\' message');
        }
        else {
            alert('Function not found.');
        }
   // }
}

console.log('[== Hack is started. ==]\nVersion: v.' + hinfo.version);