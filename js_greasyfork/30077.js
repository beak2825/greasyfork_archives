// ==UserScript==
// @name         Scratch 2.0 Embedded Phosphorus Player
// @namespace    http://garethpw.net
// @version      0.2
// @description  Replaces the default Scratch 2.0 project player with Phosphorus and adds the option to switch between players.
// @author       Gareth Welch
// @include      /^https:\/\/scratch\.mit\.edu\/projects\/[0-9]+\//
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30077/Scratch%2020%20Embedded%20Phosphorus%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/30077/Scratch%2020%20Embedded%20Phosphorus%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style_text = `
        #project .box-head {
            padding-bottom: 40px !important;
        }

        .stage #tabs {
            margin-bottom: 1px !important;
        }

        .stage #tabs li {
            -moz-border-radius: 5px 5px 0 0;
            -webkit-border-radius: 5px 5px 0 0;
            border-radius: 5px 5px 0 0;
            float: left;
        }

        .stage .phosphorus {
            margin-top: 16px;
        }
    `;

    var tabs_ul_html = `
        <ul id="tabs" class="tabs-index box-h-tabs h-tabs">
            <li tab-name="phosphorus" class="active">
                <a>Phosphorus</a>
            </li>
            <li tab-name="flash">
                <a>Flash</a>
            </li>
        </ul>
    `;

    window.onload = function() {
        //var project_id = parseInt(window.location.href.match(/^https:\/\/scratch\.mit\.edu\/projects\/([0-9]+)\//)[1]);
        var project_id = parseInt(document.getElementById("project").getAttribute("data-project-id"));

        var player_html_phosphorus = (
            '<iframe allowfullscreen="true" allowtransparency="true" src="https://phosphorus.github.io/embed.html?id='+
            project_id+
            '&light-content=false" width="482" height="393" class="phosphorus" style="border: 0px;"></iframe>'
        );

        var current_player = '';

        var style = document.createElement("style");
        style.appendChild(document.createTextNode(style_text));
        document.head.appendChild(style);

        var stage = document.getElementsByClassName("stage")[0];

        stage.innerHTML = tabs_ul_html + stage.innerHTML;

        var player = stage.querySelector("#player");
        var player_html_flash = player.innerHTML;

        var tabs_ul = stage.querySelector("#tabs");
        var tab_phosphorus = tabs_ul.querySelector('[tab-name="phosphorus"]');
        var tab_flash = tabs_ul.querySelector('[tab-name="flash"]');

        function switch_player(old_player, new_player) {
            if (old_player == new_player) { return; }

            var new_player_html = (new_player == "flash" ? player_html_flash : player_html_phosphorus);

            var old_tab = (old_player == "flash" ? tab_flash : tab_phosphorus);
            var new_tab = (new_player == "flash" ? tab_flash : tab_phosphorus);

            old_tab.className = '';
            new_tab.className = "active";

            player.innerHTML = new_player_html;

            current_player = new_player;
        }

        switch_player("flash", "phosphorus");

        tab_phosphorus.addEventListener("click", function() {
           switch_player(current_player, "phosphorus");
        });

        tab_flash.addEventListener("click", function() {
           switch_player(current_player, "flash");
        });
    };
})();