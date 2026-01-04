// ==UserScript==
// @name         𝗛𝗔𝗥𝗗𝗖𝗢𝗥𝗘 BEST MTSL CS:GO CLICKER MOD MENU v3.2 | INFINITE ROULETTE COINS, INFINITE MONEY, UNLOCK ALL
// @namespace    ORIGINAL CLIENT
// @license      MIT
// @version      v3.2
// @icon         https://github.com/nonumbershere/Hardcore-Client/blob/main/coin_t.png?raw=true
// @description  MTSL CSGO CLICKER CLASSIC MOD MENU HACK/CHEAT, UNLOCK ALL ITEMS, MONEY EDITOR, ETC
// @author       lapide
// @match        *://mtsl.dk/csgo/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange
// @grant        GM_download
// @grant        GM.registerMenuCommand
// @grant        GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/406501/%F0%9D%97%9B%F0%9D%97%94%F0%9D%97%A5%F0%9D%97%97%F0%9D%97%96%F0%9D%97%A2%F0%9D%97%A5%F0%9D%97%98%20BEST%20MTSL%20CS%3AGO%20CLICKER%20MOD%20MENU%20v32%20%7C%20INFINITE%20ROULETTE%20COINS%2C%20INFINITE%20MONEY%2C%20UNLOCK%20ALL.user.js
// @updateURL https://update.greasyfork.org/scripts/406501/%F0%9D%97%9B%F0%9D%97%94%F0%9D%97%A5%F0%9D%97%97%F0%9D%97%96%F0%9D%97%A2%F0%9D%97%A5%F0%9D%97%98%20BEST%20MTSL%20CS%3AGO%20CLICKER%20MOD%20MENU%20v32%20%7C%20INFINITE%20ROULETTE%20COINS%2C%20INFINITE%20MONEY%2C%20UNLOCK%20ALL.meta.js
// ==/UserScript==

(function () {
    var versionT='v'
    var version = "3.2";
      GM.registerMenuCommand("=================== START ===================")
        GM.registerMenuCommand("SET MONEY - Change your balance", function () {
            monedit()
        });
        GM.registerMenuCommand("UNLOCK ALL ITEMS - Hack in some items", function () {
            UnlockAllItems()
        });
        GM.registerMenuCommand("=================== END ===================");
    function encode(w) {
var str = '';
var decode = '';
var n = [];
for (var i = 0; i < w.length; ++i) {
str += w[i];
n.push(w[i].charCodeAt(0) - 65);
}
for (var g = 0; g < n.length; ++g) {
 decode+=( String.fromCharCode(65 + n[g]) );
}
return (n).join(' ');
}
function deco(w) {
var decode = '';
var n = w.split(' ');
for (var g = 0; g < n.length; ++g) {
 decode+=(String.fromCharCode(65 + parseInt(n[g])) );
 //console.log(n);
}
return (decode);
}
unsafeWindow.loadCSave = function(w) {
userdata = JSON.parse(deco(w));
return "Saved!"
}
unsafeWindow.getCSave = function() {
return encode(JSON.stringify(userdata));
}
unsafeWindow.MenuStyle={
background: 'rgb(32 50 141)',
default_button: '#0629a7',
    default_button_margin: '4px',
default_button_hover: '#1c39a1',
opener_hover: 'rgb(29 29 118)',
opener: '#18186a',
font: 'white',
opener_circle_width: '0px',
button_circle_width: '19px'
}
    unsafeWindow.settings = {
loadDiscordFirst: false
    }
unsafeWindow.config = {
    joinedServer: localStorage.getItem('joinedServer')
}
    if (settings.loadDiscordFirst == true) {

if (config.joinedServer == 'false' || config.joinedServer == null) {
    var discord = confirm("Would you like to join the official Discord Server?");

    if (discord) {
        open("https://discord.gg/cEPKrx96nk");

localStorage.setItem('joinedServer', true);
    } else {
        localStorage.setItem('joinedServer', false);
}
} else {
localStorage.setItem('joinedServer', false);
}
    }
    var ver;
    fetch(
        "https://raw.githubusercontent.com/nonumbershere/Hardcore-Client/main/version"
    ).then(function (response) {
        response.text().then(function (text) {
            ver = text.replace("\n", "");
            if (ver == version) {
                console.log("Correct Version");
            } else {
                console.log(
                    "Wrong Version, %cUpdated Needed" +
                    "\n\nVERSION: " +
                    version +
                    "\nUPDATE VERSION: " +
                    ver,
                    "color: red"
                );
                var ne = 'update';
                var vs = parseFloat(version);
                var uvs = parseFloat(ver);
                var c = 'An';
                var ner = 'update';
                if (vs < uvs) {
                    ne = 'update'
                    ner = 'update'
                    c = 'An'
                } else if (vs > uvs) {
                    ne = 'downgrade';
                    ner = 'downgradation';
                    c = 'A';
                } else if (vs == uvs) {

                }
                var g = confirm(
                    c + " " + ner + " is needed! We will " + ne + " you to version " +
                    ver +
                    ", you're on version " +
                    version +
                    ". Do you want to " + ne + " now?"
                );
                if (g == true) {
                    open(
                        "https://greasyfork.org/scripts/406501-%F0%9D%97%9B%F0%9D%97%94%F0%9D%97%A5%F0%9D%97%97%F0%9D%97%96%F0%9D%97%A2%F0%9D%97%A5%F0%9D%97%98-cs-go-clicker-hack-v2-working-csgo/code/%F0%9D%97%9B%F0%9D%97%94%F0%9D%97%A5%F0%9D%97%97%F0%9D%97%96%F0%9D%97%A2%F0%9D%97%A5%F0%9D%97%98%20CS:GO%20CLICKER%20HACK%20v2%20%7C%20WORKING%20CSGO.user.js"
                    );
                } else {
                    alert("Okay!");
                }
            }
        });
    });

    function setRouletteCoins(num) {
        unsafeWindow.userdata.roulette = num;
    }

    function unlockAllKeys() {
        unsafeWindow.userdata.inv.push({
            name: "Spectrum Case Key",
            price: 2.4,
            class: "standard",
            case: "spectrum",
            type: "key",
        }, {
            name: "CS:GO Weapon Case Key",
            price: 2.4,
            class: "standard",
            case: "csgo_weapon csgo_weapon2 csgo_weapon3",
            type: "key",
        }, {
            name: "Shadow Case Key",
            price: 2.4,
            class: "standard",
            case: "shadow",
            type: "key",
        }, {
            name: "Falchion Case Key",
            price: 2.4,
            class: "standard",
            case: "falchion",
            type: "key",
        }, {
            name: "Operation Vanguard Case Key",
            price: 2.4,
            class: "standard",
            case: "vanguard",
            type: "key",
        }, {
            name: "Chroma Case Key",
            price: 2.4,
            class: "standard",
            case: "chroma",
            type: "key",
        }, {
            name: "Gamma Case Key",
            price: 2.4,
            class: "standard",
            case: "gamma",
            type: "key",
        }, {
            name: "Chroma Case 2 Key",
            price: 2.4,
            class: "standard",
            case: "chroma2",
            type: "key",
        }, {
            name: "Gamma Case 2 Key",
            price: 2.4,
            class: "standard",
            case: "gamma2",
            type: "key",
        }, {
            name: "Chroma Case 3 Key",
            price: 2.4,
            class: "standard",
            case: "chroma3",
            type: "key",
        }, {
            name: "Operation Hydra Case Key",
            price: 2.4,
            class: "standard",
            case: "hydra",
            type: "key",
        }, {
            name: "Revolver Case Key",
            price: 2.4,
            class: "standard",
            case: "revolver",
            type: "key",
        });
    }

    function unlockAllKnives() {
        userdata.inv.push(
            // Bayonet
            {
                name: "Bayonet",
                price: 230.07,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Gamma Doppler",
                price: 467.11,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Lore",
                price: 292.69,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Autotronic",
                price: 312.32,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Freehand",
                price: 240.71,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Black Laminate",
                price: 232.73,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Bright Water",
                price: 199.95,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Marble Fade",
                price: 418.77,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Tiger Tooth",
                price: 346.73,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Doppler",
                price: 305.14,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Damascus Steel",
                price: 205.02,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Ultraviolet",
                price: 175.54,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Rust Coat",
                price: 187.15,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Fade",
                price: 325.48,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Slaughter",
                price: 276.2,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Crimson Web",
                price: 196.81,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Case Hardened",
                price: 211.64,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Blue Steel",
                price: 103.9,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Urban Masked",
                price: 168.86,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Stained",
                price: 181.83,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Forest DDPAT",
                price: 167.7,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Boreal Forest",
                price: 166.49,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Night",
                price: 177.09,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Scorched",
                price: 165.34,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Safari Mesh",
                price: 164.11,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            },

            // Falchion Knife
            {
                name: "Falchion",
                price: 160.84,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Marble Fade",
                price: 384.0,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Doppler",
                price: 329.58,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Tiger Tooth",
                price: 283.11,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Damascus Steel",
                price: 177.16,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Ultraviolet",
                price: 163.66,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Rust Coat",
                price: 157.38,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Night",
                price: 147.31,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Fade",
                price: 216.78,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Slaughter",
                price: 193.31,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Urban Masked",
                price: 146.69,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Crimson Web",
                price: 156.26,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Forest DDPAT",
                price: 147.91,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Case Hardened",
                price: 161.43,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Blue Steel",
                price: 161.01,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Boreal Forest",
                price: 147.42,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Safari Mesh",
                price: 144.32,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Stained",
                price: 150.79,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Scorched",
                price: 146.08,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            },

            // Shadow Daggers
            {
                name: "Shadow Daggers",
                price: 177.54,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Marble Fade",
                price: 314.13,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Tiger Tooth",
                price: 295.27,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Doppler",
                price: 310.12,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Damascus Steel",
                price: 164.39,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Ultraviolet",
                price: 175.05,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Rust Coat",
                price: 159.66,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Fade",
                price: 225.08,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Crimson Web",
                price: 164.14,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Slaughter",
                price: 194.26,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Blue Steel",
                price: 155.02,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Case Hardened",
                price: 163.33,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Night",
                price: 149.56,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Stained",
                price: 151.44,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Scorched",
                price: 146.03,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Urban Masked",
                price: 149.29,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Forest DDPAT",
                price: 146.16,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Safari Mesh",
                price: 145.42,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Boreal Forest",
                price: 147.44,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            },

            // Butterfly
            {
                name: "Butterfly",
                price: 229.75,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Marble Fade",
                price: 788.55,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Doppler",
                price: 732.15,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Tiger Tooth",
                price: 503.11,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Damascus Steel",
                price: 214.78,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Ultraviolet",
                price: 192.83,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Rust Coat",
                price: 126.24,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Fade",
                price: 359.52,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Crimson Web",
                price: 205.35,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Slaughter",
                price: 297.24,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Case Hardened",
                price: 215.89,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Blue Steel",
                price: 213.75,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Night",
                price: 190.62,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Stained",
                price: 191.78,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Urban Masked",
                price: 173.34,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Forest DDPAT",
                price: 173.29,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Scorched",
                price: 174.85,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Boreal Forest",
                price: 173.43,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Safari Mesh",
                price: 172.92,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            },

            // Karambit
            {
                name: "Karambit",
                price: 307.77,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Autotronic",
                price: 464.92,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Gamma Doppler",
                price: 681.66,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Lore",
                price: 420.65,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Black Laminate",
                price: 354.54,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Freehand",
                price: 331.23,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Bright Water",
                price: 275.35,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Marble Fade",
                price: 622.31,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Tiger Tooth",
                price: 542.13,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Doppler",
                price: 438.37,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Damascus Steel",
                price: 308.87,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Ultraviolet",
                price: 255.35,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Rust Coat",
                price: 256.7,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Fade",
                price: 630.03,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Case Hardened",
                price: 319.69,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Crimson Web",
                price: 303.88,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Night",
                price: 150.57,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Slaughter",
                price: 406.19,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Blue Steel",
                price: 280.97,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Stained",
                price: 261.72,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Boreal Forest",
                price: 226.43,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Forest DDPAT",
                price: 214.78,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Urban Masked",
                price: 214.78,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Scorched",
                price: 214.96,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Safari Mesh",
                price: 209.81,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }
        );
    }

    function unlockAllCases() {
        userdata.inv.push({
            name: "Gamma Case",
            price: 0.75,
            class: "standard",
            case: "gamma",
            type: "case",
            needkey: true,
            rankNeeded: 1,
        }, {
            name: "Chroma Case",
            price: 0.5,
            class: "standard",
            case: "chroma",
            type: "case",
            needkey: true,
            rankNeeded: 1,
        }, {
            name: "Spectrum Case",
            price: 1.0,
            class: "standard",
            case: "spectrum",
            type: "case",
            needkey: true,
            rankNeeded: 1,
        }, {
            name: "CS:GO Weapon Case",
            price: 6.0,
            class: "standard",
            case: "csgo_weapon",
            type: "case",
            needkey: true,
            rankNeeded: 1,
        }, {
            name: "CS:GO Weapon Case 2",
            price: 5.0,
            class: "standard",
            case: "csgo_weapon2",
            type: "case",
            needkey: true,
            rankNeeded: 2,
        }, {
            name: "Stattrak Case",
            price: 2.0,
            class: "standard",
            case: "stattrak",
            type: "case",
            needkey: false,
            rankNeeded: 2,
        }, {
            name: "Shadow Case",
            price: 3.5,
            class: "standard",
            case: "shadow",
            type: "case",
            needkey: true,
            rankNeeded: 2,
        }, {
            name: "Falchion Case",
            price: 1.75,
            class: "standard",
            case: "falchion",
            type: "case",
            needkey: true,
            rankNeeded: 2,
        }, {
            name: "The Gods and Monsters Collection",
            price: 35.0,
            class: "standard",
            case: "gods_and_monsters",
            type: "case",
            needkey: false,
            rankNeeded: 2,
        }, {
            name: "CS:GO Weapon Case 3",
            price: 2.3,
            class: "standard",
            case: "csgo_weapon3",
            type: "case",
            needkey: true,
            rankNeeded: 3,
        }, {
            name: "Operation Vanguard Weapon Case",
            price: 10.0,
            class: "standard",
            case: "vanguard",
            type: "case",
            needkey: true,
            rankNeeded: 3,
        }, {
            name: "The Cobblestone Collection",
            price: 40.0,
            class: "standard",
            case: "cobblestone",
            type: "case",
            needkey: false,
            rankNeeded: 3,
        }, {
            name: "Stattrak Case 2",
            price: 3.5,
            class: "standard",
            case: "stattrak2",
            type: "case",
            needkey: false,
            rankNeeded: 4,
        }, {
            name: "Chroma Case 2",
            price: 1.5,
            class: "standard",
            case: "chroma2",
            type: "case",
            needkey: true,
            rankNeeded: 4,
        }, {
            name: "Operation Hydra Case",
            price: 8.0,
            class: "standard",
            case: "hydra",
            type: "case",
            needkey: true,
            rankNeeded: 4,
        }, {
            name: "Revolver Case",
            price: 2.6,
            class: "standard",
            case: "revolver",
            type: "case",
            needkey: true,
            rankNeeded: 4,
        }, {
            name: "Gamma Case 2",
            price: 1.5,
            class: "standard",
            case: "gamma2",
            type: "case",
            needkey: true,
            rankNeeded: 5,
        }, {
            name: "Stattrak Case 3",
            price: 10.0,
            class: "standard",
            case: "stattrak3",
            type: "case",
            needkey: false,
            rankNeeded: 5,
        }, {
            name: "Knife Case",
            price: 1000.0,
            class: "standard",
            case: "knife",
            type: "case",
            needkey: false,
            rankNeeded: 5,
        }, {
            name: "Chroma Case 3",
            price: 1.5,
            class: "standard",
            case: "chroma3",
            type: "case",
            needkey: true,
            rankNeeded: 5,
        }, {
            name: "The Chop Shop Collection",
            price: 18.0,
            class: "standard",
            case: "chopshop",
            type: "case",
            needkey: false,
            rankNeeded: 4,
        }, {
            name: "Stattrak Case 4",
            price: 200.0,
            class: "standard",
            case: "stattrak4",
            type: "case",
            needkey: false,
            rankNeeded: 6,
        }, {
            name: "The Rising Sun Collection",
            price: 7.5,
            class: "standard",
            case: "risingsun",
            type: "case",
            needkey: true,
            rankNeeded: 4,
        });
    }

    var prefix = "";

    function injectCss(css) {
        var style = document.createElement("style");
        style.innerHTML = css;
        document.body.append(style);
    }

    function runcommand(cmd) {
        var cmd1 = cmd.toLowerCase().slice(prefix.length).split(" ");
        switch (cmd1[0]) {
            case "help":
                alert(
                    `Commands\n\n--\n\n${prefix}help : Shows help commands\n${prefix}clicker : Has all source for the Click elemenet\nclicker text : Changes the text of the clicker\nclicker color : Changes the color of the clicker\ncontent : Injections\ncontent js : Injects javascript\ncontent css : Injects css\n${prefix}style : Changes style, such as title and cursors\n${prefix}syle cursor : Changes the cursor`
                );
                commands();
                break;
            case "clicker":
                switch (cmd1[1]) {
                    case "text":
                        document.querySelector("#click_cookie_m_inner").innerText =
                            cmd.replace(`${prefix}clicker text `, "");
                        break;
                    case "color":
                        document.querySelector("#click_cookie_m_inner").style.color =
                            cmd.replace(`${prefix}clicker color `, "");
                        break;
                }
                case "content":
                    switch (cmd1[1]) {
                        case "js":
                            eval(cmd.replace(`${prefix}content js `, ""));
                            break;
                        case "css":
                            injectCss(cmd.replace(`${prefix}content css `, ""));
                            break;
                    }
                    break;
                case "style":
                    switch (cmd1[1]) {
                        case "cursor":
                            document.body.style.cursor = cmd.replace(
                                `${prefix}style cursor `,
                                ""
                            );
                            break;
                    }
                    break;
                    break;
        }
        console.log(cmd + "\n\n\n\n-\n" + cmd1);
    }

    function commands() {
        var cmd = prompt(`Do ${prefix}help for commands`, `${prefix}help`);
        if (cmd) {
            runcommand(cmd);
        } else {}
    }

    function setAM(dat) {
        unsafeWindow.userdata.upgrades["+CASH"].amount = dat;
        unsafeWindow.userdata.upgrades["Bank"].amount = dat;
        unsafeWindow.userdata.upgrades["Luck"].amount = dat;
        unsafeWindow.userdata.upgrades["Offline Production"].amount = dat;
        unsafeWindow.userdata.upgrades["Online Production"].amount = dat;
    }

    function monedit() {
        var g = prompt("Money Editor", "100000");
        if (g) {
            unsafeWindow.userdata.money = parseInt(g);
            alert("Changed money to " + g);
        }
    }

    function freeUpgrades() {
        unsafeWindow.upgrades = [{
                name: "Bank",
                price: 0,
                dec: "Earn 50€ more when offline",
                priceboost: 4.9,
            },
            {
                name: "Offline Production",
                price: 0,
                dec: "Earn offline money faster",
                priceboost: 3.2,
            },
            {
                name: "+CASH",
                price: 0,
                dec: "Get more cash per click",
                priceboost: 1.9,
            },
            {
                name: "Luck",
                price: 0,
                dec: "Higher chance of opening good skins",
                priceboost: 21.3,
            },
            {
                name: "Online Production",
                price: 0,
                dec: "+0.10€ every secound",
                priceboost: 3.2,
            },
        ];
    }

    function unlock() {
        var m = document.getElementsByClassName("disabledIf rankNeeded");
        for (var i = 0; i < m.length; i++) {
            m[i].setAttribute("min", "0");
            m[i].setAttribute("minrank", "0");
        }
        var m1 = document.getElementsByClassName("disabledIf");
        for (var i1 = 0; i1 < m1.length; i1++) {
            m1[i1].setAttribute("min", "0");
            m1[i1].setAttribute("minrank", "0");
        }
    }

    function UnlockAllItems() {
        unsafeWindow.userdata.inv.push(
            // Cases
            {
                name: "Gamma Case",
                price: 0.75,
                class: "standard",
                case: "gamma",
                type: "case",
                needkey: true,
                rankNeeded: 1,
            }, {
                name: "Chroma Case",
                price: 0.5,
                class: "standard",
                case: "chroma",
                type: "case",
                needkey: true,
                rankNeeded: 1,
            }, {
                name: "Spectrum Case",
                price: 1.0,
                class: "standard",
                case: "spectrum",
                type: "case",
                needkey: true,
                rankNeeded: 1,
            }, {
                name: "CS:GO Weapon Case",
                price: 6.0,
                class: "standard",
                case: "csgo_weapon",
                type: "case",
                needkey: true,
                rankNeeded: 1,
            }, {
                name: "CS:GO Weapon Case 2",
                price: 5.0,
                class: "standard",
                case: "csgo_weapon2",
                type: "case",
                needkey: true,
                rankNeeded: 2,
            }, {
                name: "Stattrak Case",
                price: 2.0,
                class: "standard",
                case: "stattrak",
                type: "case",
                needkey: false,
                rankNeeded: 2,
            }, {
                name: "Shadow Case",
                price: 3.5,
                class: "standard",
                case: "shadow",
                type: "case",
                needkey: true,
                rankNeeded: 2,
            }, {
                name: "Falchion Case",
                price: 1.75,
                class: "standard",
                case: "falchion",
                type: "case",
                needkey: true,
                rankNeeded: 2,
            }, {
                name: "The Gods and Monsters Collection",
                price: 35.0,
                class: "standard",
                case: "gods_and_monsters",
                type: "case",
                needkey: false,
                rankNeeded: 2,
            }, {
                name: "CS:GO Weapon Case 3",
                price: 2.3,
                class: "standard",
                case: "csgo_weapon3",
                type: "case",
                needkey: true,
                rankNeeded: 3,
            }, {
                name: "Operation Vanguard Weapon Case",
                price: 10.0,
                class: "standard",
                case: "vanguard",
                type: "case",
                needkey: true,
                rankNeeded: 3,
            }, {
                name: "The Cobblestone Collection",
                price: 40.0,
                class: "standard",
                case: "cobblestone",
                type: "case",
                needkey: false,
                rankNeeded: 3,
            }, {
                name: "Stattrak Case 2",
                price: 3.5,
                class: "standard",
                case: "stattrak2",
                type: "case",
                needkey: false,
                rankNeeded: 4,
            }, {
                name: "Chroma Case 2",
                price: 1.5,
                class: "standard",
                case: "chroma2",
                type: "case",
                needkey: true,
                rankNeeded: 4,
            }, {
                name: "Operation Hydra Case",
                price: 8.0,
                class: "standard",
                case: "hydra",
                type: "case",
                needkey: true,
                rankNeeded: 4,
            }, {
                name: "Revolver Case",
                price: 2.6,
                class: "standard",
                case: "revolver",
                type: "case",
                needkey: true,
                rankNeeded: 4,
            }, {
                name: "Gamma Case 2",
                price: 1.5,
                class: "standard",
                case: "gamma2",
                type: "case",
                needkey: true,
                rankNeeded: 5,
            }, {
                name: "Stattrak Case 3",
                price: 10.0,
                class: "standard",
                case: "stattrak3",
                type: "case",
                needkey: false,
                rankNeeded: 5,
            }, {
                name: "Knife Case",
                price: 1000.0,
                class: "standard",
                case: "knife",
                type: "case",
                needkey: false,
                rankNeeded: 5,
            }, {
                name: "Chroma Case 3",
                price: 1.5,
                class: "standard",
                case: "chroma3",
                type: "case",
                needkey: true,
                rankNeeded: 5,
            }, {
                name: "The Chop Shop Collection",
                price: 18.0,
                class: "standard",
                case: "chopshop",
                type: "case",
                needkey: false,
                rankNeeded: 4,
            }, {
                name: "Stattrak Case 4",
                price: 200.0,
                class: "standard",
                case: "stattrak4",
                type: "case",
                needkey: false,
                rankNeeded: 6,
            }, {
                name: "The Rising Sun Collection",
                price: 7.5,
                class: "standard",
                case: "risingsun",
                type: "case",
                needkey: true,
                rankNeeded: 4,
            },

            // Keys
            {
                name: "Spectrum Case Key",
                price: 2.4,
                class: "standard",
                case: "spectrum",
                type: "key",
            }, {
                name: "CS:GO Weapon Case Key",
                price: 2.4,
                class: "standard",
                case: "csgo_weapon csgo_weapon2 csgo_weapon3",
                type: "key",
            }, {
                name: "Shadow Case Key",
                price: 2.4,
                class: "standard",
                case: "shadow",
                type: "key",
            }, {
                name: "Falchion Case Key",
                price: 2.4,
                class: "standard",
                case: "falchion",
                type: "key",
            }, {
                name: "Operation Vanguard Case Key",
                price: 2.4,
                class: "standard",
                case: "vanguard",
                type: "key",
            }, {
                name: "Chroma Case Key",
                price: 2.4,
                class: "standard",
                case: "chroma",
                type: "key",
            }, {
                name: "Gamma Case Key",
                price: 2.4,
                class: "standard",
                case: "gamma",
                type: "key",
            }, {
                name: "Chroma Case 2 Key",
                price: 2.4,
                class: "standard",
                case: "chroma2",
                type: "key",
            }, {
                name: "Gamma Case 2 Key",
                price: 2.4,
                class: "standard",
                case: "gamma2",
                type: "key",
            }, {
                name: "Chroma Case 3 Key",
                price: 2.4,
                class: "standard",
                case: "chroma3",
                type: "key",
            }, {
                name: "Operation Hydra Case Key",
                price: 2.4,
                class: "standard",
                case: "hydra",
                type: "key",
            }, {
                name: "Revolver Case Key",
                price: 2.4,
                class: "standard",
                case: "revolver",
                type: "key",
            },

            // Knifes
            // Bayonet
            {
                name: "Bayonet",
                price: 230.07,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Gamma Doppler",
                price: 467.11,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Lore",
                price: 292.69,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Autotronic",
                price: 312.32,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Freehand",
                price: 240.71,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Black Laminate",
                price: 232.73,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Bright Water",
                price: 199.95,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Marble Fade",
                price: 418.77,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Tiger Tooth",
                price: 346.73,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Doppler",
                price: 305.14,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Damascus Steel",
                price: 205.02,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Ultraviolet",
                price: 175.54,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Rust Coat",
                price: 187.15,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Fade",
                price: 325.48,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Slaughter",
                price: 276.2,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Crimson Web",
                price: 196.81,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Case Hardened",
                price: 211.64,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Blue Steel",
                price: 103.9,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Urban Masked",
                price: 168.86,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Stained",
                price: 181.83,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Forest DDPAT",
                price: 167.7,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Boreal Forest",
                price: 166.49,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Night",
                price: 177.09,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Scorched",
                price: 165.34,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Bayonet | Safari Mesh",
                price: 164.11,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            },

            // Falchion Knife
            {
                name: "Falchion",
                price: 160.84,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Marble Fade",
                price: 384.0,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Doppler",
                price: 329.58,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Tiger Tooth",
                price: 283.11,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Damascus Steel",
                price: 177.16,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Ultraviolet",
                price: 163.66,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Rust Coat",
                price: 157.38,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Night",
                price: 147.31,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Fade",
                price: 216.78,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Slaughter",
                price: 193.31,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Urban Masked",
                price: 146.69,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Crimson Web",
                price: 156.26,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Forest DDPAT",
                price: 147.91,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Case Hardened",
                price: 161.43,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Blue Steel",
                price: 161.01,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Boreal Forest",
                price: 147.42,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Safari Mesh",
                price: 144.32,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Stained",
                price: 150.79,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            }, {
                name: "Falchion | Scorched",
                price: 146.08,
                class: "exceedingly_rare",
                case: "knife spectrum falchion",
                type: "skin",
                stattrak: true,
            },

            // Shadow Daggers
            {
                name: "Shadow Daggers",
                price: 177.54,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Marble Fade",
                price: 314.13,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Tiger Tooth",
                price: 295.27,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Doppler",
                price: 310.12,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Damascus Steel",
                price: 164.39,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Ultraviolet",
                price: 175.05,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Rust Coat",
                price: 159.66,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Fade",
                price: 225.08,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Crimson Web",
                price: 164.14,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Slaughter",
                price: 194.26,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Blue Steel",
                price: 155.02,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Case Hardened",
                price: 163.33,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Night",
                price: 149.56,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Stained",
                price: 151.44,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Scorched",
                price: 146.03,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Urban Masked",
                price: 149.29,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Forest DDPAT",
                price: 146.16,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Safari Mesh",
                price: 145.42,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            }, {
                name: "Shadow Daggers | Boreal Forest",
                price: 147.44,
                class: "exceedingly_rare",
                case: "knife shadow",
                type: "skin",
                stattrak: true,
            },

            // Butterfly
            {
                name: "Butterfly",
                price: 229.75,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Marble Fade",
                price: 788.55,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Doppler",
                price: 732.15,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Tiger Tooth",
                price: 503.11,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Damascus Steel",
                price: 214.78,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Ultraviolet",
                price: 192.83,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Rust Coat",
                price: 126.24,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Fade",
                price: 359.52,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Crimson Web",
                price: 205.35,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Slaughter",
                price: 297.24,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Case Hardened",
                price: 215.89,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Blue Steel",
                price: 213.75,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Night",
                price: 190.62,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Stained",
                price: 191.78,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Urban Masked",
                price: 173.34,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Forest DDPAT",
                price: 173.29,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Scorched",
                price: 174.85,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Boreal Forest",
                price: 173.43,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            }, {
                name: "Butterfly | Safari Mesh",
                price: 172.92,
                class: "exceedingly_rare",
                case: "knife spectrum",
                type: "skin",
                stattrak: true,
            },

            // Karambit
            {
                name: "Karambit",
                price: 307.77,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Autotronic",
                price: 464.92,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Gamma Doppler",
                price: 681.66,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Lore",
                price: 420.65,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Black Laminate",
                price: 354.54,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Freehand",
                price: 331.23,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Bright Water",
                price: 275.35,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Marble Fade",
                price: 622.31,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Tiger Tooth",
                price: 542.13,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Doppler",
                price: 438.37,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Damascus Steel",
                price: 308.87,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Ultraviolet",
                price: 255.35,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Rust Coat",
                price: 256.7,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Fade",
                price: 630.03,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Case Hardened",
                price: 319.69,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Crimson Web",
                price: 303.88,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Night",
                price: 150.57,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Slaughter",
                price: 406.19,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Blue Steel",
                price: 280.97,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Stained",
                price: 261.72,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Boreal Forest",
                price: 226.43,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Forest DDPAT",
                price: 214.78,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Urban Masked",
                price: 214.78,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Scorched",
                price: 214.96,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            }, {
                name: "Karambit | Safari Mesh",
                price: 209.81,
                class: "exceedingly_rare",
                case: "knife csgo_weapon csgo_weapon2 csgo_weapon3 vanguard",
                type: "skin",
                stattrak: true,
            },

            //  Spectrum case
            {
                name: "AK-47 | Bloodsport",
                price: 56.95,
                class: "covert",
                case: "spectrum stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "USP-S | Neo-Noir",
                price: 14.59,
                class: "covert",
                case: "spectrum stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A1-S | Decimator",
                price: 12.62,
                class: "classified",
                case: "spectrum stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AWP | Fever Dream",
                price: 9.88,
                class: "classified",
                case: "spectrum stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Xiangliu",
                price: 4.58,
                class: "classified",
                case: "spectrum stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Scaffold",
                price: 1.11,
                class: "restricted",
                case: "spectrum stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "M249 | Emerald Poison Dart",
                price: 1.12,
                class: "restricted",
                case: "spectrum stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Seasons",
                price: 1.13,
                class: "restricted",
                case: "spectrum stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Galil AR | Crimson Tsunami",
                price: 1.12,
                class: "restricted",
                case: "spectrum stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAC-10 | Last Dive",
                price: 1.08,
                class: "restricted",
                case: "spectrum stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Oxide Blaze",
                price: 0.5,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Capillary",
                price: 0.15,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Ripple",
                price: 0.12,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Blueprint",
                price: 0.11,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Zander",
                price: 0.1,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP7 | Akoben",
                price: 0.11,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "PP-Bizon | Jungle Slipstream",
                price: 0.12,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            },

            //  Cobblestone Collection
            {
                name: "AWP | Dragon Lore",
                price: 729.53,
                class: "covert",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "M4A1-S | Knight",
                price: 315.24,
                class: "classified",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "Desert Eagle | Hand Cannon",
                price: 34.33,
                class: "restricted",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "CZ75-Auto | Chalice",
                price: 34.41,
                class: "restricted",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "P2000 | Chainmail",
                price: 4.93,
                class: "milspec",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "MP9 | Dark Age",
                price: 4.67,
                class: "milspec",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "USP-S | Royal Blue",
                price: 0.6,
                class: "industrial",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "MAG-7 | Silver",
                price: 0.55,
                class: "industrial",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "Nova | Green Apple",
                price: 0.5,
                class: "industrial",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "Sawed-Off | Rust Coat",
                price: 0.53,
                class: "industrial",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "UMP-45 | Indigo",
                price: 0.09,
                class: "consumer",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "MAC-10 | Indigo",
                price: 0.09,
                class: "consumer",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "P90 | Storm",
                price: 0.09,
                class: "consumer",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "SCAR-20 | Storm",
                price: 0.09,
                class: "consumer",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "Dual Berettas | Briar",
                price: 0.11,
                class: "consumer",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            },

            //  CS:GO Weapon Case
            {
                name: "AWP | Lightning Strike",
                price: 56.9,
                class: "covert",
                case: "csgo_weapon stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Case Hardened",
                price: 24.41,
                class: "classified",
                case: "csgo_weapon stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Hypnotic",
                price: 8.24,
                class: "classified",
                case: "csgo_weapon stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Dragon Tattoo",
                price: 7.19,
                class: "restricted",
                case: "csgo_weapon stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A1-S | Dark Water",
                price: 5.39,
                class: "restricted",
                case: "csgo_weapon stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "USP-S | Dark Water",
                price: 5.73,
                class: "restricted",
                case: "csgo_weapon stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "SG 553 | Ultraviolet",
                price: 0.81,
                class: "milspec",
                case: "csgo_weapon stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "AUG | Wings",
                price: 0.96,
                class: "milspec",
                case: "csgo_weapon stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP7 | Skulls",
                price: 0.86,
                class: "milspec",
                case: "csgo_weapon stattrak",
                type: "skin",
                stattrak: true,
            },

            //  CS:GO Weapon Case 2
            {
                name: "SSG 08 | Blood in the Water",
                price: 16.91,
                class: "covert",
                case: "csgo_weapon2 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "P90 | Cold Blooded",
                price: 5.11,
                class: "classified",
                case: "csgo_weapon2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "USP-S | Serum",
                price: 5.73,
                class: "classified",
                case: "csgo_weapon2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Case Hardened",
                price: 2.9,
                class: "restricted",
                case: "csgo_weapon2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP9 | Hypnotic",
                price: 1.1,
                class: "restricted",
                case: "csgo_weapon2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Nova | Graphite",
                price: 0.75,
                class: "restricted",
                case: "csgo_weapon2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Dual Berettas | Hemoglobin",
                price: 0.84,
                class: "restricted",
                case: "csgo_weapon2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A1-S | Blood Tiger",
                price: 1.81,
                class: "milspec",
                case: "csgo_weapon2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Crimson Web",
                price: 0.66,
                class: "milspec",
                case: "csgo_weapon2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "FAMAS | Hexane",
                price: 0.71,
                class: "milspec",
                case: "csgo_weapon2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Blue Titanium",
                price: 0.94,
                class: "milspec",
                case: "csgo_weapon2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Hive",
                price: 0.7,
                class: "milspec",
                case: "csgo_weapon2 stattrak",
                type: "skin",
                stattrak: true,
            },

            //  CS:GO Weapon Case 3
            {
                name: "CZ75-Auto | Victoria",
                price: 2.46,
                class: "covert",
                case: "csgo_weapon3 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | The Fuschia Is Now",
                price: 1.89,
                class: "classified",
                case: "csgo_weapon3 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Undertow",
                price: 3.05,
                class: "classified",
                case: "csgo_weapon3 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Heirloom",
                price: 0.68,
                class: "restricted",
                case: "csgo_weapon3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Copper Galaxy",
                price: 0.95,
                class: "restricted",
                case: "csgo_weapon3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Titanium Bit",
                price: 0.64,
                class: "restricted",
                case: "csgo_weapon3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Tread Plate",
                price: 0.45,
                class: "restricted",
                case: "csgo_weapon3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Crimson Web",
                price: 0.14,
                class: "milspec",
                case: "csgo_weapon3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "USP-S | Stainless",
                price: 1.39,
                class: "milspec",
                case: "csgo_weapon3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Blue Fissure",
                price: 0.47,
                class: "milspec",
                case: "csgo_weapon3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Dual Berettas | Panther",
                price: 0.14,
                class: "milspec",
                case: "csgo_weapon3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Red FragCam",
                price: 0.12,
                class: "milspec",
                case: "csgo_weapon3 stattrak",
                type: "skin",
                stattrak: true,
            },

            //  Shadow Case
            {
                name: "USP-S | Kill Confirmed",
                price: 22.94,
                class: "covert",
                case: "shadow stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A1-S | Golden Coil",
                price: 9.83,
                class: "covert",
                case: "shadow stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Frontside Misty",
                price: 7.28,
                class: "classified",
                case: "shadow stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "SGG 08 | Big Iron",
                price: 1.83,
                class: "classified",
                case: "shadow stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "G3SG1 | Flux",
                price: 2.0,
                class: "classified",
                case: "shadow stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Wingshot",
                price: 0.46,
                class: "restricted",
                case: "shadow stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Galil AR | Stone Cold",
                price: 0.44,
                class: "restricted",
                case: "shadow stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "M249 | Nebula Crusader",
                price: 0.45,
                class: "restricted",
                case: "shadow stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP7 | Special Delivery",
                price: 0.47,
                class: "restricted",
                case: "shadow stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Dual Berettas | Dualing Dragons",
                price: 0.1,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Wraiths",
                price: 0.11,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "FAMAS | Survivor Z",
                price: 0.11,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Scumbria",
                price: 0.09,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAG-7 | Cobalt Core",
                price: 0.09,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAC-10 | Rangeen",
                price: 0.09,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Green Marine",
                price: 0.09,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            },

            // Falchion case
            {
                name: "AWP | Hyper Beast",
                price: 12.72,
                class: "covert",
                case: "falchion stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Aquamarine Revenge",
                price: 10.98,
                class: "covert",
                case: "falchion stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "SG 553 | Cyrex",
                price: 1.72,
                class: "classified",
                case: "falchion stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP7 | Nemesis",
                price: 2.39,
                class: "classified",
                case: "falchion stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Yellow Jacket",
                price: 1.72,
                class: "classified",
                case: "falchion stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A4 | Evil Daimyo",
                price: 1.32,
                class: "restricted",
                case: "falchion stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Negev | Loudmouth",
                price: 0.22,
                class: "restricted",
                case: "falchion stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Handgun",
                price: 0.24,
                class: "restricted",
                case: "falchion stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP9 | Ruby Poison Dart",
                price: 0.22,
                class: "restricted",
                case: "falchion stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "FAMAS | Neural Net",
                price: 0.23,
                class: "restricted",
                case: "falchion stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "USP-S | Torque",
                price: 0.55,
                class: "milspec",
                case: "falchion stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Bunsen Burner",
                price: 0.17,
                class: "milspec",
                case: "falchion stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P90 | Elite Build",
                price: 0.1,
                class: "milspec",
                case: "falchion stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Galil AR | Rocket Pop",
                price: 0.1,
                class: "milspec",
                case: "falchion stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Riot",
                price: 0.09,
                class: "milspec",
                case: "falchion stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Nova | Ranger",
                price: 0.09,
                class: "milspec",
                case: "falchion stattrak",
                type: "skin",
                stattrak: true,
            },

            //  Vanguard case
            {
                name: "AK-47 | Wasteland Rebel",
                price: 16.54,
                class: "covert",
                case: "vanguard stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Fire Elemental",
                price: 4.49,
                class: "covert",
                case: "vanguard stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Cartel",
                price: 1.94,
                class: "classified",
                case: "vanguard stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Cardiac",
                price: 1.53,
                class: "classified",
                case: "vanguard stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Tranquility",
                price: 1.76,
                class: "classified",
                case: "vanguard stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A4 | Griffin",
                price: 1.72,
                class: "restricted",
                case: "vanguard stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A1-S | Basilisk",
                price: 1.23,
                class: "restricted",
                case: "vanguard stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Grinder",
                price: 0.56,
                class: "restricted",
                case: "vanguard stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Highwayman",
                price: 0.23,
                class: "restricted",
                case: "vanguard stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Delusion",
                price: 0.17,
                class: "restricted",
                case: "vanguard stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Urban Hazard",
                price: 0.26,
                class: "milspec",
                case: "vanguard stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAG-7 | Firestarter",
                price: 0.14,
                class: "milspec",
                case: "vanguard stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Ripple",
                price: 0.17,
                class: "milspec",
                case: "vanguard stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP9 | Dart",
                price: 0.11,
                class: "milspec",
                case: "vanguard stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "G3SG1 | Murky",
                price: 0.16,
                class: "milspec",
                case: "vanguard stattrak",
                type: "skin",
                stattrak: true,
            },

            // The Gods and Monsters Collection
            {
                name: "AWP | Medusa",
                price: 602.95,
                class: "covert",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "M4A4 | Poseidon",
                price: 148.55,
                class: "classified",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "M4A1-S | Icarus Fell",
                price: 61.85,
                class: "restricted",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "G3SG1 | Chronos",
                price: 29.41,
                class: "restricted",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "UMP-45 | Minotaur's Labyrinth",
                price: 7.38,
                class: "milspec",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "MP9 | Pandora's Box",
                price: 8.12,
                class: "milspec",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "AWP | Sun in Leo",
                price: 2.32,
                class: "industrial",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "Tec-9 | Hades",
                price: 0.79,
                class: "industrial",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "P2000 | Pathfinder",
                price: 0.81,
                class: "industrial",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "M249 | Shipping Forecast",
                price: 0.79,
                class: "industrial",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "AUG | Daedalus",
                price: 0.21,
                class: "consumer",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "Dual Berettas | Moon in Libra",
                price: 0.21,
                class: "consumer",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "Nova | Moon in Libra",
                price: 0.21,
                class: "consumer",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "MP7 | Asterion",
                price: 0.21,
                class: "consumer",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            },

            // Chroma Case
            {
                name: "Galil AR | Chatterbox",
                price: 1.25,
                class: "covert",
                case: "chroma stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "AWP | Man-o'-war",
                price: 7.01,
                class: "covert",
                case: "chroma stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A4 | Dragon King",
                price: 3.44,
                class: "classified",
                case: "chroma stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Cartel",
                price: 2.27,
                class: "classified",
                case: "chroma stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Muertos",
                price: 1.19,
                class: "classified",
                case: "chroma stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Naga",
                price: 0.25,
                class: "restricted",
                case: "chroma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAC-10 | Malachite",
                price: 0.3,
                class: "restricted",
                case: "chroma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Serenity",
                price: 0.32,
                class: "restricted",
                case: "chroma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Dual Berettas | Urban Shock",
                price: 0.31,
                class: "restricted",
                case: "chroma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Catacombs",
                price: 0.13,
                class: "milspec",
                case: "chroma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP9 | Deadly Poison",
                price: 0.08,
                class: "milspec",
                case: "chroma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "M249 | System Lock",
                price: 0.08,
                class: "milspec",
                case: "chroma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Grotto",
                price: 0.08,
                class: "milspec",
                case: "chroma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Quicksilver",
                price: 0.08,
                class: "milspec",
                case: "chroma stattrak",
                type: "skin",
                stattrak: true,
            },

            // Chroma Case 2
            {
                name: "M4A1-S | Hyper Beast",
                price: 6.9,
                class: "covert",
                case: "chroma2 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAC-10 | Neon Rider",
                price: 1.77,
                class: "covert",
                case: "chroma2 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Monkey Business",
                price: 0.89,
                class: "classified",
                case: "chroma2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Galil AR | Eco",
                price: 1.04,
                class: "classified",
                case: "chroma2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "FAMAS | Djinn",
                price: 1.08,
                class: "classified",
                case: "chroma2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AWP | Worm God",
                price: 0.92,
                class: "restricted",
                case: "chroma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAG-7 | Heat",
                price: 0.23,
                class: "restricted",
                case: "chroma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Pole Position",
                price: 0.23,
                class: "restricted",
                case: "chroma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Grand Prix",
                price: 0.24,
                class: "restricted",
                case: "chroma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Elite Build",
                price: 0.62,
                class: "milspec",
                case: "chroma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Bronze Deco",
                price: 0.09,
                class: "milspec",
                case: "chroma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Valence",
                price: 0.08,
                class: "milspec",
                case: "chroma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Origami",
                price: 0.08,
                class: "milspec",
                case: "chroma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP7 | Armor Core",
                price: 0.08,
                class: "milspec",
                case: "chroma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Negev | Man-o'-war",
                price: 0.08,
                class: "milspec",
                case: "chroma2 stattrak",
                type: "skin",
                stattrak: true,
            },

            // Chroma Case 3
            {
                name: "M4A1-S | Chantico's Fire",
                price: 10.29,
                class: "covert",
                case: "chroma3 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "PP-Bizon | Judgement of Anubis",
                price: 2.73,
                class: "covert",
                case: "chroma3 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Primal Saber",
                price: 3.0,
                class: "classified",
                case: "chroma3 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Asiimov",
                price: 1.71,
                class: "classified",
                case: "chroma3 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AUG | Fleet Flock",
                price: 1.02,
                class: "classified",
                case: "chroma3 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "SSG 08 | Ghost Crusader",
                price: 0.28,
                class: "restricted",
                case: "chroma3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Re-Entry",
                price: 0.33,
                class: "restricted",
                case: "chroma3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Black Tie",
                price: 0.26,
                class: "restricted",
                case: "chroma3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Red Astor",
                price: 0.28,
                class: "restricted",
                case: "chroma3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Galil AR | Firefight",
                price: 0.27,
                class: "restricted",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SG 553 | Atlas",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Oceanic",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP9 | Bioleak",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Dual Berettas | Ventilators",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "M249 | Spectre",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "G3SG1 | Orange Crash",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Fubar",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            },

            // Gamma Case
            {
                name: "M4A1-S | Mecha Industries",
                price: 9.36,
                class: "covert",
                case: "gamma stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Wasteland Rebel",
                price: 5.24,
                class: "covert",
                case: "gamma stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A4 | Desolate Space",
                price: 6.09,
                class: "classified",
                case: "gamma stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Imperial Dragon",
                price: 0.99,
                class: "classified",
                case: "gamma stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Bloodsport",
                price: 1.12,
                class: "classified",
                case: "gamma stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AWP | Phobos",
                price: 1.79,
                class: "restricted",
                case: "gamma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "R8 Revolver | Reboot",
                price: 0.32,
                class: "restricted",
                case: "gamma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "P90 | Chopper",
                price: 0.36,
                class: "restricted",
                case: "gamma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "AUG | Aristocrat",
                price: 0.35,
                class: "restricted",
                case: "gamma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Limelight",
                price: 0.32,
                class: "restricted",
                case: "gamma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Violent Daimyo",
                price: 0.09,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Ice Cap",
                price: 0.08,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SG 553 | Aerial",
                price: 0.08,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Iron Clad",
                price: 0.08,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Nova | Exo",
                price: 0.08,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAC-10 | Carnivore",
                price: 0.05,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "PP-Bizon | Harvester",
                price: 0.08,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            },

            // Gamma Case 2
            {
                name: "AK-47 | Neon Revolution",
                price: 18.97,
                class: "covert",
                case: "gamma2 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "FAMAS | Roll Cage",
                price: 2.52,
                class: "covert",
                case: "gamma2 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Fuel Injector",
                price: 2.01,
                class: "classified",
                case: "gamma2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AUG | Syd Mead",
                price: 1.16,
                class: "classified",
                case: "gamma2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP9 | Airlock",
                price: 1.12,
                class: "classified",
                case: "gamma2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Directive",
                price: 0.24,
                class: "restricted",
                case: "gamma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Weasel",
                price: 0.52,
                class: "restricted",
                case: "gamma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "SG 553 | Triarch",
                price: 0.22,
                class: "restricted",
                case: "gamma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAG-7 | Petroglyph",
                price: 0.24,
                class: "restricted",
                case: "gamma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Powercore",
                price: 0.22,
                class: "restricted",
                case: "gamma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Briefing",
                price: 0.09,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P90 | Grim",
                price: 0.08,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Scumbria",
                price: 0.08,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Slipstream",
                price: 0.08,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Imprint",
                price: 0.08,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "G3SG1 | Ventilator",
                price: 0.05,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Negev | Dazzle",
                price: 0.08,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            },

            // Operation Hydra Case
            {
                name: "Five-SeveN | Hyper Beast",
                price: 15.18,
                class: "covert",
                case: "hydra stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "AWP | Oni Taiji",
                price: 45.52,
                class: "covert",
                case: "hydra stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A4 | Hellfire",
                price: 8.53,
                class: "classified",
                case: "hydra stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Dual Berettas | Cobra Strike",
                price: 3.64,
                class: "classified",
                case: "hydra stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Galil AR | Sugar Rush",
                price: 3.92,
                class: "classified",
                case: "hydra stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Orbit Mk01",
                price: 7.95,
                class: "restricted",
                case: "hydra stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "P90 | Death Grip",
                price: 0.93,
                class: "restricted",
                case: "hydra stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Red Rock",
                price: 0.88,
                class: "restricted",
                case: "hydra stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "SSG 08 | Death's Head",
                price: 1.02,
                class: "restricted",
                case: "hydra stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Woodsman",
                price: 0.92,
                class: "restricted",
                case: "hydra stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "USP-S | Blueprint",
                price: 1.29,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A1-S | Briefing",
                price: 0.93,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Cut Out",
                price: 0.3,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Metal Flowers",
                price: 0.21,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAG-7 | Hard Water",
                price: 0.3,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "FAMAS | Macabre",
                price: 0.3,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAC-10 | Aloha",
                price: 0.28,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            },

            // Revolver Case
            {
                name: "M4A4 | Royal Paladin",
                price: 5.1,
                class: "covert",
                case: "revolver stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "R8 Revolver | Fade",
                price: 3.06,
                class: "covert",
                case: "revolver stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "G3SG1 | The Executioner",
                price: 1.09,
                class: "classified",
                case: "revolver stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Point Disarray",
                price: 8.78,
                class: "classified",
                case: "revolver stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "P90 | Shapewood",
                price: 1.06,
                class: "classified",
                case: "revolver stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Avalanche",
                price: 0.5,
                class: "restricted",
                case: "revolver stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "SG 553 | Tiger Moth",
                price: 0.54,
                class: "restricted",
                case: "revolver stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Retrobution",
                price: 0.47,
                class: "restricted",
                case: "revolver stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Negev | Power Loader",
                price: 0.47,
                class: "restricted",
                case: "revolver stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "PP-Bizon | Fuel Rod",
                price: 0.44,
                class: "restricted",
                case: "revolver stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Teclu Burner",
                price: 0.5,
                class: "restricted",
                case: "revolver stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "R8 Revolver | Crimson Web",
                price: 0.13,
                class: "milspec",
                case: "revolver stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Corinthian",
                price: 0.27,
                class: "milspec",
                case: "revolver stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "AUG | Ricochet",
                price: 0.15,
                class: "milspec",
                case: "revolver stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Imperial",
                price: 0.16,
                class: "milspec",
                case: "revolver stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Yorick",
                price: 0.09,
                class: "milspec",
                case: "revolver stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Outbreak",
                price: 0.09,
                class: "milspec",
                case: "revolver stattrak",
                type: "skin",
                stattrak: true,
            },

            // The Chop Shop Collection
            {
                name: "M4A1-S | Hot Rod",
                price: 76.53,
                class: "classified",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "Glock-18 | Twilight Galaxy",
                price: 8.41,
                class: "classified",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "SG 553 | Bulldozer",
                price: 3.56,
                class: "restricted",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "Dual Berettas | Duelist",
                price: 4.12,
                class: "restricted",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "P250 | Whiteout",
                price: 0.43,
                class: "milspec",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "MAC-10 | Fade",
                price: 1.69,
                class: "milspec",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "CZ75-Auto | Emerald",
                price: 1.02,
                class: "milspec",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "Five-SeveN | Nitro",
                price: 0.4,
                class: "milspec",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "MP7 | Full Stop",
                price: 0.4,
                class: "milspec",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "Desert Eagle | Night",
                price: 0.44,
                class: "industrial",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "USP-S | Para Green",
                price: 0.16,
                class: "industrial",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "Galil AR | Urban Rubble",
                price: 0.15,
                class: "industrial",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "M249 | Impact Drill",
                price: 0.03,
                class: "consumer",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "MAG-7 | Seabird",
                price: 0.03,
                class: "consumer",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "SCAR-20 | Army Sheen",
                price: 0.03,
                class: "consumer",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "CZ75-Auto | Army Sheen",
                price: 0.04,
                class: "consumer",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            },

            // The Rising Sun Collection
            {
                name: "AUG | Akihabara Accept",
                price: 29.69,
                class: "covert",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "AK-47 | Hydroponic",
                price: 24.29,
                class: "classified",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Desert Eagle | Sunset Storm 弐",
                price: 4.9,
                class: "restricted",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Desert Eagle | Sunset Storm 壱",
                price: 4.99,
                class: "restricted",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "M4A4 | Daybreak",
                price: 4.34,
                class: "restricted",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Five-SeveN | Neon Kimono",
                price: 3.91,
                class: "restricted",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Tec-9 | Terrace",
                price: 1.17,
                class: "milspec",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Galil AR | Aqua Terrace",
                price: 1.17,
                class: "milspec",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "MAG-7 | Counter Terrace",
                price: 1.3,
                class: "milspec",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Desert Eagle | Midnight Storm",
                price: 0.2,
                class: "industrial",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "P250 | Crimson Kimono",
                price: 0.14,
                class: "industrial",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Sawed-Off | Bamboo Shadow",
                price: 0.04,
                class: "consumer",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Tec-9 | Bamboo Forest",
                price: 0.04,
                class: "consumer",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "P250 | Mint Kimono",
                price: 0.04,
                class: "consumer",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "G3SG1 | Orange Kimono",
                price: 0.04,
                class: "consumer",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "PP-Bizon | Bamboo Print",
                price: 0.04,
                class: "consumer",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }
        );
    }
    var basicLs = localStorage;
    if (!basicLs.savedCash) {
        basicLs.setItem("savedCash", 0);
    }
    var savecash = basicLs.savedCash;

    function saveCash() {
        savecash = unsafeWindow.userdata.money;
        basicLs.setItem("savedCash", savecash);
    }

    function loadCash() {
        if (basicLs.savedCash) {
            unsafeWindow.userdata.money = parseFloat(basicLs.savedCash);
        }
    }
    var pastCash1 = 0;
    var spho = false;

    function shoppingSpree() {
        spho = !spho;
        if (spho) {
            unlock();
            pastCash1 = unsafeWindow.userdata.money;
            unsafeWindow.userdata.money = Infinity;
        } else {
            unsafeWindow.userdata.money = pastCash1;
        }
    }
    var s_Title_1 = String.raw `
 ██░ ██  ▄▄▄       ██▀███  ▓█████▄
▓██░ ██▒▒████▄    ▓██ ▒ ██▒▒██▀ ██▌
▒██▀▀██░▒██  ▀█▄  ▓██ ░▄█ ▒░██   █▌
░▓█ ░██ ░██▄▄▄▄██ ▒██▀▀█▄  ░▓█▄   ▌
░▓█▒░██▓ ▓█   ▓██▒░██▓ ▒██▒░▒████▓
 ▒ ░░▒░▒ ▒▒   ▓▒█░░ ▒▓ ░▒▓░ ▒▒▓  ▒
 ▒ ░▒░ ░  ▒   ▒▒ ░  ░▒ ░ ▒░ ░ ▒  ▒
 ░  ░░ ░  ░   ▒     ░░   ░  ░ ░  ░
 ░  ░  ░      ░  ░   ░        ░
                            ░
`;
    var s_Title_2 = String.raw `
 ▄████▄   ▒█████   ██▀███  ▓█████
▒██▀ ▀█  ▒██▒  ██▒▓██ ▒ ██▒▓█   ▀
▒▓█    ▄ ▒██░  ██▒▓██ ░▄█ ▒▒███
▒▓▓▄ ▄██▒▒██   ██░▒██▀▀█▄  ▒▓█  ▄
▒ ▓███▀ ░░ ████▓▒░░██▓ ▒██▒░▒████▒
░ ░▒ ▒  ░░ ▒░▒░▒░ ░ ▒▓ ░▒▓░░░ ▒░ ░
  ░  ▒     ░ ▒ ▒░   ░▒ ░ ▒░ ░ ░  ░
░        ░ ░ ░ ▒    ░░   ░    ░
░ ░          ░ ░     ░        ░  ░
░
`;

    function wipeSave() {
        var confwipe = confirm(
            "Are you sure you wan't to wipe your data? This will make you lose everything"
        );
        if (confwipe) {
            unsafeWindow.userdata.inv = [];
            unsafeWindow.userdata.money = 0;
            unsafeWindow.userdata.moneyarray = [0];
            unsafeWindow.userdata.roulette = 0;
            setAM(0);
        } else {
            alert("Okay!");
        }
    }
    var btu = document.createElement("div");
    btu.innerHTML = `<div style="width: 40px;height: 40px; position: absolute;transition: all 1s ease 0s;left: 835px;border-radius:${MenuStyle.opener_circle_width};top: 291px;cursor: pointer;
    text-align: center;
    font-size: 36px;
    color: white;
    font-weight: bolder;"> > </div>`;
    btu.children[0].style.background = MenuStyle.opener;

    var i = document.createElement("div");
    i.style.width = "500px";
    i.style.background = MenuStyle.background;
    i.style.position = "absolute";
    i.style.left = "866px";
    i.style.color = "white";
    i.style.transition = "1s";
    i.id = "menu_Hack";
    // userdata.money
    var _modules = {
        pastCash: 0,
    };

    function get(what) {
        return document.getElementById(what);
    }
    var bod = document.createElement("div");
    i.prepend(bod);
    var autoclicker = false;
    var autocl = null;
    var cautocl = null;
    var opautoclicker = false;
    var autoclength = 1000;
    var customautoclicker = false;
    var opautocl = null;
    // var useo = false;
    document.querySelector("#click_cookie_m").onclick = function () {
        if (opautoclicker || autoclicker || customautoclicker) {
            var i = Math.random(Math.floor(1)).toString();
            i = i.slice(0, 4);
            //console.log(i);
            document.getElementById("overlay").innerHTML =
                '<div id="overlay"><div class="fadeup" style="left: 445.367px; top: 122.909px;">+ ' +
                i +
                "€</div></div>";
            setTimeout(() => {
                document.getElementById("overlay").innerHTML = "";
            }, 1000);
            window.userdata.money = window.userdata.money + 1;
        }
    };

    function toggleAutoClicker() {
        autoclicker = !autoclicker;
        if (autoclicker) {
            autocl = setInterval(() => {
                document.querySelector("#click_cookie_m").click();
            }, 500);
        } else {
            clearInterval(autocl);
        }
    }

    function toggleOpAutoClicker() {
        opautoclicker = !opautoclicker;
        if (opautoclicker) {
            opautocl = setInterval(() => {
                document.querySelector("#click_cookie_m").click();
            });
        } else {
            clearInterval(opautocl);
        }
    }
    function customOpAutoClicker() {
        customautoclicker = !customautoclicker;
        if (customautoclicker) {
            cautocl = setInterval(() => {
                document.querySelector("#click_cookie_m").click();
            },autoclength);
        } else {
            clearInterval(opautocl);
        }
    }

    function unllockAllCases() {
        userdata.inv.push({
            name: "Gamma Case",
            price: 0.75,
            class: "standard",
            case: "gamma",
            type: "case",
            needkey: true,
            rankNeeded: 1,
        }, {
            name: "Chroma Case",
            price: 0.5,
            class: "standard",
            case: "chroma",
            type: "case",
            needkey: true,
            rankNeeded: 1,
        }, {
            name: "Spectrum Case",
            price: 1.0,
            class: "standard",
            case: "spectrum",
            type: "case",
            needkey: true,
            rankNeeded: 1,
        }, {
            name: "CS:GO Weapon Case",
            price: 6.0,
            class: "standard",
            case: "csgo_weapon",
            type: "case",
            needkey: true,
            rankNeeded: 1,
        }, {
            name: "CS:GO Weapon Case 2",
            price: 5.0,
            class: "standard",
            case: "csgo_weapon2",
            type: "case",
            needkey: true,
            rankNeeded: 2,
        }, {
            name: "Stattrak Case",
            price: 2.0,
            class: "standard",
            case: "stattrak",
            type: "case",
            needkey: false,
            rankNeeded: 2,
        }, {
            name: "Shadow Case",
            price: 3.5,
            class: "standard",
            case: "shadow",
            type: "case",
            needkey: true,
            rankNeeded: 2,
        }, {
            name: "Falchion Case",
            price: 1.75,
            class: "standard",
            case: "falchion",
            type: "case",
            needkey: true,
            rankNeeded: 2,
        }, {
            name: "The Gods and Monsters Collection",
            price: 35.0,
            class: "standard",
            case: "gods_and_monsters",
            type: "case",
            needkey: false,
            rankNeeded: 2,
        }, {
            name: "CS:GO Weapon Case 3",
            price: 2.3,
            class: "standard",
            case: "csgo_weapon3",
            type: "case",
            needkey: true,
            rankNeeded: 3,
        }, {
            name: "Operation Vanguard Weapon Case",
            price: 10.0,
            class: "standard",
            case: "vanguard",
            type: "case",
            needkey: true,
            rankNeeded: 3,
        }, {
            name: "The Cobblestone Collection",
            price: 40.0,
            class: "standard",
            case: "cobblestone",
            type: "case",
            needkey: false,
            rankNeeded: 3,
        }, {
            name: "Stattrak Case 2",
            price: 3.5,
            class: "standard",
            case: "stattrak2",
            type: "case",
            needkey: false,
            rankNeeded: 4,
        }, {
            name: "Chroma Case 2",
            price: 1.5,
            class: "standard",
            case: "chroma2",
            type: "case",
            needkey: true,
            rankNeeded: 4,
        }, {
            name: "Operation Hydra Case",
            price: 8.0,
            class: "standard",
            case: "hydra",
            type: "case",
            needkey: true,
            rankNeeded: 4,
        }, {
            name: "Revolver Case",
            price: 2.6,
            class: "standard",
            case: "revolver",
            type: "case",
            needkey: true,
            rankNeeded: 4,
        }, {
            name: "Gamma Case 2",
            price: 1.5,
            class: "standard",
            case: "gamma2",
            type: "case",
            needkey: true,
            rankNeeded: 5,
        }, {
            name: "Stattrak Case 3",
            price: 10.0,
            class: "standard",
            case: "stattrak3",
            type: "case",
            needkey: false,
            rankNeeded: 5,
        }, {
            name: "Knife Case",
            price: 1000.0,
            class: "standard",
            case: "knife",
            type: "case",
            needkey: false,
            rankNeeded: 5,
        }, {
            name: "Chroma Case 3",
            price: 1.5,
            class: "standard",
            case: "chroma3",
            type: "case",
            needkey: true,
            rankNeeded: 5,
        }, {
            name: "The Chop Shop Collection",
            price: 18.0,
            class: "standard",
            case: "chopshop",
            type: "case",
            needkey: false,
            rankNeeded: 4,
        }, {
            name: "Stattrak Case 4",
            price: 200.0,
            class: "standard",
            case: "stattrak4",
            type: "case",
            needkey: false,
            rankNeeded: 6,
        }, {
            name: "The Rising Sun Collection",
            price: 7.5,
            class: "standard",
            case: "risingsun",
            type: "case",
            needkey: true,
            rankNeeded: 4,
        });
    }

    function unlockAllGuns() {
        userdata.inv.push(
            //  Spectrum case
            {
                name: "AK-47 | Bloodsport",
                price: 56.95,
                class: "covert",
                case: "spectrum stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "USP-S | Neo-Noir",
                price: 14.59,
                class: "covert",
                case: "spectrum stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A1-S | Decimator",
                price: 12.62,
                class: "classified",
                case: "spectrum stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AWP | Fever Dream",
                price: 9.88,
                class: "classified",
                case: "spectrum stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Xiangliu",
                price: 4.58,
                class: "classified",
                case: "spectrum stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Scaffold",
                price: 1.11,
                class: "restricted",
                case: "spectrum stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "M249 | Emerald Poison Dart",
                price: 1.12,
                class: "restricted",
                case: "spectrum stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Seasons",
                price: 1.13,
                class: "restricted",
                case: "spectrum stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Galil AR | Crimson Tsunami",
                price: 1.12,
                class: "restricted",
                case: "spectrum stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAC-10 | Last Dive",
                price: 1.08,
                class: "restricted",
                case: "spectrum stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Oxide Blaze",
                price: 0.5,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Capillary",
                price: 0.15,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Ripple",
                price: 0.12,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Blueprint",
                price: 0.11,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Zander",
                price: 0.1,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP7 | Akoben",
                price: 0.11,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "PP-Bizon | Jungle Slipstream",
                price: 0.12,
                class: "milspec",
                case: "spectrum stattrak",
                type: "skin",
                stattrak: true,
            },

            //  Cobblestone Collection
            {
                name: "AWP | Dragon Lore",
                price: 729.53,
                class: "covert",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "M4A1-S | Knight",
                price: 315.24,
                class: "classified",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "Desert Eagle | Hand Cannon",
                price: 34.33,
                class: "restricted",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "CZ75-Auto | Chalice",
                price: 34.41,
                class: "restricted",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "P2000 | Chainmail",
                price: 4.93,
                class: "milspec",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "MP9 | Dark Age",
                price: 4.67,
                class: "milspec",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "USP-S | Royal Blue",
                price: 0.6,
                class: "industrial",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "MAG-7 | Silver",
                price: 0.55,
                class: "industrial",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "Nova | Green Apple",
                price: 0.5,
                class: "industrial",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "Sawed-Off | Rust Coat",
                price: 0.53,
                class: "industrial",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "UMP-45 | Indigo",
                price: 0.09,
                class: "consumer",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "MAC-10 | Indigo",
                price: 0.09,
                class: "consumer",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "P90 | Storm",
                price: 0.09,
                class: "consumer",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "SCAR-20 | Storm",
                price: 0.09,
                class: "consumer",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            }, {
                name: "Dual Berettas | Briar",
                price: 0.11,
                class: "consumer",
                case: "cobblestone",
                type: "skin",
                stattrak: false,
            },

            //  CS:GO Weapon Case
            {
                name: "AWP | Lightning Strike",
                price: 56.9,
                class: "covert",
                case: "csgo_weapon stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Case Hardened",
                price: 24.41,
                class: "classified",
                case: "csgo_weapon stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Hypnotic",
                price: 8.24,
                class: "classified",
                case: "csgo_weapon stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Dragon Tattoo",
                price: 7.19,
                class: "restricted",
                case: "csgo_weapon stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A1-S | Dark Water",
                price: 5.39,
                class: "restricted",
                case: "csgo_weapon stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "USP-S | Dark Water",
                price: 5.73,
                class: "restricted",
                case: "csgo_weapon stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "SG 553 | Ultraviolet",
                price: 0.81,
                class: "milspec",
                case: "csgo_weapon stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "AUG | Wings",
                price: 0.96,
                class: "milspec",
                case: "csgo_weapon stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP7 | Skulls",
                price: 0.86,
                class: "milspec",
                case: "csgo_weapon stattrak",
                type: "skin",
                stattrak: true,
            },

            //  CS:GO Weapon Case 2
            {
                name: "SSG 08 | Blood in the Water",
                price: 16.91,
                class: "covert",
                case: "csgo_weapon2 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "P90 | Cold Blooded",
                price: 5.11,
                class: "classified",
                case: "csgo_weapon2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "USP-S | Serum",
                price: 5.73,
                class: "classified",
                case: "csgo_weapon2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Case Hardened",
                price: 2.9,
                class: "restricted",
                case: "csgo_weapon2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP9 | Hypnotic",
                price: 1.1,
                class: "restricted",
                case: "csgo_weapon2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Nova | Graphite",
                price: 0.75,
                class: "restricted",
                case: "csgo_weapon2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Dual Berettas | Hemoglobin",
                price: 0.84,
                class: "restricted",
                case: "csgo_weapon2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A1-S | Blood Tiger",
                price: 1.81,
                class: "milspec",
                case: "csgo_weapon2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Crimson Web",
                price: 0.66,
                class: "milspec",
                case: "csgo_weapon2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "FAMAS | Hexane",
                price: 0.71,
                class: "milspec",
                case: "csgo_weapon2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Blue Titanium",
                price: 0.94,
                class: "milspec",
                case: "csgo_weapon2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Hive",
                price: 0.7,
                class: "milspec",
                case: "csgo_weapon2 stattrak",
                type: "skin",
                stattrak: true,
            },

            //  CS:GO Weapon Case 3
            {
                name: "CZ75-Auto | Victoria",
                price: 2.46,
                class: "covert",
                case: "csgo_weapon3 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | The Fuschia Is Now",
                price: 1.89,
                class: "classified",
                case: "csgo_weapon3 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Undertow",
                price: 3.05,
                class: "classified",
                case: "csgo_weapon3 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Heirloom",
                price: 0.68,
                class: "restricted",
                case: "csgo_weapon3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Copper Galaxy",
                price: 0.95,
                class: "restricted",
                case: "csgo_weapon3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Titanium Bit",
                price: 0.64,
                class: "restricted",
                case: "csgo_weapon3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Tread Plate",
                price: 0.45,
                class: "restricted",
                case: "csgo_weapon3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Crimson Web",
                price: 0.14,
                class: "milspec",
                case: "csgo_weapon3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "USP-S | Stainless",
                price: 1.39,
                class: "milspec",
                case: "csgo_weapon3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Blue Fissure",
                price: 0.47,
                class: "milspec",
                case: "csgo_weapon3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Dual Berettas | Panther",
                price: 0.14,
                class: "milspec",
                case: "csgo_weapon3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Red FragCam",
                price: 0.12,
                class: "milspec",
                case: "csgo_weapon3 stattrak",
                type: "skin",
                stattrak: true,
            },

            //  Shadow Case
            {
                name: "USP-S | Kill Confirmed",
                price: 22.94,
                class: "covert",
                case: "shadow stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A1-S | Golden Coil",
                price: 9.83,
                class: "covert",
                case: "shadow stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Frontside Misty",
                price: 7.28,
                class: "classified",
                case: "shadow stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "SGG 08 | Big Iron",
                price: 1.83,
                class: "classified",
                case: "shadow stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "G3SG1 | Flux",
                price: 2.0,
                class: "classified",
                case: "shadow stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Wingshot",
                price: 0.46,
                class: "restricted",
                case: "shadow stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Galil AR | Stone Cold",
                price: 0.44,
                class: "restricted",
                case: "shadow stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "M249 | Nebula Crusader",
                price: 0.45,
                class: "restricted",
                case: "shadow stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP7 | Special Delivery",
                price: 0.47,
                class: "restricted",
                case: "shadow stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Dual Berettas | Dualing Dragons",
                price: 0.1,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Wraiths",
                price: 0.11,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "FAMAS | Survivor Z",
                price: 0.11,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Scumbria",
                price: 0.09,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAG-7 | Cobalt Core",
                price: 0.09,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAC-10 | Rangeen",
                price: 0.09,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Green Marine",
                price: 0.09,
                class: "milspec",
                case: "shadow stattrak",
                type: "skin",
                stattrak: true,
            },

            // Falchion case
            {
                name: "AWP | Hyper Beast",
                price: 12.72,
                class: "covert",
                case: "falchion stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Aquamarine Revenge",
                price: 10.98,
                class: "covert",
                case: "falchion stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "SG 553 | Cyrex",
                price: 1.72,
                class: "classified",
                case: "falchion stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP7 | Nemesis",
                price: 2.39,
                class: "classified",
                case: "falchion stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Yellow Jacket",
                price: 1.72,
                class: "classified",
                case: "falchion stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A4 | Evil Daimyo",
                price: 1.32,
                class: "restricted",
                case: "falchion stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Negev | Loudmouth",
                price: 0.22,
                class: "restricted",
                case: "falchion stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Handgun",
                price: 0.24,
                class: "restricted",
                case: "falchion stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP9 | Ruby Poison Dart",
                price: 0.22,
                class: "restricted",
                case: "falchion stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "FAMAS | Neural Net",
                price: 0.23,
                class: "restricted",
                case: "falchion stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "USP-S | Torque",
                price: 0.55,
                class: "milspec",
                case: "falchion stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Bunsen Burner",
                price: 0.17,
                class: "milspec",
                case: "falchion stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P90 | Elite Build",
                price: 0.1,
                class: "milspec",
                case: "falchion stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Galil AR | Rocket Pop",
                price: 0.1,
                class: "milspec",
                case: "falchion stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Riot",
                price: 0.09,
                class: "milspec",
                case: "falchion stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Nova | Ranger",
                price: 0.09,
                class: "milspec",
                case: "falchion stattrak",
                type: "skin",
                stattrak: true,
            },

            //  Vanguard case
            {
                name: "AK-47 | Wasteland Rebel",
                price: 16.54,
                class: "covert",
                case: "vanguard stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Fire Elemental",
                price: 4.49,
                class: "covert",
                case: "vanguard stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Cartel",
                price: 1.94,
                class: "classified",
                case: "vanguard stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Cardiac",
                price: 1.53,
                class: "classified",
                case: "vanguard stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Tranquility",
                price: 1.76,
                class: "classified",
                case: "vanguard stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A4 | Griffin",
                price: 1.72,
                class: "restricted",
                case: "vanguard stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A1-S | Basilisk",
                price: 1.23,
                class: "restricted",
                case: "vanguard stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Grinder",
                price: 0.56,
                class: "restricted",
                case: "vanguard stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Highwayman",
                price: 0.23,
                class: "restricted",
                case: "vanguard stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Delusion",
                price: 0.17,
                class: "restricted",
                case: "vanguard stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Urban Hazard",
                price: 0.26,
                class: "milspec",
                case: "vanguard stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAG-7 | Firestarter",
                price: 0.14,
                class: "milspec",
                case: "vanguard stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Ripple",
                price: 0.17,
                class: "milspec",
                case: "vanguard stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP9 | Dart",
                price: 0.11,
                class: "milspec",
                case: "vanguard stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "G3SG1 | Murky",
                price: 0.16,
                class: "milspec",
                case: "vanguard stattrak",
                type: "skin",
                stattrak: true,
            },

            // The Gods and Monsters Collection
            {
                name: "AWP | Medusa",
                price: 602.95,
                class: "covert",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "M4A4 | Poseidon",
                price: 148.55,
                class: "classified",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "M4A1-S | Icarus Fell",
                price: 61.85,
                class: "restricted",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "G3SG1 | Chronos",
                price: 29.41,
                class: "restricted",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "UMP-45 | Minotaur's Labyrinth",
                price: 7.38,
                class: "milspec",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "MP9 | Pandora's Box",
                price: 8.12,
                class: "milspec",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "AWP | Sun in Leo",
                price: 2.32,
                class: "industrial",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "Tec-9 | Hades",
                price: 0.79,
                class: "industrial",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "P2000 | Pathfinder",
                price: 0.81,
                class: "industrial",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "M249 | Shipping Forecast",
                price: 0.79,
                class: "industrial",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "AUG | Daedalus",
                price: 0.21,
                class: "consumer",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "Dual Berettas | Moon in Libra",
                price: 0.21,
                class: "consumer",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "Nova | Moon in Libra",
                price: 0.21,
                class: "consumer",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            }, {
                name: "MP7 | Asterion",
                price: 0.21,
                class: "consumer",
                case: "gods_and_monsters",
                type: "skin",
                stattrak: false,
            },

            // Chroma Case
            {
                name: "Galil AR | Chatterbox",
                price: 1.25,
                class: "covert",
                case: "chroma stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "AWP | Man-o'-war",
                price: 7.01,
                class: "covert",
                case: "chroma stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A4 | Dragon King",
                price: 3.44,
                class: "classified",
                case: "chroma stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Cartel",
                price: 2.27,
                class: "classified",
                case: "chroma stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Muertos",
                price: 1.19,
                class: "classified",
                case: "chroma stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Naga",
                price: 0.25,
                class: "restricted",
                case: "chroma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAC-10 | Malachite",
                price: 0.3,
                class: "restricted",
                case: "chroma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Serenity",
                price: 0.32,
                class: "restricted",
                case: "chroma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Dual Berettas | Urban Shock",
                price: 0.31,
                class: "restricted",
                case: "chroma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Catacombs",
                price: 0.13,
                class: "milspec",
                case: "chroma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP9 | Deadly Poison",
                price: 0.08,
                class: "milspec",
                case: "chroma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "M249 | System Lock",
                price: 0.08,
                class: "milspec",
                case: "chroma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Grotto",
                price: 0.08,
                class: "milspec",
                case: "chroma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Quicksilver",
                price: 0.08,
                class: "milspec",
                case: "chroma stattrak",
                type: "skin",
                stattrak: true,
            },

            // Chroma Case 2
            {
                name: "M4A1-S | Hyper Beast",
                price: 6.9,
                class: "covert",
                case: "chroma2 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAC-10 | Neon Rider",
                price: 1.77,
                class: "covert",
                case: "chroma2 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Monkey Business",
                price: 0.89,
                class: "classified",
                case: "chroma2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Galil AR | Eco",
                price: 1.04,
                class: "classified",
                case: "chroma2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "FAMAS | Djinn",
                price: 1.08,
                class: "classified",
                case: "chroma2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AWP | Worm God",
                price: 0.92,
                class: "restricted",
                case: "chroma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAG-7 | Heat",
                price: 0.23,
                class: "restricted",
                case: "chroma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Pole Position",
                price: 0.23,
                class: "restricted",
                case: "chroma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Grand Prix",
                price: 0.24,
                class: "restricted",
                case: "chroma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Elite Build",
                price: 0.62,
                class: "milspec",
                case: "chroma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Bronze Deco",
                price: 0.09,
                class: "milspec",
                case: "chroma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Valence",
                price: 0.08,
                class: "milspec",
                case: "chroma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Origami",
                price: 0.08,
                class: "milspec",
                case: "chroma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP7 | Armor Core",
                price: 0.08,
                class: "milspec",
                case: "chroma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Negev | Man-o'-war",
                price: 0.08,
                class: "milspec",
                case: "chroma2 stattrak",
                type: "skin",
                stattrak: true,
            },

            // Chroma Case 3
            {
                name: "M4A1-S | Chantico's Fire",
                price: 10.29,
                class: "covert",
                case: "chroma3 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "PP-Bizon | Judgement of Anubis",
                price: 2.73,
                class: "covert",
                case: "chroma3 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Primal Saber",
                price: 3.0,
                class: "classified",
                case: "chroma3 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Asiimov",
                price: 1.71,
                class: "classified",
                case: "chroma3 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AUG | Fleet Flock",
                price: 1.02,
                class: "classified",
                case: "chroma3 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "SSG 08 | Ghost Crusader",
                price: 0.28,
                class: "restricted",
                case: "chroma3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Re-Entry",
                price: 0.33,
                class: "restricted",
                case: "chroma3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Black Tie",
                price: 0.26,
                class: "restricted",
                case: "chroma3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Red Astor",
                price: 0.28,
                class: "restricted",
                case: "chroma3 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Galil AR | Firefight",
                price: 0.27,
                class: "restricted",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SG 553 | Atlas",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Oceanic",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP9 | Bioleak",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Dual Berettas | Ventilators",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "M249 | Spectre",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "G3SG1 | Orange Crash",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Fubar",
                price: 0.08,
                class: "milspec",
                case: "chroma3 stattrak",
                type: "skin",
                stattrak: true,
            },

            // Gamma Case
            {
                name: "M4A1-S | Mecha Industries",
                price: 9.36,
                class: "covert",
                case: "gamma stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Wasteland Rebel",
                price: 5.24,
                class: "covert",
                case: "gamma stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A4 | Desolate Space",
                price: 6.09,
                class: "classified",
                case: "gamma stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Imperial Dragon",
                price: 0.99,
                class: "classified",
                case: "gamma stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Bloodsport",
                price: 1.12,
                class: "classified",
                case: "gamma stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AWP | Phobos",
                price: 1.79,
                class: "restricted",
                case: "gamma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "R8 Revolver | Reboot",
                price: 0.32,
                class: "restricted",
                case: "gamma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "P90 | Chopper",
                price: 0.36,
                class: "restricted",
                case: "gamma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "AUG | Aristocrat",
                price: 0.35,
                class: "restricted",
                case: "gamma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Limelight",
                price: 0.32,
                class: "restricted",
                case: "gamma stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Violent Daimyo",
                price: 0.09,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Ice Cap",
                price: 0.08,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SG 553 | Aerial",
                price: 0.08,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Iron Clad",
                price: 0.08,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Nova | Exo",
                price: 0.08,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAC-10 | Carnivore",
                price: 0.05,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "PP-Bizon | Harvester",
                price: 0.08,
                class: "milspec",
                case: "gamma stattrak",
                type: "skin",
                stattrak: true,
            },

            // Gamma Case 2
            {
                name: "AK-47 | Neon Revolution",
                price: 18.97,
                class: "covert",
                case: "gamma2 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "FAMAS | Roll Cage",
                price: 2.52,
                class: "covert",
                case: "gamma2 stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Fuel Injector",
                price: 2.01,
                class: "classified",
                case: "gamma2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AUG | Syd Mead",
                price: 1.16,
                class: "classified",
                case: "gamma2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "MP9 | Airlock",
                price: 1.12,
                class: "classified",
                case: "gamma2 stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Directive",
                price: 0.24,
                class: "restricted",
                case: "gamma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Glock-18 | Weasel",
                price: 0.52,
                class: "restricted",
                case: "gamma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "SG 553 | Triarch",
                price: 0.22,
                class: "restricted",
                case: "gamma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAG-7 | Petroglyph",
                price: 0.24,
                class: "restricted",
                case: "gamma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Powercore",
                price: 0.22,
                class: "restricted",
                case: "gamma2 stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Briefing",
                price: 0.09,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P90 | Grim",
                price: 0.08,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Scumbria",
                price: 0.08,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Slipstream",
                price: 0.08,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "CZ75-Auto | Imprint",
                price: 0.08,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "G3SG1 | Ventilator",
                price: 0.05,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Negev | Dazzle",
                price: 0.08,
                class: "milspec",
                case: "gamma2 stattrak",
                type: "skin",
                stattrak: true,
            },

            // Operation Hydra Case
            {
                name: "Five-SeveN | Hyper Beast",
                price: 15.18,
                class: "covert",
                case: "hydra stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "AWP | Oni Taiji",
                price: 45.52,
                class: "covert",
                case: "hydra stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A4 | Hellfire",
                price: 8.53,
                class: "classified",
                case: "hydra stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Dual Berettas | Cobra Strike",
                price: 3.64,
                class: "classified",
                case: "hydra stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Galil AR | Sugar Rush",
                price: 3.92,
                class: "classified",
                case: "hydra stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Orbit Mk01",
                price: 7.95,
                class: "restricted",
                case: "hydra stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "P90 | Death Grip",
                price: 0.93,
                class: "restricted",
                case: "hydra stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "P250 | Red Rock",
                price: 0.88,
                class: "restricted",
                case: "hydra stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "SSG 08 | Death's Head",
                price: 1.02,
                class: "restricted",
                case: "hydra stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Woodsman",
                price: 0.92,
                class: "restricted",
                case: "hydra stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "USP-S | Blueprint",
                price: 1.29,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "M4A1-S | Briefing",
                price: 0.93,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Cut Out",
                price: 0.3,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "UMP-45 | Metal Flowers",
                price: 0.21,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAG-7 | Hard Water",
                price: 0.3,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "FAMAS | Macabre",
                price: 0.3,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "MAC-10 | Aloha",
                price: 0.28,
                class: "milspec",
                case: "hydra stattrak",
                type: "skin",
                stattrak: true,
            },

            // Revolver Case
            {
                name: "M4A4 | Royal Paladin",
                price: 5.1,
                class: "covert",
                case: "revolver stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "R8 Revolver | Fade",
                price: 3.06,
                class: "covert",
                case: "revolver stattrak4",
                type: "skin",
                stattrak: true,
            }, {
                name: "G3SG1 | The Executioner",
                price: 1.09,
                class: "classified",
                case: "revolver stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "AK-47 | Point Disarray",
                price: 8.78,
                class: "classified",
                case: "revolver stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "P90 | Shapewood",
                price: 1.06,
                class: "classified",
                case: "revolver stattrak3",
                type: "skin",
                stattrak: true,
            }, {
                name: "Tec-9 | Avalanche",
                price: 0.5,
                class: "restricted",
                case: "revolver stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "SG 553 | Tiger Moth",
                price: 0.54,
                class: "restricted",
                case: "revolver stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Five-SeveN | Retrobution",
                price: 0.47,
                class: "restricted",
                case: "revolver stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "Negev | Power Loader",
                price: 0.47,
                class: "restricted",
                case: "revolver stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "PP-Bizon | Fuel Rod",
                price: 0.44,
                class: "restricted",
                case: "revolver stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "XM1014 | Teclu Burner",
                price: 0.5,
                class: "restricted",
                case: "revolver stattrak2",
                type: "skin",
                stattrak: true,
            }, {
                name: "R8 Revolver | Crimson Web",
                price: 0.13,
                class: "milspec",
                case: "revolver stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Desert Eagle | Corinthian",
                price: 0.27,
                class: "milspec",
                case: "revolver stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "AUG | Ricochet",
                price: 0.15,
                class: "milspec",
                case: "revolver stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "P2000 | Imperial",
                price: 0.16,
                class: "milspec",
                case: "revolver stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "Sawed-Off | Yorick",
                price: 0.09,
                class: "milspec",
                case: "revolver stattrak",
                type: "skin",
                stattrak: true,
            }, {
                name: "SCAR-20 | Outbreak",
                price: 0.09,
                class: "milspec",
                case: "revolver stattrak",
                type: "skin",
                stattrak: true,
            },

            // The Chop Shop Collection
            {
                name: "M4A1-S | Hot Rod",
                price: 76.53,
                class: "classified",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "Glock-18 | Twilight Galaxy",
                price: 8.41,
                class: "classified",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "SG 553 | Bulldozer",
                price: 3.56,
                class: "restricted",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "Dual Berettas | Duelist",
                price: 4.12,
                class: "restricted",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "P250 | Whiteout",
                price: 0.43,
                class: "milspec",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "MAC-10 | Fade",
                price: 1.69,
                class: "milspec",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "CZ75-Auto | Emerald",
                price: 1.02,
                class: "milspec",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "Five-SeveN | Nitro",
                price: 0.4,
                class: "milspec",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "MP7 | Full Stop",
                price: 0.4,
                class: "milspec",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "Desert Eagle | Night",
                price: 0.44,
                class: "industrial",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "USP-S | Para Green",
                price: 0.16,
                class: "industrial",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "Galil AR | Urban Rubble",
                price: 0.15,
                class: "industrial",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "M249 | Impact Drill",
                price: 0.03,
                class: "consumer",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "MAG-7 | Seabird",
                price: 0.03,
                class: "consumer",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "SCAR-20 | Army Sheen",
                price: 0.03,
                class: "consumer",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            }, {
                name: "CZ75-Auto | Army Sheen",
                price: 0.04,
                class: "consumer",
                case: "chopshop",
                type: "skin",
                stattrak: false,
            },

            // The Rising Sun Collection
            {
                name: "AUG | Akihabara Accept",
                price: 29.69,
                class: "covert",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "AK-47 | Hydroponic",
                price: 24.29,
                class: "classified",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Desert Eagle | Sunset Storm 弐",
                price: 4.9,
                class: "restricted",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Desert Eagle | Sunset Storm 壱",
                price: 4.99,
                class: "restricted",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "M4A4 | Daybreak",
                price: 4.34,
                class: "restricted",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Five-SeveN | Neon Kimono",
                price: 3.91,
                class: "restricted",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Tec-9 | Terrace",
                price: 1.17,
                class: "milspec",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Galil AR | Aqua Terrace",
                price: 1.17,
                class: "milspec",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "MAG-7 | Counter Terrace",
                price: 1.3,
                class: "milspec",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Desert Eagle | Midnight Storm",
                price: 0.2,
                class: "industrial",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "P250 | Crimson Kimono",
                price: 0.14,
                class: "industrial",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Sawed-Off | Bamboo Shadow",
                price: 0.04,
                class: "consumer",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "Tec-9 | Bamboo Forest",
                price: 0.04,
                class: "consumer",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "P250 | Mint Kimono",
                price: 0.04,
                class: "consumer",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "G3SG1 | Orange Kimono",
                price: 0.04,
                class: "consumer",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }, {
                name: "PP-Bizon | Bamboo Print",
                price: 0.04,
                class: "consumer",
                case: "risingsun",
                type: "skin",
                stattrak: false,
            }
        );
    }
    unsafeWindow.unlockOpen5Cases = function() {
var d=document.getElementsByClassName('open5Cases');for(var i=0;i<d.length;++i){
d[i].className='open5Cases';d[i].disabled=false
};
}
unsafeWindow.unlockCase = function() {
var g=document.getElementsByClassName('openCase');for(var c=0;c<g.length;++c) {
 g[c].className='openCase';
 g[c].disabled=false;
}
}
    bod.innerHTML =
        `<style>
   #menu_Hack button {
   margin: ${MenuStyle.default_button_margin};
       box-shadow: none;
    background: ${MenuStyle.default_button};
    border-style: none;
    color: ${MenuStyle.font};
    border-radius: ${MenuStyle.button_circle_width};
    cursor: pointer;
    transition: 0.3s;
    }
    #menu_Hack .redbtu {
       box-shadow: none;
    background: red;
    border-style: none;
    color: white;
    border-radius: 19px;
    cursor: pointer;
    transition: 0.3s;
    }
   #menu_Hack .redbtu:hover {
        background: ${MenuStyle.default_button_hover};
    transition: 0.3s;
    }
   #menu_Hack button:hover {
        background: ${MenuStyle.default_button_hover};
    transition: 0.3s;
    }
</style><center><h1>HardCore Hack</h1><p style="left: 1322px;position: fixed;bottom: 22px;font-weight: 700;color: #6ca3f5;">${versionT}${version}</p><a id="joinDiscordC" style="left: 873px;position: fixed;bottom: 0px;font-weight: 600;color: #bfecf9;" href="https://discord.gg/cEPKrx96nk">Join Server</a></center><button onclick="unlockCase()">Unlock Case</button><button onclick="unlockOpen5Cases()">Unlock x5 Cases</button><button id = "toggle_btu_1">Infinite Money [OFF]</button><button id="ggsva">Get Save</button><button id="llsva">Load Save</button><button id="clearmon">Clear Money</button><button id="autoclicker">Auto Clicker [OFF]</button><button id="savecashdatahack">Save Cash Data</button><button id="loadcashdatahack">Load Cash Data</button><button id="unlockall">Unlock Disable Shop</button><button id="itemsunlocker">Unlock All Items</button><button id="wipe">Wipe Data</button><button id="mon_editr">Money Editor</button><button id="opautoclicker">OP AutoClicker [OFF]</button><button id="cautoclickre">Custom AutoClicker [OFF]</button><button id="freeupg">Free Upgrades</button><button id="maxungr">Max Upgrades</button><button id="command">Commands</button><button id="keyunlock">Unlock All Keys</button><button id="unlockcase">Unlock All Cases</button><button id="gununlock">Unlock All Guns</button><button id="knifeunlock">Unlock All Knifes</button>` +
        `



<p style="left: 1282px;position: fixed;bottom: 0px;font-weight: bold;color: ${MenuStyle.font};">By Lapide</p>`;
    setInterval(()=>{
    i.style.left=(innerWidth-parseInt(i.style.width.replace('px','')))+"px";
    });
    i.style.fontFamily = "Arial";
    // get("
    document.body.insertBefore(i, document.body.lastChild);
    setInterval(() => {
        i.style.height = innerHeight + "px";
        document.querySelector("#menu_Hack > div > center > p").style.left=(innerWidth-44)+"px";
document.querySelector("#menu_Hack > div > p").style.left=(innerWidth-88)+"px";
document.querySelector("#joinDiscordC").style.left
=innerWidth-parseInt(document.querySelector("#menu_Hack").style.width.replace('px',''))+10+"px";
        if (!is_Active) {
            btu.children[0].style.left=(innerWidth-parseInt(i.style.width.replace('px',''))-30)+"px";
        } else {
            btu.children[0].style.left=(innerWidth-parseInt(i.style.width.replace('px',''))-30)+"px";
        }
    });
    var g = false;
    var pastCash = 0;
    var ls = localStorage;

    function s(dat, func) {
        get(dat).addEventListener("click", func);
    }
    s("keyunlock", function () {
        unlockAllKeys();
    });
    s("ggsva",function() {
       var cc = prompt('Current Save', getCSave());
    });
    s("llsva", function() {
      var cxz = prompt("Load Save", 'ENTER SAVE');
        if (cxz) {
            try {
           loadCSave(cxz);
            alert('Loaded save!');
            } catch (error) {
            if (error) {
               console.log('Cannot load save, try getting a valid save!');
            }
            } finally {
              // nothing
            }
        }
    });
    s("unlockcase", function () {
        unlockAllCases();
    });
    s("knifeunlock", function () {
        unlockAllKnives();
    });
    s("gununlock", function () {
        unlockAllGuns();
    });
    s("maxungr", function () {
        setAM(10);
    });
    s("freeupg", function () {
        freeUpgrades();
    });
    s("opautoclicker", function () {
        toggleOpAutoClicker();
        if (opautoclicker) {
            get("opautoclicker").innerText = "OP AutoClicker [ON]";
        } else {
            get("opautoclicker").innerText = "OP AutoClicker [OFF]";
        }
    });
    s("cautoclickre", function() {
       customOpAutoClicker();
     if (customautoclicker) {
         var f = prompt("[Milliseconds] Enter how fast the Auto Clicker will be.");
         autoclength = parseInt(f);
            get("cautoclickre").innerText = "Custom AutoClicker [ON]";
     } else {
            get("cautoclickre").innerText = "Custom AutoClicker [OFF]";
     }
    });
    s("clearmon", function () {
        var confwipe = confirm(
            "Are you sure you wan't to wipe your data? This will make you lose everything"
        );
        if (confwipe) {
            unsafeWindow.userdata.money = 0;
        } else {
            alert("Okay!");
        }
    });
    s("command", function () {
        commands();
    });
    s("wipe", function () {
        wipeSave();
    });
    s("mon_editr", function () {
        monedit();
    });
    s("itemsunlocker", function () {
        UnlockAllItems();
    });
    s("unlockall", function () {
        unlock();
    });
    s("savecashdatahack", function () {
        saveCash();
    });
    s("loadcashdatahack", function () {
        loadCash();
    });
    get("autoclicker").addEventListener("click", function () {
        toggleAutoClicker();
        if (autoclicker) {
            get("autoclicker").innerText = "Auto Clicker [ON]";
        } else {
            get("autoclicker").innerText = "Auto Clicker [OFF]";
        }
    });
    get("toggle_btu_1").addEventListener("click", function () {
        g = !g;
        if (g) {
            get("toggle_btu_1").innerText = "Infinite Money [ON]";
            pastCash = unsafeWindow.userdata.money;
            unsafeWindow.userdata.money = Infinity;
            //  get('toggle_btu_1').innerHTML=''
        } else {
            get("toggle_btu_1").innerText = "Infinite Money [OFF]";
            unsafeWindow.userdata.money = pastCash;
        }
    });
    btu.addEventListener('mouseenter', function () {
        btu.children[0].style.background = MenuStyle.opener_hover;
    });
    btu.addEventListener('mouseout', function () {
        btu.children[0].style.background = MenuStyle.opener;
    });
    // 1323px
    var is_Active = false;
    btu.onclick = function () {
        is_Active = !is_Active;
        if (is_Active) {
            i.style.width = '20px';
            i.style.left = '1346px';
            btu.children[0].style.left=(innerWidth-parseInt(i.style.width.replace('px',''))-30)+"px";
            btu.children[0].innerText = '<'
            bod.remove();
        } else {
            i.style.width = '500px';
            i.style.left = '866px'
            btu.children[0].style.left=(innerWidth-parseInt(i.style.width.replace('px',''))-30)+"px";
            btu.children[0].innerText = '>'
            i.prepend(bod);
        }
    }
    console.hardcore = {
        success: function (msg) {
            console.log("%c" + msg, "color:lightgreen");
        },
    };
    console.clear();
    console.log("%c" + s_Title_1 + "%c" + s_Title_2, "color:red", "color:yellow");

    document.body.insertBefore(btu, document.body.lastChild);
    if (settings.loadDiscordFirst == false) {
if (config.joinedServer == 'false' || config.joinedServer == null) {
    discord = confirm("Would you like to join the official Discord Server?");

    if (discord) {
        get('joinDiscordC').click();

localStorage.setItem('joinedServer', true);
    } else {
        localStorage.setItem('joinedServer', false);
}
} else {
}
    }
    console.hardcore.success("Injected!");
})();