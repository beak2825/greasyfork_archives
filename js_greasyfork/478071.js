// ==UserScript==
// @name         IdlePixel Wiki Search Bot
// @namespace    com.zlef.idlepixel
// @version      1.2.36
// @description  For user wikisearch to read chat and search
// @author       Zlef
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/478071/IdlePixel%20Wiki%20Search%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/478071/IdlePixel%20Wiki%20Search%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class WikiSearch extends IdlePixelPlusPlugin {
        constructor() {
            super("wikisearchbot", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "cooldownTime",
                        label: "Cooldown duration in minutes",
                        type: "integer",
                        min: 1,
                        max: 10,
                        type: "integer",
                        default: 2
                    },
                    {
                        id: "blacklist",
                        label: "Blacklist",
                        type: "string",
                        max: 200000,
                        default: "light,ooga booga"
                    },
                    {
                        id: "whitelist",
                        label: "Whitelist",
                        type: "string",
                        max: 200000,
                        default: "zlef,cammyrock,godofnades,axe,i am smitty,agrodon"
                    },
                    {
                        id: "profanitylist",
                        label: "Profanity filter list",
                        type: "string",
                        max: 200000,
                        default: "badword_example"
                    },
                    {
                        id: "altTraders",
                        label: "Alt trader list",
                        type: "string",
                        max: 200000,
                        default: "slayrea,elcin,deusgramm2,kill dragon,guest7929483,jens,guesttool,harry0129,boktay,asterixgooon,chrisfly007,idlpixel1234"
                    }
                ]
            });
            this.lastRunDict = {};
            Object.getOwnPropertyNames(Object.getPrototypeOf(this))
                .filter(prop => typeof this[prop] === 'function')
                .forEach(funcName => {
                this.lastRunDict[funcName] = 0;
            });
            this.shortcuts = JSON.parse(window.localStorage.getItem("shortcuts"));
            if (this.shortcuts === null) {
                this.shortcuts = {"bg": "Beginner Guide"};
                window.localStorage.setItem("shortcuts", JSON.stringify(this.shortcuts));
            }
            this.quietMode = false;
        }

        onLogin() {
            this.blacklist = IdlePixelPlus.plugins.wikisearchbot.getConfig("blacklist").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").toLowerCase().split(',');
            this.whitelist = IdlePixelPlus.plugins.wikisearchbot.getConfig("whitelist").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").toLowerCase().split(',');
            this.profanityFilter = IdlePixelPlus.plugins.wikisearchbot.getConfig("profanitylist").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(" ",",").toLowerCase().split(',');
            this.altTraders = IdlePixelPlus.plugins.wikisearchbot.getConfig("altTraders").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").toLowerCase().split(',');
            this.cooldownTime = IdlePixelPlus.plugins.wikisearchbot.getConfig("cooldownTime") * 60000
            this.username = document.querySelector('item-display[data-key="username"]').innerText;
        }

        cooldown(funcToRun, data) {
            let currentTime = Date.now();

            if (this.whitelist.includes(data.username)) {
                funcToRun.call(this, data);
                return
            }
            if (!this.lastRunDict.hasOwnProperty(funcToRun.name) || currentTime - this.lastRunDict[funcToRun.name] >= this.cooldownTime) {
                this.lastRunDict[funcToRun.name] = currentTime;
                funcToRun.call(this, data);
            } else {
                console.log(`${data.username} attempted ${data.message} at ${new Date().toLocaleString()} while on cooldown`);
            }
        }

        sendResponse(message) {
            if (this.quietMode) {
                console.log(message);
            } else {
                IdlePixelPlus.sendMessage(`CHAT=${message}`);
            }
        }

        testWiki(testCmd) {
            const data = { username: "zlef", sigil: "ice_hawk_sigil_chat", tag: "none", level: 1141, message: `?${testCmd}` };
            if (data.message.startsWith("?wiki")) {
                this.cooldown(this.wikiurl, data);
            } else if (data.message.startsWith("?help")) {
                this.cooldown(this.wikihelp, data);
            } else if (data.message.startsWith("?add")){
                this.wikiadd(data);
            } else if (data.message.startsWith("?remove")){
                this.wikiremove(data);
            } else if (data.message.startsWith("?keys")){
                this.wikikeys(data);
            } else if (data.message.startsWith("?axe")){
                this.wikiaxe(data);
            }
        }

        onConfigsChanged() {
            this.blacklist = IdlePixelPlus.plugins.wikisearchbot.getConfig("blacklist").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").replace(" ",",").toLowerCase().split(',');
            this.whitelist = IdlePixelPlus.plugins.wikisearchbot.getConfig("whitelist").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").replace(" ",",").toLowerCase().split(',');
            this.profanityFilter = IdlePixelPlus.plugins.wikisearchbot.getConfig("profanitylist").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").replace(" ",",").toLowerCase().split(',');
            this.altTraders = IdlePixelPlus.plugins.wikisearchbot.getConfig("altTraders").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").toLowerCase().split(',');
            this.cooldownTime = IdlePixelPlus.plugins.wikisearchbot.getConfig("cooldownTime") * 60000
        }

        onChat(data) {
            if (this.username === "wikisearch") {
                if (data.message.startsWith("?wiki")) {
                    this.cooldown(this.wikiurl, data);
                } else if (data.message.startsWith("?help")) {
                    this.cooldown(this.wikihelp, data);
                } else if (data.message.startsWith("?add")){
                    this.wikiadd(data);
                } else if (data.message.startsWith("?remove")){
                    this.wikiremove(data);
                } else if (data.message.startsWith("?keys")){
                    this.wikikeys(data);
                } else if (data.message.startsWith("?axe")){
                    this.wikiaxe(data);
                }
            }
        }

        wikiurl(data) {
            if (this.altTraders.includes(data.username)) {
                this.sendResponse("I think this is the link you're looking for: https://idle-pixel.com/rules/ \(under alt trading\)");
                console.log(`${data.username} triggered alt trader response @ ${new Date().toLocaleString()}`);
                return;
            }
            if (!this.blacklist.includes(data.username)) {
                if (data.message.trim() === "?wiki") {
                    return;
                }
                const messageParts = data.message.split(" ");
                messageParts.shift();
                let searchTerm = messageParts.join(" ");
                searchTerm = searchTerm.split("@")[0].trim();

                const searchTermWords = searchTerm.toLowerCase().split(' ');
                const containsBadWord = this.profanityFilter.some(badWord => searchTermWords.includes(badWord));
                if (containsBadWord) {
                    console.log(`Profanity detected from ${data.username} at ${new Date().toLocaleString()}`);
                    return;
                }

                if (searchTerm.toLowerCase() === "hi") {
                    this.sendResponse(`I'm not ChatGPT, I wont pretend to be your girlfriend.`);
                    console.log(`${data.username} said hi at ${new Date().toLocaleString()}`);
                    return;
                }

                searchTerm = encodeURIComponent(searchTerm);
                if (this.shortcuts.hasOwnProperty(searchTerm)) {
                    searchTerm = encodeURIComponent(this.shortcuts[searchTerm]);
                }
                const wiki_link = `https://idle-pixel.wiki/index.php?search=${searchTerm}`;
                this.sendResponse(wiki_link);
                console.log(`${data.username} triggered ${decodeURIComponent(searchTerm)} at ${new Date().toLocaleString()}`);

            }
        }

        wikihelp(data) {
            console.log(`${data.username} triggered wikihelp at ${new Date().toLocaleString()}`);
            const jokeResponses = [
                "Really... I have one command you can use. ?wiki. What help could you possibly need.",
                "Why do you keep asking for help? Just use ?wiki.",
                "Have you tried turning it off and on again?",
                "Don't tell anyone, but I'm actually a bot.",
                "...Did you just ask a bot for help?... Just use ?wiki...",
                "Why did the bot use ?wiki at the comedy club? It wanted to look up punchlines!",
                "I'd tell you to RTFM, but just use ?wiki instead.",
                "I had a joke about ?wiki, but I need to look it up.",
                "Hey... You should know, ?wiki is my safe word...",
            ];
            if (this.lastJoke) {
                jokeResponses.splice(jokeResponses.indexOf(this.lastJoke), 1);
            }
            const randomJoke = jokeResponses[Math.floor(Math.random() * jokeResponses.length)];
            this.lastJoke = randomJoke;
            if (this.whitelist.includes(data.username)) {
                const response = "Available functions: ?wiki, ?add, ?remove, ?keys";
                this.sendResponse(response);
            } else {
                this.sendResponse(randomJoke);
            }
        }

        wikiadd(data){
            console.log(`${data.username} triggered wikiadd with conditions ${data.message} at ${new Date().toLocaleString()}`);
            if (this.whitelist.includes(data.username)) {
                const messageParts = data.message.split(" ");
                messageParts.shift();
                let newShortcut = messageParts.join(" ");
                newShortcut = newShortcut.toLowerCase();

                if (!newShortcut.includes(":")) {
                    const addError = "Expected key:value, item not added";
                    this.sendResponse(addError);
                    return;
                }

                const [newKey, newItem] = newShortcut.split(":");

                if (newKey === "zlef") {
                    const specialMessage = "Zlef has been added as a shortcut for awesome";
                    this.sendResponse(specialMessage);
                    return;
                } else if (newKey === "cammy") {
                    const confirmation = `${newKey} has been added as a shortcut for ${newItem}`;
                    this.sendResponse(confirmation);
                    return;
                }

                if (this.shortcuts.hasOwnProperty(newKey)) {
                    const message = `That key is already in use for ${this.shortcuts[newKey]}. Use ?keys to view the err... Keys...`;
                    this.sendResponse(message);
                    return;
                }

                this.shortcuts[newKey] = newItem;
                window.localStorage.setItem("shortcuts", JSON.stringify(this.shortcuts));
                const confirmation = `${newKey} has been added as a shortcut for ${newItem}`;
                this.sendResponse(confirmation);
            } else {
                console.log(`${data.username} tried to trigger wikiadd with conditions ${data.message} at ${new Date().toLocaleString()}`);
            }
        }

        wikiremove(data) {
            if (this.whitelist.includes(data.username)) {
                console.log(`${data.username} triggered wikiremove with conditions ${data.message} at ${new Date().toLocaleString()}`);
                const messageParts = data.message.split(" ");
                messageParts.shift();
                let keyToRemove = messageParts.join(" ").toLowerCase();

                if (!this.shortcuts.hasOwnProperty(keyToRemove)) {
                    const message = `The key ${keyToRemove} doesn't exist. Nothing to remove.`;
                    this.sendResponse(message);
                    return;
                }

                if (keyToRemove === "cammy") {
                    const confirmation = `${keyToRemove} has been removed.`;
                    this.sendResponse(confirmation);
                    return
                }

                delete this.shortcuts[keyToRemove];
                window.localStorage.setItem("shortcuts", JSON.stringify(this.shortcuts));
                const confirmation = `${keyToRemove} has been removed.`;
                this.sendResponse(confirmation);
            } else {
                console.log(`${data.username} tried to trigger wikiremove with conditions ${data.message} at ${new Date().toLocaleString()}`);
            }
        }

        wikikeys(data) {
            console.log(`${data.username} triggered wikikeys with conditions ${data.message} at ${new Date().toLocaleString()}`);
            if (this.whitelist.includes(data.username)) {
                const totalKeys = Object.keys(this.shortcuts).sort().join(", ");
                const maxChars = 240;
                const prefix = "Keys page ";
                const maxMessageLength = maxChars - prefix.length;

                const totalPages = Math.ceil(totalKeys.length / maxMessageLength);

                let pageRequested = data.message.split(" ")[1];
                pageRequested = isNaN(pageRequested) ? 0 : parseInt(pageRequested); // Default to 0 if no page specified
                pageRequested = Math.min(pageRequested, totalPages);

                if (pageRequested === 0) {
                    let pageMessage = totalPages === 1 ? `Use "?keys n" to specify a page. Currently, there is 1 page.` : `Use "?keys n" to specify a page. Currently, there are ${totalPages} pages.`;
                    this.sendResponse(pageMessage);
                    return;
                }

                let startIdx = (pageRequested - 1) * maxMessageLength;
                let endIdx = startIdx + maxMessageLength;

                let responseKeys = totalKeys.substring(startIdx, endIdx);

                let responseMessage = totalPages === 1 ? `${prefix}1: ${responseKeys}` : `${prefix}${pageRequested} of ${totalPages}: ${responseKeys}`;
                this.sendResponse(responseMessage);
            } else{
                console.log(`${data.username} tried to trigger wikikeys with conditions ${data.message} at ${new Date().toLocaleString()}`);
            }
        }

        wikiaxe(data) {
            console.log(`${data.username} triggered axe at ${new Date().toLocaleString()}`);
            const axeJokes = [
                "Axe is level 15 because otherwise he'd be too ostentatious and you wouldn't be able to play what with all the bowing and scraping",
                "Shhhh, Lux is undercover as Axe to hide his moderator tag.",
                "Now you've done it! Years of undercover work blown because you just had to know why the moderator has an alt account.",
                "Who needs a moderator tag when you can wield an axe?",
                "Axe at level 15 is like Bruce Wayne in a tracksuit—still dangerous but less showy.",
                "Why does Axe stay at level 15? So he doesn't have to put 'Incognito Mode' in his username.",
                "Smitty once tried to upgrade Axe to level 16, but the universe crashed. Took him a week to restore the balance."
            ];

            if (this.lastAxeJoke) {
                axeJokes.splice(axeJokes.indexOf(this.lastAxeJoke), 1);
            }
            const randomAxeJoke = axeJokes[Math.floor(Math.random() * axeJokes.length)];
            this.lastAxeJoke = randomAxeJoke;

            if (this.whitelist.includes(data.username) || data.username === "Lux-Ferre") {
                this.sendResponse(randomAxeJoke);
            } else {
                console.log(`${data.username} tried to trigger wikikeys with conditions ${data.message} at ${new Date().toLocaleString()}`);
            }
        }
    }

    const plugin = new WikiSearch();
    IdlePixelPlus.registerPlugin(plugin);

})();

