// ==UserScript==
// @name DC - Mail Protect
// @namespace InGame
// @author Nasty, la bise à Odul et DarkKobalt
// @date 24/11/2023
// @version 1
// @license DBAD - https://raw.githubusercontent.com/philsturgeon/dbad/master/translations/LICENSE-fr.md
// @include https://www.dreadcast.net/Main
// @include https://www.dreadcast.eu/Main
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @compat Firefox, Chrome
// @description évite de fermer un message par erreur.
// @downloadURL https://update.greasyfork.org/scripts/480707/DC%20-%20Mail%20Protect.user.js
// @updateURL https://update.greasyfork.org/scripts/480707/DC%20-%20Mail%20Protect.meta.js
// ==/UserScript==

function initLocalMemory(defaultValue, localVarName) {
    if (GM_getValue(localVarName) === undefined) {
        GM_setValue(localVarName, defaultValue);
        return defaultValue;
    } else {
        return GM_getValue(localVarName);
    }
}

var activateMailProtect = initLocalMemory(false, "activateMailProtect");

(function() {
    var imgUnprotect = 'url(https://i.imgur.com/gAEeyBr.png)';
    var imgProtect = 'url(https://i.imgur.com/iZAfu5q.png)';

    $('<li class="separator"></li>').prependTo($('#bandeau ul.menus'));
    var End = $('<li>').prependTo($('#bandeau ul.menus'));
    End.attr("id", 'mailProtectChecker');
    End.css({
        height: '30px',
        "z-index": '999999',
        "background-size": '20px 20px',
        "background-repeat": 'no-repeat',
        "background-position-y": '4px',
        color: '#22a12c'
    });
    End.text("MailProtect").addClass('link');
    End.hover(
        function(){
            $(this).css("color", "#0073d5");
        },
        function(){
            var colorMP = (activateMailProtect) ? "#22a12c" : "#D00000";
            $(this).css("color", colorMP);
        }
    );
    End.click(function() {
        activateMailProtect = (activateMailProtect) ? false : true;
        GM_setValue("activateMailProtect", activateMailProtect);
        document.getElementById('mailProtectChecker').style.backgroundImage = (activateMailProtect) ? imgProtect : imgUnprotect;
        var colorMP = (activateMailProtect) ? "#22a12c" : "#D00000";
        End.css("color", colorMP);
        console.log(activateMailProtect)
    });

    //Initialisation depuis le stockage local
    document.getElementById('mailProtectChecker').style.backgroundImage = (activateMailProtect) ? imgProtect : imgUnprotect;
    var colorMP = (activateMailProtect) ? "#22a12c" : "#D00000";
    End.css("color", colorMP);
})();

    Engine.prototype.closeDataBox = function(e) {
        "string" != typeof e && (e = $(e).parents(".dataBox").attr("id")), $("#tooltip").hide();
        var t, i = $("#" + e).hasClass("focused");
        if ((($("#" + e).find(".zone_reponse:visible").length != 0 )  || ($("#" + e).find(".message_nouveau:visible").length != 0 ) ) && (activateMailProtect == true) && (confirm("Vous allez fermer la fenêtre. Êtes vous sûr·e ?") == true)) {
            $("#" + e).fadeOut("fast", function() {
                var e;
                $(this).remove(), i && (e = -1, $("#zone_dataBox .dataBox").each(function() {
                    $(this).css("z-index") > e && (e = parseInt($(this).css("z-index"), 10), i = this)
                }), $(i).addClass("focused"))
            }), (t = this.getCtlById(e)) && (t.close(), this.clearCtl(e)), khable = !0
            }


        if ((activateMailProtect == false) || $("#" + e).find(".zone_reponse:visible").length != 1 )  {
            $("#" + e).fadeOut("fast", function() {
                var e;
                $(this).remove(), i && (e = -1, $("#zone_dataBox .dataBox").each(function() {
                    $(this).css("z-index") > e && (e = parseInt($(this).css("z-index"), 10), i = this)
                }), $(i).addClass("focused"))
            }), (t = this.getCtlById(e)) && (t.close(), this.clearCtl(e)), khable = !0

        }
    }
