// ==UserScript==
// @name         Steam赛博父子鉴定 (游戏库蓝绿|一键私密|库存价值统计)
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  游戏库蓝绿|一键私密|库存价值统计
// @author       Rawwiin
// @match        https://steamcommunity.com/id/*/games/*
// @match        https://steamcommunity.com/id/*/games?*
// @match        https://steamcommunity.com/profiles/*/games/*
// @match        https://steamcommunity.com/profiles/*/games?*
// @icon      	 https://store.steampowered.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_info
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/490371/Steam%E8%B5%9B%E5%8D%9A%E7%88%B6%E5%AD%90%E9%89%B4%E5%AE%9A%20%28%E6%B8%B8%E6%88%8F%E5%BA%93%E8%93%9D%E7%BB%BF%7C%E4%B8%80%E9%94%AE%E7%A7%81%E5%AF%86%7C%E5%BA%93%E5%AD%98%E4%BB%B7%E5%80%BC%E7%BB%9F%E8%AE%A1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490371/Steam%E8%B5%9B%E5%8D%9A%E7%88%B6%E5%AD%90%E9%89%B4%E5%AE%9A%20%28%E6%B8%B8%E6%88%8F%E5%BA%93%E8%93%9D%E7%BB%BF%7C%E4%B8%80%E9%94%AE%E7%A7%81%E5%AF%86%7C%E5%BA%93%E5%AD%98%E4%BB%B7%E5%80%BC%E7%BB%9F%E8%AE%A1%29.meta.js
// ==/UserScript==
// TODO
// BUG
// 过滤游戏卡顿

const url_my_wishlist = "https://steamcommunity.com/my/wishlist/";
// const wishlistUrl = "https://store.steampowered.com/wishlist"
const url_my_games = "https://steamcommunity.com/my/games?tab=all";
const url_vac_games =
    "https://store.steampowered.com/search/?sort_by=Released_DESC&category1=998&category2=8&ndl=1";
const url_appdetails = "https://store.steampowered.com/api/appdetails/?appids=";
const url_appdetails_price_overview =
    "https://store.steampowered.com/api/appdetails/?filters=price_overview&cc=cn&appids=";
const color_own = "#54662f";
const color_own_sub = color_own; //"#30655f";
const color_wish = "#4c90b6";
const price_gradient = [6, 11, 29, 42, 58, 76, 108, 136, 168, 198, 238, 268];
const price_high = 198;
const price_middle = 76;
const price_low = 29;
const color_price_high = "#ca2842";
const color_price_middle = "#b9a074";
const vacAppidList = [
    655740, 505460, 346330, 559650, 393380, 445220, 629760, 690790, 299740, 221100, 327090, 707010,
    252490, 700330, 476600, 730, 346110, 304930, 436520, 232090, 292730, 324810, 363680, 88801,
    394690, 372000, 451130, 225840, 360940, 394510, 376210, 311210, 290340, 260430, 299360, 321260,
    239140, 90948, 290790, 274940, 209650, 282800, 209160, 222880, 224260, 243800, 570, 222480,
    223710, 104900, 221040, 227100, 212480, 202970, 4920, 215470, 219640, 61730, 214360, 204300,
    212410, 209610, 14770, 201070, 58610, 115300, 65800, 17710, 35450, 63950, 55110, 70000, 63000,
    201270, 55100, 63200, 63500, 42700, 300, 39000, 17570, 550, 10180, 1250, 500, 17500, 469, 440,
    6510, 4000, 2100, 2400, 360, 1200, 320, 240, 80, 30, 40, 10, 60, 50, 20, 70, 1245620, 976730,
    555160, 1888160, 471710, 678950, 1172620, 454650, 671860, 251570, 518150, 823130, 252490,
    1568590, 1268750, 418460, 1372110, 1461600, 1818750, 444090, 1399780, 581320, 552500, 633230,
    266410, 1301210, 1815230, 291550, 447040, 686810, 594650, 393380, 1785150, 1097150, 798510,
    950180, 1824220, 333930, 820520, 1029690, 381210, 544920, 886250, 378860, 1024890, 1928420,
    460930, 438740, 282660, 1961460, 466240, 386360, 761890, 626690, 383120, 1172470, 753650,
    1957780, 884660, 1575680, 2087030, 1377380, 299360, 706220, 307950, 715220, 895400, 1133060,
    961200, 315210, 1556200, 393420, 327690, 813820, 1650010, 915810, 573100, 736220, 2073850,
    582660, 760160, 2152790, 909750, 438100, 872200, 513710, 918570, 1789480, 1241100, 1049800,
    651150, 1433140, 1121710, 714080, 1293660, 816020, 973580, 301520, 1956740, 964440, 1371580,
    783770, 2221490, 1599340, 473690, 1262240, 1240440, 2051120, 1063730, 215100, 719890, 707010,
    1194810, 269210, 304390, 1097840, 1227800, 2285150, 766370, 1286320, 1635450, 1008580, 715400,
    1163550, 1473640, 1361210, 674690, 1607250, 835860, 1222730, 625340, 924970, 1294660, 299740,
    611020, 1780330, 1963590, 520530, 1493750, 876460, 1189800, 381990, 1058650, 641080, 611360,
    1566880, 322780, 236390, 1501750, 920690, 519190, 2000590, 1180380, 903950, 556440, 647590,
    1436900, 1009290, 1233550, 314430, 1054690, 1186040, 1170950, 644290, 1913210, 1183940, 1903270,
    1527890, 293220, 939510, 1442910, 1106750, 906930, 1132210, 622170, 880850, 1206370, 437220,
    344760, 867400, 1226470, 594770, 2170420, 1276760, 2064870, 377140, 1816670, 547860, 2119490,
    1147660, 991560, 751240, 1254120, 304030, 1093170, 2000270, 375230, 922620, 656240, 927350,
    1171690, 653120, 1473480, 1408680, 805110, 819500, 2083800, 1412620, 738530, 1765520, 1769930,
    1057240, 993870, 889750, 1133430, 1991140, 1419640, 331810, 752720, 1367080, 1657090, 202090,
    421650, 419520, 42160, 584210, 738090, 1611740, 585030, 234530, 804810, 1478540, 499470,
    1904230, 2719160, 1638720, 1205550, 709310, 2076040, 942810, 1271810, 819970, 2156210, 1692190,
    596350, 763420, 719690, 923330, 770720, 1724660, 700580, 768350, 912290, 1888340, 1530870,
    1004390, 844630, 1681770, 759510, 774941, 1487410, 737010, 2089760, 2023760, 1661320, 1793660,
    654310, 878760, 737230, 858460, 1504620, 1692200, 1581460, 1504860, 468220, 1843080, 1867420,
    1477610, 1829770, 1958370, 2222330, 1725420, 1585520, 2053090, 2324560, 2572270, 1940990,
    2321720, 1875460, 1666300, 2654250, 2429660, 2427520, 1469120, 2842380, 1930870, 1189980,
    2337480, 2231910, 1532550, 2699000, 2437010, 2287610, 1176940, 2790800, 2713510, 2383590,
    2338060, 2313860, 2258030, 2236250, 2220430, 2125710, 1993280, 1948950, 377610, 2275170,
    2101000, 2855320, 2818760, 2790880, 2781480, 2633570, 2611730, 2549560, 2542690, 2464790,
    2295890, 2291900, 2259670, 2240860, 2090780, 2069210, 2021400, 2011600, 1826330, 1781970,
    1655340, 1641290, 1639880, 1622200, 1582170, 1472900, 1435990, 1426320, 1368990, 1332530,
    1326050, 1318350, 1297110, 1281720, 1270350, 1265940, 1172630, 1150000, 1143930, 1085780,
    1067170, 1064780, 1064280, 996600, 972310, 924720, 920720, 911460, 882430, 845260, 844650,
    822500, 803370, 746200, 743300, 737770, 689410, 640100, 579850, 568660, 550790, 541790, 524930,
    459430, 418480, 405100, 381690, 369520, 349360, 347130, 331370, 258550, 304930, 222880, 33930,
    107410, 359550, 346110, 2290180, 447820, 646910, 1520470, 218230, 1085660, 761890, 440900,
    550650, 221100, 209870, 1083500, 747610, 1872760, 227940, 362300, 1934780, 407530, 1549180,
    1874880, 1263550, 868270, 840800, 436520, 295110, 2399830, 578080, 433850, 764920, 355840,
    433350, 439700, 530700, 815940, 1443350, 834910, 714210, 987350, 681660, 895970, 619080,
    1372880, 555440, 513650, 459510, 1619990, 622590, 623990, 813000, 1600360, 931180, 994440,
    802240, 1890860, 2325320, 2430930, 2358330, 1382120, 1075340, 1024020, 1006030, 975570, 950520,
    845220, 764940, 764190, 760760, 667950, 459430, 445400, 407660, 376030, 960170, 1477590,
    1049590, 1827180, 239660, 439350, 582660, 237310, 1377580, 339610, 11610, 1056640, 286940,
    212390, 1011810, 454910, 1426440, 871120, 537180, 790650, 1826980, 253490, 1153700, 836620,
    1185560, 361800, 1825750, 337410, 1292630, 542590, 2371630, 1531430, 1218740, 747970, 349720,
    300970, 2356310, 921940, 2088180, 1132210, 2208530, 518660, 280620, 1287290, 1226470, 747920,
    1379750, 662320, 1674470, 2720700, 2229260, 389430, 1258320, 2170050, 1689070, 2639000, 1692070,
    1175210, 1524370, 681660, 1130700, 2258870, 369200, 223650, 102700, 360760, 356330, 1688720,
    389300, 591530, 109400, 624910, 568810, 1840560, 212240, 1658740, 1695900, 1829180, 1524240,
    2457550, 1804190, 696260, 2696470, 2710780, 1940810, 1874390, 754420, 516080, 2340400, 553850,
    2167580, 550650, 1608220, 558230, 354290, 1056640, 212390, 371310, 2426960, 1011810, 838330,
    890400, 1094710, 253490, 390100, 442080, 675560, 1338610, 539650, 1934850, 1232420, 1263550,
    295950, 1563940, 1674340, 1218740, 350700, 390090, 2356310, 921940, 1342630, 1630280, 721030,
    905640, 1226470, 536950, 1711430, 433350, 357500, 1549250, 2377950, 1863390, 949690, 1687760,
    874240, 548290, 2552340, 2361570, 1574360, 610940, 658510, 895970, 2016940, 102700, 315640,
    317110, 218470, 267790, 410560, 481890, 224320, 29520, 1952710, 2595550, 2208510, 2081110, 2200,
    2620, 7940, 21090, 2630, 35450, 10090, 9010, 48190, 9050, 1238860, 2210, 24960, 201870, 2640,
    17330, 15120, 32770, 13520, 9070, 24840, 17300, 203290, 13540, 19900, 324830, 17430, 47790,
    324850, 208480, 13140, 1238880, 1238820, 212630, 9460, 24860, 2350, 236830, 47830, 10170, 17340,
    3970, 21110, 21120, 211880, 10000, 32690, 32700, 7950, 238690, 212542, 203300, 13180, 10050,
    10030, 10010, 212200, 1184140, 212160, 273110, 1934780, 372000, 216150, 495910, 2107670,
    1175730, 2178420, 350280, 369200, 560380, 591530, 212180, 2074930, 927130, 1194260, 1979310,
    2107680, 2585120, 2119720, 2396970, 516080, 1671200, 1008080, 1672740, 1913730, 1364020,
    1881610, 1674340, 1969870, 1881700, 1668940, 1282270, 2009240, 2430450, 2541620, 1676000,
    2700330, 2581010, 384030, 231060, 212370, 212180, 221080, 212220, 238110, 1922560, 1811260,
    2195250, 2140330, 1517290, 2434630, 1010270, 555570, 1240290, 226700, 755790, 1674340, 994560,
    955100, 677620, 731620, 1990390, 1938090, 2075730, 1240410,
];

var isMarkOwn = true;
var isMarkWish = true;
var isHideOwn = false;
var isHideNotWish = false;
var shownCount = 0;

var myAppidList;
var mySubAppidList;
var myWishAppidList;
var hisAppidList;
var appidPrice = {};
var hisStrProfileName;

var gameListObserver;
var mySubProfileShowText = "";

var interval = 2000;
var retry = 200;

var domParser = new DOMParser();
var ico_vac = "https://store.akamai.steamstatic.com/public/images/v6/ico/ico_vac.png";
(function () {
    "use strict";
    console.log("开始鉴定...");
    // GM_xmlhttpRequest({
    //     method: "POST",
    //     url: "https://api.steampowered.com/IAccountPrivateAppsService/ToggleAppPrivacy/v1?access_token=655ca0ce4295bfaf5c40c4c9260a896d&spoof_steamid=",
    //     data: "input_protobuf_encoded=CLz/HxAB",
    //     onload: function (xhr) {
    //         console.log(xhr);
    //     },
    // });
    // getAppDetails(730);

    init();
})();

function init() {
    clear();

    let persona_name_text_content = document.getElementsByClassName(
        "whiteLink persona_name_text_content"
    );
    if (persona_name_text_content && persona_name_text_content.length) {
        hisStrProfileName = persona_name_text_content[0].textContent
            ? persona_name_text_content[0].textContent.trim()
            : "";
    }

    let account_pulldown = document.getElementById("account_pulldown");
    let myStrProfileName =
        account_pulldown && account_pulldown.textContent ? account_pulldown.textContent.trim() : "";
    // DEBUG
    // if (true) {
    if (myStrProfileName && myStrProfileName == hisStrProfileName) {
        loadHisGameList().then(() => {
            addStatusBar(true);
            addGameListObserver(500);
        });
        return;
    } else if (!myStrProfileName || myStrProfileName != GM_getValue("myStrProfileName")) {
        // 切换账号
        GM_deleteValue("myStrProfileName");
        GM_deleteValue("myAppidList");
        GM_deleteValue("myWishAppidList");
    }
    addSectionTabListener();
    const myGamesPromise = loadMyGameList();
    myGamesPromise.then(() => {
        if (myStrProfileName) {
            GM_setValue("myStrProfileName", myStrProfileName);
        }
    });
    const myWishPromise = loadMyWishlist();
    const hisGameListPromise = loadHisGameList();
    const mySubGamesPromise = loadMySubGameList();
    Promise.all([myGamesPromise, myWishPromise, hisGameListPromise, mySubGamesPromise])
        .then(() => {
            refreshGameDivList();
            addStatusBar();
            addGameListObserver(500);
        })
        .catch((error) => {
            console.error(error);
        });
}

function refresh() {
    refreshGameDivList();
    refreshStatusBar();
}

function clear() {
    hisAppidList = null;
    removeStatusBar();
    // if (gameListObserver) {
    //     gameListObserver.disconnect();
    //     gameListObserver = null;
    // }
}

function loadMyGameList() {
    return new Promise((resolve, reject) => {
        if ((myAppidList = GM_getValue("myAppidList")) && myAppidList.length) {
            console.log("缓存加载我的游戏", myAppidList.length);
            resolve();
            return;
        }
        getAppidListFromGamePage(url_my_games).then((appidList) => {
            myAppidList = appidList;
            // 缓存
            GM_setValue("myAppidList", myAppidList);
            console.log("加载我的游戏", myAppidList && myAppidList.length);
            resolve();
        });
    });
}

function getAppidListFromGamePage(url) {
    return new Promise((resolve, reject) => {
        if (!url) {
            resolve([]);
        }
        load(url, (res) => {
            let doc = domParser.parseFromString(res, "text/html");
            let dataProfileGameslist = getDataProfileGameslist(doc);
            let rgGames = getRgGames(dataProfileGameslist);
            let appidList = rgGames ? rgGames.map((game) => game.appid) : [];
            resolve(appidList);
        });
    });
}

function loadMySubGameList(subProfileListStr) {
    return new Promise((resolve, reject) => {
        mySubAppidList = [];
        let mySubProfile = GM_getValue("mySubProfile");
        if (!mySubProfile) {
            mySubProfile = {};
        }
        if (subProfileListStr) {
            let promises = [];
            const id64Rgx = /^\d{17}$/;
            subProfileListStr.split(",").forEach((subProfile) => {
                if (!subProfile) {
                    return;
                }
                let promise = getAppidListFromGamePage(
                    "https://steamcommunity.com/" +
                        (id64Rgx.test(subProfile) ? "profiles" : "id") +
                        "/" +
                        subProfile +
                        "/games/?tab=all"
                );
                promise.then((appidList) => {
                    mySubProfile[subProfile] = appidList;
                });
                promises.push(promise);
            });
            Promise.all(promises).then(() => {
                loadMySubAppidList(mySubProfile);
                resolve();
            });
        } else {
            loadMySubAppidList(mySubProfile);
            resolve();
        }
    });
}

function loadMySubAppidList(mySubProfile) {
    mySubProfileShowText = "";
    mySubAppidList = [];
    for (let subProfile in mySubProfile) {
        let appidList = mySubProfile[subProfile];
        appidList.forEach((appid) => {
            if ((!myAppidList || !myAppidList.includes(appid)) && !mySubAppidList.includes(appid)) {
                mySubAppidList.push(appid);
            }
        });
        if (mySubProfileShowText) {
            mySubProfileShowText += " | ";
        } else {
            mySubProfileShowText = "小号(游戏数)：";
        }
        mySubProfileShowText += subProfile + "(" + appidList.length + ")";
    }
    console.log("加载小号的游戏", mySubAppidList && mySubAppidList.length);
    GM_setValue("mySubProfile", mySubProfile);
}

function loadMyWishlist() {
    return new Promise((resolve, reject) => {
        if ((myWishAppidList = GM_getValue("myWishAppidList")) && myWishAppidList.length) {
            console.log("缓存加载我的愿望单", myWishAppidList.length);
            resolve();
            return;
        }
        load(url_my_wishlist, (res) => {
            let doc = domParser.parseFromString(res, "text/html");
            let myRgWishlistData = rgWishlistData(doc);
            myWishAppidList = myRgWishlistData ? myRgWishlistData.map((game) => game.appid) : [];
            GM_setValue("myWishAppidList", myWishAppidList);
            console.log("加载我的愿望单", myWishAppidList && myWishAppidList.length);
            // myWishAppidList = getAppids(res);
            // console.log("加载我的愿望单", myWishAppidList.length);
            resolve();
        });
    });
}

function loadHisGameList() {
    return new Promise((resolve) => {
        let count = 0;
        const intervalId = setInterval(() => {
            if (count++ > retry) {
                // 结束定时器
                clearInterval(intervalId);
                resolve();
                return;
            }
            let hisDataProfileGameslist = getDataProfileGameslist(document);
            if (hisDataProfileGameslist) {
                let hisRgGames = getRgGames(hisDataProfileGameslist);
                hisAppidList = hisRgGames ? hisRgGames.map((game) => game.appid) : [];
                console.log("加载TA的游戏", hisAppidList && hisAppidList.length);
                if (hisAppidList && hisAppidList.length) {
                    let appids = "";
                    let requestPromiseArray = [];
                    for (let i = 0; i < hisAppidList.length; i++) {
                        let appid = hisAppidList[i];
                        if (appids) {
                            appids += ",";
                        }
                        appids += appid;

                        if (i + 1 == hisAppidList.length || appids.length >= 1900) {
                            let request = getAppDetails(url_appdetails_price_overview, appids);
                            request.then((appdetails) => {
                                for (let key in appdetails) {
                                    let price_overview;
                                    if (
                                        appdetails[key] &&
                                        appdetails[key].data &&
                                        (price_overview = appdetails[key].data.price_overview)
                                    ) {
                                        appidPrice[key] = price_overview.initial;
                                    }
                                }
                            });
                            requestPromiseArray.push(request);
                            appids = "";
                        }
                    }
                    Promise.all(requestPromiseArray).then(() => {
                        refresh();
                    });
                }
                clearInterval(intervalId);
                resolve();
            }
        }, interval);
    });
}
``;

function addStatusBar(isSelfPage) {
    let count = 0;
    const intervalId = setInterval(() => {
        if (count++ > retry) {
            clearInterval(intervalId);
            return;
        }

        // let element = document.getElementsByClassName("_2_BHLBIwWKIyKmoabfDFH-");
        let element = document.getElementsByClassName("_3tY9vKLCmyG2H2Q4rUJpkr ");
        if (element && element.length) {
            removeStatusBar();
            // style='display: flex;flex-wrap: wrap;justify-content:space-between;align-items:center;'
            //  style='display: grid;grid-template-columns: auto auto auto 1fr;justify-items: start;'
            if (isSelfPage) {
                let html =
                    "<div class='cyberFatherStatusBar'>" +
                    "<div style='display: grid;grid-template-columns: auto auto auto auto auto 1fr;justify-items: start;'>" +
                    '<button id="privateMPGames" class="privateGames" style="background:transparent;color:#199FFF;border:none;cursor: pointer;">私密多人游戏</button>' +
                    '<button id="privatePVPOLGames" class="privateGames" style="margin-left: 10px;background:transparent;color:#199FFF;border:none;cursor: pointer;">私密线上玩家对战游戏</button>' +
                    '<button id="privateVacGames" class="privateGames" style="margin-left: 10px;background:transparent;color:#199FFF;border:none;cursor: pointer;">私密VAC/AntiCheat游戏</button>' +
                    '<button id="privateAllGames" class="privateGames" style="margin-left: 10px;background:transparent;color:#199FFF;border:none;cursor: pointer;">私密所有游戏</button>' +
                    '<button id="unprivateAllGames" class="privateGames" style="margin-left: 10px;background:transparent;color:#199FFF;border:none;cursor: pointer;grid-column-end: span 2;">取消所有私密</button>' +
                    // "</div>" +
                    // "<div style='display: grid;grid-template-columns: auto auto auto auto 1fr;justify-items: start;'>" +
                    "<label style='margin-left: 0;display: none;' class='hisWorthDiv'>我的库存价值:" +
                    "<span id='hisWorth'></span>" +
                    "</label>" +
                    "<label style='margin-left: 15px;display: none;' class='hisWorthDiv'>均价:" +
                    "<span id='hisWorthAVG'></span>" +
                    "</label>" +
                    "<label style='margin-left: 15px;display: none;' class='hisWorthDiv'>¥" +
                    price_high +
                    "及以上游戏数:" +
                    "<span id='hisWorthHighNum' style='color:" +
                    color_price_high +
                    "'></span>" +
                    "</label>" +
                    "<label style='margin-left: 15px;display: none;' class='hisWorthDiv'>¥" +
                    price_middle +
                    " ~ ¥" +
                    (price_high - 1) +
                    "游戏数:" +
                    "<span id='hisWorthMiddleNum' style='color:" +
                    color_price_middle +
                    "'></span>" +
                    "</label>" +
                    "<label style='margin-left: 15px;display: none;' class='hisWorthDiv'>¥1 ~ ¥" +
                    price_low +
                    "游戏数:" +
                    "<span id='hisWorthLowNum'></span>" +
                    "</label>" +
                    "<div style='margin-left: 15px;display: none;' class='hisWorthDiv'>" +
                    '<select id="priceSelect"></select>' +
                    '<button id="privatePriceGames" class="privateGames" style="margin-left: 0;background:transparent;color:#199FFF;border:none;cursor: pointer;">私密</button>' +
                    "</div>" +
                    "</div>" +
                    '<span id="privateResult" style="display:none;grid-column-end: span 2;"></span>' +
                    // '<div id="cfOverlay" style="display: none; position: fixed; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 2; cursor: pointer;">' +
                    // "</div>" +
                    "</div>";
                element[0].insertAdjacentHTML("beforebegin", html);
                let priceSelect = document.getElementById("priceSelect");
                if (priceSelect) {
                    let options = '<option value="0">免费游戏</option>';
                    for (let i = 0; i < price_gradient.length; i++) {
                        let price = price_gradient[i];
                        options +=
                            '<option value="' + price * 100 + '">¥1 ~ ¥' + price + "</option>";
                    }
                    priceSelect.innerHTML = options;
                }

                let privateGamesEles = document.getElementsByClassName("privateGames");
                if (privateGamesEles && privateGamesEles.length) {
                    for (let i = 0; i < privateGamesEles.length; i++) {
                        const ele = privateGamesEles[i];
                        let eleId = ele.getAttribute("id");
                        ele.addEventListener("click", function () {
                            switch (eleId) {
                                case "privateMPGames":
                                    privateGames(true, null, [1, 8, 36]);
                                    break;
                                case "privatePVPOLGames":
                                    privateGames(true, null, [8, 36]);
                                    break;
                                case "privateVacGames":
                                    // getVacAppidList().then((vacAppidList) => {
                                    //     privateGames(true, vacAppidList);
                                    // });
                                    privateGames(true, vacAppidList);
                                    break;
                                case "privateAllGames":
                                    privateGames(true);
                                    break;
                                case "unprivateAllGames":
                                    privateGames(false);
                                    break;
                                case "privatePriceGames":
                                    let price = priceSelect.value;
                                    if (price != null) {
                                        privateGames(true, null, null, price);
                                    }
                                    break;

                                default:
                                    break;
                            }
                        });
                    }
                }
            } else {
                if (!hisAppidList) {
                    clearInterval(intervalId);
                    return;
                }
                let html =
                    "<div class='cyberFatherStatusBar'>" +
                    "<div style='display: grid;grid-template-columns: auto auto auto auto 1fr;justify-items: start;'>" +
                    "<label style='margin-left: 0;'>TA拥有我库存外的游戏:" +
                    "<span id='notHave'></span>" +
                    "</label>" +
                    "<label style='margin-left: 15px;'>TA拥有我愿望单中的游戏:" +
                    "<span id='inWish'></span>" +
                    "</label>" +
                    "<label style='margin-left: 15px;'>鉴定结果：" +
                    "<span id='identify'></span>" +
                    "</label>" +
                    // "<label style='margin-left: 15px; justify-self: end;'>仅显示愿望单中的游戏" +
                    // '<input type="checkbox" name="myCheckbox" value="1" id="checkbox_hideNotWish" style="margin: 3px">' +
                    // "</label>" +
                    "<label style='margin-left: 15px; justify-self: end;grid-column-end: span 2;'>隐藏已拥有的游戏" +
                    '<input type="checkbox" name="myCheckbox" value="1" id="checkbox_hideMine" style="margin: 3px">' +
                    "</label>" +
                    // "</div>" +
                    // "<div style='display: grid;grid-template-columns: auto auto auto auto 1fr;justify-items: start;'>" +
                    "<label style='margin-left: 0;display: none;' class='hisWorthDiv'>TA的库存价值:" +
                    "<span id='hisWorth'></span>" +
                    "</label>" +
                    "<label style='margin-left: 15px;display: none;' class='hisWorthDiv'>均价:" +
                    "<span id='hisWorthAVG'></span>" +
                    "</label>" +
                    "<label style='margin-left: 15px;display: none;' class='hisWorthDiv'>¥" +
                    price_high +
                    "及以上游戏数:" +
                    "<span id='hisWorthHighNum' style='color:" +
                    color_price_high +
                    "'></span>" +
                    "</label>" +
                    "<label style='margin-left: 15px;display: none;' class='hisWorthDiv'>¥" +
                    price_middle +
                    " ~ ¥" +
                    (price_high - 1) +
                    "游戏数:" +
                    "<span id='hisWorthMiddleNum' style='color:" +
                    color_price_middle +
                    "'></span>" +
                    "</label>" +
                    "<label style='margin-left: 15px;display: none;' class='hisWorthDiv'>¥" +
                    price_low +
                    "以下游戏数:" +
                    "<span id='hisWorthLowNum'></span>" +
                    "</label>" +
                    "</div>" +
                    "<div style='display: grid;grid-template-columns: auto auto 1fr;justify-items: start;'>" +
                    '<button id="addSubProfile" style="background:transparent;color:#199FFF;border:none;cursor: pointer;">添加小号</button>' +
                    '<button id="removeSubProfileBtn" style="margin-left: 10px;background:transparent;color:#199FFF;display:none;border:none;cursor: pointer;">清空小号</button>' +
                    "<span id='subProfileListDiv' style='margin-left: 10px;'></span>" +
                    "</div>" +
                    "</div>";
                element[0].insertAdjacentHTML("beforebegin", html);
                refreshStatusBar();
                let checkbox_hideMine = document.getElementById("checkbox_hideMine");
                if (checkbox_hideMine) {
                    checkbox_hideMine.addEventListener("change", function () {
                        isHideOwn = checkbox_hideMine.checked;
                        refreshGameDivList();
                    });
                }
                let checkbox_hideNotWish = document.getElementById("checkbox_hideNotWish");
                if (checkbox_hideNotWish) {
                    checkbox_hideNotWish.addEventListener("change", function () {
                        isHideNotWish = checkbox_hideNotWish.checked;
                        refreshGameDivList();
                    });
                }

                let addSubProfile = document.getElementById("addSubProfile");
                if (addSubProfile) {
                    addSubProfile.addEventListener("click", function () {
                        let addSubProfileListStr = prompt("请输入小号ID或64位ID");
                        if (addSubProfileListStr) {
                            loadMySubGameList(addSubProfileListStr).then(() => {
                                refresh();
                            });
                        }
                    });
                }
                let removeSubProfileBtn = document.getElementById("removeSubProfileBtn");
                if (removeSubProfileBtn) {
                    removeSubProfileBtn.addEventListener("click", function () {
                        GM_deleteValue("mySubProfile");
                        loadMySubGameList().then(() => {
                            refresh();
                        });
                    });
                }
            }
            refreshStatusBar();
            clearInterval(intervalId);
        }
    }, interval);
}

function refreshStatusBar() {
    let subProfileListDiv = document.getElementById("subProfileListDiv");
    if (subProfileListDiv) {
        subProfileListDiv.textContent = mySubProfileShowText ? mySubProfileShowText : "";
    }
    let removeSubProfileBtn = document.getElementById("removeSubProfileBtn");
    if (removeSubProfileBtn) {
        removeSubProfileBtn.style.display = mySubProfileShowText ? "block" : "none";
    }
    let notHave = 0;
    let inWish = 0;
    hisAppidList.forEach(function (appid) {
        if (
            (!myAppidList || !myAppidList.includes(appid)) &&
            (!mySubAppidList || !mySubAppidList.includes(appid))
        ) {
            notHave++;
        }
        if (myWishAppidList && myWishAppidList.includes(appid)) {
            inWish++;
        }
    });
    let notHaveEle = document.getElementById("notHave");
    if (notHaveEle) {
        notHaveEle.textContent = notHave;
    }
    let inWishEle = document.getElementById("inWish");
    if (inWishEle) {
        inWishEle.textContent = inWish;
    }
    let identifyEle = document.getElementById("identify");
    if (identifyEle) {
        identifyEle.textContent = identify();
    }
    if (appidPrice) {
        let hisWorth = 0;
        let highNum = 0;
        let middleNum = 0;
        let lowNum = 0;
        let i = 0;
        for (let key in appidPrice) {
            i++;
            let price = parseInt(appidPrice[key] / 100);
            hisWorth += price;
            if (price >= price_high) {
                highNum++;
            } else if (price >= price_middle) {
                middleNum++;
            } else if (price <= price_low) {
                lowNum++;
            }
        }
        let hisWorthAVG = i ?  parseInt(hisWorth / i) : 0;
        let hisWorthDivs = document.getElementsByClassName("hisWorthDiv");
        if (hisWorth && hisWorthDivs && hisWorthDivs.length) {
            for (let i = 0; i < hisWorthDivs.length; i++) {
                hisWorthDivs[i].style.display = "block";
            }
            let hisWorthSpan = document.getElementById("hisWorth");
            hisWorthSpan && (hisWorthSpan.innerText = "¥ " + hisWorth);
            let hisWorthAVGSpan = document.getElementById("hisWorthAVG");
            hisWorthAVGSpan && (hisWorthAVGSpan.innerText = "¥ " + hisWorthAVG);
            let highNumSpan = document.getElementById("hisWorthHighNum");
            highNumSpan && (highNumSpan.innerText = highNum);
            let middleNumSpan = document.getElementById("hisWorthMiddleNum");
            middleNumSpan && (middleNumSpan.innerText = middleNum);
            let lowNumSpan = document.getElementById("hisWorthLowNum");
            lowNumSpan && (lowNumSpan.innerText = lowNum);
        }
    }
}

function removeStatusBar() {
    let statusBars = document.getElementsByClassName("cyberFatherStatusBar");
    if (statusBars && statusBars.length) {
        for (let i = 0; i < statusBars.length; i++) {
            statusBars[i].remove();
        }
    }
}

function identify() {
    let identity = "";
    let myGameNum = myAppidList ? myAppidList.length : 0;
    let hisGameNum = hisAppidList ? hisAppidList.length : 0;
    if (myGameNum == 0 || hisGameNum == 0) {
        return "无法鉴定";
    }
    let diff = hisGameNum - myGameNum;
    let multi = hisGameNum / myGameNum;
    if (diff == 0) {
        identity = "世另我";
    } else if (hisGameNum <= 10) {
        identity = "老六";
    } else if (myGameNum > 100) {
        if (diff >= 0) {
            if (multi >= 3) {
                identity = "义父";
            } else {
                identity = "义兄";
            }
        } else {
            if (multi >= 0.5) {
                identity = "义弟";
            } else {
                identity = "义子";
            }
        }
    } else {
        if (multi > 5) {
            identity = "义父";
        } else if (diff >= 0) {
            identity = "义兄";
        } else {
            identity = "义弟";
        }
    }

    let describe;
    // if (myAppidList.length >= 10 && hisAppidList.length >= 10) {
    //     let myTop100 = myAppidList.slice(0, 100);
    //     let hisTop100 = hisAppidList.slice(0, 100);
    //     let hisTop10 = hisTop100.slice(0, 10);
    //     // let intersection = new Set(
    //     //     [...myTop100].filter((x) => hisTop100.has(x))
    //     // );
    //     let intersection = 0;
    //     for (let i = 0; i < myTop100.length; i++) {
    //         if (hisTop100.includes(myTop100[i])) {
    //             if (i < 10 && hisTop10.includes(myTop100[i])) {
    //                 intersection += myTop100.length / 10 - i + 1;
    //             } else {
    //                 intersection += 1;
    //             }
    //         }
    //     }
    //     let fact = intersection / myTop100.length;
    //     if (intersection >= 90 || fact >= 0.9) {
    //         describe = "臭味相投";
    //     } else if (intersection >= 80 || fact >= 0.8) {
    //         describe = "心照神交";
    //     } else if (intersection >= 70 || fact >= 0.7) {
    //         describe = "相知恨晚";
    //     } else if (intersection >= 60 || fact >= 0.6) {
    //         describe = "志同道合";
    //     } else if (intersection >= 50 || fact >= 0.5) {
    //         describe = "同声相应";
    //     } else if (intersection >= 40 || fact >= 0.4) {
    //         describe = "不谋而合";
    //     } else if (intersection >= 30 || fact >= 0.3) {
    //         describe = "所见略同";
    //     } else if (intersection >= 20 || fact >= 0.2) {
    //         describe = "萍水相逢";
    //     } else if (intersection >= 10 || fact >= 0.1) {
    //         describe = "聊胜于无";
    //     } else if (intersection >= 1 || fact >= 0.01) {
    //         describe = "南辕北辙";
    //     } else {
    //         describe = "格格不入"; //断长续短
    //     }
    // }
    return describe ? describe + "的" + identity : identity;
}

let refreshing = false;
function refreshGameDivList() {
    if (refreshing) {
        return;
    }
    refreshing = true;

    var gameListElement = document.getElementsByClassName("_29H3o3m-GUmx6UfXhQaDAm");
    if (gameListElement && gameListElement.length) {
        for (var i = 0; i < gameListElement.length; ++i) {
            let gameDiv = gameListElement[i];
            let appid = getAppidFromGameDiv(gameListElement[i]);
            hideGameDiv(appid, gameDiv);
            markGameDiv(appid, gameDiv);
            priceGameDiv(appid, gameDiv);
        }
    }

    // let hisGameNum = hisAppidList ? hisAppidList.length : 0;
    // var gameDiv = document.querySelector("._29H3o3m-GUmx6UfXhQaDAm");
    // let i = 0;
    // while (gameDiv && ++i <= hisGameNum) {
    //     let appid = getAppidFromGameDiv(gameDiv);
    //     lastGameDivTop = hideGameDiv(appid, gameDiv, lastGameDivTop);
    //     markGameDiv(appid, gameDiv);
    //     gameDiv = gameDiv.nextElementSibling;
    // }

    refreshing = false;
}

function getVacAppidList() {
    return new Promise(function (resolve, reject) {
        load(url_vac_games, (res) => {
            let doc = domParser.parseFromString(res, "text/html");
            let searchResultRowEles = doc.getElementsByClassName("search_result_row");
            let vacAppidList = [];
            for (let i = 0; i < searchResultRowEles.length; i++) {
                let element = searchResultRowEles[i];
                let appid = getAppidFromGameDiv(element);
                if (appid && !vacAppidList.includes(appid)) {
                    vacAppidList.push(appid);
                }
            }
            resolve(vacAppidList);
        });
    });
}

async function privateGames(private, appidList, categorieIds, price) {
    let hisGameNum = hisAppidList ? hisAppidList.length : 0;
    let i = 0;
    let count = 0;
    let gameDiv = document.querySelector("._29H3o3m-GUmx6UfXhQaDAm");
    let sectionTabs = document.getElementsByClassName("sectionTab active");
    if (sectionTabs && sectionTabs.length) {
        for (let j = 0; j < sectionTabs.length; j++) {
            let sectionTab = sectionTabs[j];
            let span = sectionTab.querySelector("span");
            if (span && span.innerText) {
                let match = span.innerText.match(/\d+/);
                let numStr = match && match[0];
                hisGameNum = parseInt(numStr);
                break;
            }
        }
    }
    let gameNameList = "";
    const interval = setInterval(
        function () {
            if (gameDiv && ++i <= hisGameNum) {
                if (i % 5 == 0) gameDiv.scrollIntoView({ block: "center", inline: "nearest" });
                let btns = gameDiv.getElementsByClassName("_1pXbX5mBA7v__kVWHg0_Ja");
                let aEle = getAEleFromGameDiv(gameDiv);
                let appid = getAppidFromAEle(aEle);
                let appName = aEle.innerText;
                if (i % 50 == 0) console.log(i + "/" + hisGameNum);
                if (btns && btns.length > 0) {
                    if (private && btns.length == 1) {
                        if (
                            (!appidList && !categorieIds && price == null) ||
                            (appidList && appidList.includes(appid)) ||
                            (price != null &&
                                ((price == 0 && !appidPrice[appid]) ||
                                    (appidPrice[appid] && appidPrice[appid] <= price)))
                        ) {
                            privateGame(true, btns, ++count / 100 + 100);
                            gameNameList += appName + "\n";
                        } else if (categorieIds && categorieIds.length) {
                            getAppDetails(url_appdetails, appid).then((res) => {
                                let data;
                                if (
                                    res &&
                                    res[appid] &&
                                    (data = res[appid].data) &&
                                    data.categories
                                ) {
                                    for (let i = 0; i < data.categories.length; i++) {
                                        if (categorieIds.includes(data.categories[i].id)) {
                                            privateGame(true, btns, ++count / 100 + 100);
                                            gameNameList += appName + "\n";
                                            break;
                                        }
                                    }
                                }
                            });
                        }
                    } else if (!private && btns.length >= 2) {
                        privateGame(false, btns, ++count / 100 + 100);
                        gameNameList += appName + "\n";
                    }
                }

                let nextGameDiv = gameDiv.nextElementSibling;
                gameDiv = nextGameDiv ? nextGameDiv : i < hisGameNum ? gameDiv : null;
            } else {
                let privateResult = document.getElementById("privateResult");
                if (privateResult) {
                    privateResult.innerText =
                        "本次执行" +
                        (private ? "私密 " : "取消私密 ") +
                        count +
                        " 款游戏：\n" +
                        gameNameList;
                    privateResult.style.display = "block";

                    privateResult.previousElementSibling
                        ? privateResult.previousElementSibling.scrollIntoView({
                              block: "center",
                              inline: "nearest",
                          })
                        : privateResult.scrollIntoView({ block: "center", inline: "nearest" });
                }
                clearInterval(interval);
            }
        },
        private ? 10 : 1
    );
}

function getAppDetails(url, appids) {
    return new Promise(function (resolve, reject) {
        load(url + appids, (res) => {
            resolve(getJsonFromStr(res));
        });
    });
}

function privateGame(private, btns, timeout) {
    if (private) {
        btns[btns.length - 1].click();
        setTimeout(() => {
            let contextMenuItems = document.getElementsByClassName(
                // "pFo3kQOzrl9qVLPXXGIMp contextMenuItem"
                "contextMenuItem"
            );
            if (contextMenuItems && contextMenuItems.length >= 6) {
                contextMenuItems[5].click();
            }
        }, 5);
    } else {
        btns[btns.length - 2].click();
    }
    // return new Promise(function (resolve, reject) {
    //     setTimeout(() => {
    //         if (private) {
    //             btns[btns.length - 1].click();
    //             setTimeout(() => {
    //                 let contextMenuItems = document.getElementsByClassName(
    //                     "pFo3kQOzrl9qVLPXXGIMp contextMenuItem"
    //                 );
    //                 if (contextMenuItems && contextMenuItems.length >= 6) {
    //                     contextMenuItems[5].click();
    //                 }
    //                 resolve();
    //             }, 300);
    //         } else {
    //             btns[btns.length - 2].click();
    //             resolve();
    //         }
    //     }, timeout);
    // });
}

// function privateGame(private, gameDiv, btns, timeout) {
//     return new Promise(function (resolve, reject) {
//         gameDiv.scrollIntoView({ block: "end", inline: "nearest" });
//         if (private) {
//             setTimeout(function () {
//                 btns[btns.length - 1].click();
//                 setTimeout(() => {
//                     let contextMenuItems = document.getElementsByClassName(
//                         "pFo3kQOzrl9qVLPXXGIMp contextMenuItem"
//                     );
//                     if (contextMenuItems && contextMenuItems.length >= 6) {
//                         contextMenuItems[5].click();
//                     }
//                     resolve();
//                 }, 500);
//             }, timeout);
//         } else {
//             setTimeout(function () {
//                 btns[btns.length - 2].click();
//                 resolve();
//             }, timeout);
//         }
//     });
// }

function hideGameDiv(appid, gameDiv) {
    let display = gameDiv.style.display;
    if (
        (isHideOwn &&
            ((myAppidList && myAppidList.includes(appid)) ||
                (mySubAppidList && mySubAppidList.includes(appid)))) ||
        (isHideNotWish && myWishAppidList && !myWishAppidList.includes(appid))
    ) {
        display = "none";
    } else {
        display = "block";
    }
    if (display != gameDiv.style.display) {
        gameDiv.style.display = display;
    }
}

function addSectionTabListener() {
    let count = 0;
    const intervalId = setInterval(() => {
        if (count++ > retry) {
            clearInterval(intervalId);
            return;
        }
        let sectionTabs = document.getElementsByClassName("_1sHACvEQL-LRtUYan0JxdB");
        if (sectionTabs && sectionTabs.length > 0) {
            let curUrl = window.location.href;
            let regex = /games\/\?(\w|=|&)*?tab=(all|perfect|recent)/g;
            sectionTabs[0].addEventListener("click", function (event) {
                let targetUrl = event.target.baseURI ? event.target.baseURI : "";
                if (curUrl == targetUrl) {
                    return;
                }
                curUrl = targetUrl;
                if (regex.match(targetUrl)) {
                    refreshGameDivList();
                }
            });

            clearInterval(intervalId);
        }
    }, interval);
}

function addGameListObserver(interval) {
    let timeout;
    // let lastGameListElementLength = 0;
    window.addEventListener("scroll", () => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            refreshGameDivList();
        }, interval);
    });
}

function markGameDiv(appid, gameDiv) {
    let color = gameDiv.style.backgroundColor;
    if (isMarkOwn && myAppidList && myAppidList.includes(appid)) {
        color = color_own;
    } else if (isMarkOwn && mySubAppidList && mySubAppidList.includes(appid)) {
        color = color_own_sub;
    } else if (isMarkWish && myWishAppidList && myWishAppidList.includes(appid)) {
        color = color_wish;
    }
    if (color != gameDiv.style.backgroundColor) {
        gameDiv.style.backgroundColor = color;
    }
}

function priceGameDiv(appid, gameDiv) {
    let price = appidPrice[appid];
    if (!price) {
        return;
    }
    let aEle = getAEleFromGameDiv(gameDiv);
    if (!aEle || aEle.innerText.includes("¥")) {
        return;
    }
    price = price / 100;
    aEle.innerText += "【¥" + price + "】";
    if (price >= price_high) {
        aEle.style.color = color_price_high;
    } else if (price >= price_middle) {
        aEle.style.color = color_price_middle;
    }
}

function load(url, callback) {
    try {
        return GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (xhr) {
                // console.log(xhr);
                callback(xhr.responseText ? xhr.responseText : "");
            },
        });
    } catch (e) {
        // location.href = 'https://keylol.com';
        console.log(e);
    }
}

function getAppids(res, sort) {
    let appid;
    if (sort) {
        let appidAndplaytimeRegex =
            /appid("|\\"|&quot;):(\d+).*?playtime_forever("|\\"|&quot;):(\d+)/g;
        let obj = {};
        while ((appid = appidAndplaytimeRegex.exec(res))) {
            obj[appid[2]] = appid[4];
        }
        let sortedKeys = Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
        return sortedKeys;
    } else {
        let appidRegex = /appid("|\\"|&quot;):(\d+)/g;
        let appidSet = new Set();
        // let appidList = [];
        while ((appid = appidRegex.exec(res))) {
            // appidList.push(appid[2]);
            appidSet.add(appid[2]);
        }
        return Array.from(appidSet);
    }
}
const appidRegex = /app\/(\d+)/;
function getAEleFromGameDiv(gameDiv) {
    return gameDiv && gameDiv.querySelector("._22awlPiAoaZjQMqxJhp-KP");
}

function getAppidFromAEle(aEle) {
    let href = aEle && aEle.getAttribute("href");
    let appid = appidRegex.exec(href ? href : "");
    return appid && parseInt(appid[1]);
}

function getAppidFromGameDiv(gameDiv) {
    let aEle = getAEleFromGameDiv(gameDiv);
    return getAppidFromAEle(aEle);
}

/**
 * 游戏库页面所有游戏列表
 * @param {*} document
 */
function getRgGames(dataProfileGameslist) {
    let rgGames = dataProfileGameslist && dataProfileGameslist.rgGames;
    return rgGames ? rgGames : [];
}

function getDataProfileGameslist(document) {
    let gameslist_config = document.getElementById("gameslist_config");
    if (gameslist_config) {
        // addGameListObserver(interval);
        let data_profile_gameslist = gameslist_config.getAttribute("data-profile-gameslist");
        return JSON.parse(data_profile_gameslist);
        // let rgGames = JSON.parse(data_profile_gameslist).rgGames;
        // return rgGames == null ? [] : rgGames;
        // // hisAppidList = getAppids(data_profile_gameslist);
    }
    return null;
}

function rgWishlistData(document) {
    const scriptElements = document.getElementsByTagName("script");
    for (const script of scriptElements) {
        // const scriptElement = document.querySelector("script");
        const scriptContent = script.textContent; // 获取 <script> 标签的内容
        if (!scriptContent) {
            continue;
        }
        const match = scriptContent.match(/var\s+g_rgWishlistData\s*=\s*(\[.+\])\s*;/); // 使用正则表达式匹配变量值
        const rgWishlistData = match && match[1]; // 提取变量值
        if (rgWishlistData) {
            return JSON.parse(rgWishlistData);
        }
    }
    return null;
}

function getJsonFromStr(str) {
    if (!str) {
        return {};
    }
    let s = str.indexOf("{");
    let e = str.lastIndexOf("}");
    if (s >= 0 && e > s) {
        return JSON.parse(str.substring(s, e + 1));
    }
}
