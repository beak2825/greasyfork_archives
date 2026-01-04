// ==UserScript==
// @name         GGn Trade Screen Filter
// @namespace    https://greasyfork.org
// @version      2.0
// @license      MIT
// @description  Filter items on the trade screen
// @author       drlivog
// @match        https://gazellegames.net/user.php?*action=trade*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470551/GGn%20Trade%20Screen%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/470551/GGn%20Trade%20Screen%20Filter.meta.js
// ==/UserScript==

/* globals $ */

const DEBUG_MODE = false;

//From Store page use:let arr=[]; document.querySelectorAll(".item_li").forEach((el) => {arr.push(parseInt(el.firstElementChild.dataset.itemid));}); console.log("["+arr.sort((a,b)=>a-b).join()+"]");
const AvatarEffects = [22,23,24,25,26,27,28,29,30,53,214,215,220];
const BodyMods = [414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549,550,551,552,553,554,555,556,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,575,576,577,578,579,580,581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,596,597,598,599,600,601,602,603,604,605,606,607,608,609,610,611,612,613,614,615,616,617,618,619,620,621,622,623,624,625,626,627,628,629,630,631,632,633,634,635,636,637,638,639,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,710,711,712,713,714,715,716,717,718,719,720,721,722,723,724,725,726,727,728,729,730,731,732,733,734,735,736,737,738,739,740,741,742,743,744,745,746,748,749,750,751,752,753,754,755,756,757,758,759,760,761,762,763,764,765,766,767,768,769,770,771,772,773,774,775,776,777,778,779,780,781,782,783,784,785,787,788,789,790,791,792,793,794,795,796,797,798,799,800,801,802,803,804,805,806,807,808,809,810,811,812,813,814,815,816,817,818,819,820,821,822,823,824,825,826,827,829,830,831,832,833,834,835,836,837,838,839,840,841,842,843,844,845,846,847,848,849,850,851,852,853,854,855,856,857,858,859,860,861,862,863,864,865,866,867,868,869,870,871,872,873,874,875,876,877,878,879,880,881,882,883,884,885,886,887,888,889,890,891,892,893,894,895,896,897,898,899,900,901,902,903,904,905,906,907,908,909,910,911,912,913,914,915,916,917,918,920,921,922,923,924,925,926,927,928,929,930,931,932,933,934,935,936,937,938,939,940,943,944,945,946,947,948,949,950,951,952,953,954,955,956,957,958,959,960,961,962,963,964,965,966,967,968,969,970,971,972,973,974,975,976,977,978,979,980,981,982,983,984,985,986,987,988,989,990,991,993,994,995,996,997,998,999,1000,1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1011,1012,1013,1014,1015,1016,1017,1018,1019,1020,1021,1022,1023,1024,1025,1026,1027,1028,1029,1030,1031,1032,1033,1034,1035,1036,1037,1038,1039,1040,1041,1042,1049,1050,1051,1052,1053,1055,1056,1057,1058,1059,1060,1061,1062,1063,1064,1065,1066,1067,1068,1069,1070,1071,1072,1073,1074,1075,1076,1077,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,1090,1091,1092,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103,1104,1105,1106,1107,1108,1109,1110,1111,1112,1113,1114,1115,1116,1117,1118,1119,1120,1121,1122,1123,1124,1125,1126,1127,1128,1129,1130,1131,1132,1133,1134,1135,1136,1137,1138,1139,1140,1141,1142,1143,1144,1145,1146,1147,1148,1149,1150,1151,1152,1153,1154,1155,1156,1157,1158,1159,1160,1161,1162,1163,1164,1165,1166,1167,1168,1169,1170,1171,1172,1173,1174,1175,1176,1177,1178,1179,1180,1181,1182,1183,1184,1185,1186,1187,1188,1189,1190,1191,1192,1193,1194,1195,1196,1197,1198,1199,1200,1201,1202,1203,1204,1205,1206,1207,1208,1209,1210,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220,1221,1222,1223,1224,1225,1226,1227,1228,1229,1230,1231,1232,1233,1234,1235,1236,1237,1238,1239,1240,1241,1243,1244,1245,1246,1247,1248,1249,1250,1251,1252,1253,1254,1255,1256,1257,1258,1259,1260,1261,1262,1263,1264,1265,1266,1267,1268,1269,1270,1271,1272,1273,1274,1279,1280,1281,1282,1283,1284,1285,1286,1287,1288,1289,1290,1291,1292,1293,1294,1295,1296,1297,1298,1299,1300,1301,1302,1303,1304,1305,1306,1307,1308,1309,1310,1311,1312,1313,1314,1315,1316,1317,1318,1319,1320,1321,1322,1323,1324,1325,1326,1327,1328,1329,1330,1331,1332,1333,1334,1335,1336,1337,1338,1339,1340,1341,1342,1343,1344,1345,1346,1347,1348,1349,1350,1351,1352,1353,1354,1355,1356,1357,1358,1359,1360,1361,1362,1363,1364,1365,1366,1367,1368,1369,1370,1371,1372,1373,1374,1375,1376,1377,1378,1379,1380,1381,1382,1383,1384,1385,1386,1387,1388,1389,1390,1391,1392,1393,1394,1395,1396,1397,1398,1399,1400,1401,1402,1403,1404,1405,1406,1407,1408,1409,1410,1411,1412,1413,1414,1415,1416,1417,1418,1419,1420,1421,1422,1423,1424,1940,2206,2207,2208,2209,2210,3088,3089];
const Usernames = [73,74,75,76,77,78,81,2080,2082,2325,2326,2327,2557,2558,2559,2560,2561,2562,2685,2710,2811,2930,2931,2932,3034,3065,3195,3196,3197,3198,3476]

const Items = {
    "Trading Cards": {
        "Original": {
            "Staff": [2357,2358,2359,2361,2364,2365,2366,2367,2368,2369,2370,2371,2372,2388,2400,2410,2424,2438],
            "Mario": [2390,2391,2392,2393,2394,2395,2396,2397,2398,2401,2402,2403,2404,2426],
            "Portal": [2373,2374,2375,2376,2377,2378,2379,2380,2381,2382,2383,2384,2385,2425]
        },
        "Valentine's": {
            "Pink V-day": [2986,2987,2988,2989,2990,2991,2992,3000],
            "Brown V-day": [2993,2994,2995,2996,2997,2998,2999,3001]
        },
        "Birthday": {
            "Tan Gazelles": [2829,2830,2831,2833,2833,2834,2835,2836,2838],
            "Blue After Party": [3023,3024,3025,3026,3027,3028,3029],
            "NES Retro": [3151,3152,3153,3154,3155,3156,3157,3158,3159,3160,3161,3162,3163]
        },
        "Halloween": {
            "Pumpkin": [2589,2590,2591,2592,2593,2594,2595],
            "Cupcake": [2945,2946,2947,2948,2949,2950,2951],
            "Ghost": [3263,3265,3266,3267,3268,3269,3270]
        },
        "Christmas": {
            "Classic Cheer": [2698,2699,2700,2701,2702,2703,2704,2707],
            "Pink Gingerbread": [2969,2970,2972,2973,2974,2975,2976],
            "Red Mafia": [3105,3106,3107,3108,3109,3110,3111],
            "Green Movie": [3328,3329,3330,3331,3332,3333,3334,3335,3336,3338,3339,3340,3341]
        }
    },
    "Bars, Ores & Dust": {
        "Bars": [2244,2243,2242,2241,2240,2239,2238,2237,2236,2235],
        "Ores": [2234,2233,2229,2228,2227,2226,2225],
        "Dust": [2232,2231,2230]
    },
    "Pets": [3441,3373,3371,3370,3369,3324,3323,3322,3309,3237,3216,3215,3214,3213,3170,3169,2957,2956,2933,2929,2928,2927,2827,2725,2697,2691,2690,2678,2615,
             2599,2598,2583,2529,2527,2525,2524,2523,2522,2521,2515,2514,2513,2512,2511,2510,2507,2492,2461,2354,2353,2342,2333,1996],
    "Event Items" : {
        "Summer Food": [3218,3219,3220,3221,3222,3223,3224,3225],
        "Summer Drinks": [3231,3232,3233,3234,3235,3236],
        "Summer Pirates": [3458,3460,3461,3462,3463,3464,3465],
        "Christmas Hybrids": [3490,3491,3492,3493,3494,3495,3496,3497]
    },
    "Fillers": {
        "Junk": [3065,3034,2811,2710,2562,2561,2560,2559,2558,2557,2327,2326,2325,2297,2234,2082,2080,111,81,80,79,...BodyMods,...AvatarEffects,...Usernames],
        "Regular": [2688,2552,2551,2550,2139,2138,1988,1987,125,116],
        "Premium": [3144,2689,2585,2323,2306,2300,2295,145,144,143,142,141,127,126,124,115,114,113,109,108,107,106,105,104,103,102,101,100,99,98]
    }
};

$(document).ready(function() {
    'use strict';
    $('#items').before('<br><div id="tcfilter"><span id="tcfilter_back">&#x1F844</span><ul id="tcfilter_list" style="div-align: left"></ul></div>');
    $('#tcfilter').css({'width':'375px', 'float':'left', 'position': 'relative', 'left': '0px', 'clear':'both'});
    $('#tcfilter_back').css('float','left').css('top','12px').css('left','10px').css('position','absolute').css('z-index','2').css('font-size','28px').css('color','#999')
        .on('mouseenter', ()=>{$('#tcfilter_back').css({'cursor':'pointer','color':'#fff', 'border':'1px'});}).on('mouseleave', ()=>{$('#tcfilter_back').css({'cursor':'none','color':'#999','border':'0'});});
    //create_zero_level_filter();
    create_root_filters();
});

function create_root_filters() {
    $('#tcfilter_list').empty();
    for(let key of Object.keys(Items)) {
        const key_id = key.replace(/[^a-zA-Z\d]/g, "");
        $('#tcfilter_list').append(`<li class="filter"><button id="filter_${key_id}" class='filter_button'>${key}</button></li>`);
    }
    $('.filter').css({'list-style-type':'none', 'display': 'inline-block', 'float': 'left','width':'30%', 'height':'50px','position':'relative','margin':'4px', 'padding':'0px'});
    $('.filter_button').css('width', '100px').css('height', '40px').css('font-size','14px').css('margin','3px');
    $('#tcfilter_back').css('display','none').off('click');
    $('.filter_button').click((evt)=>{ navigate_filter([evt.target.innerText]); });
    filterTradeItems(null);
    $('#search_query').css("display", 'inline');
    $('#items > span:first-of-type').css("display", 'inline');
}

//path is an array with each item is the keys in Items
//iterating through path will get to the current Object/Array, where path[path.length-1] is the current item key
//and path[path.length-2] is the parent key.
function navigate_filter(path) {
    if (!path || path.length===0) { //path is empty? create root filter
        debug("Create Root");
        create_root_filters();
        return;
    }
    let filter=Items[path[0]];
    for (let i=1; i<path.length; i++) { //skip first item
        filter=filter[path[i]];
    }
    debug(path);
    debug(filter);
    const key = path[path.length-1];
    if (Array.isArray(filter)) { //this is the last level to navigate
        debug("Create terminal list");
        $('#tcfilter_list').empty().append(`<h1>${key}</h1>`).css('margin','0');
        $('.filter').css('list-style-type','none').css('float','left').css('width','100px').css('height','50px').css('position','relative').css('margin','4px').css('padding','0px');
        $('.filter_button').css('width', '100px').css('height', '45px').css('font-size','14px');
        $('#items > span:first-of-type').css("display", 'none');
        filterTradeItems(filter);
    } else { //filter is an Object
        debug("Create intermediate list");
        const $ul = $('#tcfilter_list').empty().css('margin','0');
        for(let key of Object.keys(filter)) {
            $ul.append(`<li class="filter"><button id="filter_${key.replace(/[^a-zA-Z\d]/g,"")}" class="filter_button">${key}</button></li>`);
            $('#filter_'+key.replace(/[^a-zA-Z\d]/g,"")).click( evt => { navigate_filter([...path, evt.target.innerText]); });
        }
        $('#items > span:first-of-type').css("display", 'none');
        const list = concatArraysInObject(filter);
        debug(list);
        filterTradeItems(list);
        $('.filter').css({'list-style-type':'none', 'display': 'inline-block', 'float': 'left', 'width':'30%', 'height':'50px','position':'relative','margin':'4px', 'padding':'0px'});
        $('.filter_button').css('width', '100px').css('height', '45px').css('font-size','14px');
    }
    $('#search_query').css("display", 'none');
    $('#tcfilter_back').css('display','block').one('click', ()=>{navigate_filter(path.slice(0, path.length-1));});
}

//navigate object recursively until array found and returns an Array of all items concatenated
function concatArraysInObject(obj) {
    if (typeof obj === "object") {
        if (Array.isArray(obj)) return obj; //this is an Array, return it
        let arr = Array();
        for (let key of Object.keys(obj)) {
            arr = arr.concat(concatArraysInObject(obj[key])); //recursive function to search for more arrays in inner object
        }
        return arr;
    } else {
        return [obj]; //some other base type, return it in an array
    }
}

function filterTradeItems(ids) {
    const items = document.querySelectorAll('#main-items-wrapper li');
    for (let i=0; i<items.length; i++) {
        if (ids === null || ids.includes(parseInt(items[i].dataset.item))) {
            items[i].classList.remove("hidden");
        } else {
            items[i].classList.add("hidden");
        }
    }
}

function debug(s) {
    if (DEBUG_MODE) console.log(s);
}