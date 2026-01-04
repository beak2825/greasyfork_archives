// ==UserScript==
// @name         !.!.!.a0 moomoo search
// @version      1.1
// @author       pixelzyx
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @grant        none
// ==/UserScript==

(function(){
    var btn = document.createElement("div");
    btn.innerHTML = "Toggle search UI";
    btn.classList.add("storeTab");

    document.getElementById("storeMenu").children[0].appendChild(btn);




    var msgpack;
    function loadScript(src, cb=()=>{}) {
        let s = document.createElement("SCRIPT");
        s.src = src;
        document.body.appendChild(s);
        s.onload = cb;
    }
    loadScript("https://cdn.jsdelivr.net/npm/msgpack5@4.0.2/dist/msgpack5.min.js", () => {
        msgpack = msgpack5();
    });
    const BOTS_NAME = "search bot";
    const SERVER_INDEXES = {
        miami: "39",
        frankfurt: "9",
        london: "8",
        sydney: "19",
        siliconvalley: "12",
        singapore: "40"
    }
    const sockets = [];
    const nativeWebSocket = window.WebSocket;


    window.WebSocket = function(...args){
        const socket = new nativeWebSocket(...args);
        sockets.push(socket);
        return socket;
    }

    var Bots = []
    var AllBots = []
    var countDisplay;
    var namesInput;
    var resultDisplay;
    function updateCountDisplay() {
        countDisplay && countDisplay.setText(genCountDisplayText(AllBots.length, Bots.length));
    }
    class Bot {
        constructor(ip) {
            this.onready = function(){};
            this.onclose = function(){};
            this.name = BOTS_NAME;
            this.namesFound = [];
            this.id = null;
            this.serverId = null;
            this.ip = ip
            AllBots.push(this);
            updateCountDisplay()

            window.grecaptcha.execute('6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ', { action: 'homepage' }).then(t => {
                this.token = t;

                this.socket = new WebSocket((this.ip ? `wss://ip_${this.ip}.moomoo.io:8008/?gameIndex=0` : sockets[0].url.split("&")[0]) + "&token=" + this.token);
                this.socket.binaryType = "arraybuffer";
                this.socket.onclose = () => {
                    Bots.splice(Bots.findIndex(e => e == this), 1);
                    updateCountDisplay()

                    this.onclose();
                }
                this.socket.onmessage = (message) => {
                    let raw = new Uint8Array(message.data);
                    let data = msgpack.decode(raw);

                    switch(data[0]) {
                        case "io-init":
                            this.onready();
                            this.spawn();

                            this.serverId = this.socket.url.slice(9, 41);
                            break;
                        case "1":
                            if(!this.id) {
                                this.id = data[1][0];
                                Bots.push(this);
                                updateCountDisplay()
                            }
                            break;
                        case "5":
                            const names = data[1][0].filter(e => typeof e == "string");
                            this.namesFound = names;
                            break;
                        case "11":
                            this.spawn();
                            break;
                    }
                }
            });
        }
        send(e) {
            this.socket.readyState === 1 && (this.socket.send(msgpack.encode(e)))
        }

        close() {
            AllBots.splice(AllBots.find(e => e == this), 1);
            this.socket.close();
            updateCountDisplay()
        }
        spawn() {
            this.send(['sp', [{
                name: this.name,
                moofoll: '1',
            }]]);
        }
    }

    var Connectors = [];
    class ConnectAll {
        constructor(list = [], speed) {
            Connectors.forEach(e => e.destroy());
            let _this = this;
            this.settings = {};
            list.forEach(e => {
                this.settings[SERVER_INDEXES[e.element.name]] = e.checked();
            });

            this.speed = speed ?? 300;

            this.active = true;
            AllBots.forEach(e => e.close());

            Connectors.push(this);


            !async function(){
                for(let i in vultr.servers) {
                    if(!_this.active) break;
                    let server = vultr.servers[i];
                    if(_this.settings[server.region.slice("6")]) {
                        new Bot(server.ip);
                        await sleep(_this.speed);
                    }
                }
            }()

        }

        destroy() {
            this.active = false;
            Bots.forEach(e => e.close());
        }
    }


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function checkNames(s = [], lowercase, exact) {

        let list = {};
        Bots.forEach(e => {
            if(e.namesFound.length > 0) {
                list[serverId(e.serverId)] = e.namesFound;
            }
        });


        let found = [];


        for(let l in list) {
            let line = list[l];
            line = line.join(".")[lowercase ? "toLowerCase" : "toString"]().split(".");
            s.forEach(searchname => {
                searchname = searchname[lowercase ? "toLowerCase" : "toString"]();
                line.forEach(linename => {
                    if(linename == searchname) {
                        found.push([l, linename]);
                    } else if(!exact && (linename.includes(searchname) || searchname.includes(linename))) {
                        found.push([l, linename]);
                    }
                })
            });
        }
        return found;
    }
    function serverId(id) {
        let server = window.vultr?.servers?.find(e => e.ip == id);
        return `${server.region.slice(6)}:${server.index}:0`;
    }



    const ui = document.createElement("div");
    ui.style.position = "fixed"
    ui.style.top = "10px";
    ui.style.left = "10px";
    ui.style.maxHeight = "600px";
    ui.style.backgroundColor = "#fff",
        ui.style.zIndex = "999999";
    ui.style.display = "none";
    ui.style.flexDirection = "column";
    ui.style.padding = "17px";
    ui.style.overflowY = "auto";
    document.body.appendChild(ui);

    btn.addEventListener("click", e=> {
        let cur = ui.style.display;
        ui.style.display = cur == "flex" ? "none" : "flex";
    })

    function inSandbox() {
        return !document.URL?.split("://")[1]?.startsWith("moomoo");
    }
    class checkBox {
        constructor(name, parent) {

            this.element = document.createElement("input");
            this.element.setAttribute("type", "checkbox");
            this.element.name = name;
            this.check();

            this.label = document.createElement("label");
            this.label.setAttribute("for", name);
            this.label.innerHTML = name;
            this.label.style.fontSize = "18px";

            this.wrap = document.createElement("div");
            this.wrap.appendChild(this.label);
            this.wrap.appendChild(this.element);

            parent.appendChild(this.wrap);
        }
        checked() {
            return this.element.checked;
        }
        check() {
            this.element.checked = true;
        }
        uncheck() {
            this.element.checked = false;
        }
    }

    class text {
        constructor(text, parent) {
            this.element = document.createElement("p");
            this.setText(text);
            this.element.style.fontSize = "18px";
            this.element.style.padding = "0";
            this.element.style.margin = "0";

            parent.appendChild(this.element);
        }
        setText(text) {
            this.element.innerHTML = text;
        }
    }
    class lineBreak {
        constructor(parent) {
            parent.appendChild(document.createElement("br"));
        }
    }

    class button {
        constructor(text, parent) {
            this.element = document.createElement("button");
            this.element.innerHTML = text;

            this.element.addEventListener("click", e => {
                typeof this.onclick == "function" && this.onclick(e);
            });

            parent.appendChild(this.element);
        }
    }
    class textInput {
        constructor(placeholder, parent) {
            this.element = document.createElement("input");
            this.element.setAttribute("type", "text");
            this.element.setAttribute("placeholder", placeholder);


            parent.appendChild(this.element);
        }
        getValue() {
            return this.element.value;
        }

    }

    function genCountDisplayText(a = 0, b = 0) {
        return `Bots called: ${a}, Bot sockets alive: ${b}`;
    }


    new text("<u style=\"font-size: 18px;\">" + (inSandbox() ? "sandbox moomoo name indexer" : "normal moomoo name indexer") + "</u>", ui);
    new text("created by pixelzyx#6063", ui).element.style.fontSize = "15px";
    new lineBreak(ui);

    let miami, frankfurt, sydney, singapore, siliconvalley, london = {checked() {}, element: {name: null}}

    if(inSandbox()) {
        miami = new checkBox("miami", ui);
        frankfurt = new checkBox("frankfurt", ui);
        sydney = new checkBox("sydney", ui);
        singapore = new checkBox("singapore", ui);
        siliconvalley = new checkBox("siliconvalley", ui);
    } else {
        miami = new checkBox("miami", ui);
        frankfurt = new checkBox("frankfurt", ui);
        sydney = new checkBox("sydney", ui);
        singapore = new checkBox("singapore", ui);
        siliconvalley = new checkBox("siliconvalley", ui);
        london = new checkBox("london", ui)
    }


    new lineBreak(ui);
    new lineBreak(ui);
    new lineBreak(ui);


    let speedInput = new textInput("connect speed (default 300ms)", ui);


    let connectbutton = new button("connect", ui);
    connectbutton.onclick = () => {
        new ConnectAll([miami, frankfurt, sydney, singapore, siliconvalley, london], speedInput.getValue() || 300);
    }

    let disconnectbutton = new button("disconnect", ui);
    disconnectbutton.onclick = () => {
        Connectors.forEach(e => e.destroy());
    }

    countDisplay = new text(genCountDisplayText(0, 0), ui);

    new lineBreak(ui);
    new lineBreak(ui);
    new lineBreak(ui);


    let uppercase = new checkBox("ignore uppercase", ui);
    let exactmatch = new checkBox("exact match", ui);

    uppercase.uncheck();

    namesInput = new textInput("example, example2", ui);
    let searchbutton = new button("search", ui);
    searchbutton.onclick = () => {
        let names = namesInput.getValue().split(",");

        names = names.map(e => e.trim());
        names = names.filter(e => e);

        let res = checkNames(names, uppercase.checked(), exactmatch.checked());

        if(Bots.length > 0) {
            if(res.length < 1) {
                resultDisplay.setText("empty results");
            } else {
                resultDisplay.setText(res.map(e => e.reverse().join(" .... ")).join("<br>"));
            }
        } else {
            resultDisplay.setText("empty results - BOTS NEED TO BE CONNECTED");
        }



    }
    resultDisplay = new text("No request", ui);
})()
