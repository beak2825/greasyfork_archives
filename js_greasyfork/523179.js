// ==UserScript==
// @name         (OUTDATED)AUTOLOOT HORDES
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Auto Loot + Anti Afk + Item Uniting (Made By IMNOTCALLMEISRA2)
// @author       IMNOTCALLMESIRA2
// @match        https://hordes.io/play
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hordes.io
// @grant        none
// @namespace    https://greasyfork.org/users/857980
// @license      MIT
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/523179/%28OUTDATED%29AUTOLOOT%20HORDES.user.js
// @updateURL https://update.greasyfork.org/scripts/523179/%28OUTDATED%29AUTOLOOT%20HORDES.meta.js
// ==/UserScript==


alert("AUTOLOOT BY:IMNOTCALLMEISRA2")


document.write();


fetch('https://hordes.io/play')
    .then(d=>d.text())
    .then(async html => {
    const element = html.match(/<script.*?client\.js.*?><\/script>/)[0]
    const url = element.match(/src="(.*?)"/)[1]
    html = html.replace(element,`<script>let _t=origin;delete origin;eval(_t)</script>`)

    let origin = await (fetch(url).then(d=>d.text()))

    const name = 'ha';
    const pickedMarker = 'inProcessPick';

    const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const settingName = "hordes-auto-loot";
    const getSetting = (key, defaultValue) => `${settingName}-${key}` in localStorage ? parseInt(localStorage.getItem(`${settingName}-${key}`)) : defaultValue;
    const setSetting = (key, value) => localStorage.setItem(`${settingName}-${key}`, value);

    const vr = {
        intersReady: {
            antiAfk: getSetting("antiAfk", true),
            looting: getSetting("looting", true),
            uiextra: getSetting("uiextra", true),
        },

        antiAfk: () => (vr.intersReady.antiAfk=!vr.intersReady.antiAfk),
        looting: () => (vr.intersReady.looting=!vr.intersReady.looting),
        uiextra: () => (vr.intersReady.uiextra=!vr.intersReady.uiextra),

        classes: [
            {
                id: 0,
                name: "Warrior",
                droptype: ["sword", "shield"]
            },
            {
                id: 1,
                name: "Mage",
                droptype: ["staff", "orb"]
            },
            {
                id: 2,
                name: "Archer",
                droptype: ["bow", "quiver"]
            },
            {
                id: 3,
                name: "Shaman",
                droptype: ["hammer", "totem"]
            }
        ],

        rules: {
            fixedDelay: getSetting("fixedDelay", 0),
            randomDelay: getSetting("randomDelay", 0),

            gold: getSetting("gold", true),
            rune: getSetting("rune", true),
            misc: getSetting("misc", false),

            book1: getSetting("book1", false),
            book2: getSetting("book2", false),
            book3: getSetting("book3", true),
            book4: getSetting("book4", true),
            book5: getSetting("book5", true),

            loot1: getSetting("loot1", false),
            loot2: getSetting("loot2", false),
            loot3: getSetting("loot3", true),
            loot4: getSetting("loot4", true),
            quality: getSetting("quality", 70),

            bow: getSetting("bow", true),
            hammer: getSetting("hammer", true),
            staff: getSetting("staff", true),
            sword: getSetting("sword", true),

            orb: getSetting("orb", true),
            quiver: getSetting("quiver", true),
            shield: getSetting("shield", true),
            totem: getSetting("totem", true),

            armlet: getSetting("armlet", true),
            armor: getSetting("armor", true),
            boot: getSetting("boot", true),
            glove: getSetting("glove", true),

            amulet: getSetting("amulet", true),
            bag: getSetting("bag", true),
            ring: getSetting("ring", true),
        },

        command (name, str) { vr.send(vr.coder.clientCommand.packData({command: name, string: str+''})) },
        drop (slotID) {vr.command("itemdrop", slotID); },
        pick (item) {if(item[pickedMarker])return; item[pickedMarker]=true; vr.send(vr.coder.clientPlayerChangeTarget.encode({_header:1,target:item.id}))},
        invFull () {
            if (!(vr.me && vr.me.inventory && vr.me.inventory.slots)) return true;
            return [...vr.me.inventory.slots.keys()].filter(i=>i<101).length === vr.me.inventory.size;
        },
        concatItems () {
            if (!(vr.me && vr.me.inventory && vr.me.inventory.slots)) return;

            const inventoryItems = [...vr.me.inventory.slots].filter(a=>a[0]<101);
            const stackable = (item, item2) => item.type==item2.type&&item.tier==item2.tier&&item.stacks>0&&item.stacks<50;

            inventoryItems.map(item => {
                const withItem = inventoryItems.find(item2 => item[0] > item2[0] && stackable(item[1], item2[1]) )
                if (withItem) vr.command('itemmove', item[0]+' '+withItem[0])
            });
        },


        inters: {
            antiAfk: setInterval(() => vr.intersReady.antiAfk&&vr.world&&vr.world.tick(Math.random()/1e3), 1e3/60),
            uiextra: setInterval(() => {
                if (!vr.intersReady.uiextra) return;

                if (getChoiceByTitle('Yes, show me the items for sale.')) getChoiceByTitle('Yes, show me the items for sale.').click()
                if (getChoiceByTitle('Yes, open my Stash.')) getChoiceByTitle('Yes, open my Stash.').click()
                if (getChoiceByTitle('Show me your wares.')) getChoiceByTitle('Show me your wares.').click()
                if (getChoiceByTitle('Yes, I have some items.')) getChoiceByTitle('Yes, I have some items.').click()
            }),
            looting: (function lootingLoop() { setTimeout(() => {
                if (vr.intersReady.looting && vr.me && vr.world.entities.type[3].length) {

                    const full = vr.invFull();

                    const inventoryItems = [...vr.me.inventory.slots].filter(a=>a[0]<101).map(a=>a[1]);
                    const stackable = item => inventoryItems.find(i=>i.type==item.droptype&&i.tier==item.tier&&i.stacks>0&&i.stacks<50)

                    const loot = vr.world.entities.type[3]
                    .map(i=>((i[pickedMarker]=false),i))
                    .filter(i => {
                        if (i.droptype == 'gold') return vr.me.stats.alive && vr.rules.gold;
                        if (stackable(i)) return true;
                        if (full) return false;

                        if (i.droptype == 'book') {
                            return vr.rules.book1 && i.name.endsWith('Lv. 1') ||
                                vr.rules.book2 && i.name.endsWith('Lv. 2') ||
                                vr.rules.book3 && i.name.endsWith('Lv. 3') ||
                                vr.rules.book4 && i.name.endsWith('Lv. 4') ||
                                vr.rules.book5 && i.name.endsWith('Lv. 5')
                        } else if (i.droptype == 'misc') {
                            return vr.rules.misc;
                        } else if (i.droptype == 'rune') {
                            return vr.rules.rune;
                        } else {
                            return vr.rules[i.droptype] && 
                                (vr.rules.loot1 && i.color == 'common' ||
                                vr.rules.loot2 && i.color == 'uncommon' ||
                                vr.rules.loot3 && i.color == 'rare' ||
                                vr.rules.loot4 && i.color == 'epic') &&
                                vr.rules.quality <= i.quality;
                        }
                        return false;
                    })
                    .filter(i => i.canBePickedUpBy(vr.me));

                    (vr.rules.fixedDelay || vr.rules.randomDelay) && loot.length ? vr.pick(loot.shift()) : loot.map(vr.pick)
                }

                lootingLoop();
            }, (window[name]?.rules.fixedDelay || 0) + (window[name]?.rules.randomDelay || 0)) })(),
        }
    };

    window[name] = vr;

    let world = origin.match(/([_a-zA-Z0-9]*?)\.entity\(.\)/)[1]
    let coder = origin.match(/([_a-zA-Z0-9]*?)=\{clientPlayerInput:/)[1]
    let ws = origin.match(/([_a-zA-Z0-9]*?)=new WebSocket/)[1]
    let send = origin.match(/([_a-zA-Z0-9]*?)=[_a-zA-Z0-9]*?=>\{[_a-zA-Z0-9]*?===void 0\|\|[_a-zA-Z0-9]*?!==1\|\|[_a-zA-Z0-9]*?\.send\(/)[1]

    origin = origin.replace('this.player=e', 'Object.assign(window.'+name+
                            ',{world:'+world+
                            ',me:e'+
                            ',coder:'+coder+
                            ',ws:'+ws+
                            ',send:'+send+
                            '}),this.player=e')

    window.origin = origin
    document.open().write(html)
    document.close()


    const getChoiceByTitle = title => [...document.getElementsByClassName('choice')].find(c=>c.textContent.includes(title))


    // hotkeys
    document.addEventListener('keydown', e => e.code == 'ShiftRight' && vr.looting());
    document.addEventListener('keydown', e => e.code == 'ControlRight' && vr.concatItems());


    let autoLootUI = false;
    document.addEventListener('keydown', e => e.shiftKey && e.code == 'KeyF' && toggleAutoLootSettings());

    function toggleAutoLootSettings() {
        if (!autoLootUI) {
            document.querySelector(".l-ui.layout > .container:first-child").insertAdjacentHTML('afterend',
                `<style>
                    .grid-content {
                        display: grid;
                        grid-template-columns: 2fr 1fr;
                        grid-gap: 8px;
                        align-items: center;
                    }

                    .container.auto-loot-ui {
                        min-width: 350px;
                        max-width: 600px;
                        width: 90%;
                        height: 60%;
                        min-height: 350px;
                        max-height: 600px;
                        z-index: 9;
                    }

                    .window.auto-loot-window {
                        padding: 5px;
                        height: 100%;
                        display: grid;
                        grid-template-rows: 30px 1fr;
                        grid-gap: 4px;
                        transform-origin: inherit;
                        min-width: fit-content;
                    }

                    .titleframe.auto-loot-titleframe {
                        line-height: 1em;
                        display: flex;
                        align-items: center;
                        position: relative;
                        letter-spacing: 0.5px;
                    }

                    .titleicon.auto-loot-titleicon {
                        margin: 3px;
                    }

                    .title.auto-loot-title {
                        width: 100%;
                        padding-left: 4px;
                        font-weight: bold;
                    }

                    .slot.auto-loot-slot {
                        min-height: 0;
                    }

                    .restore-default-settings {
                        width: 450px;
                        margin-right: 4px;
                    }

                    .close-ui {
                        width: 35px;
                    }
                </style>
                <div class="absCentered container auto-loot-ui">
                    <div class="window panel-black auto-loot-window">
                        <div class="titleframe auto-loot-titleframe">
                            <img src="/data/ui/icons/bag.svg" class="titleicon svgicon auto-loot-titleicon">
                            <div class="textprimary title auto-loot-title">
                                <div name="title">Autoloot :) <small class="textred">v0.5</small></div>
                            </div>
                            <div class="btn red restore-default-settings"><img src="/data/ui/icons/cog.svg" class="svgicon"> Restore Default Settings</div>
                            <div class="btn black close-ui"><img src="/data/ui/icons/cross.svg" class="svgicon"></div>
                        </div>
                        <div class="slot scrollbar auto-loot-slot">
                            <div class="panel-black">
                                <h3 class="textprimary"></h3>
                                <div class="grid-content scripts">
                                    <div>Automatic Looting</div>
                                    <div class="btn checkbox" name="looting"></div>
                                    <div>Anti AFK</div>
                                    <div class="btn checkbox" name="antiAfk"></div>
                                    <div>Concatenate Inventory Items</div>
                                    <div class="">ControlRight</div>
                                </div>
                                <h3 class="textprimary">Coins Meter</h3>
                                <div class="grid-content coins-meter">
                                    <div>Session Time</div>
                                    <div class="coins-meter-time"></div>
                                    <div>Coins Earned</div>
                                    <div class="coins-meter-earned">
                                        <span class="textgold">00</span> <img class="texticon" src="/data/ui/currency/gold.webp">
                                        <span class="textsilver">00</span> <img class="texticon" src="/data/ui/currency/silver.webp">
                                        <span class="textcopper">00</span> <img class="texticon" src="/data/ui/currency/copper.webp">
                                    </div>
                                    <div>Coins / Minute</div>
                                    <div class="coins-meter-earned-minute">
                                        <span class="textgold">00</span> <img class="texticon" src="/data/ui/currency/gold.webp">
                                        <span class="textsilver">00</span> <img class="texticon" src="/data/ui/currency/silver.webp">
                                        <span class="textcopper">00</span> <img class="texticon" src="/data/ui/currency/copper.webp">
                                    </div>
                                    <div>Coins / Hour</div>
                                    <div class="coins-meter-earned-hour">
                                        <span class="textgold">00</span> <img class="texticon" src="/data/ui/currency/gold.webp">
                                        <span class="textsilver">00</span> <img class="texticon" src="/data/ui/currency/silver.webp">
                                        <span class="textcopper">00</span> <img class="texticon" src="/data/ui/currency/copper.webp">
                                    </div>
                                    <div></div>
                                    <div class="btn grey coins-meter-reset">Reset</div>
                                </div>
                                <h3 class="textprimary">Delay</h3>
                                <div class="grid-content delay">
                                    <div>Fixed Delay<br><small class="textgrey fixed-delay-indicator">ms</small></div>
                                    <input type="range" class="fixed-delay" name="delay" min="0" max="1000">
                                    <div>With Randomness<br><small class="textgrey random-delay-indicator">ms</small></div>
                                    <input type="range" class="random-delay" name="random-delay" min="0" max="1000">
                                </div>
                                <h3 class="textprimary">Main</h3>
                                <div class="grid-content main">
                                    <div>Gold</div>
                                    <div class="btn checkbox" name="gold"></div>
                                    <div>Rune</div>
                                    <div class="btn checkbox" name="rune"></div>
                                    <div>Misc</div>
                                    <div class="btn checkbox" name="misc"></div>
                                </div>
                                <h3 class="textprimary">Equipment</h3>
                                <div class="grid-content equipment">
                                    <div>Default Presets<br><small class="textgrey my-class-indicator"></small></div>
                                    <select class="default-presets-select">
                                        <option disabled selected>Select a preset</option>
                                        <option value="0">Warrior</option>
                                        <option value="1">Mage</option>
                                        <option value="2">Archer</option>
                                        <option value="3">Shaman</option>
                                    </select>
                                    <div class="textprimary">Main 1</div>
                                    <div></div>
                                    <div><img src="/data/ui/slotbg/101.webp" class="svgicon"> Sword <img src="/data/ui/classes/0.webp" class="svgicon"></div>
                                    <div class="btn checkbox" name="sword"></div>
                                    <div><img src="/data/ui/slotbg/101.webp" class="svgicon"> Staff <img src="/data/ui/classes/1.webp" class="svgicon"></div>
                                    <div class="btn checkbox" name="staff"></div>
                                    <div><img src="/data/ui/slotbg/101.webp" class="svgicon"> Bow <img src="/data/ui/classes/2.webp" class="svgicon"></div>
                                    <div class="btn checkbox" name="bow"></div>
                                    <div><img src="/data/ui/slotbg/101.webp" class="svgicon"> Hammer <img src="/data/ui/classes/3.webp" class="svgicon"></div>
                                    <div class="btn checkbox" name="hammer"></div>
                                    <div class="textprimary">Main 2</div>
                                    <div></div>
                                    <div><img src="/data/ui/slotbg/109.webp" class="svgicon"> Shield <img src="/data/ui/classes/0.webp" class="svgicon"></div>
                                    <div class="btn checkbox" name="shield"></div>
                                    <div><img src="/data/ui/slotbg/109.webp" class="svgicon"> Orb <img src="/data/ui/classes/1.webp" class="svgicon"></div>
                                    <div class="btn checkbox" name="orb"></div>
                                    <div><img src="/data/ui/slotbg/109.webp" class="svgicon"> Quiver <img src="/data/ui/classes/2.webp" class="svgicon"></div>
                                    <div class="btn checkbox" name="quiver"></div>
                                    <div><img src="/data/ui/slotbg/109.webp" class="svgicon"> Totem <img src="/data/ui/classes/3.webp" class="svgicon"></div>
                                    <div class="btn checkbox" name="totem"></div>
                                    <div class="textprimary">Body</div>
                                    <div></div>
                                    <div><img src="/data/ui/slotbg/102.webp" class="svgicon"> Armlet</div>
                                    <div class="btn checkbox" name="armlet"></div>
                                    <div><img src="/data/ui/slotbg/103.webp" class="svgicon"> Armor</div>
                                    <div class="btn checkbox" name="armor"></div>
                                    <div><img src="/data/ui/slotbg/104.webp" class="svgicon"> Bag</div>
                                    <div class="btn checkbox" name="bag"></div>
                                    <div><img src="/data/ui/slotbg/105.webp" class="svgicon"> Boot</div>
                                    <div class="btn checkbox" name="boot"></div>
                                    <div><img src="/data/ui/slotbg/106.webp" class="svgicon"> Glove</div>
                                    <div class="btn checkbox" name="glove"></div>
                                    <div><img src="/data/ui/slotbg/107.webp" class="svgicon"> Ring</div>
                                    <div class="btn checkbox" name="ring"></div>
                                    <div><img src="/data/ui/slotbg/108.webp" class="svgicon"> Amulet</div>
                                    <div class="btn checkbox" name="amulet"></div>
                                    <div class="textprimary">Rarity</div>
                                    <div></div>
                                    <div class="textgrey">Common (0% - 49%)</div>
                                    <div class="btn checkbox" name="loot1"></div>
                                    <div class="textgreen">Uncommon (50% - 69%)</div>
                                    <div class="btn checkbox" name="loot2"></div>
                                    <div class="textblue">Rare (70% - 89%)</div>
                                    <div class="btn checkbox" name="loot3"></div>
                                    <div class="textpurp">Epic (90% - 110%)</div>
                                    <div class="btn checkbox" name="loot4"></div>
                                    <div>Item Quality% Minimum<br><small class="textgrey quality-range-indicator">%</small></div>
                                    <input type="range" class="quality-range" name="quality" min="0" max="110">
                                </div>
                                <h3 class="textprimary">Books</h3>
                                <div class="grid-content books">
                                    <div>Lv. 1</div>
                                    <div class="btn checkbox" name="book1"></div>
                                    <div>Lv. 2</div>
                                    <div class="btn checkbox" name="book2"></div>
                                    <div>Lv. 3</div>
                                    <div class="btn checkbox" name="book3"></div>
                                    <div>Lv. 4</div>
                                    <div class="btn checkbox" name="book4"></div>
                                    <div>Lv. 5</div>
                                    <div class="btn checkbox" name="book5"></div>
                                </div>
                                <h3 class="textprimary"></h3>
                            </div>
                        </div>
                    </div>
                </div>`
            );

            document.querySelector('.close-ui').addEventListener('click', e => toggleAutoLootSettings());

            document.querySelector('.restore-default-settings').addEventListener('click', e => {
                for (let key in localStorage) {
                    if (key.startsWith(settingName)) localStorage.removeItem(key);
                }

                location.reload();
            });

            document.querySelectorAll('.auto-loot-ui .scripts .btn.checkbox').forEach((el) => {
                if (vr.intersReady[el.getAttribute("name")]) el.classList.add("active")
                el.addEventListener('click', e => {
                    e.target.classList.contains("active") ? e.target.classList.remove("active") : e.target.classList.add("active");
                    vr.intersReady[e.target.getAttribute("name")] ^= 1;
                    setSetting(e.target.getAttribute("name"), vr.intersReady[e.target.getAttribute("name")]);
                })
            })

            document.querySelectorAll('.auto-loot-ui .main .btn.checkbox, .auto-loot-ui .equipment .btn.checkbox, .auto-loot-ui .books .btn.checkbox').forEach((el) => {
                if (vr.rules[el.getAttribute("name")]) el.classList.add("active")
                el.addEventListener('click', e => {
                    e.target.classList.contains("active") ? e.target.classList.remove("active") : e.target.classList.add("active");
                    vr.rules[e.target.getAttribute("name")] ^= 1;
                    setSetting(e.target.getAttribute("name"), vr.rules[e.target.getAttribute("name")]);
                })
            });

            document.querySelector('.auto-loot-ui .delay .fixed-delay').value = vr.rules.fixedDelay;
            document.querySelector('.auto-loot-ui .delay .fixed-delay-indicator').innerHTML = vr.rules.fixedDelay + " ms";
            document.querySelector('.auto-loot-ui .delay .fixed-delay').addEventListener('input', e => {
                vr.rules.fixedDelay = parseInt(e.target.value);
                document.querySelector('.auto-loot-ui .delay .fixed-delay-indicator').innerHTML = e.target.value + " ms";
                setSetting("fixedDelay", vr.rules.fixedDelay);
            });

            document.querySelector('.auto-loot-ui .delay .random-delay').value = vr.rules.randomDelay;
            document.querySelector('.auto-loot-ui .delay .random-delay-indicator').innerHTML = "0 - " + vr.rules.randomDelay + " ms";
            document.querySelector('.auto-loot-ui .delay .random-delay').addEventListener('input', e => {
                vr.rules.randomDelay = parseInt(e.target.value);
                document.querySelector('.auto-loot-ui .delay .random-delay-indicator').innerHTML = "0 - " + e.target.value + " ms";
                setSetting("randomDelay", vr.rules.randomDelay);
            });

            document.querySelector('.coins-meter-reset').addEventListener('click', e => resetCoinsMeter());

            document.querySelector('.auto-loot-ui .equipment .quality-range').value = vr.rules.quality;
            document.querySelector('.auto-loot-ui .equipment .quality-range-indicator').innerHTML = vr.rules.quality + "%";
            document.querySelector('.auto-loot-ui .equipment .quality-range').addEventListener('input', e => {
                vr.rules.quality = parseInt(e.target.value);
                document.querySelector('.auto-loot-ui .equipment .quality-range-indicator').innerHTML = e.target.value + "%";
                setSetting("quality", vr.rules.quality);
            });

            document.querySelector('.auto-loot-ui .equipment .my-class-indicator').innerHTML = `Your current character is a <img src="/data/ui/classes/${vr.me.class}.webp" class="svgicon"> ${vr.classes[vr.me.class].name}`;
            document.querySelector('.auto-loot-ui .equipment .default-presets-select').addEventListener('change', e => {
                ["sword", "staff", "bow", "hammer", "shield", "orb", "quiver", "totem"].forEach(i => {
                    document.querySelector(`.auto-loot-ui .equipment .btn.checkbox[name="${i}"]`).classList.remove("active");
                    vr.rules[i] = false;
                    setSetting(i, 0);
                });

                vr.classes[e.target.value].droptype.forEach(i => {
                    document.querySelector(`.auto-loot-ui .equipment .btn.checkbox[name="${i}"]`).classList.add("active");
                    vr.rules[i] = true;
                    setSetting(i, 1);
                });
            });
        }
        else {
            document.querySelector('.auto-loot-ui').remove();
        }

        autoLootUI ^= 1;
    }


    // Gold Meter
    const pad = value => value < 10 ? `0${value}` : value;

    function msToString(ms) {
        const hours = pad(Math.floor(ms / (1000 * 60 * 60) % 60));
        const minutes = pad(Math.floor(ms / (1000 * 60) % 60));
        const seconds = pad(Math.floor(ms / 1000 % 60));
        return `${hours}:${minutes}:${seconds}`;
    }

    function formatStringCoins(coins, name) {
        document.querySelector(`.${name} .textgold`).innerHTML = Math.floor(coins / 10000);
        document.querySelector(`.${name} .textsilver`).innerHTML = pad(Math.floor((coins % 10000) / 100));
        document.querySelector(`.${name} .textcopper`).innerHTML = pad(Math.floor((coins % 10000) % 100));
    }

    let startTime = new Date().getTime();

    let currentCoins = 0;
    let coinsEarned = 0;

    function resetCoinsMeter() {
        startTime = new Date().getTime();
        currentCoins = vr.me.inventory.gold;
        coinsEarned = 0;
    }

    setInterval(() => {
        if (!vr.me) return;

        coinsEarned += Math.max(vr.me.inventory.gold - currentCoins, 0);
        currentCoins = vr.me.inventory.gold;
    })

    setInterval(() => {
        if (!autoLootUI) return;

        let midTime = new Date().getTime() - startTime;

        document.querySelector('.coins-meter-time').innerHTML = msToString(midTime);
        formatStringCoins(coinsEarned, "coins-meter-earned");
        formatStringCoins(coinsEarned * 60 / (midTime / 1000), "coins-meter-earned-minute");
        formatStringCoins(coinsEarned * 60 * 60 / (midTime / 1000), "coins-meter-earned-hour");
    })
});