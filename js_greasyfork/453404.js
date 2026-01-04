// ==UserScript==
// @name         Stratums CrasheR
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  x
// @author       Pulsar
// @match        *://*.stratums.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453404/Stratums%20CrasheR.user.js
// @updateURL https://update.greasyfork.org/scripts/453404/Stratums%20CrasheR.meta.js
// ==/UserScript==
let ok = prompt("Enable crash script?")
if (ok) {
let k = Proxy;
let c = null;
let s = WebSocket.prototype.send;
let a = WebSocket.prototype;
let vc = WebSocket.prototype;
a.send = new k(a.send,{
    set(val) { },
    get(target,prop,rec) {
        if (prop.toString().includes("toString")) return s[prop].toString(); // me when toString
        return s[prop];
    },
    apply(target,dat,args) {
        if (!c) {
            c = dat;
            a.send = vc.send // all work is done, fuck you :p
        }
        return target.apply(dat,args);
    }
});
let e = CanvasRenderingContext2D.prototype;
e.moveTo = new k(e.moveTo,{})
e.fillText=new k(e.fillText,{
    apply(target,dat,args) {
        if (args[0]==".crash") for (let r = 0;r < 50;r++) c.close()
        return target.apply(dat,args);
    }
});
}