// ==UserScript==
// @name         colorsteal
// @namespace    https://ccjit.github.io/my-site
// @version      1.2-preview
// @description  steal colorssss >:33333
// @author       ccjt
// @match        https://multiplayerpiano.org/*
// @match        https://multiplayerpiano.net/*
// @match        https://piano.mpp.community/*
// @match        https://multiplayerpiano.dev/*
// @match        https://mpp.8448.space/*
// @license      MIT
// @icon         data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsSAAALEgHS3X78AAAAAXNSR0IArs4c6QAAAnpJREFUeF7tmlFShDAMhrfjDdRX9XLO6JH0ePqsZ8AJM2FiJ23DJiTAxhdZKIV8Tf4kQJmmabrc8F9JAOkBGQKpATesgZcUwcwCnSxQSmGj40yJoxkCYPyZDG3p3KYAjgAxAbRE0GL1LObYOkWrPaAWSqobNQDJWBzjpT8qANwK032tbVzV+jjs9zJ8uQdNCFgD8DYeIOzKAxJAQGPa7QUklaBE2GjMU1XvCebW6j/UAK8biL5OdoOR3SAXYt5CGOYBEVUim7ajPCABBLTbh/QAS0/ZFYC5DGWeONW1AaZJ3N+rO7g5R7VGmAg2n9BUobG2oaqzyPB8rQj+fn4Pa5mHt+fhGK5DxBVtrT7nHa4AJMbjTUohcM8QKIBenbCmO1WXwmg8GAbb+L+31BIIhwMABnPGc2BqACMRrENgrXCKQuRaDaDuTwG0thGUWAycBqqywBYa4GT3chkVAJhFAuHx/eWfXd4NTw+qGoBkxUbFi2SOrca4A4DVtyxvtWBcAfx8fM33C0K5FwguAGiVtzcIrgAwjyME+A0CGSmKIQDAcIQAACiQUUxLqsnRHPS4OwBMnZga1xi/tq+QgHAHIKkbRjde7srl/vVpNEx0PBwAunTdXLV6DGsvCAUwaqLQWM5rrLRgtwBO6wF1/0BDoPaI1jMGq9Wf0/K17bBIYTqDrhVDS+NDAWgBWp0f5gFWBmjnSQBRGqBdOavz0wPSAyJ7USs/VsyTIZAhkCHQ/jqx9bIRQu4s3LqfytaGjt61K7Qo7FQWABqqeVMbZtHKC88AJAbPnRP5emMvz/Wl9nKf5i/d4C0BqG1dQqD3dQVH70giiO8m6Ws5tOkPIuP6YibZoUkAAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533170/colorsteal.user.js
// @updateURL https://update.greasyfork.org/scripts/533170/colorsteal.meta.js
// ==/UserScript==
let version = '1.2'
/* finally unused code
if (localStorage.resetname == undefined) {
    localStorage.setItem('resetname', MPP.client.ppl[MPP.client.getOwnParticipant()._id].name)
}
if (localStorage.resetcolor == undefined) {
    localStorage.setItem('resetcolor', MPP.client.ppl[MPP.client.getOwnParticipant()._id].color)
}
function countAllIdsFound(query) {
    let found = 0
    let ids = []
    for (let i = 0; i < Object.keys(MPP.client.ppl); i++) {
        if (Object.values(MPP.client.ppl)[i]._id.includes('query')) {
            found += 1
            console.log("Found user! Full ID: " + Object.values(MPP.client.ppl)[i]._id + ", Name: " + Object.values(MPP.client.ppl)[i].name)
            ids.push(Object.values(MPP.client.ppl)[i]._id)
        } else {
            console.log('not found yet - searching amount of ids including portion of id')
        }
    }
    console.log("Search complete! Amont of results: " + found)
    return {
        ids: ids,
        amountFound: found,
    }
}*/
function findIdByName(name) {
    let found = false;
    if (name.length < 2) {
        console.log('Search query too short. You need atleast 2 characters to find a name from. returning own _id')
        return MPP.client.getOwnParticipant()._id
    } else {
        for (let i = 0; i < Object.keys(MPP.client.ppl).length; i++) {
            if (Object.values(MPP.client.ppl)[i].name.toLowerCase().includes(name)) {
                let found = true
                console.log('Name found! Full name: ' + MPP.client.ppl[Object.keys(MPP.client.ppl)[i]].name + " - Full _ID: " + Object.values(MPP.client.ppl)[i]._id)
                return {
                    id: MPP.client.ppl[Object.keys(MPP.client.ppl)[i]]._id,
                    name: MPP.client.ppl[Object.keys(MPP.client.ppl)[i]].name
                }
                break
            } else {
                console.log("not found yet - searching id by name")
            }
        }
        if (!found) {
            console.log("name not found, maybe the user doesn't exist. returning own _id")
            return {
                id: "undefined",
                name: "[USER NOT FOUND]"
            }
        }
    }
}
function searchId(query) {
    let found = false
    if (query.length < 3) {
        console.log('Search query too short. You need atleast 3 characters to search just one ID from. returning a random person')
        return MPP.client.ppl[Object.keys(MPP.client.ppl)[Math.floor(Math.random()*Object.keys(MPP.client.ppl).length)]].id
    } else {
        for (let i = 0; i < Object.values(MPP.client.ppl).length; i++) {
            if (Object.values(MPP.client.ppl)[i]._id.includes(query)) {
                let found = true
                console.log("Found user - Name: " + Object.values(MPP.client.ppl)[i].name + " - full id: " + Object.values(MPP.client.ppl)[i]._id)
                return Object.values(MPP.client.ppl)[i]._id
                break
            } else {
                let found = false
                console.log('not found yet - searching id by portion of id')
            }
        }
        if (!found) {
            console.log('id not found, searching query as name')
            return findIdByName(query).id
        }
    }
}
function reverseString(string) {
    let strLen = string.length
    let strChars = string.split('')
    let newStr = []
    for (let i = 0; i < strLen; i++) {
        newStr.push(strChars[strChars.length - i])
    }
    newStr.push(strChars[0])
    return newStr.join('')
}
function getPpl() {
    let str = undefined
    let str2 = undefined
    for (let i = 0; i < Object.values(MPP.client.ppl).length; i++) {
        let str = Object.values(MPP.client.ppl)[i]._id.substring(0,6)
        if (localStorage.ids == undefined) {
            localStorage.setItem('ids', str)
            console.log(str)
            console.log(localStorage.ids)
        } else {
            localStorage.setItem('ids', localStorage.ids + ", " + str)
            console.log(str)
            console.log(localStorage.ids)
        }
    }
    for (let j = 0; j < Object.values(MPP.client.ppl).length; j++) {
        let str2 = Object.values(MPP.client.ppl)[0].name
        if (localStorage.names == undefined) {
            localStorage.setItem('names', str2)
            console.log(str2)
            console.log(localStorage.names)
        } else {
            localStorage.setItem('names', localStorage.names + ", " + str2)
            console.log(str2)
            console.log(localStorage.names)
        }
    }
    return {
        ids: localStorage.ids,
        names: localStorage.names,
    }
    localStorage.removeItem('ids')
    localStorage.removeItem('names')
}
function blendColors(colorA, colorB, amount) {
  const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
  const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
  const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
  const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
  const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
  return '#' + r + g + b;
}
let operations = [
    '+',
    "-"
]
/* fix later
function mathGame() {
    send("Get ready to do some math in 5 seconds!")
    let x = Math.floor(Math.random() * 25)
    let y = Math.floor(Math.random() * 25)
    let op = Math.floor(Math.random() * operations.length)
    let time = 0
    let starttime = 0
    setTimeout(function () {
        let starttime = Date.now()
        send("Solve 〈 " + x + " " + op + " " + y + " 〉 as fast as you can!")
    }, 5000)
    while (true) {
        let currtime = Date.now
        MPP.client.on('a', function(m) {
            if (m.a.split(' ')[0] == eval(JSON.stringify(x) + op + JSON.stringify(y))) {
                localStorage.setItem('won', true)
            } else {
                localStorage.setItem('won', false)
            }
        });
        if (localStorage.won == true) {
            send('')
        }
    }
}*/
const shitposts = [
    "Why So Serious? - https://chat.8448.space/files/RNTsRhvGcVWwizeoykerc5KYqZwRTZ2x1tuXoeRzsWbEavTrfqOaj7JOkZdE8mHJ.mp4",
    "Radiation - https://chat.8448.space/files/Lmkrb9sMOpdVTt4omsFhrvIaW86ZeTNGniGPk52tPXGpq3gaVhJEOLsqXOhyCMPA.mp4",
    'LVL 5 - https://chat.8448.space/files/UTWn58BIiWF2eganyomOkejVsAh4vpvoynxO3lf5BF174HNO74hkWtyxvIW1bRyR.mp4',
    'Rain Bee Tong - https://chat.8448.space/files/zuSwzfMuV8MAdywzaDHP3XBUACyVwL3GVTQpClPdxwUxdF7OY1CCkagcbj4pTutL.mp4',
    'Armor - https://chat.8448.space/files/8qfxKzhESNgtvzlPPqlok2dh7zRWXEQVTtKXmBShI9CsTXhfoYvmoVDwQp94UYh1.mp4',
    'Black Pencil - https://chat.8448.space/files/VFceLyblUBBmrRkZpF5BlYX07KMaE0RT9Y1TsrguDCijFVQSfRlER2DKPAKNl0Za.mp4',
    'Pink Revolution - https://chat.8448.space/files/FQQVITzscnPNp7RQX6zukBjtoUpoCjcnBG2wyvlDOiLr5lOyCrexH3EuiSmPA05x.mp4',
    'Double Сum - https://chat.8448.space/files/DGGpVYToY08o3ysAfLIrCLHNkCAhK9XhMZlex5RrlXCERC7j0yrBTnDcfqcQTf9i.mp4',
    'LoFi Radio - https://chat.8448.space/files/boFcVTEcr4FIFajIbRSwtgjiqfkpHozi9z97ZxhLsSyxcY2Bzt7NYapHosiDptFI.mp4',
    'HAAAIIIII o(≧▽≦)o 🍦 - https://chat.8448.space/files/XHkeilgiMhOfgXRoVYa6Ei9SoQENlpjhMUPp8Bgz9mtXm3tyC1r5fsOmdor0VJIp.mp4'
]
// "u": "n", derwear haha gottem
// (^preserve^)
let mem = 'lobby'
function checkVersion() {
    fetch('https://raw.githubusercontent.com/ccjit/colorsteal/refs/heads/main/versions.json').then(r => r.json().then(json => {
        if (Object.values(json).includes(version) && version != json.latest) {
            let originalTitle = "Piano (" + Object.keys(MPP.client.ppl).length + ")";
            // Trigger when tab visibility changes
            let blinkInterval;
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    clearInterval(messageInterval);
                    // Tab is hidden: start blinking
                    blinkInterval = setInterval(() => {
                        document.title = document.title.includes('⚠️')
                            ? originalTitle
                        : '⚠️ Please update colorsteal!';
                    }, 500);
                } else {
                    // Tab is visible again: stop blinking
                    let messageInterval = setInterval(MPP.chat.receive({
                        "m": "a",
                        "t": Date.now(),
                        "a": "Please update colorsteal! Current version: " + version + " - Latest version: " + json.latest + " - Click this link > https://update.greasyfork.org/scripts/533170/colorsteal.user.js < this link and use \"refresh\" to refresh your page to apply the script. - `Changelog: " + json.update.description + "`",
                        "p": {
                            "_id": "colors",
                            "name": "Colorsteal - ꧁⌬♩♪♫ ⋰〈 🏳️‍⚧️ ᴄᴄᴊᴛ 🏳️‍⚧️ ⌨ 〉⋱ ♫♪♩⌬꧂",
                            "color": "#ff4747",
                            "id": (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7)
                        }
                    }), 60000)
                    clearInterval(blinkInterval);
                    document.title = originalTitle; // Restore original title
                }
            })
        }}));

}
function checkVersionManual() {
    fetch('https://raw.githubusercontent.com/ccjit/colorsteal/refs/heads/main/versions.json').then(r => r.json().then(json => {
        if (Object.values(json).includes(version) && version != json.latest) {
            MPP.chat.receive({
                "m": "a",
                "t": Date.now(),
                "a": "Please update colorsteal! Current version: " + version + " - Latest version: " + json.latest + " - Click this link > https://update.greasyfork.org/scripts/533170/colorsteal.user.js < this link and use \"refresh\" to refresh your page to apply the script. - `Changelog: " + json.update.description + "`",
                "p": {
                    "_id": "colors",
                    "name": "Colorsteal - ꧁⌬♩♪♫ ⋰〈 🏳️‍⚧️ ᴄᴄᴊᴛ 🏳️‍⚧️ ⌨ 〉⋱ ♫♪♩⌬꧂",
                    "color": "#ff4747", // pastel red
                    "id": (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7)
                }
            });
            document.title = "⚠️ Please update colorsteal!"
            setTimeout(document.title = "Piano (" + Object.keys(MPP.client.ppl).length + ")", 5000)
        } else if (Object.values(json).includes(version) && json.latest == version) {
            MPP.chat.receive({
                "m": "a",
                "t": Date.now(),
                "a": "You're up to date! Current version: " + version + " - Latest version: " + json.latest + " - `Changelog for your version: " + json.update.description + "`",
                "p": {
                    "_id": "colors",
                    "name": "Colorsteal - ꧁⌬♩♪♫ ⋰〈 🏳️‍⚧️ ᴄᴄᴊᴛ 🏳️‍⚧️ ⌨ 〉⋱ ♫♪♩⌬꧂",
                    "color": "#6dee49", // pastel green
                    "id": (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7)
                }
            });
        } else if (!Object.values(json).includes(version) && version != json.latest) {
            MPP.chat.receive({
                "m": "a",
                "t": Date.now(),
                "a": "You are using a beta version of colorsteal, you might notice bugs and instability. But in a nutshell, you're up to date! Current version: " + version + " - Latest stable version: " + json.latest + " - `Changelog for the stable version: " + json.update.description + "`",
                "p": {
                    "_id": "colors",
                    "name": "Colorsteal - ꧁⌬♩♪♫ ⋰〈 🏳️‍⚧️ ᴄᴄᴊᴛ 🏳️‍⚧️ ⌨ 〉⋱ ♫♪♩⌬꧂",
                    "color": "#fafa67", // pastel yellow
                    "id": (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7)
                }
            });
        }
    }));
}
MPP.client.on('hi', function () {
    checkVersion()
    if (localStorage.hasUsedColorstealBefore == undefined) {
        localStorage.removeItem('resetname')
        localStorage.removeItem('resetcolor')
        setTimeout(function(){
            MPP.chat.receive({
                "m": "a",
                "t": Date.now(),
                "a": "Thanks for using colorsteal! To get a list of commands you can try after installing this bot, use `help`. You don't need to provide any information for this bot, the needed info will be stored after sending a message..",
                "p": {
                    "_id": "colors",
                    "name": "Colorsteal - ꧁⌬♩♪♫ ⋰〈 🏳️‍⚧️ ᴄᴄᴊᴛ 🏳️‍⚧️ ⌨ 〉⋱ ♫♪♩⌬꧂",
                    "color": "#b3acf1",
                    "id": (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7)
                }
            });
            MPP.chat.receive({
                "m": "a",
                "t": Date.now(),
                "a": "You can for example, steal the color from,,, let me pick,, uhh... you can steal the color from " + MPP.client.ppl[Object.keys(MPP.client.ppl)[Math.floor(Math.random()*Object.keys(MPP.client.ppl).length)]].name + " by using `steal " + MPP.client.ppl[Object.keys(MPP.client.ppl)[Math.floor(Math.random()*Object.keys(MPP.client.ppl).length)]]._id.substring(0,6) + "`! ─ You can also set your color to a random one with `shuffle`, and if you like it, favorite it using `fave`!",
                "p": {
                    "_id": "colors",
                    "name": "Colorsteal - ꧁⌬♩♪♫ ⋰〈 🏳️‍⚧️ ᴄᴄᴊᴛ 🏳️‍⚧️ ⌨ 〉⋱ ♫♪♩⌬꧂",
                    "color": "#b3acf1",
                    "id": (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7)
                }
            });
            MPP.chat.receive({
                "m": "a",
                "t": Date.now(),
                'a': "Don't worry! Only you can see these messages, and this won't happen again. Have fun using my bot! <3",
                "p": {
                    "_id": "colors",
                    "name": "Colorsteal - ꧁⌬♩♪♫ ⋰〈 🏳️‍⚧️ ᴄᴄᴊᴛ 🏳️‍⚧️ ⌨ 〉⋱ ♫♪♩⌬꧂",
                    "color": "#b3acf1",
                    "id": (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7) + (Math.random() + 1).toString(24).substring(7)
                }
            });
            localStorage.setItem('hasUsedColorstealBefore', true)}, 5000)
    }
});
let noargsball = [
    "Reply hazy, try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again"
]
let ball = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy, try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"
]
if (localStorage.help == undefined) {
    localStorage.setItem('help', true)
}
if (localStorage.counter == undefined) {
    localStorage.setItem('counter', 0)
}
MPP.client.on('a', function(m) {
    let args = m.a.split(' ');
    let cmd = args[0].toLowerCase();
    let crowned = ('crown' in MPP.client.channel && MPP.client.channel.crown.userId == MPP.client.getOwnParticipant()._id)
    let send = function(m) {
        MPP.chat.send(m)
    }
    let receive = function (userdata, msg) {
        MPP.chat.receive({
            "m": "a",
            "t": Date.now(),
            'a': msg,
            "p": {
                "_id": userdata._id,
                "name": userdata.name,
                "color": userdata.color,
                "id": userdata._id
            }
        });
    }
    let public = false
    let randroom = "Room" + Math.floor(Math.random() * 1e12)
    let randomhex = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    let colorname = function(hex) { if (new Color(hex).getName().length > 10) { return new Color(hex).getName().substring(10).trim() } else { return new Color(hex).getName() } }
    let shitpost = shitposts[Math.floor(Math.random()*shitposts.length)]
    // cmds
    if (localStorage.resetname == undefined && localStorage.resetcolor == undefined) {
        localStorage.setItem('resetname', MPP.client.getOwnParticipant().name)
        localStorage.setItem('resetcolor', MPP.client.getOwnParticipant().color)
    }
    if (cmd == "add") {
        localStorage.setItem('counter', parseInt(localStorage.counter) + 1)
        send("Counter: " + localStorage.counter)
    }
    if (m.p.id == MPP.client.participantId || public) {
        if (cmd == "reverse") {
            if (args.length == 1) {
                send("\"Look ma! I'm not putting any text to the `reverse` command!\" in reverse is \"" + reverseString("Look ma! I'm not putting any text to the `reverse` command!") + "\"")
            } else {
                send("\"" + m.a.substring(7).trim() + "\" in reverse is \"" + reverseString(m.a.substring(7).trim()) + "\"")
            }
        }
        if (cmd == "checkversion") {
            if (window.navigator.onLine) {
                checkVersionManual()
            } else {
                receive({
                    color: "#ff4747",
                    name: "System",
                    _id: "system",
                    id: "systemsystemsystemsystem"
                }, "You are offline. Try checking your version when you're back online.")
            }
        }
        if (cmd == 'knownnames') {
            if (args.length == 1) {

            }
        }
        if (cmd == "help") {
            if (localStorage.help) {
                if (args.length == 1) {
                    send("Please choose a category: userset, info, fun, other - Do `help <category>` to access a category.") // or use `help usage [command name]` to get the usage of a command - but that doesn't actually work
                } else if (args.length == 2) {
                    if (args[1] == "userset") {
                        send("Commands: steal - steals color from ID | color - sets color to hex | name - sets name | shuffle - makes you a random color | reset - resets you to your defaults | stat - this command sets a status for you")
                    } else if (args[1] == "info") {
                        send("Commands: mycolor - tells you your current color | settings - sends room settings to chat | about - info about bot or info about user | help - lists commands | define - defines a variable | whereami - tells you the room name | chown - tells you who is holding crown | checkversion - checks your version")
                    } else if (args[1] == "fun") {
                        send("Commands: flip - flips or fails | shitpost - sends a shitpost | merge - merges 2 colors | mergeid - merge colors from 2 ids | rate - rates you on the subject you provide | 8ball - shakes an 8 ball | reverse - reverses text")
                    } else if (args[1] == "other") {
                        send("Commands: fave - favorites an item | faves - tells you favorited items | wipefaves - erases favorited items | mention - mentions a user | kick - kicks a user if holding crown | dm - starts a DM (direct message) to the specified user")
                    } else if (args[1] != "userset" && args[1] != "info" && args[1] != "fun" && args[1] != "other") {
                        send("Sorry, but that category doesn't exist. Valid categories: userset, info, fun, other - Do `help <category>` to access a category.")
                    } /*else if (args[1] == "usage") { fix when you can, you dummy
                    if (args.length == 2) {
                        send("Please specify a command to know about. Example: help usage steal")
                    } else if (args[2] == "steal") {
                        send("Steal - This command takes the color from the ID or name you specify and sets your color to it. - Example: steal [ID or name]")
                    } else if (args[2] == "color") {
                        send("Color - This command sets your color to the hex code you specify, or tells the color of the specified ID or name. - Example 1: color #bababa - This example command sets your color to Baby Talk Grey. - This command can also get the color from a desired ID or name.")
                    } else if (args[2] == "name") {
                        send("Name - This command sets your name to the text you specify. - Example: name Anonymous is using colorsteal - This example command sets your name to \"Anonymous is using colorsteal\".")
                    } else if (args[2] == "shuffle") {
                        send("Shuffle - This command sets your color to a completely random color. - Example: shuffle - This example sets your color to a random color that you've probably never seen before.")
                    } else if (args[2] == "reset") {
                        send("Reset - This command resets your name and color to your default name and color, and can also reset your name or your color independently, by using \"reset name\" and \"reset color\" respectively. You can change your reset name and color by doing \"define reset name [name]\" and \"define reset color [hex code]\" respectively. - Example: reset")
                    } else if (args[2] == "mycolor") {
                        send("MyColor - This command tells you your current color in hex. - Example: mycolor - This example command tells you your current color.")
                    } else if (args[2] == "about") {
                        send("About - This command tells you bot info when no ID or name is provided, but if you specify an ID, it will tell you the info about that user. - Example 1: about ; This example sends a message with bot info. - Example 2: about [ID or name] ; This example sends a message with the info about the specified ID or name.")
                    } else if (args[2] == "help") {
                        send("Help - This command displays the list of commands in a category, or tells you the usage of a command. - Example 1: help info ; This example shows the commands in the \"info\" category. - Example 2: help usage steal ; This command shows the usage of the \"steal\" command.")
                    } else if (args[2] == "define") {
                        send("Define - This command defines a variable. - Example: define reset name Anonymous | This example command sets your reset name to Anonymous, so that when you use the \"reset\" command, your name is set to \"Anonymous\".")
                    } else if (args[2] == "whereami") {
                        send("WhereAmI - This command says your current room name. - Example: whereami - This example command says that \"You're in the room \"" + MPP.client.channel._id + "\".\"")
                    } else if (args[2] == "stat") {
                        send("Stat - This command adds a status at the end of your name. - Example: stat AFK - This example command sets your name to \"" + m.p.name + " [AFK]\".")
                    } else if (args[2] == "flip") {
                        send("Flip - This command has a 69% chance of saying \"*flips*\", and a 31% chance of saying \"*fails*\".")
                    } else if (args[2] == "fave") {
                        send("Fave - This command favorites an item. - Example: fave #bababa - baby gray - This example command favorites the string \"#bababa - baby gray\". You can check your favorited items with \"faves\".")
                    } else if (args[2] == "faves") {
                        send("Faves - This command tells you your favorited items.")
                    } else if (args[2] == "wipefaves") {
                        send("WipeFaves - This command erases all your favorited items permanently, with no way to bring them back.")
                    } else if (args[2] == "shitpost") {
                        send("Shitpost - This command sends a link to a random Sushi Monsters shitpost.")
                    } else if (args[2] == "ppl") {
                        send("PPL - This command sends a list of all IDs. You can get info about those IDs using \"about [ID]\".")
                    } else if (args[2] == "merge") {
                        send("Merge - This command merges 2 hex colors. - Example: merge #000000 ffffff. - This example command merges the colors black (000000) and white (#ffffff) which gives #808080 (gray)")
                    } else if (args[2] == "mergeid") {
                        send("MergeID - This command merges 2 colors from 2 IDs.")
                    } else if (args[2] == "playalone") {
                        send("PlayAlone - This command sends you to a Play Alone room.")
                    } else if (args[2] == "mention") {
                        send("Mention - This command mentions the user with the name/ID you provided.")
                    } else if (args[2] == "chown") {
                        send("ChOwn - This command sends the user ID of the person holding the crown.")
                    } else if (args[2] == "kick") {
                        send("Kick - This command kicks the user with the ID or name of the person you provide. If the user isn't found, you kick yourself instead.")
                    } else if (args[2] == "rate") {
                        send("Rate - This command tells you how associated you are with a certain topic.")
                    } else if (args[2] == "8ball") {
                        send("8 Ball - Shakes an 8 Ball to answer your question.")
                    } else if (args[2] == "checkversion") {
                        send("CheckVersion - Checks if there are any new updates.")
                    }
                }*/
                }
            } else {
                send('Help command is off. You can enable it using `define help on`.')
            }
        }
        /* cursed code
        if (cmd == 'get') {
            if (args.length == 1) {
                send('Please specify a category to get something from. Categories: random')
            } else if (args.length == 2) {
                if (args[1] == "random") {
                    if (args.length == 2) {
                        send('Please specify a thing to get from this category: Items: person, number')
                    }
                }
            } else if (args[1] == "random")
                if (args[2] == "person") {
                    send(MPP.client.ppl[Object.keys(MPP.client.ppl)[Math.floor(Math.random()*Object.keys(MPP.client.ppl).length)]].name)
                } else if (args[2] == "number") {
                    send("Random number (0 to 100): " + Math.floor(Math.random()*100))
                }
            }
        }*/
        if (cmd == "stranger") {
            send(MPP.client.ppl[Object.keys(MPP.client.ppl)[Math.floor(Math.random()*Object.keys(MPP.client.ppl).length)]].name + " - " + MPP.client.ppl[Object.keys(MPP.client.ppl)[Math.floor(Math.random()*Object.keys(MPP.client.ppl).length)]].color)
        }
        if (cmd == "kick") {
            if ("crown" in MPP.client.channel) {
                if (MPP.client.channel.crown.userId == MPP.client.getOwnParticipant()._id) {
                    if (args.length < 3) {
                        send('You need to specify more arguments. Usage: `kick [id] [minutes] [reason]`')
                    } else {
                        let mem = MPP.client.channel._id;
                        MPP.client.sendArray([{"m":"kickban","_id":searchId(args[1]),"ms":parseInt(args[2])*60000}]);
                        MPP.client.setChannel('test/awkward');
                        if (args.length == 3) {
                            send("You have been kicked from `" + mem + "` for " + args[2] + " minutes. Reason: `No reason provided`")
                        } else if (args.length > 3) {
                            send("You have been kicked from `" + mem + "` for " + args[2] + " minutes. Reason: `" + m.a.substring(args[0].length + args[1].length + args[2].length + 3).trim() + "`")
                        }
                        MPP.client.setChannel(mem);
                    }
                } else {
                    send(MPP.client.ppl[MPP.client.channel.crown.userId].name + " (" + MPP.client.channel.crown.userId + ') is the crown holder. You can try asking for them to kick the person or asking for the crown (if this room was yours).')
                }
            } else {
                send("You can't kick someone in a lobby room.")
            }
        }
        if (cmd == "dm") {
            if (args.length == 1) {
                send("Please specify an ID or name to DM.")
            } else {
                if (searchId(m.a.substring(2).trim()) == undefined) {
                    send("Sorry, but that ID/name wasn't found in the room. Maybe you've misspelled it.")
                } else {
                    MPP.chat.startDM(MPP.client.ppl[searchId(m.a.substring(2).trim())])
                    document.getElementById('chat-input').placeholder = "Direct messaging " + MPP.client.ppl[searchId(m.a.substring(2).trim())].name + " - Press enter 2 times to exit DM"
                }
            }
        }
        if (cmd == "chown") {
            if ("crown" in MPP.client.channel) {
                if (MPP.client.channel.crown.userId == MPP.client.getOwnParticipant()._id) {
                    send("You are the crown holder.")
                } else {
                    send(MPP.client.ppl[MPP.client.channel.crown.userId].name + " (`" + MPP.client.channel.crown.userId + '`) is the crown holder.')
                }
            } else {
                send("There is no crown holder.")
            }
        }
        if (cmd == "rate") {
            if (args.length == 1) {
                send("You are 100% sending an empty topic to this command.")
            } else {
                send(`You are ${Math.floor(Math.random()*100)}% ${m.a.substring(4).trim()}.`)
            }
        }
        if (cmd == "merge") {
            if (args.length < 3) {
                send("Please specify 2 hex colors to merge. If you want to merge the colors of 2 IDs, use \"mergeid\". Usage: merge [hex 1] [hex 2] [mix amount*] *Optional")
            } else if (args[1].includes('#')) {
                if (args[2].includes('#')) {
                    send(args[1] + " + " + args[2] + " = " + blendColors(args[1], args[2], 0.5))
                } else {
                    send(args[1] + " + " + args[2] + " = " + blendColors(args[1], "#" + args[2], 0.5))
                }
            } else if (args[2].includes('#')) {
                send(args[1] + " + " + args[2] + " = " + blendColors("#" + args[1], args[2], 0.5))
            } else {
                send(args[1] + " + " + args[2] + " = " + blendColors('#' + args[1], "#" + args[2], 0.5))
            }
         }
        if (cmd == "ppl") {
            send(Object.values(MPP.client.ppl).length + ": " + getPpl().ids)
            send(Object.values(MPP.client.ppl).length + ": " + getPpl().names)
        }
        if (cmd == "mergeid") {
            if (args.length < 3) {
                send("Please specify 2 IDs to merge colors from. If you want to merge 2 hex colors, use \"merge\".")
            } else {
                send(MPP.client.ppl[searchId(args[1])].name + " (" + MPP.client.ppl[searchId(args[1])].color + ") + " + MPP.client.ppl[searchId(args[2])].name + " (" + MPP.client.ppl[searchId(args[2])].color + ") = " + blendColors(MPP.client.ppl[searchId(args[1])].color, MPP.client.ppl[searchId(args[2])].color, 0.5))
            }
        }
        if (cmd == 'shitpost') {
            send(shitpost)
        }
        if (cmd == "fave") {
            if (args.length == 1) {
                if (localStorage.fave == undefined) {
                    localStorage.setItem("fave", " color: " + m.p.color + " - name: " + m.p.name)
                    send('faved!')
                } else {
                    localStorage.setItem("fave", localStorage.fave + ", color: " + m.p.color + " - name: " + m.p.name)
                    send('faved!')
                }
            } else {
                if (localStorage.fave == undefined) {
                    localStorage.setItem("fave", m.a.substring(4).trim())
                    send("faved!")
                } else {
                    localStorage.setItem("fave", localStorage.fave + ", " + m.a.substring(4).trim())
                    send("faved!")
                }
            }
        }
        if (cmd == "faves") {
            if (localStorage.fave == undefined) {
                send("you have no faves! (maybe you wiped your faves..?)")
            } else {
                send(localStorage.fave)
            }
        }
        if (cmd == "wipefaves") {
            if (args.length == 1) {
                send("ARE YOU SURE? [y/n]")
            } else {
                if (args[1] == "y") {
                    send("wiped!")
                    localStorage.removeItem('fave')
                } else {
                    if (args[1] == "n") { send("ok!") }
                }
            }
        }
        if (cmd == "stat") {
            if (m.a.substring(4).trim().length + m.p.name.length + 2 > 40) {
                send("stat too long!! (final name length: " + (m.a.substring(4).trim().length + m.p.name.length + 3) + " - maximum name length: 40)")
            } else {
                MPP.client.sendArray([{
                    m: 'userset',
                    set: {
                        name: `${m.p.name} [${m.a.substring(4).trim()}]"`
                    }
                }]);
                send("set!")
            }
        }
        /*
        if (cmd == "quotacheck") {
            let a = m.p.color
            MPP.client.sendArray([{
                m: 'userset',
                set: {
                    color: randomhex
                }
            }]);
            if (MPP.client.ppl[MPP.client.getOwnParticipant()._id].color == randomhex) {
                send("your userset quota has been met, you'll have to wait through 12 minutes at maximum.")
            } else {
                send("your userset quota hasn't been met yet")
            }
            MPP.client.sendArray([{
                m: 'userset',
                set: {
                    color: a
                }
            }]);
        }*/
        if (cmd == "flip") {
            if (Math.random() < (69/100)) {
                send("\*flips*")
            } else {
                send("\*fails*")
            }
        }
        if (cmd == "shuffle") {
            MPP.client.sendArray([{
                m: 'userset',
                set: {
                    color: randomhex
                }
            }]);
            send("Shuffled color: " + randomhex + " - " + colorname(randomhex))
        }
        if (cmd == "8ball") {
            if (args.length == 1) {
                send(noargsball[Math.floor(Math.random()*noargsball.length)])
            } else {
                send(ball[Math.floor(Math.random()*ball.length)])
            }
        }
        if (cmd == "steal") {
            MPP.client.sendArray([{
                m: 'userset',
                set: {
                    color: MPP.client.ppl[`${searchId(args[1])}`].color
                }
            }]);
            send('Stolen from ' + MPP.client.ppl[searchId(args[1])].name + " (" + searchId(args[1]).substring(0,6) + ") successfully.")
        }
        if (cmd == "reset") {
            if (localStorage.resetname == undefined && localStorage.resetcolor == undefined) {
                send("It seems you don't have your reset information defined. Use `define reset name " + m.p.name + "` and `define reset color " + m.p.color + "` to define your reset information.")
            } else
            if (localStorage.resetname == undefined) {
                send("It seems you don't have your reset name defined. Use `define reset name " + m.p.name + "` to define your reset name.")
            } else
            if (localStorage.resetcolor == undefined) {
                send("It seems you don't have your reset color defined. Use `define reset color " + m.p.color + "` to define your reset color.")
            } else {
                if (args.length == 1) {
                    MPP.client.sendArray([{
                        m: 'userset',
                        set: {
                            name: localStorage.resetname,
                            color: localStorage.resetcolor
                    }
                    }]);
                    receive({
                        "color": "#6dee49", // pastel green
                        "_id": "colors",
                        "name": "Reset - ꧁⌬♩♪♫ ⋰〈 🏳️‍⚧️ ᴄᴄᴊᴛ 🏳️‍⚧️ ⌨ 〉⋱ ♫♪♩⌬꧂",
                        "id": "colorsteal"
                    }, "Reset successfully.")
                    receive({
                        "color": localStorage.resetcolor,
                        "name": localStorage.resetname,
                        "_id": "colors",
                        "id": "colorsteal"
                    }, "< If this isn't your username and color, your userquota ran out. You can try resetting yourself after 12 minutes in that case.")
                } else if (args[1] == "color") {
                    MPP.client.sendArray([{
                        m: 'userset',
                        set: {
                            color: localStorage.resetcolor
                        }
                    }]);
                    receive({
                        "color": localStorage.resetcolor,
                        "_id": "colors",
                        "name": "Reset - ꧁⌬♩♪♫ ⋰〈 🏳️‍⚧️ ᴄᴄᴊᴛ 🏳️‍⚧️ ⌨ 〉⋱ ♫♪♩⌬꧂",
                        "id": "colorsteal"
                    }, "Reset your color successfully.")
                    receive({
                        "color": MPP.client.getOwnParticipant().color,
                        "_id": "colors",
                        "name": localStorage.resetname,
                        "id": "colorsteal"
                    }, "< If this isn't your color, your userquota ran out. You can try resetting yourself after 12 minutes in that case.")
                } else if (args[1] == "name") {
                    MPP.client.sendArray([{
                        m: 'userset',
                        set: {
                            name: localStorage.resetname
                        }
                    }]);
                    receive({
                        "color": "#6dee49", // pastel green
                        "_id": "colors",
                        "name": "Reset - ꧁⌬♩♪♫ ⋰〈 🏳️‍⚧️ ᴄᴄᴊᴛ 🏳️‍⚧️ ⌨ 〉⋱ ♫♪♩⌬꧂",
                        "id": "colorsteal"
                    }, "Reset your name successfully.")
                    receive({
                        "color": MPP.client.getOwnParticipant().color,
                        "_id": "colors",
                        "name": MPP.client.getOwnParticipant().name,
                        "id": "colorsteal"
                    }, "< If this isn't your username, your userquota ran out. You can try resetting yourself after 12 minutes in that case.")
                }
            }
        }
        if (cmd == "mycolor") {
            send("Your user color is " + m.p.color.toUpperCase() + " - *" + colorname(m.p.color) + "*")
        }
        if (cmd == "settings") {
            send(`Room settings - Room name: ${MPP.client.channel._id} - Limit: ${MPP.client.channel.settings.limit} - Inner color: ${MPP.client.channel.settings.color} - Outer color: ${MPP.client.channel.settings.color2} - Visible: ${MPP.client.channel.settings.visible} - Crown holder: ${MPP.client.channel.crown.userId}`)
        }
        if (cmd == "define") {
            if (args.length == 1) {
                send("Please insert a category to define. Categories: reset, help - or get a variable with \"get\"")
            } else {
                if (args[1] == "reset") {
                    if (args.length == 2) {
                        send("Please insert a variable to define. Variables: name, color - or reset to defaults with \"default\"")
                    } else {
                        if (args[2] == "name") {
                            localStorage.setItem("resetname", m.a.substring(17).trim())
                            send("Your reset name is now " + localStorage.resetname + ".")
                        } else if (args[2] == "color") {
                            if (args[3].length == 7) {
                                localStorage.setItem("resetcolor", m.a.substring(18).trim())
                                send("Your reset color is now " + localStorage.resetcolor + ".")
                            } else if (args[3].length == 6) {
                                localStorage.setItem("resetcolor", "#" + m.a.substring(18).trim())
                                send("Your reset color is now " + localStorage.resetcolor + ".")
                            } else {
                                send("That is not a valid hex color. Please specify a 6 digit* hex color. (*`#` symbol is optional)")
                            }
                        } else if (args[2] == "default") {
                            localStorage.setItem("resetname", 'Anonymous')
                            send("Your reset name is now Anonymous.")
                            localStorage.setItem("resetcolor", randomhex)
                            send("Your reset color is now " + localStorage.resetcolor + ".")
                        }
                    }
                } else if (args[1] == "help") {
                    if (args.length == 2) {
                        send("Please insert a value to define to. Values: off, on")
                    } else {
                        if (args[2] == "off") {
                            localStorage.setItem("help", false)
                            send("Help command is off.")
                        } else if (args[2] == "on") {
                            localStorage.setItem("help", true)
                            send("Help command is on.")
                        }
                    }
                } else if (args[1] == "public") {
                    if (args.length == 2) {
                        send("Please insert a value to define to. Values: true, false, toggle - `Note: This variable is reset to false everytime you refresh for security measures. There will be a way to bypass this soon.`")
                    } else {
                        if (args[2] == "false") {
                            public = false
                            send("Commands are now private.")
                        } else if (args[2] == "true") {
                            public = true
                            send("Commands are now public.")
                        } else if (args[2] == "toggle") {
                            public = !public
                            send(public ? "Commands are now public." : "Commands are now private.")
                        }
                    }
                } else if (args[1] == 'get') {
                    if (args.length == 2) {
                        send("Please insert a variable. Variables: resetname, resetcolor")
                    } else if (args[2] == "resetname") {
                        send("Your reset name is " + localStorage.resetname)
                    } else if (args[2] == "resetcolor") {
                        send('Your reset color is ' + localStorage.resetcolor)
                    }
                }
            }
        }
        if (cmd == "mention") {
            if (args.length == 1) {
                send("Please specify the ID or name of the user to mention.")
            } else {
                send("@" + searchId(args[1]))
            }
        }
        if (cmd == "refresh") {
            send("Refreshing...")
            location.replace(location.href)
        }
        if (cmd == "about") {
            if (args.length == 1) {
                send(`${atob('Qm90IG1hZGUgdXNpbmcgcHVyZSBKYXZhU2NyaXB0IGFuZCBhIGxpdHRsZSBiaXQgb2YgY29kZSB0aGVmdA==')} - ${atob('eW91IGNhbiBmaW5kIHRoaXMgYm90IGF0')} ${atob('aHR0cHM6Ly9ncmVhc3lmb3JrLm9yZy9lbi9zY3JpcHRzLzUzMzE3MC1jb2xvcnN0ZWFs')} - ${atob('cmF3IHNvdXJjZSBjb2RlOiBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vY2NqaXQvY29sb3JzdGVhbC9yZWZzL2hlYWRzL21haW4vY29sb3JzdGVhbC5qcw==')} - ${atob('bWFkZSBieSBjY2p0IGluIDIwMjQtMjAyNQ==')} - Running version ${version}`)
            } else {
                if (args[1] == "me") {
                    send("Your info - Name: " + MPP.client.ppl[MPP.client.getOwnParticipant()._id].name + " - Color: " + MPP.client.ppl[MPP.client.getOwnParticipant()._id].color + " - *" + colorname(MPP.client.ppl[MPP.client.getOwnParticipant()._id].color) + "* - ID: " + MPP.client.getOwnParticipant()._id + " - Mouse Position: X" + MPP.client.ppl[MPP.client.getOwnParticipant()._id].x + ", Y" + MPP.client.ppl[MPP.client.getOwnParticipant()._id].y + " - AFK: " + MPP.client.ppl[MPP.client.getOwnParticipant()._id].afk + " ||You can use \"steal " + args[1] + "\" to steal their color!||")
                } else {
                    if (MPP.client.ppl[searchId(args[1])].name.substring(MPP.client.ppl[searchId(args[1])].name.length - 1, MPP.client.ppl[searchId(args[1])].name.length).trim() == "s") {
                        if ('tag' in MPP.client.ppl[searchId(args[1])]) {
                        send(MPP.client.ppl[searchId(args[1])].name + "' info - Name: " + MPP.client.ppl[searchId(args[1])].name + " - Color: " + MPP.client.ppl[searchId(args[1])].color + " - *" + colorname(MPP.client.ppl[searchId(args[1])].color) + "* - ID: " + searchId(args[1]) + " - Mouse Position: X" + MPP.client.ppl[searchId(args[1])].x + ", Y" + MPP.client.ppl[searchId(args[1])].y + " - AFK: " + MPP.client.ppl[searchId(args[1])].afk + " ||You can use \"steal " + args[1] + "\" to steal their color!||")
                        } else {
                        send(MPP.client.ppl[searchId(args[1])].name + "' info - Name: " + MPP.client.ppl[searchId(args[1])].name + " - Color: " + MPP.client.ppl[searchId(args[1])].color + " - *" + colorname(MPP.client.ppl[searchId(args[1])].color) + "* - ID: " + searchId(args[1]) + " - Mouse Position: X" + MPP.client.ppl[searchId(args[1])].x + ", Y" + MPP.client.ppl[searchId(args[1])].y + " - AFK: " + MPP.client.ppl[searchId(args[1])].afk + " ||You can use \"steal " + args[1] + "\" to steal their color!||")
                        }
                    } else {
                        if ('tag' in MPP.client.ppl[searchId(args[1])]) {
                            send(MPP.client.ppl[searchId(args[1])].name + "'s info - Name: " + MPP.client.ppl[searchId(args[1])].name + " - Color: " + MPP.client.ppl[searchId(args[1])].color + " - *" + colorname(MPP.client.ppl[searchId(args[1])].color) + "* - ID: " + searchId(args[1]) + " - Mouse Position: X" + MPP.client.ppl[searchId(args[1])].x + ", Y" + MPP.client.ppl[searchId(args[1])].y + " - AFK: " + MPP.client.ppl[searchId(args[1])].afk + " - Tag: " + MPP.client.ppl[searchId(args[1])].tag.text + " - Tag color: " + MPP.client.ppl[searchId(args[1])].tag.color + "||You can use \"steal " + args[1] + "\" to steal their color!||")
                        } else {
                            send(MPP.client.ppl[searchId(args[1])].name + "'s info - Name: " + MPP.client.ppl[searchId(args[1])].name + " - Color: " + MPP.client.ppl[searchId(args[1])].color + " - *" + colorname(MPP.client.ppl[searchId(args[1])].color) + "* - ID: " + searchId(args[1]) + " - Mouse Position: X" + MPP.client.ppl[searchId(args[1])].x + ", Y" + MPP.client.ppl[searchId(args[1])].y + " - AFK: " + MPP.client.ppl[searchId(args[1])].afk + " ||You can use \"steal " + args[1] + "\" to steal their color!||")
                        }
                    }
                }
            }
        }
        if (cmd == "playalone") {
            MPP.client.setChannel(randroom)
            window.history.replaceState(null, "", location.href.split('/?c=')[0] + "/?c=" + randroom)
            MPP.client.sendArray([{
                'm': "chset",
                "set": {
                    "visible": false,
                    "color":"#220022",
                    "color2":"#000022"
                }
            }]);
            send("**Playing alone**")
            send("────────────────")
            send("You are playing alone in a room by yourself, but you can always invite friends by sending them the link. " + location.href)
        }
        if (cmd == "goto") {
            if (args.length == 1) {
                send("Please specify a room to go to.")
            } else {
                MPP.client.setChannel(m.a.substring(4).trim())
                window.history.replaceState(null, "", location.href.split('/?c=')[0] + "/?c=" + m.a.substring(4).trim())
            }
        }
        if (cmd == "whereami") {
            send("You're in the room \"" + MPP.client.channel._id + "\".")
        }
        if (cmd == "name") {
            MPP.client.sendArray([{
                m: 'userset',
                set: {
                    name: m.a.substring(4).trim()
                }
            }]);
            send("​Name set to \"" + m.a.substring(4).trim() + "\".")
            localStorage.setItem('names', localStorage.names + "," + m.a.substring(4).trim())
        }
        if (cmd == "color") {
            if (args[1].length == 6) {
                MPP.client.sendArray([{
                    m: 'userset',
                    set: {
                        color: "#" + args[1]
                    }
                }]);
                send("​Color set to #" + args[1] + ". - *" + colorname("#" + args[1]) + "*")
            } else if (args[1].length == 7) {
                MPP.client.sendArray([{
                    m: 'userset',
                    set: {
                        color: args[1]
                    }
                }]);
                send("​Color set to " + args[1] + ". - *" + colorname(args[1]) + "*")
            } else if (args[1].length > 7) {
                send(MPP.client.ppl[searchId(args[1])].name + "'s color: " + MPP.client.ppl[searchId(args[1])].color + " - *" + colorname(MPP.client.ppl[searchId(args[1])].color) + "*")
            }
        }
    }
});
setInterval(checkVersion(), 60000)