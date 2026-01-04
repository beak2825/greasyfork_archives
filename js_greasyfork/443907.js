// ==UserScript==
// @name         PPPC
// @description  Pixel Place Parallel Connections
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
    if ('Connect' in PPClient.modules) return;



    const pongAlive = () => {
        const {random} = Math;
        const word = 'gmbozcfxta';
    
        function hash(size) {
            const arr = [];
            const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for (var i = 0; i < size; i++) arr.push(str[random()*str.length | 0]);
            return arr.join('');
        }
    
        function hash2(size) {
            const arr = [];
            const str = "gmbonjklezcfxtaGMBONJKLEZCFXTA";
            for (var i = 0; i < size; i++) arr.push(str[random()*str.length | 0]);
            return arr.join('');
        }
    
        let result = '';
        const seed = (((new Date().getTime()/1e3|0) + 1678) + '').split('');
        const arr = [hash(5),hash(7),hash2(3),hash(8),hash2(6),hash(3),hash(6),hash2(4),hash(7),hash(6)];
        for (const i in seed) {
            result += arr[i];
            result += !(random()*2|0) ? word[+seed[i]].toUpperCase() : word[+seed[i]];
        }
        result += '0=';
    
        return `42["pong.alive","${result}"]`;
    };



    const module = {
        bots: [],
        settings: new Proxy(JSON.parse(localStorage.getItem('settings')||'{}'), {
            get(target, key) {
                return target[key];
            },
            set(target, key, value) {
                target[key] = value;
                localStorage.setItem('settings', JSON.stringify(target));
                return true;
            },
            remove(target, key) {
                delete target[key];
                localStorage.setItem('settings', JSON.stringify(target));
                return true;
            }
        })
    };
    module.args = {};
    module.config = ({timer}) => Object.assign(module.args, {timer});



    const {settings} = module;
    Object.assign(module, {
        async show() {
            return JSON.stringify([
                (await cookieStore.get('authId')).value,
                (await cookieStore.get('authToken')).value,
                (await cookieStore.get('authKey')).value
            ]);
        },
        async add(username, scheme) {
            settings.userlist[username] = typeof scheme == 'string' ? JSON.parse(scheme) : scheme;
            return true;
        },
        async remove(username) {
            delete settings.userlist[username];
            return true;
        },
        
        
        
        async save() {
            settings.current = {
                authId: (await cookieStore.get('authId')).value,
                authToken: (await cookieStore.get('authToken')).value,
                authKey: (await cookieStore.get('authKey')).value
            };
        },
        async load(scheme = null) {
            await cookieStore.set('authId', scheme ? scheme[0] : settings.current.authId);
            await cookieStore.set('authToken', scheme ? scheme[1] : settings.current.authToken);
            await cookieStore.set('authKey', scheme ? scheme[2] : settings.current.authKey);
        },
        
        
        
        async join(username, server) {
            if (!settings.userlist[username]) return null;
            const [id, token, key] = settings.userlist[username];
            
            await module.save();
            await cookieStore.set('authId', id);
            await cookieStore.set('authToken', token);
            await cookieStore.set('authKey', key);
            
            await fetch(`https://pixelplace.io/api/get-painting.php?id=${server}&connected=1`);
            if (!(await cookieStore.get('authToken'))) {
                console.log(
                    username,
                    "is banned or it has wrong data, please remove this account using PPClient.remove('",
                    username,
                    "');"
                );
                await module.load();
                return null;
            }
            
            settings.userlist[username] = [
                (await cookieStore.get('authId')).value,
                (await cookieStore.get('authToken')).value,
                (await cookieStore.get('authKey')).value
            ];
            await module.load();

            return settings.userlist[username];
        },
        
        async connect(username, boardId) {
            const result = await module.join(username, boardId);
            if (!result) return null;
            if (module.bots.find(ws => ws.username == username)) return null;
            const [authId, authToken, authKey] = result;
            
            const restart = () => {
                const {timer} = module.args;
                const user = new WebSocket('wss://pixelplace.io/socket.io/?EIO=3&transport=websocket');
                user.username = username;
                user.serverId = boardId;
                user.onmessage = ({data}) => {
                    const [code, msg] = data.split(/(?<=^\d+)(?=[^\d])/);
                    if (code == '40') user.send('42' + JSON.stringify(
                        ["init", { authKey, authToken, authId, boardId }]
                    ));
                    
                    const message = JSON.parse(msg || '[]');
                    if (message.pingInterval) user.ping = timer.setInterval(() => user.send('2'), message.pingInterval);
                    
                    if (!message.length) return arguments;
                    const [event, json] = message;
                    if (event == 'throw.error' && ![3].includes(json)) {
                        user.kick = true;
                        user.close();
                    }
                    if (event == 'canvas.alert' && json.includes('Your account')) {
                        console.log('Banned, reason: ', json);
                        user.kick = true;
                        user.close();
                    }
                    if (event == 'ping.alive') user.send(pongAlive());
                    if (event == 'canvas') {
                        user.ready = true;
                        console.log(username, 'bot connected');
                    }
                    if (event == 'p') user.count = PPClient.config.packetCount;
                };
                user.onclose = async () => {
                    timer.clearInterval(user.ping);
                    module.bots.splice(module.bots.indexOf(user), 1);
                    if (!user.kick) {
                        console.log(username, 'bot restarting');
                        restart();
                    } else {
                        console.log(username, 'bot disconnected');
                    }
                };
                user.set = (x,y,p) => user.send(`42["p",[${x},${y},${p},1]]`);
                module.bots.push(user);

                return user;
            };
            return restart();
        },

        async connectAll(serverId) {
            const names = Object.keys(settings.userlist);
            const arr = [];

            let n = 0;
            for (let i = 0; i < names.length; i++) {
                let ws = null;

                try {
                    ws = await module.connect(names[i], serverId);
                } catch (e) {
                    ws = null;
                }

                if (!ws) {
                    n++;
                    continue;
                }

                arr[i-n] = ws;
                ws.addEventListener('close', e => arr.splice(arr.indexOf(ws), 1));
            }

            console.log(names.length-n, 'bots connected');
            return arr;
        },



        async disconnect(...usernames){
            usernames = usernames.flat();
            module.bots.filter(Boolean).map(ws => {
                if (!ws || !ws.close) return;
                ws.ignore = true;
                ws.kick = true;
                if (!usernames.length) return ws.close();
                if (usernames.includes(ws.username)) return ws.close();
            });
        }
    });
    
    
    
    if (!settings.userlist) settings.userlist = {};



    PPClient.connect = async (username) => await module.connect(username, PPClient.serverId);
    PPClient.connectAll = async () => await module.connectAll(PPClient.serverId);
    PPClient.disconnect = module.disconnect;
    PPClient.link = async (username) => await module.add(username, JSON.parse(await module.show()));
    PPClient.show = module.show;
    PPClient.add = module.add;
    PPClient.remove = module.remove;
    Object.defineProperty(PPClient, 'userlist', {enumerable:true,configurable:true,get(){
        return settings.userlist;
    }});
    
    PPClient.modules.Connect = module;
})();
// 0vC4#7152