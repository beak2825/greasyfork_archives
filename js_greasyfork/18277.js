// ==UserScript==
// @name        infinite retail smasher
// @namespace   yichizhng@gmail.com
// @description plays BvS infinite retail (poorly)
// @include     http://*animecubed.com/billy/bvs/shop-retail.html
// @include     https://*animecubedgaming.com/billy/bvs/shop-retail.html
// @version     3.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18277/infinite%20retail%20smasher.user.js
// @updateURL https://update.greasyfork.org/scripts/18277/infinite%20retail%20smasher.meta.js
// ==/UserScript==

// returns true if on the main page and an appropriate level is checked
var preflightCheck = function() {
    // Check that infinite is actually unlocked
    var infinite = document.querySelector('#diff9');
    var multiplier = document.querySelector('[name="rtmultiplier"]');
    if (multiplier) {
        multiplier.value = 5;
    }
    if (infinite) {
        infinite.checked = true;
        var difficultyinput = document.querySelector('[name=bfrilvl]');
        if (multiplier) {
            multiplier.value = 1;
        }
        if (difficultyinput.value >= 11) {
            difficultyinput.value = 11;
            if (multiplier) {
                multiplier.value = 5;
            }
        }
        return true;
    } else {
        var tier8 = document.querySelector('#diff8');
        if (tier8) {
            tier8.checked = true;
            return true;
        } else {
            var tier7 = document.querySelector('#diff7');
            if (tier7) {
                tier7.checked = true;
                return true;
            }
        }
    }
    return false;
};

// returns false if recommended actions are set; otherwise
// selects recommended actions and returns true.
var setActions = function() {
    if (!document.suppressrt) return;
    var barge = document.querySelector('#supK1');
    var deathstare = document.querySelector('#supN6');
    var newrelease = document.querySelector('#supM1');
    var boot = document.querySelector('#supI');
    var bogo = document.querySelector('#supH1');
    var entice = document.querySelector('#supJ1');
    var waifu = document.querySelector('#supV2');
    var upsell = document.querySelector('#supV4');
    var hey = document.querySelector('#supV5');
    var trapdoor = document.querySelector('#supK6');
    var hype = document.querySelector('#supK9');
    var voice = document.querySelector('#supK7');
    var submanager = document.querySelector('select[name="pick_subm"]');
    var changed = false;
    if (!barge.checked) { barge.checked = true; changed = true; }
    if (!deathstare.checked) { deathstare.checked = true; changed = true; }
    if (newrelease.checked) { newrelease.checked = false; changed = true; }
    if (boot.checked) { boot.checked = false; changed = true; }
    if (!bogo.checked) { bogo.checked = true; changed = true; }
    if (!entice.checked) { entice.checked = true; changed = true; }
    if (waifu.checked) { waifu.checked = false; changed = true; }
    if (!upsell.checked) { upsell.checked = true; changed = true; }
    if (hey.checked) { hey.checked = false; changed = true; }
    if (!hype.checked) { hype.checked = true; changed = true; }
    if (trapdoor && trapdoor.checked) { trapdoor.checked = false; changed = true; }
    if (voice && voice.checked) { voice.checked = false; changed = true;}
    if (submanager.value != 3) { submanager.value = 3; changed = true; }
    if (changed) { console.log('Not using recommended actions!'); }
    return changed;
};

var Customer = function Customer(name, splusl, bounty, RPT, status, select) {
    this.isEmpty = !name;
    if (this.isEmpty) return;
    this.name = name;
    this.splusl = splusl;
    this.bounty = bounty;
    this.RPT = RPT;
    this.status = status;

    // function to select this customer
    this.select = select;
};

var hypeDamage = function(customer) {
    if (customer.isEmpty) {
        return 0;
    }
    // TODO: improve this heuristic?
    if (customer.status == 'Hyped') {
        // TODO: this should probably just be return normalDamage(customer, 4)
        if (customer.splusl > 6) {
            return 4 * customer.RPT / 2;
        } else if (customer.splusl > 2) {
            return (customer.splusl) * customer.RPT / 2;
        } else {
            return 0;
        }
    }
    if (customer.splusl <= 6) {
        return (customer.splusl + 1) * customer.RPT;
    }
    var damage = (customer.splusl + 6) / 2;
    if (customer.status == 'Annoying') {
        return damage * (customer.RPT-1) + customer.splusl + 1 ;
    }
    return damage * customer.RPT;
};

var normalDamage = function(customer, amount) {
    if (customer.isEmpty) {
        return 0;
    }

    if (customer.status == 'Hyped') {
        // TODO: improve this heuristic?
        if (customer.splusl > amount + 2) {
            return (amount) * customer.RPT / 2;
        } else if (customer.splusl > 2) {
            return (customer.splusl) * customer.RPT / 2;
        } else {
            return 0;
        }
    } else {
        if (amount >= customer.splusl) {
            amount = customer.splusl;
        } else if (amount >= customer.splusl - 3) {
            amount = customer.splusl - 3;
        } else if (amount >= customer.splusl - 6) {
            amount = customer.splusl - 6;
        }
        if (customer.splusl > amount) {
            return amount * customer.RPT;
        } else {
            return (customer.splusl + 1) * customer.RPT;
        }
    }
};

var customerRPT = {
    // These are my current guesses on average rage/turn
    'Fanboy': 2/9,
    'Fangirl': 2/3,

    'Bad Haggler': 1/2,
    'Buffet': 1/3,
    'Ghost Michelle': 4/3,
    'Hater': 1,
    'One-Up': 2/3,
    'Shipper': 1/2,
    'Skimmer': 1/3,
    'Soft Talker': 1,
    'Wanderer': 1/4,
    'Umm': 1,

    'Clumsy Cosplayer': 3/4,
    'Model': 2/3,

    'Cardrat': 1,
    'Bender': 1,
    'Cropduster': 5000,
    'Fighter': 3/2,

    'Childswarm': 2/3,
    'MeowMeow': 1,  // 100% act
    // Other customers omitted for irrelevance in infinite
};

var parseCustomer = function(text, select) {
    var empty = /Empty/.test(text);
    if (empty) { return new Customer(); }

    var loaf = /Loaf: ([0-9]+)/.exec(text);
    var stingy = /S.: ([0-9]+)/.exec(text);
    var annoying = /Annoying/.test(text);
    var hyped = /Hyped/.test(text);
    var stinky = /Stinky/.test(text);
    var bounty = /\(\+([0-9]+)\)/.exec(text);

    var splusl = 0;
    if (loaf) splusl += parseInt(loaf[1],10);
    if (stingy) splusl += parseInt(stingy[1],10);

    var customerType =
        /(Fanboy|Fangirl|Bad Haggler|Buffet|Ghost Michelle|Hater|One-Up|Shipper|Skimmer|Soft Talker|Wanderer|Umm|Clumsy Cosplayer|Model|Cardrat|Bender|Cropduster|Fighter|Childswarm|MeowMeow|Tsk)/.exec(text);
    if (!customerType) {
        // console.log('Assuming that customer is shadow player...')
        customerType = ['', 'Shadow Player'];
    }
    var RPT = customerRPT[customerType[1]];
    if (customerType[1] == 'Tsk') {
        var dirtyLevel = /Dirty Store \(Level ([0-9]+)\)/.exec(document.body.textContent);
        if (dirtyLevel) {
            RPT = parseInt(dirtyLevel[1],10) * 0.4;
        } else {
            RPT = 0;
        }
    } else if (customerType[1] == 'Shadow Player') {
        RPT = -1/3;
   }
    if (annoying) {
        RPT += 1;
    }
    return new Customer(customerType[1], splusl, bounty ? bounty[1] : 0, RPT, hyped ? 'Hyped' : stinky ? 'Stinky' : annoying ? 'Annoying' : '', select);
};

var storeParser = function() {
    // Always answer the phone immediately; suboptimal, but who cares
    var phone = document.querySelector('input[value="PHONE"]');
    if (phone) {
        phone.checked = true;
        return;
    }

    // Is the store empty?
    var grumble = document.querySelector('input[value="S"]');
    if (grumble) {
        var opm = document.querySelector('input[value="F"]');
        if (opm) {
            opm.checked = true;
        } else {
            grumble.checked = true;
        }
        return;
    }



    var store = document.querySelectorAll('table[cellpadding="0"]')[4];
    var storeTable = store.children[0];
    var rows = storeTable.children;
    var topRow = rows[0].children;
    var bottomRow = rows[1].children;

    var parsedTopRow = [];
    var parsedBottomRow = [];
    // Now we try to parse the store >_>
    for (var col = 0; col < 7; col++) {
        var thingy = topRow[col].querySelector('span[onclick]');
        if (col === 0 || col == 3 || col == 6) {
            parsedTopRow.push(new Customer());
        } else { parsedTopRow.push(parseCustomer(topRow[col].textContent, thingy ? thingy.onclick : null)); }

        thingy = bottomRow[col].querySelector('span[onclick]');
        if (col == 2 || col == 4 || col == 5) {
            parsedBottomRow.push(new Customer());
        } else { parsedBottomRow.push(parseCustomer(bottomRow[col].textContent, thingy ? thingy.onclick : null)); }
    }
    var highestHypeDamage = 0;
    var selectHype = function() { alert('Something has gone wrong(selectHype)'); };
    // console.log(parsedTopRow);
    // console.log(parsedBottomRow);
    for (var i = 0; i < 7; ++i) {
        // console.log(parsedTopRow[i]);
        if (hypeDamage(parsedTopRow[i]) > highestHypeDamage) {
            highestHypeDamage = hypeDamage(parsedTopRow[i]);
            selectHype = parsedTopRow[i].select || selectHype;
        }
        // console.log(parsedBottomRow[i]);
        if (hypeDamage(parsedBottomRow[i]) > highestHypeDamage) {
            highestHypeDamage = hypeDamage(parsedBottomRow[i]);
            selectHype = parsedBottomRow[i].select || selectHype;
        }
    }
    console.log('Best hype damage: ' + highestHypeDamage);
    if (highestHypeDamage <= 0) {
        // Nothing for us to do here
        // Select any customer, nobody cares
        document.querySelector('select[name="actiontarget"]').value = 'custid1';
        fallback();
        return;
    }

    var highestNormalDamage = 0;
    var selectNormal = function() { alert('Something has gone wrong(selectNormal)'); };
    for (i = 0; i < 7; ++i) {
        if (normalDamage(parsedTopRow[i], 5) > highestNormalDamage) {
            highestNormalDamage = normalDamage(parsedTopRow[i], 5);
            selectNormal = parsedTopRow[i].select || selectNormal;
        }
        if (normalDamage(parsedBottomRow[i], 5) > highestNormalDamage) {
            highestNormalDamage = normalDamage(parsedBottomRow[i],5);
            selectNormal = parsedBottomRow[i].select || selectNormal;
        }
    }
    console.log('Best Savings Punch (5X) damage: ' + highestNormalDamage);

    var leftSide = [parsedTopRow[1], parsedTopRow[2], parsedBottomRow[0], parsedBottomRow[1]];
    var leftDamage = leftSide.map(function(c) { return normalDamage(c,3); }).reduce(function(s,e) { return s+e; });
    console.log ('Left Pitch damage: ' + leftDamage);

    var rightSide = [parsedTopRow[4], parsedTopRow[5], parsedBottomRow[3], parsedBottomRow[6]];
    var rightDamage = rightSide.map(function(c) { return normalDamage(c,3); }).reduce(function(s,e) { return s+e; });
    console.log ('Right Pitch damage: ' + rightDamage);

    var selectPitch = function() { alert ('Something has gone wrong(selectPitch)'); };
    if (leftDamage > rightDamage) {
        if (leftDamage <= 0) {
            selectPitch = leftSide.map(function(c) { return c.select; }).reduce(function(s,e) { return s || e; }) || rightSide.map(function(c) { return c.select; }).reduce(function(s,e) { return s || e; });
        } else {
            selectPitch = leftSide.map(function(c) { return c.select; }).reduce(function(s,e) { return s || e; }) || selectPitch;
        }
    } else {
        selectPitch = rightSide.map(function(c) { return c.select; }).reduce(function(s,e) { return s || e; }) || selectPitch;
    }

    var ckDamageTopRow = parsedTopRow.map(function(c) { return normalDamage(c,4); });
    var ckDamageBottomRow = parsedBottomRow.map(function(c) { return normalDamage(c,4); });

    var figuresDamage = ckDamageTopRow[1] + ckDamageTopRow[2];
    console.log('Figures Coupon Kick damage: ' + figuresDamage);

    var mangaDamage = ckDamageBottomRow[0] + ckDamageBottomRow[1];
    console.log('Manga Coupon Kick damage: ' + mangaDamage);

    var keyChainsDamage = ckDamageTopRow[4] + ckDamageTopRow[5];
    console.log('Key Chains Coupon Kick damage: ' + keyChainsDamage);

    var entrywayDamage = ckDamageBottomRow[6];
    console.log('Entryway Coupon Kick damage: ' + entrywayDamage);

    var registerDamage = ckDamageBottomRow[3];
    console.log('Register Coupon Kick damage: ' + registerDamage);

    var maxCkDamage = Math.max(figuresDamage, mangaDamage, keyChainsDamage, entrywayDamage, registerDamage);

    var selectCk = function() { alert ('Something has gone wrong(selectCk)'); };
    if (maxCkDamage <= 0) {
        selectCk = function() {
            leftSide.map(function(c) { return c.select; }).reduce(function(s,e) { return s || e; }) || rightSide.map(function(c) { return c.select; }).reduce(function(s,e) { return s || e; });
        };
    }

    if (figuresDamage == maxCkDamage) {
        selectCk = parsedTopRow[1].select || parsedTopRow[2].select || selectCk;
    } else if (mangaDamage == maxCkDamage) {
        selectCk = parsedBottomRow[0].select || parsedBottomRow[1].select || selectCk;
    } else if (keyChainsDamage == maxCkDamage) {
        selectCk = parsedTopRow[4].select || parsedTopRow[5].select || selectCk;
    } else if (entrywayDamage == maxCkDamage) {
        selectCk = parsedBottomRow[6].select || selectCk;
    } else {
        selectCk = parsedBottomRow[3].select || selectCk;
    }


    var maxPitchDamage = Math.max(leftDamage, rightDamage);
    var damages = [highestHypeDamage, highestNormalDamage, maxCkDamage, maxPitchDamage];
    console.log(damages);
    damages.sort(function(a, b) { return b - a; });
    var maxDamage = damages[0];
    console.log(damages);

    var triedHype = false;
    var triedPitch = false;
    var triedCk = false;
    var triedNormal = false;
    while (damages.length) {
        console.log(damages);
        if (damages[0] <= 0) {
            break;  // Too lazy to write proper fallback code; just check out the good customer
        }
        if ((!triedHype) && (highestHypeDamage == damages[0])) {
            if (tryHype()) {
                console.log('Recommended action: Hype');
                selectHype();
                return;
            } else if ((damages.length == 1 || damages[0] > damages[1] + 1) && tryFreeShuffle()) {
                console.log('Recommended action: shuffle');
                // TODO: select target better
                selectHype();
                return;
            } else if ((damages.length == 1 || damages[0] > damages[1] + 1) && tryThinkFast()) {
                console.log('Recommended action: Think Fast');
                return;
            } else {
                // Since there's no way to get to hype, throw it away and try the rest
                console.log('Giving up on Hype');
                triedHype = true;
                damages.shift();
                continue;
            }
        } else if ((!triedPitch) && (maxPitchDamage == damages[0])) {
            if (tryPitch()) {
                console.log('Recommended action: Pitch');
                selectPitch();
                return;
            } else if ((damages.length == 1 || damages[0] > damages[1] + 1) && tryFreeShuffle()) {
                console.log('Recommended action: shuffle');
                selectHype();
                return;
            } else if ((damages.length == 1 || damages[0] > damages[1] + 1) && tryThinkFast()) {
                console.log('Recommended action: Think Fast');
                return;
            } else {
                // Since there's no way to get to pitch, throw it away and try the rest
                console.log('Giving up on Pitch');
                triedPitch = true;
                damages.shift();
                continue;
            }
        } else if ((!triedCk) && (maxCkDamage == damages[0])) {
            if (tryCk()) {
                console.log('Recommended action: Coupon Kick');
                selectCk();
                return;
            } else if ((damages.length == 1 || damages[0] > damages[1] + 1) && tryFreeShuffle()) {
                console.log('Recommended action: shuffle');
                selectHype();
                return;
            } else if ((damages.length == 1 || damages[0] > damages[1] + 1) && tryThinkFast()) {
                console.log('Recommended action: Think Fast');
                return;
            } else {
                // Since there's no way to get to CK, throw it away and try the rest
                console.log('Giving up on Coupon Kick');
                triedCk = true;
                damages.shift();
                continue;
            }
        } else if (!triedNormal) {
            if (tryNormal()) {
                console.log('Recommended action: Savings Punch');
                selectNormal();
                return;
            } else if ((damages.length == 1 || damages[0] > damages[1] + 1) && tryFreeShuffle()) {
                console.log('Recommended action: shuffle');
                selectHype();
                return;
            } else if ((damages.length == 1 || damages[0] > damages[1] + 1) && tryThinkFast()) {
                console.log('Recommended action: Think Fast');
                return;
            } else {
                // Since there's no way to get to sp, throw it away and try the rest
                console.log('Giving up on Savings Punch');
                triedNormal = true;
                damages.shift();
                continue;
            }
        }
    }
    document.querySelector('select[name="actiontarget"]').value = 'custid1';
    fallback(maxDamage > 1);
};

var tryHype = function() {
    var hype = document.querySelector('input[value="12"]');
    if (hype) {
        hype.checked = true;
        return true;
    }
    return false;
};

var tryPitch = function() {
    var pitch = document.querySelector('input[value="3"][type="radio"]');
    if (pitch) {
        pitch.checked = true;
        return true;
    }
    return false;
};

var tryCk = function() {
    var coupon = document.querySelector('input[value="2"][type="radio"]');
    if (coupon) {
        coupon.checked = true;
        return true;
    }
    return false;
};

var tryNormal = function() {
    var savings = document.querySelector('input[value="1"][type="radio"]');
    if (savings) {
        savings.checked = true;
        return true;
    }
    return false;
};

var tryFreeShuffle = function() {
    var bogo = document.querySelector('input[value="11"]');
    if (bogo) {
        bogo.checked = true;
        return true;
    }
    var barge = document.querySelector('input[value="5"]');
    if (barge) {
        barge.checked = true;
        return true;
    }
    return false;
};

var tryThinkFast = function() {
    var thinkfast = document.querySelector('input[value="6"]');
    if (thinkfast) {
        thinkfast.checked = true;
        return true;
    }
    return false;
};

var fallback = function(freeshuffle) {
    var hype = document.querySelector('input[value="12"]');
    if (hype) {
        hype.checked = true;
        return;
    }

    var savings = document.querySelector('input[value="1"][type="radio"]');
    if (savings) {
        savings.checked = true;
        return;
    }

    var coupon = document.querySelector('input[value="2"][type="radio"]');
    if (coupon) {
        coupon.checked = true;
        return;
    }

    var pitch = document.querySelector('input[value="3"][type="radio"]');
    if (pitch) {
        pitch.checked = true;
        return;
    }

    var barge = document.querySelector('input[value="5"]');
    if (barge) {
        barge.checked = true;
        return;
    }

    if (freeshuffle) {
    var freebies = document.querySelector('input[value="Q"]');
    if (freebies) {
        freebies.checked = true;
        return;
    }
    }
    /*
// TODO: logic on whether to do this, it's not a good action if there are hypes
  var deodorant = document.querySelector('input[value="L"]');
  if (deodorant) {
    deodorant.checked = true;
    return;
  }
  */
    var deathstare = document.querySelector('input[value="8"]');
    if (deathstare) {
        deathstare.checked = true;
        return;
    }

    var thinkfast = document.querySelector('input[value="6"]');
    if (thinkfast) {
        thinkfast.checked = true;
        return;
    }

    var wutever = document.querySelector('input[type="radio"]');
    wutever.checked = true;
    return;
};

var main = function() {
    if (document.enterretail) {
        document.addEventListener('keyup', function(e) {
            if (e.code != 'KeyD') return;
            document.enterretail.submit();
        }, false);
        return;
    }

    if (preflightCheck()) {
        console.log('Stand by for takeoff');
        var recommendedActions = setActions();
        var acted = false;
        document.addEventListener('keyup', function(e) {
            if (e.code != 'KeyD') return;
            if (acted) return;
            acted = true;
            if (!recommendedActions) {
                if (document.querySelector('a[href="javascript:document.startgame.submit();"]')) {
                    document.startgame.submit();
                } else {
                    alert('no shifts left!');
                }
            } else {
                document.suppressrt.submit();
            }
        }, false);
    } else if (document.makeaction) {
        // We're in the store! Let's play.
        storeParser();
        document.addEventListener('keyup', function(e) {
            if (e.code != 'KeyD') return;
            if (acted) return;
            acted = true;
            document.makeaction.submit();
        });
    } else if (document.movingon) {
        document.addEventListener('keyup', function(e) {
            if (acted) return;
            acted = true;
            if (e.code != 'KeyD') return;
            document.movingon.submit();
        });
    } else {
        console.log('You want the script? You can\'t handle the script!');
    }
};

main();