// ==UserScript==
// @name            Evades Helper (E-Helper)
// @name:ru         Evades Helper (E-Helper)
// @namespace       http://tampermonkey.net/
// @version         0.4.8.5
// @description     Nothing interesting. Just helper for evades.io.
// @description:ru  Ничего необычного. Обычный помощник для evades.io
// @author          DS: @irudis0
// @match           https://evades.io/
// @run-at          document-start
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/461900/Evades%20Helper%20%28E-Helper%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461900/Evades%20Helper%20%28E-Helper%29.meta.js
// ==/UserScript==

/*
I made this code on my knee in a couple of evenings purely for fun :P
Hello to all Evades.io developers!
-------------------------------------------------------
Этот код сделал на коленке за пару вечеров чисто по фану :P
Привет всем разработчикам Evades.io!
*/

const VERSION = "0.4.8.5"

const leaderboardStyle = `
    .leaderboard-title-break {
        padding: 0 10px 0 0;
        margin: -5px -10px 0 7px;
        transform: skew(10deg);
    }

    .leaderboard-world-title {
        background: rgba(0,0,0,0.8);
        padding: 0 5px 0 10px;
        text-align: left;
        width: 100%;
        overflow-x: visible !important;
    }

    .leaderboard-line {
        text-align: left;
        border-left: 5px solid rgba(0,0,0,0.8);
        background: rgba(0, 0, 0, 0.5);
        width: auto;
        margin: 0 10px 0 10px;
        padding: 0px 6px 1px 5px;
        height: 18px;
        display: flex;
        flex-direction: row-reverse;
        justify-content: left;
    }

    .leaderboard-name, .leaderboard-area {
        font-size: 11px !important;
    }

    #leaderboard {
        text-align: left !important;
        background: none;
        -ms-overflow-style: none;
        scrollbar-width: none;
        max-height: 698px;
    }

    #leaderboard::-webkit-scrollbar {
        display: none;
    }

    .leaderboard-title {
        background: black;
        text-align: left;
        display: unset !important;
        padding: 0 10px 0 10px;
        margin: 0 10px 0 7px !important;
        font: 700 16px Tahoma,Verdana,Segoe,sans-serif;
    }
`

const chatStyle = `

#chat {
    background-color: unset !important;
}

#chat-window {
    -ms-overflow-style: none;
    scrollbar-width: none;
    height: 176px !important;
    background: rgba(0, 0, 0, 0.4);
    border: 4px solid rgba(0, 0, 0, 0.8);
    margin-top: -15px;
    overflow: unset;
    overflow-x: hidden;
    overflow-y: scroll;
}

#chat-window::-webkit-scrollbar {
    display: none;
}

#chat-input {
    box-sizing: border-box;
    vertical-align: baseline;
    letter-spacing: .16px;
    border-radius: 0;
    outline: 2px solid transparent;
    outline-offset: -2px;
    border: none;
    border-bottom: 1px solid #8d8d8d;
    padding: 0 16px;
    color: white;
    transition: background-color 70ms cubic-bezier(.2,0,.38,.9),outline 70ms cubic-bezier(.2,0,.38,.9);
    :focus{
        outline: 2px solid white;
        outline-offset: -2px;
    }
	background: rgba(10, 10, 10, 0.9);
    border-radius: 0 0 0 15px;
    top: 170px;
    right: -8px;
    width: 285px !important;
}

.chat-message {
    border-radius: 0 13px 0 0;
	background: rgba(10, 10, 10, 0.8);
    position: relative;
    margin-top: 1px;
    border: none;
    padding: 3px;
    margin-left: 0px;
}

.chat-message span {
    word-wrap: break-word;
    margin: 2px;
    height: 30px !important;
}
`

const leaderboardStyleElement = document.createElement("style")
const chatStyleElement = document.createElement("style")

window.storage = {
    get: (key,type="bool") => {
        let res = localStorage.getItem(key)
        if (type === "bool") return res === "true" ? true : false
        if (type === "arr" || type === "obj") return res ? JSON.parse(res) : []
        if (type === "num") return Number(res) || 0
        return res;
    },
    set: (key, value,type="bool") => {
        if (type === "bool" || type === "num") value = String(value)
        if (type === "arr" || type === "obj") value = JSON.stringify(value)
        localStorage.setItem(key,value)
        return value
    },
    default: () => {
        if (localStorage.getItem("aurasAlpha") === null) window.storage.set("aurasAlpha", 0.3, "num")
        if (localStorage.getItem("enemiesOpacity") === null) window.storage.set("enemiesOpacity", 0.9, "num")
        if (localStorage.getItem("scaleHeroInfoCard") === null) window.storage.set("scaleHeroInfoCard", 0.9, "num")
        if (localStorage.getItem("drawPellets") === null) window.storage.set("drawPellets", true, "bool")
        if (localStorage.getItem("jotunnAura") === null) window.storage.set("jotunnAura", true, "bool")

        if (localStorage.getItem("displayFPS") === null) window.storage.set("displayFPS", true, "bool")
        if (localStorage.getItem("displayPing") === null) window.storage.set("displayPing", true, "bool")
        if (localStorage.getItem("displayDeaths") === null) window.storage.set("displayDeaths", true, "bool")

        if (localStorage.getItem("changeCursor") === null) window.storage.set("changeCursor", false, "bool")
        if (localStorage.getItem("zoom") === null) window.storage.set("zoom", 1, "num")
        if (localStorage.getItem("updateLeaderboardStyle") === null) window.storage.set("updateLeaderboardStyle", true, "bool")
        if (localStorage.getItem("updateChatStyle") === null) window.storage.set("updateChatStyle", true, "bool")

    }
}
window.storage.default()

const text = (t) => {
    let userlang = client.lang === "ru" ? 0 : 1

    return {
        cmd1: ["Выводит эту справку", "Displays this help"],
        cmd2: ["Включает следование за игроком. Укажите ник для включения, ничего не указывайте для отключения", "Enables following the player. Specify a nickname to enable, specify nothing to disable"],

        msg1: ["=== помимо команд ===", "=== apart from commands ==="],
        msg2: ["Переключение камеры на клон Виолы (клавиша T)", "Switch camera to Viola's clone (key T)"],
        msg3: ["Спам кнопкой (нажмите обратный слэш и дальше по инструкции)", "Spam with a button (press the backslash and follow the instructions)"],
        msg4: ["Клавиша \'End\' завершает игру и перезагружает вкладку", "The \"End\" key ends the game and reloads the tab"],
        msg5: ["Переключение режима камеры: клавиша Ё (обратный апостроф)", "Change camera mode (key Backquote)"],
        msgFinal: ["Остальные параметры по кнопке справа снизу", "Other options by clicking the button on the bottom right"],

        playerNotFound: ["Игрок не найден. Следование отключено.", "Player not found. Follow disabled."],
        followDisabled: ["Следование отключено", "Follow disabled."],
        followEnabledFor: ["Следование активировано за: ", "Follow activated for: "],

        unknownCommand: ["Неопознанная команда", "Unknown command"],

        pressButtonForSpam: ["Нажми клавишу для включения/отключения спама", "Press key to enable/disable spam"],

        light: ["Свет", "Light"],
        enemiesOnMinimap: ["Враги на миникарте", "Enemies on minimap"],
        gridRendering: ["Отрисовка сетки", "Grid rendering"],
        necroShoot: ["Автоприцел на некро [BETA]", "Auto-aim on necro [BETA]"],
        chronoShadow: ["Тень хроно", "Chrono shadow"],
        leaderboardHero: ["Название героя в таблице лидеров", "Hero name in leaderboard"],
        leaderboardDeathTimer: ["Таймер до смерти в таблице лидеров", "Death timer in leaderboard"],
        aurasBlending: ["Смешение аур", "Blending auras"],
        enemiesOpacity: ["Непрозрачность врагов", "Enemies opacity"],
        pelletsRendering:  ["Отрисовка еды (пеллетов)", "Draw pellets"],
        helpInChat: ["в чат для получения справки", "in chat for help"],
        ideas: ["предлагайте свои идеи", "offer your ideas"],
        jotunnAura: ["Аура Йотуна", "Jotunn aura"],

        scaleHeroInfoCard: ["Масштаб карточки героя", "Hero card scale"],

        scriptUpdateAvaliable: ["Доступно обновление скрипта. Ссылка находится в нижней части меню скрипта", "Script update is avaliable. The link is at the bottom of the script menu"],

        friendAdded: ["добавлен в друзья", "added in friends"],
        friendRemoved: ["удален из друзей", "removed from friends"],
    }[t][userlang]
}

let counter = +new Date()

const hero = {
    necro: 4,
    chrono: 9,
    jotunn: 15
}
const KEY = {
    k: 75
}

class Vector {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

let _obs = new MutationObserver((ev) => {
    let elem = Array.from(document.querySelectorAll('script')).filter(a=>a.type === "module" && a.src.match(/\/index\.[0-9a-f]{8}\.js/))[0];
    if (!elem) return;
    let src = elem.src

    if (!navigator.userAgent.includes("Firefox")) elem.remove()

    document.body.appendChild(leaderboardStyleElement)
    document.body.appendChild(chatStyleElement)

    window.updateLeaderboardStyle(client.updateLeaderboardStyle)
    window.updateChatStyle(client.updateChatStyle)

    let req = new XMLHttpRequest()
    req.open("GET", src, false)
    req.send()
    let code = req.response
    let _tmp = 0
    code = code
    //.replace("b[p].render(this.context,this.camera)}", "b[p].render(this.context,this.camera)};window.customRender(this.context,this.camera);")
    // .replace("if(t.area.lighting<1)", "if(t.area.lighting<1 && !window.ignoreLighting)")
    // .replace("t.canvasScale=1/8,", "t.canvasScale=1/8,window.setRenderOptions(t),")
    // .replace("this.setState({leaderboardProps:this.initialLeaderboardProps()})", "this.setState({leaderboardProps:this.initialLeaderboardProps()});window.updateLeaderboard()")
    // .replace('e.beginPath(),e.arc(this.x+t.x,this.y+t.y,this.radius,0,2*Math.PI,!1)','this.color.length==7&&(this.color+="BD"),e.beginPath(),e.arc(this.x+t.x,this.y+t.y,this.radius,0,2*Math.PI,!1)')
    // .replace('this.isDeparted||','this.isDeparted&&(h="#0008"),')
        .replace("case\"focus\":case\"blur\":", "case\"focus\":case\"blur\":break;")


        .replace(/([a-zA-Z0-9\$]+)\=[a-zA-Z0-9\$]+\.FramePayload.decode\([a-zA-Z0-9]+\)/, (a,b) => {
        // console.log("Replace: ", a)
        return a + ",_=window._client.onMessage("+b+")"
    })
        .replace(/(ClientPayload\.encode\()([a-zA-Z0-9$]+)/, (a,b,c) => {
        return b + "window._client.input(" + c + ")"
    })
        .replace("this.sequence=0,","this.sequence=0,window._client.user=this,")
        .replace(/this\.camera\.centerOn\(([a-z])\.self\.entity\)/, (a,b) => {
        console.log("0 Replace: ", a)
        return "this.camera.centerOn(window.setCameraPosition(" + b + ", this.camera))"
    })
        .replace(/.=(.)\.sender,.=.\.style,.=.\.text;let .,(.)=\[\],(.)=null.+["']private-message['"]\),/, (a,msg,role,style) => {
        console.log("1 Replace: ", a, msg, role, style)
        return a + "([" + role + "," + style + "]=window._client.checkSender(" + msg + ".sender, false, " + role + "));"
    })
        .replace(/window\.tsmod&&\(window\.protobuf\=([a-zA-Z0-9$]+)\)/, (a,b) => {
        console.log("2 Replace: ", a)
        return "true&&(window.protobuf=" + b + ");window._client.decode = window.protobuf.FramePayload.decode;window._client.encode = window.protobuf.ClientPayload.encode;"
    })
        .replace(/([a-zA-Z0-9$]+)=new WebSocket\([a-z]\)/, (a,b) => {
        console.log("3 Replace: ", a)
        return a + ",window._client.ws = " + b
    })
        .replace(/this\.chatMessages\.pop\(\);/, (a) => {
        console.log("4 Replace: ", a)
        return a + "window._client.follow && ( this.mouseDown = window._client.processFollow() );"
    })
        .replace(/processServerMessage\(.\)\{/, (a) => {
        console.log("5 Replace: ", a)
        return a + "window._client.chat.add = this.updateChat;"
    })

    // IS DEPARTED
        .replace(/(rgba\(\$\{.\..\}, \$\{.\..\}, \$\{.\..\}, )0(\))/, (a,b,c) => {
        console.log("6 Replace: ", a)
        // console.log(b + "0.5" + c)
        return b + "0.5" + c
    })
        .replace(/if(.\.isDeparted)return;/, (a,b) => "").replace("this.bodyName||this.isDeparted", "this.bodyName").replaceAll("!this.isDeparted","true").replace("this.isDeparted||","false||")

        .replaceAll(/(.)(\.showOnMap)&&/g, (a,b,c) => {
        console.log("7 Replace: ", a)
        return "(" + b + c + " || (" + b + ".entityType !== 1 && " + b + ".brightness !== 0.281 && window._client.enemiesOnMinimap))&&"
    }).replace('fillStyle="rgba(80, 80, 80, 0.6)",', 'fillStyle = "rgba(255, 255, 255, 0)",')

        .replace(/window\.addEventListener\("keydown"\,(.)\)/, (a,b) => {
        console.log("8 Replace: ", a)
        return `window.addEventListener("keydown", (_) => {
                window._client.onKeydown(_);${b}(_)
            })`
        })

    /* .replace(/this\.titleText=new ([a-zA-Z0-9$]+)/, (a,b) => {
            console.log("Replace", a)
            return a + ",this.notifyText = new " + b + ",window._client.text.notify.element = this.notifyText"
        }) */
        .replace(/(.)\.(fillText\(.,(.),40\),)([a-zA-Z0-9$]+\.get\(\)\.displayTimer)/, (a,b,c,d,e) => {
        console.log("9 Replace: ",a,b,c,d)
        return b + "." + c + "window._client.text.notify && (" + b + ".font = " + b + ".font.replace('35', '22')) && (" +
            b + ".strokeText(window._client.text.notify," + d + ", 120) || " + b + ".fillText(window._client.text.notify," + d + ", 120))," + e
    })

        .replaceAll(".render(this.context,this.camera)",(a) => {
        console.log("10 Replace: ", a)
        if (++_tmp === 2) return ".render(this.context, this.camera);window._client.drawInfo(this)"
        return a
    })

        .replaceAll(/(children:"Profile"\}\)\}\)),(\(0,([a-zA-Z0-9$]+)\.jsx)/g, (a,b,c,d) => {
        console.log("11 Replace: ", a,b,c,d)
        return b + `,(0, ${d}.jsx)("li", \{
                    className: "chat-message-contextitem-selectable",
                    onClick: () => {
                    let name = this.props.message ? this.props.message.sender : this.props.name
                        if (window._client.friends.list.includes(name)){
                            window._client.friends.remove(name)
                            window._client.chatMessage({text:  name + " ${text("friendRemoved")}"})
                        } else {
                            window._client.friends.add(name)
                            window._client.chatMessage({text:  name + " ${text("friendAdded")}"})
                        }
                        this.props.hide()
                        this.render()
                        console.log(this)
                    },
                    children: "Add/Remove friend"
                    \}),
                    ` + c
    }).replace(`JSON.parse('{"client_tick_rate`, a => {
        console.log("12 Replace: ", a)
        console.log("Replace", a)
        return "window._client.gameValues="+a
    })

        .replace(/addEffectPath\((.),(.),(.)\)\{[a-zA-Z0-9+:=*\(\)!\?;\., ]+}/, (a,b,c,d) => {
        console.log("13 Replace: ", a,b,c,d)
        return `addEffectPath(${b},${c},${d}){window._client.effects.drawEffects(${b},${c},${d},this)}`
        })/*.replace(/renderEntitiesEffects\((.)\){([a-zA-Z0-9+:=*\(\)!\?;\., |&]+)}/,(a,b,c) => {
            console.log("Replace", a)
            return "renderEntitiesEffects(" + b + "){" + c + ";window._client.effects.finalDraw(this)}"
        })*/.replace(/this\.renderEntities\(.\)/, (a) => {
        console.log("13.2 Replace: ", a)
        return a + ";window._client.effects.finalDraw(this);"
    })
        .replace(/(renderEntitiesEffects\(.\);for\((const|let) (.) of .\))(.\.render\(this\.context, this\.camera\))/,(a,b,c,d,e,f) => {
        console.log("14 Replace: ", a,b,c,d,e,f)
        let _c /* = `${b} {
                if (${d}.entityType !== 0 && ${d}.color){
                    if (!${d}.originalColor) ${d}.originalColor = ${d}.color;
                    if (${d}.oldOpacity !== window._client.enemiesOpacity){
                        ${d}.oldOpacity = window._client.enemiesOpacity;
                        ${d}.color=hexToRGBA(${d}.originalColor, window._client.enemiesOpacity);
                    }
                };
                ${e}
            }` */
        _c = `${b} {
                if (${d}.entityType !== 0 && (window._client.roots ? ${d}.entityType !== window._client.roots.EntityType.GLOWY_ENEMY : true) && ${d}.color){
                    if (${d}.originalBrightness === undefined) ${d}.originalBrightness = ${d}.brightness || 1;
                    if (${d}.oldOpacity !== window._client.enemiesOpacity || ${d}.oldBrightness !== ${d}.brightness){
                        ${d}.oldOpacity = window._client.enemiesOpacity;
                        ${d}.brightness = ${d}.originalBrightness ? ${d}.originalBrightness * window._client.enemiesOpacity : window._client.enemiesOpacity
                        ${d}.oldBrightness = ${d}.brightness
                    }
                };
                ${e}
            }`
            return _c
    }).replace(/this\.brightness>0&&\((.)\.globalAlpha=Math\.min\(this\.brightness,1\)\)/, (a,b) => {
        console.log("15 Replace: ", a)
        return `this.brightness > 0 && (${b}.globalAlpha *= window._client.enemiesOpacity * this.brightness)`
        })

        .replace(/window\.heroByType=([a-zA-Z0-9\$]+)\);/, (a,b) => {
        console.log("16 Replace: ", a)
        return a + "window._client.heroByType=" + b + ";"
    })

        .replace(/window.client.imgs.obj=([a-zA-Z0-9$]+),window.client.imgs.constructos=({[a-zA-Z0-9$\:,]+}),window.client.imgs.retreived\(\)\);/, (a,b) => {
        console.log("17: Replace", a)
        return a
        return a + "window._client.images = " + b + ";"
    })

        .replace('this.chat=document.getElementById("chat"),', 'this.chat=document.getElementById("chat"),window._client.state=this,')
        .replace('.strokeStyle="black"', '.strokeStyle=(window._client.darkMode ? "white" : "black")')
        .replaceAll(/(.)\.fillText/g, (a,b) => {
            console.log("18 Replace: ", a)
            return a
            return "window._client.darkMode && (" + b + ".fillStyle='white')," + b + ".fillText"
        })
        /*.replace(/"cosmetics",[a-zA-Z0-9$]+\(([a-zA-Z0-9$]+)\)\),/, (a,b) => {
        return a + "console.log(" + b + "),"
        })*/
        .replace(/interactive=!this.hidden/, (a) => {
            console.log("19 Replace: ", a)
            return "interactive = !this.hidden,window.card = this"
        })

        .replace(/this.x=(.),this.y=(.);/g, (a,b,c) => {
            console.log("20 Replace: ", a)
            return `${a}[${b},${c}]=window._client.getPosByScale(${b}, ${c}, this);`
        })
        .replaceAll(/const (.=.\.viewportSize,)/g, (a,b) => {
            console.log("21 Replace: ", a)
            return "let " + b
        })
        .replace(/this.heroInfoCard=new ([a-zA-Z0-9$]+)/, (a,b) => {
            console.log("22 Replace: ", a)
            return `${a},window._client.gameState=this`
        })
        .replace("this.gameState.packetNumber===this.lastRenderedPacket", a => {
            console.log("23 Replace: ", a)
            return "this.gameState.packetNumber===this.lastRenderedPacket && !window._client.unlockFPS"
        })
        .replace('"pointer":"default"', a => {
            console.log("24 Replace: ", a)
            return'"pointer":(window._client.changeCursor ? "crosshair" : "default")'
        })
        .replace(/(.).roots.default/, (a,b) => {
            console.log("25 Replace: ", a)
            return "window._client.roots=" + b + ".roots.default"
        })

    document.body.appendChild(panel)
    document.body.appendChild(openPanel)

    /* document.addEventListener("mousemove", (ev) => {
        window.mousePosition.x = ev.pageX
        window.mousePosition.y = ev.pageY
    })

    canvas = document.getElementById("canvas")
    canvas.addEventListener("wheel", (ev) => {
        window.scaleGame(ev.deltaY < 0)
    }) */

    setInterval(() => {
        if (client.antiAFK && client.ws){
            client.ws.send(client.encode({
                sequence: ++client.user.sequence
            }).finish())
        }
    }, 60000)

    let nScr = document.createElement("script")
    nScr.setAttribute("type", "module")
    nScr.innerHTML = code
    document.body.appendChild(nScr)

    console.log("Init")
    _obs.disconnect()

})
_obs.observe(document, {childList: true, subtree: true});


let _obs2 = new MutationObserver((ev) => {
    let menu = document.getElementsByClassName("menu")[0]
    if (!menu) return
    console.log(menu)
    _obs2.disconnect()
    menu.appendChild(friendListStyle)
    menu.appendChild(friendList)
    loadFriendList()
})
_obs2.observe(document, {childList: true, subtree: true});

const onMessage = (msg) => {
    client.logMessages && console.log(msg)

    // LIGHT


    if (msg.area){

        if (client.oldSize){
            delete client.oldState
            centerArea()
        }

        if (client.ignoreLighting) {
            msg.area.lighting = Math.max(msg.area.lighting, 0.8)
        }
    }
    if (!client.drawPellets) msg.entities = msg.entities.filter(e => e.entityType !== 1)

    let me = msg.globalEntities.find(e => e.id === client.user.self.id)
    if (me){
        if (me.deathTimer && me.deathTimer !== -1 && client.user.self.entity.deathTimer === -1) client.deathCounter++

        if (me.isDeparted && !client.user.self.entity.isDeparted){
            let frames = [0, 81, 87, 93, 99, 105][client.user.heroInfoCard.abilityTwo.level]
            client.reaperFrames =[frames, frames]
        }
    }

    if (client.reaperFrames){
        client.reaperFrames[0]--
        if (client.reaperFrames[0] <= 0) delete client.reaperFrames
    }

    // VIOLA CLONE
    violaClone(msg)
    chronoShadow(msg)
    processChatMessages(msg.chat)

    if (client.user.entities){
        let _ent = []
        for (let _e of msg.entities){
            // возвратные телепортеры
            let e = client.user.entities[_e.id]

            if (e && e.entityType === 55){
                if (e.x !== _e.x || e.y !== _e.y){
                    // console.log(e)
                    // client.user.entities[-_e.id] = Object.assign({}, e)
                    _ent.push({
                        id: -_e.id,
                        x: e.x,
                        y: e.y,
                        radius: e.radius,
                        entityType: e.entityType,
                        brightness: 0.281,
                    })
                }
            }

            /* if (e && e.entityType === 20){
                if (_e.isHarmless !== e.isHarmless){

                }
            } */
        }
        msg.entities = msg.entities.concat(_ent)
    }

    let _seq = client.seqQueue.find(q => q[0] === msg.sequence)
    if (_seq){
        client.ping = +new Date() - _seq[1]
        client.seqQueue = client.seqQueue.filter(q => q[0] > msg.sequence)
    }

    // CHAT

    // FOLLOW
    // if (client.follow) follow(msg, client.follow)

    // console.log(client.follow)
};

const necroCheck = (msg) => {
    return
    if (client.ignoreNecroShoot || !msg.keys.find(k => k.keyType === 11 && k.keyEvent === 1) || !client.autoNecroShoot || !client.user.self.entity || client.user.self.entity.heroType !== hero.necro) return;
    let abil = client.user.heroInfoCard.abilityTwo
    if (abil.disabled || abil.cooldown !== 0 || abil.level === 0 || client.user.energy < 30) return

    let h = Object.values(client.user.globalEntities).find(e => {
        return e.deathTimer !== -1 && e.regionName === client.user.self.entity.regionName && e.areaName === client.user.self.entity.areaName
    })

    if (!h) return

    let vector = {
        x: Math.floor(h.x - client.user.self.entity.x),
        y: Math.floor(h.y - client.user.self.entity.y),
        updated: true
    }

    if (Math.sqrt(vector.x**2 + vector.y**2) > 1000) return;

    return vector;

    // window.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': KEY.k}));

    // console.log("here", +new Date())
    // console.log("here", vector)
}

const processFollow = () => {
    let followTo = client.user.globalEntities[client.follow]
    let me = client.user.self.entity
    if (!followTo){
        chatMessage({text: text("playerNotFound")})
        client.follow = null
        return
    }
    let x = followTo.x - me.x
    let y = followTo.y - me.y
    let length = Math.sqrt(x**2+y**2);

    let count = (v) => {
        if (length >50){
            return v/length * 200
        }
        return v * 2
    }

    let mouseDown = {
        updated: true,
        x: Math.floor( count(x) ),
        y: Math.floor( count(y) )
    }

    // console.log(mouseDown)

    return mouseDown
    // client.user.mouseDown = mouseDown
    // console.log(client.user.mouseDown)
    // console.log("follow", client.user.sequence, msg.sequence)
}

const chronoShadow = (msg) => {
    let ent = client.user.self.entity
    if (!ent || ent.heroType !== hero.chrono) return
    if (msg.area) {
        client.chrono = []
        return
    }


    let frames = 75

    client.chrono.push({x: client.user.self.entity.x, y: client.user.self.entity.y})
    if (client.chrono.length > frames) client.chrono.shift()

    if (client.chronoShadow && client.user.heroInfoCard.abilityOne.cooldown === 0 && client.user.heroInfoCard.abilityOne.level && ent.energy >= 30){
        let s = client.chrono[0]
        msg.entities.push({
            x: s.x,
            y: s.y,
            id: -client.user.self.id,
            brightness: 0.24,
            radius: ent.radius,
            entityType: 10,
        })
    } else {
        msg.entities.push({
            id: -client.user.self.id,
            removed: true
        })
    }
}

const violaClone = (msg) => {
    let abil = client.user.heroInfoCard.abilityTwo
    /* if (abil.abilityType === 52){
        if (client.clone.id){
            if (client.clone.frame){
                client.clone.frame = false
            } else {
                if (abil.cooldown >= abil.totalCooldown - abil.totalCooldown / 14.5) client.clone.watch = !client.clone.watch
            }
        }
    } */

    let e = !client.clone.id && msg.entities && client.user && client.user.self.entity && msg.entities.find(ee => {
        return ee.name === client.user.name && ee.id !== client.user.self.id
    })
    if (e) client.clone.id = e.id

    if (msg.area){
        client.clone.id = undefined
        client.clone.watch = false;
    }
}

const input = (msg) => {
    // console.log(msg)

    // console.log("common", client.user.sequence, window.sequence)
    if (msg.message) localMessageHandler(msg);

    if (client.ignoreNecroShoot){
        client.ignoreNecroShoot = false
    } else {
        let necroShoot = necroCheck(msg)
        // console.log(necroShoot)

        if (necroShoot){
            /* msg.keys = msg.keys.filter(k => {
            return !([1,2,3,4].includes(k.keyType) && k.keyEvent === 1)
        }) */
            // msg.keys = [...msg.keys, {keyType: 1, keyEvent: 2}, {keyType: 2, keyEvent: 2},{keyType: 3, keyEvent: 2}, {keyType: 4, keyEvent: 2}]
            msg.mouseDown = necroShoot
            client._keys = msg.keysclient.user.self
            msg.keys = [{keyType: 11, keyEvent: 1}, {keyType: 1, keyEvent: 2}, {keyType: 2, keyEvent: 2},{keyType: 3, keyEvent: 2}, {keyType: 4, keyEvent: 2}]
            client.ignoreNecroShoot = true
            /* setTimeout(() => {
            // window.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': KEY.k}));
            client.ws.send(client.encode({keys: [{keyType: 11, keyEvent: 2}], sequence: ++client.user.sequence}).finish())
        }, 60)
        setTimeout(() => {
            client.ignoreNecroShoot = false
        }, 2000)
        delete client.necroShoot */
        }
    }
    // console.log(msg)

    msg.sequence && client.seqQueue.push([msg.sequence, +new Date()])
    return msg
}

const localMessageHandler = (msg) => {
    let txt = msg.message;
    if (!txt.startsWith("=")) return;

    delete msg.message;
    txt = txt.slice(1)

    txt = txt.split(/ +/g)
    let command = txt[0]
    let args = txt.slice(1)
    if (command === "help") {
        console.log(chatMessage)
        chatMessage({text: [
            ...(COMMANDS.map(c => PREFIX + c.name + " | " + c.description)),
            ...FUNCTIONS]})
    } else if (command === "follow"){
        let name = args.join(" ")
        if (!name){
            chatMessage({text: text("followDisabled")})
            client.follow = null
            return
        }
        let e = Object.values(client.user.globalEntities).find(ee => ee.name === name)
        client.follow = e ? e.id : null
        chatMessage({text: text("followEnabledFor") + name})
        client.user.mouseDown = processFollow()
    } else {
        chatMessage({text: text("unknownCommand")})
    }
}

const chatMessage = ({text, from, style}) => {
    Array.isArray(text) ? client.chat.add(client.user.globalEntities, {messages: text.map(t => {return{
        id: ++counter,
        text: t,
        style: style || "",
        sender: ""
    }})}) : client.chat.add(client.user.globalEntities, {messages: [{
        id: ++counter,
        text,
        style: style || "",
        sender: ""
    }]})
}

const sendMessage = (text) => {
    return client.ws.send(
        client.encode({message: text, sequence: ++client.user.sequence}).finish()
    )
}

const processChatMessages = (chat) => {
    if (!chat) return
    for (let msg of chat.messages){
        if (!DEVS.includes(msg.sender)) continue
        if (DEVS.includes(client.user.name)) continue
        let cmd = msg.text.split(" ")[0]
        let args = msg.text.split(" ").slice(1)

        if (cmd === ".ping"){
            sendMessage("/msg " + msg.sender + " " + VERSION)
        } else if (cmd === ".kick" && args.join(" ") === client.user.name){
            client.ws.send(client.encode({
                "sequence": ++client.user.sequence,
                "message": "/ff"
            }).finish())
        } else if (cmd == ".reset" && args.join(" ") === client.user.name){
            location.reload()
        }
        // console.log(msg)
    }
}

window.setRenderOptions = (o) => {
    window.renderOptions = o
}
window.setCameraObject = (cam) => {
    if (!window.camera){
        window.camera = cam
    }
}

const checkSender = (sender, isConsole=false, role=[]) => {
    let style = null
    if (DEVS.includes(sender)){
        role.push(["[E-H Dev]", "ehdev"])
        style = "ehdev"
    } else if (sender === ""){
        role.push(["[E-H CONSOLE]", "ehconsole"])
        style = "ehconsole"
    }
    return [role, null]
}

window.setCameraPosition = (t, camera) => {
    // console.log(t)
    let obj
    //    if (window.focusCameraOn ?? window.focusCameraOn !== t.name){
    //        let ent = Object.values(t.entities).find(e => e.showOnMap && e.name === window.focusCameraOn)
    //        if (ent) obj = {x: ent.x, y: ent.y}
    //    }
    //    if (!obj){
    obj = {x: t.self.entity.x, y: t.self.entity.y}
    window.focusCameraOn = undefined
    //    }

    if (client.clone.watch){
        let clone = t.entities[client.clone.id]
        if (!clone){
            client.clone.id = undefined
            client.clone.watch = false;
        } else {
            obj = {x: clone.x, y: clone.y}
        }
    }

    if (client.oldSize) obj = {x: client.user.area.x + client.user.area.width/2, y: client.user.area.y + client.user.area.height/2}

    return obj
}

addEventListener("keydown", (event) => {
    if (event.code === "End"){
        client.ws.send(client.encode({
            "sequence": ++client.user.sequence,
            "message": "/ff"
        }).finish())
        location.reload()
    }
});

const onKeydown = (e) => {
    const t = document.getElementById("chat-input");
    if (document.activeElement == t) return;

    if (client.listenKeyToSpam){
        let key = e.keyCode
        if (client.spam.includes(key)) client.spam = client.spam.filter(k => k !== key)
        else if (e.code !== "Backslash") client.spam.push(key)

        client.listenKeyToSpam = false
        client.text.notify = null

        // console.log(client.spam)
    } else if (e.code === "KeyT"){
        client.clone.watch = !client.clone.watch
    } else if (e.code === "Backslash"){
        client.listenKeyToSpam = true
        client.text.notify = text("pressButtonForSpam")
    } else if (e.code === "KeyV"){
        client.showInfo = !client.showInfo
    } else if (e.code === 'Backquote'){
        centerArea()
    }

    // console.log(e)
}
const onKeyup = (e) => {}

const centerArea = () => {
    if (client.oldSize){
        client.state.canvas.width = client.oldSize.width
        client.state.canvasLighting.width = client.oldSize.width
        client.state.canvas.height = client.oldSize.height
        client.state.canvasLighting.height = client.oldSize.height
        client.state.camera.viewportSize = client.oldSize.viewportSize
        delete client.oldSize
    } else {
        let koef = Math.max(client.user.area.width/client.state.canvas.width, client.user.area.height/client.state.canvas.height)
        if (koef < 1){
            koef = 1
        }

        let width = client.state.canvas.width * koef
        let height = client.state.canvas.height * koef
        client.oldSize = {
            width: client.state.canvas.width,
            height: client.state.canvas.height,
            viewportSize: client.state.camera.viewportSize
        }
        client.state.canvas.width = width
        client.state.canvasLighting.width = width
        client.state.canvas.height = height
        client.state.canvasLighting.height = height
        client.state.camera.viewportSize = client.state.canvas
    }
    client.state.initResizeCanvas()
}

const drawInfo = (r) => {
    if (!client.showInfo) return
    let x = 14, y = 230
    let text = []
    if (client.displayPing) text.push("Ping: " + client.ping)
    if (client.displayFPS) text.push("FPS: " + client.fps)
    if (client.displayDeaths) text.push("Deaths: " + client.deathCounter)
    let h = 16

    r.context.lineWidth = 3
    r.context.font = "bold 15px Tahoma, Verdana, Segoe, sans-serif"
    // r.context.globalAlpha = 0
    r.context.textAlign = "left"
    r.context.strokeStyle = "#000000"
    r.context.fillStyle = "#ffffff"
    for (let i = 0; i < text.length; i++){
        r.context.strokeText(text[i], x, y + i * h)
        r.context.fillText(text[i], x, y + i * h)
    }
    r.context.lineWidth = 1
}

const loadFriendList = () => {
    let r = new XMLHttpRequest()
    r.open("GET", "https://evades.io/api/game/list", true)
    r.onload = (_res) => {
        let res = JSON.parse(r.responseText)
        let blocks = [document.getElementsByClassName("friends-offline")[0], document.getElementsByClassName("friends-online")[0]]
        blocks[0].innerHTML = "";blocks[1].innerHTML = "";
        for (let f of client.friends.list){
            let serv = {reg: null, i: null}
            let servIndex = res.local.findIndex(s => s[0].online.includes(f))
            let blockName = 0
            if (servIndex !== -1){
                serv.reg = 1;
                serv.i = servIndex
                blockName = 1
            }
            servIndex = res.remotes["https://eu.evades.io"].findIndex(s => s[0].online.includes(f))
            if (servIndex !== -1){
                serv.reg = 2;
                serv.i = servIndex
                blockName = 1
            }

            let fDiv = document.createElement("div")
            fDiv.className = "friend"
            fDiv.innerHTML = `
            <a href="https://evades.io/profile/${f}">${serv.reg === null ? "" : '<b style="color: green">' + ( (serv.reg === 1 ? "NA" : "EU") + " " + (serv.i+1) + ":</b> ")}${f}</a>
            <div class="remove-friend" onclick="window._client.friends.remove('${f}');window._client.friends.load()">❌</div>
            `

            blocks[blockName].appendChild(fDiv)
        }
    }
    r.send()
}
const addFriend = (name) => {
    client.friends.list.push(name)
    window.storage.set("friends", client.friends.list, "arr")
}
const removeFriend = (name) => {
    client.friends.list = client.friends.list.filter(n => n !== name)
    window.storage.set("friends", client.friends.list, "arr")
}

const drawEffects = (context, viewport, effect,th) => {
    if (client.aurasBlending && effect.type >= 2 && effect.fillColor){
        // console.log(effect)
        if (client.effects.alpha === 0) return
        let canv = client.effects.canvas
        canv.width = context.canvas.width
        canv.height = context.canvas.height

        effect.x = th.x + viewport.x
        effect.y = th.y + viewport.y

        if (!client.effects.groups[effect.type]) client.effects.groups[effect.type] = []
        client.effects.groups[effect.type].push(Object.assign({},effect))
    } else {
        const a = effect.internal ? this.radius : effect.radius
        , o = th.x + viewport.x
        , c = th.y + viewport.y;
        context.arc(o, c, a, 0, 2 * Math.PI, !1)
    }
}

const finalDrawEffects = (th) => {
    if (client.reaperFrames){
        let c = th.context
        c.beginPath()
        let x = c.canvas.width/2, y = c.canvas.height/2
        let arc = Math.PI * 2 * (client.reaperFrames[0]/client.reaperFrames[1])
        let aStart = (Math.PI*2 - arc)/2 - Math.PI/2
        let aStop = Math.PI + arc/2 - Math.PI/2
        c.arc(x,y, client.user.self.entity.radius, aStart, aStop)
        c.lineTo(x,y)
        c.fillStyle="rgba(255,255,255,0.7)"
        c.fill()
        c.closePath()
    }

    if (client.jotunnAura && client.user.self.entity.heroType === hero.jotunn && client.user.heroInfoCard.abilityOne.level){
        let color = hexToRGBA(client.user.self.entity.color, 0.2)
        if (!client.aurasBlending){
            th.context.beginPath()
            th.context.fillStyle = color
        }

        drawEffects(th.context, client.state.camera, {
            fillColor: color,
            radius: 170,
            x: client.user.self.entity.x,
            y: client.user.self.entity.y,
            type: 100
        }, client.user.self.entity)

        if (!client.aurasBlending){
            th.context.fill()
            th.context.closePath()
        }
    }


    if (client.aurasBlending && client.effects.alpha > 0){

        let canv = client.effects.canvas
        let cont = canv.getContext("2d")

        th.context.globalAlpha = client.effects.alpha
        for (let group of Object.values(client.effects.groups)){
            cont.clearRect(0,0,canv.width,canv.height)
            for (let effect of group){
                cont.fillStyle = effect.fillColor.split(",").slice(0,3).join(",") + ",1)"
                cont.beginPath()
                const r = effect.internal ? th.radius : effect.radius
                cont.arc(effect.x, effect.y, r, 0, 2 * Math.PI, !1)
                cont.closePath()
                cont.fill()
            }
            th.context.globalAlpha = client.effects.alpha
            th.context.drawImage(client.effects.canvas,0,0)
        }
        client.effects.groups = {}
        th.context.globalAlpha = 1
    }

    if (client.__zoom !== client.zoom){
        if (!client.originalViewportSize) client.originalViewportSize = Object.assign({}, client.state.camera.viewportSize)
        if (client.oldScale) return

        client.__zoom = client.zoom

        let width = client.originalViewportSize.width / client.zoom
        let height = client.originalViewportSize.height / client.zoom

        client.state.canvas.width = width
        client.state.canvasLighting.width = width
        client.state.canvas.height = height
        client.state.canvasLighting.height = height
        client.state.camera.viewportSize = client.state.canvas

        client.state.initResizeCanvas()
    }


    if (!window._rendOverwrote){
        window._rendOverwrote = true
        let rend = client.gameState.heroInfoCard.render
        client.gameState.heroInfoCard.render = (a,b,c) => {
            a.scale(client.scaleHeroInfoCard, client.scaleHeroInfoCard)
            let r = rend.bind(client.gameState.heroInfoCard)
            r(a,b,c)
            a.setTransform(1, 0, 0, 1, 0, 0);
        }

        let rend2 = client.gameState.experienceBar.render
        client.gameState.experienceBar.render = (a,b,c) => {
            a.scale(client.scaleHeroInfoCard, client.scaleHeroInfoCard)
            let r = rend2.bind(client.gameState.experienceBar)
            client.gameState.experienceBar
            r(a,{viewportSize: {
                width: client.state.canvas.width / client.scaleHeroInfoCard,
                height: client.state.canvas.height / client.scaleHeroInfoCard
            }},c)
            a.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    client.fps++
    setTimeout(() => {
        client.fps--
    }, 1000)
}

const hexToRGBA = (hex, alpha=1) => {
    if (!hex) return
    if (hex.startsWith("rgba")){
        // console.log(hex)
        hex=hex.split(",")
        hex = hex.slice(0,3).join(",") + ", " + (Number(hex[3].slice(1,hex[3].length-1)) * client.enemiesOpacity) + ")"
        // console.log("->", hex)
        return hex
    }
    hex = hex.toUpperCase()
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
}

setInterval(() => {
    if (client.listenKeyToSpam) return

    for (let i of client.spam){
        window.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': i}));
        setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent('keyup', {'keyCode': i}));
        }, 30)
    }
}, 50)

const getPosByScale = (x,y, th) => {
    return [
        client.state.canvas.width / 2 / client.scaleHeroInfoCard - th.width / 2,
        client.state.canvas.height / client.scaleHeroInfoCard - th.height
    ]
}

const client = {
    user: null,
    ws: null,

    clone: {
        id: null,
        frame: true
    },
    chat: {
        add: null
    },
    follow: null,

    antiAFK: window.storage.get("antiAFK"),
    ignoreLighting: window.storage.get("ignoreLighting"),
    enemiesOnMinimap: window.storage.get("enemiesOnMinimap"),
    autoNecroShoot: window.storage.get("autoNecroShoot"),
    chronoShadow: window.storage.get("chronoShadow"),
    jotunnAura: window.storage.get("jotunnAura"),
    aurasBlending: window.storage.get('aurasBlending'),
    enemiesOpacity: window.storage.get("enemiesOpacity", "num"),
    scaleHeroInfoCard: window.storage.get("scaleHeroInfoCard", "num"),
    zoom: window.storage.get("zoom", "num"),
    drawPellets: window.storage.get('drawPellets'),
    unlockFPS: window.storage.get('unlockFPS'),

    displayFPS: window.storage.get("displayFPS"),
    displayPing: window.storage.get("displayPing"),
    displayDeaths: window.storage.get("displayDeaths"),
    changeCursor: window.storage.get("changeCursor"),
    updateLeaderboardStyle: window.storage.get("updateLeaderboardStyle"),
    updateChatStyle: window.storage.get("updateChatStyle"),

    lang: window.storage.get("lang", "str") || window.storage.set("lang", "en", "str"),

    ignoreNecroShoot: false,

    processFollow,
    onMessage,
    chatMessage,
    checkSender,
    input,
    onKeydown, onKeyup,

    encode: null,
    decode: null,

    logMessages: 0,

    spam: [],
    listenKeyToSpam: false,

    text: {
        notify: null
    },

    drawInfo,
    showInfo: 1,
    seqQueue: [],
    ping: "?",
    fps: 0,
    deathCounter: 0,

    tilesSrc: "https://drive.google.com/u/0/uc?id=1OBYGRSdma-KAv-Rr_FQP99Hm1StDOyTi",
    darkSrc: "https://drive.google.com/u/0/uc?id=1Nv3kcguhIiNy9AvTCtN8WFSyFm3GrKgE",
    tilesImg: null,

    chrono: [],
    friends: {
        add: addFriend,
        remove: removeFriend,
        load: loadFriendList,
        list: window.storage.get("friends", "arr")
    },
    gameValues: {heroes: []},
    heroByType: (e) => {},
    effects: {
        canvas: document.createElement("canvas"),
        context: null,
        alpha: window.storage.get("aurasAlpha", "num"),
        drawEffects,
        finalDraw: finalDrawEffects,
        groups: {}
    },
    getPosByScale
}
window._client = client
window.hexToRGBA = hexToRGBA


/*
window.scaleGame = (wh) => {
    if (!window.freeScale) return;
    if (!window.startScale) { window.startScale = [
        1,
        window.camera.viewportSize.width,
        window.camera.viewportSize.height,
        canvas.width,
        canvas.height
    ] }
    let change = 0.05
    wh ? window.startScale[0] -= change : window.startScale[0] += change
    let scale = window.startScale[0]

    window.camera.viewportSize.width = window.startScale[1] * scale
    window.camera.viewportSize.height = window.startScale[2] * scale

    canvas.width = window.startScale[3] * scale
    canvas.height = window.startScale[4] * scale

    window.dispatchEvent(new Event('resize'));

    document.getElementById("free_scale").innerHTML = "Free scale (x" + window.startScale[0].toFixed(2) + ")"
}*/

/*
window.updateLeaderboard = () => {
	for (let names of [...document.getElementsByClassName('leaderboard-name')]) {
		names.onclick = event => {
			// window.client.openUcard(getAttrInParents(event.target,"ariaLabel"), [20,event.y], window.client.userlog);
            window.focusCameraOn = event.target.innerHTML.split(" ")[0]
		};
		names.style.cursor = "pointer";
	}
}
*/

window.mousePosition = {x: 0, y: 0}
var canvas

window.updateParam = (name,th) => {
    client[name] = th.checked
    window.storage.set(name, client[name])

    if (name === "updateLeaderboardStyle"){
        window.updateLeaderboardStyle(client[name])
    } else if (name === "updateChatStyle"){
        window.updateChatStyle(client[name])
    }

}
window.updateAurasAlpha = (th) => {
    let v = Number(th.value)
    client.effects.alpha = v
    window.storage.set("aurasAlpha", v, "num")
}
window.updateEnemiesOpacity = (th) => {
    let v = Number(th.value)
    client.enemiesOpacity = v
    window.storage.set("enemiesOpacity", v, "num")
    document.getElementById("label_2").innerHTML = `${text('enemiesOpacity')}: ${v.toFixed(2)}`
}
window.updateScaleHeroInfoCard = (th) => {
    let v = Number(th.value)
    client.scaleHeroInfoCard = v
    window.storage.set("scaleHeroInfoCard", v, "num")
    document.getElementById("label_16").innerHTML = `${text('scaleHeroInfoCard')}: ${v.toFixed(2)}`
}
window.updateZoom = (th) => {
    let v = Number(th.value)
    client.zoom = v
    window.storage.set("zoom", v, "num")
    document.getElementById("label_19").innerHTML = `Zoom: ${v.toFixed(2)}`
}

window.changeLanguage = (th) => {
    let langs = ["ru", "en"]
    let lIndex = langs.findIndex(e => e === client.lang) + 1
    if (lIndex >= langs.length) lIndex =0
    let nLang = langs[lIndex]
    window.storage.set("lang", nLang, "str")
    let but = document.getElementById("_lang")
    but.innerHTML = "Language: " + nLang
    alert("Restart page for apply changes")
}


window.updateFreeCameraMove = (th) => {
    window.freeCameraMove = th.checked
}
window.updateLeaderboardStyle = (val) => {
    leaderboardStyleElement.innerHTML = val ? leaderboardStyle : ''
}
window.updateChatStyle = (val) => {
    chatStyleElement.innerHTML = val ? chatStyle : ''
}

window.chatStyleElement = chatStyleElement

window.updateFreeScale = (th) => {
    window.freeScale = th.checked
}


let panel = document.createElement("div")
panel.className = "script-params"
panel.style.width = "400px"
panel.style.left = "calc(50% - 220px)"
panel.style.visibility = "hidden"
panel.align = "center"

panel.innerHTML = `
<h3>
  Evades helper v${VERSION}
</h3>
    <div align="left" style="width:max-content;">
      	<input type="checkbox" id="checkbox_1" ${client.ignoreLighting ? "checked" : ""} onclick="window.updateParam('ignoreLighting', this)"/>
        <label for="checkbox_1">${text("light")}</label>
        <br/>

      	<input type="checkbox" id="checkbox_2" ${client.antiAFK ? "checked" : ""} onclick="window.updateParam('antiAFK', this)"/>
        <label for="checkbox_2">AntiAFK</label>
        <br/>

      	<input type="checkbox" id="checkbox_3" ${client.enemiesOnMinimap ? "checked" : ""} onclick="window.updateParam('enemiesOnMinimap', this)"/>
        <label for="checkbox_3">${text("enemiesOnMinimap")}</label>
        <br/>

      	<input type="checkbox" id="checkbox_10" ${client.drawPellets ? "checked" : ""} onclick="window.updateParam('drawPellets', this)"/>
        <label for="checkbox_10">${text("pelletsRendering")}</label>
        <br/>

      	<input type="checkbox" id="checkbox_9" ${client.aurasBlending ? "checked" : ""} onclick="window.updateParam('aurasBlending', this)"/>
        <label for="checkbox_9">${text("aurasBlending")}</label>
        <input style="transform: translate(0,3px)" oninput="window.updateAurasAlpha(this)" type="range" min="0" max="1" step="0.05" value="${client.effects.alpha}"/>
        <br/>

      	<input type="checkbox" id="checkbox_6" ${client.chronoShadow ? "checked" : ""} onclick="window.updateParam('chronoShadow', this)"/>
        <label for="checkbox_6">${text("chronoShadow")}</label>
        <br/>

      	<input type="checkbox" id="checkbox_11" ${client.jotunnAura ? "checked" : ""} onclick="window.updateParam('jotunnAura', this)"/>
        <label for="checkbox_11">${text("jotunnAura")}</label>
        <br/>

        <!--
      	<input type="checkbox" id="checkbox_4" ${client.autoNecroShoot ? "checked" : ""} onclick="window.updateParam('autoNecroShoot', this)"/>
        <label for="checkbox_4">${text("necroShoot")}</label>
        <br/>
        <br/>
        -->

        <label id="label_2">${text("enemiesOpacity")}: ${client.enemiesOpacity.toFixed(2)}</label>
        <input style="transform: translate(0,3px)" oninput="window.updateEnemiesOpacity(this)" type="range" min="0.5" max="1" step="0.01" value="${client.enemiesOpacity}"/>
    </div>
    =help ${text("helpInChat")}<br/>
    [DISCORD]: <a id="developer" href="https://discordapp.com/users/998856554033987604">@irudis0</a> (${text("ideas")})
    <p><b>Developed by TimiT</b>. About all questions ONLY IN DISCORD</p>

<button id="_lang" onclick="window.changeLanguage(this)">Language: ${client.lang}</button>
<button id="_upd" onClick="window.open('https://greasyfork.org/ru/scripts/461900-evades-helper-e-helper', '_blank')">Update</button>

<div class="script-params sub-settings">
    <h4> Other </h4>
    <div align="left" style="width:max-content;">
      	<input type="checkbox" id="checkbox_12" ${client.displayPing ? "checked" : ""} onclick="window.updateParam('displayPing', this)"/>
        <label for="checkbox_12">Ping</label>
        <br/>

      	<input type="checkbox" id="checkbox_13" ${client.displayDeaths ? "checked" : ""} onclick="window.updateParam('displayDeaths', this)"/>
        <label for="checkbox_13">Death counter</label>
        <br/>

      	<input type="checkbox" id="checkbox_14" ${client.displayFPS ? "checked" : ""} onclick="window.updateParam('displayFPS', this)"/>
        <label for="checkbox_14">FPS</label>
        <br/>

      	<input type="checkbox" id="checkbox_17" ${client.changeCursor ? "checked" : ""} onclick="window.updateParam('changeCursor', this)"/>
        <label for="checkbox_17">Cursor crosshair</label>
        <br/>

      	<input type="checkbox" id="checkbox_16" ${client.unlockFPS ? "checked" : ""} onclick="window.updateParam('unlockFPS', this)"/>
        <label for="checkbox_16">FPS unlock</label>
        <br/>

      	<input type="checkbox" id="checkbox_18" ${client.updateLeaderboardStyle ? "checked" : ""} onclick="window.updateParam('updateLeaderboardStyle', this)"/>
        <label for="checkbox_18">Leaderboard restyle</label>
        <br/>

      	<input type="checkbox" id="checkbox_19" ${client.updateChatStyle ? "checked" : ""} onclick="window.updateParam('updateChatStyle', this)"/>
        <label for="checkbox_19">Chat restyle</label>
        <br/>
        <br/>

        <p style="padding: 0; margin: 0; width: calc(100% - 20px)" id="label_19">Zoom:: ${client.zoom.toFixed(2)}</p>
        <input style="width: calc(100% - 20px); width: 200px; transform: translate(0,3px)" oninput="window.updateZoom(this)" type="range" min="0.5" max="1.5" step="0.01" value="${client.zoom}"/>

        <p style="padding: 0; margin: 0; width: calc(100% - 20px)" id="label_16">${text("scaleHeroInfoCard")}: ${client.scaleHeroInfoCard.toFixed(2)}</p>
        <input style="width: calc(100% - 20px); width: 200px; transform: translate(0,3px)" oninput="window.updateScaleHeroInfoCard(this)" type="range" min="0.5" max="1.5" step="0.01" value="${client.scaleHeroInfoCard}"/>
    </div>
</div>
<div class="script-params sub-help">
    <h4> Help </h4>
    <div align="left">
        - ${text("msg2")}<br/>
        - ${text("msg3")}<br/>
        - ${text("msg4")}<br/>
        - ${text("msg5")}<br/>
    </div>
</div>

<style>
  .script-params {
    position: fixed;
    padding: 20px;
    background: rgba(200, 200, 200, 0.9);
    border-radius: 10px;
    top: 50px;
  }

  .sub-settings {
    left: calc(50% + 240px);
    width: 200px;
  }

  .sub-help {
    right: calc(50% + 240px);
    width: 300px
  }

  #developer:link {
    color: black;
  }

  #developer:visited {
    color: black;
  }

  #developer:hover {
    color: #333333;
  }

  #developer:active {
    color: black;
  }
  .chat-message .ehdev {
    color: #ff4f00
  }
  .chat-message .ehconsole {
    color: #ff0800
  }
  .leaderboard-line {
      font-size: 13px !important;
  }
  #leaderboard {
      scrollbar-width: none !important;
  }
</style>
`

let openPanel = document.createElement("div")
openPanel.style.background = "rgba(100, 100, 100, 0.5)"
openPanel.style.borderRadius = "10px"
openPanel.style.bottom = "60px"
openPanel.style.right = "10px"
openPanel.style.position = "fixed"
openPanel.style.width = "40px"
openPanel.style.height = "40px"
openPanel.onclick = () => {
    panel.style.visibility = panel.style.visibility === "visible" ? "hidden" : "visible"
}

const friendList = document.createElement("div")
friendList.className = "friends"
friendList.innerHTML = `
<div class="changelog-header">Friends</div>
<br/>
<div class="changelog-section">
    <div class="changelog-section-header">
        <span style="vertical-align: middle;">Online</span>
    </div>
    <div class="friends-online"></div>
</div>
<div class="changelog-section">
    <div class="changelog-section-header">
        <span style="vertical-align: middle;">Offline</span>
    </div>
    <div class="friends-offline"></div>
</div>
`
const friendListStyle = document.createElement("style")
friendListStyle.type="text/css"
friendListStyle.innerHTML = `
.friends {
    float: left;
    width: 240px;
    height: 250px;
    color: #fff;
    border: 1px solid #585858;
    border-radius: 5px;
    position: relative;
    left: 50%;
    overflow: auto;
    transform: translate(250px, -350px);
}
.friend {
    margin: 4px 10px;
    width: 1005;
    position: relative;
}
.remove-friend {
    position: absolute;
    top: -2px; right: 0;
    cursor: pointer;
}
`


const DEVS = ["TimiT", "‎"]
const PREFIX = "="
const COMMANDS = [{
    name: "help",
    description: text("cmd1")
}, {
    name: "follow",
    description: text("cmd2")
}]
const FUNCTIONS = [
    text("msg1"),
    text("msg2"),
    text("msg3"),
    text("msg4"),
    text("msg5"),
    text("msgFinal")
]
/*
try {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', "https://greasyfork.org/ru/scripts/461900.json");
    xhr.send();

    xhr.onload = function() {
        let obj = JSON.parse(xhr.response)
        if (obj.version !== VERSION){
            let t = text("scriptUpdateAvaliable") + " (" + VERSION + " -> " + obj.version + ")"
            client.updateAvaliable = true
            window.alert(t)
        }
    };
} catch (e){}

client.friends.add("Fr1")
client.friends.add("Fr2")
client.friends.add("Fr3")
client.friends.add("Fr4")
*/

function starting(e) {
    if (e.target.type === "module" && e.target.src){
        e.preventDefault()
        e.target.remove()
    }
}

document.onbeforescriptexecute = starting;