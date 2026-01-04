// ==UserScript==
// @name         Custom Menu (For Bojangles bot)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *www.multiplayerpiano.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386659/Custom%20Menu%20%28For%20Bojangles%20bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/386659/Custom%20Menu%20%28For%20Bojangles%20bot%29.meta.js
// ==/UserScript==

(function() {
    function openModal(selector, focus) {
        if(chat) chat.blur();
		$(document).off("keydown", null );
		$(document).off("keyup", null);
		$(window).off("keypress", null );
		$("#piano").on("mousedown", null);
		$("#piano").on("touchstart", null);
		$(document).on("keydown", (evt) => {
            if(evt.keyCode == 27) {
                closeModal();
                evt.preventDefault();
                evt.stopPropagation();
            }
        });
		$("#modal #modals > *").hide();
		$("#modal").fadeIn(250);
		$(selector).show();
		setTimeout(function() {
			$(selector).find(focus).focus();
		}, 100);    
		gModal = selector;
	};
    gClient = MPP.client;
    var ele = document.getElementById("names");
    var touchhandler = function(e) {
        if (e.shiftKey == true) {

        var target_jq = $(e.target);
        if(target_jq.hasClass("name")) {
            target_jq.addClass("play");
            if(e.target.participantId == gClient.participantId) {
                //openModal("#rename", "input[name=name]");
                setTimeout(function() {
                    $("#rename input[name=name]").val(gClient.ppl[gClient.participantId].name);
                    $("#rename input[name=color]").val(gClient.ppl[gClient.participantId].color);
                }, 100);
            } else if(e.target.participantId) {
                var id = e.target.participantId;
                var part = gClient.ppl[id] || null;
                if(part) {
                    participantMenu(part);
                    e.stopPropagation();

                    }
                }
            }
        }
    };
    ele.addEventListener("mousedown", touchhandler);
    ele.addEventListener("touchstart", touchhandler);
    var releasehandler = function(e) {
        $("#names .name").removeClass("play");
    };
    document.body.addEventListener("mouseup", releasehandler);
    document.body.addEventListener("touchend", releasehandler);

    var removeParticipantMenus = function() {
        $(".participant-menu").remove();
        $(".participantSpotlight").hide();
        document.removeEventListener("mousedown", removeParticipantMenus);
        document.removeEventListener("touchstart", removeParticipantMenus);
    };

    var participantMenu = function(part) {
        if(!part) return;
        removeParticipantMenus();
        document.addEventListener("mousedown", removeParticipantMenus);
        document.addEventListener("touchstart", removeParticipantMenus);
        $("#" + part.id).find(".enemySpotlight").show();
        var menu = $('<div class="participant-menu"></div>');
        $("body").append(menu);
        // move menu to name position
        var jq_nd = $(part.nameDiv);
        var pos = jq_nd.position();
        menu.css({
            "top": pos.top + jq_nd.height() + 15,
            "left": pos.left + 6,
            "background": part.color || "black"
        });
        menu.on("mousedown touchstart", function(evt) {
            evt.stopPropagation();
            var target = $(evt.target);
            if(target.hasClass("menu-item")) {
                target.addClass("clicked");
                menu.fadeOut(200, function() {
                    removeParticipantMenus();
                });
            }
        });
        // this spaces stuff out but also can be used for informational
        $('<div class="info"></div>').appendTo(menu).text(part._id);
        // add menu items

        $('<div class="menu-item" style="color:yellow">kickban</div>').appendTo(menu)
        .on("mousedown touchstart", function(evt) {
            var minutes = prompt("How many minutes? (0-60)", "30");
            if(minutes === null) return;
            minutes = parseFloat(minutes) || 0;
            var ms = minutes * 60 * 1000;
            MPP.chat.send("/ban " + part._id + " " + ms)
            
        });
        
        if(gClient.isOwner()) {
            $('<div class="menu-item give-crown">Give Crown</div>').appendTo(menu)
            .on("mousedown touchstart", function(evt) {
                if(confirm("Give room ownership to "+part.name+"?"))
                    gClient.sendArray([{m: "chown", id: part.id}]);
            });
            $('<div class="menu-item kickban">Kickban</div>').appendTo(menu)
            .on("mousedown touchstart", function(evt) {
                var minutes = prompt("How many minutes? (0-60)", "30");
                if(minutes === null) return;
                minutes = parseFloat(minutes) || 0;
                var ms = minutes * 60 * 1000;
                gClient.sendArray([{m: "kickban", _id: part._id, ms: ms}]);
            });
        }
        menu.fadeIn(100);
    };


    $("#modals").append('<div id="bojangles" class="dialog" style="display: block; height: 400px; margin-top: -200px;"> <div id="settingline" class="x" style="display: none;"></div></div>')
    $(".relative").first().append('<div id="menu-btn" class="ugly-button" style="display: block; position: absolute; left: 660px; top: 32px;">Bojangles Menu</div> ').on("mousedown touchstart", function(evt) {
        openModal($("#bojangles"))
        })
        $("#settingline").append('<div class="ugly-button" style=" font-size: 100%;display: inline;margin-left: 0%;">Steal crown</div>')         
        .on("mousedown touchstart", function(evt) {
        MPP.chat.send("/crown")
        })
})();
    

