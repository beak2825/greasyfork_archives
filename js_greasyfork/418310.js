// ==UserScript==
// @name         Xat Plus
// @namespace    http://sulptax.io/
// @version      0.4.7
// @description  Unaffiliated extension for the Xat HTML5 Chatbox. RIP Xat Edition.
// @author       sulptax
// @match        https://xat.com/content/web/*/box/www/classic.html
// @require      http://code.jquery.com/jquery-3.5.1.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/418310/Xat%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/418310/Xat%20Plus.meta.js
// ==/UserScript==
const secret = 'sulptax';

function xp_encrypt(str) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
}

function xp_decrypt(str) {
    return CryptoJS.enc.Base64.parse(str).toString(CryptoJS.enc.Utf8);
}

function xp_aes_encrypt(str) {
    return CryptoJS.AES.encrypt(str, secret).toString();
}

function xp_aes_decrypt(str) {
    var bytes = CryptoJS.AES.decrypt(str, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Allow functions below to be used in the console, not like these are used for storing important data anyways.
// You must be at the chat directly for these to work:
// https://xat.com/content/web/R00022/box/www/classic.html
unsafeWindow.xp_encrypt = xp_encrypt;
unsafeWindow.xp_decrypt = xp_decrypt;

var users = {
    "585435788": {
        "type": "color", // color, pawn, pawn2
        "reghide": true, // like reghide power
        "v": "000001", // the color value
    },
    "400444434": {
        "type": "color",
        "v": "y",
        "effective": true, // overwrites the message pawn as well if true, This is the case by default.
        "persistent": true // keep the pawn color regardless of the pawn used in the list
    },
    "287773358": { // Shadez bot is here for demonstration purposes, because it's everywhere.
        "type": "pawn2", // pawn2 changes the pawn type
        "v": "p1bot" // examples: p1bot, p1emerald, p1pwn
    },
    "981989": {
        "type": "pawn2",
        "v": "p1emerald#y" // can also use color codes in pawn2 value
    },
    "30000013": {
        "type":"pawn2",
        "v": "p1emerald#r#r"
    }
}

var effectiveChanges = {}
const observer = new MutationObserver((mutationList, observer) => {
    mutationList.forEach((mutation) => {
        if (mutation.type === "childList") {
            if (mutation.target.id == "idvisitors" || mutation.target.id == "idfriends" || mutation.target.id == "messages") {
                mutation.addedNodes.forEach((node) => {
                    Object.keys(users).forEach(function(user) {
                        var color = "";
                        var holder = $(node).find(".holder:first");
                        var res = holder.attr("data-sm");
                        if ($(node).attr("data-user") == user) {
                            var str = res
                            if (res.split("#")[1] != "ff0000" && res.split("#")[1] != "ff0000)_20") {
                                if (users[$(node).attr("data-user")]['type'] == "color") {
                                    color = users[$(node).attr("data-user")]['v']
                                    res = str.split("#");
                                    res[1] = color;
                                    res = res.join("#");
                                    res = res + ")_20"
                                }
                                if (users[$(node).attr("data-user")]['type'] == "pawn") {
                                    res = users[$(node).attr("data-user")]['v']
                                }
                                var res3 = "";
                                if (users[$(node).attr("data-user")]['type'] == "pawn2") {
                                    var res2 = str.split("#");
                                    res2[0] = res2[0].split("(")[0] + "(" + users[$(node).attr("data-user")]['v'];
                                    res = res2.join("#")
                                    res3 = res.split("#", 2).join("#") + ")_20";
                                } else {
                                    res3 = res;
                                }
                                if (Object.keys(users[$(node).attr("data-user")]).includes("reghide")) {
                                    $(node).find(".relIcon2").hide();
                                }
                                var filters = "";
                                if (Object.keys(users[$(node).attr("data-user")]).includes("glow")) {
                                    if(isColor(users[$(node).attr("data-user")]['glow'])) {
                                        filters = filters + "drop-shadow(0px 0px 0.2rem " + users[$(node).attr("data-user")]['glow'] + ") "
                                    }
                                }
                                if(filters) {
                                   holder.css("filter", filters);
                                }
                                if (!(Object.keys(users[$(node).attr("data-user")]).includes("effective") && !(users[$(node).attr("data-user")]['effective'] == true))) {
                                    effectiveChanges[$(node).find(".message").text()] = res3
                                } else if (color && (Object.keys(users[$(node).attr("data-user")]).includes("persistent") && users[$(node).attr("data-user")]['persistent'])) {
                                    effectiveChanges[$(node).find(".message").text()] = "s_(p1pwn#" + color + ")_20"
                                }
                                holder.attr("data-sm", res)
                            }
                        }
                    });
                });
            }
        }
    });
});
messages.addMessageP = messages.addMessage
messages.addMessage = function(t) {
    messages.addMessageP(t);
}
visitors.addVisitorP = visitors.addVisitor
visitors.addVisitor = function(e, l) {
    visitors.addVisitorP(e, l);
    var e_parsed = JSON.parse(e);
    if (Object.keys(e_parsed).includes("image")) {
        e_parsed['image'].split("#").forEach((im) => {
            if (true) { // im.toString(CryptoJS.enc.Utf8)
                try {
                    var checkForPawn = xp_decrypt(im)
                    if (checkForPawn && (checkForPawn.startsWith('{') && checkForPawn.endsWith('}'))) {
                        // example JSON
                        // {"type":"pawn2", "v":"p1emerald#y#hat3#w1i0ic#y", "reghide": true}
                        // {"type":"pawn2", "v":"p1emerald#y#hat3#w1i0ic#y", "reghide": true, "glow":"red"}
                        console.log("JSON PAWN DETECTED IN avatar/image:", checkForPawn);
                        try {
                            users[e_parsed['id']] = JSON.parse(checkForPawn);
                        } catch (e) {
                            console.log("Error parsing pawn code");
                        }
                    } else if (checkForPawn && checkForPawn.substring(0, 2) == "p1") {
                        console.log("NORMAL PAWN DETECTED IN avatar/image:", checkForPawn);
                        users[e_parsed['id']] = {
                            "type": "pawn2",
                            "v": checkForPawn
                        }
                    }
                } catch(e) {
                    // decrypt error?
                }
            }
        })
    }
}
const observer2 = new MutationObserver((mutationList, observer) => {
    mutationList.forEach((mutation) => {
        if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
                if (Object.keys(effectiveChanges).includes($(node).find(".messagesName").find(".message").text())) {
                    $(node).find(".messagesName").find(".holder:first").attr("data-sm", effectiveChanges[$(node).find(".messagesName").find(".message").text()])
                }
            });
        }
    });
});
observer.observe(document.querySelector("#visitorsContainer"), {
    childList: true,
    subtree: true
});
observer2.observe(document.querySelector("#messagesContainer"), {
    childList: true,
    subtree: true
});
function isColor(color) {
    var div = $("<div>");
    div.css("border", "1px solid " + color);
    return (div.css("border-color") != "")
}