// ==UserScript==
// @name         </> Kurt Mod - Bot Oluşturucu
// @namespace    http://tampermonkey.net/
// @version      89.3
// @description  !ghost
// @icon         https://cdn.discordapp.com/emojis/823513307712454727.png?v=1
// @author       Kurt
// @match        http://tc-mod.glitch.me/
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/430434/%3C%3E%20Kurt%20Mod%20-%20Bot%20Olu%C5%9Fturucu.user.js
// @updateURL https://update.greasyfork.org/scripts/430434/%3C%3E%20Kurt%20Mod%20-%20Bot%20Olu%C5%9Fturucu.meta.js
// ==/UserScript==

const _ = function(element) {
    return document.querySelector(element)
}
const __ = function(element) {
    return document.querySelectorAll(element)
}
window.Ultimate = {}
const Ultimate = window.Ultimate
__(".ad-unit").forEach(function(e) {
    e.remove()
}),
    (function(t) {
        for (let i = 0; i < arguments.length; i++) {
            let e = document.createElement("script")
            e.src = arguments[i]
            document.body.appendChild(e)
        }
    })("https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js", "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"),
    (function(t) {
        for (let i = 0; i < arguments.length; i++) {
            let e = document.createElement("link")
            e.rel = "stylesheet"
            e.href = arguments[i]
            document.head.appendChild(e)
        }
    })("https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css", "https://cdn.jsdelivr.net/gh/demostanis/theme-jqueryui/theme.css")
setTimeout(function() {
    $(document).ready(function() {
        const addScript = function(src) {
            let script = document.createElement("script")
            script.src = src
            document.body.appendChild(script)
            return script
        }
        addScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.25.2/codemirror.js")
        setTimeout(function() {
            addScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.7.0/mode/javascript/javascript.js")
        }, 2000)
        const addLink = function(href) {
            let link = document.createElement("link")
            link.rel = "stylesheet"
            link.href = href
            document.body.appendChild(link)
            return link
        }
        addLink("https://cdn.jsdelivr.net/gh/codemirror/CodeMirror/theme/lesser-dark.css")
        addLink("https://cdn.jsdelivr.net/codemirror/3.21.0/codemirror.css")
        const removeItem = function(array, item) {
            let i = item
            return array.slice(0, i - 1).concat(array.slice(i, array.length))
        }
        const swap = function (array, x, y) {
            var b = array[x]
            array[x] = array[y]
            array[y] = b
            return array
        }
        const addStyle = function(css) {
            let style = document.createElement("style")
            style.innerHTML = css
            document.head.appendChild(style)
        }
        addStyle(`
    .menu {
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
    }

    .menu-grid {
        position: relative;
        height: 340px;
        margin: 0 0 20px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.2);
        overflow-y: auto;
        border-radius: 3px;
    }

    .menu-close {
        position: absolute;
        top: 15px;
        right: 30px;
        width: 30px;
        height: 30px;
        opacity: 0.2;
        transition: all 0.15s ease-in-out;
    }

    .menu-close::before, .menu-close::after {
        content: ' ';
        position: absolute;
        left: 25px;
        height: 30px;
        width: 2px;
        background: #eee;
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

    .bot {
        line-height: 1.3;
        margin-left: 1ch;
    }

    .botTagRegular {
        background: #7289da;
        color: #fff;
    }

    .botTag {
        -ms-flex-negative: 0;
        border-radius: 3px;
        flex-shrink: 0;
        font-size: .625em;
        font-weight: 500;
        line-height: 1.3;
        padding: 1px 2px;
        text-transform: uppercase;
        vertical-align: middle;
    }

    .hud-chat .hud-chat-message {
        white-space: normal;
    }

    .hud-menu-profile {
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

    .hud-profile-grid {
        display: block;
        position: relative;
        height: 340px;
        margin: 20px 0 0;
        padding: 10px;
        background: rgba(0, 0, 0, 0.2);
        overflow-y: auto;
        border-radius: 3px;
    }

    .hud-profile-pic {
        margin-left: auto;
        margin-right: auto;
        width: 20%;
    }

    .hud-profile-name {
        margin-left: auto;
        margin-right: auto;
        width: 13%;
    }

    .ultimate-button {
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

    .menu-close::before {
        transform: rotate(45deg);
    }

    .menu-close::after {
        transform: rotate(-45deg);
    }

    .cm-s-lesser-dark .CodeMirror-linenumber {
        left: -25px !important;
    }

    .save-bot {
        margin-top: 10px;
    }

    .save-changes {
        margin-top: 10px;
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
        -45deg-webkit-transition: .4s;
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
        background-color: #5c0148;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #050011;
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
`)
        Ultimate.createMenu = function(menuHTML, menuCLASS) {
            if (!menuHTML || !menuCLASS) {
                throw new Error("HTML or CLASS wasn't gave.")
                return
            } else {
                let menu = document.createElement("div")
                menu.innerHTML = menuHTML + "<a class='menu-close'></a>"
                menu.classList.add(menuCLASS)
                document.body.appendChild(menu)
                menu.style.display = "none"
                menu.show = function() {
                    this.style.display = "block"
                }
                menu.hide = function() {
                    this.style.display = "none"
                }
                menu.hideOrShow = function() {
                    if (this.style.display == "block") {
                        this.hide()
                    } else {
                        this.show()
                    }
                }
                __(".menu-close")[__(".menu-close").length - 1].addEventListener("click", function() {
                    menu.hide()
                })
                window.addEventListener("mouseup", e => {
                    for (let i = 0; i < e.target.childNodes.length; i++) {
                        if (e.target != menu && e.target.parentNode != menu) {
                            menu.hide()
                        }
                    }
                })
                let childs = menu.childNodes
                for (let i = 0; i < childs.length; i++) {
                    if (childs[i].classList.value !== "menu-close") {
                        childs[i].addEventListener("click", function() {
                            menu.show()
                        })
                    }
                }
                menu.observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutations[0].target.style.display == "block") {
                            menu.style.display = "none"
                        }
                    })
                })
                menu.observer.observe(_(".hud-menu-party"), {
                    attributes: true
                })
                menu.observer.observe(_(".hud-menu-shop"), {
                    attributes: true
                })
                menu.observer.observe(_(".hud-menu-settings"), {
                    attributes: true
                })
                menu.observer.observe(_(".hud-respawn"), {
                    attributes: true
                })
                menu.observer.observe(_(".hud-reconnect"), {
                    attributes: true
                })
                if (_(".hud-menu-profile") !== null) {
                    if (menuCLASS !== "hud-menu-profile") {
                        menu.observer.observe(_(".hud-menu-profile"), {
                            attributes: true
                        })
                    }
                }
                new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutations[0].target.style.display == "block") {
                            if (__(".hud-menu-profile") !== null) {
                                if (menuCLASS !== "hud-menu-profile") {
                                    for (let i = 0; i < __(".hud-menu-profile").length; i++) {
                                        __(".hud-menu-profile")[i].style.display = "none"
                                    }
                                }
                            }
                            _(".hud-menu-shop").style.display = "none"
                            _(".hud-menu-party").style.display = "none"
                            _(".hud-menu-settings").style.display = "none"
                            _(".hud-reconnect").style.display = "none"
                            _(".hud-respawn").style.display = "none"
                        }
                    })
                }).observe(menu, {
                    attributes: true
                })
                return menu
            }
        }
        Ultimate.menu = Ultimate.createMenu("<h3>Kurt Mod</h3><div class='menu-grid'><div class='bots'></div><button class='ui-button ui-widget ui-corner-all add-bot'>Bot Oluştur</button><button class='ui-button ui-widget ui-corner-all add-bot2'>Yenile</button></div>", "menu")
        _(".hud-top-center").innerHTML += "<button class='ultimate-button'>Kurt Mod</button>"
        _(".ultimate-button").addEventListener("click", function() {
            Ultimate.menu.hideOrShow()
        })
        Ultimate.bots = {}
        const Bot = function(name, prefix, profile) {
            if (!name || !prefix || !profile) {
                throw new TypeError("Name, prefix or profile info wasn't gave")
                return
            }
            Ultimate.bots[name] = {}
            Ultimate.bots[name].botName = name
            Ultimate.bots[name].botPrefix = prefix
            Ultimate.bots[name].chatBotName = "<strong>" + Ultimate.bots[name].botName + "</strong><small> (" + Ultimate.bots[name].botPrefix + ')</small><span class="botTagRegular botTag bot">BOT</span>'
            Ultimate.bots[name].sendMessage = function(message) {
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
                    displayName: this.chatBotName,
                    message: message
                })
                var messages = document.getElementsByClassName("hud-chat-message")
                Ultimate.bots[name].messagesLength = messages.length
                var length = messages.length - 1
                messages[length].innerHTML = messages[length].innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            }
            Ultimate.bots[name].onInWorld = function(doSomething) {
                var id = setInterval(function() {
                    if (Game.currentGame.world.inWorld) {
                        clearInterval(id)
                        doSomething()
                    }
                })
            }
            Ultimate.bots[name].sendMessage("Botunuz Hazırlanıyor...")
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
                var a = document.getElementsByClassName("hud-chat-input")[0].value.substring(0, Ultimate.bots[name].botPrefix.length + command.length)
                a = document.getElementsByClassName("hud-chat-input")[0].value.replace(a, "")
                a = a.trim()
                return a
            }
            Ultimate.bots[name].getAfterMessage = function(message, afterWhat) {
                var a = message.childNodes[1].textContent.substring(0, afterWhat.length + 2)
                a = message.childNodes[1].textContent.replace(a, "")
                a = a.trim()
                return a
            }
            Ultimate.bots[name].showModal = function(title, html) {
                let m = document.createElement("div")
                m.classList.add("modal")
                m.title = title
                m.innerHTML = html
                document.body.appendChild(m)

                $(".modal").dialog({
                    autoOpen: true,
                    show: {
                        effect: "blind",
                        duration: 1000
                    },
                    hide: {
                        effect: "blind",
                        duration: 1000
                    }
                })
            }
            Ultimate.bots[name].botExists = function(bot) {
                for(let i in JSON.parse(localStorage.bots)) {
                    let botcode = JSON.parse(localStorage.bots)[i].code
                    if(code.startsWith("//#" + bot)) {
                        return true
                    } else {
                        return false
                    }
                }
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
                    Ultimate.bots[name].chatBotName = name
                } else {
                    throw new Error("Please give a chat name for the bot!")
                }
            }
            Ultimate.bots[name].profile = {}
            Ultimate.bots[name].profile.profilePic = profile.profilePic
            Ultimate.bots[name].profile.profileName = profile.profileName
            Ultimate.bots[name].profile.profileInfo = profile.profileInfo
            let profileMenu = Ultimate.createMenu("<img style='width: 100px; height: 100px;' src='" + profile.profilePic + "'></img><h3>" + profile.profileName + "</h3><p>" + profile.profileInfo + "</p>", "menu")
            Ultimate.bots[name].onMessageSent(function() {
                function checkMsg(i) {
                    if (__(".hud-chat-message")[i].childNodes[0].innerHTML == Ultimate.bots[name].chatBotName) {
                        profileMenu.show()
                    }
                }
                for (let i = 0; i < __(".hud-chat-message").length; i++) {
                    __(".hud-chat-message")[i].addEventListener("click", function() {
                        checkMsg(i)
                    })
                }
            })

            function checkMsg(i) {
                if (__(".hud-chat-message")[i].childNodes[0].innerHTML == Ultimate.bots[name].chatBotName) {
                    profileMenu.show()
                }
            }
            for (let i = 0; i < __(".hud-chat-message").length; i++) {
                __(".hud-chat-message")[i].addEventListener("click", function() {
                    checkMsg(i)
                })
            }
            return Ultimate.bots[name]
        }
        let example = `//#Senin_Botun

if(typeof unsafeWindow == "undefined" || "null") {
    window.myBot = new Bot("TC Developer", "2.5", {
        profileName: "TC Developer",
        profilePic: "-",
        profileInfo: "Görevüm Basenizi Ayakta Tutup En İyi Şekilde Savunmak"
    })
} else {
    unsafeWindow.myBot = new Bot("TC Developer", "2.5", {
        profileName: "TC Developer",
        profilePic: "-",
        profileInfo: "Görevim Basenizi Ayakta Tutup En İyi Şekilde Savunmak"
    })
}

myBot.sendMessage("Merhaba, Ben TC Developer")`
        if (localStorage.bots) {
            function loadBots() {
                let storedBots = JSON.parse(localStorage.bots)
                for (let i = 0; i < storedBots.length; i++) {
                    try {
                        eval(storedBots[i].code)
                    } catch(err) {
                        Game.currentGame.ui.getComponent("Chat").onMessageReceived({
                            displayName: "[CONSOLE]",
                            message: "Must delete bot number " + i + ", because it has an error. " + err + " Please reload your page.</br><button class='ui-button ui-widget ui-corner-all delete-notworking-bot'>Tıkla</button>"
                        })
                        var messages = document.getElementsByClassName("hud-chat-message")
                        var length = messages.length - 1
                        messages[length].innerHTML = messages[length].innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">")

                        __(".delete-notworking-bot")[0].addEventListener("click", function() {
                            let bots = JSON.parse(localStorage.bots)
                            if (i == 0) {
                                bots.shift()
                            } else if (i == bots.length - 1) {
                                bots.pop()
                            } else {
                                bots = removeItem(bots, i)
                            }
                            localStorage.bots = JSON.stringify(bots)
                            window.location.reload()
                        })
                    }
                    let botdiv = document.createElement("div")
                    botdiv.innerHTML =
                        `<div class='ultimate-bot'>
                            <p style='display: inline-block;'>` +
                            Ultimate.bots[Object.keys(Ultimate.bots)[Object.keys(Ultimate.bots).length - 1]].chatBotName +
                            `</p>
                            <button class="ui-button ui-widget ui-corner-all delete-bot" style="display: inline-block;"></button>
                            <button class="ui-button ui-widget ui-corner-all edit-bot" style="display: inline-block;"></button>
                        </div>`
                    _(".bots").appendChild(botdiv)
                    $(".edit-bot").button({
                        icon: "ui-icon-pencil"
                    })
                    $(".delete-bot").button({
                        icon: "ui-icon-closethick"
                    })
                }
            }
            loadBots()
        }
        _(".add-bot").addEventListener("click", function() {
            let editorMenu = Ultimate.createMenu("<textarea class='editor'></textarea><button class='ui-button ui-widget ui-corner-all save-bot'>Kayıt</button>", "menu")
            editorMenu.show()
            let editor = CodeMirror.fromTextArea(__(".editor")[__(".editor").length - 1], {
                lineNumbers: true,
                mode: "javascript",
                theme: "lesser-dark"
            })
            editor.getDoc().setValue(example)
            let childs = editorMenu.childNodes
            for (let i = 0; i < childs.length; i++) {
                if (childs[i].classList.value !== "menu-close") {
                    childs[i].addEventListener("click", function() {
                        editorMenu.show()
                        Ultimate.menu.show()
                    })
                }
            }
            editor.on("change", e => {
                example = e.getValue()
            })
            __(".save-bot")[__(".save-bot").length - 1].addEventListener("click", function() {
                let error = false
                try {
                    eval(editor.getValue())
                } catch (errors) {
                    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
                        displayName: "[CONSOLE]",
                        message: errors
                    })
                    error = true
                }
                if (error == false) {
                    const bots = Ultimate.bots
                    editorMenu.hide()
                    let botdiv = document.createElement("div")
                    botdiv.innerHTML =
                        `<div class='ultimate-bot'>
                            <p style='display: inline-block;'>` +
                            Ultimate.bots[Object.keys(Ultimate.bots)[Object.keys(Ultimate.bots).length - 1]].chatBotName +
                            `</p>
                            <button class="ui-button ui-widget ui-corner-all delete-bot" style="display: inline-block;"></button>
                            <button class="ui-button ui-widget ui-corner-all edit-bot" style="display: inline-block;"></button>
                        </div>`
                    _(".bots").appendChild(botdiv)
                    ;(function(t) {
                        for (let i = 0; i < arguments.length; i++) {
                            let e = document.createElement("script")
                            e.src = arguments[i]
                            document.body.appendChild(e)
                        }
                    })("https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js")
                    setTimeout(function() {
                        $(".edit-bot").button({
                            icon: "ui-icon-pencil"
                        })
                        $(".delete-bot").button({
                            icon: "ui-icon-closethick"
                        })
                    }, 1000)
                    if (!localStorage.bots) {
                        localStorage.setItem("bots", "[]")
                        storedBots = JSON.parse(localStorage.bots)
                    } else {
                        storedBots = JSON.parse(localStorage.bots)
                    }
                    storedBots.push({
                        code: editor.getValue()
                    })
                    localStorage.bots = JSON.stringify(storedBots)
                }
            })
        })
        document.addEventListener("click", function(e) {
            if (e.target.classList[3] == "delete-bot") {
                let i = Array.prototype.slice.call(__(".delete-bot")).indexOf(e.target)
                e.target.parentNode.remove()
                let bots = JSON.parse(localStorage.bots)
                if (i == 0) {
                    bots.shift()
                } else if (i == __(".delete-bot").length - 1) {
                    bots.pop()
                } else {
                    bots = removeItem(bots, i)
                }
                localStorage.bots = JSON.stringify(bots)
            } else if (e.target.classList[3] == "edit-bot") {
                let menu = Ultimate.createMenu('<textarea class="edit-bot-textarea"></textarea><button class="ui-button ui-widget ui-corner-all save-changes">Tekrar Kayıt</button>', "menu")
                menu.show()
                let editor = CodeMirror.fromTextArea(__(".edit-bot-textarea")[__(".edit-bot-textarea").length - 1], {
                    mode: "text/javascript",
                    theme: "lesser-dark",
                    lineNumbers: true
                })
                let editBtns = []
                for (let i = 0; i < __(".edit-bot").length; i++) {
                    editBtns.push(__(".edit-bot")[i])
                }
                let i = Array.prototype.slice.call(editBtns).indexOf(e.target)
                editor.getDoc().setValue(JSON.parse(localStorage.bots)[i].code)
                let childs = menu.childNodes
                for (let i = 0; i < childs.length; i++) {
                    if (childs[i].classList.value !== "menu-close") {
                        childs[i].addEventListener("click", function() {
                            menu.show()
                            Ultimate.menu.show()
                        })
                    }
                }
                __(".save-changes")[__(".save-changes").length - 1].addEventListener("click", function() {
                    let errors = false
                    try {
                        eval(editor.getValue())
                    } catch (errors) {
                        Game.currentGame.ui.getComponent("Chat").onMessageReceived({
                            displayName: "[CONSOLE]",
                            message: errors
                        })
                        errors = true
                    }
                    if (errors == false) {
                        let bots = JSON.parse(localStorage.bots)
                        bots[i].code = editor.getValue()
                        localStorage.bots = JSON.stringify(bots)
                        menu.hide()
                    }
                })
            }
        })
    })
}, 500)