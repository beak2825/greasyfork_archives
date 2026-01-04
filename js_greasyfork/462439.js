// ==UserScript==
// @name        nhl66 chat highlight
// @namespace   Violentmonkey Scripts
// @match       https://box.bungee.chat/
// @grant       none
// @version     1.2.2
// @author      Ilwyd
// @description 3/23/2023, 10:01:55 p.m.
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462439/nhl66%20chat%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/462439/nhl66%20chat%20highlight.meta.js
// ==/UserScript==

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

// Function to see if the chat box has fully loaded
function chatIsReady() {
    try {
        document.getElementsByClassName("username")[1].innerHTML
        return true
    }
    catch {
        return false
    }
}

//Function to set up the DOMNodeInserted listener for new chat messages
function chatListenerSetUp() {
    const user = document.getElementsByClassName("username")[1].innerHTML
    var chat = document.getElementsByClassName("messages noised-bg")[0]

    chat.addEventListener('DOMNodeInserted', function (event) {
        if (event.target.className == 'mention') {
            var mentioned = event.target.parentNode.firstElementChild.innerText.replace('@', '')

            if (mentioned == user) {
                event.target.parentNode.parentNode.style.backgroundColor = 'darkred'
            }
        };
    }, false);

    console.log("Event listener added for user " + user)
}

//Function to set up the listener on the emoji menu button
//Will only run on the first click
function emojiMenuListenerSetUp() {
    var emojiMenuButton = document.getElementsByClassName("action emoticons")[0]
    var clicked = false
    emojiMenuButton.addEventListener("click", function (event) {
        if (clicked == false) {
            addEmojisToMenu()
            clicked = true
        }
    })
}

class EmojiBuilder {
    constructor() {
        this.emojis = []
    }

    add(src, alt) {
        this.emojis.push([src, alt])
    }

    build(previousGroup) {
        //emojiMenu - The menu holding the emojis
        //emojiGroup - Groupings of emojis separated by a blue line inside the emojiMenu
        //emojiNode - An individual emoji inside an emoji group
        var emojiMenu = document.getElementsByClassName("emojibox")[0]
        var emojiGroup = emojiMenu.firstChild.cloneNode()
        var emojiNode = emojiMenu.firstChild.firstChild

        if (previousGroup == null) {
            previousGroup = emojiMenu.firstChild
        }
        else {
            previousGroup = previousGroup.nextSibling
        }

        //Creating a new emojiGroup at the top of the emojiMenu
        emojiMenu.insertBefore(emojiGroup, previousGroup)

        this.emojis.forEach(function(emoji) {
            var emojiPickerNode = emojiNode.cloneNode(true)
            var currEmojiNode = emojiPickerNode.firstChild
            currEmojiNode.setAttribute("alt", emoji[1])
            currEmojiNode.setAttribute("src", emoji[0])

            emojiPickerNode.addEventListener("click", (event) => {
                var emojiName = emoji[1]
                var chatBox = document.getElementsByClassName("chatmessage")[1]
                chatBox.classList.replace("ng-untouched", "ng-touched")
                chatBox.classList.replace("ng-pristine", "ng-dirty")
                chatBox.value += emojiName + " "
                chatBox.dispatchEvent(new Event("input", {bubbles: true}))
            })

            emojiGroup.appendChild(emojiPickerNode)
        })
        return emojiGroup
    }
}

var EMOJIS = {
    "Team Logos": {
        ":avs:": "https://box.bungee.chat/emotes/6txsyjo8/H8Ja3.png",
        ":blackhawks:": "https://box.bungee.chat/emotes/6txsyjo8/CZHnp.png",
        ":bluejackets:": "https://box.bungee.chat/emotes/6txsyjo8/jVVYM.png",
        ":bluejackets2:": "https://box.bungee.chat/emotes/6txsyjo8/vEPJD.png",
        ":blues:": "https://box.bungee.chat/emotes/6txsyjo8/RbXtJ.png",
        ":bruins:": "https://box.bungee.chat/emotes/6txsyjo8/v8vhF.png",
        ":canes:": "https://box.bungee.chat/emotes/6txsyjo8/MKM5a.png",
        ":canucks:": "https://box.bungee.chat/emotes/6txsyjo8/LmRxf.png",
        ":canucks2:": "https://box.bungee.chat/emotes/6txsyjo8/VcIhT.png",
        ":caps:": "https://box.bungee.chat/emotes/6txsyjo8/dkJcx.png",
        ":caps2:": "https://box.bungee.chat/emotes/6txsyjo8/nJX1r.png",
        ":coyotes:": "https://box.bungee.chat/emotes/6txsyjo8/iIK0e.png",
        ":coyotes2:": "https://box.bungee.chat/emotes/6txsyjo8/KrnsB.png",
        ":devils:": "https://box.bungee.chat/emotes/6txsyjo8/AE57X.png",
        ":ducks:": "https://box.bungee.chat/emotes/6txsyjo8/KYdZS.png",
        ":ducks2:": "https://box.bungee.chat/emotes/6txsyjo8/nEkrR.png",
        ":flames:": "https://box.bungee.chat/emotes/6txsyjo8/5z8Xq.png",
        ":flyers:": "https://box.bungee.chat/emotes/6txsyjo8/8Fzmt.png",
        ":goldenknights:": "https://box.bungee.chat/emotes/6txsyjo8/RzQhs.png",
        ":gritty:": "https://box.bungee.chat/emotes/6txsyjo8/3fV3f.png",
        ":gritty2:": "https://box.bungee.chat/emotes/6txsyjo8/5o4lH.png",
        ":habs:": "https://box.bungee.chat/emotes/6txsyjo8/Y28Ff.png",
        ":islanders:": "https://box.bungee.chat/emotes/6txsyjo8/Ekp2Q.png",
        ":jets:": "https://box.bungee.chat/emotes/6txsyjo8/Pp30g.png",
        ":kings:": "https://box.bungee.chat/emotes/6txsyjo8/KrjL8.png",
        ":kraken:": "https://box.bungee.chat/emotes/6txsyjo8/hoGr2.png",
        ":leafs:": "https://box.bungee.chat/emotes/6txsyjo8/jmZIh.png",
        ":lightning:": "https://box.bungee.chat/emotes/6txsyjo8/JF10J.png",
        ":oilers:": "https://box.bungee.chat/emotes/6txsyjo8/FS35N.png",
        ":panthers:": "https://box.bungee.chat/emotes/6txsyjo8/rYp2t.png",
        ":nyr:": "https://box.bungee.chat/emotes/6txsyjo8/rangers.png",
        ":penguins:": "https://box.bungee.chat/emotes/6txsyjo8/isUX2.png",
        ":preds:": "https://box.bungee.chat/emotes/6txsyjo8/2v62b.png",
        ":redwings:": "https://box.bungee.chat/emotes/6txsyjo8/anx3U.png",
        ":sabres:": "https://box.bungee.chat/emotes/6txsyjo8/v1dFN.png",
        ":sens:": "https://box.bungee.chat/emotes/6txsyjo8/KcY94.png",
        ":sens2:": "https://box.bungee.chat/emotes/6txsyjo8/AjysL.png",
        ":sharks:": "https://box.bungee.chat/emotes/6txsyjo8/dBVg6.png",
        ":Stars:": "https://box.bungee.chat/emotes/6txsyjo8/sljDr.png",
        ":thrashers:": "https://box.bungee.chat/emotes/6txsyjo8/L7NP3.png",
        ":whalers:": "https://box.bungee.chat/emotes/6txsyjo8/pvNpt.png",
        ":wild:": "https://box.bungee.chat/emotes/6txsyjo8/QLowq.png"
    },
    "Other Emotes":{
        ":Broom:": "https://box.bungee.chat/assets/emotes/ro1lZ.png",
        ":cheese:": "https://box.bungee.chat/emotes/6txsyjo8/qAAQF.png",
        ":cup:": "https://box.bungee.chat/emotes/6txsyjo8/fXmMr.png",
        ":zam:": "https://box.bungee.chat/emotes/6txsyjo8/zam.gif",
        "DobbyWut": "https://box.bungee.chat/emotes/6txsyjo8/pWz1m.png",
        "KesselCookies": "https://box.bungee.chat/emotes/6txsyjo8/ThNRf.png",
        "KesselSmile": "https://box.bungee.chat/emotes/6txsyjo8/mp7EZ.png",
        "KesselKing": "https://box.bungee.chat/emotes/6txsyjo8/8LegY.png",
        "PoopRef": "https://box.bungee.chat/emotes/6txsyjo8/hGgv8.png",
        "ShearyYikes": "https://box.bungee.chat/emotes/6txsyjo8/h2cRj.png",
        "SidWut": "https://box.bungee.chat/emotes/6txsyjo8/WbsAN.png",
        "TannerWut": "https://box.bungee.chat/emotes/6txsyjo8/zkGaS.png",
        "TKWut": "https://box.bungee.chat/emotes/6txsyjo8/jtVvJ.png",
        "BradSad": "https://box.bungee.chat/emotes/6txsyjo8/kchnh.png",
        "BradShame": "https://box.bungee.chat/emotes/6txsyjo8/vuIwt.png",
        ":ping:": "https://box.bungee.chat/emotes/6txsyjo8/TvzRj.png"
    },
    "Happy": {
        "FeelsGoodMan": "https://box.bungee.chat/assets/emotes/w3FFh.png",
        "FeelsBirthdayMan": "https://box.bungee.chat/assets/emotes/NZyTE.png",
        "HYPERS": "https://box.bungee.chat/assets/emotes/opZji.png",
        "POGGERS": "https://box.bungee.chat/assets/emotes/Gpajf.png",
        "POGGIES": "https://box.bungee.chat/assets/emotes/szVP9.png",
        ":)": "https://box.bungee.chat/assets/emotes/k2cJ0.png",
        "SmileW": "https://box.bungee.chat/assets/emotes/xvCiK.png",
        "WidepeepoHappy": "https://box.bungee.chat/assets/emotes/daoNt.png"
    },
    "Sad": {
        "BibleThump": "https://box.bungee.chat/assets/emotes/x7B2z.png",
        "FeelsBadMan": "https://box.bungee.chat/assets/emotes/Kp2Me.png",
        "FeelsStrongMan": "https://box.bungee.chat/assets/emotes/mZjcc.png",
        "PepeHands": "https://box.bungee.chat/assets/emotes/v7ibx.png",
        "KEKWPepeHands": "https://box.bungee.chat/assets/emotes/YzmN0.png",
        "PepeF": "https://box.bungee.chat/assets/emotes/cIHsD.png",
        "SadCat": "https://box.bungee.chat/assets/emotes/1sXu2.png",
        "Sadge": "https://box.bungee.chat/assets/emotes/I4tRt.png",
        "WidepeepoSad": "https://box.bungee.chat/assets/emotes/xLNm4.png"
    },
    "LOL": {
        "3Head": "https://box.bungee.chat/assets/emotes/qIAFB.png",
        "4Head": "https://box.bungee.chat/assets/emotes/SpHVk.png",
        "5Head": "https://box.bungee.chat/assets/emotes/nz4Uq.png",
        "PEPW": "https://box.bungee.chat/assets/emotes/g2f08.png",
        "PepeLa": "https://box.bungee.chat/assets/emotes/5g0JG.png",
        "PepeLaugh": "https://box.bungee.chat/assets/emotes/FcATz.png",
        "Bebela": "https://box.bungee.chat/assets/emotes/Uk5sq.png",
        "KEKL": "https://box.bungee.chat/assets/emotes/d8vMf.png",
        "KEKW": "https://box.bungee.chat/assets/emotes/E59iX.png",
        "OMEGAKEKW": "https://box.bungee.chat/assets/emotes/XEDn0.png",
        "LUL": "https://box.bungee.chat/assets/emotes/uxa8l.png",
        "LULW": "https://box.bungee.chat/assets/emotes/1mX82.png",
        "OMEGALUL": "https://box.bungee.chat/assets/emotes/VpAN0.png"
    },
    "Thinking": {
        "crthonk": "https://box.bungee.chat/assets/emotes/UWQKc.png",
        "monkaHmm": "https://box.bungee.chat/assets/emotes/ka04l.png",
        "peepoHmm": "https://box.bungee.chat/assets/emotes/LKRIq.png",
        "PepeNote": "https://box.bungee.chat/assets/emotes/zZFFe.png"
    },
    "WTF": {
        "cmonBruh": "https://box.bungee.chat/assets/emotes/FVSn1.png",
        "D:": "https://box.bungee.chat/assets/emotes/kZbqE.png",
        "GeorgeWut": "https://box.bungee.chat/assets/emotes/HPxrr.png",
        "haHAA": "https://box.bungee.chat/assets/emotes/eJmck.png",
        "KEKWait": "https://box.bungee.chat/assets/emotes/7ErW3.png",
        "peepoWTF": "https://box.bungee.chat/assets/emotes/9KmEX.png",
        "PikaS": "https://box.bungee.chat/assets/emotes/sRXJ7.png",
        "WTFgurl": "https://box.bungee.chat/assets/emotes/mWepC.png",
        "Yikes": "https://box.bungee.chat/assets/emotes/XzxqN.png",
        "smudge": "https://box.bungee.chat/assets/emotes/ELGZD.png"
    },
    "Angry / Frustrated": {
        "NotLikeThis": "https://box.bungee.chat/assets/emotes/rBL9T.png",
        "GordonMad": "https://box.bungee.chat/assets/emotes/i2jGw.png",
        "peepoRiot": "https://box.bungee.chat/assets/emotes/QFbcY.png",
        "PepeREE": "https://box.bungee.chat/assets/emotes/qNxii.png",
        ":X": "https://box.bungee.chat/assets/emotes/aHHkZ.png",
        "PLEASENO": "https://box.bungee.chat/assets/emotes/u2k1y.png",
        "ThisIsFine": "https://box.bungee.chat/assets/emotes/9CJia.png"
    },
    "Sarcasm": {
        "Kappa": "https://box.bungee.chat/assets/emotes/hR3dR.png",
        "Keepo": "https://box.bungee.chat/assets/emotes/29z9z.png",
        "mmKay": "https://box.bungee.chat/assets/emotes/yuWKj.png",
        "Pepega": "https://box.bungee.chat/assets/emotes/22pp5.png",
        ":pog:": "https://box.bungee.chat/assets/emotes/61YjT.png"
    },
    "monka": {
        "monkaS": "https://box.bungee.chat/assets/emotes/fkw4u.png",
        "monkaW": "https://box.bungee.chat/assets/emotes/cBfIJ.png",
        "monakS": "https://box.bungee.chat/assets/emotes/Tk6NR.png",
        "monkaGIGA": "https://box.bungee.chat/assets/emotes/JQJ0K.png",
        "monkaOMEGA": "https://box.bungee.chat/assets/emotes/l2MiD.png"
    },
    "Pepe (peepo)": {
        "peepoCozy": "https://box.bungee.chat/assets/emotes/JcX6M.png",
        "peepofat": "https://box.bungee.chat/assets/emotes/TniFF.png",
        "peepoHug": "https://box.bungee.chat/assets/emotes/kQCEi.png",
        "peepoLove": "https://box.bungee.chat/assets/emotes/xnrYM.png",
        "peepoShrug": "https://box.bungee.chat/assets/emotes/y3fg7.png",
        "peepoWave": "https://box.bungee.chat/assets/emotes/kt3cx.png",
        "PepeHeart": "https://box.bungee.chat/assets/emotes/gjp2Y.png",
        "PepeClown": "https://box.bungee.chat/assets/emotes/Qi3Go.png",
        "YEP": "https://box.bungee.chat/assets/emotes/ejASv.png",
        "yep": "https://box.bungee.chat/assets/emotes/ejASv.png",
        "PepeThink": "https://box.bungee.chat/assets/emotes/uo2Lc.png",
        "PepeWOW": "https://box.bungee.chat/assets/emotes/FcylZ.png"
    },
    "Classic Twitch Emotes": {
        "ResidentSleeper": "https://box.bungee.chat/assets/emotes/KJDDU.png",
        "WutFace": "https://box.bungee.chat/assets/emotes/HlrlB.png",
        "PoundIt": "https://box.bungee.chat/assets/emotes/qMXRq.png"
    },
    "Other": {
        "AYAYA": "https://box.bungee.chat/assets/emotes/b18JF.png",
        "AYAYAWeird": "https://box.bungee.chat/assets/emotes/FMdwp.png",
        "BabyYoda": "https://box.bungee.chat/assets/emotes/81Sux.png",
        "BanHammer": "https://box.bungee.chat/assets/emotes/rGVVf.png",
        ":7": "https://box.bungee.chat/assets/emotes/BNiX8.png",
        "FeelsGoatMan": "https://box.bungee.chat/assets/emotes/Id4Rh.png",
        "GAMEOVER": "https://box.bungee.chat/assets/emotes/qMJ5L.png",
        "GEKW": "https://box.bungee.chat/assets/emotes/AJAce.png",
        "EZY": "https://box.bungee.chat/assets/emotes/aGaet.png",
        "GG": "https://box.bungee.chat/assets/emotes/GIplm.png",
        ":Goat:": "https://box.bungee.chat/assets/emotes/A9TNr.png",
        ":gold:": "https://box.bungee.chat/assets/emotes/qgZaL.png",
        "KermitPls": "https://box.bungee.chat/assets/emotes/vWnDV.png",
        "KermitTea": "https://box.bungee.chat/assets/emotes/Gq55M.png",
        ":Mega:": "https://box.bungee.chat/assets/emotes/sNY4V.png",
        ":New:": "https://box.bungee.chat/assets/emotes/PG9Ng.png",
        "OOF": "https://box.bungee.chat/assets/emotes/wz5cA.png",
        "OkCat": "https://box.bungee.chat/assets/emotes/w9wcC.png",
        ":Popcorn:": "https://box.bungee.chat/assets/emotes/Gxe0V.png",
        ":money:": "https://box.bungee.chat/assets/emotes/D0BQc.png",
        "Stonks": "https://box.bungee.chat/assets/emotes/fmWrB.png",
        //":VS:": "https://box.bungee.chat/assets/assets/emotes/vs.png",
        "UnoReverse": "https://box.bungee.chat/assets/emotes/e3vyg.png"
    }
}

//Adds the above emojis to the emoji menu following the groupings in the json
function addEmojisToMenu() {
    console.log("Adding emojis to menu")
    var previousGroup = null
    for (grouping in EMOJIS) {
        console.log("Adding emoji group: " + grouping)
        var eb = new EmojiBuilder()
        for (emoji in EMOJIS[grouping]) {
            eb.add(EMOJIS[grouping][emoji], emoji)
        }
        previousGroup = eb.build(previousGroup)
    }
}

(async function () {
    'use strict';

    const url = new URL(location.href);
    if (url.toString() != 'https://box.bungee.chat/') {
        return;
    }

    var ready = false
    var count = 1
    while (!ready) {
        console.log("Checking to see if chat is ready (" + count + ")")
        ready = chatIsReady()

        if (!ready) {
            var waitTime = (2*Math.log10(count)+1).toFixed(2)
            console.log("Chat not ready, checking again in " + waitTime + " seconds")
            await sleep(waitTime*1000)
            count++
        }
    }

    chatListenerSetUp()
    emojiMenuListenerSetUp()
})();