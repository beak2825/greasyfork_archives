// ==UserScript==
// @name         Minimal Wirelyre
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  less stuff but more stuff
// @author       mkjl, 13pake, TamTheBoss111
// @license      MIT
// @match        https://wirelyre.github.io/tetra-tools/pc-solver.html*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544880/Minimal%20Wirelyre.user.js
// @updateURL https://update.greasyfork.org/scripts/544880/Minimal%20Wirelyre.meta.js
// ==/UserScript==

const colors = {
    // Color palette for each piece type (used for rendering)
    T: { text: "#b94bc6", normal: "#9739a2", highlight: "#d958e9", skim: "#b94bc6" },
    I: { text: "#5cc7f9", normal: "#42afe1", highlight: "#6ceaff", skim: "#5cc7f9" },
    J: { text: "#2c84da", normal: "#1165b5", highlight: "#339bff", skim: "#2c84da" },
    L: { text: "#f99e4c", normal: "#f38927", highlight: "#ffba59", skim: "#f99e4c" },
    O: { text: "#f9df6c", normal: "#f6d03c", highlight: "#ffff7f", skim: "#f9df6c" },
    S: { text: "#70d36d", normal: "#51b84d", highlight: "#84f880", skim: "#70d36d" },
    Z: { text: "#f96c67", normal: "#eb4f65", highlight: "#ff7f79", skim: "#f96c67" },
    X: { normal: "#868686", highlight: "#dddddd", skim: "#bdbdbd" },
};

const weights = {
    "IJL":[0, 0, 10398568, 10398432, 0, 0, 0],
    "IJO":[24931, 10007584, 0, 0, 10726944, 10982636, 11202480],
    "IJS":[25863, 10515396, 0, 0, 10696580, 11120568, 15156723],
    "TIJ":[0, 12349, 932, 0, 20038, 24698, 17242],
    "IJZ":[6524, 10804226, 0, 0, 10957248, 11818226, 12647493],
    "ILO":[24232, 10006160, 0, 0, 10726656, 11202754, 10981252],
    "ILS":[6291, 10803378, 0, 0, 10954972, 12631499, 11823071],
    "TIL":[0, 12349, 0, 932, 20038, 16077, 24232],
    "ILZ":[26096, 10505420, 0, 0, 10696480, 15162554, 11117844],
    "IOS":[12116, 35472, 10849732, 11177734, 11184, 279075, 28760],
    "TIO":[16543, 12582, 28426, 26795, 9320, 12815, 13281],
    "IOZ":[12582, 35448, 11178080, 10848064, 11184, 28764, 278935],
    "TIS":[0, 26096, 24232, 15844, 2330, 165630, 157157],
    "ISZ":[212764, 13980, 11647222, 11653843, 0, 1200974, 1199890],
    "TIZ":[0, 26096, 17242, 24698, 2330, 157161, 165638],
    "JLO":[1864, 0, 10558368, 10558584, 0, 0, 0],
    "JLS":[1864, 0, 10843520, 10800752, 0, 233, 0],
    "TJL":[0, 0, 23300, 23300, 2796, 1864, 1864],
    "JLZ":[1864, 0, 10801604, 10843376, 0, 0, 233],
    "JOS":[63130, 10955656, 0, 0, 116135116, 61090396, 30380699],
    "TJO":[0, 24931, 2563, 1398, 102054, 81181, 56127],
    "JOZ":[51577, 11061464, 0, 0, 78420326, 30380260, 179779748],
    "TJS":[0, 19805, 1864, 0, 57784, 208716, 85718],
    "JSZ":[50781, 15225615, 0, 0, 27413735, 140479460, 178002735],
    "TJZ":[0, 17242, 0, 932, 33552, 91530, 362698],
    "LOS":[51597, 11060720, 0, 0, 78418086, 178739665, 30377899],
    "TLO":[0, 23999, 1398, 2563, 102054, 56143, 80715],
    "LOZ":[61033, 10955776, 0, 0, 116133036, 30378156, 61130329],
    "TLS":[0, 16776, 932, 0, 33552, 363903, 90843],
    "LSZ":[51946, 15227702, 0, 0, 27411224, 171629324, 81066019],
    "TLZ":[0, 20038, 0, 1864, 57318, 87594, 212088],
    "TOS":[29715, 8621, 74657, 61150, 393198, 590116, 800057],
    "OSZ":[860156, 20244, 19512102, 19511239, 799564, 5065103, 5071639],
    "TOZ":[29719, 8621, 61130, 73958, 393166, 800081, 590300],
    "TSZ":[45248, 148454, 96423, 93643, 564792, 997153, 996773],
    "":[0, 233, 813, 809, 2623, 7162, 7165],
    "IJLO":[0, 0, 0, 0, 0, 0, 0],
    "IJLS":[0, 0, 0, 0, 0, 16, 115],
    "TIJL":[0, 0, 0, 0, 0, 0, 0],
    "IJLZ":[0, 0, 0, 0, 0, 113, 16],
    "IJOS":[0, 5, 0, 0, 20, 645, 1285],
    "TIJO":[0, 0, 0, 0, 0, 0, 0],
    "IJOZ":[0, 4, 40, 0, 303, 1187, 803],
    "TIJS":[0, 0, 0, 0, 0, 0, 0],
    "IJSZ":[0, 312, 0, 16, 1167, 2542, 2652],
    "TIJZ":[0, 0, 0, 0, 0, 0, 0],
    "ILOS":[0, 4, 0, 41, 303, 801, 1188],
    "TILO":[0, 0, 0, 0, 0, 0, 0],
    "ILOZ":[0, 5, 0, 0, 20, 1283, 646],
    "TILS":[0, 0, 0, 0, 0, 0, 0],
    "ILSZ":[0, 322, 18, 0, 1167, 2640, 2542],
    "TILZ":[0, 0, 0, 0, 0, 0, 0],
    "TIOS":[0, 0, 0, 0, 0, 0, 0],
    "IOSZ":[0, 7312, 771, 768, 8372, 8517, 8517],
    "TIOZ":[0, 0, 0, 0, 0, 0, 0],
    "TISZ":[0, 0, 0, 0, 0, 0, 0],
    "JLOS":[0, 0, 0, 40, 252, 693, 335],
    "TJLO":[0, 0, 0, 0, 0, 0, 0],
    "JLOZ":[0, 0, 40, 0, 252, 335, 695],
    "TJLS":[0, 0, 0, 0, 0, 0, 0],
    "JLSZ":[0, 112, 16, 16, 86, 1399, 1399],
    "TJLZ":[0, 0, 0, 0, 0, 0, 0],
    "TJOS":[0, 0, 0, 0, 0, 0, 0],
    "JOSZ":[0, 1302, 411, 298, 5137, 9536, 6964],
    "TJOZ":[0, 0, 0, 0, 0, 0, 0],
    "TJSZ":[0, 0, 0, 0, 0, 0, 0],
    "TLOS":[0, 0, 0, 0, 0, 0, 0],
    "LOSZ":[0, 1302, 298, 418, 5201, 6964, 9502],
    "TLOZ":[0, 0, 0, 0, 0, 0, 0],
    "TLSZ":[0, 0, 0, 0, 0, 0, 0],
    "TOSZ":[0, 0, 0, 0, 32, 6, 6],
    "I":[23167272, 28474473, 27180665, 27171863, 28470254, 34885179, 34891802],
    "J":[23076745, 27180665, 28196395, 28424876, 28122070, 39440314, 41952353],
    "L":[23073472, 27171863, 28424876, 28193428, 28105376, 41770671, 39368800],
    "O":[23515198, 28470254, 28122070, 28105376, 37546911, 45748992, 45731512],
    "S":[24551112, 34885179, 39440314, 41770671, 45748992, 265272682, 224724915],
    "T":[29412127, 23167272, 23076745, 23073472, 23515198, 24551112, 24516806],
    "Z":[24516806, 34891802, 41952353, 39368800, 45731512, 224724915, 265713652],
    "IJLOS":[35, 830, 137, 151, 1869, 5864, 7764],
    "TIJLO":[0, 0, 0, 0, 0, 9, 8],
    "IJLOZ":[39, 832, 145, 135, 1857, 7750, 5864],
    "TIJLS":[0, 0, 0, 0, 3, 0, 3],
    "IJLSZ":[52, 3344, 119, 119, 6514, 11067, 11112],
    "TIJLZ":[0, 0, 0, 0, 3, 3, 0],
    "TIJOS":[1, 0, 6, 23, 0, 28, 189],
    "IJOSZ":[426, 5450, 8988, 7942, 9395, 23271, 15575],
    "TIJOZ":[0, 0, 62, 25, 0, 257, 104],
    "TIJSZ":[0, 0, 82, 39, 50, 259, 63],
    "TILOS":[0, 0, 20, 58, 0, 104, 258],
    "ILOSZ":[425, 5439, 7901, 8987, 9389, 15556, 23256],
    "TILOZ":[1, 0, 29, 6, 0, 188, 30],
    "TILSZ":[0, 0, 39, 80, 48, 62, 257],
    "TIOSZ":[370, 3226, 93, 91, 5178, 5532, 5516],
    "TJLOS":[0, 0, 0, 0, 24, 139, 228],
    "JLOSZ":[1029, 8135, 1524, 1524, 14382, 35220, 35206],
    "TJLOZ":[0, 0, 0, 0, 24, 139, 228],
    "TJLSZ":[0, 4, 0, 0, 160, 131, 133],
    "TJOSZ":[64, 175, 452, 828, 664, 2271, 1072],
    "TLOSZ":[64, 178, 827, 454, 664, 1072, 2267],
    "IJ":[60566445, 68912403, 92103195, 92009940, 69595502, 71727845, 73213418],
    "IL":[60564871, 68921083, 92010127, 92104835, 69596605, 73226100, 71717285],
    "IO":[64505166, 93144695, 69751138, 69753968, 94896722, 95387480, 95390602],
    "IS":[67585101, 97180250, 71546359, 73092931, 95268275, 101300868, 100842912],
    "TI":[60836912, 62238378, 60565962, 60564832, 64268765, 67182535, 67224861],
    "IZ":[67597821, 97184893, 73080240, 71537878, 95271667, 100843110, 101333629],
    "JL":[63860178, 91961507, 69494675, 69494198, 92617960, 92801607, 92800505],
    "JO":[62811640, 69779304, 92956226, 92624010, 73185211, 76193154, 78313984],
    "JS":[64798930, 71703704, 92684817, 92779734, 75467616, 82010295, 80189107],
    "TJ":[61837778, 60137581, 63549277, 63776811, 62586012, 64579315, 66304548],
    "JZ":[66095741, 72953822, 94056115, 92709392, 77959394, 80099739, 89660874],
    "LO":[62813879, 69784613, 92624162, 92955169, 73182352, 78312148, 76134528],
    "LS":[66114052, 72965153, 92712781, 93951135, 77957370, 89671588, 80050985],
    "TL":[61832248, 60137925, 63774991, 63556054, 62578772, 66312161, 64568437],
    "LZ":[64790022, 71691593, 92777557, 92691422, 75375670, 80153973, 81998787],
    "OS":[70091335, 95360107, 76117886, 78277794, 101957288, 104548790, 106940166],
    "TO":[61491384, 64477397, 62537120, 62545133, 69937262, 70053337, 70008446],
    "OZ":[70041129, 95363575, 78280516, 76053460, 101949414, 106939611, 104540408],
    "TS":[64820491, 67270098, 64004757, 65819749, 69626684, 86094926, 74400725],
    "SZ":[75044654, 100744308, 79514600, 79485618, 106635579, 110313034, 110317918],
    "TZ":[64820924, 67287946, 65815107, 64000359, 69576435, 74398069, 86060468],
    "TIJLOS":[0, 24, 68, 82, 109, 668, 1238],
    "IJLOSZ":[4039, 14883, 14329, 14273, 24412, 52796, 52734],
    "TIJLOZ":[0, 23, 82, 71, 108, 1225, 674],
    "TIJLSZ":[0, 24, 130, 130, 1118, 1016, 1015],
    "TIJOSZ":[496, 2502, 2776, 2526, 4743, 13216, 8675],
    "TILOSZ":[491, 2498, 2530, 2709, 4741, 8653, 13266],
    "TJLOSZ":[24, 1216, 1488, 1488, 3712, 4729, 4727]
}

// --- Constants ---
const PIECES = ["T", "I", "J", "L", "O", "S", "Z"];
const COLORS = [
    "rgb(180, 81, 172)", // T
    "rgb(65, 175, 222)", // I
    "rgb(24, 131, 191)", // J
    "rgb(239, 149, 54)", // L
    "rgb(247, 211, 62)", // O
    "rgb(102, 198, 92)", // S
    "rgb(239,  98, 77)", // Z
];
const REMAINING_PIECES = [4, 1, 5, 2, 6, 3, 7];
const PC_LABELS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];

// ---------------- //

const cellSize = 22;
const numcols = 10;
//importing dependencies
let decoder;
let encoder;
let Field;
let workerScript;

const saved = JSON.parse(localStorage.getItem("saved")??"{}");

(async function () {
    // tetris-fumen decoder
    const tetrisFumen = await import(
        "https://cdn.jsdelivr.net/npm/tetris-fumen/+esm"
    );
    decoder = tetrisFumen.decoder;
    encoder = tetrisFumen.encoder;
    Field = tetrisFumen.Field;
})();

(function () {
    "use strict";

    // --- Styles ---
    [
        "#solutions > a { border-radius: 4px; }",
        "@font-face {font-family: MinoFont;src: url(data:font/woff;base64,d09GRk9UVE8AAAUkAAsAAAAABxwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABDRkYgAAADTAAAAYMAAAGoS5stSkZGVE0AAAUIAAAAHAAAAByFmy/sR0RFRgAABNAAAAAYAAAAHAAVABRPUy8yAAABZAAAAEgAAABgWAhhGGNtYXAAAALYAAAAXQAAAWIJywzraGVhZAAAAQgAAAA0AAAANhQOlI9oaGVhAAABPAAAAB4AAAAkB2gFDWhtdHgAAAToAAAAIAAAACAdSAHAbWF4cAAAAVwAAAAGAAAABgAIUABuYW1lAAABrAAAASkAAAIWcTAiknBvc3QAAAM4AAAAEwAAACD/hgAyeJxjYGRgYADiBeIln+L5bb4ycDO/AIowXP+9TAVCr7ZmMGdgYDnE5A3kcjAwgUQBViYLXXicY2BkYGDyZmBgiGJlAZIMLIcYGBlQAQcAIs8BgQAAAABQAAAIAAB4nGNgYX7OOIGBlYGBqYtpDwMDQw+EZnzAYMjIBBRlYGVmgAFGBiQQkOaawtDA4MkQxazw34IhiskbWQ2TC4MCEDICAF5lCtB4nIWPMWvCUBSFz9NoydBSXEq3OxUFE15Ch9RVySClg6BjIdUQAyGRGAWhY39Pf0z/TbeeF1+7dDDwcr/ce985JwBu8AmF83OPR8sKLt4sd3CFd8tdPODLsgNXXVvu4VY9We6z/8pN5bj8CttbhhUGeLHcoW9huYtnfFh2uPNtuQdRd5b7GKg5pqiwwwk1cmTYooFgiDVGrCE0AkQYk2dIcGwrptXuVOfZtpHheiShDqKxzJKjcLRESYWcp0CKDf8dy7LJmyLdEBfsZThwltAPizQ7FAkhZgZzz9SaG2nr7dNdMOH5r3ruh8zmMaHm+zcr4qps4qrOUgl9LRP58yeHkRdozyS+FHXFXo095yaaUNzI+201sbBK631elaJ14Gut5YLgD5cXTxUAAAB4nGNgYGBmgGAZBkYGEIgB8hjBfBYGByDNw8DBwARkezH4MPgzhDBE/f8PFPUE84JBvP87/m//v/X/pv9roSbAASMbA7oQ+YCRCeRMFiCLlQ0swE4tk2kKAP97EMEAAAB4nGNgZgCD/80MRgxYAAAoRAG4AHicRY09SCNREMfnuWv20LhR4x5+7GHAFOcX+AknNoKmtrKwlDtR4bg7jpggWmhh42a51k5b7QTf220eiLUY3ErSWFja2OhM8l5xTxEdhilmfr//MLBtYIy1LP0qbhR/rv6YAtYEDIYpA9THyG+iLxZ125eBb1/SXbMP2xkfoN2Hgw4fBny23wnWi9ALAzAy//vP1t+NtfVi7uv3wdzE2Pi3kdzCSim38J7+8cbUEAzDKIzBFEzDLHxiLD+zvBmeVR91fyCpIJmUeCEt+ZnydKLzKanLHhXwQhccl3qOS8jL7Aq5p7hv7yF33ApyVsXYqtKtFygRKF5/CgLk+sZM0fx6r2cM0Jg0hIqV0DcvDPKUqxaPS5SUWZWujZ94OqFrShz3+R/GAUad2Tls0J2X3VWRkiqmmmM2MUqMHDdEwVCjsFBTzVPCIKL+jEKdoTAJ4VvCLj6EHt1jrGTKyJGuqQjPHbex09XIeuUjSg5TQboFuelKpZJOY9yKIsTTdNt/UmLMwwB4nGNgZIAAHgYRBhYgzQTEjBAMAALLACoB9AAABQQAQQPoAEQD6AA+AsQARAPqAD0D6ABFA+oANwAAAAEAAAAA1aPejAAAAADX+6YkAAAAANf7qzs=) format('woff');font-weight: 400;font-style: normal;}",
        "body { color: #fff; background-color: #363941; font-family: 'Lucidia Console', monospace; }",
        "#queue-errors { display:none} ",
        "#query { border-color: transparent; margin-left:50%; transform:translateX(-50%); gap:10px; grid-template-columns:300px; position:relative; }",
        "#select-save { position:absolute; left:-30px; top:10px; flex-direction:column; align-items:flex-end; }",
        "#select-save>button { display:block; margin:2px 0; }",
        "#select-pc { position:absolute; right:-30px; top:10px; flex-direction:column; align-items:flex-start; }",
        "#select-pc>button { display:block; margin:2px 0; }",
        "#queue { color: #fff; border: 1px solid rgba(0,0,0,0.3); background-color: rgba(0,0,0,0.2); }",
        "#query details, #query details[open] { color: #ccc; }",
        "#initial-info, #query div.label { font-family: 'Lucidia Console', monospace; }",
        "#initial { grid: auto-flow / repeat(10, 30px)}",
        "#initial>input:nth-child(-n+10) { border-top: 1px solid rgba(0,0,0,0.2); }",
        "#initial>input:nth-child(10n+1) { border-left: 1px solid rgba(0,0,0,0.2); }",
        "#initial>input {width:30px;height:30px; background-color: rgba(0,0,0,0.2); border-right: 1px solid rgba(0,0,0,0.2); border-bottom: 1px solid rgba(0,0,0,0.2); }",
        "mino-board rect[fill='#F3F3ED'], mino-board rect[fill='#E7E7E2'] { fill: rgba(0,0,0,0.2); }",
        "#progress,#loading{display:none;}",
        "#select-save,#select-pc{margin:0;padding:0;display:flex;}",
        "#select-save>button{font-family:MinoFont;border:none;background:transparent;font-size:16px;}",
        "#select-save>button.active,#select-pc>button.active{color:white;}",
        "#select-pc>button{border:none;background:transparent;font-size:15px;font-family:'Lucidia Console',monospace;}",
        ".hidden{display:none !important;}",
    ].forEach(GM_addStyle);

    // --- initial UI cleanup ---
    $("#physics-form > label:nth-child(2) > input[type=radio]").click();
    $(
        "#query > div:nth-child(8), #initial-info, .label, #query > div:nth-child(5) > details, #query > h1, #query > div:nth-child(6) > label"
    ).hide();

    // --- UI Elements ---
    const queue = document.getElementById("queue");
    window.onload = function () {
        // save selector (left vertical buttons)
        const $saveList = $("<ul id='select-save'></ul>");
        PIECES.forEach((piece) => {
            const $btn = $(
                `<button class='select-save ${piece} hidden'>${piece}</button>`
            );
            $btn.on("click", function () {
                $(this).toggleClass("active");
                $("#solutions>a").removeClass("hidden");
                if (!$("#select-save>button.active").length) return;
                $("#select-save>button:not(.active)").each(function () {
                    $("#solutions>a." + $(this).text()).addClass("hidden");
                });
            });
            $saveList.append($btn);
        });
        $("#query").append($saveList);

        // PC selector (right vertical buttons)
        const $pcList = $("<ul id='select-pc'></ul>");
        PC_LABELS.forEach((label, i) => {
            const $btn = $(
                `<button class='select-pc pc${label[0]} hidden'>${label}</button>`
            );
            $btn.on("click", function () {
                // Remove previous text overlays
                $("#solutions > a > mino-board > svg > text").remove();
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    return;
                }
                $("#select-pc>button").removeClass("active");
                $(this).addClass("active");
                const queue = $("#queue").val();
                const placed = Math.floor($("#initial>input:checked").length / 4);
                if (placed + queue.length < 10) return;
                const pcIdx = Number($(this).text()[0]);
                const used = queue.slice(REMAINING_PIECES[pcIdx - 1] + 3 - (placed + queue.length));

                // Figure out which pieces are "save" pieces for this PC
                let unused = PIECES.filter(p => !used.includes(p)).join("");

                if(pcIdx == 2)unused = "";

                let aNodes = $("#solutions > a")
                aNodes.each(function () {
                    let save = $(this).hasClass("select-save") ? "" : PIECES.find((p) => $(this).hasClass(p)) || "";
                    const text = document.createElementNS("http://www.w3.org/2000/svg","text");
                    text.setAttribute("x", "100");
                    text.setAttribute("y", "15");
                    text.setAttribute("fill", "white");
                    text.setAttribute("text-anchor", "middle");
                    text.setAttribute("font-size", "15");
                    // Compute weight for sorting
                    this._weight=weights[normalizedSort(unused)][PIECES.indexOf(save)]
                    let pc_label = PC_LABELS[pcIdx % 7];

                    if(unused.length >= 4){
                        //invert bag
                        if(unused.includes(save)){
                            //dupe
                            text.textContent = save + " > " + normalizedSort(used) + " " + (pc_label=="1st"?"8th":pc_label);
                        }else if(pc_label == "1st"){
                            text.textContent = "1st";
                        }else{
                            //non dupe
                            text.textContent = "No " + normalizedSort(used.replaceAll(save,"")) + " " + pc_label;
                        }

                    } else{
                        text.textContent = normalizedSort(save + unused) + " " + pc_label;
                    }
                    this.firstChild.firstChild.appendChild(text);
                });
                // Reorder solutions by weight (lowest first)
                observer.disconnect();
                const aNodeList = [...aNodes];
                aNodeList.sort((a, b) => ((a._weight || 0) - (b._weight || 0)) || ((PIECES.indexOf(a._save) || 0) - (PIECES.indexOf(b._save) || 0)));
                $("#solutions").append(aNodeList);
                observer.observe($("#solutions")[0], {
                    childList: true,
                    subtree: true,
                    characterData: true,
                });

            });
            $pcList.append($btn);
        });
        $("#query").append($pcList);

        // --- Mutation Observer ---
        const observer = new MutationObserver((mutations) => {
            $("#solutions > button")[0]?.click();
            const queue = $("#queue").val();
            const placed = Math.floor($("#initial>input:checked").length / 4);
            if (placed + queue.length < 10 || !/^[TILJSZO]*$/.test(queue)) {
                $(".select-pc").addClass("hidden");
                $(".select-save").addClass("hidden");
                return;
            }
            const queueCounts = PIECES.map((p) => queue.split(p).length - 1);
            let go = false;
            const possibleSaves = new Set();
            mutations.forEach((mutation) => {
                if (mutation.type !== "childList") return;
                const aNode = mutation.addedNodes[0];
                if (!aNode || aNode.tagName === "text") return;
                go = true;
                try {
                    const dataField = aNode.firstChild.getAttribute("data-field");

                    // Attach fumen code for copying
                    aNode.setAttribute("fumen",encoder.encode([{field:Field.create(dataField.replaceAll("|","").replaceAll("G","X")),flags:{lock:false}}]))

                    // Left click: copy fumen code
                    aNode.addEventListener("click",function(event){
                        event.preventDefault();
                        navigator.clipboard.writeText(this.getAttribute("fumen"));
                    })

                    // Right click: copy PNG image of solution
                    aNode.addEventListener("contextmenu",function(event){
                        event.preventDefault();
                        let sliceSize = 512
                        let dataurl = getDataURL(decoder.decode(this.getAttribute("fumen")));
                        let byteCharacters = atob(dataurl.split(",")[1])
                        let byteArrays = []
                        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                            let slice = byteCharacters.slice(offset, offset + sliceSize)
                            let byteNumbers = new Array(slice.length);
                            for (let i = 0; i < slice.length; i++) {
                                byteNumbers[i] = slice.charCodeAt(i)
                            }
                            var byteArray = new Uint8Array(byteNumbers)
                            byteArrays.push(byteArray)
                        }
                        let blob = new Blob(byteArrays, {type: 'image/png'})
                        navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
                    })

                    // Figure out which piece is the "save" for this solution
                    const solutionCounts = PIECES.map(
                        (p) => (dataField.split(p).length - 1) / 4
                    );
                    const diffIdx = queueCounts.findIndex(
                        (cnt, i) => cnt !== solutionCounts[i]
                    );
                    aNode.style.borderTop = "10px solid " + COLORS[diffIdx];
                    aNode.setAttribute("fumen",encoder.encode([{field:Field.create(dataField.replaceAll("|","").replaceAll("G","X")),flags:{lock:false},comment:'Save ' + PIECES[diffIdx]}]))
                    aNode._save=PIECES[diffIdx]
                    aNode.classList.add(PIECES[diffIdx]);
                    possibleSaves.add(PIECES[diffIdx]);
                } catch (e) {}
            });
            if (!go) return;
            // Reset UI state for new solutions
            $("#select-save>button, #select-pc>button").removeClass("active");
            const possiblePCs = getPCIndex(placed, queue);
            $(".select-pc").addClass("hidden");
            possiblePCs.forEach((pc) =>
                                $(".select-pc.pc" + pc).removeClass("hidden")
                               );
            $(".select-save").addClass("hidden");
            possibleSaves.forEach((piece) =>
                                  $(".select-save." + piece).removeClass("hidden")
                                 );
        });
        observer.observe($("#solutions")[0], {
            childList: true,
            subtree: true,
            characterData: true,
        });
    };

    document.addEventListener("keydown",async function(event){
        const ctrlKey = event.ctrlKey;
        const keyCode = event.code;

        switch(keyCode){
                case "KeyR":{
                // Clear field unless typing in queue
                if(document.activeElement == queue)break;
                }
            case "Backspace":{
                if(document.activeElement == queue && queue.value)break;
            }
            case "Delete":{
                $("#initial>input:checked").each(function(){this.checked = false;});
                queue.dispatchEvent(new Event('input', { bubbles: true }));
                break;
            }
            case "KeyV":{
                // Paste fumen from clipboard into field
                if(!ctrlKey)break;
                // paste fumen
                const fumen = ((await navigator.clipboard.readText()).match(/v115@[a-zA-Z0-9@\/\+\?]+/)||[null])[0];
                if(!fumen)break;
                const field = decoder.decode(fumen)[0].field;
                const garbageOnly = field.str().length == 54 && field.str().split('_').length == 11;
                $("#initial>input:checked").each(function(){this.checked = false;});
                for(let i = 0; i < 4; i++){
                    for(let j=0; j < 10; j++){
                        if(field.at(j,i) != '_' && (!garbageOnly || field.at(j,i) == 'X')){
                            $(`#cell${i*10+j}`)[0].checked = true;
                        }
                    }
                }
                queue.dispatchEvent(new Event('input', { bubbles: true }));
                break;
            }
            case "KeyM":{
                // Mirror the checked cells horizontally
                const ids = [];
                $("#initial>input:checked").each(function(){
                    ids.push(Number(this.id.split("cell")[1]));
                });
                for(const id of ids){
                    const mirrorID = (~~(id/10)*10+9-(id%10));
                    if(document.getElementById("cell"+mirrorID).checked)continue;
                    else{
                        document.getElementById("cell"+id).checked = false;
                        document.getElementById("cell"+mirrorID).checked = true;
                    }
                }
                queue.dispatchEvent(new Event('input', { bubbles: true }));
                break;
            }
            case "KeyS":{
                // Save or remove the current field to localStorage
                if(!ctrlKey)break;
                event.preventDefault();
                const hydraField = getHydraField();

                if(!hydraField){
                    delete saved[queue.value];
                    break;
                }

                saved[queue.value] = hydraField;
                queue.value = '';

                localStorage.setItem("saved",JSON.stringify(saved));
                break;
            }
            case "KeyT":{
                //just refocus
                if(document.activeElement == queue)break;
                queue.focus();
                event.preventDefault();
                break;
            }
        }
    })

    queue.addEventListener("keyup",function(event){
        // If a saved field exists for this queue, load it
        if(!Object.keys(saved).includes(this.value))return;
        if(document.querySelectorAll("#initial > input:checked").length && event.key!="Enter")return;
        let field = saved[this.value]
        this.value = "";
        for(let i = 0; i < 4; i++){
            for(let j=9; j>=0; j--){
                const remainder = field % 2
                field = Math.floor(field / 2);
                $("#cell"+(i*10+j))[0].checked = remainder
            }
        }
        queue.dispatchEvent(new Event('input', { bubbles: true }));
    })


})();
// --- Utility Functions ---
function getPCIndex(n,queue) {
    // Returns possible PC indices for the current queue
    const validPCs = new Set([1,2,3,4,5,6,7])
    for (let i = 0; i <= queue.length + 6; i++) {
        let sub = queue.substring(Math.max(1,i-7), i);
        if(sub.length!=new Set(sub).size)validPCs.delete((i+6)%7+1);
    }
    return [...validPCs].map(i => ((n + i)%7 * 2)%7+1).sort();
}

function normalizedSort(input) {
    // Returns a sorted string of pieces in TIJLO(SZ) order, most frequent first
    const counts = { T: 0, I: 0, J: 0, L: 0, O: 0, S: 0, Z: 0 };
    for (const char of input) if (PIECES.includes(char)) counts[char]++;
    return Object.entries(counts)
        .sort(
        ([a, ca], [b, cb]) =>
        cb - ca || PIECES.indexOf(a) - PIECES.indexOf(b)
    )
        .flatMap(([piece, count]) => Array(count).fill(piece))
        .join("");
}
// --- IMAGE PROCESSING --- //
function getDataURL(pages) {
    // Converts a fumen page to a PNG data URL
    if (pages.length === 1) {
        const canvas = draw(pages[0], 4);
        return canvas.toDataURL("image/png");
    }
    return null;
}
function draw(page, numrows) {
    // Draws a fumen page to a canvas
    const upHeight = cellSize / 5;
    var field = page.field;

    const width = cellSize * numcols;
    const height = (numrows + 0.2) * cellSize;

    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { willReadFrequently: true });

    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < numcols; i++) {
        for (let j = 0; j < numrows; j++) {
            if (field.at(i, j) != "_") {
                // all blocks
                let rowClear = page.flags.lock;
                for (let n = j * 10; n < j * 10 + 10; n++) {
                    if (page._field.field.pieces[n] == 0) {
                        rowClear = false;
                        break;
                    }
                }

                context.fillStyle =
                    colors[field.at(i, j)][rowClear ? "skim" : "normal"];

                context.fillRect(
                    i * cellSize,
                    height - (j + 1) * cellSize - 1,
                    cellSize,
                    cellSize + 1
                );
                if (field.at(i, j + 1) == "_" || j == numrows - 1) {
                    // all highlights
                    context.fillStyle = colors[field.at(i, j)].highlight;
                    context.fillRect(
                        i * cellSize,
                        height - upHeight - (j + 1) * cellSize,
                        cellSize,
                        upHeight
                    );
                }
            }
        }
    }
    return canvas;
}

function getHydraField(){
    // Encodes the current field as a bitfield for saving
    let field = 0;
    for(let i = 3; i >= 0; i--){
        for(let j = 0; j < 10; j++){
            field = (field*2) + ($("#cell"+(i*10+j))[0].checked?1:0);
        }
    }
    return field;
}