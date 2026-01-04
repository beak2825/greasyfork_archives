  // ==UserScript==
// @name         Bot #2
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  none
// @author       COdER
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452492/Bot%202.user.js
// @updateURL https://update.greasyfork.org/scripts/452492/Bot%202.meta.js
// ==/UserScript==
const ban_myself = new WebSocket("wss://mppclone.com:8443"); ban_myself.onopen = () => ban_myself.send(JSON.stringify([{m: "hi"}]))