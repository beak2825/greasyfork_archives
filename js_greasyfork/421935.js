// ==UserScript==
// @name         DC_New_Turn_Alert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Emit a sound when you can play during fights
// @author       Lorkah, based on some DarkKoblats function
// @match        https://www.dreadcast.net/Main
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license DON'T BE A DICK PUBLIC LICENSE ; https://dbad-license.org/
// @downloadURL https://update.greasyfork.org/scripts/421935/DC_New_Turn_Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/421935/DC_New_Turn_Alert.meta.js
// ==/UserScript==
function initLocalMemory(defaultValue, localVarName) {
    if (GM_getValue(localVarName) === undefined) {
        GM_setValue(localVarName, defaultValue);
        return defaultValue;
    } else {
        return GM_getValue(localVarName);
    }
}



$('body').append('<audio id="DC_new_turn_sound" src="https://bacon-network.net/dreadcast/bip.mp3" type="audio/waw">');
$("#DC_new_turn_sound").prop('volume', '1');

var activateNewTurnAlerts = initLocalMemory(false, "activateNewTurnAlerts");
var alertVolume = initLocalMemory(1, "NT_alertVolume");

    (function() {
        var imgUnmute = 'url(https://i.imgur.com/uvIB44X.png)';
        var imgMute = 'url(https://i.imgur.com/8oV9IrJ.png)';

        var audio = document.createElement('audio');
        audio.id='DC_new_turn_sound';
        document.body.appendChild(audio);

        var MuteAlerts = $('<li>').prependTo($('#bandeau ul.menus'));
        MuteAlerts.attr("id", 'MuteAlertsNewTurnAlert');
        MuteAlerts.css({
            left: '5px',
            height: '30px',
            "z-index": '999999',
            "background-size": '29px 15px',
            "background-repeat": 'no-repeat',
            "background-position-y": '4px',
            color: '#999'
        });
        MuteAlerts.text("NT").addClass('link');
        MuteAlerts.hover(
            function(){
                $(this).css("color", "#0073d5");
            },
            function(){
                var colorAC = (activateNewTurnAlerts) ? "#999" : "#D00000";
                $(this).css("color", colorAC);
            }
        );
        MuteAlerts.click(function() {
            activateNewTurnAlerts = (activateNewTurnAlerts) ? false : true;
            GM_setValue("activateNewTurnAlerts", activateNewTurnAlerts);
            document.getElementById('MuteAlertsNewTurnAlert').style.backgroundImage = (activateNewTurnAlerts) ? imgUnmute : imgMute;
            document.getElementById('DC_new_turn_sound').volume ? alertVolume : 0;
            var colorAC = (activateNewTurnAlerts) ? "#999" : "#D00000";
            MuteAlerts.css("color", colorAC);
        });

        //Initialisation depuis le stockage local
        document.getElementById('MuteAlertsNewTurnAlert').style.backgroundImage = (activateNewTurnAlerts) ? imgUnmute : imgMute;
        document.getElementById('DC_new_turn_sound').volume ? alertVolume : 0;
        var colorAC = (activateNewTurnAlerts) ? "#999" : "#D00000";
        MuteAlerts.css("color", colorAC);
    })();


var alert_newturn =  $('#DC_new_turn_sound')[0];

Combat.prototype.changeEtat = function(e, t) {
    if (1 == e) {
        $("#combat_zone_affichage .masque").show(), $("#combat_barre_int").show().css("width", "100%").animate({width:"0%"}, 1e3 * t), $("#combat_barre_text").removeClass("semi_transparent").find("div").hide(), $("#combat_barre_text .temps_restant").show().find("span").html(t + ""), alert_newturn.play();
        for (var i = this.timeouts.length, n = 1; n <= i; n++) clearTimeout(this.timeouts[n]);
        for (n = t - 1; 0 < n; n--) this.timeouts[n] = setTimeout("$('#combat_barre_text .temps_restant span').html('" + n + "')", 1e3 * (t - n));
        $("#combat_menu div.disabled2").removeClass("disabled").removeClass("disabled2"), this.changeActionPrepare()
    } else if (2 == e) {
        $("#combat_barre_int").hide().stop().css("width", "100%"), $("#combat_barre_text").addClass("semi_transparent").find("div").hide(), $("#combat_barre_text .termine").show().find("span").html(t + ""), this.changeActionPrepare();
        for (i = this.timeouts.length, n = 1; n <= i; n++) clearTimeout(this.timeouts[n]);
        for (n = t - 1; 0 < n; n--) this.timeouts[n] = setTimeout("$('#combat_barre_text .termine span').html('" + n + "')", 1e3 * (t - n));
        $(".combat_joueur_pret").hide(), $("#combat_menu div:not(.action_4):not(.action_9)").removeClass("active"), ($("#combat_menu .action_4").hasClass("active") ? $("#combat_menu div:not(.disabled):not(.action_4)") : $("#combat_menu div:not(.disabled)")).addClass("disabled").addClass("disabled2"), $("#combat_menu .action_7, #combat_menu .action_9").removeClass("disabled").removeClass("disabled2")
    }
    this.etat = e
}