// ==UserScript==
// @name         MyBot Compiler
// @description  MyBot Pixel Place Compile Client
// @version      1.6.2
// @author       SamaelWired
// @namespace    https://greasyfork.org/tr/users/976572
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @license      MIT
// @grant        none
// @run-at       document-start
// ==/UserScript==
(() => {
    const MyBot = window.MyBot || {modules: {}};
    window.MyBot = MyBot;
    if ('Compiler' in MyBot.modules) return;

    const module = {};
    module.args = {};
    module.intervals = [];
    module.main = null;

    module.config = ({timer, packetSpeed, packetCount}) => {
        if (module.main) {
            module.args.timer.clearInterval(module.main[0]);
            module.main = [
                timer.setInterval(module.main[1]),
                module.main[1]
            ];
        }

        if (module.intervals.length) {
            module.intervals = module.intervals.map(([id, func, ws]) => {
                module.args.timer.clearInterval(id);
                ws._inter = timer.setInterval(func, packetCount > 0 ? 0 : 1e3/packetSpeed);
                return [ws._inter, func, ws];
            });
        }

        Object.assign(module.args, {timer, packetSpeed, packetCount});
    };

    module.compile = () => {
        const {timer, packetCount, packetSpeed} = module.args;
        
        Object.assign(MyBot, {
            ws: null,
            map: {},
            onclick: null,
            queueId: 0,
            queue: [],
            pos: 0,
            lock: false,
            last: [0, 0, 255],
            set(x, y, p) {
                MyBot.queue.push([x, y, p, MyBot.queueId++]);
            },
            _id: 0,
            _posSocket: 0,
            sockets: [],
            getSocket() {
                let i = 0;
                let ws = null;
                
                while (i++ < MyBot.sockets.length) {
                    const _ws = MyBot.sockets[MyBot._posSocket++];
                    if (MyBot._posSocket > MyBot.sockets.length-1) MyBot._posSocket = 0;
                    if (!_ws) continue;
                    if (_ws.ignore) continue;
                    
                    if (MyBot.config.packetCount > 0) {
                        if (_ws.count > 0) _ws.count--;
                        else continue;
                    } else if (!_ws.can || !_ws.ready) continue;

                    ws = _ws;
                    break;
                }
                
                return ws;
            }
        });

        let progress = false;
        const mainFunc = () => {
            if (progress) return;
            progress = true;
            
            while (MyBot.pos < MyBot.queue.length) {
                const [x, y, p, i] = MyBot.queue[MyBot.pos++];
                if (p === 255 || MyBot.map.get(x, y) === 255) {
                    MyBot.queue.splice(--MyBot.pos, 1);
                    continue;
                }
                if (MyBot.map.get(x, y) === p) continue;
                
                const ws = MyBot.getSocket();
                if (!ws) {
                    MyBot.pos--;
                    progress = false;
                    return;
                }
                
                ws.can = false;
                MyBot.CWSS.send.call(ws, `42["p",[${x},${y},${p},${1+MyBot.pos}]]`);
                continue;
            }
            
            if (MyBot.lock && MyBot.pos > MyBot.queue.length-1) {
                MyBot.pos = 0;
                progress = false;
                return;
            }
            
            MyBot.pos = 0;
            MyBot.queue = [];
            MyBot.queueId = 0;
            progress = false;
        };
        module.main = [timer.setInterval(mainFunc), mainFunc];

        MyBot.modules.MapLoader.subscribe((module, map) => {
            Object.assign(MyBot.map, map);
            MyBot.map.pixels = new Uint8Array(map.pixels);
            MyBot.serverId = map.serverId;
        });

        module.hook = {
            priority: 0,
            open() {
                if (!this.username) {
                    MyBot.ws = this;
                    this.addEventListener('close', e=>{
                        MyBot.ws = null;
                    });
                }

                MyBot.sockets.push(this);
                this.id = MyBot._id++;
                const func = () => this.can = true;

                this.addEventListener('close', () => {
                    const el = module.intervals.find(([id, f, ws]) => f == func);
                    module.intervals.splice(module.intervals.indexOf(el), 1);
                    module.args.timer.clearInterval(this._inter);
                    MyBot.sockets.splice(MyBot.sockets.indexOf(this),1);
                });
                
                this.can = true;
                this._inter = module.args.timer.setInterval(func, packetCount > 0 ? 0 : 1e3/packetSpeed);
                module.intervals.push([this._inter, func, this]);
                
                return arguments;
            },

            message({data}) {
                if (MyBot.ws != this) return arguments;

                const message = JSON.parse(data.split(/(?<=^\d+)(?=[^\d])/)[1] || '[]');
                if (!message.length) return arguments;

                const [event, json] = message;
                if (event == 'canvas') {
                    json.map(p => MyBot.map.set(...p));
                    MyBot.ws.ready = true;
                }
                if (event == 'p') {
                    json.map(p => MyBot.map.set(...p));
                    this.count = MyBot.config.packetCount;
                }

                return arguments;
            },

            send(data) {
                if (MyBot.ws != this) return arguments;

                const message = JSON.parse(data.split(/(?<=^\d+)(?=[^\d])/)[1] || '[]');
                if (!message.length) return arguments;

                const [event, json] = message;
                if (event == 'p') {
                    const [x, y, pixel] = json;
                    MyBot.last = [x, y, pixel];
                    if (MyBot.onclick && MyBot.onclick(x, y, pixel) === false) return;
                }

                return arguments;
            }
        };
        MyBot.CWSS.setHook(module.hook);
    };

    MyBot.modules.Compiler = module;
})();
