// ==UserScript==
// @name         DRDL
// @description  Discord Recent Deletions Logger - view recent edits and deletions in console.
// @author       0vC4
// @version      1.0
// @namespace    https://greasyfork.org/users/670183-exnonull
// @match        *://discordapp.com/*
// @match        *://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @run-at       document-start
// @grant        none
// @license      MIT
// @require      https://greasyfork.org/scripts/438620-workertimer/code/WorkerTimer.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.10/pako.js
// @downloadURL https://update.greasyfork.org/scripts/482425/DRDL.user.js
// @updateURL https://update.greasyfork.org/scripts/482425/DRDL.meta.js
// ==/UserScript==





const log = console.log;
const logError = console.error;
(() => {
    window.console.log = ()=>0;
    window.console.info = ()=>0;
    window.console.warn = ()=>0;
    window.console.warning = ()=>0;
    window.setTimeout = window.WorkerTimer.setTimeout;
    window.setInterval = window.WorkerTimer.setInterval;
    window.clearTimeout = window.WorkerTimer.clearTimeout;
    window.clearInterval = window.WorkerTimer.clearInterval;
})();





(() => {
    class Client {
        static ws = null;

        static guilds = [];
        static channels = [];
        static users = [];
        static undefinedChannel = {
            path: 'undefined',
            name: 'undefined',
            guild: null,
            parent: null,
            messages: [],
            addMessage(msg) {
                const minutes = 60;
                Client.undefinedChannel.messages = Client.undefinedChannel.messages.filter((m, i) => {
                    if ((+new Date() - +new Date(m.timestamp))/1e3 < 5*minutes) return true;
                    return i < 200;
                });
                Client.undefinedChannel.messages.push(msg);
            }
        };

        static guild(id) {
            return Client.guilds.find(g=>g.id == id);
        }
        static channel(id) {
            return Client.channels.find(c=>c.id == id) ?? Client.undefinedChannel;
        }
        static user(id) {
            return Client.users.find(u=>u.id == id);
        }

        static newChannel(channel) {
            if (!channel) return;
            if (channel.recipient_ids?.length == 1)
                channel.name ??= '@' + Client.user(u => u.id == channel.recipient_ids[0])?.username;

            Object.defineProperty(channel, 'guild', {
                get(){
                    return Client.guild(channel.guild_id);
                },
            });
            Object.defineProperty(channel, 'parent', {
                get(){
                    return Client.channel(channel.parent_id);
                },
            });
            Object.defineProperty(channel, 'path', {
                get(){
                    const ch = Client.channel(channel.parent_id);
                    let name = this.name;

                    if (ch?.parent_id) return ch.path + '/' + name;
                    return channel.guild?.properties?.name + '/' + name;
                },
            });

            channel.messages = [];
            channel.addMessage = (msg) => {
                const minutes = 60;
                channel.messages = channel.messages.filter((m, i) => {
                    if ((+new Date() - +new Date(m.timestamp))/1e3 < 5*minutes) return true;
                    return i < 200;
                });
                channel.messages.push(msg);
            }
            Client.channels.push(channel);
        }

        static newMessage(message) {
            if (!message) return {};

            message.history = [];
            message.getHistory = () => [message, ...message.history];
            message.getLastEdit = () => [(message.history[message.history.length-2] ?? message), message.history[message.history.length-1] ?? message];
            message.updated = false;
            message.deleted = false;
            if (message.edited_timestamp) {
                message.updated = true;
            }

            message.update = function(msg) {
                if (!msg.edited_timestamp) return;
                message.history.push(msg);
                message.updated = true;
                Client.updates.push(message);

                log('<EDIT>');
                log(
                    message.channel.path,
                    '@'+message.author.username+':',
                    message.getLastEdit()[0].content ?? '<???>', ' |-> ', msg.content,
                );
                if (message.embeds.map(a=>a.url).join(' ') != '') log('embeds:', message.embeds.map(a=>a.url).join(' '));
                if (message.attachments.map(a=>a.url).join(' ') != '') log('attachments:', message.attachments.map(a=>a.url).join(' '));
            };

            message.delete = function(msg) {
                message.history.push(msg);
                message.deleted = true;
                Client.deletions.push(message);

                log('<DELETE>');
                log(
                    message.channel.path,
                    '@'+message.author.username+':',
                    message.getLastEdit()[0].content,
                );
                if (message.embeds.map(a=>a.url).join(' ') != '') log('embeds:', message.embeds.map(a=>a.url).join(' '));
                if (message.attachments.map(a=>a.url).join(' ') != '') log('attachments:', message.attachments.map(a=>a.url).join(' '));
                if (message.updated) log(message.getHistory().map(m => !m ? '' : m.content).filter(a=>!!a).join(' |-> '));
            };

            Object.defineProperty(message, 'channel', {
                get(){
                    return Client.channel(message.channel_id);
                },
            });

            return message;
        }

        static message(id) {
            for (let c of Client.channels)
                for (let m of c.messages)
                    if (m.id == id)
                        return m;
            return null;
        }

        static forEachMessage(cb) {
            Client.channels.forEach(c => c.messages.forEach(m => cb(m)));
        }

        static updates = [];
        static deletions = [];
        static actions = [];

        static onMessage(msg) {
            Client.actions.push(msg);
            let data = msg.d;

            if (msg.t == 'READY') {
                Client.guilds = msg.d.guilds;
                Client.users = msg.d.users;
                [
                    ...msg.d.private_channels,
                    ...msg.d.guilds.map(g => [
                        ...g.channels.map(c => {
                            c.guild_id ??= g.id;
                            return c;
                        }), ...g.threads.map(t => {
                            t.guild_id ??= g.id;
                            return t;
                        })
                    ]).flat(),
                ].forEach(Client.newChannel);
            }

            if (msg.t == 'MESSAGE_CREATE') {
                if (!Client.message(data.id)) Client.channel(data.channel_id).addMessage(Client.newMessage(data));
            }

            if (msg.t == 'MESSAGE_UPDATE') {
                const msg = Client.newMessage(data);
                if (!Client.message(msg.id)) Client.channel(data.channel_id).addMessage(msg);
                else Client.message(msg.id)?.update(msg);
            }

            if (msg.t == 'MESSAGE_DELETE') {
                Client.message(data.id)?.delete(data);
            }
        }
    };
    window.client = Client;





    // [init decoder]
    // took from discord source code, compress=zlib-stream (pako.js 1.0.10)
    let decoder;
    function initDecoder() {
        if (decoder) log('reinit decoder');
        decoder = new window.pako.Inflate({chunkSize:65536, to: "string"});
        decoder.onEnd = decodeOutput;
    }
    function decodeOutput(status) {
        let msg;
        if (status !== window.pako.Z_OK)
            throw Error("zlib error, ".concat(status, ", ").concat(decoder.strm.msg));
        let {chunks: a} = decoder
        , s = a.length;
        if (true) // wants string
            msg = s > 1 ? a.join("") : a[0];
        else if (s > 1) {
            let e = 0;
            for (let t = 0; t < s; t++)
                e += a[t].length;
            let n = new Uint8Array(e)
            , i = 0;
            for (let e = 0; e < s; e++) {
                let t = a[e];
                n.set(t, i);
                i += t.length;
            }
            msg = n
        } else
            msg = a[0];
        a.length = 0;
        try {
            Client.onMessage(JSON.parse(msg));
        } catch (e) {
            logError(e);
        }
    }
    function decodeInput(event) {
        if (event instanceof ArrayBuffer) {
            let buffer = new DataView(event);
            let fin = buffer.byteLength >= 4 && 65535 === buffer.getUint32(buffer.byteLength - 4, !1);
            decoder.push(event, !!fin && window.pako.Z_SYNC_FLUSH)
        } else
            throw Error("Expected array buffer, but got " + typeof event)
    }





    // [hook actions]
    // cancel fast connecct
    Object.defineProperty(window, '_ws', {set(){}});

    // hook socket actions
    const hook = (obj, key, fn) => {
        const scheme = Object.getOwnPropertyDescriptor(obj, key);
        Object.defineProperty(obj, key, {
            set(value) {
                fn.call(this, value, () => Object.defineProperty(this, 'onmessage', {
                    ...scheme
                }));
            }
        });
    };

    hook(window.WebSocket.prototype, 'onmessage', function(callback, restore) {
        restore();
        this.onmessage = function(event) {
            if (!this.url.match(/^wss\:\/\/[a-zA-Z0-9-]+\.discord\.gg/)) return callback.call(this, event);

            if (!Client.ws || Client.ws.readyState == WebSocket.CLOSED) {
                Client.ws = this;
                initDecoder();
            }
            decodeInput(event.data);

            callback.call(this, event);
        };
    });

    // hook http message history
    (() => {
        const proto = window.XMLHttpRequest.prototype;

        if (!proto._open) proto._open = proto.open;
        proto.open = function () {
            const [method, url] = arguments;
            Object.assign(this, {method, url});
            return this._open.apply(this, arguments);
        };

        if (!proto._send) proto._send = proto.send;
        proto.send = function (body) {
            if (this.url.match(/discord\.com\/api\/v9\/channels\/[0-9]+\/messages\?/)) {
                this._lnd = this.onload;
                this.onload = function (e) {
                    try {
                        const list = JSON.parse(this.response);
                        list.map(Client.newMessage).forEach(m => Client.channel(m.channel_id).addMessage(m));
                    } catch (e) {logError(e);}
                    this._lnd?.call(this, e);
                };
            }
            return this._send.apply(this, arguments)
        };
    })();
})();





// 0vC4#7152