// ==UserScript==
// @name         Diep.io Region Decoder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  press L and region shows
// @author       el bismut
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/438395/Diepio%20Region%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/438395/Diepio%20Region%20Decoder.meta.js
// ==/UserScript==
//original content

var region = '';
var link = '';
function serverConnectHook(server) {
    region = server.split("lobby.")[1].split(".hiss")[0];
}
window.WebSocket = new Proxy(WebSocket, {construct(t, args) {serverConnectHook(args[0]); return Reflect.construct(t, args)}});
CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
    apply(fillText, ctx, [text, x, y, ...blah]) {
        if(text.includes("ms") && text.includes(".")) {
            const lengthBefore = ctx.measureText(text).width;
            text = text.split(" ms")[0] + "ms " + region;
            ctx.textAlign = 'right';
            x += lengthBefore;
        }
        fillText.call(ctx, text, x, y, ...blah);
    }
});
CanvasRenderingContext2D.prototype.strokeText = new Proxy(CanvasRenderingContext2D.prototype.strokeText, {
    apply(strokeText, ctx, [text, x, y, ...blah]) {
        if(text.includes("ms") && text.includes(".")) {
            const lengthBefore = ctx.measureText(text).width;
            text = text.split(" ms")[0] + "ms " + region;
            ctx.textAlign = 'right';
            x += lengthBefore;
        }
        strokeText.call(ctx, text, x, y, ...blah);
    }
});