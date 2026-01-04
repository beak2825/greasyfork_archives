// ==UserScript==
// @license      MIT
// @name         CWSS
// @version      2.7.1
// @description  Complete WebSocket Sniffer
// @author       0vC4
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @namespace    https://greasyfork.org/users/670183
// ==/UserScript==





const CWSS = (() => {
    const CWSS = window.CWSS || {};
    if (CWSS.ws) return CWSS;
    
    
    
    
    
    const proto = WebSocket.prototype;
    const def = Object.defineProperty;
    const rebase = (obj, key, list) => def(obj, key, {
        configurable: true,
        enumerable: true,
        set: func => list.push(func)
    });
    const native = (obj, value) => {
        obj.toString = function() {
            return Function.toString.call(value, ...arguments);
        };
    };
    
    
    
    
    
    const pipe = (type, ...next) => async function() {
        for (const hook of CWSS.hooks.sort((a, b) => b.priority - a.priority)) {
            if (!hook[type]) continue;
            if (!arguments) break;
            arguments = await hook[type].call(this, ...arguments);
        }
        
        if (!arguments) return;
        next.flat().forEach(func => func.call(this, ...arguments));
    };
    const pipeSync = type => function() {
        for (const hook of CWSS.hooks.sort((a, b) => b.priority - a.priority)) {
            if (!hook[type]) continue;
            if (!arguments) break;
            arguments = hook[type].call(this, ...arguments);
        }
        return arguments;
    };
    
    
    
    
    
    CWSS.ws = window.WebSocket;
    CWSS.send = proto.send;
    CWSS.addList = proto.addEventListener;
    
    CWSS.sockets = [];
    CWSS.hooks = [];
    CWSS.setHook = hook => {
        CWSS.hooks.push(hook);
        return CWSS;
    };
    CWSS.setHooks = (...hooks) => {
        CWSS.hooks.push(...hooks.flat());
        return CWSS;
    };
    
    
    
    
    
    proto.send = pipe('send', CWSS.send);
    proto.addEventListener = function() {
        const type = arguments[0];
        const func = arguments[1];
        const list = this.listeners[type];
        if (list) list.push(func);
        else CWSS.addList.call(this, ...arguments);
    };
    
    
    
    
    
    window.WebSocket = function() {
        arguments = pipeSync('args').call(this, ...arguments);
        const ws = new CWSS.ws(...arguments);
        
        for (const hook of CWSS.hooks.sort((a, b) => b.priority - a.priority))
            Object.assign(hook, {
                ws,
                async sendServer(data) {
                    CWSS.send.call(ws, data);
                },
                async sendClient(data) {
                    ws.listeners.message
                    .forEach(func => 
                        func.call(ws, {data})
                    );
                },
            });
        
        CWSS.sockets.push(ws);
        pipe('init').call(ws);
        
        ws.listeners = {};
        for (const key of ['open', 'message', 'close']) {
            const list = ws.listeners[key] = [];
            CWSS.addList.call(ws, key, pipe(key, list));
            rebase(ws, 'on'+key, list);
        }
        
        return ws;
    };
    
    
    
    
    
    for (const k in CWSS.ws)
        if (k != 'prototype')
            window.WebSocket[k] = CWSS.ws[k];
    
    for (const k in proto)
        if (k != 'constructor')
            try {
                window.WebSocket.prototype[k] = proto[k];
            } catch (e) {};
    
    
    
    
    
    native(proto.send, CWSS.send);
    native(proto.addEventListener, CWSS.addList);
    native(window.WebSocket, CWSS.ws);
    
    
    
    
    
    window.CWSS = CWSS;
    return CWSS;
})();
// 0vC4#7152