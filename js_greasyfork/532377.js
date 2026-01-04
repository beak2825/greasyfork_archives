// ==UserScript==
// @name         Haxball modloader
// @namespace    http://tampermonkey.net/
// @version      2024-12-13.1
// @description  haxball modloader
// @author       You
// @match        https://www.haxball.com/headless
// @icon         https://www.google.com/s2/favicons?sz=64&domain=haxball.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532377/Haxball%20modloader.user.js
// @updateURL https://update.greasyfork.org/scripts/532377/Haxball%20modloader.meta.js
// ==/UserScript==


(function() {
    let room;
    let iframe = document.getElementsByTagName('iframe')[0];

    function startRoom(name, maxPlayers, password,public) {
        let HBInit = window.HBInit;
        room = HBInit({
            roomName: name,
            maxPlayers: maxPlayers,
            noPlayer: true,
            password:password==""?null:password,
            public: public
            // Remove host player (recommended!)
        });
    }

    function updateAdmins() {
        // Get all players
        var players = room.getPlayerList();
        if ( players.length == 0 ) return; // No players left, do nothing.
        if ( players.find((player) => player.admin) != null ) return; // There's an admin left so do nothing.
        room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
    }

    function createSettings() {
        if (window.modSettings) {
            console.log(window.modSettings);
            let settings = document.createElement('div');
            settings.innerHTML = '<h1>Settings</h1>';
            let form = document.createElement('form');
            let table = document.createElement('table');
            for (let key in window.modSettings) {
                let setting = window.modSettings[key];
                let input = document.createElement('input');
                input.type = setting.type;
                input.value = setting.default;
                input.id = key;
                let label = document.createElement('label');
                label.htmlFor = key;
                label.innerText = key;
                let row = document.createElement('tr');
                let labelCell = document.createElement('td');
                let inputCell = document.createElement('td');
                labelCell.appendChild(label);
                inputCell.appendChild(input);
                row.appendChild(labelCell);
                row.appendChild(inputCell);
                table.appendChild(row);
            }
            let row = document.createElement('tr');
            let cell = document.createElement('td');
            cell.colSpan = 2;
            let submitButton = document.createElement('input');
            submitButton.type = 'submit';
            submitButton.value = 'Save Settings';
            cell.appendChild(submitButton);
            row.appendChild(cell);
            table.appendChild(row);
            form.appendChild(table);
            form.onsubmit = function(event) {
                event.preventDefault();
                for (let key in window.modSettings) {
                    let input = form.querySelector(`#${key}`);
                    window.modSettings[key].set(input.value);
                }
            };
            settings.appendChild(form);
            iframe.contentWindow.document.body.appendChild(settings);
        }
    }


    function loadMod(file) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let script = document.createElement('script');
            script.text = event.target.result;
            document.body.appendChild(script);
        };
        reader.readAsText(file);
    }

    function postLoadMod() {
        let oldPlayerJoin = room.onPlayerJoin ? room.onPlayerJoin : ()=>{};
        room.onPlayerJoin = function(player) {
            oldPlayerJoin(player);
            updateAdmins();
        }
        let oldPlayerLeave = room.onPlayerLeave ? room.onPlayerLeave : ()=>{};
        room.onPlayerLeave = function(player) {
            oldPlayerLeave(player);
            updateAdmins();
        }
    }
    


    function handleForm(event) {
        event.preventDefault();
        let maxPlayers = Number(iframe.contentDocument.getElementById('maxPlayers').value);
        let roomName = iframe.contentDocument.getElementById('roomName').value;
        let password = iframe.contentDocument.getElementById('password').value;
        let public = iframe.contentDocument.getElementById('public').checked;
        startRoom(roomName, maxPlayers, password, public);
        let file = iframe.contentDocument.getElementById('modFile')?.files?.[0];
        if(file) {
            window.createSettings = createSettings;
            loadMod(file);
        }
        postLoadMod();
        window.room = room;
    }
    window.startRoom = startRoom;
    window.onHBLoaded = ()=>{
        let controls = document.createElement('div');
        controls.innerHTML = `
            <form onsubmit="window.handleForm(event)">
            <table>
                <tr>
                <td><label for="maxPlayers">Max players</label></td>
                <td><input type="number" id="maxPlayers" value="20" placeholder="Max players"></td>
                </tr>
                <tr>
                <td><label for="roomName">Room name</label></td>
                <td><input type="text" id="roomName" value="Room name" placeholder="Room name"></td>
                </tr>
                <tr>
                <td><label for="password">Password</label></td>
                <td><input type="text" id="password" placeholder="Password"></td>
                </tr>
                <tr>
                <td><label for="public">Public</label></td>
                <td><input type="checkbox" id="public" placeholder="Public"></td>
                </tr>
                <tr>
                <td><label for="modFile">Mod file</label></td>
                <td><input type="file" id="modFile" accept=".js"></td>
                </tr>
                <tr>
                <td colspan="2"><input type="submit" value="Start room"></td>
                </tr>
            </table>
            </form>
            `;
        iframe.contentWindow.handleForm = handleForm;
        document.getElementsByTagName('iframe')[0].contentWindow.document.body.appendChild(controls);
    }

    // Your code here...
})();