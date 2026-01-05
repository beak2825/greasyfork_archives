// ==UserScript==
// @name         Mousehunt | Spring Hunt Charm Auto Switcher
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Spring Hunt Charm Auto Switcher
// @author       You
// @match        https://www.mousehuntgame.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29208/Mousehunt%20%7C%20Spring%20Hunt%20Charm%20Auto%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/29208/Mousehunt%20%7C%20Spring%20Hunt%20Charm%20Auto%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var _sh_charm = {
        eggstra: 851,
        egg_charge: 1164,
        eggstra_charge: 1714
    };

    var _debug = false;
    function log(messg) {
        if (_debug)
            console.log(messg);

    }

    var _sh_setCharm = {
        handler: null,
        id: null,
        name: null,
        init: function(user){
            if(this.handler){
               clearInterval(this.handler);
               this.handler = null;
            }
            if(this.handler === null){
                if(user.trinket_item_id == this.id) return;
                hg.utils.TrapControl.setTrinket(this.name).go();
                this.handler = setInterval(function(){
                    if(user.trinket_name !== null && user.trinket_item_id == this.id){
                        clearInterval(this.handler);
                        this.handler = null;
                    }
                }, 300);
            }
        }
    };

    function check_sh_status(userx){

        var sh = userx.quests.QuestSpringHunt;

        if(sh.items.eggstra_charge_trinket.quantity > 0){
            if(sh.charge_percent >= 90){
                //eggstra_charge
                _sh_setCharm.id = _sh_charm.eggstra_charge;
                _sh_setCharm.name = "eggstra_charge_trinket";
                _sh_setCharm.init(userx);
            }
            else if (sh.charge_percent < 90){
                if(sh.items.egg_charge_trinket.quantity > 0){
                    //egg_charge
                    _sh_setCharm.id = _sh_charm.egg_charge;
                    _sh_setCharm.name = "egg_charge_trinket";
                    _sh_setCharm.init(userx);
                }
                else{
                    //eggstra_charge
                    _sh_setCharm.id = _sh_charm.eggstra_charge;
                    _sh_setCharm.name = "eggstra_charge_trinket";
                    _sh_setCharm.init(userx);
                }
            }
        }
        else{

            if(sh.charge_percent <= 90) {
                //equip charge charms
                if(sh.items.egg_charge_trinket.quantity > 0){
                    //egg_charge
                    _sh_setCharm.id = _sh_charm.egg_charge;
                    _sh_setCharm.name = "egg_charge_trinket";
                    _sh_setCharm.init(userx);
                }
            }
            else if (sh.charge_percent <= 100 && sh.charge_percent > 90){
                //equip charge charms
                if(sh.items.eggstra_trinket.quantity > 0){
                    //eggstra
                    _sh_setCharm.id = _sh_charm.eggstra;
                    _sh_setCharm.name = "eggstra_trinket";
                    _sh_setCharm.init(userx);
                }
            }
        }
    }


    log("Starting");
    var last_user = null;
    var last_user_handler = null;
    var listener = function (params) {
        var journalMarkup = params.journal_markup;
        if (journalMarkup && journalMarkup.length > 0) {
            log('Journal Data to Check');
            log(journalMarkup);
            
            
            //if(last_user_handler) clearInterval(last_user_handler);
            
            last_user = params.user;
            last_user_handler = setTimeout(function(){
                check_sh_status(last_user);
            }, 300);



            //var x = new hg.views.HeadsUpDisplayView();
            //if(x.render(params.user)){
            //check_sh_status(params.user);
            //}
        }
    };
    eventRegistry.addEventListener('ajax_response', listener);
    log("Listener Attached");

    check_sh_status(user);
})();