// ==UserScript==
// @name         kirin's Mod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  kirin i made this mod for you cause your my fam!!!
// @author       Кіґіη҂
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381394/kirin%27s%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/381394/kirin%27s%20Mod.meta.js
// ==/UserScript==
// Ad Remover

window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function keyDown() {
  var e = window.event;
  switch (e.keyCode) {
    case 188:
      runOn();
      break;
    case 190:
      runOff();
      break;
    case 187:
      spamOn();
      break;
    case 189:
      spamOff();
      break;
    case 192:
      leaderboard();leaderboard2();
      break;
  }
}

// ads element remove
document.querySelectorAll('.ad-unit').forEach(function(a){
a.remove();
});

// div style
var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#D35400";
  Style1[i].style.border = "2px solid #D35400";
}

// input and select style
var Style2 = document.querySelectorAll('select, input');
for (var i = 0; i < Style2.length; i++) {
  Style2[i].style.borderRadius = '1em'; // standard
  Style2[i].style.MozBorderRadius = '1em'; // Mozilla
  Style2[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style2[i].style.color = "#D35400";
  Style2[i].style.border = "2px solid #D35400";
  Style2[i].style.backgroundColor = "#000000";
}

let id = setInterval(function() {
        if(Game.currentGame.world.inWorld) {
                clearInterval(id)
                setTimeout(function() {
eval(`window.Ultimate = {}
const Ultimate = window.Ultimate

const _ = (element) => {
    return document.getElementsByClassName(element)
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value))
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key)
    return value && JSON.parse(value)
}

function removeElement(array, element) {
    for(let i = 0; i < array.length - 1; i++){
        if (array[i] === element) {
            array.splice(i, 1)
        }
    }
}

let theme = document.createElement("link")
theme.href = "https://cdn.jsdelivr.net/gh/codemirror/CodeMirror/theme/railscasts.css"
theme.rel = "stylesheet"
document.body.appendChild(theme)

let link = document.createElement("link")
link.href = "https://cdn.jsdelivr.net/codemirror/3.21.0/codemirror.css"
link.rel = "stylesheet"
document.body.appendChild(link)

let script = document.createElement("script")
script.src = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.25.2/codemirror.js"
document.body.appendChild(script)

setTimeout(function() {
    let javascript = document.createElement("script")
    javascript.src = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.7.0/mode/javascript/javascript.js"
    document.body.appendChild(javascript)
}, 2000)

Ultimate.SHOW = {}
Ultimate.SHOW.OVERLAY = Game.currentGame.ui.getComponent("PopupOverlay")
Ultimate.SHOW.HINT = function(message, time, image) {
    Ultimate.SHOW.OVERLAY.showHint(message, time, image)
}
Ultimate.SHOW.CONFIRMATION = function(message, time, onAccept, onDenied) {
    Ultimate.SHOW.OVERLAY.showConfirmation(message, time, onAccept, onDenied)
}

Ultimate.MENU = document.createElement("div")
Ultimate.MENU.innerHTML = \`<div class="ultimate-menu-grid"></div>\`
Ultimate.MENU.classList.add("ultimate-menu")
document.body.appendChild(Ultimate.MENU)
Ultimate.MENU.style.display = "none"

Ultimate.MENU.SHOWORHIDE = () => {
    if (Ultimate.MENU.style.display === "block") {
        Ultimate.MENU.style.display = "none"
    } else {
        Ultimate.MENU.style.display = "block"
    }
}
Ultimate.MENU.SHOW = () => {
    Ultimate.MENU.style.display = "block"
}
Ultimate.MENU.HIDE = () => {
    Ultimate.MENU.style.display = "none"
}

window.addEventListener("mouseup", (e) => {
    let menu = Ultimate.MENU
    for (let i = 0; i < e.target.childNodes.length; i++) {
        if (e.target != menu && e.target.parentNode != menu) {
            menu.HIDE()
        }
    }
})

Ultimate.MENU.OBSERVER = new MutationObserver(function(mutations) {
    mutations.forEach(function(MutationRecord) {
        if (mutations[0].target.style.display === "block") {
            Ultimate.MENU.HIDE()
        }
    })
})

Ultimate.MENU.OBSERVER.observe(_("hud-menu-shop")[0], {
    attributes: true
})
Ultimate.MENU.OBSERVER.observe(_("hud-menu-party")[0], {
    attributes: true
})
Ultimate.MENU.OBSERVER.observe(_("hud-menu-settings")[0], {
    attributes: true
})
Ultimate.MENU.OBSERVER.observe(_("hud-respawn")[0], {
    attributes: true
})
Ultimate.MENU.OBSERVER.observe(_("hud-reconnect")[0], {
    attributes: true
})
for (let i = 0; i < _("hud-menu-profile").length; i++) {
    Ultimate.MENU.OBSERVER.observe(_("hud-menu-profile")[i], {
        attributes: true
    })
}

_("ultimate-menu-grid")[0].innerHTML = \`<div class="bots"></div><button class="btn btn-green add-bot">Add bot</button>\`

let style = document.createElement("style")
style.innerHTML = \`.ultimate-button {
    outline: none;
    border: none;
    display: block;
    position: relative;
    width: 200px;
    height: 56px;
    margin: 0 0 1px;
    background: rgba(0, 0, 0, 0.2);
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    transition: all 0.15s ease-in-out;
    border-radius: 0 0 4px 4px;
    font-size: 20px;
}

.ultimate-button:hover, .ultimate-button:active {
    color: #fff;
}

.ultimate-menu {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 600px;
    height: 420px;
    margin: -270px 0 0 -300px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.6);
    color: #eee;
    border-radius: 4px;
    z-index: 15;
    overflow-y: auto;
}

.ultimate-menu-grid {
    position: relative;
    height: 340px;
    margin: 20px 0 0;
    padding: 10px;
    background: rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    border-radius: 3px;
}

.hud .hud-top-center {
    top: 0;
}

.hud-menu-shop {
    width: 600px;
    height: 420px;
    margin: -270px 0 0 -300px;
    padding: 20px;
}

.hud-menu-shop .hud-shop-grid {
    height: 310px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    margin-top: -5px;
    margin-bottom: 5px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked + .slider {
    background-color: #2196F3;
}

input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

.ultimate-menu-addbot {
    top: 55%;
    left: 55%;
    height: 300px;
    width: 500px;
}

.ultimate-menu-textarea {
    display: block;
    width: 463px;
    height: 300px;
    line-height: 24px;
    padding: 8px 14px;
    background: #eee;
    border: 0;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    resize: none;
}

.add-bot-2 {
    margin-top: 10px;
}

.cm-s-railscasts .CodeMirror-linenumber {
    left: -20px !important;
}

.delete-bot {
    margin-top: 10px;
    margin-left: 10px;
    display: inline-block;
}

.delete-bot:hover {
    color: #ff4d57;
}

.edit-bot {
    margin-left: 10px;
    display: inline-block;
}

.edit-bot:hover {
    color: #50a6ff;
}\`
document.body.appendChild(style)

const topCenter = _("hud-top-center")[0]
let buttonHTML = \`<button class='ultimate-button'>
    Ultimate mod
</button>\`
topCenter.innerHTML += buttonHTML

_("ultimate-button")[0].addEventListener("click", () => {
    Ultimate.MENU.SHOWORHIDE()
})

Ultimate.bots = {}

Ultimate.bots.botsCSS = document.createElement("style")
Ultimate.bots.botsCSS.innerHTML =
    ".bot { line-height: 1.3; margin-left: 1ch; } .botTagRegular { background: #7289da; color: #fff; } .botTag { -ms-flex-negative: 0; border-radius: 3px; flex-shrink: 0; font-size: .625em; font-weight: 500; line-height: 1.3; padding: 1px 2px; text-transform: uppercase; vertical-align: middle; } .hud-chat .hud-chat-message { white-space: normal; } .hud-menu-profile { position: fixed; top: 50%; left: 50%; width: 600px; height: 420px; margin: -270px 0 0 -300px; padding: 20px; background: rgba(0, 0, 0, 0.6); color: #eee; border-radius: 4px; z-index: 15; overflow-y: auto; } .hud-profile-grid { display: block; position: relative; height: 340px; margin: 20px 0 0; padding: 10px; background: rgba(0, 0, 0, 0.2); overflow-y: auto; border-radius: 3px; } .hud-profile-pic { margin-left: auto; margin-right: auto; width: 20%; } .hud-profile-name { margin-left: auto; margin-right: auto; width: 13%; }"
document.body.appendChild(Ultimate.bots.botsCSS)

var Bot = function(name, prefix, profile) {
    if (!name || !prefix || !profile) {
        throw new TypeError("Name, prefix or profile info wasn't gave")
        return
    }

    Ultimate.bots[name] = {}
    Ultimate.bots[name].botName = name
    Ultimate.bots[name].botPrefix = prefix
    Ultimate.bots[name].chatBotName = '<strong>' + Ultimate.bots[name].botName + '</strong><small> (' + Ultimate.bots[name].botPrefix + ')</small><span class="botTagRegular botTag bot">BOT</span>'

    Ultimate.bots[name].sendMessage = function(message) {
        Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: this.chatBotName,
            message: message
        })

        var messages = document.getElementsByClassName("hud-chat-message")
        Ultimate.bots[name].messagesLength = messages.length

        var length = messages.length - 1
        messages[length].innerHTML = messages[length].innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    }

    Ultimate.bots[name].onInWorld = function(doSomething) {
        var id = setInterval(function() {
            if (Game.currentGame.world.inWorld) {
                clearInterval(id)
                doSomething()
            }
        })
    }

    Ultimate.bots[name].sendMessage("Loading bot...")

    Ultimate.bots[name].messagesFound = []
    Ultimate.bots[name].findMessage = function(message) {
        for (var i = 0; i < document.getElementsByClassName("hud-chat-message").length; i++) {
            if (document.getElementsByClassName("hud-chat-message")[i].childNodes[1].textContent.indexOf(": " + message) >= 0) {
                Ultimate.bots[name].messagesFound.push(document.getElementsByClassName("hud-chat-message")[i])
            }
        }
        return Ultimate.bots[name].messagesFound
    }

    Ultimate.bots[name].messagesByAuthorFound = []
    Ultimate.bots[name].findMessageByAuthor = function(author) {
        for (var i = 0; i < document.getElementsByClassName("hud-chat-message").length; i++) {
            if (document.getElementsByClassName("hud-chat-message")[i].childNodes[0].textContent.indexOf(author) >= 0) {
                Ultimate.bots[name].messagesByAuthorFound.push(document.getElementsByClassName("hud-chat-message")[i])
            }
        }
        return Ultimate.bots[name].messagesByAuthorFound
    }

    Ultimate.bots[name].getLatest = function(element) {
        return document.getElementsByClassName(element)[document.getElementsByClassName(element).length - 1]
    }

    Ultimate.bots[name].getAfterCommand = function(command) {
        var a = document.getElementsByClassName("hud-chat-input")[0].value.toLowerCase().substring(0, Ultimate.bots[name].botPrefix.length + command.length)
        a = document.getElementsByClassName("hud-chat-input")[0].value.toLowerCase().replace(a, "")
        a = a.trim()
        return a
    }

    Ultimate.bots[name].getAfterMessage = function(message, afterWhat) {
        var a = message.childNodes[1].textContent.toLowerCase().substring(0, afterWhat.length + 2)
        a = message.childNodes[1].textContent.toLowerCase().replace(a, "")
        a = a.trim()
        return a
    }

    Ultimate.bots[name].clearChatInput = function() {
        document.getElementsByClassName("hud-chat-input")[0].value = ""
    }

    Ultimate.bots[name].onCommand = function(command, doSomething) {
        document.getElementsByClassName("hud-chat-input")[0].addEventListener("input", function() {
            if (document.getElementsByClassName("hud-chat-input")[0].value === Ultimate.bots[name].botPrefix + command) {
                document.addEventListener("keydown", function waitForEnterKey(e) {
                    switch (e.which) {
                        case 13:
                            doSomething()
                            setTimeout(function() {
                                document.removeEventListener("keydown", waitForEnterKey)
                            }, 250)
                    }
                })
            }
        })
    }

    Ultimate.bots[name].removeCommand = function(command) {
        document.getElementsByClassName("hud-chat-input")[0].removeEventListener("input", command)
    }

    Ultimate.bots[name].onMessageSent = function(doSomething) {
        var length = document.getElementsByClassName("hud-chat-message").length
        setInterval(function() {
            if (length < document.getElementsByClassName("hud-chat-message").length) {
                length = document.getElementsByClassName("hud-chat-message").length
                doSomething()
            }
        }, 250)
    }

    Ultimate.bots[name].onSomeoneSentMessage = function(message, doSomething) {
        var length = document.getElementsByClassName("hud-chat-message").length
        setInterval(function() {
            if (length < document.getElementsByClassName("hud-chat-message").length) {
                length = document.getElementsByClassName("hud-chat-message").length
                if (document.getElementsByClassName("hud-chat-message")[document.getElementsByClassName("hud-chat-message").length - 1].childNodes[1].textContent.indexOf(message) >= 0) {
                    doSomething()
                }
            }
        }, 250)
    }

    Ultimate.bots[name].changeChatBotName = function(name) {
        if (name) {
            Ultimate.bots[name].chatBotName
        } else {
            throw new Error("Please give a chat name for the bot!")
        }
    }

    Ultimate.bots[name].profile = {}
    Ultimate.bots[name].profile.profilePic = profile.profilePic
    Ultimate.bots[name].profileName = profile.profileName
    Ultimate.bots[name].profileInfo = profile.profileInfo

    Ultimate.bots[name].botProfileMenu = document.createElement("div")
    Ultimate.bots[name].botProfileMenu.classList.add("hud-menu")
    Ultimate.bots[name].botProfileMenu.classList.add("hud-menu-profile")
    Ultimate.bots[name].botProfileMenu.setAttribute("id", "hud-menu-profile")
    document.body.appendChild(Ultimate.bots[name].botProfileMenu)
    var lastMenu = document.getElementsByClassName("hud-menu hud-menu-profile")[document.getElementsByClassName("hud-menu hud-menu-profile").length - 1]
    lastMenu.style.display = "none"

    Ultimate.bots[name].botProfileMenu.innerHTML = '<a class="hud-menu-close"></a><img class="hud-profile-pic" src="' + Ultimate.bots[name].profile.profilePic + '"><h3 class="hud-profile-name">' + Ultimate.bots[name].profileName + '</h3><div class="hud-profile-grid">' + Ultimate.bots[name].profileInfo + '</div>'

    Ultimate.bots[name].botProfileMenu.showOrHide = function() {
        if (lastMenu.style.display === "block") {
            lastMenu.style.display = "none"
        } else {
            lastMenu.style.display = "block"
        }
    }

    var lastClose = document.getElementsByClassName("hud-menu-close")[document.getElementsByClassName("hud-menu-close").length - 1]
    lastClose.addEventListener("click", Ultimate.bots[name].botProfileMenu.showOrHide)
    window.addEventListener("mouseup", function(e) {
        var menu = document.getElementsByClassName("hud-menu hud-menu-profile")[0]
        for (var i = 0; i < e.target.childNodes.length; i++) {
            if (e.target != menu && e.target.parentNode != menu) {
                menu.style.display = "none"
            }
        }
    })

    var lastPic = document.querySelectorAll(".hud-profile-pic")[document.querySelectorAll(".hud-profile-pic").length - 1]
    Ultimate.bots[name].onMessageSent(function() {
        for (var i = 0; i < document.getElementsByClassName("hud-chat-message").length; i++) {
            if (document.getElementsByClassName("hud-chat-message")[i].childNodes[0].innerHTML == Ultimate.bots[name].chatBotName) {
                document.getElementsByClassName("hud-chat-message")[i].addEventListener("click", Ultimate.bots[name].botProfileMenu.showOrHide)
                lastPic.style.display = "block"
            }
        }
    })

    Ultimate.bots[name].botProfileMenu.observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(MutationRecord) {
            if (mutations[0].target.style.display === "block") {
                lastMenu.style.display = "none"
            }
        })
    })

    Ultimate.bots[name].botProfileMenu.observer.observe(document.getElementsByClassName("hud-menu-shop")[0], {
        attributes: true
    })
    Ultimate.bots[name].botProfileMenu.observer.observe(document.getElementsByClassName("hud-menu-party")[0], {
        attributes: true
    })
    Ultimate.bots[name].botProfileMenu.observer.observe(document.getElementsByClassName("hud-menu-settings")[0], {
        attributes: true
    })
    Ultimate.bots[name].botProfileMenu.observer.observe(document.getElementsByClassName("hud-respawn")[0], {
        attributes: true
    })
    Ultimate.bots[name].botProfileMenu.observer.observe(document.getElementsByClassName("hud-reconnect")[0], {
        attributes: true
    })
    Ultimate.bots[name].botProfileMenu.observer.observe(document.getElementsByClassName("ultimate-menu")[0], {
        attributes: true
    })
    for (var i = 0; i < document.getElementsByClassName("hud-menu-profile").length; i++) {
        if (document.getElementsByClassName("hud-menu-profile")[i] !== lastMenu) {
            Ultimate.bots[name].botProfileMenu.observer.observe(document.getElementsByClassName("hud-menu-profile")[i], {
                attributes: true
            })
        }
    }
    return Ultimate.bots[name]
}

Ultimate.bots.require = function(bot) {
    if (typeof Ultimate.bots[bot] == "object") {
        return true
    } else {
        Game.currentGame.ui.getComponent("Chat").onMessageReceived({
            displayName: "[CONSOLE]",
            message: "This bot may not work correctly, it requires " + bot + " to work."
        })
    }
}

let s = _("checkbox")

function check(i) {
    if (s[i].checked) {
        if(typeof Ultimate.bots[Object.keys(Ultimate.bots)[i + 2]].enable == "function") {
            Ultimate.bots[Object.keys(Ultimate.bots)[i + 2]].enable()
        } else {
            Game.currentGame.ui.getComponent("Chat").onMessageReceived({
                displayName: "[CONSOLE]",
                message: "This bot doesn't seem to have enable function or can't be enabled."
            })
        }
    } else {
        if(typeof Ultimate.bots[Object.keys(Ultimate.bots)[i + 2]].disable == "function") {
            Ultimate.bots[Object.keys(Ultimate.bots)[i + 2]].disable()
        } else {
            Game.currentGame.ui.getComponent("Chat").onMessageReceived({
                displayName: "[CONSOLE]",
                message: "This bot doesn't seem to have disable function or can't be disabled."
            })
        }
    }
}

if(localStorage["bots"]) {
    const storedBots = localStorage.getObject("bots")
    for(let i = 1; i < storedBots.length; i = i + 2) {
        eval(storedBots[i])
    }
    for(let i = 0; i < storedBots.length; i = i + 2) {
        _("bots")[0].innerHTML += \`<h3 class="botname" style="display: inline-block; margin-right: 10px; margin-top: 10px;" title="\` + storedBots[i].botName + \`">\` + storedBots[i].chatBotName + \` – </h3><label class="switch">
            <input type="checkbox" class="checkbox" title="Enable/disable">
            <span class="slider round"></span>
        </label><p title="Delete bot" class="delete-bot">&#10006;</p><p title="Edit bot" class="edit-bot">✎</p><br class="separation"/>\`
        for(let o = 0; o < s.length; o++) {
            s[o].addEventListener("change", function() {
                check(o)
            })
        }
    }
}

_("btn btn-green add-bot")[0].addEventListener("click", () => {
    Ultimate.MENU.SHOW()
    let menu = document.createElement("div")
    menu.innerHTML = \`<textarea class="ultimate-menu-textarea"></textarea><button class="btn btn-green add-bot-2">Add bot</button>\`
    menu.classList.add("ultimate-menu")
    menu.classList.add("ultimate-menu-addbot")
    document.body.appendChild(menu)

    let editor = CodeMirror.fromTextArea(_("ultimate-menu-textarea")[_("ultimate-menu-textarea").length - 1], {
        mode: "text/javascript",
        theme: "railscasts",
        lineNumbers: true,
        lineWrapping: true
    })
    editor.getDoc().setValue(\`const myBot = new Bot("botName", "botPrefix", {
    profileName: "myBotName",
    profilePic: "myProfilePic",
    profileInfo: "Hello, here's my profile info!"
})\`)

    new MutationObserver(function(mutations) {
        mutations.forEach(function(MutationRecord) {
            if (mutations[0].target.style.display === "none") {
                menu.style.display = "none"
            }
        })
    }).observe(Ultimate.MENU, {
        attributes: true
    })

    window.addEventListener("mouseup", (e) => {
        for (let i = 0; i < e.target.childNodes.length; i++) {
            if (e.target != Ultimate.MENU && e.target.parentNode != Ultimate.MENU) {
                menu.style.display = "none"
            }
        }
    })

    for(let i = 0; i < _("ultimate-menu-addbot")[_("ultimate-menu-addbot").length - 1].childNodes.length; i++) {
         _("ultimate-menu-addbot")[_("ultimate-menu-addbot").length - 1].childNodes[i].addEventListener("click", function() {
            menu.style.display = "block"
            Ultimate.MENU.SHOW()
         })
    }

    let add = function() {
        Ultimate.MENU.SHOW()
        const value = editor.getValue()
        if (value.indexOf("new Bot") >= 0) {
            eval(value)
            const botname = value.split('"')[1]
            const bots = Ultimate.bots
            for (let i in bots) {
                if (bots[i].botName == botname) {
                    let bot = bots[i]
                    if(!localStorage["bots"]) {
                        localStorage.setObject("bots", [
                            bot,
                            value
                        ])
                    } else {
                        let bots = JSON.parse(localStorage.bots)
                        bots.push(bot)
                        bots.push(value)
                        localStorage.bots = JSON.stringify(bots)
                    }
                    let storedBots = bots
                    _("bots")[0].innerHTML += \`<h3 class="botname" style="display: inline-block; margin-right: 10px; margin-top: 10px;" title="\` + storedBots[i].botName + \`">\` + storedBots[i].chatBotName + \` – </h3><label class="switch">
                        <input type="checkbox" class="checkbox" title="Enable/disable">
                        <span class="slider round"></span>
                    </label><p title="Delete bot" class="delete-bot">&#10006;</p><p title="Edit bot" class="edit-bot">✎</p><br class="separation"/>\`
                    for(let i = 0; i < _("edit-bot").length; i++) {
                        _("edit-bot")[i].addEventListener("click", function() {
                            editBot(i)
                        })
                    }
                    let deleteBtn = _("delete-bot")
                    for(let f = 0; f < deleteBtn.length; f++) {
                        deleteBtn[f].removeEventListener("click", window.deBot)
                    }
                    for(let f = 0; f < deleteBtn.length; f++) {
                        deleteBtn[f].addEventListener("click", window.deBot = function() {
                            delBot(f)
                        })
                    }
                }
            }
            menu.style.display = "none"
            s[s.length - 1].addEventListener("change", function() {
                check(s.length - 1)
            })
        } else {
            Game.currentGame.ui.getComponent("Chat").onMessageReceived({
                displayName: "[CONSOLE]",
                message: "It doesn't look like a bot, I can't accept that."
            })
        }
    }
    for(let i = 0; i < _("add-bot-2").length; i++) {
        _("add-bot-2")[i].addEventListener("click", add)
    }
})
function deleteBot(i) {
    Ultimate.MENU.SHOW()
    let bot = Object.keys(Ultimate.bots)[i + 2]
    delete bot
    let bots = JSON.parse(localStorage.bots)
    removeElement(bots, bots[i])
    removeElement(bots, bots[i])
    localStorage.bots = JSON.stringify(bots)
    if(_("botname")[i]) _("botname")[i].remove()
    if(_("switch")[i]) _("switch")[i].remove()
    if(_("delete-bot")[i]) _("delete-bot")[i].remove()
    if(_("edit-bot")[i]) _("edit-bot")[i].remove()
    if(_("separation")[i]) _("separation")[i].remove()
}

function delBot(i) {
    let deleteBtn = _("delete-bot")
    let name = deleteBtn[i].parentNode.childNodes[0].innerHTML
    name = name.slice(0, name.length - 2)
    name = name.trim()
    const bots = localStorage.getObject("bots")
    for(let o = 0; o < bots.length; o++) {
        if(bots[o].chatBotName) {
            if(bots[o].chatBotName == name) {
                deleteBot(o)
            }
        }
    }
    let length = _("edit-bot").length
    for(let f = 0; f < _("edit-bot").length; f++) {
        _("edit-bot")[f].removeEventListener("click", window.edBot)
    }
    for(let i = 0; i < _("edit-bot").length; i++) {
        _("edit-bot")[i].addEventListener("click", window.edBot = function() {
            editBot(i)
        })
    }
    Ultimate.SHOW.HINT("Sometimes, after have deleted a bot, you can't edit another. Sorry!")
}

if(_("delete-bot").length) {
    let deleteBtn = _("delete-bot")
    for(let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener("click", window.deBot = function() {
            delBot(i)
        })
    }
}

function editBot(i) {
    Ultimate.MENU.SHOW()
    let menu = document.createElement("div")
    menu.innerHTML = \`<textarea class="ultimate-menu-textarea"></textarea><button style="margin-top: 10px;" class="btn btn-green save-bot">Save bot</button>\`
    menu.classList.add("ultimate-menu")
    menu.classList.add("ultimate-menu-addbot")
    document.body.appendChild(menu)

    let editor = CodeMirror.fromTextArea(_("ultimate-menu-textarea")[_("ultimate-menu-textarea").length - 1], {
        mode: "text/javascript",
        theme: "railscasts",
        lineNumbers: true,
        lineWrapping: true
    })
    if(i == 0) {
        editor.getDoc().setValue(localStorage.getObject("bots")[1])
    } else {
        editor.getDoc().setValue(localStorage.getObject("bots")[i * 2 + 1])
    }

    new MutationObserver(function(mutations) {
        mutations.forEach(function(MutationRecord) {
            if (mutations[0].target.style.display === "none") {
                menu.style.display = "none"
            }
        })
    }).observe(Ultimate.MENU, {
        attributes: true
    })

    menu.childNodes.forEach(function(e) {
        e.addEventListener("click", function() {
            menu.style.display = "block"
            Ultimate.MENU.SHOW()
        })
    })

    window.addEventListener("mouseup", (e) => {
        for (let i = 0; i < e.target.childNodes.length; i++) {
            if (e.target != menu && e.target.parentNode != menu) {
                menu.style.display = "none"
            }
        }
    })

    _("save-bot")[_("save-bot").length - 1].addEventListener("click", function() {
        eval(editor.getValue())
        let bots = localStorage.getObject("bots")
        bots[i * 2] = Ultimate.bots[Object.keys(Ultimate.bots)[i + 2]]
        localStorage.bots = JSON.stringify(bots)

        bots[i * 2 + 1] = editor.getValue()
        localStorage.bots = JSON.stringify(bots)
        menu.style.display = "none"
        Ultimate.SHOW.HINT("You may have to reload your page to save changes.")
    })
}

for(let i = 0; i < _("edit-bot").length; i++) {
    _("edit-bot")[i].addEventListener("click", window.edBot = function() {
        editBot(i)
    })
}`)
                }, 1000)
        }
}, 100)

var IntroGuide = '';
IntroGuide += "<center><h3>Zombs.io script border color</h3>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" id=\"button1\">CHANGE BORDER COLOR</button>";
IntroGuide += "<center><h3>Do you like San's Mod</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"Yes!();\">Yes!</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-red\" style=\"width: 45%;\" onclick=\"No!();\">No!</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Zombs.io Server</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592411';\">Europe 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592406';\">Australia 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8618006';\">East 1 (sometimes work)</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8617896';\">West 1 (sometimes work)</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564836';\">Barrier Server</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Name Short Cut</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Кіґіη҂';\">NØR×SanHNT</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Кіґіη҂';\">℣ | San</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Кіґіη҂';\">ℑᛕ | Sanᕼ</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Symbols</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '[✧]';\">[✧]</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '✘';\">✘</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'ツ';\">ツ</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '(▀̿Ĺ̯▀̿ ̿)';\">(▀̿Ĺ̯▀̿ ̿)</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '( ͡° ͜ʖ ͡°)';\">( ͡° ͜ʖ ͡°)</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'ʕ•ᴥ•ʔ';\">ʕ•ᴥ•ʔ</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Long Names!</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'San,San,San,San';\">Long Name 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'would_you_like_to_eat_toast';\">Long Name 2</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'SAN_IS_SAVAGE_YOU_CANT_LIE';\">Long Name 3</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>No Name</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '​';\">No Name</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Hope you like my mod!</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<span>San!</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";
IntroGuide += "<br><br>";
IntroGuide += "<span>San</span>";

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;

//Footer Things!
var IntroFooter = '';
IntroFooter += "<center><h3>This is San's Mod I hope you have a Awesome Experience on this Mod Adventure Enjoy the Mods xD</h3>";

document.getElementsByClassName('hud-intro-footer')[0].innerHTML = IntroFooter;

//By: SAN
var IntroCornertopleft = '';
IntroCornertopleft += "<h3>By: NØR×SanHNT</h3>";

document.getElementsByClassName('hud-intro-corner-top-left')[0].innerHTML = IntroCornertopleft;

//Notes and Things!
var IntroLeft = '';
IntroLeft += "<center><h3>NØR×SanHNT!</h3>";
IntroLeft += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroLeft += "<span>Hope you like the mods xD</span>";

document.getElementsByClassName('hud-intro-left')[0].innerHTML = IntroLeft;

// setting buttons & controls innerHtml
var settingsHtml = '';
settingsHtml += "<div style=\"text-align:center\">";
settingsHtml += "<label><span>zombs.io script settings</span></label>";
settingsHtml += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"spamOn()\">SPAM PARTYS ON</button>";
settingsHtml += "&nbsp;";
settingsHtml += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"spamOff()\">class GetInfo</button>";
settingsHtml += "<br><br>";
settingsHtml += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"runOn()\">SPEED RUN ON</button>";
settingsHtml += "&nbsp;";
settingsHtml += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"runOff()\">SPEED RUN OFF</button>";
settingsHtml += "<br><br>";
settingsHtml += "<button class=\"btn btn-green\" style=\"width: 45%;\" id=\"button2\">BORDER COLOR</button>";
settingsHtml += "&nbsp;";
settingsHtml += "<button class=\"btn btn-green\" style=\"width: 45%;\">COMING SOON</button>";
settingsHtml += "<br><br>";
settingsHtml += "<label><span>zombs.io script hide and show</span></label>";
settingsHtml += "<button id=\"lbb\" class=\"btn btn-green\" style=\"width: 90%;\" onclick=\"leaderboard();leaderboard2();\">ALWAYS MAKE PARTY NAME SAN</button>";
settingsHtml += "<br><br>";
settingsHtml += "<button id=\"pub\" class=\"btn btn-green\" style=\"width: 90%;\" onclick=\"popoverlay();popoverlay2();\">ALWAYS MAKE PARTY NAME SAN</button>";
settingsHtml += "<hr style=\"color: rgba(255, 255, 255);\">";
// settings shortcuts & controls
settingsHtml += "<label>";
settingsHtml += "<span>zombs.io script shortcuts & controls</span>";
settingsHtml += "<ul class=\"hud-settings-controls\">";
settingsHtml += "<li>Press '<strong>z</strong>' to start speed run.</strong></li>";
settingsHtml += "<li>Press '<strong>x</strong>' to stop speed run.</strong></li>";
settingsHtml += "<li>Press '<strong>R</strong>' to buy health potions.</strong></li>";
settingsHtml += "<li>Press '<strong>F</strong>' to use health potions.</strong></li>";
settingsHtml += "<li>Press '<strong>+</strong>' to start spam all open partys.</strong></li>";
settingsHtml += "<li>Press '<strong>-</strong>' to stop spam all open partys.</strong></li>";
settingsHtml += "<li>Press '<strong>~</strong>' to hide or show leaderboard.</strong></li>";
settingsHtml += "<li>by [✧] ✘ℕinjaツ.</strong></li>";
settingsHtml += "</ul>";
settingsHtml += "</label>";
settingsHtml += "<hr style=\"color: rgba(255, 255, 255);\">";
// settings features
settingsHtml += "<label>";
settingsHtml += "<span>zombs.io script features</span>";
settingsHtml += "<ul class=\"hud-settings-controls\">";
settingsHtml += "<li>Auto heal player & pet at 70% health</li>";
settingsHtml += "<li>Speed run with pet</li>";
settingsHtml += "<li>Spam all open partys</li>";
settingsHtml += "<li>Max player nickname</li>";
settingsHtml += "<li>Max party tag name</li>";
settingsHtml += "<li>New style</li>";
settingsHtml += "<li>ALWAYS MAKE PARTYNAME NIN</li>";
settingsHtml += "<li>ALWAYS MAKE PARTYNAME NIN</li>";
settingsHtml += "<li>Change border color</li>";
settingsHtml += "<li>by [✧] ✘ℕinjaツ.</li>";
settingsHtml += "</ul>";
settingsHtml += "</label>";
settingsHtml += "</div>";

document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHtml;

// Some Codes that Remove or do other Things
document.getElementsByClassName("hud-day-night-overlay")[0].remove();
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 99);
document.getElementsByClassName("hud-intro-corner-bottom-left")[0].remove();
document.getElementsByClassName("hud-party-joining")[0].remove();
document.getElementsByClassName("hud-intro-corner-bottom-right")[0].remove();

// change div borderColor
var button1 = document.getElementById("button1");

var allchar = "0123456789ABCDEF";

button1.addEventListener("click", changeBorderColor);
button2.addEventListener("click", changeBorderColor);

function changeBorderColor() {
  var randcol = "";
  for (var i = 0; i < 6; i++) {
    randcol += allchar[Math.floor(Math.random() * 16)];
  }

  var divs = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
  for (var i = 0; i < divs.length; i++) {
    divs[i].style.borderColor = "#" + randcol;
  }
}

// Auto Revive and Evolver and Auto Respawn
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-shop-actions-evolve");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-shop-actions-revive");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);

// auto collector for harvestors
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-respawn-btn");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);
setTimeout(() => {
 let elements = document.getElementsByClassName("btn btn-purple hud-building-deposit");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);
setTimeout(() => {
 let elements = document.getElementsByClassName("btn btn-gold hud-building-collect");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);

//Public Speed
var refreshIntervalId;
window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function start() {
  stop();
  refreshIntervalId = setInterval(function() {
    el = document.getElementsByClassName('hud-shop-actions-equip');

    for (var i = 0; i < el.length; i++) {
      var currentEl = el[i];
      currentEl.click();
    }
  }, 1); // Public Speed
}

function stop() {
  if (refreshIntervalId !== null) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
}

// Spam Parties!
var refreshIntervalId2;
window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function start2() {
  stop2();
  refreshIntervalId2 = setInterval(function() {
    el = document.getElementsByClassName('hud-party-link');

    for (var i = 0; i < el.length; i++) {
      var currentEl = el[i];
      currentEl.click();
    }

    el = document.getElementsByClassName('btn btn-green hud-confirmation-accept');

    for (var i = 0; i < el.length; i++) {
      var currentEl = el[i];
      currentEl.click();
    }
  }, 1); // Spam Speed
}

function stop2() {
  if (refreshIntervalId2 !== null) {
    clearInterval(refreshIntervalId2);
    refreshIntervalId2 = null;
  }
}

//Public Thing
var refreshIntervalId2;
window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function start3() {
  stop3();
  refreshIntervalId2 = setInterval(function() {
    el = document.getElementsByClassName('hud-party-visibility is-private');

    for (var i = 0; i < el.length; i++) {
      var currentEl = el[i];
      currentEl.click();
    }

    el = document.getElementsByClassName('hud-party-visibility');

    for (var i = 0; i < el.length; i++) {
      var currentEl = el[i];
      currentEl.click();
    }
  }, 1); // Spam Speed
}

function stop3() {
  if (refreshIntervalId2 !== null) {
    clearInterval(refreshIntervalId2);
    refreshIntervalId2 = null;
  }
}

// auto heal
(function() {
  heal = document.getElementsByClassName('hud-shop-item')[10];
  petHeal = document.getElementsByClassName('hud-shop-item')[11];
  useHeal = document.getElementsByClassName('hud-toolbar-item')[4];
  usePetHeal = document.getElementsByClassName('hud-toolbar-item')[5];
  healthBar = document.getElementsByClassName('hud-health-bar-inner')[0];
  up = new Event('mouseup');
  healLevel = 98;

  HEAL = function() {
    heal.attributes.class.value = 'hud-shop-item';
    petHeal.attributes.class.value = 'hud-shop-item';
    useHeal.dispatchEvent(up);
    usePetHeal.dispatchEvent(up);
    heal.click();
    petHeal.click();
  };

  script = function(e) {
    if (e.keyCode == 82) {
      HEAL();
    }
  };
  document.addEventListener('keydown', function(e) {
    script(e);
  });
  observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
      if (parseInt(mutations[0].target.style.width) < healLevel) {
        HEAL();
      }
    });
  });
  observer.observe(healthBar, {
    attributes: true,
    attributeFilter: ['style']
  });
})();

var nameEntity = Game.currentGame.world.localPlayer.entity.currentModel.nameEntity.text
nameEntity._style.font = "normal normal bold 35px Pacifico, cursive"
nameEntity.style._fill = "rgb(229, 229, 229)"
nameEntity.x = 2
nameEntity.y = 2
nameEntity.context.imageSmoothingQuality = "high"
nameEntity._style.stroke = "rgba(0, 0, 0, 0.4)"
nameEntity._style.dropShadow = true
nameEntity._style.dropShadowBlur = 50
nameEntity._style.dropShadowColor = "rgba(0, 0, 0, 0.4)"
nameEntity._style.dropShadowDistance = 5
// <link href="https://fonts.googleapis.com/css?family=Sedgwick+Ave" rel="stylesheet">

class GetInfo {
        constructor() {}

        init() {
                this.SendChatMessage(atob("U2NyaXB0IG1hZGUgYnkgRGVtb3N0YW5pcyBodHRwczovL2Rpc2NvcmQuZ2cvQ2NBZ2FiVQ=="), "Global")

                setTimeout(() => {
                        const lastMessage = this.GetLastMessage(),
                                style = document.createElement("style"),
                                disabledInfo = [
                                        "aimingYaw",
                                        "availableSkillPoints",
                                        "baseSpeed",
                                        "collisionRadius",
                                        "damage",
                                        "energy",
                                        "energyRegenerationRate",
                                        "entityClass",
                                        "experience",
                                        "firingTick",
                                        "hatName",
                                        "height",
                                        "interpolatedYaw",
                                        "isBuildingWalking",
                                        "isInvulnerable",
                                        "isPaused",
                                        "lastDamage",
                                        "lastDamageTarget",
                                        "lastDamageTick",
                                        "lastPetDamage",
                                        "lastPetDamageTarget",
                                        "lastPetDamageTick",
                                        "level",
                                        "maxEnergy",
                                        "maxHealth",
                                        "model",
                                        "msBetweenFires",
                                        "reconnectSecret",
                                        "slowed",
                                        "speedAttribute",
                                        "startChargingTick",
                                        "stunned",
                                        "weaponName",
                                        "weaponTier",
                                        "width",
                                        "yaw",
                                        "zombieShieldHealth",
                                        "zombieShieldMaxHealth"
                                ]

                        style.innerHTML = ".hud-chat .hud-chat-message { white-space: normal; } .hud-chat-messages { resize: both; }"

                        document.head.appendChild(style)

                        Game.currentGame.network.addEntityUpdateHandler(e => {
                                const entities = Game.currentGame.world.entities

                                let HTML = ""

                                Object.keys(entities).forEach((t, i) => {
                                        const entity = entities[t].fromTick

                                        if (entity.entityClass !== "PlayerEntity") return

                                        Object.keys(entity).forEach((prop, index) => {
                                                if (disabledInfo.indexOf(prop) >= 0) return

                                                if (entity[prop].x && entity[prop].y) {
                                                        HTML += `<p>${prop}: ${entity[prop].x}, ${entity[prop].y}</p>`
                                                } else {
                                                        HTML += `<p>${prop}: ${entity[prop]}</p>`
                                                }
                                        })

                                        HTML += "<hr>"
                                })

                                lastMessage.innerHTML = HTML
                        })
                }, 1000)
        }

        SendChatMessage(msg, channel) {
                Game.currentGame.network.sendRpc({
                        name: "SendChatMessage",
                        channel: channel,
                        message: msg
                })
        }

        SendFakeChatMessage(name, msg) {
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
                        displayName: name,
                        message: msg
                })
        }

        GetLastMessage() {
                const messages = document.querySelectorAll(".hud-chat-message"),
                        messagesArray = Array.prototype.slice.call(messages)

                return Array.prototype.pop.call(messagesArray)
        }

        GetFirstMessage() {
                const messages = document.querySelectorAll(".hud-chat-message"),
                        messagesArray = Array.prototype.slice.call(messages)

                return Array.prototype.shift.call(messagesArray)
        }
}

if (!Game.currentGame.world.inWorld) Game.currentGame.network.addEnterWorldHandler(() => new GetInfo().init())
else new GetInfo().init()

//KeyCodes
function keyDown() {
  var e = window.event;
  switch (e.keyCode) {
    case 90:
      start();
      break;
    case 88:
      stop();
      break;
    case 187:
      start2();
      break;
    case 189:
      stop2();
      break;
    case 219:
      start3();
      break;
    case 221:
      stop3();
      break;
  }
}