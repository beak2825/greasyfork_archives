// ==UserScript==
// @name         Glitch Biome Sniper
// @namespace    https://www.roblox.com/users/124091465
// @author       GlacialBolt
// @version      1.6
// @description  Instantly clicks glitch biome links in Sol's RNG channels - Most effective if Roblox is already open but sitting in the menu (not ingame)
// @license      Proprietary
// @match        *://discord.com/*
// @match        *://www.roblox.com/games*
// @grant        GM_xmlhttpRequest
// @connect      webhook.lewisakura.moe
// @downloadURL https://update.greasyfork.org/scripts/520366/Glitch%20Biome%20Sniper.user.js
// @updateURL https://update.greasyfork.org/scripts/520366/Glitch%20Biome%20Sniper.meta.js
// ==/UserScript==

/*
 * Copyright (C) 2024 GlacialBolt
 *
 * This script is proprietary software. You may use it for personal purposes only.
 * Redistribution, modification, or commercial use of this script, in whole or in part,
 * is strictly prohibited without explicit prior written permission from the author.
 *
 * All rights reserved.
 */
"use strict"
const HostName = window.location.hostname;
if (HostName === "discord.com") {
    const ClickShareLinks = true
    const GeneralChannels = [
        "1307474772879216720", // Test channel
        "1282542323590496277", // Sol's RNG #biomes
        "1282554696032194593", // Sol's RNG #others
        "1216848460297539664", // Rare Biome Hunters
    ]
    const SpecificChannels = [
        "1030988274241650793", // Test channel
        "1287614809705021470", // Radiant Macro
    ]
    const JesterChannels = [
        "1282543762425516083", // Sol's RNG #merchants
    ]
    let TargetJester = false
    function Levenshtein(Word,Target) {
        const matrix = [];
        for (let i = 0; i <= Target.length; i++) matrix[i] = [i];
        for (let j = 0; j <= Word.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= Target.length; i++) {
            for (let j = 1; j <= Word.length; j++) {
                if (Target[i - 1] === Word[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // Substitution
                        matrix[i][j - 1] + 1, // Insertion
                        matrix[i - 1][j] + 1 // Deletion
                    );
                }
            }
        }
        return matrix[Target.length][Word.length];
    }
    const BaitPhrases = [
        "about a glitch",
        "ago in glitch",
        "auto glitch",
        "bait",
        "blazing",
        "been since glitch",
        "but with ",
        "calling it glitch",
        "corruption",
        "couldnt join",
        "description of glitch",
        "detect this glitch",
        "devs",
        "ended",
        "fake",
        "false glitch",
        "farm",
        "find glitch",
        "finding a glitch",
        "finding glitch",
        "fixed the",
        "fix the glitch",
        "flex battl",
        "for glitch",
        "from glitch",
        "gatekeeping glitch",
        "get a glitch",
        "get glitch",
        "get into glitch",
        "get that glitch",
        "get this glitch",
        "gets a glitch",
        "gimme my glitch",
        "give me ",
        "glitch appear please",
        "glitch auras",
        "glitch bait",
        "glitch battle",
        "glitch biome auras",
        "glitch biome bait",
        "glitch biome can change",
        "glitch biome clicker",
        "glitch biome ended",
        "glitch biome when",
        "glitch ended",
        "glitch fake",
        "glitch has been",
        "glitch in a ",
        "glitch is soon",
        "glitch its not",
        "glitch macro",
        "glitch not biome",
        "glitch (over)",
        "glitch pls",
        "glitch snipe",
        "glitch so ha",
        "glitch was it real",
        "glitch was real",
        "glitch when",
        "glitch word",
        "glitch yard",
        "glitch yesterday",
        "glitch yet",
        "glitched bait",
        "gone",
        "gotta get glitch",
        "gotten a glitch",
        "grave",
        "grinch",
        "had glitch ",
        "have glitch",
        "heavenly glitch",
        "hindering glitch",
        "hope you find",
        "hunt",
        "i missed",
        "i want",
        "if glitch",
        "if you have",
        "imagine it is a glitch",
        "imagine it was ",
        "instead of glitch",
        "invite me to",
        "is that glitch real",
        "is the glitch real",
        "is there a glitch",
        " is a glitch biome right",
        "its rainy",
        "jk its not",
        "jk just a ",
        "join a glitch",
        "just a graveyard",
        "last glitch was",
        "lf",
        "like its glitch",
        "looking fo",
        "lying about glitch",
        "macro",
        "me a glitch",
        "meeting",
        "might have ended",
        "miss another glitch",
        "missed glitch",
        "months ago",
        "need a glitch",
        "need glitch",
        "no glitch",
        "no one",
        "nobody wants ",
        "normal",
        "nоt a glitch",
        "nоt glitch",
        "not real",
        "one says glitch",
        "over shot glitch",
        "pls glitch",
        "pop in glitch",
        "post fake",
        "post glitch",
        "pump",
        "pvp glitch",
        "rainy",
        "randomizer",
        "repost",
        "said glitch",
        "said join for ",
        "sand",
        "sandy right now",
        "saying it was glitch",
        "searching for",
        "seen glitch",
        "send glitch",
        "share a link",
        "shut up about",
        "slide here glitch",
        "snowy",
        "somebody send glitch",
        "starfall",
        "starlight",
        "stfu",
        "stop bait",
        "stupid glitch b",
        "superstar",
        "real glitch was",
        "this guy found glitch",
        "this server is for",
        "to find a glitch",
        "to the glitch",
        "told to me ",
        "trap",
        "tricking glitch",
        "trolling",
        "trying to bait",
        "trying to get",
        "until glitch",
        "virus glitch",
        "waiting for",
        "want glitch",
        "want my first glitch",
        "was a real glitch",
        "was glitch biome real",
        "was joking",
        "was the glitch from",
        "was the glitch real",
        "what happened to",
        "when glitch",
        "when is glitch",
        "when last glitch",
        "when was",
        "whens glitch",
        "where is glitch",
        "who have glitch",
        "who said",
        "why is",
        "windy",
        "wish it was glitch",
        "with glitch",
        "with rain",
        "without the glitch",
        "would be glitch",
        "u saying that theres a glitch",
        "۩",
    ]
    function DetectKeyword(Message) {
        const Words = Message.split(/\s+/)
        let FoundWord = null
        const TargetWords = (TargetJester && ["jester","oblivion","heavenly","obliv"]) || ["glitch","dream","dreamscape"]
        Words.forEach(Word => {
            if (!FoundWord) {
                const CleanedWord = Word.replace(/(.)\1+/g,"$1")
                TargetWords.forEach(TargetWord => {
                    if (!FoundWord && CleanedWord.charAt(0) == TargetWord.charAt(0) && Levenshtein(CleanedWord,TargetWord) <= 2) {
                        FoundWord = Word
                    }
                })
            }
        })
        return [FoundWord && !BaitPhrases.some(Phrase => Message.includes(Phrase.replace("glitch",FoundWord))),FoundWord]
    }
    let LinkFound = false
    function Print(Text) {
        console.log("[GLITCH] ".concat(Text))
    }
    function SendWebhook() {
        const url = "https://webhook.lewisakura.moe/api/webhooks/1307474793284632608/QCP4X2Urt3LkK7iB7eL7BVep59N730IUtDjvxpAOHMrhNAoDJXNbz6FI5CS0ho-OdRfn";
        const payload = {
            content: "<@305450976301547521>"
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                console.log("[GLITCH] Webhook sent. Status:", response.status);
            },
            onerror: function(error) {
                console.error("[GLITCH] Webhook error:", error);
            }
        });
    }
    Print("Running script.")
    function MonitorMessages(SpecificChannel) {
        const MessageContainer = document.querySelector('[role="list"]')
        if (MessageContainer) {
            setTimeout(function(){
                Print("Began monitoring messages.")
                new MutationObserver(Mutations => {
                    Mutations.forEach(Mutation => {
                        Mutation.addedNodes.forEach(Node => {
                            if (Node.nodeType == 1 && Node.innerText && !LinkFound) {
                                let Message = Node.innerText
                                Message = Message.substring(Message.search(":")-2)
                                if (Message.charAt(0) == " " || Message.charAt(0) == "\n") {
                                    Message = Message.substring(1)
                                }
                                const Timestamp = Message.substring(0,Message.search("\n")).toUpperCase()
                                Message = Message.substring(Message.search("\n")+1)
                                if (Message.charAt(0) == "\]") {
                                    Message = Message.substring(2)
                                }
                                const Embed = Message.search("roblox\njoin private server")
                                if (Embed > -1) {
                                    Message = Message.substring(0,Embed-1)
                                }
                                let CleanedMessage = Message.replace(/(share\?code=[a-z0-9]+&type=server)([a-z]+)/gi, "$1 $2")
                                CleanedMessage = CleanedMessage.replace(/(share-links\?code=[a-z0-9]+&type=server)([a-z]+)/gi, "$1 $2")
                                CleanedMessage = CleanedMessage.replace(/(games\/\d+\/[^ ]*\?privateServerLinkCode=\d+)([a-z]+)/gi, "$1 $2")
                                CleanedMessage = CleanedMessage.toLowerCase().replace(/[^\w\s]/g, '')
                                const Result = DetectKeyword(CleanedMessage)
                                if ((Result && Result[0]) || SpecificChannel) {
                                    Node.querySelectorAll('a[href]').forEach(LinkElement => {
                                        if (!LinkFound) {
                                            const Link = LinkElement.href
                                            const ShareLink = /^https:\/\/www\.roblox\.com\/(share\?code=[a-zA-Z0-9]+&type=Server|share-links\?code=[a-zA-Z0-9]+&type=Server)/
                                            const ServerCodeLink = /^https:\/\/www\.roblox\.com\/games\/(\d+)\/.*\?privateServerLinkCode=(\d+)/
                                            if (ShareLink.test(Link) && ClickShareLinks) {
                                                LinkFound = true
                                                const SanitizedLink = Link.match(ShareLink)[0]
                                                if (SanitizedLink == Link) {
                                                    LinkElement.click()
                                                } else {
                                                    window.open(SanitizedLink,"_blank")
                                                }
                                            } else if (ServerCodeLink.test(Link)) {
                                                LinkFound = true
                                                const Match = Link.match(ServerCodeLink);
                                                const ID = Match[1]
                                                const Code = Match[2]
                                                if (ID == 15532962292) {
                                                    window.open("roblox://placeId=15532962292&linkCode=".concat(Code),"_blank")
                                                }
                                            }
                                            if (LinkFound) {
                                                Print("Glitch biome detected at ".concat(Timestamp).concat("! Detected word: ").concat(Result[1]).concat("\nMessage: ").concat(Message))
                                                SendWebhook()
                                                setTimeout(function(){
                                                    LinkFound = false
                                                    Print("Resuming detection.")
                                                },164000)
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    })
                }).observe(MessageContainer,{childList:true,subtree:true})
            },1000)
        } else {
            setTimeout(MonitorMessages,100)
            return
        }
    }
    let LastChannel = null
    function GetCurrentChannel() {
        const URL = window.location.href
        const ID = URL.match(/\/channels\/\d+\/(\d+)/)
        return ID && ID[1]
    }
    function CheckChannelChange() {
        const CurrentChannel = GetCurrentChannel()
        if (CurrentChannel !== LastChannel) {
            LastChannel = CurrentChannel
            const GeneralChannel = GeneralChannels.includes(CurrentChannel)
            const SpecificChannel = SpecificChannels.includes(CurrentChannel)
            const JesterChannel = JesterChannels.includes(CurrentChannel)
            if (GeneralChannel || JesterChannel || SpecificChannel) {
                Print("Target channel detected.")
                TargetJester = JesterChannel
                MonitorMessages(SpecificChannel)
            } else {
                Print("Not in a target channel.")
            }
        }
    }
    setInterval(CheckChannelChange,1000)
} else if (HostName === "www.roblox.com") {
    const Link = window.location.href;
    const Match = Link.match(/^https:\/\/www\.roblox\.com\/games\/(\d+)\/.*\?privateServerLinkCode=(\d+)/);
    if (Match) {
        const ID = Match[1];
        const Code = Match[2];
        if (ID === "15532962292") {
            window.open("roblox://placeId=" + ID + "&linkCode=" + Code);
            setTimeout(() => window.close(), 1000);
        } else {
            window.close();
        }
    }
}