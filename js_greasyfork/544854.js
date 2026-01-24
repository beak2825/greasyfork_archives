// ==UserScript==
// @name         OWOP Chat Utils
// @namespace    https://greasyfork.org/en/users/1502179/
// @version      1.8.1
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
1.8 - Made it so all colored words also work as nicknames and vice versa
      Made it possible to use markdown inside nicknames
      Added /max
      Added coal, copper, iron, amethyst, diamond, redstone, lapis lazuli, emerald, sapphire, ruby, Nut Wujing, Slovakia, Czechia, Europe, Roman Empire, England, Cygntex, Mindustria, 67, Idk1, Aten, SomethingThere3351, Mitia, 7rau, Hadron, Mindustry, Biblia, Floria, Sisydea, Avaritia, Yellorism, Stavoria, Дерьмания, Molb, Morbius, 𓁹, Eme, Valoria, Zotovaria, Varashia, Molovarashia and Dinia to colorful chat
      Added a border between chat messages to prevent trolling
      Added {k for obfuscating text
      Fixed lone closed curly brackets } getting deleted
1.8.1 - Fixed a bug which prevented the script from loading
        Added Orssu to colorful chat
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
        function randStr(length) { // Used for obfuscated text
            let str = "";
            let charList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "$", "¢", "€", "£", "¥", "+", "-", "*", "/", "÷", "=", "%", "\"", "'", "#", "@", "&", "_", "(", ")", ",", ".", ";", ":", "¿", "?", "¡", "!", "\\", "|", "{", "}", "<", ">", "[", "]", "¶", "µ", "`", "^", "~", "©", "¦", "¨", "«", "¬", "°", "±", "´", "·", "¸", "»", "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß", "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ", "Œ", "œ", "Ÿ", "ˆ", "˜", "–", "—", "‘", "’", "‚", "“", "”", "„", "•", "…", "‹", "›"];
            for (let i = 0; i < length; i++) {
                str += charList[Math.floor(Math.random() * charList.length)];
            }
            return str;
        }
        setInterval(() => {
            let obfuscatedElements = document.getElementsByClassName("obfuscated");
            for (let i = 0; i < obfuscatedElements.length; i++) {
                obfuscatedElements[i].textContent = randStr(obfuscatedElements[i].textContent.length);
            }
        }, 100)
        function mdParse(str) {
            str = str
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
                .replace(/^\[ \]/gm, '<input type="checkbox">')                                                                 // [ ] -> Unchecked item
                .replace(/^\[X\]/gim, '<input type="checkbox" checked>')                                                        // [X] -> Checked item
            while (str.match(/(?<!\\)\{([\dA-F]{6}|rb|k)\s([^{]|\{(?!([\dA-F]{6}|rb|k)\s))+?(?<!\\)\}/gi)) {                    // {c --> Color, {rb --> Rainbow, {k --> Obfuscated
                str = str.replace(/(?<!\\)\{([\dA-F]{6}|rb|k)\s([^{]|\{(?!([\dA-F]{6}|rb|k)\s))+?(?<!\\)\}/gi, match => match[1].match(/r/i) ? `<span class="rainbow">${match.slice(4, -1)}</span>` : match[1].match(/k/i) ? `<span class="obfuscated">${match.slice(3, -1)}</span>` : `<span style='color:#${match.slice(1, 7)}'>${match.slice(8, -1)}</span>`);
            };
            return str
                .replace(/(?<!\\)\\/g, '') // Remove lone backslashes
                .replace(/\\\\/g, '\\') // Halve each backslash pair
        }
        let helpBtn = document.getElementById('help-button');
        let chat = document.getElementById('chat');
        // localStorage
        if (localStorage.CU === undefined || (() => { try { JSON.parse(localStorage.CU); return false } catch (e) { return true } })()) {
            localStorage.CU = `{"chatOnLeft":${localStorage.chatOnLeft ?? "false"},"chatUtilsUpdateNotice":${localStorage.chatUtilsUpdateNotice ?? '"1.7.1"'},"maxChatBuffer":256}`;
            delete localStorage.chatOnLeft;
            delete localStorage.chatUtilsUpdateNotice;
        };
        let ls = JSON.parse(localStorage.CU);
        function updateLs() {
            localStorage.CU = JSON.stringify(ls);
        }
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
            }
            #chat-messages>li:not(:last-child):after {
                content: "";
                position: relative;
                left: 50%;
                transform: translate(-50%, 0);
                display: block;
                width: 95%;
                height: 0.9px;
                background-color: #80808080;
            }
            .obfuscated {
                word-break: break-all;
                word-wrap: anywhere;
            }`;
            document.head.appendChild(style);
        })();
        const replacements = [ // Colorful chat replacements
            // [regex, before, replacement, after]

            /*** OTHER WORDS ***/

            // Colors
            [/\bRED\b/gi, "<span style='color:#E53B44'>", "`${match}`", "</span>"],
            [/\bCRIMSON\b/gi, "<span style='color:#9E2835'>", "`${match}`", "</span>"],
            [/\bORANGE\b/gi, "<span style='color:#FB922B'>", "`${match}`", "</span>"],
            [/\bGOLD\b/gi, "<span style='color:#FFB735'>", "`${match}`", "</span>"],
            [/\bYELLOW\b/gi, "<span style='color:#FFE762'>", "`${match}`", "</span>"],
            [/(?<!UNITED\s)\bGREEN\b|\bGREEN\b(?!\sSTATES)/gi, "<span style='color:#63C64D'>", "`${match}`", "</span>"],
            [/\bLIME\b/gi, "<span style='color:#B1D657'>", "`${match}`", "</span>"],
            [/\bBLUE\b/gi, "<span style='color:#3AB2FF'>", "`${match}`", "</span>"],
            [/\bINDIGO\b/gi, "<span style='color:#0484D1'>", "`${match}`", "</span>"],
            [/\bCYAN(\sREP(\.|UBLIC)?)?\b/gi, "<span style='color:#2CE8F4'>", "`${match}`", "</span>"],
            [/\b(MAGENTA|PINK|FUCHSIA)\b/gi, "<span style='color:#FF41E4'>", "`${match}`", "</span>"],
            [/\b(VIOLET|PURPLE|MAUVE)\b/gi, "<span style='color:#AB80F9'>", "`${match}`", "</span>"],
            [/\bBROWN\b/gi, "<span style='color:#B86F50'>", "`${match}`", "</span>"],
            [/\bGR(A|E)Y\b/gi, "<span style='color:#AFBFD2'>", "`${match}`", "</span>"],
            [/\bWHITE\b/gi, "<span style='color:#FFFFFF'>", "`${match}`", "</span>"],
            [/\bBLACK\b/gi, localStorage.nick === "SyntexPr" ? "<span style='color: #FFFFFF; text-shadow: 0 0 10px #FFF, 0 0 10px #FFF, 0 0 10px #FFF, 0 0 10px #FFF;'>" : "<span style='color: #000000; text-shadow: -1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>", "`${match}`", "</span>"],
            [/\bRGB\b/gi, "<span style='color:#00FF00'>", "`<span style='color:#FF0000'>${match[0]}</span>${match[1]}<span style='color:#0000FF'>${match[2]}</span>`", "</span>"],
            [/\bCMYK?\b/gi, "<span style='color:#FF00FF'>", "`<span style='color:#00FFFF'>${match[0]}</span>${match[1]}<span style='color:#FFFF00'>${match[2]}</span>${match[3] ? `<span style='color:#000000'>${match[3]}</span>` : ''}`", "</span>"],

            // Other words
            [/\bTREE\b/gi, "<span style='color:#B86F50'>", "`${match}`", "</span>"],
            [/\bGRASS\b/gi, "<span style='color:#63C64D'>", "`${match}`", "</span>"],
            [/\bWATER\b/gi, "<span style='color:#3AB2FF'>", "`${match}`", "</span>"],
            [/\bLAVA\b/gi, "<span style='color:#FB922B'>", "`${match}`", "</span>"],
            [/\bFIRE\b/gi, "<span style='color:#E53B44'>", "`${match}`", "</span>"],
            [/\bEARTH\b/gi, "<span style='color:#B86F50'>", "`${match}`", "</span>"],
            [/\bAIR\b/gi, "<span style='color:#AFBFD2'>", "`${match}`", "</span>"],
            [/\bCOAL\b/gi, "<span style='color:#000000; text-shadow:-1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>", "`${match}`", "</span>"],
            [/\bCOPPER\b/gi, "<span style='color:#E77C56'>", "`${match}`", "</span>"],
            [/\bIRON\b/gi, "<span style='color:#AFBFD2'>", "`${match}`", "</span>"],
            [/\bAMETHYST\b/gi, "<span style='color:#B38EF3'>", "`${match}`", "</span>"],
            [/\bDIAMOND\b/gi, "<span style='color:#4AEDD9'>", "`${match}`", "</span>"],
            [/\bREDSTONE\b/gi, "<span style='color:#FF0000'>", "`${match}`", "</span>"],
            [/\bEME(RALD)?\b/gi, "<span style='color:#41F384'>", "`${match}`", "</span>"],
            [/\bSAPPHIRE\b/gi, "<span style='color:#412BEE'>", "`${match}`", "</span>"],
            [/\bRUBY\b/gi, "<span style='color:#D41E37'>", "`${match}`", "</span>"],
            [/\b67\b/gi, "<s>", "`${match}`", "</s>"],
            [/\bMINDUSTRY\b/gi, "<span style='color:#6E7080'>", "`${match[0]}<span style='color:#989AA4'>${match[1]}<span style='color:#D4806B'>${match[2]}<span style='color:#EAB678'>${match[3]}<span style='color:#FFD27E'>${match[4]}</span>${match[5]}</span>${match[6]}</span>${match[7]}</span>${match[8]}`", "</span>"],
            [/\bTAUM(OTON(S)?)?\b/gi, "<span style='color:#EE00FF'>", "`${match}`", "</span>"],
            [/\bCOCA\sPOLA\b/gi, "<span style='color:#E53B44'>", "`${match}`", "</span>"],
            [/\b(?<!:)(NUT\s)?WUJING\b|沙僧坚果/gi, "<span style='color:#A98828'>", "`<img class='emote' src='https://cdn.discordapp.com/emojis/1450183287598350366.png?v=1'> ${match} <img class='emote' src='https://cdn.discordapp.com/emojis/1450183287598350366.png?v=1'>`", "</span>"],

            // Countries and regions
            [/\bROM(A|Â)NIA\b/gi, "<span style='color:#003CB3'>", "`${match[0] + match[1]}<span style='color:#FCD116'>${match[2] + match[3] + match[4]}</span><span style='color:#CE1126'>${match[5] + match[6]}</span>`", "</span>"],
            [/\b(HUNGARY|MAGYAR)\b/gi, "<span style='color:#477050'>", "`<span style='color:#CE2939'>${match.slice(0, 2)}</span><span style='color:#FFFFFF'>${match.slice(2, -2)}</span>${match.slice(-2)}`", "</span>"],
            [/\bMAGYARORSZ(Á|A)G\b/gi, "<span style='color:#477050'>", "`<span style='color:#CE2939'>${match.slice(0, 4)}</span><span style='color:#FFFFFF'>${match.slice(4, 8)}</span>${match.slice(8)}`", "</span>"],
            [/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)(RUSSIA|РОССИЯ|POCCNR)(?=\s|$|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)/gi, "<span style='color:#0032A0'>", "`<span style='color:#FFFFFF'>${match.slice(0, 2)}</span>${match.slice(2, 4)}<span style='color:#DA291C'>${match.slice(-2)}</span>`", "</span>"],
            [/\bGERMANY\b/gi, "<span style='color:#595959'>", "`${match.slice(0, 2)}<span style='color:#FF0000'>${match.slice(2, 5)}</span><span style='color:#FFCC00'>${match.slice(-2)}</span>`", "</span>"],
            [/\bDEUTSCHLAND\b/gi, "<span style='color:#595959'>", "`${match.slice(0, 4)}<span style='color:#FF0000'>${match.slice(4, 7)}</span><span style='color:#FFCC00'>${match.slice(-4)}</span>`", "</span>"],
            [/\bFR(A|\*)NCE\b/gi, "<span style='color:#0000B3'>", "`${match.slice(0, 2)}<span style='color:#FFFFFF'>${match.slice(2, 4)}</span><span style='color:#E1000F'>${match.slice(-2)}</span>`", "</span>"],
            [/\b(PRUSSIA|PREU(ẞ|ß)EN)\b/gi, "<span style='color:#000000; text-shadow:-1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>", "`${match[0]}<span style='color: #ffffff; text-shadow: none'>${match.slice(1, 3)}<span style='color:#ffd500'>${match[3]}</span>${match.slice(4, 6)}</span>${match[6]}`", "</span>"],
            [/\bPOL(SKA|AND)\b/gi, "<span style='color: #DD0C39'>", "`<span style='color: #FFFFFF'>${match.slice(0, 3)}</span>${match.slice(3)}`", "</span>"],
            [/\bSLOV(AKIAN?|ENSKO)\b/gi, "<span style='color:#254AA5'>", "`<span style='color:#FFFFFF'>${match.slice(0, 3)}</span>${match.slice(3, -3)}<span style='color:#ED1C24'>${match.slice(-3)}</span>`", "</span>"],
            [/\b(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)(CZECHIA|(C|Č)ESKO)\b/gi, "<span style='color:#15579d'>", "`<span style='color:#FFFFFF'>${match.slice(0, 2)}</span>${match.slice(2, -2)}<span style='color:#D7141A'>${match.slice(-2)}</span>`", "</span>"],
            [/\bEUROP(E|A)\b/gi, "<span style='color: #003399'>", "`${match[0]}<span style='color: #ffcc00'>${match[1]}</span>${match[2] + match[3]}<span style='color: #ffcc00'>${match[4]}</span>${match[5]}`", "</span>"],
            [/\bEUROPEAN\b/gi, "<span style='color: #003399'>", "`${match[0] + match[1]}<span style='color: #ffcc00'>${match[2]}</span>${match[3] + match[4]}<span style='color: #ffcc00'>${match[5]}</span>${match[6] + match[7]}`", "</span>"],
            [/\bROMANS\b/gi, "<span style='color: #AA080B'>", "`${match[0] + match[1]}<span style='color: #ffa50a'>${match[2] + match[3]}</span>${match.slice(-2)}`", "</span>"],
            [/\bROMAN(\sEMPIRE)?\b/gi, "<span style='color: #AA080B'>", "`${match[0]}<span style='color: #ffa50a'>${match[1]}</span>${match[2]}<span style='color: #ffa50a'>${match[3]}</span>${match.slice(4)}`", "</span>"],
            [/\b(ROM(A|E)|SPQR)\b/gi, "<span style='color: #AA080B'>", "`${match[0]}<span style='color: #ffa50a'>${match[1] + match[2]}</span>${match[3]}`", "</span>"],
            [/\bENGLAND\b/gi, "<span style='color: #FFFFFF'>", "`${match.slice(0, 2)}<span style='color: #CE1124'>${match.slice(2, -2)}</span>${match.slice(-2)}`", "</span>"],

            // Border names
            [/\bLIMBO\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURQo5VBVwqArQlSzy7vDaOZYAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAASZJREFUOMttkgGSBREMRFtcQLgAcQHk/nfbZv7Wbo2vahjzppPoAN4jVHQ+rTui1wvDn0U+yL0MlDjVu07X5W8OnenvQyiqfUDjyl6OQN+cIc342hcnMz8ZWpzNi3sHM7w4l6kVMiInLdzucuKAl1kouHnARIalYGgoSP8FRdfNkTJK7bktmWiBGbz5dkl8HJfeHFKgo7e8omJ+sfHiQmeGp+CRjjwCxlEF0kfw4hIbP9DhqHk8guqr5e7yCF48CKZ1Hn8uK6gJCsEIuaWIys3FwbOZaRU14yl3fP4aWk6U7RwXnzTNWgqZDWqMlIS9Zr2cVg03Z19StJ7CshF2ZwQtYZl1hMyiLg7m5/3Yg7aMXZL0c+N8VfnGT8JjZj63Zpv6O9LNfwDPsDQ6wZvBIgAAAABJRU5ErkJggg==" class="chatImg">`', ""],
            [/\bOBLIVION\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURQAAAKysrICAgJ4oNeU7RDSL0DwAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAARtJREFUOMuV0lGShiAIAGBGT6BeAOkCGtwA73+mBaym3X3Y/akMiU9rJoBPo+yo5R31HvpV6Hde4fW0MU9mblzIkkmN/fC08HmhC/QY2lpTljbtJFOY2NKozS4Oei2doNQAVAs19b4APEVJ1HbwmoNaDfQNrN1Af4Pa2QCXdHjtDJA6BaAA+A0gz6Ys82ADp+gDCA2guYJ0gaWHEsjZFq95aIB1yiAyQAmhOkgdbRLbsy2aDBy21w1EDWBKSAmA0HsJkGCvphugAcob8JKBDtIG1m4gbcAvkLJmrw1ZBiBBAPgLDBn5BrBBshEekJWtB+3lHgB2QrQDIPhGkee1/Bvs5j282MGeBPgVmXnYvxS3YTO/rgmPf//NP+MLZABWizJ0KUoAAAAASUVORK5CYII=" class="chatImg">`', ""],
            [/\bARCADIA\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAwUExURQAAAP8AAP9VAP+SAP/AAP/+AKT/AFVVVQD/SgD/zQC+/wCA/yEA/6wA/9oA//8A0CK0ZI4AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAJVJREFUOMuVksENwjAQBPcDFyf50AIt0AIt0ALv/NwCLdBCWqCFtEALtAAXbO8Ffjv26UbW6ixLBlQOIjiK4CSCswguxB+0+yuebVJXYjnvf2uiRwo3YrCuFLrmsOKRwp34pORTk6Xqq63bPVKYiU/qS6Fv7jd8e6TwIDbUlXPtEz1SWAjGusC+NN+kniJ4ieAtIv/uD0cKCqWhgX+MAAAAAElFTkSuQmCC" class="chatImg">`', ""],
            [/\bPURGATORY\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURQAAAOLi4rm5uZCQkEjWg78AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAKVJREFUOMu9UEEOAyEIBP0A/mDDfqCR//+tMGDWJu3BSwcMyu44I0SnGIf4A0GBi6gh6MfyyD9LQcZgIOq3hU9QSIlLuCHoWcT0nD1SgCQJYyQhqluIatwn9+yRSBJ4EYRKQZqL41ZFZu/FNIuwLNnc7cTNINT55l5vXlNyIdgpC/AcWT2tJzhjjTXI22hjjJHb/oNwm6qZTURVjdz2RbBDnBNO8QYr6TfVIF/BsgAAAABJRU5ErkJggg==" class="chatImg">`', ""],
            [/\bDAMNATION\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURfuSK+U7RP/nYvW7CgAAAJ4oNT8oMigaILh8MN4AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAANNJREFUOMu1j8kVwjAMRAUVQHgUQKgARAPEyx3zoACW0AG0j2ZkliM58GMrGmmkvIj8nclAZATGbbsY8S4QTLtq7e0ZSkSmoFHV17WwarSrqquZleicyhx4K7KJsKcKqhsfYCnRKjtQYK7NGkylmcbms2hLqxxAgXm9tEYIdcBUKjjvRYlWuYITzVie0A3+mVxw6iIboFWOoNCM5XBodpVOOMEX2Tyt0oOz/V5QPPnMsKm5ZZk9JLT6QB9jxM0x9x6oemYX9JB8D/yO3Acit4HIYyBPxTW3XqdtH+cAAAAASUVORK5CYII=" class="chatImg">`', ""],
            [/\bPARADISE\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAQBAMAAABzZ+XyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAACzo9P/nYvuSK////6+/0gSE0XqUtCCWJngAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAR1JREFUKM+NkjtuwzAMhn+93NUGcgDCvoAQXUAD3dkFombVUHjOEMDXLyknbdPJhB+fpU8kZRs4GsPBULEHjBD+gR4wgjq4i+NIejGvYNtNzvFHJCRjycUX8NbbCAj+ZqTBGVkf8xN6OjkVTZvce2zMVuYzZa0nIsmIii5Cy5m2D1mQCVOwACkYhYe4pGT6KaloEQfOU4qzTWdSGBR2MTBauyo6mBNLIs+SKC5tMwI9XVScP7Td1mKPTxaRmW1YRNREXY2VimzFl7VSpVXiq+D6R8yP1rTeJBkBG/fXwzPKxjmK6FSMIirUlOLFBZdSJ5g6mUcpW4ZCWHADwytkIBS83YC1yif0u3jdWGMugnd+xly27c7v2l97PPyXfQOBOkQnJXD4WQAAAABJRU5ErkJggg==" class="chatImg">`', ""],
            [/\bNIRVANA\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAAN2D8/OL/P/nYkAAgP///6hR/4AA/4F+am4AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAUJJREFUOMuVkjmWgzAMhrmCDI/UyDy7Hps3fYhyA3KAuJBrKPD1R5gMeJYmcuH196etqt41gG746ABA4Wnee1dsEU6rQNV0U7KqtT+NbsXG6x+CbriSIGrl9lv5UA/TlOf9xLkaGiK6ZoEAmiYjSo+EUPgkHtNDRhZsgIwAgxgYDQefY9COw3aAHDpo7hPdpw1RCeBKGWGCCRE5sSPyA42fiQ1zMIlF8BDBQwSqEkDTZETLJqzIMvrRO0LrmHkNFplPQVcQWvlOnnNER7ofnSzXaIJM6VkQzhjamAWJtetvhN5E3rzkyDAfgiJLzzasQbxGluhpRC1vRSBOMZRBf9cBVp4v4kPENSL2kkzL0Sw2XjhCmdaj0pcEkOyyoF2kZFv602KxmyHNcnsW7uil3V4dpf820dEaglC/T9V/T1+Cd+0LG618W9f1xygAAAAASUVORK5CYII=" class="chatImg">`', ""],
            [/\bRAGNAROK\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAAP8AAP9VALAAAP+DAP+5AP/2AP/8tvJ2gkQAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAUxJREFUOMuVkl2uhCAMhZuwAt0BjAtAq8474gqU2YCxLOAmsv17qhkzyb0v0x8oh6+kJhJ9a5VaXf01+48Gjqy1Ve1Qwt+hmoYCWmM/F93JWVc5Z5m7irl9MPOjdY5bh5O9lI5b7uq6thYwOdCueRCZO41zvvtQOt/73rnmDAohuDU+DJt3LtQ3vptuRXE0hBhC4wLFGJtmnsyEq8ksyIlM9L0qlwMf/ABuDXOMtK5rnJO+d6W20OD75VaAQ4nrfAbNKc1zWoh4wsRAeDEeEBSj6qINZFJaz0iU0o5YCLPr/AYYQD9s59eo4kc8ML4UfKWdkkja981suNJVEfE0Xuflahi1AaDsO4nILnI3YJDNyKYNm/m5lNE//SgXKCQ5Y9v47YyUws8PZYQ/RbIcCJKjHEc+ci5S8lFyOeujQNVD0TprjUKQVL60r//uX/VJkTvjyKq5AAAAAElFTkSuQmCC" class="chatImg">`', ""],
            [/\bOLYMPUS\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURQAAAGPGTeSmcv///2yr0bhvUD8oMnQ/OWdRQb54c88AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAR5JREFUOMuV0kFOwzAQBdBcwRB5X4PcdRiJvdtRbsABQqPB6xzC8rH54wk0EWHRqapft/PkuJ6ue7TcU0C9OMtXTod5cvRm2Tn3gSJn+UxDS+a0S+eINAcFFAKhz4nIJDfyEsWLVhQhhP6gQPsMnJcGcq1TBiix+IoqsdZbFl2UBtDXwFVBApD8C4rgFUs2gB16vgPGB2aALwM1A7wX/wOwdVGAvmv6A2Yacv1cgT2Si6KA0YcuA7wByZfFl7HtIKTgvOTpf8BbQEegN5D00HMW2QJmPbRIPQa1zjgf70G1v5XvgDmEBnA/M97sJXgZRS+QeZRJb7EB9DVgI8DrKHBb4wlSWycbGbd+D9BfbMh4HTa+7DLZUJ7WNYbv0foGpWOxkn/yUekAAAAASUVORK5CYII=" class="chatImg">`', ""],
            [/\bEDEN\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAAJza///////wm//nYjJzRT2OVWPGTR4+ICMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAARNJREFUOMuVkrFuxCAMhqFNwkoiZU95AqT4ASodD5AbyJzlyMp0fv3aECLS3tD7h9g/+LONFCHeVU8yxqTvV19rOG19k4CBAJ15maOsfW8mOvgDzEkyR1t7aab5CvBIDUdHcCyp7entMMEVYGn4MDlSWcOAOby7EfUKSB3bBaQx+jLB2ddA2rnb+I6B8gZo3E3UgPccxyXvriLdeQbKW0DQCJD+TkVUKsYQOF23vBIDPiyuPVaiFRWNcG143Mc1+F6siJzuETp87oiRwU/XLTYERHxuoCJNosvHumPwgmpSGs8JtDk4tdniFTa0KqZ2GAQiHp3TI6mAV//GOBevMCYgS5QkiqNjDpWnWj74DfxXb//dP1QmeY3eT1cEAAAAAElFTkSuQmCC" class="chatImg">`', ""],
            [/\bUTOPIA\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAAAAoU7m5uX5+fv/nYoiivgAADt7JfLMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAQZJREFUOMuVktFxwyAQRGkBUYFBDYgTDQg6uNF/+q8iuwdCjseeJDc+n9FoebsY5/5b/k0tEfXwbwuC5fodxMsmYi0VM2B69ieBxrKV82RrRYfeZzZah7rlhgc9yiZFchHRpKJBVIJK2R90uTa+6mJbbTkIGZ9WcjIBnngKQFjaAQEkFCBhO2CNhLxSs1ezZAJY2uMoSJzNw5ZpEihQyZPAN0mIJHQpli1NglnCNtiCu3SCWWpmiQQT/MiAZ1X7LkYwS3cGs/ScYRKOmxCfMhhBBgHHWkFIONaOHRnaSwb+R0bACTFDsnlluE5pZGDhFuArN16NJCTYlJkhzgx/r5e7+/Xr7f4G6ZJzfWnCnfcAAAAASUVORK5CYII=" class="chatImg">`', ""],
            [/\bEKA(-|\s)LANIAKEA\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAAA8THCcXPlEdcP///5csnthWuP+Xv5gokeAAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAPFJREFUOMuVksEKwjAMhvcKWdt5Hj6Bog9QFvFclN0HE8+C7PnNn5bNjF2WHhqSfv2bpFW112inCVCbwMnm3QYgMWb25D1zpBQJeySKsi0J8ZQWIEiOCHE4gwA4DF9W43OCEA4ZaAoQJd71U/cP3N7jRRMUW4+TAA4ZYH2KKuAFer++lXEDvOv7daLq2H+nB3NRyDXILhKKBI8E8LRSuOQaUK4CPmu4uYZhVcOzFE0FcFmBZuDjbZfGFRAMUF/v9/G8zCG6/vuwQLOhsExaWjArYFQCHHRwBYA3zEC2ZD6A9q41oUQWWP0h9M5aObD7d/8AJ7dTcuHcbqEAAAAASUVORK5CYII=" class="chatImg">`', ""],
            [/\bLANIAKEA\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURQAAAAAADv/th////yFmTPkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAONJREFUOMuVkoERwyAIRbFZAJigOgF37L9b4aNeml6vKYmJRJ4/IERna/Tb5E9bAMck+XhzPGIjjFai+aFFlG6gs4kc7sbW2Dgn7t6OvJbTRUafgA4ARLGUABmxUQRjEJzH+FQAEKuCG8EWGlJOXzlgEiG9xA3RWr/klNuUs5LWUYAOKJhTAuO5FXw6tfWbQv6+RQAUTHYO5dTWu6yZAwCmmYMcVSXkIKWgE+gnQPgrkHWlqmrWoRWgq6wLQFkncFLAMSUQGeLgNrCca2tkG2RXaLUGz8aYrSF0Ae43Xxnf6OuyF+/mL3AHNsf6AAAAAElFTkSuQmCC" class="chatImg">`', ""],
            [/\bELYSIUM\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURQAAAP///+VwRPvUOR6QVZDx+K7+XZpKS//l76hNuvgAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAS1JREFUOMuVkjFuwzAMRX0FGeYJeAJLtds1hXIAGiayCyjjC7TonCHn7qfkBCnQoaEAi/zk49fgrns2wpPxG+DU7sM/gX7sx8B/AA91J4FwAtEQhIlCH0cZskshCOrB00OdCYIDYICM1iDCSsT9JGsmkmUUlORdrwkUAOlEIJGo5oMyT+pAzkcSFgc0H1XugDgAibQB7xMrLxNnPjIkiA3wBTpkrAWgLiHWnJvDEhFO6k12QB1Q7Oiq1DorIwMwcVpiMwP94j0MVOoBgFEDfGxm4/Y6BHqfN0D1/iQ9YRhZHU9zSanMXCph9mW7TQVOamZXO5uVyR24xDcYlAQgxlcuM/pbs3EAk1dzyezMCbsxDXa2K8d0ifCqbbNv2z4AbLXYtf16TLf7pyVP/90/dyiXyQCDav0AAAAASUVORK5CYII=" class="chatImg">`', ""],
            [/\bCAMELOT\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAhUExURQAAAFKk3P///5zExIt/c1VNS2B+iR6QVZpKSzNjr0LMOc8JdYAAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAPVJREFUOMu9kbFKxTAUhiuBi6NHAtc1wQcIFO5e+DO4p3tBuLtTwcn7Di46u9in9D9NkyCo0MVvaJLT/zs5pV23F9lJFW5dXtZidyVy83OzWvTeqeQdH8aoEAJPIq509N8ET1izwD0GY3TYECw8tpwGXBG86ioAKY4ADo+mP02nidsIDLl/E7jPDSxijGNMMP1hMqEPjKc0pnJDHUnV4yxiR8Yje5qzuX4J5yxEiMxP7aM1yYIuHIhp6A0q6A2MV2FNVkEuYqHzk4fyj17zeZA7aQKTooWLYGP5fNt4X8hHEdZkEY4zWX6D75owN57/ECr/IOzlC/PRsYQzn6TUAAAAAElFTkSuQmCC" class="chatImg">`', ""],
            [/\bLEMURIA\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURQAAAASE0WPGTXQ/ObhvULu6x28AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAOJJREFUOMuVktEVwyAIRbOCcQJhAsENZP+ZCi8aTXP6Uc4LJS23gHIc/1padlJY2eJld9IAVGs4VfEIEkiFWJUIv+9AsxrOTDyCBLJOjMf6Dpwpx3vu2oS7f5KLQ2pCzeVB9TYnQDQAYmH/45EdajIVQLkADzwXFSQ6sAXMCgASrRkcoJR9BE+yfgMxA7JVW30MzQBQoTd9V/DjeABnADQc83uG7woB+LzTQXkHampSni3hROGu7rUtoLyBcWc27gtdh1PrDOV5c/dqXJswNgILcVJ8oQxl1QeA2/tt24b+vd0f8NhkG/eRgwIAAAAASUVORK5CYII=" class="chatImg">`', ""],
            [/\bMIDAS\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAAN21M8ShLeVwRP/qaPvUOdewFYg7kxkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAPlJREFUOMudku1xwyAMhr0CvS5QsAcIWBnAhwaIkTxAarL/CBWf4V+TiBMnuPdBCDRN75r60tV+1CvxB4DuppRLZqtrbZzVEqhRU4B5LwCwmIXqGjgkV6OmAIQVcDLSZGUKhp2QLUPVZGD2dC+AhRXWO8jhFxNM8LJhtRo1GVgi7Q0AWPcOONkIJUPTZACPiE8AsAFSULqaGjUJWBD9YyuAlLA+hgzXzWSgaxIwU2SuwExD0SHKwmWgaxLAkZjPArBo2rOGQGmRga4RYInoD/Rb+jiI6K7145Zf5yVZftanRlrjZKbDM6UW+D+e1Pfp8STGeFOvxG939x+0GoGFY5R8XgAAAABJRU5ErkJggg==" class="chatImg">`', ""],
            [/\bARMAGEDDON\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAnUExURQAAADNjr1Kk3JyKkOVwRKw5QIovQ2glRpDx+B6QVULMOXeDPa7+XXzHMaAAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAWtJREFUOMuV0rFugzAUBVD/AmyRumBkqcqIwUtHLNhBJlIymnhhJcreqc2WtWOlSKmbrYIhTF2rfFQfThyI1A65o/2ujvADoXvjQFzHxRj72KeUhjTk18Q0hqMAB3DtOV4/awow3zfySFBGGQ9LnvJ0XSvJlaQ0oxnOsIfNvDMSCCE0Z6UKk4TXdcp5mcQyoVEUiCAbBO8qEBL5EZOKswSAvhCXkso8yMUguOh1OxaiswDTfYFLGcucZpCLMHlDm60VMiuUtmCFvnAWJnukP6yQG4GxsPxfmL6gzftYyKHwh0Cs8LhHG88KQhB4VhCUSnmdrkdCZAVXo2fvIhBsBMqSMEnTm1ca9uBOzbMagfjmG57aVhQzMZsJsRRV9WWEYQ/usOmd3jVd03ZtIQqxWvWFQlRt1zTdXM9vN/1w+tEaCjtTAEEAsV6p5UJVXbc4QkHrw+nbFE59YB7y2fVpxCgLc3Q01wczevff/Qs4hrpiREO30gAAAABJRU5ErkJggg==" class="chatImg">`', ""],
            [/\bVALHALLA\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAAJpKS2glRmB+ieVwRJzExPvUOUoZLHGFz4QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAKpJREFUOMu9ksENwzAIRbMCbhfgRxkg8Q7tPZEn6f5S+Ti2bFc95BKwEF/mSYCYpqsmbioSROAJs0FZ1FwoJwC+AGXin70yjZuBFRog2QvQKgtlCAOe8ji2OcYIc5qLQZ3mwOv9OfYlpQRz2g60aknVjgFAB+AXWLuWNiuZaxO9qh2VobkFGytoHbpTeYvtWm8A/J8lgDYAlYU/AI+Q3358VQkpLUcol6/7C0kjUx54RfAVAAAAAElFTkSuQmCC" class="chatImg">`', ""],
            [/\bATLANTIS\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAABi24izo9A5giJXnq////5Xz+QSE0UzQFeYAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAATFJREFUOMuVUsuOgzAM9C+YVHAmrLibqOy5VbR8Bw9xR6qU39+xk7LVXnY7AZNgz/gBRO+Cmf0/0SKWlcCVnWG7MBRnN/wO5wyKnCmtmqGDB6HBX9cn00KrLM8cKd74hKsGI3RexpWdleH4FZdI+/xzFCzvhR2LEx7FRHDlzQFT7zRvZwqnlCDiQMhHdgH764rdkUC43Gb62l8SsEA+KONECDwqoUmcuK43qhetKakHkSyWBzekndYipaTGZrMv1Pc6p3RYHOQKQakiViQXA9HY93RfKj5QoEm70ol2r+mMoKnwaNBDtWzUY86p+ZSTIKX7TLCXttMh+b4lzDpOKdlITc8yOCzTh1DQWsU+AoLJf8T4mKbDBZssPGhE45/qgXWhfsXdkz0fceI/EAve/ru/AW6VWHJ6+rA2AAAAAElFTkSuQmCC" class="chatImg">`', ""],
            [/\bAVALON\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAhUExURQAAAP///9ff6Czo9JXz+fuSK//nYmPGTa+/0k9ngQSE0U+FMvcAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAATlJREFUOMuVkkFugzAQRbmCkXIAjLgAJicAqd2CNV6wn1l0XdU5QnoQuvAp+8eYlC4Zycr3n/88kyhVdbVMqaZ81sa0btIamnLfu3ugqbJT03wjqjsiQ7N1o+bHscfdNgYdPRowNQCQdR3mTri9C9uwtG4Y8gSHu+ttEFluwggYa/vK6jRNB+9c8Jo5gMGpdxcKeMe7sNjWuQpPWNsxu8Do+TuU5mPETjvAfYfnOF8U0AqsUfSyGsfpLcZPzNiB7Iv/B3hdxudn4E/Te3zoiBMQ+AT8ZbPCSo/nEyPOAMkZeG2T1TDFx/cT3+K8ksdSGUiowGmTdWMuSiTGLxFJYU20wUJjha/ZHVhTdrio9IO0fEAS8aY/q5rhBWhyTx+q1AYMtog2ip8BonxoPdQBEBUDp/hVuliX/92/5ujtgKiDYxEAAAAASUVORK5CYII=" class="chatImg">`', ""],
            [/\bHEAVEN\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAAJXz+Szo9P28Rv/nYtff6PuSK////9bLqqAAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAV9JREFUOMuVkkGLwyAQhQcxerZh7yaQHxBCydVD6DnbILl6KJ4DRebv7xvbLr3tdtDkjc43zwSJPg3nTqe+x/grOozOOXKj6x71nnpS0gNKQXrySJSIJ3FyraPJjbAQwodeK70seMlUPvhlWZQmbNT6rmvdRG5yrtYPa4gG20R+oawAJB/goINPMVbCoZhc21aHYT8CA7Ac19CbJ4A6nSgxx+owjo5aPMRh5yOQFgeIq67AGkgN+iYAX/t4RfORMKsDgEteGp3Tk2zWhJVm16YCZeDyje4vhyHiSGSa6lBJeySsWNYUBOAd0JsD0iMUY/EN4gAhDqEwgFsqkYtAmzicz/H6FVnq9hcAYYIGwAKYtEt/OGwbgG3mUlP5S3IkEmGP28XCitDC4EhiUPb7fKZtemQAEupMzqkKRtmRc25MQ6k2lJhmur80H8Rk5WpUwQcGEksW+W/Mb/p/8fHt/gHL2Zifr8iNpQAAAABJRU5ErkJggg==" class="chatImg">`', ""],
            [/\bSHANGRI(-|\s)LA\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAtUExURQAAAJXz+eU7RJ4oNf///6+/0sExPOSmcnQ/OUdHWdff6D8oMk9ngWPGTcmyolMFqZMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAVJJREFUOMuVkj1Ow0AQhX0FokDPjBKCUJpZ0VCvJQqamCxKEZogfIMoVUpQiigFR0DQRNBwBA6QIv1wBJ+BN5vYcQqQMpbmx37fvl3bSXJoHFXRINoNsa/fKKMOOKkEDUYf038AsZyWvaCPCUPT7wO+mokrwKGPCYNPfR1opv00+N6JneHP6PtelB/7JE1DjDus6pidiBUkx8KWYgeByVGSsI38MYOCmMQKMSMJWeccGTCZjMMOuMwf8pFABAeUVgaXTgb2/IVsEUg6nVYNuHVXThxBxlZa0AKA28WX2zrM5081ICyXy1c8xy5wwQHrno3NR0qH2WwP+PA375m9jwwXYUv4itM1cfubHQDVn6IoVNWAe1R9u/afGraD6hoLy1RJ2vFkBqwWK3uSbAQbYDgYloC9G1Wm55HYGcxhUdSBGGFQOig210Xu6jp+uJ3m4L/7F6ffvbi5cw9BAAAAAElFTkSuQmCC" class="chatImg">`', ""],
            [/\bEL\s?DORADO\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAkUExURQAAAEqcSWPGTf/zsP28RnQ/OfuSK//nYsExPDJzRZ4oNT8oMjEAaJ4AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAVtJREFUOMuVkjFuwkAQRfcKa2GklN5ITm8k90QWgRIpadIBzjjmAF4OgCKntyy5jwgniDhe/h+DQ0p+8T0zO887AzbmVlkbTKDEOasKrJtc5KJIKwEMUcAeAO6e/TxSximQZQScZTlkc2J7yrzYQKCVCN9lx4g3E1iewtaOR1pLGAEy4dIW3vtVUdkQeYxY0oI2RGNGMSOrIynwVlRRiAHGXooqpc1o8WB60ANhgdsAJOHywcd+LQDy/8BKAKAFW5pMb6iWReXC53k985v0ApznQm/ZIiUQZGb0GPEG7mBfj6eD31zfkPbTlIK0RMtoauxUd0Amsj3tfq52ANoSbZl+0LoGO0zvegC2/faH4bepOEg7DHdgrWs60y06/g8lLccOjFnJZ1K20kouwtr7UQ8IQPt6/8lnXR9rDTK802eMmgzqH51KgbnfLRTYf/XAn5qnM3mR6W7UzV/3Lxx0+QYhcAfUAAAAAElFTkSuQmCC" class="chatImg">`', ""],
            [/\bSOLARIS\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURQAAAPXMAA6l2Nff6PXgAP///wRC0v/nYgSE0dLMZGkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAPxJREFUOMudUjtuwzAMfZai3UAu4KW7AAFGRx+BGXSG9gK1vWeIj12S+gb5DCEkmqL4TD5SwAsZHl3m3eUTeNneF+8SIzleYrPSU4zyrUBrEYItJ4kkOAUQiYmkmviAn6sfO8AFX05N9wiYOMOBffXJHvoMF81xB5Dy7fyHba8c+LYAqAFk5a7Y8xFxu1YOcFq4G4RwJCVL6i0ybxvW0HFyfYaoSQ1qUaP93leExTdOWkctiZKBhTKFMN8OlPDUqgoY2czIrIRD+A2wNTgBTEc6ccBIU5kC1+/bE+G58iYZbe6STFq8qa2G/15bOr18QuaJr0nDne7DTvhU/gFIfC2SnkfnfgAAAABJRU5ErkJggg==" class="chatImg">`', ""],
            [/\bAETHER\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAAPuSKxk9P//nYgSE0Szo9JXz+bkvnOsAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAMlJREFUOMuVkkESgyAMRXOFCLpvpxfIcAI67QGYUfcu5P5H6E+0GFetH4EneWFcSHQ13f1SbiSPSwkkT5fMeJi3mfedO2cEii8XlphTEps6NmZnZPJ+DoGz6K3C1qAsLN6ht4sWMXtAY23zDsXxSIFUUoqAEbuxnnmFZDpiEm6dikzWDMYZOyWcG0wywFOM9ezU0K+8frOIDmZAY12bgArNJQ3zHrsVnwVorHurQ6W6pKHuWVgHM6Cxrq0OlWpt778Dlf63t1z+uz+CSKxdfCwzEgAAAABJRU5ErkJggg==" class="chatImg">`', ""],
            [/\bHYPERION\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURQAAAJXz+fuSKxi24gSE0Q5giCzo9P28Rv/nYgvspVMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAf9JREFUOMuVUsGOm0AM5RfckDTXZbtarqyBcmUxEddox+lcEWBxbVQJrmxmqD+7s5/QuVgjvef37Oco+t/37ZmSmk0dUy0wAkBOKCKIwyDM3OTI1ALEiMgLvD9Fn/j2ozZcE2an03jkK2I50kUGGcoPLAgLc2mPfCj4A3/+hjS6JwmAobopKziTl+2sO6m6WR+i6o162id/PDAw43JPo1Wfvi/cQiNzNtd+2ue+Gj2bWeaheBQdVsZN2/FQXEEf1V0jTV4XLFrTDAESCH4eKnFkLFtEz11esU4bA0IPqkHhM+DLggwO1dj1bvIVWthiY42lxpmOOlTxtx5O0sOyLNF9SUop2GQyq4qdJ6vbQdV06mpy3LFlt+9hayVJv+rf6P6aliWiySg0I+Nklh4fMXfeQOxaS2fwzmF+kUvfr6tGy5JiKQNmcXDdsqNu7LNH3FpLcfygrj5ffeVyEqIvS2ukmqqASEYWLZFnO/bwgKC2xfEuM535i2DGSxPWnKzRsj5XmsEpO9oPK6MjSzJsAGfoiPZA745eXM6jNOrt6xpySELqmSAEAss+duEbggtemlBY3dHfXN7K2BBrkkYLvr1wUBgCTiZmaQrm6wGRqBEx7WWEm+TYssHWekqjX38waTMKU4iMItOt4XBmAIGCExsmqm+YN0Qmb5XfX/77uv8BkxTQHgK/b+IAAAAASUVORK5CYII=" class="chatImg">`', ""],
            [/\bANTEPROXIMA\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAQBAMAAAAblGfKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAAABmOAevCTf/WoT/kf///yrTaOw+uowAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAASZJREFUOMt1UluOwyAMnALqN2ovQNXVfqOw4jsKucFeALUS9z/CjnFe2s1aGA22xx4SALHLA2oG+INWC4fUbfCKP8JpiUAzaRcJXp7fD0VmqTvyJOZ3+iTbNuHMOHWTTHaY5xHzPIuPTkHZAyPcsAAbmQZcSpmeauEmIBY9iDODsmSgUbivz+yitxVcLnJ6IVJHBklgbygBb9akRgKeSuAA37vntynPmINNEV4IMVmJVpUUYTcCSmvoJBszSLg8NkKXFJHdsBIGfojCL1ZwV0msgb8LAfZVFtl9wosHCpDOQoLVS2eTauoigtxKlEc0+rXKQmutJhIST1cebF3BMF1r6jW/3kNYNrP+T2b9IXb+zjSkL8ac5o4gbENlQvin5Sl5f0K74h8hY0SZdVIsfwAAAABJRU5ErkJggg==" class="chatImg">`', ""],
            [/\bPROXIMA\b/gi, "", '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAQBAMAAABzZ+XyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAAAAuZgp4/jfc/4Ty/////zOz/+0H8sQAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAPxJREFUKM9tUkGOwzAInIK152jVB1BtHuAWyeeq9g/2A5Yq+f9PWByctNkUKdaEgQGDgdMFbgQc0Gpi3/dt8p9Z/lMbpAdw+vm9uJsGLx+Ud4pH29ewHkMpGaWUu4GCAskOCNrdL9mgqjWrJgcxLCDmyO4ZTUwIkbhmIIUIrrxQSlgCr3jWtVdxodRiiMoVakGis2SO6aztWbc2Q2oNS+keKKpwRQucvfSYgZUGMo3Sph8t0DzWzPk28ZuiEZJnGZepnHgBPfVqqdtoOXqthtZaTRhAQc2or9oXc5h/P2jdg018eu1zP/+R6JulA0Fvmp7YFeXjU6I92F7fsD/aWi+37K8etAAAAABJRU5ErkJggg==" class="chatImg">`', ""],

            // Rank names
            [/\bADMINS?\b/gi, "<span style='color:#FF4F4F'>", '`${match}`', "</span>"],
            [/\bMODERATORS?\b/gi, "<span style='color:#86FF41'>", '`${match}`', "</span>"],

            /*** PLAYER NAMES (and fictional countries) ***/

            [/\b((F|L)OR|4|PHOR(RH?)?)EST(\s?(L|F)ANDT?)?\b/gi, "<span style='color:#63C64D'>", "`${match}`", "</span>"],
            [/\bMR\.?\sSMILES\b/gi, "<span style='color:#FFFFFF'>", "`${match}`", "</span>"],
            [/\bRIVER(\s?(LAND|L'ANT|DUCK))?\b/gi, "<span style='color:#0484D1'>", "`${match}`", "</span>"],
            [/\b(RAINBOW(BALL)?|REGENBOGEN)\b/gi, "<span class='rainbow'>", "`${match}`", "</span>"],
            [/\bMONOCHROME\b/gi, "<span style='color:#000000'>", "`${match[0]}<span style='color:#404040'>${match[1]}<span style='color:#808080'>${match[2]}<span style='color:#C0C0C0'>${match[3]}<span style='color:#FFFFFF'>${match[4]}${match[5]}</span>${match[6]}</span>${match[7]}</span>${match[8]}</span>${match[9]}`", "</span>"],
            [/\bROMANIABALL\b/gi, "<span style='color:#003CB3'>", "`<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAASUExURf///wAAAPzQAAArf84AAAAAAL+aKrIAAAAGdFJOU///////ALO/pL8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAE9JREFUKFN10EkKACAMA8DE5f9flqQuiDWHogNVK7oDZS5jTyVMBWRRSO8EtVpaE8GwRBTiNjLEALCoiD5yurbsk3P53H7L++ZkrmT2+38GpP8CyRiq0RgAAAAASUVORK5CYII=' class='chatImg'> ${match[0] + match[1] + match[2] + match[3]}<span style='color:#FCD116'>${match[4] + match[5] + match[6]}</span><span style='color:#CE1126'>${match[7] + match[8] + match[9] + match[10]}</span>`", "</span>"],
            [/\bNOTHINGHERE(7759)?\b/gi, "<span style='color:#63C64D'>", "`<span style='color:#FFE762'>${match.slice(0, 7)}</span>${match.slice(7, 11)}<span style='color:#FFE762'>${match[11] ? '7759' : ''}</span>`", "</span>"],
            [/\bSOMETHINGTHERE(3351)?\b/gi, "<span style='color:#9C39B2'>", "`<span style='color:#00189D'>${match.slice(0, 9)}</span>${match.slice(9, 14)}<span style='color:#00189D'>${match[14] ? '3351' : ''}</span>`", "</span>"],
            [/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)(DIERMANIA|Дерьмания)(?=\s|$|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)/gi, "<span style='color:#DD0000'>", "`${match[0] + match[1] + match[2]}<span style='color:#FFCE00'>${match[3]}<span style='color:#000000; text-shadow:-1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>${match[4]}</span>${match[5]}</span>${match[6] + match[7] + match[8]}`", "</span>"],
            [/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)(SL?YNT(EX(PR)?|AXIS)|СИНТ((Е|Э)КС(ПР)?|АКСИС)|СЛЮНТ(Е|Э)КС)(?=\s|$|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)/gi, "<span style='color:#417171'>", "`${match}`", "</span>"],
            [/\bTRION(\sNEX(\b\.|US(ORIATE)?)?)?(?=\s|$|"|'|\b)/gi, "<span style='color:#21D714'>", "`${match[0]}<span style='color:#FFFFFF'>${match[1]}<span style='color:#000000'>${match[2]}</span>${match[3]}</span>${match.slice(4)}`", "</span>"],
            [/\b(COALI(TION)?|CLN)\b/gi, "<span style='color:#608C5E'>", "`${match}`", "</span>"],
            [/\b(CRC|UNBIDDEN)\b/gi, "<span style='color:#90F1F8'>", "`${match}`", "</span>"],
            [/\bCOALCRCITION\b/gi, "<span style='color:#6D80A5'>", "`${match}`", "</span>"],
            [/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)((SOUTH\s)?NORTH?IAN?(\s(EMPIRE|REPUBLIC))?|USRNSNN|URNNSN|Ņüŧüŗí(ß|ẞ)flőd|NUTURI(SS?|B)FLOD|IKD1|IDK1)(?=\s|$|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)/gi, "<span style='color:#32E27E'>", "`${match}`", "</span>"],
            [/\bNORISIA\b/gi, "<span style='color:#F75B18'>", "`${match}`", "</span>"],
            [/\bVINLAND\b/gi, "<span style='color:#DEB129'>", "`${match}`", "</span>"],
            [/\[?SERVER\]?/gi, "<span style='color:#FF41E4'>", "`${match}`", "</span>"],
            [/\bR(SS|55)R\b/gi, "<span style='color:#FF0000'>", "`${match}`", "</span>"],
            [/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)(MOTH(ERSHIP|METHMYTH|YLAMINE)?|МОЛЬ|MO(L|N)B|MO(TH)?RBIUS)(?=\s|$|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)/gi, "<span style='color:#D7C39F'>", "`${match}`", "</span>"],
            [/\bSAR\b/gi, "<span style='color:#D50B0B'>", "`${match}`", "</span>"],
            [/\b(POTASS(IUM(_(L|K))?)?|EVERMORE)\b/gi, "<span style='color:#FFA200'>", "`${match}`", "</span>"],
            [/\bATLAN\b/gi, "<span style='color:#FFFFFF'>", "`${match[0]}<span style='color:#808080'>${match[1]}<span style='color:#FF0000'>${match[2]}</span>${match[3]}</span>${match[4]}`", "</span>"],
            [/\bATLAN?DOS\b/gi, "<span style='color:#FFFFFF'>", "`${match[0]}<span style='color:#AAAAAA'>${match[1]}<span style='color:#555555'>${match[2]}<span style='color:#FF0000'>${match[3] + (match.length == 7 ? '' : match[4])}</span>${match[match.length - 3]}</span>${match[match.length - 2]}</span>${match[match.length - 1]}`", "</span>"],
            [/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b):\bD(\s|-)ANON\b/gi, "<span style='color:#0080FF'>", "`${match}`", "</span>"],
            [/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_)ST\.?(?=\s|$|"|'|\b)/gi, "<span style='color:#A1409D'>", "`${match}`", "</span>"],
            [/\bSHADOW\sTAI?LE\b/gi, "<span style='color:#4394A0'>", "`${match.slice(0, 6)}</span>${match[6]}<span style='color:#F430B2'>${match.slice(7)}`", "</span>"],
            [/\bORANG\b/gi, "<span style='color:#FF8800'>", "`${match}`", "</span>"],
            [/\b(HUNGARYBALL|MAGYARLABDA)\b/gi, "<span style='color:#477050'>", "`<span style='color:#CE2939'>${match.slice(0, 4)}</span><span style='color:#FFFFFF'>${match.slice(4, -4)}</span>${match.slice(-4)}`", "</span>"],
            [/\bGABRIEL\b/gi, "<span style='color:#F0F0F0'>", "`${match[0]}<span style='color:#F4E5BC'>${match[1]}<span style='color:#F9DB88'>${match[2]}<span style='color:#FED154'>${match[3]}</span>${match[4]}</span>${match[5]}</span>${match[6]}`", "</span>"],
            [/\bWEST\sVLANDIA\b/gi, "<span style='color:#950000'>", "`${match}`", "</span>"],
            [/\bEAST\sVLANDIA\b/gi, "<span style='color:#FF7A33'>", "`${match}`", "</span>"],
            [/\b(?<!(EA|WE)ST\s)VLANDIA\b/gi, "<span style='color:#950000'>", "`${match}`", "</span>"],
            [/\bSANGSA\b/gi, "<span style='color:#F29153'>", "`<span style='color:#FF0000'>${match.slice(0, 1)}</span><span style='color:#0000FF'>${match.slice(1, -1)}</span><span style='color:#FF00F7'>${match.slice(-1)}</span>`", "</span>"],
            [/\b(KWAPT(ISH|IA)?|62143)\b/gi, "<span style='color:#A45195'>", "`${match}`", "</span>"],
            [/\bSIREMIA\b/gi, "<span style='color:#FFFFFF'>", "`${match}`", "</span>"],
            [/\bXAHH\b/gi, "<span style='color:#00FA9A'>", "`${match}`", "</span>"],
            [/\bLLG\b/gi, "<span style='color:#FF00FF'>", "`${match}`", "</span>"],
            [/\bNONA(EM|MEZ_?)\b/gi, "<span style='color:#9E9EFF'>", "`${match}`", "</span>"],
            [/\b16777216\b/gi, "<span style='color:#FFFFFF'>", "`<span style='color:#0000FF'>16</span><span style='color:#00FF00'>77</span><span style='color:#FF0000'>72</span>16`", "</span>"],
            [/\bNEKONOKA\b/gi, "<span style='color:#8F3CD7'>", "`${match}`", "</span>"],
            [/\bTOASTER\b/gi, "<span style='color:#FFC839'>", "`${match.slice(0, 2)}<span style='color:#FFFFFF'>${match.slice(2, 5)}</span>${match.slice(-2)}`", "</span>"],
            [/\bC3PHEI\b/gi, "<span style='color:#AC3940'>", "`${match}`", "</span>"],
            [/\bENDERMENT\b/gi, "<span style='color:#952BFF'>", "`${match}`", "</span>"],
            [/\b(TAHA(\sÖZDEMIR)?|SYBERLONG)\b/gi, "<span style='color:#224E7C'>", "`${match}`", "</span>"],
            [/\bS(Ü|U)DENLAND\b/gi, "<span style='color:#224E7C'>", "`${match[0]}<span style='color:#4C8FD6'>${match[1]}<span style='color:#1DCDA1'>${match[2]}</span>${match[3]}</span>${match.slice(-5)}`", "</span>"],
            [/\bRELOOPGD\b/gi, "<span style='color:#FD1C27'>", "`${match}`", "</span>"],
            [/(\bBLAKE\b|._BLAKE_.)/gi, "<span style='color:#FCC8D9'>", "`${match}`", "</span>"],
            [/\bCAPA\b/gi, "<span style='color:#A44F15'>", "`${match}`", "</span>"],
            [/\bLEG(3ND)?\b/gi, "<span style='color:#DD80A5'>", "`${match}`", "</span>"],
            [/\b5UP\b/gi, "<span style='color:#0484D1'>", "`${match}`", "</span>"],
            [/\b(VVICTOR(__)?|OFO(\sGANG)?)\b/gi, "<span style='color:#00FF66'>", "`${match}`", "</span>"],
            [/\bM(OUNTAI|T)N\sDEW\b/gi, "<span style='color:#00FF00'>", "`${match.slice(0, -3)}<span style='color:#FF0000'>${match.slice(-3)}</span>`", "</span>"],
            [/\b(MART|ARTM)AN\b/gi, "<span style='color:#0083D5'>", "`${match}`", "</span>"],
            [/\bSTEVESTA\b/gi, "<span style='color:#7F7F7F'>", "`${match}`", "</span>"],
            [/\bLAPIS(\sLAZULI)?\b/gi, "<span style='color:#0066FF'>", "`${match}`", "</span>"],
            [/(?<!:)\bJP(DLD|LAND)?\b/gi, "<span style='color:#FFFFFF'>", "`<img class='emote' src='https://cdn.discordapp.com/emojis/409708038589775872.png?v=1'> ${match}`", "</span>"],
            [/\bAMON?GUSLAND\b/gi, "<span style='color:#52A4DC'>", "`${match}`", "</span>"],
            [/\bDOITSHL(Æ|AE?)ND\b/gi, "<span style='color:#58585A'>", "`${match.slice(0, -7)}</span><span style='color:#C72931'>${match.slice(-7, 7)}</span><span style='color:#F9DD3E'>${match.slice(7)}`", "</span>"],
            [/\bDEUCHLAND\b/gi, "<span style='color:#58585A'>", "`${match.slice(0, 3)}<span style='color:#C72931'>${match.slice(3, 6)}</span><span style='color:#F9DD3E'>${match.slice(-3)}</span>`", "</span>"],
            [/\bLEMONWIRES\b/gi, "<span style='color:#FFF700'>", "`<span style='color:#FFF700'>${match[0]}</span><span style='color:#00FF1E'>${match[1]}</span><span style='color:#FFF700'>${match[2]}</span><span style='color:#00FF1E'>${match[3]}</span><span style='color:#FFF700'>${match[4]}</span><span style='color:#00FF1E'>${match[5]}</span><span style='color:#FFF700'>${match[6]}</span><span style='color:#00FF1E'>${match[7]}</span><span style='color:#FFF700'>${match[8]}</span><span style='color:#00FF1E'>${match[9]}</span>`", "</span>"],
            [/\bLEMON\b/gi, "<span style='color:#FFFF00'>", "`🍋 ${match}`", "</span>"],
            [/\bTESS\b/gi, "<span style='color:#9CDED3'>", "`${match}`", "</span>"],
            [/\bHELPER\b/gi, "<span style='color:#00FF00'>", "`${match}`", "</span>"],
            [/\b(CYGNUS|CEUTHYN)\b/gi, "<span style='color:#00EEFF'>", "`${match}`", "</span>"],
            [/\bSHAY\b/gi, "<span style='color:#2CE8F4'>", "`${match}`", "</span>"],
            [/\bNEOMOTH(\.DEV)?\b/gi, "<span style='color:#9669ff'>", "`<img class='emote' src='https://cdn.discordapp.com/emojis/1388314585781637200.png?v=1'> ${match}`", "</span>"],
            [/\bELDIT\b/gi, "<span style='color:#A92444'>", "`${match}`", "</span>"],
            [/\bJI+GG\b/gi, "<span style='color:#00FFFF'>", "`${match}`", "</span>"],
            [/\bC(-|\s)?YARD\b/gi, "<span style='color:#00FF00'>", "`${match}`", "</span>"],
            [/\bVGS\b/gi, "<span style='color:#FF0000'>", "`${match}`", "</span>"],
            [/(?<!:)\b(JJB|JAR\s?JAR(\s?BOINKS)?)\b/gi, "<span style='color:#750F00'>", "`<img class='emote' src='https://cdn.discordapp.com/emojis/411450961949753345.png?v=1'> ${match}`", "</span>"],
            [/\bNORDDEX\b/gi, "<span style='color:#E53B44'>", "`${match}`", "</span>"],
            [/\b(999|AZSRIEL)\b/gi, "<span class='rainbow'>", "`${match}`", "</span>"],
            [/\bNURUTOMO\b/gi, "<span style='color:#0484D1'>", "`${match}`", "</span>"],
            [/\bMEMELORD\b/gi, "<span style='color:#9E6AFF'>", "`<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAMAAABlXnzoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURZ5q/0X/DwAAAJ+7yioAAAADdFJOU///ANfKDUEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAADhJREFUGFdtzkEKADEMQtGv9z/0YIUySLNI8lyEYAPYkmQzBClB+tmGRWvZUw3u5R8TFG/mic7hBzLcALENn7j/AAAAAElFTkSuQmCC' class='chatImg'> ${match.slice(0, 4)}<span style='color:#45FF0F'>${match.slice(4)}</span>`", "</span>"],
            [/\bF(RI|U)CK\sVERIZON\b/gi, "<span style='color:#FFFFFF'>", "`<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURf///wAAAAAAAH5RqV0AAAADdFJOU///ANfKDUEAAAAJcEhZcwAADsEAAA7BAbiRa+0AAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAA2XYBAOgDAADZdgEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAACMojeFEB6NgAAAEZJREFUKFONkIsKACAIA+f+/6NjEr6o6EBhR0UKkkTgSWWBx2bcoRs5wPIloehltluo0S7qdDEZusb41PNU4Vsdxq4LFOQCftcAm2osOS0AAAAASUVORK5CYII=' class='chatImg'> ${match}`", "</span>"],
            [/\bRANDOOF\b/gi, '<span style="color:#B31919">', '`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURXUAALMZGQAAAOXo42cAAAADdFJOU///ANfKDUEAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAnZMAAOgDAACdkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAJFj+K2cP21wAAACBJREFUGFdjYAADJhiAcAnySQKMjIxwkhg+SQDdZQT4ADwAAH+enAY0AAAAAElFTkSuQmCC" class="chatImg"> ${match}`', "</span>"],
            [/\bSISYPHUS(\sPRIME)?\b/gi, '<span style="color:#FF2B00">', '`${match[0]}<span style="color:#FF6100">${match[1]}<span style="color:#FFA500">${match[2]}<span style="color:#FFB200">${match[3]}</span><span style="color:#FFCD00">${match[4]}<span style="color:#FFFF00">${match[5]}</span><span style="color:#FFFFBA">${match[6]}<span style="color:#FFFFFF">${match[7]}</span>${(match[8] ?? "") + (match[9] ?? "")}</span>${(match[10] ?? "")}</span>${(match[11] ?? "")}</span>${(match[12] ?? "")}</span>${(match[13] ?? "")}`', "</span>"],
            [/\bMINOS(\sPRIME)?\b/gi, "<span style='color:#D3D5FF'>", "`${match[0]}<span style='color:#9395D7'>${match[1]}<span style='color:#6E70AB'>${match[2]}<span style='color:#77526D'>${match[3]}<span style='color:#934463'>${match[4] + (match[5] ?? '') + (match[6] ?? '')}</span>${(match[7] ?? '')}</span>${(match[8] ?? '')}</span>${(match[9] ?? '')}</span>${(match[10] ?? '')}`", "</span>"],
            [/\b(GREENY(\s?LAND)?|GREEN\sREP|UGS|UNITED\sGREEN\sSTATES)\b/gi, "<span style='color:#4ED97C'>", "`${match}`", "</span>"],
            [/(?<=\s|^|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)((NEW\s)?PHY(REXIA)?|ɸ|ჶ)(?=\s|$|"|'|\.|,|:|;|\?|!|\*|\/|\\|\||\(|\)|\[|\]|{|}|=|\+|-|_|\b)/gi, "<span style='color:#F4F1A4'>", "`${match}`", "</span>"],
            [/\bPURPERISM\b/gi, "<span style='color:#972C9E'>", "`${match}`", "</span>"],
            [/\b(RODIMUS(\s?PRIME)?|PACI(CIDAL)?|UNALIGNED|WILDSTRIKE)\b/gi, "<span style='color:#58A699'>", "`${match}`", "</span>"],
            [/\bDUCK12\b/gi, "<span style='color:#FFFFFF'>", "`${match}`", "</span>"],
            [/\b((BO(Ö|O)TES|VOID)\s(IMPERIUM|EMPIRE)|VOID)\b/gi, "<span style='color:#000000; text-shadow:-1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>", "`${match}`", "</span>"],
            [/\bRALIOVI\b/gi, "<span style='color:#AEE797'>", "`${match}`", "</span>"],
            [/\b(ERIC|HOLY\sELVEN\sHORDE|E(_|\s)LXIV|LMAO\.ERICC_6464)\b/gi, "<span style='color:#00B315'>", "`${match}`", "</span>"],
            [/\bNORIST\b/gi, "<span style='color:#39cd79'>", "`${match[0]}<span style='color:#1e8f73'>${match[1]}</span><span style='color:#2b5758'>${match[2]}</span><span style='color:#fb922b'>${match[3]}</span><span style='color:#aefe5d'>${match[4]}</span><span style='color:#3b9b90'>${match[5]}</span>`", "</span>"],
            [/\bEXPUNGED\b/gi, "<span style='color:#B80000'>", "`${match}`", "</span>"],
            [/\bNOUR\b/gi, "<span style='color:#9CC4C4'>", "`${match}`", "</span>"],
            [/\bEMPIRE\sFRAN(C|Ç)AIS\b/gi, "<span style='color:#0D67F8'>", "`${match.slice(0, 10)}<span style='color:#FFFFFF'>${match.slice(10, 12)}</span><span style='color:#E00000'>${match.slice(-3)}</span>`", "</span>"],
            [/\bFILANA\b/gi, "<span style='color:#FFBFD1'>", "`${match}`", "</span>"],
            [/\bPINKISTAN\b/gi, "<span style='color:#FF97BF'>", "`${match}`", "</span>"],
            [/\bLILI?AC(\sREP(UBLIC)?)?\b/gi, "<span style='color:#A8ABF5'>", "`${match}`", "</span>"],
            [/\bTIZENAMI\b/gi, "<span style='color:#FE6C6C'>", "`${match}`", "</span>"],
            [/\b(UNION|ONION)\sOF\sUNKNOWN\b/gi, "<span style='color:#D4D4D4'>", "`${match}`", "</span>"],
            [/\bBREZTEC\b/gi, "<span style='color:#CFAE12'>", "`${match}`", "</span>"],
            [/\bTHISISKS\b/gi, "<span style='color:#00CEFF'>", "`${match}`", "</span>"],
            [/\bSOLANIAN\sTRIBE\b/gi, "<span style='color:#B34400'>", "`${match[0]}<span style='color:#C45C00'>${match[1]}<span style='color:#FB8B03'>${match[2]}<span style='color:#FEC625'>${match[3] + match[4]}<span style='color:#FEAE10'>${match[5]}<span style='color:#E6E631'>${match[6]}</span>${match[7]}</span>${match.slice(8, 11)}</span>${match[11]}</span>${match[12]}</span>${match[13]}`", "</span>"],
            [/\bSOLANIA\b/gi, "<span style='color:#B34400'>", "`${match[0]}<span style='color:#C45C00'>${match[1]}<span style='color:#FB8B03'>${match[2]}<span style='color:#FEC625'>${match[3]}</span>${match[4]}</span>${match[5]}</span>${match[6]}`", "</span>"],
            [/\bSOUTH?IA(N\sEMPIRE)?\b/gi, "<span style='color:#FBD439'>", "`${match}`", "</span>"],
            [/\bSTABLE\sLAND\b/gi, "<span style='color:#C2A42E'>", "`${match}`", "</span>"],
            [/\bSTABILIA\b/gi, "<span style='color:#AEFE5D'>", "`${match}`", "</span>"],
            [/\bMAURICE\b/gi, "<span style='color:#79665F'>", "`${match[0]}<span style='color:#9D897A'>${match[1]}<span style='color:#BAA490'>${match[2]}<span style='color:#D3B8A1'>${match[3]}</span>${match[4]}</span>${match[5]}</span>${match[6]}`", "</span>"],
            [/\bECIRUAM\b/gi, "<span style='color:#8699A0'>", "`${match[0]}<span style='color:#627685'>${match[1]}<span style='color:#455B6F'>${match[2]}<span style='color:#2C475E'>${match[3]}</span>${match[4]}</span>${match[5]}</span>${match[6]}`", "</span>"],
            [/\bAVIA(N\sREPUBLIC)?\b/gi, "<span style='color:#9c0aeb'>", "`${match}`", "</span>"],
            [/\bSYNTHESIA\b/gi, "<span style='color:#63C64D'>", "`${match[0]}<span style='color:#4A9C49'>${match[1]}<span style='color:#327345'>${match.slice(2, 4)}<span style='color:#AF9C2C'>${match[4]}</span>${match.slice(5, 7)}</span>${match[7]}</span>${match[8]}`", "</span>"],
            [/\b(DARKSTALKER|\.JUSTDARK)\b/gi, "<span style='color:#570034; text-shadow:-1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888'>", "`${match}`", "</span>"],
            [/\bCYNTEX\b/gi, "<span style='color:#417171'>", "`${match[0]}</span><span style='color:#348A8D'>${match[1]}</span><span style='color:#27A3A9'>${match[2]}</span><span style='color:#1ABCC6'>${match[3]}</span><span style='color:#0DD5E2'>${match[4]}</span><span style='color:#00EEFF'>${match[5]}`", "</span>"],
            [/\bCYGNTEX\b/gi, "<span style='color:#417171'>", "`${match[0]}</span><span style='color:#3E7576'>${match[1]}</span><span style='color:#318F93'>${match[2]}</span><span style='color:#23A9b1'>${match[3]}</span><span style='color:#16C3CE'>${match[4]}</span><span style='color:#08DDEC'>${match[5]}</span><span style='color:#00EEFF'>${match[6]}`", "</span>"],
            [/\bINFRA(RAVEN)?\b/gi, "<span style='color:#CA0000'>", "`${match}`", "</span>"],
            [/\bDIMDEN\b/gi, "<span style='color:#B4FFD6'>", "`${match}`", "</span>"],
            [/\bKIT(0057)?\b/gi, "<span style='color:#F36709'>", "`${match}`", "</span>"],
            [/\bDAYDUN\b/gi, "<span style='color:#7D579A'>", "`${match}`", "</span>"],
            [/\b(C|S)YTIA\b/gi, "<span style='color:#fbd439'>", "`${match}`", "</span>"],
            [/\b(LMN|ELEMEN)TAL\sX\b/gi, "<span style='color:#afd643'>", "`${match}`", "</span>"],
            [/\bMINDUSTRIA\b/gi, "<span style='color:#6E7080'>", "`${match[0]}<span style='color:#989AA4'>${match[1]}<span style='color:#9D7F7F'>${match[2]}<span style='color:#DCC6C6'>${match[3]}<span style='color:#FFFFFF'>${match[4] + match[5]}</span>${match[6]}</span>${match[7]}</span>${match[8]}</span>${match[9]}`", "</span>"],
            [/\bATEN(ESIA)?\b/gi, "<span style='color:#65a0b3'>", "`${match}`", "</span>"],
            [/\bMITIA\b/gi, "<span style='color:#FF0000'>", "`${match[0]}<span style='color:#CC0000'>${match[1]}<span style='color:#980000'>${match[2]}</span>${match[3]}</span>${match[4]}`", "</span>"],
            [/\b(7RAU|ILLIA(N\sREPUBLIC)?)\b/gi, "<span style='color:#4e5579'>", "`${match}`", "</span>"],
            [/\bHADRON\b/gi, "<span style='color:#FF902A'>", "`${match[0]}<span style='color:#A4A9B4'>${match[1]}<span style='color:#8F9B89'>${match[2] + match[3]}</span>${match[4]}</span>${match[5]}`", "</span>"],
            [/\bBIBLIA\b/gi, "<span style='color:#FFFFFF'>", "`${match[0]}<span style='color:#fef8bc'>${match[1]}</span><span style='color:#fef6a6'>${match[2]}</span><span style='color:#84ceff'>${match[3]}</span><span style='color:#addeff'>${match[4]}</span>${match[5]}`", "</span>"],
            [/\bFLORIA\b/gi, "<span style='color:#63C64D'>", "`${match[0]}<span style='color:#4a9c49'>${match[1]}<span style='color:#e53b44'>${match[2]}</span><span style='color:#fb922b'>${match[3]}</span>${match[4]}</span>${match[5]}`", "</span>"],
            [/\bSISYDEA\b/gi, "<span style='color:#FFFF00'>", "`${match[0]}<span style='color:#CCCC00'>${match[1]}<span style='color:#989800'>${match[2]}</span>${match[3]}</span>${match[4]}<span style='color:#CCCC00'>${match[5]}</span><span style='color:#989800'>${match[6]}</span>`", "</span>"],
            [/\bAVARITIA\b/gi, "<span style='color:#50B4C8'>", "`${match[0]}</span><span style='color:#AADC6E'>${match[1]}</span><span style='color:#D2BE46'>${match[2]}</span><span style='color:#D26E28'>${match[3]}</span><span style='color:#C8283C'>${match[4]}</span><span style='color:#D23C96'>${match[5]}</span><span style='color:#A046DC'>${match[6]}</span><span style='color:#6E5AE6'>${match[7]}`", "</span>"],
            [/\bYELLORISM\b/gi, "<span style='color:#d3a80d'>", "`${match}`", "</span>"],
            [/\b(STAVORIA|CHENGED)\b/gi, "<span style='color:#3b9b90'>", "`${match}`", "</span>"],
            [/𓁹|\bMITO\b/gi, '<span style="color:#B30000;text-shadow: 0px 0px 5px #FFFF00, 0px 0px 5px #FFFF00, 0px 0px 5px #FFFF00, -1px 0px 0 #888, 1px 0px 0 #888, 0px 1px 0 #888, 0px -1px 0 #888;">', "`${match}`", "</span>"],
            [/\bVALORIA\b/gi, "<span style='color:#6cb86b'>", "`${match}`", "</span>"],
            [/\bZOTOVARIA\b/gi, "<span style='color:#e8b84f'>", "`${match}`", "</span>"],
            [/\bMOLOVARASHIA\b/gi, "<span style='color:#425728'>", "`${match}`", "</span>"],
            [/\bVARASHIA\b/gi, "<span style='color:#8c8936'>", "`${match}`", "</span>"],
            [/\bDINIA\b/gi, "<span style='color:#2b53b1'>", "`D<span style='color:#214087'>i<span style='color:#1a3574'>n</span>i</span>a`", "</span>"],
            [/\bDINIAN\sEMPIRE\b/gi, "<span style='color:#2b53b1'>", "`${match[0]}<span style='color:#26499c'>${match[1] + match[2]}<span style='color:#214087'>${match[3]}<span style='color:#1c397d'>${match[4]}<span style='color:#1a3574'>${match.slice(5, 8)}</span>${match[8]}</span>${match[9]}</span>${match[10] + match[11]}</span>${match[12]}`", "</span>"],
            [/\bORSSU(\sPCCC)?\b/gi, "<span style='color:#EE3A5B'>", "`${match}`", "</span>"],
        ];

        //Variables
        let quickID;
        let responseID;
        let nearbyThresh = 500;

        // Chat on the left
        if (chat.style.position != 'absolute') {
            chat.style.position = 'absolute';
        };
        if (ls.chatOnLeft == 'true') {
            helpBtn.style.left = 'initial';
            helpBtn.style.right = '55px';
            chat.style.right = 'initial';
            chat.style.left = '0';
        };

        //Help command
        function helpHandle(args) {
            if (args.length != 1) {
                locSend("Chat Utils commands: block, clear, group, left, local, lset, max, nearby, q, qset, respond, show, unblock, yell")
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
                    break;
                case "max":
                    locSend("max - Sets the max number of messages in the chat to the specified value (default: 256).\nUsage: /max &lt;number&gt;\nAliases: [None]");
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
                if (!['group', 'g', 'qset', 'qid', 'q', 'respond', 'r', 'local', 'l', 'lset', 'c', 'clear', 'yell', 'block', 'unblock', 'nearby', 'show', 'left', 'max'].every(cmd => cmd != msgParsed.data.message.slice(17, -1))) {
                    return '';
                };
            };
            // Muting system because either idk how to use the vanilla one or it just isn't working
            if (OWOP.muted.includes(msgParsed.data.senderID)) return;
            // Colorful Chat

            /*** FIRST TECHNICAL AREA ***/

            let rank = msgParsed.data.rank
            // Add ids to mods and admins
            if (rank > 1 && rank < 4 && msgParsed.data.nick.slice(4) != msgParsed.data.senderID) {
                if (msgParsed.data.nick.startsWith("(")) {
                    msgParsed.data.nick = msgParsed.data.nick.slice(0, 4) + `[${msgParsed.data.senderID}]` + msgParsed.data.nick.slice(3);
                } else {
                    msgParsed.data.nick = `[${msgParsed.data.senderID}] ` + msgParsed.data.nick;
                }
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
                } else if (msgParsed.data.nick.match(/^\[.+?\] \(A\)/) || msgParsed.data.nick.match(/^(InfraRaven|Cygnus)/i)) {
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
            function replaceInMessage(rx, replace) {
                msgParsed.data.message = msgParsed.data.message.replace(rx, replace);
            };
            // Prevent people from executing their own code but leave dc emojis alone
            if (rank < 3) {
                //msgParsed.data.message = OWOP.util.escapeHTML(msgParsed.data.message);
                replaceInMessage(/<(?!a?:(.+?):(\d{8,32}))/g, `&lt;`);
                replaceInMessage(/(?<!a?:(.+?):(\d{8,32}))>/g, `&gt;`);
            };

            if (!msgParsed.data.message.match(/^\$/) && !anchorme(msgParsed.data.message).includes("<a")) {
                replaceInMessage(/#\b(\d|[a-f]){6}\b/gi, match => `<span style='color:${match}'>${match}</span>`);
                for (let i = 0; i < replacements.length; i++) {
                    replaceInMessage(replacements[i][0], match => replacements[i][1] + eval(replacements[i][2]) + replacements[i][3]);
                    if (msgParsed.data.nick.match(replacements[i][0])) {
                        msgParsed.data.nick = replacements[i][1] + msgParsed.data.nick.replace(replacements[i][0], match => eval(replacements[i][2])) + replacements[i][3];
                    }
                };
            } else { // Color override
                for (let i = 0; i < replacements.length; i++) {
                    if (msgParsed.data.nick.match(replacements[i][0])) {
                        msgParsed.data.nick = replacements[i][1] + msgParsed.data.nick.replace(replacements[i][0], match => eval(replacements[i][2])) + replacements[i][3];
                    }
                };
            }
            replaceInMessage(/^\$\s?/g, '');

            /*** SECOND TECHNICAL AREA ***/

            // Markdown
            if (!anchorme(msgParsed.data.message).includes("<a") && !msgParsed.data.message.match(/^\$/)) {
                msgParsed.data.message = mdParse(msgParsed.data.message);
            } else {
                replaceInMessage(/^\$\s?/g, '');
            };
            if (msgParsed.data.nick.match(/(?<=^(\[.+?\] )?(\((M|A)\) (\[\d+?\] )?|\[(\d+?|D)\] ))#/)) {
                let nameColor = msgParsed.data.nick.match(/(?<=^(\[.+?\] )?(\((M|A)\) (\[\d+?\] )?|\[(\d+?|D)\] ))#[\dA-F]{6}/gi);
                msgParsed.data.nick = `<span style='color:${nameColor}'>` + mdParse(msgParsed.data.nick).replace(/(?<=^(\[.+?\] )?(\((M|A)\) (\[\d+?\] )?|\[(\d+?|D)\] ))#([\dA-F]{6}\s?)?/gi, '') + "</span>";
            }
            // Unnamed players
            if (msgParsed.data.nick == msgParsed.data.senderID || msgParsed.data.nick.slice(4) == msgParsed.data.senderID) {
                msgParsed.data.nick = `<span style='color:${playerList[msgParsed.data.senderID]?.clr}'>` + msgParsed.data.nick + "</span>";
            };
            // Chat mention
            let findPlayer = new RegExp(`(?<![\\/+=])\\b${playerID}\\b(?![\\/+=])`, "g");
            replaceInMessage(findPlayer, match => `<span style='color:#FF0000'>${match}</span>`);
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
                    ls.chatOnLeft = args[0];
                    updateLs();
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
                case "max":
                    if (args.length != 1) {
                        locErr('Usage: /max <number>');
                        return '';
                    };
                    OWOP.options.maxChatBuffer = ls.maxChatBuffer = +args;
                    updateLs();
                    return '';
                case "help":
                case "h":
                case "?":
                    helpHandle(args);
            };
            return msg;
        };
        // Update Notice
        if (ls.chatUtilsUpdateNotice != '1.8') {
            locSend(`<span style="color:#FFFF00">Chat Utils update 1.8:
 - Added /max &lt;number&gt; for setting the max number of messages in the chat
 - Made it so all colored words also work as nicknames
 - Added markdown for nicknames too. To use it, add a # to the beginning of your nickname (you can also add a hex color code right after the # to color the nickname)
 - Added a border between chat messages to prevent trolling
 - Added {k for making obfuscated text: <span class="obfuscated">hello</span>
 - Fixed lone closed curly brackets } getting deleted
 - Added new words to colorful chat
<button onclick="let a = JSON.parse(localStorage.CU); a.chatUtilsUpdateNotice = '1.8'; localStorage['CU'] = JSON.stringify(a); this.parentElement.parentElement.parentElement.remove()">Click to dismiss</button></span>`)
        };
        console.log('Chat Utils installed');
    };
})();
