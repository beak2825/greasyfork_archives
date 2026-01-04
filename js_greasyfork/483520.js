// ==UserScript==
// @name The West Auto Registration
// @namespace The West Auto Registration Ru11
// @author Thivinskiy123
// @description The West Auto Registration in one click
// @match *.the-west.ru.com
// @include https://www.the-west.*
// @include https://www.the-west.*.*
// @version 1.14
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/483520/The%20West%20Auto%20Registration.user.js
// @updateURL https://update.greasyfork.org/scripts/483520/The%20West%20Auto%20Registration.meta.js
// ==/UserScript==
(function (fn) {



    // let worlds = Object.values(Worlds.data).filter(w => w.register).map(w => w.world_id);
    // let playerWorlds = Object.keys(Worlds.playerWorlds);

    var script = document.createElement('script');
    script.type = 'application/javascript';
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    script.parentNode.removeChild(script);
})(function () {
    WORLD = 21;
    class AutoRegistration {
        usedNicknames = new Set();
        PASSWORD = '123qwe';
        // https://www.the-west.ru.com/?locale=ru_RU&ref=west_invite_linkrl&player_id=848884684&world_id=1&hash=5ca1
        // https://www.the-west.ru.com/?locale=ru_RU&ref=west_invite_linkrl&player_id=848884684&world_id=11&hash=2926
        // https://www.the-west.ru.com/?locale=ru_RU&ref=west_invite_linkrl&player_id=848884684&world_id=21&hash=22c1
        // https://www.the-west.ru.com/?locale=ru_RU&ref=west_invite_linkrl&player_id=848879425&world_id=21&hash=88c4
        constructor() {
            Auth.friendInviteData = {
                friendid: 848879425,
                h: "88c4",
                worldid: 21
            };
            this.addRegistrationButton();
            console.log('AutoRegistration added')
            if (location.hash.includes('new')) {
                WORLD = parseFloat(location.hash.replace(/\D/g, ''));
                this.registerInOneClick();
                setTimeout(function () {
                    let val = setInterval(function () {
                        let u = Worlds.data;
                        if (Object.keys(u).length !== 0) {
                            clearInterval(val);
                            Auth.login(WORLD);
                        }
                    }, 500);
                }, 10000);
                return;
            }
        }

        async registerInOneClick() {
            const randomUserName = this.generateUniqueUserName();
            const isFree = await this.checkUserName(randomUserName);

            const hashByWorld = {
                1: "5ca1",
                11: "2926",
                21: "88c4",
            }
            if (isFree) {
                this.delCookies()
                console.log(`name ${randomUserName} is free for registration`)
                Auth.friendInviteData = {
                    friendid: 848879425,
                    h: hashByWorld[WORLD],
                    worldid: WORLD
                };
                this.registerUser(randomUserName)
                await this.login()
            } else {
                console.log(`registration ${randomUserName} failed. Trying again...`)
                await this.registerInOneClick();
            }
        }

        addRegistrationButton() {
            const generalInfo = document.getElementsByClassName('pb-news')[0];
            const oneClickRegisterBtn = document.createElement('button');
            oneClickRegisterBtn.innerText = 'One Click Registration';
            oneClickRegisterBtn.style = 'margin-left: 20px;border:1px solid #59595B;padding: 2px 20px;cursor: pointer;border-radius: 4px;';
            oneClickRegisterBtn.onclick = () => this.registerInOneClick();
            generalInfo.after(oneClickRegisterBtn);
        }

        getEmail(username) {
            return `thewestttt4+${username}@gmail.com`
        }

        generateUniqueUserName() {
            const latinConsonants = 'bcdfghjklmnpqrstvwxz';
            const latinVowels = 'aeiou';
            const cyrillicConsonants = 'бвгдждзйклмнпрстфхцчшщ';
            const cyrillicVowels = 'аеёиоуыэюя';

            const themes = {
                fantasy: {
                    prefixes: [
                        'Elf', 'Dark', 'Storm', 'Dragon', 'Shadow', 'Fire', 'Ice', 'Wind', 'Star', 'Moon',
                        'Forest', 'Thunder', 'Crystal', 'Night', 'Dawn', 'Dusk', 'Frost', 'Flame', 'Light', 'Sun',
                        'Phoenix', 'Griffin', 'Wyrm', 'Demon', 'Angel', 'Spirit', 'Ghost', 'Wolf', 'Raven', 'Dragon',
                        'King', 'Queen', 'Lord', 'Lady', 'Knight', 'Elder', 'Ancient', 'Mystic', 'Divine', 'Royal',
                    ],
                    suffixes: [
                        'heart', 'blade', 'soul', 'wing', 'master', 'walker', 'weaver', 'dancer', 'singer', 'seeker',
                        'hunter', 'slayer', 'knight', 'warden', 'guard', 'keeper', 'binder', 'sworn', 'born', 'blessed',
                        'sword', 'shield', 'staff', 'crown', 'ring', 'tome', 'scroll', 'rune', 'stone', 'crystal',
                        'storm', 'flame', 'frost', 'shadow', 'light', 'wind', 'tide', 'bloom', 'star', 'moon'
                    ]
                },
                cyber: {
                    prefixes: [
                        'Cyber', 'Neo', 'Tech', 'Digital', 'Quantum', 'Pixel', 'Data', 'Code', 'Binary', 'Neural',
                        'Crypto', 'Nano', 'Vector', 'Matrix', 'Grid', 'Circuit', 'System', 'Protocol', 'Network', 'Logic',
                        'Alpha', 'Beta', 'Delta', 'Prime', 'Zero', 'Sector', 'Phase', 'Pulse', 'Core', 'Node',
                        'Hyper', 'Ultra', 'Mega', 'Techno', 'Synth', 'Cyber', 'Virtual', 'Dynamic', 'Quantum', 'Nexus'
                    ],
                    suffixes: [
                        'byte', 'net', 'hack', 'bit', 'core', 'void', 'flux', 'node', 'sync', 'wave',
                        'link', 'port', 'gate', 'grid', 'mesh', 'disk', 'frame', 'sphere', 'cache', 'stack',
                        'scan', 'ping', 'trace', 'mine', 'craft', 'script', 'code', 'route', 'shift', 'drift',
                        'array', 'chain', 'loop', 'heap', 'tree', 'graph', 'queue', 'stack', 'hash', 'shell', 'nagibator'
                    ]
                }
            };

            const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
            const getRandomLength = () => Math.floor(Math.random() * 4) + 5;

            const capitalizeWithChance = (word, chance = 0.7) => {
                return Math.random() < chance
                    ? word.charAt(0).toUpperCase() + word.slice(1)
                    : word;
            };

            const generateThematicName = (theme) => {
                const themeData = themes[theme];
                const prefix = getRandomElement(themeData.prefixes);
                const suffix = getRandomElement(themeData.suffixes);
                return `${prefix}${suffix}`;
            };

            let attempt = 0;
            let nickname;

            do {
                let name = '';
                const rand = Math.random();

                if (rand < 0.05) {
                    name = generateThematicName('fantasy');
                } else if (rand < 0.10) {
                    name = generateThematicName('cyber');
                } else if (rand < 0.15) {
                    const baseLength = getRandomLength();
                    for (let i = 0; i < baseLength; i++) {
                        name += getRandomElement(i % 2 === 0 ? latinConsonants : latinVowels);
                    }
                    name = capitalizeWithChance(name);
                    name += Math.floor(Math.random() * 100);
                } else {
                    const useCyrillic = Math.random() < 0.05;
                    const consonants = useCyrillic ? cyrillicConsonants : latinConsonants;
                    const vowels = useCyrillic ? cyrillicVowels : latinVowels;

                    const length = getRandomLength();
                    for (let i = 0; i < length; i++) {
                        name += getRandomElement(i % 2 === 0 ? consonants : vowels);
                    }
                    name = capitalizeWithChance(name);
                }

                nickname = name;
                attempt += 1;
            } while (this.usedNicknames.has(nickname) && attempt < 1000000);

            if (attempt < 1000000) {
                this.usedNicknames.add(nickname);
                return nickname;
            } else {
                throw new Error('Unable to generate a unique pseudonym.');
            }
        }

        async checkUserName(name) {
            const resp = await Ajax.request({
                url: 'index.php?page=register&ajax=check_input&locale=' + Game.locale,
                data: {
                    type: 'name',
                    value: name
                }
            });

            return !resp.error
        }

        registerUser(username) {
            Registration.makeRegistration(WORLD, {
                name: username,
                email: this.getEmail(username),
                agb: 1, // terms checkbox on
                emails_optin: 1, // news checkbox on
                password: username + this.PASSWORD,
                password_confirm: username + this.PASSWORD
            });
        }

        async delCookies() {
            await fetch('/?action=del_cookies');
        }

        async login() {
            await this.clickButton(this.getWorldButton);
        }

        getWorldButton() {
            let worlds = document.getElementsByClassName("world name");

            return worlds[worlds.length - 1];
        }

        async clickButton(getBtnFunction) {
            let btn;
            do {
                await this.wait(100);
                btn = getBtnFunction();
            } while (btn === undefined || btn.classList.contains("inactive"));
            btn.click();
        }

        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    $(document).ready(function () {
        if (location.hash.includes('loginWorld')) {
            setTimeout(function () {
                $('#loginButton').click();
                let val = setInterval(function () {
                  let u = Worlds.playerWorlds;
                  if (Object.keys(u).length !== 0) {
                    clearInterval(val);
                    Auth.login(u[parseFloat(location.hash.replace(/\D/g, ''))]);
                  }
                }, 500);
              }, 1000);
            return;
        }
        if (location.href.includes('index.php?page=logout')) {
            location.href = '/';
            return;
        }
        new AutoRegistration();
    });
});