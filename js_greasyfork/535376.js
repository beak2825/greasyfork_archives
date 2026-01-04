// ==UserScript==
// @name         Discord prevent idle
// @description  Prevents Discord web app from going idle
// @license      MIT
// @namespace    rustyx.org
// @version      2025-05-15
// @author       rustyx
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535376/Discord%20prevent%20idle.user.js
// @updateURL https://update.greasyfork.org/scripts/535376/Discord%20prevent%20idle.meta.js
// ==/UserScript==

setInterval(function() {
    var e = document.createEvent('FocusEvent');
    e.initEvent('focus', true, true);
    document.body.dispatchEvent(e);
}, 30000);
setTimeout(function() {
    var token = (webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken();
    fetch('https://discord.com/api/v9/users/@me/settings-proto/1', {
        'method': 'PATCH',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        'body': '{"settings":"WgoKBgoEaWRsZRoA"}' // set status idle
    });
}, 9500);
setTimeout(function() {
    var token = (webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken();
    fetch('https://discord.com/api/v9/users/@me/settings-proto/1', {
        'method': 'PATCH',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        'body': '{"settings":"WgwKCAoGb25saW5lGgA="}' // set status online
    });
}, 10000);
console.log('Discord prevent idle timer armed'); // note: enable info-level logging in tampermonkey settings to see this output
