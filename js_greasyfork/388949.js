// ==UserScript==
// @name         Free Agar.io Bots (Vanilla Version) - NOT Work
// @namespace    Free and Real agario bots
// @version      1.0.6
// @description  Free and Real open source agario bots (tags: ogario, legend mod, vanilla, free bots, unlimited, hacks, infinity, agar.io, cheat, miniclip, agar)
// @author       Nel, xN3BULA, Jimboy3100
// @grant        none
// @run-at       document-start
// @match        *://agar.io/*
// @downloadURL https://update.greasyfork.org/scripts/388949/Free%20Agario%20Bots%20%28Vanilla%20Version%29%20-%20NOT%20Work.user.js
// @updateURL https://update.greasyfork.org/scripts/388949/Free%20Agario%20Bots%20%28Vanilla%20Version%29%20-%20NOT%20Work.meta.js
// ==/UserScript==

/* START OF USER SETTINGS */
window.options = {
    settings: {
        "EXTENDED_ZOOM": {
           "text": "Extended Zoom",
          "type": "checkbox",
          "value": true
        },
        "DRAW_MAP_GRID": {
           "text": "Grid",
          "type": "checkbox",
          "value": false
        },
        "SHOW_ALL_PLAYERS_MASS": {
           "text": "Show Mass (All players)",
          "type": "checkbox",
          "value": true
        },
    },
    hotkeys: {
        "BOTS_SPLIT_KEY": {
            "text": "Bot Split Key",
            "key": "T",
            "keycode": 84,
        },
        "BOTS_FEED_KEY": {
            "text": "Bot Feed Key",
            "key": "A",
            "keycode": 65,
        },
        "BOTS_AI_KEY": {
            "text": "Bot AI Key",
            "key": "F",
            "keycode": 70,
        },
        "MACRO_FEED_KEY": {
            "text": "Macro Feed Key",
            "key": "E",
            "keycode": 69,
        },
        "DOUBLE_SPLIT_KEY": {
            "text": "Double Split Key",
            "key": "Q",
            "keycode": 81,
        },
        "SIXTEEN_SPLIT_KEY": {
            "text": "Sixteen Split Key",
            "key": "R",
            "keycode": 82,
        },
    }
}
if(localStorage.getItem('nebula-hotkeys')) window.options.hotkeys =JSON.parse(localStorage.getItem('nebula-hotkeys'));
if(localStorage.getItem('nebula-settings')) window.options.settings =JSON.parse(localStorage.getItem('nebula-settings'));
window.changeKey = (name, event) => {
    event.preventDefault();
    $(`#${name}`).val(event.key.toLocaleUpperCase())
    let key = window.options.hotkeys[name];
    key["key"] = event.key.toLocaleUpperCase();
    key["keycode"] = event.keyCode;
    checkDuplicates(name, event.keyCode);
    localStorage.setItem('nebula-hotkeys', JSON.stringify(window.options.hotkeys));
}
window.checkboxChange = (name) => {
    let setting = window.options.settings[name];
    setting["value"] = document.getElementById(name).checked;
    localStorage.setItem('nebula-settings', JSON.stringify(window.options.settings));
};
window.checkDuplicates = (keyname, keycode) => {
for (var name in window.options.hotkeys) {
        var key = window.options.hotkeys[name];
        if(name == keyname) continue;
    if(keycode == key.keycode) key.keycode = 0, key.key = "", $(`#${name}`).val("");
    }
}
window.setUpHotkeys = () => {
    for (var name in window.options.hotkeys) {
        var key = window.options.hotkeys[name];
        let html =
            `<div class="row" name="${name}">
                        <span class="title">${key.text}</span>
                        <input id="${name}" onkeydown="changeKey('${name}', event)" class="key" value="${key.key.toLocaleUpperCase()}">
                    </div>`
        $("#hotkeys").append(html);
    }
}
window.getOption = (name) => {
    if(document.getElementById(name))return document.getElementById(name).checked
    else return false
}
window.setUpOptions = () => {
    for (var name in window.options.settings) {
        var option = window.options.settings[name];
        let html =
            `<div class="row" name="${name}">
                        <span class="title">${option.text}</span>
                        <input id=${name} onchange="checkboxChange('${name}')" class="checkbox" type="checkbox">
                    </div>
`
        $("#settings").append(html);
        if(option["value"] == true) $(`#${name}`).click();
    }
}

window.SERVER_HOST = 'ws://localhost:8083' // Hostname/IP of the server where the bots are running [Default = localhost (your own pc)]

window.ZOOM_SPEED = 0.85 // Numerical value that indicates the speed of the mouse wheel when zooming, value must be between 0.01-0.99 [Default = 0.85]

window.EXTENDED_ZOOM = true // Boolean value that indicates whether to extend the zoom or not, possible values are true and false [Default = true]

window.DRAW_MAP_GRID = false // Boolean value that indicates whether to draw the map grid or not, possible values are true and false [Default = false]

window.SHOW_ALL_PLAYERS_MASS = true // Boolean value that indicates whether to show all players mass or not, possible values are true and false [Default = true]

/* END OF USER SETTINGS */

class Writer {
    constructor(size) {
        this.dataView = new DataView(new ArrayBuffer(size))
        this.byteOffset = 0
    }
    writeUint8(value) {
        this.dataView.setUint8(this.byteOffset++, value)
    }
    writeInt32(value) {
        this.dataView.setInt32(this.byteOffset, value, true)
        this.byteOffset += 4
    }
    writeUint32(value) {
        this.dataView.setUint32(this.byteOffset, value, true)
        this.byteOffset += 4
    }
    writeString(string) {
        for (let i = 0; i < string.length; i++) this.writeUint8(string.charCodeAt(i))
        this.writeUint8(0)
    }
}

window.buffers = {
    startBots(url, protocolVersion, clientVersion, userStatus, botsName, botsAmount) {
            const writer = new Writer(13 + url.length + botsName.length)
            writer.writeUint8(0)
            writer.writeString(url)
            writer.writeUint32(protocolVersion)
            writer.writeUint32(clientVersion)
            writer.writeUint8(Number(userStatus))
            writer.writeString(botsName)
            writer.writeUint8(botsAmount)
            return writer.dataView.buffer
        },
        mousePosition(x, y) {
            const writer = new Writer(9)
            writer.writeUint8(6)
            writer.writeInt32(x)
            writer.writeInt32(y)
            return writer.dataView.buffer
        }
}

window.connection = {
    ws: null,
    connect() {
        this.ws = new WebSocket(`${window.SERVER_HOST}`)
        this.ws.binaryType = 'arraybuffer'
        this.ws.onopen = this.onopen.bind(this)
        this.ws.onmessage = this.onmessage.bind(this)
        this.ws.onclose = this.onclose.bind(this)
    },
    send(buffer) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(buffer)
    },
    onopen() {
        document.getElementById('userStatus').style.color = '#00C02E'
        document.getElementById('userStatus').innerText = 'Connected'
        document.getElementById('connect').disabled = true
        document.getElementById('startBots').disabled = false
        document.getElementById('stopBots').disabled = false
    },
    onmessage(message) {
        const dataView = new DataView(message.data)
        switch (dataView.getUint8(0)) {
            case 0:
                document.getElementById('startBots').disabled = true
                document.getElementById('stopBots').disabled = false
                document.getElementById('startBots').style.display = 'none'
                document.getElementById('stopBots').style.display = 'inline'
                document.getElementById('stopBots').innerText = 'Stop Bots'
                window.user.startedBots = true
                break
            case 1:
                document.getElementById('stopBots').disabled = true
                document.getElementById('stopBots').innerText = 'Stopping Bots...'
                break
            case 2:
                document.getElementById('botsAI').style.color = '#DA0A00'
                document.getElementById('botsAI').innerText = 'Disabled'
                document.getElementById('startBots').disabled = false
                document.getElementById('stopBots').disabled = true
                document.getElementById('startBots').style.display = 'inline'
                document.getElementById('stopBots').style.display = 'none'
                document.getElementById('stopBots').innerText = 'Stop Bots'
                window.user.startedBots = false
                window.bots.ai = false
                break
            case 3:
                alert('Your IP has captcha and bots are unable to spawn, change your ip with a VPN or something to one that doesn\'t has captcha in order to use the bots')
                break
             case 4:
                 //Connected Bot count = getUint8(1)
                //Spawned Bot count = getUint8(2)
                //Server player amount = getUint8(3)
                $('#botCount').html(`${dataView.getUint8(1)}/${dataView.getUint8(2)}/${window.bots.amount}`)
               // $('#slots').html(dataView.getUint8(3) + "/200")
                break;
            case 5:
                $('#slots').html(dataView.getUint8(1) + "/200")
                break;
        }
    },
    onclose() {
        document.getElementById('userStatus').style.color = '#DA0A00'
        document.getElementById('userStatus').innerText = 'Disconnected'
        document.getElementById('botsAI').style.color = '#DA0A00'
        document.getElementById('botsAI').innerText = 'Disabled'
        document.getElementById('connect').disabled = false
        document.getElementById('startBots').disabled = true
        document.getElementById('stopBots').disabled = true
        document.getElementById('startBots').style.display = 'inline'
        document.getElementById('stopBots').style.display = 'none'
        window.user.startedBots = false
        window.bots.ai = false
    }
}

window.game = {
    url: '',
    protocolVersion: 0,
    clientVersion: 0
}

window.user = {
    startedBots: false,
    isAlive: false,
    mouseX: 0,
    mouseY: 0,
    offsetX: 0,
    offsetY: 0,
    macroFeedInterval: null
}

window.bots = {
    name: '',
    amount: 0,
    ai: false
}

function modifyCore(core) {
    return core
        .replace(/if\(\w+\.MC&&\w+\.MC\.onPlayerSpawn\)/, `
            $&
            window.user.isAlive = true
            if(window.user.startedBots) window.connection.send(new Uint8Array([5, Number(window.user.isAlive)]).buffer)
        `)
        .replace(/if\(\w+\.MC&&\w+\.MC\.onPlayerDeath\)/, `
            $&
            window.user.isAlive = false
            if(window.user.startedBots) window.connection.send(new Uint8Array([5, Number(window.user.isAlive)]).buffer)
        `)
        .replace(/new\s+WebSocket\((\w+\(\w+\))\)/, `
            $&
            if(window.user.startedBots) window.connection.send(new Uint8Array([1]).buffer)
            window.game.url = $1
            window.user.isAlive = false
            window.user.macroFeedInterval = null
        `).replace(/(\w+)=~~\(\+\w+\[\w+\+\d+>>3]\+\s+\+\(\(\w+\[\w+\+\d+>>2]\|0\)-\(\(\w+\[\d+]\|0\)\/2\|0\)\|0\)\/\w+\);(\w+)=~~\(\+\w+\[\w+\+\d+>>3]\+\s+\+\(\(\w+\[\w+\+\d+>>2]\|0\)-\(\(\w+\[\d+]\|0\)\/2\|0\)\|0\)\/\w+\)/, `
            $&
            window.user.mouseX = $1 - window.user.offsetX
            window.user.mouseY = $2 - window.user.offsetY
            if(window.user.startedBots && window.user.isAlive) window.connection.send(window.buffers.mousePosition(window.user.mouseX, window.user.mouseY))
        `)
        .replace(/\w+\[\w+\+272>>3]=(\w+);\w+\[\w+\+280>>3]=(\w+);\w+\[\w+\+288>>3]=(\w+);\w+\[\w+\+296>>3]=(\w+)/, `
            $&
            if(~~($3 - $1) === 14142 && ~~($4 - $2) === 14142){
                window.user.offsetX = ($1 + $3) / 2
                window.user.offsetY = ($2 + $4) / 2
            }
        `)
        .replace(/\(\.9,/, '(window.ZOOM_SPEED,')
        .replace(/;if\((\w+)<1\.0\)/, ';if($1 < (!getOption("EXTENDED_ZOOM")))')
        .replace(/(\w+\(\d+,\w+\|0,\.5,\.5\)\|0);(\w+\(\d+,\w+\|0,\.5,50\.5\)\|0);(\w+\(\d+,\w+\|0,\.5,\.5\)\|0);(\w+\(\d+,\w+\|0,50\.5,\.5\)\|0)/, `
            $1
            if(window.getOption("DRAW_MAP_GRID")) $2
            $3
            if(window.getOption("DRAW_MAP_GRID")) $4
        `)
        .replace(/while\(0\);(\w+)=\(\w+\|0\)!=\(\w+\|0\);/, `
            $&
            if(window.getOption("SHOW_ALL_PLAYERS_MASS")) $1 = true
        `)
}

function setKeysEvents() {
    document.addEventListener('keydown', e => {
        if (!document.getElementById('overlays')) {
            switch (e.keyCode) {
                case options.hotkeys["BOTS_SPLIT_KEY"].keycode:
                    if (window.user.startedBots && window.user.isAlive) window.connection.send(new Uint8Array([2]).buffer)
                    break
                case options.hotkeys["BOTS_FEED_KEY"].keycode:
                    if (window.user.startedBots && window.user.isAlive) window.connection.send(new Uint8Array([3]).buffer)
                    break
                case options.hotkeys["BOTS_AI_KEY"].keycode:
                    if (window.user.startedBots && window.user.isAlive) {
                        if (!window.bots.ai) {
                            document.getElementById('botsAI').style.color = '#00C02E'
                            document.getElementById('botsAI').innerText = 'Enabled'
                            window.bots.ai = true
                            window.connection.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                        } else {
                            document.getElementById('botsAI').style.color = '#DA0A00'
                            document.getElementById('botsAI').innerText = 'Disabled'
                            window.bots.ai = false
                            window.connection.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                        }
                    }
                    break
                case options.hotkeys["MACRO_FEED_KEY"].keycode:
                    if (!window.user.macroFeedInterval) {
                        window.core.eject()
                        window.user.macroFeedInterval = setInterval(window.core.eject, 80)
                    }
                    break
                case options.hotkeys["DOUBLE_SPLIT_KEY"].keycode:
                    window.core.split()
                    setTimeout(window.core.split, 40)
                    break
                case options.hotkeys["SIXTEEN_SPLIT_KEY"].keycode:
                    window.core.split()
                    setTimeout(window.core.split, 40)
                    setTimeout(window.core.split, 80)
                    setTimeout(window.core.split, 120)
                    break
            }
        }
    })
    document.addEventListener('keyup', e => {
        if (!document.getElementById('overlays') && e.keyCode === options.hotkeys["MACRO_FEED_KEY"].keycode && window.user.macroFeedInterval) {
            clearInterval(window.user.macroFeedInterval)
            window.user.macroFeedInterval = null
        }
    })
}

function setGUI() {
    let menuhtml = `<div id="inputs" class="menu-panel" >
            <div class="inputs-tab-bar">
<span  id="settingsbutton"class="inputs-tab active" target="#settings"><i class="fa fa-keyboard-o"></i> <span>Settings</span></span>
                <span id="hotkeysbutton" class="inputs-tab" target="#hotkeys"><i class="fa fa-keyboard-o"></i> <span>Hotkeys</span></span>
                <span class="inputs-tab close" target="#close">X</span>
            </div>
            <div class="inputs-menu-container">
<div id="settings" class="inputs-menu active"></div>
                <div id="hotkeys" style="display:none;" class="inputs-menu ps ps--theme_default">
                          </div>
        </div>`
    $("#mainui-play").append(menuhtml);
    document.getElementById('advertisement').innerHTML = `
<button id="botsPanel">Options</button>
        <h3 id="botsInfo">
            <a href="https://discord.gg/JUfpR9k" target="_blank">Free Agar.io Bots</a>
        </h3>
        <h5 id="botsAuthor">
            Developed by <a href="https://github.com/jimboy3100/jimboy3100.github.io/blob/master/ExampleScripts/agario-bots2/" target="_blank">Nel, </a><a href="http://jimboy3100.github.io/" target="_blank">Jimboy3100</a>
        </h5>
        <span id="statusText">Status: <b id="userStatus">Disconnected</b></span>
        <br>
        <br>
        <span id="aiText">Bots AI: <b id="botsAI">Disabled</b></span>
        <br>
        <input type="text" id="botsName" placeholder="Bots Name" maxlength="15" spellcheck="false">
        <input type="number" id="botsAmount" placeholder="Bots Amount" min="10" max="199" spellcheck="false">
		<input type="text" id="botsRemoteIP" placeholder="ws://localhost:8083" maxlength="100" spellcheck="false">
        <button id="connect">Connect</button>
        <br>
        <button id="startBots" disabled>Start Bots</button>
        <button id="stopBots">Stop Bots</button>
    `
    if (localStorage.getItem('localStoredBotsName') !== null) {
        window.bots.name = localStorage.getItem('localStoredBotsName')
        document.getElementById('botsName').value = window.bots.name
    }
    if (localStorage.getItem('localStoredBotsAmount') !== null) {
        window.bots.amount = JSON.parse(localStorage.getItem('localStoredBotsAmount'))
        document.getElementById('botsAmount').value = String(window.bots.amount)
    }
	var storedbotsRemoteIP = localStorage.getItem("localstoredBotsRemoteIP");
	if (storedbotsRemoteIP==null || storedbotsRemoteIP==""){
	storedbotsRemoteIP = "ws://localhost:8083";
	}
	window.bots.remoteIP = storedbotsRemoteIP;
	window.SERVER_HOST = storedbotsRemoteIP;
	$('#botsRemoteIP').val(storedbotsRemoteIP)
    window.setUpHotkeys();
    window.setUpOptions();
}

function setGUIStyle() {
    document.getElementsByTagName('head')[0].innerHTML += `
        <style type="text/css">
.menu-panel {
	z-index: 1;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.95);
}
#hotkeys .row, #settings .row{
    padding: 10px;
    background: #f8f8f8;
    border-bottom: 1px solid #000;
}
#hotkeys .row .title,  #settings .row .title{
    font-family: Arial;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 13px;
}
#hotkeys .row .key, #settings .row .key {
    float: right;
    margin-right: 6px;
    font-family: Arial;
    background: #111;
    padding: 2px 5px;
    border: 2px solid #444;
    box-shadow: 0px 0px 2px #000;
    color: #8e8e8e;
    transform: translateY(-3px);
    text-align: center;
    width: 55px;
    font-weight: 700;
    cursor: pointer;
}
#settings .row .checkbox {
    float: right;
    margin-right: 6px;
    font-family: Arial;
    padding: 2px 5px;
    color: #8e8e8e;
    transform: translateY(3px);
    text-align: center;
    width: 55px;
    font-weight: 700;
    cursor: pointer;
}
#inputs {
    display: none;
    width: 400px;
    height: 500px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.input-hidden {
    color: transparent !important;
}
.input-hidden::selection {
    background: #777 !important;
    color: transparent !important;
}
.inputs-tab {
    cursor: pointer;
    background: #fff;
    padding: 6px 10px;
    border-radius: 4px 4px 0px 0px;
}
.inputs-tab.active {
    background: #fff;
}
.inputs-tab-bar {
    color: #000;
    font-size: 14px;
    font-family: Arial;
    height: 22px;
}
.inputs-menu-container {
    width: 100%;
    height: 478px;
    background: rgba(51, 51, 51, 0.5);
    border-radius: 0px 0px 4px 4px;
}
.inputs-menu {
    width: 100%;
    position: absolute;
    height: 478px;
    display: none;
    color: #000;
}
.inputs-menu.active {
    display: block;
}
.inputs-tab.close {
    float: right;
    margin-right: 5px;
    margin-top: -5px;
    border-radius: 50%;
}
            #mainui-ads {
                height: 400px !important;
            }
            #botsInfo > a, #botsAuthor > a {
                color: #3894F8;
                text-decoration: none;
            }
            #botsAuthor {
                margin-top: -15px;
                letter-spacing: 1px;
            }
            #statusText, #aiText {
                font-weight: bold;
            }
            #userStatus, #botsAI {
                color: #DA0A00;
            }
            #botsName, #botsAmount, #botsRemoteIP {
                margin-top: 5px;
                width: 144px;
                border: 1px solid black;
                border-radius: 5px;
                padding: 8px;
                font-size: 14.5px;
                outline: none;
            }
            #botsName:focus, #botsAmount:focus {
                border-color: #7D7D7D;
            }
            #connect, #startBots, #stopBots, #botsPanel {
                color: white;
                border: none;
                border-radius: 5px;
                padding: 7px;
                width: 160px;
                font-size: 18px;
                outline: none;
                margin-top: 5px;
                letter-spacing: 1px;
            }
            #connect {
                display: inline;
                margin-left: 5px;
                background-color: #0074C0;
            }
            #startBots {
                display: inline;
                background-color: #00C02E;
            }
#botsPanel {
                display: inline;
                background-color: #222;
            }
            #stopBots {
                display: none;
                background-color: #DA0A00;
            }
            #connect:active {
                background-color: #004E82;
            }
            #startBots:active {
                background-color: #009A25;
            }
            #stopBots:active {
                background-color: #9A1B00;
            }
        </style>
    `
}

function setGUIEvents() {
    $("#botsPanel").click(() => {
        $("#inputs").show();
    });
    $(".close").click(() => {
        $("#inputs").hide();
    });
    $("#hotkeysbutton").click(() => {
        $("#settings").hide();
         $("#hotkeys").show();
    });
    $("#settingsbutton").click(() => {
        $("#hotkeys").hide();
         $("#settings").show();
    });
    document.getElementById('botsAmount').addEventListener('keypress', e => {
        e.preventDefault()
    })
    document.getElementById('botsName').addEventListener('change', function() {
        window.bots.name = this.value
        localStorage.setItem('localStoredBotsName', window.bots.name)
    })
    document.getElementById('botsAmount').addEventListener('change', function() {
        window.bots.amount = Number(this.value)
        localStorage.setItem('localStoredBotsAmount', window.bots.amount)
    })
    document.getElementById('connect').addEventListener('click', () => {
        if (!window.connection.ws || window.connection.ws.readyState !== WebSocket.OPEN) window.connection.connect()
    })
    document.getElementById('startBots').addEventListener('click', () => {
        if (window.game.url && window.game.protocolVersion && window.game.clientVersion && !window.user.startedBots) {
			this.partytoken = MC.getPartyToken()
			if (this.partytoken!="" && this.partytoken!=null){
				if (window.bots.name && window.bots.amount && !document.getElementById('socialLoginContainer')) window.connection.send(window.buffers.startBots(window.game.url.split('?')[0], window.game.protocolVersion, window.game.clientVersion, window.user.isAlive, window.unescape(window.encodeURIComponent(window.bots.name)), window.bots.amount))
				//if (window.bots.name && window.bots.amount && !document.getElementById('socialLoginContainer')) window.connection.send(window.buffers.startBots(window.game.url.split('?')[0], window.game.protocolVersion, window.game.clientVersion, window.user.isAlive, window.bots.name, window.bots.amount))
				else alert('Bots name and amount are required before starting the bots, also you need to be logged in to your agar.io account in order to start the bots')
			}
			else{
				alert('Bots are designed for party')
			}
        }
    })
    document.getElementById('stopBots').addEventListener('click', () => {
        if (window.user.startedBots) window.connection.send(new Uint8Array([1]).buffer)
    })
        document.getElementById('botsRemoteIP').addEventListener('change', function(){
            window.bots.remoteIP = this.value
            localStorage.setItem('localstoredBotsRemoteIP', window.bots.remoteIP)
			window.SERVER_HOST = window.bots.remoteIP
        })
}

function loadUI(){
 $('body').append(`
<div id="botClient" style="position: absolute; top: 92%; left: 85%; padding: 0px 8px; font-family: Tahoma; color: rgb(255, 255, 255); z-index: 9999; border-radius: 5px; min-height: 16px; min-width: 200px; background-color: rgba(2, 0, 0, 0.4);">
<div><b>Bot Count</b>: <span id="botCount" class="label label-info pull-right">Waiting</span></div>
<b><div><b>ServerSlots</b>: <span id="slots" class="label label-info pull-right">Waiting</span></div>
</div>`);

}

WebSocket.prototype.storedSend = WebSocket.prototype.send
WebSocket.prototype.send = function(buffer) {
    this.storedSend(buffer)
    const dataView = new DataView(new Uint8Array(buffer).buffer)
    if (!window.game.protocolVersion && dataView.getUint8(0) === 254) window.game.protocolVersion = dataView.getUint32(1, true)
    else if (!window.game.clientVersion && dataView.getUint8(0) === 255) window.game.clientVersion = dataView.getUint32(1, true)
}

new MutationObserver(mutations => {
    mutations.forEach(({
        addedNodes
    }) => {
        addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.tagName === 'SCRIPT' && node.src && node.src.includes('agario.core.js')) {
                node.type = 'javascript/blocked'
                node.parentElement.removeChild(node)
                fetch(node.src)
                    .then(res => res.text())
                    .then(core => {
                        Function(modifyCore(core))()
                        setKeysEvents()
                        setTimeout(() => {
                            setGUI()
                            setGUIStyle()
                            setGUIEvents()
                            loadUI()
                        }, 3500)
                    })
            }
        })
    })
}).observe(document.documentElement, {
    childList: true,
    subtree: true
})
