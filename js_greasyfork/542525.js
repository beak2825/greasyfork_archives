// ==UserScript==
// @name         Block All Emotes in DGG Chat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks a long list of emotes from appearing in Destiny.gg chat.
// @author       Rasmus
// @match        https://www.destiny.gg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542525/Block%20All%20Emotes%20in%20DGG%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/542525/Block%20All%20Emotes%20in%20DGG%20Chat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const blockedEmotes = [
        "AMOGUS", "AngelThump", "ApeHands", "ARRIVE", "Askers", "ASLAN", "Aware", "AWAWA", "AwShoot", "AYAYA", "AYYYLMAO",
        "BasedGod", "BASEDWATM8", "BearSleep", "BERN", "BibleThump", "BINGQILIN", "BlackGuyLaptop", "BLADE", "Bleh", "Blesstiny",
        "Blubstiny", "BOGGED", "BONK", "BOOMER", "BoomerSippy", "Cabge", "catJAM", "CAUGHT", "Chatting", "CheckEm", "Cheerstiny",
        "ChibiDesti", "CHILLS", "Chud", "CINEMA", "Clap", "Clueless", "COGGERS", "COKEJAW", "ComfPeek", "comFrieren", "ComfyCat",
        "ComfyDan", "ComfyDog", "ComfYEE", "ComfyLily", "coMMMMfy", "Concerned", "confusedCat", "Cooked", "COOMER", "Copium",
        "CORNPOP", "CROPSTINY", "CuckCrab", "Cutestiny", "CUX", "DaFeels", "DAFUK", "DANKMEMES", "DankWave", "DCOLON", "DEATH",
        "Depresstiny", "Derpstiny", "dggL", "dinkDonk", "diNOWAY", "Disgustiny", "DonoWall", "DONTSAYIT", "DOUBT", "DuckerZ",
        "DURRSTINY", "ECH", "EVIL", "FailerZ", "FeedNathan", "FeelsBadMan", "FeelsBirthdayMan", "FeelsGimiMan", "FeelsGoodMan",
        "FeelsOkayMan", "FeelsPeekMan", "FeelsStrongMan", "FeelsWeirdMan", "FerretLOL", "FerretPOG", "Fishge", "FISHIES", "fishShy",
        "FiveHead", "FLIPMYBURGER", "ForYou", "FourHead", "FrankerZ", "gachiGASM", "GAGAGA", "GAMBA", "GameOfThrows", "GIGACHAD",
        "glorp", "GODSTINY", "GRUG", "guh", "HACKERMAN", "haHAA", "Heimerdonger", "hesRight", "Hhhehhehe", "Hmmm", "HmmStiny",
        "Hollow", "HUH", "IDidntKnowThat", "IKneel", "IMEANNN", "IMPRESSED", "INFESTINY", "INREALLIFE", "InTheRoomWithUs",
        "ItsFine", "JAMSTINY", "JARVIS", "JOEVER", "Kappa", "KappaRoss", "KEIKAKU", "KEK", "Klappa", "KYEK", "KYSNOW", "LandlordW",
        "LeRuse", "LETHIMCOOK", "LIES", "Listening", "LOCKEDIN", "Lonely", "Looking", "LookUp", "LUL", "LULW", "LUPUS", "MALARKEY",
        "MarioPissing", "MASTERB8", "Memegasm", "Milkerino", "miyanobird", "MiyanoHype", "MLADY", "MMMM", "monkaGun", "monkaS",
        "monkaSMEGA", "monkaVirus", "MotherFuckinGame", "MyExistenceIsNothingButAGrainOfSandComparedToTheEntireScaleOfTheUniverse",
        "NAHH", "NAILS", "Nappa", "nathanF", "nathanNotears", "nathanOOO", "nathanPepe", "nathanTiny1", "nathanTiny2", "nathanWeeb",
        "nathanYee", "NiceMeMe", "NOBULLY", "NODDERS", "NOOOO", "NOPERS", "Normgasm", "NORMS", "NOSHOT", "NoTears", "NOTMYTEMPO",
        "OBJECTION", "OhBrother", "OhKrappa", "OhNo", "OkaygeBusiness", "OMEGALUL", "OneGuy", "OOOO", "OverRustle", "Painstiny",
        "PARDNER", "Peekstiny", "peepoRiot", "peepoShy", "PEPE", "PepeHands", "pepeJAM", "PepeLaugh", "PepeMods", "pepeSmug",
        "pepeSteer", "pepeW", "PepoComfy", "PepoG", "PepOk", "PepoPunch", "PepoThink", "PepoTurkey", "pepoTurtle", "PepoWant",
        "Pog", "POGGERS", "Pointless", "POOTUBE", "POTATO", "RainbowPls", "RapThis", "RATTED", "RaveDoge", "REE", "RIPBOZO",
        "SALUTE", "SCHEMING", "SCHIZO", "SHOCKSTINY", "SHOOK", "ShrimpleAs", "Shroomstiny", "Shrugstiny", "SICKO", "Sippy",
        "SLEEPSTINY", "Slugstiny", "Slumlord", "Smadge", "SMASHit", "SNAP", "SOTRIGGERED", "SOY", "SoyPoint", "SpookerZ", "Stare",
        "STATUSJOE", "SURPRISE", "Susge", "SWEATSTINY", "SWEEPING", "TeaTime", "TeddYEE", "TeddyPepe", "temmieDank", "TF",
        "THATNINJA", "ThisIsFine", "TINYING", "tinySuffer", "tinyWoah", "tonyW", "TRIAD", "TRUELOVE", "TRUMPED", "UWOTM8",
        "VeryPog", "WarmWaterPort", "WEEWOO", "WEOW", "WHAAAAT", "WHISPERING", "WhoahDude", "WICKED", "widepeepoHappy", "WOOF",
        "WooYeah", "WORTH", "Wowee", "WWWWaiting", "YAM", "YAP", "YEE", "YEEHAW", "YeeLaugh", "YeeMods", "yeeSmug", "YesHoney",
        "Yikestiny", "YouWouldntGetIt", "ZOOMER", "ZoomerSippy"
    ];

    const emoteRegex = new RegExp(`(^|\\s|>)(${blockedEmotes.join("|")})(?=\\s|$|<)`, "g");

    function mutationCallback(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const addedNode of mutation.addedNodes) {
                    const textContainer = addedNode.querySelector(".text");
                    if (!textContainer) continue;

                    // Remove rendered emotes
                    blockedEmotes.forEach(emote => {
                        const nodes = textContainer.querySelectorAll(`.emote.${emote}`);
                        nodes.forEach(n => n.remove());
                    });

                    // Remove plain-text emotes
                    textContainer.innerHTML = textContainer.innerHTML.replace(emoteRegex, '$1');
                }
            }
        }
    }

    const targetElement = document.getElementById("chat-win-main")?.querySelector(".chat-lines");

    if (targetElement) {
        const observer = new MutationObserver(mutationCallback);
        observer.observe(targetElement, { childList: true });
    }
})();
