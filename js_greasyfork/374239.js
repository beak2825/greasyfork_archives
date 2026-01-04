// ==UserScript==
// @name         Moo Moo Custom Minimap
// @version      0.1
// @description  ...
// @author       Creator
// @match        *://*.moomoo.io/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @connect      moomoo.io
// @icon         http://moomoo.io/img/icons/skull.png
// @namespace https://greasyfork.org/users/206011
// @downloadURL https://update.greasyfork.org/scripts/374239/Moo%20Moo%20Custom%20Minimap.user.js
// @updateURL https://update.greasyfork.org/scripts/374239/Moo%20Moo%20Custom%20Minimap.meta.js
// ==/UserScript==

(function () {
    var ws;
    var player;
    var BOT_SETTINGS_TEMPLATE = '<style>.bot-settings{padding: 10px; background-color: rgba(0, 0, 0, 0.2); border-radius: 3px; position: absolute; left: 0px; top: 0px; min-width: 200px; max-width: 300px;aw}.equip-btn{display:inline-block; width: 25px; height: 25px; border: 1px solid grey; background-size: contain; cursor: pointer; background-color: lightgray;}.equip-btn.selected{background-color: lightgreen;}</style><div class="bot-settings"> <div> <div> <input type="checkbox" id="botAutoHealOn"/> <label for="botAutoHealOn">AutoHeal</label> </div></div><hr/> <div id="bot-equips-0"> </div><hr/><div id="bot-equips-1"> </div></div>';
    var autoHealStarted = true;
    var btnEnterGame = document.getElementById('enterGame');

    function init() {
        $('body').append(BOT_SETTINGS_TEMPLATE);

        $('#botAutoHealOn').prop("checked", autoHealStarted);
        $('#botAutoHealOn').change(function (e) {
            autoHealStarted = e.currentTarget.checked;
        });

        addEquip(0, 28);
        addEquip(0, 29);
        addEquip(0, 30);
        addEquip(0, 36);
        addEquip(0, 37);
        addEquip(0, 38);
        addEquip(0, 44);
        addEquip(0, 35);
        addEquip(0, 42);
        addEquip(0, 43);
        addEquip(0, 49);
    }

    function dead() {
        player = new Player();
    }

    function botLaunched() {
        return $('#botAutoHealOn').prop('checked');
    }

    function equipId(type, id) {
        return "bot-eq-" + type + id;
    }

    function equipIsSelect(type, id) {
        return $("#" + equipId(type, id)).hasClass("selected");
    }

    function equipSelect(type, id) {
        $("#" + equipId(type, id)).addClass("selected");
    }

    function equipCancleSelect(type, id) {
        if (id == "all") {
            $("#bot-equips-" + type + ">.equip-btn").removeClass("selected");
        } else $("#" + equipId(type, id)).removeClass("selected");
    }

    function equipExist(type, id) {
        return $("#bot-equips-" + type + ">#" + equipId(type, id)).length > 0;
    }

    function addEquip(type, id) {
        if (equipExist(type, id)) {
            return;
        }
        var url = "http://moomoo.io/img";

        if (type == 1) {
            url += "/accessories/access_" + id + ".png";
        } else {
            url += "/hats/hat_" + id + ".png";
        }

        $("<div/>", {
            id: equipId(type, id),
            "class": "equip-btn",
            css: {
                "background-image": "url(" + url + ")"
            },
            click: function click() {
                if (!equipIsSelect(type, id)) ws.send("42[\"13\",0," + id + ", " + type + "]");else ws.send("42[\"13\",0,0," + type + "]");
            }
        }).appendTo("#bot-equips-" + type);
    }
})();

	$('#mapDisplay').css({
		'background': 'url("https://cdn.discordapp.com/attachments/374333551858155530/376303720540930048/moomooio-background.png")'
	});