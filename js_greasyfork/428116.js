// ==UserScript==
// @name         Minion Gota.io
// @version      3.0.0
// @description  Allow to connect minion in your main session
// @author       Flammrock
// @discord      Flammrock#5464
// @match        https://gota.io/web/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @namespace    flammrock
// @downloadURL https://update.greasyfork.org/scripts/428116/Minion%20Gotaio.user.js
// @updateURL https://update.greasyfork.org/scripts/428116/Minion%20Gotaio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* globals $ */

    var logger, remotelogger;
    var apikey = "6LcycFwUAAAAANrun52k-J1_eNnF9zeLvgfJZSY3";

    var GOTA = {
        SEND_NICKNAME    : 0,
        SPECTATE_MODE    : 1,
        DRAW_DATA        : 2,
        EJECT_START      : 3,
        EJECT_END        : 4,

        MAP_SIZE         : 10,

        MOVE_TO          : 16,
        SPLIT            : 17,
        SPECTATE_TOGGLE  : 18,

        ON_DIE           : 21,

        TEAM             : 40,
        TEAM_ANSWER      : 41,
        TEAM_CODE        : 43,

        LEADERBOARD_DATA : 49,
        
        ID               : 64,
        CLEAR_NODES      : 65,

        CHAT_SYSTEM      : 70,
        PINGPONG         : 71,
        CHAT_MESSAGE     : 72,
        CHAT_WHISPER     : 73,

        CAPTCHA          : 100,

        USER_ID          : 103,

        HANDSHAKE        : -1
    };

    var globals = {
        mouseX: 0,
        mouseY: 0,
        mouseFrozen: false,
        keys: {},
        player: null,
        master: null,
        index: 0
    };
    window.globals = globals;


    var init = function() {

        KeyBinds.addKeyMap(new KeyMap('kContextMenu',3,function(){},function(){}));
        KeyBinds.addKeyMap(new KeyMap('kEjectMass',87,function(){
            Actions.ejectstart(globals.player.ws);
        },function(){
            Actions.ejectend(globals.player.ws);
        }));
        KeyBinds.addKeyMap(new KeyMap('kSplit',32,function(){
            Actions.split(globals.player.ws);
        },function(){}));
        KeyBinds.addKeyMap(new KeyMap('kToggleSpec',81,function(){
            Actions.spectate(globals.player.ws);
        },function(){}));
        KeyBinds.addKeyMap(new KeyMap('kDoubleSplit',-1,function(){
            Actions.split(globals.player.ws);
            Actions.split(globals.player.ws);
        },function(){}));
        KeyBinds.addKeyMap(new KeyMap('kTripleSplit',-1,function(){
            for (var i = 0; i < 3; i++) {
                Actions.split(globals.player.ws);
            }
        },function(){}));
        KeyBinds.addKeyMap(new KeyMap('kQuadSplit',-1,function(){
            for (var i = 0; i < 4; i++) {
                Actions.split(globals.player.ws);
            }
        },function(){}));
        KeyBinds.addKeyMap(new KeyMap('kHexaSplit',-1,function(){
            for (var i = 0; i < 6; i++) {
                Actions.split(globals.player.ws);
            }
        },function(){}));
        KeyBinds.addKeyMap(new KeyMap('kFreezeMouse',-1,function(){
            globals.mouseFrozen = !globals.mouseFrozen;
            if (globals.mouseFrozen) {
                document.getElementById('score-mouse').style.display = 'block';
            } else {
                document.getElementById('score-mouse').style.display = 'none';
            }
        },function(){}));
        var minionSplit = new KeyMap('flamm-kSplit',88,function(){
            Minion.broadcast('split');
        },function(){});
        var minionEjectMass = new KeyMap('flamm-kEjectMass',67,function(){
            Minion.broadcast('ejectstart');
        },function(){
            Minion.broadcast('ejectend');
        });
        KeyBinds.addKeyMap(minionSplit);
        KeyBinds.addKeyMap(minionEjectMass);
        var minionViewChange = new KeyMap('flamm-kViewChange',1,function(){},function(){
            globals.index++;
            if (globals.index > Object.keys(Minion.list).length) globals.index = 0;
            if (globals.index==0) {
                globals.player = master;
            } else {
                if (Minion.list[Object.keys(Minion.list)[globals.index-1]].isConnect()) {
                    globals.player = Minion.list[Object.keys(Minion.list)[globals.index-1]];
                } else {
                    globals.index--;
                }
            }
            globals.player.computeHandler.setCanvas(canvas);
            drawHandler.setHandler(globals.player.computeHandler);
        });
        KeyBinds.addKeyMap(minionViewChange);
        var minionSoloTrick = new KeyMap('flamm-kSolotrick',73,function(){
            Actions.forwardsplit(globals.player.ws,globals.player.computeHandler.mass);
        },function(){});
        KeyBinds.addKeyMap(minionSoloTrick);


        remotelogger = new Logger({remote: true});

        // logger system
        logger = new Logger();
        logger.info("Minion System by [red]Flammrock");
        logger.info("Minion System [blue]v"+GM_info.script.version);

        // create a Command Manager
        var commandManager = new Chat.CommandManager();

        // create a master and bind websocket creation
        var master = new Master();
        commandManager.setMaster(master);

        // add some command to the chat */
        commandManager.register("m-add","add a minion",Minion.add);

        // create a tracker for the element with id "chat-input"
        var chattracker = new Chat.Tracker("chat-input");

        // attach the event "keyup" and handle it with the command manager
        chattracker.attach("keyup",Chat.CommandManager.handler(commandManager,"autocomplete-panel"));

        // catch grecaptacha
        new DirtyObserver(window).once(function(target,value){
            logger.debug("grecaptcha catched!");
            window.oldgrecaptchaexec = value;
        }).waitFor("grecaptcha.execute");

       // overwriteWindowEvents(master);

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.style.cssText = 'z-index: -1; position: absolute; top: 0; left: 0; width: 100vw; height:100vh; pointer-events: none;';
        //canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100vw; height:100vh; pointer-events: none; opacity: 1.0;';
        document.addEventListener('DOMContentLoaded', function(event) {
            //document.body.appendChild(canvas);
            document.getElementById('chat-panel').parentNode.appendChild(canvas);
            document.getElementById('canvas').style.display = 'none';

            var minionExtendedSectionKeybinds = KeyBinds.CreateSection("Extented Keybinds");
            KeyBinds.AddToSection(minionExtendedSectionKeybinds,'Solotrick',minionSoloTrick);

            var minionSectionKeybinds = KeyBinds.CreateSection("Minion's Keybinds");
            KeyBinds.AddToSection(minionSectionKeybinds,'View Change',minionViewChange);
            KeyBinds.AddToSection(minionSectionKeybinds,'Split',minionSplit);
            KeyBinds.AddToSection(minionSectionKeybinds,'Eject Mass',minionEjectMass);

        });


        master.setCanvas(canvas);
        var drawHandler = new DataDrawHandler();
        drawHandler.setHandler(master.computeHandler);
        drawHandler.start();

        window.addEventListener('mousemove',function(event){
            globals.mouseX = event.clientX;
            globals.mouseY = event.clientY;
        });


        // a connection manager for minion system
        var connectionManager = new ConnectionManager();
        //connectionManager.add("wss://limitless-ocean-49435.herokuapp.com/");
        //connectionManager.add("wss://whispering-springs-37823.herokuapp.com/");
        connectionManager.add("",2);


        master.setConnectionManager(connectionManager);

        globals.player = master;
        globals.master = master;


    };



    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |            DIRTYOBSERVER CLASS           |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var DirtyObserver = function(target) {
        this.target = target;
        this.catch = false;
        this.interval = null;
        this.result = null;
        this.oncefn = null;
    };
    DirtyObserver.prototype.once = function(fn) {
        this.oncefn = fn;
        return this;
    };
    DirtyObserver.prototype.waitFor = function(key,type) {
        var that = this;
        var keys = key.split(".");
        return new Promise(function(resolve, reject) {
            that.interval = setInterval(function() {
                if (that.catch) {
                    if (that.interval!=null) {
                        try {
                            clearInterval(that.interval);
                        } catch(e) {}
                        that.interval = null;
                    }
                    return;
                }
                var t = that.target;
                for (var i = 0; i < keys.length; i++) {
                    if (typeof t[keys[i]] === 'undefined') return;
                    t = t[keys[i]];
                }
                if (that.catch) return;
                if (typeof type === 'string') {
                    if (typeof t !== type) return;
                }
                that.result = t;
                that.catch = true;
                if (typeof that.oncefn === 'function') resolve(that.oncefn(that.target,that.result));
            },0);
        });
    };


    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |              TRACKER CLASSs              |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var Tracker = function(target,name) {
        var farthat = this;
        this.target = target;
        this.overwrites = [];
        this.overwritesc = [];
        this.overwritess = [];
        this.proxy = new Proxy(target,{
            construct: function(target, args) {
                for (var i = 0; i < farthat.overwritesc.length; i++) {
                    var handler = farthat.overwritesc[i];
                    var nargs = new Tracker.Arguments(args,handler.parser());
                    if (handler.filter(target,null,nargs)) {
                        return handler.action(target,null,nargs);
                    }
                }
                return new target(...args);
            },
            apply: function(target,that,args) {
                var nargs = args;
                var _extract = function(a) {
                    return a instanceof Tracker.Arguments ? a.build() : a;
                };
                for (var i = 0; i < farthat.overwrites.length; i++) {
                    var handler = farthat.overwrites[i];
                    nargs = new Tracker.Arguments(_extract(nargs),handler.parser());
                    if (handler.filter(target,that,nargs)) {
                        handler.action(target,that,nargs);
                    }
                }
                return target.apply(that,_extract(nargs));
            },
            set: function(target,prop,value) {
                var notSet = false;
                for (var i = 0; i < farthat.overwritess.length; i++) {
                    var handler = farthat.overwritess[i];
                    if (handler.filter(target,prop,value)) {
                        notSet |= handler.action(target,prop,value);
                    }
                }
                if (!notSet) target[prop] = value;
            }
        });
        if (typeof name === "string") Tracker.list[name] = this;
    };
    Tracker.list = {};
    Tracker.get = function(name) {
        return Tracker.list[name];
    };
    Tracker.prototype.getProxy = function() {
        return this.proxy;
    };
    Tracker.prototype.register = function(handler,type) {
        if (typeof type !== 'number') type = Tracker.Handler.Type.APPLY;
        if (type == Tracker.Handler.Type.APPLY) {
            this.overwrites.push(handler);
        } else if (type == Tracker.Handler.Type.CONSTRUCT) {
            this.overwritesc.push(handler);
        } else {
            this.overwritess.push(handler);
        }
    };
    Tracker.Handler = function(){
        this.action = null;
        this.filter = null;
        this.parser = null;
    };
    Tracker.Handler.Type = {
        APPLY: 0x1,
        CONSTRUCT: 0x2,
        SETTER: 0x3
    };
    Tracker.Handler.prototype.setParser = function(parser) {
        this.parser = parser.bind(this);
        return this;
    };
    Tracker.Handler.prototype.setAction = function(action) {
        this.action = action.bind(this);
        return this;
    };
    Tracker.Handler.prototype.setFilter = function(filter) {
        this.filter = filter.bind(this);
        return this;
    };
    Tracker.Handler.prototype.forward = function(target,that,args) {
        return target.apply(that,args);
    };
    Tracker.Arguments = function(args,parsertable) {
        this.data = {};
        this.hidedata = [];
        this.parsertable = parsertable;
        this.args = args;
        var i;
        for (i = 0; i < parsertable.length; i++) {
            if (i < args.length) {
                this.data[parsertable[i]] = args[i];
            } else {
                this.data[parsertable[i]] = null;
            }
        }
        while (i < args.length) {
            this.hidedata.push(args[i]);
            i++;
        }
        this.data.length = parsertable.length;
    };
    Tracker.Arguments.prototype.build = function() {
        var data = [];
        for (var i = 0; i < this.args.length; i++) {
            if (i < this.parsertable.length) {
                data.push(this.data[this.parsertable[i]]);
            } else {
                data.push(this.args[i]);
            }
        }
        return data;
    };



    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |             ATTACH TRACKERs              |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    Element.prototype.addEventListener = new Tracker(Element.prototype.addEventListener,"addEventListener").getProxy();
    window.WebSocket = new Tracker(window.WebSocket,"WebSocket").getProxy();



    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |                CHAT CLASSs               |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var Chat = {};
    Chat.Command = function(name,help,callback) {
        this.name = name;
        this.aliases = [];
        this.help = help;
        this.callback = callback;
    };
    Chat.Command.prototype.addAliase = function(name) {
        this.aliases.push(name);
        return this;
    };
    Chat.Command.prototype.execute = function(stringargs) {
        this.callback(stringargs);
    };
    Chat.Command.prototype.startsWith = function(name) {
        if (this.name.startsWith(name)) return true;
        for (var i = 0; i < this.aliases.length; i++) {
            if (this.aliases[i].startsWith(name)) return true;
        }
    };
    Chat.Command.prototype.toArray = function() {
        return [this.name,[this.name].concat(this.aliases).join(', '),this.help];
    };
    Chat.CommandManager = function() {
        this.commands = {};
        this.logger = new Logger().set("Chat.CommandManager");
    };
    Chat.CommandManager.handler = function(commandManager,panel_id) {
        return function(propagate,e) {
            var value = this.getElement().value;
            var panel = document.getElementById(panel_id);
            if (e.keyCode==13) {
                if (commandManager.execute(value)) {
                    this.getElement().value = "";
                    panel.style.display = 'none';
                    return false;
                } else {
                    return true;
                }
            } else {
                propagate(e);
                if (value.charAt(0)=='/') {
                    commandManager.displayHTML(panel,commandManager.startsWith(value.substring(1)));
                }
            }
            return false;
        };
    };
    Chat.CommandManager.prototype.setMaster = function(master) {
        this.master = master;
    };
    Chat.CommandManager.prototype.startsWith = function(name) {
        var list = [];
        for (var commandname in this.commands) {
            if (Object.hasOwnProperty.call(this.commands, commandname)) {
                var command = this.commands[commandname];
                if (command.startsWith(name)) {
                    list.push(command);
                }
            }
        }
        return list;
    };
    Chat.CommandManager.prototype.displayHTML = function(panel,list) {
        if (list.length > 0) {
            panel.style.display = 'block';
            var _setHTML = function(tbody){
                for (var i = 0; i < list.length; i++) {
                    var command = list[i];
                    var tr = document.createElement('tr');
                    tr.innerHTML = '<td>'+command.toArray().join('<\/td><td>')+'<\/td>';
                    tbody.appendChild(tr);
                }
            };
            if (panel.children.length==0) {
                var __table = document.createElement('table');
                var __thead = document.createElement('thead');
                __thead.innerHTML = '<tr><th>Command</th><th>Aliases</th><th>Description</th></tr>';
                var __tbody = document.createElement('tbody');
                __table.appendChild(__thead);
                __table.appendChild(__tbody);
                _setHTML(__tbody);
            } else {
                _setHTML(panel.querySelector('tbody'));
            }
        }
    };
    Chat.CommandManager.prototype.execute = function(value) {
        var index = value.indexOf(' ');
        var name = "";
        var args = "";
        if (index > 0) {
            name = value.substring(0,index);
            args = value.substring(index+1);
        }
        if (name.charAt(0)!='/') return false;
        name = name.substring(1);
        if (typeof this.commands[name] === 'undefined') return false;
        try {
            this.commands[name].execute(args);
        } catch (e) {
            this.logger.fatal("an error occurred during the execution of the command : ");
            console.error(e);
        }
        return true;
    };
    Chat.CommandManager.prototype.register = function(name,help,callback) {
        var c = callback.bind(this);
        this.commands[name] = new Chat.Command(name,help,c);
        return this.commands[name];
    };
    Chat.CommandManager.prototype.unregister = function(name) {
        this.commands[name] = null;
        delete this.commands[name];
    };
    Chat.Tracker = function(id) {
        var farthat = this;
        this.tracker = Tracker.get("addEventListener");
        this.id = id;
    };
    Chat.Tracker.prototype.getElement = function() {
        return document.getElementById(this.id);
    };
    Chat.Tracker.prototype.attach = function(name,c) {
        var farthat = this;
        var d = c.bind(this);
        this.tracker.register(
            new Tracker.Handler()
            .setParser(function(){
                return ["name","callback"];
            })
            .setFilter(function(target,that,args){
                if (args.data.length < 1) return false;
                return that.id==farthat.id && args.data.name==name;
            })
            .setAction(function(target,that,args){
                var fn = args.data.callback;
                args.data.callback = function(e) {
                    var rt = d(fn,e);
                    if (typeof rt === 'undefined' || (typeof rt === 'boolean' && rt)) {
                        fn(e);
                    }
                };
            })
        );
    };



    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |             KEYMAPPER CLASS              |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    function KeyMap(id,code,down,up) {
        this.id = id;
        this.code = code;
        this.down = typeof down === 'function' ? down : function(){};
        this.up = typeof up === 'function' ? up : function(){};
    }


    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |              KEYBINDS CLASS              |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var KeyBinds = (function(){

        function KeyBinds(locationName) {
            this.locationName = locationName;
            this.keysmap = {};
            this.data = {};
            this.defaultdata = {};
        }
        KeyBinds.prototype.addKeyMap = function(keyMap) {
            if (typeof this.data[keyMap.id] === 'undefined') {
                this.keysmap[keyMap.code] = keyMap;
                this.data[keyMap.id] = keyMap.code;
                this.defaultdata[keyMap.id] = keyMap.code;
            } else {
                this.keysmap[this.data[keyMap.id]].down = keyMap.down;
                this.keysmap[this.data[keyMap.id]].up = keyMap.up;
                this.defaultdata[keyMap.id] = keyMap.code;
            }
        }
        KeyBinds.prototype.forwardDown = function(code,event) {
            if (typeof this.keysmap[code] !== 'undefined') this.keysmap[code].down(event);
        };
        KeyBinds.prototype.forwardUp = function(code,event) {
            if (typeof this.keysmap[code] !== 'undefined') this.keysmap[code].up(event);
        };
        KeyBinds.prototype.getCode = function(id) {
            return this.data[id];
        };
        KeyBinds.prototype.setCode = function(id,code) {
            var keyMap = this.keysmap[this.data[id]];
            keyMap.code = code;
            delete this.keysmap[this.data[id]];
            this.data[id] = code;
            this.keysmap[code] = keyMap;
        };
        KeyBinds.prototype.reset = function(id) {
            if (typeof this.defaultdata[id] === 'undefined') return;
            this.setCode(id,this.defaultdata[id]);
        };
        KeyBinds.prototype.serialize = function() {
            return JSON.stringify(this.data);
        };
        KeyBinds.prototype.save = function() {
            window.localStorage.setItem(this.locationName,this.serialize());
        };
        KeyBinds.prototype.load = function() {
            var desc = window.localStorage.getItem(this.locationName);
            if (desc) {
                desc = JSON.parse(desc);
                var y;
                for (y in desc) {
                    if (desc[y] != null && Number.isInteger(desc[y])) {
                        this.addKeyMap(new KeyMap(y,desc[y],null,null));
                    }
                }
            }
        };

        function createHTMLkeybinds(title,keyMap) {
            var id = keyMap.id;
            var tr = document.createElement('tr');
            var td_title = document.createElement('td');
            td_title.innerHTML = title;
            td_title.setAttribute("colspan", "3");
            var td_btn = document.createElement('td');
            var btn = document.createElement('button');
            btn.className = 'flamm-keybinds-btn';
            btn.id = id;
            btn.style.cssText = 'border-radius: 5px;width: 65px;height: 20px;border: 1px solid #a9a9a9;';
            btn.innerHTML = round(id);
            btn.onclick = function() {
                this.classList.add('flamm-keybinds-btn-selected');
                this.style.backgroundColor = 'rgba(255,40,40,.9)';
                flagselected = true;
            };
            td_btn.appendChild(btn);
            tr.appendChild(td_title);
            tr.appendChild(td_btn);
            return tr;
        }



        var keyBinds = new KeyBinds('keybinds');

        keyBinds.AddToSection = function(section,title,keyMap) {
            section.appendChild(createHTMLkeybinds(title,keyMap));
        };
        keyBinds.CreateSection = function(name) {
            var table = document.createElement('table');
            table.className = 'options-table';
            table.style.cssText = 'margin-top: 20px;';
            var thead = document.createElement('thead');
            var tr_title = document.createElement('tr');
            tr_title.innerHTML = '<th colspan="4">'+name+'</th>';
            thead.appendChild(tr_title);
            table.appendChild(thead);
            var tbody = document.createElement('tbody');
            table.appendChild(tbody);
            document.getElementById('main-hotkeys').getElementsByClassName('options-container')[0].appendChild(table);
            return tbody;
        };

        const tablx = ["", "MOUSE1", "MOUSE2", "MOUSE3", "MOUSE4", "MOUSE5", "HELP", "", "BACK_SPACE", "TAB", "", "", "CLEAR", "ENTER", "ENTER_SPECIAL", "", "SHIFT", "CONTROL", "ALT", "PAUSE", "CAPS_LOCK", "KANA", "EISU", "JUNJA", "FINAL", "HANJA", "", "ESCAPE", "CONVERT", "NONCONVERT", "ACCEPT", "MODECHANGE", "SPACE", "PAGE_UP", "PAGE_DOWN", "END", "HOME", "LEFT", "UP", "RIGHT", "DOWN", "SELECT",
                       "PRINT", "EXECUTE", "PRINTSCREEN", "INSERT", "DELETE", "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "AT", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
                       "V", "W", "X", "Y", "Z", "OS_KEY", "", "CONTEXT_MENU", "", "SLEEP", "NUMPAD0", "NUMPAD1", "NUMPAD2", "NUMPAD3", "NUMPAD4", "NUMPAD5", "NUMPAD6", "NUMPAD7", "NUMPAD8", "NUMPAD9", "MULTIPLY", "ADD", "SEPARATOR", "SUBTRACT", "DECIMAL", "DIVIDE", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16",
                       "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "", "", "", "", "", "", "", "", "NUM_LOCK", "SCROLL_LOCK", "WIN_OEM_FJ_JISHO", "WIN_OEM_FJ_MASSHOU", "WIN_OEM_FJ_TOUROKU", "WIN_OEM_FJ_LOYA", "WIN_OEM_FJ_ROYA", "", "", "", "", "", "", "", "", "", "CIRCUMFLEX", "EXCLAMATION", "DOUBLE_QUOTE", "HASH", "DOLLAR", "PERCENT", "AMPERSAND", "UNDERSCORE", "OPEN_PAREN", "CLOSE_PAREN", "ASTERISK", "PLUS", "PIPE", "HYPHEN_MINUS",
                       "OPEN_CURLY_BRACKET", "CLOSE_CURLY_BRACKET", "TILDE", "", "", "", "", "VOLUME_MUTE", "VOLUME_DOWN", "VOLUME_UP", "", "", "SEMICOLON", "EQUALS", "COMMA", "MINUS", "PERIOD", "SLASH", "BACK_QUOTE", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "OPEN_BRACKET", "BACK_SLASH", "CLOSE_BRACKET", "QUOTE", "",
                       "META", "ALTGR", "", "WIN_ICO_HELP", "WIN_ICO_00", "", "WIN_ICO_CLEAR", "", "", "WIN_OEM_RESET", "WIN_OEM_JUMP", "WIN_OEM_PA1", "WIN_OEM_PA2", "WIN_OEM_PA3", "WIN_OEM_WSCTRL", "WIN_OEM_CUSEL", "WIN_OEM_ATTN", "WIN_OEM_FINISH", "WIN_OEM_COPY", "WIN_OEM_AUTO", "WIN_OEM_ENLW", "WIN_OEM_BACKTAB", "ATTN", "CRSEL", "EXSEL", "EREOF", "PLAY", "ZOOM", "", "PA1", "WIN_OEM_CLEAR", ""];

        var flagselected = false;
        var combineArrayVals = false;
        function round(num) {
            return num > 0 ? tablx[num].toUpperCase() : "&nbsp;";
        }
        function next(selector) {
            var y = keyBinds.getCode(selector.id);
            selector.innerHTML = round(y);
        }
        function animate(elem,props,timeout,fn) {
            if (elem.__fisanimated) {
                clearInterval(elem.__fisanimated);
                elem.__fisanimated = false;
                delete elem.__fisanimated;
            }
            var start = Date.now();
            var dt = 1000/30;
            var dxs = {};
            for (var keyd in props) {
                dxs[keyd] = (props[keyd]-parseFloat(elem.style[keyd])) / (timeout/dt);
            }
            elem.__fisanimated = setInterval(function(){
                if (Date.now() - start > timeout) {
                    try {
                        clearInterval(elem.__fisanimated);
                        elem.__fisanimated = false;
                        delete elem.__fisanimated;
                        for (var key in props) {
                            elem.style[key] = props[key];
                        }
                        if (typeof fn === 'function') fn();
                    }catch(e){}
                } else {
                    for (var keyg in props) {
                        elem.style[keyg] = parseFloat(elem.style[keyg])+dxs[keyg];
                    }
                }
            },dt);
        }
        function get(elem) {
            if (elem.style.display == "none") {
                elem.style.display = 'block';
                animate(elem,{opacity:1},500);
            }
        }
        function debug(node) {
            if (node.style.display == "block" && node.style.opacity == 1) {
                animate(node,{opacity:0},500,function(){
                    node.style.display = 'none';
                });
            }
        }
        function unwrap(obj) {
            if (obj.style.display == "block" && obj.style.opacity == 1) {
                debug(obj);
            } else {
                if (obj.style.display == "none") {
                    get(obj);
                }
            }
        }
        function constructor(val) {
            var locationMap = document.getElementsByClassName('keybinds-btn-selected');
            var locationMapExtended = document.getElementsByClassName('flamm-keybinds-btn-selected');
            flagselected = false;
            if (locationMap.length == 0 && locationMapExtended.length == 0) {
                return;
            }
            var v = Array.from(locationMap.length != 0 ? locationMap : locationMapExtended);
            var values = v[0];
            for (var i = 0; i < v.length; i++) {
                v[i].style.backgroundColor = '';
                v[i].classList.remove('keybinds-btn-selected','flamm-keybinds-btn-selected');
            }
            if (val != 27) {
                keyBinds.setCode(values.id,val);
            } else {
                keyBinds.setCode(values.id,-1);
            }
            next(values);
        }



        new DirtyObserver(window).once(function(target,value){
            window.onkeydown = function(event){
                var code = event.which || event.keyCode || event.charCode;
                if (code <= 5) {
                    return;
                }
                if (flagselected) {
                    constructor(code);
                    event.preventDefault();
                    return;
                }
                if (document.activeElement.tagName.toLowerCase()=='input') return;
                if (code == 27) {
                    unwrap(document.getElementById('main'));
                    if (document.getElementById('popup-profile').style.display === 'none' || document.getElementById('popup-account-username').style.display === 'none') {
                        debug(document.getElementById('popup-profile'));
                        debug(document.getElementById('popup-account-username'));
                    }
                }
                if (document.getElementById('main').style.display != "none") {
                    return;
                }
                keyBinds.forwardDown(code,event);
            };
        }).waitFor("onkeydown","function");
        new DirtyObserver(window).once(function(target,value){
            window.onkeyup = function(event){
                var code = event.which || event.keyCode || event.charCode;
                keyBinds.forwardUp(code,event);
            };
        }).waitFor("onkeyup","function");
        new DirtyObserver(window).once(function(target,value){
            window.onmousedown = function(event){
                var code = event.button + 1;
                if (flagselected) {
                    constructor(code);
                    event.preventDefault();
                    return;
                }
                if (document.activeElement.tagName.toLowerCase()=='input' || document.getElementById('main').style.display != "none") {
                    return;
                }
                keyBinds.forwardDown(code,event);
            };
        }).waitFor("onmousedown","function");
        new DirtyObserver(window).once(function(target,value){
            window.onmouseup = function(event){
                var code = event.button + 1;
                keyBinds.forwardUp(code,event);
            };
        }).waitFor("onmouseup","function");

        document.addEventListener('DOMContentLoaded', function(event) {

            var i;
            var setflag = function() {
                flagselected = true;
            };
            var keybindsbtn = document.getElementsByClassName('keybinds-btn');
            for (i = 0; i < keybindsbtn.length; i++) {
                keybindsbtn[i].addEventListener('click',setflag);
            }

            var unload_handler = null;
            var intervalid = setInterval(function(){
                if (typeof $._data( window, 'events' ) === 'undefined') return;
                try {
                    clearInterval(intervalid);
                    new DirtyObserver($._data(window,'events')).once(function(target,value){
                        unload_handler = value;
                        $(window).off('unload');
                    }).waitFor("unload.0.handler");
                } catch(e) {}
            },100);
            window.addEventListener("unload",function(event){
                if (typeof unload_handler === 'function') unload_handler(event);
                keyBinds.save();
            });
            $("#btn-reset-keybinds").on("click", function() {
                $(".keybinds-btn").each(function() {
                    var item = $(this);
                    keyBinds.reset(item.attr("id"));
                });
            });
        });

        keyBinds.load();



        return keyBinds;

    })();



    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |             UTILITY FUNCTION             |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var byteToHex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    function toHex(n) {
        return byteToHex[n >> 4 & 15] + byteToHex[n & 15];
    }

    function colorToHex(color) {
        return '#' + toHex((color >> 16) & 255) + toHex((color >> 8) & 255) + toHex(color & 255);
    }


    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |             STRING PROTOTYPE             |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    String.prototype.hashCode = function() {
        var hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
    String.prototype.byteLength = function() {
        var str = this;
        var s = str.length;
        for (var i=str.length-1; i>=0; i--) {
            var code = str.charCodeAt(i);
            if (code > 0x7f && code <= 0x7ff) s++;
            else if (code > 0x7ff && code <= 0xffff) s+=2;
            if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
        }
        return s;
    };
    String.prototype.toBytes = function() {
        var str = this;
        var bytesv2 = []; // char codes
        for (var i = 0; i < str.length; ++i) {
            var code = str.charCodeAt(i);
            bytesv2 = bytesv2.concat([code & 0xff, code / 256 >>> 0]);
        }
        return bytesv2;
    };



    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |               LOGGER CLASS               |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var RemoteLogger = function(url) {
        this.ws = (typeof url === 'boolean' || typeof url === 'string') ? new WebSocket(typeof url === 'boolean' ? 'ws://127.0.0.1:8080' : url) : null;
        this.queue = [];
    };
    RemoteLogger.prototype.log = function(data) {
        if (this.ws==null) return;
        if (this.ws.readyState == WebSocket.OPEN) {
            while (this.queue.length) this.ws.send(this.queue.shift());
            this.ws.send(data);
        } else if (this.ws.readyState == WebSocket.CONNECTING) {
            this.queue.push(data);
        }
    };
    var Logger = function(options) {
        options = options || {};
        this.flags = options.flags || 0;
        this.subtitle = typeof options.subtitle !== 'undefined' ? options.subtitle.toString().trim() : "";
        this.remote = (typeof options.remote === 'boolean' || typeof options.remote === 'string') ? new RemoteLogger(options.remote) : false;
    };
    Logger.table = {
        debug: "#3F3FFF",
        info : "#00CBDD",
        trace: "#A500DD",
        warn : "#F49000",
        error: "#E40A00",
        fatal: "#9E0700"
    };
    Logger.prototype.getStyle = function(color,size) {
        return "background:#090909;color:"+color+";font-size:"+(size||14)+"px;";
    };
    Logger.prototype.set = function(title) {
        this.subtitle = title.toString().trim();
        return this;
    };
    Logger.prototype._build = function(text,color) {
        var textColor = this.getStyle("#FFFFFF",18);
        return [
            "%c[%c"+text+"%c]",
            [
                textColor,
                this.getStyle(color),
                textColor
            ]
        ];
    };
    Logger.prototype._getDefaultStyle = function() {
        return this.getStyle("#DDDDDD");
    };
    Logger.prototype._applyColor = function(data) {
        var that = this;
        var style = [];
        var firstisbracket = false;
        var index = 0;
        var message = data.join(" ")
        .replace(/\{|\[.+\]|\}/g,function(m,p){
            var isbracket = (m=="{" || m=="}");
            if (p==0) firstisbracket = isbracket;
            style.push(!isbracket ? that.getStyle(m.slice(1,-1)) : that.getStyle("#FFFFFF",18));
            if (m=="}") style.push(that._getDefaultStyle());
            return "%c"+(isbracket?(m=="{"?"[":"]"):"")+(m=="}"?"%c":"");
        });
        return [
            message,
            style,
            firstisbracket
        ];
    };
    // TODO?
    Logger.prototype._log = function(data,level) {
        if (this.remote) {
            this.remote.log(data[0]);
            return;
        }
        var minionText = this._build("Minion","#FF0000");
        var levelText = this._build(level,Logger.table[level]);
        var colored = this._applyColor(data);
        var isfirstbracket = colored[2];
        var message = minionText.shift()+levelText.shift()+"%c"+(this.subtitle!=""?("::"+this.subtitle):"")+"%c"+(isfirstbracket?"":" ")+colored.shift()+"%c";
        var logdata = [message].concat(minionText.shift(),levelText.shift(),[this.getStyle("#FFFFFF",10)],[this._getDefaultStyle()],colored.shift(),[this._getDefaultStyle()]);
        console.log.apply(null,logdata);
    };
    for (var level in Logger.table) {
        if (Object.hasOwnProperty.call(Logger.table, level)) {
            (function(level){
                Logger.prototype[level] = function() {
                    this._log(Array.from(arguments),level);
                };
            })(level);
        }
    }







    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |         CONNECTIONHANDLER CLASS          |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var ConnectionHandler = function(endpoint,maxconnections) {
        this.endpoint = endpoint || "";
        this.connectionUsed = 0;
        this.maxConnections = maxconnections || 3;
    };
    ConnectionHandler.prototype.push = function() {
        if (this.connectionUsed >= this.maxConnections) return false;
        this.connectionUsed++;
        return true;
    };
    ConnectionHandler.prototype.pop = function() {
        if (this.connectionUsed <= 0) {
            this.connectionUsed = 0;
            return false;
        }
        this.connectionUsed--;
        return true;
    };
    ConnectionHandler.prototype.remainingConnections = function() {
        return this.maxConnections-this.connectionUsed;
    };

    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |         CONNECTIONMANAGER CLASS          |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var ConnectionManager = function() {
        this.connectionHandlers = {};
    };
    ConnectionManager.prototype.add = function(endpoint,maxconnections) {
        if (typeof this.connectionHandlers[endpoint] !== 'undefined') throw new Error('already exist');
        this.connectionHandlers[endpoint] = new ConnectionHandler(endpoint,maxconnections);
    };
    ConnectionManager.prototype.remove = function(endpoint) {
        if (typeof this.connectionHandlers[endpoint] === 'undefined') throw new Error('not exist');
        this.connectionHandlers[endpoint] = null;
        delete this.connectionHandlers[endpoint];
    };
    ConnectionManager.prototype.getConnection = function() {
        var data = [];
        var index = 0;
        var keys = Object.keys(this.connectionHandlers);
        for (var key in this.connectionHandlers) {
            if (Object.hasOwnProperty.call(this.connectionHandlers, key)) {
                var handler = this.connectionHandlers[key];
                var r = handler.remainingConnections();
                while (r--) data.push(index);
                index++;
            }
        }
        if (data.length==0) return null;
        var h = this.connectionHandlers[keys[data[Math.floor(Math.random()*data.length)]]];
        h.push();
        return h.endpoint;
    };
    ConnectionManager.prototype.removeConnection = function(endpoint) {
        if (typeof this.connectionHandlers[endpoint] === 'undefined') throw new Error('not exist');
        this.connectionHandlers[endpoint].pop();
    };
































    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |            ACTION SOCKET GOTA            |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    // function to send over a observed socket or a simple socket
    var send = function(socket,b) {
        if (socket.readyState !== 1) return;
        if (typeof socket.oldsend === 'function') socket.oldsend(b);
        else socket.send(b);
    };

    var readData = function(evt,_fn) {
        var data = evt.data;
        try {
            var test = JSON.parse(data);
            _fn(test);
        } catch(e) {
            if (data instanceof Blob) {
                var arrayBuffer;
                var fileReader = new FileReader();
                fileReader.onload = function(event) {
                    arrayBuffer = event.target.result;
                    _fn(arrayBuffer);
                };
                fileReader.readAsArrayBuffer(data);
            } else if (data instanceof ArrayBuffer) {
                _fn(data);
            }
        }
    };

    window.speed_s = 100;
    window.speed_c = 8;
    window.s = function(c,s) {
    window.speed_s = c;
    window.speed_c = s;
    };

    // list of actions that a gota socket can do
    var Actions = {
        moveto: function(socket,x,y) {
            var b = new ArrayBuffer(9);
            var v = new DataView(b);
            v.setInt8(0,16,true);
            v.setInt32(1,x,true);
            v.setInt32(5,y,true);
            send(socket,b);
        },
        ping: function(socket) {
            if (socket.url.includes("gota.io")) {
                var b = new ArrayBuffer(1);
                var v = new DataView(b);
                v.setInt8(0,71,true);
                send(socket,b);
            } else {
                send(socket,"0");
            }
        },
        verify: function(socket,c) {
            window.oldgrecaptchaexec(apikey, {action: 'login'}).then(function(token) {
                var b = new ArrayBuffer(token.length+2);
                var v = new DataView(b);
                v.setUint8(0,100,true);
                for (var i = 0; i < token.length; i++) {
                    v.setUint8(1+i,token.charCodeAt(i),true);
                }
                send(socket,b);
                if (typeof c === 'function') c(socket);
            });
        },
        handshake: function(socket) {
            var d = Array.from("\u0006Gota Web " + (version || "3.6.4") + "\u0000").map(x => x.charCodeAt(0));
            var b = new ArrayBuffer(1+d.length);
            var v = new DataView(b);
            v.setInt8(0,-1,true);
            for (var i = 0; i < d.length; i++) {
                v.setUint8(1+i,d[i],true);
            }
            send(socket,b);
            Actions.ping(socket);
            var d2 = Array.from("hd\u0000").map(x => x.charCodeAt(0));
            var b2 = new ArrayBuffer(d2.length);
            var v2 = new DataView(b2);
            for (var i2 = 0; i2 < d2.length; i2++) {
                v2.setUint8(i2,d2[i2],true);
            }
            send(socket,b2);
        },
        sendnickname: function(socket,nickname) {
            var bytes = nickname.toBytes();
            var l = 1+bytes.length+3-(bytes[bytes.length-1]==0?1:0);
            var b = new ArrayBuffer(l+(l%2!=0?1:0));
            var v = new DataView(b);
            v.setUint8(0,0,true);
            for (var i = 0; i < bytes.length; i++) {
                v.setUint8(1+i,bytes[i],true);
            }
            send(socket,b);
        },
        split: function(socket) {
            var b = new ArrayBuffer(1);
            var v = new DataView(b);
            v.setInt8(0,17,true);
            send(socket,b);
        },
        spectate: function(socket) {
            var b = new ArrayBuffer(1);
            var v = new DataView(b);
            v.setInt8(0,18,true);
            send(socket,b);
        },
        ejectstart: function(socket) {
            var b = new ArrayBuffer(1);
            var v = new DataView(b);
            v.setInt8(0,3,true);
            send(socket,b);
        },
        ejectend: function(socket) {
            var b = new ArrayBuffer(1);
            var v = new DataView(b);
            v.setInt8(0,4,true);
            send(socket,b);
        },
        forwardsplit: function(socket,mass) {

            var s = window.speed_s;
            var c = window.speed_c;

            if (mass <= 3000) {
                s = 1;
                c = 4;
            } else if (mass <= 6000) {
                s = 1;
                c = 5;
            } else if (mass <= 14000) {
                s = 100;
                c = 6;
            } else if (mass <= 18000) {
                s = 80;
                c = 6;
            } else if (mass <= 20000) {
                s = 80;
                c = 7;
            } else if (mass <= 37000) {
                s = 100;
                c = 7;
            } else if (mass <= 40000) {
                s = 80;
                c = 8;
            }

            if (socket!=null) {
                var solosplit_count = 0;
                var solosplit_interval = setInterval(function(){
                    Actions.split(socket);
                    solosplit_count++;
                    Actions.ejectstart(socket);
                    if (solosplit_count==c) {
                        clearInterval(solosplit_interval);
                        setTimeout(function(){
                            Actions.ejectend(socket);
                        },2000);
                    }
                },s);
                Actions.ejectstart(socket);
            }
        },
        teamcreate: function(socket,id) {
            var b = new ArrayBuffer(6);
            var v = new DataView(b);
            v.setInt8(0,40,true);
            v.setInt16(2,id,true);
            send(socket,b);
        },
        teampublic: function(socket) {
            var b = new ArrayBuffer(6);
            var v = new DataView(b);
            v.setInt8(0,40,true);
            v.setInt8(1,4,true);
            send(socket,b);
        },
        teamjoin: function(socket,code) {
            if (code=="") return;
            var b = new ArrayBuffer(1+code.length+1);
            var v = new DataView(b);
            v.setInt8(0,42,true);
            for (var i = 0; i < code.length; i++) {
                v.setUint8(1+i,code.charCodeAt(i),true);
            }
            send(socket,b);
        }
    };







    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |  TINYCOLOR V1.4.2 (BY Brian Grinstead)   |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    // TinyColor v1.4.2
    // https://github.com/bgrins/TinyColor
    // Brian Grinstead, MIT License
    var tinycolor = (function(Math) {

        var trimLeft = /^\s+/,
            trimRight = /\s+$/,
            mathRound = Math.round,
            mathMin = Math.min,
            mathMax = Math.max,
            mathRandom = Math.random;

        function tinycolor (color, opts) {

            color = (color) ? color : '';
            opts = opts || { };

            // If input is already a tinycolor, return itself
            if (color instanceof tinycolor) {
                return color;
            }
            // If we are called as a function, call using new instead
            if (!(this instanceof tinycolor)) {
                return new tinycolor(color, opts);
            }

            var rgb = inputToRGB(color);
            this._originalInput = color;
            this._r = rgb.r;
            this._g = rgb.g;
            this._b = rgb.b;
            this._a = rgb.a;
            this._roundA = mathRound(100*this._a) / 100;
            this._format = opts.format || rgb.format;
            this._gradientType = opts.gradientType;

            // Don't let the range of [0,255] come back in [0,1].
            // Potentially lose a little bit of precision here, but will fix issues where
            // .5 gets interpreted as half of the total, instead of half of 1
            // If it was supposed to be 128, this was already taken care of by `inputToRgb`
            if (this._r < 1) { this._r = mathRound(this._r); }
            if (this._g < 1) { this._g = mathRound(this._g); }
            if (this._b < 1) { this._b = mathRound(this._b); }

            this._ok = rgb.ok;
        }

        tinycolor.prototype = {
            isDark: function() {
                return this.getBrightness() < 128;
            },
            isLight: function() {
                return !this.isDark();
            },
            isValid: function() {
                return this._ok;
            },
            getOriginalInput: function() {
                return this._originalInput;
            },
            getFormat: function() {
                return this._format;
            },
            getAlpha: function() {
                return this._a;
            },
            getBrightness: function() {
                //http://www.w3.org/TR/AERT#color-contrast
                var rgb = this.toRgb();
                return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
            },
            getLuminance: function() {
                //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
                var rgb = this.toRgb();
                var RsRGB, GsRGB, BsRGB, R, G, B;
                RsRGB = rgb.r/255;
                GsRGB = rgb.g/255;
                BsRGB = rgb.b/255;

                if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
                if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
                if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
                return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
            },
            setAlpha: function(value) {
                this._a = boundAlpha(value);
                this._roundA = mathRound(100*this._a) / 100;
                return this;
            },
            toHsv: function() {
                var hsv = rgbToHsv(this._r, this._g, this._b);
                return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
            },
            toHsvString: function() {
                var hsv = rgbToHsv(this._r, this._g, this._b);
                var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
                return (this._a == 1) ?
                    "hsv(" + h + ", " + s + "%, " + v + "%)" :
                "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
            },
            toHsl: function() {
                var hsl = rgbToHsl(this._r, this._g, this._b);
                return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
            },
            toHslString: function() {
                var hsl = rgbToHsl(this._r, this._g, this._b);
                var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
                return (this._a == 1) ?
                    "hsl(" + h + ", " + s + "%, " + l + "%)" :
                "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
            },
            toHex: function(allow3Char) {
                return rgbToHex(this._r, this._g, this._b, allow3Char);
            },
            toHexString: function(allow3Char) {
                return '#' + this.toHex(allow3Char);
            },
            toHex8: function(allow4Char) {
                return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
            },
            toHex8String: function(allow4Char) {
                return '#' + this.toHex8(allow4Char);
            },
            toRgb: function() {
                return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
            },
            toRgbString: function() {
                return (this._a == 1) ?
                    "rgb(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
                "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
            },
            toPercentageRgb: function() {
                return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
            },
            toPercentageRgbString: function() {
                return (this._a == 1) ?
                    "rgb(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
                "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
            },
            toName: function() {
                if (this._a === 0) {
                    return "transparent";
                }

                if (this._a < 1) {
                    return false;
                }

                return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
            },
            toFilter: function(secondColor) {
                var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
                var secondHex8String = hex8String;
                var gradientType = this._gradientType ? "GradientType = 1, " : "";

                if (secondColor) {
                    var s = tinycolor(secondColor);
                    secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
                }

                return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
            },
            toString: function(format) {
                var formatSet = !!format;
                format = format || this._format;

                var formattedString = false;
                var hasAlpha = this._a < 1 && this._a >= 0;
                var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

                if (needsAlphaFormat) {
                    // Special case for "transparent", all other non-alpha formats
                    // will return rgba when there is transparency.
                    if (format === "name" && this._a === 0) {
                        return this.toName();
                    }
                    return this.toRgbString();
                }
                if (format === "rgb") {
                    formattedString = this.toRgbString();
                }
                if (format === "prgb") {
                    formattedString = this.toPercentageRgbString();
                }
                if (format === "hex" || format === "hex6") {
                    formattedString = this.toHexString();
                }
                if (format === "hex3") {
                    formattedString = this.toHexString(true);
                }
                if (format === "hex4") {
                    formattedString = this.toHex8String(true);
                }
                if (format === "hex8") {
                    formattedString = this.toHex8String();
                }
                if (format === "name") {
                    formattedString = this.toName();
                }
                if (format === "hsl") {
                    formattedString = this.toHslString();
                }
                if (format === "hsv") {
                    formattedString = this.toHsvString();
                }

                return formattedString || this.toHexString();
            },
            clone: function() {
                return tinycolor(this.toString());
            },

            _applyModification: function(fn, args) {
                var color = fn.apply(null, [this].concat([].slice.call(args)));
                this._r = color._r;
                this._g = color._g;
                this._b = color._b;
                this.setAlpha(color._a);
                return this;
            },
            lighten: function() {
                return this._applyModification(lighten, arguments);
            },
            brighten: function() {
                return this._applyModification(brighten, arguments);
            },
            darken: function() {
                return this._applyModification(darken, arguments);
            },
            desaturate: function() {
                return this._applyModification(desaturate, arguments);
            },
            saturate: function() {
                return this._applyModification(saturate, arguments);
            },
            greyscale: function() {
                return this._applyModification(greyscale, arguments);
            },
            spin: function() {
                return this._applyModification(spin, arguments);
            },

            _applyCombination: function(fn, args) {
                return fn.apply(null, [this].concat([].slice.call(args)));
            },
            analogous: function() {
                return this._applyCombination(analogous, arguments);
            },
            complement: function() {
                return this._applyCombination(complement, arguments);
            },
            monochromatic: function() {
                return this._applyCombination(monochromatic, arguments);
            },
            splitcomplement: function() {
                return this._applyCombination(splitcomplement, arguments);
            },
            triad: function() {
                return this._applyCombination(triad, arguments);
            },
            tetrad: function() {
                return this._applyCombination(tetrad, arguments);
            }
        };

        // If input is an object, force 1 into "1.0" to handle ratios properly
        // String input requires "1.0" as input, so 1 will be treated as 1
        tinycolor.fromRatio = function(color, opts) {
            if (typeof color == "object") {
                var newColor = {};
                for (var i in color) {
                    if (color.hasOwnProperty(i)) {
                        if (i === "a") {
                            newColor[i] = color[i];
                        }
                        else {
                            newColor[i] = convertToPercentage(color[i]);
                        }
                    }
                }
                color = newColor;
            }

            return tinycolor(color, opts);
        };

        // Given a string or object, convert that input to RGB
        // Possible string inputs:
        //
        //     "red"
        //     "#f00" or "f00"
        //     "#ff0000" or "ff0000"
        //     "#ff000000" or "ff000000"
        //     "rgb 255 0 0" or "rgb (255, 0, 0)"
        //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
        //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
        //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
        //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
        //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
        //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
        //
        function inputToRGB(color) {

            var rgb = { r: 0, g: 0, b: 0 };
            var a = 1;
            var s = null;
            var v = null;
            var l = null;
            var ok = false;
            var format = false;

            if (typeof color == "string") {
                color = stringInputToObject(color);
            }

            if (typeof color == "object") {
                if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
                    rgb = rgbToRgb(color.r, color.g, color.b);
                    ok = true;
                    format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
                }
                else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
                    s = convertToPercentage(color.s);
                    v = convertToPercentage(color.v);
                    rgb = hsvToRgb(color.h, s, v);
                    ok = true;
                    format = "hsv";
                }
                else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
                    s = convertToPercentage(color.s);
                    l = convertToPercentage(color.l);
                    rgb = hslToRgb(color.h, s, l);
                    ok = true;
                    format = "hsl";
                }

                if (color.hasOwnProperty("a")) {
                    a = color.a;
                }
            }

            a = boundAlpha(a);

            return {
                ok: ok,
                format: color.format || format,
                r: mathMin(255, mathMax(rgb.r, 0)),
                g: mathMin(255, mathMax(rgb.g, 0)),
                b: mathMin(255, mathMax(rgb.b, 0)),
                a: a
            };
        }


        // Conversion Functions
        // --------------------

        // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
        // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

        // `rgbToRgb`
        // Handle bounds / percentage checking to conform to CSS color spec
        // <http://www.w3.org/TR/css3-color/>
        // *Assumes:* r, g, b in [0, 255] or [0, 1]
        // *Returns:* { r, g, b } in [0, 255]
        function rgbToRgb(r, g, b){
            return {
                r: bound01(r, 255) * 255,
                g: bound01(g, 255) * 255,
                b: bound01(b, 255) * 255
            };
        }

        // `rgbToHsl`
        // Converts an RGB color value to HSL.
        // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
        // *Returns:* { h, s, l } in [0,1]
        function rgbToHsl(r, g, b) {

            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);

            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, l = (max + min) / 2;

            if(max == min) {
                h = s = 0; // achromatic
            }
            else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }

                h /= 6;
            }

            return { h: h, s: s, l: l };
        }

        // `hslToRgb`
        // Converts an HSL color value to RGB.
        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
        // *Returns:* { r, g, b } in the set [0, 255]
        function hslToRgb(h, s, l) {
            var r, g, b;

            h = bound01(h, 360);
            s = bound01(s, 100);
            l = bound01(l, 100);

            function hue2rgb(p, q, t) {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            if(s === 0) {
                r = g = b = l; // achromatic
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return { r: r * 255, g: g * 255, b: b * 255 };
        }

        // `rgbToHsv`
        // Converts an RGB color value to HSV
        // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
        // *Returns:* { h, s, v } in [0,1]
        function rgbToHsv(r, g, b) {

            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);

            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, v = max;

            var d = max - min;
            s = max === 0 ? 0 : d / max;

            if(max == min) {
                h = 0; // achromatic
            }
            else {
                switch(max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return { h: h, s: s, v: v };
        }

        // `hsvToRgb`
        // Converts an HSV color value to RGB.
        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
        // *Returns:* { r, g, b } in the set [0, 255]
        function hsvToRgb(h, s, v) {

            h = bound01(h, 360) * 6;
            s = bound01(s, 100);
            v = bound01(v, 100);

            var i = Math.floor(h),
                f = h - i,
                p = v * (1 - s),
                q = v * (1 - f * s),
                t = v * (1 - (1 - f) * s),
                mod = i % 6,
                r = [v, q, p, p, t, v][mod],
                g = [t, v, v, q, p, p][mod],
                b = [p, p, t, v, v, q][mod];

            return { r: r * 255, g: g * 255, b: b * 255 };
        }

        // `rgbToHex`
        // Converts an RGB color to hex
        // Assumes r, g, and b are contained in the set [0, 255]
        // Returns a 3 or 6 character hex
        function rgbToHex(r, g, b, allow3Char) {

            var hex = [
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];

            // Return a 3 character hex if possible
            if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
                return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
            }

            return hex.join("");
        }

        // `rgbaToHex`
        // Converts an RGBA color plus alpha transparency to hex
        // Assumes r, g, b are contained in the set [0, 255] and
        // a in [0, 1]. Returns a 4 or 8 character rgba hex
        function rgbaToHex(r, g, b, a, allow4Char) {

            var hex = [
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16)),
                pad2(convertDecimalToHex(a))
            ];

            // Return a 4 character hex if possible
            if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
                return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
            }

            return hex.join("");
        }

        // `rgbaToArgbHex`
        // Converts an RGBA color to an ARGB Hex8 string
        // Rarely used, but required for "toFilter()"
        function rgbaToArgbHex(r, g, b, a) {

            var hex = [
                pad2(convertDecimalToHex(a)),
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];

            return hex.join("");
        }

        // `equals`
        // Can be called with any tinycolor input
        tinycolor.equals = function (color1, color2) {
            if (!color1 || !color2) { return false; }
            return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
        };

        tinycolor.random = function() {
            return tinycolor.fromRatio({
                r: mathRandom(),
                g: mathRandom(),
                b: mathRandom()
            });
        };


        // Modification Functions
        // ----------------------
        // Thanks to less.js for some of the basics here
        // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

        function desaturate(color, amount) {
            amount = (amount === 0) ? 0 : (amount || 10);
            var hsl = tinycolor(color).toHsl();
            hsl.s -= amount / 100;
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        }

        function saturate(color, amount) {
            amount = (amount === 0) ? 0 : (amount || 10);
            var hsl = tinycolor(color).toHsl();
            hsl.s += amount / 100;
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        }

        function greyscale(color) {
            return tinycolor(color).desaturate(100);
        }

        function lighten (color, amount) {
            amount = (amount === 0) ? 0 : (amount || 10);
            var hsl = tinycolor(color).toHsl();
            hsl.l += amount / 100;
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        }

        function brighten(color, amount) {
            amount = (amount === 0) ? 0 : (amount || 10);
            var rgb = tinycolor(color).toRgb();
            rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
            rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
            rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
            return tinycolor(rgb);
        }

        function darken (color, amount) {
            amount = (amount === 0) ? 0 : (amount || 10);
            var hsl = tinycolor(color).toHsl();
            hsl.l -= amount / 100;
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        }

        // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
        // Values outside of this range will be wrapped into this range.
        function spin(color, amount) {
            var hsl = tinycolor(color).toHsl();
            var hue = (hsl.h + amount) % 360;
            hsl.h = hue < 0 ? 360 + hue : hue;
            return tinycolor(hsl);
        }

        // Combination Functions
        // ---------------------
        // Thanks to jQuery xColor for some of the ideas behind these
        // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

        function complement(color) {
            var hsl = tinycolor(color).toHsl();
            hsl.h = (hsl.h + 180) % 360;
            return tinycolor(hsl);
        }

        function triad(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
                tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
            ];
        }

        function tetrad(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
                tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
                tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
            ];
        }

        function splitcomplement(color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h;
            return [
                tinycolor(color),
                tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
                tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
            ];
        }

        function analogous(color, results, slices) {
            results = results || 6;
            slices = slices || 30;

            var hsl = tinycolor(color).toHsl();
            var part = 360 / slices;
            var ret = [tinycolor(color)];

            for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
                hsl.h = (hsl.h + part) % 360;
                ret.push(tinycolor(hsl));
            }
            return ret;
        }

        function monochromatic(color, results) {
            results = results || 6;
            var hsv = tinycolor(color).toHsv();
            var h = hsv.h, s = hsv.s, v = hsv.v;
            var ret = [];
            var modification = 1 / results;

            while (results--) {
                ret.push(tinycolor({ h: h, s: s, v: v}));
                v = (v + modification) % 1;
            }

            return ret;
        }

        // Utility Functions
        // ---------------------

        tinycolor.mix = function(color1, color2, amount) {
            amount = (amount === 0) ? 0 : (amount || 50);

            var rgb1 = tinycolor(color1).toRgb();
            var rgb2 = tinycolor(color2).toRgb();

            var p = amount / 100;

            var rgba = {
                r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
                g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
                b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
                a: ((rgb2.a - rgb1.a) * p) + rgb1.a
            };

            return tinycolor(rgba);
        };


        // Readability Functions
        // ---------------------
        // <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

        // `contrast`
        // Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
        tinycolor.readability = function(color1, color2) {
            var c1 = tinycolor(color1);
            var c2 = tinycolor(color2);
            return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
        };

        // `isReadable`
        // Ensure that foreground and background color combinations meet WCAG2 guidelines.
        // The third argument is an optional Object.
        //      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
        //      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
        // If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

        // *Example*
        //    tinycolor.isReadable("#000", "#111") => false
        //    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
        tinycolor.isReadable = function(color1, color2, wcag2) {
            var readability = tinycolor.readability(color1, color2);
            var wcag2Parms, out;

            out = false;

            wcag2Parms = validateWCAG2Parms(wcag2);
            switch (wcag2Parms.level + wcag2Parms.size) {
                case "AAsmall":
                case "AAAlarge":
                    out = readability >= 4.5;
                    break;
                case "AAlarge":
                    out = readability >= 3;
                    break;
                case "AAAsmall":
                    out = readability >= 7;
                    break;
            }
            return out;

        };

        // `mostReadable`
        // Given a base color and a list of possible foreground or background
        // colors for that base, returns the most readable color.
        // Optionally returns Black or White if the most readable color is unreadable.
        // *Example*
        //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
        //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
        //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
        //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
        tinycolor.mostReadable = function(baseColor, colorList, args) {
            var bestColor = null;
            var bestScore = 0;
            var readability;
            var includeFallbackColors, level, size ;
            args = args || {};
            includeFallbackColors = args.includeFallbackColors ;
            level = args.level;
            size = args.size;

            for (var i= 0; i < colorList.length ; i++) {
                readability = tinycolor.readability(baseColor, colorList[i]);
                if (readability > bestScore) {
                    bestScore = readability;
                    bestColor = tinycolor(colorList[i]);
                }
            }

            if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
                return bestColor;
            }
            else {
                args.includeFallbackColors=false;
                return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
            }
        };


        // Big List of Colors
        // ------------------
        // <http://www.w3.org/TR/css3-color/#svg-color>
        var names = tinycolor.names = {
            aliceblue: "f0f8ff",
            antiquewhite: "faebd7",
            aqua: "0ff",
            aquamarine: "7fffd4",
            azure: "f0ffff",
            beige: "f5f5dc",
            bisque: "ffe4c4",
            black: "000",
            blanchedalmond: "ffebcd",
            blue: "00f",
            blueviolet: "8a2be2",
            brown: "a52a2a",
            burlywood: "deb887",
            burntsienna: "ea7e5d",
            cadetblue: "5f9ea0",
            chartreuse: "7fff00",
            chocolate: "d2691e",
            coral: "ff7f50",
            cornflowerblue: "6495ed",
            cornsilk: "fff8dc",
            crimson: "dc143c",
            cyan: "0ff",
            darkblue: "00008b",
            darkcyan: "008b8b",
            darkgoldenrod: "b8860b",
            darkgray: "a9a9a9",
            darkgreen: "006400",
            darkgrey: "a9a9a9",
            darkkhaki: "bdb76b",
            darkmagenta: "8b008b",
            darkolivegreen: "556b2f",
            darkorange: "ff8c00",
            darkorchid: "9932cc",
            darkred: "8b0000",
            darksalmon: "e9967a",
            darkseagreen: "8fbc8f",
            darkslateblue: "483d8b",
            darkslategray: "2f4f4f",
            darkslategrey: "2f4f4f",
            darkturquoise: "00ced1",
            darkviolet: "9400d3",
            deeppink: "ff1493",
            deepskyblue: "00bfff",
            dimgray: "696969",
            dimgrey: "696969",
            dodgerblue: "1e90ff",
            firebrick: "b22222",
            floralwhite: "fffaf0",
            forestgreen: "228b22",
            fuchsia: "f0f",
            gainsboro: "dcdcdc",
            ghostwhite: "f8f8ff",
            gold: "ffd700",
            goldenrod: "daa520",
            gray: "808080",
            green: "008000",
            greenyellow: "adff2f",
            grey: "808080",
            honeydew: "f0fff0",
            hotpink: "ff69b4",
            indianred: "cd5c5c",
            indigo: "4b0082",
            ivory: "fffff0",
            khaki: "f0e68c",
            lavender: "e6e6fa",
            lavenderblush: "fff0f5",
            lawngreen: "7cfc00",
            lemonchiffon: "fffacd",
            lightblue: "add8e6",
            lightcoral: "f08080",
            lightcyan: "e0ffff",
            lightgoldenrodyellow: "fafad2",
            lightgray: "d3d3d3",
            lightgreen: "90ee90",
            lightgrey: "d3d3d3",
            lightpink: "ffb6c1",
            lightsalmon: "ffa07a",
            lightseagreen: "20b2aa",
            lightskyblue: "87cefa",
            lightslategray: "789",
            lightslategrey: "789",
            lightsteelblue: "b0c4de",
            lightyellow: "ffffe0",
            lime: "0f0",
            limegreen: "32cd32",
            linen: "faf0e6",
            magenta: "f0f",
            maroon: "800000",
            mediumaquamarine: "66cdaa",
            mediumblue: "0000cd",
            mediumorchid: "ba55d3",
            mediumpurple: "9370db",
            mediumseagreen: "3cb371",
            mediumslateblue: "7b68ee",
            mediumspringgreen: "00fa9a",
            mediumturquoise: "48d1cc",
            mediumvioletred: "c71585",
            midnightblue: "191970",
            mintcream: "f5fffa",
            mistyrose: "ffe4e1",
            moccasin: "ffe4b5",
            navajowhite: "ffdead",
            navy: "000080",
            oldlace: "fdf5e6",
            olive: "808000",
            olivedrab: "6b8e23",
            orange: "ffa500",
            orangered: "ff4500",
            orchid: "da70d6",
            palegoldenrod: "eee8aa",
            palegreen: "98fb98",
            paleturquoise: "afeeee",
            palevioletred: "db7093",
            papayawhip: "ffefd5",
            peachpuff: "ffdab9",
            peru: "cd853f",
            pink: "ffc0cb",
            plum: "dda0dd",
            powderblue: "b0e0e6",
            purple: "800080",
            rebeccapurple: "663399",
            red: "f00",
            rosybrown: "bc8f8f",
            royalblue: "4169e1",
            saddlebrown: "8b4513",
            salmon: "fa8072",
            sandybrown: "f4a460",
            seagreen: "2e8b57",
            seashell: "fff5ee",
            sienna: "a0522d",
            silver: "c0c0c0",
            skyblue: "87ceeb",
            slateblue: "6a5acd",
            slategray: "708090",
            slategrey: "708090",
            snow: "fffafa",
            springgreen: "00ff7f",
            steelblue: "4682b4",
            tan: "d2b48c",
            teal: "008080",
            thistle: "d8bfd8",
            tomato: "ff6347",
            turquoise: "40e0d0",
            violet: "ee82ee",
            wheat: "f5deb3",
            white: "fff",
            whitesmoke: "f5f5f5",
            yellow: "ff0",
            yellowgreen: "9acd32"
        };

        // Make it easy to access colors via `hexNames[hex]`
        var hexNames = tinycolor.hexNames = flip(names);


        // Utilities
        // ---------

        // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
        function flip(o) {
            var flipped = { };
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    flipped[o[i]] = i;
                }
            }
            return flipped;
        }

        // Return a valid alpha value [0,1] with all invalid values being set to 1
        function boundAlpha(a) {
            a = parseFloat(a);

            if (isNaN(a) || a < 0 || a > 1) {
                a = 1;
            }

            return a;
        }

        // Take input from [0, n] and return it as [0, 1]
        function bound01(n, max) {
            if (isOnePointZero(n)) { n = "100%"; }

            var processPercent = isPercentage(n);
            n = mathMin(max, mathMax(0, parseFloat(n)));

            // Automatically convert percentage into number
            if (processPercent) {
                n = parseInt(n * max, 10) / 100;
            }

            // Handle floating point rounding errors
            if ((Math.abs(n - max) < 0.000001)) {
                return 1;
            }

            // Convert into [0, 1] range if it isn't already
            return (n % max) / parseFloat(max);
        }

        // Force a number between 0 and 1
        function clamp01(val) {
            return mathMin(1, mathMax(0, val));
        }

        // Parse a base-16 hex value into a base-10 integer
        function parseIntFromHex(val) {
            return parseInt(val, 16);
        }

        // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
        // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
        function isOnePointZero(n) {
            return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
        }

        // Check to see if string passed in is a percentage
        function isPercentage(n) {
            return typeof n === "string" && n.indexOf('%') != -1;
        }

        // Force a hex value to have 2 characters
        function pad2(c) {
            return c.length == 1 ? '0' + c : '' + c;
        }

        // Replace a decimal with it's percentage value
        function convertToPercentage(n) {
            if (n <= 1) {
                n = (n * 100) + "%";
            }

            return n;
        }

        // Converts a decimal to a hex value
        function convertDecimalToHex(d) {
            return Math.round(parseFloat(d) * 255).toString(16);
        }
        // Converts a hex value to a decimal
        function convertHexToDecimal(h) {
            return (parseIntFromHex(h) / 255);
        }

        var matchers = (function() {

            // <http://www.w3.org/TR/css3-values/#integers>
            var CSS_INTEGER = "[-\\+]?\\d+%?";

            // <http://www.w3.org/TR/css3-values/#number-value>
            var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

            // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
            var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

            // Actual matching.
            // Parentheses and commas are optional, but not required.
            // Whitespace can take the place of commas or opening paren
            var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
            var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

            return {
                CSS_UNIT: new RegExp(CSS_UNIT),
                rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
                rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
                hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
                hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
                hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
                hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
                hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
            };
        })();

        // `isValidCSSUnit`
        // Take in a single string / number and check to see if it looks like a CSS unit
        // (see `matchers` above for definition).
        function isValidCSSUnit(color) {
            return !!matchers.CSS_UNIT.exec(color);
        }

        // `stringInputToObject`
        // Permissive string parsing.  Take in a number of formats, and output an object
        // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
        function stringInputToObject(color) {

            color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
            var named = false;
            if (names[color]) {
                color = names[color];
                named = true;
            }
            else if (color == 'transparent') {
                return { r: 0, g: 0, b: 0, a: 0, format: "name" };
            }

            // Try to match string input using regular expressions.
            // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
            // Just return an object and let the conversion functions handle that.
            // This way the result will be the same whether the tinycolor is initialized with string or object.
            var match;
            if ((match = matchers.rgb.exec(color))) {
                return { r: match[1], g: match[2], b: match[3] };
            }
            if ((match = matchers.rgba.exec(color))) {
                return { r: match[1], g: match[2], b: match[3], a: match[4] };
            }
            if ((match = matchers.hsl.exec(color))) {
                return { h: match[1], s: match[2], l: match[3] };
            }
            if ((match = matchers.hsla.exec(color))) {
                return { h: match[1], s: match[2], l: match[3], a: match[4] };
            }
            if ((match = matchers.hsv.exec(color))) {
                return { h: match[1], s: match[2], v: match[3] };
            }
            if ((match = matchers.hsva.exec(color))) {
                return { h: match[1], s: match[2], v: match[3], a: match[4] };
            }
            if ((match = matchers.hex8.exec(color))) {
                return {
                    r: parseIntFromHex(match[1]),
                    g: parseIntFromHex(match[2]),
                    b: parseIntFromHex(match[3]),
                    a: convertHexToDecimal(match[4]),
                    format: named ? "name" : "hex8"
                };
            }
            if ((match = matchers.hex6.exec(color))) {
                return {
                    r: parseIntFromHex(match[1]),
                    g: parseIntFromHex(match[2]),
                    b: parseIntFromHex(match[3]),
                    format: named ? "name" : "hex"
                };
            }
            if ((match = matchers.hex4.exec(color))) {
                return {
                    r: parseIntFromHex(match[1] + '' + match[1]),
                    g: parseIntFromHex(match[2] + '' + match[2]),
                    b: parseIntFromHex(match[3] + '' + match[3]),
                    a: convertHexToDecimal(match[4] + '' + match[4]),
                    format: named ? "name" : "hex8"
                };
            }
            if ((match = matchers.hex3.exec(color))) {
                return {
                    r: parseIntFromHex(match[1] + '' + match[1]),
                    g: parseIntFromHex(match[2] + '' + match[2]),
                    b: parseIntFromHex(match[3] + '' + match[3]),
                    format: named ? "name" : "hex"
                };
            }

            return false;
        }

        function validateWCAG2Parms(parms) {
            // return valid WCAG2 parms for isReadable.
            // If input parms are invalid, return {"level":"AA", "size":"small"}
            var level, size;
            parms = parms || {"level":"AA", "size":"small"};
            level = (parms.level || "AA").toUpperCase();
            size = (parms.size || "small").toLowerCase();
            if (level !== "AA" && level !== "AAA") {
                level = "AA";
            }
            if (size !== "small" && size !== "large") {
                size = "small";
            }
            return {"level":level, "size":size};
        }

        return tinycolor;

    })(Math);






    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |            DATA READER CLASS             |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var DataReader = (function(){

        function readUint8(reader) {
            var n = reader.view.getUint8(reader.offset);
            reader.offset++;
            return n;
        }
        function readUint16(reader) {
            var n = reader.view.getUint16(reader.offset,true);
            reader.offset+=2;
            return n;
        }
        function readInt16(reader) {
            var n = reader.view.getInt16(reader.offset,true);
            reader.offset+=2;
            return n;
        }

        function readString16(reader) {
            var result = "";
            while (true) {
                var n = readUint16(reader);
                if (n == 0) break;
                result = result + String.fromCharCode(n);
            }
            return result;
        }
        function readString8(reader) {
            var result = "";
            while (true) {
                var n = readUint8(reader);
                if (n == 0) break;
                result = result + String.fromCharCode(n);
            }
            return result;
        }

        function readInt32Color(reader) {
            var color = (reader.view.getUint8(reader.offset) << 16) + (reader.view.getUint8(reader.offset+1) << 8) + reader.view.getUint8(reader.offset+2);
            reader.offset += 3;
            return color;
        }

        var hexDigit = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

        function readHexColor(reader) {
            var color = "#" +
                (hexDigit[reader.view.getUint8(reader.offset) >> 4 & 15] + hexDigit[reader.view.getUint8(reader.offset+1) >> 4 & 15]) +
                (hexDigit[reader.view.getUint8(reader.offset+2) >> 4 & 15] + hexDigit[reader.view.getUint8(reader.offset+3) >> 4 & 15]) +
                (hexDigit[reader.view.getUint8(reader.offset+4) >> 4 & 15] + hexDigit[reader.view.getUint8(reader.offset+5) >> 4 & 15]);
            reader.offset += 6;
            return color;
        }

        function shuffle(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var index = Math.floor(Math.random() * (i + 1));
                var value = array[index];
                array[i] = array[index];
                array[index] = value;
            }
            return array;
        }

        var colorsraw = [];
        var hexcolorsraw = [];
        for (var i = 0; i < 180; i++) {
            var color = tinycolor({
                h : i * 2,
                s : 97.25,
                v : 100
            });
            var rgb = color.toRgb();
            colorsraw[i] = (rgb.r << 16) + (rgb.g << 8) + rgb.b;
            hexcolorsraw[i] = color.toHexString();
        }

        var colors = {
            int32    : shuffle(colorsraw.slice(0)),
            hexString: shuffle(hexcolorsraw.slice(0))
        };

        function colorFromID(id) {
            return colors.int32[id % colors.int32.length];
        }

        function readPlayersData(reader) {
            while (true) {

                var id = readUint16(reader);

                if (id == 0) break; // no data

                var needUpdate = false;
                var isExist = reader.fire(DataReader.Events.PLAYER_IS_EXISTS)(id);
                if (!isExist) {
                    reader.fire(DataReader.Events.PLAYER_CREATE)(id);
                }

                var data = {};
                data.id = id;
                data.color = readInt32Color(reader);
                data.name = readString16(reader);
                data.skin = readString8(reader);
                data.flags = readUint8(reader);

                if ((data.flags & 2) == 2) {
                    data.nameColor = readHexColor(reader);
                    data.parseEffect = readUint8(reader);
                    data.nameFont = readUint8(reader);
                }

                reader.fire(DataReader.Events.PLAYER_UPDATE)(data);

            }
        }

        function readNewCellData(reader,id,type,playerId) {
            var data = {};
            data.id = id;
            data.type = type;
            data.x = readInt16(reader);
            data.y = readInt16(reader);
            data.new_x = data.x;
            data.new_y = data.y;
            data.steps = 0;

            switch(type) {
                case 6:
                    data.color = colorFromID(id);
                    break;
                case 1:
                    data.size = readUint16(reader);
                    data.new_size = data.size;
                    data.color = readInt32Color(reader);
                    var rawSkinData = readUint8(reader);
                    data.skin = (rawSkinData & 127) - 1;
                    data.rainbow = (rawSkinData & 128) == 128;
                    break;
                case 2:
                    data.size = readUint16(reader);
                    data.new_size = data.size;
                    data.playerId = playerId;
                    break;
                case 3:
                    data.size = readUint16(reader);
                    data.new_size = data.size;
                    break;
                case 4:
                    data.size = readUint16(reader);
                    data.new_size = data.size;
                    break;
                case 5:
                    data.size = readUint16(reader);
                    data.new_size = data.size;
                    data.buff = readUint8();
                    break;
            }

            reader.fire(DataReader.Events.CELL_CREATE)(data);
        }

        function readOldCellData(reader,id,type) {

            var data = {};
            data.id = id;
            data.type = type;

            var cell = false;
            if (type == 6) {
                cell = reader.fire(DataReader.Events.CELL_FOOD_IS_EXISTS)(id);
            } else {
                cell = reader.fire(DataReader.Events.CELL_BUCKET_IS_EXISTS)(id);
            }

            data.new_x = readInt16(reader);
            data.new_y = readInt16(reader);

            if (!cell) {
                data.size = 10;
                data.new_size = data.size;
                data.x = data.new_x;
                data.y = data.new_y;
                reader.fire(DataReader.Events.CELL_CREATE)(data);
            }

            switch(type) {
                case 2:
                    data.new_size = readUint16(reader);
                    break;
                case 3:
                    data.new_size = readUint16(reader);
                    break;
                case 4:
                    data.new_size = readUint16(reader);
                    break;
            }

            data.steps = 30;

            reader.fire(DataReader.Events.CELL_UPDATE)(data);
        };

        function readNewCellsDataParser(reader) {
            while (true) {

                var type = readUint8(reader);

                if (type == 0) break; // no data

                var playerId = 0;

                while (true) {

                    // If player cell read player id
                    if (type == 2 && playerId == 0) {
                        playerId = readUint16(reader);
                        if (playerId == 0) break; // no data
                    }

                    // read cell id
                    var id = readUint16(reader);
                    if (id == 0) {
                        if (type == 2) {
                            playerId = 0;
                            continue;
                        } else {
                            break;
                        }
                    }

                    readNewCellData(reader,id,type,playerId);

                }

            }
        }

        function readOldCellsDataParser(reader) {
            while (true) {

                var type = readUint8(reader);
                if (type == 0) break; // no data

                while (true) {
                    // read cell id
                    var id = readUint16(reader);
                    if (id == 0) break; // no data

                    readOldCellData(reader,id,type);

                }
            }
        }

        function readCellsData(reader) {
            readNewCellsDataParser(reader);
            readOldCellsDataParser(reader);
        }

        function readRemovePlayer(reader) {
            var amount = readUint16(reader);
            while (amount > 0) {
                var id = readUint16(reader);
                reader.fire(DataReader.Events.PLAYER_DELETE)(id);
                amount--;
            }
        }

        function readRemoveCells(reader) {
            var amount = readUint16(reader);
            while (amount > 0) {
                var id = readUint16(reader);
                reader.fire(DataReader.Events.CELL_DELETE)(id);
                amount--;
            }
        }

        function readRemovedData(reader) {
            readRemovePlayer(reader);
            readRemoveCells(reader);
        }

        function handleUpdate(reader) {



            var corderius = readUint16(reader);
            while (corderius > 0) {
                var id = readUint16(reader);
                reader.fire(DataReader.Events.PLAYER_DELETE)(id);
                corderius--;
            }
            ;
            corderius = readUint16(reader);
            while (corderius > 0) {
                id = readUint16(reader);
                reader.fire(DataReader.Events.CELL_DELETE)(id);
                corderius--;
            }
            ;
            while (true) {
                id = readUint16(reader);
                if (id == 0) {
                    break;
                }
                ;

                var isExist = reader.fire(DataReader.Events.PLAYER_IS_EXISTS)(id);
                if (!isExist) {
                    reader.fire(DataReader.Events.PLAYER_CREATE)(id);
                }

                var data = {};
                data.id = id;
                data.color = readInt32Color(reader);
                data.name = readString16(reader);
                data.skin = readString8(reader);
                data.flags = readUint8(reader);

                if ((data.flags & 2) == 2) {
                    data.nameColor = readInt32Color(reader);
                    data.parseEffect = readUint8(reader);
                    data.nameFont = readUint8(reader);
                    //console.log('{'+data.name+'}','{'+data.skin+'}',data.flags,data.nameColor,data.parseEffect,data.nameFont);
                } else {
                //console.log('{'+data.name+'}','{'+data.skin+'}',data.flags);
                }

                reader.fire(DataReader.Events.PLAYER_UPDATE)(data);
            }
            ;
            while (true) {
                var type = readUint8(reader);
                var khali = 0;
                if (type == 0) {
                    break;
                }
                ;
                while (true) {
                    if (type == 2 && khali == 0) {
                        khali = readUint16(reader);
                        if (khali == 0) {
                            break;
                        }
                    }
                    ;
                    id = readUint16(reader);
                    if (id == 0) {
                        if (type == 2) {
                            khali = 0;
                            continue;
                        } else {
                            break;
                        }
                    }
                    ;
                    data = {};
                    data.id = id;
                    data.type = type;
                    data.x = readInt16(reader);
                    data.y = readInt16(reader);
                    data.new_x = data.x;
                    data.new_y = data.y
                    switch (type) {
                        case 6:
                            data.color = colorFromID(id);
                            break;
                        case 1:
                            data.size = readUint16(reader);
                            data.new_size = data.size;
                            data.color = readInt32Color(reader);
                            var keilana = readUint8(reader);
                            data.skin = (keilana & 127) - 1;
                            data.rainbow = (keilana & 128) == 128;
                            break;
                        case 2:
                            data.size = readUint16(reader);
                            data.new_size = data.size;
                            data.playerId = khali;
                            break;
                        case 3:
                            data.size = readUint16(reader);
                            data.new_size = data.size;
                            break;
                        case 4:
                            data.size = readUint16(reader);
                            data.new_size = data.size;
                            break;
                        case 5:
                            data.size = readUint16(reader);
                            data.new_size = data.size;
                            data.buff = readUint8(reader);
                            break;
                    }
                    reader.fire(DataReader.Events.CELL_CREATE)(data);
                }
            }
            ;
            while (true) {
                type = readUint8(reader);
                if (type == 0) {
                    break;
                }
                ;
                while (true) {
                    id = readUint16(reader);
                    if (id == 0) {
                        break;
                    }
                    ;
                    data = {};
                    data.id = id;
                    var x = readInt16(reader);
                    var y = readInt16(reader);
                    var cell = false;
                    if (type == 6) {
                        cell = reader.fire(DataReader.Events.CELL_FOOD_IS_EXISTS)(id);
                    } else {
                        cell = reader.fire(DataReader.Events.CELL_BUCKET_IS_EXISTS)(id);
                    }

                    data.new_x = x;
                    data.new_y = y;

                    if (!cell) {
                        data.type = type;
                        data.size = 10;
                        data.new_size = 10;
                        data.x = x;
                        data.y = y;
                        reader.fire(DataReader.Events.CELL_CREATE)(data);
                    }
                    ;
                    switch (type) {
                        case 2:
                            data.new_size = readUint16(reader);
                            break;
                        case 3:
                            data.new_size = readUint16(reader);
                            break;
                        case 4:
                            data.new_size = readUint16(reader);
                            break;
                    }
                    ;
                    data.steps = 30;
                    reader.fire(DataReader.Events.CELL_UPDATE)(data);
                }
            }
            ;












            /*readRemovedData(reader);
            readPlayersData(reader);
            readCellsData(reader);*/
        }

        function handleClearNodes(reader) {
            reader.fire(DataReader.Events.CLEAR)();
        }

        function handleID(reader) {
            reader.fire(DataReader.Events.ID)(readUint16(reader));
        }

        function handlePartyInfo(reader) {
            var r = {};
            var callbacks = [];
            var a01 = -1;
            var count = readUint16(reader);
            for (var i = 0; i < count; i++) {
                var a = {};
                var isLeader = readUint8(reader);
                var id = readUint16(reader);
                r[id] = true;
                var name = readString16(reader) || "An unnamed cell";
            }
            reader.fire(DataReader.Events.PARTY_INFO)(r);
        }

        function handlePartyData(reader) {

        }

        var DataReader = function() {
            this._events = {};
        };
        DataReader.Events = {
            CLEAR                : 0x0,

            PLAYER_IS_EXISTS     : 0x1,
            PLAYER_CREATE        : 0x2,
            PLAYER_UPDATE        : 0x3,
            PLAYER_DELETE        : 0x4,

            CELL_FOOD_IS_EXISTS  : 0x5,
            CELL_BUCKET_IS_EXISTS: 0x6,
            CELL_CREATE          : 0x7,
            CELL_UPDATE          : 0x8,
            CELL_DELETE          : 0x9,

            ID: 0xA,
            PARTY_INFO: 0xB

        };
        DataReader.prototype.on = function(name,fn) {
            this._events[name] = fn;
        };
        DataReader.prototype.fire = function(name) {
            if (typeof this._events[name] !== 'function') throw new Error('not a function');
            //if (typeof this._events[name] !== 'function') return function(){};
            return this._events[name];
        };
        DataReader.prototype.read = function(buffer) {
            this.buffer = buffer;
            this.view = new DataView(buffer);
            this.offset = 0;
            this.mode = readUint8(this);
            switch (this.mode) {
                case GOTA.ID:
                    handleID(this);
                    break;
                case GOTA.DRAW_DATA:
                    handleUpdate(this);
                    break;
                case GOTA.CLEAR_NODES:
                    handleClearNodes(this);
                    break;
                case 41:
                    handlePartyInfo(this);
                    break;
                case 45:
                    handlePartyData(this);
                    break;
                default:
                    break;
            }
        };

        return DataReader;

    })();


    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |              SKINCACHE CLASS             |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var SkinCache = (function(){

        var SkinState = {
            LOADING: 0x0,
            LOADED : 0x1,
            ERROR  : 0x2
        };

        var dataInfo = {};
        var dataImg = {};

        function loadSkin(src) {
            var img = new Image();
            img.crossOrigin = "";
            if (dataInfo[src] === SkinState.LOADING) return;
            dataInfo[src] = SkinState.LOADING;
            img.addEventListener("load", function() {
                var canvas = document.createElement("canvas");
                canvas.width = 512;
                canvas.height = 512;
                var ctx = canvas.getContext("2d");
                ctx.beginPath();
                ctx.arc(256, 256, 256, 0, Math.PI*2, false);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(img, 0, 0, 512, 512);
                dataImg[src] = canvas;
                dataInfo[src] = SkinState.LOADED;
            });
            img.addEventListener("error", function() {
                dataInfo[src] = SkinState.ERROR;
            });
            img.src = src;
        }

        function getSkin(src) {
            if (typeof dataImg[src] === 'undefined') {
                loadSkin(src);
                return null;
            } else if (dataInfo[src] === SkinState.LOADED) {
                return dataImg[src];
            } else if (dataInfo[src] === SkinState.ERROR) {
                delete dataImg[src];
                return null;
            }
        }

        return {
            get: getSkin
        };

    })();

    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |       DEFAULT REGISTRY DATA READER       |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var DataReaderRegistry = (function(){

        function merge(dst,src) {
            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    dst[key] = src[key];
                }
            }
        }

        function DataReaderRegistry(reader) {
            this.reader = reader;
            this.players = {};
            this.foods = {};
            this.buckets = {};
            this.playerId = 0;
            this.partyInfo = {};
            var that = this;
            this.reader.on(DataReader.Events.CLEAR,function(id){
                that.players = {};
                that.foods = {};
                that.buckets = {};
            });
            this.reader.on(DataReader.Events.PLAYER_IS_EXISTS,function(id){
                return typeof that.players[id] !== 'undefined';
            });
            this.reader.on(DataReader.Events.PLAYER_CREATE,function(id){
                that.players[id] = {};
            });
            this.reader.on(DataReader.Events.PLAYER_UPDATE,function(data){
                merge(that.players[data.id],data);
            });
            this.reader.on(DataReader.Events.PLAYER_DELETE,function(id){
                if (typeof that.players[id] === 'undefined') return;
                that.players[id] = null;
                delete that.players[id];
            });
            this.reader.on(DataReader.Events.CELL_FOOD_IS_EXISTS,function(id){
                return typeof that.foods[id] !== 'undefined';
            });
            this.reader.on(DataReader.Events.CELL_BUCKET_IS_EXISTS,function(id){
                return typeof that.buckets[id] !== 'undefined';
            });
            this.reader.on(DataReader.Events.CELL_CREATE,function(data){
                if (data.type == 6) {
                    that.foods[data.id] = data;
                } else {
                    that.buckets[data.id] = data;
                }
            });
            this.reader.on(DataReader.Events.CELL_UPDATE,function(data){
                if (data.type == 6) {
                    merge(that.foods[data.id],data);
                } else {
                    merge(that.buckets[data.id],data);
                }
            });
            this.reader.on(DataReader.Events.CELL_DELETE,function(id){
                if (typeof that.buckets[id] !== 'undefined') {
                    that.buckets[id] = null;
                    delete that.buckets[id];
                } else {
                    if (typeof that.foods[id] !== 'undefined') {
                        that.foods[id] = null;
                        delete that.foods[id];
                    }
                }
            });
            this.reader.on(DataReader.Events.ID,function(id){
                that.playerId = id;
            });
            this.reader.on(DataReader.Events.PARTY_INFO,function(partyInfo){
                that.partyInfo = partyInfo;
            });
        }

        return DataReaderRegistry;

    })();


    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |            ARCENCIEL CLASS               |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    function ArcEnCiel(c) {
        if (typeof c=='undefined'){c={}}
        this.R=c.R||254;
        this.G=c.G||0;
        this.B=c.B||0;
        this.v=c.v||200;
        this.clear={
            R:this.R,
            G:this.G,
            B:this.B,
            v:this.v
        };
    };
    ArcEnCiel.prototype.peek = function(alpha) {
        this.rgb='rgb('+this.R+','+this.G+','+this.B+','+alpha+')';
        return this.rgb;
    };
    ArcEnCiel.prototype.change = function(alpha) {
        if (this.R<255 && this.G<=0 && this.B<=0) {this.R+=this.v}
        else if (this.R>=255 && this.G<255 && this.B<=0) {this.G+=this.v}
        else if (this.R>0 && this.G>=255 && this.B<=0) {this.R-=this.v}
        else if (this.R<=0 && this.G>=255 && this.B<255) {this.B+=this.v}
        else if (this.R<=0 && this.G>0 && this.B>=255) {this.G-=this.v}
        else if (this.R<255 && this.G<=0 && this.B>=255) {this.R+=this.v}
        else {this.B-=this.v}
        if(this.R>255){this.R=255}if(this.R<0){this.R=0}
        if(this.G>255){this.G=255}if(this.G<0){this.G=0}
        if(this.B>255){this.B=255}if(this.B<0){this.B=0}
        this.rgb='rgb('+this.R+','+this.G+','+this.B+','+alpha+')';
        return this.rgb;
    };
    ArcEnCiel.prototype.reset = function() {
        this.R=this.clear.R;
        this.G=this.clear.G;
        this.B=this.clear.B;
        this.v=this.clear.v;
    };


    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |         DATACOMPUTECLASS CLASS           |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var DataComputeHandler = (function(){

        function iterateObject(object,fn) {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    fn(key,object[key]);
                }
            }
        }

        function iterate(a,b,c) {
            var fn = typeof b === 'function' ? b : c;
            iterateObject(a,fn);
            if (typeof b === 'object') iterateObject(b,fn);
        }

        function computeDelta(computeHandler) {
            var dt = Date.now() - computeHandler.time;
            computeHandler.time = Date.now();
            return Math.min(dt / 90, 1); // animation speed = 90
        }

        function animate(computeHandler) {
            var delta = computeDelta(computeHandler);
            iterate(computeHandler.registry.foods,computeHandler.registry.buckets,function(key,value){
                if (typeof value.steps === 'number' && value.steps > 0) {
                    value.x += (value.new_x - value.x) * delta;
                    value.y += (value.new_y - value.y) * delta;
                    value.size += (value.new_size - value.size) * delta;
                    value.steps--;
                }
            });
        }

        function retrievePlayerCells(computeHandler) {
            var playerscells = [];
            var playerId = computeHandler.registry.playerId;
            var size = 0;
            var x = 0;
            var y = 0;
            iterate(computeHandler.registry.buckets,function(key,value){
                if (value.playerId === playerId) {
                    playerscells.push(value);
                    x += value.x || 0;
                    y += value.y || 0;
                    size += value.size || 0;
                }
            });
            return {
                centerx: playerscells.length==0?0:x/playerscells.length,
                centery: playerscells.length==0?0:y/playerscells.length,
                totalSize: size,
                cells: playerscells
            };
        }

        function computeScale(computeHandler,size) {
            var canvas = computeHandler.canvas;
            var scale_base = Math.pow(Math.min(32 / size, 1), .4) * Math.max(canvas.height / 1080, canvas.width / 1920);
            var scale = scale_base * computeHandler.mouseZoom;
            computeHandler.scale = (9 * computeHandler.scale + scale) / 10;
            return computeHandler.scale;
        }

        var DataComputeHandler = function(canvas,registry) {
            this.canvas = canvas;
            if (canvas != null) this.ctx = this.canvas.getContext('2d');
            this.registry = registry;

            this.scale = 1;
            this.time = Date.now();
            this.mouseZoom = 1;

            this.mouseX = 0;
            this.mouseY = 0;

            var that = this;

            this.wheelCallback = function(event) {
                //if (document.getElementById('main').style.display == "none" && event.target.id == "canvas") {
                var delta = event.wheelDelta || event.deltaY * -1;
                if (delta > 0) {
                    that.mouseZoom *= 1.1;
                } else {
                    that.mouseZoom *= .9;
                }
                that.mouseZoom = that.mouseZoom > 5 ? 5 : that.mouseZoom < .1 ? .1 : that.mouseZoom;
                //}
            };
            this.centerx = 0;
            this.centery = 0;
            this.size = 0;
            this.cells = [];
            this.mass = 0;
        };
        DataComputeHandler.prototype.getWheelCallback = function(){
            return this.wheelCallback;
        };
        DataComputeHandler.prototype.setCanvas = function(canvas) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
        };
        DataComputeHandler.prototype.getCanvas = function(canvas) {
            return this.canvas;
        };
        DataComputeHandler.prototype.update = function() {
            if (this.registry == null) return;
            if (this.canvas == null) return;

            var canvas = this.canvas;
            var ctx = this.ctx;

            // update size and position smoothly
            animate(this);

            // retrieve cells of the main player
            var playersdata = retrievePlayerCells(this);
            this.cells = playersdata.cells;

            if (this.cells.length > 0) {

                this.centerx = playersdata.centerx;
                this.centery = playersdata.centery;
                this.size = playersdata.totalSize;
                this.mass = playersdata.totalSize * playersdata.totalSize / 25 >> 0;

                // compute the scale
                computeScale(this,this.size);

                this.mouseX = Math.floor(this.centerx - (canvas.width/2) / this.scale + globals.mouseX / this.scale);
                this.mouseY = Math.floor(this.centery - (canvas.height/2) / this.scale + globals.mouseY / this.scale);
            }

        };


        return DataComputeHandler;

    })();

    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |           DATADRAWCLASS CLASS            |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var DataDrawHandler = (function(){

        function iterateObject(object,fn) {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    fn(key,object[key]);
                }
            }
        }

        function iterate(a,b,c) {
            var fn = typeof b === 'function' ? b : c;
            iterateObject(a,fn);
            if (typeof b === 'object') iterateObject(b,fn);
        }

        function Font(family, size, outlineColor) {
            this.family = family;
            this.size = size;
            this.outlineColor = outlineColor ? outlineColor : "#000";
        }
        Font.prototype.toString = function(settings) {
            settings = settings || {};
            return (settings.bold===true?'normal 900 ':'')+this.size+'px '+this.family;
        }
        Font.list = {
            0  : new Font("Verdana",54),
            1  : new Font("ampad",75),
            2  : new Font("burnstown",81),
            3  : new Font("chlorinar",75),
            4  : new Font("Facon",75),
            5  : new Font("archistico",75),
            6  : new Font("breakaway",81),
            7  : new Font("conformity",81),
            8  : new Font("electroharmonix",70),
            9  : new Font("PWJoyeuxNoel",70),
            10 : new Font("leckerli-one",75),
            101: new Font("IceCaps",81,"#00c9ff"),
            102: new Font("BrazierFlame",81,"#e25822")
        };
        Font.defaultFont = Font.list[0];
        Font.getFont = function(index) {
            return index > 0 && Font.list[index] ? Font.list[index] : Font.defaultFont;
        }

        function computeEffect(parseEffect) {
            if (typeof parseEffect !== 'number') return {lowerName:false,effect:0};
            var lowerName = false;
            if (parseEffect >= 64) {
                parseEffect = parseEffect - 64;
                lowerName = true;
            }
            return {
                lowerName: lowerName,
                effect: parseEffect
            }
        }

        function drawFoods(drawHandler,scale,x,y) {
            var ctx = drawHandler.handler.ctx;
            iterate(drawHandler.handler.registry.foods,function(id,food){
                ctx.fillStyle = colorToHex(food.color);
                ctx.beginPath();
                ctx.arc((food.x-x)*scale,(food.y-y)*scale,6*scale,0,2*Math.PI);
                ctx.fill();
            });
        }

        function drawCells(drawHandler,scale,x,y) {
            var ctx = drawHandler.handler.ctx;
            var colorparty = drawHandler.arcenciel.peek(0.4);
            var cells = [];
            iterate(drawHandler.handler.registry.buckets,function(id,cell){
                cells.push(cell);
            });
            cells.sort(function(a,b){
                return a.size - b.size;
            });
            var ids = {};
            for (var idminion in Minion.list) {
                ids[Minion.list[idminion].gotaid] = true;
            }
            var i,cell,centerx,centery,size;
            for (i = 0; i < cells.length; i++) {
                cell = cells[i];
                if (cell.type == 0) continue;

                centerx = (cell.x-x)*scale;
                centery = (cell.y-y)*scale;
                size = cell.size*scale;

                var color = '#ffffff';
                var player;
                if (cell.type === 2) {
                    player = drawHandler.handler.registry.players[cell.playerId];
                    if (!player) continue;
                    color = colorToHex(player.color);
                } else if (cell.type === 6 || cell.type === 1) {
                    color = colorToHex(cell.color);
                }

                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(centerx,centery,size,0,2*Math.PI);
                ctx.fill();



                if (cell.type === 2) {

                    player = drawHandler.handler.registry.players[cell.playerId];
                    var value = (cell.size / 2) / 100;
                    var artistTrack = Math.max(value, .16);
                    //var artistTrack = 10*cell.size/100;


                    var skin = SkinCache.get(player.skin);
                    if (skin!=null) {
                        ctx.drawImage(skin, 0, 0, skin.width, skin.height, centerx-size, centery-size, size*2, size*2);
                    }



                    var ss_scale = scale >= (16 / cell.size);

                    var effectData = computeEffect(player.parseEffect);

                    var namey = 0;

                    //if (cell.playerId==drawHandler.registry.playerId) console.log(scale,artistTrack);
                    if (player.name.length > 0) {
                        var isVisible = ss_scale;
                        if (isVisible) {

                            namey = (effectData.lowerName?8:0)+70;

                            ctx.scale(scale,scale);
                            ctx.scale(artistTrack,artistTrack);
                            var namefont = Font.getFont(player.nameFont || 0);
                            ctx.fillStyle = player.nameColor || '#ffffff';
                            ctx.textBaseline = "middle";
                            ctx.textAlign = "center";
                            ctx.font = namefont.toString({bold: true});
                            ctx.fillText(player.name,(cell.x-x)/artistTrack,(cell.y-y)/artistTrack+4+(effectData.lowerName?8:0));
                            ctx.scale(1/artistTrack,1/artistTrack);
                            ctx.scale(1/scale,1/scale);
                        }
                    }


                    ctx.scale(scale,scale);
                    ctx.scale(artistTrack,artistTrack);
                    var massfont = Font.defaultFont;
                    ctx.fillStyle = '#ffffff';
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center";
                    ctx.font = massfont.toString({bold: true});
                    ctx.fillText((cell.size * cell.size / 25 >> 0).toString(),(cell.x-x)/artistTrack,(cell.y-y)/artistTrack+namey);
                    ctx.scale(1/artistTrack,1/artistTrack);
                    ctx.scale(1/scale,1/scale);

                }
            }

           for (i = 0; i < cells.length; i++) {
                cell = cells[i];

                centerx = (cell.x-x)*scale;
                centery = (cell.y-y)*scale;
                size = cell.size*scale;

                if (cell.type === 2) {
                    if (ids[cell.playerId] || cell.playerId==globals.master.gotaid || drawHandler.handler.registry.partyInfo[cell.playerId]) {
                        ctx.strokeStyle = colorparty;
                        ctx.lineWidth = 10*scale;
                        ctx.beginPath();
                        ctx.arc(centerx,centery,(cell.size+5)*scale,0,2*Math.PI);
                        ctx.stroke();
                        ctx.lineWidth = 1;
                    }
                }
            }
        }

        function update(drawHandler) {

            if (drawHandler.handler == null) return;

            var canvas = drawHandler.handler.canvas;
            var ctx = drawHandler.handler.ctx;

            drawHandler.arcenciel.change(0.8);

            // update handler
            drawHandler.handler.update();

            // retrieve cells of the main player
            var playerscells = drawHandler.handler.cells;

            if (playerscells.length > 0) {

                var centerx = drawHandler.handler.centerx;
                var centery = drawHandler.handler.centery;
                var size = drawHandler.handler.size;

                // clear and resize canvas
                //ctx.fillStyle = "#000";
                //ctx.fillRect(0,0,canvas.width,canvas.height);
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                ctx.setTransform(1,0,0,1,0,0);

                // translate to center
                ctx.translate(canvas.width/2,canvas.height/2);

                // compute the scale
                var scale = drawHandler.handler.scale;

                // draw foods
                drawFoods(drawHandler,scale,centerx,centery);

                // draw cells
                drawCells(drawHandler,scale,centerx,centery);

            }

            // loop
            if (drawHandler.isRunning) {
                window.requestAnimationFrame(function(){
                    update(drawHandler);
                });
            }

        }

        function DataDrawHandler(handler) {
            this.arcenciel = new ArcEnCiel({v:5});
            this.handler = typeof handler === 'undefined' ? null : handler;
            if (this.handler!=null) window.addEventListener('wheel',this.handler.getWheelCallback());
            this.isRunning = false;
        }
        DataDrawHandler.prototype.setHandler = function(handler) {
            if (this.handler!=null) window.removeEventListener('wheel',this.handler.getWheelCallback());
            this.handler = handler;
            window.addEventListener('wheel',this.handler.getWheelCallback());
        }
        DataDrawHandler.prototype.start = function() {
            if (this.isRunning) return;
            this.isRunning = true;
            try {
                update(this);
            } catch(e) {console.log(e)}
        }
        DataDrawHandler.prototype.end = function() {
            if (!this.isRunning) return;
            this.isRunning = false;
        }

        return DataDrawHandler;

    })();


    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |               MASTER CLASS               |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var Master = function() {
        this.endpoint = null;
        this.connectionManager = null;
        this.teamcode = "";
        this.gotaid = null;
        this.ws = null;
        this.reader = new DataReader();
        this.registry = new DataReaderRegistry(this.reader);
        this.computeHandler = new DataComputeHandler(null,this.registry);
        this.event = new Master.Event(this);
        this.oncreate(function(){
            if (!this.ws.url.includes('gota.io')) return;
            this.endpoint = this.ws.url;
            var that = this;
            this.ws.oldsend = this.ws.send;
            this.ws.send = function(...args) {
                var key = 0;
                try {
                    var view = new DataView(args[0]);
                    key = view.getInt8(0);
                    if (key == 16 && globals.mouseFrozen) return;
                    if (key == 16 && globals.index!=0) {
                        var mastermouse = globals.player.getMouse();
                        Actions.moveto(that.ws,mastermouse.x,mastermouse.y);
                        return;
                    }
                } catch (e) {console.error(e);}
                return this.oldsend(...args);
            };
            this.ws.addEventListener('message',function(evt){
                readData(evt,function(data){
                    var d = Array.from(new Uint8Array(data));
                    if (d[0] == GOTA.ID) {
                        //console.log("ID:",(d[2] << 8) + d[1]);
                        that.gotaid = (d[2] << 8) + d[1];
                    }
                    if (d[0] == GOTA.TEAM_CODE) {
                        if (that.ws.intervalteampublic!=null) {
                            try {
                                clearInterval(that.ws.intervalteampublic);
                                that.ws.intervalteampublic = null;
                            } catch (e) {}
                        }
                        that.teamcode = "";
                        var tmpcode = [];
                        for (var i = 0; i < d.length; i++) {
                            if (d[d.length-2-i]==0) break;
                            tmpcode = [d[d.length-2-i]].concat(tmpcode);
                        }
                        that.teamcode = String.fromCharCode.apply(null,tmpcode);
                        console.log("[Minion] team code : "+that.teamcode);
                        Minion.broadcast('join');
                    }
                    that.reader.read(data);


                    //remotelogger.debug(data);
                });
            });
        });
    };
    Master.prototype.getMouse = function() {
        return {
            x:this.computeHandler.mouseX,
            y:this.computeHandler.mouseY
        };
    };
    Master.prototype.setCanvas = function(canvas) {
        this.computeHandler.setCanvas(canvas);
    };
    Master.prototype.getCanvas = function() {
        return this.computeHandler.getCanvas();
    };
    Master.prototype.setConnectionManager = function(connectionManager) {
        this.connectionManager = connectionManager;
    };
    Master.prototype.oncreate = function(fn) {
        fn = fn.bind(this);
        var farthat = this;
        Tracker.get("WebSocket").register(
            new Tracker.Handler()
            .setParser(function(){
                return ["url","protocols"];
            })
            .setFilter(function(target,_,args){
                return true;
            })
            .setAction(function(target,_,args){
                if (!args.data.url.includes('gota.io')) return;
                if (farthat.ws!=null) return;
                farthat.ws = new target(args.data.url);
                fn();
                return farthat.ws;
            }),
            Tracker.Handler.Type.CONSTRUCT
        );
    };
    Master.Event = function(master) {
        this.master = master;
        this.onces = {};
    };
    Master.Event.prototype.once = function(value,fn) {
        this.onces[value] = fn.bind(this.master);
    };
    Master.Event.prototype.push = function(value) {
        if (typeof this.onces[value] !== 'function') return;
        this.onces[value]();
        this.onces[value] = null;
        delete this.onces[value];
    };




    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |               MINION CLASS               |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    var Minion = function(url,nickname) {


        this.master = null;
        this.connectionManager = null;

        this.reader = new DataReader();
        this.registry = new DataReaderRegistry(this.reader);
        this.computeHandler = new DataComputeHandler(null,this.registry);

        this.gotaid = null;
        this.color = {r:255,g:255,b:255};
        this.url = url;
        this.nickname = nickname;
        this.intervalping = null;
        this.intervalgame = null;

        /*this.socket = null;
        this.url = url;
        this.endpoint = null;

        this.team = null;
        this.isclose = false;
        this.isvalide = false;
        this.isview = false;
        this.ismaster = false;
        this.masterenable = false;*/
        this.id = 1;
        while (typeof Minion.list[this.id++] !== 'undefined');
        this.id--;
        this.nickname = this.nickname.replace(/\%n\%/g,this.id);
        Minion.list[this.id] = this;
    };
    Minion.list = {};
    window.oldm = Minion.list; // ref
    Minion.keys = {
        split:88,
        eject:67
    };
    Minion.mastermode = false;
    Minion.getById = function(id) {
        if (typeof Minion.list[id] === 'undefined') return null;
        return Minion.list[id];
    };
    Minion.getByNickname = function(nickname) {
        var i = 0;
        var keys = Object.keys(Minion.list);
        for (i = 0; i < keys.length; i++) {
            if (Minion.list[keys[i]].nickname==nickname) return Minion.list[keys[i]];
        }
        return null;
    };
    Minion.removeById = function(id) {
        if (typeof Minion.list[id] === 'undefined') return false;
        Minion.list[id].close();
        Minion.list[id] = null;
        delete Minion.list[id];
        return true;
    };
    Minion.removeByNickname = function(nickname) {
        var i = 0;
        var keys = Object.keys(Minion.list);
        for (i = 0; i < keys.length; i++) {
            if (Minion.list[keys[i]].nickname==nickname) {
                return Minion.removeById(keys[i]);
            }
        }
        return false;
    };
    Minion.removeByGotaId = function(gotaid) {
        var i = 0;
        var keys = Object.keys(Minion.list);
        for (i = 0; i < keys.length; i++) {
            if (Minion.list[keys[i]].gotaid==gotaid) {
                return Minion.removeById(keys[i]);
            }
        }
        return false;
    };
    Minion.add = function(nickname) {
        var master = this.master;
        if (this.master.endpoint!=null) {
            var minion = new Minion(this.master.endpoint,nickname);
            minion.setMaster(this.master);
            minion.setConnectionManager(this.master.connectionManager);
            if (!minion.connect()) {
                Minion.remove(minion);
            }
            if (this.master.gotaid!=null) {
                Actions.teamcreate(this.master.ws,this.master.gotaid);
                // TODO
                this.master.ws.intervalteampublic = setInterval(function(){
                    Actions.teampublic(master.ws);
                },100);
            }
        }
    };
    Minion.renameById = function(id,nickname) {
        var mm = null;
        if (typeof id === 'number') {
            if (typeof Minion.list[id] === 'undefined') return false;
            Minion.list[id].nickname = nickname;
            mm = Minion.list[id];
            //sendchatmessageminion('<span style="color: rgb(221, 221, 0);"\>[Minion] Renaming <b>N°'+mm.id+'<\/b> to <b>'+nickname+'</\b><\/span>');
            //sendchatmessageminion(
            //'<span style="color: rgb('+(Object.values(mm.color).join(', '))+');"\>'+
            //mm.nickname+
            //  '<\/span><span style="color: rgb(255, 255, 255);"\>: my next nickname is <b>'+nickname+'</\b><\/span>'
            //);
            return true;
        }
        var i = id.indexOf(' ');
        var fid = id.substring(0,i);
        var fnickname = id.substring(i+1);
        if (typeof Minion.list[fid] === 'undefined') return false;
        Minion.list[fid].nickname = fnickname;
        mm = Minion.list[fid];
        //sendchatmessageminion('<span style="color: rgb(221, 221, 0);"\>[Minion] Renaming <b>N°'+mm.id+'<\/b> to <b>'+fnickname+'</\b><\/span>');
        //sendchatmessageminion(
        //'<span style="color: rgb('+(Object.values(mm.color).join(', '))+');"\>'+
        //mm.nickname+
        //'<\/span><span style="color: rgb(255, 255, 255);"\>: my next nickname is <b>'+fnickname+'</\b><\/span>'
        //);
        return true;
    };
    Minion.getIdByNickname = function(nickname) {
        var i = 0;
        var keys = Object.keys(Minion.list);
        for (i = 0; i < keys.length; i++) {
            if (Minion.list[keys[i]].nickname==nickname) {
                var mm = Minion.list[keys[i]];
                //sendchatmessageminion(
                //'<span style="color: rgb('+(Object.values(mm.color).join(', '))+');"\>'+
                //mm.nickname+
                //  '<\/span><span style="color: rgb(255, 255, 255);"\>: my number is N°<b>'+mm.id+'<\/b>!<\/span>'
                //);
                return true;
            }
        }
        return false;
    };
    Minion.getList = function() {
        var i = 0;
        var keys = Object.keys(Minion.list);
        //sendchatmessageminion('<span style="color: rgb(221, 221, 0);"\>[Minion] ====== List of Minions ======<\/span>');
        for (i = 0; i < keys.length; i++) {
            var mm = Minion.list[keys[i]];
            //sendchatmessageminion(
            //'<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<\/span>'+
            //'<span style="color: rgb('+(Object.values(mm.color).join(', '))+');"\>'+
            //mm.nickname+
            //  '<\/span><span style="color: rgb(255, 255, 255);"\> - N°<b>'+mm.id+'<\/b> - ID <b>'+mm.gotaid+' ('+(mm.isConnect()?'connected':'disconnected')+')<\/b><\/span>'
            //);
        }
        //sendchatmessageminion('<span style="color: rgb(221, 221, 0);"\>[Minion] =============================<\/span>');
        return true;
    };
    Minion.changeKey = function(key,name) {
        if (!isNaN(key)) {
            Minion.keys[name] = parseInt(key);
            //sendchatmessageminion('<span style="color: rgb(221, 221, 0);"\>[Minion] The key to '+name+' is now {<b>'+String.fromCharCode(key).toUpperCase()+'<\/b>} <i>(KeyCode: '+key+')<\/i><\/span>');
        } else {
            Minion.keys[name] = key.toUpperCase().charCodeAt(0);
            //sendchatmessageminion('<span style="color: rgb(221, 221, 0);"\>[Minion] The key to '+name+' is now {<b>'+key+'<\/b>} <i>(KeyCode: '+key.toUpperCase().charCodeAt(0)+')<\/i><\/span>');
        }
    };
    Minion.remove = function(minion) {
        if (typeof Minion.list[minion.id] === 'undefined') return false;
        Minion.list[minion.id].close();
        Minion.list[minion.id] = null;
        delete Minion.list[minion.id];
        return true;
    };
    Minion.broadcast = function(c) {
        var i = 0;
        var keys = Object.keys(Minion.list);
        if (c=='split') {
            if (globals.index!=0) {
                Actions.split(globals.master.ws);
            }
            for (i = 0; i < keys.length; i++) {
                if (globals.player===Minion.list[keys[i]]) continue;
                Minion.list[keys[i]].split();
            }
        } else if (c=='ejectstart') {
            if (globals.index!=0) {
                Actions.ejectstart(globals.master.ws);
            }
            for (i = 0; i < keys.length; i++) {
                if (globals.player===Minion.list[keys[i]]) continue;
                Minion.list[keys[i]].ejectstart();
            }
        } else if (c=='ejectend') {
            if (globals.index!=0) {
                Actions.ejectend(globals.master.ws);
            }
            for (i = 0; i < keys.length; i++) {
                if (globals.player===Minion.list[keys[i]]) continue;
                Minion.list[keys[i]].ejectend();
            }
        } else if (c=='join') {
            for (i = 0; i < keys.length; i++) {
                if (globals.player===Minion.list[keys[i]]) continue;
                Minion.list[keys[i]].teamjoin();
            }
        } else if (c=='forwardsplit') {
            if (globals.index!=0) {
                Actions.forwardsplit(globals.master.ws,globals.master.computeHandler.mass);
            }
            for (i = 0; i < keys.length; i++) {
                if (globals.player===Minion.list[keys[i]]) continue;
                Minion.list[keys[i]].forwardsplit();
            }
        }
    };
    Minion.enableMaster = function() {
        Minion.mastermode = true;
    };
    Minion.disableMaster = function() {
        Minion.mastermode = false;
    };
    Minion.toggleMaster = function() {
        Minion.mastermode = !Minion.mastermode;
    };
    Minion.prototype.getMouse = function() {
        return {
            x:this.computeHandler.mouseX,
            y:this.computeHandler.mouseY
        };
    };
    Minion.prototype.setMaster = function(master) {
        this.master = master;
    };
    Minion.prototype.setConnectionManager = function(connectionManager) {
        this.connectionManager = connectionManager;
    };
    Minion.prototype.resetEndpoint = function() {
        if (this.connectionManager!=null && this.endpoint!=null) this.connectionManager.removeConnection(this.endpoint);
        this.endpoint = null;
    };
    Minion.prototype.resetIntervals = function() {
        if (this.intervalping!=null) {
            clearInterval(this.intervalping);
            this.intervalping = null;
        }
        if (this.intervalgame!=null) {
            clearInterval(this.intervalgame);
            this.intervalgame = null;
        }
    };
    Minion.prototype.connect = function() {

        var that = this;

        this.resetIntervals();

        if (this.isclose) return true;

        try {

            this.resetEndpoint();
            this.endpoint = this.connectionManager==null?"":this.connectionManager.getConnection();

            if (this.endpoint==null) return false; // too many minions

            var target = Tracker.get("WebSocket").target;
            this.ws = new target(this.endpoint+this.url);

            this.ws.addEventListener('error', function error(e) {
                //console.error(e);
                //console.log('erreur du socket');
            });

            this.ws.addEventListener('open', function open() {
                //console.log('connection du minion');
                that.resetIntervals();
                //console.log('initialisation du handshake');
                that.handshake();
                //console.log('envoie du pseudo');
                that.sendnickname();
                //console.log('attente de la vérification...');
                that.verify(function(){
                    //console.log('rejoins de la team en cours');
                    that.teamjoin();
                    //console.log('creation des intervals (ping,moveto)');
                    that.intervalping = setInterval(function(){
                        that.ping();
                        //console.log('minion -> ping');
                    },1000);
                    that.intervalgame = setInterval(function(){
                        if (!globals.mouseFrozen) {
                            var mousemaster = globals.player.getMouse();
                            that.moveto(mousemaster.x,mousemaster.y);
                        }
                        //console.log('minion -> moveto');
                    },1000/60);
                });
            });

            this.ws.addEventListener('close', function close(e) {
                //console.log('fermeture du socket');
                that.resetIntervals();
                setTimeout(function(){
                    //console.log('reconnection du socket...');
                    that.connect();
                },100);
            });

            this.ws.addEventListener('message', function(evt) {
                readData(evt,function(data) {
                    var d = Array.from(new Uint8Array(data));
                    if (d[0]==GOTA.ID) {
                        that.gotaid = (d[2] << 8) + d[1];
                    }
                    if (d[0]==GOTA.ON_DIE) {
                        that.sendnickname();
                    }
                    that.reader.read(data);
                });
            });

        // TODO
        } catch(e) {console.log(e);}

        return true;
    };
    Minion.prototype.handshake = function() {
        Actions.handshake(this.ws);
    };
    Minion.prototype.verify = function(c) {
        var that = this;
        Actions.verify(this.ws,function(socket){
            that.isvalide = true;
            Actions.sendnickname(socket,that.nickname);
            if (typeof c === 'function') c();
        });
    };
    Minion.prototype.sendnickname = function() {
        Actions.sendnickname(this.ws,this.nickname);
    };
    Minion.prototype.ping = function() {
        Actions.ping(this.ws);
    };
    Minion.prototype.moveto = function(x,y) {
        if (!this.isvalide) return;
        Actions.moveto(this.ws,x,y);
    };
    Minion.prototype.split = function() {
        if (!this.isvalide) return;
        if (Minion.mastermode && !this.ismaster) return;
        Actions.split(this.ws);
    };
    Minion.prototype.forwardsplit = function() {
        if (!this.isvalide) return;
        if (Minion.mastermode && !this.ismaster) return;
        Actions.forwardsplit(this.ws,this.computeHandler.mass);
    };
    Minion.prototype.ejectstart = function() {
        if (!this.isvalide) return;
        if (Minion.mastermode && !this.ismaster) return;
        Actions.ejectstart(this.ws);
    };
    Minion.prototype.ejectend = function() {
        if (!this.isvalide) return;
        Actions.ejectend(this.ws);
    };
    Minion.prototype.teamcreate = function() {
        if (!this.isvalide) return;
        if (this.team==null) {
            // TODO
            console.log("[Minion] impossible de créer une team");
            return;
        }
        Actions.teamcreate(this.ws,this.team[0],this.team[1]);
    };
    Minion.prototype.teampublic = function() {
        if (!this.isvalide) return;
        Actions.teampublic(this.ws);
    };
    Minion.prototype.teamjoin = function() {
        if (!this.isvalide) return;
        if (this.master.teamcode=="") return;
        Actions.teamjoin(this.ws,this.master.teamcode);
    };
    Minion.prototype.close = function() {
        if (this.isclose) return;
        this.isclose = true;
        this.ws.close();
    };
    Minion.prototype.isConnect = function() {
        return this.isvalide && !this.isclose;
    };































    /*
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    |               INIT CALL                  |
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    */
    init();

})();