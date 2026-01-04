// ==UserScript==
// @name           KAntibot
// @name:ja        Kーアンチボット
// @namespace      http://tampermonkey.net/
// @homepage       https://theusaf.org
// @version        4.2.8
// @icon           https://cdn.discordapp.com/icons/641133408205930506/31c023710d468520708d6defb32a89bc.png
// @description    Remove all bots from a kahoot game.
// @description:es eliminar todos los bots de un Kahoot! juego.
// @description:ja Kahootゲームから全てのボットを出して。
// @author         theusaf
// @copyright      2018-2023, Daniel Lau (https://github.com/theusaf/kahoot-antibot)
// @supportURL     https://discord.gg/pPdvXU6
// @match          *://play.kahoot.it/*
// @exclude        *://play.kahoot.it/v2/assets/*
// @grant          none
// @inject-into    page
// @run-at         document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/374093/KAntibot.user.js
// @updateURL https://update.greasyfork.org/scripts/374093/KAntibot.meta.js
// ==/UserScript==
// biome-ignore lint/suspicious/noRedundantUseStrict: Removing this causes strict to be placed at the top of the file, which causes issues with the userscript
"use strict";
/*

MIT LICENSE TEXT

Copyright 2018-2023 theusaf

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
/**
 * Special thanks to
 * - epicmines33
 * - stevehainesfib
 *
 * for helping with contribution and testing of this project
 */
const KANTIBOT_VERSION = GM_info.script.version;
const kantibotData = {
    settingsTypes: {
        timeout: "boolean",
        looksRandom: "boolean",
        blockformat1: "boolean",
        blockservice1: "boolean",
        blocknum: "boolean",
        forceascii: "boolean",
        patterns: "boolean",
        teamtimeout: "number",
        twoFactorTime: "number",
        percent: "number",
        wordblock: "string",
        ddos: "number",
        start_lock: "number",
        counters: "boolean",
        counterCheats: "boolean",
        enableCAPTCHA: "boolean",
        reduceFalsePositives: "boolean",
    },
    settings: {
        timeout: false,
        looksRandom: true,
        blockformat1: true,
        blockservice1: false,
        blocknum: false,
        forceascii: false,
        patterns: false,
        teamtimeout: 0,
        twoFactorTime: 7,
        percent: 0.6,
        wordblock: "",
        ddos: 0,
        start_lock: 0,
        counters: false,
        counterCheats: false,
        enableCAPTCHA: false,
        reduceFalsePositives: false,
    },
    runtimeData: {
        captchaIds: new Set(),
        controllerData: {},
        controllerNamePatternData: {},
        englishWordDetectionData: new Set(),
        killCount: 0,
        lastFakeLoginTime: 0,
        lastFakeUserID: "",
        lobbyLoadTime: 0,
        lockingGame: false,
        oldKillCount: 0,
        unverifiedControllerNames: [],
        verifiedControllerNames: new Set(),
        questionStartTime: 0,
        startLockElement: null,
        startLockInterval: 0,
        countersElement: null,
        currentQuestionActualTime: 0,
        kantibotModifiedQuiz: null,
    },
    methods: {},
    kahootInternals: {
        answerDetails: null,
        gameCore: null,
        gameDetails: null,
        gameConstructors: null,
        methods: {},
        quizData: {},
        userData: null,
        services: null,
        settings: null,
        socket: null,
        socketLib: null,
        socketHandler: null,
        debugData: {},
        apparentCurrentQuestion: null,
        apparentCurrentQuestionIndex: 0,
    },
};
function log(...args) {
    if (args.every((arg) => typeof arg === "string")) {
        console.log(`[KANTIBOT] - ${args.join(" ")}`);
    }
    else {
        console.log("[KANTIBOT]", ...args);
    }
}
function createObjectHook(target, prop, condition, callback) {
    (function recursiveHook() {
        Object.defineProperty(target, prop, {
            set(value) {
                delete target[prop];
                this[prop] = value;
                try {
                    if (!(condition(this, value) && callback(this, value))) {
                        recursiveHook();
                    }
                }
                catch (e) {
                    console.error(e);
                }
            },
            configurable: true,
        });
    })();
}
const hooks = {};
function createMultiHook(prop) {
    createObjectHook(Object.prototype, prop, () => true, (target, value) => {
        const hookSet = hooks[prop];
        for (const hook of hookSet) {
            if (hook.condition(target, value)) {
                if (hook.callback(target, value)) {
                    hookSet.delete(hook);
                }
            }
        }
        if (hookSet.size === 0) {
            delete hooks[prop];
            return true;
        }
        return false;
    });
}
function addHook(hook) {
    if (hook.target) {
        createObjectHook(hook.target, hook.prop, hook.condition, hook.callback);
    }
    else {
        if (!hooks[hook.prop]) {
            hooks[hook.prop] = new Set();
            createMultiHook(hook.prop);
        }
        hooks[hook.prop].add(hook);
    }
}
// Main logic
const METHODS = {
    capitalize(text) {
        const lower = text.toLowerCase();
        return lower[0].toUpperCase() + lower.slice(1);
    },
    similarity(s1, s2) {
        // ignore case
        let longer = s1.toLowerCase();
        let shorter = s2.toLowerCase();
        // begin math to determine similarity
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        const longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return ((longerLength - METHODS.editDistance(longer, shorter)) / longerLength);
    },
    isValidNameratorName(name) {
        const firstNames = [
            "Adorable",
            "Agent",
            "Agile",
            "Amazing",
            "Amazon",
            "Amiable",
            "Amusing",
            "Aquatic",
            "Arctic",
            "Awesome",
            "Balanced",
            "Blue",
            "Bold",
            "Brave",
            "Bright",
            "Bronze",
            "Captain",
            "Caring",
            "Champion",
            "Charming",
            "Cheerful",
            "Classy",
            "Clever",
            "Creative",
            "Cute",
            "Dandy",
            "Daring",
            "Dazzled",
            "Decisive",
            "Diligent",
            "Diplomat",
            "Doctor",
            "Dynamic",
            "Eager",
            "Elated",
            "Epic",
            "Excited",
            "Expert",
            "Fabulous",
            "Fast",
            "Fearless",
            "Flying",
            "Focused",
            "Friendly",
            "Funny",
            "Fuzzy",
            "Genius",
            "Gentle",
            "Giving",
            "Glad",
            "Glowing",
            "Golden",
            "Great",
            "Green",
            "Groovy",
            "Happy",
            "Helpful",
            "Hero",
            "Honest",
            "Inspired",
            "Jolly",
            "Joyful",
            "Kind",
            "Knowing",
            "Legend",
            "Lively",
            "Lovely",
            "Lucky",
            "Magic",
            "Majestic",
            "Melodic",
            "Mighty",
            "Mountain",
            "Mystery",
            "Nimble",
            "Noble",
            "Polite",
            "Power",
            "Prairie",
            "Proud",
            "Purple",
            "Quick",
            "Radiant",
            "Rapid",
            "Rational",
            "Red",
            "Rockstar",
            "Rocky",
            "Royal",
            "Shining",
            "Silly",
            "Silver",
            "Smart",
            "Smiling",
            "Smooth",
            "Snowy",
            "Soaring",
            "Social",
            "Space",
            "Speedy",
            "Stellar",
            "Sturdy",
            "Super",
            "Swift",
            "Tropical",
            "Winged",
            "Wise",
            "Witty",
            "Wonder",
            "Yellow",
        ];
        const lastNames = [
            "Alpaca",
            "Ant",
            "Badger",
            "Bat",
            "Bear",
            "Bee",
            "Bison",
            "Boa",
            "Bobcat",
            "Buffalo",
            "Bunny",
            "Camel",
            "Cat",
            "Cheetah",
            "Chicken",
            "Condor",
            "Crab",
            "Crane",
            "Deer",
            "Dingo",
            "Dog",
            "Dolphin",
            "Dove",
            "Dragon",
            "Duck",
            "Eagle",
            "Echidna",
            "Egret",
            "Elephant",
            "Elk",
            "Emu",
            "Falcon",
            "Ferret",
            "Finch",
            "Fox",
            "Frog",
            "Gator",
            "Gazelle",
            "Gecko",
            "Giraffe",
            "Glider",
            "Gnu",
            "Goat",
            "Goose",
            "Griffin",
            "Hamster",
            "Hare",
            "Hawk",
            "Hen",
            "Horse",
            "Ibex",
            "Iguana",
            "Impala",
            "Jaguar",
            "Kitten",
            "Koala",
            "Lark",
            "Lemming",
            "Lemur",
            "Leopard",
            "Lion",
            "Lizard",
            "Llama",
            "Lobster",
            "Macaw",
            "Meerkat",
            "Mouse",
            "Newt",
            "Octopus",
            "Oryx",
            "Ostrich",
            "Otter",
            "Owl",
            "Panda",
            "Panther",
            "Pelican",
            "Penguin",
            "Pigeon",
            "Piranha",
            "Pony",
            "Possum",
            "Puffin",
            "Quail",
            "Rabbit",
            "Raccoon",
            "Raven",
            "Rhino",
            "Rooster",
            "Sable",
            "Seal",
            "SeaLion",
            "Shark",
            "Sloth",
            "Snail",
            "Sphinx",
            "Squid",
            "Stork",
            "Swan",
            "Tiger",
            "Turtle",
            "Unicorn",
            "Urchin",
            "Wallaby",
            "Wildcat",
            "Wolf",
            "Wombat",
            "Yak",
            "Yeti",
            "Zebra",
        ];
        const nameMatch = name.match(/[A-Z][a-z]+(?=[A-Z])/);
        if (nameMatch === null || !firstNames.includes(nameMatch[0])) {
            return false;
        }
        const lastName = name.replace(nameMatch[0], "");
        if (!lastNames.includes(lastName)) {
            return false;
        }
        return true;
    },
    isFakeValid(name) {
        if (!METHODS.isUsingNamerator() && METHODS.isValidNameratorName(name)) {
            return true;
        }
        if (METHODS.getSetting("blocknum") && /\d/.test(name)) {
            return true;
        }
        if (METHODS.getSetting("forceascii") && /[^\d\s\w_-]/.test(name)) {
            return true;
        }
        return /(^([A-Z][a-z]+){2,3}\d{1,2}$)|(^([A-Z][^A-Z\n]+?)+?(\d[a-z]+\d*?)$)|(^[a-zA-Z]+\d{4,}$)/.test(name);
    },
    editDistance(s1, s2) {
        const norm1 = s1.toLowerCase();
        const norm2 = s2.toLowerCase();
        const costs = [];
        for (let i = 0; i <= norm1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= norm2.length; j++) {
                if (i === 0) {
                    costs[j] = j;
                }
                else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (norm1.charAt(i - 1) !== norm2.charAt(j - 1)) {
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        }
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0) {
                costs[norm1.length] = lastValue;
            }
        }
        return costs[norm2.length];
    },
    isUsingNamerator() {
        return METHODS.getKahootSetting("namerator");
    },
    getPatterns(text) {
        const isLetter = (char) => {
            return /\p{L}/u.test(char);
        };
        const isUppercaseLetter = (char) => {
            return char.toUpperCase() === char;
        };
        const isNumber = (char) => {
            return /\p{N}/u.test(char);
        };
        let output = "";
        let mode = null;
        let count = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            let type = null;
            if (isLetter(char)) {
                if (isUppercaseLetter(char)) {
                    type = "C";
                }
                else {
                    type = "L";
                }
            }
            else if (isNumber(char)) {
                type = "D";
            }
            else {
                // special character
                type = "U";
            }
            if (type !== mode) {
                if (mode !== null) {
                    output += Math.floor(count / 3);
                }
                count = 0;
                mode = type;
                output += type;
            }
            else {
                count++;
                if (i === text.length - 1) {
                    output += Math.floor(count / 3);
                }
            }
        }
        return output;
    },
    blacklist(name) {
        const list = METHODS.getSetting("wordblock")
            .split("\n")
            .filter(Boolean);
        for (let i = 0; i < list.length; i++) {
            if (name.toLowerCase().indexOf(list[i].toLowerCase()) !== -1) {
                return true;
            }
        }
        return false;
    },
    getKahootSetting(id) {
        return kantibotData.kahootInternals.methods.getRootState().game.options
            .optionsState[id];
    },
    getSetting(id) {
        return kantibotData.settings[id];
    },
    setSetting(id, value) {
        kantibotData.settings[id] = value;
        window.localStorage.kantibotConfig = JSON.stringify(kantibotData.settings);
    },
    applyCaptchaQuestion(question) {
        const answers = ["red", "blue", "yellow", "green"];
        const images = [
            "361bdde0-48cd-4a92-ae9f-486263ba8529", // red
            "9237bdd2-f281-4f04-b4e5-255e9055a194", // blue
            "d25c9d13-4147-4056-a722-e2a13fbb4af9", // yellow
            "2aca62f2-ead5-4197-9c63-34da0400703a", // green
        ];
        const imageIndex = Math.floor(Math.random() * answers.length);
        question.question = `[ANTIBOT] - CAPTCHA: Please select ${answers[imageIndex]}`;
        question.image = `https://media.kahoot.it/${images[imageIndex]}`;
        question.imageMetadata.id = images[imageIndex];
        question.kantibotCaptchaCorrectIndex = imageIndex;
        for (let i = 0; i < question.choices.length; i++) {
            question.choices[i].correct = i === imageIndex;
        }
    },
    /**
     * This function is called when the quiz is loaded.
     * It adds additional questions to the quiz. These questions can be removed or modified later.
     * This is done to prevent strange crashes during the game.
     */
    extraQuestionSetup(quiz) {
        if (quiz.kantibotModified)
            return;
        log("Modifying quiz information");
        quiz.kantibotModified = true;
        quiz.questions.push({
            question: "[ANTIBOT] - This poll is for countering Kahoot cheating sites.",
            time: 5000,
            type: "survey",
            isKAntibotQuestion: true,
            kantibotQuestionType: "counterCheats",
            choices: [{ answer: "OK", correct: true }],
        });
        {
            const question = {
                question: "[ANTIBOT] - CAPTCHA: Please select placeholder",
                time: 30000,
                type: "quiz",
                isKAntibotQuestion: true,
                kantibotQuestionType: "captcha",
                kantibotCaptchaCorrectIndex: 0,
                choices: [
                    { answer: "OK", correct: false },
                    { answer: "OK", correct: false },
                    { answer: "OK", correct: false },
                    { answer: "OK", correct: false },
                ],
                image: "",
                imageMetadata: {
                    width: 512,
                    height: 512,
                    id: "",
                    contentType: "image/png",
                    resources: "",
                },
                points: false,
            };
            METHODS.applyCaptchaQuestion(question);
            quiz.questions.splice(0, 0, question);
        }
    },
    kahootAlert(notice) {
        // See `showNotificationBar` in kahoot code
        // Currently unaccessible?
        alert(notice);
    },
    kickController(id, reason = "", fallbackController = null) {
        const controller = METHODS.getControllerById(id) ?? fallbackController;
        const name = (controller?.name?.length ?? 0) > 30
            ? `${controller?.name?.substring(0, 30)}...`
            : controller?.name;
        const banishedCachedData = kantibotData.runtimeData.unverifiedControllerNames.find((controller) => {
            return controller.cid === id;
        });
        log(`Kicked ${name || id}${reason ? ` - ${reason}` : ""}`);
        METHODS.sendData("/service/player", {
            cid: `${id}`,
            content: JSON.stringify({
                kickCode: 1,
                quizType: "quiz",
            }),
            gameid: METHODS.getPin(),
            host: "play.kahoot.it",
            id: 10,
            type: "message",
        });
        kantibotData.runtimeData.killCount++;
        if (banishedCachedData) {
            banishedCachedData.banned = true;
            banishedCachedData.time = 10;
        }
        if (METHODS.getControllers()[id]) {
            METHODS.removeControllerNative(id);
        }
        delete kantibotData.runtimeData.controllerData[id];
    },
    removeControllerNative(id) {
        this.simulateIncomingMessage([
            {
                ext: {
                    timetrack: Date.now(),
                },
                data: { cid: id, type: "left" },
                channel: `/controller/${METHODS.getPin()}`,
            },
        ]);
    },
    simulateIncomingMessage(data) {
        kantibotData.kahootInternals.socketHandler.onMessage(kantibotData.kahootInternals.socketLib, new MessageEvent("message", {
            data: JSON.stringify(data),
        }));
    },
    isEventJoinEvent(event) {
        return event.data?.type === "joined";
    },
    isEventAnswerEvent(event) {
        return event.data?.id === 45;
    },
    isEventTwoFactorEvent(event) {
        return event.data?.id === 50;
    },
    isEventTeamJoinEvent(event) {
        return event.data?.id === 18;
    },
    batchData(callback) {
        return kantibotData.kahootInternals.services.network.websocketInstance.batch(callback);
    },
    lockGame() {
        kantibotData.runtimeData.lockingGame = true;
        METHODS.sendData("/service/player", {
            gameid: METHODS.getPin(),
            type: "lock",
        });
    },
    unlockGame() {
        METHODS.sendData("/service/player", {
            gameid: METHODS.getPin(),
            type: "unlock",
        });
    },
    isLocked() {
        return kantibotData.kahootInternals.gameCore.isLocked;
    },
    getCurrentQuestion() {
        return (kantibotData.kahootInternals.apparentCurrentQuestion ??
            METHODS.getAntibotQuizData()?.questions[METHODS.getCurrentGameBlockIndex()] ??
            METHODS.getQuizData()?.questions[METHODS.getCurrentGameBlockIndex()]);
    },
    getCurrentGameBlockIndex() {
        return kantibotData.kahootInternals.services.game.navigation
            .currentGameBlockIndex;
    },
    getAntibotQuizData() {
        return kantibotData.runtimeData.kantibotModifiedQuiz;
    },
    getQuizData() {
        return kantibotData.kahootInternals.quizData;
    },
    getPin() {
        return kantibotData.kahootInternals.gameCore.pin;
    },
    getControllerById(id) {
        return METHODS.getControllers()[id];
    },
    getControllers() {
        return kantibotData.kahootInternals.gameCore.controllers;
    },
    sendData(channel, data) {
        return kantibotData.kahootInternals.services.network.websocketInstance.publish(channel, data);
    },
};
kantibotData.methods = METHODS;
const SEND_CHECKS = [
    function questionStartCheck(socket, data) {
        if (data?.data?.id === 2) {
            kantibotData.runtimeData.questionStartTime = Date.now();
            kantibotData.runtimeData.captchaIds = new Set();
        }
    },
    function restartCheck(socket, data) {
        if (data?.data?.id === 5 ||
            (data?.data?.id === 10 && data.data.content === "{}")) {
            kantibotData.runtimeData.lobbyLoadTime = 0;
            // Reset some data, which may be stale from previous round.
            Object.assign(kantibotData.runtimeData, {
                captchaIds: new Set(),
                englishWordDetectionData: new Set(),
                controllerNamePatternData: {},
            });
        }
    },
    function quizStartCheck(socket, data) {
        if (data?.data?.id === 9 && kantibotData.runtimeData.startLockElement) {
            clearInterval(kantibotData.runtimeData.startLockInterval);
            kantibotData.runtimeData.startLockElement.remove();
            kantibotData.runtimeData.startLockElement = null;
        }
    },
    function questionEndCheck(socket, data) {
        const currentQuestion = METHODS.getCurrentQuestion();
        if ((data?.data?.id === 4 || data?.data?.id === 8) &&
            currentQuestion?.isKAntibotQuestion &&
            currentQuestion?.kantibotQuestionType === "captcha") {
            const controllers = METHODS.getControllers();
            const answeredControllers = kantibotData.runtimeData.captchaIds;
            METHODS.batchData(() => {
                for (const id in controllers) {
                    if (controllers[id].isGhost || controllers[id].hasLeft) {
                        continue;
                    }
                    if (!answeredControllers.has(id)) {
                        METHODS.kickController(id, "Did not answer the CAPTCHA");
                    }
                }
            });
        }
    },
];
const RECV_CHECKS = [
    function ddosCheck() {
        if (!METHODS.isLocked() &&
            !kantibotData.runtimeData.lockingGame &&
            METHODS.getSetting("ddos") &&
            kantibotData.runtimeData.killCount -
                kantibotData.runtimeData.oldKillCount >
                METHODS.getSetting("ddos") / 3) {
            METHODS.lockGame();
            log("Detected bot spam, locking game for 1 minute");
            const lockEnforcingInterval = setInterval(() => {
                if (METHODS.isLocked()) {
                    clearInterval(lockEnforcingInterval);
                    kantibotData.runtimeData.lockingGame = false;
                }
                METHODS.lockGame();
            }, 250);
            if (METHODS.getSetting("counters")) {
                const ddosCounterElement = document.createElement("div");
                let timeLeft = 60;
                ddosCounterElement.innerHTML = `
          <span class="kantibot-count-num">60</span>
          <span class="kantibot-count-desc">Until Unlock</span>`;
                kantibotData.runtimeData.countersElement.append(ddosCounterElement);
                const ddosCounterInterval = setInterval(() => {
                    ddosCounterElement.querySelector(".kantibot-count-num").innerHTML =
                        `${--timeLeft}`;
                    if (timeLeft <= 0) {
                        clearInterval(ddosCounterInterval);
                        ddosCounterElement.remove();
                    }
                }, 1e3);
            }
            setTimeout(METHODS.unlockGame, 60e3);
        }
        return !BOT_DETECTED;
    },
    function basicDataCheck(socket, data) {
        if (!METHODS.isEventJoinEvent(data)) {
            return !BOT_DETECTED;
        }
        const player = data.data;
        if (Number.isNaN(+player.cid) ||
            Object.keys(player).length > 5 ||
            player.name.length >= 16) {
            if (kantibotData.runtimeData.controllerData[player.cid]) {
                return !BOT_DETECTED;
            }
            METHODS.kickController(player.cid, "Invalid name or information", player);
            return BOT_DETECTED;
        }
        return !BOT_DETECTED;
    },
    function nameratorCheck(socket, data) {
        if (!METHODS.isEventJoinEvent(data))
            return !BOT_DETECTED;
        if (METHODS.isUsingNamerator()) {
            const player = data.data;
            if (!METHODS.isValidNameratorName(player.name)) {
                METHODS.kickController(player.cid, "Name violates namerator rules", player);
                return BOT_DETECTED;
            }
        }
        return !BOT_DETECTED;
    },
    function nameSimilarityCheck(socket, data) {
        if (!METHODS.isEventJoinEvent(data))
            return !BOT_DETECTED;
        if (METHODS.isUsingNamerator())
            return !BOT_DETECTED;
        const player = data.data;
        const usernames = kantibotData.runtimeData.unverifiedControllerNames;
        for (const i in usernames) {
            if (kantibotData.runtimeData.verifiedControllerNames.has(usernames[i].name))
                continue;
            if (METHODS.similarity(usernames[i].name, player.name) >=
                METHODS.getSetting("percent")) {
                METHODS.batchData(() => {
                    METHODS.kickController(player.cid, "Name similar to other clients", player);
                    if (!usernames[i].banned) {
                        METHODS.kickController(usernames[i].cid, "Name similar to other clients", usernames[i]);
                    }
                });
                return BOT_DETECTED;
            }
        }
        return !BOT_DETECTED;
    },
    function blacklistCheck(socket, data) {
        if (!METHODS.isEventJoinEvent(data))
            return !BOT_DETECTED;
        const player = data.data;
        if (METHODS.blacklist(player.name)) {
            METHODS.kickController(player.cid, "Name is blacklisted", player);
            return BOT_DETECTED;
        }
        return !BOT_DETECTED;
    },
    function addNameIfNotBannedYet(socket, data) {
        if (!METHODS.isEventJoinEvent(data))
            return !BOT_DETECTED;
        const player = data.data;
        kantibotData.runtimeData.unverifiedControllerNames.push({
            name: player.name,
            cid: player.cid,
            time: 10,
            banned: false,
        });
        return !BOT_DETECTED;
    },
    function patternSimilarityCheck(socket, data) {
        if (!METHODS.isEventJoinEvent(data) ||
            METHODS.isUsingNamerator() ||
            !METHODS.getSetting("patterns")) {
            return !BOT_DETECTED;
        }
        const player = data.data;
        const pattern = METHODS.getPatterns(player.name);
        const patternData = kantibotData.runtimeData.controllerNamePatternData;
        if (METHODS.getSetting("reduceFalsePositives")) {
            if (pattern[0] === "L") {
                if (!Number.isNaN(+pattern.slice(1))) {
                    return !BOT_DETECTED;
                }
            }
        }
        if (typeof patternData[pattern] === "undefined") {
            patternData[pattern] = new Set();
        }
        patternData[pattern].add({
            playerData: player,
            timeAdded: Date.now(),
        });
        const PATTERN_SIZE_TEST = 15;
        const PATTERN_REMOVE_TIME = 5e3;
        // remove removable controller data
        for (const controller of patternData[pattern]) {
            if (Date.now() - controller.timeAdded > PATTERN_REMOVE_TIME) {
                patternData[pattern].delete(controller);
            }
        }
        if (patternData[pattern].size >= PATTERN_SIZE_TEST) {
            METHODS.batchData(() => {
                for (const controller of patternData[pattern]) {
                    if (controller.playerData.banned)
                        continue;
                    METHODS.kickController(controller.playerData.cid, "Names have very similar patterns", controller.playerData);
                    if (patternData[pattern].size >= PATTERN_SIZE_TEST + 10) {
                        patternData[pattern].delete(controller);
                    }
                    else {
                        controller.playerData.banned = true;
                        controller.timeAdded = Date.now(); // updates the 'time added' to current time, since the spam is still ongoing
                    }
                }
            });
            return BOT_DETECTED;
        }
        return !BOT_DETECTED;
    },
    function randomNameCheck(socket, data) {
        if (!METHODS.isEventJoinEvent(data) ||
            !METHODS.getSetting("looksRandom")) {
            return !BOT_DETECTED;
        }
        const player = data.data;
        const randomRegex = /(^(([^A-Z\n]*)?[A-Z]?([^A-Z\n]*)?){0,3}$)|^([A-Z]*)$/;
        if (!randomRegex.test(player.name)) {
            METHODS.kickController(player.cid, "Name looks too random", player);
            return BOT_DETECTED;
        }
        return !BOT_DETECTED;
    },
    function commonBotFormatCheck1(socket, data) {
        if (!METHODS.isEventJoinEvent(data) ||
            !METHODS.getSetting("blockformat1")) {
            return !BOT_DETECTED;
        }
        const player = data.data;
        if (/[a-z0-9]+[^a-z0-9\s][a-z0-9]+/gi.test(player.name)) {
            METHODS.kickController(player.cid, "Name fits common bot format #1", player);
            return BOT_DETECTED;
        }
        return !BOT_DETECTED;
    },
    function specializedFormatCheck(socket, data) {
        if (!METHODS.isEventJoinEvent(data) ||
            !METHODS.getSetting("blockservice1")) {
            return !BOT_DETECTED;
        }
        const player = data.data;
        const englishWords = window.aSetOfEnglishWords ?? new Set();
        const names = window.randomName;
        const split = player.name.split(/\s|(?=[A-Z0-9])/g);
        const foundNames = Array.from(player.name.match(/([A-Z][a-z]+(?=[A-Z]|[^a-zA-Z]|$))/g) ?? []);
        const detectionData = kantibotData.runtimeData.englishWordDetectionData;
        if (player.name.replace(/[ᗩᗷᑕᗪEᖴGᕼIᒍKᒪᗰᑎOᑭᑫᖇᔕTᑌᐯᗯ᙭Yᘔ]/g, "").length /
            player.name.length <
            0.5) {
            METHODS.kickController(player.cid, "Common bot bypass attempt", player);
            return BOT_DETECTED;
        }
        let findWord;
        let findName;
        if (METHODS.getSetting("reduceFalsePositives") &&
            split.length > 1) {
            findWord = split.every((word) => englishWords.has(word) || !Number.isNaN(+word));
            findName = split.every((word) => {
                if (!names)
                    return;
                const name = METHODS.capitalize(word);
                return (names.first.has(name) ||
                    names.middle.has(name) ||
                    names.last.has(name) ||
                    !Number.isNaN(+word));
            });
        }
        else {
            findWord = split.find((word) => englishWords.has(word));
            findName = foundNames.find((word) => {
                if (!names)
                    return;
                const name = METHODS.capitalize(word);
                return (names.first.has(name) ||
                    names.middle.has(name) ||
                    names.last.has(name));
            });
        }
        const TOTAL_SPAM_AMOUNT_THRESHOLD = 20;
        const TIME_TO_FORGET = 4e3;
        if (findWord || findName) {
            detectionData.add({
                playerData: player,
                timeAdded: Date.now(),
            });
            for (const controller of detectionData) {
                if (Date.now() - controller.timeAdded > TIME_TO_FORGET) {
                    detectionData.delete(controller);
                }
            }
            if (detectionData.size > TOTAL_SPAM_AMOUNT_THRESHOLD) {
                METHODS.batchData(() => {
                    for (const controller of detectionData) {
                        if (controller.playerData.banned)
                            continue;
                        METHODS.kickController(controller.playerData.cid, "Appears to be a spam of randomized names", controller.playerData);
                        if (detectionData.size >= TOTAL_SPAM_AMOUNT_THRESHOLD + 10) {
                            detectionData.delete(controller);
                        }
                        else {
                            controller.playerData.banned = true;
                            controller.timeAdded = Date.now();
                        }
                    }
                });
                return BOT_DETECTED;
            }
        }
        return !BOT_DETECTED;
    },
    function fakeValidNameCheck(socket, data) {
        if (!METHODS.isEventJoinEvent(data) || METHODS.isUsingNamerator()) {
            return !BOT_DETECTED;
        }
        const player = data.data;
        const TIME_THRESHOLD = 5e3;
        if (METHODS.isFakeValid(player.name)) {
            if (Date.now() - kantibotData.runtimeData.lastFakeLoginTime <
                TIME_THRESHOLD) {
                METHODS.batchData(() => {
                    METHODS.kickController(player.cid, "Uses a suspicious fake, 'valid' name");
                    const previous = METHODS.getControllerById(kantibotData.runtimeData.lastFakeUserID);
                    if (previous) {
                        METHODS.kickController(previous.cid, "Uses a suspicious fake, 'valid' name", player);
                    }
                });
                kantibotData.runtimeData.lastFakeLoginTime = Date.now();
                kantibotData.runtimeData.lastFakeUserID = player.cid;
                return BOT_DETECTED;
            }
            kantibotData.runtimeData.lastFakeLoginTime = Date.now();
            kantibotData.runtimeData.lastFakeUserID = player.cid;
        }
        return !BOT_DETECTED;
    },
    function captchaAnswerCheck(socket, data) {
        if (!METHODS.isEventAnswerEvent(data))
            return !BOT_DETECTED;
        const player = data.data;
        const currentQuestion = METHODS.getCurrentQuestion();
        if (currentQuestion?.isKAntibotQuestion &&
            currentQuestion?.kantibotQuestionType === "captcha") {
            kantibotData.runtimeData.captchaIds.add(player.cid);
            let choice = -1;
            try {
                choice = JSON.parse(player.content).choice;
            }
            catch {
                /* ignore */
            }
            if (choice !== currentQuestion.kantibotCaptchaCorrectIndex) {
                METHODS.kickController(player.cid, "Incorrectly answered the CAPTCHA", player);
            }
        }
        return !BOT_DETECTED;
    },
    function fastAnswerCheck(socket, data) {
        if (!METHODS.isEventAnswerEvent(data))
            return !BOT_DETECTED;
        const player = data.data;
        const controllerData = kantibotData.runtimeData.controllerData[player.cid];
        if (Date.now() - kantibotData.runtimeData.questionStartTime < 500 &&
            METHODS.getSetting("timeout")) {
            return BOT_DETECTED;
        }
        if (controllerData && Date.now() - controllerData.loginTime < 1e3) {
            METHODS.kickController(player.cid, "Answered immediately after joining!", player);
            return BOT_DETECTED;
        }
        return !BOT_DETECTED;
    },
    function twoFactorCheck(socket, data) {
        if (!METHODS.isEventTwoFactorEvent(data))
            return !BOT_DETECTED;
        const player = data.data;
        const controllerData = kantibotData.runtimeData.controllerData[player.cid];
        const MAX_ATTEMPTS = 3;
        if (controllerData) {
            controllerData.twoFactorAttempts++;
            if (controllerData.twoFactorAttempts > MAX_ATTEMPTS) {
                METHODS.kickController(player.cid, "Attempted to answer the two-factor code using brute force", player);
            }
        }
        return !BOT_DETECTED;
    },
    function teamCheck(socket, data) {
        if (!METHODS.isEventTeamJoinEvent(data))
            return !BOT_DETECTED;
        const player = data.data;
        const team = JSON.parse(player.content);
        if (team.length === 0 ||
            team.indexOf("") !== -1 ||
            team.indexOf("Player 1") === 0 ||
            team.join("") === "Youjustgotbotted") {
            METHODS.kickController(player.cid, "Team names are suspicious", player);
            return BOT_DETECTED;
        }
        return !BOT_DETECTED;
    },
    function lobbyAutoStartCheck(socket, data) {
        if (!METHODS.isEventJoinEvent(data))
            return !BOT_DETECTED;
        if (kantibotData.kahootInternals.services.game.navigation.page === "lobby" &&
            METHODS.getKahootSetting("automaticallyProgressGame") &&
            METHODS.getSetting("start_lock") !== 0) {
            if (kantibotData.runtimeData.lobbyLoadTime === 0) {
                kantibotData.runtimeData.lobbyLoadTime = Date.now();
                if (METHODS.getSetting("counters")) {
                    const container = document.createElement("div");
                    container.innerHTML = `<span class="kantibot-count-num">${Math.round(METHODS.getSetting("start_lock") -
                        (Date.now() - kantibotData.runtimeData.lobbyLoadTime) / 1e3)}</span>
            <span class="kantibot-count-desc">Until Auto-Start</span>`;
                    const startLockInterval = setInterval(() => {
                        let time = Math.round(METHODS.getSetting("start_lock") -
                            (Date.now() - kantibotData.runtimeData.lobbyLoadTime) / 1e3);
                        if (time < 0) {
                            time = "Please Wait...";
                        }
                        container.querySelector(".kantibot-count-num").innerHTML =
                            `${time}`;
                    }, 1e3);
                    kantibotData.runtimeData.countersElement.append(container);
                    kantibotData.runtimeData.startLockElement = container;
                    kantibotData.runtimeData.startLockInterval = startLockInterval;
                }
            }
            if (Date.now() - kantibotData.runtimeData.lobbyLoadTime >
                METHODS.getSetting("start_lock") * 1e3) {
                const controllers = METHODS.getControllers();
                const realController = Object.values(controllers).find((controller) => {
                    return !controller.isGhost && !controller.hasLeft;
                });
                if (!realController) {
                    kantibotData.runtimeData.lobbyLoadTime = Date.now();
                }
                else {
                    kantibotData.kahootInternals.methods.startQuiz();
                    if (kantibotData.runtimeData.startLockElement) {
                        clearInterval(kantibotData.runtimeData.startLockInterval);
                        kantibotData.runtimeData.startLockElement.remove();
                        kantibotData.runtimeData.startLockElement = null;
                    }
                }
            }
        }
        return !BOT_DETECTED;
    },
];
setInterval(function updateStats() {
    const unverifiedControllerNames = kantibotData.runtimeData.unverifiedControllerNames;
    const verifiedControllerNames = kantibotData.runtimeData.verifiedControllerNames;
    for (const i in unverifiedControllerNames) {
        const data = unverifiedControllerNames[i];
        if (data.time <= 0 &&
            !data.banned &&
            !verifiedControllerNames.has(data.name)) {
            verifiedControllerNames.add(data.name);
            continue;
        }
        if (data.time <= -20) {
            unverifiedControllerNames.splice(+i, 1);
            continue;
        }
        data.time--;
    }
}, 1e3);
setInterval(function updateOldKillCount() {
    kantibotData.runtimeData.oldKillCount = kantibotData.runtimeData.killCount;
}, 20e3);
function websocketMessageSendHandler(socket, message) {
    const data = JSON.parse(message)[0];
    for (const check of SEND_CHECKS) {
        check(socket, data);
    }
}
const BOT_DETECTED = true;
function websocketMessageReceiveVerification(socket, message) {
    const incoming = JSON.parse(message.data);
    for (const data of incoming) {
        for (const check of RECV_CHECKS) {
            if (check(socket, data) === BOT_DETECTED) {
                return BOT_DETECTED;
            }
        }
        if (METHODS.isEventJoinEvent(data)) {
            kantibotData.runtimeData.controllerData[data.data.cid] = {
                loginTime: Date.now(),
                twoFactorAttempts: 0,
            };
        }
    }
    return !BOT_DETECTED;
}
const localConfig = JSON.parse(window.localStorage.kantibotConfig ??
    window.localStorage.antibotConfig ??
    "{}");
for (const setting in localConfig) {
    try {
        const settingType = kantibotData.settingsTypes[setting];
        const current = METHODS.getSetting(setting);
        let value = localConfig[setting] ?? current;
        if (value)
            switch (settingType) {
                case "boolean":
                    value = !!value;
                    break;
                case "number":
                    value = +value;
                    break;
                case "string":
                    value = `${value}`;
                    break;
            }
        METHODS.setSetting(setting, value);
    }
    catch {
        /* ignored */
    }
}
function injectAntibotSettings(target) {
    const lastIndex = target.children.length - 1;
    const antibotIndex = lastIndex - 2;
    const lastItem = target.children[lastIndex];
    if (typeof lastItem.type === "function" &&
        lastItem.props?.text?.id ===
            "player.components.game-options-menu.unableToResetToDefaultsInGame") {
        // Check if the antibot settings are already injected
        const antibotItem = target.children[antibotIndex];
        if (antibotItem.type === "div" &&
            antibotItem.props?.id === "kantibot-settings") {
            return;
        }
        const { createElement } = window.React;
        const settings = [
            KAntibotSettingComponent({
                title: "Block Fast Answers",
                inputType: "checkbox",
                id: "timeout",
                description: "Blocks answers sent before 0.5 seconds after the question starts",
            }),
            KAntibotSettingComponent({
                title: "Block Random Names",
                inputType: "checkbox",
                id: "looksRandom",
                description: "Blocks names that look random, such as 'rAnDOM naMe'",
            }),
            KAntibotSettingComponent({
                title: "Block Format F[.,-]L",
                inputType: "checkbox",
                id: "blockformat1",
                description: "Blocks names using the format [First][random char][Last]",
            }),
            KAntibotSettingComponent({
                title: "Additional Blocking Filters",
                inputType: "checkbox",
                id: "blockservice1",
                description: "Enables multiple additional blocking filters for some bot programs",
            }),
            KAntibotSettingComponent({
                title: "Block Numbers",
                inputType: "checkbox",
                id: "blocknum",
                description: "Blocks names containing numbers, if multiple with numbers join within a short period of time",
            }),
            KAntibotSettingComponent({
                title: "Force Alphanumeric Names",
                inputType: "checkbox",
                id: "forceascii",
                description: "Blocks names containing non-alphanumeric characters, if multiple join within a short period of time",
            }),
            KAntibotSettingComponent({
                title: "Detect Patterns",
                inputType: "checkbox",
                id: "patterns",
                description: "Blocks bots spammed using similar patterns",
            }),
            KAntibotSettingComponent({
                title: "Additional Question Time",
                inputType: "number",
                id: "teamtimeout",
                description: "Adds extra seconds to a question. May cause issues with scoring.",
                inputProps: {
                    step: 1,
                },
            }),
            KAntibotSettingComponent({
                title: "Two-Factor Auth Timer",
                inputType: "number",
                id: "twoFactorTime",
                description: "Specify the number of seconds for the two-factor auth.",
                inputProps: {
                    step: 1,
                    min: 1,
                },
            }),
            KAntibotSettingComponent({
                title: "Name Match Percent",
                inputType: "number",
                id: "percent",
                description: "Specify the percent of similarity between names to kick.",
                inputProps: {
                    step: 0.1,
                },
            }),
            KAntibotSettingComponent({
                title: "Word Blacklist",
                inputType: "textarea",
                id: "wordblock",
                description: "Specify the words to block, separated by a new line.",
            }),
            KAntibotSettingComponent({
                title: "Auto-Lock Threshold",
                inputType: "number",
                id: "ddos",
                description: "Specify the number of bots to join per minute before locking the game. Set to 0 to disable.",
                inputProps: {
                    step: 1,
                },
            }),
            KAntibotSettingComponent({
                title: "Lobby Auto-Start Time",
                inputType: "number",
                id: "start_lock",
                description: "Specify the number of seconds to wait before auto-starting the game after a player joins. Set to 0 to disable.",
                inputProps: {
                    step: 1,
                },
            }),
            KAntibotSettingComponent({
                title: "Show Antibot Timers",
                inputType: "checkbox",
                id: "counters",
                description: "Display Antibot Counters/Timers (Lobby Auto-Start, Auto-Lock, etc)",
            }),
            KAntibotSettingComponent({
                title: "Counter Kahoot! Cheats",
                inputType: "checkbox",
                id: "counterCheats",
                description: "Adds an additional 5 second question at the end to counter cheats.",
            }),
            KAntibotSettingComponent({
                title: "Enable CAPTCHA",
                inputType: "checkbox",
                id: "enableCAPTCHA",
                description: "Adds a 30 second poll at the start of the quiz. If players don't answer it correctly, they get banned.",
            }),
            KAntibotSettingComponent({
                title: "Reduce False Positives",
                inputType: "checkbox",
                id: "reduceFalsePositives",
                description: "Reduces false positives by making the antibot less strict.",
            }),
        ];
        const antibotSettingsContainer = createElement("div", { id: "kantibot-settings" }, createElement("div", { className: "kantibot-settings-header" }, `KAntibot v${KANTIBOT_VERSION} by theusaf`), ...settings);
        // Inject the antibot settings
        target.children.splice(antibotIndex + 1, 0, antibotSettingsContainer);
    }
}
const styles = document.createElement("style");
styles.textContent = `

  /* settings */

  #kantibot-settings {
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px 1.5rem 1.5rem;
    padding-inline-start: calc(1.5rem + env(safe-area-inset-left));
    border-bottom: 1px solid rgb(204, 204, 204);
  }
  .kantibot-setting-container {
    display: flex;
    padding: 0.5rem;
    padding-left: 0;
    align-self: stretch;
    justify-content: flex-start;
    margin: 0.5rem 0;
    border-radius: 0.5rem;
    flex-direction: row;
  }
  .kantibot-setting-container label {
    text-align: start;
    font-size: 1rem;
    flex-grow: 1;
  }
  .kantibot-settings-header {
    margin-top: 1.5rem;
    color: rgb(110, 110, 110);
  }
  .kantibot-setting-description {
    height: 1rem;
    display: inline-flex;
    text-align: center;
    background: darkgray;
    border-radius: 2rem;
    color: white;
    align-items: center;
    padding: 0 0.25rem;
    margin-right: 0.5rem;
  }

  /* counters */

  #kantibot-counters {
    position: absolute;
    right: 10rem;
    top: 11rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    pointer-events: none;
    z-index: 1;
  }
  #kantibot-counters div {
    background: rgba(0,0,0,0.5);
    padding: 0.5rem;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .kantibot-count-num {
    display: block;
    text-align: center;
  }
  .kantibot-count-desc {
    text-align: center;
    font-size: 1.25rem;
    display: block;
  }
`;
const waitForHeader = setInterval(() => {
    if (document.head && document.body) {
        const counters = document.createElement("div");
        counters.id = "kantibot-counters";
        document.body.append(counters);
        kantibotData.runtimeData.countersElement = counters;
        document.head.append(styles);
        clearInterval(waitForHeader);
    }
}, 100);
function KAntibotSettingLabelComponent({ title, id, description, }) {
    const { createElement, Fragment } = window.React;
    return createElement(Fragment, {}, createElement("span", {
        className: "kantibot-setting-description",
        title: description,
    }, "?"), createElement("label", { htmlFor: `kantibot-setting-${id}` }, title));
}
function KAntibotSettingComponent({ title, inputType, id, description, inputProps = {}, onChange, }) {
    const { createElement } = window.React;
    let elementName = "input";
    if (inputType === "textarea")
        elementName = "textarea";
    if (inputType === "checkbox")
        inputProps.defaultChecked = METHODS.getSetting(id);
    else
        inputProps.defaultValue = METHODS.getSetting(id);
    return createElement("div", { className: "kantibot-setting-container" }, KAntibotSettingLabelComponent({ title, id, description }), createElement(elementName, {
        id: `kantibot-setting-${id}`,
        className: `kantibot-setting-input ${inputType}`,
        type: inputType,
        ...inputProps,
        onChange: (event) => {
            let value;
            if (inputType === "checkbox") {
                value = event.target.checked;
            }
            else if (inputType === "number") {
                value = +event.target.value;
            }
            else {
                value = event.target.value;
            }
            if (onChange)
                onChange(value);
            METHODS.setSetting(id, value);
        },
    }));
}
// Apply hooks
let currentQuestionChanged = true;
let quizRepairTimeout = null;
const originalPush = Array.prototype.push;
window.addEventListener("load", () => {
    Array.prototype.push = function (...args) {
        if (args.length) {
            const value = args[0];
            const isQuestion = typeof value === "object" &&
                value &&
                typeof value.type === "string" &&
                typeof value.question === "string";
            if (isQuestion) {
                const valueString = JSON.stringify(value);
                if (valueString !==
                    JSON.stringify(kantibotData.kahootInternals.apparentCurrentQuestion)) {
                    currentQuestionChanged = true;
                }
                if (currentQuestionChanged) {
                    kantibotData.kahootInternals.apparentCurrentQuestion = value;
                    kantibotData.kahootInternals.apparentCurrentQuestionIndex =
                        kantibotData.kahootInternals.quizData.questions.findIndex((question) => JSON.stringify(question) === valueString);
                    currentQuestionChanged = false;
                }
            }
        }
        return originalPush.call(this, ...args);
    };
});
function scanElements(...args) {
    const params = args?.[1];
    if (typeof params?.onClick === "function" &&
        typeof params?.functionalSelector === "string") {
        if (params.functionalSelector === "start-button") {
            kantibotData.kahootInternals.methods.startQuiz = params.onClick;
        }
    }
}
const KANTIBOT_HOOKS = {
    options: {
        prop: "store",
        condition: (_, value) => typeof value?.getState === "function",
        callback: (_, value) => {
            kantibotData.kahootInternals.methods.getRootState = value.getState;
            return true;
        },
    },
    jsx: {
        prop: "jsx",
        condition: (_, value) => typeof value === "function",
        callback: (target, value) => {
            const original = value;
            target.jsx = function (...args) {
                scanElements(...args);
                const result = original.call(this, ...args);
                return result;
            };
            return true;
        },
    },
    jsxs: {
        prop: "jsxs",
        condition: (_, value) => typeof value === "function",
        callback: (target, value) => {
            const original = value;
            target.jsxs = function (...args) {
                scanElements(...args);
                const result = original.call(this, ...args);
                return result;
            };
            return true;
        },
    },
    gameCore: {
        prop: "core",
        condition: (_, value) => !!value?.quiz,
        callback: (_, value) => {
            kantibotData.kahootInternals.gameCore = value;
            kantibotData.kahootInternals.quizData = value.quiz;
            METHODS.extraQuestionSetup(value.quiz);
            return false;
        },
    },
    gameInformation: {
        prop: "game",
        condition: (target, value) => typeof value === "object" &&
            typeof target.features === "object" &&
            typeof target.router === "object",
        callback: (target) => {
            kantibotData.kahootInternals.services = target;
            return false;
        },
    },
    answersData: {
        prop: "answers",
        condition: (_, value) => !!value?.answerMaps,
        callback: (_, value) => {
            kantibotData.kahootInternals.answerDetails = value;
            return false;
        },
    },
    socket: {
        prop: "onMessage",
        condition: (target, value) => typeof value === "function" &&
            typeof target.reset === "function" &&
            typeof target.onOpen === "function",
        callback: (target, value) => {
            kantibotData.kahootInternals.socketHandler = target;
            target.onMessage = function (socket, message) {
                kantibotData.kahootInternals.socket = socket.webSocket;
                kantibotData.kahootInternals.socketLib = socket;
                if (!socket.webSocket.oldSend) {
                    socket.webSocket.oldSend = socket.webSocket.send;
                    socket.webSocket.send = function send(data) {
                        try {
                            websocketMessageSendHandler(socket, data);
                        }
                        catch (err) {
                            log("Error in websocketMessageSendHandler");
                            console.error(err);
                        }
                        socket.webSocket.oldSend(data);
                    };
                }
                let verificationResult = !BOT_DETECTED;
                try {
                    verificationResult = websocketMessageReceiveVerification(socket, message);
                }
                catch (err) {
                    log("Error in websocketMessageReceiveVerification");
                    console.error(err);
                }
                if (verificationResult === !BOT_DETECTED) {
                    return value.call(this, socket, message);
                }
            };
            return true;
        },
    },
    twoFactor: {
        prop: "twoFactorAuth",
        condition: (_, value) => typeof value === "function",
        callback: (target, value) => {
            kantibotData.kahootInternals.gameConstructors = target;
            target.twoFactorAuth = (input, payload) => {
                const result = value.call(target, input, payload);
                if (payload.type === "player/two-factor-auth/RESET") {
                    const customTime = METHODS.getSetting("twoFactorTime");
                    if (customTime > 0) {
                        result.counter = Math.ceil(customTime);
                    }
                }
                return result;
            };
            return true;
        },
    },
    questionTime: {
        prop: "core",
        condition: (_, value) => typeof value === "function",
        callback: (target, value) => {
            target.core = function core(input, payload) {
                switch (payload.type) {
                    case "services/rest/FETCH_USER_DATA": {
                        const original = payload.payload.onSuccess;
                        payload.payload.onSuccess = function onSuccess(data) {
                            kantibotData.kahootInternals.userData = data;
                            return original(data);
                        };
                        break;
                    }
                }
                const result = value.call(target, input, payload);
                // Warning to future maintainer
                // Adding questions here may seem to work, but will
                // cause Kahoot! to crash.
                switch (payload.type) {
                    case "player/game/START_GAME":
                    case "player/game/PLAY_AGAIN":
                    case "player/game/RESET_GAME": {
                        const quiz = JSON.parse(JSON.stringify(result.quiz));
                        const originalQuestions = JSON.parse(JSON.stringify(result.quiz.questions));
                        quiz.questions = [...result.quiz.questions];
                        if (!METHODS.getSetting("counterCheats")) {
                            const index = quiz.questions.findIndex((question) => question.isKAntibotQuestion &&
                                question.kantibotQuestionType === "counterCheats");
                            if (index !== -1) {
                                log("Removing counterCheats question");
                                quiz.questions.splice(index, 1);
                            }
                        }
                        if (!METHODS.getSetting("enableCAPTCHA")) {
                            const index = quiz.questions.findIndex((question) => question.isKAntibotQuestion &&
                                question.kantibotQuestionType === "captcha");
                            if (index !== -1) {
                                log("Removing CAPTCHA question");
                                quiz.questions.splice(index, 1);
                            }
                        }
                        else {
                            const index = quiz.questions.findIndex((question) => question.isKAntibotQuestion &&
                                question.kantibotQuestionType === "captcha");
                            if (index !== -1) {
                                log("Updating CAPTCHA question");
                                METHODS.applyCaptchaQuestion(quiz.questions[index]);
                            }
                        }
                        // modify each question based on time setting
                        for (const question of quiz.questions) {
                            let originalTime = question.time;
                            Object.defineProperty(question, "time", {
                                set(v) {
                                    originalTime = v;
                                },
                                get() {
                                    const extraTime = METHODS.getSetting("teamtimeout") * 1000;
                                    return originalTime + extraTime;
                                },
                            });
                        }
                        kantibotData.runtimeData.kantibotModifiedQuiz = quiz;
                        result.quiz = quiz;
                        log("Modified quiz data", quiz.questions);
                        if (!quizRepairTimeout) {
                            // To ensure that the quiz data is not modified
                            // for the next game, we need to reset it
                            quizRepairTimeout = setTimeout(() => {
                                kantibotData.kahootInternals.gameCore.quiz.questions =
                                    originalQuestions;
                                quizRepairTimeout = null;
                            }, 100);
                        }
                        break;
                    }
                }
                return result;
            };
            return true;
        },
    },
    settings: {
        prop: "children",
        condition: (target, value) => Array.isArray(value) &&
            value.length > 8 &&
            typeof target.isOpen === "boolean",
        callback: (target) => {
            injectAntibotSettings(target);
            return false;
        },
    },
    react: {
        prop: "createElement",
        condition: (_, value) => typeof value === "function",
        callback: (target) => {
            window.React = target;
            return true;
        },
    },
};
for (const hook of Object.values(KANTIBOT_HOOKS)) {
    addHook(hook);
}
// Exposing KAntibot information to the window
window.antibotAdditionalScripts ??= [];
window.kantibotData = kantibotData;
window.kantibotEnabled = true;
window.kantibotVersion = KANTIBOT_VERSION;
window.kantibotAddHook = addHook;
for (const script of window.antibotAdditionalScripts) {
    try {
        script();
    }
    catch {
        /* ignored */
    }
}
/**
 * External Libraries
 * Note: This script requires https://raw.githubusercontent.com/theusaf/a-set-of-english-words/master/index.js
 * - This is a script that loads 275k english words into a set. (about 30MB ram?)
 * @see https://github.com/theusaf/a-set-of-english-words
 *
 * Also, it requires https://raw.githubusercontent.com/theusaf/random-name/master/names.js
 * - Loads a bunch of names into sets.
 * @see https://raw.githubusercontent.com/theusaf/random-name
 *
 * If these get removed or fail to load, this should not break the service, but will cause certain features to not work
 */
const requiredAssets = [
    "https://cdn.jsdelivr.net/gh/theusaf/a-set-of-english-words@c1ab78ece625138cae66fc32feb18f293ff49001/index.js",
    "https://cdn.jsdelivr.net/gh/theusaf/random-name@3047117dc088740f018cb9a3ec66b5ef20ea52bd/names.js",
];
for (const asset of requiredAssets) {
    import(asset).catch(() => {
        console.warn(`Failed to load ${asset}`);
    });
}
