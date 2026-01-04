// ==UserScript==
// @name                     Better XES C++ Class
// @name:zh-CN               更好的学而思c++课
// @namespace                https://code.xueersi.com/
// @version                  v1.01
// @description              Better C++ Class IDE
// @description:zh-CN        更好的c++课程代码编辑器
// @author                   xiaochen004hao
// @license                  GPL-3.0
// match                     https://code.xueersi.com/*
// match                     https://code.xueersi.com/ide/code/*
// @match                    https://code.xueersi.com/live/creator/*
// @match                    https://code.xueersi.com/ide/common/*
// @match                    https://code.xueersi.com/class/info*
// @icon                     https://code.xueersi.com/static/images/code-home/qrlogo.png
// @require                  https://code.jquery.com/jquery-3.7.1.min.js
// @grant                    none
// @run-at                   document-start
// @downloadURL https://update.greasyfork.org/scripts/525131/Better%20XES%20C%2B%2B%20Class.user.js
// @updateURL https://update.greasyfork.org/scripts/525131/Better%20XES%20C%2B%2B%20Class.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /**
     * @typedef {{ new(tag?: string, data?: object, children?: object[], text?: string, elm?: unknown, context?: unknown, componentOptions?: object, asyncFactory?: Function): object }} VElement
     */

    const logger = Object.assign({}, console);
    // 样式列表（有点多啊。。。）
    const XtermTheme = {};
    (() => {
        XtermTheme.Theme_3024_Night = {
            foreground: "#a5a2a2",
            background: "#090300",
            cursor: "#a5a2a2",

            black: "#090300",
            brightBlack: "#5c5855",

            red: "#db2d20",
            brightRed: "#e8bbd0",

            green: "#01a252",
            brightGreen: "#3a3432",

            yellow: "#fded02",
            brightYellow: "#4a4543",

            blue: "#01a0e4",
            brightBlue: "#807d7c",

            magenta: "#a16a94",
            brightMagenta: "#d6d5d4",

            cyan: "#b5e4f4",
            brightCyan: "#cdab53",

            white: "#a5a2a2",
            brightWhite: "#f7f7f7",
        };
        XtermTheme.Theme_AdventureTime = {
            foreground: "#f8dcc0",
            background: "#1f1d45",
            cursor: "#efbf38",

            black: "#050404",
            brightBlack: "#4e7cbf",

            red: "#bd0013",
            brightRed: "#fc5f5a",

            green: "#4ab118",
            brightGreen: "#9eff6e",

            yellow: "#e7741e",
            brightYellow: "#efc11a",

            blue: "#0f4ac6",
            brightBlue: "#1997c6",

            magenta: "#665993",
            brightMagenta: "#9b5953",

            cyan: "#70a598",
            brightCyan: "#c8faf4",

            white: "#f8dcc0",
            brightWhite: "#f6f5fb",
        };
        XtermTheme.Theme_Afterglow = {
            foreground: "#d0d0d0",
            background: "#212121",
            cursor: "#d0d0d0",

            black: "#151515",
            brightBlack: "#505050",

            red: "#ac4142",
            brightRed: "#ac4142",

            green: "#7e8e50",
            brightGreen: "#7e8e50",

            yellow: "#e5b567",
            brightYellow: "#e5b567",

            blue: "#6c99bb",
            brightBlue: "#6c99bb",

            magenta: "#9f4e85",
            brightMagenta: "#9f4e85",

            cyan: "#7dd6cf",
            brightCyan: "#7dd6cf",

            white: "#d0d0d0",
            brightWhite: "#f5f5f5",
        };
        XtermTheme.Theme_AlienBlood = {
            foreground: "#637d75",
            background: "#0f1610",
            cursor: "#73fa91",

            black: "#112616",
            brightBlack: "#3c4812",

            red: "#7f2b27",
            brightRed: "#e08009",

            green: "#2f7e25",
            brightGreen: "#18e000",

            yellow: "#717f24",
            brightYellow: "#bde000",

            blue: "#2f6a7f",
            brightBlue: "#00aae0",

            magenta: "#47587f",
            brightMagenta: "#0058e0",

            cyan: "#327f77",
            brightCyan: "#00e0c4",

            white: "#647d75",
            brightWhite: "#73fa91",
        };
        XtermTheme.Theme_Argonaut = {
            foreground: "#fffaf4",
            background: "#0e1019",
            cursor: "#ff0018",

            black: "#232323",
            brightBlack: "#444444",

            red: "#ff000f",
            brightRed: "#ff2740",

            green: "#8ce10b",
            brightGreen: "#abe15b",

            yellow: "#ffb900",
            brightYellow: "#ffd242",

            blue: "#008df8",
            brightBlue: "#0092ff",

            magenta: "#6d43a6",
            brightMagenta: "#9a5feb",

            cyan: "#00d8eb",
            brightCyan: "#67fff0",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Arthur = {
            foreground: "#ddeedd",
            background: "#1c1c1c",
            cursor: "#e2bbef",

            black: "#3d352a",
            brightBlack: "#554444",

            red: "#cd5c5c",
            brightRed: "#cc5533",

            green: "#86af80",
            brightGreen: "#88aa22",

            yellow: "#e8ae5b",
            brightYellow: "#ffa75d",

            blue: "#6495ed",
            brightBlue: "#87ceeb",

            magenta: "#deb887",
            brightMagenta: "#996600",

            cyan: "#b0c4de",
            brightCyan: "#b0c4de",

            white: "#bbaa99",
            brightWhite: "#ddccbb",
        };
        XtermTheme.Theme_AtelierSulphurpool = {
            foreground: "#979db4",
            background: "#202746",
            cursor: "#979db4",

            black: "#202746",
            brightBlack: "#6b7394",

            red: "#c94922",
            brightRed: "#c76b29",

            green: "#ac9739",
            brightGreen: "#293256",

            yellow: "#c08b30",
            brightYellow: "#5e6687",

            blue: "#3d8fd1",
            brightBlue: "#898ea4",

            magenta: "#6679cc",
            brightMagenta: "#dfe2f1",

            cyan: "#22a2c9",
            brightCyan: "#9c637a",

            white: "#979db4",
            brightWhite: "#f5f7ff",
        };
        XtermTheme.Theme_Atom = {
            foreground: "#c5c8c6",
            background: "#161719",
            cursor: "#d0d0d0",

            black: "#000000",
            brightBlack: "#000000",

            red: "#fd5ff1",
            brightRed: "#fd5ff1",

            green: "#87c38a",
            brightGreen: "#94fa36",

            yellow: "#ffd7b1",
            brightYellow: "#f5ffa8",

            blue: "#85befd",
            brightBlue: "#96cbfe",

            magenta: "#b9b6fc",
            brightMagenta: "#b9b6fc",

            cyan: "#85befd",
            brightCyan: "#85befd",

            white: "#e0e0e0",
            brightWhite: "#e0e0e0",
        };
        XtermTheme.Theme_ayu = {
            foreground: "#e6e1cf",
            background: "#0f1419",
            cursor: "#f29718",

            black: "#000000",
            brightBlack: "#323232",

            red: "#ff3333",
            brightRed: "#ff6565",

            green: "#b8cc52",
            brightGreen: "#eafe84",

            yellow: "#e7c547",
            brightYellow: "#fff779",

            blue: "#36a3d9",
            brightBlue: "#68d5ff",

            magenta: "#f07178",
            brightMagenta: "#ffa3aa",

            cyan: "#95e6cb",
            brightCyan: "#c7fffd",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Batman = {
            foreground: "#6f6f6f",
            background: "#1b1d1e",
            cursor: "#fcef0c",

            black: "#1b1d1e",
            brightBlack: "#505354",

            red: "#e6dc44",
            brightRed: "#fff78e",

            green: "#c8be46",
            brightGreen: "#fff27d",

            yellow: "#f4fd22",
            brightYellow: "#feed6c",

            blue: "#737174",
            brightBlue: "#919495",

            magenta: "#747271",
            brightMagenta: "#9a9a9d",

            cyan: "#62605f",
            brightCyan: "#a3a3a6",

            white: "#c6c5bf",
            brightWhite: "#dadbd6",
        };
        XtermTheme.Theme_Belafonte_Night = {
            foreground: "#968c83",
            background: "#20111b",
            cursor: "#968c83",

            black: "#20111b",
            brightBlack: "#5e5252",

            red: "#be100e",
            brightRed: "#be100e",

            green: "#858162",
            brightGreen: "#858162",

            yellow: "#eaa549",
            brightYellow: "#eaa549",

            blue: "#426a79",
            brightBlue: "#426a79",

            magenta: "#97522c",
            brightMagenta: "#97522c",

            cyan: "#989a9c",
            brightCyan: "#989a9c",

            white: "#968c83",
            brightWhite: "#d5ccba",
        };
        XtermTheme.Theme_BirdsOfParadise = {
            foreground: "#e0dbb7",
            background: "#2a1f1d",
            cursor: "#573d26",

            black: "#573d26",
            brightBlack: "#9b6c4a",

            red: "#be2d26",
            brightRed: "#e84627",

            green: "#6ba18a",
            brightGreen: "#95d8ba",

            yellow: "#e99d2a",
            brightYellow: "#d0d150",

            blue: "#5a86ad",
            brightBlue: "#b8d3ed",

            magenta: "#ac80a6",
            brightMagenta: "#d19ecb",

            cyan: "#74a6ad",
            brightCyan: "#93cfd7",

            white: "#e0dbb7",
            brightWhite: "#fff9d5",
        };
        XtermTheme.Theme_Blazer = {
            foreground: "#d9e6f2",
            background: "#0d1926",
            cursor: "#d9e6f2",

            black: "#000000",
            brightBlack: "#262626",

            red: "#b87a7a",
            brightRed: "#dbbdbd",

            green: "#7ab87a",
            brightGreen: "#bddbbd",

            yellow: "#b8b87a",
            brightYellow: "#dbdbbd",

            blue: "#7a7ab8",
            brightBlue: "#bdbddb",

            magenta: "#b87ab8",
            brightMagenta: "#dbbddb",

            cyan: "#7ab8b8",
            brightCyan: "#bddbdb",

            white: "#d9d9d9",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Borland = {
            foreground: "#ffff4e",
            background: "#0000a4",
            cursor: "#ffa560",

            black: "#4f4f4f",
            brightBlack: "#7c7c7c",

            red: "#ff6c60",
            brightRed: "#ffb6b0",

            green: "#a8ff60",
            brightGreen: "#ceffac",

            yellow: "#ffffb6",
            brightYellow: "#ffffcc",

            blue: "#96cbfe",
            brightBlue: "#b5dcff",

            magenta: "#ff73fd",
            brightMagenta: "#ff9cfe",

            cyan: "#c6c5fe",
            brightCyan: "#dfdffe",

            white: "#eeeeee",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Bright_Lights = {
            foreground: "#b3c9d7",
            background: "#191919",
            cursor: "#f34b00",

            black: "#191919",
            brightBlack: "#191919",

            red: "#ff355b",
            brightRed: "#ff355b",

            green: "#b7e876",
            brightGreen: "#b7e876",

            yellow: "#ffc251",
            brightYellow: "#ffc251",

            blue: "#76d4ff",
            brightBlue: "#76d5ff",

            magenta: "#ba76e7",
            brightMagenta: "#ba76e7",

            cyan: "#6cbfb5",
            brightCyan: "#6cbfb5",

            white: "#c2c8d7",
            brightWhite: "#c2c8d7",
        };
        XtermTheme.Theme_Broadcast = {
            foreground: "#e6e1dc",
            background: "#2b2b2b",
            cursor: "#ffffff",

            black: "#000000",
            brightBlack: "#323232",

            red: "#da4939",
            brightRed: "#ff7b6b",

            green: "#519f50",
            brightGreen: "#83d182",

            yellow: "#ffd24a",
            brightYellow: "#ffff7c",

            blue: "#6d9cbe",
            brightBlue: "#9fcef0",

            magenta: "#d0d0ff",
            brightMagenta: "#ffffff",

            cyan: "#6e9cbe",
            brightCyan: "#a0cef0",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Brogrammer = {
            foreground: "#d6dbe5",
            background: "#131313",
            cursor: "#b9b9b9",

            black: "#1f1f1f",
            brightBlack: "#d6dbe5",

            red: "#f81118",
            brightRed: "#de352e",

            green: "#2dc55e",
            brightGreen: "#1dd361",

            yellow: "#ecba0f",
            brightYellow: "#f3bd09",

            blue: "#2a84d2",
            brightBlue: "#1081d6",

            magenta: "#4e5ab7",
            brightMagenta: "#5350b9",

            cyan: "#1081d6",
            brightCyan: "#0f7ddb",

            white: "#d6dbe5",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_C64 = {
            foreground: "#7869c4",
            background: "#40318d",
            cursor: "#7869c4",

            black: "#090300",
            brightBlack: "#000000",

            red: "#883932",
            brightRed: "#883932",

            green: "#55a049",
            brightGreen: "#55a049",

            yellow: "#bfce72",
            brightYellow: "#bfce72",

            blue: "#40318d",
            brightBlue: "#40318d",

            magenta: "#8b3f96",
            brightMagenta: "#8b3f96",

            cyan: "#67b6bd",
            brightCyan: "#67b6bd",

            white: "#ffffff",
            brightWhite: "#f7f7f7",
        };
        XtermTheme.Theme_Chalk = {
            foreground: "#d2d8d9",
            background: "#2b2d2e",
            cursor: "#708284",

            black: "#7d8b8f",
            brightBlack: "#888888",

            red: "#b23a52",
            brightRed: "#f24840",

            green: "#789b6a",
            brightGreen: "#80c470",

            yellow: "#b9ac4a",
            brightYellow: "#ffeb62",

            blue: "#2a7fac",
            brightBlue: "#4196ff",

            magenta: "#bd4f5a",
            brightMagenta: "#fc5275",

            cyan: "#44a799",
            brightCyan: "#53cdbd",

            white: "#d2d8d9",
            brightWhite: "#d2d8d9",
        };
        XtermTheme.Theme_Chalkboard = {
            foreground: "#d9e6f2",
            background: "#29262f",
            cursor: "#d9e6f2",

            black: "#000000",
            brightBlack: "#323232",

            red: "#c37372",
            brightRed: "#dbaaaa",

            green: "#72c373",
            brightGreen: "#aadbaa",

            yellow: "#c2c372",
            brightYellow: "#dadbaa",

            blue: "#7372c3",
            brightBlue: "#aaaadb",

            magenta: "#c372c2",
            brightMagenta: "#dbaada",

            cyan: "#72c2c3",
            brightCyan: "#aadadb",

            white: "#d9d9d9",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Ciapre = {
            foreground: "#aea47a",
            background: "#191c27",
            cursor: "#92805b",

            black: "#181818",
            brightBlack: "#555555",

            red: "#810009",
            brightRed: "#ac3835",

            green: "#48513b",
            brightGreen: "#a6a75d",

            yellow: "#cc8b3f",
            brightYellow: "#dcdf7c",

            blue: "#576d8c",
            brightBlue: "#3097c6",

            magenta: "#724d7c",
            brightMagenta: "#d33061",

            cyan: "#5c4f4b",
            brightCyan: "#f3dbb2",

            white: "#aea47f",
            brightWhite: "#f4f4f4",
        };
        XtermTheme.Theme_Cobalt2 = {
            foreground: "#ffffff",
            background: "#132738",
            cursor: "#f0cc09",

            black: "#000000",
            brightBlack: "#555555",

            red: "#ff0000",
            brightRed: "#f40e17",

            green: "#38de21",
            brightGreen: "#3bd01d",

            yellow: "#ffe50a",
            brightYellow: "#edc809",

            blue: "#1460d2",
            brightBlue: "#5555ff",

            magenta: "#ff005d",
            brightMagenta: "#ff55ff",

            cyan: "#00bbbb",
            brightCyan: "#6ae3fa",

            white: "#bbbbbb",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Cobalt_Neon = {
            foreground: "#8ff586",
            background: "#142838",
            cursor: "#c4206f",

            black: "#142631",
            brightBlack: "#fff688",

            red: "#ff2320",
            brightRed: "#d4312e",

            green: "#3ba5ff",
            brightGreen: "#8ff586",

            yellow: "#e9e75c",
            brightYellow: "#e9f06d",

            blue: "#8ff586",
            brightBlue: "#3c7dd2",

            magenta: "#781aa0",
            brightMagenta: "#8230a7",

            cyan: "#8ff586",
            brightCyan: "#6cbc67",

            white: "#ba46b2",
            brightWhite: "#8ff586",
        };
        XtermTheme.Theme_CrayonPonyFish = {
            foreground: "#68525a",
            background: "#150707",
            cursor: "#68525a",

            black: "#2b1b1d",
            brightBlack: "#3d2b2e",

            red: "#91002b",
            brightRed: "#c5255d",

            green: "#579524",
            brightGreen: "#8dff57",

            yellow: "#ab311b",
            brightYellow: "#c8381d",

            blue: "#8c87b0",
            brightBlue: "#cfc9ff",

            magenta: "#692f50",
            brightMagenta: "#fc6cba",

            cyan: "#e8a866",
            brightCyan: "#ffceaf",

            white: "#68525a",
            brightWhite: "#b0949d",
        };
        XtermTheme.Theme_Darkside = {
            foreground: "#bababa",
            background: "#222324",
            cursor: "#bbbbbb",

            black: "#000000",
            brightBlack: "#000000",

            red: "#e8341c",
            brightRed: "#e05a4f",

            green: "#68c256",
            brightGreen: "#77b869",

            yellow: "#f2d42c",
            brightYellow: "#efd64b",

            blue: "#1c98e8",
            brightBlue: "#387cd3",

            magenta: "#8e69c9",
            brightMagenta: "#957bbe",

            cyan: "#1c98e8",
            brightCyan: "#3d97e2",

            white: "#bababa",
            brightWhite: "#bababa",
        };
        XtermTheme.Theme_Dark_Pastel = {
            foreground: "#ffffff",
            background: "#000000",
            cursor: "#bbbbbb",

            black: "#000000",
            brightBlack: "#555555",

            red: "#ff5555",
            brightRed: "#ff5555",

            green: "#55ff55",
            brightGreen: "#55ff55",

            yellow: "#ffff55",
            brightYellow: "#ffff55",

            blue: "#5555ff",
            brightBlue: "#5555ff",

            magenta: "#ff55ff",
            brightMagenta: "#ff55ff",

            cyan: "#55ffff",
            brightCyan: "#55ffff",

            white: "#bbbbbb",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_deep = {
            foreground: "#cdcdcd",
            background: "#000000",
            cursor: "#d0d0d0",

            black: "#000000",
            brightBlack: "#535353",

            red: "#d11600",
            brightRed: "#f4152c",

            green: "#37c32c",
            brightGreen: "#01ea10",

            yellow: "#e3c421",
            brightYellow: "#ffee1d",

            blue: "#5c6bfd",
            brightBlue: "#8cb0f8",

            magenta: "#dd5be5",
            brightMagenta: "#e056f5",

            cyan: "#6eb4f2",
            brightCyan: "#67ecff",

            white: "#e0e0e0",
            brightWhite: "#f4f4f4",
        };
        XtermTheme.Theme_Desert = {
            foreground: "#ffffff",
            background: "#333333",
            cursor: "#00ff00",

            black: "#4d4d4d",
            brightBlack: "#555555",

            red: "#ff2b2b",
            brightRed: "#ff5555",

            green: "#98fb98",
            brightGreen: "#55ff55",

            yellow: "#f0e68c",
            brightYellow: "#ffff55",

            blue: "#cd853f",
            brightBlue: "#87ceff",

            magenta: "#ffdead",
            brightMagenta: "#ff55ff",

            cyan: "#ffa0a0",
            brightCyan: "#ffd700",

            white: "#f5deb3",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_DimmedMonokai = {
            foreground: "#b9bcba",
            background: "#1f1f1f",
            cursor: "#f83e19",

            black: "#3a3d43",
            brightBlack: "#888987",

            red: "#be3f48",
            brightRed: "#fb001f",

            green: "#879a3b",
            brightGreen: "#0f722f",

            yellow: "#c5a635",
            brightYellow: "#c47033",

            blue: "#4f76a1",
            brightBlue: "#186de3",

            magenta: "#855c8d",
            brightMagenta: "#fb0067",

            cyan: "#578fa4",
            brightCyan: "#2e706d",

            white: "#b9bcba",
            brightWhite: "#fdffb9",
        };
        XtermTheme.Theme_DotGov = {
            foreground: "#ebebeb",
            background: "#262c35",
            cursor: "#d9002f",

            black: "#191919",
            brightBlack: "#191919",

            red: "#bf091d",
            brightRed: "#bf091d",

            green: "#3d9751",
            brightGreen: "#3d9751",

            yellow: "#f6bb34",
            brightYellow: "#f6bb34",

            blue: "#17b2e0",
            brightBlue: "#17b2e0",

            magenta: "#7830b0",
            brightMagenta: "#7830b0",

            cyan: "#8bd2ed",
            brightCyan: "#8bd2ed",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Dracula = {
            foreground: "#f8f8f2",
            background: "#1e1f29",
            cursor: "#bbbbbb",

            black: "#000000",
            brightBlack: "#555555",

            red: "#ff5555",
            brightRed: "#ff5555",

            green: "#50fa7b",
            brightGreen: "#50fa7b",

            yellow: "#f1fa8c",
            brightYellow: "#f1fa8c",

            blue: "#bd93f9",
            brightBlue: "#bd93f9",

            magenta: "#ff79c6",
            brightMagenta: "#ff79c6",

            cyan: "#8be9fd",
            brightCyan: "#8be9fd",

            white: "#bbbbbb",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Duotone_Dark = {
            foreground: "#b7a1ff",
            background: "#1f1d27",
            cursor: "#ff9839",

            black: "#1f1d27",
            brightBlack: "#353147",

            red: "#d9393e",
            brightRed: "#d9393e",

            green: "#2dcd73",
            brightGreen: "#2dcd73",

            yellow: "#d9b76e",
            brightYellow: "#d9b76e",

            blue: "#ffc284",
            brightBlue: "#ffc284",

            magenta: "#de8d40",
            brightMagenta: "#de8d40",

            cyan: "#2488ff",
            brightCyan: "#2488ff",

            white: "#b7a1ff",
            brightWhite: "#eae5ff",
        };
        XtermTheme.Theme_Earthsong = {
            foreground: "#e5c7a9",
            background: "#292520",
            cursor: "#f6f7ec",

            black: "#121418",
            brightBlack: "#675f54",

            red: "#c94234",
            brightRed: "#ff645a",

            green: "#85c54c",
            brightGreen: "#98e036",

            yellow: "#f5ae2e",
            brightYellow: "#e0d561",

            blue: "#1398b9",
            brightBlue: "#5fdaff",

            magenta: "#d0633d",
            brightMagenta: "#ff9269",

            cyan: "#509552",
            brightCyan: "#84f088",

            white: "#e5c6aa",
            brightWhite: "#f6f7ec",
        };
        XtermTheme.Theme_Elemental = {
            foreground: "#807a74",
            background: "#22211d",
            cursor: "#facb80",

            black: "#3c3c30",
            brightBlack: "#555445",

            red: "#98290f",
            brightRed: "#e0502a",

            green: "#479a43",
            brightGreen: "#61e070",

            yellow: "#7f7111",
            brightYellow: "#d69927",

            blue: "#497f7d",
            brightBlue: "#79d9d9",

            magenta: "#7f4e2f",
            brightMagenta: "#cd7c54",

            cyan: "#387f58",
            brightCyan: "#59d599",

            white: "#807974",
            brightWhite: "#fff1e9",
        };
        XtermTheme.Theme_Elementary = {
            foreground: "#efefef",
            background: "#181818",
            cursor: "#bbbbbb",

            black: "#242424",
            brightBlack: "#4b4b4b",

            red: "#d71c15",
            brightRed: "#fc1c18",

            green: "#5aa513",
            brightGreen: "#6bc219",

            yellow: "#fdb40c",
            brightYellow: "#fec80e",

            blue: "#063b8c",
            brightBlue: "#0955ff",

            magenta: "#e40038",
            brightMagenta: "#fb0050",

            cyan: "#2595e1",
            brightCyan: "#3ea8fc",

            white: "#efefef",
            brightWhite: "#8c00ec",
        };
        XtermTheme.Theme_ENCOM = {
            foreground: "#00a595",
            background: "#000000",
            cursor: "#bbbbbb",

            black: "#000000",
            brightBlack: "#555555",

            red: "#9f0000",
            brightRed: "#ff0000",

            green: "#008b00",
            brightGreen: "#00ee00",

            yellow: "#ffd000",
            brightYellow: "#ffff00",

            blue: "#0081ff",
            brightBlue: "#0000ff",

            magenta: "#bc00ca",
            brightMagenta: "#ff00ff",

            cyan: "#008b8b",
            brightCyan: "#00cdcd",

            white: "#bbbbbb",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Espresso = {
            foreground: "#ffffff",
            background: "#323232",
            cursor: "#d6d6d6",

            black: "#353535",
            brightBlack: "#535353",

            red: "#d25252",
            brightRed: "#f00c0c",

            green: "#a5c261",
            brightGreen: "#c2e075",

            yellow: "#ffc66d",
            brightYellow: "#e1e48b",

            blue: "#6c99bb",
            brightBlue: "#8ab7d9",

            magenta: "#d197d9",
            brightMagenta: "#efb5f7",

            cyan: "#bed6ff",
            brightCyan: "#dcf4ff",

            white: "#eeeeec",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Espresso_Libre = {
            foreground: "#b8a898",
            background: "#2a211c",
            cursor: "#ffffff",

            black: "#000000",
            brightBlack: "#555753",

            red: "#cc0000",
            brightRed: "#ef2929",

            green: "#1a921c",
            brightGreen: "#9aff87",

            yellow: "#f0e53a",
            brightYellow: "#fffb5c",

            blue: "#0066ff",
            brightBlue: "#43a8ed",

            magenta: "#c5656b",
            brightMagenta: "#ff818a",

            cyan: "#06989a",
            brightCyan: "#34e2e2",

            white: "#d3d7cf",
            brightWhite: "#eeeeec",
        };
        XtermTheme.Theme_Fideloper = {
            foreground: "#dbdae0",
            background: "#292f33",
            cursor: "#d4605a",

            black: "#292f33",
            brightBlack: "#092028",

            red: "#cb1e2d",
            brightRed: "#d4605a",

            green: "#edb8ac",
            brightGreen: "#d4605a",

            yellow: "#b7ab9b",
            brightYellow: "#a86671",

            blue: "#2e78c2",
            brightBlue: "#7c85c4",

            magenta: "#c0236f",
            brightMagenta: "#5c5db2",

            cyan: "#309186",
            brightCyan: "#819090",

            white: "#eae3ce",
            brightWhite: "#fcf4df",
        };
        XtermTheme.Theme_FirefoxDev = {
            foreground: "#7c8fa4",
            background: "#0e1011",
            cursor: "#708284",

            black: "#002831",
            brightBlack: "#001e27",

            red: "#e63853",
            brightRed: "#e1003f",

            green: "#5eb83c",
            brightGreen: "#1d9000",

            yellow: "#a57706",
            brightYellow: "#cd9409",

            blue: "#359ddf",
            brightBlue: "#006fc0",

            magenta: "#d75cff",
            brightMagenta: "#a200da",

            cyan: "#4b73a2",
            brightCyan: "#005794",

            white: "#dcdcdc",
            brightWhite: "#e2e2e2",
        };
        XtermTheme.Theme_Firewatch = {
            foreground: "#9ba2b2",
            background: "#1e2027",
            cursor: "#f6f7ec",

            black: "#585f6d",
            brightBlack: "#585f6d",

            red: "#d95360",
            brightRed: "#d95360",

            green: "#5ab977",
            brightGreen: "#5ab977",

            yellow: "#dfb563",
            brightYellow: "#dfb563",

            blue: "#4d89c4",
            brightBlue: "#4c89c5",

            magenta: "#d55119",
            brightMagenta: "#d55119",

            cyan: "#44a8b6",
            brightCyan: "#44a8b6",

            white: "#e6e5ff",
            brightWhite: "#e6e5ff",
        };
        XtermTheme.Theme_FishTank = {
            foreground: "#ecf0fe",
            background: "#232537",
            cursor: "#fecd5e",

            black: "#03073c",
            brightBlack: "#6c5b30",

            red: "#c6004a",
            brightRed: "#da4b8a",

            green: "#acf157",
            brightGreen: "#dbffa9",

            yellow: "#fecd5e",
            brightYellow: "#fee6a9",

            blue: "#525fb8",
            brightBlue: "#b2befa",

            magenta: "#986f82",
            brightMagenta: "#fda5cd",

            cyan: "#968763",
            brightCyan: "#a5bd86",

            white: "#ecf0fc",
            brightWhite: "#f6ffec",
        };
        XtermTheme.Theme_Flat = {
            foreground: "#2cc55d",
            background: "#002240",
            cursor: "#e5be0c",

            black: "#222d3f",
            brightBlack: "#212c3c",

            red: "#a82320",
            brightRed: "#d4312e",

            green: "#32a548",
            brightGreen: "#2d9440",

            yellow: "#e58d11",
            brightYellow: "#e5be0c",

            blue: "#3167ac",
            brightBlue: "#3c7dd2",

            magenta: "#781aa0",
            brightMagenta: "#8230a7",

            cyan: "#2c9370",
            brightCyan: "#35b387",

            white: "#b0b6ba",
            brightWhite: "#e7eced",
        };
        XtermTheme.Theme_Flatland = {
            foreground: "#b8dbef",
            background: "#1d1f21",
            cursor: "#708284",

            black: "#1d1d19",
            brightBlack: "#1d1d19",

            red: "#f18339",
            brightRed: "#d22a24",

            green: "#9fd364",
            brightGreen: "#a7d42c",

            yellow: "#f4ef6d",
            brightYellow: "#ff8949",

            blue: "#5096be",
            brightBlue: "#61b9d0",

            magenta: "#695abc",
            brightMagenta: "#695abc",

            cyan: "#d63865",
            brightCyan: "#d63865",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Floraverse = {
            foreground: "#dbd1b9",
            background: "#0e0d15",
            cursor: "#bbbbbb",

            black: "#08002e",
            brightBlack: "#331e4d",

            red: "#64002c",
            brightRed: "#d02063",

            green: "#5d731a",
            brightGreen: "#b4ce59",

            yellow: "#cd751c",
            brightYellow: "#fac357",

            blue: "#1d6da1",
            brightBlue: "#40a4cf",

            magenta: "#b7077e",
            brightMagenta: "#f12aae",

            cyan: "#42a38c",
            brightCyan: "#62caa8",

            white: "#f3e0b8",
            brightWhite: "#fff5db",
        };
        XtermTheme.Theme_ForestBlue = {
            foreground: "#e2d8cd",
            background: "#051519",
            cursor: "#9e9ecb",

            black: "#333333",
            brightBlack: "#3d3d3d",

            red: "#f8818e",
            brightRed: "#fb3d66",

            green: "#92d3a2",
            brightGreen: "#6bb48d",

            yellow: "#1a8e63",
            brightYellow: "#30c85a",

            blue: "#8ed0ce",
            brightBlue: "#39a7a2",

            magenta: "#5e468c",
            brightMagenta: "#7e62b3",

            cyan: "#31658c",
            brightCyan: "#6096bf",

            white: "#e2d8cd",
            brightWhite: "#e2d8cd",
        };
        XtermTheme.Theme_FrontEndDelight = {
            foreground: "#adadad",
            background: "#1b1c1d",
            cursor: "#cdcdcd",

            black: "#242526",
            brightBlack: "#5fac6d",

            red: "#f8511b",
            brightRed: "#f74319",

            green: "#565747",
            brightGreen: "#74ec4c",

            yellow: "#fa771d",
            brightYellow: "#fdc325",

            blue: "#2c70b7",
            brightBlue: "#3393ca",

            magenta: "#f02e4f",
            brightMagenta: "#e75e4f",

            cyan: "#3ca1a6",
            brightCyan: "#4fbce6",

            white: "#adadad",
            brightWhite: "#8c735b",
        };
        XtermTheme.Theme_FunForrest = {
            foreground: "#dec165",
            background: "#251200",
            cursor: "#e5591c",

            black: "#000000",
            brightBlack: "#7f6a55",

            red: "#d6262b",
            brightRed: "#e55a1c",

            green: "#919c00",
            brightGreen: "#bfc65a",

            yellow: "#be8a13",
            brightYellow: "#ffcb1b",

            blue: "#4699a3",
            brightBlue: "#7cc9cf",

            magenta: "#8d4331",
            brightMagenta: "#d26349",

            cyan: "#da8213",
            brightCyan: "#e6a96b",

            white: "#ddc265",
            brightWhite: "#ffeaa3",
        };
        XtermTheme.Theme_Galaxy = {
            foreground: "#ffffff",
            background: "#1d2837",
            cursor: "#bbbbbb",

            black: "#000000",
            brightBlack: "#555555",

            red: "#f9555f",
            brightRed: "#fa8c8f",

            green: "#21b089",
            brightGreen: "#35bb9a",

            yellow: "#fef02a",
            brightYellow: "#ffff55",

            blue: "#589df6",
            brightBlue: "#589df6",

            magenta: "#944d95",
            brightMagenta: "#e75699",

            cyan: "#1f9ee7",
            brightCyan: "#3979bc",

            white: "#bbbbbb",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Github = {
            foreground: "#3e3e3e",
            background: "#f4f4f4",
            cursor: "#3f3f3f",

            black: "#3e3e3e",
            brightBlack: "#666666",

            red: "#970b16",
            brightRed: "#de0000",

            green: "#07962a",
            brightGreen: "#87d5a2",

            yellow: "#f8eec7",
            brightYellow: "#f1d007",

            blue: "#003e8a",
            brightBlue: "#2e6cba",

            magenta: "#e94691",
            brightMagenta: "#ffa29f",

            cyan: "#89d1ec",
            brightCyan: "#1cfafe",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Glacier = {
            foreground: "#ffffff",
            background: "#0c1115",
            cursor: "#6c6c6c",

            black: "#2e343c",
            brightBlack: "#404a55",

            red: "#bd0f2f",
            brightRed: "#bd0f2f",

            green: "#35a770",
            brightGreen: "#49e998",

            yellow: "#fb9435",
            brightYellow: "#fddf6e",

            blue: "#1f5872",
            brightBlue: "#2a8bc1",

            magenta: "#bd2523",
            brightMagenta: "#ea4727",

            cyan: "#778397",
            brightCyan: "#a0b6d3",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Grape = {
            foreground: "#9f9fa1",
            background: "#171423",
            cursor: "#a288f7",

            black: "#2d283f",
            brightBlack: "#59516a",

            red: "#ed2261",
            brightRed: "#f0729a",

            green: "#1fa91b",
            brightGreen: "#53aa5e",

            yellow: "#8ddc20",
            brightYellow: "#b2dc87",

            blue: "#487df4",
            brightBlue: "#a9bcec",

            magenta: "#8d35c9",
            brightMagenta: "#ad81c2",

            cyan: "#3bdeed",
            brightCyan: "#9de3eb",

            white: "#9e9ea0",
            brightWhite: "#a288f7",
        };
        XtermTheme.Theme_Grass = {
            foreground: "#fff0a5",
            background: "#13773d",
            cursor: "#8c2800",

            black: "#000000",
            brightBlack: "#555555",

            red: "#bb0000",
            brightRed: "#bb0000",

            green: "#00bb00",
            brightGreen: "#00bb00",

            yellow: "#e7b000",
            brightYellow: "#e7b000",

            blue: "#0000a3",
            brightBlue: "#0000bb",

            magenta: "#950062",
            brightMagenta: "#ff55ff",

            cyan: "#00bbbb",
            brightCyan: "#55ffff",

            white: "#bbbbbb",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Gruvbox_Dark = {
            foreground: "#e6d4a3",
            background: "#1e1e1e",
            cursor: "#bbbbbb",

            black: "#161819",
            brightBlack: "#7f7061",

            red: "#f73028",
            brightRed: "#be0f17",

            green: "#aab01e",
            brightGreen: "#868715",

            yellow: "#f7b125",
            brightYellow: "#cc881a",

            blue: "#719586",
            brightBlue: "#377375",

            magenta: "#c77089",
            brightMagenta: "#a04b73",

            cyan: "#7db669",
            brightCyan: "#578e57",

            white: "#faefbb",
            brightWhite: "#e6d4a3",
        };
        XtermTheme.Theme_Hardcore = {
            foreground: "#a0a0a0",
            background: "#121212",
            cursor: "#bbbbbb",

            black: "#1b1d1e",
            brightBlack: "#505354",

            red: "#f92672",
            brightRed: "#ff669d",

            green: "#a6e22e",
            brightGreen: "#beed5f",

            yellow: "#fd971f",
            brightYellow: "#e6db74",

            blue: "#66d9ef",
            brightBlue: "#66d9ef",

            magenta: "#9e6ffe",
            brightMagenta: "#9e6ffe",

            cyan: "#5e7175",
            brightCyan: "#a3babf",

            white: "#ccccc6",
            brightWhite: "#f8f8f2",
        };
        XtermTheme.Theme_Harper = {
            foreground: "#a8a49d",
            background: "#010101",
            cursor: "#a8a49d",

            black: "#010101",
            brightBlack: "#726e6a",

            red: "#f8b63f",
            brightRed: "#f8b63f",

            green: "#7fb5e1",
            brightGreen: "#7fb5e1",

            yellow: "#d6da25",
            brightYellow: "#d6da25",

            blue: "#489e48",
            brightBlue: "#489e48",

            magenta: "#b296c6",
            brightMagenta: "#b296c6",

            cyan: "#f5bfd7",
            brightCyan: "#f5bfd7",

            white: "#a8a49d",
            brightWhite: "#fefbea",
        };
        XtermTheme.Theme_Highway = {
            foreground: "#ededed",
            background: "#222225",
            cursor: "#e0d9b9",

            black: "#000000",
            brightBlack: "#5d504a",

            red: "#d00e18",
            brightRed: "#f07e18",

            green: "#138034",
            brightGreen: "#b1d130",

            yellow: "#ffcb3e",
            brightYellow: "#fff120",

            blue: "#006bb3",
            brightBlue: "#4fc2fd",

            magenta: "#6b2775",
            brightMagenta: "#de0071",

            cyan: "#384564",
            brightCyan: "#5d504a",

            white: "#ededed",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Hipster_Green = {
            foreground: "#84c138",
            background: "#100b05",
            cursor: "#23ff18",

            black: "#000000",
            brightBlack: "#666666",

            red: "#b6214a",
            brightRed: "#e50000",

            green: "#00a600",
            brightGreen: "#86a93e",

            yellow: "#bfbf00",
            brightYellow: "#e5e500",

            blue: "#246eb2",
            brightBlue: "#0000ff",

            magenta: "#b200b2",
            brightMagenta: "#e500e5",

            cyan: "#00a6b2",
            brightCyan: "#00e5e5",

            white: "#bfbfbf",
            brightWhite: "#e5e5e5",
        };
        XtermTheme.Theme_Homebrew = {
            foreground: "#00ff00",
            background: "#000000",
            cursor: "#23ff18",

            black: "#000000",
            brightBlack: "#666666",

            red: "#990000",
            brightRed: "#e50000",

            green: "#00a600",
            brightGreen: "#00d900",

            yellow: "#999900",
            brightYellow: "#e5e500",

            blue: "#0000b2",
            brightBlue: "#0000ff",

            magenta: "#b200b2",
            brightMagenta: "#e500e5",

            cyan: "#00a6b2",
            brightCyan: "#00e5e5",

            white: "#bfbfbf",
            brightWhite: "#e5e5e5",
        };
        XtermTheme.Theme_Hurtado = {
            foreground: "#dbdbdb",
            background: "#000000",
            cursor: "#bbbbbb",

            black: "#575757",
            brightBlack: "#262626",

            red: "#ff1b00",
            brightRed: "#d51d00",

            green: "#a5e055",
            brightGreen: "#a5df55",

            yellow: "#fbe74a",
            brightYellow: "#fbe84a",

            blue: "#496487",
            brightBlue: "#89beff",

            magenta: "#fd5ff1",
            brightMagenta: "#c001c1",

            cyan: "#86e9fe",
            brightCyan: "#86eafe",

            white: "#cbcccb",
            brightWhite: "#dbdbdb",
        };
        XtermTheme.Theme_Hybrid = {
            foreground: "#b7bcba",
            background: "#161719",
            cursor: "#b7bcba",

            black: "#2a2e33",
            brightBlack: "#1d1f22",

            red: "#b84d51",
            brightRed: "#8d2e32",

            green: "#b3bf5a",
            brightGreen: "#798431",

            yellow: "#e4b55e",
            brightYellow: "#e58a50",

            blue: "#6e90b0",
            brightBlue: "#4b6b88",

            magenta: "#a17eac",
            brightMagenta: "#6e5079",

            cyan: "#7fbfb4",
            brightCyan: "#4d7b74",

            white: "#b5b9b6",
            brightWhite: "#5a626a",
        };
        XtermTheme.Theme_IC_Green_PPL = {
            foreground: "#d9efd3",
            background: "#3a3d3f",
            cursor: "#42ff58",

            black: "#1f1f1f",
            brightBlack: "#032710",

            red: "#fb002a",
            brightRed: "#a7ff3f",

            green: "#339c24",
            brightGreen: "#9fff6d",

            yellow: "#659b25",
            brightYellow: "#d2ff6d",

            blue: "#149b45",
            brightBlue: "#72ffb5",

            magenta: "#53b82c",
            brightMagenta: "#50ff3e",

            cyan: "#2cb868",
            brightCyan: "#22ff71",

            white: "#e0ffef",
            brightWhite: "#daefd0",
        };
        XtermTheme.Theme_IC_Orange_PPL = {
            foreground: "#ffcb83",
            background: "#262626",
            cursor: "#fc531d",

            black: "#000000",
            brightBlack: "#6a4f2a",

            red: "#c13900",
            brightRed: "#ff8c68",

            green: "#a4a900",
            brightGreen: "#f6ff40",

            yellow: "#caaf00",
            brightYellow: "#ffe36e",

            blue: "#bd6d00",
            brightBlue: "#ffbe55",

            magenta: "#fc5e00",
            brightMagenta: "#fc874f",

            cyan: "#f79500",
            brightCyan: "#c69752",

            white: "#ffc88a",
            brightWhite: "#fafaff",
        };
        XtermTheme.Theme_idleToes = {
            foreground: "#ffffff",
            background: "#323232",
            cursor: "#d6d6d6",

            black: "#323232",
            brightBlack: "#535353",

            red: "#d25252",
            brightRed: "#f07070",

            green: "#7fe173",
            brightGreen: "#9dff91",

            yellow: "#ffc66d",
            brightYellow: "#ffe48b",

            blue: "#4099ff",
            brightBlue: "#5eb7f7",

            magenta: "#f680ff",
            brightMagenta: "#ff9dff",

            cyan: "#bed6ff",
            brightCyan: "#dcf4ff",

            white: "#eeeeec",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_IR_Black = {
            foreground: "#f1f1f1",
            background: "#000000",
            cursor: "#808080",

            black: "#4f4f4f",
            brightBlack: "#7b7b7b",

            red: "#fa6c60",
            brightRed: "#fcb6b0",

            green: "#a8ff60",
            brightGreen: "#cfffab",

            yellow: "#fffeb7",
            brightYellow: "#ffffcc",

            blue: "#96cafe",
            brightBlue: "#b5dcff",

            magenta: "#fa73fd",
            brightMagenta: "#fb9cfe",

            cyan: "#c6c5fe",
            brightCyan: "#e0e0fe",

            white: "#efedef",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Jackie_Brown = {
            foreground: "#ffcc2f",
            background: "#2c1d16",
            cursor: "#23ff18",

            black: "#2c1d16",
            brightBlack: "#666666",

            red: "#ef5734",
            brightRed: "#e50000",

            green: "#2baf2b",
            brightGreen: "#86a93e",

            yellow: "#bebf00",
            brightYellow: "#e5e500",

            blue: "#246eb2",
            brightBlue: "#0000ff",

            magenta: "#d05ec1",
            brightMagenta: "#e500e5",

            cyan: "#00acee",
            brightCyan: "#00e5e5",

            white: "#bfbfbf",
            brightWhite: "#e5e5e5",
        };
        XtermTheme.Theme_Japanesque = {
            foreground: "#f7f6ec",
            background: "#1e1e1e",
            cursor: "#edcf4f",

            black: "#343935",
            brightBlack: "#595b59",

            red: "#cf3f61",
            brightRed: "#d18fa6",

            green: "#7bb75b",
            brightGreen: "#767f2c",

            yellow: "#e9b32a",
            brightYellow: "#78592f",

            blue: "#4c9ad4",
            brightBlue: "#135979",

            magenta: "#a57fc4",
            brightMagenta: "#604291",

            cyan: "#389aad",
            brightCyan: "#76bbca",

            white: "#fafaf6",
            brightWhite: "#b2b5ae",
        };
        XtermTheme.Theme_Jellybeans = {
            foreground: "#dedede",
            background: "#121212",
            cursor: "#ffa560",

            black: "#929292",
            brightBlack: "#bdbdbd",

            red: "#e27373",
            brightRed: "#ffa1a1",

            green: "#94b979",
            brightGreen: "#bddeab",

            yellow: "#ffba7b",
            brightYellow: "#ffdca0",

            blue: "#97bedc",
            brightBlue: "#b1d8f6",

            magenta: "#e1c0fa",
            brightMagenta: "#fbdaff",

            cyan: "#00988e",
            brightCyan: "#1ab2a8",

            white: "#dedede",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_JetBrains_Darcula = {
            foreground: "#adadad",
            background: "#202020",
            cursor: "#ffffff",

            black: "#000000",
            brightBlack: "#555555",

            red: "#fa5355",
            brightRed: "#fb7172",

            green: "#126e00",
            brightGreen: "#67ff4f",

            yellow: "#c2c300",
            brightYellow: "#ffff00",

            blue: "#4581eb",
            brightBlue: "#6d9df1",

            magenta: "#fa54ff",
            brightMagenta: "#fb82ff",

            cyan: "#33c2c1",
            brightCyan: "#60d3d1",

            white: "#adadad",
            brightWhite: "#eeeeee",
        };
        XtermTheme.Theme_Kibble = {
            foreground: "#f7f7f7",
            background: "#0e100a",
            cursor: "#9fda9c",

            black: "#4d4d4d",
            brightBlack: "#5a5a5a",

            red: "#c70031",
            brightRed: "#f01578",

            green: "#29cf13",
            brightGreen: "#6ce05c",

            yellow: "#d8e30e",
            brightYellow: "#f3f79e",

            blue: "#3449d1",
            brightBlue: "#97a4f7",

            magenta: "#8400ff",
            brightMagenta: "#c495f0",

            cyan: "#0798ab",
            brightCyan: "#68f2e0",

            white: "#e2d1e3",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Later_This_Evening = {
            foreground: "#959595",
            background: "#222222",
            cursor: "#424242",

            black: "#2b2b2b",
            brightBlack: "#454747",

            red: "#d45a60",
            brightRed: "#d3232f",

            green: "#afba67",
            brightGreen: "#aabb39",

            yellow: "#e5d289",
            brightYellow: "#e5be39",

            blue: "#a0bad6",
            brightBlue: "#6699d6",

            magenta: "#c092d6",
            brightMagenta: "#ab53d6",

            cyan: "#91bfb7",
            brightCyan: "#5fc0ae",

            white: "#3c3d3d",
            brightWhite: "#c1c2c2",
        };
        XtermTheme.Theme_Lavandula = {
            foreground: "#736e7d",
            background: "#050014",
            cursor: "#8c91fa",

            black: "#230046",
            brightBlack: "#372d46",

            red: "#7d1625",
            brightRed: "#e05167",

            green: "#337e6f",
            brightGreen: "#52e0c4",

            yellow: "#7f6f49",
            brightYellow: "#e0c386",

            blue: "#4f4a7f",
            brightBlue: "#8e87e0",

            magenta: "#5a3f7f",
            brightMagenta: "#a776e0",

            cyan: "#58777f",
            brightCyan: "#9ad4e0",

            white: "#736e7d",
            brightWhite: "#8c91fa",
        };
        XtermTheme.Theme_LiquidCarbon = {
            foreground: "#afc2c2",
            background: "#303030",
            cursor: "#ffffff",

            black: "#000000",
            brightBlack: "#000000",

            red: "#ff3030",
            brightRed: "#ff3030",

            green: "#559a70",
            brightGreen: "#559a70",

            yellow: "#ccac00",
            brightYellow: "#ccac00",

            blue: "#0099cc",
            brightBlue: "#0099cc",

            magenta: "#cc69c8",
            brightMagenta: "#cc69c8",

            cyan: "#7ac4cc",
            brightCyan: "#7ac4cc",

            white: "#bccccc",
            brightWhite: "#bccccc",
        };
        XtermTheme.Theme_LiquidCarbonTransparent = {
            foreground: "#afc2c2",
            background: "#000000",
            cursor: "#ffffff",

            black: "#000000",
            brightBlack: "#000000",

            red: "#ff3030",
            brightRed: "#ff3030",

            green: "#559a70",
            brightGreen: "#559a70",

            yellow: "#ccac00",
            brightYellow: "#ccac00",

            blue: "#0099cc",
            brightBlue: "#0099cc",

            magenta: "#cc69c8",
            brightMagenta: "#cc69c8",

            cyan: "#7ac4cc",
            brightCyan: "#7ac4cc",

            white: "#bccccc",
            brightWhite: "#bccccc",
        };
        XtermTheme.Theme_LiquidCarbonTransparentInverse = {
            foreground: "#afc2c2",
            background: "#000000",
            cursor: "#ffffff",

            black: "#bccccd",
            brightBlack: "#ffffff",

            red: "#ff3030",
            brightRed: "#ff3030",

            green: "#559a70",
            brightGreen: "#559a70",

            yellow: "#ccac00",
            brightYellow: "#ccac00",

            blue: "#0099cc",
            brightBlue: "#0099cc",

            magenta: "#cc69c8",
            brightMagenta: "#cc69c8",

            cyan: "#7ac4cc",
            brightCyan: "#7ac4cc",

            white: "#000000",
            brightWhite: "#000000",
        };
        XtermTheme.Theme_Man_Page = {
            foreground: "#000000",
            background: "#fef49c",
            cursor: "#7f7f7f",

            black: "#000000",
            brightBlack: "#666666",

            red: "#cc0000",
            brightRed: "#e50000",

            green: "#00a600",
            brightGreen: "#00d900",

            yellow: "#999900",
            brightYellow: "#e5e500",

            blue: "#0000b2",
            brightBlue: "#0000ff",

            magenta: "#b200b2",
            brightMagenta: "#e500e5",

            cyan: "#00a6b2",
            brightCyan: "#00e5e5",

            white: "#cccccc",
            brightWhite: "#e5e5e5",
        };
        XtermTheme.Theme_Material = {
            foreground: "#232322",
            background: "#eaeaea",
            cursor: "#16afca",

            black: "#212121",
            brightBlack: "#424242",

            red: "#b7141f",
            brightRed: "#e83b3f",

            green: "#457b24",
            brightGreen: "#7aba3a",

            yellow: "#f6981e",
            brightYellow: "#ffea2e",

            blue: "#134eb2",
            brightBlue: "#54a4f3",

            magenta: "#560088",
            brightMagenta: "#aa4dbc",

            cyan: "#0e717c",
            brightCyan: "#26bbd1",

            white: "#efefef",
            brightWhite: "#d9d9d9",
        };
        XtermTheme.Theme_MaterialDark = {
            foreground: "#e5e5e5",
            background: "#232322",
            cursor: "#16afca",

            black: "#212121",
            brightBlack: "#424242",

            red: "#b7141f",
            brightRed: "#e83b3f",

            green: "#457b24",
            brightGreen: "#7aba3a",

            yellow: "#f6981e",
            brightYellow: "#ffea2e",

            blue: "#134eb2",
            brightBlue: "#54a4f3",

            magenta: "#560088",
            brightMagenta: "#aa4dbc",

            cyan: "#0e717c",
            brightCyan: "#26bbd1",

            white: "#efefef",
            brightWhite: "#d9d9d9",
        };
        XtermTheme.Theme_Mathias = {
            foreground: "#bbbbbb",
            background: "#000000",
            cursor: "#bbbbbb",

            black: "#000000",
            brightBlack: "#555555",

            red: "#e52222",
            brightRed: "#ff5555",

            green: "#a6e32d",
            brightGreen: "#55ff55",

            yellow: "#fc951e",
            brightYellow: "#ffff55",

            blue: "#c48dff",
            brightBlue: "#5555ff",

            magenta: "#fa2573",
            brightMagenta: "#ff55ff",

            cyan: "#67d9f0",
            brightCyan: "#55ffff",

            white: "#f2f2f2",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Medallion = {
            foreground: "#cac296",
            background: "#1d1908",
            cursor: "#d3ba30",

            black: "#000000",
            brightBlack: "#5e5219",

            red: "#b64c00",
            brightRed: "#ff9149",

            green: "#7c8b16",
            brightGreen: "#b2ca3b",

            yellow: "#d3bd26",
            brightYellow: "#ffe54a",

            blue: "#616bb0",
            brightBlue: "#acb8ff",

            magenta: "#8c5a90",
            brightMagenta: "#ffa0ff",

            cyan: "#916c25",
            brightCyan: "#ffbc51",

            white: "#cac29a",
            brightWhite: "#fed698",
        };
        XtermTheme.Theme_Misterioso = {
            foreground: "#e1e1e0",
            background: "#2d3743",
            cursor: "#000000",

            black: "#000000",
            brightBlack: "#555555",

            red: "#ff4242",
            brightRed: "#ff3242",

            green: "#74af68",
            brightGreen: "#74cd68",

            yellow: "#ffad29",
            brightYellow: "#ffb929",

            blue: "#338f86",
            brightBlue: "#23d7d7",

            magenta: "#9414e6",
            brightMagenta: "#ff37ff",

            cyan: "#23d7d7",
            brightCyan: "#00ede1",

            white: "#e1e1e0",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Molokai = {
            foreground: "#bbbbbb",
            background: "#121212",
            cursor: "#bbbbbb",

            black: "#121212",
            brightBlack: "#555555",

            red: "#fa2573",
            brightRed: "#f6669d",

            green: "#98e123",
            brightGreen: "#b1e05f",

            yellow: "#dfd460",
            brightYellow: "#fff26d",

            blue: "#1080d0",
            brightBlue: "#00afff",

            magenta: "#8700ff",
            brightMagenta: "#af87ff",

            cyan: "#43a8d0",
            brightCyan: "#51ceff",

            white: "#bbbbbb",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_MonaLisa = {
            foreground: "#f7d66a",
            background: "#120b0d",
            cursor: "#c46c32",

            black: "#351b0e",
            brightBlack: "#874228",

            red: "#9b291c",
            brightRed: "#ff4331",

            green: "#636232",
            brightGreen: "#b4b264",

            yellow: "#c36e28",
            brightYellow: "#ff9566",

            blue: "#515c5d",
            brightBlue: "#9eb2b4",

            magenta: "#9b1d29",
            brightMagenta: "#ff5b6a",

            cyan: "#588056",
            brightCyan: "#8acd8f",

            white: "#f7d75c",
            brightWhite: "#ffe598",
        };
        XtermTheme.Theme_Monokai_Soda = {
            foreground: "#c4c5b5",
            background: "#1a1a1a",
            cursor: "#f6f7ec",

            black: "#1a1a1a",
            brightBlack: "#625e4c",

            red: "#f4005f",
            brightRed: "#f4005f",

            green: "#98e024",
            brightGreen: "#98e024",

            yellow: "#fa8419",
            brightYellow: "#e0d561",

            blue: "#9d65ff",
            brightBlue: "#9d65ff",

            magenta: "#f4005f",
            brightMagenta: "#f4005f",

            cyan: "#58d1eb",
            brightCyan: "#58d1eb",

            white: "#c4c5b5",
            brightWhite: "#f6f6ef",
        };
        XtermTheme.Theme_Monokai_Vivid = {
            foreground: "#f9f9f9",
            background: "#121212",
            cursor: "#fb0007",

            black: "#121212",
            brightBlack: "#838383",

            red: "#fa2934",
            brightRed: "#f6669d",

            green: "#98e123",
            brightGreen: "#b1e05f",

            yellow: "#fff30a",
            brightYellow: "#fff26d",

            blue: "#0443ff",
            brightBlue: "#0443ff",

            magenta: "#f800f8",
            brightMagenta: "#f200f6",

            cyan: "#01b6ed",
            brightCyan: "#51ceff",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_N0tch2k = {
            foreground: "#a0a0a0",
            background: "#222222",
            cursor: "#aa9175",

            black: "#383838",
            brightBlack: "#474747",

            red: "#a95551",
            brightRed: "#a97775",

            green: "#666666",
            brightGreen: "#8c8c8c",

            yellow: "#a98051",
            brightYellow: "#a99175",

            blue: "#657d3e",
            brightBlue: "#98bd5e",

            magenta: "#767676",
            brightMagenta: "#a3a3a3",

            cyan: "#c9c9c9",
            brightCyan: "#dcdcdc",

            white: "#d0b8a3",
            brightWhite: "#d8c8bb",
        };
        XtermTheme.Theme_Neopolitan = {
            foreground: "#ffffff",
            background: "#271f19",
            cursor: "#ffffff",

            black: "#000000",
            brightBlack: "#000000",

            red: "#800000",
            brightRed: "#800000",

            green: "#61ce3c",
            brightGreen: "#61ce3c",

            yellow: "#fbde2d",
            brightYellow: "#fbde2d",

            blue: "#253b76",
            brightBlue: "#253b76",

            magenta: "#ff0080",
            brightMagenta: "#ff0080",

            cyan: "#8da6ce",
            brightCyan: "#8da6ce",

            white: "#f8f8f8",
            brightWhite: "#f8f8f8",
        };
        XtermTheme.Theme_Neutron = {
            foreground: "#e6e8ef",
            background: "#1c1e22",
            cursor: "#f6f7ec",

            black: "#23252b",
            brightBlack: "#23252b",

            red: "#b54036",
            brightRed: "#b54036",

            green: "#5ab977",
            brightGreen: "#5ab977",

            yellow: "#deb566",
            brightYellow: "#deb566",

            blue: "#6a7c93",
            brightBlue: "#6a7c93",

            magenta: "#a4799d",
            brightMagenta: "#a4799d",

            cyan: "#3f94a8",
            brightCyan: "#3f94a8",

            white: "#e6e8ef",
            brightWhite: "#ebedf2",
        };
        XtermTheme.Theme_NightLion_v1 = {
            foreground: "#bbbbbb",
            background: "#000000",
            cursor: "#bbbbbb",

            black: "#4c4c4c",
            brightBlack: "#555555",

            red: "#bb0000",
            brightRed: "#ff5555",

            green: "#5fde8f",
            brightGreen: "#55ff55",

            yellow: "#f3f167",
            brightYellow: "#ffff55",

            blue: "#276bd8",
            brightBlue: "#5555ff",

            magenta: "#bb00bb",
            brightMagenta: "#ff55ff",

            cyan: "#00dadf",
            brightCyan: "#55ffff",

            white: "#bbbbbb",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_NightLion_v2 = {
            foreground: "#bbbbbb",
            background: "#171717",
            cursor: "#bbbbbb",

            black: "#4c4c4c",
            brightBlack: "#555555",

            red: "#bb0000",
            brightRed: "#ff5555",

            green: "#04f623",
            brightGreen: "#7df71d",

            yellow: "#f3f167",
            brightYellow: "#ffff55",

            blue: "#64d0f0",
            brightBlue: "#62cbe8",

            magenta: "#ce6fdb",
            brightMagenta: "#ff9bf5",

            cyan: "#00dadf",
            brightCyan: "#00ccd8",

            white: "#bbbbbb",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Novel = {
            foreground: "#3b2322",
            background: "#dfdbc3",
            cursor: "#73635a",

            black: "#000000",
            brightBlack: "#808080",

            red: "#cc0000",
            brightRed: "#cc0000",

            green: "#009600",
            brightGreen: "#009600",

            yellow: "#d06b00",
            brightYellow: "#d06b00",

            blue: "#0000cc",
            brightBlue: "#0000cc",

            magenta: "#cc00cc",
            brightMagenta: "#cc00cc",

            cyan: "#0087cc",
            brightCyan: "#0087cc",

            white: "#cccccc",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Obsidian = {
            foreground: "#cdcdcd",
            background: "#283033",
            cursor: "#c0cad0",

            black: "#000000",
            brightBlack: "#555555",

            red: "#a60001",
            brightRed: "#ff0003",

            green: "#00bb00",
            brightGreen: "#93c863",

            yellow: "#fecd22",
            brightYellow: "#fef874",

            blue: "#3a9bdb",
            brightBlue: "#a1d7ff",

            magenta: "#bb00bb",
            brightMagenta: "#ff55ff",

            cyan: "#00bbbb",
            brightCyan: "#55ffff",

            white: "#bbbbbb",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Ocean = {
            foreground: "#ffffff",
            background: "#224fbc",
            cursor: "#7f7f7f",

            black: "#000000",
            brightBlack: "#666666",

            red: "#990000",
            brightRed: "#e50000",

            green: "#00a600",
            brightGreen: "#00d900",

            yellow: "#999900",
            brightYellow: "#e5e500",

            blue: "#0000b2",
            brightBlue: "#0000ff",

            magenta: "#b200b2",
            brightMagenta: "#e500e5",

            cyan: "#00a6b2",
            brightCyan: "#00e5e5",

            white: "#bfbfbf",
            brightWhite: "#e5e5e5",
        };
        XtermTheme.Theme_OceanicMaterial = {
            foreground: "#c2c8d7",
            background: "#1c262b",
            cursor: "#b3b8c3",

            black: "#000000",
            brightBlack: "#777777",

            red: "#ee2b2a",
            brightRed: "#dc5c60",

            green: "#40a33f",
            brightGreen: "#70be71",

            yellow: "#ffea2e",
            brightYellow: "#fff163",

            blue: "#1e80f0",
            brightBlue: "#54a4f3",

            magenta: "#8800a0",
            brightMagenta: "#aa4dbc",

            cyan: "#16afca",
            brightCyan: "#42c7da",

            white: "#a4a4a4",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Ollie = {
            foreground: "#8a8dae",
            background: "#222125",
            cursor: "#5b6ea7",

            black: "#000000",
            brightBlack: "#5b3725",

            red: "#ac2e31",
            brightRed: "#ff3d48",

            green: "#31ac61",
            brightGreen: "#3bff99",

            yellow: "#ac4300",
            brightYellow: "#ff5e1e",

            blue: "#2d57ac",
            brightBlue: "#4488ff",

            magenta: "#b08528",
            brightMagenta: "#ffc21d",

            cyan: "#1fa6ac",
            brightCyan: "#1ffaff",

            white: "#8a8eac",
            brightWhite: "#5b6ea7",
        };
        XtermTheme.Theme_OneHalfDark = {
            foreground: "#dcdfe4",
            background: "#282c34",
            cursor: "#a3b3cc",

            black: "#282c34",
            brightBlack: "#282c34",

            red: "#e06c75",
            brightRed: "#e06c75",

            green: "#98c379",
            brightGreen: "#98c379",

            yellow: "#e5c07b",
            brightYellow: "#e5c07b",

            blue: "#61afef",
            brightBlue: "#61afef",

            magenta: "#c678dd",
            brightMagenta: "#c678dd",

            cyan: "#56b6c2",
            brightCyan: "#56b6c2",

            white: "#dcdfe4",
            brightWhite: "#dcdfe4",
        };
        XtermTheme.Theme_OneHalfLight = {
            foreground: "#383a42",
            background: "#fafafa",
            cursor: "#bfceff",

            black: "#383a42",
            brightBlack: "#4f525e",

            red: "#e45649",
            brightRed: "#e06c75",

            green: "#50a14f",
            brightGreen: "#98c379",

            yellow: "#c18401",
            brightYellow: "#e5c07b",

            blue: "#0184bc",
            brightBlue: "#61afef",

            magenta: "#a626a4",
            brightMagenta: "#c678dd",

            cyan: "#0997b3",
            brightCyan: "#56b6c2",

            white: "#fafafa",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Pandora = {
            foreground: "#e1e1e1",
            background: "#141e43",
            cursor: "#43d58e",

            black: "#000000",
            brightBlack: "#3f5648",

            red: "#ff4242",
            brightRed: "#ff3242",

            green: "#74af68",
            brightGreen: "#74cd68",

            yellow: "#ffad29",
            brightYellow: "#ffb929",

            blue: "#338f86",
            brightBlue: "#23d7d7",

            magenta: "#9414e6",
            brightMagenta: "#ff37ff",

            cyan: "#23d7d7",
            brightCyan: "#00ede1",

            white: "#e2e2e2",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Paraiso_Dark = {
            foreground: "#a39e9b",
            background: "#2f1e2e",
            cursor: "#a39e9b",

            black: "#2f1e2e",
            brightBlack: "#776e71",

            red: "#ef6155",
            brightRed: "#ef6155",

            green: "#48b685",
            brightGreen: "#48b685",

            yellow: "#fec418",
            brightYellow: "#fec418",

            blue: "#06b6ef",
            brightBlue: "#06b6ef",

            magenta: "#815ba4",
            brightMagenta: "#815ba4",

            cyan: "#5bc4bf",
            brightCyan: "#5bc4bf",

            white: "#a39e9b",
            brightWhite: "#e7e9db",
        };
        XtermTheme.Theme_Parasio_Dark = {
            foreground: "#a39e9b",
            background: "#2f1e2e",
            cursor: "#a39e9b",

            black: "#2f1e2e",
            brightBlack: "#776e71",

            red: "#ef6155",
            brightRed: "#ef6155",

            green: "#48b685",
            brightGreen: "#48b685",

            yellow: "#fec418",
            brightYellow: "#fec418",

            blue: "#06b6ef",
            brightBlue: "#06b6ef",

            magenta: "#815ba4",
            brightMagenta: "#815ba4",

            cyan: "#5bc4bf",
            brightCyan: "#5bc4bf",

            white: "#a39e9b",
            brightWhite: "#e7e9db",
        };
        XtermTheme.Theme_PaulMillr = {
            foreground: "#f2f2f2",
            background: "#000000",
            cursor: "#4d4d4d",

            black: "#2a2a2a",
            brightBlack: "#666666",

            red: "#ff0000",
            brightRed: "#ff0080",

            green: "#79ff0f",
            brightGreen: "#66ff66",

            yellow: "#e7bf00",
            brightYellow: "#f3d64e",

            blue: "#396bd7",
            brightBlue: "#709aed",

            magenta: "#b449be",
            brightMagenta: "#db67e6",

            cyan: "#66ccff",
            brightCyan: "#7adff2",

            white: "#bbbbbb",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_PencilDark = {
            foreground: "#f1f1f1",
            background: "#212121",
            cursor: "#20bbfc",

            black: "#212121",
            brightBlack: "#424242",

            red: "#c30771",
            brightRed: "#fb007a",

            green: "#10a778",
            brightGreen: "#5fd7af",

            yellow: "#a89c14",
            brightYellow: "#f3e430",

            blue: "#008ec4",
            brightBlue: "#20bbfc",

            magenta: "#523c79",
            brightMagenta: "#6855de",

            cyan: "#20a5ba",
            brightCyan: "#4fb8cc",

            white: "#d9d9d9",
            brightWhite: "#f1f1f1",
        };
        XtermTheme.Theme_PencilLight = {
            foreground: "#424242",
            background: "#f1f1f1",
            cursor: "#20bbfc",

            black: "#212121",
            brightBlack: "#424242",

            red: "#c30771",
            brightRed: "#fb007a",

            green: "#10a778",
            brightGreen: "#5fd7af",

            yellow: "#a89c14",
            brightYellow: "#f3e430",

            blue: "#008ec4",
            brightBlue: "#20bbfc",

            magenta: "#523c79",
            brightMagenta: "#6855de",

            cyan: "#20a5ba",
            brightCyan: "#4fb8cc",

            white: "#d9d9d9",
            brightWhite: "#f1f1f1",
        };
        XtermTheme.Theme_Piatto_Light = {
            foreground: "#414141",
            background: "#ffffff",
            cursor: "#5e77c8",

            black: "#414141",
            brightBlack: "#3f3f3f",

            red: "#b23771",
            brightRed: "#db3365",

            green: "#66781e",
            brightGreen: "#829429",

            yellow: "#cd6f34",
            brightYellow: "#cd6f34",

            blue: "#3c5ea8",
            brightBlue: "#3c5ea8",

            magenta: "#a454b2",
            brightMagenta: "#a454b2",

            cyan: "#66781e",
            brightCyan: "#829429",

            white: "#ffffff",
            brightWhite: "#f2f2f2",
        };
        XtermTheme.Theme_Pnevma = {
            foreground: "#d0d0d0",
            background: "#1c1c1c",
            cursor: "#e4c9af",

            black: "#2f2e2d",
            brightBlack: "#4a4845",

            red: "#a36666",
            brightRed: "#d78787",

            green: "#90a57d",
            brightGreen: "#afbea2",

            yellow: "#d7af87",
            brightYellow: "#e4c9af",

            blue: "#7fa5bd",
            brightBlue: "#a1bdce",

            magenta: "#c79ec4",
            brightMagenta: "#d7beda",

            cyan: "#8adbb4",
            brightCyan: "#b1e7dd",

            white: "#d0d0d0",
            brightWhite: "#efefef",
        };
        XtermTheme.Theme_Pro = {
            foreground: "#f2f2f2",
            background: "#000000",
            cursor: "#4d4d4d",

            black: "#000000",
            brightBlack: "#666666",

            red: "#990000",
            brightRed: "#e50000",

            green: "#00a600",
            brightGreen: "#00d900",

            yellow: "#999900",
            brightYellow: "#e5e500",

            blue: "#2009db",
            brightBlue: "#0000ff",

            magenta: "#b200b2",
            brightMagenta: "#e500e5",

            cyan: "#00a6b2",
            brightCyan: "#00e5e5",

            white: "#bfbfbf",
            brightWhite: "#e5e5e5",
        };
        XtermTheme.Theme_Red_Alert = {
            foreground: "#ffffff",
            background: "#762423",
            cursor: "#ffffff",

            black: "#000000",
            brightBlack: "#262626",

            red: "#d62e4e",
            brightRed: "#e02553",

            green: "#71be6b",
            brightGreen: "#aff08c",

            yellow: "#beb86b",
            brightYellow: "#dfddb7",

            blue: "#489bee",
            brightBlue: "#65aaf1",

            magenta: "#e979d7",
            brightMagenta: "#ddb7df",

            cyan: "#6bbeb8",
            brightCyan: "#b7dfdd",

            white: "#d6d6d6",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Red_Sands = {
            foreground: "#d7c9a7",
            background: "#7a251e",
            cursor: "#ffffff",

            black: "#000000",
            brightBlack: "#555555",

            red: "#ff3f00",
            brightRed: "#bb0000",

            green: "#00bb00",
            brightGreen: "#00bb00",

            yellow: "#e7b000",
            brightYellow: "#e7b000",

            blue: "#0072ff",
            brightBlue: "#0072ae",

            magenta: "#bb00bb",
            brightMagenta: "#ff55ff",

            cyan: "#00bbbb",
            brightCyan: "#55ffff",

            white: "#bbbbbb",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Rippedcasts = {
            foreground: "#ffffff",
            background: "#2b2b2b",
            cursor: "#7f7f7f",

            black: "#000000",
            brightBlack: "#666666",

            red: "#cdaf95",
            brightRed: "#eecbad",

            green: "#a8ff60",
            brightGreen: "#bcee68",

            yellow: "#bfbb1f",
            brightYellow: "#e5e500",

            blue: "#75a5b0",
            brightBlue: "#86bdc9",

            magenta: "#ff73fd",
            brightMagenta: "#e500e5",

            cyan: "#5a647e",
            brightCyan: "#8c9bc4",

            white: "#bfbfbf",
            brightWhite: "#e5e5e5",
        };
        XtermTheme.Theme_Royal = {
            foreground: "#514968",
            background: "#100815",
            cursor: "#524966",

            black: "#241f2b",
            brightBlack: "#312d3d",

            red: "#91284c",
            brightRed: "#d5356c",

            green: "#23801c",
            brightGreen: "#2cd946",

            yellow: "#b49d27",
            brightYellow: "#fde83b",

            blue: "#6580b0",
            brightBlue: "#90baf9",

            magenta: "#674d96",
            brightMagenta: "#a479e3",

            cyan: "#8aaabe",
            brightCyan: "#acd4eb",

            white: "#524966",
            brightWhite: "#9e8cbd",
        };
        XtermTheme.Theme_Ryuuko = {
            foreground: "#ececec",
            background: "#2c3941",
            cursor: "#ececec",

            black: "#2c3941",
            brightBlack: "#5d7079",

            red: "#865f5b",
            brightRed: "#865f5b",

            green: "#66907d",
            brightGreen: "#66907d",

            yellow: "#b1a990",
            brightYellow: "#b1a990",

            blue: "#6a8e95",
            brightBlue: "#6a8e95",

            magenta: "#b18a73",
            brightMagenta: "#b18a73",

            cyan: "#88b2ac",
            brightCyan: "#88b2ac",

            white: "#ececec",
            brightWhite: "#ececec",
        };
        XtermTheme.Theme_Seafoam_Pastel = {
            foreground: "#d4e7d4",
            background: "#243435",
            cursor: "#57647a",

            black: "#757575",
            brightBlack: "#8a8a8a",

            red: "#825d4d",
            brightRed: "#cf937a",

            green: "#728c62",
            brightGreen: "#98d9aa",

            yellow: "#ada16d",
            brightYellow: "#fae79d",

            blue: "#4d7b82",
            brightBlue: "#7ac3cf",

            magenta: "#8a7267",
            brightMagenta: "#d6b2a1",

            cyan: "#729494",
            brightCyan: "#ade0e0",

            white: "#e0e0e0",
            brightWhite: "#e0e0e0",
        };
        XtermTheme.Theme_SeaShells = {
            foreground: "#deb88d",
            background: "#09141b",
            cursor: "#fca02f",

            black: "#17384c",
            brightBlack: "#434b53",

            red: "#d15123",
            brightRed: "#d48678",

            green: "#027c9b",
            brightGreen: "#628d98",

            yellow: "#fca02f",
            brightYellow: "#fdd39f",

            blue: "#1e4950",
            brightBlue: "#1bbcdd",

            magenta: "#68d4f1",
            brightMagenta: "#bbe3ee",

            cyan: "#50a3b5",
            brightCyan: "#87acb4",

            white: "#deb88d",
            brightWhite: "#fee4ce",
        };
        XtermTheme.Theme_Seti = {
            foreground: "#cacecd",
            background: "#111213",
            cursor: "#e3bf21",

            black: "#323232",
            brightBlack: "#323232",

            red: "#c22832",
            brightRed: "#c22832",

            green: "#8ec43d",
            brightGreen: "#8ec43d",

            yellow: "#e0c64f",
            brightYellow: "#e0c64f",

            blue: "#43a5d5",
            brightBlue: "#43a5d5",

            magenta: "#8b57b5",
            brightMagenta: "#8b57b5",

            cyan: "#8ec43d",
            brightCyan: "#8ec43d",

            white: "#eeeeee",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Shaman = {
            foreground: "#405555",
            background: "#001015",
            cursor: "#4afcd6",

            black: "#012026",
            brightBlack: "#384451",

            red: "#b2302d",
            brightRed: "#ff4242",

            green: "#00a941",
            brightGreen: "#2aea5e",

            yellow: "#5e8baa",
            brightYellow: "#8ed4fd",

            blue: "#449a86",
            brightBlue: "#61d5ba",

            magenta: "#00599d",
            brightMagenta: "#1298ff",

            cyan: "#5d7e19",
            brightCyan: "#98d028",

            white: "#405555",
            brightWhite: "#58fbd6",
        };
        XtermTheme.Theme_Slate = {
            foreground: "#35b1d2",
            background: "#222222",
            cursor: "#87d3c4",

            black: "#222222",
            brightBlack: "#ffffff",

            red: "#e2a8bf",
            brightRed: "#ffcdd9",

            green: "#81d778",
            brightGreen: "#beffa8",

            yellow: "#c4c9c0",
            brightYellow: "#d0ccca",

            blue: "#264b49",
            brightBlue: "#7ab0d2",

            magenta: "#a481d3",
            brightMagenta: "#c5a7d9",

            cyan: "#15ab9c",
            brightCyan: "#8cdfe0",

            white: "#02c5e0",
            brightWhite: "#e0e0e0",
        };
        XtermTheme.Theme_Smyck = {
            foreground: "#f7f7f7",
            background: "#1b1b1b",
            cursor: "#bbbbbb",

            black: "#000000",
            brightBlack: "#7a7a7a",

            red: "#b84131",
            brightRed: "#d6837c",

            green: "#7da900",
            brightGreen: "#c4f137",

            yellow: "#c4a500",
            brightYellow: "#fee14d",

            blue: "#62a3c4",
            brightBlue: "#8dcff0",

            magenta: "#ba8acc",
            brightMagenta: "#f79aff",

            cyan: "#207383",
            brightCyan: "#6ad9cf",

            white: "#a1a1a1",
            brightWhite: "#f7f7f7",
        };
        XtermTheme.Theme_SoftServer = {
            foreground: "#99a3a2",
            background: "#242626",
            cursor: "#d2e0de",

            black: "#000000",
            brightBlack: "#666c6c",

            red: "#a2686a",
            brightRed: "#dd5c60",

            green: "#9aa56a",
            brightGreen: "#bfdf55",

            yellow: "#a3906a",
            brightYellow: "#deb360",

            blue: "#6b8fa3",
            brightBlue: "#62b1df",

            magenta: "#6a71a3",
            brightMagenta: "#606edf",

            cyan: "#6ba58f",
            brightCyan: "#64e39c",

            white: "#99a3a2",
            brightWhite: "#d2e0de",
        };
        XtermTheme.Theme_Solarized_Darcula = {
            foreground: "#d2d8d9",
            background: "#3d3f41",
            cursor: "#708284",

            black: "#25292a",
            brightBlack: "#25292a",

            red: "#f24840",
            brightRed: "#f24840",

            green: "#629655",
            brightGreen: "#629655",

            yellow: "#b68800",
            brightYellow: "#b68800",

            blue: "#2075c7",
            brightBlue: "#2075c7",

            magenta: "#797fd4",
            brightMagenta: "#797fd4",

            cyan: "#15968d",
            brightCyan: "#15968d",

            white: "#d2d8d9",
            brightWhite: "#d2d8d9",
        };
        XtermTheme.Theme_Solarized_Dark = {
            foreground: "#708284",
            background: "#001e27",
            cursor: "#708284",

            black: "#002831",
            brightBlack: "#001e27",

            red: "#d11c24",
            brightRed: "#bd3613",

            green: "#738a05",
            brightGreen: "#475b62",

            yellow: "#a57706",
            brightYellow: "#536870",

            blue: "#2176c7",
            brightBlue: "#708284",

            magenta: "#c61c6f",
            brightMagenta: "#5956ba",

            cyan: "#259286",
            brightCyan: "#819090",

            white: "#eae3cb",
            brightWhite: "#fcf4dc",
        };
        XtermTheme.Theme_Solarized_Dark_Higher_Contrast = {
            foreground: "#9cc2c3",
            background: "#001e27",
            cursor: "#f34b00",

            black: "#002831",
            brightBlack: "#006488",

            red: "#d11c24",
            brightRed: "#f5163b",

            green: "#6cbe6c",
            brightGreen: "#51ef84",

            yellow: "#a57706",
            brightYellow: "#b27e28",

            blue: "#2176c7",
            brightBlue: "#178ec8",

            magenta: "#c61c6f",
            brightMagenta: "#e24d8e",

            cyan: "#259286",
            brightCyan: "#00b39e",

            white: "#eae3cb",
            brightWhite: "#fcf4dc",
        };
        XtermTheme.Theme_Solarized_Dark_Patched = {
            foreground: "#708284",
            background: "#001e27",
            cursor: "#708284",

            black: "#002831",
            brightBlack: "#475b62",

            red: "#d11c24",
            brightRed: "#bd3613",

            green: "#738a05",
            brightGreen: "#475b62",

            yellow: "#a57706",
            brightYellow: "#536870",

            blue: "#2176c7",
            brightBlue: "#708284",

            magenta: "#c61c6f",
            brightMagenta: "#5956ba",

            cyan: "#259286",
            brightCyan: "#819090",

            white: "#eae3cb",
            brightWhite: "#fcf4dc",
        };
        XtermTheme.Theme_Solarized_Light = {
            foreground: "#536870",
            background: "#fcf4dc",
            cursor: "#536870",

            black: "#002831",
            brightBlack: "#001e27",

            red: "#d11c24",
            brightRed: "#bd3613",

            green: "#738a05",
            brightGreen: "#475b62",

            yellow: "#a57706",
            brightYellow: "#536870",

            blue: "#2176c7",
            brightBlue: "#708284",

            magenta: "#c61c6f",
            brightMagenta: "#5956ba",

            cyan: "#259286",
            brightCyan: "#819090",

            white: "#eae3cb",
            brightWhite: "#fcf4dc",
        };
        XtermTheme.Theme_Spacedust = {
            foreground: "#ecf0c1",
            background: "#0a1e24",
            cursor: "#708284",

            black: "#6e5346",
            brightBlack: "#684c31",

            red: "#e35b00",
            brightRed: "#ff8a3a",

            green: "#5cab96",
            brightGreen: "#aecab8",

            yellow: "#e3cd7b",
            brightYellow: "#ffc878",

            blue: "#0f548b",
            brightBlue: "#67a0ce",

            magenta: "#e35b00",
            brightMagenta: "#ff8a3a",

            cyan: "#06afc7",
            brightCyan: "#83a7b4",

            white: "#f0f1ce",
            brightWhite: "#fefff1",
        };
        XtermTheme.Theme_SpaceGray = {
            foreground: "#b3b8c3",
            background: "#20242d",
            cursor: "#b3b8c3",

            black: "#000000",
            brightBlack: "#000000",

            red: "#b04b57",
            brightRed: "#b04b57",

            green: "#87b379",
            brightGreen: "#87b379",

            yellow: "#e5c179",
            brightYellow: "#e5c179",

            blue: "#7d8fa4",
            brightBlue: "#7d8fa4",

            magenta: "#a47996",
            brightMagenta: "#a47996",

            cyan: "#85a7a5",
            brightCyan: "#85a7a5",

            white: "#b3b8c3",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_SpaceGray_Eighties = {
            foreground: "#bdbaae",
            background: "#222222",
            cursor: "#bbbbbb",

            black: "#15171c",
            brightBlack: "#555555",

            red: "#ec5f67",
            brightRed: "#ff6973",

            green: "#81a764",
            brightGreen: "#93d493",

            yellow: "#fec254",
            brightYellow: "#ffd256",

            blue: "#5486c0",
            brightBlue: "#4d84d1",

            magenta: "#bf83c1",
            brightMagenta: "#ff55ff",

            cyan: "#57c2c1",
            brightCyan: "#83e9e4",

            white: "#efece7",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_SpaceGray_Eighties_Dull = {
            foreground: "#c9c6bc",
            background: "#222222",
            cursor: "#bbbbbb",

            black: "#15171c",
            brightBlack: "#555555",

            red: "#b24a56",
            brightRed: "#ec5f67",

            green: "#92b477",
            brightGreen: "#89e986",

            yellow: "#c6735a",
            brightYellow: "#fec254",

            blue: "#7c8fa5",
            brightBlue: "#5486c0",

            magenta: "#a5789e",
            brightMagenta: "#bf83c1",

            cyan: "#80cdcb",
            brightCyan: "#58c2c1",

            white: "#b3b8c3",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Spiderman = {
            foreground: "#e3e3e3",
            background: "#1b1d1e",
            cursor: "#2c3fff",

            black: "#1b1d1e",
            brightBlack: "#505354",

            red: "#e60813",
            brightRed: "#ff0325",

            green: "#e22928",
            brightGreen: "#ff3338",

            yellow: "#e24756",
            brightYellow: "#fe3a35",

            blue: "#2c3fff",
            brightBlue: "#1d50ff",

            magenta: "#2435db",
            brightMagenta: "#747cff",

            cyan: "#3256ff",
            brightCyan: "#6184ff",

            white: "#fffef6",
            brightWhite: "#fffff9",
        };
        XtermTheme.Theme_Spring = {
            foreground: "#4d4d4c",
            background: "#ffffff",
            cursor: "#4d4d4c",

            black: "#000000",
            brightBlack: "#000000",

            red: "#ff4d83",
            brightRed: "#ff0021",

            green: "#1f8c3b",
            brightGreen: "#1fc231",

            yellow: "#1fc95b",
            brightYellow: "#d5b807",

            blue: "#1dd3ee",
            brightBlue: "#15a9fd",

            magenta: "#8959a8",
            brightMagenta: "#8959a8",

            cyan: "#3e999f",
            brightCyan: "#3e999f",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Square = {
            foreground: "#acacab",
            background: "#1a1a1a",
            cursor: "#fcfbcc",

            black: "#050505",
            brightBlack: "#141414",

            red: "#e9897c",
            brightRed: "#f99286",

            green: "#b6377d",
            brightGreen: "#c3f786",

            yellow: "#ecebbe",
            brightYellow: "#fcfbcc",

            blue: "#a9cdeb",
            brightBlue: "#b6defb",

            magenta: "#75507b",
            brightMagenta: "#ad7fa8",

            cyan: "#c9caec",
            brightCyan: "#d7d9fc",

            white: "#f2f2f2",
            brightWhite: "#e2e2e2",
        };
        XtermTheme.Theme_Sundried = {
            foreground: "#c9c9c9",
            background: "#1a1818",
            cursor: "#ffffff",

            black: "#302b2a",
            brightBlack: "#4d4e48",

            red: "#a7463d",
            brightRed: "#aa000c",

            green: "#587744",
            brightGreen: "#128c21",

            yellow: "#9d602a",
            brightYellow: "#fc6a21",

            blue: "#485b98",
            brightBlue: "#7999f7",

            magenta: "#864651",
            brightMagenta: "#fd8aa1",

            cyan: "#9c814f",
            brightCyan: "#fad484",

            white: "#c9c9c9",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Symfonic = {
            foreground: "#ffffff",
            background: "#000000",
            cursor: "#dc322f",

            black: "#000000",
            brightBlack: "#1b1d21",

            red: "#dc322f",
            brightRed: "#dc322f",

            green: "#56db3a",
            brightGreen: "#56db3a",

            yellow: "#ff8400",
            brightYellow: "#ff8400",

            blue: "#0084d4",
            brightBlue: "#0084d4",

            magenta: "#b729d9",
            brightMagenta: "#b729d9",

            cyan: "#ccccff",
            brightCyan: "#ccccff",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Teerb = {
            foreground: "#d0d0d0",
            background: "#262626",
            cursor: "#e4c9af",

            black: "#1c1c1c",
            brightBlack: "#1c1c1c",

            red: "#d68686",
            brightRed: "#d68686",

            green: "#aed686",
            brightGreen: "#aed686",

            yellow: "#d7af87",
            brightYellow: "#e4c9af",

            blue: "#86aed6",
            brightBlue: "#86aed6",

            magenta: "#d6aed6",
            brightMagenta: "#d6aed6",

            cyan: "#8adbb4",
            brightCyan: "#b1e7dd",

            white: "#d0d0d0",
            brightWhite: "#efefef",
        };
        XtermTheme.Theme_Terminal_Basic = {
            foreground: "#000000",
            background: "#ffffff",
            cursor: "#7f7f7f",

            black: "#000000",
            brightBlack: "#666666",

            red: "#990000",
            brightRed: "#e50000",

            green: "#00a600",
            brightGreen: "#00d900",

            yellow: "#999900",
            brightYellow: "#e5e500",

            blue: "#0000b2",
            brightBlue: "#0000ff",

            magenta: "#b200b2",
            brightMagenta: "#e500e5",

            cyan: "#00a6b2",
            brightCyan: "#00e5e5",

            white: "#bfbfbf",
            brightWhite: "#e5e5e5",
        };
        XtermTheme.Theme_Thayer_Bright = {
            foreground: "#f8f8f8",
            background: "#1b1d1e",
            cursor: "#fc971f",

            black: "#1b1d1e",
            brightBlack: "#505354",

            red: "#f92672",
            brightRed: "#ff5995",

            green: "#4df840",
            brightGreen: "#b6e354",

            yellow: "#f4fd22",
            brightYellow: "#feed6c",

            blue: "#2757d6",
            brightBlue: "#3f78ff",

            magenta: "#8c54fe",
            brightMagenta: "#9e6ffe",

            cyan: "#38c8b5",
            brightCyan: "#23cfd5",

            white: "#ccccc6",
            brightWhite: "#f8f8f2",
        };
        XtermTheme.Theme_The_Hulk = {
            foreground: "#b5b5b5",
            background: "#1b1d1e",
            cursor: "#16b61b",

            black: "#1b1d1e",
            brightBlack: "#505354",

            red: "#269d1b",
            brightRed: "#8dff2a",

            green: "#13ce30",
            brightGreen: "#48ff77",

            yellow: "#63e457",
            brightYellow: "#3afe16",

            blue: "#2525f5",
            brightBlue: "#506b95",

            magenta: "#641f74",
            brightMagenta: "#72589d",

            cyan: "#378ca9",
            brightCyan: "#4085a6",

            white: "#d9d8d1",
            brightWhite: "#e5e6e1",
        };
        XtermTheme.Theme_Tomorrow = {
            foreground: "#4d4d4c",
            background: "#ffffff",
            cursor: "#4d4d4c",

            black: "#000000",
            brightBlack: "#000000",

            red: "#c82829",
            brightRed: "#c82829",

            green: "#718c00",
            brightGreen: "#718c00",

            yellow: "#eab700",
            brightYellow: "#eab700",

            blue: "#4271ae",
            brightBlue: "#4271ae",

            magenta: "#8959a8",
            brightMagenta: "#8959a8",

            cyan: "#3e999f",
            brightCyan: "#3e999f",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Tomorrow_Night = {
            foreground: "#c5c8c6",
            background: "#1d1f21",
            cursor: "#c5c8c6",

            black: "#000000",
            brightBlack: "#000000",

            red: "#cc6666",
            brightRed: "#cc6666",

            green: "#b5bd68",
            brightGreen: "#b5bd68",

            yellow: "#f0c674",
            brightYellow: "#f0c674",

            blue: "#81a2be",
            brightBlue: "#81a2be",

            magenta: "#b294bb",
            brightMagenta: "#b294bb",

            cyan: "#8abeb7",
            brightCyan: "#8abeb7",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Tomorrow_Night_Blue = {
            foreground: "#ffffff",
            background: "#002451",
            cursor: "#ffffff",

            black: "#000000",
            brightBlack: "#000000",

            red: "#ff9da4",
            brightRed: "#ff9da4",

            green: "#d1f1a9",
            brightGreen: "#d1f1a9",

            yellow: "#ffeead",
            brightYellow: "#ffeead",

            blue: "#bbdaff",
            brightBlue: "#bbdaff",

            magenta: "#ebbbff",
            brightMagenta: "#ebbbff",

            cyan: "#99ffff",
            brightCyan: "#99ffff",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Tomorrow_Night_Bright = {
            foreground: "#eaeaea",
            background: "#000000",
            cursor: "#eaeaea",

            black: "#000000",
            brightBlack: "#000000",

            red: "#d54e53",
            brightRed: "#d54e53",

            green: "#b9ca4a",
            brightGreen: "#b9ca4a",

            yellow: "#e7c547",
            brightYellow: "#e7c547",

            blue: "#7aa6da",
            brightBlue: "#7aa6da",

            magenta: "#c397d8",
            brightMagenta: "#c397d8",

            cyan: "#70c0b1",
            brightCyan: "#70c0b1",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Tomorrow_Night_Eighties = {
            foreground: "#cccccc",
            background: "#2d2d2d",
            cursor: "#cccccc",

            black: "#000000",
            brightBlack: "#000000",

            red: "#f2777a",
            brightRed: "#f2777a",

            green: "#99cc99",
            brightGreen: "#99cc99",

            yellow: "#ffcc66",
            brightYellow: "#ffcc66",

            blue: "#6699cc",
            brightBlue: "#6699cc",

            magenta: "#cc99cc",
            brightMagenta: "#cc99cc",

            cyan: "#66cccc",
            brightCyan: "#66cccc",

            white: "#ffffff",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_ToyChest = {
            foreground: "#31d07b",
            background: "#24364b",
            cursor: "#d5d5d5",

            black: "#2c3f58",
            brightBlack: "#336889",

            red: "#be2d26",
            brightRed: "#dd5944",

            green: "#1a9172",
            brightGreen: "#31d07b",

            yellow: "#db8e27",
            brightYellow: "#e7d84b",

            blue: "#325d96",
            brightBlue: "#34a6da",

            magenta: "#8a5edc",
            brightMagenta: "#ae6bdc",

            cyan: "#35a08f",
            brightCyan: "#42c3ae",

            white: "#23d183",
            brightWhite: "#d5d5d5",
        };
        XtermTheme.Theme_Treehouse = {
            foreground: "#786b53",
            background: "#191919",
            cursor: "#fac814",

            black: "#321300",
            brightBlack: "#433626",

            red: "#b2270e",
            brightRed: "#ed5d20",

            green: "#44a900",
            brightGreen: "#55f238",

            yellow: "#aa820c",
            brightYellow: "#f2b732",

            blue: "#58859a",
            brightBlue: "#85cfed",

            magenta: "#97363d",
            brightMagenta: "#e14c5a",

            cyan: "#b25a1e",
            brightCyan: "#f07d14",

            white: "#786b53",
            brightWhite: "#ffc800",
        };
        XtermTheme.Theme_Ubuntu = {
            foreground: "#eeeeec",
            background: "#300a24",
            cursor: "#bbbbbb",

            black: "#2e3436",
            brightBlack: "#555753",

            red: "#cc0000",
            brightRed: "#ef2929",

            green: "#4e9a06",
            brightGreen: "#8ae234",

            yellow: "#c4a000",
            brightYellow: "#fce94f",

            blue: "#3465a4",
            brightBlue: "#729fcf",

            magenta: "#75507b",
            brightMagenta: "#ad7fa8",

            cyan: "#06989a",
            brightCyan: "#34e2e2",

            white: "#d3d7cf",
            brightWhite: "#eeeeec",
        };
        XtermTheme.Theme_UnderTheSea = {
            foreground: "#ffffff",
            background: "#011116",
            cursor: "#4afcd6",

            black: "#022026",
            brightBlack: "#384451",

            red: "#b2302d",
            brightRed: "#ff4242",

            green: "#00a941",
            brightGreen: "#2aea5e",

            yellow: "#59819c",
            brightYellow: "#8ed4fd",

            blue: "#459a86",
            brightBlue: "#61d5ba",

            magenta: "#00599d",
            brightMagenta: "#1298ff",

            cyan: "#5d7e19",
            brightCyan: "#98d028",

            white: "#405555",
            brightWhite: "#58fbd6",
        };
        XtermTheme.Theme_Urple = {
            foreground: "#877a9b",
            background: "#1b1b23",
            cursor: "#a063eb",

            black: "#000000",
            brightBlack: "#5d3225",

            red: "#b0425b",
            brightRed: "#ff6388",

            green: "#37a415",
            brightGreen: "#29e620",

            yellow: "#ad5c42",
            brightYellow: "#f08161",

            blue: "#564d9b",
            brightBlue: "#867aed",

            magenta: "#6c3ca1",
            brightMagenta: "#a05eee",

            cyan: "#808080",
            brightCyan: "#eaeaea",

            white: "#87799c",
            brightWhite: "#bfa3ff",
        };
        XtermTheme.Theme_Vaughn = {
            foreground: "#dcdccc",
            background: "#25234f",
            cursor: "#ff5555",

            black: "#25234f",
            brightBlack: "#709080",

            red: "#705050",
            brightRed: "#dca3a3",

            green: "#60b48a",
            brightGreen: "#60b48a",

            yellow: "#dfaf8f",
            brightYellow: "#f0dfaf",

            blue: "#5555ff",
            brightBlue: "#5555ff",

            magenta: "#f08cc3",
            brightMagenta: "#ec93d3",

            cyan: "#8cd0d3",
            brightCyan: "#93e0e3",

            white: "#709080",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_VibrantInk = {
            foreground: "#ffffff",
            background: "#000000",
            cursor: "#ffffff",

            black: "#878787",
            brightBlack: "#555555",

            red: "#ff6600",
            brightRed: "#ff0000",

            green: "#ccff04",
            brightGreen: "#00ff00",

            yellow: "#ffcc00",
            brightYellow: "#ffff00",

            blue: "#44b4cc",
            brightBlue: "#0000ff",

            magenta: "#9933cc",
            brightMagenta: "#ff00ff",

            cyan: "#44b4cc",
            brightCyan: "#00ffff",

            white: "#f5f5f5",
            brightWhite: "#e5e5e5",
        };
        XtermTheme.Theme_Violet_Dark = {
            foreground: "#708284",
            background: "#1c1d1f",
            cursor: "#708284",

            black: "#56595c",
            brightBlack: "#45484b",

            red: "#c94c22",
            brightRed: "#bd3613",

            green: "#85981c",
            brightGreen: "#738a04",

            yellow: "#b4881d",
            brightYellow: "#a57705",

            blue: "#2e8bce",
            brightBlue: "#2176c7",

            magenta: "#d13a82",
            brightMagenta: "#c61c6f",

            cyan: "#32a198",
            brightCyan: "#259286",

            white: "#c9c6bd",
            brightWhite: "#c9c6bd",
        };
        XtermTheme.Theme_Violet_Light = {
            foreground: "#536870",
            background: "#fcf4dc",
            cursor: "#536870",

            black: "#56595c",
            brightBlack: "#45484b",

            red: "#c94c22",
            brightRed: "#bd3613",

            green: "#85981c",
            brightGreen: "#738a04",

            yellow: "#b4881d",
            brightYellow: "#a57705",

            blue: "#2e8bce",
            brightBlue: "#2176c7",

            magenta: "#d13a82",
            brightMagenta: "#c61c6f",

            cyan: "#32a198",
            brightCyan: "#259286",

            white: "#d3d0c9",
            brightWhite: "#c9c6bd",
        };
        XtermTheme.Theme_WarmNeon = {
            foreground: "#afdab6",
            background: "#404040",
            cursor: "#30ff24",

            black: "#000000",
            brightBlack: "#fefcfc",

            red: "#e24346",
            brightRed: "#e97071",

            green: "#39b13a",
            brightGreen: "#9cc090",

            yellow: "#dae145",
            brightYellow: "#ddda7a",

            blue: "#4261c5",
            brightBlue: "#7b91d6",

            magenta: "#f920fb",
            brightMagenta: "#f674ba",

            cyan: "#2abbd4",
            brightCyan: "#5ed1e5",

            white: "#d0b8a3",
            brightWhite: "#d8c8bb",
        };
        XtermTheme.Theme_Wez = {
            foreground: "#b3b3b3",
            background: "#000000",
            cursor: "#53ae71",

            black: "#000000",
            brightBlack: "#555555",

            red: "#cc5555",
            brightRed: "#ff5555",

            green: "#55cc55",
            brightGreen: "#55ff55",

            yellow: "#cdcd55",
            brightYellow: "#ffff55",

            blue: "#5555cc",
            brightBlue: "#5555ff",

            magenta: "#cc55cc",
            brightMagenta: "#ff55ff",

            cyan: "#7acaca",
            brightCyan: "#55ffff",

            white: "#cccccc",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_WildCherry = {
            foreground: "#dafaff",
            background: "#1f1726",
            cursor: "#dd00ff",

            black: "#000507",
            brightBlack: "#009cc9",

            red: "#d94085",
            brightRed: "#da6bac",

            green: "#2ab250",
            brightGreen: "#f4dca5",

            yellow: "#ffd16f",
            brightYellow: "#eac066",

            blue: "#883cdc",
            brightBlue: "#308cba",

            magenta: "#ececec",
            brightMagenta: "#ae636b",

            cyan: "#c1b8b7",
            brightCyan: "#ff919d",

            white: "#fff8de",
            brightWhite: "#e4838d",
        };
        XtermTheme.Theme_Wombat = {
            foreground: "#dedacf",
            background: "#171717",
            cursor: "#bbbbbb",

            black: "#000000",
            brightBlack: "#313131",

            red: "#ff615a",
            brightRed: "#f58c80",

            green: "#b1e969",
            brightGreen: "#ddf88f",

            yellow: "#ebd99c",
            brightYellow: "#eee5b2",

            blue: "#5da9f6",
            brightBlue: "#a5c7ff",

            magenta: "#e86aff",
            brightMagenta: "#ddaaff",

            cyan: "#82fff7",
            brightCyan: "#b7fff9",

            white: "#dedacf",
            brightWhite: "#ffffff",
        };
        XtermTheme.Theme_Wryan = {
            foreground: "#999993",
            background: "#101010",
            cursor: "#9e9ecb",

            black: "#333333",
            brightBlack: "#3d3d3d",

            red: "#8c4665",
            brightRed: "#bf4d80",

            green: "#287373",
            brightGreen: "#53a6a6",

            yellow: "#7c7c99",
            brightYellow: "#9e9ecb",

            blue: "#395573",
            brightBlue: "#477ab3",

            magenta: "#5e468c",
            brightMagenta: "#7e62b3",

            cyan: "#31658c",
            brightCyan: "#6096bf",

            white: "#899ca1",
            brightWhite: "#c0c0c0",
        };
        XtermTheme.Theme_Zenburn = {
            foreground: "#dcdccc",
            background: "#3f3f3f",
            cursor: "#73635a",

            black: "#4d4d4d",
            brightBlack: "#709080",

            red: "#705050",
            brightRed: "#dca3a3",

            green: "#60b48a",
            brightGreen: "#c3bf9f",

            yellow: "#f0dfaf",
            brightYellow: "#e0cf9f",

            blue: "#506070",
            brightBlue: "#94bff3",

            magenta: "#dc8cc3",
            brightMagenta: "#ec93d3",

            cyan: "#8cd0d3",
            brightCyan: "#93e0e3",

            white: "#dcdccc",
            brightWhite: "#ffffff",
        };
    })();
    if (localStorage.getItem("BetterXESCppClass_xterm_theme") === null) {
        localStorage.setItem(
            "BetterXESCppClass_xterm_theme",
            "Theme_3024_Night",
        );
    }
    if (localStorage.getItem("BetterXESCppClass_cpp_template") === null) {
        localStorage.setItem(
            "BetterXESCppClass_cpp_template",
            `
#include<cstdio>
#include<cmath>
#include<cstring>
#include<iostream>
#include<string>
#include<queue>
#include<vector>
#include<algorithm>
using namespace std;
/**
 * 这是 Better XES C++ Class 提供的默认代码
 * (好像没什么用。。。)
 * 
 * 你可以通过在代码块上面、字体选择按钮左边的
 * “设为模板”按钮来自定义基础模板
 * 
 */

int main(){
	
	return 0;
}
        `.trim() + "\n",
        );
    }

    function formatDateTime(obj) {
        if (obj == null) {
            return null
        }
        let date = new Date(obj);
        let y = 1900 + date.getYear();
        let m = "0" + (date.getMonth() + 1);
        let d = "0" + date.getDate();
        return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
    }

    // 与Xterm、VueElementMixin类、运行无频率限制使用的借鉴了凌的代码
    // xterm-original from xtermjs.org
    let xterm_theme =
        XtermTheme[localStorage.getItem("BetterXESCppClass_xterm_theme")];
    /**
     * @template T
     * @template {keyof T} Key
     * @param {T} obj
     * @param {Key} p
     * @param {(fn: T[Key]) => T[Key]} fn
     */
    function patch(obj, p, fn) {
        if (obj[p]) obj[p] = fn(obj[p]);
    }

    class VueElementMixin {
        constructor() {
            this._events = new Map();
        }
        on(tagName, fn) {
            const v = this._events.get(tagName);
            if (v) v.push(fn);
            else this._events.set(tagName, [fn]);
        }
        emit(instance) {
            const tag =
                instance.$vnode?.componentOptions?.tag ??
                instance._vnode?.componentOptions?.tag ??
                instance.$vnode?.tag?.split("-")?.at(-1);
            console.log("vue - " + tag, instance);
            if (this._events.has(tag)) {
                for (const v of this._events.get(tag)) {
                    try {
                        v(instance);
                    } catch (e) {
                        logger.error(e);
                    }
                }
            }
        }
    }
    const webpackListener = [];
    function requireVue(callback) {
        let captured = false;
        patch(Function.prototype, "call", (call) => {
            return function (self, ...args) {
                if (
                    args.length === 3 &&
                    typeof args[0] === "object" &&
                    args[0] !== null &&
                    typeof args[1] === "object" &&
                    args[1] !== null &&
                    typeof args[2] === "function" &&
                    args[0].exports
                ) {
                    const fn = this;
                    // const require = args[2]
                    const str = fn.toString();
                    if (str.includes("ENABLE_XES_CONSOLE")) {
                        return;
                    }
                    const res = call.apply(this, [self, ...args]);
                    const exports = args[0].exports;
                    if (!exports) return res;
                    webpackListener.forEach((v) => v(exports));
                    if (
                        typeof exports.default === "function" &&
                        typeof exports.default.version === "string" &&
                        !captured && self.default.prototype !== undefined
                    ) {
                        // This is vue.
                        console.log("Vue", self.default);
                        captured = true;
                        callback(self.default);
                    }
                    return res;
                } else return call.apply(this, [self, ...args]);
            };
        });
    }
    function addStyle(css) {
        if (css instanceof URL) {
            const style = document.createElement("link");
            style.rel = "stylesheet";
            style.href = css.toString();
            document.documentElement.appendChild(style);
        } else {
            const style = document.createElement("style");
            style.textContent = css;
            document.documentElement.appendChild(style);
        }
    }
    const vueMixinManager = new VueElementMixin();
    requireVue((Vue) => {
        patch(Vue.prototype, "_init", (_init) => {
            return function (args) {
                _init.call(this, args);
                vueMixinManager.emit(this);
            };
        });
    });

    // 各种编辑器优化。
    (() => {
        // replace default code
        (() => {
            let loaded = false;
            // Universal (Vue.js / React) patch
            webpackListener.push((exports) => {
                if (
                    typeof exports === "function" &&
                    exports.default === exports &&
                    typeof exports.Axios === "function" &&
                    !loaded
                ) {
                    loaded = true;
                    exports.interceptors.response.use(function (resp) {
                        console.log("rerere", resp);

                        if (window.location.pathname.startsWith("/live/creator/")) {
                            if (resp.config.url.startsWith("/live/compiler/v3/detail")) {
                                let template = JSON.parse(
                                    resp.data.data.oj_problem.template,
                                );
                                template["C++"] = localStorage.getItem(
                                    "BetterXESCppClass_cpp_template",
                                );
                                resp.data.data.oj_problem.template =
                                    JSON.stringify(template);
                            } else if (resp.config.url.startsWith("/studycenter/problem_list")) {
                                /**
                                 * 破解有的题目上课前被锁，可以强制解锁了！
                                 */
                                resp.data.data.lock_status = 0;
                                resp.data.data.list.forEach((topic) => {
                                    topic.lock_status = 0;
                                    topic.class_end_unlock = 1;
                                });
                            }
                        }
                        return resp;
                    });
                }
            });
        })();
        // no timer
        (() => {
            let loaded = false;
            vueMixinManager.on("IdeEditor", (instance) => {
                instance.fnTryLockRun = () => {
                    return true;
                };
                if (window.Sk && !loaded) {
                    loaded = true;
                    let v = Infinity;
                    Object.defineProperty(window.Sk, "execLimit", {
                        get: () => v,
                        set: (val) => {
                            if (val == 1) {
                                v = 1;
                                queueMicrotask(() => {
                                    v = Infinity;
                                });
                            }
                        },
                    });
                    Object.defineProperty(window.Sk, "yieldLimit", {
                        get: () => Infinity,
                        set: () => { },
                    });
                }
            });
        })();
        // xterm v5
        addStyle(
            new URL(
                "https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/css/xterm.min.css",
            ),
        );
        addStyle(`
/* 设置滚动条的宽度 */
.xterm-viewport::-webkit-scrollbar {
    width: 12px;
}

.xterm-viewport::-webkit-scrollbar-track {
    background-color: #ffffff10;
    border: 2px solid #7e7e7e;
    border-radius: 8px;
}

.xterm-viewport::-webkit-scrollbar-track:hover {
    background-color: #ffffff20;
    border: 2px solid #7e7e7e;
    border-radius: 8px;
}

.xterm-viewport::-webkit-scrollbar-thumb {
    background-color: #f1f1f1aa;
    border: 2px solid #616161;
    border-radius: 8px;
}

.xterm-viewport::-webkit-scrollbar-thumb:hover {
    background-color: #f1f1f1;
    border: 2px solid #616161;
    border-radius: 8px;
}
        `);
        class Decoder {
            constructor() {
                this.bytesLeft = 0;
                this.codePoint = 0;
                this.lowerBound = 0;
            }
            decode(data) {
                let tmp = "";
                for (let idx = 0; idx < data.length; idx++) {
                    const code = data.charCodeAt(idx);
                    if (0 === this.bytesLeft) {
                        if (code <= 127) tmp += data.charAt(idx);
                        else if (192 <= code && code <= 223) {
                            this.codePoint = code - 192;
                            this.bytesLeft = 1;
                            this.lowerBound = 128;
                        } else if (224 <= code && code <= 239) {
                            this.codePoint = code - 224;
                            this.bytesLeft = 2;
                            this.lowerBound = 2048;
                        } else if (240 <= code && code <= 247) {
                            this.codePoint = code - 240;
                            this.bytesLeft = 3;
                            this.lowerBound = 65536;
                        } else if (248 <= code && code <= 251) {
                            this.codePoint = code - 248;
                            this.bytesLeft = 4;
                            this.lowerBound = 2097152;
                        } else if (252 <= code && code <= 253) {
                            this.codePoint = code - 252;
                            this.bytesLeft = 5;
                            this.lowerBound = 67108864;
                        } else tmp += "�";
                    } else if (128 <= code && code <= 191) {
                        this.bytesLeft--;
                        this.codePoint = (this.codePoint << 6) + (code - 128);
                        if (this.bytesLeft === 0) {
                            const charCode = this.codePoint;
                            if (
                                charCode < this.lowerBound ||
                                (55296 <= charCode && charCode <= 57343) ||
                                charCode > 1114111
                            )
                                tmp += "�";
                            else if (charCode < 65536)
                                tmp += String.fromCharCode(charCode);
                            else {
                                charCode -= 65536;
                                tmp += String.fromCharCode(
                                    55296 + ((charCode >>> 10) & 1023),
                                    56320 + (1023 & charCode),
                                );
                            }
                        }
                    } else {
                        tmp += "�";
                        this.bytesLeft = 0;
                        idx--;
                    }
                }
                return tmp;
            }
        }
        const decoderInstance = new Decoder();
        class Xterm {
            constructor(
                elem,
                Terminal,
                WebglAddon,
                FitAddon,
                Unicode11Addon,
                CanvasAddon,
                WebLinksAddon,
            ) {
                this.elem = elem;
                this.term = new Terminal({
                    fontSize: 15,
                    fontFamily:
                        '"Jetbrains Mono", "Fira Code", "Cascadia Code", "Noto Emoji", "Segoe UI Emoji", "Lucida Console", Menlo, courier-new, courier, monospace',
                    theme: xterm_theme,
                    cursorBlink: true,
                    allowProposedApi: true,
                    allowTransparency: true,
                    cursorStyle: "bar",
                });
                this.term.on = () => { };
                this.term.setOption = (name, value) => {
                    this.term.options[name] = value;
                    this.fit();
                };
                this.fitAddon = new FitAddon();
                this.term.loadAddon(this.fitAddon);
                try {
                    this.term.loadAddon(new WebglAddon());
                } catch {
                    this.term.loadAddon(new CanvasAddon());
                }
                this.term.loadAddon(new Unicode11Addon());
                this.term.unicode.activeVersion = "11";
                this.term.loadAddon(new WebLinksAddon());
                this.term.onData((e) => {
                    if (
                        window.WebpyInputCtrl &&
                        window.WebpyInputCtrl.runByWebPy
                    ) {
                        const n =
                            !!window.WebpyInputCtrl &&
                            window.WebpyInputCtrl.onData(e);
                        if (n !== false) {
                            if (n === true) this.write(e);
                            else this.write(n);
                        }
                    }
                });
                this.term.open(elem);
                this.fit();
                window.addEventListener(
                    "resize",
                    (this.resizeListener = () => this.fit()),
                );
                this.term.focus();
                this.term.blur();
                this.resizeHandler = null;
                this.activate = true;
                this.decoder = decoderInstance;

                // 支持复制粘贴
                this.term.onData((val) => {
                    if (val == "\x03") {
                        // Ctrl+C
                        navigator.clipboard.writeText(this.term_copy);
                    } else if (val == "\x16") {
                        // Ctrl+V
                        navigator.clipboard.readText().then((clipText) => {
                            let _data = new DataTransfer();
                            _data.effectAllowed = "uninitialized";
                            _data.setData("text/plain", clipText);

                            let _event = new ClipboardEvent("paste", {
                                clipboardData: _data,
                            });

                            document.activeElement.dispatchEvent(_event);
                        });
                    }
                });

                this.term.onSelectionChange(() => {
                    if (this.term.hasSelection()) {
                        this.term_copy = this.term.getSelection();
                    }
                });
            }
            fit() {
                this.fitAddon.fit();
            }
            info() {
                return {
                    columns: this.term.cols,
                    rows: this.term.rows,
                };
            }
            output(e) {
                const n = this.decode(e);
                this.term.write(n);
                // var n = this.decoder.decode(e)
                // t(n) || this.term.write(n)
            }
            decode(data) {
                return this.decoder.decode(data);
            }
            outputNoEncode(e) {
                this.term.write(e);
            }
            write(e) {
                this.term.write(e);
            }
            writeln(e) {
                this.term.writeln(e);
            }
            showMessage(_message, _timeout) {
                // Unused
            }
            removeMessage() {
                // Unused
            }
            setWindowTitle(title) {
                document.title = title;
            }
            setPreferences(_options) {
                // Unused
            }
            onInput(callback) {
                this.term.onData((ev) => {
                    if (this.activate) callback(ev);
                });
            }
            onResize(callback) {
                this.term.onResize((ev) => {
                    if (this.activate) callback(ev.cols, ev.rows);
                });
            }
            deactivate() {
                // if (this.resizeHandler) this.resizeHandler.dispose()
                this.activate = false;
                this.term.blur();
            }
            reset() {
                this.term.clear();
                this.term.reset();
            }
            close() {
                window.removeEventListener("resize", this.resizeListener);
                this.term.dispose();
            }
        }
        let termInstance = null;
        vueMixinManager.on("IdeEditor", (instance) => {
            patch(instance, "fnRunCode", (fnRunCode) => {
                return function (...args) {
                    if (termInstance) termInstance.activate = true;
                    return fnRunCode.call(this, ...args);
                };
            });
        });
        const xtermDeps = Promise.all([
            import("https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/+esm"),
            import(
                "https://cdn.jsdelivr.net/npm/@xterm/addon-webgl@0.18.0/+esm"
            ),
            import("https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/+esm"),
            import(
                "https://cdn.jsdelivr.net/npm/@xterm/addon-unicode11@0.8.0/+esm"
            ),
            import(
                "https://cdn.jsdelivr.net/npm/@xterm/addon-canvas@0.7.0/+esm"
            ),
            import(
                "https://cdn.jsdelivr.net/npm/@xterm/addon-web-links@0.11.0/+esm"
            ),
        ]);
        vueMixinManager.on("WsTermComp", (instance) => {
            const fnInitWS = instance.fnInitWS;
            instance.fnInitWS = async function (api) {
                // 移植自 XesExt v2
                const xterm = document.getElementById("terminal");
                if (xterm && this.canInitWs) {
                    if (!this.xterm) {
                        xterm.style.backgroundColor =
                            xterm.parentNode.style.backgroundColor =
                            xterm_theme.background;
                        const [
                            { Terminal },
                            { WebglAddon },
                            { FitAddon },
                            { Unicode11Addon },
                            { CanvasAddon },
                            { WebLinksAddon },
                        ] = await xtermDeps;
                        termInstance = this.xterm = new Xterm(
                            xterm,
                            Terminal,
                            WebglAddon,
                            FitAddon,
                            Unicode11Addon,
                            CanvasAddon,
                            WebLinksAddon,
                        );
                        this.xterm.term.options.fontSize = Number(
                            this.fontSize,
                        );
                        try {
                            // 添加用户自定义样式选择
                            addStyle(`
    @media screen and (max-width: 1200px) {
        .xterm_terminal_theme_select {
            min-width: 30px !important;
            height: 30px !important;
        }
    }
    .xterm_terminal_theme_select, .xterm_terminal_theme_select_option {
        min-width: 40px;
        color: #fea529;
        background: #fff;
        border-radius: 20px;
        border: 2px solid #fea529;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 40px;
        font-size: 13px;
        margin: 0 12px;
        padding: 0 20px;
        white-space: nowrap;
        cursor: pointer;
    }
    xterm_terminal_theme_select:focus>xterm_terminal_theme_select_option:hover {
        background: #fea529;
        color: #fff;
    }
    .xterm_terminal_theme_select:focus, .xterm_terminal_theme_select_option:focus { outline: none;}
                            `);
                            let _select = document.createElement("select");
                            _select.classList.add(
                                "xterm_terminal_theme_select",
                            );
                            _select.title = "终端主题选择";
                            Object.getOwnPropertyNames(XtermTheme).forEach(
                                (_theme) => {
                                    let _option =
                                        document.createElement("option");
                                    _option.classList.add(
                                        "xterm_terminal_theme_select_option",
                                    );
                                    _option.value = _theme;
                                    _option.title = _option.textContent =
                                        _theme.substring(6, _theme.length);
                                    _select.appendChild(_option);
                                },
                            );
                            function getActualWidthOfChars(text, options = {}) {
                                const { size = 13, family = "Segoe UI" } =
                                    options;
                                const canvas = document.createElement("canvas");
                                const ctx = canvas.getContext("2d");
                                ctx.font = `${size}px ${family}`;
                                const metrics = ctx.measureText(text);
                                const actual =
                                    Math.abs(metrics.actualBoundingBoxLeft) +
                                    Math.abs(metrics.actualBoundingBoxRight);
                                return Math.max(metrics.width, actual);
                            }
                            _select.addEventListener("change", (_event) => {
                                _select.style.width = `${getActualWidthOfChars(_select.options[_select.selectedIndex].textContent) + 70 < 100 ? getActualWidthOfChars(_select.options[_select.selectedIndex].textContent) + 70 : 100}px`;
                                _select.title =
                                    "终端主题选择 - " +
                                    _select.options[_select.selectedIndex]
                                        .textContent;
                                this.xterm.term.options.theme = xterm_theme =
                                    XtermTheme[
                                    _select.options[_select.selectedIndex]
                                        .value
                                    ];
                                xterm.style.backgroundColor =
                                    xterm.parentNode.style.backgroundColor =
                                    xterm_theme.background;
                                localStorage.setItem(
                                    "BetterXESCppClass_xterm_theme",
                                    _select.options[_select.selectedIndex]
                                        .value,
                                );
                            });
                            _select.style.width = `${getActualWidthOfChars(_select.options[_select.selectedIndex].textContent) + 70 < 100 ? getActualWidthOfChars(_select.options[_select.selectedIndex].textContent) + 70 : 100}px`;
                            _select.selectedIndex = Object.getOwnPropertyNames(
                                XtermTheme,
                            ).indexOf(
                                localStorage.getItem(
                                    "BetterXESCppClass_xterm_theme",
                                ),
                            );
                            _select.title =
                                "终端主题选择 - " +
                                _select.options[_select.selectedIndex]
                                    .textContent;
                            document
                                .querySelector(
                                    ".component-oj-operate-bar .bar-box .bar-row",
                                )
                                .appendChild(_select);
                        } catch (err) {
                            console.error(
                                `BetterXESCppClass - 发生了一个错误：${err.message}`,
                            );
                        }
                    }
                    fnInitWS.call(this, api);
                }
            };
        });
        /**
         * 破解AI判题的答案查看限制，可以自由查看所有样例答案了！
         */
        vueMixinManager.on("ModalAiJudge", (instance) => {
            try {
                instance.onShowDetail = (e, t) => {
                    instance.activeIndex = e;
                    instance.caseDetail = t;
                    instance.isShowDetail = true;
                    instance.viewMode = "teacher";
                };
            } catch (err) {
                console.error(
                    `BetterXESCppClass - 发生了一个错误：${err.message}`,
                );
            }
        });
        vueMixinManager.on("ModalAiJudge", (instance) => {
            try {
                console.log(instance);
                
                instance.onShowDetail = (e, t) => {
                    instance.activeIndex = e;
                    instance.caseDetail = t;
                    instance.isShowDetail = true;
                    instance.viewMode = "teacher";
                };
            } catch (err) {
                console.error(
                    `BetterXESCppClass - 发生了一个错误：${err.message}`,
                );
            }
        });
        
    })();

    $(document).ready(() => {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    const elements =
                        document.querySelectorAll(".judge-case-cannot");
                    elements.forEach((element) => {
                        element.classList.remove("judge-case-cannot");
                    });
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        vueMixinManager.on("AceEditor", (instance) => {
            try {
                // “将当前代码设为模板”按钮
                addStyle(`
            @media screen and (max-width: 1200px) {
                .set_cpp_template {
                    right: 35px !important;
                    height: 30px !important;
                }
            }
            .set_cpp_template {
                min-width: 100px;
                position: absolute;
                right: 45px;
                color: #fea529;
                background: #fff;
                border-radius: 20px;
                border: 2px solid #fea529;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                height: 40px;
                font-size: 13px;
                margin: 0 12px;
                padding: 0 20px;
                white-space: nowrap;
                cursor: pointer;
            }
            .set_cpp_template:focus { outline: none;}
                    `);
                let scale_btn = document.querySelector(
                    ".component-lang-selector .scale-btn",
                );
                let _set_template = document.createElement("div");
                _set_template.classList.add("set_cpp_template");
                _set_template.textContent = "设为模板";
                _set_template.title = "设为模板";
                _set_template.addEventListener("click", (_event) => {
                    localStorage.setItem(
                        "BetterXESCppClass_cpp_template",
                        instance.editor.getValue(),
                    );
                    instance.editor.textInput.focus();
                    _set_template.textContent = "✅成功";
                    let n = 0;
                    n = setTimeout(() => {
                        _set_template.textContent = "设为模板";
                        clearTimeout(n);
                    }, 2000);
                });
                scale_btn.parentNode.insertBefore(_set_template, scale_btn);
            } catch (err) {
                console.error(
                    `BetterXESCppClass - 发生了一个错误：${err.message}`,
                );
            }
        });
    });
})();
