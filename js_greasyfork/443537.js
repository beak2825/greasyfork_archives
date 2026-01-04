// ==UserScript==
// @name         XHS
// @license      MIT
// @version      1.2
// @description  XML Http Sniffer
// @author       0vC4
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @namespace    https://greasyfork.org/users/670183
// ==/UserScript==





const XHS = (() => {
    const xhs = window.xhs || {};
    if (xhs.xhr) return xhs;
    
    
    
    
    
    const pipe = (type, ...next) => function() {
        for (const hook of xhs.hooks.sort((a, b) => b.priority - a.priority)) {
            if (!hook[type]) continue;
            if (!arguments) break;
            arguments = hook[type].call(this, ...arguments);
        }
        
        if (!arguments) return;
        next.flat().forEach(func => func.call(this, ...arguments));
    };
    
    
    
    
    
    const proto = XMLHttpRequest.prototype;
    xhs.xhr = XMLHttpRequest;
    xhs.open = proto.open;
    xhs.send = proto.send;
    
    xhs.hooks = [];
    xhs.setHook = hook => {
        xhs.hooks.push(hook);
        return xhs;
    };
    xhs.setHooks = (...hooks) => {
        xhs.hooks.push(...hooks.flat());
        return xhs;
    };
    
    
    
    
    
    proto.open = function() {
        const [method, url] = arguments;
        Object.assign(this, { method, url });
        pipe('open', xhs.open).call(this, ...arguments);
    };
    
    
    
    
    
    proto.send = function() {
        this._onload = this.onload || (() => 0);
        
        this.onload = function() {
            Object.defineProperty(this, 'response', {
              enumerable: true,
              configurable: true,
              writable: true,
              value: this.response,
            });
            
            pipe('onload', this._onload).call(this, ...arguments);
        };
        
        pipe('send', xhs.send).call(this, ...arguments);
    };
    
    
    
    
    
    return xhs;
})();
// 0vC4#7152