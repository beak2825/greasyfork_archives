// ==UserScript==
// @name         OWOP Chat Utils
// @namespace    https://greasyfork.org/en/users/1502179/
// @version      1.7.1
// @description  Adds several useful features to the chat
// @author       NothingHere7759
// @match        https://ourworldofpixels.com/*
// @exclude      https://ourworldofpixels.com/api*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsEAAA7BAbiRa+0AAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAA2XYBAOgDAADZdgEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAACMojeFEB6NgAAArJJREFUeF7t28uNE1EQQFGbCFgzgZDGiEARaRAIrCeDYd8CqawpfP05Z9kLd7d99RZV8vn0IH79+Px+vPbIXl7fzsdr9+jT8QJckwBJCZCUAEkJkJQASQmQlABJCZBUNk2vNhdfvn47Xropv39+P166imqz4gQkJUBSAiQlQFICJCVAUgIkJUBSAiS1Pv3e3nA82+Zi+323n297Y+IEJCVAUgIkJUBSAiQlQFICJCVAUgIkNZ5qVxuO7Un+9L5Tt/58U9vvMd2YOAFJCZCUAEkJkJQASQmQlABJCZCUAEmNptWnCzYh00n+9uR92/Q9KtPvb/s9pve1CeEuCJCUAEkJkJQASQmQlABJCZCUAEmdpxuOqenkfTpRr0zf49ls/25OQFICJCVAUgIkJUBSAiQlQFICJCVAUuNNSLUZ2J68b7/H9vNt237fqen34gQkJUBSAiQlQFICJCVAUgIkJUBSAiR185uQynSS/yi2f9/p9+cEJCVAUgIkJUBSAiQlQFICJCVAUgIktb4JmU7Ap6b3ndp+vmcz/T2m37MTkJQASQmQlABJCZCUAEkJkJQASQmQlABJCZCUAEkJkJQASQmQlABJCZCUAEkJkNT4PyFT0/8MVKb/VeA6nICkBEhKgKQESEqApARISoCkBEhKgKTOxwv/Mt2YbG9CppuL6X2nn8fHvLy+jdpyApISICkBkhIgKQGSEiApAZISICkBkhpNq08XbEKmppuLio3Jx9iEcBcESEqApARISoCkBEhKgKQESEqApEbT6kvYmDy26YZjyglISoCkBEhKgKQESEqApARISoCkBEhqdap9ie2NyZTNyt9tbzimnICkBEhKgKQESEqApARISoCkBEhKgKSS6ff/UG1WKtXmYpsTkJQASQmQlABJCZCUAEkJkJQASQmQ1B8g1YFmQv53bQAAAABJRU5ErkJggg==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544854/OWOP%20Chat%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/544854/OWOP%20Chat%20Utils.meta.js
// ==/UserScript==

// CREDITS: Advice about the code - NekoNoka
//          Beta testers - Rainbow, SyntexPr

/* CHANGELOG
Quick Tell 1.0 - Added /q and /qid
Group Chat 1.0 - Added /g
1.0 - Combined Quick Tell and Group Chat into Chat Utils
1.1 - Minor bugfixes for /g tell, /qid, /q and /help
        Added /qgname and /qg
1.2 - Added /r
1.3 - Added /l, /lset and /clear
      Improved command messages
      Added aliases and changed some of the default commands
1.3.1 - Changed some command messages
Colorful Chat 0.0 - Added red, orange, gold, yellow, lime, green, cyan, blue, purple, violet, pink, magenta, brown, gray, grey, tree, grass, Mr. Smiles, Forest Land and Riverland
Colorful Chat 0.1 - Added white, black, rgb, Rainbow, Monochrome, Romaniaball, NothingHere, Diermania, SyntexPr, Trion, Coalition, Nortia, Vinland and [Server]
                    Fixed Mr. Smiles not having chat mentions
1.3.2 - Changed /clear to actually clear the chat
Colorful Chat 0.1.1 - Added RSSR, R55R, Moth, Potassium, Atlan, ATLaDOS, :D Anon, St. and Orang
Colorful Chat 1.0 - Rewrote the script with RegEx
                    Added crimson, indigo, fuchsia, mauve, South Nortia, Norisia and Evermore
                    Added support for hex color codes
                    Fixed :D Anon, St. and Моль not being colored
Colorful Chat 1.0.1 - Added water, :D-Anon, USRNSNN and URNNSN
                      Fixed some color names not working
1.4 - Incorporated Colorful Chat into Chat Utils
      Added /color
      Added chat mentions for colorful chat
1.4.1 - Fixed a bug with the /help message
1.4.2 - Added lava, fire, HungaryBall, Rainbowball, Hungary, MagyarLabda, Magyar, Romania, Europe RP and Cyan (nickname) to colorful chat
        Changed crimson, orange, lime, indigo and Trion for colorful chat
1.5 - Added an icon to the script
      Added /yell
      Removed the ability for players to execute their own html
      Fixed the "unknown command" message when using /help for commands added by the script
      Fixed /group ids showing a stray comma when the group it's being used on has only one player
      Changed /help messages to be more similar to the vanilla ones
      Added Coali, EU, Slyntex, Syntaxis, Gabriel, CLN, CoalCRCition and Unbidden to colorful chat
      Changed Rainbow for colorful chat
      Fixed NothingHere7759 not being colored properly
1.5.1 - Cleaned up some of the code
        Added /mute and /unmute
        Added SAR, Shadow Taile, West Vlandia, East Vlandia, Sangsa, Kwapt, Siremia, Magyarország, România, Mothership, MothMethMyth, Mothylamine and СинтексПр to colorful chat
        Changed CoalCRCition, Hungary, Hungaryball, Magyarlabda and Magyar for colorful chat
        Made some names get colored when used as nickname too
        Removed the /gq alias of /qg
1.5.2 - Added colorful chat for discord messages
        Added taumotons, Sisyphus Prime, Minos Prime, Russia, Germany, Potassium_l, Enderment, Xahh, LLG, NoNameZ, 16777216, NekoNoka, Toaster, C3phei, Taha Südenland, Martan, ReloopGD, Blake, Capa, Leg, Vvictor, Lapis, Stevesta, JPDLD, Amogusland, Doitshlænd, Lemon, Lemonwires, Tess, Helper, Cygnus, Shay, Neomoth, Eldit, Jigg, C-Yard, VGS, JJB, Norddex, 999, Nurutomo, Memelord, Randoof and Frick Verizon to colorful chat
        Added /nearby
        Changed Romaniaball for colorful chat
        Fixed some names not being colored if next to punctuation marks
        Fixed Rainbow, Rainbowball and Gabriel having two (M)'s, St. being colored when part of a word, and the space between "Shadow" and "Taile" getting removed
1.6 - Added /show
      Changed /mute and /unmute to /block and /unblock, respectively
      Added Markdown support
      Added earth, air, void, admin, moderator, Limbo, Oblivion, Arcadia, Purgatory, Damnation, Paradise, Nirvana, Ragnarok, Olympus, Eden, Utopia, Laniakea, Eka-Laniakea, Elysium, Camelot, Lemuria, Midas, Armageddon, Valhalla, Atlantis, Avalon, Heaven, Shangri-La, El Dorado, Solaris, Aether, Hyperion, Anteproxima, Proxima, Syberlong, Sudenland, 4est, Phorrhest Landt, Northia, Greenyland, Phyrexia, Purperism, RodimusPrime, Duck12, Boötes Imperium, Raliovi, Regenbogen and Ofo Gang to colorful chat
      Unnamed players now have their id colored in the chat
      Changed Norisia and Diermania for colorful chat
      Fixed Слюнтекс not being colored
      Fixed the JP discord emoji not working properly
      Fixed words inside of some links getting colored, therefore breaking them
1.7 - Added group chat gui
      Removed /qg and /qgset, as they were rendered useless
      Removed the /groups alias of /group
      Added /left
      Added an update notice
      Made chat messages show the ids of mods and admins
      Unnamed mods and admins now have their id colored in chat messages too
      Added markdown disabling
      Added France, Coca Pola, Eric, Norst, Unaligned, Expunged, Empire Français, Filana, Pinkistan, Liliac Republic, Tizenami, Union of Unknown, Breztec, River l'Ant, Riverduck, Thisisks, Solania, Soutia and Stable Land to colorful chat
      Changed Diermania, Minos Prime and Sisyphus Prime for colorful chat
      Fixed Greenyland not being colored
      Fixed Shangri-La not being displayed
      Fixed strings like **a** **a** being parsed as <b>a** </b>a**
1.7.1 - Removed /color
        Fixed the player id not refreshing after reconnecting
        Fixed /qset not working after reconnecting
        Made colorful chat compatible with several gateways
        Added Prussia, Poland, Synthesia, Avia, Nortian Republic, Darkstalker, Cyntex, Ņüŧüŗíßflőd, InfraRaven, Dimden, Kit, DayDun, Cytia, LMNtal X and Ikd1 to colorful chat
        Changed black, void, Thisisks, Norist, Boötes Imperium and Stabilia for colorful chat
        Fixed images in chat not scaling
        Fixed messages coming from discord not having the right color
*/

'use strict';

(() => {
    //Pre-installation
    const waitUntil = (probe, cb, t = 200) => {
        const id = setInterval(() => { try { if (probe()) { clearInterval(id); cb(); } } catch { } }, t);
    };
    waitUntil(
        () => window.OWOP &&
            OWOP.misc?.chatRecvModifier &&
            OWOP.misc.world?.players &&
            OWOP.misc.chatSendModifier &&
            document.getElementById('chat'),
        install
    );

    function install() {

        //Utilities
        const say = OWOP.chat.send;
        function tell(id, msg) { say('/tell ' + id + ' ' + msg) };
        const locSend = OWOP.chat.local;
        function locErr(msg) {
            OWOP.chat.receiveMessage(`{
            	"sender":"server",
            	"type":"error",
            	"data":{
        		    "message":"${msg}"
        	    }
            }`);
        }
        let playerList = OWOP.misc.world.players;
        let playerID = OWOP.player.id;
        OWOP.on(OWOP.events.net.world.join, () => {
            playerList = OWOP.misc.world.players;
            playerID = OWOP.player.id;
        });
        function mdParse(str) {
            return str
                .replace(/(?<!\\)\*\*([^*\\]|[^*].*?[^\\])\*\*/g, match => `<b>${match.slice(2).slice(0, -2)}</b>`)             // ** --> Bold
                .replace(/(?<!\\)\*.*?[^\\]\*/g, match => `<i>${match.slice(1).slice(0, -1)}</i>`)                              // * ---> Italic
                .replace(/(?<!\\)__([^_\\]|[^_].*?[^\\])__/g, match => `<u>${match.slice(2).slice(0, -2)}</u>`)                 // __ --> Underline
                .replace(/(?<!\\)_.*?[^\\]_/g, match => `<i>${match.slice(1).slice(0, -1)}</i>`)                                // _ ---> Italic
                .replace(/(?<!\\)~~([^~\\]|[^~].*?[^\\])~~/g, match => `<s>${match.slice(2).slice(0, -2)}</s>`)                 // ~~ --> Strikethrough
                .replace(/(?<!\\)~.*?[^\\]~/g, match => `<sub>${match.slice(1).slice(0, -1)}</sub>`)                            // ~ ---> Subscript
                .replace(/(?<!\\)\^.*?[^\\]\^/g, match => `<sup>${match.slice(1).slice(0, -1)}</sup>`)                          // ^ ---> Superscript
                .replace(/(?<!\\)`.*?[^\\]`/g, match => `<code>${match.slice(1).slice(0, -1)}</code>`)                          // ` ---> Code
                .replace(/(?<!\\)==([^=\\]|[^=].*?[^\\])==/g, match => `<mark>${match.slice(2).slice(0, -2)}</mark>`)           // == --> Highlight
                .replace(/^##\s.+$/gm, match => `<span style="font-size:24px;">${match.slice(3).replace(/#+\s*$/, '')}</span>`) // ## --> Heading 2
                .replace(/^#\s.+$/gm, match => `<span style="font-size:32px;">${match.slice(2).replace(/#+\s*$/, '')}</span>`)  // # ---> Heading 1
                .replace(/^-#\s.+$/gm, match => `<span style="font-size:12px;">${match.slice(3)}</span>`)                       // -# --> Subtext
                .replace(/(?<!\\)\{[\dA-F]{6}\s/gi, match => `<span style='color:#${match.slice(1, -1)}'>`)                     // {c --> Color
                .replace(/(?<!\\)\{RB\s/gi, `<span class="rainbow">`)                                                           // {rb -> Rainbow
                .replace(/(?<!\\)\}/g, '</span>')                                                                               // Close the color spans
                .replace(/^\[ \]/gm, '<input type="checkbox">')                                                                 // [ ] -> Unchecked item
                .replace(/^\[X\]/gim, '<input type="checkbox" checked>')                                                        // [X] -> Checked item

                .replace(/(?<!\\)\\/g, '') // Remove lone backslashes
                .replace(/\\\\/g, '\\') // Halve each backslash pair
        }
        let helpBtn = document.getElementById('help-button');
        let chat = document.getElementById('chat');
        // nhStyle
        if (!document.getElementById('nhStyle-v1-0')) {
            let nhStyle = document.createElement('style');
            nhStyle.id = 'nhStyle-v1-0';
            nhStyle.innerHTML = `.nhCont-v1-0 {
                & input {
			        background-color: rgba(0, 0, 0, 0.3);
			        color: white;
		        }
		        & input::placeholder {
		        	color: #BFBFBF;
		        }
                & > div > input,
                & > div > select {
                    flex-grow: 1;
                    flex-basis: 171px;
                }
                & select {
                    background-color: #ABA389;
                    border: 6px #ABA389 solid;
                    border-image: url(/img/small_border..png) 6 repeat;
                    border-image-outset: 1px;
                }
                & > div {
                    display: flex;
                    align-items: center;
                }
                & > div > label {
                    text-wrap: nowrap;
                }
            }`;
            document.head.appendChild(nhStyle);
        };
        (() => {
            let style = document.createElement("style");
            style.innerHTML = `.chatImg {
                height: 1em;
                vertical-align: middle;
            }`;
            document.head.appendChild(style);
        })();

        //Variables
        let quickID;
        let responseID;
        let nearbyThresh = 500;

        // Chat on the left
        if (chat.style.position != 'absolute') {
            chat.style.position = 'absolute';
        };
        if (localStorage.chatOnLeft == 'true') {
            helpBtn.style.left = 'initial';
            helpBtn.style.right = '55px';
            chat.style.right = 'initial';
            chat.style.left = '0';
        };

        //Help command
        function helpHandle(args) {
            if (args.length != 1) {
                locSend("Chat Utils commands: block, clear, group, left, local, lset, nearby, q, qset, respond, show, unblock, yell")
                return;
            };
            switch (args[0]) {
                case "group":
                case "g":
                    locSend("group - Opens the group chat menu.\nUsage: /group\nAliases: g");
                    break;
                case "qset":
                case "qid":
                    locSend("qset - Set an id to quickly message with /q.\nUsage: /qset &lt;id&gt;\nAliases: qid")
                    break;
                case "q":
                    locSend("q - Message the id set with /qset.\nUsage: /q &lt;message&gt;\nAliases: [None]")
                    break;
                case "respond":
                case "r":
                    locSend("respond - Respond to the latest /tell message from another player.\nUsage: /respond &lt;message&gt;\nAliases: r")
                    break;
                case "local":
                case "l":
                    locSend("local - Message people within the distance set with /lset (default: 500 pixels).\nUsage: /local &lt;message&gt;\nAliases: l")
                    break;
                case "lset":
                    locSend("lset - Set the distance within which people receive messages sent with /local (default: 500 pixels).\nUsage: /lset &lt;distance&gt;\nAliases: [None]")
                    break;
                case "c":
                case "clear":
                    locSend("clear - Clears the chat.\nUsage: /clear\nAliases: c");
                    break;
                case "yell":
                    locSend("yell - Tell another user a message privately or send it globally in all caps.\nUsage: /yell &lt;id*&gt; &lt;message&gt; (* = optional)\nAliases: [None]");
                    break;
                case "block":
                    locSend("block - Blocks a user.\nUsage: /block &lt;id&gt;\nAliases: [None]");
                    break;
                case "unblock":
                    locSend("unblock - Unblocks a user.\nUsage: /unblock &lt;id&gt;\nAliases: [None]");
                    break;
                case "nearby":
                    locSend("nearby - Lists the players within the distance set with /lset or the specified one.\nUsage: /nearby &lt;distance*&gt; (* = optional)\nAliases: [None]");
                    break;
                case "show":
                    locSend("show - Shows or hides the chat.\nUsage: /show\nAliases: [None]");
                    break;
                case "left":
                    locSend("left - Toggles the position of the chat between left and right.\nUsage: /left &lt;true/false&gt;\nAliases: [None]");
            };
            return '';
        };

        //Message processing
        const prevR = OWOP.misc.chatRecvModifier || (m => m);
        OWOP.misc.chatRecvModifier = (msg) => {
            msg = prevR(msg);
            const msgParsed = JSON.parse(msg);
            //Response
            if (msgParsed.type == "whisperSent") {
                responseID = msgParsed.data.targetID;
            };
            if (msgParsed.type == "whisperReceived") {
                responseID = msgParsed.data.senderID;
            };
            //Fix "Unknown command:" messages from /help
            if (msgParsed.type == "error" && msgParsed.data.message.startsWith("Unknown command: ")) {
                if (!['group', 'g', 'qset', 'qid', 'q', 'respond', 'r', 'local', 'l', 'lset', 'c', 'clear', 'yell', 'block', 'unblock', 'nearby', 'show', 'left'].every(cmd => cmd != msgParsed.data.message.slice(17, -1))) {
                    return '';
                };
            };
            // Muting system because either idk how to use the vanilla one or it just isn't working
            if (OWOP.muted.includes(msgParsed.data.senderID)) return;
            // Colorful Chat
            if (localStorage.colorChat !== undefined) delete localStorage.colorChat;

            /*** FIRST TECHNICAL AREA ***/

            let rank = msgParsed.data.rank
            // Add ids to mods and admins
            if (rank > 1 && rank < 4 && msgParsed.data.nick.slice(4) != msgParsed.data.senderID) {
                msgParsed.data.nick = msgParsed.data.nick.slice(0, 4) + `[${msgParsed.data.senderID}]` + msgParsed.data.nick.slice(3);
            };
            // Gateway compatibility
            if (msgParsed.sender == "server" && msgParsed.data.message.startsWith('[D] ')) {
                msgParsed.sender = 'player';
                msgParsed.type = 'message';
                [msgParsed.data.nick, ...msgParsed.data.message] = msgParsed.data.message.split(/: /);
                msgParsed.data.message = msgParsed.data.message.join(": ");
                msgParsed.data.rank = 1;
                rank = 4;
            };
            if (msgParsed.sender == "player" && msgParsed.data.nick.match(/^(\[\d+\]|\(M\)) \[D\]/)) {
                msgParsed.data.rank = 1;
                rank = 4;
            };
            if (msgParsed.sender == "player" && msgParsed.data.nick.match(/^(\(M\) )?\d+$/gi) && msgParsed.data.message.match(/^\[D\]/) && OWOP.misc.world.name == "countrysim") {
                [msgParsed.data.nick, ...msgParsed.data.message] = msgParsed.data.message.split(/: /);
                msgParsed.data.message = msgParsed.data.message.join(": ");
                msgParsed.data.rank = 1;
                rank = 4;
            };
            if (msgParsed.sender == "player" && msgParsed.data.nick.match(/\u00AD\n\u00AD/gi)) {
                [msgParsed.data.nick, ...msgParsed.data.message] = msgParsed.data.message.split(/: /);
                msgParsed.data.message = msgParsed.data.message.join(": ");
                if (msgParsed.data.nick.match(/^\[.+?\] \(M\)/)) {
                    msgParsed.data.rank = 2;
                    rank = 2;
                } else if (msgParsed.data.nick.match(/^\[.+?\] \(A\)/) || msgParsed.data.nick.match(/^InfraRaven/i)) {
                    msgParsed.data.rank = 3;
                    rank = 3;
                } else if (msgParsed.data.nick.match(/^\[D\]/)) {
                    msgParsed.data.rank = 1;
                    rank = 4;
                } else {
                    msgParsed.data.rank = 1;
                    rank = 1;
                };
            };
            if (msgParsed.sender == "server" || msgParsed.type == "whisperReceived") return msg;
            //console.log("Message before: " + msg); // Debug
            msgParsed.data.allowHTML = true;
            function sName(rx, replace) {
                msgParsed.data.message = msgParsed.data.message.replace(rx, replace);
            };
            // Prevent people from executing their own code but leave dc emojis alone
            if (rank < 3) {
                //msgParsed.data.message = OWOP.util.escapeHTML(msgParsed.data.message);
                sName(/<(?!a?:(.+?):(\d{8,32}))/g, `&lt;`);
                sName(/(?<!a?:(.+?):(\d{8,32}))>/g, `&gt;`);
            };

            if (!msgParsed.data.message.match(/^\$/) && !anchorme(msgParsed.data.message).includes("<a")) { // Color override

                /*** OTHER WORDS ***/

                // Colors
                sName(/#\b(\d|[a-f]){6}\b/gi, match => `<span style='color:${match}'>${match}</span>`);
                sName(/\bRED\b/gi, match => `<span style='color:#E53B44'>${match}</span>`);
                sName(/\bCRIMSON\b/gi, match => `<span style='color:#9E2835'>${match}</span>`);
                sName(/\bORANGE\b/gi, match => `<span style='color:#FB922B'>${match}</span>`);
                sName(/\bGOLD\b/gi, match => `<span style='color:#FFB735'>${match}</span>`);
                sName(/\bYELLOW\b/gi, match => `<span style='color:#FFE762'>${match}</span>`);
                sName(/\bGREEN\b/gi, match => `<span style='color:#63C64D'>${match}</span>`);
                sName(/\bLIME\b/gi, match => `<span style='color:#B1D657'>${match}</span>`);
                sName(/\bBLUE\b/gi, match => `<span style='color:#3AB2FF'>${match}</span>`);
                sName(/\bINDIGO\b/gi, match => `<span style='color:#0484D1'>${match}</span>`);
                sName(/\bCYAN\b/gi, match => `<span style='color:#2CE8F4'>${match}</span>`);
                sName(/\b(MAGENTA|PINK|FUCHSIA)\b/gi, match => `<span style='color:#FF41E4'>${match}</span>`);
                sName(/\b(VIOLET|PURPLE|MAUVE)\b/gi, match => `<span style='color:#AB80F9'>${match}</span>`);
                sName(/\bBROWN\b/gi, match => `<span style='color:#B86F50'>${match}</span>`);
                sName(/\bGR(A|E)Y\b/gi, match => `<span style='color:#AFBFD2'>${match}</span>`);
                sName(/\bWHITE\b/gi, match => `<span style='color:#FFFFFF'>${match}</span>`);
                sName(/\bBLACK\b/gi, match => `<span style='color:#000000; text-shadow:-1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>${match}</span>`);
                sName(/\bRGB\b/gi, match => { match = match.split(""); return `<span style='color:#FF0000'>${match[0]}</span><span style='color:#00FF00'>${match[1]}</span><span style='color:#0000FF'>${match[2]}</span>` });
                // Other words
                sName(/\bTREE\b/gi, match => `<span style='color:#B86F50'>${match}</span>`);
                sName(/\bGRASS\b/gi, match => `<span style='color:#63C64D'>${match}</span>`);
                sName(/\bWATER\b/gi, match => `<span style='color:#3AB2FF'>${match}</span>`);
                sName(/\bLAVA\b/gi, match => `<span style='color:#FB922B'>${match}</span>`);
                sName(/\bFIRE\b/gi, match => `<span style='color:#E53B44'>${match}</span>`);
                sName(/\bEARTH\b/gi, match => `<span style='color:#B86F50'>${match}</span>`);
                sName(/\bAIR\b/gi, match => `<span style='color:#AFBFD2'>${match}</span>`);
                // Countries
                sName(/\bROM(A|Â)NIA\b/gi, match => `<span style='color:#003CB3'>${match[0] + match[1]}</span><span style='color:#FCD116'>${match[2] + match[3] + match[4]}</span><span style='color:#CE1126'>${match[5] + match[6]}</span>`);
                sName(/\bHUNGARY\b/gi, match => `<span style='color:#CE2939'>${match[0] + match[1]}</span><span style='color:#FFFFFF'>${match[2] + match[3] + match[4]}</span><span style='color:#477050'>${match[5] + match[6]}</span>`);
                sName(/\bMAGYAR\b/gi, match => `<span style='color:#CE2939'>${match[0] + match[1]}</span><span style='color:#FFFFFF'>${match[2] + match[3]}</span><span style='color:#477050'>${match[4] + match[5]}</span>`);
                sName(/\bMAGYARORSZ(Á|A)G\b/gi, match => `<span style='color:#CE2939'>${match.slice(0, 4)}</span><span style='color:#FFFFFF'>${match.slice(4, 8)}</span><span style='color:#477050'>${match.slice(8)}</span>`);
                sName(/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)(RUSSIA|РОССИЯ|POCCNR)(?=\s|$|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)/gi, match => `<span style='color:#FFFFFF'>${match.slice(0, 2)}</span><span style='color:#0032A0'>${match.slice(2, 4)}</span><span style='color:#DA291C'>${match.slice(-2)}</span>`);
                sName(/\bGERMANY\b/gi, match => `<span style='color:#595959'>${match.slice(0, 2)}</span><span style='color:#FF0000'>${match.slice(2, 5)}</span><span style='color:#FFCC00'>${match.slice(-2)}</span>`);
                sName(/\bDEUTSCHLAND\b/gi, match => `<span style='color:#595959'>${match.slice(0, 4)}</span><span style='color:#FF0000'>${match.slice(4, 7)}</span><span style='color:#FFCC00'>${match.slice(-4)}</span>`);
                sName(/\bFR(A|\*)NCE\b/gi, match => `<span style='color:#0000B3'>${match.slice(0, 2)}</span><span style='color:#FFFFFF'>${match.slice(2, 4)}</span><span style='color:#E1000F'>${match.slice(-2)}</span>`);
                sName(/\b(PRUSSIA|PREU(ẞ|ß)EN)\b/gi, match => `<span style='color:#000000; text-shadow:-1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>${match[0]}<span style="color: #ffffff; text-shadow: none">${match.slice(1, 3)}{ffd500 ${match[3]}}${match.slice(4, 6)}</span>${match[6]}</span>`);
                sName(/\bPOL(SKA|AND)\b/gi, match => `<span style="color:#FFFFFF">${match.slice(0, 3)}</span><span style="color:#DD0C39">${match.slice(3)}</span>`);
                // Border names
                sName(/\bLIMBO\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURQo5VBVwqArQlSzy7vDaOZYAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAASZJREFUOMttkgGSBREMRFtcQLgAcQHk/nfbZv7Wbo2vahjzppPoAN4jVHQ+rTui1wvDn0U+yL0MlDjVu07X5W8OnenvQyiqfUDjyl6OQN+cIc342hcnMz8ZWpzNi3sHM7w4l6kVMiInLdzucuKAl1kouHnARIalYGgoSP8FRdfNkTJK7bktmWiBGbz5dkl8HJfeHFKgo7e8omJ+sfHiQmeGp+CRjjwCxlEF0kfw4hIbP9DhqHk8guqr5e7yCF48CKZ1Hn8uK6gJCsEIuaWIys3FwbOZaRU14yl3fP4aWk6U7RwXnzTNWgqZDWqMlIS9Zr2cVg03Z19StJ7CshF2ZwQtYZl1hMyiLg7m5/3Yg7aMXZL0c+N8VfnGT8JjZj63Zpv6O9LNfwDPsDQ6wZvBIgAAAABJRU5ErkJggg==" class="chatImg">`);
                sName(/\bOBLIVION\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURQAAAKysrICAgJ4oNeU7RDSL0DwAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAARtJREFUOMuV0lGShiAIAGBGT6BeAOkCGtwA73+mBaym3X3Y/akMiU9rJoBPo+yo5R31HvpV6Hde4fW0MU9mblzIkkmN/fC08HmhC/QY2lpTljbtJFOY2NKozS4Oei2doNQAVAs19b4APEVJ1HbwmoNaDfQNrN1Af4Pa2QCXdHjtDJA6BaAA+A0gz6Ys82ADp+gDCA2guYJ0gaWHEsjZFq95aIB1yiAyQAmhOkgdbRLbsy2aDBy21w1EDWBKSAmA0HsJkGCvphugAcob8JKBDtIG1m4gbcAvkLJmrw1ZBiBBAPgLDBn5BrBBshEekJWtB+3lHgB2QrQDIPhGkee1/Bvs5j282MGeBPgVmXnYvxS3YTO/rgmPf//NP+MLZABWizJ0KUoAAAAASUVORK5CYII=" class="chatImg">`);
                sName(/\bARCADIA\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAwUExURQAAAP8AAP9VAP+SAP/AAP/+AKT/AFVVVQD/SgD/zQC+/wCA/yEA/6wA/9oA//8A0CK0ZI4AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAJVJREFUOMuVksENwjAQBPcDFyf50AIt0AIt0ALv/NwCLdBCWqCFtEALtAAXbO8Ffjv26UbW6ixLBlQOIjiK4CSCswguxB+0+yuebVJXYjnvf2uiRwo3YrCuFLrmsOKRwp34pORTk6Xqq63bPVKYiU/qS6Fv7jd8e6TwIDbUlXPtEz1SWAjGusC+NN+kniJ4ieAtIv/uD0cKCqWhgX+MAAAAAElFTkSuQmCC" class="chatImg">`);
                sName(/\bPURGATORY\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURQAAAOLi4rm5uZCQkEjWg78AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAKVJREFUOMu9UEEOAyEIBP0A/mDDfqCR//+tMGDWJu3BSwcMyu44I0SnGIf4A0GBi6gh6MfyyD9LQcZgIOq3hU9QSIlLuCHoWcT0nD1SgCQJYyQhqluIatwn9+yRSBJ4EYRKQZqL41ZFZu/FNIuwLNnc7cTNINT55l5vXlNyIdgpC/AcWT2tJzhjjTXI22hjjJHb/oNwm6qZTURVjdz2RbBDnBNO8QYr6TfVIF/BsgAAAABJRU5ErkJggg==" class="chatImg">`);
                sName(/\bDAMNATION\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURfuSK+U7RP/nYvW7CgAAAJ4oNT8oMigaILh8MN4AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAANNJREFUOMu1j8kVwjAMRAUVQHgUQKgARAPEyx3zoACW0AG0j2ZkliM58GMrGmmkvIj8nclAZATGbbsY8S4QTLtq7e0ZSkSmoFHV17WwarSrqquZleicyhx4K7KJsKcKqhsfYCnRKjtQYK7NGkylmcbms2hLqxxAgXm9tEYIdcBUKjjvRYlWuYITzVie0A3+mVxw6iIboFWOoNCM5XBodpVOOMEX2Tyt0oOz/V5QPPnMsKm5ZZk9JLT6QB9jxM0x9x6oemYX9JB8D/yO3Acit4HIYyBPxTW3XqdtH+cAAAAASUVORK5CYII=" class="chatImg">`);
                sName(/\bPARADISE\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAQBAMAAABzZ+XyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAACzo9P/nYvuSK////6+/0gSE0XqUtCCWJngAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAR1JREFUKM+NkjtuwzAMhn+93NUGcgDCvoAQXUAD3dkFombVUHjOEMDXLyknbdPJhB+fpU8kZRs4GsPBULEHjBD+gR4wgjq4i+NIejGvYNtNzvFHJCRjycUX8NbbCAj+ZqTBGVkf8xN6OjkVTZvce2zMVuYzZa0nIsmIii5Cy5m2D1mQCVOwACkYhYe4pGT6KaloEQfOU4qzTWdSGBR2MTBauyo6mBNLIs+SKC5tMwI9XVScP7Td1mKPTxaRmW1YRNREXY2VimzFl7VSpVXiq+D6R8yP1rTeJBkBG/fXwzPKxjmK6FSMIirUlOLFBZdSJ5g6mUcpW4ZCWHADwytkIBS83YC1yif0u3jdWGMugnd+xly27c7v2l97PPyXfQOBOkQnJXD4WQAAAABJRU5ErkJggg==" class="chatImg">`);
                sName(/\bNIRVANA\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAAN2D8/OL/P/nYkAAgP///6hR/4AA/4F+am4AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAUJJREFUOMuVkjmWgzAMhrmCDI/UyDy7Hps3fYhyA3KAuJBrKPD1R5gMeJYmcuH196etqt41gG746ABA4Wnee1dsEU6rQNV0U7KqtT+NbsXG6x+CbriSIGrl9lv5UA/TlOf9xLkaGiK6ZoEAmiYjSo+EUPgkHtNDRhZsgIwAgxgYDQefY9COw3aAHDpo7hPdpw1RCeBKGWGCCRE5sSPyA42fiQ1zMIlF8BDBQwSqEkDTZETLJqzIMvrRO0LrmHkNFplPQVcQWvlOnnNER7ofnSzXaIJM6VkQzhjamAWJtetvhN5E3rzkyDAfgiJLzzasQbxGluhpRC1vRSBOMZRBf9cBVp4v4kPENSL2kkzL0Sw2XjhCmdaj0pcEkOyyoF2kZFv602KxmyHNcnsW7uil3V4dpf820dEaglC/T9V/T1+Cd+0LG618W9f1xygAAAAASUVORK5CYII=" class="chatImg">`);
                sName(/\bRAGNAROK\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAAP8AAP9VALAAAP+DAP+5AP/2AP/8tvJ2gkQAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAUxJREFUOMuVkl2uhCAMhZuwAt0BjAtAq8474gqU2YCxLOAmsv17qhkzyb0v0x8oh6+kJhJ9a5VaXf01+48Gjqy1Ve1Qwt+hmoYCWmM/F93JWVc5Z5m7irl9MPOjdY5bh5O9lI5b7uq6thYwOdCueRCZO41zvvtQOt/73rnmDAohuDU+DJt3LtQ3vptuRXE0hBhC4wLFGJtmnsyEq8ksyIlM9L0qlwMf/ABuDXOMtK5rnJO+d6W20OD75VaAQ4nrfAbNKc1zWoh4wsRAeDEeEBSj6qINZFJaz0iU0o5YCLPr/AYYQD9s59eo4kc8ML4UfKWdkkja981suNJVEfE0Xuflahi1AaDsO4nILnI3YJDNyKYNm/m5lNE//SgXKCQ5Y9v47YyUws8PZYQ/RbIcCJKjHEc+ci5S8lFyOeujQNVD0TprjUKQVL60r//uX/VJkTvjyKq5AAAAAElFTkSuQmCC" class="chatImg">`);
                sName(/\bOLYMPUS\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURQAAAGPGTeSmcv///2yr0bhvUD8oMnQ/OWdRQb54c88AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAR5JREFUOMuV0kFOwzAQBdBcwRB5X4PcdRiJvdtRbsABQqPB6xzC8rH54wk0EWHRqapft/PkuJ6ue7TcU0C9OMtXTod5cvRm2Tn3gSJn+UxDS+a0S+eINAcFFAKhz4nIJDfyEsWLVhQhhP6gQPsMnJcGcq1TBiix+IoqsdZbFl2UBtDXwFVBApD8C4rgFUs2gB16vgPGB2aALwM1A7wX/wOwdVGAvmv6A2Yacv1cgT2Si6KA0YcuA7wByZfFl7HtIKTgvOTpf8BbQEegN5D00HMW2QJmPbRIPQa1zjgf70G1v5XvgDmEBnA/M97sJXgZRS+QeZRJb7EB9DVgI8DrKHBb4wlSWycbGbd+D9BfbMh4HTa+7DLZUJ7WNYbv0foGpWOxkn/yUekAAAAASUVORK5CYII=" class="chatImg">`);
                sName(/\bEDEN\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAAJza///////wm//nYjJzRT2OVWPGTR4+ICMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAARNJREFUOMuVkrFuxCAMhqFNwkoiZU95AqT4ASodD5AbyJzlyMp0fv3aECLS3tD7h9g/+LONFCHeVU8yxqTvV19rOG19k4CBAJ15maOsfW8mOvgDzEkyR1t7aab5CvBIDUdHcCyp7entMMEVYGn4MDlSWcOAOby7EfUKSB3bBaQx+jLB2ddA2rnb+I6B8gZo3E3UgPccxyXvriLdeQbKW0DQCJD+TkVUKsYQOF23vBIDPiyuPVaiFRWNcG143Mc1+F6siJzuETp87oiRwU/XLTYERHxuoCJNosvHumPwgmpSGs8JtDk4tdniFTa0KqZ2GAQiHp3TI6mAV//GOBevMCYgS5QkiqNjDpWnWj74DfxXb//dP1QmeY3eT1cEAAAAAElFTkSuQmCC" class="chatImg">`);
                sName(/\bUTOPIA\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAAAAoU7m5uX5+fv/nYoiivgAADt7JfLMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAQZJREFUOMuVktFxwyAQRGkBUYFBDYgTDQg6uNF/+q8iuwdCjseeJDc+n9FoebsY5/5b/k0tEfXwbwuC5fodxMsmYi0VM2B69ieBxrKV82RrRYfeZzZah7rlhgc9yiZFchHRpKJBVIJK2R90uTa+6mJbbTkIGZ9WcjIBnngKQFjaAQEkFCBhO2CNhLxSs1ezZAJY2uMoSJzNw5ZpEihQyZPAN0mIJHQpli1NglnCNtiCu3SCWWpmiQQT/MiAZ1X7LkYwS3cGs/ScYRKOmxCfMhhBBgHHWkFIONaOHRnaSwb+R0bACTFDsnlluE5pZGDhFuArN16NJCTYlJkhzgx/r5e7+/Xr7f4G6ZJzfWnCnfcAAAAASUVORK5CYII=" class="chatImg">`);
                sName(/\bEKA(-|\s)LANIAKEA\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAAA8THCcXPlEdcP///5csnthWuP+Xv5gokeAAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAPFJREFUOMuVksEKwjAMhvcKWdt5Hj6Bog9QFvFclN0HE8+C7PnNn5bNjF2WHhqSfv2bpFW112inCVCbwMnm3QYgMWb25D1zpBQJeySKsi0J8ZQWIEiOCHE4gwA4DF9W43OCEA4ZaAoQJd71U/cP3N7jRRMUW4+TAA4ZYH2KKuAFer++lXEDvOv7daLq2H+nB3NRyDXILhKKBI8E8LRSuOQaUK4CPmu4uYZhVcOzFE0FcFmBZuDjbZfGFRAMUF/v9/G8zCG6/vuwQLOhsExaWjArYFQCHHRwBYA3zEC2ZD6A9q41oUQWWP0h9M5aObD7d/8AJ7dTcuHcbqEAAAAASUVORK5CYII=" class="chatImg">`);
                sName(/\bLANIAKEA\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURQAAAAAADv/th////yFmTPkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAONJREFUOMuVkoERwyAIRbFZAJigOgF37L9b4aNeml6vKYmJRJ4/IERna/Tb5E9bAMck+XhzPGIjjFai+aFFlG6gs4kc7sbW2Dgn7t6OvJbTRUafgA4ARLGUABmxUQRjEJzH+FQAEKuCG8EWGlJOXzlgEiG9xA3RWr/klNuUs5LWUYAOKJhTAuO5FXw6tfWbQv6+RQAUTHYO5dTWu6yZAwCmmYMcVSXkIKWgE+gnQPgrkHWlqmrWoRWgq6wLQFkncFLAMSUQGeLgNrCca2tkG2RXaLUGz8aYrSF0Ae43Xxnf6OuyF+/mL3AHNsf6AAAAAElFTkSuQmCC" class="chatImg">`);
                sName(/\bELYSIUM\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURQAAAP///+VwRPvUOR6QVZDx+K7+XZpKS//l76hNuvgAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAS1JREFUOMuVkjFuwzAMRX0FGeYJeAJLtds1hXIAGiayCyjjC7TonCHn7qfkBCnQoaEAi/zk49fgrns2wpPxG+DU7sM/gX7sx8B/AA91J4FwAtEQhIlCH0cZskshCOrB00OdCYIDYICM1iDCSsT9JGsmkmUUlORdrwkUAOlEIJGo5oMyT+pAzkcSFgc0H1XugDgAibQB7xMrLxNnPjIkiA3wBTpkrAWgLiHWnJvDEhFO6k12QB1Q7Oiq1DorIwMwcVpiMwP94j0MVOoBgFEDfGxm4/Y6BHqfN0D1/iQ9YRhZHU9zSanMXCph9mW7TQVOamZXO5uVyR24xDcYlAQgxlcuM/pbs3EAk1dzyezMCbsxDXa2K8d0ifCqbbNv2z4AbLXYtf16TLf7pyVP/90/dyiXyQCDav0AAAAASUVORK5CYII=" class="chatImg">`);
                sName(/\bCAMELOT\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAhUExURQAAAFKk3P///5zExIt/c1VNS2B+iR6QVZpKSzNjr0LMOc8JdYAAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAPVJREFUOMu9kbFKxTAUhiuBi6NHAtc1wQcIFO5e+DO4p3tBuLtTwcn7Di46u9in9D9NkyCo0MVvaJLT/zs5pV23F9lJFW5dXtZidyVy83OzWvTeqeQdH8aoEAJPIq509N8ET1izwD0GY3TYECw8tpwGXBG86ioAKY4ADo+mP02nidsIDLl/E7jPDSxijGNMMP1hMqEPjKc0pnJDHUnV4yxiR8Yje5qzuX4J5yxEiMxP7aM1yYIuHIhp6A0q6A2MV2FNVkEuYqHzk4fyj17zeZA7aQKTooWLYGP5fNt4X8hHEdZkEY4zWX6D75owN57/ECr/IOzlC/PRsYQzn6TUAAAAAElFTkSuQmCC" class="chatImg">`);
                sName(/\bLEMURIA\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURQAAAASE0WPGTXQ/ObhvULu6x28AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAOJJREFUOMuVktEVwyAIRbOCcQJhAsENZP+ZCi8aTXP6Uc4LJS23gHIc/1padlJY2eJld9IAVGs4VfEIEkiFWJUIv+9AsxrOTDyCBLJOjMf6Dpwpx3vu2oS7f5KLQ2pCzeVB9TYnQDQAYmH/45EdajIVQLkADzwXFSQ6sAXMCgASrRkcoJR9BE+yfgMxA7JVW30MzQBQoTd9V/DjeABnADQc83uG7woB+LzTQXkHampSni3hROGu7rUtoLyBcWc27gtdh1PrDOV5c/dqXJswNgILcVJ8oQxl1QeA2/tt24b+vd0f8NhkG/eRgwIAAAAASUVORK5CYII=" class="chatImg">`);
                sName(/\bMIDAS\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAAN21M8ShLeVwRP/qaPvUOdewFYg7kxkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAPlJREFUOMudku1xwyAMhr0CvS5QsAcIWBnAhwaIkTxAarL/CBWf4V+TiBMnuPdBCDRN75r60tV+1CvxB4DuppRLZqtrbZzVEqhRU4B5LwCwmIXqGjgkV6OmAIQVcDLSZGUKhp2QLUPVZGD2dC+AhRXWO8jhFxNM8LJhtRo1GVgi7Q0AWPcOONkIJUPTZACPiE8AsAFSULqaGjUJWBD9YyuAlLA+hgzXzWSgaxIwU2SuwExD0SHKwmWgaxLAkZjPArBo2rOGQGmRga4RYInoD/Rb+jiI6K7145Zf5yVZftanRlrjZKbDM6UW+D+e1Pfp8STGeFOvxG939x+0GoGFY5R8XgAAAABJRU5ErkJggg==" class="chatImg">`);
                sName(/\bARMAGEDDON\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAnUExURQAAADNjr1Kk3JyKkOVwRKw5QIovQ2glRpDx+B6QVULMOXeDPa7+XXzHMaAAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAWtJREFUOMuV0rFugzAUBVD/AmyRumBkqcqIwUtHLNhBJlIymnhhJcreqc2WtWOlSKmbrYIhTF2rfFQfThyI1A65o/2ujvADoXvjQFzHxRj72KeUhjTk18Q0hqMAB3DtOV4/awow3zfySFBGGQ9LnvJ0XSvJlaQ0oxnOsIfNvDMSCCE0Z6UKk4TXdcp5mcQyoVEUiCAbBO8qEBL5EZOKswSAvhCXkso8yMUguOh1OxaiswDTfYFLGcucZpCLMHlDm60VMiuUtmCFvnAWJnukP6yQG4GxsPxfmL6gzftYyKHwh0Cs8LhHG88KQhB4VhCUSnmdrkdCZAVXo2fvIhBsBMqSMEnTm1ca9uBOzbMagfjmG57aVhQzMZsJsRRV9WWEYQ/usOmd3jVd03ZtIQqxWvWFQlRt1zTdXM9vN/1w+tEaCjtTAEEAsV6p5UJVXbc4QkHrw+nbFE59YB7y2fVpxCgLc3Q01wczevff/Qs4hrpiREO30gAAAABJRU5ErkJggg==" class="chatImg">`);
                sName(/\bVALHALLA\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAAJpKS2glRmB+ieVwRJzExPvUOUoZLHGFz4QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAKpJREFUOMu9ksENwzAIRbMCbhfgRxkg8Q7tPZEn6f5S+Ti2bFc95BKwEF/mSYCYpqsmbioSROAJs0FZ1FwoJwC+AGXin70yjZuBFRog2QvQKgtlCAOe8ji2OcYIc5qLQZ3mwOv9OfYlpQRz2g60aknVjgFAB+AXWLuWNiuZaxO9qh2VobkFGytoHbpTeYvtWm8A/J8lgDYAlYU/AI+Q3358VQkpLUcol6/7C0kjUx54RfAVAAAAAElFTkSuQmCC" class="chatImg">`);
                sName(/\bATLANTIS\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAABi24izo9A5giJXnq////5Xz+QSE0UzQFeYAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAATFJREFUOMuVUsuOgzAM9C+YVHAmrLibqOy5VbR8Bw9xR6qU39+xk7LVXnY7AZNgz/gBRO+Cmf0/0SKWlcCVnWG7MBRnN/wO5wyKnCmtmqGDB6HBX9cn00KrLM8cKd74hKsGI3RexpWdleH4FZdI+/xzFCzvhR2LEx7FRHDlzQFT7zRvZwqnlCDiQMhHdgH764rdkUC43Gb62l8SsEA+KONECDwqoUmcuK43qhetKakHkSyWBzekndYipaTGZrMv1Pc6p3RYHOQKQakiViQXA9HY93RfKj5QoEm70ol2r+mMoKnwaNBDtWzUY86p+ZSTIKX7TLCXttMh+b4lzDpOKdlITc8yOCzTh1DQWsU+AoLJf8T4mKbDBZssPGhE45/qgXWhfsXdkz0fceI/EAve/ru/AW6VWHJ6+rA2AAAAAElFTkSuQmCC" class="chatImg">`);
                sName(/\bAVALON\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAhUExURQAAAP///9ff6Czo9JXz+fuSK//nYmPGTa+/0k9ngQSE0U+FMvcAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAATlJREFUOMuVkkFugzAQRbmCkXIAjLgAJicAqd2CNV6wn1l0XdU5QnoQuvAp+8eYlC4Zycr3n/88kyhVdbVMqaZ81sa0btIamnLfu3ugqbJT03wjqjsiQ7N1o+bHscfdNgYdPRowNQCQdR3mTri9C9uwtG4Y8gSHu+ttEFluwggYa/vK6jRNB+9c8Jo5gMGpdxcKeMe7sNjWuQpPWNsxu8Do+TuU5mPETjvAfYfnOF8U0AqsUfSyGsfpLcZPzNiB7Iv/B3hdxudn4E/Te3zoiBMQ+AT8ZbPCSo/nEyPOAMkZeG2T1TDFx/cT3+K8ksdSGUiowGmTdWMuSiTGLxFJYU20wUJjha/ZHVhTdrio9IO0fEAS8aY/q5rhBWhyTx+q1AYMtog2ip8BonxoPdQBEBUDp/hVuliX/92/5ujtgKiDYxEAAAAASUVORK5CYII=" class="chatImg">`);
                sName(/\bHEAVEN\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAAJXz+Szo9P28Rv/nYtff6PuSK////9bLqqAAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAV9JREFUOMuVkkGLwyAQhQcxerZh7yaQHxBCydVD6DnbILl6KJ4DRebv7xvbLr3tdtDkjc43zwSJPg3nTqe+x/grOozOOXKj6x71nnpS0gNKQXrySJSIJ3FyraPJjbAQwodeK70seMlUPvhlWZQmbNT6rmvdRG5yrtYPa4gG20R+oawAJB/goINPMVbCoZhc21aHYT8CA7Ac19CbJ4A6nSgxx+owjo5aPMRh5yOQFgeIq67AGkgN+iYAX/t4RfORMKsDgEteGp3Tk2zWhJVm16YCZeDyje4vhyHiSGSa6lBJeySsWNYUBOAd0JsD0iMUY/EN4gAhDqEwgFsqkYtAmzicz/H6FVnq9hcAYYIGwAKYtEt/OGwbgG3mUlP5S3IkEmGP28XCitDC4EhiUPb7fKZtemQAEupMzqkKRtmRc25MQ6k2lJhmur80H8Rk5WpUwQcGEksW+W/Mb/p/8fHt/gHL2Zifr8iNpQAAAABJRU5ErkJggg==" class="chatImg">`);
                sName(/\bSHANGRI(-|\s)LA\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAtUExURQAAAJXz+eU7RJ4oNf///6+/0sExPOSmcnQ/OUdHWdff6D8oMk9ngWPGTcmyolMFqZMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAVJJREFUOMuVkj1Ow0AQhX0FokDPjBKCUJpZ0VCvJQqamCxKEZogfIMoVUpQiigFR0DQRNBwBA6QIv1wBJ+BN5vYcQqQMpbmx37fvl3bSXJoHFXRINoNsa/fKKMOOKkEDUYf038AsZyWvaCPCUPT7wO+mokrwKGPCYNPfR1opv00+N6JneHP6PtelB/7JE1DjDus6pidiBUkx8KWYgeByVGSsI38MYOCmMQKMSMJWeccGTCZjMMOuMwf8pFABAeUVgaXTgb2/IVsEUg6nVYNuHVXThxBxlZa0AKA28WX2zrM5081ICyXy1c8xy5wwQHrno3NR0qH2WwP+PA375m9jwwXYUv4itM1cfubHQDVn6IoVNWAe1R9u/afGraD6hoLy1RJ2vFkBqwWK3uSbAQbYDgYloC9G1Wm55HYGcxhUdSBGGFQOig210Xu6jp+uJ3m4L/7F6ffvbi5cw9BAAAAAElFTkSuQmCC" class="chatImg">`);
                sName(/\bEL\s?DORADO\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAkUExURQAAAEqcSWPGTf/zsP28RnQ/OfuSK//nYsExPDJzRZ4oNT8oMjEAaJ4AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAVtJREFUOMuVkjFuwkAQRfcKa2GklN5ITm8k90QWgRIpadIBzjjmAF4OgCKntyy5jwgniDhe/h+DQ0p+8T0zO887AzbmVlkbTKDEOasKrJtc5KJIKwEMUcAeAO6e/TxSximQZQScZTlkc2J7yrzYQKCVCN9lx4g3E1iewtaOR1pLGAEy4dIW3vtVUdkQeYxY0oI2RGNGMSOrIynwVlRRiAHGXooqpc1o8WB60ANhgdsAJOHywcd+LQDy/8BKAKAFW5pMb6iWReXC53k985v0ApznQm/ZIiUQZGb0GPEG7mBfj6eD31zfkPbTlIK0RMtoauxUd0Amsj3tfq52ANoSbZl+0LoGO0zvegC2/faH4bepOEg7DHdgrWs60y06/g8lLccOjFnJZ1K20kouwtr7UQ8IQPt6/8lnXR9rDTK802eMmgzqH51KgbnfLRTYf/XAn5qnM3mR6W7UzV/3Lxx0+QYhcAfUAAAAAElFTkSuQmCC" class="chatImg">`);
                sName(/\bSOLARIS\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURQAAAPXMAA6l2Nff6PXgAP///wRC0v/nYgSE0dLMZGkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAPxJREFUOMudUjtuwzAMfZai3UAu4KW7AAFGRx+BGXSG9gK1vWeIj12S+gb5DCEkmqL4TD5SwAsZHl3m3eUTeNneF+8SIzleYrPSU4zyrUBrEYItJ4kkOAUQiYmkmviAn6sfO8AFX05N9wiYOMOBffXJHvoMF81xB5Dy7fyHba8c+LYAqAFk5a7Y8xFxu1YOcFq4G4RwJCVL6i0ybxvW0HFyfYaoSQ1qUaP93leExTdOWkctiZKBhTKFMN8OlPDUqgoY2czIrIRD+A2wNTgBTEc6ccBIU5kC1+/bE+G58iYZbe6STFq8qa2G/15bOr18QuaJr0nDne7DTvhU/gFIfC2SnkfnfgAAAABJRU5ErkJggg==" class="chatImg">`);
                sName(/\bAETHER\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAAPuSKxk9P//nYgSE0Szo9JXz+bkvnOsAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAMlJREFUOMuVkkESgyAMRXOFCLpvpxfIcAI67QGYUfcu5P5H6E+0GFetH4EneWFcSHQ13f1SbiSPSwkkT5fMeJi3mfedO2cEii8XlphTEps6NmZnZPJ+DoGz6K3C1qAsLN6ht4sWMXtAY23zDsXxSIFUUoqAEbuxnnmFZDpiEm6dikzWDMYZOyWcG0wywFOM9ezU0K+8frOIDmZAY12bgArNJQ3zHrsVnwVorHurQ6W6pKHuWVgHM6Cxrq0OlWpt778Dlf63t1z+uz+CSKxdfCwzEgAAAABJRU5ErkJggg==" class="chatImg">`);
                sName(/\bHYPERION\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURQAAAJXz+fuSKxi24gSE0Q5giCzo9P28Rv/nYgvspVMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAf9JREFUOMuVUsGOm0AM5RfckDTXZbtarqyBcmUxEddox+lcEWBxbVQJrmxmqD+7s5/QuVgjvef37Oco+t/37ZmSmk0dUy0wAkBOKCKIwyDM3OTI1ALEiMgLvD9Fn/j2ozZcE2an03jkK2I50kUGGcoPLAgLc2mPfCj4A3/+hjS6JwmAobopKziTl+2sO6m6WR+i6o162id/PDAw43JPo1Wfvi/cQiNzNtd+2ue+Gj2bWeaheBQdVsZN2/FQXEEf1V0jTV4XLFrTDAESCH4eKnFkLFtEz11esU4bA0IPqkHhM+DLggwO1dj1bvIVWthiY42lxpmOOlTxtx5O0sOyLNF9SUop2GQyq4qdJ6vbQdV06mpy3LFlt+9hayVJv+rf6P6aliWiySg0I+Nklh4fMXfeQOxaS2fwzmF+kUvfr6tGy5JiKQNmcXDdsqNu7LNH3FpLcfygrj5ffeVyEqIvS2ukmqqASEYWLZFnO/bwgKC2xfEuM535i2DGSxPWnKzRsj5XmsEpO9oPK6MjSzJsAGfoiPZA745eXM6jNOrt6xpySELqmSAEAss+duEbggtemlBY3dHfXN7K2BBrkkYLvr1wUBgCTiZmaQrm6wGRqBEx7WWEm+TYssHWekqjX38waTMKU4iMItOt4XBmAIGCExsmqm+YN0Qmb5XfX/77uv8BkxTQHgK/b+IAAAAASUVORK5CYII=" class="chatImg">`);
                sName(/\bANTEPROXIMA\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAAABmOAevCTf/WoT/kf///yrTaOw+uowAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAASZJREFUOMt1UluOwyAMnALqN2ovQNXVfqOw4jsKucFeALUS9z/CjnFe2s1aGA22xx4SALHLA2oG+INWC4fUbfCKP8JpiUAzaRcJXp7fD0VmqTvyJOZ3+iTbNuHMOHWTTHaY5xHzPIuPTkHZAyPcsAAbmQZcSpmeauEmIBY9iDODsmSgUbivz+yitxVcLnJ6IVJHBklgbygBb9akRgKeSuAA37vntynPmINNEV4IMVmJVpUUYTcCSmvoJBszSLg8NkKXFJHdsBIGfojCL1ZwV0msgb8LAfZVFtl9wosHCpDOQoLVS2eTauoigtxKlEc0+rXKQmutJhIST1cebF3BMF1r6jW/3kNYNrP+T2b9IXb+zjSkL8ac5o4gbENlQvin5Sl5f0K74h8hY0SZdVIsfwAAAABJRU5ErkJggg==" class="chatImg">`);
                sName(/\bPROXIMA\b/gi, `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAQBAMAAABzZ+XyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAAAAuZgp4/jfc/4Ty/////zOz/+0H8sQAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAPxJREFUKM9tUkGOwzAInIK152jVB1BtHuAWyeeq9g/2A5Yq+f9PWByctNkUKdaEgQGDgdMFbgQc0Gpi3/dt8p9Z/lMbpAdw+vm9uJsGLx+Ud4pH29ewHkMpGaWUu4GCAskOCNrdL9mgqjWrJgcxLCDmyO4ZTUwIkbhmIIUIrrxQSlgCr3jWtVdxodRiiMoVakGis2SO6aztWbc2Q2oNS+keKKpwRQucvfSYgZUGMo3Sph8t0DzWzPk28ZuiEZJnGZepnHgBPfVqqdtoOXqthtZaTRhAQc2or9oXc5h/P2jdg018eu1zP/+R6JulA0Fvmp7YFeXjU6I92F7fsD/aWi+37K8etAAAAABJRU5ErkJggg==" class="chatImg">`);
                // Rank names
                sName(/\bADMINS?\b/gi, match => `<span style='color:#FF4F4F'>${match}</span>`);
                sName(/\bMODERATORS?\b/gi, match => `<span style='color:#86FF41'>${match}</span>`);

                /*** PLAYER NAMES ***/

                sName(/\b((F|L)OR|4|PHOR(RH?)?)EST(\s?(L|F)ANDT?)?\b/gi, match => `<span style='color:#63C64D'>${match}</span>`);
                sName(/\b(MR\.?\s)?SMILES\b/gi, match => `<span style='color:#FFFFFF'>${match}</span>`);
                sName(/\bRIVER(\s?(LAND|L'ANT|DUCK))?\b/gi, match => `<span style='color:#0484D1'>${match}</span>`);
                sName(/\b(RAINBOW(BALL)?|REGENBOGEN)\b/gi, match => `<span class="rainbow-container"><span class="rainbow">${match}</span><span class="rainbow-back">${match}</span></span>`);
                sName(/\bMONOCHROME\b/gi, match => { match = match.split(""); return `<span style='color:#000000'>${match[0]}<span style='color:#404040'>${match[1]}<span style='color:#808080'>${match[2]}<span style='color:#C0C0C0'>${match[3]}<span style='color:#FFFFFF'>${match[4]}${match[5]}</span>${match[6]}</span>${match[7]}</span>${match[8]}</span>${match[9]}</span>` });
                sName(/\bROMANIABALL\b/gi, match => `<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAASUExURf///wAAAPzQAAArf84AAAAAAL+aKrIAAAAGdFJOU///////ALO/pL8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAE9JREFUKFN10EkKACAMA8DE5f9flqQuiDWHogNVK7oDZS5jTyVMBWRRSO8EtVpaE8GwRBTiNjLEALCoiD5yurbsk3P53H7L++ZkrmT2+38GpP8CyRiq0RgAAAAASUVORK5CYII=' class="chatImg"> <span style='color:#003CB3'>${match[0] + match[1] + match[2] + match[3]}</span><span style='color:#FCD116'>${match[4] + match[5] + match[6]}</span><span style='color:#CE1126'>${match[7] + match[8] + match[9] + match[10]}</span>`);
                sName(/\bNOTHINGHERE(7759)?\b/gi, match => { match = match.split(""); return `<span style='color:#FFE762'>${match[0] + match[1] + match[2] + match[3] + match[4] + match[5] + match[6]}<span style='color:#63C64D'>${match[7] + match[8] + match[9] + match[10]}</span>${match[11] ? "7759" : ""}</span>` });
                sName(/\bDIERMANIA\b/gi, match => `<span style='color:#DD0000'>${match[0] + match[1] + match[2]}<span style='color:#FFCE00'>${match[3]}<span style='color:#000000; text-shadow:-1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>${match[4]}</span>${match[5]}</span>${match[6] + match[7] + match[8]}</span>`);
                sName(/\b(SL?YNT(EX(PR)?|AXIS))\b/gi, match => `<span style='color:#417171'>${match}</span>`);
                sName(/\bTRION(\sNEX(\b\.|US(ORIATE)?)?)?(?=\s|$|"|'|\b)/gi, match => { match = match.split(""); return `<span style='color:#21D714'>${match[0]}<span style='color:#FFFFFF'>${match[1]}<span style='color:#000000'>${match[2]}</span>${match[3]}</span>${match.slice(4).join("")}</span>`; });
                sName(/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)(СИНТ((Е|Э)КС(ПР)?|АКСИС)|СЛЮНТ(Е|Э)КС)(?=\s|$|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)/gi, match => `<span style='color:#417171'>${match}</span>`);
                sName(/\b(COALI(TION)?|CLN)\b/gi, match => `<span style='color:#608C5E'>${match}</span>`);
                sName(/\b(CRC|UNBIDDEN)\b/gi, match => `<span style='color:#90F1F8'>${match}</span>`);
                sName(/\bCOALCRCITION\b/gi, match => `<span style='color:#6D80A5'>${match}</span>`);
                sName(/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)((SOUTH\s)?NORTH?IAN?(\s(EMPIRE|REPUBLIC))?|USRNSNN|URNNSN|Ņüŧüŗí(ß|ẞ)flőd|NUTURI(SS?|B)FLOD|IKD1)(?=\s|$|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)/gi, match => `<span style='color:#32E27E'>${match}</span>`);
                sName(/\bNORISIA\b/gi, match => `<span style='color:#F75B18'>${match}</span>`);
                sName(/\bVINLAND\b/gi, match => `<span style='color:#DEB129'>${match}</span>`);
                sName(/\bR(SS|55)R\b/gi, match => `<span style='color:#FF0000'>${match}</span>`);
                sName(/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)(MOTH(ERSHIP|METHMYTH|YLAMINE)?|МОЛЬ)(?=\s|$|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)/gi, match => `<span style='color:#D7C39F'>${match}</span>`);
                sName(/\bSAR\b/gi, match => `<span style='color:#D50B0B'>${match}</span>`);
                sName(/\b(POTASS(IUM)?|EVERMORE)\b/gi, match => `<span style='color:#FFA200'>${match}</span>`);
                sName(/\bATLAN\b/gi, match => { match = match.split(""); return `<span style='color:#FFFFFF'>${match[0]}<span style='color:#808080'>${match[1]}<span style='color:#FF0000'>${match[2]}</span>${match[3]}</span>${match[4]}</span>` });
                sName(/\bATLAN?DOS\b/gi, match => { match = match.split(""); return `<span style='color:#FFFFFF'>${match[0]}<span style='color:#AAAAAA'>${match[1]}<span style='color:#555555'>${match[2]}<span style='color:#FF0000'>${match[3] + (match.length == 7 ? "" : match[4])}</span>${match[match.length - 3]}</span>${match[match.length - 2]}</span>${match[match.length - 1]}</span>` });
                sName(/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b):\bD(\s|-)ANON\b/gi, match => `<span style='color:#0080FF'>${match}</span>`);
                sName(/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_)ST\.?(?=\s|$|"|'|\b)/gi, match => `<span style='color:#A1409D'>${match}</span>`);
                sName(/\bSHADOW\sTAI?LE\b/gi, match => `<span style='color:#4394A0'>${match.slice(0, 6)}</span>${match[6] == ' ' ? ' ' : ''}<span style='color:#F430B2'>${match.slice(7)}</span>`);
                sName(/\bORANG\b/gi, match => `<span style='color:#FF8800'>${match}</span>`);
                sName(/\bHUNGARYBALL\b/gi, match => { match = match.split(""); return `<span style='color:#CE2939'>${match[0] + match[1] + match[2] + match[3]}</span><span style='color:#FFFFFF'>${match[4] + match[5] + match[6]}</span><span style='color:#477050'>${match[7] + match[8] + match[9] + match[10]}</span>` });
                sName(/\bMAGYARLABDA\b/gi, match => { match = match.split(""); return `<span style='color:#CE2939'>${match[0] + match[1] + match[2] + match[3]}</span><span style='color:#FFFFFF'>${match[4] + match[5] + match[6]}</span><span style='color:#477050'>${match[7] + match[8] + match[9] + match[10]}</span>` });
                sName(/\bGABRIEL\b/gi, match => `<span style='color:#F0F0F0'>${match[0]}<span style='color:#F4E5BC'>${match[1]}<span style='color:#F9DB88'>${match[2]}<span style='color:#FED154'>${match[3]}</span>${match[4]}</span>${match[5]}</span>${match[6]}</span>`);
                sName(/\bWEST\sVLANDIA\b/gi, match => `<span style='color:#950000'>${match}</span>`);
                sName(/\bEAST\sVLANDIA\b/gi, match => `<span style='color:#FF7A33'>${match}</span>`);
                sName(/\b(?<!(EA|WE)ST\s)VLANDIA\b/gi, match => `<span style='color:#950000'>${match}</span>`);
                sName(/\bSANGSA\b/gi, match => `<span style='color:#FF0000'>${match.slice(0, 1)}</span><span style='color:#0000FF'>${match.slice(1, 5)}</span><span style='color:#FF00F7'>${match.slice(-1)}</span>`);
                sName(/\b(KWAPT|62143)\b/gi, match => `<span style='color:#A45195'>${match}</span>`);
                sName(/\bSIREMIA\b/gi, match => `<span style='color:#FFFFFF'>${match}</span>`);
                sName(/\bXAHH\b/gi, match => `<span style='color:#00FA9A'>${match}</span>`);
                sName(/\bLLG\b/gi, match => `<span style='color:#FF00FF'>${match}</span>`);
                sName(/\bNONA(EM|MEZ_?)\b/gi, match => `<span style='color:#9E9EFF'>${match}</span>`);
                sName(/\b16777216\b/gi, `<span style='color:#0000FF'>16</span><span style='color:#00FF00'>77</span><span style='color:#FF0000'>72</span><span style='color:#FFFFFF'>16</span>`);
                sName(/\bNEKONOKA\b/gi, match => `<span style='color:#8F3CD7'>${match}</span>`);
                sName(/\bTOASTER\b/gi, match => `<span style='color:#FFC839'>${match.slice(0, 2)}<span style='color:#FFFFFF'>${match.slice(2, 5)}</span>${match.slice(-2)}</span>`);
                sName(/\bTAUM(OTON(S)?)?\b/gi, match => `<span style='color:#EE00FF'>${match}</span>`);
                sName(/\bC3PHEI\b/gi, match => `<span style='color:#AC3940'>${match}</span>`);
                sName(/\bENDERMENT\b/gi, match => `<span style='color:#952BFF'>${match}</span>`);
                sName(/\b(TAHA(\sÖZDEMIR)?|SYBERLONG)\b/gi, match => `<span style='color:#224E7C'>${match}</span>`);
                sName(/\bS(Ü|U)DENLAND\b/gi, match => `<span style='color:#224E7C'>${match[0]}<span style='color:#4C8FD6'>${match[1]}<span style='color:#1DCDA1'>${match[2]}</span>${match[3]}</span>${match.slice(-5)}</span>`);
                sName(/\bRELOOPGD\b/gi, match => `<span style='color:#FD1C27'>${match}</span>`);
                sName(/\bBLAKE\b/gi, match => `<span style='color:#FCC8D9'>${match}</span>`);
                sName(/\bCAPA\b/gi, match => `<span style='color:#A44F15'>${match}</span>`);
                sName(/\bLEG(3ND)?\b/gi, match => `<span style='color:#DD80A5'>${match}</span>`);
                sName(/\b5UP\b/gi, match => `<span style='color:#0484D1'>${match}</span>`);
                sName(/\b(VVICTOR|OFO\sGANG)\b/gi, match => `<span style='color:#00FF66'>${match}</span>`);
                sName(/\bM(OUNTAI|T)N\sDEW\b/gi, match => `<span style='color:#00FF00'>${match.slice(0, -4)}</span> <span style='color:#FF0000'>${match.slice(-3)}</span>`);
                sName(/\b(MART|ARTM)AN\b/gi, match => `<span style='color:#0083D5'>${match}</span>`);
                sName(/\bSTEVESTA\b/gi, match => `<span style='color:#7F7F7F'>${match}</span>`);
                sName(/\bLAPIS\b/gi, match => `<span style='color:#0066FF'>${match}</span>`);
                sName(/(?<!:)\bJP(DLD|LAND)?\b/gi, match => `<:J:409708038589775872> <span style='color:#FFFFFF'>${match}</span>`);
                sName(/\bAMON?GUSLAND\b/gi, match => `<span style='color:#52A4DC'>${match}</span>`);
                sName(/\bDOITSHL(Æ|A)ND\b/gi, match => `<span style='color:#58585A'>${match.slice(0, 3)}</span><span style='color:#C72931'>${match.slice(3, 7)}</span><span style='color:#F9DD3E'>${match.slice(-3)}</span>`);
                sName(/\bDOITSHLAEND\b/gi, match => `<span style='color:#58585A'>${match.slice(0, 4)}</span><span style='color:#C72931'>${match.slice(4, 7)}</span><span style='color:#F9DD3E'>${match.slice(-4)}</span>`);
                sName(/\bDEUCHLAND\b/gi, match => `<span style='color:#58585A'>${match.slice(0, 3)}</span><span style='color:#C72931'>${match.slice(3, 6)}</span><span style='color:#F9DD3E'>${match.slice(-3)}</span>`);
                sName(/\bLEMONWIRES\b/gi, match => `<span style='color:#FFF700'>${match[0]}</span><span style='color:#00FF1E'>${match[1]}</span><span style='color:#FFF700'>${match[2]}</span><span style='color:#00FF1E'>${match[3]}</span><span style='color:#FFF700'>${match[4]}</span><span style='color:#00FF1E'>${match[5]}</span><span style='color:#FFF700'>${match[6]}</span><span style='color:#00FF1E'>${match[7]}</span><span style='color:#FFF700'>${match[8]}</span><span style='color:#00FF1E'>${match[9]}</span>`);
                sName(/\bLEMON\b/gi, match => `<span style='color:#FFFF00'>🍋 ${match}</span>`);
                sName(/\bTESS\b/gi, match => `<span style='color:#9CDED3'>${match}</span>`);
                sName(/\bHELPER\b/gi, match => `<span style='color:#00FF00'>${match}</span>`);
                sName(/\b(CYGNUS|CEUTHYN)\b/gi, match => `<span style='color:#00EEFF'>${match}</span>`);
                sName(/\bSHAY\b/gi, match => `<span style='color:#2CE8F4'>${match}</span>`);
                sName(/\bNEOMOTH(\.DEV)?\b/gi, match => `<span style='color:#9669ff'><:1:1388314585781637200> ${match}</span>`);
                sName(/\bELDIT\b/gi, match => `<span style='color:#A92444'>${match}</span>`);
                sName(/\bJI+GG\b/gi, match => `<span style='color:#00FFFF'>${match}</span>`);
                sName(/\bC(-|\s)?YARD\b/gi, match => `<span style='color:#00FF00'>${match}</span>`);
                sName(/\bVGS\b/gi, match => `<span style='color:#FF0000'>${match}</span>`);
                sName(/\b(JJB|JAR\s?JAR(\s?BOINKS)?)\b/gi, match => `<span style='color:#750F00'><:j:411450961949753345> ${match}</span>`);
                sName(/\bNORDDEX\b/gi, match => `<span style='color:#E53B44'>${match}</span>`);
                sName(/\b(999|AZSRIEL)\b/gi, match => `<span class="rainbow-container"><span class="rainbow">${match}</span><span class="rainbow-back">${match}</span></span>`);
                sName(/\bNURUTOMO\b/gi, match => `<span style='color:#0484D1'>${match}</span>`);
                sName(/\bMEMELORD\b/gi, match => `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAMAAABlXnzoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURZ5q/0X/DwAAAJ+7yioAAAADdFJOU///ANfKDUEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAADhJREFUGFdtzkEKADEMQtGv9z/0YIUySLNI8lyEYAPYkmQzBClB+tmGRWvZUw3u5R8TFG/mic7hBzLcALENn7j/AAAAAElFTkSuQmCC" class="chatImg"> <span style='color:#9E6AFF'>${match.slice(0, 4)}</span><span style='color:#45FF0F'>${match.slice(4)}</span>`);
                sName(/\bF(RI|U)CK\sVERIZON\b/gi, match => `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURf///wAAAAAAAH5RqV0AAAADdFJOU///ANfKDUEAAAAJcEhZcwAADsEAAA7BAbiRa+0AAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAA2XYBAOgDAADZdgEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAACMojeFEB6NgAAAEZJREFUKFONkIsKACAIA+f+/6NjEr6o6EBhR0UKkkTgSWWBx2bcoRs5wPIloehltluo0S7qdDEZusb41PNU4Vsdxq4LFOQCftcAm2osOS0AAAAASUVORK5CYII=" class="chatImg"> <span style='color:#FFFFFF'>${match}</span>`);
                sName(/\bRANDOOF\b/gi, match => `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURXUAALMZGQAAAOXo42cAAAADdFJOU///ANfKDUEAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAnZMAAOgDAACdkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAJFj+K2cP21wAAACBJREFUGFdjYAADJhiAcAnySQKMjIxwkhg+SQDdZQT4ADwAAH+enAY0AAAAAElFTkSuQmCC" class="chatImg"> <span style="color:#B31919">${match}</span>`)
                sName(/\bSISYPHUS(\sPRIME)?\b/gi, match => `{FF2B00 ${match[0]}{FF6100 ${match[1]}{FFA500 ${match[2]}{FFB200 ${match[3]}}{FFCD00 ${match[4]}{FFFF00 ${match[5]}}{FFFFBA ${match[6]}{FFFFFF ${match[7]}}${(match[8] ?? '') + (match[9] ?? '')}}${(match[10] ?? '')}}${(match[11] ?? '')}}${(match[12] ?? '')}}${(match[13] ?? '')}}`);
                sName(/\bMINOS(\sPRIME)?\b/gi, match => `{D3D5FF ${match[0]}{9395D7 ${match[1]}{6E70AB ${match[2]}{77526D ${match[3]}{934463 ${match[4] + (match[5] ?? '') + (match[6] ?? '')}}${(match[7] ?? '')}}${(match[8] ?? '')}}${(match[9] ?? '')}}${(match[10] ?? '')}}`);
                sName(/\b(GREENY(\s?LAND)?|UGS|UNITED\s<span\sstyle='color:#63C64D'>GREEN<\/span>\sSTATES)\b/gi, match => `<span style='color:#4ED97C'>${match}</span>`);
                sName(/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)((NEW\s)?PHY(REXIA)?|ɸ|ჶ)(?=\s|$|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)/gi, match => `<span style='color:#F4F1A4'>${match}</span>`);
                sName(/\bPURPERISM\b/gi, match => `<span style='color:#972C9E'>${match}</span>`);
                sName(/\b(RODIMUS(\s?PRIME)?|PACI(CIDAL)?|UNALIGNED)\b/gi, match => `<span style='color:#58A699'>${match}</span>`);
                sName(/\bDUCK12\b/gi, match => `<span style='color:#FFFFFF'>${match}</span>`);
                sName(/\b((BO(Ö|O)TES|VOID)\s(IMPERIUM|EMPIRE)|VOID)\b/gi, match => `<span style='color:#000000; text-shadow:-1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>${match}</span>`);
                sName(/\bRALIOVI\b/gi, match => `<span style='color:#AEE797'>${match}</span>`);
                sName(/\b(ERIC|HOLY\sELVEN\sHORDE|E(_|\s)LXIV)\b/gi, match => `<span style='color:#00B315'>${match}</span>`);
                sName(/\bNORIST\b/gi, match => `{39cd79 ${match[0]}}{1e8f73 ${match[1]}}{2b5758 ${match[2]}}{fb922b ${match[3]}}{aefe5d ${match[4]}}{3b9b90 ${match[5]}}`);
                sName(/\bEXPUNGED\b/gi, match => `<span style='color:#B80000'>${match}</span>`);
                sName(/\bNOUR\b/gi, match => `<span style='color:#9CC4C4'>${match}</span>`);
                sName(/\bEMPIRE\sFRAN(C|Ç)AIS\b/gi, match => `<span style='color:#0D67F8'>${match.slice(0, 10)}</span><span style="color:#FFFFFF">${match.slice(10, 12)}</span><span style="color:#E00000">${match.slice(-3)}</span>`);
                sName(/\bFILANA\b/gi, match => `<span style='color:#FFBFD1'>${match}</span>`);
                sName(/\bPINKISTAN\b/gi, match => `<span style='color:#FF97BF'>${match}</span>`);
                sName(/\bLILI?AC(\sREP(UBLIC)?)?\b/gi, match => `<span style='color:#A8ABF5'>${match}</span>`);
                sName(/\bTIZENAMI\b/gi, match => `<span style='color:#FE6C6C'>${match}</span>`);
                sName(/\b(UNION|ONION)\sOF\sUNKNOWN\b/gi, match => `<span style='color:#D4D4D4'>${match}</span>`);
                sName(/\bBREZTEC\b/gi, match => `<span style='color:#CFAE12'>${match}</span>`);
                sName(/\bTHISISKS\b/gi, match => `<span style='color:#00CEFF'>${match}</span>`);
                sName(/\bCOCA\sPOLA\b/gi, match => `<span style='color:#E53B44'>${match}</span>`);
                sName(/\bSOLANIAN\sTRIBE\b/gi, match => `{B34400 ${match[0]}{C45C00 ${match[1]}{FB8B03 ${match[2]}{FEC625 ${match[3] + match[4]}{FEAE10 ${match[5]}{E6E631 ${match[6]}}${match[7]}} ${match[9] + match[10]}}${match[11]}}${match[12]}}${match[13]}}`);
                sName(/\bSOLANIA\b/gi, match => `{B34400 ${match[0]}{C45C00 ${match[1]}{FB8B03 ${match[2]}{FEC625 ${match[3]}}${match[4]}}${match[5]}}${match[6]}}`);
                sName(/\bSOUTH?IA(N\sEMPIRE)?\b/gi, match => `<span style='color:#FBD439'>${match}</span>`);
                sName(/\bSTABLE\sLAND\b/gi, match => `<span style='color:#C2A42E'>${match}</span>`);
                sName(/\bSTABILIA\b/gi, match => `<span style='color:#AEFE5D'>${match}</span>`);
                sName(/\bMAURICE\b/gi, match => `{79665F ${match[0]}{9D897A ${match[1]}{BAA490 ${match[2]}{D3B8A1 ${match[3]}}${match[4]}}${match[5]}}${match[6]}}`);
                sName(/\bECIRUAM\b/gi, match => `{8699A0 ${match[0]}{627685 ${match[1]}{455B6F ${match[2]}{2C475E ${match[3]}}${match[4]}}${match[5]}}${match[6]}}`);
                sName(/\bAVIA(N\sREPUBLIC)?\b/gi, match => `{9c0aeb ${match}}`);
                sName(/\bSYNTHESIA\b/gi, match => `{63C64D ${match[0]}{4A9C49 ${match[1]}{327345 ${match.slice(2, 4)}{AF9C2C ${match[4]}}${match.slice(5, 7)}}${match[7]}}${match[8]}}`);
                sName(/\b(DARKSTALKER|\.JUSTDARK)\b/gi, match => `<span style='color:#570034; text-shadow:-1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>${match}</span>`);
                sName(/\bCYNTEX\b/gi, match => `{417171 ${match[0]}}{348A8D ${match[1]}}{27A3A9 ${match[2]}}{1ABCC6 ${match[3]}}{0DD5E2 ${match[4]}}{00EEFF ${match[5]}}`);
                sName(/\bINFRA(RAVEN)?\b/gi, match => `{CA0000 ${match}}`);
                sName(/\bDIMDEN\b/gi, match => `{B4FFD6 ${match}}`);
                sName(/\bKIT(0057)?\b/gi, match => `{F36709 ${match}}`);
                sName(/\bDAYDUN\b/gi, match => `{7D579A ${match}}`);
                sName(/\b(C|S)YTIA\b/gi, match => `{fbd439 ${match}}`);
                sName(/\b(LMN|ELEMEN)TAL\sX\b/gi, match => `{afd643 ${match}}`);
            }
            sName(/^\$\s?/g, '');

            /*** NICKNAMES ***/

            if (msgParsed.data.nick.match(/\b((F|L)OR|4|PHOR(RH?)?)EST(\s?(L|F)ANDT?)?\b/gi)) {
                msgParsed.data.nick = "<span style='color:#63C64D'>" + msgParsed.data.nick + "</span>"
            };
            if (msgParsed.data.nick.match(/\bMR\.?\sSMILES\b/gi)) {
                msgParsed.data.nick = "<span style='color:#FFFFFF'>" + msgParsed.data.nick + "</span>"
            };
            if (msgParsed.data.nick.match(/\bRIVER(\s?(LAND|L'ANT|DUCK))?\b/gi)) {
                msgParsed.data.nick = "<span style='color:#0484D1'>" + msgParsed.data.nick + "</span>"
            };
            if (msgParsed.data.nick.includes("Rainbowball")) {
                msgParsed.data.nick = msgParsed.data.nick.replace(/\bRAINBOWBALL\b/gi, `<span class="rainbow-container"><span class="rainbow">Rainbowball</span><span class="rainbow-back">Rainbowball</span></span>`);
                if (rank < 2) { msgParsed.data.nick = msgParsed.data.nick.replace(/\[\d+?\]\s/, ``); msgParsed.data.nick = `<span style='color:#FF0000'>[</span><span style='color:#00FF00'>${msgParsed.data.senderID}</span><span style='color:#0000FF'>]</span> ${msgParsed.data.nick}` };
                if (rank == 2) { msgParsed.data.nick = msgParsed.data.nick.replace('(M) ', ``); msgParsed.data.nick = `<span style='color:#FF0000'>(</span><span style='color:#00FF00'>M</span><span style='color:#0000FF'>)</span> ${msgParsed.data.nick}` };
                if (rank == 3) { msgParsed.data.nick = msgParsed.data.nick.replace('(A) ', ``); msgParsed.data.nick = `<span style='color:#FF0000'>(</span><span style='color:#00FF00'>A</span><span style='color:#0000FF'>)</span> ${msgParsed.data.nick}` };
            } else if (msgParsed.data.nick.includes("Rainbow")) {
                msgParsed.data.nick = msgParsed.data.nick.replace(/\bRAINBOW\b/gi, `<span class="rainbow-container"><span class="rainbow">Rainbow</span><span class="rainbow-back">Rainbow</span></span>`);
                if (rank < 2) { msgParsed.data.nick = msgParsed.data.nick.replace(/\[\d+?\]\s/, ``); msgParsed.data.nick = `<span style='color:#FF0000'>[</span><span style='color:#00FF00'>${msgParsed.data.senderID}</span><span style='color:#0000FF'>]</span> ${msgParsed.data.nick}` };
                if (rank == 2) { msgParsed.data.nick = msgParsed.data.nick.replace('(M) ', ``); msgParsed.data.nick = `<span style='color:#FF0000'>(</span><span style='color:#00FF00'>M</span><span style='color:#0000FF'>)</span> ${msgParsed.data.nick}` };
                if (rank == 3) { msgParsed.data.nick = msgParsed.data.nick.replace('(A) ', ``); msgParsed.data.nick = `<span style='color:#FF0000'>(</span><span style='color:#00FF00'>A</span><span style='color:#0000FF'>)</span> ${msgParsed.data.nick}` };
            };
            if (msgParsed.data.nick.includes("Monochrome")) {
                msgParsed.data.nick = "<span style='color:#000000'>" + msgParsed.data.nick.replaceAll("Monochrome", "M<span style='color:#404040'>o<span style='color:#808080'>n<span style='color:#C0C0C0'>o<span style='color:#FFFFFF'>ch</span>r</span>o</span>m</span>e") + "</span>";
            };
            if (msgParsed.data.nick.includes("Romaniaball")) {
                msgParsed.data.nick = "<span style='color:#003CB3'>" + msgParsed.data.nick.replaceAll("Romaniaball", "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAASUExURf///wAAAPzQAAArf84AAAAAAL+aKrIAAAAGdFJOU///////ALO/pL8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAE9JREFUKFN10EkKACAMA8DE5f9flqQuiDWHogNVK7oDZS5jTyVMBWRRSO8EtVpaE8GwRBTiNjLEALCoiD5yurbsk3P53H7L++ZkrmT2+38GpP8CyRiq0RgAAAAASUVORK5CYII=' class='chatImg'> Roma<span style='color:#FCD116'>nia</span><span style='color:#CE1126'>ball</span>") + "</span>";
            };
            if (msgParsed.data.nick.match(/\bNOTHINGHERE(7759)?\b/gi)) {
                msgParsed.data.nick = "<span style='color:#63C64D'>" + msgParsed.data.nick.replace(/\bNOTHINGHERE(7759)?\b/gi, match => { match = match.split(""); return `<span style='color:#FFE762'>${match[0] + match[1] + match[2] + match[3] + match[4] + match[5] + match[6]}<span style='color:#63C64D'>${match[7] + match[8] + match[9] + match[10]}</span>${match[11] ? "7759" : ""}</span>` }) + "</span>";
            };
            if (msgParsed.data.nick.includes("Diermania")) {
                msgParsed.data.nick = "<span style='color:#DD0000'>" + msgParsed.data.nick.replaceAll("Diermania", "Die<span style='color:#FFCE00'>r<span style='color:#000000; text-shadow:-1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>m</span>a</span>nia") + "</span>";
            };
            if (msgParsed.data.nick.match(/\b(SL?YNT(EX(PR)?|AXIS))\b/gi)) {
                msgParsed.data.nick = "<span style='color:#417171'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/(?<=\s|^|"|'|\b)(СИНТ((Е|Э)КС(ПР)?|АКСИС)|СЛЮНТ(Е|Э)КС)(?=\s|$|"|'|\b)/gi)) {
                msgParsed.data.nick = "<span style='color:#417171'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bCOALITION\b/gi)) {
                msgParsed.data.nick = "<span style='color:#608C5E'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\b(CRC|UNBIDDEN)\b/gi)) {
                msgParsed.data.nick = "<span style='color:#90F1F8'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bCOALCRCITION\b/gi)) {
                msgParsed.data.nick = "<span style='color:#6D80A5'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\b((SOUTH\s)?NORTH?IAN?(\s(EMPIRE|REPUBLIC))?|USRNSNN|URNNSN|IKD1)\b/gi)) {
                msgParsed.data.nick = "<span style='color:#32E27E'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bVINLAND\b/gi)) {
                msgParsed.data.nick = "<span style='color:#DEB129'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\[SERVER\]/gi)) {
                msgParsed.data.nick = "<span style='color:#FF41E4'>" + msgParsed.data.nick; + "</span>"
            };
            if (msgParsed.data.nick.match(/\bR(SS|55)R\b/gi)) {
                msgParsed.data.nick = "<span style='color:#FF0000'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/(?<=\s|^|"|'|\b)(MOTH(ERSHIP|METHMYTH|YLAMINE)?|МОЛЬ)(?=\s|$|"|'|\b)/gi)) {
                msgParsed.data.nick = "<span style='color:#D7C39F'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bPOTASSIUM(_(L|K))?\b/gi)) {
                msgParsed.data.nick = "<span style='color:#FFA200'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.includes("Atlan")) {
                msgParsed.data.nick = "<span style='color:#FFFFFF'>" + msgParsed.data.nick.replaceAll("Atlan", "A<span style='color:#808080'>t<span style='color:#FF0000'>l</span>a</span>n") + "</span>";
            };
            if (msgParsed.data.nick.includes("ATLaDOS")) {
                msgParsed.data.nick = "<span style='color:#FFFFFF'>" + msgParsed.data.nick.replaceAll("ATLaDOS", "A<span style='color:#AAAAAA'>T<span style='color:#555555'>L<span style='color:#FF0000'>a</span>D</span>O</span>S") + "</span>";
            };
            if (msgParsed.data.nick.includes("St.")) {
                msgParsed.data.nick = "<span style='color:#A1409D'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bORANG\b/gi)) {
                msgParsed.data.nick = "<span style='color:#FF8800'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.includes("HungaryBall")) {
                msgParsed.data.nick = "<span style='color:#CE2939'>" + msgParsed.data.nick.replaceAll("HungaryBall", "Hung<span style='color:#FFFFFF'>ary</span><span style='color:#477050'>Ball</span>") + "</span>";
            };
            if (msgParsed.data.nick.includes("Hungaryball")) {
                msgParsed.data.nick = "<span style='color:#CE2939'>" + msgParsed.data.nick.replaceAll("Hungaryball", "Hung<span style='color:#FFFFFF'>ary</span><span style='color:#477050'>ball</span>") + "</span>";
            };
            if (msgParsed.data.nick.includes("MagyarLabda")) {
                msgParsed.data.nick = "<span style='color:#CE2939'>" + msgParsed.data.nick.replaceAll("MagyarLabda", "Magy<span style='color:#FFFFFF'>arL</span><span style='color:#477050'>abda</span>") + "</span>";
            };
            if (msgParsed.data.nick.includes("Magyarlabda")) {
                msgParsed.data.nick = "<span style='color:#CE2939'>" + msgParsed.data.nick.replaceAll("Magyarlabda", "Magy<span style='color:#FFFFFF'>arl</span><span style='color:#477050'>abda</span>") + "</span>";
            };
            if (msgParsed.data.nick.includes("Europe RP")) {
                msgParsed.data.nick = "<span style='color:#0000FF'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bCYAN\b/gi)) {
                msgParsed.data.nick = "<span style='color:#2CE8F4'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bGABRIEL\b/gi)) {
                msgParsed.data.nick = msgParsed.data.nick.replace(/\bGABRIEL\b/gi, match => `<span style='color:#F0F0F0'>${match[0]}<span style='color:#F4E5BC'>${match[1]}<span style='color:#F9DB88'>${match[2]}<span style='color:#FED154'>${match[3]}</span>${match[4]}</span>${match[5]}</span>${match[6]}</span>`);
                if (rank < 2) { msgParsed.data.nick = msgParsed.data.nick.replace(/\[\d+?\]\s/, ``); msgParsed.data.nick = `<span style='color:#F0F0F0'>[<span style='color:#F9DB88'>${msgParsed.data.senderID}</span>]</span> ${msgParsed.data.nick}` };
                if (rank == 2) { msgParsed.data.nick = msgParsed.data.nick.replace('(M) ', ``); msgParsed.data.nick = `<span style='color:#F0F0F0'>(<span style='color:#F9DB88'>M</span>)</span> ${msgParsed.data.nick}` };
                if (rank == 3) { msgParsed.data.nick = msgParsed.data.nick.replace('(A) ', ``); msgParsed.data.nick = `<span style='color:#F0F0F0'>(<span style='color:#F9DB88'>A</span>)</span> ${msgParsed.data.nick}` };
            };
            if (msgParsed.data.nick.match(/\bXAHH\b/gi)) {
                msgParsed.data.nick = "<span style='color:#00FA9A'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bLLG\b/gi)) {
                msgParsed.data.nick = "<span style='color:#FF00FF'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bNONA(EM|MEZ_?)\b/gi)) {
                msgParsed.data.nick = "<span style='color:#9E9EFF'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bNEKONOKA\b/gi)) {
                msgParsed.data.nick = "<span style='color:#8F3CD7'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bTOASTER\b/gi)) {
                msgParsed.data.nick = "<span style='color:#FFC839'>" + msgParsed.data.nick.replace(/\bTOASTER\b/gi, match => `${match.slice(0, 2)}<span style='color:#FFFFFF'>${match.slice(2, 5)}</span>${match.slice(-2)}`) + "</span>";
            };
            if (msgParsed.data.nick.match(/\bC3PHEI\b/gi)) {
                msgParsed.data.nick = "<span style='color:#AC3940'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bENDERMENT\b/gi)) {
                msgParsed.data.nick = "<span style='color:#952BFF'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bTAHA\b/gi)) {
                msgParsed.data.nick = "<span style='color:#224E7C'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bS(Ü|U)DENLAND\b/gi)) {
                msgParsed.data.nick = "<span style='color:#224E7C'>" + msgParsed.data.nick.replace(/\bSÜDENLAND\b/gi, match => `${match[0]}<span style='color:#4C8FD6'>${match[1]}<span style='color:#1DCDA1'>${match[2]}</span>${match[3]}</span>${match.slice(-5)}`) + "</span>";
            };
            if (msgParsed.data.nick.match(/\bRELOOPGD\b/gi)) {
                msgParsed.data.nick = "<span style='color:#FD1C27'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/(\bBLAKE\b|._BLAKE_.)/gi)) {
                msgParsed.data.nick = "<span style='color:#FCC8D9'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bCAPA\b/gi)) {
                msgParsed.data.nick = "<span style='color:#A44F15'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bLEG\b/gi)) {
                msgParsed.data.nick = "<span style='color:#DD80A5'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bVVICTOR(__)?\b/gi)) {
                msgParsed.data.nick = "<span style='color:#00FF66'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\b(MART|ARTM)AN\b/gi)) {
                msgParsed.data.nick = "<span style='color:#0083D5'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bSTEVESTA\b/gi)) {
                msgParsed.data.nick = "<span style='color:#7F7F7F'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bLAPIS\b/gi)) {
                msgParsed.data.nick = "<span style='color:#0066FF'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bAMON?GUSLAND\b/gi)) {
                msgParsed.data.nick = "<span style='color:#52A4DC'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bDOITSHL(Æ|AE?)ND\b/gi)) {
                msgParsed.data.nick = "<span style='color:#F9DD3E'>" + msgParsed.data.nick.replace(/\bDOITSHL(Æ|A)ND\b/gi, match => `<span style='color:#58585A'>${match.slice(0, 3)}</span><span style='color:#C72931'>${match.slice(3, 7)}</span><span style='color:#F9DD3E'>${match.slice(-3)}</span>`).replace(/\bDOITSHLAEND\b/gi, match => `<span style='color:#58585A'>${match.slice(0, 4)}</span><span style='color:#C72931'>${match.slice(4, 7)}</span><span style='color:#F9DD3E'>${match.slice(-4)}</span>`) + "</span>";
            };
            if (msgParsed.data.nick.match(/\bLEMON\b/gi)) {
                msgParsed.data.nick = "<span style='color:#FFFF00'>" + msgParsed.data.nick.replace(/\bLEMON\b/gi, match => `🍋 ${match}`) + "</span>";
            };
            if (msgParsed.data.nick.match(/\bTESS\b/gi)) {
                msgParsed.data.nick = "<span style='color:#9CDED3'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\b(CYGNUS|CEUTHYN)\b/gi)) {
                msgParsed.data.nick = "<span style='color:#00EEFF'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bELDIT\b/gi)) {
                msgParsed.data.nick = "<span style='color:#A92444'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bMINOS(\sPRIME)?\b/gi)) {
                msgParsed.data.nick = "<span style='color:#D3D5FF'>" + msgParsed.data.nick.replace(/\bMINOS(\sPRIME)?\b/gi, match => `${match[0]}<span style="color: #9395D7">${match[1]}<span style="color: #6E70AB">${match[2]}<span style="color: #77526D">${match[3]}<span style="color: #934463">${match[4] + (match[5] ?? '') + (match[6] ?? '')}</span>${(match[7] ?? '')}</span>${(match[8] ?? '')}</span>${(match[9] ?? '')}</span>${(match[10] ?? '')}`) + "</span>";
            };
            if (msgParsed.data.nick.match(/\b(GREENY(LAND)?|GREEN\sREP|UGS)\b/gi)) {
                msgParsed.data.nick = "<span style='color:#4ED97C'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/(?<=\s|^|"|'|\b)(PHYREXIA|ɸ|ჶ)(?=\s|$|"|'|\b)/gi)) {
                msgParsed.data.nick = "<span style='color:#F4F1A4'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bPURPERISM\b/gi)) {
                msgParsed.data.nick = "<span style='color:#972C9E'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\b(RODIMUSPRIME|PACICIDAL|UNALIGNED)\b/gi)) {
                msgParsed.data.nick = "<span style='color:#58A699'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bDUCK12\b/gi)) {
                msgParsed.data.nick = "<span style='color:#FFFFFF'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bBOÖTES\sIMPERIUM\b/gi)) {
                msgParsed.data.nick = "<span style='color:#000000; text-shadow:-1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bRALIOVI\b/gi)) {
                msgParsed.data.nick = "<span style='color:#AEE797'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\b(ERIC|LMAO\.ERICC_6464)\b/gi)) {
                msgParsed.data.nick = "<span style='color:#00B315'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bEXPUNGED\b/gi)) {
                msgParsed.data.nick = "<span style='color:#B80000'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bNOUR\b/gi)) {
                msgParsed.data.nick = "<span style='color:#9CC4C4'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bEMPIRE\sFRAN(Ç|C)AIS\b/gi)) {
                msgParsed.data.nick = "<span style='color:#0D67F8'>" + msgParsed.data.nick.replace(/\bEMPIRE\sFRAN(Ç|C)AIS\b/gi, match => `${match.slice(0, 10)}<span style="color:#FFFFFF">${match.slice(10, 12)}</span><span style="color:#E00000">${match.slice(-3)}</span>`) + "</span>";
            };
            if (msgParsed.data.nick.match(/\b(UNION|ONION)\sOF\sUNKNOWN\b/gi)) {
                msgParsed.data.nick = "<span style='color:#D4D4D4'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bBREZTEC\b/gi)) {
                msgParsed.data.nick = "<span style='color:#CFAE12'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bTHISISKS\b/gi)) {
                msgParsed.data.nick = "<span style='color:#00CEFF'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bSOLANIA\b/gi)) {
                msgParsed.data.nick = "<span style='color:#B34400'>" + msgParsed.data.nick.replace(/\bSOLANIA\b/gi, match => `${match[0]}<span style="color:#C45C00">${match[1]}<span style="color:#FB8B03">${match[2]}<span style="color:#FEC625">${match[3]}</span>${match[4]}</span>${match[5]}</span>${match[6]}`) + "</span>";
            };
            if (msgParsed.data.nick.match(/\bSOUTH?IAN?\b/gi)) {
                msgParsed.data.nick = "<span style='color:#FBD439'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bSTABLE\sLAND\b/gi)) {
                msgParsed.data.nick = "<span style='color:#C2A42E'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bSTABILIA\b/gi)) {
                msgParsed.data.nick = "<span style='color:#AEFE5D'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bAVIA(N\sREPUBLIC)?\b/gi)) {
                msgParsed.data.nick = "<span style='color:#9C0AEB'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bSYNTHESIA\b/gi)) {
                msgParsed.data.nick = "<span style='color:#63C64D'>" + msgParsed.data.nick.replace(/\bSYNTHESIA\b/gi, match => `${match[0]}<span style='color:#4A9C49'>${match[1]}<span style='color:#327345'>${match.slice(2, 4)}<span style='color:#AF9C2C'>${match[4]}</span>${match.slice(5, 7)}</span>${match[7]}</span>${match[8]}`) + "</span>";
            };
            if (msgParsed.data.nick.match(/\b(DARKSTALKER|\.JUSTDARK)\b/gi)) {
                msgParsed.data.nick = "<span style='color:#570034; text-shadow:-1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bINFRA(RAVEN)?\b/gi)) {
                msgParsed.data.nick = "<span style='color:#CA0000'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bDIMDEN\b/gi)) {
                msgParsed.data.nick = "<span style='color:#B4FFD6'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bKIT(0057)?\b/gi)) {
                msgParsed.data.nick = "<span style='color:#F36709'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\bDAYDUN\b/gi)) {
                msgParsed.data.nick = "<span style='color:#7D579A'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\b(C|S)YTIA\b/gi)) {
                msgParsed.data.nick = "<span style='color:#FBD439'>" + msgParsed.data.nick + "</span>";
            };
            if (msgParsed.data.nick.match(/\b(LMN|ELEMEN)TAL\sX\b/gi)) {
                msgParsed.data.nick = "<span style='color:#afd643'>" + msgParsed.data.nick + "</span>";
            };

            /*** SECOND TECHNICAL AREA ***/

            if (!anchorme(msgParsed.data.message).includes("<a") && !msgParsed.data.message.match(/^\$/)) {
                msgParsed.data.message = mdParse(msgParsed.data.message);
            } else {
                sName(/^\$\s?/g, '');
            };
            // Unnamed players
            if (msgParsed.data.nick == msgParsed.data.senderID || msgParsed.data.nick.slice(4) == msgParsed.data.senderID) {
                msgParsed.data.nick = `<span style='color:${playerList[msgParsed.data.senderID]?.clr}'>` + msgParsed.data.nick + "</span>";
            };
            // Chat mention
            let findPlayer = new RegExp(`(?<=\\s|^|"|'|\\b)${playerID}(?=\\s|$|"|'|\\b)`, "g");
            sName(findPlayer, match => `<span style='color:#FF0000'>${match}</span>`);
            // Restore normal message color
            if (rank == 4) msgParsed.data.nick = "<span style='color:#6CFFE7'>" + msgParsed.data.nick + "</span><span style='color:#FFFFFF'>"; // Discord messages

            //console.log("Message after: " + JSON.stringify(msgParsed)); // Debug
            return JSON.stringify(msgParsed);
        };

        //Command processing
        const prevS = OWOP.misc.chatSendModifier || (m => m);
        OWOP.misc.chatSendModifier = msg => {
            msg = prevS(msg);
            if (!msg.startsWith('/')) return msg;
            const [cmd, ...args] = msg.slice(1).trim().split(/\s+/);
            switch (cmd.toLowerCase()) {
                case "local":
                case "l": {
                    if (args.length < 1) {
                        locErr('Usage: /local <message>');
                        return '';
                    };
                    let px = OWOP.mouse.tileX
                    let py = OWOP.mouse.tileY
                    let nearbyPlayers = []
                    for (let x in playerList) {
                        if (Math.abs(playerList[x].x / 16 - px) <= nearbyThresh && Math.abs(playerList[x].y / 16 - py) <= nearbyThresh) {
                            nearbyPlayers.push(x);
                        };
                    };
                    if (nearbyPlayers.length == 0) {
                        locErr('No players nearby');
                        return '';
                    };
                    let localMsg = args.join(' ') + "\nLocal chat: " + playerID + ", " + nearbyPlayers.join(', ');
                    for (let i = 0; i < nearbyPlayers.length; i++) {
                        tell(nearbyPlayers[i], localMsg);
                    };
                    return '';
                }
                case "lset":
                    if (args.length != 1 || isNaN(args[0]) || args[0] < 0) {
                        locErr("Usage: /lset <distance>");
                        return '';
                    };
                    nearbyThresh = args;
                    return '';
                case "clear":
                case "c":
                    if (args.length != 0) {
                        locErr("Usage: /clear");
                        return '';
                    };
                    OWOP.chat.clear();
                    return '';
                case "respond":
                case "r":
                    if (!responseID) {
                        locErr('Nobody messaged you yet');
                        return '';
                    }
                    if (!playerList[responseID]) {
                        locErr(`ID ${responseID} disconnected`);
                        responseID = undefined;
                        return '';
                    };
                    tell(responseID, args.join(" "));
                    return '';
                case "qid":
                case "qset":
                    if (args.length != 1) {
                        locErr('Usage: /qset <id>');
                        return '';
                    };
                    if (!isNaN(args)) {
                        if (!playerList[args]) {
                            locErr("ID " + args + " doesn't exist.")
                            return '';
                        };
                        quickID = args;
                        return '';
                    };
                    locErr('Usage: /qset <id>');
                    return '';
                case "q":
                    if (quickID === undefined) {
                        locErr('Use "/qset <id>" to set a quick id first');
                        return '';
                    };
                    if (args.length == 0) {
                        locErr('Usage: /q <message>');
                        return '';
                    };
                    if (!playerList[quickID]) {
                        locErr("ID " + quickID + " disconnected");
                        quickID = undefined;
                        return '';
                    };
                    tell(quickID, args.join(' '));
                    return '';
                case "left":
                    if (args.length != 1 || (args != "true" && args != "false")) {
                        locErr("Usage: /left <true/false>");
                        return '';
                    };
                    localStorage.chatOnLeft = args;
                    if (args == 'false') {
                        helpBtn.style.left = '0';
                        helpBtn.style.right = 'initial';
                        chat.style.right = '55px';
                        chat.style.left = 'initial';
                    } else {
                        helpBtn.style.left = 'initial';
                        helpBtn.style.right = '55px';
                        chat.style.right = 'initial';
                        chat.style.left = '0';
                    };
                    return '';
                case "block":
                    if (args.length != 1) {
                        locErr('Usage: /block <id>');
                        return '';
                    };
                    if (!playerList[args]) {
                        locErr(`ID ${args} does not exist`);
                        return '';
                    };
                    if (OWOP.muted.includes(Number(args))) {
                        locErr(`ID ${args} is already blocked`);
                        return '';
                    };
                    OWOP.muted.push(Number(args));
                    return '';
                case "unblock":
                    if (args.length != 1) {
                        locErr('Usage: /unblock <id>');
                        return '';
                    };
                    if (!playerList[args]) {
                        locErr(`ID ${args} does not exist`);
                        return '';
                    };
                    if (!OWOP.muted.includes(Number(args))) {
                        locErr(`ID ${args} is not blocked`);
                        return '';
                    };
                    OWOP.muted.splice(OWOP.muted.indexOf(Number(args)), 1);
                    return '';
                case "nearby": {
                    if (args.length > 1 || (args.length == 1 && isNaN(args[0]))) {
                        locErr('Usage: /nearby <distance*> (* = optional)');
                        return '';
                    };
                    let px = OWOP.mouse.tileX;
                    let py = OWOP.mouse.tileY;
                    let thresh = (args.length == 1 ? args[0] : nearbyThresh);
                    let nearbyPlayers = [];
                    for (let x in playerList) {
                        if (Math.abs(playerList[x].x / 16 - px) <= thresh && Math.abs(playerList[x].y / 16 - py) <= thresh) {
                            nearbyPlayers.push(x);
                        };
                    };
                    if (nearbyPlayers.length == 0) {
                        locErr('No players nearby');
                        return '';
                    } else {
                        locSend(`Nearby player ids: ${nearbyPlayers.join(', ')}`);
                        return '';
                    }
                };
                case "show":
                    if (args.length != 0) {
                        locErr('Usage: /show');
                        return '';
                    };
                    document.getElementById('chat-messages').style.display = (document.getElementById('chat-messages').style.display == 'none' ? '' : 'none');
                    return '';
                case "g":
                case "group":
                    if (args.length != 0) {
                        locErr('Usage: /group');
                        return '';
                    };
                    OWOP.windowSys.addWindow(new OWOP.windowSys.class.window('Group Chat', { closeable: true }, (gcWin) => {
                        gcWin.container.className = "wincontainer nhCont-v1-0";

                        let memLabel = document.createElement('label');
                        memLabel.for = "gcMembers";
                        memLabel.innerHTML = "Members: ";
                        gcWin.addObj(memLabel);
                        let memIn = document.createElement('input');
                        memIn.type = 'text';
                        memIn.name = 'gcMembers';
                        memIn.className = 'nhIn';
                        memIn.placeholder = "IDs must be comma separated";
                        memIn.addEventListener("blur", (e) => {
                            let members = memIn.value.split(',').map((elem) => { return elem.trim() });
                            for (let x = 0; x < members.length; x++) {
                                if (!playerList[members[x]] || members.indexOf(members[x]) != x) {
                                    members.splice(x, 1);
                                    x -= 1;
                                };
                            };
                            memIn.value = members.join(', ');
                        });
                        gcWin.addObj(memIn);
                        gcWin.addObj(document.createElement('br'));
                        let msgLabel = document.createElement('label');
                        msgLabel.for = "gcMessage";
                        msgLabel.innerHTML = "Message: ";
                        gcWin.addObj(msgLabel);
                        let msgIn = document.createElement('input');
                        msgIn.type = 'text';
                        msgIn.name = 'gcMessage';
                        let maxMsgLength = OWOP.definedProtos.old.maxMessageLength[OWOP.player.rank];
                        msgIn.maxLength = maxMsgLength;
                        msgIn.className = "nhIn";
                        msgIn.placeholder = "Press [Enter] to send";
                        function sendMsg() {
                            let members = memIn.value.split(',').map((elem) => { return elem.trim() });
                            for (let x = 0; x < members.length; x++) {
                                if (!playerList[members[x]] || members.indexOf(members[x]) != x) {
                                    members.splice(x, 1);
                                    x -= 1;
                                };
                            };
                            memIn.value = members.join(', ');
                            if (members.length == 0) return;
                            let msg = msgIn.value;
                            for (let x = 0; x < members.length; x++) {
                                let extra = members.join().length + 11 + `${members[x]}`.length;
                                tell(members[x], `${msg.length + extra > maxMsgLength ? msg.slice(0, maxMsgLength - extra) : msg}\nGC:${members.join()}`);
                            };
                            msgIn.value = '';
                        }
                        msgIn.addEventListener("keydown", ((e) => {
                            if (e.key == "Enter") {
                                sendMsg();
                            };
                        }));
                        gcWin.addObj(msgIn);
                        gcWin.addObj(document.createElement('br'));
                        let sendBtn = document.createElement('button');
                        sendBtn.addEventListener("click", (e) => {
                            sendMsg();
                        });
                        sendBtn.innerHTML = 'Send';
                        gcWin.addObj(sendBtn);
                    }).move(innerWidth - 343, 60));
                    return '';
                case "yell":
                    if (args.length == 0) {
                        locErr('Usage: /yell <id*> <message> (* = optional)');
                        return '';
                    };
                    if (!isNaN(args[0])) {
                        tell(args[0], args.slice(1).join(' ').toUpperCase());
                        return '';
                    };
                    say(args.join(' ').toUpperCase());
                    return '';
                case "help":
                case "h":
                case "?":
                    helpHandle(args);
            };
            return msg;
        };
        // Update Notice
        if (localStorage.chatUtilsUpdateNotice != '1.7.1') {
            locSend(`<span style="color:#FFFF00">Chat Utils update 1.7.1:
 - Removed /color
 - Fixed player id and /qset not working after reconnecting
 - Fixed images in chat not scaling
 - Fixed messages from discord not having the right color
 - Made colorful chat compatible with several gateways
 - Added new words to colorful chat
<button onclick="localStorage.chatUtilsUpdateNotice = '1.7.1'; this.parentElement.parentElement.parentElement.remove()">Click to dismiss</button></span>`)
        }
        console.log('Chat Utils installed');
    };
})();
