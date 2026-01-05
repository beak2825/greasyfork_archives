// ==UserScript==
// @name         AutoBattleStarRepublik
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  auto battle StarRepublik!
// @author       Max Shabalihin aka Demios
// @match        https://www.starrepublik.com/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/27382/AutoBattleStarRepublik.user.js
// @updateURL https://update.greasyfork.org/scripts/27382/AutoBattleStarRepublik.meta.js
// ==/UserScript==

function StarRepublik() {

    return {
        recovery_limit: 20,
        recovery_timer: null,
        battle_timer: null,
        init: function() {
            var self = this;
            setInterval(function(){
                location.reload();
            }, 1000*60*14);
            this.recovery_timer = setInterval(function(){
                self.init_recovery_energy(self.recovery_limit);
            }, 5000);
            this.init_battle();
            console.log('init StarRepublik');
        },
        init_recovery_energy: function(power_limit) {
            console.log('check energy...');
            var self = this;
            var max_power = parseInt(jQuery('.max-power').text());
            var power = parseInt($(jQuery('.restore-power').find('.power-to-restore')[0]).text());
            var power_txt = jQuery(jQuery('.power-text')[0]).text();
            if (power >= max_power) {
                return;
            }
            if (power >= power_limit && (power_txt == 'Восстановить' || power_txt == 'Restore')) {
                jQuery('.restore-power').click();
            }
        },
        is_battle: function() {
            return document.location.href.indexOf('battle')!==-1;
        },
        init_battle: function() {
            if(!this.is_battle()) {
                return;
            }
            try {
                var power = parseInt($($('.power-value')[0]).text())/10;
            } catch(e) {
                var power = 0;
            }
            var pre = $('#player-search-form');
            var form = $('<div class="row no-margin">');
            var div = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-6">');
            var r1 = $('<div class="form-group"><label for="smg-kill">Auto battle click</label><input type="text" class="form-control" id="smg-kill" placeholder="Count kill..."></div>');
            var r2 = $('<div class="checkbox"><label><input type="checkbox" id="smg_use_baz"> Использовать базуки</label></div>');
            var r3 = $('<button type="button" id="smg-battle" class="btn btn-default">Start</button>');
            div.append(r1, r2, r3);
            form.append(div);
            pre.prepend(form);
            $('#smg-kill').val(power);
            $('#smg-battle').data('obj', this);
            $('#smg-battle').click(this.change_battle);
        },
        change_battle: function() {
            var obj = $(this).data('obj');
            if ($(this).html()=='Start') {
                obj.battle_timer = setInterval(function(){obj.tick_battle(obj);}, 200);
                obj.tick_battle(obj);
                $(this).html('Stop!');
            } else {
                clearInterval(obj.battle_timer);
                $(this).html('Start');
            }
        },

        tick_stop: function() {
            clearInterval(this.battle_timer);
            $(document).find('#smg-battle').html('Start');
        },

        tick_battle: function(obj) {
            var cnt = parseInt($(document).find('#smg-kill').val());
            var baz = parseInt($('.ion-cannon').find('.quantity').text());
            var use_baz = $('#smg_use_baz').prop('checked');
            if (!cnt) {
                obj.tick_stop();
                return;
            }
            if (use_baz && baz > 0) {
                $('.ion-cannon').click();
            } else {
                $('.battle-form').find('.red-btn').click();
            }
            cnt = cnt - 1;
            $('#smg-kill').val(cnt);
        }
    };
}
if (typeof jQuery !== "undefined") {
    obj = StarRepublik();
    setTimeout(function(){
        obj.init();
    }, 2000);
}