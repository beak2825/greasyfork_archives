// ==UserScript==
// @name         Travian NPC Master
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.6
// @description  Buildt in NPC calulator for travian.
// @author       bbbkada@gmail.com
// @include      https://*.travian.*/build.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=travian.com
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/448318/Travian%20NPC%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/448318/Travian%20NPC%20Master.meta.js
// ==/UserScript==

/* global $ */
/* global exchangeResources */

var lumber;
var clay;
var iron;
var crop;
var ListID = 0;

var BTable;
var BTableBody;
var tdSelect;
var tdRest;
var restNum;
var tdInput;
var remain = 0;
// You will see the addon when entering "Exhange resources", you can add som buildings and distr. the rest as "Clubs" -ratio
// or specify Residence lvl 13 + 100 Teutonic and the rest as axes...
//
// Prices can vary between versions and can be modified below.
// You can also add own favorite buiildings and trooptypes.
// building have to include prices for every level, troops is always level 0 and only one price...

var npcData = [
     { "name": "------- Troops --------", "data": [{lvl:0,a:0,b:0,c:0,d:0}]}
    ,{ "name": "Gauls - Phalanx", "data": [{lvl:0,a:100,b:130,c:55,d:30}]}
    ,{ "name": "Gauls - Swordsman", "data": [{lvl:0,a:140,b:150,c:185,d:60}]}
    ,{ "name": "Gauls - Pathfinder", "data": [{lvl:0,a:170,b:150,c:20,d:40}]}
    ,{ "name": "Gauls - Druid", "data": [{lvl:0,a:360,b:330,c:280,d:120}]}
    ,{ "name": "Gauls - Thunder", "data": [{lvl:0,a:350,b:450,c:230,d:60}]}
    ,{ "name": "Gauls - Heudan", "data": [{lvl:0,a:500,b:620,c:675,d:170}]}
    ,{ "name": "Gauls - Ram", "data": [{lvl:0,a:950,b:555,c:330,d:75}]}
    ,{ "name": "Gauls - Trebuchet", "data": [{lvl:0,a:960,b:1450,c:630,d:90}]}
    ,{ "name": "Gauls - Settler", "data": [{lvl:0,a:4400,b:5600,c:4200,d:3900}]}
    ,{ "name": "Gauls - Chieftan", "data": [{lvl:0,a:30750,b:45400,c:31000,d:37500}]}
    ,{ "name": "------- Party --------", "data": [{lvl:0,a:0,b:0,c:0,d:0}]}
    ,{ "name": "Small party", "data": [{lvl:0,a:6400,b:6650,c:5940,d:1340}]}
    ,{ "name": "Big party", "data": [{lvl:0,a:29700,b:33250,c:32000,d:6700}]}
    ,{ "name": "------- Resource fields --------", "data": [{lvl:0,a:0,b:0,c:0,d:0}]}
    ,{ "name": "Wood","data":[{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:40,b:100,c:50,d:60},{lvl:2,a:65,b:165,c:85,d:100},{lvl:3,a:110,b:280,c:140,d:165},{lvl:4,a:185,b:465,c:235,d:280},{lvl:5,a:310,b:780,c:390,d:465},{lvl:6,a:520,b:1300,c:650,d:780},{lvl:7,a:870,b:2170,c:1085,d:1300},{lvl:8,a:1450,b:3625,c:1810,d:2175},{lvl:9,a:2420,b:6050,c:3025,d:3630},{lvl:10,a:4040,b:10105,c:5050,d:6060},{lvl:11,a:6750,b:16870,c:8435,d:10125},{lvl:12,a:11270,b:28175,c:14090,d:16905},{lvl:13,a:18820,b:47055,c:23525,d:28230},{lvl:14,a:31430,b:78580,c:39290,d:47150},{lvl:15,a:52490,b:131230,c:65615,d:78740},{lvl:16,a:87660,b:219155,c:109575,d:131490},{lvl:17,a:146395,b:365985,c:182995,d:219590},{lvl:18,a:244480,b:611195,c:305600,d:366715},{lvl:19,a:408280,b:1020695,c:510350,d:612420},{lvl:20,a:681825,b:1704565,c:852280,d:1022740}]}
    ,{ "name": "Clay pit","data":[{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:80,b:40,c:80,d:50},{lvl:2,a:135,b:65,c:135,d:85},{lvl:3,a:225,b:110,c:225,d:140},{lvl:4,a:375,b:185,c:375,d:235},{lvl:5,a:620,b:310,c:620,d:390},{lvl:6,a:1040,b:520,c:1040,d:650},{lvl:7,a:1735,b:870,c:1735,d:1085},{lvl:8,a:2900,b:1450,c:2900,d:1810},{lvl:9,a:4840,b:2420,c:4840,d:3025},{lvl:10,a:8080,b:4040,c:8080,d:5050},{lvl:11,a:13500,b:6750,c:13500,d:8435},{lvl:12,a:22540,b:11270,c:22540,d:14090},{lvl:13,a:37645,b:18820,c:37645,d:23525},{lvl:14,a:62865,b:31430,c:62865,d:39290},{lvl:15,a:104985,b:52490,c:104985,d:65615},{lvl:16,a:175320,b:87660,c:175320,d:109575},{lvl:17,a:292790,b:146395,c:292790,d:182995},{lvl:18,a:488955,b:244480,c:488955,d:305600},{lvl:19,a:816555,b:408280,c:816555,d:510350},{lvl:20,a:1363650,b:681825,c:1363650,d:852280}]}
    ,{ "name": "Iron mine","data":[{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:100,b:80,c:30,d:60},{lvl:2,a:165,b:135,c:50,d:100},{lvl:3,a:280,b:225,c:85,d:165},{lvl:4,a:465,b:375,c:140,d:280},{lvl:5,a:780,b:620,c:235,d:465},{lvl:6,a:1300,b:1040,c:390,d:780},{lvl:7,a:2170,b:1735,c:650,d:1300},{lvl:8,a:3625,b:2900,c:1085,d:2175},{lvl:9,a:6050,b:4840,c:1815,d:3630},{lvl:10,a:10105,b:8080,c:3030,d:6060},{lvl:11,a:16870,b:13500,c:5060,d:10125},{lvl:12,a:28175,b:22540,c:8455,d:16905},{lvl:13,a:47055,b:37645,c:14115,d:28230},{lvl:14,a:78580,b:62865,c:23575,d:47150},{lvl:15,a:131230,b:104985,c:39370,d:78740},{lvl:16,a:219155,b:175320,c:65745,d:131490},{lvl:17,a:365985,b:292790,c:109795,d:219590},{lvl:18,a:611195,b:488955,c:183360,d:366715},{lvl:19,a:1020695,b:816555,c:306210,d:612420},{lvl:20,a:1704565,b:1363650,c:511370,d:1022740}]}
    ,{ "name": "Cropland", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:70,b:90,c:70,d:20},{lvl:2,a:115,b:150,c:115,d:35},{lvl:3,a:195,b:250,c:195,d:55},{lvl:4,a:325,b:420,c:325,d:95},{lvl:5,a:545,b:700,c:545,d:155},{lvl:6,a:910,b:1170,c:910,d:260},{lvl:7,a:1520,b:1950,c:1520,d:435},{lvl:8,a:2535,b:3260,c:2535,d:725},{lvl:9,a:4235,b:5445,c:4235,d:1210},{lvl:10,a:7070,b:9095,c:7070,d:2020},{lvl:11,a:11810,b:15185,c:11810,d:3375},{lvl:12,a:19725,b:25360,c:19725,d:5635},{lvl:13,a:32940,b:42350,c:32940,d:9410},{lvl:14,a:55005,b:70720,c:55005,d:15715},{lvl:15,a:91860,b:118105,c:91860,d:26245},{lvl:16,a:153405,b:197240,c:153405,d:43830},{lvl:17,a:256190,b:329385,c:256190,d:73195},{lvl:18,a:427835,b:550075,c:427835,d:122240},{lvl:19,a:714485,b:918625,c:714485,d:204140},{lvl:20,a:1193195,b:1534105,c:1193195,d:340915},{lvl:21,a:1992635,b:2561960,c:1992635,d:569325}]}
    ,{ "name": "------- Buildings --------", "data": [{lvl:0,a:0,b:0,c:0,d:0}]}
    ,{ "name": "Academy", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:220,b:160,c:90,d:40},{lvl:2,a:280,b:205,c:115,d:50},{lvl:3,a:360,b:260,c:145,d:65},{lvl:4,a:460,b:335,c:190,d:85},{lvl:5,a:590,b:430,c:240,d:105},{lvl:6,a:755,b:550,c:310,d:135},{lvl:7,a:970,b:705,c:395,d:175},{lvl:8,a:1240,b:900,c:505,d:225},{lvl:9,a:1585,b:1155,c:650,d:290},{lvl:10,a:2030,b:1475,c:830,d:370},{lvl:11,a:2595,b:1890,c:1065,d:470},{lvl:12,a:3325,b:2420,c:1360,d:605},{lvl:13,a:4255,b:3095,c:1740,d:775},{lvl:14,a:5445,b:3960,c:2230,d:990},{lvl:15,a:6970,b:5070,c:2850,d:1270},{lvl:16,a:8925,b:6490,c:3650,d:1625},{lvl:17,a:11425,b:8310,c:4675,d:2075},{lvl:18,a:14620,b:10635,c:5980,d:2660},{lvl:19,a:18715,b:13610,c:7655,d:3405},{lvl:20,a:23955,b:17420,c:9800,d:4355}]}
    ,{ "name": "Bakery", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:1200,b:1480,c:870,d:1600},{lvl:2,a:2160,b:2665,c:1565,d:2880},{lvl:3,a:3890,b:4795,c:2820,d:5185},{lvl:4,a:7000,b:8630,c:5075,d:9330},{lvl:5,a:12595,b:15535,c:9135,d:16795},{lvl:6,a:0,b:0,c:0,d:0},{lvl:7,a:0,b:0,c:0,d:0},{lvl:8,a:0,b:0,c:0,d:0},{lvl:9,a:0,b:0,c:0,d:0},{lvl:10,a:0,b:0,c:0,d:0},{lvl:11,a:0,b:0,c:0,d:0},{lvl:12,a:0,b:0,c:0,d:0},{lvl:13,a:0,b:0,c:0,d:0},{lvl:14,a:0,b:0,c:0,d:0},{lvl:15,a:0,b:0,c:0,d:0},{lvl:16,a:0,b:0,c:0,d:0},{lvl:17,a:0,b:0,c:0,d:0},{lvl:18,a:0,b:0,c:0,d:0},{lvl:19,a:0,b:0,c:0,d:0},{lvl:20,a:0,b:0,c:0,d:0}]}
    ,{ "name": "Barracks", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:210,b:140,c:260,d:120},{lvl:2,a:270,b:180,c:335,d:155},{lvl:3,a:345,b:230,c:425,d:195},{lvl:4,a:440,b:295,c:545,d:250},{lvl:5,a:565,b:375,c:700,d:320},{lvl:6,a:720,b:480,c:895,d:410},{lvl:7,a:925,b:615,c:1145,d:530},{lvl:8,a:1180,b:790,c:1465,d:675},{lvl:9,a:1515,b:1010,c:1875,d:865},{lvl:10,a:1935,b:1290,c:2400,d:1105},{lvl:11,a:2480,b:1655,c:3070,d:1415},{lvl:12,a:3175,b:2115,c:3930,d:1815},{lvl:13,a:4060,b:2710,c:5030,d:2320},{lvl:14,a:5200,b:3465,c:6435,d:2970},{lvl:15,a:6655,b:4435,c:8240,d:3805},{lvl:16,a:8520,b:5680,c:10545,d:4870},{lvl:17,a:10905,b:7270,c:13500,d:6230},{lvl:18,a:13955,b:9305,c:17280,d:7975},{lvl:19,a:17865,b:11910,c:22120,d:10210},{lvl:20,a:22865,b:15245,c:28310,d:13065}]}
    ,{ "name": "Brick yard", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:440,b:480,c:320,d:50},{lvl:2,a:790,b:865,c:575,d:90},{lvl:3,a:1425,b:1555,c:1035,d:160},{lvl:4,a:2565,b:2800,c:1865,d:290},{lvl:5,a:4620,b:5040,c:3360,d:525},{lvl:6,a:0,b:0,c:0,d:0},{lvl:7,a:0,b:0,c:0,d:0},{lvl:8,a:0,b:0,c:0,d:0},{lvl:9,a:0,b:0,c:0,d:0},{lvl:10,a:0,b:0,c:0,d:0},{lvl:11,a:0,b:0,c:0,d:0},{lvl:12,a:0,b:0,c:0,d:0},{lvl:13,a:0,b:0,c:0,d:0},{lvl:14,a:0,b:0,c:0,d:0},{lvl:15,a:0,b:0,c:0,d:0},{lvl:16,a:0,b:0,c:0,d:0},{lvl:17,a:0,b:0,c:0,d:0},{lvl:18,a:0,b:0,c:0,d:0},{lvl:19,a:0,b:0,c:0,d:0},{lvl:20,a:0,b:0,c:0,d:0}]}
    ,{ "name": "Granary", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:80,b:100,c:70,d:20},{lvl:2,a:100,b:130,c:90,d:25},{lvl:3,a:130,b:165,c:115,d:35},{lvl:4,a:170,b:210,c:145,d:40},{lvl:5,a:215,b:270,c:190,d:55},{lvl:6,a:275,b:345,c:240,d:70},{lvl:7,a:350,b:440,c:310,d:90},{lvl:8,a:450,b:565,c:395,d:115},{lvl:9,a:575,b:720,c:505,d:145},{lvl:10,a:740,b:920,c:645,d:185},{lvl:11,a:945,b:1180,c:825,d:235},{lvl:12,a:1210,b:1510,c:1060,d:300},{lvl:13,a:1545,b:1935,c:1355,d:385},{lvl:14,a:1980,b:2475,c:1735,d:495},{lvl:15,a:2535,b:3170,c:2220,d:635},{lvl:16,a:3245,b:4055,c:2840,d:810},{lvl:17,a:4155,b:5190,c:3635,d:1040},{lvl:18,a:5315,b:6645,c:4650,d:1330},{lvl:19,a:6805,b:8505,c:5955,d:1700},{lvl:20,a:8710,b:10890,c:7620,d:2180}]}
    ,{ "name": "Grain Mill", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:500,b:440,c:380,d:1240},{lvl:2,a:900,b:790,c:685,d:2230},{lvl:3,a:1620,b:1425,c:1230,d:4020},{lvl:4,a:2915,b:2565,c:2215,d:7230},{lvl:5,a:5250,b:4620,c:3990,d:13015},{lvl:6,a:0,b:0,c:0,d:0},{lvl:7,a:0,b:0,c:0,d:0},{lvl:8,a:0,b:0,c:0,d:0},{lvl:9,a:0,b:0,c:0,d:0},{lvl:10,a:0,b:0,c:0,d:0},{lvl:11,a:0,b:0,c:0,d:0},{lvl:12,a:0,b:0,c:0,d:0},{lvl:13,a:0,b:0,c:0,d:0},{lvl:14,a:0,b:0,c:0,d:0},{lvl:15,a:0,b:0,c:0,d:0},{lvl:16,a:0,b:0,c:0,d:0},{lvl:17,a:0,b:0,c:0,d:0},{lvl:18,a:0,b:0,c:0,d:0},{lvl:19,a:0,b:0,c:0,d:0},{lvl:20,a:0,b:0,c:0,d:0}]}
    ,{ "name": "Hero's mansion ", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:700,b:670,c:700,d:240},{lvl:2,a:930,b:890,c:930,d:320},{lvl:3,a:1240,b:1185,c:1240,d:425},{lvl:4,a:1645,b:1575,c:1645,d:565},{lvl:5,a:2190,b:2095,c:2190,d:750},{lvl:6,a:2915,b:2790,c:2915,d:1000},{lvl:7,a:3875,b:3710,c:3875,d:1330},{lvl:8,a:5155,b:4930,c:5155,d:1765},{lvl:9,a:6855,b:6560,c:6855,d:2350},{lvl:10,a:9115,b:8725,c:9115,d:3125},{lvl:11,a:12125,b:11605,c:12125,d:4155},{lvl:12,a:16125,b:15435,c:16125,d:5530},{lvl:13,a:21445,b:20525,c:21445,d:7350},{lvl:14,a:28520,b:27300,c:28520,d:9780},{lvl:15,a:37935,b:36310,c:37935,d:13005},{lvl:16,a:50450,b:48290,c:50450,d:17300},{lvl:17,a:67100,b:64225,c:67100,d:23005},{lvl:18,a:89245,b:85420,c:89245,d:30600},{lvl:19,a:118695,b:113605,c:118695,d:40695},{lvl:20,a:157865,b:151095,c:157865,d:54125}]}
    ,{ "name": "Hospital", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:320,b:280,c:420,d:360},{lvl:2,a:410,b:360,c:540,d:460},{lvl:3,a:525,b:460,c:690,d:590},{lvl:4,a:670,b:585,c:880,d:755},{lvl:5,a:860,b:750,c:1125,d:965},{lvl:6,a:1100,b:960,c:1445,d:1235},{lvl:7,a:1405,b:1230,c:1845,d:1585},{lvl:8,a:1800,b:1575,c:2365,d:2025},{lvl:9,a:2305,b:2020,c:3025,d:2595},{lvl:10,a:2950,b:2585,c:3875,d:3320},{lvl:11,a:3780,b:3305,c:4960,d:4250},{lvl:12,a:4835,b:4230,c:6345,d:5440},{lvl:13,a:6190,b:5415,c:8125,d:6965},{lvl:14,a:7925,b:6930,c:10400,d:8915},{lvl:15,a:10140,b:8875,c:13310,d:11410},{lvl:16,a:12980,b:11360,c:17035,d:14605},{lvl:17,a:16615,b:14540,c:21810,d:18690},{lvl:18,a:21270,b:18610,c:27915,d:23925},{lvl:19,a:27225,b:23820,c:35730,d:30625},{lvl:20,a:34845,b:30490,c:45735,d:39200}]}
    ,{ "name": "Iron foundry", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:200,b:450,c:510,d:120},{lvl:2,a:360,b:810,c:920,d:215},{lvl:3,a:650,b:1460,c:1650,d:390},{lvl:4,a:1165,b:2625,c:2975,d:700},{lvl:5,a:2100,b:4725,c:5355,d:1260},{lvl:6,a:0,b:0,c:0,d:0},{lvl:7,a:0,b:0,c:0,d:0},{lvl:8,a:0,b:0,c:0,d:0},{lvl:9,a:0,b:0,c:0,d:0},{lvl:10,a:0,b:0,c:0,d:0},{lvl:11,a:0,b:0,c:0,d:0},{lvl:12,a:0,b:0,c:0,d:0},{lvl:13,a:0,b:0,c:0,d:0},{lvl:14,a:0,b:0,c:0,d:0},{lvl:15,a:0,b:0,c:0,d:0},{lvl:16,a:0,b:0,c:0,d:0},{lvl:17,a:0,b:0,c:0,d:0},{lvl:18,a:0,b:0,c:0,d:0},{lvl:19,a:0,b:0,c:0,d:0},{lvl:20,a:0,b:0,c:0,d:0}]}
    ,{ "name": "Mainbuilding", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:70,b:40,c:60,d:20},{lvl:2,a:90,b:50,c:75,d:25},{lvl:3,a:115,b:65,c:100,d:35},{lvl:4,a:145,b:85,c:125,d:40},{lvl:5,a:190,b:105,c:160,d:55},{lvl:6,a:240,b:135,c:205,d:70},{lvl:7,a:310,b:175,c:265,d:90},{lvl:8,a:395,b:225,c:340,d:115},{lvl:9,a:505,b:290,c:430,d:145},{lvl:10,a:645,b:370,c:555,d:185},{lvl:11,a:825,b:470,c:710,d:235},{lvl:12,a:1060,b:605,c:905,d:300},{lvl:13,a:1355,b:775,c:1160,d:385},{lvl:14,a:1735,b:990,c:1485,d:495},{lvl:15,a:2220,b:1270,c:1900,d:635},{lvl:16,a:2840,b:1625,c:2435,d:810},{lvl:17,a:3635,b:2075,c:3115,d:1040},{lvl:18,a:4650,b:2660,c:3990,d:1330},{lvl:19,a:5955,b:3405,c:5105,d:1700},{lvl:20,a:7620,b:4355,c:6535,d:2180}]}
    ,{ "name": "Market place", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:80,b:70,c:120,d:70},{lvl:2,a:100,b:90,c:155,d:90},{lvl:3,a:130,b:115,c:195,d:115},{lvl:4,a:170,b:145,c:250,d:145},{lvl:5,a:215,b:190,c:320,d:190},{lvl:6,a:275,b:240,c:410,d:240},{lvl:7,a:350,b:310,c:530,d:310},{lvl:8,a:450,b:395,c:675,d:395},{lvl:9,a:575,b:505,c:865,d:505},{lvl:10,a:740,b:645,c:1105,d:645},{lvl:11,a:945,b:825,c:1415,d:825},{lvl:12,a:1210,b:1060,c:1815,d:1060},{lvl:13,a:1545,b:1355,c:2320,d:1355},{lvl:14,a:1980,b:1735,c:2970,d:1735},{lvl:15,a:2535,b:2220,c:3805,d:2220},{lvl:16,a:3245,b:2840,c:4870,d:2840},{lvl:17,a:4155,b:3635,c:6230,d:3635},{lvl:18,a:5315,b:4650,c:7975,d:4650},{lvl:19,a:6805,b:5955,c:10210,d:5955},{lvl:20,a:8710,b:7620,c:13065,d:7620}]}
    ,{ "name": "Palace", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:550,b:800,c:750,d:250},{lvl:2,a:705,b:1025,c:960,d:320},{lvl:3,a:900,b:1310,c:1230,d:410},{lvl:4,a:1155,b:1680,c:1575,d:525},{lvl:5,a:1475,b:2145,c:2015,d:670},{lvl:6,a:1890,b:2750,c:2575,d:860},{lvl:7,a:2420,b:3520,c:3300,d:1100},{lvl:8,a:3095,b:4505,c:4220,d:1405},{lvl:9,a:3965,b:5765,c:5405,d:1800},{lvl:10,a:5075,b:7380,c:6920,d:2305},{lvl:11,a:6495,b:9445,c:8855,d:2950},{lvl:12,a:8310,b:12090,c:11335,d:3780},{lvl:13,a:10640,b:15475,c:14505,d:4835},{lvl:14,a:13615,b:19805,c:18570,d:6190},{lvl:15,a:17430,b:25355,c:23770,d:7925},{lvl:16,a:22310,b:32450,c:30425,d:10140},{lvl:17,a:28560,b:41540,c:38940,d:12980},{lvl:18,a:36555,b:53170,c:49845,d:16615},{lvl:19,a:46790,b:68055,c:63805,d:21270},{lvl:20,a:59890,b:87110,c:81670,d:27225}]}
    ,{ "name": "Rally point", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:110,b:160,c:90,d:70},{lvl:2,a:140,b:205,c:115,d:90},{lvl:3,a:180,b:260,c:145,d:115},{lvl:4,a:230,b:335,c:190,d:145},{lvl:5,a:295,b:430,c:240,d:190},{lvl:6,a:380,b:550,c:310,d:240},{lvl:7,a:485,b:705,c:395,d:310},{lvl:8,a:620,b:900,c:505,d:395},{lvl:9,a:795,b:1155,c:650,d:505},{lvl:10,a:1015,b:1475,c:830,d:645},{lvl:11,a:1300,b:1890,c:1065,d:825},{lvl:12,a:1660,b:2420,c:1360,d:1060},{lvl:13,a:2130,b:3095,c:1740,d:1355},{lvl:14,a:2725,b:3960,c:2230,d:1735},{lvl:15,a:3485,b:5070,c:2850,d:2220},{lvl:16,a:4460,b:6490,c:3650,d:2840},{lvl:17,a:5710,b:8310,c:4675,d:3635},{lvl:18,a:7310,b:10635,c:5980,d:4650},{lvl:19,a:9360,b:13610,c:7655,d:5955},{lvl:20,a:11980,b:17420,c:9800,d:7620}]}
    ,{ "name": "Residence", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:580,b:460,c:350,d:180},{lvl:2,a:740,b:590,c:450,d:230},{lvl:3,a:950,b:755,c:575,d:295},{lvl:4,a:1215,b:965,c:735,d:375},{lvl:5,a:1555,b:1235,c:940,d:485},{lvl:6,a:1995,b:1580,c:1205,d:620},{lvl:7,a:2550,b:2025,c:1540,d:790},{lvl:8,a:3265,b:2590,c:1970,d:1015},{lvl:9,a:4180,b:3315,c:2520,d:1295},{lvl:10,a:5350,b:4245,c:3230,d:1660},{lvl:11,a:6845,b:5430,c:4130,d:2125},{lvl:12,a:8765,b:6950,c:5290,d:2720},{lvl:13,a:11220,b:8900,c:6770,d:3480},{lvl:14,a:14360,b:11390,c:8665,d:4455},{lvl:15,a:18380,b:14580,c:11090,d:5705},{lvl:16,a:23530,b:18660,c:14200,d:7300},{lvl:17,a:30115,b:23885,c:18175,d:9345},{lvl:18,a:38550,b:30570,c:23260,d:11965},{lvl:19,a:49340,b:39130,c:29775,d:15315},{lvl:20,a:63155,b:50090,c:38110,d:19600}]}
    ,{ "name": "Saw Mill", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:520,b:380,c:290,d:90},{lvl:2,a:935,b:685,c:520,d:160},{lvl:3,a:1685,b:1230,c:940,d:290},{lvl:4,a:3035,b:2215,c:1690,d:525},{lvl:5,a:5460,b:3990,c:3045,d:945},{lvl:6,a:0,b:0,c:0,d:0},{lvl:7,a:0,b:0,c:0,d:0},{lvl:8,a:0,b:0,c:0,d:0},{lvl:9,a:0,b:0,c:0,d:0},{lvl:10,a:0,b:0,c:0,d:0},{lvl:11,a:0,b:0,c:0,d:0},{lvl:12,a:0,b:0,c:0,d:0},{lvl:13,a:0,b:0,c:0,d:0},{lvl:14,a:0,b:0,c:0,d:0},{lvl:15,a:0,b:0,c:0,d:0},{lvl:16,a:0,b:0,c:0,d:0},{lvl:17,a:0,b:0,c:0,d:0},{lvl:18,a:0,b:0,c:0,d:0},{lvl:19,a:0,b:0,c:0,d:0},{lvl:20,a:0,b:0,c:0,d:0}]}
    ,{ "name": "Smithy", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:180,b:250,c:500,d:160},{lvl:2,a:230,b:320,c:640,d:205},{lvl:3,a:295,b:410,c:820,d:260},{lvl:4,a:375,b:525,c:1050,d:335},{lvl:5,a:485,b:670,c:1340,d:430},{lvl:6,a:620,b:860,c:1720,d:550},{lvl:7,a:790,b:1100,c:2200,d:705},{lvl:8,a:1015,b:1405,c:2815,d:900},{lvl:9,a:1295,b:1800,c:3605,d:1155},{lvl:10,a:1660,b:2305,c:4610,d:1475},{lvl:11,a:2125,b:2950,c:5905,d:1890},{lvl:12,a:2720,b:3780,c:7555,d:2420},{lvl:13,a:3480,b:4835,c:9670,d:3095},{lvl:14,a:4455,b:6190,c:12380,d:3960},{lvl:15,a:5705,b:7925,c:15845,d:5070},{lvl:16,a:7300,b:10140,c:20280,d:6490},{lvl:17,a:9345,b:12980,c:25960,d:8310},{lvl:18,a:11965,b:16615,c:33230,d:10635},{lvl:19,a:15315,b:21270,c:42535,d:13610},{lvl:20,a:19600,b:27225,c:54445,d:17420}]}
    ,{ "name": "Stable", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:260,b:140,c:220,d:100},{lvl:2,a:335,b:180,c:280,d:130},{lvl:3,a:425,b:230,c:360,d:165},{lvl:4,a:545,b:295,c:460,d:210},{lvl:5,a:700,b:375,c:590,d:270},{lvl:6,a:895,b:480,c:755,d:345},{lvl:7,a:1145,b:615,c:970,d:440},{lvl:8,a:1465,b:790,c:1240,d:565},{lvl:9,a:1875,b:1010,c:1585,d:720},{lvl:10,a:2400,b:1290,c:2030,d:920},{lvl:11,a:3070,b:1655,c:2595,d:1180},{lvl:12,a:3930,b:2115,c:3325,d:1510},{lvl:13,a:5030,b:2710,c:4255,d:1935},{lvl:14,a:6435,b:3465,c:5445,d:2475},{lvl:15,a:8240,b:4435,c:6970,d:3170},{lvl:16,a:10545,b:5680,c:8925,d:4055},{lvl:17,a:13500,b:7270,c:11425,d:5190},{lvl:18,a:17280,b:9305,c:14620,d:6645},{lvl:19,a:22120,b:11910,c:18715,d:8505},{lvl:20,a:28310,b:15245,c:23955,d:10890}]}
    ,{ "name": "Stonemason's Lodge","data":[{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:155,b:130,c:125,d:70},{lvl:2,a:200,b:165,c:160,d:90},{lvl:3,a:255,b:215,c:205,d:115},{lvl:4,a:325,b:275,c:260,d:145},{lvl:5,a:415,b:350,c:335,d:190},{lvl:6,a:535,b:445,c:430,d:240},{lvl:7,a:680,b:570,c:550,d:310},{lvl:8,a:875,b:730,c:705,d:395},{lvl:9,a:1115,b:935,c:900,d:505},{lvl:10,a:1430,b:1200,c:1155,d:645},{lvl:11,a:1830,b:1535,c:1475,d:825},{lvl:12,a:2340,b:1965,c:1890,d:1060},{lvl:13,a:3000,b:2515,c:2420,d:1355},{lvl:14,a:3840,b:3220,c:3095,d:1735},{lvl:15,a:4910,b:4120,c:3960,d:2220},{lvl:16,a:6290,b:5275,c:5070,d:2840},{lvl:17,a:8050,b:6750,c:6490,d:3635},{lvl:18,a:10300,b:8640,c:8310,d:4650},{lvl:19,a:13185,b:11060,c:10635,d:5955},{lvl:20,a:16880,b:14155,c:13610,d:7620}]}
    ,{ "name": "Town hall", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:1250,b:1110,c:1260,d:600},{lvl:2,a:1600,b:1420,c:1615,d:770},{lvl:3,a:2050,b:1820,c:2065,d:985},{lvl:4,a:2620,b:2330,c:2640,d:1260},{lvl:5,a:3355,b:2980,c:3380,d:1610},{lvl:6,a:4295,b:3815,c:4330,d:2060},{lvl:7,a:5500,b:4880,c:5540,d:2640},{lvl:8,a:7035,b:6250,c:7095,d:3380},{lvl:9,a:9005,b:8000,c:9080,d:4325},{lvl:10,a:11530,b:10240,c:11620,d:5535},{lvl:11,a:14755,b:13105,c:14875,d:7085},{lvl:12,a:18890,b:16775,c:19040,d:9065},{lvl:13,a:24180,b:21470,c:24370,d:11605},{lvl:14,a:30950,b:27480,c:31195,d:14855},{lvl:15,a:39615,b:35175,c:39930,d:19015},{lvl:16,a:50705,b:45025,c:51110,d:24340},{lvl:17,a:64905,b:57635,c:65425,d:31155},{lvl:18,a:83075,b:73770,c:83740,d:39875},{lvl:19,a:106340,b:94430,c:107190,d:51040},{lvl:20,a:136115,b:120870,c:137200,d:65335}]}
    ,{ "name": "Tournament square", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:1750,b:2250,c:1530,d:240},{lvl:2,a:2240,b:2880,c:1960,d:305},{lvl:3,a:2865,b:3685,c:2505,d:395},{lvl:4,a:3670,b:4720,c:3210,d:505},{lvl:5,a:4700,b:6040,c:4105,d:645},{lvl:6,a:6015,b:7730,c:5255,d:825},{lvl:7,a:7695,b:9895,c:6730,d:1055},{lvl:8,a:9850,b:12665,c:8615,d:1350},{lvl:9,a:12610,b:16215,c:11025,d:1730},{lvl:10,a:16140,b:20755,c:14110,d:2215},{lvl:11,a:20660,b:26565,c:18065,d:2835},{lvl:12,a:26445,b:34000,c:23120,d:3625},{lvl:13,a:33850,b:43520,c:29595,d:4640},{lvl:14,a:43330,b:55705,c:37880,d:5940},{lvl:15,a:55460,b:71305,c:48490,d:7605},{lvl:16,a:70990,b:91270,c:62065,d:9735},{lvl:17,a:90865,b:116825,c:79440,d:12460},{lvl:18,a:116305,b:149540,c:101685,d:15950},{lvl:19,a:148875,b:191410,c:130160,d:20415},{lvl:20,a:190560,b:245005,c:166600,d:26135}]}
    ,{ "name": "Treasury", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:2880,b:2740,c:2580,d:990},{lvl:2,a:3630,b:3450,c:3250,d:1245},{lvl:3,a:4570,b:4350,c:4095,d:1570},{lvl:4,a:5760,b:5480,c:5160,d:1980},{lvl:5,a:7260,b:6905,c:6505,d:2495},{lvl:6,a:9145,b:8700,c:8195,d:3145},{lvl:7,a:11525,b:10965,c:10325,d:3960},{lvl:8,a:14520,b:13815,c:13010,d:4990},{lvl:9,a:18295,b:17405,c:16390,d:6290},{lvl:10,a:23055,b:21930,c:20650,d:7925},{lvl:11,a:29045,b:27635,c:26020,d:9985},{lvl:12,a:36600,b:34820,c:32785,d:12580},{lvl:13,a:46115,b:43875,c:41310,d:15850},{lvl:14,a:58105,b:55280,c:52050,d:19975},{lvl:15,a:73210,b:69655,c:65585,d:25165},{lvl:16,a:92245,b:87760,c:82640,d:31710},{lvl:17,a:116230,b:110580,c:104125,d:39955},{lvl:18,a:146450,b:139330,c:131195,d:50340},{lvl:19,a:184530,b:175560,c:165305,d:63430},{lvl:20,a:232505,b:221205,c:208285,d:79925}]}
    ,{ "name": "Warehouse", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:130,b:160,c:90,d:40},{lvl:2,a:165,b:205,c:115,d:50},{lvl:3,a:215,b:260,c:145,d:65},{lvl:4,a:275,b:335,c:190,d:85},{lvl:5,a:350,b:430,c:240,d:105},{lvl:6,a:445,b:550,c:310,d:135},{lvl:7,a:570,b:705,c:395,d:175},{lvl:8,a:730,b:900,c:505,d:225},{lvl:9,a:935,b:1155,c:650,d:290},{lvl:10,a:1200,b:1475,c:830,d:370},{lvl:11,a:1535,b:1890,c:1065,d:470},{lvl:12,a:1965,b:2420,c:1360,d:605},{lvl:13,a:2515,b:3095,c:1740,d:775},{lvl:14,a:3220,b:3960,c:2230,d:990},{lvl:15,a:4120,b:5070,c:2850,d:1270},{lvl:16,a:5275,b:6490,c:3650,d:1625},{lvl:17,a:6750,b:8310,c:4675,d:2075},{lvl:18,a:8640,b:10635,c:5980,d:2660},{lvl:19,a:11060,b:13610,c:7655,d:3405},{lvl:20,a:14155,b:17420,c:9800,d:4355}]}
    ,{ "name": "Workshop", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:460,b:510,c:600,d:320},{lvl:2,a:590,b:655,c:770,d:410},{lvl:3,a:755,b:835,c:985,d:525},{lvl:4,a:965,b:1070,c:1260,d:670},{lvl:5,a:1235,b:1370,c:1610,d:860},{lvl:6,a:1580,b:1750,c:2060,d:1100},{lvl:7,a:2025,b:2245,c:2640,d:1405},{lvl:8,a:2590,b:2870,c:3380,d:1800},{lvl:9,a:3315,b:3675,c:4325,d:2305},{lvl:10,a:4245,b:4705,c:5535,d:2950},{lvl:11,a:5430,b:6020,c:7085,d:3780},{lvl:12,a:6950,b:7705,c:9065,d:4835},{lvl:13,a:8900,b:9865,c:11605,d:6190},{lvl:14,a:11390,b:12625,c:14855,d:7925},{lvl:15,a:14580,b:16165,c:19015,d:10140},{lvl:16,a:18660,b:20690,c:24340,d:12980},{lvl:17,a:23885,b:26480,c:31155,d:16615},{lvl:18,a:30570,b:33895,c:39875,d:21270},{lvl:19,a:39130,b:43385,c:51040,d:27225},{lvl:20,a:50090,b:55535,c:65335,d:34845}]}
    ,{ "name": "-- Tribe specific Buildings --", "data": [{lvl:0,a:0,b:0,c:0,d:0}]}
    ,{ "name": "Hun Command center", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:1600,b:1250,c:1050,d:200},{lvl:2,a:1950,b:1525,c:1280,d:245},{lvl:3,a:2380,b:1860,c:1565,d:300},{lvl:4,a:2905,b:2270,c:1905,d:365},{lvl:5,a:3545,b:2770,c:2325,d:445},{lvl:6,a:4325,b:3380,c:2840,d:540},{lvl:7,a:5275,b:4120,c:3460,d:660},{lvl:8,a:6435,b:5030,c:4225,d:805},{lvl:9,a:7850,b:6135,c:5155,d:980},{lvl:10,a:9580,b:7485,c:6285,d:1195},{lvl:11,a:11685,b:9130,c:7670,d:1460},{lvl:12,a:14260,b:11140,c:9355,d:1780},{lvl:13,a:17395,b:13590,c:11415,d:2175},{lvl:14,a:21225,b:16580,c:13925,d:2655},{lvl:15,a:25890,b:20230,c:16990,d:3235},{lvl:16,a:31590,b:24680,c:20730,d:3950},{lvl:17,a:38535,b:30105,c:25290,d:4815},{lvl:18,a:47015,b:36730,c:30855,d:5875},{lvl:19,a:57360,b:44810,c:37640,d:7170},{lvl:20,a:69975,b:54670,c:45925,d:8745}]}
    ,{ "name": "Teuton Earth wall", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:675,b:1125,c:0,d:450}]}
    ,{ "name": "Gaul Pallisade wall","data":[{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:160,b:100,c:80,d:60},{lvl:2,a:205,b:130,c:100,d:75},{lvl:3,a:260,b:165,c:130,d:100},{lvl:4,a:335,b:210,c:170,d:125},{lvl:5,a:430,b:270,c:215,d:160},{lvl:6,a:550,b:345,c:275,d:205},{lvl:7,a:705,b:440,c:350,d:265},{lvl:8,a:900,b:565,c:450,d:340},{lvl:9,a:1155,b:720,c:575,d:430},{lvl:10,a:1475,b:920,c:740,d:555},{lvl:11,a:1890,b:1180,c:945,d:710},{lvl:12,a:2420,b:1510,c:1210,d:905},{lvl:13,a:3095,b:1935,c:1545,d:1160},{lvl:14,a:3960,b:2475,c:1980,d:1485},{lvl:15,a:5070,b:3170,c:2535,d:1900},{lvl:16,a:6490,b:4055,c:3245,d:2435},{lvl:17,a:8310,b:5190,c:4155,d:3115},{lvl:18,a:10635,b:6645,c:5315,d:3990},{lvl:19,a:13610,b:8505,c:6805,d:5105},{lvl:20,a:17420,b:10890,c:8710,d:6535}]}
    ,{ "name": "Egyptian Wall", "data": [{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:110,b:160,c:70,d:60},{lvl:2,a:140,b:205,c:90,d:75},{lvl:3,a:180,b:260,c:115,d:100},{lvl:4,a:230,b:335,c:145,d:125},{lvl:5,a:295,b:430,c:190,d:160},{lvl:6,a:380,b:550,c:240,d:205},{lvl:7,a:485,b:705,c:310,d:265},{lvl:8,a:620,b:900,c:395,d:340},{lvl:9,a:795,b:1155,c:505,d:430},{lvl:10,a:1015,b:1475,c:645,d:555},{lvl:11,a:1300,b:1890,c:825,d:710},{lvl:12,a:1660,b:2420,c:1060,d:905},{lvl:13,a:2130,b:3095,c:1355,d:1160},{lvl:14,a:2725,b:3960,c:1735,d:1485},{lvl:15,a:3485,b:5070,c:2220,d:1900},{lvl:16,a:4460,b:6490,c:2840,d:2435},{lvl:17,a:5710,b:8310,c:3635,d:3115},{lvl:18,a:7310,b:10635,c:4650,d:3990},{lvl:19,a:9360,b:13610,c:5955,d:5105},{lvl:20,a:11980,b:17420,c:7620,d:6535}]}
    ,{ "name": "------- Upgrades --------", "data": [{lvl:0,a:0,b:0,c:0,d:0}]}
    ,{ "name": "Gaul - Phalanx Smithy Upgrade","data":[{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:1395,b:1760,c:1020,d:645},{lvl:2,a:1395,b:1760,c:1020,d:645},{lvl:3,a:1925,b:2430,c:1410,d:890},{lvl:4,a:2425,b:3060,c:1775,d:1120},{lvl:5,a:2900,b:3660,c:2120,d:1340},{lvl:6,a:3355,b:4235,c:2455,d:1550},{lvl:7,a:3795,b:4790,c:2775,d:1755},{lvl:8,a:4220,b:5330,c:3090,d:1955},{lvl:9,a:4640,b:5860,c:3395,d:2145},{lvl:10,a:5050,b:6375,c:3690,d:2335},{lvl:11,a:5450,b:6880,c:3985,d:2520},{lvl:12,a:5840,b:7375,c:4270,d:2700},{lvl:13,a:6225,b:7860,c:4555,d:2880},{lvl:14,a:6605,b:8340,c:4830,d:3055},{lvl:15,a:6980,b:8815,c:5105,d:3230},{lvl:16,a:7350,b:9280,c:5375,d:3400},{lvl:17,a:7715,b:9745,c:5645,d:3570},{lvl:18,a:8080,b:10200,c:5905,d:3735},{lvl:19,a:8435,b:10650,c:6170,d:3900},{lvl:20,a:8790,b:11095,c:6425,d:4065}]}
    ,{ "name": "Gaul - Swordsman Smithy Upgrade","data":[{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:1080,b:1150,c:1495,d:580},{lvl:2,a:1880,b:2000,c:2605,d:1010},{lvl:3,a:2600,b:2770,c:3600,d:1395},{lvl:4,a:3275,b:3485,c:4530,d:1760},{lvl:5,a:3915,b:4165,c:5420,d:2100},{lvl:6,a:4530,b:4820,c:6270,d:2430},{lvl:7,a:5125,b:5455,c:7090,d:2750},{lvl:8,a:5700,b:6070,c:7890,d:3060},{lvl:9,a:6265,b:6670,c:8670,d:3365},{lvl:10,a:6815,b:7255,c:9435,d:3660},{lvl:11,a:7355,b:7830,c:10180,d:3950},{lvl:12,a:7885,b:8395,c:10915,d:4235},{lvl:13,a:8405,b:8950,c:11635,d:4515},{lvl:14,a:8920,b:9495,c:12345,d:4790},{lvl:15,a:9425,b:10035,c:13045,d:5060},{lvl:16,a:9925,b:10570,c:13740,d:5330},{lvl:17,a:10420,b:11095,c:14420,d:5595},{lvl:18,a:10905,b:11610,c:15095,d:5855},{lvl:19,a:11385,b:12125,c:15765,d:6115},{lvl:20,a:11865,b:12635,c:16425,d:6370}]}
    ,{ "name": "Gaul - Druid Smithy Upgrade","data":[{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:1310,b:1205,c:1080,d:500},{lvl:2,a:2280,b:2100,c:1880,d:870},{lvl:3,a:3155,b:2900,c:2600,d:1205},{lvl:4,a:3970,b:3655,c:3275,d:1515},{lvl:5,a:4745,b:4365,c:3915,d:1810},{lvl:6,a:5495,b:5055,c:4530,d:2095},{lvl:7,a:6215,b:5715,c:5125,d:2370},{lvl:8,a:6915,b:6360,c:5700,d:2640},{lvl:9,a:7595,b:6990,c:6265,d:2900},{lvl:10,a:8265,b:7605,c:6815,d:3155},{lvl:11,a:8920,b:8205,c:7355,d:3405},{lvl:12,a:9565,b:8795,c:7885,d:3650},{lvl:13,a:10195,b:9380,c:8405,d:3890},{lvl:14,a:10820,b:9950,c:8920,d:4130},{lvl:15,a:11435,b:10515,c:9425,d:4365},{lvl:16,a:12040,b:11075,c:9925,d:4595},{lvl:17,a:12635,b:11625,c:10420,d:4825},{lvl:18,a:13230,b:12170,c:10905,d:5050},{lvl:19,a:13815,b:12705,c:11385,d:5270},{lvl:20,a:14390,b:13240,c:11865,d:5495}]}
    ,{ "name": "Gaul - Thunder Smithy Upgrade","data":[{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:1275,b:1625,c:905,d:290},{lvl:2,a:2220,b:2830,c:1575,d:505},{lvl:3,a:3070,b:3915,c:2180,d:700},{lvl:4,a:3865,b:4925,c:2745,d:880},{lvl:5,a:4620,b:5890,c:3280,d:1050},{lvl:6,a:5345,b:6815,c:3795,d:1215},{lvl:7,a:6050,b:7710,c:4295,d:1375},{lvl:8,a:6730,b:8575,c:4775,d:1530},{lvl:9,a:7395,b:9425,c:5250,d:1680},{lvl:10,a:8045,b:10255,c:5710,d:1830},{lvl:11,a:8680,b:11065,c:6165,d:1975},{lvl:12,a:9310,b:11865,c:6605,d:2115},{lvl:13,a:9925,b:12650,c:7045,d:2255},{lvl:14,a:10530,b:13420,c:7475,d:2395},{lvl:15,a:11125,b:14180,c:7900,d:2530},{lvl:16,a:11715,b:14935,c:8315,d:2665},{lvl:17,a:12300,b:15675,c:8730,d:2795},{lvl:18,a:12875,b:16410,c:9140,d:2930},{lvl:19,a:13445,b:17135,c:9540,d:3060},{lvl:20,a:14005,b:17850,c:9940,d:3185}]}
    ,{ "name": "Gaul - Pathfinder Smithy Upgrade","data":[{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:645,b:757,c:170,d:220},{lvl:2,a:1125,b:1000,c:295,d:385},{lvl:3,a:1555,b:1385,c:410,d:530},{lvl:4,a:1955,b:1745,c:515,d:665},{lvl:5,a:2335,b:2085,c:615,d:795},{lvl:6,a:2705,b:2410,c:715,d:920},{lvl:7,a:3060,b:2725,c:805,d:1045},{lvl:8,a:3405,b:3035,c:895,d:1160},{lvl:9,a:3740,b:3335,c:985,d:1275},{lvl:10,a:4070,b:3630,c:1075,d:1390},{lvl:11,a:4390,b:3915,c:1160,d:1500},{lvl:12,a:4710,b:4200,c:1240,d:1605},{lvl:13,a:5020,b:4475,c:1325,d:1710},{lvl:14,a:5325,b:4750,c:1405,d:1815},{lvl:15,a:5630,b:5020,c:1485,d:1920},{lvl:16,a:5925,b:5285,c:1560,d:2020},{lvl:17,a:6220,b:5545,c:1640,d:2120},{lvl:18,a:6515,b:5805,c:1715,d:2220},{lvl:19,a:6800,b:6065,c:1790,d:2320},{lvl:20,a:7085,b:6315,c:1870,d:2415}]}
    ,{ "name": "Gaul - Heudan Smithy Upgrade","data":[{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:1200,b:1480,c:1640,d:450},{lvl:2,a:2090,b:2575,c:2860,d:785},{lvl:3,a:2890,b:3565,c:3955,d:1085},{lvl:4,a:3640,b:4485,c:4975,d:1365},{lvl:5,a:4350,b:5365,c:5950,d:1630},{lvl:6,a:5030,b:6205,c:6885,d:1885},{lvl:7,a:5690,b:7020,c:7785,d:2135},{lvl:8,a:6335,b:7810,c:8665,d:2375},{lvl:9,a:6960,b:8585,c:9520,d:2610},{lvl:10,a:7570,b:9340,c:10360,d:2840},{lvl:11,a:8170,b:10080,c:11180,d:3065},{lvl:12,a:8760,b:10805,c:11985,d:3285},{lvl:13,a:9340,b:11520,c:12775,d:3500},{lvl:14,a:9910,b:12225,c:13560,d:3715},{lvl:15,a:10475,b:12915,c:14325,d:3925},{lvl:16,a:11030,b:13600,c:15085,d:4135},{lvl:17,a:11575,b:14275,c:15835,d:4340},{lvl:18,a:12115,b:14945,c:16575,d:4545},{lvl:19,a:12655,b:15605,c:17310,d:4745},{lvl:20,a:13185,b:16260,c:18035,d:4945}]}
    ,{ "name": "Gaul - Ram Smithy Upgrade","data":[{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:2250,b:1330,c:835,d:230},{lvl:2,a:3915,b:2315,c:1455,d:400},{lvl:3,a:5420,b:3200,c:2015,d:550},{lvl:4,a:6820,b:4025,c:2535,d:690},{lvl:5,a:8155,b:4815,c:3030,d:825},{lvl:6,a:9435,b:5570,c:3510,d:955},{lvl:7,a:10670,b:6300,c:3970,d:1085},{lvl:8,a:11875,b:7010,c:4415,d:1205},{lvl:9,a:13050,b:7705,c:4850,d:1325},{lvl:10,a:14195,b:8380,c:5280,d:1440},{lvl:11,a:15320,b:9045,c:5695,d:1555},{lvl:12,a:16425,b:9695,c:6110,d:1665},{lvl:13,a:17510,b:10340,c:6510,d:1775},{lvl:14,a:18580,b:10970,c:6910,d:1885},{lvl:15,a:19635,b:11595,c:7300,d:1995},{lvl:16,a:20675,b:12205,c:7690,d:2100},{lvl:17,a:21705,b:12815,c:8070,d:2205},{lvl:18,a:22720,b:13415,c:8450,d:2305},{lvl:19,a:23725,b:14005,c:8820,d:2410},{lvl:20,a:24720,b:14595,c:9190,d:2510}]}
    ,{ "name": "Gaul - Trebuchet Smithy Upgrade","data":[{lvl:0,a:0,b:0,c:0,d:0},{lvl:1,a:1135,b:1710,c:770,d:130},{lvl:2,a:1980,b:2975,c:1340,d:230},{lvl:3,a:2735,b:4115,c:1850,d:315},{lvl:4,a:3445,b:5180,c:2330,d:400},{lvl:5,a:4120,b:6190,c:2785,d:475},{lvl:6,a:4765,b:7165,c:3220,d:550},{lvl:7,a:5390,b:8105,c:3645,d:625},{lvl:8,a:6000,b:9015,c:4055,d:695},{lvl:9,a:6590,b:9910,c:4455,d:765},{lvl:10,a:7170,b:10780,c:4850,d:830},{lvl:11,a:7740,b:11635,c:5230,d:895},{lvl:12,a:8300,b:12470,c:5610,d:960},{lvl:13,a:8845,b:13295,c:5980,d:1025},{lvl:14,a:9385,b:14110,c:6345,d:1085},{lvl:15,a:9920,b:14910,c:6705,d:1150},{lvl:16,a:10445,b:15700,c:7060,d:1210},{lvl:17,a:10965,b:16480,c:7410,d:1270},{lvl:18,a:11480,b:17250,c:7760,d:1330},{lvl:19,a:11985,b:18015,c:8100,d:1390},{lvl:20,a:12485,b:18765,c:8440,d:1445}]}

//    ,{ "name": "Teuton - Clubs", "data": [{lvl:0,a:95,b:75,c:40,d:40}]}
//   ,{ "name": "Teuton - Spearman", "data": [{lvl:0,a:145,b:70,c:85,d:40}]}
//    ,{ "name": "Teuton - Scout", "data": [{lvl:0,a:160,b:100,c:50,d:50}]}
//    ,{ "name": "Teuton - Paladin", "data": [{lvl:0,a:370,b:270,c:290,d:75}]}
//    ,{ "name": "Teuton - Teutonic Knight", "data": [{lvl:0,a:450,b:515,c:480,d:80}]}
//    ,{ "name": "Egyptian - Slave Militia", "data": [{lvl:0,a:45,b:60,c:30,d:15}]}
//    ,{ "name": "Egyptian - Ash Warden", "data": [{lvl:0,a:115,b:100,c:145,d:60}]}
//    ,{ "name": "Egyptian - Sopdu Explorer", "data": [{lvl:0,a:170,b:150,c:20,d:40}]}
//    ,{ "name": "Egyptian - Catas", "data": [{lvl:0,a:980,b:1510,c:660,d:100}]}
//    ,{ "name": "Egyptian - Chief", "data": [{lvl:0,a:34000,b:50000,c:34000,d:42000}]}
//    ,{ "name": "Egyptian - Khopesh Warrior", "data": [{lvl:0,a:170,b:180,c:220,d:80}]}
//    ,{ "name": "Egyptian - Ram", "data": [{lvl:0,a:995,b:575,c:340,d:80}]}
//    ,{ "name": "Egyptian - Resheph Chariot", "data": [{lvl:0,a:450,b:560,c:610,d:180}]}
//    ,{ "name": "Egyptian - Settler", "data": [{lvl:0,a:4560,b:5890,c:4370,d:4180}]}
//    ,{ "name": "Hun      - Mercenary", "data": [{lvl:0,a:130,b:80,c:40,d:40}]}
//    ,{ "name": "Hun      - Bowman", "data": [{lvl:0,a:140,b:110,c:60,d:60}]}
//    ,{ "name": "Hun      - Marksman", "data": [{lvl:0,a:320,b:350,c:330,d:50}]}
//    ,{ "name": "Hun      - Marauder", "data": [{lvl:0,a:450,b:560,c:610,d:140}]}
//    ,{ "name": "Hun      - Spotter", "data": [{lvl:0,a:170,b:150,c:20,d:40}]}
//    ,{ "name": "Hun      - Steppe Rider", "data": [{lvl:0,a:290,b:370,c:190,d:45}]}
//    ,{ "name": "Hun      - Ram", "data": [{lvl:0,a:1060,b:330,c:360,d:70}]}
//    ,{ "name": "Hun      - Catapult", "data": [{lvl:0,a:950,b:1280,c:620,d:60}]}
//    ,{ "name": "Hun      - settler", "data": [{lvl:0,a:6100,b:4600,c:4800,d:5400}]}
//    ,{ "name": "Hun      - Chief", "data": [{lvl:0,a:37200,b:27600,c:25200,d:27600}]}

];

var Images = {
    VillaLink : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAChElEQVQ4y6WTu2sUYRTFf9/M7MvsbhLdkOdG2IAoRlAQFcVG0UZUtLMSbGz9BxQECdY2KrZamE5QETWaIj5RCwsVXdC4McHJ7sZk9jHzzfewSMQHCIIHLvdRHC7ncIS1lv+Bw3/CO33l2cP0qtyWahB3NELlGAsGizYWYy3aWoxZ3lfKInQctxarlXflstfT3Vk8eXhdPoqtSKfc39jFn7NY7u1Iue1IDxw7H4WOv6RKUhlx7eEclaqkGVmma4ZK3TDzzTC3aPADS7VpiTXM1CQXbs6x0IycXE9xxGlGWqQSDoP9ee6+9PnWiOnNCxIuJF1B0hMkPejKCGpLkvGpr3StzrOmKwUgnFaoACj1ZRnqzXPnhc9CEFPIOiQ9SLrQmRbUA8n4lE9hTZ7SYBaxYp7TDPWymi6UBrL0dK/i+mSFeiDpTAtyaUEtkJy/fYB3C4coDWTJeL/Y2GwvfyAEqFiR9gzDg13ceu4zUw2ZqYbceOoTW8VQYQMXJ0ZJej+V9VqRxgJSKr7WA4q9OZLJBJcfHOHNfY00CqkVA90jbOjbThA2OXtjLVdPlMEKvFakrDZW+LWAYk+OTDoBFpSR7Nt4HG0N2mgMltnFCpuGdtGQbQ5eLNDn3LNes/7lUyTV2vVDGZHNOEI4GgcIlURbw3TtA7FRKBMT65ilKGBzcTeNuMXzj7vxZGN+eu+pO92pXEeHl3KF57k4rqC/GHpKK3rzwyij0dYwt/iZ1dk+XlUe8axcjhNvzz0RfwvT0UslHUqJNJJQSUYKG50dpf28+PyYifd3X0vFttkxG4l/TePoOWd+6/CewuT7iZfSsHN2zEqAfyYonRHz2riFttEJf8yqH/fvachWhEc1GPkAAAASdEVYdEVYSUY6T3JpZW50YXRpb24AMYRY7O8AAAAASUVORK5CYII=',
    DelBtn: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAANkPD9oTE9oZGdsiItwoKN0tLd42Nt83N99EROBFReFGRquqqba2tri4uLm5ubq6uru7u729veeFheiIiOqKiuuWluyXl++tre2urvCxscHAwMHBwcPCwcTExMbGxsvLy83Nzc/Pz9DQ0NHR0dLS0tPT09TT0tTU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+7FxfDHx/Pd3eHg3+Dg4OHh4eLi4uPj4+Tk5OXl5efm5ebm5ufn5+jn5uno5+jo6Onp6erq6uzs7O3t7e7u7u/v7/Lh4fPi4vDw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJkuGuQAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xLjb9TgnoAAABZElEQVQ4T83TaVOCQBjA8R7vMu2gw6PMUEvNFLEMBY8SQcpzWfj+34QW8Fps9G3/meeZ2dnfMLMvOLIOZAP2kSWl7UVXdEGh2BmROHttpcj9FuuAfEebkD7stdVYU6WMA0rjsTadTgUyVJoirsHMNM0vMlSzfwHa6b1gMqif7wOGKpRiHgCQMs0UgH2P0aBa2AWRRCICYGCMFvP+LrgNQjQKwRu0WMznG/CqaUtgXIcAQlf27TbglBEBxifG+vsJwPGbe78BtZ48MQy9i9BPGPx+CH+7YFB7ckGlIQwRQhJCAR8wDPgC5EQa8uW4A4ocvwQATLPJAHhAqd5YgyRCyTVovJx5AN0G8IKi63qXDJUiVC4cUBbaKsaYPJNObVcvHVBpiSNy3gEjsbYC0t9A4tagJ8tyhQxVb/UFXhAlUZSeRW88676iU8rncrn8PVl02UzWAdZDPEY6tRfd3fLn3dsBYFm/W9qe1AMEiXIAAAAASUVORK5CYII=',
    AddBtn: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAABz/Tauqqba2tri4uLm5ubq6uru7u729vYz/ncHAwMHBwcPCwcTExMbGxsvLy83Nzc/Pz9DQ0NHR0dLS0tPT09TT0tTU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Hg3+Dg4OHh4eLi4uPj4+Tk5OXl5efm5ebm5ufn5+jn5uno5+jo6Onp6erq6uzs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLxCy8AAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xLjb9TgnoAAABO0lEQVQ4T83Ta1OCQBSA4Ui7YJkhlhgpQiuLt0Tu6nL5/38KDwsCK6Zfe2fOQWafYcQZ79IbZUB4F6BOttiGORgM5w6kZKuWZa5mAgXi3PWhn2zV8lzb6FIgeZ4bBAGCYXItXIJdkiS/MEy7fwH0ThNwHEevkL+ZPl4DsY2kVgPwAPjsQxKRzXjwJ4gictivmoDnKeD5w2G/r8C361IAZ1V1oFgOgHhdHOXVwWRp+nEcLoqjPACbyUcOZA1tCSEGqb4D3BKyVUdtCoaKWoDyLVggTbXLQPt6aIDilzwDKrLCMFzAhCEAeoUsJD9RMEK6HUXRGobJ1sfPFMgz7MB9Azh4cgLGZWAoJViapinDMC1PT1ARNjA2PvF5qpC/xVwS+/2++AqLrdftUZC+tVvQfbbYXoo/79VugDQ9AlymXNWY9ab7AAAAAElFTkSuQmCC',
    Lumber: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURXUtCX4xCHwyC31BHIIxB4M1DIU0CJ09CZY/GZk/E4lHGZtDCZ1ACZ5ECJdMEp5LEJ9SFJpRMaJECKBFCaBKD6lKCaxRDa5UDqRWFKpcF61dFaxdF6lfGq5aHLNfFLZjFbtsGr1qGL1uHb5yHb13Kr1+LLx+L5FhS6NnTaR0Wbd6QLV/TaR0YcJyG8J0HsV2IMR1JsN4JMB5Ksp4Ich/Jr6QPb6TTq2ObqOBdK6PebCFYbGOcM2GKseQPdCTNNWjQNuvSNCuUN61Tdu9WcO2fMu4ftOxYdq+YuGxRufEU+3GUu3FVu7KWPHQWvHTXvDXX/XbX+HHZuXGYu7PYe7Va/HUYfXXY/XZY/XdZvrhZ/riZb6giruhkcu9isaxo8e6qsy7r86/rse4s8i4stLBjs/GrtHFptTEt9bKutjLwdTQzNrQzNvTzdza2Obi2+Xg3Ofj4unm5uvo5+3q6ezq6u/t6u7t6/Du6/Hv7vDv7/Ty8vf18/f39/n5+fv6+vv7+/39/f7+/v7+/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAObf/7wAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNv1OCegAAAC5SURBVChTY2hCA/gEChPMM2phAo3FmdZaRoYG6WCBxuqcaG0VfXk5cdEYsECei62xjYmiGC8bq1UZUKAmJSLcXlGcm4VJQE/JkqGpNN7M28dDmI1RQk9ZUkSTodI1WM3BS5WBT1dZhp9dMIkhKyTSk8vU0U5Bip+Hw6KggSE3MMqX2TnUT1qIUye7Duiw2lh/J3X3sABZjeQqkIsYmspTE4vSgtziKkBcmNPr80vANBBAnY4AaAJNTQCkoV5KZ+nwwwAAAABJRU5ErkJggg==',
    Clay: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURUMfH0ofHEshHUgiH04lJEwsKk8tLFUqJlglIFgrJ10tKFc9PWMoI280LGI+PW8+MXgvKWE/QnZDNHpINl1BQGJKSYU2LIg1LZs2LJo7LqA8L4BHNYpFN4lQO5FANZ9GOJlRPpxTPqNGNadFN6lFN69IOZ1JQJ5bQpxdRIlgXpFnWpN2eaZOQaFRSKBaQa1aR7VRQLdbRKJgRqFgWqFpWrZgRLFuTLh0T7l/YcRfRsRlSst3Uc51Ur2EabCGc7SLf8OFWcmDWs6MXtOJXNiGWtyLXsyNbsGZdcuYctOJZNWIYdqRYtuUYuKUZeSRYuSSY+eYZemZZeuaZuibZ+ybZ+6caOeiau6gaeyja+awcu6ydPKmbfaqb/iscfiucfWwcvSxc/W1dPW+evmwcvu7eI6IjJqHhKmclqmcmraQgb2ekLainLWqlLexsrG0ucWoj8K0rsO0r8S1r8K2ssvHyM3Jys7Q0tfPz9fQzdTS097d3OHVx+rfzODY0OHg4OTi4efj4unl4ujk4+nm4ujk5Oro5/Ty8vT09fb29vn5+fn6+vr6+/z8/Pz8/f39/v7+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK9FVM4AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNv1OCegAAAC/SURBVChTY5iABnAJdFWlp+XWtfdDBVqL7E30dXSNtcv6IQI53pbyyhKSYoJ5fUCBjsZC95T4QBdTXi621PIWhuZ8C0PrhOS4WCcWZg5xNU2GmkgfKyVFc+cARwYeKVU5PobqqOSYED1+BzN1ARUDGU5WhloP39AgDeGkxDBXGwV2JlGGrqYCO08joYjw6OhgWUaRSqC1PW0V2RlZtl5+/tLcpb0Ql3b3tDcUZ7pplfQi+6WzvhXmdGSAJjBhAgAIzGa08/4OcwAAAABJRU5ErkJggg==',
    Iron: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURT9FU0RJV0pSYkxRYE5WaFJXZFJWZ1hcalhecFlkeFhpfmBkc2FmeWRpdmNoe2RqeWRqfWZrfmhtf2lufl9ugl9xh2ZrgGdtgWRvhGpvg2lvhG1xg21yh2R8lmp+lnB0h3F1iXN4jHp+j3J9knZ8kXl+knl+k2yCmG6DnG+HmW6ImnCAj3yAj3GBlnCDlHuBlX2Bkn+DlH+EmYGElICFl4OHloCFmIGHm4CKlYOInISImIWKnomMl4+OkYiLmoiLm4mNn42QmI6Rn5SSkpOUmpqYmJuZmZ+cmoiNoIqPoYCSqIiVqI+cromespOXpJiaopiap5ibq5idr5ufr5yfrZ6mrZChs5iouJ+tvJ2tvaKor6mpq6urrqytr6CktKKmtaWotautsq+vsKyusamruKmsuqKyu7Gys5y2wKy1wbO3w7S2wLO8wre6wri8xri9x8LDxsLGysjJysnJy8rKy8vLzMzLzczMzcHI0sfO2M/P0MrQ2MrQ2czS2s/T3NLS09DR1NDR1dPS1NLS1dTS0tDR2NLT2NHX2tPW3dXW29na3Nzc3t3e39bZ4NXa4dnc4tzf4d7g5t/i5uDh4uHi4+Pj5ODj5+Lk6OLk6eXm6+Xn7ODo7Ofo6+3t7vPz9PX19vf3+Pj4+Pn5+vn6+vv7+/v8/Pz8/P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxp6OAAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNv1OCegAAADYSURBVChTY1iOBrAKLKuKjolNSk+eDBVYXF46rW9WTXW4ReGEpUCBJUVlM+oqan0ifLkyM9qXMywprp80saaywzsyjDNldtoChpKW6f3Te/MMlb10edvy1XMY3JsmzpyTzSPGJ8Hinyslq8XgFhDS2ikkribIxGwgr6ahyeBqLyOZoKBqzsEgnWpmLqfH4Gysr+pg5KHGyOaZFaQiqs1gGxgcZ2ltws2sGO8nLCASyuDiZGelY5NY4Khkys7KHzWPYe7UyT1T5i9fvrC7saG5axF2zyGB5csBMDdtNXr/aY4AAAAASUVORK5CYII=',
    Crop: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURVszHF02IGo6FmhAI2lCKGREMXRJKH9WMXZhV4dTHJtRC55VDZdaHYBVKoRWKoVaLolkO55nNqNVBaJZCLhsArpsBLdxD7t3C7N0ErV6FbtyFL10FZZtTaN+QMV7Asl6AsZ9Gb+AFaaKKaGLN7eFM7mIML2NOb2aV6KKc6WVf7GKZL2iWcuCAc6DA8+IAc6ICsOTGNqQA9qTBNqWCNqUDdCYHNaYGNabHsKNNcWRPMWYPM+ZPt+aK9eUM8WjMMejPtu+L+ujBOmjBeulA+6kAuqkDumpB+qoCeypDu+uFe+wDO62DeyzEuy2HvGpBvSuDPq/Dva1FfO1GPS3Gva+E+OyKO6+JOawMvG9I8CmSMu2S9WtUcCgZcGpasKuecu5ZcC4edG7YNGxde7DH/vDEerBI+zAIOzBOvHAJ/LBKfnFJvbXJdfAXc/Dad/Ib+fSR7OiiLCpj7utor6yobyyor24tsGpiMy1jcCxkcO0lsq3n8e6rMm9p829rM3GitrRk8PBs9XPq9DEt9DGudfJtdrOsdDNxtPSxtjXzN/Zzd3Y0ePcyuPe0ePe0+Le1uPg3OTg2+jh0ujm3ufk4+jn4+ro5u3r5+rp6Onp6erq6uzs7PHw7vLx7/b19PX19ff29ff39/f4+Pj39/n4+Pv7+vv7+/v7/P7+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANEUmbgAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNv1OCegAAADnSURBVChTY1gBBPNmTJkFokEAJNCekFgXX1gwd9nC5WCBObHpycoOdva99XmNi1cwLOpoiMrINEg1Vs3N9o3sW8FQE56vFJbl6qWj661W0jppBYN6jEVaSICno56bhKytTXQ3w9RplZLuKcF+zkaiUlq1VRMZlpRbW4r5BPm7iAjxqlh1rmBYXNylya8Y4WEozC2o0TIBaO2S+W1FPKYm4lwykxcsXw522PJSVnY+NhaOmTCXLm/iZGZkYBLohwksLQs105eTl26GCSzvyTEPdFJImg0TWLFiekWcdvViMBMiAAcrVgAANDVwejWSh/IAAAAASUVORK5CYII='
};

    function waitForKeyElements ( // credit to BrockA - https://gist.github.com/BrockA/2625891
    selectorTxt, /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
     actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
     bWaitOnce, /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
     iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined") {
            targetNodes = $(selectorTxt);
        } else {
            targetNodes = $(iframeSelector).contents().find (selectorTxt);
        }

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s).  Go through each and act if they
            are new.
        */
            targetNodes.each ( function () {
                var jThis = $(this);
                var alreadyFound = jThis.data ('alreadyFound') || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction (jThis);
                    if (cancelFound){
                        btargetsFound = false;
                    } else {
                        jThis.data ('alreadyFound', true);
                    }
                }
            } );
        }
        else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl = controlObj [controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval (timeControl);
            delete controlObj [controlKey]
        }
        else {
            //--- Set a timer, if needed.
            if ( ! timeControl) {
                timeControl = setInterval ( function () {waitForKeyElements (selectorTxt,actionFunction,bWaitOnce,iframeSelector);},300);
                controlObj [controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }

    function parseNpcTable(jNode) {
        //jNode.append("<table style='width:100%;border:2px solid black;margin-top:20px;padding:2px;'><tr><td></td></tr></table>");
        lumber = document.getElementsByName("desired0")[0];
        clay = document.getElementsByName("desired1")[0];
        iron = document.getElementsByName("desired2")[0];
        crop = document.getElementsByName("desired3")[0];

        BTable = Doc.New("table", [["cellpadding",5], ["cellspacing",1],["style","margin-top: 10px;"],["class",""]]);
        BTable.innerHTML = "<thead><tr><th colspan=4>Things to add</th><th>Amount/lvl</th><th></th></tr></thead>";
        BTableBody = Doc.New("tbody");
        BTable.appendChild(BTableBody);
        var BTableFoot = Doc.New("tfoot");
        BTable.appendChild(BTableFoot);

        var lumberImg = Doc.New("img",[['src',Images.Lumber]]);
        var clayImg = Doc.New("img",[['src',Images.Clay]]);
        var ironImg = Doc.New("img",[['src',Images.Iron]]);
        var cropImg = Doc.New("img",[['src',Images.Crop]]);

        var trfoot = Doc.New("tr",[['class',''],["style","padding-left: 10px;"]]);
        var tdCol16 = Doc.New("td",[['colspan','6'],['class','vil fc'],['style','']]);

        var tr = Doc.New("tr",[['class','']]);
        var trInitials = Doc.New("tr",[['class','npcrow']]);
        var tdCol14 = Doc.New("td",[['colspan','4'],['class','vil fc'],['style','']]);
        var tdCol5 = Doc.New("td",[['class','vil fc'],['style','']]);
        var tdCol6 = Doc.New("td",[['class','vil fc'],['style','text-align:center;']]);
        var tdDiv = Doc.New("div",[['class',''],['style','']]);
        var tdLeftDiv = Doc.New("div",[['class',''],['style','float:left;margin:3px 10px;']]);
        var tdRightDiv = Doc.New("div",[['class',''],['style','float:right;']]);

        var tdCol15Initials = Doc.New("td",[['colspan','5'],['class',''],['style','white-space:nowrap;text-align:right;padding-right:10px;']]);
        var tdCol6Initials = Doc.New("td",[['colspan','1'],['class',''],['style','text-align:center;']]);
        tdLeftDiv.innerHTML = "<b>Initial build order</b>"
        tdDiv.appendChild(tdLeftDiv);
        tdDiv.appendChild(tdRightDiv);
        var restDiv = Doc.New("div",[['class',''],['style','margin-top:5px;margin-left:20px']]);
        restDiv.innerHTML = "<b>Distribute remains as</b>"
        restNum = document.createTextNode("");
        tr.appendChild(tdCol14);
        tr.appendChild(tdCol5);
        tr.appendChild(tdCol6);
        trfoot.appendChild(tdCol16);
        tdCol15Initials.appendChild(tdDiv);
        trInitials.appendChild(tdCol15Initials);
        trInitials.appendChild(tdCol6Initials);

        tdSelect = Doc.New("select",[['id','buildSelect'],['style','margin:8px;width:315px']]);
        tdRest = Doc.New("select",[['id','buildRest'],['style','margin:8px 8px 8px 18px;width:315px']]);
        tdInput = Doc.New("input",[['type','text'],['id','buildInput'],['value','1'],['style','margin:8px;width:50px'],["onkeydown","return ( event.ctrlKey || event.altKey || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)||(95<event.keyCode && event.keyCode<106)||(event.keyCode==8) || (event.keyCode==9)||(event.keyCode>34 && event.keyCode<40)||(event.keyCode==46) )"]]);

        var initLumberValue = Doc.New("input",[['type','text'],['class','lumberValue'],['value',lumber.value],['style','font-size:75%;border:none;margin:2px;width:42px']]);
        var initClayValue = Doc.New("input",[['type','text'],['class','clayValue'],['value',clay.value],['style','font-size:75%;border:none;margin:2px;width:42px']]);
        var initIronValue = Doc.New("input",[['type','text'],['class','ironValue'],['value',iron.value],['style','font-size:75%;border:none;margin:2px;width:42px']]);
        var initCropValue = Doc.New("input",[['type','text'],['class','cropValue'],['value',crop.value],['style','font-size:75%;border:none;margin:2px;width:42px']]);

        var tdAddBtn = Doc.New("img",[['src',Images.AddBtn],['width','32px'],['height','32px'],["id",'addBtn']]);
        //var ActivateImg = Doc.New("img",[['src',Images.Activate],['width','85px'],['height','25px'],["id",'a_'+ListID]]);
        var tdDelBtn = Doc.New("img",[['src',Images.DelBtn],['width','32px'],['height','32px'],["id",'a_'+ListID]]);

        var defaultOpt = document.createElement('option');
        defaultOpt.value = "-";
        defaultOpt.innerHTML = "-";
        tdRest.appendChild(defaultOpt);
        tdCol16.appendChild(restDiv);

        npcData.forEach(function(entry) {
            var opt = document.createElement('option');
            var opt2 = document.createElement('option');
            opt.value = JSON.stringify(entry.data);
            opt.innerHTML = entry.name;
            opt2.value = opt.value;
            opt2.innerHTML = opt.innerHTML;
            //if (i==3) opt.selected = true;
            tdSelect.appendChild(opt);
            tdRest.appendChild(opt2);
        });

        tdCol14.appendChild(tdSelect);
        tdCol16.appendChild(tdRest);
        tdCol16.appendChild(restNum);
        tdCol5.appendChild(tdInput);
        tdAddBtn.addEventListener ("click", function(){ addBuild(this.id);} , false);
        tdDelBtn.addEventListener ("click", function(){ delBuild(this.id);} , false);
        tdRest.addEventListener ("change", function(){ recalcNPC();} , false);
        tdCol6.appendChild(tdAddBtn);

        tdCol15Initials.appendChild(lumberImg);
        tdCol15Initials.appendChild(initLumberValue);
        tdCol15Initials.appendChild(clayImg);
        tdCol15Initials.appendChild(initClayValue);
        tdCol15Initials.appendChild(ironImg);
        tdCol15Initials.appendChild(initIronValue);
        tdCol15Initials.appendChild(cropImg);
        tdCol15Initials.appendChild(initCropValue);
        tdCol6Initials.appendChild(tdDelBtn);

        BTableBody.appendChild(tr);
        BTableBody.appendChild(trInitials);
        BTableFoot.appendChild(trfoot);

        //alert("yo");
        jNode.append(BTable);
        tdSelect.selectedIndex = GM_getValue(dataIndex+"_lastBuild");
        //tdRest.selectedIndex = GM_getValue(dataIndex+"_lastRest");
        var lvl = GM_getValue(dataIndex+"_lastLvl");
        //alert(lvl);
        if (typeof lvl !== 'undefined' && lvl !== '') {
            tdInput.value = lvl;
        } else {
            tdInput.value = '7';
        }
    }

    function addBuild(){

        var data = JSON.parse(tdSelect.value);
        var label = "";
        ListID++;
        var valueIndex;
        var lumber;
        var clay;
        var iron;
        var crop;

        if (data[0].a == 0 ){ // Building selected
            label = tdSelect.options[tdSelect.selectedIndex].text + ' lvl ' + tdInput.value;
            if(!(parseInt(tdInput.value) >= 1 && parseInt(tdInput.value) <= 20)) return;
            valueIndex = parseInt(tdInput.value);
        } else { // troops selected
            label = tdInput.value + ' ' + tdSelect.options[tdSelect.selectedIndex].text;
            if(!parseInt(tdInput.value) >= 1) return;
            valueIndex = 0;
        }
        GM_setValue(dataIndex+"_lastBuild",tdSelect.selectedIndex);
        GM_setValue(dataIndex+"_lastLvl",tdInput.value);

        if (valueIndex == 0) {
            lumber = parseInt(data[0].a) * parseInt(tdInput.value);
            clay = parseInt(data[0].b) * parseInt(tdInput.value);
            iron = parseInt(data[0].c) * parseInt(tdInput.value);
            crop = parseInt(data[0].d) * parseInt(tdInput.value);
        } else {
            lumber = parseInt(data[parseInt(tdInput.value)].a);
            clay = parseInt(data[parseInt(tdInput.value)].b);
            iron = parseInt(data[parseInt(tdInput.value)].c);
            crop = parseInt(data[parseInt(tdInput.value)].d);
        }
        //alert(label);
        var lumberImg = Doc.New("img",[['src',Images.Lumber]]);
        var clayImg = Doc.New("img",[['src',Images.Clay]]);
        var ironImg = Doc.New("img",[['src',Images.Iron]]);
        var cropImg = Doc.New("img",[['src',Images.Crop]]);

        var tr = Doc.New("tr",[['class','npcrow']]);
        var tdDiv = Doc.New("div",[['class',''],['style','']]);
        var tdLeftDiv = Doc.New("div",[['class',''],['style','float:left;margin:3px 10px;']]);
        var tdRightDiv = Doc.New("div",[['class',''],['style','float:right;']]);
        var tdDelBtn = Doc.New("img",[['src',Images.DelBtn],['width','32px'],['height','32px'],["id",'del_'+ListID]]);
        tdDelBtn.addEventListener ("click", function(){ delBuild(this.id);} , false);
        var LumberValue = Doc.New("input",[['type','text'],['class','lumberValue'],['value',lumber],['style','font-size:75%;border:none;margin:2px;width:42px']]);
        var ClayValue = Doc.New("input",[['type','text'],['class','clayValue'],['value',clay],['style','font-size:75%;border:none;margin:2px;width:42px']]);
        var IronValue = Doc.New("input",[['type','text'],['class','ironValue'],['value',iron],['style','font-size:75%;border:none;margin:2px;width:42px']]);
        var CropValue = Doc.New("input",[['type','text'],['class','cropValue'],['value',crop],['style','font-size:75%;border:none;margin:2px;width:42px']]);

        var tdCol15 = Doc.New("td",[['colspan','5'],['class',''],['style','white-space:nowrap;text-align:right;padding-right:10px;']]);
        var tdCol6 = Doc.New("td",[['colspan','1'],['class',''],['style','text-align:center;']]);

        tdRightDiv.appendChild(lumberImg);
        tdRightDiv.appendChild(LumberValue);
        tdRightDiv.appendChild(clayImg);
        tdRightDiv.appendChild(ClayValue);
        tdRightDiv.appendChild(ironImg);
        tdRightDiv.appendChild(IronValue);
        tdRightDiv.appendChild(cropImg);
        tdRightDiv.appendChild(CropValue);
        tdCol6.appendChild(tdDelBtn);

        tdLeftDiv.innerHTML = "<b>"+ label +"</b>"
        tdDiv.appendChild(tdLeftDiv);
        tdDiv.appendChild(tdRightDiv);
        tdCol15.appendChild(tdDiv);
        tr.appendChild(tdCol15);
        tr.appendChild(tdCol6);
        BTableBody.appendChild(tr);
        recalcNPC();

    };
    function delBuild(btnId){
        for (let row of BTableBody.rows){
            if (row.classList.contains("npcrow")) {
                var checkForId = document.getElementById(btnId);
                if (row.contains(checkForId)) row.parentNode.removeChild(row);
            }
        };
        recalcNPC();
    };
    function recalcNPC(){
        //alert(BTableBody.rows.length);
        var lumberSum = 0;
        var claySum = 0;
        var ironSum = 0;
        var cropSum = 0;

        for (let row of BTableBody.rows){
            if (row.classList.contains("npcrow")) {
                //alert("|"+row.getElementsByClassName("clayValue")[0].value+"|");
                lumberSum += +row.getElementsByClassName("lumberValue")[0].value;
                claySum += +row.getElementsByClassName("clayValue")[0].value;
                ironSum += +row.getElementsByClassName("ironValue")[0].value;
                cropSum += +row.getElementsByClassName("cropValue")[0].value;
            }
        };
        //alert(claySum);
        lumber.value = lumberSum;
        clay.value = claySum;
        iron.value = ironSum;
        crop.value = cropSum;
        GM_setValue(dataIndex+"_lastRest",tdRest.selectedIndex);
        exchangeResources.calculateRest();
        remain = parseInt(document.getElementById("remain").innerText);
        calcRemains();
    };
    function calcRemains(){
        //alert(remain);
        remain = parseInt(document.getElementById("remain").innerText);
        restNum.nodeValue = "";

        //debugger;
        var data = JSON.parse(tdRest.value);
        var resultingNr = 0;
        var lumberPercent;
        var clayPercent;
        var ironPercent;
        var cropPercent;
        var totSum;
        var lumberAddSum = 0;
        var clayAddSum = 0;
        var ironAddSum = 0;
        var cropAddSum = 0;
        var lumberRestCost = 0

        if (tdRest.selectedIndex == 0 || remain <= 0) {
            restNum.nodeValue = "";
            if (remain <= 0) restNum.nodeValue = "Rest is negative";
        } else {
            if (data[0].a == 0 ){ // Building selected
                lumberRestCost = +data[1].a;
                totSum = +data[1].a + +data[1].b + +data[1].c + +data[1].d;
                lumberPercent = data[1].a / totSum;
                clayPercent = data[1].b / totSum;
                ironPercent = data[1].c / totSum;
                cropPercent = data[1].d / totSum;
            } else { // troops selected
                lumberRestCost = +data[0].a;
                totSum = +data[0].a + +data[0].b + +data[0].c + +data[0].d;
                lumberPercent = data[0].a / totSum;
                clayPercent = data[0].b / totSum;
                ironPercent = data[0].c / totSum;
                cropPercent = data[0].d / totSum;

            }
            var lumberRestToAdd = Math.floor(remain*lumberPercent);
            var clayRestToAdd = Math.floor(remain*clayPercent);
            var ironRestToAdd = Math.floor(remain*ironPercent);
            var cropRestToAdd = Math.floor(remain*cropPercent);
            lumber.value = +lumber.value + +lumberRestToAdd;
            clay.value = +clay.value + +clayRestToAdd;
            iron.value = +iron.value + +ironRestToAdd;
            crop.value = +crop.value + +cropRestToAdd;
            var restResultingNum = +lumberRestToAdd / +lumberRestCost
            restNum.nodeValue = restResultingNum.toFixed(2) + " pcs.";
        }
            exchangeResources.calculateRest();
    }
    var Doc = {
        New : function(tt,attrs){
            var newElement = document.createElement(tt);
            if (attrs !== undefined) {
                for(var xi = 0; xi < attrs.length; xi++) {
                    newElement.setAttribute(attrs[xi][0], attrs[xi][1]);
                }
            }
            return newElement;
        },

        Element : function(eid){
            return document.getElementById(eid);
        }
    }

    function getUserId(){
    var navi = document.getElementById("sidebarBoxActiveVillage");
    var navi_p = navi.getElementsByClassName("playerName")[0];
    //var profile_link = navi_p.getElementsByTagName("a")[1].innerText;
    // alert(profile_link);
    return navi_p.innerText;
    };

    var user_id = getUserId();
    var dataIndex = window.location.hostname.split(".")[0]+"_"+user_id+"_npc";

    waitForKeyElements ("#build.exchangeResources", parseNpcTable);
