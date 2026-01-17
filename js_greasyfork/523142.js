// ==UserScript==
// @name         GGn Group Tools for Mods
// @namespace    http://tampermonkey.net/
// @version      v4.1.17
// @description  Cut out non-essential parts of NFOs. Redact serial numbers and easily fix NFOs. Look up releases on scene tracking sites. Quick check common issues on torrents. Fuck your ASCII art.
// @author       tesnonwan
// @match        https://gazellegames.net/torrents.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/523142/GGn%20Group%20Tools%20for%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/523142/GGn%20Group%20Tools%20for%20Mods.meta.js
// ==/UserScript==

const hashLoc = location.href.indexOf('#');
if (hashLoc !== -1 && (location.href.slice(hashLoc + 1) === 'reset_api_key')) {
    GM_setValue('gtfm_api_key', null);
}
let API_KEY = GM_getValue('gtfm_api_key', null);
if (!API_KEY) {
    const key = prompt('GGn Group Tools for Mods: Please Provide API Key');
    if (key && key.trim()) {
        API_KEY = key;
        GM_setValue('gtfm_api_key', API_KEY);
    }
}

function createCp437Maps() {
    const charToCp437 = {};
    const cp437ToChar = {};

    // Most characters (0-127) are the same as ASCII
    for (let i = 0; i <= 127; i++) {
        charToCp437[i] = String.fromCharCode(i);
        cp437ToChar[charToCp437[i]] = i;
    }

    const extendedChars = {
        128: 'Ç', 129: 'ü', 130: 'é', 131: 'â', 132: 'ä', 133: 'à', 134: 'å', 135: 'ç',
        136: 'ê', 137: 'ë', 138: 'è', 139: 'ï', 140: 'î', 141: 'ì', 142: 'Ä', 143: 'Å',
        144: 'É', 145: 'æ', 146: 'Æ', 147: 'ô', 148: 'ö', 149: 'ò', 150: 'û', 151: 'ù',
        152: 'ÿ', 153: 'Ö', 154: 'Ü', 155: 'ø', 156: '£', 157: 'Ø', 158: '×', 159: 'ƒ',
        160: 'á', 161: 'í', 162: 'ó', 163: 'ú', 164: 'ñ', 165: 'Ñ', 166: 'ª', 167: 'º',
        168: '¿', 169: '⌐', 170: '¬', 171: '½', 172: '¼', 173: '¡', 174: '«', 175: '»',
        176: '░', 177: '▒', 178: '▓', 179: '│', 180: '┤', 181: '╡', 182: '╢', 183: '╖',
        184: '╕', 185: '╣', 186: '║', 187: '╗', 188: '╝', 189: '╜', 190: '╛', 191: '┐',
        192: '└', 193: '┴', 194: '┬', 195: '├', 196: '─', 197: '┼', 198: '╞', 199: '╟',
        200: '╚', 201: '╔', 202: '╩', 203: '╦', 204: '╠', 205: '═', 206: '╬', 207: '╧',
        208: '╨', 209: '╤', 210: '╥', 211: '╙', 212: '╘', 213: '╒', 214: '╓', 215: '╫',
        216: '╪', 217: '┘', 218: '┌', 219: '█', 220: '▄', 221: '▌', 222: '▐', 223: '▀',
        224: 'α', 225: 'ß', 226: 'Γ', 227: 'π', 228: 'Σ', 229: 'σ', 230: 'µ', 231: 'τ',
        232: 'Φ', 233: 'Θ', 234: 'Ω', 235: 'δ', 236: '∞', 237: 'φ', 238: 'ε', 239: '∩',
        240: '≡', 241: '±', 242: '≥', 243: '≤', 244: '⌠', 245: '⌡', 246: '÷', 247: '≈',
        248: '°', 249: '∙', 250: '·', 251: '√', 252: 'ⁿ', 253: '²', 254: '■', 255: ' ' // Non-breaking space
    };

    for (const charCode in extendedChars) {
        charToCp437[charCode] = extendedChars[charCode];
        cp437ToChar[extendedChars[charCode]] = charCode;
    }

    return {charToCp437, cp437ToChar};
}
const {charToCp437, cp437ToChar} = createCp437Maps();

function decodeCp437(arrayBuffer) {
    const inputArray = new Uint8Array(arrayBuffer);
    let outputStr = "";
    for (let i = 0; i < inputArray.length; ++i) {
        const charCode = inputArray[i];
        outputStr += charToCp437[charCode];
    }
    return outputStr;
}

function encodeCp437(inputStr) {
    const outputArray = new Uint8Array(inputStr.length);
    for (let i = 0; i < inputStr.length; ++i) {
        outputArray[i] = cp437ToChar[inputStr[i]];
    }
    return outputArray;
}

const groups = [
    {
        name: 'ALiAS',
        top_junk_height: 355,
        bottom_junk_height: 317,
    },
    {
        name: 'BACKLASH',
        top_junk_height: 287,
        bottom_junk_height: 177,
    },
    {
        name: 'BAZOOKA',
        top_junk_height: 626,
        bottom_junk_height: 1139,
    },
    {
        name: 'CODEX',
        top_junk_height: 292,
        bottom_junk_height: 304,
    },
    {
        name: 'CPY',
        variants: {
            [1390776256]: {
                name: 'CPY (dripping logo)',
                top_junk_height: 373,
                bottom_junk_height: 417,
            },
            [780775779]: {
                name: 'CPY (wave logo)',
                top_junk_height: 333,
                bottom_junk_height: 216,
            },
            [199106915]: {
                name: 'CPY (wave logo)',
                top_junk_height: 333,
                bottom_junk_height: 216,
            },
            [1852555619]: {
                name: 'CPY (wave logo)',
                top_junk_height: 333,
                bottom_junk_height: 216,
            },
            [-357807600]: {
                name: 'CPY (wave logo)',
                top_junk_height: 331,
                bottom_junk_height: 217,
            },
            [-1253015197]: {
                name: 'CPY (wave logo)',
                top_junk_height: 340,
                bottom_junk_height: 241,
            },
            [-1168269981]: {
                name: 'CPY (wave logo)',
                top_junk_height: 335,
                bottom_junk_height: 213,
            },


        },
    },
    {
        name: 'CLS',
        variants: {
            [675186621]: {
                name: 'CLS (small)',
                top_junk_height: 114,
                bottom_junk_height: 0,
            },
            [598431702]: {
                name: 'CLS (small, less leading space)',
                top_junk_height: 113,
                bottom_junk_height: 98,
            },
            [1176599525]: {
                name: 'CLS (big)',
                top_junk_height: 239,
                bottom_junk_height: 351,
            },
        },
    },
    {
        // Fuck these guys in particular.
        name: 'DARKSiDERS',
        variants: {
            [-2010747473]: {
                name: 'DARKSiDERS (small text)',
                top_junk_height: 362,
                bottom_junk_height: 488,
            },
            [1370223023]: {
                name: 'DARKSiDERS (small text)',
                top_junk_height: 364,
                bottom_junk_height: 731,
            },
            [2125433840]: {
                name: 'DARKSiDERS (big text)',
                top_junk_height: 635,
                bottom_junk_height: 1054,
            },
            [638179527]: {
                name: 'DARKSiDERS (short sky)',
                top_junk_height: 581,
                bottom_junk_height: 1011,
            },
            [-1533887244]: {
                name: 'DARKSiDERS (weird text)',
                top_junk_height: 542,
                bottom_junk_height: 485,
            },
            [-488127536]: {
                name: 'DARKSiDERS (weird text)',
                top_junk_height: 537,
                bottom_junk_height: 435,
            },
            [144464331]: {
                name: 'DARKSiDERS (tall sky)',
                top_junk_height: 678,
                bottom_junk_height: 951,
            },
            [2088669013]: {
                name: 'DARKSiDERS (ninja)',
                top_junk_height: 1527,
                bottom_junk_height: 543,
            },
            [-1934059588]: {
                name: 'DARKSiDERS (tall bitch)',
                top_junk_height: 101,
                bottom_junk_height: 1840,
            },
            [1982236604]: {
                name: 'DARKSiDERS (tall bitch)',
                top_junk_height: 498,
                bottom_junk_height: 1306,
                right_junk_width: 111,
            },
            [-1527041510]: {
                name: 'DARKSiDERS (disk)',
                top_junk_height: 283,
                bottom_junk_height: 517,
            },
            [-1712178200]: {
                name: 'DARKSiDERS (bubble text)',
                top_junk_height: 306,
                bottom_junk_height: 638,
            },
            [-2048630359]: {
                name: 'DARKSiDERS (black/white text)',
                top_junk_height: 341,
                bottom_junk_height: 395,
            },
            [809341493]: {
                name: 'DARKSiDERS (planet/mountain)',
                top_junk_height: 1112,
                bottom_junk_height: 234,
            },
            [2054362358]: {
                name: 'DARKSiDERS (tall pointy text)',
                top_junk_height: 357,
                bottom_junk_height: 518,
            },
            [-332841482]: {
                name: 'DARKSiDERS (dojo)',
                top_junk_height: 475,
                bottom_junk_height: 454,
            },
            [1027217248]: {
                name: 'DARKSiDERS (DS text)',
                top_junk_height: 495,
                bottom_junk_height: 433,
            },
            [60916849]: {
                name: 'DARKSiDERS (big dojo)',
                top_junk_height: 628,
                bottom_junk_height: 745,
                right_junk_width: 289,
            },
            [1942492020]: {
                name: 'DARKSiDERS (bubble letter DS)',
                top_junk_height: 257,
                bottom_junk_height: 352,
            },
            [2016838878]: {
                name: 'DARKSiDERS (stars)',
                top_junk_height: 203,
                bottom_junk_height: 577,
            },
            [-2105238022]: {
                name: 'DARKSiDERS (stars)',
                top_junk_height: 343,
                bottom_junk_height: 638,
            },
            [-1518455302]: {
                name: 'DARKSiDERS (stars)',
                top_junk_height: 339,
                bottom_junk_height: 625,
            },
            [-426345604]: {
                name: 'DARKSiDERS (treasure chest)',
                top_junk_height: 560,
                bottom_junk_height: 251,
            },
            [-892074247]: {
                name: 'DARKSiDERS (arrows)',
                top_junk_height: 619,
                bottom_junk_height: 1056,
            },
        },
    },
    {
        name: "DARKZER0",
        variants: {
            [-747731466]: {
                name: 'DARKSiDERS (dollar sign dojo)',
                top_junk_height: 608,
                bottom_junk_height: 728,
            },
        },
    },
    {
        name: 'DELiGHT',
        variants: {
            [2140877698]: {
                name: 'DELiGHT (big text)',
                top_junk_height: 272,
                bottom_junk_height: 729,
            },
            [801521802]: {
                name: 'DELiGHT (tree)',
                top_junk_height: 274,
                bottom_junk_height: 745,
                left_junk_width: 135,
                right_junk_width: 586,
            },
        },
    },
    {
        name: 'DEViANCE',
        variants: {
            [895813294]: {
                name: 'DEViANCE (small text)',
                top_junk_height: 251,
                bottom_junk_height: 695,
            },
            [-1038714585]: {
                name: 'DEViANCE (small text)',
                top_junk_height: 251,
                bottom_junk_height: 237,
            },
            [-497510738]: {
                name: 'DEViANCE (small text)',
                top_junk_height: 251,
                bottom_junk_height: 695,
            },
            [990477998]: {
                name: 'DEViANCE (small text)',
                top_junk_height: 251,
                bottom_junk_height: 695,
            },
            [-535729749]: {
                name: 'DEViANCE (ninja)',
                top_junk_height: 738,
                bottom_junk_height: 277,
            },
        }
    },
    {
        name: 'DOGE',
        top_junk_height: 286,
        bottom_junk_height: 75,
    },
    {
        name: 'DarKmooN',
        top_junk_height: 1272,
        bottom_junk_height: 106,
        left_junk_width: 402,
        right_junk_width: 30,
    },
    {
        name: 'FLT',
        top_junk_height: 261,
        bottom_junk_height: 91,
    },
    {
        name: 'GENESIS',
        top_junk_height: 177,
        bottom_junk_height: 118,
    },
    {
        name: 'GGn',
        top_junk_height: 980,
        bottom_junk_height: 91,
    },
    {
        name: 'GGnDOX',
        top_junk_height: 980,
        bottom_junk_height: 91,
    },
    {
        name: 'HR',
        variants: {
            [-1545786948]: {
                name: 'HR (skull)',
                top_junk_height: 1183,
                bottom_junk_height: 1165,
            },
            [-1027774259]: {
                name: 'HR (ninja)',
                top_junk_height: 772,
                bottom_junk_height: 477,
            },
            [1524357832]: {
                name: 'HR (skull and dragon)',
                top_junk_height: 5271,
                bottom_junk_height: 637,
            },
            [-1026705736]: {
                name: 'HR (fire skull)',
                top_junk_height: 1177,
                bottom_junk_height: 1215,
            },
        },
    },
    {
        name: 'KaOs',
        variants: {
            [-1326791851]: {
                name: 'KaOs (purple)',
                top_junk_height: 1208,
                bottom_junk_height: 147,
            },
            [-184384150]: {
                name: 'KaOs (dark text)',
                top_junk_height: 1036,
                bottom_junk_height: 525,
            },
            [1837454456]: {
                name: 'KaOs (small text)',
                top_junk_height: 251,
                bottom_junk_height: 434,
            },
            [1818841733]: {
                name: 'KaOs (text)',
                top_junk_height: 1050,
                bottom_junk_height: 477,
            },
            [1383869228]: {
                name: 'KaOs (blue)',
                top_junk_height: 1127,
                bottom_junk_height: 143,
            },
            [463280612]: {
                name: 'KaOs (blue)',
                top_junk_height: 1206,
                bottom_junk_height: 139,
            },
            [115821600]: {
                name: 'KaOs (blue smaller header)',
                top_junk_height: 1125,
                bottom_junk_height: 136,
            },
            [-1106722944]: {
                name: 'KaOs (pirate skull)',
                top_junk_height: 644,
                bottom_junk_height: 328,
            },
        },
        matcher: /KaOs/,
    },
    {
        name: 'PLAYMAGiC',
        top_junk_height: 445,
        bottom_junk_height: 639,
    },
    {
        name: 'PLAZA',
        top_junk_height: 270,
        bottom_junk_height: 163,
    },
    {
        name: 'PPTCLASSiCS',
        top_junk_height: 798,
        bottom_junk_height: 727,
    },
    {
        name: 'PROPHET',
        top_junk_height: 798,
        bottom_junk_height: 727,
    },
    {
        name: 'MOEMOE',
        variants: {
            [757941234]: {
                name: 'MOEMOE (girl)',
                top_junk_height: 1803,
                bottom_junk_height: 681,
            },
            [-1085858824]: {
                name: 'MOEMOE (girl w/?)',
                top_junk_height: 1863,
                bottom_junk_height: 614,
            },
        },
    },
    {
        name: 'RELOADED',
        top_junk_height: 428,
        bottom_junk_height: 68,
    },
    {
        name: 'RUNE',
        top_junk_height: 308,
        bottom_junk_height: 76,
    },
    {
        name: 'SKIDROW',
        variants: {
            [620081952]: {
                name: 'SKIDROW (small)',
                top_junk_height: 227,
                bottom_junk_height: 253,
            },
            [-1146730892]: {
                name: 'SKIDROW (skinny)',
                top_junk_height: 238,
                bottom_junk_height: 289,
            },
            [-195556368]: {
                name: 'SKIDROW (big)',
                top_junk_height: 921,
                bottom_junk_height: 334,
            },
        },
    },
    {
        name: 'SiMPLEX',
        variants: {
            [1431050696]: {
                name: 'SiMPLEX (filled text)',
                top_junk_height: 226,
                bottom_junk_height: 90,
            },
            [-641658390]: {
                name: 'SiMPLEX (bubble text)',
                top_junk_height: 196,
                bottom_junk_height: 118,
            },
        },
    },
    {
        name: 'TE',
        top_junk_height: 344,
        bottom_junk_height: 211,
    },
    {
        name: 'TENOKE',
        variants: {
            [558780745]: {
                name: 'TENOKE (big)',
                top_junk_height: 2321,
                bottom_junk_height: 1790,
            },
            [537227432]: {
                name: 'TENOKE (small)',
                top_junk_height: 242,
                bottom_junk_height: 140,
                left_junk_width: 28,
            },
        },
    },
    {
        name: 'THETA',
        top_junk_height: 1234,
        bottom_junk_height: 1224,
    },
    {
        name: 'TiNYiSO',
        variants: {
            [-2074187640]: {
                name: 'TiNYiSO (big)',
                top_junk_height: 439,
                bottom_junk_height: 32,
            },
            [-2094054216]: {
                name: 'TiNYiSO (big spotty)',
                top_junk_height: 463,
                bottom_junk_height: 183,
            },
            [-163382692]: {
                name: 'TiNYiSO (small)',
                top_junk_height: 218,
                bottom_junk_height: 81,
            },
        },
    },
    {
        name: 'Unleashed',
        variants: {
            [613414008]: {
                name: 'Unleashed (small)',
                top_junk_height: 218,
                bottom_junk_height: 68,
            },
            [1499613332]: {
                name: 'Unleashed (big)',
                top_junk_height: 717,
                bottom_junk_height: 349,
            },
        },
    },
    {
        name: 'TRSI',
        variants: {
            [-1296649746]: {
                name: 'TRSI (squiggle)',
                top_junk_height: 836,
                bottom_junk_height: 423,
            },
            [-1106646546]: {
                name: 'TRSI (squiggle)',
                top_junk_height: 936,
                bottom_junk_height: 843,
            },
            [-515812524]: {
                name: 'TRSI (blocktext)',
                top_junk_height: 249,
                bottom_junk_height: 905,
            },
            [-1304759930]: {
                name: 'TRSI (angletext)',
                top_junk_height: 300,
                bottom_junk_height: 702,
            },
            [-637598892]: {
                name: 'TRSI (blocktext)',
                top_junk_height: 250,
                bottom_junk_height: 864,
            },
        },
    },
    {
        name: 'VACE',
        top_junk_height: 850,
        bottom_junk_height: 649,
    },
    {
        name: 'ViTALiTY',
        variants: {
            [1172189322]: {
                name: 'ViTALiTY (big)',
                top_junk_height: 2945,
                bottom_junk_height: 378,
            },
            [826453503]: {
                name: 'ViTALiTY (big)',
                top_junk_height: 2939,
                bottom_junk_height: 378,
            },
            [-1754691446]: {
                name: 'ViTALiTY (big)',
                top_junk_height: 2939,
                bottom_junk_height: 358,
            },
            [1225143540]: {
                name: 'ViTALiTY (squeezed left)',
                top_junk_height: 318,
                bottom_junk_height: 423,
                right_junk_width: 259,
            },
            [1739771638]: {
                name: 'ViTALiTY (squeezed)',
                top_junk_height: 477,
                bottom_junk_height: 261,
            },
            [514026480]: {
                name: 'ViTALiTY (small)',
                top_junk_height: 478,
                bottom_junk_height: 231,
            },
            [-333509142]: {
                name: 'ViTALiTY (small)',
                top_junk_height: 488,
                bottom_junk_height: 232,
            },
            [-1801809349]: {
                name: 'ViTALiTY (small)',
                top_junk_height: 465,
                bottom_junk_height: 238,
            },
            [-1021299468]: {
                name: 'ViTALiTY (small swirl)',
                top_junk_height: 320,
                bottom_junk_height: 395,
            },
        },
    },
];

const SIG_ROW = 50;

function simpleHash(data) {
    let hash = 0;
    for (const i of data) {
        hash = ((hash << 5) - hash) + i;
        hash = hash & hash;
    }
    return hash;
}

function getSig(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    let row = 1;
    let sig = 0;
    do {
        const imgRowData = ctx.getImageData(0, row++ * SIG_ROW, img.naturalWidth, 1);
        sig = simpleHash(imgRowData.data);
    } while (sig === 0 && (row * SIG_ROW) < img.naturalHeight);
    return sig;
}

async function getGroupDataForPage() {
    const url = new URL(location.href);
    const groupId = url.searchParams.get('id');
    if (!groupId || !API_KEY) {
        return Promise.resolve(null);
    }
    return window.fetch(`https://gazellegames.net/api.php?request=torrentgroup&id=${groupId}`, {
        headers: {
            'X-API-Key': API_KEY,
        },
    })
        .then((r) => r.text())
        .then((text) => {
            return JSON.parse(text);
        });
}

function isDox(edition) {
    return edition.startsWith('GameDOX');
}

const ARCHIVE_REGEX = /[.](rar|zip|ace|7z|arc|bz2|[0-9acr-z][0-9][0-9])/;
const FITGIRL_REGEX = /[.](bin|ini|exe|md5|bat)/i;
const SCENE_EXTRAS_REGEX = /[.](nfo|sfv|diz|md5)/;

function isArchive(torrentData) {
    if (torrentData.type === 'Link') {
        return false;
    }
    let archiveRegex = ARCHIVE_REGEX;
    if (/FitGirl/.test(torrentData.releaseTitle)) {
        archiveRegex = FITGIRL_REGEX;
    }
    return torrentData.files.every((f) => {
        return archiveRegex.test(f.ext) || SCENE_EXTRAS_REGEX.test(f.ext);
    });
}

const DRM_FREE_REGEX = /gog|itch|patreon|zoom|saikey|fakku|dlsite|jast|manga|kagura|fanza|denpa|humble|072 project/i;

function isDrmFree(torrentData) {
    return DRM_FREE_REGEX.test(torrentData.edition) && !torrentData.gameDoxType;
}

function isMultiArchive(torrentData) {
    let archive = false;
    for (const file of torrentData.files) {
        if (ARCHIVE_REGEX.test(file.ext)) {
            if (archive) {
                return true;
            } else {
                archive = true;
            }
        }
    }
    return false;
}

function isInternal(torrentData) {
    return torrentData.releaseType === 'GGn Internal' || torrentData.releaseTitle.endsWith('GGnDOX');
}

function hasChangelog(desc) {
    if (/patch notes|changelog/i.test(desc.textContent)) {
        return true;
    }
    return false;
}

const LANGUAGE_REGEX = /language|audio and text:|text only:|interface|subtitles/i;

function hasLanguage(desc) {
    if (LANGUAGE_REGEX.test(desc.textContent)) {
        return true;
    }
    return false;
}

function getTorrentDatas() {
    return getGroupDataForPage().then((groupData) => {
        if (!groupData || groupData.status !== 'success') {
            return {};
        }
        const torrentDatas = {};
        for (const torrent of groupData.response.torrents) {
            const torrentData = {
                id: torrent.id,
                type: torrent.type,
                files: torrent.fileList,
                directory: torrent.filePath,
                releaseType: torrent.releaseType,
                releaseTitle: torrent.releaseTitle,
                gameDoxType: torrent.gameDOXType,
                version: torrent.gameDOXVersion,
                language: torrent.language,
                edition: torrent.remasterTitle,
            };
            torrentDatas[torrentData.id] = torrentData;
        }
        return torrentDatas;
    });
}

async function checkForIssues(context) {
    const {torrent, title, torrentTitleAnchor, torrentDescRow, desc, sceneTitle, isScene, nfoImg, torrentDatasPromise} = context;
    const torrentDatas = await torrentDatasPromise;
    const torrentId = torrent.id.slice(7);
    const torrentData = torrentDatas[torrentId];
    if (!torrentData) {
        return;
    }
    if (!isArchive(torrentData)) {
        for (const node of torrentTitleAnchor.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.startsWith(' [')) {
                const idx = node.nodeValue.lastIndexOf(',');
                node.nodeValue = node.nodeValue.substr(0, idx) + ', Not Archived,' + node.nodeValue.substr(idx + 1);
                break;
            }
        }
    }
    const edition = torrentData.edition;
    const issues = [];
    if (torrentData.gameDoxType === 'Update' && torrentData.type !== 'Link') {
        if (!hasChangelog(desc)) {
            issues.push('Missing changelog');
        }
    }
    if (/^(\r|\n)/.test(desc)) {
        issues.push('Description starts with newline');
    }
    if (torrentData.language === 'Multi-Language' && !hasLanguage(desc) && !isInternal(torrentData)) {
        issues.push('Multi-Language with no language list');
    }
    if (torrentData.files && torrentData.files.some((f) => f.size === '0')) {
        issues.push('Contains 0-byte file');
    }
    const releaseTitle = torrentData.releaseTitle;
    if (isScene) {
        if (releaseTitle.indexOf(' ') !== -1) {
            issues.push('Scene release title contains spaces');
        }
        if (torrentData.directory !== releaseTitle) {
            issues.push('Folder name does not match scene release title');
        }
        if (nfoImg) {
            if (!nfoImg.src.startsWith('https://gazellegames.net')) {
                issues.push('NFO not hosted on gazellegames.net');
            }
        } else {
            issues.push('Missing NFO');
        }
        if (torrentData.releaseType !== 'GameDOX' && torrentId > 1016800 && !torrentTitleAnchor.querySelector('#trumpable_tag') && (!torrentData.version || torrentData.version === 'Unknown')) {
            issues.push('Scene release trumpable by known version');
        }
    } else /* Not scene */ {
        const drmFreeEdition = isDrmFree(torrentData);
        if (drmFreeEdition && torrentData.type !== 'Link' && torrentData.releaseType !== 'DRM Free' && !/^P2P.*/.test(torrentData.releaseType)) {
            issues.push('Release type should be DRM Free');
            console.log(torrentData);
        }
        if (!drmFreeEdition && torrentData.releaseType === 'DRM Free') {
            issues.push('DRM Free release type is not in DRM free store edition');
        }
        if (torrentData.releaseType === 'P2P') {
            issues.push('Legacy P2P release type used');
        }
        if (['Full ISO', 'Home Rip'].includes(torrentData.releaseType)) {
            if (isMultiArchive(torrentData)) {
                issues.push('Multiple archive files');
            }
            if (!torrentData.gameDoxType && !torrentData.version) {
                const versionSplit = /(.*)([ \._])(v[0-9].*)/.exec(releaseTitle);
                if (!versionSplit) {
                    issues.push('No version number');
                } else if (versionSplit[2] === '.' || versionSplit[1].indexOf('.') !== -1) {
                    issues.push('Dots used in release title');
                } else if (versionSplit[2] === '_' || versionSplit[1].indexOf('_') !== -1) {
                    issues.push('Underscores used in release title');
                }
            }
        }
    }
    markIssues({torrent, torrentTitleAnchor, torrentDescRow, issues});
}

function markIssues(context) {
    const {torrent, torrentTitleAnchor, torrentDescRow, issues} = context;
    if (issues.length === 0) {
        return;
    }
    const exclamation = document.createElement('span');
    exclamation.style.color = 'firebrick';
    exclamation.style.fontWeight = 'bold';
    exclamation.textContent = '[ ! ]';
    torrentTitleAnchor.insertBefore(exclamation, torrentTitleAnchor.childNodes[0]);
    const issuesBlock = document.createElement('blockquote');
    const list = document.createElement('ul');
    list.style.color = 'red';
    issuesBlock.appendChild(list);
    list.setAttribute('class', 'postlist');
    for (const issue of issues) {
        const item = document.createElement('li');
        item.textContent = issue;
        list.appendChild(item);
    }
    const descTd = torrentDescRow.querySelector('td');
    descTd.insertBefore(issuesBlock, descTd.childNodes[0]);
}

function crawlTorrents() {
    const images = [];
    const torrents = document.querySelectorAll('.group_torrent[id]');
    const torrentDatasPromise = getTorrentDatas();
    for (const torrent of torrents) {
        const torrentTitleAnchor = torrent.querySelector('td > a');
        const title = torrentTitleAnchor?.textContent?.trim();
        if (!title) continue;
        const sceneTitle = title.slice(0, title.indexOf(' '));
        addNfoReplace(torrent, sceneTitle);
        const isScene = title.indexOf(', Scene') !== -1
        if (isScene) {
            addReleaseLookup(torrent, sceneTitle);
        }
        const torrentDescRow = torrent.nextElementSibling;
        const desc = torrentDescRow.querySelector('blockquote[id="description"]');
        const nfoImg = torrentDescRow.querySelector('blockquote[id="description"] img[onclick]');
        if (nfoImg) {
            addSigLogger(nfoImg);
        }
        checkForIssues({
            torrent, title, torrentTitleAnchor, torrentDescRow, desc, sceneTitle, isScene, nfoImg, torrentDatasPromise});
        for (const group of groups) {
            if (group.matcher?.test(title) || title.includes(`-${group.name} `) || (group.name === 'GGn' && title.indexOf(', GGn Internal') !== -1)) {
                images.push({
                    img: nfoImg,
                    ...group,
                });
                break;
            }
        }
    }
    return images;
}

function addLabelToImg(img, labelText, opts = {}) {
    opts = {
        includeRevertButton: true,
        color: '',
        ...opts,
    };
    const labelDiv = document.createElement('div');
    const label = document.createElement('span');
    label.style.fontStyle = 'italic';
    label.style.color = opts.color;
    label.appendChild(document.createTextNode(labelText));
    labelDiv.appendChild(label);
    img.parentElement.insertBefore(labelDiv, img);
    if (!opts.includeRevertButton) {
        return;
    }
    const revertButton = document.createElement('button');
    revertButton.setAttribute('type', 'button');
    revertButton.appendChild(document.createTextNode('↺'));
    labelDiv.appendChild(revertButton);
    return revertButton;
}

function addSigLogger(img) {
    img.addEventListener('mousedown', () => {
        if (img.sig) {
            console.log(img.sig);
            return;
        }
        img.sig = getSig(img);
        console.log(img.sig);
    });
}

function truncateImage(data) {
    const img = data.img;
    if (data.variants) {
        try {
            const imgSig = getSig(img);
            const variant = data.variants[imgSig];
            if (!variant) {
                console.log(`No variant found matching sig ${imgSig} for group ${data.name}`);
                return;
            }
            data = variant;
        } catch (err) {
            if (img.proxied) {
                return;
            }
            img.proxied = true;
            // Likely cross-domain error.
            addLabelToImg(img, 'NFO is not hosted on gazellegames.net', {includeRevertButton: false, color: 'red'});
            window.setTimeout(() => {
                // Reload image from GGn image proxy.
                img.src = `https://gazellegames.net/image.php?i=${encodeURIComponent(img.src)}&c=1`;
            }, 0);
            return;
        }
    }
    if (img.truncated) {
        return;
    }
    img.truncated = true;
    const revertButton = addLabelToImg(img, `${data.name} NFO has been truncated`);
    const canvas = document.createElement('canvas')
    const width = img.naturalWidth + 4 - (data.left_junk_width || 0) - (data.right_junk_width || 0);
    canvas.width = width
    const newHeight = img.naturalHeight - data.top_junk_height - data.bottom_junk_height;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, newHeight);
    ctx.drawImage(img, (data.left_junk_width || 0), data.top_junk_height, width, newHeight, 0, 0, width, newHeight);
    img.style.display = 'none';
    img.parentElement.insertBefore(canvas, img);
    let originalHidden = true;
    revertButton.onclick = () => {
        if (originalHidden) {
            originalHidden = false;
            img.style.display = '';
            canvas.style.display = 'none';
        } else {
            originalHidden = true;
            img.style.display = 'none';
            canvas.style.display = '';
        }
    };
}

function resizeTextArea(textarea, text) {
    const lines = text?.split('\n') || [];
    let longestLine = 80;
    lines.forEach((line) => {
        longestLine = Math.max(longestLine, line.length);
    });
    textarea.rows = lines.length || 5;
    textarea.cols = Math.min(120, longestLine);
}

function redactSerials(nfoTextArea, statusDiv, allowSpaces = false) {
    const exceptions = {
        'over-the-top': true,
        'head-to-head': true,
        'easy-to-use': true,
        'king-of-the-hill': true,
    };
    return () => {
        let redactions = 0;
        const text = nfoTextArea.value;
        let serialRegex = allowSpaces ? /([0-9a-zA-Z]{4,6}(?: ?- ?[0-9a-zA-Z]{2,7}){2,6})/g : /([0-9a-zA-Z]{4,6}(?:-[0-9a-zA-Z]{2,7}){2,6})/g
        nfoTextArea.value = text.replaceAll(serialRegex, (serial) => {
            if (exceptions[serial]) {
                return serial;
            }
            ++redactions;
            return serial.replaceAll(/[0-9a-zA-Z]/g, 'X');
        });
        setStatus(statusDiv, `Redacted ${redactions} serial${redactions === 1 ? '' : 's'}`);
    };
}

function submitNfo(torrentId, nfoTextArea, statusDiv) {
    return () => {
        const nfoData = encodeCp437(nfoTextArea.value);
        const submitFormData = new FormData();
        submitFormData.append('torrentid', torrentId);
        submitFormData.append('file_release_desc', new Blob([nfoData], {type: 'application/octet-stream'}), nfoTextArea.nfoFile);
        setStatus(statusDiv, 'Submitting NFO...');
        fetch('https://gazellegames.net/nfo.php', {
            method: 'POST',
            body: submitFormData,
        }).then((resp) => {
            if (resp.ok) {
                setStatus(statusDiv, `Success: [align=center][img]https://gazellegames.net/nfoimg/${torrentId}.png[/img][/align]`);
            } else {
                setStatus(statusDiv, `Error: ${resp.status} ${resp.statusText}`, 'red');
                resp.text().then((errText) => {
                    console.log(errText);
                });
            }
        });
    };
}

function makeReplacementUi(detailElement, torrentId) {
    const replaceDiv = document.createElement('div');
    replaceDiv.style.textAlign = 'center';
    replaceDiv.id = `nforeplace_${torrentId}`;
    const descriptionElem = detailElement.querySelector('blockquote[id="description"]');
    descriptionElem.parentElement.insertBefore(replaceDiv, descriptionElem);

    const buttonsDiv = document.createElement('div');
    const redactSerialsButton = document.createElement('button');
    redactSerialsButton.type = 'button';
    redactSerialsButton.textContent = 'Redact Serials';
    redactSerialsButton.style.margin = '5px';
    buttonsDiv.appendChild(redactSerialsButton);
    const redactSerialsSpacesButton = document.createElement('button');
    redactSerialsSpacesButton.type = 'button';
    redactSerialsSpacesButton.textContent = 'Redact Serials (allow spaces)';
    redactSerialsSpacesButton.style.margin = '5px';
    buttonsDiv.appendChild(redactSerialsSpacesButton);
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.textContent = 'Submit NFO';
    submitButton.style.margin = '5px';
    buttonsDiv.appendChild(submitButton);
    replaceDiv.appendChild(buttonsDiv);

    const statusDiv = document.createElement('div');
    statusDiv.id = `replace_status_${torrentId}`;
    replaceDiv.appendChild(statusDiv);

    const nfoTextArea = document.createElement('textarea');
    nfoTextArea.cols = 80;
    nfoTextArea.style.color = 'black';
    nfoTextArea.style.backgroundColor = 'white';
    nfoTextArea.style.overflow = 'scroll';
    nfoTextArea.style.width = 'auto';
    nfoTextArea.style.fontFamily = 'Courier New, monospace';
    replaceDiv.appendChild(nfoTextArea);

    redactSerialsButton.onclick = redactSerials(nfoTextArea, statusDiv);
    redactSerialsSpacesButton.onclick = redactSerials(nfoTextArea, statusDiv, /* allowSpaces= */ true);
    submitButton.onclick = submitNfo(torrentId, nfoTextArea, statusDiv);
    return nfoTextArea;
}

function setStatus(statusDiv, msg, color = 'white') {
    statusDiv.innerHTML = `<span style="font-style: italic; color: ${color}">${msg}</span>`;
}

function addNfoReplace(torrentGroupElem, title) {
    const detailElement = torrentGroupElem.nextElementSibling;
    const detailLinks = detailElement.querySelectorAll(':scope > td a');
    let uploadNfoLink;
    for (const link of detailLinks) {
        if (link.textContent?.trim() === '(Upload NFO)') {
            uploadNfoLink = link;
            break;
        }
    }
    if (!uploadNfoLink) {
        return;
    }
    const replaceNfoLink = document.createElement('a');
    replaceNfoLink.appendChild(document.createTextNode('(Replace NFO)'));
    replaceNfoLink.addEventListener('click', async () => {
        const torrentId = detailElement.id.slice(detailElement.id.indexOf('_') + 1);
        const replaceDivId = `nforeplace_${torrentId}`;
        const replaceDiv = document.getElementById(replaceDivId);
        let nfoTextArea;
        if (replaceDiv) {
            nfoTextArea = replaceDiv.querySelector('textarea');
        } else {
            nfoTextArea = makeReplacementUi(detailElement, torrentId);
        }
        const statusDiv = document.getElementById(`replace_status_${torrentId}`);
        setStatus(statusDiv, 'Loading...');
        promiseXhr(`https://www.srrdb.com/api/nfo/${title}`, {
            method: 'GET',
            responseType: 'json',
        }, (nfoLinkResp) => {
            const nfoLinks = nfoLinkResp?.response?.nfolink;
            if (!nfoLinks || nfoLinks.length === 0) {
                throw `No nfolinks found in: ${nfoLinkResp.responseText}`;
            } else if (nfoLinks.length > 1) {
                throw `Multiple nfolinks found in: ${nfoLinkResp.responseText}`;
            } else {
                return nfoLinks[0];
            }
        }).then((nfoUrl) => {
            return promiseXhr(nfoUrl, {
                method: 'GET',
                responseType: 'arraybuffer',
            }, (nfoResp) => {
                const nfoText = decodeCp437(nfoResp.response);
                resizeTextArea(nfoTextArea, nfoText);
                nfoTextArea.value = nfoText;
                nfoTextArea.nfoFile = /\/([^/]+\.nfo)/.exec(nfoUrl)[1];
                setStatus(statusDiv, `Loaded '${nfoTextArea.nfoFile}'`);
            });
        }).catch((err) => {
            setStatus(statusDiv, 'Error fetching NFO', 'red');
            console.log(err);
        });
    });
    uploadNfoLink.parentElement.insertBefore(replaceNfoLink, uploadNfoLink);
    return replaceNfoLink;
}

function makeSceneLookupSpan(name) {
    const span = document.createElement('span');
    span.style.marginLeft = '2px';
    span.style.marginRight = '2px';
    span.style.display = 'inline-block';
    span.style.textAlign = 'left';
    span.style.width = '60px';
    const label = document.createElement('span');
    label.style.marginRight = '2px';
    label.appendChild(document.createTextNode(`${name}:`));
    span.appendChild(label);
    const content = document.createElement('span');
    content.setAttribute('class', 'nfo_lookup_loading');
    span.appendChild(content);
    return {span, content};
}

const RESP_TYPE = {
    FOUND: { color: 'limegreen', icon: '✔' },
    NOT_FOUND: { color: 'red', icon: '𐄂' },
    NUKED: { color: 'goldenrod', icon: '☢' },
    UNNUKED: { color: 'limegreen', icon: '☢' },
    MIA: { color: 'white', icon: '�' },
};

function releaseLookupIcon(type, url = '', toolTip = '') {
    const icon = document.createElement('span');
    icon.style.color = type.color;
    icon.appendChild(document.createTextNode(type.icon));
    if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.title = toolTip;
        link.target = '_blank';
        link.appendChild(icon);
        return link;
    }
    return icon;
}

function lookupSrrDbRelease(title, contentSpan) {
    const releaseUrl = `https://www.srrdb.com/release/details/${title}`;
    promiseXhr(releaseUrl, { method: 'GET' }, (resp) => {
        if (resp.status !== 200) {
            throw `Error: ${resp.status}`;
        }
        contentSpan.replaceWith(releaseLookupIcon(RESP_TYPE.FOUND, releaseUrl));
    }).catch((err) => {
        console.log(err);
        contentSpan.replaceWith(releaseLookupIcon(RESP_TYPE.NOT_FOUND));
    });
}

function lookupPreDbRelease(title, contentSpan) {
    Promise.all([
        promiseXhr(`https://api.predb.net/?release=${title}`, { method: 'GET', responseType: 'json' }, (resp) => {
            if (resp.status !== 200) {
                return { url: '', nukeReason: '' };
            }
            if (resp.response.status !== 'success') {
                return { url: '', nukeReason: '' };
            }
            const nukeReason = resp.response.data?.[0]?.reason;
            if (nukeReason) {
                if (resp.response.data?.[0]?.status === 2) {
                    return { url: `https://predb.net/rls/${title}`, nukeReason: '', unnukeReason: nukeReason };
                } else {
                    return { url: `https://predb.net/rls/${title}`, nukeReason };
                }
            } else {
                return { url: `https://predb.net/rls/${title}`, nukeReason: '' };
            }
        }),
        promiseXhr(`https://api.predb.org/v2/api/details?rls=${title}`, { method: 'GET', responseType: 'json' }, (resp) => {
            if (resp.status !== 200) {
                return { url: '', nukeReason: '' };
            }
            if (resp.response.nukereason) {
                return { url: `https://predb.org/rls/${title}`, nukeReason: resp.response.nukereason };
            } else {
               return { url: `https://predb.org/rls/${title}`, nukeReason: '' };
            }
        }),
    ]).then((results) => {
        let firstResult;
        for (const result of results) {
            if (!firstResult && result.url) {
                firstResult = result;
            }
            if (result.unnukeReason) {
                contentSpan.replaceWith(releaseLookupIcon(RESP_TYPE.UNNUKED, result.url, result.unnukeReason));
                return;
            }
            if (result.nukeReason) {
                contentSpan.replaceWith(releaseLookupIcon(RESP_TYPE.NUKED, result.url, result.nukeReason));
                return;
            }
        }
        if (firstResult) {
            contentSpan.replaceWith(releaseLookupIcon(RESP_TYPE.FOUND, firstResult.url));
        } else {
            contentSpan.replaceWith(releaseLookupIcon(RESP_TYPE.NOT_FOUND));
        }
    }).catch((err) => {
        contentSpan.replaceWith(releaseLookupIcon(RESP_TYPE.NOT_FOUND));
    });
}

function lookupDatsSiteRelease(title, contentSpan) {
    const handleDatsSiteResp = (resp) => {
        const rawHtml = resp.response;
        if (rawHtml.indexOf('data-rowindex="1"') === -1) {
            return { url: '', nukeReason: '' };
        }
        const respDoc = (new DOMParser()).parseFromString(rawHtml, 'text/html');
        const titleSpan = respDoc.querySelector('td[data-name="game_name"] span');

        let nukeReason = '', mia = false;
        const buttons = titleSpan?.querySelectorAll('button') || [];
        for (const button of buttons) {
            if (button.textContent.trim() === 'NUKED') {
                nukeReason = button.getAttribute('title');
            }
            if (button.textContent.trim() === 'missing!') {
                mia = true;
            }
        }
        const infoAnchor = respDoc.querySelector('.fa-info-circle.fa-lg').parentElement;
        return {
            url: `https://dats.site/${infoAnchor.getAttribute('href')}`,
            nukeReason,
            mia
        };
    };
    const isoUrl = `https://dats.site/rls_pcisolist.php?cmd=search&t=rls_pciso&psearch=${title}`;
    const zeroDayUrl = `https://dats.site/rls_pc0daylist.php?cmd=search&t=rls_pc0day&psearch=${title}`;
    const doxUrl = `https://dats.site/rls_pcdoxlist.php?cmd=search&t=rls_pcdox&psearch=${title}`;
    Promise.all([
        promiseXhr(isoUrl, { method: 'GET' }, handleDatsSiteResp),
        promiseXhr(zeroDayUrl, { method: 'GET' }, handleDatsSiteResp),
        promiseXhr(doxUrl, { method: 'GET' }, handleDatsSiteResp),
    ]).then((results) => {
        for (const result of results) {
            if (result.url) {
                if (result.nukeReason) {
                    contentSpan.replaceWith(releaseLookupIcon(RESP_TYPE.NUKED, result.url, result.nukeReason));
                } else if (result.mia) {
                    contentSpan.replaceWith(releaseLookupIcon(RESP_TYPE.MIA, result.url));
                }
                contentSpan.replaceWith(releaseLookupIcon(RESP_TYPE.FOUND, result.url));
                return;
            }
        }
        contentSpan.replaceWith(releaseLookupIcon(RESP_TYPE.NOT_FOUND));
    }).catch((err) => {
        contentSpan.replaceWith(releaseLookupIcon(RESP_TYPE.NOT_FOUND));
    });
}

function addReleaseLookup(torrentGroupElem, title) {
    const detailElement = torrentGroupElem.nextElementSibling;
    const firstLinkBox = detailElement.querySelector(':scope > td .linkbox');
    const sceneLookupDiv = document.createElement('div');
    sceneLookupDiv.setAttribute('class', 'linkbox');
    sceneLookupDiv.style.color = 'lightblue';
    const lookupReleaseLink = document.createElement('a');
    lookupReleaseLink.appendChild(document.createTextNode('[Lookup Release]'));
    sceneLookupDiv.appendChild(lookupReleaseLink);
    firstLinkBox.parentElement.insertBefore(sceneLookupDiv, firstLinkBox);
    lookupReleaseLink.onclick = () => {
        const srr = makeSceneLookupSpan('SRRDB');
        const pre = makeSceneLookupSpan('PREDB');
        const dats = makeSceneLookupSpan('DATS');
        lookupReleaseLink.replaceWith('[', srr.span, '|', pre.span, '|', dats.span, ']');
        lookupSrrDbRelease(title, srr.content);
        lookupPreDbRelease(title, pre.content);
        lookupDatsSiteRelease(title, dats.content);
    };
}

function promiseXhr(url, options, onloadHandler) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url,
            ...options,
            onabort: (response) => {
                reject(response)
            },
            onerror: (response) => {
                reject(response)
            },
            ontimeout: (response) => {
                reject(response)
            },
            onload: (response) => {
                try {
                    resolve(onloadHandler(response));
                } catch (err) {
                    reject(err);
                }
            },
        })
    })
}

function maybeAutoFillVersion() {
    if (!/action=edit&/.test(location.href)) {
        return;
    }
    const versionInput = document.getElementById('gamedoxvers');
    if (versionInput.style.display === 'none') {
        return;
    }
    if (versionInput.value.trim() !== '') {
        return;
    }
    const releaseTitle = document.getElementById('release_title').value;
    const versionMatch = /.*[ \-_.]v([0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9][0-9a-zA-Z]*(?:\.[0-9][0-9A-Za-z]*)*(?: \((?:[0-9]{4,6}|[0-9]\.[0-9]+\.[0-9]+\.[0-9]+)\))?)(?:$|[ \-_.].*)/.exec(releaseTitle);
    if (!versionMatch) {
        return;
    }
    versionInput.style.fontStyle = 'italic';
    versionInput.style.color = 'gold';
    versionInput.value = versionMatch[1];
    const removeItalicFn = () => {
        versionInput.style.fontStyle = '';
        versionInput.style.color = '';
        versionInput.removeEventListener('input', removeItalicFn);
    };
    versionInput.addEventListener('input', removeItalicFn);
}

function run() {
    console.log('Starting GGn Group Tools for Mods');
    maybeAutoFillVersion();
    crawlTorrents().forEach((data) => {
        if (!data || !data.img) return;
        if (data.img.complete) {
            truncateImage(data);
        }
        data.img.addEventListener('load', () => {
            truncateImage(data);
        });
    });
    // Insert ellipsis keyframes style.
    const styleSheet = document.styleSheets[0];
    const keyframesRule = '@keyframes ellipsis { to { width: 1.0em; } }';
    styleSheet.insertRule(keyframesRule, styleSheet.cssRules.length);
    const animatedElipsisRule =
          '.nfo_lookup_loading:after { overflow: hidden; display: inline-block; ' +
          'vertical-align: bottom; animation: ellipsis steps(4,end) 900ms infinite; ' +
          'content: "\\2026"; width: 0px; position: absolute; }';
    styleSheet.insertRule(animatedElipsisRule, styleSheet.cssRules.length);
}

run();