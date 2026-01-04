// ==UserScript==
// @name i30Mod
// @author       i30cps
// @version    1.9.0
// @description BEST WS SENDER MOD! ESC = Mod Menu,  P = WS Sender, L = Console Command. [ = advanced autochat. Change autochat: press L, then enter advAc2 = "<your autochat here>"  ||  Features: Increases FPS, Blocks Ads, Biome Map, and more! This is a utility mod, not a hack. Made by i30cps.
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://abc.moomoo.io/*
// @icon         data:image/png;base64,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
// @require https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=912797
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @license MIT
// @namespace -
// @downloadURL https://update.greasyfork.org/scripts/424655/i30Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/424655/i30Mod.meta.js
// ==/UserScript==

/*

                              NN
                  WW         WXXW
                 WXKXW       WXKXW
                  W0OKNNXXXNNNK0KN
                   N;kOOkxxk;:;NWW
                   :0;kkxdd:0:WNX
                   :;_:Kxdj;:NWN
                    ;jXXolWNlWN
                    WKkXddolo0W                  _________________________
                     WXWWNloOW                  |                         |
                      NWdNWkN                   | discord is rotator#2860 |
    nN               WNNWxOX                    |_________________________|
   cikx             WNNKOOKW
  CWKxxX          WNNWXNWNW
   kxxd         WNNWNNWN
   XdxX         WNNWWNWNW         WxXxxXxxXW
   kxxd        WNNWWNNWK     kxXdxXddxXxNwWXNN
   WOxKW       WNWWNWKWK  kxdkxxoXowxXWXxXNXW0N
    kkxxxxdd   NNWWWNWKxxdpllloooooddoxkdXNNWXN
     xxkddddxxxxKWWWWNxxxdlplclloodxkkOOWWNXLNJ
       xxxxxxdxxNNNWWNWkxxkxxxxkOO00WNWNWNXWXW
            dxxxxNWWWNWWWNWNWWWWNNWWWNWWWNWWW
                  NKKNWWWWNWWNNWWWNWWWWNNWW
                       WNWWWWWNWWWNWWNW

*/

// auto updater
let version = '1.9.0';

fetch('https://rotator.cf/i30version').then(response => response.text()).then(txt => {
    if (version < txt) alert(`You are not running the latest version of i30Mod (latest: ${txt}; current: ${version}) - Update at https://rotr.cf/i30`);
});

// antiinvis
CanvasRenderingContext2D.prototype.rotatef = CanvasRenderingContext2D.prototype.rotate
CanvasRenderingContext2D.prototype.rotate = function(e){
    if(Math.abs(e) > 1e300) {
        e = Math.atan2(Math.cos(e), Math.sin(e));
        this.globalAlpha = 0.85;
        this.rotatef(e);
    } else {
        this.rotatef(e);
    }
};

setTimeout(() => {
    $("#ot-sdk-btn-floating").remove() // remove the cookie thing
    $("#gameCanvas").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
    $("#enterGame").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
    document.getElementById('loadingText').innerHTML = "i30cps mod isn't unfair, and thus isn't a hack.";
    document.getElementById('gameName').innerHTML = 'i30cps';
    window.location.native_resolution = true;
    $("#consentBlock").css({display: "none"});
    $("#youtuberOf").css({display: "none"});
    $("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png')`});
    document.getElementById("linksContainer2").innerHTML = `<a href="https://www.youtube.com/" target="_blank" class="menuLink">YouTube</a> | <a href="https://discord.com/channels/@me" target="_blank" class="menuLink"> Discord </a> | <a href="https://youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" class="menuLink"> Little Bots </a> `
}, 1200);
console.log("The mod is working.");
$("#gameCanvas").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
$("#enterGame").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
document.getElementById('loadingText').innerHTML = "i30cps mod isn't unfair, and thus isn't a hack.";
document.getElementById('gameName').innerHTML = 'i30cps';
document.getElementById("leaderboard").append('i30cps\' Utility Mod');
window.location.native_resolution = true;
$("promoImgHolder").remove();
$("#consentBlock").css({display: "none"});
$("#youtuberOf").css({display: "none"});
$("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png')`});
document.getElementById("linksContainer2").innerHTML = `<a href="https://www.youtube.com/" target="_blank" class="menuLink">YouTube</a> | <a href="https://discord.com/channels/@me" target="_blank" class="menuLink"> Discord </a> | <a href="https://youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" class="menuLink"> Little Bots </a> `

try {
    document.getElementById("moomooio_728x90_home").style.display = "none"; //Remove sidney's ads
    $("#moomooio_728x90_home").parent().css({display: "none"});
} catch (e) {
    console.log("error removing ad");
}

function login(username, sk=0) {
    doNewSend(['sp', [{name: username, skin: sk, mofoll: 1}]])
}

let mouseX;
let mouseY;

let width;
let height;

var doAdvAc1 = false;
var doAdvAc2 = false;
var animateInterval = 1000;
var advAc2pos = 0;
var advAc1pos = 0;
// below is advanced autochat 1. it contains vulgar language, so i stored the base64 encoded version of it
// next line (advAc) contains the lyrics to russian paradise - ak-47
var advAc = atob('RXllcywgZXllcwpKdXN0IGxvb2sgaW4gbXkgZXllcwpKdXN0IGxvb2sgaW4gbXkgZXllcyBhbmQKeW91J2xsIHNlZSBydXNzaWFuIHBhcmFkaXNlCiAgICAgLSAtIC0gICAgIApKdXN0IGxvb2sgaW4gbXkgZXllcyBhbmQKeW91J2xsIHNlZSBydXNzaWFuIHBhcmFkaXNlCkp1c3QgbG9vayBpbiBteSBleWVzIGFuZAp5b3UnbGwgc2VlIHJ1c3NpYW4gcGFyYWRpc2UKSnVzdCBsb29rIGluIG15IGV5ZXMgYW5kCnlvdSdsbCBzZWUgcnVzc2lhbiBwYXJhZGlzZQpKdXN0IGxvb2sgaW4gbXkgZXllcyBhbmQKeW91J2xsIHNlZSBydXNzaWFuIHBhcmFkaXNlCkhlbGxvLCBteSBuYW1lIGlzIFZhc3lhCmFuZCBJJ20gZnJvbSBSb3N0b3Ygb24gRG9uCkFuZCByaWdodCBub3cgbWFraW5nIHJhcApvbiB0aGUgbWljcm9waG9uZQpJIHNob3cgeW91IHJlYWwgaG9vZCwKdmVyeSB2ZXJ5IGJhZCBob29kOgpObyBzaG9lcywgbm8gaG9tZSBhbmQgYmFkIGZvb2QKQnV0IHRoaXMgaXMgbXkgcm9vdHMsIG15IHRydXRoCkFkZGlkYXMgYm9vdHMsCmFuZCBjYXAgQ2hpY2FnbyBCdWxscwpDb3BzIHdhbm5hIGNhdGNoIG1lIGV2ZXJ5IGRheSwKYW5kIGV2ZXJ5IG5pZ2h0OwpCdXQgSSBhbSBub3QgYWZyYWlkLAp0aGF0J3MgbXkgUGFybGlhbWVudCBsaWdodApZZXN0ZXJkYXksIEkgaW5zdGFsbGVkClNreXBlIG9uIG15IGNvbXAKQnV0IHRoZXkgY3V0IG9mZiB0aGUgbGlnaHQKaW4gbXkgaG9tZQpJJ20gbm90IGxvb3NpbmcgaG9wZSwKaXRzIGJldHRlciB0byBsaXZlIGluIHRoaXMgZ28KVGhhbiBnbyBhd2F5IGFuZCBzZWxsIGEgc291bApTb21lYm9keSBzaG90IHNvbWUgYnJhdmUgaGVhcnQKU29tZWJvZHkgbGl0dGxlIGZpc2gsCnNvbWVib2R5IGJsb29kIHNoYXJrOwpTb21lYm9keSBtZWV0IHNvbWVib2R5LAphbmQga2lsbCBzb21lYm9keTsKSGFuZHMgKHplc3RvYm90aSBzbm8pCmhhdmUgc29tZSBtb25leQpNeSBFc2NhbGFkZSBpcyBsaWtlIEJvaW5nIDc0NwpJIHN0YXJ0IGluIHRoaXMgcm91bmQKYXQgZWxldmVuClRoZSB0aW1lIGlzIDExOjQ1ClRoaXMgaXMgbXkgbGlmZSwKbXkgbWluZCBhbmQgbXkgZmx5OwpJbSBkcml2aW5nIGZyb20KbXkgcGllY2Ugb2YgYSBidXkKSGFuZCBtb3ZlIG15IG1vbmV5CnRvIER1YmFpIG9yIFBhdGFpClRoaXMgaXMgcnVzc2lhbiBncm91bmQsCnRoaXMgaXMgcnVzc2lhbiBza3kKU29ycnkgbWFtYSwKSSdtIGEgZ2FuZ3N0YSAtIHZlcnkgYmFkIGd1eQpKdXN0IGxvb2sgaW4gbXkgZXllcyBhbmQKeW91J2xsIHNlZSBydXNzaWFuIHBhcmFkaXNlCkp1c3QgbG9vayBpbiBteSBleWVzIGFuZAp5b3UnbGwgc2VlIHJ1c3NpYW4gcGFyYWRpc2UKSnVzdCBsb29rIGluIG15IGV5ZXMgYW5kCnlvdSdsbCBzZWUgcnVzc2lhbiBwYXJhZGlzZQpKdXN0IGxvb2sgaW4gbXkgZXllcyBhbmQKeW91J2xsIHNlZSBydXNzaWFuIHBhcmFkaXNlCkhpIEkgYW0gVml0eWEsIGZyb20gRUtCCkNpdHkgb2YgRWthdGVyaW5hLCAyODcgeWVhcnMKSSB3cml0ZSBteSByYXAsIG9ubHkgZm9yIHlvdQpCZWNhdXNlIHlvdSBzYXk6Ck1hbiwgdGhpcyBpcyB0cnVlClRvZGF5CkkgZ28gb3VyIHN0dWRpbyBHYXpnb2xkZXIKQW5kIGNyZWF0ZSBvbiBjb21wdXRlcgphICJOZXcgZm9sZGVyIgpKIHB1c2ggcmFjayByYWNrCkkgc2luZyByYXAgcmFwCk1pY3JvcGhvbmUgY2hlY2sgY2hlY2sKVGhpcyBpcyByZWFsIHNoHml0IHNoHml0Ck1hbWEgaSBtaXNzIHlvdSwKY29taW5nIHNvb24sIEkgZ28gaG9tZQpJIGNyeSwKd2hlbiB0aGVuIEkgc2VlIG15IHBob3RvIGFsYnVtCkkgZG9uJ3QgZm9yZ2V0IGFib3V0Cm15IGJlcmV6YSBmcmllbmQKTW9zY293IGlzIGdyZWF0LApJIGNyZWF0ZSBuZXcgcmFwCkkgZG9uJ3QgaGF2ZSBoZXJlIGdpcmxmcmllbmQKTXkgbGFzdCBnaXJsIHNheToKImZ1HmNrIHlvdSBtYW4hIgoiZnUeY2sgeW91ciByYXAhIgpCZWNhdXNlCkkgc21va2UgZXZlcnlkYXkgTWFyaWh1YW5hCk1hcmlodWFuYSAtIEl0J3NhIG51bWJlciBvbm5hCkkgcGxheSBwbGF5c3RhdGlvbiBvbiBwbGFzbWEKaW4gbXkgZmxhdApUZWtrZW4gNiwKTW9ydGFsIEtvbWJhdCB2cy4gVW5pdmVyc2UKSSBwbGF5IGdhbWVzIHdpdGggbXkgZnJpZW5kcwpZZXMsIEkgbGlrZSBraWxsIHBvbGljZQpvbiBWaWNlIENpdHkgc3RyZWV0cwpKdXN0IGxvb2sgaW4gbXkgZXllcyBhbmQKeW91J2xsIHNlZSBydXNzaWFuIHBhcmFkaXNlCkp1c3QgbG9vayBpbiBteSBleWVzIGFuZAp5b3UnbGwgc2VlIHJ1c3NpYW4gcGFyYWRpc2UKSnVzdCBsb29rIGluIG15IGV5ZXMgYW5kCnlvdSdsbCBzZWUgcnVzc2lhbiBwYXJhZGlzZQpKdXN0IGxvb2sgaW4gbXkgZXllcyBhbmQKeW91J2xsIHNlZSBydXNzaWFuIHBhcmFkaXNlCkRlYXIgdW5jbGUsIEknbSB5b3VyIG5lcGhldywKU29uIG9mIHlvdXIgYnJvdGhlciwKR3JhbmRzb24gb2YgeW91ciBtb3RoZXIsCmFuZCB5b3VyIGRhdWdodGVyJ3MgY291c2luOwpBdW50IHNheXMgdGhhdAp5b3UgbGl2ZXMgaW4gdGhlIFVTQQpTb3JyeSBmb3IgbWlzdGFrZXMsCmdvb2dsZSB0cmFuc2xhdGU7Clllc3RlcmRheQpJIG9wZW5lZCBteSBiYW5rIGFjY291bnQKUGxlYXNlIHNlbmQgbWUgZG9sbGFycwppbiBhbnkgYW1vdW50ClZpc2EgYWxyZWFkeSBpbiBwYXNzcG9ydCwKSSdtIGdvaW5nIGZhc3QKWW91IGFuZCBBdW50LAp3aWxsIGJlIG15IG1vdGhlciBhbmQgZmF0aGVyCkxvbmcgdGltZSBhZ28sCndoZW4gSSB3YXMgYSBraWQKQmFkIGd1eXMgdGVhY2hlZCBtZQpob3cgdG8gc21va2Ugd2VlZDsKTm93IEkgaGF2ZSBubyBiYWQgaGFiaXRzLApzaWxlbnQgYmxhY2sgcmFiYml0cwpJIGNhbGwgaXQgRy10cmFpbmluZywKbWFkZSBtZSBoYXBweSBhbmQgZnJpZW5kbHk7CkkgaGF2ZSBhIGRyZWFtLApteSBkZWFyIHVuY2xlIFZvdmEKSSB3aWxsIGZseSB0byB5b3UgdmVyeSBzb29uLApVcmFsIHRvIElvd2EKQSBraXNzIHRvIHlvdXIgY2hpbGRyZW4sCm15IGxldHRlciBpcyBvdmVyCnkgVGU2UiBUYW0gUGFyYWRpc2UsCmEgVHlUIHh5ZUJv').split('\n');
// change this to change advanced autochat type 1, make sure each line is or is below thirty characters long.
var advAc2 = "Imagine having to cheat through the use of unfair advantages to beat others in a cow game. Whoever does is pathetic. Stop the cheaters. Get i30cpsmod - no unfair advantages. Bring more light into mooomoo.io. bit.ly/i30cpsmod";
var advertisement = "Imagine having to cheat through the use of unfair advantages to beat others in a cow game. Whoever does is pathetic. Stop the cheaters. Get i30cpsmod - no unfair advantages. Bring more light into mooomoo.io. bit.ly/i30cpsmod";
var rickroll = `We're no strangers to love; You know the rules and so do I (do I); A full commitment's what I'm thinking of; You wouldn't get this from any other guy; I just wanna tell you how I'm feeling; Gotta make you understand; Never gonna give you up; Never gonna let you down; Never gonna run around and desert you; Never gonna make you cry; Never gonna say goodbye; Never gonna tell a lie and hurt you; We've known each other for so long; Your heart's been aching, but you're too shy to say it (say it); Inside, we both know what's been going on (going on); We know the game and we're gonna play it; And if you ask me how I'm feeling; Don't tell me you're too blind to see; Never gonna give you up; Never gonna let you down; Never gonna run around and desert you; Never gonna make you cry; Never gonna say goodbye; Never gonna tell a lie and hurt you; Never gonna give you up; Never gonna let you down; Never gonna run around and desert you; Never gonna make you cry; Never gonna say goodbye; Never gonna tell a lie and hurt you; We've known each other for so long; Your heart's been aching, but you're too shy to say it (to say it); Inside, we both know what's been going on (going on); We know the game and we're gonna play it; I just wanna tell you how I'm feeling; Gotta make you understand; Never gonna give you up; Never gonna let you down; Never gonna run around and desert you; Never gonna make you cry; Never gonna say goodbye; Never gonna tell a lie and hurt you; Never gonna give you up; Never gonna let you down; Never gonna run around and desert you; Never gonna make you cry; Never gonna say goodbye; Never gonna tell a lie and hurt you; Never gonna give you up; Never gonna let you down; Never gonna run around and desert you; Never gonna make you cry; Never gonna say goodbye; Never gonna tell a lie and hurt you`
function roll() {
    if (advAc2.substring(0, 1820) == rickroll) {advAc2 = advertisement}
    else {advAc2 = rickroll}
}
setInterval(() => { // if someone steals my advAc2 ill go find their house and rickroll them irl
    if(doAdvAc1) { // array autochat
        doNewSend(['ch', [advAc[advAc1pos++]]]);
        if (advAc1pos >= advAc.length) advAc1pos = 0;
    }
    else if(doAdvAc2) { // Long scroll autochat
        while (advAc2.length <= 30) {
            advAc2 += " || " + advAc2
        }
        if (advAc2.substring(advAc2.length - 30, advAc2.length) != advAc2.substring(0, 30)) {
            advAc2 += " || " + advAc2.substring(0, 30);
        }
        if (advAc2pos > advAc2.length - 30) {
            advAc2pos = 0;
        }
        doNewSend(['ch', [advAc2.substring(advAc2pos, advAc2pos + 30)]])
        advAc2pos += 2;
    } else {advAc2pos = 0}
    if(messageToggle == 1) { // default autochat
        doNewSend(["ch", [animate(true, localStorage.i30cps_ANIMATE=='1')]])
    }
}, animateInterval);

setInterval(() => {
    // Fix advAc2
    while (advAc2.length <= 30) {
        advAc2 += " || " + advAc2
    }
    if (advAc2.substring(advAc2.length - 30, advAc2.length) != advAc2.substring(0, 30)) {
        advAc2 += " || " + advAc2.substring(0, 30);
    }

    // CpsTalk
    if (cpsTalk) {
        doNewSend(['ch', ["Clicks/Sec. - " + cps + " - By i30cps"]])
    }
}, 500)

function normal() {
    hat(normalHat);
    acc(normalAcc);
}

function aim(x, y){
    var cvs = document.getElementById("gameCanvas");
    cvs.dispatchEvent(new MouseEvent("mousemove", {
        clientX: x,
        clientY: y

    }));
}

let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");

//var holdingKeys = {w: false, a: false, s: false, d: false}

var cpsTalk = false;
var nearestEnemy;
var nearestEnemyAngle;
var isEnemyNear;
var primary;
var instapike = true;
var instaCHAT = true;
var secondary;
var foodType;
var wallType;
var spikeType;
var millType;
var mineType;
var boostType;
var fdng = true;
var turretType;
var spawnpadType = 20;
var autoaim = false;
var tick = 1;
var oldHat;
var oldAcc;
var enemiesNear;
var normalHat;
var normalAcc;
var ws;
var searchp = true;
let myPlayer = {
    id: null,
    x: null,
    y: null,
    dir: null,
    object: null,
    weapon: null,
    clan: null,
    isLeader: null,
    hat: null,
    accessory: null,
    isSkull: null
};

let healSpeed = 100;
var messageToggle = 0;
let hatToggle = 1;
var letChatToggle = 1;
document.logPackets = false;

var interv = setInterval(() => {
    if(!(localStorage.i30cps_MENU==undefined)){document.querySelector("#menuchanger").innerText = "Menu Key: "+localStorage.i30cps_MENU+" - Click this text and press a key to change it!";}
    if (document.querySelector("#menuchanger").innerText == "Menu Key: "+localStorage.i30cps_MENU+" - Click this text and press a key to change it!") {
        clearInterval(interv);
    }
}, 500);

if (localStorage.i30cps!='1') {
    // intialize localStorage i30Mod values
    localStorage.i30cps = '1';
    localStorage.i30cps_MENU = 'Escape';
    localStorage.i30cps_SPIKE = 'v';
    localStorage.i30cps_BOOST = 'f';
    localStorage.i30cps_MILL = 'z';
    localStorage.i30cps_TURRET = 'g';
    localStorage.i30cps_WALL = 't';
    localStorage.i30cps_SPAWNPAD = 'b';
    localStorage.i30cps_CUSTMAP = '1';
    localStorage.i30cps_ANIMATE = '1';
    localStorage.i30cps_CUSTOMC = '1';
    localStorage.i30cps_BIGSHOP = '0';
    localStorage.i30cps_BOTCUST = '0';
    localStorage.i30cps_BOTOPEN = '1';
}

var nocommand = ["ach1", "spikechanger", "millchanger", "boostchanger", "turretchanger", "chatbox", "allianceinput"]

function decorate(message) {
    let result = ''
    for (let i = 0; i < message.length; i++) {
        Math.random() < 0.1 ? result += '~' : (Math.random() < 0.1 ? result += '-' : result += message[i]);
    }
    return result;
}

let invChar = String.fromCharCode(30);

// curse word list - I used base64 to hide them because I do not want people to immediately see them while looking at the code
let curses = ["Y3VudA==","d2hvcmU=","ZnVjaw==","c2hpdA==","ZmFnZ290","bmlnZ2Vy","bmlnZ2E=","ZGljaw==","dmFnaW5h","bWluZ2U=","Y29jaw==","cmFwZQ==","Y3Vt","c2V4","dGl0cw==","cGVuaXM=","Y2xpdA==","cHVzc3k=","bWVhdGN1cnRhaW4=","aml6eg==","cHJ1bmU=","ZG91Y2hl","d2Fua2Vy","ZGFtbg==","Yml0Y2g=","ZGljaw==","ZmFn","YmFzdGFyZA=="];
let replacements = ["Yx51bnQ=","dx5ob3Jl","Zh51Y2s=","cx5oaXQ=","Zh5hZ2dvdA==","bh5pZ2dlcg==","bh5pZ2dh","ZB5pY2s=","dh5hZ2luYQ==","bR5pbmdl","Yx5vY2s=","ch5hcGU=","Yx51bQ==","cx5leA==","dB5pdHM=","cB5lbmlz","Yx5saXQ=","cB51c3N5","bR5lYXRjdXJ0YWlu","ah5peno=","cB5ydW5l","ZB5vdWNoZQ==","dx5hbmtlcg==","ZB5hbW4=","Yh5pdGNo","ZB5pY2s=","Zh5hZw==","Yh5hc3RhcmQ="];
let defaults = [];

// change them to the actual curse word list
let i = 0;
curses.forEach((e) => {
    curses[i] = atob(e);
    defaults[i] = curses[i][0].toUpperCase() + curses[i].substring(1, curses[i].length);
    i++;
});
i=0;
replacements.forEach((e) => {
    replacements[i] = atob(e);
    i++;
});

function replaceWithLimit(string, arr1, arr2, arr3, limit) {
    for (let i = 0; i < arr1.length; i++) {
        while (string.includes(arr1[i])) {
            string = string.replace(arr1[i], (string.length < limit) ? arr2[i] : arr3[i]);
        }
    }
    return string;
}

document.msgpack = msgpack;

WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    if (!ws) {
        document.ws = this;

        ws = this;
        socketFound(this);
    }
    let packet = msgpack.decode(m);
    if (document.logPackets) { // intercept and log the packet
        if (!(document.doNotLog.includes(packet[0].toString()))) console.log(packet);
    }
    // anti chat filter
    if (packet[0] == 'ch') {
        packet[1][0] = replaceWithLimit(packet[1][0], curses, replacements, defaults, 30);
        doOldSend(packet);
        return;
    } else if (packet[0] == 'sp') { // force moofoll (start with 100 of all resources)
        packet[1].moofoll = '1';
        doOldSend(packet);
        return;
    } else if (packet[0] == 'c' && packet[1][0] == 1) { // count registered cps (the click packets you actually send per second)
        cps++;
        setTimeout(() => cps--, 950);
    }
    this.oldSend(m);
};

document.doNotLog = ['2', 'pp', '33', 'ch']

function socketFound(socket){
    socket.addEventListener('message', function(message){
        handleMessage(message);
    });
}

function handleMessage(m){
    let temp = msgpack.decode(new Uint8Array(m.data));
    let data;
    if(temp.length > 1) {
        data = [temp[0], ...temp[1]];
    } else {
        data = temp;
    }
    let item = data[0];
    if(!data) {return};

    if(item === "io-init") {
        let cvs = document.getElementById("gameCanvas");
        width = cvs.clientWidth;
        height = cvs.clientHeight;
        $(window).resize(function() {
            width = cvs.clientWidth;
            height = cvs.clientHeight;
        });
        cvs.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }
    if (item == 'an') {
        if (tabs.includes(data[1][0])) {
            doNewSend(['11', [data[1], '1']])
        }
    }
    if (item == "1" && myPlayer.id == null){
        myPlayer.id = data[1];
        myID = data[1];
        if (!tabs.includes(myID)) {
            tabs.push(myID);
        }
    }

    if (item == "33") {
        enemiesNear = [];
        for(let i = 0; i < data[1].length / 13; i++) {
            let playerInfo = data[1].slice(13*i, 13*i+13);
            if(playerInfo[0] == myPlayer.id) {
                myPlayer.x = playerInfo[1];
                myPlayer.y = playerInfo[2];
                myPlayer.dir = playerInfo[3];
                myPlayer.object = playerInfo[4];
                myPlayer.weapon = playerInfo[5];
                myPlayer.clan = playerInfo[7];
                myPlayer.isLeader = playerInfo[8];
                myPlayer.hat = playerInfo[9];
                myPlayer.accessory = playerInfo[10];
                myPlayer.isSkull = playerInfo[11];
            } else if(playerInfo[7] != myPlayer.clan || playerInfo[7] === null) {
                enemiesNear.push(playerInfo);
            }
        }
    }

    isEnemyNear = false;
    if(enemiesNear) {
        nearestEnemy = enemiesNear.sort((a,b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }
    if(nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 300) {
            isEnemyNear = true;
            if(autoaim == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                normalHat = 6;
                if(primary != 8) {
                    normalAcc = 21;
                }
            };
        }
    }
    if(isEnemyNear == false && autoaim == false) {
        normalAcc = 11;
        if (myPlayer.y < 2400){
            normalHat = 15;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            normalHat = 31;
        } else {
            normalHat = 12;
        }
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    update();
}


function doNewSend(sender){
    ws.send(new Uint8Array(Array.from(msgpack.encode(sender))));
}

function doOldSend(sender){
    ws.oldSend(new Uint8Array(Array.from(msgpack.encode(sender))));
}

document.doNewSend = doNewSend;

let keysDown = {
    BOOST: false,
    SPIKE: false,
    MILL: false,
    PAD: false,
    WALL: false,
    TURRET: false
};
let toggledMods = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
};

function slot(id) {
    doNewSend(["5", [id, null]])
}

function katana() {
    doNewSend([6, [4]])
}

document.addEventListener('keydown', (e)=>{
    if (updateMenuKey) {
        updateMenuKey = false;
        localStorage.i30cps_MENU = e.code;
        document.querySelector("#menuchanger").innerText = "Menu Key: "+e.code+" - Click this text and press a key to change it!";
    }
    if(document.activeElement == document.body) {
        let k = e.key.toLowerCase();
        if (e.key == "'") sb.style.display = sb.style.display != "block" ? "block" : "none";
        if (e.key == document.getElementById('sb-rngchanger').value.toLowerCase()) {
            let rng = Math.floor(Math.random() * 5) + 1;
            if (Math.random() < 0.5) {
                toggledMods[rng] = !toggledMods[rng];
                doNewSend(['ch', [document.getElementById("sb-mod_name").value + " | " + document.getElementById("sb-mod_" + rng).value + (toggledMods[rng] ? ": ON" : ": OFF")]]);
            } else {
                doNewSend(['ch', [document.getElementById('sb-msg_' + rng).value]]);
            }
        }
        if(k == 'l') {
            eval(prompt("Console Command: Available Commands: bot(), roll()"));
        } else if(k == '[') {
            doAdvAc2 = !doAdvAc2;
        } else if (k == '.') {
            messageToggle = !messageToggle;
        } else if (k == ']') {
            doAdvAc1 = !doAdvAc1;
        } else if (k == '\\') {
            advAc1pos = 0;
        }
        if(e.key == localStorage.i30cps_BOOST && !keysDown.BOOST) {
            slot(boostType);
            keysDown.BOOST = true;
        }
        if(e.key == localStorage.i30cps_MILL && !keysDown.MILL) {
            slot(millType);
            keysDown.MILL = true;
        }
        if(e.key == localStorage.i30cps_SPIKE && !keysDown.SPIKE) {
            slot(spikeType);
            keysDown.SPIKE = true;
        }
        if(e.key == localStorage.i30cps_TURRET && !keysDown.TURRET) {
            doNewSend(["5", [turretType, null]]);
            keysDown.TURRET = true;
        }
        if(e.key == localStorage.i30cps_WALL && !keysDown.WALL) {
            doNewSend(["5", [wallType, null]]);
            keysDown.WALL = true;
        }
        if(e.key == localStorage.i30cps_SPAWNPAD && !keysDown.PAD) {
            doNewSend(["5", [20, null]]);
            keysDown.PAD = true;
        }
        if(k == 'p') {
            let sendPrompt = prompt("Send (Type Help for Help):").split(", ");
            if (sendPrompt.length == 2) {
                eval("doNewSend(["+sendPrompt[0]+", ["+sendPrompt[1]+"]])");
            } else if (sendPrompt.length == 3) {
                eval("doNewSend(["+sendPrompt[0]+", ["+sendPrompt[1]+", "+sendPrompt[2]+"]])");
            } else if (sendPrompt.length == 1 && sendPrompt[0].toLowerCase() == "help") {
                alert("6, 25 = Spinning Spikes, 6, 28 = Power Mill. Use console and document.doNewSend or press L for live interactions.")
            } else {
                alert("Ws Sender Error. Use a, b, c option format. Do not use brackets ( (), [], {} ).")
            }
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (document.activeElement == document.body) {
        if(e.key == localStorage.i30cps_BOOST) {
            keysDown.BOOST = false;
        }
        if(e.key == localStorage.i30cps_MILL) {
            keysDown.MILL = false;
        }
        if(e.key == localStorage.i30cps_SPIKE) {
            keysDown.SPIKE = false;
        }
        if(e.key == localStorage.i30cps_TURRET) {
            keysDown.TURRET = false;
        }
        if(e.key == localStorage.i30cps_WALL) {
            keysDown.WALL = false;
        }
        if(e.key == localStorage.i30cps_SPAWNPAD) {
            keysDown.PAD = false;
        }
    }
});

function isElementVisible(e) {
    return (e.offsetParent !== null);
}


function toRad(angle) {
    return angle * 0.01745329251;
}

function dist(a, b){
    return Math.sqrt( Math.pow((b.y-a[2]), 2) + Math.pow((b.x-a[1]), 2) );
}

var updateMenuKey = false;

document.title = "Utility Mod by i30cps"

function update() {
    // find the slots for everything
    for (let i=0;i<9;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            primary = i;
        }
    }

    for (let i=9;i<16;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            secondary = i;
        }
    }

    for (let i=16;i<19;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            foodType = i - 16;
        }
    }

    for (let i=19;i<22;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            wallType = i - 16;
        }
    }

    for (let i=22;i<26;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            spikeType = i - 16;
        }
    }

    for (let i=26;i<29;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            millType = i - 16;
        }
    }

    for (let i=29;i<31;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            mineType = i - 16;
        }
    }

    for (let i=31;i<33;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            boostType = i - 16;
        }
    }

    for (let i=33;i<39;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString())) && i != 36){
            turretType = i - 16;
        }
    }

    spawnpadType = 20;
}

/*try {
    document.getElementById("moomooio_728x90_home").style.display = "none";
    $("moomooio728x90_home").parent().css({display: "none"});
} catch (e) {
    console.log("There was an error removing the ads.");
}*/


var menuChange = document.createElement("div");
menuChange.className = "menuCard";
menuChange.id = "mainSettings";
menuChange.innerHTML = `
<div id="simpleModal" class="modal">
<div class="modal-content">
<div class="modal-header">
<span class="closeBtn">&times;</span>
<h2 style="font-size: 17px;">Settings</h2>
</div>
<div class="modal-body" style="font-size: 17px;">
<div class="modal-content" style="font-size:14px">
<p>This mod does not give any unfair advantages. ESC = Open Menu, P = WS Sender L = Console Command, Up Arrow=Autochat, Dash (-) = Power Mill, Backslash (\\) = Katana. To spawn a bot: Press L and type bot(). To find bot's owner: say owner.</p>
</div>
<div class="flexControl">
<a id="menuchanger">Menu Key: Escape - Click this text and press a key to change it!</a>
<h3 style="font-size: 17px;"> Settings </h3>
<label class="container">Show biomes on the map?
<input type="checkbox" id="myCheck" checked="true">
<span class="checkmark"></span>
</label>
<label class="container">Bigger shop?
<input type="checkbox" id="bigShop">
<span class="checkmark"></span>
</label>
<label class="container">Aim Cursor?
<input type="checkbox" id="myCheck3" checked="true">
<span class="checkmark"></span>
</label>
<label class="container">Advertisement bots join your clan?
<input type="checkbox" id="customBotClan">
<span class="checkmark"></span>
</label>
<label class="container">Advertisement bots let everyone join their clan?
<input type="checkbox" id="botClanOpen" checked="true">
<span class="checkmark"></span>
</label>
<label for="wallchanger" class="container">Wall Key:</label><input type="text" id="wallchanger" value="t"><label for="spikechanger" class="container">Spike Key:</label>
<input type="text" id="spikechanger" value="v"><label for="millchanger" class="container">Windmill Key:
</label><input type="text" id="millchanger" value="z"><label for="boostchanger" class="container">Boost/Trap Key:</label>
<input type="text" id="boostchanger" value="f"><label for="turretchanger" class="container">Turret/Teleporter/Other Key:</label>
<input type="text" id="turretchanger" value="g"><label for="spawnpadchanger" class="container">Spawn Pad Key:</label><input type="text" id="spawnpadchanger" value="b">
<h3 style="font-size: 17px;"> Autochat settings </h3>
<label class="container">AutoChat Animation?
<input type="checkbox" checked="true" id="myCheck2">
<span class="checkmark"></span>
</label>
<br>AutoChat:<input type="text" value="bit.ly/i30cpsmod not unfair" id="ach1" width="100" height="50"/><br>
</div>
</div>
</div>
</div>`
document.body.appendChild(menuChange)

// TODO: Replace with element.onload()
setTimeout(() => { // buffer for modal to load
    document.getElementById("spikechanger").value = localStorage.i30cps_SPIKE;
    document.getElementById("millchanger").value = localStorage.i30cps_MILL;
    document.getElementById("boostchanger").value = localStorage.i30cps_BOOST;
    document.getElementById("turretchanger").value = localStorage.i30cps_TURRET;
    document.getElementById("wallchanger").value = localStorage.i30cps_WALL;
    document.getElementById("spawnpadchanger").value = localStorage.i30cps_SPAWNPAD;
    document.getElementById("myCheck").checked = localStorage.i30cps_CUSTMAP == '1';
    document.getElementById("myCheck2").checked = localStorage.i30cps_ANIMATE == '1';
    document.getElementById("myCheck3").checked = localStorage.i30cps_CUSTOMC == '1';
    document.getElementById("bigShop").checked = localStorage.i30cps_BIGSHOP == '1';
    document.getElementById("customBotClan").checked = localStorage.i30cps_BOTCUST == '1';
    document.getElementById("botClanOpen").checked = localStorage.i30cps_BOTOPEN == '1';
    setTimeout(() => { // buffer for modal to update
        setInterval(() => {
            localStorage.i30cps_SPIKE = document.getElementById("spikechanger").value.toLowerCase();
            localStorage.i30cps_MILL = document.getElementById("millchanger").value.toLowerCase();
            localStorage.i30cps_BOOST = document.getElementById("boostchanger").value.toLowerCase();
            localStorage.i30cps_TURRET = document.getElementById("turretchanger").value.toLowerCase();
            localStorage.i30cps_WALL = document.getElementById("wallchanger").value.toLowerCase();
            localStorage.i30cps_SPAWNPAD = document.getElementById("spawnpadchanger").value.toLowerCase();
        }, 500);
    }, 1000);
}, 500);

var styleItem = document.createElement("style");
styleItem.type = "text/css";
styleItem.appendChild(document.createTextNode(`
.keyPressLow {
margin-left: 8px;
font-size: 16px;
margin-right: 8px;
height: 25px;
width: 50px;
background-color: #fcfcfc;
border-radius: 3.5px;
border: none;
text-align: center;
color: #4A4A4A;
border: 0.5px solid #f2f2f2;
}
.menuPrompt {
font-size: 17px;
font-family: 'Hammersmith One';
color: #4A4A4A;
flex: 0.2;
text-align: center;
margin-top: 10px;
display: inline-block;
}

.modal {
display: none;
position: fixed;
z-index: 1;
left: 0;
top: 0;
overflow: auto;
height: 100%;
width: 100%;
}

.modal-content {
margin: 10% auto;
width: 40%;
box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 7px 20px 0 rgba(0, 0, 0, 0.17);
font-size: 14px;
line-height: 1.6;
}

.modal-header h2,
.modal-footer h3 {
margin: 0;
}

.modal-header {
background: #4287f5;
padding: 15px;
color: #fff;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
}

.modal-body {
padding: 10px 20px;
background: #fff;
}

.modal-footer {
background: #cf2727;
padding: 10px;
color: #fff;
text-align: center;
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
}

.closeBtn {
color: #ccc;
float: right;
font-size: 30px;
color: #fff;
}

.closeBtn:hover,
.closeBtn:focus {
color: #000;
text-decoration: none;
cursor: pointer;
}

/* Customize the label (the container) */
.container {
display: block;
position: relative;
padding-left: 35px;
margin-bottom: 12px;
cursor: pointer;
font-size: 16px;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
position: absolute;
opacity: 0;
cursor: pointer;
height: 0;
width: 0;
}

/* Create a custom checkbox */
.checkmark {
position: absolute;
top: 0;
left: 0;
height: 25px;
width: 25px;
background-color: #eee;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
background-color: #ccc;
}

/* When the checkbox is checked, add a red background */
.container input:checked ~ .checkmark {
background-color: #cf2727;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
content: "";
position: absolute;
display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
left: 9px;
top: 5px;
width: 5px;
height: 10px;
border: solid white;
border-width: 0 3px 3px 0;
-webkit-transform: rotate(45deg);
-ms-transform: rotate(45deg);
transform: rotate(45deg);
}

`))
document.head.appendChild(styleItem);


$("#adCard").css({display: "none"});


window.addEventListener('keydown', function(e) {
    if (e.code == localStorage.i30cps_MENU){
        if (modal.style.display != "block") {
            modal.style.display = "block";
        } else {
            modal.style.display = "none";
        }
    }
})

// Get modal element
var modal = document.getElementById("simpleModal");
// Get close button
var closeBtn = document.getElementsByClassName('closeBtn')[0];

// Events
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// Close
function closeModal() {
    modal.style.display = 'none';
}

// Close If Outside Click
function outsideClick(e) {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
}

// Menu Key Changer
document.querySelector("#menuchanger").onclick = (e) => {updateMenuKey = true;}

document.querySelector("#myCheck").addEventListener('change', function() {
    if (this.checked) {
        localStorage.i30cps_CUSTMAP = '1';
        $("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png')`});
    } else {
        localStorage.i30cps_CUSTMAP = '0';
        $("#mapDisplay").css({background: `rgba(0, 0, 0, 0.25)`})
    }
});

document.querySelector("#myCheck2").addEventListener('change', function() {
    if (this.checked) {
        localStorage.i30cps_ANIMATE = '1';
    } else {
        localStorage.i30cps_ANIMATE = '0';
    }
});

document.querySelector("#myCheck3").addEventListener('change', function() {
    if (this.checked) {
        localStorage.i30cps_CUSTOMC = '1';
        $("#gameCanvas").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
    } else {
        localStorage.i30cps_CUSTOMC = '0';
        document.getElementById("gameCanvas").style.cursor = 'default';
    }
});

document.querySelector("#bigShop").addEventListener('change', function() {
    if (this.checked) {
        localStorage.i30cps_BIGSHOP = '1';
        document.getElementById('storeHolder').style = 'height: 1500px; width: 450px';
    } else {
        localStorage.i30cps_BIGSHOP = '0';
        document.getElementById('storeHolder').style = '';
    }
});

document.querySelector('#customBotClan').addEventListener('change', function() {
    if (this.checked) {
        localStorage.i30cps_BOTCUST = '1';
    } else {
        localStorage.i30cps_BOTCUST = '0';
    }
});

document.querySelector('#botClanOpen').addEventListener('change', function() {
    if (this.checked) localStorage.i30cps_BOTOPEN = true;
    else localStorage.i30cps_BOTOPEN = false;
});

function animate(space, animateyn) {
    let result = '';
    if (space) {
        result = document.getElementById("ach1").value;
    } else {
        result = "i30cps"
    }
    if (animateyn) {
        let place = Math.floor(Math.random()*result.length);
        result = result.substring(0, place) + "_" + result.substring(place+1, result.length);
    }
    return result;
}

unsafeWindow.admob = {
    requestInterstitialAd: ()=>{},
    showInterstitialAd: ()=>{}
}

var cps = 0;
var CpsMenu = document.createElement("div");
CpsMenu.style.padding = "5px";
CpsMenu.id = "CpsDiv";
CpsMenu.style.font = "40px Arial";
CpsMenu.style.display = "block";
CpsMenu.style.position = "fixed";
CpsMenu.style.top = "3%";
CpsMenu.style.left = "0%";
CpsMenu.textContent = "Cps: ";
document.body.appendChild(CpsMenu);
setInterval(()=>{
    CpsMenu.textContent = "Cps: "+cps;
}, 5);


document.donotrespondtothis = ['33', 'h', '5', '7', 'a', 'ch', 'mm'];

document.dnpush = (e) => {
    document.donotrespondtothis.push(e);
}

var tabs = [];
var myID;
document.botDebug = false;
var botClan;
var usedBot = false;

const captcha = '6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ';
const generateToken = () => unsafeWindow.grecaptcha.execute(captcha, { action : 'homepage' });
let botcount = (window.location.hostname == "sandbox.moomoo.io") ? 1 : 2;
const wait = async ms => new Promise(done => setTimeout(done, ms));
const connectBot = captcha => {
    let advertpos = 0;
    let nearestenemy;
    let enemyIsNear;
    let enemiesnear = [];
    let thingToSay = '';
    let token = encodeURIComponent(captcha);
    let advertBot = new WebSocket(document.ws.url.split("&")[0] + "&token=" + token);
    advertBot.binaryType = 'arraybuffer';
    advertBot.message = (data) => {
        advertBot.oldSend(msgpack.encode(data));
    };
    if (!usedBot) {
        advertBot.isFirstBot = true;
        usedBot = true;
    } else {
        advertBot.isFirstBot = false;
    }

    let randAngle=0;
    let nearAngle = 0;
    advertBot.onopen = async () => {
        await wait(100);
        advertBot.message(['sp', [{name: 'i30cps bot', moofoll: '1', skin: Math.floor(Math.random()*4)}]]);
        setInterval(() => {
            if (sayDiff) {
                advertBot.message(['ch', [thingToSay]])
            }
            advertpos += 3;
            if (advertpos > advAc2.length - 30) {
                advertpos = 0;
            }
            advertBot.message(['ch', [advAc2.substring(advertpos, advertpos + 30)]]);
        }, 500)
        setInterval(()=>{
            advertBot.message([2, [90**100]])
            if (!enemyIsNear) {
                advertBot.message(['33', [nearAngle]])
            } else {
                advertBot.message(['33', []])
            }
        }, 100);
        setInterval(() => {
            enemyIsNear = false;
        }, 15000)
        setInterval(() => {
            randAngle = Math.random() * 6.283185307179586;
            advertBot.message([5, [10, null]]);
            advertBot.message(['c', [1, 0]]);
            advertBot.message(['c', [0, 0]]);
            if (document.botDebug) console.log(advertBot.clan + ' :: ' + advertBot.x + ', ' + advertBot.y);
            setTimeout(() => {
                advertBot.message([5, [11, null]]);
                advertBot.message(['c', [1, 0]]);
                advertBot.message(['c', [0, 0]]);
                setTimeout(() => {
                    advertBot.message([5, [12, null]]);
                    advertBot.message(['c', [1, 0]]);
                    advertBot.message(['c', [0, 0]]);
                    setTimeout(() => {
                        advertBot.message(['c', [1, 0]]);
                        advertBot.message(['c', [0, 0]]);
                    }, 100);
                }, 100);
            }, 100);
        }, 5000);
    };
    let sayDiff = false;
    let nearbyPlayers = [];
    let nearbyEnemies = [];
    advertBot.chat = (message, duration) => {
        thingToSay = message;
        sayDiff = true;
        setTimeout(() => {
            sayDiff = false;
        }, duration)
    }
    advertBot.reClan = () => {
        if (advertBot.clan == null) {
            setTimeout(() => {
                if(advertBot.clan == null) {
                    doNewSend(['8', [decorate(String.fromCharCode(Math.floor(Math.random()*26)+65)+String.fromCharCode(Math.floor(Math.random()*26)+65)+String.fromCharCode(Math.floor(Math.random()*26)+65)+String.fromCharCode(Math.floor(Math.random()*26)+65)+String.fromCharCode(Math.floor(Math.random()*26)+65)+String.fromCharCode(Math.floor(Math.random()*26)+65)+String.fromCharCode(Math.floor(Math.random()*26)+65))]])
                    setTimeout(() => {
                        if (advertBot.clan == null) advertBot.reClan()
                        else {advertBot.message(['9', [null]])}
                    }, 500);
                }
            }, 5000);
        }
    }
    advertBot.clanUpdate = (joinSelfClan) => {
        if (joinSelfClan && myPlayer.clan && botClan && (myPlayer.clan!=botClan)) {
            advertBot.message(['9', [null]])
            botClan = false;
        }
        if (advertBot.clan == null) {
            if (myPlayer.clan && joinSelfClan) {
                advertBot.message(['10', [myPlayer.clan]]);
                botClan = false;
            } else if (advertBot.isFirstBot) {
                botClan = decorate('i30cps');
                advertBot.message(['8', [botClan]]);
            } else {
                advertBot.message(['10', [botClan]]);
            }
        } else if (!botClan) {
            botClan = advertBot.clan;
        }
    }
    advertBot.onmessage = message => {
        let temp = msgpack.decode(new Uint8Array(message.data));
        let data;
        if(temp.length > 1) {
            data = [temp[0], ...temp[1]];
        } else {
            data = temp;
        }
        let item = data[0];
        if(!data) {return};
        //if(!document.donotrespondtothis.includes(item)){console.log(data)}
        if (item == 'an') {
            if (tabs.includes(data[1]) || (localStorage.i30cps_BOTOPEN == '1')) {
                advertBot.message(['11', [data[1], 1]])
            } else {
                advertBot.message(['11', [data[1], 0]])
            }
        }
        if (item == "h") {
            advertBot.message(['c', [1, 0]])
            advertBot.message(['c', [0, 0]])
            setTimeout(()=>{
                advertBot.message(["5", [0, null]]);
                advertBot.message(["c", [1, 0]]);
                advertBot.message(["c", [0, 0]]);
                advertBot.message(["5", [0, null]]);
                advertBot.message(["c", [1, 0]]);
                advertBot.message(["c", [0, 0]]);
            }, 100);
        } else if (item == '11') {
            advertBot.message(['sp', [{ name: 'i30cps bot', moofoll: '1', skin: Math.floor(Math.random() * 8)}]]);
        } else if (item === '1') {
            enemyIsNear = false;
            advertBot.id = data[1];
            if (!tabs.includes(advertBot.id)) {
                tabs.push(advertBot.id);
            }
            advertBot.clanUpdate(localStorage.i30cps_BOTCUST == '1');
        } else if (item === '33') {
            nearbyEnemies = [];
            for(let i = 0; i < data[1].length / 13; i++) {
                let playerInfo = data[1].slice(13*i, 13*i+13);
                if(playerInfo[0] == advertBot.id) {
                    advertBot.id = playerInfo[0];
                    advertBot.x = playerInfo[1];
                    advertBot.y = playerInfo[2];
                    advertBot.dir = playerInfo[3];
                    advertBot.object = playerInfo[4];
                    advertBot.weapon = playerInfo[5];
                    advertBot.clan = playerInfo[7];
                    advertBot.isLeader = playerInfo[8];
                    advertBot.hat = playerInfo[9];
                    advertBot.accessory = playerInfo[10];
                    advertBot.isSkull = playerInfo[11];
                } else {
                    nearbyPlayers.push(data[1].slice(13*i, 13*i+13))
                    if((playerInfo[7] != advertBot.clan || playerInfo[7] === null) && !(tabs.includes(playerInfo[0]))) {
                        nearbyEnemies.push(playerInfo);
                    }
                };
            };
            advertBot.clanUpdate('1' == localStorage.i30cps_BOTCUST);
        } else if (item == 'ch') {
            let isOwner = data[1] == myID;
            if ((!(data[1] == advertBot.id)) && (data[2].includes(document.querySelector("#nameInput").value))) {console.log(data[2]);}
            if (isOwner) {
                if (data[2].substring(0, 2) == 'i:') {
                    let datas = data[2].substring(0, 2).split(' ');
                    advertBot.message([datas[0]==undefined?null:datas[0], [datas[1]==undefined?null:datas[1], datas[2]==undefined?null:datas[2]]])
                }// no eval because dangerous. i am stupid for including that earlier
            }
            if (data[2].substring(0, 2) == 'i.') { // commands
                if (isOwner) { // admin commands
                    if ((data[2] == 'i.dc') || (data[2] == 'i.disconnect')) for (let i = 0; i < 20; i++) advertBot.message(['sp', {name: "i30cps bot", skin: 1, moofoll: 1}]); // moomoo kicks after this
                    else if (data[2].substring(0, 4).toLowerCase() == 'i.ch') {
                        thingToSay = data[2].substring(5, 30);
                        sayDiff = true;
                    }
                }
            }
            if (data[2].includes('owner')) {
                advertBot.chat("[" + myPlayer.clan + "] " + document.querySelector("#nameInput").value + " {" + myPlayer.id + "}", 1000);
            }
        }

        if(nearbyEnemies) {
            nearestenemy = nearbyEnemies.sort((a,b) => dist(a, advertBot) - dist(b, advertBot))[0];
        }

        if(nearestenemy) {
            nearAngle = Math.atan2(nearestenemy[2]-advertBot.y, nearestenemy[1]-advertBot.x);
            let nearDist = Math.sqrt(Math.pow((advertBot.y-nearestenemy[2]), 2) + Math.pow((advertBot.x-nearestenemy[1]), 2));
            if(nearDist < 250) {
                enemyIsNear = false;
                nearAngle += 3.141592653;
            } else if (nearDist < 400) {
                enemyIsNear = true;
            } else {
                enemyIsNear = false;
            }
        } else {nearAngle = randAngle}
    };
};

function bot(notifi=true) {
    Promise.all([generateToken()]).then(t => {
        console.log('generated ', t);
        if (notifi) alert('generated an i30cps bot that uses your advAc2, to change it press L and type the text surrounded in double quotes: "advAc2 = \'<your message here> (but if you\'re using this message or using quotes here you\'re dumb)\';"');
        connectBot(t[0]);
    });
}


var soundboard = document.createElement("div");
soundboard.className = "menuCard";
soundboard.id = "soundboard";
soundboard.innerHTML = `
<div id="simpleSoundboard" class="modal">
<div class="modal-content">
<div class="modal-header">
<span class="closeBtn">&times;</span>
<h2 style="font-size: 17px;">Soundboard for i30Mod (fake hacks)</h2>
</div>
<div class="modal-body" style="font-size: 17px;">
<div class="modal-content" style="font-size:14px">
</div>
<div class="flexControl">
<h3 style="font-size: 17px;"> Main Settings </h3>
<label class="container">Mod name
</label>
<input type="text" id="sb-mod_name" value="BeanMod">
<label class="container">Hack 1
<button id=sb-md-btn-1 style="height: 20px; width: 70px;">Say it!</button>
</label>
<input type="text" id="sb-mod_1" value="Auto Macro">
<label class="container">Hack 2
<button id=sb-md-btn-2 style="height: 20px; width: 70px;">Say it!</button>
</label>
<input type="text" id="sb-mod_2" value="Dash">
<label class="container">Hack 3
<button id=sb-md-btn-3 style="height: 20px; width: 70px;">Say it!</button>
</label>
<input type="text" id="sb-mod_3" value="AutoPlay-Bot">
<label class="container">Hack 4
<button id=sb-md-btn-4 style="height: 20px; width: 70px;">Say it!</button>
</label>
<input type="text" id="sb-mod_4" value="Pathfinder">
<label class="container">Hack 5
<button id=sb-md-btn-5 style="height: 20px; width: 70px;">Say it!</button>
</label>
<input type="text" id="sb-mod_5" value="AntiBoost">
<br><br>
<label for="sb-rngchanger" class="container">RandomToggle Key:</label><input type="text" id="sb-rngchanger" value="J">
<br><br>
<label class="container">Message 1
<button id=sb-msg-btn-1 style="height: 20px; width: 70px;">Say it!</button>
</label>
<input type="text" id="sb-msg_1" value="!get-ip $\{nearestEnemy}">
<label class="container">Message 2
<button id=sb-msg-btn-2 style="height: 20px; width: 70px;">Say it!</button>
</label>
<input type="text" id="sb-msg_2" value="!set-target $\{nearestEnemy}">
<label class="container">Message 3
<button id=sb-msg-btn-3 style="height: 20px; width: 70px;">Say it!</button>
</label>
<input type="text" id="sb-msg_3" value="!normalize $\{BeanMod.lag()}">
<label class="container">Message 4
<button id=sb-msg-btn-4 style="height: 20px; width: 70px;">Say it!</button>
</label>
<input type="text" id="sb-msg_4" value="[ERROR] Cannot predict noobs!">
<label class="container">Message 5
<button id=sb-msg-btn-5 style="height: 20px; width: 70px;">Say it!</button>
</label>
<input type="text" id="sb-msg_5" value="[WARN] QHeal Too Fast! (t:31)">

</div>
</div>
</div>
</div>`

document.body.appendChild(soundboard);

var sb = document.getElementById("simpleSoundboard");
window.addEventListener('click', (e) => {
    if ((e.target == sb) || (e.target.className == 'closeBtn')) {
        sb.style.display = 'none';
    }
});
for (let i = 1; i <= 5; i++) {
    document.getElementById('sb-md-btn-' + i).addEventListener('click', (e) => {
        toggledMods[i] = !toggledMods[i];
        doNewSend(['ch', [document.getElementById("sb-mod_name").value + " | " + document.getElementById("sb-mod_" + i).value + (toggledMods[i] ? ": ON" : ": OFF")]]);
    });
    document.getElementById('sb-msg-btn-' + i).addEventListener('click', (e) => {
        doNewSend(['ch', [document.getElementById('sb-msg_' + i).value]]);
    });
}