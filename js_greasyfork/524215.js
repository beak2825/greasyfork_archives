// ==UserScript==
// @name         AWBW Income Grapher - Beta 5.4
// @namespace    awbw
// @match        https://awbw.amarriner.com/prevmaps.php*
// @match        https://awbw.amarriner.com/editmap.php*
// @icon         https://awbw.amarriner.com/terrain/ani/neutralcity.gif
// @version      0.5.4
// @description  Preview Income and Tank Order on any given map.
// @author       Vesper, Steve (Code)
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js
// @require      https://unpkg.com/chartjs-plugin-annotation@latest/dist/chartjs-plugin-annotation.min.js
// @run-at       document-end
// @inject-into  page
// @downloadURL https://update.greasyfork.org/scripts/524215/AWBW%20Income%20Grapher%20-%20Beta%2054.user.js
// @updateURL https://update.greasyfork.org/scripts/524215/AWBW%20Income%20Grapher%20-%20Beta%2054.meta.js
// ==/UserScript==
debugger;

var BaseInfo = {};

function loadScript(e) {
    return new Promise(((t, n) => {
        let i = document.createElement("script");
        document.head.append(i), i.onload = () => {
            t()
        }, i.onerror = () => {
            n()
        }, i.src = e
    }))
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
window.sleep = sleep;
function loadImage(e) {
    return new Promise(((t, n) => {
        const i = new Image;
        i.onload = () => {
            t(i)
        }, i.onerror = e => {
            n(e)
        }, i.src = e
    }))
}
function indexToCoords(e, t) {
    return {
        x: (e = parseInt(e)) % t,
        y: e / t | 0
    }
}
function brightenColor(r, g, b, factor) {
    // Ensure the factor is between 0 and 1
    factor = Math.min(Math.max(factor, 0), 1);

    // Increase each RGB component by the factor
    r = Math.min(Math.round(r + (255 - r) * factor), 255);
    g = Math.min(Math.round(g + (255 - g) * factor), 255);
    b = Math.min(Math.round(b + (255 - b) * factor), 255);

    return `rgb(${r}, ${g}, ${b})`;
}
window.brightenColor = brightenColor;
BaseInfo.countries = {
    os: {
        id: 1,
        name: "Orange Star",
        color: "181, 39, 68"
    },
    bm: {
        id: 2,
        name: "Blue Moon",
        color: "70,110,254"
    },
    ge: {
        id: 3,
        name: "Green Earth",
        color: "61, 194, 45"
    },
    yc: {
        id: 4,
        name: "Yellow Comet",
        color: "201, 189, 2"
    },
    bh: {
        id: 5,
        name: "Black Hole",
        color: "116, 89, 138"
    },
    rf: {
        id: 6,
        name: "Red Fire",
        color: "146, 50, 67"
    },
    gs: {
        id: 7,
        name: "Grey Sky",
        color: "114, 114, 114"
    },
    bd: {
        id: 8,
        name: "Brown Desert",
        color: "152, 83, 51"
    },
    ab: {
        id: 9,
        name: "Amber Blaze",
        color: "252, 163, 57"
    },
    js: {
        id: 10,
        name: "Jade Sun",
        color: "166, 182, 153"
    },
    ci: {
        id: 16,
        name: "Cobalt Ice",
        color: "11, 32, 112"
    },
    pc: {
        id: 17,
        name: "Pink Cosmos",
        color: "255, 102, 204"
    },
    tg: {
        id: 19,
        name: "Teal Galaxy",
        color: "60, 205, 193"
    },
    pl: {
        id: 20,
        name: "Purple Lightning",
        color: "111, 26, 155"
    },
    ar: {
        id: 21,
        name: "Acid Rain",
        color: "97, 124, 14"
    },
    wn: {
        id: 22,
        name: "White Nova",
        color: "205, 155, 154"
    },
    aa: {
        id: 23,
        name: "Azure Asteroid",
        color: "130, 220, 232"
    },
    ne: {
        id: 24,
        name: "Noir Eclipse",
        color: "3, 3, 3"
    },
    sc: {
        id: 25,
        name: "Silver Claw",
        color: "137, 168, 188"
    },
    uw: {
        id: 26,
        name: "Umber Wilds",
        color: "222, 139, 56"
    }
}
BaseInfo.terrain = {
    1: {
        name: "Plain",
        defense: 1,
        country: "",
        build_type: null
    },
    2: {
        name: "Mountain",
        defense: 4,
        country: "",
        build_type: ""
    },
    3: {
        name: "Wood",
        defense: 2,
        country: "",
        build_type: null
    },
    4: {
        name: "HRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    5: {
        name: "VRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    6: {
        name: "CRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    7: {
        name: "ESRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    8: {
        name: "SWRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    9: {
        name: "WNRiver",
        defense: 0,
        country: "",
        build_type: ""
    },
    10: {
        name: "NERiver",
        defense: 0,
        country: "",
        build_type: null
    },
    11: {
        name: "ESWRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    12: {
        name: "SWNRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    13: {
        name: "WNERiver",
        defense: 0,
        country: "",
        build_type: null
    },
    14: {
        name: "NESRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    15: {
        name: "HRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    16: {
        name: "VRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    17: {
        name: "CRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    18: {
        name: "ESRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    19: {
        name: "SWRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    20: {
        name: "WNRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    21: {
        name: "NERoad",
        defense: 0,
        country: "",
        build_type: null
    },
    22: {
        name: "ESWRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    23: {
        name: "SWNRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    24: {
        name: "WNERoad",
        defense: 0,
        country: "",
        build_type: null
    },
    25: {
        name: "NESRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    26: {
        name: "HBridge",
        defense: 0,
        country: "",
        build_type: null
    },
    27: {
        name: "VBridge",
        defense: 0,
        country: "",
        build_type: null
    },
    28: {
        name: "Sea",
        defense: 0,
        country: "",
        build_type: null
    },
    29: {
        name: "HShoal",
        defense: 0,
        country: "",
        build_type: null
    },
    30: {
        name: "HShoalN",
        defense: 0,
        country: "",
        build_type: null
    },
    31: {
        name: "VShoal",
        defense: 0,
        country: "",
        build_type: null
    },
    32: {
        name: "VShoalE",
        defense: 0,
        country: "",
        build_type: null
    },
    33: {
        name: "Reef",
        defense: 1,
        country: "",
        build_type: null
    },
    34: {
        name: "Neutral City",
        defense: 3,
        country: "",
        build_type: null
    },
    35: {
        name: "Neutral Base",
        defense: 3,
        country: "",
        build_type: ""
    },
    36: {
        name: "Neutral Airport",
        defense: 3,
        country: "",
        build_type: null
    },
    37: {
        name: "Neutral Port",
        defense: 3,
        country: "",
        build_type: null
    },
    38: {
        name: "Orange Star City",
        defense: 3,
        country: "os",
        build_type: null
    },
    39: {
        name: "Orange Star Base",
        defense: 3,
        country: "os",
        build_type: "L"
    },
    40: {
        name: "Orange Star Airport",
        defense: 3,
        country: "os",
        build_type: "A"
    },
    41: {
        name: "Orange Star Port",
        defense: 3,
        country: "os",
        build_type: "S"
    },
    42: {
        name: "Orange Star HQ",
        defense: 4,
        country: "os",
        build_type: null
    },
    43: {
        name: "Blue Moon City",
        defense: 3,
        country: "bm",
        build_type: null
    },
    44: {
        name: "Blue Moon Base",
        defense: 3,
        country: "bm",
        build_type: "L"
    },
    45: {
        name: "Blue Moon Airport",
        defense: 3,
        country: "bm",
        build_type: "A"
    },
    46: {
        name: "Blue Moon Port",
        defense: 3,
        country: "bm",
        build_type: "S"
    },
    47: {
        name: "Blue Moon HQ",
        defense: 4,
        country: "bm",
        build_type: null
    },
    48: {
        name: "Green Earth City",
        defense: 3,
        country: "ge",
        build_type: null
    },
    49: {
        name: "Green Earth Base",
        defense: 3,
        country: "ge",
        build_type: "L"
    },
    50: {
        name: "Green Earth Airport",
        defense: 3,
        country: "ge",
        build_type: "A"
    },
    51: {
        name: "Green Earth Port",
        defense: 3,
        country: "ge",
        build_type: "S"
    },
    52: {
        name: "Green Earth HQ",
        defense: 4,
        country: "ge",
        build_type: null
    },
    53: {
        name: "Yellow Comet City",
        defense: 3,
        country: "yc",
        build_type: null
    },
    54: {
        name: "Yellow Comet Base",
        defense: 3,
        country: "yc",
        build_type: "L"
    },
    55: {
        name: "Yellow Comet Airport",
        defense: 3,
        country: "yc",
        build_type: "A"
    },
    56: {
        name: "Yellow Comet Port",
        defense: 3,
        country: "yc",
        build_type: "S"
    },
    57: {
        name: "Yellow Comet HQ",
        defense: 4,
        country: "yc",
        build_type: null
    },
    81: {
        name: "Red Fire City",
        defense: 3,
        country: "rf",
        build_type: null
    },
    82: {
        name: "Red Fire Base",
        defense: 3,
        country: "rf",
        build_type: "L"
    },
    83: {
        name: "Red Fire Airport",
        defense: 3,
        country: "rf",
        build_type: "A"
    },
    84: {
        name: "Red Fire Port",
        defense: 3,
        country: "rf",
        build_type: "S"
    },
    85: {
        name: "Red Fire HQ",
        defense: 4,
        country: "rf",
        build_type: null
    },
    86: {
        name: "Grey Sky City",
        defense: 3,
        country: "gs",
        build_type: null
    },
    87: {
        name: "Grey Sky Base",
        defense: 3,
        country: "gs",
        build_type: "L"
    },
    88: {
        name: "Grey Sky Airport",
        defense: 3,
        country: "gs",
        build_type: "A"
    },
    89: {
        name: "Grey Sky Port",
        defense: 3,
        country: "gs",
        build_type: "S"
    },
    90: {
        name: "Grey Sky HQ",
        defense: 4,
        country: "gs",
        build_type: null
    },
    91: {
        name: "Black Hole City",
        defense: 3,
        country: "bh",
        build_type: null
    },
    92: {
        name: "Black Hole Base",
        defense: 3,
        country: "bh",
        build_type: "L"
    },
    93: {
        name: "Black Hole Airport",
        defense: 3,
        country: "bh",
        build_type: "A"
    },
    94: {
        name: "Black Hole Port",
        defense: 3,
        country: "bh",
        build_type: "S"
    },
    95: {
        name: "Black Hole HQ",
        defense: 4,
        country: "bh",
        build_type: ""
    },
    96: {
        name: "Brown Desert City",
        defense: 3,
        country: "bd",
        build_type: null
    },
    97: {
        name: "Brown Desert Base",
        defense: 3,
        country: "bd",
        build_type: "L"
    },
    98: {
        name: "Brown Desert Airport",
        defense: 3,
        country: "bd",
        build_type: "A"
    },
    99: {
        name: "Brown Desert Port",
        defense: 3,
        country: "bd",
        build_type: "S"
    },
    100: {
        name: "Brown Desert HQ",
        defense: 4,
        country: "bd",
        build_type: null
    },
    101: {
        name: "VPipe",
        defense: 0,
        country: "",
        build_type: ""
    },
    102: {
        name: "HPipe",
        defense: 0,
        country: "",
        build_type: ""
    },
    103: {
        name: "NEPipe",
        defense: 0,
        country: "",
        build_type: ""
    },
    104: {
        name: "ESPipe",
        defense: 0,
        country: "",
        build_type: ""
    },
    105: {
        name: "SWPipe",
        defense: 0,
        country: "",
        build_type: ""
    },
    106: {
        name: "WNPipe",
        defense: 0,
        country: "",
        build_type: ""
    },
    107: {
        name: "NPipe End",
        defense: 0,
        country: "",
        build_type: ""
    },
    108: {
        name: "EPipe End",
        defense: 0,
        country: "",
        build_type: ""
    },
    109: {
        name: "SPipe End",
        defense: 0,
        country: "",
        build_type: ""
    },
    110: {
        name: "WPipe End",
        defense: 0,
        country: "",
        build_type: ""
    },
    111: {
        name: "Missile Silo",
        defense: 3,
        country: "",
        build_type: ""
    },
    112: {
        name: "Missile Silo Empty",
        defense: 3,
        country: "",
        build_type: ""
    },
    113: {
        name: "HPipe Seam",
        defense: 0,
        country: "",
        build_type: ""
    },
    114: {
        name: "VPipe Seam",
        defense: 0,
        country: "",
        build_type: ""
    },
    115: {
        name: "HPipe Rubble",
        defense: 1,
        country: "",
        build_type: ""
    },
    116: {
        name: "VPipe Rubble",
        defense: 1,
        country: "",
        build_type: ""
    },
    117: {
        name: "Amber Blaze Airport",
        defense: 3,
        country: "ab",
        build_type: "A"
    },
    118: {
        name: "Amber Blaze Base",
        defense: 3,
        country: "ab",
        build_type: "L"
    },
    119: {
        name: "Amber Blaze City",
        defense: 3,
        country: "ab",
        build_type: ""
    },
    120: {
        name: "Amber Blaze HQ",
        defense: 4,
        country: "ab",
        build_type: ""
    },
    121: {
        name: "Amber Blaze Port",
        defense: 3,
        country: "ab",
        build_type: "S"
    },
    122: {
        name: "Jade Sun Airport",
        defense: 3,
        country: "js",
        build_type: "A"
    },
    123: {
        name: "Jade Sun Base",
        defense: 3,
        country: "js",
        build_type: "L"
    },
    124: {
        name: "Jade Sun City",
        defense: 3,
        country: "js",
        build_type: ""
    },
    125: {
        name: "Jade Sun HQ",
        defense: 4,
        country: "js",
        build_type: ""
    },
    126: {
        name: "Jade Sun Port",
        defense: 3,
        country: "js",
        build_type: "S"
    },
    127: {
        name: "Amber Blaze Com Tower",
        defense: 3,
        country: "ab",
        build_type: ""
    },
    128: {
        name: "Black Hole Com Tower",
        defense: 3,
        country: "bh",
        build_type: ""
    },
    129: {
        name: "Blue Moon Com Tower",
        defense: 3,
        country: "bm",
        build_type: ""
    },
    130: {
        name: "Brown Desert Com Tower",
        defense: 3,
        country: "bd",
        build_type: ""
    },
    131: {
        name: "Green Earth Com Tower",
        defense: 3,
        country: "ge",
        build_type: ""
    },
    132: {
        name: "Jade Sun Com Tower",
        defense: 3,
        country: "js",
        build_type: ""
    },
    133: {
        name: "Neutral Com Tower",
        defense: 3,
        country: "",
        build_type: ""
    },
    134: {
        name: "Orange Star Com Tower",
        defense: 3,
        country: "os",
        build_type: ""
    },
    135: {
        name: "Red Fire Com Tower",
        defense: 3,
        country: "rf",
        build_type: ""
    },
    136: {
        name: "Yellow Comet Com Tower",
        defense: 3,
        country: "yc",
        build_type: ""
    },
    137: {
        name: "Grey Sky Com Tower",
        defense: 3,
        country: "gs",
        build_type: ""
    },
    138: {
        name: "Amber Blaze Lab",
        defense: 3,
        country: "ab",
        build_type: ""
    },
    139: {
        name: "Black Hole Lab",
        defense: 3,
        country: "bh",
        build_type: ""
    },
    140: {
        name: "Blue Moon Lab",
        defense: 3,
        country: "bm",
        build_type: ""
    },
    141: {
        name: "Brown Desert Lab",
        defense: 3,
        country: "bd",
        build_type: ""
    },
    142: {
        name: "Green Earth Lab",
        defense: 3,
        country: "ge",
        build_type: ""
    },
    143: {
        name: "Grey Sky Lab",
        defense: 3,
        country: "gs",
        build_type: ""
    },
    144: {
        name: "Jade Sun Lab",
        defense: 3,
        country: "js",
        build_type: ""
    },
    145: {
        name: "Neutral Lab",
        defense: 3,
        country: "",
        build_type: ""
    },
    146: {
        name: "Orange Star Lab",
        defense: 3,
        country: "os",
        build_type: ""
    },
    147: {
        name: "Red Fire Lab",
        defense: 3,
        country: "rf",
        build_type: ""
    },
    148: {
        name: "Yellow Comet Lab",
        defense: 3,
        country: "yc",
        build_type: ""
    },
    149: {
        name: "Cobalt Ice Airport",
        defense: 3,
        country: "ci",
        build_type: "A"
    },
    150: {
        name: "Cobalt Ice Base",
        defense: 3,
        country: "ci",
        build_type: "L"
    },
    151: {
        name: "Cobalt Ice City",
        defense: 3,
        country: "ci",
        build_type: ""
    },
    152: {
        name: "Cobalt Ice Com Tower",
        defense: 3,
        country: "ci",
        build_type: ""
    },
    153: {
        name: "Cobalt Ice HQ",
        defense: 4,
        country: "ci",
        build_type: ""
    },
    154: {
        name: "Cobalt Ice Lab",
        defense: 3,
        country: "ci",
        build_type: ""
    },
    155: {
        name: "Cobalt Ice Port",
        defense: 3,
        country: "ci",
        build_type: "S"
    },
    156: {
        name: "Pink Cosmos Airport",
        defense: 3,
        country: "pc",
        build_type: "A"
    },
    157: {
        name: "Pink Cosmos Base",
        defense: 3,
        country: "pc",
        build_type: "L"
    },
    158: {
        name: "Pink Cosmos City",
        defense: 3,
        country: "pc",
        build_type: ""
    },
    159: {
        name: "Pink Cosmos Com Tower",
        defense: 3,
        country: "pc",
        build_type: ""
    },
    160: {
        name: "Pink Cosmos HQ",
        defense: 4,
        country: "pc",
        build_type: ""
    },
    161: {
        name: "Pink Cosmos Lab",
        defense: 3,
        country: "pc",
        build_type: ""
    },
    162: {
        name: "Pink Cosmos Port",
        defense: 3,
        country: "pc",
        build_type: "S"
    },
    163: {
        name: "Teal Galaxy Airport",
        defense: 3,
        country: "tg",
        build_type: "A"
    },
    164: {
        name: "Teal Galaxy Base",
        defense: 3,
        country: "tg",
        build_type: "L"
    },
    165: {
        name: "Teal Galaxy City",
        defense: 3,
        country: "tg",
        build_type: ""
    },
    166: {
        name: "Teal Galaxy Com Tower",
        defense: 3,
        country: "tg",
        build_type: ""
    },
    167: {
        name: "Teal Galaxy HQ",
        defense: 4,
        country: "tg",
        build_type: ""
    },
    168: {
        name: "Teal Galaxy Lab",
        defense: 3,
        country: "tg",
        build_type: ""
    },
    169: {
        name: "Teal Galaxy Port",
        defense: 3,
        country: "tg",
        build_type: "S"
    },
    170: {
        name: "Purple Lightning Airport",
        defense: 3,
        country: "pl",
        build_type: "A"
    },
    171: {
        name: "Purple Lightning Base",
        defense: 3,
        country: "pl",
        build_type: "L"
    },
    172: {
        name: "Purple Lightning City",
        defense: 3,
        country: "pl",
        build_type: ""
    },
    173: {
        name: "Purple Lightning Com Tower",
        defense: 3,
        country: "pl",
        build_type: ""
    },
    174: {
        name: "Purple Lightning HQ",
        defense: 4,
        country: "pl",
        build_type: ""
    },
    175: {
        name: "Purple Lightning Lab",
        defense: 3,
        country: "pl",
        build_type: ""
    },
    176: {
        name: "Purple Lightning Port",
        defense: 3,
        country: "pl",
        build_type: "S"
    },
    181: {
        name: "Acid Rain Airport",
        defense: 3,
        country: "ar",
        build_type: "A"
    },
    182: {
        name: "Acid Rain Base",
        defense: 3,
        country: "ar",
        build_type: "L"
    },
    183: {
        name: "Acid Rain City",
        defense: 3,
        country: "ar",
        build_type: ""
    },
    184: {
        name: "Acid Rain Com Tower",
        defense: 3,
        country: "ar",
        build_type: ""
    },
    185: {
        name: "Acid Rain HQ",
        defense: 4,
        country: "ar",
        build_type: ""
    },
    186: {
        name: "Acid Rain Lab",
        defense: 3,
        country: "ar",
        build_type: ""
    },
    187: {
        name: "Acid Rain Port",
        defense: 3,
        country: "ar",
        build_type: "S"
    },
    188: {
        name: "White Nova Airport",
        defense: 3,
        country: "wn",
        build_type: "A"
    },
    189: {
        name: "White Nova Base",
        defense: 3,
        country: "wn",
        build_type: "L"
    },
    190: {
        name: "White Nova City",
        defense: 3,
        country: "wn",
        build_type: ""
    },
    191: {
        name: "White Nova Com Tower",
        defense: 3,
        country: "wn",
        build_type: ""
    },
    192: {
        name: "White Nova HQ",
        defense: 4,
        country: "wn",
        build_type: ""
    },
    193: {
        name: "White Nova Lab",
        defense: 3,
        country: "wn",
        build_type: ""
    },
    194: {
        name: "White Nova Port",
        defense: 3,
        country: "wn",
        build_type: "S"
    },
    195: {
        name: "Teleporter",
        defense: 0,
        country: "",
        build_type: ""
    },
    196: {
        name: "Azure Asteroid Airport",
        defense: 3,
        country: "aa",
        build_type: "A"
    },
    197: {
        name: "Azure Asteroid Base",
        defense: 3,
        country: "aa",
        build_type: "L"
    },
    198: {
        name: "Azure Asteroid City",
        defense: 3,
        country: "aa",
        build_type: ""
    },
    199: {
        name: "Azure Asteroid Com Tower",
        defense: 3,
        country: "aa",
        build_type: ""
    },
    200: {
        name: "Azure Asteroid HQ",
        defense: 4,
        country: "aa",
        build_type: ""
    },
    201: {
        name: "Azure Asteroid Lab",
        defense: 3,
        country: "aa",
        build_type: ""
    },
    202: {
        name: "Azure Asteroid Port",
        defense: 3,
        country: "aa",
        build_type: "S"
    },
    203: {
        name: "Noir Eclipse Airport",
        defense: 3,
        country: "ne",
        build_type: "A"
    },
    204: {
        name: "Noir Eclipse Base",
        defense: 3,
        country: "ne",
        build_type: "L"
    },
    205: {
        name: "Noir Eclipse City",
        defense: 3,
        country: "ne",
        build_type: ""
    },
    206: {
        name: "Noir Eclipse Com Tower",
        defense: 3,
        country: "ne",
        build_type: ""
    },
    207: {
        name: "Noir Eclipse HQ",
        defense: 4,
        country: "ne",
        build_type: ""
    },
    208: {
        name: "Noir Eclipse Lab",
        defense: 3,
        country: "ne",
        build_type: ""
    },
    209: {
        name: "Noir Eclipse Port",
        defense: 3,
        country: "ne",
        build_type: "S"
    },
    210: {
        name: "Silver Claw Airport",
        defense: 3,
        country: "sc",
        build_type: "A"
    },
    211: {
        name: "Silver Claw Base",
        defense: 3,
        country: "sc",
        build_type: "L"
    },
    212: {
        name: "Silver Claw City",
        defense: 3,
        country: "sc",
        build_type: ""
    },
    213: {
        name: "Silver Claw Com Tower",
        defense: 3,
        country: "sc",
        build_type: ""
    },
    214: {
        name: "Silver Claw HQ",
        defense: 4,
        country: "sc",
        build_type: ""
    },
    215: {
        name: "Silver Claw Lab",
        defense: 3,
        country: "sc",
        build_type: ""
    },
    216: {
        name: "Silver Claw Port",
        defense: 3,
        country: "sc",
        build_type: "S"
    },
    210: {
        name: "Silver Claw Airport",
        defense: 3,
        country: "sc",
        build_type: "A"
    },
    211: {
        name: "Silver Claw Base",
        defense: 3,
        country: "sc",
        build_type: "L"
    },
    212: {
        name: "Silver Claw City",
        defense: 3,
        country: "sc",
        build_type: ""
    },
    213: {
        name: "Silver Claw Com Tower",
        defense: 3,
        country: "sc",
        build_type: ""
    },
    214: {
        name: "Silver Claw HQ",
        defense: 4,
        country: "sc",
        build_type: ""
    },
    215: {
        name: "Silver Claw Lab",
        defense: 3,
        country: "sc",
        build_type: ""
    },
    216: {
        name: "Silver Claw Port",
        defense: 3,
        country: "sc",
        build_type: "S"
    },
    217: {
        name: "Umber Wilds Airport",
        defense: 3,
        country: "uw",
        build_type: "A"
    },
    218: {
        name: "Umber Wilds Base",
        defense: 3,
        country: "uw",
        build_type: "L"
    },
    219: {
        name: "Umber Wilds City",
        defense: 3,
        country: "uw",
        build_type: ""
    },
    220: {
        name: "Umber Wilds Com Tower",
        defense: 3,
        country: "uw",
        build_type: ""
    },
    221: {
        name: "Umber Wilds HQ",
        defense: 4,
        country: "uw",
        build_type: ""
    },
    222: {
        name: "Umber Wilds Lab",
        defense: 3,
        country: "uw",
        build_type: ""
    },
    223: {
        name: "Umber Wilds Port",
        defense: 3,
        country: "uw",
        build_type: "S"
    }
}
BaseInfo.units = {
    1: {
        name: "Infantry",
        cost: 1e3,
        move_points: 3,
        move_type: "F",
        fuel: 99,
        fuel_per_turn: 0,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    2: {
        name: "Mech",
        cost: 3e3,
        move_points: 2,
        move_type: "B",
        fuel: 70,
        fuel_per_turn: 0,
        ammo: 3,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    3: {
        name: "Md.Tank",
        cost: 16e3,
        move_points: 5,
        move_type: "T",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 8,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    4: {
        name: "Tank",
        cost: 7e3,
        move_points: 6,
        move_type: "T",
        fuel: 70,
        fuel_per_turn: 0,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    5: {
        name: "Recon",
        cost: 4e3,
        move_points: 8,
        move_type: "W",
        fuel: 80,
        fuel_per_turn: 0,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    6: {
        name: "APC",
        cost: 5e3,
        move_points: 6,
        move_type: "T",
        fuel: 70,
        fuel_per_turn: 0,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    7: {
        name: "Artillery",
        cost: 6e3,
        move_points: 5,
        move_type: "T",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 9,
        short_range: 2,
        long_range: 3,
        second_weapon: "N"
    },
    8: {
        name: "Rocket",
        cost: 15e3,
        move_points: 5,
        move_type: "W",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 6,
        short_range: 3,
        long_range: 5,
        second_weapon: "N"
    },
    9: {
        name: "Anti-Air",
        cost: 8e3,
        move_points: 6,
        move_type: "T",
        fuel: 60,
        fuel_per_turn: 0,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    10: {
        name: "Missile",
        cost: 12e3,
        move_points: 4,
        move_type: "W",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 6,
        short_range: 3,
        long_range: 5,
        second_weapon: "N"
    },
    11: {
        name: "Fighter",
        cost: 2e4,
        move_points: 9,
        move_type: "A",
        fuel: 99,
        fuel_per_turn: 5,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    12: {
        name: "Bomber",
        cost: 22e3,
        move_points: 7,
        move_type: "A",
        fuel: 99,
        fuel_per_turn: 5,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    13: {
        name: "B-Copter",
        cost: 9e3,
        move_points: 6,
        move_type: "A",
        fuel: 99,
        fuel_per_turn: 2,
        ammo: 6,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    14: {
        name: "T-Copter",
        cost: 5e3,
        move_points: 6,
        move_type: "A",
        fuel: 99,
        fuel_per_turn: 2,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    15: {
        name: "Battleship",
        cost: 28e3,
        move_points: 5,
        move_type: "S",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 9,
        short_range: 2,
        long_range: 6,
        second_weapon: "N"
    },
    16: {
        name: "Cruiser",
        cost: 18e3,
        move_points: 6,
        move_type: "S",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    17: {
        name: "Lander",
        cost: 12e3,
        move_points: 6,
        move_type: "L",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    18: {
        name: "Sub",
        cost: 2e4,
        move_points: 5,
        move_type: "S",
        fuel: 60,
        fuel_per_turn: 1,
        ammo: 6,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    46: {
        name: "Neotank",
        cost: 22e3,
        move_points: 6,
        move_type: "T",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    960900: {
        name: "Piperunner",
        cost: 2e4,
        move_points: 9,
        move_type: "P",
        fuel: 99,
        fuel_per_turn: 0,
        ammo: 9,
        short_range: 2,
        long_range: 5,
        second_weapon: "Y"
    },
    968731: {
        name: "Black Bomb",
        cost: 25e3,
        move_points: 9,
        move_type: "A",
        fuel: 45,
        fuel_per_turn: 5,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    1141438: {
        name: "Mega Tank",
        cost: 28e3,
        move_points: 4,
        move_type: "T",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 3,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    28: {
        name: "Black Boat",
        cost: 7500,
        move_points: 7,
        move_type: "L",
        fuel: 60,
        fuel_per_turn: 1,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    30: {
        name: "Stealth",
        cost: 24e3,
        move_points: 6,
        move_type: "A",
        fuel: 60,
        fuel_per_turn: 5,
        ammo: 6,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    29: {
        name: "Carrier",
        cost: 3e4,
        move_points: 5,
        move_type: "S",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 9,
        short_range: 3,
        long_range: 8,
        second_weapon: "N"
    }
}
BaseInfo.moveCosts = {
    C: {
        F: {
            1: 1,
            2: 2,
            3: 1,
            4: 2,
            5: 2,
            6: 2,
            7: 2,
            8: 2,
            9: 2,
            10: 2,
            11: 2,
            12: 2,
            13: 2,
            14: 2,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        B: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1,
            11: 1,
            12: 1,
            13: 1,
            14: 1,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        T: {
            1: 1,
            2: 0,
            3: 2,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        W: {
            1: 2,
            2: 0,
            3: 3,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 2,
            116: 2,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        A: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1,
            11: 1,
            12: 1,
            13: 1,
            14: 1,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 1,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 1,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        S: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 1,
            29: 0,
            30: 0,
            31: 0,
            32: 0,
            33: 2,
            34: 0,
            35: 0,
            36: 0,
            37: 1,
            38: 0,
            39: 0,
            40: 0,
            41: 1,
            42: 0,
            43: 0,
            44: 0,
            45: 0,
            46: 1,
            47: 0,
            48: 0,
            49: 0,
            50: 0,
            51: 1,
            52: 0,
            53: 0,
            54: 0,
            55: 0,
            56: 1,
            57: 0,
            81: 0,
            86: 0,
            82: 0,
            87: 0,
            83: 0,
            88: 0,
            84: 1,
            89: 1,
            85: 0,
            90: 0,
            91: 0,
            92: 0,
            93: 0,
            94: 1,
            95: 0,
            96: 0,
            97: 0,
            98: 0,
            99: 1,
            100: 0,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 0,
            112: 0,
            113: 0,
            114: 0,
            115: 0,
            116: 0,
            117: 0,
            118: 0,
            119: 0,
            120: 0,
            121: 1,
            122: 0,
            123: 0,
            124: 0,
            125: 0,
            126: 1,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 0,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 1,
            156: 0,
            157: 0,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 1,
            163: 0,
            164: 0,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 1,
            170: 0,
            171: 0,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 1,
            "": 0,
            181: 0,
            182: 0,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 1,
            188: 0,
            189: 0,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 1,
            195: 0
        },
        L: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 1,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 2,
            34: 0,
            35: 0,
            36: 0,
            37: 1,
            38: 0,
            39: 0,
            40: 0,
            41: 1,
            42: 0,
            43: 0,
            44: 0,
            45: 0,
            46: 1,
            47: 0,
            48: 0,
            49: 0,
            50: 0,
            51: 1,
            52: 0,
            53: 0,
            54: 0,
            55: 0,
            56: 1,
            57: 0,
            81: 0,
            86: 0,
            82: 0,
            87: 0,
            83: 0,
            88: 0,
            84: 1,
            89: 1,
            85: 0,
            90: 0,
            91: 0,
            92: 0,
            93: 0,
            94: 1,
            95: 0,
            96: 0,
            97: 0,
            98: 0,
            99: 1,
            100: 0,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 0,
            112: 0,
            113: 0,
            114: 0,
            115: 0,
            116: 0,
            117: 0,
            118: 0,
            119: 0,
            120: 0,
            121: 1,
            122: 0,
            123: 0,
            124: 0,
            125: 0,
            126: 1,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 0,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 1,
            156: 0,
            157: 0,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 1,
            163: 0,
            164: 0,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 1,
            170: 0,
            171: 0,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 1,
            "": 0,
            181: 0,
            182: 0,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 1,
            188: 0,
            189: 0,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 1,
            195: 0
        },
        P: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 0,
            29: 0,
            30: 0,
            31: 0,
            32: 0,
            33: 0,
            34: 0,
            35: 1,
            36: 0,
            37: 0,
            38: 0,
            39: 1,
            40: 0,
            41: 0,
            42: 0,
            43: 0,
            44: 1,
            45: 0,
            46: 0,
            47: 0,
            48: 0,
            49: 1,
            50: 0,
            51: 0,
            52: 0,
            53: 0,
            54: 1,
            55: 0,
            56: 0,
            57: 0,
            85: 0,
            90: 0,
            84: 0,
            89: 0,
            83: 0,
            88: 0,
            82: 1,
            87: 1,
            81: 0,
            86: 0,
            91: 0,
            92: 1,
            93: 0,
            94: 0,
            95: 0,
            96: 0,
            97: 1,
            98: 0,
            99: 0,
            100: 0,
            101: 1,
            102: 1,
            103: 1,
            104: 1,
            105: 1,
            106: 1,
            107: 1,
            108: 1,
            109: 1,
            110: 1,
            111: 0,
            112: 0,
            113: 1,
            114: 1,
            115: 0,
            116: 0,
            117: 0,
            118: 1,
            119: 0,
            120: 0,
            121: 0,
            122: 0,
            123: 1,
            124: 0,
            125: 0,
            126: 0,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 1,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 0,
            156: 0,
            157: 1,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 0,
            163: 0,
            164: 1,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 0,
            170: 0,
            171: 1,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 0,
            "": 0,
            181: 0,
            182: 1,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 0,
            188: 0,
            189: 1,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 0,
            195: 0
        }
    },
    S: {
        F: {
            1: 2,
            2: 4,
            3: 2,
            4: 2,
            5: 2,
            6: 2,
            7: 2,
            8: 2,
            9: 2,
            10: 2,
            11: 2,
            12: 2,
            13: 2,
            14: 2,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 2,
            116: 2,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        B: {
            1: 1,
            2: 2,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1,
            11: 1,
            12: 1,
            13: 1,
            14: 1,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        T: {
            1: 2,
            2: 0,
            3: 2,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 2,
            116: 2,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        W: {
            1: 3,
            2: 0,
            3: 3,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 3,
            116: 3,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        A: {
            1: 2,
            2: 2,
            3: 2,
            4: 2,
            5: 2,
            6: 2,
            7: 2,
            8: 2,
            9: 2,
            10: 2,
            11: 2,
            12: 2,
            13: 2,
            14: 2,
            15: 2,
            16: 2,
            17: 2,
            18: 2,
            19: 2,
            20: 2,
            21: 2,
            22: 2,
            23: 2,
            24: 2,
            25: 2,
            26: 2,
            27: 2,
            28: 2,
            29: 2,
            30: 2,
            31: 2,
            32: 2,
            33: 2,
            34: 2,
            35: 2,
            36: 2,
            37: 2,
            38: 2,
            39: 2,
            40: 2,
            41: 2,
            42: 2,
            43: 2,
            44: 2,
            45: 2,
            46: 2,
            47: 2,
            48: 2,
            49: 2,
            50: 2,
            51: 2,
            52: 2,
            53: 2,
            54: 2,
            55: 2,
            56: 2,
            57: 2,
            81: 2,
            86: 2,
            82: 2,
            87: 2,
            83: 2,
            88: 2,
            84: 2,
            89: 2,
            85: 2,
            90: 2,
            91: 2,
            92: 2,
            93: 2,
            94: 2,
            95: 2,
            96: 2,
            97: 2,
            98: 2,
            99: 2,
            100: 2,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 2,
            112: 2,
            113: 0,
            114: 0,
            115: 2,
            116: 2,
            117: 2,
            118: 2,
            119: 2,
            120: 2,
            121: 2,
            122: 2,
            123: 2,
            124: 2,
            125: 2,
            126: 2,
            127: 2,
            128: 2,
            129: 2,
            130: 2,
            131: 2,
            132: 2,
            133: 2,
            134: 2,
            135: 2,
            136: 2,
            137: 2,
            138: 2,
            139: 2,
            140: 2,
            141: 2,
            142: 2,
            143: 2,
            144: 2,
            145: 2,
            146: 2,
            147: 2,
            148: 2,
            149: 2,
            150: 2,
            151: 2,
            152: 2,
            153: 2,
            154: 2,
            155: 2,
            156: 2,
            157: 2,
            158: 2,
            159: 2,
            160: 2,
            161: 2,
            162: 2,
            163: 2,
            164: 2,
            165: 2,
            166: 2,
            167: 2,
            168: 2,
            169: 2,
            170: 2,
            171: 2,
            172: 2,
            173: 2,
            174: 2,
            175: 2,
            176: 2,
            "": 2,
            181: 2,
            182: 2,
            183: 2,
            184: 2,
            185: 2,
            186: 2,
            187: 2,
            188: 2,
            189: 2,
            190: 2,
            191: 2,
            192: 2,
            193: 2,
            194: 2,
            195: 0
        },
        S: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 2,
            29: 0,
            30: 0,
            31: 0,
            32: 0,
            33: 2,
            34: 0,
            35: 0,
            36: 0,
            37: 2,
            38: 0,
            39: 0,
            40: 0,
            41: 2,
            42: 0,
            43: 0,
            44: 0,
            45: 0,
            46: 2,
            47: 0,
            48: 0,
            49: 0,
            50: 0,
            51: 2,
            52: 0,
            53: 0,
            54: 0,
            55: 0,
            56: 2,
            57: 0,
            81: 0,
            86: 0,
            82: 0,
            87: 0,
            83: 0,
            88: 0,
            84: 2,
            89: 2,
            85: 0,
            90: 0,
            91: 0,
            92: 0,
            93: 0,
            94: 2,
            95: 0,
            96: 0,
            97: 0,
            98: 0,
            99: 2,
            100: 0,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 0,
            112: 0,
            113: 0,
            114: 0,
            115: 0,
            116: 0,
            117: 0,
            118: 0,
            119: 0,
            120: 0,
            121: 2,
            122: 0,
            123: 0,
            124: 0,
            125: 0,
            126: 2,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 0,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 2,
            156: 0,
            157: 0,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 2,
            163: 0,
            164: 0,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 2,
            170: 0,
            171: 0,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 2,
            "": 0,
            181: 0,
            182: 0,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 2,
            188: 0,
            189: 0,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 2,
            195: 0
        },
        L: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 2,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 2,
            34: 0,
            35: 0,
            36: 0,
            37: 2,
            38: 0,
            39: 0,
            40: 0,
            41: 2,
            42: 0,
            43: 0,
            44: 0,
            45: 0,
            46: 2,
            47: 0,
            48: 0,
            49: 0,
            50: 0,
            51: 2,
            52: 0,
            53: 0,
            54: 0,
            55: 0,
            56: 2,
            57: 0,
            81: 0,
            86: 0,
            82: 0,
            87: 0,
            83: 0,
            88: 0,
            84: 2,
            89: 2,
            85: 0,
            90: 0,
            91: 0,
            92: 0,
            93: 0,
            94: 2,
            95: 0,
            96: 0,
            97: 0,
            98: 0,
            99: 2,
            100: 0,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 0,
            112: 0,
            113: 0,
            114: 0,
            115: 0,
            116: 0,
            117: 0,
            118: 0,
            119: 0,
            120: 0,
            121: 2,
            122: 0,
            123: 0,
            124: 0,
            125: 0,
            126: 2,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 0,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 2,
            156: 0,
            157: 0,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 2,
            163: 0,
            164: 0,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 2,
            170: 0,
            171: 0,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 2,
            "": 0,
            181: 0,
            182: 0,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 2,
            188: 0,
            189: 0,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 2,
            195: 0
        },
        P: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 0,
            29: 0,
            30: 0,
            31: 0,
            32: 0,
            33: 0,
            34: 0,
            35: 1,
            36: 0,
            37: 0,
            38: 0,
            39: 1,
            40: 0,
            41: 0,
            42: 0,
            43: 0,
            44: 1,
            45: 0,
            46: 0,
            47: 0,
            48: 0,
            49: 1,
            50: 0,
            51: 0,
            52: 0,
            53: 0,
            54: 1,
            55: 0,
            56: 0,
            57: 0,
            85: 0,
            90: 0,
            84: 0,
            89: 0,
            83: 0,
            88: 0,
            82: 1,
            87: 1,
            81: 0,
            86: 0,
            91: 0,
            92: 1,
            93: 0,
            94: 0,
            95: 0,
            96: 0,
            97: 1,
            98: 0,
            99: 0,
            100: 0,
            101: 1,
            102: 1,
            103: 1,
            104: 1,
            105: 1,
            106: 1,
            107: 1,
            108: 1,
            109: 1,
            110: 1,
            111: 0,
            112: 0,
            113: 1,
            114: 1,
            115: 0,
            116: 0,
            117: 0,
            118: 1,
            119: 0,
            120: 0,
            121: 0,
            122: 0,
            123: 1,
            124: 0,
            125: 0,
            126: 0,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 1,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 0,
            156: 0,
            157: 1,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 0,
            163: 0,
            164: 1,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 0,
            170: 0,
            171: 1,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 0,
            "": 0,
            181: 0,
            182: 1,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 0,
            188: 0,
            189: 1,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 0,
            195: 0
        }
    },
    R: {
        F: {
            1: 1,
            2: 2,
            3: 1,
            4: 2,
            5: 2,
            6: 2,
            7: 2,
            8: 2,
            9: 2,
            10: 2,
            11: 2,
            12: 2,
            13: 2,
            14: 2,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        B: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1,
            11: 1,
            12: 1,
            13: 1,
            14: 1,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        T: {
            1: 2,
            2: 0,
            3: 3,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 2,
            116: 2,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        W: {
            1: 3,
            2: 0,
            3: 4,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 3,
            116: 3,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        A: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1,
            11: 1,
            12: 1,
            13: 1,
            14: 1,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 1,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 1,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        S: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 1,
            29: 0,
            30: 0,
            31: 0,
            32: 0,
            33: 2,
            34: 0,
            35: 0,
            36: 0,
            37: 1,
            38: 0,
            39: 0,
            40: 0,
            41: 1,
            42: 0,
            43: 0,
            44: 0,
            45: 0,
            46: 1,
            47: 0,
            48: 0,
            49: 0,
            50: 0,
            51: 1,
            52: 0,
            53: 0,
            54: 0,
            55: 0,
            56: 1,
            57: 0,
            81: 0,
            86: 0,
            82: 0,
            87: 0,
            83: 0,
            88: 0,
            84: 1,
            89: 1,
            85: 0,
            90: 0,
            91: 0,
            92: 0,
            93: 0,
            94: 1,
            95: 0,
            96: 0,
            97: 0,
            98: 0,
            99: 1,
            100: 0,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 0,
            112: 0,
            113: 0,
            114: 0,
            115: 0,
            116: 0,
            117: 0,
            118: 0,
            119: 0,
            120: 0,
            121: 1,
            122: 0,
            123: 0,
            124: 0,
            125: 0,
            126: 1,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 0,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 1,
            156: 0,
            157: 0,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 1,
            163: 0,
            164: 0,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 1,
            170: 0,
            171: 0,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 1,
            "": 0,
            181: 0,
            182: 0,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 1,
            188: 0,
            189: 0,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 1,
            195: 0
        },
        L: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 1,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 2,
            34: 0,
            35: 0,
            36: 0,
            37: 1,
            38: 0,
            39: 0,
            40: 0,
            41: 1,
            42: 0,
            43: 0,
            44: 0,
            45: 0,
            46: 1,
            47: 0,
            48: 0,
            49: 0,
            50: 0,
            51: 1,
            52: 0,
            53: 0,
            54: 0,
            55: 0,
            56: 1,
            57: 0,
            81: 0,
            86: 0,
            82: 0,
            87: 0,
            83: 0,
            88: 0,
            84: 1,
            89: 1,
            85: 0,
            90: 0,
            91: 0,
            92: 0,
            93: 0,
            94: 1,
            95: 0,
            96: 0,
            97: 0,
            98: 0,
            99: 1,
            100: 0,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 0,
            112: 0,
            113: 0,
            114: 0,
            115: 0,
            116: 0,
            117: 0,
            118: 0,
            119: 0,
            120: 0,
            121: 1,
            122: 0,
            123: 0,
            124: 0,
            125: 0,
            126: 1,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 0,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 1,
            156: 0,
            157: 0,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 1,
            163: 0,
            164: 0,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 1,
            170: 0,
            171: 0,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 1,
            "": 0,
            181: 0,
            182: 0,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 1,
            188: 0,
            189: 0,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 1,
            195: 0
        },
        P: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 0,
            29: 0,
            30: 0,
            31: 0,
            32: 0,
            33: 0,
            34: 0,
            35: 1,
            36: 0,
            37: 0,
            38: 0,
            39: 1,
            40: 0,
            41: 0,
            42: 0,
            43: 0,
            44: 1,
            45: 0,
            46: 0,
            47: 0,
            48: 0,
            49: 1,
            50: 0,
            51: 0,
            52: 0,
            53: 0,
            54: 1,
            55: 0,
            56: 0,
            57: 0,
            85: 0,
            90: 0,
            84: 0,
            89: 0,
            83: 0,
            88: 0,
            82: 1,
            87: 1,
            81: 0,
            86: 0,
            91: 0,
            92: 1,
            93: 0,
            94: 0,
            95: 0,
            96: 0,
            97: 1,
            98: 0,
            99: 0,
            100: 0,
            101: 1,
            102: 1,
            103: 1,
            104: 1,
            105: 1,
            106: 1,
            107: 1,
            108: 1,
            109: 1,
            110: 1,
            111: 0,
            112: 0,
            113: 1,
            114: 1,
            115: 0,
            116: 0,
            117: 0,
            118: 1,
            119: 0,
            120: 0,
            121: 0,
            122: 0,
            123: 1,
            124: 0,
            125: 0,
            126: 0,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 1,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 0,
            156: 0,
            157: 1,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 0,
            163: 0,
            164: 1,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 0,
            170: 0,
            171: 1,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 0,
            "": 0,
            181: 0,
            182: 1,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 0,
            188: 0,
            189: 1,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 0,
            195: 0
        }
    }
}
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
window.BaseInfo = BaseInfo;
Object.freeze(BaseInfo);

window.RequestID = 0;
class IncomeGrapher {
    width;
    height;
    terrain;
    bases = new Map();
    properties = new Map();
    //x + y * this.wdith
    //x: e,
    //y: t,
    //id: n,
    //country: i
    units;
    otherUnits;
    canvas;
    canvasRecon;
    ctx;
    ctxRecon;
    dirty;
    constructor(e = 0, t = 0) {
        this.canvas = document.createElement("canvas");
        this.canvasRecon = document.createElement("canvas");
        this.resize(e, t);
        this.dirty = !0;
    }
    resize(width, height) {
        this.width = width;
        this.height = height;

        // Ensure canvas exists
        if (!this.canvas) {
            this.canvas = document.createElement("canvas");
        }

        // Ensure canvas exists
        if (!this.canvasRecon) {
            this.canvasRecon = document.createElement("canvas");
        }

        this.canvas.width = 16 * this.width;
        this.canvas.height = 16 * this.height;
        this.canvasRecon.width = 16 * this.width;
        this.canvasRecon.height = 16 * this.height;

        this.ctx = this.canvas.getContext("2d");
        if (this.ctx) {
            this.ctx.textAlign = "center";
        } else {
            console.warn("Canvas context could not be initialized.");
        }

        this.terrain = new Array(width * height).fill(null); // Ensure it's filled
        this.bases = {};
        this.properties = new Array(width * height).fill(null);
        this.units = {};

        return this;
    }
    init(e) {
        this.canvas.style = "\n        pointer-events: none;\n        z-index: 200;\n        position: absolute;\n        top: 0;\n        left: 0;";
        e = e ?? document.getElementById("gamemap");
        if (e) {
            e.append(this.canvas);
        }
        this.ctx = this.canvas.getContext("2d");
        this.ctx.font = "12px monospace";
        this.ctx.textAlign = "center";

        this.canvasRecon.style = "\n        pointer-events: none;\n        z-index: 200;\n        position: absolute;\n        top: 0;\n        left: 0;";
        if (e) {
            e.append(this.canvasRecon);
        }

        this.ctxRecon = this.canvasRecon.getContext("2d");
        this.ctxRecon.font = "12px monospace";
        this.ctxRecon.textAlign = "center";
    }
    idToCountry(e) {
        return BaseInfo.terrain[e].country
    }
    isNeutral(e) {
        return e >= 34 && e <= 37
    }
    getTile(e, t) {
        return this.terrain[e + t * this.width]
    }
    setTile(e, t, n) {
        let i = e + t * this.width;
        return this.terrain[i] = n, this.dirty = !0, this
    }
    setUnit(e, t, n, i) {
        this.units[e + t * this.width] = {
            x: e,
            y: t,
            id: n,
            country: i
        }, this.dirty = !0
    }
    setUnits(e) {
        this.deleteAllUnits();
        for (let t = 0; t < e.length; t++) {
            let n = e[t].units_x,
                i = e[t].units_y,
                o = e[t].units_id,
                r = e[t].units_code;
            this.setUnit(n, i, o, r)
        }
    }
    deleteUnit(e, t) {
        this.units[e + t * this.width] && (delete this.units[e + t * this.width], this.dirty = !0)
    }
    deleteAllUnits() {
        this.units = {}, this.dirty = !0
    }
    setTerrain({
        terrainInfo: e,
        tiles: t
    } = {}) {
        if (this.dirty = !0, e) {
            for (let t in e) {
                t = parseInt(t);
                for (let n in e[t]) n = parseInt(n), this.terrain[t + n * this.width] = e[t][n].terrain_id
            }
            for (let e in buildingsInfo) {
                e = parseInt(e);
                for (let t in buildingsInfo[e]) t = parseInt(t), this.terrain[e + t * this.width] = buildingsInfo[e][t].terrain_id
            }
        } else {
            if (!t) throw new Error("give me some tiles bro");
            for (let e = 0; e < this.width; e++) {
                for (let n = 0; n < this.height; n++) {
                    const index = n + e * this.height; // Calculate index
                    let is_prop = t[index] == null;
                    if (is_prop) {
                        continue;
                    }
                    const i = t[index].terrain_id;
                    this.terrain[e + n * this.width] = i;
                }
            }
        }
        return this
    }
    getMoveCostGraph(e, j, t = "C") {
        let n = new Array(this.width * this.height);
        const i = BaseInfo.moveCosts[t][e];
        for (let t = 0; t < this.height; t++) {
            for (let o = 0; o < this.width; o++) {
                // Vesper: Added code for the ignore Pipe Seam Function.
                // Should return move cost value like it was broken if ignorePipes (j) is on.
                // Remove this for the Income Grapher
                let r = this.terrain[o + t * this.width],
                    a = i[r],
                    bp = i[115];
                let b = "S" === e || "L" === e;
                let s = 113 === r || 114 === r;
                void 0 === a && (a = b ? -1 : 1)
                if (0 === a && 195 !== r) {
                    a = -1;
                }
                if (j && s && !b) {
                    a = bp;
                }
                n[o + t * this.width] = a;
            }
        }
        return new WeightedDirectedGraph(n, this.width, this.height)
    }
    clear() {
        this.ctx.clearRect(0, 0, 16 * this.width, 16 * this.height);
        this.ctxRecon.clearRect(0, 0, 16 * this.width, 16 * this.height);
    }
    setFont() {
        return this.ctx.font = "10px monospace", this.ctx.textAlign = "center", this.ctx.strokeStyle = "black", this.ctx.lineWidth = 2, this.ctx.fillStyle = "white", this
    }
    drawText(e, t, n) {
        return this.ctx.strokeText(e, t, n), this.ctx.fillText(e, t, n), this
    }
    // By country, whoever's base is closer to a property is theirs.
    // Country: [] of Vector2i
    propertyMap = {};
    // Country: [] of IncomeDay
    incomeDays = {};
    countries = [];
    validCountries = [];
    // Country: [] of Unit
    predeployed = {};
    predeployedOther = {};
    block_properties = false;
    // County: [] of Property
    incomeFlips = {};
    tankOrderFound = false;
    income = 1000;
    contested = [];
    ftaInfo = {};
    // Country: ReconData
    reconData = {};
    tankDelay = 0;
    async recalculate() {
        window.RequestID = 0;

        let countries = [];
        this.bases = new Map();
        this.properties = new Map();
        this.propertyMap = {};
        this.incomeDays = {};
        this.tankOrder = [];
        this.extendedTankOrder = [];
        this.extendedTankOrderIndex = [];
        this.contested = [];
        this.ftaInfo = {
            "Day1": 0,
            "Day2": 0,
            "Day3": 0,
            "Neutrals": 0,
            "Flips": 0,
        };
        for (let pos in this.units) {
            let data = this.units[pos]
            if (data.id != 1) {
                continue;
            }
            let country = data.country;
            if (!countries.includes(country)) {
                countries.push(country)
                this.predeployed[country] = [];
            }
            this.predeployed[country].push(data);
        }
        this.predeployedOther = {};
        for (let pos in this.otherUnits) {
            let data = this.otherUnits[pos]
            if (data.id == 1) {
                continue;
            }
            let country = data.country;
            if (!countries.includes(country)) {
                countries.push(country);
            }
            if (this.predeployedOther[country] == undefined) {
                this.predeployedOther[country] = [];
            }
            this.predeployedOther[country].push(data);
        }
        let validCountries = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let id = this.terrain[x + y * this.width];
                let data = BaseInfo.terrain[id]
                if (!validCountries.includes(data.country) && data.country != "" && (data.name.includes(" Lab") || data.name.includes(" HQ"))) {
                    validCountries.push(data.country);
                }
            }
        }
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let id = this.terrain[x + y * this.width];
                let data = BaseInfo.terrain[id]
                if (data.country == "" || data.name.includes(" Lab") || data.name.includes("Com Tower")) {
                    continue;
                }
                let country = data.country;
                if (!countries.includes(country) && validCountries.includes(country)) {
                    countries.push(country)
                }
            }
        }
        validCountries.sort(function(a, b){return BaseInfo.countries[a].id - BaseInfo.countries[b].id});
        this.countries = validCountries;
        this.validCountries = validCountries;
        for (let country of this.countries) {
            let firstDay = new IncomeDay();
            this.incomeDays[country] = [firstDay];
            this.propertyMap[country] = new Map();
        }
        this.assignProperties();
        for (let country of Object.keys(this.incomeDays)) {
            let firstDay = this.incomeDays[country][0];
            for (let pos of this.propertyMap[country].keys()) {
                let property = this.propertyMap[country].get(pos);
                if (property.type == "Base") {
                    this.bases.set(pos, property);
                    firstDay.startingBases.push(property)
                }
                if (property.type == "City" || property.type == "HQ") {
                    firstDay.properties.push(property)
                    firstDay.startingCities.push(property)
                }
                firstDay.startingPropertyCount += 1;
                firstDay.endingPropertyCount += 1;
            }
        }
        for (let country of Object.keys(this.incomeDays)) {
            let firstDay = this.incomeDays[country][0];
            firstDay.generatedFunds = 0;
            firstDay.generatedTaxedFunds = 0;
            this.countryData[country] = {}
            this.countryData[country][0] = {
                totalInf: this.predeployed[country] != undefined ? this.predeployed[country].length : 0,
                countryName: BaseInfo.countries[country].name
            }
        }
        this.setCityOwnership();
        this.calculateIncomeDays();
        this.countries = validCountries;

        this.reconData = {};
        for (let country of this.countries) {
            let recon = new ReconData();
            recon.country = country;
            this.reconData[country] = recon;

            for (let base of this.bases.values()) {
                if (base.owner != country) continue;
                recon.bases.push(base.where);
            }

            for (let property of this.properties.values()) {
                for (let base of property.reconDistances.keys()) {
                    let distance = property.reconDistances.get(base);
                    let hit = {
                        what: property,
                        cost: distance,
                        from: base.where,
                        base: base,
                    }
                    recon.allHits.push(hit);
                }
            }
        }

        for (let country of this.countries) {
            let recon = this.reconData[country];
            let index = 0;

            if (this.incomeDays[country] == undefined) continue;

            for (let day of this.incomeDays[country]) {
                let activeBases = 0;
                activeBases += day.startingBases.length
                for (let base of day.bases) {
                    if (base.captured != -1 && index > base.captured) activeBases += 1;
                    else if (base.captured == -1) activeBases += 1;
                }
                if (recon.earliestSkipRecon == 0) {
                    if (day.startingFunds >= 4000 && activeBases > 0) {
                        recon.earliestSkipRecon = index;
                    }
                }
                if (day.startingFunds >= 4000 && activeBases > 0) {
                    if (day.startingFunds - 4000 >= (activeBases - 1) * 1000) {
                        recon.earliestNormalRecon = index;
                    }
                }
                if (recon.earliestSkipRecon != 0 && recon.earliestNormalRecon != 0) break;
                index += 1;
            }
        }

        let ctx = this.ctx;
        for (let c of Object.keys(this.predeployed)) {
            let inf = await loadImage(`terrain/aw1/${c}infantry.gif`);
            for (let unit of this.predeployed[c]) {
                if (!this.countries.includes(unit.country)) continue;
                let where = new Vector2i();
                where.x = unit.startingPos ? unit.startingPos.x : unit.x;
                where.y = unit.startingPos ? unit.startingPos.y : unit.y;

                let ignore = false;

                for (let property of this.properties.values()) {
                    if (property.ghosted || property.taxDays > 0) {
                        if (property.where.x == where.x && property.where.y == where.y) {
                            ignore = true;
                            break;
                        }
                    }
                }

                if (ignore) continue;

                ctx.drawImage(inf, 16 * where.x, 16 * where.y);
                if (unit.health < 10) {
                    let damage = await loadImage(`terrain/ani/${unit.health}.gif`)
                    ctx.drawImage(damage, 16 * where.x + 8, 16 * where.y + 7);
                }
            }
        }
        for (let c of Object.keys(this.predeployedOther)) {
            let inf = await loadImage(`terrain/aw1/${c}infantry.gif`);
            for (let unit of this.predeployedOther[c]) {
                let n = BaseInfo.units[unit.id].name.toLowerCase().replace(" ", "");
                let image = await loadImage(`terrain/aw1/${c}${n}.gif`);
                ctx.drawImage(image, 16 * unit.x, 16 * unit.y);
                if (unit.health < 10) {
                    let damage = await loadImage(`terrain/ani/${unit.health}.gif`)
                    ctx.drawImage(damage, 16 * unit.x + 8, 16 * unit.y + 7);
                }
            }
        }
    }
    async assignProperties() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let id = this.terrain[x + y * this.width];
                let data = BaseInfo.terrain[id]
                if (data.defense < 3 || data.name.includes("Missile") || data.name.includes(" Lab") || data.name.includes("Com Tower") || data.name.includes("Mountain")) {
                    continue;
                }
                let country = data.country;
                let property = new Property();
                let pos = new Vector2i();
                pos.x = x;
                pos.y = y;
                property.owner = country;
                property.originalOwner = data.country;
                property.where = pos;
                if (data.name.includes("Base")) {
                    property.type = "Base";
                    this.bases.set(pos, property);
                    if (property.owner == "") {
                        this.properties.set(pos, property);
                        let id = this.terrain[pos.x + pos.y * this.width]
                        if (id == 35) {
                            property.neutralBase = true;
                        }
                    }
                } else if (data.name.includes("HQ")) {
                    property.type = "HQ";
                    this.properties.set(pos, property);
                } else {
                    property.type = "City"
                    this.properties.set(pos, property);
                }
                if (country != "") {
                    if (!(country in this.propertyMap)) this.propertyMap[country] = new Map();
                    this.propertyMap[country].set(pos, property);
                } else {
                    let id = this.terrain[pos.x + pos.y * this.width]
                    if (id == 35) {
                        property.asleep = true;
                    }
                }
            }
        }
    }
    async setCityOwnership() {
        // Base: [Country: cost]
        for (let unit of this.units) {
            //Ignore 1HP Units.
            if (unit.health == 1) continue;
            //Ignore Ghost Units.
            if (!this.countries.includes(unit.country)) continue;

            let graph = this.getMoveCostGraph(BaseInfo.units[unit.id].move_type, false);
            let pathing = new Dijkstra(graph, [unit], this.width, this.height).iterate(3 * 15);
            for (let base of this.bases.values()) {
                if (base.owner == unit.country) {
                    continue;
                }
                let s = base.where.x + base.where.y * this.width;
                let cost = pathing[s];
                if (!base.neutralBase) {
                    let p = new Dijkstra(graph, [unit], this.width, this.height).iterate(3);
                    cost = p[s];
                }
                this.properties.set(base.where, base)
                if (cost != -1 && cost != undefined) {
                    if (cost <= 3 && !base.neutralBase) {
                        base.owner = unit.country;
                        base.disabled = true;
                    }
                }
            }
        }
        for (let unit of this.units) {
            let baseOnTop = undefined;
            for (let base of this.bases.values()) {
                if (unit.x == base.where.x && unit.y == base.where.y) {
                    baseOnTop = base;
                    break;
                }
            }
            if (baseOnTop != undefined) {
                if (unit.health == 1 && unit.country != baseOnTop.owner && this.countries.includes(unit.country)) {
                    baseOnTop.taxDays = 1;
                    continue;
                } else if (!this.countries.includes(unit.country)) {
                    baseOnTop.ghosted = true;
                    baseOnTop.neutralBase = false;
                    continue;
                }
            }

            //Ignore 1HP units.
            if (unit.health == 1) continue;
            //Ignore Ghost Units.
            if (!this.countries.includes(unit.country)) continue;

            let graph = this.getMoveCostGraph(BaseInfo.units[unit.id].move_type, false);
            let pathing = new Dijkstra(graph, [unit], this.width, this.height).iterate(3 * 15);
            for (let base of this.bases.values()) {
                if (base.owner == unit.country) {
                    continue;
                }
                let s = base.where.x + base.where.y * this.width;
                let cost = pathing[s];
                if (!base.neutralBase) {
                    let p = new Dijkstra(graph, [unit], this.width, this.height).iterate(3);
                    cost = p[s];
                }
                this.properties.set(base.where, base)
                if (cost != -1 && cost != undefined) {
                    if (cost <= 3 && !base.neutralBase) {
                        base.owner = unit.country;
                        base.disabled = true;
                    }
                    if (base.neutralBase) {
                        if (base.unitDistances[unit.country] == undefined) {
                            base.unitDistances[unit.country] = cost;
                        }
                        if (base.unitDistances[unit.country] > cost) {
                            base.unitDistances[unit.country] = cost;
                        }
                    }
                }
                // Check with nearby bases so that the predeployed doesn't steal it.
                for (let b of this.bases.values()) {
                    if (b == base) continue;
                    if (b.disabled) continue;
                    if (b.ghosted) continue;
                    let fakeUnit = {
                        x: b.where.x,
                        y: b.where.y,
                        id: 1,
                        country: "os"
                    };
                    let pathing = new Dijkstra(graph, [fakeUnit], this.width, this.height).iterate(3 * 15);
                    let s = base.where.x + base.where.y * this.width;
                    let cost = pathing[s];
                    if (cost != -1 && cost != undefined) {
                        if (base.unitDistances[b.owner] != undefined && base.unitDistances[b.owner] > cost) {
                            base.unitDistances[b.owner] = cost;
                        } else if (base.unitDistances[b.owner] == undefined) {
                            base.unitDistances[b.owner] = cost;
                        }
                    }
                }
            }
        }
        for (let base of this.bases.values()) {
            if (!base.neutralBase) continue;
            if (base.owner != "") continue;
            let items = Object.keys(base.unitDistances).map(function(key) {
                return [key, base.unitDistances[key]];
            });
            // Sort the array based on the second element
            items.sort(function(first, second) {
                if (second == undefined) return -1;
                if (first == undefined) return 1;
                return first[1] - second[1];
            });
            if (items.length > 0) {
                let winner = items[0][0];
                base.owner = winner;
            }
        }
        let neutralBases = [];
        // First Pass For Bases.
        for (let pos of this.properties.keys()) {
            let property = this.properties.get(pos);
            if (!property.neutralBase) continue;
            let fakeUnit = {
                x: pos.x,
                y: pos.y,
                id: 1,
                country: "os"
            };
            let graph = this.getMoveCostGraph(BaseInfo.units[fakeUnit.id].move_type, false);
            let pathCosts = {};
            let baseCosts = {};
            for (let country of this.countries) {
                let costs = [];
                for (let base of this.bases.values()) {
                    if (base == property) continue;
                    if (base.owner != country) {
                        continue;
                    }

                    // Infantry Check
                    fakeUnit.x = base.where.x;
                    fakeUnit.y = base.where.y;
                    let pathing = new Dijkstra(graph, [fakeUnit], this.width, this.height).iterate(3 * 15);
                    let s = pos.x + pos.y * this.width;
                    let cost = pathing[s];
                    let lowestDistance = Math.abs(base.where.x - property.where.x) + Math.abs(base.where.y - property.where.y);
                    if (cost != -1 && cost != undefined) {
                        costs.push(cost);
                        property.distances.set(base, Math.ceil(cost / 3))
                    }
                }
                let unitDistance = property.unitDistances[country]
                if (unitDistance != undefined) {
                    costs.push(unitDistance);
                }
                costs.sort(function(a, b){return a - b});
                if (costs.length > 0) {
                    pathCosts[country] = costs[0];
                }
            }
            let items = Object.keys(pathCosts).map(function(key) {
                return [key, pathCosts[key]];
            });
            // Sort the array based on the second element
            items.sort(function(first, second) {
                if (second == undefined) return -1;
                if (first == undefined) return 1;
                return first[1] - second[1];
            });
            if (items.length > 0) {
                if (items.length >= 2 && items[0][1] == items[1][1]) {
                    property.owner = "";
                    property.contested = true;
                    this.contested.push(property);
                } else {
                    let winner = items[0][0];
                    property.owner = winner;
                    property.travelDays = Math.ceil(pathCosts[winner] / 3);
                    this.ftaInfo.Neutrals += 1;
                    neutralBases.push(property);
                }
            }
        }
        for (let pos of this.properties.keys()) {
            let property = this.properties.get(pos);
            if (property.neutralBase) continue;
            let fakeUnit = {
                x: pos.x,
                y: pos.y,
                id: 1,
                country: "os"
            };

            for (let unit of this.units) {
                if (unit.x == pos.x && unit.y == pos.y && !this.countries.includes(unit.country)) {
                    property.ghosted = true;
                } else if (unit.x == pos.x && unit.y == pos.y && unit.health == 1) {
                    property.taxDays = 1;
                }
            }

            let graph = this.getMoveCostGraph(BaseInfo.units[fakeUnit.id].move_type, false);
            let reconGraph = this.getMoveCostGraph(BaseInfo.units[5].move_type, false);

            let pathCosts = {};
            let baseCosts = {};
            for (let country of this.countries) {
                let costs = [];
                let all_bases = [];
                for (let b of this.bases.values()) all_bases.push(b);
                for (let b of neutralBases) all_bases.push(b);
                for (let base of all_bases) {
                    if (base.owner != country) {
                        continue;
                    }
                    fakeUnit.x = base.where.x;
                    fakeUnit.y = base.where.y;
                    let dij = new Dijkstra(graph, [fakeUnit], this.width, this.height);
                    let pathing = dij.iterate(3 * 15);
                    let s = pos.x + pos.y * this.width;
                    let cost = pathing[s];
                    if (cost != -1 && cost != undefined) {
                        costs.push(pathing[s]);
                        property.distances.set(base, Math.ceil(pathing[s] / 3))
                    }
                }
                costs.sort(function(a, b){return a - b});
                if (costs.length > 0) {
                    pathCosts[country] = costs[0];
                }
            }
            let items = Object.keys(pathCosts).map(function(key) {
                return [key, pathCosts[key]];
            });
            // Sort the array based on the second element
            items.sort(function(first, second) {
                return first[1] - second[1];
            });
            if (items.length > 0) {
                if (items.length >= 2 && items[0][1] == items[1][1]) {
                    property.owner = "";
                    property.contested = true;
                    this.contested.push(property);
                } else {
                    let winner = items[0][0];
                    property.travelDays = Math.ceil(pathCosts[winner] / 3);
                    property.owner = winner;
                    if (property.travelDays <= 3) {
                        if (property.travelDays == 1) this.ftaInfo.Day1 += 1;
                        else if (property.travelDays == 2) this.ftaInfo.Day2 += 1;
                        else if (property.travelDays == 3) this.ftaInfo.Day3 += 1;
                    }
                }
            }
        }
        let reconGraph = this.getMoveCostGraph(BaseInfo.units[5].move_type, false);
        for (let pos of this.properties.keys()) {
            let property = this.properties.get(pos);
            for (let country of this.countries) {
                if (property.owner == country) continue;

                let costs = [];
                let all_bases = [];
                for (let b of this.bases.values()) all_bases.push(b);
                for (let b of neutralBases) all_bases.push(b);
                for (let base of all_bases) {
                    if (base.owner != country) {
                        continue;
                    }

                    // Recon Check
                    let recon = {
                        x: base.where.x,
                        y: base.where.y,
                        id: 5,
                        country: "os"
                    };
                    // Check within 5 days
                    // The default reader will check for 2 days anyway.
                    let reconPathing = new Dijkstra(reconGraph, [recon], this.width, this.height).iterate(8 * 5);
                    let sR = pos.x + pos.y * this.width;
                    let costR = reconPathing[sR];
                    property.reconDistances.set(base, costR);
                }
            }
        }
    }
    // Country
      // Day:
        // startingFunds: int,
        // endingFunds: int,
        // startingIncome: int,
        // endingIncome: int
    countryData = {};
    // {
    // Country: os
    // Day: int
    // }
    tankOrder = [];
    // In Letters
    extendedTankOrder = [];
    extendedTankOrderIndex = [];
    // Country
    // {
    // Day: int
    // }
    flipQueue = {}
    // Country
    // {
    // Day: [] of Vector2i()
    // }
    whereFlips = {};
    async calculateIncomeDays() {
        let unitMap = [];
        for (let country of Object.keys(this.predeployed)) {
            for (let unit of this.predeployed[country]) {
                unitMap.push(structuredClone(unit));
            }
        }
        let unitMapOther = [];
        for (let country of Object.keys(this.predeployedOther)) {
            for (let unit of this.predeployedOther[country]) {
                unitMapOther.push(structuredClone(unit));
            }
        }
        let day = 0;
        for (let country of this.countries) {
            this.incomeFlips[country] = {};
            this.flipQueue[country] = {};
            this.whereFlips[country] = {};
        }
        while (Object.keys(this.tankOrder).length <= 2 * this.countries.length && day < 15) {
            day += 1;
            for (let country of this.countries) {
                if (this.whereFlips[country][day] == undefined) {
                    this.whereFlips[country][day] = [];
                }
                let d = this.incomeDays[country][day] ?? new IncomeDay();
                this.incomeDays[country][day] = d;

                let leftoverRequests = [];
                let pd = null;
                if (this.incomeDays[country][day - 1] != undefined) {
                    pd = this.incomeDays[country][day - 1];

                    for (let r of pd.leftoverRequests) leftoverRequests.push(r);

                    d.previousDay = pd;
                    d.capRequests = new Map(pd.capRequests);
                    d.bases = pd.bases.slice();
                    d.properties = pd.properties.slice();
                    d.startingBases = pd.startingBases.slice();
                    d.startingCities = pd.startingCities.slice();
                    d.recentBaseCaps = pd.recentBaseCaps.slice();
                    d.recentCityCaps = pd.recentCityCaps.slice();
                    d.recentUsedCityCaps = pd.recentUsedCityCaps.slice();
                    d.startingPropertyCount = pd.endingPropertyCount;
                    let withoutFlipped = [];
                    let flipped = [];
                    for (let prop of d.properties) {
                        if (prop.flipped) {
                            flipped.push(prop);
                        } else {
                            withoutFlipped.push(prop);
                        }
                    }
                    if (this.countries[0] == country) {
                        for (let prop of flipped) {
                            if (prop.originalOwner == country && prop.flipped && prop.captured + 1 == day) {
                                d.startingPropertyCount -= 1;
                            }
                        }
                        for (let base of d.startingBases) {
                            if (base.flipped && base.captured + 1 == day) d.startingPropertyCount -= 1;
                        }
                    }
                    if (this.countries[0] != country) {
                        for (let prop of flipped) {
                            if (prop.originalOwner == country && prop.flipped && prop.captured == day) {
                                d.startingPropertyCount -= 1;
                            }
                        }
                        for (let base of d.startingBases) {
                            if (base.flipped && base.captured == day) d.startingPropertyCount -= 1;
                        }
                    }
                    d.properties = withoutFlipped;
                    d.startingFunds = pd.endingFunds + d.getStartingIncome(this.income);
                    d.generatedFunds += d.getStartingIncome(this.income) + pd.generatedFunds;
                    d.generatedTaxedFunds += d.getStartingIncome(this.income) + pd.generatedTaxedFunds;
                    d.totalUnitValue += pd.totalUnitValue;
                    d.totalInf = pd.totalInf;
                    d.totalTanks = pd.totalTanks;
                    d.totalOtherDeployed = pd.totalOtherDeployed;
                }
                let all_requests = [];
                let infantryPositions = [];
                let infantryHealths = {};
                for (let pos of d.recentCityCaps) {
                    if (!d.recentUsedCityCaps.includes(pos)) {
                        infantryPositions.push(pos);
                    }
                }
                // true = Infantry, false = Base;
                let operatingBases = [];
                if (day == 1) {
                    for (let pos of this.propertyMap[country].keys()) {
                        let property = this.propertyMap[country].get(pos);
                        if (property.owner != country) {
                            continue;
                        }
                        if (property.type == "Base" && !d.startingBases.includes(property)) {
                            d.bases.push(property);
                            d.startingBases.push(property)
                        } else if (property.type != "Base" && !d.startingCities.includes(property)) {
                            d.properties.push(property);
                            d.startingCities.push(property);
                        }
                    }
                    d.startingPropertyCount = d.startingBases.length + d.startingCities.length;
                    d.startingFunds = d.startingPropertyCount * this.income;
                    for (let c of Object.keys(this.predeployedOther)) {
                        if (c != country) {
                            continue;
                        }
                        for (let unit of this.predeployedOther[c]) {
                            let value = BaseInfo.units[unit.id].cost;
                            let n = BaseInfo.units[unit.id].name.toLowerCase().replace(" ", "");
                            d.totalUnitValue += value;
                            if (d.totalOtherDeployed[n] == undefined) {
                                d.totalOtherDeployed[n] = 0;
                            }
                            d.totalOtherDeployed[n] += 1;
                        }
                    }
                    for (let c of Object.keys(this.predeployed)) {
                        if (c != country) {
                            continue;
                        }
                        for (let unit of this.predeployed[c]) {
                            let pos = new Vector2i();
                            pos.x = unit.x;
                            pos.y = unit.y;
                            infantryPositions.push(pos)
                            let value = 1e3 * (unit.health / 10);
                            d.totalUnitValue += value;
                        }
                    }
                    d.totalInf = this.predeployed[country] != undefined ? this.predeployed[country].length : 0;
                }
                // Unit Repairs
                if (d.startingFunds > 0) {
                    let allUnits = unitMap.slice();
                    for (let u of unitMapOther) allUnits.push(u);

                    allUnits.sort((a, b) => {
                        if (a.x === b.x) {
                            return a.y - b.y; // Sort by y if x values are equal
                        }
                        return a.x - b.x; // Sort by x first
                    });

                    for (let unit of allUnits) {
                        let health = unit.health;
                        if (unit.country != country) continue;
                        if (health == 10) continue;

                        let pos = new Vector2i();
                        pos.x = unit.x;
                        pos.y = unit.y;

                        let req = undefined;
                        if (unit.id == 1) {
                            for (let request of d.capRequests.values()) {
                                if (request.health < 10 && request.unit == unit) {
                                    req = request;
                                    break;
                                }
                            }

                            // Skip Me if I am moving yet I could have been healed.
                            if (req == undefined && day != 1) continue;
                            // It needs to have been captured the day before.
                            if (req != undefined && !req.isCaptured(day - 1)) continue;
                        }

                        let moveType = BaseInfo.units[unit.id].move_type;
                        let property = null;
                        let at = pos;
                        if (req != undefined) {
                            at = req.to;
                        }
                        for (let prop of this.properties.values()) {
                            if (prop.where.x == at.x && prop.where.y == at.y) {
                                property = prop;
                                break;
                            }
                        }
                        if (property == undefined) {
                            for (let base of this.bases.values()) {
                                let where = base.where;
                                if (where.x == pos.x && where.y == pos.y) {
                                    property = base;
                                    break
                                }
                            }
                            if (property == undefined) continue;
                        }

                        if (property.owner != country) continue;
                        if (property.type != "Base") {
                            if (property.captured == -1 && !d.startingCities.includes(property)) continue;
                            if (property.captured != -1 && property.captured > day) continue;
                        }

                        let terrainID = this.terrain[at.x + this.width * at.y];
                        if (terrainID == undefined) continue;

                        let terrainInfo = BaseInfo.terrain[terrainID];
                        if (moveType == "A" && !terrainInfo.name.includes("Airport")) continue;
                        else if ((moveType == "S" || moveType == "L") && !terrainInfo.name.includes("Port")) continue;
                        else if ((moveType != "A" && moveType != "S" && moveType != "L") &&
                                 !terrainInfo.name.includes("City") && !terrainInfo.name.includes("Base") && !terrainInfo.name.includes("HQ")) continue;

                        let unitData = BaseInfo.units[unit.id];
                        let cost = unitData.cost;
                        let costPerHealth = cost / 10;
                        let maxHeal = Math.min(2, 10 - health);
                        let totalCost = costPerHealth * maxHeal;

                        let newFunds = d.startingFunds - totalCost;
                        if (newFunds < 0) continue;

                        let repair = {
                            x: at.x,
                            y: at.y,
                            health: maxHeal,
                            newHealth: unit.health + maxHeal,
                            cost: totalCost,
                            who: country,
                            what: unitData.name,
                            sprite: unitData.name.toLowerCase().replace(" ", ""),
                        };
                        d.repairs.push(repair);
                        d.startingFunds -= totalCost;
                        d.generatedTaxedFunds -= totalCost;
                        d.totalUnitValue += totalCost;
                        unit.health += maxHeal;
                        if (unit.id == 1) unit.startingPos = at;
                    }
                }
                for (let pos of this.bases.keys()) {
                    let base = this.bases.get(pos);
                    if (base.owner != country || base.neutral || base.disabled || base.asleep || base.ghosted) {
                        continue;
                    }
                    operatingBases.push(base);
                }
                for (let base of d.bases) {
                    if (operatingBases.includes(base) || base.asleep || base.ghosted) {
                        continue;
                    }
                    operatingBases.push(base);
                }
                let redo = [];
                for (let infPos of infantryPositions) {
                    for (let pos of this.properties.keys()) {
                        let property = this.properties.get(pos);
                        if (d.capRequests.has(pos) || d.startingBases.includes(property) || d.startingCities.includes(property)) {
                            continue;
                        }
                        if (property.owner != country) {
                            continue;
                        }
                        let request = new CapRequest();
                        request.when = day;
                        request.from = infPos;
                        request.to = pos;
                        request.what = property;
                        let fakeUnit = {
                            x: infPos.x,
                            y: infPos.y,
                            id: 1,
                            country: country
                        };
                        let c = this.properties.get(infPos);
                        // if (property.where.x == 20 && property.where.y == 8) {
                        //     console.log("Walked to 20, 8!")
                        //     console.log(request)
                        //     console.log(structuredClone(c))
                        // }
                        if (c != undefined) {
                            if (c.next != null || c.chained || property.chained || c.fromRequests.length > 0) {
                                continue;
                            }
                        }
                        let unit = undefined;
                        let health = 10;
                        for (let u of unitMap) {
                            if (u.x == infPos.x && u.y == infPos.y) {
                                unit = u;
                                health = u.health;
                            }
                        }
                        if (health == 1) continue;
                        let graph = this.getMoveCostGraph(BaseInfo.units[fakeUnit.id].move_type, false);
                        let pathing = new Dijkstra(graph, [fakeUnit], this.width, this.height).iterate(3 * 15);
                        let s = pos.x + pos.y * this.width;
                        let cost = pathing[s];
                        if (cost != -1 && cost != undefined) {
                            request.travelDays = Math.ceil(cost / 3);
                            request.createInfantry = false;
                            request.neutralBase = property.neutralBase;
                            request.reason = "Infantry";
                            request.chained = true;
                            request.health = health;
                            request.unit = unit;
                            all_requests.push(request)
                        }
                    }
                }
                for (let base of operatingBases) {
                    for (let pos of this.properties.keys()) {
                        let property = this.properties.get(pos);
                        if (d.capRequests.has(pos) && property.owner == country && !(d.startingBases.includes(property) || d.startingCities.includes(property))) {
                            let r = d.capRequests.get(pos);
                            let myDist = property.distances.get(base) ?? -1;
                            if (myDist == -1) {
                                continue;
                            }
                            if (r.when + r.getDayCost() >= day + myDist + 1 + (r.what.taxDays > 0 ? 1 : 0)) {
                                d.capRequests.delete(pos);
                            }
                        } else {
                            if (d.startingBases.includes(property) || d.startingCities.includes(property)) {
                                continue;
                            }
                            if (property.owner != country) {
                                continue;
                            }
                        }
                        let request = new CapRequest();
                        request.when = day;
                        request.from = base.where;
                        request.to = pos;
                        request.what = property;
                        request.travelDays = property.distances.get(base) ?? -1;
                        if (d.recentBaseCaps.includes(base.where)) {
                            request.createInfantry = false;
                        }
                        if (day == 1 && infantryPositions.includes(base.where)) {
                            request.createInfantry = false;
                        }
                        request.neutralBase = property.neutralBase;
                        if (request.travelDays == -1) {
                            continue;
                        }
                        request.reason = "Base";
                        all_requests.push(request)
                    }
                }
                for (let request of leftoverRequests) all_requests.push(request);
                // Skip Requests that have a faster request from elsewhere
                for (let request of all_requests) {
                    if (request.travelDays == -1) {
                        continue;
                    }
                    // Compare the distances from each other base you own.
                    // If it is faster to build from the other base even if you skip a day, do a different cap instead.
                    if (request.neutralBase) {
                        let skipMe = false;
                        for (let base of request.what.distances.keys()) {
                            if (skipMe) {
                                continue;
                            }
                            if (base.country != request.what.country) {
                                continue;
                            }
                            let theirDistance = request.what.distances.get(base);
                            let requester = this.bases.get(request.from);
                            let myDistance = request.what.distances.get(requester);
                            if (theirDistance != -1 && theirDistance + 1 < myDistance) {
                                skipMe = true;
                            }
                        }
                        if (skipMe) {
                            request.priority = -1;
                            continue;
                        }
                    }
                }
                // Sort all requests
                all_requests.sort(function(a, b) {
                    if (a.getDayCost() == -1) return 1;
                    if (b.getDayCost() == -1) return -1;

                    if (a.what.disabled && !b.what.disabled) return -1;
                    if (b.what.disabled && !a.what.disabled) return 1;

                    // Prioritize `neutralBase`
                    if (a.neutralBase && !b.neutralBase) return -1;
                    if (!a.neutralBase && b.neutralBase) return 1;

                    // If both have `neutralBase` (either both `true` or both `false`), sort by `priority` (descending)
                    if (a.priority !== b.priority) {
                        return b.priority - a.priority;
                    }

                    if (a.getDayCost() - b.getDayCost() == 0) {
                        if (a.what.originalOwner != "" && a.what.originalOwner != country) return -1;
                        if (b.what.originalOwner != "" && b.what.originalOwner != country) return 1;
                        if (!a.createInfantry && b.createInfantry) return -1;
                        if (a.createInfantry && !b.createInfantry) return 1;
                    }

                    // If `priority` is the same, sort by `dayCost` (ascending)
                    return a.getDayCost() - b.getDayCost();
                });
                let doneBases = [];
                let doneInfs = [];
                // Add Chain Requests from every recentCityCap that has been done.
                let requests = new Map(d.capRequests);
                for (let to of requests.keys()) {
                    let request = requests.get(to);
                    if (request.isCaptured(day) || request.neutralBase) {
                        continue;
                    }
                    let prop = request.what;
                    for (let cityPos of d.recentCityCaps.slice()) {
                        let city = d.capRequests.get(cityPos).what;
                        if (city == undefined) continue;
                        let r = d.capRequests.get(cityPos);
                        if (r == undefined || city.chained || prop.chained || city.chain != undefined || city.next != undefined ||
                            d.recentUsedCityCaps.includes(cityPos) || d.recentUsedCityCaps.includes(prop.where)) {
                            continue;
                        }
                        if (!r.isCaptured(Math.max(request.when, day))) {
                            continue;
                        }
                        if (d.recentUsedCityCaps.includes(city.where)) {
                            continue;
                        }
                        let chainRequest = new CapRequest();
                        chainRequest.when = city.captured + 1;
                        chainRequest.from = cityPos;
                        chainRequest.to = to;
                        chainRequest.what = request.what;
                        let fakeUnit = {
                            x: cityPos.x,
                            y: cityPos.y,
                            id: 1,
                            country: country
                        };
                        let graph = this.getMoveCostGraph(BaseInfo.units[fakeUnit.id].move_type, false);
                        // Search 4 days deep.
                        let pathing = new Dijkstra(graph, [fakeUnit], this.width, this.height).iterate(3 * 4);
                        let s = to.x + to.y * this.width;
                        let cost = pathing[s];
                        if (cost != -1 && cost != undefined) {
                            chainRequest.travelDays = Math.ceil(cost / 3);
                            chainRequest.createInfantry = false;

                            // Mark city as used as soon as the request is valid
                            if (chainRequest.travelDays < request.travelDays &&
                                request.when + request.getDayCost() >= chainRequest.when + chainRequest.getDayCost()) {

                                // Mark the city as used to prevent it from being reused
                                city.chained = true;
                                if (city.type != "Base") d.recentUsedCityCaps.push(cityPos);

                                d.leftoverRequests.push(request);

                                // Update the chain request
                                d.capRequests.set(to, chainRequest);
                                chainRequest.chained = true;
                                chainRequest.reason = "Chain";
                                city.chain = chainRequest;
                                city.next = prop;
                                city.fromRequests = [chainRequest];
                                request.what.next = null;
                                request.what.chain = null;
                                prop.capturer = chainRequest;

                                // Remove the city from recentCityCaps
                                let index = d.recentCityCaps.indexOf(cityPos);
                                if (index !== -1) {
                                    d.recentCityCaps.splice(index, 1);
                                }

                                redo.push(request.from);
                                let allCapRequests = [];
                                for (let r of d.capRequests.values()) allCapRequests.push(r);
                                allCapRequests.reverse();
                                for (let r of allCapRequests) {
                                    if (r.adjusted) break;
                                    if (r.when == chainRequest.when - 1 && r.from == request.from && r.reason == "Base") {
                                        r.when -= 1;
                                        r.adjusted = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                //Second pass for the bases that got replaced when a faster request was found
                for (let request of all_requests) {
                    if (request.travelDays == -1) {
                        continue;
                    }
                    if (request.priority < 0 || doneBases.includes(request.from) || doneInfs.includes(request.from) || d.capRequests.has(request.to)) {
                        continue;
                    }
                    let c = this.properties.get(request.from);
                    if (c != undefined && c.type != "Base") {
                        c.next = this.properties.get(request.to);
                        if (request.reason == "Infantry") {
                            c.chained = true;
                        }
                        let index = d.recentCityCaps.indexOf(c.where);
                        if (index !== -1) {
                            d.recentCityCaps.splice(index, 1);
                        }
                        if (c.type == "City" && c.fromRequests.length > 0) continue;
                        c.fromRequests.push(request);
                    }
                    d.capRequests.set(request.to, request);
                    if (request.createInfantry) {
                        doneBases.push(request.from);
                    } else {
                        doneInfs.push(request.from);
                    }
                }
                let totalCaps = d.startingBases.length + d.startingCities.length;
                for (let base of d.startingBases) {
                    if (base.flipped) totalCaps -= 1;
                }
                for (let prop of d.startingCities) {
                    if (prop.flipped) totalCaps -= 1;
                }
                let recentBaseCaps = 0;
                // Income Flips and Update Caps
                for (let request of d.capRequests.values()) {
                    if (request.isCaptured(day)) {
                        if (!d.properties.includes(request.what) && request.what.type == "City") {
                            let from = request.from;
                            let recentlyHealed = unitMap.find(x => {
                                return x.startingPos != undefined && x.startingPos.x == from.x && x.startingPos.y == from.y && x.health < 10;
                            });
                            // If the unit was moving someone and finished capturing.
                            // Change the position so that repairs can be done!
                            if (recentlyHealed != undefined) {
                                recentlyHealed.x = request.to.x;
                                recentlyHealed.y = request.to.y;
                            }
                            d.properties.push(request.what);
                            d.recentCityCaps.push(request.to);
                            request.what.captured = day;
                            request.what.capturer = request;
                        } else if (!d.properties.includes(request.what) && request.what.type == "Base") {
                            let from = request.from;
                            let recentlyHealed = unitMap.find(x => {
                                return x.startingPos != undefined && x.startingPos.x == from.x && x.startingPos.y == from.y
                            });
                            // If the unit was moving someone and finished capturing.
                            // Change the position so that repairs can be done!
                            if (recentlyHealed != undefined) {
                                recentlyHealed.x = request.to.x;
                                recentlyHealed.y = request.to.y;
                            }
                            d.properties.push(request.what);
                            if (!request.what.flipped) {
                                request.what.captured = day;
                                request.what.capturer = request;
                            }
                        }
                        totalCaps += 1;
                        for (let c of Object.keys(this.incomeDays)) {
                            let checked = false;
                            let firstDay = this.incomeDays[c][0];
                            if (firstDay.startingCities.includes(request.what)) {
                                if (checked) {
                                    continue;
                                }
                                let d = this.countries[0] == c ? day + 1 : day;
                                if (this.incomeFlips[c][d] == undefined) {
                                    this.incomeFlips[c][d] = 0;
                                    this.flipQueue[c][d] = 0;
                                }
                                this.incomeFlips[c][d] += 1;
                                this.flipQueue[c][d] += 1;
                                if (!request.what.flipped) {
                                    if (this.whereFlips[request.what.originalOwner][d] == undefined) {
                                        this.whereFlips[request.what.originalOwner][d] = [];
                                    }
                                    this.whereFlips[request.what.originalOwner][d].push(request.to);
                                    this.ftaInfo.Flips += 1;
                                }
                                request.what.flipped = true
                                checked = true;
                            }
                            if (firstDay.startingBases.includes(request.what) && !request.what.flipped) {
                                if (checked) {
                                    continue;
                                }
                                let d = this.countries[0] != c ? day : day + 1;
                                if (this.incomeFlips[c][d] == undefined) {
                                    this.incomeFlips[c][d] = 0;
                                    this.flipQueue[c][d] = 0;
                                }
                                this.incomeFlips[c][d] += 1;
                                this.flipQueue[c][d] += 1;
                                checked = true;
                            }
                        }
                        if (!d.bases.includes(request.what) && (request.neutralBase || request.what.disabled || request.asleep)) {
                            d.bases.push(request.what)
                            recentBaseCaps += 1;
                            d.recentBaseCaps.push(request.to);
                            request.what.asleep = false;
                            if (request.what.disabled) {
                                if (!request.what.flipped && request.what.originalOwner != "") {
                                    let d = this.countries[0] != request.what.originalOwner ? day : day + 1;
                                    if (this.whereFlips[request.what.originalOwner][d] == undefined) {
                                        this.whereFlips[request.what.originalOwner][d] = [];
                                    }
                                    this.whereFlips[request.what.originalOwner][d].push(request.to);
                                }
                                request.what.flipped = true
                            }
                        }
                    }
                }
                d.endingPropertyCount = Math.max(d.endingPropertyCount, totalCaps);
                let funds = d.startingFunds;
                let infantryBases = (d.startingBases.length + d.bases.length) - recentBaseCaps;
                for (let base of d.startingBases) {
                    if (base.disabled || base.ghosted || base.asleep || (base.owner != country) || base.flipped) infantryBases -= 1;
                }
                let tankBases = 0;
                // Buy a tank if you have a spare base.
                let order = this.countries.indexOf(country);
                while (funds >= 7000 + (infantryBases - 1) * 1000 && infantryBases > 0 && day >= this.tankDelay) {
                    tankBases += 1;
                    infantryBases -= 1;
                    funds -= 7000
                    d.totalUnitValue += 7000;
                    d.totalTanks += 1;
                    if (Object.keys(this.tankOrder).length < 4) {
                        this.tankOrder.push({
                            country: country,
                            day: day
                        });
                    }
                    if (this.extendedTankOrder.length < 16) {
                        this.extendedTankOrder.push(alphabet.slice(order, order + 1));
                        this.extendedTankOrderIndex.push(day);
                    }
                }
                d.endingFunds = funds - infantryBases * 1000;
                d.endingFunds = Math.max(0, d.endingFunds);
                d.totalUnitValue += infantryBases * 1000;
                d.totalInf += infantryBases;
                this.countryData[country][day] = {
                    startingFunds: d.startingFunds,
                    endingFunds: d.endingFunds,
                    startingIncome: d.getStartingIncome(this.income),
                    endingIncome: d.getEndingIncome(this.income),
                    generatedFunds: d.generatedFunds,
                    generatedTaxedFunds: d.generatedTaxedFunds,
                    totalUnitValue: d.totalUnitValue,
                    countryName: BaseInfo.countries[country].name,
                    totalInf: d.totalInf,
                    totalTanks: d.totalTanks,
                    totalOtherDeployed: d.totalOtherDeployed,
                    repairs: d.repairs,
                    totalBases: operatingBases.length,
                }
            }
        }
        for (let country of Object.keys(this.countryData)) {
            for (let day of Object.keys(this.countryData[country])) {
                if (this.incomeFlips[country][day] == undefined) {
                    this.incomeFlips[country][day] = 0;
                }
            }
        }
        for (let country of Object.keys(this.countryData)) {
            for (let day of Object.keys(this.countryData[country])) {
                let prevDay = day - 1;
                let prevIncomeFlips = this.incomeFlips[country][prevDay];
                if (prevIncomeFlips == undefined) {
                    continue;
                }
                if (this.incomeFlips[country][day] != prevIncomeFlips) {
                    this.countryData[country][day].incomeFlips = this.incomeFlips[country][day];
                }
            }
        }
        for (let country of Object.keys(this.countryData)) {
            for (let day of Object.keys(this.countryData[country])) {
                if (this.whereFlips[country][day] != undefined) {
                    this.countryData[country][day].flips = this.whereFlips[country][day];
                }
            }
        }
    }
}
class WeightedDirectedGraph {
    constructor(e, t, n) {
        this.data = e, this.width = t, this.height = n
    }
    get length() {
        return this.data.length
    }
    getWeight(e) {
        return this.data[e]
    }
    getXY(e, t) {
        return this.data[e + t * this.width]
    }
    getNeighbors(e, t) {
        if (!(e >= 0 && e < this.width && t >= 0 && t < this.height)) throw new Error(`Graph node {x: ${e}, y: ${t}} not in bounds ${this.width},${this.height}`);
        let n = [];
        return e - 1 >= 0 && n.push({
            x: e - 1,
            y: t
        }), t - 1 >= 0 && n.push({
            x: e,
            y: t - 1
        }), e + 1 < this.width && n.push({
            x: e + 1,
            y: t
        }), t + 1 < this.height && n.push({
            x: e,
            y: t + 1
        }), n
    }
}
class Dijkstra {
    constructor(e, t, n, i) {
        // Sets up width and height for the instance
        this.width = n;
        this.height = i;

        // Stores the graph in the instance
        this.graph = e;

        // Initializes an empty array to hold start positions
        this.start = [];

        // Creates a distance array with undefined values, length is width * height
        this.distance = new Array(n * i).fill(void 0);

        // Iterates over each element in t (units)
        t.forEach((e) => {
            // Adds each starting position as an object with x, y, and a distance of 0
            this.start.push({
                x: e.x,
                y: e.y,
                dist: 0
            });
        });
    }
    makeQueue() {
        return new TinyQueue([], ((e, t) => e.dist - t.dist))
    }
    iterate(e) {
        let t = this.makeQueue(),
            n = new Array(this.width * this.height).fill(!1);
        this.start.forEach((e => {
            t.push(e), n[e.x + e.y * this.width] = !0
        }));
        let i = 0,
            o = 1;
        for (; t.length > 0;) {
            let r = e * o,
                a = t;
            for (t = this.makeQueue(); a.length > 0;) {
                if (i++ > 2e6) return alert("@steve on discord, dijkstra got stuck.");
                let {
                    x: e,
                    y: o,
                    dist: s
                } = a.pop(), l = e + o * this.width;
                this.distance[l] = s;
                let d = this.graph.getNeighbors(e, o);
                for (let i of d) {
                    let s = i.x + i.y * this.width;
                    const d = this.graph.getWeight(s);
                    if (d >= 0) {
                        let u = this.distance[l] + d;
                        !n[s] && u > r ? t.push({
                            x: e,
                            y: o,
                            dist: r
                        }) : (void 0 === this.distance[s] || u < this.distance[s]) && (a.push({
                            x: i.x,
                            y: i.y,
                            dist: u
                        }), this.distance[s] = u, n[s] = !0)
                    } else this.distance[s] = -1, n[s] = !0
                }
            }
            o++
        }
        return this.distance
    }
}
class IncomeDay {
    previousDay = null;
    //Notes where the income checks should start.
    startingBases = [];
    startingCities = [];
    recentBaseCaps = [];
    recentCityCaps = [];
    recentUsedCityCaps = [];
    // Array of Property
    bases = [];
    // Array of Property
    properties = [];
    // [pos] = CapRequest
    capRequests = new Map();
    startingPropertyCount = 0;
    endingPropertyCount = 0;
    incomeFlips = 0;
    startingFunds = 0;
    endingFunds = 0;
    totalUnitValue = 0;
    generatedFunds = 0;
    generatedTaxedFunds = 0;
    totalInf = 0;
    totalTanks = 0;
    //repair.what [{{ repair.x }}, {{ repair.y }}] was repaired for {{ repair.health }} HP [{{ repair.cost }}G]!
    repairs = [];
    // Unit ID = Amount as int
    totalOtherDeployed = {};
    leftoverRequests = [];
    getStartingIncome(funds) {
        return funds * this.startingPropertyCount;
    }
    getEndingIncome(funds) {
        return funds * this.endingPropertyCount;
    }
}
class CapRequest {
    constructor() {
        this.id = window.RequestID + 1;
        window.RequestID += 1;
    }
    id = 0;
    when = 0;
    from = new Vector2i();
    to = new Vector2i();
    //Property
    what;
    adjusted = false;
    travelDays = 0;
    // If the cap request is a Neutral Base, it must be done first.
    neutralBase = false;
    // If an infantry doesn't have to be created, it will remove one extra day.
    createInfantry = true;
    priority = 0;
    contested = false;
    chained = false;
    reason = "";
    //Property;
    next = null;
    health = 10;
    // Used to check if there is a unit assigned to the request
    // So that it isn't counted for repairs.
    unit;
    isCapturing(day) {
        return day == this.when + this.travelDays + (this.createInfantry ? 1 : 0) + (Math.ceil(20 / this.health) - 2) + (this.what ? this.what.taxDays : 0);
    }
    isCaptured(day) {
        return day >= this.when + this.travelDays + (this.createInfantry ? 1 : 0) + (Math.ceil(20 / this.health) - 2) + (this.what ? this.what.taxDays : 0);
    }
    getDayCost() {
        return Math.max(1, this.travelDays + (this.createInfantry ? 1 : 0) + (Math.ceil(20 / this.health) - 2) + (this.what ? this.what.taxDays : 0))
    }
}
class Vector2i {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    x = 0;
    y = 0;
}
class ReconData {
    country = "";
    earliestSkipRecon = 0;
    earliestNormalRecon = 0;
    // Vector2i
    bases = [];
    // {
    // what: Property
    // cost: int
    // from: Vector2i
    // }
    allHits = [];
    // Cutoff in Days
    // Basically 8 recon tiles + 1 to attack
    getHits(day = 3, cutoff = 2) {
        let data = new Map();
        for (let base of this.bases) {
            let vector = new Vector2i(base.x, base.y);
            data.set(vector, this.getHitsFrom(base, day, cutoff));
        }

        return data;
    }
    getHitsFrom(from, day = 3, cutoff = 2) {
        if (from == undefined) return [];
        let naturalHits = [];
        let interruptHits = [];
        let hits = [naturalHits, interruptHits];
        for (let hit of this.allHits) {
            let base = hit.from;
            if (base != from) continue;

            let property = hit.what;
            if (property == undefined) continue;

            let distance = hit.cost;
            if (distance == -1) continue;

            // Do you care about hitting it before it was captured?
            if (hit.base.captured != -1 && day <= hit.base.captured) continue;
            if (distance <= cutoff * 8 + 1) {
                naturalHits.push({
                    where: property.where,
                    from: base,
                });
                if (property.captured == -1 || day + cutoff < property.captured) {
                    interruptHits.push({
                        where: property.where,
                        from: base,
                    });
                }
            }
        }

        return hits;
    }
    getHitCountFrom(from, day = 3, cutoff = 2) {
        let hitData = this.getHitsFrom(from, day, cutoff);
        return [hitData[0].length, hitData[1].length];
    }
}
class Property {
    owner = "";
    travelDays = 0;
    taxDays = 0;
    captured = -1;
    where = new Vector2i();
    //Base, City, Property
    type = "Base";
    // Base: int
    distances = new Map();
    // Country: int (Smallest Possible)
    unitDistances = {};
    // Base: int
    // Country: [] as Array
    //   base_location: Vector2i
    //   cost: int (Smallest Possible)
    reconDistances = new Map();
    // Is it an enemy base? Make sure to go for it first!
    enemy = false;
    // Is it a nuetral base? Ignore the until capped.
    neutralBase = false;
    // Capping an enemy base? Disable production from there.
    disabled = false;
    flipped = false;
    // If this property is part of a chain
    chained = false;
    //CapRequest
    chain;
    from = null;
    next;
    fromRequests = [];
    //Cap Request
    capturer = null;
    asleep = false;
    ghosted = false;
}
class IncomeReport {
    name = "Automated Report"
    customReport = false;
    // Array[Vector2i];
    bases = [];
    //who: country as String
       //where [x,y] as Vector2i
          //when: int
          //from: [x,y] as Vector2i
          //originalOwner: country as String
    // Example
    // country:os
    // [3,2]=8|oO:bm|cF:[1,1]
    // contested
    // [5,8]
    properties = {}
    //where [x,y] as Vector2i
       //owner: country as String ["" is contested]
    config = {}
    report = "";
    identifier = "!=====[data]=====!";
    toText() {
        let result = ""
        result += "name:" + this.name;
        result += "<br>";
        result += "map_name:" + window.incomeGrapher.mapName;
        result += "<br>";
        result += "map_id:" + window.incomeGrapher.mapID;
        result += "<br>";
        result += this.identifier;
        result += "<br>";
        let anyContested = false;
        for (let country of Object.keys(this.properties)) {
            for (let property of this.properties[country]) {
                if (property.contested) {
                    anyContested = true;
                    break;
                }
            }
        }
        if (anyContested) {
            result += "contested";
            result += "<br>";
            for (let country of Object.keys(this.properties)) {
                for (let property of this.properties[country]) {
                    if (!property.contested) continue;
                    let code = "";
                    code += `[${property.where.x},${property.where.y}]=`;
                    code += `-1`;
                    code += "<br>";
                    result += code;
                }
            }
        }
        for (let country of Object.keys(this.properties)) {
            result += country + "<br>"
            for (let property of this.properties[country]) {
                if (property.type == "Base") {
                    result += `base:[${property.where.x},${property.where.y}]`;
                    result += "<br>";
                }
            }
            for (let property of this.properties[country]) {
                if (property.contested) continue;
                let code = "";
                code += `[${property.where.x},${property.where.y}]=`;
                code += `${property.when}`;
                if (property.originalOwner != "" && property.originalOwner != property.owner) {
                    code += `|oO:${property.originalOwner}`;
                }
                if (property.from != undefined) {
                    code += `|from:[${property.from.x},${property.from.y}]`;
                }
                code += "<br>";
                result += code;
            }
        }
        return result
    }
    //who: country as String
       //where [x,y] as Vector2i
          //when: int
          //from: [x,y] as Vector2i
          //originalOwner: country as String
    fromText(text) {
        this.properties = {};
        this.bases = [];
        let t = text.replace(/<br\s*\/?>/gi, "\n");
        const lines = t.split('\n');
        const data = {
            name: "",
            map_name: "",
            map_id: "",
        };

        let inDataSection = false;
        let country = "";
        for (const line of lines) {
            // Skip data section identifier
            if (line.startsWith('!=====[')) {
                inDataSection = !inDataSection;
                continue;
            }

            if (!inDataSection) {
                // Metadata parsing
                if (line.startsWith('name:')) {
                    data.name = line.split(':')[1];
                } else if (line.startsWith('map_name:')) {
                    data.map_name = line.split(':')[1];
                } else if (line.startsWith('map_id:')) {
                    data.map_id = line.split(':')[1];
                }
            } else {
                if (!line.startsWith('base:') && !line.startsWith('[') && line.trim() !== '') {
                    // Parse country
                    country = line.trim();
                    if (!Object.keys(this.properties).includes(country)) {
                        this.properties[country] = [];
                    }
                }
                if (country == "") continue;
                // Data section parsing
                if (line.startsWith('base:')) {
                    // Parse base coordinates
                    const coords = line.match(/\[(-?\d+),(-?\d+)\]/);
                    if (coords) {
                        this.bases.push(new Vector2i(parseInt(coords[1]), parseInt(coords[2])));
                    }
                } else if (line.match(/^\[.*?\]=/)) {
                    // Parse city information
                    const positionMatch = line.match(/^\[(-?\d+),(-?\d+)\]/);
                    const detailsMatch = line.split('=');

                    if (positionMatch && detailsMatch.length > 1) {
                        const position = new Vector2i(parseInt(positionMatch[1]), parseInt(positionMatch[2]));
                        let detailData = this.parseDetails(detailsMatch[1]);
                        let fromMatch = (detailData.fromInfo != null ? detailData.fromInfo.split(",") : null)
                        let from = (fromMatch != null ? new Vector2i(parseInt(fromMatch[0]), parseInt(fromMatch[1])) : null)
                        let data = {
                            where: position,
                            when: parseInt(detailData.captureDay),
                            owner: country,
                            originalOwner: detailData.ownerInfo,
                            from: from,
                            type: this.isCity(position) ? "City" : "Base",
                            contested: country == "contested"
                        }
                        this.properties[country].push(data);
                    }
                }
            }
        }
        let clone = Object.assign({}, this.properties);
        let sortedKeys = Object.keys(this.properties);
        sortedKeys.sort((o1, o2) => {
            let o1Data = BaseInfo.countries[o1];
            let o2Data = BaseInfo.countries[o2];

            if (o1Data == undefined && o2Data != undefined) return 1;
            if (o1Data != undefined && o2Data == undefined) return -1;
            if (o1Data == undefined && o2Data == undefined) return 0;

            return o1Data.id - o2Data.id;
        });
        this.properties = {};
        for (let key of Object.keys(clone)) {
            this.properties[key] = clone[key];
        }
        let keys = [];
        for (let key of sortedKeys) {
            if (Object.keys(BaseInfo.countries).includes(key)) keys.push(key);
        }
        window.incomeGrapher.countries = keys;
        this.name = data.name;
    }
    parseDetails(detailString) {
        // Regular expression to match the capture day, owner info, and from info
        const captureDayMatch = detailString.match(/^([^|]+)/); // First part before '|'
        const ownerInfoMatch = detailString.match(/oO:([^|]+)/); // Match 'oO:'
        const fromInfoMatch = detailString.match(/from:\[([^\]]+)\]/); // Match 'from:'

        // Extracted values (default to null if not found)
        const captureDay = captureDayMatch ? captureDayMatch[1] : -1;
        const ownerInfo = ownerInfoMatch ? ownerInfoMatch[1] : "";
        const fromInfo = fromInfoMatch ? fromInfoMatch[1] : null;

        return { captureDay, ownerInfo, fromInfo };
    };
    isCity(where) {
        if (where == null) return false;
        for (let pos of this.bases) {
            if (pos.x == where.x && pos.y == where.y) {
                return false;
            }
        }
        return true;
    }
    setFont() {
        window.incomeGrapher.ctx.setLineDash([]);
        window.incomeGrapher.ctx.font = "10px monospace";
        window.incomeGrapher.ctx.textAlign = "center";
        window.incomeGrapher.ctx.strokeStyle = "black";
        window.incomeGrapher.ctx.lineWidth = 2;
        window.incomeGrapher.ctx.fillStyle = "white";

        window.incomeGrapher.ctxRecon.setLineDash([]);
        window.incomeGrapher.ctxRecon.font = "10px monospace";
        window.incomeGrapher.ctxRecon.textAlign = "center";
        window.incomeGrapher.ctxRecon.strokeStyle = "black";
        window.incomeGrapher.ctxRecon.lineWidth = 2;
        window.incomeGrapher.ctxRecon.fillStyle = "white";
    }
    drawText(e, t, n, recon) {
        let ctx = recon ? window.incomeGrapher.ctxRecon : window.incomeGrapher.ctx;
        ctx.strokeText(e, t, n);
        ctx.fillText(e, t, n);
    }
    //who: country as String
       //where [x,y] as Vector2i
          //when: int
          //from: [x,y] as Vector2i
          //originalOwner: country as String
    BaseInfo = null;
    async renderDrawings() {
        let ctx = window.incomeGrapher.ctx;
        let height = window.incomeGrapher.height;
        let width = window.incomeGrapher.width;
        ctx.clearRect(0, 0, 16 * width, 16 * height)

        for (let country of Object.keys(this.properties)) {
            if (country == "") continue;
            let color = country != "contested" ? this.BaseInfo.countries[country].color : "0, 0, 0";
            for (let property of this.properties[country]) {
                if (country == "contested") continue;
                let x = property.where.x;
                let y = property.where.y;
                let s = x + y * width;
                let from = property.from;
                if (from == null) continue;
                let when = property.when;
                if (s >= 0 && when != -1) {
                    ctx.setLineDash([]);
                    ctx.fillStyle = `rgba(${color}, 0.15)`
                    ctx.strokeStyle = `rgba(${color}, 0.7)`;
                    // Draw filled rectangle
                    ctx.fillRect(16 * x, 16 * y, 16, 16);

                    // Set line width and draw rectangle border
                    ctx.lineWidth = 1;
                    ctx.strokeRect(16 * x, 16 * y, 16, 16);

                    // If condition `n` is true, set font and draw text `s`
                    this.setFont();
                    //this.drawText(request.getDayCost() + request.when, 16 * a + 8, 16 * t + 12);

                    // Begin a Path
                    ctx.beginPath();
                    ctx.moveTo(16 * from.x + 8, 16 * from.y + 8);
                    ctx.lineTo(16 * x + 8, 16 * y + 8);
                    ctx.strokeStyle = `rgba(${color}, 1.0)`
                    ctx.setLineDash([4, 4]);

                    // Draw the Path
                    ctx.stroke();
                }
            }
        }
        for (let country of Object.keys(this.properties)) {
            if (country == "") continue;
            let color = country != "contested" ? this.BaseInfo.countries[country].color : "0, 0, 0";
            for (let property of this.properties[country]) {
                if (property.contested) continue;
                if (property.ghosted) continue;
                let x = property.where.x;
                let y = property.where.y;
                let s = x + y * width;
                let when = property.when;
                if (s >= 0 && when > 0) {
                    // Check condition based on `c`, and if true, draw an image
                    //ctx.drawImage(inf, 16 * x, 16 * y);
                    ctx.setLineDash([]);
                    ctx.strokeStyle = "black";
                    this.drawText(`${when}`, 16 * x + 8, 16 * y + 12);
                }
            }
            for (let property of this.properties[country]) {
                if (property.contested) continue;
                if (!(property.ghosted || property.taxDays > 0)) continue;
                let x = property.where.x;
                let y = property.where.y;
                let s = x + y * width;
                let when = property.when;
                if (s >= 0 && when > 0) {
                    // Check condition based on `c`, and if true, draw an image
                    //ctx.drawImage(inf, 16 * x, 16 * y);
                    ctx.setLineDash([]);
                    ctx.strokeStyle = "black";
                    let done = false;
                    for (let c of Object.keys(window.incomeGrapher.predeployed)) {
                        let inf = await loadImage(`terrain/aw1/${c}infantry.gif`);
                        if (done) break;
                        for (let unit of window.incomeGrapher.predeployed[c]) {
                            if (unit.country == property.owner) continue;
                            let where = new Vector2i();
                            where.x = unit.startingPos ? unit.startingPos.x : unit.x;
                            where.y = unit.startingPos ? unit.startingPos.y : unit.y;

                            if (property.where.x == where.x && property.where.y == where.y) {
                                ctx.drawImage(inf, 16 * where.x, 16 * where.y);
                                done = true;
                                break;
                            }
                        }
                    }
                    if (property.ghosted) this.drawText(`${when}G`, 16 * x + 8, 16 * y + 12);
                    else if (property.taxDays > 0) this.drawText(`${when}T`, 16 * x + 8, 16 * y + 12);
                    else this.drawText(`${when}`, 16 * x + 8, 16 * y + 12);
                }
            }
        }

        let icon = new Image();
        icon.src = `terrain/moveplanner.gif`;
        for (let country of Object.keys(this.properties)) {
            for (let property of this.properties[country]) {
                if (!property.contested || property.when == 0) continue;
                let x = property.where.x;
                let y = property.where.y;
                let s = x + y * this.width;
                ctx.drawImage(icon, 16 * x + 1, 16 * y + 1, 14, 14);
            }
        }
    }
    async renderReconData(day = 3, cutoff = 2) {
        let ctx = window.incomeGrapher.ctxRecon;
        let height = window.incomeGrapher.height;
        let width = window.incomeGrapher.width;
        let data = window.incomeGrapher.reconData;
        ctx.clearRect(0, 0, 16 * width, 16 * height);

        ctx.fillStyle = `rgba(${"0, 0, 0"}, 0.45)`;
        ctx.fillRect(0, 0, 16 * width, 16 * height);

        for (let country of Object.keys(data)) {
            let reconData = data[country];
            let color = country != "contested" ? this.BaseInfo.countries[country].color : "0, 0, 0";

            // base: Property
            //     naturalHits
            //         where: Vector2i,
            //         from: base,
            //     interrupts
            //         where: Vector2i,
            //         from: base,
            let allHits = reconData.getHits(day, cutoff);

            for (let base of allHits.keys()) {
                ctx.setLineDash([]);
                ctx.fillStyle = `rgba(${color}, 0.15)`
                ctx.strokeStyle = `rgba(${color}, 0.7)`;
                // Draw filled rectangle
                ctx.fillRect(16 * base.x, 16 * base.y, 16, 16);

                // Set line width and draw rectangle border
                ctx.lineWidth = 1;
                ctx.strokeRect(16 * base.x, 16 * base.y, 16, 16);

                for (let naturalHit of allHits.get(base)[0]) {
                    let where = naturalHit.where;
                    let skip = false;

                    for (let interruptHit of allHits.get(base)[1]) {
                        if (interruptHit.where.x == where.x && interruptHit.where.y == where.y) {
                            skip = true;
                            break;
                        }
                    }

                    let s = where.x + where.y * width;
                    if (s < 0 || skip) continue;

                    // Begin a Path
                    ctx.beginPath();
                    ctx.lineWidth = 3;
                    ctx.moveTo(16 * base.x + 8, 16 * base.y + 8);
                    ctx.lineTo(16 * where.x + 8, 16 * where.y + 8);
                    ctx.strokeStyle = `rgba(${color}, .65)`
                    ctx.setLineDash([]);
                    //ctx.setLineDash([8, 12]);

                    // Draw the Path
                    ctx.stroke();

                    let recon = await loadImage(`terrain/aw1/${country}recon.gif`);
                    ctx.drawImage(recon, 16 * where.x, 16 * where.y);

                    // If condition `n` is true, set font and draw text `s`
                    this.setFont();
                    this.drawText("Slow!", 16 * where.x + 8, 16 * where.y - 4, true);

                }
                for (let interruptHit of allHits.get(base)[1]) {
                    let where = interruptHit.where;

                    let s = where.x + where.y * width;
                    if (s < 0) continue;

                    // Begin a Path
                    ctx.beginPath();
                    ctx.lineWidth = 3;
                    ctx.moveTo(16 * base.x + 8, 16 * base.y + 8);
                    ctx.lineTo(16 * where.x + 8, 16 * where.y + 8);
                    ctx.strokeStyle = `rgba(${color}, .65)`
                    ctx.setLineDash([]);
                    //ctx.setLineDash([8, 12]);

                    // Draw the Path
                    ctx.stroke();

                    let recon = await loadImage(`terrain/aw1/${country}recon.gif`);
                    ctx.drawImage(recon, 16 * where.x, 16 * where.y);

                    // If condition `n` is true, set font and draw text `s`
                    this.setFont();
                    this.drawText("Hit!", 16 * where.x + 8, 16 * where.y + 12 - 16, true);

                }
            }
        }
    }
    clearReconData() {
        let height = window.incomeGrapher.height;
        let width = window.incomeGrapher.width;
        window.incomeGrapher.ctxRecon.clearRect(0, 0, 16 * width, 16 * height);
    }
    countryData = {};
    incomeFlips = {};
    flipQueue = {};
    whereFlips = {};
    generateData() {
        window.incomeGrapher.tankOrder = [];
        window.incomeGrapher.extendedTankOrder = [];
        window.incomeGrapher.extendedTankOrderIndex = [];

        let countries = Object.keys(this.properties);
        let sortedCountries = [];
        for (let c of countries) if (c != "contested") sortedCountries.push(c);
        sortedCountries.sort((o1, o2) => Object.keys(BaseInfo.countries).indexOf(o1) - Object.keys(BaseInfo.countries).indexOf(o2));
        for (let country of sortedCountries) {
            if (country == "contested") continue;
            this.incomeFlips[country] = {};
            this.flipQueue[country] = {};
            this.whereFlips[country] = {};
            this.countryData[country] = {};
        }

        let day = 0;
        for (let country of sortedCountries) {
            if (country == "contested") continue;
            let mine = [];
            for (let prop of this.properties[country]) {
                if (prop.when < day) mine.push(prop);
            }
            let funds = mine.length * window.incomeGrapher.income;
            let infs = 0;
            for (let data of window.incomeGrapher.units) {
                if (data.id != 1) {
                    continue;
                }
                let c = data.country;
                if (c == country) infs += 1;
            }
            this.countryData[country][day] = {
                previousDay: null,
                startingFunds: 0,
                endingFunds: 0,
                startingIncome: funds,
                endingIncome: funds,
                generatedFunds: 0,
                generatedTaxedFunds: 0,
                totalUnitValue: infs * 1000,
                countryName: BaseInfo.countries[country].name,
                totalInf: infs,
                totalTanks: 0,
                flips: [],
                repairs: {},
            }
        }

        while (day < 15) {
            day += 1;
            for (let country of sortedCountries) {
                let first = sortedCountries[0] == country;
                let d = {};
                let pd = null;
                if (this.countryData[country][day - 1] != undefined) {
                    pd = this.countryData[country][day - 1];
                    d.previousDay = pd;
                    d.startingIncome = pd.endingIncome - (this.whereFlips[country][day] ? this.whereFlips[country][day].length : 0);
                    // d.startingIncome = d.startingIncome - (pd.flips ? pd.flips.length : 0);
                    d.startingFunds = pd.endingFunds + d.startingIncome;
                    d.generatedFunds = d.startingIncome + pd.generatedFunds;
                    d.generatedTaxedFunds = d.startingIncome + pd.generatedTaxedFunds;
                    d.totalUnitValue = pd.totalUnitValue;
                    d.totalInf = pd.totalInf;
                    d.totalTanks = pd.totalTanks;
                    d.totalOtherDeployed = pd.totalOtherDeployed;
                    d.countryName = pd.countryName;
                    d.flips = [];
                    d.repairs = {};
                }
                let mine = [];
                for (let prop of this.properties[country]) {
                    if (prop.when <= day) mine.push(prop);
                }
                for (let otherCountry of Object.keys(this.properties)) {
                    if (otherCountry == country) continue;
                    for (let prop of this.properties[otherCountry]) {
                        if (first) {
                            if (prop.when >= day && prop.originalOwner == country) {
                                mine.push(prop);
                                if (day == 1) {
                                    d.startingIncome += window.incomeGrapher.income;
                                    d.startingFunds += window.incomeGrapher.income;
                                    d.generatedFunds += window.incomeGrapher.income;
                                    d.generatedTaxedFunds += window.incomeGrapher.income;
                                }
                            } else if (prop.when + 1 == day && prop.originalOwner == country) {
                                if (this.whereFlips[country][day] == undefined) this.whereFlips[country][day] = [];
                                this.whereFlips[country][day].push(prop.where)
                                d.flips.push(prop.where);
                                d.startingIncome -= window.incomeGrapher.income;
                                d.startingFunds -= window.incomeGrapher.income;
                                d.generatedFunds -= window.incomeGrapher.income;
                                d.generatedTaxedFunds -= window.incomeGrapher.income;
                            }
                        } else {
                            if (prop.when > day && prop.originalOwner == country) {
                                mine.push(prop);
                                if (day == 1) {
                                    d.startingIncome += window.incomeGrapher.income;
                                    d.startingFunds += window.incomeGrapher.income;
                                    d.generatedFunds += window.incomeGrapher.income;
                                    d.generatedTaxedFunds += window.incomeGrapher.income;
                                }
                            } else if (prop.when == day && prop.originalOwner == country) {
                                d.flips.push(prop.where);
                                d.startingIncome -= window.incomeGrapher.income;
                                d.startingFunds -= window.incomeGrapher.income;
                                d.generatedFunds -= window.incomeGrapher.income;
                                d.generatedTaxedFunds -= window.incomeGrapher.income;
                            }
                        }
                    }
                }
                let ownedCount = mine.length;
                d.endingIncome = ownedCount * window.incomeGrapher.income;

                let bases = [];
                for (let prop of this.properties[country]) {
                    if (prop.when < day && !this.isCity(prop.where)) bases.push(prop);
                }

                let funds = d.startingFunds;
                let infantryBases = bases.length;
                let tankBases = 0;
                let order = sortedCountries.indexOf(country);
                while (funds >= 7000 + (infantryBases - 1) * 1000 && infantryBases > 0) {
                    tankBases += 1;
                    infantryBases -= 1;
                    funds -= 7000
                    d.totalUnitValue += 7000;
                    d.totalTanks += 1;
                    if (window.incomeGrapher.tankOrder.length < 4) {
                        window.incomeGrapher.tankOrder.push({
                            country: country,
                            day: day
                        });
                    }
                    if (window.incomeGrapher.extendedTankOrder.length < 16) {
                        window.incomeGrapher.extendedTankOrder.push(alphabet.slice(order, order + 1));
                        window.incomeGrapher.extendedTankOrderIndex.push(day);
                    }
                }

                d.endingFunds = funds - infantryBases * 1000;
                d.endingFunds = Math.max(0, d.endingFunds);
                d.totalUnitValue += infantryBases * 1000;
                d.totalInf += infantryBases;

                this.countryData[country][day] = d;
            }
        }
        window.incomeGrapher.countryData = this.countryData;
        window.incomeGrapher.countries = sortedCountries;
        window.incomeGrapher.incomeFlips = this.incomeFlips;
        window.incomeGrapher.flipQueue = this.flipQueue;
        window.incomeGrapher.whereFlips = this.whereFlips;
    }
}
function initPrevmaps() {
    Vue.component("PrevIncomeGrapher", {
        template: `
        <div id='replay-misc-controls'>
            <div ref='openBtn' class='flex v-center' style='padding: 0px 5px; cursor: pointer; user-select: none;' @click='open = !open'>
                <img src='terrain/ani/neutralcity.gif'><b>Estimate</b>
            </div>
            <div v-show='open && chartMode'
                :style="{ top: position.y + 'px',
                          right: -position.x + 'px',
                          zIndex: '1000',
                          width: '480px',
                          position: 'absolute' }">
                <div
                    class='bordertitle flex'
                    style='color: #fff; background: #06c; border: 1px black solid; padding: 4px; justify-content: space-between; cursor: grab;'
                    draggable="true"
                    @dragstart="onDragStart"
                    @dragend="onDragEnd">
                    <div style="font-weight: bold; display: block; float: left;">
                        Income Charts
                    </div>
                    <div @click='manualMode = false, reconMode = true, chartMode = false' style="font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; background: #004d99; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        Recon Info
                    </div>
                    <div @click='manualMode = true, reconMode = false, chartMode = false' style="font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; background: #004d99; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        Manual Mode
                    </div>
                    <div @click='manualMode = false, reconMode = false, chartMode = false' style="font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; margin-right: 16px; background: #7ebeff; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        View Charts
                    </div>
                    <div style="cursor: pointer" @click="() => { open = false; manualMode = false }">
                        <img width='16' src="terrain/close.png"/>
                    </div>
                </div>
                <div id='income-grapher-visualizer' v-show='graphOpen'>
                    <div style='width: 480px; height:480px; border: 1px solid black; background: #eeeeee'>
                        <canvas id="income-graph"></canvas>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <button style="color: #fff; background: #06c; border: 1px black solid; padding: 4px; justify-content: space-between;" @click='generateFundsChart()'>Chart by Income</button>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <button style="color: #fff; background: #06c; border: 1px black solid; padding: 4px; justify-content: space-between;" @click='generateTotalTaxedFundsChart()'>Chart by Generated Funds (With Repair Tax)</button>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <button style="color: #fff; background: #06c; border: 1px black solid; padding: 4px; justify-content: space-between;" @click='generateTotalFundsChart()'>Chart by Generated Funds (Without Repair Tax)</button>
                    </div>
                </div>
            </div>
            <div v-show='open && reconMode'
                :style="{ top: position.y + 'px',
                          right: -position.x + 'px',
                          zIndex: '1000',
                          width: '480px',
                          position: 'absolute' }">
                <div class='bordertitle flex' style='color: #fff; background: #06c; border: 1px black solid; padding: 4px; justify-content: space-between; cursor: grab;'
                    draggable="true"
                    @dragstart="onDragStart"
                    @dragend="onDragEnd">
                    <div style="font-weight: bold; display: block; float: left;">
                        Recon Info
                    </div>
                    <div @click='manualMode = false, reconMode = false, chartMode = false' style="font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; background: #7ebeff; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        Recon Info
                    </div>
                    <div @click='manualMode = true, reconMode = false, chartMode = false' style="font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; background: #004d99; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        Manual Mode
                    </div>
                    <div @click='manualMode = false, reconMode = false, chartMode = true' style="font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; margin-right: 16px; background: #004d99; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        View Charts
                    </div>
                    <div style="cursor: pointer" @click="() => { open = false; manualMode = false }">
                        <img width='16' src="terrain/close.png"/>
                    </div>
                </div>
                <div style="background: #eeeeee; padding-top: 4px; border: solid 2px black">
                    <h4 style="margin-bottom: 10px;">Early Recon Build Notes</h4>
                    <div style="display: flex; flex-direction: column; text-align: center; font-weight: bold; font-size: 12px;">
                        <label style="margin-bottom: 2px; padding-bottom: 0px">Additional Notes on the First Skip/No-Skip Recon Builds.</label>
                        <label style="margin-bottom: 2px; padding-bottom: 0px">Indicates what properties they might reach from each base.</label>
                        <label style="margin-bottom: 2px; padding-bottom: 0px">The Calculator does not adjust funding and income based on these results!</label>
                        <label style="margin-bottom: 10px">Most Info will be similar unless there are neutral bases activating later!</label>
                    </div>
                    <div style="display: flex; flex-direction: column; text-align: center; font-weight: bold; font-size: 12px; border: 1px black solid">
                        <div style="display: flex; flex-direction: column; background: #0066cc; border-bottom: 1px solid black">
                            <label style="font-weight: bold; color: #ffffff; font-size: 12px;">Search From Day:
                              <input v-model.number="reconDay" type="number" max="6" min="1" style="width:96px" />
                            </label>
                            <label style="font-weight: bold; color: #ffffff; font-size: 11px; font-style: italic; margin-bottom: 2px">The Earlier The Recon, The More Properties They Can Interrupt!</label>
                            <label style="font-weight: bold; color: #ffffff; font-size: 12px;">Search X Days Deep For Recon Moves:
                              <input v-model.number="reconSearch" type="number" max="6" min="1" style="width:96px" />
                            </label>
                            <div v-show='showRecon' @click='clearReconData()' style="font-weight: bold; padding: 8px; background: #ff972b; border: 2px solid black">
                                Hide Recon Info
                            </div>
                            <div v-show='!showRecon' @click='showReconData()' style="font-weight: bold; padding: 8px; background: #7ebeff;">
                                Show Recon Info
                            </div>
                        </div>
                        <div style="width: 100%; border-bottom: 1px black solid;">
                            <div
                              v-for="(reconData, countryCode) in recons"
                              :key="countryCode"
                              :style="{
                                display: 'flex',
                                alignItems: 'center',
                                borderTop: '1px black solid',
                                paddingRight: '8px',
                                paddingLeft: '8px',
                                paddingBottom: '8px',
                                paddingTop: '8px',
                                background: getCountryColorWithAlpha(BaseInfo.countries[countryCode]?.color, 0.5) || '#eeeeee'
                              }"
                            >
                                <div style="display: flex; flex-direction: row; width: 100%">
                                    <!-- General Information -->
                                    <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 160px">
                                        <div style="display: flex; flex-direction: row; align-items: center">
                                            <img :src="'terrain/ani/' + countryCode + 'recon.gif'" alt="Tank Image" style="width: 24px; height: 24px;">
                                            <img
                                              :src="'terrain/aw1/' + countryCode + 'logo.gif'"
                                              style="width: 24px; height: 24px; margin-right: 5px;"
                                            >
                                            <!-- Country Name -->
                                            <strong style="font-size: 14px">{{ BaseInfo.countries[countryCode]?.name ?? 'No Data' }}</strong>
                                        </div>
                                        <div style="display: flex; flex-direction: column; align-items: center; width: 100%; background: #eee; padding: 2px; border: 1px solid black">
                                          <label style="flex-grow: 1; font-size: 14px;">Earliest Recon</label>
                                          <br>
                                          <label style="flex-grow: 1; font-size: 12px; font-style: italic;">With Base-Skips</label>
                                          <br>
                                          <strong style="font-size: 18px">{{ "Day #" + (reconData.earliestSkipRecon ?? '???') }}</strong>
                                        </div>
                                        <div style="display: flex; flex-direction: column; align-items: center; width: 100%; background: #eee; padding: 2px; border: 1px solid black">
                                          <label style="flex-grow: 1; font-size: 14px;">Earliest Recon</label>
                                          <br>
                                          <label style="flex-grow: 1; font-size: 12px; font-style: italic;">No Base-Skips</label>
                                          <br>
                                          <strong style="font-size: 18px">{{ "Day #" + (reconData.earliestNormalRecon ?? '???') }}</strong>
                                        </div>
                                    </div>
                                    <div style="border-left: 1px solid; margin-left: 8px; margin-right: 8px; width: 2px;">
                                    </div>
                                    <!-- Base Information -->
                                    <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; background: #eeeeee; border: 1px black solid;">
                                        <div v-for="(base, index) in reconData.bases" :key="index" style="padding-top: 4px; padding-bottom: 4px">
                                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0px;">
                                                <div style="display: flex; flex-direction: row; align-items: center; gap: 4px;">
                                                    <img
                                                      :src="'terrain/ani/' + getImageName(reconData.country) + 'base.gif'"
                                                      style="width: 16px; height: 16px; object-fit: cover; margin-right: 5px; object-position: bottom;"
                                                    >
                                                    <label>[{{ base.x }}, {{ base.y }}] can reach </label>
                                                    <label>{{ reconData.getHitCountFrom(base, reconDay, reconSearch)[0] }} enemy/cont. properties!</label>
                                                </div>
                                                <div style="display: flex; flex-direction: row; align-items: center; gap: 4px;">
                                                    <img
                                                      :src="'terrain/ani/' + reconData.country + 'recon.gif'"
                                                      style="width: 16px; height: 16px; object-fit: cover; margin-right: 5px; object-position: bottom;"
                                                    >
                                                    <label>{{ reconData.getHitCountFrom(base, reconDay, reconSearch)[1] }} are interruptable! </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show='open && manualMode'
                :style="{ top: position.y + 'px',
                          right: -position.x + 'px',
                          zIndex: '1000',
                          width: '480px',
                          position: 'absolute' }">
                <div class='bordertitle flex' style='color: #fff; background: #06c; border: 1px black solid; padding: 4px; justify-content: space-between; cursor: grab;'
                    draggable="true"
                    @dragstart="onDragStart"
                    @dragend="onDragEnd">
                    <div style="font-weight: bold; display: block; float: left;">
                        Manual Mode
                    </div>
                    <div @click='manualMode = false, reconMode = true, chartMode = false' style="font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; background: #004d99; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        Recon Info
                    </div>
                    <div @click='manualMode = false, reconMode = false, chartMode = false' style="font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; background: #7ebeff; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        Manual Mode
                    </div>
                    <div @click='manualMode = false, reconMode = false, chartMode = true' style="font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; margin-right: 16px; background: #004d99; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        View Charts
                    </div>
                    <div style="cursor: pointer" @click="() => { open = false; manualMode = false }">
                        <img width='16' src="terrain/close.png"/>
                    </div>
                </div>
                <div class='manual-mode-intro' style="background: #7ebeff; border: 1px black solid; padding: 4px; color: #000000; font-size: 12px">
                    <div style="display: flex; flex-direction: column; max-width: 288px; align-items: left; justify-content: left; margin: 0 auto;">
                        <label style='text-align: center; padding-bottom: 8px'><strong>Welcome To Manual Mode!</strong></label>
                        <label style='text-align: left; padding-bottom: 4px'>Here you can edit the calculator to specify specific builds or dictate who owns which properties.</label>
                        <label style='text-align: left; padding-bottom: 2px'>At the bottom of this panel, you can see the report as it's being built.</label>
                        <label style='text-align: left; padding-bottom: 2px'>You can save the report, customize it and even import it later!</label>
                        <label style='text-align: left; padding-bottom: 16px'>The Automated Calculator will also generate a report here.</label>
                        <label style='text-align: left; padding-bottom: 2px'>I recommend generating a report with the Automated Calculator to get used to the syntax.</label>
                        <label style='text-align: left; padding-bottom: 2px'><strong>Using the automated calculator will RESET the report!</strong></label>
                        <label style='text-align: left; padding-bottom: 2px'><strong>COPY And SAVE The Report before using it!</strong></label>
                    </div>
                </div>
                <div class="property-config-controls" style="background: #ffffff; border: 1px black solid; padding: 4px;">
                    <label><strong>Property Configurator</strong></label>
                    <div class="property-config" style="background: #eeeeee; gap: 8px">
                        <div style="display: flex; flex-direction: column">
                            <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 8px">
                                <div style="display: flex; flex-direction: row; align-items: center; margin-left: 4px; gap: 8px;">
                                    <img width='32' src="terrain/ani/neutralcity.gif"/>
                                    <strong>Property</strong>
                                </div>
                                <strong style="margin-left: auto; margin-right: 24px">Position: {{
                                        currentReport?.config?.where
                                            ? '[' + currentReport.config.where.x + ', ' + currentReport.config.where.y + ']'
                                            : '???'
                                    }}
                                </strong>
                            </div>
                            <!-- Owner -->
                            <label style="text-align: left; margin-left: 4px; margin-right: 32px;">
                              <strong>Owner: </strong>
                              <input
                                  type="text"
                                  :value="currentReport?.config?.what?.owner === 'none' ? 'None' : currentReport.config.what.owner"
                                  @input="updateOwner($event.target.value)"
                              />
                            </label>

                            <!-- Day Captured -->
                            <label style="text-align: left; margin-left: 4px; margin-right: 32px;">
                              <strong>Day Captured: </strong>
                              <input
                                  type="text"
                                  :value="currentReport?.config?.what?.when !== -1
                                      ? currentReport.config.what.when
                                      : (currentReport?.config?.what?.owner !== ''
                                          ? 'Already Captured'
                                          : 'Never')"
                                  @input="updateDayCaptured($event.target.value)"
                              />
                            </label>

                            <!-- Captured From -->
                            <label style="text-align: left; margin-left: 4px; margin-right: 32px;">
                              <strong>Captured From: </strong>
                              <input
                                  type="text"
                                  :value="currentReport?.config?.what?.from
                                    ? '[' + currentReport.config.what.from.x + ',' + currentReport.config.what.from.y + ']'
                                    : ''"
                                  @input="updateCapturedFrom($event.target.value)"
                              />
                            </label>
                            <label style="text-align: left; margin-left: 4px; margin-right: 32px"><strong>Chained Capture: </strong>
                                {{
                                    currentReport?.isCity(currentReport?.config?.what?.from)
                                        ? 'True'
                                        : 'False'
                                }}
                            </label>
                            <label style="text-align: left; margin-left: 4px; margin-right: 32px"><strong>Original Owner: </strong>
                                {{
                                    currentReport?.config?.what?.originalOwner != "" && currentReport?.config?.what?.originalOwner != currentReport?.config?.what?.owner
                                        ? BaseInfo.countries[currentReport.config.what.originalOwner].name
                                        : 'None'
                                }}
                            </label>
                        </div>
                    </div>
                </div>
                <div style="background: #ffffff; border: 1px black solid; padding: 4px;">
                    <label style="text-align: center"><strong>Controls</strong></label>
                    <div class="report-controls" style="text-align: left;">
                        <div style="background: #eeeeee; padding: 4px;">
                            <label><strong>Click a Property: </strong> Configure Property</label>
                        </div>
                        <div style="background: #eeeeee; padding: 4px; padding-top: 0px">
                            <label style="font-size: 10px">Opens the Config Panel for the Property.</label>
                        </div>
                        <div style="background: #eeeeee; padding: 4px;">
                            <label><strong>Shift-Click a Property: </strong> Link A Capture</label>
                        </div>
                        <div style="background: #eeeeee; padding: 4px; padding-top: 0px">
                            <label style="font-size: 10px">Select a Property, then the next Property To Capture.</label>
                            <br>
                            <label style="font-size: 10px">Linked From Base: Adds +1 Day to Build Infantry.</label>
                            <br>
                            <label style="font-size: 10px">Linked From City: Ignore Infantry Build Day.</label>
                            <br>
                            <label style="font-size: 10px">Auto-Calculates Travel and Capture Day</label>
                        </div>
                        <div style="background: #eeeeee; padding: 4px;">
                            <label><strong>Ctrl-Click a Property: </strong> Mark Contested</label>
                        </div>
                        <div style="background: #eeeeee; padding: 4px; padding-top: 0px">
                            <label style="font-size: 10px">Toggle a Property as Contested.</label>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: row; margin-top: 8px; align-items: center; justify-content: center; color: #ffffff; gap:16px; font-size: 12px">
                        <div v-show='linkingNextPress' @click='cancelNextPress()' style="font-weight: bold; padding: 8px; background: #ff972b; border: 2px solid black">
                            Link Capture (Manual)
                        </div>
                        <div v-show='!linkingNextPress' @click='linkNextPress()' style="font-weight: bold; padding: 8px; background: #7ebeff;">
                            Link Capture (Manual)
                        </div>
                        <div v-show='markingNextPress' @click='cancelNextPress()' style="font-weight: bold; padding: 8px; background: #ff972b; border: 2px solid black">
                            Mark Contested (Manual)
                        </div>
                        <div v-show='!markingNextPress' @click='markNextPress()' style="font-weight: bold; padding: 8px; background: #7ebeff;">
                            Mark Contested (Manual)
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: row; margin-top: 8px; align-items: center; justify-content: center; color: #ffffff; gap:16px; font-size: 12px">
                        <div @click='clearCityOwnership()' style="font-weight: bold; padding: 8px; background: #7ebeff;">
                            Clear City Ownership
                        </div>
                    </div>
                </div>
                <div class="income-report" style="background: #ffffff; border: 1px black solid; padding: 4px; display: flex; flex-direction: column;">
                    <div @click='recalculateReport(), manualMode = false' style="color: #ffffff; font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; margin-right: 16px; margin-top: 8px; margin-bottom: 8px; background: #004d99; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        Recalculate Manual Report
                    </div>
                    <div @click='importReport()' style="color: #ffffff; font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; margin-right: 16px; margin-top: 8px; margin-bottom: 8px; background: #004d99; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        Import and Redraw
                    </div>
                    <label><strong>Income Report</strong></label>
                    <div
                        style="text-align: left; margin-left: 12px; margin-right: 32px; border: 1px black solid; padding: 4px"
                        contenteditable="true"
                        v-html="currentReport?.report || 'Paste or Generate a Report First!'"
                        @input="updateReport($event)"
                    >
                    </div>
                </div>
            </div>
            <div v-show='open && !manualMode && !chartMode && !reconMode'
                :style="{ top: position.y + 'px',
                          right: -position.x + 'px',
                          zIndex: '1000',
                          width: '480px',
                          position: 'absolute' }">
                <div class='bordertitle flex' style='color: #fff; background: #06c; border: 1px black solid; padding: 4px; justify-content: space-between; cursor: grab;'
                    draggable="true"
                    @dragstart="onDragStart"
                    @dragend="onDragEnd">
                    <div style="font-weight: bold; display: block; float: left;">
                        Income Grapher   -   [Beta V5.4]
                    </div>
                    <div @click='manualMode = false, reconMode = true, chartMode = false' style="font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; background: #004d99; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        Recon Info
                    </div>
                    <div @click='manualMode = true, reconMode = false, chartMode = false' style="font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; background: #004d99; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        Manual Mode
                    </div>
                    <div @click='manualMode = false, reconMode = false, chartMode = true' style="font-weight: bold; display: block; float: right; padding-left: 4px; padding-right: 4px; margin-left: 16px; margin-right: 16px; background: #004d99; border-left: 1px #0044aa solid; border-right: 1px #0044aa solid;">
                        View Charts
                    </div>
                    <div style="cursor: pointer" @click="open = false">
                        <img width='16' src="terrain/close.png"/>
                    </div>
                </div>
                <div style='background: #fff; border: 1px black solid; padding-top: 4px'>
                    <div>
                        <label>Day #:
                          <input v-model.number="viewDay" type="number" max="15" min="1" style="width:80px" />
                        </label>
                        <label>Delay Tanks Until Day #:
                          <input v-model.number="tankDelay" type="number" max="15" min="0" style="width:80px" />
                        </label>
                        <select v-model='income'> <option v-for='opt in incomeModeOptions' :value='opt'>{{opt}}</option>\n</select>
                    </div>
                    <hr>
                    <div v-show="!showFta" style="background: #7ebeff; color: #000000;">
                        <label style="text-align: center; font-size: 24px">Currently Viewing a Manual Report</label>
                        <br>
                        <label style="text-align: center; font-size: 20px">{{getReportName()}}</label>
                    </div>
                    <div style="width: 100%; border-bottom: 1px black solid;">
                      <div
                        v-for="(countryData, countryCode) in countries"
                        :key="countryCode"
                        :style="{
                          display: 'flex',
                          alignItems: 'center',
                          borderTop: '1px black solid',
                          paddingRight: '4px',
                          background: getCountryColorWithAlpha(BaseInfo.countries[countryCode]?.color, 0.5) || '#eeeeee'
                        }"
                      >
                        <!-- Logo, Infantry Icons, and Funds/Unit Value Section in a Column Layout -->
                        <div style="display: flex; flex-direction: column; align-items: center; padding: 4px;">
                          <!-- Country Name and Logo Display -->
                          <div style="flex-shrink: 0; margin-right: 10px; text-align: center; padding: 4px; display: flex; align-items: center;">
                            <!-- Country Logo -->
                            <img
                              :src="'terrain/aw1/' + countryCode + 'logo.gif'"
                              style="width: 24px; height: 24px; margin-right: 5px;"
                            >
                            <!-- Country Name -->
                            <strong>{{ countryData[viewDay]?.countryName ?? 'No Data' }}</strong>
                          </div>
                          <!-- Funds and Unit Value Section -->
                          <div style="margin-top: 8px; background: #fff; border: 1px black solid; padding: 4px;">
                            <!-- Generated Funds -->
                            <div style="display: flex; align-items: center; justify-content: space-between; background: #eee; width: 100%; margin-bottom: 5px;">
                              <label style="font-size: 12px; margin-right: 10px;">Generated Funds:</label>
                              <strong>{{ countryData[viewDay]?.generatedFunds ?? '???' }}</strong>
                              <img src="terrain/coin.gif" style="width: 18px; margin-left: 5px;">
                            </div>
                            <!-- Total Unit Value -->
                            <div style="display: flex; align-items: center; justify-content: space-between; background: #eee; width: 100%;">
                              <label style="font-size: 12px; margin-right: 10px;">Total Unit Value:</label>
                              <strong>{{ countryData[viewDay]?.totalUnitValue ?? '???' }}</strong>
                              <img src="terrain/coin.gif" style="width: 18px; margin-left: 5px;">
                            </div>
                          </div>
                          <!-- Unit Number Display -->
                          <div style="margin-top: 8px; background: #fff; border: 1px black solid; padding: 4px; display: flex; justify-content: space-between; align-items: center;">
                              <!-- Total Infantry -->
                              <div style="display: flex; align-items: center; background: #eee; padding: 4px;">
                                  <img :src="'terrain/ani/' + countryCode + 'infantry.gif'" style="width: 18px; margin-right: 5px;">
                                  <label style="font-size: 12px; margin-right: 5px;">x</label>
                                  <strong>{{ countryData[viewDay]?.totalInf ?? '0' }}</strong>
                              </div>

                              <!-- Total Tanks -->
                              <div style="display: flex; align-items: center; background: #eee; padding: 4px;">
                                  <img :src="'terrain/ani/' + countryCode + 'tank.gif'" style="width: 18px; margin-right: 5px;">
                                  <label style="font-size: 12px; margin-right: 5px;">x</label>
                                  <strong>{{ countryData[viewDay]?.totalTanks ?? '0' }}</strong>
                              </div>
                          </div>
                          <!-- Other Unit Number Display -->
                          <div v-if="countryData[viewDay]?.totalOtherDeployed != undefined && Object.keys(countryData[viewDay]?.totalOtherDeployed).length > 0">
                              <div style="margin-top: 8px; background: #fff; border: 1px black solid; padding: 4px; display: flex; justify-content: space-between; align-items: center;">
                                  <div v-for="(count, unitName) in countryData[viewDay].totalOtherDeployed" :key="unitName">
                                      <div style="display: flex; align-items: center; background: #eee; padding: 4px;">
                                          <img :src="'terrain/ani/' + countryCode + unitName.toLowerCase() + '.gif'" style="width: 18px; margin-right: 5px;">
                                          <label style="font-size: 12px; margin-right: 5px;">x</label>
                                          <strong>{{ count ?? '0' }}</strong>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <!-- Properties Display -->
                          <div style="margin-top: 8px; background: #fff; border: 1px black solid; padding: 4px; padding-top: 0px; display: flex; justify-content: space-between; align-items: center;">
                              <!-- Total Bases -->
                              <div style="display: flex; align-items: center; background: #eee; padding: 4px;">
                                  <img :src="'terrain/ani/' + getImageName(countryCode) + 'base.gif'" style="width: 18px; margin-right: 5px;">
                                  <label style="font-size: 12px; margin-right: 5px;">x</label>
                                  <strong>{{ countryData[viewDay]?.totalBases ?? '0' }}</strong>
                              </div>
                          </div>
                        </div>
                        <!-- Labels and Coins -->
                        <div style="display: flex; flex-direction: column; justify-content: center; flex-grow: 1; text-align: left; background: #fff; border: 1px black solid; padding: 4px;">
                          <div style="display: flex; align-items: center; margin-bottom: 5px; width: 100%; background: #eee; padding: 2px;">
                              <label style="flex-grow: 1; font-size: 12px; margin-right: 20px;">Repairs (Start):</label>
                              <strong>
                                  {{ (countryData[viewDay]?.repairs && countryData[viewDay].repairs.length > 0)
                                      ? countryData[viewDay].repairs.reduce((total, repair) => total + (repair.cost || 0), 0)
                                      : 'None' }}
                              </strong>
                              <img src="terrain/coin.gif" style="width: 18px; margin-left: 5px;">
                          </div>
                          <div style="display: flex; align-items: center; margin-bottom: 5px; width: 100%; background: #eee; padding: 2px;">
                            <label style="flex-grow: 1; font-size: 12px; margin-right: 20px;">Funds (Start):</label>
                            <span style="margin-right: 4px" v-if="countryData[viewDay]?.repairs?.length >= 1">
                              <label>
                                [{{ countryData[viewDay]?.startingFunds
                                    ? countryData[viewDay].startingFunds +
                                      (countryData[viewDay]?.repairs?.reduce((total, repair) => total + (repair.cost || 0), 0) || 0)
                                    : '???' }}]
                              </label>
                            </span>
                            <span :style="{ color: countryData[viewDay]?.repairs?.length >= 1 ? 'red' : 'black', fontWeight: 'bold' }">
                              {{ countryData[viewDay]?.startingFunds
                                  ? countryData[viewDay].startingFunds
                                  : '???' }}
                            </span>
                            <img src="terrain/coin.gif" style="width: 18px; margin-left: 5px;">
                          </div>
                          <div style="display: flex; align-items: center; margin-bottom: 5px; width: 100%; background: #eee; padding: 2px;">
                            <label style="flex-grow: 1; font-size: 12px; margin-right: 20px;">Funds (End):</label>
                            <strong>{{ countryData[viewDay]?.endingFunds ?? '???' }}</strong>
                            <img src="terrain/coin.gif" style="width: 18px; margin-left: 5px;">
                          </div>
                          <div style="display: flex; align-items: center; margin-bottom: 5px; width: 100%; background: #eee; padding: 2px;">
                            <label style="flex-grow: 1; font-size: 12px; margin-right: 20px;">Income (Start):</label>
                            <strong
                              :style="{ color: countryData[viewDay]?.incomeFlips >= 1 || countryData[viewDay]?.flips.length >= 1 ? 'red' : 'black' }">
                              {{ countryData[viewDay]?.startingIncome ?? '???' }}
                            </strong>
                            <img src="terrain/capt.gif" style="width: 18px; margin-left: 5px;">
                          </div>
                          <div style="display: flex; align-items: center; width: 100%; background: #eee; padding: 2px;">
                            <label style="flex-grow: 1; font-size: 12px; margin-right: 20px;">Income (End):</label>
                            <strong>{{ countryData[viewDay]?.endingIncome ?? '???' }}</strong>
                            <img src="terrain/capt.gif" style="width: 18px; margin-left: 5px;">
                          </div>
                          <!-- Flip Information Section -->
                          <div v-if="countryData[viewDay]?.flips != undefined && countryData[viewDay]?.flips.length > 0" style="margin-top: 10px; background: #eeeeee;">
                              <strong>Flips Detected:</strong>
                              <ul style="padding-left: 20px; margin-top: 5px;">
                                  <li v-for="(flip, index) in countryData[viewDay]?.flips" :key="index">
                                      [{{ flip.x }}, {{ flip.y }}] was flipped!
                                  </li>
                              </ul>
                          </div>
                          <!-- Repair Information Section -->
                          <div v-if="countryData[viewDay]?.repairs != undefined && countryData[viewDay]?.repairs.length > 0" style="margin-top: 10px; background: #eeeeee;">
                            <strong>Repairs Detected:</strong>
                            <ul style="padding-left: 20px; margin-top: 5px;">
                              <li v-for="(repair, index) in countryData[viewDay]?.repairs" :key="index">
                                [{{ repair.x }}, {{ repair.y }}] was repaired from {{ repair.newHealth - repair.health }} -> {{ repair.newHealth }}HP [{{ repair.cost }}G]!
                                <!-- Image added here -->
                                <img :src="'terrain/ani/' + countryCode + repair.sprite + '.gif'" style="width: 18px; margin-left: 5px;" />
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr>
                    <!-- Label for the tank order list -->
                    <div style="background: #eeeeee; padding: 4px;">
                        <h4 style="margin-bottom: 4px;">Estimated Tank Order</h4>
                        <div v-for="(tank, index) in tanks" :key="index" style="display: flex; justify-content: center; align-items: center; margin-bottom: 5px; font-weight: bold;">
                          <!-- Display the day -->
                          <span style="margin-right: 8px;">Day: {{ tank.day }}</span>

                          <!-- Display the tank image based on the country code -->
                          <img :src="'terrain/ani/' + tank.country + 'tank.gif'" alt="Tank Image" style="width: 24px; height: 24px;">
                        </div>
                    </div>
                    <div style="background: #eeeeee; padding: 4px;">
                      <h4 style="margin-bottom: 4px;">Extended Tank Order</h4>
                      <div v-for="(chunk, rowIndex) in chunkedTanks" :key="rowIndex" style="display: flex; justify-content: center; align-items: center; margin-bottom: 5px; font-weight: bold;">
                        <span v-for="(tankKey, colIndex) in chunk" :key="colIndex" style="margin-right: 8px;">
                          <span style="font-size: 10px; display: inline;">{{ extendedTankIndex[rowIndex * 4 + colIndex] }}</span>{{ tankKey }}
                        </span>
                      </div>
                    </div>
                    <div v-show="showFta" style="background: #eeeeee; padding: 4px;">
                        <hr>
                        <h4 style="margin-bottom: 10px;">FTA Information</h4>
                        <div style="display:flex; flex-direction: column; align-items: center; width: 100%; gap: 4px;">
                            <div>
                                <span>{{ ftaInfo.Day1 ?? '0' }} within 1 Day(s) reach.</span>
                            </div>
                            <div>
                                <span>{{ ftaInfo.Day2 ?? '0' }} within 2 Day(s) reach.</span>
                            </div>
                            <div>
                                <span>{{ ftaInfo.Day3 ?? '0' }} within 3 Day(s) reach.</span>
                            </div>
                            <div v-if="ftaInfo.Flips > 0">
                                <span>{{ ftaInfo.Flips ?? '0' }} properties were flipped!</span>
                            </div>
                            <div v-if="ftaInfo.Neutrals > 0">
                                <span>{{ ftaInfo.Neutrals ?? '0' }} neutral bases to be captured.</span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div style="background: #eeeeee; padding: 4px;">
                        <h4 style="margin-bottom: 10px;">Calculator Notes Appear Here</h4>
                        <div style="text-align: center; font-weight: bold; font-size: 12px;">
                          <div v-if="noteFlip">
                            Income Flips Detected!<br>
                            <span style="color: red; font-weight: bold;">(they will be marked in red)</span>
                            <br>
                            <span>on the day that it affects the other player.</span>
                          </div>
                          <div v-if="noteTransport">
                            <span style="color: red;">Transport Units Detected!</span><br>
                            <span>The calculator does not support builds with transport units!</span>
                            <br>
                            <span>They will be ignored, but the build order could be different.</span>
                          </div>
                          <div v-if="!noteFlip && !noteTransport">
                              No Income Flips or Transport Units Detected!
                              <br>
                              Calculator should operate normally! :3
                          </div>
                        </div>
                    </div>
                    <hr>
                    <div style="display: flex; flex-direction: column; gap: 4px; width:100%;">
                        <div style='padding-bottom: 2px; width: 100%;'>
                           <button style="color: #fff; background: #06c; border: 1px black solid; padding: 4px; justify-content: space-between;" @click='recalculate()'>Calculate All Days</button>
                        </div>
                        <div style='padding-bottom: 2px; width: 100%;'>
                           <button style="color: #fff; background: #06c; border: 1px black solid; padding: 4px; justify-content: space-between;" @click='clear()'>Clear Drawings</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
        props: {
            countries: Object,
            tanks: Array,
            recons: Object,
            extendedTanks: Array,
            extendedTanksIndex: Array,
            days: Number,
            noteFlip: {
                type: Boolean,
                default: false
            },
            noteTransport: {
                type: Boolean,
                default: false
            },
            ftaInfo: Object,
            highFunds: {
                type: Boolean,
                default: false
            },
            currentReport: Object,
        },
        data: function() {
            return {
                loaded: !1,
                open: !1,
                manualMode: !1,
                chartMode: !1,
                reconMode: !1,
                graphOpen: !0,
                drawing: !1,
                dirty: !0,
                active: !0,
                viewDay: 1,
                tankDelay: 0,
                reconDay: 3,
                reconSearch: 2,
                markingNextPress: !1,
                linkingNextPress: !1,
                showRecon: !1,
                showFta: !0,
                income: "Normal (1k/Day)",
                incomeModeOptions: ["Low Funds (500/Day)", "Normal (1k/Day)", "Medium Funds (1.5k/Day)", "High Funds (2k/Day)"],
                position: { x: 200, y: 100 },
                offset: { x: 0, y: 0 },
            }
        },
        created() {
            this.currentReport.ctx = window.incomeGrapher.ctx;
            this.currentReport.BaseInfo = BaseInfo;
            this.extendedTanks = [];
            this.extendedTankIndex = [];

            this.BaseInfo = BaseInfo;
            let e = sessionStorage.incomeGrapherSettings;
            e && (e = JSON.parse(e), this.mode = e);
            window.gameMap.addEventListener("click", (e) => {
                // Check if the event listener should proceed
                if (!this.open) return; // Exit if the map is not in an 'open' state.

                // Extract properties by calling a helper function
                let data = (function(e) {
                    // Get the map's bounding rectangle
                    let t = window.gameMap.getBoundingClientRect();

                    // Calculate the x and y coordinates on the map based on click position
                    let n = Math.floor((e.clientX - t.left) / (16 * scale)); // X-coordinate
                    let i = Math.floor((e.clientY - t.top) / (16 * scale)); // Y-coordinate

                    // Check for modifier keys
                    let cM = e.shiftKey; // Shift key pressed for chainMode
                    let mC = e.ctrlKey; // Alt key pressed for cycleOwnership

                    // Clamp the x and y values to the map's boundaries
                    n = Math.max(0, Math.min(window.mapWidth - 1, n));
                    i = Math.max(0, Math.min(window.mapHeight - 1, i));

                    // Return the calculated data
                    return {
                        x: n,
                        y: i,
                        chainMode: cM,
                        markContested: mC,
                    };
                })(e);
                if (this.manualMode) {
                    if (!data.chainMode) data.chainMode = this.linkingNextPress;
                    if (!data.markContested) data.markContested = this.markingNextPress;
                    this.onClickProperty(data);
                }
            });
            this.saveSettings = _.debounce((() => {
                sessionStorage.incomeGrapherSettings = JSON.stringify(this.mode)
            }), 1500), this.$nextTick((() => this.loaded = !0))
            if (highFunds) {
                this.income = "High Funds (2k/Day)";
            }
            window.incomeGrapher.income = this.getFunds();
            window.incomeGrapher.properties = new Map();
            window.incomeGrapher.bases = new Map();
            window.incomeGrapher.propertyMap = {};
            window.incomeGrapher.assignProperties();
        },
        computed: {
            chunkedTanks() {
                const chunkSize = 4; // 4 letters per row
                const chunks = [];
                for (let i = 0; i < this.extendedTanks.length; i += chunkSize) {
                    chunks.push(this.extendedTanks.slice(i, i + chunkSize));
                }
                return chunks;
            },
            unitNames() {
                return Object.values(this.BaseInfo.units).map((e => e.name.toLowerCase().replace(" ", "")))
            },
            predeployedUnits() {
                return Array.from(window.gameMap.querySelectorAll("span > img")).filter((e => {
                    const t = e.src;
                    for (const e of this.unitNames)
                        if (t.includes(e + ".gif")) return !0;
                    return !1
                }))
            }
        },
        mounted() {
            // console.log('Component mounted');
            // console.log('Initial currentReport:', this.currentReport);
        },
        watch: {
            open(e) {
                e ? (this.predeployedUnits.forEach((e => e.style.display = "none")), window.gameMap.style.cursor = "pointer") : (this.predeployedUnits.forEach((e => e.style.display = "")), window.gameMap.style.cursor = "default")
            },
            mode: {
                handler() {
                    this.dirty = !0, this.loaded && this.saveSettings()
                },
                deep: !0
            },
            reconDay(newVal, oldVal) {
                if (this.showRecon) this.showReconData(); // Call showReconData() when reconSearch changes
            },
            reconSearch(newVal, oldVal) {
                if (this.showRecon) this.showReconData(); // Call showReconData() when reconSearch changes
            },
        },
        methods: {
            getImageName(country) {
                return BaseInfo.countries[country].name.toLowerCase().replace(/ /g, "");
            },
            onDragStart(event) {
                // Record the initial mouse position relative to the element
                this.offset.x = event.clientX - this.position.x;
                this.offset.y = event.clientY - this.position.y;
            },
            onDragEnd(event) {
                // Update the position of the element based on the drag
                this.position.x = event.clientX - this.offset.x;
                this.position.y = event.clientY - this.offset.y;
                this.position.x = Math.max(-600, this.position.x);
                this.position.y = Math.max(0, this.position.y);
            },
            getReportName() {
                return this.currentReport.name;
            },
            getCountryColorWithAlpha(rgbColor, alpha) {
                if (!rgbColor || !/^(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})$/.test(rgbColor)) {
                    return null; // Return null if invalid RGB format
                }

                // Add alpha to the RGB color
                return `rgba(${rgbColor}, ${alpha})`;
            },
            linkNextPress() {
                this.linkingNextPress = true;
                this.markingNextPress = false;
            },
            markNextPress() {
                this.markingNextPress = true;
                this.linkingNextPress = false;
            },
            cancelNextPress() {
                this.linkingNextPress = false;
                this.markingNextPress = false;
            },
            clearCityOwnership() {
                let clone = Object.assign({}, this.currentReport.properties);
                let n = {};
                n.contested = [];
                for (let country of Object.keys(clone)) {
                    for (let prop of Object.values(clone[country])) {
                        if (this.currentReport.isCity(prop)) {
                            prop.owner = "";
                            prop.when = 0;
                            n.contested.push(prop);
                        } else {
                            if (!n[country]) n[country] = [];
                            n[country].push(prop);
                        }
                        prop.when = 0;
                    }
                }
                this.currentReport.properties = n;
                this.currentReport.renderDrawings();
                this.currentReport.report = this.currentReport.toText();
            },
            updateReport(event) {
                const element = event.target;

                // Save the current cursor position
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const preCursorRange = range.cloneRange();
                preCursorRange.selectNodeContents(element);
                preCursorRange.setEnd(range.startContainer, range.startOffset);
                const cursorPosition = preCursorRange.toString().length;

                // Update the report content
                let text = element.innerHTML.replace(/\n/g, '<br>'); // Process newlines
                this.currentReport.report = text;

                // Restore the cursor position
                this.$nextTick(() => {
                    const newRange = document.createRange();
                    const childNodes = element.childNodes;
                    let charCount = 0;

                    for (let node of childNodes) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            if (charCount + node.length >= cursorPosition) {
                                newRange.setStart(node, cursorPosition - charCount);
                                newRange.setEnd(node, cursorPosition - charCount);
                                break;
                            }
                            charCount += node.length;
                        } else {
                            charCount += node.textContent.length;
                        }
                    }

                    selection.removeAllRanges();
                    selection.addRange(newRange);
                });
            },
            importReport() {
                let report = this.currentReport;
                report.fromText(this.currentReport.report);
                report.renderDrawings();
                this.showFta = false;
            },
            recalculateReport() {
                let report = this.currentReport;
                report.generateData();
                this.showFta = false;

                this.afterManualGeneration();
            },
            onClickProperty(data) {
                if (data.chainMode) {
                    let to = new Vector2i();
                    to.x = data.x;
                    to.y = data.y;

                    let chainTo = undefined;
                    for (let country of Object.keys(this.currentReport.properties)) {
                        for (let prop of Object.values(this.currentReport.properties[country])) {
                            if (prop.where.x == to.x && prop.where.y == to.y) {
                                chainTo = prop;
                                break;
                            }
                        }
                    }

                    if (chainTo == undefined) return;
                    if (!this.currentReport.isCity(chainTo.where) && chainTo.owner != "contested") return;

                    let chainFrom = this.currentReport.config.what;
                    if (!chainFrom) return;

                    let cityChain = this.currentReport.isCity(chainFrom.where);

                    let fakeUnit = {
                        x: chainFrom.where.x,
                        y: chainFrom.where.y,
                        id: 1,
                        country: "os"
                    };

                    let graph = window.incomeGrapher.getMoveCostGraph(BaseInfo.units[fakeUnit.id].move_type, false);
                    // Search 15 days deep.
                    let pathing = new Dijkstra(graph, [fakeUnit], window.incomeGrapher.width, window.incomeGrapher.height).iterate(3 * 15);
                    let s = to.x + to.y * window.incomeGrapher.width;
                    let cost = pathing[s];
                    if (cost != -1 && cost != undefined) {
                        let travelTime = Math.ceil(cost / 3);
                        let buildDelay = cityChain ? 0 : 1;
                        let totalTravel = travelTime + buildDelay;

                        let start = chainFrom.when;
                        if (start <= 0) start = 0;

                        let capture = start + totalTravel + 1;
                        chainTo.when = capture;
                        chainTo.from = chainFrom.where;
                        chainTo.contested = false;

                        let previousOwner = chainTo.owner;
                        let newOwner = chainFrom.owner;
                        chainTo.owner = chainFrom.owner;
                        if (newOwner != previousOwner) {
                            let props = this.currentReport.properties[previousOwner]
                            if (props != undefined) {
                                let index = props.indexOf(chainTo);
                                if (index != 1) props.splice(index, 1);

                                let newPlace = this.currentReport.properties[newOwner];
                                if (newPlace == undefined) this.currentReport.properties[newOwner] = [];
                                if (!this.currentReport.properties[newOwner].includes(chainTo)) {
                                    this.currentReport.properties[newOwner].push(chainTo);
                                }

                                if (props.length <= 0) {
                                    delete this.currentReport.properties[previousOwner];
                                }
                            }
                            let contested = this.currentReport.properties.contested
                            if (contested != undefined) {
                                let index = contested.indexOf(chainTo);
                                if (index != 1) contested.splice(index, 1);

                                let newPlace = this.currentReport.properties[newOwner];
                                if (newPlace == undefined) this.currentReport.properties[newOwner] = [];
                                if (!this.currentReport.properties[newOwner].includes(chainTo)) {
                                    this.currentReport.properties[newOwner].push(chainTo);
                                }

                                if (contested.length <= 0) {
                                    delete this.currentReport.properties[previousOwner];
                                }
                            }
                        }
                        this.currentReport.config.where = chainTo.where;
                        this.currentReport.config.what = chainTo;
                        this.currentReport.renderDrawings();
                        this.currentReport.report = this.currentReport.toText();
                    }
                } else if (data.markContested) {
                    let where = new Vector2i();
                    where.x = data.x;
                    where.y = data.y;
                    let what = undefined;
                    for (let country of Object.keys(this.currentReport.properties)) {
                        for (let prop of Object.values(this.currentReport.properties[country])) {
                            if (prop.where.x == where.x && prop.where.y == where.y) {
                                what = prop;
                                break;
                            }
                        }
                    }
                    if (what == undefined) return;
                    what.owner = "none";
                    what.contested = !what.contested;
                    what.captured = -1;
                    what.from = null;
                    this.currentReport.renderDrawings();
                    this.currentReport.report = this.currentReport.toText();
                } else {
                    let where = new Vector2i();
                    where.x = data.x;
                    where.y = data.y;
                    let what = undefined;
                    for (let country of Object.keys(this.currentReport.properties)) {
                        for (let prop of Object.values(this.currentReport.properties[country])) {
                            if (prop.where.x == where.x && prop.where.y == where.y) {
                                what = prop;
                                break;
                            }
                        }
                    }
                    if (what == undefined) return;
                    let config = {
                        where: where,
                        what: what,
                    };
                    this.currentReport.config = config;
                }
            },
            updateOwner(value) {
                let valid = this.currentReport && this.currentReport.config && this.currentReport.config.what;
                if (!valid) return;

                let what = this.currentReport.config.what;
                if (Object.keys(BaseInfo.countries).includes(value)) {
                    let previousOwner = what.owner;
                    what.owner = value;
                    if (value != previousOwner) {
                        let props = this.currentReport.properties[previousOwner]
                        if (props != undefined) {
                            let index = props.indexOf(what);
                            if (index != 1) props.splice(index, 1);

                            let newPlace = this.currentReport.properties[value];
                            if (newPlace == undefined) this.currentReport.properties[value] = [];
                            if (!this.currentReport.properties[value].includes(what)) {
                                this.currentReport.properties[value].push(what);
                            }

                            if (props.length <= 0) {
                                delete this.currentReport.properties[previousOwner];
                            }
                        }
                        let contested = this.currentReport.properties.contested
                        if (contested != undefined) {
                            let index = contested.indexOf(what);
                            if (index != 1) contested.splice(index, 1);

                            let newPlace = this.currentReport.properties[value];
                            if (newPlace == undefined) this.currentReport.properties[value] = [];
                            if (!this.currentReport.properties[value].includes(what)) {
                                this.currentReport.properties[value].push(what);
                            }

                            if (contested.length <= 0) {
                                delete this.currentReport.properties[previousOwner];
                            }
                        }
                    }
                    what.contested = false;
                } else {
                    what.contested = value.toLowerCase() == "none"
                }
                this.currentReport.renderDrawings();
                this.currentReport.report = this.currentReport.toText();
            },
            updateDayCaptured(value) {
                let valid = this.currentReport && this.currentReport.config && this.currentReport.config.what;
                if (!valid) return;

                let v = parseInt(value);
                if (isNaN(v)) return;
                if (v <= 0) v = -1;

                this.currentReport.config.what.when = v;
                this.currentReport.renderDrawings();
                this.currentReport.report = this.currentReport.toText();
            },
            updateCapturedFrom(value) {
                let valid = this.currentReport && this.currentReport.config && this.currentReport.config.what;
                if (!valid) return;
                if (value == "") return;

                const match = value.match(/^\[(-?\d+),\s*(-?\d+)\]$/);
                if (match) {
                    let where = new Vector2i(parseInt(match[1], 10), parseInt(match[2], 10))
                    this.currentReport.config.what.from = where;
                } else {
                    this.currentReport.config.what.from = null;
                    //console.error("Invalid format for Captured From. Expected [x, y]");
                }
                this.currentReport.renderDrawings();
                this.currentReport.report = this.currentReport.toText();
            },
            setUnit(e, t) {
                window.incomeGrapher.units[e + t * window.incomeGrapher.width] ? window.incomeGrapher.deleteUnit(e, t) : window.incomeGrapher.setUnit(e, t, this.selectedUnit, this.selectedCountry), this.updateUnits()
            },
            deleteAllUnits() {
                window.incomeGrapher.deleteAllUnits(), this.updateUnits()
            },
            updateUnits() {
                window.gameMap.querySelectorAll('[data-analyzer="unit"]').forEach((e => {
                    e.remove()
                }));
                let e = window.incomeGrapher.units;
                for (const t in e) {
                    if (!e[t]) continue;
                    let {
                        x: n,
                        y: i,
                        id: o,
                        country: r
                    } = e[t], a = this.BaseInfo.units[o].name.toLowerCase().replace(" ", ""), s = document.createElement("img");
                    s.src = `terrain/aw1/${r}${a}.gif`, s.style.position = "absolute", s.style.left = 16 * n + "px", s.style.top = 16 * i + "px", s.style.zIndex = "120", s.dataset.analyzer = "unit", window.gameMap.append(s)
                }
            },
            selectUnit(e) {
                this.selectedUnit = e
            },
            selectCountry(e) {
                this.selectedCountry = e
            },
            async render(e) {
                let t = this.active;
                if (t) {
                    if (window.incomeGrapher.dirty || this.dirty) {
                        this.dirty = !1;
                        try {
                            this.mode[t];
                            "unitFlow" === t ? await window.incomeGrapher.drawFlow(this.mode[t]) : "capRoute" === t && window.incomeGrapher.clear()
                        } catch (e) {
                            return console.log(e), cancelAnimationFrame(this.drawing), this.drawing = !1, window.incomeGrapher.clear(), void alert("map analyzer broke")
                        }
                    }
                    this.drawing = requestAnimationFrame(this.render)
                }
            },
            toggleRendering(e) {
                cancelAnimationFrame(this.drawing), e === this.active ? (this.drawing = !1, this.active = "", window.incomeGrapher.clear()) : (this.dirty = !0, this.active = e, this.drawing = requestAnimationFrame(this.render))
            },
            swapSide() {
                window.incomeGrapher.swapSide()
            },
            getFunds() {
                if (this.income == "Low Funds (500/Day)") return 500;
                if (this.income == "Medium Funds (1.5k/Day)") return 1500;
                if (this.income == "High Funds (2k/Day)") return 2000;
                return 1000;
            },
            afterManualGeneration() {
                for (let country of Object.keys(window.incomeGrapher.countryData)) {
                    for (let day of Object.keys(window.incomeGrapher.countryData[country])) {
                        if (window.incomeGrapher.countryData[country][day].flips > 0) {
                            this.noteFlip = true;
                        }
                    }
                }

                this.countries = window.incomeGrapher.countryData;
                this.tanks = window.incomeGrapher.tankOrder;
                this.extendedTanks = window.incomeGrapher.extendedTankOrder;
                this.extendedTankIndex = window.incomeGrapher.extendedTankOrderIndex;
            },
            recalculate() {
                window.incomeGrapher.income = this.getFunds();
                window.incomeGrapher.tankDelay = this.tankDelay;
                window.incomeGrapher.recalculate()

                for (let country of Object.keys(window.incomeGrapher.countryData)) {
                    for (let day of Object.keys(window.incomeGrapher.countryData[country])) {
                        if (window.incomeGrapher.incomeFlips[country][day] > 0) {
                            this.noteFlip = true;
                        }
                    }
                }

                this.countries = window.incomeGrapher.countryData;
                this.tanks = window.incomeGrapher.tankOrder;
                this.extendedTanks = window.incomeGrapher.extendedTankOrder;
                this.extendedTankIndex = window.incomeGrapher.extendedTankOrderIndex;
                this.ftaInfo = window.incomeGrapher.ftaInfo;
                this.ftaInfo.Day1 = this.ftaInfo.Day1 / 2;
                this.ftaInfo.Day2 = this.ftaInfo.Day2 / 2;
                this.ftaInfo.Day3 = this.ftaInfo.Day3 / 2;
                this.ftaInfo.Neutrals = this.ftaInfo.Neutrals / 2;
                this.recons = window.incomeGrapher.reconData;
                this.graphOpen = true;

                window.generateFundChart(this.countries);
                //who: country as String
                   //where [x,y] as Vector2i
                        //when: int
                        //chainedFrom: [x,y] as Vector2i
                        //originalOwner: country as String
                this.showFta = true;
                this.currentReport.properties = {};
                this.currentReport.bases = [];
                let propertyData = {}
                for (let prop of window.incomeGrapher.properties.values()) {
                    let from = (prop.capturer && prop.capturer.from) ? prop.capturer.from : null;
                    let when = (prop.capturer && prop.capturer.from) ? prop.capturer.when + prop.capturer.getDayCost() : -1;
                    let data = {
                        where: prop.where,
                        when: when,
                        type: prop.type,
                        from: from,
                        owner: prop.owner,
                        originalOwner: prop.originalOwner,
                        contested: prop.owner == "",
                        ghosted: prop.ghosted,
                        taxDays: prop.taxDays,
                    };
                    let country = prop.owner;
                    if (country == "") country = "contested";
                    if (!Object.keys(propertyData).includes(country)) {
                        propertyData[country] = [];
                    }
                    propertyData[country].push(data);
                }
                for (let base of window.incomeGrapher.bases.values()) {
                    let country = base.owner;
                    let found = false;
                    let props = propertyData[country];
                    if (props == undefined) continue;
                    for (let entered of props) {
                        if (entered.where.x == base.where.x && entered.where.y == base.where.y) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        let from = (base.capturer && base.capturer.from) ? base.capturer.from : null;
                        let when = (base.capturer && base.capturer.from) ? base.capturer.when + base.capturer.getDayCost() : -1;
                        let data = {
                            where: base.where,
                            when: when,
                            type: base.type,
                            from: from,
                            owner: base.owner,
                            originalOwner: base.originalOwner
                        };
                        if (!Object.keys(propertyData).includes(country)) {
                            propertyData[country] = [];
                        }
                        propertyData[country].push(data);
                        this.currentReport.bases.push(base.where);
                    }
                }
                this.currentReport.properties = propertyData;
                this.currentReport.report = this.currentReport.toText();
                this.currentReport.renderDrawings();
            },
            toggleGraph() {
                this.graphOpen = !this.graphOpen;
            },
            clear() {
                window.incomeGrapher.clear();
            },
            showReconData() {
                this.showRecon = true;
                this.currentReport.renderReconData(this.reconDay, this.reconSearch);
            },
            clearReconData() {
                this.showRecon = false;
                this.currentReport.clearReconData();
            },
            generateFundsChart() {
                window.generateFundChart(this.countries);
            },
            generateTotalFundsChart() {
                window.generateTotalFundChart(this.countries);
            },
            generateTotalTaxedFundsChart() {
                window.generateTotalTaxedFundChart(this.countries);
            },
        }
    });
    let highFunds = false;
    let categories = document.querySelector("#map-categories").getElementsByClassName("small_text_14")[0];
    if (categories != undefined) {
        for (let element of categories.childNodes) {
            if (element.innerText == "High Funds") highFunds = true;
        }
    }

    let gameContainer = document.querySelector("#gamecontainer");
    if (gameContainer == undefined) return;

    let extensionPanel = document.querySelector("#vesper-extensions");
    if (extensionPanel == undefined) {
        extensionPanel = document.createElement("div");
        extensionPanel.id = "vesper-extensions";

        extensionPanel.style.background = '#98a0b8';
        extensionPanel.style.border = '2px solid #768a96';
        extensionPanel.style.display = 'flex';
        extensionPanel.style.flexDirection = 'row';
        extensionPanel.style.padding = '4px';
        extensionPanel.style.margin = '0px';
        extensionPanel.style.marginLeft = '-8px';
        extensionPanel.style.marginBottom = '8px';

        gameContainer.children[1].after(extensionPanel);
    }

    let e = document.createElement("div");
    e.id = "income-grapher-component";
    extensionPanel.append(e);

    let fP = document.querySelector("#game-header-table");
    let f = fP.querySelector(".bold.underline.game-header-header");
    let bt = f.querySelector(".bordertitle");
    let mapName = bt.innerHTML;
    let mapID = -1;

    let match = bt.outerHTML.match(/maps_id=(\d+)/);

    if (match) {
        mapID = parseInt(match[1]);
    }

    let t = [],
        n = window.mapWidth,
        i = window.mapHeight;
    for (let e = 0; e < n; e++)
        for (let n = 0; n < i; n++) terrainInfo[e] && terrainInfo[e][n] ? t.push(terrainInfo[e][n]) : t.push(buildingsInfo[e][n]);
    let o = Object.keys(BaseInfo.countries).map((e => e)).sort(((e, t) => BaseInfo.countries[e].id - BaseInfo.countries[t].id));
    let unitNames = Object.values(BaseInfo.units).map((e => e.name.toLowerCase().replace(" ", "")))
    let transportFound = false;
    let otherUnitsRead = [];
    let unitsRead = Array.from(window.gameMap.querySelectorAll("span > img"));
    unitsRead = unitsRead.reverse();
    unitsRead = unitsRead.filter((e => {
        const t = e.src;
        if (t.includes("blackboat") || t.includes("lander") || t.includes("t-copter") || t.includes("apc.gif")) {
            transportFound = true;
        }
        if (!t.includes("infantry")) {
            for (const n of unitNames) {
                if (t.includes(n + ".gif")) otherUnitsRead.push(e);
            }
            return !1;
        }
        for (const e of unitNames) {
            if (t.includes(e + ".gif")) return !0;
        }
        return !1
    }));
    let gridSize = 16;
    let unitDataArray = unitsRead.map((img, index) => {
        // Access the parent span for position
        let span = img.parentElement;

        // Initialize health variable
        let health = 10; // Default value if no matching image is found
        let healthImage = Array.from(span.querySelectorAll('img')).find(i => {
            return i.src.match(/terrain\/ani\/\d+\.gif$/)
        });

        // Extract x value if the image exists
        if (healthImage) {
            let match = healthImage.src.match(/terrain\/ani\/(\d+)\.gif$/); // Capture x
            if (match) {
                health = parseInt(match[1], 10); // Convert x to an integer
            }
        }

        // Extract left and top values from the span's style attribute
        let left = parseInt(span.style.left, 10);
        let top = parseInt(span.style.top, 10);

        // Calculate grid coordinates
        const x = Math.floor(left / gridSize);
        const y = Math.floor(top / gridSize);

        // Extract the country code from the image src
        let srcParts = img.src.split('/');
        let filename = srcParts[srcParts.length - 1]; // Get last part after the last /
        let country = filename.substring(0, 2); // First two letters before "infantry.gif"
        // Construct the unit data object
        return {
            x: x,
            y: y,
            id: 1, // or use another unique identifier if available
            country: country,
            health: health,
        };
    });
    let otherUnitDataArray = otherUnitsRead.map((img, index) => {
        // Access the parent span for position
        let span = img.parentElement;

        // Initialize health variable
        let health = 10; // Default value if no matching image is found
        let healthImage = Array.from(span.querySelectorAll('img')).find(i => {
            return i.src.match(/terrain\/ani\/\d+\.gif$/)
        });

        // Extract x value if the image exists
        if (healthImage) {
            let match = healthImage.src.match(/terrain\/ani\/(\d+)\.gif$/); // Capture x
            if (match) {
                health = parseInt(match[1], 10); // Convert x to an integer
            }
        }

        // Extract left and top values from the span's style attribute
        let left = parseInt(span.style.left, 10);
        let top = parseInt(span.style.top, 10);

        // Calculate grid coordinates
        const x = Math.floor(left / gridSize);
        const y = Math.floor(top / gridSize);

        // Extract the country code from the image src
        let srcParts = img.src.split('/');
        let filename = srcParts[srcParts.length - 1]; // Get last part after the last /
        let country = filename.substring(0, 2); // First two letters before "infantry.gif"
        let unitName = filename.replace(country, "").replace(".gif", "");
        let unitID = -1;
        for (let id of Object.keys(BaseInfo.units)) {
            if (BaseInfo.units[id].name.toLowerCase().replace(" ", "") == unitName) {
                unitID = parseInt(id);
                break;
            }
        }

        // Construct the unit data object
        return {
            x: x,
            y: y,
            id: unitID, // or use another unique identifier if available
            country: country,
            health: health,
        };
    });
    window.incomeGrapher = new IncomeGrapher;
    window.incomeGrapher.mapName = mapName;
    window.incomeGrapher.mapID = mapID;
    window.incomeGrapher.init();
    window.incomeGrapher.resize(n, i);
    window.incomeGrapher.setTerrain({
        tiles: t
    });
    window.incomeGrapher.units = unitDataArray;
    window.incomeGrapher.otherUnits = otherUnitDataArray;
    let report = new IncomeReport();
    report.config = {
        what: {
            owner: 'os',
            where: new Vector2i(0, 0),
            when: -1,
            from: new Vector2i(0, 0),
            originalOwner: "bm",
        }
    }
    window.analyzerComponent = new Vue({
        el: "#income-grapher-component",
        template: '<PrevIncomeGrapher :countries="countries" :noteTransport="noteTransport" :ftaInfo="ftaInfo" :highFunds="highFunds" :currentReport="currentReport"/>',
        data: function() {
            return {
                countries: {},
                noteTransport: transportFound,
                ftaInfo: {},
                highFunds: highFunds,
                currentReport: report,
            }
        }
    });
}
const CountryColor = {
    os: "#e25e41",
    bm: "#446eff",
    ge: "#3ec22b",
    yc: "#c5b800",
    bh: "#837c76",
    rf: "#b52643",
    gs: "#717370",
    bd: "#9a5330",
    ab: "#fca339",
    js: "#a6b696",
    ci: "#3f61c7",
    pc: "#fe68cf",
    tg: "#3acfc1",
    pl: "#a744d3",
    ar: "#5f7c0c",
    wn: "#bb534f",
    aa: "#5ed6eb",
    ne: "#574a4a",
    sc: "#89a8bc",
}
// Define the custom plugin
const customLabelPlugin = {
    id: 'customLabel',
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Ensure the image is fully loaded before using it
        window.incomeGrapher.tankOrder.forEach((entry) => {
            const labelIndex = chart.data.labels.indexOf(entry.day.toString());
            let cIndex = window.incomeGrapher.countries.indexOf(entry.country);
            //let offset = window.incomeGrapher.countries.indexOf(entry.country) / window.incomeGrapher.countries.length;

            if (labelIndex == -1) return; // Skip if label is not found

            const x = chart.scales.x.getPixelForValue(entry.day.toString());
            const y = chart.scales.y.getPixelForValue(chart.data.datasets[cIndex].data[labelIndex]);

            // Draw the label
            ctx.fillText(`Day #${entry.day}`, x, y - 15);
            const image = new Image();
            image.src = `terrain/aw1/${entry.country}tank.gif`; // Replace with your image URL

            // Draw the image to the right of the text
            const imageWidth = 20; // Set your desired image width
            const imageHeight = 20; // Set your desired image height
            ctx.drawImage(image, x - 48, y - 15 - imageHeight / 2, imageWidth, imageHeight);
        });

        ctx.restore();
    }
};

// Register the custom plugin with Chart.js
Chart.register(customLabelPlugin);
function getColor(funds) {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#33FF57', '#DA70D6'];
    return colors[Math.floor(funds / 1000) % colors.length];
}
function generateFundChart(chartData) {
    // this.countryData[country][day] = {
    //     startingFunds: d.startingFunds,
    //     endingFunds: d.endingFunds,
    //     startingIncome: d.getStartingIncome(this.income),
    //     endingIncome: d.getEndingIncome(this.income),
    //     generatedFunds: d.generatedFunds,
    //     totalUnitValue: d.totalUnitValue,
    //     countryName: BaseInfo.countries[country].name,
    //     totalInf: d.totalInf,
    //     totalTanks: d.totalTanks,
    //     totalOtherDeployed: d.totalOtherDeployed,
    // }
    // Chart configuration
    const staggeredData = (dataset, offset) => {
        return dataset.data.map((value, index) => ({
            x: index + offset, // Stagger the x value by adding an offset
            y: value
        }));
    };
    let datasets = [];
    let days = [];
    let adjustedDays = [];
    for (let i = 1; i < 16; i++) {
        days.push(i.toString());
        adjustedDays.push((i - 1).toString());
    }
    for (let country of Object.keys(chartData)) {
        let set = {};
        set.label = BaseInfo.countries[country].name;
        let dayData = [];
        for (let day in days) {
            let incomeEnd = chartData[country][day].endingIncome;
            dayData.push(incomeEnd);
        }
        set.data = dayData;
        //set.data = staggeredData(set, Object.keys(chartData).indexOf(country) / Object.keys(chartData).length);
        set.borderColor = CountryColor[country];
        set.borderWidth = 1;
        set.fill = false;
        datasets.push(set);
    }
    const chartConfig = {
        type: 'line', // or 'bar' or other types
        data: {
            labels: adjustedDays,
            datasets: datasets,
        },
        options: {
            scales: {
                x: {
                    type: 'linear', // Use a linear scale for x-axis
                    title: {
                        display: true,
                        text: 'Days'
                    },
                    beginAtZero: true // Adjust based on your data range
                },
                y: {
                    title: {
                        display: true,
                        text: 'Income on Day End'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    enabled: true
                },
                customLabel: {}
            }
        }
    };

    // Render the chart
    const ctx = document.getElementById('income-graph').getContext('2d');
    if (window.chart) {
        window.chart.destroy(); // Clear the previous chart if it exists
    }
    window.chart = new Chart(ctx, chartConfig);
}
function generateTotalFundChart(chartData) {
    // this.countryData[country][day] = {
    //     startingFunds: d.startingFunds,
    //     endingFunds: d.endingFunds,
    //     startingIncome: d.getStartingIncome(this.income),
    //     endingIncome: d.getEndingIncome(this.income),
    //     generatedFunds: d.generatedFunds,
    //     totalUnitValue: d.totalUnitValue,
    //     countryName: BaseInfo.countries[country].name,
    //     totalInf: d.totalInf,
    //     totalTanks: d.totalTanks,
    //     totalOtherDeployed: d.totalOtherDeployed,
    // }
    // Chart configuration
    const staggeredData = (dataset, offset) => {
        return dataset.data.map((value, index) => ({
            x: index + offset, // Stagger the x value by adding an offset
            y: value
        }));
    };
    let datasets = [];
    let days = [];
    let adjustedDays = [];
    for (let i = 1; i < 16; i++) {
        days.push(i.toString());
        adjustedDays.push((i - 1).toString());
    }
    for (let country of Object.keys(chartData)) {
        let set = {};
        set.label = BaseInfo.countries[country].name;
        let dayData = [];
        for (let day in days) {
            let incomeEnd = chartData[country][day].generatedFunds;
            dayData.push(incomeEnd);
        }
        set.data = dayData;
        set.data = staggeredData(set, Object.keys(chartData).indexOf(country) / Object.keys(chartData).length);
        set.borderColor = CountryColor[country];
        set.borderWidth = 1;
        set.fill = false;
        datasets.push(set);
    }
    const chartConfig = {
        type: 'line', // or 'bar' or other types
        data: {
            labels: adjustedDays,
            datasets: datasets,
        },
        options: {
            showLine: false,
            scales: {
                x: {
                    type: 'linear', // Use a linear scale for x-axis
                    title: {
                        display: true,
                        text: 'Days'
                    },
                    beginAtZero: true // Adjust based on your data range
                },
                y: {
                    title: {
                        display: true,
                        text: 'Generated Funds on Day End'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    enabled: true
                },
                customLabel: {}
            }
        }
    };

    // Render the chart
    const ctx = document.getElementById('income-graph').getContext('2d');
    if (window.chart) {
        window.chart.destroy(); // Clear the previous chart if it exists
    }
    window.chart = new Chart(ctx, chartConfig);
}
function generateTotalTaxedFundChart(chartData) {
    // this.countryData[country][day] = {
    //     startingFunds: d.startingFunds,
    //     endingFunds: d.endingFunds,
    //     startingIncome: d.getStartingIncome(this.income),
    //     endingIncome: d.getEndingIncome(this.income),
    //     generatedFunds: d.generatedFunds,
    //     totalUnitValue: d.totalUnitValue,
    //     countryName: BaseInfo.countries[country].name,
    //     totalInf: d.totalInf,
    //     totalTanks: d.totalTanks,
    //     totalOtherDeployed: d.totalOtherDeployed,
    // }
    // Chart configuration
    const staggeredData = (dataset, offset) => {
        return dataset.data.map((value, index) => ({
            x: index + offset, // Stagger the x value by adding an offset
            y: value
        }));
    };
    let datasets = [];
    let days = [];
    let adjustedDays = [];
    for (let i = 1; i < 16; i++) {
        days.push(i.toString());
        adjustedDays.push((i - 1).toString());
    }
    for (let country of Object.keys(chartData)) {
        let set = {};
        set.label = BaseInfo.countries[country].name;
        let dayData = [];
        for (let day in days) {
            let incomeEnd = chartData[country][day].generatedTaxedFunds;
            dayData.push(incomeEnd);
        }
        set.data = dayData;
        set.data = staggeredData(set, Object.keys(chartData).indexOf(country) / Object.keys(chartData).length);
        set.borderColor = CountryColor[country];
        set.borderWidth = 1;
        set.fill = false;
        datasets.push(set);
    }
    const chartConfig = {
        type: 'line', // or 'bar' or other types
        data: {
            labels: adjustedDays,
            datasets: datasets,
        },
        options: {
            showLine: false,
            scales: {
                x: {
                    type: 'linear', // Use a linear scale for x-axis
                    title: {
                        display: true,
                        text: 'Days'
                    },
                    beginAtZero: true // Adjust based on your data range
                },
                y: {
                    title: {
                        display: true,
                        text: 'Generated Funds on Day End'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    enabled: true
                },
                customLabel: {}
            }
        }
    };

    // Render the chart
    const ctx = document.getElementById('income-graph').getContext('2d');
    if (window.chart) {
        window.chart.destroy(); // Clear the previous chart if it exists
    }
    window.chart = new Chart(ctx, chartConfig);
}
window.generateFundChart = generateFundChart;
window.generateTotalFundChart = generateTotalFundChart;
window.generateTotalTaxedFundChart = generateTotalTaxedFundChart;
async function loadThisShit() {
    try {
        if (typeof Vue === "undefined") {
            await loadScript("js/vue.js");
        }
        await loadScript("js/tinyqueue.js");
        if (typeof _ === "undefined") {
            await loadScript("js/lodash.min.js");
        }

        const path = window.location.pathname;
        if (path.includes("prevmaps.php")) {
            initPrevmaps();
        }
    } catch (error) {
        console.error("Failed to load scripts or initialize:", error);
    }
}
window.gameMap = document.getElementById("gamemap")
loadThisShit();