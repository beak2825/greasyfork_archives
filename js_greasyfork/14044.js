/* eslint-disable max-len */
// ==UserScript==
// @name             WME Color Speeds
// @name:fr          WME Color Speeds
// @version          2025.02.04.01
// @description      Adds colors to road segments to show their speed
// @description:fr   Colorisation des segments selon leurs vitesses.
// @include          https://www.waze.com/editor*
// @include          https://www.waze.com/*/editor*
// @include          https://beta.waze.com/editor*
// @include          https://beta.waze.com/*/editor*
// @exclude          https://www.waze.com/user*
// @exclude          https://www.waze.com/*/user*
// @grant            GM_xmlhttpRequest
// @connect          greasyfork.org
// @namespace        https://greasyfork.org/scripts/14044-wme-color-speeds
// @require          https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @author           Created by French Script Team, Maintained by WazeDev
// @copyright        Sebiseba, seb-d59 & DummyD2 - 2015-2019
// @downloadURL https://update.greasyfork.org/scripts/14044/WME%20Color%20Speeds.user.js
// @updateURL https://update.greasyfork.org/scripts/14044/WME%20Color%20Speeds.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */
/* global GM_info */
/* global CSpeedsWaze */
/* global I18n */
/* global $ */

// *********************
// **  DECLARATIONS   **
// *********************

// eslint-disable-next-line camelcase
const scriptName = GM_info.script.name;
// eslint-disable-next-line camelcase
const currentVersion = GM_info.script.version;
const changelogFrench = 'UPDATED: Rollback code';
const changelogEnglish = 'UPDATED: Rollback code';
// eslint-disable-next-line camelcase
const greasyForkUrl = GM_info.script.namespace;
const downloadUrl = 'https://greasyfork.org/scripts/14044-wme-color-speeds/code/wme-color-speeds.user.js';
const forumUrl = 'https://www.waze.com/forum/viewtopic.php?t=167387';
// let oldScriptVersion;
const debug = false;
let WMECSpeeds = {};
let loadStartTime;
let scriptStartTime;

const iconUndo = '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';
const iconDelete = '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';
const iconSubmit = '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';
const iconEdit = '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';

const colors = [
    '(255,0,128)', '(255,0,160)', '(255,0,192)', '(255,0,224)', '(255,0,255)', '(224,0,255)',
    '(192,0,255)', '(160,0,255)', '(128,0,255)', '(96,0,255)', '(64,0,255)', '(32,0,255)',
    '(0,0,255)', '(0,32,255)', '(0,64,255)', '(0,96,255)', '(0,128,255)', '(0,160,255)',
    '(0,192,255)', '(0,224,255)', '(0,255,255)', '(0,255,224)', '(0,255,192)', '(0,255,160)',
    '(0,255,128)', '(0,255,96)', '(0,255,64)', '(0,255,32)', '(0,255,0)', '(32,255,0)',
    '(64,255,0)', '(96,255,0)', '(128,255,0)', '(160,255,0)', '(192,255,0)', '(224,255,0)',
    '(255,255,0)', '(255,224,0)', '(255,192,0)', '(255,160,0)', '(255,128,0)', '(255,96,0)',
    '(255,64,0)', '(255,0,0)', 'Pink', 'LightPink', 'HotPink', 'DeepPink', 'PaleVioletRed',
    'MediumVioletRed', 'LightSalmon', 'Salmon', 'DarkSalmon', 'LightCoral', 'IndianRed', 'Crimson',
    'FireBrick', 'DarkRed', 'Red', 'OrangeRed', 'Tomato', 'Coral', 'DarkOrange', 'Orange', 'Yellow',
    'LightYellow', 'LemonChiffon', 'LightGoldenrodYellow', 'PapayaWhip', 'Moccasin', 'PeachPuff',
    'PaleGoldenrod', 'Khaki', 'DarkKhaki', 'Gold', 'Cornsilk', 'BlanchedAlmond', 'Bisque',
    'NavajoWhite', 'Wheat', 'BurlyWood', 'Tan', 'RosyBrown', 'SandyBrown', 'Goldenrod',
    'DarkGoldenrod', 'Peru', 'Chocolate', 'SaddleBrown', 'Sienna', 'Brown', 'Maroon',
    'DarkOliveGreen', 'Olive', 'OliveDrab', 'YellowGreen', 'LimeGreen', 'Lime', 'LawnGreen',
    'Chartreuse', 'GreenYellow', 'SpringGreen', 'MediumSpringGreen', 'LightGreen', 'PaleGreen',
    'DarkSeaGreen', 'MediumAquamarine', 'MediumSeaGreen', 'SeaGreen', 'ForestGreen', 'Green',
    'DarkGreen', 'Aqua', 'Cyan', 'LightCyan', 'PaleTurquoise', 'Aquamarine', 'Turquoise',
    'MediumTurquoise', 'DarkTurquoise', 'LightSeaGreen', 'CadetBlue', 'DarkCyan', 'Teal',
    'LightSteelBlue', 'PowderBlue', 'LightBlue', 'SkyBlue', 'LightSkyBlue', 'DeepSkyBlue',
    'DodgerBlue', 'CornflowerBlue', 'SteelBlue', 'RoyalBlue', 'Blue', 'MediumBlue', 'DarkBlue',
    'Navy', 'MidnightBlue', 'Lavender', 'Thistle', 'Plum', 'Violet', 'Orchid', 'Fuchsia',
    'Magenta', 'MediumOrchid', 'MediumPurple', 'BlueViolet', 'DarkViolet', 'DarkOrchid',
    'DarkMagenta', 'Purple', 'Indigo', 'DarkSlateBlue', 'RebeccaPurple', 'SlateBlue',
    'MediumSlateBlue', 'Snow', 'Honeydew', 'MintCream', 'Azure', 'AliceBlue', 'GhostWhite',
    'WhiteSmoke', 'Seashell', 'Beige', 'OldLace', 'FloralWhite', 'Ivory', 'AntiqueWhite',
    'Linen', 'LavenderBlush', 'MistyRose', 'LightSlateGray', 'SlateGray', 'DarkSlateGray',
    'White', '#EEE', 'Gainsboro', '#DDD', 'LightGrey', '#CCC', 'Silver', '#BBB', '#AAA',
    'DarkGray', '#999', '#888', 'Gray', '#777', 'DimGray', '#666', '#555', '#444', '#333',
    '#222', '#111', 'Black'
];

// speedColors[unit][speed] = color //-----> Default
WMECSpeeds.speedColors = {
    kmh: {
        10: '#ff6232', 20: '#ff6232', 30: '#ff6232', 40: '#f9805a', 45: '#fc9a3c', 50: '#ffad2d', 60: '#fffc28', 70: '#afff23', 80: '#09ff34', 90: '#14ff88', 100: '#0fffdf', 110: '#0ac2ff', 130: '#076aff'
    },
    mph: {
        5: '#ff6232', 10: '#ff6232', 15: '#ff6232', 20: '#f9805a', 25: '#fc9a3c', 30: '#ffad2d', 35: '#fffc28', 40: '#afff23', 45: '#09ff34', 50: '#14ff88', 55: '#0fffdf', 60: '#0ac2ff', 65: '#076aff', 70: '#0055dd', 75: '#0036db', 80: '#0b07ff', 85: '#8f07ff'
    },
    Others: '#f00'
};

const colorsUS = {
    Alabama: {},
    Alaska: {},
    Arizona: {},
    Arkansas: {},
    California: {},
    Colorado: {},
    Connecticut: {},
    Delaware: {},
    District_of_Columbia: {},
    Florida: {},
    Georgia: {},
    Hawaii: {},
    Idaho: {},
    Illinois: {},
    Indiana: {},
    Iowa: {},
    Kansas: {},
    Kentucky: {},
    Louisiana: {},
    Maine: {},
    Maryland: {},
    Massachusetts: {},
    Michigan: {},
    Minnesota: {},
    Mississippi: {},
    Missouri: {},
    Montana: {},
    Nebraska: {},
    Nevada: {},
    New_Hampshire: {},
    New_Jersey: {},
    New_Mexico: {},
    New_York: {},
    North_Carolina: {},
    North_Dakota: {},
    Ohio: {},
    Oklahoma: {},
    Oregon: {},
    Pennsylvania: {},
    Rhode_Island: {},
    South_Carolina: {},
    South_Dakota: {},
    Tennessee: {},
    Texas: {},
    Utah: {},
    Vermont: {},
    Virginia: {},
    Washington: {},
    West_Virginia: {},
    Wisconsin: {},
    Wyoming: {},
    United_States_Minor_Outlying_Islands: {},
    United_States_Virgin_Islands: {}
};

const multiplePalette = false;
const paletteByCountry = false;
let unit;
let selectedState;
let selectedCountry;

let mapLayer = [];
let toggler;
let groupToggler;

let zoom = 0;
const RoadToScan = [3, 6, 7, 4, 2, 1, 22, 20, 17, 8, 999];
// var RoadUpToStreet = [2,3,6,7];
// var highway = [3,6,7];

const typeOfRoad = {
    3: { name: 'Freeways', checked: true, zoom: 14 },
    6: { name: 'Major Highway', checked: true, zoom: 14 },
    7: { name: 'Minor Highway', checked: true, zoom: 14 },
    4: { name: 'Ramps', checked: true, zoom: 15 },
    2: { name: 'Primary Street', checked: false, zoom: 15 },
    1: { name: 'Streets', checked: false, zoom: 16 },
    22: { name: 'Narrow Streets', checked: false, zoom: 16 },
    20: { name: 'Parking Lot Road', checked: false, zoom: 16 },
    17: { name: 'Private Road', checked: false, zoom: 16 },
    8: { name: 'Off Road', checked: false, zoom: 16 },
    999: { name: 'Roundabout', checked: false, zoom: false }
};

WMECSpeeds.typeOfRoad = typeOfRoad;

const roadTypeZoomInfo = {
    3: { en: 'Freeway highlights require zoom of 14+', fr: 'Surligner les autoroutes nécessite un niveau de zoom supérieur ou égal à 14' },
    6: { en: 'Major Highway highlights require zoom of 14+', fr: 'Surligner les routes majeures nécessite un niveau de zoom supérieur ou égal à 14' },
    7: { en: 'Minor Highway highlights require zoom of 14+', fr: 'Surligner les routes mineures nécessite un niveau de zoom supérieur ou égal à 14' },
    4: { en: 'Ramp highlights require zoom of 14+', fr: 'Surligner les bretelles nécessite un niveau de zoom supérieur ou égal à 14' },
    2: { en: 'Primary Street highlights require zoom of 14+', fr: 'Surligner les rue principales nécessite un niveau de zoom supérieur ou égal à 14' },
    1: { en: 'Street highlights require zoom of 16+', fr: 'Surligner les rues nécessite un niveau de zoom supérieur ou égal à 16' },
    22: { en: 'Narrow Street highlights require zoom of 15+', fr: 'Surligner les rues étroites nécessite un niveau de zoom supérieur ou égal à 15' },
    20: { en: 'Parking Lot Road highlights require zoom of 15+', fr: 'Surligner les voies de parking nécessite un niveau de zoom supérieur ou égal à 15' },
    17: { en: 'Private Road highlights require zoom of 15+', fr: 'Surligner les voies privées nécessite un niveau de zoom supérieur ou égal à 15' },
    8: { en: 'Off Road highlights require zoom of 15+', fr: 'Surligner les chemins de terre nécessite un niveau de zoom supérieur ou égal à 15' },
    999: { en: 'Roundabouts are highlighted based on their Road Type', fr: 'Les ronds-points sont surlignés en fonction de leur type de route' }
};

//   5: "Walking Trails",
//  10: "Pedestrian Bw",
//  14: "Ferry",
//  16: "Stairway",
//  17: "Private Road",
//  18: "Railroad",
//  19: "Runway/Taxiway"
//  21: "Service Road"

// WMECSpeeds.selectedRoadType = [];
/*
const dashStyles = [
    'Solid',
    'ShortDash',
    'ShortDot',
    'ShortDashDot',
    'ShortDashDotDot',
    'Dot',
    'Dash',
    'LongDash',
    'DashDot',
    'LongDashDot',
    'LongDashDotDot'
];
*/
let CSI18n = 'en';

const CSlang = {
    1: { fr: 'Vitesses&nbsp;:', en: 'Speeds:' },
    2: { fr: 'Configuration des couleurs&nbsp;:', en: 'Color Control Panel:' },
    3: { fr: 'Couleurs&nbsp;:', en: 'Colors:' },
    4: { fr: 'Ajouter une vitesse', en: 'Add new speed' },
    5: { fr: 'Supprimer', en: 'Delete' },
    6: { fr: 'Annuler', en: 'Cancel' },
    7: { fr: 'Autres', en: 'Others' },
    8: { fr: 'Modifier', en: 'Edit' },
    9: { fr: 'Type de route', en: 'Road type' },
    10: { fr: 'Zoom', en: 'Zoom' },
    11: { fr: 'Rouge&nbsp;:', en: 'Red:' },
    12: { fr: 'Vert&nbsp;:', en: 'Green:' },
    13: { fr: 'Bleu&nbsp;:', en: 'Blue:' },
    14: { fr: 'Valider', en: 'Validate' },
    15: { fr: 'Décalage&nbsp;:', en: 'Offset:' },
    16: { fr: 'Opacité&nbsp;:', en: 'Opacity:' },
    17: { fr: 'Épaisseur&nbsp;:', en: 'Thickness:' },
    18: { fr: 'Rond-point', en: 'Roundabout' },
    19: { fr: 'Une palette par pays', en: 'One palette by country' },
    20: { fr: 'Une palette par état (USA uniquement)', en: 'One Palette by State (US only)' },
    21: { fr: 'pour', en: 'for' },
    22: { fr: 'Autoroute', en: 'Freeway' },
    23: { fr: 'Route majeure', en: 'Major Highway' },
    24: { fr: 'Route mineure', en: 'Minor Highway' },
    25: { fr: 'Bretelle', en: 'Ramps' },
    26: { fr: 'Rue principale', en: 'Primary Street' },
    27: { fr: 'Rue', en: 'Street' },
    28: { fr: 'Rue étroite', en: 'Narrow Street' },
    29: { fr: 'Voie de parking', en: 'Parking Lot Road' },
    30: { fr: 'Voie privée', en: 'Private Road' },
    31: { fr: 'Chemin de terre', en: 'Off Road' },
    32: { fr: 'Vitesses', en: 'Speeds' },
    33: { fr: 'Couleurs', en: 'Colors' },
};

WMECSpeeds.visibility = true;

const offsetValue = 3;
const opacityValue = 0.8;
const thicknessValue = 6;
let newspeedColorDialog;

// **********************
// ** HELPER FUNCTIONS **
// **********************

function log(msg, obj) {
    if (obj == null) {
        // eslint-disable-next-line camelcase, no-undef
        console.log(`${GM_info.script.name} v${currentVersion} - ${msg}`);
    } else if (debug) {
        // eslint-disable-next-line camelcase, no-undef
        console.debug(`${GM_info.script.name} v${currentVersion} - ${msg} `, obj);
    }
}

function getId(node) {
    return document.getElementById(node);
}

function getElementsByClassName(classname, node) {
    node = node || document.body;
    return Array.from(node.querySelectorAll(`.${classname}`));
}

function getFunctionWithArgs(func, args) {
    return (
        function() {
            const jsonArgs = JSON.stringify(args);
            return function() {
                args = JSON.parse(jsonArgs);
                func.apply(this, args);
            };
        }
    )();
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function cloneObj(obj) {
    const copy = JSON.parse(JSON.stringify(obj));
    return copy;
}

function Rgb2String(rgb) {
    rgb = roundDecimals(rgb);
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    // return "rgb(" + Math.round(rgb.r) +","+ Math.round(rgb.g) +","+ Math.round(rgb.b) +")";
}

function color2Rgb(c) {
    c = c.toLowerCase();

    function parseRgb(arr) {
        const rgb = {
            r: parseInt(arr[0], 10) || 0,
            g: parseInt(arr[1], 10) || 0,
            b: parseInt(arr[2], 10) || 0,
            name: null
        };
        rgb.r = Math.min(255, rgb.r);
        rgb.g = Math.min(255, rgb.g);
        rgb.b = Math.min(255, rgb.b);
        if (debug) log(`Red: ${rgb.r}, Green: ${rgb.g}, Blue: ${rgb.b}`);
        return rgb;
    }

    if (c.substr(0, 3) === 'rgb') {
        const arr = c
            .substring(3)
            .replace('(', '')
            .replace(')', '')
            .split(',')
            .map(val => val.trim());

        if (arr.length === 3 && arr.every(val => !isNaN(val))) {
            const colorrgbs = getColorArr('rgbs');
            const colornames = getColorArr('names');
            const matchIndex = colorrgbs.findIndex(color => JSON.stringify(arr) === JSON.stringify(color));

            if (matchIndex !== -1) {
                return {
                    r: arr[0],
                    g: arr[1],
                    b: arr[2],
                    name: colornames[matchIndex]
                };
            }

            return parseRgb(arr);
        }
    } else {
        let colornames = getColorArr('names');
        const matchIndex = colornames.findIndex(name => c === name.toLowerCase());

        if (matchIndex !== -1) {
            const colorrgbs = getColorArr('rgbs');
            if (debug) log(`${colornames}`);
            return {
                r: colorrgbs[matchIndex][0],
                g: colorrgbs[matchIndex][1],
                b: colorrgbs[matchIndex][2],
                name: colornames[matchIndex]
            };
        }

        c = c.replace('#', '');
        const colorHex = getColorArr('hexs');
        const hexMatchIndex = colorHex.findIndex(hex => c === hex);

        if (hexMatchIndex !== -1) {
            colornames = getColorArr('names');
            return { name: colornames[hexMatchIndex] };
        }

        if (c.length === 3) {
            c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
        }

        const arr = [
            parseInt(c.substr(0, 2), 16),
            parseInt(c.substr(2, 2), 16),
            parseInt(c.substr(4, 2), 16)
        ];
        return parseRgb(arr);
    }
    return {
        r: 0,
        g: 0,
        b: 0,
        name: null
    };
}

// eslint-disable-next-line consistent-return
function getColorArr(x) {
    if (x === 'names') {
        return ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'BlanchedAlmond',
            'Blue', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson',
            'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 'DarkGrey', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen',
            'DarkOrange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkSlateGray', 'DarkSlateGrey', 'DarkTurquoise',
            'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue', 'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia',
            'Gainsboro', 'GhostWhite', 'Gold', 'GoldenRod', 'Gray', 'Grey', 'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed', 'Indigo',
            'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan',
            'LightGoldenRodYellow', 'LightGray', 'LightGrey', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue',
            'LightSlateGray', 'LightSlateGrey', 'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen', 'Magenta', 'Maroon',
            'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen',
            'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin', 'NavajoWhite', 'Navy', 'OldLace',
            'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed',
            'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'RebeccaPurple', 'Red', 'RosyBrown', 'RoyalBlue',
            'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue', 'SlateGray', 'SlateGrey',
            'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'WhiteSmoke',
            'Yellow', 'YellowGreen'];
    }
    if (x === 'hexs') {
        return ['f0f8ff', 'faebd7', '00ffff', '7fffd4', 'f0ffff', 'f5f5dc', 'ffe4c4', '000000', 'ffebcd', '0000ff', '8a2be2', 'a52a2a', 'deb887',
            '5f9ea0', '7fff00', 'd2691e', 'ff7f50', '6495ed', 'fff8dc', 'dc143c', '00ffff', '00008b', '008b8b', 'b8860b', 'a9a9a9', 'a9a9a9', '006400',
            'bdb76b', '8b008b', '556b2f', 'ff8c00', '9932cc', '8b0000', 'e9967a', '8fbc8f', '483d8b', '2f4f4f', '2f4f4f', '00ced1', '9400d3', 'ff1493',
            '00bfff', '696969', '696969', '1e90ff', 'b22222', 'fffaf0', '228b22', 'ff00ff', 'dcdcdc', 'f8f8ff', 'ffd700', 'daa520', '808080', '808080',
            '008000', 'adff2f', 'f0fff0', 'ff69b4', 'cd5c5c', '4b0082', 'fffff0', 'f0e68c', 'e6e6fa', 'fff0f5', '7cfc00', 'fffacd', 'add8e6', 'f08080',
            'e0ffff', 'fafad2', 'd3d3d3', 'd3d3d3', '90ee90', 'ffb6c1', 'ffa07a', '20b2aa', '87cefa', '778899', '778899', 'b0c4de', 'ffffe0', '00ff00',
            '32cd32', 'faf0e6', 'ff00ff', '800000', '66cdaa', '0000cd', 'ba55d3', '9370db', '3cb371', '7b68ee', '00fa9a', '48d1cc', 'c71585', '191970',
            'f5fffa', 'ffe4e1', 'ffe4b5', 'ffdead', '000080', 'fdf5e6', '808000', '6b8e23', 'ffa500', 'ff4500', 'da70d6', 'eee8aa', '98fb98', 'afeeee',
            'db7093', 'ffefd5', 'ffdab9', 'cd853f', 'ffc0cb', 'dda0dd', 'b0e0e6', '800080', '663399', 'ff0000', 'bc8f8f', '4169e1', '8b4513', 'fa8072',
            'f4a460', '2e8b57', 'fff5ee', 'a0522d', 'c0c0c0', '87ceeb', '6a5acd', '708090', '708090', 'fffafa', '00ff7f', '4682b4', 'd2b48c', '008080',
            'd8bfd8', 'ff6347', '40e0d0', 'ee82ee', 'f5deb3', 'ffffff', 'f5f5f5', 'ffff00', '9acd32'];
    }
    if (x === 'rgbs') {
        return [[240, 248, 255], [250, 235, 215], [0, 255, 255], [127, 255, 212], [240, 255, 255], [245, 245, 220], [255, 228, 196], [0, 0, 0],
            [255, 235, 205], [0, 0, 255], [138, 43, 226], [165, 42, 42], [222, 184, 135], [95, 158, 160], [127, 255, 0], [210, 105, 30], [255, 127, 80],
            [100, 149, 237], [255, 248, 220], [220, 20, 60], [0, 255, 255], [0, 0, 139], [0, 139, 139], [184, 134, 11], [169, 169, 169], [169, 169, 169],
            [0, 100, 0], [189, 183, 107], [139, 0, 139], [85, 107, 47], [255, 140, 0], [153, 50, 204], [139, 0, 0], [233, 150, 122], [143, 188, 143],
            [72, 61, 139], [47, 79, 79], [47, 79, 79], [0, 206, 209], [148, 0, 211], [255, 20, 147], [0, 191, 255], [105, 105, 105], [105, 105, 105],
            [30, 144, 255], [178, 34, 34], [255, 250, 240], [34, 139, 34], [255, 0, 255], [220, 220, 220], [248, 248, 255], [255, 215, 0], [218, 165, 32],
            [128, 128, 128], [128, 128, 128], [0, 128, 0], [173, 255, 47], [240, 255, 240], [255, 105, 180], [205, 92, 92], [75, 0, 130], [255, 255, 240],
            [240, 230, 140], [230, 230, 250], [255, 240, 245], [124, 252, 0], [255, 250, 205], [173, 216, 230], [240, 128, 128], [224, 255, 255],
            [250, 250, 210], [211, 211, 211], [211, 211, 211], [144, 238, 144], [255, 182, 193], [255, 160, 122], [32, 178, 170], [135, 206, 250],
            [119, 136, 153], [119, 136, 153], [176, 196, 222], [255, 255, 224], [0, 255, 0], [50, 205, 50], [250, 240, 230], [255, 0, 255],
            [128, 0, 0], [102, 205, 170], [0, 0, 205], [186, 85, 211], [147, 112, 219], [60, 179, 113], [123, 104, 238], [0, 250, 154],
            [72, 209, 204], [199, 21, 133], [25, 25, 112], [245, 255, 250], [255, 228, 225], [255, 228, 181], [255, 222, 173], [0, 0, 128],
            [253, 245, 230], [128, 128, 0], [107, 142, 35], [255, 165, 0], [255, 69, 0], [218, 112, 214], [238, 232, 170], [152, 251, 152],
            [175, 238, 238], [219, 112, 147], [255, 239, 213], [255, 218, 185], [205, 133, 63], [255, 192, 203], [221, 160, 221], [176, 224, 230],
            [128, 0, 128], [102, 51, 153], [255, 0, 0], [188, 143, 143], [65, 105, 225], [139, 69, 19], [250, 128, 114], [244, 164, 96],
            [46, 139, 87], [255, 245, 238], [160, 82, 45], [192, 192, 192], [135, 206, 235], [106, 90, 205], [112, 128, 144], [112, 128, 144],
            [255, 250, 250], [0, 255, 127], [70, 130, 180], [210, 180, 140], [0, 128, 128], [216, 191, 216], [255, 99, 71], [64, 224, 208],
            [238, 130, 238], [245, 222, 179], [255, 255, 255], [245, 245, 245], [255, 255, 0], [154, 205, 50]];
    }
}
// I don't think this is needed anymore
function roundDecimals(c) {
    c.r = Math.round(c.r);
    c.g = Math.round(c.g);
    c.b = Math.round(c.b);
    return c;
}

function checkUnit() {
    // eslint-disable-next-line no-undef
    if (CSpeedsModel.isImperial) {
        unit = 'mph';
    } else {
        unit = 'kmh';
    }
    log(unit);
    if (getId('CStable')) {
        getId('CStable').innerHTML = '';
        getId('CSroadType').innerHTML = '';
        LoadSettings();
        getId('unitvalue').innerHTML = `(${unit})`;
    }
}

function createToggler() {
    // Layers switcher
    // test with script toggler----------------
    const oldTogglers = document.querySelectorAll('.togglers');
    oldTogglers.forEach((elt, idx) => {
        if (elt.id !== 'toolboxUl') {
            if (oldTogglers[idx].querySelector('.layer-switcher-group_scripts') === null) {
                const newScriptsToggler = document.createElement('li');
                newScriptsToggler.className = 'group';
                newScriptsToggler.innerHTML = '<div class="controls-container main toggler">\
                                                <input class="layer-switcher-group_scripts toggle" id="layer-switcher-group_scripts" type="checkbox">\
                                                <label for="layer-switcher-group_scripts">\
                                                <span class="label-text">Scripts</span>\
                                                </label>\
                                              </div>\
                                              <ul class="children">\
                                              </ul>';
                oldTogglers[idx].appendChild(newScriptsToggler);
            }

            const layerSwitcher = document.createElement('li');
            layerSwitcher.innerHTML = '<div class="controls-container toggler">\
                                        <input class="layer-switcher-item_WME_Color_Speeds toggle" id="layer-switcher-item_WME_Color_Speeds" type="checkbox">\
                                        <label for="layer-switcher-item_WME_Color_Speeds">\
                                          <span class="label-text">Color Speeds</span>\
                                        </label>\
                                      </div>';

            let groupScripts = document.querySelector('.layer-switcher-group_scripts').parentNode.parentNode;
            let newScriptsChildren = getElementsByClassName('children', groupScripts)[0];
            newScriptsChildren.appendChild(layerSwitcher);

            toggler = getId('layer-switcher-item_WME_Color_Speeds');
            groupToggler = getId('layer-switcher-group_scripts');
            groupToggler.checked = (typeof (localStorage.groupScriptsToggler) !== 'undefined'
                ? JSON.parse(localStorage.groupScriptsToggler) : true);

            toggler.checked = WMECSpeeds.togglerChecked;
            toggler.disabled = !groupToggler.checked;

            toggler.addEventListener('click', e => {
                mapLayer.setVisibility(e.target.checked);
                saveOption();
            });

            groupToggler.addEventListener('click', e => {
                toggler.disabled = !e.target.checked;
                mapLayer.setVisibility(toggler.checked ? e.target.checked : toggler.checked);
                localStorage.setItem('groupScriptsToggler', e.target.checked);
            });
        }
    });
}

function changelogLocalizer() {
    let changelog;
    // eslint-disable-next-line no-undef
    CSpeedI18n = I18n.locale;
    // eslint-disable-next-line no-undef
    if (CSpeedI18n === 'fr') {
        changelog = changelogFrench;
    } else {
        changelog = changelogEnglish;
    }
    return changelog;
}

function getTopCountry() {
    // eslint-disable-next-line no-undef
    return CSpeedsModel.getTopCountry();
}

function getTopState() {
    // eslint-disable-next-line no-undef
    return CSpeedsModel.getTopState();
}

function saveOption() {
    WMECSpeeds.togglerChecked = getId('layer-switcher-item_WME_Color_Speeds').checked;
    localStorage.setItem('WMEColorSpeeds', JSON.stringify(WMECSpeeds));
}
function destroyTab() {
    W.userscripts.removeSidebarTab('ColorSpeeds');
    if (debug) log('Sidebar tab removed');
}

// *************
// **  INIT   **
// *************
function counterStart() {
    loadStartTime = performance.now();
    bootstrap();
}

function bootstrap() {
    scriptStartTime = performance.now();
    // eslint-disable-next-line no-undef
    if (WazeWrap?.Ready && W?.userscripts?.state.isReady) {
        log('Starting');
        init();
    } else {
        if (debug) log('WME and WW not ready');
        setTimeout(bootstrap, 500);
    }
}

function showScriptInfoAlert() {
    WazeWrap.Interface.ShowScriptUpdate(
        // eslint-disable-next-line camelcase
        GM_info.script.name,
        // eslint-disable-next-line camelcase
        GM_info.script.version,
        changelogLocalizer(),
        greasyForkUrl,
        forumUrl
    );
}

function loadScriptUpdateMonitor() {
    try {
        const updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(scriptName, currentVersion, downloadUrl, GM_xmlhttpRequest);
        if (debug) log('Checked for update');
        updateMonitor.start();
    } catch (ex) {
        // Report the error, but not a critical failure.
        console.error(scriptName, ex);
    }
}

function init() {
    loadScriptUpdateMonitor();
    showScriptInfoAlert();
    // Waze object needed
    // eslint-disable-next-line no-undef
    CSpeedsWaze = unsafeWindow.W;
    if (typeof (CSpeedsWaze) === 'undefined') {
        if (debug) { console.error('WME ColorSpeeds - CSpeedsWaze : NOK'); }
        window.setTimeout(init, 500);
        return;
    }
    // eslint-disable-next-line no-undef
    CSpeedsMap = CSpeedsWaze.map;
    if (typeof (CSpeedsMap) === 'undefined') {
        if (debug) { console.error('WME ColorSpeeds - CSpeedsmap : NOK'); }
        window.setTimeout(init, 500);
        return;
    }
    // eslint-disable-next-line no-undef
    CSpeedsModel = CSpeedsWaze.model;
    if (typeof (CSpeedsModel) === 'undefined') {
        if (debug) { console.error('WME ColorSpeeds - CSpeedsModel DOM : NOK'); }
        window.setTimeout(init, 500);
        return;
    }

    // eslint-disable-next-line no-undef
    CSpeedsCountries = CSpeedsModel.countries;
    if (typeof (CSpeedsCountries) === 'undefined') {
        if (debug) { console.error('WME ColorSpeeds - CSpeedsCountries DOM : NOK'); }
        window.setTimeout(init, 500);
        return;
    }
    CSpeedsTopCountries = getTopCountry();
    if (typeof (CSpeedsTopCountries) === 'undefined' || getTopCountry() === null) {
        if (debug) { console.error('WME ColorSpeeds - CSpeedsCountries.top DOM : NOK'); }
        window.setTimeout(init, 500);
        return;
    }
    if (typeof (getTopCountry().attributes.name) === 'undefined') {
        if (debug) { console.error('WME ColorSpeeds - CSpeedsCountries.top.name DOM : NOK'); }
        window.setTimeout(init, 500);
        return;
    }
    //    OpenLayers
    CSpeedOpenLayers = unsafeWindow.OpenLayers;
    if (typeof (CSpeedOpenLayers) === 'undefined') {
        if (debug) { console.error('WME ColorSpeeds - OpenLayers : NOK'); }
        window.setTimeout(init, 500);
        return;
    }
    //    Traductions
    CSpeedI18n = I18n.locale;
    if (typeof(CSpeedI18n) === 'undefined') {
        if (debug) { console.error('WME ColorSpeeds - CSpeedI18n : NOK'); }
        setTimeout(init, 500);
        return;
    }

    // Verify localStorage. Init if empty or not correct
    if (typeof (localStorage.WMEColorSpeeds) !== 'undefined' && IsJsonString(localStorage.getItem('WMEColorSpeeds'))) {
        WMECSpeeds = JSON.parse(localStorage.WMEColorSpeeds);
        if (WMECSpeeds.speedColors.Others === undefined) WMECSpeeds.speedColors.Others = '#f00';
        if (WMECSpeeds.speedColors.US === undefined) WMECSpeeds.speedColors.US = cloneObj(colorsUS);
        if (WMECSpeeds.speedColors.Countries === undefined) WMECSpeeds.speedColors.Countries = {};
        if (WMECSpeeds.multiplePalette === undefined) WMECSpeeds.multiplePalette = multiplePalette;
        if (WMECSpeeds.PaletteByCountrie === undefined) WMECSpeeds.PaletteByCountrie = paletteByCountry;
        if (WMECSpeeds.offsetValue === undefined) WMECSpeeds.offsetValue = offsetValue;
        if (WMECSpeeds.opacityValue === undefined) WMECSpeeds.opacityValue = opacityValue;
        if (WMECSpeeds.thicknessValue === undefined) WMECSpeeds.thicknessValue = thicknessValue;
        for (const key in typeOfRoad) {
            if (WMECSpeeds.typeOfRoad.hasOwnProperty(key) === false ) {
                WMECSpeeds.typeOfRoad[key] = cloneObj(typeOfRoad[key]);
            }
        }
        if (WMECSpeeds.togglerChecked === undefined) WMECSpeeds.togglerChecked = WMECSpeeds.visibility;
        /* this if statement is no longer needed with WW
        if (WMECSpeeds.version === undefined) {
            oldScriptVersion = 0;
        } else if (WMECSpeeds.version !== undefined) {
            oldScriptVersion = WMECSpeeds.version;
        }
        */
        WMECSpeeds.MultiplePalette = (getTopCountry().attributes.name === 'United States') ? WMECSpeeds.MultiplePalette : false;
        //        WMECSpeeds.MultiplePalette = (CSpeedsCountries.top.name == "United States")? WMECSpeeds.MultiplePalette : false;

        log('Init ok');
        log('WMECSpeeds = ', WMECSpeeds);
    } else {
        localStorage.setItem('WMEColorSpeeds', JSON.stringify(WMECSpeeds));
        setTimeout(init, 500);
        return;
    }
    // ======================================================

    // Translation
    if (CSpeedI18n === 'fr') {
        CSI18n = CSpeedI18n;
    } else CSI18n = 'en';

    // ======================================================

    checkUnit();

    // WME Layers check
    let layers = CSpeedsMap.getLayersBy('uniqueName', 'WME_Color_Speeds');
    if (layers.length === 0) {
        I18n.translations[CSpeedI18n].layers.name['WME_Color_Speeds'] = 'Color Speeds';

        const colorspeedsStyle = new CSpeedOpenLayers.Style({
            pointRadius: 2,
            fontWeight: 'normal',
            label: '${labelText}',
            fontFamily: 'Tahoma, Courier New',
            labelOutlineColor: '#FFFFFF',
            labelOutlineWidth: 2,
            fontColor: '#000000',
            fontSize: '10px'
        });

        mapLayer = new CSpeedOpenLayers.Layer.Vector(I18n.t('layers.name.WME_Color_Speeds'), {
            displayInLayerSwitcher: true,
            uniqueName: 'WME_Color_Speeds',
            styleMap: new CSpeedOpenLayers.StyleMap(colorspeedsStyle)
        });

        CSpeedsMap.addUniqueLayer(mapLayer);
        mapLayer.setVisibility(WMECSpeeds.visibility);
    }

    createToggler();

    // MTE mode event
    /*
      W.app.modeController.model.bind('change:mode', function(){
      if (W.app.modeController.getState() !== undefined){
        eventUnRegister();
        try { colorspeeds_mapLayer.destroyFeatures();
        }catch(err){log('err destroyFeatures: ',err);}
      }
      if (W.app.modeController.getState() === undefined){
        eventUnRegister();
        createToggler();
        CSpeeds_css();
      }
    });
    */
    // reload after changing WME units
    W.prefs.on('change:isImperial', () => {
        destroyTab();
        eventUnRegister();
        checkUnit();
        createToggler();
        createCSS();
    });

    // log('colorspeeds_mapLayer ',colorspeeds_mapLayer);

    // Then running
    createCSS();
}

function createCSS() {
    let CSpeedsCSS = getId('CSpeedsCSS');
    if (CSpeedsCSS === null) {
        CSpeedsCSS = document.createElement('style');
        CSpeedsCSS.type = 'text/css';
        CSpeedsCSS.id = 'CSpeedsCSS';
    }

    let css = '.CScontent {width:255px; margin-left:10px; box-shadow: 0 4px 10px #aaa;}';
    css += '.divStateChoise {width:250px; margin-left:10px; color:#59899e; font-weight:bold; vertical-align: middle;}';
    css += '.divHeadline {height:26px; font-weight:bold; padding-top:2px; border:2px solid #3d3d3d; background-color:#BEDCE5;}';
    css += '.divContent {clear:both;height:26px; border:2px solid #3d3d3d; border-top:0;}';
    css += '.divContentZoom { clear:both; height:26px; border:2px solid #3d3d3d; border-top:0;}';
    css += '.divc {float:center; text-align:center;}';
    css += '.divl {float:left; text-align:center;}';
    css += '.divll {float:left; text-align:left;}';
    css += '.divr {float:right; text-align:center;}';
    css += '.speed {margin-top:2px; width:65px; height:20px; color:#59899e; font-weight:bold; vertical-align: middle;}';
    css += '.divcolor { width:80px; height:17px; margin:4px 0 0 0; vertical-align: middle;}';
    css += '.CStype {margin-top:2px; margin-left:10px; height:20px; color:#59899e; font-weight:bold; text-align:left; vertical-align: middle;}';
    css += '.CScheckLabel {margin-top:5px; margin-left:10px; height:22px; color:#59899e; font-weight:bold; text-align:left; vertical-align: middle;}';
    css += '.CScheck { float:left; width:22px; height:22px;}';
    css += '.CSzoom {margin-top:2px; height:20px; color:#59899e; font-weight:bold; vertical-align: middle}';
    css += '#newspeed {width:65px; height:26px; font-weight:bold;text-align:center;}';
    css += '#editzoom { display:none;}';
    css += '#newvalzoom {width:45px; height:24px; font-weight:bold;text-align:center;}';
    css += '.CScontentConf {width:280px; margin-left:5px;}';
    css += '.divContentConf {clear:both; line-height:24px; height:28px;}';
    css += '.valColor {color:#59899e; font-weight:bold;}';
    css += '#valRed {width:80px; height:28px; font-weight:bold; color:red;text-align:center;}';
    css += '#valGreen {width:80px; height:28px; font-weight:bold; color:green;text-align:center;}';
    css += '#valBlue {width:80px; height:28px; font-weight:bold; color:blue;text-align:center;}';
    css += '#valOffset {width:80px; height:28px; font-weight:bold;text-align:center;}';
    css += '#valOpacity {width:80px; height:28px; font-weight:bold;text-align:center;}';
    css += '#valThickness {width:80px; height:28px; font-weight:bold;text-align:center;}';
    css += '#ConfColor.dropdown-menu li:hover, #ConfColor+.dropdown-menu li:active, #ConfColor+.dropdown-menu li:focus { cursor: pointer; outline: #3B99FC dotted 1px; }';
    css += '#ConfColor.btn { box-shadow: inset 0px -1px 0px rgba(0,0,0,0.2); border-radius: 4px; border: 1px solid rgba(0,0,0,0.25); height:22px; width:90px; }';
    css += '#nameColor {width:120px; height:22px;}';
    // css +="#ConfDash.dropdown-menu li:hover, #ConfDash+.dropdown-menu li:active, #ConfDash+.dropdown-menu li:focus { cursor: pointer; outline: #3B99FC dotted 1px; }";
    // css +="#ConfDash.btn { box-shadow: inset 0px -1px 0px rgba(0,0,0,0.2); border-radius: 4px; border: 1px solid rgba(0,0,0,0.25); height:22px; width:90px; }";
    CSpeedsCSS.innerHTML = css;
    document.body.appendChild(CSpeedsCSS);
    createTab();
}

function createNewSpeedColorDialog() {
    newspeedColorDialog = getId('newspeedColorDialog');
    if (newspeedColorDialog === null) {
        newspeedColorDialog = document.createElement('div');
        newspeedColorDialog.id = 'newspeedColorDialog';
    }

    // newspeedColorDialog.style.fontSize = '90%';
    newspeedColorDialog.style.display = 'none';
    newspeedColorDialog.style.top = '10px';
    // newspeedColorDialog.style.left = '15px';
    newspeedColorDialog.style.width = '300px';
    newspeedColorDialog.style.height = '500px';
    newspeedColorDialog.style.margin = '10px 10px 10px 0px';
    newspeedColorDialog.style.borderRadius = '10px';
    newspeedColorDialog.style.border = '1px solid #BEDCE5';
    newspeedColorDialog.style.position = 'relative';
    newspeedColorDialog.style.padding = '5px';
    newspeedColorDialog.style.overflow = 'auto';
    newspeedColorDialog.style.background = 'rgba(255, 255, 255, 1)';

    let content = "<div style='clear:both;'></div>";
    content += `<div class='divc' style='width:200px; font-weight:bold;'>${CSlang[2][CSI18n]}</div>`;
    content += "<div style='clear:both; padding-top:10px;'></div>";

    // header table
    content += "<div class='CScontentConf'>";

    // Edit other color
    content += "<div class='divContentConf' id='Conf_Others' style='display:none;'>";
    content += `<div class='divll' style='width:70px;font-weight:bold;'>${CSlang[1][CSI18n]} </div>`;
    content += `<div class='divll' style='width:60px;font-weight:bold;'>${CSlang[7][CSI18n]}</div>`;
    content += "<div class='divl' style='width:45px;'>&nbsp;</div>";
    content += "<div style='clear:both; padding-top:10px;'></div>";
    content += `<div class='divll' style='width:70px;font-weight:bold;'>${CSlang[3][CSI18n]}: </div>`;
    content += '</div>';

    // Edit speed color
    content += "<div class='divContentConf' id='Conf_Color' style='display:none;'>";
    content += `<div class='divll' style='width:75px;font-weight:bold;'>${CSlang[1][CSI18n]} </div>`;
    content += "<div class='divll speed' style='width:60px;'><input type='text' value='' id='newspeed'/></div>";
    content += `<div class='divl' id='unitvalue' style='width:45px;font-size:11px;font-weight:bold;line-height:20px;'>(${unit})</div>`;
    content += "<div style='clear:both; padding-top:10px;'></div>";
    content += `<div class='divll' style='width:75px;font-weight:bold;'>${CSlang[3][CSI18n]} </div>`;
    content += '</div>';

    content += `<div class='divl dropdown' style='width:90px; text-align:left;'><button id='ConfColor' class='btn dropdown-toggle' style='background-color:${WMECSpeeds.speedColors.Others};' type='button' data-toggle='dropdown'></button><ul class='dropdown-menu' style='height: 400px; overflow: auto; margin: 0; padding: 0; min-width: 90px;'>`;
    for (let i = 0; colors[i]; ++i) {
        let test = (colors[i].match(/\(/)) ? true : false;
        switch (test) {
            case true:
                content += "<li style='background-color:rgb" + colors[i] + "'>&nbsp;</li>";
                break;
            case false:
                content += "<li style='background-color:" + colors[i] + "'>&nbsp;</li>";
                break;
        }
    }
    content += '</ul></div>';
    content += "<span class='divl valColor' id=nameColor></span>";
    content += '</div>';
    content += "<div style='clear:both; padding-top:10px;'></div>";

    // Red Value
    content += "<div class='CScontentConf'>";
    content += "<div class='divContentConf'>";
    content += `<div class='divll' style='width:60px;font-weight:bold; color:red;'>${CSlang[11][CSI18n]}</div>`;
    content += "<div style='clear:both; padding-top:2px;'></div>";
    content += "<div class='divl valColor' style='width:80px; height:28px;'><input type='number' max='255' min='0' value='' id='valRed' pattern='[0-9]{3}' /></div>";
    content += "<div class='divr'><input id='sliderRed' type='range' max='255' min='0' style='width:180px;height:24px;'></div>";
    content += '</div>';

    // Green Value
    content += "<div style='clear:both; padding-top:10px;'></div>";
    content += "<div class='divContentConf'>";
    content += `<div class='divll' style='width:60px;font-weight:bold; color:green;'>${CSlang[12][CSI18n]}</div>`;
    content += "<div style='clear:both; padding-top:2px;'></div>";
    content += "<div class='divl valColor' style='width:80px; height:28px;'><input type='number' max='255' min='0' value='' id='valGreen' pattern='[0-9]{3}' /></div>";
    content += "<div class='divr'><input id='sliderGreen' type='range' max='255' min='0' style='width:180px;height:24px;'></div>";
    content += '</div>';
    content += "<div style='clear:both; padding-top:10px;'></div>";

    // Bleu Value
    content += "<div class='divContentConf'>";
    content += `<div class='divll' style='width:60px;font-weight:bold; color:blue;'>${CSlang[13][CSI18n]}</div>`;
    content += "<div style='clear:both; padding-top:2px;'></div>";
    content += "<div class='divl valColor' style='width:80px; height:28px;'><input type='number' max='255' min='0' value='' id='valBlue' pattern='[0-9]{3}' /></div>";
    content += "<div class='divr'><input id='sliderBlue' type='range' max='255' min='0' style='width:180px;height:24px;'></div>";
    content += '</div>';

    content += "<div style='clear:both; padding-top:10px;'></div>";
    content += `<div class='divr' style='width:40px; height:40x'><a href='#'><img id='cancel' style='width:20px;' title='${CSlang[6][CSI18n]}' src='data:image/png;base64,${iconUndo}' /></a></div>`;
    content += `<div class='divr' style='width:40px; height:40x;'><a href='#'><img id='submit' style='width:20px;' title='${CSlang[14][CSI18n]}' src='data:image/png;base64,${iconSubmit}' /></a></div>`;
    // content += "<div class='divc' style='width:270px; font-weight:bold;'><button id='OkButton'>Ok</button></div>";
    content += '</div>';

    newspeedColorDialog.innerHTML = content;
    // document.body.appendChild(newspeedColorDialog);
    // CSpeedshandleClass2.appendChild(newspeedColorDialog);
    getId('tab-colorspeeds').appendChild(newspeedColorDialog);
}

// *************
// **  HTML   **
// *************

async function createTab() {
    const { tabLabel, tabPane } = W.userscripts.registerSidebarTab('ColorSpeeds');
    if (debug) log('Starting tab creation');
    const labelText = $('<div>').append(
        $('<span>', {
            id: 'cspeedstablabel',
            class: 'fa fa-dashboard',
            title: `${CSlang[32][CSI18n]}`
        })
    ).html();

    tabLabel.innerHTML = labelText;

    // colorspeeds header
    let content = `<div style='float:left; margin-left:5px;'><b><a href='https://greasyfork.org/scripts/14044-wme-color-speeds' target='_blank'><u>WME Color Speeds</u></a></b> v${currentVersion}</div>`;
    content += "<div id='colorspeedsDiv'>";

    // Countries pallete
    content += "<div style='clear:both; padding-top:10px;'></div>";
    content += `<div class='divStateChoise' id='countrieChoise' style='display:block;'><input type='checkbox' class='CScheck' id='cbPaletteByCountrie'><div class='divl CScheckLabel' style='width:210px;'>${CSlang[19][CSI18n]}</div>`;
    content += "<div style='clear:both; padding-top:10px;'></div>"; // Couleurs pour </div>";
    content += "<select id='selectCountrie' style='height:22px; width:250px; active:none;'>";
    Object.keys(WMECSpeeds.speedColors.Countries).forEach(countrie => {
        content += `<option value='${countrie}'>${countrie.replace(/_/g, ' ')}</option>`;
    });
    content += '</select></div>';

    // Mutiple pallete
    content += "<div style='clear:both; padding-top:10px;'></div>";
    content += `<div class='divStateChoise' id='stateChoise' style='display:block;'><input type='checkbox' class='CScheck' id='cbMultiplePalette'><div class='divl CScheckLabel' style='width:210px;'>${CSlang[20][CSI18n]}</div>`;
    content += "<div style='clear:both; padding-top:20px;'></div>"; // Couleurs pour </div>";
    content += "<select id='selectState' style='height:22px; active:none;'>";
    Object.keys(WMECSpeeds.speedColors.US).forEach(state => {
        content += `<option value='${state}'>${state.replace(/_/g, ' ')}</option>`;
    });
    content += '</select></div>';

    // Speed table header
    content += "<div style='clear: both; padding-top:10px;'></div><div class='CScontent'>";
    content += `<div class='divHeadline'><div class='divl' style='width:60px;'>${CSlang[32][CSI18n]}</div><div class='divr' id='unitvalue' style='width:45px;font-size:11px;line-height:20px;'>(${unit})</div><div class='divr' style='width:130px;'>${CSlang[33][CSI18n]}</div></div>`;

    // Speed table
    content += `<div class='divContent'><div class='divl speed' style='width:60px;'>${CSlang[7][CSI18n]}</div>`;
    content += "<div class='divr' style='width:20px;'>&nbsp;</div>";
    content += `<div class='divr' style='width:20px;'><a href='#'><img id='edit_others' style='width:16px;' title='${CSlang[8][CSI18n]}' src='data:image/png;base64,${iconEdit}' /></a></div>`;
    content += `<div class='divr' style='width:120px;'><div id='color_others' class='divcolor' style='background-color:${WMECSpeeds.speedColors.Others};'>&nbsp;</div></div></div>`;
    content += "<div id='CStable'></div></div><div id='divadd'></div>";

    // Road type header
    content += "<br><div style='clear:both; padding-top:10px;'></div><div class='CScontent'>";
    content += `<div class='divHeadline'><div class='divl' style='width:120px;'>${CSlang[9][CSI18n]}</div><div class='divr' style='width:60px; margin-right:20px;'>${CSlang[10][CSI18n]}</div></div>`;
    // edit zoom
    content += "<div class='divContent' id='editzoom'><div class='divl speed' style='width:110px;'><span id='texttype'></span></div>";
    content += `<div class='divr' style='width:20px;'><a href='#'><img id='cancelZoom' style='width:20px;' title='${CSlang[6][CSI18n]}' src='data:image/png;base64,${iconUndo}' /></a></div>`;
    content += `<div class='divr' style='width:20px;'><a href='#'><img id='submitZoom' style='width:20px;' title='${CSlang[14][CSI18n]}' src='data:image/png;base64,${iconSubmit}' /></a></div>`;
    content += "<div class='divr speed' style='width:60px;'><input type='text' value='' id='newvalzoom'/></div>";
    content += '</div>';
    content += "<div id='CSroadType'></div></div>";

    // Offset Value
    content += "<br><div style='clear:both; padding-top:10px;'></div>";
    content += "<div class='divContentConf'>";
    content += `<div class='divll' style='width:65px;font-weight:bold;color:#59899e;'>${CSlang[15][CSI18n]}</div>`;
    content += "<div style='clear:both; padding-top:2px;'></div>";
    content += "<div class='divl valColor' style='width:80px; height:28px;'><input type='number' id='valOffset' min='1' max='10' value='' pattern='[0-9]{2}'/></div>";
    content += "<div class='divr'><input id='sliderOffset' type='range' max='10' min='1' step='1' style='width:180px;height:24px;margin-right:20px;'></div>";
    content += '</div>';

    // Opacity Value
    content += "<div style='clear:both; padding-top:10px;'></div>";
    content += "<div class='divContentConf'>";
    content += `<div class='divll' style='width:65px;font-weight:bold;color:#59899e;'>${CSlang[16][CSI18n]}</div>`;
    content += "<div style='clear:both; padding-top:2px;'></div>";
    content += "<div class='divl valColor' style='width:80px; height:28px;'><input type='number' id='valOpacity' min='20' max='100' value='' pattern='[0-9]{3}'/></div>";
    content += "<div class='divr'><input id='sliderOpacity' type='range' max='100' min='20'  step='1' style='width:180px;height:24px;margin-right:20px;'></div>";
    content += '</div>';

    // Thickness Value
    content += "<div style='clear:both; padding-top:10px;'></div>";
    content += "<div class='divContentConf'>";
    content += `<div class='divll' style='width:65px;font-weight:bold;color:#59899e;'>${CSlang[17][CSI18n]}</div>`;
    content += "<div style='clear:both; padding-top:2px;'></div>";
    content += "<div class='divl valColor' style='width:80px; height:28px;'><input type='number' id='valThickness' min='2' max='10' value='' pattern='[0-9]{2}'/></div>";
    content += "<div class='divr'><input id='sliderThickness' type='range' max='10' min='2' step='1' style='width:180px;height:24px;margin-right:20px;'></div>";
    content += '</div>';

    /*
    // 2023-09-26 SS28 I haven't taken the time to see what is wrong here. Maybe we can resurrect it
    // Dash Style
    content += "<div class='divContentConf'>";
    content += "<div style='clear:both; padding-top:10px;'></div>";
    content += "<div class='divll' style='width:140px;font-weight:bold;color:#59899e;'>Dash Style:</div>";
    content += "<div class='divl dropdown' style='width:90px; text-align:left;'><button id='ConfDash' class='btn dropdown-toggle' style='background-color:rgb(255,255,255);' type='button' data-toggle='dropdown'></button><ul class='dropdown-menu' style='height: 400px; overflow: scroll; margin: 0; padding: 0; min-width: 90px;'>";
    for (let i = 0; i <= dashStyles.length; ++i) {
        content += `<li>&nbsp;${dashStyles[i]}&nbsp;</li>`;
    }
    content += '</ul></div>';
    content += '</div>';
    */

    tabPane.innerHTML = content;
    tabPane.id = 'tab-colorspeeds';

    // Fix tab content div spacing.
    // $(tabPane).parent().css({ width: 'auto', padding: '4px' });

    await W.userscripts.waitForElementConnected(tabPane);
    if (debug) log('Tab loaded');

    createNewSpeedColorDialog();

    getId('divadd').innerHTML += (`<br/><center><input type='button' id='addbutton' name='add' value='${CSlang[4][CSI18n]}' /></center>`);

    getId('addbutton').onclick = (() => {
        getId('Conf_Others').style.display = 'none';
        getId('Conf_Color').style.display = 'block';
        getId('colorspeedsDiv').style.display = 'none';
        getId('newspeed').value = '';
        getId('ConfColor').style.backgroundColor = '#fff';
        newspeedColorDialog.style.display = 'block';
        let c = getId('ConfColor').style.backgroundColor;
        c = color2Rgb(c);
        actualiseColorRGB(c);
    });

    if (debug) log(`Country = ${getTopCountry().attributes.name}`);

    getId('cbPaletteByCountrie').checked = WMECSpeeds.PaletteByCountrie;
    getId('selectCountrie').style.display = (WMECSpeeds.PaletteByCountrie) ? 'block' : 'none';

    getId('stateChoise').style.display = (getTopCountry().attributes.name === 'United States') ? 'block' : 'none';

    if (WMECSpeeds.MultiplePalette === true) {
        let index = 0;
        const stateToSelect = getTopState().attributes.name.replace(/ /g, '_');
        for (index; getId('selectState').options[index].value !== stateToSelect; index++) { /* empty */ }
        getId('selectState').options[index].selected = true;
    }

    getId('valOffset').value = WMECSpeeds.offsetValue;
    getId('sliderOffset').value = WMECSpeeds.offsetValue;

    getId('valOpacity').value = Number(WMECSpeeds.opacityValue * 100).toFixed(0);
    getId('sliderOpacity').value = Number(WMECSpeeds.opacityValue * 100).toFixed(0);

    getId('valThickness').value = WMECSpeeds.thicknessValue;
    getId('sliderThickness').value = WMECSpeeds.thicknessValue;

    LoadSettings();

    eventRegister();

    SCColor();
}

function eventRegister() {
    CSpeedsWaze.selectionManager.events.register('selectionchanged', null, SCColor);
    CSpeedsModel.actionManager.events.register('afterclearactions', null, SCColor);
    CSpeedsModel.actionManager.events.register('afterundoaction', null, SCColor);
    CSpeedsMap.olMap.events.register('zoomend', null, SCColor);
    CSpeedsMap.olMap.events.register('moveend', null, SCColor);

    CSpeedsModel.events.register('mergeend', null, SCColor);
    window.addEventListener('beforeunload', saveOption, false);
}

function eventUnRegister() {
    CSpeedsWaze.selectionManager.events.unregister('selectionchanged', null, SCColor);
    CSpeedsModel.actionManager.events.unregister('afterclearactions', null, SCColor);
    CSpeedsModel.actionManager.events.unregister('afterundoaction', null, SCColor);
    CSpeedsMap.olMap.events.unregister('zoomend', null, SCColor);
    CSpeedsMap.olMap.events.unregister('moveend', null, SCColor);
    CSpeedsModel.events.unregister('mergeend', null, SCColor);
    window.removeEventListener('beforeunload', saveOption, false);
}

function LoadSettings() {
    getId('cbPaletteByCountrie').checked = WMECSpeeds.PaletteByCountrie;
    getId('selectCountrie').style.display = (WMECSpeeds.PaletteByCountrie) ? 'block' : 'none';

    getId('cbMultiplePalette').checked = WMECSpeeds.MultiplePalette;
    getId('selectState').style.display = (WMECSpeeds.MultiplePalette) ? 'block' : 'none';

    if (WMECSpeeds.MultiplePalette === false && WMECSpeeds.PaletteByCountrie === false) {
        Object.keys(WMECSpeeds.speedColors[unit]).forEach(valSpeed => {
            const color = WMECSpeeds.speedColors[unit][valSpeed];
            const div = document.createElement('div');
            div.className = 'divContent';

            const divspeed = document.createElement('div');
            divspeed.className = 'divl speed';
            divspeed.style.width = '60px';
            divspeed.innerHTML = valSpeed;
            div.appendChild(divspeed);

            const divsuppr = document.createElement('div');
            divsuppr.className = 'divr';
            divsuppr.style.width = '20px';

            const divsuppra = document.createElement('a');
            divsuppra.innerHTML = `<img style='width:20px;' title='${CSlang[5][CSI18n]}' src='data:image/png;base64,${iconDelete}' />`;
            divsuppra.href = '#';
            divsuppra.className = 'delSpeed';
            divsuppra.id = `delSpeed_${valSpeed}`;
            divsuppr.appendChild(divsuppra);
            div.appendChild(divsuppr);

            const divedit = document.createElement('div');
            divedit.className = 'divr';
            divedit.style.width = '20px';

            const divedita = document.createElement('a');
            divedita.innerHTML = `<img style='width:16px;' title='${CSlang[8][CSI18n]}' src='data:image/png;base64,${iconEdit}' />`;
            divedita.href = '#';
            divedita.onclick = getFunctionWithArgs(CSModifCouleur, [unit, valSpeed, color, null]);
            divedit.appendChild(divedita);
            div.appendChild(divedit);

            const divcolor = document.createElement('div');
            divcolor.className = 'divr';
            divcolor.style.width = '120px';
            divcolor.innerHTML = `<div class='divcolor' style='background-color:${color};'>&nbsp;</div>`;
            div.appendChild(divcolor);

            getId('CStable').appendChild(div);
        });

    // log("LoadSettings WMECSpeeds.speedColors."+unit+" = ",WMECSpeeds.speedColors[unit]);
    }
    if (WMECSpeeds.MultiplePalette === true && WMECSpeeds.PaletteByCountrie === false) {
        selectedState = getId('selectState').options[getId('selectState').selectedIndex].value;
        if (debug) log('selectedState = ', selectedState);

        if (WMECSpeeds.speedColors.US[selectedState][unit] === undefined) {
            WMECSpeeds.speedColors.US[selectedState][unit] = cloneObj(WMECSpeeds.speedColors[unit]);
        }

        Object.keys(WMECSpeeds.speedColors.US[selectedState][unit]).forEach(valSpeed => {
            const color = WMECSpeeds.speedColors.US[selectedState][unit][valSpeed];
            const div = document.createElement('div'); div.className = 'divContent';
            const divspeed = document.createElement('div'); divspeed.className = 'divl speed'; divspeed.style.width = '60px'; divspeed.innerHTML = valSpeed;
            div.appendChild(divspeed);

            const divsuppr = document.createElement('div'); divsuppr.className = 'divr'; divsuppr.style.width = '20px';
            const divsuppra = document.createElement('a');
            divsuppra.innerHTML = `<img style='width:20px;' title='${CSlang[5][CSI18n]}' src='data:image/png;base64,${iconDelete}' />`;
            divsuppra.href = '#'; divsuppra.className = 'delSpeed'; divsuppra.id = `delSpeed_${valSpeed}`;
            divsuppr.appendChild(divsuppra);
            div.appendChild(divsuppr);

            const divedit = document.createElement('div'); divedit.className = 'divr'; divedit.style.width = '20px';
            const divedita = document.createElement('a');
            divedita.innerHTML = `<img style='width:16px;' title='${CSlang[8][CSI18n]}' src='data:image/png;base64,${iconEdit}' />`;
            divedita.href = '#';
            divedita.onclick = getFunctionWithArgs(CSModifCouleur, [unit, valSpeed, color, selectedState]);
            divedit.appendChild(divedita);
            div.appendChild(divedit);

            const divcolor = document.createElement('div'); divcolor.className = 'divr'; divcolor.style.width = '120px';
            divcolor.innerHTML = `<div class='divcolor' style='background-color:${color};'>&nbsp;</div>`;
            div.appendChild(divcolor);
            getId('CStable').appendChild(div);
        });
        if (debug) log(`LoadSettings WMECSpeeds.speedColors.US.${selectedState}.${unit} = `, WMECSpeeds.speedColors.US[selectedState][unit]);
    }

    if (WMECSpeeds.PaletteByCountrie === true && WMECSpeeds.MultiplePalette === false) {
        if (getId('selectCountrie').options[getId('selectCountrie').selectedIndex] !== undefined) {
            selectedCountry = getId('selectCountrie').options[getId('selectCountrie').selectedIndex].value;
        } else selectedCountry = getTopCountry().attributes.name.replace(/ /g, '_');

        log('selectCountrie = ', selectedCountry);

        if (WMECSpeeds.speedColors.Countries[selectedCountry] === undefined || WMECSpeeds.speedColors.Countries[selectedCountry][unit] === undefined) {
            WMECSpeeds.speedColors.Countries[selectedCountry] = {};
            WMECSpeeds.speedColors.Countries[selectedCountry][unit] = cloneObj(WMECSpeeds.speedColors[unit]);
            updateCountrieList();
            // log("LoadSettings création WMECSpeeds.speedColors.Countries."+selectedCountrie+"."+unit+" = ",WMECSpeeds.speedColors.Countries[selectedCountrie][unit]);
        }

        Object.keys(WMECSpeeds.speedColors.Countries[selectedCountry][unit]).forEach(valSpeed => {
            const color = WMECSpeeds.speedColors.Countries[selectedCountry][unit][valSpeed];
            const div = document.createElement('div'); div.className = 'divContent';
            const divspeed = document.createElement('div'); divspeed.className = 'divl speed'; divspeed.style.width = '60px'; divspeed.innerHTML = valSpeed;
            div.appendChild(divspeed);

            const divsuppr = document.createElement('div'); divsuppr.className = 'divr'; divsuppr.style.width = '20px';
            const divsuppra = document.createElement('a');

            divsuppra.innerHTML = `<img style='width:20px;' title='${CSlang[5][CSI18n]}' src='data:image/png;base64,${iconDelete}' />`;
            divsuppra.href = '#'; divsuppra.className = 'delSpeed'; divsuppra.id = `delSpeed_${valSpeed}`;
            divsuppr.appendChild(divsuppra);
            div.appendChild(divsuppr);

            const divedit = document.createElement('div'); divedit.className = 'divr'; divedit.style.width = '20px';
            const divedita = document.createElement('a');
            divedita.innerHTML = `<img style='width:16px;' title='${CSlang[8][CSI18n]}' src='data:image/png;base64,${iconEdit}' />`;
            divedita.href = '#';
            divedita.onclick = getFunctionWithArgs(CSModifCouleur, [unit, valSpeed, color, selectedCountry]);
            divedit.appendChild(divedita);
            div.appendChild(divedit);

            const divcolor = document.createElement('div'); divcolor.className = 'divr'; divcolor.style.width = '120px';
            divcolor.innerHTML = `<div class='divcolor' style='background-color:${color};'>&nbsp;</div>`;
            div.appendChild(divcolor);
            getId('CStable').appendChild(div);
        });

        // log("LoadSettings WMECSpeeds.speedColors.Countries."+selectedCountrie+"."+unit+" = ",WMECSpeeds.speedColors.Countries[selectedCountrie][unit]);
    }

    for (let i = 0; i < RoadToScan.length; ++i) {
        const type = RoadToScan[i];
        const div = document.createElement('div'); div.className = 'divContentZoom';

        const divcheck = document.createElement('div'); divcheck.className = 'divl';
        divcheck.innerHTML = `<input type="checkbox" style="margin:1px 1px;" class="CScheck" id="cbRoad${type}">`;
        div.appendChild(divcheck);

        const divtype = document.createElement('div');
        divtype.className = 'divl CStype';
        divtype.style.width = '130px';

        const divedit = document.createElement('div');
        divedit.className = 'divr';
        divedit.style.width = '20px';
        const divedita = document.createElement('a');
        divedita.innerHTML = `<img style='width:16px;' title='${CSlang[8][CSI18n]}' src='data:image/png;base64,${iconEdit}' />`;
        divedita.href = '#';
        divedita.className = 'modifyZoom';
        divedita.id = `zoom_${type}`;
        divedit.appendChild(divedita);

        const divzoom = document.createElement('div');
        divzoom.className = 'divr CSzoom';
        divzoom.style.width = '60px';
        divzoom.innerHTML = WMECSpeeds.typeOfRoad[type].zoom;
        divzoom.title = `${roadTypeZoomInfo[type][CSI18n]}`;

        if (type === 3) {
            divtype.innerHTML = CSlang[22][CSI18n];
            div.appendChild(divtype);
            div.appendChild(divedit);
            div.appendChild(divzoom);
        } else if (type === 6) {
            divtype.innerHTML = CSlang[23][CSI18n];
            div.appendChild(divtype);
            div.appendChild(divedit);
            div.appendChild(divzoom);
        } else if (type === 7) {
            divtype.innerHTML = CSlang[24][CSI18n];
            div.appendChild(divtype);
            div.appendChild(divedit);
            div.appendChild(divzoom);
        } else if (type === 4) {
            divtype.innerHTML = CSlang[25][CSI18n];
            div.appendChild(divtype);
            div.appendChild(divedit);
            div.appendChild(divzoom);
        } else if (type === 2) {
            divtype.innerHTML = CSlang[26][CSI18n];
            div.appendChild(divtype);
            div.appendChild(divedit);
            div.appendChild(divzoom);
        } else if (type === 1) {
            divtype.innerHTML = CSlang[27][CSI18n];
            div.appendChild(divtype);
            div.appendChild(divedit);
            div.appendChild(divzoom);
        } else if (type === 22) {
            divtype.innerHTML = CSlang[28][CSI18n];
            div.appendChild(divtype);
            div.appendChild(divedit);
            div.appendChild(divzoom);
        } else if (type === 20) {
            divtype.innerHTML = CSlang[29][CSI18n];
            div.appendChild(divtype);
            div.appendChild(divedit);
            div.appendChild(divzoom);
        } else if (type === 17) {
            divtype.innerHTML = CSlang[30][CSI18n];
            div.appendChild(divtype);
            div.appendChild(divedit);
            div.appendChild(divzoom);
        } else if (type === 8) {
            divtype.innerHTML = CSlang[31][CSI18n];
            div.appendChild(divtype);
            div.appendChild(divedit);
            div.appendChild(divzoom);
        } else if (type === 999) {
            divtype.innerHTML = CSlang[18][CSI18n];
            div.appendChild(divtype);
        }

        getId('CSroadType').appendChild(div);
        getId(`cbRoad${type}`).checked = WMECSpeeds.typeOfRoad[type].checked;
        // getId(`cbRoad${type}`).style.marginLeft = '2px';
        // getId(`cbRoad${type}`).style.marginTop = '2px';
        // getId(`cbRoad${type}`).style.width = '15px';
        // getId(`cbRoad${type}`).style.height = '15px';

        getId(`cbRoad${type}`).onclick = (() => {
            SCColor();
        });
    }
    if (debug) log('Settings Loaded');
    setupHandler();
}

function setupHandler() {
    let rgb = {
        r: 0, g: 0, b: 0, name: null
    };
    const listeDelSpeed = getId('CStable');
    const btnDelSpeed = getElementsByClassName('delSpeed', listeDelSpeed);

    for (let i = 0; i < btnDelSpeed.length; i++) {
        const target = btnDelSpeed[i];
        const index = target.id.split('_')[1];
        target.onclick = getFunctionWithArgs(SCSpeeds, [unit, index, selectedState, selectedCountry]);
    }

    const listeEditZoom = getId('CSroadType');
    const btnEditZoom = getElementsByClassName('modifyZoom', listeEditZoom);

    for (let i = 0; i < btnEditZoom.length; i++) {
        const target = btnEditZoom[i];
        const index = target.id.split('_')[1];
        const val = WMECSpeeds.typeOfRoad[parseInt(index, 10)].zoom;
        target.onclick = getFunctionWithArgs(SCEditZoom, [index, val]);
    }

    getId('cbPaletteByCountrie').onclick = (() => {
        getId('selectCountrie').style.display = (getId('cbPaletteByCountrie').checked) ? 'block' : 'none';
        WMECSpeeds.PaletteByCountrie = getId('cbPaletteByCountrie').checked;
        WMECSpeeds.MultiplePalette = false;
        updateCountrieList();
        getId('CStable').innerHTML = '';
        getId('CSroadType').innerHTML = '';
        LoadSettings();
        SCColor();
    });
    getId('selectCountrie').onclick = (() => {
        updateCountrieList();
        getId('CStable').innerHTML = '';
        getId('CSroadType').innerHTML = '';
        LoadSettings();
    });

    getId('cbMultiplePalette').onclick = (() => {
        getId('selectState').style.display = (getId('cbMultiplePalette').checked) ? 'block' : 'none';
        WMECSpeeds.MultiplePalette = getId('cbMultiplePalette').checked;
        WMECSpeeds.PaletteByCountrie = false;
        if (WMECSpeeds.MultiplePalette === true) {
            const stateToSelect = getTopState().attributes.name.replace(/ /g, '_');
            let index;
            for (index = 0; getId('selectState').options[index].value !== stateToSelect; index++) { /* empty */ }
            getId('selectState').options[index].selected = true;
        }
        getId('CStable').innerHTML = '';
        getId('CSroadType').innerHTML = '';
        LoadSettings();
        SCColor();
    });

    getId('selectState').onclick = (() => {
        getId('CStable').innerHTML = '';
        getId('CSroadType').innerHTML = '';
        LoadSettings();
    });

    getId('edit_others').onclick = (() => {
        getId('Conf_Others').style.display = 'block';
        getId('Conf_Color').style.display = 'none';
        getId('colorspeedsDiv').style.display = 'none';
        getId('newspeed').value = null;
        getId('ConfColor').style.backgroundColor = WMECSpeeds.speedColors.Others;
        getId('newspeedColorDialog').style.display = 'block';
        rgb = color2Rgb(WMECSpeeds.speedColors.Others);
        actualiseColorRGB(rgb);
    });

    getId('cancel').onclick = (() => {
        getId('Conf_Others').style.display = 'none';
        getId('Conf_Color').style.display = 'none';
        getId('newspeedColorDialog').style.display = 'none';
        getId('colorspeedsDiv').style.display = 'block';
        getId('newspeed').value = '';
    });

    getId('submit').onclick = (() => {
        let newSpeed = getId('newspeed').value;
        let newColor = getId('ConfColor').style.backgroundColor;
        // log("newSpeed = ", newSpeed);log("newColor = ", newColor);
        if (getId('Conf_Color').style.display === 'block' && newSpeed && newColor) {
            if (WMECSpeeds.MultiplePalette === true) {
                WMECSpeeds.speedColors.US[selectedState][unit][newSpeed] = newColor;
            } else if (WMECSpeeds.PaletteByCountrie === true) {
                WMECSpeeds.speedColors.Countries[selectedCountry][unit][newSpeed] = newColor;
            } else if (WMECSpeeds.MultiplePalette === false && WMECSpeeds.PaletteByCountrie === false) {
                WMECSpeeds.speedColors[unit][newSpeed] = newColor;
            }
        }
        if (getId('Conf_Others').style.display === 'block' && newColor) {
            WMECSpeeds.speedColors.Others = newColor;
            getId('color_others').style.backgroundColor = WMECSpeeds.speedColors.Others;
        }
        getId('newspeed').value = '';
        newSpeed = null;
        newColor = null;
        getId('CStable').innerHTML = '';
        getId('CSroadType').innerHTML = '';
        getId('Conf_Others').style.display = 'none';
        getId('Conf_Color').style.display = 'none';
        getId('newspeedColorDialog').style.display = 'none';
        getId('colorspeedsDiv').style.display = 'block';
        LoadSettings();
        SCColor();
    });

    $('#ConfColor.dropdown-toggle').dropdown();
    $('#ConfColor+.dropdown-menu li').click(function() {
        getId('ConfColor').style.backgroundColor = this.style.backgroundColor;
        rgb = color2Rgb(this.style.backgroundColor);
        actualiseColorRGB(rgb);
    });
    /*
  $("#ConfDash.dropdown-toggle").dropdown();
  $('#ConfDash+.dropdown-menu li').click(function(){
      getId('ConfDash').text=this.text;
  });
  */
    getId('sliderRed').onmousemove = () => {
        getId('valRed').value = getId('sliderRed').value;
        rgb.r = getId('valRed').value;
        rgb.g = getId('valGreen').value;
        rgb.b = getId('valBlue').value;
        rgb = color2Rgb(Rgb2String(rgb));
        actualiseColorRGB(rgb);
    };
    getId('sliderGreen').onmousemove = () => {
        getId('valGreen').value = getId('sliderGreen').value;
        rgb.r = getId('valRed').value;
        rgb.g = getId('valGreen').value;
        rgb.b = getId('valBlue').value;
        rgb = color2Rgb(Rgb2String(rgb));
        actualiseColorRGB(rgb);
    };
    getId('sliderBlue').onmousemove = () => {
        getId('valBlue').value = getId('sliderBlue').value;
        rgb.r = getId('valRed').value;
        rgb.g = getId('valGreen').value;
        rgb.b = getId('valBlue').value;
        rgb = color2Rgb(Rgb2String(rgb));
        actualiseColorRGB(rgb);
    };
    getId('sliderOffset').onmousemove = () => {
        WMECSpeeds.offsetValue = getId('sliderOffset').value;
        getId('valOffset').value = getId('sliderOffset').value;
        SCColor();
    };
    getId('sliderOpacity').onmousemove = () => {
        WMECSpeeds.opacityValue = Number(getId('sliderOpacity').value / 100).toFixed(2);
        getId('valOpacity').value = getId('sliderOpacity').value;
        SCColor();
    };
    getId('sliderThickness').onmousemove = () => {
        WMECSpeeds.thicknessValue = getId('sliderThickness').value;
        getId('valThickness').value = getId('sliderThickness').value;
        SCColor();
    };

    getId('valRed').onchange = () => {
        const R = parseInt(getId('valRed').value, 10);
        if ((R >= 0) && (R <= 255)) {
            getId('sliderRed').value = getId('valRed').value;
            rgb.r = getId('valRed').value;
            rgb.g = getId('valGreen').value;
            rgb.b = getId('valBlue').value;
            rgb = color2Rgb(Rgb2String(rgb));
            actualiseColorRGB(rgb);
        } else {
            getId('valRed').value = getId('sliderRed').value;
        }
    };

    getId('valGreen').onchange = () => {
        const G = parseInt(getId('valGreen').value, 10);
        if ((G >= 0) && (G <= 255)) {
            getId('sliderGreen').value = getId('valGreen').value;
            rgb.r = getId('valRed').value;
            rgb.g = getId('valGreen').value;
            rgb.b = getId('valBlue').value;
            rgb = color2Rgb(Rgb2String(rgb));
            actualiseColorRGB(rgb);
        } else {
            getId('valGreen').value = getId('sliderGreen').value;
        }
    };
    getId('valBlue').onchange = () => {
        const B = parseInt(getId('valBlue').value, 10);
        if ((B >= 0) && (B <= 255)) {
            getId('sliderBlue').value = getId('valBlue').value;
            rgb.r = getId('valRed').value;
            rgb.g = getId('valGreen').value;
            rgb.b = getId('valBlue').value;
            rgb = color2Rgb(Rgb2String(rgb));
            actualiseColorRGB(rgb);
        } else {
            getId('valBlue').value = getId('sliderBlue').value;
        }
    };
    getId('valOffset').onchange = () => {
        const R = parseInt(getId('valOffset').value, 10);
        if ((R >= 1) && (R <= 10)) {
            getId('sliderOffset').value = getId('valOffset').value;
            WMECSpeeds.offsetValue = getId('valOffset').value;
            SCColor();
        } else {
            getId('valOffset').value = getId('sliderOffset').value;
        }
    };
    getId('valOpacity').onchange = () => {
        const R = parseInt(getId('valOpacity').value, 10);
        if ((R >= 0) && (R <= 100)) {
            getId('sliderOpacity').value = getId('valOpacity').value;
            WMECSpeeds.opacityValue = Number(getId('valOpacity').value / 100).toFixed(2);
            SCColor();
        } else {
            getId('valOpacity').value = getId('sliderOpacity').value;
        }
    };
    getId('valThickness').onchange = () => {
        const R = parseInt(getId('valThickness').value, 10);
        if ((R >= 2) && (R <= 10)) {
            getId('sliderThickness').value = getId('valThickness').value;
            WMECSpeeds.thicknessValue = getId('valThickness').value;
            SCColor();
        } else {
            getId('valThickness').value = getId('sliderThickness').value;
        }
    };
}

function updateCountrieList() {
    const selectCountrie = getId('selectCountrie');
    let current = null;
    if (selectCountrie.selectedIndex >= 0) current = selectCountrie.options[selectCountrie.selectedIndex].value;
    if (current === null) current = getTopCountry().attributes.name.replace(/ /g, '_');

    selectCountrie.options.length = 0;

    for (var countrie in WMECSpeeds.speedColors.Countries) {
        // create option in select menu
        if (countrie === undefined) countrie = getTopCountry().attributes.name.replace(/ /g, '_');
        var countrieOption = document.createElement('option');
        var countrieText = document.createTextNode(countrie.replace(/_/g, ' '));

        if (current !== null && countrie == current)
            countrieOption.setAttribute('selected', true);
        countrieOption.setAttribute('value', countrie);
        countrieOption.appendChild(countrieText);
        selectCountrie.appendChild(countrieOption);

    }
}

function CSModifCouleur(unit, id, color, state) {
    getId('Conf_Others').style.display = 'none';
    getId('Conf_Color').style.display = 'block';
    getId('colorspeedsDiv').style.display = 'none';
    getId('newspeed').value = id;
    getId('ConfColor').style.backgroundColor = color;
    newspeedColorDialog.style.display = 'block';
    const c = color2Rgb(color);
    actualiseColorRGB(c);
}

function actualiseColorRGB(c) {
    log('color: ', c);
    getId('valRed').value = c.r;
    getId('valGreen').value = c.g;
    getId('valBlue').value = c.b;

    getId('sliderRed').value = c.r;
    getId('sliderGreen').value = c.g;
    getId('sliderBlue').value = c.b;
    getId('ConfColor').style.backgroundColor = Rgb2String(c);
    getId('nameColor').innerHTML = c.name;
}

function SCSpeeds(unit, idx, state, contrie){
    if (WMECSpeeds.MultiplePalette === true){
        var answer = window.confirm(CSlang[5][CSI18n] + ' ' + idx + ' ' + unit + ' ' + CSlang[21][CSI18n] + ' ' + state + ' ?');
    }else if (WMECSpeeds.PaletteByCountrie === true){
        var answer = window.confirm(CSlang[5][CSI18n] + ' ' + idx + ' ' + unit + ' ' + CSlang[21][CSI18n] + ' ' + contrie + ' ?');
    }else{var answer = window.confirm(CSlang[5][CSI18n] + ' ' + idx + ' ' + unit + ' ?');}

    if (answer){
        if (WMECSpeeds.MultiplePalette === true){
            delete WMECSpeeds.speedColors.US[state][unit][idx];
        }else if (WMECSpeeds.PaletteByCountrie === true){
            delete WMECSpeeds.speedColors.Countries[contrie][unit][idx];
        }else {delete WMECSpeeds.speedColors[unit][idx];}

        getId('CStable').innerHTML = '';
        getId('CSroadType').innerHTML = '';
        LoadSettings();
    }
}

function SCEditZoom(idx, val){
    getId('editzoom').style.display = 'block';
    getId('newvalzoom').value = val;
    getId('texttype').textContent = WMECSpeeds.typeOfRoad[idx].name;

    getId('submitZoom').onclick = (function(){
        var newValZoom = getId('newvalzoom').value;
        if (newValZoom) {
            WMECSpeeds.typeOfRoad[idx].zoom = newValZoom;
        }
        getId('editzoom').style.display = 'none';
        getId('newvalzoom').value = '';
        getId('CStable').innerHTML = '';
        getId('CSroadType').innerHTML = '';
        LoadSettings();
    });
    getId('cancelZoom').onclick = (function(){
        getId('editzoom').style.display = 'none';
        getId('newvalzoom').value = '';
        getId('CStable').innerHTML = '';
        getId('CSroadType').innerHTML = '';
        LoadSettings();
    });
}

function shiftGeometry(d, line, trigo) // d=distance to shift, line=collection of OL points, trigo=boolean: true=left(trigo=CCW) false=right(CW) : fwd is CW, rev is trigo
{
    if (!trigo)
        d = -d;

    function getOrthoVector(p1, p2)
    {
        return [p1.y - p2.y, p2.x - p1.x];
    }

    function normalizeVector(v)
    {
        if (v[0] * v[0] + v[1] * v[1] == 0)
            return v;
        var l = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        return [v[0] / l, v[1] / l];
    }

    var points = [];
    for (var i = 0; i < line.length; i++)
    {
        var vcount = 0;
        // compute orthogonal vectors:
        var prevVector = [0, 0];
        var nextVector = [0, 0];
        if (i > 0) // can compute prev
        {
            var p1 = line[i - 1];
            var p2 = line[i];
            prevVector = getOrthoVector(p1, p2);
            prevVector = normalizeVector(prevVector);
            vcount++;
        }
        if (i < line.length - 1) // can compute next
        {
            var p1 = line[i];
            var p2 = line[i + 1];
            nextVector = getOrthoVector(p1, p2);
            nextVector = normalizeVector(nextVector);
            vcount++;
        }
        // sum vectors and normalize
        var v = [0, 0];
        if (vcount != 0)
            v = [(prevVector[0] + nextVector[0]) / vcount, (prevVector[1] + nextVector[1]) / vcount];
        //v=normalizeVector(v);
        points.push(new CSpeedOpenLayers.Geometry.Point(line[i].x + v[0] * d, line[i].y + v[1] * d));
    }
    return points;
}

function SCColor() {
    function getByID(obj, id){
        if (typeof(obj.getObjectById) == 'function'){
            return obj.getObjectById(id);
        }else if (typeof(obj.getObjectById) == 'undefined'){
            return obj.get(id);
        }
    }
    //log('SCColor');
    try { mapLayer.destroyFeatures();
    }catch(err){log('err destroyFeatures: ', err);}

    if (getTopCountry() === null) return;

    if ( CSpeedsCountries !== undefined && /*CSpeedsCountries.top*/getTopCountry() !== undefined){
        getId('stateChoise').style.display = (/*CSpeedsCountries.top*/getTopCountry().attributes.name == 'United States') ? 'block' : 'none';
    }
    var lineFeature = [];

    for (var i = 0; i < RoadToScan.length; ++i){
        var type = RoadToScan[i];
        WMECSpeeds.typeOfRoad[type].checked = getId('cbRoad' + type).checked;
    }

    for (var seg in CSpeedsModel.segments.objects) {
        var segment = getByID(CSpeedsModel.segments, seg);
        var attributes = segment.attributes;
        var roadType = attributes.roadType;
        var roundabout = (attributes.junctionID === null) ? false : true;
        var line = getId(segment.getOLGeometry().id);
        var fwdspeed = attributes.fwdMaxSpeed;
        var revspeed = attributes.revMaxSpeed;
        var fwdspeedUnverified = attributes.fwdMaxSpeedUnverified;
        var revspeedUnverified = attributes.revMaxSpeedUnverified;
        var fwddir = attributes.fwdDirection;
        var revdir = attributes.revDirection;
        //var fwdID = "",revID="";
        var isSelected = (segment.selected == true) ? true : false;
        var isModified = (segment.state == 'Update') ? true : false;

        if (attributes.primaryStreetID === null || attributes.primaryStreetID === undefined) continue;

        if (getByID(CSpeedsModel.streets, attributes.primaryStreetID) === null || getByID(CSpeedsModel.streets, attributes.primaryStreetID) === undefined){
            if (debug) log('CSpeedsModel.streets.get(' + attributes.primaryStreetID + ') =', getByID(CSpeedsModel.streets, attributes.primaryStreetID));
            continue;
        }

        var cid = getByID(CSpeedsModel.streets, attributes.primaryStreetID).attributes.cityID;
        var stateID = null;
        var countryID = null;

        if (getByID(CSpeedsModel.cities, cid) === null || getByID(CSpeedsModel.cities, cid) === undefined){
            if (debug) log('CSpeedsModel.cities.get(' + cid + ') =', getByID(CSpeedsModel.cities, cid));
            continue;
        }

        stateID = getByID(CSpeedsModel.cities, cid).attributes.stateID;
        countryID = getByID(CSpeedsModel.cities, cid).attributes.countryID;

        var state = getByID(CSpeedsModel.states, stateID).attributes.name.replace(/ /g, '_');
        var countrie = getByID(CSpeedsModel.countries, countryID).attributes.name.replace(/ /g, '_');

        if (WMECSpeeds.PaletteByCountrie == true && WMECSpeeds.speedColors.Countries[countrie] === undefined){
            WMECSpeeds.speedColors.Countries[countrie] = {};
            WMECSpeeds.speedColors.Countries[countrie][unit] = cloneObj(WMECSpeeds.speedColors[unit]);
            updateCountrieList();
            LoadSettings();
            log('SCColor WMECSpeeds.speedColors.Countries.' + countrie + '.' + unit + ' = ', WMECSpeeds.speedColors.Countries[countrie][unit]);
        }

        if (WMECSpeeds.MultiplePalette == true && WMECSpeeds.speedColors.US[state] !== undefined && WMECSpeeds.speedColors.US[state][unit] === undefined){
            WMECSpeeds.speedColors.US[state][unit] = cloneObj(WMECSpeeds.speedColors[unit]);
            //log("SCColor WMECSpeeds.speedColors.US."+state+"."+unit+" = ",WMECSpeeds.speedColors.US[state][unit]);
        }

        // check that WME hasn't highlighted this segment
        if (isSelected || isModified) continue;

        if (zoom != CSpeedsMap.olMap.zoom) {
            zoom = CSpeedsMap.olMap.zoom;
            //log('zoom = ' + zoom + 'W.map.getResolution() = '+W.map.getResolution());
        }
        var shiftValue = WMECSpeeds.offsetValue * W.map.getResolution();

        if (RoadToScan.indexOf(roadType) == -1 ) continue;
        if ((roundabout != false) && (WMECSpeeds.typeOfRoad['999'].checked == false)) continue;

        if (unit == 'mph'){
            fwdspeed = (fwdspeed != null) ? (Math.trunc(fwdspeed * 0.625)) : null;
            revspeed = (revspeed != null) ? (Math.trunc(revspeed * 0.625)) : null;
        }
        //log("fwdspeed= "+ fwdspeed + " " + unit + " ;  revspeed= " + revspeed + " " + unit);

        // turn off highlights when roads are no longer visible

        if ((zoom < WMECSpeeds.typeOfRoad[roadType].zoom) || !WMECSpeeds.typeOfRoad[roadType].checked) {
            continue;
        }
        WMECSpeeds.visibility = mapLayer.visibility;

        if (fwdspeed && WMECSpeeds.visibility) {
            //Color for forward speed
            var newWidth = '', newColor = '', newDashes = '', newOpacity = '';

            if (WMECSpeeds.MultiplePalette === false && WMECSpeeds.PaletteByCountrie === false){
                if (WMECSpeeds.speedColors[unit].hasOwnProperty(fwdspeed)) newColor = WMECSpeeds.speedColors[unit][fwdspeed];
            }else if (WMECSpeeds.PaletteByCountrie === true){
                if (WMECSpeeds.speedColors.Countries[countrie][unit].hasOwnProperty(fwdspeed)) newColor = WMECSpeeds.speedColors.Countries[countrie][unit][fwdspeed];
            }else if (WMECSpeeds.MultiplePalette === true && WMECSpeeds.speedColors.US[state] !== undefined){
                if (WMECSpeeds.speedColors.US[state][unit].hasOwnProperty(fwdspeed)) newColor = WMECSpeeds.speedColors.US[state][unit][fwdspeed];
            }
            /*
          if (newColor!=""){
            //Dashes
            if (fwddir==true && fwdspeed && !fwdspeedUnverified) { newWidth = 6; newOpacity = 0.8; newDashes = "5 10"; } // verified speed
            else if (fwddir==true && fwdspeed && fwdspeedUnverified) { newColor = WMECSpeeds.speedColors.Others; newWidth = 4; newOpacity = 0.8; newDashes = "2 10";} // unverified speed
          }else if (fwddir==true && fwdspeed) { newWidth = 4; newColor = WMECSpeeds.speedColors.Others; newOpacity = 0.9; newDashes = "5 5"; } // other
          */
            if (newColor != ''){
            //Dashes
                if (fwddir == true && fwdspeed && !fwdspeedUnverified) { newWidth = WMECSpeeds.thicknessValue; newOpacity = WMECSpeeds.opacityValue; newDashes = '5 10'; } // verified speed
                else if (fwddir == true && fwdspeed && fwdspeedUnverified) { newColor = WMECSpeeds.speedColors.Others; newWidth = WMECSpeeds.thicknessValue; newOpacity = 0.8; newDashes = '2 10';} // unverified speed
            }else if (fwddir == true && fwdspeed) { newWidth = WMECSpeeds.thicknessValue; newColor = WMECSpeeds.speedColors.Others; newOpacity = WMECSpeeds.opacityValue; newDashes = '5 5'; } // other

            if (newColor != ''){
                var style = {
                    strokeColor: newColor,
                    strokeOpacity: newOpacity,
                    strokeWidth: newWidth,
                    strokeDashstyle: newDashes
                };

                var points = [];
                var segID = attributes.id;
                points = shiftGeometry(shiftValue, segment.getOLGeometry().getVertices(), CSpeedsModel.getTopCountry().getAttribute('leftHandTraffic'));

                var newline = new CSpeedOpenLayers.Geometry.LineString(points);

                lineFeature.push(new CSpeedOpenLayers.Feature.Vector(newline, null, style));
            //log("segment id: " + attributes.id + ' newColor: '+ newColor + ' segment.CSpeedsFwd.fwdColor: ' + segment.CSpeedsFwd.fwdColor + ' lineFeature: ',lineFeature);
            }
        }
        if (revspeed && WMECSpeeds.visibility) {
            //Color for reverse speed
            var newWidth = '', newColor = '', newDashes = '', newOpacity = '', newDashOffset = '';

            if (WMECSpeeds.MultiplePalette === false && WMECSpeeds.PaletteByCountrie === false){
                if (WMECSpeeds.speedColors[unit].hasOwnProperty(revspeed)) newColor = WMECSpeeds.speedColors[unit][revspeed];
            }else if (WMECSpeeds.PaletteByCountrie === true){
                if (WMECSpeeds.speedColors.Countries[countrie][unit].hasOwnProperty(revspeed)) newColor = WMECSpeeds.speedColors.Countries[countrie][unit][revspeed];
            }else if (WMECSpeeds.MultiplePalette === true && WMECSpeeds.speedColors.US[state] !== undefined){
                if (WMECSpeeds.speedColors.US[state][unit].hasOwnProperty(revspeed)) newColor = WMECSpeeds.speedColors.US[state][unit][revspeed];
            }
            /*
            if (newColor!=""){
                //Dashes
                if (revdir==true && revspeed && !revspeedUnverified) { newWidth = 6; newOpacity = 0.8; newDashes = "5 10"; } // verified speed
                else if (revdir==true && revspeed && revspeedUnverified) { newColor = WMECSpeeds.speedColors.Others; newWidth = 4; newOpacity = 0.8; newDashes = "2 10";} // unverified speed
            }else if (revdir==true && revspeed) { newWidth = 4; newColor = WMECSpeeds.speedColors.Others; newOpacity = 0.9; newDashes = "5 5"; } // other
            */
            if (newColor != ''){
                //Dashes
                if (revdir == true && revspeed && !revspeedUnverified) { newWidth = WMECSpeeds.thicknessValue; newOpacity = WMECSpeeds.opacityValue; newDashes = '5 10'; } // verified speed
                else if (revdir == true && revspeed && revspeedUnverified) { newColor = WMECSpeeds.speedColors.Others; newWidth = WMECSpeeds.thicknessValue; newOpacity = WMECSpeeds.opacityValue; newDashes = '2 10';} // unverified speed
            }else if (revdir == true && revspeed) { newWidth = WMECSpeeds.thicknessValue; newColor = WMECSpeeds.speedColors.Others; newOpacity = WMECSpeeds.opacityValue; newDashes = '5 5'; } // other

            if (newColor != ''){
                var style = {
                    strokeColor: newColor,
                    strokeOpacity: newOpacity,
                    strokeWidth: newWidth,
                    strokeDashstyle: newDashes,
                };

                var points = [];
                var segID = attributes.id;

                points = shiftGeometry(shiftValue, segment.getOLGeometry().getVertices(), !CSpeedsModel.getTopCountry().getAttribute('leftHandTraffic'));

                var newline = new CSpeedOpenLayers.Geometry.LineString(points);

                lineFeature.push(new CSpeedOpenLayers.Feature.Vector(newline, null, style));
            }
        }

    }

    // log("lineFeature = ",lineFeature);
    // Display new array of segments
    try {
        mapLayer.addFeatures(lineFeature);
    } catch (err) { log('err addFeatures: ', err); }
    if (debug) log(`Total load time without WW of ${Math.round(performance.now() - scriptStartTime)} ms.`);
    if (debug) log(`Total load time with WW of ${Math.round(performance.now() - loadStartTime)} ms.`);
}

/* begin running the code! */
counterStart();
