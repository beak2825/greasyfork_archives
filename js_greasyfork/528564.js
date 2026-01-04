// ==UserScript==
// @name         Cookie Grinder X
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cookie Clicker Hack
// @author       Cqmbo__
// @match        *://orteil.dashnet.org/cookieclicker/*
// @match        *://orteil.dashnet.org/cookieclicker/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashnet.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528564/Cookie%20Grinder%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/528564/Cookie%20Grinder%20X.meta.js
// ==/UserScript==

let autoclickerinterval;
let autospawngoldencookieinterval = null;
let autobuyupginterval;
let autobuyiteminterval;
let autobuyheavenlyupgsinterval
let autobuyitemEinterval;
let autokillwrinklersinterval;
let autobuyitemCinterval;
let autobuyitemcustominterval;
let autoremovebadeffectsinterval;
let speedEnabled = false;

setInterval(()=>{
document.querySelectorAll('#ascend').forEach((a) => {
a.style.zIndex = '9999';
});
},100);

var ans = '';
    var confirmer = false;

var Multi = {
    duration: 0,
    multiplier: 0
};

var forCookies = {
    iter: 0,
    ctr: 0
};

var ScrollWheel = {
    active: false,
    active2: false
};

var Wrinkler = {
    active: false,
    active2: false
};

var removebadeffects = {
    active: false,
    active2: false
};

var notes = {
    active: false,
    active2: false
};

var BuyUPGS = {
    active: false,
    active2: false
};

var BuyHeavenlyUPGS = {
    active: false,
    active2: false
};

var BuyItems = {
    active: false,
    active2: false
};

var BuyItemsCustom = {
    active: false,
    active2: false
};

var BuyItemsE = {
    active: false,
    active2: false
};

var BuyItemsC = {
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

var calculatorVisible = false;

// Insert buttons once
const Buttons = `
    <div class="containerButtons" style="position: fixed; top: 50px; right: 10px; z-index: 1000000000000;">
        <button id="free-cookies-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Free Cookies</button>
        <button id="chip-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Free Heavenly Chips</button>
        <button id="spawn-golden-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Spawn Golden Cookies</button>
	<button id="auto-spawn-golden-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Auto Spawn Golden Cookies</button>
        <button id="autoclicker-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Autoclicker</button>
        <button id="scroll-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Click on Scroll</button>
        <button id="buy-free-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Buy for Free</button>
        <button id="sugar-lumps-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Earn Sugar Lumps</button>
        <button id="gain-buffs-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Gain Buffs</button>
        <button id="grimoire-hacks-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Grimoire Hacks</button>
        <button id="upgrade-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Auto Buy Upgrades</button>
        <button id="heavenly-upgrade-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Auto Buy Heavenly Upgrades</button>
        <button id="multiplier-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Multiplier</button>
        <button id="effect-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">No Bad Effects</button>
        <button id="notes-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Hide Notifications</button>
	<button id="speed-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Speed Up Game</button>
        <button id="infinite-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Infinite Cookies</button>
        <button id="wrinkler-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Kill All Wrinklers</button>
        <button id="reset-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Reset Game</button>
        <button id="item-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Auto Buy Items</button>
        <button id="item-custom-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Auto Buy Custom Items</button>
        <button id="item-expensive-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Auto Buy Most Expensive Item</button>
        <button id="item-cheap-button" style="display: block; margin-bottom: 10px; background-color: #2196f3; color: white;">Auto Buy Most Cheap Item</button>
    </div>
`;

document.body.insertAdjacentHTML('beforeend', Buttons);

// Attach event listeners to each button
function attachButtonListeners() {
	document.getElementById('infinite-button').addEventListener('click', () => {
    	if (Game.cookies !== Infinity && Game.cookiesEarned !== Infinity) {
        	confirmer = confirm('Are you sure you want Infinite Cookies? This cannot be reversed! (It can, but not completely:( ).');
    	} else {
        	confirmer = confirm('Are you sure you want to set back your cookies? You will lose your infinite power! :) ');
    	}
    	if (confirmer === true) {
        if (Game.cookies !== Infinity && Game.cookiesEarned !== Infinity) {
            Game.cookies = Infinity;
            Game.cookiesEarned = Infinity;
        } else {
            ans = prompt('How many cookies do you want to set your cookies to?');
            Game.cookies = Number(ans);
            Game.cookiesEarned = Number(ans);
        }
    }
});
    document.getElementById('free-cookies-button').addEventListener('click', () => {
         ans = prompt('How many cookies do you want to earn?');
            if (ans === "" || ans === null) {
                alert('Cancelled.');
            } else {
                Game.cookies += Number(ans);
                Game.cookiesEarned += Number(ans);
            }
    });
    document.getElementById('spawn-golden-button').addEventListener('click', () => {
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
    });

let gameSpeedValue = 2;
const originalDateNow = Date.now;

document.getElementById('speed-button').addEventListener('click', () => {
    if (speedEnabled) {
        // Disable speed, restore normal Date.now
        Date.now = originalDateNow;
	alert("Speed increase disabled");
        console.log("Speed increase disabled");
        speedEnabled = false;
    } else {
        // Prompt to set speed multiplier
        let ans = prompt('How much do you want to speed up your game?');

        if (!(ans === "" || ans === null) && Number(ans) > 0) {
            gameSpeedValue = Number(ans);
            // Enable speed and modify Date.now
            Date.now = () => originalDateNow() * gameSpeedValue;
            console.log("Speed increase enabled");
            speedEnabled = true;
        } else {
            alert('Cancelled.');
        }
    }
});


let spawnInterval = 1000; // Default spawn interval (1 second)

document.getElementById('auto-spawn-golden-button').addEventListener('click', () => {
    if (autospawngoldencookieinterval) {
        clearInterval(autospawngoldencookieinterval);
        autospawngoldencookieinterval = null;
        alert('Auto Spawn Golden Cookies disabled.');
    } else {
        let choice = prompt('Choose an option:\n1️⃣ Set how many golden cookies to spawn per interval.\n2️⃣ Set how often golden cookies spawn (in milliseconds).');

        if (choice === '1') {
            let ans = prompt('Do you want to automatically spawn golden cookies? Turning on auto clicker is recommended to prevent lag.\n\nEnter the number of golden cookies to spawn per interval:');
            let cookieCount = parseInt(ans, 10);

            if (!isNaN(cookieCount) && cookieCount > 0) {
                autospawngoldencookieinterval = setInterval(() => spawngcookie(cookieCount), spawnInterval);
                alert(`Auto Spawn Golden Cookies enabled. Spawning ${cookieCount} golden cookies per ${spawnInterval} milliseconds.`);
            } else {
                alert('Invalid input or cancelled. Auto-spawn not enabled.');
            }
        } 
        else if (choice === '2') {
            let ans = prompt('Enter how often golden cookies should spawn (in milliseconds, e.g., 1000 for 1 second):');
            let interval = parseInt(ans, 10);

            if (!isNaN(interval) && interval > 0) {
                spawnInterval = interval;
                alert(`Golden cookies will now spawn every ${spawnInterval} milliseconds.`);
            } else {
                alert('Invalid input or cancelled. Auto-spawn interval not changed.');
            }
        } 
        else {
            alert('Invalid choice. Auto-spawn not enabled.');
        }
    }
});

function spawngcookie(cookieCount) {
    for (let i = 0; i < cookieCount; i++) {
        new Game.shimmer("golden"); // Create a golden cookie
    }
}


document.getElementById('autoclicker-button').addEventListener('click', () => {
    if (autoclickerinterval) {
        clearInterval(autoclickerinterval);
        autoclickerinterval = null; // Reset interval
        alert('Autoclicker disabled.');
    }

    let ans = prompt('Enter interval (delay) between clicks in ms (eg: 0.001 ms -> 1000 ms.)\n(press \'c\' to disable autoclicker)');
    if (ans === null || ans === "" || ans === '0') {
        alert('Cancelled.');
    } else {
        autoclickerinterval = setInterval(clickcookie, Number(ans));
    }
});
    document.getElementById('scroll-button').addEventListener('click', () => {
            if (ScrollWheel.active === false) {
                confirmer = confirm('Click on Scroll is disabled.\nIn Click on Scroll every time you scroll counts as a click on the cookie.\nYou can still use mouse buttons.\nPress \'OK\' to activate mouse wheel mode.');
                if (confirmer === true) {
                    ScrollWheel.active2 = true;
                } else {
                    alert('Cancelled.');
                }
            } else if (ScrollWheel.active === true) {
                confirmer = confirm('Click on Scroll is enabled.\nIn Click on Scroll every time you scroll counts as a click on the cookie.\nYou can still use mouse buttons.\nPress \'OK\' to deactivate mouse wheel mode.');
                if (confirmer === true) {
                    ScrollWheel.active2 = false;
                } else {
                    alert('Cancelled.');
                }
            }
            if (ScrollWheel.active2 === true) ScrollWheel.active = true;
            else if (ScrollWheel.active2 === false) ScrollWheel.active = false;
            if (ScrollWheel.active === true) document.onmousewheel = clickcookie;
            else if (ScrollWheel.active === false) document.onmousewheel = null;
    });
    document.getElementById('buy-free-button').addEventListener('click', () => {
        ans = prompt('Select what item you want to get for free:\n1) Сursor\n2) Grandma\n3) Farm\n4) Mine\n5) Factory\n6) Bank\n7) Temple\n8) Wizard Tower\n9) Shipment\n10) Alchemy Lab\n11) Portal\n12) Time Machine\n13) Antimatter condenser\n14) Prism\n15) Chancemaker\n16) Fractal engine\n17) Javascript console\n18) Idleverse\n19) Cortex Baker\n20) You');
            getFree.wrongItem = false;
            if (ans === '1') getFree.itemName = 'Cursor';
            else if (ans === '2') getFree.itemName = 'Grandma';
            else if (ans === '3') getFree.itemName = 'Farm';
            else if (ans === '4') getFree.itemName = 'Mine';
            else if (ans === '5') getFree.itemName = 'Factory';
            else if (ans === '6') getFree.itemName = 'Bank';
            else if (ans === '7') getFree.itemName = 'Temple';
            else if (ans === '8') getFree.itemName = 'Wizard Tower';
            else if (ans === '9') getFree.itemName = 'Shipment';
            else if (ans === '10') getFree.itemName = 'Alchemy Lab';
            else if (ans === '11') getFree.itemName = 'Portal';
            else if (ans === '12') getFree.itemName = 'Time Machine';
            else if (ans === '13') getFree.itemName = 'Antimatter condenser';
            else if (ans === '14') getFree.itemName = 'Prism';
            else if (ans === '15') getFree.itemName = 'Chancemaker';
            else if (ans === '16') getFree.itemName = 'Fractal engine';
            else if (ans === '17') getFree.itemName = 'Javascript console';
            else if (ans === '18') getFree.itemName = 'Idleverse';
            else if (ans === '19') getFree.itemName = 'Cortex Baker';
            else if (ans === '20') getFree.itemName = 'You';
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
    });
    document.getElementById('sugar-lumps-button').addEventListener('click', () => {
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
                }
            }
    });
    document.getElementById('gain-buffs-button').addEventListener('click', () => {
                    ans = prompt('Enter a number of a buff below:\n1) Frenzy\n2) blood frenzy  \n3) clot  \n4) dragon harvest  \n5) everything must go  \n6) cursed finger  \n7) click frenzy  \n8) dragonflight  \n9) cookie storm  \n10) building buff  \n11) building debuff  \n12) sugar blessing  \n13) haggler luck  \n14) haggler misery  \n15) pixie luck  \n16) pixie misery  \n17) magic adept  \n18) magic inept  \n19) devastation  \n20) sugar frenzy  \n21) loan 1  \n22) loan 1 interest  \n23) loan 2  \n24) loan 2 interest  \n25) loan 3  \n26) loan 3 interest  \n27) gifted out.');
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
} else if (ans === '2') {
    ans = prompt('Enter duration of the blood frenzy buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('blood frenzy', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '3') {
    ans = prompt('Enter duration of the clot buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('clot', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '4') {
    ans = prompt('Enter duration of the dragon harvest buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('dragon harvest', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '5') {
    ans = prompt('Enter duration of the everything must go buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('everything must go', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '6') {
    ans = prompt('Enter duration of the cursed finger buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('cursed finger', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '7') {
    ans = prompt('Enter duration of the click frenzy buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('click frenzy', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '8') {
    ans = prompt('Enter duration of the dragonflight buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('dragonflight', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '9') {
    ans = prompt('Enter duration of the cookie storm buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('cookie storm', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '10') {
    ans = prompt('Enter duration of the building buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('building buff', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '11') {
    ans = prompt('Enter duration of the building debuff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('building debuff', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '12') {
    ans = prompt('Enter duration of the sugar blessing buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('sugar blessing', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '13') {
    ans = prompt('Enter duration of the haggler luck buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('haggler luck', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '14') {
    ans = prompt('Enter duration of the haggler misery buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('haggler misery', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '15') {
    ans = prompt('Enter duration of the pixie luck buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('pixie luck', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '16') {
    ans = prompt('Enter duration of the pixie misery buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('pixie misery', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '17') {
    ans = prompt('Enter duration of the magic adept buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('magic adept', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '18') {
    ans = prompt('Enter duration of the magic inept buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('magic inept', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '19') {
    ans = prompt('Enter duration of the devastation buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('devastation', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '20') {
    ans = prompt('Enter duration of the sugar frenzy buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('sugar frenzy', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '21') {
    ans = prompt('Enter duration of the loan 1 buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('loan 1', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '22') {
    ans = prompt('Enter duration of the loan 1 interest buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('loan 1 interest', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '23') {
    ans = prompt('Enter duration of the loan 2 buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('loan 2', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '24') {
    ans = prompt('Enter duration of the loan 2 interest buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('loan 2 interest', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '25') {
    ans = prompt('Enter duration of the loan 3 buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('loan 3', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '26') {
    ans = prompt('Enter duration of the loan 3 interest buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('loan 3 interest', buffs.duration, buffs.pow);
        }
    }
} else if (ans === '27') {
    ans = prompt('Enter duration of the gifted out buff in seconds.');
    buffs.duration = Number(ans);
    if (isNaN(buffs.duration)) {
        alert('Your answer is not a number.');
    } else {
        ans = prompt('Enter the power of the buff.');
        buffs.pow = Number(ans);
        if (isNaN(buffs.pow)) {
            alert('Your answer is not a number.');
        } else {
            Game.gainBuff('gifted out', buffs.duration, buffs.pow);
        }
    }
} else if (ans === null || ans === "" || ans === '') {
    alert('Cancelled.');
} else {
    alert('Wrong buff.');
}

    });
    document.getElementById('grimoire-hacks-button').addEventListener('click', () => {
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
    });
}

    document.getElementById('upgrade-button').addEventListener('click', () => {
            if (BuyUPGS.active === false) {
                confirmer = confirm('Auto Buy Upgrades is disabled.\nPress \'OK\' to activate Auto Buy Upgrades.');
                if (confirmer === true) {
                    BuyUPGS.active2 = true;
                } else {
                    alert('Cancelled.');
                }
            } else if (BuyUPGS.active === true) {
                confirmer = confirm('Auto Buy Upgrades is enabled.\nPress \'OK\' to deactivate Auto Buy Upgrades.');
                if (confirmer === true) {
                    BuyUPGS.active2 = false;
                } else {
                    alert('Cancelled.');
                }
            }
            if (BuyUPGS.active2 === true) BuyUPGS.active = true;
            else if (BuyUPGS.active2 === false) BuyUPGS.active = false;
            if (BuyUPGS.active === true) autobuyupginterval = setInterval(buyUpgrades, 100);
            else if (BuyUPGS.active === false) {clearInterval(autobuyupginterval);
                                                 autobuyupginterval = null; // Reset interval
                                                }
    });

    document.getElementById('item-button').addEventListener('click', () => {
            if (BuyItems.active === false) {
                confirmer = confirm('Auto Buy Items is disabled. \nPress \'OK\' to activate Auto Buy Items.');
                if (confirmer === true) {
                    BuyItems.active2 = true;
                } else {
                    alert('Cancelled.');
                }
            } else if (BuyItems.active === true) {
                confirmer = confirm('Auto Buy Items is enabled. \nPress \'OK\' to deactivate Auto Buy Items.');
                if (confirmer === true) {
                    BuyItems.active2 = false;
                } else {
                    alert('Cancelled.');
                }
            }
            if (BuyItems.active2 === true) BuyItems.active = true;
            else if (BuyItems.active2 === false) BuyItems.active = false;
            if (BuyItems.active === true) autobuyiteminterval = setInterval(buyItems, 100); // replace w/ AutoBuyItems custom
            else if (BuyItems.active === false) {clearInterval(autobuyiteminterval);
                                                 autobuyiteminterval = null; // Reset interval
                                                }
    });

document.getElementById('heavenly-upgrade-button').addEventListener('click', () => {
    if (BuyHeavenlyUPGS.active === false) {
        const confirmer = confirm('Auto Buy Heavenly Upgrades is disabled. \nPress \'OK\' to activate Auto Buy Heavenly Upgrades. To deactivate you can also click "e" key. \n\nNote: Even when paused, Auto Buy Heavenly Upgrades will still run till all upgrades have been processed and finished. \n\nIf there is an error/you want to stop immediately, refresh page.');
        if (confirmer === true) {
            BuyHeavenlyUPGS.active2 = true;
            BuyHeavenlyUPGS.active = true;

            autobuyheavenlyupgsinterval = setInterval(buyHeavenlyUpgrades, 100);
        } else {
            alert('Cancelled.');
        }
    } else if (BuyHeavenlyUPGS.active === true) {
        const confirmer = confirm('Auto Buy Heavenly Upgrades is enabled. \nPress \'OK\' to deactivate Auto Buy Heavenly Upgrades. Click to get out of dark screen.');
        if (confirmer === true) {
            BuyHeavenlyUPGS.active2 = false;
            BuyHeavenlyUPGS.active = false;
            clearInterval(autobuyheavenlyupgsinterval);
            autobuyheavenlyupgsinterval = null;
        } else {
            alert('Cancelled.');
        }
    }
});


		document.getElementById('item-custom-button').addEventListener('click', () => {
    if (BuyItemsCustom.active === false) {
        // Prompt for item name if auto-buy is disabled
        const itemName = prompt("Enter the item name to buy:");
        if (!itemName) {
            alert('No item name provided. Auto Buy Items will remain disabled.');
            return; // Exit if no input is provided
        }

        BuyItemsCustom.active2 = true; // Enable the auto-buying flag
        BuyItemsCustom.active = true; // Set active to true

        // Start the interval to repeatedly call the autoBuyItemsCustomCustom function
        autobuyitemcustominterval = setInterval(() => {
            autoBuyItemsCustomCustom(itemName); // Pass the user input to the custom function
        }, 100);
    } else if (BuyItemsCustom.active === true) {
        // If auto-buy is currently enabled, prompt to disable
        const confirmer = confirm('Auto Buy Items is enabled. \nPress \'OK\' to deactivate Auto Buy Items.');
        if (confirmer === true) {
            BuyItemsCustom.active2 = false; // Disable the auto-buying flag
            BuyItemsCustom.active = false; // Set active to false
            clearInterval(autobuyitemcustominterval); // Clear the interval
            autobuyitemcustominterval = null; // Reset interval
        } else {
            alert('Cancelled.');
        }
    }
});

// Modify autoBuyItemsCustomCustom to accept an item name as an argument
function autoBuyItemsCustomCustom(itemName) {
    const items = document.getElementsByClassName('title productName');
      const storeBulkMax = document.getElementById('storeBulkMax');
    for (let i = 0; i < items.length; i++) {
      if (storeBulkMax && storeBulkMax.style.visibility === 'hidden') {
        if (items[i].textContent.trim() === itemName.trim()) { // Compare text content
            items[i].click(); // Click the item if it matches the answer
        }
    }
}
}



document.onkeydown = function(e) {
    e = e || window.event;
    let key = e.which || e.keyCode;
    if (key === 67 && autoclickerinterval) { // 'C' key
        clearInterval(autoclickerinterval);
        autoclickerinterval = null; // Reset interval
        alert('Autoclicker disabled.');
    } else if (key === 69){
        clearInterval(autobuyheavenlyupgsinterval);
        autobuyheavenlyupgsinterval = null; // Reset interval
        document.getElementById('heavenly-upgrade-button').click();
    }
};

const cookie = document.getElementById('bigCookie');
const goldencookies = document.querySelectorAll('shimmer');


function clickcookie() {
    cookie.click();

Game.ClickCookie();

        let isMouseDown = false;

    // Function to simulate mouse down event
    function mouseDown() {
        const event = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        cookie.dispatchEvent(event);
        isMouseDown = true;
    }

    // Function to simulate mouse up event
    function mouseUp() {
        const event = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        cookie.dispatchEvent(event);
        isMouseDown = false;
    }

    // Toggle between mouse down and mouse up events
        if (isMouseDown) {
            mouseUp();
        } else {
            mouseDown();
        }

    // Select and click all golden cookies dynamically
    const goldencookies = document.querySelectorAll('.shimmer');
    goldencookies.forEach((goldencookie) => {
        goldencookie.click();
    });
}

function buyUpgrades() {
  const upgrades = document.getElementsByClassName('crate upgrade enabled');
  for (let i = 0; i < upgrades.length; i++) {
    upgrades[i].click();
  }
}

function buyHeavenlyUpgrades() {
    const upgrades = document.getElementsByClassName('crate upgrade heavenly');
    let i = 0;

    function processUpgrade() {
        if (i >= upgrades.length) {
            return; // Stop when all upgrades are processed
        }

        if (document.getElementById('promptAnchor') && document.getElementById('promptAnchor').style.display !== 'none' && document.getElementById('promptContentPickPermaUpgrade')) {
            // document.getElementById('promptAnchor').remove();
            dealwithprompt();
        } else {
            upgrades[i].click();
            setTimeout(function() {
                 document.getElementById('promptAnchor').style.display = 'none';
             }, 15);
        }

        i++;
        setTimeout(processUpgrade, 100); // Delay of 100ms between each upgrade
    }

    processUpgrade(); // Start processing upgrades
}


function dealwithprompt() {
    for (let i = 0; i <= 5; i++) {
        let upgradeElement = document.getElementById('upgradeForPermanent' + i);
        if (upgradeElement) {
            upgradeElement.click();
            setTimeout(function() {
                let promptOption = document.getElementById('promptOption0');
                if (promptOption) {
                    promptOption.click();
                }
            }, 10);
            setTimeout(function() {
                let promptClose = document.getElementById('promptClose');
                if (promptClose && document.getElementById('promptContentPickPermaUpgrade')) {
                    promptClose.click();
                }
            }, 15);
            break; // Exit loop after the first matching element is found and clicked
        }
    }
}


function buyItems() {
  const items = document.getElementsByClassName('product unlocked enabled');
      const storeBulkMax = document.getElementById('storeBulkMax');
  for (let i = 0; i < items.length; i++) {
      if (storeBulkMax && storeBulkMax.style.visibility === 'hidden') {
    items[i].click();
      }
  }
}

// Function to buy the most expensive item, only if the price text color is '#6f6'
function autobuyMostExpensiveItem() {
    const items = document.getElementsByClassName('product unlocked enabled');
    let mostExpensiveItem = null;
    let highestPrice = 0;
      const storeBulkMax = document.getElementById('storeBulkMax');
    for (let i = 0; i < items.length; i++) {
      if (storeBulkMax && storeBulkMax.style.visibility === 'hidden') {
        const priceElement = items[i].getElementsByClassName('price')[0]; // Get the price element
        const priceText = priceElement ? priceElement.textContent.trim() : "";
        const priceColor = window.getComputedStyle(priceElement).color; // Get the color of the price text

        // Check if the price color is '#6f6' (RGB format comparison for '#6f6')
        if (priceColor === 'rgb(102, 255, 102)') {
            const priceValue = parsePriceToNumber(priceText); // Parse the price text

            if (priceValue > highestPrice) {
                highestPrice = priceValue;
                mostExpensiveItem = items[i];
            }
        }
    }

    // Click the most expensive item if it exists
    if (mostExpensiveItem) {
        mostExpensiveItem.click();
    }
}
}

    // Function to buy the cheapest item, only if the price text color is '#6f6'
function autobuyCheapestItem() {
    const items = document.getElementsByClassName('product unlocked enabled');
    let cheapestItem = null;
    let lowestPrice = Infinity;

      const storeBulkMax = document.getElementById('storeBulkMax');
    for (let i = 0; i < items.length; i++) {
        if (storeBulkMax && storeBulkMax.style.visibility === 'hidden') {
        const priceElement = items[i].getElementsByClassName('price')[0]; // Get the price element
        const priceText = priceElement ? priceElement.textContent.trim() : "";
        const priceColor = window.getComputedStyle(priceElement).color; // Get the color of the price text

        // Check if the price color is '#6f6' (RGB format comparison for '#6f6')
        if (priceColor === 'rgb(102, 255, 102)') {
            const priceValue = parsePriceToNumber(priceText); // Parse the price text

            if (priceValue < lowestPrice) {
                lowestPrice = priceValue;
                cheapestItem = items[i];
            }
        }
    }

    // Click the cheapest item if it exists
    if (cheapestItem) {
        cheapestItem.click();
    }
}
}

// Helper function to convert formatted price text to a number (up to Centillion)
function parsePriceToNumber(priceText) {
    let multiplier = 1;
    let numberPart = priceText;

    const scaleMap = {
        "million": 1e6,
        "billion": 1e9,
        "trillion": 1e12,
        "quadrillion": 1e15,
        "quintillion": 1e18,
        "sextillion": 1e21,
        "septillion": 1e24,
        "octillion": 1e27,
        "nonillion": 1e30,
        "decillion": 1e33,
        "undecillion": 1e36,
        "duodecillion": 1e39,
        "tredecillion": 1e42,
        "quattuordecillion": 1e45,
        "quindecillion": 1e48,
        "sexdecillion": 1e51,
        "septendecillion": 1e54,
        "octodecillion": 1e57,
        "novemdecillion": 1e60,
        "vigintillion": 1e63,
        "unvigintillion": 1e66,
        "duovigintillion": 1e69,
        "tresvigintillion": 1e72,
        "quattuorvigintillion": 1e75,
        "quinvigintillion": 1e78,
        "sesvigintillion": 1e81,
        "septemvigintillion": 1e84,
        "octovigintillion": 1e87,
        "novemvigintillion": 1e90,
        "trigintillion": 1e93,
        "untrigintillion": 1e96,
        "duotrigintillion": 1e99,
        "trestrigintillion": 1e102,
        "quattuortrigintillion": 1e105,
        "quintrigintillion": 1e108,
        "sestrigintillion": 1e111,
        "septentrigintillion": 1e114,
        "octotrigintillion": 1e117,
        "noventrigintillion": 1e120,
        "quadragintillion": 1e123,
        "unquadragintillion": 1e126,
        "duoquadragintillion": 1e129,
        "tresquadragintillion": 1e132,
        "quattuorquadragintillion": 1e135,
        "quinquadragintillion": 1e138,
        "sesquadragintillion": 1e141,
        "septenquadragintillion": 1e144,
        "octoquadragintillion": 1e147,
        "novenquadragintillion": 1e150,
        "quinquagintillion": 1e153,
        "unquinquagintillion": 1e156,
        "duoquinquagintillion": 1e159,
        "tresquinquagintillion": 1e162,
        "quattuorquinquagintillion": 1e165,
        "quinquinquagintillion": 1e168,
        "sesquinquagintillion": 1e171,
        "septenquinquagintillion": 1e174,
        "octoquinquagintillion": 1e177,
        "novenquinquagintillion": 1e180,
        "sexagintillion": 1e183,
        "unsexagintillion": 1e186,
        "duosexagintillion": 1e189,
        "tresexagintillion": 1e192,
        "quattuorsexagintillion": 1e195,
        "quinsexagintillion": 1e198,
        "sessexagintillion": 1e201,
        "septensexagintillion": 1e204,
        "octosexagintillion": 1e207,
        "novensexagintillion": 1e210,
        "septuagintillion": 1e213,
        "unseptuagintillion": 1e216,
        "duoseptuagintillion": 1e219,
        "treseptuagintillion": 1e222,
        "quattuorseptuagintillion": 1e225,
        "quinseptuagintillion": 1e228,
        "seseptuagintillion": 1e231,
        "septenseptuagintillion": 1e234,
        "octoseptuagintillion": 1e237,
        "novenseptuagintillion": 1e240,
        "octogintillion": 1e243,
        "unoctogintillion": 1e246,
        "duooctogintillion": 1e249,
        "tresoctogintillion": 1e252,
        "quattuoroctogintillion": 1e255,
        "quinoctogintillion": 1e258,
        "sexoctogintillion": 1e261,
        "septemoctogintillion": 1e264,
        "octooctogintillion": 1e267,
        "novemoctogintillion": 1e270,
        "nonagintillion": 1e273,
        "unnonagintillion": 1e276,
        "duononagintillion": 1e279,
        "tresnonagintillion": 1e282,
        "quattuornonagintillion": 1e285,
        "quinnonagintillion": 1e288,
        "senonagintillion": 1e291,
        "septenonagintillion": 1e294,
        "octononagintillion": 1e297,
        "novenonagintillion": 1e300,
        "centillion": 1e303
    };

    // Find and apply the appropriate multiplier
    for (const [key, value] of Object.entries(scaleMap)) {
        if (priceText.includes(key)) {
            multiplier = value;
            numberPart = priceText.replace(key, "").trim();
            break;
        }
    }

    // Convert the number part to a float and apply the multiplier
    const numericValue = parseFloat(numberPart.replace(/,/g, ''));
    return numericValue * multiplier;
}



// Example: Trigger autobuy for most expensive or cheapest item
document.getElementById('item-expensive-button').addEventListener('click', () => {
    if (BuyItemsE.active === false) {
        const confirmer = confirm('Auto Buy Most Expensive Item is disabled. \nPress \'OK\' to activate Auto Buy Items for the most expensive item.');
        if (confirmer === true) {
            BuyItemsE.active2 = true;
            BuyItemsE.active = true;

            autobuyitemEinterval = setInterval(autobuyMostExpensiveItem, 100); // Buy most expensive item
        } else {
            alert('Cancelled.');
        }
    } else if (BuyItemsE.active === true) {
        const confirmer = confirm('Auto Buy Most Expensive Item is enabled. \nPress \'OK\' to deactivate Auto Buy Most Expensive Item.');
        if (confirmer === true) {
            BuyItemsE.active2 = false;
            BuyItemsE.active = false;
            clearInterval(autobuyitemEinterval);
            autobuyitemEinterval = null;
        } else {
            alert('Cancelled.');
        }
    }
});


document.getElementById('item-cheap-button').addEventListener('click', () => {
    if (BuyItemsC.active === false) {
        const confirmer = confirm('Auto Buy Cheapest Item is disabled. \nPress \'OK\' to activate Auto Buy Items for the most cheap item.');
        if (confirmer === true) {
            BuyItemsC.active2 = true;
            BuyItemsC.active = true;

            autobuyitemCinterval = setInterval(autobuyCheapestItem, 100); // Buy most cheap item
        } else {
            alert('Cancelled.');
        }
    } else if (BuyItemsC.active === true) {
        const confirmer = confirm('Auto Buy Cheapest Item is enabled. \nPress \'OK\' to deactivate Auto Buy Most Cheapest Item.');
        if (confirmer === true) {
            BuyItemsC.active2 = false;
            BuyItemsC.active = false;
            clearInterval(autobuyitemCinterval);
            autobuyitemCinterval = null;
        } else {
            alert('Cancelled.');
        }
    }
});

document.getElementById('multiplier-button').addEventListener('click', () => {
  // Ask for duration first
  let durationAns = prompt('How long do you want your multiplier to last?');
  Multi.duration = Number(durationAns);

  if (isNaN(Multi.duration) || Multi.duration < 1) {
    alert('Invalid input for duration');
    return; // Exit early if the input is invalid
  }

  // Ask for multiplier next
  let multiplierAns = prompt('How much do you want to multiply?');
  Multi.multiplier = Number(multiplierAns);

  if (isNaN(Multi.multiplier) || Multi.multiplier < 1) {
    alert('Invalid input for multiplier');
  } else {
    // Apply buffs if both inputs are valid
    Game.gainBuff('frenzy', Multi.duration, Multi.multiplier);
    Game.gainBuff('click frenzy', Multi.duration, Multi.multiplier);
    Game.gainBuff('devastation', Multi.duration, Multi.multiplier);
    Game.gainBuff('dragon harvest', Multi.duration, Multi.multiplier);
    Game.gainBuff('sugar frenzy', Multi.duration, Multi.multiplier);
    Game.gainBuff('sugar blessing', Multi.duration, Multi.multiplier);
  }
});


document.getElementById('reset-button').addEventListener('click', ()=> {
confirmer = confirm('Are you sure you want to reset?');
if(confirmer === true){
confirmer = confirm('⚠LAST WARNING⚠ If you reset you\'\ll lose all progress, farms, cookies & upgrades. Do you still want to reset?');
if(confirmer === true){
Game.HardReset(2);
}
}
});

document.getElementById('chip-button').addEventListener('click', ()=> {
    ans = prompt('How many heavenly chips do you want to earn?');
           if (ans === "" || ans === null) {
               alert('Cancelled.');
           } else {
               Game.heavenlyChips += Number(ans);
           }
});

document.getElementById('wrinkler-button').addEventListener('click', ()=> {
    if (Wrinkler.active === false) {
        const confirmer = confirm('Auto Kill Wrinklers is disabled. \nPress \'OK\' to activate Auto Kill Wrinklers.');
        if (confirmer === true) {
            Wrinkler.active2 = true;
            Wrinkler.active = true;

            autokillwrinklersinterval = setInterval(killwrinklers, 100);
        } else {
            alert('Cancelled.');
        }
    } else if (Wrinkler.active === true) {
        const confirmer = confirm('Auto Kill Wrinklers is enabled. \nPress \'OK\' to deactivate Kill Wrinklers.');
        if (confirmer === true) {
            Wrinkler.active2 = false;
            Wrinkler.active = false;
            clearInterval(autokillwrinklersinterval);
            autokillwrinklersinterval = null;
        } else {
            alert('Cancelled.');
        }
    }

});

function killwrinklers(){
           // Create a function to pop all wrinklers on the screen.
    setTimeout(function() { for (var i in Game.wrinklers) { var me=Game.wrinklers[i]; if (me.phase==2) { me.hurt=1; me.hp--; var x=me.x+(Math.sin(me.r*Math.PI/180)*100); var y=me.y+(Math.cos(me.r*Math.PI/180)*100); for (var ii=0;ii<4;ii++) { Game.particleAdd(x+Math.random()*50-25,y+Math.random()*50-25,Math.random()*4-2,Math.random()*-2-2,1,1,2,'wrinklerBits.png'); } } } }, 200);
}

document.getElementById('notes-button').addEventListener('click', ()=> {
    if (notes.active === false) {
        const confirmer = confirm('Auto Hide Notes (Notifications) is disabled. \nPress \'OK\' to activate Auto Hide Notes (Notifications).');
        if (confirmer === true) {
            notes.active2 = true;
            notes.active = true;

            document.getElementById('notes').style.display = 'none';
        } else {
            alert('Cancelled.');
        }
    } else if (notes.active === true) {
        const confirmer = confirm('Auto Hide Notes (Notifications) is enabled. \nPress \'OK\' to deactivate Auto Hide Notes (Notifications).');
        if (confirmer === true) {
            notes.active2 = false;
            notes.active = false;
            document.getElementById('notes').style.display = 'block';
        } else {
            alert('Cancelled.');
        }
    }
});

document.getElementById('effect-button').addEventListener('click', () => {
    if (!removebadeffects.active) {
        const confirmer = confirm('Auto Remove Bad Effects is disabled. \nPress "OK" to activate Auto Remove Bad Effects.');
        if (confirmer) {
            removebadeffects.active = true;
            removebadeffects.active2 = true;

            const badBuffs = ['clot', 'building debuff'];
            autoremovebadeffectsinterval = setInterval(() => {
                const origGainBuff = Game.gainBuff; // eslint-disable-line
                Game.gainBuff = function (type, time, ...args) { // eslint-disable-line
                    if (typeof type !== 'string' || badBuffs.includes(type)) {
                        return console.log(`The "${type}" buff was prevented from affecting your CpS.`);
                    }
                    origGainBuff(type, time, ...args); // Call original function if no bad buff
                };
            }, 100);
        } else {
            alert('Cancelled.');
        }
    } else {
        const confirmer = confirm('Auto Remove Bad Effects is enabled. \nPress "OK" to deactivate Auto Remove Bad Effects.');
        if (confirmer) {
            removebadeffects.active = false;
            removebadeffects.active2 = false;

            clearInterval(autoremovebadeffectsinterval);
            autoremovebadeffectsinterval = null;
        } else {
            alert('Cancelled.');
        }
    }
});




    attachButtonListeners();