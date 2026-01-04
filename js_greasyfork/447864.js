// ==UserScript==
// @name         Territorial.io bot
// @version      0.1
// @description  Trying to create a bot for the game territorial.io
// @author       TechAle
// @match        https://territorial.io/
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @namespace https://greasyfork.org/users/909685
// @downloadURL https://update.greasyfork.org/scripts/447864/Territorialio%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/447864/Territorialio%20bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_xmlhttpRequest({
        method: "GET",
        url: document.location.origin,
        onload: res => {
            const toChange = {
                "w && Math.floor(kQ[cJ] * x) !== B && (F = !0)": "if (window.randomTroops)\n" +
                    "                x = Math.random()\n" +
                    "            w && Math.floor(kQ[cJ] * x) !== B && (F = !0)",
                "cZ.rx();" : "if (!window.freezeAI)\n" +
                    "            cZ.rx();"
            };

            let html = res.responseText;
            for (const [before, after] of Object.entries(toChange)) {
                debugger;
                html = html.replace(before.replaceAll(" ", ""), after)
            }

            html += getMenu();

            document.open();
            document.write(html);
            document.close();
        }
    })

    function getMenu() {
       return '<!--\n' +
           'I have to create everything like this?! UFF\n' +
           '-->\n' +
           '\n' +
           '<style>\n' +
           '    #menu {\n' +
           '        position: absolute;\n' +
           '        z-index: 9;\n' +
           '        background-color: deepskyblue;\n' +
           '        border: 1px solid #d3d3d3;\n' +
           '        text-align: center;\n' +
           '        -webkit-user-select: none;\n' +
           '        -webkit-touch-callout: none;\n' +
           '        -moz-user-select: none;\n' +
           '        -ms-user-select: none;\n' +
           '        user-select: none;\n' +
           '        width: 750px;\n' +
           '        font-size: 25px;\n' +
           '        top: 100px;\n' +
           '        right: 60px\n' +
           '    }\n' +
           '\n' +
           '    #headerMenu {\n' +
           '        padding: 10px;\n' +
           '        cursor: move;\n' +
           '        z-index: 10;\n' +
           '        background-color: dodgerblue;\n' +
           '        color: black;\n' +
           '    }\n' +
           '\n' +
           '    #modules {\n' +
           '        display: flex;\n' +
           '    }\n' +
           '\n' +
           '    #modules > * {\n' +
           '        width: 80%;\n' +
           '        background-color: lightgray;\n' +
           '        color: black;\n' +
           '        margin-bottom: 2px;\n' +
           '        margin-right: 2px ;\n' +
           '    }\n' +
           '\n' +
           '    #sections {\n' +
           '        width: 20%;\n' +
           '        margin-bottom: 2px;\n' +
           '        margin-left: 2px;\n' +
           '        margin-right: 0;\n' +
           '        border-right: dodgerblue solid 1px;\n' +
           '    }\n' +
           '\n' +
           '    #sections > * {\n' +
           '        border-bottom: dodgerblue solid 1px;\n' +
           '        padding-top: 2px;\n' +
           '        padding-bottom: 2px;\n' +
           '    }\n' +
           '\n' +
           '    #sections:hover {\n' +
           '        cursor: pointer;\n' +
           '    }\n' +
           '\n' +
           '    #settings {\n' +
           '        overflow-y: scroll;\n' +
           '        text-align: left;\n' +
           '        padding-left: 15px;\n' +
           '    }\n' +
           '\n' +
           '</style>\n' +
           '\n' +
           '<!-- Draggable DIV -->\n' +
           '<div id="menu" oncontextmenu="return false">\n' +
           '    <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->\n' +
           '    <div id="headerMenu">Console</div>\n' +
           '    <div id="modules">\n' +
           '        <div id="sections">\n' +
           '            <div onclick="display(\'combat\')">Self</div>\n' +
           '            <div onclick="display(\'render\')">Bot</div>\n' +
           '            <div onclick="display(\'move\')">Lobby</div>\n' +
           '            <div onclick="display(\'misc\')" style="border-bottom: none">AI</div>\n' +
           '        </div>\n' +
           '\n' +
           '        <div id="settings">\n' +
           '            <!-- self -->\n' +
           '            <div id="combat">\n' +
           '                <label><input type="checkbox" id="randomTroops" onclick="window.randomTroops = this.checked"> Random troops</label>\n' +
           '            </div>\n' +
           '\n' +
           '            <!-- render -->\n' +
           '            <div id="render" style="display: none">\n' +
           '            </div>\n' +
           '\n' +
           '            <!-- lobby -->\n' +
           '            <div id="move" style="display: none">\n' +
           '               <label><input type="checkbox" onclick="window.freezeAI = this.checked"> Freeze AI</label>\n' +
           '            </div>\n' +
           '\n' +
           '            <!-- AI -->\n' +
           '            <div id="misc" style="display: none">\n' +
           '            </div>\n' +
           '        </div>\n' +
           '    </div>\n' +
           '</div>\n' +
           '\n' +
           '\n' +
           '<script>\n' +
           '    window.randomTroops = false;\n' +
           '    window.freezeAI = false;\n' +
           '    // Make the DIV element draggable:\n' +
           '    dragElementModules(document.getElementById("menu"));\n' +
           '\n' +
           '    function dragElementModules(elmnt) {\n' +
           '\n' +
           '        function dragModules(e) {\n' +
           '            e = e || window.event;\n' +
           '            e.preventDefault();\n' +
           '            // calculate the new cursor position:\n' +
           '            pos1 = pos3 - e.clientX;\n' +
           '            pos2 = pos4 - e.clientY;\n' +
           '            pos3 = e.clientX;\n' +
           '            pos4 = e.clientY;\n' +
           '            // set the element\'s new position:\n' +
           '            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";\n' +
           '            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";\n' +
           '        }\n' +
           '\n' +
           '        function closeModules() {\n' +
           '            // stop moving when mouse button is released:\n' +
           '            document.onmouseup = null;\n' +
           '            document.onmousemove = null;\n' +
           '        }\n' +
           '\n' +
           '        function modulesDown(e) {\n' +
           '            e = e || window.event;\n' +
           '            e.preventDefault();\n' +
           '            if (e.button === 2) {\n' +
           '                document.getElementById("modules").style.display = isActive ? "none" : "flex";\n' +
           '                isActive = !isActive;\n' +
           '            } else {\n' +
           '                // get the mouse cursor position at startup:\n' +
           '                pos3 = e.clientX;\n' +
           '                pos4 = e.clientY;\n' +
           '                document.onmouseup = closeModules;\n' +
           '                // call a function whenever the cursor moves:\n' +
           '                document.onmousemove = dragModules;\n' +
           '            }\n' +
           '        }\n' +
           '\n' +
           '\n' +
           '        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;\n' +
           '        var isActive = true;\n' +
           '        document.getElementById("headerMenu").onmousedown = modulesDown;\n' +
           '    }\n' +
           '\n' +
           '    const everyId = ["combat", "render", "move", "misc"];\n' +
           '\n' +
           '    function display(name) {\n' +
           '        everyId.forEach(id => {\n' +
           '            document.getElementById(id).style.display = "none";\n' +
           '        })\n' +
           '        document.getElementById(name).style.display = "initial";\n' +
           '    }\n' +
           '</script>';
    }
})();