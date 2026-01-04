// ==UserScript==
// @name         Zombs Retextured (Browser)
// @namespace    https://discord.gg/fcf3SH6sHJ
// @version      1.0
// @description  Retextured but for browser
// @author       Jamz
// @match        https://zombsroyale.io/
// @icon         https://www.google.com/s2/favicons?domain=zombsroyale.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441038/Zombs%20Retextured%20%28Browser%29.user.js
// @updateURL https://update.greasyfork.org/scripts/441038/Zombs%20Retextured%20%28Browser%29.meta.js
// ==/UserScript==

var config = [
    ["3 Little Monkies","Colossal Bat Wings"],
    ["Bat","Saturn Chute"],
    ["8-Bit Blade", "Surtr Blade"],
    ["Happy","Poop"],
    ["Albert","8-Bit Default"],
    ["Bounty Hunter (Blue)","8-Bit Glasses"],
    ["Alien Intel Gatherer","Daedalus Wings"],
    ["Galaxy","Adept Wizard"],
    ["Giant Bot","Afro (Blue)"],
    ["Xeno","Afro (Orange)"],
    ["Scientist","Afro (Peach)"],
    ["Demon Wings","Alien Tentacles"],
    ["Berry Branch Wings","Android Utility Pack"],
    ["Antler Crown","Toucan Wings"],
    ["Alien Beast","Afro (Pink)"],
    ["Alien Brain","Afro (Purple)"],
    ["Purple Spear","All-Seeing Sword"],
    ["Alien Beast Claws","Anchor Sword (Blue)"],
    ["Discord Nitro Gloves","Anchor Sword (Light Purple)"],
    ["Chief Tribal Mask","Afro (Red)"],
    ["Spooky Skull","Afro (Sky)"],
    ["Spooky Flame Wings","Azure Football Pack"],
    ["American Wings","Baby Koala"],
    ["Dino Wings","Ballooned Tail"],
    ["Bone Wings","Bottled Message"],
    ["Evil Wings","Bow Tied"],
    ["Cat Tail","Brilliant Shells"],
    ["Unlucky Cat","Afro (White)"],
    ["Ankylosaur Fossil","Aggro Lobster"],
    ["Apep","Air Daredevil"],
    ["Terror","Alien Automaton"],
    ["Terror Eyes","Alien Identifier"],
    ["Terror Corruption","Amazonian Manatee"],
    ["Black Knight","Ancient Wizard Dragon"],
    ["Block Of Coal","Android"],
]


// here we will modify the response
function modifyResponse(response) {

    var original_response, modified_response, string_original;

    if (this.readyState === 4) {
        if (!response.target.responseURL.includes("/api/shop/available")) return

        // we need to store the original response before any modifications
        // because the next step will erase everything it had
        var enc = new TextEncoder("utf-8");
        var dec = new TextDecoder("utf-8");
        original_response = JSON.parse(dec.decode(response.target.response));

        // here we "kill" the response property of this request
        // and we set it to writable
        Object.defineProperty(this, "response", { writable: true });

        config.forEach(function (retexture) {
            var findIndex = original_response.items.findIndex((o) => o.name == retexture[0]);
            var replaceIndex = original_response.items.findIndex((o) => o.name == retexture[1]);
            var ogFindSku = original_response.items[findIndex].sku
            var ogReplaceSku = original_response.items[replaceIndex].sku
            original_response.items[findIndex].sku = ogReplaceSku
            original_response.items[replaceIndex].sku = ogFindSku
        })

        this.response = enc.encode(JSON.stringify(original_response))
    }
}

// here we listen to all requests being opened
function openBypass(original_function) {

    return function (method, url, async) {

        // here we listen to the same request the "original" code made
        // before it can listen to it, this guarantees that
        // any response it receives will pass through our modifier
        // function before reaching the "original" code
        this.addEventListener("readystatechange", modifyResponse);

        // here we return everything original_function might
        // return so nothing breaks
        return original_function.apply(this, arguments);

    };

}

// here we override the default .open method so that
// we can listen and modify the request before the original function get its
XMLHttpRequest.prototype.open = openBypass(XMLHttpRequest.prototype.open);
// to see the original response just remove/comment the line above

/---END RETEXTURE-----------------------------------------------------------------/// ==UserScript==