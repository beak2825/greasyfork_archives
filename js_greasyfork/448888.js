// ==UserScript==
// @name         Woomy Modding Api
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  A modding api for woomy.surge.sh
// @author       Drako Hyena
// @match        https://woomy.surge.sh/
// @match        https://woomy-arras.netlify.app
// @match        https://www.woomy-arras.xyz/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448888/Woomy%20Modding%20Api.user.js
// @updateURL https://update.greasyfork.org/scripts/448888/Woomy%20Modding%20Api.meta.js
// ==/UserScript==

(function() {


    const version = 1.8


if(window.WMA){
    if((!window.WMA.version)||window.WMA.version&&window.WMA.version<version) alert("A script is using an older version of the API. Please disable or update that script or other scripts might not work!")
    return window.WMA.log(["WoomyModdingApi", "MenuLoading"],"API is already in place")
}


let movetoTimeout = setTimeout(()=>{},0)
// Create the api
window.WMA = {
    version: version,
    packets: {
        receive: {
            subscriptionCount: 0,
            subscriptions: {},
            sub: (funct) => {
                window.WMA.packets.receive.subscriptions[window.WMA.packets.receive.subscriptionCount] = funct
                return window.WMA.packets.receive.subscriptionCount++
            },
            unsub: (id) => {
                delete window.WMA.packets.receive.subscriptions[id]
            },
        },
        send: {
            subscriptionCount: 0,
            subscriptions: {},
            sub: (funct) => {
                window.WMA.packets.send.subscriptions[window.WMA.packets.send.subscriptionCount] = funct
                return window.WMA.packets.send.subscriptionCount++
            },
            unsub: (id) => {
                delete window.WMA.packets.send.subscriptions[id]
            },
        }
    },
    entities: {
        subscriptionCount: 0,
        subscriptions: {},
        sub: (funct) => {
            window.WMA.entities.subscriptions[window.WMA.entities.subscriptionCount] = funct
            return window.WMA.entities.subscriptionCount++
        },
        unsub: (id) => {
            delete window.WMA.entities.subscriptions[id]
        },
    },
    createButton: (name="New Button", otherInfo="off", callback=()=>{})=>{
        let button = createButtonEle()
        button.innerHTML = `<p>${name}</p><p>${otherInfo}</p>`
        button.onclick = (event) => {
            callback(button, event)
        }
        return button
    },
    refreshInputs: () => {
        if (!window.WMA.socket) return
        window.WMA.socket.cmd.set(0, 0);
        window.WMA.socket.cmd.set(1, 0);
        window.WMA.socket.cmd.set(2, 0);
        window.WMA.socket.cmd.set(3, 0);
        document.getElementById("gameCanvas").focus()
    },
    log: (names=["WoomyModdingAPI"],str="") => {
        let nameStr = ""
        for(let name of names){
            nameStr += `[${name}]`
        }
        console.log(`${nameStr} - ${str}`)
    },
    upgradeStat: (statName) => {
        switch(statName){
            case "Body Damage":
                window.WMA.socket.talk("x", 0);
                break;
            case "Max Health":
                window.WMA.socket.talk("x", 1);
                break;
            case "Bullet Speed":
                window.WMA.socket.talk("x", 2);
                break;
            case "Bullet Health":
                window.WMA.socket.talk("x", 3);
                break;
            case "Bullet Penetration":
                window.WMA.socket.talk("x", 4);
                break;
            case "Bullet Damage":
                window.WMA.socket.talk("x", 5);
                break;
            case "Reload":
                window.WMA.socket.talk("x", 6);
                break;
            case "Movement Speed":
                window.WMA.socket.talk("x", 7);
                break;
            case "Shield Regeneration":
                window.WMA.socket.talk("x", 8);
                break;
            case "Shield Capacity":
                window.WMA.socket.talk("x", 9);
                break;
            }
    },
    move: {
        up: ()=>{
            window.WMA.socket.cmd.set(0, 1);
        },
        down: ()=>{
            window.WMA.socket.cmd.set(1, 1);
        },
        left: ()=>{
            window.WMA.socket.cmd.set(2, 1);
        },
        right: ()=>{
            window.WMA.socket.cmd.set(3, 1);
        },
        to: (x=0, y=0, ms=1000)=>{
            if(!window.WMA.yourPlayer.entity) return window.WMA.log(["WoomyModdingAPI","MoveTo/MoveAway"], "No window.WMA.yourPlayer.entity");
            window.WMA.move.stop()
            if(x>window.WMA.yourPlayer.position.x){
                window.WMA.move.right()
            }else if(x<window.WMA.yourPlayer.position.x){
                window.WMA.move.left()
            }
            if(y<window.WMA.yourPlayer.position.y){
                window.WMA.move.up()
            }else if(y>window.WMA.yourPlayer.position.y){
                window.WMA.move.down()
            }
            clearTimeout(movetoTimeout)
            movetoTimeout = setTimeout(()=>{window.WMA.move.stop()}, ms)
        },
        away: (x=0, y=0, ms=1000)=>{
            window.WMA.move.to(-x,-y,ms)
        },
        stop: ()=>{
            window.WMA.socket.cmd.set(0, 0);
            window.WMA.socket.cmd.set(1, 0);
            window.WMA.socket.cmd.set(2, 0);
            window.WMA.socket.cmd.set(3, 0);
        }
    },
    yourPlayer: {
        position: {x:null,y:null},
        target: {x:null, y:null},
        entity: null,
    },
    socket: null,
    global: null,
    loaded: false,
    loadButtonQueue: [],
}
    // Set up yourPlayer
    window.WMA.packets.receive.sub((type, data)=>{
        if(type!=="u") return;
        window.WMA.yourPlayer.position = {x:Math.round(data[3]-data[6]), y:Math.round(data[4]-data[7])}
    })
    window.WMA.packets.send.sub((type, data)=>{
        if(type!=="C") return
        window.WMA.yourPlayer.target = {x:data[0], y:data[1]}
    })
    let buffer = 5
    window.WMA.entities.sub((entities)=>{
        let entity = entities.find(e => e.name&&e.name===window.WMA.global.playerName&&e.x>window.WMA.yourPlayer.position.x-buffer&&e.x<window.WMA.yourPlayer.position.x+buffer&&e.y>window.WMA.yourPlayer.position.y-buffer&&e.y<window.WMA.yourPlayer.position.y+buffer)
        if(entity) window.WMA.yourPlayer.entity = entity
    })

    // Hook into socket
    let onmessage = Object.getOwnPropertyDescriptor(window.WebSocket.prototype, 'onmessage')
    let oldSet = onmessage.set
    onmessage.set = function(value){
        window.WMA.socket = this
        window.WMA.log(["WoomyModdingAPI","SocketHook"], "Successfully hooked into the socket")
        return oldSet.apply(this, arguments)
    }
    Object.defineProperty(window.WebSocket.prototype, "onmessage", onmessage)

    // Hook into the receiving packets
    let decode;
    Object.defineProperty(Object.prototype, "decode", {
        get(){
            return decode
        },
        set(v){
            decode = function(){
                let data = v.apply(this, arguments)
                for(let functName in window.WMA.packets.receive.subscriptions){
                    let funct = window.WMA.packets.receive.subscriptions[functName]
                    funct(data.shift(), data)
                }
                return v.apply(this, arguments)
            }
        }
    })

    // Hook into the sending packets
    let encode;
    Object.defineProperty(Object.prototype, "encode", {
        get(){
            return encode
        },
        set(v){
            encode = function(){
                let type = arguments[0].shift()
                let data = arguments[0]
                for(let functName in window.WMA.packets.send.subscriptions){
                    let funct = window.WMA.packets.send.subscriptions[functName]
                    funct(type, data)
                }
                arguments[0] = [type].concat(data)
                return v.apply(this, arguments)
            }
        }
    })

    // Hook into global
    Object.defineProperty(Object.prototype, "message", {
        get(){
            return this._message
        },
        set(value){
            if(!window.WMA.global){
                window.WMA.global = this
                window.WMA.global.globalArray = Object.keys(window.WMA.global).map(key=>[key, window.WMA.global[key]])
            }
            this._message = value
        }
    })

    // Hook into entities
    let oldSort = Array.prototype.sort
    Array.prototype.sort = function(){
        if(this[0]&&this[0].alpha){
            for(let id in window.WMA.entities.subscriptions){
                window.WMA.entities.subscriptions[id](this)
            }
        }
        return oldSort.apply(this, arguments)
    }
    window.WMA.log(["WoomyModdingAPI","EntityHook"],"Successfully hooked into entities")

    // Hook into RegExp.test and String.includes to get around the anticheat
    let oldTest = RegExp.prototype.test
    RegExp.prototype.test = function(){
        if(oldTest.apply(/user-?script|user.js|multibox/i, arguments)) return false
        return oldTest.apply(this, arguments)
    }
    let oldIncludes = String.prototype.includes
    String.prototype.includes = function(){
        if(arguments[0] === "userscript.html") return false
        return oldIncludes.apply(this, arguments)
    }

    // Hook into toString to spoof things
    let oldToString = Function.prototype.toString
    Function.prototype.toString = function(){
        switch(this){
            case Array.prototype.findIndex:
                return "functionsort(){[native code]}"
                break;
            case Function.prototype.toString:
                return "functiontoString(){[native code]}"
                break;
            case RegExp.prototype.test:
                return "functiontest(){[native code]}"
                break;
            case String.prototype.includes:
                return "functionincludes(){[native code]}"
                break;
        }
        return oldToString.apply(this, arguments)
    }
    window.WMA.log(["WoomyModdingAPI","toStringHook"],"Successfully hooked into toString")
    function createButtonEle(){
        let button = document.createElement("button")
        if(document.getElementsByClassName("modMenu")[0]){
            document.getElementsByClassName("modMenu")[0].appendChild(button)
        }else{
            window.WMA.loadButtonQueue.push(button)
        }

        return button
    }


    // Load things that need to be loaded after the page is in
    function load(){
        // CREATE THE MENU
        // make the styles
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `:root {
  --text-color: rgba(0, 0, 0, 0.75);
  --main-color: rgba(0, 0, 0, 0.2);
  --second-color: rgba(0, 0, 0, 0.75);
}
.modMenu {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  color: var(--text-color);
  background: var(--main-color);
  border-style: solid;
  border-color: var(--main-color);
  border-width: 2px;
  padding: 0.2%;
  margin: 1%;
  width: 0.5vw;
  height: 0.5vh;
  transition: 0.5s;
  background: var(--second-color);
  overflow-x: hidden;
  overflow-y: auto;
  z-index:110;
  backdrop-filter: blur(0px);
}
.modMenu:hover {
  background: var(--main-color);
  width: 35vw;
  height: 50vh;
  backdrop-filter: blur(10px);
}
.modMenu > * {
  color: var(--text-color);
  max-height: 0;
  max-width: 0;
  font-size: 0;
  opacity: 0;
  transition: 0.25s;
  background: var(--main-color);
  border-style: solid;
  border-color: var(--main-color);
}
.modMenu:hover > * {
  font-size: 15px;
  opacity: 1;
  max-width: 100%;
  max-height: 100%;
}
.modMenu:hover > p {
  font-size: 25px;
  background: none;
  border-style:none;
}
.modMenu:hover > button {
  margin: 2%;
}
.modMenu:hover > button:hover {
  transform: scale(1.1);
}
.modMenu:hover > button:active {
  transform: scale(1);
}

::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}`;
    document.getElementsByTagName('head')[0].appendChild(style);

    // Make the html elements
    let modMenu = document.createElement("div")
    modMenu.classList.add("modMenu")
    modMenu.onclick = () => {window.WMA.refreshInputs()}
    let title = document.createElement("p")
    title.innerHTML = "Mod Menu"
    modMenu.appendChild(title)
    document.body.appendChild(modMenu)
    let discordBtn = createButtonEle()
    discordBtn.innerHTML = `<p>Join the Discord</p><p></p>`
    discordBtn.onclick = () => {
        alert("https://discord.gg/zfSvRsJ7")
    }
    let refreshSizeBtn = createButtonEle()
    refreshSizeBtn.innerHTML = `<p>Refresh Size<p><p></p>`
    refreshSizeBtn.onclick = () => {
        let gear = document.getElementById("settings-button").getBoundingClientRect();
        let modMenu = document.getElementsByClassName("modMenu")[0]
        modMenu.style.top = `${gear.top+gear.height/2}px`
        modMenu.style.left = `0px`
        modMenu.style.zoom = document.getElementById("mainWrapper").style.zoom
    }
    refreshSizeBtn.click()
    for (let button of window.WMA.loadButtonQueue){
        document.getElementsByClassName("modMenu")[0].appendChild(button)
    }
    for (let funct of window.WMALoadQueue||[]){
        funct()
    }
    window.WMA.loaded = true;
}

// LOAD THE MENU
let interval = setInterval(()=>{
    if(document.getElementById("settings-button")){
        clearInterval(interval)
        load()
    }
},10)
})();