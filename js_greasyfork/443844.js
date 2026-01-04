// ==UserScript==
// @name         PPCC
// @description  Pixel Place Compile Client
// @version      1.6.2
// @author       0vC4
// @namespace    https://greasyfork.org/users/670183
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @license      MIT
// @grant        none
// @run-at       document-start
// ==/UserScript==
(() => {
    const PPClient = window.PPClient || {modules:{}};
    window.PPClient = PPClient;
    if ('Compiler' in PPClient.modules) return;



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
        
        Object.assign(PPClient, {
            ws: null,
            map: {},
            onclick: null,

            queueId: 0,
            queue: [],
            pos: 0,
            lock: false,
            last: [0,0,255],
            set(x, y, p) {
                PPClient.queue.push([x, y, p, PPClient.queueId++]);
            },

            _id: 0,
            _posSocket: 0,
            sockets: [],
            getSocket() {
                let i = 0;
                let ws = null;
                
                while (i++ < PPClient.sockets.length) {
                    const _ws = PPClient.sockets[PPClient._posSocket++];
                    if (PPClient._posSocket > PPClient.sockets.length-1) PPClient._posSocket = 0;
                    if (!_ws) continue;
                    if (_ws.ignore) continue;
                    
                    if (PPClient.config.packetCount > 0) {
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
            
            while (PPClient.pos < PPClient.queue.length) {
                const [x, y, p, i] = PPClient.queue[PPClient.pos++];
                if (p === 255 || PPClient.map.get(x,y) === 255) {
                    PPClient.queue.splice(--PPClient.pos, 1);
                    continue;
                }
                if (PPClient.map.get(x,y) === p) continue;
                
                const ws = PPClient.getSocket();
                if (!ws) {
                    PPClient.pos--;
                    progress = false;
                    return;
                }
                
                ws.can = false;
                PPClient.CWSS.send.call(ws, `42["p",[${x},${y},${p},${1+PPClient.pos}]]`);
                continue;
            }
            
            if (PPClient.lock && PPClient.pos > PPClient.queue.length-1) {
                PPClient.pos = 0;
                progress = false;
                return;
            }
            
            PPClient.pos = 0;
            PPClient.queue = [];
            PPClient.queueId = 0;
            progress = false;
        };
        module.main = [timer.setInterval(mainFunc), mainFunc];



        PPClient.modules.MapLoader.subscribe((module, map) => {
            Object.assign(PPClient.map, map);
            PPClient.map.pixels = new Uint8Array(map.pixels);
            PPClient.serverId = map.serverId;
        });



        module.hook = {
            priority: 0,
            
            open() {
                if (!this.username) {
                    PPClient.ws = this;
                    this.addEventListener('close', e=>{
                        PPClient.ws = null;
                    });
                }

                PPClient.sockets.push(this);
                this.id = PPClient._id++;
                const func = () => this.can = true;

                this.addEventListener('close', () => {
                    const el = module.intervals.find(([id, f, ws]) => f == func);
                    module.intervals.splice(module.intervals.indexOf(el), 1);
                    module.args.timer.clearInterval(this._inter);
                    PPClient.sockets.splice(PPClient.sockets.indexOf(this),1);
                });
                
                this.can = true;
                this._inter = module.args.timer.setInterval(func, packetCount > 0 ? 0 : 1e3/packetSpeed);
                module.intervals.push([this._inter, func, this]);
                
                return arguments;
            },

            message({data}) {
                if (PPClient.ws != this) return arguments;

                const message = JSON.parse(data.split(/(?<=^\d+)(?=[^\d])/)[1] || '[]');
                if (!message.length) return arguments;

                const [event, json] = message;
                if (event == 'canvas') {
                    json.map(p => PPClient.map.set(...p));
                    PPClient.ws.ready = true;
                }
                if (event == 'p') {
                    json.map(p => PPClient.map.set(...p));
                    this.count = PPClient.config.packetCount;
                }

                return arguments;
            },

            send(data) {
                if (PPClient.ws != this) return arguments;

                const message = JSON.parse(data.split(/(?<=^\d+)(?=[^\d])/)[1] || '[]');
                if (!message.length) return arguments;

                const [event, json] = message;
                if (event == 'p') {
                    const [x, y, pixel] = json;
                    PPClient.last = [x, y, pixel];
                    if (PPClient.onclick && PPClient.onclick(x, y, pixel) === false) return;
                }

                return arguments;
            }
        };
        PPClient.CWSS.setHook(module.hook);
    };



    PPClient.modules.Compiler = module;
})();
// 0vC4#7152